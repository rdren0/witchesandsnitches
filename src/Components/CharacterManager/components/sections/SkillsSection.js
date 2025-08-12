import React from "react";
import { Star } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBackgroundStyles } from "../../../../styles/masterStyles";

const skillsByCastingStyle = {
  "Willpower Caster": [
    "Athletics",
    "Acrobatics",
    "Deception",
    "Intimidation",
    "History of Magic",
    "Magical Creatures",
    "Persuasion",
    "Sleight of Hand",
    "Survival",
  ],
  "Technique Caster": [
    "Acrobatics",
    "Herbology",
    "Magical Theory",
    "Insight",
    "Perception",
    "Potion Making",
    "Sleight of Hand",
    "Stealth",
  ],
  "Intellect Caster": [
    "Acrobatics",
    "Herbology",
    "Magical Theory",
    "Insight",
    "Investigation",
    "Magical Creatures",
    "History of Magic",
    "Medicine",
    "Muggle Studies",
    "Survival",
  ],
  "Vigor Caster": [
    "Athletics",
    "Acrobatics",
    "Deception",
    "Stealth",
    "Magical Creatures",
    "Medicine",
    "Survival",
    "Intimidation",
    "Performance",
  ],
};

const allSkills = [
  "Acrobatics",
  "Animal Handling",
  "Arcana",
  "Athletics",
  "Deception",
  "History",
  "Insight",
  "Intimidation",
  "Investigation",
  "Medicine",
  "Nature",
  "Perception",
  "Persuasion",
  "Religion",
  "Sleight of Hand",
  "Stealth",
  "Survival",
];

const SkillProgressionInfo = ({ theme, hasMultiSourceSkills }) => {
  if (!hasMultiSourceSkills) return null;

  return (
    <div
      style={{
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        borderRadius: "6px",
        padding: "12px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: "600",
          color: "#2563eb",
          marginBottom: "6px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        ℹ️ Skill Progression System
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "#1d4ed8",
          lineHeight: "1.4",
          marginBottom: "8px",
        }}
      >
        <strong>How skills stack:</strong>
      </div>
      <ul
        style={{
          fontSize: "11px",
          color: "#1d4ed8",
          lineHeight: "1.4",
          margin: 0,
          paddingLeft: "16px",
        }}
      >
        <li>
          <strong>Proficient:</strong> You add your proficiency bonus to rolls
        </li>
        <li>
          <strong>Expertise (★★):</strong> You add double proficiency bonus
          (maximum level)
        </li>
        <li>
          <strong>Multiple Sources:</strong> If you get the same skill from
          background + subclass with expertise ability, you automatically gain
          expertise
        </li>
        <li>
          <strong>Casting Style Limit:</strong> Skills already granted by other
          sources don't count toward your 2 casting style skill selections
        </li>
      </ul>
    </div>
  );
};

