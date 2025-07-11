import { useState } from "react";
import { formatModifier } from "../CharacterSheet/utils";
import { useRollFunctions } from "../../App/diceRoller";
import { useTheme } from "../../contexts/ThemeContext";
import { getAbilityScoresStyles } from "../../styles/masterStyles";

const SavingThrows = ({ character }) => {
  const { rollSavingThrow } = useRollFunctions();
  const { theme } = useTheme();
  const styles = getAbilityScoresStyles(theme);
  const [isRolling, setIsRolling] = useState(false);

  const getAbilityModifier = (score) => {
    if (score === null || score === undefined || isNaN(score)) return 0;
    return Math.floor((score - 10) / 2);
  };

  const getProficiencyBonus = (level) => {
    if (level <= 4) return 2;
    if (level <= 8) return 3;
    if (level <= 12) return 4;
    if (level <= 16) return 5;
    return 6;
  };

  const getSavingThrowProficiencies = (castingStyle) => {
    const proficiencies = {
      "Grace Caster": ["charisma", "wisdom"],
      "Vigor Caster": ["constitution", "strength"],
      "Wit Caster": ["intelligence", "wisdom"],
      "Wisdom Caster": ["wisdom", "charisma"],
    };
    return proficiencies[castingStyle] || [];
  };

  const getSavingThrowModifiers = () => {
    const modifiers = {};
    const proficiencies = getSavingThrowProficiencies(character.castingStyle);
    const proficiencyBonus = getProficiencyBonus(character.level || 1);

    [
      "strength",
      "dexterity",
      "constitution",
      "intelligence",
      "wisdom",
      "charisma",
    ].forEach((ability) => {
      const abilityScore =
        character.abilityScores?.[ability] || character[ability] || 0;
      const abilityMod = getAbilityModifier(abilityScore);
      const isProficient = proficiencies.includes(ability);

      modifiers[ability] = {
        total: abilityMod + (isProficient ? proficiencyBonus : 0),
        isProficient,
      };
    });

    return modifiers;
  };

  const savingThrowModifiers = getSavingThrowModifiers();

  const getClickableSaveStyle = (ability) => {
    const isProficient = savingThrowModifiers[ability].isProficient;
    return {
      ...styles.abilityItem,
      cursor: isRolling ? "not-allowed" : "pointer",
      opacity: isRolling ? 0.5 : 1,

      backgroundColor: isProficient
        ? `${theme.success}15`
        : styles.abilityItem.backgroundColor,
      borderColor: isProficient
        ? theme.success
        : styles.abilityItem.borderColor,
      borderWidth: isProficient
        ? "2px"
        : styles.abilityItem.borderWidth || "1px",
    };
  };

  const handleSavingThrowRoll = (ability) => {
    if (isRolling) return;

    if (rollSavingThrow) {
      rollSavingThrow({
        ability,
        isRolling,
        setIsRolling,
        savingThrowModifiers,
        character,
      });
    } else {
      setIsRolling(true);

      setTimeout(() => setIsRolling(false), 1000);
    }
  };

  return (
    <div>
      <h2 style={styles.abilityTitle}>Saving Throws</h2>
      <div style={styles.abilityGrid}>
        {[
          { name: "Strength", key: "strength" },
          { name: "Dexterity", key: "dexterity" },
          { name: "Constitution", key: "constitution" },
          { name: "Intelligence", key: "intelligence" },
          { name: "Wisdom", key: "wisdom" },
          { name: "Charisma", key: "charisma" },
        ].map((ability) => {
          const saveData = savingThrowModifiers[ability.key];
          return (
            <div
              key={ability.key}
              style={getClickableSaveStyle(ability.key)}
              onClick={() => handleSavingThrowRoll(ability)}
              title={`Click to roll ${
                ability.name
              } saving throw (d20 + ${formatModifier(saveData.total)})${
                saveData.isProficient ? " - Proficient" : ""
              }`}
            >
              <span style={styles.abilityName}>{ability.name}</span>
              <div
                style={{
                  ...styles.abilityModifier,
                  color: saveData.isProficient
                    ? theme.success
                    : styles.abilityModifier.color,
                }}
              >
                {formatModifier(saveData.total)}
              </div>
              <div style={styles.abilityScore}>
                {saveData.isProficient ? "PROF" : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingThrows;
