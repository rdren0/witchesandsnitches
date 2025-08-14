import React from "react";
import { Lock, Unlock, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { createBaseStyles } from "../utils/styles";

const FormSection = ({
  title,
  subtitle,
  children,
  isLocked = false,
  onToggleLock,
  lockable = true,
  collapsible = false,
  isExpanded = true,
  onToggleExpansion,
  className = "",
  headerActions = null,
}) => {
  const { theme } = useTheme();
  const styles = createBaseStyles(theme);

  const handleToggleLock = () => {
    if (lockable && onToggleLock) {
      onToggleLock();
    }
  };

  const handleToggleExpansion = () => {
    if (collapsible && onToggleExpansion) {
      onToggleExpansion();
    }
  };

  return (
    <div
      className={className}
      style={{
        ...styles.section,
        opacity: isLocked ? 0.7 : 1,
      }}
    >
      <div style={styles.sectionHeader}>
        <div style={{ flex: 1 }}>
          <h3 style={styles.sectionTitle}>{title}</h3>
          {subtitle && <p style={styles.sectionSubtitle}>{subtitle}</p>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {headerActions}

          {collapsible && (
            <button
              onClick={handleToggleExpansion}
              style={{
                ...styles.button,
                ...styles.buttonSecondary,
                ...styles.buttonSmall,
              }}
              title={isExpanded ? "Collapse section" : "Expand section"}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}

          {lockable && (
            <button
              onClick={handleToggleLock}
              style={{
                ...styles.button,
                ...styles.buttonSecondary,
                ...styles.buttonSmall,
                backgroundColor: isLocked ? theme.error : theme.success,
                color: theme.surface,
                border: "none",
              }}
              title={isLocked ? "Unlock section for editing" : "Lock section"}
            >
              {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
              {isLocked ? "Locked" : "Unlocked"}
            </button>
          )}
        </div>
      </div>

      {(!collapsible || isExpanded) && (
        <div
          style={{
            ...styles.sectionContent,
            opacity: isLocked ? 0.5 : 1,
            pointerEvents: isLocked ? "none" : "auto",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default FormSection;
