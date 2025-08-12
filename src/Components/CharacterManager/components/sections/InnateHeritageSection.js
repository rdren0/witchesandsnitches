import { useState, useEffect } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBackgroundStyles } from "../../../../styles/masterStyles";
import {
  heritageDescriptions,
  innateHeritages,
} from "../../../../SharedData/heritageData";

// Helper function to check for skill proficiencies
const checkForSkillProficiencies = (item) => {
  const skills = [];

  if (item.skillProficiencies) {
    skills.push(...item.skillProficiencies);
  }

  if (item.data?.skillProficiencies) {
    skills.push(...item.data.skillProficiencies);
  }

  if (item.properties?.skillProficiencies) {
    skills.push(...item.properties.skillProficiencies);
  }

  return skills;
};

// Helper function to check for ability score choices
const checkForAbilityChoices = (item) => {
  const abilities = [];

  if (item.abilityScoreIncrease) {
    abilities.push(...item.abilityScoreIncrease);
  }

  if (item.data?.abilityScoreIncrease) {
    abilities.push(...item.data.abilityScoreIncrease);
  }

  if (item.properties?.abilityScoreIncrease) {
    abilities.push(...item.properties.abilityScoreIncrease);
  }

  return abilities;
};

// Apply heritage proficiencies to character
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

// Remove heritage proficiencies
const removeHeritageProficiencies = (currentProficiencies, heritageName) => {
  if (!heritageName || !heritageDescriptions[heritageName]) {
    return currentProficiencies;
  }

  const heritage = heritageDescriptions[heritageName];
  const heritageSkills = checkForSkillProficiencies(heritage);

  return currentProficiencies.filter(
    (skill) => !heritageSkills.includes(skill)
  );
};

// Heritage Choice Selector Component
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

