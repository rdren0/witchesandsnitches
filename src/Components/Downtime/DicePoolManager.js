import { useCallback, useMemo, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  activityRequiresDualChecks,
  getCustomDiceTypeForActivity,
  activityRequiresExtraDie,
} from "./downtimeHelpers";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { getDiscordWebhook } from "../../App/const";

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

  const getDualCheckActivitiesCount = () => {
    return formData.activities.filter((activity) =>
      activityRequiresDualChecks(activity.activity)
    ).length;
  };

  const getSpellActivitiesCount = () => {
    return formData.activities.filter((activity) =>
      activityRequiresExtraDie(activity.activity)
    ).length;
  };

  const getRequiredDiceCount = () => {
    const baseDice = 6;
    const dualCheckActivities = getDualCheckActivitiesCount();
    const spellActivities = getSpellActivitiesCount();

    return baseDice + dualCheckActivities + spellActivities;
  };

  const dualCheckActivities = useMemo(() => {
    return formData.activities.filter((activity) =>
      activityRequiresDualChecks(activity.activity)
    );
  }, [formData.activities]);

  const extraDiceCount = useMemo(() => {
    return Math.max(0, dicePool.length - 6);
  }, [dicePool.length]);

  const shouldDisableExtraDie = useMemo(() => {
    const totalRequired =
      getDualCheckActivitiesCount() + getSpellActivitiesCount();
    return extraDiceCount >= totalRequired;
  }, [extraDiceCount, getDualCheckActivitiesCount, getSpellActivitiesCount]);

  useEffect(() => {
    const requiredDiceCount = getRequiredDiceCount();
    const currentDiceCount = dicePool.length;

    if (currentDiceCount > 0 && currentDiceCount < requiredDiceCount) {
      const dicesToAdd = requiredDiceCount - currentDiceCount;
      const roller = new DiceRoller();
      const newDice = Array.from(
        { length: dicesToAdd },
        () => roller.roll("1d20").total
      );

      setDicePool((prev) => [...prev, ...newDice]);
    } else if (currentDiceCount > requiredDiceCount) {
      const currentDualCheckCount = getDualCheckActivitiesCount();
      const currentSpellActivities = getSpellActivitiesCount();
      const maxExtraDice = currentDualCheckCount + currentSpellActivities;
      const currentExtraDiceCount = Math.max(0, dicePool.length - 6);

      if (currentExtraDiceCount > maxExtraDice) {
        const excessDice = currentExtraDiceCount - maxExtraDice;
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
    }
  }, [
    formData.activities,
    dicePool.length,
    setDicePool,
    setExtraDiceAssignments,
  ]);

  const sendDiscordMessage = async (diceResults) => {
    if (!selectedCharacter?.gameSession) {
      console.log("No game session found for Discord message");
      return;
    }

    const discordWebhookUrl = getDiscordWebhook(selectedCharacter.gameSession);

    if (!discordWebhookUrl) {
      console.log("No Discord webhook configured for this game session");
      return;
    }

    try {
      const mainDice = diceResults.slice(0, 6);
      const sortedDice = [...mainDice].sort((a, b) => b - a);

      const embed = {
        title: `${selectedCharacter.name} - Downtime Dice Pool`,
        description: "🎲 **Dice rolled for downtime activities**",
        color: 0x3b82f6,
        fields: [
          {
            name: "Dice Pool Results",
            value: `[${sortedDice.join(", ")}]`,
            inline: false,
          },
        ],
        footer: {
          text: `Witches and Snitches - Downtime • Today at ${new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}`,
        },
      };

      await fetch(discordWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ embeds: [embed] }),
      });

      console.log("Discord message sent successfully");
    } catch (error) {
      console.error("Error sending Discord message:", error);
    }
  };

  const rollDice = useCallback(async () => {
    if (!canEdit()) return;

    const requiredDiceCount = getRequiredDiceCount();
    const roller = new DiceRoller();
    const newPool = Array.from(
      { length: requiredDiceCount },
      () => roller.roll("1d20").total
    );

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

    await sendDiscordMessage(newPool);
  }, [
    canEdit,
    getRequiredDiceCount,
    setDicePool,
    setExtraDiceAssignments,
    setRollAssignments,
    selectedCharacter,
  ]);

  const assignDice = useCallback(
    (activityIndex, diceIndex, isSecondDie = false) => {
      if (!canEdit()) return;

      const assignmentKey = `activity${activityIndex + 1}`;

      setRollAssignments((prev) => ({
        ...prev,
        [assignmentKey]: {
          ...prev[assignmentKey],
          [isSecondDie ? "secondDiceIndex" : "diceIndex"]: diceIndex,
        },
      }));
    },
    [canEdit, setRollAssignments]
  );

  const unassignDice = useCallback(
    (assignmentKey, isSecondDie = false) => {
      if (!canEdit()) return;

      setRollAssignments((prev) => ({
        ...prev,
        [assignmentKey]: {
          ...prev[assignmentKey],
          [isSecondDie ? "secondDiceIndex" : "diceIndex"]: null,
        },
      }));
    },
    [canEdit, setRollAssignments]
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

      return Object.values(extraDiceAssignments).includes(diceIndex);
    },
    [rollAssignments, extraDiceAssignments]
  );

  const getDiceUsage = useCallback(
    (diceIndex) => {
      for (const [key, assignment] of Object.entries(rollAssignments)) {
        if (assignment.diceIndex === diceIndex) {
          return { key, type: "primary" };
        }
        if (assignment.secondDiceIndex === diceIndex) {
          return { key, type: "secondary" };
        }
      }

      for (const [key, assignedIndex] of Object.entries(extraDiceAssignments)) {
        if (assignedIndex === diceIndex) {
          return { key, type: "extra" };
        }
      }

      return null;
    },
    [rollAssignments, extraDiceAssignments]
  );

  const addExtraDice = useCallback(() => {
    if (!canEdit() || shouldDisableExtraDie) return;

    const roller = new DiceRoller();
    const newDie = roller.roll("1d20").total;

    setDicePool((prev) => [...prev, newDie]);

    setRollAssignments((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key] = {
          ...updated[key],
          [updated[key].secondDiceIndex !== undefined &&
          updated[key].secondDiceIndex !== null
            ? "secondDiceIndex"
            : "diceIndex"]: null,
        };
      });
      return updated;
    });
  }, [canEdit, setDicePool, shouldDisableExtraDie, setRollAssignments]);

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

          setRollAssignments((prev) => ({
            ...prev,
            [activityKey]: {
              ...prev[activityKey],
              secondDiceIndex: null,
            },
          }));
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
      backgroundColor: theme.cardBackground,
      borderRadius: "12px",
      border: `1px solid ${theme.border}`,
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: theme.text,
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
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

  const requiredDiceCount = getRequiredDiceCount();
  const dualCheckCount = getDualCheckActivitiesCount();
  const spellActivityCount = getSpellActivitiesCount();

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
                const isSpellDie = isExtra && index >= 6 + dualCheckCount;

                return (
                  <div
                    key={index}
                    style={{
                      ...styles.dice,
                      ...(isAssigned
                        ? styles.diceAssigned
                        : styles.diceAvailable),
                    }}
                  >
                    {value}
                    {isExtra && (
                      <div style={{ fontSize: "0.7rem", fontWeight: "normal" }}>
                        {isSpellDie ? "Spell" : "Dual"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ fontSize: "0.9rem", color: theme.textSecondary }}>
              Required: {requiredDiceCount} dice (6 base + {dualCheckCount}{" "}
              dual-check + {spellActivityCount} spell)
            </div>
          </>
        ) : (
          <div style={{ color: theme.textSecondary, fontStyle: "italic" }}>
            No dice rolled yet. Click "Roll Dice Pool" to begin.
          </div>
        )}
      </div>
    ),
    functions: {
      rollDice,
      assignDice,
      unassignDice,
      isDiceAssigned,
      getDiceUsage,
      addExtraDice,
      assignRelationshipDice,
      handleCustomDiceRoll,
      getSortedDiceOptions,
      removeExtraDiceForActivity,
      addExtraDieForActivity: useCallback(
        (activityKey) => {
          if (!canEdit() || shouldDisableExtraDie) return;

          const roller = new DiceRoller();
          const newDie = roller.roll("1d20").total;
          const newDiceIndex = dicePool.length;

          setDicePool((prev) => [...prev, newDie]);
          setExtraDiceAssignments((prev) => ({
            ...prev,
            [activityKey]: newDiceIndex,
          }));

          setRollAssignments((prev) => ({
            ...prev,
            [activityKey]: {
              ...prev[activityKey],
              secondDiceIndex: newDiceIndex,
            },
          }));
        },
        [
          canEdit,
          shouldDisableExtraDie,
          dicePool.length,
          setDicePool,
          setExtraDiceAssignments,
          setRollAssignments,
        ]
      ),
    },
    data: {
      dualCheckActivities,
    },
  };
};

export default DicePoolManager;
