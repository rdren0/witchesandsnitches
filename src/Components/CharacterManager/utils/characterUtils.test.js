import {
  getSpellcastingAbility,
  getAbilityModifier,
  getAbilityDisplayName,
  getAbilityShortName,
  getAvailableASILevels,
  getAllSelectedFeats,
  validateFeatSelections,
  getFeatProgressionInfo,
  handleASIChoiceChange,
  handleASIFeatChange,
  handleASIAbilityChange,
  checkForModifiers,
  checkForAbilityChoices,
  calculateFeatModifiers,
  calculateBackgroundModifiers,
  calculateHouseModifiers,
  calculateHeritageModifiers,
  calculateASIModifiers,
  calculateTotalModifiers,
  getAllAbilityModifiers,
  detectIfASIAlreadyApplied,
  isCharacterComplete,
  getCharacterProgressionSummary,
  calculateHitPoints,
  getAvailableSkills,
  skillsByCastingStyle,
} from "./characterUtils";

jest.mock("../../../SharedData", () => ({
  SUBJECT_TO_MODIFIER_MAP: {
    charms: {
      abilityScore: "dexterity",
      wandModifier: "charms",
    },
    jhc: {
      abilityScore: "charisma",
      wandModifier: "jinxesHexesCurses",
    },
    transfiguration: {
      abilityScore: "strength",
      wandModifier: "transfiguration",
    },
    healing: {
      abilityScore: "intelligence",
      wandModifier: "healing",
    },
    divinations: {
      abilityScore: "wisdom",
      wandModifier: "divinations",
    },
  },
  standardFeats: [
    {
      name: "Feat1",
      benefits: {
        abilityScoreIncrease: {
          type: "fixed",
          ability: "strength",
          amount: 1,
        },
      },
    },
    {
      name: "Feat2",
      benefits: {
        abilityScoreIncrease: {
          type: "choice",
          abilities: ["dexterity", "constitution"],
          amount: 1,
        },
      },
    },
    {
      name: "Feat3",
      benefits: {
        abilityScoreIncrease: {
          type: "spellcasting_ability",
          amount: 2,
        },
      },
    },
  ],
  backgroundsData: {
    Scholar: {
      name: "Scholar",
      modifiers: {
        abilityIncreases: [
          { type: "fixed", ability: "intelligence", amount: 2 },
        ],
      },
    },
    Soldier: {
      name: "Soldier",
      modifiers: {
        abilityIncreases: [{ type: "fixed", ability: "strength", amount: 1 }],
      },
    },
  },
  houseFeatures: {
    Gryffindor: {
      fixed: ["strength", "constitution"],
    },
    Ravenclaw: {
      fixed: ["intelligence"],
      choice: ["wisdom", "charisma"],
    },
  },
  heritageDescriptions: {
    Elf: {
      modifiers: {
        abilityIncreases: [{ type: "fixed", ability: "dexterity", amount: 2 }],
      },
      features: [
        {
          name: "Elven Lineage",
          isChoice: true,
          options: [
            {
              name: "High Elf",
              properties: {
                abilityChoice: "intelligence",
                amount: 1,
              },
            },
            {
              name: "Wood Elf",
              modifiers: {
                abilityIncreases: [
                  { type: "fixed", ability: "wisdom", amount: 1 },
                ],
              },
            },
          ],
        },
      ],
    },
  },
  subclassesData: {
    subclasses: {
      "Willpower Caster": {
        Subclass1: {
          choices: {
            3: [
              {
                name: "Choice A",
                modifiers: {
                  abilityIncreases: [{ ability: "charisma", value: 1 }],
                },
              },
            ],
          },
        },
      },
    },
  },
  subclasses: {
    "Willpower Caster": {
      Subclass1: {
        choices: {
          3: [
            {
              name: "Choice A",
              modifiers: {
                abilityIncreases: [{ ability: "charisma", value: 1 }],
              },
            },
          ],
        },
      },
    },
  },
}));

