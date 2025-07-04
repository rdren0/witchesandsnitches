import { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getDowntimeStyles } from "../../styles/masterStyles";
import {
  Calendar,
  Plus,
  FileText,
  Eye,
  CheckCircle,
  Edit3,
  Trash2,
} from "lucide-react";

import DicePoolManager from "./DicePoolManager";
import ActivityManager from "./ActivityManager";
import DowntimeActions from "./DowntimeActions";

const DowntimeSheet = ({
  selectedCharacter,
  user,
  supabase,
  adminMode,
  isUserAdmin,
}) => {
  const { theme } = useTheme();

  const styles = useMemo(() => getDowntimeStyles(theme), [theme]);

  const [activeTab, setActiveTab] = useState("overview");
  const [submittedSheets, setSubmittedSheets] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewingSheet, setViewingSheet] = useState(null);
  const [drafts, setDrafts] = useState([]);

  const [currentSheet, setCurrentSheet] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [extraFieldsUnlocked, setExtraFieldsUnlocked] = useState(false);

  const [dicePool, setDicePool] = useState([]);
  const [rollAssignments, setRollAssignments] = useState({
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

  const [formData, setFormData] = useState({
    activities: [
      { activity: "", npc: "", successes: [false, false, false, false, false] },
      { activity: "", npc: "", successes: [false, false, false, false, false] },
      { activity: "", npc: "", successes: [false, false, false, false, false] },
    ],
    selectedMagicSchool: "",
  });

  const availableActivities = useMemo(
    () => [
      "",
      "Gain a Job - Roll Persuasion or an appropriate skill check (e.g., Magical Creatures at the Magical Menagerie)",
      "Promotion - If already employed, students can attempt a promotion with Persuasion or an appropriate skill check.",
      "Work Job - Roll to determine earnings based on job difficulty.",
      "Shopping - Purchase items from the shopping list. No haggling.",
      "Selling - Sell items at half their original price. No haggling.",
      "Allowance - Roll based on family wealth to determine allowance received.",
      "Explore the Castle - Roll Investigation to uncover new locations and secrets.",
      "Explore the Forbidden Forest -  Requires Stealth and Investigation rolls.",
      "Restricted Section - Requires Stealth and Investigation rolls.",
      "Search for Magical Creatures - Roll Magical Creatures.",
      "Search for Plants - Roll Herbology.",
      "Stealing - Roll Sleight of Hand and Investigation.",
      "Spread Rumors - Roll Deception, Intimidation, Performance, or Persuasion.",
      "Dig for Dirt - Roll Investigation, Insight, Intimidation, or Persuasion.",
      "Prank Other Students - Players can attempt mischievous acts.",
      "Increase an Ability Score - Must succeed on three separate checks using separate downtime slots.",
      "Gain Proficiency or Expertise - Must succeed on three separate checks using separate downtime slots.",
      "Increase Wand Stat - Roll against a DC based on the current Wand Stat.",
      "Research Spells - Roll History of Magic to research a spell.",
      "Attempt a Spell - Practice casting any spell previously researched or attempted.",
      "Create a Spell - Must succeed on three separate checks using separate downtime slots.",
      "Studying - Improve performance in classes through focused study.",
      "Research a Topic - Roll Investigation to gather information.",
      "Craft Items - Roll with the appropriate tool proficiency.",
      "Brew a Potion - Requires Proficiency with a Potioneer's Kit and a Potion Making check.",
      "Invent a Potion - Must succeed on three separate checks using separate downtime slots.",
      "Cooking - Roll Survival to prepare meals.",
      "Learn a Recipe - Roll Survival to memorize a recipe.",
      "Create a New Recipe - Must succeed on three separate checks using separate downtime slots.",
      "Engineer Plants - Must succeed on three separate checks using separate downtime slots.",
      "Hire a Tutor - Seek out private instruction.",
      "Teacher Tutor - Receive guidance from a professor.",
      "Animagus Form (RP) - Engage in roleplay to explore an Animagus transformation.",
    ],
    []
  );

  const dashboardStyles = useMemo(
    () => ({
      container: {
        ...styles.container,
        maxWidth: "1200px",
        margin: "0 auto",
      },
      header: {
        display: "flex",
        alignItems: "center",
        marginBottom: "2rem",
        padding: "1.5rem",
        backgroundColor: theme.surface,
        borderRadius: "12px",
        border: `1px solid ${theme.border}`,
      },
      headerIcon: {
        marginRight: "1rem",
        padding: "12px",
        backgroundColor: theme.primary + "15",
        borderRadius: "8px",
      },
      headerContent: {
        flex: 1,
      },
      title: {
        fontSize: "24px",
        fontWeight: "bold",
        color: theme.text,
        margin: 0,
      },
      subtitle: {
        fontSize: "14px",
        color: theme.textSecondary,
        margin: "4px 0 0 0",
      },
      tabNavigation: {
        display: "flex",
        backgroundColor: theme.surface,
        borderRadius: "12px",
        padding: "8px",
        marginBottom: "2rem",
        border: `1px solid ${theme.border}`,
        gap: "4px",
      },
      tab: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px 16px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "transparent",
        color: theme.textSecondary,
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.2s ease",
        position: "relative",
      },
      activeTab: {
        backgroundColor: theme.primary,
        color: "white",
      },
      tabBadge: {
        backgroundColor: theme.warning,
        color: "white",
        borderRadius: "12px",
        padding: "2px 6px",
        fontSize: "12px",
        minWidth: "18px",
        textAlign: "center",
      },
      content: {
        backgroundColor: theme.surface,
        borderRadius: "12px",
        padding: "2rem",
        border: `1px solid ${theme.border}`,
        minHeight: "400px",
      },
    }),
    [theme, styles]
  );

  const loadSubmittedSheets = useCallback(async () => {
    if (!selectedCharacter?.id || !user?.id) return;

    setLoading(true);
    try {
      const { data: sheets, error } = await supabase
        .from("character_downtime")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .eq("user_id", user.id)
        .eq("is_draft", false)
        .order("year", { ascending: true })
        .order("semester", { ascending: true });

      if (error) throw error;
      setSubmittedSheets(sheets || []);
    } catch (err) {
      console.error("Error loading submitted sheets:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCharacter?.id, user?.id, supabase]);

  const loadDrafts = useCallback(async () => {
    if (!selectedCharacter?.id || !user?.id) return;

    setLoading(true);
    try {
      const { data: draftSheets, error } = await supabase
        .from("character_downtime")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .eq("user_id", user.id)
        .eq("is_draft", true)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setDrafts(draftSheets || []);
    } catch (err) {
      console.error("Error loading drafts:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCharacter?.id, user?.id, supabase]);

  const loadSheetForViewing = useCallback(
    async (sheetId) => {
      console.log("Loading sheet for viewing:", sheetId);

      if (!sheetId) {
        console.error("No sheet ID provided");
        alert("Invalid sheet ID");
        return;
      }

      if (!user?.id) {
        console.error("User ID not available");
        alert("User not authenticated");
        return;
      }

      setLoading(true);
      try {
        console.log("Fetching sheet from database...");
        const { data: sheet, error } = await supabase
          .from("character_downtime")
          .select("*")
          .eq("id", sheetId)
          .eq("user_id", user.id)
          .single();

        console.log("Database response:", { sheet, error });

        if (error) {
          console.error("Database error:", error);
          throw error;
        }

        if (!sheet) {
          console.error("No sheet found");
          alert("Sheet not found or you don't have permission to view it.");
          return;
        }

        console.log("Setting viewing sheet and switching to view mode");
        setViewingSheet(sheet);
        setViewMode("viewing");
      } catch (err) {
        console.error("Error loading sheet for viewing:", err);
        alert(`Failed to load sheet details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [supabase, user?.id]
  );

  const isYearSemesterSubmitted = useCallback(
    (year, semester) => {
      return submittedSheets.some(
        (sheet) => sheet.year === year && sheet.semester === semester
      );
    },
    [submittedSheets]
  );

  const getSubmittedCombinations = useCallback(() => {
    return submittedSheets.map((sheet) => ({
      year: sheet.year,
      semester: sheet.semester,
      id: sheet.id,
      submitted_at: sheet.submitted_at,
    }));
  }, [submittedSheets]);

  const getYearAvailability = useCallback(() => {
    const allYears = [1, 2, 3, 4, 5, 6, 7];

    return allYears.map((year) => {
      const submittedSemesters = submittedSheets
        .filter((sheet) => sheet.year === year)
        .map((sheet) => sheet.semester);

      const availableSemesters = [1, 2].filter(
        (sem) => !submittedSemesters.includes(sem)
      );

      return {
        year,
        hasSubmissions: submittedSemesters.length > 0,
        fullyCompleted: submittedSemesters.length === 2,
        availableSemesters,
        submittedSemesters,
      };
    });
  }, [submittedSheets]);

  const getSemesterAvailability = useCallback(() => {
    if (!selectedYear) return [];

    return [1, 2].map((semester) => {
      const isSubmitted = isYearSemesterSubmitted(selectedYear, semester);
      return {
        semester,
        isSubmitted,
        isAvailable: !isSubmitted,
      };
    });
  }, [selectedYear, isYearSemesterSubmitted]);

  const yearAvailability = useMemo(
    () => getYearAvailability(),
    [getYearAvailability]
  );
  const semesterAvailability = useMemo(
    () => getSemesterAvailability(),
    [getSemesterAvailability]
  );

  const handleYearChange = useCallback(
    (e) => {
      const newYear = parseInt(e.target.value) || "";
      setSelectedYear(newYear);

      if (newYear && selectedSemester) {
        const wouldBeSubmitted = submittedSheets.some(
          (sheet) =>
            sheet.year === newYear &&
            sheet.semester === parseInt(selectedSemester)
        );
        if (wouldBeSubmitted) {
          setSelectedSemester("");
        }
      } else if (!newYear) {
        setSelectedSemester("");
      }
    },
    [submittedSheets, selectedSemester]
  );

  const handleSemesterChange = useCallback((e) => {
    const newSemester = parseInt(e.target.value) || "";
    setSelectedSemester(newSemester);
  }, []);

  const requiresDualChecks = useCallback((activityText) => {
    const text = activityText.toLowerCase();
    return (
      text.includes("stealth and investigation") ||
      text.includes("sleight of hand and investigation") ||
      (text.includes(" and ") &&
        (text.includes("roll") || text.includes("requires")))
    );
  }, []);

  const hasDualCheckActivity = useCallback(() => {
    return formData.activities.some((activity) =>
      requiresDualChecks(activity.activity)
    );
  }, [formData.activities, requiresDualChecks]);

  const canEdit = useCallback(() => {
    if (isUserAdmin) {
      return true;
    }

    if (!currentSheet) {
      return true;
    }

    if (currentSheet.is_draft) {
      return currentSheet.user_id === user?.id;
    }

    return false;
  }, [isUserAdmin, currentSheet, user?.id]);

  const assignDice = useCallback(
    (assignment, diceIndex, isSecondDie = false) => {
      if (!canEdit()) return;

      setRollAssignments((prev) => ({
        ...prev,
        [assignment]: {
          ...prev[assignment],
          [isSecondDie ? "secondDiceIndex" : "diceIndex"]: diceIndex,
        },
      }));
    },
    [canEdit]
  );

  const unassignDice = useCallback(
    (assignment, isSecondDie = false) => {
      if (!canEdit()) return;

      setRollAssignments((prev) => ({
        ...prev,
        [assignment]: {
          ...prev[assignment],
          [isSecondDie ? "secondDiceIndex" : "diceIndex"]: null,
        },
      }));
    },
    [canEdit]
  );

  const getDiceUsage = useCallback(
    (diceIndex) => {
      for (const [assignmentKey, assignment] of Object.entries(
        rollAssignments
      )) {
        if (assignment.diceIndex === diceIndex) {
          return { assignment: assignmentKey, isSecond: false };
        }
        if (assignment.secondDiceIndex === diceIndex) {
          return { assignment: assignmentKey, isSecond: true };
        }
      }
      return null;
    },
    [rollAssignments]
  );

  const getSortedDiceOptions = useCallback(() => {
    return dicePool
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value);
  }, [dicePool]);

  const loadSheet = useCallback(async () => {
    if (!selectedCharacter?.id || !user || !selectedYear || !selectedSemester) {
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("character_downtime")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .eq("user_id", user.id)
        .eq("year", selectedYear)
        .eq("semester", selectedSemester)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setCurrentSheet(data);
        setFormData({
          activities: data.activities || formData.activities,
          selectedMagicSchool: data.selected_magic_school || "",
        });
        setDicePool(data.dice_pool || []);
        setRollAssignments(data.roll_assignments || rollAssignments);
        setExtraFieldsUnlocked(data.extra_fields_unlocked || false);
        setIsSubmitted(!!data.submitted_at);
        setIsEditing(false);
      } else {
        setCurrentSheet(null);
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
        });
        setDicePool([]);
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
        setExtraFieldsUnlocked(false);
        setIsSubmitted(false);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error loading sheet:", err);
      alert("Failed to load downtime sheet. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedCharacter?.id, selectedYear, selectedSemester, supabase]);

  useEffect(() => {
    if (selectedCharacter?.id && user?.id) {
      loadSubmittedSheets();
      loadDrafts();
    }
  }, [selectedCharacter?.id, user?.id, loadSubmittedSheets, loadDrafts]);

  useEffect(() => {
    if (selectedYear && selectedSemester) {
      loadSheet();
    }
  }, [selectedYear, selectedSemester, loadSheet]);

  const tabs = useMemo(
    () => [
      {
        id: "overview",
        label: "Overview",
        icon: Calendar,
        description: "View your downtime summary",
      },
      {
        id: "drafts",
        label: "Drafts",
        icon: Edit3,
        description: "Continue working on saved drafts",
        badge: drafts.length,
      },
      {
        id: "create",
        label: "Create New",
        icon: Plus,
        description: "Create a new downtime sheet",
      },
      {
        id: "submitted",
        label: "Submitted Sheets",
        icon: FileText,
        description: "View your submitted downtime sheets",
        badge: submittedSheets.length,
      },
    ],
    [drafts.length, submittedSheets.length]
  );

  const DraftsTab = () => {
    const handleEditDraft = useCallback(async (draft) => {
      try {
        setSelectedYear(draft.year);
        setSelectedSemester(draft.semester);

        setActiveTab("create");
      } catch (err) {
        console.error("Error loading draft for editing:", err);
        alert("Failed to load draft for editing.");
      }
    }, []);

    const handleDeleteDraft = useCallback(
      async (draftId) => {
        if (
          !window.confirm(
            "Are you sure you want to delete this draft? This action cannot be undone."
          )
        ) {
          return;
        }

        setLoading(true);
        try {
          const { error } = await supabase
            .from("character_downtime")
            .delete()
            .eq("id", draftId);

          if (error) throw error;

          loadDrafts();
          alert("Draft deleted successfully.");
        } catch (err) {
          console.error("Error deleting draft:", err);
          alert("Failed to delete draft. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      [supabase, loadDrafts]
    );

    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ color: theme.text, margin: 0 }}>
            Draft Downtime Sheets
          </h3>
          <button
            onClick={loadDrafts}
            style={{
              padding: "8px 16px",
              backgroundColor: theme.background,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: theme.textSecondary,
            }}
          >
            Loading drafts...
          </div>
        ) : drafts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: theme.textSecondary,
              backgroundColor: theme.background,
              borderRadius: "12px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <Edit3 size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
            <h3>No Draft Sheets</h3>
            <p>You don't have any draft downtime sheets yet.</p>
            <button
              onClick={() => setActiveTab("create")}
              style={{
                marginTop: "1rem",
                padding: "12px 24px",
                backgroundColor: theme.primary,
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Plus size={16} />
              Create New Sheet
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {drafts.map((draft) => (
              <div
                key={draft.id}
                style={{
                  backgroundColor: theme.surface,
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: `1px solid ${theme.border}`,
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h4 style={{ color: theme.text, margin: "0 0 0.5rem 0" }}>
                      Year {draft.year}, Semester {draft.semester}
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "14px",
                        color: theme.textSecondary,
                      }}
                    >
                      <span>🟡 Draft</span>
                      <span>
                        Last edited:{" "}
                        {new Date(draft.updated_at).toLocaleDateString()}
                      </span>
                      {draft.activities?.length > 0 && (
                        <span>{draft.activities.length} activities</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleEditDraft(draft)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: theme.primary,
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Edit3 size={14} />
                      Continue Editing
                    </button>
                    <button
                      onClick={() => handleDeleteDraft(draft.id)}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: theme.error,
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {draft.activities && draft.activities.length > 0 && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      backgroundColor: theme.background,
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: theme.textSecondary,
                        marginBottom: "0.5rem",
                      }}
                    >
                      ACTIVITIES PREVIEW:
                    </div>
                    {draft.activities.slice(0, 2).map((activity, index) => (
                      <div
                        key={index}
                        style={{
                          fontSize: "14px",
                          color: theme.text,
                          marginBottom: "0.25rem",
                        }}
                      >
                        • {activity.activity || "Empty activity"}
                      </div>
                    ))}
                    {draft.activities.length > 2 && (
                      <div
                        style={{
                          fontSize: "14px",
                          color: theme.textSecondary,
                          fontStyle: "italic",
                        }}
                      >
                        ...and {draft.activities.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const inlineStyles = useMemo(
    () => ({
      headingStyle: { color: theme.text, marginBottom: "1.5rem" },
      sectionStyle: { marginBottom: "2rem" },
      selectionContainer: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem",
        marginBottom: "1rem",
      },
      radioGroupContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      },
      groupLabel: {
        fontSize: "16px",
        fontWeight: "bold",
        color: theme.text,
        marginBottom: "12px",
      },
      radioGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "8px",
      },
      radioOption: {
        display: "flex",
        alignItems: "center",
        padding: "10px 12px",
        borderRadius: "8px",
        border: `2px solid ${theme.border}`,
        backgroundColor: theme.surface,
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontSize: "14px",
        position: "relative",
      },
      radioOptionSelected: {
        borderColor: theme.primary,
        backgroundColor: theme.primary + "15",
        color: theme.primary,
        fontWeight: "500",
      },
      radioOptionDisabled: {
        backgroundColor: theme.background,
        color: theme.textSecondary,
        cursor: "not-allowed",
        opacity: 0.6,
      },
      radioOptionSubmitted: {
        backgroundColor: theme.success + "15",
        borderColor: theme.success,
        color: theme.success,
        cursor: "not-allowed",
      },
      radioInput: {
        marginRight: "8px",
        accentColor: theme.primary,
      },
      submittedBadge: {
        fontSize: "10px",
        padding: "2px 4px",
        backgroundColor: theme.success,
        color: "white",
        borderRadius: "3px",
        marginLeft: "auto",
        fontWeight: "bold",
      },
      warningStyle: {
        padding: "12px",
        backgroundColor: theme.warning + "20",
        border: `1px solid ${theme.warning}`,
        borderRadius: "8px",
        color: theme.warning,
        fontSize: "14px",
      },
    }),
    [theme]
  );

  const OverviewTab = () => (
    <div>
      <h3 style={{ color: theme.text, marginBottom: "1.5rem" }}>
        Downtime Overview - {selectedCharacter?.name}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: theme.background,
            borderRadius: "8px",
            border: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <CheckCircle size={20} color={theme.success} />
            <h4 style={{ color: theme.text, margin: 0 }}>Submitted Sheets</h4>
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: theme.primary,
            }}
          >
            {submittedSheets.length}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h4 style={{ color: theme.text, marginBottom: "1rem" }}>
          Recent Submissions
        </h4>
        {submittedSheets.length > 0 ? (
          <div style={{ display: "grid", gap: "8px" }}>
            {submittedSheets
              .slice(-3)
              .reverse()
              .map((sheet) => (
                <div
                  key={sheet.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    backgroundColor: theme.background,
                    borderRadius: "6px",
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <span style={{ color: theme.text }}>
                    Year {sheet.year}, Semester {sheet.semester}
                  </span>
                  <span
                    style={{ color: theme.textSecondary, fontSize: "12px" }}
                  >
                    {new Date(sheet.submitted_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: theme.textSecondary,
              backgroundColor: theme.background,
              borderRadius: "8px",
              border: `1px solid ${theme.border}`,
            }}
          >
            No downtime sheets submitted yet
          </div>
        )}
      </div>

      <div>
        <h4 style={{ color: theme.text, marginBottom: "1rem" }}>
          Quick Actions
        </h4>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => setActiveTab("create")}
            style={{
              padding: "12px 24px",
              backgroundColor: theme.primary,
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Plus size={16} />
            Create New Sheet
          </button>
          {submittedSheets.length > 0 && (
            <button
              onClick={() => setActiveTab("submitted")}
              style={{
                padding: "12px 24px",
                backgroundColor: theme.background,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FileText size={16} />
              View Submitted Sheets
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const SubmittedSheetsTab = () => {
    if (viewMode === "viewing" && viewingSheet) {
      return <ViewingSheetForm />;
    }

    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ color: theme.text, margin: 0 }}>
            Submitted Downtime Sheets
          </h3>
          <button
            onClick={loadSubmittedSheets}
            style={{
              padding: "8px 16px",
              backgroundColor: theme.background,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: theme.textSecondary,
            }}
          >
            Loading submitted sheets...
          </div>
        ) : submittedSheets.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              backgroundColor: theme.background,
              borderRadius: "8px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <FileText
              size={48}
              color={theme.textSecondary}
              style={{ marginBottom: "1rem" }}
            />
            <h4 style={{ color: theme.text, marginBottom: "0.5rem" }}>
              No Submitted Sheets
            </h4>
            <p style={{ color: theme.textSecondary, marginBottom: "1.5rem" }}>
              You haven't submitted any downtime sheets yet.
            </p>
            <button
              onClick={() => setActiveTab("create")}
              style={{
                padding: "12px 24px",
                backgroundColor: theme.primary,
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Plus size={16} />
              Create Your First Sheet
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                gap: "1rem",
                padding: "12px 16px",
                backgroundColor: theme.background,
                borderRadius: "8px",
                border: `1px solid ${theme.border}`,
                fontWeight: "600",
                fontSize: "14px",
                color: theme.text,
              }}
            >
              <div>Academic Year</div>
              <div>Semester</div>
              <div>Submitted Date</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {submittedSheets.map((sheet) => (
              <div
                key={sheet.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                  gap: "1rem",
                  padding: "16px",
                  backgroundColor: theme.surface,
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  alignItems: "center",
                }}
              >
                <div style={{ color: theme.text, fontWeight: "500" }}>
                  Year {sheet.year}
                </div>
                <div style={{ color: theme.text }}>
                  Semester {sheet.semester}
                </div>
                <div style={{ color: theme.textSecondary, fontSize: "14px" }}>
                  {new Date(sheet.submitted_at).toLocaleDateString()}
                </div>
                <div>
                  <span
                    style={{
                      padding: "4px 8px",
                      backgroundColor: sheet.admin_completed
                        ? theme.success + "20"
                        : theme.primary + "20",
                      color: sheet.admin_completed
                        ? theme.success
                        : theme.primary,
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {sheet.admin_completed ? "Completed" : "Submitted"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => {
                      console.log("View button clicked for sheet:", sheet.id);
                      loadSheetForViewing(sheet.id);
                    }}
                    disabled={loading}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: loading
                        ? theme.textSecondary
                        : theme.primary,
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      opacity: loading ? 0.6 : 1,
                    }}
                    title="View Sheet Details"
                  >
                    <Eye size={14} />
                    {loading ? "Loading..." : "View"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ViewingSheetForm = () => {
    const getAbilityModifier = useCallback((score) => {
      return Math.floor((score - 10) / 2);
    }, []);

    const getSkillModifier = useCallback(
      (skillName) => {
        if (!skillName || !selectedCharacter) return 0;

        const skills = {
          acrobatics: { ability: "dexterity" },
          "animal handling": { ability: "wisdom" },
          arcana: { ability: "intelligence" },
          athletics: { ability: "strength" },
          deception: { ability: "charisma" },
          history: { ability: "intelligence" },
          insight: { ability: "wisdom" },
          intimidation: { ability: "charisma" },
          investigation: { ability: "intelligence" },
          medicine: { ability: "wisdom" },
          nature: { ability: "intelligence" },
          perception: { ability: "wisdom" },
          performance: { ability: "charisma" },
          persuasion: { ability: "charisma" },
          religion: { ability: "intelligence" },
          "sleight of hand": { ability: "dexterity" },
          stealth: { ability: "dexterity" },
          survival: { ability: "wisdom" },
        };

        const skill = skills[skillName.toLowerCase()];
        if (!skill) return 0;

        const abilityMod = getAbilityModifier(
          selectedCharacter[skill.ability] || 10
        );
        const skillLevel = selectedCharacter.skills?.[skillName] || 0;
        const profBonus = selectedCharacter.proficiencyBonus || 2;

        if (skillLevel === 0) return abilityMod;
        if (skillLevel === 1) return abilityMod + profBonus;
        if (skillLevel === 2) return abilityMod + 2 * profBonus;

        return abilityMod;
      },
      [getAbilityModifier]
    );

    const getWandModifier = useCallback((wandModifierName) => {
      if (!selectedCharacter?.magicModifiers || !wandModifierName) return 0;
      return selectedCharacter.magicModifiers[wandModifierName] || 0;
    }, []);

    const getModifierValue = useCallback(
      (modifierName) => {
        if (!modifierName) return 0;
        if (modifierName.startsWith("wand_")) {
          return getWandModifier(modifierName.replace("wand_", ""));
        }
        return getSkillModifier(modifierName);
      },
      [getSkillModifier, getWandModifier]
    );

    const formatModifier = useCallback((modifier) => {
      if (modifier >= 0) return `+${modifier}`;
      return `${modifier}`;
    }, []);

    const formStyles = useMemo(
      () => ({
        container: {
          backgroundColor: theme.surface,
          borderRadius: "12px",
          padding: "24px",
          border: `2px solid ${theme.border}`,
        },
        header: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: `1px solid ${theme.border}`,
        },
        backButton: {
          padding: "8px 16px",
          backgroundColor: theme.background,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        },
        section: {
          marginBottom: "24px",
          padding: "16px",
          backgroundColor: theme.background,
          borderRadius: "8px",
          border: `1px solid ${theme.border}`,
        },
        sectionTitle: {
          fontSize: "16px",
          fontWeight: "600",
          color: theme.text,
          marginBottom: "12px",
        },
        infoGrid: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "16px",
        },
        infoItem: {
          padding: "8px 12px",
          backgroundColor: theme.surface,
          borderRadius: "6px",
          border: `1px solid ${theme.border}`,
        },
        label: {
          fontSize: "12px",
          fontWeight: "600",
          color: theme.textSecondary,
          textTransform: "uppercase",
          marginBottom: "4px",
        },
        value: {
          fontSize: "14px",
          color: theme.text,
        },
        diceGrid: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
          gap: "8px",
          marginBottom: "16px",
        },
        diceItem: {
          padding: "12px",
          backgroundColor: theme.primary + "20",
          color: theme.primary,
          borderRadius: "8px",
          textAlign: "center",
          fontWeight: "600",
          fontSize: "16px",
        },
        activityCard: {
          padding: "16px",
          backgroundColor: theme.surface,
          borderRadius: "8px",
          border: `1px solid ${theme.border}`,
          marginBottom: "12px",
        },
        activityTitle: {
          fontSize: "16px",
          fontWeight: "600",
          color: theme.text,
          marginBottom: "12px",
        },
        successIndicator: {
          display: "inline-block",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          margin: "0 4px",
          border: `2px solid ${theme.border}`,
        },
        successTrue: {
          backgroundColor: theme.success,
          borderColor: theme.success,
        },
        successFalse: {
          backgroundColor: "transparent",
          borderColor: theme.border,
        },
        rollDetailCard: {
          marginTop: "12px",
          padding: "12px",
          backgroundColor: theme.background,
          borderRadius: "6px",
          border: `1px solid ${theme.primary}20`,
        },
        rollValue: {
          fontWeight: "600",
          color: theme.primary,
        },
        feedbackSection: {
          padding: "16px",
          backgroundColor: theme.warning + "10",
          border: `2px solid ${theme.warning}`,
          borderRadius: "8px",
          marginTop: "16px",
        },
        noFeedback: {
          padding: "16px",
          backgroundColor: theme.background,
          border: `1px solid ${theme.border}`,
          borderRadius: "8px",
          textAlign: "center",
          color: theme.textSecondary,
          fontStyle: "italic",
        },
      }),
      []
    );

    if (!viewingSheet) return null;

    return (
      <div>
        <div style={formStyles.header}>
          <h3 style={{ color: theme.text, margin: 0 }}>
            Viewing: {viewingSheet.character_name} - Year {viewingSheet.year},
            Semester {viewingSheet.semester}
          </h3>
          <button
            onClick={() => {
              setViewMode("list");
              setViewingSheet(null);
            }}
            style={formStyles.backButton}
          >
            ← Back to List
          </button>
        </div>

        <div style={formStyles.container}>
          <div style={formStyles.section}>
            <h4 style={formStyles.sectionTitle}>Character Information</h4>
            <div style={formStyles.infoGrid}>
              <div style={formStyles.infoItem}>
                <div style={formStyles.label}>Character Name</div>
                <div style={formStyles.value}>
                  {viewingSheet.character_name}
                </div>
              </div>
              <div style={formStyles.infoItem}>
                <div style={formStyles.label}>Academic Period</div>
                <div style={formStyles.value}>
                  Year {viewingSheet.year}, Semester {viewingSheet.semester}
                </div>
              </div>
              <div style={formStyles.infoItem}>
                <div style={formStyles.label}>Submitted</div>
                <div style={formStyles.value}>
                  {new Date(viewingSheet.submitted_at).toLocaleString()}
                </div>
              </div>
              <div style={formStyles.infoItem}>
                <div style={formStyles.label}>Status</div>
                <div style={formStyles.value}>
                  {viewingSheet.admin_completed
                    ? "✅ Completed by Admin"
                    : "📋 Submitted"}
                </div>
              </div>
            </div>
          </div>

          {viewingSheet.selected_magic_school && (
            <div style={formStyles.section}>
              <h4 style={formStyles.sectionTitle}>Magic School Selection</h4>
              <div style={formStyles.value}>
                {viewingSheet.selected_magic_school}
              </div>
            </div>
          )}

          {viewingSheet.dice_pool && viewingSheet.dice_pool.length > 0 && (
            <div style={formStyles.section}>
              <h4 style={formStyles.sectionTitle}>Dice Pool</h4>
              <div style={formStyles.diceGrid}>
                {viewingSheet.dice_pool.map((dice, index) => (
                  <div key={index} style={formStyles.diceItem}>
                    {dice}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={formStyles.section}>
            <h4 style={formStyles.sectionTitle}>Activities</h4>
            {viewingSheet.activities && viewingSheet.activities.length > 0 ? (
              viewingSheet.activities.map((activity, index) => (
                <div key={index} style={formStyles.activityCard}>
                  <div style={formStyles.activityTitle}>
                    Activity {index + 1}
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <div style={formStyles.label}>Selected Activity</div>
                    <div style={formStyles.value}>
                      {activity.activity || "Not selected"}
                    </div>
                  </div>

                  {activity.npc && (
                    <div style={{ marginBottom: "12px" }}>
                      <div style={formStyles.label}>NPC/Location</div>
                      <div style={formStyles.value}>{activity.npc}</div>
                    </div>
                  )}

                  {activity.description && (
                    <div style={{ marginBottom: "12px" }}>
                      <div style={formStyles.label}>Description</div>
                      <div style={formStyles.value}>{activity.description}</div>
                    </div>
                  )}

                  {activity.successes && (
                    <div style={{ marginBottom: "12px" }}>
                      <div style={formStyles.label}>Success Tracking</div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {activity.successes.map((success, successIndex) => (
                          <span
                            key={successIndex}
                            style={{
                              ...formStyles.successIndicator,
                              ...(success
                                ? formStyles.successTrue
                                : formStyles.successFalse),
                            }}
                            title={`Success ${successIndex + 1}: ${
                              success ? "Achieved" : "Not achieved"
                            }`}
                          />
                        ))}
                        <span
                          style={{
                            marginLeft: "8px",
                            color: theme.textSecondary,
                          }}
                        >
                          ({activity.successes.filter((s) => s).length}/5
                          successes)
                        </span>
                      </div>
                    </div>
                  )}

                  {viewingSheet.roll_assignments &&
                    viewingSheet.roll_assignments[`activity${index + 1}`] && (
                      <div style={formStyles.rollDetailCard}>
                        <div style={formStyles.label}>Roll Details</div>
                        {(() => {
                          const assignment =
                            viewingSheet.roll_assignments[
                              `activity${index + 1}`
                            ];

                          return (
                            <div>
                              {assignment.diceIndex !== null &&
                                viewingSheet.dice_pool && (
                                  <div style={{ marginBottom: "8px" }}>
                                    {assignment.skill ? (
                                      (() => {
                                        const diceValue =
                                          viewingSheet.dice_pool[
                                            assignment.diceIndex
                                          ];
                                        const modifier = getModifierValue(
                                          assignment.skill
                                        );
                                        const total = diceValue + modifier;

                                        return (
                                          <div style={formStyles.value}>
                                            <span style={formStyles.rollValue}>
                                              Primary Roll:
                                            </span>{" "}
                                            d20({diceValue}){" "}
                                            {formatModifier(modifier)} = {total}
                                            <br />
                                            <small
                                              style={{
                                                color: theme.textSecondary,
                                              }}
                                            >
                                              Using {assignment.skill}{" "}
                                              {formatModifier(modifier)}
                                            </small>
                                          </div>
                                        );
                                      })()
                                    ) : (
                                      <div style={formStyles.value}>
                                        <span style={formStyles.rollValue}>
                                          Primary Roll:
                                        </span>{" "}
                                        d20(
                                        {
                                          viewingSheet.dice_pool[
                                            assignment.diceIndex
                                          ]
                                        }
                                        )
                                      </div>
                                    )}
                                  </div>
                                )}

                              {assignment.secondDiceIndex !== null &&
                                viewingSheet.dice_pool && (
                                  <div style={{ marginBottom: "8px" }}>
                                    {assignment.secondSkill ? (
                                      (() => {
                                        const diceValue =
                                          viewingSheet.dice_pool[
                                            assignment.secondDiceIndex
                                          ];
                                        const modifier = getModifierValue(
                                          assignment.secondSkill
                                        );
                                        const total = diceValue + modifier;

                                        return (
                                          <div style={formStyles.value}>
                                            <span style={formStyles.rollValue}>
                                              Second Roll:
                                            </span>{" "}
                                            d20({diceValue}){" "}
                                            {formatModifier(modifier)} = {total}
                                            <br />
                                            <small
                                              style={{
                                                color: theme.textSecondary,
                                              }}
                                            >
                                              Using {assignment.secondSkill}{" "}
                                              {formatModifier(modifier)}
                                            </small>
                                          </div>
                                        );
                                      })()
                                    ) : (
                                      <div style={formStyles.value}>
                                        <span style={formStyles.rollValue}>
                                          Second Roll:
                                        </span>{" "}
                                        d20(
                                        {
                                          viewingSheet.dice_pool[
                                            assignment.secondDiceIndex
                                          ]
                                        }
                                        )
                                      </div>
                                    )}
                                  </div>
                                )}

                              {assignment.notes && (
                                <div style={{ marginTop: "8px" }}>
                                  <span style={formStyles.label}>Notes: </span>
                                  <span style={formStyles.value}>
                                    {assignment.notes}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                </div>
              ))
            ) : (
              <div style={formStyles.value}>No activities recorded.</div>
            )}
          </div>

          <div style={formStyles.section}>
            <h4 style={formStyles.sectionTitle}>Admin Feedback</h4>
            {viewingSheet.admin_feedback || viewingSheet.admin_notes ? (
              <div style={formStyles.feedbackSection}>
                <div
                  style={{
                    color: theme.warning,
                    fontWeight: "600",
                    marginBottom: "12px",
                  }}
                >
                  📝 Feedback from Game Master
                </div>
                {viewingSheet.admin_feedback && (
                  <div style={{ marginBottom: "12px" }}>
                    <div style={formStyles.label}>Feedback</div>
                    <div style={formStyles.value}>
                      {viewingSheet.admin_feedback}
                    </div>
                  </div>
                )}
                {viewingSheet.admin_notes && (
                  <div>
                    <div style={formStyles.label}>Notes</div>
                    <div style={formStyles.value}>
                      {viewingSheet.admin_notes}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={formStyles.noFeedback}>
                No admin feedback available yet. Check back after your GM has
                reviewed your submission.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CreateTab = () => (
    <div>
      <h3 style={inlineStyles.headingStyle}>Create New Downtime Sheet</h3>

      <div
        style={{
          padding: "1.5rem",
          backgroundColor: theme.surface,
          borderRadius: "8px",
          border: `1px solid ${theme.border}`,
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        <h4 style={{ color: theme.text, margin: "0 0 8px 0" }}>
          Creating downtime for {selectedCharacter?.name}
        </h4>
        <p style={{ color: theme.textSecondary, margin: 0 }}>
          {selectedCharacter?.house} • Year {selectedCharacter?.year}
        </p>
      </div>

      <div style={inlineStyles.sectionStyle}>
        <div style={inlineStyles.selectionContainer}>
          <div style={inlineStyles.radioGroupContainer}>
            <label style={inlineStyles.groupLabel}>Academic Year:</label>
            <div style={inlineStyles.radioGrid}>
              {yearAvailability.map((yearInfo) => {
                const isSelected = selectedYear === yearInfo.year;
                const hasSubmissions = yearInfo.hasSubmissions;

                return (
                  <label
                    key={yearInfo.year}
                    style={{
                      ...inlineStyles.radioOption,
                      ...(isSelected ? inlineStyles.radioOptionSelected : {}),
                    }}
                  >
                    <input
                      type="radio"
                      name="academicYear"
                      value={yearInfo.year}
                      checked={isSelected}
                      onChange={handleYearChange}
                      style={inlineStyles.radioInput}
                    />
                    Year {yearInfo.year}
                    {hasSubmissions && (
                      <span style={inlineStyles.submittedBadge}>✓</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          <div style={inlineStyles.radioGroupContainer}>
            <label style={inlineStyles.groupLabel}>Semester:</label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {semesterAvailability.map((semesterInfo) => {
                const isSelected = selectedSemester === semesterInfo.semester;
                const isDisabled = !selectedYear || semesterInfo.isSubmitted;

                let optionStyle = { ...inlineStyles.radioOption };
                if (isSelected && !isDisabled) {
                  optionStyle = {
                    ...optionStyle,
                    ...inlineStyles.radioOptionSelected,
                  };
                }
                if (isDisabled && !semesterInfo.isSubmitted) {
                  optionStyle = {
                    ...optionStyle,
                    ...inlineStyles.radioOptionDisabled,
                  };
                }
                if (semesterInfo.isSubmitted) {
                  optionStyle = {
                    ...optionStyle,
                    ...inlineStyles.radioOptionSubmitted,
                  };
                }

                return (
                  <label key={semesterInfo.semester} style={optionStyle}>
                    <input
                      type="radio"
                      name="semester"
                      value={semesterInfo.semester}
                      checked={isSelected}
                      onChange={handleSemesterChange}
                      disabled={isDisabled}
                      style={inlineStyles.radioInput}
                    />
                    Semester {semesterInfo.semester}
                    {semesterInfo.isSubmitted && (
                      <span style={inlineStyles.submittedBadge}>DONE</span>
                    )}
                    {!selectedYear && (
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: "12px",
                          opacity: 0.7,
                        }}
                      >
                        Select year first
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {selectedYear &&
          selectedSemester &&
          isYearSemesterSubmitted(selectedYear, selectedSemester) && (
            <div style={inlineStyles.warningStyle}>
              ⚠️ You have already submitted a downtime sheet for Year{" "}
              {selectedYear}, Semester {selectedSemester}.
            </div>
          )}

        {submittedSheets.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <details style={{ cursor: "pointer" }}>
              <summary style={{ color: theme.textSecondary, fontSize: "14px" }}>
                View submitted combinations ({submittedSheets.length} of 14)
              </summary>
              <div
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  backgroundColor: theme.background,
                  borderRadius: "6px",
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "8px",
                  }}
                >
                  {getSubmittedCombinations().map((combo) => (
                    <div
                      key={`${combo.year}-${combo.semester}`}
                      style={{
                        padding: "6px 8px",
                        backgroundColor: theme.success + "20",
                        color: theme.success,
                        borderRadius: "4px",
                        fontSize: "12px",
                        textAlign: "center",
                      }}
                    >
                      Y{combo.year}S{combo.semester}
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </div>
        )}
      </div>

      {selectedYear &&
        selectedSemester &&
        !isYearSemesterSubmitted(selectedYear, selectedSemester) && (
          <div style={{ marginTop: "1rem" }}>
            {loading && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
              >
                <div
                  style={{
                    backgroundColor: theme.surface,
                    padding: "20px 40px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: theme.text,
                  }}
                >
                  Loading...
                </div>
              </div>
            )}

            {currentSheet?.admin_completed && !isUserAdmin && (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: theme.warning + "15",
                  border: `2px solid ${theme.warning}`,
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                <h4 style={{ color: theme.warning, margin: "0 0 8px 0" }}>
                  📋 Admin Completed Downtime
                </h4>
                <p style={{ color: theme.text, margin: 0 }}>
                  This downtime sheet has been completed by an administrator and
                  is now view-only.
                </p>
              </div>
            )}

            <DicePoolManager
              dicePool={dicePool}
              setDicePool={setDicePool}
              rollAssignments={rollAssignments}
              setRollAssignments={setRollAssignments}
              selectedCharacter={selectedCharacter}
              canEdit={canEdit}
              hasDualCheckActivity={hasDualCheckActivity}
            />

            <ActivityManager
              formData={formData}
              setFormData={setFormData}
              availableActivities={availableActivities}
              rollAssignments={rollAssignments}
              setRollAssignments={setRollAssignments}
              dicePool={dicePool}
              selectedCharacter={selectedCharacter}
              canEdit={canEdit}
              assignDice={assignDice}
              unassignDice={unassignDice}
              getDiceUsage={getDiceUsage}
              getSortedDiceOptions={getSortedDiceOptions}
            />

            <DowntimeActions
              currentSheet={currentSheet}
              setCurrentSheet={setCurrentSheet}
              formData={formData}
              rollAssignments={rollAssignments}
              dicePool={dicePool}
              selectedCharacter={selectedCharacter}
              selectedYear={selectedYear}
              selectedSemester={selectedSemester}
              user={user}
              supabase={supabase}
              canEdit={canEdit}
              isSubmitted={isSubmitted}
              setIsSubmitted={setIsSubmitted}
              adminMode={adminMode}
              isUserAdmin={isUserAdmin}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              loading={loading}
              setLoading={setLoading}
              submittedSheets={submittedSheets}
              loadSubmittedSheets={loadSubmittedSheets}
              extraFieldsUnlocked={extraFieldsUnlocked}
              viewMode="create"
              setViewMode={() => {}}
              setActiveTab={setActiveTab}
              isYearSemesterSubmitted={isYearSemesterSubmitted}
              loadDrafts={loadDrafts} 
              setFormData={setFormData} 
              setRollAssignments={setRollAssignments} 
              setDicePool={setDicePool} 
              setSelectedYear={setSelectedYear} 
              setSelectedSemester={setSelectedSemester} 
              setExtraFieldsUnlocked={setExtraFieldsUnlocked}
            />
          </div>
        )}
    </div>
  );

  if (!selectedCharacter) {
    return (
      <div style={dashboardStyles.container}>
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: theme.textSecondary,
          }}
        >
          <Calendar size={48} style={{ marginBottom: "1rem" }} />
          <h2>No Character Selected</h2>
          <p>Please select a character to access the downtime dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={dashboardStyles.container}>
      <div style={dashboardStyles.header}>
        <div style={dashboardStyles.headerIcon}>
          <Calendar size={24} color={theme.primary} />
        </div>
        <div style={dashboardStyles.headerContent}>
          <h1 style={dashboardStyles.title}>Downtime Dashboard</h1>
          <p style={dashboardStyles.subtitle}>
            Managing downtime for {selectedCharacter.name} •{" "}
            {selectedCharacter.house} • Year {selectedCharacter.year}
          </p>
        </div>
      </div>

      <div style={dashboardStyles.tabNavigation}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...dashboardStyles.tab,
                ...(isActive ? dashboardStyles.activeTab : {}),
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = theme.primary + "10";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              <Icon size={16} />
              {tab.label}
              {tab.badge > 0 && (
                <span style={dashboardStyles.tabBadge}>{tab.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      <div style={dashboardStyles.content}>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "create" && <CreateTab />}
        {activeTab === "drafts" && <DraftsTab />}
        {activeTab === "submitted" && <SubmittedSheetsTab />}
      </div>
    </div>
  );
};

export default DowntimeSheet;
