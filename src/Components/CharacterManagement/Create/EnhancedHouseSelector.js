import React, { useState, useEffect } from "react";
import {
  schoolGroups,
  houseFeatures,
  houseAbilityBonuses,
  houseColors,
} from "../Shared/houseData";
import { createFeatStyles } from "../../../styles/masterStyles";
import { useTheme } from "../../../contexts/ThemeContext";

const createHouseSpecificStyles = (theme, baseStyles) => ({
  ...baseStyles,

  infoCard: {
    marginBottom: "16px",
    padding: "16px",
    backgroundColor: theme.surface,
    borderRadius: "8px",
    border: `1px solid ${theme.border}`,
  },
  infoCardTitle: {
    margin: "0 0 8px 0",
    color: theme.text,
    fontSize: "18px",
    fontWeight: "600",
  },
  infoCardText: {
    margin: 0,
    color: theme.textSecondary,
    fontSize: "14px",
  },
  schoolGroup: {
    marginBottom: "24px",
  },
  schoolGroupTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: theme.text,
    marginBottom: "12px",
    padding: "8px 12px",
    backgroundColor: theme.surface,
    borderRadius: "6px",
    border: `1px solid ${theme.border}`,
    textAlign: "center",
  },
  schoolDivider: {
    margin: "24px 0",
    padding: "16px 0",
    borderTop: `2px solid ${theme.border}`,
    borderBottom: `1px solid ${theme.border}`,
    backgroundColor: theme.surface,
    borderRadius: "4px",
    position: "relative",
  },
  dividerText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: theme.background,
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: theme.textSecondary,
    borderRadius: "4px",
    border: `1px solid ${theme.border}`,
  },
  schoolContainer: {
    marginBottom: "12px",
  },
  schoolButton: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "16px",
    fontWeight: "500",
    color: theme.text,
    transition: "all 0.2s ease",
  },
  schoolButtonContent: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  schoolContent: {
    marginTop: "8px",
    paddingLeft: "16px",
  },
  houseContainer: {
    marginBottom: "8px",
  },
  houseButton: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: theme.surface,
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "500",
    color: theme.text,
    transition: "all 0.2s ease",
  },
  houseButtonContent: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  houseRadio: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: `2px solid ${theme.border}`,
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  houseRadioDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: theme.surface,
  },
  houseDetails: {
    marginTop: "8px",
    padding: "16px",
    backgroundColor: theme.background,
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
  },
  sectionContainer: {
    marginBottom: "16px",
  },
  sectionTitle: {
    margin: "0 0 8px 0",
    fontSize: "14px",
    fontWeight: "600",
    color: theme.text,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  abilityBonusContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  abilityBonus: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
  featureContainer: {
    marginBottom: "12px",
  },
  featureCard: {
    padding: "12px",
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: "6px",
  },
  featureName: {
    margin: "0 0 6px 0",
    fontSize: "13px",
    fontWeight: "600",
    color: theme.primary,
  },
  featureDescription: {
    margin: 0,
    fontSize: "12px",
    color: theme.textSecondary,
    lineHeight: "1.4",
  },
  choiceText: {
    margin: "0 0 8px 0",
    fontSize: "12px",
    color: theme.textSecondary,
    fontStyle: "italic",
  },
  optionContainer: {
    marginBottom: "8px",
  },
  optionLabel: {
    display: "block",
    cursor: "pointer",
  },
  optionContent: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    padding: "8px",
    borderRadius: "4px",
    border: `1px solid ${theme.border}`,
    transition: "all 0.2s ease",
  },
  optionDetails: {
    flex: 1,
  },
  optionName: {
    fontSize: "12px",
    fontWeight: "600",
    color: theme.text,
    marginBottom: "2px",
  },
  optionDescription: {
    fontSize: "11px",
    color: theme.textSecondary,
    lineHeight: "1.3",
  },
});

