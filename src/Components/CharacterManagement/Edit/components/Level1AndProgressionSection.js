import { Lock, Unlock, Star } from "lucide-react";
import { InnateHeritage } from "../../CharacterCreation/InnateHeritage";
import EnhancedFeatureSelector from "./EnhancedFeatureSelectorEdit";
import StepIndicator from "../../Shared/StepIndicator";
import {
  AbilityScoreIncrements,
  ASIFeatSelector,
  FeatRequirementsInfo,
} from "../../Create/ASIComponents";

const Level1AndProgressionSection = ({
  character,
  handleInputChange,
  handleLevel1ChoiceChange,
  lockedFields,
  toggleFieldLock,
  expandedFeats,
  setExpandedFeats,
  featFilter,
  setFeatFilter,
  calculateMaxFeats,
  getAvailableASILevels,
  handleASIChoiceChange,
  handleASIFeatChange,
  handleASIAbilityChange,
  asiLevelFilters,
  setASILevelFilter,
  getFeatProgressionInfo,
  standardFeats,
  styles,
  theme,
  // ADD THESE MISSING PROPS:
  heritageChoices,
  onHeritageChoicesChange,
}) => {
  const featInfo = getFeatProgressionInfo();

  return (
    <>
      <StepIndicator
        step={3}
        totalSteps={5}
        label="Skills & Features & Backgrounds"
      />

      {/* Character Progression Summary */}
      {character.level > 1 && (
        <div style={styles.fieldContainer}>
          <div
            style={{
              ...styles.fieldContainer,
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <h4
              style={{
                ...styles.skillsSubheader,
                margin: "0 0 12px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Star size={16} color={theme.primary} />
              Character Progression Summary
            </h4>
            <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Level {character.level} Character Choices:</strong>
              </div>
              {featInfo.choices.map((choice, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "4px",
                    color:
                      choice.type === "feat"
                        ? theme.primary
                        : choice.type === "asi"
                        ? theme.success
                        : choice.type === "innate"
                        ? theme.warning
                        : theme.text,
                  }}
                >
                  ✓ Level {choice.level}: {choice.choice}
                </div>
              ))}
              {featInfo.nextASILevel && (
                <div
                  style={{ marginBottom: "4px", color: theme.textSecondary }}
                >
                  ○ Level {featInfo.nextASILevel}: Next ASI/Feat Choice
                </div>
              )}
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  marginTop: "8px",
                  fontStyle: "italic",
                }}
              >
                Total Feats Selected: {featInfo.totalFeatsSelected}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level 1 Choice Section */}
      <div style={styles.fieldContainer}>
        <div style={styles.lockedFieldHeader}>
          <h3 style={styles.skillsHeader}>
            Starting Choice (Level 1)
            {lockedFields.level1ChoiceType && (
              <span style={styles.lockedBadge}>
                <Lock size={12} />
                Locked
              </span>
            )}
          </h3>
          <button
            onClick={() => toggleFieldLock("level1ChoiceType")}
            style={{
              ...styles.lockButton,
              backgroundColor: lockedFields.level1ChoiceType
                ? "#ef4444"
                : "#10b981",
            }}
          >
            {lockedFields.level1ChoiceType ? (
              <Unlock size={14} />
            ) : (
              <Lock size={14} />
            )}
            {lockedFields.level1ChoiceType ? "Unlock" : "Lock"}
          </button>
        </div>
        {lockedFields.level1ChoiceType && (
          <div style={styles.lockedFieldInfo}>
            This field is locked to preserve character integrity. Changing your
            Level 1 choice may affect character balance.
          </div>
        )}
        <div style={styles.level1ChoiceContainer}>
          <label
            style={
              character.level1ChoiceType === "innate"
                ? styles.level1ChoiceLabelSelected
                : styles.level1ChoiceLabel
            }
          >
            <input
              type="radio"
              name="level1Choice"
              value="innate"
              checked={character.level1ChoiceType === "innate"}
              onChange={(e) => handleLevel1ChoiceChange(e.target.value)}
              style={styles.level1ChoiceRadio}
              disabled={lockedFields.level1ChoiceType}
            />
            <span
              style={
                character.level1ChoiceType === "innate"
                  ? styles.level1ChoiceTextSelected
                  : styles.level1ChoiceText
              }
            >
              Innate Heritage
            </span>
          </label>
          <label
            style={
              character.level1ChoiceType === "feat"
                ? styles.level1ChoiceLabelSelected
                : styles.level1ChoiceLabel
            }
          >
            <input
              type="radio"
              name="level1Choice"
              value="feat"
              checked={character.level1ChoiceType === "feat"}
              onChange={(e) => handleLevel1ChoiceChange(e.target.value)}
              style={styles.level1ChoiceRadio}
              disabled={lockedFields.level1ChoiceType}
            />
            <span
              style={
                character.level1ChoiceType === "feat"
                  ? styles.level1ChoiceTextSelected
                  : styles.level1ChoiceText
              }
            >
              Starting Standard Feat
            </span>
          </label>
        </div>
      </div>

      {/* Level 1 Choice Content */}
      {character.level1ChoiceType === "innate" && (
        <InnateHeritage
          character={character}
          handleInputChange={handleInputChange}
          isEditing={true}
          heritageChoices={heritageChoices}
          onHeritageChoicesChange={onHeritageChoicesChange}
        />
      )}

      {character.level1ChoiceType === "feat" && (
        <div style={styles.fieldContainer}>
          <FeatRequirementsInfo character={character} />
          <EnhancedFeatureSelector
            character={character}
            setCharacter={(updater) => {
              if (typeof updater === "function") {
                // Handle function updater
                const updated = updater(character);
                handleInputChange("standardFeats", updated.standardFeats || []);
              } else {
                // Handle direct object
                handleInputChange("standardFeats", updater.standardFeats || []);
              }
            }}
            expandedFeats={expandedFeats}
            setExpandedFeats={setExpandedFeats}
            featFilter={featFilter}
            setFeatFilter={setFeatFilter}
            maxFeats={calculateMaxFeats()}
            isLevel1Choice={false}
            characterLevel={character.level}
            standardFeats={standardFeats}
          />
        </div>
      )}

      {/* ASI/Feat Choices for levels 4, 8, 12, 16, 19 */}
      {getAvailableASILevels(character.level).map((level) => {
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
                  ⚠️ Editing Level {character.level} Character
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
                <div style={styles.completionMessage}>
                  ✓ Ability Score Improvement selected!
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

export default Level1AndProgressionSection;
