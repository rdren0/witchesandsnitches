import { useState } from "react";
import { subclassesData } from "./subclassesData";
import { createFeatStyles } from "../../../styles/masterStyles";
import { useTheme } from "../../../contexts/ThemeContext";

const EnhancedSubclassSelector = ({
  value,
  onChange,
  subclassChoices: externalSubclassChoices,
  onSubclassChoicesChange,
  characterLevel = 1,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles = createFeatStyles(theme);
  const [expandedSubclasses, setExpandedSubclasses] = useState(new Set());
  // Manage subclass choices internally if not provided externally
  const [internalSubclassChoices, setInternalSubclassChoices] = useState({});

  // Use external choices if provided, otherwise use internal state
  const subclassChoices = externalSubclassChoices || internalSubclassChoices;
  const setSubclassChoices =
    onSubclassChoicesChange || setInternalSubclassChoices;

  const selectedSubclass = value || "";
  const selectedSubclassData = selectedSubclass
    ? subclassesData[selectedSubclass]
    : null;

  const handleSubclassToggle = (subclassName) => {
    if (selectedSubclass === subclassName) {
      // Deselecting subclass - clear all choices and collapse
      onChange("");
      setSubclassChoices({});
      // Collapse the subclass when deselecting
      setExpandedSubclasses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(subclassName);
        return newSet;
      });
    } else {
      // Selecting new subclass - clear previous choices
      onChange(subclassName);
      setSubclassChoices({});
      // Auto-expand the newly selected subclass
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

  // Parse higher level features to extract choice levels (filtered by character level)
  const parseChoicesFromFeatures = (subclassData) => {
    if (!subclassData) return {};

    const choicesByLevel = {};

    // Add level 1 choices if they exist and character is level 1 or higher
    if (
      subclassData.level1Choices &&
      subclassData.level1Choices.length > 0 &&
      characterLevel >= 1
    ) {
      choicesByLevel[1] = subclassData.level1Choices;
    }

    // Parse higher level features for choices
    if (subclassData.higherLevelFeatures) {
      subclassData.higherLevelFeatures.forEach((feature) => {
        // Only include features for levels the character has reached
        if (characterLevel >= feature.level) {
          // Check if this feature has choices (contains "Choose:" in description)
          if (feature.description && feature.description.includes("Choose:")) {
            // Extract choices from the description
            const choicesText = feature.description.split("Choose:")[1];
            if (choicesText) {
              // Parse individual choices (split by " or ")
              const choices = choicesText.split(" or ").map((choice) => {
                // Clean up the choice text and extract name
                const cleanChoice = choice.trim().split("(")[0].trim();
                return {
                  name: cleanChoice,
                  description: choice.trim(),
                };
              });

              choicesByLevel[feature.level] = choices;
            }
          }
        }
      });
    }

    return choicesByLevel;
  };

  // Get all available choice levels for the current character level
  const getAvailableChoiceLevels = (subclassData) => {
    if (!subclassData) return [];

    const choicesByLevel = parseChoicesFromFeatures(subclassData);
    return Object.keys(choicesByLevel)
      .map((level) => parseInt(level))
      .sort((a, b) => a - b);
  };

  // Check if all required choices are made
  const getRequiredChoices = (subclassData) => {
    if (!subclassData) return { total: 0, missing: [], isComplete: true };

    const availableLevels = getAvailableChoiceLevels(subclassData);
    const missingChoices = availableLevels.filter(
      (level) => !subclassChoices[level]
    );

    return {
      total: availableLevels.length,
      missing: missingChoices,
      isComplete: missingChoices.length === 0,
    };
  };

  const hasSelectedSubclass = selectedSubclass ? 1 : 0;
  const choiceStatus = selectedSubclassData
    ? getRequiredChoices(selectedSubclassData)
    : { total: 0, missing: [], isComplete: true };

  const renderSubclassChoices = (subclassData, level) => {
    const choicesByLevel = parseChoicesFromFeatures(subclassData);
    const choices = choicesByLevel[level];

    if (!choices || choices.length === 0) return null;

    const selectedChoice = subclassChoices[level];

    return (
      <div key={level} style={{ marginBottom: "16px" }}>
        <h5
          style={{
            margin: "0 0 12px 0",
            fontSize: "14px",
            fontWeight: "600",
            color:
              selectedSubclass === subclassData.name ? "#047857" : theme.text,
          }}
        >
          Choose One at Level {level}:
          {selectedSubclass === subclassData.name && (
            <span
              style={{
                color: selectedChoice ? theme.success : theme.warning,
                fontSize: "12px",
                fontWeight: "normal",
                marginLeft: "8px",
              }}
            >
              {selectedChoice ? "✓ Selected" : "* Required"}
            </span>
          )}
        </h5>

        {selectedSubclass === subclassData.name && (
          <div
            style={{
              marginBottom: "12px",
              fontSize: "12px",
              color: theme.textSecondary,
              fontStyle: "italic",
            }}
          >
            Select one of the following options for Level {level}:
            <br />
            <strong>Current selection: {selectedChoice || "None"}</strong>
          </div>
        )}

        {choices.map((choice, index) => (
          <div
            key={`${level}-${index}`}
            style={{
              marginBottom: "12px",
              padding: "12px",
              backgroundColor:
                selectedSubclass === subclassData.name
                  ? selectedChoice === choice.name
                    ? "#ECFDF5"
                    : "#F0FDF4"
                  : theme.surface,
              borderRadius: "6px",
              border: `2px solid ${
                selectedSubclass === subclassData.name &&
                selectedChoice === choice.name
                  ? "#10B981"
                  : selectedSubclass === subclassData.name
                  ? "#D1FAE5"
                  : theme.border
              }`,
              transition: "all 0.2s ease",
            }}
          >
            {selectedSubclass === subclassData.name && (
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
                onClick={(e) => {
                  // Prevent label click from bubbling up
                  e.stopPropagation();
                }}
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
                  style={{
                    marginTop: "2px",
                    accentColor: "#10B981",
                    cursor: disabled ? "not-allowed" : "pointer",
                    width: "16px",
                    height: "16px",
                  }}
                  onClick={(e) => {
                    // Ensure the click event is handled
                    e.stopPropagation();
                    console.log(`Radio button clicked: ${choice.name}`);
                  }}
                />
                <div style={{ flex: 1 }}>
                  <strong
                    style={{
                      fontSize: "13px",
                      color:
                        selectedChoice === choice.name ? "#047857" : "#10B981",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {choice.name}
                  </strong>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#1F2937",
                      lineHeight: "1.4",
                    }}
                  >
                    {choice.description}
                  </p>
                </div>
              </label>
            )}

            {selectedSubclass !== subclassData.name && (
              <>
                <strong
                  style={{
                    fontSize: "13px",
                    color: theme.primary,
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  {choice.name}
                </strong>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: theme.text,
                    lineHeight: "1.4",
                  }}
                >
                  {choice.description}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

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
            Only choices for levels 1-{characterLevel} are available based on
            your character level.
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
        <div
          style={{
            ...styles.helpText,
            color: theme.warning,
            backgroundColor: theme.warning + "20",
            padding: "8px 12px",
            borderRadius: "4px",
            border: `1px solid ${theme.warning}40`,
          }}
        >
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
          const availableChoiceLevels = getAvailableChoiceLevels(subclass);

          return (
            <div
              key={subclass.name}
              style={isSelected ? styles.featCardSelected : styles.featCard}
            >
              <div style={styles.featHeader}>
                <label style={styles.featLabelClickable}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSubclassToggle(subclass.name)}
                    disabled={disabled}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "8px",
                      cursor: disabled ? "not-allowed" : "pointer",
                      accentColor: "#8B5CF6",
                      transform: "scale(1.2)",
                    }}
                  />
                  <span
                    style={
                      isSelected ? styles.featNameSelected : styles.featName
                    }
                  >
                    {subclass.name}
                    {availableChoiceLevels.length > 0 && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: theme.textSecondary,
                          marginLeft: "4px",
                        }}
                      >
                        ({availableChoiceLevels.length} choice
                        {availableChoiceLevels.length > 1 ? "s" : ""} available)
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
                  {/* Level 1 Features */}
                  <div style={{ marginBottom: "16px" }}>
                    <h5
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: isSelected ? "#047857" : theme.text,
                      }}
                    >
                      Level 1 Features:
                    </h5>
                    {subclass.level1Features.map((feature, index) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <strong
                          style={{
                            fontSize: "13px",
                            color: isSelected ? "#10B981" : theme.primary,
                          }}
                        >
                          {feature.name}:
                        </strong>
                        <span
                          style={{
                            fontSize: "13px",
                            color: isSelected ? "#1F2937" : theme.text,
                            marginLeft: "6px",
                          }}
                        >
                          {feature.description}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic level choices */}
                  {availableChoiceLevels.map((level) =>
                    renderSubclassChoices(subclass, level)
                  )}

                  {/* Show unavailable choices if character level is too low */}
                  {subclass.higherLevelFeatures && (
                    <div>
                      {subclass.higherLevelFeatures
                        .filter(
                          (feature) =>
                            characterLevel < feature.level &&
                            feature.description &&
                            feature.description.includes("Choose:")
                        )
                        .map((feature, index) => (
                          <div
                            key={index}
                            style={{ marginBottom: "12px", opacity: 0.6 }}
                          >
                            <h5
                              style={{
                                margin: "0 0 8px 0",
                                fontSize: "14px",
                                fontWeight: "600",
                                color: theme.textSecondary,
                              }}
                            >
                              Level {feature.level} Choice (Locked):
                            </h5>
                            <div
                              style={{
                                padding: "8px 12px",
                                backgroundColor: theme.surface,
                                borderRadius: "4px",
                                border: `1px solid ${theme.border}`,
                                fontSize: "12px",
                                color: theme.textSecondary,
                                fontStyle: "italic",
                              }}
                            >
                              🔒 Unlocks when character reaches Level{" "}
                              {feature.level}
                              <br />
                              {feature.description.split("Choose:")[0].trim()}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Summary */}
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: isSelected
                        ? "#ECFDF5"
                        : theme.primary + "10",
                      borderRadius: "6px",
                      borderLeft: `4px solid ${
                        isSelected ? "#10B981" : theme.primary
                      }`,
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "12px",
                        color: isSelected ? "#10B981" : theme.primary,
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Summary:
                    </strong>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: isSelected ? "#1F2937" : theme.text,
                        fontStyle: "italic",
                        lineHeight: "1.4",
                      }}
                    >
                      {subclass.summary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={styles.helpText}>
        Note: Subclass is optional and represents your character's specialized
        training path. Some subclasses require choices at multiple levels based
        on your character level. Choices are automatically available when you
        reach the required level.
      </div>
    </div>
  );
};

export default EnhancedSubclassSelector;
