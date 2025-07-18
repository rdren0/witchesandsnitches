import React, { memo, useMemo, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAdmin } from "../../contexts/AdminContext";
import DiceSelection from "./DiceSelection";
import SkillSelector from "./SkillSelector";
import {
  activityRequiresDualChecks,
  activityRequiresCheckTypeSelection,
  getDistinctCheckActivityInfo,
  calculateDistinctCheckProgress,
  getAvailableCheckTypes,
  getSkillOptionsForCheck,
  calculateModifier,
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

    const isDistinctCheckActivity = useMemo(
      () => activityRequiresCheckTypeSelection(activity?.activity),
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
        distinctCheckContainer: {
          backgroundColor: theme.background,
          borderRadius: "8px",
          padding: "16px",
          marginTop: "16px",
          border: `1px solid ${theme.border}`,
        },
        progressContainer: {
          marginBottom: "16px",
        },
        progressHeader: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        },
        progressLabel: {
          fontSize: "14px",
          fontWeight: "600",
          color: theme.text,
        },
        progressText: {
          fontSize: "14px",
          color: theme.textSecondary,
        },
        completedChecks: {
          marginTop: "12px",
        },
        completedLabel: {
          fontSize: "12px",
          fontWeight: "600",
          color: theme.success || "#10b981",
          marginBottom: "4px",
        },
        completedCheck: {
          fontSize: "12px",
          color: theme.textSecondary,
          marginBottom: "2px",
          paddingLeft: "8px",
        },
        checkSelection: {
          display: "grid",
          gap: "12px",
        },
        checkDescription: {
          fontSize: "12px",
          color: theme.textSecondary,
          fontStyle: "italic",
          marginTop: "4px",
          padding: "8px",
          backgroundColor: `${theme.info || "#3b82f6"}10`,
          borderRadius: "4px",
        },
        completionMessage: {
          backgroundColor: `${theme.success || "#10b981"}15`,
          border: `1px solid ${theme.success || "#10b981"}30`,
          borderRadius: "8px",
          padding: "12px",
          fontSize: "14px",
          color: theme.text,
          textAlign: "center",
          fontWeight: "600",
        },
      }),
      [theme, canEdit]
    );

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

        updateRollAssignment(activityKey, skillField, value);
        updateRollAssignment(activityKey, wandField, "");
      },
      [activityKey, updateRollAssignment]
    );

    const handleSuccessClick = useCallback(
      (successIndex) => {
        if (adminMode) {
          updateActivitySuccess(index, successIndex);
        }
      },
      [adminMode, index, updateActivitySuccess]
    );

    const handleRecipeNameChange = useCallback(
      (e) => updateActivity(index, "recipeName", e.target.value),
      [index, updateActivity]
    );

    const handleCheckTypeChange = useCallback(
      (e) => {
        updateActivity(index, "selectedCheckType", e.target.value);
        updateActivity(index, "selectedCheckSkill", "");
      },
      [index, updateActivity]
    );

    const handleCheckSkillChange = useCallback(
      (e) => updateActivity(index, "selectedCheckSkill", e.target.value),
      [index, updateActivity]
    );

    const renderDistinctCheckInterface = () => {
      if (!isDistinctCheckActivity) return null;

      const info = getDistinctCheckActivityInfo(activity.activity);
      if (!info) return null;

      const progress = calculateDistinctCheckProgress(null, activity);
      const availableChecks = getAvailableCheckTypes(activity);
      const skillOptions = activity.selectedCheckType
        ? getSkillOptionsForCheck(activity, activity.selectedCheckType)
        : [];

      return (
        <div style={styles.distinctCheckContainer}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Recipe Name</label>
            <input
              type="text"
              value={activity.recipeName || ""}
              onChange={handleRecipeNameChange}
              placeholder="Enter the name of your new recipe..."
              style={styles.input}
              disabled={!canEdit()}
            />
          </div>

          <div style={styles.progressContainer}>
            <div style={styles.progressHeader}>
              <span style={styles.progressLabel}>Recipe Progress:</span>
              <span style={styles.progressText}>
                {progress?.progress || "0/3"}
              </span>
            </div>

            {progress?.completedChecks?.length > 0 && (
              <div style={styles.completedChecks}>
                <div style={styles.completedLabel}>✅ Completed Checks:</div>
                {progress.completedChecks.map((completed, idx) => (
                  <div key={idx} style={styles.completedCheck}>
                    <strong>{completed.checkName}</strong> using{" "}
                    {completed.skillUsed}
                    (Rolled {completed.rollResult} vs DC {completed.dc})
                  </div>
                ))}
              </div>
            )}
          </div>

          {!progress?.isComplete && (
            <div style={styles.checkSelection}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Select Check Type to Attempt:
                </label>
                <select
                  value={activity.selectedCheckType || ""}
                  onChange={handleCheckTypeChange}
                  style={styles.select}
                  disabled={!canEdit()}
                >
                  <option value="">Choose a check type...</option>
                  {availableChecks.map((check) => (
                    <option key={check.id} value={check.id}>
                      {check.name} (DC {check.dc})
                    </option>
                  ))}
                </select>
              </div>

              {activity.selectedCheckType && skillOptions.length > 0 && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Select Skill:</label>
                  {skillOptions.length === 1 ? (
                    <div
                      style={{
                        ...styles.input,
                        backgroundColor: theme.background,
                        color: theme.textSecondary,
                        fontStyle: "italic",
                      }}
                    >
                      {(() => {
                        const skill = skillOptions[0];
                        const modifier = calculateModifier(
                          skill,
                          selectedCharacter
                        );
                        const modStr =
                          modifier >= 0 ? `+${modifier}` : `${modifier}`;

                        if (skill === "spellcastingAbility") {
                          const spellAbility =
                            selectedCharacter?.spellcastingAbility ||
                            "Intelligence";
                          return `${spellAbility} (Spellcasting Ability) (${modStr})`;
                        } else if (skill === "muggleStudies") {
                          return `Muggle Studies (${modStr})`;
                        } else if (skill === "historyOfMagic") {
                          return `History of Magic (${modStr})`;
                        } else {
                          return `${
                            skill.charAt(0).toUpperCase() + skill.slice(1)
                          } (${modStr})`;
                        }
                      })()}{" "}
                      - Auto-selected
                    </div>
                  ) : (
                    <select
                      value={activity.selectedCheckSkill || ""}
                      onChange={handleCheckSkillChange}
                      style={styles.select}
                      disabled={!canEdit()}
                    >
                      <option value="">Choose a skill...</option>
                      {skillOptions.map((skill) => {
                        const modifier = calculateModifier(
                          skill,
                          selectedCharacter
                        );
                        const modStr =
                          modifier >= 0 ? `+${modifier}` : `${modifier}`;

                        let displayName;
                        if (skill === "muggleStudies") {
                          displayName = "Muggle Studies";
                        } else if (skill === "historyOfMagic") {
                          displayName = "History of Magic";
                        } else if (skill === "spellcastingAbility") {
                          const spellAbility =
                            selectedCharacter?.spellcastingAbility ||
                            "intelligence";
                          displayName = `${
                            spellAbility.charAt(0).toUpperCase() +
                            spellAbility.slice(1)
                          } (Spellcasting Ability)`;
                        } else {
                          displayName =
                            skill.charAt(0).toUpperCase() + skill.slice(1);
                        }

                        return (
                          <option key={skill} value={skill}>
                            {displayName} ({modStr})
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
              )}

              {activity.selectedCheckType && (
                <div style={styles.checkDescription}>
                  {
                    info.config.requiredChecks.find(
                      (c) => c.id === activity.selectedCheckType
                    )?.description
                  }
                </div>
              )}
            </div>
          )}

          {progress?.isComplete && (
            <div style={styles.completionMessage}>
              🎉 Recipe "{activity.recipeName}" has been successfully created!
              All required checks have been completed.
            </div>
          )}
        </div>
      );
    };

    if (!activity) {
      return null;
    }

    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <h4 style={styles.title}>Activity {index + 1}</h4>
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Activity:</label>
              <select
                value={activity.activity || ""}
                onChange={handleActivityChange}
                style={styles.select}
                disabled={!canEdit()}
              >
                <option value="">Select Activity</option>
                {availableActivities.map((activityOption, optionIndex) => (
                  <option key={optionIndex} value={activityOption}>
                    {activityOption
                      ? activityOption.split(" - ")[0]
                      : "Select Activity"}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Activity Notes:</label>
              <textarea
                value={activity.notes || ""}
                onChange={handleActivityNotesChange}
                placeholder="Optional notes about this activity..."
                style={styles.textarea}
                disabled={!canEdit()}
                rows={2}
              />
            </div>
          </div>

          {renderDistinctCheckInterface()}

          {!isDistinctCheckActivity && (
            <div style={styles.rollSection}>
              <h5 style={{ ...styles.label, marginBottom: "12px" }}>
                Roll Assignment{isDualCheck ? " (First Roll)" : ""}
              </h5>

              <div style={styles.rollGrid}>
                <DiceSelection
                  assignment={activityKey}
                  label={isDualCheck ? "First Die" : "Die"}
                  isSecondDie={false}
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
            </div>
          )}

          {isDualCheck && !isDistinctCheckActivity && (
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

          {isDistinctCheckActivity &&
            activity.selectedCheckType &&
            activity.selectedCheckSkill && (
              <div style={styles.rollSection}>
                <h5 style={{ ...styles.label, marginBottom: "12px" }}>
                  Roll Assignment
                </h5>

                <div style={styles.rollGrid}>
                  <DiceSelection
                    assignment={activityKey}
                    label="Die"
                    isSecondDie={false}
                    rollAssignments={{ [activityKey]: assignment }}
                    canEdit={canEdit}
                    assignDice={assignDice}
                    getSortedDiceOptions={getSortedDiceOptions}
                    getDiceUsage={getDiceUsage}
                    unassignDice={unassignDice}
                    dicePool={dicePool}
                    selectedCharacter={selectedCharacter}
                  />

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Skill/Modifier:</label>
                    <div
                      style={{
                        ...styles.input,
                        backgroundColor: theme.background,
                        color: theme.textSecondary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        {activity.selectedCheckSkill === "spellcastingAbility"
                          ? `${
                              selectedCharacter?.spellcastingAbility ||
                              "Intelligence"
                            } (Spellcasting)`
                          : activity.selectedCheckSkill === "muggleStudies"
                          ? "Muggle Studies"
                          : activity.selectedCheckSkill === "historyOfMagic"
                          ? "History of Magic"
                          : activity.selectedCheckSkill}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: `${theme.primary}20`,
                          color: theme.primary,
                          fontWeight: "500",
                        }}
                      >
                        Selected
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          <div style={styles.rollSection}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Admin Notes:</label>
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
