import { useState, useMemo, useCallback } from "react";
import { X, Search, Star, Check } from "lucide-react";
import { spellsData } from "../../SharedData/spells";
import { getSpellModifier, getModifierInfo } from "../SpellBook/utils";
import { useTheme } from "../../contexts/ThemeContext";

const SpellSelector = ({
  activityIndex,
  onSpellSelect,
  onDiceAssign,
  rollAssignments,

  activityText,
  spellDiceAssignments,

  selectedSpells,
  canEdit,
  selectedCharacter,
  spellAttempts,
  researchedSpells,
  failedAttempts,
  availableDiceOptions,
  dicePool,
  containerStyle,
  isResearchActivity,
  isAttemptActivity,
}) => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSpellSlot, setActiveSpellSlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredSpell, setHoveredSpell] = useState(null);

  const useNewInterface = activityIndex !== undefined;

  const activityKey = useNewInterface ? `activity${activityIndex + 1}` : null;
  const assignment = useMemo(() => {
    return useNewInterface ? rollAssignments?.[activityKey] || {} : {};
  }, [useNewInterface, rollAssignments, activityKey]);

  const isResearch =
    isResearchActivity ??
    activityText?.toLowerCase().includes("research spells");
  const isAttempt =
    isAttemptActivity ?? activityText?.toLowerCase().includes("attempt spells");

  const calculateSpellDC = useCallback(
    (_, spellData) => {
      if (!spellData || !selectedCharacter) return 10;

      const playerYear = selectedCharacter.year || 1;
      const spellYear = spellData.year || 1;

      if (isResearch) {
        let baseDC = 8 + 2 * playerYear;
        const yearDifference = spellYear - playerYear;
        baseDC += yearDifference * 2;

        const difficultSpells = [
          "Abscondi",
          "Pellucidi Pellis",
          "Sagittario",
          "Confringo",
          "Devicto",
          "Stupefy",
          "Petrificus Totalus",
          "Protego",
          "Protego Maxima",
          "Finite Incantatem",
          "Confundo",
          "Bombarda",
          "Episkey",
          "Expelliarmus",
          "Incarcerous",
        ];
        if (difficultSpells.includes(spellData.name)) {
          baseDC += 3;
        }

        return Math.max(5, baseDC);
      } else {
        let baseDC = 8 + 2 * spellYear;
        if (spellYear > playerYear) {
          baseDC += (spellYear - playerYear) * 2;
        }
        return Math.max(5, baseDC);
      }
    },
    [isResearch, selectedCharacter]
  );

  const getSpellData = useCallback((spellName) => {
    if (!spellName) return null;
    for (const [subject, subjectData] of Object.entries(spellsData)) {
      if (subjectData.levels) {
        for (const [, levelSpells] of Object.entries(subjectData.levels)) {
          const spell = levelSpells.find((s) => s.name === spellName);
          if (spell) {
            return { ...spell, subject: subject };
          }
        }
      }
    }
    return null;
  }, []);

  const calculateDiceResult = useCallback(
    (spellSlot, spellName) => {
      if (!spellName || !selectedCharacter) return null;

      const spellData = getSpellData(spellName);
      if (!spellData) return null;

      let diceIndex;
      if (useNewInterface) {
        const diceField =
          spellSlot === "first" ? "firstSpellDice" : "secondSpellDice";
        diceIndex = assignment[diceField];
      } else {
        diceIndex = spellDiceAssignments?.[spellSlot];
      }

      if (diceIndex === null || diceIndex === undefined) return null;

      const diceValue = dicePool[diceIndex];
      if (!diceValue) return null;

      const modifier = getSpellModifier(
        spellName,
        spellData.subject,
        selectedCharacter
      );
      const total = diceValue + modifier;
      const dc = calculateSpellDC(spellName, spellData);
      const passes = total >= dc;

      return {
        diceValue,
        modifier,
        total,
        dc,
        passes,
        modifierInfo: getModifierInfo(
          spellName,
          spellData.subject,
          selectedCharacter
        ),
      };
    },
    [
      useNewInterface,
      assignment,
      spellDiceAssignments,
      dicePool,
      getSpellData,
      selectedCharacter,
      calculateSpellDC,
    ]
  );

  const getSpellStatus = useCallback(
    (spell) => {
      const attempts = spellAttempts?.[spell.name] || 0;
      const isMastered = attempts >= 2;
      const hasBeenResearched = researchedSpells?.[spell.name] || false;
      const hasSuccessfulAttempts = attempts > 0;
      const hasFailedAttempts = (failedAttempts?.[spell.name] || 0) > 0;

      let isDisabled = false;
      let disabledReason = "";

      if (isResearch) {
        if (isMastered) {
          isDisabled = true;
          disabledReason = "Mastered";
        } else if (hasBeenResearched) {
          isDisabled = true;
          disabledReason = "Already researched";
        } else if (hasSuccessfulAttempts) {
          isDisabled = true;
          disabledReason = "Previously attempted";
        } else if (hasFailedAttempts) {
          isDisabled = true;
          disabledReason = "Previously attempted (unsuccessfully)";
        }
      } else if (isAttempt) {
        if (isMastered) {
          isDisabled = true;
          disabledReason = "Already mastered";
        } else if (
          !hasBeenResearched &&
          !hasSuccessfulAttempts &&
          !hasFailedAttempts
        ) {
          return { shouldShow: false };
        }
      }

      return {
        shouldShow: true,
        isDisabled,
        disabledReason,
        isMastered,
        hasBeenResearched,
        hasSuccessfulAttempts,
        hasFailedAttempts,
      };
    },
    [isResearch, isAttempt, spellAttempts, researchedSpells, failedAttempts]
  );

  const styles = {
    container: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",

      ...containerStyle,
    },
    spellSlot: {
      borderRadius: "8px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "0.5rem",
      color: theme.text,
    },
    selectedSpell: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.75rem",
      backgroundColor: theme.primary + "10",
      border: `1px solid ${theme.primary}`,
      borderRadius: "6px",
      cursor: canEdit ? "pointer" : "default",
      marginBottom: "0.5rem",
    },
    placeholder: {
      padding: "0.75rem",
      backgroundColor: theme.background,
      border: `2px dashed ${theme.border}`,
      borderRadius: "6px",
      cursor: canEdit ? "pointer" : "default",
      textAlign: "center",
      color: theme.textSecondary,
      marginBottom: "0.5rem",
    },
    diceSelector: {
      width: "100%",
      padding: "0.5rem",
      border: `1px solid ${theme.border}`,
      borderRadius: "4px",
      backgroundColor: theme.surface,
      color: theme.text,
      marginBottom: "0.5rem",
    },
    assignedDice: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.5rem",
      backgroundColor: theme.success + "20",
      border: `1px solid ${theme.success}`,
      borderRadius: "4px",
      marginBottom: "0.5rem",
    },
    diceValue: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: theme.success,
      marginBottom: "0.5rem",
    },
    calculationDisplay: {
      padding: "0.75rem",
      backgroundColor: theme.surface,
      border: `1px solid ${theme.info}`,
      borderRadius: "6px",
      fontSize: "14px",
    },
    calculationText: {
      fontWeight: "600",
      marginBottom: "0.25rem",
    },
    passText: {
      color: theme.success,
      fontWeight: "600",
    },
    failText: {
      color: theme.error,
      fontWeight: "600",
    },
    removeButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: theme.textSecondary,
      padding: "0.25rem",
      borderRadius: "4px",
    },
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "2rem",
      width: "50vw",
      maxHeight: "80vh",
      overflow: "auto",
      zIndex: 1000,
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
    assignedDiceContainer: {
      marginBottom: "1rem",
    },
    assignedDiceTile: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "12px",
      backgroundColor: theme.success + "20",
      border: `2px solid ${theme.success}`,
      borderRadius: "8px",
      transition: "all 0.2s ease",
    },
    diceDisplay: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",

      width: "24px",
      height: "32px",
    },

    diceLabel: {
      fontSize: "12px",
      color: theme.textSecondary,
      fontWeight: "500",
    },
    removeDiceButton: {
      padding: "0.25rem 0.75rem",
      backgroundColor: theme.error + "15",
      color: theme.error,
      border: `1px solid ${theme.error}`,
      borderRadius: "4px",
      fontSize: "0.75rem",
      cursor: "pointer",
      marginTop: "0.5rem",
    },

    spellOptionDisabled: {
      padding: "0.75rem",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      marginBottom: "0.5rem",
      cursor: "not-allowed",
      backgroundColor: theme.surfaceSecondary || "#f3f4f6",
      opacity: 0.6,
    },
    disabledReason: {
      fontSize: "12px",
      fontStyle: "italic",
      color: theme.textSecondary || "#6b7280",
      marginTop: "0.25rem",
    },
  };

  const handleSpellClick = (spellSlot) => {
    if (!canEdit) return;
    setActiveSpellSlot(spellSlot);
    setSearchTerm("");
    setHoveredSpell(null);
    setIsModalOpen(true);
  };

  const handleSpellSelection = (spell) => {
    const status = getSpellStatus(spell);

    if (status.isDisabled) {
      return;
    }

    if (useNewInterface) {
      onSpellSelect(activityIndex, activeSpellSlot, spell.name);
    } else {
      onSpellSelect?.(activeSpellSlot, spell.name);
    }
    setIsModalOpen(false);
    setActiveSpellSlot(null);
    setSearchTerm("");
    setHoveredSpell(null);
  };

  const handleDiceAssign = (spellSlot, diceIndex) => {
    if (useNewInterface) {
      onDiceAssign(activityIndex, spellSlot, diceIndex);
    } else {
      onDiceAssign?.(spellSlot, diceIndex);
    }
  };

  const handleClearSpell = (spellSlot, e) => {
    e.stopPropagation();
    if (useNewInterface) {
      onSpellSelect(activityIndex, spellSlot, "");
      onDiceAssign(activityIndex, spellSlot, null);
    } else {
      onSpellSelect?.(spellSlot, "");
      onDiceAssign?.(spellSlot, null);
    }
  };

  const renderSpellSelector = (spellSlot, label) => {
    const spellName = selectedSpells[spellSlot];
    const spellData = spellName ? getSpellData(spellName) : null;

    let assignedDiceIndex;
    if (useNewInterface) {
      const diceField =
        spellSlot === "first" ? "firstSpellDice" : "secondSpellDice";
      assignedDiceIndex = assignment[diceField];
    } else {
      assignedDiceIndex = spellDiceAssignments?.[spellSlot];
    }

    const diceResult = calculateDiceResult(spellSlot, spellName);

    return (
      <div style={styles.spellSlot}>
        <label style={styles.label}>{label}</label>

        <div>
          {spellName && spellData ? (
            <div
              style={styles.selectedSpell}
              onClick={() => handleSpellClick(spellSlot)}
            >
              <div>
                <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                  {spellName}
                </div>
                <div style={{ fontSize: "12px", color: theme.textSecondary }}>
                  {spellData.subject} • {spellData.level} • Year{" "}
                  {spellData.year}
                </div>
              </div>
              {canEdit && (
                <button
                  style={styles.removeButton}
                  onClick={(e) => handleClearSpell(spellSlot, e)}
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

        <div>
          <label style={styles.label}>Assigned Die</label>
          {assignedDiceIndex !== null && assignedDiceIndex !== undefined ? (
            <div style={styles.assignedDiceContainer}>
              <div style={styles.assignedDiceTile}>
                <div style={styles.diceDisplay}>
                  <div style={styles.diceValue}>
                    {dicePool[assignedDiceIndex]}
                  </div>
                </div>
              </div>
              {canEdit && (
                <button
                  style={styles.removeDiceButton}
                  onClick={() => handleDiceAssign(spellSlot, null)}
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
              {availableDiceOptions
                ?.sort((a, b) => b.value - a.value)
                ?.map(({ value, index }) => (
                  <option key={index} value={index}>
                    {value}
                  </option>
                ))}
            </select>
          )}
        </div>

        {diceResult && spellName && (
          <div style={styles.calculationDisplay}>
            <div style={styles.calculationText}>Roll Calculation:</div>
            <div>
              {diceResult.diceValue} + {diceResult.modifier} ={" "}
              {diceResult.total}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                marginTop: "0.25rem",
              }}
            >
              DC {diceResult.dc} • {diceResult.modifierInfo.source}
            </div>
            <div style={diceResult.passes ? styles.passText : styles.failText}>
              {diceResult.passes ? "✓ PASS" : "✗ FAIL"}
            </div>
          </div>
        )}
      </div>
    );
  };

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

    const eligibleSpells = spells.filter((spell) => {
      const status = getSpellStatus(spell);

      if (!status.shouldShow) {
        return false;
      }

      if (searchTerm && searchTerm.trim()) {
        const lowerSearchTerm = searchTerm.toLowerCase().trim();
        const spellName = (spell.name || "").toLowerCase();
        const spellSubject = (spell.subject || "").toLowerCase();
        const nameMatches = spellName.includes(lowerSearchTerm);
        const subjectMatches = spellSubject.includes(lowerSearchTerm);

        if (!nameMatches && !subjectMatches) {
          return false;
        }
      }

      return true;
    });

    return eligibleSpells.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, getSpellStatus]);

  return (
    <div>
      <div style={styles.container}>
        {renderSpellSelector("first", isResearch ? "Research Spell" : "First Spell")}
        {!isResearch && renderSpellSelector("second", "Second Spell")}
      </div>

      {isModalOpen && (
        <div
          style={styles.modalOverlay}
          onClick={() => {
            setIsModalOpen(false);
            setSearchTerm("");
            setHoveredSpell(null);
          }}
        >
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Select Spell</h3>
            <div style={{ marginBottom: "1rem", position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.textSecondary,
                }}
              />
              <input
                type="text"
                placeholder="Search spells..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.5rem 0.5rem 2.5rem",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "4px",
                  backgroundColor: theme.surface,
                  color: theme.text,
                }}
              />
            </div>

            <div
              key={`spell-list-${searchTerm}-${availableSpells.length}`}
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {availableSpells.length > 0 ? (
                [...availableSpells].map((spell, index) => {
                  const status = getSpellStatus(spell);
                  const isDisabled = status.isDisabled;

                  const isHovered = hoveredSpell === `${spell.name}-${index}`;

                  return (
                    <div
                      key={`spell-${spell.name}-${spell.subject}-${searchTerm}-${index}`}
                      style={
                        isDisabled
                          ? styles.spellOptionDisabled
                          : {
                              padding: "0.75rem",
                              border: `1px solid ${
                                isHovered ? theme.primary : theme.border
                              }`,
                              borderRadius: "6px",
                              marginBottom: "0.5rem",
                              cursor: "pointer",
                              backgroundColor: isHovered
                                ? theme.primary + "10"
                                : theme.surface,
                              transition: "all 0.2s ease",
                              transform: isHovered
                                ? "translateY(-1px)"
                                : "translateY(0)",
                              boxShadow: isHovered
                                ? `0 2px 8px ${theme.primary}20`
                                : "none",
                            }
                      }
                      onClick={() => handleSpellSelection(spell)}
                      onMouseEnter={() =>
                        !isDisabled && setHoveredSpell(`${spell.name}-${index}`)
                      }
                      onMouseLeave={() => setHoveredSpell(null)}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            {spell.name}
                            {status.isMastered && (
                              <Star
                                size={14}
                                color="#ffd700"
                                fill="#ffd700"
                                title="Mastered"
                              />
                            )}
                            {isResearch && !status.isMastered && (
                              <>
                                {status.hasSuccessfulAttempts && (
                                  <Check
                                    size={14}
                                    color="#10b981"
                                    title="Previously attempted successfully"
                                  />
                                )}
                                {!status.hasSuccessfulAttempts &&
                                  status.hasFailedAttempts && (
                                    <Check
                                      size={14}
                                      color="#ef4444"
                                      title="Previously attempted (unsuccessfully)"
                                    />
                                  )}
                              </>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: theme.textSecondary,
                            }}
                          >
                            {spell.description}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: theme.textSecondary,
                            }}
                          >
                            {spell.subject} • {spell.level} • Year {spell.year}
                          </div>
                          {isDisabled && (
                            <div style={styles.disabledReason}>
                              {status.disabledReason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  key={`no-results-${searchTerm}`}
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: theme.textSecondary,
                  }}
                >
                  {searchTerm
                    ? `No spells found matching "${searchTerm}".`
                    : isResearch
                    ? "No spells available for research. All eligible spells have been researched, attempted, or failed."
                    : "No spells available for attempts. You need to research spells first or have attempted/failed spells."}
                </div>
              )}
            </div>
            <button
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: theme.warning,
                color: theme.text,
                fontWeight: 700,
                border: `1px solid ${theme.border}`,
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => {
                setIsModalOpen(false);
                setSearchTerm("");
                setHoveredSpell(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpellSelector;
