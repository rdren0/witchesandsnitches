import {
  standardFeats,
  backgroundsData,
  houseFeatures,
  heritageDescriptions,
  subclassesData,
} from "../../../SharedData";
import { subclasses } from "../../../SharedData/subclassesData";
import {
  calculateFeatBenefits,
  calculateInitiativeWithFeats,
  calculateSpeedsWithFeats,
  getHitPointsBonusFromFeats,
} from "./featBenefitsCalculator";

export const getAllSelectedFeats = (character) => {
  if (!character) return [];

  const selectedFeats = [];

  if (character.standardFeats && Array.isArray(character.standardFeats)) {
    selectedFeats.push(...character.standardFeats);
  }

  if (character.standard_feats && Array.isArray(character.standard_feats)) {
    selectedFeats.push(...character.standard_feats);
  }

  if (character.asiChoices) {
    Object.values(character.asiChoices).forEach((choice) => {
      if (choice.type === "feat" && choice.selectedFeat) {
        selectedFeats.push(choice.selectedFeat);
      }
    });
  }

  if (character.asi_choices) {
    Object.values(character.asi_choices).forEach((choice) => {
      if (choice.type === "feat" && choice.selectedFeat) {
        selectedFeats.push(choice.selectedFeat);
      }
    });
  }

  return [...new Set(selectedFeats)];
};

export const handleASIChoiceChange = (character, level, choiceType) => {
  const updatedAsiChoices = {
    ...character.asiChoices,
    [level]: {
      ...character.asiChoices?.[level],
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
  };

  return {
    ...character,
    asiChoices: updatedAsiChoices,
  };
};

export const handleASIFeatChange = (
  character,
  level,
  featName,
  featChoices = {}
) => {
  if (featName) {
    const { standardFeats } = require("../../../SharedData/standardFeatData");
    const feat = standardFeats.find((f) => f.name === featName);

    if (!feat?.repeatable) {
      const currentSelectedFeats = getAllSelectedFeats(character);
      const currentLevelChoice = character.asiChoices?.[level];

      const otherFeats = currentSelectedFeats.filter((feat) => {
        return !(
          currentLevelChoice?.type === "feat" &&
          currentLevelChoice?.selectedFeat === feat
        );
      });

      if (otherFeats.includes(featName)) {
        throw new Error(
          `You have already selected "${featName}". This feat can only be selected once.`
        );
      }
    }
  }

  const updatedAsiChoices = {
    ...character.asiChoices,
    [level]: {
      ...character.asiChoices?.[level],
      type: "feat",
      selectedFeat: featName,
      featChoices: featChoices,
      abilityScoreIncreases: null,
    },
  };

  return {
    ...character,
    asiChoices: updatedAsiChoices,
  };
};

export const handleASIAbilityChange = (character, level, abilityUpdates) => {
  const updatedAsiChoices = {
    ...character.asiChoices,
    [level]: {
      ...character.asiChoices?.[level],
      type: "asi",
      abilityScoreIncreases: abilityUpdates,
      selectedFeat: null,
      featChoices: {},
    },
  };

  return {
    ...character,
    asiChoices: updatedAsiChoices,
  };
};

export const getAvailableASILevels = (currentLevel) => {
  const ASI_LEVELS = [4, 8, 12, 16, 19];
  return ASI_LEVELS.filter((level) => level <= currentLevel);
};

export const calculateFinalAbilityScores = (character) => {
  const abilities = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];

  const finalScores = {};

  const featChoices = { ...character.featChoices };
  const asiChoices = character.asiChoices || character.asi_choices;
  if (asiChoices) {
    Object.values(asiChoices).forEach((choice) => {
      if (choice.type === "feat" && choice.featChoices) {
        Object.assign(featChoices, choice.featChoices);
      }
    });
  }

  const houseChoices = character.house_choices || character.houseChoices || {};
  const heritageChoices =
    character.heritage_choices || character.heritageChoices || {};

  const { totalModifiers, _asiAlreadyApplied } = calculateTotalModifiers(
    character,
    featChoices,
    houseChoices,
    heritageChoices
  );

  abilities.forEach((ability) => {
    let baseScore;
    if (
      character.base_ability_scores &&
      character.base_ability_scores[ability] !== undefined
    ) {
      baseScore = character.base_ability_scores[ability];
    } else {
      baseScore =
        character.abilityScores?.[ability] || character[ability] || 10;
    }

    let finalScore = baseScore;

    const { totalModifiers: nonASIModifiers } =
      calculateTotalModifiersExcludingASI(
        character,
        featChoices,
        houseChoices,
        heritageChoices
      );

    if (nonASIModifiers[ability]) {
      finalScore += nonASIModifiers[ability];
    }

    if (asiChoices) {
      Object.values(asiChoices).forEach((choice) => {
        if (choice?.type === "asi" && choice?.abilityScoreIncreases) {
          choice.abilityScoreIncreases.forEach((increase) => {
            if (increase.ability === ability && increase.increase) {
              finalScore += increase.increase;
            }
          });
        }
      });
    }

    finalScores[ability] = finalScore;
  });

  return finalScores;
};

