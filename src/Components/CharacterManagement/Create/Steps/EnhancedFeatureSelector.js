import { standardFeats } from "../../../standardFeatData";
import { createFeatStyles } from "../../../../styles/masterStyles";
import { useTheme } from "../../../../contexts/ThemeContext";
import { allSkills } from "../../../CharacterSheet/utils";
import { useMemo, useEffect } from "react";

const getSpellcastingAbility = (character) => {
  const castingStyle = character.castingStyle;
  const abilityMap = {
    "Grace Caster": "charisma",
    "Vigor Caster": "constitution",
    "Wit Caster": "intelligence",
    "Wisdom Caster": "wisdom",
  };
  return abilityMap[castingStyle] || "intelligence";
};

const calculateTotalFeatModifiers = (
  selectedFeats,
  character,
  featChoices = {}
) => {
  const modifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const featDetails = {};

  selectedFeats.forEach((featName) => {
    const feat = standardFeats.find((f) => f.name === featName);
    if (!feat?.modifiers?.abilityIncreases) return;

    feat.modifiers.abilityIncreases.forEach((increase, index) => {
      let abilityToIncrease;
      const choiceKey = `${featName}_ability_${index}`;

      switch (increase.type) {
        case "fixed":
          abilityToIncrease = increase.ability;
          break;
        case "choice":
          abilityToIncrease = featChoices[choiceKey] || increase.abilities[0];

          break;
        case "spellcastingAbility":
          abilityToIncrease = getSpellcastingAbility(character);
          break;
        default:
          break;
      }

      if (abilityToIncrease && modifiers.hasOwnProperty(abilityToIncrease)) {
        modifiers[abilityToIncrease] += increase.amount;

        if (!featDetails[abilityToIncrease]) {
          featDetails[abilityToIncrease] = [];
        }
        featDetails[abilityToIncrease].push({
          featName,
          amount: increase.amount,
        });
      }
    });
  });

  return { modifiers, featDetails };
};

