// Enhanced DowntimeSheet.js with Dashboard Tabs
import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getDowntimeStyles } from "../../styles/masterStyles";
import {
  Calendar,
  Plus,
  FileText,
  Eye,
  Edit,
  Clock,
  CheckCircle,
} from "lucide-react";

const DowntimeSheet = ({
  selectedCharacter,
  user,
  supabase,
  adminMode,
  isUserAdmin,
  // ... other existing props
}) => {
  const { theme } = useTheme();
  const styles = getDowntimeStyles(theme);

  // Enhanced state management
  const [activeTab, setActiveTab] = useState("overview");
  const [submittedSheets, setSubmittedSheets] = useState([]);
  const [viewMode, setViewMode] = useState("overview");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [loading, setLoading] = useState(false);
  // ... other existing state

  // Load submitted sheets for the current character
  const loadSubmittedSheets = useCallback(async () => {
    if (!selectedCharacter?.id || !user?.id) return;

    setLoading(true);
    try {
      const { data: sheets, error } = await supabase
        .from("character_downtime")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .eq("user_id", user.id)
        .eq("is_draft", false) // Only submitted sheets
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

  // Enhanced function to check if year/semester combination is submitted
  const isYearSemesterSubmitted = useCallback(
    (year, semester) => {
      return submittedSheets.some(
        (sheet) => sheet.year === year && sheet.semester === semester
      );
    },
    [submittedSheets]
  );

  // Get all submitted year/semester combinations
  const getSubmittedCombinations = useCallback(() => {
    return submittedSheets.map((sheet) => ({
      year: sheet.year,
      semester: sheet.semester,
      id: sheet.id,
      submitted_at: sheet.submitted_at,
    }));
  }, [submittedSheets]);

  // Enhanced dropdown filtering
  const getAvailableYears = useCallback(() => {
    const allYears = [1, 2, 3, 4, 5, 6, 7];
    return allYears.map((year) => ({
      value: year,
      disabled: false, // Years are not disabled, only year+semester combinations
      hasSubmissions: submittedSheets.some((sheet) => sheet.year === year),
    }));
  }, [submittedSheets]);

  const getAvailableSemesters = useCallback(() => {
    const allSemesters = [1, 2];
    return allSemesters.map((semester) => ({
      value: semester,
      disabled: selectedYear
        ? isYearSemesterSubmitted(selectedYear, semester)
        : false,
      isSubmitted: selectedYear
        ? isYearSemesterSubmitted(selectedYear, semester)
        : false,
    }));
  }, [selectedYear, isYearSemesterSubmitted]);

  // Load data on mount and character change
  useEffect(() => {
    if (selectedCharacter?.id && user?.id) {
      loadSubmittedSheets();
    }
  }, [selectedCharacter?.id, user?.id, loadSubmittedSheets]);

  // Tab configuration
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: Calendar,
      description: "View your downtime summary",
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
  ];

  // Enhanced styles for the dashboard
  const dashboardStyles = {
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
  };

  // Overview Tab Component
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
        {/* Summary Cards */}
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

      {/* Recent Activity */}
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

      {/* Quick Actions */}
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

  // Submitted Sheets Tab Component
  const SubmittedSheetsTab = () => (
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
          {/* Headers */}
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

          {/* Sheet List */}
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
              <div style={{ color: theme.text }}>Semester {sheet.semester}</div>
              <div style={{ color: theme.textSecondary, fontSize: "14px" }}>
                {new Date(sheet.submitted_at).toLocaleDateString()}
              </div>
              <div>
                <span
                  style={{
                    padding: "4px 8px",
                    backgroundColor: theme.success + "20",
                    color: theme.success,
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  Submitted
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => {
                    // View sheet logic here
                    setSelectedYear(sheet.year);
                    setSelectedSemester(sheet.semester);
                    setActiveTab("create"); // This will show the sheet in view mode
                  }}
                  style={{
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
                  }}
                  title="View Sheet"
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

  // Enhanced Create Tab with improved dropdown logic
  const CreateTab = () => (
    <div>
      <h3 style={{ color: theme.text, marginBottom: "1.5rem" }}>
        Create New Downtime Sheet
      </h3>

      {/* Enhanced Year/Semester Selection */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <label
              style={{ ...styles.label, display: "block", marginBottom: "8px" }}
            >
              Academic Year:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedSemester(""); // Reset semester when year changes
              }}
              style={styles.select}
            >
              <option value="">Select Year...</option>
              {getAvailableYears().map((yearInfo) => (
                <option key={yearInfo.value} value={yearInfo.value}>
                  Year {yearInfo.value}
                  {yearInfo.hasSubmissions ? " (Has submissions)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{ ...styles.label, display: "block", marginBottom: "8px" }}
            >
              Semester:
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={styles.select}
              disabled={!selectedYear}
            >
              <option value="">Select Semester...</option>
              {getAvailableSemesters().map((semesterInfo) => (
                <option
                  key={semesterInfo.value}
                  value={semesterInfo.value}
                  disabled={semesterInfo.disabled}
                >
                  Semester {semesterInfo.value}
                  {semesterInfo.isSubmitted ? " (Already Submitted)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Warning if trying to select submitted combination */}
        {selectedYear &&
          selectedSemester &&
          isYearSemesterSubmitted(selectedYear, selectedSemester) && (
            <div
              style={{
                padding: "12px",
                backgroundColor: theme.warning + "20",
                border: `1px solid ${theme.warning}`,
                borderRadius: "8px",
                color: theme.warning,
                fontSize: "14px",
              }}
            >
              ⚠️ You have already submitted a downtime sheet for Year{" "}
              {selectedYear}, Semester {selectedSemester}.
            </div>
          )}

        {/* Information about available combinations */}
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

      {/* Rest of the create form would go here */}
      {selectedYear &&
        selectedSemester &&
        !isYearSemesterSubmitted(selectedYear, selectedSemester) && (
          <div
            style={{
              padding: "2rem",
              backgroundColor: theme.background,
              borderRadius: "8px",
              border: `1px solid ${theme.border}`,
              textAlign: "center",
            }}
          >
            <h4 style={{ color: theme.text, marginBottom: "1rem" }}>
              Ready to Create Sheet
            </h4>
            <p style={{ color: theme.textSecondary, marginBottom: "1.5rem" }}>
              Year {selectedYear}, Semester {selectedSemester}
            </p>
            {/* The existing downtime form components would be rendered here */}
            <div style={{ color: theme.textSecondary, fontStyle: "italic" }}>
              [Existing DowntimeForm, ActivityManager, etc. components would be
              rendered here]
            </div>
          </div>
        )}
    </div>
  );

  // Main render
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
      {/* Header */}
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

      {/* Tab Navigation */}
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

      {/* Tab Content */}
      <div style={dashboardStyles.content}>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "create" && <CreateTab />}
        {activeTab === "submitted" && <SubmittedSheetsTab />}
      </div>
    </div>
  );
};

export default DowntimeSheet;
