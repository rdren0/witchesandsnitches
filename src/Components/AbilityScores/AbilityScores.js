import { useState } from "react";
import { styles } from "../CharacterSheet/styles";
import { formatModifier, modifiers } from "../CharacterSheet/utils";
import { useRollFunctions } from "../../App/diceRoller";

const AbilityScores = ({ character }) => {
  const { rollAbility } = useRollFunctions();

  const [isRolling, setIsRolling] = useState(false);
  const characterModifiers = modifiers(character);

  const clickableAbilityStyle = {
    ...styles.abilityItem,
    cursor: isRolling ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    opacity: isRolling ? 0.5 : 1,
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
          <div
            key={ability.key}
            style={clickableAbilityStyle}
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
            title={`Click to roll ${ability.name} check (d20 + ${formatModifier(
              characterModifiers[ability.key]
            )})`}
          >
            <span style={styles.abilityName}>{ability.name}</span>
            <div style={styles.abilityModifier}>
              {formatModifier(characterModifiers[ability.key])}
            </div>
            <div style={styles.abilityScore}>{character[ability.key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbilityScores;
