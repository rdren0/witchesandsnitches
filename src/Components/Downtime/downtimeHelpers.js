import { allSkills } from "../../SharedData/data";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { wandModifiers } from "../../SharedData/downtime";

export const activityRequiresDualChecks = (activityText) => {
  if (!activityText) return false;

  const text = activityText.toLowerCase();

  return (
    text.includes("stealth and investigation") ||
    text.includes("sleight of hand and investigation") ||
    text.includes("explore the forbidden forest") ||
    text.includes("restricted section") ||
    text.includes("stealing")
  );
};

export const activityRequiresSpellSelection = (activityText) => {
  if (!activityText) return false;

  const text = activityText.toLowerCase();

  return text.includes("research spells") || text.includes("attempt spells");
};

export const activityRequiresWandSelection = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("increase wand stat");
};

export const activityRequiresClassSelection = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("studying");
};

export const getActivitySkillInfo = (activityText) => {
  if (!activityText) return { type: "free", skills: null };

  const text = activityText.toLowerCase();

  if (text.includes("research spells") || text.includes("attempt spells")) {
    return {
      type: "spell",
      requiresSpell: true,
    };
  }

  if (text.includes("increase wand stat")) {
    return {
      type: "wand_increase",
      requiresWandSelection: true,
      requiresNoDiceRoll: false,
      skills: [],
    };
  }

  if (text.includes("studying")) {
    return {
      type: "class_selection",
      requiresClassSelection: true,
      skills: [],
    };
  }

  if (text.includes("dig for dirt")) {
    return {
      type: "limited",
      skills: ["investigation", "insight", "intimidation", "persuasion"],
    };
  }

  if (text.includes("spread rumors")) {
    return {
      type: "limited",
      skills: ["deception", "intimidation", "performance", "persuasion"],
    };
  }

  if (text.includes("invent a potion")) {
    return {
      type: "limited",
      skills: ["potionMaking", "herbology", "survival"],
    };
  }

  if (text.includes("create a spell")) {
    return {
      type: "locked",
      skills: ["magicalTheory"],
    };
  }

  if (text.includes("brew a potion")) {
    return {
      type: "locked",
      skills: ["potionMaking"],
    };
  }

  if (text.includes("research a topic")) {
    return {
      type: "locked",
      skills: ["investigation"],
    };
  }

  if (text.includes("learn a recipe")) {
    return {
      type: "locked",
      skills: ["survival"],
    };
  }

  if (text.includes("gain a job") || text.includes("promotion")) {
    return {
      type: "suggested",
      skills: ["persuasion"],
      allowAll: true,
      note: "Use Magical Creatures at Magical Menagerie",
    };
  }

  if (text.includes("stealth and investigation")) {
    return {
      type: "locked",
      skills: ["stealth", "investigation"],
    };
  }

  if (text.includes("sleight of hand and investigation")) {
    return {
      type: "locked",
      skills: ["sleightOfHand", "investigation"],
    };
  }

  if (
    text.includes("explore the castle") &&
    text.includes("roll investigation")
  ) {
    return {
      type: "locked",
      skills: ["investigation"],
    };
  }

  if (text.includes("cooking")) {
    return {
      type: "limited",
      skills: ["survival", "muggleStudies"],
    };
  }

  if (
    text.includes("search for magical creatures") &&
    text.includes("roll magical creatures")
  ) {
    return {
      type: "locked",
      skills: ["magicalCreatures"],
    };
  }

  if (text.includes("search for plants") && text.includes("roll herbology")) {
    return {
      type: "locked",
      skills: ["herbology"],
    };
  }

  if (text.includes("roll persuasion") && !text.includes("or")) {
    return {
      type: "locked",
      skills: ["persuasion"],
    };
  }

  if (
    text.includes("roll investigation") &&
    !text.includes("or") &&
    !text.includes(",")
  ) {
    return {
      type: "locked",
      skills: ["investigation"],
    };
  }

  if (text.includes("roll magical creatures") && !text.includes("or")) {
    return {
      type: "locked",
      skills: ["magicalCreatures"],
    };
  }

  if (text.includes("roll herbology") && !text.includes("or")) {
    return {
      type: "locked",
      skills: ["herbology"],
    };
  }

  if (text.includes("roll history of magic") && !text.includes("or")) {
    return {
      type: "locked",
      skills: ["historyOfMagic"],
    };
  }

  return {
    type: "free",
    skills: null,
  };
};

