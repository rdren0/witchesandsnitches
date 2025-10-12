import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, Trash } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBaseStyles } from "../../utils/styles";
import {
  calculateTotalModifiers,
  getAllSelectedFeats,
} from "../../utils/characterUtils";

const ABILITY_ORDER = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

const createAbilityScoreObject = (defaultValue) =>
  ABILITY_ORDER.reduce(
    (acc, ability) => ({ ...acc, [ability]: defaultValue }),
    {}
  );

const formatModifierText = (modifiers) => {
  const { asiBonus, featBonus, backgroundBonus, houseBonus, heritageBonus } =
    modifiers;
  const parts = [];

  if (asiBonus > 0) parts.push(`ASI: ${asiBonus}`);
  if (featBonus > 0) parts.push(`Feat: ${featBonus}`);
  if (backgroundBonus > 0) parts.push(`Bg: ${backgroundBonus}`);
  if (houseBonus > 0) parts.push(`House: ${houseBonus}`);
  if (heritageBonus > 0) parts.push(`Heritage: ${heritageBonus}`);

  return parts.length > 0 ? ` + ${parts.join(" + ")}` : "";
};

const getAbilityModifier = (score) => {
  if (score === null || score === undefined || isNaN(score)) return 0;
  return Math.floor((score - 10) / 2);
};

