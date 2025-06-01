// src/utils/themeHelpers.js
import { useTheme } from "../contexts/ThemeContext";

// Hook to create component-specific themed styles
export const useComponentTheme = (componentName, baseStyles = {}) => {
  const { theme } = useTheme();

  // Common style transformations
  const applyTheme = (styles) => {
    const themedStyles = {};

    Object.keys(styles).forEach((key) => {
      const style = styles[key];
      if (typeof style === "object" && style !== null) {
        themedStyles[key] = {
          ...style,
          // Auto-replace common color properties
          ...(style.backgroundColor === "#f8f9fa" && {
            backgroundColor: theme.surface,
          }),
          ...(style.backgroundColor === "#fff" && {
            backgroundColor: theme.cardBackground,
          }),
          ...(style.backgroundColor === "#ffffff" && {
            backgroundColor: theme.cardBackground,
          }),
          ...(style.color === "#495057" && { color: theme.text }),
          ...(style.color === "#6c757d" && { color: theme.textSecondary }),
          ...(style.borderColor === "#dee2e6" && { borderColor: theme.border }),
          ...(style.borderColor === "#e5e7eb" && { borderColor: theme.border }),
          // Add more automatic replacements as needed
        };
      } else {
        themedStyles[key] = style;
      }
    });

    return themedStyles;
  };

  return {
    theme,
    styles: applyTheme(baseStyles),
    // Helper functions
    getCardStyle: (additionalStyles = {}) => ({
      backgroundColor: theme.cardBackground,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      ...additionalStyles,
    }),
    getButtonStyle: (variant = "primary", additionalStyles = {}) => {
      const variants = {
        primary: {
          backgroundColor: theme.primary,
          color: theme.surface,
          border: `1px solid ${theme.primary}`,
        },
        secondary: {
          backgroundColor: theme.surface,
          color: theme.primary,
          border: `1px solid ${theme.primary}`,
        },
        danger: {
          backgroundColor: theme.error,
          color: theme.surface,
          border: `1px solid ${theme.error}`,
        },
        success: {
          backgroundColor: theme.success,
          color: theme.surface,
          border: `1px solid ${theme.success}`,
        },
      };

      return {
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.2s ease",
        ...variants[variant],
        ...additionalStyles,
      };
    },
    getInputStyle: (additionalStyles = {}) => ({
      padding: "8px 12px",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      backgroundColor: theme.surface,
      color: theme.text,
      fontSize: "14px",
      ...additionalStyles,
    }),
    getTextStyle: (variant = "body", additionalStyles = {}) => {
      const variants = {
        heading: {
          color: theme.text,
          fontWeight: "600",
          fontSize: "18px",
        },
        body: {
          color: theme.text,
          fontSize: "14px",
        },
        caption: {
          color: theme.textSecondary,
          fontSize: "12px",
        },
        error: {
          color: theme.error,
          fontSize: "12px",
        },
      };

      return {
        ...variants[variant],
        ...additionalStyles,
      };
    },
  };
};

// Hook for handling hover effects with theme
export const useHoverEffect = (baseStyle, hoverStyle) => {
  const handleMouseEnter = (e) => {
    Object.assign(e.target.style, {
      ...hoverStyle,
      transition: "all 0.2s ease",
    });
  };

  const handleMouseLeave = (e) => {
    Object.assign(e.target.style, baseStyle);
  };

  return { handleMouseEnter, handleMouseLeave };
};

// Theme-aware CSS class generator (for when you need to use CSS classes)
export const generateThemeClasses = (theme) => {
  const style = document.createElement("style");
  style.textContent = `
    .theme-card {
      background-color: ${theme.cardBackground};
      border: 1px solid ${theme.border};
      color: ${theme.text};
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .theme-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      border-color: ${theme.primary};
    }

    .theme-button-primary {
      background-color: ${theme.primary};
      color: ${theme.surface};
      border: 1px solid ${theme.primary};
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .theme-button-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .theme-input {
      background-color: ${theme.surface};
      border: 1px solid ${theme.border};
      color: ${theme.text};
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
    }

    .theme-input:focus {
      border-color: ${theme.primary};
      outline: 0;
      box-shadow: 0 0 0 2px ${theme.primary}20;
    }

    .theme-text {
      color: ${theme.text};
    }

    .theme-text-secondary {
      color: ${theme.textSecondary};
    }

    .theme-background {
      background-color: ${theme.background};
    }

    .theme-surface {
      background-color: ${theme.surface};
    }

    .theme-border {
      border-color: ${theme.border};
    }
  `;

  // Remove existing theme styles
  const existingStyle = document.getElementById("theme-styles");
  if (existingStyle) {
    existingStyle.remove();
  }

  style.id = "theme-styles";
  document.head.appendChild(style);
};

// Utility to migrate old styles to themed styles
export const migrateStylesToTheme = (oldStyles, theme) => {
  const styleMap = {
    // Common background colors
    "#ffffff": theme.cardBackground,
    "#fff": theme.cardBackground,
    "#f8f9fa": theme.surface,
    "#f9fafb": theme.background,

    // Common text colors
    "#000000": theme.text,
    "#000": theme.text,
    "#333333": theme.text,
    "#333": theme.text,
    "#495057": theme.text,
    "#6c757d": theme.textSecondary,
    "#6b7280": theme.textSecondary,

    // Common border colors
    "#dee2e6": theme.border,
    "#e5e7eb": theme.border,
    "#d1d5db": theme.border,

    // Common accent colors
    "#007bff": theme.primary,
    "#6366f1": theme.primary,
  };

  const migrateValue = (value) => {
    if (typeof value === "string" && styleMap[value.toLowerCase()]) {
      return styleMap[value.toLowerCase()];
    }
    return value;
  };

  const migrateObject = (obj) => {
    const migrated = {};
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (typeof value === "object" && value !== null) {
        migrated[key] = migrateObject(value);
      } else {
        migrated[key] = migrateValue(value);
      }
    });
    return migrated;
  };

  return migrateObject(oldStyles);
};

export default useComponentTheme;
