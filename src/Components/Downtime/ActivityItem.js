// Updated ActivityItem.js - Receive props instead of using context
import React, { memo, useMemo, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAdmin } from "../../contexts/AdminContext";
import DiceSelection from "./DiceSelection";
import SkillSelector from "./SkillSelector";
import {
  getActivitySkillInfo,
  activityRequiresDualChecks,
} from "./downtimeHelpers";

const ActivityItem = memo(
  ({
    index,
    availableActivities,
    activity,
    assignment,
    updateActivity,
    updateActivitySuccess,
    updateRollAssignment,
    canEdit,
    selectedCharacter,
    dicePool,
    assignDice,
    unassignDice,
    getDiceUsage,
    getSortedDiceOptions,
  }) => {
    const { theme } = useTheme();
    const { adminMode } = useAdmin();

    const activityKey = useMemo(() => `activity${index + 1}`, [index]);

    const isDualCheck = useMemo(
      () => activityRequiresDualChecks(activity?.activity),
      [activity?.activity]
    );

    const styles = useMemo(
      () => ({
        card: {
          backgroundColor: theme.surface,
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "16px",
          border: `1px solid ${theme.border}`,
        },
        header: {
          borderBottom: `1px solid ${theme.border}`,
          paddingBottom: "12px",
          marginBottom: "16px",
        },
        title: {
          fontSize: "18px",
          fontWeight: "600",
          color: theme.text,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        },
        section: {
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        },
        inputGroup: {
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        },
        label: {
          fontSize: "14px",
          fontWeight: "600",
          color: theme.text,
        },
        select: {
          width: "100%",
          padding: "8px 12px",
          backgroundColor: theme.surface,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          borderRadius: "6px",
          fontSize: "14px",
          cursor: canEdit() ? "pointer" : "not-allowed",
        },
        input: {
          width: "100%",
          padding: "8px 12px",
          backgroundColor: theme.surface,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          borderRadius: "6px",
          fontSize: "14px",
        },
        textarea: {
          width: "100%",
          padding: "8px 12px",
          backgroundColor: theme.surface,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          borderRadius: "6px",
          fontSize: "14px",
          resize: "vertical",
          minHeight: "60px",
        },
        rollSection: {
          backgroundColor: theme.background,
          borderRadius: "8px",
          padding: "16px",
          marginTop: "8px",
        },
        rollGrid: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "12px",
        },
        successSection: {
          marginTop: "16px",
          padding: "16px",
          backgroundColor: theme.background,
          borderRadius: "8px",
        },
        successGrid: {
          display: "flex",
          gap: "8px",
          marginTop: "12px",
        },
        successButton: {
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s ease",
        },
        dualCheckNotice: {
          backgroundColor: `${theme.info || "#3b82f6"}15`,
          border: `1px solid ${theme.info || "#3b82f6"}30`,
          borderRadius: "8px",
          padding: "12px",
          marginBottom: "16px",
          fontSize: "14px",
          color: theme.text,
        },
      }),
      [theme, canEdit]
    );

    // Handlers using passed-in functions
    const handleActivityChange = useCallback(
      (e) => updateActivity(index, "activity", e.target.value),
      [index, updateActivity]
    );

    const handleActivityNotesChange = useCallback(
      (e) => updateActivity(index, "notes", e.target.value),
      [index, updateActivity]
    );

    const handleNotesChange = useCallback(
      (e) => updateRollAssignment(activityKey, "notes", e.target.value),
      [activityKey, updateRollAssignment]
    );

    const handleSkillChange = useCallback(
      (value, isSecondSkill = false) => {
        const skillField = isSecondSkill ? "secondSkill" : "skill";
        const wandField = isSecondSkill ? "secondWandModifier" : "wandModifier";

        const isWand = [
          "divinations",
          "transfiguration",
          "charms",
          "healing",
          "jinxesHexesCurses",
        ].includes(value);

        if (isWand) {
          updateRollAssignment(activityKey, wandField, value);
          updateRollAssignment(activityKey, skillField, "");
        } else {
          updateRollAssignment(activityKey, skillField, value);
          updateRollAssignment(activityKey, wandField, "");
        }
      },
      [activityKey, updateRollAssignment]
    );

    const handleSuccessClick = useCallback(
      (successIndex) => {
        if (adminMode) updateActivitySuccess(index, successIndex);
      },
      [adminMode, index, updateActivitySuccess]
    );

    // Handle missing activity data
    if (!activity) {
      return null;
    }

    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <h4 style={styles.title}>Activity {index + 1}</h4>
        </div>

        <div style={styles.content}>
          {isDualCheck && (
            <div style={styles.dualCheckNotice}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "4px",
                  color: theme.info || "#3b82f6",
                }}
              >
                📋 Dual Check Activity
              </div>
              <div>
                This activity requires <strong>two separate dice rolls</strong>.
                You'll need to assign dice and select skills for both rolls.
              </div>
            </div>
          )}

          <div style={styles.section}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Activity:</label>
              <select
                value={activity.activity || ""}
                onChange={handleActivityChange}
                style={styles.select}
                disabled={!canEdit()}
              >
                {availableActivities.map((act, i) => (
                  <option key={i} value={act}>
                    {act || "Select an activity..."}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Notes:</label>
              <input
                type="text"
                value={activity.notes || ""}
                onChange={handleActivityNotesChange}
                placeholder="Optional"
                style={styles.input}
                disabled={!canEdit()}
              />
            </div>
          </div>

          <div style={styles.rollSection}>
            <h5 style={{ ...styles.label, marginBottom: "12px" }}>
              Roll Assignment {isDualCheck ? "(First Roll)" : ""}
            </h5>

            <div style={styles.rollGrid}>
              <DiceSelection
                assignment={activityKey}
                label={isDualCheck ? "First Die" : "Die"}
                isSecondDie={false}
                // Pass dice-related props directly to DiceSelection
                rollAssignments={{ [activityKey]: assignment }}
                canEdit={canEdit}
                assignDice={assignDice}
                getSortedDiceOptions={getSortedDiceOptions}
                getDiceUsage={getDiceUsage}
                unassignDice={unassignDice}
                dicePool={dicePool}
                selectedCharacter={selectedCharacter}
              />

              <SkillSelector
                activityText={activity.activity}
                assignment={assignment}
                isSecondSkill={false}
                onChange={(value) => handleSkillChange(value, false)}
                canEdit={canEdit}
                selectedCharacter={selectedCharacter}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Result:</label>
              {adminMode ? (
                <textarea
                  value={assignment?.notes || ""}
                  onChange={handleNotesChange}
                  placeholder="Admin will fill out this section"
                  style={styles.textarea}
                  disabled={!adminMode}
                  rows={2}
                />
              ) : (
                assignment?.notes || "TBD - Has not been reviewed by Admin yet"
              )}
            </div>
          </div>

          {isDualCheck && (
            <div style={styles.rollSection}>
              <h5 style={{ ...styles.label, marginBottom: "12px" }}>
                Second Roll Assignment
              </h5>

              <div style={styles.rollGrid}>
                <DiceSelection
                  assignment={activityKey}
                  label="Second Die"
                  isSecondDie={true}
                  rollAssignments={{ [activityKey]: assignment }}
                  canEdit={canEdit}
                  assignDice={assignDice}
                  getSortedDiceOptions={getSortedDiceOptions}
                  getDiceUsage={getDiceUsage}
                  unassignDice={unassignDice}
                  dicePool={dicePool}
                />

                <SkillSelector
                  activityText={activity.activity}
                  assignment={assignment}
                  isSecondSkill={true}
                  onChange={(value) => handleSkillChange(value, true)}
                  canEdit={canEdit}
                  selectedCharacter={selectedCharacter}
                />
              </div>
            </div>
          )}

          <div style={styles.successSection}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={styles.label}>Success Tracking</h5>
              {!adminMode && (
                <span style={{ fontSize: "12px", color: theme.textSecondary }}>
                  Admin Only
                </span>
              )}
            </div>

            <div style={styles.successGrid}>
              {activity.successes?.map((success, successIndex) => (
                <button
                  key={successIndex}
                  onClick={() => handleSuccessClick(successIndex)}
                  style={{
                    ...styles.successButton,
                    backgroundColor: success ? "#10b981" : "transparent",
                    border: success ? "2px solid #10b981" : "2px solid #e5e7eb",
                    cursor: adminMode ? "pointer" : "not-allowed",
                    opacity: adminMode ? 1 : 0.6,
                  }}
                  disabled={!adminMode}
                  title={
                    adminMode
                      ? `Success ${successIndex + 1}`
                      : "Only available in admin mode"
                  }
                >
                  {successIndex + 1}
                </button>
              )) || []}
            </div>
            <p
              style={{
                marginTop: "8px",
                fontSize: "14px",
                color: theme.textSecondary,
              }}
            >
              Successes: {activity.successes?.filter((s) => s).length || 0}/5
            </p>
          </div>
        </div>
      </div>
    );
  }
);

ActivityItem.displayName = "ActivityItem";

export default ActivityItem;
