import {
  SUBJECT_TO_MODIFIER_MAP,
  SPELL_SLOT_PROGRESSION,
  BLACK_MAGIC_PROGRESSION,
} from "../../SharedData/data";

// Rules source: updatedRules.txt — MAGIC MODIFIERS, SPELL SLOTS, BLACK MAGIC sections

describe("Magic Modifiers tab — SUBJECT_TO_MODIFIER_MAP", () => {
  const subjects = ["charms", "jhc", "transfiguration", "healing", "divinations"];

  it("defines all five magical subjects", () => {
    subjects.forEach((s) => expect(SUBJECT_TO_MODIFIER_MAP).toHaveProperty(s));
  });

  it("each subject has an abilityScore and wandModifier string", () => {
    subjects.forEach((s) => {
      expect(typeof SUBJECT_TO_MODIFIER_MAP[s].abilityScore).toBe("string");
      expect(typeof SUBJECT_TO_MODIFIER_MAP[s].wandModifier).toBe("string");
    });
  });

  it("charms → dexterity", () => {
    expect(SUBJECT_TO_MODIFIER_MAP.charms.abilityScore).toBe("dexterity");
  });

  it("jinxes/hexes/curses (jhc) → charisma", () => {
    expect(SUBJECT_TO_MODIFIER_MAP.jhc.abilityScore).toBe("charisma");
  });

  it("transfiguration → strength", () => {
    expect(SUBJECT_TO_MODIFIER_MAP.transfiguration.abilityScore).toBe("strength");
  });

  it("healing → intelligence", () => {
    expect(SUBJECT_TO_MODIFIER_MAP.healing.abilityScore).toBe("intelligence");
  });

  it("divinations → wisdom", () => {
    expect(SUBJECT_TO_MODIFIER_MAP.divinations.abilityScore).toBe("wisdom");
  });

  it("covers all six ability scores except constitution", () => {
    const mappedAbilities = new Set(
      Object.values(SUBJECT_TO_MODIFIER_MAP).map((v) => v.abilityScore)
    );
    expect(mappedAbilities).toContain("dexterity");
    expect(mappedAbilities).toContain("charisma");
    expect(mappedAbilities).toContain("strength");
    expect(mappedAbilities).toContain("intelligence");
    expect(mappedAbilities).toContain("wisdom");
    expect(mappedAbilities).not.toContain("constitution");
  });
});

describe("Basics tab — Spell Slot Progression", () => {
  it("level 1: 2 first-level slots, none higher", () => {
    expect(SPELL_SLOT_PROGRESSION[1]).toEqual([2, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it("level 3: unlocks 2nd-level slots (2 slots)", () => {
    expect(SPELL_SLOT_PROGRESSION[3][1]).toBe(2);
  });

  it("level 5: unlocks 3rd-level slots", () => {
    expect(SPELL_SLOT_PROGRESSION[5][2]).toBeGreaterThan(0);
  });

  it("level 9: unlocks 5th-level slots", () => {
    expect(SPELL_SLOT_PROGRESSION[9][4]).toBeGreaterThan(0);
  });

  it("level 11: unlocks 6th-level slots", () => {
    expect(SPELL_SLOT_PROGRESSION[11][5]).toBeGreaterThan(0);
  });

  it("level 20: 4 first-level slots, at least 1 ninth-level slot", () => {
    expect(SPELL_SLOT_PROGRESSION[20][0]).toBe(4);
    expect(SPELL_SLOT_PROGRESSION[20][8]).toBeGreaterThan(0);
  });

  it("spell slots never decrease as level increases", () => {
    for (let level = 2; level <= 20; level++) {
      for (let tier = 0; tier < 9; tier++) {
        expect(SPELL_SLOT_PROGRESSION[level][tier]).toBeGreaterThanOrEqual(
          SPELL_SLOT_PROGRESSION[level - 1][tier]
        );
      }
    }
  });

  it("defines all 20 levels", () => {
    for (let level = 1; level <= 20; level++) {
      expect(SPELL_SLOT_PROGRESSION[level]).toBeDefined();
      expect(SPELL_SLOT_PROGRESSION[level]).toHaveLength(9);
    }
  });
});

describe("Basics tab — Black Magic Progression (Willpower Caster)", () => {
  it("starts at 1d6 at level 1", () => {
    expect(BLACK_MAGIC_PROGRESSION[1]).toBe("1d6");
  });

  it("increases to 2d6 at level 3", () => {
    expect(BLACK_MAGIC_PROGRESSION[3]).toBe("2d6");
  });

  it("increases every 2 levels (odd levels unlock new die)", () => {
    for (let level = 1; level <= 19; level += 2) {
      const dice = Number(BLACK_MAGIC_PROGRESSION[level].replace("d6", ""));
      const nextDice = Number(BLACK_MAGIC_PROGRESSION[level + 1].replace("d6", ""));
      expect(nextDice).toBe(dice);
    }
  });

  it("reaches 10d6 at level 19", () => {
    expect(BLACK_MAGIC_PROGRESSION[19]).toBe("10d6");
    expect(BLACK_MAGIC_PROGRESSION[20]).toBe("10d6");
  });
});
