const EnhancedSkillsSection = ({
  character,
  handleSkillToggle,
  getAvailableSkills,
  styles,
  theme,
}) => {
  // Helper function to check if skill has expertise
  const hasExpertise = (skill) => {
    const expertiseSkills =
      character.skill_expertise || character.skillExpertise || [];
    return expertiseSkills.includes(skill);
  };

  // Helper function to check if skill has proficiency (any level)
  const hasProficiency = (skill) => {
    const skillProficiencies =
      character.skillProficiencies || character.skill_proficiencies || [];
    return skillProficiencies.includes(skill);
  };
  // Extract subclass skills and track expertise patterns
  const getSubclassSkills = () => {
    const subclassSkills = [];
    const expertiseSkills = []; // Skills that grant expertise (due to already having proficiency)
    const studyBuddySkills = []; // All skills selected via Study Buddy (always expertise-eligible)
    const hasExpertiseGranter = []; // Features that can grant expertise to ANY existing skill
    const subclassChoices = character.subclassChoices || {};

    // Get skills from other sources
    const backgroundSkills = character.backgroundSkills || [];
    const innateHeritageSkills = character.innateHeritageSkills || [];

    Object.values(subclassChoices).forEach((choice) => {
      if (typeof choice === "object" && choice.mainChoice && choice.subChoice) {
        // Handle nested choices like Study Buddy
        if (choice.mainChoice === "Study Buddy") {
          const selectedSkill = choice.subChoice;
          studyBuddySkills.push(selectedSkill); // Always track Study Buddy skills as expertise-eligible

          // Check if character already has this skill from background or heritage
          const hasFromOtherSource =
            backgroundSkills.includes(selectedSkill) ||
            innateHeritageSkills.includes(selectedSkill);

          if (hasFromOtherSource) {
            // Already have proficiency → Study Buddy grants expertise
            expertiseSkills.push(selectedSkill);
          } else {
            // Don't have proficiency → Study Buddy grants proficiency
            subclassSkills.push(selectedSkill);
          }
        }
      } else if (typeof choice === "string") {
        // Handle direct choices
        if (choice === "Practice Makes Perfect") {
          hasExpertiseGranter.push("Practice Makes Perfect"); // Can grant expertise to any existing skill
        }

        // Handle direct skill selections that might be from subclass
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
    // Use existing structure
    const allSkills =
      character.skillProficiencies || character.skill_proficiencies || [];
    const castingStyleSkills = getAvailableSkills({ character }) || [];
    const backgroundSkills = character.backgroundSkills || [];
    const innateHeritageSkills = character.innateHeritageSkills || [];
    const {
      subclassSkills,
      expertiseSkills,
      studyBuddySkills,
      hasExpertiseGranter,
    } = getSubclassSkills();

    // Casting style skills: available to casting style AND either no conflicts OR expertise-eligible
    const selectedCastingStyleSkills = allSkills.filter((skill) => {
      // Must be available to this casting style
      if (!castingStyleSkills.includes(skill)) return false;

      // If skill is from background/heritage/subclass, only include if it's expertise-eligible
      if (
        backgroundSkills.includes(skill) ||
        innateHeritageSkills.includes(skill) ||
        subclassSkills.includes(skill)
      ) {
        // Allow Study Buddy skills to be selected for expertise
        if (studyBuddySkills.includes(skill)) return true;

        // Allow Practice Makes Perfect to work on any existing skill
        if (hasExpertiseGranter.length > 0) return true;

        // Otherwise exclude (no expertise possible)
        return false;
      }

      // Regular casting style skills (no conflicts)
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
      expertiseSkills: expertiseSkills, // Skills that grant expertise from subclass
      studyBuddySkills: studyBuddySkills, // All Study Buddy skills (expertise-eligible)
      hasExpertiseGranter: hasExpertiseGranter,
      totalSelected: allSkills.length,
    };
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
  const availableCastingSkills = getAvailableSkills({ character });

  // Function to check if a skill should grant expertise
  const shouldGrantExpertise = (skill) => {
    // Check if already has expertise in database
    return hasExpertise(skill);
  };

  // Function to check if a skill can be selected for expertise
  const canSelectForExpertise = (skill) => {
    // First, check if character has proficiency in this skill from ANY source
    if (!hasProficiency(skill)) {
      return false; // Can't have expertise without proficiency first
    }

    // Study Buddy pattern: any Study Buddy skill can be selected for expertise (if they have proficiency)
    if (studyBuddySkills.includes(skill)) {
      return true;
    }

    // Practice Makes Perfect pattern: can grant expertise to any pre-existing skill
    if (hasExpertiseGranter.length > 0) {
      return true; // Already checked they have proficiency above
    }

    return false;
  };

  return (
    <div style={styles.fieldContainer}>
      <h3 style={styles.skillsHeader}>
        Skill Proficiencies ({totalSelected} total)
      </h3>

      {!character.castingStyle ? (
        <div style={styles.skillsPlaceholder}>
          Please select a Casting Style first to see available skills.
        </div>
      ) : (
        <div style={styles.skillsContainer}>
          {innateHeritageSkills.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <h4
                style={{
                  ...styles.skillsSubheader,
                  color: "#8b5cf6",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                ✨ Innate Heritage Skills (Automatic)
              </h4>
              <div style={styles.skillsGrid}>
                {innateHeritageSkills.map((skill) => (
                  <div
                    key={`heritage-${skill}`}
                    style={{
                      ...styles.skillOptionBase,
                      backgroundColor: "#8b5cf6" + "20",
                      border: `2px solid #8b5cf6`,
                      cursor: "default",
                      opacity: 0.9,
                      width: "49%",
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
                        <span style={{ marginLeft: "4px", fontSize: "10px" }}>
                          ★
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  fontStyle: "italic",
                  marginTop: "4px",
                }}
              >
                These skills are automatically granted by your innate heritage.
              </div>
            </div>
          )}

          {backgroundSkills.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <h4
                style={{
                  ...styles.skillsSubheader,
                  color: theme.warning,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                📚 Background Skills (Automatic)
              </h4>
              <div style={styles.skillsGrid}>
                {backgroundSkills.map((skill) => (
                  <div
                    key={`bg-${skill}`}
                    style={{
                      ...styles.skillOptionBase,
                      backgroundColor: theme.warning + "20",
                      border: `2px solid ${theme.warning}`,
                      cursor: "default",
                      opacity: 0.9,
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: theme.warning,
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
                        color: theme.warning,
                        fontWeight: "600",
                      }}
                    >
                      {skill}
                      {hasExpertise(skill) && (
                        <span style={{ marginLeft: "4px", fontSize: "10px" }}>
                          ★
                        </span>
                      )}
                    </span>
                  </div>
                ))}
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
                  ...styles.skillsSubheader,
                  color: "#06b6d4",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                🎓 Subclass Skills (Selected)
              </h4>
              <div style={styles.skillsGrid}>
                {subclassSkills.map((skill) => (
                  <div
                    key={`subclass-${skill}`}
                    style={{
                      ...styles.skillOptionBase,
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
                        <span style={{ marginLeft: "4px", fontSize: "10px" }}>
                          ★
                        </span>
                      )}
                    </span>
                  </div>
                ))}
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
                  ...styles.skillsSubheader,
                  color: "#f59e0b",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                ⭐ Subclass Expertise (Selected)
              </h4>
              <div style={styles.skillsGrid}>
                {expertiseSkills.map((skill) => (
                  <div
                    key={`expertise-${skill}`}
                    style={{
                      ...styles.skillOptionBase,
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
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#f59e0b",
                        fontWeight: "600",
                      }}
                    >
                      {skill} ★
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  fontStyle: "italic",
                  marginTop: "4px",
                }}
              >
                These skills grant expertise because you selected them from your
                subclass but already had proficiency.
              </div>
            </div>
          )}

          <div>
            <h4 style={styles.skillsSubheader}>
              {character.castingStyle} Skills ({castingStyleSkills.length}/2
              selected) *
            </h4>
            <div style={styles.skillsGrid}>
              {availableCastingSkills.map((skill) => {
                const isSelected = castingStyleSkills.includes(skill);
                const isFromBackground = backgroundSkills.includes(skill);
                const isFromHeritage = innateHeritageSkills.includes(skill);
                const isFromSubclass = subclassSkills.includes(skill);
                const canSelect = isSelected || castingStyleSkills.length < 2;

                // Check if this skill is from another source
                if (isFromBackground || isFromHeritage || isFromSubclass) {
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

                  // Check if this skill can be selected for expertise
                  const canGetExpertise = canSelectForExpertise(skill);

                  if (!canGetExpertise) {
                    // Skill doesn't allow expertise - cross out and disable
                    return (
                      <div
                        key={`cs-${skill}`}
                        style={{
                          ...styles.skillOptionBase,
                          backgroundColor: theme.surface,
                          border: `2px dashed ${theme.border}`,
                          cursor: "not-allowed",
                          opacity: 0.5,
                        }}
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
                        <span
                          style={{
                            fontSize: "14px",
                            color: theme.textSecondary,
                            textDecoration: "line-through",
                          }}
                        >
                          {skill}
                        </span>
                      </div>
                    );
                  }

                  // Skill allows expertise - make it selectable
                  return (
                    <label
                      key={`cs-${skill}`}
                      style={{
                        ...styles.skillOptionBase,
                        cursor: canSelect ? "pointer" : "not-allowed",
                        backgroundColor: isSelected
                          ? `${sourceColor}30`
                          : `${sourceColor}10`,
                        border: `2px solid ${sourceColor}`,
                        opacity: canSelect ? 1 : 0.7,
                      }}
                      title={`This skill is already granted by your ${sourceName}. ${
                        studyBuddySkills.includes(skill)
                          ? "Selecting it here will grant expertise instead (Study Buddy allows expertise)."
                          : canSelectForExpertise(skill)
                          ? hasExpertiseGranter.length > 0
                            ? `Selecting it here will grant expertise instead (${hasExpertiseGranter.join(
                                ", "
                              )} rule).`
                            : "Selecting it here will grant expertise instead."
                          : "This skill cannot be selected for expertise."
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (canSelect) {
                            handleSkillToggle(skill);
                          }
                        }}
                        disabled={!canSelect}
                        style={styles.skillCheckbox}
                      />
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
                      <span
                        style={{
                          fontSize: "14px",
                          color: sourceColor,
                          fontWeight: isSelected ? "bold" : "600",
                        }}
                      >
                        {skill}
                        {hasExpertise(skill) && (
                          <span style={{ marginLeft: "4px", fontSize: "10px" }}>
                            ★
                          </span>
                        )}
                      </span>
                    </label>
                  );
                }

                return (
                  <label
                    key={`cs-${skill}`}
                    style={{
                      ...styles.skillOptionBase,
                      cursor: canSelect ? "pointer" : "not-allowed",
                      backgroundColor: isSelected
                        ? theme.success + "20"
                        : theme.surface,
                      border: isSelected
                        ? `2px solid ${theme.success}`
                        : `2px solid ${theme.border}`,
                      opacity: canSelect ? 1 : 0.5,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSkillToggle(skill)}
                      disabled={!canSelect}
                      style={styles.skillCheckbox}
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
              <div style={styles.skillsComplete}>
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
              padding: "8px",
              backgroundColor: theme.surface,
              borderRadius: "4px",
              fontSize: "12px",
              color: theme.textSecondary,
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
    </div>
  );
};

export default EnhancedSkillsSection;
