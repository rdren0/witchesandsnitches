import React, { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { getCharacterSheetStyles } from "../../../styles/masterStyles";
import { useRollFunctions } from "../../utils/diceRoller";
import { rollDice } from "../../utils/diceRoller";
import { useRollModal } from "../../utils/diceRoller";

export const CorruptionTracker = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  selectedCharacterId,
}) => {
  const { rollCorruption } = useRollFunctions();
  const { showRollResult } = useRollModal();
  const { theme } = useTheme();
  const styles = getCharacterSheetStyles(theme);

  const [corruptionPoints, setCorruptionPoints] = useState(0);
  const [spendAmount, setSpendAmount] = useState(1);
  const [spendReason, setSpendReason] = useState("");
  const [gainAmount, setGainAmount] = useState(1);
  const [gainReason, setGainReason] = useState("");
  const [showManualGain, setShowManualGain] = useState(false);
  const [showGainSection, setShowGainSection] = useState(false);
  const [showRedeemSection, setShowRedeemSection] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (character?.corruption_points !== undefined) {
      setCorruptionPoints(character.corruption_points);
    }
  }, [character?.corruption_points]);

  const getCorruptionTier = (points) => {
    if (points === 0)
      return {
        name: "Pure Hearted",
        range: "(0)",
        color: "#10b981",
        saveDC: 10,
        boon: null,
        effect: null,
      };
    if (points <= 4)
      return {
        name: "Pragmatic",
        range: "(1-4)",
        color: "#f59e0b",
        saveDC: 12,
        boon: "Empowered Darkness",
        effect: null,
      };
    if (points <= 7)
      return {
        name: "Devious",
        range: "(5-7)",
        color: "#ef4444",
        saveDC: 14,
        boon: null,
        effect: "Mild Effect",
      };
    if (points <= 11)
      return {
        name: "Vicious",
        range: "(8-11)",
        color: "#7c2d12",
        saveDC: 16,
        boon: "Heightened Darkness",
        effect: "Severe Effect",
      };
    return {
      name: "Vile",
      range: "(12+)",
      color: "#1f2937",
      saveDC: 18,
      boon: null,
      effect: "Severe Effect",
    };
  };

  const currentTier = getCorruptionTier(corruptionPoints);

  const rollCorruptionSave = async () => {
    if (isProcessing || !character) return;
    setIsProcessing(true);

    const deedReason = gainReason || "Dark deed committed";

    try {
      const wisdomModifier = character.abilityScores?.wisdom
        ? Math.floor((character.abilityScores.wisdom - 10) / 2)
        : 0;
      const proficiencyBonus = character.proficiencyBonus || 0;
      const hasWisdomSaveProficiency =
        character.savingThrowProficiencies?.includes("wisdom") || false;
      const totalModifier =
        wisdomModifier + (hasWisdomSaveProficiency ? proficiencyBonus : 0);

      const diceResult = rollDice();
      const d20Roll = diceResult.total;
      const total = d20Roll + totalModifier;
      const dc = currentTier.saveDC;

      const isCriticalSuccess = d20Roll === 20;
      const isCriticalFailure = d20Roll === 1;
      const isSuccess =
        (total >= dc || isCriticalSuccess) && !isCriticalFailure;

      if (showRollResult) {
        showRollResult({
          title: `Corruption Resistance Save`,
          rollValue: d20Roll,
          modifier: totalModifier,
          total: total,
          isCriticalSuccess,
          isCriticalFailure,
          type: "saving_throw",
          description: `${character.name} resists corruption after: ${deedReason} (DC ${dc})`,
        });
      }

      if (!isSuccess) {
        const newTotal = corruptionPoints + 1;
        await updateCorruptionPoints(newTotal);

        if (rollCorruption) {
          rollCorruption({
            character,
            pointsGained: 1,
            reason: deedReason,
            pointsTotal: newTotal,
            type: "gained",
            saveResult: {
              rollValue: d20Roll,
              modifier: totalModifier,
              total,
              dc,
              failed: true,
            },
          });
        }
      }

      setGainReason("");
    } catch (error) {
      console.error("Error rolling corruption save:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFailedSave = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const deedReason = gainReason || "Failed Wisdom Save";
    const newTotal = corruptionPoints + 1;

    await updateCorruptionPoints(newTotal);

    if (rollCorruption) {
      rollCorruption({
        character,
        pointsGained: 1,
        reason: deedReason,
        pointsTotal: newTotal,
        type: "gained",
      });
    }

    setGainReason("");
    setIsProcessing(false);
  };

  const updateCorruptionPoints = async (newTotal) => {
    if (!character || !selectedCharacterId) return;

    setCorruptionPoints(newTotal);
    setCharacter((prev) => ({
      ...prev,
      corruption_points: newTotal,
    }));

    try {
      const { error } = await supabase
        .from("characters")
        .update({
          corruption_points: newTotal,
        })
        .eq("id", selectedCharacterId)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error updating corruption points:", error);

        setCorruptionPoints(character.corruption_points || 0);
        setCharacter((prev) => ({
          ...prev,
          corruption_points: character.corruption_points || 0,
        }));

        alert("Failed to update corruption points. Please try again.");
      }
    } catch (err) {
      console.error("Error updating corruption points:", err);

      setCorruptionPoints(character.corruption_points || 0);
      setCharacter((prev) => ({
        ...prev,
        corruption_points: character.corruption_points || 0,
      }));

      alert("Failed to update corruption points. Please try again.");
    }
  };

  const addPoints = async () => {
    if (isProcessing || gainAmount < 1) return;
    setIsProcessing(true);

    const newTotal = corruptionPoints + gainAmount;
    const reason = gainReason || "Dark deed committed";

    await updateCorruptionPoints(newTotal);

    if (rollCorruption) {
      rollCorruption({
        character,
        pointsGained: gainAmount,
        reason: reason,
        pointsTotal: newTotal,
        type: "gained",
      });
    }

    setGainReason("");
    setIsProcessing(false);
  };

  const spendPoints = async () => {
    if (isProcessing || spendAmount > corruptionPoints) return;
    setIsProcessing(true);

    const newTotal = corruptionPoints - spendAmount;
    const reason = spendReason || "Act of redemption";

    await updateCorruptionPoints(newTotal);

    if (rollCorruption) {
      rollCorruption({
        character,
        pointsRedeemed: spendAmount,
        reason: reason,
        pointsRemaining: newTotal,
        type: "redeemed",
      });
    }

    setSpendReason("");
    setIsProcessing(false);
  };

  const getSectionToggleStyle = (isExpanded, color) => ({
    ...styles.button,
    backgroundColor: "transparent",
    color: color,
    border: `1px solid ${color}40`,
    fontSize: "14px",
    padding: "8px 12px",
    width: "100%",
    marginBottom: isExpanded ? "12px" : "0px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: "600",
  });

  return (
    <div style={styles.headerCard}>
      <div style={styles.sectionHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Flame style={{ color: "#dc2626" }} size={20} />
          <h3 style={styles.sectionTitle}>Corruption Points</h3>
        </div>
      </div>

      <div style={styles.corruptionDisplay}>
        <div
          style={{
            ...styles.corruptionOrb,
            background: `linear-gradient(135deg, ${currentTier.color}, #1a1a1a)`,
          }}
        >
          <span style={styles.corruptionValue}>{corruptionPoints}</span>
        </div>
        <p style={styles.corruptionLabel}>Current Corruption</p>
        <div
          style={{
            marginTop: "8px",
            padding: "8px 12px",
            backgroundColor: currentTier.color + "20",
            border: `1px solid ${currentTier.color}`,
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "600",
            color: currentTier.color,
          }}
        >
          {currentTier.name} {currentTier.range}
        </div>
        {(currentTier.boon || currentTier.effect) && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: theme.textSecondary,
            }}
          >
            {currentTier.boon && <div>Boon: {currentTier.boon}</div>}
            {currentTier.effect && <div>Effect: {currentTier.effect}</div>}
          </div>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setShowGainSection(!showGainSection)}
          style={getSectionToggleStyle(showGainSection, "#991b1b")}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{showGainSection ? "▼" : "▶"}</span>
            <span>Gain Corruption (Dark Deeds)</span>
          </span>
          <span style={{ fontSize: "12px", fontWeight: "normal" }}>
            DC {currentTier.saveDC}
          </span>
        </button>

        {showGainSection && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fef2f2",
              borderRadius: "8px",
              border: "1px solid #fecaca",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: theme.textSecondary,
                marginBottom: "8px",
                fontStyle: "italic",
              }}
            >
              Current Wisdom Save DC: {currentTier.saveDC} • Failure = +1
              Corruption Point
            </div>

            <div style={{ marginBottom: "12px" }}>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Describe the dark deed (murder, betrayal, etc.)..."
                  value={gainReason}
                  onChange={(e) => setGainReason(e.target.value)}
                  disabled={isProcessing}
                  style={{
                    ...styles.input,
                    flex: 1,
                    ...(isProcessing ? { opacity: 0.5 } : {}),
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={rollCorruptionSave}
                  disabled={isProcessing}
                  style={{
                    ...styles.button,
                    ...(isProcessing
                      ? {
                          backgroundColor: "#d1d5db",
                          color: "#6b7280",
                          cursor: "not-allowed",
                        }
                      : {
                          backgroundColor: "#7c2d12",
                          color: "#ffffff",
                        }),
                    flex: 1,
                  }}
                >
                  {isProcessing
                    ? "Rolling..."
                    : `Roll Corruption Save (DC ${currentTier.saveDC})`}
                </button>
                <button
                  onClick={handleFailedSave}
                  disabled={isProcessing}
                  style={{
                    ...styles.button,
                    ...(isProcessing
                      ? {
                          backgroundColor: "#d1d5db",
                          color: "#6b7280",
                          cursor: "not-allowed",
                        }
                      : styles.buttonDanger),
                    flex: 1,
                  }}
                >
                  Save Failed (+1)
                </button>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid #fecaca",
                paddingTop: "12px",
                marginTop: "8px",
              }}
            >
              <button
                onClick={() => setShowManualGain(!showManualGain)}
                style={{
                  ...styles.button,
                  backgroundColor: "transparent",
                  color: "#991b1b",
                  border: "1px solid #fecaca",
                  fontSize: "12px",
                  padding: "6px 12px",
                  width: "100%",
                  marginBottom: showManualGain ? "12px" : "0px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                {showManualGain ? "▼" : "▶"} Manual Corruption Assignment
              </button>

              {showManualGain && (
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#991b1b",
                      marginBottom: "8px",
                      fontStyle: "italic",
                    }}
                  >
                    For direct DM assignment without saves
                  </div>
                  <div style={styles.inputGroup}>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={gainAmount}
                      onChange={(e) =>
                        setGainAmount(
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      disabled={isProcessing}
                      style={{
                        ...styles.input,
                        width: "80px",
                        ...(isProcessing ? { opacity: 0.5 } : {}),
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Reason for manual corruption assignment..."
                      value={gainReason}
                      onChange={(e) => setGainReason(e.target.value)}
                      disabled={isProcessing}
                      style={{
                        ...styles.input,
                        flex: 1,
                        ...(isProcessing ? { opacity: 0.5 } : {}),
                      }}
                    />
                  </div>
                  <button
                    onClick={addPoints}
                    disabled={gainAmount < 1 || isProcessing}
                    style={{
                      ...styles.button,
                      ...(gainAmount < 1 || isProcessing
                        ? {
                            backgroundColor: "#d1d5db",
                            color: "#6b7280",
                            cursor: "not-allowed",
                          }
                        : styles.buttonDanger),
                      width: "100%",
                    }}
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Manually Assign ${gainAmount} Point${
                          gainAmount !== 1 ? "s" : ""
                        }`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setShowRedeemSection(!showRedeemSection)}
          style={getSectionToggleStyle(showRedeemSection, "#059669")}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{showRedeemSection ? "▼" : "▶"}</span>
            <span>Absolve Corruption (Good Deeds)</span>
          </span>
          <span style={{ fontSize: "12px", fontWeight: "normal" }}>
            {corruptionPoints} available
          </span>
        </button>

        {showRedeemSection && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#f0fdf4",
              borderRadius: "8px",
              border: `1px solid #bbf7d0`,
            }}
          >
            <div style={styles.inputGroup}>
              <input
                type="number"
                min="1"
                max={corruptionPoints}
                value={spendAmount}
                onChange={(e) =>
                  setSpendAmount(Math.max(1, parseInt(e.target.value) || 1))
                }
                disabled={isProcessing}
                style={{
                  ...styles.input,
                  width: "80px",
                  ...(isProcessing ? { opacity: 0.5 } : {}),
                }}
              />
              <input
                type="text"
                placeholder="Act of kindness, showing remorse..."
                value={spendReason}
                onChange={(e) => setSpendReason(e.target.value)}
                disabled={isProcessing}
                style={{
                  ...styles.input,
                  flex: 1,
                  ...(isProcessing ? { opacity: 0.5 } : {}),
                }}
              />
            </div>
            <button
              onClick={spendPoints}
              disabled={spendAmount > corruptionPoints || isProcessing}
              style={{
                ...styles.button,
                ...(spendAmount > corruptionPoints || isProcessing
                  ? {
                      backgroundColor: "#d1d5db",
                      color: "#6b7280",
                      cursor: "not-allowed",
                    }
                  : styles.buttonSuccess),
                width: "100%",
              }}
            >
              {isProcessing
                ? "Processing..."
                : `Absolve ${spendAmount} Point${spendAmount !== 1 ? "s" : ""}`}
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          fontSize: "12px",
          color: theme.textSecondary,
          marginTop: "16px",
          padding: "8px",
          backgroundColor: theme.background,
          borderRadius: "6px",
          border: `1px solid ${theme.border}`,
        }}
      >
        <strong>Save DCs:</strong> Pure (10) → Pragmatic (12) → Devious (14) →
        Vicious (16) → Vile (18)
      </div>
    </div>
  );
};

export default CorruptionTracker;
