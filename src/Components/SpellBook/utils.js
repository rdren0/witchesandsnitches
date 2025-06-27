import {
  INDIVIDUAL_SPELL_MODIFIERS,
  TRADITIONAL_SCHOOL_MAPPINGS,
  CATEGORY_DEFAULT_MAPPINGS,
} from "./spells";

export const getAbilityModifier = (score) => {
  if (score === null || score === undefined) return 0;
  return Math.floor((score - 10) / 2);
};

export const hasSubclassFeature = (character, featureName) => {
  return character?.subclassFeatures?.includes(featureName) || false;
};

export const getResearcherBonuses = (character) => {
  if (!hasSubclassFeature(character, "Researcher")) {
    return {
      researchBonus: 0,
      grantsDoubleTags: false,
      hasDevictoAccess: false,
    };
  }

  const wisdomMod = Math.floor((character.abilityScores.wisdom - 10) / 2);
  return {
    researchBonus: Math.floor(wisdomMod / 2),
    grantsDoubleTags: true,
    hasDevictoAccess: true,
  };
};

const getResearchModifier = (spellName, subject, character) => {
  let modifier = getSpellModifier(spellName, subject, character);

  if (hasSubclassFeature(character, "Researcher")) {
    const researcherBonuses = getResearcherBonuses(character);
    modifier += researcherBonuses.researchBonus;
  }

  return modifier;
};

const formatSpellDescription = (description) => {
  if (!description) return null;

  const lines = description.split("\n");
  const spellName = lines[0];
  const subtitle = lines[1] || "";
  const details = lines.slice(2).join("\n").trim();

  return {
    name: spellName,
    subtitle: subtitle,
    details: details,
  };
};

const getModifierInfo = (spellName, subject, character) => {
  let mapping = null;
  let source = "Unknown";

  if (INDIVIDUAL_SPELL_MODIFIERS[spellName]) {
    mapping = INDIVIDUAL_SPELL_MODIFIERS[spellName];
    source = `Individual Spell (${spellName})`;
  } else if (TRADITIONAL_SCHOOL_MAPPINGS[subject]) {
    mapping = TRADITIONAL_SCHOOL_MAPPINGS[subject];
    source = `${subject} School`;
  } else if (CATEGORY_DEFAULT_MAPPINGS[subject]) {
    mapping = CATEGORY_DEFAULT_MAPPINGS[subject];
    source = `${subject} Category Default`;
  }

  if (!mapping) {
    return {
      source: "No Modifier Applied",
      abilityName: "None",
      abilityModifier: 0,
      wandModifier: 0,
      wandType: "None",
    };
  }
  const abilityScore = character.abilityScores[mapping.abilityScore];
  const abilityModifier = getAbilityModifier(abilityScore);
  const wandModifier = character.magicModifiers[mapping.wandModifier] || 0;

  const wandTypeMap = {
    charms: "Charms",
    jinxesHexesCurses: "JHC",
    transfiguration: "Transfiguration",
    healing: "Healing",
    divinations: "Divinations",
  };

  return {
    source,
    abilityName:
      mapping.abilityScore.charAt(0).toUpperCase() +
      mapping.abilityScore.slice(1),
    abilityModifier,
    wandModifier,
    wandType: wandTypeMap[mapping.wandModifier] || mapping.wandModifier,
  };
};

const getResearchModifierInfo = (spellName, subject, character) => {
  const baseInfo = getModifierInfo(spellName, subject, character);

  if (hasSubclassFeature(character, "Researcher")) {
    const researcherBonuses = getResearcherBonuses(character);
    return {
      ...baseInfo,
      researcherBonus: researcherBonuses.researchBonus,
      hasResearcherBonus: true,
      source: baseInfo.source + " + Researcher",
    };
  }

  return {
    ...baseInfo,
    researcherBonus: 0,
    hasResearcherBonus: false,
  };
};

const getModifierDisplay = (spellName, subject, character) => {
  const modifier = getSpellModifier(spellName, subject, character);
  if (modifier === 0) return null;

  const isIndividualOverride = INDIVIDUAL_SPELL_MODIFIERS[spellName];
  const modifierInfo = getModifierInfo(spellName, subject, character);

  return (
    <span
      style={{
        fontSize: "12px",
        color: modifier >= 0 ? "#10b981" : "#ef4444",
        fontWeight: "600",
        marginLeft: "8px",
        backgroundColor: isIndividualOverride ? "#fef3c7" : "transparent",
        padding: isIndividualOverride ? "2px 4px" : "0",
        borderRadius: isIndividualOverride ? "3px" : "0",
      }}
      title={`${modifierInfo.source}: ${modifierInfo.abilityName} ${
        modifierInfo.abilityModifier >= 0 ? "+" : ""
      }${modifierInfo.abilityModifier} + Wand ${
        modifierInfo.wandModifier >= 0 ? "+" : ""
      }${modifierInfo.wandModifier}`}
    >
      ({modifier >= 0 ? "+" : ""}
      {modifier})
      {isIndividualOverride && <span style={{ color: "#f59e0b" }}>*</span>}
    </span>
  );
};

