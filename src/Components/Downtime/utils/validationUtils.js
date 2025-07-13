import {
  activityRequiresWandSelection,
  validateWandStatIncreaseActivity,
  activityRequiresSpellSelection,
  activityRequiresCheckTypeSelection,
  validateDistinctCheckActivity,
} from "../downtimeHelpers";

export const isStudyActivity = (activityName) => {
  return activityName && activityName.toLowerCase().includes("study");
};

export const validateStudyActivities = (activities) => {
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    if (isStudyActivity(activity.activity) && !activity.selectedClass) {
      alert(`Activity ${i + 1}: Please select a class for the Study activity.`);
      return false;
    }
  }
  return true;
};

export const validateWandStatIncreaseActivities = (
  activities,
  selectedCharacter
) => {
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];

    if (activityRequiresWandSelection(activity.activity)) {
      const validation = validateWandStatIncreaseActivity(
        activity,
        selectedCharacter
      );
      if (!validation.valid) {
        alert(`Activity ${i + 1}: ${validation.message}`);
        return false;
      }
    }
  }
  return true;
};

export const validateDistinctCheckActivities = (
  activities,
  selectedCharacter
) => {
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];

    if (activityRequiresCheckTypeSelection(activity.activity)) {
      const validation = validateDistinctCheckActivity(
        activity,
        selectedCharacter
      );
      if (!validation.valid) {
        alert(`Activity ${i + 1}: ${validation.message}`);
        return false;
      }
    }
  }
  return true;
};

export const validateSpellActivities = (
  activities,
  rollAssignments,
  selectedSpells,
  spellAttempts,
  researchedSpells,
  failedAttempts
) => {
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    const activityKey = `activity${i + 1}`;
    const assignment = rollAssignments[activityKey];
    const spellSelections = selectedSpells[activityKey];

    if (activityRequiresSpellSelection(activity.activity)) {
      if (!spellSelections?.first && !spellSelections?.second) {
        alert(`Activity ${i + 1}: Please select at least one spell`);
        return false;
      }

      if (
        spellSelections.first &&
        (assignment.firstSpellDice === null ||
          assignment.firstSpellDice === undefined)
      ) {
        alert(`Activity ${i + 1}: Please assign a die to the first spell`);
        return false;
      }

      if (
        spellSelections.second &&
        (assignment.secondSpellDice === null ||
          assignment.secondSpellDice === undefined)
      ) {
        alert(`Activity ${i + 1}: Please assign a die to the second spell`);
        return false;
      }

      const isAttemptActivity = activity.activity
        ?.toLowerCase()
        .includes("attempt spells");
      const isResearchActivity = activity.activity
        ?.toLowerCase()
        .includes("research spells");

      if (isAttemptActivity || isResearchActivity) {
        const validateSpell = (spellName) => {
          if (!spellName) return true;

          const successfulAttempts = spellAttempts?.[spellName] || 0;
          if (successfulAttempts >= 2) {
            return false;
          }

          if (isAttemptActivity) {
            const hasBeenResearched = researchedSpells?.[spellName];
            if (!hasBeenResearched) {
              return false;
            }
          }

          const recentFailures = failedAttempts?.[spellName] || 0;
          if (recentFailures >= 3) {
            return false;
          }

          return true;
        };

        if (spellSelections.first && !validateSpell(spellSelections.first)) {
          const spellName = spellSelections.first;
          const successfulAttempts = spellAttempts?.[spellName] || 0;
          const hasBeenResearched = researchedSpells?.[spellName];
          const recentFailures = failedAttempts?.[spellName] || 0;

          if (successfulAttempts >= 2) {
            alert(
              `Activity ${
                i + 1
              }: ${spellName} has already been successfully attempted twice and cannot be attempted again.`
            );
            return false;
          }

          if (isAttemptActivity && !hasBeenResearched) {
            alert(
              `Activity ${
                i + 1
              }: ${spellName} must be researched before it can be attempted.`
            );
            return false;
          }

          if (recentFailures >= 3) {
            alert(
              `Activity ${
                i + 1
              }: ${spellName} has failed 3 times recently and cannot be attempted again this semester.`
            );
            return false;
          }
        }

        if (spellSelections.second && !validateSpell(spellSelections.second)) {
          const spellName = spellSelections.second;
          const successfulAttempts = spellAttempts?.[spellName] || 0;
          const hasBeenResearched = researchedSpells?.[spellName];
          const recentFailures = failedAttempts?.[spellName] || 0;

          if (successfulAttempts >= 2) {
            alert(
              `Activity ${
                i + 1
              }: ${spellName} has already been successfully attempted twice and cannot be attempted again.`
            );
            return false;
          }

          if (isAttemptActivity && !hasBeenResearched) {
            alert(
              `Activity ${
                i + 1
              }: ${spellName} must be researched before it can be attempted.`
            );
            return false;
          }

          if (recentFailures >= 3) {
            alert(
              `Activity ${
                i + 1
              }: ${spellName} has failed 3 times recently and cannot be attempted again this semester.`
            );
            return false;
          }
        }
      }
    }
  }
  return true;
};

