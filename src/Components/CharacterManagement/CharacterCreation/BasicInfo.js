import { gameSessionOptions } from "../../../App/const";
import { useTheme } from "../../../contexts/ThemeContext";
import { createCharacterCreationStyles } from "../../../styles/masterStyles";
import { RefreshCw } from "lucide-react";
import SchoolYearSelector from "../Shared/SchoolYearSelector";
import EnhancedCastingStyleSelector from "./EnhancedCastingStyleSelector";

function BasicInfo({
  character,
  isHpManualMode,
  setIsHpManualMode,
  rolledHp,
  setRolledHp,
  rollHp,
  handleInputChange,
  calculateHitPoints,
}) {
  const { theme } = useTheme();
  const styles = createCharacterCreationStyles(theme);

  const handleSchoolYearChange = (schoolYear) => {
    handleInputChange("schoolYear", schoolYear);
  };

  const handleLevelChange = (level) => {
    handleInputChange("level", level);
  };

  const handleCastingStyleChange = (castingStyle) => {
    handleInputChange("castingStyle", castingStyle);
  };

  return (
    <>
      <div style={styles.fieldContainer}>
        <label style={styles.label}>Character Name *</label>
        <input
          type="text"
          value={character.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter your character's name..."
          style={styles.input}
          maxLength={50}
        />
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Game Session</label>
        <select
          value={character.gameSession || ""}
          onChange={(e) => handleInputChange("gameSession", e.target.value)}
          style={styles.select}
        >
          <option value="">Select Game Session...</option>
          {gameSessionOptions.map((session) => (
            <option key={session} value={session}>
              {session}
            </option>
          ))}
        </select>
        <div style={styles.helpText}>
          Select which game session your character will join.
        </div>
      </div>

      {/* Add the School Year Selector */}
      <SchoolYearSelector
        schoolYear={character.schoolYear}
        onSchoolYearChange={handleSchoolYearChange}
        level={character.level}
        onLevelChange={handleLevelChange}
        styles={styles}
      />

      {/* Enhanced Casting Style Selector */}
      <div style={styles.fieldContainer}>
        <EnhancedCastingStyleSelector
          selectedStyle={character.castingStyle || ""}
          onStyleChange={handleCastingStyleChange}
          required={true}
        />
      </div>

      {character.castingStyle === "Intellect Caster" && (
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Initiative Ability *</label>
          <div style={styles.helpText}>
            As an intellect caster, you may choose to use Intelligence or
            Dexterity for initiative.
          </div>
          <div style={styles.level1ChoiceContainer}>
            <label
              style={
                character.initiativeAbility === "dexterity"
                  ? styles.level1ChoiceLabelSelected
                  : styles.level1ChoiceLabel
              }
            >
              <input
                type="radio"
                name="initiativeAbility"
                value="dexterity"
                checked={character.initiativeAbility === "dexterity"}
                onChange={(e) =>
                  handleInputChange("initiativeAbility", e.target.value)
                }
                style={styles.level1ChoiceRadio}
              />
              <span
                style={
                  character.initiativeAbility === "dexterity"
                    ? styles.level1ChoiceTextSelected
                    : styles.level1ChoiceText
                }
              >
                Dexterity
              </span>
            </label>
            <label
              style={
                character.initiativeAbility === "intelligence"
                  ? styles.level1ChoiceLabelSelected
                  : styles.level1ChoiceLabel
              }
            >
              <input
                type="radio"
                name="initiativeAbility"
                value="intelligence"
                checked={character.initiativeAbility === "intelligence"}
                onChange={(e) =>
                  handleInputChange("initiativeAbility", e.target.value)
                }
                style={styles.level1ChoiceRadio}
              />
              <span
                style={
                  character.initiativeAbility === "intelligence"
                    ? styles.level1ChoiceTextSelected
                    : styles.level1ChoiceText
                }
              >
                Intelligence
              </span>
            </label>
          </div>
        </div>
      )}

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Hit Points</label>
        {!character.castingStyle ? (
          <div style={styles.skillsPlaceholder}>
            Select a Casting Style first
          </div>
        ) : (
          <div style={styles.levelHpGrid}>
            <div style={styles.hpFieldContainer}>
              <div style={styles.hpValueContainer}>
                {isHpManualMode ? (
                  <input
                    type="number"
                    min="1"
                    value={character.hitPoints || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "hitPoints",
                        parseInt(e.target.value) || 1
                      )
                    }
                    placeholder="--"
                    style={styles.hpManualInput}
                  />
                ) : rolledHp !== null ? (
                  <div style={styles.hpRollDisplay}>{rolledHp}</div>
                ) : (
                  <div style={styles.hpDisplay}>
                    {calculateHitPoints({ character })}
                  </div>
                )}
              </div>
            </div>

            {character.castingStyle && (
              <div style={styles.hpControlsContainer}>
                <div style={styles.hpControlsInline}>
                  {!isHpManualMode && (
                    <button
                      onClick={rollHp}
                      style={{
                        ...styles.button,
                        backgroundColor: "#EF4444",
                        fontSize: "12px",
                      }}
                      disabled={!character.castingStyle || !character.level}
                    >
                      <RefreshCw size={14} />
                      Roll
                    </button>
                  )}

                  <div
                    onClick={() => {
                      setIsHpManualMode(!isHpManualMode);
                      setRolledHp(null);
                    }}
                    style={{
                      ...styles.hpToggle,
                      backgroundColor: isHpManualMode
                        ? theme.success
                        : theme.border,
                      borderColor: isHpManualMode
                        ? theme.success
                        : theme.textSecondary,
                    }}
                    title={
                      isHpManualMode
                        ? "Switch to Auto/Roll mode"
                        : "Switch to Manual mode"
                    }
                  >
                    <div
                      style={{
                        ...styles.hpToggleKnob,
                        left: isHpManualMode ? "22px" : "2px",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div style={styles.helpText}>
          {isHpManualMode
            ? "Manually enter your character's hit points."
            : rolledHp !== null
            ? "Click 'Roll' to reroll, or use the calculated value."
            : "Click 'Roll' for a random roll, or use the calculated average."}
        </div>
      </div>
    </>
  );
}

export default BasicInfo;
