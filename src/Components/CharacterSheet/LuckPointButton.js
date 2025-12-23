import { useState } from "react";
import { Clover, Plus, Minus } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useRollFunctions } from "../utils/diceRoller";
import { getDiscordWebhook } from "../../App/const";
import { calculateFeatBenefits } from "../CharacterManager/utils/featBenefitsCalculator";

const LuckPointButton = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  selectedCharacterId,
  isAdmin = false,
}) => {
  const { theme } = useTheme();
  const { rollLuckPoint } = useRollFunctions();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const getProficiencyBonus = (level) => {
    if (level <= 4) return 2;
    if (level <= 8) return 3;
    if (level <= 12) return 4;
    if (level <= 16) return 5;
    return 6;
  };

  if (!character) return null;

  const featBenefits = calculateFeatBenefits(character);
  const maxLuckPoints = featBenefits.resources.luckPoints;

  const hasLuckFromResources =
    character?.luck !== undefined && character?.luck !== null;

  if (maxLuckPoints === 0 && !hasLuckFromResources) {
    return null;
  }

  const effectiveMaxLuckPoints =
    maxLuckPoints > 0
      ? maxLuckPoints
      : getProficiencyBonus(character?.level || 1);

  const currentLuckPoints = character?.luck ?? effectiveMaxLuckPoints;

  const updateLuckPoints = async (newCurrent) => {
    if (!character || isUpdating) return;

    setIsUpdating(true);
    const effectiveUserId = isAdmin ? character.discord_user_id : discordUserId;
    const validatedCurrent = Math.max(
      0,
      Math.min(effectiveMaxLuckPoints, newCurrent)
    );

    try {
      const updateData = {
        character_id: selectedCharacterId,
        discord_user_id: effectiveUserId,
        luck: validatedCurrent,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("character_resources")
        .upsert(updateData, {
          onConflict: "character_id,discord_user_id",
        })
        .select();

      if (error) {
        console.error("Database error:", error);
        alert(`Failed to update luck points: ${error.message}`);
        return;
      }

      return validatedCurrent;
    } catch (error) {
      console.error("Error updating luck points:", error);
      alert("Failed to update luck points. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const spendLuckPoint = async (reason = "Luck manipulation") => {
    if (currentLuckPoints <= 0) return;

    const newCurrent = await updateLuckPoints(currentLuckPoints - 1);

    if (newCurrent !== undefined) {
      setCharacter((prev) => ({
        ...prev,
        luck: newCurrent,
      }));

      if (rollLuckPoint) {
        rollLuckPoint({
          character,
          pointsSpent: 1,
          reason: reason,
          pointsRemaining: newCurrent,
          maxPoints: effectiveMaxLuckPoints,
          type: "spent",
        });
      }
    }
    setShowModal(false);
  };

  const restoreLuckPoint = async () => {
    if (currentLuckPoints >= effectiveMaxLuckPoints) return;

    const newCurrent = await updateLuckPoints(currentLuckPoints + 1);

    if (newCurrent !== undefined) {
      setCharacter((prev) => ({
        ...prev,
        luck: newCurrent,
      }));
    }
  };

  const restoreAllLuckPoints = async () => {
    if (currentLuckPoints >= effectiveMaxLuckPoints) return;

    const pointsRestored = effectiveMaxLuckPoints - currentLuckPoints;
    const newCurrent = await updateLuckPoints(effectiveMaxLuckPoints);

    if (newCurrent !== undefined) {
      setCharacter((prev) => ({
        ...prev,
        luck: newCurrent,
      }));
    }
    setShowModal(false);
  };

  const buttonStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    padding: "8px 12px",
    height: "40px",
    borderRadius: "8px",
    border: "2px solid #065f46",
    backgroundColor: currentLuckPoints > 0 ? "#065f46" : theme.surface,
    color: currentLuckPoints > 0 ? "white" : "#065f46",
    cursor: isUpdating ? "wait" : "pointer",
    transition: "all 0.2s ease",
    fontSize: "14px",
    fontWeight: "600",
    minWidth: "80px",
  };

  const modalStyle = {
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
  };

  const modalContentStyle = {
    backgroundColor: theme.surface,
    padding: "20px",
    borderRadius: "12px",
    border: `1px solid ${theme.border}`,
    minWidth: "300px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  };

  const buttonGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginTop: "12px",
  };

  const modalButtonStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <>
      <div
        style={buttonStyle}
        onClick={() => setShowModal(true)}
        title={`Luck Points: ${currentLuckPoints}/${effectiveMaxLuckPoints}\nClick to spend or manage luck points`}
      >
        <Clover size={16} />
        <span>Luck</span>
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            backgroundColor: "#065f46",
            color: "white",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: "bold",
            border: `2px solid ${theme.surface}`,
          }}
        >
          {currentLuckPoints}
        </span>
      </div>

      {showModal && (
        <div style={modalStyle} onClick={() => setShowModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                backgroundColor: theme.background,
                borderRadius: "8px",
                border: `1px solid ${theme.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <Clover style={{ color: "#065f46" }} size={20} />
                <h3
                  style={{
                    margin: 0,
                    color: theme.text,
                    fontSize: "18px",
                    fontWeight: "700",
                  }}
                >
                  Luck Points
                </h3>
                <div
                  style={{
                    marginLeft: "auto",
                    padding: "4px 8px",
                    backgroundColor: "#065f46",
                    color: theme.text,
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {currentLuckPoints}/{effectiveMaxLuckPoints}
                </div>
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: theme.textSecondary,
                }}
              >
                <strong>Lucky Feat:</strong> Spend luck points to gain advantage
                on d20 rolls or impose disadvantage on attacks against you.
              </div>
            </div>

            <button
              style={{
                ...modalButtonStyle,
                backgroundColor:
                  currentLuckPoints > 0 ? "#065f46" : theme.surface,
                color: currentLuckPoints > 0 ? "white" : theme.textSecondary,
                cursor:
                  currentLuckPoints > 0
                    ? isUpdating
                      ? "wait"
                      : "pointer"
                    : "not-allowed",
                opacity: currentLuckPoints > 0 ? (isUpdating ? 0.7 : 1) : 0.6,
                width: "100%",
                marginBottom: "16px",
                padding: "12px",
                fontSize: "14px",
              }}
              onClick={() =>
                spendLuckPoint("Advantage/disadvantage manipulation")
              }
              disabled={currentLuckPoints <= 0 || isUpdating}
            >
              {isUpdating ? "Spending..." : "Spend Luck Point"}
            </button>

            <div
              style={{
                borderTop: `1px solid ${theme.border}`,
                paddingTop: "16px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Manual Adjustment
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "8px",
                }}
              >
                <button
                  style={{
                    ...modalButtonStyle,
                    backgroundColor:
                      currentLuckPoints < effectiveMaxLuckPoints
                        ? "#10b981"
                        : theme.surface,
                    color:
                      currentLuckPoints < effectiveMaxLuckPoints
                        ? "white"
                        : theme.textSecondary,
                    cursor:
                      currentLuckPoints < effectiveMaxLuckPoints
                        ? isUpdating
                          ? "wait"
                          : "pointer"
                        : "not-allowed",
                    opacity:
                      currentLuckPoints < effectiveMaxLuckPoints
                        ? isUpdating
                          ? 0.7
                          : 1
                        : 0.6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                  onClick={restoreLuckPoint}
                  disabled={
                    currentLuckPoints >= effectiveMaxLuckPoints || isUpdating
                  }
                >
                  <Plus size={14} />
                  Add 1
                </button>
                <button
                  style={{
                    ...modalButtonStyle,
                    backgroundColor:
                      currentLuckPoints > 0 ? "#ef4444" : theme.surface,
                    color:
                      currentLuckPoints > 0 ? "white" : theme.textSecondary,
                    cursor:
                      currentLuckPoints > 0
                        ? isUpdating
                          ? "wait"
                          : "pointer"
                        : "not-allowed",
                    opacity:
                      currentLuckPoints > 0 ? (isUpdating ? 0.7 : 1) : 0.6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                  onClick={async () => {
                    if (currentLuckPoints <= 0) return;
                    const newCurrent = await updateLuckPoints(
                      currentLuckPoints - 1
                    );
                    if (newCurrent !== undefined) {
                      setCharacter((prev) => ({
                        ...prev,
                        luck: newCurrent,
                      }));
                    }
                  }}
                  disabled={currentLuckPoints <= 0 || isUpdating}
                >
                  <Minus size={14} />
                  Remove 1
                </button>
                <button
                  style={{
                    ...modalButtonStyle,
                    backgroundColor:
                      currentLuckPoints < effectiveMaxLuckPoints
                        ? "#065f46"
                        : theme.surface,
                    color:
                      currentLuckPoints < effectiveMaxLuckPoints
                        ? "white"
                        : theme.textSecondary,
                    cursor:
                      currentLuckPoints < effectiveMaxLuckPoints
                        ? isUpdating
                          ? "wait"
                          : "pointer"
                        : "not-allowed",
                    opacity:
                      currentLuckPoints < effectiveMaxLuckPoints
                        ? isUpdating
                          ? 0.7
                          : 1
                        : 0.6,
                    fontSize: "12px",
                  }}
                  onClick={restoreAllLuckPoints}
                  disabled={
                    currentLuckPoints >= effectiveMaxLuckPoints || isUpdating
                  }
                >
                  {isUpdating ? "..." : "Restore All"}
                </button>
              </div>
            </div>

            <button
              style={{
                ...modalButtonStyle,
                backgroundColor: theme.background,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                width: "100%",
              }}
              onClick={() => setShowModal(false)}
              disabled={isUpdating}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LuckPointButton;
