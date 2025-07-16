import { gameSessionOptions } from "../../../App/const";
import { useTheme } from "../../../contexts/ThemeContext";
import { createCharacterCreationStyles } from "../../../styles/masterStyles";
import { castingStyles } from "../../../SharedData/data";
import { RefreshCw } from "lucide-react";
import SchoolYearSelector from "../Shared/SchoolYearSelector";

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

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Casting Style *</label>
        <select
          value={character.castingStyle || ""}
          onChange={(e) => handleInputChange("castingStyle", e.target.value)}
          style={styles.select}
        >
          <option value="">Select Casting Style...</option>
          {castingStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
        <div style={styles.helpText}>
          Your casting style determines your available skills and hit points.
        </div>
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
        <div style={styles.hpContainer}>
          <div style={styles.hpModeSelector}>
            <label style={styles.hpModeLabel}>
              <input
                type="radio"
                name="hpMode"
                checked={!isHpManualMode}
                onChange={() => setIsHpManualMode(false)}
                style={styles.hpModeRadio}
              />
              Calculated ({calculateHitPoints({ character })})
            </label>
            <label style={styles.hpModeLabel}>
              <input
                type="radio"
                name="hpMode"
                checked={isHpManualMode}
                onChange={() => setIsHpManualMode(true)}
                style={styles.hpModeRadio}
              />
              Manual Entry
            </label>
          </div>

          {!isHpManualMode ? (
            <div style={styles.hpCalculated}>
              <div style={styles.hpRollContainer}>
                <button
                  type="button"
                  onClick={rollHp}
                  style={styles.rollButton}
                  disabled={!character.castingStyle || !character.level}
                >
                  <RefreshCw size={16} />
                  Roll HP
                </button>
                {rolledHp !== null && (
                  <span style={styles.rolledHpValue}>
                    Rolled: {rolledHp} HP
                  </span>
                )}
              </div>
              <div style={styles.helpText}>
                HP is calculated based on your casting style, level, and
                constitution.
                {rolledHp !== null
                  ? " Click 'Roll HP' to reroll, or use the calculated value."
                  : " Click 'Roll HP' for a random roll, or use the calculated average."}
              </div>
            </div>
          ) : (
            <div style={styles.hpManual}>
              <input
                type="number"
                value={character.hitPoints || ""}
                onChange={(e) =>
                  handleInputChange("hitPoints", parseInt(e.target.value))
                }
                placeholder="Enter hit points..."
                style={styles.input}
                min="1"
                max="500"
              />
              <div style={styles.helpText}>
                Manually enter your character's hit points.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BasicInfo;
