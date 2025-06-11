import { useTheme } from "../contexts/ThemeContext";

export const useThemedStyles = () => {
  const { theme } = useTheme();

  return {
    appContainer: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: theme.background,
      color: theme.text,
      minHeight: "100vh",
      transition: "background-color 0.3s ease, color 0.3s ease",
    },
    appHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem",
      backgroundColor: theme.headerBackground,
      borderBottom: `1px solid ${theme.border}`,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    tabNavigation: {
      display: "flex",
      gap: "0.5rem",
    },
    tabButton: {
      padding: "0.5rem 1rem",
      border: `1px solid ${theme.border}`,
      borderRadius: "0.25rem",
      backgroundColor: theme.surface,
      color: theme.text,
      cursor: "pointer",
      transition: "all 0.2s",
      fontWeight: "500",
    },
    tabButtonActive: {
      backgroundColor: theme.primary,
      color: theme.surface,
      borderColor: theme.primary,
    },
    tabButtonHover: {
      backgroundColor: theme.background,
      borderColor: theme.primary,
    },
    authSection: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      position: "relative",
    },
    userAvatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      border: `2px solid ${theme.primary}`,
    },
    username: {
      fontWeight: "500",
      color: theme.text,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    editButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "2px",
      borderRadius: "3px",
      color: theme.textSecondary,
      transition: "color 0.2s",
    },
    editButtonHover: {
      color: theme.primary,
      backgroundColor: theme.background,
    },
    usernameEditor: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    usernameInput: {
      padding: "4px 8px",
      border: `1px solid ${theme.border}`,
      borderRadius: "4px",
      fontSize: "14px",
      width: "120px",
      backgroundColor: theme.surface,
      color: theme.text,
    },
    saveButton: {
      background: theme.success,
      color: "white",
      border: "none",
      borderRadius: "3px",
      padding: "4px 6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    },
    cancelButton: {
      background: theme.error,
      color: "white",
      border: "none",
      borderRadius: "3px",
      padding: "4px 6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    },
    authButton: {
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "0.25rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s",
      minWidth: "80px",
    },
    authButtonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
    signinButton: {
      backgroundColor: "#5865f2",
      color: "white",
    },
    signinButtonHover: {
      backgroundColor: "#4752c4",
    },
    signoutButton: {
      backgroundColor: theme.error,
      color: "white",
    },
    signoutButtonHover: {
      backgroundColor: "#c82333",
    },
    authRequired: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      textAlign: "center",
      minHeight: "300px",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      margin: "20px",
    },
    authRequiredH2: {
      color: theme.text,
      marginBottom: "1rem",
    },
    authRequiredP: {
      color: theme.textSecondary,
    },
    loadingSpinner: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "1.2rem",
      color: theme.textSecondary,
      backgroundColor: theme.background,
    },
    tabContent: {
      flex: 1,
      backgroundColor: theme.background,
    },
    homePage: {
      padding: "2rem",
      backgroundColor: theme.background,
    },
    heroSection: {
      textAlign: "center",
      marginBottom: "3rem",
      color: theme.text,
    },
    featureGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem",
    },
    featureCard: {
      padding: "1.5rem",
      border: `1px solid ${theme.border}`,
      borderRadius: "0.5rem",
      backgroundColor: theme.cardBackground,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      color: theme.text,
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
    },
    featureCardHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      borderColor: theme.primary,
    },
    cardButton: {
      marginTop: "1rem",
      padding: "0.75rem 1rem",
      backgroundColor: theme.primary,
      color: theme.surface,
      borderRadius: "0.25rem",
      textAlign: "center",
      fontWeight: "500",
      fontSize: "14px",
      transition: "background-color 0.2s",
      border: "none",
      cursor: "pointer",
      width: "100%",
    },
    errorMessage: {
      color: theme.error,
      fontSize: "12px",
      marginTop: "4px",
    },
    discordName: {
      fontSize: "12px",
      color: theme.textSecondary,
      fontStyle: "italic",
    },
    themeButton: {
      padding: "0.5rem",
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "0.25rem",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    themeButtonHover: {
      backgroundColor: theme.background,
      borderColor: theme.primary,
    },
  };
};

export const createThemedStyles = (theme) => ({
  characterSheet: {
    container: {
      maxWidth: "1024px",
      margin: "0 auto",
      padding: "1.5rem",
      background:
        theme.gradient ||
        `linear-gradient(to bottom right, ${theme.background}, ${theme.surface})`,
      minHeight: "100vh",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    headerCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: "0.5rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      marginBottom: "1.5rem",
      padding: "1.5rem",
      border: `2px solid ${theme.primary}20`,
    },
    characterName: {
      fontSize: "1.875rem",
      fontWeight: "bold",
      color: theme.text,
      marginBottom: "0.5rem",
    },
    infoItem: {
      color: theme.text,
    },
    label: {
      fontWeight: "600",
      color: theme.textSecondary,
    },
  },

  spellBook: {
    subjectCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: "1rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: `1px solid ${theme.border}`,
      overflow: "hidden",
      transition: "all 0.2s ease",
    },
    subjectTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      margin: 0,
      color: theme.text,
    },
    subjectDescription: {
      fontSize: "0.875rem",
      color: theme.textSecondary,
      marginBottom: "1rem",
    },
    table: {
      width: "100%",
      backgroundColor: theme.surface,
      borderRadius: "0.5rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: `1px solid ${theme.border}`,
      marginTop: "0.5rem",
      overflow: "hidden",
    },
    tableHeader: {
      backgroundColor: theme.background,
    },
    tableHeaderCell: {
      padding: "0.75rem 1rem",
      textAlign: "left",
      fontSize: "0.75rem",
      fontWeight: "500",
      color: theme.textSecondary,
      textTransform: "uppercase",
      borderBottom: `1px solid ${theme.border}`,
    },
  },

  characterCreation: {
    container: {
      padding: "20px",
      maxWidth: "1200px",
      margin: "0 auto",
      backgroundColor: theme.background,
    },
    panel: {
      backgroundColor: theme.surface,
      padding: "25px",
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    title: {
      margin: 0,
      fontSize: "2.5rem",
      color: theme.text,
      textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: `2px solid ${theme.border}`,
      fontSize: "16px",
      backgroundColor: theme.surface,
      color: theme.text,
    },
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: `2px solid ${theme.border}`,
      fontSize: "16px",
      backgroundColor: theme.surface,
      color: theme.text,
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "5px",
      color: theme.text,
    },
  },
});

export default useThemedStyles;