export const getAvailableWandModifiersForIncrease = (selectedCharacter) => {
  if (!selectedCharacter?.magicModifiers) return [];

  const wandModifiers = [
    { name: "charms", displayName: "Charms" },
    { name: "transfiguration", displayName: "Transfiguration" },
    { name: "jinxesHexesCurses", displayName: "Jinxes, Hexes & Curses" },
    { name: "healing", displayName: "Healing" },
    { name: "divinations", displayName: "Divinations" },
  ];

  return wandModifiers.filter((wand) => {
    const currentValue = selectedCharacter.magicModifiers[wand.name] || 0;
    return currentValue < 5;
  });
};

export const calculateWandStatIncreaseDC = (
  selectedCharacter,
  wandModifierName
) => {
  if (!selectedCharacter?.magicModifiers || !wandModifierName) return 11;

  const currentModifier =
    selectedCharacter.magicModifiers[wandModifierName] || 0;
  return 11 + currentModifier;
};

export const validateWandStatIncreaseActivity = (
  activity,
  selectedCharacter
) => {
  if (!activityRequiresWandSelection(activity.activity)) return { valid: true };

  if (!activity.selectedWandModifier) {
    return {
      valid: false,
      message: "Please select a wand modifier to increase.",
    };
  }

  const currentValue =
    selectedCharacter?.magicModifiers?.[activity.selectedWandModifier] || 0;
  if (currentValue >= 5) {
    return {
      valid: false,
      message: "This wand modifier is already at maximum (+5).",
    };
  }

  return { valid: true };
};

export const validateStudyActivity = (activity) => {
  if (!activityRequiresClassSelection(activity.activity))
    return { valid: true };

  if (!activity.selectedClass) {
    return {
      valid: false,
      message: "Please select a class for the Study activity.",
    };
  }

  return { valid: true };
};

export const calculateModifier = (skillOrWandName, selectedCharacter) => {
  if (!skillOrWandName || !selectedCharacter) return 0;

  const wandModifier = wandModifiers.find((w) => w.name === skillOrWandName);
  if (wandModifier) {
    return selectedCharacter.magicModifiers?.[skillOrWandName] || 0;
  }

  const skill = allSkills.find((s) => s.name === skillOrWandName);
  if (!skill) {
    console.warn(`Skill "${skillOrWandName}" not found in allSkills array`);
    return 0;
  }

  let abilityMod = 0;
  if (selectedCharacter[skill.ability] !== undefined) {
    abilityMod = Math.floor((selectedCharacter[skill.ability] - 10) / 2);
  } else if (selectedCharacter.abilityScores?.[skill.ability] !== undefined) {
    abilityMod = Math.floor(
      (selectedCharacter.abilityScores[skill.ability] - 10) / 2
    );
  }

  let skillLevel = 0;
  if (
    selectedCharacter.skills &&
    selectedCharacter.skills[skillOrWandName] !== undefined
  ) {
    skillLevel = selectedCharacter.skills[skillOrWandName];
  } else {
    const skillProficiencies =
      selectedCharacter.skillProficiencies ||
      selectedCharacter.skill_proficiencies ||
      [];
    const skillExpertise =
      selectedCharacter.skillExpertise ||
      selectedCharacter.skill_expertise ||
      [];

    if (skillExpertise.includes(skill.displayName)) {
      skillLevel = 2;
    } else if (skillProficiencies.includes(skill.displayName)) {
      skillLevel = 1;
    }
  }

  const profBonus =
    selectedCharacter.proficiencyBonus ||
    (selectedCharacter.level ? Math.ceil(selectedCharacter.level / 4) + 1 : 2);

  if (skillLevel === 0) return abilityMod;
  if (skillLevel === 1) return abilityMod + profBonus;
  if (skillLevel === 2) return abilityMod + 2 * profBonus;

  return abilityMod;
};

export const activityRequiresAbilitySelection = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("increase an ability score");
};

export const getAvailableAbilityScoresForIncrease = (selectedCharacter) => {
  const abilities = [
    { name: "strength", displayName: "Strength" },
    { name: "dexterity", displayName: "Dexterity" },
    { name: "constitution", displayName: "Constitution" },
    { name: "intelligence", displayName: "Intelligence" },
    { name: "wisdom", displayName: "Wisdom" },
    { name: "charisma", displayName: "Charisma" },
  ];

  return abilities.filter((ability) => {
    const currentValue =
      selectedCharacter?.abilityScores?.[ability.name] ||
      selectedCharacter?.[ability.name] ||
      10;

    return currentValue < 20;
  });
};

