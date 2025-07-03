import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  Shield,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Database,
  FileText,
  Clock,
} from "lucide-react";
import AdminDowntimeManager from "./AdminDowntimeManager";

const AdminDashboard = ({ supabase }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardStats, setDashboardStats] = useState({
    totalCharacters: 0,
    downtimeSheets: 0,
    activeSessions: 0,
  });
  const [loading, setLoading] = useState(true);

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
      padding: "24px",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.primary}`,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      color: theme.text,
      margin: 0,
    },
    subtitle: {
      fontSize: "16px",
      color: theme.textSecondary,
      margin: "8px 0 0 0",
    },
    tabNavigation: {
      display: "flex",
      gap: "4px",
      marginBottom: "24px",
      backgroundColor: theme.surface,
      padding: "8px",
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
    },
    tab: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 20px",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      color: theme.textSecondary,
      cursor: "pointer",
      transition: "all 0.2s ease",
      minWidth: "140px",
      justifyContent: "center",
    },
    activeTab: {
      backgroundColor: theme.primary,
      color: theme.text,
      fontWeight: "600",
    },
    tabContent: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      minHeight: "500px",
    },
    overviewGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      padding: "24px",
    },
    statCard: {
      padding: "24px",
      backgroundColor: theme.background,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      textAlign: "center",
      transition: "transform 0.2s ease",
    },
    statIcon: {
      marginBottom: "16px",
    },
    statNumber: {
      fontSize: "36px",
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: "8px",
    },
    statLabel: {
      fontSize: "16px",
      color: theme.textSecondary,
      fontWeight: "500",
    },
    statDescription: {
      fontSize: "14px",
      color: theme.textSecondary,
      marginTop: "8px",
      fontStyle: "italic",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      color: theme.textSecondary,
      fontSize: "16px",
    },
    errorContainer: {
      padding: "24px",
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      borderRadius: "8px",
      margin: "24px",
      textAlign: "center",
    },
    quickActions: {
      padding: "24px",
    },
    quickActionsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginTop: "16px",
    },
    actionCard: {
      padding: "20px",
      backgroundColor: theme.background,
      borderRadius: "8px",
      border: `2px solid ${theme.border}`,
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "center",
    },
    actionIcon: {
      marginBottom: "12px",
    },
    actionTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
    },
    actionDescription: {
      fontSize: "14px",
      color: theme.textSecondary,
    },
  };

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      component: <OverviewTab stats={dashboardStats} styles={styles} />,
    },
    {
      id: "downtime",
      label: "Downtime Management",
      icon: Calendar,
      component: <AdminDowntimeManager supabase={supabase} />,
    },
  ];

  const loadDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      const { count: charactersCount } = await supabase
        .from("characters")
        .select("*", { count: "exact", head: true })
        .eq("active", true);

      const { count: downtimeCount } = await supabase
        .from("character_downtime")
        .select("*", { count: "exact", head: true });

      const { data: sessions } = await supabase
        .from("characters")
        .select("game_session")
        .eq("active", true)
        .not("game_session", "is", null);

      const activeSessions = new Set(
        sessions?.map((s) => s.game_session).filter(Boolean)
      ).size;

      setDashboardStats({
        totalCharacters: charactersCount || 0,
        downtimeSheets: downtimeCount || 0,
        activeSessions: activeSessions || 0,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Shield size={40} color={theme.primary} />
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>
            Manage users, characters, downtime sheets, and system settings
          </p>
        </div>
      </div>

      <div style={styles.tabNavigation}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                ...(isActive ? styles.activeTab : {}),
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={styles.tabContent}>{activeTabData?.component}</div>
    </div>
  );
};

const OverviewTab = ({ stats, styles }) => {
  const { theme } = useTheme();

  const statCards = [
    {
      icon: FileText,
      number: stats.totalCharacters,
      label: "Total Characters",
      description: "Created across all sessions",
      color: "#10b981",
    },
    {
      icon: Calendar,
      number: stats.downtimeSheets,
      label: "Downtime Sheets",
      description: "Submitted and draft sheets",
      color: "#f59e0b",
    },
    {
      icon: Database,
      number: stats.activeSessions,
      label: "Active Sessions",
      description: "Unique game sessions",
      color: "#8b5cf6",
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
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={styles.statIcon}>
                <Icon size={32} color={card.color} />
              </div>
              <div style={{ ...styles.statNumber, color: card.color }}>
                {card.number}
              </div>
              <div style={styles.statLabel}>{card.label}</div>
              <div style={styles.statDescription}>{card.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UserManagementTab = ({ supabase, styles }) => (
  <div style={styles.loadingContainer}>
    <div>
      <h3>User Management</h3>
      <p>User management features coming soon...</p>
    </div>
  </div>
);

const CharacterManagementTab = ({ supabase, styles }) => (
  <div style={styles.loadingContainer}>
    <div>
      <h3>Character Management</h3>
      <p>Character management features coming soon...</p>
    </div>
  </div>
);

const SystemSettingsTab = ({ styles }) => (
  <div style={styles.loadingContainer}>
    <div>
      <h3>System Settings</h3>
      <p>System configuration options coming soon...</p>
    </div>
  </div>
);

export default AdminDashboard;
