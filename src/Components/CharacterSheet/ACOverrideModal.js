import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const ACOverrideModal = ({ character, onClose, onSave, supabase }) => {
  const { theme } = useTheme();

  const acData = character.ac || { override: null, modifier: 0 };
  const [acOverride, setAcOverride] = useState(acData.override ?? "");
  const [acModifier, setAcModifier] = useState(acData.modifier ?? 0);
  const [isSaving, setIsSaving] = useState(false);

  const baseAC = character.armorClass || 10;

  const getFinalAC = () => {
    if (acOverride !== "" && acOverride !== null) {
      return parseInt(acOverride) + parseInt(acModifier || 0);
    } else {
      return baseAC + parseInt(acModifier || 0);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const acObject = {
        override:
          acOverride !== "" && acOverride !== null
            ? parseInt(acOverride)
            : null,
        modifier: parseInt(acModifier || 0),
      };

      const { data, error } = await supabase
        .from("characters")
        .update({ ac: acObject })
        .eq("id", character.id)
        .select();

      if (error) throw error;

      if (onSave) {
        onSave({ ...character, ac: acObject });
      }
      onClose();
    } catch (error) {
      console.error("Error saving AC override:", error);
      alert(`Failed to save AC override: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearAll = () => {
    setAcOverride("");
    setAcModifier(0);
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
      maxWidth: "500px",
      width: "100%",
      maxHeight: "90vh",
      overflow: "auto",
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
      marginBottom: "24px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
    },
    helpText: {
      fontSize: "13px",
      color: theme.textSecondary,
      marginTop: "4px",
      fontStyle: "italic",
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
    clearButton: {
      marginTop: "8px",
      padding: "6px 12px",
      fontSize: "13px",
      backgroundColor: "transparent",
      color: theme.textSecondary,
      border: `1px solid ${theme.border}`,
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    previewBox: {
      padding: "16px",
      backgroundColor: `${theme.primary}15`,
      border: `2px solid ${theme.primary}`,
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100%",
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
      textAlign: "center",
    },
    previewBreakdown: {
      fontSize: "12px",
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: "8px",
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
    saveButton: {
      backgroundColor: theme.primary,
      color: "white",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Armor Class Override</h2>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.body}>
          <div
            style={{
              ...styles.section,
              paddingBottom: "16px",
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ fontSize: "14px", color: theme.textSecondary }}>
              <strong>Base AC:</strong> {baseAC}
            </div>
          </div>

          <div
            style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={styles.section}>
                    <label style={styles.label}>AC Override</label>
                    <input
                      type="number"
                      value={acOverride}
                      onChange={(e) => setAcOverride(e.target.value)}
                      placeholder="Leave empty to use base AC"
                      style={styles.input}
                      min="0"
                      max="99"
                    />
                    <div style={styles.helpText}>
                      Override the calculated base AC with a custom value. Leave
                      empty to use the base AC ({baseAC}).
                    </div>
                  </div>

                  <div style={styles.section}>
                    <label style={styles.label}>AC Modifier</label>
                    <input
                      type="number"
                      value={acModifier}
                      onChange={(e) => setAcModifier(e.target.value)}
                      placeholder="0"
                      style={styles.input}
                      min="-99"
                      max="99"
                    />
                    <div style={styles.helpText}>
                      Add a positive or negative modifier to your AC (e.g., +2
                      from shield, -1 from curse).
                    </div>
                  </div>
                </div>

                <div style={{ width: "200px" }}>
                  <label style={styles.label}>Final AC</label>
                  <div style={styles.previewBox}>
                    <div style={styles.previewValue}>{getFinalAC()}</div>
                    <div style={styles.previewBreakdown}>
                      {acOverride !== "" && acOverride !== null ? (
                        <>
                          Override: {acOverride}
                          {acModifier !== 0 && acModifier !== "0" && (
                            <>
                              {" "}
                              + Modifier: {acModifier >= 0 ? "+" : ""}
                              {acModifier}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          Base: {baseAC}
                          {acModifier !== 0 && acModifier !== "0" && (
                            <>
                              {" "}
                              + Modifier: {acModifier >= 0 ? "+" : ""}
                              {acModifier}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {((acOverride !== "" && acOverride !== null) ||
                (acModifier !== 0 && acModifier !== "0")) && (
                <button
                  onClick={handleClearAll}
                  style={styles.clearButton}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.surfaceHover;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  Clear All
                </button>
              )}
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
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              ...styles.button,
              ...styles.saveButton,
              opacity: isSaving ? 0.6 : 1,
              cursor: isSaving ? "not-allowed" : "pointer",
            }}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ACOverrideModal;
