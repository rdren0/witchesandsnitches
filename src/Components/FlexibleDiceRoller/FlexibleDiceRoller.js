import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useRollFunctions } from "../utils/diceRoller";
import { useTheme } from "../../contexts/ThemeContext";
import {
  D4Icon,
  D6Icon,
  D8Icon,
  D10Icon,
  D12Icon,
  D20Icon,
  D100Icon,
} from "./DiceIcons";

const PRESET_DICE = [
  { sides: 4, Icon: D4Icon },
  { sides: 6, Icon: D6Icon },
  { sides: 8, Icon: D8Icon },
  { sides: 10, Icon: D10Icon },
  { sides: 12, Icon: D12Icon },
  { sides: 20, Icon: D20Icon },
  { sides: 100, Icon: D100Icon },
];

const INITIAL_POOL = Object.fromEntries(PRESET_DICE.map((d) => [d.sides, 0]));

const ROLL_TYPES = [
  { value: "normal", label: "Normal", activeColor: null },
  { value: "advantage", label: "Advantage", activeColor: "#10b981" },
  { value: "disadvantage", label: "Disadvantage", activeColor: "#ef4444" },
];

const TileButton = ({ onClick, color, textColor, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? color + "30" : "none",
        border: "none",
        cursor: "pointer",
        padding: "7px",
        color: hovered ? color : textColor,
        display: "flex",
        alignItems: "center",
        borderRadius: "50%",
        transition: "background 0.15s, color 0.15s",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
};

// Small +/- stepper used for modifier
const Stepper = ({
  value,
  onDecrement,
  onIncrement,
  onChange,
  min,
  max,
  width = 52,
  theme,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      backgroundColor: theme.background,
      overflow: "hidden",
    }}
  >
    <button
      type="button"
      onClick={onDecrement}
      style={{
        background: "none",
        border: "none",
        padding: "8px 10px",
        cursor: "pointer",
        color: theme.textSecondary,
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <Minus size={13} />
    </button>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={onChange}
      style={{
        border: "none",
        background: "none",
        width,
        textAlign: "center",
        fontSize: "15px",
        fontWeight: "700",
        color: theme.text,
        outline: "none",
        MozAppearance: "textfield",
        WebkitAppearance: "none",
        padding: "8px 0",
      }}
    />
    <button
      type="button"
      onClick={onIncrement}
      style={{
        background: "none",
        border: "none",
        padding: "8px 10px",
        cursor: "pointer",
        color: theme.textSecondary,
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <Plus size={13} />
    </button>
  </div>
);

const FlexibleDiceRoller = ({
  title = "Flexible Roll",
  description = "Rolling dice with modifier",
  character = null,
  style = {},
  compact = false,
}) => {
  const { rollFlexibleDicePool } = useRollFunctions();
  const { theme } = useTheme();

  const [pool, setPool] = useState({ ...INITIAL_POOL });
  const [customText, setCustomText] = useState("");
  const [rollMode, setRollMode] = useState("pool"); // "pool" | "custom"
  const [rollType, setRollType] = useState("normal");
  const [modifier, setModifier] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const setDieCount = (sides, delta) =>
    setPool((p) => ({ ...p, [sides]: Math.max(0, (p[sides] || 0) + delta) }));

  const parseCustomText = (text) => {
    const str = text.replace(/\s+/g, "");
    if (!str) return { groups: [], modifier: 0 };
    const groups = [];
    const diceRegex = /(\d+)d(\d+)/gi;
    let match;
    while ((match = diceRegex.exec(str)) !== null) {
      const qty = parseInt(match[1]);
      const sides = parseInt(match[2]);
      if (qty > 0 && sides >= 2) groups.push({ qty, sides });
    }
    const cleaned = str.replace(/\d+d\d+/gi, "");
    const modMatches = cleaned.match(/[+-]\d+/g) || [];
    const customMod = modMatches.reduce((sum, m) => sum + parseInt(m), 0);
    return { groups, modifier: customMod };
  };

  const customParsed = parseCustomText(customText);

  const activeDiceGroups =
    rollMode === "pool"
      ? PRESET_DICE.filter((d) => pool[d.sides] > 0).map((d) => ({
          qty: pool[d.sides],
          sides: d.sides,
        }))
      : customParsed.groups;

  const hasAnyDice = activeDiceGroups.length > 0;
  const mod = parseInt(modifier) || 0;
  const totalMod = rollMode === "pool" ? mod : customParsed.modifier;

  const formulaParts = activeDiceGroups.map((g) => `${g.qty}d${g.sides}`);
  const formula = hasAnyDice
    ? formulaParts.join(" + ") +
      (totalMod !== 0
        ? ` ${totalMod > 0 ? "+" : "-"} ${Math.abs(totalMod)}`
        : "")
    : "—";

  const handleRoll = () => {
    if (!hasAnyDice) return;
    rollFlexibleDicePool({
      dicePool: activeDiceGroups,
      modifier: totalMod,
      rollType,
      title: customTitle.trim() || title,
      description: customTitle.trim()
        ? `Rolling ${customTitle.toLowerCase()}`
        : description,
      character,
      isRolling,
      setIsRolling,
    });
  };

  const handleClear = () => {
    if (rollMode === "pool") setPool({ ...INITIAL_POOL });
    else setCustomText("");
  };

  // Shared die-tile styles
  const tileBase = (active) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    padding: "8px 4px 6px",
    border: `2px solid ${active ? theme.primary : theme.border}`,
    borderRadius: "10px",
    backgroundColor: active ? theme.primary + "18" : theme.surface,
    transition: "all 0.15s ease",
    flex: 1,
  });

  const countStyle = (active) => ({
    fontSize: "19px",
    fontWeight: "800",
    lineHeight: 1,
    color: active ? theme.text : theme.textSecondary,
    minWidth: "20px",
    textAlign: "center",
  });

  const tileLabel = (active) => ({
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.04em",
    color: active ? theme.primary : theme.textSecondary,
  });

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        ...style,
      }}
    >
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        @keyframes wns-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Roll name */}
      {!compact && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: theme.textSecondary,
              letterSpacing: "0.07em",
            }}
          >
            ROLL NAME (OPTIONAL)
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder={title}
            onFocus={(e) => {
              e.target.style.borderColor = theme.primary;
              e.target.style.boxShadow = `0 0 0 3px ${theme.primary}22`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.border;
              e.target.style.boxShadow = "none";
            }}
            style={{
              padding: "9px 12px",
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: theme.background,
              color: theme.text,
              outline: "none",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
          />
        </div>
      )}

      {/* Mode toggle */}
      <div
        style={{
          display: "flex",
          border: `1px solid ${theme.border}`,
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {[
          { id: "pool", label: "Dice Pool" },
          { id: "custom", label: "Custom Formula" },
        ].map(({ id, label }) => {
          const active = rollMode === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setRollMode(id)}
              style={{
                flex: 1,
                padding: "8px 12px",
                background: active ? theme.primary : theme.background,
                color: active ? "white" : theme.textSecondary,
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.04em",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Mode content */}
      {rollMode === "pool" ? (
        <>
          {/* Dice tiles */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: theme.textSecondary,
                  letterSpacing: "0.07em",
                }}
              >
                SELECT DICE
              </label>
              {hasAnyDice && (
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "11px",
                    color: theme.textSecondary,
                    padding: 0,
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            {[PRESET_DICE.slice(0, 4), PRESET_DICE.slice(4)].map(
              (row, rowIdx) => (
                <div key={rowIdx} style={{ display: "flex", gap: "6px" }}>
                  {row.map(({ sides, Icon }) => {
                    const qty = pool[sides] || 0;
                    const active = qty > 0;
                    return (
                      <div
                        key={sides}
                        style={tileBase(active)}
                        onClick={
                          !active ? () => setDieCount(sides, 1) : undefined
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0px",
                          }}
                        >
                          {active && (
                            <TileButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setDieCount(sides, -1);
                              }}
                              color={theme.primary}
                              textColor={theme.text}
                            >
                              <Minus size={18} />
                            </TileButton>
                          )}
                          <Icon
                            size={42}
                            bgColor={active ? theme.primary : theme.surface}
                            pathColor={active ? "#fff" : theme.textSecondary}
                          />
                          {active && (
                            <TileButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setDieCount(sides, 1);
                              }}
                              color={theme.primary}
                              textColor={theme.text}
                            >
                              <Plus size={18} />
                            </TileButton>
                          )}
                        </div>
                        {active && <span style={countStyle(true)}>{qty}</span>}
                        <span
                          style={{
                            ...tileLabel(active),
                            cursor: active ? "default" : "pointer",
                          }}
                        >
                          d{sides}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ),
            )}
          </div>

          {/* Modifier */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: theme.textSecondary,
                letterSpacing: "0.07em",
                whiteSpace: "nowrap",
              }}
            >
              MODIFIER
            </label>
            <Stepper
              value={modifier}
              theme={theme}
              width={52}
              onDecrement={() => setModifier((p) => parseInt(p) - 1)}
              onIncrement={() => setModifier((p) => parseInt(p) + 1)}
              onChange={(e) => setModifier(e.target.value)}
            />
          </div>
        </>
      ) : (
        /* Custom formula input */
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <label
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: theme.textSecondary,
                letterSpacing: "0.07em",
              }}
            >
              ENTER FORMULA
            </label>
            {customText.trim() && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  color: theme.textSecondary,
                  padding: 0,
                }}
              >
                Clear
              </button>
            )}
          </div>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="3d17 + 6"
            onFocus={(e) => {
              e.target.style.borderColor = theme.primary;
              e.target.style.boxShadow = `0 0 0 3px ${theme.primary}22`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.border;
              e.target.style.boxShadow = "none";
            }}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              backgroundColor: theme.background,
              fontSize: "16px",
              color: theme.text,
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s, box-shadow 0.15s",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0.5px",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              color: theme.textSecondary,
              paddingLeft: "2px",
            }}
          >
            e.g. 2d6, 3d8 + 4, 1d20 - 2
          </span>
        </div>
      )}

      {/* Roll type */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {ROLL_TYPES.map(({ value, label, activeColor }) => {
          const active = rollType === value;
          const color = activeColor || theme.textSecondary;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRollType(value)}
              style={{
                padding: "6px 14px",
                border: `2px solid ${active ? color : theme.border}`,
                borderRadius: "20px",
                backgroundColor: active ? color + "20" : "transparent",
                color: active ? color : theme.textSecondary,
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.15s ease",
                letterSpacing: "0.03em",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Formula */}
      <div
        style={{
          padding: "10px 14px",
          backgroundColor: hasAnyDice ? theme.primary + "12" : theme.surface,
          border: `1px solid ${hasAnyDice ? theme.primary + "30" : theme.border}`,
          borderRadius: "8px",
          fontFamily: "'Courier New', monospace",
          fontSize: "15px",
          fontWeight: "700",
          color: hasAnyDice ? theme.text : theme.textSecondary,
          textAlign: "center",
          letterSpacing: "1px",
        }}
      >
        {formula}
      </div>

      {/* Roll button */}
      <button
        onClick={handleRoll}
        disabled={isRolling || !hasAnyDice}
        style={{
          padding: "13px 24px",
          backgroundColor:
            isRolling || !hasAnyDice ? theme.surface : theme.primary,
          color: isRolling || !hasAnyDice ? theme.textSecondary : "white",
          border: `1px solid ${!hasAnyDice ? theme.border : "transparent"}`,
          borderRadius: "9px",
          fontSize: "15px",
          fontWeight: "700",
          cursor: isRolling || !hasAnyDice ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          opacity: isRolling ? 0.65 : 1,
          transition: "all 0.15s ease",
          boxShadow:
            !hasAnyDice || isRolling ? "none" : `0 3px 8px ${theme.primary}40`,
        }}
      >
        <D20Icon
          size={20}
          bgColor="transparent"
          pathColor={!hasAnyDice ? theme.textSecondary : "white"}
          style={{
            animation: isRolling ? "wns-spin 0.5s linear infinite" : "none",
          }}
        />
        {isRolling
          ? "Rolling…"
          : hasAnyDice
            ? `Roll ${formula}`
            : rollMode === "pool"
              ? "Select dice above"
              : "Enter a formula above"}
      </button>
    </div>
  );
};

export default FlexibleDiceRoller;
