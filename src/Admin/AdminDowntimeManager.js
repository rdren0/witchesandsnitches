import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Trash2, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import AdminDowntimeReviewForm from "./AdminDowntimeReviewForm";
import { gameSessionOptions } from "../App/const";

const AdminDowntimeManager = ({ supabase }) => {
  const { theme } = useTheme();
  const [downtimeSheets, setDowntimeSheets] = useState([]);
  const [filteredSheets, setFilteredSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedGameSession, setSelectedGameSession] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [searchCharacterName, setSearchCharacterName] = useState("");

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    denied: 0,
    drafts: 0,
  });

  const styles = {
    container: {
      padding: "24px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "32px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: theme.text,
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "16px",
      color: theme.textSecondary,
    },
    filtersContainer: {
      backgroundColor: theme.surface,
      padding: "24px",
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      marginBottom: "24px",
    },
    filtersGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "16px",
    },
    filterGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.text,
    },
    select: {
      padding: "10px 12px",
      borderRadius: "6px",
      border: `2px solid ${theme.border}`,
      backgroundColor: theme.background,
      color: theme.text,
      fontSize: "14px",
    },
    input: {
      padding: "10px 12px",
      borderRadius: "6px",
      border: `2px solid ${theme.border}`,
      backgroundColor: theme.background,
      color: theme.text,
      fontSize: "14px",
    },
    clearButton: {
      padding: "8px 16px",
      backgroundColor: "#6b7280",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    },
    statCard: {
      padding: "20px",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      textAlign: "center",
    },
    statNumber: {
      fontSize: "32px",
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: "8px",
    },
    statLabel: {
      fontSize: "14px",
      color: theme.textSecondary,
      fontWeight: "500",
    },
    sheetsContainer: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      overflow: "hidden",
    },
    sheetsHeader: {
      padding: "20px",
      borderBottom: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sheetsList: {
      maxHeight: "600px",
      overflowY: "auto",
    },
    sheetItem: {
      padding: "16px 20px",
      borderBottom: `1px solid ${theme.border}`,
      display: "grid",
      gridTemplateColumns: "1fr 80px 100px  100px 100px 100px",
      gap: "16px",
      alignItems: "center",
      transition: "background-color 0.2s ease",
    },
    sheetHeader: {
      padding: "16px 20px",
      backgroundColor: theme.background,
      borderBottom: `2px solid ${theme.border}`,
      display: "grid",
      gridTemplateColumns: "1fr 80px 100px  100px 100px 100px",
      gap: "16px",
      alignItems: "center",
      fontSize: "14px",
      fontWeight: "600",
      color: theme.textSecondary,
    },
    characterInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    characterName: {
      fontWeight: "600",
      color: theme.text,
      fontSize: "16px",
    },
    gameSession: {
      fontSize: "14px",
      color: theme.textSecondary,
    },
    statusBadge: {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "600",
      textAlign: "center",
    },
    submittedBadge: {
      backgroundColor: "#10b981",
      color: "white",
    },
    draftBadge: {
      backgroundColor: "#f59e0b",
      color: "white",
    },
    reviewStatusBadge: {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "600",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    pendingReview: {
      backgroundColor: "#f59e0b",
      color: "white",
    },
    approvedReview: {
      backgroundColor: "#10b981",
      color: "white",
    },
    deniedReview: {
      backgroundColor: "#ef4444",
      color: "white",
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
    },
    actionButton: {
      padding: "6px 8px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    viewButton: {
      backgroundColor: "#3b82f6",
      color: "white",
    },
    reviewButton: {
      backgroundColor: "#8b5cf6",
      color: "white",
    },
    deleteButton: {
      backgroundColor: "#ef4444",
      color: "white",
    },
    emptyState: {
      padding: "60px 20px",
      textAlign: "center",
      color: theme.textSecondary,
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      color: theme.textSecondary,
    },
    errorContainer: {
      padding: "20px",
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      borderRadius: "8px",
      marginBottom: "20px",
    },
  };

  const tabStyles = {
    tabContainer: {
      display: "flex",
      marginBottom: "24px",
      borderBottom: `1px solid ${theme.border}`,
    },
    tab: {
      padding: "12px 24px",
      border: "none",
      backgroundColor: "transparent",
      color: theme.textSecondary,
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      borderBottom: "3px solid transparent",
      transition: "all 0.2s ease",
    },
    activeTab: {
      color: theme.primary,
      borderBottomColor: theme.primary,
    },
    tabBadge: {
      marginLeft: "8px",
      padding: "2px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
    },
    pendingBadge: {
      backgroundColor: "#f59e0b20",
      color: "#f59e0b",
    },
    approvedBadge: {
      backgroundColor: "#10b98120",
      color: "#10b981",
    },
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: sheets, error: sheetsError } = await supabase
        .from("character_downtime")
        .select(
          `
          *,
          characters (
            id,
            name,
            game_session,
            house,
            level
          )
        `
        )
        .order("submitted_at", { ascending: false });

      if (sheetsError) throw sheetsError;

      const { error: charactersError } = await supabase
        .from("characters")
        .select("game_session")
        .not("game_session", "is", null);

      if (charactersError) throw charactersError;

      setDowntimeSheets(sheets || []);
      setFilteredSheets(sheets || []);

      const submitted = sheets?.filter((sheet) => !sheet.is_draft) || [];
      const newStats = {
        total: submitted.length,
        pending: submitted.filter(
          (sheet) => !sheet.review_status || sheet.review_status === "pending"
        ).length,
        approved: submitted.filter((sheet) => sheet.review_status === "success")
          .length,
        denied: submitted.filter((sheet) => sheet.review_status === "failure")
          .length,
        drafts: sheets?.filter((sheet) => sheet.is_draft).length || 0,
      };
      setStats(newStats);
    } catch (err) {
      setError(err.message);
      console.error("Error loading downtime data:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const getTabCounts = () => {
    const submitted = downtimeSheets.filter((sheet) => !sheet.is_draft);
    return {
      pending: submitted.filter(
        (sheet) =>
          !sheet.review_status ||
          sheet.review_status === "pending" ||
          sheet.review_status === "failure"
      ).length,
      approved: submitted.filter((sheet) => sheet.review_status === "success")
        .length,
    };
  };

  const applyFilters = useCallback(() => {
    let filtered = [...downtimeSheets];

    if (activeTab === "pending") {
      filtered = filtered.filter(
        (sheet) =>
          !sheet.is_draft &&
          (!sheet.review_status ||
            sheet.review_status === "pending" ||
            sheet.review_status === "failure")
      );
    } else if (activeTab === "approved") {
      filtered = filtered.filter(
        (sheet) => !sheet.is_draft && sheet.review_status === "success"
      );
    }

    if (selectedGameSession) {
      filtered = filtered.filter(
        (sheet) => sheet.characters?.game_session === selectedGameSession
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (sheet) => sheet.year === parseInt(selectedYear)
      );
    }

    if (selectedSemester) {
      filtered = filtered.filter(
        (sheet) => sheet.semester === parseInt(selectedSemester)
      );
    }

    if (searchCharacterName) {
      filtered = filtered.filter(
        (sheet) =>
          sheet.characters?.name
            ?.toLowerCase()
            .includes(searchCharacterName.toLowerCase()) ||
          sheet.character_name
            ?.toLowerCase()
            .includes(searchCharacterName.toLowerCase())
      );
    }

    setFilteredSheets(filtered);
  }, [
    downtimeSheets,
    activeTab,
    selectedGameSession,
    selectedYear,
    selectedSemester,
    searchCharacterName,
  ]);

  const clearFilters = () => {
    setSelectedGameSession("");
    setSelectedYear("");
    setSelectedSemester("");
    setSearchCharacterName("");
  };

  const reviewSheet = (sheet) => {
    setSelectedSheet(sheet);
    setShowReviewModal(true);
  };

  const deleteSheet = async (sheetId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this downtime sheet? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("character_downtime")
        .delete()
        .eq("id", sheetId);

      if (error) throw error;

      await loadData();
      alert("Downtime sheet deleted successfully.");
    } catch (err) {
      console.error("Error deleting sheet:", err);
      alert("Failed to delete downtime sheet. Please try again.");
    }
  };

  const handleReviewComplete = () => {
    setShowReviewModal(false);
    setSelectedSheet(null);
    loadData();
  };

  const getReviewStatusDisplay = (sheet) => {
    if (sheet.is_draft) {
      return (
        <span style={{ ...styles.reviewStatusBadge, ...styles.draftBadge }}>
          <FileText size={12} />
          Draft
        </span>
      );
    }

    const status = sheet.review_status || "pending";
    const statusConfig = {
      pending: { style: styles.pendingReview, icon: Clock, text: "Pending" },
      success: {
        style: styles.approvedReview,
        icon: CheckCircle,
        text: "Approved",
      },
      failure: { style: styles.deniedReview, icon: XCircle, text: "Rejected" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span style={{ ...styles.reviewStatusBadge, ...config.style }}>
        <Icon size={12} />
        {config.text}
      </span>
    );
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div>Loading downtime sheets...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          Error loading downtime sheets: {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Downtime Management</h1>
        <p style={styles.subtitle}>
          Review and manage player downtime submissions
        </p>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total Submissions</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: "#f59e0b" }}>
            {stats.pending}
          </div>
          <div style={styles.statLabel}>Pending Review</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: "#10b981" }}>
            {stats.approved}
          </div>
          <div style={styles.statLabel}>Approved</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: "#ef4444" }}>
            {stats.denied}
          </div>
          <div style={styles.statLabel}>Rejected</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: "#6b7280" }}>
            {stats.drafts}
          </div>
          <div style={styles.statLabel}>Drafts</div>
        </div>
      </div>

      <div style={tabStyles.tabContainer}>
        <button
          style={{
            ...tabStyles.tab,
            ...(activeTab === "pending" ? tabStyles.activeTab : {}),
          }}
          onClick={() => setActiveTab("pending")}
        >
          Pending & Rejected
          <span style={{ ...tabStyles.tabBadge, ...tabStyles.pendingBadge }}>
            {getTabCounts().pending}
          </span>
        </button>
        <button
          style={{
            ...tabStyles.tab,
            ...(activeTab === "approved" ? tabStyles.activeTab : {}),
          }}
          onClick={() => setActiveTab("approved")}
        >
          Approved
          <span style={{ ...tabStyles.tabBadge, ...tabStyles.approvedBadge }}>
            {getTabCounts().approved}
          </span>
        </button>
      </div>

      <div style={styles.filtersContainer}>
        <div style={styles.filtersGrid}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Game Session</label>
            <select
              style={styles.select}
              value={selectedGameSession}
              onChange={(e) => setSelectedGameSession(e.target.value)}
            >
              <option value="">All Sessions</option>
              {gameSessionOptions.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Year</label>
            <select
              style={styles.select}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {[1, 2, 3, 4, 5, 6, 7].map((year) => (
                <option key={year} value={year}>
                  Year {year}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Semester</label>
            <select
              style={styles.select}
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Character Name</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Search by character name..."
              value={searchCharacterName}
              onChange={(e) => setSearchCharacterName(e.target.value)}
            />
          </div>
        </div>

        <button onClick={clearFilters} style={styles.clearButton}>
          Clear Filters
        </button>
      </div>

      <div style={styles.sheetsContainer}>
        <div style={styles.sheetsHeader}>
          <h2>
            {activeTab === "pending" ? "Pending & Rejected" : "Approved"} Sheets
            ({filteredSheets.length})
          </h2>
        </div>

        {filteredSheets.length > 0 ? (
          <>
            <div style={styles.sheetHeader}>
              <div>Character</div>
              <div>Year</div>
              <div>Semester</div>
              <div>Review Status</div>
              <div>Submitted</div>
              <div>Actions</div>
            </div>
            <div style={styles.sheetsList}>
              {filteredSheets.map((sheet) => (
                <div key={sheet.id} style={styles.sheetItem}>
                  <div style={styles.characterInfo}>
                    <div style={styles.characterName}>
                      {sheet.characters?.name || sheet.character_name}
                    </div>
                    <div style={styles.gameSession}>
                      {sheet.characters?.game_session || "Unknown Session"}
                    </div>
                  </div>

                  <div>Year {sheet.school_year || sheet?.year}</div>
                  <div>Semester {sheet.semester}</div>

                  <div>{getReviewStatusDisplay(sheet)}</div>

                  <div>
                    {!sheet.is_draft && sheet.submitted_at
                      ? new Date(sheet.submitted_at).toLocaleDateString()
                      : "Not submitted"}
                  </div>

                  <div style={styles.actionButtons}>
                    {!sheet.is_draft && (
                      <button
                        onClick={() => reviewSheet(sheet)}
                        style={{
                          ...styles.actionButton,
                          ...styles.reviewButton,
                        }}
                        title="Review & Finalize"
                      >
                        <FileText size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteSheet(sheet.id)}
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                      title="Delete Sheet"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={styles.emptyState}>
            <div>
              No {activeTab === "pending" ? "pending or rejected" : "approved"}{" "}
              sheets found matching your filters.
            </div>
          </div>
        )}
      </div>

      {showReviewModal && selectedSheet && (
        <AdminDowntimeReviewForm
          supabase={supabase}
          sheetId={selectedSheet.id}
          onClose={() => setShowReviewModal(false)}
          onReviewComplete={handleReviewComplete}
        />
      )}
    </div>
  );
};

export default AdminDowntimeManager;
