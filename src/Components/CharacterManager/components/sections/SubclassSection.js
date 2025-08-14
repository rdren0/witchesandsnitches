import React, { useState, useEffect, useCallback, useMemo } from "react";
import { subclassesData } from "../../../../SharedData/subclassesData";
import { createFeatStyles } from "../../../../styles/masterStyles";
import { useTheme } from "../../../../contexts/ThemeContext";

const SubclassSection = ({ character, onChange, disabled = false }) => {
  const { theme } = useTheme();
  const styles = createFeatStyles(theme);
  const [expandedSubclasses, setExpandedSubclasses] = useState(new Set());

  const selectedSubclass = character?.subclass || "";
  const characterLevel = character?.level || 1;
  const subclassChoices = character?.subclassChoices || {};

  const selectedSubclassData = selectedSubclass
    ? subclassesData[selectedSubclass]
    : null;

  const visibleSubclasses = useMemo(() => {
    const subclassArray = Object.values(subclassesData);

    if (!selectedSubclass) {
      return subclassArray.sort((a, b) => a.name.localeCompare(b.name));
    }

    const selectedClass = subclassArray.find(
      (sc) => sc.name === selectedSubclass
    );
    return selectedClass ? [selectedClass] : subclassArray;
  }, [selectedSubclass]);

  const normalizeSubclassChoices = useCallback((choices) => {
    if (!choices || typeof choices !== "object") return {};

    const normalized = {};
    Object.entries(choices).forEach(([level, choice]) => {
      if (choice) {
        if (typeof choice === "string") {
          normalized[level] = choice;
        } else if (typeof choice === "object") {
          if (choice.mainChoice && choice.subChoice) {
            normalized[level] = {
              mainChoice: choice.mainChoice,
              subChoice: choice.subChoice,
            };
          } else if (choice.name) {
            normalized[level] = choice.name;
          } else if (choice.selectedChoice) {
            normalized[level] = choice.selectedChoice;
          } else if (choice.choice) {
            normalized[level] = choice.choice;
          } else {
            normalized[level] = String(choice);
          }
        }
      }
    });

    return normalized;
  }, []);

  const normalizedSubclassChoices = useMemo(() => {
    return normalizeSubclassChoices(subclassChoices);
  }, [subclassChoices, normalizeSubclassChoices]);

  useEffect(() => {
    if (selectedSubclass && selectedSubclass.trim() !== "") {
      setExpandedSubclasses((prev) => {
        const newSet = new Set(prev);
        newSet.add(selectedSubclass);
        return newSet;
      });
    }
  }, [selectedSubclass]);

  const parseAllFeaturesByLevel = useCallback((subclassData) => {
    if (!subclassData) return {};

    const featuresByLevel = {};

    if (subclassData.level1Features) {
      featuresByLevel[1] = {
        features: subclassData.level1Features,
        choices: subclassData.level1Choices || [],
      };
    }

    if (subclassData.higherLevelFeatures) {
      subclassData.higherLevelFeatures.forEach((feature) => {
        const level = feature.level;

        if (!featuresByLevel[level]) {
          featuresByLevel[level] = {
            features: [],
            choices: [],
          };
        }

        if (feature.choices && Array.isArray(feature.choices)) {
          const processedChoices = feature.choices.map((choice) => {
            if (choice.description && choice.description.includes("Choose:")) {
              const parts = choice.description.split("Choose:");
              const beforeChoose = parts[0].trim();
              const afterChoose = parts[1];

              const endings = [
                " to gain proficiency in",
                ". After",
                ". Once",
                ". Master",
              ];
              let choicesText = afterChoose;
              let afterChoices = "";

              for (const ending of endings) {
                if (afterChoose.includes(ending)) {
                  const splitPoint = afterChoose.indexOf(ending);
                  choicesText = afterChoose.substring(0, splitPoint);
                  afterChoices = afterChoose.substring(splitPoint);
                  break;
                }
              }

              const nestedChoices = choicesText.split(" or ").map((opt) => ({
                name: opt.trim(),
                description: `${beforeChoose} ${opt.trim()}${afterChoices}`,
              }));

              return {
                ...choice,
                description: beforeChoose,
                hasNestedChoices: true,
                nestedChoices: nestedChoices,
              };
            }
            return choice;
          });

          featuresByLevel[level].choices = processedChoices;

          featuresByLevel[level].features.push({
            name: feature.name,
            description: feature.description,
          });
        } else if (
          feature.description &&
          feature.description.includes("Choose:")
        ) {
          const choicesText = feature.description.split("Choose:")[1];
          if (choicesText) {
            const choices = choicesText.split(" or ").map((choice) => {
              const cleanChoice = choice.trim().split("(")[0].trim();
              return {
                name: cleanChoice,
                description: choice.trim(),
              };
            });
            featuresByLevel[level].choices = choices;

            featuresByLevel[level].features.push({
              name: feature.name,
              description: feature.description.split("Choose:")[0].trim(),
            });
          }
        } else {
          featuresByLevel[level].features.push(feature);
        }
      });
    }

    return featuresByLevel;
  }, []);

  const getAvailableLevels = useCallback(
    (subclassData) => {
      if (!subclassData) return [];

      const featuresByLevel = parseAllFeaturesByLevel(subclassData);
      const allLevels = Object.keys(featuresByLevel).map((level) =>
        parseInt(level)
      );
      const availableLevels = allLevels.filter(
        (level) => level <= characterLevel
      );

      return availableLevels.sort((a, b) => a - b);
    },
    [parseAllFeaturesByLevel, characterLevel]
  );

  const getRequiredChoices = useCallback(
    (subclassData) => {
      if (!subclassData)
        return { total: 0, missing: [], missingByLevel: {}, isComplete: true };

      const featuresByLevel = parseAllFeaturesByLevel(subclassData);
      const availableLevels = getAvailableLevels(subclassData);

      const levelsWithChoices = availableLevels.filter(
        (level) =>
          featuresByLevel[level] && featuresByLevel[level].choices.length > 0
      );

      const missingChoices = levelsWithChoices.filter((level) => {
        const currentChoice = normalizedSubclassChoices[level];
        if (!currentChoice) return true;

        const levelChoices = featuresByLevel[level].choices;
        const hasNestedChoices = levelChoices.some(
          (choice) => choice.hasNestedChoices
        );

        if (hasNestedChoices && typeof currentChoice === "object") {
          return !currentChoice.subChoice;
        } else if (hasNestedChoices && typeof currentChoice === "string") {
          const selectedChoice = levelChoices.find(
            (choice) => choice.name === currentChoice
          );
          return selectedChoice && selectedChoice.hasNestedChoices;
        }

        return false;
      });

      const missingByLevel = {};
      missingChoices.forEach((level) => {
        const levelData = featuresByLevel[level];
        missingByLevel[level] = {
          choiceCount: levelData.choices.length,
          choices: levelData.choices.map((choice) => choice.name),
        };
      });

      return {
        total: levelsWithChoices.length,
        missing: missingChoices,
        missingByLevel: missingByLevel,
        isComplete: missingChoices.length === 0,
        levelsWithChoices: levelsWithChoices,
      };
    },
    [normalizedSubclassChoices, parseAllFeaturesByLevel, getAvailableLevels]
  );

  const choiceStatus = useMemo(() => {
    if (!selectedSubclassData) {
      return { total: 0, missing: [], missingByLevel: {}, isComplete: true };
    }
    return getRequiredChoices(selectedSubclassData);
  }, [selectedSubclassData, getRequiredChoices]);

  useEffect(() => {
    if (characterLevel > 1 && selectedSubclass && selectedSubclassData) {
      if (choiceStatus.total > 0 && !choiceStatus.isComplete) {
        setExpandedSubclasses((prev) => {
          const newSet = new Set(prev);
          newSet.add(selectedSubclass);
          return newSet;
        });
      }
    }
  }, [
    characterLevel,
    selectedSubclass,
    selectedSubclassData,
    choiceStatus.total,
    choiceStatus.isComplete,
  ]);

  const handleSubclassToggle = (subclassName) => {
    if (selectedSubclass === subclassName) {
      onChange("subclass", "");
      onChange("subclassChoices", {});

      setExpandedSubclasses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(subclassName);
        return newSet;
      });
    } else {
      onChange("subclass", subclassName);

      setExpandedSubclasses((prev) => {
        const newSet = new Set(prev);
        newSet.add(subclassName);
        return newSet;
      });
    }
  };

  const handleSubclassChoiceChange = (
    level,
    choiceName,
    isMainChoice = true,
    subChoiceName = null
  ) => {
    const currentChoice = normalizedSubclassChoices[level];
    let newChoices;

    if (isMainChoice) {
      if (
        typeof currentChoice === "object" &&
        currentChoice.mainChoice === choiceName
      ) {
        newChoices = {
          ...normalizedSubclassChoices,
          [level]: currentChoice,
        };
      } else {
        newChoices = {
          ...normalizedSubclassChoices,
          [level]: choiceName,
        };
      }
    } else {
      newChoices = {
        ...normalizedSubclassChoices,
        [level]: {
          mainChoice: choiceName,
          subChoice: subChoiceName,
        },
      };
    }

    onChange("subclassChoices", newChoices);
  };

  const isChoiceSelected = (level, choiceName, subChoiceName = null) => {
    const currentChoice = normalizedSubclassChoices[level];

    if (!currentChoice) return false;

    if (subChoiceName) {
      return (
        typeof currentChoice === "object" &&
        currentChoice.mainChoice === choiceName &&
        currentChoice.subChoice === subChoiceName
      );
    } else {
      if (typeof currentChoice === "string") {
        return currentChoice === choiceName;
      } else if (typeof currentChoice === "object") {
        return currentChoice.mainChoice === choiceName;
      }
    }

    return false;
  };

  const toggleSubclassExpansion = (subclassName) => {
    setExpandedSubclasses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subclassName)) {
        newSet.delete(subclassName);
      } else {
        newSet.add(subclassName);
      }
      return newSet;
    });
  };

  const getLockedLevels = (subclassData) => {
    if (!subclassData) return [];

    const featuresByLevel = parseAllFeaturesByLevel(subclassData);
    const allLevels = Object.keys(featuresByLevel).map((level) =>
      parseInt(level)
    );
    const lockedLevels = allLevels.filter((level) => level > characterLevel);

    return lockedLevels.sort((a, b) => a - b);
  };

  const renderLevelFeatures = (subclassData, level) => {
    const featuresByLevel = parseAllFeaturesByLevel(subclassData);
    const levelData = featuresByLevel[level];

    if (!levelData) return null;

    const isSelected = selectedSubclass === subclassData.name;
    const selectedChoice = normalizedSubclassChoices[level];
    const hasChoices = levelData.choices.length > 0;

    return (
      <div key={level} style={styles.featureContainer}>
        <h5
          style={isSelected ? styles.levelHeaderSelected : styles.levelHeader}
        >
          Level {level} Features:
          {hasChoices && isSelected && (
            <span
              style={
                selectedChoice
                  ? {
                      ...styles.choiceStatusSelected,
                      color: theme.success,
                    }
                  : styles.choiceStatusRequired
              }
            >
              {selectedChoice ? "✓ Choice Made" : "* Choice Required"}
            </span>
          )}
        </h5>

        {levelData.features.map((feature, index) => (
          <div
            key={`feature-${index}`}
            style={
              isSelected ? styles.singleFeatureSelected : styles.singleFeature
            }
          >
            <strong
              style={
                isSelected ? styles.featureNameSelected : styles.featureName
              }
            >
              {feature.name}:
            </strong>
            <p
              style={
                isSelected
                  ? styles.featureDescriptionSelected
                  : styles.featureDescription
              }
            >
              {feature.description}
            </p>
          </div>
        ))}

        {hasChoices && (
          <>
            {isSelected && (
              <div style={styles.choiceInfo}>
                Select one of the following options for Level {level}:
                <br />
                <strong>
                  Current selection:{" "}
                  {typeof selectedChoice === "object"
                    ? `${selectedChoice.mainChoice} (${
                        selectedChoice.subChoice || "no sub-choice"
                      })`
                    : selectedChoice || "None"}
                </strong>
              </div>
            )}
            {levelData.choices.map((choice, index) => {
              const isMainChoiceSelected = isChoiceSelected(level, choice.name);
              const hasNestedChoices = choice.hasNestedChoices;

              return (
                <div key={`choice-${index}`}>
                  <div
                    style={
                      isSelected
                        ? isMainChoiceSelected
                          ? styles.choiceContainerSelectedOption
                          : styles.choiceContainerSelected
                        : styles.choiceContainer
                    }
                  >
                    {isSelected ? (
                      <label
                        style={
                          disabled
                            ? styles.choiceLabelDisabled
                            : styles.choiceLabel
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="radio"
                          name={`subclass-level${level}-choice`}
                          value={choice.name}
                          checked={isMainChoiceSelected}
                          onChange={(e) => {
                            if (!disabled) {
                              handleSubclassChoiceChange(
                                level,
                                e.target.value,
                                true
                              );
                            }
                          }}
                          disabled={disabled}
                          style={
                            disabled
                              ? styles.radioButtonDisabled
                              : styles.radioButton
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <strong
                            style={
                              isMainChoiceSelected
                                ? styles.featureNameSelected
                                : {
                                    ...styles.featureName,
                                    color: theme.success,
                                  }
                            }
                          >
                            {choice.name}
                          </strong>
                          <p style={styles.featureDescription}>
                            {choice.description}
                          </p>
                        </div>
                      </label>
                    ) : (
                      <>
                        <strong style={styles.featureName}>
                          {choice.name}
                        </strong>
                        <p style={styles.featureDescription}>
                          {choice.description}
                        </p>
                      </>
                    )}
                  </div>

                  {isSelected && isMainChoiceSelected && hasNestedChoices && (
                    <div
                      style={{
                        marginLeft: "20px",
                        marginTop: "10px",
                        padding: "12px",
                        border: `1px solid ${theme.border}`,
                        borderRadius: "6px",
                        backgroundColor: theme.surfaceHover,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: theme.text,
                          marginBottom: "8px",
                        }}
                      >
                        Gain proficiency (expertise if already proficient) in:
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        {choice.nestedChoices.map(
                          (nestedChoice, nestedIndex) => {
                            const isNestedSelected = isChoiceSelected(
                              level,
                              choice.name,
                              nestedChoice.name
                            );

                            return (
                              <label
                                key={`nested-${nestedIndex}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontSize: "12px",
                                  cursor: disabled ? "not-allowed" : "pointer",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  border: `1px solid ${
                                    isNestedSelected
                                      ? theme.primary
                                      : theme.border
                                  }`,
                                  backgroundColor: isNestedSelected
                                    ? `${theme.primary}15`
                                    : theme.surface,
                                  transition: "all 0.2s ease",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="radio"
                                  name={`subclass-level${level}-nested-${choice.name}`}
                                  value={nestedChoice.name}
                                  checked={isNestedSelected}
                                  onChange={(e) => {
                                    if (!disabled) {
                                      handleSubclassChoiceChange(
                                        level,
                                        choice.name,
                                        false,
                                        e.target.value
                                      );
                                    }
                                  }}
                                  disabled={disabled}
                                  style={{
                                    margin: 0,
                                    accentColor: theme.primary,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                />
                                <span
                                  style={{
                                    color: isNestedSelected
                                      ? theme.primary
                                      : theme.text,
                                    fontWeight: isNestedSelected
                                      ? "600"
                                      : "500",
                                  }}
                                >
                                  {nestedChoice.name}
                                </span>
                              </label>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  };

  const renderLockedFeatures = (subclassData) => {
    const lockedLevels = getLockedLevels(subclassData);
    const featuresByLevel = parseAllFeaturesByLevel(subclassData);

    if (lockedLevels.length === 0) return null;

    return lockedLevels.map((level) => {
      const levelData = featuresByLevel[level];
      if (!levelData) return null;

      return (
        <div key={`locked-${level}`} style={styles.lockedFeature}>
          <h5
            style={{
              ...styles.levelHeader,
              color: theme.textSecondary,
            }}
          >
            Level {level} Features (Locked):
          </h5>
          <div style={styles.lockedContainer}>
            🔒 Unlocks when character reaches Level {level}
            <br />
            {levelData.features.length > 0 &&
              `${levelData.features.length} feature(s)`}
            {levelData.features.length > 0 &&
              levelData.choices.length > 0 &&
              " and "}
            {levelData.choices.length > 0 &&
              `${levelData.choices.length} choice(s)`}
          </div>
        </div>
      );
    });
  };

  const renderChoiceSummary = (choiceStatus) => {
    if (!selectedSubclassData || choiceStatus.total === 0) return null;

    const completedChoices = choiceStatus.levelsWithChoices.filter(
      (level) => normalizedSubclassChoices[level]
    );

    return (
      <div
        style={{
          backgroundColor: choiceStatus.isComplete
            ? `${theme.success}15`
            : `${theme.warning}15`,
          border: `1px solid ${
            choiceStatus.isComplete ? theme.success : theme.warning
          }`,
          borderRadius: "6px",
          padding: "12px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: choiceStatus.isComplete ? theme.success : theme.warning,
            marginBottom: "8px",
          }}
        >
          Subclass Choices Progress: {completedChoices.length}/
          {choiceStatus.total}
        </div>

        {choiceStatus.levelsWithChoices.map((level) => {
          const choice = normalizedSubclassChoices[level];
          const hasChoice = !!choice;
          const choiceDisplay = hasChoice
            ? typeof choice === "object"
              ? `${choice.mainChoice} (${choice.subChoice || "incomplete"})`
              : choice
            : null;

          return (
            <div
              key={level}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "4px",
                fontSize: "13px",
              }}
            >
              <span
                style={{
                  color: hasChoice ? theme.success : theme.warning,
                  marginRight: "8px",
                  fontWeight: "bold",
                }}
              >
                {hasChoice ? "✓" : "○"}
              </span>
              <span style={{ color: theme.textPrimary }}>
                Level {level}: {choiceDisplay || "Not selected"}
              </span>
            </div>
          );
        })}

        {!choiceStatus.isComplete && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: theme.textSecondary,
              fontStyle: "italic",
            }}
          >
            {characterLevel > 1
              ? "Complete all choices to finalize your subclass for this level range."
              : "Make your subclass choice to continue."}
          </div>
        )}
      </div>
    );
  };

  const hasSelectedSubclass = selectedSubclass ? 1 : 0;

  return (
    <div style={styles.fieldContainer}>
      <h3 style={styles.skillsHeader}>
        Subclass ({hasSelectedSubclass}/1 selected)
        {selectedSubclass && !choiceStatus.isComplete && (
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

      <div style={styles.helpText}>
        Choose a subclass to specialize your character's abilities and features.
        {choiceStatus.total > 0 &&
          ` You must make ${choiceStatus.total} choice${
            choiceStatus.total > 1 ? "s" : ""
          } for your selected subclass.`}
        {characterLevel > 1 && (
          <span
            style={{ display: "block", marginTop: "4px", fontStyle: "italic" }}
          >
            Character Level {characterLevel}: Features and choices for levels 1-
            {characterLevel} are available.
            {choiceStatus.total > 1 &&
              " All level-appropriate choices must be completed."}
          </span>
        )}
      </div>

      {selectedSubclass &&
        choiceStatus.total > 0 &&
        renderChoiceSummary(choiceStatus)}

      {hasSelectedSubclass === 1 && choiceStatus.isComplete && (
        <div style={styles.completionMessage}>
          ✓ Subclass selected: {selectedSubclass}
          {choiceStatus.total > 0 &&
            ` with ${choiceStatus.total} choice${
              choiceStatus.total > 1 ? "s" : ""
            } made`}
          {characterLevel > 1 && " (all level-appropriate choices completed)"}
        </div>
      )}

      {hasSelectedSubclass === 1 && !choiceStatus.isComplete && (
        <div style={styles.warningContainer}>
          ⚠️ Please make {choiceStatus.missing.length} more choice
          {choiceStatus.missing.length > 1 ? "s" : ""}
          {choiceStatus.missing.length > 0 &&
            ` (Level${
              choiceStatus.missing.length > 1 ? "s" : ""
            } ${choiceStatus.missing.join(", ")})`}
          to complete your subclass selection.
          {characterLevel > 1 && (
            <div
              style={{
                marginTop: "6px",
                fontSize: "13px",
                color: theme.textSecondary,
              }}
            >
              Higher level characters must complete all available subclass
              choices.
            </div>
          )}
        </div>
      )}

      <div style={styles.featsContainer}>
        {visibleSubclasses.map((subclass) => {
          const isSelected = selectedSubclass === subclass.name;
          const isExpanded = expandedSubclasses.has(subclass.name);
          const availableLevels = getAvailableLevels(subclass);
          const featuresByLevel = parseAllFeaturesByLevel(subclass);

          const totalChoices = availableLevels.reduce((total, level) => {
            return (
              total + (featuresByLevel[level]?.choices?.length > 0 ? 1 : 0)
            );
          }, 0);

          const levelRange =
            availableLevels.length > 1
              ? `${Math.min(...availableLevels)}-${Math.max(
                  ...availableLevels
                )}`
              : availableLevels[0] || 1;

          return (
            <div
              key={subclass.name}
              style={isSelected ? styles.featCardSelected : styles.featCard}
            >
              <div style={styles.featHeader}>
                <label style={styles.featLabelClickable}>
                  <input
                    type="checkbox"
                    name="subclass"
                    value={subclass.name}
                    checked={isSelected}
                    onChange={() => handleSubclassToggle(subclass.name)}
                    disabled={disabled}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "8px",
                      cursor: disabled ? "not-allowed" : "pointer",
                      accentColor: theme.primary,
                      transform: "scale(1.2)",
                    }}
                  />
                  <span
                    style={
                      isSelected ? styles.featNameSelected : styles.featName
                    }
                  >
                    {subclass.name}
                    {totalChoices > 0 && (
                      <span style={styles.availableChoicesIndicator}>
                        ({totalChoices} choice{totalChoices > 1 ? "s" : ""}
                        {characterLevel > 1 ? ` levels ${levelRange}` : ""})
                      </span>
                    )}
                  </span>
                </label>
                {!isSelected && (
                  <button
                    onClick={() => toggleSubclassExpansion(subclass.name)}
                    style={styles.expandButton}
                    type="button"
                    disabled={disabled}
                  >
                    {isExpanded ? "▲" : "▼"}
                  </button>
                )}
              </div>

              <div
                style={
                  isSelected ? styles.featPreviewSelected : styles.featPreview
                }
              >
                {subclass.description}
              </div>

              {(isExpanded || isSelected) && (
                <div
                  style={
                    isSelected
                      ? styles.featDescriptionSelected
                      : styles.featDescription
                  }
                >
                  {availableLevels.map((level) =>
                    renderLevelFeatures(subclass, level)
                  )}

                  {renderLockedFeatures(subclass)}

                  <div
                    style={isSelected ? styles.summarySelected : styles.summary}
                  >
                    <strong
                      style={
                        isSelected
                          ? styles.summaryTitleSelected
                          : styles.summaryTitle
                      }
                    >
                      Summary:
                    </strong>
                    <p style={styles.summaryText}>{subclass.summary}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={styles.helpText}>
        Note: Subclass is optional and represents your character's specialized
        training path. Features and choices are automatically available when you
        reach the required level.
        {characterLevel > 1 && (
          <span style={{ display: "block", marginTop: "4px" }}>
            For Level {characterLevel} characters, all subclass choices through
            level {characterLevel} must be completed if a subclass is selected.
          </span>
        )}
        {selectedSubclass && (
          <span
            style={{
              display: "block",
              marginTop: "4px",
              fontStyle: "italic",
              color: theme.success,
            }}
          >
            Uncheck the selected subclass to see all available options again.
          </span>
        )}
      </div>
    </div>
  );
};

export default SubclassSection;
