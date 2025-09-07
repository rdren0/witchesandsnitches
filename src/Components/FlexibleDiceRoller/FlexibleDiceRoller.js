import { useState } from "react";
import { Dice6, Plus, Minus, ChevronDown } from "lucide-react";
import { useRollFunctions } from "../utils/diceRoller";
import { useTheme } from "../../contexts/ThemeContext";

const FlexibleDiceRoller = ({
  title = "Flexible Roll",
  description = "Rolling dice with modifier",
  character = null,
  style = {},
  compact = false,
}) => {
  const { rollFlexibleDice } = useRollFunctions();
  const { theme } = useTheme();
  const [diceQuantity, setDiceQuantity] = useState(1);
  const [diceType, setDiceType] = useState(20);
  const [rollType, setRollType] = useState("normal");
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
    setDiceType((prev) => Math.max(2, parseInt(prev) - 1));
  };

  const incrementDiceQuantity = () => {
    setDiceQuantity((prevState) => prevState + 1);
  };

  const decrementDiceQuantity = () => {
    setDiceQuantity((prevState) => Math.max(1, prevState - 1));
  };

  const handleRoll = () => {
    const rollTitle = customTitle.trim() || title;
    const rollDescription = customTitle.trim()
      ? `Rolling ${customTitle.toLowerCase()}`
      : description;

    rollFlexibleDice({
      diceQuantity: parseInt(diceQuantity) || 1,
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
      padding: compact ? "16px" : "20px",
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      ...style,
    },
    title: {
      fontSize: compact ? "16px" : "18px",
      fontWeight: "700",
      color: theme.text,
      marginBottom: compact ? "16px" : "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: compact ? "12px" : "16px",
      marginBottom: compact ? "16px" : "20px",
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
      fontSize: "13px",
      fontWeight: "600",
      color: theme.textSecondary,
      marginBottom: "6px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    selectContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    select: {
      width: "100%",
      padding: "10px 40px 10px 12px",
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      fontSize: "14px",
      backgroundColor: theme.background,
      color: theme.text,
      outline: "none",
      cursor: "pointer",
      appearance: "none",
      transition: "all 0.2s ease",
      fontWeight: "500",
    },
    selectArrow: {
      position: "absolute",
      right: "12px",
      pointerEvents: "none",
      color: theme.textSecondary,
      transition: "color 0.2s ease",
    },
    modifierContainer: {
      display: "flex",
      alignItems: "center",
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      backgroundColor: theme.background,
      overflow: "hidden",
      transition: "all 0.2s ease",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    modifierButton: {
      background: "none",
      border: "none",
      padding: "10px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.textSecondary,
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: theme.primary + "10",
        color: theme.primary,
      },
    },
    modifierInput: {
      border: "none",
      background: "none",
      padding: "10px 12px",
      fontSize: "15px",
      fontWeight: "600",
      textAlign: "center",
      minWidth: "60px",
      color: theme.text,
      outline: "none",
      MozAppearance: "textfield",
      WebkitAppearance: "none",
    },
    titleInput: {
      width: "100%",
      padding: "10px 14px",
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      fontSize: "14px",
      backgroundColor: theme.background,
      color: theme.text,
      outline: "none",
      transition: "all 0.2s ease",
      fontWeight: "500",
      "&:focus": {
        borderColor: theme.primary,
        boxShadow: `0 0 0 3px ${theme.primary}15`,
      },
    },
    rollButton: {
      width: "100%",
      padding: compact ? "12px 20px" : "14px 24px",
      backgroundColor: isRolling ? theme.surface : theme.primary || "#6366f1",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: compact ? "15px" : "16px",
      fontWeight: "700",
      cursor: isRolling ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      transition: "all 0.2s ease",
      opacity: isRolling ? 0.6 : 1,
      boxShadow: isRolling ? "none" : "0 2px 4px rgba(0, 0, 0, 0.1)",
      transform: isRolling ? "scale(0.98)" : "scale(1)",
      "&:hover": {
        transform: isRolling ? "scale(0.98)" : "scale(1.02)",
        boxShadow: isRolling ? "none" : "0 4px 8px rgba(0, 0, 0, 0.15)",
      },
    },
    rollFormula: {
      fontSize: "14px",
      color: theme.primary,
      textAlign: "center",
      fontFamily: "'Courier New', monospace",
      marginBottom: "16px",
      padding: "10px 14px",
      backgroundColor: theme.primary + "10",
      border: `1px solid ${theme.primary}30`,
      borderRadius: "8px",
      fontWeight: "600",
      letterSpacing: "1px",
    },
    advantageIndicator: {
      fontSize: "11px",
      fontWeight: "700",
      padding: "4px 8px",
      borderRadius: "6px",
      backgroundColor:
        rollType === "advantage"
          ? "#10b98120"
          : rollType === "disadvantage"
          ? "#ef444420"
          : theme.background,
      color:
        rollType === "advantage"
          ? "#10b981"
          : rollType === "disadvantage"
          ? "#ef4444"
          : theme.text,
      marginLeft: "auto",
      border: `1px solid ${
        rollType === "advantage"
          ? "#10b981"
          : rollType === "disadvantage"
          ? "#ef4444"
          : "transparent"
      }`,
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
  const formula = `${diceQuantity}d${diceType}${
    displayModifier !== 0 ? modifierText : ""
  }${advantageText}`;

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={styles.title}>
        <Dice6 size={compact ? 18 : 22} color={theme.primary || "#6366f1"} />
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
                e.target.style.borderColor = theme.primary;
                e.target.style.boxShadow = `0 0 0 3px ${theme.primary}15`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        )}

        <div style={styles.inputRow}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Dice Quantity</label>
            <div style={styles.modifierContainer}>
              <style>
                {`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}
              </style>
              <button
                type="button"
                onClick={decrementDiceQuantity}
                style={styles.modifierButton}
              >
                <Minus size={14} />
              </button>
              <input
                type="number"
                value={diceQuantity}
                min="1"
                max="100"
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setDiceQuantity(Math.max(1, Math.min(100, value)));
                }}
                style={{
                  ...styles.modifierInput,
                  textAlign: "center",
                  fontWeight: "600",
                  minWidth: "60px",
                  MozAppearance: "textfield",
                  WebkitAppearance: "none",
                  margin: 0,
                }}
              />
              <button
                type="button"
                onClick={incrementDiceQuantity}
                style={styles.modifierButton}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

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
                  e.target.parentElement.style.borderColor = theme.primary;
                  e.target.parentElement.style.boxShadow = `0 0 0 3px ${theme.primary}15`;
                }}
                onBlur={(e) => {
                  e.target.parentElement.style.borderColor = theme.border;
                  e.target.parentElement.style.boxShadow =
                    "0 1px 2px rgba(0, 0, 0, 0.05)";

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
                color: theme.textSecondary,
                textAlign: "center",
                marginTop: "2px",
              }}
            >
              d{diceType}
            </div>
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
                      padding: "6px 8px",
                      height: "36px",
                      width: "42px",
                      fontSize: "12px",
                      fontWeight: "600",
                      border: `1px solid ${
                        diceType === dice ? theme.primary : theme.border
                      }`,
                      borderRadius: "6px",
                      backgroundColor:
                        diceType === dice ? theme.primary : theme.background,
                      color: diceType === dice ? "white" : theme.textSecondary,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow:
                        diceType === dice
                          ? "0 2px 4px rgba(0, 0, 0, 0.1)"
                          : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (diceType !== dice) {
                        e.target.style.backgroundColor = theme.primary + "10";
                        e.target.style.borderColor = theme.primary;
                        e.target.style.color = theme.primary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (diceType !== dice) {
                        e.target.style.backgroundColor = theme.background;
                        e.target.style.borderColor = theme.border;
                        e.target.style.color = theme.textSecondary;
                      }
                    }}
                  >
                    d{dice}
                  </button>
                ))}
              </div>
            )}
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
                  e.target.parentElement.style.borderColor = theme.primary;
                  e.target.parentElement.style.boxShadow = `0 0 0 3px ${theme.primary}15`;
                }}
                onBlur={(e) => {
                  e.target.parentElement.style.borderColor = theme.border;
                  e.target.parentElement.style.boxShadow =
                    "0 1px 2px rgba(0, 0, 0, 0.05)";
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
          <div style={styles.inputContainer}>
            <label style={styles.label}>Roll Type</label>
            <div style={styles.selectContainer}>
              <select
                value={rollType}
                onChange={(e) => setRollType(e.target.value)}
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}15`;
                  e.target.nextElementSibling.style.color = theme.primary;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border;
                  e.target.style.boxShadow = "none";
                  e.target.nextElementSibling.style.color = theme.textSecondary;
                }}
              >
                {rollTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} style={styles.selectArrow} />
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
        <Dice6
          size={18}
          style={{
            animation: isRolling ? "spin 0.5s linear infinite" : "none",
          }}
        />
        {isRolling ? "Rolling..." : `Roll ${formula}`}
      </button>
    </div>
  );
};

export default FlexibleDiceRoller;
