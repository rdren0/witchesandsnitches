import {
  calculateModifier,
  processDistinctCheckResult,
  getDistinctCheckActivityInfo,
  calculateDistinctCheckProgress,
  getAvailableCheckTypes,
  getSkillOptionsForCheck,
} from "../downtimeHelpers";

export const handleRecipeRollResult = (
  activityIndex,
  rollResult,
  diceValue,
  formData,
  updateActivity,
  selectedCharacter
) => {
  const activity = formData.activities[activityIndex];
  if (
    !activity ||
    !activity.activity.toLowerCase().includes("create a new recipe")
  ) {
    return;
  }

  const result = processDistinctCheckResult(
    selectedCharacter,
    activity,
    { total: rollResult, rollValue: diceValue },
    activity.selectedCheckType,
    activity.selectedCheckSkill
  );

  if (result) {
    updateActivity(activityIndex, "completedChecks", result.completedChecks);
    updateActivity(activityIndex, "selectedCheckType", "");
    updateActivity(activityIndex, "selectedCheckSkill", "");
  }
};

export const getCurrentRecipeCheckInfo = (activity) => {
  const progress = calculateDistinctCheckProgress(null, activity);
  if (!progress) return null;

  const availableChecks = getAvailableCheckTypes(activity);
  const currentCheck = activity.selectedCheckType
    ? progress.requiredChecks.find(
        (check) => check.id === activity.selectedCheckType
      )
    : null;

  return {
    progress: progress.progress,
    isComplete: progress.isComplete,
    completedChecks: progress.completedChecks,
    remainingChecks: progress.remainingChecks,
    availableChecks,
    currentCheck,
    currentSkill: activity.selectedCheckSkill,
  };
};

export const getRequiredRecipeSkill = (activity, character) => {
  if (!activity.selectedCheckType) {
    return null;
  }

  const skillOptions = getSkillOptionsForCheck(
    activity,
    activity.selectedCheckType
  );

  if (skillOptions.length === 1) {
    const skillOption = skillOptions[0];
    if (skillOption === "spellcastingAbility") {
      return character?.spellcastingAbility || "intelligence";
    }
    return skillOption;
  }

  return activity.selectedCheckSkill;
};

export const handleRecipeDiceAssignment = (
  activityIndex,
  diceIndex,
  formData,
  dicePool,
  selectedCharacter,
  updateActivity,
  rollAssignments,
  setRollAssignments,
  setDicePool
) => {
  const activity = formData.activities[activityIndex];
  const dice = dicePool[diceIndex];

  if (!activity || !dice) return;

  if (activity.activity.toLowerCase().includes("create a new recipe")) {
    if (!activity.selectedCheckType) {
      alert("Please select a check type before assigning a die.");
      return;
    }

    const requiredSkill = getRequiredRecipeSkill(activity, selectedCharacter);

    if (!requiredSkill) {
      alert("Please select a skill before assigning a die.");
      return;
    }

    const modifier = calculateModifier(requiredSkill, selectedCharacter);
    const totalRoll = dice.value + modifier;

    const completedChecks = activity.completedChecks || [];
    const alreadyCompleted = completedChecks.some(
      (completed) => completed.checkId === activity.selectedCheckType
    );

    if (alreadyCompleted) {
      alert("You have already completed this type of check for this recipe!");
      return;
    }

    handleRecipeRollResult(
      activityIndex,
      totalRoll,
      dice.value,
      formData,
      updateActivity,
      selectedCharacter
    );

    const checkInfo = getDistinctCheckActivityInfo(activity.activity);
    const currentCheck = checkInfo?.config.requiredChecks.find(
      (c) => c.id === activity.selectedCheckType
    );

    const newAssignments = { ...rollAssignments };
    newAssignments[`activity${activityIndex + 1}`] = {
      diceIndex: diceIndex,
      skill: requiredSkill,
      modifier: modifier,
      total: totalRoll,
      checkType: currentCheck?.name || "Unknown Check",
      dc: currentCheck?.dc || 12,
    };
    setRollAssignments(newAssignments);

    const newDicePool = [...dicePool];
    newDicePool[diceIndex] = { ...newDicePool[diceIndex], used: true };
    setDicePool(newDicePool);
  }
};

export const getSkillDisplayName = (skillName) => {
  const skillMappings = {
    survival: "Survival",
    muggleStudies: "Muggle Studies",
    historyOfMagic: "History of Magic",
    spellcastingAbility: "Spellcasting Ability",
    intelligence: "Intelligence",
    wisdom: "Wisdom",
    charisma: "Charisma",
  };

  return skillMappings[skillName] || skillName;
};

export const isRecipeReadyForSubmission = (activity) => {
  if (!activity.selectedCheckType || !activity.selectedCheckSkill) {
    return false;
  }

  const completedChecks = activity.completedChecks || [];
  const alreadyCompleted = completedChecks.some(
    (completed) => completed.checkId === activity.selectedCheckType
  );

  return !alreadyCompleted;
};

export const getRecipeCreationSummary = (activity) => {
  const progress = calculateDistinctCheckProgress(null, activity);
  if (!progress) return null;

  const summary = {
    recipeName: activity.recipeName || "Unnamed Recipe",
    progress: progress.progress,
    isComplete: progress.isComplete,
    completedChecks: progress.completedChecks.map((check) => ({
      type: check.checkName,
      skill: getSkillDisplayName(check.skillUsed),
      result: `${check.rollResult} vs DC ${check.dc}`,
      success: check.rollResult >= check.dc,
    })),
    remainingChecks: progress.remainingChecks.map((check) => ({
      type: check.name,
      description: check.description,
    })),
  };

  return summary;
};

export const validateRecipeActivity = (activity) => {
  if (!activity.recipeName?.trim()) {
    return { valid: false, message: "Please enter a recipe name." };
  }

  if (!activity.selectedCheckType) {
    return { valid: false, message: "Please select a check type to attempt." };
  }

  if (!activity.selectedCheckSkill) {
    return { valid: false, message: "Please select a skill for this check." };
  }

  const completedChecks = activity.completedChecks || [];
  const alreadyCompleted = completedChecks.some(
    (completed) => completed.checkId === activity.selectedCheckType
  );

  if (alreadyCompleted) {
    return {
      valid: false,
      message: "You have already completed this type of check for this recipe.",
    };
  }

  return { valid: true };
};

export const initializeRecipeActivity = () => {
  return {
    activity:
      "Create a New Recipe - Must complete three distinct checks across separate downtime slots: Survival Check, Cultural Research Check (Muggle Studies OR History of Magic), and Spellcasting Ability Check",
    recipeName: "",
    selectedCheckType: "",
    selectedCheckSkill: "",
    completedChecks: [],
    successes: [false, false, false, false, false],
    npc: "",
  };
};

export const getNextSuggestedCheck = (activity) => {
  const availableChecks = getAvailableCheckTypes(activity);
  if (availableChecks.length === 0) return null;

  const preferredOrder = ["survival", "cultural", "magical"];

  for (const preferred of preferredOrder) {
    const found = availableChecks.find((check) => check.id === preferred);
    if (found) return found;
  }

  return availableChecks[0];
};
