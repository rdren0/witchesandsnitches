import { useState, useMemo, useCallback } from "react";
import { X, Search, Lock } from "lucide-react";
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
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pendingSpell, setPendingSpell] = useState(null);

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

      let baseDC = 8 + 2 * spellYear;
      if (spellYear > playerYear) {
        baseDC += (spellYear - playerYear) * 2;
      }

      if (isResearch) {
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
      }

      return Math.max(5, baseDC);
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

      const isRestricted = spell.restriction === true;

      let isDisabled = false;
      let disabledReason = "";

      if (isResearch && !isRestricted) {
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
        isRestricted,
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
    restrictionIcon: {
      color: "#f59e0b",
      marginLeft: "0.5rem",
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
      backgroundColor: theme.background,
      border: `2px solid ${theme.border}`,
      borderRadius: "16px",
      padding: "0",
      width: "70vw",
      maxWidth: "1000px",
      maxHeight: "85vh",
      overflow: "hidden",
      zIndex: 1000,
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
      display: "flex",
      flexDirection: "column",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 999,
      backdropFilter: "blur(4px)",
    },
    modalHeader: {
      padding: "1.5rem 2rem",
      borderBottom: `2px solid ${theme.border}`,
      backgroundColor: theme.surface,
    },
    modalTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: theme.text,
      margin: 0,
    },
    filterSection: {
      padding: "1.5rem 2rem",
      backgroundColor: theme.surface,
      borderBottom: `1px solid ${theme.border}`,
    },
    filterGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr",
      gap: "1rem",
      marginTop: "1rem",
    },
    sortGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "1rem",
      marginTop: "1rem",
      paddingTop: "1rem",
      borderTop: `1px solid ${theme.border}`,
    },
    filterLabel: {
      display: "block",
      fontSize: "12px",
      fontWeight: "600",
      color: theme.textSecondary,
      marginBottom: "0.5rem",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    filterSelect: {
      width: "100%",
      padding: "0.5rem",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      backgroundColor: theme.background,
      color: theme.text,
      fontSize: "14px",
      cursor: "pointer",
    },
    spellListContainer: {
      flex: 1,
      overflow: "auto",
      padding: "1.5rem 2rem",
    },
    modalFooter: {
      padding: "1rem 2rem",
      borderTop: `2px solid ${theme.border}`,
      backgroundColor: theme.surface,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    spellCount: {
      fontSize: "14px",
      color: theme.textSecondary,
      fontWeight: "500",
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
      padding: "1rem",
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      marginBottom: "0.75rem",
      cursor: "not-allowed",
      backgroundColor: theme.surface,
      opacity: 0.5,
    },
    spellCard: {
      padding: "1rem",
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      marginBottom: "0.75rem",
      cursor: "pointer",
      backgroundColor: theme.surface,
      transition: "all 0.2s ease",
    },
    spellCardHovered: {
      border: `2px solid ${theme.primary}`,
      backgroundColor: theme.primary + "08",
      transform: "translateY(-2px)",
      boxShadow: `0 4px 12px ${theme.primary}20`,
    },
    spellCardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "0.5rem",
    },
    spellName: {
      fontSize: "16px",
      fontWeight: "700",
      color: theme.text,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    spellBadge: {
      fontSize: "10px",
      fontWeight: "600",
      padding: "2px 6px",
      borderRadius: "4px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    spellDescription: {
      fontSize: "13px",
      color: theme.textSecondary,
      marginBottom: "0.75rem",
      lineHeight: "1.4",
    },
    spellMeta: {
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
      fontSize: "12px",
      color: theme.textSecondary,
    },
    spellMetaItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
      fontWeight: "500",
    },
    disabledReason: {
      fontSize: "12px",
      fontStyle: "italic",
      color: theme.textSecondary,
      marginTop: "0.5rem",
      padding: "0.5rem",
      backgroundColor: theme.background,
      borderRadius: "4px",
      borderLeft: `3px solid ${theme.border}`,
    },
    clearFiltersButton: {
      padding: "0.5rem 1rem",
      backgroundColor: theme.background,
      color: theme.textSecondary,
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      fontSize: "12px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "all 0.2s ease",
    },
  };

  const handleSpellClick = (spellSlot) => {
    if (!canEdit) return;
    setActiveSpellSlot(spellSlot);
    setSearchTerm("");
    setHoveredSpell(null);
    setPendingSpell(null);
    setIsModalOpen(true);
  };

  const handleSpellSelection = (spell) => {
    const status = getSpellStatus(spell);

    if (status.isDisabled) {
      return;
    }

    setPendingSpell(spell);
  };

  const handleConfirmSelection = () => {
    if (!pendingSpell) return;

    if (useNewInterface) {
      onSpellSelect(activityIndex, activeSpellSlot, pendingSpell.name);
    } else {
      onSpellSelect?.(activeSpellSlot, pendingSpell.name);
    }
    setIsModalOpen(false);
    setActiveSpellSlot(null);
    setSearchTerm("");
    setHoveredSpell(null);
    setPendingSpell(null);
    setFilterSubject("all");
    setFilterYear("all");
    setFilterLevel("all");
    setSortBy("name");
    setSortOrder("asc");
  };

  const handleCancelSelection = () => {
    setIsModalOpen(false);
    setActiveSpellSlot(null);
    setSearchTerm("");
    setHoveredSpell(null);
    setPendingSpell(null);
    setFilterSubject("all");
    setFilterYear("all");
    setFilterLevel("all");
    setSortBy("name");
    setSortOrder("asc");
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
    const spellStatus = spellData ? getSpellStatus(spellData) : null;

    let assignedDiceIndex;
    if (useNewInterface) {
      const diceField =
        spellSlot === "first" ? "firstSpellDice" : "secondSpellDice";
      assignedDiceIndex = assignment[diceField];
    } else {
      assignedDiceIndex = spellDiceAssignments?.[spellSlot];
    }

    const diceResult = calculateDiceResult(spellSlot, spellName);
    const shouldShowDC = spellData && spellData.year;

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
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {spellName}
                  {spellStatus?.isRestricted && (
                    <Lock size={14} style={styles.restrictionIcon} />
                  )}
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
            {shouldShowDC && (
              <>
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.textSecondary,
                    marginTop: "0.25rem",
                  }}
                >
                  DC {diceResult.dc} • Using:{" "}
                  {diceResult.modifierInfo.abilityName}
                </div>
                <div
                  style={diceResult.passes ? styles.passText : styles.failText}
                >
                  {diceResult.passes ? "✓ PASS" : "✗ FAIL"}
                </div>
              </>
            )}
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
        const spellDescription = (spell.description || "").toLowerCase();

        const nameMatches = spellName.includes(lowerSearchTerm);
        const subjectMatches = spellSubject.includes(lowerSearchTerm);
        const descriptionMatches = spellDescription.includes(lowerSearchTerm);

        if (!nameMatches && !subjectMatches && !descriptionMatches) {
          return false;
        }
      }

      if (filterSubject !== "all" && spell.subject !== filterSubject) {
        return false;
      }

      if (filterYear !== "all" && spell.year !== parseInt(filterYear)) {
        return false;
      }

      if (filterLevel !== "all") {
        const normalizedSpellLevel =
          spell.level === "Cantrip" ? "Cantrips" : spell.level;
        const normalizedFilterLevel = filterLevel;
        if (normalizedSpellLevel !== normalizedFilterLevel) {
          return false;
        }
      }

      return true;
    });

    const sortedSpells = [...eligibleSpells].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "year": {
          const aHasYear = Boolean(a.year);
          const bHasYear = Boolean(b.year);

          if (!aHasYear && !bHasYear) {
            comparison = 0;
          } else if (!aHasYear) {
            return 1;
          } else if (!bHasYear) {
            return -1;
          } else {
            comparison = a.year - b.year;
          }
          break;
        }
        case "level": {
          const levelOrder = {
            Cantrip: 0,
            Cantrips: 0,
            "1st Level": 1,
            "2nd Level": 2,
            "3rd Level": 3,
            "4th Level": 4,
            "5th Level": 5,
            "6th Level": 6,
            "7th Level": 7,
            "8th Level": 8,
            "9th Level": 9,
          };
          const aLevel = levelOrder[a.level] ?? 999;
          const bLevel = levelOrder[b.level] ?? 999;
          comparison = aLevel - bLevel;
          break;
        }
        case "dc": {
          const aHasUnknownDC = !a.year;
          const bHasUnknownDC = !b.year;

          if (aHasUnknownDC && !bHasUnknownDC) {
            comparison = 1;
          } else if (!aHasUnknownDC && bHasUnknownDC) {
            comparison = -1;
          } else if (!aHasUnknownDC && !bHasUnknownDC) {
            const aDC = calculateSpellDC(a.name, a);
            const bDC = calculateSpellDC(b.name, b);
            comparison = aDC - bDC;
          } else {
            comparison = 0;
          }
          break;
        }
        default:
          comparison = a.name.localeCompare(b.name);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sortedSpells;
  }, [
    searchTerm,
    filterSubject,
    filterYear,
    filterLevel,
    sortBy,
    sortOrder,
    getSpellStatus,
    calculateSpellDC,
  ]);

  const coreSubjects = [
    "Charms",
    "Jinxes, Hexes & Curses",
    "Transfigurations",
    "Divinations",
    "Healing",
  ];

  const uniqueSubjects = useMemo(() => {
    const allSubjects = Object.keys(spellsData);
    const standardSubjects = allSubjects.filter((subject) =>
      coreSubjects.includes(subject)
    );
    const specializedSubjects = allSubjects.filter(
      (subject) => !coreSubjects.includes(subject)
    );

    return {
      standard: standardSubjects.sort(),
      specialized: specializedSubjects.sort(),
    };
  }, []);

  const uniqueYears = useMemo(() => {
    const years = new Set();
    Object.values(spellsData).forEach((subjectData) => {
      if (subjectData.levels) {
        Object.values(subjectData.levels).forEach((levelSpells) => {
          levelSpells.forEach((spell) => {
            if (spell.year) years.add(spell.year);
          });
        });
      }
    });
    return Array.from(years).sort((a, b) => a - b);
  }, []);

  const uniqueLevels = useMemo(() => {
    const levels = new Set();
    Object.values(spellsData).forEach((subjectData) => {
      if (subjectData.levels) {
        Object.keys(subjectData.levels).forEach((level) => {
          levels.add(level);
        });
      }
    });
    return Array.from(levels).sort((a, b) => {
      if (a === "Cantrips") return -1;
      if (b === "Cantrips") return 1;

      return a.localeCompare(b);
    });
  }, []);

  return (
    <div>
      <div style={styles.container}>
        {renderSpellSelector(
          "first",
          isResearch ? "Research Spell" : "First Spell"
        )}
        {!isResearch && renderSpellSelector("second", "Second Spell")}
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={handleCancelSelection}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {isResearch
                  ? "Select Spell to Research"
                  : "Select Spell to Attempt"}
              </h3>
            </div>

            {/* Filter Section */}
            <div style={styles.filterSection}>
              <div style={styles.filterGrid}>
                {/* Search */}
                <div>
                  <label style={styles.filterLabel}>Search</label>
                  <div style={{ position: "relative" }}>
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
                        borderRadius: "6px",
                        backgroundColor: theme.background,
                        color: theme.text,
                        fontSize: "14px",
                      }}
                    />
                  </div>
                </div>

                {/* Subject Filter */}
                <div>
                  <label style={styles.filterLabel}>Subject</label>
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="all">All Subjects</option>
                    <optgroup label="Standard Subjects">
                      {uniqueSubjects.standard.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </optgroup>
                    {uniqueSubjects.specialized.length > 0 && (
                      <optgroup label="Specialized Subjects">
                        {uniqueSubjects.specialized.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label style={styles.filterLabel}>Year</label>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="all">All Years</option>
                    {uniqueYears.map((year) => (
                      <option key={year} value={year}>
                        Year {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label style={styles.filterLabel}>Level</label>
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="all">All Levels</option>
                    {uniqueLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm ||
                filterSubject !== "all" ||
                filterYear !== "all" ||
                filterLevel !== "all") && (
                <button
                  style={{
                    ...styles.clearFiltersButton,
                    marginTop: "1rem",
                  }}
                  onClick={() => {
                    setSearchTerm("");
                    setFilterSubject("all");
                    setFilterYear("all");
                    setFilterLevel("all");
                  }}
                >
                  <X
                    size={14}
                    style={{ display: "inline", marginRight: "0.25rem" }}
                  />
                  Clear All Filters
                </button>
              )}

              {/* Sort Controls */}
              <div style={styles.sortGrid}>
                <div>
                  <label style={styles.filterLabel}>Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="name">Name</option>
                    <option value="year">Year</option>
                    <option value="level">Level</option>
                    <option value="dc">DC</option>
                  </select>
                </div>
                <div>
                  <label style={styles.filterLabel}>Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Spell List */}
            <div style={styles.spellListContainer}>
              {availableSpells.length > 0 ? (
                [...availableSpells].map((spell, index) => {
                  const status = getSpellStatus(spell);
                  const isDisabled = status.isDisabled;
                  const isHovered = hoveredSpell === `${spell.name}-${index}`;
                  const isSelected = pendingSpell?.name === spell.name;

                  const getYearColor = (year) => {
                    const colors = {
                      1: "#3b82f6",
                      2: "#10b981",
                      3: "#f59e0b",
                      4: "#8b5cf6",
                      5: "#ef4444",
                      6: "#ec4899",
                      7: "#06b6d4",
                    };
                    return colors[year] || theme.primary;
                  };

                  return (
                    <div
                      key={`spell-${spell.name}-${spell.subject}-${index}`}
                      style={
                        isDisabled
                          ? styles.spellOptionDisabled
                          : {
                              ...styles.spellCard,
                              ...(isSelected
                                ? {
                                    border: `3px solid ${theme.success}`,
                                    backgroundColor: theme.success + "15",
                                  }
                                : isHovered
                                ? styles.spellCardHovered
                                : {}),
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
                          alignItems: "flex-start",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <div style={styles.spellName}>
                          {spell.name}
                          {status.isRestricted && (
                            <Lock size={16} style={styles.restrictionIcon} />
                          )}
                          {!status.isRestricted && status.isMastered && (
                            <span
                              style={{
                                ...styles.spellBadge,
                                backgroundColor: "#ffd700",
                                color: "#000",
                              }}
                            >
                              Mastered
                            </span>
                          )}
                          {!status.isRestricted &&
                            !status.isMastered &&
                            (status.hasSuccessfulAttempts ||
                              status.hasFailedAttempts) && (
                              <span
                                style={{
                                  ...styles.spellBadge,
                                  backgroundColor: status.hasSuccessfulAttempts
                                    ? "#10b981"
                                    : "#f59e0b",
                                  color: "#fff",
                                }}
                              >
                                {status.hasSuccessfulAttempts
                                  ? "Attempted"
                                  : "Failed"}
                              </span>
                            )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexShrink: 0,
                            marginLeft: "1rem",
                          }}
                        >
                          {spell.year && (
                            <span
                              style={{
                                ...styles.spellBadge,
                                backgroundColor:
                                  getYearColor(spell.year) + "20",
                                color: getYearColor(spell.year),
                                padding: "4px 8px",
                                fontSize: "11px",
                              }}
                            >
                              Year {spell.year}
                            </span>
                          )}
                          {spell.level && (
                            <span
                              style={{
                                ...styles.spellBadge,
                                backgroundColor: theme.info + "20",
                                color: theme.info,
                                padding: "4px 8px",
                                fontSize: "11px",
                              }}
                            >
                              {spell.level}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={styles.spellDescription}>
                        {spell.description}
                      </div>

                      <div style={styles.spellMeta}>
                        <div style={styles.spellMetaItem}>
                          <span style={{ fontWeight: "600" }}>Subject:</span>
                          <span>{spell.subject}</span>
                        </div>
                        <div style={styles.spellMetaItem}>
                          <span style={{ fontWeight: "600" }}>DC:</span>
                          {!spell.year ? (
                            <span
                              style={{
                                color: theme.error,
                                fontStyle: "italic",
                              }}
                            >
                              ?? (Consult DM)
                            </span>
                          ) : (
                            <span
                              style={{
                                color: theme.primary,
                                fontWeight: "700",
                              }}
                            >
                              {calculateSpellDC(spell.name, spell)}
                            </span>
                          )}
                        </div>
                      </div>

                      {isDisabled && status.disabledReason && (
                        <div style={styles.disabledReason}>
                          {status.disabledReason}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: "3rem 2rem",
                    textAlign: "center",
                    color: theme.textSecondary,
                  }}
                >
                  <Search
                    size={48}
                    color={theme.textSecondary}
                    style={{ marginBottom: "1rem" }}
                  />
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      marginBottom: "0.5rem",
                    }}
                  >
                    No spells found
                  </p>
                  <p style={{ fontSize: "14px" }}>
                    {searchTerm ||
                    filterSubject !== "all" ||
                    filterYear !== "all" ||
                    filterLevel !== "all"
                      ? "Try adjusting your filters or search terms."
                      : isResearch
                      ? "No spells available for research."
                      : "No spells available for attempts."}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={styles.modalFooter}>
              <div style={styles.spellCount}>
                Showing {availableSpells.length} spell
                {availableSpells.length !== 1 ? "s" : ""}
                {pendingSpell && (
                  <span
                    style={{
                      marginLeft: "1rem",
                      color: theme.success,
                      fontWeight: "600",
                    }}
                  >
                    Selected: {pendingSpell.name}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: theme.success,
                    color: "#fff",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "8px",
                    cursor: pendingSpell ? "pointer" : "not-allowed",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                    opacity: pendingSpell ? 1 : 0.5,
                  }}
                  onClick={handleConfirmSelection}
                  disabled={!pendingSpell}
                >
                  Confirm
                </button>
                <button
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: theme.error,
                    color: "#fff",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                  }}
                  onClick={handleCancelSelection}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpellSelector;
