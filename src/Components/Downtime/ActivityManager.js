// Updated ActivityManager.js - Remove DowntimeProvider and create stable functions
import React, { memo, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import ActivityItem from "./ActivityItem";
import NPCEncounterItem from "./NPCEncounterItem";
import { getDowntimeStyles } from "../../styles/masterStyles";

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

  // Create stable update functions at this level
  const updateActivity = useCallback(
    (index, field, value) => {
      setFormData((prev) => ({
        ...prev,
        activities: prev.activities.map((activity, i) =>
          i === index ? { ...activity, [field]: value } : activity
        ),
      }));
    },
    [setFormData]
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

  return (
    <div
      style={
        styles.activitiesContainer || {
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }
      }
    >
      <div style={styles.sectionHeader || { marginBottom: "16px" }}>
        <h3
          style={
            styles.sectionTitle || {
              fontSize: "24px",
              fontWeight: "600",
              color: theme.text,
              marginBottom: "8px",
            }
          }
        >
          Activities
        </h3>
        <p
          style={
            styles.subtitle || { fontSize: "14px", color: theme.textSecondary }
          }
        >
          Choose your activities and assign dice rolls to each
        </p>
      </div>

      {[0, 1, 2].map((index) => (
        <ActivityItem
          key={index}
          index={index}
          availableActivities={availableActivities}
          activity={formData.activities[index]}
          assignment={rollAssignments[`activity${index + 1}`]}
          updateActivity={updateActivity}
          updateActivitySuccess={updateActivitySuccess}
          updateRollAssignment={updateRollAssignment}
          canEdit={canEdit}
          selectedCharacter={selectedCharacter}
          dicePool={dicePool}
          assignDice={assignDice}
          unassignDice={unassignDice}
          getDiceUsage={getDiceUsage}
          getSortedDiceOptions={getSortedDiceOptions}
        />
      ))}

      <div style={styles.sectionHeader || { marginBottom: "16px" }}>
        <h3
          style={
            styles.sectionTitle || {
              fontSize: "24px",
              fontWeight: "600",
              color: theme.text,
              marginBottom: "8px",
            }
          }
        >
          NPC Encounters
        </h3>
        <p
          style={
            styles.subtitle || { fontSize: "14px", color: theme.textSecondary }
          }
        >
          Social interactions and relationship building with NPCs
        </p>
      </div>

      {[0, 1, 2].map((index) => (
        <NPCEncounterItem
          key={index}
          index={index}
          npc={formData.npcEncounters?.[index]}
          assignment={rollAssignments[`npc${index + 1}`]}
          updateNPCEncounter={(field, value) =>
            updateNPCEncounter(index, field, value)
          }
          updateNPCSuccess={(successIndex) =>
            updateNPCSuccess(index, successIndex)
          }
          updateRollAssignment={updateRollAssignment}
          canEdit={canEdit}
          selectedCharacter={selectedCharacter}
          dicePool={dicePool}
          assignDice={assignDice}
          unassignDice={unassignDice}
          getDiceUsage={getDiceUsage}
          getSortedDiceOptions={getSortedDiceOptions}
        />
      ))}
    </div>
  );
};

export default memo(ActivityManager);
