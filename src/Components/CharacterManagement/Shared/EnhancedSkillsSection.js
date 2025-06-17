const EnhancedSkillsSection = ({
  character,
  handleSkillToggle,
  getAvailableSkills,
  styles,
  theme,
}) => {
  // Separate skills by source
  const getSkillsBySource = () => {
    const allSkills = character.skillProficiencies || [];
    const castingStyleSkills = getAvailableSkills();
    const backgroundSkills = character.backgroundSkills || []; // Assuming background adds this

    // Skills that come from casting style selection (intersection of selected and available)
    const selectedCastingStyleSkills = allSkills.filter(
      (skill) =>
        castingStyleSkills.includes(skill) && !backgroundSkills.includes(skill)
    );

    // Skills that come from background
    const selectedBackgroundSkills = allSkills.filter((skill) =>
      backgroundSkills.includes(skill)
    );

    return {
      castingStyleSkills: selectedCastingStyleSkills,
      backgroundSkills: selectedBackgroundSkills,
      totalSelected: allSkills.length,
    };
  };

  const { castingStyleSkills, backgroundSkills, totalSelected } =
    getSkillsBySource();
  const availableCastingSkills = getAvailableSkills();

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
                const canSelect = isSelected || castingStyleSkills.length < 2;

                // If skill is from background, show it as unavailable for casting style selection
                if (isFromBackground) {
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
                          backgroundColor: theme.textSecondary,
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
            {backgroundSkills.length > 0 && (
              <span>
                {" "}
                ({backgroundSkills.length} from background,{" "}
                {castingStyleSkills.length} from casting style)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSkillsSection;
