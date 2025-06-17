import React, { useState } from "react";
import { Dice6, Plus, Minus } from "lucide-react";
import { useRollFunctions } from "../utils/diceRoller";
import { useTheme } from "../../contexts/ThemeContext";

const GenericD20Roller = ({
  title = "Generic Roll",
  description = "Rolling a d20 with modifier",
  character = null,
  style = {},
  compact = false,
}) => {
  const { rollGenericD20 } = useRollFunctions();
  const { theme } = useTheme();
  const [modifier, setModifier] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const handleRoll = () => {
    const rollTitle = customTitle.trim() || title;
    const rollDescription = customTitle.trim()
      ? `Rolling ${customTitle.toLowerCase()}`
      : description;

    rollGenericD20({
      modifier: parseInt(modifier) || 0,
      title: rollTitle,
      description: rollDescription,
      character: character,
      isRolling,
      setIsRolling,
    });
  };

  const incrementModifier = () => {
    setModifier((prev) => parseInt(prev) + 1);
  };

  const decrementModifier = () => {
    setModifier((prev) => parseInt(prev) - 1);
  };

  const styles = {
    container: {
      padding: compact ? "12px" : "16px",
      backgroundColor: theme === "dark" ? "#374151" : "#ffffff",
      border: `1px solid ${theme === "dark" ? "#4b5563" : "#e5e7eb"}`,
      borderRadius: "8px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      ...style,
    },
    title: {
      fontSize: compact ? "14px" : "16px",
      fontWeight: "600",
      color: theme === "dark" ? "#f9fafb" : "#1f2937",
      marginBottom: compact ? "8px" : "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: compact ? "row" : "column",
      gap: compact ? "8px" : "12px",
      marginBottom: compact ? "8px" : "12px",
    },
    inputContainer: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "500",
      color: theme === "dark" ? "#d1d5db" : "#374151",
      marginBottom: compact ? "0" : "4px",
      minWidth: compact ? "60px" : "auto",
    },
    modifierContainer: {
      display: "flex",
      alignItems: "center",
      border: `2px solid ${theme === "dark" ? "#4b5563" : "#d1d5db"}`,
      borderRadius: "6px",
      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
      overflow: "hidden",
    },
    modifierButton: {
      background: "none",
      border: "none",
      padding: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme === "dark" ? "#9ca3af" : "#6b7280",
      transition: "background-color 0.2s ease",
    },
    modifierInput: {
      border: "none",
      background: "none",
      padding: "8px 12px",
      fontSize: "14px",
      fontWeight: "500",
      textAlign: "center",
      minWidth: "60px",
      color: theme === "dark" ? "#f9fafb" : "#1f2937",
      outline: "none",
    },
    titleInput: {
      width: "100%",
      padding: "8px 12px",
      border: `2px solid ${theme === "dark" ? "#4b5563" : "#d1d5db"}`,
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
      color: theme === "dark" ? "#f9fafb" : "#1f2937",
      outline: "none",
      transition: "border-color 0.2s ease",
    },
    rollButton: {
      width: "100%",
      padding: compact ? "8px 16px" : "12px 20px",
      backgroundColor: isRolling ? "#9ca3af" : "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: compact ? "14px" : "16px",
      fontWeight: "600",
      cursor: isRolling ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      opacity: isRolling ? 0.7 : 1,
    },
    rollFormula: {
      fontSize: "12px",
      color: theme === "dark" ? "#9ca3af" : "#6b7280",
      textAlign: "center",
      fontFamily: "monospace",
      marginBottom: "8px",
    },
  };

  const displayModifier = parseInt(modifier) || 0;
  const formula = `1d20${displayModifier >= 0 ? "+" : ""}${displayModifier}`;

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <Dice6 size={compact ? 16 : 20} color="#3b82f6" />
        {compact ? "D20 Roll" : "Generic D20 Roller"}
      </div>

      <div style={styles.inputGroup}>
        {!compact && (
          <div>
            <label style={styles.label}>Roll Name (optional)</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder={title}
              style={styles.titleInput}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
              }}
              onBlur={(e) => {
                e.target.style.borderColor =
                  theme === "dark" ? "#4b5563" : "#d1d5db";
              }}
            />
          </div>
        )}

        <div style={styles.inputContainer}>
          <label style={styles.label}>{compact ? "Mod:" : "Modifier:"}</label>
          <div style={styles.modifierContainer}>
            <button
              type="button"
              onClick={decrementModifier}
              style={styles.modifierButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor =
                  theme === "dark" ? "#374151" : "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              value={modifier}
              onChange={(e) => setModifier(e.target.value)}
              style={styles.modifierInput}
              onFocus={(e) => {
                e.target.style.backgroundColor =
                  theme === "dark" ? "#374151" : "#f8fafc";
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            />
            <button
              type="button"
              onClick={incrementModifier}
              style={styles.modifierButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor =
                  theme === "dark" ? "#374151" : "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      <div style={styles.rollFormula}>Formula: {formula}</div>

      <button
        onClick={handleRoll}
        disabled={isRolling}
        style={styles.rollButton}
        onMouseEnter={(e) => {
          if (!isRolling) {
            e.target.style.backgroundColor = "#2563eb";
            e.target.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isRolling) {
            e.target.style.backgroundColor = "#3b82f6";
            e.target.style.transform = "translateY(0)";
          }
        }}
      >
        <Dice6 size={16} />
        {isRolling ? "Rolling..." : "Roll D20"}
      </button>
    </div>
  );
};

export default GenericD20Roller;
