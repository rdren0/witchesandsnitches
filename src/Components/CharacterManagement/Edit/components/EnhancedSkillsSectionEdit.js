const EnhancedSkillsSection = ({
  character,
  handleSkillToggle,
  getAvailableSkills,
  styles,
  theme,
}) => {
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
    const castingStyleSkills = getAvailableSkills({ character }) || [];
    const backgroundSkills = character.backgroundSkills || [];
    const innateHeritageSkills = character.innateHeritageSkills || [];
    const {
      subclassSkills,
      expertiseSkills,
      studyBuddySkills,
      hasExpertiseGranter,
    } = getSubclassSkills();

    const selectedCastingStyleSkills = allSkills.filter((skill) => {
      if (!castingStyleSkills.includes(skill)) return false;

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

                  const canGetExpertise = canSelectForExpertise(skill);

                  if (!canGetExpertise) {
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
