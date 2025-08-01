import { allSkills } from "../../SharedData/data";

export const getModifier = (score) => Math.floor((score - 10) / 2);
export const formatModifier = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);
export const modifiers = (character) =>
  character
    ? {
        strength: getModifier(character.strength),
        dexterity: getModifier(character.dexterity),
        constitution: getModifier(character.constitution),
        intelligence: getModifier(character.intelligence),
        wisdom: getModifier(character.wisdom),
        charisma: getModifier(character.charisma),
      }
    : {};

const getAllCharacterFeats = (character) => {
  const allFeats = [...(character.standardFeats || [])];

  if (character.asiChoices) {
    Object.entries(character.asiChoices).forEach(([level, choice]) => {
      if (choice.type === "feat" && choice.selectedFeat) {
        allFeats.push(choice.selectedFeat);
      }
    });
  }

  return allFeats;
};

export const calculateModifier = (skillName, character) => {
  if (!character) return 0;

  const skill = allSkills.find((s) => s.name === skillName);
  if (!skill) {
    console.warn(`Skill "${skillName}" not found in allSkills data`);
    return 0;
  }

  const abilityScore = character[skill.ability] || 10;
  const abilityMod = Math.floor((abilityScore - 10) / 2);

  const skillLevel = character.skills?.[skillName] || 0;
  const profBonus = character.proficiencyBonus || 0;

  let totalModifier = abilityMod;

  if (skillLevel >= 1) {
    totalModifier += profBonus;
  }
  if (skillLevel >= 2) {
    totalModifier += profBonus;
  }

  return totalModifier;
};

export const calculatePassiveSkill = (skillName, character) => {
  if (!character) return 10;

  const skillModifier = calculateModifier(skillName, character);

  let passiveValue = 10 + skillModifier;

  const allFeats = getAllCharacterFeats(character);

  allFeats.forEach((feat) => {
    const cleanFeatName = feat.replace(/\s*\(Level \d+\)$/, "");

    switch (cleanFeatName.toLowerCase()) {
      case "observant":
        if (skillName === "perception" || skillName === "investigation") {
          passiveValue += 5;
        }
        break;
      case "alert":
        if (skillName === "perception") {
        }
        break;

      case "keen mind":
        if (skillName === "investigation") {
        }
        break;
      case "silver tongue":
        if (skillName === "deception") {
        }
        break;
    }
  });

  return passiveValue;
};

export const calculatePassivePerception = (character) => {
  return calculatePassiveSkill("perception", character);
};

export const calculatePassiveInvestigation = (character) => {
  return calculatePassiveSkill("investigation", character);
};

export const calculatePassiveDeception = (character) => {
  return calculatePassiveSkill("deception", character);
};

export const getPassiveSkillBreakdown = (skillName, character) => {
  if (!character) return { total: 10, breakdown: [] };

  const skillModifier = calculateModifier(skillName, character);
  const baseValue = 10 + skillModifier;

  const breakdown = [
    { source: "Base", value: 10 },
    {
      source: `${
        skillName.charAt(0).toUpperCase() + skillName.slice(1)
      } Modifier`,
      value: skillModifier,
    },
  ];

  let total = baseValue;
  const allFeats = getAllCharacterFeats(character);

  allFeats.forEach((feat) => {
    const cleanFeatName = feat.replace(/\s*\(Level \d+\)$/, "");

    switch (cleanFeatName.toLowerCase()) {
      case "observant":
        if (skillName === "perception" || skillName === "investigation") {
          breakdown.push({ source: "Observant Feat", value: 5 });
          total += 5;
        }
        break;
      case "alert":
        if (skillName === "perception") {
        }
        break;
      case "keen mind":
        if (skillName === "investigation") {
        }
        break;
      case "silver tongue":
        if (skillName === "deception") {
        }
        break;
    }
  });

  return { total, breakdown };
};

export const getPassivePerceptionBreakdown = (character) => {
  return getPassiveSkillBreakdown("perception", character);
};

export const checkSingleRequirement = (requirement, character) => {
  const { type, value } = requirement;

  switch (type) {
    case "level":
      return (character.level || 1) >= value;

    case "castingStyle":
      return character.castingStyle === value;

    case "innateHeritage":
      return character.innateHeritage === value;

    case "subclass":
      return character.subclass === value;

    case "feat": {
      const allFeats = getAllCharacterFeats(character);
      return allFeats.includes(value);
    }

    default:
      console.warn(`Unknown prerequisite type: ${type}`);
      return false;
  }
};

export const checkFeatPrerequisites = (feat, character) => {
  if (!feat.prerequisites) {
    return true;
  }

  const { allOf, anyOf } = feat.prerequisites;

  if (allOf && allOf.length > 0) {
    const allMet = allOf.every((req) => checkSingleRequirement(req, character));
    if (!allMet) return false;
  }

  if (anyOf && anyOf.length > 0) {
    const anyMet = anyOf.some((req) => checkSingleRequirement(req, character));
    if (!anyMet) return false;
  }

  return true;
};