export const validateFeatSelections = (character) => {
  const allSelectedFeats = getAllSelectedFeats(character);
  const uniqueFeats = [...new Set(allSelectedFeats)];

  if (allSelectedFeats.length !== uniqueFeats.length) {
    const duplicates = allSelectedFeats.filter(
      (feat, index) => allSelectedFeats.indexOf(feat) !== index
    );

    return {
      isValid: false,
      duplicates: [...new Set(duplicates)],
      message: `Duplicate feats detected: ${[...new Set(duplicates)].join(
        ", "
      )}. This feat can only be selected once.`,
    };
  }

  return {
    isValid: true,
    duplicates: [],
    message: null,
  };
};

export const getFeatProgressionInfo = (character) => {
  const currentLevel = character.level || 1;
  const availableASILevels = getAvailableASILevels(currentLevel);
  const nextASILevel = [4, 8, 12, 16, 19].find((level) => currentLevel < level);

  const choices = [];

  if (character.level1ChoiceType === "innate") {
    choices.push({
      level: 1,
      choice: character.selectedInnateHeritage || "Innate Heritage",
      type: "innate",
    });
  } else if (character.level1ChoiceType === "feat") {
    const featName = character.standardFeats?.[0] || "Standard Feat";
    choices.push({
      level: 1,
      choice: featName,
      type: "feat",
    });
  }

  availableASILevels.forEach((level) => {
    const asiChoice = character.asiChoices?.[level];
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
    } else {
      choices.push({
        level,
        choice: "Not selected",
        type: "none",
      });
    }
  });

  return {
    choices,
    nextASILevel,
    totalFeatsSelected: getAllSelectedFeats(character).length,
    availableASILevels,
    maxPossibleFeats:
      availableASILevels.length +
      (character.level1ChoiceType === "feat" ? 1 : 0),
  };
};

export const getAbilityModifier = (abilityScore) => {
  if (abilityScore === null || abilityScore === undefined) return 0;
  return Math.floor((abilityScore - 10) / 2);
};

export const getAbilityDisplayName = (ability) => {
  const names = {
    strength: "Strength",
    dexterity: "Dexterity",
    constitution: "Constitution",
    intelligence: "Intelligence",
    wisdom: "Wisdom",
    charisma: "Charisma",
  };
  return names[ability] || ability;
};

export const getAbilityShortName = (ability) => {
  const names = {
    strength: "STR",
    dexterity: "DEX",
    constitution: "CON",
    intelligence: "INT",
    wisdom: "WIS",
    charisma: "CHA",
  };
  return names[ability] || ability.substring(0, 3).toUpperCase();
};

