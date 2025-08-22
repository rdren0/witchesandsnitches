export const createBaseStyles = (theme) => ({
  // Section styles
  section: {
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
    marginBottom: "20px",
    overflow: "hidden",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    backgroundColor: theme.background,
    borderBottom: `1px solid ${theme.border}`,
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: theme.text,
    margin: 0,
  },

  sectionSubtitle: {
    fontSize: "14px",
    color: theme.textSecondary,
    margin: "4px 0 0 0",
  },

  sectionContent: {
    padding: "20px",
  },

  // Button styles
  button: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  buttonPrimary: {
    backgroundColor: theme.primary,
    color: theme.text,
  },

  buttonSecondary: {
    backgroundColor: theme.surface,
    color: theme.text,
    border: `1px solid ${theme.border}`,
  },

  buttonSmall: {
    padding: "6px 12px",
    fontSize: "12px",
  },

  // Form styles
  fieldContainer: {
    marginBottom: "16px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: theme.text,
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${theme.border}`,
    borderRadius: "6px",
    backgroundColor: theme.surface,
    color: theme.text,
    fontSize: "14px",
  },

  // Selection styles
  optionGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  option: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "12px",
    border: `1px solid ${theme.border}`,
    borderRadius: "6px",
    backgroundColor: theme.surface,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  optionSelected: {
    backgroundColor: `${theme.primary}15`,
    borderColor: theme.primary,
  },

  optionDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});
