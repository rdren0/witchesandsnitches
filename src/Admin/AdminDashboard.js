import React, { useState } from "react";
import { Shield, Gamepad2, Star } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import GameSessionInspirationManager from "./GameSessionInspirationManager";

const AdminDashboard = ({ supabase }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("inspiration");

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
    },
    tab: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "transparent",
      color: theme.textSecondary,
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.2s ease",
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
      minHeight: "400px",
      overflow: "hidden",
    },
    placeholder: {
      padding: "60px 40px",
      textAlign: "center",
      color: theme.textSecondary,
    },
  };

  const tabs = [
    {
      id: "sessions",
      label: "Session Management",
      icon: Gamepad2,
      component: (
        <div style={adminStyles.placeholder}>
          <Gamepad2 size={48} />
          <h3 style={{ marginTop: "16px", color: theme.text }}>
            Session Management
          </h3>
          <p>Game session management features will be implemented here.</p>
        </div>
      ),
    },
    {
      id: "inspiration",
      label: "Inspiration Manager",
      icon: Star,
      component: <GameSessionInspirationManager supabase={supabase} />,
    },

    //  {
    //   id: "users",
    //   label: "User Management",
    //   icon: Users,
    //   component: (
    //     <div style={adminStyles.placeholder}>
    //       <Users size={48} />
    //       <h3 style={{ marginTop: "16px", color: theme.text }}>
    //         User Management
    //       </h3>
    //       <p>User management features will be implemented here.</p>
    //     </div>
    //   ),
    // },
    // {
    //   id: "settings",
    //   label: "System Settings",
    //   icon: Settings,
    //   component: (
    //     <div style={adminStyles.placeholder}>
    //       <Settings size={48} />
    //       <h3 style={{ marginTop: "16px", color: theme.text }}>
    //         System Settings
    //       </h3>
    //       <p>System configuration options will be implemented here.</p>
    //     </div>
    //   ),
    // },
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
            </button>
          );
        })}
      </div>

      <div style={adminStyles.tabContent}>{activeTabData?.component}</div>
    </div>
  );
};

export default AdminDashboard;
