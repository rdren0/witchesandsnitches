import {
  getMaxMetamagicCount,
  METAMAGIC_COUNT_PROGRESSION,
  getAutomaticMetamagicNames,
  AUTOMATIC_METAMAGICS,
  TECHNIQUE_EXTRA_METAMAGICS,
} from "../../utils/metamagicUtils";

// Rules source: updatedRules.txt
// "At 3rd level, you gain the ability to twist your spells to suit your needs.
//  You gain two of the following Metamagic options of your choice.
//  You gain another one at 10th and 17th level." (base sorcerer)
// Each casting style has its own progression per class table.

describe("Metamagic rules — METAMAGIC_COUNT_PROGRESSION", () => {
  it("defines all four casting styles", () => {
    expect(METAMAGIC_COUNT_PROGRESSION).toHaveProperty("Willpower Caster");
    expect(METAMAGIC_COUNT_PROGRESSION).toHaveProperty("Technique Caster");
    expect(METAMAGIC_COUNT_PROGRESSION).toHaveProperty("Intellect Caster");
    expect(METAMAGIC_COUNT_PROGRESSION).toHaveProperty("Vigor Caster");
  });
});

describe("getMaxMetamagicCount — Willpower Caster", () => {
  const style = "Willpower Caster";

  it("returns 0 before level 3", () => {
    expect(getMaxMetamagicCount(style, 1)).toBe(0);
    expect(getMaxMetamagicCount(style, 2)).toBe(0);
  });

  it("returns 2 at level 3", () => {
    expect(getMaxMetamagicCount(style, 3)).toBe(2);
  });

  it("returns 2 through level 9", () => {
    for (let level = 3; level <= 9; level++) {
      expect(getMaxMetamagicCount(style, level)).toBe(2);
    }
  });

  it("returns 3 at level 10", () => {
    expect(getMaxMetamagicCount(style, 10)).toBe(3);
  });

  it("returns 3 through level 16", () => {
    for (let level = 10; level <= 16; level++) {
      expect(getMaxMetamagicCount(style, level)).toBe(3);
    }
  });

  it("returns 4 at level 17", () => {
    expect(getMaxMetamagicCount(style, 17)).toBe(4);
  });

  it("returns 4 through level 20", () => {
    for (let level = 17; level <= 20; level++) {
      expect(getMaxMetamagicCount(style, level)).toBe(4);
    }
  });
});

describe("getMaxMetamagicCount — Technique Caster", () => {
  const style = "Technique Caster";

  it("returns 0 before level 3", () => {
    expect(getMaxMetamagicCount(style, 1)).toBe(0);
    expect(getMaxMetamagicCount(style, 2)).toBe(0);
  });

  it("returns 2 at level 3", () => {
    expect(getMaxMetamagicCount(style, 3)).toBe(2);
  });

  it("returns 3 at level 5", () => {
    expect(getMaxMetamagicCount(style, 5)).toBe(3);
  });

  it("returns 4 at level 7", () => {
    expect(getMaxMetamagicCount(style, 7)).toBe(4);
  });

  it("returns 5 at level 8", () => {
    expect(getMaxMetamagicCount(style, 8)).toBe(5);
  });

  it("returns 5 through level 11", () => {
    for (let level = 8; level <= 11; level++) {
      expect(getMaxMetamagicCount(style, level)).toBe(5);
    }
  });

  it("returns 6 at level 12", () => {
    expect(getMaxMetamagicCount(style, 12)).toBe(6);
  });

  it("returns 7 at level 15", () => {
    expect(getMaxMetamagicCount(style, 15)).toBe(7);
  });

  it("returns 8 at level 18", () => {
    expect(getMaxMetamagicCount(style, 18)).toBe(8);
  });

  it("returns 8 through level 20", () => {
    for (let level = 18; level <= 20; level++) {
      expect(getMaxMetamagicCount(style, level)).toBe(8);
    }
  });
});

describe("getMaxMetamagicCount — Intellect Caster", () => {
  const style = "Intellect Caster";

  it("returns 0 before level 3", () => {
    expect(getMaxMetamagicCount(style, 1)).toBe(0);
    expect(getMaxMetamagicCount(style, 2)).toBe(0);
  });

  it("returns 1 at level 3", () => {
    expect(getMaxMetamagicCount(style, 3)).toBe(1);
  });

  it("returns 1 through level 6", () => {
    for (let level = 3; level <= 6; level++) {
      expect(getMaxMetamagicCount(style, level)).toBe(1);
    }
  });

  it("returns 2 at level 7", () => {
    expect(getMaxMetamagicCount(style, 7)).toBe(2);
  });

  it("returns 2 through level 12", () => {
    for (let level = 7; level <= 12; level++) {
      expect(getMaxMetamagicCount(style, level)).toBe(2);
    }
  });

  it("returns 3 at level 13", () => {
    expect(getMaxMetamagicCount(style, 13)).toBe(3);
  });

  it("returns 3 through level 20", () => {
    for (let level = 13; level <= 20; level++) {
      expect(getMaxMetamagicCount(style, level)).toBe(3);
    }
  });
});

