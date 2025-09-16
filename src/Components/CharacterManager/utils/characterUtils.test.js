import {
  calculateFeatModifiers,
  calculateHouseModifiers,
  calculateTotalModifiers,
  getAllSelectedFeats,
  checkSingleRequirement,
  checkFeatPrerequisites,
  getCharacterBenefits,
} from "./characterUtils";
import { standardFeats } from "../../../SharedData/standardFeatData";

const createTestCharacter = (overrides = {}) => ({
  id: "test-character",
  name: "Test Character",
  level: 5,
  proficiencyBonus: 3,
  castingStyle: "intelligence",
  strength: 10,
  dexterity: 14,
  constitution: 12,
  intelligence: 16,
  wisdom: 13,
  charisma: 8,
  standardFeats: [],
  asiChoices: {},
  featChoices: {},
  hitPoints: 35,
  initiativeModifier: 2,
  ...overrides,
});

describe("Character Utils - Feat Integration Tests", () => {
  describe("getAllSelectedFeats", () => {
    it("should get feats from standardFeats array", () => {
      const character = createTestCharacter({
        standardFeats: ["Alert", "Lucky"],
      });

      const feats = getAllSelectedFeats(character);
      expect(feats).toContain("Alert");
      expect(feats).toContain("Lucky");
    });

    it("should get feats from ASI choices", () => {
      const character = createTestCharacter({
        asiChoices: {
          4: {
            type: "feat",
            selectedFeat: "Mobile",
          },
          8: {
            type: "feat",
            selectedFeat: "Tough",
          },
        },
      });

      const feats = getAllSelectedFeats(character);
      expect(feats).toContain("Mobile");
      expect(feats).toContain("Tough");
    });

    it("should combine feats from multiple sources", () => {
      const character = createTestCharacter({
        standardFeats: ["Alert"],
        asiChoices: {
          4: {
            type: "feat",
            selectedFeat: "Lucky",
          },
        },
      });

      const feats = getAllSelectedFeats(character);
      expect(feats).toContain("Alert");
      expect(feats).toContain("Lucky");
      expect(feats.length).toBe(2);
    });

    it("should remove duplicates", () => {
      const character = createTestCharacter({
        standardFeats: ["Alert"],
        standard_feats: ["Alert"],
      });

      const feats = getAllSelectedFeats(character);
      expect(feats.filter((f) => f === "Alert")).toHaveLength(1);
    });
  });

  describe("calculateFeatModifiers", () => {
    it("should calculate Keen Mind intelligence bonus", () => {
      const character = createTestCharacter({
        standardFeats: ["Keen Mind"],
      });

      const { modifiers, featDetails } = calculateFeatModifiers(character);

      expect(modifiers.intelligence).toBe(1);
      expect(featDetails.intelligence).toBeDefined();
      expect(featDetails.intelligence[0].featName).toBe("Keen Mind");
      expect(featDetails.intelligence[0].amount).toBe(1);
    });

    it("should handle choice-based ability increases", () => {
      const character = createTestCharacter({
        standardFeats: ["Athlete"],
      });

      const featChoices = {
        Athlete_abilityChoice: "strength",
      };

      const { modifiers, featDetails } = calculateFeatModifiers(
        character,
        featChoices
      );

      expect(modifiers.strength).toBe(1);
      expect(featDetails.strength).toBeDefined();
      expect(featDetails.strength[0].featName).toBe("Athlete");
    });

    it("should handle multiple feats with ability increases", () => {
      const character = createTestCharacter({
        standardFeats: ["Keen Mind", "Actor"],
      });

      const { modifiers } = calculateFeatModifiers(character);

      expect(modifiers.intelligence).toBe(1);
      expect(modifiers.charisma).toBe(1);
    });

    it("should handle spellcasting ability increases", () => {
      const character = createTestCharacter({
        standardFeats: ["Cantrip Master"],
        castingStyle: "wisdom",
      });

      const { modifiers } = calculateFeatModifiers(character);

      expect(modifiers.wisdom).toBe(1);
    });

    it("should accumulate multiple bonuses to same ability", () => {
      const character = createTestCharacter({
        standardFeats: ["Keen Mind"],
        asiChoices: {
          4: {
            type: "feat",
            selectedFeat: "Observant",
          },
        },
      });

      const { modifiers } = calculateFeatModifiers(character);

      expect(modifiers.intelligence).toBe(2);
    });

    it("should handle multiple ability score increases (like Lycanthropy)", () => {
      const character = createTestCharacter({
        standardFeats: ["Lycanthropy"],
      });

      const { modifiers } = calculateFeatModifiers(character);

      expect(modifiers.strength).toBe(1);
      expect(modifiers.constitution).toBe(1);
      expect(modifiers.dexterity).toBe(0);
      expect(modifiers.intelligence).toBe(0);
    });
  });

  describe("calculateHouseModifiers", () => {
    it("should calculate fixed house bonuses (Slytherin)", () => {
      const character = createTestCharacter({
        house: "Slytherin",
      });

      const { modifiers, houseDetails } = calculateHouseModifiers(character);

      expect(modifiers.dexterity).toBe(1);
      expect(modifiers.charisma).toBe(1);
      expect(modifiers.intelligence).toBe(0);
      expect(houseDetails.dexterity).toBeDefined();
      expect(houseDetails.charisma).toBeDefined();
    });

    it("should handle house ability choice (Slytherin + Intelligence choice)", () => {
      const character = createTestCharacter({
        house: "Slytherin",
      });

      const houseChoices = {
        Slytherin: {
          abilityChoice: "intelligence",
        },
      };

      const { modifiers, houseDetails } = calculateHouseModifiers(
        character,
        houseChoices
      );

      expect(modifiers.dexterity).toBe(1);
      expect(modifiers.charisma).toBe(1);
      expect(modifiers.intelligence).toBe(1);
      expect(houseDetails.intelligence).toBeDefined();
      expect(houseDetails.intelligence[0].type).toBe("choice");
    });

    it("should handle house choice in total modifiers calculation", () => {
      const character = createTestCharacter({
        house: "Slytherin",
        houseChoices: {
          Slytherin: {
            abilityChoice: "intelligence",
          },
        },
      });

      const houseChoices = character.houseChoices;
      const { modifiers: houseModifiers } = calculateHouseModifiers(
        character,
        houseChoices
      );

      const { totalModifiers } = calculateTotalModifiers(
        character,
        {},
        houseChoices
      );

      expect(houseModifiers.dexterity).toBe(1);
      expect(houseModifiers.charisma).toBe(1);
      expect(houseModifiers.intelligence).toBe(1);

      expect(totalModifiers.dexterity).toBe(1);
      expect(totalModifiers.charisma).toBe(1);
      expect(totalModifiers.intelligence).toBe(1);
      expect(totalModifiers.strength).toBe(0);
    });
  });

  describe("parseFeatSkills", () => {
    it("should parse skill proficiencies from Vampirism feat", () => {
      const character = createTestCharacter({
        standardFeats: ["Vampirism"],
      });

      const {
        parseFeatSkills,
      } = require("../components/sections/Skills/skillsUtils");
      const featSkills = parseFeatSkills(character);

      expect(featSkills).toContain("persuasion");
    });
  });

  describe("parseBackgroundSkills", () => {
    it("should parse skill proficiencies from background", () => {
      const character = createTestCharacter({
        background: "Activist",
      });

      const {
        parseBackgroundSkills,
      } = require("../components/sections/Skills/skillsUtils");
      const backgroundSkills = parseBackgroundSkills(character);

      expect(backgroundSkills).toContain("persuasion");
      expect(backgroundSkills).toContain("historyOfMagic");
    });

    it("should return empty array for character without background", () => {
      const character = createTestCharacter({});

      const {
        parseBackgroundSkills,
      } = require("../components/sections/Skills/skillsUtils");
      const backgroundSkills = parseBackgroundSkills(character);

      expect(backgroundSkills).toEqual([]);
    });
  });

  describe("checkSingleRequirement", () => {
    it("should check level requirements", () => {
      const character = createTestCharacter({ level: 8 });

      expect(
        checkSingleRequirement({ type: "level", value: 5 }, character)
      ).toBe(true);
      expect(
        checkSingleRequirement({ type: "level", value: 10 }, character)
      ).toBe(false);
    });

    it("should check casting style requirements", () => {
      const character = createTestCharacter({ castingStyle: "wisdom" });

      expect(
        checkSingleRequirement(
          { type: "castingStyle", value: "wisdom" },
          character
        )
      ).toBe(true);
      expect(
        checkSingleRequirement(
          { type: "castingStyle", value: "intelligence" },
          character
        )
      ).toBe(false);
    });

    it("should check innate heritage requirements", () => {
      const character = createTestCharacter({ innateHeritage: "Giant" });

      expect(
        checkSingleRequirement(
          { type: "innateHeritage", value: "Giant" },
          character
        )
      ).toBe(true);
      expect(
        checkSingleRequirement(
          { type: "innateHeritage", value: "Elf" },
          character
        )
      ).toBe(false);
    });

    it("should check feat requirements", () => {
      const character = createTestCharacter({
        standardFeats: ["Alert", "Mobile"],
      });

      expect(
        checkSingleRequirement({ type: "feat", value: "Alert" }, character)
      ).toBe(true);
      expect(
        checkSingleRequirement({ type: "feat", value: "Lucky" }, character)
      ).toBe(false);
    });
  });

  describe("checkFeatPrerequisites", () => {
    it("should return true for feats with no prerequisites", () => {
      const character = createTestCharacter();
      const alertFeat = standardFeats.find((f) => f.name === "Alert");

      expect(checkFeatPrerequisites(alertFeat, character)).toBe(true);
    });

    it("should check allOf requirements", () => {
      const character = createTestCharacter({
        level: 8,
        castingStyle: "intelligence",
      });

      const mockFeat = {
        prerequisites: {
          allOf: [
            { type: "level", value: 5 },
            { type: "castingStyle", value: "intelligence" },
          ],
        },
      };

      expect(checkFeatPrerequisites(mockFeat, character)).toBe(true);

      character.level = 3;
      expect(checkFeatPrerequisites(mockFeat, character)).toBe(false);
    });

    it("should check anyOf requirements", () => {
      const character = createTestCharacter({
        castingStyle: "wisdom",
      });

      const mockFeat = {
        prerequisites: {
          anyOf: [
            { type: "castingStyle", value: "intelligence" },
            { type: "castingStyle", value: "wisdom" },
          ],
        },
      };

      expect(checkFeatPrerequisites(mockFeat, character)).toBe(true);

      character.castingStyle = "charisma";
      expect(checkFeatPrerequisites(mockFeat, character)).toBe(false);
    });
  });

  describe("getCharacterBenefits", () => {
    it("should return comprehensive character benefits", () => {
      const character = createTestCharacter({
        standardFeats: ["Alert", "Tough", "Observant"],
        hitPoints: 35,
        initiativeModifier: 2,
        wisdom: 14,
      });

      const benefits = getCharacterBenefits(character);

      expect(benefits).toBeDefined();
      expect(benefits.feats).toBeDefined();
      expect(benefits.combat).toBeDefined();
      expect(benefits.speeds).toBeDefined();

      expect(benefits.combat.initiative.featBonus).toBe(5);
      expect(benefits.combat.hitPoints.featBonus).toBe(10);
      expect(benefits.combat.passivePerception.featBonus).toBe(5);

      expect(benefits.combat.initiative.total).toBe(7);
      expect(benefits.combat.hitPoints.total).toBe(45);
    });

    it("should handle null character gracefully", () => {
      const benefits = getCharacterBenefits(null);
      expect(benefits).toBeNull();
    });
  });
});

