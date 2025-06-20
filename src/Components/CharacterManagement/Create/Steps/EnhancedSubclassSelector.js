import { useState, useEffect, useCallback, useMemo } from "react";
import { subclassesData } from "../../Shared/subclassesData";
import { createFeatStyles } from "../../../../styles/masterStyles";
import { useTheme } from "../../../../contexts/ThemeContext";
import { characterService } from "../../../../services/characterService";

const EnhancedSubclassSelector = ({
  value,
  onChange,
  subclassChoices: externalSubclassChoices,
  onSubclassChoicesChange,
  characterLevel = 1,
  disabled = false,

  characterId = null,
  discordUserId = null,
  autoSave = false,
  onSaveError = null,
  onSaveSuccess = null,
}) => {
  const { theme } = useTheme();
  const styles = createFeatStyles(theme);
  const [expandedSubclasses, setExpandedSubclasses] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [internalSubclassChoices, setInternalSubclassChoices] = useState({});
  // const [hasInitializedChoices, setHasInitializedChoices] = useState(false);

  const subclassChoices = externalSubclassChoices || internalSubclassChoices;
  const setSubclassChoices =
    onSubclassChoicesChange || setInternalSubclassChoices;

  const selectedSubclass = value || "";
  const selectedSubclassData = selectedSubclass
    ? subclassesData[selectedSubclass]
    : null;

  const sortedSubclasses = useMemo(() => {
    const subclassArray = Object.values(subclassesData);

    if (!selectedSubclass) {
      return subclassArray;
    }

    const selectedClass = subclassArray.find(
      (sc) => sc.name === selectedSubclass
    );
    const otherClasses = subclassArray
      .filter((sc) => sc.name !== selectedSubclass)
      .sort((a, b) => a.name.localeCompare(b.name));

    return selectedClass ? [selectedClass, ...otherClasses] : subclassArray;
  }, [selectedSubclass]);

  const normalizeSubclassChoices = (choices) => {
    if (!choices || typeof choices !== "object") return {};

    const normalized = {};
    Object.entries(choices).forEach(([level, choice]) => {
      if (choice) {
        if (typeof choice === "string") {
          normalized[level] = choice;
        } else if (typeof choice === "object" && choice.name) {
          normalized[level] = choice.name;
        } else if (typeof choice === "object" && choice.selectedChoice) {
          normalized[level] = choice.selectedChoice;
        } else if (typeof choice === "object" && choice.choice) {
          normalized[level] = choice.choice;
        } else {
          normalized[level] = String(choice);
        }
      }
    });

    return normalized;
  };

  const normalizedSubclassChoices = normalizeSubclassChoices(subclassChoices);

  useEffect(() => {
    if (
      externalSubclassChoices &&
      Object.keys(externalSubclassChoices).length > 0
    ) {
      const normalized = normalizeSubclassChoices(externalSubclassChoices);
      setInternalSubclassChoices(normalized);
      // setHasInitializedChoices(true);
    }
  }, [externalSubclassChoices]);

  // Auto-expand selected subclass, especially for higher level characters
  useEffect(() => {
    if (selectedSubclass && selectedSubclass.trim() !== "") {
      setExpandedSubclasses((prev) => {
        const newSet = new Set(prev);
        newSet.add(selectedSubclass);
        return newSet;
      });
    }
  }, [selectedSubclass]);

  // For higher level characters, auto-expand to show all required choices
  useEffect(() => {
    if (characterLevel > 1 && selectedSubclass && selectedSubclassData) {
      const requiredChoices = getRequiredChoices(selectedSubclassData);
      if (requiredChoices.total > 0 && !requiredChoices.isComplete) {
        setExpandedSubclasses((prev) => {
          const newSet = new Set(prev);
          newSet.add(selectedSubclass);
          return newSet;
        });
      }
    }
    // eslint-disable-next-line
  }, [
    characterLevel,
    selectedSubclass,
    selectedSubclassData,
    normalizedSubclassChoices,
  ]);

  const saveToDatabase = useCallback(
    async (subclass, choices) => {
      if (!autoSave || !characterId || !discordUserId) return;

      setSaving(true);
      setSaveError(null);

      try {
        const normalizedChoices = normalizeSubclassChoices(choices);
        await characterService.updateCharacterSubclass(
          characterId,
          subclass,
          normalizedChoices,
          discordUserId
        );
        onSaveSuccess && onSaveSuccess();
      } catch (error) {
        console.error("Failed to save subclass choices:", error);
        setSaveError(error.message);
        onSaveError && onSaveError(error);
      } finally {
        setSaving(false);
      }
    },
    [autoSave, characterId, discordUserId, onSaveError, onSaveSuccess]
  );

  useEffect(() => {
    if (!autoSave) return;

    const timeoutId = setTimeout(() => {
      saveToDatabase(selectedSubclass, normalizedSubclassChoices);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [selectedSubclass, normalizedSubclassChoices, saveToDatabase, autoSave]);

  useEffect(() => {
    const loadCharacterData = async () => {
      if (!characterId || !discordUserId) return;

      try {
        const character = await characterService.getCharacterById(
          characterId,
          discordUserId
        );
        if (character.subclass && !value) {
          onChange && onChange(character.subclass);
        }

        const characterSubclassChoices =
          character.subclass_choices || character.subclassChoices || {};

        if (
          Object.keys(characterSubclassChoices).length > 0 &&
          !externalSubclassChoices
        ) {
          const normalized = normalizeSubclassChoices(characterSubclassChoices);
          setInternalSubclassChoices(normalized);
          // setHasInitializedChoices(true);
        }
      } catch (error) {
        console.error("Failed to load character data:", error);
        setSaveError(`Failed to load character: ${error.message}`);
      }
    };

    loadCharacterData();
  }, [characterId, discordUserId, value, onChange, externalSubclassChoices]);

  const handleSubclassToggle = async (subclassName) => {
    if (selectedSubclass === subclassName) {
      onChange("");
      setSubclassChoices({});

      setExpandedSubclasses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(subclassName);
        return newSet;
      });
    } else {
      onChange(subclassName);

      setExpandedSubclasses((prev) => {
        const newSet = new Set(prev);
        newSet.add(subclassName);
        return newSet;
      });
    }
  };

  const handleSubclassChoiceChange = (level, choiceName) => {
    const newChoices = {
      ...normalizedSubclassChoices,
      [level]: choiceName,
    };
    setSubclassChoices(newChoices);
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

  const parseAllFeaturesByLevel = (subclassData) => {
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
          featuresByLevel[level].choices = feature.choices;

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
  };

  const getAvailableLevels = (subclassData) => {
    if (!subclassData) return [];

    const featuresByLevel = parseAllFeaturesByLevel(subclassData);
    const allLevels = Object.keys(featuresByLevel).map((level) =>
      parseInt(level)
    );
    const availableLevels = allLevels.filter(
      (level) => level <= characterLevel
    );

    return availableLevels.sort((a, b) => a - b);
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

  const getRequiredChoices = (subclassData) => {
    if (!subclassData)
      return { total: 0, missing: [], missingByLevel: {}, isComplete: true };

    const featuresByLevel = parseAllFeaturesByLevel(subclassData);
    const availableLevels = getAvailableLevels(subclassData);

    const levelsWithChoices = availableLevels.filter(
      (level) =>
        featuresByLevel[level] && featuresByLevel[level].choices.length > 0
    );

    const missingChoices = levelsWithChoices.filter(
      (level) => !normalizedSubclassChoices[level]
    );

    // Create a detailed breakdown by level
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

        {/* Regular features */}
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

        {/* Choices */}
        {hasChoices && (
          <>
            {isSelected && (
              <div style={styles.choiceInfo}>
                Select one of the following options for Level {level}:
                <br />
                <strong>Current selection: {selectedChoice || "None"}</strong>
              </div>
            )}
            {levelData.choices.map((choice, index) => {
              const isChoiceSelected = selectedChoice === choice.name;

              return (
                <div
                  key={`choice-${index}`}
                  style={
                    isSelected
                      ? isChoiceSelected
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
                        checked={isChoiceSelected}
                        onChange={(e) => {
                          if (!disabled) {
                            handleSubclassChoiceChange(level, e.target.value);
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
                            isChoiceSelected
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
                      <strong style={styles.featureName}>{choice.name}</strong>
                      <p style={styles.featureDescription}>
                        {choice.description}
                      </p>
                    </>
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

  // Enhanced choice summary for higher level characters
  const renderChoiceSummary = (choiceStatus) => {
    if (!selectedSubclassData || choiceStatus.total === 0) return null;

    const completedChoices = choiceStatus.levelsWithChoices.filter(
      (level) => normalizedSubclassChoices[level]
    );

    return (
      <div
        style={{
          ...styles.choiceSummary,
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
          const hasChoice = normalizedSubclassChoices[level];
          const choiceName = hasChoice
            ? normalizedSubclassChoices[level]
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
                Level {level}: {choiceName || "Not selected"}
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
  const choiceStatus = selectedSubclassData
    ? getRequiredChoices(selectedSubclassData)
    : { total: 0, missing: [], missingByLevel: {}, isComplete: true };

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

      {/* Save Status Display */}
      {autoSave && (saving || saveError) && (
        <div
          style={{
            ...styles.saveStatus,
            ...(saving ? styles.saveStatusSaving : styles.saveStatusError),
          }}
        >
          {saving ? (
            <>
              <span>💾</span>
              <span>Saving choices...</span>
            </>
          ) : saveError ? (
            <>
              <span>⚠️</span>
              <span>Save failed: {saveError}</span>
            </>
          ) : null}
        </div>
      )}

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
        {autoSave && characterId && (
          <span
            style={{
              display: "block",
              marginTop: "4px",
              fontStyle: "italic",
              color: theme.textSecondary,
            }}
          >
            Your choices are automatically saved.
          </span>
        )}
      </div>

      {/* Enhanced choice summary for higher level characters */}
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
        {sortedSubclasses.map((subclass) => {
          const isSelected = selectedSubclass === subclass.name;
          const isExpanded = expandedSubclasses.has(subclass.name);
          const availableLevels = getAvailableLevels(subclass);
          const featuresByLevel = parseAllFeaturesByLevel(subclass);

          const totalChoices = availableLevels.reduce((total, level) => {
            return (
              total + (featuresByLevel[level]?.choices?.length > 0 ? 1 : 0)
            );
          }, 0);

          // Show level range for higher level characters
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
                    type="radio"
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
                <button
                  onClick={() => toggleSubclassExpansion(subclass.name)}
                  style={styles.expandButton}
                  type="button"
                  disabled={disabled}
                >
                  {isExpanded ? "▲" : "▼"}
                </button>
              </div>

              <div
                style={
                  isSelected ? styles.featPreviewSelected : styles.featPreview
                }
              >
                {subclass.description}
              </div>

              {isExpanded && (
                <div
                  style={
                    isSelected
                      ? styles.featDescriptionSelected
                      : styles.featDescription
                  }
                >
                  {/* Render all available level features */}
                  {availableLevels.map((level) =>
                    renderLevelFeatures(subclass, level)
                  )}

                  {/* Show locked features */}
                  {renderLockedFeatures(subclass)}

                  {/* Summary */}
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
            level {characterLevel}
            must be completed if a subclass is selected.
          </span>
        )}
      </div>
    </div>
  );
};

export default EnhancedSubclassSelector;
