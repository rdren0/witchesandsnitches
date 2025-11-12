import React, { useState, useMemo } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBackgroundStyles } from "../../../../utils/styles/masterStyles";
import { standardFeats } from "../../../../SharedData/standardFeatData";
import { calculateFinalAbilityScores } from "../../utils/characterUtils";

const AdditionalFeatsASISection = ({
  character,
  onChange,
  onCharacterUpdate,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);

  const [isExpanded, setIsExpanded] = useState(false);
  const [featFilter, setFeatFilter] = useState("");

  const additionalFeats = character.additionalFeats || [];
  const additionalASI = character.additionalASI || [];

  const filteredFeats = useMemo(() => {
    if (!featFilter.trim()) return standardFeats;

    const searchTerm = featFilter.toLowerCase();
    return standardFeats.filter((feat) => {
      const nameMatch = feat.name.toLowerCase().includes(searchTerm);
      const previewMatch = feat.preview?.toLowerCase().includes(searchTerm);
      const descText = Array.isArray(feat.description)
        ? feat.description.join(" ").toLowerCase()
        : (feat.description || "").toLowerCase();
      const descMatch = descText.includes(searchTerm);

      return nameMatch || previewMatch || descMatch;
    });
  }, [featFilter]);

  const getAllResilientSelections = () => {
    const selections = [];
    const featChoices = character.featChoices || character.feat_choices || {};

    if (
      character.level1ChoiceType === "feat" &&
      character.standardFeats?.includes("Resilient")
    ) {
      const ability =
        featChoices["Resilient_level1_abilityChoice"] ||
        featChoices["Resilient_level1_ability_0"] ||
        featChoices["Resilient_levellevel1_abilityChoice"] ||
        featChoices["Resilient_levellevel1_ability_0"];
      if (ability) selections.push(ability);
    }

    const asiChoices = character.asiChoices || character.asi_choices || {};
    Object.entries(asiChoices).forEach(([level, choice]) => {
      if (choice.type === "feat" && choice.selectedFeat === "Resilient") {
        const ability =
          choice.featChoices?.[`Resilient_level${level}_abilityChoice`] ||
          choice.featChoices?.[`Resilient_level${level}_ability_0`];
        if (ability) selections.push(ability);
      }
    });

    additionalFeats.forEach((featName, index) => {
      if (featName === "Resilient") {
        const key = index === 0 ? "Resilient" : `Resilient_additional_${index}`;
        const ability =
          featChoices[`${key}_abilityChoice`] ||
          featChoices[`${key}_ability_0`];
        if (ability) selections.push(ability);
      }
    });

    return selections;
  };

  const getRequiredChoices = (feat, featIndex = null) => {
    if (!feat || !feat.benefits) return [];

    const choices = [];

    if (feat.benefits.abilityScoreIncrease) {
      const increase = feat.benefits.abilityScoreIncrease;
      if (increase.type === "choice" || increase.type === "choice_any") {
        let abilityOptions = increase.abilities || [
          "strength",
          "dexterity",
          "constitution",
          "intelligence",
          "wisdom",
          "charisma",
        ];

        if (feat.name === "Resilient") {
          const allSelections = getAllResilientSelections();
          const currentKey =
            featIndex !== null
              ? featIndex === 0
                ? "Resilient"
                : `Resilient_additional_${featIndex}`
              : "Resilient";
          const featChoices =
            character.featChoices || character.feat_choices || {};
          const currentSelection =
            featChoices[`${currentKey}_abilityChoice`] ||
            featChoices[`${currentKey}_ability_0`];

          abilityOptions = abilityOptions.filter((ability) => {
            if (ability === currentSelection) return true;
            return !allSelections.includes(ability);
          });
        } else if (increase.abilities) {
          abilityOptions = increase.abilities;
        }

        choices.push({
          type: "ability",
          label: "Ability Score",
          options: abilityOptions.map(
            (a) => a.charAt(0).toUpperCase() + a.slice(1)
          ),
          id: `${feat.name}_ability_0`,
        });
      }
    }

    if (
      feat.benefits.specialAbilities &&
      Array.isArray(feat.benefits.specialAbilities)
    ) {
      feat.benefits.specialAbilities.forEach((ability, index) => {
        if (ability && ability.type === "choice" && ability.options) {
          choices.push({
            type: "special",
            label: ability.name || "Choose Option",
            options: ability.options,
            id: `${feat.name}_special_${index}`,
          });
        }
      });
    }

    return choices;
  };

  const toggleFeat = (featName) => {
    const newFeats = additionalFeats.includes(featName)
      ? additionalFeats.filter((f) => f !== featName)
      : [...additionalFeats, featName];

    onChange("additionalFeats", newFeats);
  };

  const updateFeatChoice = (featName, choiceId, value, featIndex = null) => {
    const normalizedValue =
      typeof value === "string" &&
      [
        "Strength",
        "Dexterity",
        "Constitution",
        "Intelligence",
        "Wisdom",
        "Charisma",
      ].includes(value)
        ? value.toLowerCase()
        : value;

    const feat = standardFeats.find((f) => f.name === featName);
    const isRepeatable = feat?.repeatable;

    let actualChoiceId = choiceId;
    if (isRepeatable && featIndex !== null) {
      const instanceKey =
        featIndex === 0 ? featName : `${featName}_additional_${featIndex}`;
      actualChoiceId = choiceId.replace(featName, instanceKey);
    }

    const newFeatChoices = {
      ...(character.featChoices || character.feat_choices || {}),
      [actualChoiceId]: normalizedValue,
    };

    if (actualChoiceId.includes("_ability_0")) {
      const baseKey = actualChoiceId.replace("_ability_0", "");
      newFeatChoices[`${baseKey}_abilityChoice`] = normalizedValue;
    }

    onChange("featChoices", newFeatChoices);
  };

  const addASI = () => {
    const newASI = [
      ...additionalASI,
      { id: Date.now(), abilityScoreIncreases: [] },
    ];

    onChange("additionalASI", newASI);
  };

  const removeASI = (id) => {
    const newASI = additionalASI.filter((asi) => asi.id !== id);

    onChange("additionalASI", newASI);
  };

  const updateASIAbilities = (id, abilityUpdates) => {
    const newASI = additionalASI.map((asi) =>
      asi.id === id ? { ...asi, abilityScoreIncreases: abilityUpdates } : asi
    );

    onChange("additionalASI", newASI);
  };

  const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    cursor: "pointer",
    backgroundColor: theme.background,
    borderRadius: "12px",
    border: `2px solid ${theme.border}`,
    marginBottom: isExpanded ? "12px" : "0",
    transition: "all 0.2s ease",
  };

  const sectionTitleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "18px",
    fontWeight: "600",
    color: theme.text,
    margin: 0,
  };

  const featureCardStyle = {
    padding: "16px",
    backgroundColor: theme.surface,
    borderRadius: "8px",
    border: `1px solid ${theme.border}`,
    marginBottom: "12px",
    transition: "all 0.2s ease",
  };

  const selectedCardStyle = {
    ...featureCardStyle,
    border: `2px solid ${theme.primary}`,
    backgroundColor: `${theme.primary}10`,
  };

  return (
    <div style={styles.fieldContainer}>
      <div
        style={sectionHeaderStyle}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 style={sectionTitleStyle}>
          <span style={{ fontSize: "20px" }}>🎁</span>
          Additional Feats and ASI
          {(additionalFeats.length > 0 || additionalASI.length > 0) && (
            <span
              style={{
                marginLeft: "8px",
                fontSize: "14px",
                fontWeight: "normal",
                color: theme.textSecondary,
              }}
            >
              ({additionalFeats.length} feats, {additionalASI.length} ASI)
            </span>
          )}
        </h3>
        <span style={{ fontSize: "20px", color: theme.text }}>
          {isExpanded ? "▲" : "▼"}
        </span>
      </div>

      {isExpanded && (
        <div style={{ marginTop: "0" }}>
          <div style={styles.helpText}>
            Select additional feats or add extra Ability Score Improvements that
            are not from standard level progression.
          </div>

          {(additionalFeats.length > 0 || additionalASI.length > 0) && (
            <div
              style={{
                marginTop: "16px",
                marginBottom: "16px",
                padding: "16px",
                backgroundColor: `${theme.success}10`,
                border: `2px solid ${theme.success}`,
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: theme.success,
                  marginBottom: "12px",
                }}
              >
                ✓ Selected Additional Features:
              </div>

              {additionalFeats.length > 0 && (
                <div
                  style={{
                    marginBottom: additionalASI.length > 0 ? "12px" : "0",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: theme.textSecondary,
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Feats:
                  </div>
                  {additionalFeats.map((featName, index) => {
                    const feat = standardFeats.find((f) => f.name === featName);
                    const requiredChoices = getRequiredChoices(feat, index);
                    const featChoicesData =
                      character.featChoices || character.feat_choices || {};

                    const characterWithoutThisFeat = {
                      ...character,
                      additionalFeats: (character.additionalFeats || []).filter(
                        (_, i) => i !== index
                      ),
                      additional_feats: (
                        character.additional_feats || []
                      ).filter((_, i) => i !== index),
                    };
                    const finalAbilityScores = calculateFinalAbilityScores(
                      characterWithoutThisFeat
                    );

                    const instanceKey =
                      index === 0
                        ? featName
                        : `${featName}_additional_${index}`;
                    const actualChoiceId = feat.repeatable
                      ? `${instanceKey}_ability_0`
                      : `${featName}_ability_0`;
                    const storedAbilityValue =
                      featChoicesData[actualChoiceId] ||
                      featChoicesData[`${instanceKey}_abilityChoice`];

                    return (
                      <div
                        key={`${featName}_${index}`}
                        style={{
                          padding: "12px",
                          backgroundColor: theme.surface,
                          borderRadius: "6px",
                          border: `1px solid ${theme.border}`,
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom:
                              requiredChoices.length > 0 ? "12px" : "0",
                          }}
                        >
                          <strong
                            style={{ color: theme.text, fontSize: "14px" }}
                          >
                            {featName}
                          </strong>
                          <button
                            onClick={() => !disabled && toggleFeat(featName)}
                            disabled={disabled}
                            style={{
                              padding: "4px 12px",
                              fontSize: "11px",
                              fontWeight: "600",
                              backgroundColor: theme.error || "#d32f2f",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: disabled ? "not-allowed" : "pointer",
                              opacity: disabled ? 0.5 : 1,
                            }}
                          >
                            Remove
                          </button>
                        </div>

                        {requiredChoices.length > 0 && (
                          <div style={{ marginTop: "8px" }}>
                            {requiredChoices.map((choice) => (
                              <div
                                key={choice.id}
                                style={{ marginBottom: "8px" }}
                              >
                                <label
                                  style={{
                                    display: "block",
                                    fontSize: "12px",
                                    color: theme.textSecondary,
                                    marginBottom: "4px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {choice.label}:
                                </label>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "8px",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {choice.options.map((option) => {
                                    const storedValue =
                                      featChoicesData[actualChoiceId] ||
                                      featChoicesData[
                                        `${instanceKey}_abilityChoice`
                                      ];
                                    const isSelected =
                                      storedValue === option ||
                                      storedValue === option.toLowerCase();

                                    const isAbilityChoice =
                                      choice.type === "ability";
                                    const abilityKey = option.toLowerCase();
                                    const currentScore = isAbilityChoice
                                      ? finalAbilityScores[abilityKey] || 10
                                      : null;
                                    const newScore = isAbilityChoice
                                      ? currentScore + 1
                                      : null;
                                    const exceedsMax =
                                      isAbilityChoice && newScore > 20;

                                    return (
                                      <label
                                        key={option}
                                        style={{
                                          display: "flex",
                                          flexDirection: isAbilityChoice
                                            ? "column"
                                            : "row",
                                          alignItems: isAbilityChoice
                                            ? "flex-start"
                                            : "center",
                                          padding: isAbilityChoice
                                            ? "8px 12px"
                                            : "6px 12px",
                                          border: `2px solid ${
                                            isSelected
                                              ? theme.primary
                                              : exceedsMax
                                              ? theme.warning || "#f59e0b"
                                              : theme.border
                                          }`,
                                          borderRadius: "6px",
                                          backgroundColor: isSelected
                                            ? `${theme.primary}15`
                                            : theme.background,
                                          cursor: disabled
                                            ? "not-allowed"
                                            : "pointer",
                                          fontSize: "12px",
                                          fontWeight: isSelected
                                            ? "600"
                                            : "normal",
                                          color: isSelected
                                            ? theme.primary
                                            : theme.text,
                                          transition: "all 0.2s ease",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            width: "100%",
                                          }}
                                        >
                                          <input
                                            type="radio"
                                            name={`${actualChoiceId}_${index}`}
                                            value={option}
                                            checked={isSelected}
                                            onChange={() =>
                                              !disabled &&
                                              updateFeatChoice(
                                                featName,
                                                choice.id,
                                                option,
                                                index
                                              )
                                            }
                                            disabled={disabled}
                                            style={{
                                              marginRight: "6px",
                                              accentColor: theme.primary,
                                              cursor: disabled
                                                ? "not-allowed"
                                                : "pointer",
                                            }}
                                          />
                                          <span>{option}</span>
                                        </div>
                                        {isAbilityChoice && (
                                          <div
                                            style={{
                                              fontSize: "10px",
                                              color: theme.textSecondary,
                                              marginLeft: "22px",
                                              marginTop: "2px",
                                            }}
                                          >
                                            {currentScore} → {newScore}
                                            {exceedsMax && (
                                              <span
                                                style={{
                                                  color:
                                                    theme.warning || "#f59e0b",
                                                  fontWeight: "600",
                                                  marginLeft: "4px",
                                                }}
                                              >
                                                ⚠️ Max is 20
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {additionalASI.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: theme.textSecondary,
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Ability Score Improvements:
                  </div>
                  {additionalASI.map((asi, index) => (
                    <div
                      key={asi.id}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: theme.surface,
                        borderRadius: "6px",
                        border: `1px solid ${theme.border}`,
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <strong style={{ color: theme.text, fontSize: "14px" }}>
                          ASI #{index + 1}
                        </strong>
                        <button
                          onClick={() => !disabled && removeASI(asi.id)}
                          disabled={disabled}
                          style={{
                            padding: "4px 12px",
                            fontSize: "11px",
                            fontWeight: "600",
                            backgroundColor: theme.error || "#d32f2f",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: disabled ? "not-allowed" : "pointer",
                            opacity: disabled ? 0.5 : 1,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      {asi.abilityScoreIncreases.length > 0 ? (
                        <div
                          style={{
                            fontSize: "12px",
                            color: theme.textSecondary,
                          }}
                        >
                          {asi.abilityScoreIncreases
                            .map(
                              (inc) =>
                                `+1 ${
                                  inc.ability.charAt(0).toUpperCase() +
                                  inc.ability.slice(1)
                                }`
                            )
                            .join(", ")}
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: "12px",
                            color: theme.textSecondary,
                            fontStyle: "italic",
                          }}
                        >
                          No abilities selected
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: "24px" }}>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: theme.text,
                marginBottom: "12px",
              }}
            >
              🏆 Select Additional Feats:
            </div>

            <div style={{ position: "relative", marginBottom: "16px" }}>
              <input
                type="text"
                placeholder="Search feats..."
                value={featFilter}
                onChange={(e) => setFeatFilter(e.target.value)}
                disabled={disabled}
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 16px",
                  fontSize: "14px",
                  border: `2px solid ${theme.border}`,
                  borderRadius: "8px",
                  backgroundColor: theme.surface,
                  color: theme.text,
                  outline: "none",
                  cursor: disabled ? "not-allowed" : "text",
                  opacity: disabled ? 0.6 : 1,
                }}
              />
              {featFilter && (
                <button
                  onClick={() => setFeatFilter("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    color: theme.textSecondary,
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              )}
            </div>

            <div
              style={{
                maxHeight: "500px",
                overflowY: "auto",
                paddingRight: "8px",
              }}
            >
              {filteredFeats.map((feat) => {
                const isSelected = additionalFeats.includes(feat.name);
                const requiredChoices = getRequiredChoices(feat);

                return (
                  <div
                    key={feat.name}
                    style={isSelected ? selectedCardStyle : featureCardStyle}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        cursor: disabled ? "not-allowed" : "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => !disabled && toggleFeat(feat.name)}
                        disabled={disabled}
                        style={{
                          marginRight: "12px",
                          marginTop: "4px",
                          width: "18px",
                          height: "18px",
                          accentColor: theme.primary,
                          cursor: disabled ? "not-allowed" : "pointer",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "4px",
                          }}
                        >
                          <strong
                            style={{
                              color: isSelected ? theme.primary : theme.text,
                              fontSize: "16px",
                            }}
                          >
                            {feat.name}
                          </strong>
                          {isSelected && (
                            <span
                              style={{
                                backgroundColor: theme.success,
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: "600",
                              }}
                            >
                              Selected
                            </span>
                          )}
                        </div>
                        <div style={{ marginTop: "4px" }}>
                          <p
                            style={{
                              color: theme.textSecondary,
                              fontSize: "13px",
                              marginBottom: "8px",
                              fontWeight: "600",
                            }}
                          >
                            {feat.preview}
                          </p>
                          {feat.description && (
                            <div
                              style={{
                                color: theme.text,
                                fontSize: "12px",
                                lineHeight: "1.6",
                                marginBottom:
                                  requiredChoices.length > 0 ? "8px" : 0,
                                padding: "8px",
                                backgroundColor: theme.background,
                                borderRadius: "6px",
                                border: `1px solid ${theme.border}`,
                              }}
                            >
                              {Array.isArray(feat.description) ? (
                                <ul
                                  style={{
                                    margin: 0,
                                    paddingLeft: "20px",
                                  }}
                                >
                                  {feat.description.map((desc, idx) => (
                                    <li
                                      key={idx}
                                      style={{ marginBottom: "4px" }}
                                    >
                                      {desc}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div>{feat.description}</div>
                              )}
                            </div>
                          )}
                        </div>
                        {requiredChoices.length > 0 && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: theme.textSecondary,
                              fontStyle: "italic",
                              padding: "4px 8px",
                              backgroundColor: `${theme.primary}10`,
                              borderRadius: "4px",
                              marginTop: "4px",
                            }}
                          >
                            ⚠️ Requires choice:{" "}
                            {requiredChoices.map((c) => c.label).join(", ")}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                );
              })}

              {filteredFeats.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px",
                    color: theme.textSecondary,
                  }}
                >
                  No feats found matching "{featFilter}"
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: "32px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: theme.text,
                }}
              >
                📈 Additional Ability Score Improvements:
              </div>
              <button
                onClick={addASI}
                disabled={disabled}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  backgroundColor: theme.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.5 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                + Add ASI
              </button>
            </div>

            {additionalASI.length === 0 ? (
              <div
                style={{
                  ...featureCardStyle,
                  textAlign: "center",
                  padding: "24px",
                  color: theme.textSecondary,
                }}
              >
                <p style={{ margin: 0, fontSize: "14px" }}>
                  No additional ASI added yet. Click "Add ASI" to add one.
                </p>
              </div>
            ) : (
              <div>
                {additionalASI.map((asi, index) => (
                  <ASISelector
                    key={asi.id}
                    asi={asi}
                    index={index}
                    character={character}
                    onUpdate={(abilityUpdates) =>
                      updateASIAbilities(asi.id, abilityUpdates)
                    }
                    onRemove={() => removeASI(asi.id)}
                    disabled={disabled}
                    theme={theme}
                    styles={styles}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ASISelector = ({
  asi,
  index,
  character,
  onUpdate,
  onRemove,
  disabled,
  theme,
  styles,
}) => {
  const abilities = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];
  const currentIncreases = asi.abilityScoreIncreases || [];

  const handleAbilityIncrement = (ability) => {
    if (disabled) return;

    const abilityIncreases = currentIncreases.filter(
      (inc) => inc.ability === ability
    );
    const totalIncreases = currentIncreases.length;

    let newIncreases;
    if (abilityIncreases.length === 2) {
      newIncreases = currentIncreases.filter((inc) => inc.ability !== ability);
    } else if (abilityIncreases.length === 1) {
      if (totalIncreases < 2) {
        newIncreases = [...currentIncreases, { ability, increase: 1 }];
      } else {
        newIncreases = currentIncreases.filter(
          (inc) => inc.ability !== ability
        );
      }
    } else if (totalIncreases < 2) {
      newIncreases = [...currentIncreases, { ability, increase: 1 }];
    } else {
      return;
    }

    onUpdate(newIncreases);
  };

  return (
    <div
      style={{
        marginBottom: "16px",
        padding: "20px",
        backgroundColor: theme.background,
        border: `2px solid ${theme.border}`,
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: theme.text,
          }}
        >
          ASI #{index + 1}
        </h4>
        {currentIncreases.length === 2 && (
          <span
            style={{
              fontSize: "12px",
              color: theme.success,
              fontWeight: "600",
              padding: "4px 12px",
              backgroundColor: `${theme.success}20`,
              borderRadius: "12px",
            }}
          >
            ✓ Complete
          </span>
        )}
      </div>

      <div style={styles.helpText}>
        Select abilities to increase (total +2). You can increase one ability by
        +2 or two different abilities by +1 each.
        {currentIncreases.length > 0 && (
          <span style={{ color: theme.success, marginLeft: "8px" }}>
            ({currentIncreases.length}/2 selected)
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "12px",
          marginTop: "16px",
        }}
      >
        {abilities.map((ability) => {
          const abilityIncreases = currentIncreases.filter(
            (inc) => inc.ability === ability
          );
          const increaseCount = abilityIncreases.length;
          const totalIncreases = currentIncreases.length;
          const canSelect = totalIncreases < 2 || increaseCount > 0;
          const currentScore = character.abilityScores?.[ability] || 10;

          return (
            <div
              key={ability}
              style={{
                padding: "12px 16px",
                border: `2px solid ${
                  increaseCount > 0 ? theme.success : theme.border
                }`,
                borderRadius: "8px",
                backgroundColor:
                  increaseCount === 2
                    ? `${theme.success}25`
                    : increaseCount === 1
                    ? `${theme.success}15`
                    : theme.surface,
                cursor: disabled
                  ? "not-allowed"
                  : canSelect
                  ? "pointer"
                  : "not-allowed",
                transition: "all 0.2s ease",
                opacity: disabled ? 0.6 : canSelect ? 1 : 0.4,
                textAlign: "center",
              }}
              onClick={() => handleAbilityIncrement(ability)}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: increaseCount > 0 ? theme.success : theme.text,
                  textTransform: "capitalize",
                  fontSize: "14px",
                }}
              >
                {ability}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  marginTop: "4px",
                }}
              >
                {currentScore} → {currentScore + increaseCount}
              </div>
              {increaseCount > 0 && (
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.success,
                    fontWeight: "600",
                    marginTop: "4px",
                  }}
                >
                  +{increaseCount} ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {currentIncreases.length === 2 && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: `${theme.success}20`,
            border: `1px solid ${theme.success}`,
            borderRadius: "8px",
            color: theme.success,
            fontSize: "14px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {(() => {
            const abilityGroups = currentIncreases.reduce((acc, inc) => {
              acc[inc.ability] = (acc[inc.ability] || 0) + 1;
              return acc;
            }, {});

            const displayText = Object.entries(abilityGroups)
              .map(
                ([ability, count]) =>
                  `+${count} ${
                    ability.charAt(0).toUpperCase() + ability.slice(1)
                  }`
              )
              .join(", ");

            return `✓ Ability Score Improvement Complete: ${displayText}`;
          })()}
        </div>
      )}
    </div>
  );
};

export default AdditionalFeatsASISection;
