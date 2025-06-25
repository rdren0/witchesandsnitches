import { useState, useEffect } from "react";
import {
  innateHeritages,
  heritageDescriptions,
} from "../../SharedData/heritageData";
import { createFeatStyles } from "../../../styles/masterStyles";
import { useTheme } from "../../../contexts/ThemeContext";

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

  return choices;
};

// Simple utility for skill proficiencies at multiple levels
const checkForSkillProficiencies = (obj) => {
  const skills = [];

  // Level 1: Direct modifiers
  if (obj?.modifiers?.skillProficiencies) {
    skills.push(...obj.modifiers.skillProficiencies);
  }

  // Level 2: Direct skill proficiencies
  if (obj?.skillProficiencies && Array.isArray(obj.skillProficiencies)) {
    skills.push(...obj.skillProficiencies);
  }

  // Level 3: Data nested
  if (obj?.data?.modifiers?.skillProficiencies) {
    skills.push(...obj.data.modifiers.skillProficiencies);
  }

  if (
    obj?.data?.skillProficiencies &&
    Array.isArray(obj.data.skillProficiencies)
  ) {
    skills.push(...obj.data.skillProficiencies);
  }

  // Level 4: Properties nested
  if (obj?.properties?.modifiers?.skillProficiencies) {
    skills.push(...obj.properties.modifiers.skillProficiencies);
  }

  if (
    obj?.properties?.skillProficiencies &&
    Array.isArray(obj.properties.skillProficiencies)
  ) {
    skills.push(...obj.properties.skillProficiencies);
  }

  return skills;
};

