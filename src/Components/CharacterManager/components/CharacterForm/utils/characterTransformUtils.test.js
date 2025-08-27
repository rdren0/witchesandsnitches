import {
  transformCharacterForSave,
  transformCharacterFromDB,
  validateCastingStyleChoices,
  resetFeatureUsesAfterRest,
  applyCastingStyleAbilityModifications,
  getCastingStyleChoiceOptions,
} from "./characterTransformUtils";

describe("Database Transformation Utilities", () => {
  describe("transformCharacterForSave", () => {
    test("transforms basic character data correctly", () => {
      const character = {
        name: "Harry Potter",
        level: 5,
        castingStyle: "Willpower Caster",
        house: "Gryffindor",
        background: "The Boy Who Lived",
        abilityScores: {
          strength: 10,
          dexterity: 14,
          constitution: 12,
          intelligence: 16,
          wisdom: 13,
          charisma: 15,
        },
      };

      const result = transformCharacterForSave(character);

      expect(result.name).toBe("Harry Potter");
      expect(result.level).toBe(5);
      expect(result.casting_style).toBe("Willpower Caster");
      expect(result.house).toBe("Gryffindor");
      expect(result.background).toBe("The Boy Who Lived");
      expect(result.ability_scores).toEqual({
        strength: 10,
        dexterity: 14,
        constitution: 12,
        intelligence: 16,
        wisdom: 13,
        charisma: 15,
      });
    });

    test("handles feat collection from level1Choice and ASI choices", () => {
      const character = {
        level1ChoiceType: "feat",
        standardFeats: ["Alert", "Lucky"],
        asiChoices: {
          4: { type: "feat", selectedFeat: "Tough" },
          8: { type: "asi", abilityScoreIncreases: [] },
          12: { type: "feat", selectedFeat: "Resilient" },
        },
      };

      const result = transformCharacterForSave(character);

      expect(result.standard_feats).toEqual([
        "Alert",
        "Lucky",
        "Tough",
        "Resilient",
      ]);
      expect(result.level1_choice_type).toBe("feat");
    });

    test("handles innate heritage choice type", () => {
      const character = {
        level1ChoiceType: "innate",
        innateHeritage: "Elf",
        asiChoices: {
          4: { type: "feat", selectedFeat: "Keen Mind" },
        },
      };

      const result = transformCharacterForSave(character);

      expect(result.standard_feats).toEqual(["Keen Mind"]);
      expect(result.level1_choice_type).toBe("innate");
      expect(result.innate_heritage).toBe("Elf");
    });

    test("transforms skill proficiencies and expertise", () => {
      const character = {
        skillProficiencies: ["Athletics", "Perception", "Stealth"],
        skillExpertise: ["Stealth"],
      };

      const result = transformCharacterForSave(character);

      expect(result.skill_proficiencies).toEqual([
        "Athletics",
        "Perception",
        "Stealth",
      ]);
      expect(result.skill_expertise).toEqual(["Stealth"]);
    });

    test("handles undefined skill arrays", () => {
      const character = {};

      const result = transformCharacterForSave(character);

      expect(result.skill_proficiencies).toEqual([]);
      expect(result.skill_expertise).toEqual([]);
    });

    test("transforms casting style specific choices", () => {
      const character = {
        blackMagicEnhancement: "Ambush",
        signatureSpells: ["Fireball", "Lightning Bolt"],
        schoolOfMagicFeatures: ["Portent", "Expert Divination"],
        doubleCheckNotesUsed: true,
        rageActive: true,
        rageTurnsRemaining: 3,
        relentlessRageDC: 20,
      };

      const result = transformCharacterForSave(character);

      expect(result.casting_style_choices).toEqual({
        blackMagicEnhancement: "Ambush",
        signatureSpells: ["Fireball", "Lightning Bolt"],
        schoolOfMagicFeatures: ["Portent", "Expert Divination"],
        doubleCheckNotesUsed: true,
        rageActive: true,
        rageTurnsRemaining: 3,
        relentlessRageDC: 20,
      });
    });

    test("transforms feature uses", () => {
      const character = {
        featureUses: {
          doubleCheckNotes: { current: 0, max: 1 },
          signatureSpell1: { current: 1, max: 1 },
          signatureSpell2: { current: 0, max: 1 },
          exploitWeaknessUses: 3,
          spellDeflectionUses: 2,
        },
      };

      const result = transformCharacterForSave(character);

      expect(result.feature_uses.doubleCheckNotes).toEqual({
        current: 0,
        max: 1,
      });
      expect(result.feature_uses.exploitWeaknessUses).toBe(3);
    });

    test("provides default values for missing fields", () => {
      const character = {};

      const result = transformCharacterForSave(character);

      expect(result.ability_scores).toEqual({
        strength: 8,
        dexterity: 8,
        constitution: 8,
        intelligence: 8,
        wisdom: 8,
        charisma: 8,
      });
      expect(result.level).toBe(1);
      expect(result.corruption_points).toBe(0);
      expect(result.hit_points).toBe(0);
      expect(result.name).toBe("");
      expect(result.initiative_ability).toBe("dexterity");
    });

    test("trims name and handles edge cases", () => {
      const character = {
        name: "  Hermione Granger  ",
        imageUrl: "https://example.com/image.jpg",
        discordUserId: "user123",
      };

      const result = transformCharacterForSave(character);

      expect(result.name).toBe("Hermione Granger");
      expect(result.image_url).toBe("https://example.com/image.jpg");
      expect(result.discord_user_id).toBe("user123");
    });

    test("handles alternative property names", () => {
      const character = {
        discord_user_id: "alt_user456",
        image_url: "alt_image.jpg",
      };

      const result = transformCharacterForSave(character);

      expect(result.discord_user_id).toBe("alt_user456");
      expect(result.image_url).toBe("alt_image.jpg");
    });
  });

  describe("transformCharacterFromDB", () => {
    test("transforms database character to app format", () => {
      const dbCharacter = {
        id: 1,
        name: "Ron Weasley",
        level: 7,
        casting_style: "Vigor Caster",
        house: "Gryffindor",
        ability_scores: {
          strength: 16,
          dexterity: 12,
          constitution: 14,
          intelligence: 10,
          wisdom: 11,
          charisma: 13,
        },
        created_at: "2024-01-01",
        updated_at: "2024-01-15",
      };

      const result = transformCharacterFromDB(dbCharacter);

      expect(result.id).toBe(1);
      expect(result.name).toBe("Ron Weasley");
      expect(result.level).toBe(7);
      expect(result.castingStyle).toBe("Vigor Caster");
      expect(result.abilityScores).toEqual({
        strength: 16,
        dexterity: 12,
        constitution: 14,
        intelligence: 10,
        wisdom: 11,
        charisma: 13,
      });
      expect(result.createdAt).toBe("2024-01-01");
      expect(result.updatedAt).toBe("2024-01-15");
    });

    test("handles null input", () => {
      const result = transformCharacterFromDB(null);
      expect(result).toBe(null);
    });

    test("handles undefined input", () => {
      const result = transformCharacterFromDB(undefined);
      expect(result).toBe(null);
    });

    test("transforms casting style choices correctly", () => {
      const dbCharacter = {
        casting_style_choices: {
          blackMagicEnhancement: "Grudge",
          signatureSpells: ["Meteor Swarm", "Time Stop"],
          schoolOfMagicFeatures: ["Arcane Ward"],
          doubleCheckNotesUsed: false,
          rageActive: true,
          rageTurnsRemaining: 5,
          relentlessRageDC: 18,
        },
      };

      const result = transformCharacterFromDB(dbCharacter);

      expect(result.blackMagicEnhancement).toBe("Grudge");
      expect(result.signatureSpells).toEqual(["Meteor Swarm", "Time Stop"]);
      expect(result.schoolOfMagicFeatures).toEqual(["Arcane Ward"]);
      expect(result.rageActive).toBe(true);
      expect(result.rageTurnsRemaining).toBe(5);
    });

    test("transforms feature uses correctly", () => {
      const dbCharacter = {
        feature_uses: {
          doubleCheckNotes: { current: 0, max: 1 },
          signatureSpell1: { current: 1, max: 1 },
          exploitWeaknessUses: 4,
          spellDeflectionUses: 1,
        },
      };

      const result = transformCharacterFromDB(dbCharacter);

      expect(result.featureUses.doubleCheckNotes).toEqual({
        current: 0,
        max: 1,
      });
      expect(result.featureUses.exploitWeaknessUses).toBe(4);
    });

    test("provides default values for missing fields", () => {
      const dbCharacter = {};

      const result = transformCharacterFromDB(dbCharacter);

      expect(result.abilityScores).toEqual({
        strength: 8,
        dexterity: 8,
        constitution: 8,
        intelligence: 8,
        wisdom: 8,
        charisma: 8,
      });
      expect(result.level).toBe(1);
      expect(result.corruptionPoints).toBe(0);
      expect(result.skillProficiencies).toEqual([]);
      expect(result.skillExpertise).toEqual([]);
      expect(result.featureUses).toEqual({
        doubleCheckNotes: { current: 1, max: 1 },
        signatureSpell1: { current: 1, max: 1 },
        signatureSpell2: { current: 1, max: 1 },
        exploitWeaknessUses: 0,
        spellDeflectionUses: 0,
      });
    });

    test("handles standard feats from database", () => {
      const dbCharacter = {
        standard_feats: ["Observant", "War Caster", "Elemental Adept"],
        level1_choice_type: "feat",
      };

      const result = transformCharacterFromDB(dbCharacter);

      expect(result.standardFeats).toEqual([
        "Observant",
        "War Caster",
        "Elemental Adept",
      ]);
    });

    test("extracts feat from asi_choices if standard_feats is empty", () => {
      const dbCharacter = {
        standard_feats: [],
        level1_choice_type: "feat",
        asi_choices: {
          1: { selectedFeat: "Mobile" },
        },
      };

      const result = transformCharacterFromDB(dbCharacter);

      expect(result.standardFeats).toEqual(["Mobile"]);
    });

    test("adds selectedInnateHeritage field", () => {
      const dbCharacter = {
        innate_heritage: "Giant-kin",
      };

      const result = transformCharacterFromDB(dbCharacter);

      expect(result.innateHeritage).toBe("Giant-kin");
      expect(result.selectedInnateHeritage).toBe("Giant-kin");
    });
  });

  describe("validateCastingStyleChoices", () => {
    test("validates Willpower Caster level 5 requirements", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 5,
      };

      const result = validateCastingStyleChoices(character);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Please select a Black Magic enhancement (Ambush, Gambit, Grudge, Pique, or Hubris)"
      );
    });

    test("passes validation for Willpower Caster with enhancement", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 5,
        blackMagicEnhancement: "Ambush",
      };

      const result = validateCastingStyleChoices(character);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test("validates Willpower Caster level 20 signature spells", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 20,
        blackMagicEnhancement: "Hubris",
      };

      const result = validateCastingStyleChoices(character);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Please select two 3rd-level spells as your signature spells"
      );
    });

    test("passes validation for complete level 20 Willpower Caster", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 20,
        blackMagicEnhancement: "Pique",
        signatureSpells: ["Counterspell", "Haste"],
      };

      const result = validateCastingStyleChoices(character);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test("validates Intellect Caster level 3 requirements", () => {
      const character = {
        castingStyle: "Intellect Caster",
        level: 3,
      };

      const result = validateCastingStyleChoices(character);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Please select two level 1 features from your School of Magic"
      );
    });

    test("validates Intellect Caster with insufficient features", () => {
      const character = {
        castingStyle: "Intellect Caster",
        level: 3,
        schoolOfMagicFeatures: ["Portent"],
      };

      const result = validateCastingStyleChoices(character);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Please select two level 1 features from your School of Magic"
      );
    });

    test("passes validation for complete Intellect Caster", () => {
      const character = {
        castingStyle: "Intellect Caster",
        level: 3,
        schoolOfMagicFeatures: ["Portent", "Expert Divination"],
      };

      const result = validateCastingStyleChoices(character);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test("validates multiple errors", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 20,
      };

      const result = validateCastingStyleChoices(character);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(2);
    });

    test("passes validation for other casting styles", () => {
      const character = {
        castingStyle: "Technique Caster",
        level: 20,
      };

      const result = validateCastingStyleChoices(character);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test("passes validation for low-level characters", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 2,
      };

      const result = validateCastingStyleChoices(character);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe("resetFeatureUsesAfterRest", () => {
    test("resets features after long rest", () => {
      const character = {
        featureUses: {
          doubleCheckNotes: { current: 0, max: 1 },
          signatureSpell1: { current: 0, max: 1 },
          signatureSpell2: { current: 0, max: 1 },
          exploitWeaknessUses: 5,
          spellDeflectionUses: 3,
        },
        rageActive: true,
        rageTurnsRemaining: 4,
        relentlessRageDC: 25,
      };

      const result = resetFeatureUsesAfterRest(character, "long");

      expect(result.doubleCheckNotes).toEqual({ current: 1, max: 1 });
      expect(result.signatureSpell1).toEqual({ current: 1, max: 1 });
      expect(result.signatureSpell2).toEqual({ current: 1, max: 1 });
      expect(character.rageActive).toBe(false);
      expect(character.rageTurnsRemaining).toBe(0);
      expect(character.relentlessRageDC).toBe(15);
    });

    test("resets signature spells on short rest for level 20 Willpower Caster", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 20,
        featureUses: {
          doubleCheckNotes: { current: 0, max: 1 },
          signatureSpell1: { current: 0, max: 1 },
          signatureSpell2: { current: 0, max: 1 },
        },
      };

      const result = resetFeatureUsesAfterRest(character, "short");

      expect(result.signatureSpell1).toEqual({ current: 1, max: 1 });
      expect(result.signatureSpell2).toEqual({ current: 1, max: 1 });
      expect(result.doubleCheckNotes).toEqual({ current: 0, max: 1 });
    });

    test("does not reset signature spells on short rest for lower level", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 19,
        featureUses: {
          signatureSpell1: { current: 0, max: 1 },
          signatureSpell2: { current: 0, max: 1 },
        },
      };

      const result = resetFeatureUsesAfterRest(character, "short");

      expect(result.signatureSpell1).toEqual({ current: 0, max: 1 });
      expect(result.signatureSpell2).toEqual({ current: 0, max: 1 });
    });

    test("handles character without rage properties", () => {
      const character = {
        featureUses: {
          doubleCheckNotes: { current: 0, max: 1 },
        },
      };

      const result = resetFeatureUsesAfterRest(character, "long");

      expect(result.doubleCheckNotes).toEqual({ current: 1, max: 1 });
    });

    test("defaults to long rest when type not specified", () => {
      const character = {
        featureUses: {
          doubleCheckNotes: { current: 0, max: 1 },
        },
      };

      const result = resetFeatureUsesAfterRest(character);

      expect(result.doubleCheckNotes).toEqual({ current: 1, max: 1 });
    });
  });

  describe("applyCastingStyleAbilityModifications", () => {
    test("applies +4 Constitution for level 20 Vigor Caster", () => {
      const character = {
        castingStyle: "Vigor Caster",
        level: 20,
        abilityScores: {
          strength: 16,
          dexterity: 12,
          constitution: 18,
          intelligence: 10,
          wisdom: 11,
          charisma: 13,
        },
      };

      const result = applyCastingStyleAbilityModifications(character);

      expect(result.constitution).toBe(22);
      expect(result.strength).toBe(16);
    });

    test("caps Constitution at 24", () => {
      const character = {
        castingStyle: "Vigor Caster",
        level: 20,
        abilityScores: {
          constitution: 22,
        },
      };

      const result = applyCastingStyleAbilityModifications(character);

      expect(result.constitution).toBe(24);
    });

    test('accepts "Vigor" as casting style', () => {
      const character = {
        castingStyle: "Vigor",
        level: 20,
        abilityScores: {
          constitution: 16,
        },
      };

      const result = applyCastingStyleAbilityModifications(character);

      expect(result.constitution).toBe(20);
    });

    test("does not modify for level 19 Vigor Caster", () => {
      const character = {
        castingStyle: "Vigor Caster",
        level: 19,
        abilityScores: {
          constitution: 18,
        },
      };

      const result = applyCastingStyleAbilityModifications(character);

      expect(result.constitution).toBe(18);
    });

    test("does not modify for other casting styles", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 20,
        abilityScores: {
          constitution: 14,
        },
      };

      const result = applyCastingStyleAbilityModifications(character);

      expect(result.constitution).toBe(14);
    });

    test("returns copy of ability scores", () => {
      const character = {
        castingStyle: "Technique Caster",
        level: 10,
        abilityScores: {
          strength: 10,
          dexterity: 14,
        },
      };

      const result = applyCastingStyleAbilityModifications(character);

      expect(result).not.toBe(character.abilityScores);
      expect(result).toEqual(character.abilityScores);
    });
  });

  describe("getCastingStyleChoiceOptions", () => {
    test("returns black magic enhancements for level 5+ Willpower Caster", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 5,
      };

      const result = getCastingStyleChoiceOptions(character);

      expect(result.blackMagicEnhancements).toBeDefined();
      expect(result.blackMagicEnhancements.length).toBe(5);
      expect(result.blackMagicEnhancements[0]).toEqual({
        name: "Ambush",
        description:
          "Advantage on attacks vs creatures that haven't acted; crits on surprised enemies",
      });
      expect(result.blackMagicEnhancements.map((e) => e.name)).toEqual([
        "Ambush",
        "Gambit",
        "Grudge",
        "Pique",
        "Hubris",
      ]);
    });

    test("does not return enhancements for level 4 Willpower Caster", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 4,
      };

      const result = getCastingStyleChoiceOptions(character);

      expect(result.blackMagicEnhancements).toBeUndefined();
    });

    test("returns empty school features array for Intellect Caster with subclass", () => {
      const character = {
        castingStyle: "Intellect Caster",
        level: 3,
        subclass: "Divination",
      };

      const result = getCastingStyleChoiceOptions(character);

      expect(result.schoolOfMagicFeatures).toBeDefined();
      expect(result.schoolOfMagicFeatures).toEqual([]);
    });

    test("does not return school features without subclass", () => {
      const character = {
        castingStyle: "Intellect Caster",
        level: 3,
      };

      const result = getCastingStyleChoiceOptions(character);

      expect(result.schoolOfMagicFeatures).toBeUndefined();
    });

    test("returns empty object for other casting styles", () => {
      const character = {
        castingStyle: "Technique Caster",
        level: 20,
      };

      const result = getCastingStyleChoiceOptions(character);

      expect(result).toEqual({});
    });

    test("handles multiple applicable options", () => {
      const character = {
        castingStyle: "Willpower Caster",
        level: 10,
      };

      const result = getCastingStyleChoiceOptions(character);

      expect(result.blackMagicEnhancements).toBeDefined();
      expect(Object.keys(result).length).toBe(1);
    });
  });
});
