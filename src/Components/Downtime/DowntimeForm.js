import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getAllActivities, downtime } from "../SharedData/downtime";
import { formatModifier } from "../CharacterSheet/utils";
import {
  calculateModifier,
  activityRequiresDualChecks,
  getActivitySkillInfo,
  activityRequiresNoDiceRoll,
  isMultiSessionActivity,
  shouldUseCustomDiceForActivity,
  getCustomDiceTypeForActivity,
  getMultiSessionInfo,
  getSpecialActivityInfo,
  validateSkillName,
} from "./downtimeHelpers";
import SkillSelector from "./SkillSelector";
import DicePoolManager from "./DicePoolManager";

const DowntimeForm = ({
  user,
  selectedCharacter,
  supabase,
  adminMode,
  isUserAdmin,

  selectedYear,
  selectedSemester,
  currentSheet,
  setCurrentSheet,

  dicePool: initialDicePool,
  rollAssignments: initialRollAssignments,
  formData: initialFormData,

  loadSubmittedSheets,
  loadDrafts,
  setActiveTab,
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
      activityCard: {
        padding: "1.5rem",
        backgroundColor: theme.background,
        borderRadius: "8px",
        border: `1px solid ${theme.border}`,
        marginBottom: "1rem",
      },
      inputGroup: {
        marginBottom: "1rem",
      },
      label: {
        display: "block",
        fontSize: "0.875rem",
        fontWeight: "600",
        color: theme.text,
        marginBottom: "0.5rem",
      },
      input: {
        width: "100%",
        padding: "0.75rem",
        borderRadius: "6px",
        border: `1px solid ${theme.border}`,
        backgroundColor: theme.surface,
        color: theme.text,
        fontSize: "0.875rem",
      },
      select: {
        width: "100%",
        padding: "0.75rem",
        borderRadius: "6px",
        border: `1px solid ${theme.border}`,
        backgroundColor: theme.surface,
        color: theme.text,
        fontSize: "0.875rem",
      },
      textarea: {
        width: "100%",
        padding: "0.75rem",
        borderRadius: "6px",
        border: `1px solid ${theme.border}`,
        backgroundColor: theme.surface,
        color: theme.text,
        fontSize: "0.875rem",
        resize: "none",
        height: "80px",
      },
      activityDescription: {
        padding: "1rem",
        backgroundColor: theme.primary + "10",
        border: `1px solid ${theme.primary + "30"}`,
        borderRadius: "6px",
        fontSize: "0.875rem",
        color: theme.text,
        lineHeight: "1.5",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
      },
      diceAssignment: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginTop: "1rem",
      },
      assignedDice: {
        padding: "1rem",
        backgroundColor: theme.primary + "15",
        borderRadius: "8px",
        border: `2px solid ${theme.primary}`,
        textAlign: "center",
      },
      diceValue: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: theme.primary,
        marginBottom: "0.5rem",
      },
      total: {
        fontSize: "1rem",
        fontWeight: "600",
        color: theme.text,
        marginBottom: "0.5rem",
      },
      removeButton: {
        padding: "0.25rem 0.75rem",
        backgroundColor: theme.error + "15",
        color: theme.error,
        border: `1px solid ${theme.error}`,
        borderRadius: "4px",
        fontSize: "0.75rem",
        cursor: "pointer",
      },
      button: {
        padding: "0.75rem 1.5rem",
        borderRadius: "8px",
        border: "none",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
      },
      secondaryButton: {
        backgroundColor: theme.warning,
        color: "white",
      },
      successButton: {
        backgroundColor: theme.success,
        color: "white",
      },
      actionButtons: {
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        paddingTop: "1rem",
      },
    }),
    [theme]
  );
  const [hasInitialized, setHasInitialized] = useState(false);

  const [dicePool, setDicePool] = useState(initialDicePool || []);
  const [rollAssignments, setRollAssignments] = useState(
    initialRollAssignments || {
      activity1: {
        diceIndex: null,
        skill: "",
        wandModifier: "",
        notes: "",
        secondDiceIndex: null,
        secondSkill: "",
        secondWandModifier: "",
        customDice: null,
        jobType: null,
      },
      activity2: {
        diceIndex: null,
        skill: "",
        wandModifier: "",
        notes: "",
        secondDiceIndex: null,
        secondSkill: "",
        secondWandModifier: "",
        customDice: null,
        jobType: null,
      },
      activity3: {
        diceIndex: null,
        skill: "",
        wandModifier: "",
        notes: "",
        secondDiceIndex: null,
        secondSkill: "",
        secondWandModifier: "",
        customDice: null,
        jobType: null,
      },

      relationship1: {
        diceIndex: null,
        skill: "",
        notes: "",
        adminNotes: "",
        result: null,
      },
      relationship2: {
        diceIndex: null,
        skill: "",
        notes: "",
        adminNotes: "",
        result: null,
      },
      relationship3: {
        diceIndex: null,
        skill: "",
        notes: "",
        adminNotes: "",
        result: null,
      },
    }
  );
  const [formData, setFormData] = useState(
    initialFormData || {
      activities: [
        {
          activity: "",
          npc: "",
          successes: [false, false, false, false, false],
        },
        {
          activity: "",
          npc: "",
          successes: [false, false, false, false, false],
        },
        {
          activity: "",
          npc: "",
          successes: [false, false, false, false, false],
        },
      ],
      relationships: [
        { npcName: "", notes: "" },
        { npcName: "", notes: "" },
        { npcName: "", notes: "" },
      ],
      selectedMagicSchool: "",
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const [extraDiceAssignments, setExtraDiceAssignments] = useState({});

  const canEdit = useCallback(() => {
    if (isUserAdmin) return true;
    if (!currentSheet) return true;
    if (currentSheet.is_draft) return currentSheet.user_id === user?.id;
    if (currentSheet.review_status === "failure")
      return currentSheet.user_id === user?.id;
    return false;
  }, [isUserAdmin, currentSheet, user?.id]);

  const diceManager = DicePoolManager({
    dicePool,
    setDicePool,
    rollAssignments,
    setRollAssignments,
    extraDiceAssignments,
    setExtraDiceAssignments,
    formData,
    canEdit: () => canEdit(),
    selectedCharacter,
  });

  useEffect(() => {
    if (initialDicePool && initialDicePool.length > 0 && !hasInitialized) {
      setDicePool(initialDicePool);
      setHasInitialized(true);
    }
  }, [initialDicePool, hasInitialized]);

  useEffect(() => {
    if (
      initialRollAssignments &&
      Object.keys(initialRollAssignments).length > 0 &&
      !hasInitialized
    ) {
      setRollAssignments(initialRollAssignments);
    }
  }, [initialRollAssignments, hasInitialized]);

  useEffect(() => {
    if (initialFormData && initialFormData.activities && !hasInitialized) {
      setFormData({
        ...initialFormData,
        relationships: initialFormData.relationships || [
          { npcName: "", notes: "" },
          { npcName: "", notes: "" },
          { npcName: "", notes: "" },
        ],
      });
    }
  }, [initialFormData, hasInitialized]);

  const updateRollAssignment = useCallback(
    (activityIndex, field, value) => {
      if (!canEdit()) return;

      const assignmentKey = `activity${activityIndex + 1}`;
      setRollAssignments((prev) => ({
        ...prev,
        [assignmentKey]: {
          ...prev[assignmentKey],
          [field]: value,
        },
      }));
    },
    [canEdit]
  );

  useEffect(() => {
    formData.activities.forEach((activity, index) => {
      if (activity.activity) {
        const skillInfo = getActivitySkillInfo(activity.activity);
        const assignmentKey = `activity${index + 1}`;
        const currentAssignment = rollAssignments[assignmentKey];

        if (skillInfo.type === "locked" && skillInfo.skills) {
          if (
            skillInfo.skills[0] &&
            (!currentAssignment?.skill || currentAssignment.skill === "")
          ) {
            updateRollAssignment(index, "skill", skillInfo.skills[0]);
          }

          if (
            skillInfo.skills[1] &&
            (!currentAssignment?.secondSkill ||
              currentAssignment.secondSkill === "")
          ) {
            updateRollAssignment(index, "secondSkill", skillInfo.skills[1]);
          }
        } else if (skillInfo.type === "limited" && skillInfo.skills) {
          if (
            currentAssignment?.skill &&
            !skillInfo.skills.includes(currentAssignment.skill)
          ) {
            console.warn(
              `Invalid skill "${currentAssignment.skill}" for activity "${activity.activity}". Clearing.`
            );
            updateRollAssignment(index, "skill", "");
          }

          if (
            currentAssignment?.secondSkill &&
            !skillInfo.skills.includes(currentAssignment.secondSkill)
          ) {
            console.warn(
              `Invalid second skill "${currentAssignment.secondSkill}" for activity "${activity.activity}". Clearing.`
            );
            updateRollAssignment(index, "secondSkill", "");
          }
        }

        if (
          currentAssignment?.skill &&
          !validateSkillName(currentAssignment.skill)
        ) {
          console.error(
            `Skill "${currentAssignment.skill}" not found in allSkills. This may cause modifier calculation issues.`
          );
        }

        if (
          currentAssignment?.secondSkill &&
          !validateSkillName(currentAssignment.secondSkill)
        ) {
          console.error(
            `Second skill "${currentAssignment.secondSkill}" not found in allSkills. This may cause modifier calculation issues.`
          );
        }
      }
    });
  }, [formData.activities, rollAssignments, updateRollAssignment]);

  useEffect(() => {
    setHasInitialized(false);
  }, [currentSheet?.id]);

  const availableActivities = useMemo(() => {
    const activities = getAllActivities();
    return [
      { value: "", label: "Select Activity", description: "" },
      ...activities.map((activity) => ({
        value: activity,
        label: activity ? activity.split(" - ")[0] : "Select Activity",
        description: activity,
      })),
    ];
  }, []);

  const getActivityDescription = useCallback(
    (activityValue) => {
      if (!activityValue) return "";
      const activity = availableActivities.find(
        (a) => a.value === activityValue
      );
      return activity ? activity.description : "";
    },
    [availableActivities]
  );

  const getModifierValue = useCallback(
    (modifierName) => {
      if (!modifierName) {
        console.warn("getModifierValue called with empty modifierName");
        return 0;
      }

      const result = calculateModifier(modifierName, selectedCharacter);
      return result;
    },
    [selectedCharacter]
  );

  const formatModifierValue = useCallback((value) => {
    if (value === 0) return "+0";
    return value > 0 ? `+${value}` : `${value}`;
  }, []);

  const updateActivity = useCallback(
    (index, field, value) => {
      if (!canEdit()) return;

      const previousActivity = formData.activities[index]?.activity;
      const wasDualCheck = activityRequiresDualChecks(previousActivity);
      const willBeDualCheck =
        field === "activity" ? activityRequiresDualChecks(value) : wasDualCheck;

      const wasCustomDice = shouldUseCustomDiceForActivity(previousActivity);
      const willBeCustomDice =
        field === "activity"
          ? shouldUseCustomDiceForActivity(value)
          : wasCustomDice;

      setFormData((prev) => ({
        ...prev,
        activities: prev.activities.map((activity, i) =>
          i === index ? { ...activity, [field]: value } : activity
        ),
      }));

      const activityKey = `activity${index + 1}`;
      const assignment = rollAssignments[activityKey];

      if (field === "activity") {
        if (wasCustomDice && !willBeCustomDice) {
          setRollAssignments((prev) => ({
            ...prev,
            [activityKey]: {
              diceIndex: null,
              skill: "",
              wandModifier: "",
              notes: prev[activityKey]?.notes || "",
              secondDiceIndex: null,
              secondSkill: "",
              secondWandModifier: "",
              customDice: null,
              jobType: null,
            },
          }));
        } else if (!wasCustomDice && willBeCustomDice) {
          setRollAssignments((prev) => ({
            ...prev,
            [activityKey]: {
              diceIndex: null,
              skill: "",
              wandModifier: "",
              notes: prev[activityKey]?.notes || "",
              secondDiceIndex: null,
              secondSkill: "",
              secondWandModifier: "",
              customDice: null,
              jobType: null,
            },
          }));
        } else if (
          wasCustomDice &&
          willBeCustomDice &&
          previousActivity !== value
        ) {
          setRollAssignments((prev) => ({
            ...prev,
            [activityKey]: {
              diceIndex: null,
              skill: "",
              wandModifier: "",
              notes: prev[activityKey]?.notes || "",
              secondDiceIndex: null,
              secondSkill: "",
              secondWandModifier: "",
              customDice: null,
              jobType: null,
            },
          }));
        } else if (
          !wasCustomDice &&
          !willBeCustomDice &&
          previousActivity !== value
        ) {
          setRollAssignments((prev) => ({
            ...prev,
            [activityKey]: {
              ...prev[activityKey],
              skill: "",
              secondSkill: "",
              wandModifier: "",
              secondWandModifier: "",
            },
          }));
        }
      }

      if (field === "activity" && wasDualCheck && !willBeDualCheck) {
        diceManager.functions.removeExtraDiceForActivity(
          activityKey,
          assignment
        );
      }

      if (field === "activity" && !value) {
        if (wasDualCheck) {
          diceManager.functions.removeExtraDiceForActivity(
            activityKey,
            assignment
          );
        }

        setRollAssignments((prev) => ({
          ...prev,
          [activityKey]: {
            diceIndex: null,
            skill: "",
            wandModifier: "",
            notes: "",
            secondDiceIndex: null,
            secondSkill: "",
            secondWandModifier: "",
            customDice: null,
            jobType: null,
          },
        }));
      }
    },
    [
      canEdit,
      formData.activities,
      rollAssignments,
      setFormData,
      setRollAssignments,
      diceManager.functions,
    ]
  );

  const updateRelationshipAssignment = useCallback(
    (assignmentKey, field, value) => {
      if (!canEdit()) return;

      setRollAssignments((prev) => ({
        ...prev,
        [assignmentKey]: {
          ...prev[assignmentKey],
          [field]: value,
        },
      }));
    },
    [canEdit]
  );

  const updateRelationship = useCallback(
    (index, field, value) => {
      if (!canEdit()) return;

      setFormData((prev) => ({
        ...prev,
        relationships: prev.relationships.map((relationship, i) =>
          i === index ? { ...relationship, [field]: value } : relationship
        ),
      }));
    },
    [canEdit]
  );

  const renderDiceValue = useCallback(
    (assignment, dicePool, isSecond = false) => {
      const diceIndexKey = isSecond ? "secondDiceIndex" : "diceIndex";
      const skillKey = isSecond ? "secondSkill" : "skill";

      if (assignment.customDice && !isSecond) {
        const isWorkJob = assignment.jobType !== undefined;
        const diceSum = assignment.customDice[0] + assignment.customDice[1];

        return (
          <div style={styles.assignedDice}>
            <div style={styles.diceValue}>
              {isWorkJob ? (
                <>
                  {assignment.jobType === "easy" && "2D8: "}
                  {assignment.jobType === "medium" && "2D10: "}
                  {assignment.jobType === "hard" && "2D12: "}
                  {assignment.customDice[0]} + {assignment.customDice[1]} ={" "}
                  {diceSum}
                  {isWorkJob && (
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: theme.textSecondary,
                        marginTop: "0.25rem",
                      }}
                    >
                      Earnings: {diceSum} × 2 = {diceSum * 2} Galleons
                    </div>
                  )}
                </>
              ) : (
                <>
                  2d12: {assignment.customDice[0]} + {assignment.customDice[1]}{" "}
                  = {diceSum}
                </>
              )}
            </div>
            {assignment[skillKey] && !isWorkJob && (
              <div style={styles.total}>
                Total: {diceSum}{" "}
                {formatModifier(getModifierValue(assignment[skillKey]))} ={" "}
                {diceSum + getModifierValue(assignment[skillKey])}
              </div>
            )}
          </div>
        );
      }

      if (
        assignment[diceIndexKey] !== null &&
        assignment[diceIndexKey] !== undefined
      ) {
        const diceValue = dicePool[assignment[diceIndexKey]];
        const skillName = assignment[skillKey];
        const hasSkill = skillName && skillName !== "";
        const modifierValue = hasSkill ? getModifierValue(skillName) : 0;
        const totalValue = diceValue + modifierValue;

        return (
          <div style={styles.assignedDice}>
            <div style={styles.diceValue}>
              {hasSkill ? totalValue : diceValue}
            </div>
            {hasSkill && (
              <div style={styles.total}>
                Total: {diceValue} {formatModifier(modifierValue)} ={" "}
                {totalValue}
              </div>
            )}
          </div>
        );
      }

      return null;
    },
    [getModifierValue, theme.textSecondary, styles]
  );

  const editable = canEdit();

  const renderSpecialActivityInfo = useCallback(
    (activityText) => {
      if (!activityText) return null;

      if (activityRequiresNoDiceRoll(activityText)) {
        const specialInfo = getSpecialActivityInfo(activityText);
        return (
          <div
            style={{
              padding: "1rem",
              backgroundColor: theme.info + "20",
              border: `1px solid ${theme.info}`,
              borderRadius: "6px",
              marginTop: "1rem",
              textAlign: "center",
            }}
          >
            <strong>📋 No Dice Roll Required</strong>
            <br />
            <small>
              {specialInfo?.description ||
                "This activity doesn't require a dice roll to complete."}
            </small>
          </div>
        );
      }

      if (isMultiSessionActivity(activityText)) {
        const multiSessionInfo = getMultiSessionInfo(activityText);
        return (
          <div
            style={{
              padding: "1rem",
              backgroundColor: theme.warning + "20",
              border: `1px solid ${theme.warning}`,
              borderRadius: "6px",
              marginTop: "1rem",
            }}
          >
            <strong>⏳ Multi-Session Activity</strong>
            <br />
            <small>{multiSessionInfo.description}</small>
          </div>
        );
      }

      if (shouldUseCustomDiceForActivity(activityText)) {
        const customDiceInfo = getCustomDiceTypeForActivity(activityText);
        const isWorkJob = activityText.toLowerCase().includes("work job");

        return (
          <div
            style={{
              padding: "1rem",
              backgroundColor: theme.warning + "20",
              border: `1px solid ${theme.warning}`,
              borderRadius: "6px",
              marginTop: "1rem",
            }}
          >
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>🎲 Special Dice Rules</strong>
              <br />
              <small>{customDiceInfo.description}</small>
            </div>

            {isWorkJob && (
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: theme.text,
                  }}
                >
                  Job Difficulty:
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.surface,
                    color: theme.text,
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                  defaultValue="medium"
                  id={`job-difficulty-${activityText}`}
                >
                  <option value="easy">Easy Job (2D8 + promotions)</option>
                  <option value="medium">Medium Job (2D10 + promotions)</option>
                  <option value="hard">Hard Job (2D12 + promotions)</option>
                </select>
              </div>
            )}

            <div>
              <button
                onClick={() => {
                  const jobType = isWorkJob
                    ? document.getElementById(`job-difficulty-${activityText}`)
                        ?.value || "medium"
                    : undefined;
                  const activityIndex = formData.activities.findIndex(
                    (activity) => activity.activity === activityText
                  );
                  diceManager.functions.handleCustomDiceRoll(
                    activityText,
                    jobType,
                    activityIndex
                  );
                }}
                disabled={!editable}
                style={{
                  ...styles.button,
                  ...styles.secondaryButton,
                  fontSize: "0.875rem",
                  padding: "0.5rem 1rem",
                  ...(!editable ? { opacity: 0.6, cursor: "not-allowed" } : {}),
                }}
              >
                Roll {customDiceInfo.diceType}
              </button>
            </div>
          </div>
        );
      }

      const specialInfo = getSpecialActivityInfo(activityText);
      if (specialInfo) {
        let iconAndTitle = "";
        let bgColor = theme.info;

        switch (specialInfo.type) {
          case "job_application":
            iconAndTitle = "💼 Job Application";
            bgColor = theme.success;
            break;
          case "promotion":
            iconAndTitle = "📈 Promotion Attempt";
            bgColor = theme.success;
            break;
          default:
            iconAndTitle = "ℹ️ Special Activity";
        }

        return (
          <div
            style={{
              padding: "1rem",
              backgroundColor: bgColor + "20",
              border: `1px solid ${bgColor}`,
              borderRadius: "6px",
              marginTop: "1rem",
            }}
          >
            <strong>{iconAndTitle}</strong>
            <br />
            <small>{specialInfo.description}</small>
          </div>
        );
      }

      return null;
    },
    [theme, editable, diceManager.functions, formData.activities, styles]
  );

  const renderDiceAssignment = useCallback(
    (activity, index, assignment) => {
      const activityText = activity.activity;

      if (!activityText) return null;

      if (activityRequiresNoDiceRoll(activityText)) {
        return null;
      }

      if (shouldUseCustomDiceForActivity(activityText)) {
        if (assignment.customDice) {
          return (
            <div style={styles.diceAssignment}>
              <div>
                <label style={styles.label}>Roll Result</label>
                {renderDiceValue(assignment, dicePool, false)}
              </div>
            </div>
          );
        }

        return null;
      }

      if (activityRequiresDualChecks(activityText)) {
        const hasSecondDieAssigned =
          assignment.secondDiceIndex !== null &&
          assignment.secondDiceIndex !== undefined;

        const totalDualCheckActivities =
          diceManager.data.dualCheckActivities.length;
        const currentExtraDice = Math.max(0, dicePool.length - 6);
        const canAddMoreDice = currentExtraDice < totalDualCheckActivities;

        const totalDiceNeeded = 6 + totalDualCheckActivities;
        const needsExtraDie =
          !hasSecondDieAssigned &&
          canAddMoreDice &&
          dicePool.length < totalDiceNeeded;

        return (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div>
              <SkillSelector
                activityText={activityText}
                assignment={assignment}
                isSecondSkill={false}
                onChange={(value) =>
                  updateRollAssignment(index, "skill", value)
                }
                canEdit={() => editable}
                selectedCharacter={selectedCharacter}
              />

              <div style={{ marginTop: "0.5rem" }}>
                <label style={styles.label}>Primary Die</label>
                {renderDiceValue(assignment, dicePool, false) || (
                  <select
                    style={styles.select}
                    value=""
                    onChange={(e) =>
                      diceManager.functions.assignDice(
                        index,
                        parseInt(e.target.value),
                        false
                      )
                    }
                    disabled={!editable}
                  >
                    <option value="">Select die...</option>
                    {diceManager.functions.getSortedDiceOptions
                      .filter(
                        ({ index: diceIndex }) =>
                          !diceManager.functions.isDiceAssigned(diceIndex)
                      )
                      .map(({ value, index: diceIndex }) => (
                        <option key={diceIndex} value={diceIndex}>
                          {value}
                        </option>
                      ))}
                  </select>
                )}
                {assignment.diceIndex !== null &&
                  assignment.diceIndex !== undefined &&
                  editable && (
                    <button
                      style={{ ...styles.removeButton, marginTop: "0.5rem" }}
                      onClick={() =>
                        diceManager.functions.unassignDice(index, false)
                      }
                    >
                      Remove
                    </button>
                  )}
              </div>
            </div>

            <div>
              <SkillSelector
                activityText={activityText}
                assignment={assignment}
                isSecondSkill={true}
                onChange={(value) =>
                  updateRollAssignment(index, "secondSkill", value)
                }
                canEdit={() => editable}
                selectedCharacter={selectedCharacter}
              />

              <div style={{ marginTop: "0.5rem" }}>
                <label style={styles.label}>Second Die</label>

                {needsExtraDie && editable ? (
                  <button
                    onClick={() =>
                      diceManager.functions.addExtraDieForActivity(
                        `activity${index + 1}`
                      )
                    }
                    disabled={!canAddMoreDice}
                    style={{
                      ...styles.button,
                      ...styles.secondaryButton,
                      width: "100%",
                      fontSize: "0.875rem",
                      padding: "0.75rem",
                      marginTop: "0.5rem",
                      ...(!canAddMoreDice
                        ? { opacity: 0.6, cursor: "not-allowed" }
                        : {}),
                    }}
                    title={
                      canAddMoreDice
                        ? "Add an extra die for this dual check activity"
                        : `Maximum extra dice reached (${currentExtraDice}/${totalDualCheckActivities})`
                    }
                  >
                    + Add Extra Die ({currentExtraDice}/
                    {totalDualCheckActivities})
                  </button>
                ) : (
                  <>
                    {renderDiceValue(assignment, dicePool, true) || (
                      <select
                        style={styles.select}
                        value=""
                        onChange={(e) =>
                          diceManager.functions.assignDice(
                            index,
                            parseInt(e.target.value),
                            true
                          )
                        }
                        disabled={!editable}
                      >
                        <option value="">Select die...</option>
                        {diceManager.functions.getSortedDiceOptions
                          .filter(
                            ({ index: diceIndex }) =>
                              !diceManager.functions.isDiceAssigned(diceIndex)
                          )
                          .map(({ value, index: diceIndex }) => (
                            <option key={diceIndex} value={diceIndex}>
                              {value}
                            </option>
                          ))}
                      </select>
                    )}
                    {assignment.secondDiceIndex !== null &&
                      assignment.secondDiceIndex !== undefined &&
                      editable && (
                        <button
                          style={{
                            ...styles.removeButton,
                            marginTop: "0.5rem",
                          }}
                          onClick={() =>
                            diceManager.functions.unassignDice(index, true)
                          }
                        >
                          Remove
                        </button>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div style={styles.diceAssignment}>
            <div>
              <label style={styles.label}>Primary Die</label>
              {renderDiceValue(assignment, dicePool, false) || (
                <select
                  style={styles.select}
                  value=""
                  onChange={(e) =>
                    diceManager.functions.assignDice(
                      index,
                      parseInt(e.target.value),
                      false
                    )
                  }
                  disabled={!editable}
                >
                  <option value="">Select die...</option>
                  {diceManager.functions.getSortedDiceOptions
                    .filter(
                      ({ index: diceIndex }) =>
                        !diceManager.functions.isDiceAssigned(diceIndex)
                    )
                    .map(({ value, index: diceIndex }) => (
                      <option key={diceIndex} value={diceIndex}>
                        {value}
                      </option>
                    ))}
                </select>
              )}
              {assignment.diceIndex !== null &&
                assignment.diceIndex !== undefined &&
                editable && (
                  <button
                    style={{ ...styles.removeButton, marginTop: "0.5rem" }}
                    onClick={() =>
                      diceManager.functions.unassignDice(index, false)
                    }
                  >
                    Remove
                  </button>
                )}
            </div>
          </div>
        );
      }
    },
    [
      renderDiceValue,
      updateRollAssignment,
      editable,
      selectedCharacter,
      diceManager.functions,
      diceManager.data.dualCheckActivities.length,
      dicePool,
      styles,
    ]
  );

  const saveAsDraft = useCallback(async () => {
    if (
      !selectedCharacter?.id ||
      !user?.id ||
      !selectedYear ||
      !selectedSemester
    ) {
      alert("Missing required information to save draft.");
      return;
    }

    setIsSavingDraft(true);
    try {
      const draftData = {
        character_id: selectedCharacter.id,
        user_id: user.id,
        character_name: selectedCharacter.name,
        year: selectedYear,
        semester: selectedSemester,
        activities: formData.activities,
        relationships: formData.relationships,
        dice_pool: dicePool,
        roll_assignments: rollAssignments,
        selected_magic_school: formData.selectedMagicSchool || null,
        is_draft: true,
        updated_at: new Date().toISOString(),
      };

      if (currentSheet?.id) {
        const { error } = await supabase
          .from("character_downtime")
          .update(draftData)
          .eq("id", currentSheet.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("character_downtime")
          .insert([draftData])
          .select()
          .single();

        if (error) throw error;
        setCurrentSheet(data);
      }
      alert("Draft saved successfully!");
      if (loadDrafts) loadDrafts();
    } catch (err) {
      console.error("Error saving draft:", err);
    } finally {
      setIsSavingDraft(false);
    }
  }, [
    selectedCharacter,
    user,
    selectedYear,
    selectedSemester,
    formData,
    dicePool,
    rollAssignments,
    currentSheet,
    supabase,
    setCurrentSheet,
    loadDrafts,
  ]);

  const submitDowntimeSheet = useCallback(async () => {
    if (
      !selectedCharacter?.id ||
      !user?.id ||
      !selectedYear ||
      !selectedSemester
    ) {
      alert("Missing required information to submit.");
      return;
    }

    if (dicePool.length === 0) {
      alert("Please roll dice before submitting.");
      return;
    }

    const hasActivities = formData.activities.some(
      (activity) => activity.activity
    );
    if (!hasActivities) {
      alert("Please select at least one activity.");
      return;
    }

    setIsSubmitting(true);
    const isResubmission =
      currentSheet && currentSheet.review_status === "failure";

    try {
      const submissionData = {
        character_id: selectedCharacter.id,
        user_id: user.id,
        character_name: selectedCharacter.name,
        year: selectedYear,
        semester: selectedSemester,
        activities: formData.activities,
        relationships: formData.relationships,
        dice_pool: dicePool,
        roll_assignments: rollAssignments,
        selected_magic_school: formData.selectedMagicSchool || null,
        is_draft: false,

        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...(isResubmission
          ? {
              review_status: "pending",
            }
          : {}),
      };

      if (currentSheet?.id) {
        const { error } = await supabase
          .from("character_downtime")
          .update(submissionData)
          .eq("id", currentSheet.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("character_downtime")
          .insert([submissionData]);

        if (error) throw error;
      }

      alert("Downtime sheet submitted successfully!");
      if (loadSubmittedSheets) loadSubmittedSheets();
      if (loadDrafts) loadDrafts();
      if (setActiveTab) setActiveTab("overview");
    } catch (err) {
      console.error("Error submitting downtime sheet:", err);
      alert("Failed to submit downtime sheet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedCharacter,
    user,
    selectedYear,
    selectedSemester,
    formData,
    dicePool,
    rollAssignments,
    currentSheet,
    supabase,
    loadSubmittedSheets,
    loadDrafts,
    setActiveTab,
  ]);

  return (
    <div style={styles.container}>
      {diceManager.component}
      {dicePool.length > 0 && (
        <div style={styles.section}>
          {dicePool.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                🎓 School of Magic Advancement
              </h2>
              <div style={styles.activityCard}>
                <div style={{ marginBottom: "1rem" }}>
                  <p
                    style={{
                      color: theme.text,
                      fontSize: "0.875rem",
                      lineHeight: "1.5",
                      marginBottom: "1rem",
                    }}
                  >
                    Choose one school of magic to improve by +1 during this
                    downtime period. This represents focused study and practice
                    in that magical discipline.
                  </p>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Select School of Magic</label>
                    <select
                      style={styles.select}
                      value={formData.selectedMagicSchool || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          selectedMagicSchool: e.target.value,
                        }))
                      }
                      disabled={!editable}
                    >
                      <option value="">Choose a school of magic...</option>
                      <option value="divinations">
                        Divinations (Wisdom-based)
                      </option>
                      <option value="charms">Charms (Dexterity-based)</option>
                      <option value="transfiguration">
                        Transfiguration (Strength-based)
                      </option>
                      <option value="healing">
                        Healing (Intelligence-based)
                      </option>
                      <option value="jinxesHexesCurses">
                        Jinxes, Hexes, and Curses (Charisma-based)
                      </option>
                    </select>
                  </div>

                  {formData.selectedMagicSchool && (
                    <div
                      style={{
                        padding: "1rem",
                        backgroundColor: theme.primary + "15",
                        border: `1px solid ${theme.primary}`,
                        borderRadius: "6px",
                        marginTop: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: theme.text,
                          fontWeight: "600",
                        }}
                      >
                        ✨ Selected:{" "}
                        {formData.selectedMagicSchool === "jinxesHexesCurses"
                          ? "JHC"
                          : formData.selectedMagicSchool
                              .charAt(0)
                              .toUpperCase() +
                            formData.selectedMagicSchool.slice(1)}{" "}
                        +1
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: theme.textSecondary,
                          marginTop: "0.25rem",
                        }}
                      >
                        Once your downtime is approved you will need to modify
                        your wand value manually.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <h2 style={styles.sectionTitle}>⚡ Activities</h2>

          {formData.activities.map((activity, index) => {
            const assignmentKey = `activity${index + 1}`;
            const assignment = rollAssignments[assignmentKey] || {};
            const activityDescription = getActivityDescription(
              activity.activity
            );

            return (
              <div key={index} style={styles.activityCard}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ color: theme.text, margin: 0 }}>
                    Activity {index + 1}
                  </h3>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Activity Type</label>
                    <select
                      style={styles.select}
                      value={activity.activity || ""}
                      onChange={(e) =>
                        updateActivity(index, "activity", e.target.value)
                      }
                      disabled={!editable}
                    >
                      <option value="">Select Activity</option>
                      {Object.entries(downtime).map(
                        ([categoryKey, categoryInfo]) => {
                          return categoryInfo.activities.map(
                            (activityName, actIndex) => (
                              <option
                                key={`${categoryKey}-${actIndex}`}
                                value={activityName}
                              >
                                {activityName.split(" - ")[0]}
                              </option>
                            )
                          );
                        }
                      )}
                    </select>
                  </div>

                  {!activityRequiresDualChecks(activity.activity) &&
                    activity.activity &&
                    !activityRequiresNoDiceRoll(activity.activity) &&
                    !shouldUseCustomDiceForActivity(activity.activity) && (
                      <SkillSelector
                        activityText={activity.activity}
                        assignment={assignment}
                        isSecondSkill={false}
                        onChange={(value) =>
                          updateRollAssignment(index, "skill", value)
                        }
                        canEdit={() => editable}
                        selectedCharacter={selectedCharacter}
                      />
                    )}

                  {activityRequiresDualChecks(activity.activity) && (
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Dual Check Activity</label>
                      <div
                        style={{
                          paddingTop: "10px",
                          backgroundColor: theme.primary + "20",
                          border: `1px solid ${theme.primary}`,
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: theme.primary,
                          fontWeight: "600",
                          height: "42px",
                          textAlign: "center",
                        }}
                      >
                        Requires Two Skill Checks
                      </div>
                    </div>
                  )}
                </div>

                {activityDescription && (
                  <div style={styles.activityDescription}>
                    <strong>Description:</strong>
                    <br />
                    {activityDescription}
                  </div>
                )}

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Notes</label>
                  <textarea
                    style={styles.textarea}
                    placeholder="Activity notes and details..."
                    value={assignment.notes || ""}
                    onChange={(e) =>
                      updateRollAssignment(index, "notes", e.target.value)
                    }
                    disabled={!editable}
                  />
                </div>

                {activity.activity &&
                  renderSpecialActivityInfo(activity.activity)}

                {activity.activity &&
                  renderDiceAssignment(activity, index, assignment)}
              </div>
            );
          })}
        </div>
      )}

      {dicePool.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🤝 NPC Relationships</h2>

          {(formData.relationships || []).map((relationship, index) => {
            const assignmentKey = `relationship${index + 1}`;
            const assignment = rollAssignments[assignmentKey] || {};

            return (
              <div key={index} style={styles.activityCard}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ color: theme.text, margin: 0 }}>
                    Relationship {index + 1}
                  </h3>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>NPC Name</label>
                    <input
                      style={styles.input}
                      type="text"
                      value={relationship.npcName || ""}
                      onChange={(e) =>
                        updateRelationship(index, "npcName", e.target.value)
                      }
                      placeholder="Enter NPC name..."
                      disabled={!canEdit()}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Skill</label>
                    <select
                      style={styles.select}
                      value={assignment.skill || ""}
                      onChange={(e) =>
                        updateRelationshipAssignment(
                          assignmentKey,
                          "skill",
                          e.target.value
                        )
                      }
                      disabled={!canEdit()}
                    >
                      <option value="">Select Skill</option>
                      <option value="insight">
                        Insight (
                        {formatModifierValue(getModifierValue("insight"))})
                      </option>
                      <option value="persuasion">
                        Persuasion (
                        {formatModifierValue(getModifierValue("persuasion"))})
                      </option>
                    </select>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Assigned Die</label>
                    <select
                      style={styles.select}
                      value={
                        assignment.diceIndex !== null
                          ? assignment.diceIndex
                          : ""
                      }
                      onChange={(e) =>
                        diceManager.functions.assignRelationshipDice(
                          index,
                          parseInt(e.target.value)
                        )
                      }
                      disabled={!canEdit()}
                    >
                      <option value="">Select die...</option>
                      {diceManager.functions.getSortedDiceOptions
                        .filter(
                          ({ index: diceIndex }) =>
                            !diceManager.functions.isDiceAssigned(diceIndex) ||
                            diceIndex === assignment.diceIndex
                        )
                        .map(({ value, index: diceIndex }) => (
                          <option key={diceIndex} value={diceIndex}>
                            {value}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {assignment.diceIndex !== null && assignment.skill && (
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Roll Result</label>
                    <div style={styles.assignedDice}>
                      <div style={styles.diceValue}>
                        {dicePool[assignment.diceIndex] +
                          getModifierValue(assignment.skill)}
                      </div>
                      <div style={styles.total}>
                        Total: {dicePool[assignment.diceIndex]}{" "}
                        {formatModifierValue(
                          getModifierValue(assignment.skill)
                        )}{" "}
                        ={" "}
                        {dicePool[assignment.diceIndex] +
                          getModifierValue(assignment.skill)}
                      </div>
                    </div>
                  </div>
                )}

                {isUserAdmin && adminMode && (
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Admin Notes</label>
                    <textarea
                      style={styles.textarea}
                      value={assignment.adminNotes || ""}
                      onChange={(e) =>
                        updateRelationshipAssignment(
                          assignmentKey,
                          "adminNotes",
                          e.target.value
                        )
                      }
                      placeholder="Admin notes about this relationship interaction..."
                      rows={2}
                    />
                  </div>
                )}

                {assignment.result && (
                  <div
                    style={{
                      padding: "12px",
                      marginTop: "12px",
                      backgroundColor:
                        assignment.result === "success"
                          ? `${theme.success}15`
                          : `${theme.error}15`,
                      border: `1px solid ${
                        assignment.result === "success"
                          ? theme.success
                          : theme.error
                      }`,
                      borderRadius: "6px",
                      fontSize: "14px",
                      color:
                        assignment.result === "success"
                          ? theme.success
                          : theme.error,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {dicePool.length > 0 && editable && (
        <div style={styles.actionButtons}>
          <button
            onClick={saveAsDraft}
            disabled={isSavingDraft}
            style={{
              ...styles.button,
              ...styles.secondaryButton,
              ...(isSavingDraft ? { opacity: 0.6, cursor: "not-allowed" } : {}),
            }}
          >
            {isSavingDraft ? "Saving..." : "Save as Draft"}
          </button>

          <button
            onClick={submitDowntimeSheet}
            disabled={isSubmitting}
            style={{
              ...styles.button,
              ...styles.successButton,
              ...(isSubmitting ? { opacity: 0.6, cursor: "not-allowed" } : {}),
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Downtime Sheet"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DowntimeForm;
