import { RefreshCw, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { createAbilityScorePickerStyles } from "../../../styles/masterStyles";
import { calculateTotalModifiers } from "../utils";

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
  featChoices = {},
  houseChoices = {},
  heritageChoices = {},
  showModifiers = true,
}) => {
  const { theme } = useTheme();
  const styles = createAbilityScorePickerStyles(theme);

  // State to persist manual scores and rolled assignments separately
  const [manualScores, setManualScores] = useState({
    strength: 8,
    dexterity: 8,
    constitution: 8,
    intelligence: 8,
    wisdom: 8,
    charisma: 8,
  });

  const [rolledAssignments, setRolledAssignments] = useState({
    strength: null,
    dexterity: null,
    constitution: null,
    intelligence: null,
    wisdom: null,
    charisma: null,
  });

  useEffect(() => {}, [heritageChoices, character.innateHeritage]);

  const {
    totalModifiers,
    allDetails,
    featModifiers,
    backgroundModifiers,
    houseModifiers,
    heritageModifiers,
  } = showModifiers
    ? calculateTotalModifiers(
        character,
        featChoices,
        houseChoices,
        heritageChoices
      )
    : {
        totalModifiers: {
          strength: 0,
          dexterity: 0,
          constitution: 0,
          intelligence: 0,
          wisdom: 0,
          charisma: 0,
        },
        allDetails: {},
        featModifiers: {
          strength: 0,
          dexterity: 0,
          constitution: 0,
          intelligence: 0,
          wisdom: 0,
          charisma: 0,
        },
        backgroundModifiers: {
          strength: 0,
          dexterity: 0,
          constitution: 0,
          intelligence: 0,
          wisdom: 0,
          charisma: 0,
        },
        houseModifiers: {
          strength: 0,
          dexterity: 0,
          constitution: 0,
          intelligence: 0,
          wisdom: 0,
          charisma: 0,
        },
        heritageModifiers: {
          strength: 0,
          dexterity: 0,
          constitution: 0,
          intelligence: 0,
          wisdom: 0,
          charisma: 0,
        },
      };

  const toggleManualMode = () => {
    const newManualMode = !isManualMode;

    setIsManualMode(newManualMode);

    if (newManualMode) {
      // Store current rolled assignments before switching
      setRolledAssignments({ ...character.abilityScores });

      // Restore manual scores
      setCharacter((prev) => ({
        ...prev,
        abilityScores: { ...manualScores },
      }));
    } else {
      // Store current manual scores before switching
      setManualScores({ ...character.abilityScores });

      // Restore rolled assignments
      setCharacter((prev) => ({
        ...prev,
        abilityScores: { ...rolledAssignments },
      }));

      // If we have no rolled stats, generate new ones
      if (rolledStats.length === 0) {
        rollAllStats();
      } else {
        // Recalculate available stats based on current assignments
        const assignedStats = Object.values(rolledAssignments).filter(
          (score) => score !== null
        );
        const unassignedStats = rolledStats.filter(
          (stat) => !assignedStats.includes(stat)
        );
        setAvailableStats(unassignedStats);
      }
    }
  };

  const handleManualScoreIncrement = (ability) => {
    const currentScore = character.abilityScores[ability] || 8;
    const newScore = Math.min(currentScore + 1, 40);

    // Update both character state and manual scores
    setCharacter((prev) => ({
      ...prev,
      abilityScores: {
        ...prev.abilityScores,
        [ability]: newScore,
      },
    }));

    setManualScores((prev) => ({
      ...prev,
      [ability]: newScore,
    }));
  };

  const handleManualScoreDecrement = (ability) => {
    const currentScore = character.abilityScores[ability] || 8;
    const newScore = Math.max(currentScore - 1, 1);

    // Update both character state and manual scores
    setCharacter((prev) => ({
      ...prev,
      abilityScores: {
        ...prev.abilityScores,
        [ability]: newScore,
      },
    }));

    setManualScores((prev) => ({
      ...prev,
      [ability]: newScore,
    }));
  };

  // Enhanced clear stat function to update appropriate storage
  const enhancedClearStat = (ability) => {
    if (isManualMode) {
      // Reset to default value for manual mode
      const defaultScore = 8;
      setCharacter((prev) => ({
        ...prev,
        abilityScores: {
          ...prev.abilityScores,
          [ability]: defaultScore,
        },
      }));

      setManualScores((prev) => ({
        ...prev,
        [ability]: defaultScore,
      }));
    } else {
      // Use the original clearStat function for rolled mode
      clearStat(ability);

      // Also update our rolled assignments tracking
      setRolledAssignments((prev) => ({
        ...prev,
        [ability]: null,
      }));
    }
  };

  // Enhanced assign stat function to update rolled assignments tracking
  const enhancedAssignStat = (ability, value) => {
    assignStat(ability, value);

    // Update our rolled assignments tracking
    setRolledAssignments((prev) => ({
      ...prev,
      [ability]: value,
    }));
  };

  const getAbilityModifier = (score) => {
    if (score === null || score === undefined || isNaN(score)) return 0;
    return Math.floor((score - 10) / 2);
  };

  const getEffectiveAbilityScore = (ability) => {
    const baseScore = character.abilityScores[ability] || 0;
    const totalBonus = totalModifiers[ability] || 0;
    return baseScore + totalBonus;
  };

  const getEffectiveModifier = (ability) => {
    const effectiveScore = getEffectiveAbilityScore(ability);
    return getAbilityModifier(effectiveScore);
  };

  const getTooltipText = (ability) => {
    const details = allDetails[ability] || [];
    if (details.length === 0) return null;

    const sourceGroups = {
      feat: [],
      background: [],
      house: [],
      heritage: [],
    };

    details.forEach((detail) => {
      if (detail.source === "feat") {
        sourceGroups.feat.push(detail);
      } else if (detail.source === "background") {
        sourceGroups.background.push(detail);
      } else if (detail.source === "house") {
        sourceGroups.house.push(detail);
      } else if (detail.source === "heritage") {
        sourceGroups.heritage.push(detail);
      }
    });

    const tooltipParts = [];

    if (sourceGroups.feat.length > 0) {
      const featBonuses = sourceGroups.feat
        .map((d) => `${d.featName} (+${d.amount})`)
        .join(", ");
      tooltipParts.push(`Feats: ${featBonuses}`);
    }

    if (sourceGroups.background.length > 0) {
      const bgBonuses = sourceGroups.background
        .map((d) => `${d.backgroundName} (+${d.amount})`)
        .join(", ");
      tooltipParts.push(`Background: ${bgBonuses}`);
    }

    if (sourceGroups.house.length > 0) {
      const houseBonuses = sourceGroups.house
        .map((d) => `${d.houseName} (+${d.amount})`)
        .join(", ");
      tooltipParts.push(`House: ${houseBonuses}`);
    }

    if (sourceGroups.heritage.length > 0) {
      const heritageBonuses = sourceGroups.heritage
        .map((d) => `${d.heritageName} (+${d.amount})`)
        .join(", ");
      tooltipParts.push(`Heritage: ${heritageBonuses}`);
    }

    return tooltipParts.join("\n");
  };

  const handleManualScoreBlur = (ability) => {
    const tempValue = tempInputValues[ability];
    if (tempValue && tempValue !== "") {
      const numericValue = parseInt(tempValue, 10);
      if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 30) {
        const newScore = numericValue;
        setCharacter((prev) => ({
          ...prev,
          abilityScores: {
            ...prev.abilityScores,
            [ability]: newScore,
          },
        }));

        // Also update manual scores if in manual mode
        if (isManualMode) {
          setManualScores((prev) => ({
            ...prev,
            [ability]: newScore,
          }));
        }
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

  const enhancedStyles = {
    ...styles,
    abilityCardWithModifier: {
      ...styles.abilityCard,
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      borderColor: "#10B981",
      borderWidth: "2px",
    },
    abilityCardWithBackground: {
      ...styles.abilityCard,
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderColor: "#3b82f6",
      borderWidth: "2px",
    },
    abilityCardWithHouse: {
      ...styles.abilityCard,
      backgroundColor: "rgba(168, 85, 247, 0.2)",
      borderColor: "#a855f7",
      borderWidth: "2px",
    },
    abilityCardWithHeritage: {
      ...styles.abilityCard,
      backgroundColor: "rgba(139, 92, 246, 0.2)",
      borderColor: "#8b5cf6",
      borderWidth: "2px",
    },
    abilityCardWithMultiple: {
      ...styles.abilityCard,
      background:
        "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 25%, rgba(168, 85, 247, 0.2) 50%, rgba(139, 92, 246, 0.2) 100%)",
      borderColor: "#8b5cf6",
      borderWidth: "2px",
    },
    modifierBonus: {
      color: "#10B981",
      fontSize: "10px",
      fontWeight: "bold",
      marginLeft: "2px",
    },
    backgroundBonus: {
      color: "#3b82f6",
      fontSize: "10px",
      fontWeight: "bold",
      marginLeft: "2px",
    },
    houseBonus: {
      color: "#a855f7",
      fontSize: "10px",
      fontWeight: "bold",
      marginLeft: "2px",
    },
    heritageBonus: {
      color: "#8b5cf6",
      fontSize: "10px",
      fontWeight: "bold",
      marginLeft: "2px",
    },
    effectiveScore: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#8b5cf6",
    },
    scoreBreakdown: {
      fontSize: "10px",
      color: theme.textSecondary,
      lineHeight: "1.2",
    },
    modifierComparison: {
      fontSize: "9px",
      color: "#8b5cf6",
      fontWeight: "600",
    },
  };

  return (
    <div style={enhancedStyles.fieldContainer}>
      <div style={enhancedStyles.abilityScoresHeader}>
        <h3 style={enhancedStyles.abilityScoresTitle}>
          Ability Scores
          {showModifiers &&
            Object.values(totalModifiers).some((mod) => mod > 0) && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#8b5cf6",
                  marginLeft: "8px",
                }}
              >
                (Including All Bonuses)
              </span>
            )}
        </h3>

        <div style={enhancedStyles.buttonGroup}>
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
                  ...enhancedStyles.button,
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

      <div style={enhancedStyles.helpText}>
        {isManualMode
          ? "Manual input mode - use + and - buttons to set base ability scores (1-40)"
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
        {showModifiers &&
          Object.values(totalModifiers).some((mod) => mod > 0) && (
            <span
              style={{ marginLeft: "8px", fontSize: "11px", color: "#8b5cf6" }}
            >
              📈 All bonuses included in final scores
            </span>
          )}
      </div>

      {!isManualMode && (
        <div style={enhancedStyles.availableStats}>
          <div style={enhancedStyles.availableStatsHeader}>
            {availableStats.length > 0 && (
              <span style={enhancedStyles.availableStatsLabel}>
                Available Base Stats to Assign:
              </span>
            )}
            <span style={enhancedStyles.availableStatsTotal}>
              Total: {rolledStats.reduce((sum, stat) => sum + stat, 0)}
              {allStatsAssigned() && (
                <span style={enhancedStyles.completeIndicator}>✓ Complete</span>
              )}
            </span>
          </div>
          <div style={enhancedStyles.statsContainer}>
            {availableStats.length > 0 ? (
              availableStats.map((stat, index) => (
                <span key={index} style={enhancedStyles.statBadge}>
                  {stat} ({getAbilityModifier(stat) >= 0 ? "+" : ""}
                  {getAbilityModifier(stat)})
                </span>
              ))
            ) : (
              <span style={enhancedStyles.allAssignedText}>
                All stats assigned!
              </span>
            )}
          </div>
        </div>
      )}

      <div style={enhancedStyles.abilityGrid}>
        {Object.entries(character.abilityScores).map(([ability, score]) => {
          const totalBonus = totalModifiers[ability] || 0;
          const featBonus = featModifiers[ability] || 0;
          const backgroundBonus = backgroundModifiers[ability] || 0;
          const houseBonus = houseModifiers[ability] || 0;
          const heritageBonus = heritageModifiers[ability] || 0;
          const actualScore = isManualMode ? score || 8 : score;
          const effectiveScore =
            actualScore !== null ? actualScore + totalBonus : null;
          const hasModifier = totalBonus > 0;
          const hasFeatModifier = featBonus > 0;
          const hasBackgroundModifier = backgroundBonus > 0;
          const hasHouseModifier = houseBonus > 0;
          const hasHeritageModifier = heritageBonus > 0;
          const baseModifier = getAbilityModifier(actualScore);
          const effectiveModifier =
            effectiveScore !== null ? getAbilityModifier(effectiveScore) : 0;
          const tooltipText = getTooltipText(ability);

          let cardStyle = enhancedStyles.abilityCard;
          const modifierSources = [
            hasFeatModifier,
            hasBackgroundModifier,
            hasHouseModifier,
            hasHeritageModifier,
          ].filter(Boolean).length;

          if (modifierSources > 1) {
            cardStyle = enhancedStyles.abilityCardWithMultiple;
          } else if (hasFeatModifier) {
            cardStyle = enhancedStyles.abilityCardWithModifier;
          } else if (hasBackgroundModifier) {
            cardStyle = enhancedStyles.abilityCardWithBackground;
          } else if (hasHouseModifier) {
            cardStyle = enhancedStyles.abilityCardWithHouse;
          } else if (hasHeritageModifier) {
            cardStyle = enhancedStyles.abilityCardWithHeritage;
          }

          return (
            <div
              key={ability}
              style={{
                ...cardStyle,
                backgroundColor:
                  actualScore !== null
                    ? hasModifier
                      ? cardStyle.backgroundColor
                      : `${theme.success || "#10B981"}20`
                    : theme.surface,
                borderColor:
                  actualScore !== null
                    ? hasModifier
                      ? cardStyle.borderColor
                      : theme.success || "#10B981"
                    : theme.border,
              }}
              title={tooltipText}
            >
              <div style={enhancedStyles.abilityName}>
                {ability.charAt(0).toUpperCase() + ability.slice(1)}
                {hasFeatModifier && (
                  <span style={enhancedStyles.modifierBonus}>+{featBonus}</span>
                )}
                {hasBackgroundModifier && (
                  <span style={enhancedStyles.backgroundBonus}>
                    +{backgroundBonus}
                  </span>
                )}
                {hasHouseModifier && (
                  <span style={enhancedStyles.houseBonus}>+{houseBonus}</span>
                )}
                {hasHeritageModifier && (
                  <span style={enhancedStyles.heritageBonus}>
                    +{heritageBonus}
                  </span>
                )}
              </div>

              <div
                style={
                  effectiveScore !== null
                    ? hasModifier
                      ? enhancedStyles.effectiveScore
                      : enhancedStyles.abilityModifier
                    : enhancedStyles.abilityModifierEmpty
                }
              >
                {effectiveScore !== null ? (
                  <>
                    {effectiveModifier >= 0 ? "+" : ""}
                    {effectiveModifier}
                    {hasModifier && baseModifier !== effectiveModifier && (
                      <div style={enhancedStyles.modifierComparison}>
                        {baseModifier >= 0 ? "+" : ""}
                        {baseModifier} → {effectiveModifier >= 0 ? "+" : ""}
                        {effectiveModifier}
                      </div>
                    )}
                  </>
                ) : (
                  "--"
                )}
              </div>

              <div style={enhancedStyles.abilityScoreContainer}>
                {isManualMode ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        justifyContent: "center",
                        flexDirection: "column",
                        minHeight: "70px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={() => handleManualScoreDecrement(ability)}
                          disabled={actualScore <= 1}
                          style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor:
                              actualScore <= 1 ? theme.border : "#EF4444",
                            color:
                              actualScore <= 1 ? theme.textSecondary : "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor:
                              actualScore <= 1 ? "not-allowed" : "pointer",
                            fontSize: "18px",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                          }}
                          title="Decrease ability score"
                        >
                          -
                        </button>

                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            minWidth: "40px",
                            textAlign: "center",
                            padding: "8px 12px",
                            backgroundColor: theme.surface,
                            border: `2px solid ${theme.border}`,
                            borderRadius: "6px",
                            color: theme.text,
                            cursor: "default",
                          }}
                        >
                          {actualScore}
                        </div>

                        <button
                          onClick={() => handleManualScoreIncrement(ability)}
                          disabled={actualScore >= 40}
                          style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor:
                              actualScore >= 40 ? theme.border : "#10B981",
                            color:
                              actualScore >= 40 ? theme.textSecondary : "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor:
                              actualScore >= 40 ? "not-allowed" : "pointer",
                            fontSize: "18px",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                          }}
                          title="Increase ability score"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {score !== null && hasModifier && (
                      <div style={enhancedStyles.scoreBreakdown}>
                        Base: {actualScore}
                        {featBonus > 0 && ` + Feat: ${featBonus}`}
                        {backgroundBonus > 0 && ` + Bg: ${backgroundBonus}`}
                        {houseBonus > 0 && ` + House: ${houseBonus}`}
                        {heritageBonus > 0 && ` + Heritage: ${heritageBonus}`}
                        {` = ${effectiveScore}`}
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      {score !== null && (
                        <button
                          onClick={() => enhancedClearStat(ability)}
                          style={{
                            ...enhancedStyles.trashButton,
                            marginTop: "8px",
                          }}
                          title="Reset ability score"
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {actualScore !== null ? (
                      <>
                        <div style={enhancedStyles.abilityScore}>
                          {hasModifier ? (
                            <div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: theme.textSecondary,
                                }}
                              >
                                {actualScore}
                                {featBonus > 0 && ` + ${featBonus}`}
                                {backgroundBonus > 0 && ` + ${backgroundBonus}`}
                                {houseBonus > 0 && ` + ${houseBonus}`}
                                {heritageBonus > 0 && ` + ${heritageBonus}`}
                              </div>
                              <div style={enhancedStyles.effectiveScore}>
                                = {effectiveScore}
                              </div>
                            </div>
                          ) : (
                            actualScore
                          )}
                        </div>
                        <button
                          onClick={() => enhancedClearStat(ability)}
                          style={enhancedStyles.trashButton}
                          title="Clear this ability score"
                        >
                          <Trash size={16} />
                        </button>
                      </>
                    ) : (
                      <select
                        value=""
                        onChange={(e) =>
                          enhancedAssignStat(ability, parseInt(e.target.value))
                        }
                        style={{
                          ...enhancedStyles.assignSelect,
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
                            {totalBonus > 0 &&
                              ` → ${stat + totalBonus} (+${getAbilityModifier(
                                stat + totalBonus
                              )})`}
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

      {showModifiers &&
        Object.values(totalModifiers).some((mod) => mod > 0) && (
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 25%, rgba(168, 85, 247, 0.1) 50%, rgba(139, 92, 246, 0.1) 100%)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "6px",
              padding: "12px",
              marginTop: "12px",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: "12px",
                color: "#8b5cf6",
              }}
            >
              📋 Active Bonuses:
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {Object.entries(totalModifiers)
                .filter(([, bonus]) => bonus > 0)
                .map(([ability, bonus]) => {
                  const featTotal = featModifiers[ability] || 0;
                  const backgroundTotal = backgroundModifiers[ability] || 0;
                  const houseTotal = houseModifiers[ability] || 0;
                  const heritageTotal = heritageModifiers[ability] || 0;
                  const sources = [
                    featTotal > 0,
                    backgroundTotal > 0,
                    houseTotal > 0,
                    heritageTotal > 0,
                  ].filter(Boolean).length;

                  let backgroundColor = "#8b5cf6";
                  if (sources === 1) {
                    if (featTotal > 0) backgroundColor = "#10B981";
                    else if (backgroundTotal > 0) backgroundColor = "#3b82f6";
                    else if (houseTotal > 0) backgroundColor = "#a855f7";
                    else if (heritageTotal > 0) backgroundColor = "#8b5cf6";
                  }

                  return (
                    <span
                      key={ability}
                      style={{
                        fontSize: "11px",
                        padding: "2px 6px",
                        backgroundColor,
                        color: "white",
                        borderRadius: "4px",
                        cursor: "help",
                      }}
                      title={getTooltipText(ability)}
                    >
                      {ability.charAt(0).toUpperCase() + ability.slice(1)} +
                      {bonus}
                    </span>
                  );
                })}
            </div>
          </div>
        )}

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
          💡 Tip: Use + and - buttons to adjust ability scores (1-40)
          {showModifiers &&
            " • House, feat, background, and heritage bonuses are automatically added to your base scores"}
        </div>
      )}
    </div>
  );
};

export default AbilityScorePicker;
