// Add these imports to the top of characterUtils.js
import {
  standardFeats,
  backgroundsData,
  houseFeatures,
  heritageDescriptions,
} from "../../../SharedData";

export const getAllSelectedFeats = (character) => {
  const selectedFeats = [];

  if (character.level1ChoiceType === "feat" && character.standardFeats) {
    selectedFeats.push(...character.standardFeats);
  }

  if (character.asiChoices) {
    Object.values(character.asiChoices).forEach((choice) => {
      if (choice.type === "feat" && choice.selectedFeat) {
        selectedFeats.push(choice.selectedFeat);
      }
    });
  }

  return selectedFeats;
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
        `You have already selected "${featName}". Each feat can only be selected once.`
      );
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
      )}. Each feat can only be selected once.`,
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

// Helper functions for modifier calculations
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

// Modifier calculation functions
export const calculateFeatModifiers = (character, featChoices = {}) => {
  console.log("calculateFeatModifiers called with:", {
    character: character,
    featChoices: featChoices,
  });

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
  console.log("All selected feats:", allSelectedFeats);

  if (character.level1ChoiceType === "feat" && character.standardFeats) {
    allSelectedFeats.push(...character.standardFeats);
  }

  const uniqueFeats = [...new Set(allSelectedFeats)];
  console.log("Unique feats:", uniqueFeats);

  uniqueFeats.forEach((featName) => {
    const feat = standardFeats.find((f) => f.name === featName);
    console.log(`Processing feat: ${featName}`, feat);

    if (!feat?.benefits?.abilityScoreIncrease) {
      console.log(`Feat ${featName} has no ability score increase benefit`);
      return;
    }

    const increase = feat.benefits.abilityScoreIncrease;
    console.log(`Ability score increase for ${featName}:`, increase);

    let abilityToIncrease;

    // Try multiple choice key formats for compatibility
    const choiceKey1 = `${featName}_ability_0`;
    const choiceKey2 = `${featName}_abilityChoice`;
    const choiceKey3 = `${featName}_ability`;

    switch (increase.type) {
      case "fixed":
        abilityToIncrease = increase.ability;
        console.log(`Fixed ability for ${featName}: ${abilityToIncrease}`);
        break;
      case "choice":
      case "choice_any":
        // Try different choice key formats
        abilityToIncrease =
          featChoices[choiceKey1] ||
          featChoices[choiceKey2] ||
          featChoices[choiceKey3] ||
          increase.abilities?.[0];

        console.log(`Choice ability for ${featName}:`, {
          choiceKey1: featChoices[choiceKey1],
          choiceKey2: featChoices[choiceKey2],
          choiceKey3: featChoices[choiceKey3],
          defaultAbility: increase.abilities?.[0],
          selectedAbility: abilityToIncrease,
          availableChoices: increase.abilities,
        });
        break;
      case "spellcasting_ability":
        abilityToIncrease = getSpellcastingAbility(character);
        console.log(
          `Spellcasting ability for ${featName}: ${abilityToIncrease}`
        );
        break;
      default:
        console.log(
          `Unknown ability increase type for ${featName}: ${increase.type}`
        );
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

      console.log(
        `Applied +${increase.amount} ${abilityToIncrease} from ${featName}`
      );
    } else {
      console.log(
        `Could not apply ability increase for ${featName}: abilityToIncrease=${abilityToIncrease}`
      );
    }
  });

  console.log("Final feat modifiers:", modifiers);
  console.log("Final feat details:", featDetails);
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
    console.log(
      "House not found in houseFeatures:",
      character.house,
      "Available houses:",
      Object.keys(houseFeatures)
    );
    return { modifiers, houseDetails };
  }

  const houseBonuses = houseFeatures[character.house];
  console.log("House bonuses for", character.house, ":", houseBonuses);

  // Fixed bonuses from house
  if (houseBonuses.fixed) {
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

  // Choice bonuses from house
  if (houseChoices[character.house]?.abilityChoice) {
    const chosenAbility = houseChoices[character.house].abilityChoice;
    console.log(
      "House choice bonus:",
      chosenAbility,
      "for house",
      character.house
    );
    if (modifiers.hasOwnProperty(chosenAbility)) {
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
  } else {
    console.log(
      "No house choice found for:",
      character.house,
      "in houseChoices:",
      houseChoices
    );
  }

  console.log("Final house modifiers:", modifiers);
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

  if (!character.innateHeritage) {
    return { modifiers, heritageDetails };
  }

  const heritage = heritageDescriptions[character.innateHeritage];
  if (!heritage) return { modifiers, heritageDetails };

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
        heritageName: character.innateHeritage,
        type: "fixed",
        amount: increase.amount,
      });
    }
  });

  if (heritage.features && heritageChoices[character.innateHeritage]) {
    heritage.features.forEach((feature) => {
      if (feature.isChoice && feature.options) {
        const selectedChoiceName =
          heritageChoices[character.innateHeritage][feature.name];
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
                heritageName: character.innateHeritage,
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
                heritageName: character.innateHeritage,
                type: "choice",
                amount: increase.amount,
              });
            }
          });
        }
      }
    });
  }

  return { modifiers, heritageDetails };
};

// Helper function for spellcasting ability - you may need to implement this
export const getSpellcastingAbility = (character) => {
  // This should return the character's spellcasting ability based on their class/subclass
  // For now, returning a default - you'll need to implement based on your game rules
  return character.castingStyle || "intelligence";
};

// Main function to calculate total modifiers
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

  const totalModifiers = {
    strength:
      featResult.modifiers.strength +
      backgroundResult.modifiers.strength +
      houseResult.modifiers.strength +
      heritageResult.modifiers.strength,
    dexterity:
      featResult.modifiers.dexterity +
      backgroundResult.modifiers.dexterity +
      houseResult.modifiers.dexterity +
      heritageResult.modifiers.dexterity,
    constitution:
      featResult.modifiers.constitution +
      backgroundResult.modifiers.constitution +
      houseResult.modifiers.constitution +
      heritageResult.modifiers.constitution,
    intelligence:
      featResult.modifiers.intelligence +
      backgroundResult.modifiers.intelligence +
      houseResult.modifiers.intelligence +
      heritageResult.modifiers.intelligence,
    wisdom:
      featResult.modifiers.wisdom +
      backgroundResult.modifiers.wisdom +
      houseResult.modifiers.wisdom +
      heritageResult.modifiers.wisdom,
    charisma:
      featResult.modifiers.charisma +
      backgroundResult.modifiers.charisma +
      houseResult.modifiers.charisma +
      heritageResult.modifiers.charisma,
  };

  const allDetails = {};
  Object.keys(totalModifiers).forEach((ability) => {
    allDetails[ability] = [
      ...(featResult.featDetails[ability] || []),
      ...(backgroundResult.backgroundDetails[ability] || []),
      ...(houseResult.houseDetails[ability] || []),
      ...(heritageResult.heritageDetails[ability] || []),
    ];
  });

  return {
    totalModifiers,
    allDetails,
    featModifiers: featResult.modifiers,
    backgroundModifiers: backgroundResult.modifiers,
    houseModifiers: houseResult.modifiers,
    heritageModifiers: heritageResult.modifiers,
  };
};
