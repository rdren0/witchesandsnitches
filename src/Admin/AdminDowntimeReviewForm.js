import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  calculateModifier,
  activityRequiresDualChecks,
} from "../Components/Downtime/downtimeHelpers";
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
import { allSkills } from "../Components/SharedData/data";

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
        // New styles for dual roll display
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

    const formatModifier = useCallback((modifier) => {
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    }, []);

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
      [calculateModifierValue, formatModifier, styles]
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
              </div>
            </div>
          );
        }

        const isDualCheck = activityRequiresDualChecks(activity.activity);

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
              </div>
            </div>
          );
        }

        const character = downtimeSheet.characters;

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

            {isDualCheck ? (
              <div style={styles.dualRollContainer}>
                {renderRollInfo(
                  activityAssignment,
                  downtimeSheet.dice_pool,
                  character,
                  "skill",
                  "diceIndex",
                  "First Roll"
                )}
                {renderRollInfo(
                  activityAssignment,
                  downtimeSheet.dice_pool,
                  character,
                  "secondSkill",
                  "secondDiceIndex",
                  "Second Roll"
                )}
              </div>
            ) : (
              activityAssignment.skill && (
                <div style={styles.rollResultSection}>
                  <div style={styles.rollResultHeader}>
                    <strong>Roll Result:</strong>
                  </div>
                  {renderRollInfo(
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
      theme,
    ]);

    const renderedRelationships = useMemo(() => {
      if (!downtimeSheet?.roll_assignments) return null;

      const relationships = ["relationship1", "relationship2", "relationship3"]
        .map((key, index) => {
          const assignment = {
            ...downtimeSheet.roll_assignments[key],
            ...downtimeSheet.relationships[index],
          };
          if (!assignment || assignment.diceIndex === null) return null;

          const character = downtimeSheet.characters;

          return (
            <div key={key} style={styles.activity}>
              <div style={styles.relationshipHeader}>
                {assignment.npcName && <h4>NPC: {assignment.npcName}</h4>}
              </div>

              {renderRollInfo(
                assignment,
                downtimeSheet.dice_pool,
                character,
                "skill",
                "diceIndex",
                "Roll Result"
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

    if (!downtimeSheet) {
      return null;
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
