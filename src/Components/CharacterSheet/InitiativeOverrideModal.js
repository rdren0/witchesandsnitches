import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const InitiativeOverrideModal = ({ character, onClose, onSave, supabase }) => {
  const { theme } = useTheme();

  const initiativeData = character.initiative || {
    override: null,
    modifier: 0,
  };
  const [initiativeOverride, setInitiativeOverride] = useState(
    initiativeData.override ?? ""
  );
  const [initiativeModifier, setInitiativeModifier] = useState(
    initiativeData.modifier ?? 0
  );
  const [isSaving, setIsSaving] = useState(false);

  const savedModifier = initiativeData.modifier || 0;
  const baseInitiativeWithoutModifier =
    (character.initiativeModifier || 0) - savedModifier;

  const getFinalInitiative = () => {
    if (initiativeOverride !== "" && initiativeOverride !== null) {
      return parseInt(initiativeOverride);
    } else {
      return baseInitiativeWithoutModifier + parseInt(initiativeModifier || 0);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const initiativeObject = {
        override:
          initiativeOverride !== "" && initiativeOverride !== null
            ? parseInt(initiativeOverride)
            : null,
        modifier: parseInt(initiativeModifier || 0),
      };

      const { data, error } = await supabase
        .from("characters")
        .update({ initiative: initiativeObject })
        .eq("id", character.id)
        .select();

      if (error) throw error;

      if (onSave) {
        onSave({ ...character, initiative: initiativeObject });
      }
      onClose();
    } catch (error) {
      console.error("Error saving initiative override:", error);
      alert(`Failed to save initiative override: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearAll = () => {
    setInitiativeOverride("");
    setInitiativeModifier(0);
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      padding: "24px",
      maxWidth: "500px",
      width: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      border: `2px solid ${theme.border}`,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      paddingBottom: "12px",
      borderBottom: `2px solid ${theme.border}`,
    },
    title: {
      fontSize: "24px",
      fontWeight: "600",
      color: theme.text,
      margin: 0,
    },
    closeButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.textSecondary,
      transition: "color 0.2s",
    },
    section: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      fontSize: "16px",
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      backgroundColor: theme.background,
      color: theme.text,
      transition: "border-color 0.2s",
      fontFamily: "inherit",
    },
    helpText: {
      fontSize: "12px",
      color: theme.textSecondary,
      marginTop: "6px",
      fontStyle: "italic",
    },
    preview: {
      padding: "16px",
      backgroundColor: theme.background,
      borderRadius: "8px",
      border: `2px solid ${theme.primary}`,
      marginBottom: "20px",
    },
    previewLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: theme.textSecondary,
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    previewValue: {
      fontSize: "32px",
      fontWeight: "700",
      color: theme.primary,
      textAlign: "center",
    },
    previewBreakdown: {
      fontSize: "12px",
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: "8px",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      marginTop: "24px",
    },
    button: {
      flex: 1,
      padding: "12px 20px",
      fontSize: "14px",
      fontWeight: "600",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      fontFamily: "inherit",
    },
    primaryButton: {
      backgroundColor: theme.primary,
      color: theme.surface,
    },
    secondaryButton: {
      backgroundColor: theme.border,
      color: theme.text,
    },
    dangerButton: {
      backgroundColor: theme.error || "#dc2626",
      color: "white",
    },
  };

  const formatModifier = (value) => {
    const num = parseInt(value) || 0;
    return num >= 0 ? `+${num}` : `${num}`;
  };

  const getBreakdown = () => {
    if (initiativeOverride !== "" && initiativeOverride !== null) {
      return `Override (final value)`;
    } else {
      if (initiativeModifier !== 0) {
        return `Base: ${formatModifier(
          baseInitiativeWithoutModifier
        )} ${formatModifier(initiativeModifier)} modifier`;
      }
      return `Base: ${formatModifier(baseInitiativeWithoutModifier)}`;
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Initiative Override</h2>
          <button
            onClick={onClose}
            style={styles.closeButton}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.text)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = theme.textSecondary)
            }
          >
            <X size={24} />
          </button>
        </div>

        <div style={styles.preview}>
          <div style={styles.previewLabel}>Final Initiative</div>
          <div style={styles.previewValue}>
            {formatModifier(getFinalInitiative())}
          </div>
          <div style={styles.previewBreakdown}>{getBreakdown()}</div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Initiative Override</label>
          <input
            type="number"
            value={initiativeOverride}
            onChange={(e) => setInitiativeOverride(e.target.value)}
            placeholder="Leave empty to use calculated value"
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = theme.primary)}
            onBlur={(e) => (e.target.style.borderColor = theme.border)}
          />
          <div style={styles.helpText}>
            Set a specific initiative bonus as the FINAL value. This completely
            replaces the calculated value. Leave empty to use calculated
            initiative.
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>
            Initiative Modifier
            {initiativeOverride !== "" && initiativeOverride !== null && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "normal",
                  marginLeft: "8px",
                  color: theme.textSecondary,
                }}
              >
                (disabled when override is set)
              </span>
            )}
          </label>
          <input
            type="number"
            value={initiativeModifier}
            onChange={(e) => setInitiativeModifier(e.target.value)}
            placeholder="0"
            style={{
              ...styles.input,
              opacity:
                initiativeOverride !== "" && initiativeOverride !== null
                  ? 0.5
                  : 1,
              cursor:
                initiativeOverride !== "" && initiativeOverride !== null
                  ? "not-allowed"
                  : "text",
            }}
            disabled={initiativeOverride !== "" && initiativeOverride !== null}
            onFocus={(e) => {
              if (!(initiativeOverride !== "" && initiativeOverride !== null)) {
                e.target.style.borderColor = theme.primary;
              }
            }}
            onBlur={(e) => (e.target.style.borderColor = theme.border)}
          />
          <div style={styles.helpText}>
            Additional bonus or penalty added to calculated initiative (e.g.,
            from magic items). Only applies when override is NOT set.
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={handleClearAll}
            style={{ ...styles.button, ...styles.dangerButton }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            style={{ ...styles.button, ...styles.secondaryButton }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{ ...styles.button, ...styles.primaryButton }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitiativeOverrideModal;