const calculateHeritageModifiers = (selectedHeritage, heritageChoices = {}) => {
  const modifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const bonusDetails = {};

  if (!selectedHeritage || !heritageDescriptions[selectedHeritage]) {
    return { modifiers, bonusDetails };
  }

  const heritage = heritageDescriptions[selectedHeritage];

  // Check for ability increases at multiple levels
  const abilityIncreases = checkForModifiers(heritage, "abilityIncreases");

  abilityIncreases.forEach((increase) => {
    if (
      increase.type === "fixed" &&
      modifiers.hasOwnProperty(increase.ability)
    ) {
      modifiers[increase.ability] += increase.amount;

      if (!bonusDetails[increase.ability]) {
        bonusDetails[increase.ability] = [];
      }
      bonusDetails[increase.ability].push({
        source: `${selectedHeritage} (Heritage)`,
        amount: increase.amount,
      });
    }
  });

  // Handle feature choices with multi-level checking
  if (heritage.features && heritageChoices[selectedHeritage]) {
    heritage.features.forEach((feature) => {
      if (feature.isChoice && feature.options) {
        const selectedChoiceName =
          heritageChoices[selectedHeritage][feature.name];
        const selectedChoice = feature.options.find(
          (opt) => opt.name === selectedChoiceName
        );

        if (selectedChoice) {
          // Check for ability choices at multiple levels
          const abilityChoices = checkForAbilityChoices(selectedChoice);

          abilityChoices.forEach(({ ability, amount }) => {
            if (modifiers.hasOwnProperty(ability)) {
              modifiers[ability] += amount;

              if (!bonusDetails[ability]) {
                bonusDetails[ability] = [];
              }
              bonusDetails[ability].push({
                source: `${selectedHeritage} (${selectedChoiceName})`,
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

              if (!bonusDetails[increase.ability]) {
                bonusDetails[increase.ability] = [];
              }
              bonusDetails[increase.ability].push({
                source: `${selectedHeritage} (${selectedChoiceName})`,
                amount: increase.amount,
              });
            }
          });
        }
      }
    });
  }

  return { modifiers, bonusDetails };
};

const HeritageAbilityModifierPills = ({
  heritage,
  heritageChoices,
  styles,
}) => {
  const { modifiers, bonusDetails } = calculateHeritageModifiers(
    heritage,
    heritageChoices
  );

  const modifiedAbilities = Object.entries(modifiers).filter(
    ([_, value]) => value > 0
  );

  if (modifiedAbilities.length === 0) return null;

  return (
    <div style={styles.modifierPillsContainer}>
      <div style={styles.pillsLabel}>Heritage Ability Score Bonuses:</div>
      <div style={styles.pillsRow}>
        {modifiedAbilities.map(([ability, totalBonus]) => {
          const details = bonusDetails[ability] || [];
          const tooltipText = details
            .map((d) => `+${d.amount} from ${d.source}`)
            .join(", ");

          return (
            <div key={ability} style={styles.modifierPill} title={tooltipText}>
              <span style={styles.pillAbility}>
                {ability.slice(0, 3).toUpperCase()}
              </span>
              <span style={styles.pillModifier}>+{totalBonus}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HeritageChoiceSelector = ({
  heritage,
  heritageData,
  heritageChoices,
  onHeritageChoiceSelect,
  isSelected,
  styles,
  theme,
}) => {
  if (!heritage || !heritageData?.features || !isSelected) return null;

  const choiceFeatures = heritageData.features.filter(
    (feature) => feature.isChoice
  );

  if (choiceFeatures.length === 0) return null;

  const handleChoiceChange = (featureName, choiceName) => {
    onHeritageChoiceSelect(heritage, featureName, choiceName);
  };

  const isChoiceSelected = (featureName, choiceName) => {
    return heritageChoices[heritage]?.[featureName] === choiceName;
  };

  return (
    <div style={{ marginTop: "12px" }}>
      {choiceFeatures.map((feature, featureIndex) => {
        const currentChoice = heritageChoices[heritage]?.[feature.name];

        return (
          <div key={featureIndex} style={styles.heritageChoiceContainer}>
            <div style={styles.heritageChoiceLabel}>{feature.description}:</div>

            {feature.options.map((option, optionIndex) => {
              const isOptionSelected = isChoiceSelected(
                feature.name,
                option.name
              );
              return (
                <div key={optionIndex} style={styles.choiceOption}>
                  <label style={styles.choiceLabel}>
                    <input
                      type="radio"
                      name={`${heritage}_${feature.name}`}
                      value={option.name}
                      checked={isOptionSelected}
                      onChange={(e) =>
                        handleChoiceChange(feature.name, e.target.value)
                      }
                      style={styles.choiceRadio}
                    />
                    <div style={styles.choiceContent}>
                      <div style={styles.choiceName}>{option.name}</div>
                      <div style={styles.choiceDescription}>
                        {option.description}
                      </div>

                      {/* Show what this choice grants - check multiple levels */}
                      {checkForSkillProficiencies(option).length > 0 && (
                        <div style={styles.choiceBenefits}>
                          <strong>Skills:</strong>{" "}
                          {checkForSkillProficiencies(option).join(", ")}
                        </div>
                      )}
                      {(option.toolProficiencies ||
                        option.data?.toolProficiencies ||
                        option.properties?.toolProficiencies) && (
                        <div style={styles.choiceBenefits}>
                          <strong>Tools:</strong>{" "}
                          {(
                            option.toolProficiencies ||
                            option.data?.toolProficiencies ||
                            option.properties?.toolProficiencies ||
                            []
                          ).join(", ")}
                        </div>
                      )}
                      {checkForAbilityChoices(option).length > 0 && (
                        <div style={styles.choiceBenefits}>
                          <strong>Ability:</strong>{" "}
                          {checkForAbilityChoices(option).map((choice, idx) => (
                            <span key={idx}>
                              +{choice.amount}{" "}
                              {choice.ability.charAt(0).toUpperCase() +
                                choice.ability.slice(1)}
                              {idx < checkForAbilityChoices(option).length - 1
                                ? ", "
                                : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              );
            })}

            {!currentChoice && (
              <div style={styles.choiceRequired}>
                ⚠️ Please select an option for {feature.name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const applyHeritageProficiencies = (
  character,
  heritageName,
  heritageChoices = {}
) => {
  if (!heritageName || !heritageDescriptions[heritageName]) {
    return {
      ...character,
      innateHeritage: "",
      skillProficiencies: removeHeritageProficiencies(
        character.skillProficiencies || [],
        character.innateHeritage
      ),
      innateHeritageSkills: [],
    };
  }

  const heritage = heritageDescriptions[heritageName];
  const currentSkillProficiencies = character.skillProficiencies || [];

  const cleanedSkillProficiencies = removeHeritageProficiencies(
    currentSkillProficiencies,
    character.innateHeritage
  );

  // Check for skill proficiencies at multiple levels
  const newHeritageSkills = checkForSkillProficiencies(heritage);

  const choiceSkills = [];
  if (heritage.features && heritageChoices[heritageName]) {
    heritage.features.forEach((feature) => {
      if (feature.isChoice && feature.options) {
        const selectedChoiceName = heritageChoices[heritageName][feature.name];
        const selectedChoice = feature.options.find(
          (opt) => opt.name === selectedChoiceName
        );

        if (selectedChoice) {
          const choiceSkillProfs = checkForSkillProficiencies(selectedChoice);
          choiceSkills.push(...choiceSkillProfs);
        }
      }
    });
  }

  const allHeritageSkills = [...newHeritageSkills, ...choiceSkills];
  const newSkillProficiencies = [
    ...cleanedSkillProficiencies,
    ...allHeritageSkills,
  ];

  return {
    ...character,
    innateHeritage: heritageName,
    skillProficiencies: [...new Set(newSkillProficiencies)],
    innateHeritageSkills: allHeritageSkills,
  };
};

const removeHeritageProficiencies = (currentProficiencies, heritageName) => {
  if (!heritageName || !heritageDescriptions[heritageName]) {
    return currentProficiencies;
  }

  const heritage = heritageDescriptions[heritageName];

  // Check for heritage skills at multiple levels
  const heritageSkills = checkForSkillProficiencies(heritage);

  return currentProficiencies.filter(
    (skill) => !heritageSkills.includes(skill)
  );
};

export const InnateHeritage = ({
  character,
  handleInputChange,
  isEditing = false,
  heritageChoices = {},
  onHeritageChoicesChange,
}) => {
  const { theme } = useTheme();
  const styles = createFeatStyles(theme);
  const [expandedHeritages, setExpandedHeritages] = useState(new Set());
  const [heritageFilter, setHeritageFilter] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [pendingHeritage, setPendingHeritage] = useState("");

  const isHigherLevel = character.level > 1;
  const shouldShowLevelWarning = isHigherLevel && isEditing;
  const hasSelectedHeritage = character.innateHeritage ? 1 : 0;

  const enhancedStyles = {
    ...styles,
    modifierPillsContainer: {
      backgroundColor: "rgba(139, 92, 246, 0.1)",
      border: "1px solid rgba(139, 92, 246, 0.3)",
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "16px",
    },
    pillsLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#8b5cf6",
      marginBottom: "8px",
    },
    pillsRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    modifierPill: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      backgroundColor: "#8b5cf6",
      color: "white",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "11px",
      fontWeight: "600",
      cursor: "help",
    },
    pillAbility: {
      opacity: 0.9,
    },
    pillModifier: {
      fontWeight: "bold",
    },
    heritageChoiceContainer: {
      backgroundColor: theme.surfaceHover,
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      padding: "12px",
      marginBottom: "12px",
    },
    heritageChoiceLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
    },
    choiceOption: {
      marginBottom: "8px",
    },
    choiceLabel: {
      display: "flex",
      cursor: "pointer",
    },
    choiceContent: {
      // display: "flex",
      // width: "60%",
      alignItems: "flex-start",
      gap: "8px",
      padding: "8px",
      borderRadius: "4px",
      // border: `1px solid ${theme.border}`,
      transition: "all 0.2s ease",
    },
    choiceName: {
      fontSize: "12px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "2px",
    },
    choiceDescription: {
      fontSize: "11px",
      color: theme.textSecondary,
      lineHeight: "1.3",
      marginBottom: "4px",
    },
    choiceBenefits: {
      fontSize: "10px",
      color: "#8b5cf6",
      marginTop: "2px",
    },
    choiceRadio: {
      marginTop: "2px",
      accentColor: "#8b5cf6",
    },
    choiceRequired: {
      fontSize: "11px",
      color: theme.warning,
      fontStyle: "italic",
      marginTop: "4px",
    },
  };

  useEffect(() => {
    if (character.innateHeritage && character.innateHeritage.trim() !== "") {
      setExpandedHeritages((prev) => {
        const newSet = new Set(prev);
        newSet.add(character.innateHeritage);
        return newSet;
      });
    }
  }, [character.innateHeritage]);

  const toggleHeritageExpansion = (heritageName) => {
    setExpandedHeritages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(heritageName)) {
        newSet.delete(heritageName);
      } else {
        newSet.add(heritageName);
      }
      return newSet;
    });
  };

  const getFilteredHeritages = () => {
    if (hasSelectedHeritage === 1) {
      return innateHeritages.filter(
        (heritage) => heritage === character.innateHeritage
      );
    }

    if (!heritageFilter.trim()) return innateHeritages;

    const searchTerm = heritageFilter.toLowerCase();
    return innateHeritages.filter((heritage) => {
      const heritageData = heritageDescriptions[heritage];
      return (
        heritage.toLowerCase().includes(searchTerm) ||
        heritageData?.description?.toLowerCase().includes(searchTerm)
      );
    });
  };

  const handleHeritageToggle = (heritageName) => {
    const newValue =
      character.innateHeritage === heritageName ? "" : heritageName;

    if (shouldShowLevelWarning && newValue !== character.innateHeritage) {
      setPendingHeritage(newValue);
      setShowWarning(true);
      return;
    }

    const updatedCharacter = applyHeritageProficiencies(
      character,
      newValue,
      heritageChoices
    );

    handleInputChange("innateHeritage", updatedCharacter.innateHeritage);
    handleInputChange(
      "skillProficiencies",
      updatedCharacter.skillProficiencies
    );
    handleInputChange(
      "innateHeritageSkills",
      updatedCharacter.innateHeritageSkills
    );

    if (!newValue && onHeritageChoicesChange) {
      const newChoices = { ...heritageChoices };
      delete newChoices[character.innateHeritage];
      onHeritageChoicesChange(newChoices);
    }
  };

  const handleHeritageChoiceSelect = (heritage, featureName, choiceName) => {
    if (!onHeritageChoicesChange) return;

    const newChoices = {
      ...heritageChoices,
      [heritage]: {
        ...heritageChoices[heritage],
        [featureName]: choiceName,
      },
    };

    onHeritageChoicesChange(newChoices);

    const updatedCharacter = applyHeritageProficiencies(
      character,
      heritage,
      newChoices
    );
    handleInputChange(
      "skillProficiencies",
      updatedCharacter.skillProficiencies
    );
    handleInputChange(
      "innateHeritageSkills",
      updatedCharacter.innateHeritageSkills
    );
  };

  const confirmChange = () => {
    const updatedCharacter = applyHeritageProficiencies(
      character,
      pendingHeritage,
      heritageChoices
    );

    handleInputChange("innateHeritage", updatedCharacter.innateHeritage);
    handleInputChange(
      "skillProficiencies",
      updatedCharacter.skillProficiencies
    );
    handleInputChange(
      "innateHeritageSkills",
      updatedCharacter.innateHeritageSkills
    );

    setShowWarning(false);
    setPendingHeritage("");
  };

  const getRequiredChoices = (heritageData) => {
    if (!heritageData?.features)
      return { total: 0, missing: [], isComplete: true };

    const choiceFeatures = heritageData.features.filter(
      (feature) => feature.isChoice
    );
    const missingChoices = choiceFeatures.filter(
      (feature) => !heritageChoices[character.innateHeritage]?.[feature.name]
    );

    return {
      total: choiceFeatures.length,
      missing: missingChoices.map((f) => f.name),
      isComplete: missingChoices.length === 0,
    };
  };

  const filteredHeritages = getFilteredHeritages();
  const selectedHeritageData = character.innateHeritage
    ? heritageDescriptions[character.innateHeritage]
    : null;
  const choiceStatus = selectedHeritageData
    ? getRequiredChoices(selectedHeritageData)
    : { total: 0, missing: [], isComplete: true };

  return (
    <div style={enhancedStyles.fieldContainer}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <h3 style={enhancedStyles.skillsHeader}>
          Innate Heritage ({hasSelectedHeritage}/1 selected)
          {character.innateHeritage && !choiceStatus.isComplete && (
            <span
              style={{
                color: theme.warning,
                fontSize: "14px",
                marginLeft: "8px",
              }}
            >
              - {choiceStatus.missing.length} Choice
              {choiceStatus.missing.length > 1 ? "s" : ""} Required
            </span>
          )}
        </h3>
        {shouldShowLevelWarning && (
          <div style={enhancedStyles.warningBadge}>
            ⚠️ Editing Level {character.level} Character
          </div>
        )}
      </div>

      {shouldShowLevelWarning && (
        <div style={enhancedStyles.levelRestrictionWarning}>
          <strong>⚠️ Editing Existing Character:</strong> You are modifying the
          Innate Heritage of an existing Level {character.level} character.
          Heritage is typically established during character creation. This
          change may require DM approval and could affect character balance.
        </div>
      )}

      {/* Heritage Modifier Pills */}
      {character.innateHeritage && (
        <HeritageAbilityModifierPills
          heritage={character.innateHeritage}
          heritageChoices={heritageChoices}
          styles={enhancedStyles}
        />
      )}

      {hasSelectedHeritage < 1 && (
        <div style={enhancedStyles.featFilterContainer}>
          <input
            type="text"
            placeholder="Search heritages by name or description..."
            value={heritageFilter}
            onChange={(e) => setHeritageFilter(e.target.value)}
            style={enhancedStyles.featFilterInput}
            onFocus={(e) => {
              e.target.style.borderColor = "#8b5cf6";
              e.target.style.boxShadow =
                "inset 0 2px 6px rgba(139, 92, 246, 0.2), 0 0 0 3px rgba(139, 92, 246, 0.3)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#8b5cf6";
              e.target.style.boxShadow =
                "inset 0 2px 6px rgba(139, 92, 246, 0.2), 0 2px 4px rgba(0,0,0,0.1)";
            }}
          />
          {heritageFilter.trim() && (
            <button
              onClick={() => setHeritageFilter("")}
              style={enhancedStyles.featFilterClearButton}
              type="button"
              title="Clear search"
            >
              ×
            </button>
          )}
          {heritageFilter.trim() && (
            <div style={enhancedStyles.featFilterResults}>
              Showing {filteredHeritages.length} of {innateHeritages.length}{" "}
              heritages
            </div>
          )}
        </div>
      )}

      {hasSelectedHeritage === 1 && choiceStatus.isComplete && (
        <div style={enhancedStyles.completionMessage}>
          ✓ Heritage selected: {character.innateHeritage}
          {choiceStatus.total > 0 &&
            ` with ${choiceStatus.total} choice${
              choiceStatus.total > 1 ? "s" : ""
            } made`}
        </div>
      )}

      {hasSelectedHeritage === 1 && !choiceStatus.isComplete && (
        <div style={enhancedStyles.warningContainer}>
          ⚠️ Please make {choiceStatus.missing.length} more choice
          {choiceStatus.missing.length > 1 ? "s" : ""} to complete your heritage
          selection: {choiceStatus.missing.join(", ")}
        </div>
      )}

      <div style={enhancedStyles.featsContainer}>
        {filteredHeritages.length === 0 ? (
          <div style={enhancedStyles.noFeatsFound}>
            No heritages found matching "{heritageFilter}". Try a different
            search term.
          </div>
        ) : (
          filteredHeritages.map((heritage) => {
            const isSelected = character.innateHeritage === heritage;
            const heritageData = heritageDescriptions[heritage];
            const isExpanded = expandedHeritages.has(heritage);

            return (
              <div
                key={heritage}
                style={
                  isSelected
                    ? enhancedStyles.featCardSelected
                    : enhancedStyles.featCard
                }
              >
                <div style={enhancedStyles.featHeader}>
                  <label style={enhancedStyles.featLabelClickable}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleHeritageToggle(heritage)}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "8px",
                        cursor: "pointer",
                        accentColor: "#8B5CF6",
                        transform: "scale(1.2)",
                      }}
                    />
                    <span
                      style={
                        isSelected
                          ? enhancedStyles.featNameSelected
                          : enhancedStyles.featName
                      }
                    >
                      {heritage}
                      {heritageData?.features?.filter((f) => f.isChoice)
                        .length > 0 && (
                        <span style={enhancedStyles.availableChoicesIndicator}>
                          (
                          {
                            heritageData.features.filter((f) => f.isChoice)
                              .length
                          }{" "}
                          choice
                          {heritageData.features.filter((f) => f.isChoice)
                            .length > 1
                            ? "s"
                            : ""}{" "}
                          available)
                        </span>
                      )}
                    </span>
                  </label>
                  <button
                    onClick={() => toggleHeritageExpansion(heritage)}
                    style={enhancedStyles.expandButton}
                    type="button"
                  >
                    {isExpanded ? "▲" : "▼"}
                  </button>
                </div>

                <div
                  style={
                    isSelected
                      ? enhancedStyles.featPreviewSelected
                      : enhancedStyles.featPreview
                  }
                >
                  {heritageData?.description || "No preview available."}
                </div>

                {/* Heritage Choice Selector */}
                {isSelected && (
                  <HeritageChoiceSelector
                    heritage={heritage}
                    heritageData={heritageData}
                    heritageChoices={heritageChoices}
                    onHeritageChoiceSelect={handleHeritageChoiceSelect}
                    isSelected={isSelected}
                    styles={enhancedStyles}
                    theme={theme}
                  />
                )}

                {isExpanded && (
                  <div
                    style={
                      isSelected
                        ? enhancedStyles.featDescriptionSelected
                        : enhancedStyles.featDescription
                    }
                  >
                    <ul>
                      {heritageData?.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      )) || "No description available."}
                    </ul>

                    {/* Skill Proficiencies */}
                    {!!heritageData?.modifiers?.skillProficiencies.length && (
                      <div style={{ marginBottom: "16px" }}>
                        <h5
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: isSelected ? "#047857" : theme.text,
                          }}
                        >
                          Skill Proficiencies:
                        </h5>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "6px",
                          }}
                        >
                          {heritageData?.modifiers?.skillProficiencies.map(
                            (skill, index) => (
                              <span
                                key={index}
                                style={{
                                  fontSize: "12px",
                                  padding: "4px 8px",
                                  backgroundColor: isSelected
                                    ? "#10B98120"
                                    : theme.primary + "20",
                                  color: isSelected ? "#047857" : theme.primary,
                                  borderRadius: "12px",
                                  border: `1px solid ${
                                    isSelected ? "#10B981" : theme.primary
                                  }`,
                                }}
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Show base skill proficiencies */}
                    {checkForSkillProficiencies(heritageData).length > 0 && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "8px",
                          backgroundColor: "rgba(34, 197, 94, 0.1)",
                          borderRadius: "4px",
                          border: "1px solid rgba(34, 197, 94, 0.3)",
                        }}
                      >
                        <strong style={{ color: "#22c55e" }}>
                          Skill Proficiencies:
                        </strong>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "6px",
                            marginTop: "4px",
                          }}
                        >
                          {checkForSkillProficiencies(heritageData).map(
                            (skill, index) => (
                              <span
                                key={index}
                                style={{
                                  fontSize: "12px",
                                  padding: "4px 8px",
                                  backgroundColor: "#22c55e20",
                                  color: "#22c55e",
                                  borderRadius: "12px",
                                  border: "1px solid #22c55e",
                                }}
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Show base tool proficiencies */}
                    {(heritageData?.modifiers?.other
                      ?.artisanalToolProficiency ||
                      heritageData?.modifiers?.other
                        ?.musicalInstrumentProficiency ||
                      (heritageData?.benefits &&
                        heritageData.benefits.some(
                          (benefit) =>
                            benefit
                              .toLowerCase()
                              .includes("tool proficiency") ||
                            benefit.toLowerCase().includes("artisanal tool") ||
                            benefit.toLowerCase().includes("musical instrument")
                        ))) && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "8px",
                          backgroundColor: "rgba(168, 85, 247, 0.1)",
                          borderRadius: "4px",
                          border: "1px solid rgba(168, 85, 247, 0.3)",
                        }}
                      >
                        <strong style={{ color: "#a855f7" }}>
                          Tool Proficiencies:
                        </strong>
                        <ul
                          style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}
                        >
                          {heritageData?.modifiers?.other
                            ?.artisanalToolProficiency && (
                            <li style={{ fontSize: "12px", color: "#a855f7" }}>
                              One Artisanal tool of your choice
                            </li>
                          )}
                          {heritageData?.modifiers?.other
                            ?.musicalInstrumentProficiency && (
                            <li style={{ fontSize: "12px", color: "#a855f7" }}>
                              One Musical Instrument of your choice
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Show other special abilities */}
                    {!!heritageData?.modifiers?.other.length &&
                      Object.keys(heritageData.modifiers.other).length > 0 && (
                        <div
                          style={{
                            marginTop: "8px",
                            padding: "8px",
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                            borderRadius: "4px",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                          }}
                        >
                          <strong style={{ color: "#3b82f6" }}>
                            Special Abilities:
                          </strong>
                          <ul
                            style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}
                          >
                            {heritageData.modifiers.other.speedBonus && (
                              <li
                                style={{ fontSize: "12px", color: "#3b82f6" }}
                              >
                                +{heritageData.modifiers.other.speedBonus}ft
                                walking speed
                              </li>
                            )}
                            {heritageData.modifiers.other.darkvision && (
                              <li
                                style={{ fontSize: "12px", color: "#3b82f6" }}
                              >
                                Darkvision{" "}
                                {heritageData.modifiers.other.darkvision}ft
                              </li>
                            )}
                            {heritageData.modifiers.other.naturalWeapons && (
                              <li
                                style={{ fontSize: "12px", color: "#3b82f6" }}
                              >
                                Natural weapons (hooves, claws, etc.)
                              </li>
                            )}
                            {heritageData.modifiers.other.druidcraftCantrip && (
                              <li
                                style={{ fontSize: "12px", color: "#3b82f6" }}
                              >
                                Druidcraft cantrip (at will, no wand)
                              </li>
                            )}
                            {heritageData.modifiers.other
                              .speakWithPlantsSpell && (
                              <li
                                style={{ fontSize: "12px", color: "#3b82f6" }}
                              >
                                Speak with Plants (1/long rest)
                              </li>
                            )}
                            {heritageData.modifiers.other.sizeSmall && (
                              <li
                                style={{ fontSize: "12px", color: "#3b82f6" }}
                              >
                                Small size
                              </li>
                            )}
                            {heritageData.modifiers.other.heftyBuild && (
                              <li
                                style={{ fontSize: "12px", color: "#3b82f6" }}
                              >
                                Counts as one size larger for carrying capacity
                              </li>
                            )}
                            {heritageData.modifiers.other.poisonResistance && (
                              <li
                                style={{ fontSize: "12px", color: "#3b82f6" }}
                              >
                                Poison resistance
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Show fixed modifiers - check multiple levels */}
                    {checkForModifiers(heritageData, "abilityIncreases").filter(
                      (increase) => increase.type === "fixed"
                    ).length > 0 && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "8px",
                          backgroundColor: "rgba(139, 92, 246, 0.1)",
                          borderRadius: "4px",
                          border: "1px solid rgba(139, 92, 246, 0.3)",
                        }}
                      >
                        <strong style={{ color: "#8b5cf6" }}>
                          Fixed Ability Increases:
                        </strong>
                        <ul
                          style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}
                        >
                          {checkForModifiers(heritageData, "abilityIncreases")
                            .filter((increase) => increase.type === "fixed")
                            .map((increase, index) => (
                              <li
                                key={index}
                                style={{ fontSize: "12px", color: "#8b5cf6" }}
                              >
                                +{increase.amount}{" "}
                                {increase.ability.charAt(0).toUpperCase() +
                                  increase.ability.slice(1)}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div style={enhancedStyles.helpText}>
        Note: Innate Heritage is optional and represents your character's
        magical bloodline or supernatural ancestry. Some heritages require
        additional choices to customize their benefits.
        {isEditing
          ? " Modifying heritage for existing characters may require DM approval."
          : " Heritage can be selected during character creation at any level."}
      </div>

      {showWarning && (
        <div style={enhancedStyles.modalOverlay}>
          <div style={enhancedStyles.modalContent}>
            <h3 style={enhancedStyles.modalTitle}>⚠️ Character Edit Warning</h3>
            <p style={enhancedStyles.modalText}>
              You are attempting to change the Innate Heritage of an existing
              Level {character.level} character. Heritage is typically
              established during character creation and changing it for an
              existing character may require DM approval and could affect
              character balance.
            </p>
            <p style={enhancedStyles.modalTextBold}>
              Are you sure you want to proceed with this change?
            </p>
            <div style={enhancedStyles.modalButtons}>
              <button
                onClick={() => {
                  setShowWarning(false);
                  setPendingHeritage("");
                }}
                style={enhancedStyles.modalCancelButton}
              >
                Cancel
              </button>
              <button
                onClick={confirmChange}
                style={enhancedStyles.modalConfirmButton}
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InnateHeritage;
