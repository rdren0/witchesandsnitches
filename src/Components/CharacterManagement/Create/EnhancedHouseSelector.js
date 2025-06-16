import React, { useState, useEffect, useMemo } from "react";
import {
  schoolGroups,
  houseFeatures,
  houseAbilityBonuses,
  houseColors,
} from "../Shared/houseData";
import { createFeatStyles } from "../../../styles/masterStyles";
import { useTheme } from "../../../contexts/ThemeContext";

const calculateHouseAbilityModifiers = (house, houseChoices = {}) => {
  const modifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const bonusDetails = {};

  if (!house || !houseAbilityBonuses[house]) return { modifiers, bonusDetails };

  const houseBonuses = houseAbilityBonuses[house];

  if (houseBonuses.fixed) {
    houseBonuses.fixed.forEach((ability) => {
      if (modifiers.hasOwnProperty(ability)) {
        modifiers[ability] += 1;

        if (!bonusDetails[ability]) {
          bonusDetails[ability] = [];
        }
        bonusDetails[ability].push({
          source: `${house} (Fixed)`,
          amount: 1,
        });
      }
    });
  }

  if (houseBonuses.choice && houseChoices[house]?.abilityChoice) {
    const chosenAbility = houseChoices[house].abilityChoice;
    if (modifiers.hasOwnProperty(chosenAbility)) {
      modifiers[chosenAbility] += 1;

      if (!bonusDetails[chosenAbility]) {
        bonusDetails[chosenAbility] = [];
      }
      bonusDetails[chosenAbility].push({
        source: `${house} (Choice)`,
        amount: 1,
      });
    }
  }

  return { modifiers, bonusDetails };
};

const HouseAbilityModifierPills = ({ house, houseChoices, styles }) => {
  const { modifiers, bonusDetails } = useMemo(() => {
    console.log(
      "Calculating house ability modifiers for:",
      house,
      "with choices:",
      houseChoices
    );
    const result = calculateHouseAbilityModifiers(house, houseChoices);
    console.log("House modifiers result:", result);
    return result;
  }, [house, houseChoices]);

  const modifiedAbilities = Object.entries(modifiers).filter(
    ([_, value]) => value > 0
  );

  if (modifiedAbilities.length === 0) return null;

  return (
    <div style={styles.modifierPillsContainer}>
      <div style={styles.pillsLabel}>House Ability Score Bonuses:</div>
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

const HouseAbilityChoice = ({
  house,
  houseChoices,
  onHouseChoiceSelect,
  styles,
}) => {
  if (!house || !houseAbilityBonuses[house]?.choice) return null;

  const handleAbilityChoice = (ability) => {
    console.log("House ability choice changed for", house, "to:", ability);
    onHouseChoiceSelect(house, "abilityChoice", ability);
  };

  const currentChoice = houseChoices[house]?.abilityChoice;
  const abilities = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];

  const fixedAbilities = houseAbilityBonuses[house]?.fixed || [];
  const availableAbilities = abilities.filter(
    (ability) => !fixedAbilities.includes(ability)
  );

  return (
    <div style={styles.houseChoiceContainer}>
      <div style={styles.houseChoiceLabel}>
        Choose additional +1 ability score increase:
      </div>
      <div style={styles.abilityChoiceGroup}>
        {availableAbilities.map((ability) => (
          <label key={ability} style={styles.abilityChoiceLabel}>
            <input
              type="radio"
              name={`${house}_ability_choice`}
              value={ability}
              checked={currentChoice === ability}
              onChange={(e) => handleAbilityChoice(e.target.value)}
              style={styles.abilityChoiceRadio}
            />
            <span style={styles.abilityChoiceName}>
              {ability.charAt(0).toUpperCase() + ability.slice(1)} (+1)
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

const createHouseSpecificStyles = (theme, baseStyles) => ({
  ...baseStyles,

  modifierPillsContainer: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "16px",
  },
  pillsLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#10b981",
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
    backgroundColor: "#10b981",
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
  houseChoiceContainer: {
    backgroundColor: theme.surfaceHover,
    border: `1px solid ${theme.border}`,
    borderRadius: "6px",
    padding: "12px",
    marginBottom: "12px",
  },
  houseChoiceLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: theme.text,
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
    gap: "4px",
    fontSize: "12px",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "4px",
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.surface,
  },
  abilityChoiceRadio: {
    margin: 0,
  },
  abilityChoiceName: {
    color: theme.text,
  },

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

  const getThemeAwareHouseColor = (house, theme) => {
    const baseHouseColors = houseColors[house];

    return {
      primary: theme.primary,
      secondary: theme.surface,
      accent: baseHouseColors?.primary || theme.primary,
    };
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
                const houseColor = getThemeAwareHouseColor(house, theme);

                return (
                  <div key={house} style={styles.houseContainer}>
                    <button
                      onClick={() => handleHouseSelect(house)}
                      style={{
                        ...styles.houseButton,
                        backgroundColor: isSelected
                          ? theme.primary
                          : styles.houseButton.backgroundColor,
                        border: `2px solid ${
                          isSelected ? theme.primary : theme.border
                        }`,
                        color: isSelected
                          ? theme.surface
                          : styles.houseButton.color,
                        fontWeight: isSelected ? "600" : "500",

                        ...(isSelected && {
                          boxShadow: `0 0 0 1px ${houseColor.accent}33`,
                        }),
                      }}
                    >
                      <div style={styles.houseButtonContent}>
                        <div
                          style={{
                            ...styles.houseRadio,
                            borderColor: isSelected
                              ? theme.primary
                              : theme.border,
                            backgroundColor: isSelected
                              ? theme.primary
                              : "transparent",
                          }}
                        >
                          {isSelected && (
                            <div
                              style={{
                                ...styles.houseRadioDot,
                                backgroundColor: theme.surface,
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
                          {/* House ASI Modifier Pills */}
                          <HouseAbilityModifierPills
                            house={house}
                            houseChoices={houseChoices}
                            styles={styles}
                          />

                          {/* House Ability Choice */}
                          {!readOnly && (
                            <HouseAbilityChoice
                              house={house}
                              houseChoices={houseChoices}
                              onHouseChoiceSelect={onHouseChoiceSelect}
                              styles={styles}
                            />
                          )}

                          {/* Ability Score Bonuses (Traditional Display) */}
                          <div style={styles.sectionContainer}>
                            <h4 style={styles.sectionTitle}>
                              ➕ Ability Score Details
                            </h4>
                            <div style={styles.abilityBonusContainer}>
                              {houseAbilityBonuses[house]?.fixed.map(
                                (ability) => (
                                  <span
                                    key={ability}
                                    style={{
                                      ...styles.abilityBonus,
                                      backgroundColor: theme.primary,
                                      color: theme.surface,
                                    }}
                                  >
                                    +1 {formatAbilityName(ability)} (Fixed)
                                  </span>
                                )
                              )}
                              {houseAbilityBonuses[house]?.choice && (
                                <span
                                  style={{
                                    ...styles.abilityBonus,
                                    backgroundColor: theme.surfaceHover,
                                    color: theme.text,
                                    border: `1px solid ${theme.border}`,
                                  }}
                                >
                                  +1 Any Ability (Choice)
                                </span>
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
                                    <h5 style={styles.featureName}>
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
                                                        ? `${theme.primary}15`
                                                        : theme.background,
                                                    borderColor:
                                                      isChoiceSelected(
                                                        house,
                                                        feature.name,
                                                        option.name
                                                      )
                                                        ? theme.primary
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
