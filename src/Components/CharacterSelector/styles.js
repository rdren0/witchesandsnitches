export const createCharacterSelectorStyles = (theme) => {
  const safeTheme = theme || {
    surface: "#ffffff",
    background: "#f8fafc",
    text: "#1f2937",
    textSecondary: "#6b7280",
    primary: "#6366f1",
    secondary: "#8b5cf6",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    border: "#e5e7eb",
  };

  return {
    container: {
      padding: "20px",
      backgroundColor: safeTheme.surface,
      borderBottom: `2px solid ${safeTheme.border}`,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    innerContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: "20px",
      width: "100%",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    selectorRow: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      flexWrap: "wrap",
    },
    label: {
      fontSize: "16px",
      fontWeight: "600",
      color: safeTheme.text,
    },
    select: {
      padding: "8px 12px",
      fontSize: "16px",
      border: `2px solid ${safeTheme.border}`,
      borderRadius: "8px",
      backgroundColor: safeTheme.surface,
      color: safeTheme.text,
      minWidth: "200px",
    },
    singleCharacterDisplay: {
      padding: "8px 12px",
      fontSize: "16px",
      backgroundColor: safeTheme.primary + "20",
      border: `2px solid ${safeTheme.primary}`,
      borderRadius: "8px",
      color: safeTheme.text,
      fontWeight: "500",
      minWidth: "200px",
      textAlign: "center",
    },
    noCharactersDisplay: {
      padding: "8px 12px",
      fontSize: "16px",
      border: `2px solid ${safeTheme.border}`,
      borderRadius: "8px",
      backgroundColor: safeTheme.background,
      color: safeTheme.textSecondary,
      minWidth: "200px",
      textAlign: "center",
    },
    warningMessage: {
      backgroundColor: (safeTheme.warning || "#F59E0B") + "20",
      color: safeTheme.warning || "#F59E0B",
      border: `1px solid ${safeTheme.warning || "#F59E0B"}`,
      padding: "12px 20px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "500",
      textAlign: "center",
    },
    errorMessage: {
      backgroundColor: (safeTheme.error || "#EF4444") + "20",
      border: `1px solid ${safeTheme.error || "#EF4444"}`,
      color: safeTheme.error || "#EF4444",
      padding: "12px",
      borderRadius: "8px",
      margin: "16px 0",
      fontSize: "14px",

      marginLeft: "auto",
      marginRight: "auto",
      textAlign: "center",
    },
  };
};

export const getCharacterSelectorStyles = (theme) =>
  createCharacterSelectorStyles(theme);
