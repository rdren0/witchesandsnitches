import React, { useState, useEffect } from "react";
import { BookOpen, Sparkles, X, Dice6, Plus } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { getCharacterSpellBonusDice } from "../../utils/diceRoller";
import { sendDiscordRollWebhook } from "../../utils/discordWebhook";

export const MagicalTheoryModal = ({
  isOpen,
  onClose,
  onConfirm,
  character,
  supabase,
  discordUserId,
}) => {
  const theme = useTheme();
  const [showDiceView, setShowDiceView] = useState(false);
  const [currentDice, setCurrentDice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newDiceType, setNewDiceType] = useState("1d4");

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

  const loadCurrentDice = async () => {
    if (!supabase || !character?.id || !discordUserId) return;
    setLoading(true);
    try {
      const dice = await getCharacterSpellBonusDice(
        supabase,
        character.id,
        character?.discord_user_id || discordUserId
      );
      setCurrentDice(dice || []);
    } catch (error) {
      console.error("Error loading dice:", error);
      setCurrentDice([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDice = () => {
    setShowDiceView(true);
    loadCurrentDice();
  };

  const addManualDice = async () => {
    if (!supabase || !character?.id || !discordUserId || !newDiceType) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("character_resources")
        .select("spell_bonus_dice")
        .eq("character_id", character.id)
        .eq("discord_user_id", character?.discord_user_id || discordUserId)
        .single();

      let currentDiceArray = [];
      if (data?.spell_bonus_dice) {
        currentDiceArray = Array.isArray(data.spell_bonus_dice)
          ? data.spell_bonus_dice
          : [data.spell_bonus_dice];
      }

      const newDiceArray = [...currentDiceArray, newDiceType];

      const { error: updateError } = await supabase
        .from("character_resources")
        .upsert(
          {
            character_id: character.id,
            discord_user_id: character?.discord_user_id || discordUserId,
            spell_bonus_dice: newDiceArray,
          },
          {
            onConflict: "character_id,discord_user_id",
          }
        );

      if (updateError) throw updateError;

      try {
        await sendDiscordRollWebhook({
          character,
          rollType: "resource",
          title: "Manual Magical Theory Die Added",
          description: "",
          embedColor: 0x8b5cf6,
          fields: [
            {
              name: "Magical Theory Dice Added",
              value: newDiceType,
              inline: true,
            },
          ],
        });
      } catch (webhookError) {
        console.error("Error sending Discord webhook:", webhookError);
      }

      await loadCurrentDice();
    } catch (error) {
      console.error("Error adding dice:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMain = () => {
    setShowDiceView(false);
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

  const getDiceColor = (die) => {
    const dieType = parseInt(die.match(/\d+/)?.[0] || "4");
    if (dieType === 4) return "#10b981";
    if (dieType === 6) return "#3b82f6";
    if (dieType === 8) return "#8b5cf6";
    if (dieType === 10) return "#f59e0b";
    return "#6b7280";
  };

  const getDiceCount = (diceArray) => {
    return diceArray.reduce((acc, die) => {
      acc[die] = (acc[die] || 0) + 1;
      return acc;
    }, {});
  };

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
              {showDiceView ? "Magical Theory Dice" : "Magical Theory Check"}
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

        {showDiceView ? (
          <div style={{ marginBottom: "24px" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div style={{ color: getTextSecondaryColor() }}>
                  Loading dice...
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <p
                    style={{
                      fontSize: "16px",
                      color: getTextColor(),
                      marginBottom: "16px",
                    }}
                  >
                    Your current Magical Theory bonus dice:
                  </p>

                  {currentDice.length === 0 ? (
                    <div
                      style={{
                        padding: "20px",
                        backgroundColor: getBackgroundColor(),
                        border: `2px solid ${getBorderColor()}`,
                        borderRadius: "8px",
                        textAlign: "center",
                        color: getTextSecondaryColor(),
                      }}
                    >
                      No bonus dice available
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      {Object.entries(getDiceCount(currentDice)).map(
                        ([die, count]) => (
                          <div
                            key={die}
                            style={{
                              padding: "16px",
                              backgroundColor: `${getDiceColor(die)}20`,
                              border: `2px solid ${getDiceColor(die)}`,
                              borderRadius: "8px",
                              minWidth: "100px",
                              textAlign: "center",
                            }}
                          >
                            <Dice6
                              size={24}
                              style={{
                                color: getDiceColor(die),
                                marginBottom: "8px",
                              }}
                            />
                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: getDiceColor(die),
                              }}
                            >
                              {die}
                            </div>
                            {count > 1 && (
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: getTextSecondaryColor(),
                                }}
                              >
                                ×{count} available
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    padding: "16px",
                    backgroundColor: withOpacity(getPrimaryColor(), 0.08),
                    border: `2px solid ${withOpacity(getPrimaryColor(), 0.3)}`,
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: getTextColor(),
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Plus size={20} />
                    Add Manual Dice
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <select
                      value={newDiceType}
                      onChange={(e) => setNewDiceType(e.target.value)}
                      style={{
                        padding: "8px 12px",
                        border: `1px solid ${getBorderColor()}`,
                        borderRadius: "6px",
                        backgroundColor: getCardBackground(),
                        color: getTextColor(),
                        fontSize: "14px",
                        flex: "1",
                      }}
                    >
                      <option value="1d4">1d4</option>
                      <option value="1d6">1d6</option>
                      <option value="1d8">1d8</option>
                      <option value="1d10">1d10</option>
                    </select>

                    <button
                      onClick={addManualDice}
                      disabled={loading}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: getPrimaryColor(),
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.6 : 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ marginBottom: "24px" }}>
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
                    Test your theoretical knowledge to earn bonus dice for
                    future spell attempts!
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
                    Perform a standard Magical Theory skill check for knowledge
                    or investigation purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          {showDiceView ? (
            <button
              onClick={handleBackToMain}
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
              Back
            </button>
          ) : (
            <>
              <button
                onClick={handleViewDice}
                style={{
                  padding: "10px 20px",
                  backgroundColor: getPrimaryColor(),
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
                <Dice6 size={16} />
                View My Dice
              </button>
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
            </>
          )}
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
