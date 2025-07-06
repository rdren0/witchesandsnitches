// AdminDowntimeManager.js
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  Calendar,
  User,
  FileText,
  Download,
  Edit,
  Trash2,
  Eye,
  Search,
} from "lucide-react";

const AdminDowntimeManager = ({ supabase }) => {
  const { theme } = useTheme();

  // State management
  const [downtimeSheets, setDowntimeSheets] = useState([]);
  const [filteredSheets, setFilteredSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedGameSession, setSelectedGameSession] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [searchCharacterName, setSearchCharacterName] = useState("");

  // Available options
  const [gameSessions, setGameSessions] = useState([]);
  const [availableYears] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [availableSemesters] = useState([1, 2]);

  // Detail view
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Styles
  const styles = {
    container: {
      padding: "24px",
      backgroundColor: theme.background,
      minHeight: "100vh",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "32px",
      padding: "20px",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: theme.text,
      margin: 0,
    },
    subtitle: {
      fontSize: "16px",
      color: theme.textSecondary,
      margin: "8px 0 0 0",
    },
    filtersContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      padding: "20px",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      marginBottom: "24px",
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
      gridTemplateColumns: "1fr 120px 120px 120px 150px 120px",
      gap: "16px",
      alignItems: "center",
      transition: "background-color 0.2s ease",
    },
    sheetHeader: {
      padding: "16px 20px",
      backgroundColor: theme.background,
      borderBottom: `2px solid ${theme.border}`,
      display: "grid",
      gridTemplateColumns: "1fr 120px 120px 120px 150px 120px",
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
    actionButtons: {
      display: "flex",
      gap: "8px",
      justifyContent: "flex-end",
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
    editButton: {
      backgroundColor: "#f59e0b",
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
    modalOverlay: {
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
    },
    modal: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      padding: "24px",
      maxWidth: "800px",
      maxHeight: "80vh",
      overflowY: "auto",
      border: `2px solid ${theme.border}`,
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      paddingBottom: "16px",
      borderBottom: `1px solid ${theme.border}`,
    },
    closeButton: {
      padding: "8px",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      borderRadius: "4px",
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

  // Load all downtime sheets and game sessions
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Load downtime sheets with character and user info
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

      // Load unique game sessions
      const { data: characters, error: charactersError } = await supabase
        .from("characters")
        .select("game_session")
        .not("game_session", "is", null);

      if (charactersError) throw charactersError;

      const uniqueSessions = [
        ...new Set(characters.map((c) => c.game_session).filter(Boolean)),
      ].sort();
      setGameSessions(uniqueSessions);

      setDowntimeSheets(sheets || []);
      setFilteredSheets(sheets || []);
    } catch (err) {
      setError(err.message);
      console.error("Error loading downtime data:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Filter sheets based on current filters
  const applyFilters = useCallback(() => {
    let filtered = [...downtimeSheets];

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
    selectedGameSession,
    selectedYear,
    selectedSemester,
    searchCharacterName,
  ]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedGameSession("");
    setSelectedYear("");
    setSelectedSemester("");
    setSearchCharacterName("");
  };

  // View sheet details
  const viewSheetDetails = (sheet) => {
    setSelectedSheet(sheet);
    setShowDetailModal(true);
  };

  // Delete sheet
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

  const getStats = () => {
    const total = filteredSheets.length;
    const submitted = filteredSheets.filter((s) => !s.is_draft).length;
    const drafts = filteredSheets.filter((s) => s.is_draft).length;
    const uniqueCharacters = new Set(filteredSheets.map((s) => s.character_id))
      .size;

    return { total, submitted, drafts, uniqueCharacters };
  };

  // Effects
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Render loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div>Loading downtime data...</div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={loadData} style={styles.clearButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Calendar size={32} color={theme.primary} />
        <div>
          <h1 style={styles.title}>Downtime Management</h1>
          <p style={styles.subtitle}>
            View and manage all submitted downtime sheets across game sessions
          </p>
        </div>
      </div>

      <div style={styles.filtersContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Game Session</label>
          <select
            value={selectedGameSession}
            onChange={(e) => setSelectedGameSession(e.target.value)}
            style={styles.select}
          >
            <option value="">All Sessions</option>
            {gameSessions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Academic Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={styles.select}
          >
            <option value="">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Semester</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            style={styles.select}
          >
            <option value="">All Semesters</option>
            {availableSemesters.map((semester) => (
              <option key={semester} value={semester}>
                Semester {semester}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Character Name</label>
          <input
            type="text"
            value={searchCharacterName}
            onChange={(e) => setSearchCharacterName(e.target.value)}
            placeholder="Search character..."
            style={styles.input}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>&nbsp;</label>
          <button onClick={clearFilters} style={styles.clearButton}>
            Clear Filters
          </button>
        </div>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total Sheets</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.submitted}</div>
          <div style={styles.statLabel}>Submitted</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.drafts}</div>
          <div style={styles.statLabel}>Drafts</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.uniqueCharacters}</div>
          <div style={styles.statLabel}>Unique Characters</div>
        </div>
      </div>

      <div style={styles.sheetsContainer}>
        <div style={styles.sheetsHeader}>
          <h3>Downtime Sheets ({filteredSheets.length})</h3>
          <button onClick={loadData} style={styles.clearButton}>
            Refresh
          </button>
        </div>

        {filteredSheets.length === 0 ? (
          <div style={styles.emptyState}>
            <FileText size={48} color={theme.textSecondary} />
            <h3>No downtime sheets found</h3>
            <p>No sheets match your current filter criteria.</p>
          </div>
        ) : (
          <>
            <div style={styles.sheetHeader}>
              <div>Character / Session</div>
              <div>Year</div>
              <div>Semester</div>
              <div>Status</div>
              <div>Submitted</div>
              <div>Actions</div>
            </div>
            <div style={styles.sheetsList}>
              {filteredSheets.map((sheet) => (
                <div
                  key={sheet.id}
                  style={styles.sheetItem}
                
                >
                  <div style={styles.characterInfo}>
                    <div style={styles.characterName}>
                      {sheet.characters?.name || sheet.character_name}
                    </div>
                    <div style={styles.gameSession}>
                      {sheet.characters?.game_session || "No Session"}
                    </div>
                  </div>

                  <div>Year {sheet.year}</div>
                  <div>Semester {sheet.semester}</div>

                  <div>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...(!sheet.is_draft
                          ? styles.submittedBadge
                          : styles.draftBadge),
                      }}
                    >
                      {!sheet.is_draft ? "Submitted" : "Draft"}
                    </span>
                  </div>

                  <div>
                    {!sheet.is_draft && sheet.submitted_at
                      ? new Date(sheet.submitted_at).toLocaleDateString()
                      : "Not submitted"}
                  </div>

                  <div style={styles.actionButtons}>
                    <button
                      onClick={() => viewSheetDetails(sheet)}
                      style={{ ...styles.actionButton, ...styles.viewButton }}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
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
        )}
      </div>

      {showDetailModal && selectedSheet && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>Downtime Sheet Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div>
              <h3>Character Information</h3>
              <p>
                <strong>Name:</strong>{" "}
                {selectedSheet.characters?.name || selectedSheet.character_name}
              </p>
              <p>
                <strong>Game Session:</strong>{" "}
                {selectedSheet.characters?.game_session || "Unknown"}
              </p>
              <p>
                <strong>Academic Period:</strong> Year {selectedSheet.year},
                Semester {selectedSheet.semester}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedSheet.submitted_at ? "Submitted" : "Draft"}
              </p>
              {selectedSheet.submitted_at && (
                <p>
                  <strong>Submitted:</strong>{" "}
                  {new Date(selectedSheet.submitted_at).toLocaleString()}
                </p>
              )}

              <h3>Activities</h3>
              {selectedSheet.activities?.map((activity, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "16px",
                    padding: "12px",
                    backgroundColor: theme.background,
                    borderRadius: "6px",
                  }}
                >
                  <p>
                    <strong>Activity {index + 1}:</strong>{" "}
                    {activity.activity || "Not selected"}
                  </p>
                  {activity.npc && (
                    <p>
                      <strong>NPC/Location:</strong> {activity.npc}
                    </p>
                  )}
                  <p>
                    <strong>Successes:</strong>{" "}
                    {activity.successes?.filter((s) => s).length || 0}/5
                  </p>
                </div>
              ))}

              {selectedSheet.selected_magic_school && (
                <div>
                  <h3>Magic School Selection</h3>
                  <p>
                    <strong>Selected School:</strong>{" "}
                    {selectedSheet.selected_magic_school}
                  </p>
                </div>
              )}

              <h3>Dice Pool</h3>
              <p>
                <strong>Dice Rolls:</strong>{" "}
                {selectedSheet.dice_pool?.join(", ") || "None"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDowntimeManager;
