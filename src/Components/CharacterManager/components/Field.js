import React from "react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { createBaseStyles } from "../utils/styles";

const Field = ({
  label,
  children,
  required = false,
  error = null,
  helpText = null,
  className = "",
  labelProps = {},
  ...props
}) => {
  const { theme } = useTheme();
  const styles = createBaseStyles(theme);

  return (
    <div className={className} style={styles.fieldContainer} {...props}>
      {label && (
        <label style={styles.label} {...labelProps}>
          {label}
          {required && (
            <span style={{ color: theme.error, marginLeft: "4px" }}>*</span>
          )}
        </label>
      )}

      {children}

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "6px",
            color: theme.error,
            fontSize: "12px",
          }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {helpText && !error && (
        <div
          style={{
            marginTop: "6px",
            fontSize: "12px",
            color: theme.textSecondary,
            lineHeight: "1.4",
          }}
        >
          {helpText}
        </div>
      )}
    </div>
  );
};

export default Field;
