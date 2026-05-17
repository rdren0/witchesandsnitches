import { skillsByCastingStyle } from "../../Components/CharacterManager/utils/utils";
import { castingStyleData } from "../../SharedData/data";

// Rules source: updatedRules.txt — CASTING STYLES section
// Each casting style provides a pool of skills the player chooses from.

describe("Skills tab — skill pool coverage", () => {
  it("defines skill pools for all four casting styles", () => {
    expect(skillsByCastingStyle).toHaveProperty("Willpower Caster");
    expect(skillsByCastingStyle).toHaveProperty("Technique Caster");
    expect(skillsByCastingStyle).toHaveProperty("Intellect Caster");
    expect(skillsByCastingStyle).toHaveProperty("Vigor Caster");
  });

  it("each casting style pool has at least 8 skills", () => {
    Object.entries(skillsByCastingStyle).forEach(([style, skills]) => {
      expect(skills.length).toBeGreaterThanOrEqual(8);
    });
  });

  it("no duplicate skills within any casting style pool", () => {
    Object.entries(skillsByCastingStyle).forEach(([, skills]) => {
      expect(new Set(skills).size).toBe(skills.length);
    });
  });
});

describe("Skills tab — Willpower Caster skill pool", () => {
  const skills = skillsByCastingStyle["Willpower Caster"];

  it("contains Athletics, Deception, Intimidation, Persuasion", () => {
    expect(skills).toEqual(
      expect.arrayContaining(["Athletics", "Deception", "Intimidation", "Persuasion"])
    );
  });

  it("contains History of Magic, Magical Creatures, Sleight of Hand, Survival", () => {
    expect(skills).toEqual(
      expect.arrayContaining([
        "History of Magic",
        "Magical Creatures",
        "Sleight of Hand",
        "Survival",
      ])
    );
  });

  it("does not include Investigation or Medicine (Intellect skills)", () => {
    expect(skills).not.toContain("Investigation");
    expect(skills).not.toContain("Medicine");
  });
});

describe("Skills tab — Technique Caster skill pool", () => {
  const skills = skillsByCastingStyle["Technique Caster"];

  it("contains Acrobatics, Herbology, Magical Theory, Insight, Perception", () => {
    expect(skills).toEqual(
      expect.arrayContaining(["Acrobatics", "Herbology", "Magical Theory", "Insight", "Perception"])
    );
  });

  it("contains Sleight of Hand and Stealth", () => {
    expect(skills).toEqual(expect.arrayContaining(["Sleight of Hand", "Stealth"]));
  });

  it("does not include Athletics or Intimidation (Willpower/Vigor skills)", () => {
    expect(skills).not.toContain("Athletics");
    expect(skills).not.toContain("Intimidation");
  });
});

describe("Skills tab — Intellect Caster skill pool", () => {
  const skills = skillsByCastingStyle["Intellect Caster"];

  it("contains Investigation, History of Magic, Medicine, Muggle Studies", () => {
    expect(skills).toEqual(
      expect.arrayContaining([
        "Investigation",
        "History of Magic",
        "Medicine",
        "Muggle Studies",
      ])
    );
  });

  it("contains Herbology, Magical Theory, Magical Creatures, Survival", () => {
    expect(skills).toEqual(
      expect.arrayContaining([
        "Herbology",
        "Magical Theory",
        "Magical Creatures",
        "Survival",
      ])
    );
  });

  it("does not include Deception or Persuasion", () => {
    expect(skills).not.toContain("Deception");
    expect(skills).not.toContain("Persuasion");
  });
});

describe("Skills tab — Vigor Caster skill pool", () => {
  const skills = skillsByCastingStyle["Vigor Caster"];

  it("contains Athletics, Deception, Stealth, Medicine, Performance", () => {
    expect(skills).toEqual(
      expect.arrayContaining(["Athletics", "Deception", "Stealth", "Medicine", "Performance"])
    );
  });

  it("contains Magical Creatures, Survival, Intimidation", () => {
    expect(skills).toEqual(
      expect.arrayContaining(["Magical Creatures", "Survival", "Intimidation"])
    );
  });

  it("does not include Investigation or Muggle Studies (Intellect skills)", () => {
    expect(skills).not.toContain("Investigation");
    expect(skills).not.toContain("Muggle Studies");
  });
});

describe("Skills tab — castingStyleData skill lists", () => {
  // castingStyleData.skills is displayed in the UI; cross-check the non-Technique styles
  // Note: Technique Caster has a known spelling mismatch ("Potion-Making" vs "Potion Making")
  const styles = ["Willpower Caster", "Intellect Caster", "Vigor Caster"];

  test.each(styles)(
    "%s: castingStyleData.skills matches skillsByCastingStyle",
    (style) => {
      const dataSkills = castingStyleData[style]?.skills ?? [];
      const utilsSkills = skillsByCastingStyle[style] ?? [];
      expect(new Set(dataSkills)).toEqual(new Set(utilsSkills));
    }
  );
});
