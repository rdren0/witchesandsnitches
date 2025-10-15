import { Heart, Dices, Plus, Minus, X, Coffee, RotateCcw } from "lucide-react";
import { formatModifier } from "./utils";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { sendDiscordRollWebhook } from "../utils/discordWebhook";

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
  healAmount,
  setHealAmount,
  tempHPAmount,
  setTempHPAmount,
  isApplyingDamage,
  setIsApplyingDamage,
  adminMode = false,
  isUserAdmin = false,
}) => {
  const rollHitDice = async () => {
    if (
      !character ||
      selectedHitDiceCount < 0 ||
      selectedHitDiceCount > character.currentHitDice
    ) {
      return;
    }

    if (selectedHitDiceCount === 0 || character.currentHitDice === 0) {
      setIsRollingHitDice(true);
      try {
        setShowHitDiceModal(false);

        const characterOwnerId = character.discord_user_id || character.ownerId;

        const hasLuckyFeat = character?.feats?.includes("Lucky") || false;
        const getProficiencyBonus = (level) => {
          if (level <= 4) return 2;
          if (level <= 8) return 3;
          if (level <= 12) return 4;
          if (level <= 16) return 5;
          return 6;
        };

        if (hasLuckyFeat) {
          const resourceUpdates = {
            character_id: character.id,
            discord_user_id: characterOwnerId,
            updated_at: new Date().toISOString(),
            luck: getProficiencyBonus(character?.level || 1),
          };

          const { error: resourcesError } = await supabase
            .from("character_resources")
            .upsert(resourceUpdates, {
              onConflict: "character_id,discord_user_id",
            });

          if (resourcesError) {
            console.error("Error updating resources:", resourcesError);
          }
        }

        showRollResult({
          title: `Short Rest Complete`,
          rollValue: 0,
          modifier: 0,
          total: 0,
          isCriticalSuccess: false,
          isCriticalFailure: false,
          type: "shortrest",
          character: character,
          description: `${character.name} has taken a short rest${
            hasLuckyFeat ? " • Luck points restored" : ""
          } • No healing received`,
        });

        const additionalFields = [
          {
            name: "Rest Type",
            value: "Short Rest (1 hour)",
            inline: true,
          },
          {
            name: "Hit Dice Used",
            value: "0",
            inline: true,
          },
          {
            name: "Benefits",
            value: hasLuckyFeat
              ? "Luck points restored"
              : "Class features refreshed",
            inline: false,
          },
        ];

        const success = await sendDiscordRollWebhook({
          character,
          rollType: "Short Rest",
          title: `${character.name}: Short Rest Complete`,
          embedColor: 0x10b981,
          rollResult: null,
          fields: additionalFields,
          useCharacterAvatar: true,
          description: "☕ **Short rest completed - refreshed and ready!**",
        });

        if (!success) {
          console.error("Failed to send short rest to Discord");
        }

        return;
      } catch (error) {
        console.error("Error taking short rest:", error);
        alert("Error taking short rest. Please try again.");
      } finally {
        setIsRollingHitDice(false);
      }
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

      const characterOwnerId = character.discord_user_id || character.ownerId;

      let query = supabase
        .from("characters")
        .update({
          current_hit_points: newCurrentHP,
          current_hit_dice: newHitDiceCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", character.id);

      if (!(adminMode && isUserAdmin)) {
        query = query.eq("discord_user_id", discordUserId);
      }

      const { error } = await query;

      if (error) {
        console.error("Error updating character:", error);
        alert("Failed to update character data");
        return;
      }

      const rollResultForWebhook = {
        d20Roll: rollResult.total,
        modifier: conModifier * selectedHitDiceCount,
        total: actualHealing,
        isCriticalSuccess: false,
        isCriticalFailure: false,
      };

      const additionalFields = [
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
      ];

      const success = await sendDiscordRollWebhook({
        character,
        rollType: "Hit Dice Recovery",
        title: `${character.name} - Hit Dice Recovery`,
        embedColor: 0x9d4edd,
        rollResult: rollResultForWebhook,
        fields: additionalFields,
        useCharacterAvatar: true,
        description: "☕ **Short Rest Healing**",
      });

      if (!success) {
        console.error("Failed to send hit dice recovery to Discord");
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
      const currentTempHP = character.tempHP || 0;

      let newCurrentHP;
      let newTempHP = currentTempHP;
      let changeAmount;
      let changeType;
      let tempHPUsed = 0;

      if (type === "damage") {
        if (currentTempHP > 0) {
          if (amount <= currentTempHP) {
            newTempHP = currentTempHP - amount;
            newCurrentHP = currentHP;
            tempHPUsed = amount;
            changeAmount = 0;
          } else {
            tempHPUsed = currentTempHP;
            const remainingDamage = amount - currentTempHP;
            newTempHP = 0;
            newCurrentHP = Math.max(0, currentHP - remainingDamage);
            changeAmount = currentHP - newCurrentHP;
          }
        } else {
          newCurrentHP = Math.max(0, currentHP - amount);
          changeAmount = currentHP - newCurrentHP;
        }
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
          ? `${amount} damage taken${
              tempHPUsed > 0 ? ` • ${tempHPUsed} absorbed by temp HP` : ""
            } • HP: ${currentHP} → ${newCurrentHP}${
              newCurrentHP === 0 ? " (Unconscious!)" : ""
            }`
          : `${changeAmount} HP restored • HP: ${currentHP} → ${newCurrentHP}`;

      showRollResult({
        title: type === "damage" ? "Damage Applied" : "Healing Applied",
        rollValue: amount,
        modifier: 0,
        total: amount,
        character: character,
        isCriticalSuccess: type === "healing" && newCurrentHP === maxHP,
        isCriticalFailure: type === "damage" && newCurrentHP === 0,
        type: changeType,
        description: resultDescription,
      });

      const characterOwnerId = character.discord_user_id || character.ownerId;

      let query = supabase
        .from("characters")
        .update({
          current_hit_points: newCurrentHP,
          temp_hp: newTempHP,
          updated_at: new Date().toISOString(),
        })
        .eq("id", character.id);

      if (!(adminMode && isUserAdmin)) {
        query = query.eq("discord_user_id", discordUserId);
      }

      const { error } = await query;

      if (error) {
        console.error("Error updating character:", error);
        alert("Failed to update character data");
        return;
      }

      const additionalFields = [
        {
          name: type === "damage" ? "Damage Taken" : "HP Restored",
          value: `${amount} ${type === "damage" ? "damage" : "HP"}`,
          inline: true,
        },
        {
          name: "Current HP",
          value: `${newCurrentHP}/${maxHP}`,
          inline: true,
        },
      ];

      if (type === "damage" && tempHPUsed > 0) {
        additionalFields.push({
          name: "Temp HP Absorbed",
          value: `${tempHPUsed} damage`,
          inline: true,
        });
      }

      if (newTempHP > 0 && type === "damage") {
        additionalFields.push({
          name: "Remaining Temp HP",
          value: `${newTempHP}`,
          inline: true,
        });
      }

      let webhookDescription = "";
      let embedColor = type === "damage" ? 0xef4444 : 0x10b981;

      if (type === "damage" && newCurrentHP === 0) {
        webhookDescription = "⚠️ **Character is unconscious!**";
        embedColor = 0x7f1d1d;
      } else if (type === "healing" && newCurrentHP === maxHP) {
        webhookDescription = "✨ **Character is at full health!**";
      }

      const success = await sendDiscordRollWebhook({
        character,
        rollType: type === "damage" ? "Damage Taken" : "Healing Applied",
        title: type === "damage" ? `${character.name}: Damage Taken` : `${character.name}: Healing Applied`,
        embedColor: embedColor,
        rollResult: null,
        fields: additionalFields,
        useCharacterAvatar: true,
        description: webhookDescription,
      });

      if (!success) {
        console.error("Failed to send HP change to Discord");
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
    if (healAmount > 0) {
      applyHPChange(Math.abs(healAmount), "healing");
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

            {character.currentHitDice > 0 && (
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
                    cursor:
                      selectedHitDiceCount <= 0 ? "not-allowed" : "pointer",
                    opacity: selectedHitDiceCount <= 0 ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() =>
                    setSelectedHitDiceCount(
                      Math.max(0, selectedHitDiceCount - 1)
                    )
                  }
                  disabled={selectedHitDiceCount <= 0}
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
                      selectedHitDiceCount >= character.currentHitDice
                        ? 0.5
                        : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() =>
                    setSelectedHitDiceCount(
                      Math.min(
                        character.currentHitDice,
                        selectedHitDiceCount + 1
                      )
                    )
                  }
                  disabled={selectedHitDiceCount >= character.currentHitDice}
                >
                  <Plus size={16} />
                </button>
              </div>
            )}

            <div
              style={{
                textAlign: "center",
                marginBottom: "24px",
                fontSize: "14px",
                color: theme.textSecondary,
              }}
            >
              {character.currentHitDice === 0 || selectedHitDiceCount === 0 ? (
                character.currentHitDice === 0 ? (
                  "Short rest - no hit dice available for healing"
                ) : (
                  "Rest without healing - no hit dice will be used"
                )
              ) : (
                <>
                  Rolling {selectedHitDiceCount} × {character.hitDie} +{" "}
                  {formatModifier(characterModifiers.constitution)} each
                </>
              )}
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
                {isRollingHitDice
                  ? "Resting..."
                  : character.currentHitDice === 0 || selectedHitDiceCount === 0
                  ? "Take Short Rest"
                  : "Roll Hit Dice"}
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
                  value={healAmount || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setHealAmount(Math.max(0, value));
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
                    !healAmount ||
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
                      !healAmount ||
                      (character.currentHitPoints ?? character.hitPoints) ===
                        (character.maxHitPoints ?? character.hitPoints) ||
                      isApplyingDamage
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      !healAmount ||
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

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Temporary HP
                {character.tempHP > 0 && (
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#3b82f6",
                      fontWeight: "500",
                    }}
                  >
                    (Current: {character.tempHP})
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="number"
                  min="0"
                  value={tempHPAmount || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setTempHPAmount(Math.max(0, value));
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
                  onClick={async () => {
                    if (!tempHPAmount || tempHPAmount <= 0 || isApplyingDamage)
                      return;

                    setIsApplyingDamage(true);
                    try {
                      const characterOwnerId =
                        character.discord_user_id || character.ownerId;

                      let query = supabase
                        .from("characters")
                        .update({
                          temp_hp: tempHPAmount,
                          updated_at: new Date().toISOString(),
                        })
                        .eq("id", character.id);

                      if (!(adminMode && isUserAdmin)) {
                        query = query.eq("discord_user_id", discordUserId);
                      }

                      const { error } = await query;

                      if (error) {
                        console.error("Error updating temp HP:", error);
                        alert("Failed to update temp HP");
                        return;
                      }

                      const additionalFields = [
                        {
                          name: "Temporary HP Set",
                          value: `${tempHPAmount} temp HP`,
                          inline: true,
                        },
                        {
                          name: "Current HP",
                          value: `${
                            character.currentHitPoints ?? character.hitPoints
                          }/${character.maxHitPoints ?? character.hitPoints}`,
                          inline: true,
                        },
                      ];

                      const success = await sendDiscordRollWebhook({
                        character,
                        rollType: "Temporary HP",
                        title: "Temporary HP Added",
                        embedColor: 0x3b82f6,
                        rollResult: null,
                        fields: additionalFields,
                        useCharacterAvatar: true,
                        description: " **Temporary hit points gained!**",
                      });

                      if (!success) {
                        console.error("Failed to send temp HP to Discord");
                      }

                      await fetchCharacterDetails();
                      setShowDamageModal(false);
                    } catch (error) {
                      console.error("Error setting temp HP:", error);
                      alert("Error setting temp HP. Please try again.");
                    } finally {
                      setIsApplyingDamage(false);
                    }
                  }}
                  disabled={!tempHPAmount || isApplyingDamage}
                  style={{
                    padding: "8px 16px",
                    width: "100px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor:
                      !tempHPAmount || isApplyingDamage
                        ? "not-allowed"
                        : "pointer",
                    opacity: !tempHPAmount || isApplyingDamage ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  Set Temp
                </button>
                {character.tempHP > 0 && (
                  <button
                    onClick={async () => {
                      if (isApplyingDamage) return;

                      setIsApplyingDamage(true);
                      try {
                        const characterOwnerId =
                          character.discord_user_id || character.ownerId;

                        let query = supabase
                          .from("characters")
                          .update({
                            temp_hp: 0,
                            updated_at: new Date().toISOString(),
                          })
                          .eq("id", character.id);

                        if (!(adminMode && isUserAdmin)) {
                          query = query.eq("discord_user_id", discordUserId);
                        }

                        const { error } = await query;

                        if (error) {
                          console.error("Error clearing temp HP:", error);
                          alert("Failed to clear temp HP");
                          return;
                        }

                        await fetchCharacterDetails();
                        setShowDamageModal(false);
                      } catch (error) {
                        console.error("Error clearing temp HP:", error);
                        alert("Error clearing temp HP. Please try again.");
                      } finally {
                        setIsApplyingDamage(false);
                      }
                    }}
                    disabled={isApplyingDamage}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#ef444410",
                      color: "#ef4444",
                      border: "1px solid #ef4444",
                      borderRadius: "6px",
                      fontSize: "14px",
                      cursor: isApplyingDamage ? "not-allowed" : "pointer",
                      opacity: isApplyingDamage ? 0.5 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      fontWeight: "600",
                    }}
                    title="Clear all temporary HP"
                  >
                    Clear
                  </button>
                )}
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