export const calculateAbilityScoreIncreaseDC = (
  selectedCharacter,
  abilityName
) => {
  if (!selectedCharacter || !abilityName) return 10;

  const currentScore =
    selectedCharacter.abilityScores?.[abilityName] ||
    selectedCharacter[abilityName] ||
    10;

  return currentScore;
};

export const getAbilityScoreModifier = (selectedCharacter, abilityName) => {
  if (!selectedCharacter || !abilityName) return 0;

  const currentScore =
    selectedCharacter.abilityScores?.[abilityName] ||
    selectedCharacter[abilityName] ||
    10;

  return Math.floor((currentScore - 10) / 2);
};

export const validateAbilityScoreIncreaseActivity = (
  activity,
  selectedCharacter
) => {
  if (!activityRequiresAbilitySelection(activity.activity))
    return { valid: true };

  if (!activity.selectedAbilityScore) {
    return {
      valid: false,
      message: "Please select an ability score to increase.",
    };
  }

  const currentValue =
    selectedCharacter?.abilityScores?.[activity.selectedAbilityScore] ||
    selectedCharacter?.[activity.selectedAbilityScore] ||
    10;

  if (currentValue >= 20) {
    return {
      valid: false,
      message: "This ability score is already at maximum (20).",
    };
  }

  return { valid: true };
};

export const MULTI_SUCCESS_ACTIVITIES = {
  "increase an ability score": {
    requiredSuccesses: 3,
    getKey: (activity) => `ability_${activity.selectedAbilityScore}`,
    getDC: (character, activity) => {
      const currentScore =
        character?.abilityScores?.[activity.selectedAbilityScore] || 10;
      return currentScore;
    },
  },
  "gain proficiency or expertise": {
    requiredSuccesses: 3,
    getKey: (activity) =>
      `skill_${activity.selectedSkill}_${
        activity.targetLevel || "proficiency"
      }`,
    getDC: (character, activity) => {
      const skillName = activity.selectedSkill;
      const targetLevel = activity.targetLevel || "proficiency";

      if (!skillName || !character?.abilityScores) return 10;

      const skill = allSkills.find((s) => s.name === skillName);
      if (!skill) return 10;

      const abilityScore = character.abilityScores[skill.ability] || 10;

      if (targetLevel === "expertise") {
        const profBonus = Math.ceil(character.level / 4) + 1;
        return abilityScore + profBonus;
      }

      return abilityScore;
    },
    handleNat20: (currentSuccesses, isThirdAttempt) => {
      if (isThirdAttempt) {
        return { successes: currentSuccesses + 1, bonusExpertiseSuccess: 1 };
      }

      return { successes: currentSuccesses + 2, bonusExpertiseSuccess: 0 };
    },
  },
  "create a spell": {
    requiredSuccesses: 3,
    getKey: (activity) => `spell_creation_${activity.spellName || "unnamed"}`,
    getDC: (character, activity) => {
      const spellLevel = activity.spellLevel || 1;
      const currentYear = character.year || 1;
      return 17 + spellLevel - currentYear;
    },
    getCheckTypes: () => [
      "Magical Theory Check",
      "Wand Modifier Check",
      "Spellcasting Ability Check",
    ],
    handleNat20: (currentSuccesses, isThirdAttempt) => {
      return { successes: currentSuccesses + 1, bonusExpertiseSuccess: 0 };
    },
    requiresSeparateSlots: true,
    description:
      "Create a new spell through theoretical research, wand experimentation, and practical spellcasting tests",
  },
  "invent a potion": {
    requiredSuccesses: 3,
    getKey: (activity) =>
      `potion_invention_${activity.potionName || "unnamed"}`,
    getDC: () => 15,
  },
  "create a new recipe": {
    requiredSuccesses: 3,
    getKey: (activity) => `recipe_creation_${activity.recipeName || "unnamed"}`,
    getDC: () => 12,
  },
  "engineer plants": {
    requiredSuccesses: 3,
    getKey: (activity) =>
      `plant_engineering_${activity.plantName || "unnamed"}`,
    getDC: () => 16,
  },
};