// Main Component
const InnateHeritageSection = ({
  character,
  handleInputChange,
  isEditing = false,
  heritageChoices = {},
  onHeritageChoicesChange,
  onCharacterUpdate,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);
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
      backgroundColor: theme.surfaceHover || theme.surface,
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
      alignItems: "flex-start",
      gap: "8px",
      padding: "8px",
      borderRadius: "4px",
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
      color: theme.warning || "#f59e0b",
      fontStyle: "italic",
      marginTop: "4px",
    },
    warningBadge: styles.warningBadge || {
      backgroundColor: "#fef3c7",
      color: "#92400e",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "11px",
      fontWeight: "600",
    },
    levelRestrictionWarning: styles.levelRestrictionWarning || {
      backgroundColor: "#fef3c7",
      border: "1px solid #fbbf24",
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "16px",
      color: "#92400e",
    },
    modalOverlay: styles.modalOverlay || {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: styles.modalContent || {
      backgroundColor: theme.surface,
      padding: "24px",
      borderRadius: "12px",
      maxWidth: "500px",
      width: "90%",
      maxHeight: "80vh",
      overflow: "auto",
    },
    cancelButton: styles.cancelButton || {
      padding: "8px 16px",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      backgroundColor: theme.surface,
      color: theme.text,
      cursor: "pointer",
    },
    confirmButton: styles.confirmButton || {
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      backgroundColor: theme.warning || "#f59e0b",
      color: "white",
      cursor: "pointer",
    },
    featFilterContainer: styles.featFilterContainer || {
      position: "relative",
      marginBottom: "16px",
    },
    featFilterInput: styles.featFilterInput || {
      width: "100%",
      padding: "12px 40px 12px 16px",
      fontSize: "14px",
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      backgroundColor: theme.surface,
      color: theme.text,
      outline: "none",
    },
    featFilterClearButton: styles.featFilterClearButton || {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      fontSize: "18px",
      color: theme.textSecondary,
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px",
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
    if (!heritageData?.features) {
      return { total: 0, missing: [], isComplete: true };
    }

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
    <div style={styles.container}>
      <div
        style={{
          maxHeight: "800px",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "4px",
        }}
      >
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
            <strong>⚠️ Editing Existing Character:</strong> You are modifying
            the Innate Heritage of an existing Level {character.level}{" "}
            character. Heritage is typically established during character
            creation. This change may require DM approval and could affect
            character balance.
          </div>
        )}

        {hasSelectedHeritage === 0 && (
          <div style={enhancedStyles.featFilterContainer}>
            <input
              type="text"
              placeholder="Search heritages by name or description..."
              value={heritageFilter}
              onChange={(e) => setHeritageFilter(e.target.value)}
              style={enhancedStyles.featFilterInput}
              disabled={disabled}
            />
            {heritageFilter.trim() && (
              <button
                onClick={() => setHeritageFilter("")}
                style={enhancedStyles.featFilterClearButton}
                type="button"
                title="Clear search"
                disabled={disabled}
              >
                ×
              </button>
            )}
          </div>
        )}

        {showWarning && (
          <div style={enhancedStyles.modalOverlay}>
            <div style={enhancedStyles.modalContent}>
              <h3 style={{ color: theme.warning, marginBottom: "16px" }}>
                ⚠️ Confirm Heritage Change
              </h3>
              <p style={{ marginBottom: "16px", lineHeight: "1.4" }}>
                You are changing the Innate Heritage of a Level{" "}
                {character.level} character. This change will affect:
              </p>
              <ul style={{ marginBottom: "16px", paddingLeft: "20px" }}>
                <li>Character abilities and features</li>
                <li>Skill proficiencies</li>
                <li>Overall character balance</li>
              </ul>
              <p style={{ marginBottom: "20px", fontWeight: "600" }}>
                This change may require DM approval. Continue?
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => {
                    setShowWarning(false);
                    setPendingHeritage("");
                  }}
                  style={enhancedStyles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmChange}
                  style={enhancedStyles.confirmButton}
                >
                  Confirm Change
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={enhancedStyles.availableElementsContainer}>
          {filteredHeritages.map((heritage) => {
            const heritageData = heritageDescriptions[heritage];
            const isSelected = character.innateHeritage === heritage;
            const isExpanded = expandedHeritages.has(heritage);

            return (
              <div
                key={heritage}
                style={
                  isSelected
                    ? enhancedStyles.selectedElementCard
                    : enhancedStyles.featCard
                }
              >
                <div style={enhancedStyles.featHeader}>
                  <label style={enhancedStyles.featLabelClickable}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleHeritageToggle(heritage)}
                      disabled={disabled}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "8px",
                        cursor: disabled ? "not-allowed" : "pointer",
                        accentColor: isSelected ? theme.success : theme.primary,
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
                    </span>
                  </label>
                  <button
                    onClick={() => toggleHeritageExpansion(heritage)}
                    style={enhancedStyles.expandButton}
                    type="button"
                    disabled={disabled}
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
                  {heritageData?.preview ||
                    heritageData?.description ||
                    "Heritage description"}
                </div>

                {isExpanded && (
                  <div style={enhancedStyles.featDescription}>
                    <div style={{ marginBottom: "16px" }}>
                      <p
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.5",
                          margin: "0 0 12px 0",
                        }}
                      >
                        {heritageData?.description || "Heritage description"}
                      </p>
                    </div>

                    {heritageData?.features &&
                      heritageData.features.length > 0 && (
                        <div>
                          <strong
                            style={{ fontSize: "12px", color: theme.primary }}
                          >
                            Features:
                          </strong>
                          {heritageData.features
                            .slice(0, 2)
                            .map((feature, idx) => (
                              <div key={idx} style={{ marginTop: "6px" }}>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {feature.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: theme.textSecondary,
                                    lineHeight: "1.3",
                                  }}
                                >
                                  {feature.description?.substring(0, 100)}
                                  {feature.description?.length > 100
                                    ? "..."
                                    : ""}
                                </div>
                              </div>
                            ))}
                          {heritageData.features.length > 2 && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: theme.textSecondary,
                                fontStyle: "italic",
                                marginTop: "4px",
                              }}
                            >
                              +{heritageData.features.length - 2} more feature
                              {heritageData.features.length > 3 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                )}

                <HeritageChoiceSelector
                  heritage={heritage}
                  heritageData={heritageData}
                  heritageChoices={heritageChoices}
                  onHeritageChoiceSelect={handleHeritageChoiceSelect}
                  isSelected={isSelected}
                  styles={enhancedStyles}
                  theme={theme}
                />
              </div>
            );
          })}
        </div>

        <div style={enhancedStyles.helpText}>
          {character.innateHeritage
            ? "Your Innate Heritage provides unique magical abilities and characteristics that are part of your character's core nature."
            : "Choose an Innate Heritage that represents your character's magical lineage and inherent abilities."}
        </div>
      </div>
    </div>
  );
};

export default InnateHeritageSection;
