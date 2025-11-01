import { useState, useMemo } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBackgroundStyles } from "../../../../utils/styles/masterStyles";
import { standardFeats } from "../../../../SharedData/standardFeatData";
import { getAllSelectedFeats } from "../../utils/characterUtils";

const FeatureSelectorSection = ({
  character,
  setCharacter,
  expandedFeats,
  setExpandedFeats,
  featFilter,
  setFeatFilter,
  maxFeats = 1,
  isLevel1Choice = false,
  characterLevel = 1,
  disabled = false,
  contextLevel = null,
}) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);

  const selectedFeats = (() => {
    const feats =
      character._editingASILevel && !isLevel1Choice
        ? (character.standardFeats || []).filter((feat) => feat)
        : character.standardFeats || [];

    return [...new Set(feats)];
  })();
  const featChoices = character.featChoices || {};

  const enhancedStyles = {
    ...styles,
    modifierPillsContainer: {
      backgroundColor: "rgba(251, 191, 36, 0.1)",
      border: "1px solid rgba(251, 191, 36, 0.3)",
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "16px",
    },
    pillsLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#f59e0b",
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
      backgroundColor: "#f59e0b",
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
    featFilterContainer: {
      position: "relative",
      marginBottom: "16px",
    },
    featFilterInput: {
      width: "100%",
      padding: "12px 40px 12px 16px",
      fontSize: "14px",
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      backgroundColor: theme.surface,
      color: theme.text,
      outline: "none",
      transition: "all 0.2s ease",
    },
    featFilterClearButton: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      fontSize: "18px",
      color: theme.textSecondary,
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px",
    },
    featFilterResults: {
      fontSize: "12px",
      color: theme.textSecondary,
      marginTop: "8px",
    },
    completionMessage: {
      backgroundColor: `${theme.success}20`,
      border: `1px solid ${theme.success}`,
      borderRadius: "8px",
      padding: "12px 16px",
      color: theme.success,
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "16px",
    },

    featChoicesContainer: {
      backgroundColor: `${theme.primary}10`,
      border: `1px solid ${theme.primary}30`,
      borderRadius: "6px",
      padding: "12px",
      marginTop: "12px",
    },
    featChoicesLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: theme.primary,
      marginBottom: "8px",
    },
    choiceGroup: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "12px",
    },
    choiceLabel: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      fontSize: "12px",
      color: theme.text,
      padding: "4px 8px",
      borderRadius: "4px",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      transition: "all 0.2s ease",
    },
    choiceRadio: {
      marginRight: "6px",
      accentColor: theme.primary,
    },
    choiceSection: {
      marginBottom: "16px",
    },
    choiceSectionTitle: {
      fontSize: "13px",
      fontWeight: "600",
      color: theme.primary,
      marginBottom: "8px",
      borderBottom: `1px solid ${theme.primary}30`,
      paddingBottom: "4px",
    },
  };
  const checkRequirement = (req) => {
    const type = req.type?.toLowerCase() || "";

    const patterns = {
      ability: /^(ability|ability[_\s]?score)$/i,
      level: /^level$/i,
      feat: /^feat$/i,
      innateHeritage: /^(innate[_\s]?heritage)$/i,
      skill: /^(skill|skill[_\s]?proficiency)$/i,
      castingStyle: /^(casting[_\s]?style)$/i,
      house: /^house$/i,
      background: /^background$/i,
      subclass: /^subclass$/i,
    };

    if (patterns.ability.test(type)) {
      const abilityName = req.value?.toLowerCase();
      const abilityScore = character.abilityScores?.[abilityName] || 0;
      const requiredAmount = req.amount || 13;
      return abilityScore >= requiredAmount;
    }

    if (patterns.level.test(type)) {
      const characterLevel = character.level || 1;
      const requiredLevel = req.amount || req.value || 1;
      return characterLevel >= requiredLevel;
    }

    if (patterns.feat.test(type)) {
      const allSelectedFeats = getAllSelectedFeats(character);
      return allSelectedFeats.includes(req.value);
    }

    if (patterns.innateHeritage.test(type)) {
      return character.innateHeritage === req.value;
    }

    if (patterns.skill.test(type)) {
      const skillProfs = character.skillProficiencies || [];
      return skillProfs.includes(req.value);
    }

    if (patterns.castingStyle.test(type)) {
      return character.castingStyle === req.value;
    }

    if (patterns.house.test(type)) {
      return character.house === req.value;
    }

    if (patterns.background.test(type)) {
      return character.background === req.value;
    }

    if (patterns.subclass.test(type)) {
      return character.subclass === req.value;
    }

    console.warn(`Unknown prerequisite type: ${req.type}`);
    return false;
  };

  const meetsPrerequisites = (feat, character) => {
    if (!feat.prerequisites) return true;

    if (feat.prerequisites.anyOf && Array.isArray(feat.prerequisites.anyOf)) {
      const meetsAnyOf = feat.prerequisites.anyOf.some(checkRequirement);
      if (!meetsAnyOf) return false;
    }

    if (feat.prerequisites.allOf && Array.isArray(feat.prerequisites.allOf)) {
      const meetsAllOf = feat.prerequisites.allOf.every(checkRequirement);
      if (!meetsAllOf) return false;
    }

    if (
      feat.prerequisites.type &&
      !feat.prerequisites.anyOf &&
      !feat.prerequisites.allOf
    ) {
      return checkRequirement(feat.prerequisites);
    }

    return true;
  };

  const featHasChoices = (feat) => {
    if (!feat?.benefits) return false;

    const asiIncrease = feat.benefits.abilityScoreIncrease;
    const hasAbilityChoice =
      asiIncrease &&
      (asiIncrease.type === "choice" ||
        asiIncrease.type === "choice_any" ||
        asiIncrease.ability === "choice");

    const hasSkillChoices = feat.benefits.skillProficiencies?.some(
      (skill) => typeof skill === "object" && skill.type === "choice"
    );

    const hasToolChoices = feat.benefits.toolProficiencies?.some(
      (tool) => typeof tool === "object" && tool.type === "choice"
    );

    const hasSaveChoices = feat.benefits.savingThrowProficiencies?.some(
      (save) => typeof save === "object" && save.type === "choice"
    );

    const hasSpecialChoices = feat.benefits.specialAbilities?.some(
      (ability) => ability.type === "choice" && ability.options
    );

    return (
      hasAbilityChoice ||
      hasSkillChoices ||
      hasToolChoices ||
      hasSaveChoices ||
      hasSpecialChoices
    );
  };

  const getFeatAbilityChoices = (feat) => {
    if (!feat?.benefits?.abilityScoreIncrease) return [];
    const asiIncrease = feat.benefits.abilityScoreIncrease;

    if (
      asiIncrease.type !== "choice" &&
      asiIncrease.type !== "choice_any" &&
      asiIncrease.ability !== "choice"
    ) {
      return [];
    }

    return (
      asiIncrease.abilities ||
      asiIncrease.options ||
      asiIncrease.choices || [
        "strength",
        "dexterity",
        "constitution",
        "intelligence",
        "wisdom",
        "charisma",
      ]
    );
  };

  const getFeatSkillChoices = (feat) => {
    if (!feat?.benefits?.skillProficiencies) return [];

    return feat.benefits.skillProficiencies
      .filter((skill) => typeof skill === "object" && skill.type === "choice")
      .map((choice, index) => ({
        ...choice,
        index,
        id: `skill_${index}`,
      }));
  };

  const getFeatToolChoices = (feat) => {
    if (!feat?.benefits?.toolProficiencies) return [];

    return feat.benefits.toolProficiencies
      .filter((tool) => typeof tool === "object" && tool.type === "choice")
      .map((choice, index) => ({
        ...choice,
        index,
        id: `tool_${index}`,
      }));
  };

  const getFeatSaveChoices = (feat) => {
    if (!feat?.benefits?.savingThrowProficiencies) return [];

    return feat.benefits.savingThrowProficiencies
      .filter((save) => typeof save === "object" && save.type === "choice")
      .map((choice, index) => ({
        ...choice,
        index,
        id: `save_${index}`,
      }));
  };

  const getFeatSpecialChoices = (feat) => {
    if (!feat?.benefits?.specialAbilities) return [];

    return feat.benefits.specialAbilities
      .filter((ability) => ability.type === "choice" && ability.options)
      .map((choice, index) => ({
        ...choice,
        index,
        id: `special_${index}`,
      }));
  };

  const getSelectedElementTypes = (
    character,
    featName,
    excludeCurrentLevel = false
  ) => {
    const featChoices = character.featChoices || {};
    const selectedTypes = [];

    Object.keys(featChoices).forEach((key) => {
      if (key.startsWith(`${featName}_`) && key.includes("_special_")) {
        if (
          excludeCurrentLevel &&
          contextLevel &&
          key.includes(`_level${contextLevel}_`)
        ) {
          return;
        }

        const value = featChoices[key];
        if (value && !selectedTypes.includes(value)) {
          selectedTypes.push(value);
        }
      }
    });

    if (excludeCurrentLevel && contextLevel) {
      Object.keys(featChoices).forEach((key) => {
        if (key === `${featName}_special_0` && !key.includes("_level")) {
          const value = featChoices[key];
          if (value && !selectedTypes.includes(value)) {
            selectedTypes.push(value);
          }
        }
      });
    }

    return selectedTypes;
  };

  const getCurrentInstanceKey = (featName, character) => {
    const feat = standardFeats.find((f) => f.name === featName);
    if (!feat?.repeatable) return featName;

    return contextLevel ? `${featName}_level${contextLevel}` : featName;
  };

  const canSelectFeat = (feat, character) => {
    if (!feat.repeatable) {
      if (character._editingASILevel && !isLevel1Choice) {
        return true;
      }
      const allSelectedFeats = getAllSelectedFeats(character);
      return !allSelectedFeats.includes(feat.name);
    }

    if (feat.name === "Elemental Adept") {
      const selectedElements = getSelectedElementTypes(character, feat.name);
      const availableElements = [
        "Acid",
        "Cold",
        "Fire",
        "Lightning",
        "Thunder",
      ];
      return selectedElements.length < availableElements.length;
    }

    return true;
  };

  const handleFeatToggle = (featName) => {
    setCharacter((prev) => {
      const currentFeats = [...new Set(prev.standardFeats || [])];
      const currentChoices = prev.featChoices || {};
      const feat = standardFeats.find((f) => f.name === featName);

      let newFeats, newChoices;

      if (currentFeats.includes(featName)) {
        if (!feat?.repeatable) {
          newFeats = currentFeats.filter((f) => f !== featName);
          newChoices = { ...currentChoices };

          Object.keys(newChoices).forEach((key) => {
            if (key.startsWith(`${featName}_`)) {
              delete newChoices[key];
            }
          });

          setExpandedFeats((prev) => {
            const newSet = new Set(prev);
            newSet.delete(featName);
            return newSet;
          });
        } else {
          const lastIndex = currentFeats.lastIndexOf(featName);
          newFeats = [
            ...currentFeats.slice(0, lastIndex),
            ...currentFeats.slice(lastIndex + 1),
          ];
          newChoices = { ...currentChoices };

          const levelKey = contextLevel
            ? `${featName}_level${contextLevel}`
            : featName;
          Object.keys(newChoices).forEach((key) => {
            if (key.startsWith(`${levelKey}_`)) {
              delete newChoices[key];
            }
          });

          if (!newFeats.includes(featName)) {
            setExpandedFeats((prev) => {
              const newSet = new Set(prev);
              newSet.delete(featName);
              return newSet;
            });
          }
        }
      } else {
        newFeats = [...currentFeats, featName];
        newChoices = { ...currentChoices };

        if (featHasChoices(feat)) {
          const keyPrefix =
            feat?.repeatable && contextLevel
              ? `${featName}_level${contextLevel}`
              : featName;

          const abilityChoices = getFeatAbilityChoices(feat);
          if (abilityChoices.length > 0) {
            const choiceKey = `${keyPrefix}_abilityChoice`;
            newChoices[choiceKey] = abilityChoices[0];
            newChoices[`${keyPrefix}_ability_0`] = abilityChoices[0];
          }

          const skillChoices = getFeatSkillChoices(feat);
          skillChoices.forEach((choice) => {
            const choiceKey = `${keyPrefix}_skill_${choice.index}`;
            if (choice.skills?.length > 0) {
              newChoices[choiceKey] = choice.skills[0];
            }
          });

          const toolChoices = getFeatToolChoices(feat);
          toolChoices.forEach((choice) => {
            const choiceKey = `${keyPrefix}_tool_${choice.index}`;
            if (choice.tools?.length > 0) {
              newChoices[choiceKey] = choice.tools[0];
            }
          });

          const saveChoices = getFeatSaveChoices(feat);
          saveChoices.forEach((choice) => {
            const choiceKey = `${keyPrefix}_save_${choice.index}`;
            if (choice.saves?.length > 0) {
              newChoices[choiceKey] = choice.saves[0];
            }
          });

          const specialChoices = getFeatSpecialChoices(feat);
          specialChoices.forEach((choice) => {
            const choiceKey = `${keyPrefix}_special_${choice.index}`;
            if (choice.options?.length > 0) {
              if (feat.name === "Elemental Adept") {
                const selectedElements = getSelectedElementTypes(
                  prev,
                  featName,
                  true
                );
                const availableElement = choice.options.find(
                  (option) => !selectedElements.includes(option)
                );
                newChoices[choiceKey] = availableElement || choice.options[0];
              } else {
                newChoices[choiceKey] = choice.options[0];
              }
            }
          });
        }

        setExpandedFeats(new Set([featName]));
      }

      return {
        ...prev,
        standardFeats: [...new Set(newFeats)],
        featChoices: newChoices,
      };
    });
  };

  const handleFeatChoiceChange = (featName, choiceKey, value) => {
    setCharacter((prev) => {
      const newChoices = {
        ...prev.featChoices,
        [choiceKey]: value,
      };

      if (choiceKey.includes("abilityChoice")) {
        newChoices[`${featName}_ability_0`] = value;
      }

      return {
        ...prev,
        featChoices: newChoices,
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

  const formatChoiceName = (name) => {
    if (!name) {
      return "";
    }
    const nameStr = String(name);
    if (!nameStr || nameStr.length === 0) {
      return "";
    }
    return (
      nameStr.charAt(0).toUpperCase() +
      nameStr.slice(1).replace(/([A-Z])/g, " $1")
    );
  };

  const filteredFeats = useMemo(() => {
    const allSelectedFeats =
      character._editingASILevel && !isLevel1Choice
        ? []
        : getAllSelectedFeats(character);
    const currentStandardFeats = character.standardFeats || [];

    if (currentStandardFeats.length >= maxFeats) {
      return standardFeats.filter((feat) =>
        currentStandardFeats.includes(feat.name)
      );
    }

    let availableFeats = standardFeats.filter((feat) => {
      if (currentStandardFeats.includes(feat.name)) {
        return true;
      }

      if (feat.repeatable) {
        return (
          canSelectFeat(feat, character) && meetsPrerequisites(feat, character)
        );
      }

      if (character._editingASILevel && !isLevel1Choice) {
        return meetsPrerequisites(feat, character);
      }

      if (allSelectedFeats.includes(feat.name)) {
        return false;
      }

      return meetsPrerequisites(feat, character);
    });

    if (!featFilter.trim()) {
      return availableFeats;
    }

    const searchTerm = featFilter.toLowerCase();
    return availableFeats.filter((feat) => {
      const basicMatch =
        feat.name.toLowerCase().includes(searchTerm) ||
        feat.preview.toLowerCase().includes(searchTerm);

      const descriptionText = Array.isArray(feat.description)
        ? feat.description.join(" ").toLowerCase()
        : (feat.description || "").toLowerCase();

      const descriptionMatch = descriptionText.includes(searchTerm);

      return basicMatch || descriptionMatch;
    });
  }, [character, maxFeats, featFilter, meetsPrerequisites]);

  const getHelpText = () => {
    if (characterLevel === 1) {
      return "Select your starting feat. All benefits will be shown below.";
    } else {
      return `Select your feats: 1 starting feat from Level 1, plus up to ${
        characterLevel - 1
      } additional feat${
        characterLevel > 2 ? "s" : ""
      } from Levels 2-${characterLevel}. Total possible: ${characterLevel} feat${
        characterLevel > 1 ? "s" : ""
      }. All benefits will be shown below.`;
    }
  };

  const allSelectedFeats = getAllSelectedFeats(character);
  const availableCount = standardFeats.length - allSelectedFeats.length;

  const featsFilteredByPrereqs = standardFeats.filter((feat) => {
    return (
      !allSelectedFeats.includes(feat.name) &&
      !meetsPrerequisites(feat, character)
    );
  }).length;

  return (
    <div style={styles.container}>
      <div
        style={{
          maxHeight: "800px",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "4px",
        }}
      >
        <h3 style={enhancedStyles.skillsHeader}>
          Standard Feats ({selectedFeats.length}/{maxFeats} selected)
        </h3>

        <div style={enhancedStyles.helpText}>
          {getHelpText()}
          {featsFilteredByPrereqs > 0 && (
            <div
              style={{
                fontSize: "12px",
                color: theme.warning,
                marginTop: "8px",
                fontStyle: "italic",
              }}
            >
              💡 {featsFilteredByPrereqs} feat
              {featsFilteredByPrereqs !== 1 ? "s are" : " is"} hidden because
              you don't meet the prerequisites yet.
            </div>
          )}
        </div>

        {selectedFeats.length < maxFeats && (
          <div style={enhancedStyles.featFilterContainer}>
            <input
              type="text"
              placeholder="Search feats by name, description, or benefits..."
              value={featFilter}
              onChange={(e) => setFeatFilter(e.target.value)}
              style={enhancedStyles.featFilterInput}
              disabled={disabled}
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
                disabled={disabled}
              >
                ×
              </button>
            )}
            {featFilter.trim() && (
              <div style={enhancedStyles.featFilterResults}>
                Showing {filteredFeats.length} of {availableCount} available
                feats
                {allSelectedFeats.length > 0 && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: theme.textSecondary,
                      marginLeft: "8px",
                    }}
                  >
                    ({allSelectedFeats.length} already selected)
                  </span>
                )}
                {featsFilteredByPrereqs > 0 && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: theme.warning,
                      marginLeft: "8px",
                    }}
                  >
                    ({featsFilteredByPrereqs} hidden due to unmet prerequisites)
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {selectedFeats.length === maxFeats && (
          <div style={enhancedStyles.completionMessage}>
            ✓ Feat selection complete!
          </div>
        )}

        <div style={enhancedStyles.availableElementsContainer}>
          {filteredFeats.map((feat) => {
            const isSelected = selectedFeats.includes(feat.name);
            const isExpanded = expandedFeats.has(feat.name);
            const hasChoices = featHasChoices(feat);
            const canSelect = canSelectFeat(feat, character);

            const abilityChoices = getFeatAbilityChoices(feat);
            const skillChoices = getFeatSkillChoices(feat);
            const toolChoices = getFeatToolChoices(feat);
            const saveChoices = getFeatSaveChoices(feat);

            return (
              <div
                key={feat.name}
                style={
                  isSelected
                    ? enhancedStyles.selectedElementCard
                    : enhancedStyles.featCard
                }
              >
                <div style={enhancedStyles.featHeader}>
                  <label style={enhancedStyles.featLabelClickable}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleFeatToggle(feat.name)}
                      disabled={
                        disabled ||
                        (!isSelected && selectedFeats.length >= maxFeats)
                      }
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "8px",
                        cursor:
                          disabled ||
                          (!isSelected && selectedFeats.length >= maxFeats)
                            ? "not-allowed"
                            : "pointer",
                        accentColor: isSelected ? theme.success : theme.primary,
                        transform: "scale(1.2)",
                      }}
                    />
                    <span
                      style={
                        isSelected
                          ? enhancedStyles.featNameSelected
                          : enhancedStyles.featName
                      }
                    >
                      {feat.name}
                      {feat.repeatable && (
                        <span
                          style={{
                            fontSize: "11px",
                            color: theme.textSecondary,
                            marginLeft: "4px",
                          }}
                        >
                          (Repeatable)
                        </span>
                      )}
                    </span>
                  </label>
                  <button
                    onClick={() => toggleFeatExpansion(feat.name)}
                    style={enhancedStyles.expandButton}
                    type="button"
                    disabled={disabled}
                  >
                    {isExpanded ? "▲" : "▼"}
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

                {isSelected && hasChoices && (
                  <div style={enhancedStyles.featChoicesContainer}>
                    {abilityChoices.length > 0 && (
                      <div style={enhancedStyles.choiceSection}>
                        <div style={enhancedStyles.choiceSectionTitle}>
                          Choose your ability score increase:
                        </div>
                        <div style={enhancedStyles.choiceGroup}>
                          {abilityChoices.map((ability) => {
                            const instanceKey = getCurrentInstanceKey(
                              feat.name,
                              character
                            );
                            const choiceKey = `${instanceKey}_abilityChoice`;
                            const currentChoice = featChoices[choiceKey];

                            return (
                              <label
                                key={ability}
                                style={{
                                  ...enhancedStyles.featChoiceLabel,
                                  backgroundColor:
                                    currentChoice === ability
                                      ? `${theme.primary}20`
                                      : theme.surface,
                                  borderColor:
                                    currentChoice === ability
                                      ? theme.primary
                                      : theme.border,
                                }}
                              >
                                <input
                                  type="radio"
                                  name={`${instanceKey}_ability_choice`}
                                  value={ability}
                                  checked={currentChoice === ability}
                                  onChange={(e) =>
                                    handleFeatChoiceChange(
                                      feat.name,
                                      choiceKey,
                                      e.target.value
                                    )
                                  }
                                  style={enhancedStyles.choiceRadio}
                                  disabled={disabled}
                                />
                                <span>{formatChoiceName(ability)} (+1)</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {skillChoices.map((choice) => (
                      <div key={choice.id} style={enhancedStyles.choiceSection}>
                        <div style={enhancedStyles.choiceSectionTitle}>
                          Choose {choice.count || 1} skill proficienc
                          {choice.count > 1 ? "ies" : "y"}:
                        </div>
                        <div style={enhancedStyles.choiceGroup}>
                          {choice.skills?.map((skill) => {
                            const choiceKey = `${feat.name}_skill_${choice.index}`;
                            const currentChoice = featChoices[choiceKey];

                            return (
                              <label
                                key={skill}
                                style={{
                                  ...enhancedStyles.featChoiceLabel,
                                  backgroundColor:
                                    currentChoice === skill
                                      ? `${theme.success}20`
                                      : theme.surface,
                                  borderColor:
                                    currentChoice === skill
                                      ? theme.success
                                      : theme.border,
                                }}
                              >
                                <input
                                  type="radio"
                                  name={`${feat.name}_skill_${choice.index}`}
                                  value={skill}
                                  checked={currentChoice === skill}
                                  onChange={(e) =>
                                    handleFeatChoiceChange(
                                      feat.name,
                                      choiceKey,
                                      e.target.value
                                    )
                                  }
                                  style={enhancedStyles.choiceRadio}
                                  disabled={disabled}
                                />
                                <span>{formatChoiceName(skill)}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {toolChoices.map((choice) => (
                      <div key={choice.id} style={enhancedStyles.choiceSection}>
                        <div style={enhancedStyles.choiceSectionTitle}>
                          Choose {choice.count || 1} tool proficienc
                          {choice.count > 1 ? "ies" : "y"}:
                        </div>
                        <div style={enhancedStyles.choiceGroup}>
                          {choice.tools?.map((tool) => {
                            const choiceKey = `${feat.name}_tool_${choice.index}`;
                            const currentChoice = featChoices[choiceKey];

                            return (
                              <label
                                key={tool}
                                style={{
                                  ...enhancedStyles.featChoiceLabel,
                                  backgroundColor:
                                    currentChoice === tool
                                      ? `${theme.warning}20`
                                      : theme.surface,
                                  borderColor:
                                    currentChoice === tool
                                      ? theme.warning
                                      : theme.border,
                                }}
                              >
                                <input
                                  type="radio"
                                  name={`${feat.name}_tool_${choice.index}`}
                                  value={tool}
                                  checked={currentChoice === tool}
                                  onChange={(e) =>
                                    handleFeatChoiceChange(
                                      feat.name,
                                      choiceKey,
                                      e.target.value
                                    )
                                  }
                                  style={enhancedStyles.choiceRadio}
                                  disabled={disabled}
                                />
                                <span>{formatChoiceName(tool)}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {saveChoices.map((choice) => (
                      <div key={choice.id} style={enhancedStyles.choiceSection}>
                        <div style={enhancedStyles.choiceSectionTitle}>
                          Choose {choice.count || 1} saving throw proficienc
                          {choice.count > 1 ? "ies" : "y"}:
                        </div>
                        <div style={enhancedStyles.choiceGroup}>
                          {choice.saves?.map((save) => {
                            const choiceKey = `${feat.name}_save_${choice.index}`;
                            const currentChoice = featChoices[choiceKey];

                            return (
                              <label
                                key={save}
                                style={{
                                  ...enhancedStyles.featChoiceLabel,
                                  backgroundColor:
                                    currentChoice === save
                                      ? `${theme.error}20`
                                      : theme.surface,
                                  borderColor:
                                    currentChoice === save
                                      ? theme.error
                                      : theme.border,
                                }}
                              >
                                <input
                                  type="radio"
                                  name={`${feat.name}_save_${choice.index}`}
                                  value={save}
                                  checked={currentChoice === save}
                                  onChange={(e) =>
                                    handleFeatChoiceChange(
                                      feat.name,
                                      choiceKey,
                                      e.target.value
                                    )
                                  }
                                  style={enhancedStyles.choiceRadio}
                                  disabled={disabled}
                                />
                                <span>{formatChoiceName(save)}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {getFeatSpecialChoices(feat).map((choice) => {
                      const instanceKey = getCurrentInstanceKey(
                        feat.name,
                        character
                      );
                      const choiceKey = `${instanceKey}_special_${choice.index}`;
                      const currentChoice = featChoices[choiceKey];

                      return (
                        <div
                          key={choice.id}
                          style={enhancedStyles.choiceSection}
                        >
                          <div style={enhancedStyles.choiceSectionTitle}>
                            {choice.name === "Energy Mastery"
                              ? "Choose energy type:"
                              : `Choose ${choice.name}:`}
                          </div>
                          <div style={enhancedStyles.choiceGroup}>
                            {choice.options?.map((option) => {
                              const currentInstanceKey = getCurrentInstanceKey(
                                feat.name,
                                character
                              );

                              const otherLevelElements = [];
                              const elementToLevelMap = {};

                              Object.keys(character.featChoices || {}).forEach(
                                (key) => {
                                  if (
                                    key.startsWith(`${feat.name}_`) &&
                                    key.includes("_special_") &&
                                    !key.startsWith(`${currentInstanceKey}_`)
                                  ) {
                                    const value = character.featChoices[key];
                                    if (
                                      value &&
                                      !otherLevelElements.includes(value)
                                    ) {
                                      otherLevelElements.push(value);

                                      const levelMatch =
                                        key.match(/_level(\d+)_/);
                                      elementToLevelMap[value] = levelMatch
                                        ? levelMatch[1]
                                        : "Unknown";
                                    }
                                  }
                                }
                              );

                              Object.keys(character.featChoices || {}).forEach(
                                (key) => {
                                  if (
                                    key === `${feat.name}_special_0` &&
                                    !key.includes("_level")
                                  ) {
                                    const value = character.featChoices[key];
                                    if (
                                      value &&
                                      !otherLevelElements.includes(value)
                                    ) {
                                      otherLevelElements.push(value);
                                      elementToLevelMap[value] = "1";
                                    }
                                  }
                                }
                              );

                              if (character.asiChoices) {
                                Object.entries(character.asiChoices).forEach(
                                  ([level, choice]) => {
                                    if (
                                      contextLevel &&
                                      parseInt(level) === parseInt(contextLevel)
                                    ) {
                                      return;
                                    }

                                    if (
                                      choice.type === "feat" &&
                                      choice.selectedFeat === feat.name &&
                                      choice.featChoices
                                    ) {
                                      Object.keys(choice.featChoices).forEach(
                                        (choiceKey) => {
                                          if (choiceKey.includes("_special_")) {
                                            const value =
                                              choice.featChoices[choiceKey];
                                            if (
                                              value &&
                                              !otherLevelElements.includes(
                                                value
                                              )
                                            ) {
                                              otherLevelElements.push(value);
                                              elementToLevelMap[value] = level;
                                            }
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }

                              const isAlreadySelected =
                                feat.name === "Elemental Adept" &&
                                otherLevelElements.includes(option);

                              return (
                                <label
                                  key={option}
                                  style={{
                                    ...enhancedStyles.featChoiceLabel,
                                    backgroundColor:
                                      currentChoice === option
                                        ? `${theme.primary}20`
                                        : theme.surface,
                                    borderColor:
                                      currentChoice === option
                                        ? theme.primary
                                        : theme.border,
                                    opacity: isAlreadySelected ? 0.5 : 1,
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name={`${instanceKey}_special_${choice.index}`}
                                    value={option}
                                    checked={currentChoice === option}
                                    onChange={(e) =>
                                      handleFeatChoiceChange(
                                        feat.name,
                                        choiceKey,
                                        e.target.value
                                      )
                                    }
                                    style={enhancedStyles.choiceRadio}
                                    disabled={disabled || isAlreadySelected}
                                  />
                                  <span>{option}</span>
                                  {isAlreadySelected && (
                                    <span
                                      style={{
                                        fontSize: "10px",
                                        color: theme.textSecondary,
                                        marginLeft: "4px",
                                      }}
                                    >
                                      (selected at level{" "}
                                      {elementToLevelMap[option]})
                                    </span>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {isExpanded && (
                  <div style={enhancedStyles.featDescription}>
                    <div style={{ marginBottom: "16px" }}>
                      {Array.isArray(feat.description) ? (
                        feat.description.map((desc, index) => (
                          <p
                            key={index}
                            style={{
                              fontSize: "14px",
                              lineHeight: "1.5",
                              color: theme.text,
                              margin: "0 0 12px 0",
                            }}
                          >
                            {desc}
                          </p>
                        ))
                      ) : (
                        <p
                          style={{
                            fontSize: "14px",
                            lineHeight: "1.5",
                            color: theme.text,
                            margin: "0 0 12px 0",
                          }}
                        >
                          {feat.description}
                        </p>
                      )}
                    </div>
                    {feat.benefits && (
                      <div style={{ marginTop: "12px" }}>
                        <strong
                          style={{ fontSize: "12px", color: theme.primary }}
                        >
                          Benefits:
                        </strong>
                        <div
                          style={{
                            fontSize: "12px",
                            marginTop: "8px",
                            lineHeight: "1.4",
                          }}
                        >
                          {feat.benefits.abilityScoreIncrease && (
                            <div
                              style={{
                                color: "#8b5cf6",
                                marginBottom: "8px",
                                padding: "4px 0",
                              }}
                            >
                              <strong>• Ability Score Increase:</strong>{" "}
                              {feat.benefits.abilityScoreIncrease.ability ===
                                "choice" ||
                              feat.benefits.abilityScoreIncrease.type ===
                                "choice" ||
                              feat.benefits.abilityScoreIncrease.type ===
                                "choice_any" ? (
                                <>
                                  +
                                  {feat.benefits.abilityScoreIncrease.amount ||
                                    1}{" "}
                                  to{" "}
                                  {isSelected && abilityChoices.length > 0 ? (
                                    <span
                                      style={{
                                        color: theme.primary,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {formatChoiceName(
                                        featChoices[
                                          `${feat.name}_abilityChoice`
                                        ] || abilityChoices[0]
                                      )}
                                    </span>
                                  ) : (
                                    abilityChoices
                                      .map(formatChoiceName)
                                      .join(" or ")
                                  )}
                                </>
                              ) : feat.benefits.abilityScoreIncrease.type ===
                                "spellcasting_ability" ? (
                                <>
                                  +
                                  {feat.benefits.abilityScoreIncrease.amount ||
                                    1}{" "}
                                  to Spellcasting Ability
                                </>
                              ) : (
                                <>
                                  +
                                  {feat.benefits.abilityScoreIncrease.amount ||
                                    1}{" "}
                                  {formatChoiceName(
                                    feat.benefits.abilityScoreIncrease
                                      .ability ||
                                      feat.benefits.abilityScoreIncrease.type ||
                                      ""
                                  )}
                                </>
                              )}
                            </div>
                          )}

                          {feat.benefits.skillProficiencies?.length > 0 && (
                            <div
                              style={{
                                color: "#10b981",
                                marginBottom: "8px",
                                padding: "4px 0",
                              }}
                            >
                              <strong>• Skill Proficiencies:</strong>{" "}
                              {feat.benefits.skillProficiencies
                                .map((skillProf, index) => {
                                  if (typeof skillProf === "string") {
                                    return formatChoiceName(skillProf);
                                  } else if (
                                    skillProf &&
                                    typeof skillProf === "object"
                                  ) {
                                    if (skillProf.type === "choice") {
                                      if (isSelected) {
                                        const choiceKey = `${feat.name}_skill_${index}`;
                                        const selectedSkill =
                                          featChoices[choiceKey];
                                        return selectedSkill
                                          ? `${formatChoiceName(
                                              selectedSkill
                                            )} (chosen)`
                                          : `${
                                              skillProf.count || 1
                                            } chosen skill${
                                              skillProf.count > 1 ? "s" : ""
                                            }`;
                                      } else {
                                        return skillProf.skills
                                          ? skillProf.skills
                                              .map(formatChoiceName)
                                              .join(" or ")
                                          : `${
                                              skillProf.count || 1
                                            } chosen skill${
                                              skillProf.count > 1 ? "s" : ""
                                            }`;
                                      }
                                    } else if (
                                      skillProf.skills &&
                                      Array.isArray(skillProf.skills)
                                    ) {
                                      return skillProf.skills
                                        .map(formatChoiceName)
                                        .join(", ");
                                    } else if (skillProf.skill) {
                                      return formatChoiceName(skillProf.skill);
                                    }
                                  }
                                  return "Unknown skill";
                                })
                                .join(", ")}
                            </div>
                          )}

                          {feat.benefits.toolProficiencies?.length > 0 && (
                            <div
                              style={{
                                color: "#f59e0b",
                                marginBottom: "8px",
                                padding: "4px 0",
                              }}
                            >
                              <strong>• Tool Proficiencies:</strong>{" "}
                              {feat.benefits.toolProficiencies
                                .map((toolProf, index) => {
                                  if (typeof toolProf === "string") {
                                    return toolProf;
                                  } else if (
                                    toolProf &&
                                    typeof toolProf === "object" &&
                                    toolProf.type === "choice"
                                  ) {
                                    if (isSelected) {
                                      const choiceKey = `${feat.name}_tool_${index}`;
                                      const selectedTool =
                                        featChoices[choiceKey];
                                      return selectedTool
                                        ? `${selectedTool} (chosen)`
                                        : `${toolProf.count || 1} chosen tool${
                                            toolProf.count > 1 ? "s" : ""
                                          }`;
                                    } else {
                                      return toolProf.tools
                                        ? toolProf.tools.join(" or ")
                                        : `${toolProf.count || 1} chosen tool${
                                            toolProf.count > 1 ? "s" : ""
                                          }`;
                                    }
                                  }
                                  return toolProf;
                                })
                                .join(", ")}
                            </div>
                          )}

                          {feat.benefits.savingThrowProficiencies?.length >
                            0 && (
                            <div
                              style={{
                                color: "#ef4444",
                                marginBottom: "8px",
                                padding: "4px 0",
                              }}
                            >
                              <strong>• Saving Throw Proficiencies:</strong>{" "}
                              {feat.benefits.savingThrowProficiencies
                                .map((saveProf, index) => {
                                  if (typeof saveProf === "string") {
                                    return formatChoiceName(saveProf);
                                  } else if (
                                    saveProf &&
                                    typeof saveProf === "object" &&
                                    saveProf.type === "choice"
                                  ) {
                                    if (isSelected) {
                                      const choiceKey = `${feat.name}_save_${index}`;
                                      const selectedSave =
                                        featChoices[choiceKey];
                                      return selectedSave
                                        ? `${formatChoiceName(
                                            selectedSave
                                          )} (chosen)`
                                        : `${saveProf.count || 1} chosen save${
                                            saveProf.count > 1 ? "s" : ""
                                          }`;
                                    } else {
                                      return saveProf.saves
                                        ? saveProf.saves
                                            .map(formatChoiceName)
                                            .join(" or ")
                                        : `${saveProf.count || 1} chosen save${
                                            saveProf.count > 1 ? "s" : ""
                                          }`;
                                    }
                                  }
                                  return saveProf;
                                })
                                .join(", ")}
                            </div>
                          )}

                          {feat.benefits.speeds &&
                            Object.keys(feat.benefits.speeds).length > 0 && (
                              <div
                                style={{
                                  color: "#06b6d4",
                                  marginBottom: "8px",
                                  padding: "4px 0",
                                }}
                              >
                                <strong>• Speed Bonuses:</strong>{" "}
                                {Object.entries(feat.benefits.speeds)
                                  .map(
                                    ([type, speed]) =>
                                      `${
                                        speed.bonus ? `+${speed.bonus}` : speed
                                      } ft ${type}`
                                  )
                                  .join(", ")}
                              </div>
                            )}

                          {feat.benefits.resistances?.length > 0 && (
                            <div
                              style={{
                                color: "#84cc16",
                                marginBottom: "8px",
                                padding: "4px 0",
                              }}
                            >
                              <strong>• Damage Resistances:</strong>{" "}
                              {feat.benefits.resistances
                                .map(formatChoiceName)
                                .join(", ")}
                            </div>
                          )}

                          {feat.benefits.immunities?.length > 0 && (
                            <div
                              style={{
                                color: "#22c55e",
                                marginBottom: "8px",
                                padding: "4px 0",
                              }}
                            >
                              <strong>• Damage Immunities:</strong>{" "}
                              {feat.benefits.immunities
                                .map(formatChoiceName)
                                .join(", ")}
                            </div>
                          )}

                          {feat.benefits.specialAbilities?.length > 0 && (
                            <div
                              style={{
                                color: "#a855f7",
                                marginBottom: "8px",
                                padding: "4px 0",
                              }}
                            >
                              <strong>• Special Abilities:</strong>{" "}
                              {feat.benefits.specialAbilities
                                .map(
                                  (ability) =>
                                    ability.name || ability.description
                                )
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {feat.prerequisites && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "8px",
                          backgroundColor: meetsPrerequisites(feat, character)
                            ? "rgba(34, 197, 94, 0.1)"
                            : "rgba(239, 68, 68, 0.1)",
                          borderRadius: "4px",
                          border: `1px solid ${
                            meetsPrerequisites(feat, character)
                              ? "rgba(34, 197, 94, 0.3)"
                              : "rgba(239, 68, 68, 0.3)"
                          }`,
                        }}
                      >
                        <strong
                          style={{
                            color: meetsPrerequisites(feat, character)
                              ? "#22c55e"
                              : "#ef4444",
                          }}
                        >
                          Prerequisites:{" "}
                          {meetsPrerequisites(feat, character)
                            ? "✓ Met"
                            : "✗ Not Met"}
                        </strong>
                        <div
                          style={{
                            fontSize: "12px",
                            color: meetsPrerequisites(feat, character)
                              ? "#16a34a"
                              : "#ef4444",
                            marginTop: "4px",
                          }}
                        >
                          {feat.prerequisites?.anyOf?.map((req, index) => {
                            const meetsSingle = checkRequirement(req);

                            return (
                              <div
                                key={index}
                                style={{
                                  marginLeft: "12px",
                                  color: meetsSingle ? "#22c55e" : "#ef4444",
                                  fontWeight: meetsSingle ? "600" : "normal",
                                }}
                              >
                                {meetsSingle ? "✓" : "✗"}{" "}
                                {formatChoiceName(req.type || "")}:{" "}
                                {formatChoiceName(req.value || "")}{" "}
                                {req.amount && `(${req.amount}+)`}
                                {req.type?.toLowerCase().includes("ability") &&
                                  character.abilityScores?.[
                                    req.value?.toLowerCase()
                                  ] &&
                                  ` (Current: ${
                                    character.abilityScores[
                                      req.value.toLowerCase()
                                    ]
                                  })`}
                              </div>
                            );
                          })}
                          {feat.prerequisites.allOf && (
                            <div>
                              <strong>All of:</strong>
                              {feat.prerequisites.allOf.map((req, index) => {
                                const meetsSingle = (() => {
                                  switch (req.type?.toLowerCase()) {
                                    case "ability":
                                    case "ability_score": {
                                      const abilityScore =
                                        character.abilityScores?.[
                                          req.value?.toLowerCase()
                                        ] || 0;
                                      return abilityScore >= (req.amount || 13);
                                    }
                                    case "level":
                                      return (
                                        (character.level || 1) >=
                                        (req.amount || req.value || 1)
                                      );
                                    case "feat":
                                      return getAllSelectedFeats(
                                        character
                                      ).includes(req.value);
                                    case "skill":
                                    case "skill_proficiency":
                                      return (
                                        character.skillProficiencies || []
                                      ).includes(req.value);
                                    case "casting_style":
                                      return (
                                        character.castingStyle === req.value
                                      );
                                    case "house":
                                      return character.house === req.value;
                                    case "background":
                                      return character.background === req.value;
                                    case "subclass":
                                      return character.subclass === req.value;
                                    default:
                                      return true;
                                  }
                                })();

                                return (
                                  <div
                                    key={index}
                                    style={{
                                      marginLeft: "12px",
                                      color: meetsSingle
                                        ? "#22c55e"
                                        : "#ef4444",
                                      fontWeight: meetsSingle
                                        ? "600"
                                        : "normal",
                                    }}
                                  >
                                    {meetsSingle ? "✓" : "✗"}{" "}
                                    {formatChoiceName(req.type || "")}:{" "}
                                    {formatChoiceName(req.value || "")}{" "}
                                    {req.amount && `(${req.amount}+)`}
                                    {req.type
                                      ?.toLowerCase()
                                      .includes("ability") &&
                                      character.abilityScores?.[
                                        req.value?.toLowerCase()
                                      ] &&
                                      ` (Current: ${
                                        character.abilityScores[
                                          req.value.toLowerCase()
                                        ]
                                      })`}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {feat.prerequisites.type &&
                            !feat.prerequisites.anyOf &&
                            !feat.prerequisites.allOf && (
                              <div>
                                • {formatChoiceName(feat.prerequisites.type)}:{" "}
                                {formatChoiceName(feat.prerequisites.value)}{" "}
                                {feat.prerequisites.amount &&
                                  `(${feat.prerequisites.amount}+)`}
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureSelectorSection;
