import { useState, useEffect, useCallback } from "react";
import { subclassesData } from "./subclassesData";
import { createFeatStyles } from "../../../styles/masterStyles";
import { useTheme } from "../../../contexts/ThemeContext";
import { characterService } from "../../../services/characterService";

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

  const subclassChoices = externalSubclassChoices || internalSubclassChoices;
  const setSubclassChoices =
    onSubclassChoicesChange || setInternalSubclassChoices;

  const selectedSubclass = value || "";
  const selectedSubclassData = selectedSubclass
    ? subclassesData[selectedSubclass]
    : null;

  const saveToDatabase = useCallback(
    async (subclass, choices) => {
      if (!autoSave || !characterId || !discordUserId) return;

      setSaving(true);
      setSaveError(null);

      try {
        await characterService.updateCharacterSubclass(
          characterId,
          subclass,
          choices,
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
      saveToDatabase(selectedSubclass, subclassChoices);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [selectedSubclass, subclassChoices, saveToDatabase, autoSave]);

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
        if (character.subclass_choices && !externalSubclassChoices) {
          setInternalSubclassChoices(character.subclass_choices);
        }
      } catch (error) {
        console.error("Failed to load character data:", error);
        setSaveError(`Failed to load character: ${error.message}`);
      }
    };

    loadCharacterData();
    // eslint-disable-next-line
  }, [characterId, discordUserId]);

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
      setSubclassChoices({});

      setExpandedSubclasses((prev) => {
        const newSet = new Set(prev);
        newSet.add(subclassName);
        return newSet;
      });
    }
  };

  const handleSubclassChoiceChange = (level, choiceName) => {
    console.log(
      `Subclass choice changed - Level: ${level}, Choice: ${choiceName}`
    );
    const newChoices = {
      ...subclassChoices,
      [level]: choiceName,
    };
    console.log("New choices:", newChoices);
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

    console.log(`Character Level: ${characterLevel}`);
    console.log("Parsed features by level:", featuresByLevel);

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

    console.log(`All levels for ${subclassData.name}:`, allLevels);
    console.log(
      `Available levels (character level ${characterLevel}):`,
      availableLevels
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

    console.log(
      `Locked levels for ${subclassData.name} (character level ${characterLevel}):`,
      lockedLevels
    );

    return lockedLevels.sort((a, b) => a - b);
  };

  const getRequiredChoices = (subclassData) => {
    if (!subclassData) return { total: 0, missing: [], isComplete: true };

    const featuresByLevel = parseAllFeaturesByLevel(subclassData);
    const availableLevels = getAvailableLevels(subclassData);

    const levelsWithChoices = availableLevels.filter(
      (level) =>
        featuresByLevel[level] && featuresByLevel[level].choices.length > 0
    );

    const missingChoices = levelsWithChoices.filter(
      (level) => !subclassChoices[level]
    );

    return {
      total: levelsWithChoices.length,
      missing: missingChoices,
      isComplete: missingChoices.length === 0,
    };
  };

  const renderLevelFeatures = (subclassData, level) => {
    const featuresByLevel = parseAllFeaturesByLevel(subclassData);
    const levelData = featuresByLevel[level];

    if (!levelData) return null;

    const isSelected = selectedSubclass === subclassData.name;
    const selectedChoice = subclassChoices[level];
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

            {levelData.choices.map((choice, index) => (
              <div
                key={`choice-${index}`}
                style={
                  isSelected
                    ? selectedChoice === choice.name
                      ? styles.choiceContainerSelectedOption
                      : styles.choiceContainerSelected
                    : styles.choiceContainer
                }
              >
                {isSelected ? (
                  <label
                    style={
                      disabled ? styles.choiceLabelDisabled : styles.choiceLabel
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="radio"
                      name={`subclass-level${level}-choice`}
                      value={choice.name}
                      checked={selectedChoice === choice.name}
                      onChange={(e) => {
                        if (!disabled) {
                          console.log(`Radio onChange: ${e.target.value}`);
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
                        console.log(`Radio button clicked: ${choice.name}`);
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong
                        style={
                          selectedChoice === choice.name
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
            ))}
          </>
        )}
      </div>
    );
  };

  const renderLockedFeatures = (subclassData) => {
    const lockedLevels = getLockedLevels(subclassData);
    const featuresByLevel = parseAllFeaturesByLevel(subclassData);

    console.log(`Locked levels for ${subclassData.name}:`, lockedLevels);
    console.log(`Character level: ${characterLevel}`);

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

  const hasSelectedSubclass = selectedSubclass ? 1 : 0;
  const choiceStatus = selectedSubclassData
    ? getRequiredChoices(selectedSubclassData)
    : { total: 0, missing: [], isComplete: true };

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
            Only features and choices for levels 1-{characterLevel} are
            available based on your character level.
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

      {hasSelectedSubclass === 1 && choiceStatus.isComplete && (
        <div style={styles.completionMessage}>
          ✓ Subclass selected: {selectedSubclass}
          {choiceStatus.total > 0 &&
            ` with ${choiceStatus.total} choice${
              choiceStatus.total > 1 ? "s" : ""
            } made`}
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
        </div>
      )}

      <div style={styles.featsContainer}>
        {Object.values(subclassesData).map((subclass) => {
          const isSelected = selectedSubclass === subclass.name;
          const isExpanded = expandedSubclasses.has(subclass.name);
          const availableLevels = getAvailableLevels(subclass);
          const featuresByLevel = parseAllFeaturesByLevel(subclass);

          const totalChoices = availableLevels.reduce((total, level) => {
            return (
              total + (featuresByLevel[level]?.choices?.length > 0 ? 1 : 0)
            );
          }, 0);

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
                        ({totalChoices} choice{totalChoices > 1 ? "s" : ""}{" "}
                        available)
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
      </div>
    </div>
  );
};

export default EnhancedSubclassSelector;
