import React, { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Gamepad2,
  Star,
  Archive,
  Calendar,
  BarChart3,
  FileText,
  Database,
  Loader,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import SessionManagement from "./SessionManagement";
import GameSessionInspirationManager from "./GameSessionInspirationManager";
import AdminDowntimeManager from "./AdminDowntimeManager";
import { characterService } from "../services/characterService";

const AdminDashboard = ({ supabase }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardStats, setDashboardStats] = useState({
    totalCharacters: 0,
    downtimeSheets: 0,
    activeSessions: 0,
  });

  const adminStyles = {
    container: {
      padding: "20px",
      backgroundColor: theme.background,
      minHeight: "100vh",
    },
    header: {
      marginBottom: "24px",
      textAlign: "center",
      padding: "20px",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      color: theme.text,
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
    },
    subtitle: {
      fontSize: "16px",
      color: theme.textSecondary,
      margin: "0",
    },
    adminBadge: {
      display: "inline-block",
      backgroundColor: "#ff6b35",
      color: "white",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold",
      marginBottom: "16px",
    },
    tabNavigation: {
      display: "flex",
      gap: "4px",
      marginBottom: "24px",
      backgroundColor: theme.surface,
      padding: "8px",
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      flexWrap: "wrap",
    },
    tab: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "transparent",
      color: theme.text,
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      minWidth: "140px",
    },
    activeTab: {
      backgroundColor: theme.primary,
      fontWeight: "600",
      color: theme.text,
    },
    tabContent: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      minHeight: "400px",
      overflow: "hidden",
      color: theme.text,
    },

    overviewGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      padding: "24px",
    },
    statCard: {
      backgroundColor: theme.background,
      padding: "24px",
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      textAlign: "center",
      transition: "all 0.2s ease",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    },
    statIcon: {
      marginBottom: "16px",
      display: "flex",
      justifyContent: "center",
    },
    statNumber: {
      fontSize: "36px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    statLabel: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "4px",
    },
    statDescription: {
      fontSize: "14px",
      color: theme.textSecondary,
      marginBottom: "8px",
    },
    clickHint: {
      fontSize: "12px",
      color: theme.primary,
      fontWeight: "500",
      opacity: 0.8,
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "60px 20px",
      color: theme.textSecondary,
    },
  };

  const loadDashboardStats = useCallback(async () => {
    try {
      const { data: allCharacters } = await supabase
        .from("characters")
        .select("discord_user_id, game_session")
        .eq("active", true);

      const validCharacters =
        allCharacters?.filter(
          (char) =>
            char.game_session &&
            char.game_session.trim() !== "" &&
            char.game_session.toLowerCase() !== "development"
        ) || [];

      const uniqueUsers = new Set(
        validCharacters.map((c) => c.discord_user_id)
      );

      const uniqueSessions = new Set(
        validCharacters.map((c) => c.game_session)
      );

      const { data: downtimeSheets } = await supabase
        .from("character_downtime")
        .select("review_status, is_draft");

      const pendingReviewCount =
        downtimeSheets?.filter(
          (sheet) =>
            !sheet.is_draft &&
            (!sheet.review_status || sheet.review_status === "pending")
        ).length || 0;

      setDashboardStats({
        totalCharacters: validCharacters.length,
        activeUsers: uniqueUsers.size,
        downtimeSheets: pendingReviewCount,
        activeSessions: uniqueSessions.size,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  }, [supabase]);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      component: (
        <OverviewTab
          stats={dashboardStats}
          styles={adminStyles}
          onTabChange={setActiveTab}
        />
      ),
    },
    {
      id: "sessions",
      label: "Sessions",
      icon: Gamepad2,
      component: <SessionManagement supabase={supabase} />,
    },
    {
      id: "inspiration",
      label: "Inspiration",
      icon: Star,
      component: <GameSessionInspirationManager supabase={supabase} />,
    },
    {
      id: "downtime",
      label: "Downtime",
      icon: Calendar,
      component: <AdminDowntimeManager supabase={supabase} />,
      badge: dashboardStats.downtimeSheets,
    },
    {
      id: "archive",
      label: "Archive",
      icon: Archive,
      component: <ArchiveManagement supabase={supabase} />,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div style={adminStyles.container}>
      <div style={adminStyles.header}>
        <div style={adminStyles.adminBadge}>🔓 ADMIN ACCESS ACTIVE</div>
        <h1 style={adminStyles.title}>
          <Shield size={36} />
          Admin Dashboard
        </h1>
        <p style={adminStyles.subtitle}>
          Manage characters, sessions, and game data
        </p>
      </div>

      <div style={adminStyles.tabNavigation}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const hasBadge = tab.badge && tab.badge > 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...adminStyles.tab,
                ...(isActive ? adminStyles.activeTab : {}),
              }}
            >
              <Icon size={16} />
              {tab.label}
              {hasBadge && (
                <span
                  style={{
                    marginLeft: "8px",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    minWidth: "18px",
                    textAlign: "center",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={adminStyles.tabContent}>{activeTabData?.component}</div>
    </div>
  );
};

const OverviewTab = ({ stats, styles, onTabChange }) => {
  const { theme } = useTheme();

  const statCards = [
    {
      icon: FileText,
      number: stats.totalCharacters,
      label: "Total Characters",
      description: "Characters in active sessions",
      color: "#06b6d4",
      clickAction: () => onTabChange("sessions"),
    },

    {
      icon: FileText,
      number: stats.activeUsers,
      label: "Active Users",
      description: "Unique players across sessions",
      color: "#10b981",
      clickAction: () => onTabChange("sessions"),
    },
    {
      icon: Database,
      number: stats.activeSessions,
      label: "Active Sessions",
      description: "Unique game sessions",
      color: "#8b5cf6",
      clickAction: () => onTabChange("sessions"),
    },
    {
      icon: Calendar,
      number: stats.downtimeSheets,
      label: "Pending Reviews",
      description: "Downtime sheets awaiting admin review",
      color: "#f59e0b",
      clickAction: () => onTabChange("downtime"),
    },
  ];

  return (
    <div>
      <div style={styles.overviewGrid}>
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              style={{
                ...styles.statCard,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={card.clickAction}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 8px 25px ${card.color}25`;
                e.currentTarget.style.borderColor = card.color + "80";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = theme.border;
              }}
              title={`Click to view ${card.label.toLowerCase()}`}
            >
              <div style={styles.statIcon}>
                <Icon size={32} color={card.color} />
              </div>
              <div style={{ ...styles.statNumber, color: card.color }}>
                {card.number}
              </div>
              <div style={styles.statLabel}>{card.label}</div>
              <div style={styles.statDescription}>{card.description}</div>
              <div style={styles.clickHint}>Click to view →</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ArchiveManagement = ({ supabase }) => {
  const { theme } = useTheme();
  const [archivedCharacters, setArchivedCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [restoring, setRestoring] = useState(new Set());

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: theme.background,
      minHeight: "100vh",
    },
    header: {
      marginBottom: "24px",
      textAlign: "center",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: theme.text,
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
    },
    subtitle: {
      fontSize: "16px",
      color: theme.textSecondary,
      margin: "0",
    },
    controls: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "20px",
      padding: "16px",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
    },
    refreshButton: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: `2px solid ${theme.primary}`,
      backgroundColor: theme.primary,
      color: theme.text,
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s ease",
    },
    characterGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
      gap: "20px",
    },
    characterCard: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      padding: "20px",
      transition: "all 0.2s ease",
    },
    characterHeader: {
      marginBottom: "16px",
    },
    characterName: {
      fontSize: "20px",
      fontWeight: "bold",
      color: theme.text,
      marginBottom: "4px",
    },
    characterDetails: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
      marginBottom: "16px",
      fontSize: "14px",
      color: theme.textSecondary,
    },
    characterInfo: {
      padding: "8px 12px",
      backgroundColor: theme.background,
      borderRadius: "6px",
      border: `1px solid ${theme.border}`,
    },
    restoreButton: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#10b981",
      color: "white",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.2s ease",
    },
    restoreButtonDisabled: {
      backgroundColor: theme.border,
      color: theme.textSecondary,
      cursor: "not-allowed",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: theme.textSecondary,
    },
    errorState: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#ef4444",
      backgroundColor: "#fef2f2",
      borderRadius: "12px",
      border: "2px solid #fecaca",
      margin: "20px 0",
    },
    loadingState: {
      textAlign: "center",
      padding: "60px 20px",
      color: theme.textSecondary,
    },
  };

  const loadArchived = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const archived = await characterService.getArchivedCharacters();
      setArchivedCharacters(archived);
    } catch (err) {
      console.error("Error loading archived characters:", err);
      setError(err.message || "Failed to load archived characters");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRestore = async (characterId, discordUserId, characterName) => {
    if (!window.confirm(`Restore character "${characterName}"?`)) {
      return;
    }

    setRestoring((prev) => new Set(prev).add(characterId));

    try {
      const { data, error } = await supabase
        .from("characters")
        .update({
          active: true,
          archived_at: null,
        })
        .eq("id", characterId)
        .eq("discord_user_id", discordUserId)
        .eq("active", false)
        .select();

      if (error) {
        throw new Error(`Failed to restore character: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error("Character not found or already active");
      }

      setArchivedCharacters((prev) =>
        prev.filter((char) => char.id !== characterId)
      );
      alert("Character restored successfully!");
    } catch (err) {
      console.error("Error restoring character:", err);
      alert(`Failed to restore character: ${err.message}`);
    } finally {
      setRestoring((prev) => {
        const newSet = new Set(prev);
        newSet.delete(characterId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    loadArchived();
  }, [loadArchived]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <Loader className="animate-spin" size={48} color={theme.primary} />
          <h3 style={{ marginTop: "16px", color: theme.text }}>
            Loading archived characters...
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorState}>
          <AlertCircle size={48} />
          <h3 style={{ marginTop: "16px" }}>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={loadArchived} style={styles.refreshButton}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <Archive size={32} />
          Archive Management
        </h1>
        <p style={styles.subtitle}>View and restore archived characters</p>
      </div>

      <div style={styles.controls}>
        <button onClick={loadArchived} style={styles.refreshButton}>
          <RefreshCw size={16} />
          Refresh List
        </button>
      </div>

      {archivedCharacters.length === 0 ? (
        <div style={styles.emptyState}>
          <Archive size={48} color={theme.textSecondary} />
          <h3 style={{ marginTop: "16px", color: theme.text }}>
            No Archived Characters
          </h3>
          <p>No archived characters found.</p>
        </div>
      ) : (
        <div style={styles.characterGrid}>
          {archivedCharacters.map((character) => {
            const isRestoring = restoring.has(character.id);

            return (
              <div key={character.id} style={styles.characterCard}>
                <div style={styles.characterHeader}>
                  <div style={styles.characterName}>{character.name}</div>
                </div>

                <div style={styles.characterDetails}>
                  <div style={styles.characterInfo}>
                    <strong>Level:</strong> {character.level}
                  </div>
                  <div style={styles.characterInfo}>
                    <strong>Casting Style:</strong>{" "}
                    {character.casting_style || "Unknown"}
                  </div>
                  <div style={styles.characterInfo}>
                    <strong>House:</strong> {character.house || "None"}
                  </div>
                  <div style={styles.characterInfo}>
                    <strong>Session:</strong> {character.game_session || "None"}
                  </div>
                  <div style={styles.characterInfo}>
                    <strong>User ID:</strong> {character.discord_user_id}
                  </div>
                  <div style={styles.characterInfo}>
                    <strong>Archived:</strong>{" "}
                    {new Date(character.archived_at).toLocaleDateString()}
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleRestore(
                      character.id,
                      character.discord_user_id,
                      character.name
                    )
                  }
                  disabled={isRestoring}
                  style={{
                    ...styles.restoreButton,
                    ...(isRestoring ? styles.restoreButtonDisabled : {}),
                  }}
                >
                  {isRestoring ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Restoring...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      Restore Character
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