const EnhancedHouseSelector = ({
  selectedHouse,
  onHouseSelect = () => {},
  houseChoices = {},
  onHouseChoiceSelect = () => {},
  readOnly = false,
}) => {
  const { theme } = useTheme();
  const baseStyles = createFeatStyles(theme);
  const styles = createHouseSpecificStyles(theme, baseStyles);

  const [expandedSchool, setExpandedSchool] = useState(null);
  const [expandedHouse, setExpandedHouse] = useState(null);

  const formatAbilityName = (ability) => {
    return ability.charAt(0).toUpperCase() + ability.slice(1);
  };

  useEffect(() => {
    if (selectedHouse) {
      const allSchools = {
        ...schoolGroups.main.schools,
        ...schoolGroups.international.schools,
      };
      const schoolWithHouse = Object.entries(allSchools).find(
        ([school, houses]) => houses.includes(selectedHouse)
      );

      if (schoolWithHouse) {
        const [schoolName] = schoolWithHouse;
        setExpandedSchool(schoolName);
        setExpandedHouse(selectedHouse);
      }
    }
  }, [selectedHouse]);

  const toggleSchool = (school) => {
    setExpandedSchool(expandedSchool === school ? null : school);
  };

  const handleHouseSelect = (house) => {
    onHouseSelect(house);
    setExpandedHouse(house);
  };

  const handleChoiceSelect = (house, featureName, optionName) => {
    onHouseChoiceSelect(house, featureName, optionName);
  };

  const isChoiceSelected = (house, featureName, optionName) => {
    if (!houseChoices || typeof houseChoices !== "object") return false;
    if (!houseChoices[house] || typeof houseChoices[house] !== "object")
      return false;
    return houseChoices[house][featureName] === optionName;
  };

  const renderSchoolGroup = (groupKey, groupData) => (
    <div key={groupKey} style={styles.schoolGroup}>
      <div style={styles.schoolGroupTitle}>{groupData.title}</div>

      {Object.entries(groupData.schools).map(([school, houses]) => (
        <div key={school} style={styles.schoolContainer}>
          <button
            onClick={() => toggleSchool(school)}
            style={styles.schoolButton}
          >
            <div style={styles.schoolButtonContent}>{school}</div>
            {expandedSchool === school ? "▲" : "▼"}
          </button>

          {expandedSchool === school && (
            <div style={styles.schoolContent}>
              {houses.map((house) => {
                const isSelected = selectedHouse === house;
                const houseColor = houseColors[house] || {
                  primary: theme.primary,
                  secondary: theme.surface,
                };

                return (
                  <div key={house} style={styles.houseContainer}>
                    <button
                      onClick={() => handleHouseSelect(house)}
                      style={{
                        ...styles.houseButton,
                        backgroundColor: isSelected
                          ? houseColor.primary
                          : styles.houseButton.backgroundColor,
                        border: `2px solid ${
                          isSelected ? houseColor.primary : theme.border
                        }`,
                        color: isSelected
                          ? houseColor.secondary
                          : styles.houseButton.color,
                        fontWeight: isSelected ? "600" : "500",
                      }}
                    >
                      <div style={styles.houseButtonContent}>
                        <div
                          style={{
                            ...styles.houseRadio,
                            borderColor: isSelected
                              ? houseColor.primary
                              : theme.border,
                            backgroundColor: isSelected
                              ? houseColor.primary
                              : "transparent",
                          }}
                        >
                          {isSelected && (
                            <div
                              style={{
                                ...styles.houseRadioDot,
                                backgroundColor: houseColor.secondary,
                              }}
                            />
                          )}
                        </div>
                        {house}
                      </div>
                      {expandedHouse === house ? "▲" : "▼"}
                    </button>

                    {expandedHouse === house &&
                      houseFeatures[house] &&
                      houseAbilityBonuses[house] && (
                        <div style={styles.houseDetails}>
                          {/* Ability Score Bonuses */}
                          <div style={styles.sectionContainer}>
                            <h4 style={styles.sectionTitle}>
                              ➕ Ability Score Increases
                            </h4>
                            <div style={styles.abilityBonusContainer}>
                              {houseAbilityBonuses[house]?.fixed.map(
                                (ability) => (
                                  <span
                                    key={ability}
                                    style={{
                                      ...styles.abilityBonus,
                                      backgroundColor: houseColor.primary,
                                      color: houseColor.secondary,
                                    }}
                                  >
                                    +1 {formatAbilityName(ability)}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          {/* Features */}
                          <div style={styles.sectionContainer}>
                            <h4 style={styles.sectionTitle}>
                              🪄 House Features
                            </h4>

                            {houseFeatures[house].features.map(
                              (feature, index) => (
                                <div
                                  key={index}
                                  style={styles.featureContainer}
                                >
                                  <div style={styles.featureCard}>
                                    <h5
                                      style={{
                                        ...styles.featureName,
                                        color: houseColor.primary,
                                      }}
                                    >
                                      {feature.name}
                                    </h5>

                                    {!feature.isChoice ? (
                                      <p style={styles.featureDescription}>
                                        {feature.description}
                                      </p>
                                    ) : (
                                      <div>
                                        <p style={styles.choiceText}>
                                          {readOnly || !houseChoices
                                            ? "Available options:"
                                            : "Choose one option:"}
                                        </p>

                                        {feature.options.map(
                                          (option, optionIndex) => (
                                            <div
                                              key={optionIndex}
                                              style={styles.optionContainer}
                                            >
                                              <label style={styles.optionLabel}>
                                                <div
                                                  style={{
                                                    ...styles.optionContent,
                                                    backgroundColor:
                                                      isChoiceSelected(
                                                        house,
                                                        feature.name,
                                                        option.name
                                                      )
                                                        ? "#fef3c7"
                                                        : theme.background,
                                                    borderColor:
                                                      isChoiceSelected(
                                                        house,
                                                        feature.name,
                                                        option.name
                                                      )
                                                        ? "#f59e0b"
                                                        : theme.border,
                                                  }}
                                                >
                                                  <input
                                                    type="radio"
                                                    name={`${house}-${feature.name}`}
                                                    checked={isChoiceSelected(
                                                      house,
                                                      feature.name,
                                                      option.name
                                                    )}
                                                    onChange={() =>
                                                      !readOnly &&
                                                      handleChoiceSelect(
                                                        house,
                                                        feature.name,
                                                        option.name
                                                      )
                                                    }
                                                    disabled={readOnly}
                                                    style={{
                                                      marginTop: "2px",
                                                      accentColor:
                                                        theme.primary,
                                                    }}
                                                  />
                                                  <div
                                                    style={styles.optionDetails}
                                                  >
                                                    <div
                                                      style={styles.optionName}
                                                    >
                                                      {option.name}
                                                    </div>
                                                    <div
                                                      style={
                                                        styles.optionDescription
                                                      }
                                                    >
                                                      {option.description}
                                                    </div>
                                                  </div>
                                                </div>
                                              </label>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.fieldContainer}>
      <div style={styles.infoCard}>
        <h3 style={styles.infoCardTitle}>Choose Your House</h3>
        <p style={styles.infoCardText}>
          Each house provides unique ability score bonuses, special features,
          and a free feat. Some houses offer choices between different
          abilities.
        </p>
      </div>

      {renderSchoolGroup("main", schoolGroups.main)}

      {renderSchoolGroup("international", schoolGroups.international)}
    </div>
  );
};

export default EnhancedHouseSelector;
