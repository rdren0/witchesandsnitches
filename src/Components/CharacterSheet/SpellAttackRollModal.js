import React, { useState } from "react";
import { X, Dices } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const SpellAttackRollModal = ({
  character,
  onClose,
  onRoll,
  getSpellAttackBonus,
  formatModifier,
}) => {
  const { theme } = useTheme();
  const [rollType, setRollType] = useState("normal"); // normal, advantage, disadvantage
  const [tempModifier, setTempModifier] = useState(0);

  const baseBonus = getSpellAttackBonus(character);
  const finalBonus = baseBonus + parseInt(tempModifier || 0);

  const handleRoll = () => {
    onRoll(rollType, parseInt(tempModifier || 0));
    onClose();
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      padding: "20px",
    },
    modal: {
      backgroundColor: theme.background,
      borderRadius: "12px",
      maxWidth: "450px",
      width: "100%",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    },
    header: {
      padding: "20px",
      borderBottom: `1px solid ${theme.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      color: theme.text,
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    closeButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
      color: theme.textSecondary,
      display: "flex",
      alignItems: "center",
    },
    body: {
      padding: "24px",
    },
    section: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "12px",
    },
    rollTypeGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "8px",
    },
    rollTypeButton: {
      padding: "12px",
      fontSize: "14px",
      fontWeight: "600",
      borderRadius: "6px",
      border: `2px solid ${theme.border}`,
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundColor: theme.surface,
      color: theme.text,
      textAlign: "center",
    },
    rollTypeButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
      color: "white",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      fontSize: "16px",
      border: `2px solid ${theme.border}`,
      borderRadius: "6px",
      backgroundColor: theme.surface,
      color: theme.text,
      outline: "none",
    },
    helpText: {
      fontSize: "13px",
      color: theme.textSecondary,
      marginTop: "4px",
      fontStyle: "italic",
    },
    previewBox: {
      padding: "16px",
      backgroundColor: `${theme.primary}15`,
      border: `2px solid ${theme.primary}`,
      borderRadius: "8px",
      textAlign: "center",
    },
    previewTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
    },
    previewValue: {
      fontSize: "32px",
      fontWeight: "700",
      color: theme.primary,
    },
    previewSubtext: {
      fontSize: "12px",
      color: theme.textSecondary,
      marginTop: "4px",
    },
    footer: {
      padding: "16px 24px",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    button: {
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: "600",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    cancelButton: {
      backgroundColor: theme.surface,
      color: theme.text,
      border: `1px solid ${theme.border}`,
    },
    rollButton: {
      backgroundColor: "#d1323dff",
      color: "white",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
  };

  const getRollTypeDisplay = () => {
    switch (rollType) {
      case "advantage":
        return "2d20kh1";
      case "disadvantage":
        return "2d20kl1";
      default:
        return "1d20";
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <Dices size={20} color="#d1323dff" />
            Spell Attack Roll
          </h2>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.section}>
            <label style={styles.label}>Roll Type</label>
            <div style={styles.rollTypeGrid}>
              <button
                style={{
                  ...styles.rollTypeButton,
                  ...(rollType === "normal" ? styles.rollTypeButtonActive : {}),
                }}
                onClick={() => setRollType("normal")}
              >
                Normal
              </button>
              <button
                style={{
                  ...styles.rollTypeButton,
                  ...(rollType === "advantage"
                    ? styles.rollTypeButtonActive
                    : {}),
                }}
                onClick={() => setRollType("advantage")}
              >
                Advantage
              </button>
              <button
                style={{
                  ...styles.rollTypeButton,
                  ...(rollType === "disadvantage"
                    ? styles.rollTypeButtonActive
                    : {}),
                }}
                onClick={() => setRollType("disadvantage")}
              >
                Disadvantage
              </button>
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Temporary Modifier</label>
            <input
              type="number"
              value={tempModifier}
              onChange={(e) => setTempModifier(e.target.value)}
              placeholder="0"
              style={styles.input}
              min="-99"
              max="99"
            />
            <div style={styles.helpText}>
              Add a one-time bonus or penalty to this roll (e.g., +1 from
              Bless, -2 from cover).
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.previewBox}>
              <div style={styles.previewTitle}>Roll Formula</div>
              <div style={styles.previewValue}>
                {getRollTypeDisplay()} {formatModifier(finalBonus)}
              </div>
              <div style={styles.previewSubtext}>
                Base: {formatModifier(baseBonus)}
                {tempModifier !== 0 && tempModifier !== "0" && (
                  <>
                    {" "}
                    + Temp: {formatModifier(parseInt(tempModifier))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button
            onClick={onClose}
            style={{ ...styles.button, ...styles.cancelButton }}
          >
            Cancel
          </button>
          <button onClick={handleRoll} style={{ ...styles.button, ...styles.rollButton }}>
            <Dices size={16} />
            Roll Attack
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpellAttackRollModal;
