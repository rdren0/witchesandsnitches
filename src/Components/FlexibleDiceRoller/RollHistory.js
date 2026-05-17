import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRollModal, getRollTypeColor } from "../utils/diceRoller";
import { useTheme } from "../../contexts/ThemeContext";


const todayKey = new Date().toDateString();

const formatEntryTime = (timestamp) => {
  const dayKey = new Date(timestamp).toDateString();
  if (dayKey === todayKey) {
    return new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return new Date(timestamp).toLocaleDateString([], { month: "short", day: "numeric" });
};

const groupByDay = (entries) => {
  const groups = [];
  entries.forEach((entry) => {
    const dayKey = new Date(entry.timestamp).toDateString();
    const last = groups[groups.length - 1];
    if (last && last.dayKey === dayKey) {
      last.entries.push(entry);
    } else {
      groups.push({ dayKey, entries: [entry] });
    }
  });
  return groups;
};

const formatGroupLabel = (dayKey) => {
  if (dayKey === todayKey) return "Today";
  return new Date(dayKey).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
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
          backgroundColor: theme.background,
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
            backgroundColor: theme.surface,
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
              Kept for ~3 weeks
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

        <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
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
            groupByDay(filtered).map((group, gi) => (
              <React.Fragment key={group.dayKey}>
                {gi > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0 16px" }}>
                    <div style={{ flex: 1, height: "1px", backgroundColor: theme.textSecondary, opacity: 0.35 }} />
                    <span style={{ fontSize: "11px", color: theme.textSecondary, opacity: 0.6, whiteSpace: "nowrap" }}>
                      {formatGroupLabel(group.dayKey)}
                    </span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: theme.textSecondary, opacity: 0.35 }} />
                  </div>
                )}
                {group.entries.map((entry) => {
                  const typeColor = getEntryColor(entry);
                  const formula = formatFormula(entry);
                  const hasDiscarded = entry.discardedValues && entry.discardedValues.length > 0;
                  const isAdv = entry.rollType === "advantage";
                  const isDis = entry.rollType === "disadvantage";
                  const outcomeBadge = getOutcomeBadge(entry);

                  const hasFormula = formula || hasDiscarded;
                  const hasModifiers = entry.modifierBreakdown && entry.modifierBreakdown.length > 0;

                  return (
                    <div key={entry.id} style={{ marginBottom: "12px" }}>
                      <div
                        style={{
                          backgroundColor: typeColor + "18",
                          border: `1px solid ${typeColor}`,
                          borderLeft: `4px solid ${typeColor}`,
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                      >
                        {/* Name + total row */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 8px 12px", gap: "8px" }}>
                          {/* Left: name + badges */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: theme.text,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {entry.title}
                            </div>
                            {(outcomeBadge || isAdv || isDis) && (
                              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                {outcomeBadge && (
                                  <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", backgroundColor: outcomeBadge.color + "30", color: outcomeBadge.color, letterSpacing: "0.05em" }}>
                                    {outcomeBadge.label}
                                  </span>
                                )}
                                {(isAdv || isDis) && (
                                  <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", backgroundColor: isAdv ? "#10b98130" : "#ef444430", color: isAdv ? "#10b981" : "#ef4444", letterSpacing: "0.05em" }}>
                                    {isAdv ? "ADV" : "DIS"}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Right: total */}
                          <div style={{ fontSize: "30px", fontWeight: "800", color: typeColor, lineHeight: 1, flexShrink: 0 }}>
                            {entry.total}
                          </div>
                        </div>

                        {/* Formula + modifiers */}
                        {(hasFormula || hasModifiers) && (
                          <div style={{ padding: "6px 14px 9px 12px", borderTop: `1px solid ${typeColor}`, display: "flex", flexDirection: "column", gap: "3px" }}>
                            {hasFormula && (
                              <div style={{ fontFamily: "'Courier New', monospace", fontSize: "12px", color: theme.textSecondary, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px" }}>
                                {hasDiscarded && (
                                  <>
                                    <span style={{ textDecoration: "line-through", opacity: 0.5 }}>{entry.discardedValues.join(", ")}</span>
                                    <span style={{ opacity: 0.5 }}>→</span>
                                  </>
                                )}
                                {formula && <span>{formula}</span>}
                              </div>
                            )}
                            {hasModifiers && (
                              <div style={{ fontSize: "11px", color: theme.textSecondary, opacity: 0.8 }}>
                                {entry.modifierBreakdown.map((part, i) => (
                                  <span key={i}>
                                    {i > 0 && " · "}
                                    {part.label} {part.value >= 0 ? "+" : ""}{part.value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div style={{ fontSize: "10px", color: theme.textSecondary, textAlign: "right", padding: "3px 4px 0", opacity: 0.7 }}>
                        {formatEntryTime(entry.timestamp)}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default RollHistory;
