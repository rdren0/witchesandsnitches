import { useState } from "react";
import { formatModifier, modifiers } from "../CharacterSheet/utils";
import { useRollFunctions } from "../utils/diceRoller";
import { useTheme } from "../../contexts/ThemeContext";
import { getAbilityScoresStyles } from "./styles";

const AbilityScores = ({ character }) => {
  const { rollAbility, rollSavingThrow } = useRollFunctions();
  const { theme } = useTheme();
  const styles = getAbilityScoresStyles(theme);
  const [isRolling, setIsRolling] = useState(false);

  const finalAbilityScores = {
    strength: character.ability_scores?.strength || character.strength || 10,
    dexterity: character.ability_scores?.dexterity || character.dexterity || 10,
    constitution:
      character.ability_scores?.constitution || character.constitution || 10,
    intelligence:
      character.ability_scores?.intelligence || character.intelligence || 10,
    wisdom: character.ability_scores?.wisdom || character.wisdom || 10,
    charisma: character.ability_scores?.charisma || character.charisma || 10,
  };

  const characterModifiers = {
    strength: Math.floor((finalAbilityScores.strength - 10) / 2),
    dexterity: Math.floor((finalAbilityScores.dexterity - 10) / 2),
    constitution: Math.floor((finalAbilityScores.constitution - 10) / 2),
    intelligence: Math.floor((finalAbilityScores.intelligence - 10) / 2),
    wisdom: Math.floor((finalAbilityScores.wisdom - 10) / 2),
    charisma: Math.floor((finalAbilityScores.charisma - 10) / 2),
  };

  const getSavingThrowProficiencies = (castingStyle) => {
    const proficiencyMap = {
      "Willpower Caster": ["constitution", "charisma"],
      "Technique Caster": ["dexterity", "wisdom"],
      "Intellect Caster": ["wisdom", "intelligence"],
      "Vigor Caster": ["constitution", "strength"],
    };

    return proficiencyMap[castingStyle] || [];
  };

  const getClickableAbilityStyle = () => ({
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
              <div style={styles.abilityScore}>
                {finalAbilityScores[ability.key]}
              </div>
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
