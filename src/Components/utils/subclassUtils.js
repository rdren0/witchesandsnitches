// subclassUtils.js - Helper functions for managing subclass features and bonuses

import { getAbilityModifier } from "../Spells/utils";

// Valid subclass features for validation
export const VALID_SUBCLASS_FEATURES = [
  // Arithmancy & Runes subclass
  "Researcher",
  "School of Magic Expert",
  "Enhanced Spellwork",
  "Private Lessons",
  "Spellmaker",
  "Metamagical Application",
  "Nimble Fingers",
  "School of Magic Prodigy",
  "Perfected Spellwork",
  "Spell Tome",

  // Other subclasses (add as needed)
  "Auror Training",
  "Curse-Breaking",
  "Study Buddy",
  "Quick Skim",
  "Practice Makes Perfect",
  "Master of None",
  "Imbuement",
  "Harmonancy",
];

// Subclass information
export const SUBCLASS_INFO = {
  "Arithmancy & Runes": {
    name: "Arithmancy & Runes",
    description:
      "Academic spellcasters who master ancient magical theory through mathematical precision and runic symbols",
    primaryFeatures: ["Researcher", "School of Magic Expert"],
    maxLevel: 20,
  },
  "Jinxes, Hexes, and Curses": {
    name: "Jinxes, Hexes, and Curses",
    description:
      "Specialists in harmful magic, curse-breaking, and dark arts combat",
    primaryFeatures: ["Auror Training", "Curse-Breaking"],
    maxLevel: 20,
  },
  Historian: {
    name: "Historian",
    description:
      "Scholarly spellcasters who draw power from extensive research and intellectual mastery",
    primaryFeatures: ["Study Buddy", "Quick Skim"],
    maxLevel: 20,
  },
  Artisan: {
    name: "Artisan",
    description:
      "Creative spellcasters who blend magical theory with artistic expression",
    primaryFeatures: ["Practice Makes Perfect", "Master of None"],
    maxLevel: 20,
  },
};

// Check if character has a specific subclass feature
export const hasSubclassFeature = (character, featureName) => {
  if (
    !character?.subclassFeatures ||
    !Array.isArray(character.subclassFeatures)
  ) {
    return false;
  }
  return character.subclassFeatures.includes(featureName);
};

// Get all features for a character's subclass level
export const getAvailableFeatures = (subclassName, level = 1) => {
  const features = [];

  // Add level-appropriate features based on subclass
  if (subclassName === "Arithmancy & Runes") {
    if (level >= 1) features.push("Researcher", "School of Magic Expert");
    if (level >= 6) features.push("Enhanced Spellwork", "Private Lessons");
    if (level >= 10) features.push("Spellmaker", "Metamagical Application");
    if (level >= 14) features.push("Nimble Fingers", "School of Magic Prodigy");
    if (level >= 18) features.push("Perfected Spellwork", "Spell Tome");
  }

  return features;
};

// Validate character's subclass features
export const validateCharacterFeatures = (character) => {
  if (!character.subclassFeatures) return true;

  const validFeatures = character.subclassFeatures.every((feature) =>
    VALID_SUBCLASS_FEATURES.includes(feature)
  );

  const levelAppropriate = character.subclassFeatures.every((feature) => {
    const availableFeatures = getAvailableFeatures(
      character.subclass,
      character.subclassLevel || 1
    );
    return availableFeatures.includes(feature);
  });

  return validFeatures && levelAppropriate;
};

// Get Researcher-specific bonuses
export const getResearcherBonuses = (character) => {
  if (!hasSubclassFeature(character, "Researcher")) {
    return {
      researchBonus: 0,
      grantsDoubleTags: false,
      hasDevictoAccess: false,
      wisdomModifier: 0,
    };
  }

  const wisdomModifier = getAbilityModifier(
    character.abilityScores?.wisdom || 10
  );
  const researchBonus = Math.floor(wisdomModifier / 2);

  return {
    researchBonus: Math.max(0, researchBonus), // Minimum 0
    grantsDoubleTags: true,
    hasDevictoAccess: true,
    wisdomModifier,
  };
};

// Get all bonuses for a character
export const getAllCharacterBonuses = (character) => {
  const bonuses = {
    research: 0,
    spellAttacks: 0,
    spellSaves: 0,
    specialAccess: [],
    enhancedSpells: [],
    additionalUses: {},
    passiveEffects: [],
  };

  // Researcher bonuses
  if (hasSubclassFeature(character, "Researcher")) {
    const researcherBonuses = getResearcherBonuses(character);
    bonuses.research += researcherBonuses.researchBonus;
    bonuses.specialAccess.push("Enhanced Devicto with both tags");
    bonuses.enhancedSpells.push(
      "All researched spells gain Arithmantic and Runic tags"
    );
  }

  // Enhanced Spellwork bonuses
  if (hasSubclassFeature(character, "Enhanced Spellwork")) {
    bonuses.enhancedSpells.push(
      "Runic spells: +1 minute duration, 1d6 psychic damage/round"
    );
    bonuses.enhancedSpells.push(
      "Arithmantic spells: +10 feet range, Dedication becomes Concentration"
    );
  }

  // Nimble Fingers bonuses
  if (hasSubclassFeature(character, "Nimble Fingers")) {
    const dexModifier = getAbilityModifier(
      character.abilityScores?.dexterity || 10
    );
    bonuses.spellAttacks += Math.ceil(dexModifier / 2);
    bonuses.spellSaves += Math.floor(dexModifier / 2);
    bonuses.passiveEffects.push("Sleight of Hand proficiency/expertise");
  }

  // Add other subclass bonuses as they're implemented

  return bonuses;
};

