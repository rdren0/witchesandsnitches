import React, { memo, useMemo, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAdmin } from "../../contexts/AdminContext";
import DiceSelection from "./DiceSelection";
import SkillSelector from "./SkillSelector";

const NPCEncounterItem = memo(
  ({
    index,
    npc,
    assignment,
    updateNPCEncounter,
    updateNPCSuccess,
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

    // Use the passed npc prop with fallback
    const npcData = npc || {
      name: "",
      successes: [false, false, false, false, false],
    };

    const assignmentKey = `npc${index + 1}`;

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
        rollGrid: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginBottom: "12px",
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
      }),
      [theme]
    );

    const handleNameChange = useCallback(
      (e) => updateNPCEncounter("name", e.target.value),
      [updateNPCEncounter]
    );

    const handleNotesChange = useCallback(
      (e) => updateRollAssignment(assignmentKey, "notes", e.target.value),
      [assignmentKey, updateRollAssignment]
    );

    const handleSkillChange = useCallback(
      (value) => {
        const isWand = [
          "divinations",
          "transfiguration",
          "charms",
          "healing",
          "jinxesHexesCurses",
        ].includes(value);

        if (isWand) {
          updateRollAssignment(assignmentKey, "wandModifier", value);
          updateRollAssignment(assignmentKey, "skill", "");
        } else {
          updateRollAssignment(assignmentKey, "skill", value);
          updateRollAssignment(assignmentKey, "wandModifier", "");
        }
      },
      [assignmentKey, updateRollAssignment]
    );

    const handleSuccessClick = useCallback(
      (successIndex) => {
        if (adminMode) updateNPCSuccess(successIndex);
      },
      [adminMode, updateNPCSuccess]
    );

    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <h4 style={styles.title}>NPC Encounter {index + 1}</h4>
        </div>

        <div style={styles.content}>
          <div style={styles.rollGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>NPC Name:</label>
              <input
                type="text"
                value={npcData.name}
                onChange={handleNameChange}
                placeholder="Enter NPC name"
                style={styles.input}
                disabled={!canEdit()}
              />
            </div>

            <DiceSelection
              assignment={assignmentKey}
              label="Die"
              isSecondDie={false}
              rollAssignments={{ [assignmentKey]: assignment }}
              canEdit={canEdit}
              assignDice={assignDice}
              getSortedDiceOptions={getSortedDiceOptions}
              getDiceUsage={getDiceUsage}
              unassignDice={unassignDice}
              dicePool={dicePool}
            />

            <SkillSelector
              activityText=""
              assignment={assignment}
              isSecondSkill={false}
              onChange={handleSkillChange}
              canEdit={canEdit}
              selectedCharacter={selectedCharacter}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Notes:</label>
            <textarea
              value={assignment?.notes || ""}
              onChange={handleNotesChange}
              placeholder="Optional notes for this NPC encounter"
              style={styles.textarea}
              disabled={!canEdit()}
              rows={2}
            />
          </div>

          <div style={styles.successSection}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={styles.label}>Relationship Progress</h5>
              {!adminMode && (
                <span style={{ fontSize: "12px", color: theme.textSecondary }}>
                  Admin Only
                </span>
              )}
            </div>

            <div style={styles.successGrid}>
              {npcData.successes.map((success, successIndex) => (
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
              ))}
            </div>
            <p
              style={{
                marginTop: "8px",
                fontSize: "14px",
                color: theme.textSecondary,
              }}
            >
              Successes: {npcData.successes.filter((s) => s).length}/5
            </p>
          </div>
        </div>
      </div>
    );
  }
);

NPCEncounterItem.displayName = "NPCEncounterItem";

export default NPCEncounterItem;