const SkillsSection = ({
  character,
  onChange,
  onCharacterUpdate,
  disabled = false,
  mode = "create",
}) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);

  const getAvailableSkills = () => {
    return character.castingStyle
      ? skillsByCastingStyle[character.castingStyle] || []
      : allSkills;
  };

  const hasExpertise = (skill) => {
    const expertiseSkills =
      character.skill_expertise || character.skillExpertise || [];
    return expertiseSkills.includes(skill);
  };

  const hasProficiency = (skill) => {
    const skillProficiencies =
      character.skillProficiencies || character.skill_proficiencies || [];
    return skillProficiencies.includes(skill);
  };

  const getSubclassSkills = () => {
    const subclassSkills = [];
    const expertiseSkills = [];
    const studyBuddySkills = [];
    const hasExpertiseGranter = [];
    const subclassChoices = character.subclassChoices || {};

    const backgroundSkills = character.backgroundSkills || [];
    const innateHeritageSkills = character.innateHeritageSkills || [];

    Object.values(subclassChoices).forEach((choice) => {
      if (typeof choice === "object" && choice.mainChoice && choice.subChoice) {
        if (choice.mainChoice === "Study Buddy") {
          const selectedSkill = choice.subChoice;
          studyBuddySkills.push(selectedSkill);

          const hasFromOtherSource =
            backgroundSkills.includes(selectedSkill) ||
            innateHeritageSkills.includes(selectedSkill);

          if (hasFromOtherSource) {
            expertiseSkills.push(selectedSkill);
          } else {
            subclassSkills.push(selectedSkill);
          }
        }
      } else if (typeof choice === "string") {
        if (choice === "Practice Makes Perfect") {
          hasExpertiseGranter.push("Practice Makes Perfect");
        }

        const skillNames = [
          "Herbology",
          "History of Magic",
          "Investigation",
          "Magical Theory",
          "Muggle Studies",
        ];
        if (skillNames.includes(choice)) {
          subclassSkills.push(choice);
        }
      }
    });

    return {
      subclassSkills,
      expertiseSkills,
      studyBuddySkills,
      hasExpertiseGranter,
    };
  };

  const getSkillsBySource = () => {
    const allSkills =
      character.skillProficiencies || character.skill_proficiencies || [];
    const availableCastingSkills = getAvailableSkills() || [];
    const backgroundSkills = character.backgroundSkills || [];
    const innateHeritageSkills = character.innateHeritageSkills || [];
    const {
      subclassSkills,
      expertiseSkills,
      studyBuddySkills,
      hasExpertiseGranter,
    } = getSubclassSkills();

    const selectedCastingStyleSkills = allSkills.filter((skill) => {
      if (!availableCastingSkills.includes(skill)) return false;

      if (
        backgroundSkills.includes(skill) ||
        innateHeritageSkills.includes(skill) ||
        subclassSkills.includes(skill)
      ) {
        if (studyBuddySkills.includes(skill)) return true;
        if (hasExpertiseGranter.length > 0) return true;

        return false;
      }

      return true;
    });

    const selectedBackgroundSkills = allSkills.filter((skill) =>
      backgroundSkills.includes(skill)
    );

    const selectedInnaateHeritageSkills = allSkills.filter((skill) =>
      innateHeritageSkills.includes(skill)
    );

    return {
      castingStyleSkills: selectedCastingStyleSkills,
      backgroundSkills: selectedBackgroundSkills,
      innateHeritageSkills: selectedInnaateHeritageSkills,
      subclassSkills: subclassSkills,
      expertiseSkills: expertiseSkills,
      studyBuddySkills: studyBuddySkills,
      hasExpertiseGranter: hasExpertiseGranter,
      totalSelected: allSkills.length,
    };
  };

  const shouldGrantExpertise = (skill) => {
    return hasExpertise(skill);
  };

  const canSelectForExpertise = (skill) => {
    if (!hasProficiency(skill)) {
      return false;
    }

    if (studyBuddySkills.includes(skill)) {
      return true;
    }

    if (hasExpertiseGranter.length > 0) {
      return true;
    }

    return false;
  };

  const handleSkillToggle = (skill) => {
    const currentSkills =
      character.skillProficiencies || character.skill_proficiencies || [];
    const availableCastingSkills = getAvailableSkills();
    const backgroundSkills = character.backgroundSkills || [];
    const innateHeritageSkills = character.innateHeritageSkills || [];
    const { subclassSkills, castingStyleSkills } = getSkillsBySource();

    console.log("🔧 handleSkillToggle Debug:", {
      skill,
      currentSkills,
      availableCastingSkills,
      backgroundSkills,
      castingStyleSkills,
      castingStyleSkillsLength: castingStyleSkills.length,
    });

    const isAutomatic =
      backgroundSkills.includes(skill) ||
      innateHeritageSkills.includes(skill) ||
      subclassSkills.includes(skill);

    if (isAutomatic) {
      console.warn(
        `Cannot toggle ${skill} - it's automatically granted from background/heritage/subclass`
      );
      return;
    }

    if (currentSkills.includes(skill)) {
      const newSkills = currentSkills.filter((s) => s !== skill);
      onChange("skillProficiencies", newSkills);
    } else {
      const isFromCastingStyle = availableCastingSkills.includes(skill);

      if (isFromCastingStyle) {
        if (castingStyleSkills.length >= 2) {
          console.warn(
            `Cannot select ${skill} - already have 2 casting style skills:`,
            castingStyleSkills
          );
          return;
        }
      }

      const newSkills = [...currentSkills, skill];
      onChange("skillProficiencies", newSkills);
    }
  };

  const getSkillModifier = (skill) => {
    const abilityMap = {
      Acrobatics: "dexterity",
      "Animal Handling": "wisdom",
      Arcana: "intelligence",
      Athletics: "strength",
      Deception: "charisma",
      History: "intelligence",
      Insight: "wisdom",
      Intimidation: "charisma",
      Investigation: "intelligence",
      Medicine: "wisdom",
      Nature: "intelligence",
      Perception: "wisdom",
      Persuasion: "charisma",
      Religion: "intelligence",
      "Sleight of Hand": "dexterity",
      Stealth: "dexterity",
      Survival: "wisdom",
    };

    const ability = abilityMap[skill] || "intelligence";
    const abilityScore = character.ability_scores?.[ability] || 8;
    const abilityMod = Math.floor((abilityScore - 10) / 2);

    const allSkills =
      character.skillProficiencies || character.skill_proficiencies || [];
    const isProficient = allSkills.includes(skill);
    const hasSkillExpertise = hasExpertise(skill);

    const proficiencyBonus = 2;
    let totalMod = abilityMod;

    if (hasSkillExpertise) {
      totalMod += proficiencyBonus * 2;
    } else if (isProficient) {
      totalMod += proficiencyBonus;
    }

    return totalMod;
  };

  const {
    castingStyleSkills,
    backgroundSkills,
    innateHeritageSkills,
    subclassSkills,
    expertiseSkills,
    studyBuddySkills,
    hasExpertiseGranter,
    totalSelected,
  } = getSkillsBySource();

  const availableCastingSkills = getAvailableSkills();
  const hasMultiSourceSkills =
    studyBuddySkills.some(
      (skill) =>
        backgroundSkills.includes(skill) || innateHeritageSkills.includes(skill)
    ) || hasExpertiseGranter.length > 0;

  const enhancedStyles = {
    ...styles,
    skillsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "8px",
      marginBottom: "12px",
    },
    skillOptionBase: {
      display: "flex",
      alignItems: "center",
      padding: "8px 12px",
      borderRadius: "6px",
      transition: "all 0.2s ease",
      fontSize: "14px",
      minHeight: "40px",
    },
    skillCheckbox: {
      marginRight: "8px",
      accentColor: theme.primary,
    },
    skillsSubheader: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
      margin: "0 0 8px 0",
    },
    skillsComplete: {
      backgroundColor: `${theme.success}20`,
      border: `1px solid ${theme.success}`,
      borderRadius: "6px",
      padding: "8px 12px",
      color: theme.success,
      fontSize: "12px",
      fontWeight: "600",
      marginTop: "8px",
    },
    skillsPlaceholder: {
      backgroundColor: `${theme.warning}20`,
      border: `1px solid ${theme.warning}`,
      borderRadius: "8px",
      padding: "12px 16px",
      color: theme.warning,
      textAlign: "center",
      fontSize: "14px",
    },
  };

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
        <div style={styles.sectionHeader}>
          <h3 style={styles.skillsHeader}>
            Skill Proficiencies ({totalSelected} total)
          </h3>
        </div>

        {!character.castingStyle ? (
          <div style={enhancedStyles.skillsPlaceholder}>
            Please select a Casting Style first to see available skills.
          </div>
        ) : (
          <div>
            <SkillProgressionInfo
              theme={theme}
              hasMultiSourceSkills={hasMultiSourceSkills}
            />

            {innateHeritageSkills.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4
                  style={{
                    ...enhancedStyles.skillsSubheader,
                    color: "#8b5cf6",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  ✨ Innate Heritage Skills (Automatic)
                </h4>
                <div style={enhancedStyles.skillsGrid}>
                  {innateHeritageSkills.map((skill) => {
                    return (
                      <div
                        key={`heritage-${skill}`}
                        style={{
                          ...enhancedStyles.skillOptionBase,
                          backgroundColor: "#8b5cf6" + "20",
                          border: `2px solid #8b5cf6`,
                          cursor: "default",
                          opacity: 0.9,
                        }}
                      >
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: "#8b5cf6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "8px",
                          }}
                        >
                          <span
                            style={{
                              color: "white",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            H
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#8b5cf6",
                            fontWeight: "600",
                          }}
                        >
                          {skill}
                          {hasExpertise(skill) && (
                            <span
                              style={{ marginLeft: "4px", fontSize: "10px" }}
                            >
                              ★
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.textSecondary,
                    fontStyle: "italic",
                    marginTop: "4px",
                  }}
                >
                  These skills are automatically granted by your innate
                  heritage.
                </div>
              </div>
            )}

            {backgroundSkills.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4
                  style={{
                    ...enhancedStyles.skillsSubheader,
                    color: theme.warning || "#f59e0b",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  📚 Background Skills (Automatic)
                </h4>
                <div style={enhancedStyles.skillsGrid}>
                  {backgroundSkills.map((skill) => {
                    return (
                      <div
                        key={`bg-${skill}`}
                        style={{
                          ...enhancedStyles.skillOptionBase,
                          backgroundColor: (theme.warning || "#f59e0b") + "20",
                          border: `2px solid ${theme.warning || "#f59e0b"}`,
                          cursor: "default",
                          opacity: 0.9,
                        }}
                      >
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: theme.warning || "#f59e0b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "8px",
                          }}
                        >
                          <span
                            style={{
                              color: "white",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            B
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "14px",
                            color: theme.warning || "#f59e0b",
                            fontWeight: "600",
                          }}
                        >
                          {skill}
                          {hasExpertise(skill) && (
                            <span
                              style={{ marginLeft: "4px", fontSize: "10px" }}
                            >
                              ★
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.textSecondary,
                    fontStyle: "italic",
                    marginTop: "4px",
                  }}
                >
                  These skills are automatically granted by your background
                  choice.
                </div>
              </div>
            )}

            {subclassSkills.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4
                  style={{
                    ...enhancedStyles.skillsSubheader,
                    color: "#06b6d4",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  🎓 Subclass Skills (Selected)
                </h4>
                <div style={enhancedStyles.skillsGrid}>
                  {subclassSkills.map((skill) => {
                    return (
                      <div
                        key={`subclass-${skill}`}
                        style={{
                          ...enhancedStyles.skillOptionBase,
                          backgroundColor: "#06b6d4" + "20",
                          border: `2px solid #06b6d4`,
                          cursor: "default",
                          opacity: 0.9,
                        }}
                      >
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: "#06b6d4",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "8px",
                          }}
                        >
                          <span
                            style={{
                              color: "white",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            S
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#06b6d4",
                            fontWeight: "600",
                          }}
                        >
                          {skill}
                          {hasExpertise(skill) && (
                            <span
                              style={{ marginLeft: "4px", fontSize: "10px" }}
                            >
                              ★
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.textSecondary,
                    fontStyle: "italic",
                    marginTop: "4px",
                  }}
                >
                  These skills were selected from your subclass choices.
                </div>
              </div>
            )}

            {expertiseSkills.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4
                  style={{
                    ...enhancedStyles.skillsSubheader,
                    color: "#f59e0b",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  ⭐ Subclass Expertise (Selected)
                </h4>
                <div style={enhancedStyles.skillsGrid}>
                  {expertiseSkills.map((skill) => {
                    const modifier = getSkillModifier(skill);
                    const formattedMod =
                      modifier >= 0 ? `+${modifier}` : `${modifier}`;

                    return (
                      <div
                        key={`expertise-${skill}`}
                        style={{
                          ...enhancedStyles.skillOptionBase,
                          backgroundColor: "#f59e0b" + "20",
                          border: `2px solid #f59e0b`,
                          cursor: "default",
                          opacity: 0.9,
                        }}
                      >
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: "#f59e0b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "8px",
                          }}
                        >
                          <span
                            style={{
                              color: "white",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            ★
                          </span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#f59e0b",
                              fontWeight: "600",
                            }}
                          >
                            {skill} ★
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#f59e0b",
                              opacity: 0.8,
                            }}
                          >
                            {formattedMod}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.textSecondary,
                    fontStyle: "italic",
                    marginTop: "4px",
                  }}
                >
                  These skills grant expertise because you selected them from
                  your subclass but already had proficiency.
                </div>
              </div>
            )}

            <div>
              <h4 style={enhancedStyles.skillsSubheader}>
                {character.castingStyle} Skills ({castingStyleSkills.length}/2
                selected) *
              </h4>
              <div style={enhancedStyles.skillsGrid}>
                {availableCastingSkills.map((skill) => {
                  const isSelected = castingStyleSkills.includes(skill);
                  const isFromBackground = backgroundSkills.includes(skill);
                  const isFromHeritage = innateHeritageSkills.includes(skill);
                  const isFromSubclass = subclassSkills.includes(skill);
                  const isAutomatic =
                    isFromBackground || isFromHeritage || isFromSubclass;

                  const canSelect =
                    !isAutomatic &&
                    (isSelected || castingStyleSkills.length < 2);

                  if (
                    [
                      "Athletics",
                      "Acrobatics",
                      "Investigation",
                      "Insight",
                    ].includes(skill)
                  ) {
                    console.log(`🔧 ${skill} UI Debug:`, {
                      skill,
                      isSelected,
                      isFromBackground,
                      isFromHeritage,
                      isFromSubclass,
                      isAutomatic,
                      canSelect,
                      castingStyleSkillsLength: castingStyleSkills.length,
                      disabled,
                    });
                  }

                  if (isAutomatic) {
                    let sourceLabel, sourceColor, sourceName;

                    if (isFromBackground) {
                      sourceLabel = "B";
                      sourceColor = "#f59e0b";
                      sourceName = "background";
                    } else if (isFromHeritage) {
                      sourceLabel = "H";
                      sourceColor = "#8b5cf6";
                      sourceName = "heritage";
                    } else if (isFromSubclass) {
                      sourceLabel = "S";
                      sourceColor = "#06b6d4";
                      sourceName = "subclass";
                    }

                    return (
                      <div
                        key={`cs-${skill}`}
                        style={{
                          ...enhancedStyles.skillOptionBase,
                          backgroundColor: theme.surface,
                          border: `2px dashed ${theme.border}`,
                          cursor: "not-allowed",
                          opacity: 0.6,
                        }}
                        title={`This skill is already granted by your ${sourceName}`}
                      >
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: sourceColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "8px",
                          }}
                        >
                          <span
                            style={{
                              color: "white",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            {sourceLabel}
                          </span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "14px",
                              color: theme.textSecondary,
                              fontWeight: "600",
                            }}
                          >
                            {skill}
                            {hasExpertise(skill) && (
                              <span
                                style={{ marginLeft: "4px", fontSize: "10px" }}
                              >
                                ★
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: theme.textSecondary,
                            }}
                          >
                            From {sourceName}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <label
                      key={`cs-${skill}`}
                      style={{
                        ...enhancedStyles.skillOptionBase,
                        cursor:
                          canSelect && !disabled ? "pointer" : "not-allowed",
                        backgroundColor: isSelected
                          ? `${theme.success}20`
                          : theme.surface,
                        border: isSelected
                          ? `2px solid ${theme.success}`
                          : `2px solid ${theme.border}`,
                        opacity: canSelect && !disabled ? 1 : 0.5,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSkillToggle(skill)}
                        disabled={disabled || !canSelect}
                        style={enhancedStyles.skillCheckbox}
                      />
                      <span
                        style={{
                          fontSize: "14px",
                          color: isSelected ? theme.success : theme.text,
                          fontWeight: isSelected ? "bold" : "normal",
                        }}
                      >
                        {skill}
                      </span>
                    </label>
                  );
                })}
              </div>

              {castingStyleSkills.length === 2 && (
                <div style={enhancedStyles.skillsComplete}>
                  ✓ Casting style skill selection complete! You've chosen your 2
                  skills.
                </div>
              )}
            </div>

            {(character.skill_expertise || character.skillExpertise || [])
              .length > 0 && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px",
                  backgroundColor: `${theme.primary}10`,
                  border: `1px solid ${theme.primary}`,
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: theme.primary,
                }}
              >
                <strong>★ Expertise Granted:</strong> Skills marked with ★ grant
                expertise.
                {expertiseSkills.length > 0 && (
                  <div style={{ marginTop: "4px", fontStyle: "italic" }}>
                    Subclass choices automatically granted expertise for
                    pre-existing skills.
                  </div>
                )}
                {hasExpertiseGranter.length > 0 && (
                  <div style={{ marginTop: "4px", fontStyle: "italic" }}>
                    {hasExpertiseGranter.join(", ")} allows expertise for any
                    pre-existing skill.
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                backgroundColor: theme.surface,
                borderRadius: "4px",
                fontSize: "12px",
                color: theme.textSecondary,
                border: `1px solid ${theme.border}`,
              }}
            >
              <strong>Total Skills:</strong> {totalSelected}
              {(backgroundSkills.length > 0 ||
                subclassSkills.length > 0 ||
                expertiseSkills.length > 0) && (
                <span>
                  {" "}
                  (
                  {backgroundSkills.length > 0 &&
                    `${backgroundSkills.length} from background`}
                  {backgroundSkills.length > 0 &&
                    (subclassSkills.length > 0 || expertiseSkills.length > 0) &&
                    ", "}
                  {subclassSkills.length > 0 &&
                    `${subclassSkills.length} from subclass`}
                  {subclassSkills.length > 0 &&
                    expertiseSkills.length > 0 &&
                    ", "}
                  {expertiseSkills.length > 0 &&
                    `${expertiseSkills.length} expertise from subclass`}
                  {(backgroundSkills.length > 0 ||
                    subclassSkills.length > 0 ||
                    expertiseSkills.length > 0) &&
                    ", "}
                  {castingStyleSkills.length} from casting style
                  {innateHeritageSkills.length > 0 &&
                    `, ${innateHeritageSkills.length} from heritage`}
                  )
                </span>
              )}
              {(character.skill_expertise || character.skillExpertise || [])
                .length > 0 && (
                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "11px",
                    fontStyle: "italic",
                  }}
                >
                  <strong>Expertise:</strong>{" "}
                  {(
                    character.skill_expertise ||
                    character.skillExpertise ||
                    []
                  ).join(", ")}
                </div>
              )}
            </div>
          </div>
        )}

        <div style={styles.helpText}>
          {character.castingStyle
            ? `Select 2 skills from your ${character.castingStyle} casting style. Skills from other sources (background, heritage, subclass) are automatically added.`
            : "Choose a casting style to unlock skill selection options."}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
