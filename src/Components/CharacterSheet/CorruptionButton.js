import { useState, useEffect } from "react";
import { Flame, X, Plus, Minus } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useRollFunctions } from "../utils/diceRoller";

const CorruptionButton = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  selectedCharacterId,
}) => {
  const { rollCorruption } = useRollFunctions();
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [corruptionPoints, setCorruptionPoints] = useState(0);
  const [spendAmount, setSpendAmount] = useState(1);
  const [spendReason, setSpendReason] = useState("");
  const [gainAmount, setGainAmount] = useState(1);
  const [gainReason, setGainReason] = useState("");
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
        color: "#fb923c",
        saveDC: 12,
        boon: "Empowered Darkness",
        effect: null,
      };
    if (points <= 7)
      return {
        name: "Devious",
        range: "(5-7)",
        color: "#dc2626",
        saveDC: 14,
        boon: null,
        effect: "Mild Effect",
      };
    if (points <= 11)
      return {
        name: "Vicious",
        range: "(8-11)",
        color: "#991b1b",
        saveDC: 16,
        boon: "Heightened Darkness",
        effect: "Severe Effect",
      };
    return {
      name: "Vile",
      range: "(12+)",
      color: "#450a0a",
      saveDC: 18,
      boon: null,
      effect: "Severe Effect",
    };
  };

  const currentTier = getCorruptionTier(corruptionPoints);

  const updateCorruptionPoints = async (newTotal) => {
    if (!character || !selectedCharacterId || !discordUserId) {
      console.error("Missing required data");
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
        .eq("discord_user_id", discordUserId)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          const { error: createError } = await supabase
            .from("character_resources")
            .insert({
              character_id: selectedCharacterId,
              discord_user_id: discordUserId,
              corruption_points: validatedTotal,
              sorcery_points: 0,
              max_sorcery_points: 0,
            })
            .select()
            .single();

          if (createError) throw createError;
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
    const reason = spendReason || "Dark power unleashed";

    await updateCorruptionPoints(newTotal);

    if (rollCorruption) {
      rollCorruption({
        character,
        pointsSpent: spendAmount,
        reason: reason,
        pointsRemaining: newTotal,
        type: "spent",
      });
    }

    setSpendReason("");
    setIsProcessing(false);
  };

  const getTileStyle = () => {
    return {
      backgroundColor: corruptionPoints > 0 ? currentTier.color : "transparent",
      border: `2px solid ${currentTier.color}`,
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      opacity: 1,
      transition: "all 0.2s ease",
      justifyContent: "center",
      width: "120px",
      height: "40px",
      color: corruptionPoints > 0 ? "#ffffff" : currentTier.color,
      boxShadow:
        corruptionPoints > 0 ? `0 0 15px ${currentTier.color}40` : "none",
    };
  };

  return (
    <>
      <div
        style={getTileStyle()}
        onClick={() => setShowModal(true)}
        title={`Corruption: ${corruptionPoints} (${currentTier.name}). Click to manage corruption points.`}
      >
        <Flame
          size={18}
          style={{
            color: corruptionPoints > 0 ? "#ffffff" : currentTier.color,
          }}
        />
        <div
          style={{
            fontSize: "0.875rem",
            color: corruptionPoints > 0 ? "#ffffff" : currentTier.color,
          }}
        >
          Corruption
        </div>
      </div>

      {showModal && (
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
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: theme.background,
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
              width: "600px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              border: `2px solid ${currentTier.color}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: theme.background,
                padding: "20px 24px",
                borderBottom: `2px solid ${theme.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: theme.text,
                }}
              >
                <Flame size={24} style={{ color: currentTier.color }} />
                Corruption Points
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: theme.textSecondary,
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: "24px" }}>
              {/* Current Corruption Display */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "32px",
                  padding: "24px",
                  backgroundColor: theme.surface,
                  borderRadius: "12px",
                  border: `2px solid ${currentTier.color}`,
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: "bold",
                    color: currentTier.color,
                    marginBottom: "8px",
                  }}
                >
                  {corruptionPoints}
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: currentTier.color,
                    marginBottom: "4px",
                  }}
                >
                  {currentTier.name} {currentTier.range}
                </div>
                {(currentTier.boon || currentTier.effect) && (
                  <div
                    style={{
                      marginTop: "12px",
                      fontSize: "14px",
                      color: theme.text,
                    }}
                  >
                    {currentTier.boon && <div>Boon: {currentTier.boon}</div>}
                    {currentTier.effect && (
                      <div>Effect: {currentTier.effect}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Gain Corruption Section */}
              <div
                style={{
                  marginBottom: "24px",
                  padding: "20px",
                  backgroundColor: theme.surface,
                  borderRadius: "12px",
                  border: `2px solid #dc2626`,
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#dc2626",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Plus size={20} />
                  Gain Corruption (Dark Deeds)
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: theme.text,
                      marginBottom: "6px",
                    }}
                  >
                    Amount
                  </label>
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
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: theme.background,
                      color: theme.text,
                      border: `2px solid ${theme.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: theme.text,
                      marginBottom: "6px",
                    }}
                  >
                    Reason (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Describe the dark deed..."
                    value={gainReason}
                    onChange={(e) => setGainReason(e.target.value)}
                    disabled={isProcessing}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: theme.background,
                      color: theme.text,
                      border: `2px solid ${theme.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <button
                  onClick={addPoints}
                  disabled={gainAmount < 1 || isProcessing}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor:
                      gainAmount < 1 || isProcessing
                        ? theme.surface
                        : "#dc2626",
                    color:
                      gainAmount < 1 || isProcessing
                        ? theme.textSecondary
                        : "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor:
                      gainAmount < 1 || isProcessing
                        ? "not-allowed"
                        : "pointer",
                    opacity: gainAmount < 1 || isProcessing ? 0.6 : 1,
                    transition: "all 0.2s ease",
                  }}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Add ${gainAmount} Corruption Point${
                        gainAmount !== 1 ? "s" : ""
                      }`}
                </button>
              </div>

              {/* Spend Corruption Section */}
              <div
                style={{
                  padding: "20px",
                  backgroundColor: theme.surface,
                  borderRadius: "12px",
                  border: `2px solid #8b5cf6`,
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#8b5cf6",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Minus size={20} />
                    Spend Corruption
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "normal",
                      color: theme.text,
                    }}
                  >
                    {corruptionPoints} available
                  </span>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: theme.text,
                      marginBottom: "6px",
                    }}
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={corruptionPoints}
                    value={spendAmount}
                    onChange={(e) =>
                      setSpendAmount(
                        Math.max(
                          1,
                          Math.min(
                            corruptionPoints,
                            parseInt(e.target.value) || 1
                          )
                        )
                      )
                    }
                    disabled={isProcessing || corruptionPoints === 0}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: theme.background,
                      color: theme.text,
                      border: `2px solid ${theme.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: theme.text,
                      marginBottom: "6px",
                    }}
                  >
                    Reason (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="What dark power are you unleashing?"
                    value={spendReason}
                    onChange={(e) => setSpendReason(e.target.value)}
                    disabled={isProcessing || corruptionPoints === 0}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: theme.background,
                      color: theme.text,
                      border: `2px solid ${theme.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <button
                  onClick={spendPoints}
                  disabled={
                    spendAmount > corruptionPoints ||
                    isProcessing ||
                    corruptionPoints === 0
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor:
                      spendAmount > corruptionPoints ||
                      isProcessing ||
                      corruptionPoints === 0
                        ? theme.surface
                        : "#8b5cf6",
                    color:
                      spendAmount > corruptionPoints ||
                      isProcessing ||
                      corruptionPoints === 0
                        ? theme.textSecondary
                        : "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor:
                      spendAmount > corruptionPoints ||
                      isProcessing ||
                      corruptionPoints === 0
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      spendAmount > corruptionPoints ||
                      isProcessing ||
                      corruptionPoints === 0
                        ? 0.6
                        : 1,
                    transition: "all 0.2s ease",
                  }}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Spend ${spendAmount} Point${
                        spendAmount !== 1 ? "s" : ""
                      }`}
                </button>
              </div>

              {/* Corruption Tiers Info */}
              <div
                style={{
                  marginTop: "24px",
                  padding: "16px",
                  backgroundColor: theme.surface,
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  fontSize: "13px",
                  color: theme.textSecondary,
                  lineHeight: "1.6",
                }}
              >
                <strong style={{ color: theme.text }}>Corruption Tiers:</strong>
                <br />
                Pure Hearted (0) → Pragmatic (1-4) → Devious (5-7) → Vicious
                (8-11) → Vile (12+)
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CorruptionButton;
