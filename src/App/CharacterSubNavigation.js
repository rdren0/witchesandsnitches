import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const CharacterSubNavigation = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const characterSubtabs = [
    { path: "/character/sheet", label: "Character Sheet", key: "sheet" },
    { path: "/character/spellbook", label: "Spellbook", key: "spellbook" },
    { path: "/character/potions", label: "Potions", key: "potions" },
    { path: "/character/inventory", label: "Inventory", key: "inventory" },
    {
      path: "/character/gallery",
      label: "NPC Gallery",
      key: "gallery",
    },
    {
      path: "/character/players",
      label: "Other Players",
      key: "players",
    },
    { path: "/character/notes", label: "Notes", key: "notes" },
    { path: "/character/recipes", label: "Recipes", key: "recipes" },

    { path: "/character/downtime", label: "Downtime", key: "downtime" },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div
      style={{
        borderBottom: `1px solid ${theme.border}`,
        backgroundColor: theme.background,
        padding: "0 20px",
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: "2px",
          margin: "0 auto",
          paddingTop: "8px",
        }}
      >
        {characterSubtabs.map((subtab) => {
          const active = isActive(subtab.path);

          return (
            <button
              key={subtab.key}
              style={{
                border: "none",
                borderRadius: "12px 12px 0 0",
                padding: "12px 18px 14px 18px",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                marginBottom: "-1px",
                minWidth: "130px",
                color: theme.primary,

                ...(active
                  ? {
                      background: `linear-gradient(135deg, ${theme.surface}, ${theme.surface}CC)`,
                      color: theme.text,
                      fontWeight: "700",
                      borderBottom: `4px solid ${theme.primary}`,
                      boxShadow: `
                    0 -4px 8px rgba(0, 0, 0, 0.1),
                    0 0 0 1px ${theme.border},
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `,
                      transform: "translateY(-2px)",
                      zIndex: 10,
                    }
                  : {
                      background: `linear-gradient(135deg, ${theme.background}40, ${theme.background}20)`,
                      color: theme.text,
                      fontWeight: "400",
                      borderBottom: "4px solid transparent",
                      transform: "translateY(0px)",
                    }),
              }}
              onClick={() => navigate(subtab.path)}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  justifyContent: "center",
                }}
              >
                {subtab.label}
                {subtab.isNew && (
                  <span
                    style={{
                      backgroundColor: theme.primary || "#10b981",
                      color: "white",
                      padding: "4px 6px",
                      borderRadius: "10px",
                      fontSize: "10px",
                      fontWeight: "700",
                      letterSpacing: "0.5px",
                      lineHeight: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    NEW
                  </span>
                )}
                {subtab.isUpdated && (
                  <span
                    style={{
                      backgroundColor: theme.warning,
                      color: "white",
                      padding: "4px 6px",
                      borderRadius: "10px",
                      fontSize: "10px",
                      fontWeight: "700",
                      letterSpacing: "0.5px",
                      lineHeight: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    UPDATED
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

export default CharacterSubNavigation;
