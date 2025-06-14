import { useState } from "react";
import { Heart, Dices, Plus, Minus, X, Coffee } from "lucide-react";
import { formatModifier } from "./utils";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const CharacterSheetModals = ({
  character,
  theme,
  discordUserId,
  supabase,
  discordWebhookUrl,
  characterModifiers,
  showRollResult,
  fetchCharacterDetails,
  showHitDiceModal,
  setShowHitDiceModal,
  selectedHitDiceCount,
  setSelectedHitDiceCount,
  isRollingHitDice,
  setIsRollingHitDice,
  showDamageModal,
  setShowDamageModal,
  damageAmount,
  setDamageAmount,
  isApplyingDamage,
  setIsApplyingDamage,
}) => {
  const rollHitDice = async () => {
    if (
      !character ||
      selectedHitDiceCount <= 0 ||
      selectedHitDiceCount > character.currentHitDice
    ) {
      return;
    }

    setIsRollingHitDice(true);

    try {
      const roller = new DiceRoller();
      const conModifier = characterModifiers.constitution;

      const diceNotation = `${selectedHitDiceCount}${character.hitDie}`;
      const rollResult = roller.roll(diceNotation);

      const totalHealing =
        rollResult.total + conModifier * selectedHitDiceCount;
      const actualHealing = Math.max(1, totalHealing);

      const newCurrentHP = Math.min(
        character.currentHitPoints + actualHealing,
        character.maxHitPoints
      );
      const hpGained = newCurrentHP - character.currentHitPoints;

      const newHitDiceCount = character.currentHitDice - selectedHitDiceCount;

      showRollResult({
        title: `Hit Dice Recovery`,
        rollValue: rollResult.total,
        modifier: conModifier * selectedHitDiceCount,
        total: actualHealing,
        isCriticalSuccess: false,
        isCriticalFailure: false,
        type: "hitdice",
        description: `${selectedHitDiceCount} × ${character.hitDie} + ${
          conModifier * selectedHitDiceCount
        } CON • ${hpGained} HP restored • ${newHitDiceCount}/${
          character.maxHitDice
        } dice remaining`,
      });

      const { error } = await supabase
        .from("characters")
        .update({
          current_hit_points: newCurrentHP,
          current_hit_dice: newHitDiceCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", character.id)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error updating character:", error);
        alert("Failed to update character data");
        return;
      }

      if (discordWebhookUrl) {
        const embed = {
          title: `${character.name} used Hit Dice for Short Rest`,
          color: 0x9d4edd,
          fields: [
            {
              name: "Hit Dice Used",
              value: `${selectedHitDiceCount} × ${character.hitDie}`,
              inline: true,
            },
            {
              name: "Roll Result",
              value: `${rollResult.output} + ${
                conModifier * selectedHitDiceCount
              } (CON) = ${actualHealing}`,
              inline: true,
            },
            {
              name: "HP Restored",
              value: `${hpGained} HP (${character.currentHitPoints} → ${newCurrentHP})`,
              inline: true,
            },
            {
              name: "Hit Dice Remaining",
              value: `${newHitDiceCount}/${character.maxHitDice}`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Short Rest Healing",
          },
        };

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
          });
        } catch (discordError) {
          console.error("Error sending to Discord:", discordError);
        }
      }

      await fetchCharacterDetails();
      setShowHitDiceModal(false);
    } catch (error) {
      console.error("Error rolling hit dice:", error);
      alert("Error rolling hit dice. Please try again.");
    } finally {
      setIsRollingHitDice(false);
    }
  };

  const applyDamage = async () => {
    if (!character || damageAmount < 0) return;

    setIsApplyingDamage(true);

    try {
      const newCurrentHP = Math.max(
        0,
        (character.currentHitPoints || character.hitPoints) - damageAmount
      );
      const actualDamage =
        (character.currentHitPoints || character.hitPoints) - newCurrentHP;

      showRollResult({
        title: `Damage Applied`,
        rollValue: actualDamage,
        modifier: 0,
        total: actualDamage,
        isCriticalSuccess: false,
        isCriticalFailure: newCurrentHP === 0,
        type: "damage",
        description: `${actualDamage} damage taken • HP: ${
          character.currentHitPoints || character.hitPoints
        } → ${newCurrentHP}${newCurrentHP === 0 ? " (Unconscious!)" : ""}`,
      });

      const { error } = await supabase
        .from("characters")
        .update({
          current_hit_points: newCurrentHP,
          updated_at: new Date().toISOString(),
        })
        .eq("id", character.id)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error updating character:", error);
        alert("Failed to update character data");
        return;
      }

      if (discordWebhookUrl) {
        const embed = {
          title: `${character.name} took damage!`,
          color: 0xef4444,
          fields: [
            {
              name: "Damage Taken",
              value: `${actualDamage} damage`,
              inline: true,
            },
            {
              name: "HP Remaining",
              value: `${newCurrentHP}/${
                character.maxHitPoints || character.hitPoints
              }`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Damage Taken",
          },
        };

        if (newCurrentHP === 0) {
          embed.description = "⚠️ **Character is unconscious!**";
          embed.color = 0x7f1d1d;
        }

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
          });
        } catch (discordError) {
          console.error("Error sending to Discord:", discordError);
        }
      }

      await fetchCharacterDetails();
      setShowDamageModal(false);
    } catch (error) {
      console.error("Error applying damage:", error);
      alert("Error applying damage. Please try again.");
    } finally {
      setIsApplyingDamage(false);
    }
  };

  return (
    <>
      {/* Hit Dice Modal */}
      {showHitDiceModal && character && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowHitDiceModal(false)}
        >
          <div
            style={{
              backgroundColor: theme === "dark" ? "#374151" : "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              minWidth: "400px",
              maxWidth: "500px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "16px",
                color: theme === "dark" ? "#f9fafb" : "#1f2937",
                textAlign: "center",
              }}
            >
              <Coffee
                size={24}
                style={{ display: "inline", marginRight: "8px" }}
              />
              Short Rest - Use Hit Dice
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Character:</span>
                <span>{character.name}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Current HP:</span>
                <span>
                  {character.currentHitPoints || character.hitPoints}/
                  {character.maxHitPoints || character.hitPoints}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Hit Dice Available:</span>
                <span>
                  {character.currentHitDice} × {character.hitDie}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Constitution Modifier:</span>
                <span>
                  {formatModifier(characterModifiers.constitution)} per die
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                margin: "20px 0",
              }}
            >
              <button
                style={{
                  padding: "8px",
                  border: `2px solid ${
                    theme === "dark" ? "#4b5563" : "#d1d5db"
                  }`,
                  backgroundColor: theme === "dark" ? "#4b5563" : "#f9fafb",
                  color: theme === "dark" ? "#f9fafb" : "#374151",
                  borderRadius: "6px",
                  cursor: selectedHitDiceCount <= 1 ? "not-allowed" : "pointer",
                  opacity: selectedHitDiceCount <= 1 ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() =>
                  setSelectedHitDiceCount(Math.max(1, selectedHitDiceCount - 1))
                }
                disabled={selectedHitDiceCount <= 1}
              >
                <Minus size={16} />
              </button>

              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  minWidth: "40px",
                  textAlign: "center",
                  color: theme === "dark" ? "#f9fafb" : "#1f2937",
                }}
              >
                {selectedHitDiceCount}
              </div>

              <button
                style={{
                  padding: "8px",
                  border: `2px solid ${
                    theme === "dark" ? "#4b5563" : "#d1d5db"
                  }`,
                  backgroundColor: theme === "dark" ? "#4b5563" : "#f9fafb",
                  color: theme === "dark" ? "#f9fafb" : "#374151",
                  borderRadius: "6px",
                  cursor:
                    selectedHitDiceCount >= character.currentHitDice
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    selectedHitDiceCount >= character.currentHitDice ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() =>
                  setSelectedHitDiceCount(
                    Math.min(character.currentHitDice, selectedHitDiceCount + 1)
                  )
                }
                disabled={selectedHitDiceCount >= character.currentHitDice}
              >
                <Plus size={16} />
              </button>
            </div>

            <div
              style={{
                textAlign: "center",
                marginBottom: "24px",
                fontSize: "14px",
                color: theme === "dark" ? "#9ca3af" : "#6b7280",
              }}
            >
              Rolling {selectedHitDiceCount} × {character.hitDie} +{" "}
              {formatModifier(characterModifiers.constitution)} each
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  padding: "10px 20px",
                  border: `2px solid ${
                    theme === "dark" ? "#4b5563" : "#d1d5db"
                  }`,
                  backgroundColor: theme === "dark" ? "#374151" : "white",
                  color: theme === "dark" ? "#f9fafb" : "#374151",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onClick={() => setShowHitDiceModal(false)}
                disabled={isRollingHitDice}
              >
                <X size={16} style={{ marginRight: "6px" }} />
                Cancel
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#9d4edd",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isRollingHitDice ? "wait" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: isRollingHitDice ? 0.7 : 1,
                }}
                onClick={rollHitDice}
                disabled={isRollingHitDice}
              >
                <Dices size={16} />
                {isRollingHitDice ? "Rolling..." : "Roll Hit Dice"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Damage Modal */}
      {showDamageModal && character && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowDamageModal(false)}
        >
          <div
            style={{
              backgroundColor: theme === "dark" ? "#374151" : "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              minWidth: "400px",
              maxWidth: "500px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "16px",
                color: theme === "dark" ? "#f9fafb" : "#1f2937",
                textAlign: "center",
              }}
            >
              <Heart
                size={24}
                style={{
                  display: "inline",
                  marginRight: "8px",
                  color: "#ef4444",
                }}
              />
              Apply Damage
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Character:</span>
                <span>{character.name}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Current HP:</span>
                <span>
                  {character.currentHitPoints || character.hitPoints}/
                  {character.maxHitPoints || character.hitPoints}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Damage Amount:</span>
                <input
                  type="number"
                  min="0"
                  value={damageAmount}
                  onChange={(e) =>
                    setDamageAmount(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      damageAmount > 0 &&
                      !isApplyingDamage
                    ) {
                      applyDamage();
                    }
                    if (e.key === "Escape") {
                      setShowDamageModal(false);
                    }
                  }}
                  style={{
                    padding: "4px 8px",
                    border: `1px solid ${
                      theme === "dark" ? "#4b5563" : "#d1d5db"
                    }`,
                    borderRadius: "4px",
                    backgroundColor: theme === "dark" ? "#374151" : "white",
                    color: theme === "dark" ? "#f9fafb" : "#1f2937",
                    width: "80px",
                    textAlign: "right",
                  }}
                  autoFocus
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Resulting HP:</span>
                <span
                  style={{
                    color:
                      Math.max(
                        0,
                        (character.currentHitPoints || character.hitPoints) -
                          damageAmount
                      ) === 0
                        ? "#ef4444"
                        : "inherit",
                  }}
                >
                  {Math.max(
                    0,
                    (character.currentHitPoints || character.hitPoints) -
                      damageAmount
                  )}
                  /{character.maxHitPoints || character.hitPoints}
                  {Math.max(
                    0,
                    (character.currentHitPoints || character.hitPoints) -
                      damageAmount
                  ) === 0 && " (Unconscious!)"}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  padding: "10px 20px",
                  border: `2px solid ${
                    theme === "dark" ? "#4b5563" : "#d1d5db"
                  }`,
                  backgroundColor: theme === "dark" ? "#374151" : "white",
                  color: theme === "dark" ? "#f9fafb" : "#374151",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onClick={() => setShowDamageModal(false)}
                disabled={isApplyingDamage}
              >
                <X size={16} style={{ marginRight: "6px" }} />
                Cancel
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor:
                    isApplyingDamage || damageAmount <= 0
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: isApplyingDamage || damageAmount <= 0 ? 0.7 : 1,
                }}
                onClick={applyDamage}
                disabled={isApplyingDamage || damageAmount <= 0}
              >
                <Heart size={16} />
                {isApplyingDamage ? "Applying..." : "Apply Damage"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CharacterSheetModals;