export const isCharacterComplete = (character) => {
  if (!character.name || !character.level || !character.castingStyle) {
    return false;
  }

  if (!character.level1ChoiceType) {
    return false;
  }

  if (
    character.level1ChoiceType === "innate" &&
    !character.selectedInnateHeritage
  ) {
    return false;
  }

  if (
    character.level1ChoiceType === "feat" &&
    (!character.standardFeats || character.standardFeats.length === 0)
  ) {
    return false;
  }

  if (character.level > 1) {
    const requiredASILevels = getAvailableASILevels(character.level);
    for (const level of requiredASILevels) {
      const choice = character.asiChoices?.[level];
      if (!choice || !choice.type) {
        return false;
      }

      if (
        choice.type === "asi" &&
        (!choice.abilityScoreIncreases ||
          choice.abilityScoreIncreases.length === 0)
      ) {
        return false;
      }

      if (choice.type === "feat" && !choice.selectedFeat) {
        return false;
      }
    }
  }

  return true;
};

export const getCharacterProgressionSummary = (character) => {
  const progression = getFeatProgressionInfo(character);
  const isComplete = isCharacterComplete(character);

  return {
    ...progression,
    isComplete,
    missingChoices: progression.choices.filter(
      (choice) => choice.choice === "Not selected"
    ),
    completedChoices: progression.choices.filter(
      (choice) => choice.choice !== "Not selected"
    ),
  };
};

export const checkForModifiers = (obj, type = "abilityIncreases") => {
  const results = [];

  if (obj?.modifiers?.[type]) {
    results.push(...obj.modifiers[type]);
  }

  if (obj?.data?.modifiers?.[type]) {
    results.push(...obj.data.modifiers[type]);
  }

  if (obj?.benefits?.modifiers?.[type]) {
    results.push(...obj.benefits.modifiers[type]);
  }

  if (obj?.properties?.modifiers?.[type]) {
    results.push(...obj.properties.modifiers[type]);
  }

  return results;
};

export const checkForAbilityChoices = (obj) => {
  const choices = [];

  if (obj?.abilityChoice) {
    choices.push({
      ability: obj.abilityChoice,
      amount: obj.amount || 1,
      type: "choice",
    });
  }

  if (obj?.data?.abilityChoice) {
    choices.push({
      ability: obj.data.abilityChoice,
      amount: obj.data.amount || 1,
      type: "choice",
    });
  }

  if (obj?.properties?.abilityChoice) {
    choices.push({
      ability: obj.properties.abilityChoice,
      amount: obj.properties.amount || 1,
      type: "choice",
    });
  }

  return choices;
};

export const getAllAbilityModifiers = (character) => {
  const modifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const featChoices = { ...character.featChoices };
  const asiChoices = character.asiChoices || character.asi_choices;
  if (asiChoices) {
    Object.values(asiChoices).forEach((choice) => {
      if (choice.type === "feat" && choice.featChoices) {
        Object.assign(featChoices, choice.featChoices);
      }
    });
  }

  const houseChoices = character.house_choices || character.houseChoices || {};
  const heritageChoices =
    character.heritage_choices || character.heritageChoices || {};

  const { totalModifiers } = calculateTotalModifiers(
    character,
    featChoices,
    houseChoices,
    heritageChoices
  );

  Object.keys(modifiers).forEach((ability) => {
    modifiers[ability] = totalModifiers[ability] || 0;
  });

  if (asiChoices) {
    Object.entries(asiChoices).forEach(([level, choice]) => {
      if (choice?.type === "asi" && choice?.abilityScoreIncreases) {
        choice.abilityScoreIncreases.forEach((increase) => {
          if (increase.ability && increase.increase) {
            modifiers[increase.ability] += increase.increase;
          }
        });
      }
    });
  }

  if (
    character.subclass &&
    character.subclassChoices &&
    subclassesData &&
    character.castingStyle
  ) {
    const subclassData =
      subclasses[character.castingStyle]?.[character.subclass];

    if (subclassData) {
      Object.entries(character.subclassChoices).forEach(([level, choice]) => {
        const choices = Array.isArray(choice) ? choice : [choice];

        choices.forEach((choiceName) => {
          if (!choiceName) return;

          const actualChoiceName =
            typeof choiceName === "string"
              ? choiceName
              : choiceName.mainChoice || choiceName.name || String(choiceName);

          const benefitSelections =
            typeof choiceName === "object" && choiceName.benefitSelections
              ? choiceName.benefitSelections
              : {};

          const levelChoices = subclassData.choices?.[level];
          if (levelChoices && Array.isArray(levelChoices)) {
            const selectedChoice = levelChoices.find(
              (choice) => choice.name === actualChoiceName
            );

            if (selectedChoice) {
              Object.entries(benefitSelections).forEach(
                ([benefitKey, selections]) => {
                  if (
                    benefitKey.startsWith("abilityScoreIncrease_") &&
                    Array.isArray(selections)
                  ) {
                    selections.forEach((ability) => {
                      if (modifiers.hasOwnProperty(ability)) {
                        modifiers[ability] += 1;
                      }
                    });
                  }
                }
              );

              const abilityIncreases = checkForModifiers(
                selectedChoice,
                "abilityIncreases"
              );
              abilityIncreases.forEach((mod) => {
                if (mod.ability && mod.value) {
                  modifiers[mod.ability] += mod.value;
                }
              });
            }
          }
        });
      });
    }
  }

  return modifiers;
};

