import { standardFeats } from "../../../../SharedData/standardFeatData";
import { createFeatStyles } from "../../../../styles/masterStyles";
import { useTheme } from "../../../../contexts/ThemeContext";
import { allSkills } from "../../../../SharedData/data";
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

const calculateAllFeatBenefits = (
  selectedFeats,
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

  selectedFeats.forEach((featName) => {
    const feat = standardFeats.find((f) => f.name === featName);
    if (!feat?.benefits) return;

    const featBenefits = feat.benefits;

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
      Object.entries(featBenefits.combatBonuses).forEach(
        ([bonusType, value]) => {
          if (!benefits.combatBonuses[bonusType])
            benefits.combatBonuses[bonusType] = [];
          benefits.combatBonuses[bonusType].push({
            source: featName,
            value: value,
          });
        }
      );
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
  });

  return benefits;
};

const ComprehensiveFeatBenefitPills = ({
  selectedFeats,
  character,
  featChoices,
  styles,
}) => {
  const benefits = useMemo(() => {
    return calculateAllFeatBenefits(selectedFeats, character, featChoices);
  }, [selectedFeats, character, featChoices]);

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
      <div style={styles.pillsLabel}>📋 Feat Benefits:</div>
      <div style={styles.pillsRow}>
        {Object.entries(benefits.abilityModifiers)
          .filter(([_, value]) => value > 0)
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

const FeatChoicesSection = ({
  feat,
  featName,
  featChoices,
  setFeatChoices,
  styles,
}) => {
  if (!feat?.benefits) return null;

  const hasChoices =
    feat.benefits.abilityScoreIncrease?.type === "choice" ||
    feat.benefits.abilityScoreIncrease?.type === "choice_any" ||
    feat.benefits.skillProficiencies?.some((sp) => sp.type === "choice") ||
    feat.benefits.expertise?.some((exp) => exp.type === "choice") ||
    feat.benefits.savingThrowProficiencies?.some(
      (stp) => stp.type === "choice"
    );

  if (!hasChoices) return null;

  const handleChoiceChange = (choiceKey, value) => {
    setFeatChoices((prev) => ({
      ...prev,
      [choiceKey]: value,
    }));
  };

  return (
    <div style={styles.featChoiceContainer}>
      <div style={styles.featChoiceLabel}>Make your selections:</div>

      {(feat.benefits.abilityScoreIncrease?.type === "choice" ||
        feat.benefits.abilityScoreIncrease?.type === "choice_any") && (
        <div style={styles.choiceSection}>
          <div style={styles.choiceLabel}>
            Choose ability score to increase:
          </div>
          <div style={styles.abilityChoiceGroup}>
            {(
              feat.benefits.abilityScoreIncrease.abilities || [
                "strength",
                "dexterity",
                "constitution",
                "intelligence",
                "wisdom",
                "charisma",
              ]
            ).map((ability) => {
              const choiceKey = `${featName}_ability_0`;
              const currentChoice = featChoices[choiceKey];

              return (
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
                    {feat.benefits.abilityScoreIncrease.amount})
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {feat.benefits.skillProficiencies
        ?.filter((sp) => sp.type === "choice")
        .map((skillChoice, index) => {
          const availableSkills =
            skillChoice?.skills === "any"
              ? allSkills?.map((s) => s.displayName) || []
              : skillChoice?.skills || [];

          return (
            <div key={`skill-choice-${index}`} style={styles.choiceSection}>
              <div style={styles.choiceLabel}>
                Choose {skillChoice.count} skill proficienc
                {skillChoice.count > 1 ? "ies" : "y"}:
              </div>
              <div style={styles.skillChoiceGrid}>
                {availableSkills.map((skill) => {
                  const choiceKey = `${featName}_skill_${index}_${skill}`;
                  const currentChoice = featChoices[choiceKey];

                  return (
                    <label key={skill} style={styles.skillChoiceLabel}>
                      <input
                        type="checkbox"
                        name={choiceKey}
                        checked={currentChoice || false}
                        onChange={(e) =>
                          handleChoiceChange(choiceKey, e.target.checked)
                        }
                        style={styles.skillChoiceCheckbox}
                      />
                      <span style={styles.skillChoiceName}>
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

const getAllSelectedFeats = (character) => {
  const selectedFeats = new Set();

  const standardFeatsToCheck =
    character._editingASILevel && character._originalStandardFeats
      ? character._originalStandardFeats
      : character.standardFeats || [];

  if (character.level1ChoiceType === "feat") {
    standardFeatsToCheck.forEach((feat) => selectedFeats.add(feat));
  }

  if (character.asiChoices) {
    Object.values(character.asiChoices).forEach((choice) => {
      if (choice.type === "feat" && choice.selectedFeat) {
        selectedFeats.add(choice.selectedFeat);
      }
    });
  }

  return Array.from(selectedFeats);
};

export const EnhancedFeatureSelectorEdit = ({
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

  const featChoices = useMemo(
    () => character.featChoices || {},
    [character.featChoices]
  );

  const selectedFeats = useMemo(
    () => character.standardFeats || [],
    [character.standardFeats]
  );

  const selectedFeatsData = useMemo(() => {
    return selectedFeats
      .map((featName) => standardFeats.find((f) => f.name === featName))
      .filter(Boolean);
  }, [selectedFeats]);

  const availableFeats = useMemo(() => {
    if (selectedFeats.length >= maxFeats) {
      return [];
    }

    const allSelectedFeats = getAllSelectedFeats(character);
    let availableFeats = standardFeats.filter(
      (feat) => !allSelectedFeats.includes(feat.name)
    );

    if (!featFilter.trim()) {
      return availableFeats.sort((a, b) => a.name.localeCompare(b.name));
    }

    const searchTerm = featFilter.toLowerCase();
    const matchingSkills = allSkills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(searchTerm) ||
        skill.displayName.toLowerCase().includes(searchTerm) ||
        skill.displayName.toLowerCase().startsWith(searchTerm) ||
        skill.name.toLowerCase().startsWith(searchTerm)
    );

    return availableFeats.filter((feat) => {
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
  }, [character, maxFeats, featFilter, selectedFeats]);

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
      color: theme.text,
      marginBottom: "6px",
    },
    skillChoiceGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "4px",
    },
    skillChoiceLabel: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "11px",
      cursor: "pointer",
      padding: "2px 6px",
      borderRadius: "4px",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
    },
    skillChoiceCheckbox: {
      width: "14px",
      height: "14px",
      cursor: "pointer",
      accentColor: "#10b981",
    },
    skillChoiceName: {
      color: theme.text,
      fontSize: "11px",
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
    abilityChoiceRadio: {
      width: "16px",
      height: "16px",
      marginRight: "6px",
      cursor: "pointer",
      accentColor: "#10b981",
    },
    customCheckbox: {
      width: "18px",
      height: "18px",
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
        if (feat?.benefits) {
          setFeatChoices((prev) => {
            const newChoices = { ...prev };

            if (
              feat.benefits.abilityScoreIncrease?.type === "choice" ||
              feat.benefits.abilityScoreIncrease?.type === "choice_any"
            ) {
              const choiceKey = `${featName}_ability_0`;
              if (!newChoices[choiceKey]) {
                const abilities = feat.benefits.abilityScoreIncrease
                  .abilities || [
                  "strength",
                  "dexterity",
                  "constitution",
                  "intelligence",
                  "wisdom",
                  "charisma",
                ];
                newChoices[choiceKey] = abilities[0];
              }
            }

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

  return (
    <div style={enhancedStyles.fieldContainer}>
      <div
        style={{
          maxHeight: "800px",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "4px",
        }}
      >
        <div style={enhancedStyles.sectionHeader}>
          <h3 style={enhancedStyles.skillsHeader}>
            Standard Feats ({selectedFeats.length}/{maxFeats} selected)
          </h3>
          {selectedFeats.length > 0 && (
            <span style={enhancedStyles.selectionStatus}>
              Selected: {selectedFeats.join(", ")}
            </span>
          )}
        </div>

        <div style={enhancedStyles.helpText}>{getHelpText()}</div>

        {selectedFeats.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                padding: "8px 12px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderRadius: "6px",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <h4
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#10b981",
                }}
              >
                Selected Feats
              </h4>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#10b981",
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  padding: "2px 8px",
                  borderRadius: "12px",
                }}
              >
                {selectedFeats.length} Selected
              </span>
            </div>

            <ComprehensiveFeatBenefitPills
              selectedFeats={selectedFeats}
              character={character}
              featChoices={featChoices}
              styles={enhancedStyles}
            />

            <div style={enhancedStyles.featsContainer}>
              {selectedFeatsData.map((feat) => {
                if (!feat) return null;

                const isExpanded = expandedFeats.has(feat.name);
                const hasBenefits =
                  feat.benefits &&
                  (feat.benefits.abilityScoreIncrease ||
                    feat.benefits.skillProficiencies?.length > 0 ||
                    feat.benefits.expertise?.length > 0 ||
                    feat.benefits.resistances?.length > 0 ||
                    feat.benefits.immunities?.length > 0 ||
                    Object.keys(feat.benefits.speeds || {}).length > 0 ||
                    Object.keys(feat.benefits.combatBonuses || {}).length > 0 ||
                    Object.keys(feat.benefits.spellcasting || {}).length > 0 ||
                    feat.benefits.specialAbilities?.length > 0);

                return (
                  <div key={feat.name} style={enhancedStyles.featCardSelected}>
                    <div style={enhancedStyles.featHeader}>
                      <label style={enhancedStyles.featLabelClickable}>
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => handleFeatToggle(feat.name)}
                          style={enhancedStyles.customCheckbox}
                        />
                        <span style={enhancedStyles.featNameSelected}>
                          {feat.name}
                          {hasBenefits && (
                            <span
                              style={{
                                fontSize: "10px",
                                color: "#10b981",
                                marginLeft: "4px",
                              }}
                            >
                              (+BENEFITS)
                            </span>
                          )}
                        </span>
                      </label>
                      <button
                        onClick={() => toggleFeatExpansion(feat.name)}
                        style={enhancedStyles.expandButton}
                        type="button"
                      >
                        {isExpanded ? "▲" : "▼"}
                      </button>
                    </div>

                    <div style={enhancedStyles.featPreviewSelected}>
                      {feat.preview}
                    </div>

                    <FeatChoicesSection
                      feat={feat}
                      featName={feat.name}
                      featChoices={featChoices}
                      setFeatChoices={setFeatChoices}
                      styles={enhancedStyles}
                    />

                    {isExpanded && (
                      <div style={enhancedStyles.featDescriptionSelected}>
                        <ul
                          style={{ margin: "0 0 16px 0", paddingLeft: "20px" }}
                        >
                          {feat.description.map((description, index) => (
                            <li key={index} style={{ marginBottom: "4px" }}>
                              {description}
                            </li>
                          ))}
                        </ul>

                        {hasBenefits && (
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
                              Mechanical Benefits:
                            </strong>
                            <div
                              style={{ margin: "4px 0 0 0", fontSize: "12px" }}
                            >
                              {feat.benefits.abilityScoreIncrease && (
                                <div
                                  style={{
                                    color: "#10b981",
                                    marginBottom: "2px",
                                  }}
                                >
                                  • Ability Score:{" "}
                                  {feat.benefits.abilityScoreIncrease.type ===
                                  "choice"
                                    ? `+${feat.benefits.abilityScoreIncrease.amount} to choice`
                                    : feat.benefits.abilityScoreIncrease
                                        .type === "spellcasting_ability"
                                    ? `+${feat.benefits.abilityScoreIncrease.amount} to spellcasting ability`
                                    : `+${feat.benefits.abilityScoreIncrease.amount} ${feat.benefits.abilityScoreIncrease.ability}`}
                                </div>
                              )}
                              {feat.benefits.skillProficiencies?.length > 0 && (
                                <div
                                  style={{
                                    color: "#3b82f6",
                                    marginBottom: "2px",
                                  }}
                                >
                                  • Skills:{" "}
                                  {feat.benefits.skillProficiencies.length}{" "}
                                  proficienc
                                  {feat.benefits.skillProficiencies.length > 1
                                    ? "ies"
                                    : "y"}
                                </div>
                              )}
                              {feat.benefits.expertise?.length > 0 && (
                                <div
                                  style={{
                                    color: "#8b5cf6",
                                    marginBottom: "2px",
                                  }}
                                >
                                  • Expertise: {feat.benefits.expertise.length}{" "}
                                  skill
                                  {feat.benefits.expertise.length > 1
                                    ? "s"
                                    : ""}
                                </div>
                              )}
                              {feat.benefits.resistances?.length > 0 && (
                                <div
                                  style={{
                                    color: "#f59e0b",
                                    marginBottom: "2px",
                                  }}
                                >
                                  • Resistances:{" "}
                                  {feat.benefits.resistances.join(", ")}
                                </div>
                              )}
                              {feat.benefits.immunities?.length > 0 && (
                                <div
                                  style={{
                                    color: "#ef4444",
                                    marginBottom: "2px",
                                  }}
                                >
                                  • Immunities:{" "}
                                  {feat.benefits.immunities.join(", ")}
                                </div>
                              )}
                              {Object.keys(feat.benefits.combatBonuses || {})
                                .length > 0 && (
                                <div
                                  style={{
                                    color: "#dc2626",
                                    marginBottom: "2px",
                                  }}
                                >
                                  • Combat:{" "}
                                  {
                                    Object.keys(feat.benefits.combatBonuses)
                                      .length
                                  }{" "}
                                  bonus
                                  {Object.keys(feat.benefits.combatBonuses)
                                    .length > 1
                                    ? "es"
                                    : ""}
                                </div>
                              )}
                              {feat.benefits.specialAbilities?.length > 0 && (
                                <div
                                  style={{
                                    color: "#6366f1",
                                    marginBottom: "2px",
                                  }}
                                >
                                  • Special:{" "}
                                  {feat.benefits.specialAbilities.length} abilit
                                  {feat.benefits.specialAbilities.length > 1
                                    ? "ies"
                                    : "y"}
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
                              backgroundColor: "rgba(239, 68, 68, 0.1)",
                              borderRadius: "4px",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                            }}
                          >
                            <strong style={{ color: "#ef4444" }}>
                              Prerequisites:
                            </strong>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#ef4444",
                                marginTop: "4px",
                              }}
                            >
                              {feat.prerequisites.anyOf && "Any of: "}
                              {feat.prerequisites.allOf && "All of: "}
                              {(
                                feat.prerequisites.anyOf ||
                                feat.prerequisites.allOf ||
                                []
                              ).map((req, index) => (
                                <div key={index}>
                                  • {req.type}: {req.value}{" "}
                                  {req.amount && `(${req.amount}+)`}
                                </div>
                              ))}
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
        )}

        {selectedFeats.length < maxFeats && (
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                padding: "8px 12px",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderRadius: "6px",
                border: "1px solid rgba(59, 130, 246, 0.3)",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#3b82f6",
                }}
              >
                Choose Feats
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#3b82f6",
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  padding: "2px 8px",
                  borderRadius: "12px",
                }}
              >
                {availableFeats.length} available
                {allSelectedFeats.length > selectedFeats.length && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: theme.textSecondary,
                      marginLeft: "8px",
                    }}
                  >
                    ({allSelectedFeats.length - selectedFeats.length} selected
                    elsewhere)
                  </span>
                )}
              </span>
            </div>

            <div style={enhancedStyles.featFilterContainer}>
              <input
                type="text"
                placeholder="Search feats by name, description, or benefits..."
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
                  Showing {availableFeats.length} feats
                </div>
              )}
            </div>

            <div style={enhancedStyles.featsContainer}>
              {availableFeats.length === 0 ? (
                <div style={enhancedStyles.noFeatsFound}>
                  {featFilter.trim()
                    ? `No feats found matching "${featFilter}". Try a different search term.`
                    : "No feats available. All feats have been selected from other sources."}
                </div>
              ) : (
                availableFeats.map((feat) => {
                  const isExpanded = expandedFeats.has(feat.name);
                  const hasBenefits =
                    feat.benefits &&
                    (feat.benefits.abilityScoreIncrease ||
                      feat.benefits.skillProficiencies?.length > 0 ||
                      feat.benefits.expertise?.length > 0 ||
                      feat.benefits.resistances?.length > 0 ||
                      feat.benefits.immunities?.length > 0 ||
                      Object.keys(feat.benefits.speeds || {}).length > 0 ||
                      Object.keys(feat.benefits.combatBonuses || {}).length >
                        0 ||
                      Object.keys(feat.benefits.spellcasting || {}).length >
                        0 ||
                      feat.benefits.specialAbilities?.length > 0);

                  return (
                    <div key={feat.name} style={enhancedStyles.featCard}>
                      <div style={enhancedStyles.featHeader}>
                        <label style={enhancedStyles.featLabelClickable}>
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => handleFeatToggle(feat.name)}
                            style={enhancedStyles.customCheckbox}
                          />
                          <span style={enhancedStyles.featName}>
                            {feat.name}
                            {hasBenefits && (
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "#10b981",
                                  marginLeft: "4px",
                                }}
                              >
                                (+BENEFITS)
                              </span>
                            )}
                          </span>
                        </label>
                        <button
                          onClick={() => toggleFeatExpansion(feat.name)}
                          style={enhancedStyles.expandButton}
                          type="button"
                        >
                          {isExpanded ? "▲" : "▼"}
                        </button>
                      </div>

                      <div style={enhancedStyles.featPreview}>
                        {feat.preview}
                      </div>

                      {isExpanded && (
                        <div style={enhancedStyles.featDescription}>
                          <ul
                            style={{
                              margin: "0 0 12px 0",
                              paddingLeft: "16px",
                            }}
                          >
                            {feat.description.map((description, index) => (
                              <li
                                key={index}
                                style={{
                                  marginBottom: "3px",
                                  fontSize: "13px",
                                }}
                              >
                                {description}
                              </li>
                            ))}
                          </ul>

                          {hasBenefits && (
                            <div
                              style={{
                                marginTop: "8px",
                                padding: "6px",
                                backgroundColor: "rgba(16, 185, 129, 0.1)",
                                borderRadius: "4px",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                              }}
                            >
                              <strong
                                style={{ color: "#10b981", fontSize: "11px" }}
                              >
                                Benefits:
                              </strong>
                              <div
                                style={{
                                  margin: "3px 0 0 0",
                                  fontSize: "11px",
                                }}
                              >
                                {feat.benefits.abilityScoreIncrease && (
                                  <div>• Ability score increase</div>
                                )}
                                {feat.benefits.skillProficiencies?.length >
                                  0 && (
                                  <div>
                                    • {feat.benefits.skillProficiencies.length}{" "}
                                    skill proficiencies
                                  </div>
                                )}
                                {feat.benefits.expertise?.length > 0 && (
                                  <div>• Expertise bonuses</div>
                                )}
                                {feat.benefits.resistances?.length > 0 && (
                                  <div>• Damage resistances</div>
                                )}
                                {feat.benefits.immunities?.length > 0 && (
                                  <div>• Damage immunities</div>
                                )}
                                {Object.keys(feat.benefits.combatBonuses || {})
                                  .length > 0 && <div>• Combat bonuses</div>}
                                {feat.benefits.specialAbilities?.length > 0 && (
                                  <div>• Special abilities</div>
                                )}
                              </div>
                            </div>
                          )}

                          {feat.prerequisites && (
                            <div
                              style={{
                                marginTop: "8px",
                                padding: "6px",
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                                borderRadius: "4px",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                              }}
                            >
                              <strong
                                style={{ color: "#ef4444", fontSize: "11px" }}
                              >
                                Prerequisites:
                              </strong>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#ef4444",
                                  marginTop: "3px",
                                }}
                              >
                                {(
                                  feat.prerequisites.anyOf ||
                                  feat.prerequisites.allOf ||
                                  []
                                ).map((req, index) => (
                                  <div key={index}>
                                    • {req.type}: {req.value}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {selectedFeats.length === maxFeats && (
          <div style={enhancedStyles.completionMessage}>
            ✓ Feat selection complete! You've selected {selectedFeats.length} of{" "}
            {maxFeats} feat
            {maxFeats > 1 ? "s" : ""}. Uncheck any feat to see all feats again.
          </div>
        )}

        <div style={enhancedStyles.helpText}>
          Note: You can select {maxFeats} feat{maxFeats > 1 ? "s" : ""} total
          {isLevel1Choice
            ? " for a Level 1 character."
            : ` for your character level (${characterLevel}).`}
          {selectedFeats.length > 0 &&
            " All mechanical benefits from selected feats are shown above and automatically applied."}
        </div>
      </div>
    </div>
  );
};

export default EnhancedFeatureSelectorEdit;
