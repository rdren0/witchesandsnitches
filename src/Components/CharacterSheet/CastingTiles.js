import React, { useState } from "react";
import { Wand2, Sparkles } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getAbilityScoresStyles } from "../../styles/masterStyles";
import { useRollModal, rollMagicCasting } from "../utils/diceRoller";

const CastingTiles = ({ character }) => {
  const { theme } = useTheme();
  const { showRollResult } = useRollModal();

  const styles = getAbilityScoresStyles(theme);
  const [isRolling, setIsRolling] = useState(false);

  const getAbilityModifier = (score) => Math.floor((score - 10) / 2);

  const formatModifier = (modifier) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const handleRoll = async (modifier, type, school) => {
    if (isRolling) return;

    // Use the Discord-enabled rolling function
    await rollMagicCasting({
      school,
      type,
      modifier,
      isRolling,
      setIsRolling,
      character,
      showRollResult,
    });
  };

  const schools = [
    {
      name: "Divinations",
      key: "divinations",
      color: "#F59E0B",
      wandMod: (character.magicModifiers || {})[`divinations`] || 0,
      castingStat: getAbilityModifier(
        character.abilityScores?.wisdom || character.wisdom || 10
      ),
    },
    {
      name: "Transfig",
      key: "transfiguration",
      color: "#10B981",
      wandMod: (character.magicModifiers || {})[`transfiguration`] || 0,
      castingStat: getAbilityModifier(
        character.abilityScores?.strength || character.strength || 10
      ),
    },
    {
      name: "Charms",
      key: "charms",
      color: "#3B82F6",
      wandMod: (character.magicModifiers || {})[`charms`] || 0,
      castingStat: getAbilityModifier(
        character.abilityScores?.dexterity || character.dexterity || 10
      ),
    },
    {
      name: "Healing",
      key: "healing",
      color: "#EF4444",
      wandMod: (character.magicModifiers || {})[`healing`] || 0,
      castingStat: getAbilityModifier(
        character.abilityScores?.intelligence || character.intelligence || 10
      ),
    },
    {
      name: "JHC",
      key: "jinxesHexesCurses",
      color: "#8330ee",
      wandMod: (character.magicModifiers || {})[`jinxesHexesCurses`] || 0,
      castingStat: getAbilityModifier(
        character.abilityScores?.charisma || character.charisma || 10
      ),
    },
  ];

  const getTotalButtonStyle = (isHovered) => ({
    ...styles.savingThrowButton,
    backgroundColor: "#9d4edd",
    borderColor: "#9d4edd",
    color: "white",
    boxShadow: "none",
    transform: isHovered && !isRolling ? "translateY(-1px)" : "none",
    cursor: isRolling ? "not-allowed" : "pointer",
    opacity: isRolling ? 0.5 : 1,
  });

  return (
    <div style={styles.abilityCard}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          color: "#9d4edd",
          fontSize: "16px",
          fontWeight: "600",
          marginBottom: "16px",
        }}
      >
        <Wand2 size={20} />
        Magic Casting
        <Sparkles size={16} color="#9d4edd" />
      </div>

      <div
        style={{
          ...styles.abilityGrid,
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "4px",
        }}
      >
        {schools.map((school) => {
          const total = school.wandMod + school.castingStat;

          return (
            <div
              key={school.key}
              style={{
                ...styles.abilityItem,
                opacity: isRolling ? 0.5 : 1,
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                padding: "12px 8px",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  ...styles.abilityName,
                  color: school.color,
                  fontSize: "12px",
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: "4px",
                }}
              >
                {school.name}
              </div>

              <button
                style={{
                  ...getTotalButtonStyle(),
                  backgroundColor: school.color,
                  border: "1px solid white",
                  width: "65px",
                  color: theme.text,
                  marginBottom: "4px",
                  fontSize: "11px",
                }}
                onClick={() => {
                  if (!isRolling) {
                    handleRoll(school.wandMod, "Wand", school.name);
                  }
                }}
                title={`Roll ${school.name} wand check (d20 ${formatModifier(
                  school.wandMod
                )})`}
                disabled={isRolling}
              >
                Wand
                <br />
                {formatModifier(school.wandMod)}
              </button>
              <button
                style={{
                  ...getTotalButtonStyle(),
                  fontSize: "11px",
                  marginBottom: "8px",
                  width: "50px",
                }}
                onClick={() => {
                  if (!isRolling) {
                    handleRoll(total, "Total", school.name);
                  }
                }}
                title={`Roll ${school.name} total (d20 ${formatModifier(
                  total
                )})`}
                disabled={isRolling}
              >
                Total
                <br />
                {formatModifier(total)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CastingTiles;