export const calculateFeatModifiers = (character, featChoices = {}) => {
  if (!character) {
    return {
      modifiers: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      },
      featDetails: {},
    };
  }

  const modifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const featDetails = {};

  const allSelectedFeats = getAllSelectedFeats(character);

  if (character.level1ChoiceType === "feat" && character.standardFeats) {
    allSelectedFeats.push(...character.standardFeats);
  }

  const uniqueFeats = [...new Set(allSelectedFeats)];

  uniqueFeats.forEach((featName) => {
    const feat = standardFeats.find((f) => f.name === featName);

    if (!feat?.benefits?.abilityScoreIncrease) {
      return;
    }

    const increase = feat.benefits.abilityScoreIncrease;

    let abilityToIncrease;

    const choiceKey1 = `${featName}_ability_0`;
    const choiceKey2 = `${featName}_abilityChoice`;
    const choiceKey3 = `${featName}_ability`;

    switch (increase.type) {
      case "fixed":
        abilityToIncrease = increase.ability;
        break;
      case "choice":
      case "choice_any":
        abilityToIncrease =
          featChoices[choiceKey1] ||
          featChoices[choiceKey2] ||
          featChoices[choiceKey3] ||
          increase.abilities?.[0];

        break;
      case "spellcasting_ability":
        abilityToIncrease = getSpellcastingAbility(character);
        break;
      case "multiple":
        if (increase.increases && Array.isArray(increase.increases)) {
          increase.increases.forEach((abilityIncrease) => {
            if (
              abilityIncrease.ability &&
              abilityIncrease.amount &&
              modifiers.hasOwnProperty(abilityIncrease.ability)
            ) {
              modifiers[abilityIncrease.ability] += abilityIncrease.amount;

              if (!featDetails[abilityIncrease.ability]) {
                featDetails[abilityIncrease.ability] = [];
              }
              featDetails[abilityIncrease.ability].push({
                source: featName,
                amount: abilityIncrease.amount,
              });
            }
          });
        }
        return;
      default:
        if (increase.ability && !increase.type) {
          abilityToIncrease = increase.ability;
        }
        break;
    }

    if (abilityToIncrease && modifiers.hasOwnProperty(abilityToIncrease)) {
      modifiers[abilityToIncrease] += increase.amount;

      if (!featDetails[abilityToIncrease]) {
        featDetails[abilityToIncrease] = [];
      }
      featDetails[abilityToIncrease].push({
        source: "feat",
        featName,
        amount: increase.amount,
      });
    }
  });

  return { modifiers, featDetails };
};

