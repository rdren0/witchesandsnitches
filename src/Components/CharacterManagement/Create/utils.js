import { getAllSelectedFeats } from "./ASIComponents";
import { skillsByCastingStyle, hpData } from "../../data";

export const collectAllFeatsFromChoices = ({ character }) => {
  const allFeats = [];

  if (
    character.level1ChoiceType === "feat" &&
    character.standardFeats.length > 0
  ) {
    allFeats.push(...character.standardFeats);
  }

  const availableASILevels = getAvailableASILevels(character.level);
  availableASILevels.forEach((level) => {
    const choice = character.asiChoices[level];
    if (choice && choice.type === "feat" && choice.selectedFeat) {
      allFeats.push(choice.selectedFeat);
    }
  });

  return allFeats;
};

export const calculateTotalFeatsFromChoices = ({ character }) => {
  let totalFeats = 0;

  if (character.level1ChoiceType === "feat") {
    totalFeats += 1;
  }

  const availableASILevels = getAvailableASILevels(character.level);
  availableASILevels.forEach((level) => {
    const choice = character.asiChoices[level];
    if (choice && choice.type === "feat") {
      totalFeats += 1;
    }
  });

  return totalFeats;
};

export const getFeatProgressionInfo = ({ character }) => {
  const currentLevel = character.level || 1;
  const availableASILevels = getAvailableASILevels(currentLevel);
  const nextASILevel = ASI_LEVELS.find((level) => currentLevel < level);

  const choices = [];

  if (character.level1ChoiceType === "innate") {
    choices.push({ level: 1, choice: "Innate Heritage", type: "innate" });
  } else if (character.level1ChoiceType === "feat") {
    choices.push({ level: 1, choice: "Starting Feat", type: "feat" });
  }

  availableASILevels.forEach((level) => {
    const asiChoice = character.asiChoices[level];
    if (asiChoice) {
      if (asiChoice.type === "asi") {
        const increases = asiChoice.abilityScoreIncreases || [];
        const abilityNames = increases
          .map(
            (inc) => inc.ability.charAt(0).toUpperCase() + inc.ability.slice(1)
          )
          .join(", ");
        choices.push({
          level,
          choice: `ASI (+1 ${abilityNames})`,
          type: "asi",
        });
      } else if (asiChoice.type === "feat") {
        choices.push({
          level,
          choice: asiChoice.selectedFeat || "Feat (not selected)",
          type: "feat",
        });
      }
    }
  });

  return {
    choices,
    nextASILevel,
    totalFeatsSelected: calculateTotalFeatsFromChoices({ character }),
  };
};
const ASI_LEVELS = [4, 8, 12, 16, 19];

export const validateFeatSelections = ({ character, setError }) => {
  const allSelectedFeats = getAllSelectedFeats(character);
  const uniqueFeats = [...new Set(allSelectedFeats)];

  if (allSelectedFeats.length !== uniqueFeats.length) {
    const duplicates = allSelectedFeats.filter(
      (feat, index) => allSelectedFeats.indexOf(feat) !== index
    );
    setError(
      `Duplicate feats detected: ${duplicates.join(
        ", "
      )}. Each feat can only be selected once.`
    );
    return false;
  }
  return true;
};

export const getAvailableASILevels = (currentLevel) => {
  return ASI_LEVELS.filter((level) => level <= currentLevel);
};

export const calculateHitPoints = ({ character }) => {
  if (!character.castingStyle) return 0;

  const castingData = hpData[character.castingStyle];
  if (!castingData) return 0;

  const conScore = character.abilityScores.constitution;
  const conMod = conScore !== null ? Math.floor((conScore - 10) / 2) : 0;
  const level = character.level || 1;

  const baseHP = castingData.base + conMod;
  const additionalHP = (level - 1) * (castingData.avgPerLevel + conMod);

  return Math.max(1, baseHP + additionalHP);
};

export const getAvailableSkills = ({ character }) => {
  if (!character.castingStyle) return [];
  return skillsByCastingStyle[character.castingStyle] || [];
};
