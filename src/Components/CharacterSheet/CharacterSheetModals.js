import { Heart, Dices, Plus, Minus, X, Coffee, RotateCcw } from "lucide-react";
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
        character: character,
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
          title: `${character.name} - Hit Dice Recovery`,
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
            text: `Short Rest Healing`,
          },
        };

        const message = {
          embeds: [embed],
        };

        if (character?.imageUrl) {
          message.username = character.name;
          message.avatar_url = character.imageUrl;
        }

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message),
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

  const applyHPChange = async (amount, type) => {
    if (!character || amount <= 0) return;

    setIsApplyingDamage(true);

    try {
      const currentHP = character.currentHitPoints ?? character.hitPoints;
      const maxHP = character.maxHitPoints ?? character.hitPoints;

      let newCurrentHP;
      let changeAmount;
      let changeType;

      if (type === "damage") {
        newCurrentHP = Math.max(0, currentHP - amount);
        changeAmount = currentHP - newCurrentHP;
        changeType = "damage";
      } else {
        newCurrentHP = Math.min(maxHP, currentHP + amount);
        changeAmount = newCurrentHP - currentHP;
        changeType = "healing";
      }

      if (newCurrentHP < 0) newCurrentHP = 0;
      if (newCurrentHP > maxHP) newCurrentHP = maxHP;

      const resultDescription =
        type === "damage"
          ? `${changeAmount} damage taken • HP: ${currentHP} → ${newCurrentHP}${
              newCurrentHP === 0 ? " (Unconscious!)" : ""
            }`
          : `${changeAmount} HP restored • HP: ${currentHP} → ${newCurrentHP}`;

      showRollResult({
        title: type === "damage" ? "Damage Applied" : "Healing Applied",
        rollValue: changeAmount,
        modifier: 0,
        total: changeAmount,
        character: character,
        isCriticalSuccess: type === "healing" && newCurrentHP === maxHP,
        isCriticalFailure: type === "damage" && newCurrentHP === 0,
        type: changeType,
        description: resultDescription,
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
          title: `${character.name} - ${
            type === "damage" ? "Damage Taken" : "Healing Applied"
          }`,
          color: type === "damage" ? 0xef4444 : 0x10b981,
          fields: [
            {
              name: type === "damage" ? "Damage Taken" : "HP Restored",
              value: `${changeAmount} ${type === "damage" ? "damage" : "HP"}`,
              inline: true,
            },
            {
              name: "Current HP",
              value: `${newCurrentHP}/${maxHP}`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: `${type === "damage" ? "Damage Taken" : "Healing Applied"}`,
          },
        };

        if (type === "damage" && newCurrentHP === 0) {
          embed.description = "⚠️ **Character is unconscious!**";
          embed.color = 0x7f1d1d;
        } else if (type === "healing" && newCurrentHP === maxHP) {
          embed.description = "✨ **Character is at full health!**";
        }

        const message = {
          embeds: [embed],
        };

        if (character?.imageUrl) {
          message.username = character.name;
          message.avatar_url = character.imageUrl;
        }

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message),
          });
        } catch (discordError) {
          console.error("Error sending to Discord:", discordError);
        }
      }

      await fetchCharacterDetails();
      setShowDamageModal(false);
    } catch (error) {
      console.error("Error applying HP change:", error);
      alert("Error applying HP change. Please try again.");
    } finally {
      setIsApplyingDamage(false);
    }
  };

  const handleQuickAction = (amount, type) => {
    applyHPChange(amount, type);
  };

  const handleCustomDamage = () => {
    if (damageAmount > 0) {
      applyHPChange(Math.abs(damageAmount), "damage");
    }
  };

  const handleCustomHeal = () => {
    if (damageAmount > 0) {
      applyHPChange(Math.abs(damageAmount), "healing");
    }
  };

  const handleFullHeal = () => {
    const currentHP = character.currentHitPoints ?? character.hitPoints;
    const maxHP = character.maxHitPoints ?? character.hitPoints;
    const healAmount = maxHP - currentHP;

    if (healAmount > 0) {
      applyHPChange(healAmount, "healing");
    }
  };

  const getHPColor = () => {
    const currentHP = character.currentHitPoints ?? character.hitPoints;
    const maxHP = character.maxHitPoints ?? character.hitPoints;
    const percentage = currentHP / maxHP;

    if (percentage <= 0.25) return "#EF4444";
    if (percentage <= 0.5) return "#F59E0B";
    if (percentage <= 0.75) return "#EAB308";
    return "#10B981";
  };

  return (
    <>
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
              backgroundColor: theme.background,
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
                color: theme.text,
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
                  color: theme.color,
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
                  color: theme.color,
                }}
              >
                <span>Current HP:</span>
                <span>
                  {character.currentHitPoints ?? character.hitPoints}/
                  {character.maxHitPoints ?? character.hitPoints}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme.color,
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
                  color: theme.color,
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
                  border: theme.border,
                  backgroundColor: theme.background,
                  color: theme.primary,
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
                  color: theme.text,
                }}
              >
                {selectedHitDiceCount}
              </div>

              <button
                style={{
                  padding: "8px",
                  border: theme.border,
                  backgroundColor: theme.background,
                  color: theme.primary,
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
                color: theme.textSecondary,
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
              <button
                style={{
                  padding: "10px 20px",
                  border: theme.border,
                  backgroundColor: theme.surface,
                  color: theme.text,
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
            </div>
          </div>
        </div>
      )}

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
              backgroundColor: theme.background,
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: theme.text,
                  fontSize: "18px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Heart size={20} color={getHPColor()} />
                Manage Hit Points
              </h3>
              <button
                onClick={() => setShowDamageModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: theme.textSecondary,
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                padding: "12px",
                backgroundColor: theme.surface,
                borderRadius: "8px",
                border: theme.border,
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: getHPColor(),
                  marginBottom: "4px",
                }}
              >
                {character.currentHitPoints ?? character.hitPoints} /{" "}
                {character.maxHitPoints ?? character.hitPoints}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Current / Maximum HP
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: "8px",
                }}
              >
                Quick Actions
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                }}
              >
                <button
                  onClick={() => handleQuickAction(1, "damage")}
                  disabled={
                    (character.currentHitPoints ?? character.hitPoints) === 0 ||
                    isApplyingDamage
                  }
                  style={{
                    padding: "8px 4px",
                    backgroundColor: "#EF444410",
                    color: "#EF4444",
                    border: "1px solid #EF4444",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor:
                      (character.currentHitPoints ?? character.hitPoints) ===
                        0 || isApplyingDamage
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      (character.currentHitPoints ?? character.hitPoints) ===
                        0 || isApplyingDamage
                        ? 0.5
                        : 1,
                  }}
                >
                  -1
                </button>
                <button
                  onClick={() => handleQuickAction(5, "damage")}
                  disabled={
                    (character.currentHitPoints ?? character.hitPoints) === 0 ||
                    isApplyingDamage
                  }
                  style={{
                    padding: "8px 4px",
                    backgroundColor: "#EF444410",
                    color: "#EF4444",
                    border: "1px solid #EF4444",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor:
                      (character.currentHitPoints ?? character.hitPoints) ===
                        0 || isApplyingDamage
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      (character.currentHitPoints ?? character.hitPoints) ===
                        0 || isApplyingDamage
                        ? 0.5
                        : 1,
                  }}
                >
                  -5
                </button>
                <button
                  onClick={() => handleQuickAction(1, "healing")}
                  disabled={
                    (character.currentHitPoints ?? character.hitPoints) ===
                      (character.maxHitPoints ?? character.hitPoints) ||
                    isApplyingDamage
                  }
                  style={{
                    padding: "8px 4px",
                    backgroundColor: "#10B98110",
                    color: "#10B981",
                    border: "1px solid #10B981",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor:
                      (character.currentHitPoints ?? character.hitPoints) ===
                        (character.maxHitPoints ?? character.hitPoints) ||
                      isApplyingDamage
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      (character.currentHitPoints ?? character.hitPoints) ===
                        (character.maxHitPoints ?? character.hitPoints) ||
                      isApplyingDamage
                        ? 0.5
                        : 1,
                  }}
                >
                  +1
                </button>
                <button
                  onClick={() => handleQuickAction(5, "healing")}
                  disabled={
                    (character.currentHitPoints ?? character.hitPoints) ===
                      (character.maxHitPoints ?? character.hitPoints) ||
                    isApplyingDamage
                  }
                  style={{
                    padding: "8px 4px",
                    backgroundColor: "#10B98110",
                    color: "#10B981",
                    border: "1px solid #10B981",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor:
                      (character.currentHitPoints ?? character.hitPoints) ===
                        (character.maxHitPoints ?? character.hitPoints) ||
                      isApplyingDamage
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      (character.currentHitPoints ?? character.hitPoints) ===
                        (character.maxHitPoints ?? character.hitPoints) ||
                      isApplyingDamage
                        ? 0.5
                        : 1,
                  }}
                >
                  +5
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: "8px",
                }}
              >
                Take Damage
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="number"
                  min="1"
                  max={character.currentHitPoints ?? character.hitPoints}
                  value={damageAmount || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setDamageAmount(Math.max(0, value));
                  }}
                  placeholder="Amount"
                  style={{
                    flex: 1,

                    padding: "8px 12px",
                    border: theme.surface,
                    borderRadius: "6px",
                    backgroundColor: theme.surface,
                    color: theme.text,
                    fontSize: "14px",
                  }}
                />
                <button
                  onClick={handleCustomDamage}
                  disabled={
                    !damageAmount ||
                    (character.currentHitPoints ?? character.hitPoints) === 0 ||
                    isApplyingDamage
                  }
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#EF4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor:
                      !damageAmount ||
                      (character.currentHitPoints ?? character.hitPoints) ===
                        0 ||
                      isApplyingDamage
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      !damageAmount ||
                      (character.currentHitPoints ?? character.hitPoints) ===
                        0 ||
                      isApplyingDamage
                        ? 0.5
                        : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Minus size={14} />
                  Damage
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: "8px",
                }}
              >
                Restore Health
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="number"
                  min="1"
                  max={
                    (character.maxHitPoints ?? character.hitPoints) -
                    (character.currentHitPoints ?? character.hitPoints)
                  }
                  value={damageAmount || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setDamageAmount(Math.max(0, value));
                  }}
                  placeholder="Amount"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    border: theme.surface,
                    borderRadius: "6px",
                    backgroundColor: theme.surface,
                    color: theme.text,
                    fontSize: "14px",
                  }}
                />
                <button
                  onClick={handleCustomHeal}
                  disabled={
                    !damageAmount ||
                    (character.currentHitPoints ?? character.hitPoints) ===
                      (character.maxHitPoints ?? character.hitPoints) ||
                    isApplyingDamage
                  }
                  style={{
                    padding: "8px 16px",
                    width: "100px",
                    backgroundColor: "#10B981",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor:
                      !damageAmount ||
                      (character.currentHitPoints ?? character.hitPoints) ===
                        (character.maxHitPoints ?? character.hitPoints) ||
                      isApplyingDamage
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      !damageAmount ||
                      (character.currentHitPoints ?? character.hitPoints) ===
                        (character.maxHitPoints ?? character.hitPoints) ||
                      isApplyingDamage
                        ? 0.5
                        : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Plus size={14} />
                  Heal
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={handleFullHeal}
                disabled={
                  (character.currentHitPoints ?? character.hitPoints) ===
                    (character.maxHitPoints ?? character.hitPoints) ||
                  isApplyingDamage
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor:
                    (character.currentHitPoints ?? character.hitPoints) ===
                      (character.maxHitPoints ?? character.hitPoints) ||
                    isApplyingDamage
                      ? theme.surface
                      : "#10B981",
                  color:
                    (character.currentHitPoints ?? character.hitPoints) ===
                      (character.maxHitPoints ?? character.hitPoints) ||
                    isApplyingDamage
                      ? theme.text
                      : "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor:
                    (character.currentHitPoints ?? character.hitPoints) ===
                      (character.maxHitPoints ?? character.hitPoints) ||
                    isApplyingDamage
                      ? "not-allowed"
                      : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <RotateCcw size={16} />
                {isApplyingDamage
                  ? "Applying..."
                  : `Full Heal to ${
                      character.maxHitPoints ?? character.hitPoints
                    } HP`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CharacterSheetModals;