export const calculateBackgroundModifiers = (character) => {
  const modifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const backgroundDetails = {};

  if (!character.background) return { modifiers, backgroundDetails };

  const background = backgroundsData[character.background];
  if (!background?.modifiers?.abilityIncreases)
    return { modifiers, backgroundDetails };

  background.modifiers.abilityIncreases.forEach((increase) => {
    if (
      increase.type === "fixed" &&
      modifiers.hasOwnProperty(increase.ability)
    ) {
      modifiers[increase.ability] += increase.amount;

      if (!backgroundDetails[increase.ability]) {
        backgroundDetails[increase.ability] = [];
      }
      backgroundDetails[increase.ability].push({
        source: "background",
        backgroundName: background.name,
        amount: increase.amount,
      });
    }
  });

  return { modifiers, backgroundDetails };
};

export const calculateHouseModifiers = (character, houseChoices = {}) => {
  const modifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const houseDetails = {};

  if (!character.house) {
    return { modifiers, houseDetails };
  }

  if (!houseFeatures[character.house]) {
    return { modifiers, houseDetails };
  }

  const houseBonuses = houseFeatures[character.house];

  const hasBaseScores = character.baseAbilityScores && character.ability_scores;
  let fixedBonusesAlreadyApplied = false;

  if (hasBaseScores && houseBonuses.fixed) {
    fixedBonusesAlreadyApplied = houseBonuses.fixed.every((ability) => {
      const baseScore = character.baseAbilityScores[ability] || 8;
      const currentScore = character.ability_scores[ability] || 8;
      const expectedDifference = currentScore - baseScore;

      return expectedDifference >= 1;
    });
  }

  if (houseBonuses.fixed && !fixedBonusesAlreadyApplied) {
    houseBonuses.fixed.forEach((ability) => {
      if (modifiers.hasOwnProperty(ability)) {
        modifiers[ability] += 1;

        if (!houseDetails[ability]) {
          houseDetails[ability] = [];
        }
        houseDetails[ability].push({
          source: "house",
          houseName: character.house,
          type: "fixed",
          amount: 1,
        });
      }
    });
  }

  if (houseChoices[character.house]?.abilityChoice) {
    const chosenAbility = houseChoices[character.house].abilityChoice;

    if (modifiers.hasOwnProperty(chosenAbility)) {
      let choiceBonusAlreadyApplied = false;

      if (hasBaseScores) {
        const baseScore = character.baseAbilityScores[chosenAbility] || 8;
        const currentScore = character.ability_scores[chosenAbility] || 8;
        const isFixedAbility = houseBonuses.fixed?.includes(chosenAbility);
        const expectedMinDifference = isFixedAbility ? 2 : 1;

        choiceBonusAlreadyApplied =
          currentScore - baseScore >= expectedMinDifference;
      }

      if (!choiceBonusAlreadyApplied) {
        modifiers[chosenAbility] += 1;

        if (!houseDetails[chosenAbility]) {
          houseDetails[chosenAbility] = [];
        }
        houseDetails[chosenAbility].push({
          source: "house",
          houseName: character.house,
          type: "choice",
          amount: 1,
        });
      }
    }
  }

  return { modifiers, houseDetails };
};

