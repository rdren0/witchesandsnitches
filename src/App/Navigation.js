import { useMemo } from "react";
import { Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAdmin } from "../contexts/AdminContext";
import { createAppStyles } from "../utils/styles/masterStyles";
import logo from "../Images/logo/Thumbnail-01.png";

const Navigation = ({ characters }) => {
  const { theme } = useTheme();
  const { adminMode } = useAdmin();
  const styles = createAppStyles(theme);
  const navigate = useNavigate();
  const location = useLocation();

  const visibleTabs = useMemo(() => {
    const baseTabs = [
      {
        path: "/",
        label: "Character Management",
        key: "character-management",
      },
    ];

    if (characters.length > 0) {
      baseTabs.push({
        path: "/character/sheet",
        label: "Character Sheet",
        key: "character",
      });
    }

    baseTabs.push({
      path: "/help-resources",
      label: "Help & Resources",
      key: "help-resources",
    });

    if (adminMode) {
      return [
        ...baseTabs,
        {
          path: "/admin",
          label: "Admin Dashboard",
          key: "admin",
        },
      ];
    }

    return baseTabs;
  }, [characters.length, adminMode]);

  const isActiveTab = (path) => {
    if (path === "/") {
      return (
        location.pathname === "/" ||
        location.pathname === "/character-management" ||
        location.pathname.startsWith("/character-management/")
      );
    }
    if (path === "/character/sheet") {
      return location.pathname.startsWith("/character/");
    }
    return location.pathname === path;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        marginRight: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          flexShrink: 0,
        }}
        onClick={() => navigate("/")}
        title="Home"
      >
        <img
          src={logo}
          alt="Witches & Snitches Logo"
          style={{
            height: "60px",
            width: "auto",
            transition: "opacity 0.2s ease",
            marginRight: "16px",
          }}
        />
      </div>

      <nav style={styles.tabNavigation}>
        {visibleTabs.map((tab) => {
          const isActive = isActiveTab(tab.path);
          const isAdminTab = tab.key === "admin";

          return (
            <button
              key={tab.key}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
                minWidth: "120px",

                ...(isActive
                  ? {
                      backgroundColor: theme.surface,
                      color: theme.text,
                      fontWeight: "600",
                      boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
                      border: `1px solid ${theme.border}`,
                    }
                  : {
                      backgroundColor: "transparent",
                      color: theme.text,
                      fontWeight: "400",
                      opacity: 0.85,
                    }),

                ...(isAdminTab && adminMode && isActive
                  ? {
                      backgroundColor: theme.warning,
                      color: theme.primary,
                      fontWeight: "bold",
                    }
                  : isAdminTab && adminMode
                    ? {
                        backgroundColor: `${theme.warning}30`,
                        color: theme.text,
                        opacity: 0.9,
                      }
                    : {}),
              }}
              onClick={() => navigate(tab.path)}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  justifyContent: "center",
                }}
              >
                {isAdminTab && (
                  <Shield size={16} style={{ marginRight: "6px" }} />
                )}
                {tab.label}
                {tab.isNew && (
                  <span
                    style={{
                      backgroundColor: theme.primary || "#10b981",
                      color: "white",
                      padding: "6px",
                      borderRadius: "10px",
                      fontSize: "9px",
                      fontWeight: "700",
                      letterSpacing: "0.5px",
                      lineHeight: "1",
                      marginLeft: "4px",
                    }}
                  >
                    NEW
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;
