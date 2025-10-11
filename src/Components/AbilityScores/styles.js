export const createAbilityScoresStyles = (theme) => ({
  savingThrowButton: {
    padding: "4px 8px",
    fontSize: "10px",
    fontWeight: "500",
    minHeight: "30px",
    border: `2px solid ${theme.primary}`,
    borderRadius: "4px",
    backgroundColor: theme.surface,
    color: theme.text,
    transition: "all 0.2s ease-in-out",
  },
  savingThrowButtonHover: {
    backgroundColor: theme.background,
    borderColor: theme.border,
    boxShadow: theme.background + "20",
  },
  abilityCard: {
    backgroundColor: theme.surface,
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "24px",
    padding: "12px",
    border: `2px solid ${theme.border}`,
  },
  abilityTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: theme.text,
    paddingBottom: "16px",
    textAlign: "center",
  },
  abilityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "12px",
  },
  abilityItem: {
    backgroundColor: theme.background,
    border: `2px solid ${theme.border}`,
    borderRadius: "8px",
    padding: "12px",
    textAlign: "center",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  abilityName: {
    fontSize: "14px",
    fontWeight: "700",
    color: theme.textSecondary,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  abilityModifier: {
    fontSize: "20px",
    fontWeight: "bold",
    color: theme.primary,
  },
  abilityScore: {
    fontSize: "28px",
    fontWeight: "bold",
    color: theme.text,
  },
});

// Helper function for backward compatibility
export const getAbilityScoresStyles = (theme) => createAbilityScoresStyles(theme);