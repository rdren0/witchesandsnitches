import { useCallback, useMemo, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  activityRequiresDualChecks,
  getCustomDiceTypeForActivity,
} from "./downtimeHelpers";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const DicePoolManager = ({
  dicePool,
  setDicePool,
  rollAssignments,
  setRollAssignments,
  extraDiceAssignments,
  setExtraDiceAssignments,
  formData,
  canEdit,
  selectedCharacter,
}) => {
  const { theme } = useTheme();

  const dualCheckActivities = useMemo(() => {
    return formData.activities.filter((activity) =>
      activityRequiresDualChecks(activity.activity)
    );
  }, [formData.activities]);

  const extraDiceCount = useMemo(() => {
    return Math.max(0, dicePool.length - 6);
  }, [dicePool.length]);

  const shouldDisableExtraDie = useMemo(() => {
    return extraDiceCount >= dualCheckActivities.length;
  }, [extraDiceCount, dualCheckActivities.length]);

  useEffect(() => {
    const currentDualCheckCount = dualCheckActivities.length;
    const currentExtraDiceCount = Math.max(0, dicePool.length - 6);

    if (currentExtraDiceCount > currentDualCheckCount) {
      const excessDice = currentExtraDiceCount - currentDualCheckCount;

      setDicePool((prev) => prev.slice(0, prev.length - excessDice));

      setExtraDiceAssignments((prev) => {
        const updated = { ...prev };
        const removedStartIndex = dicePool.length - excessDice;

        Object.keys(updated).forEach((key) => {
          if (updated[key] >= removedStartIndex) {
            delete updated[key];
          }
        });

        return updated;
      });
    }
  }, [
    dualCheckActivities.length,
    dicePool.length,
    setDicePool,
    setExtraDiceAssignments,
  ]);

  const rollDice = useCallback(() => {
    if (!canEdit()) return;

    const roller = new DiceRoller();
    const newPool = Array.from({ length: 6 }, () => roller.roll("1d20").total);

    setDicePool(newPool);

    setExtraDiceAssignments({});

    setRollAssignments((prev) => {
      const resetAssignments = {};
      Object.keys(prev).forEach((key) => {
        resetAssignments[key] = {
          ...prev[key],
          diceIndex: null,
          secondDiceIndex: null,
          customDice: null,
          jobType: null,
        };
      });
      return resetAssignments;
    });
  }, [canEdit, setDicePool, setExtraDiceAssignments, setRollAssignments]);

  const addExtraDieForActivity = useCallback(
    (activityKey) => {
      if (!canEdit()) return;

      const extraDie = Math.floor(Math.random() * 20) + 1;
      const newExtraDiceIndex = dicePool.length;

      setDicePool((prev) => [...prev, extraDie]);
      setExtraDiceAssignments((prev) => ({
        ...prev,
        [activityKey]: newExtraDiceIndex,
      }));
    },
    [canEdit, dicePool.length, setDicePool, setExtraDiceAssignments]
  );

  const isDiceAssigned = useCallback(
    (diceIndex) => {
      for (const assignment of Object.values(rollAssignments)) {
        if (
          assignment.diceIndex === diceIndex ||
          assignment.secondDiceIndex === diceIndex
        ) {
          return true;
        }
      }
      return false;
    },
    [rollAssignments]
  );

  const assignDice = useCallback(
    (activityIndex, diceIndex, isSecondDie = false) => {
      if (!canEdit()) return;

      const assignmentKey = `activity${activityIndex + 1}`;

      if (isSecondDie && diceIndex >= 6) {
        setExtraDiceAssignments((prev) => ({
          ...prev,
          [assignmentKey]: diceIndex,
        }));
      }

      setRollAssignments((prev) => ({
        ...prev,
        [assignmentKey]: {
          ...prev[assignmentKey],
          [isSecondDie ? "secondDiceIndex" : "diceIndex"]: diceIndex,
        },
      }));
    },
    [canEdit, setExtraDiceAssignments, setRollAssignments]
  );

  const unassignDice = useCallback(
    (activityIndex, isSecondDie = false) => {
      if (!canEdit()) return;

      const assignmentKey = `activity${activityIndex + 1}`;

      if (isSecondDie) {
        setExtraDiceAssignments((prev) => {
          const updated = { ...prev };
          delete updated[assignmentKey];
          return updated;
        });
      }

      setRollAssignments((prev) => ({
        ...prev,
        [assignmentKey]: {
          ...prev[assignmentKey],
          [isSecondDie ? "secondDiceIndex" : "diceIndex"]: null,
        },
      }));
    },
    [canEdit, setExtraDiceAssignments, setRollAssignments]
  );

  const assignRelationshipDice = useCallback(
    (relationshipIndex, diceIndex) => {
      if (!canEdit()) return;

      const assignmentKey = `relationship${relationshipIndex + 1}`;

      setRollAssignments((prev) => ({
        ...prev,
        [assignmentKey]: {
          ...prev[assignmentKey],
          diceIndex: diceIndex,
        },
      }));
    },
    [canEdit, setRollAssignments]
  );

  const rollCustomDice = useCallback((activityText, jobType = "medium") => {
    const customDiceInfo = getCustomDiceTypeForActivity(activityText);
    if (customDiceInfo && customDiceInfo.rollFunction) {
      return customDiceInfo.rollFunction(jobType);
    }
    return null;
  }, []);

  const handleCustomDiceRoll = useCallback(
    (activityText, jobType, activityIndex) => {
      if (!canEdit()) {
        return;
      }

      try {
        const customDice = rollCustomDice(activityText, jobType);

        if (customDice) {
          const assignmentKey = `activity${activityIndex + 1}`;

          setRollAssignments((prev) => {
            const updated = {
              ...prev,
              [assignmentKey]: {
                ...prev[assignmentKey],
                customDice: customDice,
                jobType: jobType,
                diceIndex: null,
                secondDiceIndex: null,
              },
            };
            return updated;
          });
        } else {
          console.error("No custom dice returned from roll function");
        }
      } catch (error) {
        console.error("Error in handleCustomDiceRoll:", error);
      }
    },
    [canEdit, rollCustomDice, setRollAssignments]
  );

  const getSortedDiceOptions = useMemo(() => {
    const baseDice = dicePool
      .slice(0, 6)
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value);

    const extraDice = dicePool
      .slice(6)
      .map((value, index) => ({ value, index: index + 6 }));

    return [...baseDice, ...extraDice];
  }, [dicePool]);

  const removeExtraDiceForActivity = useCallback(
    (activityKey, assignment) => {
      if (
        assignment?.secondDiceIndex !== null &&
        assignment?.secondDiceIndex !== undefined
      ) {
        const extraDiceIndex = extraDiceAssignments[activityKey];
        if (extraDiceIndex !== undefined && extraDiceIndex >= 6) {
          setDicePool((prev) => {
            const newPool = [...prev];
            newPool.splice(extraDiceIndex, 1);
            return newPool;
          });

          setExtraDiceAssignments((prev) => {
            const updated = { ...prev };
            delete updated[activityKey];

            Object.keys(updated).forEach((key) => {
              if (updated[key] > extraDiceIndex) {
                updated[key] = updated[key] - 1;
              }
            });

            return updated;
          });

          setRollAssignments((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((key) => {
              const assignment = updated[key];
              if (assignment.diceIndex > extraDiceIndex) {
                updated[key] = {
                  ...assignment,
                  diceIndex: assignment.diceIndex - 1,
                };
              }
              if (assignment.secondDiceIndex > extraDiceIndex) {
                updated[key] = {
                  ...assignment,
                  secondDiceIndex: assignment.secondDiceIndex - 1,
                };
              }
            });
            return updated;
          });
        } else {
          setDicePool((prev) => {
            if (prev.length > 6) {
              return prev.slice(0, -1);
            }
            return prev;
          });
        }
      }
    },
    [
      extraDiceAssignments,
      setDicePool,
      setExtraDiceAssignments,
      setRollAssignments,
    ]
  );

  const styles = {
    section: {
      marginBottom: "2rem",
      padding: "1.5rem",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `1px solid ${theme.border}`,
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "1rem",
      borderBottom: `2px solid ${theme.primary}`,
      paddingBottom: "0.5rem",
    },
    diceGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
      gap: "0.75rem",
      marginBottom: "1rem",
    },
    dice: {
      padding: "1rem",
      textAlign: "center",
      borderRadius: "8px",
      fontSize: "1.25rem",
      fontWeight: "bold",
      border: "2px solid",
      transition: "all 0.2s ease",
    },
    diceAvailable: {
      backgroundColor: theme.success + "20",
      borderColor: theme.success,
      color: theme.success,
    },
    diceAssigned: {
      backgroundColor: theme.error + "20",
      borderColor: theme.error,
      color: theme.error,
      opacity: 0.7,
    },

    buttonGroup: {
      display: "flex",
      gap: "1rem",
      marginBottom: "1rem",
    },
    button: {
      padding: "0.75rem 1.5rem",
      borderRadius: "8px",
      border: "none",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    primaryButton: {
      backgroundColor: theme.primary,
      color: "white",
    },
  };

  return {
    component: (
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎲 Dice Pool</h2>

        <div style={styles.buttonGroup}>
          <button
            onClick={rollDice}
            disabled={!canEdit()}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              ...(!canEdit() ? { opacity: 0.6, cursor: "not-allowed" } : {}),
            }}
          >
            {dicePool.length === 0 ? "Roll Dice Pool" : "Reroll Dice"}
          </button>
        </div>

        {dicePool.length > 0 ? (
          <>
            <div style={styles.diceGrid}>
              {getSortedDiceOptions.map(({ value, index }) => {
                const isAssigned = isDiceAssigned(index);
                const isExtra = index >= 6;

                return (
                  <div
                    key={index}
                    style={{
                      ...styles.dice,
                      ...(isAssigned
                        ? styles.diceAssigned
                        : styles.diceAvailable),
                      ...(isExtra && {
                        color: theme.warning,
                      }),
                    }}
                  >
                    {value}
                    {isExtra && <span style={{ fontSize: "0.75rem" }}>★</span>}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: theme.textSecondary,
                fontSize: "0.875rem",
                marginTop: "1rem",
              }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <span>Total: {dicePool.length} dice</span>
                <span>
                  Available:{" "}
                  {dicePool.filter((_, index) => !isDiceAssigned(index)).length}
                </span>
                <span>
                  Assigned:{" "}
                  {dicePool.filter((_, index) => isDiceAssigned(index)).length}
                </span>
              </div>

              {dicePool.length > 6 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    padding: "0.25rem 0.5rem",
                    backgroundColor: theme.warning + "15",
                    borderRadius: "4px",
                    border: `1px solid ${theme.warning}30`,
                    fontSize: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: theme.warning || "#f59e0b",
                    }}
                  >
                    ★
                  </span>
                  <span style={{ color: theme.warning || "#f59e0b" }}>
                    Extra Dice From Activity
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: theme.textSecondary,
              backgroundColor: theme.background,
              borderRadius: "8px",
              border: `1px solid ${theme.border}`,
            }}
          >
            Click "Roll Dice Pool" to generate your 6 dice for this downtime
            session
          </div>
        )}
      </div>
    ),

    functions: {
      rollDice,
      addExtraDieForActivity,
      isDiceAssigned,
      assignDice,
      unassignDice,
      assignRelationshipDice,
      handleCustomDiceRoll,
      removeExtraDiceForActivity,
      getSortedDiceOptions,
      rollCustomDice,
    },

    data: {
      dualCheckActivities,
      extraDiceCount,
      shouldDisableExtraDie,
    },
  };
};

export default DicePoolManager;
