import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  calculateModifier,
  activityRequiresDualChecks,
  activityRequiresWandSelection,
  activityRequiresSpellSelection,
  activityRequiresClassSelection,
  calculateWandStatIncreaseDC,
  activityRequiresAbilitySelection,
} from "../Components/Downtime/downtimeHelpers";
import { getSpellModifier } from "../Components/SpellBook/utils";
import { spellsData } from "../SharedData/spells";
import {
  Check,
  X,
  Save,
  Eye,
  AlertCircle,
  Calendar,
  User,
  Scroll,
} from "lucide-react";
import { allSkills, skillMap } from "../SharedData/data";

export const formatModifier = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

const AdminDowntimeReviewForm = React.memo(
  ({ supabase, sheetId, onClose, onReviewComplete }) => {
    const { theme } = useTheme();
    const [downtimeSheet, setDowntimeSheet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [reviewStatus, setReviewStatus] = useState("pending");
    const [adminFeedback, setAdminFeedback] = useState("");
    const [adminNotes, setAdminNotes] = useState("");
    const [activityReviews, setActivityReviews] = useState({});
    const [relationshipReviews, setRelationshipReviews] = useState({});

    const styles = useMemo(
      () => ({
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: "20px",
        },
        modal: {
          backgroundColor: theme.surface,
          borderRadius: "16px",
          width: "95%",
          maxWidth: "1400px",
          maxHeight: "90vh",
          overflowY: "auto",
          border: `3px solid ${theme.border}`,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
        header: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px",
          borderBottom: `2px solid ${theme.border}`,
          position: "sticky",
          top: 0,
          backgroundColor: theme.surface,
          zIndex: 10,
        },
        title: {
          fontSize: "20px",
          fontWeight: "700",
          color: theme.text,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        },
        closeButton: {
          background: "none",
          border: "none",
          fontSize: "24px",
          color: theme.textSecondary,
          cursor: "pointer",
          padding: "8px",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        },
        content: {
          padding: "24px",
        },
        mainGrid: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        },
        leftPanel: {},
        rightPanel: {},
        section: {
          backgroundColor: theme.background,
          padding: "20px",
          borderRadius: "12px",
          border: `2px solid ${theme.border}`,
          marginBottom: "20px",
        },
        sectionTitle: {
          fontSize: "18px",
          fontWeight: "600",
          color: theme.text,
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        },
        characterInfo: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        },
        infoItem: {
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        },
        label: {
          fontSize: "12px",
          fontWeight: "600",
          color: theme.textSecondary,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        },
        value: {
          fontSize: "14px",
          color: theme.text,
          fontWeight: "500",
        },
        activity: {
          padding: "16px",
          backgroundColor: theme.surface,
          borderRadius: "8px",
          border: `1px solid ${theme.border}`,
          marginBottom: "12px",
        },
        activityHeader: {
          fontSize: "24px",
          fontWeight: "600",
          color: theme.text,
          marginBottom: "8px",
        },
        relationshipHeader: {
          fontSize: "18px",
          color: theme.text,
        },
        activityTitle: {
          fontSize: "14px",
          fontWeight: "600",
          color: theme.text,
          marginBottom: "4px",
        },
        activityDetails: {
          fontSize: "12px",
          color: theme.textSecondary,
          marginBottom: "8px",
        },
        rollResultSection: {
          backgroundColor: theme.surface + "40",
          border: `1px solid ${theme.border}`,
          borderRadius: "6px",
          padding: "12px",
          marginBottom: "12px",
        },
        rollResultHeader: {
          fontSize: "0.9rem",
          color: theme.textSecondary,
          marginBottom: "8px",
        },
        rollBreakdown: {
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "1.1rem",
          fontWeight: "bold",
          marginBottom: "4px",
        },
        rollValue: {
          color: theme.primary,
          fontFamily: "monospace",
        },
        modifier: {
          color: theme.text,
          fontFamily: "monospace",
        },
        equals: {
          color: theme.textSecondary,
        },
        total: {
          color: "#10b981",
          fontFamily: "monospace",
          fontSize: "1.2rem",
        },
        skillUsed: {
          fontSize: "0.8rem",
          color: theme.textSecondary,
          fontStyle: "italic",
          marginBottom: "8px",
        },
        playerNotes: {
          marginBottom: "12px",
        },
        notesContent: {
          padding: "8px",
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: "4px",
          fontSize: "0.9rem",
          color: theme.text,
        },
        reviewSection: {
          marginTop: "12px",
          padding: "12px",
          backgroundColor: theme.background,
          borderRadius: "6px",
          border: `1px solid ${theme.border}`,
        },
        select: {
          padding: "8px 12px",
          borderRadius: "6px",
          border: `2px solid ${theme.border}`,
          backgroundColor: theme.surface,
          color: theme.text,
          fontSize: "14px",
          marginBottom: "8px",
          width: "100%",
        },
        textarea: {
          padding: "12px",
          borderRadius: "6px",
          border: `2px solid ${theme.border}`,
          backgroundColor: theme.surface,
          color: theme.text,
          fontSize: "14px",
          width: "100%",
          minHeight: "60px",
          resize: "vertical",
          fontFamily: "inherit",
        },
        statusBadge: {
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "600",
          textAlign: "center",
          display: "inline-block",
        },
        pendingBadge: {
          backgroundColor: "#f59e0b",
          color: "white",
        },
        successBadge: {
          backgroundColor: "#10b981",
          color: "white",
        },
        failureBadge: {
          backgroundColor: "#ef4444",
          color: "white",
        },
        reviewButtons: {
          display: "flex",
          gap: "12px",
          marginBottom: "16px",
        },
        reviewButton: {
          padding: "12px 20px",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.2s ease",
        },
        dcSection: {
          marginTop: "8px",
        },
        dcInput: {
          padding: "4px 8px",
          border: `1px solid ${theme.border}`,
          borderRadius: "4px",
          backgroundColor: theme.surface,
          color: theme.text,
          fontSize: "14px",
          width: "80px",
          marginLeft: "8px",
        },
        saveButton: {
          padding: "16px 24px",
          backgroundColor: theme.primary,
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "24px",
          width: "100%",
          justifyContent: "center",
          transition: "all 0.2s ease",
        },
        loadingSpinner: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          color: theme.textSecondary,
        },
        errorMessage: {
          padding: "20px",
          backgroundColor: "#fee2e2",
          color: "#dc2626",
          borderRadius: "8px",
          marginBottom: "20px",
        },

        dualRollContainer: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        },
        dualCheckNotice: {
          backgroundColor: `${theme.info || "#3b82f6"}15`,
          border: `1px solid ${theme.info || "#3b82f6"}30`,
          borderRadius: "8px",
          padding: "12px",
          marginBottom: "16px",
          fontSize: "14px",
          color: theme.text,
        },
        rollContainer: {
          backgroundColor: theme.surface + "20",
          border: `1px solid ${theme.border}`,
          borderRadius: "6px",
          padding: "12px",
        },
        rollLabel: {
          fontSize: "0.875rem",
          fontWeight: "600",
          color: theme.textSecondary,
          marginBottom: "8px",
        },
        specialActivityBox: {
          padding: "1rem",
          borderRadius: "6px",
          marginBottom: "0.5rem",
        },
        successBox: {
          backgroundColor: "#10b98120",
          borderColor: "#10b981",
        },
        failureBox: {
          backgroundColor: "#ef444420",
          borderColor: "#ef4444",
        },
        warningBox: {
          backgroundColor: "#f59e0b20",
          borderColor: "#f59e0b",
        },
        infoBox: {
          backgroundColor: theme.primary + "20",
          borderColor: theme.primary,
        },
      }),
      [theme]
    );

    const reviewButtonStyles = useMemo(
      () => ({
        successOption: {
          ...styles.reviewButton,
          backgroundColor:
            reviewStatus === "success" ? "#10b98120" : "transparent",
          color: reviewStatus === "success" ? "#10b981" : theme.textSecondary,
          border: `1px solid ${
            reviewStatus === "success" ? "#10b981" : theme.border
          }`,
          padding: "8px 12px",
          fontSize: "13px",
          fontWeight: reviewStatus === "success" ? "600" : "400",
        },
        failureOption: {
          ...styles.reviewButton,
          backgroundColor:
            reviewStatus === "failure" ? "#ef444420" : "transparent",
          color: reviewStatus === "failure" ? "#ef4444" : theme.textSecondary,
          border: `1px solid ${
            reviewStatus === "failure" ? "#ef4444" : theme.border
          }`,
          padding: "8px 12px",
          fontSize: "13px",
          fontWeight: reviewStatus === "failure" ? "600" : "400",
        },
        pendingOption: {
          ...styles.reviewButton,
          backgroundColor:
            reviewStatus === "pending" ? "#f59e0b20" : "transparent",
          color: reviewStatus === "pending" ? "#f59e0b" : theme.textSecondary,
          border: `1px solid ${
            reviewStatus === "pending" ? "#f59e0b" : theme.border
          }`,
          padding: "8px 12px",
          fontSize: "13px",
          fontWeight: reviewStatus === "pending" ? "600" : "400",
        },
      }),
      [styles.reviewButton, reviewStatus, theme]
    );

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

    const calculateResearchDC = useCallback(
      (playerYear, spellYear, spellName) => {
        let baseDC = 8 + 2 * spellYear;

        if (spellYear > playerYear) {
          baseDC += (spellYear - playerYear) * 2;
        }

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

        if (difficultSpells.includes(spellName)) {
          baseDC += 3;
        }

        return Math.max(5, baseDC);
      },
      []
    );

    const calculateModifierValue = useCallback((modifierName, character) => {
      if (!modifierName || !character) return 0;

      try {
        const transformedCharacter = {
          ...character,
          ...character.ability_scores,
          abilityScores: character.ability_scores,
          skillProficiencies: character.skill_proficiencies,
          skill_proficiencies: character.skill_proficiencies,
          skillExpertise: character.skill_expertise,
          skill_expertise: character.skill_expertise,
          magicModifiers: character.magic_modifiers,
          magic_modifiers: character.magic_modifiers,
          proficiencyBonus:
            character.proficiency_bonus ||
            (character.level ? Math.ceil(character.level / 4) + 1 : 2),
        };

        return calculateModifier(modifierName, transformedCharacter);
      } catch (error) {
        console.warn(`Error calculating modifier for ${modifierName}:`, error);
        return 0;
      }
    }, []);

    const renderWandIncreaseReview = useCallback(
      (activity, assignment, character, dicePool) => {
        if (!activityRequiresWandSelection(activity.activity)) return null;

        const wandModifier = activity.selectedWandModifier;

        if (!wandModifier) {
          return (
            <div style={{ ...styles.specialActivityBox, ...styles.warningBox }}>
              <div>
                <strong>⚠️ No Wand Modifier Selected</strong>
              </div>
              <div>Student did not select a wand modifier to increase.</div>
            </div>
          );
        }

        if (
          assignment.diceIndex === null ||
          assignment.diceIndex === undefined
        ) {
          return (
            <div style={{ ...styles.specialActivityBox, ...styles.warningBox }}>
              <div>
                <strong>⚠️ No Die Assigned</strong>
              </div>
              <div>Wand Modifier: {wandModifier}</div>
              <div>No die was assigned to this activity.</div>
            </div>
          );
        }

        const diceValue = dicePool[assignment.diceIndex];
        const currentWandValue = character.magic_modifiers?.[wandModifier] || 0;
        const totalRoll = diceValue + currentWandValue;
        const dc = calculateWandStatIncreaseDC(character, wandModifier);
        const success = totalRoll >= dc;

        const wandDisplayNames = {
          charms: "Charms",
          transfiguration: "Transfiguration",
          jinxesHexesCurses: "Jinxes, Hexes & Curses",
          healing: "Healing",
          divinations: "Divinations",
        };

        return (
          <div
            style={{
              ...styles.specialActivityBox,
              ...(success ? styles.successBox : styles.failureBox),
            }}
          >
            <div>
              <strong>
                🪄 Wand Stat Increase:{" "}
                {wandDisplayNames[wandModifier] || wandModifier}
              </strong>
            </div>
            <div>Current Value: {formatModifier(currentWandValue)}</div>
            <div>DC Required: {dc}</div>
            <div>
              Roll: ({diceValue}) {currentWandValue} = {totalRoll}
            </div>
          </div>
        );
      },
      [
        styles.specialActivityBox,
        styles.warningBox,
        styles.successBox,
        styles.failureBox,
      ]
    );

    const renderAbilityScoreIncreaseReview = (
      activity,
      activityAssignment,
      character,
      dicePool
    ) => {
      if (!activityRequiresAbilitySelection(activity.activity)) {
        return null;
      }

      const abilities = [
        { name: "strength", displayName: "Strength" },
        { name: "dexterity", displayName: "Dexterity" },
        { name: "constitution", displayName: "Constitution" },
        { name: "intelligence", displayName: "Intelligence" },
        { name: "wisdom", displayName: "Wisdom" },
        { name: "charisma", displayName: "Charisma" },
      ];

      const selectedAbility = abilities.find(
        (a) => a.name === activity.selectedAbilityScore
      );
      const abilityDisplayName =
        selectedAbility?.displayName ||
        activity.selectedAbilityScore?.charAt(0).toUpperCase() +
          activity.selectedAbilityScore?.slice(1) ||
        "Unknown";

      const currentScore =
        character?.ability_scores?.[activity.selectedAbilityScore] ||
        character?.[activity.selectedAbilityScore] ||
        10;
      const dc = currentScore;

      return (
        <div style={styles.activityDetails}>
          <div style={{ marginBottom: "8px" }}>
            <strong>Selected Ability Score:</strong> {abilityDisplayName}
          </div>
          <div style={{ marginBottom: "8px" }}>
            <strong>Current Score:</strong> {currentScore} (DC: {dc})
          </div>
          <div style={{ fontSize: "12px", color: theme.textSecondary }}>
            Must succeed on 3 separate checks to increase this ability score by
            1.
          </div>
        </div>
      );
    };

    const renderSpellActivityReview = useCallback(
      (
        activity,
        assignment,
        character,
        dicePool,
        selectedSpells,
        activityIndex
      ) => {
        if (!activityRequiresSpellSelection(activity.activity)) return null;

        const activityKey = `activity${activityIndex + 1}`;
        const spellSelections = selectedSpells?.[activityKey];

        if (
          !spellSelections ||
          (!spellSelections.first && !spellSelections.second)
        ) {
          return (
            <div style={{ ...styles.specialActivityBox, ...styles.warningBox }}>
              <div>
                <strong>⚠️ No Spells Selected</strong>
              </div>
              <div>This spell activity has no spells selected.</div>
            </div>
          );
        }

        const isResearchActivity = activity.activity
          .toLowerCase()
          .includes("research spells");

        const renderSpellResult = (spellName, diceField, spellSlot) => {
          if (!spellName) return null;

          const diceIndex = assignment[diceField];
          if (diceIndex === null || diceIndex === undefined) {
            return (
              <div style={{ marginBottom: "1rem" }}>
                <div>
                  <strong>
                    {spellSlot} Spell: {spellName}
                  </strong>
                </div>
                <div style={{ color: "#f59e0b" }}>⚠️ No die assigned</div>
              </div>
            );
          }

          const diceValue = dicePool[diceIndex];
          const spellData = getSpellData(spellName);

          if (!spellData) {
            return (
              <div style={{ marginBottom: "1rem" }}>
                <div>
                  <strong>
                    {spellSlot} Spell: {spellName}
                  </strong>
                </div>
                <div style={{ color: "#ef4444" }}>❌ Spell data not found</div>
              </div>
            );
          }

          const modifier = getSpellModifier(
            spellName,
            spellData.subject,
            character
          );
          const totalRoll = diceValue + modifier;

          let dc, success;
          if (isResearchActivity) {
            const playerYear = character.level || 1;
            const spellYear = spellData.year || 1;
            dc = calculateResearchDC(playerYear, spellYear, spellName);
            success = totalRoll >= dc;
          } else {
            const playerYear = character.level || 1;
            const spellYear = spellData.year || 1;
            dc = 8 + 2 * spellYear;
            if (spellYear > playerYear) {
              dc += (spellYear - playerYear) * 2;
            }
            dc = Math.max(5, dc);
            success = totalRoll >= dc;
          }

          return (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem",
                backgroundColor: success ? "#10b98110" : "#ef444410",
                border: `1px solid ${success ? "#10b981" : "#ef4444"}`,
                borderRadius: "4px",
              }}
            >
              <div>
                <strong>
                  {spellSlot} Spell: {spellName}
                </strong>
              </div>
              <div>
                Subject: {spellData.subject} | Year: {spellData.year}
              </div>
              <div>
                DC: {dc} | Roll: ({diceValue}) {formatModifier(modifier)} ={" "}
                {totalRoll}
              </div>
            </div>
          );
        };

        return (
          <div style={{ ...styles.specialActivityBox }}>
            <div>
              <strong>
                📚 {isResearchActivity ? "Spell Research" : "Spell Attempt"}{" "}
                Activity
              </strong>
            </div>
            {renderSpellResult(
              spellSelections.first,
              "firstSpellDice",
              "First"
            )}
            {renderSpellResult(
              spellSelections.second,
              "secondSpellDice",
              "Second"
            )}
          </div>
        );
      },
      [
        styles.specialActivityBox,
        styles.warningBox,
        getSpellData,
        calculateResearchDC,
      ]
    );

    const renderStudyActivityReview = useCallback(
      (activity, assignment, character, dicePool) => {
        if (!activityRequiresClassSelection(activity.activity)) return null;

        const selectedClass = activity.selectedClass;

        if (
          assignment.diceIndex === null ||
          assignment.diceIndex === undefined
        ) {
          return (
            <div style={{ ...styles.specialActivityBox, ...styles.infoBox }}>
              <div>
                <strong>📚 Study Activity</strong>
              </div>
              <div>
                Selected Class: <strong>{selectedClass}</strong>
              </div>
              <div style={{ color: "#f59e0b" }}>⚠️ No die assigned</div>
            </div>
          );
        }

        const diceValue = dicePool[assignment.diceIndex];
        const skillName = assignment.skill;
        const modifier = skillName
          ? calculateModifierValue(skillName, character)
          : 0;
        const totalRoll = diceValue + modifier;

        return (
          <div style={{ ...styles.specialActivityBox, ...styles.infoBox }}>
            <div>
              <strong>📚 Study Activity</strong>
            </div>
            <div>
              Selected Class: <strong>{selectedClass}</strong>
            </div>
            {skillName && (
              <>
                <div>
                  Skill Used: {skillMap[skillName]} ({formatModifier(modifier)})
                </div>
                <div>
                  Roll: ({diceValue}) {formatModifier(modifier)} = {totalRoll}
                </div>
              </>
            )}
          </div>
        );
      },
      [styles.specialActivityBox, styles.infoBox, calculateModifierValue]
    );

    const inferSkillsFromActivity = useCallback((activityName) => {
      const activityLower = activityName.toLowerCase();

      if (activityLower.includes("restricted section")) {
        return { firstSkill: "stealth", secondSkill: "investigation" };
      }
      if (activityLower.includes("library research")) {
        return { firstSkill: "investigation", secondSkill: "history" };
      }
      if (
        activityLower.includes("sneak") &&
        activityLower.includes("persuade")
      ) {
        return { firstSkill: "stealth", secondSkill: "persuasion" };
      }

      return { firstSkill: "", secondSkill: "" };
    }, []);

    const renderAbilityScoreRollInfo = (
      activity,
      assignment,
      dicePool,
      character
    ) => {
      const diceValue = dicePool?.[assignment.diceIndex];

      if (diceValue === undefined || diceValue === null) {
        return (
          <div style={styles.rollContainer}>
            <div style={styles.rollLabel}>No dice assigned</div>
          </div>
        );
      }

      const abilityName = activity.selectedAbilityScore;
      const currentScore =
        character?.ability_scores?.[abilityName] ||
        character?.[abilityName] ||
        10;
      const modifier = Math.floor((currentScore - 10) / 2);
      const total = diceValue + modifier;
      const dc = currentScore;

      const isSuccess = total >= dc;
      const isNat20 = diceValue === 20;

      const abilities = [
        { name: "strength", displayName: "Strength" },
        { name: "dexterity", displayName: "Dexterity" },
        { name: "constitution", displayName: "Constitution" },
        { name: "intelligence", displayName: "Intelligence" },
        { name: "wisdom", displayName: "Wisdom" },
        { name: "charisma", displayName: "Charisma" },
      ];

      const selectedAbility = abilities.find((a) => a.name === abilityName);
      const abilityDisplayName =
        selectedAbility?.displayName ||
        abilityName?.charAt(0).toUpperCase() + abilityName?.slice(1) ||
        "Unknown";

      const formatModifier = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

      return (
        <div style={styles.rollContainer}>
          <div style={styles.rollLabel}>
            Ability Score Check: {abilityDisplayName}
          </div>
          <div style={styles.rollBreakdown}>
            <span style={styles.rollValue}>({diceValue})</span>
            <span style={styles.modifier}>{formatModifier(modifier)}</span>
            <span style={styles.equals}> = </span>
            <span style={styles.total}>{total}</span>
          </div>
          <div style={styles.skillUsed}>
            Using {abilityDisplayName} {formatModifier(modifier)} vs DC {dc}
          </div>
          <div
            style={{
              marginTop: "4px",
              fontSize: "12px",
              fontWeight: "600",
              color: isSuccess ? "#10b981" : "#ef4444",
            }}
          >
            {isNat20 ? "🎯 Natural 20! " : ""}
            {isSuccess ? "✅ SUCCESS" : "❌ FAILURE"}
            {isNat20 && " (Counts as 2 successes!)"}
          </div>
        </div>
      );
    };

    const renderRollInfo = useCallback(
      (assignment, dicePool, character, skillField, diceField, label) => {
        const skill = assignment[skillField];
        const diceValue = dicePool?.[assignment[diceField]];

        if (!skill || diceValue === undefined || diceValue === null) {
          return null;
        }

        const modifier = calculateModifierValue(skill, character);
        const total = diceValue + modifier;

        return (
          <div style={styles.rollContainer}>
            <div style={styles.rollLabel}>{label}</div>
            <div style={styles.rollBreakdown}>
              <span style={styles.rollValue}>({diceValue || 0})</span>
              <span style={styles.modifier}>{formatModifier(modifier)}</span>
              <span style={styles.equals}> = </span>
              <span style={styles.total}>{total}</span>
            </div>
            <div style={styles.skillUsed}>
              Using{" "}
              {allSkills.find((skillObj) => skillObj.name === skill)
                ?.displayName || skill}{" "}
              {formatModifier(modifier)}
            </div>
          </div>
        );
      },
      [calculateModifierValue, styles]
    );

    const loadDowntimeSheet = useCallback(async () => {
      if (!sheetId || !supabase) return;

      setLoading(true);
      setError(null);

      try {
        const { data: sheet, error } = await supabase
          .from("character_downtime")
          .select(
            `
          *,
          characters (
            id,
            name,
            game_session,
            house,
            level,
            ability_scores,
            skill_proficiencies,
            skill_expertise,
            magic_modifiers
          )
        `
          )
          .eq("id", sheetId)
          .single();

        if (error) throw error;
        setDowntimeSheet(sheet);
        setReviewStatus(sheet.review_status || "pending");
        setAdminFeedback(sheet.admin_feedback || "");
        setAdminNotes(sheet.admin_notes || "");
        const activityReviewsInit = {};
        if (sheet.activities) {
          sheet.activities.forEach((activity, index) => {
            activityReviewsInit[index] = {
              status: activity.admin_status || "pending",
              notes: activity.admin_notes || "",
              rewards: activity.admin_rewards || "",
            };
          });
        }
        setActivityReviews(activityReviewsInit);

        const relationshipReviewsInit = {};
        if (sheet.roll_assignments) {
          ["relationship1", "relationship2", "relationship3"].forEach((key) => {
            if (sheet.roll_assignments[key]) {
              relationshipReviewsInit[key] = {
                result: sheet.roll_assignments[key].result || "pending",
                adminNotes: sheet.roll_assignments[key].adminNotes || "",
              };
            }
          });
        }
        setRelationshipReviews(relationshipReviewsInit);
      } catch (err) {
        console.error("Error loading downtime sheet:", err);
        setError("Failed to load downtime sheet for review");
      } finally {
        setLoading(false);
      }
    }, [sheetId, supabase]);

    useEffect(() => {
      loadDowntimeSheet();
    }, [loadDowntimeSheet]);

    const updateActivityReview = useCallback((activityIndex, field, value) => {
      setActivityReviews((prev) => ({
        ...prev,
        [activityIndex]: {
          ...prev[activityIndex],
          [field]: value,
        },
      }));
    }, []);

    const updateRelationshipReview = useCallback(
      (relationshipKey, field, value) => {
        setRelationshipReviews((prev) => ({
          ...prev,
          [relationshipKey]: {
            ...prev[relationshipKey],
            [field]: value,
          },
        }));
      },
      []
    );

    const saveReview = useCallback(async () => {
      if (!downtimeSheet || !supabase) return;

      setSaving(true);
      try {
        const updatedActivities =
          downtimeSheet.activities?.map((activity, index) => ({
            ...activity,
            admin_status: activityReviews[index]?.status || "pending",
            admin_notes: activityReviews[index]?.notes || "",
            result: activityReviews[index]?.status || "pending",
            admin_rewards: activityReviews[index]?.rewards || "",
          })) || [];

        const updatedRollAssignments = { ...downtimeSheet.roll_assignments };
        Object.keys(relationshipReviews).forEach((key) => {
          if (updatedRollAssignments[key]) {
            updatedRollAssignments[key] = {
              ...updatedRollAssignments[key],
              result: relationshipReviews[key]?.result || "pending",
              adminNotes: relationshipReviews[key]?.adminNotes || "",
            };
          }
        });

        const updateData = {
          review_status: reviewStatus,
          admin_feedback: adminFeedback,
          admin_notes: adminNotes,
          activities: updatedActivities,
          roll_assignments: updatedRollAssignments,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("character_downtime")
          .update(updateData)
          .eq("id", sheetId);

        if (error) throw error;

        alert("Review saved successfully!");
        if (onReviewComplete) onReviewComplete();
      } catch (err) {
        console.error("Error saving review:", err);
        alert("Failed to save review. Please try again.");
      } finally {
        setSaving(false);
      }
    }, [
      downtimeSheet,
      supabase,
      sheetId,
      reviewStatus,
      adminFeedback,
      adminNotes,
      activityReviews,
      relationshipReviews,
      onReviewComplete,
    ]);

    const renderedActivities = useMemo(() => {
      if (!downtimeSheet?.activities) return null;

      return downtimeSheet.activities.map((activity, index) => {
        const activityAssignment =
          downtimeSheet.roll_assignments?.[`activity${index + 1}`];

        if (!activityAssignment) {
          return (
            <div key={index} style={styles.activity}>
              <div style={styles.activityHeader}>
                <div style={styles.activityTitle}>
                  Activity {index + 1}: {activity.activity}
                </div>
              </div>
              <div style={styles.activityDetails}>
                No dice assignment found for this activity.
              </div>

              <div style={styles.reviewSection}>
                <select
                  value={activityReviews[index]?.status || "pending"}
                  onChange={(e) =>
                    updateActivityReview(index, "status", e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="pending">Pending Review</option>
                  <option value="success">Success</option>
                  <option value="partial">Partial Success</option>
                  <option value="failure">Failure</option>
                </select>

                <textarea
                  placeholder="Activity outcome notes..."
                  value={activityReviews[index]?.notes || ""}
                  onChange={(e) =>
                    updateActivityReview(index, "notes", e.target.value)
                  }
                  style={styles.textarea}
                />

                <textarea
                  placeholder="Rewards/Consequences (XP, items, story effects)..."
                  value={activityReviews[index]?.rewards || ""}
                  onChange={(e) =>
                    updateActivityReview(index, "rewards", e.target.value)
                  }
                  style={styles.textarea}
                />
              </div>
            </div>
          );
        }

        const isDualCheck = activityRequiresDualChecks(activity.activity);
        const character = downtimeSheet.characters;

        if (activityAssignment.customDice) {
          const diceSum =
            activityAssignment.customDice[0] + activityAssignment.customDice[1];
          const jobTypeLabel =
            {
              easy: "2D8",
              medium: "2D10",
              hard: "2D12",
            }[activityAssignment.jobType] || "2D10";

          return (
            <div key={index} style={styles.activity}>
              <div style={styles.activityHeader}>
                <div style={styles.activityTitle}>
                  Activity {index + 1}: {activity.activity}
                </div>
                {activity.npc && (
                  <div style={styles.activityDetails}>NPC: {activity.npc}</div>
                )}
              </div>

              <div style={styles.rollResultSection}>
                <div style={styles.rollResultHeader}>
                  <strong>Custom Dice Roll Result:</strong>
                </div>
                <div style={styles.rollBreakdown}>
                  <span style={styles.rollValue}>
                    {jobTypeLabel}: {activityAssignment.customDice[0]} +{" "}
                    {activityAssignment.customDice[1]}
                  </span>
                  <span style={styles.equals}> = </span>
                  <span style={styles.total}>{diceSum}</span>
                </div>
                {activityAssignment.jobType && (
                  <div style={styles.skillUsed}>
                    Earnings: {diceSum} × 2 = {diceSum * 2} Galleons
                  </div>
                )}
              </div>

              <div style={styles.reviewSection}>
                <select
                  value={activityReviews[index]?.status || "pending"}
                  onChange={(e) =>
                    updateActivityReview(index, "status", e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="pending">Pending Review</option>
                  <option value="success">Success</option>
                  <option value="partial">Partial Success</option>
                  <option value="failure">Failure</option>
                </select>

                <textarea
                  placeholder="Activity outcome notes..."
                  value={activityReviews[index]?.notes || ""}
                  onChange={(e) =>
                    updateActivityReview(index, "notes", e.target.value)
                  }
                  style={styles.textarea}
                />

                <textarea
                  placeholder="Rewards/Consequences..."
                  value={activityReviews[index]?.rewards || ""}
                  onChange={(e) =>
                    updateActivityReview(index, "rewards", e.target.value)
                  }
                  style={styles.textarea}
                />
              </div>
            </div>
          );
        }

        return (
          <div key={index} style={styles.activity}>
            <div style={styles.activityHeader}>
              <div style={styles.activityTitle}>
                Activity {index + 1}: {activity.activity}
              </div>
              {activity.npc && (
                <div style={styles.activityDetails}>NPC: {activity.npc}</div>
              )}
            </div>

            {isDualCheck && (
              <div style={styles.dualCheckNotice}>
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "4px",
                    color: theme.info || "#3b82f6",
                  }}
                >
                  📋 Dual Check Activity
                </div>
                <div>
                  This activity required{" "}
                  <strong>two separate dice rolls</strong>.
                </div>
              </div>
            )}

            {renderWandIncreaseReview(
              activity,
              activityAssignment,
              character,
              downtimeSheet.dice_pool
            )}
            {renderAbilityScoreIncreaseReview(
              activity,
              activityAssignment,
              character,
              downtimeSheet.dice_pool
            )}
            {renderSpellActivityReview(
              activity,
              activityAssignment,
              character,
              downtimeSheet.dice_pool,
              downtimeSheet.selected_spells,
              index
            )}
            {renderStudyActivityReview(
              activity,
              activityAssignment,
              character,
              downtimeSheet.dice_pool
            )}

            {!activityRequiresWandSelection(activity.activity) &&
              !activityRequiresSpellSelection(activity.activity) &&
              !activityRequiresClassSelection(activity.activity) && (
                <>
                  {isDualCheck ? (
                    <div style={styles.rollResultSection}>
                      <div style={styles.rollResultHeader}>
                        <strong>Dual Check Results:</strong>
                      </div>
                      <div style={styles.dualRollContainer}>
                        {(() => {
                          const firstSkill =
                            activityAssignment.skill ||
                            inferSkillsFromActivity(activity.activity)
                              .firstSkill;
                          const secondSkill =
                            activityAssignment.secondSkill ||
                            inferSkillsFromActivity(activity.activity)
                              .secondSkill;

                          const firstDice =
                            downtimeSheet.dice_pool?.[
                              activityAssignment.diceIndex
                            ];
                          const secondDice =
                            downtimeSheet.dice_pool?.[
                              activityAssignment.secondDiceIndex
                            ];

                          const firstModifier = firstSkill
                            ? calculateModifierValue(firstSkill, character)
                            : 0;
                          const secondModifier = secondSkill
                            ? calculateModifierValue(secondSkill, character)
                            : 0;

                          return (
                            <>
                              <div style={styles.rollContainer}>
                                <div style={styles.rollLabel}>
                                  <strong>
                                    First Roll:{" "}
                                    {allSkills.find(
                                      (skillObj) => skillObj.name === firstSkill
                                    )?.displayName ||
                                      firstSkill ||
                                      "Unknown Skill"}
                                  </strong>
                                </div>
                                {firstDice !== undefined &&
                                firstDice !== null ? (
                                  <>
                                    <div style={styles.rollBreakdown}>
                                      <span style={styles.rollValue}>
                                        d20({firstDice})
                                      </span>
                                      <span style={styles.modifier}>
                                        {" "}
                                        {formatModifier(firstModifier)}
                                      </span>
                                      <span style={styles.equals}> = </span>
                                      <span style={styles.total}>
                                        {firstDice + firstModifier}
                                      </span>
                                    </div>
                                    <div style={styles.skillUsed}>
                                      Using{" "}
                                      {allSkills.find(
                                        (skillObj) =>
                                          skillObj.name === firstSkill
                                      )?.displayName || firstSkill}{" "}
                                      {formatModifier(firstModifier)}
                                    </div>
                                  </>
                                ) : (
                                  <div style={{ color: "#f59e0b" }}>
                                    ⚠️ No die assigned
                                  </div>
                                )}
                              </div>

                              <div style={styles.rollContainer}>
                                <div style={styles.rollLabel}>
                                  <strong>
                                    Second Roll:{" "}
                                    {allSkills.find(
                                      (skillObj) =>
                                        skillObj.name === secondSkill
                                    )?.displayName ||
                                      secondSkill ||
                                      "Unknown Skill"}
                                  </strong>
                                </div>
                                {secondDice !== undefined &&
                                secondDice !== null ? (
                                  <>
                                    <div style={styles.rollBreakdown}>
                                      <span style={styles.rollValue}>
                                        d20({secondDice})
                                      </span>
                                      <span style={styles.modifier}>
                                        {" "}
                                        {formatModifier(secondModifier)}
                                      </span>
                                      <span style={styles.equals}> = </span>
                                      <span style={styles.total}>
                                        {secondDice + secondModifier}
                                      </span>
                                    </div>
                                    <div style={styles.skillUsed}>
                                      Using{" "}
                                      {allSkills.find(
                                        (skillObj) =>
                                          skillObj.name === secondSkill
                                      )?.displayName || secondSkill}{" "}
                                      {formatModifier(secondModifier)}
                                    </div>
                                  </>
                                ) : (
                                  <div style={{ color: "#f59e0b" }}>
                                    ⚠️ No die assigned
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    (activityAssignment.skill ||
                      activityRequiresAbilitySelection(activity.activity)) && (
                      <div style={styles.rollResultSection}>
                        <div style={styles.rollResultHeader}>
                          <strong>Roll Result:</strong>
                        </div>
                        {activityRequiresAbilitySelection(activity.activity)
                          ? renderAbilityScoreRollInfo(
                              activity,
                              activityAssignment,
                              downtimeSheet.dice_pool,
                              character
                            )
                          : renderRollInfo(
                              activityAssignment,
                              downtimeSheet.dice_pool,
                              character,
                              "skill",
                              "diceIndex",
                              "Roll"
                            )}
                      </div>
                    )
                  )}
                </>
              )}

            {activityAssignment.notes && (
              <div style={styles.playerNotes}>
                <div style={styles.label}>Player Notes:</div>
                <div style={styles.notesContent}>
                  {activityAssignment.notes}
                </div>
              </div>
            )}

            <div style={styles.reviewSection}>
              <select
                value={activityReviews[index]?.status || "pending"}
                onChange={(e) =>
                  updateActivityReview(index, "status", e.target.value)
                }
                style={styles.select}
              >
                <option value="pending">Pending Review</option>
                <option value="success">Success</option>
                <option value="partial">Partial Success</option>
                <option value="failure">Failure</option>
              </select>

              <textarea
                placeholder="Activity outcome notes..."
                value={activityReviews[index]?.notes || ""}
                onChange={(e) =>
                  updateActivityReview(index, "notes", e.target.value)
                }
                style={styles.textarea}
              />

              <textarea
                placeholder="Rewards/Consequences (XP, items, story effects)..."
                value={activityReviews[index]?.rewards || ""}
                onChange={(e) =>
                  updateActivityReview(index, "rewards", e.target.value)
                }
                style={styles.textarea}
              />
            </div>
          </div>
        );
      });
    }, [
      downtimeSheet,
      activityReviews,
      styles,
      updateActivityReview,
      renderRollInfo,
      renderWandIncreaseReview,
      renderSpellActivityReview,
      renderStudyActivityReview,
      calculateModifierValue,
      inferSkillsFromActivity,
      theme,
    ]);

    const renderedRelationships = useMemo(() => {
      if (!downtimeSheet?.relationships) return null;

      const relationships = ["relationship1", "relationship2", "relationship3"]
        .map((key, index) => {
          const rollAssignment = downtimeSheet.roll_assignments?.[key] || {};
          const relationship = downtimeSheet.relationships[index] || {};

          const assignment = {
            ...rollAssignment,
            ...relationship,
          };

          if (
            !assignment ||
            !assignment.npcName ||
            assignment.npcName.trim() === ""
          ) {
            return null;
          }

          const character = downtimeSheet.characters;

          return (
            <div key={key} style={styles.activity}>
              <div style={styles.relationshipHeader}>
                {assignment.npcName && <h4>NPC: {assignment.npcName}</h4>}
              </div>

              {assignment.diceIndex !== null &&
                assignment.diceIndex !== undefined && (
                  <>
                    {renderRollInfo(
                      assignment,
                      downtimeSheet.dice_pool,
                      character,
                      "skill",
                      "diceIndex",
                      "Roll Result"
                    )}
                  </>
                )}

              {(assignment.diceIndex === null ||
                assignment.diceIndex === undefined) && (
                <div style={styles.playerNotes}>
                  <div style={styles.label}>Status:</div>
                  <div
                    style={{
                      color: theme.textSecondary,
                      fontStyle: "italic",
                      fontSize: "14px",
                    }}
                  >
                    No dice assigned for this relationship interaction
                  </div>
                </div>
              )}

              {assignment.notes && (
                <div style={styles.playerNotes}>
                  <div style={styles.label}>Player Notes:</div>
                  <div style={styles.notesContent}>{assignment.notes}</div>
                </div>
              )}

              <div style={styles.reviewSection}>
                <select
                  value={relationshipReviews[key]?.result || "pending"}
                  onChange={(e) =>
                    updateRelationshipReview(key, "result", e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="pending">Pending Review</option>
                  <option value="success">Success</option>
                  <option value="partial">Partial Success</option>
                  <option value="failure">Failure</option>
                </select>

                <textarea
                  placeholder="Admin notes for this relationship interaction..."
                  value={relationshipReviews[key]?.adminNotes || ""}
                  onChange={(e) =>
                    updateRelationshipReview(key, "adminNotes", e.target.value)
                  }
                  style={styles.textarea}
                />
              </div>
            </div>
          );
        })
        .filter(Boolean);

      return relationships.length > 0 ? (
        relationships
      ) : (
        <div>No relationship interactions submitted.</div>
      );
    }, [
      downtimeSheet,
      relationshipReviews,
      styles,
      updateRelationshipReview,
      renderRollInfo,
    ]);

    if (loading) {
      return (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.loadingSpinner}>
              <div>Loading downtime sheet for review...</div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.errorMessage}>
              <AlertCircle size={20} style={{ marginRight: "8px" }} />
              {error}
            </div>
            <button onClick={onClose} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      );
    }

    if (loading || !downtimeSheet) {
      return (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.content}>
              <div>Loading downtime sheet...</div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.header}>
            <h2 style={styles.title}>
              <Scroll size={24} />
              Downtime Review -
              {downtimeSheet.characters?.name || downtimeSheet.character_name}
            </h2>
            <button onClick={onClose} style={styles.closeButton}>
              ✕
            </button>
          </div>

          <div style={styles.content}>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                <User size={18} />
                Character Information
              </h3>
              <div style={styles.characterInfo}>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Character</span>
                  <span style={styles.value}>
                    {downtimeSheet.characters?.name ||
                      downtimeSheet.character_name}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Game Session</span>
                  <span style={styles.value}>
                    {downtimeSheet.characters?.game_session || "Unknown"}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>House</span>
                  <span style={styles.value}>
                    {downtimeSheet.characters?.house || "Unknown"}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.value}>
                    Year {downtimeSheet.year} - Semester{" "}
                    {downtimeSheet.semester}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Submitted</span>
                  <span style={styles.value}>
                    {downtimeSheet.submitted_at
                      ? new Date(
                          downtimeSheet.submitted_at
                        ).toLocaleDateString()
                      : "Not submitted"}
                  </span>
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.label}>Magic School Advancement</span>
                  <span style={styles.value}>
                    {downtimeSheet.selected_magic_school ? (
                      <>
                        {downtimeSheet.selected_magic_school ===
                        "jinxesHexesCurses"
                          ? "Jinxes, Hexes, and Curses"
                          : downtimeSheet.selected_magic_school
                              .charAt(0)
                              .toUpperCase() +
                            downtimeSheet.selected_magic_school.slice(1)}{" "}
                        <span
                          style={{ color: theme.success, fontWeight: "bold" }}
                        >
                          (+1)
                        </span>
                      </>
                    ) : (
                      <span
                        style={{
                          color: theme.textSecondary,
                          fontStyle: "italic",
                        }}
                      >
                        None selected
                      </span>
                    )}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Current Status</span>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(reviewStatus === "success"
                        ? styles.successBadge
                        : reviewStatus === "failure"
                        ? styles.failureBadge
                        : styles.pendingBadge),
                    }}
                  >
                    {reviewStatus === "success"
                      ? "Approved"
                      : reviewStatus === "failure"
                      ? "Rejected"
                      : "Pending"}
                  </span>
                </div>
              </div>
            </div>
            {downtimeSheet.dice_pool && downtimeSheet.dice_pool.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>🎲 Dice Pool Reference</h3>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {downtimeSheet.dice_pool.map((dice, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "0.75rem 1rem",
                        backgroundColor: theme.primary + "20",
                        border: `2px solid ${theme.primary}`,
                        borderRadius: "8px",
                        fontWeight: "700",
                        fontSize: "1rem",
                        color: theme.primary,
                        minWidth: "50px",
                        textAlign: "center",
                        fontFamily: "monospace",
                      }}
                    >
                      {dice}
                    </div>
                  ))}
                  <div
                    style={{
                      marginLeft: "1rem",
                      fontSize: "0.875rem",
                      color: theme.textSecondary,
                      fontStyle: "italic",
                    }}
                  >
                    Total: {downtimeSheet.dice_pool.length} dice
                  </div>
                </div>
              </div>
            )}
            <div style={styles.mainGrid}>
              <div style={styles.leftPanel}>
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    <Calendar size={18} />
                    Activities
                  </h3>
                  <div>
                    {renderedActivities || <div>No activities submitted.</div>}
                  </div>
                </div>
              </div>

              <div style={styles.rightPanel}>
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    <User size={18} />
                    NPC Relationships
                  </h3>
                  <div>{renderedRelationships}</div>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                <Eye size={18} />
                Overall Review Status
              </h3>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    ...styles.label,
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Select Review Outcome:
                </label>
                <div style={styles.reviewButtons}>
                  <div
                    onClick={() => setReviewStatus("success")}
                    style={reviewButtonStyles.successOption}
                  >
                    <Check size={14} />
                    Approve
                  </div>
                  <div
                    onClick={() => setReviewStatus("failure")}
                    style={reviewButtonStyles.failureOption}
                  >
                    <X size={14} />
                    Reject
                  </div>
                  <div
                    onClick={() => setReviewStatus("pending")}
                    style={reviewButtonStyles.pendingOption}
                  >
                    <AlertCircle size={14} />
                    Pending
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <span style={styles.label}>Current Status:</span>
                <span
                  style={{
                    ...styles.statusBadge,
                    ...(reviewStatus === "success"
                      ? styles.successBadge
                      : reviewStatus === "failure"
                      ? styles.failureBadge
                      : styles.pendingBadge),
                    marginLeft: "8px",
                  }}
                >
                  {reviewStatus === "success"
                    ? "Approved"
                    : reviewStatus === "failure"
                    ? "Rejected"
                    : "Pending"}
                </span>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={styles.label}>
                  Admin Feedback (visible to player):
                </label>
                <textarea
                  value={adminFeedback}
                  onChange={(e) => setAdminFeedback(e.target.value)}
                  placeholder="Provide feedback to the player about their downtime submission..."
                  style={{ ...styles.textarea, minHeight: "100px" }}
                />
              </div>

              <button
                onClick={saveReview}
                disabled={saving}
                style={styles.saveButton}
              >
                <Save size={16} />
                {saving ? "Saving Review..." : "Save Review"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default AdminDowntimeReviewForm;
