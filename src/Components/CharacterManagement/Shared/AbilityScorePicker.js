import { RefreshCw, Trash } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { createAbilityScorePickerStyles } from "../../../styles/masterStyles";

export const AbilityScorePicker = ({
  character,
  setRolledStats,
  setCharacter,
  setAvailableStats,
  rolledStats,
  setTempInputValues,
  allStatsAssigned,
  availableStats,
  tempInputValues,
  clearStat,
  assignStat,
  isManualMode,
  setIsManualMode,
  rollAllStats,
}) => {
  const { theme } = useTheme();
  const styles = createAbilityScorePickerStyles(theme);

  const toggleManualMode = () => {
    const newManualMode = !isManualMode;

    setIsManualMode(newManualMode);

    if (newManualMode) {
      setRolledStats([]);
      setAvailableStats([]);
      setCharacter((prev) => ({
        ...prev,
        abilityScores: {
          strength: null,
          dexterity: null,
          constitution: null,
          intelligence: null,
          wisdom: null,
          charisma: null,
        },
      }));
      setTempInputValues({});
    } else {
      rollAllStats();
    }
  };

  const handleManualScoreChange = (ability, value) => {
    setTempInputValues((prev) => ({
      ...prev,
      [ability]: value,
    }));

    if (value === "" || value === null || value === undefined) {
      setCharacter((prev) => ({
        ...prev,
        abilityScores: {
          ...prev.abilityScores,
          [ability]: null,
        },
      }));
    }
  };

  const getAbilityModifier = (score) => {
    if (score === null || score === undefined || isNaN(score)) return 0;
    return Math.floor((score - 10) / 2);
  };

  const handleManualScoreBlur = (ability) => {
    const tempValue = tempInputValues[ability];
    if (tempValue && tempValue !== "") {
      const numericValue = parseInt(tempValue, 10);
      if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 30) {
        setCharacter((prev) => ({
          ...prev,
          abilityScores: {
            ...prev.abilityScores,
            [ability]: numericValue,
          },
        }));
      } else {
        setCharacter((prev) => ({
          ...prev,
          abilityScores: {
            ...prev.abilityScores,
            [ability]: null,
          },
        }));
      }
    }

    setTimeout(() => {
      setTempInputValues((prev) => {
        const newTemp = { ...prev };
        delete newTemp[ability];
        return newTemp;
      });
    }, 0);
  };

  const handleManualScoreKeyDown = (e, ability) => {
    if (e.key === "Enter") {
      e.target.blur();
    } else if (e.key === "Escape") {
      setTempInputValues((prev) => {
        const newTemp = { ...prev };
        delete newTemp[ability];
        return newTemp;
      });
      e.target.blur();
    }
  };

  return (
    <div style={styles.fieldContainer}>
      <div style={styles.abilityScoresHeader}>
        <h3 style={styles.abilityScoresTitle}>Ability Scores</h3>

        <div style={styles.buttonGroup}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {!isManualMode && (
              <button
                onClick={rollAllStats}
                style={{
                  ...styles.button,
                  backgroundColor: "#EF4444",
                }}
              >
                <RefreshCw size={16} />
                Roll For Stats
              </button>
            )}
          </div>
          <div
            onClick={toggleManualMode}
            style={{
              position: "relative",
              marginTop: "4px",
              width: "44px",
              height: "24px",
              backgroundColor: isManualMode
                ? theme.success || "#10B981"
                : "#D1D5DB",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              border: "2px solid",
              borderColor: isManualMode
                ? theme.success || "#10B981"
                : "#9CA3AF",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "2px",
                left: isManualMode ? "22px" : "2px",
                width: "16px",
                height: "16px",
                backgroundColor: "white",
                borderRadius: "50%",
                transition: "left 0.2s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>
      </div>

      <div style={styles.helpText}>
        {isManualMode
          ? "Manual input mode - enter ability scores directly (1-30)"
          : "Roll mode - assign generated stats to abilities"}
        <span
          style={{
            marginLeft: "16px",
            padding: "2px 6px",
            backgroundColor: isManualMode ? "#10B981" : "#EF4444",
            color: "white",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: "bold",
          }}
        >
          {isManualMode ? "MANUAL" : "ROLL"}
        </span>
      </div>

      {!isManualMode && (
        <div style={styles.availableStats}>
          <div style={styles.availableStatsHeader}>
            {availableStats.length > 0 && (
              <span style={styles.availableStatsLabel}>
                Available Stats to Assign:
              </span>
            )}
            <span style={styles.availableStatsTotal}>
              Total: {rolledStats.reduce((sum, stat) => sum + stat, 0)}
              {allStatsAssigned() && (
                <span style={styles.completeIndicator}>✓ Complete</span>
              )}
            </span>
          </div>
          <div style={styles.statsContainer}>
            {availableStats.length > 0 ? (
              availableStats.map((stat, index) => (
                <span key={index} style={styles.statBadge}>
                  {stat} ({getAbilityModifier(stat) >= 0 ? "+" : ""}
                  {getAbilityModifier(stat)})
                </span>
              ))
            ) : (
              <span style={styles.allAssignedText}>All stats assigned!</span>
            )}
          </div>
        </div>
      )}

      <div style={styles.abilityGrid}>
        {Object.entries(character.abilityScores).map(([ability, score]) => {
          return (
            <div
              key={ability}
              style={{
                ...styles.abilityCard,
                backgroundColor:
                  score !== null
                    ? `${theme.success || "#10B981"}20`
                    : theme.surface,
                borderColor:
                  score !== null ? theme.success || "#10B981" : theme.border,
              }}
            >
              <div style={styles.abilityName}>
                {ability.charAt(0).toUpperCase() + ability.slice(1)}
              </div>

              <div
                style={
                  score !== null
                    ? styles.abilityModifier
                    : styles.abilityModifierEmpty
                }
              >
                {score !== null ? (
                  <>
                    {getAbilityModifier(score) >= 0 ? "+" : ""}
                    {getAbilityModifier(score)}
                  </>
                ) : (
                  "--"
                )}
              </div>

              <div style={styles.abilityScoreContainer}>
                {isManualMode ? (
                  <>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={
                        tempInputValues[ability] !== undefined
                          ? tempInputValues[ability]
                          : score || ""
                      }
                      onChange={(e) =>
                        handleManualScoreChange(ability, e.target.value)
                      }
                      onKeyDown={(e) => handleManualScoreKeyDown(e, ability)}
                      style={{
                        ...styles.input,
                        textAlign: "center",
                        fontSize: score !== null ? "18px" : "16px",
                        fontWeight: score !== null ? "bold" : "normal",
                        width: "100px",
                        padding: "8px 4px",
                        backgroundColor: theme.surface,
                        border: `2px solid ${theme.border}`,
                        borderRadius: "4px",
                        color: theme.text,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.primary;
                      }}
                      onBlur={(e) => {
                        handleManualScoreBlur(ability);
                        e.target.style.borderColor = theme.border;
                      }}
                      placeholder="Enter..."
                    />
                    {score !== null && (
                      <button
                        onClick={() => clearStat(ability)}
                        style={styles.trashButton}
                        title="Clear this ability score"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {score !== null ? (
                      <>
                        <div style={styles.abilityScore}>{score}</div>
                        <button
                          onClick={() => clearStat(ability)}
                          style={styles.trashButton}
                          title="Clear this ability score"
                        >
                          <Trash size={16} />
                        </button>
                      </>
                    ) : (
                      <select
                        value=""
                        onChange={(e) =>
                          assignStat(ability, parseInt(e.target.value))
                        }
                        style={{
                          ...styles.assignSelect,
                          borderColor: theme.border,
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = theme.primary;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = theme.border;
                        }}
                        disabled={availableStats.length === 0}
                      >
                        <option value="">
                          {availableStats.length === 0
                            ? "No stats available"
                            : "Assign..."}
                        </option>
                        {availableStats.map((stat, index) => (
                          <option key={index} value={stat}>
                            {stat} ({getAbilityModifier(stat) >= 0 ? "+" : ""}
                            {getAbilityModifier(stat)})
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isManualMode && (
        <div
          style={{
            fontSize: "12px",
            color: theme.textSecondary,
            fontStyle: "italic",
            marginTop: "8px",
            textAlign: "center",
          }}
        >
          💡 Tip: Press Enter to confirm a value, Escape to cancel. Valid range:
          1-30
        </div>
      )}
    </div>
  );
};

export default AbilityScorePicker;
