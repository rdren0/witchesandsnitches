import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, Trash } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBaseStyles } from "../../utils/styles";
import {
  calculateTotalModifiers,
  getAllSelectedFeats,
} from "../../utils/characterUtils";

const AbilityScoresSection = ({
  character,
  onChange,
  onCharacterUpdate,
  disabled = false,
  mode = "create",
  showModifiers = true,
}) => {
  const { theme } = useTheme();
  const styles = createBaseStyles(theme);

  const [rolledStats, setRolledStats] = useState([]);
  const [availableStats, setAvailableStats] = useState([]);
  const [tempInputValues, setTempInputValues] = useState({});
  const [isManualMode, setIsManualMode] = useState(false);
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

  useEffect(() => {
    if (!character.abilityScores) {
      const initialScores = {
        strength: null,
        dexterity: null,
        constitution: null,
        intelligence: null,
        wisdom: null,
        charisma: null,
      };

      if (onCharacterUpdate) {
        onCharacterUpdate({
          ...character,
          abilityScores: initialScores,
        });
      } else {
        onChange("abilityScores", initialScores);
      }
    }
  }, [character, onChange, onCharacterUpdate]);

  const getFeatChoices = () => {
    const allFeatChoices = { ...character.featChoices };

    if (character.asiChoices) {
      Object.values(character.asiChoices).forEach((choice) => {
        if (choice.type === "feat" && choice.featChoices) {
          Object.assign(allFeatChoices, choice.featChoices);
        }
      });
    }

    return allFeatChoices;
  };

  const featChoices = getFeatChoices();

  const houseChoices = character.house_choices || character.houseChoices || {};
  const heritageChoices =
    character.heritage_choices || character.heritageChoices || {};

  console.log("🔍 AbilityScoresSection Debug:", {
    characterHouse: character.house,
    houseChoices: houseChoices,
    featChoices: featChoices,
    allSelectedFeats: getAllSelectedFeats(character),
    fullCharacter: character,
  });

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

  const rollStat = useCallback(() => {
    const rolls = Array.from(
      { length: 4 },
      () => Math.floor(Math.random() * 6) + 1
    );
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
  }, []);

  const rollAllStats = useCallback(() => {
    const newStats = Array.from({ length: 6 }, () => rollStat());
    setRolledStats(newStats);
    setAvailableStats([...newStats]);

    const clearedScores = {
      strength: null,
      dexterity: null,
      constitution: null,
      intelligence: null,
      wisdom: null,
      charisma: null,
    };

    if (onCharacterUpdate) {
      onCharacterUpdate({
        ...character,
        abilityScores: clearedScores,
      });
    } else {
      onChange("abilityScores", clearedScores);
    }
  }, [rollStat, character, onChange, onCharacterUpdate]);

  const assignStat = useCallback(
    (ability, value) => {
      const newAbilityScores = {
        ...character.abilityScores,
        [ability]: value,
      };

      const newAvailableStats = availableStats.filter((stat, index) => {
        const firstMatch = availableStats.indexOf(value);
        return index !== firstMatch;
      });

      setAvailableStats(newAvailableStats);
      setRolledAssignments((prev) => ({
        ...prev,
        [ability]: value,
      }));

      if (onCharacterUpdate) {
        onCharacterUpdate({
          ...character,
          abilityScores: newAbilityScores,
        });
      } else {
        onChange("abilityScores", newAbilityScores);
      }
    },
    [character, availableStats, onChange, onCharacterUpdate]
  );

  const clearStat = useCallback(
    (ability) => {
      if (isManualMode) {
        const defaultScore = 8;
        const newAbilityScores = {
          ...character.abilityScores,
          [ability]: defaultScore,
        };

        setManualScores((prev) => ({
          ...prev,
          [ability]: defaultScore,
        }));

        if (onCharacterUpdate) {
          onCharacterUpdate({
            ...character,
            abilityScores: newAbilityScores,
          });
        } else {
          onChange("abilityScores", newAbilityScores);
        }
      } else {
        const currentValue = character.abilityScores?.[ability];
        if (currentValue !== null && currentValue !== undefined) {
          const newAvailableStats = [...availableStats, currentValue].sort(
            (a, b) => b - a
          );
          setAvailableStats(newAvailableStats);
        }

        const newAbilityScores = {
          ...character.abilityScores,
          [ability]: null,
        };

        setRolledAssignments((prev) => ({
          ...prev,
          [ability]: null,
        }));

        if (onCharacterUpdate) {
          onCharacterUpdate({
            ...character,
            abilityScores: newAbilityScores,
          });
        } else {
          onChange("abilityScores", newAbilityScores);
        }
      }
    },
    [character, availableStats, onChange, onCharacterUpdate, isManualMode]
  );

  const allStatsAssigned = useCallback(() => {
    if (!character.abilityScores) return false;

    return Object.values(character.abilityScores).every(
      (score) => score !== null && score !== undefined
    );
  }, [character.abilityScores]);

  const handleCharacterUpdate = useCallback(
    (updatedCharacter) => {
      if (onCharacterUpdate) {
        onCharacterUpdate(updatedCharacter);
      } else {
        Object.keys(updatedCharacter).forEach((key) => {
          if (updatedCharacter[key] !== character[key]) {
            onChange(key, updatedCharacter[key]);
          }
        });
      }
    },
    [character, onChange, onCharacterUpdate]
  );

  const toggleManualMode = () => {
    const newManualMode = !isManualMode;

    setIsManualMode(newManualMode);

    if (newManualMode) {
      setRolledAssignments({ ...character.abilityScores });

      handleCharacterUpdate({
        ...character,
        abilityScores: { ...manualScores },
      });
    } else {
      setManualScores({ ...character.abilityScores });

      handleCharacterUpdate({
        ...character,
        abilityScores: { ...rolledAssignments },
      });

      if (rolledStats.length === 0) {
        rollAllStats();
      } else {
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

    const newAbilityScores = {
      ...character.abilityScores,
      [ability]: newScore,
    };

    handleCharacterUpdate({
      ...character,
      abilityScores: newAbilityScores,
    });

    setManualScores((prev) => ({
      ...prev,
      [ability]: newScore,
    }));
  };

  const handleManualScoreDecrement = (ability) => {
    const currentScore = character.abilityScores[ability] || 8;
    const newScore = Math.max(currentScore - 1, 1);

    const newAbilityScores = {
      ...character.abilityScores,
      [ability]: newScore,
    };

    handleCharacterUpdate({
      ...character,
      abilityScores: newAbilityScores,
    });

    setManualScores((prev) => ({
      ...prev,
      [ability]: newScore,
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

  useEffect(() => {
    if (!isManualMode && rolledStats.length === 0 && mode === "create") {
      rollAllStats();
    }
  }, [isManualMode, rolledStats.length, mode, rollAllStats]);

  const componentStyles = {
    container: {
      padding: "16px",
      backgroundColor: theme.surface,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
    },
    disabledContainer: {
      padding: "16px",
      backgroundColor: `${theme.textSecondary}10`,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    title: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
      margin: 0,
    },
    buttonGroup: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    rollButton: {
      ...styles.button,
      ...styles.buttonSecondary,
      backgroundColor: "#EF4444",
      color: "white",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    toggle: {
      position: "relative",
      width: "44px",
      height: "24px",
      backgroundColor: isManualMode ? theme.success || "#10B981" : "#D1D5DB",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
      border: "2px solid",
      borderColor: isManualMode ? theme.success || "#10B981" : "#9CA3AF",
    },
    toggleThumb: {
      position: "absolute",
      top: "2px",
      left: isManualMode ? "22px" : "2px",
      width: "16px",
      height: "16px",
      backgroundColor: "white",
      borderRadius: "50%",
      transition: "left 0.2s ease",
      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    },
    helpText: {
      fontSize: "14px",
      color: theme.textSecondary,
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    modeIndicator: {
      padding: "2px 6px",
      backgroundColor: isManualMode ? "#10B981" : "#EF4444",
      color: "white",
      borderRadius: "4px",
      fontSize: "10px",
      fontWeight: "bold",
    },
    availableStats: {
      backgroundColor: `${theme.primary}10`,
      padding: "12px",
      borderRadius: "6px",
      marginBottom: "16px",
      border: `1px solid ${theme.primary}20`,
    },
    availableStatsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
    },
    statsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    statBadge: {
      padding: "4px 8px",
      backgroundColor: theme.primary,
      color: "white",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "bold",
    },
    abilityGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
    },
    abilityCard: {
      padding: "16px",
      backgroundColor: theme.surface,
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      textAlign: "center",
    },
    abilityCardWithModifier: {
      padding: "16px",
      textAlign: "center",
      backgroundColor: theme.background,
      borderColor: "#10B981",
      border: `2px dashed ${theme.success + "70"}`,
      borderRadius: "8px",
    },
    abilityName: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
    },
    abilityModifier: {
      fontSize: "24px",
      fontWeight: "bold",
      color: theme.text,
      marginBottom: "8px",
    },
    abilityScore: {
      fontSize: "20px",
      fontWeight: "bold",
      color: theme.text,
      marginBottom: "8px",
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
      marginTop: "4px",
    },
    manualControls: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      justifyContent: "center",
      flexDirection: "column",
      minHeight: "70px",
    },
    manualButtonRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    manualButton: {
      width: "32px",
      height: "32px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    scoreDisplay: {
      fontSize: "20px",
      fontWeight: "bold",
      minWidth: "40px",
      textAlign: "center",
      padding: "8px 12px",
      backgroundColor: theme.surface,
      border: `2px solid ${theme.border}`,
      borderRadius: "6px",
      color: theme.text,
    },
    assignSelect: {
      padding: "8px",
      borderRadius: "4px",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      color: theme.text,
      fontSize: "14px",
      width: "100%",
    },
    trashButton: {
      ...styles.button,
      ...styles.buttonSecondary,
      backgroundColor: "#EF4444",
      color: "white",
      padding: "4px 8px",
      marginTop: "8px",
    },
    modifierBonus: {
      color: "#10B981",
      fontSize: "10px",
      fontWeight: "bold",
      marginLeft: "2px",
    },
    bonusesSection: {
      background:
        "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 25%, rgba(168, 85, 247, 0.1) 50%, rgba(139, 92, 246, 0.1) 100%)",
      border: "1px solid rgba(139, 92, 246, 0.3)",
      borderRadius: "6px",
      padding: "12px",
      marginTop: "12px",
    },
  };

  const getCardStyleForAbility = (ability) => {
    const totalBonus = totalModifiers[ability] || 0;
    const featBonus = featModifiers[ability] || 0;
    const backgroundBonus = backgroundModifiers[ability] || 0;
    const houseBonus = houseModifiers[ability] || 0;
    const heritageBonus = heritageModifiers[ability] || 0;

    if (totalBonus === 0) {
      return componentStyles.abilityCard;
    }

    const modifierSources = [
      featBonus > 0,
      backgroundBonus > 0,
      houseBonus > 0,
      heritageBonus > 0,
    ].filter(Boolean).length;

    if (modifierSources > 1) {
      return componentStyles.abilityCardWithMultiple;
    } else if (featBonus > 0) {
      return componentStyles.abilityCardWithModifier;
    } else if (backgroundBonus > 0) {
      return componentStyles.abilityCardWithBackground;
    } else if (houseBonus > 0) {
      return componentStyles.abilityCardWithHouse;
    } else if (heritageBonus > 0) {
      return componentStyles.abilityCardWithHeritage;
    }

    return componentStyles.abilityCard;
  };

  if (disabled) {
    return (
      <div style={componentStyles.disabledContainer}>
        <p
          style={{
            color: theme.textSecondary,
            margin: "0 0 12px 0",
            textAlign: "center",
          }}
        >
          Ability scores are locked. Unlock the section to make changes.
        </p>

        {character.abilityScores && (
          <div style={componentStyles.abilityGrid}>
            {Object.entries(character.abilityScores).map(([ability, score]) => (
              <div
                key={ability}
                style={{
                  padding: "12px",
                  backgroundColor: theme.surface,
                  borderRadius: "6px",
                  textAlign: "center",
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.textSecondary,
                    marginBottom: "4px",
                  }}
                >
                  {ability.charAt(0).toUpperCase() + ability.slice(1)}
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: theme.text,
                  }}
                >
                  {score || "--"}
                </div>
                {score && (
                  <div style={{ fontSize: "12px", color: theme.textSecondary }}>
                    {getAbilityModifier(score) >= 0 ? "+" : ""}
                    {getAbilityModifier(score)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={componentStyles.container}>
      <div style={componentStyles.header}>
        <h3 style={componentStyles.title}>
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

        <div style={componentStyles.buttonGroup}>
          {!isManualMode && (
            <button onClick={rollAllStats} style={componentStyles.rollButton}>
              <RefreshCw size={16} />
              Roll For Stats
            </button>
          )}
          <div onClick={toggleManualMode} style={componentStyles.toggle}>
            <div style={componentStyles.toggleThumb} />
          </div>
        </div>
      </div>

      <div style={componentStyles.helpText}>
        {isManualMode
          ? "Manual input mode - use + and - buttons to set base ability scores (1-40)"
          : "Roll mode - assign generated stats to abilities"}
        <span style={componentStyles.modeIndicator}>
          {isManualMode ? "MANUAL" : "ROLL"}
        </span>
      </div>

      {!isManualMode && (
        <div style={componentStyles.availableStats}>
          <div style={componentStyles.availableStatsHeader}>
            {availableStats.length > 0 && (
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: theme.text,
                }}
              >
                Available Base Stats to Assign:
              </span>
            )}
            <span style={{ fontSize: "12px", color: theme.textSecondary }}>
              Total: {rolledStats.reduce((sum, stat) => sum + stat, 0)}
              {allStatsAssigned() && (
                <span style={{ color: "#10B981", marginLeft: "8px" }}>
                  ✓ Complete
                </span>
              )}
            </span>
          </div>
          <div style={componentStyles.statsContainer}>
            {availableStats.length > 0 ? (
              availableStats.map((stat, index) => (
                <span key={index} style={componentStyles.statBadge}>
                  {stat} ({getAbilityModifier(stat) >= 0 ? "+" : ""}
                  {getAbilityModifier(stat)})
                </span>
              ))
            ) : (
              <span style={{ fontSize: "14px", color: theme.textSecondary }}>
                All stats assigned!
              </span>
            )}
          </div>
        </div>
      )}

      <div style={componentStyles.abilityGrid}>
        {Object.entries(character.abilityScores || {}).map(
          ([ability, score]) => {
            const totalBonus = totalModifiers[ability] || 0;
            const featBonus = featModifiers[ability] || 0;
            const backgroundBonus = backgroundModifiers[ability] || 0;
            const houseBonus = houseModifiers[ability] || 0;
            const heritageBonus = heritageModifiers[ability] || 0;
            const actualScore = isManualMode ? score || 8 : score;
            const effectiveScore =
              actualScore !== null ? actualScore + totalBonus : null;
            const hasModifier = totalBonus > 0;
            const baseModifier = getAbilityModifier(actualScore);
            const effectiveModifier =
              effectiveScore !== null ? getAbilityModifier(effectiveScore) : 0;
            const tooltipText = getTooltipText(ability);

            let cardStyle = componentStyles.abilityCard;
            if (hasModifier) {
              cardStyle = componentStyles.abilityCardWithModifier;
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
                <div style={componentStyles.abilityName}>
                  {ability.charAt(0).toUpperCase() + ability.slice(1)}
                  {featBonus > 0 && (
                    <span style={componentStyles.modifierBonus}>
                      +{featBonus}
                    </span>
                  )}
                  {backgroundBonus > 0 && (
                    <span style={componentStyles.modifierBonus}>
                      +{backgroundBonus}
                    </span>
                  )}
                  {houseBonus > 0 && (
                    <span style={componentStyles.modifierBonus}>
                      +{houseBonus}
                    </span>
                  )}
                  {heritageBonus > 0 && (
                    <span style={componentStyles.modifierBonus}>
                      +{heritageBonus}
                    </span>
                  )}
                </div>

                <div
                  style={
                    effectiveScore !== null
                      ? componentStyles.abilityModifier
                      : {
                          ...componentStyles.abilityModifier,
                          color: theme.textSecondary,
                        }
                  }
                >
                  {effectiveScore !== null ? (
                    <>
                      {effectiveModifier >= 0 ? "+" : ""}
                      {effectiveModifier}
                      {hasModifier && baseModifier !== effectiveModifier && (
                        <div
                          style={{
                            fontSize: "9px",
                            color: "#8b5cf6",
                            fontWeight: "600",
                          }}
                        >
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

                <div>
                  {isManualMode ? (
                    <div style={componentStyles.manualControls}>
                      <div style={componentStyles.manualButtonRow}>
                        <button
                          onClick={() => handleManualScoreDecrement(ability)}
                          disabled={actualScore <= 1}
                          style={{
                            ...componentStyles.manualButton,
                            backgroundColor:
                              actualScore <= 1 ? theme.border : "#EF4444",
                            color:
                              actualScore <= 1 ? theme.textSecondary : "white",
                            cursor:
                              actualScore <= 1 ? "not-allowed" : "pointer",
                          }}
                        >
                          -
                        </button>

                        <div style={componentStyles.scoreDisplay}>
                          {actualScore}
                        </div>

                        <button
                          onClick={() => handleManualScoreIncrement(ability)}
                          disabled={actualScore >= 40}
                          style={{
                            ...componentStyles.manualButton,
                            backgroundColor:
                              actualScore >= 40 ? theme.border : "#10B981",
                            color:
                              actualScore >= 40 ? theme.textSecondary : "white",
                            cursor:
                              actualScore >= 40 ? "not-allowed" : "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>

                      {score !== null && hasModifier && (
                        <div style={componentStyles.scoreBreakdown}>
                          Base: {actualScore}
                          {featBonus > 0 && ` + Feat: ${featBonus}`}
                          {backgroundBonus > 0 && ` + Bg: ${backgroundBonus}`}
                          {houseBonus > 0 && ` + House: ${houseBonus}`}
                          {heritageBonus > 0 && ` + Heritage: ${heritageBonus}`}
                          {` = ${effectiveScore}`}
                        </div>
                      )}

                      {score !== null && (
                        <button
                          onClick={() => clearStat(ability)}
                          style={componentStyles.trashButton}
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {actualScore !== null ? (
                        <>
                          <div style={componentStyles.abilityScore}>
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
                                  {backgroundBonus > 0 &&
                                    ` + ${backgroundBonus}`}
                                  {houseBonus > 0 && ` + ${houseBonus}`}
                                  {heritageBonus > 0 && ` + ${heritageBonus}`}
                                </div>
                                <div style={componentStyles.effectiveScore}>
                                  = {effectiveScore}
                                </div>
                              </div>
                            ) : (
                              actualScore
                            )}
                          </div>
                          <button
                            onClick={() => clearStat(ability)}
                            style={componentStyles.trashButton}
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
                          style={componentStyles.assignSelect}
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
          }
        )}
      </div>

      {showModifiers &&
        Object.values(totalModifiers).some((mod) => mod > 0) && (
          <div style={componentStyles.bonusesSection}>
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
                .map(([ability, bonus]) => (
                  <span
                    key={ability}
                    style={{
                      fontSize: "11px",
                      padding: "2px 6px",
                      backgroundColor: "#8b5cf6",
                      color: "white",
                      borderRadius: "4px",
                      cursor: "help",
                    }}
                    title={getTooltipText(ability)}
                  >
                    {ability.charAt(0).toUpperCase() + ability.slice(1)} +
                    {bonus}
                  </span>
                ))}
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

export default AbilityScoresSection;
