const SkillProgressionInfo = ({ theme, styles, hasMultiSourceSkills }) => {
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

    // Fixed logic: Skills already granted by other sources should NOT count toward casting style selection
    const selectedCastingStyleSkills = allSkills.filter((skill) => {
      // Must be an available casting style skill
      if (!castingStyleSkills.includes(skill)) return false;

      // If skill is already granted by background, heritage, or subclass,
      // it should NOT count toward casting style selection limit
      if (
        backgroundSkills.includes(skill) ||
        innateHeritageSkills.includes(skill) ||
        subclassSkills.includes(skill)
      ) {
        return false; // Don't count these toward casting style selection
      }

      // Only count truly new skills that aren't granted elsewhere
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

  // Calculate this AFTER getSkillsBySource() so all variables are available
  const hasMultiSourceSkills =
    studyBuddySkills.some(
      (skill) =>
        backgroundSkills.includes(skill) || innateHeritageSkills.includes(skill)
    ) || hasExpertiseGranter.length > 0;

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
          <SkillProgressionInfo
            theme={theme}
            styles={styles}
            hasMultiSourceSkills={hasMultiSourceSkills}
          />

          {/* Innate Heritage Skills Section */}
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
                      // eslint-disable-next-line
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

          {/* Background Skills Section */}
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

          {/* Subclass Skills Section */}
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
                      // eslint-disable-next-line
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

          {/* Subclass Expertise Skills Section */}
          {expertiseSkills.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <h4
                style={{
                  ...styles.skillsSubheader,
                  color: "#ffd700",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                ⭐ Subclass Expertise Skills (Maximum Level)
              </h4>
              <div style={styles.skillsGrid}>
                {expertiseSkills.map((skill) => (
                  <div
                    key={`expertise-${skill}`}
                    style={{
                      ...styles.skillOptionBase,
                      backgroundColor: "#ffd70040",
                      border: `2px solid #ffd700`,
                      cursor: "default",
                      opacity: 1,
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#ffd700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "8px",
                      }}
                    >
                      <span
                        style={{
                          color: "#000",
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
                        color: "#b8860b",
                        fontWeight: "bold",
                      }}
                    >
                      {skill}
                      <span
                        style={{
                          marginLeft: "4px",
                          fontSize: "12px",
                          color: "#ffd700",
                        }}
                      >
                        ★★ (Expertise - Max Level)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#b8860b",
                  fontStyle: "italic",
                  marginTop: "4px",
                }}
              >
                These skills achieved expertise because you selected them from
                your subclass but already had proficiency from another source.{" "}
                <strong>Maximum proficiency achieved!</strong>
              </div>
            </div>
          )}

          {/* Casting Style Skills Section */}
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
                const isFromExpertise = expertiseSkills.includes(skill);
                const canSelect = isSelected || castingStyleSkills.length < 2;

                // If skill is already at expertise level, don't show it as selectable
                if (isFromExpertise) {
                  return (
                    <div
                      key={`cs-expertise-${skill}`}
                      style={{
                        ...styles.skillOptionBase,
                        backgroundColor: "#ffd70020",
                        border: `2px dashed #ffd700`,
                        cursor: "default",
                        opacity: 0.7,
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          backgroundColor: "#ffd700",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "8px",
                        }}
                      >
                        <span
                          style={{
                            color: "#000",
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
                          color: "#b8860b",
                          fontWeight: "600",
                        }}
                      >
                        {skill} ★★ (Already at Max Level)
                      </span>
                    </div>
                  );
                }

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

                  return (
                    <div
                      key={`cs-${skill}`}
                      style={{
                        ...styles.skillOptionBase,
                        backgroundColor: `${sourceColor}20`,
                        border: `2px dashed ${theme.border}`,
                        cursor: "default",
                        opacity: 0.6,
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
                          fontWeight: "600",
                        }}
                      >
                        {skill}
                      </span>
                      <div
                        style={{
                          fontSize: "10px",
                          color: theme.textSecondary,
                          marginTop: "2px",
                        }}
                      >
                        From {sourceName}
                      </div>
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

          {/* Expertise Summary */}
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

          {/* Summary */}
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
