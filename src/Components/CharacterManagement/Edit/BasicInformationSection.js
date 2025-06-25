import { RefreshCw } from "lucide-react";
import { castingStyles } from "../../SharedData/data";
import StepIndicator from "../Shared/StepIndicator";

const BasicInformationSection = ({
  character,
  handleInputChange,
  calculateHitPoints,
  getCurrentHp,
  isHpManualMode,
  setIsHpManualMode,
  rolledHp,
  setRolledHp,
  rollHp,
  styles,
  theme,
}) => {
  const gameSessionOptions = [
    "Sunday - Knights",
    "Monday - Haunting",
    "Tuesday - Knights",
    "Wednesday - Haunting",
    "Thursday - Knights",
    "Friday - Knights",
    "Saturday - Haunting",
    "Saturday - Knights",
    "DEVELOPMENT",
  ];

  return (
    <>
      <StepIndicator step={1} totalSteps={5} label="Basic Information" />

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Character Name *</label>
        <input
          type="text"
          value={character.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter character name..."
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
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Casting Style</label>
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
      </div>

      {character.castingStyle === "Intellect Caster" && (
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Initiative Ability *</label>
          <div style={styles.helpText}>
            As an intellect caster, you may choose to use Intelligence or
            Dexterity for initiative.
            {character.abilityScores &&
              character.abilityScores.dexterity &&
              character.abilityScores.intelligence && (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: theme.primary,
                  }}
                >
                  {Math.floor((character.abilityScores.intelligence - 10) / 2) >
                  Math.floor((character.abilityScores.dexterity - 10) / 2)
                    ? "💡 Intelligence gives a higher modifier"
                    : Math.floor((character.abilityScores.dexterity - 10) / 2) >
                      Math.floor(
                        (character.abilityScores.intelligence - 10) / 2
                      )
                    ? "⚡ Dexterity gives a higher modifier"
                    : "⚖️ Both abilities give the same modifier"}
                </div>
              )}
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
                Dexterity (Standard)
                {character.abilityScores &&
                  character.abilityScores.dexterity && (
                    <span
                      style={{
                        color:
                          character.abilityScores.intelligence &&
                          Math.floor(
                            (character.abilityScores.dexterity - 10) / 2
                          ) >
                            Math.floor(
                              (character.abilityScores.intelligence - 10) / 2
                            )
                            ? theme.success
                            : theme.textSecondary,
                        fontWeight:
                          character.abilityScores.intelligence &&
                          Math.floor(
                            (character.abilityScores.dexterity - 10) / 2
                          ) >
                            Math.floor(
                              (character.abilityScores.intelligence - 10) / 2
                            )
                            ? "bold"
                            : "normal",
                        marginLeft: "8px",
                      }}
                    >
                      {Math.floor(
                        (character.abilityScores.dexterity - 10) / 2
                      ) >= 0
                        ? "+"
                        : ""}
                      {Math.floor((character.abilityScores.dexterity - 10) / 2)}
                    </span>
                  )}
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
                Intelligence (Intellect Caster)
                {character.abilityScores &&
                  character.abilityScores.intelligence && (
                    <span
                      style={{
                        color:
                          character.abilityScores.dexterity &&
                          Math.floor(
                            (character.abilityScores.intelligence - 10) / 2
                          ) >
                            Math.floor(
                              (character.abilityScores.dexterity - 10) / 2
                            )
                            ? theme.success
                            : theme.textSecondary,
                        fontWeight:
                          character.abilityScores.dexterity &&
                          Math.floor(
                            (character.abilityScores.intelligence - 10) / 2
                          ) >
                            Math.floor(
                              (character.abilityScores.dexterity - 10) / 2
                            )
                            ? "bold"
                            : "normal",
                        marginLeft: "8px",
                      }}
                    >
                      {Math.floor(
                        (character.abilityScores.intelligence - 10) / 2
                      ) >= 0
                        ? "+"
                        : ""}
                      {Math.floor(
                        (character.abilityScores.intelligence - 10) / 2
                      )}
                    </span>
                  )}
              </span>
            </label>
          </div>
        </div>
      )}

      <div style={styles.levelHpGrid}>
        <div style={styles.levelContainer}>
          <label style={styles.label}>Level</label>
          <input
            type="number"
            min="1"
            max="20"
            value={character.level || 1}
            onChange={(e) =>
              handleInputChange("level", parseInt(e.target.value) || 1)
            }
            style={styles.input}
          />
        </div>
        <div style={styles.hpFieldContainer}>
          <label style={styles.label}>Hit Points</label>
          {!character.castingStyle ? (
            <div style={styles.skillsPlaceholder}>
              Select a Casting Style first
            </div>
          ) : (
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
          )}
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
    </>
  );
};

export default BasicInformationSection;
