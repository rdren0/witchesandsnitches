import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getAllActivities, wandModifiers } from "../SharedData/downtime";
import { allSkills } from "../SharedData/data";
import { formatModifier, modifiers } from "../CharacterSheet/utils";
import {
  calculateModifier,
  activityRequiresDualChecks,
} from "./downtimeHelpers";
import SkillSelector from "./SkillSelector";

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
      },
      activity2: {
        diceIndex: null,
        skill: "",
        wandModifier: "",
        notes: "",
        secondDiceIndex: null,
        secondSkill: "",
        secondWandModifier: "",
      },
      activity3: {
        diceIndex: null,
        skill: "",
        wandModifier: "",
        notes: "",
        secondDiceIndex: null,
        secondSkill: "",
        secondWandModifier: "",
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
      selectedMagicSchool: "",
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Count activities requiring dual checks and extra dice logic
  const dualCheckActivities = useMemo(() => {
    return formData.activities.filter((activity) =>
      activityRequiresDualChecks(activity.activity)
    );
  }, [formData.activities]);

  const extraDiceCount = useMemo(() => {
    return Math.max(0, dicePool.length - 6);
  }, [dicePool.length]);

  const shouldDisableExtraDie = useMemo(() => {
    return extraDiceCount >= dualCheckActivities.length;
  }, [extraDiceCount, dualCheckActivities.length]);

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
      setFormData(initialFormData);
    }
  }, [initialFormData, hasInitialized]);

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
      return calculateModifier(modifierName, selectedCharacter);
    },
    [selectedCharacter]
  );

  const rollDice = useCallback(() => {
    if (!canEdit()) return;

    const newPool = Array.from(
      { length: 6 },
      () => Math.floor(Math.random() * 20) + 1
    );
    setDicePool(newPool);

    setRollAssignments((prev) => {
      const resetAssignments = {};
      Object.keys(prev).forEach((key) => {
        resetAssignments[key] = {
          ...prev[key],
          diceIndex: null,
          secondDiceIndex: null,
        };
      });
      return resetAssignments;
    });
  }, []);

  const addExtraDie = useCallback(() => {
    if (!canEdit()) return;

    const extraDie = Math.floor(Math.random() * 20) + 1;
    setDicePool((prev) => [...prev, extraDie]);
  }, []);

  const canEdit = useCallback(() => {
    if (isUserAdmin) return true;
    if (!currentSheet) return true;
    if (currentSheet.is_draft) return currentSheet.user_id === user?.id;
    return false;
  }, [isUserAdmin, currentSheet, user?.id]);

  const isDiceAssigned = useCallback(
    (diceIndex) => {
      for (const assignment of Object.values(rollAssignments)) {
        if (
          assignment.diceIndex === diceIndex ||
          assignment.secondDiceIndex === diceIndex
        ) {
          return true;
        }
      }
      return false;
    },
    [rollAssignments]
  );

  const assignDice = useCallback(
    (activityIndex, diceIndex, isSecondDie = false) => {
      if (!canEdit()) return;

      const assignmentKey = `activity${activityIndex + 1}`;
      setRollAssignments((prev) => ({
        ...prev,
        [assignmentKey]: {
          ...prev[assignmentKey],
          [isSecondDie ? "secondDiceIndex" : "diceIndex"]: diceIndex,
        },
      }));
    },
    [canEdit]
  );

  const unassignDice = useCallback(
    (activityIndex, isSecondDie = false) => {
      if (!canEdit()) return;

      const assignmentKey = `activity${activityIndex + 1}`;
      setRollAssignments((prev) => ({
        ...prev,
        [assignmentKey]: {
          ...prev[assignmentKey],
          [isSecondDie ? "secondDiceIndex" : "diceIndex"]: null,
        },
      }));
    },
    [canEdit]
  );

  const updateActivity = useCallback(
    (index, field, value) => {
      if (!canEdit()) return;

      setFormData((prev) => ({
        ...prev,
        activities: prev.activities.map((activity, i) =>
          i === index ? { ...activity, [field]: value } : activity
        ),
      }));
    },
    [canEdit]
  );

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

  const getSortedDiceOptions = useMemo(() => {
    return dicePool
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value);
  }, [dicePool]);

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
      alert("Failed to save draft. Please try again.");
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
    try {
      const submissionData = {
        character_id: selectedCharacter.id,
        user_id: user.id,
        character_name: selectedCharacter.name,
        year: selectedYear,
        semester: selectedSemester,
        activities: formData.activities,
        dice_pool: dicePool,
        roll_assignments: rollAssignments,
        selected_magic_school: formData.selectedMagicSchool || null,
        is_draft: false,
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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

  const styles = {
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
    diceGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
      gap: "0.75rem",
      marginBottom: "1rem",
    },
    dice: {
      padding: "1rem",
      textAlign: "center",
      borderRadius: "8px",
      fontSize: "1.25rem",
      fontWeight: "bold",
      border: "2px solid",
      transition: "all 0.2s ease",
    },
    diceAvailable: {
      backgroundColor: theme.success + "20",
      borderColor: theme.success,
      color: theme.success,
    },
    diceAssigned: {
      backgroundColor: theme.error + "20",
      borderColor: theme.error,
      color: theme.error,
      opacity: 0.7,
    },
    diceExtra: {
      backgroundColor: theme.warning + "20",
      borderColor: theme.warning,
      color: theme.warning,
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem",
      marginBottom: "1rem",
    },
    button: {
      padding: "0.75rem 1.5rem",
      borderRadius: "8px",
      border: "none",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    primaryButton: {
      backgroundColor: theme.primary,
      color: "white",
    },
    secondaryButton: {
      backgroundColor: theme.warning,
      color: "white",
    },
    successButton: {
      backgroundColor: theme.success,
      color: "white",
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
    extraDieButton: {
      padding: "0.5rem 1rem",
      fontSize: "0.875rem",
      fontWeight: "600",
      backgroundColor: theme.warning,
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
    },
    actionButtons: {
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
      paddingTop: "1rem",
    },
  };

  const editable = canEdit();

  return (
    <div style={styles.container}>
      {/* Dice Pool Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎲 Dice Pool</h2>

        <div style={styles.buttonGroup}>
          <button
            onClick={rollDice}
            disabled={!editable}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              ...(!editable ? { opacity: 0.6, cursor: "not-allowed" } : {}),
            }}
          >
            {dicePool.length === 0 ? "Roll Dice Pool" : "Reroll Dice"}
          </button>

          {/* Only show general Add Extra Die if no activities require dual checks */}
          {dicePool.length > 0 &&
            !formData.activities.some((activity) =>
              activityRequiresDualChecks(activity.activity)
            ) && (
              <button
                onClick={addExtraDie}
                disabled={!editable}
                style={{
                  ...styles.button,
                  ...styles.secondaryButton,
                  ...(!editable ? { opacity: 0.6, cursor: "not-allowed" } : {}),
                }}
              >
                Add Extra Die
              </button>
            )}
        </div>

        {dicePool.length > 0 ? (
          <>
            <div style={styles.diceGrid}>
              {getSortedDiceOptions.map(({ value, index }) => {
                const isAssigned = isDiceAssigned(index);
                const isExtra = index >= 6;

                return (
                  <div
                    key={index}
                    style={{
                      ...styles.dice,
                      ...(isAssigned
                        ? styles.diceAssigned
                        : isExtra
                        ? styles.diceExtra
                        : styles.diceAvailable),
                    }}
                  >
                    {value}
                    {isExtra && <span style={{ fontSize: "0.75rem" }}>★</span>}
                  </div>
                );
              })}
            </div>

            <div style={{ color: theme.textSecondary, fontSize: "0.875rem" }}>
              Total: {dicePool.length} dice | Available:{" "}
              {dicePool.filter((_, index) => !isDiceAssigned(index)).length} |
              Assigned:{" "}
              {dicePool.filter((_, index) => isDiceAssigned(index)).length}
            </div>
          </>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: theme.textSecondary,
              backgroundColor: theme.background,
              borderRadius: "8px",
              border: `1px solid ${theme.border}`,
            }}
          >
            Click "Roll Dice Pool" to generate your 6 dice for this downtime
            session
          </div>
        )}
      </div>

      {/* Activities Section */}
      {dicePool.length > 0 && (
        <div style={styles.section}>
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

                  {/* Add Extra Die button for dual check activities */}
                  {activityRequiresDualChecks(activity.activity) &&
                    editable && (
                      <button
                        onClick={addExtraDie}
                        disabled={shouldDisableExtraDie}
                        style={{
                          ...styles.extraDieButton,
                          ...(shouldDisableExtraDie
                            ? {
                                opacity: 0.5,
                                cursor: "not-allowed",
                                backgroundColor: theme.textSecondary,
                              }
                            : {}),
                        }}
                        title={
                          shouldDisableExtraDie
                            ? `Maximum extra dice reached (${extraDiceCount}/${dualCheckActivities.length})`
                            : "Add an extra die for this dual check activity"
                        }
                      >
                        + Extra Die{" "}
                        {dualCheckActivities.length > 0 &&
                          `(${extraDiceCount}/${dualCheckActivities.length})`}
                      </button>
                    )}
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
                      {availableActivities.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Skill Selector - only show here for single check activities */}
                  {!activityRequiresDualChecks(activity.activity) && (
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

                  {/* Placeholder for dual check activities */}
                  {activityRequiresDualChecks(activity.activity) && (
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Dual Check Activity</label>
                      <div
                        style={{
                          padding: "8px 12px",
                          backgroundColor: theme.primary + "20",
                          border: `1px solid ${theme.primary}`,
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: theme.primary,
                          fontWeight: "600",
                        }}
                      >
                        Requires Two Skill Checks
                      </div>
                    </div>
                  )}
                </div>

                {/* Activity Description */}
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

                {/* Dual Check Layout */}
                {activityRequiresDualChecks(activity.activity) ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    {/* First Skill/Die Pair */}
                    <div>
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

                      <div style={{ marginTop: "0.5rem" }}>
                        <label style={styles.label}>Primary Die</label>
                        {assignment.diceIndex !== null &&
                        assignment.diceIndex !== undefined ? (
                          <div style={styles.assignedDice}>
                            <div style={styles.diceValue}>
                              {dicePool[assignment.diceIndex]}
                            </div>
                            {assignment.skill && (
                              <div style={styles.total}>
                                Total: {dicePool[assignment.diceIndex]}{" "}
                                {formatModifier(
                                  getModifierValue(assignment.skill)
                                )}{" "}
                                ={" "}
                                {dicePool[assignment.diceIndex] +
                                  getModifierValue(assignment.skill)}
                              </div>
                            )}
                            {editable && (
                              <button
                                style={styles.removeButton}
                                onClick={() => unassignDice(index, false)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ) : (
                          <select
                            style={styles.select}
                            value=""
                            onChange={(e) =>
                              assignDice(index, parseInt(e.target.value), false)
                            }
                            disabled={!editable}
                          >
                            <option value="">Select die...</option>
                            {getSortedDiceOptions
                              .filter(
                                ({ index: diceIndex }) =>
                                  !isDiceAssigned(diceIndex)
                              )
                              .map(({ value, index: diceIndex }) => (
                                <option key={diceIndex} value={diceIndex}>
                                  {value}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    </div>

                    {/* Second Skill/Die Pair */}
                    <div>
                      <SkillSelector
                        activityText={activity.activity}
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
                        {assignment.secondDiceIndex !== null &&
                        assignment.secondDiceIndex !== undefined ? (
                          <div style={styles.assignedDice}>
                            <div style={styles.diceValue}>
                              {dicePool[assignment.secondDiceIndex]}
                            </div>
                            {(assignment.skill || assignment.secondSkill) && (
                              <div style={styles.total}>
                                Total: {dicePool[assignment.secondDiceIndex]}{" "}
                                {formatModifier(
                                  getModifierValue(
                                    assignment.secondSkill || assignment.skill
                                  )
                                )}{" "}
                                ={" "}
                                {dicePool[assignment.secondDiceIndex] +
                                  getModifierValue(
                                    assignment.secondSkill || assignment.skill
                                  )}
                              </div>
                            )}
                            {editable && (
                              <button
                                style={styles.removeButton}
                                onClick={() => unassignDice(index, true)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ) : (
                          <select
                            style={styles.select}
                            value=""
                            onChange={(e) =>
                              assignDice(index, parseInt(e.target.value), true)
                            }
                            disabled={!editable}
                          >
                            <option value="">Select die...</option>
                            {getSortedDiceOptions
                              .filter(
                                ({ index: diceIndex }) =>
                                  !isDiceAssigned(diceIndex)
                              )
                              .map(({ value, index: diceIndex }) => (
                                <option key={diceIndex} value={diceIndex}>
                                  {value}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Single Check Layout */
                  <div style={styles.diceAssignment}>
                    <div>
                      <label style={styles.label}>Primary Die</label>
                      {assignment.diceIndex !== null &&
                      assignment.diceIndex !== undefined ? (
                        <div style={styles.assignedDice}>
                          <div style={styles.diceValue}>
                            {dicePool[assignment.diceIndex]}
                          </div>
                          {assignment.skill && (
                            <div style={styles.total}>
                              Total: {dicePool[assignment.diceIndex]}{" "}
                              {formatModifier(
                                getModifierValue(assignment.skill)
                              )}{" "}
                              ={" "}
                              {dicePool[assignment.diceIndex] +
                                getModifierValue(assignment.skill)}
                            </div>
                          )}
                          {editable && (
                            <button
                              style={styles.removeButton}
                              onClick={() => unassignDice(index, false)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ) : (
                        <select
                          style={styles.select}
                          value=""
                          onChange={(e) =>
                            assignDice(index, parseInt(e.target.value), false)
                          }
                          disabled={!editable}
                        >
                          <option value="">Select die...</option>
                          {getSortedDiceOptions
                            .filter(
                              ({ index: diceIndex }) =>
                                !isDiceAssigned(diceIndex)
                            )
                            .map(({ value, index: diceIndex }) => (
                              <option key={diceIndex} value={diceIndex}>
                                {value}
                              </option>
                            ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
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
