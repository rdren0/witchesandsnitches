import React, { useState, createContext, useContext } from "react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { X, Dice6, Star, Skull } from "lucide-react";
import { getModifierInfo } from "../Components/SpellBook/utils";
const discordWebhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL;

const RollModalContext = createContext();

export const RollResultModal = ({ rollResult, isOpen, onClose }) => {
  if (!isOpen || !rollResult) return null;

  const {
    title,
    rollValue,
    modifier,
    total,
    isCriticalSuccess,
    isCriticalFailure,
    description,
    type = "ability",
  } = rollResult;

  const getTypeColor = () => {
    switch (type) {
      case "ability":
        return "#20b7b0";
      case "initiative":
        return "#107319";
      case "skill":
        return "#6600cc";
      case "spell":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const backgroundColor = isCriticalSuccess
    ? "#fef3c7"
    : isCriticalFailure
    ? "#fee2e2"
    : "#f8fafc";

  const borderColor = isCriticalSuccess
    ? "#f59e0b"
    : isCriticalFailure
    ? "#ef4444"
    : getTypeColor();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: backgroundColor,
          border: `3px solid ${borderColor}`,
          borderRadius: "16px",
          padding: "24px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            color: "#6b7280",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          <X size={20} />
        </button>

        {/* Critical Success/Failure Icon */}
        {(isCriticalSuccess || isCriticalFailure) && (
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            {isCriticalSuccess ? (
              <Star size={48} color="#f59e0b" fill="#f59e0b" />
            ) : (
              <Skull size={48} color="#ef4444" fill="#ef4444" />
            )}
          </div>
        )}

        {/* Title */}
        <h2
          style={{
            margin: "0 0 16px 0",
            fontSize: "20px",
            fontWeight: "600",
            color: "#1f2937",
            textAlign: "center",
            paddingRight: "24px",
          }}
        >
          {title}
        </h2>

        {/* Roll Display */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            padding: "16px",
            backgroundColor: "white",
            borderRadius: "12px",
            border: "2px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "8px",
            }}
          >
            <Dice6 size={28} color={getTypeColor()} />
            <span
              style={{
                color: isCriticalSuccess
                  ? "#f59e0b"
                  : isCriticalFailure
                  ? "#ef4444"
                  : "#1f2937",
              }}
            >
              {rollValue}
            </span>
            {modifier !== 0 && (
              <>
                <span style={{ color: "#6b7280" }}>
                  {modifier >= 0 ? "+" : ""}
                  {modifier}
                </span>
                <span style={{ color: "#6b7280" }}>=</span>
                <span
                  style={{
                    color: getTypeColor(),
                    fontSize: "28px",
                  }}
                >
                  {total}
                </span>
              </>
            )}
          </div>

          {/* Roll breakdown text */}
          <div
            style={{
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            d20 Roll: {rollValue}
            {modifier !== 0 &&
              ` • Modifier: ${modifier >= 0 ? "+" : ""}${modifier}`}{" "}
            • Total: {total}
          </div>
        </div>

        {/* Critical Success/Failure Message */}
        {isCriticalSuccess && (
          <div
            style={{
              textAlign: "center",
              padding: "12px",
              backgroundColor: "#fef3c7",
              border: "2px solid #f59e0b",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#92400e",
                marginBottom: "4px",
              }}
            >
              ✨ CRITICAL SUCCESS! ✨
            </div>
            <div style={{ fontSize: "14px", color: "#92400e" }}>
              Exceptional success regardless of DC!
            </div>
          </div>
        )}

        {isCriticalFailure && (
          <div
            style={{
              textAlign: "center",
              padding: "12px",
              backgroundColor: "#fee2e2",
              border: "2px solid #ef4444",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#991b1b",
                marginBottom: "4px",
              }}
            >
              💀 CRITICAL FAILURE! 💀
            </div>
            <div style={{ fontSize: "14px", color: "#991b1b" }}>
              Spectacular failure regardless of modifier!
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: "14px",
              color: "#4b5563",
              textAlign: "center",
              marginBottom: "20px",
              fontStyle: "italic",
            }}
          >
            {description}
          </div>
        )}

        {/* Close Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 24px",
              backgroundColor: getTypeColor(),
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              minWidth: "100px",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const RollModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rollResult, setRollResult] = useState(null);

  const showRollResult = (result) => {
    setRollResult(result);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setRollResult(null);
  };

  return (
    <RollModalContext.Provider value={{ showRollResult }}>
      {children}
      <RollResultModal
        rollResult={rollResult}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </RollModalContext.Provider>
  );
};

export const useRollModal = () => {
  const context = useContext(RollModalContext);
  if (!context) {
    return {
      showRollResult: (result) => {
        const criticalText = result.isCriticalSuccess
          ? " - CRITICAL SUCCESS!"
          : result.isCriticalFailure
          ? " - CRITICAL FAILURE!"
          : "";
        alert(
          `${result.title}: d20(${result.rollValue}) + ${result.modifier} = ${result.total}${criticalText}`
        );
      },
    };
  }
  return context;
};

export const useRollFunctions = () => {
  const { showRollResult } = useRollModal();

  return {
    rollAbility: (params) => rollAbility({ ...params, showRollResult }),
    rollInitiative: (params) => rollInitiative({ ...params, showRollResult }),
    rollSkill: (params) => rollSkill({ ...params, showRollResult }),
    attemptSpell: (params) => attemptSpell({ ...params, showRollResult }),
    rollBrewPotion: (params) => rollBrewPotion({ ...params, showRollResult }),
  };
};

export const calculateSkillBonus = ({ skillName, abilityMod, character }) => {
  if (!character) return 0;
  const isProficient = character.skills?.[skillName] || false;
  const profBonus = isProficient ? character.proficiencyBonus : 0;
  return abilityMod + profBonus;
};

export const rollDice = () => {
  const roller = new DiceRoller();
  const roll = roller.roll("1d20");
  return {
    total: roll.total,
    notation: roll.notation,
    output: roll.output,
  };
};

export const rollAbility = async ({
  ability,
  isRolling,
  setIsRolling,
  characterModifiers,
  character,
  showRollResult,
}) => {
  if (isRolling) return;

  setIsRolling(true);

  try {
    const diceResult = rollDice();
    const d20Roll = diceResult.total;
    const abilityMod = characterModifiers[ability.key];
    const total = d20Roll + abilityMod;

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;

    if (showRollResult) {
      showRollResult({
        title: `${ability.name} Check`,
        rollValue: d20Roll,
        modifier: abilityMod,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "ability",
        description: `Rolling ${ability.name} check for ${character.name}`,
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
    }
  } catch (error) {
    console.error("Error sending Discord message:", error);
    alert("Failed to send roll to Discord");
  } finally {
    setIsRolling(false);
  }
};
export const getMaxAchievableQuality = ({
  proficiencies,
  ingredientQuality,
}) => {
  const potionMakingLevel = proficiencies.potionMaking; // 0, 1, or 2 (expertise)
  const potioneerKit = proficiencies.potioneersKit;
  const herbologyKit = proficiencies.herbologyKit;

  const hasPotion = potionMakingLevel > 0;
  const hasExpertise = potionMakingLevel === 2;
  const kitCount = (potioneerKit ? 1 : 0) + (herbologyKit ? 1 : 0);
  const totalRegularProficiencies = (hasPotion ? 1 : 0) + kitCount;

  // Match the rules table exactly:
  // 0 Prof: No proficiencies at all
  // 1 Prof: Exactly 1 proficiency (any type)
  // 2 Profs or 1 Exp: Either 2 regular proficiencies OR expertise in potion-making
  // 1 Prof 1 Exp: Expertise in potion-making + at least 1 kit proficiency
  // 2 Expertise: Not achievable in current system (would need kit expertise)

  if (totalRegularProficiencies === 0) {
    // 0 Prof row: Poor->Flawed, Normal->Flawed, Superior->Normal
    switch (ingredientQuality) {
      case "poor":
        return "flawed";
      case "normal":
        return "flawed";
      case "exceptional":
        return "flawed"; // Interpolated: same as normal
      case "superior":
        return "normal";
      default:
        return "flawed";
    }
  } else if (totalRegularProficiencies === 1 && !hasExpertise) {
    // 1 Prof row: Poor->Flawed, Normal->Normal, Superior->Normal
    switch (ingredientQuality) {
      case "poor":
        return "flawed";
      case "normal":
        return "normal";
      case "exceptional":
        return "normal"; // Interpolated: same as normal
      case "superior":
        return "normal";
      default:
        return "normal";
    }
  } else if (
    (totalRegularProficiencies === 2 && !hasExpertise) ||
    (hasExpertise && kitCount === 0)
  ) {
    // 2 Profs or 1 Exp row: Poor->Normal, Normal->Normal, Superior->Exceptional
    switch (ingredientQuality) {
      case "poor":
        return "normal";
      case "normal":
        return "normal";
      case "exceptional":
        return "exceptional"; // Interpolated: better than normal
      case "superior":
        return "exceptional";
      default:
        return "normal";
    }
  } else if (hasExpertise && kitCount >= 1) {
    // 1 Prof 1 Exp row: Poor->Normal, Normal->Exceptional, Superior->Exceptional
    switch (ingredientQuality) {
      case "poor":
        return "normal";
      case "normal":
        return "exceptional";
      case "exceptional":
        return "exceptional";
      case "superior":
        return "exceptional";
      default:
        return "exceptional";
    }
  }

  return "normal"; // fallback
};

export const getProficiencyAnalysis = (proficiencies, ingredientQuality) => {
  const potionMakingLevel = proficiencies.potionMaking;
  const hasPotion = potionMakingLevel > 0;
  const hasExpertise = potionMakingLevel === 2;
  const kitCount =
    (proficiencies.potioneersKit ? 1 : 0) +
    (proficiencies.herbologyKit ? 1 : 0);
  const totalRegularProficiencies = (hasPotion ? 1 : 0) + kitCount;

  let category = "";
  if (totalRegularProficiencies === 0) {
    category = "0 Proficiencies";
  } else if (totalRegularProficiencies === 1 && !hasExpertise) {
    category = "1 Proficiency";
  } else if (
    (totalRegularProficiencies === 2 && !hasExpertise) ||
    (hasExpertise && kitCount === 0)
  ) {
    category = "2 Proficiencies or 1 Expertise";
  } else if (hasExpertise && kitCount >= 1) {
    category = "1 Proficiency + 1 Expertise";
  }

  return `**Category:** ${category}\n**With ${ingredientQuality} ingredients:** Can achieve up to ${getMaxAchievableQuality(
    { proficiencies, ingredientQuality }
  )} quality`;
};

export const rollBrewPotion = async ({
  isRolling,
  setIsRolling,
  character,
  selectedPotion,
  proficiencies,
  ingredientQuality,
  qualityDCs,
  ingredientModifiers,
  webhookUrl,
  showRollResult,
}) => {
  if (isRolling) return null;

  setIsRolling(true);

  try {
    const diceResult = rollDice();
    const d20Roll = diceResult.total;

    const calculateBrewingResult = (roll) => {
      const baseDCs = qualityDCs[selectedPotion.rarity];
      const ingredientMod = ingredientModifiers[ingredientQuality];
      // FIX: Pass the required parameters to getMaxAchievableQuality
      const maxQuality = getMaxAchievableQuality({
        proficiencies,
        ingredientQuality,
      });

      // Create adjusted DCs for all qualities
      const adjustedDCs = Object.fromEntries(
        Object.entries(baseDCs).map(([quality, dc]) => [
          quality,
          dc + ingredientMod,
        ])
      );

      // Determine achieved quality based on roll
      let achievedQuality = "ruined";
      const qualityOrder = ["superior", "exceptional", "normal", "flawed"];

      for (const quality of qualityOrder) {
        if (roll >= adjustedDCs[quality]) {
          achievedQuality = quality;
          break;
        }
      }

      // Cap the achieved quality at the maximum possible for this brewer/ingredient combo
      const qualityHierarchy = [
        "ruined",
        "flawed",
        "normal",
        "exceptional",
        "superior",
      ];
      const maxIndex = qualityHierarchy.indexOf(maxQuality);
      const achievedIndex = qualityHierarchy.indexOf(achievedQuality);

      if (achievedIndex > maxIndex) {
        achievedQuality = maxQuality;
      }

      return {
        achievedQuality,
        maxQuality,
        roll,
        targetDC: adjustedDCs[achievedQuality],
        baseDCs,
        adjustedDCs,
        ingredientMod,
        potion: selectedPotion,
        ingredientQuality,
        proficiencies,
      };
    };

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;

    // Handle critical results BEFORE calculating brewing result
    let brewingResult;
    if (isCriticalSuccess) {
      // Natural 20 always succeeds at the maximum possible quality
      const maxQuality = getMaxAchievableQuality({
        proficiencies,
        ingredientQuality,
      });
      const baseDCs = qualityDCs[selectedPotion.rarity];
      const ingredientMod = ingredientModifiers[ingredientQuality];
      const adjustedDCs = Object.fromEntries(
        Object.entries(baseDCs).map(([quality, dc]) => [
          quality,
          dc + ingredientMod,
        ])
      );

      brewingResult = {
        achievedQuality: maxQuality,
        maxQuality: maxQuality,
        roll: d20Roll,
        targetDC: adjustedDCs[maxQuality],
        baseDCs,
        adjustedDCs,
        ingredientMod,
        potion: selectedPotion,
        ingredientQuality,
        proficiencies,
      };
    } else if (isCriticalFailure) {
      // Natural 1 always results in ruined potion
      const baseDCs = qualityDCs[selectedPotion.rarity];
      const ingredientMod = ingredientModifiers[ingredientQuality];
      const adjustedDCs = Object.fromEntries(
        Object.entries(baseDCs).map(([quality, dc]) => [
          quality,
          dc + ingredientMod,
        ])
      );
      const maxQuality = getMaxAchievableQuality({
        proficiencies,
        ingredientQuality,
      });

      brewingResult = {
        achievedQuality: "ruined",
        maxQuality: maxQuality,
        roll: d20Roll,
        targetDC: 0,
        baseDCs,
        adjustedDCs,
        ingredientMod,
        potion: selectedPotion,
        ingredientQuality,
        proficiencies,
      };
    } else {
      // Normal roll - calculate result based on DC
      brewingResult = calculateBrewingResult(d20Roll);
    }

    if (showRollResult) {
      showRollResult({
        title: `Potion Brewing: ${selectedPotion.name}`,
        rollValue: d20Roll,
        modifier: 0,
        total: d20Roll,
        isCriticalSuccess,
        isCriticalFailure,
        type: "potion",
        description: `Quality Achieved: ${
          brewingResult.achievedQuality.charAt(0).toUpperCase() +
          brewingResult.achievedQuality.slice(1)
        }`,
      });
    }

    // Discord webhook logic (unchanged)
    if (webhookUrl || discordWebhookUrl) {
      const webhookToUse = webhookUrl || discordWebhookUrl;

      const profText =
        `Potion-Making: ${
          proficiencies.potionMaking === 2
            ? "Expertise"
            : proficiencies.potionMaking === 1
            ? "Proficient"
            : "None"
        }\n` +
        `Potioneer's Kit: ${proficiencies.potioneersKit ? "Yes" : "No"}\n` +
        `Herbology Kit: ${proficiencies.herbologyKit ? "Yes" : "No"}`;

      let embedColor = 0x6b46c1; // Default purple
      let resultText = "";

      // Set result text for critical rolls

      // Set embed color based on achieved quality (always)
      switch (brewingResult.achievedQuality) {
        case "superior":
          embedColor = 0x8b5cf6; // Purple - highest quality
          break;
        case "exceptional":
          embedColor = 0x3b82f6; // Blue - high quality
          break;
        case "normal":
          embedColor = 0x10b981; // Green - standard quality
          break;
        case "flawed":
          embedColor = 0xf59e0b; // Orange - low quality
          break;
        case "ruined":
          embedColor = 0xef4444; // Red - failed
          break;
        default:
          embedColor = 0x6b7280; // Gray - fallback
          break;
      }
      if (isCriticalSuccess) {
        embedColor = 0xffd700;
        resultText = " - **CRITICAL SUCCESS!** 🎉";
      } else if (isCriticalFailure) {
        embedColor = 0xff0000;
        resultText = " - **CRITICAL FAILURE!** 💥";
      }

      const embed = {
        title: `${character?.name || "Unknown"} Brewed: ${
          selectedPotion.name
        }${resultText}`,
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
            name: "Quality Achieved",
            value: `${
              brewingResult.achievedQuality.charAt(0).toUpperCase() +
              brewingResult.achievedQuality.slice(1)
            }`,
            inline: true,
          },
          {
            name: "🎲 Roll vs DC",
            value: `${d20Roll} vs DC ${brewingResult.targetDC}`,
            inline: true,
          },
          {
            name: "Ingredient Quality",
            value:
              ingredientQuality.charAt(0).toUpperCase() +
              ingredientQuality.slice(1),
            inline: true,
          },
          {
            name: "Proficiencies",
            value: profText,
            inline: true,
          },

          {
            name: "Potion Effect",
            value: selectedPotion.description,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "Witches and Snitches - Potion Brewing",
        },
      };

      try {
        await fetch(webhookToUse, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embeds: [embed],
          }),
        });
      } catch (error) {
        console.error("Error sending to Discord:", error);
      }
    }

    return brewingResult;
  } catch (error) {
    console.error("Error brewing potion:", error);
    return null;
  } finally {
    setIsRolling(false);
  }
};
export const rollInitiative = async ({
  character,
  isRolling,
  setIsRolling,
  characterModifiers,
  showRollResult,
}) => {
  if (isRolling) return;

  setIsRolling(true);

  try {
    const diceResult = rollDice();
    const d20Roll = diceResult.total;
    const mod = characterModifiers.dexterity;
    const total = d20Roll + mod;

    if (showRollResult) {
      showRollResult({
        title: `Initiative Roll`,
        rollValue: d20Roll,
        modifier: mod,
        total: total,
        isCriticalSuccess: false,
        isCriticalFailure: false,
        type: "initiative",
        description: `Rolling initiative for ${character.name}`,
      });
    } else {
      alert(`Rolled Initiative: d20(${d20Roll}) + ${mod} = ${total}`);
    }

    let embedColor = 0x107319;

    const message = {
      embeds: [
        {
          title: `${character.name} Rolled Initiative`,
          description: "",
          color: embedColor,
          fields: [
            {
              name: "Roll Details",
              value: `Roll: ${d20Roll} ${
                mod >= 0 ? "+" : ""
              }${mod} = **${total}**`,
              inline: false,
            },
          ],
          footer: {
            text: `Witches and Snitches- Initiative • Today at ${new Date().toLocaleTimeString(
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
    }
  } catch (error) {
    console.error("Error sending Discord message:", error);
    alert("Failed to send roll to Discord");
  } finally {
    setIsRolling(false);
  }
};

export const rollSkill = async ({
  skill,
  abilityMod,
  isRolling,
  setIsRolling,
  character,
  showRollResult,
}) => {
  if (isRolling) return;

  setIsRolling(true);

  try {
    const diceResult = rollDice();
    const d20Roll = diceResult.total;
    const skillBonus = calculateSkillBonus({
      skillName: skill.name,
      abilityMod,
      character,
    });
    const total = d20Roll + skillBonus;
    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;

    if (showRollResult) {
      showRollResult({
        title: `${skill.displayName} Check`,
        rollValue: d20Roll,
        modifier: skillBonus,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "skill",
        description: `Rolling ${skill.displayName} check for ${character.name}`,
      });
    } else {
      const criticalText = isCriticalSuccess
        ? " - CRITICAL SUCCESS!"
        : isCriticalFailure
        ? " - CRITICAL FAILURE!"
        : "";
      alert(
        `${skill.displayName} Check: d20(${d20Roll}) + ${skillBonus} = ${total}${criticalText}`
      );
    }

    let embedColor = 0x6600cc;
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
          title: `${character.name} Rolled: ${skill.displayName}${resultText}`,
          color: embedColor,
          fields: [
            {
              name: "Roll Details",
              value: `Roll: ${d20Roll} ${
                skillBonus >= 0 ? "+" : ""
              }${skillBonus} = **${total}**${
                isCriticalSuccess
                  ? "\n✨ **Exceptional success!**"
                  : isCriticalFailure
                  ? "\n💀 **Spectacular failure regardless of modifier!**"
                  : ""
              }`,
              inline: false,
            },
          ],
          footer: {
            text: `Witches and Snitches - Skill Check • Today at ${new Date().toLocaleTimeString(
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
    }
  } catch (error) {
    console.error("Error sending Discord message:", error);
    alert("Failed to send roll to Discord");
  } finally {
    setIsRolling(false);
  }
};

export const attemptSpell = async ({
  spellName,
  subject,
  showRollResult,
  getSpellModifier,
  selectedCharacter,
  setSpellAttempts,
  discordUserId,
  setAttemptingSpells,
  setCriticalSuccesses,
  updateSpellProgressSummary,
}) => {
  if (!selectedCharacter || !discordUserId) {
    alert("Please select a character first!");
    return;
  }

  setAttemptingSpells((prev) => ({ ...prev, [spellName]: true }));

  try {
    const diceResult = rollDice();
    const d20Roll = diceResult.total;
    const totalModifier = getSpellModifier(
      spellName,
      subject,
      selectedCharacter
    );
    const total = d20Roll + totalModifier;

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;
    const isSuccess = (total >= 11 || isCriticalSuccess) && !isCriticalFailure;

    if (showRollResult) {
      showRollResult({
        title: `${spellName} Attempt`,
        rollValue: d20Roll,
        modifier: totalModifier,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "spell",
        description: `Attempting to cast ${spellName} for ${selectedCharacter.name}`,
      });
    } else {
      const criticalText = isCriticalSuccess
        ? " - CRITICAL SUCCESS!"
        : isCriticalFailure
        ? " - CRITICAL FAILURE!"
        : "";
      const resultText = isSuccess ? "SUCCESS" : "FAILED";
      alert(
        `${spellName} Attempt: d20(${d20Roll}) + ${totalModifier} = ${total} - ${resultText}${criticalText}`
      );
    }

    if (isCriticalSuccess) {
      setSpellAttempts((prev) => ({
        ...prev,
        [spellName]: { 1: true, 2: true },
      }));
      setCriticalSuccesses((prev) => ({ ...prev, [spellName]: true }));
    } else if (isSuccess) {
      setSpellAttempts((prev) => {
        const currentAttempts = prev[spellName] || {};
        const newAttempts = { ...currentAttempts };

        if (!newAttempts[1]) {
          newAttempts[1] = true;
        } else if (!newAttempts[2]) {
          newAttempts[2] = true;
        }

        return {
          ...prev,
          [spellName]: newAttempts,
        };
      });
    }

    if (!discordWebhookUrl) {
      console.error("Discord webhook URL not configured");
      return;
    }

    let title = `${
      selectedCharacter?.name || "Unknown"
    } Attempted: ${spellName}`;
    let resultText = `${isSuccess ? "✅ SUCCESS" : "❌ FAILED"}`;
    let embedColor = isSuccess ? 0x00ff00 : 0xff0000;

    if (isCriticalSuccess) {
      title = `⭐ ${
        selectedCharacter?.name || "Unknown"
      } Attempted: ${spellName}`;
      resultText = `**${d20Roll}** - ⭐ CRITICALLY MASTERED!`;
      embedColor = 0xffd700;
    } else if (isCriticalFailure) {
      title = `💥 ${
        selectedCharacter?.name || "Unknown"
      } Attempted: ${spellName}`;
      resultText = `**${d20Roll}** - 💥 CRITICAL FAILURE!`;
      embedColor = 0x8b0000;
    }

    let rollDescription = `**Roll:** ${d20Roll}`;
    if (totalModifier !== 0) {
      const modifierText =
        totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;
      rollDescription += ` ${modifierText} = **${total}**`;
    }

    const fields = [
      {
        name: "Result",
        value: resultText,
        inline: true,
      },
      {
        name: "Roll Details",
        value: rollDescription,
        inline: true,
      },
    ];

    if (totalModifier !== 0 && selectedCharacter) {
      const modifierInfo = getModifierInfo(
        spellName,
        subject,
        selectedCharacter
      );

      let modifierBreakdown = `**${modifierInfo.source}**\n`;
      modifierBreakdown += `${modifierInfo.abilityName}: ${
        modifierInfo.abilityModifier >= 0 ? "+" : ""
      }${modifierInfo.abilityModifier}`;
      if (modifierInfo.wandModifier !== 0) {
        modifierBreakdown += `\nWand (${modifierInfo.wandType}): ${
          modifierInfo.wandModifier >= 0 ? "+" : ""
        }${modifierInfo.wandModifier}`;
      }
      modifierBreakdown += `\n**Total: ${
        totalModifier >= 0 ? "+" : ""
      }${totalModifier}**`;

      fields.push({
        name: "Modifier Breakdown",
        value: modifierBreakdown,
        inline: false,
      });
    }

    const embed = {
      title: title,
      description: diceResult.output,
      color: embedColor,
      fields: fields,
      timestamp: new Date().toISOString(),
      footer: {
        text: "Witches And Snitches - Spellcasting",
      },
    };

    try {
      await fetch(discordWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [embed],
        }),
      });
    } catch (error) {
      console.error("Error sending to Discord:", error);
    }

    if (isSuccess) {
      await updateSpellProgressSummary(spellName, isCriticalSuccess);
    }
  } catch (error) {
    console.error("Error attempting spell:", error);
    alert("Error processing spell attempt. Please try again.");
  } finally {
    setAttemptingSpells((prev) => ({ ...prev, [spellName]: false }));
  }
};

export const rollAbilityStat = () => {
  const roller = new DiceRoller();
  const result = roller.roll("4d6kh3");
  return result.total;
};