const AbilityModifierPills = ({
  selectedFeats,
  character,
  featChoices,
  styles,
}) => {
  const { modifiers, featDetails } = useMemo(() => {
    const result = calculateTotalFeatModifiers(
      selectedFeats,
      character,
      featChoices
    );
    return result;
  }, [selectedFeats, character, featChoices]);

  const modifiedAbilities = Object.entries(modifiers).filter(
    ([_, value]) => value > 0
  );

  if (modifiedAbilities.length === 0) return null;

  return (
    <div style={styles.modifierPillsContainer}>
      <div style={styles.pillsLabel}>Ability Score Bonuses:</div>
      <div style={styles.pillsRow}>
        {modifiedAbilities.map(([ability, totalBonus]) => {
          const details = featDetails[ability] || [];
          const tooltipText = details
            .map((d) => `+${d.amount} from ${d.featName}`)
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

const FeatAbilityChoice = ({
  feat,
  featName,
  featChoices,
  setFeatChoices,
  styles,
}) => {
  if (!feat?.modifiers?.abilityIncreases) return null;

  const choiceIncreases = feat.modifiers.abilityIncreases.filter(
    (increase) => increase.type === "choice"
  );

  if (choiceIncreases.length === 0) return null;

  const handleChoiceChange = (choiceKey, value) => {
    setFeatChoices((prev) => {
      const newChoices = {
        ...prev,
        [choiceKey]: value,
      };
      return newChoices;
    });
  };

  return (
    <div style={styles.featChoiceContainer}>
      <div style={styles.featChoiceLabel}>
        Choose ability score to increase:
      </div>
      {choiceIncreases.map((increase, index) => {
        const choiceKey = `${featName}_ability_${index}`;
        const currentChoice = featChoices[choiceKey];

        return (
          <div key={index} style={styles.abilityChoiceGroup}>
            {increase.abilities.map((ability) => (
              <label key={ability} style={styles.abilityChoiceLabel}>
                <input
                  type="radio"
                  name={choiceKey}
                  value={ability}
                  checked={currentChoice === ability}
                  onChange={(e) =>
                    handleChoiceChange(choiceKey, e.target.value)
                  }
                  style={styles.abilityChoiceRadio}
                />
                <span style={styles.abilityChoiceName}>
                  {ability.charAt(0).toUpperCase() + ability.slice(1)} (+
                  {increase.amount})
                </span>
              </label>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export const EnhancedFeatureSelector = ({
  character,
  setCharacter,
  setExpandedFeats,
  expandedFeats,
  featFilter,
  setFeatFilter,
  maxFeats = 1,
  isLevel1Choice = false,
  characterLevel = 1,
}) => {
  const { theme } = useTheme();
  const styles = createFeatStyles(theme);

  const featChoices = character.featChoices || {};
  const selectedFeats = useMemo(
    () => character.standardFeats || [],
    [character.standardFeats]
  );

  useEffect(() => {
    if (selectedFeats.length > 0) {
      let featToExpand;

      if (isLevel1Choice || selectedFeats.length === 1) {
        featToExpand = selectedFeats[0];
      } else {
        featToExpand = selectedFeats[selectedFeats.length - 1];
      }

      if (featToExpand && expandedFeats.size === 0) {
        setExpandedFeats(new Set([featToExpand]));
      }
    }
  }, [selectedFeats, isLevel1Choice, setExpandedFeats, expandedFeats.size]);

  const setFeatChoices = (updater) => {
    setCharacter((prev) => ({
      ...prev,
      featChoices:
        typeof updater === "function"
          ? updater(prev.featChoices || {})
          : updater,
    }));
  };

  const enhancedStyles = {
    ...styles,
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
    featChoiceContainer: {
      backgroundColor: theme.surfaceHover,
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      padding: "12px",
      marginTop: "8px",
    },
    featChoiceLabel: {
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
    abilityChoiceName: {
      color: theme.text,
    },
    featCheckbox: {
      width: "18px",
      height: "18px",
      marginRight: "8px",
      cursor: "pointer",
      accentColor: "#10b981",
      transform: "scale(1.2)",
    },
    abilityChoiceRadio: {
      width: "16px",
      height: "16px",
      marginRight: "6px",
      cursor: "pointer",
      accentColor: "#10b981",
    },
    customCheckbox: {
      left: "5px",
      width: "16px",
      height: "16px",
      marginRight: "8px",
      cursor: "pointer",
      accentColor: "#10b981",
      transform: "scale(1.2)",
    },
  };

  const handleFeatToggle = (featName) => {
    setCharacter((prev) => {
      const currentFeats = prev.standardFeats || [];
      const isCurrentlySelected = currentFeats.includes(featName);

      if (!isCurrentlySelected && currentFeats.length >= maxFeats) {
        return prev;
      }

      const newFeats = isCurrentlySelected
        ? currentFeats.filter((f) => f !== featName)
        : [...currentFeats, featName];

      if (isCurrentlySelected) {
        setFeatChoices((prev) => {
          const newChoices = { ...prev };
          Object.keys(newChoices).forEach((key) => {
            if (key.startsWith(featName + "_")) {
              delete newChoices[key];
            }
          });
          return newChoices;
        });

        setExpandedFeats((prev) => {
          const newSet = new Set(prev);
          newSet.delete(featName);
          return newSet;
        });
      } else {
        const feat = standardFeats.find((f) => f.name === featName);
        if (feat?.modifiers?.abilityIncreases) {
          setFeatChoices((prev) => {
            const newChoices = { ...prev };
            feat.modifiers.abilityIncreases.forEach((increase, index) => {
              if (increase.type === "choice") {
                const choiceKey = `${featName}_ability_${index}`;
                if (!newChoices[choiceKey]) {
                  newChoices[choiceKey] = increase.abilities[0];
                }
              }
            });
            return newChoices;
          });
        }

        setExpandedFeats(new Set([featName]));
      }

      return {
        ...prev,
        standardFeats: newFeats,
      };
    });
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
    if ((character.standardFeats || []).length >= maxFeats) {
      return standardFeats.filter((feat) =>
        (character.standardFeats || []).includes(feat.name)
      );
    }

    if (!featFilter.trim()) return standardFeats;

    const searchTerm = featFilter.toLowerCase();

    const matchingSkills = allSkills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(searchTerm) ||
        skill.displayName.toLowerCase().includes(searchTerm) ||
        skill.displayName.toLowerCase().startsWith(searchTerm) ||
        skill.name.toLowerCase().startsWith(searchTerm)
    );

    return standardFeats.filter((feat) => {
      const basicMatch =
        feat.name.toLowerCase().includes(searchTerm) ||
        feat.preview.toLowerCase().includes(searchTerm);

      const descriptionText = Array.isArray(feat.description)
        ? feat.description.join(" ").toLowerCase()
        : (feat.description || "").toLowerCase();

      const descriptionMatch = descriptionText.includes(searchTerm);

      const skillMatch = matchingSkills.some((skill) => {
        const skillDisplayName = skill.displayName.toLowerCase();
        const skillKey = skill.name.toLowerCase();

        return (
          descriptionText.includes(skillDisplayName) ||
          descriptionText.includes(skillKey) ||
          descriptionText.includes(`${skillDisplayName} check`) ||
          descriptionText.includes(`${skillDisplayName} checks`) ||
          descriptionText.includes(`${skillKey} check`) ||
          descriptionText.includes(`${skillKey} checks`) ||
          feat.name.toLowerCase().includes(skillDisplayName) ||
          feat.name.toLowerCase().includes(skillKey) ||
          feat.preview.toLowerCase().includes(skillDisplayName) ||
          feat.preview.toLowerCase().includes(skillKey)
        );
      });

      const skillTermMatch =
        matchingSkills.length > 0 &&
        matchingSkills.some((skill) => {
          const ability = skill.ability;

          return (
            descriptionText.includes(ability) ||
            descriptionText.includes(`${ability} check`) ||
            descriptionText.includes(`${ability} checks`) ||
            descriptionText.includes(`${ability} saving throw`) ||
            descriptionText.includes(`${ability}-based`)
          );
        });

      return basicMatch || descriptionMatch || skillMatch || skillTermMatch;
    });
  }, [character.standardFeats, maxFeats, featFilter]);

  const getHelpText = () => {
    if (characterLevel === 1) {
      return "Select your starting feat. Ability score bonuses will be shown below.";
    } else {
      return `Select your feats: 1 starting feat from Level 1, plus up to ${
        characterLevel - 1
      } additional feat${
        characterLevel > 2 ? "s" : ""
      } from Levels 2-${characterLevel}. Total possible: ${characterLevel} feat${
        characterLevel > 1 ? "s" : ""
      }. Ability score bonuses will be shown below.`;
    }
  };

  return (
    <div style={enhancedStyles.fieldContainer}>
      <h3 style={enhancedStyles.skillsHeader}>
        Standard Feats ({selectedFeats.length}/{maxFeats} selected)
      </h3>

      <div style={enhancedStyles.helpText}>{getHelpText()}</div>

      {/* Ability Score Modifier Pills */}
      {selectedFeats.length > 0 && (
        <AbilityModifierPills
          selectedFeats={selectedFeats}
          character={character}
          featChoices={featChoices}
          styles={enhancedStyles}
        />
      )}

      {selectedFeats.length < maxFeats && (
        <div style={enhancedStyles.featFilterContainer}>
          <input
            type="text"
            placeholder="Search feats by name, description, or ASI."
            value={featFilter}
            onChange={(e) => setFeatFilter(e.target.value)}
            style={enhancedStyles.featFilterInput}
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
            >
              ×
            </button>
          )}
          {featFilter.trim() && (
            <div style={enhancedStyles.featFilterResults}>
              Showing {filteredFeats.length} of {standardFeats.length} feats
              {(() => {
                const matchingSkills = allSkills.filter(
                  (skill) =>
                    skill.name
                      .toLowerCase()
                      .includes(featFilter.toLowerCase()) ||
                    skill.displayName
                      .toLowerCase()
                      .includes(featFilter.toLowerCase())
                );
                return (
                  matchingSkills.length > 0 && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginTop: "4px",
                      }}
                    >
                      Including feats that modify:{" "}
                      {matchingSkills.map((s) => s.displayName).join(", ")}
                    </div>
                  )
                );
              })()}
            </div>
          )}
        </div>
      )}

      {selectedFeats.length === maxFeats && (
        <div style={enhancedStyles.completionMessage}>
          ✓ Feat selection complete! You've selected {selectedFeats.length} of{" "}
          {maxFeats} feat
          {maxFeats > 1 ? "s" : ""}. Uncheck any feat to see all feats again.
        </div>
      )}

      <div style={enhancedStyles.featsContainer}>
        {filteredFeats.length === 0 ? (
          <div style={enhancedStyles.noFeatsFound}>
            No feats found matching "{featFilter}". Try a different search term
            or skill name.
          </div>
        ) : (
          filteredFeats.map((feat) => {
            const isSelected = selectedFeats.includes(feat.name);
            return (
              <div
                key={feat.name}
                style={
                  isSelected
                    ? enhancedStyles.featCardSelected
                    : enhancedStyles.featCard
                }
              >
                <div style={enhancedStyles.featHeader}>
                  <label style={enhancedStyles.featLabelClickable}>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleFeatToggle(feat.name)}
                        style={enhancedStyles.customCheckbox}
                        onFocus={(e) => {
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(139, 92, 246, 0.3)";
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    <span
                      style={
                        isSelected
                          ? enhancedStyles.featNameSelected
                          : enhancedStyles.featName
                      }
                    >
                      {feat.name}
                      {/* Show ability score bonuses in feat name */}
                      {feat.modifiers?.abilityIncreases?.length > 0 && (
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#10b981",
                            marginLeft: "4px",
                          }}
                        >
                          (+ASI)
                        </span>
                      )}
                    </span>
                  </label>
                  <button
                    onClick={() => toggleFeatExpansion(feat.name)}
                    style={enhancedStyles.expandButton}
                    type="button"
                  >
                    {expandedFeats.has(feat.name) ? "▲" : "▼"}
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

                {/* Feat Ability Choices */}
                {isSelected && (
                  <FeatAbilityChoice
                    feat={feat}
                    featName={feat.name}
                    featChoices={featChoices}
                    setFeatChoices={setFeatChoices}
                    styles={enhancedStyles}
                  />
                )}

                {expandedFeats.has(feat.name) && (
                  <div
                    style={
                      isSelected
                        ? enhancedStyles.featDescriptionSelected
                        : enhancedStyles.featDescription
                    }
                  >
                    <ul>
                      {feat.description.map((description, index) => (
                        <li key={index}>{description}</li>
                      ))}
                    </ul>

                    {/* Show ability score modifiers in description */}
                    {feat.modifiers?.abilityIncreases?.length > 0 && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "8px",
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                          borderRadius: "4px",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        <strong style={{ color: "#10b981" }}>
                          Ability Score Increases:
                        </strong>
                        <ul
                          style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}
                        >
                          {feat.modifiers.abilityIncreases.map(
                            (increase, index) => (
                              <li
                                key={index}
                                style={{ fontSize: "12px", color: "#10b981" }}
                              >
                                {increase.type === "fixed" &&
                                  `+${increase.amount} ${
                                    increase.ability.charAt(0).toUpperCase() +
                                    increase.ability.slice(1)
                                  }`}
                                {increase.type === "choice" &&
                                  `+${increase.amount} to ${increase.abilities
                                    .map(
                                      (a) =>
                                        a.charAt(0).toUpperCase() + a.slice(1)
                                    )
                                    .join(" or ")}`}
                                {increase.type === "spellcastingAbility" &&
                                  `+${increase.amount} to your spellcasting ability`}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div style={enhancedStyles.helpText}>
        Note: You can select {maxFeats} feat{maxFeats > 1 ? "s" : ""} total
        {isLevel1Choice
          ? " for a Level 1 character."
          : ` for your character level (${characterLevel}). Search supports skill names like "deception", "athletics", "perception", etc. Feats already selected at other levels are not available here.`}
        {selectedFeats.length > 0 &&
          " Ability score bonuses from selected feats are shown above."}
      </div>
    </div>
  );
};

export default EnhancedFeatureSelector;
