import {
  calculateFeatBenefits,
  calculateInitiativeWithFeats,
  calculateSpeedsWithFeats,
  getPassiveSkillFeatBonus,
  hasImmunityFromFeats,
  hasResistanceFromFeats,
  getHitPointsBonusFromFeats,
} from "./featBenefitsCalculator";
import { standardFeats } from "../../../SharedData/standardFeatData";

const createMockCharacter = (feats = [], level = 5, featChoices = {}) => ({
  id: "test-character",
  name: "Test Character",
  level,
  proficiencyBonus: Math.ceil(level / 4) + 1,
  standardFeats: feats,
  asiChoices: {},
  featChoices,
  castingStyle: "intelligence",
  wisdom: 14,
  dexterity: 16,
  constitution: 12,
  intelligence: 18,
  strength: 10,
  charisma: 8,
});

describe("Feat Benefits Calculator", () => {
  describe("calculateFeatBenefits", () => {
    it("should return empty benefits for character with no feats", () => {
      const character = createMockCharacter([]);
      const benefits = calculateFeatBenefits(character);

      expect(benefits.combatBonuses.initiativeBonus).toBe(0);
      expect(benefits.speeds.walkingBonus).toBe(0);
      expect(benefits.resistances).toEqual([]);
      expect(benefits.immunities).toEqual([]);
    });

    it("should calculate Alert feat benefits correctly", () => {
      const character = createMockCharacter(["Alert"]);
      const benefits = calculateFeatBenefits(character);

      expect(benefits.combatBonuses.initiativeBonus).toBe(5);
      expect(benefits.combatBonuses.unseeingAdvantageImmunity).toBe(true);
      expect(benefits.immunities).toContain("surprised");
    });

    it("should calculate Lucky feat benefits correctly", () => {
      const character = createMockCharacter(["Lucky"]);
      const benefits = calculateFeatBenefits(character);

      expect(benefits.resources.luckPoints).toBe(character.proficiencyBonus);
    });

    it("should calculate Tough feat benefits correctly", () => {
      const character = createMockCharacter(["Tough"]);
      const benefits = calculateFeatBenefits(character);

      expect(benefits.combatBonuses.hitPointsPerLevel).toBe(2);
    });

    it("should calculate Mobile feat benefits correctly", () => {
      const character = createMockCharacter(["Mobile"]);
      const benefits = calculateFeatBenefits(character);

      expect(benefits.speeds.walkingBonus).toBe(10);
    });

    it("should calculate Observant feat benefits correctly", () => {
      const character = createMockCharacter(["Observant"]);
      const benefits = calculateFeatBenefits(character);

      expect(benefits.combatBonuses.passivePerceptionBonus).toBe(5);
      expect(benefits.combatBonuses.passiveInvestigationBonus).toBe(5);
    });

    it("should calculate War Caster feat benefits correctly", () => {
      const character = createMockCharacter(["War Caster"]);
      const benefits = calculateFeatBenefits(character);

      expect(benefits.combatBonuses.concentrationAdvantage).toBe(true);
      expect(benefits.spellcasting.spellOpportunityAttacks).toBe(true);
    });

    it("should calculate Durable feat benefits correctly", () => {
      const character = createMockCharacter(["Durable"]);
      const benefits = calculateFeatBenefits(character);

      expect(benefits.combatBonuses.deathSaveAdvantage).toBe(true);
    });

    it("should calculate Poison Expert feat benefits correctly", () => {
      const character = createMockCharacter(["Poison Expert"]);
      const benefits = calculateFeatBenefits(character);

      expect(benefits.combatBonuses.poisonSaveAdvantage).toBe(true);
    });

    it("should accumulate bonuses from multiple feats", () => {
      const character = createMockCharacter(["Alert", "Mobile", "Tough"]);
      const benefits = calculateFeatBenefits(character);

      expect(benefits.combatBonuses.initiativeBonus).toBe(5);
      expect(benefits.speeds.walkingBonus).toBe(10);
      expect(benefits.combatBonuses.hitPointsPerLevel).toBe(2);
    });
  });

  describe("calculateInitiativeWithFeats", () => {
    it("should return base modifier when no feats provide initiative bonus", () => {
      const character = createMockCharacter(["Mobile"]);
      const baseModifier = 3;
      const total = calculateInitiativeWithFeats(character, baseModifier);

      expect(total).toBe(3);
    });

    it("should add Alert feat bonus to initiative", () => {
      const character = createMockCharacter(["Alert"]);
      const baseModifier = 2;
      const total = calculateInitiativeWithFeats(character, baseModifier);

      expect(total).toBe(7);
    });

    it("should handle multiple initiative bonuses", () => {
      const character = createMockCharacter(["Alert"]);
      const baseModifier = -1;
      const total = calculateInitiativeWithFeats(character, baseModifier);

      expect(total).toBe(4);
    });
  });

  describe("calculateSpeedsWithFeats", () => {
    it("should return base speed when no speed feats", () => {
      const character = createMockCharacter(["Alert"]);
      const speeds = calculateSpeedsWithFeats(character, 30);

      expect(speeds.walking).toBe(30);
      expect(speeds.climb).toBe(null);
      expect(speeds.flying).toBe(null);
    });

    it("should add Mobile feat speed bonus", () => {
      const character = createMockCharacter(["Mobile"]);
      const speeds = calculateSpeedsWithFeats(character, 30);

      expect(speeds.walking).toBe(40);
    });

    it("should handle Athlete feat climb speed", () => {
      const character = createMockCharacter(["Athlete"]);
      const speeds = calculateSpeedsWithFeats(character, 30);

      expect(speeds.walking).toBe(30);
      expect(speeds.climb).toBe(30);
    });

    it("should accumulate speed bonuses", () => {
      const character = createMockCharacter(["Mobile", "Nimble"]);
      const speeds = calculateSpeedsWithFeats(character, 30);

      expect(speeds.walking).toBe(45);
    });
  });

  describe("getPassiveSkillFeatBonus", () => {
    it("should return 0 for skills with no feat bonuses", () => {
      const character = createMockCharacter(["Alert"]);
      const bonus = getPassiveSkillFeatBonus(character, "acrobatics");

      expect(bonus).toBe(0);
    });

    it("should return Observant bonus for Perception", () => {
      const character = createMockCharacter(["Observant"]);
      const bonus = getPassiveSkillFeatBonus(character, "perception");

      expect(bonus).toBe(5);
    });

    it("should return Observant bonus for Investigation", () => {
      const character = createMockCharacter(["Observant"]);
      const bonus = getPassiveSkillFeatBonus(character, "investigation");

      expect(bonus).toBe(5);
    });
  });

  describe("hasImmunityFromFeats", () => {
    it("should return false when character has no immunity feats", () => {
      const character = createMockCharacter(["Mobile"]);
      const hasImmunity = hasImmunityFromFeats(character, "surprised");

      expect(hasImmunity).toBe(false);
    });

    it("should return true for Alert feat surprise immunity", () => {
      const character = createMockCharacter(["Alert"]);
      const hasImmunity = hasImmunityFromFeats(character, "surprised");

      expect(hasImmunity).toBe(true);
    });
  });

  describe("getHitPointsBonusFromFeats", () => {
    it("should return 0 when no HP bonus feats", () => {
      const character = createMockCharacter(["Alert"]);
      const hpBonus = getHitPointsBonusFromFeats(character);

      expect(hpBonus).toBe(0);
    });

    it("should calculate Tough feat HP bonus correctly", () => {
      const character = createMockCharacter(["Tough"], 5);
      const hpBonus = getHitPointsBonusFromFeats(character);

      expect(hpBonus).toBe(10);
    });

    it("should scale with character level", () => {
      const character = createMockCharacter(["Tough"], 10);
      const hpBonus = getHitPointsBonusFromFeats(character);

      expect(hpBonus).toBe(20);
    });
  });

  describe("Ability Score Increases", () => {
    it("should handle Keen Mind Intelligence increase", () => {
      const character = createMockCharacter(["Keen Mind"]);
      const benefits = calculateFeatBenefits(character);

      expect(benefits.specialAbilities.length).toBeGreaterThan(0);
    });

    it("should handle choice-based ability increases", () => {
      const character = createMockCharacter(["Athlete"], 5, {
        Athlete_abilityChoice: "strength",
      });
      const benefits = calculateFeatBenefits(character);

      expect(benefits.speeds.climb).toBe("equal_to_walking");
    });
  });

  describe("Edge Cases", () => {
    it("should handle null/undefined character gracefully", () => {
      const benefits = calculateFeatBenefits(null);
      expect(benefits).toBeDefined();
      expect(benefits.combatBonuses.initiativeBonus).toBe(0);
    });

    it("should handle empty feat array", () => {
      const character = createMockCharacter([]);
      const benefits = calculateFeatBenefits(character);

      expect(benefits.combatBonuses.initiativeBonus).toBe(0);
      expect(benefits.speeds.walkingBonus).toBe(0);
    });

    it("should handle invalid feat names gracefully", () => {
      const character = createMockCharacter(["NonexistentFeat"]);
      const benefits = calculateFeatBenefits(character);

      expect(benefits.combatBonuses.initiativeBonus).toBe(0);
    });

    it("should handle feat with no benefits object", () => {
      const character = createMockCharacter(["TestFeatWithNoBenefits"]);
      expect(() => calculateFeatBenefits(character)).not.toThrow();
    });
  });
});

