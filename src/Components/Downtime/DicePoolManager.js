import { useState, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getDowntimeStyles } from "../../styles/masterStyles";

const DicePoolManager = ({
  dicePool,
  setDicePool,
  rollAssignments,
  setRollAssignments,
  canEdit,
  hasDualCheckActivity,
}) => {
  const { theme } = useTheme();
  const styles = getDowntimeStyles(theme);

  const [extraDiceAdded, setExtraDiceAdded] = useState(false);

  const rollDice = useCallback(() => {
    if (!canEdit()) return;

    const baseDiceCount = 6;
    const newPool = Array.from(
      { length: baseDiceCount },
      () => Math.floor(Math.random() * 20) + 1
    );
    setDicePool(newPool);
    setExtraDiceAdded(false);

    setRollAssignments((prev) => {
      const resetAssignments = {};
      Object.keys(prev).forEach((key) => {
        resetAssignments[key] = {
          ...prev[key],
          diceIndex: null,
          secondDiceIndex: null,
        };
      });
      return resetAssignments;
    });
  }, [canEdit, setDicePool, setRollAssignments]);

  const addExtraDie = useCallback(() => {
    if (!canEdit()) return;

    const extraDie = Math.floor(Math.random() * 20) + 1;
    setDicePool((prev) => [...prev, extraDie]);
    setExtraDiceAdded(true);
  }, [canEdit, extraDiceAdded, setDicePool]);

  const assignDice = (assignment, diceIndex, isSecondDie = false) => {
    if (!canEdit()) return;

    setRollAssignments((prev) => ({
      ...prev,
      [assignment]: {
        ...prev[assignment],
        [isSecondDie ? "secondDiceIndex" : "diceIndex"]: diceIndex,
      },
    }));
  };

  const unassignDice = (assignment, isSecondDie = false) => {
    if (!canEdit()) return;

    setRollAssignments((prev) => ({
      ...prev,
      [assignment]: {
        ...prev[assignment],
        [isSecondDie ? "secondDiceIndex" : "diceIndex"]: null,
      },
    }));
  };

  const getDiceUsage = (diceIndex) => {
    for (const [assignmentKey, assignment] of Object.entries(rollAssignments)) {
      if (assignment.diceIndex === diceIndex) {
        return { assignment: assignmentKey, isSecond: false };
      }
      if (assignment.secondDiceIndex === diceIndex) {
        return { assignment: assignmentKey, isSecond: true };
      }
    }
    return null;
  };

  const getSortedDiceOptions = () => {
    return dicePool
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value);
  };

  const getAvailableDice = () => {
    return dicePool.filter((_, index) => !getDiceUsage(index));
  };

  return (
    <div style={styles.diceSection}>
      <div style={styles.diceHeader}>
        <h3>Dice Pool</h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={rollDice}
            disabled={!canEdit()}
            style={{
              ...styles.button,
              backgroundColor: canEdit() ? "#10b981" : "#9ca3af",
              cursor: canEdit() ? "pointer" : "not-allowed",
            }}
          >
            {dicePool.length === 0 ? "Roll Dice" : "Reroll Dice"}
          </button>

          {dicePool.length > 0 && hasDualCheckActivity() && (
            <button
              onClick={addExtraDie}
              disabled={!canEdit()}
              style={{
                ...styles.button,
                backgroundColor: canEdit() ? "#f59e0b" : "#9ca3af",
                cursor: canEdit() ? "pointer" : "not-allowed",
                fontSize: "14px",
              }}
            >
              Add Extra Die
            </button>
          )}
        </div>
      </div>

      {dicePool.length > 0 && (
        <div style={styles.dicePool}>
          <div style={styles.diceGrid}>
            {getSortedDiceOptions().map(({ value, index }) => {
              const usage = getDiceUsage(index);
              const isUsed = !!usage;
              const isExtraDie = index >= 6;

              return (
                <div
                  key={index}
                  style={{
                    ...styles.diceItem,
                    backgroundColor: isUsed
                      ? `${theme.danger || "#ef4444"}20`
                      : isExtraDie
                      ? `${theme.warning || "#f59e0b"}20`
                      : `${theme.success || "#10b981"}20`,
                    border: isUsed
                      ? `2px solid ${theme.danger || "#ef4444"}`
                      : isExtraDie
                      ? `2px solid ${theme.warning || "#f59e0b"}`
                      : `2px solid ${theme.success || "#10b981"}`,
                    opacity: isUsed ? 0.7 : 1,
                    color: theme.text,
                  }}
                >
                  <div style={{ ...styles.diceValue, color: theme.text }}>
                    {value}
                    {isExtraDie && (
                      <span
                        style={{
                          fontSize: "10px",
                          color: theme.warning || "#f59e0b",
                        }}
                      >
                        {" "}
                        ★
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.diceStats}>
            <div>Total Dice: {dicePool.length}</div>
            <div>Available: {getAvailableDice().length}</div>
            <div>Assigned: {dicePool.length - getAvailableDice().length}</div>
            {extraDiceAdded && (
              <div
                style={{
                  color: theme.warning || "#f59e0b",
                  fontWeight: "bold",
                }}
              >
                Extra Die Added ★
              </div>
            )}
          </div>
        </div>
      )}

      {dicePool.length === 0 && (
        <div style={styles.emptyDice}>
          <p>
            Click "Roll Dice" to generate your dice pool for this downtime
            session. You'll start with 6 dice.
          </p>
          {hasDualCheckActivity() && (
            <p
              style={{ color: theme.warning || "#f59e0b", fontWeight: "bold" }}
            >
              ⚠️ You have activities requiring dual checks - you'll be able to
              add an extra die after rolling.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DicePoolManager;
