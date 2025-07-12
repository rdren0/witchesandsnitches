import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getAllActivities, downtime, classes } from "../../SharedData/downtime";
import { formatModifier } from "../CharacterSheet/utils";

import {
  calculateModifier,
  activityRequiresDualChecks,
  activityRequiresNoDiceRoll,
  isMultiSessionActivity,
  shouldUseCustomDiceForActivity,
  getCustomDiceTypeForActivity,
  getMultiSessionInfo,
  getSpecialActivityInfo,
  activityRequiresSpellSelection,
  activityRequiresExtraDie,
  activityRequiresWandSelection,
  getAvailableWandModifiersForIncrease,
  calculateWandStatIncreaseDC,
  validateWandStatIncreaseActivity,
} from "./downtimeHelpers";
import SkillSelector from "./SkillSelector";
import SpellSelector from "./SpellSelector";
import DicePoolManager from "./DicePoolManager";

import { spellsData } from "../SpellBook/spells";
import { getSpellModifier } from "../SpellBook/utils";
import { getActivitySkillInfo } from "./downtimeHelpers";
import { allSkills } from "../../SharedData/data";

const WandModifierSelector = ({
  selectedCharacter,
  selectedWandModifier,
  onWandModifierChange,
  canEdit,
}) => {
  const { theme } = useTheme();
  const allWandModifiers = [
    { name: "charms", displayName: "Charms" },
    { name: "transfiguration", displayName: "Transfiguration" },
    { name: "jinxesHexesCurses", displayName: "JHC" },
    { name: "healing", displayName: "Healing" },
    { name: "divinations", displayName: "Divinations" },
  ];

  const formatModifier = useCallback((modifier) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }, []);

  const allAtMaximum = allWandModifiers.every(
    (wand) => (selectedCharacter.magicModifiers[wand.name] || 0) >= 5
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
        }}
      >
        All wand modifiers are already at maximum (+5). You cannot use this
        activity.
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label
        style={{
          display: "block",
          fontSize: "0.875rem",
          fontWeight: "600",
          color: theme.text,
          marginBottom: "0.5rem",
        }}
      >
        Wand Modifier to Increase:
      </label>
      <select
        value={selectedWandModifier || ""}
        onChange={(e) => onWandModifierChange(e.target.value)}
        disabled={!canEdit()}
        style={{
          width: "100%",
          padding: "0.75rem",
          border: `1px solid ${theme.border}`,
          borderRadius: "6px",
          backgroundColor: theme.surface,
          color: theme.text,
          fontSize: "14px",
        }}
      >
        <option value="">Select a wand modifier...</option>
        {allWandModifiers.map((wand) => {
          const currentValue = selectedCharacter.magicModifiers[wand.name] || 0;
          const isAtMaximum = currentValue >= 5;
          const dc = calculateWandStatIncreaseDC(selectedCharacter, wand.name);

          return (
            <option
              key={wand.name}
              value={wand.name}
              disabled={isAtMaximum}
              style={{
                color: isAtMaximum ? theme.textSecondary : theme.text,
                backgroundColor: isAtMaximum ? theme.surface : theme.background,
              }}
            >
              {wand.displayName} ({formatModifier(currentValue)}) - DC {dc}
              {isAtMaximum ? " (MAX)" : ""}
            </option>
          );
        })}
      </select>

      {selectedWandModifier && (
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.75rem",
            backgroundColor: theme.primary + "10",
            border: `1px solid ${theme.primary}`,
            borderRadius: "6px",
            fontSize: "14px",
            color: theme.text,
          }}
        >
          <strong>DC Required:</strong>{" "}
          {calculateWandStatIncreaseDC(selectedCharacter, selectedWandModifier)}
          <br />
          <strong>Current:</strong>{" "}
          {formatModifier(
            selectedCharacter.magicModifiers[selectedWandModifier] || 0
          )}{" "}
          →<strong> After Success:</strong>{" "}
          {formatModifier(
            (selectedCharacter.magicModifiers[selectedWandModifier] || 0) + 1
          )}
          <br />
          <small style={{ color: theme.textSecondary }}>
            Roll: d20 +{" "}
            {formatModifier(
              selectedCharacter.magicModifiers[selectedWandModifier] || 0
            )}{" "}
            vs DC{" "}
            {calculateWandStatIncreaseDC(
              selectedCharacter,
              selectedWandModifier
            )}
          </small>
        </div>
      )}
    </div>
  );
};

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
  console.log({ initialFormData });
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
        backgroundColor: theme.success + "15",
        borderRadius: "8px",
        border: `2px solid ${theme.success}`,
        textAlign: "center",
        color: theme.success,
        maxWidth: "450px",
      },
      diceValue: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: theme.success,
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
        marginTop: "0.5rem",
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
      makeSpellContainer: {
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: "8px",
        padding: "1rem",
        marginTop: "0.5rem",
      },
      progressContainer: {
        marginTop: "1rem",
        padding: "1rem",
        backgroundColor: theme.background,
        borderRadius: "6px",
        border: `1px solid ${theme.border}`,
      },
      progressHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
      },
      progressTitle: {
        margin: 0,
        fontSize: "1.1rem",
        fontWeight: "600",
        color: theme.text,
      },
      progressBadge: {
        backgroundColor: theme.primary,
        color: "white",
        padding: "0.25rem 0.75rem",
        borderRadius: "12px",
        fontSize: "0.875rem",
        fontWeight: "600",
      },
      checksList: {
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        marginBottom: "1rem",
      },
      checkItem: {
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: "0.75rem",
        borderRadius: "6px",
        border: `1px solid ${theme.border}`,
        backgroundColor: theme.surface,
      },
      checkItemCompleted: {
        backgroundColor: theme.primary + "10",
        borderColor: theme.primary,
      },
      checkItemCurrent: {
        backgroundColor: theme.secondary + "10",
        borderColor: theme.secondary,
      },
      checkIcon: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        backgroundColor: theme.primary,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "bold",
        flexShrink: 0,
      },
      checkContent: {
        flex: 1,
      },
      checkName: {
        fontSize: "0.95rem",
        fontWeight: "600",
        color: theme.text,
        marginBottom: "0.25rem",
      },
      checkDescription: {
        fontSize: "0.85rem",
        color: theme.textSecondary,
        lineHeight: 1.4,
      },
      currentCheckInfo: {
        padding: "1rem",
        backgroundColor: theme.secondary + "10",
        border: `1px solid ${theme.secondary}`,
        borderRadius: "6px",
      },
      currentCheckTitle: {
        fontSize: "1rem",
        fontWeight: "600",
        color: theme.text,
        marginBottom: "0.5rem",
      },
      dcInfo: {
        fontSize: "0.95rem",
        color: theme.text,
        marginBottom: "0.5rem",
      },
      checkNote: {
        fontSize: "0.85rem",
        color: theme.textSecondary,
        fontStyle: "italic",
      },
      completionMessage: {
        padding: "1rem",
        backgroundColor: theme.primary + "10",
        border: `1px solid ${theme.primary}`,
        borderRadius: "6px",
        textAlign: "center",
        color: theme.text,
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
        },
        {
          activity: "",
          selectedClass: "",
          selectedWandModifier: "",
          successes: [false, false, false, false, false],
        },
        {
          activity: "",
          selectedClass: "",
          selectedWandModifier: "",
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

  const [selectedSpells, setSelectedSpells] = useState({
    activity1: { first: "", second: "" },
    activity2: { first: "", second: "" },
    activity3: { first: "", second: "" },
  });

  const [spellAttempts, setSpellAttempts] = useState({});
  const [researchedSpells, setResearchedSpells] = useState({});
  const [failedAttempts, setFailedAttempts] = useState({});

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

  const canEdit = useCallback(() => {
    if (isUserAdmin) return true;
    if (!currentSheet) return true;
    if (currentSheet.is_draft) return currentSheet.user_id === user?.id;
    if (currentSheet.review_status === "failure")
      return currentSheet.user_id === user?.id;
    return false;
  }, [isUserAdmin, currentSheet, user?.id]);
  const activityRequiresMakeSpellInterface = (activityText) => {
    if (!activityText) return false;
    return activityText.toLowerCase().includes("make a spell");
  };

  const validateMakeSpellActivity = (activity) => {
    if (!activity.spellName || activity.spellName.trim() === "") {
      return { isValid: false, message: "Please enter a spell name" };
    }

    if (
      !activity.spellLevel ||
      activity.spellLevel < 1 ||
      activity.spellLevel > 9
    ) {
      return { isValid: false, message: "Please select a valid spell level" };
    }

    return { isValid: true };
  };
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

  const loadSpellProgress = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("spell_progress_summary")
        .select(
          "spell_name, successful_attempts, researched, has_failed_attempt"
        )
        .eq("character_id", selectedCharacter.id)
        .eq("discord_user_id", user.user_metadata.provider_id);

      if (error) {
        console.error("Error loading spell progress:", error);
        return;
      }

      const attempts = {};
      const researched = {};
      const failed = {};
      data.forEach((progress) => {
        attempts[progress.spell_name] = progress.successful_attempts || 0;
        researched[progress.spell_name] = progress.researched || false;
        failed[progress.spell_name] = progress.has_failed_attempt || 0;
      });

      setSpellAttempts(attempts);
      setResearchedSpells(researched);
      setFailedAttempts(failed);
    } catch (error) {
      console.error("Error loading spell progress:", error);
    }
  }, [selectedCharacter?.id, user?.user_metadata?.provider_id, supabase]);

  useEffect(() => {
    loadSpellProgress();
  }, [loadSpellProgress]);

  useEffect(() => {
    if (initialDicePool && initialDicePool.length > 0 && !hasInitialized) {
      setDicePool(initialDicePool);
    }
  }, [initialDicePool, hasInitialized]);
  useEffect(() => {}, [
    selectedSpells,
    initialFormData?.selected_spells,
    hasInitialized,
  ]);
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

  const calculateResearchDC = useCallback(
    (playerYear, spellYear, spellName, selectedCharacter) => {
      let baseDC = 8 + 2 * playerYear;

      const yearDifference = spellYear - playerYear;
      if (yearDifference > 0) {
        baseDC += 2 * playerYear;
      } else if (yearDifference < 0) {
        baseDC += yearDifference * 2;
      }

      const difficultSpells = [
        "Abscondi",
        "Pellucidi Pellis",
        "Sagittario",
        "Confringo",
        "Devieto",
        "Stupefy",
        "Petrificus Totalus",
        "Protego",
        "Protego Maxima",
        "Finite Incantatem",
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

  const isStudyActivity = (activityName) => {
    return activityName && activityName.toLowerCase().includes("study");
  };

  const validateStudyActivities = useCallback(() => {
    for (let i = 0; i < formData.activities.length; i++) {
      const activity = formData.activities[i];
      if (isStudyActivity(activity.activity) && !activity.selectedClass) {
        alert(
          `Activity ${i + 1}: Please select a class for the Study activity.`
        );
        return false;
      }
    }
    return true;
  }, [formData.activities]);

  const validateWandStatIncreaseActivities = useCallback(() => {
    for (let i = 0; i < formData.activities.length; i++) {
      const activity = formData.activities[i];

      if (activityRequiresWandSelection(activity.activity)) {
        const validation = validateWandStatIncreaseActivity(
          activity,
          selectedCharacter
        );
        if (!validation.valid) {
          alert(`Activity ${i + 1}: ${validation.message}`);
          return false;
        }
      }
    }
    return true;
  }, [formData.activities, selectedCharacter]);

  const validateSpellActivities = useCallback(() => {
    for (let i = 0; i < formData.activities.length; i++) {
      const activity = formData.activities[i];
      const activityKey = `activity${i + 1}`;
      const assignment = rollAssignments[activityKey];
      const spellSelections = selectedSpells[activityKey];

      if (activityRequiresSpellSelection(activity.activity)) {
        if (!spellSelections?.first && !spellSelections?.second) {
          alert(`Activity ${i + 1}: Please select at least one spell`);
          return false;
        }

        if (
          spellSelections.first &&
          (assignment.firstSpellDice === null ||
            assignment.firstSpellDice === undefined)
        ) {
          alert(`Activity ${i + 1}: Please assign a die to the first spell`);
          return false;
        }

        if (
          spellSelections.second &&
          (assignment.secondSpellDice === null ||
            assignment.secondSpellDice === undefined)
        ) {
          alert(`Activity ${i + 1}: Please assign a die to the second spell`);
          return false;
        }

        const isAttemptActivity = activity.activity
          ?.toLowerCase()
          .includes("attempt spells");
        const isResearchActivity = activity.activity
          ?.toLowerCase()
          .includes("research spells");

        if (isAttemptActivity || isResearchActivity) {
          const validateSpell = (spellName) => {
            if (!spellName) return true;

            const successfulAttempts = spellAttempts?.[spellName] || 0;
            if (successfulAttempts >= 2) {
              return false;
            }

            if (isAttemptActivity) {
              const hasBeenResearched = researchedSpells?.[spellName] || false;
              const hasSuccessfulAttempts = successfulAttempts > 0;
              const hasFailedAttempts = (failedAttempts?.[spellName] || 0) > 0;

              return (
                hasBeenResearched || hasSuccessfulAttempts || hasFailedAttempts
              );
            } else if (isResearchActivity) {
              const hasBeenResearched = researchedSpells?.[spellName] || false;
              const hasSuccessfulAttempts = successfulAttempts > 0;
              const hasFailedAttempts = (failedAttempts?.[spellName] || 0) > 0;

              return !(
                hasBeenResearched ||
                hasSuccessfulAttempts ||
                hasFailedAttempts
              );
            }

            return true;
          };

          if (spellSelections.first && !validateSpell(spellSelections.first)) {
            const successfulAttempts =
              spellAttempts?.[spellSelections.first] || 0;

            if (successfulAttempts >= 2) {
              alert(
                `Activity ${i + 1}: "${
                  spellSelections.first
                }" has already been mastered and cannot be ${
                  isResearchActivity ? "researched" : "attempted"
                } again`
              );
            } else if (isAttemptActivity) {
              alert(
                `Activity ${i + 1}: "${
                  spellSelections.first
                }" must be researched or previously attempted (successful or failed) before you can attempt it`
              );
            } else if (isResearchActivity) {
              alert(
                `Activity ${i + 1}: "${
                  spellSelections.first
                }" has already been researched, attempted, or failed and cannot be researched again`
              );
            }
            return false;
          }

          if (
            spellSelections.second &&
            !validateSpell(spellSelections.second)
          ) {
            const successfulAttempts =
              spellAttempts?.[spellSelections.second] || 0;

            if (successfulAttempts >= 2) {
              alert(
                `Activity ${i + 1}: "${
                  spellSelections.second
                }" has already been mastered and cannot be ${
                  isResearchActivity ? "researched" : "attempted"
                } again`
              );
            } else if (isAttemptActivity) {
              alert(
                `Activity ${i + 1}: "${
                  spellSelections.second
                }" must be researched or previously attempted (successful or failed) before you can attempt it`
              );
            } else if (isResearchActivity) {
              alert(
                `Activity ${i + 1}: "${
                  spellSelections.second
                }" has already been researched, attempted, or failed and cannot be researched again`
              );
            }
            return false;
          }
        }
      }
    }
    return true;
  }, [
    formData.activities,
    rollAssignments,
    selectedSpells,
    researchedSpells,
    spellAttempts,
    failedAttempts,
  ]);

  const updateSpellProgressSummary = useCallback(
    async (
      spellName,
      isSuccess,
      isNaturalTwenty = false,
      isResearch = false
    ) => {
      if (!selectedCharacter || !user?.user_metadata?.provider_id) return;

      const characterOwnerDiscordId = user.user_metadata.provider_id;

      try {
        const { data: existingProgress, error: fetchError } = await supabase
          .from("spell_progress_summary")
          .select("*")
          .eq("character_id", selectedCharacter.id)
          .eq("discord_user_id", characterOwnerDiscordId)
          .eq("spell_name", spellName)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error fetching spell progress:", fetchError);
          return;
        }

        if (existingProgress) {
          const currentAttempts = existingProgress.successful_attempts || 0;
          const newAttempts = isNaturalTwenty
            ? 2
            : Math.min(currentAttempts + (isSuccess ? 1 : 0), 2);

          const updateData = {
            successful_attempts: newAttempts,
            has_natural_twenty:
              existingProgress.has_natural_twenty || isNaturalTwenty,
            has_failed_attempt:
              existingProgress.has_failed_attempt || !isSuccess,
            researched:
              existingProgress.researched || (isResearch && isSuccess),
          };

          const { error: updateError } = await supabase
            .from("spell_progress_summary")
            .update(updateData)
            .eq("id", existingProgress.id);

          if (updateError) {
            console.error("Error updating spell progress:", updateError);
          }
        } else {
          const insertData = {
            character_id: selectedCharacter.id,
            discord_user_id: characterOwnerDiscordId,
            spell_name: spellName,
            successful_attempts: isSuccess ? (isNaturalTwenty ? 2 : 1) : 0,
            has_natural_twenty: isNaturalTwenty,
            has_failed_attempt: !isSuccess,
            researched: isResearch && isSuccess,
          };

          const { error: insertError } = await supabase
            .from("spell_progress_summary")
            .insert([insertData]);

          if (insertError) {
            console.error("Error inserting spell progress:", insertError);
          }
        }
      } catch (error) {
        console.error("Error updating spell progress summary:", error);
      }
    },
    [selectedCharacter, user, supabase]
  );

  const updateSpellProgressOnSubmission = useCallback(async () => {
    try {
      for (let i = 0; i < formData.activities.length; i++) {
        const activity = formData.activities[i];
        const activityKey = `activity${i + 1}`;
        const assignment = rollAssignments[activityKey];
        const spellSelections = selectedSpells[activityKey];

        if (
          !spellSelections ||
          (!spellSelections.first && !spellSelections.second)
        ) {
          continue;
        }

        const isAttemptActivity = activity.activity
          ?.toLowerCase()
          .includes("attempt spells");
        const isResearchActivity = activity.activity
          ?.toLowerCase()
          .includes("research spells");

        if (!isAttemptActivity && !isResearchActivity) {
          continue;
        }

        for (const spellSlot of ["first", "second"]) {
          const spellName = spellSelections[spellSlot];
          if (!spellName) continue;

          const diceField =
            spellSlot === "first" ? "firstSpellDice" : "secondSpellDice";
          const diceIndex = assignment[diceField];

          if (diceIndex === null || diceIndex === undefined) continue;

          const diceValue = dicePool[diceIndex];
          if (!diceValue) continue;

          const spellData = getSpellData(spellName);
          if (!spellData) continue;

          const modifier = getSpellModifier(
            spellName,
            spellData.subject,
            selectedCharacter
          );
          const total = diceValue + modifier;

          let dc, isSuccess;
          if (isResearchActivity) {
            const playerYear = selectedCharacter.year || 1;
            const spellYear = spellData.year || 1;
            dc = calculateResearchDC(
              playerYear,
              spellYear,
              spellName,
              selectedCharacter
            );
            isSuccess = total >= dc;
          } else {
            const playerYear = selectedCharacter.year || 1;
            const spellYear = spellData.year || 1;
            dc = 8 + 2 * spellYear;
            if (spellYear > playerYear) {
              dc += (spellYear - playerYear) * 2;
            }
            dc = Math.max(5, dc);
            isSuccess = total >= dc;
          }

          const isNaturalTwenty = diceValue === 20;

          await updateSpellProgressSummary(
            spellName,
            isSuccess,
            isNaturalTwenty,
            isResearchActivity
          );
        }
      }
    } catch (error) {
      console.error("Error updating spell progress on submission:", error);
    }
  }, [
    selectedCharacter,
    formData.activities,
    rollAssignments,
    selectedSpells,
    dicePool,
    getSpellData,
    calculateResearchDC,
    updateSpellProgressSummary,
  ]);

  const updateMakeSpellProgress = async (
    activity,
    isSuccess,
    isNaturalTwenty = false
  ) => {
    if (!selectedCharacter || !user?.user_metadata?.provider_id) return;

    const currentProgress = activity.currentSuccesses || 0;

    if (isSuccess) {
      const newProgress = Math.min(currentProgress + 1, 3);

      const updatedActivity = {
        ...activity,
        currentSuccesses: newProgress,
        lastCheckType: [
          "Magical Theory",
          "Wand Modifier",
          "Spellcasting Ability",
        ][currentProgress],
        lastCheckResult: {
          success: true,
          isNaturalTwenty,
          timestamp: new Date().toISOString(),
        },
      };

      if (newProgress >= 3) {
        updatedActivity.completed = true;
        updatedActivity.completedAt = new Date().toISOString();
      }

      return updatedActivity;
    } else {
      const updatedActivity = {
        ...activity,
        lastCheckType: [
          "Magical Theory",
          "Wand Modifier",
          "Spellcasting Ability",
        ][currentProgress],
        lastCheckResult: {
          success: false,
          isNaturalTwenty,
          timestamp: new Date().toISOString(),
        },
      };

      return updatedActivity;
    }
  };

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

  const editable = canEdit();

  const renderDiceValue = useCallback(
    (assignment, dicePool, isSecond = false, activity = null) => {
      const diceIndexKey = isSecond ? "secondDiceIndex" : "diceIndex";
      const skillKey = isSecond ? "secondSkill" : "skill";
      const wandKey = isSecond ? "secondWandModifier" : "wandModifier";

      if (assignment.customDice && !isSecond) {
        const isWorkJob = assignment.jobType !== undefined;
        const isAllowance = assignment.familyType !== undefined;
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
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: theme.textSecondary,
                      marginTop: "0.25rem",
                    }}
                  >
                    Earnings: {diceSum} × 2 = {diceSum * 2} Galleons
                  </div>
                </>
              ) : isAllowance ? (
                <>
                  {assignment.familyType === "poor" && "2d4: "}
                  {assignment.familyType === "middle" && "2d6: "}
                  {assignment.familyType === "rich" && "2d8: "}
                  {assignment.customDice[0]} + {assignment.customDice[1]} ={" "}
                  {diceSum}
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: theme.textSecondary,
                      marginTop: "0.25rem",
                    }}
                  >
                    Allowance: {diceSum} × 2 = {diceSum * 2} Galleons
                  </div>
                </>
              ) : (
                <>
                  2d12: {assignment.customDice[0]} + {assignment.customDice[1]}{" "}
                  = {diceSum}
                </>
              )}
            </div>
            {assignment[skillKey] && !isWorkJob && !isAllowance && (
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

        if (activity && activityRequiresWandSelection(activity.activity)) {
          const selectedWandModifier = activity.selectedWandModifier;

          if (!selectedWandModifier) {
            return (
              <div style={styles.assignedDice}>
                <div style={styles.diceValue}>{diceValue}</div>
                <div style={styles.total}>
                  Select a wand modifier to see total
                </div>
              </div>
            );
          }

          const currentWandValue =
            selectedCharacter.magicModifiers?.[selectedWandModifier] || 0;
          const totalRoll = diceValue + currentWandValue;
          const dc = calculateWandStatIncreaseDC(
            selectedCharacter,
            selectedWandModifier
          );
          const success = totalRoll >= dc;

          const wandDisplayNames = {
            charms: "Charms",
            transfiguration: "Transfiguration",
            jinxesHexesCurses: "JHC",
            healing: "Healing",
            divinations: "Divinations",
          };

          return (
            <div style={styles.assignedDice}>
              <div style={styles.diceValue}>{totalRoll}</div>
              <div style={styles.total}>
                Roll: {diceValue} + {formatModifier(currentWandValue)} ={" "}
                {totalRoll}
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                  color: theme.textSecondary,
                }}
              >
                DC {dc}: {success ? "SUCCESS!" : "Failed"}
              </div>
              {success && (
                <div
                  style={{
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                    color: "#10b981",
                    fontWeight: "600",
                  }}
                >
                  {wandDisplayNames[selectedWandModifier] ||
                    selectedWandModifier}{" "}
                  → {formatModifier(currentWandValue + 1)}
                </div>
              )}
            </div>
          );
        }

        const skillName = assignment[skillKey];
        const wandModifier = assignment[wandKey];

        const activitySkillInfo = getActivitySkillInfo(activity?.activity);
        let autoSelectedSkill = null;
        if (activitySkillInfo?.type === "locked" && activitySkillInfo?.skills) {
          autoSelectedSkill = isSecond
            ? activitySkillInfo.skills[1]
            : activitySkillInfo.skills[0];
        }

        const hasSkill = skillName && skillName !== "";
        const hasWandModifier = wandModifier && wandModifier !== "";
        const hasAutoSkill = autoSelectedSkill && !hasSkill && !hasWandModifier;
        const hasAnyModifier = hasSkill || hasWandModifier || hasAutoSkill;

        let modifierValue = 0;
        let modifierSource = "";

        if (hasSkill) {
          modifierValue = getModifierValue(skillName);
          modifierSource = skillName;
        } else if (hasWandModifier) {
          modifierValue = getModifierValue(wandModifier);
          modifierSource = wandModifier;
        } else if (hasAutoSkill) {
          modifierValue = getModifierValue(autoSelectedSkill);
          modifierSource = autoSelectedSkill;
        }

        const totalValue = diceValue + modifierValue;

        return (
          <div style={styles.assignedDice}>
            <div style={styles.diceValue}>
              {/* Always show just the dice value in the main display */}
              {diceValue}
            </div>
            {/* Always show the breakdown if there's a modifier, or a message if no modifier */}
            {hasAnyModifier ? (
              <div style={styles.total}>
                {diceValue} {formatModifier(modifierValue)} = {totalValue}
              </div>
            ) : (
              <div
                style={{
                  ...styles.total,
                  color: theme.textSecondary,
                  fontSize: "0.875rem",
                }}
              >
                {isSecond
                  ? "Select second skill/modifier"
                  : "Select skill/modifier for total"}
              </div>
            )}
            {/* Show modifier source if available */}
            {hasAnyModifier && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: theme.textSecondary,
                  marginTop: "0.25rem",
                }}
              >
                Using:{" "}
                {hasAutoSkill
                  ? `${
                      allSkills.find((s) => s.name === autoSelectedSkill)
                        ?.displayName || autoSelectedSkill
                    } (Auto)`
                  : modifierSource}
              </div>
            )}
          </div>
        );
      }

      return null;
    },
    [
      getModifierValue,
      theme.textSecondary,
      styles,
      selectedCharacter,
      activityRequiresWandSelection,
      calculateWandStatIncreaseDC,
      formatModifier,
      getActivitySkillInfo,
      allSkills,
    ]
  );
  const renderSpecialActivityInfo = useCallback(
    (activityText) => {
      if (!activityText) return null;

      if (activityRequiresNoDiceRoll(activityText)) {
        if (activityRequiresExtraDie(activityText)) {
          return (
            <div
              style={{
                padding: "1rem",
                backgroundColor: theme.primary + "20",
                border: `1px solid ${theme.primary}`,
                borderRadius: "6px",
                marginTop: "1rem",
              }}
            >
              <strong>🎲 Spell Activity Bonus</strong>
              <br />
              <small>
                This activity adds an extra die to your dice pool and allows you
                to select up to 2 spells for separate attempts. Rolls use your
                relevant magic school and wand modifiers.
              </small>
            </div>
          );
        }

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
        const isAllowance = activityText.toLowerCase().includes("allowance");

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

            {isAllowance && (
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: theme.text,
                  }}
                >
                  Family Economic Status:
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
                  defaultValue="middle"
                  id={`family-status-${activityText}`}
                >
                  <option value="poor">Poor Family (2d4×2 Galleons)</option>
                  <option value="middle">
                    Middle Class Family (2d6×2 Galleons)
                  </option>
                  <option value="rich">Rich Family (2d8×2 Galleons)</option>
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
                  const familyType = isAllowance
                    ? document.getElementById(`family-status-${activityText}`)
                        ?.value || "middle"
                    : undefined;
                  const activityIndex = formData.activities.findIndex(
                    (activity) => activity.activity === activityText
                  );
                  diceManager.functions.handleCustomDiceRoll(
                    activityText,
                    jobType || familyType,
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
            iconAndTitle = "Job Application";
            bgColor = theme.success;
            break;
          case "promotion":
            iconAndTitle = "Promotion Attempt";
            bgColor = theme.success;
            break;
          case "spell_research":
            iconAndTitle = "Spell Research";
            bgColor = theme.primary;
            break;
          case "spell_attempt":
            iconAndTitle = "Spell Attempt";
            bgColor = theme.primary;
            break;

          default:
            iconAndTitle = "Special Activity";
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

  const getCheckDescription = (checkType) => {
    switch (checkType) {
      case "Magical Theory":
        return "Roll History of Magic + Intelligence modifier to research the theoretical foundations";
      case "Wand Modifier":
        return "Roll with your appropriate Wand Modifier based on the spell's school";
      case "Spellcasting Ability":
        return "Roll with your Spellcasting Ability modifier to test practical application";
      default:
        return "";
    }
  };

  const renderMakeSpellActivity = (activity, index) => {
    const spellName = activity.spellName || "";
    const spellLevel = activity.spellLevel || 1;
    const currentProgress = activity.currentSuccesses || 0;
    const checkTypes = [
      "Magical Theory",
      "Wand Modifier",
      "Spellcasting Ability",
    ];
    const currentCheckType = checkTypes[currentProgress] || checkTypes[0];

    const dc = 17 + spellLevel - (selectedCharacter?.year || 1);

    return (
      <div style={styles.makeSpellContainer}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Spell Name</label>
          <input
            type="text"
            value={spellName}
            onChange={(e) => updateActivity(index, "spellName", e.target.value)}
            placeholder="Enter the name of your new spell..."
            style={styles.input}
            disabled={!editable}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Spell Level</label>
          <select
            value={spellLevel}
            onChange={(e) =>
              updateActivity(index, "spellLevel", parseInt(e.target.value))
            }
            style={styles.select}
            disabled={!editable}
          >
            <option value={1}>1st Level</option>
            <option value={2}>2nd Level</option>
            <option value={3}>3rd Level</option>
            <option value={4}>4th Level</option>
            <option value={5}>5th Level</option>
            <option value={6}>6th Level</option>
            <option value={7}>7th Level</option>
            <option value={8}>8th Level</option>
            <option value={9}>9th Level</option>
          </select>
        </div>

        <div style={styles.progressContainer}>
          <div style={styles.progressHeader}>
            <h4 style={styles.progressTitle}>Creation Progress</h4>
            <div style={styles.progressBadge}>
              {currentProgress}/3 Checks Complete
            </div>
          </div>

          <div style={styles.checksList}>
            {checkTypes.map((checkType, checkIndex) => {
              const isCompleted = checkIndex < currentProgress;
              const isCurrent = checkIndex === currentProgress;

              return (
                <div
                  key={checkType}
                  style={{
                    ...styles.checkItem,
                    ...(isCompleted ? styles.checkItemCompleted : {}),
                    ...(isCurrent ? styles.checkItemCurrent : {}),
                  }}
                >
                  <div style={styles.checkIcon}>
                    {isCompleted ? "✓" : isCurrent ? "○" : "○"}
                  </div>
                  <div style={styles.checkContent}>
                    <div style={styles.checkName}>{checkType}</div>
                    <div style={styles.checkDescription}>
                      {getCheckDescription(checkType)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {currentProgress < 3 && (
            <div style={styles.currentCheckInfo}>
              <div style={styles.currentCheckTitle}>
                Next Check: {currentCheckType}
              </div>
              <div style={styles.dcInfo}>
                <strong>DC {dc}</strong> (17 + {spellLevel} spell level -{" "}
                {selectedCharacter?.year || 1} current year)
              </div>
              <div style={styles.checkNote}>
                Natural 20 automatically succeeds but provides no additional
                benefit
              </div>
            </div>
          )}

          {currentProgress >= 3 && (
            <div style={styles.completionMessage}>
              <strong>🎉 Spell Creation Complete!</strong>
              <div>Your spell "{spellName}" has been successfully created.</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDiceAssignment = useCallback(
    (activity, index, assignment) => {
      const activityText = activity.activity;

      if (!activityText) return null;

      if (activityRequiresNoDiceRoll(activityText)) {
        return null;
      }

      if (activityRequiresExtraDie(activityText)) {
        return <div style={{ marginTop: "1rem", textAlign: "center" }}></div>;
      }

      if (shouldUseCustomDiceForActivity(activityText)) {
        if (assignment.customDice) {
          return (
            <div style={styles.diceAssignment}>
              <div>
                <label style={styles.label}>Roll Result</label>
                {renderDiceValue(assignment, dicePool, false, activity)}
              </div>
            </div>
          );
        }
        return null;
      }

      if (activityRequiresWandSelection(activityText)) {
        return (
          <div style={styles.diceAssignment}>
            <div>
              <label style={styles.label}>Assigned Die</label>
              {renderDiceValue(assignment, dicePool, false, activity) || (
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
                    style={styles.removeButton}
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
                {renderDiceValue(assignment, dicePool, false, activity) || (
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
                      style={styles.removeButton}
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

                {/* FIXED: Always show dice selection for second die, regardless of needsExtraDie status */}
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
                  <div>
                    {renderDiceValue(assignment, dicePool, true, activity) || (
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
                        <option value="">
                          {diceManager.functions.getSortedDiceOptions.filter(
                            ({ index: diceIndex }) =>
                              !diceManager.functions.isDiceAssigned(diceIndex)
                          ).length === 0
                            ? "No dice available - add extra die above"
                            : "Select die..."}
                        </option>
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
                          style={styles.removeButton}
                          onClick={() =>
                            diceManager.functions.unassignDice(index, true)
                          }
                        >
                          Remove
                        </button>
                      )}
                  </div>
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
              {renderDiceValue(assignment, dicePool, false, activity) || (
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
                    style={styles.removeButton}
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
        selected_spells: selectedSpells,
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
      console.error("❌ Error saving draft:", err);
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
    selectedSpells,
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

    if (!validateStudyActivities()) {
      setIsSubmitting(false);
      return;
    }

    if (!validateWandStatIncreaseActivities()) {
      setIsSubmitting(false);
      return;
    }

    if (!validateSpellActivities()) {
      setIsSubmitting(false);
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
        selected_spells: selectedSpells,
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

      await updateSpellProgressOnSubmission();

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
    selectedSpells,
    validateStudyActivities,
    validateWandStatIncreaseActivities,
    validateSpellActivities,
    currentSheet,
    supabase,
    updateSpellProgressOnSubmission,
    loadSubmittedSheets,
    loadDrafts,
    setActiveTab,
  ]);

  const selectRef = useRef(null);

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
                  <option value="healing">Healing (Intelligence-based)</option>
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
                      : formData.selectedMagicSchool.charAt(0).toUpperCase() +
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
                    Once your downtime is approved you will need to modify your
                    wand value manually.
                  </div>
                </div>
              )}
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
              activity.activity
            );
            const isSpellActivity = activityRequiresSpellSelection(
              activity.activity
            );
            const isWandIncreaseActivity = activityRequiresWandSelection(
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

                  {activityRequiresMakeSpellInterface(activity.activity) &&
                    renderMakeSpellActivity(activity, index)}

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
                </div>

                {/* Class Selection for Study Activities */}
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
                {console.log({ assignment })}
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
