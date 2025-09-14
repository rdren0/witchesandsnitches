import { useState } from "react";
import {
  Sparkles,
  Zap,
  PlusIcon,
  MinusIcon,
  Settings,
  Edit3,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getDiscordWebhook } from "../../App/const";
import { SORCERY_POINT_PROGRESSION } from "../../SharedData/data";

const SorceryPointTracker = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  selectedCharacterId,
}) => {
  const currentSorceryPoints = character?.sorceryPoints || 0;
  const maxSorceryPoints = character?.maxSorceryPoints || 0;
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSorceryModal, setShowSorceryModal] = useState(false);
  const [sorceryModalData, setSorceryModalData] = useState({
    action: "use",
    amount: 1,
    currentValue: currentSorceryPoints,
    maxValue: maxSorceryPoints,
  });
  const { theme } = useTheme();

  const getSorceryPointColor = () => {
    if (maxSorceryPoints === 0) return "#a855f7";
    const percentage = currentSorceryPoints / maxSorceryPoints;
    if (percentage >= 0.75) return "#10b981";
    if (percentage >= 0.5) return "#3b82f6";
    if (percentage >= 0.25) return "#f59e0b";
    return "#ef4444";
  };

  const handleSorceryPointChange = async (
    change,
    action,
    isDirectSet = false,
    newMaxSorceryPoints = null
  ) => {
    if (!character || isUpdating) return;

    setIsUpdating(true);

    try {
      const newSorceryPoints = isDirectSet
        ? Math.max(0, change)
        : Math.max(0, currentSorceryPoints + change);

      const finalMaxSorceryPoints =
        newMaxSorceryPoints !== null
          ? Math.max(0, newMaxSorceryPoints)
          : maxSorceryPoints;

      const { error } = await supabase.from("character_resources").upsert(
        {
          character_id: selectedCharacterId,
          discord_user_id: discordUserId,
          sorcery_points: newSorceryPoints,
          max_sorcery_points: finalMaxSorceryPoints,
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
        maxSorceryPoints: finalMaxSorceryPoints,
      }));

      const discordWebhookUrl = getDiscordWebhook(character?.gameSession);

      if (discordWebhookUrl) {
        const embed = {
          title: `${action}`,
          color: change > 0 ? 0x10b981 : 0xf59e0b,
          fields: [
            {
              name: isDirectSet ? "Set To" : "Change",
              value: isDirectSet
                ? `${change} Sorcery Points`
                : `${change > 0 ? "+" : ""}${change} Sorcery Points`,
              inline: true,
            },
            {
              name: "Current Total",
              value: `${newSorceryPoints}${
                finalMaxSorceryPoints > 0 ? `/${finalMaxSorceryPoints}` : ""
              } Sorcery Points`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: `${character.name} - Sorcery Points`,
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
    setSorceryModalData({
      action,
      amount: action === "set" ? currentSorceryPoints : 1,
      currentValue: currentSorceryPoints,
      maxValue: maxSorceryPoints,
    });
    setShowSorceryModal(true);
  };

  const setupSorceryPoints = async () => {
    if (!character || isUpdating) return;

    setIsUpdating(true);

    try {
      const characterLevel = character.level || 1;
      const maxPoints = SORCERY_POINT_PROGRESSION[characterLevel] || 0;

      const { error } = await supabase.from("character_resources").upsert(
        {
          character_id: selectedCharacterId,
          discord_user_id: discordUserId,
          sorcery_points: maxPoints,
          max_sorcery_points: maxPoints,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "character_id,discord_user_id",
        }
      );

      if (error) {
        console.error("Error setting up sorcery points:", error);
        alert("Failed to setup sorcery points");
        return;
      }

      setCharacter((prev) => ({
        ...prev,
        sorceryPoints: maxPoints,
        maxSorceryPoints: maxPoints,
      }));

      console.log(
        `Sorcery points set up: ${maxPoints} for level ${characterLevel}`
      );
    } catch (error) {
      console.error("Error setting up sorcery points:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const styles = {
    container: {
      backgroundColor: theme.surface,
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
      maxWidth: "240px",
    },
    slotItem: {
      backgroundColor: theme.surface,
      border: `1px solid ${theme.primary}`,
      borderRadius: "8px",
      padding: "12px",
      textAlign: "center",
      position: "relative",
      cursor: "pointer",
    },
    slotLevel: {
      fontSize: "14px",
      color: theme.text,
      marginBottom: "4px",
      fontWeight: "500",
    },
    slotDisplay: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "8px",
      color: "#a855f7",
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
      backgroundColor: theme.background,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: theme.background,
      border: `2px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "24px",
      minWidth: "300px",
      maxWidth: "400px",
    },
    modalHeader: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "16px",
      textAlign: "center",
    },
    inputGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      color: theme.text,
      fontSize: "14px",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      backgroundColor: theme.background,
      border: `2px solid ${theme.border}`,
      borderRadius: "6px",
      color: theme.text,
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

        {maxSorceryPoints === 0 && character?.level >= 2 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p style={{ color: theme.textSecondary, marginBottom: "16px" }}>
              Sorcery points not initialized for this character.
            </p>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: theme.primary,
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={setupSorceryPoints}
              disabled={isUpdating}
            >
              <Settings size={16} />
              {isUpdating ? "Setting up..." : "Setup Sorcery Points"}
            </button>
          </div>
        ) : character?.level < 2 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p style={{ color: theme.textSecondary }}>
              Sorcery points become available at level 2 (Font of Magic)
            </p>
          </div>
        ) : (
          <div style={styles.sorceryGrid}>
            <div
              style={styles.slotItem}
              onClick={() => openSorceryModal("use")}
            >
              <div style={styles.slotLevel}>Available</div>
              <div
                style={{
                  ...styles.slotDisplay,
                  color: getSorceryPointColor(),
                }}
              >
                {currentSorceryPoints}/{maxSorceryPoints}
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
                <button
                  style={{
                    ...styles.slotButton,
                    backgroundColor: "#8b5cf6",
                    color: "white",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openSorceryModal("edit");
                  }}
                  disabled={isUpdating}
                  title="Edit current and maximum values"
                >
                  <Edit3 size={12} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showSorceryModal && (
        <div style={styles.modal} onClick={() => setShowSorceryModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <Zap
                size={20}
                style={{
                  marginRight: "8px",
                  color:
                    sorceryModalData.action === "add"
                      ? "#10b981"
                      : sorceryModalData.action === "edit"
                      ? "#8b5cf6"
                      : "#f59e0b",
                }}
              />
              {sorceryModalData.action === "add"
                ? "Add"
                : sorceryModalData.action === "edit"
                ? "Edit"
                : "Use"}{" "}
              Sorcery Points
            </div>

            {sorceryModalData.action === "edit" ? (
              <div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Current Sorcery Points:</label>
                  <input
                    type="number"
                    min="0"
                    value={sorceryModalData.currentValue}
                    onChange={(e) =>
                      setSorceryModalData((prev) => ({
                        ...prev,
                        currentValue: Math.max(
                          0,
                          parseInt(e.target.value) || 0
                        ),
                      }))
                    }
                    style={styles.input}
                    autoFocus
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Maximum Sorcery Points:</label>
                  <input
                    type="number"
                    min="0"
                    value={sorceryModalData.maxValue}
                    onChange={(e) =>
                      setSorceryModalData((prev) => ({
                        ...prev,
                        maxValue: Math.max(0, parseInt(e.target.value) || 0),
                      }))
                    }
                    style={styles.input}
                  />
                </div>
              </div>
            ) : (
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Points to {sorceryModalData.action === "add" ? "Add" : "Use"}:
                </label>
                <input
                  type="number"
                  min="1"
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
            )}

            <div style={styles.modalButtons}>
              <button
                style={{ ...styles.modalButton, ...styles.cancelButton }}
                onClick={() => setShowSorceryModal(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.confirmButton }}
                onClick={() => {
                  if (sorceryModalData.action === "edit") {
                    handleSorceryPointChange(
                      sorceryModalData.currentValue,
                      "Sorcery Points Updated",
                      true,
                      sorceryModalData.maxValue
                    );
                  } else {
                    handleSorceryPointChange(
                      sorceryModalData.action === "add"
                        ? sorceryModalData.amount
                        : -sorceryModalData.amount,
                      sorceryModalData.action === "add"
                        ? "Sorcery Points Added"
                        : "Sorcery Points Used"
                    );
                  }
                }}
                disabled={isUpdating}
              >
                {isUpdating
                  ? sorceryModalData.action === "add"
                    ? "Adding..."
                    : sorceryModalData.action === "edit"
                    ? "Updating..."
                    : "Using..."
                  : sorceryModalData.action === "edit"
                  ? `Update (${sorceryModalData.currentValue}/${sorceryModalData.maxValue})`
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