export const calculateHeritageModifiers = (character, heritageChoices = {}) => {
  const modifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const heritageDetails = {};
  const otherBenefits = {};

  const innateHeritage = character.innateHeritage || character.innate_heritage;

  if (!innateHeritage) {
    return { modifiers, heritageDetails, otherBenefits };
  }

  const heritage = heritageDescriptions[innateHeritage];
  if (!heritage) return { modifiers, heritageDetails, otherBenefits };

  if (heritage.modifiers && heritage.modifiers.other) {
    Object.assign(otherBenefits, heritage.modifiers.other);
  }

  const abilityIncreases = checkForModifiers(heritage, "abilityIncreases");

  abilityIncreases.forEach((increase) => {
    if (
      increase.type === "fixed" &&
      modifiers.hasOwnProperty(increase.ability)
    ) {
      modifiers[increase.ability] += increase.amount;

      if (!heritageDetails[increase.ability]) {
        heritageDetails[increase.ability] = [];
      }
      heritageDetails[increase.ability].push({
        source: "heritage",
        heritageName: innateHeritage,
        type: "fixed",
        amount: increase.amount,
      });
    }
  });

  if (heritage.features && heritageChoices[innateHeritage]) {
    heritage.features.forEach((feature) => {
      if (feature.isChoice && feature.options) {
        const selectedChoiceName =
          heritageChoices[innateHeritage][feature.name];
        const selectedChoice = feature.options.find(
          (opt) => opt.name === selectedChoiceName
        );

        if (selectedChoice) {
          const abilityChoices = checkForAbilityChoices(selectedChoice);

          abilityChoices.forEach(({ ability, amount }) => {
            if (modifiers.hasOwnProperty(ability)) {
              modifiers[ability] += amount;

              if (!heritageDetails[ability]) {
                heritageDetails[ability] = [];
              }
              heritageDetails[ability].push({
                source: "heritage",
                heritageName: innateHeritage,
                type: "choice",
                amount: amount,
              });
            }
          });

          const choiceAbilityIncreases = checkForModifiers(
            selectedChoice,
            "abilityIncreases"
          );

          choiceAbilityIncreases.forEach((increase) => {
            if (modifiers.hasOwnProperty(increase.ability)) {
              modifiers[increase.ability] += increase.amount;

              if (!heritageDetails[increase.ability]) {
                heritageDetails[increase.ability] = [];
              }
              heritageDetails[increase.ability].push({
                source: "heritage",
                heritageName: innateHeritage,
                type: "choice",
                amount: increase.amount,
              });
            }
          });

          if (selectedChoice.other) {
            Object.assign(otherBenefits, selectedChoice.other);
          }
        }
      }
    });
  }

  return { modifiers, heritageDetails, otherBenefits };
};

export const getSpellcastingAbility = (character) => {
  return character.castingStyle || "intelligence";
};

export const calculateASIModifiers = (character) => {
  const modifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const bonusDetails = {};

  const asiChoices = character.asiChoices || character.asi_choices;
  if (!asiChoices) return { modifiers, bonusDetails };

  Object.entries(asiChoices).forEach(([level, choice]) => {
    if (choice.type === "asi" && choice.abilityScoreIncreases) {
      choice.abilityScoreIncreases.forEach((increase) => {
        if (increase.ability && increase.increase) {
          modifiers[increase.ability] += increase.increase;

          if (!bonusDetails[increase.ability]) {
            bonusDetails[increase.ability] = [];
          }
          bonusDetails[increase.ability].push({
            source: `Level ${level} ASI`,
            amount: increase.increase,
          });
        }
      });
    }
  });

  return { modifiers, bonusDetails };
};

