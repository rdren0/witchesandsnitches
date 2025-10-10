import React, { useState } from "react";
import { X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const SpellAttackModal = ({ character, onClose, onSave, supabase }) => {
  const { theme } = useTheme();

  const spellAttackData = character.spellAttack || {
    override: null,
    modifier: 0,
  };
  const [attackOverride, setAttackOverride] = useState(
    spellAttackData.override ?? ""
  );
  const [attackModifier, setAttackModifier] = useState(
    spellAttackData.modifier ?? 0
  );
  const [isSaving, setIsSaving] = useState(false);

  const getSpellcastingAbility = (castingStyle) => {
    const spellcastingAbilityMap = {
      "Willpower Caster": "Charisma",
      "Technique Caster": "Wisdom",
      "Intellect Caster": "Intelligence",
      "Vigor Caster": "Constitution",
      Willpower: "Charisma",
      Technique: "Wisdom",
      Intellect: "Intelligence",
      Vigor: "Constitution",
    };
    return spellcastingAbilityMap[castingStyle] || null;
  };

  const getBaseSpellAttackBonus = () => {
    const spellcastingAbility = getSpellcastingAbility(character.castingStyle);
    if (!spellcastingAbility) return 0;

    const abilityKey = spellcastingAbility.toLowerCase();
    const abilityScore =
      character.abilityScores?.[abilityKey] || character[abilityKey] || 10;
    const abilityModifier = Math.floor((abilityScore - 10) / 2);
    const proficiencyBonus = character.proficiencyBonus || 0;

    return proficiencyBonus + abilityModifier;
  };

  const baseAttackBonus = getBaseSpellAttackBonus();
  const spellcastingAbilityName = getSpellcastingAbility(
    character.castingStyle
  );
  const profBonus = character.proficiencyBonus || 0;
  const abilityKey = spellcastingAbilityName?.toLowerCase();
  const abilityScore =
    character.abilityScores?.[abilityKey] || character[abilityKey] || 10;
  const abilityMod = Math.floor((abilityScore - 10) / 2);

  const getFinalAttackBonus = () => {
    if (attackOverride !== "" && attackOverride !== null) {
      return parseInt(attackOverride);
    } else {
      return baseAttackBonus + parseInt(attackModifier || 0);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const attackObject = {
        override:
          attackOverride !== "" && attackOverride !== null
            ? parseInt(attackOverride)
            : null,
        modifier: parseInt(attackModifier || 0),
      };

      const { data, error } = await supabase
        .from("characters")
        .update({ spell_attack: attackObject })
        .eq("id", character.id)
        .select();

      if (error) throw error;

      if (onSave) {
        onSave({ ...character, spellAttack: attackObject });
      }
      onClose();
    } catch (error) {
      console.error("Error saving spell attack override:", error);
      alert(`Failed to save spell attack override: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearAll = () => {
    setAttackOverride("");
    setAttackModifier(0);
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

  const formatModifier = (mod) => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Spell Attack Override</h2>
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
              <strong>Base Spell Attack Bonus:</strong>{" "}
              {formatModifier(baseAttackBonus)}
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                (Prof: +{profBonus} + {spellcastingAbilityName}:{" "}
                {formatModifier(abilityMod)})
              </div>
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
                    <label style={styles.label}>Spell Attack Override</label>
                    <input
                      type="number"
                      value={attackOverride}
                      onChange={(e) => setAttackOverride(e.target.value)}
                      placeholder="Leave empty to use base bonus"
                      style={styles.input}
                      min="-99"
                      max="99"
                    />
                    <div style={styles.helpText}>
                      Set spell attack as the FINAL value. This completely
                      replaces the calculated value. Leave empty to use base
                      bonus ({formatModifier(baseAttackBonus)}).
                    </div>
                  </div>

                  <div style={styles.section}>
                    <label style={styles.label}>
                      Additional Modifier
                      {attackOverride !== "" && attackOverride !== null && (
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
                      value={attackModifier}
                      onChange={(e) => setAttackModifier(e.target.value)}
                      placeholder="0"
                      style={{
                        ...styles.input,
                        opacity:
                          attackOverride !== "" && attackOverride !== null
                            ? 0.5
                            : 1,
                        cursor:
                          attackOverride !== "" && attackOverride !== null
                            ? "not-allowed"
                            : "text",
                      }}
                      disabled={
                        attackOverride !== "" && attackOverride !== null
                      }
                      min="-99"
                      max="99"
                    />
                    <div style={styles.helpText}>
                      Add a positive or negative modifier to calculated spell
                      attack (e.g., +1 from magical focus). Only applies when
                      override is NOT set.
                    </div>
                  </div>
                </div>

                <div style={{ width: "200px" }}>
                  <label style={styles.label}>Final Spell Attack</label>
                  <div style={styles.previewBox}>
                    <div style={styles.previewValue}>
                      {formatModifier(getFinalAttackBonus())}
                    </div>
                    <div style={styles.previewBreakdown}>
                      {attackOverride !== "" && attackOverride !== null ? (
                        <>Override (final value)</>
                      ) : (
                        <>
                          Base: {formatModifier(baseAttackBonus)}
                          {attackModifier !== 0 && attackModifier !== "0" && (
                            <>
                              {" "}
                              + Modifier:{" "}
                              {formatModifier(parseInt(attackModifier))}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {((attackOverride !== "" && attackOverride !== null) ||
                (attackModifier !== 0 && attackModifier !== "0")) && (
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

export default SpellAttackModal;
