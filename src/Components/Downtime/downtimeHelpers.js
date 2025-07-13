import { allSkills } from "../../SharedData/data";

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
  "engineer plants": {
    requiredSuccesses: 3,
    getKey: (activity) =>
      `plant_engineering_${activity.plantName || "unnamed"}`,
    getDC: () => 16,
  },
};

export const DISTINCT_CHECK_ACTIVITIES = {
  "create a new recipe": {
    requiredChecks: [
      {
        id: "survival",
        name: "Survival Check",
        description:
          "Roll Survival + Wisdom modifier to test practical cooking techniques and ingredient knowledge",

        skillOptions: ["survival"],
      },
      {
        id: "cultural",
        name: "Cultural Research Check",
        description: "Research cultural food traditions and historical recipes",

        skillOptions: ["muggleStudies", "historyOfMagic"],
      },
      {
        id: "magical",
        name: "Spellcasting Ability Check",
        description:
          "Roll with your Spellcasting Ability modifier to infuse magical properties into the recipe",

        skillOptions: ["spellcastingAbility"],
      },
    ],
    getKey: (activity) => `recipe_creation_${activity.recipeName || "unnamed"}`,
    description:
      "Create a new recipe through three distinct checks: Survival, Cultural Research, and Magical Enhancement",
  },
};

export const isDistinctCheckActivity = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return Object.keys(DISTINCT_CHECK_ACTIVITIES).some((key) =>
    text.includes(key)
  );
};

export const getDistinctCheckActivityInfo = (activityText) => {
  if (!activityText) return null;

  const text = activityText.toLowerCase();

  for (const [key, config] of Object.entries(DISTINCT_CHECK_ACTIVITIES)) {
    if (text.includes(key)) {
      return {
        type: key,
        config: config,
      };
    }
  }

  return null;
};

export const calculateDistinctCheckProgress = (character, activity) => {
  const info = getDistinctCheckActivityInfo(activity.activity);
  if (!info) return null;

  const completedChecks = activity.completedChecks || [];
  const key = info.config.getKey(activity);

  return {
    key,
    completedChecks,
    requiredChecks: info.config.requiredChecks,
    remainingChecks: info.config.requiredChecks.filter(
      (check) =>
        !completedChecks.some((completed) => completed.checkId === check.id)
    ),
    isComplete: completedChecks.length >= info.config.requiredChecks.length,
    progress: `${completedChecks.length}/${info.config.requiredChecks.length}`,
  };
};

export const processDistinctCheckResult = (
  character,
  activity,
  diceResult,
  selectedCheck,
  selectedSkill
) => {
  const info = getDistinctCheckActivityInfo(activity.activity);
  if (!info) return null;

  const checkConfig = info.config.requiredChecks.find(
    (check) => check.id === selectedCheck
  );
  if (!checkConfig) return null;

  const dc = checkConfig.dc;
  const isSuccess = diceResult.total >= dc;

  let completedChecks = [...(activity.completedChecks || [])];

  const alreadyCompleted = completedChecks.some(
    (completed) => completed.checkId === selectedCheck
  );

  if (isSuccess && !alreadyCompleted) {
    completedChecks.push({
      checkId: selectedCheck,
      checkName: checkConfig.name,
      skillUsed: selectedSkill,
      rollResult: diceResult.total,
      dc: dc,
    });
  }

  const isComplete =
    completedChecks.length >= info.config.requiredChecks.length;

  return {
    success: isSuccess,
    alreadyCompleted,
    completedChecks,
    isComplete,
    dc,
    key: info.config.getKey(activity),
    checkName: checkConfig.name,
  };
};

export const validateDistinctCheckActivity = (activity, selectedCharacter) => {
  if (!isDistinctCheckActivity(activity.activity)) {
    return { valid: true };
  }

  if (!activity.recipeName) {
    return {
      valid: false,
      message: "Please enter a recipe name.",
    };
  }

  if (!activity.selectedCheckType) {
    return {
      valid: false,
      message: "Please select which type of check you want to attempt.",
    };
  }

  if (!activity.selectedCheckSkill) {
    return {
      valid: false,
      message: "Please select which skill to use for this check.",
    };
  }

  const completedChecks = activity.completedChecks || [];
  const alreadyCompleted = completedChecks.some(
    (completed) => completed.checkId === activity.selectedCheckType
  );

  if (alreadyCompleted) {
    return {
      valid: false,
      message:
        "You have already successfully completed this type of check for this recipe.",
    };
  }

  return { valid: true };
};

