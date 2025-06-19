import { RefreshCw, Trash } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createAbilityScorePickerStyles } from "../../../../styles/masterStyles";
import { standardFeats } from "../../../standardFeatData";
import { backgroundsData } from "../../Shared/backgroundsData";
import { getAllSelectedFeats } from "../ASIComponents";
import { houseFeatures } from "../../Shared/houseData";
import { heritageDescriptions } from "../../../data";

const getSpellcastingAbility = (character) => {
  const castingStyle = character.castingStyle;
  const abilityMap = {
    "Grace Caster": "charisma",
    "Vigor Caster": "constitution",
    "Wit Caster": "intelligence",
    "Wisdom Caster": "wisdom",
  };
  return abilityMap[castingStyle] || "intelligence";
};

const calculateHouseModifiers = (character, houseChoices = {}) => {
  const modifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const houseDetails = {};

  if (!character.house || !houseFeatures[character.house]) {
    return { modifiers, houseDetails };
  }

  const houseBonuses = houseFeatures[character.house];

  if (houseBonuses.fixed) {
    houseBonuses.fixed.forEach((ability) => {
      if (modifiers.hasOwnProperty(ability)) {
        modifiers[ability] += 1;

        if (!houseDetails[ability]) {
          houseDetails[ability] = [];
        }
        houseDetails[ability].push({
          source: "house",
          houseName: character.house,
          type: "fixed",
          amount: 1,
        });
      }
    });
  }

  if (houseChoices[character.house]?.abilityChoice) {
    const chosenAbility = houseChoices[character.house].abilityChoice;
    if (modifiers.hasOwnProperty(chosenAbility)) {
      modifiers[chosenAbility] += 1;

      if (!houseDetails[chosenAbility]) {
        houseDetails[chosenAbility] = [];
      }
      houseDetails[chosenAbility].push({
        source: "house",
        houseName: character.house,
        type: "choice",
        amount: 1,
      });
    }
  }

  return { modifiers, houseDetails };
};

const calculateFeatModifiers = (character, featChoices = {}) => {
  const modifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const featDetails = {};

  const allSelectedFeats = getAllSelectedFeats(character);

  if (character.level1ChoiceType === "feat" && character.standardFeats) {
    allSelectedFeats.push(...character.standardFeats);
  }

  const uniqueFeats = [...new Set(allSelectedFeats)];

  uniqueFeats.forEach((featName) => {
    const feat = standardFeats.find((f) => f.name === featName);
    if (!feat?.modifiers?.abilityIncreases) return;

    feat.modifiers.abilityIncreases.forEach((increase, index) => {
      let abilityToIncrease;
      const choiceKey = `${featName}_ability_${index}`;

      switch (increase.type) {
        case "fixed":
          abilityToIncrease = increase.ability;
          break;
        case "choice":
          abilityToIncrease = featChoices[choiceKey] || increase.abilities[0];
          break;
        case "spellcastingAbility":
          abilityToIncrease = getSpellcastingAbility(character);
          break;
        default:
          break;
      }

      if (abilityToIncrease && modifiers.hasOwnProperty(abilityToIncrease)) {
        modifiers[abilityToIncrease] += increase.amount;

        if (!featDetails[abilityToIncrease]) {
          featDetails[abilityToIncrease] = [];
        }
        featDetails[abilityToIncrease].push({
          source: "feat",
          featName,
          amount: increase.amount,
        });
      }
    });
  });

  return { modifiers, featDetails };
};

const calculateBackgroundModifiers = (character) => {
  const modifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const backgroundDetails = {};

  if (!character.background) return { modifiers, backgroundDetails };

  const background = backgroundsData[character.background];
  if (!background?.modifiers?.abilityIncreases)
    return { modifiers, backgroundDetails };

  background.modifiers.abilityIncreases.forEach((increase) => {
    if (
      increase.type === "fixed" &&
      modifiers.hasOwnProperty(increase.ability)
    ) {
      modifiers[increase.ability] += increase.amount;

      if (!backgroundDetails[increase.ability]) {
        backgroundDetails[increase.ability] = [];
      }
      backgroundDetails[increase.ability].push({
        source: "background",
        backgroundName: background.name,
        amount: increase.amount,
      });
    }
  });

  return { modifiers, backgroundDetails };
};

