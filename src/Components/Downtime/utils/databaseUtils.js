import { getActivitySkillInfo } from "../downtimeHelpers";

export const saveAsDraft = async ({
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
}) => {
  if (
    !selectedCharacter?.id ||
    !user?.id ||
    !selectedYear ||
    !selectedSemester
  ) {
    alert("Missing required information to save draft.");
    return false;
  }

  try {
    const processedRollAssignments = { ...rollAssignments };

    formData.activities.forEach((activity, index) => {
      const activityKey = `activity${index + 1}`;
      if (activity.activity && processedRollAssignments[activityKey]) {
        processedRollAssignments[activityKey] = assignAutoSkillsForActivity(
          activity,
          processedRollAssignments[activityKey]
        );
      }
    });

    const draftData = {
      character_id: selectedCharacter.id,
      user_id: user.id,
      character_name: selectedCharacter.name,
      school_year: selectedYear,
      semester: selectedSemester,
      activities: formData.activities,
      relationships: formData.relationships,
      dice_pool: dicePool,
      roll_assignments: processedRollAssignments,
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
    return true;
  } catch (err) {
    console.error("❌ Error saving draft:", err);
    return false;
  }
};

const assignAutoSkillsForActivity = (activity, rollAssignment) => {
  if (!activity.activity) return rollAssignment;

  const skillInfo = getActivitySkillInfo(activity.activity);

  if (skillInfo.type !== "locked" || !skillInfo.skills) {
    return rollAssignment;
  }

  const updatedAssignment = { ...rollAssignment };

  if (!updatedAssignment.skill && skillInfo.skills[0]) {
    updatedAssignment.skill = skillInfo.skills[0];
  }

  if (!updatedAssignment.secondSkill && skillInfo.skills[1]) {
    updatedAssignment.secondSkill = skillInfo.skills[1];
  }

  return updatedAssignment;
};

export const submitDowntimeSheet = async ({
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
  updateSpellProgressOnSubmission,
  loadSubmittedSheets,
  loadDrafts,
  setActiveTab,
}) => {
  if (
    !selectedCharacter?.id ||
    !user?.id ||
    !selectedYear ||
    !selectedSemester
  ) {
    alert("Missing required information to submit.");
    return false;
  }

  if (dicePool.length === 0) {
    alert("Please roll dice before submitting.");
    return false;
  }

  const hasActivities = formData.activities.some(
    (activity) => activity.activity
  );
  if (!hasActivities) {
    alert("Please select at least one activity.");
    return false;
  }

  const isResubmission =
    currentSheet && currentSheet.review_status === "failure";

  try {
    const processedRollAssignments = { ...rollAssignments };

    formData.activities.forEach((activity, index) => {
      const activityKey = `activity${index + 1}`;
      if (activity.activity && processedRollAssignments[activityKey]) {
        processedRollAssignments[activityKey] = assignAutoSkillsForActivity(
          activity,
          processedRollAssignments[activityKey]
        );
      }
    });

    const submissionData = {
      character_id: selectedCharacter.id,
      user_id: user.id,
      character_name: selectedCharacter.name,
      school_year: selectedYear,
      semester: selectedSemester,
      activities: formData.activities,
      relationships: formData.relationships,
      dice_pool: dicePool,
      roll_assignments: processedRollAssignments,
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

    return true;
  } catch (err) {
    console.error("Error submitting downtime sheet:", err);
    alert("Failed to submit downtime sheet. Please try again.");
    return false;
  }
};
