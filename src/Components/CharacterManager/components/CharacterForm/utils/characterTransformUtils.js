export const transformCharacterForSave = (character) => {
  const skillProficiencies = Array.isArray(character.skillProficiencies)
    ? character.skillProficiencies
    : [];

  const skillExpertise = Array.isArray(character.skillExpertise)
    ? character.skillExpertise
    : [];

  const allFeats = [];

  if (character.level1ChoiceType === "feat" && character.standardFeats) {
    allFeats.push(...character.standardFeats);
  }

  if (character.asiChoices) {
    Object.values(character.asiChoices).forEach((choice) => {
      if (choice.type === "feat" && choice.selectedFeat) {
        allFeats.push(choice.selectedFeat);
      }
    });
  }

  const castingStyleChoices = {
    blackMagicEnhancement: character.blackMagicEnhancement || null,
    signatureSpells: character.signatureSpells || [],
    schoolOfMagicFeatures: character.schoolOfMagicFeatures || [],
    doubleCheckNotesUsed: character.doubleCheckNotesUsed || false,
    rageActive: character.rageActive || false,
    rageTurnsRemaining: character.rageTurnsRemaining || 0,
    relentlessRageDC: character.relentlessRageDC || 15,
  };

  const featureUses = {
    doubleCheckNotes: character.featureUses?.doubleCheckNotes || {
      current: 1,
      max: 1,
    },
    signatureSpell1: character.featureUses?.signatureSpell1 || {
      current: 1,
      max: 1,
    },
    signatureSpell2: character.featureUses?.signatureSpell2 || {
      current: 1,
      max: 1,
    },
    exploitWeaknessUses: character.featureUses?.exploitWeaknessUses || 0,
    spellDeflectionUses: character.featureUses?.spellDeflectionUses || 0,
  };

  return {
    ability_scores: character.abilityScores || {
      strength: 8,
      dexterity: 8,
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8,
    },
    asi_choices: character.asiChoices || {},
    background: character.background,
    base_ability_scores: character.baseAbilityScores || null,
    casting_style_choices: castingStyleChoices,
    casting_style: character.castingStyle,
    corruption_points: character.corruptionPoints || 0,
    current_hit_dice: character.level || 1,
    current_hit_points: character.currentHitPoints || character.hitPoints || 0,
    discord_user_id: character.discordUserId || character.discord_user_id || "",
    feat_choices: character.featChoices || {},
    feature_uses: featureUses,
    game_session: character.gameSession || "",
    heritage_choices: character.heritageChoices || {},
    hit_points: character.hitPoints || 0,
    house_choices: character.houseChoices || {},
    house: character.house,
    image_url: character.imageUrl || character.image_url || null,
    initiative_ability: character.initiativeAbility || "dexterity",
    innate_heritage_skills: character.innateHeritageSkills || [],
    innate_heritage: character.innateHeritage,
    level: character.level || 1,
    level1_choice_type: character.level1ChoiceType,
    magic_modifiers: character.magicModifiers || {},
    name: character.name?.trim() || "",
    notes: character.notes || null,
    school_year: character.schoolYear || 1,
    skill_expertise: skillExpertise,
    skill_proficiencies: skillProficiencies,
    standard_feats: allFeats,
    subclass_choices: character.subclassChoices || {},
    subclass: character.subclass,
    tool_proficiencies: character.toolProficiencies || [],
    wand_type: character.wandType || "",
  };
};