const DisabledAbilityCard = ({ ability, score, theme }) => (
  <div
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
);

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
  const [manualScores, setManualScores] = useState(createAbilityScoreObject(8));
  const [rolledAssignments, setRolledAssignments] = useState(
    createAbilityScoreObject(null)
  );

  useEffect(() => {
    if (!character.abilityScores) {
      const initialScores = createAbilityScoreObject(null);

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

  const calculateASIModifiers = () => {
    const asiModifiers = createAbilityScoreObject(0);

    if (character.asiChoices) {
      Object.values(character.asiChoices).forEach((choice) => {
        if (choice.type === "asi" && choice.abilityScoreIncreases) {
          choice.abilityScoreIncreases.forEach((increase) => {
            if (increase.ability && increase.increase) {
              asiModifiers[increase.ability] += increase.increase;
            }
          });
        }
      });
    }

    if (character.additionalASI && Array.isArray(character.additionalASI)) {
      character.additionalASI.forEach((asi) => {
        if (
          asi.abilityScoreIncreases &&
          Array.isArray(asi.abilityScoreIncreases)
        ) {
          asi.abilityScoreIncreases.forEach((increase) => {
            if (increase.ability && increase.increase) {
              asiModifiers[increase.ability] += increase.increase;
            }
          });
        }
      });
    }

    return asiModifiers;
  };

  const featChoices = getFeatChoices();
  const houseChoices =
    character.houseChoices && Object.keys(character.houseChoices).length > 0
      ? character.houseChoices
      : character.house_choices || {};
  const heritageChoices =
    character.heritage_choices &&
    Object.keys(character.heritage_choices).length > 0
      ? character.heritage_choices
      : character.heritageChoices || {};

  const calculatedModifiers = showModifiers
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

  const {
    totalModifiers: baseTotalModifiers,
    allDetails: baseAllDetails,
    featModifiers,
    backgroundModifiers,
    houseModifiers,
    heritageModifiers,
  } = calculatedModifiers;

  const asiModifiers = calculateASIModifiers();
  const totalModifiers = {};
  const allDetails = { ...baseAllDetails };

  Object.keys(baseTotalModifiers).forEach((ability) => {
    totalModifiers[ability] =
      baseTotalModifiers[ability] + asiModifiers[ability];

    if (asiModifiers[ability] > 0) {
      if (!allDetails[ability]) {
        allDetails[ability] = [];
      }

      const levelsWithASI = [];
      let levelASICount = 0;
      if (character.asiChoices) {
        Object.entries(character.asiChoices).forEach(([level, choice]) => {
          if (choice.type === "asi" && choice.abilityScoreIncreases) {
            choice.abilityScoreIncreases.forEach((inc) => {
              if (inc.ability === ability) {
                levelsWithASI.push(level);
                levelASICount += inc.increase || 1;
              }
            });
          }
        });
      }

      let additionalASICount = 0;
      if (character.additionalASI && Array.isArray(character.additionalASI)) {
        character.additionalASI.forEach((asi) => {
          if (
            asi.abilityScoreIncreases &&
            Array.isArray(asi.abilityScoreIncreases)
          ) {
            asi.abilityScoreIncreases.forEach((inc) => {
              if (inc.ability === ability) {
                additionalASICount += inc.increase || 1;
              }
            });
          }
        });
      }

      const asiParts = [];
      if (levelASICount > 0) {
        asiParts.push(
          `Level${levelsWithASI.length > 1 ? "s" : ""} ${levelsWithASI.join(
            ", "
          )} (+${levelASICount})`
        );
      }
      if (additionalASICount > 0) {
        asiParts.push(`Additional ASI (+${additionalASICount})`);
      }

      allDetails[ability].push({
        source: "asi",
        amount: asiModifiers[ability],
        levels: levelsWithASI,
        asiName: asiParts.join(", "),
      });
    }
  });

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

    const clearedScores = createAbilityScoreObject(null);

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
      const baseScores = createAbilityScoreObject(null);
      ABILITY_ORDER.forEach((ability) => {
        baseScores[ability] = character.abilityScores?.[ability] || 8;
      });

      setRolledAssignments({ ...character.abilityScores });

      setManualScores(baseScores);

      handleCharacterUpdate({
        ...character,
        abilityScores: baseScores,
      });
    } else {
      if (Object.values(rolledAssignments).some((val) => val !== null)) {
        handleCharacterUpdate({
          ...character,
          abilityScores: rolledAssignments,
        });

        const assignedValues = Object.values(rolledAssignments).filter(
          (val) => val !== null
        );
        const unassignedStats = rolledStats.filter(
          (stat) =>
            !assignedValues.includes(stat) ||
            assignedValues.filter((v) => v === stat).length <
              rolledStats.filter((s) => s === stat).length
        );
        setAvailableStats(unassignedStats);
      } else {
        const clearedScores = createAbilityScoreObject(null);

        handleCharacterUpdate({
          ...character,
          abilityScores: clearedScores,
        });

        setAvailableStats([]);

        if (rolledStats.length === 0) {
          rollAllStats();
        }
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
      asi: [],
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
      } else if (detail.source === "asi") {
        sourceGroups.asi.push(detail);
      }
    });

    const tooltipParts = [];

    if (sourceGroups.asi.length > 0) {
      const asiBonuses = sourceGroups.asi
        .map((d) => `${d.asiName} (+${d.amount})`)
        .join(", ");
      tooltipParts.push(`ASI: ${asiBonuses}`);
    }

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

  useEffect(() => {
    if (mode === "edit" && character.abilityScores) {
      const hasScores = Object.values(character.abilityScores).some(
        (score) => score !== null && score !== undefined
      );
      if (
        hasScores &&
        Object.values(rolledAssignments).every((val) => val === null)
      ) {
        setRolledAssignments({ ...character.abilityScores });
      }
    }
  }, [mode, character.abilityScores, rolledAssignments]);

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
      color: theme.text,
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
      backgroundcolor: theme.text,
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
      color: theme.text,
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
      color: theme.text,
      borderRadius: "4px",
      fontSize: "16px",
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
      color: theme.primary,
    },
    scoreBreakdown: {
      fontSize: "14px",
      color: theme.textSecondary,
      lineHeight: "1.4",
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
      backgroundColor: theme.error,
      color: theme.text,
      padding: "4px 8px",
      marginTop: "8px",
    },
    modifierBonus: {
      color: theme.success,
      fontSize: "10px",
      fontWeight: "bold",
      marginLeft: "2px",
    },
    bonusesSection: {
      background: theme.surface,
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
            {ABILITY_ORDER.map((ability) => (
              <DisabledAbilityCard
                key={ability}
                ability={ability}
                score={character.abilityScores?.[ability] || null}
                theme={theme}
              />
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
            <span style={{ fontSize: "24px", color: theme.textSecondary }}>
              Total: {rolledStats.reduce((sum, stat) => sum + stat, 0)}
              {allStatsAssigned() && (
                <span style={{ color: theme.success, marginLeft: "8px" }}>
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
        {ABILITY_ORDER.map((ability) => {
          const score = character.abilityScores?.[ability] || null;
          const totalBonus = totalModifiers[ability] || 0;
          const featBonus = featModifiers[ability] || 0;
          const backgroundBonus = backgroundModifiers[ability] || 0;
          const houseBonus = houseModifiers[ability] || 0;
          const heritageBonus = heritageModifiers[ability] || 0;
          const asiBonus = asiModifiers[ability] || 0;
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
                {[
                  { value: asiBonus, label: asiBonus },
                  { value: featBonus, label: featBonus },
                  { value: backgroundBonus, label: backgroundBonus },
                  { value: houseBonus, label: houseBonus },
                  { value: heritageBonus, label: heritageBonus },
                ]
                  .filter((mod) => mod.value > 0)
                  .map((mod, index) => (
                    <span key={index} style={componentStyles.modifierBonus}>
                      +{mod.label}
                    </span>
                  ))}
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
                          cursor: actualScore <= 1 ? "not-allowed" : "pointer",
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
                          cursor: actualScore >= 40 ? "not-allowed" : "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>

                    {score !== null && hasModifier && (
                      <div style={componentStyles.scoreBreakdown}>
                        Base: {actualScore}
                        {formatModifierText({
                          asiBonus,
                          featBonus,
                          backgroundBonus,
                          houseBonus,
                          heritageBonus,
                        })}
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
                                  fontSize: "14px",
                                  color: theme.textSecondary,
                                }}
                              >
                                {actualScore}
                                {formatModifierText({
                                  asiBonus,
                                  featBonus,
                                  backgroundBonus,
                                  houseBonus,
                                  heritageBonus,
                                })}
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
        })}
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
                      backgroundColor: theme.primary,
                      color: theme.text,
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
            " • House, feat, background, heritage, and ASI bonuses are automatically added to your base scores"}
        </div>
      )}
    </div>
  );
};

export default AbilityScoresSection;