export const calculateTotalModifiersExcludingASI = (
  character,
  featChoices = {},
  houseChoices = {},
  heritageChoices = {}
) => {
  const featResult = calculateFeatModifiers(character, featChoices);
  const backgroundResult = calculateBackgroundModifiers(character);
  const houseResult = calculateHouseModifiers(character, houseChoices);
  const heritageResult = calculateHeritageModifiers(character, heritageChoices);

  const asiResult = {
    modifiers: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
    bonusDetails: {},
  };

  const totalModifiers = {
    strength:
      featResult.modifiers.strength +
      backgroundResult.modifiers.strength +
      houseResult.modifiers.strength +
      heritageResult.modifiers.strength +
      asiResult.modifiers.strength,
    dexterity:
      featResult.modifiers.dexterity +
      backgroundResult.modifiers.dexterity +
      houseResult.modifiers.dexterity +
      heritageResult.modifiers.dexterity +
      asiResult.modifiers.dexterity,
    constitution:
      featResult.modifiers.constitution +
      backgroundResult.modifiers.constitution +
      houseResult.modifiers.constitution +
      heritageResult.modifiers.constitution +
      asiResult.modifiers.constitution,
    intelligence:
      featResult.modifiers.intelligence +
      backgroundResult.modifiers.intelligence +
      houseResult.modifiers.intelligence +
      heritageResult.modifiers.intelligence +
      asiResult.modifiers.intelligence,
    wisdom:
      featResult.modifiers.wisdom +
      backgroundResult.modifiers.wisdom +
      houseResult.modifiers.wisdom +
      heritageResult.modifiers.wisdom +
      asiResult.modifiers.wisdom,
    charisma:
      featResult.modifiers.charisma +
      backgroundResult.modifiers.charisma +
      houseResult.modifiers.charisma +
      heritageResult.modifiers.charisma +
      asiResult.modifiers.charisma,
  };

  const allDetails = {};
  Object.keys(totalModifiers).forEach((ability) => {
    allDetails[ability] = [
      ...(featResult.featDetails[ability] || []),
      ...(backgroundResult.backgroundDetails[ability] || []),
      ...(houseResult.houseDetails[ability] || []),
      ...(heritageResult.heritageDetails[ability] || []),
      ...(asiResult.bonusDetails[ability] || []),
    ];
  });

  return {
    totalModifiers,
    allDetails,
    featModifiers: featResult.modifiers,
    backgroundModifiers: backgroundResult.modifiers,
    houseModifiers: houseResult.modifiers,
    heritageModifiers: heritageResult.modifiers,
    heritageOtherBenefits: heritageResult.otherBenefits,
    asiModifiers: asiResult.modifiers,
    _asiAlreadyApplied: true,
  };
};

export const calculateTotalModifiers = (
  character,
  featChoices = {},
  houseChoices = {},
  heritageChoices = {}
) => {
  const featResult = calculateFeatModifiers(character, featChoices);
  const backgroundResult = calculateBackgroundModifiers(character);
  const houseResult = calculateHouseModifiers(character, houseChoices);
  const heritageResult = calculateHeritageModifiers(character, heritageChoices);

  const asiAlreadyApplied = detectIfASIAlreadyApplied(character);

  let asiResult;
  if (asiAlreadyApplied) {
    asiResult = {
      modifiers: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      },
      bonusDetails: {},
    };
  } else {
    asiResult = calculateASIModifiers(character);
  }

  const totalModifiers = {
    strength:
      featResult.modifiers.strength +
      backgroundResult.modifiers.strength +
      houseResult.modifiers.strength +
      heritageResult.modifiers.strength +
      asiResult.modifiers.strength,
    dexterity:
      featResult.modifiers.dexterity +
      backgroundResult.modifiers.dexterity +
      houseResult.modifiers.dexterity +
      heritageResult.modifiers.dexterity +
      asiResult.modifiers.dexterity,
    constitution:
      featResult.modifiers.constitution +
      backgroundResult.modifiers.constitution +
      houseResult.modifiers.constitution +
      heritageResult.modifiers.constitution +
      asiResult.modifiers.constitution,
    intelligence:
      featResult.modifiers.intelligence +
      backgroundResult.modifiers.intelligence +
      houseResult.modifiers.intelligence +
      heritageResult.modifiers.intelligence +
      asiResult.modifiers.intelligence,
    wisdom:
      featResult.modifiers.wisdom +
      backgroundResult.modifiers.wisdom +
      houseResult.modifiers.wisdom +
      heritageResult.modifiers.wisdom +
      asiResult.modifiers.wisdom,
    charisma:
      featResult.modifiers.charisma +
      backgroundResult.modifiers.charisma +
      houseResult.modifiers.charisma +
      heritageResult.modifiers.charisma +
      asiResult.modifiers.charisma,
  };

  const allDetails = {};
  Object.keys(totalModifiers).forEach((ability) => {
    allDetails[ability] = [
      ...(featResult.featDetails[ability] || []),
      ...(backgroundResult.backgroundDetails[ability] || []),
      ...(houseResult.houseDetails[ability] || []),
      ...(heritageResult.heritageDetails[ability] || []),
      ...(asiResult.bonusDetails[ability] || []),
    ];
  });

  return {
    totalModifiers,
    allDetails,
    featModifiers: featResult.modifiers,
    backgroundModifiers: backgroundResult.modifiers,
    houseModifiers: houseResult.modifiers,
    heritageModifiers: heritageResult.modifiers,
    heritageOtherBenefits: heritageResult.otherBenefits,
    asiModifiers: asiResult.modifiers,
    _asiAlreadyApplied: asiAlreadyApplied,
  };
};

