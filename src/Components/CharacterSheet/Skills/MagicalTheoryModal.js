import React from "react";
import { BookOpen, Sparkles, X } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

export const MagicalTheoryModal = ({
  isOpen,
  onClose,
  onConfirm,
  character,
}) => {
  const theme = useTheme();

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRegularCheck = () => {
    onConfirm(false);
  };

  const handleBonusDiceCheck = () => {
    onConfirm(true);
  };

  const withOpacity = (color, opacity) => {
    if (!color) return "transparent";
    if (color.startsWith("#")) {
      const hex = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0");
      return `${color}${hex}`;
    }

    if (color.startsWith("rgba")) {
      return color.replace(/[\d.]+\)/, `${opacity})`);
    }
    if (color.startsWith("rgb")) {
      return color.replace("rgb", "rgba").replace(")", `, ${opacity})`);
    }
    return color;
  };

  const getPrimaryColor = () => theme.primary || "#8b5cf6";
  const getWarningColor = () => theme.warning || "#f59e0b";
  const getCardBackground = () => theme.card || "#ffffff";
  const getTextColor = () => theme.text || "#1f2937";
  const getTextSecondaryColor = () => theme.textSecondary || "#6b7280";
  const getBackgroundColor = () => theme.background || "#f9fafb";
  const getBorderColor = () => theme.border || "#e5e7eb";
  const getHoverColor = () => theme.hover || "#f3f4f6";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: getCardBackground(),
          border: `2px solid ${getPrimaryColor()}`,
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          animation: "slideUp 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <BookOpen
              size={28}
              style={{
                color: getPrimaryColor(),
              }}
            />
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "700",
                color: getTextColor(),
              }}
            >
              Magical Theory Check
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: getTextSecondaryColor(),
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = getHoverColor();
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              color: getTextColor(),
              marginBottom: "20px",
              lineHeight: "1.6",
            }}
          >
            How would you like to use your Magical Theory knowledge?
          </p>

          <div
            style={{
              padding: "16px",
              backgroundColor: withOpacity(getWarningColor(), 0.08),
              border: `2px solid ${withOpacity(getWarningColor(), 0.3)}`,
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <Sparkles
                size={24}
                style={{
                  color: getWarningColor(),
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />
              <div>
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: getTextColor(),
                  }}
                >
                  Roll for Spell Bonus Dice
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: getTextSecondaryColor(),
                    lineHeight: "1.5",
                  }}
                >
                  Test your theoretical knowledge to earn bonus dice for future
                  spell attempts!
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "8px",
                    marginTop: "12px",
                    fontSize: "13px",
                    color: getTextSecondaryColor(),
                  }}
                >
                  <div>
                    • <strong>DC 10:</strong> Earn 1d4
                  </div>
                  <div>
                    • <strong>DC 15:</strong> Earn 1d6
                  </div>
                  <div>
                    • <strong>DC 20:</strong> Earn 1d8
                  </div>
                  <div>
                    • <strong>NAT 20:</strong> Earn 1d10
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              backgroundColor: getBackgroundColor(),
              border: `2px solid ${getBorderColor()}`,
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <BookOpen
                size={24}
                style={{
                  color: getPrimaryColor(),
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />
              <div>
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: getTextColor(),
                  }}
                >
                  Regular Skill Check
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: getTextSecondaryColor(),
                    lineHeight: "1.5",
                  }}
                >
                  Perform a standard Magical Theory skill check for knowledge or
                  investigation purposes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleRegularCheck}
            style={{
              padding: "10px 20px",
              backgroundColor: getBackgroundColor(),
              color: getTextColor(),
              border: `1px solid ${getBorderColor()}`,
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              minWidth: "120px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = getHoverColor();
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = getBackgroundColor();
            }}
          >
            Regular Check
          </button>
          <button
            onClick={handleBonusDiceCheck}
            style={{
              padding: "10px 20px",
              backgroundColor: getWarningColor(),
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              minWidth: "140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            }}
          >
            <Sparkles size={16} />
            Roll for Bonus Dice
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
