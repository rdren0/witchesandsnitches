// xlsx-js-style is a drop-in fork of SheetJS that also writes cell styling
// (the community `xlsx` build silently drops fonts/fills/borders).
import * as XLSX from "xlsx-js-style";
import { jsPDF } from "jspdf";
import { NPC_DATA, buildNpcUnlocks } from "../../SharedData/npcData";
import { allSkills, abilities } from "../../SharedData/data";
import { calculateFinalAbilityScores } from "../CharacterManager/utils/characterUtils";

/* ------------------------------------------------------------------ */
/* Shared value helpers                                                */
/* ------------------------------------------------------------------ */

const isPlainObject = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v);

// Turn any value into something readable inside a single cell / line.
export const displayValue = (value) => {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "string" || typeof v === "number")) {
      return value.join(", ");
    }
    return JSON.stringify(value, null, 2);
  }
  if (isPlainObject(value)) return JSON.stringify(value, null, 2);
  return String(value);
};

const titleize = (key) =>
  String(key)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

// Format a list field (e.g. text[] of skill keys) into a readable, comma-
// separated, title-cased string. Falls back to displayValue for other shapes.
const formatList = (value) => {
  if (Array.isArray(value)) {
    if (!value.length) return "";
    if (value.every((v) => typeof v === "string")) {
      return value.map(titleize).join(", ");
    }
    return displayValue(value);
  }
  return displayValue(value);
};

const sanitizeSheetName = (name) =>
  name.replace(/[\\/?*[\]:]/g, " ").slice(0, 31) || "Sheet";

/* ------------------------------------------------------------------ */
/* Worksheet styling (xlsx-js-style)                                   */
/* ------------------------------------------------------------------ */

const COLORS = {
  header: "4B3869", // deep purple
  section: "EDE7F6", // light lavender
  band: "F6F3FA", // very light row band
  border: "D7CDE8",
};

const thinBorder = {
  top: { style: "thin", color: { rgb: COLORS.border } },
  bottom: { style: "thin", color: { rgb: COLORS.border } },
  left: { style: "thin", color: { rgb: COLORS.border } },
  right: { style: "thin", color: { rgb: COLORS.border } },
};

const HEADER_STYLE = {
  font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
  fill: { patternType: "solid", fgColor: { rgb: COLORS.header } },
  alignment: { vertical: "center", horizontal: "left" },
  border: thinBorder,
};

const SECTION_STYLE = {
  font: { bold: true, sz: 12, color: { rgb: "2E1A47" } },
  fill: { patternType: "solid", fgColor: { rgb: COLORS.section } },
  alignment: { vertical: "center" },
};

const WRAP_STYLE = { alignment: { wrapText: true, vertical: "top" } };

// Column widths sized to content (clamped so nothing gets absurdly wide).
const autoColWidths = (aoa) => {
  const widths = [];
  aoa.forEach((row) => {
    row.forEach((cell, c) => {
      const longestLine =
        cell == null
          ? 0
          : String(cell)
              .split("\n")
              .reduce((m, s) => Math.max(m, s.length), 0);
      widths[c] = Math.max(widths[c] || 8, Math.min(longestLine + 2, 70));
    });
  });
  return widths.map((wch) => ({ wch }));
};

// Build a styled worksheet from an array-of-arrays plus row/column metadata.
const makeSheet = (
  aoa,
  { headerRows = [], sectionRows = [], wrapCols = [] } = {}
) => {
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = autoColWidths(aoa);
  if (!ws["!ref"]) return ws;

  const range = XLSX.utils.decode_range(ws["!ref"]);
  const headerSet = new Set(headerRows);
  const sectionSet = new Set(sectionRows);
  const wrapSet = new Set(wrapCols);

  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      if (!ws[addr]) ws[addr] = { t: "s", v: "" };
      let style = {};
      if (headerSet.has(r)) style = { ...HEADER_STYLE };
      else if (sectionSet.has(r)) style = { ...SECTION_STYLE };
      if (wrapSet.has(c)) style = { ...style, ...WRAP_STYLE };
      if (Object.keys(style).length) ws[addr].s = style;
    }
  }
  return ws;
};

// Accumulates rows while tracking which are headers/section titles, so the
// styling can be applied without brittle row-index bookkeeping at the call site.
const sheetBuilder = () => {
  const aoa = [];
  const headerRows = [];
  const sectionRows = [];
  return {
    header(cells) {
      headerRows.push(aoa.length);
      aoa.push(cells);
    },
    section(cells) {
      sectionRows.push(aoa.length);
      aoa.push(cells);
    },
    row(cells) {
      aoa.push(cells);
    },
    blank() {
      aoa.push([]);
    },
    build(opts) {
      return makeSheet(aoa, { headerRows, sectionRows, ...opts });
    },
  };
};

// Internal id / ownership columns that are noise in a human-readable table.
const HIDDEN_COLUMNS = new Set([
  "id",
  "character_id",
  "discord_user_id",
  "user_id",
  "created_by_character_id",
  "character_name",
]);

