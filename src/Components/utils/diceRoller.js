import React, { useState, createContext, useContext } from "react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { X, Dice6 } from "lucide-react";
import { getModifierInfo } from "../SpellBook/utils";
import { spellsData } from "../../SharedData/spells";
import { getDiscordWebhook } from "../../App/const";
import {
  sendDiscordRollWebhook,
  getRollResultColor,
  getRollResultText,
  buildModifierBreakdownField,
  ROLL_COLORS,
} from "./discordWebhook";

const RollModalContext = createContext();

export const hasSubclassFeature = (character, featureName) => {
  return character?.subclassFeatures?.includes(featureName) || false;
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
    diceQuantity = 1,
    diceType = 20,
    individualDiceResults,
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

  const getDiceFormula = () => {
    if (type === "flexible") {
      const advantageText =
        rollType !== "normal" ? ` (${rollType.toUpperCase()})` : "";
      return `${diceQuantity}d${diceType}${advantageText}`;
    }
    return null;
  };

  const renderIndividualDiceResults = () => {
    if (
      !individualDiceResults ||
      !individualDiceResults.keptDice ||
      individualDiceResults.keptDice.length <= 1
    ) {
      return null;
    }

    const {
      keptDice,
      discardedDice,
      rollType: diceRollType,
    } = individualDiceResults;

    return (
      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderRadius: "8px",
          border: `1px solid ${borderColor}30`,
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#6b7280",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Individual Dice Results
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            justifyContent: "center",
          }}
        >
          {keptDice.map((die, index) => (
            <div
              key={`kept-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                backgroundColor: getDiceColor(),
                color: "white",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "700",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              {die}
            </div>
          ))}

          {discardedDice.length > 0 && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "0 4px",
                }}
              >
                |
              </div>
              {discardedDice.map((die, index) => (
                <div
                  key={`discarded-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#9ca3af",
                    color: "white",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "700",
                    opacity: 0.6,
                    textDecoration: "line-through",
                  }}
                >
                  {die}
                </div>
              ))}
            </>
          )}
        </div>

        {(diceRollType === "advantage" || diceRollType === "disadvantage") &&
          discardedDice.length > 0 && (
            <div
              style={{
                fontSize: "10px",
                color: "#6b7280",
                textAlign: "center",
                marginTop: "6px",
              }}
            >
              {diceRollType === "advantage"
                ? "Highest dice kept"
                : "Lowest dice kept"}{" "}
              | Crossed out dice discarded
            </div>
          )}

        {diceRollType === "normal" && keptDice.length > 1 && (
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              textAlign: "center",
              marginTop: "6px",
            }}
          >
            Sum: {keptDice.join(" + ")} = {rollValue}
          </div>
        )}
      </div>
    );
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
              {getDiceFormula() && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    fontWeight: "500",
                    marginTop: "2px",
                    fontFamily: "monospace",
                  }}
                >
                  {getDiceFormula()}
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
            {total}
          </div>
          <div
            style={{
              fontSize: "18px",
              color: textColor,
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            {rollValue} +{modifier} = {total}
          </div>
          {(isCriticalSuccess || isCriticalFailure) && (
            <div
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: isCriticalSuccess ? "#f59e0b" : "#ef4444",
                marginTop: "8px",
              }}
            >
              {isCriticalSuccess
                ? "✨ CRITICAL SUCCESS!"
                : "💥 CRITICAL FAILURE!"}
            </div>
          )}

          {renderIndividualDiceResults()}
        </div>

        {description && (
          <div
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: "8px",
            }}
          >
            {description}
          </div>
        )}

        {potionQuality && (
          <div
            style={{
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "600",
              color: getQualityColor(potionQuality),
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "8px",
              border: `2px solid ${getQualityColor(potionQuality)}40`,
            }}
          >
            Potion Quality:{" "}
            {potionQuality.charAt(0).toUpperCase() + potionQuality.slice(1)}
            {inventoryAdded && (
              <div
                style={{ fontSize: "12px", color: "#059669", marginTop: "4px" }}
              >
                ✅ Added to inventory
              </div>
            )}
          </div>
        )}
        {recipeQuality && (
          <div
            style={{
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "600",
              color: getQualityColor(recipeQuality),
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "8px",
              border: `2px solid ${getQualityColor(recipeQuality)}40`,
            }}
          >
            Recipe Quality:{" "}
            {recipeQuality.charAt(0).toUpperCase() + recipeQuality.slice(1)}
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px 20px",
            backgroundColor: getDiceColor(),
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const rollCorruption = async ({
  character,
  pointsGained,
  pointsRedeemed,
  pointsSpent,
  reason,
  pointsTotal,
  pointsRemaining,
  type = "gained",
}) => {
  try {
    const discordWebhookUrl = getDiscordWebhook(character?.gameSession);
    if (!discordWebhookUrl) {
      console.error("Discord webhook URL not configured");
      return;
    }

    const usedFor =
      reason?.trim() ||
      (type === "gained"
        ? "Dark deed"
        : type === "spent"
        ? "Dark power unleashed"
        : "Act of redemption");

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

    let embed;

    if (type === "gained") {
      embed = {
        title: `${character.name} Corruption Gained`,
        color: currentTier.color,
        fields: [
          {
            name: "Gained",
            value: `+${pointsGained}`,
            inline: true,
          },
          {
            name: "Total",
            value: pointsTotal.toString(),
            inline: true,
          },
          {
            name: "Tier",
            value: `${currentTier.name} (DC ${currentTier.saveDC})`,
            inline: true,
          },
          {
            name: "Reason",
            value: usedFor,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: character.name,
        },
      };
    } else if (type === "spent") {
      embed = {
        title: `${character.name} Corruption Spent`,
        color: 0x8b5cf6,
        fields: [
          {
            name: "Spent",
            value: `-${pointsSpent}`,
            inline: true,
          },
          {
            name: "Remaining",
            value: pointsRemaining.toString(),
            inline: true,
          },
          {
            name: "Tier",
            value: `${currentTier.name} (DC ${currentTier.saveDC})`,
            inline: true,
          },
          {
            name: "Used For",
            value: usedFor,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: character.name,
        },
      };
    } else {
      embed = {
        title: "✨ Corruption Redeemed",
        color: finalPoints === 0 ? 0x10b981 : currentTier.color,
        fields: [
          {
            name: "Redeemed",
            value: `-${pointsRedeemed}`,
            inline: true,
          },
          {
            name: "Remaining",
            value: pointsRemaining.toString(),
            inline: true,
          },
          {
            name: "Tier",
            value: `${currentTier.name} (DC ${currentTier.saveDC})`,
            inline: true,
          },
          {
            name: "Reason",
            value: usedFor,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: character.name,
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

    if (type === "gained" || type === "spent") {
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
    } else if (type === "redeemed") {
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

export const applyHornedSerpentBonus = (
  modifier,
  character,
  abilityType,
  hasProficiency
) => {
  if (character?.house !== "Horned Serpent") {
    return { modifier, bonusApplied: false };
  }

  const isIntOrChaCheck =
    abilityType === "intelligence" || abilityType === "charisma";

  if (isIntOrChaCheck && !hasProficiency) {
    const profBonus = character.proficiencyBonus || 0;
    const scholarBonus = Math.floor(profBonus / 2);
    return {
      modifier: modifier + scholarBonus,
      bonusApplied: true,
      bonusAmount: scholarBonus,
    };
  }

  return { modifier, bonusApplied: false };
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

    const hornedSerpentResult = applyHornedSerpentBonus(
      modifier,
      character,
      abilityType,
      hasProficiency
    );
    const finalModifier = hornedSerpentResult.modifier;
    const total = adjustedRoll + finalModifier;

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;

    if (showRollResult) {
      showRollResult({
        title: title,
        rollValue: adjustedRoll,
        originalRoll: d20Roll,
        modifier: finalModifier,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "ability",
        character: character,
        description: `Rolling ${title} for ${character.name}`,
        ravenclawBonusApplied: diceResult.ravenclawBonusApplied,
        hornedSerpentBonusApplied: hornedSerpentResult.bonusApplied,
        hornedSerpentBonusAmount: hornedSerpentResult.bonusAmount || 0,
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

      const hornedSerpentText = hornedSerpentResult.bonusApplied
        ? ` (Scholar's Mind: +${hornedSerpentResult.bonusAmount})`
        : "";

      alert(
        `${title}: d20(${adjustedRoll})${ravenclawText}${hornedSerpentText} + ${finalModifier} = ${total}${criticalText}`
      );
    }
  } catch (error) {
    console.error("Error with ability check:", error);
  } finally {
    setIsRolling(false);
  }
};

export const rollMagicCasting = async ({
  school,
  type,
  modifier,
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
    const total = d20Roll + modifier;

    const isCriticalSuccess = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;

    if (showRollResult) {
      showRollResult({
        title: `${school} ${type} Roll`,
        rollValue: d20Roll,
        modifier: modifier,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "spell",
        character: character,
        description: `Rolling ${school} ${type} check for ${character.name}`,
      });
    } else {
      const criticalText = isCriticalSuccess
        ? " - CRITICAL SUCCESS!"
        : isCriticalFailure
        ? " - CRITICAL FAILURE!"
        : "";
      alert(
        `${school} ${type} Roll: d20(${d20Roll}) + ${modifier} = ${total}${criticalText}`
      );
    }

    const schoolColors = {
      Divinations: 0xf59e0b,
      Transfig: 0x10b981,
      Charms: 0x3b82f6,
      Healing: 0xef4444,
      JHC: 0x8330ee,
    };

    const rollResult = {
      d20Roll,
      modifier,
      total,
      isCriticalSuccess,
      isCriticalFailure,
    };

    const additionalFields = [
      {
        name: "Magic School",
        value: school,
        inline: true,
      },
      {
        name: "Cast Type",
        value: type,
        inline: true,
      },
    ];

    const success = await sendDiscordRollWebhook({
      character,
      rollType: "Magic Casting",
      title: `${character.name}: ${school} ${type}`,
      description: isCriticalSuccess
        ? "Natural 20! Exceptional magical prowess!"
        : isCriticalFailure
        ? "Natural 1! Magic went awry!"
        : "",
      embedColor: getRollResultColor(
        rollResult,
        schoolColors[school] || ROLL_COLORS.magic_casting
      ),
      rollResult,
      fields: additionalFields,
      useCharacterAvatar: true,
    });

    if (!success) {
      alert("Failed to send roll to Discord");
    }
  } catch (error) {
    console.error("Error sending Discord message:", error);
    alert("Failed to send roll to Discord");
  } finally {
    setIsRolling(false);
  }
};

export const rollMagicalTheoryCheck = async ({
  character,
  showRollResult,
  supabase,
  discordUserId,
  setIsRolling,
  isRolling,
  customRoll = null,
  isForSpellDice = null,
}) => {
  if (isRolling) return;

  if (isForSpellDice === false) {
    return rollSkill({
      skill: { name: "magicalTheory", displayName: "Magical Theory" },
      abilityMod: Math.floor((character.intelligence - 10) / 2),
      character,
      showRollResult,
      setIsRolling,
      isRolling,
    });
  }

  if (isForSpellDice === null) {
    console.warn(
      "rollMagicalTheoryCheck called without isForSpellDice parameter. Modal should be shown by caller."
    );
    return;
  }

  setIsRolling(true);

  try {
    const intelligenceMod = Math.floor((character.intelligence - 10) / 2);
    const proficiencyBonus = character.proficiencyBonus || 2;

    const hasProficiency =
      character.skillProficiencies?.includes("Magical Theory") ||
      character.skill_proficiencies?.includes("Magical Theory") ||
      character.skills?.magicalTheory >= 1;

    const modifier = intelligenceMod + (hasProficiency ? proficiencyBonus : 0);

    let d20Roll;
    if (customRoll !== null) {
      d20Roll = customRoll;
    } else {
      const diceResult = rollDice();
      d20Roll = diceResult.total;
    }

    const total = d20Roll + modifier;
    const isNaturalTwenty = d20Roll === 20;
    const isCriticalFailure = d20Roll === 1;

    let bonusDie = null;
    let dcMet = null;
    let diceDescription = "";

    if (isCriticalFailure) {
      bonusDie = null;
      diceDescription = "No bonus die earned (Natural 1)";
    } else if (isNaturalTwenty) {
      bonusDie = "1d10";
      dcMet = "Natural 20";
      diceDescription = "Superior Magical Theory Understanding!";
    } else if (total >= 20) {
      bonusDie = "1d8";
      dcMet = "DC 20";
      diceDescription = "Excellent Magical Theory Knowledge!";
    } else if (total >= 15) {
      bonusDie = "1d6";
      dcMet = "DC 15";
      diceDescription = "Good Magical Theory Knowledge!";
    } else if (total >= 10) {
      bonusDie = "1d4";
      dcMet = "DC 10";
      diceDescription = "Basic Magical Theory Knowledge!";
    } else {
      bonusDie = null;
      diceDescription = "Failed to meet DC 10";
    }

    let resourcesUpdated = false;
    if (bonusDie && supabase && character.id) {
      try {
        const { data: existingResources, error: fetchError } = await supabase
          .from("character_resources")
          .select("spell_bonus_dice")
          .eq("character_id", character.id)
          .eq("discord_user_id", discordUserId || character.discord_user_id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error fetching character resources:", fetchError);
        } else {
          let currentDiceArray = [];
          if (existingResources?.spell_bonus_dice) {
            if (typeof existingResources.spell_bonus_dice === "string") {
              currentDiceArray = [existingResources.spell_bonus_dice];
            } else if (Array.isArray(existingResources.spell_bonus_dice)) {
              currentDiceArray = [...existingResources.spell_bonus_dice];
            }
          }

          currentDiceArray.push(bonusDie);

          const updateData = {
            spell_bonus_dice: currentDiceArray,
          };

          if (existingResources) {
            const { error: updateError } = await supabase
              .from("character_resources")
              .update(updateData)
              .eq("character_id", character.id)
              .eq(
                "discord_user_id",
                discordUserId || character.discord_user_id
              );

            if (!updateError) {
              resourcesUpdated = true;
            } else {
              console.error("Error updating character resources:", updateError);
            }
          } else {
            const { error: insertError } = await supabase
              .from("character_resources")
              .insert({
                character_id: character.id,
                discord_user_id: discordUserId || character.discord_user_id,
                spell_bonus_dice: [bonusDie],
              });

            if (!insertError) {
              resourcesUpdated = true;
            } else {
              console.error(
                "Error inserting character resources:",
                insertError
              );
            }
          }
        }
      } catch (error) {
        console.error("Error updating character resources:", error);
      }
    }

    if (showRollResult) {
      showRollResult({
        title: "Magical Theory Check (Spell Bonus)",
        rollValue: d20Roll,
        modifier: modifier,
        total: total,
        isCriticalSuccess: isNaturalTwenty,
        isCriticalFailure: isCriticalFailure,
        type: "skill",
        character: character,
        description: `${diceDescription}${
          bonusDie ? ` - Earned ${bonusDie}!` : ""
        }${resourcesUpdated ? " (Added to dice pool)" : ""}`,
      });
    }

    const rollResult = {
      d20Roll,
      modifier,
      total,
      isCriticalSuccess: isNaturalTwenty,
      isCriticalFailure,
    };

    const additionalFields = [
      {
        name: "Check Type",
        value: "Magical Theory (Spell Bonus Die)",
        inline: true,
      },
      {
        name: "Result",
        value: bonusDie
          ? `✅ Earned ${bonusDie} - ${dcMet}`
          : "❌ No bonus die earned",
        inline: true,
      },
    ];

    if (resourcesUpdated) {
      additionalFields.push({
        name: "Resources",
        value: "✨ Bonus die added to dice pool!",
        inline: false,
      });
    }

    await sendDiscordRollWebhook({
      character,
      rollType: "Magical Theory Check",
      title: `${character.name}: Magical Theory Check`,
      description: isNaturalTwenty
        ? "Natural 20!"
        : isCriticalFailure
        ? "Natural 1!"
        : bonusDie
        ? `Success! Earned ${bonusDie}`
        : "Failed to earn bonus die",
      embedColor: bonusDie ? 0x00ff00 : 0xff0000,
      rollResult,
      fields: additionalFields,
      useCharacterAvatar: true,
    });

    return {
      success: true,
      bonusDie,
      dcMet,
      total,
      resourcesUpdated,
    };
  } catch (error) {
    console.error("Error with Magical Theory check:", error);
    alert("Error performing Magical Theory check. Please try again.");
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

    const rollResult = {
      d20Roll: adjustedRoll,
      modifier: abilityMod,
      total,
      isCriticalSuccess,
      isCriticalFailure,
    };

    let additionalFields = [];

    if (diceResult.ravenclawBonusApplied) {
      additionalFields.push({
        name: "Special Abilities",
        value: `🦅 **Ravenclaw In-Depth Knowledge!**\nRoll: ${d20Roll} → ${adjustedRoll}\n🎓 *In-Depth Knowledge bonus applied!*`,
        inline: false,
      });
    }

    const success = await sendDiscordRollWebhook({
      character,
      rollType: "Ability Check",
      title: `${character.name}: ${ability.name} Check`,
      description: isCriticalSuccess
        ? "Natural 20!"
        : isCriticalFailure
        ? "Natural 1!"
        : "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.ability),
      rollResult,
      fields: additionalFields,
      useCharacterAvatar: true,
    });

    if (!success) {
      alert("Failed to send roll to Discord");
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

    const rollResult = {
      d20Roll,
      modifier: mod,
      total,
      isCriticalSuccess,
      isCriticalFailure,
    };

    const rollTitle = character ? title : `${title}`;

    const success = await sendDiscordRollWebhook({
      character,
      rollType: "Generic Roll",
      title: rollTitle,
      description: "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.generic),
      rollResult,
      fields: [],
      useCharacterAvatar: !!character,
    });

    if (!success) {
      alert("Failed to send roll to Discord");
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
          value: null,
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

    const rollResult = {
      d20Roll,
      modifier: skillModifier,
      total: totalRoll,
      isCriticalSuccess,
      isCriticalFailure,
    };

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

    const additionalFields = [
      {
        name: "Quality Achieved",
        value: `${
          achievedQuality.charAt(0).toUpperCase() + achievedQuality.slice(1)
        }${inventoryAdded ? " (Added to Inventory)" : ""}`,
        inline: true,
      },
      {
        name: "Potion Effect",
        value: selectedPotion.description,
        inline: false,
      },
    ];

    const success = await sendDiscordRollWebhook({
      character,
      rollType: "Potion Brewing",
      title: `${character.name} brewed: ${selectedPotion.name}`,
      description: achievedQuality === "ruined" ? randomRuinedMessage : "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.potion),
      rollResult,
      fields: additionalFields,
      useCharacterAvatar: true,
    });

    if (!success) {
      console.error("Failed to send potion brewing result to Discord");
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

    const rollResult = {
      d20Roll,
      modifier: mod,
      total,
      isCriticalSuccess: false,
      isCriticalFailure: false,
    };

    const success = await sendDiscordRollWebhook({
      character,
      rollType: "Initiative",
      title: `${character.name}: Initiative`,
      description: "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.initiative),
      rollResult,
      fields: [],
      useCharacterAvatar: true,
    });

    if (!success) {
      alert("Failed to send roll to Discord");
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

    const rollResult = {
      d20Roll: adjustedRoll,
      modifier: skillBonus,
      total,
      isCriticalSuccess,
      isCriticalFailure,
    };

    let additionalFields = [];

    if (diceResult.ravenclawBonusApplied) {
      additionalFields.push({
        name: "Special Abilities",
        value: `🦅 **Ravenclaw In-Depth Knowledge!**\nRoll: ${d20Roll} → ${adjustedRoll}\n🎓 *In-Depth Knowledge bonus applied!*`,
        inline: false,
      });
    }

    const success = await sendDiscordRollWebhook({
      character,
      rollType: "Skill Check",
      title: `${character.name}: ${skill.displayName}`,
      description: isCriticalSuccess
        ? "Natural 20!"
        : isCriticalFailure
        ? "Natural 1!"
        : "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.skill),
      rollResult,
      fields: additionalFields,
      useCharacterAvatar: true,
    });

    if (!success) {
      alert("Failed to send roll to Discord");
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

const getSpellData = (spellName) => {
  if (!spellName) return null;

  for (const [subject, subjectData] of Object.entries(spellsData)) {
    if (subjectData.levels) {
      for (const [, levelSpells] of Object.entries(subjectData.levels)) {
        const spell = levelSpells.find((s) => s.name === spellName);
        if (spell) {
          return {
            ...spell,
            subject: subject,
          };
        }
      }
    }
  }
  return null;
};

export const getCharacterSpellBonusDice = async (
  supabase,
  characterId,
  discordUserId
) => {
  const { data, error } = await supabase
    .from("character_resources")
    .select("spell_bonus_dice")
    .eq("character_id", characterId)
    .eq("discord_user_id", discordUserId)
    .single();

  if (error || !data?.spell_bonus_dice) {
    return null;
  }

  if (typeof data.spell_bonus_dice === "string") {
    return [data.spell_bonus_dice];
  } else if (Array.isArray(data.spell_bonus_dice)) {
    return data.spell_bonus_dice.length > 0 ? data.spell_bonus_dice : null;
  }

  return null;
};

export const removeSpellBonusDie = async (
  supabase,
  characterId,
  discordUserId,
  dieToRemove
) => {
  try {
    const { data: existingResources, error: fetchError } = await supabase
      .from("character_resources")
      .select("spell_bonus_dice")
      .eq("character_id", characterId)
      .eq("discord_user_id", discordUserId)
      .single();

    if (fetchError) {
      console.error("Error fetching character resources:", fetchError);
      return false;
    }

    let currentDiceArray = [];
    if (existingResources?.spell_bonus_dice) {
      if (typeof existingResources.spell_bonus_dice === "string") {
        currentDiceArray = [existingResources.spell_bonus_dice];
      } else if (Array.isArray(existingResources.spell_bonus_dice)) {
        currentDiceArray = [...existingResources.spell_bonus_dice];
      }
    }

    const indexToRemove = currentDiceArray.indexOf(dieToRemove);
    if (indexToRemove > -1) {
      currentDiceArray.splice(indexToRemove, 1);
    }

    const { error: updateError } = await supabase
      .from("character_resources")
      .update({
        spell_bonus_dice: currentDiceArray.length > 0 ? currentDiceArray : null,
      })
      .eq("character_id", characterId)
      .eq("discord_user_id", discordUserId);

    if (updateError) {
      console.error("Error updating spell bonus dice:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error removing spell bonus die:", error);
    return false;
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
  setFailedAttempts,
  updateSpellProgressSummary,
  customRoll = null,
  supabase,
  showBonusDiceModal,
  hideBonusDiceModal,
}) => {
  if (!selectedCharacter || !discordUserId) {
    alert("Please select a character first!");
    return;
  }

  const spellData = getSpellData(spellName);

  setAttemptingSpells((prev) => ({ ...prev, [spellName]: true }));

  try {
    let d20Roll, diceResult;
    if (customRoll !== null) {
      d20Roll = customRoll;
      diceResult = { total: customRoll, originalRoll: customRoll };
    } else {
      diceResult = rollDice();
      d20Roll = diceResult.total;
    }

    const totalModifier = getSpellModifier(
      spellName,
      subject,
      selectedCharacter
    );
    let total = d20Roll + totalModifier;

    const spellLevel = getSpellLevel(spellName, subject);
    const goal = getSpellCastingDC(spellLevel);

    let isCriticalSuccess = d20Roll === 20;
    let isCriticalFailure = d20Roll === 1;
    let isSuccess = (total >= goal || isCriticalSuccess) && !isCriticalFailure;

    let bonusDiceUsed = null;
    let bonusDiceRoll = null;
    let bonusDiceTotal = null;

    if (!isSuccess && !isCriticalFailure && customRoll === null && supabase) {
      const availableDice = await getCharacterSpellBonusDice(
        supabase,
        selectedCharacter.id,
        discordUserId
      );

      if (availableDice) {
        const userWantsToUseDice = await new Promise((resolve) => {
          showBonusDiceModal({
            availableDice,
            spellName,
            originalRoll: d20Roll,
            originalModifier: totalModifier,
            originalTotal: total,
            targetDC: goal,
            onConfirm: async (selectedDie) => {
              hideBonusDiceModal();
              resolve(selectedDie);
            },
            onClose: () => {
              hideBonusDiceModal();
              resolve(null);
            },
          });
        });

        if (userWantsToUseDice) {
          const roller = new DiceRoller();
          const bonusRoll = roller.roll(userWantsToUseDice);
          bonusDiceRoll = bonusRoll.total;
          bonusDiceUsed = userWantsToUseDice;

          bonusDiceTotal = total + bonusDiceRoll;
          total = bonusDiceTotal;

          isSuccess = total >= goal && !isCriticalFailure;

          await removeSpellBonusDie(
            supabase,
            selectedCharacter.id,
            discordUserId,
            userWantsToUseDice
          );
        }
      }
    }

    if (showRollResult) {
      let description = `Attempting to cast ${spellName} (Level ${spellLevel}, DC ${goal}) for ${
        selectedCharacter.name
      }${customRoll !== null ? " using assigned die" : ""}`;

      if (bonusDiceUsed) {
        description += `\n🎲 Bonus Die Used: ${bonusDiceUsed} rolled ${bonusDiceRoll}!`;
      }

      showRollResult({
        title: `${spellName} Attempt${bonusDiceUsed ? " (With Bonus)" : ""}`,
        rollValue: d20Roll,
        modifier: totalModifier + (bonusDiceRoll || 0),
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "spell",
        description: description,
      });
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
    } else {
      setFailedAttempts((prev) => ({
        ...prev,
        [spellName]: true,
      }));
    }

    let rollDetailsDisplay;
    if (bonusDiceUsed && bonusDiceRoll !== null) {
      const modifierDisplay =
        totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;
      rollDetailsDisplay = `${d20Roll}${modifierDisplay}+${bonusDiceRoll} = ${total}`;
    } else {
      const modifierDisplay =
        totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;
      rollDetailsDisplay = `${d20Roll}${modifierDisplay} = ${total}`;
    }

    const rollResult = {
      d20Roll,
      modifier: totalModifier,
      total,
      isCriticalSuccess,
      isCriticalFailure,
      isSuccess,
      customRoll,
      bonusDiceUsed,
      bonusDiceRoll,

      rollDetailsDisplay: rollDetailsDisplay,
    };

    let title = `${selectedCharacter.name} attempted: ${spellName}`;
    if (bonusDiceUsed) {
      title += ` (Bonus ${bonusDiceUsed})`;
    }
    if (isCriticalSuccess) {
      title = `⭐ ${title}`;
    } else if (isCriticalFailure) {
      title = `💥 ${title}`;
    }

    const additionalFields = [
      {
        name: "Result",
        value: getRollResultText(rollResult),
        inline: true,
      },
      {
        name: "Spell Info",
        value: `Level ${spellLevel} (DC ${goal})`,
        inline: true,
      },
    ];

    if (bonusDiceUsed) {
      additionalFields.push({
        name: "Magical Theory Bonus",
        value: `🎲 ${bonusDiceUsed} rolled **${bonusDiceRoll}**`,
        inline: false,
      });
    }

    if (selectedCharacter) {
      const modifierInfo = getModifierInfo(
        spellName,
        subject,
        selectedCharacter
      );
      additionalFields.push(buildModifierBreakdownField(modifierInfo));
    }

    const success = await sendDiscordRollWebhook({
      character: selectedCharacter,
      rollType: "Spellcasting",
      title,
      description: "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.spell),
      rollResult,
      fields: additionalFields,
      useCharacterAvatar: true,
    });

    if (!success) {
      console.error("Failed to send spell attempt to Discord");
    }

    await updateSpellProgressSummary(spellName, isSuccess, isCriticalSuccess);

    return {
      isSuccess,
      isCriticalSuccess,
      isNaturalTwenty: isCriticalSuccess,
      d20Roll,
      total,
      goal,
      bonusDiceUsed,
      bonusDiceRoll,
    };
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
  setFailedAttempts,
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
    } else {
      setFailedAttempts((prev) => ({
        ...prev,
        [spellName]: true,
      }));
    }

    const rollResult = {
      d20Roll,
      modifier: totalModifier,
      total,
      isCriticalSuccess,
      isCriticalFailure,
      isSuccess,
    };

    let title = `${selectedCharacter.name} attempted: ${spellName}`;
    if (isCriticalSuccess) {
      title = `${selectedCharacter.name} attempted: ${spellName}`;
    } else if (isCriticalFailure) {
      title = `${selectedCharacter.name} attempted: ${spellName}`;
    }

    const additionalFields = [
      {
        name: "Result",
        value: getRollResultText(rollResult),
        inline: true,
      },
      {
        name: "Casting Method",
        value: `Arithmancy Cast (Level ${spellLevel}, DC ${goal})`,
        inline: true,
      },
      buildModifierBreakdownField({
        abilityName: "Intelligence",
        abilityModifier: intModifier,
        wandType: modifierInfo.wandType,
        wandModifier: wandModifier,
      }),
    ];

    const success = await sendDiscordRollWebhook({
      character: selectedCharacter,
      rollType: "Arithmancy Spellcasting",
      title,
      description: "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.spell),
      rollResult,
      fields: additionalFields,
      useCharacterAvatar: true,
    });

    if (!success) {
      console.error("Failed to send Arithmancy spell to Discord");
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
  setFailedAttempts,
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
    } else {
      setFailedAttempts((prev) => ({
        ...prev,
        [spellName]: true,
      }));
    }

    const rollResult = {
      d20Roll,
      modifier: totalModifier,
      total,
      isCriticalSuccess,
      isCriticalFailure,
      isSuccess,
    };

    let title = `${selectedCharacter.name} attempted: ${spellName}`;
    if (isCriticalSuccess) {
      title = `${selectedCharacter.name} attempted: ${spellName}`;
    } else if (isCriticalFailure) {
      title = `${selectedCharacter.name} attempted: ${spellName}`;
    }

    const additionalFields = [
      {
        name: "Result",
        value: getRollResultText(rollResult),
        inline: true,
      },
      {
        name: "Casting Method",
        value: `Runic Cast (Level ${spellLevel}, DC ${goal})`,
        inline: true,
      },
      buildModifierBreakdownField({
        abilityName: "Wisdom",
        abilityModifier: wisModifier,
        wandType: modifierInfo.wandType,
        wandModifier: wandModifier,
      }),
    ];

    const success = await sendDiscordRollWebhook({
      character: selectedCharacter,
      rollType: "Runic Spellcasting",
      title,
      description: "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.spell),
      rollResult,
      fields: additionalFields,
      useCharacterAvatar: true,
    });

    if (!success) {
      console.error("Failed to send Runic spell to Discord");
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

      let maxQualityBonus = 0;
      if (isCulinarian) {
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
    if (addRecipeToInventory && supabase && currentCharacter && user) {
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

    const rollResult = {
      d20Roll,
      modifier: skillModifier,
      total: totalRoll,
      isCriticalSuccess,
      isCriticalFailure,
    };

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

    const additionalFields = [
      {
        name: "Quality Achieved",
        value: `${
          achievedQuality.charAt(0).toUpperCase() + achievedQuality.slice(1)
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
          achievedQuality.charAt(0).toUpperCase() + achievedQuality.slice(1)
        } Quality Effect`,
        value:
          selectedRecipe.qualities[achievedQuality] || "No effect available",
        inline: false,
      },
    ];

    const success = await sendDiscordRollWebhook({
      character,
      rollType: "Recipe Cooking",
      title: `${character.name} cooked: ${selectedRecipe.name}`,
      description: achievedQuality === "ruined" ? randomRuinedMessage : "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.recipe),
      rollResult,
      fields: additionalFields,
      useCharacterAvatar: true,
    });

    if (!success) {
      console.error("Failed to send recipe cooking result to Discord");
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

    const rollResult = {
      d20Roll,
      modifier,
      total,
      isCriticalSuccess,
      isCriticalFailure,
    };

    const success = await sendDiscordRollWebhook({
      character,
      rollType: "Saving Throw",
      title: `${character.name}: ${ability.name} Saving Throw`,
      description: isCriticalSuccess
        ? "Natural 20!"
        : isCriticalFailure
        ? "Natural 1!"
        : "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.saving_throw),
      rollResult,
      fields: [],
      useCharacterAvatar: true,
    });

    if (!success) {
      alert("Failed to send roll to Discord");
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
  customRoll = null,
}) => {
  try {
    let modifier = getSpellModifier(spellName, subject, selectedCharacter);

    let researcherBonus = 0;

    let d20Roll, diceResult;
    if (customRoll !== null) {
      d20Roll = customRoll;
      diceResult = { total: customRoll, originalRoll: customRoll };
    } else {
      diceResult = rollDice();
      d20Roll = diceResult.total;
    }

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
        description: `History of Magic check (DC ${dc}) for ${
          selectedCharacter.name
        }${customRoll !== null ? " using assigned die" : ""}`,
      });
    }

    const rollResult = {
      d20Roll,
      modifier,
      total: totalRoll,
      isCriticalSuccess,
      isCriticalFailure,
      isSuccess,
      customRoll,
    };

    let title = `${selectedCharacter.name} researched: ${spellName}`;
    let resultText = "";

    if (isNaturalTwenty) {
      title = `⭐ ${selectedCharacter.name} researched: ${spellName}`;
      resultText = "⭐ **EXCELLENT RESEARCH!** (Natural 20)";
    } else if (isSuccess) {
      resultText = "✅ **Research Successful!**";
    } else {
      resultText = "❌ **Research Failed**";
    }

    const additionalFields = [
      {
        name: "Result",
        value: resultText,
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
        additionalFields.push({
          name: "Special Benefit",
          value: "Gained deep understanding + 1 successful attempt!",
          inline: false,
        });
      } else {
        additionalFields.push({
          name: "Benefit",
          value: "Spell marked as researched for future attempts",
          inline: false,
        });
      }

      if (hasSubclassFeature(selectedCharacter, "Researcher")) {
        additionalFields.push({
          name: "📚 Researcher Enhancement",
          value:
            "This spell now gains both Arithmantic and Runic tags through extensive study!",
          inline: false,
        });
      }
    } else {
      additionalFields.push({
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
      additionalFields.push(buildModifierBreakdownField(modifierInfo));
    }

    const success = await sendDiscordRollWebhook({
      character: selectedCharacter,
      rollType: "Spell Research",
      title,
      description: "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.research),
      rollResult,
      fields: additionalFields,
      useCharacterAvatar: true,
    });

    if (!success) {
      console.error("Failed to send research to Discord");
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

export const rollFlexibleDie = (
  diceQuantity = 1,
  diceType = 20,
  rollType = "normal"
) => {
  const roller = new DiceRoller();
  let notation;

  if (rollType === "advantage") {
    notation = `${diceQuantity * 2}d${diceType}kh${diceQuantity}`;
  } else if (rollType === "disadvantage") {
    notation = `${diceQuantity * 2}d${diceType}kl${diceQuantity}`;
  } else {
    notation = `${diceQuantity}d${diceType}`;
  }

  const roll = roller.roll(notation);

  const individualDiceResults = extractIndividualDiceResults(
    roll,
    rollType,
    diceQuantity
  );

  return {
    total: roll.total,
    notation: roll.notation,
    output: roll.output,
    diceQuantity: diceQuantity,
    diceType: diceType,
    rollType: rollType,
    individualDiceResults: individualDiceResults,
  };
};

const extractIndividualDiceResults = (roll, rollType) => {
  try {
    if (roll.rolls && roll.rolls.length > 0) {
      const diceRoll = roll.rolls[0];

      if (diceRoll.rolls) {
        let individualResults = diceRoll.rolls.map((die) => die.value);

        if (rollType === "advantage" || rollType === "disadvantage") {
          const keptDice = diceRoll.rolls
            .filter((die) => !die.discarded)
            .map((die) => die.value);
          const discardedDice = diceRoll.rolls
            .filter((die) => die.discarded)
            .map((die) => die.value);

          return {
            allDice: individualResults,
            keptDice: keptDice,
            discardedDice: discardedDice,
            rollType: rollType,
          };
        } else {
          return {
            allDice: individualResults,
            keptDice: individualResults,
            discardedDice: [],
            rollType: rollType,
          };
        }
      }
    }

    return {
      allDice: [],
      keptDice: [],
      discardedDice: [],
      rollType: rollType,
    };
  } catch (error) {
    console.error("Error extracting individual dice results:", error);
    return {
      allDice: [],
      keptDice: [],
      discardedDice: [],
      rollType: rollType,
    };
  }
};

export const rollFlexibleDice = async ({
  diceQuantity = 1,
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
    const diceResult = rollFlexibleDie(diceQuantity, diceType, rollType);
    const diceRoll = diceResult.total;
    const mod = parseInt(modifier) || 0;
    const total = diceRoll + mod;

    const isCriticalSuccess =
      diceType === 20 && diceQuantity === 1 && diceRoll === 20;
    const isCriticalFailure =
      diceType === 20 && diceQuantity === 1 && diceRoll === 1;

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
        diceQuantity: diceQuantity,
        diceType: diceType,
        rollType: rollType,
        character: character,
        individualDiceResults: diceResult.individualDiceResults,
      });
    } else {
      const criticalText = isCriticalSuccess
        ? " - CRITICAL SUCCESS!"
        : isCriticalFailure
        ? " - CRITICAL FAILURE!"
        : "";
      const rollTypeText =
        rollType !== "normal" ? ` (${rollType.toUpperCase()})` : "";

      const individualDiceText =
        diceResult.individualDiceResults.keptDice.length > 1
          ? ` [${diceResult.individualDiceResults.keptDice.join(", ")}]`
          : "";

      alert(
        `${title}: ${diceQuantity}d${diceType}${rollTypeText}${individualDiceText}(${diceRoll}) + ${mod} = ${total}${criticalText}`
      );
    }

    const rollResult = {
      d20Roll: diceRoll,
      modifier: mod,
      total,
      isCriticalSuccess,
      isCriticalFailure,
    };

    const rollTitle = title;

    const rollTypeDescription =
      rollType !== "normal"
        ? ` (${rollType.charAt(0).toUpperCase() + rollType.slice(1)})`
        : "";

    const advantageInfo =
      rollType !== "normal"
        ? `${
            rollType === "advantage" ? "🎯 Advantage" : "⚠️ Disadvantage"
          } Roll`
        : "";

    const additionalFields = [
      {
        name: "Dice Formula",
        value: diceResult.notation,
        inline: true,
      },
    ];

    if (diceResult.individualDiceResults.keptDice.length > 1) {
      additionalFields.push({
        name: "Individual Dice",
        value: `[${diceResult.individualDiceResults.keptDice.join(", ")}]`,
        inline: true,
      });
    }

    const success = await sendDiscordRollWebhook({
      character,
      rollType: "Flexible Roll",
      title: rollTitle,
      description: advantageInfo,
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.flexible),
      rollResult,
      fields: additionalFields,
      useCharacterAvatar: !!character,
    });

    if (!success) {
      alert("Failed to send roll to Discord");
    }
  } catch (error) {
    console.error("Error sending Discord message:", error);
    alert("Failed to send roll to Discord");
  } finally {
    setIsRolling(false);
  }
};

export const rollLuckPoint = async ({
  character,
  pointsSpent,
  pointsRestored,
  reason,
  pointsRemaining,
  maxPoints,
  type = "spent",
}) => {
  try {
    const discordWebhookUrl = getDiscordWebhook(character?.gameSession);
    if (!discordWebhookUrl) {
      console.error("Discord webhook URL not configured");
      return;
    }

    const characterName = character?.name || "Unknown Character";
    const usedFor =
      reason?.trim() ||
      (type === "spent"
        ? "Luck manipulation"
        : type === "long_rest"
        ? "Long rest recovery"
        : "Luck point action");

    let title, description;
    const fields = [];

    if (type === "long_rest") {
      title = `🍀 ${characterName} recovered luck points!`;
      description = `${characterName} recovered all luck points during a long rest.`;

      if (pointsRestored > 0) {
        fields.push({
          name: "Points Recovered",
          value: `+${pointsRestored}`,
          inline: true,
        });
      }
    } else {
      title = `🍀 ${characterName} spent luck points!`;
      description = `${characterName} spent luck points for: ${usedFor}`;

      fields.push({
        name: "Points Spent",
        value: `-${pointsSpent}`,
        inline: true,
      });
    }

    fields.push({
      name: "Remaining Points",
      value: `${pointsRemaining}/${maxPoints}`,
      inline: true,
    });

    const embed = {
      title: title,
      description: description,
      color: ROLL_COLORS.levelup,
      fields: fields,
      footer: {
        text: `${characterName} - Witches and Snitches`,
      },
      timestamp: new Date().toISOString(),
    };

    if (character?.imageUrl) {
      embed.thumbnail = {
        url: character.imageUrl,
      };
    } else if (character?.image_url) {
      embed.thumbnail = {
        url: character.image_url,
      };
    }

    const message = {
      embeds: [embed],
    };

    const response = await fetch(discordWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error sending luck point Discord webhook:", error);
    return false;
  }
};

export const useRollFunctions = () => {
  const { showRollResult } = useRollModal();
  return {
    rollAbility: (params) => rollAbility({ ...params, showRollResult }),
    rollInitiative: (params) => rollInitiative({ ...params, showRollResult }),
    rollSkill: (params) => rollSkill({ ...params, showRollResult }),
    attemptSpell: (params) =>
      attemptSpell({
        ...params,
        showRollResult,
        customRoll: params.customRoll || null,
      }),
    attemptArithmancySpell: (params) =>
      attemptArithmancySpell({ ...params, showRollResult }),
    attemptRunesSpell: (params) =>
      attemptRunesSpell({ ...params, showRollResult }),
    rollBrewPotion: (params) => rollBrewPotion({ ...params, showRollResult }),
    rollGenericD20: (params) => rollGenericD20({ ...params, showRollResult }),
    rollSavingThrow: (params) => rollSavingThrow({ ...params, showRollResult }),
    rollResearch: (params) =>
      rollResearch({
        ...params,
        showRollResult,
        customRoll: params.customRoll || null,
      }),
    rollCorruption: (params) => rollCorruption({ ...params, showRollResult }),
    rollCookRecipe: (params) => rollCookRecipe({ ...params, showRollResult }),
    rollMagicCasting: (params) =>
      rollMagicCasting({ ...params, showRollResult }),
    rollFlexibleDice: (params) =>
      rollFlexibleDice({ ...params, showRollResult }),
    rollLuckPoint: (params) => rollLuckPoint({ ...params, showRollResult }),
    rollMagicalTheoryCheck: (params) =>
      rollMagicalTheoryCheck({ ...params, showRollResult }),
  };
};
