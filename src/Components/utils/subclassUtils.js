import { getAbilityModifier } from "../Spells/utils";

export const VALID_SUBCLASS_FEATURES = [
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

  "Auror Training",
  "Curse-Breaking",
  "Study Buddy",
  "Quick Skim",
  "Practice Makes Perfect",
  "Master of None",
  "Imbuement",
  "Harmonancy",
];

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

export const hasSubclassFeature = (character, featureName) => {
  if (
    !character?.subclassFeatures ||
    !Array.isArray(character.subclassFeatures)
  ) {
    return false;
  }
  return character.subclassFeatures.includes(featureName);
};

export const getAvailableFeatures = (subclassName, level = 1) => {
  const features = [];

  if (subclassName === "Arithmancy & Runes") {
    if (level >= 1) features.push("Researcher", "School of Magic Expert");
    if (level >= 6) features.push("Enhanced Spellwork", "Private Lessons");
    if (level >= 10) features.push("Spellmaker", "Metamagical Application");
    if (level >= 14) features.push("Nimble Fingers", "School of Magic Prodigy");
    if (level >= 18) features.push("Perfected Spellwork", "Spell Tome");
  }

  return features;
};

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

export const getResearcherBonuses = (character) => {
  return {
    researchBonus: 0,
    grantsDoubleTags: false,
    hasDevictoAccess: false,
    wisdomModifier: 0,
  };
};

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

  if (hasSubclassFeature(character, "Researcher")) {
    const researcherBonuses = getResearcherBonuses(character);
    bonuses.research += researcherBonuses.researchBonus;
    bonuses.specialAccess.push("Enhanced Devicto with both tags");
    bonuses.enhancedSpells.push(
      "All researched spells gain Arithmantic and Runic tags"
    );
  }

  if (hasSubclassFeature(character, "Enhanced Spellwork")) {
    bonuses.enhancedSpells.push(
      "Runic spells: +1 minute duration, 1d6 psychic damage/round"
    );
    bonuses.enhancedSpells.push(
      "Arithmantic spells: +10 feet range, Dedication becomes Concentration"
    );
  }

  if (hasSubclassFeature(character, "Nimble Fingers")) {
    const dexModifier = getAbilityModifier(
      character.abilityScores?.dexterity || 10
    );
    bonuses.spellAttacks += Math.ceil(dexModifier / 2);
    bonuses.spellSaves += Math.floor(dexModifier / 2);
    bonuses.passiveEffects.push("Sleight of Hand proficiency/expertise");
  }

  return bonuses;
};

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

  if (hasSubclassFeature(character, "Perfected Spellwork")) {
    if (hasRunic) {
      enhancements.special.push("Maximum damage dice once per round");
    }

    if (hasArithmantic) {
      enhancements.special.push("Maximum healing dice once per round");
    }
  }

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
  getFeatureTooltip,
  validateCharacterFeatures,
  VALID_SUBCLASS_FEATURES,
  SUBCLASS_INFO,
};