// Utility functions to check for modifiers at multiple levels
const checkForModifiers = (obj, type = "abilityIncreases") => {
  const results = [];

  // Level 1: Direct modifiers
  if (obj?.modifiers?.[type]) {
    results.push(...obj.modifiers[type]);
  }

  // Level 2: Data nested modifiers (common pattern)
  if (obj?.data?.modifiers?.[type]) {
    results.push(...obj.data.modifiers[type]);
  }

  // Level 3: Benefits/features nested modifiers
  if (obj?.benefits?.modifiers?.[type]) {
    results.push(...obj.benefits.modifiers[type]);
  }

  // Level 4: Nested in properties
  if (obj?.properties?.modifiers?.[type]) {
    results.push(...obj.properties.modifiers[type]);
  }

  return results;
};

// Simple utility for ability choices
const checkForAbilityChoices = (obj) => {
  const choices = [];

  // Direct ability choice (most common pattern in your data)
  if (obj?.abilityChoice) {
    choices.push({
      ability: obj.abilityChoice,
      amount: obj.amount || 1,
      type: "choice",
    });
  }

  // Nested in data
  if (obj?.data?.abilityChoice) {
    choices.push({
      ability: obj.data.abilityChoice,
      amount: obj.data.amount || 1,
      type: "choice",
    });
  }

  // Nested in properties
  if (obj?.properties?.abilityChoice) {
    choices.push({
      ability: obj.properties.abilityChoice,
      amount: obj.properties.amount || 1,
      type: "choice",
    });
  }

  // Debug logging to see what we're finding
  if (choices.length > 0) {
    console.log("checkForAbilityChoices found:", choices, "in object:", obj);
  }

  return choices;
};

const calculateHeritageModifiers = (character, heritageChoices = {}) => {
  const modifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const heritageDetails = {};

  if (!character.innateHeritage) {
    return { modifiers, heritageDetails };
  }

  const heritage = heritageDescriptions[character.innateHeritage];
  if (!heritage) return { modifiers, heritageDetails };

  // Check for ability increases at multiple levels
  const abilityIncreases = checkForModifiers(heritage, "abilityIncreases");

  abilityIncreases.forEach((increase) => {
    if (
      increase.type === "fixed" &&
      modifiers.hasOwnProperty(increase.ability)
    ) {
      modifiers[increase.ability] += increase.amount;

      if (!heritageDetails[increase.ability]) {
        heritageDetails[increase.ability] = [];
      }
      heritageDetails[increase.ability].push({
        source: "heritage",
        heritageName: character.innateHeritage,
        type: "fixed",
        amount: increase.amount,
      });
    }
  });

  // Handle feature choices with multi-level checking
  if (heritage.features && heritageChoices[character.innateHeritage]) {
    heritage.features.forEach((feature) => {
      if (feature.isChoice && feature.options) {
        const selectedChoiceName =
          heritageChoices[character.innateHeritage][feature.name];
        const selectedChoice = feature.options.find(
          (opt) => opt.name === selectedChoiceName
        );

        if (selectedChoice) {
          // Check for ability choices at multiple levels
          const abilityChoices = checkForAbilityChoices(selectedChoice);

          abilityChoices.forEach(({ ability, amount }) => {
            if (modifiers.hasOwnProperty(ability)) {
              modifiers[ability] += amount;

              if (!heritageDetails[ability]) {
                heritageDetails[ability] = [];
              }
              heritageDetails[ability].push({
                source: "heritage",
                heritageName: character.innateHeritage,
                type: "choice",
                amount: amount,
              });
            }
          });

          // Also check for nested ability increases in the choice
          const choiceAbilityIncreases = checkForModifiers(
            selectedChoice,
            "abilityIncreases"
          );

          choiceAbilityIncreases.forEach((increase) => {
            if (modifiers.hasOwnProperty(increase.ability)) {
              modifiers[increase.ability] += increase.amount;

              if (!heritageDetails[increase.ability]) {
                heritageDetails[increase.ability] = [];
              }
              heritageDetails[increase.ability].push({
                source: "heritage",
                heritageName: character.innateHeritage,
                type: "choice",
                amount: increase.amount,
              });
            }
          });
        }
      }
    });
  }

  return { modifiers, heritageDetails };
};