const getResearchModifierDisplay = (spellName, subject, character) => {
  const researchModifier = getResearchModifier(spellName, subject, character);

  if (researchModifier === 0) return null;

  const isIndividualOverride = INDIVIDUAL_SPELL_MODIFIERS[spellName];
  const modifierInfo = getResearchModifierInfo(spellName, subject, character);
  const hasResearcherBonus = hasSubclassFeature(character, "Researcher");

  let tooltipText = `${modifierInfo.source}: ${modifierInfo.abilityName} ${
    modifierInfo.abilityModifier >= 0 ? "+" : ""
  }${modifierInfo.abilityModifier} + Wand ${
    modifierInfo.wandModifier >= 0 ? "+" : ""
  }${modifierInfo.wandModifier}`;

  if (hasResearcherBonus) {
    tooltipText += ` + Researcher (½ Wis) ${
      modifierInfo.researcherBonus >= 0 ? "+" : ""
    }${modifierInfo.researcherBonus}`;
  }

  return (
    <span
      style={{
        fontSize: "12px",
        color: researchModifier >= 0 ? "#10b981" : "#ef4444",
        fontWeight: "600",
        marginLeft: "8px",
        backgroundColor: isIndividualOverride
          ? "#fef3c7"
          : hasResearcherBonus
          ? "#e0e7ff"
          : "transparent",
        padding: isIndividualOverride || hasResearcherBonus ? "2px 4px" : "0",
        borderRadius: isIndividualOverride || hasResearcherBonus ? "3px" : "0",
        border: hasResearcherBonus ? "1px solid #8b5cf6" : "none",
      }}
      title={tooltipText}
    >
      ({researchModifier >= 0 ? "+" : ""}
      {researchModifier})
      {isIndividualOverride && <span style={{ color: "#f59e0b" }}>*</span>}
      {hasResearcherBonus && <span style={{ color: "#8b5cf6" }}>📚</span>}
    </span>
  );
};

const getSpellModifier = (spellName, subject, character) => {
  if (!character || !character.abilityScores || !character.magicModifiers) {
    return 0;
  }

  let mapping = null;

  if (INDIVIDUAL_SPELL_MODIFIERS[spellName]) {
    mapping = INDIVIDUAL_SPELL_MODIFIERS[spellName];
  } else if (TRADITIONAL_SCHOOL_MAPPINGS[subject]) {
    mapping = TRADITIONAL_SCHOOL_MAPPINGS[subject];
  } else if (CATEGORY_DEFAULT_MAPPINGS[subject]) {
    mapping = CATEGORY_DEFAULT_MAPPINGS[subject];
  }

  if (!mapping) {
    return 0;
  }

  const abilityScore = character.abilityScores[mapping.abilityScore];
  const abilityModifier = getAbilityModifier(abilityScore);
  const wandModifier = character.magicModifiers[mapping.wandModifier] || 0;

  return abilityModifier + wandModifier;
};

const getSpellTags = (spell, character, isResearched = false) => {
  const baseTags = spell.tags || [];

  if (hasSubclassFeature(character, "Researcher") && isResearched) {
    const enhancedTags = [...baseTags];
    if (!enhancedTags.includes("Arithmantic")) {
      enhancedTags.push("Arithmantic");
    }
    if (!enhancedTags.includes("Runic")) {
      enhancedTags.push("Runic");
    }
    return enhancedTags;
  }

  return baseTags;
};

const hasDevictoAccess = (character) => {
  return hasSubclassFeature(character, "Researcher");
};

const validateSubclassFeatures = (character) => {
  const validFeatures = [
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
  ];

  if (!character.subclassFeatures) return [];

  return character.subclassFeatures.filter((feature) =>
    validFeatures.includes(feature)
  );
};

const getCharacterBonuses = (character) => {
  const bonuses = {
    research: 0,
    spellTags: [],
    specialAccess: [],
    enhancedCasting: {},
  };

  if (hasSubclassFeature(character, "Researcher")) {
    const researcherBonuses = getResearcherBonuses(character);
    bonuses.research += researcherBonuses.researchBonus;
    bonuses.spellTags.push("Auto Arithmantic/Runic on research");
    bonuses.specialAccess.push("Enhanced Devicto");
  }

  return bonuses;
};

export {
  formatSpellDescription,
  getModifierDisplay,
  getModifierInfo,
  getSpellModifier,
  getResearchModifierDisplay,
  getResearchModifierInfo,
  getResearchModifier,
  getSpellTags,
  hasDevictoAccess,
  validateSubclassFeatures,
  getCharacterBonuses,
};
