import { useMemo } from "react";
import { ArrowLeft, CheckCircle, CircleAlert, XCircle } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { allSkills } from "../../SharedData/data";
import { wandModifiers } from "../../SharedData/downtime";
import {
  calculateModifier,
  activityRequiresDualChecks,
  activityRequiresSpellSelection,
  activityRequiresWandSelection,
  activityRequiresClassSelection,
  activityRequiresSkillSelection,
  activityRequiresNameInput,
  activityRequiresExtraDie,
  getMultiSuccessActivityInfo,
  activityRequiresAbilitySelection,
  getAvailableAbilityScores,
} from "./downtimeHelpers";
import { formatModifier } from "./utils/modifierUtils";

const ViewingSheetForm = ({
  viewingSheet,
  selectedCharacter,
  onBack,
  onEditRejected,
  onUpdateAssignment,
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
        color: theme.primary,
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
        marginBottom: "1rem",
      },
      infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1rem",
      },
      rollInfo: {
        padding: "0.75rem",
        backgroundColor: theme.primary + "10",
        border: `1px solid ${theme.primary + "30"}`,
        borderRadius: "6px",
        fontSize: "0.875rem",
        marginBottom: "0.5rem",
      },
      diceValue: {
        fontWeight: "600",
        color: theme.primary,
      },
      successIndicator: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem",
        backgroundColor: theme.success + "20",
        color: theme.success,
        borderRadius: "6px",
        fontSize: "0.875rem",
        fontWeight: "600",
        marginTop: "0.5rem",
      },
      partialIndicator: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem",
        backgroundColor: theme.warning + "20",
        color: theme.warning,
        borderRadius: "6px",
        fontSize: "0.875rem",
        fontWeight: "600",
        marginTop: "0.5rem",
      },
      failureIndicator: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem",
        backgroundColor: theme.error + "20",
        color: theme.error,
        borderRadius: "6px",
        fontSize: "0.875rem",
        fontWeight: "600",
        marginTop: "0.5rem",
      },
      adminFeedback: {
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
      specialActivityNotice: {
        backgroundColor: `${theme.warning || "#f59e0b"}15`,
        border: `1px solid ${theme.warning || "#f59e0b"}30`,
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "16px",
        fontSize: "14px",
        color: theme.text,
      },
      extraDieNotice: {
        backgroundColor: `${theme.success || "#10b981"}15`,
        border: `1px solid ${theme.success || "#10b981"}30`,
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "16px",
        fontSize: "14px",
        color: theme.text,
      },
      multiSessionNotice: {
        backgroundColor: `${theme.primary}15`,
        border: `1px solid ${theme.primary}30`,
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "16px",
        fontSize: "14px",
        color: theme.text,
      },
      spellInfo: {
        backgroundColor: theme.surface + "60",
        padding: "0.75rem",
        borderRadius: "6px",
        marginBottom: "1rem",
        border: `1px dashed ${theme.border}`,
      },
      wandInfo: {
        backgroundColor: theme.surface + "60",
        padding: "0.75rem",
        borderRadius: "6px",
        marginBottom: "1rem",
        border: `1px dashed ${theme.border}`,
      },
      classInfo: {
        backgroundColor: theme.surface + "60",
        padding: "0.75rem",
        borderRadius: "6px",
        marginBottom: "1rem",
        border: `1px dashed ${theme.border}`,
      },
      nameInfo: {
        backgroundColor: theme.surface + "60",
        padding: "0.75rem",
        borderRadius: "6px",
        marginBottom: "1rem",
        border: `1px dashed ${theme.border}`,
      },
      skillInfo: {
        backgroundColor: theme.surface + "60",
        padding: "0.75rem",
        borderRadius: "6px",
        marginBottom: "1rem",
        border: `1px dashed ${theme.border}`,
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

  const getWandDisplayName = (wandName) => {
    const wand = wandModifiers.find((w) => w.name === wandName);
    return wand?.displayName || wandName;
  };

  const getModifierValue = (skillName) => {
    if (!skillName || !selectedCharacter) return 0;

    const abilityScores = [
      "strength",
      "dexterity",
      "constitution",
      "intelligence",
      "wisdom",
      "charisma",
    ];
    if (abilityScores.includes(skillName.toLowerCase())) {
      const abilityValue = selectedCharacter[skillName.toLowerCase()] || 10;
      return Math.floor((abilityValue - 10) / 2);
    }

    return calculateModifier(skillName, selectedCharacter);
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

  const renderWandStatIncreaseInfo = (activity, assignment, dicePool) => {
    let selectedWandModifier =
      activity.selectedWandModifier ||
      assignment.wandModifier ||
      assignment.selectedWandModifier;

    if (!selectedWandModifier && assignment.notes) {
      const notes = assignment.notes.toLowerCase();
      if (notes.includes("transfig") || notes.includes("transformation"))
        selectedWandModifier = "transfiguration";
      else if (notes.includes("charm")) selectedWandModifier = "charms";
      else if (
        notes.includes("jinx") ||
        notes.includes("hex") ||
        notes.includes("curse")
      )
        selectedWandModifier = "jinxesHexesCurses";
      else if (notes.includes("heal")) selectedWandModifier = "healing";
      else if (notes.includes("divin")) selectedWandModifier = "divinations";
    }

    if (!selectedWandModifier) {
      return (
        <div style={styles.rollContainer}>
          <div style={styles.rollLabel}>Wand Stat Increase</div>
          <div style={styles.value}>
            No wand modifier found (check: {assignment.notes})
          </div>
        </div>
      );
    }

    let diceIndex = assignment.diceIndex;
    let diceValue = dicePool?.[diceIndex];

    if (
      diceIndex === null ||
      diceIndex === undefined ||
      diceValue === undefined
    ) {
      if (assignment.customDice && assignment.customDice.length > 0) {
        diceValue = assignment.customDice[0];
        diceIndex = "custom";
      }
    }

    if (diceValue === undefined) {
      return (
        <div style={styles.rollContainer}>
          <div style={styles.rollLabel}>Wand Stat Increase Roll</div>
          <div>
            <div style={styles.label}>Wand Modifier:</div>
            <div style={styles.value}>
              {getWandDisplayName(selectedWandModifier)}
            </div>
          </div>
          <div style={styles.value}>
            No dice assignment found (diceIndex: {assignment.diceIndex})
          </div>
        </div>
      );
    }

    const wandModifier = getModifierValue(selectedWandModifier);
    const total = diceValue + wandModifier;
    const currentValue =
      selectedCharacter?.magicModifiers?.[selectedWandModifier] || 0;
    const dc = 11 + currentValue;

    return (
      <div style={styles.rollContainer}>
        <div style={styles.rollLabel}>Wand Stat Increase Roll</div>
        <div>
          <div style={styles.label}>Wand Modifier:</div>
          <div style={styles.value}>
            {getWandDisplayName(selectedWandModifier)} (
            {formatModifier(wandModifier)})
          </div>
        </div>
        <div>
          <div style={styles.label}>Target DC:</div>
          <div style={styles.value}>
            {dc} (11 + current modifier {currentValue})
          </div>
        </div>
        <div style={styles.rollInfo}>
          <div style={styles.diceValue}>
            Roll: {diceValue} {formatModifier(wandModifier)} = {total} vs DC{" "}
            {dc}
          </div>
        </div>
        {total >= dc && (
          <div style={styles.successIndicator}>
            <CheckCircle size={16} />
            Success! Wand modifier increased
          </div>
        )}
        {total < dc && (
          <div style={styles.failureIndicator}>
            <XCircle size={16} />
            Failed to increase wand modifier
          </div>
        )}
      </div>
    );
  };

  const renderSpellRollInfo = (
    assignment,
    dicePool,
    label = "Spell Roll",
    diceField = null,
    spellName = null
  ) => {
    let spellDiceIndex;

    if (diceField) {
      spellDiceIndex = assignment[diceField];
    } else {
      spellDiceIndex =
        assignment.firstSpellDice !== null &&
        assignment.firstSpellDice !== undefined
          ? assignment.firstSpellDice
          : assignment.secondSpellDice;
    }

    if (spellDiceIndex === null || spellDiceIndex === undefined) {
      return null;
    }

    const diceValue = dicePool?.[spellDiceIndex];

    if (diceValue === undefined || diceValue === null) {
      return null;
    }

    const skill = "historyOfMagic";
    const modifier = getModifierValue(skill);
    const total = diceValue + modifier;

    return (
      <div style={styles.rollContainer}>
        <div style={styles.rollLabel}>{label}</div>
        {spellName && (
          <div>
            <div style={styles.label}>Spell:</div>
            <div style={styles.value}>{spellName}</div>
          </div>
        )}
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

  const renderCustomDiceInfo = (assignment, label = "Custom Dice") => {
    if (!assignment.customDice || !Array.isArray(assignment.customDice)) {
      return null;
    }

    const total = assignment.customDice.reduce((sum, die) => sum + die, 0);
    const jobTypeDisplay = assignment.jobType
      ? ` (${assignment.jobType} job)`
      : "";

    return (
      <div style={styles.rollContainer}>
        <div style={styles.rollLabel}>{label}</div>
        <div>
          <div style={styles.label}>Job Earnings{jobTypeDisplay}:</div>
          <div style={styles.value}>
            {assignment.customDice.join(" + ")} = {total} × 2 = {total * 2}{" "}
            Galleons
          </div>
        </div>
      </div>
    );
  };

  const getDualRollSkills = (activityText) => {
    if (!activityText) return null;

    const text = activityText.toLowerCase();

    if (
      text.includes("restricted section") ||
      text.includes("stealth and investigation")
    ) {
      return { first: "stealth", second: "investigation" };
    }

    if (text.includes("sleight of hand and investigation")) {
      return { first: "sleightOfHand", second: "investigation" };
    }

    if (text.includes("explore the forbidden forest")) {
      return { first: "stealth", second: "investigation" };
    }

    if (text.includes("stealing")) {
      return { first: "sleightOfHand", second: "investigation" };
    }

    return null;
  };

  const renderExtraDieRollInfo = (
    assignment,
    dicePool,
    extraDiceAssignments,
    activityIndex,
    label = "Extra Die Roll"
  ) => {
    if (!assignment.extraDieUsed || !extraDiceAssignments) {
      return null;
    }

    const extraAssignment =
      extraDiceAssignments[`activity${activityIndex + 1}`];
    if (!extraAssignment) {
      return null;
    }

    const diceValue = dicePool?.[extraAssignment.diceIndex];
    const skill = extraAssignment.skill;

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

  const renderActivitySpecialInfo = (activity, assignment) => {
    const components = [];

    if (activityRequiresSpellSelection(activity.activity)) {
      if (activity.selectedSpell) {
        components.push(
          <div key="spell" style={styles.spellInfo}>
            <div style={styles.label}>Selected Spell:</div>
            <div style={styles.value}>{activity.selectedSpell}</div>
          </div>
        );
      } else {
        const hasFirstSpell =
          assignment.firstSpellDice !== null &&
          assignment.firstSpellDice !== undefined;
        const hasSecondSpell =
          assignment.secondSpellDice !== null &&
          assignment.secondSpellDice !== undefined;

        if (!hasFirstSpell && !hasSecondSpell) {
          components.push(
            <div key="spell" style={styles.spellInfo}>
              <div style={styles.label}>Spell Activity:</div>
              <div style={styles.value}>No spell roll data found</div>
            </div>
          );
        }
      }
    }

    if (
      activityRequiresWandSelection(activity.activity) &&
      activity.selectedWandModifier
    ) {
      components.push(
        <div key="wand" style={styles.wandInfo}>
          <div style={styles.label}>Selected Wand Modifier:</div>
          <div style={styles.value}>
            {getWandDisplayName(activity.selectedWandModifier)}
            {selectedCharacter &&
              ` (${formatModifier(
                selectedCharacter.magicModifiers?.[
                  activity.selectedWandModifier
                ] || 0
              )})`}
          </div>
        </div>
      );
    }

    if (
      activityRequiresClassSelection(activity.activity) &&
      activity.selectedClass
    ) {
      components.push(
        <div key="class" style={styles.classInfo}>
          <div style={styles.label}>Selected Class:</div>
          <div style={styles.value}>{activity.selectedClass}</div>
        </div>
      );
    }

    if (
      activityRequiresSkillSelection(activity.activity) &&
      activity.selectedSkill
    ) {
      components.push(
        <div key="skill" style={styles.skillInfo}>
          <div style={styles.label}>Selected Skill:</div>
          <div style={styles.value}>
            {getSkillDisplayName(activity.selectedSkill)}
          </div>
        </div>
      );
    }

    if (
      activityRequiresAbilitySelection(activity.activity) &&
      activity.selectedAbilityScore
    ) {
      const abilities = getAvailableAbilityScores(selectedCharacter);
      const selectedAbility = abilities.find(
        (a) => a.name === activity.selectedAbilityScore
      );

      components.push(
        <div key="ability" style={styles.skillInfo}>
          {" "}
          {/* Reuse existing skillInfo style */}
          <div style={styles.label}>Selected Ability Score:</div>
          <div style={styles.value}>
            {selectedAbility?.displayName ||
              activity.selectedAbilityScore.charAt(0).toUpperCase() +
                activity.selectedAbilityScore.slice(1)}
          </div>
        </div>
      );
    }

    if (activityRequiresNameInput(activity.activity)) {
      const nameField = activity.activity.toLowerCase().includes("potion")
        ? "potionName"
        : activity.activity.toLowerCase().includes("recipe")
        ? "recipeName"
        : activity.activity.toLowerCase().includes("plant")
        ? "plantName"
        : null;

      if (nameField && activity[nameField]) {
        const label =
          nameField === "potionName"
            ? "Potion Name"
            : nameField === "recipeName"
            ? "Recipe Name"
            : nameField === "plantName"
            ? "Plant Name"
            : "Name";

        components.push(
          <div key="name" style={styles.nameInfo}>
            <div style={styles.label}>{label}:</div>
            <div style={styles.value}>{activity[nameField]}</div>
          </div>
        );
      }
    }

    if (assignment.jobType) {
      components.push(
        <div key="job-type" style={styles.classInfo}>
          <div style={styles.label}>Job Type:</div>
          <div style={styles.value}>
            {assignment.jobType.charAt(0).toUpperCase() +
              assignment.jobType.slice(1)}
          </div>
        </div>
      );
    }

    if (assignment.familyType) {
      components.push(
        <div key="family-type" style={styles.classInfo}>
          <div style={styles.label}>Family Wealth:</div>
          <div style={styles.value}>
            {assignment.familyType.charAt(0).toUpperCase() +
              assignment.familyType.slice(1)}
          </div>
        </div>
      );
    }

    return components;
  };

  const renderActivityNotices = (activity) => {
    const notices = [];

    if (activityRequiresDualChecks(activity.activity)) {
      notices.push(
        <div key="dual-check" style={styles.dualCheckNotice}>
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
            This activity required <strong>two separate dice rolls</strong>.
          </div>
        </div>
      );
    }

    if (activityRequiresExtraDie(activity.activity)) {
      notices.push(
        <div key="extra-die" style={styles.extraDieNotice}>
          <div
            style={{
              fontWeight: "600",
              marginBottom: "4px",
              color: theme.success || "#10b981",
            }}
          >
            🔮 Spell Activity
          </div>
          <div>
            This activity involved <strong>spell research/casting</strong> with
            separate dice rolls for each spell.
          </div>
        </div>
      );
    }

    const multiSessionInfo = getMultiSuccessActivityInfo(activity.activity);
    if (multiSessionInfo) {
      notices.push(
        <div key="multi-session" style={styles.multiSessionNotice}>
          <div
            style={{
              fontWeight: "600",
              marginBottom: "4px",
              color: theme.primary,
            }}
          >
            🔄 Multi-Session Activity
          </div>
          <div>
            This activity requires{" "}
            <strong>
              {multiSessionInfo.config.requiredSuccesses} successful checks
            </strong>{" "}
            across separate downtime sessions.
            {activity.currentSuccesses !== undefined && (
              <div style={{ marginTop: "4px", fontSize: "0.875rem" }}>
                Progress: {activity.currentSuccesses || 0}/
                {multiSessionInfo.config.requiredSuccesses} successes
              </div>
            )}
          </div>
        </div>
      );
    }

    return notices;
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
          {viewingSheet.review_status === "failure" && (
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
            const requiresExtraDie = activityRequiresExtraDie(
              activity.activity
            );

            const getSpellNameForActivity = (
              activityIndex,
              spellSlot,
              viewingSheet
            ) => {
              if (!viewingSheet?.selected_spells) return null;

              const activityKey = `activity${activityIndex + 1}`;
              const activitySpells = viewingSheet.selected_spells[activityKey];

              if (!activitySpells) return null;

              return activitySpells[spellSlot] || null;
            };

            return (
              <div key={index} style={styles.card}>
                <div style={styles.cardTitle}>Activity {index + 1}</div>

                {renderActivityNotices(activity)}

                <div>
                  <div style={styles.label}>Selected Activity:</div>
                  <div style={styles.value}>{activity.activity}</div>
                </div>

                {renderActivitySpecialInfo(activity, assignment)}

                {isDualCheck ? (
                  <div style={styles.dualRollContainer}>
                    {assignment.diceIndex !== null &&
                      assignment.diceIndex !== undefined &&
                      (() => {
                        const dualSkills = getDualRollSkills(activity.activity);
                        const skillToUse =
                          assignment.skill || dualSkills?.first || "";

                        if (skillToUse) {
                          const modifiedAssignment = {
                            ...assignment,
                            skill: skillToUse,
                          };

                          return renderRollInfo(
                            modifiedAssignment,
                            viewingSheet.dice_pool,
                            "skill",
                            "diceIndex",
                            `First Roll${
                              dualSkills?.first
                                ? ` (${getSkillDisplayName(dualSkills.first)})`
                                : ""
                            }`
                          );
                        } else {
                          const diceValue =
                            viewingSheet.dice_pool[assignment.diceIndex];
                          return (
                            <div style={styles.rollContainer}>
                              <div style={styles.rollLabel}>First Roll</div>
                              <div style={styles.rollInfo}>
                                <div style={styles.diceValue}>
                                  Dice: {diceValue}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })()}

                    {assignment.secondDiceIndex !== null &&
                      assignment.secondDiceIndex !== undefined &&
                      (() => {
                        const dualSkills = getDualRollSkills(activity.activity);
                        const skillToUse =
                          assignment.secondSkill || dualSkills?.second || "";

                        if (skillToUse) {
                          const modifiedAssignment = {
                            ...assignment,
                            skill: skillToUse,
                            diceIndex: assignment.secondDiceIndex,
                          };

                          return renderRollInfo(
                            modifiedAssignment,
                            viewingSheet.dice_pool,
                            "skill",
                            "diceIndex",
                            `Second Roll${
                              dualSkills?.second
                                ? ` (${getSkillDisplayName(dualSkills.second)})`
                                : ""
                            }`
                          );
                        } else {
                          const diceValue =
                            viewingSheet.dice_pool[assignment.secondDiceIndex];
                          return (
                            <div style={styles.rollContainer}>
                              <div style={styles.rollLabel}>Second Roll</div>
                              <div style={styles.rollInfo}>
                                <div style={styles.diceValue}>
                                  Dice: {diceValue}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })()}
                  </div>
                ) : requiresExtraDie ? (
                  <div style={styles.dualRollContainer}>
                    {assignment.firstSpellDice !== null &&
                      assignment.firstSpellDice !== undefined &&
                      (() => {
                        const firstSpellName =
                          getSpellNameForActivity(
                            index,
                            "first",
                            viewingSheet
                          ) || "First Spell";

                        return renderSpellRollInfo(
                          assignment,
                          viewingSheet.dice_pool,
                          "First Spell Roll",
                          "firstSpellDice",
                          firstSpellName,
                          activity
                        );
                      })()}
                    {assignment.secondSpellDice !== null &&
                      assignment.secondSpellDice !== undefined &&
                      (() => {
                        const secondSpellName =
                          getSpellNameForActivity(
                            index,
                            "second",
                            viewingSheet
                          ) || "Second Spell";

                        return renderSpellRollInfo(
                          assignment,
                          viewingSheet.dice_pool,
                          "Second Spell Roll",
                          "secondSpellDice",
                          secondSpellName,
                          activity
                        );
                      })()}
                    {!assignment.firstSpellDice &&
                      !assignment.secondSpellDice && (
                        <>
                          {assignment.skill &&
                            assignment.diceIndex !== null &&
                            assignment.diceIndex !== undefined &&
                            renderRollInfo(
                              assignment,
                              viewingSheet.dice_pool,
                              "skill",
                              "diceIndex",
                              "Skill Roll"
                            )}
                          {renderExtraDieRollInfo(
                            assignment,
                            viewingSheet.dice_pool,
                            viewingSheet.extra_dice_assignments,
                            index,
                            "Extra Roll"
                          )}
                        </>
                      )}
                  </div>
                ) : assignment.customDice &&
                  assignment.customDice.length > 0 &&
                  !activityRequiresWandSelection(activity.activity) ? (
                  renderCustomDiceInfo(assignment, "Job Earnings")
                ) : activityRequiresWandSelection(activity.activity) ? (
                  (() => {
                    return renderWandStatIncreaseInfo(
                      activity,
                      assignment,
                      viewingSheet.dice_pool
                    );
                  })()
                ) : (
                  assignment.skill &&
                  assignment.diceIndex !== null &&
                  assignment.diceIndex !== undefined &&
                  renderRollInfo(
                    assignment,
                    viewingSheet.dice_pool,
                    "skill",
                    "diceIndex",
                    "Roll Result"
                  )
                )}

                {!isDualCheck &&
                  !requiresExtraDie &&
                  !assignment.customDice &&
                  (!assignment.skill ||
                    assignment.diceIndex === null ||
                    assignment.diceIndex === undefined) && (
                    <div style={styles.rollContainer}>
                      <div style={styles.rollLabel}>Roll Information</div>
                      <div style={styles.value}>
                        No roll data recorded for this activity
                      </div>
                    </div>
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
