import { useState } from "react";
import { createFeatStyles } from "../../../styles/masterStyles";
import { useTheme } from "../../../contexts/ThemeContext";
import { backgroundsData } from "./backgroundsData";

const EnhancedBackgroundSelector = ({
  value,
  onChange,
  disabled = false,
  backgrounds: backgroundsList = [],
}) => {
  const { theme } = useTheme();
  const styles = createFeatStyles(theme);
  const [expandedBackgrounds, setExpandedBackgrounds] = useState(new Set());

  const selectedBackground = value || "";

  const handleBackgroundToggle = (backgroundName) => {
    if (selectedBackground === backgroundName) {
      onChange("");

      setExpandedBackgrounds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(backgroundName);
        return newSet;
      });
    } else {
      onChange(backgroundName);

      setExpandedBackgrounds((prev) => {
        const newSet = new Set(prev);
        newSet.add(backgroundName);
        return newSet;
      });
    }
  };

  const toggleBackgroundExpansion = (backgroundName) => {
    setExpandedBackgrounds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(backgroundName)) {
        newSet.delete(backgroundName);
      } else {
        newSet.add(backgroundName);
      }
      return newSet;
    });
  };

  const getAvailableBackgrounds = () => {
    if (backgroundsList.length > 0) {
      return backgroundsList.map((bg) => ({
        name: bg,
        data: backgroundsData[bg] || {
          name: bg,
          description: `A ${bg.toLowerCase()} student with their own unique story and perspective.`,
          preview: `${bg} background`,
          features: [
            {
              name: "Background Feature",
              description:
                "Your background provides unique experiences and perspectives that shape your character.",
            },
          ],
        },
      }));
    }

    return Object.values(backgroundsData).map((bg) => ({
      name: bg.name,
      data: bg,
    }));
  };

  const availableBackgrounds = getAvailableBackgrounds();

  return (
    <div style={styles.container}>
      <div style={styles.sectionHeader}>
        <h3 style={styles.skillsHeader}>Background</h3>
        {selectedBackground && (
          <span style={styles.selectionStatus}>
            Selected: {selectedBackground}
          </span>
        )}
      </div>

      <div style={styles.featsContainer}>
        {availableBackgrounds.map(({ name, data }) => {
          const isSelected = selectedBackground === name;
          const isExpanded = expandedBackgrounds.has(name);

          return (
            <div
              key={name}
              style={isSelected ? styles.featCardSelected : styles.featCard}
            >
              <div style={styles.featHeader}>
                <label style={styles.featLabelClickable}>
                  <input
                    type="radio"
                    name="background"
                    checked={isSelected}
                    onChange={() => handleBackgroundToggle(name)}
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
                    {data.name}
                    {data.skillProficiencies && (
                      <span style={styles.availableChoicesIndicator}>
                        ({data.skillProficiencies.length} skill
                        {data.skillProficiencies.length > 1 ? "s" : ""})
                      </span>
                    )}
                  </span>
                </label>
                <button
                  onClick={() => toggleBackgroundExpansion(name)}
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
                {data.preview || data.description}
              </div>

              {isExpanded && (
                <div
                  style={
                    isSelected
                      ? styles.featDescriptionSelected
                      : styles.featDescription
                  }
                >
                  {/* Full Description */}
                  <div style={{ marginBottom: "16px" }}>
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.5",
                        color: isSelected ? "#374151" : theme.textSecondary,
                        margin: "0 0 12px 0",
                      }}
                    >
                      {data.description}
                    </p>
                  </div>

                  {/* Skill Proficiencies */}
                  {data.skillProficiencies && (
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
                        {data.skillProficiencies.map((skill, index) => (
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
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tool Proficiencies */}
                  {data.toolProficiencies && (
                    <div style={{ marginBottom: "16px" }}>
                      <h5
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: isSelected ? "#047857" : theme.text,
                        }}
                      >
                        Tool Proficiencies:
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        {data.toolProficiencies.map((tool, index) => (
                          <span
                            key={index}
                            style={{
                              fontSize: "12px",
                              padding: "4px 8px",
                              backgroundColor: isSelected
                                ? "#F59E0B20"
                                : theme.warning + "20",
                              color: isSelected ? "#D97706" : theme.warning,
                              borderRadius: "12px",
                              border: `1px solid ${
                                isSelected ? "#F59E0B" : theme.warning
                              }`,
                            }}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Background Features */}
                  {data.features && (
                    <div style={{ marginBottom: "16px" }}>
                      <h5
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: isSelected ? "#047857" : theme.text,
                        }}
                      >
                        Background Features:
                      </h5>
                      {data.features.map((feature, index) => (
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
                              color: isSelected
                                ? "#374151"
                                : theme.textSecondary,
                              marginLeft: "4px",
                              lineHeight: "1.4",
                            }}
                          >
                            {feature.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Background Bonus */}
                  {data.backgroundBonus && (
                    <div style={{ marginBottom: "16px" }}>
                      <h5
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: isSelected ? "#047857" : theme.text,
                        }}
                      >
                        Background Bonus:
                      </h5>
                      <p
                        style={{
                          fontSize: "13px",
                          color: isSelected ? "#374151" : theme.textSecondary,
                          margin: "0",
                          lineHeight: "1.4",
                          fontStyle: "italic",
                        }}
                      >
                        {data.backgroundBonus}
                      </p>
                    </div>
                  )}

                  {/* Equipment */}
                  {data.typicalEquipment && (
                    <div style={{ marginBottom: "8px" }}>
                      <h5
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: isSelected ? "#047857" : theme.text,
                        }}
                      >
                        Typical Equipment:
                      </h5>
                      <p
                        style={{
                          fontSize: "13px",
                          color: isSelected ? "#374151" : theme.textSecondary,
                          margin: "0",
                          lineHeight: "1.4",
                        }}
                      >
                        {data.typicalEquipment}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={styles.helpText}>
        Your background represents your character's life before attending magic
        school. It provides skill proficiencies, special features, and roleplay
        opportunities that help define who your character is beyond their
        magical abilities.
      </div>
    </div>
  );
};

export default EnhancedBackgroundSelector;
