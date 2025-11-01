import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const Tooltip = ({ children, content, delay = 200, position = "top" }) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const showTooltip = (e) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const target = e.target || e.currentTarget || triggerRef.current;
    if (!target) return;

    timeoutRef.current = setTimeout(() => {
      try {
        const rect = target.getBoundingClientRect();
        setCoords({
          x: rect.left + rect.width / 2,
          y: rect.top,
          bottom: rect.bottom,
          width: rect.width,
        });
        setIsVisible(true);
      } catch (error) {
        console.error("Error showing tooltip:", error);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getTooltipStyle = () => {
    const baseStyle = {
      position: "fixed",
      backgroundColor: theme.surface,
      color: theme.text,
      padding: "8px 12px",
      borderRadius: "6px",
      fontSize: "13px",
      lineHeight: "1.4",
      zIndex: 999999,
      pointerEvents: "none",
      maxWidth: "300px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      border: `1px solid ${theme.border}`,
      whiteSpace: "normal",
      wordWrap: "break-word",
    };

    const tooltipWidth = 300;
    const centerX = coords.x;
    const halfWidth = tooltipWidth / 2;

    let tooltipX = centerX;
    let transform = "translateX(-50%)";

    if (centerX - halfWidth < 10) {
      tooltipX = 10;
      transform = "none";
    } else if (centerX + halfWidth > window.innerWidth - 10) {
      tooltipX = window.innerWidth - 10;
      transform = "translateX(-100%)";
    }

    if (position === "top") {
      return {
        ...baseStyle,
        left: `${tooltipX}px`,
        bottom: `${window.innerHeight - coords.y + 8}px`,
        transform: transform,
      };
    } else if (position === "bottom") {
      return {
        ...baseStyle,
        left: `${tooltipX}px`,
        top: `${coords.bottom + 8}px`,
        transform: transform,
      };
    } else if (position === "left") {
      return {
        ...baseStyle,
        right: `${window.innerWidth - coords.x + 8}px`,
        top: `${coords.y}px`,
      };
    } else if (position === "right") {
      return {
        ...baseStyle,
        left: `${coords.x + coords.width + 8}px`,
        top: `${coords.y}px`,
      };
    }

    return baseStyle;
  };

  const renderContent = () => {
    if (typeof content === "string") {
      return content;
    }

    if (content && typeof content === "object") {
      return (
        <div>
          {content.title && (
            <div
              style={{
                fontWeight: "600",
                marginBottom:
                  content.leftClick || content.rightClick ? "6px" : "0",
                fontSize: "14px",
              }}
            >
              {content.title}
            </div>
          )}
          {content.description && (
            <div style={{ marginBottom: "6px", color: theme.textSecondary }}>
              {content.description}
            </div>
          )}
          {content.leftClick && (
            <div style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
              <span
                style={{
                  fontWeight: "600",
                  color: theme.primary,
                  minWidth: "70px",
                }}
              >
                Left Click:
              </span>
              <span>{content.leftClick}</span>
            </div>
          )}
          {content.rightClick && (
            <div style={{ display: "flex", gap: "6px" }}>
              <span
                style={{
                  fontWeight: "600",
                  color: theme.primary,
                  minWidth: "70px",
                }}
              >
                Right Click:
              </span>
              <span>{content.rightClick}</span>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{
          display: "contents",
        }}
      >
        {children}
      </div>
      {isVisible && content && (
        <div ref={tooltipRef} style={getTooltipStyle()}>
          {renderContent()}
        </div>
      )}
    </>
  );
};

export default Tooltip;
