import { useState } from "react";
import { Sparkles, Zap, PlusIcon, MinusIcon } from "lucide-react";

const SorceryPointTracker = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  selectedCharacterId,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSorceryModal, setShowSorceryModal] = useState(false);
  const [sorceryModalData, setSorceryModalData] = useState({
    action: "use",
    amount: 1,
  });

  const currentSorceryPoints = character?.sorceryPoints || 0;
  const maxSorceryPoints = character?.maxSorceryPoints || 0;

  const getSorceryPointColor = () => {
    if (maxSorceryPoints === 0) return "#6b7280";
    const percentage = currentSorceryPoints / maxSorceryPoints;
    if (percentage >= 0.75) return "#10b981";
    if (percentage >= 0.5) return "#3b82f6";
    if (percentage >= 0.25) return "#f59e0b";
    return "#ef4444";
  };

  const handleSorceryPointChange = async (change, action) => {
    if (!character || isUpdating) return;

    setIsUpdating(true);

    try {
      const newSorceryPoints = Math.max(
        0,
        Math.min(maxSorceryPoints || 999, currentSorceryPoints + change)
      );

      const { error } = await supabase.from("character_resources").upsert(
        {
          character_id: selectedCharacterId,
          discord_user_id: discordUserId,
          sorcery_points: newSorceryPoints,
          max_sorcery_points: maxSorceryPoints,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "character_id,discord_user_id",
        }
      );

      if (error) {
        console.error("Error updating sorcery points:", error);
        alert("Failed to update sorcery points");
        return;
      }

      setCharacter((prev) => ({
        ...prev,
        sorceryPoints: newSorceryPoints,
      }));

      const discordWebhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL;
      if (discordWebhookUrl) {
        const embed = {
          title: `${character.name} - ${action}`,
          color: change > 0 ? 0x10b981 : 0xf59e0b,
          fields: [
            {
              name: "Change",
              value: `${change > 0 ? "+" : ""}${change} Sorcery Points`,
              inline: true,
            },
            {
              name: "Current Total",
              value: `${newSorceryPoints}${
                maxSorceryPoints > 0 ? `/${maxSorceryPoints}` : ""
              } Sorcery Points`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Sorcery Points",
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

      setShowSorceryModal(false);
      setSorceryModalData({ action: "use", amount: 1 });
    } catch (error) {
      console.error("Error updating sorcery points:", error);
      alert("Error updating sorcery points. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const openSorceryModal = (action) => {
    setSorceryModalData({ action, amount: 1 });
    setShowSorceryModal(true);
  };

  const styles = {
    container: {
      backgroundColor: "#1f2937",
      border: "1px solid #374151",
      borderRadius: "12px",
      padding: "20px",
      minHeight: "120px",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#a855f7",
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "16px",
    },
    sorceryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "12px",
      maxWidth: "240px", // Limit to about 2 tiles max
    },
    slotItem: {
      backgroundColor: "#374151",
      border: "1px solid #4b5563",
      borderRadius: "8px",
      padding: "12px",
      textAlign: "center",
      position: "relative",
      cursor: "pointer",
    },
    slotLevel: {
      fontSize: "14px",
      color: "#9ca3af",
      marginBottom: "4px",
      fontWeight: "500",
    },
    slotDisplay: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    slotButtons: {
      display: "flex",
      gap: "4px",
      justifyContent: "center",
    },
    slotButton: {
      padding: "2px 6px",
      borderRadius: "4px",
      border: "none",
      fontSize: "10px",
      cursor: "pointer",
      fontWeight: "600",
      minWidth: "50px",
      minHeight: "24px",
    },
    addSlotButton: {
      backgroundColor: "#10b981",
      color: "white",
    },
    useSlotButton: {
      backgroundColor: "#f59e0b",
      color: "white",
    },
    modal: {
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
    },
    modalContent: {
      backgroundColor: "#1f2937",
      border: "1px solid #374151",
      borderRadius: "12px",
      padding: "24px",
      minWidth: "300px",
      maxWidth: "400px",
    },
    modalHeader: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#f9fafb",
      marginBottom: "16px",
      textAlign: "center",
    },
    inputGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      color: "#d1d5db",
      fontSize: "14px",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      backgroundColor: "#374151",
      border: "1px solid #4b5563",
      borderRadius: "6px",
      color: "#f9fafb",
      fontSize: "16px",
    },
    modalButtons: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    modalButton: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer",
    },
    cancelButton: {
      backgroundColor: "#6b7280",
      color: "white",
    },
    confirmButton: {
      backgroundColor: "#3b82f6",
      color: "white",
    },
    emptyState: {
      textAlign: "center",
      color: "#9ca3af",
      fontSize: "14px",
      padding: "20px",
    },
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.header}>
          <Sparkles size={20} />
          Sorcery Points
        </div>

        <div style={styles.sorceryGrid}>
          <div style={styles.slotItem} onClick={() => openSorceryModal("use")}>
            <div style={styles.slotLevel}>Available</div>
            <div
              style={{
                ...styles.slotDisplay,
                color: getSorceryPointColor(),
              }}
            >
              {currentSorceryPoints}
            </div>
            <div style={styles.slotButtons}>
              <button
                style={{ ...styles.slotButton, ...styles.addSlotButton }}
                onClick={(e) => {
                  e.stopPropagation();
                  openSorceryModal("add");
                }}
                disabled={isUpdating}
              >
                <PlusIcon size={12} />
              </button>
              <button
                style={{ ...styles.slotButton, ...styles.useSlotButton }}
                onClick={(e) => {
                  e.stopPropagation();
                  openSorceryModal("use");
                }}
                disabled={isUpdating || currentSorceryPoints === 0}
              >
                <MinusIcon size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sorcery Points Modal */}
      {showSorceryModal && (
        <div style={styles.modal} onClick={() => setShowSorceryModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <Zap
                size={20}
                style={{
                  marginRight: "8px",
                  color:
                    sorceryModalData.action === "add" ? "#10b981" : "#f59e0b",
                }}
              />
              {sorceryModalData.action === "add" ? "Add" : "Use"} Sorcery Points
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Points to {sorceryModalData.action === "add" ? "Add" : "Use"}:
              </label>
              <input
                type="number"
                min="1"
                max={
                  sorceryModalData.action === "add" ? 20 : currentSorceryPoints
                }
                value={sorceryModalData.amount}
                onChange={(e) =>
                  setSorceryModalData((prev) => ({
                    ...prev,
                    amount: Math.max(1, parseInt(e.target.value) || 1),
                  }))
                }
                style={styles.input}
                autoFocus
              />
            </div>

            <div style={styles.modalButtons}>
              <button
                style={{ ...styles.modalButton, ...styles.cancelButton }}
                onClick={() => setShowSorceryModal(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.confirmButton }}
                onClick={() =>
                  handleSorceryPointChange(
                    sorceryModalData.action === "add"
                      ? sorceryModalData.amount
                      : -sorceryModalData.amount,
                    sorceryModalData.action === "add"
                      ? "Sorcery Points Added"
                      : "Sorcery Points Used"
                  )
                }
                disabled={isUpdating}
              >
                {isUpdating
                  ? sorceryModalData.action === "add"
                    ? "Adding..."
                    : "Using..."
                  : `${sorceryModalData.action === "add" ? "Add" : "Use"} ${
                      sorceryModalData.amount
                    }`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SorceryPointTracker;
