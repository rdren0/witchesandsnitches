// src/Components/Settings/ThemeSettings.js
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon, Home, Palette, Check, Eye } from "lucide-react";

const ThemeSettings = () => {
  const {
    themeMode,
    setThemeMode,
    theme,
    selectedCharacter,
    availableHouses,
    setSelectedCharacter,
    HOUSE_THEMES,
    THEMES,
  } = useTheme();

  const themeOptions = [
    {
      id: "light",
      name: "Light Theme",
      description: "Clean and bright interface perfect for daytime use",
      icon: Sun,
      preview: THEMES?.light || {
        primary: "#6366F1",
        secondary: "#8B5CF6",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        text: "#1F2937",
      },
    },
    {
      id: "dark",
      name: "Dark Theme",
      description: "Easy on the eyes for low-light environments",
      icon: Moon,
      preview: THEMES?.dark || {
        primary: "#8B5CF6",
        secondary: "#6366F1",
        background: "#111827",
        surface: "#1F2937",
        text: "#F9FAFB",
      },
    },
    {
      id: "house",
      name: "House Theme",
      description: selectedCharacter?.house
        ? `Experience the magic of ${selectedCharacter.house}`
        : "Select a character to unlock house-themed colors",
      icon: Home,
      preview:
        selectedCharacter?.house && HOUSE_THEMES?.[selectedCharacter.house]
          ? HOUSE_THEMES[selectedCharacter.house]
          : {
              primary: "#6B7280",
              secondary: "#9CA3AF",
              background: "#F3F4F6",
              surface: "#FFFFFF",
              text: "#1F2937",
            },
      disabled: !selectedCharacter?.house,
    },
  ];

  const handleThemeChange = (newTheme) => {
    setThemeMode(newTheme);
  };

  const handleHouseChange = (house) => {
    setSelectedCharacter({ ...selectedCharacter, house });
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: theme.background,
      minHeight: "100vh",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
      backgroundColor: theme.surface,
      borderRadius: "16px",
      padding: "32px",
      marginBottom: "32px",
      border: `2px solid ${theme.border}`,
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
      background: theme.gradient || theme.surface,
      position: "relative",
      overflow: "hidden",
    },
    headerContent: {
      position: "relative",
      zIndex: 2,
    },
    headerOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.1)",
      zIndex: 1,
    },
    headerIcon: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "16px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      color: theme.text,
      margin: 0,
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: "18px",
      margin: "8px 0 0 0",
      lineHeight: "1.5",
    },
    section: {
      backgroundColor: theme.surface,
      borderRadius: "16px",
      padding: "24px",
      marginBottom: "24px",
      border: `2px solid ${theme.border}`,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    themeGrid: {
      display: "grid",
      gap: "16px",
      marginBottom: "24px",
    },
    themeOption: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      padding: "24px",
      borderRadius: "16px",
      border: `2px solid ${theme.border}`,
      backgroundColor: theme.background,
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
    },
    themeOptionActive: {
      borderColor: theme.primary,
      backgroundColor: theme.surface,
      boxShadow: `0 0 0 4px ${theme.primary}20`,
      transform: "translateY(-2px)",
    },
    themeOptionDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
    themeOptionHover: {
      borderColor: `${theme.primary}60`,
      backgroundColor: theme.surface,
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    themeIcon: {
      width: "64px",
      height: "64px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
    },
    themeIconOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(255, 255, 255, 0.2)",
    },
    themeInfo: {
      flex: 1,
    },
    themeName: {
      fontSize: "20px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "6px",
      margin: "0 0 6px 0",
    },
    themeDescription: {
      fontSize: "14px",
      color: theme.textSecondary,
      lineHeight: "1.4",
      margin: 0,
    },
    colorPreview: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      marginRight: "16px",
    },
    colorSwatch: {
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      border: `2px solid ${theme.border}`,
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    selectionIndicator: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      border: `3px solid ${theme.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "all 0.2s ease",
    },
    selectionIndicatorActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    houseGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginTop: "16px",
    },
    houseCard: {
      padding: "20px",
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      backgroundColor: theme.background,
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    houseCardActive: {
      borderColor: theme.primary,
      backgroundColor: theme.surface,
      boxShadow: `0 0 0 2px ${theme.primary}20`,
    },
    houseCardHover: {
      borderColor: `${theme.primary}60`,
      backgroundColor: theme.surface,
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    houseName: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "12px",
      margin: "0 0 12px 0",
    },
    houseColors: {
      display: "flex",
      gap: "6px",
      justifyContent: "center",
      marginBottom: "12px",
    },
    houseColorSwatch: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      border: `1px solid ${theme.border}`,
    },
    housePreview: {
      fontSize: "12px",
      color: theme.textSecondary,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    currentSelection: {
      marginTop: "16px",
      padding: "16px",
      backgroundColor: theme.background,
      borderRadius: "12px",
      border: `1px solid ${theme.border}`,
    },
    currentSelectionTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
      margin: "0 0 8px 0",
    },
    currentSelectionContent: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    currentSelectionColors: {
      display: "flex",
      gap: "4px",
    },
    currentSelectionText: {
      fontSize: "14px",
      color: theme.textSecondary,
    },
    previewCard: {
      padding: "20px",
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      backgroundColor: theme.background,
      marginTop: "16px",
    },
    previewTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    previewDemo: {
      padding: "16px",
      borderRadius: "8px",
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
    },
    previewText: {
      color: theme.text,
      marginBottom: "8px",
      fontSize: "14px",
    },
    previewButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      backgroundColor: theme.primary,
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerOverlay} />
        <div style={styles.headerContent}>
          <div style={styles.headerIcon}>
            <Palette size={40} color={theme.text} />
            <div>
              <h1 style={styles.title}>Theme Settings</h1>
              <p style={styles.subtitle}>
                Customize your magical interface experience with beautiful
                themes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <Palette size={20} />
          Choose Your Theme
        </h2>

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
                    Object.assign(
                      e.currentTarget.style,
                      styles.themeOptionHover
                    );
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDisabled && !isActive) {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.backgroundColor = theme.background;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                <div
                  style={{
                    ...styles.themeIcon,
                    background:
                      option.preview.gradient ||
                      `linear-gradient(135deg, ${option.preview.primary}20 0%, ${option.preview.secondary}20 100%)`,
                  }}
                >
                  <div style={styles.themeIconOverlay} />
                  <Icon
                    size={28}
                    color={option.preview.primary}
                    style={{ position: "relative", zIndex: 2 }}
                  />
                </div>

                <div style={styles.themeInfo}>
                  <div style={styles.themeName}>{option.name}</div>
                  <div style={styles.themeDescription}>
                    {option.description}
                  </div>
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
                    ...styles.selectionIndicator,
                    ...(isActive ? styles.selectionIndicatorActive : {}),
                  }}
                >
                  {isActive && <Check size={14} color="white" />}
                </div>
              </div>
            );
          })}
        </div>
        {/* House Theme Selection */}
        {themeMode === "house" && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <Home size={20} />
              Choose Your House
            </h2>

            <div style={styles.houseGrid}>
              {availableHouses?.map((house) => {
                const houseTheme = HOUSE_THEMES?.[house] || {};
                const isActive = selectedCharacter?.house === house;

                return (
                  <div
                    key={house}
                    style={{
                      ...styles.houseCard,
                      ...(isActive ? styles.houseCardActive : {}),
                    }}
                    onClick={() => handleHouseChange(house)}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = `${theme.primary}60`;
                        e.currentTarget.style.backgroundColor = theme.surface;
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(0, 0, 0, 0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = theme.border;
                        e.currentTarget.style.backgroundColor =
                          theme.background;
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    <div style={styles.houseName}>{house}</div>
                    <div style={styles.houseColors}>
                      <div
                        style={{
                          ...styles.houseColorSwatch,
                          backgroundColor: houseTheme.primary || "#6B7280",
                        }}
                      />
                      <div
                        style={{
                          ...styles.houseColorSwatch,
                          backgroundColor: houseTheme.secondary || "#9CA3AF",
                        }}
                      />
                      <div
                        style={{
                          ...styles.houseColorSwatch,
                          backgroundColor: houseTheme.accent || "#D1D5DB",
                        }}
                      />
                    </div>
                    <div style={styles.housePreview}>
                      {isActive ? "Currently Active" : "Click to Apply"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current Selection Display */}
            {selectedCharacter?.house && (
              <div style={styles.currentSelection}>
                <div style={styles.currentSelectionTitle}>
                  Current House Theme
                </div>
                <div style={styles.currentSelectionContent}>
                  <div style={styles.currentSelectionColors}>
                    <div
                      style={{
                        ...styles.colorSwatch,
                        width: "24px",
                        height: "24px",
                        backgroundColor: theme.primary,
                      }}
                    />
                    <div
                      style={{
                        ...styles.colorSwatch,
                        width: "24px",
                        height: "24px",
                        backgroundColor: theme.secondary,
                      }}
                    />
                    <div
                      style={{
                        ...styles.colorSwatch,
                        width: "24px",
                        height: "24px",
                        backgroundColor: theme.background,
                      }}
                    />
                  </div>
                  <div style={styles.currentSelectionText}>
                    <strong>{selectedCharacter.house}</strong> theme is
                    currently active
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSettings;
