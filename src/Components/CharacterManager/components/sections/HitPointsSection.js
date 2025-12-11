import React, { useState, useEffect } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBackgroundStyles } from "../../../../styles/masterStyles";
import { RefreshCw } from "lucide-react";
import { calculateToughFeatHPBonus } from "../../utils/utils";
import { hpData } from "../../../../SharedData/data";
import { calculateFinalAbilityScores } from "../../utils/characterUtils";

const HitPointsSection = ({ character, onChange, disabled = false }) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);
  const [isHpManualMode, setIsHpManualMode] = useState(false);
  const [rolledHp, setRolledHp] = useState(null);

  useEffect(() => {
    if (
      character._originalHitPoints !== undefined &&
      character.hitPoints === character._originalHitPoints
    ) {
      setRolledHp(null);
      setIsHpManualMode(false);
    }
  }, [character.hitPoints, character._originalHitPoints]);

  const getCastingStyleHpData = (castingStyle) => {
    const hpData = {
      "Technique Caster": { hitDie: "1d6", base: 6 },
      "Intellect Caster": { hitDie: "1d8", base: 8 },
      "Vigor Caster": { hitDie: "1d12", base: 12 },
      "Willpower Caster": { hitDie: "1d10", base: 10 },
    };
    return hpData[castingStyle] || { hitDie: "1d6", base: 6 };
  };

  const castingHpData = getCastingStyleHpData(character.castingStyle);

  const finalAbilityScores = calculateFinalAbilityScores(character);
  const effectiveConstitution = finalAbilityScores.constitution || 10;
  const conMod = Math.floor((effectiveConstitution - 10) / 2);
  // Calculate base constitution and bonus for display purposes
  const baseConstitution =
    character.baseAbilityScores?.constitution ||
    character.base_ability_scores?.constitution ||
    character.abilityScores?.constitution ||
    character.ability_scores?.constitution ||
    10;
  const constitutionBonus = effectiveConstitution - baseConstitution;
  const calculateHitPoints = ({ character }) => {
    const level = character.level || 1;

    const abilityScores = calculateFinalAbilityScores(character);
    const effectiveCon = abilityScores.constitution || 10;
    const conMod = Math.floor((effectiveCon - 10) / 2);

    const toughFeatBonus = calculateToughFeatHPBonus(character);

    const castingData = hpData[character.castingStyle];
    if (!castingData) return 1;

    const baseHP = castingData.base + conMod;

    const additionalHP = (level - 1) * (castingData.avgPerLevel + conMod);

    return Math.max(1, baseHP + additionalHP + toughFeatBonus);
  };

  const rollHp = () => {
    const level = character.level || 1;

    const abilityScores = calculateFinalAbilityScores(character);
    const effectiveCon = abilityScores.constitution || 10;
    const conMod = Math.floor((effectiveCon - 10) / 2);

    const toughFeatBonus = calculateToughFeatHPBonus(character);

    let totalHp = castingHpData.base + conMod;

    for (let i = 2; i <= level; i++) {
      const rolled = Math.floor(Math.random() * castingHpData.base) + 1;
      totalHp += rolled + conMod;
    }

    totalHp = Math.max(1, totalHp + toughFeatBonus);

    setRolledHp(totalHp);
    onChange("hitPoints", totalHp);

    if (
      character.currentHitPoints === undefined ||
      character.currentHitPoints === null
    ) {
      onChange("currentHitPoints", totalHp);
    }
  };

  useEffect(() => {
    if (!isHpManualMode && rolledHp === null && character.castingStyle) {
      const calculatedHp = calculateHitPoints({ character });
      if (
        character.hitPoints !== calculatedHp &&
        character.hitPoints !== undefined
      ) {
        onChange("hitPoints", calculatedHp);
        if (
          character.currentHitPoints === undefined ||
          character.currentHitPoints === null
        ) {
          onChange("currentHitPoints", calculatedHp);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    character.level,
    effectiveConstitution,
    character.castingStyle,
    isHpManualMode,
    rolledHp,
  ]);

  const hpStyles = {
    container: {
      ...styles.container,
      padding: "0",
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: "8px",
      border: `2px solid ${theme.border}`,
      padding: "16px",
      marginTop: "8px",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px",
    },
    title: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
      margin: 0,
    },
    modeIndicator: {
      fontSize: "11px",
      color: theme.textSecondary,
      padding: "4px 8px",
      backgroundColor: isHpManualMode
        ? `${theme.success}20`
        : `${theme.primary}20`,
      borderRadius: "12px",
      border: `1px solid ${isHpManualMode ? theme.success : theme.primary}`,
      fontWeight: "600",
    },
    mainDisplay: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "16px",
    },
    hpValue: {
      fontSize: "32px",
      fontWeight: "bold",
      color: theme.primary,
      minWidth: "80px",
      textAlign: "center",
      padding: "12px 16px",
      backgroundColor: theme.background,
      borderRadius: "8px",
      border: `3px solid ${theme.primary}`,
      boxShadow: `0 4px 8px ${theme.primary}20`,
    },
    hpInput: {
      fontSize: "28px",
      fontWeight: "bold",
      color: theme.text,
      minWidth: "80px",
      textAlign: "center",
      padding: "12px 16px",
      backgroundColor: theme.background,
      borderRadius: "8px",
      border: `3px solid ${theme.border}`,
      outline: "none",
      transition: "border-color 0.2s ease",
      MozAppearance: "textfield",
      WebkitAppearance: "none",
      appearance: "textfield",
      cursor: "text",
    },
    calculationInfo: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    calculationRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: theme.text,
    },
    hitDie: {
      padding: "4px 8px",
      backgroundColor: theme.primary,
      color: theme.text,
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "600",
    },
    modifier: {
      padding: "4px 8px",
      backgroundColor: conMod >= 0 ? theme.success : theme.error,
      color: theme.text,
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "600",
    },
    constitutionScore: {
      padding: "4px 8px",
      backgroundColor: theme.background,
      color: theme.text,
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "600",
    },
    controls: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      justifyContent: "center",
    },
    rollButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 16px",
      backgroundColor: theme.warning,
      color: theme.text,
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      transition: "all 0.2s ease",
      boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
    },
    toggleButton: {
      padding: "10px 16px",
      backgroundColor: isHpManualMode ? theme.success : theme.textSecondary,
      color: theme.text,
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      transition: "all 0.2s ease",
      boxShadow: `0 2px 8px ${
        isHpManualMode ? theme.success : theme.textSecondary
      }30`,
    },
    helpText: {
      fontSize: "12px",
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: "12px",
      fontStyle: "italic",
      lineHeight: "1.4",
    },
    prerequisiteWarning: {
      padding: "16px",
      backgroundColor: `${theme.warning}15`,
      border: `2px solid ${theme.warning}`,
      borderRadius: "8px",
      textAlign: "center",
      fontSize: "14px",
      color: theme.warning,
      fontWeight: "500",
    },
  };

  const hasCastingStyle = !!character.castingStyle;
  const hasConstitution =
    character.abilityScores?.constitution !== null &&
    character.abilityScores?.constitution !== undefined;

  if (!hasCastingStyle || !hasConstitution) {
    return (
      <div style={hpStyles.container}>
        <div style={hpStyles.prerequisiteWarning}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>Hit Points</h3>
          <p style={{ margin: 0 }}>
            {!hasCastingStyle && !hasConstitution
              ? "Please select a Casting Style and set your Constitution score first"
              : !hasCastingStyle
              ? "Please select a Casting Style first"
              : "Please set your Constitution score first"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={hpStyles.container}>
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div style={hpStyles.card}>
        <div style={hpStyles.header}>
          <h3 style={hpStyles.title}>Hit Points</h3>
          <div style={hpStyles.modeIndicator}>
            {isHpManualMode
              ? "Manual Entry"
              : rolledHp !== null
              ? "Rolled"
              : "Auto Calculated"}
          </div>
        </div>

        <div style={hpStyles.mainDisplay}>
          {isHpManualMode ? (
            <input
              type="number"
              min="1"
              value={character.hitPoints || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  onChange("hitPoints", "");
                } else {
                  const newMaxHp = Math.max(1, parseInt(value) || 1);
                  onChange("hitPoints", newMaxHp);

                  if (
                    character.currentHitPoints === undefined ||
                    character.currentHitPoints === null
                  ) {
                    onChange("currentHitPoints", newMaxHp);
                  }
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
                if (e.target.value === "" || parseInt(e.target.value) < 1) {
                  onChange("hitPoints", 1);
                  onChange("currentHitPoints", 1);
                }
              }}
              placeholder="--"
              style={{
                ...hpStyles.hpInput,
                borderColor: disabled ? theme.border : theme.primary,
              }}
              disabled={disabled}
              onFocus={(e) => {
                if (!disabled) {
                  e.target.style.borderColor = theme.primary;
                  e.target.select();
                }
              }}
              onClick={(e) => {
                if (!disabled) {
                  e.target.select();
                }
              }}
            />
          ) : (
            <div style={hpStyles.hpValue}>
              {rolledHp !== null ? rolledHp : calculateHitPoints({ character })}
            </div>
          )}

          <div style={hpStyles.calculationInfo}>
            <div style={hpStyles.calculationRow}>
              <span>Casting Style:</span>
              <span style={hpStyles.hitDie}>{character.castingStyle}</span>
              <span>({castingHpData.hitDie})</span>
            </div>
            <div style={hpStyles.calculationRow}>
              <span>Constitution:</span>
              <span style={hpStyles.constitutionScore}>
                {effectiveConstitution}
                {constitutionBonus !== 0 && (
                  <span
                    style={{ fontSize: "11px", color: theme.textSecondary }}
                  >
                    {" "}
                    ({baseConstitution} + {constitutionBonus})
                  </span>
                )}
              </span>
              <span>Modifier:</span>
              <span style={hpStyles.modifier}>
                {conMod >= 0 ? "+" : ""}
                {conMod}
              </span>
            </div>
            <div style={hpStyles.calculationRow}>
              <span>Level:</span>
              <span style={hpStyles.constitutionScore}>
                {character.level || 1}
              </span>
            </div>
            {!isHpManualMode && rolledHp === null && (
              <div style={hpStyles.calculationRow}>
                <span style={{ color: theme.textSecondary, fontSize: "14px" }}>
                  = {castingHpData.base} + {conMod} + ({character.level - 1} × (
                  {hpData[character.castingStyle]?.avgPerLevel || 0} + {conMod}
                  )) = {calculateHitPoints({ character })}
                </span>
              </div>
            )}
            {rolledHp !== null && (
              <div style={hpStyles.calculationRow}>
                <span style={{ color: theme.success, fontSize: "14px" }}>
                  Rolled: ({castingHpData.hitDie} + {conMod}) ×{" "}
                  {character.level || 1} CON = {rolledHp}
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={hpStyles.controls}>
          {!isHpManualMode && (
            <button
              onClick={rollHp}
              style={hpStyles.rollButton}
              disabled={disabled}
              onMouseEnter={(e) => {
                if (!disabled) {
                  e.target.style.backgroundColor = "#DC2626";
                  e.target.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled) {
                  e.target.style.backgroundColor = "#EF4444";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              <RefreshCw size={16} />
              Roll for Hit Points
            </button>
          )}

          <button
            onClick={() => {
              setIsHpManualMode(!isHpManualMode);
              if (isHpManualMode) {
                setRolledHp(null);
              }
            }}
            style={hpStyles.toggleButton}
            disabled={disabled}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.opacity = "0.9";
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.target.style.transform = "translateY(0)";
                e.target.style.opacity = "1";
              }
            }}
          >
            {isHpManualMode ? "Switch to Auto" : "Enter Manually"}
          </button>
        </div>

        <div style={hpStyles.helpText}>
          {isHpManualMode
            ? "Enter your hit points manually, or switch back to automatic calculation"
            : rolledHp !== null
            ? "Hit points were rolled manually. Use 'Roll for Hit Points' to roll again, or switch to manual entry"
            : `Hit points calculated automatically: Level 1: ${
                character.castingStyle
              } base (${castingHpData.base}) + Con mod (${
                conMod >= 0 ? "+" : ""
              }${conMod}), Levels 2+: avg per level (${
                hpData[character.castingStyle]?.avgPerLevel || 0
              }) + Con mod per level`}
        </div>
      </div>
    </div>
  );
};

export default HitPointsSection;
