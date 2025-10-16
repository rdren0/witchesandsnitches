import React from "react";
import { Heart, Plus, Minus, X, RotateCcw } from "lucide-react";

const CreatureHPModal = ({
  creature,
  theme,
  showHPModal,
  setShowHPModal,
  damageAmount,
  setDamageAmount,
  healAmount,
  setHealAmount,
  isApplyingHP,
  onApplyHP,
}) => {
  if (!showHPModal || !creature) return null;

  const currentHP = creature.current_hit_points ?? creature.hit_points;
  const maxHP = creature.hit_points;

  const getHPColor = () => {
    const percentage = currentHP / maxHP;
    if (percentage <= 0.25) return "#EF4444";
    if (percentage <= 0.5) return "#F59E0B";
    if (percentage <= 0.75) return "#EAB308";
    return "#10B981";
  };

  const handleQuickAction = (amount, type) => {
    onApplyHP(amount, type);
  };

  const handleCustomDamage = () => {
    if (damageAmount > 0) {
      onApplyHP(Math.abs(damageAmount), "damage");
    }
  };

  const handleCustomHeal = () => {
    if (healAmount > 0) {
      onApplyHP(Math.abs(healAmount), "healing");
    }
  };

  const handleFullHeal = () => {
    const healAmount = maxHP - currentHP;
    if (healAmount > 0) {
      onApplyHP(healAmount, "healing");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={() => setShowHPModal(false)}
    >
      <div
        style={{
          backgroundColor: theme.background,
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          minWidth: "400px",
          maxWidth: "500px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              margin: 0,
              color: theme.text,
              fontSize: "18px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Heart size={20} color={getHPColor()} />
            {creature.name} - Manage HP
          </h3>
          <button
            onClick={() => setShowHPModal(false)}
            style={{
              background: "none",
              border: "none",
              color: theme.textSecondary,
              cursor: "pointer",
              padding: "4px",
              borderRadius: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            padding: "12px",
            backgroundColor: theme.surface,
            borderRadius: "8px",
            border: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: getHPColor(),
              marginBottom: "4px",
            }}
          >
            {currentHP} / {maxHP}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: theme.textSecondary,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Current / Maximum HP
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: theme.text,
              marginBottom: "8px",
            }}
          >
            Quick Actions
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
            }}
          >
            <button
              onClick={() => handleQuickAction(1, "damage")}
              disabled={currentHP === 0 || isApplyingHP}
              style={{
                padding: "8px 4px",
                backgroundColor: "#EF444410",
                color: "#EF4444",
                border: "1px solid #EF4444",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: currentHP === 0 || isApplyingHP ? "not-allowed" : "pointer",
                opacity: currentHP === 0 || isApplyingHP ? 0.5 : 1,
              }}
            >
              -1
            </button>
            <button
              onClick={() => handleQuickAction(5, "damage")}
              disabled={currentHP === 0 || isApplyingHP}
              style={{
                padding: "8px 4px",
                backgroundColor: "#EF444410",
                color: "#EF4444",
                border: "1px solid #EF4444",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: currentHP === 0 || isApplyingHP ? "not-allowed" : "pointer",
                opacity: currentHP === 0 || isApplyingHP ? 0.5 : 1,
              }}
            >
              -5
            </button>
            <button
              onClick={() => handleQuickAction(1, "healing")}
              disabled={currentHP === maxHP || isApplyingHP}
              style={{
                padding: "8px 4px",
                backgroundColor: "#10B98110",
                color: "#10B981",
                border: "1px solid #10B981",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: currentHP === maxHP || isApplyingHP ? "not-allowed" : "pointer",
                opacity: currentHP === maxHP || isApplyingHP ? 0.5 : 1,
              }}
            >
              +1
            </button>
            <button
              onClick={() => handleQuickAction(5, "healing")}
              disabled={currentHP === maxHP || isApplyingHP}
              style={{
                padding: "8px 4px",
                backgroundColor: "#10B98110",
                color: "#10B981",
                border: "1px solid #10B981",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: currentHP === maxHP || isApplyingHP ? "not-allowed" : "pointer",
                opacity: currentHP === maxHP || isApplyingHP ? 0.5 : 1,
              }}
            >
              +5
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: theme.text,
              marginBottom: "8px",
            }}
          >
            Take Damage
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="number"
              min="1"
              max={currentHP}
              value={damageAmount || ""}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setDamageAmount(Math.max(0, value));
              }}
              placeholder="Amount"
              style={{
                flex: 1,
                padding: "8px 12px",
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                backgroundColor: theme.surface,
                color: theme.text,
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleCustomDamage}
              disabled={!damageAmount || currentHP === 0 || isApplyingHP}
              style={{
                padding: "8px 16px",
                width: "100px",
                backgroundColor: "#EF4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                cursor:
                  !damageAmount || currentHP === 0 || isApplyingHP
                    ? "not-allowed"
                    : "pointer",
                opacity: !damageAmount || currentHP === 0 || isApplyingHP ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <Minus size={14} />
              Damage
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: theme.text,
              marginBottom: "8px",
            }}
          >
            Restore Health
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="number"
              min="1"
              max={maxHP - currentHP}
              value={healAmount || ""}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setHealAmount(Math.max(0, value));
              }}
              placeholder="Amount"
              style={{
                flex: 1,
                padding: "8px 12px",
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                backgroundColor: theme.surface,
                color: theme.text,
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleCustomHeal}
              disabled={!healAmount || currentHP === maxHP || isApplyingHP}
              style={{
                padding: "8px 16px",
                width: "100px",
                backgroundColor: "#10B981",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                cursor:
                  !healAmount || currentHP === maxHP || isApplyingHP
                    ? "not-allowed"
                    : "pointer",
                opacity: !healAmount || currentHP === maxHP || isApplyingHP ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <Plus size={14} />
              Heal
            </button>
          </div>
        </div>

        <div>
          <button
            onClick={handleFullHeal}
            disabled={currentHP === maxHP || isApplyingHP}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor:
                currentHP === maxHP || isApplyingHP ? theme.surface : "#10B981",
              color: currentHP === maxHP || isApplyingHP ? theme.text : "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: currentHP === maxHP || isApplyingHP ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <RotateCcw size={16} />
            {isApplyingHP ? "Applying..." : `Full Heal to ${maxHP} HP`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatureHPModal;
