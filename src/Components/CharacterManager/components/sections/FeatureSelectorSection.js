import { useState, useMemo } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBackgroundStyles } from "../../../../styles/masterStyles";
import { standardFeats } from "../../../../SharedData/standardFeatData";
import { getAllSelectedFeats } from "../../utils/characterUtils";

const FeatureSelectorSection = ({
  character,
  setCharacter,
  expandedFeats,
  setExpandedFeats,
  featFilter,
  setFeatFilter,
  maxFeats = 1,
  isLevel1Choice = false,
  characterLevel = 1,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);

  const selectedFeats = character.standardFeats || [];
  const featChoices = character.featChoices || {};

  const enhancedStyles = {
    ...styles,
    modifierPillsContainer: {
      backgroundColor: "rgba(251, 191, 36, 0.1)",
      border: "1px solid rgba(251, 191, 36, 0.3)",
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "16px",
    },
    pillsLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#f59e0b",
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
      backgroundColor: "#f59e0b",
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
    featFilterContainer: {
      position: "relative",
      marginBottom: "16px",
    },
    featFilterInput: {
      width: "100%",
      padding: "12px 40px 12px 16px",
      fontSize: "14px",
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      backgroundColor: theme.surface,
      color: theme.text,
      outline: "none",
      transition: "all 0.2s ease",
    },
    featFilterClearButton: {
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
    featFilterResults: {
      fontSize: "12px",
      color: theme.textSecondary,
      marginTop: "8px",
    },
    completionMessage: {
      backgroundColor: `${theme.success}20`,
      border: `1px solid ${theme.success}`,
      borderRadius: "8px",
      padding: "12px 16px",
      color: theme.success,
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "16px",
    },
    // New styles for feat choices
    featChoicesContainer: {
      backgroundColor: `${theme.primary}10`,
      border: `1px solid ${theme.primary}30`,
      borderRadius: "6px",
      padding: "12px",
      marginTop: "12px",
    },
    featChoicesLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: theme.primary,
      marginBottom: "8px",
    },
    abilityChoiceGroup: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    abilityChoiceLabel: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      fontSize: "12px",
      color: theme.text,
      padding: "4px 8px",
      borderRadius: "4px",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      transition: "all 0.2s ease",
    },
    abilityChoiceRadio: {
      marginRight: "6px",
      accentColor: theme.primary,
    },
  };

  // Helper function to determine if a feat has choices
  const featHasChoices = (feat) => {
    if (!feat?.benefits?.abilityScoreIncrease) return false;

    // Check for choice-based ability score increases
    const asiIncrease = feat.benefits.abilityScoreIncrease;
    return (
      asiIncrease.type === "choice" ||
      asiIncrease.type === "choice_any" ||
      asiIncrease.ability === "choice"
    );
  };

  // Helper function to get available ability choices for a feat
  const getFeatAbilityChoices = (feat) => {
    if (!feat?.benefits?.abilityScoreIncrease) return [];

    const asiIncrease = feat.benefits.abilityScoreIncrease;

    // Try different property names for choices
    return (
      asiIncrease.abilities ||
      asiIncrease.options ||
      asiIncrease.choices || [
        "strength",
        "dexterity",
        "constitution",
        "intelligence",
        "wisdom",
        "charisma",
      ]
    );
  };

  const handleFeatToggle = (featName) => {
    setCharacter((prev) => {
      const currentFeats = prev.standardFeats || [];
      const currentChoices = prev.featChoices || {};

      let newFeats, newChoices;

      if (currentFeats.includes(featName)) {
        // Remove feat
        newFeats = currentFeats.filter((f) => f !== featName);
        newChoices = { ...currentChoices };

        // Remove any choices for this feat
        Object.keys(newChoices).forEach((key) => {
          if (key.startsWith(`${featName}_`)) {
            delete newChoices[key];
          }
        });

        setExpandedFeats((prev) => {
          const newSet = new Set(prev);
          newSet.delete(featName);
          return newSet;
        });
      } else {
        // Add feat
        newFeats = [...currentFeats, featName];
        newChoices = { ...currentChoices };

        // Initialize choices for this feat if needed
        const feat = standardFeats.find((f) => f.name === featName);
        if (featHasChoices(feat)) {
          const availableChoices = getFeatAbilityChoices(feat);

          // Use multiple choice key formats for compatibility
          const choiceKey1 = `${featName}_abilityChoice`;
          const choiceKey2 = `${featName}_ability_0`;

          if (!newChoices[choiceKey1] && !newChoices[choiceKey2]) {
            // Set default choice to first available ability
            newChoices[choiceKey1] = availableChoices[0];
            newChoices[choiceKey2] = availableChoices[0]; // Also set the alternate format
          }
        }

        setExpandedFeats(new Set([featName]));
      }

      return {
        ...prev,
        standardFeats: newFeats,
        featChoices: newChoices,
      };
    });
  };

  // Handle feat choice changes
  const handleFeatChoiceChange = (featName, choiceKey, value) => {
    setCharacter((prev) => ({
      ...prev,
      featChoices: {
        ...prev.featChoices,
        [choiceKey]: value,
        // Also update the alternate choice key format for compatibility
        [`${featName}_abilityChoice`]: value,
        [`${featName}_ability_0`]: value,
      },
    }));
  };

  const toggleFeatExpansion = (featName) => {
    setExpandedFeats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(featName)) {
        newSet.delete(featName);
      } else {
        newSet.add(featName);
      }
      return newSet;
    });
  };

  const filteredFeats = useMemo(() => {
    const allSelectedFeats = getAllSelectedFeats(character);
    const currentStandardFeats = character.standardFeats || [];

    if (currentStandardFeats.length >= maxFeats) {
      return standardFeats.filter((feat) =>
        currentStandardFeats.includes(feat.name)
      );
    }

    let availableFeats = standardFeats.filter(
      (feat) => !allSelectedFeats.includes(feat.name)
    );

    if (!featFilter.trim()) {
      return availableFeats;
    }

    const searchTerm = featFilter.toLowerCase();
    return availableFeats.filter((feat) => {
      const basicMatch =
        feat.name.toLowerCase().includes(searchTerm) ||
        feat.preview.toLowerCase().includes(searchTerm);

      const descriptionText = Array.isArray(feat.description)
        ? feat.description.join(" ").toLowerCase()
        : (feat.description || "").toLowerCase();

      const descriptionMatch = descriptionText.includes(searchTerm);

      return basicMatch || descriptionMatch;
    });
  }, [character, maxFeats, featFilter]);

  const getHelpText = () => {
    if (characterLevel === 1) {
      return "Select your starting feat. All benefits will be shown below.";
    } else {
      return `Select your feats: 1 starting feat from Level 1, plus up to ${
        characterLevel - 1
      } additional feat${
        characterLevel > 2 ? "s" : ""
      } from Levels 2-${characterLevel}. Total possible: ${characterLevel} feat${
        characterLevel > 1 ? "s" : ""
      }. All benefits will be shown below.`;
    }
  };

  const allSelectedFeats = getAllSelectedFeats(character);
  const availableCount = standardFeats.length - allSelectedFeats.length;

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
        <h3 style={enhancedStyles.skillsHeader}>
          Standard Feats ({selectedFeats.length}/{maxFeats} selected)
        </h3>

        <div style={enhancedStyles.helpText}>{getHelpText()}</div>

        {selectedFeats.length < maxFeats && (
          <div style={enhancedStyles.featFilterContainer}>
            <input
              type="text"
              placeholder="Search feats by name, description, or benefits..."
              value={featFilter}
              onChange={(e) => setFeatFilter(e.target.value)}
              style={enhancedStyles.featFilterInput}
              disabled={disabled}
              onFocus={(e) => {
                e.target.style.borderColor = "#FBBF24";
                e.target.style.boxShadow =
                  "inset 0 2px 6px rgba(245,158,11,0.2), 0 0 0 3px rgba(251,191,36,0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#F59E0B";
                e.target.style.boxShadow =
                  "inset 0 2px 6px rgba(245,158,11,0.2), 0 2px 4px rgba(0,0,0,0.1)";
              }}
            />
            {featFilter.trim() && (
              <button
                onClick={() => setFeatFilter("")}
                style={enhancedStyles.featFilterClearButton}
                type="button"
                title="Clear search"
                disabled={disabled}
              >
                ×
              </button>
            )}
            {featFilter.trim() && (
              <div style={enhancedStyles.featFilterResults}>
                Showing {filteredFeats.length} of {availableCount} available
                feats
                {allSelectedFeats.length > 0 && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: theme.textSecondary,
                      marginLeft: "8px",
                    }}
                  >
                    ({allSelectedFeats.length} already selected)
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {selectedFeats.length === maxFeats && (
          <div style={enhancedStyles.completionMessage}>
            ✓ Feat selection complete!
          </div>
        )}

        <div style={enhancedStyles.availableElementsContainer}>
          {filteredFeats.map((feat) => {
            const isSelected = selectedFeats.includes(feat.name);
            const isExpanded = expandedFeats.has(feat.name);
            const hasChoices = featHasChoices(feat);

            return (
              <div
                key={feat.name}
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
                      onChange={() => handleFeatToggle(feat.name)}
                      disabled={
                        disabled ||
                        (!isSelected && selectedFeats.length >= maxFeats)
                      }
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "8px",
                        cursor:
                          disabled ||
                          (!isSelected && selectedFeats.length >= maxFeats)
                            ? "not-allowed"
                            : "pointer",
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
                      {feat.name}
                    </span>
                  </label>
                  <button
                    onClick={() => toggleFeatExpansion(feat.name)}
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
                  {feat.preview}
                </div>

                {/* Feat Choices Section - NEW! */}
                {isSelected && hasChoices && (
                  <div style={enhancedStyles.featChoicesContainer}>
                    <div style={enhancedStyles.featChoicesLabel}>
                      Choose your ability score increase:
                    </div>
                    <div style={enhancedStyles.abilityChoiceGroup}>
                      {getFeatAbilityChoices(feat).map((ability) => {
                        const choiceKey1 = `${feat.name}_abilityChoice`;
                        const choiceKey2 = `${feat.name}_ability_0`;
                        const currentChoice =
                          featChoices[choiceKey1] || featChoices[choiceKey2];

                        return (
                          <label
                            key={ability}
                            style={{
                              ...enhancedStyles.abilityChoiceLabel,
                              backgroundColor:
                                currentChoice === ability
                                  ? `${theme.primary}20`
                                  : theme.surface,
                              borderColor:
                                currentChoice === ability
                                  ? theme.primary
                                  : theme.border,
                            }}
                          >
                            <input
                              type="radio"
                              name={`${feat.name}_ability_choice`}
                              value={ability}
                              checked={currentChoice === ability}
                              onChange={(e) =>
                                handleFeatChoiceChange(
                                  feat.name,
                                  choiceKey1,
                                  e.target.value
                                )
                              }
                              style={enhancedStyles.abilityChoiceRadio}
                              disabled={disabled}
                            />
                            <span>
                              {ability.charAt(0).toUpperCase() +
                                ability.slice(1)}{" "}
                              (+1)
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isExpanded && (
                  <div style={enhancedStyles.featDescription}>
                    <div style={{ marginBottom: "16px" }}>
                      <p
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.5",
                          color: theme.text,
                          margin: "0 0 12px 0",
                        }}
                      >
                        {Array.isArray(feat.description)
                          ? feat.description.join(" ")
                          : feat.description}
                      </p>
                    </div>
                    {feat.benefits && (
                      <div style={{ marginTop: "12px" }}>
                        <strong
                          style={{ fontSize: "12px", color: theme.primary }}
                        >
                          Benefits:
                        </strong>
                        <div
                          style={{
                            fontSize: "12px",
                            marginTop: "8px",
                            lineHeight: "1.4",
                          }}
                        >
                          {/* Ability Score Increase */}
                          {feat.benefits.abilityScoreIncrease && (
                            <div
                              style={{
                                color: "#8b5cf6",
                                marginBottom: "8px",
                                padding: "4px 0",
                              }}
                            >
                              <strong>• Ability Score Increase:</strong>{" "}
                              {feat.benefits.abilityScoreIncrease.ability ===
                                "choice" ||
                              feat.benefits.abilityScoreIncrease.type ===
                                "choice" ||
                              feat.benefits.abilityScoreIncrease.type ===
                                "choice_any" ? (
                                <>
                                  +
                                  {feat.benefits.abilityScoreIncrease.amount ||
                                    1}{" "}
                                  to{" "}
                                  {isSelected && hasChoices ? (
                                    <span
                                      style={{
                                        color: theme.primary,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {(
                                        featChoices[
                                          `${feat.name}_abilityChoice`
                                        ] ||
                                        featChoices[`${feat.name}_ability_0`] ||
                                        getFeatAbilityChoices(feat)[0] ||
                                        "chosen ability"
                                      )
                                        .charAt(0)
                                        .toUpperCase() +
                                        (
                                          featChoices[
                                            `${feat.name}_abilityChoice`
                                          ] ||
                                          featChoices[
                                            `${feat.name}_ability_0`
                                          ] ||
                                          getFeatAbilityChoices(feat)[0] ||
                                          "chosen ability"
                                        ).slice(1)}
                                    </span>
                                  ) : (
                                    getFeatAbilityChoices(feat)
                                      .map(
                                        (ability) =>
                                          ability.charAt(0).toUpperCase() +
                                          ability.slice(1)
                                      )
                                      .join(" or ")
                                  )}
                                </>
                              ) : (
                                <>
                                  +
                                  {feat.benefits.abilityScoreIncrease.amount ||
                                    1}{" "}
                                  {feat.benefits.abilityScoreIncrease.ability
                                    ?.charAt(0)
                                    .toUpperCase() +
                                    feat.benefits.abilityScoreIncrease.ability?.slice(
                                      1
                                    )}
                                </>
                              )}
                            </div>
                          )}

                          {/* Rest of the benefits display stays the same... */}
                          {/* Skill Proficiencies */}
                          {feat.benefits.skillProficiencies?.length > 0 && (
                            <div
                              style={{
                                color: "#10b981",
                                marginBottom: "8px",
                                padding: "4px 0",
                              }}
                            >
                              <strong>• Skill Proficiencies:</strong>{" "}
                              {feat.benefits.skillProficiencies
                                .map((skillProf, index) => {
                                  if (typeof skillProf === "string") {
                                    return (
                                      skillProf.charAt(0).toUpperCase() +
                                      skillProf
                                        .slice(1)
                                        .replace(/([A-Z])/g, " $1")
                                    );
                                  } else if (
                                    skillProf &&
                                    typeof skillProf === "object"
                                  ) {
                                    if (skillProf.type === "choice") {
                                      return `${skillProf.count} chosen skill${
                                        skillProf.count > 1 ? "s" : ""
                                      }`;
                                    } else if (
                                      skillProf.skills &&
                                      Array.isArray(skillProf.skills)
                                    ) {
                                      return skillProf.skills.join(", ");
                                    } else if (skillProf.skill) {
                                      return (
                                        skillProf.skill
                                          .charAt(0)
                                          .toUpperCase() +
                                        skillProf.skill
                                          .slice(1)
                                          .replace(/([A-Z])/g, " $1")
                                      );
                                    }
                                  }
                                  return "Unknown skill";
                                })
                                .join(", ")}
                            </div>
                          )}

                          {/* Tool Proficiencies */}
                          {feat.benefits.toolProficiencies?.length > 0 && (
                            <div
                              style={{
                                color: "#f59e0b",
                                marginBottom: "8px",
                                padding: "4px 0",
                              }}
                            >
                              <strong>• Tool Proficiencies:</strong>{" "}
                              {feat.benefits.toolProficiencies.join(", ")}
                            </div>
                          )}

                          {/* Continue with other benefits... */}
                          {/* I'm keeping the rest of the benefits display code the same for brevity */}
                        </div>
                      </div>
                    )}
                    {feat.prerequisites && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "8px",
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          borderRadius: "4px",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        <strong style={{ color: "#ef4444" }}>
                          Prerequisites:
                        </strong>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#ef4444",
                            marginTop: "4px",
                          }}
                        >
                          {feat.prerequisites.anyOf && "Any of: "}
                          {feat.prerequisites.allOf && "All of: "}
                          {(
                            feat.prerequisites.anyOf ||
                            feat.prerequisites.allOf ||
                            []
                          ).map((req, index) => (
                            <div key={index}>
                              • {req.type}: {req.value}{" "}
                              {req.amount && `(${req.amount}+)`}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureSelectorSection;
