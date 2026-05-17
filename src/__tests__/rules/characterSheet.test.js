import {
  getModifier,
  formatModifier,
  modifiers,
  calculateModifier,
  calculatePassiveSkill,
  calculatePassivePerception,
  calculatePassiveInvestigation,
  calculatePassiveDeception,
  getPassiveSkillBreakdown,
  checkSingleRequirement,
  checkFeatPrerequisites,
} from "../../Components/CharacterSheet/utils";

// Rules source: updatedRules.txt — ability modifiers, proficiency bonus, passive skills

// ---------------------------------------------------------------------------
// Ability modifier formula
// ---------------------------------------------------------------------------

describe("Character sheet — getModifier", () => {
  const cases = [
    [1, -5],
    [6, -2],
    [8, -1],
    [9, -1],
    [10, 0],
    [11, 0],
    [12, 1],
    [14, 2],
    [16, 3],
    [18, 4],
    [20, 5],
  ];

  test.each(cases)("score %i → modifier %i", (score, expected) => {
    expect(getModifier(score)).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// formatModifier
// ---------------------------------------------------------------------------

describe("Character sheet — formatModifier", () => {
  it("prepends + for positive modifiers", () => {
    expect(formatModifier(3)).toBe("+3");
    expect(formatModifier(1)).toBe("+1");
  });

  it("prepends + for zero modifier", () => {
    expect(formatModifier(0)).toBe("+0");
  });

  it("uses minus sign for negative modifiers", () => {
    expect(formatModifier(-1)).toBe("-1");
    expect(formatModifier(-5)).toBe("-5");
  });
});

// ---------------------------------------------------------------------------
// Proficiency bonus formula (Math.ceil(level / 4) + 1)
// ---------------------------------------------------------------------------

describe("Character sheet — proficiency bonus by level", () => {
  const profBonus = (level) => Math.ceil(level / 4) + 1;

  it("returns +2 at levels 1–4", () => {
    [1, 2, 3, 4].forEach((lvl) => expect(profBonus(lvl)).toBe(2));
  });

  it("returns +3 at levels 5–8", () => {
    [5, 6, 7, 8].forEach((lvl) => expect(profBonus(lvl)).toBe(3));
  });

  it("returns +4 at levels 9–12", () => {
    [9, 10, 11, 12].forEach((lvl) => expect(profBonus(lvl)).toBe(4));
  });

  it("returns +5 at levels 13–16", () => {
    [13, 14, 15, 16].forEach((lvl) => expect(profBonus(lvl)).toBe(5));
  });

  it("returns +6 at levels 17–20", () => {
    [17, 18, 19, 20].forEach((lvl) => expect(profBonus(lvl)).toBe(6));
  });
});

// ---------------------------------------------------------------------------
// modifiers(character) — all six ability scores
// ---------------------------------------------------------------------------

describe("Character sheet — modifiers(character)", () => {
  it("returns correct modifiers for each ability score", () => {
    const character = {
      abilityScores: {
        strength: 16,
        dexterity: 14,
        constitution: 12,
        intelligence: 10,
        wisdom: 8,
        charisma: 18,
      },
    };
    // modifiers() reads from ability_scores or direct properties; AbilityScores
    // component reads from abilityScores via calculateFinalAbilityScores, but
    // the sheet utils.js modifiers() uses ability_scores (snake_case) or flat keys
    const character2 = {
      ability_scores: {
        strength: 16,
        dexterity: 14,
        constitution: 12,
        intelligence: 10,
        wisdom: 8,
        charisma: 18,
      },
    };
    const mods = modifiers(character2);
    expect(mods.strength).toBe(3);
    expect(mods.dexterity).toBe(2);
    expect(mods.constitution).toBe(1);
    expect(mods.intelligence).toBe(0);
    expect(mods.wisdom).toBe(-1);
    expect(mods.charisma).toBe(4);
  });

  it("defaults unset ability scores to 10 (modifier 0)", () => {
    const mods = modifiers({});
    Object.values(mods).forEach((mod) => expect(mod).toBe(0));
  });

  it("returns empty object for null character", () => {
    expect(modifiers(null)).toEqual({});
  });

  it("reads from flat character[ability] when ability_scores is absent", () => {
    const character = { strength: 20, dexterity: 10 };
    const mods = modifiers(character);
    expect(mods.strength).toBe(5);
    expect(mods.dexterity).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calculateModifier — skill check modifier (proficiency tiers)
// ---------------------------------------------------------------------------

describe("Character sheet — calculateModifier (skill)", () => {
  const makeCharacter = (abilityScore, skillLevel, profBonus = 3) => ({
    ability_scores: { wisdom: abilityScore },
    skills: { perception: skillLevel },
    proficiencyBonus: profBonus,
  });

  it("unproficient: returns ability modifier only", () => {
    // WIS 14 → mod +2, no proficiency
    expect(calculateModifier("perception", makeCharacter(14, 0))).toBe(2);
  });

  it("proficient (tier 1): adds proficiency bonus once", () => {
    // WIS 14 → +2, prof +3 → total +5
    expect(calculateModifier("perception", makeCharacter(14, 1, 3))).toBe(5);
  });

  it("expertise (tier 2): adds proficiency bonus twice", () => {
    // WIS 14 → +2, prof +3 twice → total +8
    expect(calculateModifier("perception", makeCharacter(14, 2, 3))).toBe(8);
  });

  it("returns 0 for unknown skill name", () => {
    expect(calculateModifier("nonexistentSkill", makeCharacter(14, 1))).toBe(0);
  });

  it("returns 0 when character is null", () => {
    expect(calculateModifier("perception", null)).toBe(0);
  });

  it("uses correct ability for each skill", () => {
    // Athletics → strength; Perception → wisdom
    const character = {
      ability_scores: { strength: 16, wisdom: 8 },
      skills: {},
      proficiencyBonus: 2,
    };
    expect(calculateModifier("athletics", character)).toBe(3);  // STR 16 → +3
    expect(calculateModifier("perception", character)).toBe(-1); // WIS 8 → -1
  });
});

// ---------------------------------------------------------------------------
// calculatePassiveSkill — passive = 10 + modifier
// ---------------------------------------------------------------------------

describe("Character sheet — passive skill scores", () => {
  const makeCharacter = (wisScore, skillLevel = 0, profBonus = 2) => ({
    ability_scores: { wisdom: wisScore },
    skills: { perception: skillLevel, investigation: skillLevel },
    proficiencyBonus: profBonus,
  });

  it("passive perception: 10 + WIS modifier (unproficient)", () => {
    // WIS 10 → mod 0 → passive 10
    expect(calculatePassivePerception(makeCharacter(10))).toBe(10);
    // WIS 14 → mod +2 → passive 12
    expect(calculatePassivePerception(makeCharacter(14))).toBe(12);
  });

  it("passive perception: 10 + modifier + proficiency when proficient", () => {
    // WIS 14 → +2, prof +2, proficient → passive 14
    expect(calculatePassivePerception(makeCharacter(14, 1, 2))).toBe(14);
  });

  it("passive perception: 10 + modifier + 2×proficiency with expertise", () => {
    // WIS 14 → +2, prof +2 twice → passive 16
    expect(calculatePassivePerception(makeCharacter(14, 2, 2))).toBe(16);
  });

  it("passive investigation uses intelligence", () => {
    const character = {
      ability_scores: { intelligence: 16, wisdom: 10 },
      skills: { investigation: 0 },
      proficiencyBonus: 2,
    };
    // INT 16 → +3 → passive 13
    expect(calculatePassiveInvestigation(character)).toBe(13);
  });

  it("passive deception uses charisma", () => {
    const character = {
      ability_scores: { charisma: 14, wisdom: 10 },
      skills: { deception: 0 },
      proficiencyBonus: 2,
    };
    // CHA 14 → +2 → passive 12
    expect(calculatePassiveDeception(character)).toBe(12);
  });

  it("defaults to 10 when character is null", () => {
    expect(calculatePassiveSkill("perception", null)).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// getPassiveSkillBreakdown — total and breakdown array
// ---------------------------------------------------------------------------

describe("Character sheet — getPassiveSkillBreakdown", () => {
  it("returns total and breakdown array", () => {
    const character = {
      ability_scores: { wisdom: 14 },
      skills: { perception: 0 },
      proficiencyBonus: 2,
    };
    const { total, breakdown } = getPassiveSkillBreakdown("perception", character);
    expect(total).toBe(12);
    expect(breakdown).toContainEqual({ source: "Base", value: 10 });
    expect(breakdown).toContainEqual({ source: "Perception Modifier", value: 2 });
  });

  it("includes Base (10) and skill modifier in breakdown", () => {
    const character = {
      ability_scores: { wisdom: 10 },
      skills: {},
      proficiencyBonus: 2,
    };
    const { total, breakdown } = getPassiveSkillBreakdown("perception", character);
    expect(total).toBe(10);
    expect(breakdown.find((b) => b.source === "Base").value).toBe(10);
  });

  it("returns total 10 and empty breakdown for null character", () => {
    const { total, breakdown } = getPassiveSkillBreakdown("perception", null);
    expect(total).toBe(10);
    expect(breakdown).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// checkSingleRequirement — feat prerequisite types
// ---------------------------------------------------------------------------

describe("Character sheet — checkSingleRequirement", () => {
  it('type "level": true when character meets minimum level', () => {
    expect(checkSingleRequirement({ type: "level", value: 5 }, { level: 5 })).toBe(true);
    expect(checkSingleRequirement({ type: "level", value: 5 }, { level: 10 })).toBe(true);
  });

  it('type "level": false when character is below minimum level', () => {
    expect(checkSingleRequirement({ type: "level", value: 5 }, { level: 4 })).toBe(false);
  });

  it('type "level": defaults to level 1 when character has no level', () => {
    expect(checkSingleRequirement({ type: "level", value: 1 }, {})).toBe(true);
    expect(checkSingleRequirement({ type: "level", value: 2 }, {})).toBe(false);
  });

  it('type "castingStyle": true when casting style matches', () => {
    expect(
      checkSingleRequirement(
        { type: "castingStyle", value: "Willpower Caster" },
        { castingStyle: "Willpower Caster" }
      )
    ).toBe(true);
  });

  it('type "castingStyle": false when casting style does not match', () => {
    expect(
      checkSingleRequirement(
        { type: "castingStyle", value: "Vigor Caster" },
        { castingStyle: "Willpower Caster" }
      )
    ).toBe(false);
  });

  it('type "feat": true when feat is in standardFeats', () => {
    expect(
      checkSingleRequirement(
        { type: "feat", value: "Alert" },
        { standardFeats: ["Alert"], asiChoices: {} }
      )
    ).toBe(true);
  });

  it('type "feat": true when feat is in asiChoices', () => {
    expect(
      checkSingleRequirement(
        { type: "feat", value: "Tough" },
        {
          standardFeats: [],
          asiChoices: { 4: { type: "feat", selectedFeat: "Tough" } },
        }
      )
    ).toBe(true);
  });

  it('type "feat": false when feat is not present', () => {
    expect(
      checkSingleRequirement(
        { type: "feat", value: "Alert" },
        { standardFeats: [], asiChoices: {} }
      )
    ).toBe(false);
  });

  it('type "innateHeritage": matches heritage string', () => {
    expect(
      checkSingleRequirement(
        { type: "innateHeritage", value: "Halfblood" },
        { innateHeritage: "Halfblood" }
      )
    ).toBe(true);
    expect(
      checkSingleRequirement(
        { type: "innateHeritage", value: "Pureblood" },
        { innateHeritage: "Halfblood" }
      )
    ).toBe(false);
  });

  it('type "subclass": matches subclass string', () => {
    expect(
      checkSingleRequirement(
        { type: "subclass", value: "Auror" },
        { subclass: "Auror" }
      )
    ).toBe(true);
    expect(
      checkSingleRequirement(
        { type: "subclass", value: "Auror" },
        { subclass: "Healer" }
      )
    ).toBe(false);
  });

  it("returns false for unknown requirement type", () => {
    expect(
      checkSingleRequirement({ type: "unknownType", value: "anything" }, {})
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// checkFeatPrerequisites — allOf / anyOf combinations
// ---------------------------------------------------------------------------

describe("Character sheet — checkFeatPrerequisites", () => {
  const character = {
    level: 5,
    castingStyle: "Willpower Caster",
    standardFeats: ["Alert"],
    asiChoices: {},
  };

  it("returns true when feat has no prerequisites", () => {
    expect(checkFeatPrerequisites({}, character)).toBe(true);
    expect(checkFeatPrerequisites({ prerequisites: null }, character)).toBe(true);
  });

  it("allOf: true when all requirements are met", () => {
    const feat = {
      prerequisites: {
        allOf: [
          { type: "level", value: 5 },
          { type: "castingStyle", value: "Willpower Caster" },
        ],
      },
    };
    expect(checkFeatPrerequisites(feat, character)).toBe(true);
  });

  it("allOf: false when any requirement fails", () => {
    const feat = {
      prerequisites: {
        allOf: [
          { type: "level", value: 5 },
          { type: "castingStyle", value: "Vigor Caster" }, // wrong style
        ],
      },
    };
    expect(checkFeatPrerequisites(feat, character)).toBe(false);
  });

  it("anyOf: true when at least one requirement is met", () => {
    const feat = {
      prerequisites: {
        anyOf: [
          { type: "castingStyle", value: "Vigor Caster" },     // no match
          { type: "castingStyle", value: "Willpower Caster" }, // match
        ],
      },
    };
    expect(checkFeatPrerequisites(feat, character)).toBe(true);
  });

  it("anyOf: false when no requirement is met", () => {
    const feat = {
      prerequisites: {
        anyOf: [
          { type: "castingStyle", value: "Vigor Caster" },
          { type: "castingStyle", value: "Intellect Caster" },
        ],
      },
    };
    expect(checkFeatPrerequisites(feat, character)).toBe(false);
  });

  it("allOf + anyOf: both must pass", () => {
    const feat = {
      prerequisites: {
        allOf: [{ type: "level", value: 5 }],
        anyOf: [
          { type: "castingStyle", value: "Willpower Caster" },
          { type: "castingStyle", value: "Vigor Caster" },
        ],
      },
    };
    expect(checkFeatPrerequisites(feat, character)).toBe(true);
  });

  it("allOf + anyOf: false when allOf fails even if anyOf passes", () => {
    const feat = {
      prerequisites: {
        allOf: [{ type: "level", value: 10 }], // level 5 fails this
        anyOf: [{ type: "castingStyle", value: "Willpower Caster" }],
      },
    };
    expect(checkFeatPrerequisites(feat, character)).toBe(false);
  });

  it("empty allOf and empty anyOf arrays → true", () => {
    const feat = { prerequisites: { allOf: [], anyOf: [] } };
    expect(checkFeatPrerequisites(feat, character)).toBe(true);
  });
});