// Turn an array of row objects into an array-of-arrays table (header + rows),
// dropping internal id/ownership columns.
const tableAoA = (rows) => {
  if (!rows || rows.length === 0) return [];
  const keys = [];
  rows.forEach((r) =>
    Object.keys(r).forEach((k) => {
      if (!HIDDEN_COLUMNS.has(k) && !keys.includes(k)) keys.push(k);
    })
  );
  const header = keys.map(titleize);
  const body = rows.map((r) => keys.map((k) => displayValue(r[k])));
  return [header, ...body];
};

// Build a styled worksheet from an array of row objects (a "table").
const objectsToSheet = (rows) => {
  const aoa = tableAoA(rows);
  return aoa.length ? makeSheet(aoa, { headerRows: [0] }) : null;
};

/* ------------------------------------------------------------------ */
/* Friendly character summary                                          */
/* ------------------------------------------------------------------ */

// Top-level scalar fields worth surfacing front-and-centre, in order.
const SUMMARY_FIELDS = [
  ["name", "Name"],
  ["level", "Level"],
  ["school_year", "School Year"],
  ["house", "House"],
  ["casting_style", "Casting Style"],
  ["subclass", "Subclass"],
  ["innate_heritage", "Innate Heritage"],
  ["background", "Background"],
  ["hit_points", "Max Hit Points"],
  ["current_hit_points", "Current Hit Points"],
  ["temp_hp", "Temporary HP"],
  ["ac", "Armor Class"],
  ["initiative_ability", "Initiative Ability"],
  ["wand_type", "Wand Type"],
  ["game_session", "Game Session"],
  ["created_at", "Created"],
  ["updated_at", "Last Updated"],
];

/* ------------------------------------------------------------------ */
/* Derived values (mirror the in-app calculations)                     */
/* ------------------------------------------------------------------ */

// Base AC by casting style, matching CharacterSheet.getBaseArmorClass.
const BASE_AC_BY_STYLE = {
  Willpower: 13,
  "Willpower Caster": 15,
  Technique: 10,
  "Technique Caster": 10,
  Intellect: 11,
  "Intellect Caster": 11,
  Vigor: 8,
  "Vigor Caster": 8,
};

// `ac` is stored as { override, modifier }. The displayed value is
// (override ?? baseAC) + modifier, where baseAC = styleBase + dex modifier.
export const computeArmorClass = (character) => {
  const dex = Number(effectiveScores(character).dexterity) || 10;
  const dexMod = Math.floor((dex - 10) / 2);
  const styleBase = BASE_AC_BY_STYLE[character.casting_style] ?? 11;
  const baseAC = styleBase + dexMod;

  const ac = isPlainObject(character.ac) ? character.ac : {};
  const modifier = Number(ac.modifier) || 0;
  const hasOverride = ac.override !== null && ac.override !== undefined;
  return (hasOverride ? Number(ac.override) : baseAC) + modifier;
};

const abilityModifier = (score) => Math.floor(((Number(score) || 10) - 10) / 2);
const fmtMod = (m) => (m >= 0 ? `+${m}` : `${m}`);

// Effective ability scores (base + heritage/house/feat/ASI bonuses), using the
// app's own calculation so modifiers/saves/skills match the live sheet. Falls
// back to the raw stored scores if the calculation can't run.
const effectiveScores = (character) => {
  try {
    const final = calculateFinalAbilityScores(character);
    if (isPlainObject(final) && Object.keys(final).length) return final;
  } catch {
    // fall through to raw scores
  }
  return character.ability_scores || character.base_ability_scores || {};
};
// Standard 5e proficiency bonus, matching CharacterSheet (ceil(level/4) + 1).
const proficiencyBonus = (level) => Math.ceil((Number(level) || 1) / 4) + 1;

// Saving-throw proficiencies granted by casting style (accepts both the bare
// and "… Caster" forms the data uses). Feat-granted saves aren't included.
const SAVE_PROFS_BY_STYLE = {
  Willpower: ["constitution", "charisma"],
  "Willpower Caster": ["constitution", "charisma"],
  Technique: ["dexterity", "wisdom"],
  "Technique Caster": ["dexterity", "wisdom"],
  Intellect: ["wisdom", "intelligence"],
  "Intellect Caster": ["wisdom", "intelligence"],
  Vigor: ["constitution", "strength"],
  "Vigor Caster": ["constitution", "strength"],
};

// Per-ability score, modifier, and saving-throw modifier.
const computeAbilityRows = (character) => {
  const scores = effectiveScores(character);
  if (!isPlainObject(scores) || !Object.keys(scores).length) return [];
  const pb = proficiencyBonus(character.level);
  const saveProfs = SAVE_PROFS_BY_STYLE[character.casting_style] || [];
  return abilities.map((ab) => {
    const score = scores[ab.name] ?? 10;
    const mod = abilityModifier(score);
    const isProf = saveProfs.includes(ab.name);
    return {
      name: ab.displayName,
      score,
      mod,
      save: mod + (isProf ? pb : 0),
      saveProf: isProf,
    };
  });
};