export const transformCharacterFromDB = (dbCharacter) => {
  if (!dbCharacter) return null;

  const castingStyleChoices = dbCharacter.casting_style_choices || {};
  const featureUses = dbCharacter.feature_uses || {};

  return {
    abilityScores: dbCharacter.ability_scores || {
      strength: 8,
      dexterity: 8,
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8,
    },
    asiChoices: dbCharacter.asi_choices || {},
    background: dbCharacter.background,
    baseAbilityScores: dbCharacter.base_ability_scores || null,

    blackMagicEnhancement: castingStyleChoices.blackMagicEnhancement || null,
    signatureSpells: castingStyleChoices.signatureSpells || [],
    schoolOfMagicFeatures: castingStyleChoices.schoolOfMagicFeatures || [],
    doubleCheckNotesUsed: castingStyleChoices.doubleCheckNotesUsed || false,
    rageActive: castingStyleChoices.rageActive || false,
    rageTurnsRemaining: castingStyleChoices.rageTurnsRemaining || 0,
    relentlessRageDC: castingStyleChoices.relentlessRageDC || 15,

    castingStyle: dbCharacter.casting_style,
    corruptionPoints: dbCharacter.corruption_points || 0,
    createdAt: dbCharacter.created_at,
    currentHitDice: dbCharacter.current_hit_dice || 1,
    currentHitPoints: dbCharacter.current_hit_points || 0,
    discordUserId: dbCharacter.discord_user_id || "",
    featChoices: dbCharacter.feat_choices || {},

    featureUses: {
      doubleCheckNotes: featureUses.doubleCheckNotes || { current: 1, max: 1 },
      signatureSpell1: featureUses.signatureSpell1 || { current: 1, max: 1 },
      signatureSpell2: featureUses.signatureSpell2 || { current: 1, max: 1 },
      exploitWeaknessUses: featureUses.exploitWeaknessUses || 0,
      spellDeflectionUses: featureUses.spellDeflectionUses || 0,
    },

    gameSession: dbCharacter.game_session || "",
    heritageChoices: dbCharacter.heritage_choices || {},
    hitPoints: dbCharacter.hit_points || 0,
    house: dbCharacter.house,
    houseChoices: dbCharacter.house_choices || {},
    id: dbCharacter.id,
    imageUrl: dbCharacter.image_url || null,
    initiativeAbility: dbCharacter.initiative_ability || "dexterity",
    innateHeritage: dbCharacter.innate_heritage,
    innateHeritageSkills: dbCharacter.innate_heritage_skills || [],
    level: dbCharacter.level || 1,
    level1ChoiceType: dbCharacter.level1_choice_type,
    magicModifiers: dbCharacter.magic_modifiers || {},
    name: dbCharacter.name || "",
    notes: dbCharacter.notes || "",
    schoolYear: dbCharacter.school_year || 1,
    selectedInnateHeritage: dbCharacter.innate_heritage,
    skillExpertise: dbCharacter.skill_expertise || [],
    skillProficiencies: dbCharacter.skill_proficiencies || [],
    standardFeats: (() => {
      if (dbCharacter.standard_feats && dbCharacter.standard_feats.length > 0) {
        return dbCharacter.standard_feats;
      }

      if (
        dbCharacter.level1_choice_type === "feat" &&
        dbCharacter.asi_choices?.["1"]?.selectedFeat
      ) {
        return [dbCharacter.asi_choices["1"].selectedFeat];
      }

      return [];
    })(),
    subclass: dbCharacter.subclass,
    subclassChoices: dbCharacter.subclass_choices || {},
    toolProficiencies: dbCharacter.tool_proficiencies || [],
    updatedAt: dbCharacter.updated_at,
    wandType: dbCharacter.wand_type || "",
  };
};

export const validateCastingStyleChoices = (character) => {
  const errors = [];

  if (character.castingStyle === "Willpower Caster" && character.level >= 5) {
    if (!character.blackMagicEnhancement) {
      errors.push(
        "Please select a Black Magic enhancement (Ambush, Gambit, Grudge, Pique, or Hubris)"
      );
    }
  }

  if (character.castingStyle === "Willpower Caster" && character.level >= 20) {
    if (!character.signatureSpells || character.signatureSpells.length !== 2) {
      errors.push(
        "Please select two 3rd-level spells as your signature spells"
      );
    }
  }

  if (character.castingStyle === "Intellect Caster" && character.level >= 3) {
    if (
      !character.schoolOfMagicFeatures ||
      character.schoolOfMagicFeatures.length < 2
    ) {
      errors.push(
        "Please select two level 1 features from your School of Magic"
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const resetFeatureUsesAfterRest = (character, restType = "long") => {
  const updatedFeatureUses = { ...character.featureUses };

  if (restType === "long") {
    updatedFeatureUses.doubleCheckNotes = { current: 1, max: 1 };
    updatedFeatureUses.signatureSpell1 = { current: 1, max: 1 };
    updatedFeatureUses.signatureSpell2 = { current: 1, max: 1 };

    if (character.rageActive) {
      character.rageActive = false;
      character.rageTurnsRemaining = 0;
      character.relentlessRageDC = 15;
    }
  } else if (restType === "short") {
    if (
      character.castingStyle === "Willpower Caster" &&
      character.level >= 20
    ) {
      updatedFeatureUses.signatureSpell1 = { current: 1, max: 1 };
      updatedFeatureUses.signatureSpell2 = { current: 1, max: 1 };
    }
  }

  return updatedFeatureUses;
};

export const applyCastingStyleAbilityModifications = (character) => {
  const modifiedScores = { ...character.abilityScores };

  if (
    (character.castingStyle === "Vigor Caster" ||
      character.castingStyle === "Vigor") &&
    character.level >= 20
  ) {
    modifiedScores.constitution = Math.min(24, modifiedScores.constitution + 4);
  }

  return modifiedScores;
};

export const getCastingStyleChoiceOptions = (character) => {
  const options = {};

  if (character.castingStyle === "Willpower Caster" && character.level >= 5) {
    options.blackMagicEnhancements = [
      {
        name: "Ambush",
        description:
          "Advantage on attacks vs creatures that haven't acted; crits on surprised enemies",
      },
      {
        name: "Gambit",
        description:
          "Use Black Magic within 5 ft without advantage (if alone with target)",
      },
      {
        name: "Grudge",
        description:
          "Advantage on attacks vs creatures that damaged you since last turn",
      },
      {
        name: "Pique",
        description: "Advantage on attacks when at half HP or less",
      },
      {
        name: "Hubris",
        description: "Advantage on attacks vs creatures with fewer HP than you",
      },
    ];
  }

  if (
    character.castingStyle === "Intellect Caster" &&
    character.level >= 3 &&
    character.subclass
  ) {
    options.schoolOfMagicFeatures = [];
  }

  return options;
};
