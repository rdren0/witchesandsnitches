import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar,
  Edit3,
  Plus,
  FileText,
  Eye,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import DowntimeForm from "./DowntimeForm";
import ViewingSheetForm from "./ViewingSheetForm";

const DowntimeWrapper = ({
  user,
  selectedCharacter,
  supabase,
  adminMode,
  isUserAdmin,
}) => {
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState("create");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [submittedSheets, setSubmittedSheets] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSheet, setCurrentSheet] = useState(null);

  const [viewMode, setViewMode] = useState("list");
  const [viewingSheet, setViewingSheet] = useState(null);

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
    relationship1: { diceIndex: null, skill: "", notes: "", adminNotes: "" },
    relationship2: { diceIndex: null, skill: "", notes: "", adminNotes: "" },
    relationship3: { diceIndex: null, skill: "", notes: "", adminNotes: "" },
  });
  const [formData, setFormData] = useState({
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

  const normalizeRollAssignments = (rollAssignments) => {
    if (!rollAssignments) return rollAssignments;

    const normalized = { ...rollAssignments };

    ["relationship1", "relationship2", "relationship3"].forEach((key) => {
      if (normalized[key] && normalized[key].skill) {
        if (normalized[key].skill === "Insight") {
          normalized[key].skill = "insight";
        }
        if (normalized[key].skill === "Persuasion") {
          normalized[key].skill = "persuasion";
        }
      }
    });

    return normalized;
  };
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
      if (!sheetId || !user?.id) {
        alert("Invalid sheet ID or user not authenticated");
        return;
      }

      setLoading(true);
      try {
        const { data: sheet, error } = await supabase
          .from("character_downtime")
          .select("*")
          .eq("id", sheetId)
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (!sheet) {
          alert("Sheet not found or you don't have permission to view it.");
          return;
        }

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

  useEffect(() => {
    if (selectedCharacter?.id && user?.id) {
      loadSubmittedSheets();
      loadDrafts();
    }
  }, [selectedCharacter?.id, user?.id, loadSubmittedSheets, loadDrafts]);

  const resetFormState = useCallback(() => {
    setCurrentSheet(null);
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
      relationship1: { diceIndex: null, skill: "", notes: "", adminNotes: "" },
      relationship2: { diceIndex: null, skill: "", notes: "", adminNotes: "" },
      relationship3: { diceIndex: null, skill: "", notes: "", adminNotes: "" },
    });
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
  }, []);

  const handleYearChange = useCallback(
    (e) => {
      const newYear = parseInt(e.target.value) || "";
      setSelectedYear(newYear);
      if (!newYear) {
        setSelectedSemester("");
      }

      if (!currentSheet) {
        resetFormState();
      }
    },
    [currentSheet, resetFormState]
  );

  const handleSemesterChange = useCallback(
    (e) => {
      const newSemester = parseInt(e.target.value) || "";
      setSelectedSemester(newSemester);

      if (!currentSheet) {
        resetFormState();
      }
    },
    [currentSheet, resetFormState]
  );

  const handleEditDraft = useCallback(
    (draft) => {
      console.log("Loading draft for editing:", draft);

      setCurrentSheet(draft);

      setSelectedYear(draft.year);
      setSelectedSemester(draft.semester);

      setFormData({
        activities: draft.activities || [
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
        relationships: draft.relationships || [
          { npcName: "", notes: "" },
          { npcName: "", notes: "" },
          { npcName: "", notes: "" },
        ],
        selectedMagicSchool: draft.selected_magic_school || "",
      });

      setDicePool(draft.dice_pool || []);

      const normalizedAssignments = normalizeRollAssignments(
        draft.roll_assignments || {
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
      setRollAssignments(normalizedAssignments);

      setActiveTab("create");
    },
    [
      setCurrentSheet,
      setSelectedYear,
      setSelectedSemester,
      setFormData,
      setDicePool,
      setRollAssignments,
      setActiveTab,
    ]
  );

  const handleDeleteDraft = useCallback(async (draftId) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("character_downtime")
        .delete()
        .eq("id", draftId)
        .eq("user_id", user.id);

      if (error) throw error;

      loadDrafts();

      if (currentSheet?.id === draftId) {
        setCurrentSheet(null);
        setSelectedYear("");
        setSelectedSemester("");
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
        });
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
          relationships: [
            { npcName: "", notes: "" },
            { npcName: "", notes: "" },
            { npcName: "", notes: "" },
          ],
          selectedMagicSchool: "",
        });
      }
    } catch (err) {
      console.error("Error deleting draft:", err);
      alert("Failed to delete draft. Please try again.");
    }
  });

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

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "1.5rem",
      backgroundColor: theme.background,
      minHeight: "100vh",
    },
    header: {
      marginBottom: "2rem",
      textAlign: "center",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: theme.text,
      marginBottom: "0.5rem",
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: "1rem",
    },
    tabContainer: {
      display: "flex",
      marginBottom: "2rem",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      padding: "0.5rem",
      border: `1px solid ${theme.border}`,
    },
    tab: {
      flex: 1,
      padding: "1rem",
      textAlign: "center",
      border: "none",
      backgroundColor: "transparent",
      color: theme.textSecondary,
      cursor: "pointer",
      borderRadius: "8px",
      transition: "all 0.2s ease",
      fontSize: "0.9rem",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      position: "relative",
    },
    activeTab: {
      backgroundColor: theme.primary,
      color: "white",
    },
    badge: {
      position: "absolute",
      top: "0.25rem",
      right: "0.25rem",
      backgroundColor: theme.error,
      color: "white",
      borderRadius: "50%",
      width: "1.25rem",
      height: "1.25rem",
      fontSize: "0.7rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
    },
    content: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `1px solid ${theme.border}`,
      padding: "2rem",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "1rem",
      borderBottom: `2px solid ${theme.primary}`,
      paddingBottom: "0.5rem",
    },

    viewingHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      padding: "1rem",
      backgroundColor: theme.background,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
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

    listContainer: {
      display: "grid",
      gap: "1rem",
    },
    listItem: {
      padding: "1rem",
      backgroundColor: theme.background,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    listItemInfo: {
      flex: 1,
    },
    listItemTitle: {
      fontSize: "1rem",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "0.25rem",
    },
    listItemSubtitle: {
      fontSize: "0.875rem",
      color: theme.textSecondary,
    },
    listItemActions: {
      display: "flex",
      gap: "8px",
    },
    button: {
      padding: "6px 12px",
      backgroundColor: theme.primary,
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    dangerButton: {
      backgroundColor: theme.error,
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem",
      backgroundColor: theme.background,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
    },
    emptyStateIcon: {
      marginBottom: "1rem",
    },
    emptyStateTitle: {
      color: theme.text,
      marginBottom: "0.5rem",
    },
    emptyStateText: {
      color: theme.textSecondary,
      marginBottom: "1.5rem",
    },
  };

  const OverviewTab = () => (
    <div>
      <h3 style={styles.sectionTitle}>
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
        <div style={styles.listItem}>
          <div style={styles.listItemInfo}>
            <h4 style={styles.listItemTitle}>Submitted Sheets</h4>
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

        <div style={styles.listItem}>
          <div style={styles.listItemInfo}>
            <h4 style={styles.listItemTitle}>Draft Sheets</h4>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: theme.warning,
              }}
            >
              {drafts.length}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h4 style={styles.listItemTitle}>Recent Submissions</h4>
        {submittedSheets.length > 0 ? (
          <div style={styles.listContainer}>
            {submittedSheets.slice(-3).map((sheet) => (
              <div key={sheet.id} style={styles.listItem}>
                <div style={styles.listItemInfo}>
                  <div style={styles.listItemTitle}>
                    Year {sheet.year}, Semester {sheet.semester}
                  </div>
                  <div style={styles.listItemSubtitle}>
                    Submitted:{" "}
                    {new Date(sheet.submitted_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p style={styles.emptyStateText}>No submitted sheets yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const DraftsTab = () => {
    if (viewMode === "viewing" && viewingSheet) {
      return <ViewingSheetWrapper />;
    }

    return (
      <div>
        <div style={styles.viewingHeader}>
          <h3 style={styles.listItemTitle}>Draft Downtime Sheets</h3>
          <button onClick={loadDrafts} style={styles.backButton}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyStateText}>Loading drafts...</p>
          </div>
        ) : drafts.length === 0 ? (
          <div style={styles.emptyState}>
            <FileText
              size={48}
              color={theme.textSecondary}
              style={styles.emptyStateIcon}
            />
            <h4 style={styles.emptyStateTitle}>No Draft Sheets</h4>
            <p style={styles.emptyStateText}>
              You don't have any saved drafts yet. Start creating a new downtime
              sheet to save as a draft.
            </p>
            <button
              onClick={() => setActiveTab("create")}
              style={styles.button}
            >
              <Plus size={16} />
              Create New Sheet
            </button>
          </div>
        ) : (
          <div style={styles.listContainer}>
            {drafts.map((draft) => (
              <div key={draft.id} style={styles.listItem}>
                <div style={styles.listItemInfo}>
                  <div style={styles.listItemTitle}>
                    Year {draft.year}, Semester {draft.semester}
                  </div>
                  <div style={styles.listItemSubtitle}>
                    Last updated: {new Date(draft.updated_at).toLocaleString()}
                  </div>
                  {draft.activities && draft.activities.length > 0 && (
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "14px",
                        color: theme.textSecondary,
                      }}
                    >
                      Activities:{" "}
                      {draft.activities.filter((a) => a.activity).length}{" "}
                      selected
                    </div>
                  )}
                </div>
                <div style={styles.listItemActions}>
                  <button
                    onClick={() => loadSheetForViewing(draft.id)}
                    style={styles.button}
                  >
                    <Eye size={14} />
                    View
                  </button>
                  <button
                    onClick={() => handleEditDraft(draft)}
                    style={styles.button}
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    style={{ ...styles.button, ...styles.dangerButton }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const SubmittedSheetsTab = () => {
    if (viewMode === "viewing" && viewingSheet) {
      return <ViewingSheetWrapper />;
    }

    return (
      <div>
        <div style={styles.viewingHeader}>
          <h3 style={styles.listItemTitle}>Submitted Downtime Sheets</h3>
          <button onClick={loadSubmittedSheets} style={styles.backButton}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyStateText}>Loading submitted sheets...</p>
          </div>
        ) : submittedSheets.length === 0 ? (
          <div style={styles.emptyState}>
            <FileText
              size={48}
              color={theme.textSecondary}
              style={styles.emptyStateIcon}
            />
            <h4 style={styles.emptyStateTitle}>No Submitted Sheets</h4>
            <p style={styles.emptyStateText}>
              You haven't submitted any downtime sheets yet.
            </p>
            <button
              onClick={() => setActiveTab("create")}
              style={styles.button}
            >
              <Plus size={16} />
              Create New Sheet
            </button>
          </div>
        ) : (
          <div style={styles.listContainer}>
            {submittedSheets.map((sheet) => (
              <div key={sheet.id} style={styles.listItem}>
                <div style={styles.listItemInfo}>
                  <div style={styles.listItemTitle}>
                    Year {sheet.year}, Semester {sheet.semester}
                  </div>
                  <div style={styles.listItemSubtitle}>
                    Submitted: {new Date(sheet.submitted_at).toLocaleString()}
                  </div>
                  <div style={{ marginTop: "4px" }}>
                    <span
                      style={{
                        padding: "2px 6px",
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
                </div>
                <div style={styles.listItemActions}>
                  <button
                    onClick={() => loadSheetForViewing(sheet.id)}
                    style={styles.button}
                    disabled={loading}
                  >
                    <Eye size={14} />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ViewingSheetWrapper = () => {
    if (!viewingSheet) return null;

    const handleUpdateAssignment = (assignmentKey, field, value) => {
      setViewingSheet((prev) => ({
        ...prev,
        roll_assignments: {
          ...prev.roll_assignments,
          [assignmentKey]: {
            ...prev.roll_assignments[assignmentKey],
            [field]: value,
          },
        },
      }));
    };

    return (
      <ViewingSheetForm
        viewingSheet={viewingSheet}
        selectedCharacter={selectedCharacter}
        isUserAdmin={isUserAdmin}
        adminMode={adminMode}
        onBack={() => {
          setViewMode("list");
          setViewingSheet(null);
        }}
        onUpdateAssignment={handleUpdateAssignment}
        supabase={supabase}
        user={user}
      />
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Downtime Management</h1>
        <p style={styles.subtitle}>
          Manage your character's downtime activities for{" "}
          {selectedCharacter?.name}
        </p>
      </div>

      <div style={styles.tabContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setViewMode("list");
              setViewingSheet(null);

              if (tab.id === "create" && !currentSheet) {
                resetFormState();
                setSelectedYear("");
                setSelectedSemester("");
              }
            }}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.activeTab : {}),
            }}
          >
            <tab.icon size={18} />
            {tab.label}
            {tab.badge > 0 && <span style={styles.badge}>{tab.badge}</span>}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {activeTab === "create" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={styles.sectionTitle}>
                {currentSheet
                  ? "Edit Draft Sheet"
                  : "Create New Downtime Sheet"}
              </h3>
              {currentSheet && (
                <button
                  onClick={() => {
                    resetFormState();
                    setSelectedYear("");
                    setSelectedSemester("");
                  }}
                  style={{
                    ...styles.button,
                    backgroundColor: theme.primary,
                  }}
                >
                  Start New Sheet
                </button>
              )}
            </div>

            {currentSheet && (
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: theme.warning + "20",
                  border: `1px solid ${theme.warning}`,
                  borderRadius: "8px",
                  marginBottom: "2rem",
                }}
              >
                <p
                  style={{ color: theme.warning, margin: 0, fontSize: "14px" }}
                >
                  📝 Editing draft for Year {currentSheet.year}, Semester{" "}
                  {currentSheet.semester}
                  {currentSheet.updated_at && (
                    <span style={{ marginLeft: "1rem", opacity: 0.8 }}>
                      Last saved:{" "}
                      {new Date(currentSheet.updated_at).toLocaleString()}
                    </span>
                  )}
                </p>
              </div>
            )}

            <div
              style={{
                marginBottom: "2rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label style={styles.listItemSubtitle}>Academic Year</label>
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  disabled={currentSheet}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "8px",
                    backgroundColor: currentSheet
                      ? theme.background + "80"
                      : theme.background,
                    color: theme.text,
                    fontSize: "1rem",
                    opacity: currentSheet ? 0.7 : 1,
                    cursor: currentSheet ? "not-allowed" : "pointer",
                  }}
                >
                  <option value="">Select Year</option>
                  {yearAvailability.map((yearInfo) => (
                    <option key={yearInfo.year} value={yearInfo.year}>
                      Year {yearInfo.year}
                      {yearInfo.fullyCompleted
                        ? " (Completed)"
                        : yearInfo.hasSubmissions
                        ? " (Partial)"
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={styles.listItemSubtitle}>Semester</label>
                <select
                  value={selectedSemester}
                  onChange={handleSemesterChange}
                  disabled={!selectedYear || currentSheet}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "8px",
                    backgroundColor:
                      !selectedYear || currentSheet
                        ? theme.background + "80"
                        : theme.background,
                    color: theme.text,
                    fontSize: "1rem",
                    opacity: !selectedYear || currentSheet ? 0.6 : 1,
                    cursor:
                      !selectedYear || currentSheet ? "not-allowed" : "pointer",
                  }}
                >
                  <option value="">Select Semester</option>
                  {semesterAvailability.map((semesterInfo) => (
                    <option
                      key={semesterInfo.semester}
                      value={semesterInfo.semester}
                      disabled={!semesterInfo.isAvailable}
                    >
                      Semester {semesterInfo.semester}
                      {semesterInfo.isSubmitted ? " (Already Submitted)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedYear &&
              selectedSemester &&
              isYearSemesterSubmitted(selectedYear, selectedSemester) && (
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: theme.warning + "20",
                    border: `1px solid ${theme.warning}`,
                    borderRadius: "8px",
                    marginBottom: "2rem",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: theme.warning, margin: 0 }}>
                    You have already submitted a downtime sheet for Year{" "}
                    {selectedYear}, Semester {selectedSemester}.
                  </p>
                  <button
                    onClick={() => setActiveTab("submitted")}
                    style={{ ...styles.button, marginTop: "0.5rem" }}
                  >
                    <Eye size={16} />
                    View Submitted Sheets
                  </button>
                </div>
              )}

            {selectedYear &&
              selectedSemester &&
              !isYearSemesterSubmitted(selectedYear, selectedSemester) && (
                <DowntimeForm
                  user={user}
                  selectedCharacter={selectedCharacter}
                  supabase={supabase}
                  adminMode={adminMode}
                  isUserAdmin={isUserAdmin}
                  selectedYear={selectedYear}
                  selectedSemester={selectedSemester}
                  currentSheet={currentSheet}
                  setCurrentSheet={setCurrentSheet}
                  dicePool={dicePool}
                  setDicePool={setDicePool}
                  rollAssignments={rollAssignments}
                  setRollAssignments={setRollAssignments}
                  formData={formData}
                  setFormData={setFormData}
                  initialDicePool={dicePool}
                  initialRollAssignments={rollAssignments}
                  initialFormData={formData}
                  loadSubmittedSheets={loadSubmittedSheets}
                  loadDrafts={loadDrafts}
                  setActiveTab={setActiveTab}
                />
              )}
          </div>
        )}

        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "drafts" && <DraftsTab />}
        {activeTab === "submitted" && <SubmittedSheetsTab />}
      </div>
    </div>
  );
};

export default DowntimeWrapper;
