import { useMemo } from "react";
import { ArrowLeft, CheckCircle, CircleAlert, XCircle } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { allSkills } from "../SharedData/data";
import {
  calculateModifier,
  activityRequiresDualChecks,
} from "./downtimeHelpers";

const ViewingSheetForm = ({
  viewingSheet,
  selectedCharacter,
  isUserAdmin,
  adminMode,
  onBack,
  onEditRejected,
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
      partialButton: {
        backgroundColor: "#f59e0b",
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
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        fontWeight: "600",
        marginBottom: "1rem",
      },
      partialIndicator: {
        backgroundColor: "#f59e0b20",
        color: "#f59e0b",
        border: "1px solid #f59e0b",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        fontWeight: "600",
        marginBottom: "1rem",
      },
      failureIndicator: {
        backgroundColor: theme.error + "20",
        color: theme.error,
        border: `1px solid ${theme.error}`,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        fontWeight: "600",
        marginBottom: "1rem",
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
      reviewStatusBadge: {
        padding: "8px 12px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "600",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "1rem",
      },
      adminFeedbackSection: {
        backgroundColor: theme.primary + "10",
        border: `2px solid ${theme.primary + "30"}`,
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "1.5rem",
      },
      adminFeedbackTitle: {
        fontSize: "16px",
        fontWeight: "600",
        color: theme.primary,
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
      adminFeedbackText: {
        fontSize: "14px",
        lineHeight: "1.6",
        color: theme.text,
        whiteSpace: "pre-wrap",
      },
      // New styles for dual roll display
      dualRollContainer: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginBottom: "1rem",
      },
      rollContainer: {
        padding: "0.75rem",
        backgroundColor: theme.surface + "40",
        border: `1px solid ${theme.border}`,
        borderRadius: "6px",
      },
      rollLabel: {
        fontSize: "0.875rem",
        fontWeight: "600",
        color: theme.textSecondary,
        marginBottom: "0.5rem",
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
    }),
    [theme]
  );

  const getViewingReviewStatus = (sheet, theme) => {
    if (sheet.is_draft) {
      return (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: theme.textSecondary + "20",
            color: theme.textSecondary,
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "1.5rem",
          }}
        >
          📝 Draft Status
        </div>
      );
    }

    const status = sheet.review_status || "pending";
    const statusConfig = {
      pending: {
        bg: theme.primary + "20",
        color: theme.primary,
        icon: "⏳",
        text: "Pending Admin Review",
        description:
          "Your downtime sheet has been submitted and is awaiting review by an admin.",
      },
      success: {
        bg: theme.success + "20",
        color: theme.success,
        icon: "✅",
        text: "Approved",
        description:
          "Your downtime sheet has been reviewed and approved by an admin.",
      },
      failure: {
        bg: theme.error + "20",
        color: theme.error,
        icon: "❌",
        text: "Rejected",
        description:
          "Your downtime sheet has been reviewed but needs revisions. Check the admin feedback below.",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: config.bg,
          color: config.color,
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>{config.icon}</span>
          <span>Review Status: {config.text}</span>
        </div>
        <div
          style={{
            fontSize: "12px",
            opacity: 0.8,
            fontWeight: "normal",
          }}
        >
          {config.description}
        </div>
      </div>
    );
  };

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

  const renderRollInfo = (
    assignment,
    dicePool,
    skillField,
    diceField,
    label
  ) => {
    const skill = assignment[skillField];
    const diceValue = dicePool?.[assignment[diceField]];

    if (!skill || diceValue === undefined || diceValue === null) {
      return null;
    }

    const modifier = getModifierValue(skill);
    const total = diceValue + modifier;

    return (
      <div style={styles.rollContainer}>
        <div style={styles.rollLabel}>{label}</div>
        <div>
          <div style={styles.label}>Skill Used:</div>
          <div style={styles.value}>
            {getSkillDisplayName(skill)} ({formatModifier(modifier)})
          </div>
        </div>
        <div style={styles.rollInfo}>
          <div style={styles.diceValue}>
            Roll: {diceValue} {formatModifier(modifier)} = {total}
          </div>
        </div>
      </div>
    );
  };

  const renderAdminControls = (assignmentKey, assignment) => {
    if (assignment.result) {
      const getResultConfig = (result) => {
        switch (result) {
          case "success":
            return {
              style: styles.successIndicator,
              icon: <CheckCircle size={16} />,
              text: "Success",
            };
          case "partial":
            return {
              style: styles.partialIndicator,
              icon: <CircleAlert size={16} />,
              text: "Partial Success",
            };
          case "failure":
            return {
              style: styles.failureIndicator,
              icon: <XCircle size={16} />,
              text: "Failure",
            };
          default:
            return null;
        }
      };

      const resultConfig = getResultConfig(assignment.result);
      if (!resultConfig) return null;

      return (
        <div>
          <div style={resultConfig.style}>
            {resultConfig.icon}
            {resultConfig.text}
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
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {viewingSheet.review_status === "failure" &&
            viewingSheet.user_id === user?.id && (
              <button
                onClick={() => onEditRejected(viewingSheet)}
                style={{
                  ...styles.backButton,
                  backgroundColor: theme.warning,
                }}
              >
                ✏️ Edit & Resubmit
              </button>
            )}

          <button onClick={onBack} style={styles.backButton}>
            <ArrowLeft size={16} />
            Back to List
          </button>
        </div>
      </div>
      {getViewingReviewStatus(viewingSheet, theme)}

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
              {viewingSheet.is_draft
                ? "📝 Draft"
                : viewingSheet.review_status === "success"
                ? "✅ Approved"
                : viewingSheet.review_status === "failure"
                ? "❌ Rejected"
                : viewingSheet.review_status === "pending"
                ? "⏳ Pending Review"
                : "✅ Submitted"}
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

      {viewingSheet.admin_feedback && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>💬 Admin Feedback</h3>
          <div
            style={{
              padding: "16px",
              backgroundColor: theme.primary + "10",
              border: `1px solid ${theme.primary + "30"}`,
              borderRadius: "8px",
              fontSize: "14px",
              lineHeight: "1.6",
              color: theme.text,
              whiteSpace: "pre-wrap",
            }}
          >
            {viewingSheet.admin_feedback}
          </div>
        </div>
      )}

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
            const assignment = {
              ...(viewingSheet.roll_assignments?.[assignmentKey] || {}),
              result: activity.result || activity.admin_status,
              adminNotes: activity.admin_notes,
            };

            const isDualCheck = activityRequiresDualChecks(activity.activity);

            return (
              <div key={index} style={styles.card}>
                <div style={styles.cardTitle}>Activity {index + 1}</div>

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

                <div>
                  <div style={styles.label}>Selected Activity:</div>
                  <div style={styles.value}>{activity.activity}</div>
                </div>

                {isDualCheck ? (
                  <div style={styles.dualRollContainer}>
                    {renderRollInfo(
                      assignment,
                      viewingSheet.dice_pool,
                      "skill",
                      "diceIndex",
                      "First Roll"
                    )}
                    {renderRollInfo(
                      assignment,
                      viewingSheet.dice_pool,
                      "secondSkill",
                      "secondDiceIndex",
                      "Second Roll"
                    )}
                  </div>
                ) : (
                  assignment.skill &&
                  renderRollInfo(
                    assignment,
                    viewingSheet.dice_pool,
                    "skill",
                    "diceIndex",
                    "Roll Result"
                  )
                )}

                {assignment.notes && (
                  <div>
                    <div style={styles.label}>Player Notes:</div>
                    <div style={styles.value}>{assignment.notes}</div>
                  </div>
                )}

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

            return (
              <div key={index} style={styles.card}>
                <div style={styles.cardTitle}>Relationship {index + 1}</div>

                <div>
                  <div style={styles.label}>NPC Name:</div>
                  <div style={styles.value}>{relationship.npcName}</div>
                </div>

                {renderRollInfo(
                  assignment,
                  viewingSheet.dice_pool,
                  "skill",
                  "diceIndex",
                  "Roll Result"
                )}

                {relationship.notes && (
                  <div>
                    <div style={styles.label}>Player Notes:</div>
                    <div style={styles.value}>{relationship.notes}</div>
                  </div>
                )}

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
