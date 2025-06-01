import { useState } from "react";
import { rollDice } from "../../App/diceRoller";
import { formatModifier, modifiers } from "./utils";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles } from "./styles";

const AbilityScores = ({ character, discordWebhookUrl }) => {
  const [isRolling, setIsRolling] = useState(false);
  const characterModifiers = modifiers(character);

  const { theme } = useTheme();
  const styles = createThemedStyles(theme);

  const clickableAbilityStyle = {
    ...styles.abilityItem,
    cursor: isRolling ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    opacity: isRolling ? 0.5 : 1,
  };

  const rollAbility = async (ability) => {
    if (isRolling) return;

    setIsRolling(true);

    try {
      const diceResult = rollDice();
      const d20Roll = diceResult.total;
      const abilityMod = characterModifiers[ability.key];
      const total = d20Roll + abilityMod;

      const isCriticalSuccess = d20Roll === 20;
      const isCriticalFailure = d20Roll === 1;

      let embedColor = 0x20b7b0;
      let resultText = "";

      if (isCriticalSuccess) {
        embedColor = 0xffd700;
        resultText = " - **CRITICAL SUCCESS!** 🎉";
      } else if (isCriticalFailure) {
        embedColor = 0xff0000;
        resultText = " - **CRITICAL FAILURE!** 💥";
      }

      const message = {
        embeds: [
          {
            title: `${character.name} Rolled: ${ability.name} Check${resultText}`,
            description: `1d20: [${d20Roll}] = ${d20Roll}${
              isCriticalSuccess
                ? " (Natural 20!)"
                : isCriticalFailure
                ? " (Natural 1!)"
                : ""
            }`,
            color: embedColor,
            fields: [
              {
                name: "Roll Details",
                value: `Roll: ${d20Roll} ${
                  abilityMod >= 0 ? "+" : ""
                }${abilityMod} = **${total}**${
                  isCriticalSuccess
                    ? "\n✨ **Exceptional success regardless of DC!**"
                    : isCriticalFailure
                    ? "\n💀 **Spectacular failure regardless of modifier!**"
                    : ""
                }`,
                inline: false,
              },
            ],
            footer: {
              text: `Witches and Snitches- Ability Check • Today at ${new Date().toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}`,
            },
          },
        ],
      };

      if (discordWebhookUrl) {
        await fetch(discordWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
      } else {
        const criticalText = isCriticalSuccess
          ? " - CRITICAL SUCCESS!"
          : isCriticalFailure
          ? " - CRITICAL FAILURE!"
          : "";
        alert(
          `${ability.name} Check: d20(${d20Roll}) + ${abilityMod} = ${total}${criticalText}`
        );
      }
    } catch (error) {
      console.error("Error sending Discord message:", error);
      alert("Failed to send roll to Discord");
    } finally {
      setIsRolling(false);
    }
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
            onClick={() => !isRolling && rollAbility(ability)}
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