export const getMultiSuccessActivityInfo = (activityText) => {
  if (!activityText) return null;

  const text = activityText.toLowerCase();

  for (const [key, config] of Object.entries(MULTI_SUCCESS_ACTIVITIES)) {
    if (text.includes(key)) {
      return {
        type: key,
        config: config,
        description: `Requires ${config.requiredSuccesses} successful checks across separate downtime sessions`,
      };
    }
  }

  return null;
};

export const calculateSuccessProgress = (
  character,
  activity,
  currentSuccesses = 0
) => {
  const info = getMultiSuccessActivityInfo(activity.activity);
  if (!info) return null;

  const dc = info.config.getDC(character, activity);
  const key = info.config.getKey(activity);

  return {
    key,
    currentSuccesses,
    requiredSuccesses: info.config.requiredSuccesses,
    dc,
    isComplete: currentSuccesses >= info.config.requiredSuccesses,
  };
};

export const activityRequiresSkillSelection = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("gain proficiency or expertise");
};

export const activityRequiresNameInput = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return (
    text.includes("invent a potion") ||
    text.includes("create a new recipe") ||
    text.includes("engineer plants")
  );
};

export const getAvailableSkillsForProficiency = (character) => {
  if (!character) return [];

  return allSkills.filter((skill) => {
    const currentLevel =
      character.skillProficiencies?.[skill.name] ||
      character.skill_proficiencies?.[skill.name] ||
      0;
    return currentLevel < 2;
  });
};

export const getTargetProficiencyLevel = (character, skillName) => {
  if (!character || !skillName) return "proficiency";

  const currentLevel =
    character.skillProficiencies?.[skillName] ||
    character.skill_proficiencies?.[skillName] ||
    0;
  return currentLevel === 0 ? "proficiency" : "expertise";
};

export const processSuccessResult = (
  character,
  activity,
  diceResult,
  currentSuccesses = 0
) => {
  const info = getMultiSuccessActivityInfo(activity.activity);
  if (!info) return null;

  const dc = info.config.getDC(character, activity);
  const isSuccess = diceResult.total >= dc;
  const isNat20 = diceResult.rollValue === 20;

  let newSuccesses = currentSuccesses;
  let bonusExpertiseSuccess = 0;

  if (isSuccess) {
    if (isNat20 && info.config.handleNat20) {
      const isThirdAttempt = currentSuccesses === 2;
      const result = info.config.handleNat20(currentSuccesses, isThirdAttempt);
      newSuccesses = result.successes;
      bonusExpertiseSuccess = result.bonusExpertiseSuccess || 0;
    } else {
      newSuccesses = currentSuccesses + 1;
    }
  }

  const isComplete = newSuccesses >= info.config.requiredSuccesses;

  return {
    success: isSuccess,
    newSuccesses,
    bonusExpertiseSuccess,
    isComplete,
    dc,
    key: info.config.getKey(activity),
  };
};

export const validateSkillName = (skillName) => {
  if (!skillName) return false;
  return allSkills.some((skill) => skill.name === skillName);
};

export const activityRequiresNoDiceRoll = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("shopping") || text.includes("selling");
};

export const isMultiSessionActivity = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return (
    text.includes("increase an ability score") ||
    text.includes("gain proficiency or expertise") ||
    text.includes("create a spell") ||
    text.includes("three separate checks")
  );
};

export const shouldUseCustomDiceForActivity = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("allowance") || text.includes("work job");
};

export const getCustomDiceTypeForActivity = (activityText) => {
  if (!activityText) return null;
  const text = activityText.toLowerCase();

  if (text.includes("allowance")) {
    return {
      diceType: "Family Allowance",
      description:
        "Roll based on family economic status. Admin will determine family type and any bonuses.",
      rollFunction: (familyType = "middle") => {
        try {
          let diceNotation;

          switch (familyType.toLowerCase()) {
            case "poor":
              diceNotation = "2d4";
              break;
            case "rich":
              diceNotation = "2d8";
              break;
            case "middle":
            default:
              diceNotation = "2d6";
              break;
          }

          const roller = new DiceRoller();
          const result = roller.roll(diceNotation);

          const individualDice = result.rolls[0].rolls.map((die) => die.value);
          return individualDice;
        } catch (error) {
          console.error("Error rolling family allowance dice:", error);

          let sides;
          switch (familyType.toLowerCase()) {
            case "poor":
              sides = 4;
              break;
            case "rich":
              sides = 8;
              break;
            default:
              sides = 6;
              break;
          }
          return [
            Math.floor(Math.random() * sides) + 1,
            Math.floor(Math.random() * sides) + 1,
          ];
        }
      },
    };
  }

  if (text.includes("work job")) {
    return {
      diceType: "Job Earnings",
      description:
        "Based on job difficulty level. Admin will determine job level and promotions.",
      rollFunction: (jobType = "medium") => {
        try {
          let diceNotation;

          switch (jobType.toLowerCase()) {
            case "easy":
              diceNotation = "2D8";
              break;
            case "hard":
              diceNotation = "2D12";
              break;
            case "medium":
            default:
              diceNotation = "2D10";
              break;
          }

          const roller = new DiceRoller();
          const result = roller.roll(diceNotation);

          const individualDice = result.rolls[0].rolls.map((die) => die.value);
          return individualDice;
        } catch (error) {
          console.error("Error rolling job earnings dice:", error);

          let sides;
          switch (jobType.toLowerCase()) {
            case "easy":
              sides = 8;
              break;
            case "hard":
              sides = 12;
              break;
            default:
              sides = 10;
              break;
          }
          return [
            Math.floor(Math.random() * sides) + 1,
            Math.floor(Math.random() * sides) + 1,
          ];
        }
      },
    };
  }

  return null;
};

