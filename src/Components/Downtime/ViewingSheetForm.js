import React, { useMemo } from "react";
import { ArrowLeft, CheckCircle, XCircle, Edit } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { allSkills } from "../SharedData/data";
import { calculateModifier } from "./downtimeHelpers";

const ViewingSheetForm = ({
  viewingSheet,
  selectedCharacter,
  isUserAdmin,
  adminMode,
  onBack,
  onUpdateAssignment,
  supabase,
  user,
}) => {
  const { theme } = useTheme();

  const styles = useMemo(
    () => ({
      container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "1.5rem",
        backgroundColor: theme.background,
      },
      header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
        padding: "1.5rem",
        backgroundColor: theme.surface,
        borderRadius: "12px",
        border: `1px solid ${theme.border}`,
      },
      backButton: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem 1rem",
        backgroundColor: theme.primary,
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
      },
      section: {
        marginBottom: "2rem",
        padding: "1.5rem",
        backgroundColor: theme.surface,
        borderRadius: "12px",
        border: `1px solid ${theme.border}`,
      },
      sectionTitle: {
        fontSize: "1.5rem",
        fontWeight: "600",
        color: theme.text,
        marginBottom: "1rem",
        borderBottom: `2px solid ${theme.primary}`,
        paddingBottom: "0.5rem",
      },
      card: {
        padding: "1.5rem",
        marginBottom: "1rem",
        backgroundColor: theme.background,
        borderRadius: "8px",
        border: `1px solid ${theme.border}`,
      },
      cardTitle: {
        fontSize: "1.125rem",
        fontWeight: "600",
        color: theme.text,
        marginBottom: "1rem",
      },
      label: {
        fontSize: "0.875rem",
        fontWeight: "600",
        color: theme.textSecondary,
        marginBottom: "0.25rem",
      },
      value: {
        fontSize: "1rem",
        color: theme.text,
        marginBottom: "0.75rem",
      },
      rollInfo: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.75rem",
        backgroundColor: theme.primary + "10",
        border: `1px solid ${theme.primary + "30"}`,
        borderRadius: "6px",
        marginBottom: "1rem",
      },
      diceValue: {
        fontSize: "1.25rem",
        fontWeight: "bold",
        color: theme.primary,
      },

      adminSection: {
        marginTop: "1.5rem",
        padding: "1rem",
        backgroundColor: theme.warning + "10",
        border: `1px solid ${theme.warning}`,
        borderRadius: "6px",
      },
      resultButton: {
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "0.875rem",
        marginRight: "0.5rem",
      },
      successButton: {
        backgroundColor: theme.success,
        color: "white",
      },
      failureButton: {
        backgroundColor: theme.error,
        color: "white",
      },
      pendingButton: {
        backgroundColor: theme.border,
        color: theme.textSecondary,
      },
      resultIndicator: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        fontWeight: "600",
        marginBottom: "1rem",
      },
      successIndicator: {
        backgroundColor: theme.success + "20",
        color: theme.success,
        border: `1px solid ${theme.success}`,
      },
      failureIndicator: {
        backgroundColor: theme.error + "20",
        color: theme.error,
        border: `1px solid ${theme.error}`,
      },
      textarea: {
        width: "100%",
        padding: "0.75rem",
        borderRadius: "6px",
        border: `1px solid ${theme.border}`,
        backgroundColor: theme.surface,
        color: theme.text,
        fontSize: "0.875rem",
        resize: "vertical",
        minHeight: "80px",
        marginTop: "0.5rem",
      },
      infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "1.5rem",
      },
    }),
    [theme]
  );

  const getSkillDisplayName = (skillName) => {
    const skill = allSkills.find((s) => s.name === skillName);
    return skill?.displayName || skillName;
  };

  const getModifierValue = (skillName) => {
    if (!skillName || !selectedCharacter) return 0;
    return calculateModifier(skillName, selectedCharacter);
  };

  const formatModifier = (value) => {
    if (value === 0) return "+0";
    return value > 0 ? `+${value}` : `${value}`;
  };

  const updateAssignmentResult = async (assignmentKey, field, value) => {
    if (!isUserAdmin || !adminMode) return;

    try {
      const updatedAssignments = {
        ...viewingSheet.roll_assignments,
        [assignmentKey]: {
          ...viewingSheet.roll_assignments[assignmentKey],
          [field]: value,
        },
      };

      const { error } = await supabase
        .from("character_downtime")
        .update({
          roll_assignments: updatedAssignments,
          updated_at: new Date().toISOString(),
        })
        .eq("id", viewingSheet.id);

      if (error) throw error;

      if (onUpdateAssignment) {
        onUpdateAssignment(assignmentKey, field, value);
      }
    } catch (err) {
      console.error("Error updating assignment:", err);
      alert("Failed to update result. Please try again.");
    }
  };

  const renderAdminControls = (assignmentKey, assignment) => {
    if (!isUserAdmin || !adminMode) {
      if (assignment.result) {
        return (
          <div style={styles.adminSection}>
            <div
              style={
                assignment.result === "success"
                  ? styles.successIndicator
                  : styles.failureIndicator
              }
            >
              {assignment.result === "success" ? (
                <>
                  <CheckCircle size={16} />
                  Success
                </>
              ) : (
                <>
                  <XCircle size={16} />
                  Failure
                </>
              )}
            </div>
            {assignment.adminNotes && (
              <div>
                <div style={styles.label}>Admin Notes:</div>
                <div style={styles.value}>{assignment.adminNotes}</div>
              </div>
            )}
          </div>
        );
      }
      return null;
    }

    return (
      <div style={styles.adminSection}>
        <div style={styles.label}>Admin Controls</div>

        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={() =>
              updateAssignmentResult(assignmentKey, "result", "success")
            }
            style={{
              ...styles.resultButton,
              ...styles.successButton,
              opacity: assignment.result === "success" ? 1 : 0.7,
            }}
          >
            <CheckCircle size={14} style={{ marginRight: "4px" }} />
            Success
          </button>
          <button
            onClick={() =>
              updateAssignmentResult(assignmentKey, "result", "failure")
            }
            style={{
              ...styles.resultButton,
              ...styles.failureButton,
              opacity: assignment.result === "failure" ? 1 : 0.7,
            }}
          >
            <XCircle size={14} style={{ marginRight: "4px" }} />
            Failure
          </button>
          <button
            onClick={() =>
              updateAssignmentResult(assignmentKey, "result", null)
            }
            style={{
              ...styles.resultButton,
              ...styles.pendingButton,
              opacity: !assignment.result ? 1 : 0.7,
            }}
          >
            Pending
          </button>
        </div>

        <div>
          <div style={styles.label}>Admin Notes:</div>
          <textarea
            style={styles.textarea}
            value={assignment.adminNotes || ""}
            onChange={(e) =>
              updateAssignmentResult(
                assignmentKey,
                "adminNotes",
                e.target.value
              )
            }
            placeholder="Add notes about the result..."
          />
        </div>
      </div>
    );
  };

  if (!viewingSheet) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={{ color: theme.text, margin: 0, marginBottom: "0.5rem" }}>
            {viewingSheet.character_name}
          </h2>
          <p style={{ color: theme.textSecondary, margin: 0 }}>
            Year {viewingSheet.year}, Semester {viewingSheet.semester} •
            Submitted:{" "}
            {new Date(
              viewingSheet.submitted_at || viewingSheet.updated_at
            ).toLocaleDateString()}
          </p>
        </div>
        <button onClick={onBack} style={styles.backButton}>
          <ArrowLeft size={16} />
          Back to List
        </button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📋 Character Information</h3>
        <div style={styles.infoGrid}>
          <div>
            <div style={styles.label}>Character Name</div>
            <div style={styles.value}>{viewingSheet.character_name}</div>
          </div>
          <div>
            <div style={styles.label}>Academic Period</div>
            <div style={styles.value}>
              Year {viewingSheet.year}, Semester {viewingSheet.semester}
            </div>
          </div>
          <div>
            <div style={styles.label}>Status</div>
            <div style={styles.value}>
              {viewingSheet.is_draft ? "📝 Draft" : "✅ Submitted"}
            </div>
          </div>
          {viewingSheet.selected_magic_school && (
            <div>
              <div style={styles.label}>Magic School Focus</div>
              <div style={styles.value}>
                {viewingSheet.selected_magic_school}
              </div>
            </div>
          )}
        </div>
      </div>
      {viewingSheet.dice_pool && viewingSheet.dice_pool.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🎲 Dice Pool Reference</h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {viewingSheet.dice_pool.map((dice, index) => (
              <div
                key={index}
                style={{
                  padding: "0.5rem",
                  backgroundColor: theme.primary + "20",
                  border: `1px solid ${theme.primary}`,
                  borderRadius: "4px",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  color: theme.primary,
                }}
              >
                {dice}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>⚡ Downtime Activities</h3>

        {viewingSheet.activities && viewingSheet.activities.length > 0 ? (
          viewingSheet.activities.map((activity, index) => {
            if (!activity.activity) return null;

            const assignmentKey = `activity${index + 1}`;
            const assignment =
              viewingSheet.roll_assignments?.[assignmentKey] || {};
            const diceValue = viewingSheet.dice_pool?.[assignment.diceIndex];
            const modifier = assignment.skill
              ? getModifierValue(assignment.skill)
              : 0;
            const total = diceValue ? diceValue + modifier : null;

            return (
              <div key={index} style={styles.card}>
                <div style={styles.cardTitle}>Activity {index + 1}</div>

                <div>
                  <div style={styles.label}>Selected Activity:</div>
                  <div style={styles.value}>{activity.activity}</div>
                </div>

                {assignment.skill && (
                  <div>
                    <div style={styles.label}>Skill Used:</div>
                    <div style={styles.value}>
                      {getSkillDisplayName(assignment.skill)} (
                      {formatModifier(modifier)})
                    </div>
                  </div>
                )}

                {diceValue && assignment.skill && (
                  <div style={styles.rollInfo}>
                    <div style={styles.diceValue}>
                      Roll: {diceValue} {formatModifier(modifier)} = {total}
                    </div>
                  </div>
                )}

                {assignment.notes && (
                  <div>
                    <div style={styles.label}>Player Notes:</div>
                    <div style={styles.value}>{assignment.notes}</div>
                  </div>
                )}
                {console.log({ assignmentKey })}
                {renderAdminControls(assignmentKey, assignment)}
              </div>
            );
          })
        ) : (
          <div style={styles.value}>No activities recorded.</div>
        )}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🤝 NPC Relationships</h3>

        {viewingSheet.relationships && viewingSheet.relationships.length > 0 ? (
          viewingSheet.relationships.map((relationship, index) => {
            if (!relationship.npcName) return null;

            const assignmentKey = `relationship${index + 1}`;
            const assignment =
              viewingSheet.roll_assignments?.[assignmentKey] || {};
            const diceValue = viewingSheet.dice_pool?.[assignment.diceIndex];
            const modifier = assignment.skill
              ? getModifierValue(assignment.skill)
              : 0;
            const total = diceValue ? diceValue + modifier : null;

            return (
              <div key={index} style={styles.card}>
                <div style={styles.cardTitle}>Relationship {index + 1}</div>

                <div>
                  <div style={styles.label}>NPC Name:</div>
                  <div style={styles.value}>{relationship.npcName}</div>
                </div>

                {assignment.skill && (
                  <div>
                    <div style={styles.label}>Skill Used:</div>
                    <div style={styles.value}>
                      {getSkillDisplayName(assignment.skill)} (
                      {formatModifier(modifier)})
                    </div>
                  </div>
                )}

                {diceValue && assignment.skill && (
                  <div style={styles.rollInfo}>
                    <div style={styles.diceValue}>
                      Roll: {diceValue} {formatModifier(modifier)} = {total}
                    </div>
                  </div>
                )}

                {relationship.notes && (
                  <div>
                    <div style={styles.label}>Player Notes:</div>
                    <div style={styles.value}>{relationship.notes}</div>
                  </div>
                )}
                {console.log("testing")}
                {renderAdminControls(assignmentKey, assignment)}
              </div>
            );
          })
        ) : (
          <div style={styles.value}>No NPC relationships recorded.</div>
        )}
      </div>
    </div>
  );
};

export default ViewingSheetForm;
