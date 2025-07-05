import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Save,
  Send,
  Trash2,
  ArrowLeft,
  Copy,
  Download,
  Eye,
  Edit,
  FileText,
} from "lucide-react";

const DowntimeActions = ({
  currentSheet,
  setCurrentSheet,
  formData,
  setFormData,
  rollAssignments,
  setRollAssignments,
  dicePool,
  setDicePool,
  selectedCharacter,
  selectedYear,
  selectedSemester,
  setSelectedYear,
  setSelectedSemester,
  user,
  supabase,
  canEdit,
  isSubmitted,
  setIsSubmitted,
  adminMode,
  isUserAdmin,
  loading,
  setLoading,
  submittedSheets,
  loadSubmittedSheets,
  loadDrafts,
  extraFieldsUnlocked,
  setExtraFieldsUnlocked,
  setActiveTab,
  isYearSemesterSubmitted,
}) => {
  const { theme } = useTheme();

  const enhancedStyles = {
    actionContainer: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      padding: "1.5rem",
      border: `1px solid ${theme.border}`,
      marginTop: "1.5rem",
    },
    actionSection: {
      marginBottom: "1.5rem",
    },
    sectionTitle: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "1rem",
    },
    actionGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "12px",
    },
    primaryButton: {
      padding: "12px 16px",
      backgroundColor: theme.primary,
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: theme.primary + "dd",
      },
      "&:disabled": {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
    secondaryButton: {
      padding: "12px 16px",
      backgroundColor: theme.background,
      color: theme.text,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: theme.primary + "10",
        borderColor: theme.primary,
      },
      "&:disabled": {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
    dangerButton: {
      padding: "12px 16px",
      backgroundColor: theme.error + "15",
      color: theme.error,
      border: `1px solid ${theme.error}`,
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: theme.error + "25",
      },
      "&:disabled": {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
    backButton: {
      padding: "12px 16px",
      backgroundColor: "transparent",
      color: theme.textSecondary,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: theme.background,
        color: theme.text,
      },
    },
    statusIndicator: {
      padding: "8px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "1rem",
    },
    submittedStatus: {
      backgroundColor: theme.success + "20",
      color: theme.success,
    },
    draftStatus: {
      backgroundColor: theme.warning + "20",
      color: theme.warning,
    },
    readOnlyStatus: {
      backgroundColor: theme.textSecondary + "20",
      color: theme.textSecondary,
    },
  };

  const validateForm = () => {
    if (!selectedCharacter || !selectedYear || !selectedSemester) {
      alert("Please select a character, year, and semester.");
      return false;
    }

    if (!formData.activities.some((activity) => activity.activity)) {
      alert("Please add at least one activity.");
      return false;
    }

    return true;
  };

  const saveDraft = async () => {
    if (!validateForm()) return;

    if (!canEdit()) {
      if (currentSheet?.is_draft) {
        alert("You don't have permission to edit this draft.");
      } else if (currentSheet && !currentSheet.is_draft) {
        alert(
          "Cannot save draft - sheet has already been submitted. Only admins can modify submitted sheets."
        );
      } else {
        alert("You don't have permission to save this sheet.");
      }
      return;
    }

    const draftData = {
      character_id: selectedCharacter.id,
      user_id: user.id,
      character_name: selectedCharacter.name,
      year: selectedYear,
      semester: selectedSemester,
      activities: formData.activities,
      selected_magic_school: formData.selectedMagicSchool,

      npc_encounters: formData.npcEncounters || [
        { name: "", successes: [false, false, false, false, false] },
        { name: "", successes: [false, false, false, false, false] },
        { name: "", successes: [false, false, false, false, false] },
      ],
      dice_pool: dicePool,
      roll_assignments: rollAssignments,
      extra_fields_unlocked: extraFieldsUnlocked,
      is_draft: true,
      updated_at: new Date().toISOString(),
    };

    setLoading(true);
    try {
      let result;
      if (currentSheet) {
        const updateData = {
          ...draftData,
          last_edited_at: new Date().toISOString(),
          last_edited_by: user.id,
        };

        const { data, error } = await supabase
          .from("character_downtime")
          .update(updateData)
          .eq("id", currentSheet.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const insertData = {
          ...draftData,
          submitted_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("character_downtime")
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      setCurrentSheet(result);
      setIsSubmitted(false);

      loadSubmittedSheets();
      if (loadDrafts) {
        loadDrafts();
      }

      alert("Draft saved successfully! You can continue editing later.");
    } catch (err) {
      console.error("Error saving draft:", err);
      alert("Failed to save draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitSheet = async () => {
    if (!validateForm()) return;

    if (!canEdit()) {
      alert("You don't have permission to submit this sheet.");
      return;
    }

    if (
      isYearSemesterSubmitted(selectedYear, selectedSemester) &&
      !currentSheet
    ) {
      alert(
        `You have already submitted a downtime sheet for Year ${selectedYear}, Semester ${selectedSemester}. Please check your submitted sheets.`
      );
      return;
    }

    const confirmMessage = currentSheet
      ? "Are you sure you want to update and submit this downtime sheet?"
      : "Are you sure you want to submit this downtime sheet? You won't be able to edit it after submission.";

    if (!window.confirm(confirmMessage)) return;

    const submitData = {
      character_id: selectedCharacter.id,
      user_id: user.id,
      character_name: selectedCharacter.name,
      year: selectedYear,
      semester: selectedSemester,
      activities: formData.activities,
      selected_magic_school: formData.selectedMagicSchool,

      npc_encounters: formData.npcEncounters || [
        { name: "", successes: [false, false, false, false, false] },
        { name: "", successes: [false, false, false, false, false] },
        { name: "", successes: [false, false, false, false, false] },
      ],
      dice_pool: dicePool,
      roll_assignments: rollAssignments,
      extra_fields_unlocked: extraFieldsUnlocked,
      is_draft: false,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setLoading(true);
    try {
      let result;
      if (currentSheet) {
        const { data, error } = await supabase
          .from("character_downtime")
          .update({
            ...submitData,
            last_edited_at: new Date().toISOString(),
            last_edited_by: user.id,
          })
          .eq("id", currentSheet.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from("character_downtime")
          .insert(submitData)
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      setCurrentSheet(result);
      setIsSubmitted(true);

      loadSubmittedSheets();
      if (loadDrafts) {
        loadDrafts();
      }

      alert("Downtime sheet submitted successfully!");
      setActiveTab("submitted");
    } catch (err) {
      console.error("Error submitting sheet:", err);
      alert("Failed to submit downtime sheet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteSheet = async () => {
    if (!currentSheet) return;

    if (!canEdit()) {
      alert("You don't have permission to delete this sheet.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this downtime sheet? This action cannot be undone."
      )
    )
      return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("character_downtime")
        .delete()
        .eq("id", currentSheet.id);

      if (error) throw error;

      setCurrentSheet(null);
      if (setSelectedYear) setSelectedYear("");
      if (setSelectedSemester) setSelectedSemester("");
      if (setFormData) {
        setFormData({
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
          npcEncounters: [
            { name: "", successes: [false, false, false, false, false] },
            { name: "", successes: [false, false, false, false, false] },
            { name: "", successes: [false, false, false, false, false] },
          ],
        });
      }
      if (setDicePool) setDicePool([]);
      if (setRollAssignments) {
        setRollAssignments({
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
          relationship1: { diceIndex: null, skill: "", notes: "" },
          relationship2: { diceIndex: null, skill: "", notes: "" },
          relationship3: { diceIndex: null, skill: "", notes: "" },
        });
      }
      if (setExtraFieldsUnlocked) setExtraFieldsUnlocked(false);
      setIsSubmitted(false);

      loadSubmittedSheets();
      if (loadDrafts) {
        loadDrafts();
      }

      alert("Downtime sheet deleted successfully!");
      setActiveTab("overview");
    } catch (err) {
      console.error("Error deleting sheet:", err);
      alert("Failed to delete downtime sheet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyAsTemplate = () => {
    if (!currentSheet) return;

    setActiveTab("create");
    alert(
      "Sheet copied as template! Select a new year/semester combination to create a new sheet."
    );
  };

  const generateTextSummary = () => {
    let summary = `DOWNTIME SHEET - ${selectedCharacter.name}\n`;
    summary += `Year ${selectedYear}, Semester ${selectedSemester}\n\n`;

    summary += "ACTIVITIES:\n";
    formData.activities.forEach((activity, index) => {
      if (activity.activity) {
        summary += `${index + 1}. ${activity.activity}\n`;
        if (activity.npc) {
          summary += `   NPC: ${activity.npc}\n`;
        }
        const assignment = rollAssignments[`activity${index + 1}`];
        if (assignment?.diceIndex !== null) {
          summary += `   Roll: ${dicePool[assignment.diceIndex]}`;
          if (assignment.skill) {
            summary += ` + ${assignment.skill}`;
          }
          summary += "\n";
        }
        summary += `   Successes: ${
          activity.successes.filter((s) => s).length
        }/5\n\n`;
      }
    });

    summary += "MAGIC SCHOOL FOCUS:\n";
    if (formData.selectedMagicSchool) {
      summary += `- ${formData.selectedMagicSchool}\n`;
    }

    return summary;
  };

  const exportToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateTextSummary());
      alert("Downtime sheet copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Failed to copy to clipboard.");
    }
  };

  const renderActions = () => {
    if (
      selectedYear &&
      selectedSemester &&
      isYearSemesterSubmitted(selectedYear, selectedSemester) &&
      !currentSheet
    ) {
      return (
        <div style={enhancedStyles.actionContainer}>
          <div
            style={{
              ...enhancedStyles.statusIndicator,
              ...enhancedStyles.readOnlyStatus,
            }}
          >
            <Eye size={14} />
            Combination Already Submitted
          </div>
          <div style={enhancedStyles.actionGrid}>
            <button
              onClick={() => setActiveTab("submitted")}
              style={enhancedStyles.primaryButton}
            >
              <Eye size={16} />
              View Submitted Sheets
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              style={enhancedStyles.backButton}
            >
              <ArrowLeft size={16} />
              Back to Overview
            </button>
          </div>
        </div>
      );
    }

    const isDraft = currentSheet && currentSheet.is_draft;
    const isSubmittedSheet = currentSheet && !currentSheet.is_draft;
    const userCanEdit = canEdit();

    return (
      <div style={enhancedStyles.actionContainer}>
        {/* Status Indicator */}
        {currentSheet && (
          <div
            style={{
              ...enhancedStyles.statusIndicator,
              ...(isSubmittedSheet
                ? enhancedStyles.submittedStatus
                : isDraft
                ? enhancedStyles.draftStatus
                : enhancedStyles.readOnlyStatus),
            }}
          >
            {isSubmittedSheet ? (
              <>
                <Send size={14} />
                Submitted Sheet {!userCanEdit && "(Read Only)"}
              </>
            ) : isDraft ? (
              <>
                <Edit size={14} />
                Draft Sheet {!userCanEdit && "(Read Only)"}
              </>
            ) : (
              <>
                <Eye size={14} />
                View Only
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={enhancedStyles.actionSection}>
          <h3 style={enhancedStyles.sectionTitle}>
            {currentSheet ? (
              userCanEdit ? (
                <Edit size={18} />
              ) : (
                <Eye size={18} />
              )
            ) : (
              <Save size={18} />
            )}
            {currentSheet
              ? userCanEdit
                ? "Edit Actions"
                : "View Actions"
              : "Create Actions"}
          </h3>

          <div style={enhancedStyles.actionGrid}>
            {/* Create/Edit Mode Actions */}
            {userCanEdit && (
              <>
                <button
                  onClick={saveDraft}
                  style={enhancedStyles.secondaryButton}
                  disabled={loading}
                >
                  <Save size={16} />
                  {currentSheet ? "Save Changes" : "Save Draft"}
                </button>

                <button
                  onClick={submitSheet}
                  style={enhancedStyles.primaryButton}
                  disabled={loading}
                >
                  <Send size={16} />
                  {currentSheet ? "Update & Submit" : "Submit Sheet"}
                </button>

                {currentSheet && (
                  <button
                    onClick={deleteSheet}
                    style={enhancedStyles.dangerButton}
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
              </>
            )}

            {/* View Mode Actions */}
            {currentSheet && !userCanEdit && (
              <>
                <button
                  onClick={copyAsTemplate}
                  style={enhancedStyles.secondaryButton}
                >
                  <Copy size={16} />
                  Copy as Template
                </button>

                <button
                  onClick={exportToClipboard}
                  style={enhancedStyles.secondaryButton}
                >
                  <Download size={16} />
                  Export Text
                </button>
              </>
            )}

            {/* Navigation Actions */}
            <button
              onClick={() => setActiveTab("overview")}
              style={enhancedStyles.backButton}
            >
              <ArrowLeft size={16} />
              Back to Overview
            </button>

            {submittedSheets.length > 0 && (
              <button
                onClick={() => setActiveTab("submitted")}
                style={enhancedStyles.secondaryButton}
              >
                <FileText size={16} />
                View All Submitted
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return renderActions();
};

export default DowntimeActions;