describe("Feat Data Integrity Tests", () => {
  describe("All Feats Structure Validation", () => {
    standardFeats.forEach((feat) => {
      describe(`Feat: ${feat.name || "Unknown"}`, () => {
        it("should have required basic properties", () => {
          expect(feat.name).toBeDefined();
          expect(feat.name.length).toBeGreaterThan(0);
          expect(feat.preview).toBeDefined();
          expect(feat.description).toBeDefined();
          expect(Array.isArray(feat.description)).toBe(true);
          expect(feat.benefits).toBeDefined();
        });

        it("should have valid feat benefits structure", () => {
          expect(feat.benefits).toBeDefined();
          expect(typeof feat.benefits).toBe("object");
          expect(feat.benefits).not.toBeNull();

          const asi = feat.benefits.abilityScoreIncrease;
          const cb = feat.benefits.combatBonuses;
          const speeds = feat.benefits.speeds;
          const resistances = feat.benefits.resistances;
          const immunities = feat.benefits.immunities;
          const specialAbilities = feat.benefits.specialAbilities;

          expect(
            asi === undefined ||
              asi === null ||
              typeof asi === "object" ||
              typeof asi === "string"
          ).toBe(true);
          expect(
            cb === undefined ||
              cb === null ||
              typeof cb === "object" ||
              typeof cb === "string"
          ).toBe(true);
          expect(
            speeds === undefined ||
              speeds === null ||
              typeof speeds === "object" ||
              typeof speeds === "string"
          ).toBe(true);
          expect(
            resistances === undefined ||
              resistances === null ||
              Array.isArray(resistances) ||
              typeof resistances === "string"
          ).toBe(true);
          expect(
            immunities === undefined ||
              immunities === null ||
              Array.isArray(immunities) ||
              typeof immunities === "string"
          ).toBe(true);
          expect(
            specialAbilities === undefined ||
              specialAbilities === null ||
              Array.isArray(specialAbilities) ||
              typeof specialAbilities === "string"
          ).toBe(true);
        });

        it("should have internally consistent data structure", () => {
          expect(feat.name).toBeDefined();
          expect(feat.description).toBeDefined();
          expect(feat.benefits).toBeDefined();
          expect(typeof feat.name).toBe("string");
          expect(Array.isArray(feat.description)).toBe(true);
          expect(typeof feat.benefits).toBe("object");
        });
      });
    });
  });

  describe("Feat Prerequisites Validation", () => {
    const featsWithPrerequisites = standardFeats.filter(
      (feat) => feat.prerequisites
    );

    featsWithPrerequisites.forEach((feat) => {
      it(`${String(
        feat.name
      )} should have valid prerequisites structure`, () => {
        const prereqs = feat.prerequisites;
        expect(prereqs).toBeDefined();
        expect(typeof prereqs).toBe("object");

        const hasAllOf = prereqs.allOf !== undefined && prereqs.allOf !== null;
        const hasAnyOf = prereqs.anyOf !== undefined && prereqs.anyOf !== null;

        expect(typeof prereqs).toBe("object");
        expect(
          prereqs.allOf === undefined ||
            prereqs.allOf === null ||
            Array.isArray(prereqs.allOf)
        ).toBe(true);
        expect(
          prereqs.anyOf === undefined ||
            prereqs.anyOf === null ||
            Array.isArray(prereqs.anyOf)
        ).toBe(true);

        expect(typeof hasAllOf).toBe("boolean");
        expect(typeof hasAnyOf).toBe("boolean");
      });
    });

    it("should have at least some feats with prerequisites for test validity", () => {
      expect(featsWithPrerequisites.length).toBeGreaterThan(0);
    });
  });
});

describe("Performance and Edge Case Tests", () => {
  it("should handle character with all feats efficiently", () => {
    const allFeatNames = standardFeats.map((f) => f.name);
    const character = createTestCharacter({
      standardFeats: allFeatNames.slice(0, 20),
    });

    const startTime = performance.now();
    calculateFeatModifiers(character);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(50);
  });

  it("should handle malformed feat data gracefully", () => {
    const character = createTestCharacter({
      standardFeats: ["NonexistentFeat", "Alert", null, undefined],
    });

    expect(() => calculateFeatModifiers(character)).not.toThrow();
    expect(() => getAllSelectedFeats(character)).not.toThrow();
  });

  it("should handle empty or null inputs", () => {
    expect(() => calculateFeatModifiers(null)).not.toThrow();
    expect(() => getAllSelectedFeats(null)).not.toThrow();

    const emptyCharacter = createTestCharacter({
      standardFeats: null,
      asiChoices: null,
      featChoices: null,
    });

    expect(() => calculateFeatModifiers(emptyCharacter)).not.toThrow();
  });
});