describe("Comprehensive Feat Data Validation", () => {
  standardFeats.forEach((feat) => {
    describe(`Feat: ${feat.name || "Unknown"}`, () => {
      it("should have required basic properties", () => {
        expect(feat.name).toBeDefined();
        expect(feat.description).toBeDefined();
        expect(feat.benefits).toBeDefined();
      });

      it("should have valid ability score increase structure", () => {
        const asi = feat.benefits.abilityScoreIncrease;
        expect(
          asi === undefined ||
            asi === null ||
            (typeof asi === "object" &&
              (asi.amount !== undefined ||
                asi.type === "multiple" ||
                asi.type === "spellcasting_ability" ||
                asi.type === "choice_any"))
        ).toBe(true);

        expect(
          asi === undefined ||
            asi === null ||
            asi.type !== "choice" ||
            Array.isArray(asi.abilities)
        ).toBe(true);

        expect(
          asi === undefined ||
            asi === null ||
            asi.type === "choice" ||
            asi.type === "multiple" ||
            asi.type === "spellcasting_ability" ||
            asi.type === "choice_any" ||
            asi.ability !== undefined
        ).toBe(true);
      });

      it("should have valid combat bonuses structure", () => {
        const cb = feat.benefits.combatBonuses;
        expect(cb === undefined || cb === null || typeof cb === "object").toBe(
          true
        );
      });

      it("should have valid speeds structure", () => {
        const speeds = feat.benefits.speeds;
        expect(
          speeds === undefined || speeds === null || typeof speeds === "object"
        ).toBe(true);
      });
    });
  });

  it("should validate feat prerequisites structure", () => {
    standardFeats.forEach((feat) => {
      const prereqs = feat.prerequisites;
      expect(
        prereqs === undefined || prereqs === null || typeof prereqs === "object"
      ).toBe(true);

      expect(
        prereqs === undefined ||
          prereqs === null ||
          !prereqs.allOf ||
          Array.isArray(prereqs.allOf)
      ).toBe(true);

      expect(
        prereqs === undefined ||
          prereqs === null ||
          !prereqs.anyOf ||
          Array.isArray(prereqs.anyOf)
      ).toBe(true);
    });
  });
});

describe("Performance Tests", () => {
  it("should calculate feat benefits efficiently for many feats", () => {
    const manyFeats = standardFeats.slice(0, 20).map((f) => f.name);
    const character = createMockCharacter(manyFeats);

    const startTime = performance.now();
    calculateFeatBenefits(character);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(10);
  });

  it("should handle repeated calculations efficiently", () => {
    const character = createMockCharacter(["Alert", "Mobile", "Lucky"]);

    const startTime = performance.now();
    for (let i = 0; i < 100; i++) {
      calculateFeatBenefits(character);
    }
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100);
  });
});
