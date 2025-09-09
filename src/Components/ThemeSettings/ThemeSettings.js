import { useTheme } from "../../contexts/ThemeContext";
import {
  Sun,
  Moon,
  Home,
  Palette,
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useState } from "react";

const ThemeSettings = () => {
  const {
    themeMode,
    setThemeMode,
    theme,
    themeHouse,
    setThemeHouse,
    selectedColorblindType,
    setSelectedColorblindType,
    HOUSE_THEMES,
    THEMES,
    COLORBLIND_THEMES,
    SCHOOL_CATEGORIES,
  } = useTheme();

  const [expandedCategories, setExpandedCategories] = useState({
    "Hogwarts Houses": true,
    "Ilvermorny Houses": false,
    "International Schools": false,
  });

  const getColorblindDescription = (id) => {
    const descriptions = {
      "protanopia-light": "Red-blind friendly - light theme",
      "protanopia-dark": "Red-blind friendly - dark theme",
      "deuteranopia-light": "Green-blind friendly - light theme",
      "deuteranopia-dark": "Green-blind friendly - dark theme",
      "tritanopia-light": "Blue-blind friendly - light theme",
      "tritanopia-dark": "Blue-blind friendly - dark theme",
      "high-contrast-light": "Maximum contrast - light theme",
      "high-contrast-dark": "Maximum contrast - dark theme",
    };
    return descriptions[id] || "Accessibility theme";
  };

  const colorblindOptions = Object.entries(COLORBLIND_THEMES || {}).map(
    ([id, themeConfig]) => ({
      id,
      name: id
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      description: getColorblindDescription(id),
      colors: {
        primary: themeConfig.primary,
        secondary: themeConfig.secondary,
        background: themeConfig.background,
      },
    })
  );

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

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
      id: "colorblind",
      name: "Color Blind Friendly",
      description:
        "High contrast themes designed for color vision accessibility",
      icon: Eye,
      preview: THEMES?.light || {
        primary: "#1F2937",
        secondary: "#374151",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        text: "#111827",
      },
      disabled: false,
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
      name: "School Theme",
      description: themeHouse
        ? `Experience the magic of ${themeHouse}`
        : "Choose a magical school theme",
      icon: Home,
      preview: HOUSE_THEMES?.[themeHouse] || {
        primary: "#6B7280",
        secondary: "#9CA3AF",
        background: "#F3F4F6",
        surface: "#FFFFFF",
        text: "#1F2937",
      },
      disabled: false,
    },
  ];

  const handleThemeChange = (newTheme) => {
    setThemeMode(newTheme);
  };

  const handleSchoolChange = (school) => {
    setThemeHouse(school);
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
      color:
        theme.surface === theme.text
          ? theme.background === "#FFFFFF"
            ? "#000000"
            : "#FFFFFF"
          : theme.text,
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
      color: "inherit",
      margin: 0,
    },
    subtitle: {
      color: "inherit",
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
    categoryHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px",
      backgroundColor: theme.background,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      cursor: "pointer",
      marginBottom: "16px",
      transition: "all 0.2s ease",
    },
    categoryHeaderActive: {
      borderColor: theme.primary,
      backgroundColor: theme.surface,
    },
    categoryTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
      flex: 1,
    },
    categoryCount: {
      fontSize: "14px",
      color: theme.textSecondary,
      backgroundColor: theme.surface,
      padding: "4px 8px",
      borderRadius: "12px",
    },
    schoolGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "16px",
    },
    schoolCard: {
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
    schoolCardActive: {
      borderColor: theme.primary,
      backgroundColor: theme.surface,
      boxShadow: `0 0 0 2px ${theme.primary}20`,
    },
    schoolCardHover: {
      borderColor: `${theme.primary}60`,
      backgroundColor: theme.surface,
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    schoolName: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "12px",
      margin: "0 0 12px 0",
    },
    schoolColors: {
      display: "flex",
      gap: "6px",
      justifyContent: "center",
      marginBottom: "12px",
    },
    schoolColorSwatch: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      border: `1px solid ${theme.border}`,
    },
    schoolPreview: {
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

        {themeMode === "colorblind" && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <Eye size={20} />
              Choose Colorblind Accessibility Type
            </h2>

            <div style={styles.schoolGrid}>
              {colorblindOptions.map((option) => {
                const isActive = selectedColorblindType === option.id;

                return (
                  <div
                    key={option.id}
                    style={{
                      ...styles.schoolCard,
                      ...(isActive ? styles.schoolCardActive : {}),
                    }}
                    onClick={() => setSelectedColorblindType(option.id)}
                  >
                    <div style={styles.schoolName}>{option.name}</div>
                    <div style={styles.schoolColors}>
                      <div
                        style={{
                          ...styles.schoolColorSwatch,
                          backgroundColor: option.colors.primary,
                        }}
                      />
                      <div
                        style={{
                          ...styles.schoolColorSwatch,
                          backgroundColor: option.colors.secondary,
                        }}
                      />
                      <div
                        style={{
                          ...styles.schoolColorSwatch,
                          backgroundColor: option.colors.background,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        ...styles.schoolPreview,
                        fontSize: "11px",
                        lineHeight: "1.3",
                      }}
                    >
                      {option.description}
                    </div>
                    <div style={{ ...styles.schoolPreview, marginTop: "8px" }}>
                      {isActive ? "Currently Active" : "Click to Apply"}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedColorblindType && themeMode === "colorblind" && (
              <div style={styles.currentSelection}>
                <div style={styles.currentSelectionTitle}>
                  Current Accessibility Theme
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
                    <strong>
                      {selectedColorblindType
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </strong>{" "}
                    accessibility theme is currently active
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {themeMode === "house" && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <Home size={20} />
              Choose Your School
            </h2>

            {SCHOOL_CATEGORIES &&
              Object.entries(SCHOOL_CATEGORIES).map(
                ([categoryName, schools]) => (
                  <div key={categoryName}>
                    <div
                      style={{
                        ...styles.categoryHeader,
                        ...(expandedCategories[categoryName]
                          ? styles.categoryHeaderActive
                          : {}),
                      }}
                      onClick={() => toggleCategory(categoryName)}
                    >
                      <div style={styles.categoryTitle}>{categoryName}</div>
                      <div style={styles.categoryCount}>
                        {schools.length} school{schools.length !== 1 ? "s" : ""}
                      </div>
                      {expandedCategories[categoryName] ? (
                        <ChevronDown size={20} color={theme.primary} />
                      ) : (
                        <ChevronRight size={20} color={theme.textSecondary} />
                      )}
                    </div>

                    {expandedCategories[categoryName] && (
                      <div style={styles.schoolGrid}>
                        {schools.map((school) => {
                          const schoolTheme = HOUSE_THEMES?.[school] || {};
                          const isActive = themeHouse === school;

                          return (
                            <div
                              key={school}
                              style={{
                                ...styles.schoolCard,
                                ...(isActive ? styles.schoolCardActive : {}),
                              }}
                              onClick={() => handleSchoolChange(school)}
                            >
                              <div style={styles.schoolName}>{school}</div>
                              <div style={styles.schoolColors}>
                                <div
                                  style={{
                                    ...styles.schoolColorSwatch,
                                    backgroundColor:
                                      schoolTheme.primary || "#6B7280",
                                  }}
                                />
                                <div
                                  style={{
                                    ...styles.schoolColorSwatch,
                                    backgroundColor:
                                      schoolTheme.secondary || "#9CA3AF",
                                  }}
                                />
                                <div
                                  style={{
                                    ...styles.schoolColorSwatch,
                                    backgroundColor:
                                      schoolTheme.accent || "#D1D5DB",
                                  }}
                                />
                              </div>
                              <div style={styles.schoolPreview}>
                                {isActive
                                  ? "Currently Active"
                                  : "Click to Apply"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )
              )}

            {themeHouse && themeMode === "house" && (
              <div style={styles.currentSelection}>
                <div style={styles.currentSelectionTitle}>
                  Current School Theme
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
                    <strong>{themeHouse}</strong> theme is currently active
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
