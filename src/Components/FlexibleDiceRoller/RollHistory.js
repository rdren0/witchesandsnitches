import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRollModal, getRollTypeColor } from "../utils/diceRoller";
import { useTheme } from "../../contexts/ThemeContext";


const relativeTime = (timestamp) => {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "JUST NOW";
  if (mins < 60) return `${mins} MIN${mins !== 1 ? "S" : ""} AGO`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} HR${hrs !== 1 ? "S" : ""} AGO`;
  const date = new Date(timestamp);
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

const formatFormula = (entry) => {
  const mod = entry.modifier;
  const modStr = mod > 0 ? ` + ${mod}` : mod < 0 ? ` − ${Math.abs(mod)}` : "";

  // Custom dice pool — show full dice notation with type labels
  if (entry.diceGroups && entry.diceGroups.length > 0) {
    const validGroups = entry.diceGroups.filter((g) => g.values && g.values.length > 0);
    if (validGroups.length > 0) {
      return validGroups
        .map((g) => `${g.values.length}d${g.sides} [${g.values.join(", ")}]`)
        .join(" + ") + modStr;
    }
  }

  // Standard rolls — just the number, no "d20" label
  if (entry.diceValues && entry.diceValues.length > 0) {
    return `${entry.diceValues[0]}${modStr}`;
  }

  const rv = entry.rollValue;
  if (rv !== undefined && rv !== null) return `${rv}${modStr}`;

  return null;
};

const getEntryColor = (entry) => {
  if (entry.isCriticalSuccess) return "#f59e0b";
  if (entry.isCriticalFailure) return "#ef4444";
  if (entry.isSuccess === true) return "#3b82f6";
  if (entry.isSuccess === false) return "#ef4444";
  return getRollTypeColor(entry.type);
};

const getOutcomeBadge = (entry) => {
  if (entry.isSuccess === null || entry.isSuccess === undefined) return null;
  if (entry.isCriticalSuccess) return { label: "CRIT", color: "#f59e0b" };
  if (entry.isCriticalFailure) return { label: "CRIT", color: "#ef4444" };
  if (entry.isSuccess) return { label: "PASS", color: "#3b82f6" };
  return { label: "FAIL", color: "#ef4444" };
};

const ClearConfirmModal = ({ onConfirm, onCancel, theme }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
    onClick={onCancel}
  >
    <div
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: "10px",
        padding: "20px 24px",
        maxWidth: "300px",
        width: "90%",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ fontSize: "14px", fontWeight: "700", color: theme.text }}>
        Clear Roll History?
      </div>
      <div style={{ fontSize: "12px", color: theme.textSecondary, lineHeight: 1.4 }}>
        This will permanently delete all roll history. It cannot be undone.
      </div>
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "7px 14px",
            border: `1px solid ${theme.border}`,
            borderRadius: "6px",
            background: "none",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            color: theme.textSecondary,
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: "7px 14px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#ef4444",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            color: "white",
          }}
        >
          Clear
        </button>
      </div>
    </div>
  </div>
);

const RollHistory = ({ characterId }) => {
  const { rollHistory, clearRollHistory } = useRollModal();
  const { theme } = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);

  const filtered = characterId
    ? rollHistory.filter((e) => e.characterId === characterId)
    : rollHistory;

  const handleClearConfirmed = () => {
    clearRollHistory(characterId);
    setShowConfirm(false);
  };

  return (
    <>
      {showConfirm && (
        <ClearConfirmModal
          onConfirm={handleClearConfirmed}
          onCancel={() => setShowConfirm(false)}
          theme={theme}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: theme.surface,
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            borderBottom: `1px solid ${theme.border}`,
            backgroundColor: theme.background,
            flexShrink: 0,
          }}
        >
          <div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: theme.textSecondary,
                letterSpacing: "0.08em",
              }}
            >
              ROLL HISTORY
            </span>
            <div style={{ fontSize: "9px", color: theme.textSecondary, opacity: 0.6, marginTop: "1px" }}>
              Kept for ~2 weeks
            </div>
          </div>
          {filtered.length > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              title="Clear history"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: theme.textSecondary,
                padding: "2px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: theme.textSecondary,
                fontSize: "13px",
                textAlign: "center",
                padding: "20px",
              }}
            >
              Roll something to see your history here
            </div>
          ) : (
            filtered.map((entry) => {
              const typeColor = getEntryColor(entry);
              const formula = formatFormula(entry);
              const hasDiscarded = entry.discardedValues && entry.discardedValues.length > 0;
              const isAdv = entry.rollType === "advantage";
              const isDis = entry.rollType === "disadvantage";
              const outcomeBadge = getOutcomeBadge(entry);

              const hasFormula = formula || hasDiscarded;
              const hasModifiers = entry.modifierBreakdown && entry.modifierBreakdown.length > 0;

              return (
                <div key={entry.id} style={{ marginBottom: "14px" }}>
                  {/* Character name */}
                  {entry.characterName && (
                    <div style={{ fontSize: "10px", color: theme.textSecondary, marginBottom: "2px", paddingLeft: "3px" }}>
                      {entry.characterName}
                    </div>
                  )}

                  {/* Card */}
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: typeColor + "10",
                      border: `1px solid ${typeColor}35`,
                      borderLeft: `3px solid ${typeColor}`,
                      borderRadius: "6px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Left: title + sub-sections */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Title row */}
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", padding: "7px 10px 6px" }}>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: theme.text,
                            letterSpacing: "0.04em",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {entry.title.toUpperCase()}
                        </div>
                        {outcomeBadge && (
                          <span style={{ fontSize: "9px", fontWeight: "700", padding: "1px 4px", borderRadius: "3px", backgroundColor: outcomeBadge.color + "25", color: outcomeBadge.color, flexShrink: 0, letterSpacing: "0.04em" }}>
                            {outcomeBadge.label}
                          </span>
                        )}
                        {(isAdv || isDis) && (
                          <span style={{ fontSize: "9px", fontWeight: "700", padding: "1px 4px", borderRadius: "3px", backgroundColor: isAdv ? "#10b98125" : "#ef444425", color: isAdv ? "#10b981" : "#ef4444", flexShrink: 0, letterSpacing: "0.04em" }}>
                            {isAdv ? "ADV" : "DIS"}
                          </span>
                        )}
                      </div>

                      {/* Math + modifiers together in one sub-row */}
                      {(hasFormula || hasModifiers) && (
                        <div style={{ padding: "4px 10px 7px", borderTop: `1px solid ${typeColor}20`, display: "flex", flexDirection: "column", gap: "2px" }}>
                          {hasFormula && (
                            <div style={{ fontFamily: "'Courier New', monospace", fontSize: "12px", color: theme.textSecondary, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "3px" }}>
                              {hasDiscarded && (
                                <>
                                  <span style={{ textDecoration: "line-through", opacity: 0.45 }}>{entry.discardedValues.join(", ")}</span>
                                  <span style={{ opacity: 0.45 }}>→</span>
                                </>
                              )}
                              {formula && <span>{formula}</span>}
                            </div>
                          )}
                          {hasModifiers && (
                            <div style={{ fontSize: "9px", color: theme.textSecondary, letterSpacing: "0.03em" }}>
                              ({entry.modifierBreakdown.map((part, i) => (
                                <span key={i}>
                                  {i > 0 && " · "}
                                  {part.label} {part.value >= 0 ? "+" : ""}{part.value}
                                </span>
                              ))})
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Vertical divider */}
                    <div style={{ width: "1px", backgroundColor: typeColor + "40", flexShrink: 0 }} />

                    {/* Total */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 14px", flexShrink: 0 }}>
                      <span style={{ fontSize: "22px", fontWeight: "700", color: theme.text }}>
                        {entry.total}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: "10px", color: theme.textSecondary, textAlign: "right", padding: "2px 4px 0" }}>
                    {relativeTime(entry.timestamp)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default RollHistory;
