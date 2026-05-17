import React, { useState, useEffect } from "react";
import { Dices, History, X } from "lucide-react";
import { useRollModal } from "../utils/diceRoller";
import { useTheme } from "../../contexts/ThemeContext";
import RollHistory from "./RollHistory";
import FlexibleDiceRoller from "./FlexibleDiceRoller";

const FAB_SIZE = 50;
const FAB_BOTTOM = 28;
const FAB_RIGHT = 28;
const SUB_SIZE = 44;
const SUB_GAP = 10;

const SubButton = ({ label, Icon, onClick, bottom, theme }) => (
  <div
    style={{
      position: "fixed",
      bottom,
      right: FAB_RIGHT + (FAB_SIZE - SUB_SIZE) / 2,
      zIndex: 1004,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <span
      style={{
        backgroundColor: theme.surface,
        color: theme.text,
        fontSize: "12px",
        fontWeight: "600",
        padding: "4px 10px",
        borderRadius: "6px",
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
    <button
      onClick={onClick}
      style={{
        width: SUB_SIZE,
        height: SUB_SIZE,
        borderRadius: "50%",
        backgroundColor: theme.primary,
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
        flexShrink: 0,
      }}
    >
      <Icon size={18} />
    </button>
  </div>
);

const RollHistoryDrawer = ({ character }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [diceModalOpen, setDiceModalOpen] = useState(false);
  const { pruneOldHistory } = useRollModal();
  const { theme } = useTheme();

  useEffect(() => {
    if (drawerOpen) pruneOldHistory();
  }, [drawerOpen]);

  const openDrawer = () => { setDrawerOpen((v) => !v); setMenuOpen(false); };
  const openDice  = () => { setDiceModalOpen((v) => !v); setMenuOpen(false); };
  const closeAll  = () => { setMenuOpen(false); setDrawerOpen(false); setDiceModalOpen(false); };

  const sub1Bottom = FAB_BOTTOM + FAB_SIZE + SUB_GAP;
  const sub2Bottom = sub1Bottom + SUB_SIZE + SUB_GAP;

  return (
    <>
      {/* Shared backdrop */}
      {(menuOpen || drawerOpen || diceModalOpen) && (
        <div
          onClick={closeAll}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
            zIndex: 1001,
          }}
        />
      )}

      {/* Roll History drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "340px",
          zIndex: 1002,
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s ease",
          boxShadow: drawerOpen ? "-6px 0 24px rgba(0,0,0,0.25)" : "none",
          borderLeft: `1px solid ${theme.border}`,
        }}
      >
        <button
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "absolute",
            top: "12px",
            left: "-36px",
            width: "32px",
            height: "32px",
            borderRadius: "6px 0 0 6px",
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRight: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.textSecondary,
            zIndex: 1003,
          }}
        >
          <X size={14} />
        </button>
        <RollHistory characterId={character?.id} />
      </div>

      {/* Dice Roller modal */}
      {diceModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1002,
            width: "min(480px, 90vw)",
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <button
            onClick={() => setDiceModalOpen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: theme.textSecondary,
              display: "flex",
              alignItems: "center",
              padding: "4px",
              borderRadius: "4px",
              zIndex: 1,
            }}
          >
            <X size={16} />
          </button>
          <FlexibleDiceRoller
            title="Custom Roll"
            description={character ? `Rolling for ${character.name}` : "Rolling dice"}
            character={character ?? null}
          />
        </div>
      )}

      {/* Speed dial sub-buttons (visible when menu open) */}
      {menuOpen && (
        <>
          <SubButton
            label="Roll History"
            Icon={History}
            onClick={openDrawer}
            bottom={sub1Bottom}
            theme={theme}
          />
          <SubButton
            label="Dice Roller"
            Icon={Dices}
            onClick={openDice}
            bottom={sub2Bottom}
            theme={theme}
          />
        </>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        title={menuOpen ? "Close" : "Dice Tools"}
        style={{
          position: "fixed",
          bottom: FAB_BOTTOM,
          right: FAB_RIGHT,
          zIndex: 1004,
          width: FAB_SIZE,
          height: FAB_SIZE,
          borderRadius: "50%",
          backgroundColor: theme.primary,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
          color: "white",
          transition: "transform 0.2s ease",
          transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
          flexShrink: 0,
        }}
      >
        {menuOpen ? <X size={22} /> : <Dices size={22} />}
      </button>
    </>
  );
};

export default RollHistoryDrawer;
