import { useState } from "react";
import { formatModifier, modifiers } from "../CharacterSheet/utils";
import { useRollFunctions } from "../utils/diceRoller";
import { useTheme } from "../../contexts/ThemeContext";
import { getAbilityScoresStyles } from "./styles";
import { calculateFinalAbilityScores } from "../CharacterManager/utils/characterUtils";

const AbilityScores = ({ character }) => {
  const { rollAbility, rollSavingThrow } = useRollFunctions();
  const { theme } = useTheme();
  const styles = getAbilityScoresStyles(theme);
  const [isRolling, setIsRolling] = useState(false);

  const finalAbilityScores =
    character.abilityScores || calculateFinalAbilityScores(character);

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
          <div
            key={ability.key}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: theme.background,
              borderRadius: "8px",
              border: `2px solid ${theme.border}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 8px",
                cursor: isRolling ? "not-allowed" : "pointer",
                opacity: isRolling ? 0.6 : 1,
                width: "100%",
                transition: "all 0.2s ease",
                backgroundColor: theme.background,
                gap: "8px",
                position: "relative",
              }}
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
              onMouseEnter={(e) => {
                if (!isRolling) {
                  e.currentTarget.style.backgroundColor = theme.surface;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.background;
              }}
              title={`Click to roll ${ability.name} check (d20 ${formatModifier(
                characterModifiers[ability.key]
              )})`}
            >
              <div style={styles.abilityName}>{ability.name}</div>
              <div style={styles.abilityModifier}>
                {formatModifier(characterModifiers[ability.key])}
              </div>
              <div style={styles.abilityScore}>
                {finalAbilityScores[ability.key]}
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "2px",
                backgroundColor: theme.border,
              }}
            />
            <div
              style={{
                fontSize: "0.875rem",
                color: theme.textSecondary,
                textAlign: "center",
                padding: "10px 8px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                cursor: isRolling ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                backgroundColor: theme.background,
              }}
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
              onMouseEnter={(e) => {
                if (!isRolling) {
                  e.currentTarget.style.backgroundColor = theme.surface;
                  e.currentTarget.style.color = theme.primary;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.background;
                e.currentTarget.style.color = theme.textSecondary;
              }}
              title={`Click to roll ${
                ability.name
              } saving throw (d20 ${formatModifier(
                getSavingThrowModifier(ability.key)
              )})`}
            >
              Save: {formatModifier(getSavingThrowModifier(ability.key))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbilityScores;
