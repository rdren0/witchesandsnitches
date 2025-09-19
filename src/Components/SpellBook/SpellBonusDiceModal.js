import React, { useState, useEffect } from "react";
import { Sparkles, X, Dice6 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export const SpellBonusDiceModal = ({
  isOpen,
  onClose,
  onConfirm,
  availableDice,
  spellName,
  originalRoll,
  originalModifier,
  originalTotal,
  targetDC,
}) => {
  const theme = useTheme();

  const availableDiceArray = React.useMemo(() => {
    if (!availableDice) return [];
    if (Array.isArray(availableDice)) return availableDice;
    if (typeof availableDice === "string") return [availableDice];
    return [];
  }, [availableDice]);

  const [selectedDie, setSelectedDie] = useState(
    availableDiceArray.length > 0 ? availableDiceArray[0] : null
  );

  useEffect(() => {
    if (availableDiceArray.length > 0 && !selectedDie) {
      setSelectedDie(availableDiceArray[0]);
    }
  }, [availableDiceArray, selectedDie]);

  if (!isOpen || !availableDice || availableDiceArray.length === 0) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleUseDice = () => {
    if (selectedDie) {
      onConfirm(selectedDie);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const parseDiceType = (diceString) => {
    if (!diceString) return null;
    const match = diceString.match(/1d(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  const getPrimaryColor = () => theme.primary || "#8b5cf6";
  const getWarningColor = () => theme.warning || "#f59e0b";
  const getDangerColor = () => theme.danger || "#ef4444";
  const getCardBackground = () => theme.card || "#ffffff";
  const getTextColor = () => theme.text || "#1f2937";
  const getTextSecondaryColor = () => theme.textSecondary || "#6b7280";
  const getBackgroundColor = () => theme.background || "#f9fafb";
  const getBorderColor = () => theme.border || "#e5e7eb";
  const getHoverColor = () => theme.hover || "#f3f4f6";

  const getDiceColor = (die) => {
    const dieType = parseDiceType(die);
    if (dieType === 4) return "#10b981";
    if (dieType === 6) return "#3b82f6";
    if (dieType === 8) return "#8b5cf6";
    if (dieType === 10) return "#f59e0b";
    return "#6b7280";
  };

  const deficit = targetDC - originalTotal;

  const diceCount = availableDiceArray.reduce((acc, die) => {
    acc[die] = (acc[die] || 0) + 1;
    return acc;
  }, {});

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
        zIndex: 9999,
        padding: "20px",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: getCardBackground(),
          border: `2px solid ${getWarningColor()}`,
          borderRadius: "12px",
          padding: "24px",
          maxWidth: availableDiceArray.length > 2 ? "600px" : "500px",
          width: "100%",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
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
            <Sparkles
              size={28}
              style={{
                color: getWarningColor(),
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
              Use Spell Bonus Dice?
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
            padding: "16px",
            backgroundColor: `${getDangerColor()}10`,
            border: `2px solid ${getDangerColor()}30`,
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: getTextColor(),
              marginBottom: "8px",
            }}
          >
            Spell Failed: {spellName}
          </div>
          <div style={{ fontSize: "14px", color: getTextSecondaryColor() }}>
            <div>
              Your Roll: {originalRoll} + {originalModifier} ={" "}
              <strong>{originalTotal}</strong>
            </div>
            <div>
              Target DC: <strong>{targetDC}</strong>
            </div>
            <div style={{ marginTop: "4px", color: getDangerColor() }}>
              You need {deficit} more to succeed!
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              fontSize: "14px",
              color: getTextSecondaryColor(),
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            You have {availableDiceArray.length} Magical Theory bonus{" "}
            {availableDiceArray.length === 1 ? "die" : "dice"} available.
            {availableDiceArray.length > 1 && " Choose one to use:"}
          </p>

          {availableDiceArray.length > 2 && (
            <div
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: getTextSecondaryColor(),
                marginBottom: "12px",
              }}
            >
              {Object.entries(diceCount)
                .map(([die, count]) => `${count}× ${die}`)
                .join(", ")}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            {Object.entries(diceCount).map(([die, count]) => (
              <div
                key={die}
                onClick={() => setSelectedDie(die)}
                style={{
                  padding: "16px",
                  backgroundColor:
                    selectedDie === die
                      ? `${getDiceColor(die)}20`
                      : getBackgroundColor(),
                  border: `2px solid ${
                    selectedDie === die ? getDiceColor(die) : getBorderColor()
                  }`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  minWidth: "100px",
                  maxWidth: "150px",
                  flex: "1 1 auto",
                }}
                onMouseEnter={(e) => {
                  if (selectedDie !== die) {
                    e.currentTarget.style.borderColor = getDiceColor(die);
                    e.currentTarget.style.backgroundColor = `${getDiceColor(
                      die
                    )}10`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDie !== die) {
                    e.currentTarget.style.borderColor = getBorderColor();
                    e.currentTarget.style.backgroundColor =
                      getBackgroundColor();
                  }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Dice6
                    size={32}
                    style={{
                      color: getDiceColor(die),
                    }}
                  />
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: getDiceColor(die),
                    }}
                  >
                    {die}
                  </div>
                  {count > 1 && (
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: getTextSecondaryColor(),
                        backgroundColor: getBackgroundColor(),
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      ×{count} available
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "12px",
                      color: getTextSecondaryColor(),
                    }}
                  >
                    Max: +{parseDiceType(die)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedDie && (
            <div
              style={{
                padding: "12px",
                backgroundColor: getBackgroundColor(),
                borderRadius: "8px",
                fontSize: "13px",
                color: getTextSecondaryColor(),
                textAlign: "center",
              }}
            >
              {deficit <= parseDiceType(selectedDie)
                ? `Rolling ${deficit} or higher on ${selectedDie} will succeed!`
                : `Even a max roll won't be enough, but it will get you closer!`}
            </div>
          )}
        </div>

        <div
          style={{
            padding: "12px",
            backgroundColor: `${getWarningColor()}08`,
            border: `1px solid ${getWarningColor()}30`,
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "13px",
            color: getTextSecondaryColor(),
            textAlign: "center",
          }}
        >
          ⚠️ You can only use one bonus die per spell attempt. Choose wisely!
          {availableDiceArray.length > 1 &&
            ` (${
              availableDiceArray.length - 1
            } will remain for future attempts)`}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleSkip}
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
              minWidth: "100px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = getHoverColor();
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = getBackgroundColor();
            }}
          >
            Skip
          </button>
          <button
            onClick={handleUseDice}
            disabled={!selectedDie}
            style={{
              padding: "10px 20px",
              backgroundColor: selectedDie
                ? getWarningColor()
                : getTextSecondaryColor(),
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: selectedDie ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              minWidth: "140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              opacity: selectedDie ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (selectedDie) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedDie) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }
            }}
          >
            <Dice6 size={16} />
            Use {selectedDie || "Bonus Die"}
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
