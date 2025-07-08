import React, { memo, useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { calculateModifier } from "./downtimeHelpers";
import { allSkills } from "../SharedData/data";
import { wandModifiers } from "../SharedData/downtime";

const DiceSelection = memo(
  ({
    assignment,
    label = "Die",
    isSecondDie = false,
    rollAssignments,
    canEdit,
    assignDice,
    getSortedDiceOptions,
    getDiceUsage,
    unassignDice,
    dicePool,
    selectedCharacter,
  }) => {
    const { theme } = useTheme();

    const assignmentData = rollAssignments[assignment];
    const diceIndex = isSecondDie
      ? assignmentData?.secondDiceIndex
      : assignmentData?.diceIndex;

    const skillOrWandName = isSecondDie
      ? assignmentData?.secondSkill || assignmentData?.secondWandModifier
      : assignmentData?.skill || assignmentData?.wandModifier;

    const skillModifier = calculateModifier(skillOrWandName, selectedCharacter);

    const getSkillDisplayName = () => {
      if (!skillOrWandName) return "";

      const skill = allSkills.find((s) => s.name === skillOrWandName);
      if (skill) return skill.displayName;

      const wand = wandModifiers.find((w) => w.name === skillOrWandName);
      if (wand) return wand.displayName;

      return skillOrWandName;
    };

    const formatModifier = (value) => {
      return value >= 0 ? `+${value}` : `${value}`;
    };

    const styles = useMemo(
      () => ({
        container: {
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
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
        assignedContainer: {
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        },
        assignedTile: {
          backgroundColor: theme.primary + "20",
          border: `2px solid ${theme.primary}`,
          borderRadius: "8px",
          padding: "12px",
          textAlign: "center",
        },
        diceValue: {
          fontSize: "24px",
          fontWeight: "bold",
          color: theme.primary,
        },
        removeButton: {
          padding: "6px 12px",
          backgroundColor: theme.error + "15",
          color: theme.error,
          border: `1px solid ${theme.error}`,
          borderRadius: "4px",
          fontSize: "12px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        },
        totalDisplay: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${theme.primary}10`,
          borderRadius: "8px",
          padding: "12px",
          marginTop: "8px",
        },
        totalLabel: {
          fontSize: "12px",
          color: theme.textSecondary,
        },
        totalValue: {
          fontSize: "24px",
          fontWeight: "bold",
          color: theme.primary,
        },
        skillName: {
          fontSize: "12px",
          color: theme.textSecondary,
          marginTop: "2px",
        },
      }),
      [theme, canEdit]
    );

    const handleChange = (e) => {
      const value = e.target.value;
      if (value !== "") {
        assignDice(assignment, parseInt(value), isSecondDie);
      }
    };

    const handleRemove = () => {
      unassignDice(assignment, isSecondDie);
    };

    if (diceIndex !== null && diceIndex !== undefined) {
      const diceValue = dicePool[diceIndex];
      const total = diceValue + skillModifier;
      const skillName = getSkillDisplayName();

      return (
        <div style={styles.assignedContainer}>
          <label style={styles.label}>{label}:</label>
          <div style={styles.assignedTile}>
            <div style={styles.diceValue}>{diceValue}</div>
          </div>

          {canEdit() && (
            <button onClick={handleRemove} style={styles.removeButton}>
              Remove
            </button>
          )}

          {skillName && (
            <div style={styles.totalDisplay}>
              <span style={styles.totalLabel}>Total:</span>
              <span style={styles.totalValue}>
                {diceValue} {formatModifier(skillModifier)} = {total}
              </span>
              <span style={styles.skillName}>({skillName})</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <label style={styles.label}>{label}:</label>
        <select
          value=""
          onChange={handleChange}
          style={styles.select}
          disabled={!canEdit()}
        >
          <option value="">Select die...</option>
          {getSortedDiceOptions().map(({ value, index: diceIdx }) => {
            const usage = getDiceUsage(diceIdx);
            const isAvailable = !usage;
            return (
              <option
                key={diceIdx}
                value={diceIdx}
                disabled={!isAvailable}
                style={{
                  color: isAvailable ? "inherit" : "#999",
                  backgroundColor: isAvailable ? "inherit" : "#f5f5f5",
                }}
              >
                d20: {value} {!isAvailable ? `(Used: ${usage.assignment})` : ""}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
);

DiceSelection.displayName = "DiceSelection";

export default DiceSelection;
