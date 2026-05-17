import { castingStyleData, hpData, SORCERY_POINT_PROGRESSION } from "../../SharedData/data";

// Rules source: updatedRules.txt — CASTING STYLES section

describe("Basics tab — Casting Style hit dice", () => {
  it("Willpower Caster uses d10", () => {
    expect(castingStyleData["Willpower Caster"].hitDie).toBe("1d10");
    expect(hpData["Willpower Caster"].hitDie).toBe(10);
  });

  it("Technique Caster uses d6", () => {
    expect(castingStyleData["Technique Caster"].hitDie).toBe("1d6");
    expect(hpData["Technique Caster"].hitDie).toBe(6);
  });

  it("Intellect Caster uses d8", () => {
    expect(castingStyleData["Intellect Caster"].hitDie).toBe("1d8");
    expect(hpData["Intellect Caster"].hitDie).toBe(8);
  });

  it("Vigor Caster uses d12", () => {
    expect(castingStyleData["Vigor Caster"].hitDie).toBe("1d12");
    expect(hpData["Vigor Caster"].hitDie).toBe(12);
  });
});

describe("Basics tab — Casting Style base HP at level 1", () => {
  it("Willpower Caster base is 10 (before CON mod)", () => {
    expect(hpData["Willpower Caster"].base).toBe(10);
  });

  it("Technique Caster base is 6 (before CON mod)", () => {
    expect(hpData["Technique Caster"].base).toBe(6);
  });

  it("Intellect Caster base is 8 (before CON mod)", () => {
    expect(hpData["Intellect Caster"].base).toBe(8);
  });

  it("Vigor Caster base is 12 (before CON mod)", () => {
    expect(hpData["Vigor Caster"].base).toBe(12);
  });
});

describe("Basics tab — Casting Style average HP per level", () => {
  it("Willpower Caster averages 6 per level", () => {
    expect(hpData["Willpower Caster"].avgPerLevel).toBe(6);
  });

  it("Technique Caster averages 4 per level (1d6 avg)", () => {
    expect(hpData["Technique Caster"].avgPerLevel).toBe(4);
  });

  it("Intellect Caster averages 5 per level (1d8 avg)", () => {
    expect(hpData["Intellect Caster"].avgPerLevel).toBe(5);
  });

  it("Vigor Caster averages 8 per level (1d12 avg)", () => {
    expect(hpData["Vigor Caster"].avgPerLevel).toBe(8);
  });
});

describe("Basics tab — Casting Style spellcasting ability", () => {
  it("Willpower Caster uses Charisma", () => {
    expect(castingStyleData["Willpower Caster"].spellcastingAbility).toBe("Charisma");
  });

  it("Technique Caster uses Wisdom", () => {
    expect(castingStyleData["Technique Caster"].spellcastingAbility).toBe("Wisdom");
  });

  it("Intellect Caster uses Intelligence", () => {
    expect(castingStyleData["Intellect Caster"].spellcastingAbility).toBe("Intelligence");
  });

  it("Vigor Caster uses Constitution", () => {
    expect(castingStyleData["Vigor Caster"].spellcastingAbility).toBe("Constitution");
  });
});

describe("Basics tab — Casting Style base AC formula", () => {
  it("Willpower Caster AC is 15 + DEX modifier", () => {
    expect(castingStyleData["Willpower Caster"].baseAC).toBe("15 + DEX modifier");
  });

  it("Technique Caster AC is 10 + DEX modifier", () => {
    expect(castingStyleData["Technique Caster"].baseAC).toBe("10 + DEX modifier");
  });

  it("Intellect Caster AC is 11 + DEX modifier", () => {
    expect(castingStyleData["Intellect Caster"].baseAC).toBe("11 + DEX modifier");
  });

  it("Vigor Caster AC is 8 + DEX modifier", () => {
    expect(castingStyleData["Vigor Caster"].baseAC).toBe("8 + DEX modifier");
  });
});

describe("Basics tab — Casting Style saving throws", () => {
  it("Willpower Caster saves: Constitution and Charisma", () => {
    expect(castingStyleData["Willpower Caster"].savingThrows).toEqual(
      expect.arrayContaining(["Constitution", "Charisma"])
    );
  });

  it("Technique Caster saves: Dexterity and Wisdom", () => {
    expect(castingStyleData["Technique Caster"].savingThrows).toEqual(
      expect.arrayContaining(["Dexterity", "Wisdom"])
    );
  });

  it("Intellect Caster saves: Wisdom and Intelligence", () => {
    expect(castingStyleData["Intellect Caster"].savingThrows).toEqual(
      expect.arrayContaining(["Wisdom", "Intelligence"])
    );
  });

  it("Vigor Caster saves: Constitution and Strength", () => {
    expect(castingStyleData["Vigor Caster"].savingThrows).toEqual(
      expect.arrayContaining(["Constitution", "Strength"])
    );
  });
});

describe("Basics tab — Sorcery Point Progression", () => {
  it("level 1 grants 0 sorcery points", () => {
    expect(SORCERY_POINT_PROGRESSION[1]).toBe(0);
  });

  it("level 2 grants 2 sorcery points", () => {
    expect(SORCERY_POINT_PROGRESSION[2]).toBe(2);
  });

  it("sorcery points increase by 1 per level from 2 to 20", () => {
    for (let level = 2; level <= 20; level++) {
      expect(SORCERY_POINT_PROGRESSION[level]).toBe(level);
    }
  });

  it("level 20 grants 20 sorcery points", () => {
    expect(SORCERY_POINT_PROGRESSION[20]).toBe(20);
  });
});
