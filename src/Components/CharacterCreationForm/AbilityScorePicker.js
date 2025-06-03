import { RotateIcon, TrashIcon } from "../../icons";
import { useTheme } from "../../contexts/ThemeContext";
import { createAbilityScorePickerStyles } from "../../styles/masterStyles";

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
    } else {
      rollAllStats();
    }
  };

  const handleManualScoreChange = (ability, value) => {
    setTempInputValues((prev) => ({
      ...prev,
      [ability]: value,
    }));

    if (value === "") {
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
    if (score === null || score === undefined) return 0;
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
                <RotateIcon />
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
              backgroundColor: isManualMode ? "#10B981" : "#D1D5DB",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              border: "2px solid",
              borderColor: isManualMode ? "#10B981" : "#9CA3AF",
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
          ? "Manual input mode - enter ability scores directly"
          : "Roll mode - assign generated stats to abilities"}
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
        {Object.entries(character.abilityScores).map(([ability, score]) => (
          <div
            key={ability}
            style={{
              ...styles.abilityCard,
              backgroundColor: score !== null ? "#F0FDF4" : "white",
            }}
          >
            <div style={styles.abilityName}>{ability}</div>

            {score !== null ? (
              <>
                <div style={styles.abilityModifier}>
                  {getAbilityModifier(score) >= 0 ? "+" : ""}
                  {getAbilityModifier(score)}
                </div>

                <div style={styles.abilityScoreContainer}>
                  {isManualMode ? (
                    <input
                      type="number"
                      min="1"
                      value={
                        tempInputValues[ability] !== undefined
                          ? tempInputValues[ability]
                          : score === null
                          ? ""
                          : score
                      }
                      onChange={(e) =>
                        handleManualScoreChange(ability, e.target.value)
                      }
                      onBlur={() => handleManualScoreBlur(ability)}
                      style={{
                        ...styles.input,
                        textAlign: "center",
                        fontSize: "18px",
                        fontWeight: "bold",
                        width: "60px",
                        padding: "4px",
                      }}
                    />
                  ) : (
                    <div style={styles.abilityScore}>{score}</div>
                  )}
                  <button
                    onClick={() => clearStat(ability)}
                    style={styles.trashButton}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={styles.abilityModifierEmpty}>--</div>
                {isManualMode ? (
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter..."
                    value={tempInputValues[ability] || ""}
                    onChange={(e) =>
                      handleManualScoreChange(ability, e.target.value)
                    }
                    onBlur={() => handleManualScoreBlur(ability)}
                    style={{
                      ...styles.input,
                      textAlign: "center",
                      fontSize: "16px",
                      width: "80px",
                      padding: "4px",
                    }}
                  />
                ) : (
                  <select
                    value=""
                    onChange={(e) =>
                      assignStat(ability, parseInt(e.target.value))
                    }
                    style={styles.assignSelect}
                  >
                    <option value="">Assign...</option>
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
        ))}
      </div>
    </div>
  );
};
export default AbilityScorePicker;
