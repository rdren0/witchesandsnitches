import { standardFeats } from "../../../SharedData/standardFeatData";
import {
  AbilityScoreIncrements,
  FeatRequirementsInfo,
} from "../CharacterCreation/ASIComponents";
import { createFeatStyles } from "../../../styles/masterStyles";
import { useTheme } from "../../../contexts/ThemeContext";
import { useMemo } from "react";
import EnhancedFeatureSelector from "./EnhancedFeatureSelector";

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

const calculateAllFeatBenefits = (
  selectedFeat,
  character,
  featChoices = {}
) => {
  const benefits = {
    abilityModifiers: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
    skillProficiencies: [],
    expertise: [],
    savingThrowProficiencies: [],
    resistances: [],
    immunities: [],
    speeds: {},
    combatBonuses: {},
    spellcastingBenefits: {},
    specialAbilities: [],
    featDetails: {},
  };

  if (!selectedFeat) return benefits;

  const feat = standardFeats.find((f) => f.name === selectedFeat);
  if (!feat?.benefits) return benefits;

  const featBenefits = feat.benefits;
  const featName = feat.name;

  if (featBenefits.abilityScoreIncrease) {
    const increase = featBenefits.abilityScoreIncrease;
    let abilityToIncrease;

    if (increase.type === "choice" || increase.type === "choice_any") {
      const choiceKey = `${featName}_ability_0`;
      abilityToIncrease = featChoices[choiceKey] || increase.abilities?.[0];
    } else if (increase.type === "spellcasting_ability") {
      abilityToIncrease = getSpellcastingAbility(character);
    } else if (increase.ability) {
      abilityToIncrease = increase.ability;
    }

    if (
      abilityToIncrease &&
      benefits.abilityModifiers.hasOwnProperty(abilityToIncrease)
    ) {
      benefits.abilityModifiers[abilityToIncrease] += increase.amount;

      if (!benefits.featDetails[abilityToIncrease]) {
        benefits.featDetails[abilityToIncrease] = [];
      }
      benefits.featDetails[abilityToIncrease].push({
        featName,
        amount: increase.amount,
      });
    }
  }

  if (featBenefits.skillProficiencies?.length > 0) {
    featBenefits.skillProficiencies.forEach((skillProf) => {
      if (skillProf.type === "choice") {
        benefits.skillProficiencies.push({
          source: featName,
          type: "choice",
          count: skillProf.count,
          options: skillProf.skills || "any",
        });
      } else if (skillProf.skills) {
        skillProf.skills.forEach((skill) => {
          benefits.skillProficiencies.push({
            source: featName,
            skill: skill,
          });
        });
      }
    });
  }

  if (featBenefits.expertise?.length > 0) {
    featBenefits.expertise.forEach((exp) => {
      benefits.expertise.push({
        source: featName,
        type: exp.type,
        count: exp.count,
      });
    });
  }

  if (featBenefits.savingThrowProficiencies?.length > 0) {
    featBenefits.savingThrowProficiencies.forEach((save) => {
      benefits.savingThrowProficiencies.push({
        source: featName,
        type: save.type,
        count: save.count,
      });
    });
  }

  if (featBenefits.resistances?.length > 0) {
    featBenefits.resistances.forEach((resistance) => {
      benefits.resistances.push({
        source: featName,
        type: resistance,
      });
    });
  }

  if (featBenefits.immunities?.length > 0) {
    featBenefits.immunities.forEach((immunity) => {
      benefits.immunities.push({
        source: featName,
        type: immunity,
      });
    });
  }

  if (Object.keys(featBenefits.speeds || {}).length > 0) {
    Object.entries(featBenefits.speeds).forEach(([speedType, value]) => {
      if (!benefits.speeds[speedType]) benefits.speeds[speedType] = [];
      benefits.speeds[speedType].push({
        source: featName,
        value: value,
      });
    });
  }

  if (Object.keys(featBenefits.combatBonuses || {}).length > 0) {
    Object.entries(featBenefits.combatBonuses).forEach(([bonusType, value]) => {
      if (!benefits.combatBonuses[bonusType])
        benefits.combatBonuses[bonusType] = [];
      benefits.combatBonuses[bonusType].push({
        source: featName,
        value: value,
      });
    });
  }

  if (Object.keys(featBenefits.spellcasting || {}).length > 0) {
    Object.entries(featBenefits.spellcasting).forEach(
      ([benefitType, value]) => {
        if (!benefits.spellcastingBenefits[benefitType])
          benefits.spellcastingBenefits[benefitType] = [];
        benefits.spellcastingBenefits[benefitType].push({
          source: featName,
          value: value,
        });
      }
    );
  }

  if (featBenefits.specialAbilities?.length > 0) {
    featBenefits.specialAbilities.forEach((ability) => {
      benefits.specialAbilities.push({
        ...ability,
        source: featName,
      });
    });
  }

  return benefits;
};