// Per-skill modifier (ability mod + proficiency/expertise), with proficiency tag.
// The DB stores skill proficiencies as display names (e.g. "Potion Making"),
// so we match on both the display name and the camelCase key, case-insensitively.
const computeSkillRows = (character) => {
  const scores = effectiveScores(character);
  const pb = proficiencyBonus(character.level);
  const toSet = (arr) =>
    new Set(
      (Array.isArray(arr) ? arr : []).map((s) => String(s).toLowerCase().trim())
    );
  const profSet = toSet(character.skill_proficiencies);
  const expSet = toSet(character.skill_expertise);
  const abbr = (name) =>
    abilities.find((a) => a.name === name)?.abbr || name.slice(0, 3).toUpperCase();
  return allSkills.map((sk) => {
    const keys = [sk.displayName, sk.name].map((k) => k.toLowerCase());
    const isExp = keys.some((k) => expSet.has(k));
    const isProf = keys.some((k) => profSet.has(k)) || isExp;
    const level = isExp ? 2 : isProf ? 1 : 0;
    const mod = abilityModifier(scores[sk.ability]) + level * pb;
    return {
      name: sk.displayName,
      ability: abbr(sk.ability),
      mod,
      proficiency: isExp ? "Expertise" : isProf ? "Proficient" : "",
    };
  });
};

// A downtime sheet counts as "submitted" once it's no longer a draft / has a
// submission timestamp.
const isSubmittedSheet = (s) => s.is_draft === false || !!s.submitted_at;

// All feats the character has selected (standard, additional, and feats chosen
// in place of an ASI).
const collectFeats = (character) => {
  const feats = [];
  if (Array.isArray(character.standard_feats)) feats.push(...character.standard_feats);
  if (Array.isArray(character.additional_feats)) feats.push(...character.additional_feats);
  const asi = character.asi_choices || {};
  Object.values(asi).forEach((choice) => {
    if (choice?.type === "feat" && choice.selectedFeat) {
      feats.push(choice.selectedFeat);
    }
  });
  return [...new Set(feats.filter(Boolean))];
};

// Selected metamagic options. Stored as { "Quickened Spell": true, ... }.
const collectMetamagic = (character) => {
  const mm = character.metamagic_choices;
  if (isPlainObject(mm)) return Object.keys(mm).filter((k) => mm[k] === true);
  if (Array.isArray(character.metamagic)) return character.metamagic;
  return [];
};

// Wizarding currency: 1 Galleon = 17 Sickles = 493 Knuts; 1 Sickle = 29 Knuts.
const KNUTS_PER_GALLEON = 493;
const KNUTS_PER_SICKLE = 29;

export const getMoneyKnuts = (related) =>
  Number(related?.character_money?.[0]?.total_knuts) || 0;

export const formatMoney = (knuts) => {
  const galleons = Math.floor(knuts / KNUTS_PER_GALLEON);
  const afterG = knuts % KNUTS_PER_GALLEON;
  const sickles = Math.floor(afterG / KNUTS_PER_SICKLE);
  const leftover = afterG % KNUTS_PER_SICKLE;
  return `${galleons} Galleons, ${sickles} Sickles, ${leftover} Knuts`;
};

// Sort spell progress rows into the requested buckets. Buckets are mutually
// exclusive, in priority order: mastered > attempted once > researched > failed.
export const categorizeSpells = (rows) => {
  const mastered = [];
  const attemptedOnce = [];
  const researched = [];
  const failedOnly = [];

  (rows || []).forEach((s) => {
    const name = s.spell_name || s.name || s.spell || "Unknown spell";
    const successes = Number(s.successful_attempts) || 0;
    const crit = !!s.has_natural_twenty;
    const failed = !!s.has_failed_attempt;
    const isResearched = !!s.researched;

    if (successes >= 2) mastered.push({ name, crit });
    else if (successes === 1) attemptedOnce.push(name);
    else if (isResearched) researched.push(name);
    else if (failed) failedOnly.push(name);
  });

  const byName = (a, b) => a.localeCompare(b);
  mastered.sort((a, b) => a.name.localeCompare(b.name));
  attemptedOnce.sort(byName);
  researched.sort(byName);
  failedOnly.sort(byName);

  return { mastered, attemptedOnce, researched, failedOnly };
};

const RESULT_LABELS = {
  success: "Success",
  failure: "Failed",
  failed: "Failed",
  pending: "Pending",
  partial: "Partial",
  npc_override: "Success (NPC override)",
};
const resultLabel = (r) => RESULT_LABELS[r] || (r ? titleize(r) : "Pending");

// Sort years/semesters numerically when possible, else alphabetically.
const sortKey = (a, b) => {
  const na = Number(a);
  const nb = Number(b);
  if (!isNaN(na) && !isNaN(nb)) return na - nb;
  return String(a).localeCompare(String(b));
};

