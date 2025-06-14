import { useState } from "react";
import { subclassesData } from "../../data";
import { createFeatStyles } from "../../../styles/masterStyles";
import { useTheme } from "../../../contexts/ThemeContext";

const EnhancedSubclassSelector = ({ value, onChange, disabled = false }) => {
  const { theme } = useTheme();
  const styles = createFeatStyles(theme);
  const [expandedSubclasses, setExpandedSubclasses] = useState(new Set());

  const handleSubclassToggle = (subclassName) => {
    const newValue = value === subclassName ? "" : subclassName;
    onChange(newValue);
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

  const hasSelectedSubclass = value ? 1 : 0;

  return (
    <div style={styles.fieldContainer}>
      <h3 style={styles.skillsHeader}>
        Subclass ({hasSelectedSubclass}/1 selected)
      </h3>

      <div style={styles.helpText}>
        Choose a subclass to specialize your character's abilities and features.
      </div>

      {hasSelectedSubclass === 1 && (
        <div style={styles.completionMessage}>
          ✓ Subclass selected! Click the checkbox to unselect and choose a
          different subclass.
        </div>
      )}

      <div style={styles.featsContainer}>
        {Object.values(subclassesData).map((subclass) => {
          const isSelected = value === subclass.name;
          const isExpanded = expandedSubclasses.has(subclass.name);

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

                  {/* Level 1 Choices */}
                  {subclass.level1Choices &&
                    subclass.level1Choices.length > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <h5
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: isSelected ? "#047857" : theme.text,
                          }}
                        >
                          Choose One at Level 1:
                        </h5>
                        {subclass.level1Choices.map((choice, index) => (
                          <div
                            key={index}
                            style={{
                              marginBottom: "12px",
                              padding: "12px",
                              backgroundColor: isSelected
                                ? "#F0FDF4"
                                : theme.surface,
                              borderRadius: "6px",
                              border: `1px solid ${
                                isSelected ? "#D1FAE5" : theme.border
                              }`,
                            }}
                          >
                            <strong
                              style={{
                                fontSize: "13px",
                                color: isSelected ? "#10B981" : theme.primary,
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
                                color: isSelected ? "#1F2937" : theme.text,
                                lineHeight: "1.4",
                              }}
                            >
                              {choice.description}
                            </p>
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
        training path. You can select one subclass that provides unique
        abilities and features. Click the checkbox to select/unselect a subclass
        and use the arrow to expand details.
      </div>
    </div>
  );
};

export default EnhancedSubclassSelector;
