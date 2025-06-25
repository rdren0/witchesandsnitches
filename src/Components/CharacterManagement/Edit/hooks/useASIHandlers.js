import { useState, useCallback } from "react";

const ASI_LEVELS = [4, 8, 12, 16, 19];

export const useASIHandlers = (character, setCharacter) => {
  const [asiLevelFilters, setASILevelFilters] = useState({});

  const setASILevelFilter = useCallback((level, filter) => {
    setASILevelFilters((prev) => ({
      ...prev,
      [level]: filter,
    }));
  }, []);

  const getAvailableASILevels = useCallback((currentLevel) => {
    return ASI_LEVELS.filter((level) => level <= currentLevel);
  }, []);

  const handleASIChoiceChange = useCallback(
    (level, choiceType) => {
      setCharacter((prev) => ({
        ...prev,
        asiChoices: {
          ...prev.asiChoices,
          [level]: {
            ...prev.asiChoices[level],
            type: choiceType,
            ...(choiceType === "asi"
              ? {
                  abilityScoreIncreases: [],
                  selectedFeat: null,
                  featChoices: {},
                }
              : {
                  abilityScoreIncreases: null,
                  selectedFeat: null,
                  featChoices: {},
                }),
          },
        },
      }));
    },
    [setCharacter]
  );

  const handleASIFeatChange = useCallback(
    (level, featName, featChoices = {}) => {
      setCharacter((prev) => ({
        ...prev,
        asiChoices: {
          ...prev.asiChoices,
          [level]: {
            ...prev.asiChoices[level],
            type: "feat",
            selectedFeat: featName,
            featChoices: featChoices,
            abilityScoreIncreases: null,
          },
        },
      }));
    },
    [setCharacter]
  );

  const handleASIAbilityChange = useCallback(
    (level, abilityUpdates) => {
      setCharacter((prev) => {
        const newCharacter = {
          ...prev,
          asiChoices: {
            ...prev.asiChoices,
            [level]: {
              ...prev.asiChoices[level],
              type: "asi",
              abilityScoreIncreases: abilityUpdates,
            },
          },
        };

        const baseAbilityScores = prev.abilityScores || {};
        const effectiveAbilityScores = { ...baseAbilityScores };

        const allASIChoices = newCharacter.asiChoices || {};
        Object.entries(allASIChoices).forEach(([asiLevel, choice]) => {
          if (choice.type === "asi" && choice.abilityScoreIncreases) {
            choice.abilityScoreIncreases.forEach((increase) => {
              const ability = increase.ability;
              const amount = increase.increase || 1;
              if (effectiveAbilityScores[ability]) {
                effectiveAbilityScores[ability] += amount;
              }
            });
          }
        });

        return {
          ...newCharacter,
          effectiveAbilityScores,
        };
      });
    },
    [setCharacter]
  );

  const getFeatProgressionInfo = useCallback(() => {
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
              (inc) =>
                inc.ability.charAt(0).toUpperCase() + inc.ability.slice(1)
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

    const totalFeatsSelected = [
      character.level1ChoiceType === "feat" ? 1 : 0,
      ...availableASILevels.map((lvl) => character.asiChoices[lvl]),
    ].filter((c) => c?.type === "feat").length;

    return {
      choices,
      nextASILevel,
      totalFeatsSelected,
    };
  }, [character, getAvailableASILevels]);

  return {
    asiLevelFilters,
    setASILevelFilter,
    getAvailableASILevels,
    handleASIChoiceChange,
    handleASIFeatChange,
    handleASIAbilityChange,
    getFeatProgressionInfo,
  };
};