// Get spell enhancement based on tags and character features
export const getSpellEnhancements = (spellName, spellTags, character) => {
  const enhancements = {
    duration: null,
    range: null,
    damage: null,
    castingChange: null,
    special: [],
  };

  if (!spellTags || !character) return enhancements;

  const hasArithmantic = spellTags.includes("Arithmantic");
  const hasRunic = spellTags.includes("Runic");

  // Enhanced Spellwork feature effects
  if (hasSubclassFeature(character, "Enhanced Spellwork")) {
    if (hasRunic) {
      enhancements.duration = "+1 minute";
      enhancements.damage = "1d6 psychic per round";
    }

    if (hasArithmantic) {
      enhancements.range = "+10 feet";
      enhancements.castingChange = "Dedication → Concentration";
    }
  }

  // Perfected Spellwork feature effects
  if (hasSubclassFeature(character, "Perfected Spellwork")) {
    if (hasRunic) {
      enhancements.special.push("Maximum damage dice once per round");
    }

    if (hasArithmantic) {
      enhancements.special.push("Maximum healing dice once per round");
    }
  }

  // Spells with both tags get special bonuses
  if (hasArithmantic && hasRunic) {
    if (hasSubclassFeature(character, "Spellmaker")) {
      enhancements.special.push("Cast using 1 lower spell slot level");
    }

    if (hasSubclassFeature(character, "Nimble Fingers")) {
      const dexModifier = getAbilityModifier(
        character.abilityScores?.dexterity || 10
      );
      enhancements.special.push(
        `+${Math.ceil(dexModifier / 2)} spell attack, +${Math.floor(
          dexModifier / 2
        )} spell save DC`
      );
    }
  }

  return enhancements;
};

// Create a character with subclass features
export const createCharacterWithSubclass = (
  baseCharacter,
  subclassName,
  features = []
) => {
  return {
    ...baseCharacter,
    subclass: subclassName,
    subclassLevel: 1,
    subclassFeatures: features.filter((f) =>
      VALID_SUBCLASS_FEATURES.includes(f)
    ),
  };
};

// Update character's subclass features
export const updateCharacterSubclass = (character, updates) => {
  const validUpdates = {};

  if (updates.subclass && SUBCLASS_INFO[updates.subclass]) {
    validUpdates.subclass = updates.subclass;
  }

  if (
    updates.subclassLevel &&
    updates.subclassLevel >= 1 &&
    updates.subclassLevel <= 20
  ) {
    validUpdates.subclassLevel = updates.subclassLevel;
  }

  if (updates.subclassFeatures && Array.isArray(updates.subclassFeatures)) {
    validUpdates.subclassFeatures = updates.subclassFeatures.filter((f) =>
      VALID_SUBCLASS_FEATURES.includes(f)
    );
  }

  return {
    ...character,
    ...validUpdates,
  };
};

// Get display information for character's subclass
export const getSubclassDisplayInfo = (character) => {
  if (!character.subclass) {
    return {
      name: "No Subclass",
      description: "Character has not selected a subclass specialization",
      level: 0,
      features: [],
      bonuses: [],
    };
  }

  const subclassInfo = SUBCLASS_INFO[character.subclass];
  const bonuses = getAllCharacterBonuses(character);

  return {
    name: subclassInfo?.name || character.subclass,
    description: subclassInfo?.description || "",
    level: character.subclassLevel || 1,
    features: character.subclassFeatures || [],
    bonuses: bonuses,
    isValid: validateCharacterFeatures(character),
  };
};

// Export utility for spell access checks
export const hasSpellAccess = (character, spellName) => {
  // Check for special Researcher access to Devicto
  if (spellName === "Devicto" && hasSubclassFeature(character, "Researcher")) {
    return true;
  }

  // Add other special access checks here

  return false; // Default to normal access rules
};

// Get tooltip text for subclass features
export const getFeatureTooltip = (featureName) => {
  const tooltips = {
    Researcher:
      "Add half Wisdom modifier to research checks. All researched spells gain both Arithmantic and Runic tags. Gain enhanced Devicto access.",
    "Enhanced Spellwork":
      "Runic spells: +1 minute duration, 1d6 psychic/round. Arithmantic spells: +10 feet range, Dedication→Concentration.",
    "Nimble Fingers":
      "Sleight of Hand expertise. Spells with both tags: +½ Dex to spell attacks/saves.",
    Spellmaker: "Spells with both tags cast using 1 lower spell slot.",
    "Private Lessons":
      "Extra spell attempts in classes, -2 DC, all spells gain both tags.",
    "Perfected Spellwork":
      "Once per round: maximum dice instead of rolling for enhanced spells.",
  };

  return tooltips[featureName] || `${featureName} - Subclass feature effect`;
};

export default {
  hasSubclassFeature,
  getResearcherBonuses,
  getAllCharacterBonuses,
  getSpellEnhancements,
  createCharacterWithSubclass,
  updateCharacterSubclass,
  getSubclassDisplayInfo,
  hasSpellAccess,
  getFeatureTooltip,
  validateCharacterFeatures,
  VALID_SUBCLASS_FEATURES,
  SUBCLASS_INFO,
};