describe("getMaxMetamagicCount — Vigor Caster", () => {
  const style = "Vigor Caster";

  it("returns 0 before level 4", () => {
    expect(getMaxMetamagicCount(style, 1)).toBe(0);
    expect(getMaxMetamagicCount(style, 2)).toBe(0);
    expect(getMaxMetamagicCount(style, 3)).toBe(0);
  });

  it("returns 1 at level 4", () => {
    expect(getMaxMetamagicCount(style, 4)).toBe(1);
  });

  it("returns 1 through level 6", () => {
    for (let level = 4; level <= 6; level++) {
      expect(getMaxMetamagicCount(style, level)).toBe(1);
    }
  });

  it("returns 2 at level 7", () => {
    expect(getMaxMetamagicCount(style, 7)).toBe(2);
  });

  it("returns 2 through level 11", () => {
    for (let level = 7; level <= 11; level++) {
      expect(getMaxMetamagicCount(style, level)).toBe(2);
    }
  });

  it("returns 3 at level 12", () => {
    expect(getMaxMetamagicCount(style, 12)).toBe(3);
  });

  it("returns 3 through level 15", () => {
    for (let level = 12; level <= 15; level++) {
      expect(getMaxMetamagicCount(style, level)).toBe(3);
    }
  });

  it("returns 4 at level 16", () => {
    expect(getMaxMetamagicCount(style, 16)).toBe(4);
  });

  it("returns 4 through level 20", () => {
    for (let level = 16; level <= 20; level++) {
      expect(getMaxMetamagicCount(style, level)).toBe(4);
    }
  });
});

describe("getMaxMetamagicCount — edge cases", () => {
  it("returns null for unknown casting style", () => {
    expect(getMaxMetamagicCount("Unknown Caster", 10)).toBeNull();
  });

  it("returns null when castingStyle is undefined", () => {
    expect(getMaxMetamagicCount(undefined, 10)).toBeNull();
  });

  it("returns null when castingStyle is null", () => {
    expect(getMaxMetamagicCount(null, 10)).toBeNull();
  });

  it("returns 0 at level 0 for any valid casting style", () => {
    expect(getMaxMetamagicCount("Willpower Caster", 0)).toBe(0);
    expect(getMaxMetamagicCount("Vigor Caster", 0)).toBe(0);
  });
});

// Rules: Willpower Caster gains Fierce Spell and Resistant Spell automatically
// at level 3. These do NOT count against the metamagic selection limit.
// Rules: Vigor Caster gains Rage automatically at level 3.
// These do NOT count against the metamagic selection limit.
// Technique Caster's extra metamagics (Bouncing, Maximized, Seeking) are
// CHOOSABLE options added to the pool — they count against the limit.
describe("Automatic metamagics — Willpower Caster", () => {
  it("grants Fierce Spell and Resistant Spell at level 3", () => {
    const names = getAutomaticMetamagicNames("Willpower Caster", 3);
    expect(names).toContain("Fierce Spell");
    expect(names).toContain("Resistant Spell");
  });

  it("grants automatic metamagics at all levels >= 3", () => {
    for (let level = 3; level <= 20; level++) {
      const names = getAutomaticMetamagicNames("Willpower Caster", level);
      expect(names.length).toBe(2);
    }
  });

  it("grants no automatic metamagics before level 3", () => {
    expect(getAutomaticMetamagicNames("Willpower Caster", 1)).toHaveLength(0);
    expect(getAutomaticMetamagicNames("Willpower Caster", 2)).toHaveLength(0);
  });

  it("automatic metamagics do not count against choosable limit", () => {
    const autoCount = getAutomaticMetamagicNames("Willpower Caster", 3).length;
    const choosableLimit = getMaxMetamagicCount("Willpower Caster", 3);
    // automatic count is separate; choosable limit is still 2
    expect(autoCount).toBe(2);
    expect(choosableLimit).toBe(2);
  });
});

describe("Automatic metamagics — Vigor Caster", () => {
  it("grants Rage at level 3", () => {
    const names = getAutomaticMetamagicNames("Vigor Caster", 3);
    expect(names).toContain("Rage");
  });

  it("grants Rage at all levels >= 3", () => {
    for (let level = 3; level <= 20; level++) {
      expect(getAutomaticMetamagicNames("Vigor Caster", level)).toContain("Rage");
    }
  });

  it("grants no automatic metamagics before level 3", () => {
    expect(getAutomaticMetamagicNames("Vigor Caster", 1)).toHaveLength(0);
    expect(getAutomaticMetamagicNames("Vigor Caster", 2)).toHaveLength(0);
  });

  it("Rage is automatic and does not count against choosable limit", () => {
    // Vigor choosable limit at level 3 is still 0 (starts at level 4)
    expect(getMaxMetamagicCount("Vigor Caster", 3)).toBe(0);
    expect(getAutomaticMetamagicNames("Vigor Caster", 3)).toContain("Rage");
  });
});

describe("Automatic metamagics — Intellect and Technique Casters", () => {
  it("Intellect Caster has no automatic metamagics", () => {
    for (let level = 1; level <= 20; level++) {
      expect(getAutomaticMetamagicNames("Intellect Caster", level)).toHaveLength(0);
    }
  });

  it("Technique Caster has no automatic metamagics", () => {
    for (let level = 1; level <= 20; level++) {
      expect(getAutomaticMetamagicNames("Technique Caster", level)).toHaveLength(0);
    }
  });

  it("Technique Caster extra metamagics are choosable pool additions, not automatic", () => {
    expect(TECHNIQUE_EXTRA_METAMAGICS).toContain("Bouncing Spell");
    expect(TECHNIQUE_EXTRA_METAMAGICS).toContain("Maximized Spell");
    expect(TECHNIQUE_EXTRA_METAMAGICS).toContain("Seeking Spell");
    expect(AUTOMATIC_METAMAGICS).not.toHaveProperty("Technique Caster");
  });
});
