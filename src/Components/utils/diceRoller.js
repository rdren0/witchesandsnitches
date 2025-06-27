import React, { useState, createContext, useContext } from "react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { X, Dice6, Star } from "lucide-react";
import { getModifierInfo } from "../SpellBook/utils";
import { spellsData } from "../SpellBook/spells";

const discordWebhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL;

const RollModalContext = createContext();

const hasSubclassFeature = (character, featureName) => {
  return character?.subclassFeatures?.includes(featureName) || false;
};

const getResearcherBonuses = (character) => {
  if (!hasSubclassFeature(character, "Researcher")) {
    return {
      researchBonus: 0,
      grantsDoubleTags: false,
      hasDevictoAccess: false,
      wisdomModifier: 0,
    };
  }

  const getAbilityModifier = (score) => {
    if (score === null || score === undefined) return 0;
    return Math.floor((score - 10) / 2);
  };

  const wisdomModifier = getAbilityModifier(
    character.abilityScores?.wisdom || 10
  );
  const researchBonus = Math.floor(wisdomModifier / 2);

  return {
    researchBonus: Math.max(0, researchBonus),
    grantsDoubleTags: true,
    hasDevictoAccess: true,
    wisdomModifier,
  };
};

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
    rollType = "normal",
    inventoryAdded,
    potionQuality,
    recipeQuality,
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
      case "hitdice":
        return "#9d4edd";
      case "damage":
        return "#ef4444";
      case "heal":
        return "#10b981";
      case "saving_throw":
        return "#8b5cf6";
      case "research":
        return "#10b981";
      case "flexible":
        return "#f59e0b";
      case "potion":
        return "#6b46c1";
      case "recipe":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const getDiceColor = () => {
    if (isCriticalSuccess) return "#f59e0b";
    if (isCriticalFailure) return "#ef4444";
    return getTypeColor();
  };

  const getRollTypeIndicator = () => {
    if (rollType === "advantage") return "🎯 ADV";
    if (rollType === "disadvantage") return "⚠️ DIS";
    return "";
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
    : getDiceColor();

  const textColor = isCriticalSuccess
    ? "#92400e"
    : isCriticalFailure
    ? "#991b1b"
    : "#1f2937";

  const getQualityColor = (quality) => {
    const colors = {
      flawed: "#ef4444",
      normal: "#6b7280",
      exceptional: "#8b5cf6",
      superior: "#f59e0b",
      ruined: "#dc2626",
    };
    return colors[quality] || "#6b7280";
  };

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
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor,
          border: `3px solid ${borderColor}`,
          borderRadius: "16px",
          padding: "24px",
          minWidth: "320px",
          maxWidth: "500px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          transform: "scale(1)",
          animation: "rollModalAppear 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Dice6
              size={32}
              style={{
                color: getDiceColor(),
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
              }}
            />
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "700",
                  color: textColor,
                  lineHeight: "1.2",
                }}
              >
                {title}
              </h2>
              {getRollTypeIndicator() && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    fontWeight: "500",
                    marginTop: "2px",
                  }}
                >
                  {getRollTypeIndicator()}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#6b7280",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            padding: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: "12px",
            border: `2px solid ${borderColor}20`,
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: "900",
              color: getDiceColor(),
              lineHeight: "1",
              marginBottom: "8px",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {rollValue}
          </div>
          <div
            style={{
              fontSize: "18px",
              color: textColor,
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            {modifier >= 0 ? "+" : ""}
            {modifier} = {total}
          </div>
          {(isCriticalSuccess || isCriticalFailure) && (
            <div
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: isCriticalSuccess ? "#92400e" : "#991b1b",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginTop: "8px",
              }}
            >
              {isCriticalSuccess
                ? "✨ Critical Success!"
                : "💀 Critical Failure!"}
            </div>
          )}
        </div>

        {description && (
          <div
            style={{
              fontSize: "14px",
              color: "#374151",
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "8px",
              fontWeight: "500",
            }}
          >
            {description}
          </div>
        )}

        {(type === "potion" || type === "recipe") && (
          <div style={{ marginBottom: "16px" }}>
            {(potionQuality || recipeQuality) && (
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: getQualityColor(
                    potionQuality || recipeQuality
                  ),
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textTransform: "capitalize",
                  marginBottom: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {potionQuality || recipeQuality} Quality
              </div>
            )}

            {inventoryAdded !== undefined && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  backgroundColor: inventoryAdded ? "#10b981" : "#ef4444",
                  color: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {inventoryAdded ? (
                  <>
                    <Star size={16} />
                    Added to Inventory!
                  </>
                ) : (
                  <>
                    <X size={16} />
                    Failed to add to inventory
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: getDiceColor(),
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {type === "potion"
            ? "Continue Brewing"
            : type === "recipe"
            ? "Continue Cooking"
            : "Continue"}
        </button>
      </div>

      <style>
        {`
          @keyframes rollModalAppear {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

const rollCorruption = async ({
  character,
  pointsGained,
  pointsRedeemed,
  reason,
  pointsTotal,
  pointsRemaining,
  type = "gained",
  saveResult = null,
}) => {
  try {
    if (!discordWebhookUrl) {
      console.error("Discord webhook URL not configured");
      return;
    }

    const characterName = character?.name || "Unknown Character";
    const usedFor =
      reason?.trim() || (type === "gained" ? "Dark deed" : "Act of redemption");

    const getCorruptionTier = (points) => {
      if (points === 0)
        return {
          name: "Pure Hearted",
          range: "(0)",
          color: 0x10b981,
          saveDC: 10,
          boon: null,
          effect: null,
        };
      if (points <= 4)
        return {
          name: "Pragmatic",
          range: "(1-4)",
          color: 0xf59e0b,
          saveDC: 12,
          boon: "Empowered Darkness",
          effect: null,
        };
      if (points <= 7)
        return {
          name: "Devious",
          range: "(5-7)",
          color: 0xef4444,
          saveDC: 14,
          boon: null,
          effect: "Mild Effect",
        };
      if (points <= 11)
        return {
          name: "Vicious",
          range: "(8-11)",
          color: 0x7c2d12,
          saveDC: 16,
          boon: "Heightened Darkness",
          effect: "Severe Effect",
        };
      return {
        name: "Vile",
        range: "(12+)",
        color: 0x1f2937,
        saveDC: 18,
        boon: null,
        effect: "Severe Effect",
      };
    };

    const finalPoints = type === "gained" ? pointsTotal : pointsRemaining;
    const currentTier = getCorruptionTier(finalPoints);

    let corruptionLevel = `${currentTier.name} ${currentTier.range}`;

    if (finalPoints === 0) {
      corruptionLevel = "✨ **PURE HEARTED** - Soul cleansed of darkness";
    } else if (finalPoints <= 4) {
      corruptionLevel =
        "⚖️ **PRAGMATIC** - Willing to bend rules for the greater good";
    } else if (finalPoints <= 7) {
      corruptionLevel = "😈 **DEVIOUS** - Embracing darker methods";
    } else if (finalPoints <= 11) {
      corruptionLevel = "🔥 **VICIOUS** - Deep in corruption's grip";
    } else {
      corruptionLevel = "💀 **VILE** - Soul consumed by darkness";
    }

    let embed;

    if (type === "gained") {
      const wasFromSave = saveResult !== null;

      embed = {
        title: wasFromSave
          ? "💀 Corruption Save Failed"
          : "💀 Corruption Gained",
        description: wasFromSave
          ? `${characterName} failed to resist the corruption of their dark deed...`
          : `${characterName} has fallen deeper into darkness...`,
        color: currentTier.color,
        fields: [
          {
            name: "Character",
            value: characterName,
            inline: true,
          },
          {
            name: "Points Gained",
            value: pointsGained.toString(),
            inline: true,
          },
          {
            name: "Total Corruption",
            value: pointsTotal.toString(),
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: `Witches and Snitches - Corruption ${
            wasFromSave ? "Save" : "Gained"
          } • Next Wisdom Save DC: ${currentTier.saveDC}`,
        },
      };

      if (wasFromSave && saveResult) {
        embed.fields.push({
          name: "Corruption Save",
          value: `**${saveResult.rollValue}** ${
            saveResult.modifier >= 0 ? "+" : ""
          }${saveResult.modifier} = **${saveResult.total}** vs DC ${
            saveResult.dc
          }`,
          inline: false,
        });
      }

      embed.fields.push({
        name: wasFromSave ? "Dark Deed" : "Dark Deed",
        value: usedFor,
        inline: false,
      });

      embed.fields.push({
        name: "Corruption Tier",
        value: corruptionLevel,
        inline: false,
      });
    } else {
      embed = {
        title: "✨ Corruption Redeemed",
        description: `${characterName} has found redemption through remorse...`,
        color: finalPoints === 0 ? 0x10b981 : currentTier.color,
        fields: [
          {
            name: "Character",
            value: characterName,
            inline: true,
          },
          {
            name: "Points Redeemed",
            value: pointsRedeemed.toString(),
            inline: true,
          },
          {
            name: "Remaining Corruption",
            value: pointsRemaining.toString(),
            inline: true,
          },
          {
            name: "Act of Redemption",
            value: usedFor,
            inline: false,
          },
          {
            name: "Corruption Tier",
            value: corruptionLevel,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: `Witches and Snitches - Corruption Redeemed • Wisdom Save DC: ${currentTier.saveDC}`,
        },
      };
    }

    if (currentTier.boon || currentTier.effect) {
      let tierInfo = "";
      if (currentTier.boon) tierInfo += `**Boon:** ${currentTier.boon}\n`;
      if (currentTier.effect) tierInfo += `**Effect:** ${currentTier.effect}`;

      embed.fields.push({
        name: "Tier Benefits/Effects",
        value: tierInfo,
        inline: false,
      });
    }

    if (type === "gained") {
      if (finalPoints >= 12) {
        embed.fields.push({
          name: "⚠️ Warning",
          value:
            "This character's soul is being consumed by darkness. Redemption grows ever more difficult...",
          inline: false,
        });
      } else if (finalPoints >= 8) {
        embed.fields.push({
          name: "⚠️ Caution",
          value:
            "Dark forces have a strong hold on this character. Future corruption saves are DC 16.",
          inline: false,
        });
      } else if (finalPoints >= 5) {
        embed.fields.push({
          name: "📋 Note",
          value:
            "Character must roll for a Mild Corruption Effect. Future corruption saves are DC 14.",
          inline: false,
        });
      }
    } else {
      if (finalPoints === 0) {
        embed.fields.push({
          name: "🎉 Redemption Complete",
          value:
            "This character has found complete redemption! Their soul is pure once more.",
          inline: false,
        });
      } else if (finalPoints <= 4) {
        embed.fields.push({
          name: "🌟 Progress",
          value:
            "Significant progress toward redemption. Keep seeking to make amends.",
          inline: false,
        });
      }
    }

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
    console.error("Failed to send corruption Discord webhook:", error);
  }
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

export const calculateSkillBonus = ({ skillName, abilityMod, character }) => {
  if (!character) return 0;
  const skillLevel = character.skills?.[skillName] || 0;
  const profBonus = character.proficiencyBonus || 0;

  if (skillLevel === 0) return abilityMod;
  if (skillLevel === 1) return abilityMod + profBonus;
  if (skillLevel === 2) return abilityMod + 2 * profBonus;

  return abilityMod;
};

export const applyRavenclawBonus = (
  diceRoll,
  character,
  abilityType,
  hasProficiency
) => {
  if (character?.house !== "Ravenclaw") {
    return diceRoll;
  }

  const isIntOrWisCheck =
    abilityType === "intelligence" || abilityType === "wisdom";

  if (isIntOrWisCheck && hasProficiency && diceRoll <= 5) {
    return 6;
  }

  return diceRoll;
};

export const rollDice = (
  character = null,
  abilityType = null,
  hasProficiency = false
) => {
  const roller = new DiceRoller();
  const roll = roller.roll("1d20");

  const adjustedTotal = applyRavenclawBonus(
    roll.total,
    character,
    abilityType,
    hasProficiency
  );

  return {
    total: adjustedTotal,
    originalRoll: roll.total,
    notation: roll.notation,
    output: roll.output,
    ravenclawBonusApplied: adjustedTotal !== roll.total,
  };
};

export const rollAbilityCheckWithProficiency = async ({
  abilityType,
  hasProficiency,
  modifier = 0,
  title = "Ability Check",
  character,
  isRolling,
  setIsRolling,
  showRollResult,
}) => {
  if (isRolling) return;

  setIsRolling(true);

  try {
    const diceResult = rollDice(character, abilityType, hasProficiency);
    const d20Roll = diceResult.originalRoll;
    const adjustedRoll = diceResult.total;
    const total = adjustedRoll + modifier;

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;

    if (showRollResult) {
      showRollResult({
        title: title,
        rollValue: adjustedRoll,
        originalRoll: d20Roll,
        modifier: modifier,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "ability",
        description: `Rolling ${title} for ${character.name}`,
        ravenclawBonusApplied: diceResult.ravenclawBonusApplied,
        abilityType: abilityType,
      });
    }
  } catch (error) {
    console.error("Error with ability check:", error);
  } finally {
    setIsRolling(false);
  }
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
    const hasProficiency = false;

    const diceResult = rollDice(character, ability.key, hasProficiency);
    const d20Roll = diceResult.originalRoll;
    const adjustedRoll = diceResult.total;
    const abilityMod = characterModifiers[ability.key];
    const total = adjustedRoll + abilityMod;

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;

    if (showRollResult) {
      showRollResult({
        title: `${ability.name} Check`,
        rollValue: adjustedRoll,
        originalRoll: d20Roll,
        modifier: abilityMod,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "ability",
        description: `Rolling ${ability.name} check for ${character.name}`,
        ravenclawBonusApplied: diceResult.ravenclawBonusApplied,
        abilityType: ability.key,
      });
    } else {
      const criticalText = isCriticalSuccess
        ? " - CRITICAL SUCCESS!"
        : isCriticalFailure
        ? " - CRITICAL FAILURE!"
        : "";

      const ravenclawText = diceResult.ravenclawBonusApplied
        ? ` (Ravenclaw: ${d20Roll}→${adjustedRoll})`
        : "";

      alert(
        `${ability.name} Check: d20(${adjustedRoll})${ravenclawText} + ${abilityMod} = ${total}${criticalText}`
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

    let rollDescription = `Roll: ${adjustedRoll}`;
    if (diceResult.ravenclawBonusApplied) {
      rollDescription = `🦅 **Ravenclaw In-Depth Knowledge!**\nRoll: ${d20Roll} → ${adjustedRoll}`;
    }

    const message = {
      embeds: [
        {
          title: `${character.name} Rolled: ${ability.name} Check${resultText}`,
          description: `${
            isCriticalSuccess
              ? "Natural 20!"
              : isCriticalFailure
              ? "Natural 1!"
              : ""
          }`,
          color: embedColor,
          fields: [
            {
              name: "Roll Details",
              value: `${rollDescription} ${
                abilityMod >= 0 ? "+" : ""
              }${abilityMod} = **${total}**${
                isCriticalSuccess
                  ? "\n✨ **Exceptional success regardless of DC!**"
                  : isCriticalFailure
                  ? "\n💀 **Spectacular failure regardless of modifier!**"
                  : ""
              }${
                diceResult.ravenclawBonusApplied
                  ? `\n🎓 *In-Depth Knowledge bonus applied!*`
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
  const potionMakingLevel = proficiencies.potionMaking;
  const potioneerKit = proficiencies.potioneersKit;
  const herbologyKit = proficiencies.herbologyKit;

  const hasPotion = potionMakingLevel > 0;
  const hasExpertise = potionMakingLevel === 2;
  const kitCount = (potioneerKit ? 1 : 0) + (herbologyKit ? 1 : 0);
  const totalRegularProficiencies = (hasPotion ? 1 : 0) + kitCount;

  if (totalRegularProficiencies === 0) {
    switch (ingredientQuality) {
      case "poor":
        return "flawed";
      case "normal":
        return "flawed";
      case "exceptional":
        return "flawed";
      case "superior":
        return "normal";
      default:
        return "flawed";
    }
  } else if (totalRegularProficiencies === 1 && !hasExpertise) {
    switch (ingredientQuality) {
      case "poor":
        return "flawed";
      case "normal":
        return "normal";
      case "exceptional":
        return "normal";
      case "superior":
        return "normal";
      default:
        return "normal";
    }
  } else if (
    (totalRegularProficiencies === 2 && !hasExpertise) ||
    (hasExpertise && kitCount === 0)
  ) {
    switch (ingredientQuality) {
      case "poor":
        return "normal";
      case "normal":
        return "normal";
      case "exceptional":
        return "exceptional";
      case "superior":
        return "exceptional";
      default:
        return "normal";
    }
  } else if (hasExpertise && kitCount >= 1) {
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

  return "normal";
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

export const rollGenericD20 = async ({
  modifier = 0,
  title = "Generic Roll",
  description = "Rolling a d20 with modifier",
  character = null,
  isRolling,
  setIsRolling,
  showRollResult,
}) => {
  if (isRolling) return;

  setIsRolling(true);

  try {
    const diceResult = rollDice();
    const d20Roll = diceResult.total;
    const mod = parseInt(modifier) || 0;
    const total = d20Roll + mod;

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;

    if (showRollResult) {
      showRollResult({
        title: title,
        rollValue: d20Roll,
        modifier: mod,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "generic",
        description: description,
      });
    } else {
      alert(`${title}: d20(${d20Roll}) + ${mod} = ${total}`);
    }

    let embedColor = 0xff9e3d;
    let resultText = "";

    const rollTitle = character
      ? `${character.name}: ${title}${resultText}`
      : `${title}${resultText}`;

    const message = {
      embeds: [
        {
          title: rollTitle,
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
            text: `Witches and Snitches - Generic Roll • Today at ${new Date().toLocaleTimeString(
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

export const rollBrewPotion = async ({
  isRolling,
  setIsRolling,
  character,
  selectedPotion,
  proficiencies,
  ingredientQuality,
  qualityDCs,
  ingredientModifiers,
  characterModifier = 0,
  webhookUrl,
  showRollResult,

  addPotionToInventory,
  currentCharacter,
  supabase,
  user,
  rawIngredientQuality,
}) => {
  if (isRolling) return null;
  setIsRolling(true);

  try {
    const diceResult = rollDice();
    const d20Roll = diceResult.total;
    const skillModifier = characterModifier || 0;
    const totalRoll = d20Roll + skillModifier;

    const getMaxAchievableQuality = ({ proficiencies, ingredientQuality }) => {
      const hasKit = proficiencies.potioneersKit || proficiencies.herbologyKit;
      if (!hasKit) return "Cannot brew without kit";

      const qualityHierarchy = ["flawed", "normal", "exceptional", "superior"];
      const preparedIndex = qualityHierarchy.indexOf(ingredientQuality);

      if (preparedIndex === -1) {
        console.error(
          "Invalid prepared ingredient quality:",
          ingredientQuality
        );
        return "flawed";
      }

      const maxIndex = Math.min(preparedIndex + 2, qualityHierarchy.length - 1);
      const maxQuality = qualityHierarchy[maxIndex];

      return maxQuality;
    };

    const maxQuality = getMaxAchievableQuality({
      proficiencies,
      ingredientQuality,
    });
    const baseDCs = qualityDCs[selectedPotion.rarity];
    const ingredientMod = ingredientModifiers[ingredientQuality] || 0;
    const adjustedDCs = Object.fromEntries(
      Object.entries(baseDCs).map(([quality, dc]) => [
        quality,
        dc + ingredientMod,
      ])
    );

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;

    let achievedQuality;
    let targetDC;

    if (isCriticalSuccess) {
      achievedQuality =
        maxQuality === "Cannot brew without kit" ? "ruined" : maxQuality;
      targetDC = adjustedDCs[achievedQuality] || 0;
    } else if (isCriticalFailure) {
      achievedQuality = "ruined";
      targetDC = 0;
    } else {
      const sortedQualities = Object.entries(adjustedDCs)
        .sort(([, a], [, b]) => b - a)
        .map(([quality]) => quality);

      achievedQuality = "ruined";
      for (const quality of sortedQualities) {
        const dc = adjustedDCs[quality];
        if (totalRoll >= dc) {
          achievedQuality = quality;
          break;
        }
      }

      const qualityHierarchy = [
        "ruined",
        "flawed",
        "normal",
        "exceptional",
        "superior",
      ];
      const maxIndex = qualityHierarchy.indexOf(maxQuality);
      const achievedIndex = qualityHierarchy.indexOf(achievedQuality);

      if (maxIndex !== -1 && achievedIndex > maxIndex) {
        achievedQuality = maxQuality;
      }

      targetDC = adjustedDCs[achievedQuality] || 0;
    }

    const brewingResult = {
      achievedQuality,
      maxQuality,
      diceRoll: d20Roll,
      characterModifier: skillModifier,
      total: totalRoll,
      roll: totalRoll,
      targetDC,
      baseDCs,
      adjustedDCs,
      ingredientMod,
      potion: selectedPotion,
      ingredientQuality,
      proficiencies,
    };

    let inventoryAdded = false;
    if (addPotionToInventory && supabase && currentCharacter && user) {
      try {
        const getPotionValue = (quality, rarity) => {
          const baseValues = {
            common: {
              ruined: "0g",
              flawed: "5g",
              normal: "25g",
              exceptional: "50g",
              superior: "100g",
            },
            uncommon: {
              ruined: "0g",
              flawed: "25g",
              normal: "100g",
              exceptional: "200g",
              superior: "400g",
            },
            rare: {
              ruined: "0g",
              flawed: "100g",
              normal: "500g",
              exceptional: "1000g",
              superior: "2000g",
            },
            "very rare": {
              ruined: "0g",
              flawed: "500g",
              normal: "2500g",
              exceptional: "5000g",
              superior: "10000g",
            },
            legendary: {
              ruined: "0g",
              flawed: "2500g",
              normal: "12500g",
              exceptional: "25000g",
              superior: "50000g",
            },
          };

          return baseValues[rarity]?.[quality] || "Unknown";
        };

        const potionItem = {
          name: `${
            achievedQuality.charAt(0).toUpperCase() + achievedQuality.slice(1)
          } ${selectedPotion.name}`,
          description: `${
            selectedPotion.description
          }\n\nBrewed on ${new Date().toLocaleString()} with ${rawIngredientQuality} ingredients (prepared to ${ingredientQuality}). Roll: ${d20Roll} + ${skillModifier} = ${totalRoll}`,
          quantity: 1,
          value: getPotionValue(achievedQuality, selectedPotion.rarity),
          category: "Potions",
          attunement_required: false,
          character_id: currentCharacter.id,
          discord_user_id: user?.discord_user_id || user?.id,
        };

        const { error } = await supabase
          .from("inventory_items")
          .insert([potionItem])
          .select()
          .single();

        if (!error) {
          inventoryAdded = true;
        }
      } catch (error) {
        console.error("Error adding potion to inventory:", error);
      }
    }

    if (showRollResult) {
      showRollResult({
        title: `Potion Brewing: ${selectedPotion.name}`,
        rollValue: d20Roll,
        modifier: skillModifier,
        total: totalRoll,
        isCriticalSuccess,
        isCriticalFailure,
        type: "potion",
        description: `Quality Achieved: ${
          achievedQuality.charAt(0).toUpperCase() + achievedQuality.slice(1)
        }`,

        inventoryAdded,
        potionQuality: achievedQuality,
        potionName: selectedPotion.name,
      });
    } else {
      const criticalText = isCriticalSuccess
        ? " - CRITICAL SUCCESS!"
        : isCriticalFailure
        ? " - CRITICAL FAILURE!"
        : "";
      const inventoryText = inventoryAdded ? " - Added to Inventory!" : "";
      alert(
        `Potion Brewing: d20(${d20Roll}) + ${skillModifier} = ${totalRoll} - Quality: ${achievedQuality}${criticalText}${inventoryText}`
      );
    }

    let embedColor = 0x6b46c1;
    let resultText = "";

    switch (achievedQuality) {
      case "superior":
        embedColor = 0x8b5cf6;
        break;
      case "exceptional":
        embedColor = 0x3b82f6;
        break;
      case "normal":
        embedColor = 0x10b981;
        break;
      case "flawed":
        embedColor = 0xf59e0b;
        break;
      case "ruined":
        embedColor = 0xef4444;
        break;
      default:
        embedColor = 0x6b7280;
        break;
    }

    if (isCriticalSuccess) {
      embedColor = 0xffd700;
      resultText = " - **CRITICAL SUCCESS!** 🎉";
    } else if (isCriticalFailure) {
      embedColor = 0xff0000;
      resultText = " - **CRITICAL FAILURE!** 💥";
    }

    const ruinedMessages = [
      "You did your best!",
      "Practice makes perfect!",
      "Even master brewers have off days!",
      "The ingredients had other plans...",
      "Sometimes the cauldron wins.",
      "Better luck next time!",
      "That's why they call it 'experimental brewing'!",
      "The potion decided to become... abstract art.",
    ];

    const randomRuinedMessage =
      ruinedMessages[Math.floor(Math.random() * ruinedMessages.length)];

    const message = {
      embeds: [
        {
          title: `${character.name} Brewed a Potion: ${selectedPotion.name}${resultText}`,
          description: achievedQuality === "ruined" ? randomRuinedMessage : "",
          color: embedColor,
          fields: [
            {
              name: "Roll Details",
              value: `Roll: ${d20Roll} ${
                skillModifier >= 0 ? "+" : ""
              }${skillModifier} = **${totalRoll}**${
                isCriticalSuccess
                  ? "\n✨ **Achieved maximum possible quality!**"
                  : isCriticalFailure
                  ? "\n💀 **Spectacular brewing failure!**"
                  : ""
              }`,
              inline: false,
            },
            {
              name: "Quality Achieved",
              value: `${
                achievedQuality.charAt(0).toUpperCase() +
                achievedQuality.slice(1)
              }${inventoryAdded ? " (Added to Inventory)" : ""}`,
              inline: true,
            },
            {
              name: "Potion Effect",
              value: selectedPotion.description,
              inline: false,
            },
          ],
          footer: {
            text: `Witches and Snitches - Potion Brewing • Today at ${new Date().toLocaleTimeString(
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

    const mod = character.initiativeModifier;
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
    const skillToAbility = {
      athletics: "strength",
      acrobatics: "dexterity",
      sleightOfHand: "dexterity",
      stealth: "dexterity",
      herbology: "intelligence",
      historyOfMagic: "intelligence",
      investigation: "intelligence",
      magicalTheory: "intelligence",
      muggleStudies: "intelligence",
      insight: "wisdom",
      magicalCreatures: "wisdom",
      medicine: "wisdom",
      perception: "wisdom",
      potionMaking: "wisdom",
      survival: "wisdom",
      deception: "charisma",
      intimidation: "charisma",
      performance: "charisma",
      persuasion: "charisma",
    };

    const abilityType =
      skillToAbility[skill.name] ||
      skillToAbility[skill.displayName?.toLowerCase()];

    const hasProficiency =
      character?.skills?.[skill.name] >= 1 ||
      character?.skill_proficiencies?.includes(skill.displayName) ||
      character?.skill_proficiencies?.includes(skill.name);

    const diceResult = rollDice(character, abilityType, hasProficiency);
    const d20Roll = diceResult.originalRoll;
    const adjustedRoll = diceResult.total;

    const skillBonus = calculateSkillBonus({
      skillName: skill.name,
      abilityMod,
      character,
    });

    const total = adjustedRoll + skillBonus;
    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;

    if (showRollResult) {
      showRollResult({
        title: `${skill.displayName} Check`,
        rollValue: adjustedRoll,
        originalRoll: d20Roll,
        modifier: skillBonus,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "skill",
        description: `Rolling ${skill.displayName} check for ${character.name}`,
        ravenclawBonusApplied: diceResult.ravenclawBonusApplied,
        abilityType: abilityType,
      });
    } else {
      const criticalText = isCriticalSuccess
        ? " - CRITICAL SUCCESS!"
        : isCriticalFailure
        ? " - CRITICAL FAILURE!"
        : "";

      const ravenclawText = diceResult.ravenclawBonusApplied
        ? ` (Ravenclaw: ${d20Roll}→${adjustedRoll})`
        : "";

      alert(
        `${skill.displayName} Check: d20(${adjustedRoll})${ravenclawText} + ${skillBonus} = ${total}${criticalText}`
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

    let rollDescription = `Roll: ${adjustedRoll}`;
    if (diceResult.ravenclawBonusApplied) {
      rollDescription = `🦅 **Ravenclaw In-Depth Knowledge!**\nRoll: ${d20Roll} → ${adjustedRoll}`;
    }

    const message = {
      embeds: [
        {
          title: `${character.name} Rolled: ${skill.displayName}${resultText}`,
          color: embedColor,
          fields: [
            {
              name: "Roll Details",
              value: `${rollDescription} ${
                skillBonus >= 0 ? "+" : ""
              }${skillBonus} = **${total}**${
                isCriticalSuccess
                  ? "\n✨ **Exceptional success!**"
                  : isCriticalFailure
                  ? "\n💀 **Spectacular failure regardless of modifier!**"
                  : ""
              }${
                diceResult.ravenclawBonusApplied
                  ? `\n🎓 *In-Depth Knowledge bonus applied!*`
                  : ""
              }`,
              inline: false,
            },
          ],
          footer: {
            text: `Witches and Snitches- Skill Check • Today at ${new Date().toLocaleTimeString(
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

const getSpellLevel = (spellName, subject) => {
  const subjectData = spellsData[subject];
  if (!subjectData) return 0;

  for (const [levelKey, spells] of Object.entries(subjectData.levels)) {
    const spell = spells.find((s) => s.name === spellName);
    if (spell) {
      if (levelKey === "Cantrips") return 0;
      const match = levelKey.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
  }
  return 0;
};

const getSpellCastingDC = (spellLevel) => {
  return 10 + spellLevel;
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

    const spellLevel = getSpellLevel(spellName, subject);
    const goal = getSpellCastingDC(spellLevel);

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;
    const isSuccess =
      (total >= goal || isCriticalSuccess) && !isCriticalFailure;

    if (showRollResult) {
      showRollResult({
        title: `${spellName} Attempt`,
        rollValue: d20Roll,
        modifier: totalModifier,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "spell",
        description: `Attempting to cast ${spellName} (Level ${spellLevel}, DC ${goal}) for ${selectedCharacter.name}`,
      });
    } else {
      const criticalText = isCriticalSuccess
        ? " - CRITICAL SUCCESS!"
        : isCriticalFailure
        ? " - CRITICAL FAILURE!"
        : "";
      const resultText = isSuccess ? "SUCCESS" : "FAILED";
      alert(
        `${spellName} Attempt: d20(${d20Roll}) + ${totalModifier} = ${total} vs DC ${goal} - ${resultText}${criticalText}`
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
    const modifierText =
      totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;
    rollDescription += ` ${modifierText} = **${total}** vs DC ${goal}`;

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
      {
        name: "Spell Info",
        value: `Level ${spellLevel} (DC ${goal})`,
        inline: true,
      },
    ];

    if (selectedCharacter) {
      const modifierInfo = getModifierInfo(
        spellName,
        subject,
        selectedCharacter
      );

      let modifierBreakdown = `${modifierInfo.abilityName}: ${
        modifierInfo.abilityModifier >= 0 ? "+" : ""
      }${modifierInfo.abilityModifier}`;

      modifierBreakdown += `\nWand (${modifierInfo.wandType}): ${
        modifierInfo.wandModifier >= 0 ? "+" : ""
      }${modifierInfo.wandModifier}`;

      fields.push({
        name: "Modifier Breakdown",
        value: modifierBreakdown,
        inline: false,
      });
    }

    const embed = {
      title: title,
      description: "",
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

    await updateSpellProgressSummary(spellName, isSuccess, isCriticalSuccess);
  } catch (error) {
    console.error("Error attempting spell:", error);
    alert("Error processing spell attempt. Please try again.");
  } finally {
    setAttemptingSpells((prev) => ({ ...prev, [spellName]: false }));
  }
};

export const attemptArithmancySpell = async ({
  spellName,
  subject,
  showRollResult,
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

    const intModifier = Math.floor(
      (selectedCharacter.abilityScores.intelligence - 10) / 2
    );
    const modifierInfo = getModifierInfo(spellName, subject, selectedCharacter);
    const wandModifier = modifierInfo.wandModifier || 0;
    const totalModifier = intModifier + wandModifier;

    const total = d20Roll + totalModifier;

    const spellLevel = getSpellLevel(spellName, subject);
    const goal = getSpellCastingDC(spellLevel);

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;
    const isSuccess =
      (total >= goal || isCriticalSuccess) && !isCriticalFailure;

    if (showRollResult) {
      showRollResult({
        title: `${spellName} (Arithmancy Cast)`,
        rollValue: d20Roll,
        modifier: totalModifier,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "spell",
        description: `Arithmancy casting ${spellName} (Level ${spellLevel}, DC ${goal}) for ${selectedCharacter.name} using Intelligence`,
      });
    } else {
      const criticalText = isCriticalSuccess
        ? " - CRITICAL SUCCESS!"
        : isCriticalFailure
        ? " - CRITICAL FAILURE!"
        : "";
      const resultText = isSuccess ? "SUCCESS" : "FAILED";
      alert(
        `${spellName} (Arithmancy): d20(${d20Roll}) + ${totalModifier} = ${total} vs DC ${goal} - ${resultText}${criticalText}`
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
    } Arithmancy Cast: ${spellName}`;
    let resultText = `${isSuccess ? "✅ SUCCESS" : "❌ FAILED"}`;
    let embedColor = isSuccess ? 0x00ff00 : 0xff0000;

    if (isCriticalSuccess) {
      title = `⭐ ${
        selectedCharacter?.name || "Unknown"
      } Arithmancy Cast: ${spellName}`;
      resultText = `**${d20Roll}** - ⭐ CRITICALLY MASTERED!`;
      embedColor = 0xffd700;
    } else if (isCriticalFailure) {
      title = `💥 ${
        selectedCharacter?.name || "Unknown"
      } Arithmancy Cast: ${spellName}`;
      resultText = `**${d20Roll}** - 💥 CRITICAL FAILURE!`;
      embedColor = 0x8b0000;
    }

    let rollDescription = `**Roll:** ${d20Roll}`;
    const modifierText =
      totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;
    rollDescription += ` ${modifierText} = **${total}** vs DC ${goal}`;

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
      {
        name: "Casting Method",
        value: `Arithmancy Cast (Level ${spellLevel}, DC ${goal})`,
        inline: true,
      },
    ];

    let modifierBreakdown = `Intelligence: ${
      intModifier >= 0 ? "+" : ""
    }${intModifier}`;

    modifierBreakdown += `\nWand (${modifierInfo.wandType}): ${
      wandModifier >= 0 ? "+" : ""
    }${wandModifier}`;

    fields.push({
      name: "Modifier Breakdown",
      value: modifierBreakdown,
      inline: false,
    });

    const embed = {
      title: title,
      description: "",
      color: embedColor,
      fields: fields,
      timestamp: new Date().toISOString(),
      footer: {
        text: "Witches And Snitches - Arithmancy Spellcasting",
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

    await updateSpellProgressSummary(spellName, isSuccess, isCriticalSuccess);
  } catch (error) {
    console.error("Error attempting Arithmancy spell:", error);
    alert("Error processing Arithmancy spell attempt. Please try again.");
  } finally {
    setAttemptingSpells((prev) => ({ ...prev, [spellName]: false }));
  }
};

export const attemptRunesSpell = async ({
  spellName,
  subject,
  showRollResult,
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

    const wisModifier = Math.floor(
      (selectedCharacter.abilityScores.wisdom - 10) / 2
    );
    const modifierInfo = getModifierInfo(spellName, subject, selectedCharacter);
    const wandModifier = modifierInfo.wandModifier || 0;
    const totalModifier = wisModifier + wandModifier;

    const total = d20Roll + totalModifier;

    const spellLevel = getSpellLevel(spellName, subject);
    const goal = getSpellCastingDC(spellLevel);

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;
    const isSuccess =
      (total >= goal || isCriticalSuccess) && !isCriticalFailure;

    if (showRollResult) {
      showRollResult({
        title: `${spellName} (Runic Cast)`,
        rollValue: d20Roll,
        modifier: totalModifier,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "spell",
        description: `Runic casting ${spellName} (Level ${spellLevel}, DC ${goal}) for ${selectedCharacter.name} using Wisdom`,
      });
    } else {
      const criticalText = isCriticalSuccess
        ? " - CRITICAL SUCCESS!"
        : isCriticalFailure
        ? " - CRITICAL FAILURE!"
        : "";
      const resultText = isSuccess ? "SUCCESS" : "FAILED";
      alert(
        `${spellName} (Runes): d20(${d20Roll}) + ${totalModifier} = ${total} vs DC ${goal} - ${resultText}${criticalText}`
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
    } Runic Cast: ${spellName}`;
    let resultText = `${isSuccess ? "✅ SUCCESS" : "❌ FAILED"}`;
    let embedColor = isSuccess ? 0x00ff00 : 0xff0000;

    if (isCriticalSuccess) {
      title = `⭐ ${
        selectedCharacter?.name || "Unknown"
      } Runic Cast: ${spellName}`;
      resultText = `**${d20Roll}** - ⭐ CRITICALLY MASTERED!`;
      embedColor = 0xffd700;
    } else if (isCriticalFailure) {
      title = `💥 ${
        selectedCharacter?.name || "Unknown"
      } Runic Cast: ${spellName}`;
      resultText = `**${d20Roll}** - 💥 CRITICAL FAILURE!`;
      embedColor = 0x8b0000;
    }

    let rollDescription = `**Roll:** ${d20Roll}`;
    const modifierText =
      totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;
    rollDescription += ` ${modifierText} = **${total}** vs DC ${goal}`;

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
      {
        name: "Casting Method",
        value: `Runic Cast (Level ${spellLevel}, DC ${goal})`,
        inline: true,
      },
    ];

    let modifierBreakdown = `Wisdom: ${
      wisModifier >= 0 ? "+" : ""
    }${wisModifier}`;

    modifierBreakdown += `\nWand (${modifierInfo.wandType}): ${
      wandModifier >= 0 ? "+" : ""
    }${wandModifier}`;

    fields.push({
      name: "Modifier Breakdown",
      value: modifierBreakdown,
      inline: false,
    });

    const embed = {
      title: title,
      description: "",
      color: embedColor,
      fields: fields,
      timestamp: new Date().toISOString(),
      footer: {
        text: "Witches And Snitches - Runic Spellcasting",
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

    await updateSpellProgressSummary(spellName, isSuccess, isCriticalSuccess);
  } catch (error) {
    console.error("Error attempting Runic spell:", error);
    alert("Error processing Runic spell attempt. Please try again.");
  } finally {
    setAttemptingSpells((prev) => ({ ...prev, [spellName]: false }));
  }
};

export const rollCookRecipe = async ({
  isRolling,
  setIsRolling,
  character,
  selectedRecipe,
  proficiencies,
  ingredientQuality,
  qualityDCs,
  ingredientModifiers,
  characterModifier = 0,
  webhookUrl,
  showRollResult,
  addRecipeToInventory,
  currentCharacter,
  supabase,
  user,
  rawIngredientQuality,
}) => {
  if (isRolling) return null;
  setIsRolling(true);

  try {
    const diceResult = rollDice();
    const d20Roll = diceResult.total;
    const skillModifier = characterModifier || 0;
    const totalRoll = d20Roll + skillModifier;

    const getMaxAchievableQuality = ({ proficiencies, ingredientQuality }) => {
      // For Culinarians, they have built-in proficiency
      const isCulinarian = character?.subclass === "Culinarian";
      const hasKit =
        proficiencies.culinaryKit || proficiencies.herbologyKit || isCulinarian;

      if (!hasKit) return "Cannot cook without kit or Culinarian training";

      const qualityHierarchy = ["flawed", "regular", "exceptional", "superior"];
      const preparedIndex = qualityHierarchy.indexOf(ingredientQuality);

      if (preparedIndex === -1) {
        console.error(
          "Invalid prepared ingredient quality:",
          ingredientQuality
        );
        return "flawed";
      }

      // Culinarians may have enhanced quality progression
      let maxQualityBonus = 0;
      if (isCulinarian) {
        // Culinarians can achieve better quality with their training
        maxQualityBonus = 1;
      }

      const maxIndex = Math.min(
        preparedIndex + 2 + maxQualityBonus,
        qualityHierarchy.length - 1
      );
      const maxQuality = qualityHierarchy[maxIndex];

      return maxQuality;
    };

    const maxQuality = getMaxAchievableQuality({
      proficiencies,
      ingredientQuality,
    });

    // Use the recipe quality DCs (recipes don't have rarity like potions)
    const baseDCs = qualityDCs;
    const ingredientMod = ingredientModifiers[ingredientQuality] || 0;
    const adjustedDCs = Object.fromEntries(
      Object.entries(baseDCs).map(([quality, dc]) => [
        quality,
        dc + ingredientMod,
      ])
    );

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;

    let achievedQuality;
    let targetDC;

    if (isCriticalSuccess) {
      achievedQuality =
        maxQuality === "Cannot cook without kit or Culinarian training"
          ? "ruined"
          : maxQuality;
      targetDC = adjustedDCs[achievedQuality] || 0;
    } else if (isCriticalFailure) {
      achievedQuality = "ruined";
      targetDC = 0;
    } else {
      const sortedQualities = Object.entries(adjustedDCs)
        .sort(([, a], [, b]) => b - a)
        .map(([quality]) => quality);

      achievedQuality = "ruined";
      for (const quality of sortedQualities) {
        const dc = adjustedDCs[quality];
        if (totalRoll >= dc) {
          achievedQuality = quality;
          break;
        }
      }

      const qualityHierarchy = [
        "ruined",
        "flawed",
        "regular",
        "exceptional",
        "superior",
      ];
      const maxIndex = qualityHierarchy.indexOf(maxQuality);
      const achievedIndex = qualityHierarchy.indexOf(achievedQuality);

      if (maxIndex !== -1 && achievedIndex > maxIndex) {
        achievedQuality = maxQuality;
      }

      targetDC = adjustedDCs[achievedQuality] || 0;
    }

    const cookingResult = {
      achievedQuality,
      maxQuality,
      diceRoll: d20Roll,
      characterModifier: skillModifier,
      total: totalRoll,
      roll: totalRoll,
      targetDC,
      baseDCs,
      adjustedDCs,
      ingredientMod,
      recipe: selectedRecipe,
      recipeName: selectedRecipe.name,
      ingredientQuality,
      proficiencies,
      timestamp: new Date().toLocaleString(),
    };

    let inventoryAdded = false;
    if (
      achievedQuality !== "ruined" &&
      addRecipeToInventory &&
      supabase &&
      currentCharacter &&
      user
    ) {
      try {
        const getRecipeValue = (quality) => {
          const baseValues = {
            flawed: "2g",
            regular: "5g",
            exceptional: "15g",
            superior: "50g",
          };

          return baseValues[quality] || "1g";
        };

        const recipeItem = {
          name: `${
            achievedQuality.charAt(0).toUpperCase() + achievedQuality.slice(1)
          } ${selectedRecipe.name}`,
          description: `${selectedRecipe.description}\n\nEffect: ${
            selectedRecipe.qualities[achievedQuality]
          }\n\nCooked on ${new Date().toLocaleString()} with ${rawIngredientQuality} ingredients (prepared to ${ingredientQuality}). Roll: ${d20Roll} + ${skillModifier} = ${totalRoll}`,
          quantity: 1,
          value: getRecipeValue(achievedQuality),
          category: "Recipes",
          attunement_required: false,
          character_id: currentCharacter.id,
          discord_user_id: user?.discord_user_id || user?.id,
        };

        const { error } = await supabase
          .from("inventory_items")
          .insert([recipeItem])
          .select()
          .single();

        if (!error) {
          inventoryAdded = true;
        }
      } catch (error) {
        console.error("Error adding recipe to inventory:", error);
      }
    }

    if (showRollResult) {
      showRollResult({
        title: `Recipe Cooking: ${selectedRecipe.name}`,
        rollValue: d20Roll,
        modifier: skillModifier,
        total: totalRoll,
        isCriticalSuccess,
        isCriticalFailure,
        type: "recipe",
        description: `Quality Achieved: ${
          achievedQuality.charAt(0).toUpperCase() + achievedQuality.slice(1)
        }`,
        inventoryAdded,
        recipeQuality: achievedQuality,
        recipeName: selectedRecipe.name,
      });
    } else {
      const criticalText = isCriticalSuccess
        ? " - CRITICAL SUCCESS!"
        : isCriticalFailure
        ? " - CRITICAL FAILURE!"
        : "";
      const inventoryText = inventoryAdded ? " - Added to Inventory!" : "";
      alert(
        `Recipe Cooking: d20(${d20Roll}) + ${skillModifier} = ${totalRoll} - Quality: ${achievedQuality}${criticalText}${inventoryText}`
      );
    }

    let embedColor = 0x6b46c1;
    let resultText = "";

    switch (achievedQuality) {
      case "superior":
        embedColor = 0x8b5cf6;
        break;
      case "exceptional":
        embedColor = 0x3b82f6;
        break;
      case "regular":
        embedColor = 0x10b981;
        break;
      case "flawed":
        embedColor = 0xf59e0b;
        break;
      case "ruined":
        embedColor = 0xef4444;
        break;
      default:
        embedColor = 0x6b7280;
        break;
    }

    if (isCriticalSuccess) {
      embedColor = 0xffd700;
      resultText = " - **CRITICAL SUCCESS!** 🎉";
    } else if (isCriticalFailure) {
      embedColor = 0xff0000;
      resultText = " - **CRITICAL FAILURE!** 💥";
    }

    const ruinedMessages = [
      "The kitchen survived... barely!",
      "Cooking is an art, and this was... abstract!",
      "Even master chefs burn the toast sometimes!",
      "The ingredients had their own plans today.",
      "That's why they invented takeout!",
      "Better luck next meal!",
      "The recipe became a learning experience!",
      "Innovation often looks like chaos at first!",
    ];

    const randomRuinedMessage =
      ruinedMessages[Math.floor(Math.random() * ruinedMessages.length)];

    const message = {
      embeds: [
        {
          title: `${character.name} Cooked a Recipe: ${selectedRecipe.name}${resultText}`,
          description: achievedQuality === "ruined" ? randomRuinedMessage : "",
          color: embedColor,
          fields: [
            {
              name: "Roll Details",
              value: `Roll: ${d20Roll} ${
                skillModifier >= 0 ? "+" : ""
              }${skillModifier} = **${totalRoll}**${
                isCriticalSuccess
                  ? "\n✨ **Achieved maximum possible quality!**"
                  : isCriticalFailure
                  ? "\n💀 **Spectacular cooking failure!**"
                  : ""
              }`,
              inline: false,
            },
            {
              name: "Quality Achieved",
              value: `${
                achievedQuality.charAt(0).toUpperCase() +
                achievedQuality.slice(1)
              }${inventoryAdded ? " (Added to Inventory)" : ""}`,
              inline: true,
            },
            {
              name: "Eating Time",
              value: selectedRecipe.eatingTime,
              inline: true,
            },
            {
              name: "Duration",
              value: selectedRecipe.duration,
              inline: true,
            },
            {
              name: "Recipe Effect",
              value: selectedRecipe.description,
              inline: false,
            },
            {
              name: `${
                achievedQuality.charAt(0).toUpperCase() +
                achievedQuality.slice(1)
              } Quality Effect`,
              value:
                selectedRecipe.qualities[achievedQuality] ||
                "No effect available",
              inline: false,
            },
          ],
          footer: {
            text: `Witches and Snitches - Recipe Cooking • Today at ${new Date().toLocaleTimeString(
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

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
    }

    return cookingResult;
  } catch (error) {
    console.error("Error cooking recipe:", error);
    return null;
  } finally {
    setIsRolling(false);
  }
};

export const rollAbilityStat = () => {
  const roller = new DiceRoller();
  const result = roller.roll("4d6kh3");
  return result.total;
};

export const rollSavingThrow = async ({
  ability,
  isRolling,
  setIsRolling,
  character,
  savingThrowModifier,
  showRollResult,
}) => {
  if (isRolling) return;

  setIsRolling(true);

  try {
    const diceResult = rollDice();
    const d20Roll = diceResult.total;
    const modifier = savingThrowModifier;
    const total = d20Roll + modifier;

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;

    if (showRollResult) {
      showRollResult({
        title: `${ability.name} Saving Throw`,
        rollValue: d20Roll,
        modifier: modifier,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "saving_throw",
        description: `Rolling ${ability.name} saving throw for ${character.name}`,
      });
    } else {
      const criticalText = isCriticalSuccess
        ? " - CRITICAL SUCCESS!"
        : isCriticalFailure
        ? " - CRITICAL FAILURE!"
        : "";
      alert(
        `${ability.name} Saving Throw: d20(${d20Roll}) + ${modifier} = ${total}${criticalText}`
      );
    }

    let embedColor = 0x8b5cf6;
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
          title: `${character.name} Rolled: ${ability.name} Saving Throw${resultText}`,
          description: `${
            isCriticalSuccess
              ? "Natural 20!"
              : isCriticalFailure
              ? "Natural 1!"
              : ""
          }`,
          color: embedColor,
          fields: [
            {
              name: "Roll Details",
              value: `Roll: ${d20Roll} ${
                modifier >= 0 ? "+" : ""
              }${modifier} = **${total}**${
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
            text: `Witches and Snitches - Saving Throw • Today at ${new Date().toLocaleTimeString(
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

export const rollResearch = async ({
  spellName,
  subject,
  selectedCharacter,
  dc,
  playerYear,
  spellYear,
  getSpellModifier,
  getModifierInfo,
  showRollResult,
}) => {
  try {
    let modifier = getSpellModifier(spellName, subject, selectedCharacter);

    let researcherBonus = 0;
    if (hasSubclassFeature(selectedCharacter, "Researcher")) {
      const researcherBonuses = getResearcherBonuses(selectedCharacter);
      researcherBonus = researcherBonuses.researchBonus;
      modifier += researcherBonus;
    }

    const diceResult = rollDice();
    const d20Roll = diceResult.total;
    const totalRoll = d20Roll + modifier;
    const isNaturalTwenty = d20Roll === 20;
    const isSuccess = totalRoll >= dc;

    const isCriticalSuccess = isNaturalTwenty;
    const isCriticalFailure = d20Roll === 1;

    if (showRollResult) {
      showRollResult({
        title: `Research: ${spellName}`,
        rollValue: d20Roll,
        modifier: modifier,
        total: totalRoll,
        isCriticalSuccess,
        isCriticalFailure,
        type: "research",
        description: `History of Magic check (DC ${dc}) for ${selectedCharacter.name}`,
      });
    }

    if (discordWebhookUrl) {
      let embedColor = isSuccess ? 0x10b981 : 0xef4444;
      let title = `${
        selectedCharacter?.name || "Unknown"
      } Researched: ${spellName}`;
      let resultText = "";

      if (isNaturalTwenty) {
        embedColor = 0xffd700;
        title = `⭐ ${
          selectedCharacter?.name || "Unknown"
        } Researched: ${spellName}`;
        resultText = "⭐ **EXCELLENT RESEARCH!** (Natural 20)";
      } else if (isSuccess) {
        resultText = "✅ **Research Successful!**";
      } else {
        resultText = "❌ **Research Failed**";
      }

      const fields = [
        {
          name: "Result",
          value: resultText,
          inline: true,
        },
        {
          name: "Roll Details",
          value: `**${d20Roll}** ${
            modifier >= 0 ? "+" : ""
          }${modifier} = **${totalRoll}** vs DC ${dc}`,
          inline: true,
        },
        {
          name: "Research Info",
          value: `Player Year: ${playerYear}\nSpell Year: ${spellYear}`,
          inline: true,
        },
      ];

      if (isSuccess) {
        if (isNaturalTwenty) {
          fields.push({
            name: "Special Benefit",
            value: "Gained deep understanding + 1 successful attempt!",
            inline: false,
          });
        } else {
          fields.push({
            name: "Benefit",
            value: "Spell marked as researched for future attempts",
            inline: false,
          });
        }

        if (hasSubclassFeature(selectedCharacter, "Researcher")) {
          fields.push({
            name: "📚 Researcher Enhancement",
            value:
              "This spell now gains both Arithmantic and Runic tags through extensive study!",
            inline: false,
          });
        }
      } else {
        fields.push({
          name: "Outcome",
          value: `${spellName} proved too difficult to understand at this time`,
          inline: false,
        });
      }

      if (modifier !== 0) {
        const modifierInfo = getModifierInfo(
          spellName,
          subject,
          selectedCharacter
        );

        let modifierBreakdown = `${modifierInfo.abilityName}: ${
          modifierInfo.abilityModifier >= 0 ? "+" : ""
        }${modifierInfo.abilityModifier}`;

        if (modifierInfo.wandModifier !== 0) {
          modifierBreakdown += `\nWand (${modifierInfo.wandType}): ${
            modifierInfo.wandModifier >= 0 ? "+" : ""
          }${modifierInfo.wandModifier}`;
        }

        if (
          hasSubclassFeature(selectedCharacter, "Researcher") &&
          researcherBonus > 0
        ) {
          modifierBreakdown += `\n📚 Researcher (½ Wis): +${researcherBonus}`;
        }

        fields.push({
          name: "Modifier Breakdown",
          value: modifierBreakdown,
          inline: false,
        });
      }

      const embed = {
        title: title,
        description: "",
        color: embedColor,
        fields: fields,
        timestamp: new Date().toISOString(),
        footer: {
          text: "Witches And Snitches - Spell Research",
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
      } catch (discordError) {
        console.error("Error sending to Discord:", discordError);
      }
    }

    return {
      d20Roll,
      modifier,
      totalRoll,
      dc,
      isSuccess,
      isNaturalTwenty,
      researcherBonus,
      rollMessage: `Research Check: ${d20Roll}${
        modifier >= 0 ? "+" : ""
      }${modifier} = ${totalRoll} vs DC ${dc}`,
    };
  } catch (error) {
    console.error("Error during research roll:", error);
    throw error;
  }
};

export const rollFlexibleDie = (diceType = 20, rollType = "normal") => {
  const roller = new DiceRoller();
  let notation;

  if (rollType === "advantage") {
    notation = `2d${diceType}kh1`;
  } else if (rollType === "disadvantage") {
    notation = `2d${diceType}kl1`;
  } else {
    notation = `1d${diceType}`;
  }

  const roll = roller.roll(notation);
  return {
    total: roll.total,
    notation: roll.notation,
    output: roll.output,
    diceType: diceType,
    rollType: rollType,
  };
};

export const rollFlexibleDice = async ({
  diceType = 20,
  rollType = "normal",
  modifier = 0,
  title = "Flexible Roll",
  description = "Rolling dice with modifier",
  character = null,
  isRolling,
  setIsRolling,
  showRollResult,
}) => {
  if (isRolling) return;

  setIsRolling(true);

  try {
    const diceResult = rollFlexibleDie(diceType, rollType);
    const diceRoll = diceResult.total;
    const mod = parseInt(modifier) || 0;
    const total = diceRoll + mod;

    const isCriticalSuccess = diceType === 20 && diceRoll === 20;
    const isCriticalFailure = diceType === 20 && diceRoll === 1;

    if (showRollResult) {
      showRollResult({
        title: title,
        rollValue: diceRoll,
        modifier: mod,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "flexible",
        description: description,
        diceType: diceType,
        rollType: rollType,
      });
    } else {
      const criticalText = isCriticalSuccess
        ? " - CRITICAL SUCCESS!"
        : isCriticalFailure
        ? " - CRITICAL FAILURE!"
        : "";
      const rollTypeText =
        rollType !== "normal" ? ` (${rollType.toUpperCase()})` : "";
      alert(
        `${title}: d${diceType}${rollTypeText}(${diceRoll}) + ${mod} = ${total}${criticalText}`
      );
    }

    let embedColor = 0xff9e3d;
    let resultText = "";

    if (isCriticalSuccess) {
      embedColor = 0xffd700;
      resultText = " - **CRITICAL SUCCESS!** 🎉";
    } else if (isCriticalFailure) {
      embedColor = 0xff0000;
      resultText = " - **CRITICAL FAILURE!** 💥";
    }

    const rollTitle = character
      ? `${character.name}: ${title}${resultText}`
      : `${title}${resultText}`;

    const rollTypeDescription =
      rollType !== "normal"
        ? ` (${rollType.charAt(0).toUpperCase() + rollType.slice(1)})`
        : "";

    const message = {
      embeds: [
        {
          title: rollTitle,
          description:
            rollType !== "normal"
              ? `${
                  rollType === "advantage" ? "🎯 Advantage" : "⚠️ Disadvantage"
                } Roll${rollType !== "normal" ? rollTypeDescription : ""}`
              : "",
          color: embedColor,
          fields: [
            {
              name: "Roll Details",
              value: `d${diceType}${rollTypeDescription}: ${diceRoll} ${
                mod >= 0 ? "+" : ""
              }${mod} = **${total}**${
                isCriticalSuccess
                  ? "\n✨ **Critical Success!**"
                  : isCriticalFailure
                  ? "\n💀 **Critical Failure!**"
                  : ""
              }`,
              inline: false,
            },
            {
              name: "Dice Formula",
              value: diceResult.notation,
              inline: true,
            },
          ],
          footer: {
            text: `Witches and Snitches - Flexible Roll • Today at ${new Date().toLocaleTimeString(
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

export const useRollFunctions = () => {
  const { showRollResult } = useRollModal();
  return {
    rollAbility: (params) => rollAbility({ ...params, showRollResult }),
    rollInitiative: (params) => rollInitiative({ ...params, showRollResult }),
    rollSkill: (params) => rollSkill({ ...params, showRollResult }),
    attemptSpell: (params) => attemptSpell({ ...params, showRollResult }),
    attemptArithmancySpell: (params) =>
      attemptArithmancySpell({ ...params, showRollResult }),
    attemptRunesSpell: (params) =>
      attemptRunesSpell({ ...params, showRollResult }),
    rollBrewPotion: (params) => rollBrewPotion({ ...params, showRollResult }),
    rollGenericD20: (params) => rollGenericD20({ ...params, showRollResult }),
    rollSavingThrow: (params) => rollSavingThrow({ ...params, showRollResult }),
    rollResearch: (params) => rollResearch({ ...params, showRollResult }),
    rollFlexibleDice: (params) =>
      rollFlexibleDice({ ...params, showRollResult }),
    rollCorruption: (params) => rollCorruption({ ...params, showRollResult }),
    rollCookRecipe: (params) => rollCookRecipe({ ...params, showRollResult }),
  };
};