export const getAvailableCheckTypes = (activity) => {
  const info = getDistinctCheckActivityInfo(activity.activity);
  if (!info) return [];

  const completedChecks = activity.completedChecks || [];

  return info.config.requiredChecks.filter(
    (check) =>
      !completedChecks.some((completed) => completed.checkId === check.id)
  );
};

export const getSkillOptionsForCheck = (activity, checkId) => {
  const info = getDistinctCheckActivityInfo(activity.activity);

  if (!info) return [];

  const checkConfig = info.config.requiredChecks.find(
    (check) => check.id === checkId
  );

  const result = checkConfig ? checkConfig.skillOptions : [];
  return result;
};

export const getRecipeCheckDescription = (checkType) => {
  switch (checkType) {
    case "Survival":
      return "Roll Survival + Wisdom modifier to test practical cooking techniques and ingredient knowledge";
    case "Cultural Research":
      return "Roll either Muggle Studies OR History of Magic + Intelligence modifier to research cultural food traditions and historical recipes";
    case "Spellcasting Ability":
      return "Roll with your Spellcasting Ability modifier to infuse magical properties into the recipe";
    default:
      return "";
  }
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

export const activityRequiresCheckTypeSelection = (activityText) => {
  return isDistinctCheckActivity(activityText);
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
    text.includes("engineer plants") ||
    text.includes("create a spell")
  );
};

export const activityRequiresAbilitySelection = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("increase an ability score");
};

export const activityRequiresWandSelection = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("wand stat");
};

export const activityRequiresClassSelection = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("study");
};

export const activityRequiresSpellSelection = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("research spells") || text.includes("attempt spells");
};

export const activityRequiresDualChecks = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return (
    text.includes("restricted section") ||
    text.includes("forbidden forest") ||
    text.includes("stealing")
  );
};

export const activityRequiresExtraDie = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("research spells") || text.includes("attempt spells");
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
    text.includes("create a new recipe") ||
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
    };
  }

  if (text.includes("work job")) {
    return {
      diceType: "Job Earnings",
      description:
        "Roll based on job difficulty. Admin will determine job type and bonuses.",
    };
  }

  return null;
};

export const calculateModifier = (skillName, character) => {
  if (!skillName || !character) return 0;

  if (skillName === "spellcastingAbility") {
    const spellcastingAbility = character.spellcastingAbility || "intelligence";
    const abilityScore =
      character.abilityScores?.[spellcastingAbility] ||
      character[spellcastingAbility] ||
      10;
    return Math.floor((abilityScore - 10) / 2);
  }

  const abilityScores = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];

  if (abilityScores.includes(skillName.toLowerCase())) {
    const abilityValue =
      character.abilityScores?.[skillName.toLowerCase()] ||
      character[skillName.toLowerCase()] ||
      10;
    return Math.floor((abilityValue - 10) / 2);
  }

  const wandModifiers = [
    "charms",
    "transfiguration",
    "jinxesHexesCurses",
    "healing",
    "divinations",
  ];
  if (wandModifiers.includes(skillName)) {
    return (
      character.magicModifiers?.[skillName] ||
      character.magic_modifiers?.[skillName] ||
      0
    );
  }

  const skill = allSkills.find((s) => s.name === skillName);
  if (!skill) {
    console.warn(`Skill "${skillName}" not found in allSkills array`);
    return 0;
  }

  const abilityScore =
    character.abilityScores?.[skill.ability] || character[skill.ability] || 10;
  const abilityModifier = Math.floor((abilityScore - 10) / 2);

  let proficiencyLevel = 0;

  if (character.skillProficiencies?.[skillName] !== undefined) {
    proficiencyLevel = character.skillProficiencies[skillName];
  } else if (character.skill_proficiencies?.[skillName] !== undefined) {
    proficiencyLevel = character.skill_proficiencies[skillName];
  } else if (character.skillProficiencies?.[skill.displayName] !== undefined) {
    proficiencyLevel = character.skillProficiencies[skill.displayName];
  } else if (character.skill_proficiencies?.[skill.displayName] !== undefined) {
    proficiencyLevel = character.skill_proficiencies[skill.displayName];
  } else {
    const skillProficiencies =
      character.skillProficiencies || character.skill_proficiencies || [];
    const skillExpertise =
      character.skillExpertise || character.skill_expertise || [];

    if (
      Array.isArray(skillProficiencies) &&
      skillProficiencies.includes(skill.displayName)
    ) {
      proficiencyLevel = 1;
    }
    if (
      Array.isArray(skillExpertise) &&
      skillExpertise.includes(skill.displayName)
    ) {
      proficiencyLevel = 2;
    }
  }

  const proficiencyBonus =
    character.proficiencyBonus ||
    (character.level ? Math.ceil(character.level / 4) + 1 : 2);

  let skillModifier = abilityModifier;
  if (proficiencyLevel >= 1) {
    skillModifier += proficiencyBonus;
  }
  if (proficiencyLevel >= 2) {
    skillModifier += proficiencyBonus;
  }

  return skillModifier;
};

