import {
  CASTING_STYLE_FEATURES,
  getCastingStyleFeatures,
  getCastingStyleAC,
  getCastingStyleMetamagics,
  hasCastingStyleFeature,
  getFeatureDamageScaling,
} from "./castingStyleFeatures";

/**
 * Update character calculation functions to include casting style features
 */

export const calculateCharacterAC = (character) => {
  const dexModifier = Math.floor((character.dexterity - 10) / 2);

  const baseAC = getCastingStyleAC(character.castingStyle, 0);

  let totalAC = baseAC + dexModifier;

  if (character.magicModifiers?.ac) {
    totalAC += character.magicModifiers.ac;
  }

  return totalAC;
};

export const calculateInitiativeModifier = (character) => {
  let initiativeAbility = character.initiativeAbility || "dexterity";

  if (character.castingStyle === "Intellect" && character.level >= 1) {
    const intMod = Math.floor((character.intelligence - 10) / 2);
    const dexMod = Math.floor((character.dexterity - 10) / 2);

    if (intMod > dexMod) {
      initiativeAbility = "intelligence";
    }
  }

  const abilityScore = character[initiativeAbility] || 10;
  return Math.floor((abilityScore - 10) / 2);
};

export const getAllMetamagicOptions = (character) => {
  const metamagics = [];

  if (character.metamagicOptions) {
    metamagics.push(...character.metamagicOptions);
  }

  const styleMetamagics = getCastingStyleMetamagics(
    character.castingStyle,
    character.level
  );
  metamagics.push(...styleMetamagics);

  return metamagics;
};

export const getAllCharacterFeatures = (character) => {
  const features = [];

  if (character.standardFeats) {
    features.push(
      ...character.standardFeats.map((feat) => ({
        source: "feat",
        name: feat,
        type: "feat",
      }))
    );
  }

  if (character.subclassFeatures) {
    features.push(
      ...character.subclassFeatures.map((feature) => ({
        source: "subclass",
        name: feature,
        type: "subclass",
      }))
    );
  }

  const castingStyleFeatures = getCastingStyleFeatures(
    character.castingStyle,
    character.level
  );

  features.push(
    ...castingStyleFeatures.map((feature) => ({
      ...feature,
      source: "castingStyle",
      styleName: character.castingStyle,
    }))
  );

  return features;
};

export const calculateSpellDamageBonus = (character, spellType = "cantrip") => {
  let bonusDamage = [];

  if (character.castingStyle === "Willpower" && spellType === "cantrip") {
    const blackMagicDamage = getFeatureDamageScaling(
      "Willpower",
      "Black Magic",
      character.level
    );

    if (blackMagicDamage) {
      bonusDamage.push({
        source: "Black Magic",
        damage: blackMagicDamage,
        condition: "with advantage",
      });
    }
  }

  return bonusDamage;
};

export const getRestRecovery = (character, restType = "long") => {
  const recovery = {
    hitDice: 0,
    spellSlots: [],
    sorceryPoints: 0,
    features: [],
  };

  if (restType === "long") {
    recovery.hitDice = Math.ceil(character.level / 2);
    recovery.features.push("All spell slots");
    recovery.features.push("All sorcery points");
  }

  if (restType === "short") {
    if (character.castingStyle === "Technique" && character.level >= 20) {
      recovery.sorceryPoints = 4;
      recovery.features.push("Sorcerous Restoration: 4 sorcery points");
    }

    if (character.castingStyle === "Intellect" && character.level >= 20) {
      recovery.features.push(
        "Arcane Recovery: Recover spell slots (combined level ≤ 10)"
      );
    }

    if (character.castingStyle === "Willpower" && character.level >= 20) {
      recovery.features.push("Signature Spells: Regain uses");
    }
  }

  return recovery;
};

export const calculateEffectiveAbilityScores = (character) => {
  const scores = { ...character.abilityScores };

  if (character.castingStyle === "Vigor" && character.level >= 20) {
    scores.constitution = Math.min(24, scores.constitution + 4);
  }

  return scores;
};

export const initializeFeatureUses = (character) => {
  const featureUses = {};

  if (hasCastingStyleFeature(character, "Double Check Notes")) {
    featureUses.doubleCheckNotes = {
      current: 1,
      max: 1,
      recharge: "long rest",
    };
  }

  if (hasCastingStyleFeature(character, "Signature Spells")) {
    featureUses.signatureSpells = {
      spell1: { current: 1, max: 1 },
      spell2: { current: 1, max: 1 },
      recharge: "short rest",
    };
  }

  if (hasCastingStyleFeature(character, "Metamagic: Rage")) {
    featureUses.rage = {
      isActive: false,
      turnsRemaining: 0,
      relentlessRageDC: 15,
    };
  }

  return featureUses;
};

export const transformCastingStyleFeaturesToDB = (character) => {
  const features = getCastingStyleFeatures(
    character.castingStyle,
    character.level
  );

  return {
    casting_style_features: features.map((f) => f.name),
    casting_style_choices: {
      blackMagicEnhancement: character.blackMagicEnhancement || null,
      signatureSpells: character.signatureSpells || [],
    },
  };
};

export const transformCastingStyleFeaturesFromDB = (dbData) => {
  return {
    castingStyleFeatures: dbData.casting_style_features || [],
    blackMagicEnhancement: dbData.casting_style_choices?.blackMagicEnhancement,
    signatureSpells: dbData.casting_style_choices?.signatureSpells || [],
  };
};

export const getCastingStyleFeatureCards = (character) => {
  const features = getCastingStyleFeatures(
    character.castingStyle,
    character.level
  );

  return features.map((feature) => ({
    title: feature.name,
    level: feature.unlockedAt,
    type: feature.type,
    description: feature.description,
    mechanics: {
      cost: feature.cost,
      damage: feature.damage,
      duration: feature.duration,
      uses: feature.uses,
      effects: feature.effects,
    },
    source: `${character.castingStyle} Caster`,
    sourceColor: getCastingStyleColor(character.castingStyle),
  }));
};

export const getCastingStyleColor = (castingStyle) => {
  const colors = {
    Willpower: "#FF6B6B",
    Technique: "#4ECDC4",
    Intellect: "#6C5CE7",
    Vigor: "#F39C12",
  };
  return colors[castingStyle] || "#95A5A6";
};

export const validateCastingStyleChoices = (character) => {
  const errors = [];

  if (character.castingStyle === "Willpower" && character.level >= 5) {
    if (!character.blackMagicEnhancement) {
      errors.push("Please select a Black Magic enhancement");
    }
  }

  if (character.castingStyle === "Willpower" && character.level >= 20) {
    if (!character.signatureSpells || character.signatureSpells.length !== 2) {
      errors.push("Please select two signature spells");
    }
  }

  return errors;
};

export default {
  calculateCharacterAC,
  calculateInitiativeModifier,
  getAllMetamagicOptions,
  getAllCharacterFeatures,
  calculateSpellDamageBonus,
  getRestRecovery,
  calculateEffectiveAbilityScores,
  initializeFeatureUses,
  transformCastingStyleFeaturesToDB,
  transformCastingStyleFeaturesFromDB,
  getCastingStyleFeatureCards,
  getCastingStyleColor,
  validateCastingStyleChoices,
};
