import { useMemo } from "react";
import { ArrowLeft, CheckCircle, CircleAlert, XCircle } from "lucide-react";
import { NPC_DATA } from "../../SharedData/npcData";
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

const NpcProgressSlots = ({ npcName, npcHistory, viewingSheet }) => {
  const { theme } = useTheme();

  const canonical = npcName
    ? (() => {
        const trimmed = npcName.trim().toLowerCase();
        const keys = Object.keys(NPC_DATA);
        return (
          keys.find((k) => k.toLowerCase() === trimmed) ||
          keys.find((k) => k.toLowerCase().startsWith(trimmed)) ||
          keys.find((k) => k.toLowerCase().includes(trimmed)) ||
          null
        );
      })()
    : null;

  if (!canonical) return null;

  const npcEntry = NPC_DATA[canonical];
  const maxSlots = npcEntry[5] !== undefined ? 5 : 4;

  const viewYear = parseInt(viewingSheet.year || viewingSheet.school_year) || 0;
  const viewSem = parseInt(viewingSheet.semester) || 0;

  const filledEntries = npcHistory.filter((entry) => {
    const ey = parseInt(entry.year) || 0;
    const es = parseInt(entry.semester) || 0;
    return ey < viewYear || (ey === viewYear && es <= viewSem);
  });

  const filledCount = filledEntries.length;

  return (
    <div style={{ marginTop: "12px" }}>
      <div
        style={{
          fontSize: "12px",
          fontWeight: "600",
          color: theme.textSecondary,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "8px",
        }}
      >
        Relationship Progress
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {Array.from({ length: maxSlots }, (_, i) => {
          const slotLevel = i + 1;
          const isFilled = slotLevel <= filledCount;
          const entry = filledEntries[i];
          const isCurrentSheet = entry?.sheetId === viewingSheet.id;
          const isRomance = npcEntry[slotLevel]?.romanceOnly;

          const filledColor = isCurrentSheet
            ? theme.success
            : isRomance
              ? "#ec4899"
              : theme.primary;

          return (
            <div
              key={slotLevel}
              title={
                isFilled
                  ? `Level ${slotLevel} — Year ${entry.year}, Semester ${entry.semester}`
                  : `Level ${slotLevel}${isRomance ? " (Romance)" : ""}`
              }
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: `2px solid ${isFilled ? filledColor : theme.border}`,
                backgroundColor: isFilled ? filledColor + "30" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "700",
                color: isFilled ? filledColor : theme.border,
                cursor: "default",
                flexShrink: 0,
              }}
            >
              {slotLevel}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ViewingSheetForm = ({
  viewingSheet,
  selectedCharacter,
  onBack,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  onEditRejected,
  onUpdateAssignment,
  user,
  submittedSheets = [],
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
    [theme],
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
      partial: {
        bg: "#f9731620",
        color: "#f97316",
        icon: "🔄",
        text: "Approved - NPC Review Pending",
        description:
          "Your activities have been reviewed. NPC interaction notes are still being processed by an admin.",
      },
      npc_override: {
        bg: theme.success + "20",
        color: theme.success,
        icon: "✅",
        text: "Approved",
        description:
          "Your downtime sheet has been reviewed and approved by an admin.",
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
  const renderAbilityScoreRollInfo = (activity, assignment, dicePool) => {
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
      selectedCharacter?.ability_scores?.[abilityName] ||
      selectedCharacter?.[abilityName] ||
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
        <div style={styles.rollLabel}>Ability Score Check</div>
        <div>
          <div style={styles.label}>Ability Used:</div>
          <div style={styles.value}>
            {abilityDisplayName} ({formatModifier(modifier)})
          </div>
        </div>
        <div style={styles.rollInfo}>
          <div style={styles.diceValue}>
            Roll: {diceValue} {formatModifier(modifier)} = {total}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: theme.textSecondary,
              marginTop: "4px",
            }}
          >
            Target DC: {dc} - {isSuccess ? "✅ Success" : "❌ Failure"}
            {isNat20 && " (Natural 20 - counts as 2 successes!)"}
          </div>
        </div>
      </div>
    );
  };
  const renderRollInfo = (
    assignment,
    dicePool,
    skillField,
    diceField,
    label,
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
    spellName = null,
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
    label = "Extra Die Roll",
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
          </div>,
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
            </div>,
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
                ] || 0,
              )})`}
          </div>
        </div>,
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
        </div>,
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
        </div>,
      );
    }

    if (
      activityRequiresAbilitySelection(activity.activity) &&
      activity.selectedAbilityScore
    ) {
      const abilities = getAvailableAbilityScores(selectedCharacter);
      const selectedAbility = abilities.find(
        (a) => a.name === activity.selectedAbilityScore,
      );

      components.push(
        <div key="ability" style={styles.skillInfo}>
          {" "}
          <div style={styles.label}>Selected Ability Score:</div>
          <div style={styles.value}>
            {selectedAbility?.displayName ||
              activity.selectedAbilityScore.charAt(0).toUpperCase() +
                activity.selectedAbilityScore.slice(1)}
          </div>
        </div>,
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
          </div>,
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
        </div>,
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
        </div>,
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
        </div>,
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
        </div>,
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
        </div>,
      );
    }

    return notices;
  };

  const resolveNpcName = (rawName) => {
    if (!rawName) return null;
    const trimmed = rawName.trim().toLowerCase();
    const keys = Object.keys(NPC_DATA);
    const exact = keys.find((k) => k.toLowerCase() === trimmed);
    if (exact) return exact;
    const startsWith = keys.find((k) => k.toLowerCase().startsWith(trimmed));
    if (startsWith) return startsWith;
    const contains = keys.find((k) => k.toLowerCase().includes(trimmed));
    return contains || null;
  };

  const isApprovedSheet = (sheet) =>
    sheet.review_status === "success" || sheet.review_status === "npc_override";

  const sheetYear = (sheet) => parseInt(sheet.year || sheet.school_year) || 0;

  const sheetSem = (sheet) => parseInt(sheet.semester) || 0;

  const buildNpcHistory = (npcName) => {
    const canonical = resolveNpcName(npcName);
    if (!canonical) return [];

    const allSheets = [...submittedSheets]
      .filter(isApprovedSheet)
      .sort((a, b) => {
        const yDiff = sheetYear(a) - sheetYear(b);
        return yDiff !== 0 ? yDiff : sheetSem(a) - sheetSem(b);
      });

    const history = [];
    allSheets.forEach((sheet) => {
      const relationships = sheet.relationships || [];
      const assignments = sheet.roll_assignments || {};
      relationships.forEach((rel, idx) => {
        if (resolveNpcName(rel.npcName) !== canonical) return;
        const key = `relationship${idx + 1}`;
        if (assignments[key]?.result === "success") {
          history.push({
            year: sheet.year || sheet.school_year,
            semester: sheet.semester,
            level: history.length + 1,
            sheetId: sheet.id,
          });
        }
      });
    });

    return history;
  };

  const getNpcLevelForThisSheet = (npcName) => {
    const canonical = resolveNpcName(npcName);
    if (!canonical) return 1;

    const viewYear = sheetYear(viewingSheet);
    const viewSem = sheetSem(viewingSheet);

    let priorSuccesses = 0;
    submittedSheets.filter(isApprovedSheet).forEach((sheet) => {
      if (sheet.id === viewingSheet.id) return;
      const y = sheetYear(sheet);
      const s = sheetSem(sheet);
      if (!(y < viewYear || (y === viewYear && s < viewSem))) return;
      const relationships = sheet.relationships || [];
      const assignments = sheet.roll_assignments || {};
      relationships.forEach((rel, idx) => {
        if (resolveNpcName(rel.npcName) !== canonical) return;
        if (assignments[`relationship${idx + 1}`]?.result === "success")
          priorSuccesses++;
      });
    });
    return priorSuccesses + 1;
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
            Year {viewingSheet.year || viewingSheet.school_year}, Semester{" "}
            {viewingSheet.semester} • Submitted:{" "}
            {new Date(
              viewingSheet.submitted_at || viewingSheet.updated_at,
            ).toLocaleDateString()}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
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

          <button
            onClick={onPrev}
            disabled={!onPrev}
            title={
              prevLabel
                ? `Previous: Year ${prevLabel.replace("Y", "").replace("S", ", Semester ")}`
                : "No earlier sheet"
            }
            style={{
              ...styles.backButton,
              opacity: onPrev ? 1 : 0.35,
              cursor: onPrev ? "pointer" : "not-allowed",
              minWidth: "80px",
            }}
          >
            ← {prevLabel ?? "—"}
          </button>

          <button
            onClick={onNext}
            disabled={!onNext}
            title={
              nextLabel
                ? `Next: Year ${nextLabel.replace("Y", "").replace("S", ", Semester ")}`
                : "No later sheet"
            }
            style={{
              ...styles.backButton,
              opacity: onNext ? 1 : 0.35,
              cursor: onNext ? "pointer" : "not-allowed",
              minWidth: "80px",
            }}
          >
            {nextLabel ?? "—"} →
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
              Year {viewingSheet.year || viewingSheet.school_year}, Semester{" "}
              {viewingSheet.semester}
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
                    : viewingSheet.review_status === "partial"
                      ? "🔄 NPC Review Pending"
                      : viewingSheet.review_status === "npc_override"
                        ? "✅ Approved"
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
              activity.activity,
            );

            const getSpellNameForActivity = (
              activityIndex,
              spellSlot,
              viewingSheet,
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
                            }`,
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
                            }`,
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
                ) : requiresExtraDie ||
                  activityRequiresSpellSelection(activity.activity) ? (
                  <div style={styles.dualRollContainer}>
                    {assignment.firstSpellDice !== null &&
                      assignment.firstSpellDice !== undefined &&
                      (() => {
                        const firstSpellName =
                          getSpellNameForActivity(
                            index,
                            "first",
                            viewingSheet,
                          ) || "First Spell";

                        return renderSpellRollInfo(
                          assignment,
                          viewingSheet.dice_pool,
                          "First Spell Roll",
                          "firstSpellDice",
                          firstSpellName,
                          activity,
                        );
                      })()}
                    {assignment.secondSpellDice !== null &&
                      assignment.secondSpellDice !== undefined &&
                      (() => {
                        const secondSpellName =
                          getSpellNameForActivity(
                            index,
                            "second",
                            viewingSheet,
                          ) || "Second Spell";

                        return renderSpellRollInfo(
                          assignment,
                          viewingSheet.dice_pool,
                          "Second Spell Roll",
                          "secondSpellDice",
                          secondSpellName,
                          activity,
                        );
                      })()}
                    {activityRequiresAbilitySelection(activity.activity)
                      ? renderAbilityScoreRollInfo(
                          activity,
                          assignment,
                          viewingSheet.dice_pool,
                        )
                      : assignment.diceIndex !== null &&
                          assignment.diceIndex !== undefined &&
                          assignment.skill
                        ? renderRollInfo(
                            assignment,
                            viewingSheet.dice_pool,
                            "skill",
                            "diceIndex",
                            "Roll",
                          )
                        : null}
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
                              "Skill Roll",
                            )}
                          {renderExtraDieRollInfo(
                            assignment,
                            viewingSheet.dice_pool,
                            viewingSheet.extra_dice_assignments,
                            index,
                            "Extra Roll",
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
                      viewingSheet.dice_pool,
                    );
                  })()
                ) : (
                  (assignment.skill ||
                    activityRequiresAbilitySelection(activity.activity)) &&
                  assignment.diceIndex !== null &&
                  assignment.diceIndex !== undefined &&
                  (activityRequiresAbilitySelection(activity.activity)
                    ? renderAbilityScoreRollInfo(
                        activity,
                        assignment,
                        viewingSheet.dice_pool,
                      )
                    : renderRollInfo(
                        assignment,
                        viewingSheet.dice_pool,
                        "skill",
                        "diceIndex",
                        "Roll Result",
                      ))
                )}

                {!isDualCheck &&
                  !requiresExtraDie &&
                  !assignment.customDice &&
                  !activityRequiresAbilitySelection(activity.activity) &&
                  !activityRequiresSpellSelection(activity.activity) &&
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

            const isSuccess = assignment.result === "success";
            const npcLevel = isSuccess
              ? getNpcLevelForThisSheet(relationship.npcName)
              : null;
            const npcLevelData =
              npcLevel != null
                ? NPC_DATA[resolveNpcName(relationship.npcName)]?.[npcLevel]
                : null;
            const isRomanceLevel =
              npcLevelData?.romanceOnly === true;
            const sceneText = npcLevelData?.scene || "";
            const infoText = npcLevelData?.info || "";
            const hasLevelContent = Boolean(sceneText || infoText);

            const npcHistory = buildNpcHistory(relationship.npcName);

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
                  "Roll Result",
                )}

                {relationship.notes && (
                  <div>
                    <div style={styles.label}>Player Notes:</div>
                    <div style={styles.value}>{relationship.notes}</div>
                  </div>
                )}

                {renderAdminControls(assignmentKey, assignment)}

                {isSuccess && (
                  <div
                    style={{
                      marginTop: "16px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: `1px solid ${
                        isRomanceLevel ? "#ec4899" : theme.success
                      }40`,
                      backgroundColor: theme.surface,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 16px",
                        backgroundColor:
                          (isRomanceLevel ? "#ec4899" : theme.success) + "18",
                        borderBottom: `1px solid ${
                          isRomanceLevel ? "#ec4899" : theme.success
                        }30`,
                        fontWeight: "700",
                        fontSize: "13px",
                        letterSpacing: "0.03em",
                        textTransform: "uppercase",
                        color: isRomanceLevel ? "#ec4899" : theme.success,
                      }}
                    >
                      <span>{isRomanceLevel ? "💕" : "✦"}</span>
                      <span>
                        Relationship Level {npcLevel}
                        {isRomanceLevel ? " · Romance" : ""}
                      </span>
                    </div>

                    <div style={{ padding: "14px 16px" }}>
                      {hasLevelContent ? (
                        <>
                          {sceneText &&
                            sceneText
                              .split(/\n{2,}/)
                              .map((para, i) => (
                                <p
                                  key={i}
                                  style={{
                                    margin: i === 0 ? "0 0 10px 0" : "0 0 10px 0",
                                    fontSize: "14px",
                                    lineHeight: "1.65",
                                    color: theme.text,
                                    whiteSpace: "pre-wrap",
                                  }}
                                >
                                  {para}
                                </p>
                              ))}

                          {infoText && (
                            <div
                              style={{
                                marginTop: sceneText ? "14px" : 0,
                                paddingTop: sceneText ? "12px" : 0,
                                borderTop: sceneText
                                  ? `1px solid ${theme.border}`
                                  : "none",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  letterSpacing: "0.05em",
                                  textTransform: "uppercase",
                                  color: theme.textSecondary,
                                  marginBottom: "6px",
                                }}
                              >
                                About {relationship.npcName.trim()}
                              </div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  lineHeight: "1.6",
                                  color: theme.textSecondary,
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {infoText}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          style={{
                            color: theme.textSecondary,
                            fontStyle: "italic",
                            fontSize: "13px",
                          }}
                        >
                          Level {npcLevel} content coming soon.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <NpcProgressSlots
                  npcName={relationship.npcName}
                  npcHistory={npcHistory}
                  viewingSheet={viewingSheet}
                />
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