export const getAvailableAbilityScores = (character) => {
  if (!character) return [];

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
      character.abilityScores?.[ability.name] || character[ability.name] || 10;

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

export const validateSkillName = (skillName) => {
  if (!skillName) return false;
  return allSkills.some((skill) => skill.name === skillName);
};

export const calculateWandStatIncreaseDC = (selectedCharacter, wandStat) => {
  if (!selectedCharacter || !wandStat) return 10;

  const currentValue =
    selectedCharacter.magicModifiers?.[wandStat] ||
    selectedCharacter.magic_modifiers?.[wandStat] ||
    0;

  return 10 + currentValue;
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
    selectedCharacter?.magicModifiers?.[activity.selectedWandModifier] ||
    selectedCharacter?.magic_modifiers?.[activity.selectedWandModifier] ||
    0;

  if (currentValue >= 5) {
    return {
      valid: false,
      message: "This wand modifier is already at maximum (+5).",
    };
  }

  return { valid: true };
};

export const getActivitySkillInfo = (activityText) => {
  if (!activityText) return { type: "open" };

  const text = activityText.toLowerCase();

  if (text.includes("restricted section")) {
    return {
      type: "locked",
      skills: ["stealth", "investigation"],
    };
  }

  if (text.includes("forbidden forest")) {
    return {
      type: "locked",
      skills: ["stealth", "investigation"],
    };
  }

  if (text.includes("stealing")) {
    return {
      type: "locked",
      skills: ["sleightOfHand", "investigation"],
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

  if (
    text.includes("explore the castle") &&
    text.includes("roll investigation")
  ) {
    return {
      type: "locked",
      skills: ["investigation"],
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

  if (text.includes("cooking")) {
    return {
      type: "limited",
      skills: ["survival", "muggleStudies"],
    };
  }

  if (text.includes("engineer plants")) {
    return {
      type: "limited",
      skills: ["herbology", "survival"],
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

  return { type: "open" };
};

export const getMultiSessionInfo = getMultiSuccessActivityInfo;

export const getSpecialActivityInfo = (activityText) => {
  if (!activityText) return null;

  const text = activityText.toLowerCase();

  if (shouldUseCustomDiceForActivity(activityText)) {
    return getCustomDiceTypeForActivity(activityText);
  }

  const multiSuccess = getMultiSuccessActivityInfo(activityText);
  if (multiSuccess) {
    return {
      type: "multi-success",
      ...multiSuccess,
    };
  }

  const distinctCheck = getDistinctCheckActivityInfo(activityText);
  if (distinctCheck) {
    return {
      type: "distinct-check",
      ...distinctCheck,
    };
  }

  return null;
};
