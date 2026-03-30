import { User, Palette, Shield, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAdmin } from "../contexts/AdminContext";
import { createAppStyles } from "../utils/styles/masterStyles";
import UsernameEditor from "./UsernameEditor";

const AuthComponent = ({
  user,
  customUsername,
  onUsernameUpdate,
  onSignIn,
  onSignOut,
  isLoading,
  onAdminToggleClick,
}) => {
  const { theme } = useTheme();
  const { isUserAdmin, adminMode } = useAdmin();
  const styles = createAppStyles(theme);
  const navigate = useNavigate();

  if (user) {
    return (
      <div style={styles.authSection}>
        {isUserAdmin && (
          <button
            onClick={onAdminToggleClick}
            style={{
              ...styles.themeButton,
              backgroundColor: adminMode ? theme.warning : theme.surface,
              color: adminMode ? theme.secondary : theme.primary,
              border: adminMode
                ? `2px solid ${theme.accent}`
                : `1px solid ${theme.border}`,
              fontWeight: adminMode ? "bold" : "normal",

              transform: adminMode ? "scale(1.05)" : "scale(1)",
              transition: "all 0.2s ease",
              position: "relative",
              textShadow: adminMode ? "0 1px 2px rgba(0, 0, 0, 0.3)" : "none",
            }}
            title={
              isUserAdmin
                ? adminMode
                  ? "🔓 Admin Mode ACTIVE - Click to exit"
                  : "🔒 Enter Admin Mode"
                : "🔑 Unlock Admin Mode"
            }
          >
            {adminMode ? (
              <>
                <Shield size={16} />
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "6px",
                    height: "6px",
                    backgroundColor: theme.error,
                    borderRadius: "50%",
                    border: "1px solid white",
                  }}
                />
              </>
            ) : (
              <Key size={16} />
            )}
          </button>
        )}

        <button
          onClick={() => navigate("/theme-settings")}
          style={styles.themeButton}
          title="Theme Settings"
        >
          <Palette size={16} color={theme.primary} />
        </button>

        <div style={styles.userInfo}>
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              style={styles.userAvatar}
            />
          ) : (
            <div
              style={{
                ...styles.userAvatar,
                backgroundColor: theme.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={20} color={theme.secondary} />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <UsernameEditor
              user={user}
              customUsername={customUsername}
              onUsernameUpdate={onUsernameUpdate}
            />
            <button
              onClick={onSignOut}
              style={{
                ...styles.cancelButton,
                fontSize: "12px",
                padding: "4px 8px",
                alignSelf: "flex-start",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.authSection}>
      <button
        onClick={() => navigate("/theme-settings")}
        style={styles.themeButton}
        title="Theme Settings"
      >
        <Palette size={16} color={theme.primary} />
      </button>

      <button
        onClick={onSignIn}
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "0.25rem",
          fontWeight: "500",
          cursor: "pointer",
          transition: "background-color 0.2s",
          minWidth: "80px",
          backgroundColor: theme.primary,
          color: theme.text,
          opacity: isLoading ? 0.6 : 1,
        }}
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign in with Discord"}
      </button>
    </div>
  );
};

export default AuthComponent;
