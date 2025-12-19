import React, { useState } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBackgroundStyles } from "../../../../utils/styles/masterStyles";

const MagicModifiersSection = ({ character, onChange, disabled = false }) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);

  const [magicModifierTempValues, setMagicModifierTempValues] = useState({});
  const [wandInfoTempValue, setWandInfoTempValue] = useState("");

  const magicModifiers = character.magicModifiers || {
    divinations: 0,
    transfiguration: 0,
    charms: 0,
    healing: 0,
    jinxesHexesCurses: 0,
  };

  const magicSubjects = [
    { key: "divinations", label: "Divinations" },
    { key: "transfiguration", label: "Transfiguration" },
    { key: "charms", label: "Charms" },
    { key: "healing", label: "Healing" },
    { key: "jinxesHexesCurses", label: "JHC" },
  ];

  const handleMagicModifierChange = (key, value) => {
    const numValue = value === "" || value === "-" ? 0 : parseInt(value, 10);
    const finalValue = isNaN(numValue) ? 0 : numValue;

    const updatedModifiers = {
      divinations: magicModifiers.divinations,
      transfiguration: magicModifiers.transfiguration,
      charms: magicModifiers.charms,
      healing: magicModifiers.healing,
      jinxesHexesCurses: magicModifiers.jinxesHexesCurses,
      [key]: finalValue,
    };

    onChange("magicModifiers", updatedModifiers);
  };

  const handleWandInfoChange = (value) => {
    onChange("wandInfo", value);
  };

  const customStyles = {
    container: {
      ...styles.container,
      padding: "16px",
    },
    header: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
      margin: "0 0 8px 0",
    },
    helpText: {
      fontSize: "14px",
      color: theme.textSecondary,
      marginBottom: "16px",
      fontStyle: "italic",
    },
    magicModifiersGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "12px",
      marginBottom: "24px",
    },
    magicModifierItem: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    magicModifierLabel: {
      fontSize: "14px",
      fontWeight: "500",
      color: theme.text,
    },
    magicModifierInput: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: `2px solid ${theme.border}`,
      backgroundColor: disabled ? theme.backgroundSecondary : theme.surface,
      color: theme.text,
      fontSize: "14px",
      textAlign: "center",
      fontWeight: "600",
      transition: "border-color 0.2s ease",
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? "not-allowed" : "text",
    },
    wandSection: {
      marginTop: "24px",
      padding: "16px",
      backgroundColor: theme.surface,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
    },
    wandHeader: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
      margin: "0 0 8px 0",
    },
    wandTextArea: {
      width: "100%",
      minHeight: "120px",
      padding: "12px",
      borderRadius: "6px",
      border: `2px solid ${theme.border}`,
      backgroundColor: disabled ? theme.backgroundSecondary : theme.background,
      color: theme.text,
      fontSize: "14px",
      lineHeight: "1.5",
      resize: "vertical",
      fontFamily: "inherit",
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? "not-allowed" : "text",
      transition: "border-color 0.2s ease",
    },
  };

  return (
    <div style={customStyles.container}>
      <div
        style={{
          maxHeight: "600px",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "4px",
        }}
      >
        <h3 style={customStyles.header}>Magic Subject Modifiers</h3>
        <div style={customStyles.helpText}>
          Enter your wand's bonuses/penalties for each subject of magic (The DM
          will provide these values)
        </div>

        <div style={customStyles.magicModifiersGrid}>
          {magicSubjects.map(({ key, label }) => (
            <div key={key} style={customStyles.magicModifierItem}>
              <label style={customStyles.magicModifierLabel}>{label}</label>
              <input
                type="number"
                value={
                  magicModifierTempValues.hasOwnProperty(key)
                    ? magicModifierTempValues[key]
                    : magicModifiers[key] || 0
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setMagicModifierTempValues((prev) => ({
                    ...prev,
                    [key]: value,
                  }));

                  handleMagicModifierChange(key, value);
                }}
                onBlur={() => {
                  setMagicModifierTempValues((prev) => {
                    const newState = { ...prev };
                    delete newState[key];
                    return newState;
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.target.blur();
                  }
                }}
                onFocus={(e) => {
                  if (!disabled) {
                    e.target.style.borderColor = theme.primary;
                  }
                }}
                onBlurCapture={(e) => {
                  e.target.style.borderColor = theme.border;
                }}
                style={customStyles.magicModifierInput}
                min="-99"
                max="99"
                step="1"
                disabled={disabled}
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <div style={customStyles.wandSection}>
          <h4 style={customStyles.wandHeader}>Wand Information</h4>
          <div style={customStyles.helpText}>
            Describe your character's wand (wood type, core, length,
            flexibility, etc.)
          </div>
          <textarea
            value={
              wandInfoTempValue !== ""
                ? wandInfoTempValue
                : character.wandInfo || ""
            }
            onChange={(e) => {
              if (!disabled) {
                const value = e.target.value;
                setWandInfoTempValue(value);

                handleWandInfoChange(value);
              }
            }}
            onBlur={() => {
              setWandInfoTempValue("");
            }}
            onFocus={(e) => {
              if (!disabled) {
                e.target.style.borderColor = theme.primary;
              }
            }}
            onBlurCapture={(e) => {
              e.target.style.borderColor = theme.border;
            }}
            style={customStyles.wandTextArea}
            disabled={disabled}
            placeholder="Describe your wand: wood type, core, length, flexibility, and any special characteristics..."
            rows={5}
          />
        </div>
      </div>
    </div>
  );
};

export default MagicModifiersSection;
