import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon, Home, Palette } from "lucide-react";

const ThemeSettings = () => {
  const {
    themeMode,
    setThemeMode,
    theme,
    selectedCharacter,
    availableHouses,
    HOUSE_THEMES,
    normalizeHouseName,
    setSelectedCharacter,
  } = useTheme();

  const themeOptions = [
    {
      id: "light",
      name: "Light Theme",
      description: "Clean and bright interface",
      icon: Sun,
      preview: {
        primary: "#6366F1",
        secondary: "#8B5CF6",
        background: "#F9FAFB",
      },
    },
    {
      id: "dark",
      name: "Dark Theme",
      description: "Easy on the eyes for low-light environments",
      icon: Moon,
      preview: {
        primary: "#8B5CF6",
        secondary: "#6366F1",
        background: "#111827",
      },
    },

    {
      id: "house",
      name: "House Theme",
      description: selectedCharacter?.house
        ? `Themed for ${selectedCharacter.house}`
        : "Select a character to use house colors",
      icon: Home,
      preview: selectedCharacter?.house
        ? (() => {
            const normalizedHouse =
              selectedCharacter.house === "Wampus Cat"
                ? "Wampus"
                : selectedCharacter.house;
            const houseTheme = HOUSE_THEMES[normalizedHouse];
            return houseTheme
              ? {
                  primary: houseTheme.primary,
                  secondary: houseTheme.secondary,
                  background: houseTheme.background,
                }
              : {
                  primary: "#6B7280",
                  secondary: "#9CA3AF",
                  background: "#F3F4F6",
                };
          })()
        : {
            primary: "#6B7280",
            secondary: "#9CA3AF",
            background: "#F3F4F6",
          },
      disabled: !selectedCharacter?.house,
    },
  ];

  const handleThemeChange = (newTheme) => {
    setThemeMode(newTheme);
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "24px",
      paddingBottom: "16px",
      borderBottom: `2px solid ${theme.border}`,
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: theme.text,
      margin: 0,
    },
    description: {
      color: theme.textSecondary,
      fontSize: "16px",
      marginBottom: "24px",
    },
    themeGrid: {
      display: "grid",
      gap: "16px",
      marginBottom: "24px",
    },
    themeOption: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "20px",
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      backgroundColor: theme.surface,
      cursor: "pointer",
      transition: "all 0.2s ease",
      opacity: 1,
    },
    themeOptionActive: {
      borderColor: theme.primary,
      backgroundColor: theme.background,
      boxShadow: `0 0 0 2px ${theme.primary}20`,
    },
    themeOptionDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    themeIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    themeInfo: {
      flex: 1,
    },
    themeName: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "4px",
    },
    themeDescription: {
      fontSize: "14px",
      color: theme.textSecondary,
    },
    colorPreview: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
    },
    colorSwatch: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      border: `2px solid ${theme.border}`,
    },
    radioButton: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      border: `2px solid ${theme.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    radioButtonActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    radioButtonInner: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: theme.surface,
    },
    housePreview: {
      marginTop: "16px",
      padding: "16px",
      borderRadius: "8px",
      backgroundColor: theme.background,
      border: `1px solid ${theme.border}`,
    },
    housePreviewTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "12px",
    },
    houseGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
      gap: "12px",
    },
    houseCard: {
      padding: "12px",
      borderRadius: "8px",
      textAlign: "center",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
    },
    houseName: {
      fontSize: "12px",
      fontWeight: "500",
      color: theme.text,
      marginBottom: "8px",
    },
    houseColors: {
      display: "flex",
      gap: "4px",
      justifyContent: "center",
    },
    houseColorSwatch: {
      width: "16px",
      height: "16px",
      borderRadius: "50%",
    },
  };

  return (
    <div style={styles.container}>
      {/* <div style={styles.header}>
        <Palette size={32} color={theme.primary} />
        <h1 style={styles.title}>Theme Settings</h1>
      </div> */}

      <p style={styles.description}>
        Customize the appearance of your character manager. Choose from light,
        dark, or house-themed color schemes.
      </p>

      <div style={styles.themeGrid}>
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = themeMode === option.id;
          const isDisabled = option.disabled;

          return (
            <div
              key={option.id}
              style={{
                ...styles.themeOption,
                ...(isActive ? styles.themeOptionActive : {}),
                ...(isDisabled ? styles.themeOptionDisabled : {}),
              }}
              onClick={() => !isDisabled && handleThemeChange(option.id)}
              onMouseEnter={(e) => {
                if (!isDisabled && !isActive) {
                  e.target.style.borderColor = theme.primary + "50";
                  e.target.style.backgroundColor = theme.background;
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled && !isActive) {
                  e.target.style.borderColor = theme.border;
                  e.target.style.backgroundColor = theme.surface;
                }
              }}
            >
              <div
                style={{
                  ...styles.themeIcon,
                  backgroundColor: option.preview.primary + "20",
                }}
              >
                <Icon size={24} color={option.preview.primary} />
              </div>

              <div style={styles.themeInfo}>
                <div style={styles.themeName}>{option.name}</div>
                <div style={styles.themeDescription}>{option.description}</div>
              </div>

              <div style={styles.colorPreview}>
                <div
                  style={{
                    ...styles.colorSwatch,
                    backgroundColor: option.preview.primary,
                  }}
                />
                <div
                  style={{
                    ...styles.colorSwatch,
                    backgroundColor: option.preview.secondary,
                  }}
                />
                <div
                  style={{
                    ...styles.colorSwatch,
                    backgroundColor: option.preview.background,
                  }}
                />
              </div>

              <div
                style={{
                  ...styles.radioButton,
                  ...(isActive ? styles.radioButtonActive : {}),
                }}
              >
                {isActive && <div style={styles.radioButtonInner} />}
              </div>
            </div>
          );
        })}
      </div>
      {themeMode === "house" && (
        <div style={styles.housePreview}>
          <div style={styles.housePreviewTitle}>Available House Themes</div>
          <div style={styles.houseGrid}>
            {availableHouses.map((house) => {
              const houseTheme = HOUSE_THEMES[house];
              const normalizedCurrentHouse = selectedCharacter?.house
                ? normalizeHouseName(selectedCharacter.house)
                : null;
              const isCurrentHouse = normalizedCurrentHouse === house;

              return (
                <div
                  key={house}
                  style={{
                    ...styles.houseCard,
                    cursor: "pointer",
                    border: isCurrentHouse
                      ? `2px solid ${theme.primary}`
                      : `1px solid ${theme.border}`,
                    backgroundColor: isCurrentHouse
                      ? theme.primary + "10"
                      : theme.surface,
                    transform: isCurrentHouse ? "scale(1.02)" : "scale(1)",
                    transition: "all 0.2s ease",
                  }}
                  onClick={async () => {
                    console.log(`Switching to ${house} theme`);

                    try {
                      await setSelectedCharacter({
                        id: "theme-preview",
                        name: "Theme Preview",
                        house: house,
                      });

                      await setThemeMode("light");
                      await new Promise((resolve) => setTimeout(resolve, 10));
                      await setThemeMode("house");

                      console.log(
                        `Should now be ${house} theme with primary: ${houseTheme?.primary}`
                      );
                    } catch (error) {
                      console.error("Theme switch failed:", error);
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrentHouse) {
                      e.target.style.backgroundColor = theme.primary + "05";
                      e.target.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrentHouse) {
                      e.target.style.backgroundColor = theme.surface;
                      e.target.style.transform = "scale(1)";
                    }
                  }}
                >
                  <div style={styles.houseName}>{house}</div>
                  <div style={styles.houseColors}>
                    <div
                      style={{
                        ...styles.houseColorSwatch,
                        backgroundColor: houseTheme?.primary || "#6B7280",
                      }}
                    />
                    <div
                      style={{
                        ...styles.houseColorSwatch,
                        backgroundColor: houseTheme?.secondary || "#9CA3AF",
                      }}
                    />
                  </div>
                  {isCurrentHouse && (
                    <div
                      style={{
                        marginTop: "4px",
                        fontSize: "10px",
                        color: theme.primary,
                        fontWeight: "bold",
                      }}
                    >
                      ✓ Active
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedCharacter?.house && (
            <div
              style={{
                marginTop: "12px",
                padding: "8px 12px",
                backgroundColor: theme.primary + "20",
                borderRadius: "6px",
                fontSize: "14px",
                color: theme.text,
                textAlign: "center",
              }}
            >
              Currently using <strong>{selectedCharacter.house}</strong> theme
              <br />
              <small style={{ fontSize: "12px", opacity: 0.8 }}>
                Primary: {theme.primary} | Expected:{" "}
                {
                  HOUSE_THEMES[normalizeHouseName(selectedCharacter.house)]
                    ?.primary
                }
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThemeSettings;
