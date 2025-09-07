import { useState } from "react";
import { Clover, Plus, Minus } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useRollFunctions } from "../utils/diceRoller";
import { getDiscordWebhook } from "../../App/const";

const LuckPointButton = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  selectedCharacterId,
  isAdmin = false,
}) => {
  const { theme } = useTheme();
  const { rollLuckPoint } = useRollFunctions();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const getProficiencyBonus = (level) => {
    if (level <= 4) return 2;
    if (level <= 8) return 3;
    if (level <= 12) return 4;
    if (level <= 16) return 5;
    return 6;
  };

  const hasLuckyFeat = () => {
    return (
      character?.selectedFeats?.some((feat) =>
        typeof feat === "string" ? feat === "Lucky" : feat?.name === "Lucky"
      ) ||
      character?.feats?.some((feat) =>
        typeof feat === "string" ? feat === "Lucky" : feat?.name === "Lucky"
      ) ||
      character?.standardFeats?.some((feat) =>
        typeof feat === "string" ? feat === "Lucky" : feat?.name === "Lucky"
      )
    );
  };

  if (!hasLuckyFeat()) {
    return null;
  }

  const maxLuckPoints = getProficiencyBonus(character?.level || 1);
  const currentLuckPoints = character?.luck ?? maxLuckPoints;

  const updateLuckPoints = async (newCurrent) => {
    if (!character || isUpdating) return;

    setIsUpdating(true);
    const effectiveUserId = isAdmin ? character.ownerId : discordUserId;
    const validatedCurrent = Math.max(0, Math.min(maxLuckPoints, newCurrent));

    try {
      const updateData = {
        character_id: selectedCharacterId,
        discord_user_id: effectiveUserId,
        luck: validatedCurrent,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("character_resources")
        .upsert(updateData, {
          onConflict: "character_id,discord_user_id",
        })
        .select();

      if (error) {
        console.error("Database error:", error);
        alert(`Failed to update luck points: ${error.message}`);
        return;
      }

      await sendLuckPointDiscordMessage(
        validatedCurrent,
        maxLuckPoints,
        newCurrent > currentLuckPoints ? "gained" : "spent"
      );

      return validatedCurrent;
    } catch (error) {
      console.error("Error updating luck points:", error);
      alert("Failed to update luck points. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const sendLuckPointDiscordMessage = async (newPoints, maxPoints, action) => {
    const discordWebhookUrl = getDiscordWebhook(character?.gameSession);

    if (!discordWebhookUrl) return;

    const embed = {
      title: `Luck Point ${action === "gained" ? "Restored" : "Spent"}`,
      color: 0x065f46,
      fields: [
        {
          name: "Luck Points",
          value: `${newPoints}/${maxPoints}`,
          inline: true,
        },
        {
          name: "Status",
          value: action === "gained" ? "🍀 Luck restored!" : "🎲 Luck spent!",
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: `${character.name} - Lucky Feat`,
      },
    };

    const message = {
      embeds: [embed],
    };

    if (character?.imageUrl) {
      message.username = character.name;
      message.avatar_url = character.imageUrl;
    } else if (character?.image_url) {
      message.username = character.name;
      message.avatar_url = character.image_url;
    }

    try {
      await fetch(discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
    } catch (discordError) {
      console.error("Error sending Discord message:", discordError);
    }
  };

  const spendLuckPoint = async (reason = "Luck manipulation") => {
    if (currentLuckPoints <= 0) return;

    const newCurrent = await updateLuckPoints(currentLuckPoints - 1);

    if (newCurrent !== undefined && rollLuckPoint) {
      rollLuckPoint({
        character,
        pointsSpent: 1,
        reason: reason,
        pointsRemaining: newCurrent,
        maxPoints: maxLuckPoints,
        type: "spent",
      });
    }
    setShowModal(false);
  };

  const restoreLuckPoint = async () => {
    if (currentLuckPoints >= maxLuckPoints) return;

    const newCurrent = await updateLuckPoints(currentLuckPoints + 1);

    if (newCurrent !== undefined && rollLuckPoint) {
      rollLuckPoint({
        character,
        pointsRestored: 1,
        pointsRemaining: newCurrent,
        maxPoints: maxLuckPoints,
        type: "restored",
      });
    }
  };

  const restoreAllLuckPoints = async () => {
    if (currentLuckPoints >= maxLuckPoints) return;

    const pointsRestored = maxLuckPoints - currentLuckPoints;
    const newCurrent = await updateLuckPoints(maxLuckPoints);

    if (newCurrent !== undefined && rollLuckPoint) {
      rollLuckPoint({
        character,
        pointsRestored: pointsRestored,
        pointsRemaining: newCurrent,
        maxPoints: maxLuckPoints,
        type: "long_rest",
      });
    }
    setShowModal(false);
  };

  const buttonStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    padding: "8px 12px",
    height: "40px",
    borderRadius: "8px",
    border: "2px solid #065f46",
    backgroundColor: currentLuckPoints > 0 ? "#065f46" : theme.surface,
    color: currentLuckPoints > 0 ? "white" : "#065f46",
    cursor: isUpdating ? "wait" : "pointer",
    transition: "all 0.2s ease",
    fontSize: "14px",
    fontWeight: "600",
    minWidth: "80px",
  };

  const modalStyle = {
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
  };

  const modalContentStyle = {
    backgroundColor: theme.surface,
    padding: "20px",
    borderRadius: "12px",
    border: `1px solid ${theme.border}`,
    minWidth: "300px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  };

  const buttonGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginTop: "12px",
  };

  const modalButtonStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <>
      <div
        style={buttonStyle}
        onClick={() => setShowModal(true)}
        title={`Luck Points: ${currentLuckPoints}/${maxLuckPoints}\nClick to manage luck points`}
      >
        <Clover size={16} />
        <span>Luck</span>
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            backgroundColor: "#065f46",
            color: "white",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: "bold",
            border: `2px solid ${theme.surface}`,
          }}
        >
          {currentLuckPoints}
        </span>
      </div>

      {showModal && (
        <div style={modalStyle} onClick={() => setShowModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <Clover style={{ color: theme.primary }} size={20} />
              <h3
                style={{
                  margin: 0,
                  color: theme.text,
                  fontSize: "18px",
                  fontWeight: "700",
                }}
              >
                Luck Points
              </h3>
              <div
                style={{
                  marginLeft: "auto",
                  padding: "4px 8px",
                  backgroundColor: theme.primary + "20",
                  color: theme.primary,
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {currentLuckPoints}/{maxLuckPoints}
              </div>
            </div>

            <div
              style={{
                fontSize: "14px",
                color: theme.textSecondary,
                marginBottom: "16px",
                padding: "8px",
                backgroundColor: theme.background,
                borderRadius: "6px",
                border: `1px solid ${theme.border}`,
              }}
            >
              <strong>Lucky Feat:</strong> Spend luck points to gain advantage
              on d20 rolls or impose disadvantage on attacks against you.
            </div>

            <div style={buttonGridStyle}>
              <button
                style={{
                  ...modalButtonStyle,
                  backgroundColor:
                    currentLuckPoints > 0 ? "#ef4444" : theme.surface,
                  color: currentLuckPoints > 0 ? "white" : theme.textSecondary,
                  cursor: currentLuckPoints > 0 ? "pointer" : "not-allowed",
                }}
                onClick={() =>
                  spendLuckPoint("Advantage/disadvantage manipulation")
                }
                disabled={currentLuckPoints <= 0 || isUpdating}
              >
                Spend Point
              </button>

              <button
                style={{
                  ...modalButtonStyle,
                  backgroundColor:
                    currentLuckPoints < maxLuckPoints
                      ? theme.primary
                      : theme.surface,
                  color:
                    currentLuckPoints < maxLuckPoints
                      ? "white"
                      : theme.textSecondary,
                  cursor:
                    currentLuckPoints < maxLuckPoints
                      ? "pointer"
                      : "not-allowed",
                }}
                onClick={restoreLuckPoint}
                disabled={currentLuckPoints >= maxLuckPoints || isUpdating}
              >
                +1 Point
              </button>

              <button
                style={{
                  ...modalButtonStyle,
                  backgroundColor: "#065f46",
                  color: "white",
                  cursor:
                    currentLuckPoints < maxLuckPoints
                      ? "pointer"
                      : "not-allowed",
                  opacity: currentLuckPoints < maxLuckPoints ? 1 : 0.6,
                }}
                onClick={restoreAllLuckPoints}
                disabled={currentLuckPoints >= maxLuckPoints || isUpdating}
              >
                Long Rest
              </button>

              <button
                style={{
                  ...modalButtonStyle,
                  backgroundColor: theme.surface,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                }}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LuckPointButton;
