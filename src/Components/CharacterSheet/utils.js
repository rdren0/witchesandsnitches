import { allSkills } from "../../SharedData/data";
import { getPassiveSkillFeatBonus } from "../CharacterManager/utils/featBenefitsCalculator";
import { calculateTotalModifiers } from "../CharacterManager/utils/characterUtils";

export const getModifier = (score) => Math.floor((score - 10) / 2);
export const formatModifier = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);
export const modifiers = (character) => {
  if (!character) return {};

  const houseChoices = character.houseChoices || character.house_choices || {};
  const featChoices = character.featChoices || character.feat_choices || {};
  const heritageChoices =
    character.heritageChoices || character.heritage_choices || {};

  const { totalModifiers } = calculateTotalModifiers(
    character,
    featChoices,
    houseChoices,
    heritageChoices
  );

  console.log("🧮 modifiers() function called:", {
    characterHouse: character.house,
    characterHouseChoices: character.houseChoices,
    character_house_choices: character.house_choices,
    totalModifiers: totalModifiers,
    intelligenceModifier: totalModifiers.intelligence,
  });

  return {
    strength: totalModifiers.strength,
    dexterity: totalModifiers.dexterity,
    constitution: totalModifiers.constitution,
    intelligence: totalModifiers.intelligence,
    wisdom: totalModifiers.wisdom,
    charisma: totalModifiers.charisma,
  };
};

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

  const featBonus = getPassiveSkillFeatBonus(character, skillName);
  passiveValue += featBonus;

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

  const featBonus = getPassiveSkillFeatBonus(character, skillName);
  if (featBonus > 0) {
    breakdown.push({ source: "Feat Bonuses", value: featBonus });
    total += featBonus;
  }

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
