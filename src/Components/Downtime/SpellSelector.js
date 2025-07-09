import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Wand2,
  BookOpen,
  X,
  Lock,
  Crown,
  Eye,
  EyeClosed,
  CircleEqual,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { spellsData } from "../SpellBook/spells";

const SpellSelector = ({
  activityText,
  selectedSpells = { first: "", second: "" },
  onSpellSelect,
  canEdit = true,
  selectedCharacter,

  spellDiceAssignments = { first: null, second: null },
  onDiceAssign,
  availableDiceOptions = [],
  dicePool = [],

  onAttemptSpell,

  spellAttempts = {},
  researchedSpells = {},

  failedAttempts = {},

  containerStyle = {},
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSpellSlot, setActiveSpellSlot] = useState(null);
  const isResearchActivity = activityText
    ?.toLowerCase()
    .includes("research spells");
  const isAttemptActivity = activityText
    ?.toLowerCase()
    .includes("attempt a spell");

  const styles = {
    container: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
      marginTop: "1rem",
      ...containerStyle,
    },
    spellColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      padding: "1rem",
      backgroundColor: theme.surface,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
    },
    columnHeader: {
      fontWeight: "600",
      fontSize: "0.875rem",
      color: theme.text,
      textAlign: "center",
      paddingBottom: "0.5rem",
      borderBottom: `1px solid ${theme.border}`,
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      fontWeight: "600",
      fontSize: "0.875rem",
      color: theme.text,
    },
    selectedSpell: {
      padding: "0.75rem",
      backgroundColor: theme.background,
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: canEdit ? "pointer" : "default",
    },
    selectedSpellInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    },
    spellName: {
      fontWeight: "600",
      color: theme.text,
      fontSize: "0.875rem",
    },
    spellDetails: {
      fontSize: "0.75rem",
      color: theme.textSecondary,
    },
    clearButton: {
      background: "none",
      border: "none",
      color: theme.textSecondary,
      cursor: "pointer",
      padding: "0.25rem",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    placeholder: {
      padding: "0.75rem",
      backgroundColor: theme.background,
      border: `2px dashed ${theme.border}`,
      borderRadius: "6px",
      textAlign: "center",
      color: theme.textSecondary,
      fontSize: "0.875rem",
      cursor: canEdit ? "pointer" : "default",
    },

    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      width: "100%",
      maxWidth: "600px",
      maxHeight: "80vh",
      border: `1px solid ${theme.border}`,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      display: "flex",
      flexDirection: "column",
    },
    modalHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1.5rem",
      borderBottom: `1px solid ${theme.border}`,
    },
    modalTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: theme.text,
      margin: 0,
    },
    closeButton: {
      background: "none",
      border: "none",
      color: theme.textSecondary,
      cursor: "pointer",
      padding: "0.5rem",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    modalContent: {
      padding: "1.5rem",
      flex: 1,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    searchContainer: {
      position: "relative",
      marginBottom: "1rem",
    },
    searchInput: {
      width: "100%",
      padding: "0.75rem 2.5rem 0.75rem 1rem",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      backgroundColor: theme.background,
      color: theme.text,
      fontSize: "0.875rem",
    },
    searchIcon: {
      position: "absolute",
      right: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: theme.textSecondary,
    },
    spellList: {
      flex: 1,
      overflowY: "auto",
      maxHeight: "400px",
    },
    spellItem: {
      padding: "1rem",
      borderBottom: `1px solid ${theme.border}`,
      cursor: "pointer",
      transition: "background-color 0.2s ease",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    spellItemDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
      backgroundColor: theme.border + "10",
    },
    spellItemMastered: {
      opacity: 0.7,
      cursor: "not-allowed",
      backgroundColor: theme.success + "10",
      border: `1px solid ${theme.success}20`,
    },
    spellItemInfo: {
      flex: 1,
    },
    spellItemName: {
      fontWeight: "600",
      color: theme.text,
      fontSize: "0.875rem",
      marginBottom: "0.25rem",
    },
    spellItemDetails: {
      fontSize: "0.75rem",
      color: theme.textSecondary,
    },
    spellItemStatus: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.75rem",
      color: theme.textSecondary,
    },
    lockIcon: {
      color: theme.error || "#ef4444",
    },
    masteredIcon: {
      color: theme.success || "#10b981",
    },
    failedAttemptsIcon: {
      color: theme.primary || "#10b981",
    },
    diceSelector: {
      padding: "0.5rem",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      backgroundColor: theme.background,
      color: theme.text,
      fontSize: "0.875rem",
      cursor: "pointer",
    },
    assignedDice: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.5rem",
      backgroundColor: theme.primary + "15",
      border: `1px solid ${theme.primary}`,
      borderRadius: "6px",
    },
    diceValue: {
      fontWeight: "600",
      color: theme.primary,
      fontSize: "0.875rem",
    },
    removeButton: {
      background: "none",
      border: "none",
      color: theme.textSecondary,
      cursor: "pointer",
      fontSize: "0.75rem",
      padding: "0.25rem 0.5rem",
      borderRadius: "4px",
      transition: "all 0.2s ease",
    },
    attemptButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.75rem",
      backgroundColor: theme.primary,
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontWeight: "600",
      fontSize: "0.875rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
      width: "100%",
    },
    attemptButtonDisabled: {
      backgroundColor: theme.textSecondary,
      cursor: "not-allowed",
    },
    activityInfo: {
      padding: "1rem",
      backgroundColor: theme.primary + "15",
      border: `1px solid ${theme.primary}`,
      borderRadius: "8px",
      marginBottom: "1rem",
    },
    activityTitle: {
      fontWeight: "600",
      color: theme.primary,
      fontSize: "0.875rem",
      marginBottom: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    activityDescription: {
      fontSize: "0.875rem",
      color: theme.text,
      lineHeight: "1.4",
    },
    validationMessage: {
      fontSize: "0.75rem",
      color: theme.error || "#ef4444",
      marginTop: "0.25rem",
      textAlign: "center",
    },
    masteredMessage: {
      fontSize: "0.75rem",
      color: theme.success || "#10b981",
      marginTop: "0.25rem",
      textAlign: "center",
    },
  };

  const getSpellData = useCallback((spellName) => {
    if (!spellName) return null;

    for (const [subject, subjectData] of Object.entries(spellsData)) {
      if (subjectData.levels) {
        for (const [, levelSpells] of Object.entries(subjectData.levels)) {
          const spell = levelSpells.find((s) => s.name === spellName);
          if (spell) {
            return {
              ...spell,
              subject: subject,
            };
          }
        }
      }
    }
    return null;
  }, []);

  const availableSpells = useMemo(() => {
    const spells = [];

    Object.entries(spellsData).forEach(([subject, subjectData]) => {
      if (subjectData.levels) {
        Object.entries(subjectData.levels).forEach(([level, levelSpells]) => {
          levelSpells.forEach((spell) => {
            spells.push({
              ...spell,
              subject: subject,
            });
          });
        });
      }
    });

    const validSpellNames = new Set([
      ...Object.keys(failedAttempts || {}),
      ...Object.keys(researchedSpells || {}),
      ...Object.keys(spellAttempts || {}),
    ]);

    const relevantSpells = spells.filter((spell) =>
      validSpellNames.has(spell.name)
    );

    const filtered = searchTerm
      ? relevantSpells.filter(
          (spell) =>
            spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            spell.subject?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : relevantSpells;

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, failedAttempts, researchedSpells, spellAttempts, spellsData]);

  const isSpellMastered = useCallback(
    (spellName) => {
      const successfulAttempts = spellAttempts?.[spellName] || 0;

      return successfulAttempts >= 2;
    },
    [spellAttempts]
  );

  const canSpellBeAttempted = useCallback(
    (spellName) => {
      if (isResearchActivity) {
        return true;
      }

      if (isSpellMastered(spellName)) {
        return false;
      }

      if (isAttemptActivity) {
        const hasBeenResearched = researchedSpells?.[spellName] || false;
        const hasSuccessfulAttempts =
          spellAttempts?.[spellName] && spellAttempts[spellName] > 0;
        const hasFailedAttempts =
          failedAttempts?.[spellName] && failedAttempts[spellName] > 0;

        return hasBeenResearched || hasSuccessfulAttempts || hasFailedAttempts;
      }

      return true;
    },
    [
      isResearchActivity,
      isAttemptActivity,
      researchedSpells,
      spellAttempts,
      failedAttempts,
      isSpellMastered,
    ]
  );

  const getSpellStatus = useCallback(
    (spellName) => {
      const hasBeenResearched = researchedSpells?.[spellName] || false;
      const successfulAttempts = spellAttempts?.[spellName] || 0;
      const failedAttemptCount = failedAttempts?.[spellName] || false;
      const totalAttempts = successfulAttempts + failedAttemptCount;

      if (isSpellMastered(spellName)) {
        return "Mastered";
      }

      const statusParts = [];

      if (hasBeenResearched) {
        statusParts.push("Researched");
      }

      if (totalAttempts > 0) {
        if (successfulAttempts > 0 && failedAttemptCount > 0) {
          statusParts.push(`${successfulAttempts}/${totalAttempts} successful`);
        } else if (successfulAttempts > 0) {
          statusParts.push(`${successfulAttempts} successful`);
        } else if (failedAttemptCount) {
          statusParts.push(` Attempted`);
        }
      }

      if (statusParts.length > 0) {
        return statusParts.join(" • ");
      }

      return "Not researched";
    },
    [researchedSpells, spellAttempts, failedAttempts, isSpellMastered]
  );

  const getSpellBlockReason = useCallback(
    (spellName) => {
      if (isSpellMastered(spellName)) {
        return "Already mastered";
      }

      if (isAttemptActivity) {
        const hasBeenResearched = researchedSpells?.[spellName] || false;
        const hasAnyAttempts =
          (spellAttempts?.[spellName] || 0) > 0 ||
          (failedAttempts?.[spellName] || 0) > 0;

        if (!hasBeenResearched && !hasAnyAttempts) {
          return "Must be researched or previously attempted";
        }
      }

      return null;
    },
    [
      isAttemptActivity,
      researchedSpells,
      spellAttempts,
      failedAttempts,
      isSpellMastered,
    ]
  );

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
        setActiveSpellSlot(null);
        setSearchTerm("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  const handleSpellClick = (spellSlot) => {
    if (!canEdit) return;
    setActiveSpellSlot(spellSlot);
    setIsModalOpen(true);
    setSearchTerm("");
  };

  const handleSpellSelect = (spellName) => {
    if (activeSpellSlot && onSpellSelect) {
      onSpellSelect(activeSpellSlot, spellName);
    }
    setIsModalOpen(false);
    setActiveSpellSlot(null);
    setSearchTerm("");
  };

  const handleClearSpell = (spellSlot, e) => {
    e.stopPropagation();
    if (onSpellSelect) {
      onSpellSelect(spellSlot, "");
    }
    if (onDiceAssign) {
      onDiceAssign(spellSlot, null);
    }
  };

  const handleDiceAssign = (spellSlot, diceIndex) => {
    if (onDiceAssign) {
      onDiceAssign(spellSlot, diceIndex);
    }
  };

  const handleAttempt = (spellSlot) => {
    const spellName = selectedSpells[spellSlot];
    const diceIndex = spellDiceAssignments[spellSlot];

    if (onAttemptSpell && spellName && diceIndex !== null) {
      onAttemptSpell(spellSlot, spellName, diceIndex);
    }
  };

  const canAttemptSpell = (spellSlot) => {
    const spellName = selectedSpells[spellSlot];
    const diceIndex = spellDiceAssignments[spellSlot];

    if (!spellName || diceIndex === null || !canEdit) {
      return false;
    }
    return canSpellBeAttempted(spellName);
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setActiveSpellSlot(null);
      setSearchTerm("");
    }
  };

  const renderSpellSelector = (spellSlot, label) => {
    const spellName = selectedSpells[spellSlot];
    const spellData = getSpellData(spellName);
    const assignedDiceIndex = spellDiceAssignments[spellSlot];
    const isMastered = spellName && isSpellMastered(spellName);
    const blockReason = spellName && getSpellBlockReason(spellName);
    const hasFailedAttempt = failedAttempts[spellName];
    return (
      <div style={styles.spellColumn}>
        <div style={styles.columnHeader}>{label}</div>

        {/* Spell Selection */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Spell</label>
          {spellName && spellData ? (
            <div
              style={styles.selectedSpell}
              onClick={() => handleSpellClick(spellSlot)}
            >
              <div style={styles.selectedSpellInfo}>
                <div style={styles.spellName}>
                  {spellName}
                  {isMastered && (
                    <Crown
                      size={14}
                      style={{ marginLeft: "0.5rem", color: theme.success }}
                    />
                  )}
                  {hasFailedAttempt && (
                    <Eye
                      size={14}
                      style={{ marginLeft: "0.5rem", color: theme.success }}
                    />
                  )}
                </div>
                <div style={styles.spellDetails}>
                  {spellData.subject} • {spellData.level} • Year{" "}
                  {spellData.year}
                </div>
              </div>
              {canEdit && (
                <button
                  style={styles.clearButton}
                  onClick={(e) => handleClearSpell(spellSlot, e)}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.border;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ) : (
            <div
              style={styles.placeholder}
              onClick={() => handleSpellClick(spellSlot)}
            >
              {canEdit ? "Click to select spell..." : "No spell selected"}
            </div>
          )}
        </div>

        {/* Dice Assignment */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Assigned Die</label>
          {assignedDiceIndex !== null ? (
            <div style={styles.assignedDice}>
              <div style={styles.diceValue}>d{dicePool[assignedDiceIndex]}</div>
              {canEdit && (
                <button
                  style={styles.removeButton}
                  onClick={() => handleDiceAssign(spellSlot, null)}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.border;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ) : (
            <select
              style={styles.diceSelector}
              value=""
              onChange={(e) =>
                handleDiceAssign(spellSlot, parseInt(e.target.value))
              }
              disabled={!canEdit}
            >
              <option value="">Select die...</option>
              {availableDiceOptions.map(({ value, index }) => (
                <option key={index} value={index}>
                  d{value}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Attempt Button */}
        {(isResearchActivity || isAttemptActivity) && (
          <div>
            <button
              onClick={() => handleAttempt(spellSlot)}
              disabled={!canAttemptSpell(spellSlot)}
              style={{
                ...styles.attemptButton,
                ...(canAttemptSpell(spellSlot)
                  ? {}
                  : styles.attemptButtonDisabled),
              }}
              onMouseEnter={(e) => {
                if (canAttemptSpell(spellSlot)) {
                  e.target.style.backgroundColor =
                    theme.primaryDark || theme.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (canAttemptSpell(spellSlot)) {
                  e.target.style.backgroundColor = theme.primary;
                }
              }}
            >
              {isResearchActivity ? (
                <BookOpen size={16} />
              ) : (
                <Wand2 size={16} />
              )}
              {isResearchActivity ? "Research" : "Attempt"}
            </button>

            {/* Validation/Mastery messages */}
            {selectedSpells[spellSlot] && blockReason && (
              <div
                style={
                  isMastered ? styles.masteredMessage : styles.validationMessage
                }
              >
                {blockReason}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Activity Information */}
      <div style={styles.activityInfo}>
        <div style={styles.activityTitle}>
          {isResearchActivity ? <BookOpen size={16} /> : <Wand2 size={16} />}
          {isResearchActivity ? "Spell Research" : "Spell Attempt"}
        </div>
        <div style={styles.activityDescription}>
          {isResearchActivity
            ? "Select up to 2 spells to research using History of Magic checks. DC varies based on spell year and character year. Adds an extra die to your dice pool."
            : "Select up to 2 spells to attempt casting (must be researched or previously attempted). Uses appropriate spell casting mechanics. Adds an extra die to your dice pool."}
        </div>
      </div>

      {/* Spell Selection Grid */}
      <div style={styles.container}>
        {renderSpellSelector("first", "First Spell")}
        {renderSpellSelector("second", "Second Spell (Optional)")}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={handleModalBackdropClick}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                Select Spell for{" "}
                {activeSpellSlot === "first" ? "First" : "Second"} Slot
              </h3>
              <button
                style={styles.closeButton}
                onClick={() => {
                  setIsModalOpen(false);
                  setActiveSpellSlot(null);
                  setSearchTerm("");
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = theme.border;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search spells by name or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                  autoFocus
                />
                <Search size={16} style={styles.searchIcon} />
              </div>

              <div style={styles.spellList}>
                {availableSpells.map((spell) => {
                  const canAttempt = canSpellBeAttempted(spell.name);
                  const isMastered = isSpellMastered(spell.name);
                  const status = getSpellStatus(spell.name);
                  const blockReason = getSpellBlockReason(spell.name);
                  const failedAttempted = failedAttempts?.[spell.name];

                  return (
                    <div
                      key={spell.name}
                      style={{
                        ...styles.spellItem,
                        ...(isMastered
                          ? styles.spellItemMastered
                          : canAttempt
                          ? {}
                          : styles.spellItemDisabled),
                      }}
                      onClick={() => {
                        if (canAttempt && !isMastered) {
                          handleSpellSelect(spell.name);
                        }
                      }}
                    >
                      <div style={styles.spellItemInfo}>
                        <div style={styles.spellItemName}>
                          {spell.name}
                          {isMastered && (
                            <Crown
                              size={14}
                              style={{
                                marginLeft: "0.5rem",
                                color: theme.success,
                              }}
                            />
                          )}
                        </div>
                        <div style={styles.spellItemDetails}>
                          {spell.subject} • {spell.level} • Year {spell.year}
                        </div>
                        {blockReason && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: isMastered ? theme.success : theme.error,
                              marginTop: "0.25rem",
                              fontStyle: "italic",
                            }}
                          >
                            {blockReason}
                          </div>
                        )}
                      </div>

                      <div style={styles.spellItemStatus}>
                        {isMastered ? (
                          <Crown size={14} style={styles.masteredIcon} />
                        ) : failedAttempted ? (
                          <CircleEqual
                            size={14}
                            style={styles.failedAttemptsIcon}
                          />
                        ) : !canAttempt && isAttemptActivity ? (
                          <Lock size={14} style={styles.lockIcon} />
                        ) : null}
                        <span>{status}</span>
                      </div>
                    </div>
                  );
                })}

                {availableSpells.length === 0 && (
                  <div
                    style={{
                      ...styles.spellItem,
                      textAlign: "center",
                      color: theme.textSecondary,
                      cursor: "default",
                    }}
                  >
                    No spells found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpellSelector;