export const validateAllActivities = (
  activities,
  selectedCharacter,
  rollAssignments,
  selectedSpells,
  spellAttempts,
  researchedSpells,
  failedAttempts
) => {
  if (!validateStudyActivities(activities)) {
    return false;
  }

  if (!validateWandStatIncreaseActivities(activities, selectedCharacter)) {
    return false;
  }

  if (!validateDistinctCheckActivities(activities, selectedCharacter)) {
    return false;
  }

  if (
    !validateSpellActivities(
      activities,
      rollAssignments,
      selectedSpells,
      spellAttempts,
      researchedSpells,
      failedAttempts
    )
  ) {
    return false;
  }

  return true;
};

export const validateSingleActivity = (activity, selectedCharacter) => {
  if (isStudyActivity(activity.activity) && !activity.selectedClass) {
    return {
      valid: false,
      message: "Please select a class for the Study activity.",
    };
  }

  if (activityRequiresWandSelection(activity.activity)) {
    const validation = validateWandStatIncreaseActivity(
      activity,
      selectedCharacter
    );
    if (!validation.valid) {
      return validation;
    }
  }

  if (activityRequiresCheckTypeSelection(activity.activity)) {
    const validation = validateDistinctCheckActivity(
      activity,
      selectedCharacter
    );
    if (!validation.valid) {
      return validation;
    }
  }

  return { valid: true };
};

export const isActivityComplete = (activity) => {
  if (!activity.activity) {
    return false;
  }

  if (activityRequiresCheckTypeSelection(activity.activity)) {
    return !!(
      activity.recipeName &&
      activity.selectedCheckType &&
      activity.selectedCheckSkill
    );
  }

  if (activityRequiresWandSelection(activity.activity)) {
    return !!activity.selectedWandModifier;
  }

  if (isStudyActivity(activity.activity)) {
    return !!activity.selectedClass;
  }

  return true;
};

export const getMissingFields = (activity) => {
  const missing = [];

  if (!activity.activity) {
    missing.push("Activity selection");
    return missing;
  }

  if (activityRequiresCheckTypeSelection(activity.activity)) {
    if (!activity.recipeName) missing.push("Recipe name");
    if (!activity.selectedCheckType) missing.push("Check type selection");
    if (!activity.selectedCheckSkill) missing.push("Skill selection");
    return missing;
  }

  if (activityRequiresWandSelection(activity.activity)) {
    if (!activity.selectedWandModifier) missing.push("Wand modifier selection");
    return missing;
  }

  if (isStudyActivity(activity.activity)) {
    if (!activity.selectedClass) missing.push("Class selection");
    return missing;
  }

  return missing;
};
