import React, { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getCharacterSheetStyles } from "../../styles/masterStyles";
import { useRollFunctions } from "../utils/diceRoller";

export const CorruptionTracker = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  selectedCharacterId,
}) => {
  const { rollCorruption } = useRollFunctions();
  const { theme } = useTheme();
  const styles = getCharacterSheetStyles(theme);

  const [corruptionPoints, setCorruptionPoints] = useState(0);
  const [spendAmount, setSpendAmount] = useState(1);
  const [spendReason, setSpendReason] = useState("");
  const [gainAmount, setGainAmount] = useState(1);
  const [gainReason, setGainReason] = useState("");
  const [showGainSection, setShowGainSection] = useState(false);
  const [showRedeemSection, setShowRedeemSection] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (character?.corruptionPoints !== undefined) {
      setCorruptionPoints(character.corruptionPoints);
    }
  }, [character?.corruptionPoints]);

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

  const updateCorruptionPoints = async (newTotal) => {
    if (!character || !selectedCharacterId || !discordUserId) {
      console.error("Missing required data:", {
        hasCharacter: !!character,
        hasSelectedCharacterId: !!selectedCharacterId,
        hasDiscordUserId: !!discordUserId,
      });
      return;
    }

    const validatedTotal = Math.max(0, newTotal);

    setCorruptionPoints(validatedTotal);
    setCharacter((prev) => ({
      ...prev,
      corruptionPoints: validatedTotal,
    }));

    try {
      const { error } = await supabase
        .from("character_resources")
        .update({
          corruption_points: validatedTotal,
          updated_at: new Date().toISOString(),
        })
        .eq("character_id", selectedCharacterId)
        .eq("discord_user_id", character?.discord_user_id || discordUserId)
        .select()
        .single();

      if (error) {
        console.error("Database error updating corruption points:", error);

        if (error.code === "PGRST116") {
          const { error: createError } = await supabase
            .from("character_resources")
            .insert({
              character_id: selectedCharacterId,
              discord_user_id: character?.discord_user_id || discordUserId,
              corruption_points: validatedTotal,
              sorcery_points: 0,
              max_sorcery_points: 0,
            })
            .select()
            .single();

          if (createError) {
            throw createError;
          }

          return;
        }

        throw error;
      }
    } catch (err) {
      console.error("Error updating corruption points:", err);

      const originalValue = character.corruptionPoints || 0;
      setCorruptionPoints(originalValue);
      setCharacter((prev) => ({
        ...prev,
        corruptionPoints: originalValue,
      }));

      const errorMessage = err.message?.includes(
        'relation "character_resources" does not exist'
      )
        ? "Database table not found. Please contact support."
        : err.message?.includes("permission")
        ? "Permission denied. Please check your login status."
        : "Failed to update corruption points. Please try again.";

      alert(errorMessage);
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

  const getSubsectionStyle = (color) => ({
    padding: "12px",
    backgroundColor: theme.surface,
    borderRadius: "8px",
    border: `1px solid ${color}40`,
  });

  const getInputStyle = (disabled = false) => ({
    padding: "8px 12px",
    backgroundColor: theme.surface,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: "6px",
    fontSize: "14px",
    transition: "all 0.2s ease",
    outline: "none",
    ...(disabled ? { opacity: 0.5, cursor: "not-allowed" } : {}),
    "&:focus": {
      borderColor: theme.primary,
      boxShadow: `0 0 0 2px ${theme.primary}20`,
    },
  });

  const getButtonStyle = (type = "default", disabled = false) => {
    let baseStyle = {
      padding: "10px 16px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "600",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: theme.surface,
        color: theme.textSecondary,
        cursor: "not-allowed",
        opacity: 0.6,
        border: `1px solid ${theme.border}`,
      };
    }

    switch (type) {
      case "danger":
        return {
          ...baseStyle,
          backgroundColor: "#dc2626",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#b91c1c",
          },
        };
      case "success":
        return {
          ...baseStyle,
          backgroundColor: "#059669",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#047857",
          },
        };
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: "#7c2d12",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#9a3412",
          },
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.primary,
          color: "#ffffff",
          "&:hover": {
            backgroundColor: theme.secondary,
          },
        };
    }
  };

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
            background: `linear-gradient(135deg, ${currentTier.color}, ${theme.surface})`,
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
        </button>

        {showGainSection && (
          <div style={getSubsectionStyle("#991b1b")}>
            <div
              style={{
                fontSize: "11px",
                color: theme.textSecondary,
                marginBottom: "8px",
                fontStyle: "italic",
              }}
            >
              Add corruption points directly for dark deeds and morally
              questionable actions
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "12px",
                alignItems: "stretch",
              }}
            >
              <input
                type="number"
                min="1"
                max="10"
                value={gainAmount}
                onChange={(e) =>
                  setGainAmount(Math.max(1, parseInt(e.target.value) || 1))
                }
                disabled={isProcessing}
                style={{
                  ...getInputStyle(isProcessing),
                  width: "80px",
                  flexShrink: 0,
                }}
              />
              <input
                type="text"
                placeholder="Describe the dark deed (murder, betrayal, etc.)..."
                value={gainReason}
                onChange={(e) => setGainReason(e.target.value)}
                disabled={isProcessing}
                style={{
                  ...getInputStyle(isProcessing),
                  flex: 1,
                  minWidth: 0,
                }}
              />
            </div>
            <button
              onClick={addPoints}
              disabled={gainAmount < 1 || isProcessing}
              style={{
                ...getButtonStyle("danger", gainAmount < 1 || isProcessing),
                width: "100%",
              }}
            >
              {isProcessing
                ? "Processing..."
                : `Add ${gainAmount} Corruption Point${
                    gainAmount !== 1 ? "s" : ""
                  }`}
            </button>
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
          <div style={getSubsectionStyle("#059669")}>
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "12px",
                alignItems: "stretch",
              }}
            >
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
                  ...getInputStyle(isProcessing),
                  width: "80px",
                  flexShrink: 0,
                }}
              />
              <input
                type="text"
                placeholder="Act of kindness, showing remorse..."
                value={spendReason}
                onChange={(e) => setSpendReason(e.target.value)}
                disabled={isProcessing}
                style={{
                  ...getInputStyle(isProcessing),
                  flex: 1,
                  minWidth: 0,
                }}
              />
            </div>
            <button
              onClick={spendPoints}
              disabled={spendAmount > corruptionPoints || isProcessing}
              style={{
                ...getButtonStyle(
                  "success",
                  spendAmount > corruptionPoints || isProcessing
                ),
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
          backgroundColor: theme.surface,
          borderRadius: "6px",
          border: `1px solid ${theme.border}`,
        }}
      >
        <strong>Corruption Tiers:</strong> Pure Hearted (0) → Pragmatic (1-4) →
        Devious (5-7) → Vicious (8-11) → Vile (12+)
      </div>
    </div>
  );
};

export default CorruptionTracker;
