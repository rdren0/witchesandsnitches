import { useState } from "react";
import { Dice6, Plus, Minus } from "lucide-react";
import { useRollFunctions } from "../utils/diceRoller";
import { useTheme } from "../../contexts/ThemeContext";

const FlexibleDiceRoller = ({
  title = "Flexible Roll",
  description = "Rolling dice with modifier",
  character = null,
  style = {},
  compact = false,
}) => {
  const { rollFlexibleDice } = useRollFunctions(); // Assuming this function exists or needs to be created
  const { theme } = useTheme();
  const [diceType, setDiceType] = useState(20);
  const [rollType, setRollType] = useState("normal"); // normal, advantage, disadvantage
  const [modifier, setModifier] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const rollTypeOptions = [
    { value: "normal", label: "Normal", short: "N" },
    { value: "advantage", label: "Advantage", short: "ADV" },
    { value: "disadvantage", label: "Disadvantage", short: "DIS" },
  ];

  const commonDice = [4, 6, 8, 10, 12, 20, 100];

  const incrementDiceType = () => {
    setDiceType((prev) => parseInt(prev) + 1);
  };

  const decrementDiceType = () => {
    setDiceType((prev) => Math.max(2, parseInt(prev) - 1)); // Minimum d2
  };

  const handleRoll = () => {
    const rollTitle = customTitle.trim() || title;
    const rollDescription = customTitle.trim()
      ? `Rolling ${customTitle.toLowerCase()}`
      : description;

    // Use the new rollFlexibleDice function
    rollFlexibleDice({
      diceType: parseInt(diceType),
      rollType: rollType,
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
      flexDirection: "column",
      gap: compact ? "8px" : "12px",
      marginBottom: compact ? "8px" : "12px",
    },
    inputRow: {
      display: "flex",
      gap: compact ? "8px" : "12px",
      alignItems: "flex-end",
    },
    inputContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      flex: 1,
    },
    label: {
      fontSize: "12px",
      fontWeight: "500",
      color: theme === "dark" ? "#d1d5db" : "#374151",
      marginBottom: "4px",
    },
    select: {
      padding: "8px 12px",
      border: `2px solid ${theme === "dark" ? "#4b5563" : "#d1d5db"}`,
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
      color: theme === "dark" ? "#f9fafb" : "#1f2937",
      outline: "none",
      cursor: "pointer",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
        theme === "dark" ? "%23d1d5db" : "%23374151"
      }' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 8px center",
      backgroundSize: "16px",
      paddingRight: "32px",
    },
    modifierContainer: {
      display: "flex",
      alignItems: "center",
      border: `2px solid ${theme === "dark" ? "#4b5563" : "#d1d5db"}`,
      borderRadius: "6px",
      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
      overflow: "hidden",
      transition: "border-color 0.2s ease",
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
      padding: "4px 8px",
      backgroundColor: theme === "dark" ? "#1f2937" : "#f8fafc",
      border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
      borderRadius: "4px",
    },
    advantageIndicator: {
      fontSize: "10px",
      fontWeight: "600",
      padding: "2px 6px",
      borderRadius: "4px",
      backgroundColor:
        rollType === "advantage"
          ? "#10b981"
          : rollType === "disadvantage"
          ? "#ef4444"
          : "#6b7280",
      color: "white",
      marginLeft: "8px",
    },
  };

  const displayModifier = parseInt(modifier) || 0;
  const modifierText =
    displayModifier >= 0 ? `+${displayModifier}` : `${displayModifier}`;
  const advantageText =
    rollType === "advantage"
      ? " (ADV)"
      : rollType === "disadvantage"
      ? " (DIS)"
      : "";
  const formula = `1d${diceType}${
    displayModifier !== 0 ? modifierText : ""
  }${advantageText}`;

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <Dice6 size={compact ? 16 : 20} color="#3b82f6" />
        {compact ? "Dice Roll" : "Flexible Dice Roller"}
        {rollType !== "normal" && (
          <span style={styles.advantageIndicator}>
            {rollTypeOptions.find((option) => option.value === rollType)?.short}
          </span>
        )}
      </div>

      <div style={styles.inputGroup}>
        {!compact && (
          <div style={styles.inputContainer}>
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

        <div style={styles.inputRow}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Dice Type</label>
            <div style={styles.modifierContainer}>
              <button
                type="button"
                onClick={decrementDiceType}
                style={styles.modifierButton}
              >
                <Minus size={14} />
              </button>
              <input
                type="number"
                value={diceType}
                min="2"
                max="9999"
                placeholder="20"
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 2;
                  setDiceType(Math.max(2, Math.min(9999, value)));
                }}
                style={{
                  ...styles.modifierInput,
                  textAlign: "center",
                  fontWeight: "600",
                  minWidth: "80px",
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor =
                    theme === "dark" ? "#374151" : "#f8fafc";
                  e.target.parentElement.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.parentElement.style.borderColor =
                    theme === "dark" ? "#4b5563" : "#d1d5db";
                  // Ensure valid value on blur
                  const value = parseInt(e.target.value) || 2;
                  setDiceType(Math.max(2, Math.min(9999, value)));
                }}
              />
              <button
                type="button"
                onClick={incrementDiceType}
                style={styles.modifierButton}
              >
                <Plus size={14} />
              </button>
            </div>
            <div
              style={{
                fontSize: "10px",
                color: theme === "dark" ? "#9ca3af" : "#6b7280",
                textAlign: "center",
                marginTop: "2px",
              }}
            >
              d{diceType}
            </div>
            {/* Quick preset buttons for common dice */}
            {!compact && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  marginTop: "6px",
                  justifyContent: "center",
                }}
              >
                {commonDice.map((dice) => (
                  <button
                    key={dice}
                    type="button"
                    onClick={() => setDiceType(dice)}
                    style={{
                      padding: "2px 6px",
                      fontSize: "10px",
                      border: `1px solid ${
                        theme === "dark" ? "#4b5563" : "#d1d5db"
                      }`,
                      borderRadius: "4px",
                      backgroundColor:
                        diceType === dice
                          ? "#3b82f6"
                          : theme === "dark"
                          ? "#374151"
                          : "#ffffff",
                      color:
                        diceType === dice
                          ? "white"
                          : theme === "dark"
                          ? "#d1d5db"
                          : "#374151",
                      cursor: "pointer",
                      transition: "all 0.1s ease",
                    }}
                  >
                    d{dice}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={styles.inputContainer}>
            <label style={styles.label}>Roll Type</label>
            <select
              value={rollType}
              onChange={(e) => setRollType(e.target.value)}
              style={styles.select}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
              }}
              onBlur={(e) => {
                e.target.style.borderColor =
                  theme === "dark" ? "#4b5563" : "#d1d5db";
              }}
            >
              {rollTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputContainer}>
            <label style={styles.label}>Modifier</label>
            <div style={styles.modifierContainer}>
              <button
                type="button"
                onClick={decrementModifier}
                style={styles.modifierButton}
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
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rollFormula}>Formula: {formula}</div>

      <button
        onClick={handleRoll}
        disabled={isRolling}
        style={styles.rollButton}
      >
        <Dice6 size={16} />
        {isRolling ? "Rolling..." : `Roll d${diceType}`}
      </button>
    </div>
  );
};

export default FlexibleDiceRoller;