// Group downtime sheets by school year, then semester, pulling out each
// activity (with its review result) and each NPC interaction result.
// Draft sheets are excluded — only submitted downtime is exported.
export const summarizeDowntime = (rows) => {
  const yearMap = new Map();

  (rows || [])
    .filter(isSubmittedSheet)
    .forEach((sheet) => {
    const year = sheet.school_year ?? "Unknown";
    const semester = sheet.semester ?? "Unknown";
    if (!yearMap.has(year)) yearMap.set(year, new Map());
    const semMap = yearMap.get(year);
    if (!semMap.has(semester)) {
      semMap.set(semester, { activities: [], npcs: [] });
    }
    const bucket = semMap.get(semester);

    (sheet.activities || []).forEach((a) => {
      if (!a || !a.activity) return;
      const successes = Array.isArray(a.successes)
        ? a.successes.filter(Boolean).length
        : null;
      bucket.activities.push({
        name: a.activity,
        result: resultLabel(a.admin_status),
        successes,
        notes: a.notes || "",
        rewards: a.admin_rewards || "",
      });
    });

    (sheet.relationships || []).forEach((rel, i) => {
      if (!rel || !rel.npcName || !rel.npcName.trim()) return;
      const assignment = sheet.roll_assignments?.[`relationship${i + 1}`] || {};
      const rawResult = assignment.result;
      bucket.npcs.push({
        name: rel.npcName.trim(),
        result: resultLabel(rawResult),
        // A successful interaction may come with a DM-written blurb (their
        // review note for that NPC interaction).
        success: rawResult === "success" || rawResult === "npc_override",
        blurb: (assignment.adminNotes || "").trim(),
        notes: rel.notes || "",
      });
    });
  });

  return [...yearMap.keys()].sort(sortKey).map((year) => ({
    year,
    semesters: [...yearMap.get(year).keys()].sort(sortKey).map((semester) => ({
      semester,
      ...yearMap.get(year).get(semester),
    })),
  }));
};

// For each NPC the character has unlocked through successful downtime
// interactions, pull the unlocked story scenes from npcData.js. Uses the same
// canonical unlock logic as the in-app gallery (approved sheets, success
// results only), so the export matches what the player saw on the site.
export const npcStories = (downtimeRows) => {
  const submitted = (downtimeRows || []).filter(isSubmittedSheet);
  const unlocks = buildNpcUnlocks(submitted); // { canonicalName: level 1-5 }

  return Object.entries(unlocks)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, level]) => {
      const data = NPC_DATA[name] || {};
      const scenes = [];
      for (let lvl = 1; lvl <= level; lvl++) {
        const entry = data[lvl] || {};
        scenes.push({
          level: lvl,
          scene: entry.scene || "",
          romanceOnly: !!entry.romanceOnly,
        });
      }
      return { name, level, scenes };
    });
};

// character_notes.notes is a JSON-stringified array of { title, content }
// entries (content is markdown). Parse it back into readable entries.
export const parseNotes = (notesRows) => {
  const entries = [];
  (notesRows || []).forEach((row) => {
    const raw = row?.notes;
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((entry) => {
          if (entry && (entry.title || entry.content)) {
            entries.push({
              title: entry.title || "Untitled note",
              content: entry.content || "",
            });
          }
        });
        return;
      }
    } catch {
      // Not JSON — treat the whole thing as a single plain-text note.
    }
    entries.push({ title: "Note", content: String(raw) });
  });
  return entries;
};

/* ------------------------------------------------------------------ */
/* Excel workbook (one per character)                                  */
/* ------------------------------------------------------------------ */

