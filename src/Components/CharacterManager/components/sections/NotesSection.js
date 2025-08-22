import React, { useState } from "react";
import { FileText, Dices } from "lucide-react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBaseStyles } from "../../utils/styles";

const NotesSection = ({ character, onChange, disabled }) => {
  const { theme } = useTheme();
  const styles = createBaseStyles(theme);
  const [lastRoll, setLastRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollD10 = () => {
    setIsRolling(true);

    try {
      const roller = new DiceRoller();
      const rollResult = roller.roll("1d10");

      setLastRoll({
        value: rollResult.total,
        timestamp: new Date().toLocaleTimeString(),
        notation: rollResult.output,
      });
    } catch (error) {
      console.error("Error rolling dice:", error);
    } finally {
      setTimeout(() => setIsRolling(false), 300);
    }
  };

  const sectionStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    opacity: disabled ? 0.6 : 1,
    pointerEvents: disabled ? "none" : "auto",
  };

  const headerStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  };

  const labelStyles = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: theme.text,
  };

  const rollButtonStyles = {
    ...styles.button,
    ...styles.buttonSecondary,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    backgroundColor: isRolling ? theme.primary : theme.surface,
    color: isRolling ? theme.surface : theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    transform: isRolling ? "scale(1.05)" : "scale(1)",
  };

  const textareaStyles = {
    width: "100%",
    minHeight: "200px",
    padding: "12px",
    backgroundColor: theme.background,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    transition: "border-color 0.2s ease",
    outline: "none",
  };

  const rollResultStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    backgroundColor: `${theme.primary}10`,
    border: `1px solid ${theme.primary}30`,
    borderRadius: "8px",
    marginTop: "8px",
    animation: lastRoll ? "slideIn 0.3s ease" : "none",
  };

  const diceValueStyles = {
    fontSize: "32px",
    fontWeight: "bold",
    color: theme.primary,
    marginRight: "16px",
  };

  const rollInfoStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  return (
    <div style={sectionStyles}>
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          textarea:focus {
            border-color: ${theme.primary} !important;
          }
          
          textarea::placeholder {
            color: ${theme.textSecondary};
            opacity: 0.6;
          }
        `}
      </style>

      <div style={headerStyles}>
        <label style={labelStyles}></label>

        <button
          onClick={rollD10}
          disabled={disabled}
          style={rollButtonStyles}
          title="Roll 1d10"
        >
          <Dices size={18} />
          Roll D10
        </button>
      </div>

      {lastRoll && (
        <div style={rollResultStyles}>
          <div style={rollInfoStyles}>
            <span
              style={{
                color: theme.text,
                fontWeight: "500",
                marginRight: "14px",
              }}
            >
              Result:
            </span>
          </div>
          <div style={diceValueStyles}>{lastRoll.value}</div>
        </div>
      )}

      <textarea
        value={character.notes || ""}
        onChange={(e) => onChange("notes", e.target.value)}
        disabled={disabled}
        style={textareaStyles}
      />
    </div>
  );
};

export default NotesSection;
