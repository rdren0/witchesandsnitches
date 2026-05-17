import {
  getAvailableASILevels,
  calculateToughFeatHPBonus,
  calculateHitPoints,
} from "../../Components/CharacterManager/utils/utils";
import { hpData } from "../../SharedData/data";

// Rules source: updatedRules.txt — FEATS (Tough), CASTING STYLES (Hit Points)
// ASI levels match 5e Sorcerer: 4, 8, 12, 16, 19

const ASI_LEVELS = [4, 8, 12, 16, 19];

describe("Abilities tab — ability modifier formula", () => {
  const cases = [
    [1,  -5],
    [6,  -2],
    [7,  -2],
    [8,  -1],
    [9,  -1],
    [10,  0],
    [11,  0],
    [12,  1],
    [13,  1],
    [14,  2],
    [15,  2],
    [16,  3],
    [18,  4],
    [20,  5],
  ];

  test.each(cases)("score %i → modifier %i", (score, expected) => {
    expect(Math.floor((score - 10) / 2)).toBe(expected);
  });
});

describe("Abilities tab — ASI levels", () => {
  it("ASI is available at levels 4, 8, 12, 16, 19", () => {
    expect(getAvailableASILevels(20)).toEqual(ASI_LEVELS);
  });

  it("returns only ASI levels at or below current level", () => {
    expect(getAvailableASILevels(1)).toEqual([]);
    expect(getAvailableASILevels(4)).toEqual([4]);
    expect(getAvailableASILevels(8)).toEqual([4, 8]);
    expect(getAvailableASILevels(11)).toEqual([4, 8]);
    expect(getAvailableASILevels(12)).toEqual([4, 8, 12]);
    expect(getAvailableASILevels(16)).toEqual([4, 8, 12, 16]);
    expect(getAvailableASILevels(19)).toEqual([4, 8, 12, 16, 19]);
  });

  it("returns empty array at level 3 (before first ASI)", () => {
    expect(getAvailableASILevels(3)).toEqual([]);
  });

  it("does not include levels between ASI milestones", () => {
    const notASI = [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 20];
    notASI.forEach((lvl) => {
      expect(ASI_LEVELS).not.toContain(lvl);
    });
  });
});

describe("Abilities tab — Tough feat HP bonus", () => {
  const makeToughCharacter = (level) => ({
    level,
    standardFeats: ["Tough"],
    asiChoices: {},
  });

  const makeNoToughCharacter = (level) => ({
    level,
    standardFeats: [],
    asiChoices: {},
  });

  it("returns 0 when Tough feat is not selected", () => {
    expect(calculateToughFeatHPBonus(makeNoToughCharacter(5))).toBe(0);
  });

  it("returns 2 × level when Tough feat is selected", () => {
    expect(calculateToughFeatHPBonus(makeToughCharacter(1))).toBe(2);
    expect(calculateToughFeatHPBonus(makeToughCharacter(5))).toBe(10);
    expect(calculateToughFeatHPBonus(makeToughCharacter(10))).toBe(20);
    expect(calculateToughFeatHPBonus(makeToughCharacter(20))).toBe(40);
  });

  it("detects Tough feat from ASI choices", () => {
    const character = {
      level: 5,
      standardFeats: [],
      asiChoices: {
        4: { type: "feat", selectedFeat: "Tough" },
      },
    };
    expect(calculateToughFeatHPBonus(character)).toBe(10);
  });
});

describe("Abilities tab — HP calculation formula", () => {
  const makeCharacter = (castingStyle, level, constitution, feats = []) => ({
    castingStyle,
    level,
    standardFeats: feats,
    asiChoices: {},
    abilityScores: { constitution },
  });

  it("level 1 Willpower: base 10 + CON mod", () => {
    // CON 14 → mod +2 → HP = 10 + 2 = 12
    expect(calculateHitPoints({ character: makeCharacter("Willpower Caster", 1, 14) })).toBe(12);
  });

  it("level 1 Vigor: base 12 + CON mod", () => {
    // CON 16 → mod +3 → HP = 12 + 3 = 15
    expect(calculateHitPoints({ character: makeCharacter("Vigor Caster", 1, 16) })).toBe(15);
  });

  it("multi-level Technique: base + (level-1) × (avgPerLevel + CON mod)", () => {
    // CON 10 → mod 0 | level 5
    // base: 6 + 0 = 6
    // additional: 4 × (4 + 0) = 16
    // total: 22
    expect(calculateHitPoints({ character: makeCharacter("Technique Caster", 5, 10) })).toBe(22);
  });

  it("multi-level Intellect with positive CON", () => {
    // CON 14 → mod +2 | level 3
    // base: 8 + 2 = 10
    // additional: 2 × (5 + 2) = 14
    // total: 24
    expect(calculateHitPoints({ character: makeCharacter("Intellect Caster", 3, 14) })).toBe(24);
  });

  it("adds Tough feat bonus (2 × level) on top of base HP", () => {
    // CON 10 → mod 0 | level 4 Willpower
    // base: 10 + 0 = 10
    // additional: 3 × (6 + 0) = 18
    // tough bonus: 2 × 4 = 8
    // total: 36
    expect(
      calculateHitPoints({ character: makeCharacter("Willpower Caster", 4, 10, ["Tough"]) })
    ).toBe(36);
  });

  it("HP is never less than 1", () => {
    // Extreme case: very low CON, level 1
    expect(
      calculateHitPoints({ character: makeCharacter("Technique Caster", 1, 1) })
    ).toBeGreaterThanOrEqual(1);
  });

  it("returns 0 when casting style is not set", () => {
    expect(
      calculateHitPoints({
        character: { castingStyle: null, level: 5, standardFeats: [], asiChoices: {}, abilityScores: { constitution: 10 } },
      })
    ).toBe(0);
  });

  it("CON modifier scales HP every level (negative CON reduces HP)", () => {
    // CON 8 → mod -1 | level 3 Willpower
    // base: 10 + (-1) = 9
    // additional: 2 × (6 + (-1)) = 10
    // total: 19
    expect(calculateHitPoints({ character: makeCharacter("Willpower Caster", 3, 8) })).toBe(19);
  });
});

describe("Abilities tab — hpData completeness", () => {
  const styles = ["Willpower Caster", "Technique Caster", "Intellect Caster", "Vigor Caster"];

  test.each(styles)("%s has base, avgPerLevel, and hitDie defined", (style) => {
    expect(hpData[style]).toHaveProperty("base");
    expect(hpData[style]).toHaveProperty("avgPerLevel");
    expect(hpData[style]).toHaveProperty("hitDie");
    expect(typeof hpData[style].base).toBe("number");
    expect(typeof hpData[style].avgPerLevel).toBe("number");
    expect(typeof hpData[style].hitDie).toBe("number");
  });
});
