import { supabase } from "../lib/supabase";

/**
 * Gathers a complete, loss-less copy of everything a single user owns so it can
 * be packaged into a downloadable archive before the site is taken offline.
 *
 * Almost every per-character table carries a `character_id` column, so we can
 * fetch each one with a single `.in("character_id", ids)` query. Account-level
 * tables (owl mail, profile) are keyed by the user instead. Every table is
 * fetched in its own try/catch: a locked-down, renamed, or missing table yields
 * an empty result plus a warning rather than aborting the whole export.
 */

// Tables that hang off a character via a `character_id` column.
const CHARACTER_TABLES = [
  "character_resources",
  "character_money",
  "custom_counters",
  "inventory_items",
  "character_notes",
  "character_downtime",
  "character_activity_progress",
  "custom_spells",
  "custom_melee_attacks",
  "creatures",
  "spell_progress_summary",
  "character_npc_notes",
  "character_pc_notes",
];

// A few tables hang off a character via a differently-named column.
const CHARACTER_TABLES_ALT_KEY = [
  ["custom_recipes", "created_by_character_id"],
];

const fetchCharacterTable = async (table, characterIds, keyColumn = "character_id") => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .in(keyColumn, characterIds);
    if (error) {
      console.warn(`[export] Skipping "${table}":`, error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn(`[export] Failed to read "${table}":`, err?.message || err);
    return [];
  }
};

const groupByKey = (rows, keyColumn = "character_id") => {
  const map = {};
  rows.forEach((row) => {
    const key = row[keyColumn];
    if (!map[key]) map[key] = [];
    map[key].push(row);
  });
  return map;
};

const fetchAccountTable = async (table, column, value) => {
  if (!value) return [];
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq(column, value);
    if (error) {
      console.warn(`[export] Skipping "${table}":`, error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn(`[export] Failed to read "${table}":`, err?.message || err);
    return [];
  }
};

/**
 * @param {object} params
 * @param {object} params.user        Supabase auth user (has `id`).
 * @param {string} params.discordUserId  Discord provider id.
 * @param {function} [params.onProgress]  (message, fraction 0-1) => void
 * @returns {Promise<{ account, characters, generatedAt, warnings }>}
 */
export const gatherUserData = async ({ user, discordUserId, onProgress }) => {
  const report = (message, fraction) => onProgress?.(message, fraction);
  const warnings = [];

  if (!discordUserId) {
    throw new Error(
      "Could not determine your Discord account id. Try signing out and back in with Discord."
    );
  }

  report("Finding your characters…", 0.05);

  // Both active and archived characters — nothing should be left behind.
  const { data: characters, error: charsError } = await supabase
    .from("characters")
    .select("*")
    .eq("discord_user_id", discordUserId)
    .order("created_at", { ascending: true });

  if (charsError) {
    throw new Error(`Failed to load your characters: ${charsError.message}`);
  }

  const characterIds = (characters || []).map((c) => c.id);

  // Fetch every character-scoped table in parallel (standard + alt-key tables).
  report("Collecting character data…", 0.2);
  const relatedByTable = {};
  if (characterIds.length > 0) {
    const standard = await Promise.all(
      CHARACTER_TABLES.map((table) => fetchCharacterTable(table, characterIds))
    );
    CHARACTER_TABLES.forEach((table, i) => {
      relatedByTable[table] = groupByKey(standard[i]);
    });

    const alt = await Promise.all(
      CHARACTER_TABLES_ALT_KEY.map(([table, key]) =>
        fetchCharacterTable(table, characterIds, key)
      )
    );
    CHARACTER_TABLES_ALT_KEY.forEach(([table, key], i) => {
      relatedByTable[table] = groupByKey(alt[i], key);
    });
  } else {
    [...CHARACTER_TABLES, ...CHARACTER_TABLES_ALT_KEY.map(([t]) => t)].forEach(
      (table) => {
        relatedByTable[table] = {};
      }
    );
  }

  report("Collecting account data…", 0.6);
  const [owlMail, profile, discordUser] = await Promise.all([
    fetchAccountTable("owl_mail", "discord_user_id", discordUserId),
    fetchAccountTable("user_profiles", "user_id", user?.id),
    fetchAccountTable("discord_users", "discord_user_id", discordUserId),
  ]);

  const characterBundles = (characters || []).map((character) => {
    const related = {};
    CHARACTER_TABLES.forEach((table) => {
      related[table] = relatedByTable[table][character.id] || [];
    });
    // Alt-key tables are grouped by their own key column's value (= character id).
    CHARACTER_TABLES_ALT_KEY.forEach(([table]) => {
      related[table] = relatedByTable[table][character.id] || [];
    });

    // The characters table has a legacy `corruption_points` column that the app
    // no longer updates; the live value lives in character_resources and is what
    // the sheet displays. Sync it so the exported raw data matches the sheet.
    const liveCorruption = related.character_resources?.[0]?.corruption_points;
    if (liveCorruption !== undefined && liveCorruption !== null) {
      character.corruption_points = liveCorruption;
    }

    return { character, related };
  });

  report("Packaging…", 0.7);

  return {
    generatedAt: new Date().toISOString(),
    account: {
      discordUserId,
      authUserId: user?.id || null,
      email: user?.email || null,
      profile,
      discordUser,
      owlMail,
    },
    characters: characterBundles,
    warnings,
  };
};
