import { useState } from "react";
import { formatModifier, modifiers } from "../CharacterSheet/utils";
import { useRollFunctions } from "../../App/diceRoller";
import { useTheme } from "../../contexts/ThemeContext";
import { getAbilityScoresStyles } from "../../styles/masterStyles";

const AbilityScores = ({ character }) => {
  const { rollAbility, rollSavingThrow } = useRollFunctions();
  const { theme } = useTheme();
  const styles = getAbilityScoresStyles(theme);
  const [isRolling, setIsRolling] = useState(false);
  // eslint-disable-next-line
  const characterModifiers = modifiers(character);

  const getSavingThrowProficiencies = (castingStyle) => {
    const proficiencyMap = {
      "Willpower Caster": ["constitution", "charisma"],
      "Technique Caster": ["dexterity", "wisdom"],
      "Intellect Caster": ["wisdom", "intelligence"],
      "Vigor Caster": ["constitution", "strength"],
    };

    return proficiencyMap[castingStyle] || [];
  };

  const getClickableAbilityStyle = (ability) => ({
    ...styles.abilityItem,
    cursor: isRolling ? "not-allowed" : "pointer",
    opacity: isRolling ? 0.5 : 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  });

  const getSavingThrowButtonStyle = (abilityKey, isHovered) => ({
    ...styles.savingThrowButton,
    backgroundColor: styles.savingThrowButton?.backgroundColor,
    borderColor: styles.savingThrowButton?.borderColor,
    boxShadow: "none",
    transform: isHovered && !isRolling ? "translateY(-1px)" : "none",
    cursor: isRolling ? "not-allowed" : "pointer",
    opacity: isRolling ? 0.5 : 1,
  });

  const getSavingThrowModifier = (abilityKey) => {
    const baseModifier = characterModifiers[abilityKey];
    const proficiencyBonus = character.proficiencyBonus || 0;

    const savingThrowProficiencies = getSavingThrowProficiencies(
      character.castingStyle
    );
    const isProficient = savingThrowProficiencies.includes(abilityKey);

    return isProficient ? baseModifier + proficiencyBonus : baseModifier;
  };

  return (
    <div style={styles.abilityCard}>
      <h2 style={styles.abilityTitle}>Ability Scores</h2>
      <div style={styles.abilityGrid}>
        {[
          { name: "Strength", key: "strength" },
          { name: "Dexterity", key: "dexterity" },
          { name: "Constitution", key: "constitution" },
          { name: "Intelligence", key: "intelligence" },
          { name: "Wisdom", key: "wisdom" },
          { name: "Charisma", key: "charisma" },
        ].map((ability) => (
          <div key={ability.key} style={getClickableAbilityStyle(ability)}>
            <div
              onClick={() =>
                !isRolling &&
                rollAbility({
                  ability,
                  isRolling,
                  setIsRolling,
                  characterModifiers,
                  character,
                })
              }
              title={`Click to roll ${
                ability.name
              } check (d20 + ${formatModifier(
                characterModifiers[ability.key]
              )})`}
              style={{ cursor: isRolling ? "not-allowed" : "pointer", flex: 1 }}
            >
              <span style={styles.abilityName}>{ability.name}</span>
              <div style={styles.abilityModifier}>
                {formatModifier(characterModifiers[ability.key])}
              </div>
              <div style={styles.abilityScore}>{character[ability.key]}</div>
            </div>

            <button
              style={getSavingThrowButtonStyle(ability.key)}
              onClick={(e) => {
                e.stopPropagation();
                if (!isRolling) {
                  rollSavingThrow({
                    ability,
                    isRolling,
                    setIsRolling,
                    character,
                    savingThrowModifier: getSavingThrowModifier(ability.key),
                  });
                }
              }}
              title={`Roll ${ability.name} saving throw (d20 + ${formatModifier(
                getSavingThrowModifier(ability.key)
              )})`}
              disabled={isRolling}
            >
              Save {formatModifier(getSavingThrowModifier(ability.key))}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbilityScores;