export const detectIfASIAlreadyApplied = (character) => {
  if (character._asiApplied || character.asiApplied) {
    return true;
  }

  if (character.base_ability_scores && character.ability_scores) {
    const asiChoices = character.asiChoices || character.asi_choices;
    if (asiChoices) {
      for (const [level, choice] of Object.entries(asiChoices)) {
        if (choice?.type === "asi" && choice?.abilityScoreIncreases) {
          for (const increase of choice.abilityScoreIncreases) {
            const baseScore =
              character.base_ability_scores[increase.ability] || 0;
            const currentScore =
              character.ability_scores[increase.ability] || 0;

            if (currentScore > baseScore) {
              return true;
            }
          }
        }
      }
    }
  }

  if (character.ability_scores && character.abilityScores) {
    const oldScores = Object.values(character.ability_scores);
    const newScores = Object.values(character.abilityScores).filter(
      (s) => s !== null
    );

    const oldAllEights = oldScores.every((score) => score === 8);
    const newAverage =
      newScores.reduce((sum, score) => sum + score, 0) / newScores.length;

    if (
      oldAllEights &&
      newAverage > 10 &&
      (character.asiChoices || character.asi_choices) &&
      Object.keys(character.asiChoices || character.asi_choices || {}).length >
        0
    ) {
      return true;
    }
  }

  return false;
};

export const getCharacterBenefits = (character) => {
  if (!character) return null;

  const featBenefits = calculateFeatBenefits(character);

  return {
    feats: featBenefits,
    combat: {
      initiative: {
        base: character.initiativeModifier || 0,
        featBonus: featBenefits.combatBonuses.initiativeBonus,
        total:
          (character.initiativeModifier || 0) +
          featBenefits.combatBonuses.initiativeBonus,
      },
      hitPoints: {
        base: character.hitPoints || 0,
        featBonus: getHitPointsBonusFromFeats(character),
        total:
          (character.hitPoints || 0) + getHitPointsBonusFromFeats(character),
      },
      passivePerception: {
        base: 10 + Math.floor((character.wisdom - 10) / 2),
        featBonus: featBenefits.combatBonuses.passivePerceptionBonus,
        total:
          10 +
          Math.floor((character.wisdom - 10) / 2) +
          featBenefits.combatBonuses.passivePerceptionBonus,
      },
    },
    speeds: calculateSpeedsWithFeats(character, 30),
    resources: {
      luckPoints: featBenefits.resources.luckPoints,
    },
  };
};

export const checkSingleRequirement = (requirement, character) => {
  if (!requirement || !character) return false;

  switch (requirement.type) {
    case "level":
      return (character.level || 1) >= requirement.value;

    case "castingStyle":
      return character.castingStyle === requirement.value;

    case "innateHeritage":
      return (
        (character.innateHeritage || character.innate_heritage) ===
        requirement.value
      );

    case "feat": {
      const selectedFeats = getAllSelectedFeats(character);
      return selectedFeats.includes(requirement.value);
    }

    default:
      return false;
  }
};

export const checkFeatPrerequisites = (feat, character) => {
  if (!feat || !character) return false;

  if (!feat.prerequisites) return true;

  if (feat.prerequisites.allOf) {
    return feat.prerequisites.allOf.every((req) =>
      checkSingleRequirement(req, character)
    );
  }

  if (feat.prerequisites.anyOf) {
    return feat.prerequisites.anyOf.some((req) =>
      checkSingleRequirement(req, character)
    );
  }

  return true;
};
