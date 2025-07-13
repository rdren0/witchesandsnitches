import React, { memo, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import ActivityItem from "./ActivityItem";
import NPCEncounterItem from "./NPCEncounterItem";
import { getDowntimeStyles } from "../../styles/masterStyles";
import {
  activityRequiresCheckTypeSelection,
  getSkillOptionsForCheck,
  calculateModifier,
} from "./downtimeHelpers";

const ActivityManager = ({
  formData,
  setFormData,
  availableActivities,
  rollAssignments,
  setRollAssignments,
  dicePool,
  setDicePool,
  selectedCharacter,
  canEdit,
  assignDice,
  unassignDice,
  getDiceUsage,
  getSortedDiceOptions,
}) => {
  const { theme } = useTheme();
  const styles = getDowntimeStyles(theme);

  const updateActivity = useCallback(
    (index, field, value) => {
      setFormData((prev) => {
        const newActivities = prev.activities.map((activity, i) => {
          if (i === index) {
            const updatedActivity = { ...activity, [field]: value };

            if (
              field === "selectedCheckType" &&
              activityRequiresCheckTypeSelection(activity.activity)
            ) {
              const skillOptions = getSkillOptionsForCheck(
                updatedActivity,
                value
              );
              if (skillOptions.length === 1) {
                let autoSkill = skillOptions[0];
                if (autoSkill === "spellcastingAbility") {
                  autoSkill =
                    selectedCharacter?.spellcastingAbility || "intelligence";
                }
                updatedActivity.selectedCheckSkill = autoSkill;
              }
            }

            return updatedActivity;
          }
          return activity;
        });

        return {
          ...prev,
          activities: newActivities,
        };
      });
    },
    [setFormData, selectedCharacter]
  );

  const updateActivitySuccess = useCallback(
    (index, successIndex) => {
      setFormData((prev) => ({
        ...prev,
        activities: prev.activities.map((activity, i) =>
          i === index
            ? {
                ...activity,
                successes: activity.successes.map((s, si) =>
                  si === successIndex ? !s : s
                ),
              }
            : activity
        ),
      }));
    },
    [setFormData]
  );

  const updateRollAssignment = useCallback(
    (assignmentKey, field, value) => {
      setRollAssignments((prev) => {
        if (prev[assignmentKey]?.[field] === value) return prev;
        return {
          ...prev,
          [assignmentKey]: {
            ...prev[assignmentKey],
            [field]: value,
          },
        };
      });
    },
    [setRollAssignments]
  );

  const updateNPCEncounter = useCallback(
    (index, field, value) => {
      setFormData((prev) => {
        const currentNpcEncounters = prev.npcEncounters || [
          { name: "", successes: [false, false, false, false, false] },
          { name: "", successes: [false, false, false, false, false] },
          { name: "", successes: [false, false, false, false, false] },
        ];

        return {
          ...prev,
          npcEncounters: currentNpcEncounters.map((npc, i) =>
            i === index ? { ...npc, [field]: value } : npc
          ),
        };
      });
    },
    [setFormData]
  );

  const updateNPCSuccess = useCallback(
    (index, successIndex) => {
      setFormData((prev) => {
        const currentNpcEncounters = prev.npcEncounters || [
          { name: "", successes: [false, false, false, false, false] },
          { name: "", successes: [false, false, false, false, false] },
          { name: "", successes: [false, false, false, false, false] },
        ];

        return {
          ...prev,
          npcEncounters: currentNpcEncounters.map((npc, i) =>
            i === index
              ? {
                  ...npc,
                  successes: npc.successes.map((s, si) =>
                    si === successIndex ? !s : s
                  ),
                }
              : npc
          ),
        };
      });
    },
    [setFormData]
  );

  const enhancedAssignDice = useCallback(
    (activityKey, diceIndex, isSecondDie = false) => {
      const activityIndex = parseInt(activityKey.replace("activity", "")) - 1;
      const activity = formData.activities[activityIndex];

      if (activityRequiresCheckTypeSelection(activity?.activity)) {
        if (!activity.selectedCheckType || !activity.selectedCheckSkill) {
          alert("Please select a check type and skill before assigning a die.");
          return;
        }

        const completedChecks = activity.completedChecks || [];
        const alreadyCompleted = completedChecks.some(
          (completed) => completed.checkId === activity.selectedCheckType
        );

        if (alreadyCompleted) {
          alert(
            "You have already completed this type of check for this recipe!"
          );
          return;
        }

        let requiredSkill = activity.selectedCheckSkill;
        if (requiredSkill === "spellcastingAbility") {
          requiredSkill =
            selectedCharacter?.spellcastingAbility || "intelligence";
        }

        const modifier = calculateModifier(requiredSkill, selectedCharacter);
        const diceValue = dicePool[diceIndex]?.value || 0;
        const totalRoll = diceValue + modifier;

        updateRollAssignment(activityKey, "diceIndex", diceIndex);
        updateRollAssignment(activityKey, "skill", requiredSkill);
        updateRollAssignment(activityKey, "modifier", modifier);
        updateRollAssignment(activityKey, "total", totalRoll);
        updateRollAssignment(
          activityKey,
          "checkType",
          activity.selectedCheckType
        );

        setDicePool((prev) =>
          prev.map((die, idx) =>
            idx === diceIndex ? { ...die, used: true } : die
          )
        );

        return;
      }

      assignDice(activityKey, diceIndex, isSecondDie);
    },
    [
      formData,
      selectedCharacter,
      updateRollAssignment,
      setDicePool,
      assignDice,
      dicePool,
    ]
  );

  const enhancedUnassignDice = useCallback(
    (activityKey, isSecondDie = false) => {
      const activityIndex = parseInt(activityKey.replace("activity", "")) - 1;
      const activity = formData.activities[activityIndex];

      if (activityRequiresCheckTypeSelection(activity?.activity)) {
        const assignment = rollAssignments[activityKey];
        if (
          assignment?.diceIndex !== null &&
          assignment?.diceIndex !== undefined
        ) {
          setDicePool((prev) =>
            prev.map((die, idx) =>
              idx === assignment.diceIndex ? { ...die, used: false } : die
            )
          );

          updateRollAssignment(activityKey, "diceIndex", null);
          updateRollAssignment(activityKey, "skill", "");
          updateRollAssignment(activityKey, "modifier", 0);
          updateRollAssignment(activityKey, "total", 0);
          updateRollAssignment(activityKey, "checkType", "");
        }
        return;
      }

      unassignDice(activityKey, isSecondDie);
    },
    [formData, rollAssignments, setDicePool, updateRollAssignment, unassignDice]
  );

  return (
    <div style={styles.container}>
      <div style={styles.activitiesSection}>
        <h3 style={styles.sectionTitle}>Activities</h3>
        <div style={styles.activitiesList}>
          {formData.activities.map((activity, index) => (
            <ActivityItem
              key={index}
              index={index}
              availableActivities={availableActivities}
              activity={activity}
              assignment={rollAssignments[`activity${index + 1}`] || {}}
              updateActivity={updateActivity}
              updateActivitySuccess={updateActivitySuccess}
              updateRollAssignment={updateRollAssignment}
              canEdit={canEdit}
              selectedCharacter={selectedCharacter}
              dicePool={dicePool}
              assignDice={enhancedAssignDice}
              unassignDice={enhancedUnassignDice}
              getDiceUsage={getDiceUsage}
              getSortedDiceOptions={getSortedDiceOptions}
            />
          ))}
        </div>
      </div>

      <div style={styles.npcSection}>
        <h3 style={styles.sectionTitle}>NPC Encounters</h3>
        <div style={styles.npcList}>
          {(
            formData.npcEncounters || [
              { name: "", successes: [false, false, false, false, false] },
              { name: "", successes: [false, false, false, false, false] },
              { name: "", successes: [false, false, false, false, false] },
            ]
          ).map((npc, index) => (
            <NPCEncounterItem
              key={index}
              index={index}
              npc={npc}
              updateNPCEncounter={updateNPCEncounter}
              updateNPCSuccess={updateNPCSuccess}
              canEdit={canEdit}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

ActivityManager.displayName = "ActivityManager";

export default memo(ActivityManager);