const calculateTotalModifiers = (
  character,
  featChoices = {},
  houseChoices = {},
  heritageChoices = {}
) => {
  const featResult = calculateFeatModifiers(character, featChoices);
  const backgroundResult = calculateBackgroundModifiers(character);
  const houseResult = calculateHouseModifiers(character, houseChoices);
  const heritageResult = calculateHeritageModifiers(character, heritageChoices);

  const totalModifiers = {
    strength:
      featResult.modifiers.strength +
      backgroundResult.modifiers.strength +
      houseResult.modifiers.strength +
      heritageResult.modifiers.strength,
    dexterity:
      featResult.modifiers.dexterity +
      backgroundResult.modifiers.dexterity +
      houseResult.modifiers.dexterity +
      heritageResult.modifiers.dexterity,
    constitution:
      featResult.modifiers.constitution +
      backgroundResult.modifiers.constitution +
      houseResult.modifiers.constitution +
      heritageResult.modifiers.constitution,
    intelligence:
      featResult.modifiers.intelligence +
      backgroundResult.modifiers.intelligence +
      houseResult.modifiers.intelligence +
      heritageResult.modifiers.intelligence,
    wisdom:
      featResult.modifiers.wisdom +
      backgroundResult.modifiers.wisdom +
      houseResult.modifiers.wisdom +
      heritageResult.modifiers.wisdom,
    charisma:
      featResult.modifiers.charisma +
      backgroundResult.modifiers.charisma +
      houseResult.modifiers.charisma +
      heritageResult.modifiers.charisma,
  };

  const allDetails = {};
  Object.keys(totalModifiers).forEach((ability) => {
    allDetails[ability] = [
      ...(featResult.featDetails[ability] || []),
      ...(backgroundResult.backgroundDetails[ability] || []),
      ...(houseResult.houseDetails[ability] || []),
      ...(heritageResult.heritageDetails[ability] || []),
    ];
  });

  return {
    totalModifiers,
    allDetails,
    featModifiers: featResult.modifiers,
    backgroundModifiers: backgroundResult.modifiers,
    houseModifiers: houseResult.modifiers,
    heritageModifiers: heritageResult.modifiers,
  };
};

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

    return details
      .map((detail) => {
        if (detail.source === "feat") {
          return `+${detail.amount} from ${detail.featName}`;
        } else if (detail.source === "background") {
          return `+${detail.amount} from ${detail.backgroundName} background`;
        } else if (detail.source === "house") {
          return `+${detail.amount} from ${detail.houseName} (${detail.type})`;
        } else if (detail.source === "heritage") {
          return `+${detail.amount} from ${detail.heritageName} heritage (${detail.type})`;
        }
        return `+${detail.amount}`;
      })
      .join(", ");
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
          ? "Manual input mode - enter base ability scores directly (1-30)"
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
          const effectiveScore = score !== null ? score + totalBonus : null;
          const hasModifier = totalBonus > 0;
          const hasFeatModifier = featBonus > 0;
          const hasBackgroundModifier = backgroundBonus > 0;
          const hasHouseModifier = houseBonus > 0;
          const hasHeritageModifier = heritageBonus > 0;
          const baseModifier = getAbilityModifier(score);
          const effectiveModifier = getEffectiveModifier(ability);
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
                  score !== null
                    ? hasModifier
                      ? cardStyle.backgroundColor
                      : `${theme.success || "#10B981"}20`
                    : theme.surface,
                borderColor:
                  score !== null
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

              {/* Show effective modifier prominently */}
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
                        ...enhancedStyles.input,
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
                    {/* Show breakdown for manual mode */}
                    {score !== null && hasModifier && (
                      <div style={enhancedStyles.scoreBreakdown}>
                        Base: {score}
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
                        style={enhancedStyles.trashButton}
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
                        <div style={enhancedStyles.abilityScore}>
                          {hasModifier ? (
                            <div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: theme.textSecondary,
                                }}
                              >
                                {score}
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
                            score
                          )}
                        </div>
                        <button
                          onClick={() => clearStat(ability)}
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
                          assignStat(ability, parseInt(e.target.value))
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

      {/* Show modifier summary */}
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
                .filter(([_, bonus]) => bonus > 0)
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
          💡 Tip: Press Enter to confirm a value, Escape to cancel. Valid range:
          1-30
          {showModifiers &&
            " • House, feat, background, and heritage bonuses are automatically added to your base scores"}
        </div>
      )}
    </div>
  );
};

export default AbilityScorePicker;
