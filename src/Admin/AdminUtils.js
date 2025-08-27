import React from "react";
import { useAdmin } from "../contexts/AdminContext";
import { useTheme } from "../contexts/ThemeContext";
import { LogOut, Shield } from "lucide-react";

export const AdminUtilities = ({ user }) => {
  const { theme } = useTheme();
  const { isUserAdmin, adminMode, clearPasswordVerification, setAdminMode } =
    useAdmin();

  const discordUserId = user?.user_metadata?.provider_id;
  const hasPasswordVerification =
    discordUserId &&
    localStorage.getItem(`admin_password_verified_${discordUserId}`) === "true";

  if (!isUserAdmin || !hasPasswordVerification) {
    return null;
  }

  const handleRevokeAccess = () => {
    if (
      window.confirm(
        "This will revoke your admin password access. You will need to re-enter the password to regain admin privileges. Continue?"
      )
    ) {
      clearPasswordVerification();
    }
  };

  const handleClearSession = () => {
    sessionStorage.removeItem("admin_mode_enabled");
    setAdminMode(false);
  };

  const styles = {
    container: {
      padding: "12px",
      marginTop: "8px",
      backgroundColor: theme.surface,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
    },
    title: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "12px",
      fontSize: "14px",
      fontWeight: "600",
      color: theme.text,
    },
    button: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      marginBottom: "8px",
      backgroundColor: theme.background,
      color: theme.textSecondary,
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      fontSize: "13px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      width: "100%",
      justifyContent: "flex-start",
    },
    dangerButton: {
      backgroundColor: theme.error + "10",
      color: theme.error,
      borderColor: theme.error + "40",
    },
    info: {
      fontSize: "12px",
      color: theme.textSecondary,
      marginTop: "8px",
      padding: "8px",
      backgroundColor: theme.background,
      borderRadius: "4px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <Shield size={16} />
        Admin Session Management
      </div>

      <button
        style={styles.button}
        onClick={handleClearSession}
        title="Disables admin mode for this browser session only"
      >
        <LogOut size={14} />
        End Current Session
      </button>

      <button
        style={{ ...styles.button, ...styles.dangerButton }}
        onClick={handleRevokeAccess}
        title="Permanently revokes password access until re-verified"
      >
        <Shield size={14} />
        Revoke Password Access
      </button>

      <div style={styles.info}>
        <strong>Session Storage:</strong> Admin mode{" "}
        {adminMode ? "enabled" : "disabled"} for this session
        <br />
        <strong>Local Storage:</strong> Password verified{" "}
        {hasPasswordVerification ? "✓" : "✗"}
      </div>
    </div>
  );
};

export const debugAdminStorage = (discordUserId) => {
  console.group("🔍 Admin Storage Debug");
  console.log(
    "SessionStorage (admin_mode_enabled):",
    sessionStorage.getItem("admin_mode_enabled")
  );
  console.log(
    `LocalStorage (admin_password_verified_${discordUserId}):`,
    localStorage.getItem(`admin_password_verified_${discordUserId}`)
  );
  console.groupEnd();
};
