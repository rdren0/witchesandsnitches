import { useTheme } from "../../../contexts/ThemeContext";

export const StepIndicator = ({
  step,
  totalSteps = null,
  label = null,
  style = {},
  circleSize = 40,
  variant = "default",
}) => {
  const { theme } = useTheme();

  const getVariantColors = () => {
    switch (variant) {
      case "success":
        return {
          backgroundColor: theme.success,
          shadowColor: `${theme.success}30`,
        };
      case "warning":
        return {
          backgroundColor: theme.warning,
          shadowColor: `${theme.warning}30`,
        };
      case "error":
        return {
          backgroundColor: theme.error,
          shadowColor: `${theme.error}30`,
        };
      default:
        return {
          backgroundColor: theme.primary,
          shadowColor: `${theme.primary}30`,
        };
    }
  };

  const colors = getVariantColors();

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: `${circleSize}px`,
    display: "flex",
    alignItems: "center",
    margin: "20px 0",
    ...style,
  };

  const lineStyle = {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: "2px",
    backgroundColor: theme.border,
    transform: "translateY(-50%)",
  };

  const circleStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: `${circleSize}px`,
    height: `${circleSize}px`,
    borderRadius: "50%",
    backgroundColor: colors.backgroundColor,
    border: `3px solid ${theme.surface}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: `${Math.floor(circleSize * 0.4)}px`,
    fontWeight: "bold",
    color: theme.surface,
    boxShadow: `0 2px 8px ${colors.shadowColor}`,
    zIndex: 1,
  };

  const labelStyle = {
    position: "absolute",
    top: `${circleSize + 10}px`,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "14px",
    fontWeight: "500",
    color: theme.textSecondary,
    whiteSpace: "nowrap",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      {/* Horizontal line */}
      <div style={lineStyle} />

      {/* Step circle */}
      <div style={circleStyle}>
        {totalSteps ? `${step}/${totalSteps}` : step}
      </div>

      {/* Optional label */}
      {label && <div style={labelStyle}>{label}</div>}
    </div>
  );
};

export default StepIndicator;