export const buildCharacterWorkbook = (bundle) => {
  const { character, related } = bundle;
  const wb = XLSX.utils.book_new();

  const append = (sheet, label) =>
    XLSX.utils.book_append_sheet(wb, sheet, sanitizeSheetName(label));

  // 1. Summary — character overview, ability scores, and spell progress all on
  //    one tab. (AC is the computed end value, not the raw object.)
  const summary = sheetBuilder();
  summary.header(["Field", "Value"]);
  SUMMARY_FIELDS.forEach(([key, label]) => {
    const value = key === "ac" ? computeArmorClass(character) : character[key];
    if (value !== undefined && value !== null) {
      summary.row([label, displayValue(value)]);
    }
  });

  // Ability scores — score, modifier, and saving-throw modifier.
  const abilityRows = computeAbilityRows(character);
  if (abilityRows.length) {
    summary.blank();
    summary.section(["Ability Scores", "", "", ""]);
    summary.header(["Ability", "Score", "Modifier", "Saving Throw"]);
    abilityRows.forEach((a) =>
      summary.row([
        a.name,
        a.score,
        fmtMod(a.mod),
        `${fmtMod(a.save)}${a.saveProf ? " (proficient)" : ""}`,
      ])
    );
  }

  // Skills — every skill with its modifier and proficiency status.
  const skillRows = computeSkillRows(character);
  if (skillRows.length) {
    summary.blank();
    summary.section(["Skills", "", "", ""]);
    summary.header(["Skill", "Ability", "Modifier", "Proficiency"]);
    skillRows.forEach((s) =>
      summary.row([s.name, s.ability, fmtMod(s.mod), s.proficiency])
    );
  }

  // Tool proficiencies
  const tools = formatList(character.tool_proficiencies);
  if (tools) {
    summary.blank();
    summary.section(["Tool Proficiencies", ""]);
    summary.row([tools, ""]);
  }

  // Features & Feats
  const feats = collectFeats(character);
  if (feats.length) {
    summary.blank();
    summary.section(["Features & Feats", ""]);
    feats.forEach((f) => summary.row([f, ""]));
  }

  // Metamagic options
  const metamagic = collectMetamagic(character);
  if (metamagic.length) {
    summary.blank();
    summary.section(["Metamagic Options", ""]);
    metamagic.forEach((m) => summary.row([m, ""]));
  }

  // Resources — points and spell slots from character_resources.
  const res = related.character_resources?.[0];
  if (res && Object.keys(res).length) {
    summary.blank();
    summary.section(["Resources", ""]);
    const pointRows = [
      ["Inspiration", res.inspiration ? "Yes" : "No"],
      ["Sorcery Points", res.sorcery_points],
      ["Max Sorcery Points", res.max_sorcery_points],
      ["Corruption Points", res.corruption_points],
    ];
    pointRows.forEach(([label, val]) => {
      if (val !== undefined && val !== null) summary.row([label, displayValue(val)]);
    });

    const slotRows = [];
    for (let lvl = 1; lvl <= 9; lvl++) {
      const current = res[`spell_slots_${lvl}`] || 0;
      const max = res[`max_spell_slots_${lvl}`] || 0;
      if (current || max) slotRows.push([`Level ${lvl}`, current, max]);
    }
    if (slotRows.length) {
      summary.header(["Spell Slots", "Current", "Max"]);
      slotRows.forEach((r) => summary.row(r));
    }
  }

  append(summary.build(), "Summary");

  // 2. Spells — each progress group gets its own clearly-labelled section.
  const spells = categorizeSpells(related.spell_progress_summary);
  const sp = sheetBuilder();
  sp.header(["Spell", "Status"]);
  const spellSection = (title, items, render) => {
    sp.section([title, ""]);
    if (!items.length) sp.row(["(none)", ""]);
    else items.forEach((item) => sp.row(render(item)));
  };
  const critMastered = spells.mastered.filter((m) => m.crit);
  const regularMastered = spells.mastered.filter((m) => !m.crit);
  spellSection("Crit Mastered", critMastered, (m) => [
    m.name,
    "Critical Success",
  ]);
  spellSection("Mastered", regularMastered, (m) => [m.name, "Mastered"]);
  spellSection("Attempted Once", spells.attemptedOnce, (n) => [n, "1 success"]);
  spellSection("Researched", spells.researched, (n) => [n, "Researched"]);
  spellSection("Attempted but Failed", spells.failedOnly, (n) => [
    n,
    "Attempted but failed",
  ]);
  append(sp.build(), "Spells");

  // 3. Inventory — money summary first, then the item table.
  const knuts = getMoneyKnuts(related);
  const inv = sheetBuilder();
  inv.section(["Money", formatMoney(knuts)]);
  inv.row(["", `(${knuts} total knuts)`]);
  inv.blank();
  const itemTable = tableAoA(related.inventory_items);
  if (itemTable.length) {
    inv.header(itemTable[0]);
    itemTable.slice(1).forEach((r) => inv.row(r));
  } else {
    inv.row(["No inventory items recorded."]);
  }
  append(inv.build(), "Inventory");

  // 3. Downtime — grouped by year, then semester, with activities + NPC results.
  const downtime = summarizeDowntime(related.character_downtime);
  const dt = sheetBuilder();
  dt.header(["Downtime", "Result"]);
  if (!downtime.length) {
    dt.row(["No downtime recorded."]);
  }
  downtime.forEach((yearGroup) => {
    dt.blank();
    dt.section([`Year ${yearGroup.year}`, ""]);
    yearGroup.semesters.forEach((sem) => {
      dt.section([`  ${sem.semester}`, ""]);
      dt.row(["    Activities", ""]);
      if (!sem.activities.length) dt.row(["      (none)", ""]);
      sem.activities.forEach((a) => {
        const sc = a.successes != null ? ` (${a.successes}/5 successes)` : "";
        dt.row([`      ${a.name}${sc}`, a.result]);
        if (a.notes) dt.row([`        Notes: ${a.notes}`, ""]);
        if (a.rewards) dt.row([`        Rewards: ${a.rewards}`, ""]);
      });
      dt.row(["    NPC Results", ""]);
      if (!sem.npcs.length) dt.row(["      (none)", ""]);
      sem.npcs.forEach((n) => {
        dt.row([`      ${n.name}`, n.result]);
        if (n.success && n.blurb) dt.row([`        “${n.blurb}”`, ""]);
        if (n.notes) dt.row([`        Notes: ${n.notes}`, ""]);
      });
    });
  });
  append(dt.build(), "Downtime");

  // 4b. NPC Stories — scenes unlocked through successful downtime interactions.
  const stories = npcStories(related.character_downtime);
  if (stories.length) {
    const ns = sheetBuilder();
    ns.header(["NPC Story", "Details"]);
    stories.forEach((npc) => {
      ns.blank();
      ns.section([
        npc.name,
        `Friendship Level ${npc.level}${npc.level >= 5 ? " (Romance)" : ""}`,
      ]);
      npc.scenes.forEach((s) => {
        ns.row([
          `Level ${s.level}${s.romanceOnly ? " (Romance)" : ""}`,
          s.scene || "(not yet written by the DM)",
        ]);
      });
    });
    append(ns.build({ wrapCols: [1] }), "NPC Stories");
  }

  // 6. Remaining tabular data, each on its own tab when present.
  const tabs = [
    ["custom_spells", "Custom Spells"],
    ["custom_counters", "Custom Counters"],
    ["custom_melee_attacks", "Custom Attacks"],
    ["custom_recipes", "Custom Recipes"],
    ["creatures", "Creatures"],
    ["character_activity_progress", "Activity Progress"],
    ["character_npc_notes", "NPC Gallery Notes"],
    ["character_pc_notes", "PC Notes"],
  ];
  tabs.forEach(([table, label]) => {
    const sheet = objectsToSheet(related[table]);
    if (sheet) append(sheet, label);
  });

  // 7. Character notes — one titled block per entry, content kept readable.
  const noteEntries = parseNotes(related.character_notes);
  if (noteEntries.length) {
    const nt = sheetBuilder();
    nt.header(["Title", "Content"]);
    noteEntries.forEach((entry) => nt.row([entry.title, entry.content]));
    // Wrap the content column so long markdown notes stay in-cell.
    append(nt.build({ wrapCols: [1] }), "Notes");
  }

  // 8. Raw data — guarantees nothing is lost even if not surfaced above.
  const raw = sheetBuilder();
  raw.header(["Field", "Raw Value"]);
  Object.entries(character).forEach(([k, v]) => {
    raw.row([titleize(k), displayValue(v)]);
  });
  append(raw.build({ wrapCols: [1] }), "Raw Character Data");

  return XLSX.write(wb, { type: "array", bookType: "xlsx" });
};