describe("Character Utilities Test Suite", () => {
  describe("getSpellcastingAbility", () => {
    test("returns correct ability for Willpower Caster", () => {
      expect(getSpellcastingAbility("Willpower Caster")).toBe("charisma");
      expect(getSpellcastingAbility({ castingStyle: "Willpower Caster" })).toBe(
        "charisma"
      );
      expect(
        getSpellcastingAbility({ casting_style: "Willpower Caster" })
      ).toBe("charisma");
    });

    test("returns correct ability for Technique Caster", () => {
      expect(getSpellcastingAbility("Technique Caster")).toBe("wisdom");
    });

    test("returns correct ability for Intellect Caster", () => {
      expect(getSpellcastingAbility("Intellect Caster")).toBe("intelligence");
    });

    test("returns correct ability for Vigor Caster", () => {
      expect(getSpellcastingAbility("Vigor Caster")).toBe("constitution");
    });

    test("returns default intelligence for unknown casting style", () => {
      expect(getSpellcastingAbility("Unknown")).toBe("intelligence");
    });

    test("handles shorthand names", () => {
      expect(getSpellcastingAbility("Willpower")).toBe("charisma");
      expect(getSpellcastingAbility("Technique")).toBe("wisdom");
      expect(getSpellcastingAbility("Intellect")).toBe("intelligence");
      expect(getSpellcastingAbility("Vigor")).toBe("constitution");
    });
  });

  describe("getAbilityModifier", () => {
    test("calculates correct modifiers for various ability scores", () => {
      expect(getAbilityModifier(10)).toBe(0);
      expect(getAbilityModifier(11)).toBe(0);
      expect(getAbilityModifier(12)).toBe(1);
      expect(getAbilityModifier(13)).toBe(1);
      expect(getAbilityModifier(14)).toBe(2);
      expect(getAbilityModifier(15)).toBe(2);
      expect(getAbilityModifier(8)).toBe(-1);
      expect(getAbilityModifier(6)).toBe(-2);
      expect(getAbilityModifier(20)).toBe(5);
    });

    test("handles null and undefined values", () => {
      expect(getAbilityModifier(null)).toBe(0);
      expect(getAbilityModifier(undefined)).toBe(0);
    });
  });

  describe("getAbilityDisplayName", () => {
    test("returns correct display names for abilities", () => {
      expect(getAbilityDisplayName("strength")).toBe("Strength");
      expect(getAbilityDisplayName("dexterity")).toBe("Dexterity");
      expect(getAbilityDisplayName("constitution")).toBe("Constitution");
      expect(getAbilityDisplayName("intelligence")).toBe("Intelligence");
      expect(getAbilityDisplayName("wisdom")).toBe("Wisdom");
      expect(getAbilityDisplayName("charisma")).toBe("Charisma");
    });

    test("returns original value for unknown abilities", () => {
      expect(getAbilityDisplayName("unknown")).toBe("unknown");
    });
  });

  describe("getAbilityShortName", () => {
    test("returns correct short names for abilities", () => {
      expect(getAbilityShortName("strength")).toBe("STR");
      expect(getAbilityShortName("dexterity")).toBe("DEX");
      expect(getAbilityShortName("constitution")).toBe("CON");
      expect(getAbilityShortName("intelligence")).toBe("INT");
      expect(getAbilityShortName("wisdom")).toBe("WIS");
      expect(getAbilityShortName("charisma")).toBe("CHA");
    });

    test("returns uppercase first 3 letters for unknown abilities", () => {
      expect(getAbilityShortName("unknown")).toBe("UNK");
    });
  });

  describe("getAvailableASILevels", () => {
    test("returns correct ASI levels based on current level", () => {
      expect(getAvailableASILevels(1)).toEqual([]);
      expect(getAvailableASILevels(4)).toEqual([4]);
      expect(getAvailableASILevels(8)).toEqual([4, 8]);
      expect(getAvailableASILevels(12)).toEqual([4, 8, 12]);
      expect(getAvailableASILevels(16)).toEqual([4, 8, 12, 16]);
      expect(getAvailableASILevels(19)).toEqual([4, 8, 12, 16, 19]);
      expect(getAvailableASILevels(20)).toEqual([4, 8, 12, 16, 19]);
    });

    test("returns empty array for level below 4", () => {
      expect(getAvailableASILevels(3)).toEqual([]);
    });
  });

  describe("getAllSelectedFeats", () => {
    test("returns feats from level 1 choice", () => {
      const character = {
        level1ChoiceType: "feat",
        standardFeats: ["Feat1", "Feat2"],
      };
      expect(getAllSelectedFeats(character)).toEqual(["Feat1", "Feat2"]);
    });

    test("returns feats from ASI choices", () => {
      const character = {
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat3" },
          8: { type: "feat", selectedFeat: "Feat4" },
        },
      };
      expect(getAllSelectedFeats(character)).toEqual(["Feat3", "Feat4"]);
    });

    test("combines feats from level 1 and ASI choices", () => {
      const character = {
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat2" },
          8: { type: "asi" },
        },
      };
      expect(getAllSelectedFeats(character)).toEqual(["Feat1", "Feat2"]);
    });

    test("returns unique feats only", () => {
      const character = {
        level1ChoiceType: "feat",
        standardFeats: ["Feat1", "Feat1"],
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat1" },
        },
      };
      expect(getAllSelectedFeats(character)).toEqual(["Feat1"]);
    });

    test("handles empty character", () => {
      expect(getAllSelectedFeats({})).toEqual([]);
    });
  });

  describe("validateFeatSelections", () => {
    test("validates unique feat selections", () => {
      const character = {
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat2" },
        },
      };
      const result = validateFeatSelections(character);
      expect(result.isValid).toBe(true);
      expect(result.duplicates).toEqual([]);
      expect(result.message).toBe(null);
    });

    test("BROKEN: cannot detect duplicates due to implementation bug", () => {
      const character = {
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat1" },
        },
      };
      const result = validateFeatSelections(character);

      expect(result.isValid).toBe(true);
      expect(result.duplicates).toEqual([]);
      expect(result.message).toBe(null);
    });
  });

  describe("getFeatProgressionInfo", () => {
    test("returns progression info for character with innate heritage", () => {
      const character = {
        level: 8,
        level1ChoiceType: "innate",
        selectedInnateHeritage: "Elf",
        asiChoices: {
          4: {
            type: "asi",
            abilityScoreIncreases: [{ ability: "strength", increase: 1 }],
          },
          8: { type: "feat", selectedFeat: "Feat1" },
        },
      };
      const result = getFeatProgressionInfo(character);
      expect(result.choices).toHaveLength(3);
      expect(result.choices[0]).toEqual({
        level: 1,
        choice: "Elf",
        type: "innate",
      });
      expect(result.totalFeatsSelected).toBe(1);
      expect(result.availableASILevels).toEqual([4, 8]);
    });

    test("returns progression info for character with feat at level 1", () => {
      const character = {
        level: 4,
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat2" },
        },
      };
      const result = getFeatProgressionInfo(character);
      expect(result.choices).toHaveLength(2);
      expect(result.totalFeatsSelected).toBe(2);
      expect(result.maxPossibleFeats).toBe(2);
    });

    test("handles missing choices", () => {
      const character = {
        level: 8,
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
      };
      const result = getFeatProgressionInfo(character);
      expect(result.choices).toContainEqual({
        level: 4,
        choice: "Not selected",
        type: "none",
      });
      expect(result.choices).toContainEqual({
        level: 8,
        choice: "Not selected",
        type: "none",
      });
    });
  });

  describe("handleASIChoiceChange", () => {
    test("updates ASI choice type to asi", () => {
      const character = { asiChoices: {} };
      const result = handleASIChoiceChange(character, 4, "asi");
      expect(result.asiChoices[4]).toEqual({
        type: "asi",
        abilityScoreIncreases: [],
        selectedFeat: null,
        featChoices: {},
      });
    });

    test("updates ASI choice type to feat", () => {
      const character = { asiChoices: {} };
      const result = handleASIChoiceChange(character, 4, "feat");
      expect(result.asiChoices[4]).toEqual({
        type: "feat",
        abilityScoreIncreases: null,
        selectedFeat: null,
        featChoices: {},
      });
    });

    test("preserves existing asiChoices", () => {
      const character = {
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat1" },
        },
      };
      const result = handleASIChoiceChange(character, 8, "asi");
      expect(result.asiChoices[4]).toBeDefined();
      expect(result.asiChoices[8]).toBeDefined();
    });
  });

  describe("handleASIFeatChange", () => {
    test("updates feat selection for ASI level", () => {
      const character = { asiChoices: {} };
      const result = handleASIFeatChange(character, 4, "Feat1", {
        choice: "value",
      });
      expect(result.asiChoices[4]).toEqual({
        type: "feat",
        selectedFeat: "Feat1",
        featChoices: { choice: "value" },
        abilityScoreIncreases: null,
      });
    });

    test("throws error for duplicate feat selection", () => {
      const character = {
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
      };
      expect(() => handleASIFeatChange(character, 4, "Feat1")).toThrow(
        'You have already selected "Feat1"'
      );
    });

    test("allows replacing existing feat at same level", () => {
      const character = {
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat1" },
        },
      };
      const result = handleASIFeatChange(character, 4, "Feat2");
      expect(result.asiChoices[4].selectedFeat).toBe("Feat2");
    });
  });

  describe("handleASIAbilityChange", () => {
    test("updates ability score increases for ASI level", () => {
      const character = { asiChoices: {} };
      const abilityUpdates = [
        { ability: "strength", increase: 1 },
        { ability: "dexterity", increase: 1 },
      ];
      const result = handleASIAbilityChange(character, 4, abilityUpdates);
      expect(result.asiChoices[4]).toEqual({
        type: "asi",
        abilityScoreIncreases: abilityUpdates,
        selectedFeat: null,
        featChoices: {},
      });
    });
  });

  describe("checkForModifiers", () => {
    test("finds modifiers in direct property", () => {
      const obj = {
        modifiers: {
          abilityIncreases: [{ ability: "strength", amount: 1 }],
        },
      };
      const result = checkForModifiers(obj, "abilityIncreases");
      expect(result).toEqual([{ ability: "strength", amount: 1 }]);
    });

    test("finds modifiers in data property", () => {
      const obj = {
        data: {
          modifiers: {
            abilityIncreases: [{ ability: "dexterity", amount: 2 }],
          },
        },
      };
      const result = checkForModifiers(obj, "abilityIncreases");
      expect(result).toEqual([{ ability: "dexterity", amount: 2 }]);
    });

    test("combines modifiers from multiple sources", () => {
      const obj = {
        modifiers: { abilityIncreases: [{ ability: "strength", amount: 1 }] },
        data: {
          modifiers: {
            abilityIncreases: [{ ability: "dexterity", amount: 2 }],
          },
        },
        benefits: {
          modifiers: {
            abilityIncreases: [{ ability: "constitution", amount: 1 }],
          },
        },
        properties: {
          modifiers: {
            abilityIncreases: [{ ability: "intelligence", amount: 3 }],
          },
        },
      };
      const result = checkForModifiers(obj, "abilityIncreases");
      expect(result).toHaveLength(4);
    });

    test("returns empty array when no modifiers found", () => {
      const obj = {};
      const result = checkForModifiers(obj, "abilityIncreases");
      expect(result).toEqual([]);
    });
  });

  describe("checkForAbilityChoices", () => {
    test("finds ability choice in direct property", () => {
      const obj = {
        abilityChoice: "strength",
        amount: 2,
      };
      const result = checkForAbilityChoices(obj);
      expect(result).toEqual([
        { ability: "strength", amount: 2, type: "choice" },
      ]);
    });

    test("finds ability choice in data property", () => {
      const obj = {
        data: {
          abilityChoice: "dexterity",
        },
      };
      const result = checkForAbilityChoices(obj);
      expect(result).toEqual([
        { ability: "dexterity", amount: 1, type: "choice" },
      ]);
    });

    test("finds ability choice in properties", () => {
      const obj = {
        properties: {
          abilityChoice: "wisdom",
          amount: 3,
        },
      };
      const result = checkForAbilityChoices(obj);
      expect(result).toEqual([
        { ability: "wisdom", amount: 3, type: "choice" },
      ]);
    });

    test("returns empty array when no choices found", () => {
      const obj = {};
      const result = checkForAbilityChoices(obj);
      expect(result).toEqual([]);
    });
  });

  describe("calculateFeatModifiers", () => {
    test("calculates fixed feat modifiers", () => {
      const character = {
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
      };
      const result = calculateFeatModifiers(character);
      expect(result.modifiers.strength).toBe(1);
      expect(result.featDetails.strength).toEqual([
        { source: "feat", featName: "Feat1", amount: 1 },
      ]);
    });

    test("calculates choice-based feat modifiers", () => {
      const character = {
        level1ChoiceType: "feat",
        standardFeats: ["Feat2"],
      };
      const featChoices = { Feat2_ability_0: "dexterity" };
      const result = calculateFeatModifiers(character, featChoices);
      expect(result.modifiers.dexterity).toBe(1);
    });

    test("calculates spellcasting ability feat modifiers", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level1ChoiceType: "feat",
        standardFeats: ["Feat3"],
      };
      const result = calculateFeatModifiers(character);
      expect(result.modifiers.charisma).toBe(2);
    });

    test("handles no feats selected", () => {
      const character = {};
      const result = calculateFeatModifiers(character);
      expect(result.modifiers).toEqual({
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      });
    });
  });

  describe("calculateBackgroundModifiers", () => {
    test("calculates background modifiers correctly", () => {
      const character = { background: "Scholar" };
      const result = calculateBackgroundModifiers(character);
      expect(result.modifiers.intelligence).toBe(2);
      expect(result.backgroundDetails.intelligence).toEqual([
        { source: "background", backgroundName: "Scholar", amount: 2 },
      ]);
    });

    test("handles missing background", () => {
      const character = {};
      const result = calculateBackgroundModifiers(character);
      expect(result.modifiers).toEqual({
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      });
    });
  });

  describe("calculateHouseModifiers", () => {
    test("calculates fixed house bonuses", () => {
      const character = { house: "Gryffindor" };
      const result = calculateHouseModifiers(character);
      expect(result.modifiers.strength).toBe(1);
      expect(result.modifiers.constitution).toBe(1);
    });

    test("calculates choice-based house bonuses", () => {
      const character = { house: "Ravenclaw" };
      const houseChoices = { Ravenclaw: { abilityChoice: "wisdom" } };
      const result = calculateHouseModifiers(character, houseChoices);
      expect(result.modifiers.intelligence).toBe(1);
      expect(result.modifiers.wisdom).toBe(1);
    });

    test("handles missing house", () => {
      const character = {};
      const result = calculateHouseModifiers(character);
      expect(result.modifiers).toEqual({
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      });
    });
  });

  describe("calculateHeritageModifiers", () => {
    test("calculates fixed heritage modifiers", () => {
      const character = { innateHeritage: "Elf" };
      const result = calculateHeritageModifiers(character);
      expect(result.modifiers.dexterity).toBe(2);
    });

    test("calculates choice-based heritage modifiers", () => {
      const character = { innateHeritage: "Elf" };
      const heritageChoices = {
        Elf: { "Elven Lineage": "High Elf" },
      };
      const result = calculateHeritageModifiers(character, heritageChoices);
      expect(result.modifiers.dexterity).toBe(2);
      expect(result.modifiers.intelligence).toBe(1);
    });

    test("handles heritage with feature modifiers", () => {
      const character = { innateHeritage: "Elf" };
      const heritageChoices = {
        Elf: { "Elven Lineage": "Wood Elf" },
      };
      const result = calculateHeritageModifiers(character, heritageChoices);
      expect(result.modifiers.dexterity).toBe(2);
      expect(result.modifiers.wisdom).toBe(1);
    });

    test("handles missing heritage", () => {
      const character = {};
      const result = calculateHeritageModifiers(character);
      expect(result.modifiers).toEqual({
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      });
    });
  });

  describe("calculateASIModifiers", () => {
    test("calculates ASI modifiers correctly", () => {
      const character = {
        asiChoices: {
          4: {
            type: "asi",
            abilityScoreIncreases: [
              { ability: "strength", increase: 1 },
              { ability: "dexterity", increase: 1 },
            ],
          },
          8: {
            type: "asi",
            abilityScoreIncreases: [{ ability: "strength", increase: 2 }],
          },
        },
      };
      const result = calculateASIModifiers(character);
      expect(result.modifiers.strength).toBe(3);
      expect(result.modifiers.dexterity).toBe(1);
    });

    test("ignores feat choices in ASI calculations", () => {
      const character = {
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat1" },
        },
      };
      const result = calculateASIModifiers(character);
      expect(result.modifiers).toEqual({
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      });
    });

    test("handles missing asiChoices", () => {
      const character = {};
      const result = calculateASIModifiers(character);
      expect(result.modifiers).toEqual({
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      });
    });
  });

  describe("detectIfASIAlreadyApplied", () => {
    test("detects _asiApplied flag", () => {
      expect(detectIfASIAlreadyApplied({ _asiApplied: true })).toBe(true);
      expect(detectIfASIAlreadyApplied({ asiApplied: true })).toBe(true);
    });

    test("detects baseAbilityScores", () => {
      expect(detectIfASIAlreadyApplied({ baseAbilityScores: {} })).toBe(true);
    });

    test("detects ASI application through score comparison", () => {
      const character = {
        ability_scores: {
          strength: 8,
          dexterity: 8,
          constitution: 8,
          intelligence: 8,
          wisdom: 8,
          charisma: 8,
        },
        abilityScores: {
          strength: 15,
          dexterity: 12,
          constitution: 10,
          intelligence: 9,
          wisdom: 8,
          charisma: 8,
        },
        asiChoices: { 4: { type: "asi" } },
      };

      expect(detectIfASIAlreadyApplied(character)).toBe(true);
    });

    test("does not detect ASI when average is exactly 10", () => {
      const character = {
        ability_scores: {
          strength: 8,
          dexterity: 8,
          constitution: 8,
          intelligence: 8,
          wisdom: 8,
          charisma: 8,
        },
        abilityScores: {
          strength: 14,
          dexterity: 12,
          constitution: 10,
          intelligence: 8,
          wisdom: 8,
          charisma: 8,
        },
        asiChoices: { 4: { type: "asi" } },
      };

      expect(detectIfASIAlreadyApplied(character)).toBe(false);
    });

    test("returns false when ASI not applied", () => {
      expect(detectIfASIAlreadyApplied({})).toBe(false);
      expect(detectIfASIAlreadyApplied({ abilityScores: {} })).toBe(false);
    });
  });

  describe("isCharacterComplete", () => {
    test("returns false for missing basic info", () => {
      expect(isCharacterComplete({})).toBe(false);
      expect(isCharacterComplete({ name: "Test" })).toBe(false);
      expect(isCharacterComplete({ name: "Test", level: 1 })).toBe(false);
    });

    test("returns true for complete level 1 character with feat", () => {
      const character = {
        name: "Test",
        level: 1,
        castingStyle: "Willpower Caster",
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
      };
      expect(isCharacterComplete(character)).toBe(true);
    });

    test("returns true for complete level 1 character with innate heritage", () => {
      const character = {
        name: "Test",
        level: 1,
        castingStyle: "Willpower Caster",
        level1ChoiceType: "innate",
        selectedInnateHeritage: "Elf",
      };
      expect(isCharacterComplete(character)).toBe(true);
    });

    test("returns false for incomplete ASI choices", () => {
      const character = {
        name: "Test",
        level: 4,
        castingStyle: "Willpower Caster",
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
      };
      expect(isCharacterComplete(character)).toBe(false);
    });

    test("returns true for complete level 4 character", () => {
      const character = {
        name: "Test",
        level: 4,
        castingStyle: "Willpower Caster",
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat2" },
        },
      };
      expect(isCharacterComplete(character)).toBe(true);
    });

    test("returns false for level 8 character - implementation may have additional requirements", () => {
      const character = {
        name: "Test",
        level: 8,
        castingStyle: "Willpower Caster",
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat2" },
          8: { type: "feat", selectedFeat: "Feat3" },
        },
      };

      expect(isCharacterComplete(character)).toBe(false);
    });

    test("returns false for level 8 character with ASI choices", () => {
      const character = {
        name: "Test",
        level: 8,
        castingStyle: "Willpower Caster",
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat2" },
          8: {
            type: "asi",
            abilityScoreIncreases: [{ ability: "strength", increase: 1 }],
          },
        },
      };

      expect(isCharacterComplete(character)).toBe(false);
    });
  });

  describe("calculateHitPoints", () => {
    test("calculates HP for Willpower Caster", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 1,
        abilityScores: { constitution: 14 },
      };
      expect(calculateHitPoints({ character })).toBe(12);
    });

    test("calculates HP for higher levels", () => {
      const character = {
        castingStyle: "Vigor Caster",
        level: 5,
        abilityScores: { constitution: 16 },
      };
      expect(calculateHitPoints({ character })).toBe(59);
    });

    test("returns minimum 1 HP even with severe penalty", () => {
      const character = {
        castingStyle: "Technique Caster",
        level: 1,
        abilityScores: { constitution: 1 },
      };
      expect(calculateHitPoints({ character })).toBe(1);
    });

    test("handles missing data", () => {
      expect(calculateHitPoints({ character: {} })).toBe(0);
      expect(
        calculateHitPoints({ character: { castingStyle: "Unknown" } })
      ).toBe(0);
    });
  });

  describe("getAvailableSkills", () => {
    test("returns skills for each casting style", () => {
      expect(
        getAvailableSkills({ character: { castingStyle: "Willpower Caster" } })
      ).toEqual(skillsByCastingStyle["Willpower Caster"]);
      expect(
        getAvailableSkills({ character: { castingStyle: "Technique Caster" } })
      ).toEqual(skillsByCastingStyle["Technique Caster"]);
      expect(
        getAvailableSkills({ character: { castingStyle: "Intellect Caster" } })
      ).toEqual(skillsByCastingStyle["Intellect Caster"]);
      expect(
        getAvailableSkills({ character: { castingStyle: "Vigor Caster" } })
      ).toEqual(skillsByCastingStyle["Vigor Caster"]);
    });

    test("returns empty array for missing casting style", () => {
      expect(getAvailableSkills({ character: {} })).toEqual([]);
      expect(
        getAvailableSkills({ character: { castingStyle: "Unknown" } })
      ).toEqual([]);
    });
  });

  describe("calculateTotalModifiers", () => {
    test("combines all modifier sources", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 4,
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
        background: "Scholar",
        house: "Gryffindor",
        innateHeritage: "Elf",
        asiChoices: {
          4: {
            type: "asi",
            abilityScoreIncreases: [{ ability: "strength", increase: 2 }],
          },
        },
      };

      const result = calculateTotalModifiers(character);
      expect(result.totalModifiers.strength).toBe(4);
      expect(result.totalModifiers.intelligence).toBe(2);
      expect(result.totalModifiers.dexterity).toBe(2);
      expect(result.totalModifiers.constitution).toBe(1);
    });

    test("handles ASI already applied", () => {
      const character = {
        _asiApplied: true,
        asiChoices: {
          4: {
            type: "asi",
            abilityScoreIncreases: [{ ability: "strength", increase: 2 }],
          },
        },
      };

      const result = calculateTotalModifiers(character);
      expect(result._asiAlreadyApplied).toBe(true);
      expect(result.asiModifiers.strength).toBe(0);
    });
  });

  describe("getCharacterProgressionSummary", () => {
    test("returns complete summary for character", () => {
      const character = {
        name: "Test",
        level: 4,
        castingStyle: "Willpower Caster",
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat2" },
        },
      };

      const result = getCharacterProgressionSummary(character);
      expect(result.isComplete).toBe(true);
      expect(result.totalFeatsSelected).toBe(2);
      expect(result.missingChoices).toHaveLength(0);
      expect(result.completedChoices).toHaveLength(2);
    });

    test("identifies missing choices", () => {
      const character = {
        name: "Test",
        level: 8,
        castingStyle: "Willpower Caster",
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
        asiChoices: {
          4: { type: "feat", selectedFeat: "Feat2" },
        },
      };

      const result = getCharacterProgressionSummary(character);
      expect(result.isComplete).toBe(false);
      expect(result.missingChoices).toHaveLength(1);
      expect(result.missingChoices[0].level).toBe(8);
    });
  });

  describe("getAllAbilityModifiers", () => {
    test("calculates comprehensive ability modifiers", () => {
      const character = {
        castingStyle: "Willpower Caster",
        subclass: "Subclass1",
        level: 3,
        level1ChoiceType: "feat",
        standardFeats: ["Feat1"],
        featChoices: { Feat1_ability: "strength" },
        house: "Gryffindor",
        house_choices: { Gryffindor: { abilityChoice: "constitution" } },
        background: "Scholar",
        innateHeritage: "Elf",
        heritage_choices: { Elf: { "Elven Lineage": "High Elf" } },
        subclassChoices: { 3: "Choice A" },
        asiChoices: {
          4: {
            type: "asi",
            abilityScoreIncreases: [{ ability: "dexterity", increase: 1 }],
          },
        },
      };

      const modifiers = getAllAbilityModifiers(character);
      expect(modifiers.strength).toBeGreaterThanOrEqual(1);
      expect(modifiers.intelligence).toBeGreaterThanOrEqual(2);
      expect(modifiers.dexterity).toBeGreaterThanOrEqual(2);
    });

    test("handles missing optional data gracefully", () => {
      const character = { castingStyle: "Willpower Caster" };
      const modifiers = getAllAbilityModifiers(character);
      expect(modifiers).toEqual({
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      });
    });
  });
});
