import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { createBaseStyles } from "../utils/styles";

const FormSection = ({
  title,
  subtitle,
  children,
  collapsible = false,
  isExpanded = true,
  onToggleExpansion,
  className = "",
  headerActions = null,
  id,
}) => {
  const { theme } = useTheme();
  const styles = createBaseStyles(theme);

  const handleToggleExpansion = () => {
    if (collapsible && onToggleExpansion) {
      onToggleExpansion();
    }
  };

  return (
    <div id={id} className={className} style={styles.section}>
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
        </div>
      </div>

      {(!collapsible || isExpanded) && (
        <div style={styles.sectionContent}>{children}</div>
      )}
    </div>
  );
};

export default FormSection;