const ASIFeatBenefitPills = ({
  selectedFeat,
  character,
  featChoices,
  styles,
}) => {
  const benefits = useMemo(() => {
    return calculateAllFeatBenefits(selectedFeat, character, featChoices);
  }, [selectedFeat, character, featChoices]);

  const hasAnyBenefits =
    Object.values(benefits.abilityModifiers).some((val) => val > 0) ||
    benefits.skillProficiencies.length > 0 ||
    benefits.expertise.length > 0 ||
    benefits.resistances.length > 0 ||
    benefits.immunities.length > 0 ||
    Object.keys(benefits.speeds).length > 0 ||
    Object.keys(benefits.combatBonuses).length > 0 ||
    Object.keys(benefits.spellcastingBenefits).length > 0 ||
    benefits.specialAbilities.length > 0;

  if (!hasAnyBenefits) return null;

  return (
    <div style={styles.modifierPillsContainer}>
      <div style={styles.pillsLabel}>Feat Benefits:</div>
      <div style={styles.pillsRow}>
        {Object.entries(benefits.abilityModifiers)
          .filter(([, value]) => value > 0)
          .map(([ability, totalBonus]) => {
            const details = benefits.featDetails[ability] || [];
            const tooltipText = details
              .map((d) => `+${d.amount} from ${d.featName}`)
              .join(", ");

            return (
              <div
                key={ability}
                style={styles.modifierPill}
                title={tooltipText}
              >
                <span style={styles.pillAbility}>
                  {ability.slice(0, 3).toUpperCase()}
                </span>
                <span style={styles.pillModifier}>+{totalBonus}</span>
              </div>
            );
          })}

        {benefits.skillProficiencies
          .filter((sp) => sp.skill)
          .map((skillProf, index) => (
            <div
              key={`skill-${index}`}
              style={styles.skillPill}
              title={`${skillProf.skill} proficiency from ${skillProf.source}`}
            >
              <span style={styles.pillAbility}>SKILL</span>
              <span style={styles.pillModifier}>
                {skillProf.skill.slice(0, 4).toUpperCase()}
              </span>
            </div>
          ))}

        {benefits.expertise.map((exp, index) => (
          <div
            key={`expertise-${index}`}
            style={styles.expertisePill}
            title={`Expertise (${exp.type}) from ${exp.source}`}
          >
            <span style={styles.pillAbility}>EXP</span>
            <span style={styles.pillModifier}>×2</span>
          </div>
        ))}

        {benefits.resistances.map((resistance, index) => (
          <div
            key={`resistance-${index}`}
            style={styles.resistancePill}
            title={`${resistance.type} resistance from ${resistance.source}`}
          >
            <span style={styles.pillAbility}>RES</span>
            <span style={styles.pillModifier}>
              {resistance.type.slice(0, 4).toUpperCase()}
            </span>
          </div>
        ))}

        {benefits.immunities.map((immunity, index) => (
          <div
            key={`immunity-${index}`}
            style={styles.immunityPill}
            title={`${immunity.type} immunity from ${immunity.source}`}
          >
            <span style={styles.pillAbility}>IMM</span>
            <span style={styles.pillModifier}>
              {immunity.type.slice(0, 4).toUpperCase()}
            </span>
          </div>
        ))}

        {Object.entries(benefits.combatBonuses).map(([bonusType, bonuses]) =>
          bonuses.map((bonus, index) => (
            <div
              key={`combat-${bonusType}-${index}`}
              style={styles.combatPill}
              title={`${bonusType}: ${bonus.value} from ${bonus.source}`}
            >
              <span style={styles.pillAbility}>
                {bonusType === "initiativeBonus"
                  ? "INIT"
                  : bonusType === "hitPointsPerLevel"
                  ? "HP"
                  : bonusType.slice(0, 4).toUpperCase()}
              </span>
              <span style={styles.pillModifier}>
                {typeof bonus.value === "number" ? `+${bonus.value}` : "✓"}
              </span>
            </div>
          ))
        )}

        {Object.entries(benefits.speeds).map(([speedType, speeds]) =>
          speeds.map((speed, index) => (
            <div
              key={`speed-${speedType}-${index}`}
              style={styles.speedPill}
              title={`${speedType} speed: ${speed.value} from ${speed.source}`}
            >
              <span style={styles.pillAbility}>
                {speedType.slice(0, 4).toUpperCase()}
              </span>
              <span style={styles.pillModifier}>
                {speed.value === "equal_to_walking" ? "=" : speed.value}
              </span>
            </div>
          ))
        )}

        {benefits.specialAbilities.slice(0, 3).map((ability, index) => (
          <div
            key={`ability-${index}`}
            style={styles.abilityPill}
            title={`${ability.name} from ${ability.source}`}
          >
            <span style={styles.pillAbility}>SPEC</span>
            <span style={styles.pillModifier}>
              {ability.name.slice(0, 4).toUpperCase()}
            </span>
          </div>
        ))}

        {benefits.specialAbilities.length > 3 && (
          <div
            style={styles.abilityPill}
            title={`${
              benefits.specialAbilities.length - 3
            } more special abilities`}
          >
            <span style={styles.pillAbility}>
              +{benefits.specialAbilities.length - 3}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const ASIFeatAdapter = ({
  level,
  character,
  choice,
  handleASIFeatChange,
  expandedFeats,
  setExpandedFeats,
  featFilter,
  setFeatFilter,
  styles,
}) => {
  const mockCharacter = {
    ...character,

    standardFeats: choice.selectedFeat ? [choice.selectedFeat] : [],

    asiChoices: (() => {
      const otherChoices = { ...character.asiChoices };
      delete otherChoices[level];
      return otherChoices;
    })(),

    featChoices: choice.featChoices || {},

    _editingASILevel: level,

    _originalStandardFeats: character.standardFeats || [],
  };

  const handleMockCharacterUpdate = (updater) => {
    if (typeof updater === "function") {
      const updated = updater(mockCharacter);
      const selectedFeats = updated.standardFeats || [];
      const featChoices = updated.featChoices || {};

      if (selectedFeats.length > 0) {
        handleASIFeatChange(level, selectedFeats[0], featChoices);
      } else {
        handleASIFeatChange(level, null, {});
      }
    } else {
      const selectedFeats = updater.standardFeats || [];
      const featChoices = updater.featChoices || {};

      if (selectedFeats.length > 0) {
        handleASIFeatChange(level, selectedFeats[0], featChoices);
      } else {
        handleASIFeatChange(level, null, {});
      }
    }
  };

  return (
    <div>
      {choice.selectedFeat && (
        <ASIFeatBenefitPills
          selectedFeat={choice.selectedFeat}
          character={character}
          featChoices={choice.featChoices || {}}
          styles={styles}
        />
      )}

      <EnhancedFeatureSelector
        character={mockCharacter}
        setCharacter={handleMockCharacterUpdate}
        expandedFeats={expandedFeats}
        setExpandedFeats={setExpandedFeats}
        featFilter={featFilter}
        setFeatFilter={setFeatFilter}
        maxFeats={1}
        isLevel1Choice={false}
        characterLevel={character.level}
        headerText={`Level ${level} Feat Selection`}
        helperText={`Select a feat for your Level ${level} ASI/Feat choice. Previously selected feats are not available.`}
      />
    </div>
  );
};

const ASILevelChoices = ({
  character,
  expandedFeats,
  setExpandedFeats,
  asiLevelFilters,
  setASILevelFilter,
  handleASIChoiceChange,
  handleASIAbilityChange,
  handleASIFeatChange,
  theme,
  styles: baseStyles,
}) => {
  const { theme: currentTheme } = useTheme();
  const enhancedStyles = createFeatStyles(currentTheme);

  const styles = useMemo(() => {
    return {
      ...baseStyles,
      ...enhancedStyles,

      level1ChoiceRadio: {
        width: "18px",
        height: "18px",
        accentColor: currentTheme.primary,
        cursor: "pointer",
      },

      customCheckbox: {
        width: "18px",
        height: "18px",
        marginRight: "8px",
        cursor: "pointer",
        accentColor: "#10b981",
        transform: "scale(1.1)",
      },

      featCheckbox: {
        width: "18px",
        height: "18px",
        marginRight: "8px",
        cursor: "pointer",
        accentColor: "#10b981",
        transform: "scale(1.1)",
      },

      abilityChoiceRadio: {
        width: "16px",
        height: "16px",
        marginRight: "6px",
        cursor: "pointer",
        accentColor: "#10b981",
      },

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

      skillPill: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: "#3b82f6",
        color: "white",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: "600",
        cursor: "help",
      },

      expertisePill: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: "600",
        cursor: "help",
      },

      resistancePill: {
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

      immunityPill: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: "#ef4444",
        color: "white",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: "600",
        cursor: "help",
      },

      combatPill: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: "#dc2626",
        color: "white",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: "600",
        cursor: "help",
      },

      speedPill: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: "#06b6d4",
        color: "white",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: "600",
        cursor: "help",
      },

      abilityPill: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: "#6366f1",
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

      choiceSection: {
        marginBottom: "12px",
      },

      choiceLabel: {
        fontSize: "11px",
        fontWeight: "600",
        color: currentTheme.text,
        marginBottom: "6px",
      },

      featChoiceContainer: {
        backgroundColor: currentTheme.surfaceHover,
        border: `1px solid ${currentTheme.border}`,
        borderRadius: "6px",
        padding: "12px",
        marginTop: "8px",
      },

      featChoiceLabel: {
        fontSize: "12px",
        fontWeight: "600",
        color: currentTheme.text,
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
        gap: "6px",
        fontSize: "12px",
        cursor: "pointer",
        padding: "8px 12px",
        borderRadius: "6px",
        border: `1px solid ${currentTheme.border}`,
        backgroundColor: currentTheme.surface,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: currentTheme.surfaceHover,
        },
      },

      abilityChoiceName: {
        color: currentTheme.text,
        fontWeight: "500",
      },
    };
  }, [baseStyles, enhancedStyles, currentTheme]);

  const ASI_LEVELS = [4, 8, 12, 16, 19];

  const getAvailableASILevels = (currentLevel) => {
    return ASI_LEVELS.filter((level) => level <= currentLevel);
  };

  const availableASILevels = getAvailableASILevels(character.level);

  if (availableASILevels.length === 0) {
    return null;
  }

  return (
    <>
      {availableASILevels.map((level) => {
        const choice = character.asiChoices?.[level] || {};
        const hasSelectedChoice =
          choice.type === "asi" ||
          (choice.type === "feat" && choice.selectedFeat);

        return (
          <div key={level} style={styles.fieldContainer}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <h3 style={styles.skillsHeader}>
                Level {level} Choice (
                {hasSelectedChoice ? "1/1 selected" : "0/1 selected"}) *
              </h3>
              {character.level > level && (
                <div style={styles.warningBadge}>
                  ⚠️ Creating Level {character.level} Character
                </div>
              )}
            </div>

            <div style={styles.helpText}>
              At level {level}, choose either an Ability Score Improvement (+2
              total, max +1 per ability) or a Standard Feat.
            </div>

            <div style={styles.level1ChoiceContainer}>
              <label
                style={
                  choice.type === "asi"
                    ? styles.level1ChoiceLabelSelected
                    : styles.level1ChoiceLabel
                }
              >
                <input
                  type="radio"
                  name={`level${level}Choice`}
                  value="asi"
                  checked={choice.type === "asi"}
                  onChange={() => handleASIChoiceChange(level, "asi")}
                  style={styles.level1ChoiceRadio}
                />
                <span
                  style={
                    choice.type === "asi"
                      ? styles.level1ChoiceTextSelected
                      : styles.level1ChoiceText
                  }
                >
                  Ability Score Improvement
                </span>
              </label>

              <label
                style={
                  choice.type === "feat"
                    ? styles.level1ChoiceLabelSelected
                    : styles.level1ChoiceLabel
                }
              >
                <input
                  type="radio"
                  name={`level${level}Choice`}
                  value="feat"
                  checked={choice.type === "feat"}
                  onChange={() => handleASIChoiceChange(level, "feat")}
                  style={styles.level1ChoiceRadio}
                />
                <span
                  style={
                    choice.type === "feat"
                      ? styles.level1ChoiceTextSelected
                      : styles.level1ChoiceText
                  }
                >
                  Standard Feat
                </span>
              </label>
            </div>

            {choice.type === "asi" && (
              <div style={{ marginTop: "16px" }}>
                {(choice.abilityScoreIncreases || []).length === 2 ? (
                  <div
                    style={{
                      ...styles.completionMessage,
                      background:
                        "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      borderRadius: "8px",
                      padding: "12px",
                      color: "#10b981",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>✓</span>
                    Ability Score Improvement selected!
                    <div
                      style={{
                        marginLeft: "auto",
                        fontSize: "12px",
                        color: "#059669",
                        fontWeight: "500",
                      }}
                    >
                      {choice.abilityScoreIncreases
                        .map(
                          (inc) =>
                            `+${inc.increase || 1} ${
                              inc.ability.charAt(0).toUpperCase() +
                              inc.ability.slice(1)
                            }`
                        )
                        .join(", ")}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: "8px",
                      padding: "12px",
                      color: "#3b82f6",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>📊</span>
                    Select ability score increases below:
                    <div
                      style={{
                        marginLeft: "auto",
                        fontSize: "11px",
                        color: "#2563eb",
                        fontWeight: "500",
                        padding: "2px 6px",
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        borderRadius: "4px",
                      }}
                    >
                      {(choice.abilityScoreIncreases || []).length}/2 selected
                    </div>
                  </div>
                )}

                <div
                  style={{
                    background: `linear-gradient(135deg, ${theme.surface} 0%, ${theme.surfaceHover} 100%)`,
                    border: `2px solid ${theme.border}`,
                    borderRadius: "12px",
                    padding: "16px",
                    marginTop: "12px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: theme.text,
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      paddingBottom: "8px",
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      ⚡
                    </span>
                    Ability Score Improvement
                    <div
                      style={{
                        marginLeft: "auto",
                        fontSize: "11px",
                        color: theme.textSecondary,
                        fontWeight: "500",
                        padding: "2px 8px",
                        backgroundColor: theme.surfaceHover,
                        borderRadius: "12px",
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      +2 total, max +1 per ability
                    </div>
                  </div>

                  <div
                    style={{
                      background: theme.surface,
                      border: `1px solid ${theme.border}`,
                      borderRadius: "8px",
                      padding: "12px",
                      marginTop: "8px",
                    }}
                  >
                    <AbilityScoreIncrements
                      level={level}
                      choice={choice}
                      character={character}
                      handleASIAbilityChange={handleASIAbilityChange}
                      theme={theme}
                      styles={styles}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: "12px",
                      padding: "8px 12px",
                      background:
                        (choice.abilityScoreIncreases || []).length === 2
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(156, 163, 175, 0.1)",
                      border: `1px solid ${
                        (choice.abilityScoreIncreases || []).length === 2
                          ? "rgba(16, 185, 129, 0.3)"
                          : "rgba(156, 163, 175, 0.3)"
                      }`,
                      borderRadius: "6px",
                      fontSize: "12px",
                      color:
                        (choice.abilityScoreIncreases || []).length === 2
                          ? "#059669"
                          : theme.textSecondary,
                      textAlign: "center",
                      fontWeight: "500",
                    }}
                  >
                    {(choice.abilityScoreIncreases || []).length === 0 &&
                      "⚪ No abilities selected yet"}
                    {(choice.abilityScoreIncreases || []).length === 1 &&
                      "🔄 Select one more ability"}
                    {(choice.abilityScoreIncreases || []).length === 2 &&
                      "✅ All ability improvements selected"}
                  </div>
                </div>
              </div>
            )}

            {choice.type === "feat" && (
              <div style={{ marginTop: "16px" }}>
                {choice.selectedFeat ? (
                  <div style={styles.completionMessage}>
                    ✓ Feat selected: {choice.selectedFeat}
                  </div>
                ) : (
                  <div style={styles.helpText}>
                    Select a Standard Feat from the options below:
                  </div>
                )}

                <div
                  style={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "8px",
                    padding: "12px",
                    marginTop: "8px",
                  }}
                >
                  <FeatRequirementsInfo character={character} />
                  <ASIFeatAdapter
                    level={level}
                    character={character}
                    choice={choice}
                    handleASIFeatChange={handleASIFeatChange}
                    expandedFeats={expandedFeats}
                    setExpandedFeats={setExpandedFeats}
                    featFilter={asiLevelFilters[level] || ""}
                    setFeatFilter={(filter) => setASILevelFilter(level, filter)}
                    theme={theme}
                    styles={styles}
                  />
                </div>
              </div>
            )}

            {!choice.type && (
              <div
                style={{
                  background: theme.surfaceHover,
                  border: `1px dashed ${theme.border}`,
                  borderRadius: "8px",
                  padding: "16px",
                  marginTop: "8px",
                  textAlign: "center",
                  color: theme.textSecondary,
                }}
              >
                <div style={{ fontSize: "16px", marginBottom: "4px" }}>
                  ⚪ No choice selected yet
                </div>
                <div style={{ fontSize: "12px" }}>
                  Choose either Ability Score Improvement or Standard Feat above
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default ASILevelChoices;
