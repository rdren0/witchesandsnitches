import { standardFeats } from "../../SharedData/standardFeatData";
import { backgroundsData } from "../../SharedData/backgroundsData";
import { houseFeatures } from "../../SharedData/houseData";
import { heritageDescriptions } from "../../SharedData/heritageData";
import { hpData } from "../../SharedData/data";

export const getAllSelectedFeats = (character) => {
  const allFeats = [];

  if (character.level1ChoiceType === "feat" && character.standardFeats) {
    allFeats.push(...character.standardFeats);
  }

  if (character.asiChoices) {
    Object.values(character.asiChoices).forEach((choice) => {
      if (choice.type === "feat" && choice.selectedFeat) {
        allFeats.push(choice.selectedFeat);
      }
    });
  }

  return [...new Set(allFeats)];
};

export const skillsByCastingStyle = {
  "Willpower Caster": [
    "Athletics",
    "Acrobatics",
    "Deception",
    "Intimidation",
    "History of Magic",
    "Magical Creatures",
    "Persuasion",
    "Sleight of Hand",
    "Survival",
  ],
  "Technique Caster": [
    "Acrobatics",
    "Herbology",
    "Magical Theory",
    "Insight",
    "Perception",
    "Potion Making",
    "Sleight of Hand",
    "Stealth",
  ],
  "Intellect Caster": [
    "Acrobatics",
    "Herbology",
    "Magical Theory",
    "Insight",
    "Investigation",
    "Magical Creatures",
    "History of Magic",
    "Medicine",
    "Muggle Studies",
    "Survival",
  ],
  "Vigor Caster": [
    "Athletics",
    "Acrobatics",
    "Deception",
    "Stealth",
    "Magical Creatures",
    "Medicine",
    "Survival",
    "Intimidation",
    "Performance",
  ],
};

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

export const getSpellcastingAbility = (character) => {
  const castingStyle = character.castingStyle;
  const abilityMap = {
    "Grace Caster": "charisma",
    "Vigor Caster": "constitution",
    "Wit Caster": "intelligence",
    "Wisdom Caster": "wisdom",
  };
  return abilityMap[castingStyle] || "intelligence";
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

  if (!character.house || !houseFeatures[character.house]) {
    return { modifiers, houseDetails };
  }

  const houseBonuses = houseFeatures[character.house];

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

  if (houseChoices[character.house]?.abilityChoice) {
    const chosenAbility = houseChoices[character.house].abilityChoice;
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
  }

  return { modifiers, houseDetails };
};

const calculateFeatModifiers = (character, featChoices = {}) => {
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

    if (!feat?.benefits?.abilityScoreIncrease) return;

    const increase = feat.benefits.abilityScoreIncrease;
    let abilityToIncrease;

    const choiceKey = `${featName}_ability_0`;

    switch (increase.type) {
      case "fixed":
        abilityToIncrease = increase.ability;
        break;
      case "choice":
      case "choice_any":
        abilityToIncrease = featChoices[choiceKey] || increase.abilities?.[0];
        break;
      case "spellcasting_ability":
        abilityToIncrease = getSpellcastingAbility(character);
        break;
      default:
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
