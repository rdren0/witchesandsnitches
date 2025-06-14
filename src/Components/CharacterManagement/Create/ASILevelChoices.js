import {
  AbilityScoreIncrements,
  ASIFeatSelector,
  FeatRequirementsInfo,
} from "./ASIComponents";

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
  styles,
}) => {
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
        const choice = character.asiChoices[level] || {};
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

            {/* Choice Type Selection */}
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
                  onChange={(e) => handleASIChoiceChange(level, "asi")}
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
                  onChange={(e) => handleASIChoiceChange(level, "feat")}
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

            {/* ASI Selection */}
            {choice.type === "asi" && (
              <div style={{ marginTop: "16px" }}>
                {(choice.abilityScoreIncreases || []).length === 2 ? (
                  <div style={styles.completionMessage}>
                    ✓ Ability Score Improvement selected!
                  </div>
                ) : (
                  <div style={styles.helpText}>
                    Select ability score increases below:
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
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: theme.text,
                      marginBottom: "8px",
                    }}
                  >
                    Select Ability Score Increases (+2 total, max +1 per
                    ability):
                  </div>

                  <AbilityScoreIncrements
                    level={level}
                    choice={choice}
                    character={character}
                    handleASIAbilityChange={handleASIAbilityChange}
                    theme={theme}
                    styles={styles}
                  />
                </div>
              </div>
            )}

            {/* Feat Selection */}
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
                  <ASIFeatSelector
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

            {/* Show selection status */}
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