/* ------------------------------------------------------------------ */
/* PDF character sheet (one per character)                             */
/* ------------------------------------------------------------------ */

// `portrait` (optional) = { dataUrl, width, height } for the character image.
export const buildCharacterPdf = (bundle, portrait) => {
  const { character, related } = bundle;
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxW = pageW - margin * 2;
  let y = margin;

  const ensureSpace = (needed) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const heading = (text) => {
    ensureSpace(34);
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(60, 40, 90);
    doc.text(String(text), margin, y);
    y += 6;
    doc.setDrawColor(180, 160, 210);
    doc.line(margin, y, pageW - margin, y);
    y += 12;
    doc.setTextColor(20, 20, 20);
  };

  const line = (label, value) => {
    const text = displayValue(value);
    if (!text) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const labelText = `${label}: `;
    doc.text(labelText, margin, y);
    const labelW = doc.getTextWidth(labelText);
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(text, maxW - labelW);
    doc.text(wrapped, margin + labelW, y);
    y += wrapped.length * 13;
    ensureSpace(13);
  };

  const paragraph = (text, indent = 0, italic = false) => {
    if (!text) return;
    doc.setFont("helvetica", italic ? "italic" : "normal");
    doc.setFontSize(10);
    const wrapped = doc.splitTextToSize(String(text), maxW - indent);
    wrapped.forEach((ln) => {
      ensureSpace(13);
      doc.text(ln, margin + indent, y);
      y += 13;
    });
  };

  // indent: left offset in points (for nested bullets).
  const bullets = (items, indent = 0) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    items.forEach((item) => {
      const wrapped = doc.splitTextToSize(`•  ${item}`, maxW - 8 - indent);
      wrapped.forEach((ln, i) => {
        ensureSpace(13);
        doc.text(ln, margin + indent + (i === 0 ? 0 : 10), y);
        y += 13;
      });
    });
  };

  // A bold sub-label within a section (e.g. "Mastered", "Year 3 — Fall").
  const subheading = (text, indent = 0) => {
    ensureSpace(18);
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text(String(text), margin + indent, y);
    y += 14;
    doc.setTextColor(20, 20, 20);
  };

  // Portrait (top-right), if one was fetched. Scaled to fit a fixed box while
  // preserving aspect ratio.
  let imgBottom = margin;
  let textRightLimit = pageW - margin;
  if (portrait?.dataUrl) {
    try {
      const boxW = 108;
      const boxH = 132;
      const ow = portrait.width || boxW;
      const oh = portrait.height || boxH;
      const scale = Math.min(boxW / ow, boxH / oh);
      const w = Math.max(1, ow * scale);
      const h = Math.max(1, oh * scale);
      const x = pageW - margin - w;
      const fmt = portrait.dataUrl.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(portrait.dataUrl, fmt, x, margin, w, h);
      // Frame
      doc.setDrawColor(180, 160, 210);
      doc.rect(x, margin, w, h);
      imgBottom = margin + h;
      textRightLimit = x - 12;
    } catch (err) {
      // Bad/tainted image data — skip silently, the rest of the sheet is fine.
    }
  }
  const titleMaxW = textRightLimit - margin;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(40, 25, 70);
  const titleLines = doc.splitTextToSize(
    character.name || "Unnamed Character",
    titleMaxW
  );
  doc.text(titleLines, margin, y);
  y += 18 * titleLines.length;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  const subtitleBits = [
    character.house && `House ${character.house}`,
    character.casting_style,
    character.level && `Level ${character.level}`,
    character.school_year && `Year ${character.school_year}`,
  ].filter(Boolean);
  doc.text(doc.splitTextToSize(subtitleBits.join("  •  "), titleMaxW), margin, y);
  y += 8;
  doc.setTextColor(20, 20, 20);

  // Make sure following content clears the portrait.
  y = Math.max(y, imgBottom + 8);

  // Basics
  heading("Basics");
  line("Subclass", character.subclass);
  line("Innate Heritage", character.innate_heritage);
  line("Background", character.background);
  line("Wand", character.wand_type);
  line("Game Session", character.game_session);

  // Combat
  heading("Combat");
  line("Max HP", character.hit_points);
  line("Current HP", character.current_hit_points);
  line("Temp HP", character.temp_hp);
  line("Armor Class", computeArmorClass(character));
  line("Initiative Ability", character.initiative_ability);

  // Ability scores — score, modifier, and saving-throw modifier.
  const abilityRows = computeAbilityRows(character);
  if (abilityRows.length) {
    heading("Ability Scores");
    abilityRows.forEach((a) =>
      line(
        a.name,
        `${a.score}  (modifier ${fmtMod(a.mod)}, save ${fmtMod(a.save)}${
          a.saveProf ? ", proficient" : ""
        })`
      )
    );
  }

  // Skills — modifier and proficiency for each skill.
  const skillRows = computeSkillRows(character);
  if (skillRows.length) {
    heading("Skills");
    bullets(
      skillRows.map(
        (s) =>
          `${s.name} (${s.ability}) ${fmtMod(s.mod)}${
            s.proficiency ? ` — ${s.proficiency}` : ""
          }`
      )
    );
  }

  // Tool proficiencies
  const toolProfs = formatList(character.tool_proficiencies);
  if (toolProfs) {
    heading("Tool Proficiencies");
    paragraph(toolProfs);
  }

  // Features & Feats
  const feats = collectFeats(character);
  if (feats.length) {
    heading("Features & Feats");
    bullets(feats);
  }

  // Metamagic options
  const metamagic = collectMetamagic(character);
  if (metamagic.length) {
    heading("Metamagic Options");
    bullets(metamagic);
  }

  // Resources — points and spell slots.
  const res = related.character_resources?.[0];
  if (res && Object.keys(res).length) {
    heading("Resources");
    if (res.inspiration !== undefined)
      line("Inspiration", res.inspiration ? "Yes" : "No");
    line("Sorcery Points", res.sorcery_points);
    line("Max Sorcery Points", res.max_sorcery_points);
    line("Corruption Points", res.corruption_points);
    const slots = [];
    for (let lvl = 1; lvl <= 9; lvl++) {
      const current = res[`spell_slots_${lvl}`] || 0;
      const max = res[`max_spell_slots_${lvl}`] || 0;
      if (current || max) slots.push(`Level ${lvl}: ${current} / ${max}`);
    }
    if (slots.length) {
      subheading("Spell Slots (current / max)");
      bullets(slots, 10);
    }
  }

  // Inventory (money summary first)
  const knuts = getMoneyKnuts(related);
  const inventory = related.inventory_items || [];
  heading("Inventory");
  line("Money", `${formatMoney(knuts)} (${knuts} total knuts)`);
  if (inventory.length) {
    bullets(
      inventory.map((item) => {
        const qty =
          item.quantity && item.quantity !== 1 ? ` x${item.quantity}` : "";
        return `${item.name || "Item"}${qty}${
          item.category ? ` (${item.category})` : ""
        }`;
      })
    );
  } else {
    paragraph("No inventory items recorded.");
  }

  // Renders every meaningful field of an object as label/value lines (used for
  // full detail of custom spells, attacks, and creatures). Skips ids and empties.
  const DETAIL_SKIP = new Set([
    "id",
    "character_id",
    "discord_user_id",
    "user_id",
    "created_by_character_id",
    "character_name",
    "created_at",
    "updated_at",
    "name",
    "npc_name",
    "pc_name",
  ]);
  const renderFields = (obj) => {
    Object.keys(obj).forEach((k) => {
      if (DETAIL_SKIP.has(k)) return;
      const v = obj[k];
      if (v === null || v === undefined || v === "") return;
      if (Array.isArray(v) && v.length === 0) return;
      if (isPlainObject(v) && Object.keys(v).length === 0) return;
      line(titleize(k), v);
    });
  };

  // Custom spells (full detail)
  const customSpells = related.custom_spells || [];
  if (customSpells.length) {
    heading("Custom Spells");
    customSpells.forEach((s) => {
      subheading(s.name || "Spell");
      renderFields(s);
    });
  }

  // Custom melee attacks (full detail)
  const customAttacks = related.custom_melee_attacks || [];
  if (customAttacks.length) {
    heading("Custom Melee Attacks");
    customAttacks.forEach((a) => {
      subheading(a.name || "Attack");
      renderFields(a);
    });
  }

  // Creatures (full detail)
  const creatures = related.creatures || [];
  if (creatures.length) {
    heading("Creatures");
    creatures.forEach((c) => {
      subheading(c.name || "Creature");
      renderFields(c);
    });
  }

  // Spells — grouped into the four progress buckets.
  const spells = categorizeSpells(related.spell_progress_summary);
  const anySpells =
    spells.mastered.length ||
    spells.attemptedOnce.length ||
    spells.researched.length ||
    spells.failedOnly.length;
  if (anySpells) {
    heading("Spells");
    const critMastered = spells.mastered.filter((m) => m.crit);
    const regularMastered = spells.mastered.filter((m) => !m.crit);
    if (critMastered.length) {
      subheading("Crit Mastered");
      bullets(critMastered.map((m) => m.name), 10);
    }
    if (regularMastered.length) {
      subheading("Mastered");
      bullets(regularMastered.map((m) => m.name), 10);
    }
    if (spells.attemptedOnce.length) {
      subheading("Attempted Once");
      bullets(spells.attemptedOnce, 10);
    }
    if (spells.researched.length) {
      subheading("Researched");
      bullets(spells.researched, 10);
    }
    if (spells.failedOnly.length) {
      subheading("Attempted but Failed");
      bullets(spells.failedOnly, 10);
    }
  }

  // Notes — placed above the downtime / NPC sections.
  const noteEntries = parseNotes(related.character_notes);
  if (noteEntries.length) {
    heading("Notes");
    noteEntries.forEach((entry) => {
      subheading(entry.title);
      paragraph(entry.content);
    });
  }

  // NPC Notes — the player's own gallery notes about NPCs.
  const npcNotes = related.character_npc_notes || [];
  if (npcNotes.length) {
    heading("NPC Notes");
    npcNotes.forEach((note) => {
      subheading(note.npc_name || "NPC");
      renderFields(note);
    });
  }

  // Downtime — grouped by year, then semester, with activities + NPC results.
  const downtime = summarizeDowntime(related.character_downtime);
  if (downtime.length) {
    heading("Downtime");
    downtime.forEach((yearGroup) => {
      subheading(`Year ${yearGroup.year}`);
      yearGroup.semesters.forEach((sem) => {
        subheading(sem.semester, 10);
        const activityLines = sem.activities.length
          ? sem.activities.map((a) => {
              const sc =
                a.successes != null ? ` (${a.successes}/5)` : "";
              return `${a.name}${sc} — ${a.result}`;
            })
          : ["(no activities)"];
        bullets(["Activities:"], 10);
        bullets(activityLines, 24);
        bullets(["NPC Results:"], 10);
        if (!sem.npcs.length) {
          bullets(["(no NPC interactions)"], 24);
        } else {
          sem.npcs.forEach((n) => {
            bullets([`${n.name} — ${n.result}`], 24);
            // DM blurb for a successful interaction, when one was written.
            if (n.success && n.blurb) paragraph(`“${n.blurb}”`, 40, true);
          });
        }
      });
    });
  }

  // NPC Stories — scenes unlocked through successful downtime interactions.
  const stories = npcStories(related.character_downtime);
  if (stories.length) {
    heading("NPC Stories");
    stories.forEach((npc) => {
      subheading(
        `${npc.name} — Friendship Level ${npc.level}${
          npc.level >= 5 ? " (Romance)" : ""
        }`
      );
      npc.scenes.forEach((s) => {
        subheading(`Level ${s.level}${s.romanceOnly ? " (Romance)" : ""}`, 10);
        if (s.scene) paragraph(s.scene, 10);
        else paragraph("(not yet written by the DM)", 10, true);
      });
    });
  }

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Witches & Snitches export — generated ${new Date().toLocaleDateString()}`,
    margin,
    pageH - 24
  );

  return doc.output("arraybuffer");
};
