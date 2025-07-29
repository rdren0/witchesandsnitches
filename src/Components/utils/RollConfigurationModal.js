import React, { useState, createContext } from "react";
import {
  X,
  Dice6,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
} from "lucide-react";

const RollModalContext = createContext();

const RollConfigurationModal = ({
  isOpen,
  onClose,
  onExecuteRoll,
  rollTitle,
  defaultModifier = 0,
  allowModifierAdjustment = false,
}) => {
  const [privacy, setPrivacy] = useState("public");
  const [rollType, setRollType] = useState("normal");
  const [modifierAdjustment, setModifierAdjustment] = useState(0);

  if (!isOpen) return null;

  const handleExecuteRoll = () => {
    const config = {
      isPrivate: privacy === "private",
      rollType: rollType,
      modifier: defaultModifier + modifierAdjustment,
      modifierAdjustment: modifierAdjustment,
    };
    onExecuteRoll(config);
    onClose();

    setPrivacy("public");
    setRollType("normal");
    setModifierAdjustment(0);
  };

  const getPrivacyButtonStyle = (type) => ({
    flex: 1,
    padding: "12px 8px",
    backgroundColor: privacy === type ? "#dbeafe" : "#f8fafc",
    border: `2px solid ${privacy === type ? "#3b82f6" : "#e2e8f0"}`,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  });

  const getRollTypeButtonStyle = (type) => ({
    flex: 1,
    padding: "12px 8px",
    backgroundColor:
      rollType === type
        ? type === "advantage"
          ? "#dcfce7"
          : type === "disadvantage"
          ? "#fee2e2"
          : "#f3f4f6"
        : "#f8fafc",
    border: `2px solid ${
      rollType === type
        ? type === "advantage"
          ? "#16a34a"
          : type === "disadvantage"
          ? "#dc2626"
          : "#6b7280"
        : "#e2e8f0"
    }`,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "24px",
          minWidth: "400px",
          maxWidth: "500px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          border: "2px solid #e5e7eb",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <Dice6 size={32} style={{ color: "#3b82f6" }} />
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "600",
                color: "#1f2937",
                lineHeight: "1.2",
              }}
            >
              Configure Roll
            </h3>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              {rollTitle}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h4
            style={{
              margin: "0 0 12px 0",
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Privacy
          </h4>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setPrivacy("public")}
              style={getPrivacyButtonStyle("public")}
            >
              <Eye
                size={20}
                style={{ color: privacy === "public" ? "#3b82f6" : "#6b7280" }}
              />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: privacy === "public" ? "#1e40af" : "#374151",
                }}
              >
                Public
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                Everyone sees
              </span>
            </button>
            <button
              onClick={() => setPrivacy("private")}
              style={getPrivacyButtonStyle("private")}
            >
              <EyeOff
                size={20}
                style={{ color: privacy === "private" ? "#3b82f6" : "#6b7280" }}
              />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: privacy === "private" ? "#1e40af" : "#374151",
                }}
              >
                Private
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                DM only
              </span>
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h4
            style={{
              margin: "0 0 12px 0",
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Roll Type
          </h4>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setRollType("disadvantage")}
              style={getRollTypeButtonStyle("disadvantage")}
            >
              <TrendingDown
                size={18}
                style={{
                  color: rollType === "disadvantage" ? "#dc2626" : "#6b7280",
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: rollType === "disadvantage" ? "#991b1b" : "#374151",
                }}
              >
                Disadvantage
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                Roll 2, keep lower
              </span>
            </button>
            <button
              onClick={() => setRollType("normal")}
              style={getRollTypeButtonStyle("normal")}
            >
              <Dice6
                size={18}
                style={{ color: rollType === "normal" ? "#6b7280" : "#9ca3af" }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: rollType === "normal" ? "#374151" : "#6b7280",
                }}
              >
                Normal
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                Single roll
              </span>
            </button>
            <button
              onClick={() => setRollType("advantage")}
              style={getRollTypeButtonStyle("advantage")}
            >
              <TrendingUp
                size={18}
                style={{
                  color: rollType === "advantage" ? "#16a34a" : "#6b7280",
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: rollType === "advantage" ? "#166534" : "#374151",
                }}
              >
                Advantage
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                Roll 2, keep higher
              </span>
            </button>
          </div>
        </div>

        {allowModifierAdjustment && (
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Modifier Adjustment
            </h4>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <button
                onClick={() =>
                  setModifierAdjustment(Math.max(modifierAdjustment - 1, -10))
                }
                style={{
                  padding: "6px",
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Minus size={16} />
              </button>
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                Base: {defaultModifier >= 0 ? "+" : ""}
                {defaultModifier}
                {modifierAdjustment !== 0 && (
                  <span
                    style={{
                      color: modifierAdjustment > 0 ? "#059669" : "#dc2626",
                    }}
                  >
                    {" "}
                    {modifierAdjustment > 0 ? "+" : ""}
                    {modifierAdjustment}
                  </span>
                )}
                <br />
                <span style={{ fontWeight: "600" }}>
                  Total: {defaultModifier + modifierAdjustment >= 0 ? "+" : ""}
                  {defaultModifier + modifierAdjustment}
                </span>
              </div>
              <button
                onClick={() =>
                  setModifierAdjustment(Math.min(modifierAdjustment + 1, 10))
                }
                style={{
                  padding: "6px",
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}

        <div
          style={{
            padding: "12px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <div
            style={{ fontSize: "14px", color: "#374151", textAlign: "center" }}
          >
            <strong>Roll Summary:</strong>{" "}
            {rollType === "advantage"
              ? "🎯 Advantage"
              : rollType === "disadvantage"
              ? "⚠️ Disadvantage"
              : "Normal"}{" "}
            {privacy === "private" ? "🔒 Private" : "👁️ Public"}
            {defaultModifier + modifierAdjustment !== 0 && (
              <span>
                {" "}
                with {defaultModifier + modifierAdjustment >= 0 ? "+" : ""}
                {defaultModifier + modifierAdjustment} modifier
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 20px",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleExecuteRoll}
            style={{
              flex: 2,
              padding: "12px 20px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
          >
            <Dice6 size={16} />
            Execute Roll
          </button>
        </div>
      </div>
    </div>
  );
};

export const RollResultModal = ({ rollResult, isOpen, onClose }) => {
  if (!isOpen || !rollResult) return null;

  const {
    title,
    rollValue,
    modifier,
    total,
    isCriticalSuccess,
    isCriticalFailure,
    description,
    type = "ability",
    rollType = "normal",
    isPrivate = false,
    inventoryAdded,
    potionQuality,
    recipeQuality,
    diceQuantity = 1,
    diceType = 20,
    individualDiceResults,
  } = rollResult;

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
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: isCriticalSuccess
            ? "#fef3c7"
            : isCriticalFailure
            ? "#fee2e2"
            : "#f8fafc",
          border: `3px solid ${
            isCriticalSuccess
              ? "#f59e0b"
              : isCriticalFailure
              ? "#ef4444"
              : "#3b82f6"
          }`,
          borderRadius: "16px",
          padding: "24px",
          minWidth: "320px",
          maxWidth: "500px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
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
            <Dice6 size={32} style={{ color: "#3b82f6" }} />
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1f2937",
                  lineHeight: "1.2",
                }}
              >
                {isPrivate && (
                  <span style={{ color: "#f59e0b", marginRight: "8px" }}>
                    🔒
                  </span>
                )}
                {title}
              </h2>
              {isPrivate && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#92400e",
                    backgroundColor: "#fef3c7",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    marginTop: "4px",
                    display: "inline-block",
                  }}
                >
                  🔒 Private Roll
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            padding: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: "900",
              color: "#3b82f6",
              lineHeight: "1",
              marginBottom: "8px",
            }}
          >
            {total}
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#1f2937",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            {rollValue} {modifier >= 0 ? "+" : ""}
            {modifier} = {total}
          </div>
        </div>
      </div>
    </div>
  );
};

export const RollModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rollResult, setRollResult] = useState(null);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [pendingRoll, setPendingRoll] = useState(null);

  const showRollResult = (result) => {
    setRollResult(result);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setRollResult(null);
  };

  const requestRoll = (rollFunction, rollTitle, options = {}) => {
    setPendingRoll({ rollFunction, rollTitle, options });
    setIsConfigModalOpen(true);
  };

  const executeRoll = (config) => {
    if (pendingRoll) {
      pendingRoll.rollFunction({
        ...pendingRoll.options,
        ...config,
      });
      setPendingRoll(null);
    }
    setIsConfigModalOpen(false);
  };

  const closeConfigModal = () => {
    setIsConfigModalOpen(false);
    setPendingRoll(null);
  };

  return (
    <RollModalContext.Provider value={{ showRollResult, requestRoll }}>
      {children}

      <RollConfigurationModal
        isOpen={isConfigModalOpen}
        onClose={closeConfigModal}
        onExecuteRoll={executeRoll}
        rollTitle={pendingRoll?.rollTitle || ""}
        defaultModifier={pendingRoll?.options?.defaultModifier || 0}
        allowModifierAdjustment={
          pendingRoll?.options?.allowModifierAdjustment || false
        }
      />

      <RollResultModal
        rollResult={rollResult}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </RollModalContext.Provider>
  );
};