export const activityRequiresExtraDie = (activityText) => {
  if (!activityText) return false;

  const text = activityText.toLowerCase();

  return text.includes("research spells") || text.includes("attempt spells");
};

export const activityRequiresSpecialRules = (activityText) => {
  return (
    activityRequiresNoDiceRoll(activityText) ||
    isMultiSessionActivity(activityText) ||
    shouldUseCustomDiceForActivity(activityText) ||
    activityRequiresExtraDie(activityText) ||
    activityRequiresWandSelection(activityText) ||
    activityRequiresClassSelection(activityText) ||
    activityRequiresAbilitySelection(activityText)
  );
};

export const getMultiSessionInfo = (activityText) => {
  if (!activityText) return null;
  const text = activityText.toLowerCase();

  const isMultiSessionPattern =
    /(increase an ability score|gain proficiency|gain expertise|create a spell|engineer plants|invent a potion|create a new recipe)/;

  if (isMultiSessionPattern.test(text)) {
    return {
      description:
        "Requires three separate successful checks across different downtime sessions",
    };
  }

  return null;
};

export const getSpecialActivityInfo = (activityText) => {
  if (!activityText) return null;
  const text = activityText.toLowerCase();

  if (text.includes("studying")) {
    return {
      type: "class_study",
      description:
        "Select a class to focus your studies on. This improves your performance in that specific class through dedicated study time.",
    };
  }

  if (text.includes("research spells")) {
    return {
      type: "spell_research",
      description:
        "Research spells to learn their theory and prepare for casting attempts. Successful research allows future spell attempts.",
    };
  }

  if (text.includes("increase an ability score")) {
    return {
      type: "ability_increase",
      description:
        "Select an ability score to increase. Roll d20 + current ability modifier vs DC (current ability score). Success increases the ability score by +1 (maximum 20).",
    };
  }

  if (text.includes("attempt spells")) {
    return {
      type: "spell_attempt",
      description:
        "Practice casting spells you have previously researched or attempted. Two successful attempts master the spell permanently.",
    };
  }

  if (text.includes("gain a job")) {
    return {
      type: "job_application",
      description:
        "Job difficulty determines DC: Easy (DC 10), Medium (DC 15), Hard (DC 20). Use Magical Creatures check at Magical Menagerie.",
    };
  }

  if (text.includes("promotion")) {
    return {
      type: "promotion",
      description:
        "Job difficulty + current promotions determines DC: Easy (DC 10 + promotions), Medium (DC 15 + promotions), Hard (DC 20 + promotions). Use Magical Creatures check at Magical Menagerie.",
    };
  }

  if (text.includes("work job")) {
    return {
      type: "work_earnings",
      description:
        "Earnings based on job level: Easy (2D8 + 1D8 per promotion), Medium (2d10 + 1d10 per promotion), Hard (2d12 + 1d12 per promotion). All amounts ×2 Galleons.",
    };
  }

  if (text.includes("shopping")) {
    return {
      type: "shopping",
      description:
        "Purchase items from shopping list at half buy price. No haggling allowed. Can be done without using a downtime slot.",
    };
  }

  if (text.includes("selling")) {
    return {
      type: "selling",
      description:
        "Sell items at half their original price. No haggling allowed. Can be done without using a downtime slot.",
    };
  }

  return null;
};
