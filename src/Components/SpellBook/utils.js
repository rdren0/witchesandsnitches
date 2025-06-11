import {
  INDIVIDUAL_SPELL_MODIFIERS,
  TRADITIONAL_SCHOOL_MAPPINGS,
  CATEGORY_DEFAULT_MAPPINGS,
} from "./spells";

export const getAbilityModifier = (score) => {
  if (score === null || score === undefined) return 0;
  return Math.floor((score - 10) / 2);
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
    divinations: "Divination",
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

export {
  formatSpellDescription,
  getModifierDisplay,
  getModifierInfo,
  getSpellModifier,
};
