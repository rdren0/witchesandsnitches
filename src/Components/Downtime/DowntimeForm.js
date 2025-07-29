import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { downtime, classes } from "../../SharedData/downtime";
import { downtimeStyles } from "./styles";
import DicePoolManager from "./DicePoolManager";
import SkillSelector from "./SkillSelector";
import SpellSelector from "./SpellSelector";
import WandModifierSelector from "./WandModifierSelector";

import {
  validateStudyActivities,
  validateWandStatIncreaseActivities,
  validateSpellActivities,
  isStudyActivity,
  validateAbilityScoreIncreaseActivities,
} from "./utils/validationUtils";

import {
  loadSpellProgress,
  updateSpellProgressOnSubmission,
} from "./utils/spellUtils";

import {
  activityRequiresMakeSpellInterface,
  getActivityDescription,
  getCheckDescription,
  getAvailableActivities,
} from "./utils/activityUtils";

import { getModifierValue, formatModifier } from "./utils/modifierUtils";

import {
  renderDiceValue,
  renderSpecialActivityInfo,
  renderMakeSpellActivity,
  renderDiceAssignment,
} from "./utils/renderUtils";

import { saveAsDraft, submitDowntimeSheet } from "./utils/databaseUtils";

import {
  activityRequiresDualChecks,
  activityRequiresWandSelection,
  activityRequiresSpellSelection,
  activityRequiresNoDiceRoll,
  shouldUseCustomDiceForActivity,
  isDistinctCheckActivity,
  getDistinctCheckActivityInfo,
  calculateDistinctCheckProgress,
  getAvailableCheckTypes,
  getSkillOptionsForCheck,
  calculateModifier,
  activityRequiresAbilitySelection,
  getAvailableAbilityScores,
  getAbilityScoreModifier,
  calculateAbilityScoreIncreaseDC,
} from "./downtimeHelpers";
import NPCAutocompleteInput from "./NPCAutocompleteInput";

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
  const styles = useMemo(() => downtimeStyles(theme), [theme]);
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
        familyType: null,
        firstSpellDice: null,
        secondSpellDice: null,
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
        familyType: null,
        firstSpellDice: null,
        secondSpellDice: null,
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
        familyType: null,
        firstSpellDice: null,
        secondSpellDice: null,
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
          selectedClass: "",
          selectedWandModifier: "",
          successes: [false, false, false, false, false],
          selectedAbilityScore: "",
          recipeName: "",
          selectedCheckType: "",
          selectedCheckSkill: "",
          completedChecks: [],
        },
        {
          activity: "",
          selectedClass: "",
          selectedWandModifier: "",
          successes: [false, false, false, false, false],
          selectedAbilityScore: "",
          recipeName: "",
          selectedCheckType: "",
          selectedCheckSkill: "",
          completedChecks: [],
        },
        {
          activity: "",
          selectedClass: "",
          selectedWandModifier: "",
          successes: [false, false, false, false, false],
          selectedAbilityScore: "",
          recipeName: "",
          selectedCheckType: "",
          selectedCheckSkill: "",
          completedChecks: [],
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
  const [selectedSpells, setSelectedSpells] = useState({
    activity1: { first: "", second: "" },
    activity2: { first: "", second: "" },
    activity3: { first: "", second: "" },
  });
  const [spellAttempts, setSpellAttempts] = useState({});
  const [researchedSpells, setResearchedSpells] = useState({});
  const [failedAttempts, setFailedAttempts] = useState({});

  const availableActivities = useMemo(() => getAvailableActivities(), []);
  const selectRef = useRef(null);

  useEffect(() => {
    if (selectedCharacter && user) {
      loadSpellProgress(selectedCharacter, user, supabase).then(
        ({ attempts, researched, failed }) => {
          setSpellAttempts(attempts);
          setResearchedSpells(researched);
          setFailedAttempts(failed);
        }
      );
    }
  }, [selectedCharacter, user, supabase]);

  useEffect(() => {
    if (initialFormData && !hasInitialized) {
      if (initialFormData.activities) {
        setFormData({
          ...initialFormData,
          relationships: initialFormData.relationships || [
            { npcName: "", notes: "" },
            { npcName: "", notes: "" },
            { npcName: "", notes: "" },
          ],
        });
      }

      if (initialFormData.selectedSpells) {
        const spellsToLoad = initialFormData.selectedSpells;
        const validatedSpells = {
          activity1: {
            first: spellsToLoad.activity1?.first || "",
            second: spellsToLoad.activity1?.second || "",
          },
          activity2: {
            first: spellsToLoad.activity2?.first || "",
            second: spellsToLoad.activity2?.second || "",
          },
          activity3: {
            first: spellsToLoad.activity3?.first || "",
            second: spellsToLoad.activity3?.second || "",
          },
        };
        setSelectedSpells(validatedSpells);
      }

      setHasInitialized(true);
    }
  }, [initialFormData, hasInitialized]);

  useEffect(() => {
    if (currentSheet?.selected_spells && hasInitialized) {
      const currentSheetSpells = currentSheet.selected_spells;
      const currentState = JSON.stringify(selectedSpells);
      const newState = JSON.stringify(currentSheetSpells);

      if (currentState !== newState) {
        const updatedSpells = {
          activity1: {
            first: currentSheetSpells.activity1?.first || "",
            second: currentSheetSpells.activity1?.second || "",
          },
          activity2: {
            first: currentSheetSpells.activity2?.first || "",
            second: currentSheetSpells.activity2?.second || "",
          },
          activity3: {
            first: currentSheetSpells.activity3?.first || "",
            second: currentSheetSpells.activity3?.second || "",
          },
        };
        setSelectedSpells(updatedSpells);
      }
    }
  }, [currentSheet?.selected_spells, hasInitialized, selectedSpells]);

  useEffect(() => {
    if (initialDicePool && initialDicePool.length > 0 && !hasInitialized) {
      setDicePool(initialDicePool);
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
    setHasInitialized(false);
  }, [currentSheet?.id]);

  const canEdit = useCallback(() => {
    if (isUserAdmin && adminMode) return true;

    if (!currentSheet) return true;
    if (currentSheet.is_draft) return currentSheet.user_id === user?.id;
    if (currentSheet.review_status === "failure")
      return currentSheet.user_id === user?.id;
    return false;
  }, [isUserAdmin, adminMode, currentSheet, user?.id]);
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

  const handleSpellSelect = useCallback(
    (activityIndex, spellSlot, spellName) => {
      if (!canEdit()) return;

      const activityKey = `activity${activityIndex + 1}`;
      setSelectedSpells((prev) => {
        const newState = {
          ...prev,
          [activityKey]: {
            ...prev[activityKey],
            [spellSlot]: spellName,
          },
        };
        return newState;
      });
    },
    [canEdit]
  );

  const handleSpellDiceAssign = useCallback(
    (activityIndex, spellSlot, diceIndex) => {
      if (!canEdit()) return;

      const activityKey = `activity${activityIndex + 1}`;
      const diceField =
        spellSlot === "first" ? "firstSpellDice" : "secondSpellDice";

      setRollAssignments((prev) => {
        const newState = {
          ...prev,
          [activityKey]: {
            ...prev[activityKey],
            [diceField]: diceIndex,
          },
        };
        return newState;
      });
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

      const wasWandIncrease = activityRequiresWandSelection(previousActivity);
      const willBeWandIncrease =
        field === "activity"
          ? activityRequiresWandSelection(value)
          : wasWandIncrease;

      const wasDistinctCheck = isDistinctCheckActivity(previousActivity);
      const willBeDistinctCheck =
        field === "activity"
          ? isDistinctCheckActivity(value)
          : wasDistinctCheck;

      setFormData((prev) => ({
        ...prev,
        activities: prev.activities.map((activity, i) =>
          i === index ? { ...activity, [field]: value } : activity
        ),
      }));

      const activityKey = `activity${index + 1}`;
      const assignment = rollAssignments[activityKey];

      if (field === "activity") {
        if (wasWandIncrease && !willBeWandIncrease) {
          setFormData((prev) => ({
            ...prev,
            activities: prev.activities.map((activity, i) =>
              i === index ? { ...activity, selectedWandModifier: "" } : activity
            ),
          }));
        }

        if (wasDistinctCheck && !willBeDistinctCheck) {
          setFormData((prev) => ({
            ...prev,
            activities: prev.activities.map((activity, i) =>
              i === index
                ? {
                    ...activity,
                    recipeName: "",
                    selectedCheckType: "",
                    selectedCheckSkill: "",
                    completedChecks: [],
                  }
                : activity
            ),
          }));
        }

        if (!wasDistinctCheck && willBeDistinctCheck) {
          setFormData((prev) => ({
            ...prev,
            activities: prev.activities.map((activity, i) =>
              i === index
                ? {
                    ...activity,
                    recipeName: "",
                    selectedCheckType: "",
                    selectedCheckSkill: "",
                    completedChecks: [],
                  }
                : activity
            ),
          }));
        }

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
              familyType: null,
              firstSpellDice: null,
              secondSpellDice: null,
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
              familyType: null,
              firstSpellDice: null,
              secondSpellDice: null,
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
              familyType: null,
              firstSpellDice: null,
              secondSpellDice: null,
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
            familyType: null,
            firstSpellDice: null,
            secondSpellDice: null,
          },
        }));

        const wasSpellActivity =
          activityRequiresSpellSelection(previousActivity);
        if (wasSpellActivity) {
          setSelectedSpells((prev) => ({
            ...prev,
            [activityKey]: { first: "", second: "" },
          }));
        }
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

  const handleSaveAsDraft = useCallback(async () => {
    setIsSavingDraft(true);
    await saveAsDraft({
      selectedCharacter,
      user,
      selectedYear,
      selectedSemester,
      formData,
      dicePool,
      rollAssignments,
      selectedSpells,
      currentSheet,
      supabase,
      setCurrentSheet,
      loadDrafts,
    });
    setIsSavingDraft(false);
  }, [
    selectedCharacter,
    user,
    selectedYear,
    selectedSemester,
    formData,
    dicePool,
    rollAssignments,
    selectedSpells,
    currentSheet,
    supabase,
    setCurrentSheet,
    loadDrafts,
  ]);

  const handleSubmitDowntimeSheet = useCallback(async () => {
    if (!validateStudyActivities(formData.activities)) {
      return;
    }

    if (
      !validateAbilityScoreIncreaseActivities(
        formData.activities,
        selectedCharacter
      )
    ) {
      return;
    }

    if (
      !validateWandStatIncreaseActivities(
        formData.activities,
        selectedCharacter
      )
    ) {
      return;
    }

    if (
      !validateSpellActivities(
        formData.activities,
        rollAssignments,
        selectedSpells,
        spellAttempts,
        researchedSpells,
        failedAttempts
      )
    ) {
      return;
    }

    setIsSubmitting(true);

    const updateSpellProgress = () =>
      updateSpellProgressOnSubmission(
        formData,
        rollAssignments,
        selectedSpells,
        dicePool,
        selectedCharacter,
        user,
        supabase
      );

    await submitDowntimeSheet({
      selectedCharacter,
      user,
      selectedYear,
      selectedSemester,
      formData,
      dicePool,
      rollAssignments,
      selectedSpells,
      currentSheet,
      supabase,
      updateSpellProgressOnSubmission: updateSpellProgress,
      loadSubmittedSheets,
      loadDrafts,
      setActiveTab,
    });

    setIsSubmitting(false);
  }, [
    formData,
    rollAssignments,
    selectedSpells,
    spellAttempts,
    researchedSpells,
    failedAttempts,
    selectedCharacter,
    user,
    selectedYear,
    selectedSemester,
    dicePool,
    currentSheet,
    supabase,
    loadSubmittedSheets,
    loadDrafts,
    setActiveTab,
  ]);

  const validateMagicSchoolSelection = (
    selectedMagicSchool,
    selectedCharacter
  ) => {
    if (!selectedMagicSchool) return { valid: true };

    const currentValue =
      selectedCharacter?.magicModifiers?.[selectedMagicSchool] ||
      selectedCharacter?.magic_modifiers?.[selectedMagicSchool] ||
      0;

    if (currentValue >= 5) {
      return {
        valid: false,
        message: "This school of magic is already at maximum (+5).",
      };
    }
    return true;
  };

  const getMagicSchoolOptions = (selectedCharacter) => {
    const schools = [
      { value: "divinations", name: "Divinations", ability: "Wisdom" },
      { value: "charms", name: "Charms", ability: "Dexterity" },
      {
        value: "transfiguration",
        name: "Transfiguration",
        ability: "Strength",
      },
      { value: "healing", name: "Healing", ability: "Intelligence" },
      {
        value: "jinxesHexesCurses",
        name: "Jinxes, Hexes, and Curses",
        ability: "Charisma",
      },
    ];

    return schools.map((school) => {
      const currentValue =
        selectedCharacter?.magicModifiers?.[school.value] ||
        selectedCharacter?.magic_modifiers?.[school.value] ||
        0;
      const isAtMaximum = currentValue >= 5;

      return {
        ...school,
        currentValue,
        isAtMaximum,
        displayText: `${school.name} - (Current: ${formatModifier(
          currentValue
        )}${isAtMaximum ? " (MAX)" : ""})`,
      };
    });
  };

  const scrollToSelectedOption = () => {
    const selectElement = selectRef.current;
    if (!selectElement) return;

    const selectedIndex = selectElement.selectedIndex;
    const selectedOption = selectElement.options[selectedIndex];

    if (selectedOption) {
      selectedOption.scrollIntoView({
        block: "start",
        inline: "nearest",
      });
    }
  };

  const renderMakeRecipeActivity = (activity, index) => {
    const info = getDistinctCheckActivityInfo(activity.activity);
    if (!info) return null;

    const progress = calculateDistinctCheckProgress(null, activity);
    const availableChecks = getAvailableCheckTypes(activity);
    const skillOptions = activity.selectedCheckType
      ? getSkillOptionsForCheck(activity, activity.selectedCheckType)
      : [];

    return (
      <div style={styles.makeRecipeContainer}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Recipe Name</label>
          <input
            type="text"
            value={activity.recipeName || ""}
            onChange={(e) =>
              updateActivity(index, "recipeName", e.target.value)
            }
            placeholder="Enter the name of your new recipe..."
            style={styles.input}
            disabled={!canEdit()}
          />
        </div>

        <div style={styles.progressContainer}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Recipe Progress:</span>
            <span style={styles.progressText}>
              {progress?.progress || "0/3"}
            </span>
          </div>

          {progress?.completedChecks?.length > 0 && (
            <div style={styles.completedChecks}>
              <div style={styles.completedLabel}>✅ Completed Checks:</div>
              {progress.completedChecks.map((completed, idx) => (
                <div key={idx} style={styles.completedCheck}>
                  <strong>{completed.checkName}</strong> using{" "}
                  {completed.skillUsed}
                  (Rolled {completed.rollResult} vs DC {completed.dc})
                </div>
              ))}
            </div>
          )}
        </div>

        {!progress?.isComplete && (
          <div style={styles.checkSelection}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Select Check Type to Attempt:</label>
              <select
                value={activity.selectedCheckType || ""}
                onChange={(e) => {
                  updateActivity(index, "selectedCheckType", e.target.value);
                  updateActivity(index, "selectedCheckSkill", "");
                }}
                style={styles.select}
                disabled={!canEdit()}
              >
                <option value="">Choose a check type...</option>
                {availableChecks.map((check) => (
                  <option key={check.id} value={check.id}>
                    {check.name}
                  </option>
                ))}
              </select>
            </div>

            {activity.selectedCheckType && skillOptions.length > 0 && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Select Skill:</label>
                {skillOptions.length === 1 ? (
                  <div
                    style={{
                      ...styles.input,
                      backgroundColor: theme.background,
                      color: theme.textSecondary,
                      fontStyle: "italic",
                    }}
                  >
                    {(() => {
                      const skill = skillOptions[0];
                      const modifier = calculateModifier(
                        skill,
                        selectedCharacter
                      );
                      const modStr =
                        modifier >= 0 ? `+${modifier}` : `${modifier}`;

                      if (skill === "spellcastingAbility") {
                        const spellAbility =
                          selectedCharacter?.spellcastingAbility ||
                          "Intelligence";
                        return `${spellAbility} (Spellcasting Ability) (${modStr})`;
                      } else if (skill === "muggleStudies") {
                        return `Muggle Studies (${modStr})`;
                      } else if (skill === "historyOfMagic") {
                        return `History of Magic (${modStr})`;
                      } else {
                        return `${
                          skill.charAt(0).toUpperCase() + skill.slice(1)
                        } (${modStr})`;
                      }
                    })()}{" "}
                    - Auto-selected
                  </div>
                ) : (
                  <select
                    value={activity.selectedCheckSkill || ""}
                    onChange={(e) =>
                      updateActivity(
                        index,
                        "selectedCheckSkill",
                        e.target.value
                      )
                    }
                    style={styles.select}
                    disabled={!canEdit()}
                  >
                    <option value="">Choose a skill...</option>
                    {skillOptions.map((skill) => {
                      const modifier = calculateModifier(
                        skill,
                        selectedCharacter
                      );
                      const modStr =
                        modifier >= 0 ? `+${modifier}` : `${modifier}`;

                      let displayName;
                      if (skill === "muggleStudies") {
                        displayName = "Muggle Studies";
                      } else if (skill === "historyOfMagic") {
                        displayName = "History of Magic";
                      } else if (skill === "spellcastingAbility") {
                        const spellAbility =
                          selectedCharacter?.spellcastingAbility ||
                          "intelligence";
                        displayName = `${
                          spellAbility.charAt(0).toUpperCase() +
                          spellAbility.slice(1)
                        } (Spellcasting Ability)`;
                      } else {
                        displayName =
                          skill.charAt(0).toUpperCase() + skill.slice(1);
                      }

                      return (
                        <option key={skill} value={skill}>
                          {displayName} ({modStr})
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
            )}

            {activity.selectedCheckType && (
              <div style={styles.checkDescription}>
                {
                  info.config.requiredChecks.find(
                    (c) => c.id === activity.selectedCheckType
                  )?.description
                }
              </div>
            )}
          </div>
        )}

        {activity.selectedCheckType &&
          (activity.selectedCheckSkill || skillOptions.length === 1) &&
          !progress?.isComplete && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Assign Die for Check:</label>

              {(() => {
                const assignmentKey = `activity${index + 1}`;
                const assignment = rollAssignments[assignmentKey] || {};

                const effectiveSkill =
                  activity.selectedCheckSkill ||
                  (skillOptions.length === 1 ? skillOptions[0] : null);

                if (!effectiveSkill) return null;

                if (
                  assignment.diceIndex !== null &&
                  assignment.diceIndex !== undefined
                ) {
                  const diceValue =
                    Array.isArray(dicePool) &&
                    typeof dicePool[assignment.diceIndex] === "number"
                      ? dicePool[assignment.diceIndex]
                      : typeof dicePool[assignment.diceIndex] === "object"
                      ? dicePool[assignment.diceIndex].value
                      : dicePool[assignment.diceIndex];

                  const skill =
                    effectiveSkill === "spellcastingAbility"
                      ? selectedCharacter?.spellcastingAbility || "intelligence"
                      : effectiveSkill;
                  const modifier = calculateModifier(skill, selectedCharacter);
                  const total = diceValue + modifier;

                  return (
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: theme.surface,
                        border: `1px solid ${theme.border}`,
                        borderRadius: "6px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: theme.text,
                          }}
                        >
                          Roll: {diceValue} {modifier >= 0 ? "+" : ""}
                          {modifier} = {total}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: theme.textSecondary,
                          }}
                        >
                          Die: {diceValue} | Modifier:{" "}
                          {modifier >= 0 ? "+" : ""}
                          {modifier} | Total: {total}
                        </div>
                      </div>
                      {canEdit() && (
                        <button
                          onClick={() => {
                            updateRollAssignment(index, "diceIndex", null);
                            updateRollAssignment(index, "skill", "");
                          }}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: theme.error || "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Remove Die
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <select
                    value=""
                    onChange={(e) => {
                      const diceIndex = parseInt(e.target.value);

                      if (!activity.selectedCheckType || !effectiveSkill) {
                        alert(
                          "Please select a check type and skill before assigning a die."
                        );
                        return;
                      }

                      let requiredSkill = effectiveSkill;
                      if (requiredSkill === "spellcastingAbility") {
                        requiredSkill =
                          selectedCharacter?.spellcastingAbility ||
                          "intelligence";
                      }

                      const modifier = calculateModifier(
                        requiredSkill,
                        selectedCharacter
                      );
                      const diceValue =
                        Array.isArray(dicePool) &&
                        typeof dicePool[diceIndex] === "number"
                          ? dicePool[diceIndex]
                          : typeof dicePool[diceIndex] === "object"
                          ? dicePool[diceIndex].value
                          : dicePool[diceIndex];
                      const totalRoll = diceValue + modifier;

                      setRollAssignments((prev) => ({
                        ...prev,
                        [`activity${index + 1}`]: {
                          diceIndex: diceIndex,
                          skill: requiredSkill,
                          wandModifier: "",
                          notes: prev[`activity${index + 1}`]?.notes || "",
                          secondDiceIndex: null,
                          secondSkill: "",
                          secondWandModifier: "",
                          customDice: null,
                          jobType: null,
                          familyType: null,
                          firstSpellDice: null,
                          secondSpellDice: null,
                          modifier: modifier,
                          total: totalRoll,
                          checkType: activity.selectedCheckType,
                        },
                      }));
                    }}
                    style={styles.select}
                    disabled={!canEdit()}
                  >
                    <option value="">Select a die...</option>
                    {(diceManager?.functions?.getSortedDiceOptions
                      ? diceManager.functions.getSortedDiceOptions.filter(
                          ({ index: diceIndex }) =>
                            !diceManager.functions.isDiceAssigned(diceIndex) ||
                            diceIndex === assignment.diceIndex
                        )
                      : dicePool.map((die, diceIndex) => ({
                          value:
                            typeof die === "number" ? die : die.value || die,
                          index: diceIndex,
                        }))
                    ).map(({ value, index: diceIndex }) => {
                      const skill =
                        effectiveSkill === "spellcastingAbility"
                          ? selectedCharacter?.spellcastingAbility ||
                            "intelligence"
                          : effectiveSkill;
                      const modifier = calculateModifier(
                        skill,
                        selectedCharacter
                      );
                      const total = value + modifier;

                      return (
                        <option key={diceIndex} value={diceIndex}>
                          {value} (Total: {total})
                        </option>
                      );
                    })}
                  </select>
                );
              })()}
            </div>
          )}

        {progress?.isComplete && (
          <div style={styles.completionMessage}>
            🎉 Recipe "{activity.recipeName}" has been successfully created! All
            required checks have been completed.
          </div>
        )}
      </div>
    );
  };

  const editable = canEdit();

  return (
    <div style={styles.container}>
      {diceManager.component}

      {dicePool.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🎓 School of Magic Advancement</h2>
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
                Choose one school of magic to improve by +1 during this downtime
                period. This represents focused study and practice in that
                magical discipline.
              </p>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Select School of Magic</label>

                {(() => {
                  const schoolOptions =
                    getMagicSchoolOptions(selectedCharacter);
                  const allAtMaximum = schoolOptions.every(
                    (school) => school.isAtMaximum
                  );

                  if (allAtMaximum) {
                    return (
                      <div
                        style={{
                          padding: "1rem",
                          backgroundColor: theme.surface,
                          border: `1px solid ${theme.border}`,
                          borderRadius: "6px",
                          color: theme.textSecondary,
                          textAlign: "center",
                          fontSize: "0.875rem",
                        }}
                      >
                        🎯 All schools of magic are already at maximum (+5). You
                        cannot advance any further this semester.
                      </div>
                    );
                  }

                  return (
                    <select
                      style={{
                        ...styles.select,
                        color: theme.text,
                      }}
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
                      {schoolOptions.map((school) => (
                        <option
                          key={school.value}
                          value={school.value}
                          disabled={school.isAtMaximum}
                          style={{
                            color: school.isAtMaximum ? "#888" : "inherit",
                            fontStyle: school.isAtMaximum ? "italic" : "normal",
                          }}
                        >
                          {school.displayText}
                        </option>
                      ))}
                    </select>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {dicePool.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>⚡ Activities</h2>

          {formData.activities.map((activity, index) => {
            const assignmentKey = `activity${index + 1}`;
            const assignment = rollAssignments[assignmentKey] || {};
            const activityDescription = getActivityDescription(
              activity.activity,
              availableActivities
            );
            const isSpellActivity = activityRequiresSpellSelection(
              activity.activity
            );
            const isWandIncreaseActivity = activityRequiresWandSelection(
              activity.activity
            );
            const isDistinctCheck = isDistinctCheckActivity(activity.activity);

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
                  <div
                    style={{
                      marginBottom: "16px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label style={styles.label}>Activity Type</label>

                    <select
                      ref={selectRef}
                      onFocus={scrollToSelectedOption}
                      style={styles.select}
                      value={activity.activity || ""}
                      onChange={(e) =>
                        updateActivity(index, "activity", e.target.value)
                      }
                      disabled={!editable}
                    >
                      <option value="">Select Activity</option>
                      {Object.entries(downtime).map(
                        ([categoryKey, categoryInfo]) => (
                          <optgroup
                            key={categoryKey}
                            label={categoryInfo.name}
                            title={categoryInfo.description}
                          >
                            {categoryInfo.activities.map(
                              (activityName, actIndex) => (
                                <option
                                  key={`${categoryKey}-${actIndex}`}
                                  value={activityName}
                                >
                                  {activityName.split(" - ")[0]}
                                </option>
                              )
                            )}
                          </optgroup>
                        )
                      )}
                    </select>
                  </div>

                  {!activityRequiresDualChecks(activity.activity) &&
                    !isSpellActivity &&
                    !isWandIncreaseActivity &&
                    !isDistinctCheck &&
                    !activityRequiresAbilitySelection(activity.activity) &&
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

                  {activityRequiresAbilitySelection(activity.activity) && (
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>
                        Select Ability Score to Increase
                      </label>
                      <select
                        style={styles.select}
                        value={activity.selectedAbilityScore || ""}
                        onChange={(e) =>
                          updateActivity(
                            index,
                            "selectedAbilityScore",
                            e.target.value
                          )
                        }
                        disabled={!editable}
                      >
                        <option value="">Choose an ability score...</option>
                        {getAvailableAbilityScores(selectedCharacter).map(
                          (ability) => {
                            const currentScore =
                              selectedCharacter?.abilityScores?.[
                                ability.name
                              ] ||
                              selectedCharacter?.[ability.name] ||
                              10;
                            const modifier = getAbilityScoreModifier(
                              selectedCharacter,
                              ability.name
                            );
                            const dc = calculateAbilityScoreIncreaseDC(
                              selectedCharacter,
                              ability.name
                            );
                            const modifierStr =
                              modifier >= 0 ? `+${modifier}` : `${modifier}`;

                            return (
                              <option key={ability.name} value={ability.name}>
                                {ability.displayName}: {currentScore} (
                                {modifierStr}) - DC {dc}
                              </option>
                            );
                          }
                        )}
                      </select>

                      {activity.selectedAbilityScore && (
                        <div
                          style={{
                            marginTop: "8px",
                            padding: "8px",
                            backgroundColor: theme.background,
                            border: `1px solid ${theme.border}`,
                            borderRadius: "4px",
                            fontSize: "14px",
                          }}
                        >
                          <div>
                            <strong>Selected:</strong>{" "}
                            {
                              getAvailableAbilityScores(selectedCharacter).find(
                                (a) => a.name === activity.selectedAbilityScore
                              )?.displayName
                            }
                          </div>
                          <div>
                            <strong>Current Score:</strong>{" "}
                            {selectedCharacter?.abilityScores?.[
                              activity.selectedAbilityScore
                            ] ||
                              selectedCharacter?.[
                                activity.selectedAbilityScore
                              ] ||
                              10}
                          </div>
                          <div>
                            <strong>Current Modifier:</strong>{" "}
                            {(() => {
                              const mod = getAbilityScoreModifier(
                                selectedCharacter,
                                activity.selectedAbilityScore
                              );
                              return mod >= 0 ? `+${mod}` : `${mod}`;
                            })()}
                          </div>
                          <div>
                            <strong>Target DC:</strong>{" "}
                            {calculateAbilityScoreIncreaseDC(
                              selectedCharacter,
                              activity.selectedAbilityScore
                            )}
                          </div>
                          <div
                            style={{
                              marginTop: "4px",
                              fontSize: "12px",
                              color: theme.textSecondary,
                            }}
                          >
                            Roll d20 + current ability modifier vs DC (current
                            ability score). Requires 3 successes across separate
                            downtime sessions.
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activityRequiresMakeSpellInterface(activity.activity) &&
                    renderMakeSpellActivity({
                      activity,
                      index,
                      styles,
                      updateActivity,
                      editable,
                      selectedCharacter,
                      getCheckDescription,
                    })}

                  {isWandIncreaseActivity && (
                    <WandModifierSelector
                      selectedCharacter={selectedCharacter}
                      selectedWandModifier={activity.selectedWandModifier}
                      onWandModifierChange={(value) =>
                        updateActivity(index, "selectedWandModifier", value)
                      }
                      canEdit={canEdit}
                    />
                  )}

                  {(activityRequiresDualChecks(activity.activity) ||
                    isSpellActivity) && (
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Dual Check Activity</label>
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: theme.warning + "20",
                          border: `1px solid ${theme.warning}`,
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: theme.warning,
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        Requires Two Dice Rolls
                      </div>
                    </div>
                  )}

                  {isDistinctCheck && (
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Multi-Check Activity</label>
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: theme.primary + "20",
                          border: `1px solid ${theme.primary}`,
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: theme.primary,
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        Requires 3 Distinct Checks
                      </div>
                    </div>
                  )}
                </div>

                {isDistinctCheck && renderMakeRecipeActivity(activity, index)}

                {isStudyActivity(activity.activity) && (
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Select Class</label>
                    <select
                      style={styles.select}
                      value={activity.selectedClass || ""}
                      onChange={(e) =>
                        updateActivity(index, "selectedClass", e.target.value)
                      }
                      disabled={!editable}
                    >
                      <option value="">Choose a class...</option>
                      {classes.map((className) => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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

                {isSpellActivity && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <SpellSelector
                      activityIndex={index}
                      selectedSpells={(() => {
                        const spells = selectedSpells[assignmentKey] || {
                          first: "",
                          second: "",
                        };
                        return spells;
                      })()}
                      onSpellSelect={handleSpellSelect}
                      onDiceAssign={handleSpellDiceAssign}
                      availableDiceOptions={diceManager.functions.getSortedDiceOptions.filter(
                        ({ index: diceIndex }) => {
                          const isAssignedToSpells = Object.values(
                            rollAssignments
                          ).some(
                            (assignment) =>
                              assignment.firstSpellDice === diceIndex ||
                              assignment.secondSpellDice === diceIndex
                          );
                          const isAssignedToActivities = Object.values(
                            rollAssignments
                          ).some(
                            (assignment) =>
                              assignment.diceIndex === diceIndex ||
                              assignment.secondDiceIndex === diceIndex
                          );
                          const isThisActivitySpell =
                            assignment.firstSpellDice === diceIndex ||
                            assignment.secondSpellDice === diceIndex;

                          return (
                            (!isAssignedToSpells && !isAssignedToActivities) ||
                            isThisActivitySpell
                          );
                        }
                      )}
                      rollAssignments={rollAssignments}
                      dicePool={dicePool}
                      canEdit={editable}
                      selectedCharacter={selectedCharacter}
                      spellAttempts={spellAttempts}
                      researchedSpells={researchedSpells}
                      failedAttempts={failedAttempts}
                      isResearchActivity={activity.activity
                        ?.toLowerCase()
                        .includes("research spells")}
                      isAttemptActivity={activity.activity
                        ?.toLowerCase()
                        .includes("attempt spells")}
                    />
                  </div>
                )}

                {activity.activity &&
                  renderSpecialActivityInfo({
                    activityText: activity.activity,
                    theme,
                    styles,
                    formData,
                    editable,
                    diceManager,
                  })}

                {activity.activity &&
                  !isDistinctCheck &&
                  renderDiceAssignment({
                    activity,
                    index,
                    assignment,
                    styles,
                    theme,
                    renderDiceValue: (
                      assignment,
                      dicePool,
                      isSecond,
                      activity
                    ) =>
                      renderDiceValue({
                        assignment,
                        dicePool,
                        isSecond,
                        activity,
                        styles,
                        theme,
                        selectedCharacter,
                        getModifierValue: (modifierName) =>
                          getModifierValue(modifierName, selectedCharacter),
                      }),
                    dicePool,
                    diceManager,
                    editable,
                    updateRollAssignment,
                    selectedCharacter,
                  })}
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
                    <NPCAutocompleteInput
                      value={relationship.npcName || ""}
                      onChange={(value) =>
                        updateRelationship(index, "npcName", value)
                      }
                      placeholder="Enter NPC name..."
                      disabled={!canEdit()}
                      theme={theme}
                      styles={{ input: styles.input }}
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
                        {formatModifier(
                          getModifierValue("insight", selectedCharacter)
                        )}
                        )
                      </option>
                      <option value="persuasion">
                        Persuasion (
                        {formatModifier(
                          getModifierValue("persuasion", selectedCharacter)
                        )}
                        )
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
                          getModifierValue(assignment.skill, selectedCharacter)}
                      </div>
                      <div style={styles.total}>
                        Total: {dicePool[assignment.diceIndex]}{" "}
                        {formatModifier(
                          getModifierValue(assignment.skill, selectedCharacter)
                        )}{" "}
                        ={" "}
                        {dicePool[assignment.diceIndex] +
                          getModifierValue(assignment.skill, selectedCharacter)}
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
              </div>
            );
          })}
        </div>
      )}

      {dicePool.length > 0 && editable && (
        <div style={styles.actionButtons}>
          <button
            onClick={handleSaveAsDraft}
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
            onClick={handleSubmitDowntimeSheet}
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
