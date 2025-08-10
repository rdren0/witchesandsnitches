import { useState } from "react";
import { Star, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getDiscordWebhook } from "../../App/const";

const InspirationTracker = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  selectedCharacterId,
  isAdmin = false,
}) => {
  const { theme } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const hasInspiration = Boolean(character?.inspiration);

  const handleInspirationToggle = async (newState) => {
    if (!character || isUpdating) return;

    setIsUpdating(true);
    const effectiveUserId = isAdmin ? character.ownerId : discordUserId;

    try {
      const updateData = {
        character_id: selectedCharacterId,
        discord_user_id: effectiveUserId,
        inspiration: newState,
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
        alert(`Failed to update inspiration: ${error.message}`);
        return;
      }

      setCharacter((prev) => ({
        ...prev,
        inspiration: newState,
      }));

      const discordWebhookUrl = getDiscordWebhook(character?.gameSession);

      if (discordWebhookUrl) {
        const embed = {
          title: `Inspiration ${newState ? "Earned" : "Redeemed"}`,
          color: newState ? 0x10b981 : 0xf59e0b,
          fields: [
            {
              name: "Status",
              value: newState
                ? "✨ Gained Inspiration!"
                : "💡 Used Inspiration",
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: `${character.name} - Inspiration`,
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

      setShowModal(false);
    } catch (error) {
      console.error("Error updating inspiration:", error);
      alert("Error updating inspiration. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTileClick = () => {
    if (isUpdating) return;

    if (hasInspiration) {
      setShowModal(true);
    } else if (isAdmin) {
      handleInspirationToggle(true);
    }
  };

  const getInspirationColor = () => {
    return hasInspiration ? "white" : "#f59e0b";
  };

  const getTileStyle = () => {
    const baseStyle = {
      backgroundColor: hasInspiration ? "#f59e0b" : "transparent",
      border: " 2px solid #f59e0b",
      borderRadius: "8px",
      cursor: !hasInspiration ? "not-allowed" : "pointer",
      fontSize: "14px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      opacity: hasInspiration ? 0.6 : 1,
      transition: "all 0.2s ease",
      justifyContent: "center",
      width: "120px",
      height: "40px",
      pointer: hasInspiration ? "pointer" : "not-allowed",
    };

    if (hasInspiration) {
      baseStyle.boxShadow = "0 0 15px rgba(245, 158, 11, 0.3)";
    }

    return baseStyle;
  };

  return (
    <>
      <div
        style={getTileStyle()}
        onClick={handleTileClick}
        title={
          hasInspiration
            ? "Click to use inspiration (advantage on one roll)"
            : isAdmin
            ? "Admin: Click to grant inspiration"
            : "No inspiration available. The DM is the only one who can award inspiration."
        }
      >
        <Star
          className="w-6 h-6 mx-auto mb-1"
          style={{
            color: getInspirationColor(),
            fill: hasInspiration ? "#f59e0b" : "transparent",
          }}
          size={18}
        />

        <div
          style={{
            fontSize: "0.875rem",
            color: getInspirationColor(),
          }}
        >
          Inspiration
        </div>

        {isUpdating && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            ...
          </div>
        )}
      </div>

      {showModal && (
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
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: theme.background,
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              minWidth: "300px",
              maxWidth: "400px",
              border: `2px solid #f59e0b`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#f59e0b",
                }}
              >
                <Star size={20} style={{ fill: "#f59e0b", color: "#f59e0b" }} />
                Use Inspiration
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7280",
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
                marginBottom: "20px",
                color: theme.text,
                lineHeight: "1.5",
              }}
            >
              <p style={{ margin: "0 0 12px 0" }}>
                Are you sure you want to use your inspiration?
              </p>
              <div
                style={{
                  backgroundColor: theme.surface,
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: theme.text,
                }}
              >
                <strong>Inspiration allows you to:</strong>
                <br />
                • Gain advantage on one ability check, attack roll, or saving
                throw
                <br />• Use it before or after you roll, but before the outcome
                is determined
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
                  border: theme.border,
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onClick={() => setShowModal(false)}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isUpdating ? "wait" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: isUpdating ? 0.7 : 1,
                }}
                onClick={() => handleInspirationToggle(false)}
                disabled={isUpdating}
              >
                <Star size={16} />
                {isUpdating ? "Using..." : "Use Inspiration"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InspirationTracker;
