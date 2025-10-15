import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { BookOpen, Zap, Target, ChevronDown, ChevronUp } from "lucide-react";
import { spellsData } from "../../SharedData/spells";
import { useRollModal } from "../utils/diceRoller";
import { sendDiscordRollWebhook } from "../utils/discordWebhook";

const SpellSummary = ({
  character,
  supabase,
  user,
  discordUserId,
  adminMode = false,
  isUserAdmin = false,
}) => {
  const { theme } = useTheme();
  const { showRollResult } = useRollModal();
  const [spellAttempts, setSpellAttempts] = useState({});
  const [criticalSuccesses, setCriticalSuccesses] = useState({});
  const [failedAttempts, setFailedAttempts] = useState({});
  const [researchedSpells, setResearchedSpells] = useState({});
  const [arithmancticTags, setArithmancticTags] = useState({});
  const [runicTags, setRunicTags] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSpells, setExpandedSpells] = useState({});
  const [selectedSpellLevels, setSelectedSpellLevels] = useState({});

  useEffect(() => {
    if (!character || !supabase) return;

    const loadSpellProgress = async () => {
      setIsLoading(true);
      try {
        let characterOwnerDiscordId;

        if (adminMode && isUserAdmin) {
          characterOwnerDiscordId =
            character.discord_user_id || character.ownerId;
        } else {
          characterOwnerDiscordId =
            user?.user_metadata?.provider_id || discordUserId;
        }

        const { data, error } = await supabase
          .from("spell_progress_summary")
          .select("*")
          .eq("character_id", character.id)
          .eq("discord_user_id", characterOwnerDiscordId)
          .or("has_natural_twenty.eq.true,successful_attempts.gt.0");
        if (error) {
          console.error("Error fetching spell progress:", error);
          return;
        }

        const newSpellAttempts = {};
        const newCriticalSuccesses = {};
        const newFailedAttempts = {};
        const newResearchedSpells = {};
        const newArithmancticTags = {};
        const newRunicTags = {};

        if (data && data.length > 0) {
          data.forEach((spell) => {
            const spellName = spell.spell_name;

            if (spell.successful_attempts > 0) {
              newSpellAttempts[spellName] = {
                1: true,
                2: spell.successful_attempts >= 2,
              };
            }

            if (spell.has_natural_twenty) {
              newCriticalSuccesses[spellName] = true;
            }

            if (spell.has_failed_attempt) {
              newFailedAttempts[spellName] = true;
            }
          });
        }

        setSpellAttempts(newSpellAttempts);
        setCriticalSuccesses(newCriticalSuccesses);
        setFailedAttempts(newFailedAttempts);
      } catch (error) {
        console.error("Error loading spell progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSpellProgress();
  }, [
    character?.id,
    supabase,
    adminMode,
    isUserAdmin,
    discordUserId,
    user?.user_metadata?.provider_id,
  ]);

  const toggleSpellExpansion = (spellName) => {
    setExpandedSpells((prev) => ({
      ...prev,
      [spellName]: !prev[spellName],
    }));
  };

  const getSpellcastingAbilityModifier = (character) => {
    if (!character) return 0;

    const spellcastingAbilityMap = {
      "Willpower Caster": "charisma",
      "Technique Caster": "wisdom",
      "Intellect Caster": "intelligence",
      "Vigor Caster": "constitution",
      Willpower: "charisma",
      Technique: "wisdom",
      Intellect: "intelligence",
      Vigor: "constitution",
    };

    const abilityKey = spellcastingAbilityMap[character.castingStyle];
    if (!abilityKey) return 0;

    const abilityScore = character[abilityKey] || 10;
    return Math.floor((abilityScore - 10) / 2);
  };

  const getSpellSaveDC = (character) => {
    if (!character) return 8;
    const spellcastingModifier = getSpellcastingAbilityModifier(character);
    return 8 + (character.proficiencyBonus || 0) + spellcastingModifier;
  };

  const parseDamageFromDescription = (description) => {
    if (!description) return null;

    const damageMatch = description.match(
      /(\d+d\d+(?:\s*\+\s*\d+)?)\s+(\w+)\s+damage/i
    );
    if (damageMatch) {
      return {
        dice: damageMatch[1].replace(/\s+/g, ""),
        type: damageMatch[2].toLowerCase(),
      };
    }
    return null;
  };

  const parseSavingThrowFromDescription = (description) => {
    if (!description) return null;

    const saveMatch = description.match(
      /(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+sav(?:ing throw|e)/i
    );
    if (saveMatch) {
      return {
        ability: saveMatch[1].toLowerCase(),
      };
    }
    return null;
  };

  const getCantripScaledDamage = (baseDice, characterLevel) => {
    const match = baseDice.match(/(\d+)(d\d+)/);
    if (!match) return baseDice;

    let diceCount = parseInt(match[1]);
    const diceType = match[2];

    if (characterLevel >= 17) {
      diceCount = diceCount * 4;
    } else if (characterLevel >= 11) {
      diceCount = diceCount * 3;
    } else if (characterLevel >= 5) {
      diceCount = diceCount * 2;
    }

    return `${diceCount}${diceType}`;
  };

  const getAvailableSpellLevels = (baseLevel) => {
    if (baseLevel === "Cantrip") return ["Cantrip"];

    const levelNum = parseInt(baseLevel.match(/(\d+)/)?.[1] || "1");
    const levels = [];

    for (let i = levelNum; i <= 9; i++) {
      levels.push(
        `${i}${i === 1 ? "st" : i === 2 ? "nd" : i === 3 ? "rd" : "th"} Level`
      );
    }

    return levels;
  };

  const getSortedSpellLevels = (masteredByLevel) => {
    const levelOrder = [
      "Cantrip",
      "1st Level",
      "2nd Level",
      "3rd Level",
      "4th Level",
      "5th Level",
      "6th Level",
      "7th Level",
      "8th Level",
      "9th Level",
    ];

    return levelOrder.filter((level) => masteredByLevel[level]);
  };

  const handleDamageRoll = async (spell, castAtLevel = null) => {
    if (!character) return;

    let damageData =
      spell.damage || parseDamageFromDescription(spell.description);
    if (!damageData) return;

    try {
      let diceFormula = damageData.dice;

      if (spell.level === "Cantrip") {
        diceFormula = getCantripScaledDamage(diceFormula, character.level || 1);
      } else if (castAtLevel && spell.higherLevels) {
        const baseLevel = parseInt(spell.level.match(/(\d+)/)?.[1] || "1");
        const castLevel = parseInt(
          castAtLevel.match(/(\d+)/)?.[1] || baseLevel
        );
        const levelDiff = castLevel - baseLevel;

        if (levelDiff > 0) {
          const scalingMatch = spell.higherLevels.match(
            /(?:the\s+)?damage\s+(?:increases|is\s+increased)\s+by\s+(\d+d\d+)/i
          );

          if (scalingMatch) {
            const bonusDice = scalingMatch[1];
            const bonusMatch = bonusDice.match(/(\d+)(d\d+)/);
            if (bonusMatch) {
              const baseDiceMatch = diceFormula.match(
                /(\d+)(d\d+)(?:\+(\d+))?/
              );
              if (baseDiceMatch && baseDiceMatch[2] === bonusMatch[2]) {
                const baseDiceCount = parseInt(baseDiceMatch[1]);
                const bonusDiceCount = parseInt(bonusMatch[1]) * levelDiff;
                const modifier = baseDiceMatch[3] || "";
                diceFormula = `${baseDiceCount + bonusDiceCount}${
                  baseDiceMatch[2]
                }${modifier ? "+" + modifier : ""}`;
              }
            }
          }
        }
      }

      const diceMatch = diceFormula.match(/(\d+)d(\d+)(?:\+(\d+))?/);
      if (!diceMatch) return;

      const numDice = parseInt(diceMatch[1]);
      const diceSize = parseInt(diceMatch[2]);
      const bonus = parseInt(diceMatch[3]) || 0;

      let total = bonus;
      const rolls = [];
      for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * diceSize) + 1;
        rolls.push(roll);
        total += roll;
      }

      const damageTypeDisplay = damageData.type
        ? damageData.type.charAt(0).toUpperCase() + damageData.type.slice(1)
        : "Damage";

      showRollResult({
        title: `${spell.name} - Damage Roll${
          castAtLevel
            ? ` (${castAtLevel})`
            : spell.level === "Cantrip"
            ? ` (Level ${character.level || 1})`
            : ""
        }`,
        rollValue: rolls.reduce((sum, roll) => sum + roll, 0),
        modifier: bonus,
        total: total,
        character: character,
        type: "damage",
        description: `${diceFormula}${bonus > 0 ? ` + ${bonus}` : ""} ${
          damageData.type || ""
        } damage = ${total}`,
        individualDiceResults: rolls,
        diceQuantity: numDice,
        diceType: diceSize,
      });

      const additionalFields = [
        {
          name: "Spell",
          value: spell.name,
          inline: true,
        },
        {
          name: "Damage Type",
          value: damageTypeDisplay,
          inline: true,
        },
        {
          name: "Dice Rolled",
          value: rolls.join(", ") + (bonus > 0 ? ` + ${bonus}` : ""),
          inline: true,
        },
      ];

      await sendDiscordRollWebhook({
        character: character,
        rollType: "Damage Roll",
        title: `${character.name}: ${spell.name} - ${damageTypeDisplay}`,
        embedColor: 0xef4444,
        rollResult: {
          d20Roll: rolls.reduce((sum, roll) => sum + roll, 0),
          rollValue: rolls.reduce((sum, roll) => sum + roll, 0),
          modifier: bonus,
          total: total,
          isCriticalSuccess: false,
          isCriticalFailure: false,
        },
        fields: additionalFields,
        useCharacterAvatar: true,
      });
    } catch (error) {
      console.error("Error rolling damage:", error);
    }
  };

  const spellStats = useMemo(() => {
    const stats = {
      mastered: [],
      attempted: [],
      failed: [],
      masteredByLevel: {},
    };

    if (!spellsData || isLoading) return stats;

    const allSpells = [];
    Object.values(spellsData).forEach((subjectData) => {
      Object.values(subjectData.levels).forEach((spells) => {
        spells.forEach((spell) => {
          allSpells.push(spell);
        });
      });
    });

    const spellProgressNames = Object.keys(spellAttempts);
    let matchCount = 0;

    allSpells.forEach((spell) => {
      const spellName = spell.name;
      const attempts = spellAttempts[spellName] || {};

      if (Object.keys(attempts).length > 0) {
        matchCount++;
      }

      const isMastered = attempts[1] && attempts[2];

      if (isMastered) {
        stats.mastered.push(spell);

        const level = spell.level || "Unknown";
        if (!stats.masteredByLevel[level]) {
          stats.masteredByLevel[level] = [];
        }
        stats.masteredByLevel[level].push(spell);
      } else if (Object.keys(attempts).length > 0) {
        stats.attempted.push(spell);
      } else {
        stats.failed.push(spell);
      }
    });
    return stats;
  }, [spellAttempts, isLoading]);

  const styles = {
    container: {
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      marginBottom: "16px",
      overflow: "hidden",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      cursor: "pointer",
      borderBottom: isExpanded ? `1px solid ${theme.border}` : "none",
      transition: "all 0.2s ease",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    headerTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    statsRow: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      fontSize: "14px",
      color: theme.textSecondary,
    },
    stat: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    expandIcon: {
      color: theme.textSecondary,
      transition: "transform 0.2s ease",
    },
    content: {
      padding: "16px",
      maxHeight: isExpanded ? "400px" : "0",
      overflow: "auto",
      transition: "max-height 0.3s ease",
    },
    spellGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "8px",
      marginBottom: "16px",
    },
    spellItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 8px",
      borderRadius: "4px",
      fontSize: "13px",
      border: `1px solid ${theme.border}`,
    },
    masteredSpell: {
      backgroundColor: `${theme.success}15`,
      borderColor: theme.success,
      color: theme.success,
    },
    attemptedSpell: {
      backgroundColor: `${theme.warning}15`,
      borderColor: theme.warning,
      color: theme.warning,
    },
    sectionTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    emptyState: {
      textAlign: "center",
      color: theme.textSecondary,
      fontSize: "14px",
      padding: "20px",
    },
    spellDetails: {
      marginTop: "8px",
      backgroundColor: theme.background,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      fontSize: "12px",
      overflow: "hidden",
    },
    spellDetailRow: {
      marginBottom: "6px",
      lineHeight: "1.4",
      color: theme.text,
    },
    spellHeader: {
      backgroundColor: theme.surface,
      padding: "12px 16px",
      borderBottom: `2px solid ${theme.primary}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    spellStats: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
      fontSize: "13px",
      color: theme.success,
    },
    spellStatItem: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    spellBody: {
      padding: "16px",
    },
    spellSection: {
      marginBottom: "16px",
    },
    spellSectionTitle: {
      fontSize: "11px",
      fontWeight: "700",
      textTransform: "uppercase",
      color: theme.textSecondary,
      marginBottom: "6px",
      letterSpacing: "0.5px",
    },
    spellSectionContent: {
      fontSize: "13px",
      color: theme.text,
      lineHeight: "1.6",
    },
    spellLevelSelector: {
      padding: "6px 12px",
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "4px",
      fontSize: "13px",
      color: theme.text,
      cursor: "pointer",
      fontWeight: "500",
    },
    damageButton: {
      padding: "8px 16px",
      backgroundColor: "#dc2626",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
    },
    saveDCPill: {
      backgroundColor: "#3B82F6",
      color: "white",
      padding: "8px 16px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "600",
      textAlign: "center",
      whiteSpace: "nowrap",
    },
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <BookOpen size={16} />
            <span style={styles.headerTitle}>Spell Progress</span>
          </div>
          <span style={{ fontSize: "14px", color: theme.textSecondary }}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={styles.headerLeft}>
          <div style={styles.headerTitle}>
            <BookOpen size={16} />
            Unlocked Spells
          </div>
          <div style={styles.statsRow}>
            <div style={styles.stat}>
              <Zap size={12} style={{ color: theme.success }} />
              <span>{spellStats.mastered.length} Mastered</span>
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} style={styles.expandIcon} />
        ) : (
          <ChevronDown size={16} style={styles.expandIcon} />
        )}
      </div>

      {isExpanded && (
        <div style={styles.content}>
          {spellStats.mastered.length > 0 && (
            <>
              {getSortedSpellLevels(spellStats.masteredByLevel).map(
                (levelName) => (
                  <div key={levelName} style={{ marginBottom: "24px" }}>
                    <div style={styles.sectionTitle}>
                      <Zap size={14} style={{ color: theme.success }} />
                      {levelName} (
                      {spellStats.masteredByLevel[levelName].length})
                    </div>
                    <div style={styles.spellGrid}>
                      {spellStats.masteredByLevel[levelName].map((spell) => (
                        <div
                          key={`mastered-${spell.name}`}
                          style={{
                            gridColumn: expandedSpells[spell.name]
                              ? "1 / -1"
                              : "auto",
                          }}
                        >
                          <div
                            style={{
                              ...styles.spellItem,
                              ...styles.masteredSpell,
                              cursor: "pointer",
                            }}
                            onClick={() => toggleSpellExpansion(spell.name)}
                          >
                            <Zap size={12} />
                            {spell.name}
                            <span
                              style={{ marginLeft: "auto", fontSize: "10px" }}
                            >
                              {expandedSpells[spell.name] ? "▼" : "▶"}
                            </span>
                          </div>
                          {expandedSpells[spell.name] && (
                            <div style={styles.spellDetails}>
                              <div style={styles.spellHeader}>
                                <div style={styles.spellStats}>
                                  <div style={styles.spellStatItem}>
                                    <strong>{spell.level}</strong>
                                  </div>
                                  <div style={styles.spellStatItem}>
                                    ⏱️ {spell.castingTime}
                                  </div>
                                  <div style={styles.spellStatItem}>
                                    📍 {spell.range}
                                  </div>
                                  <div style={styles.spellStatItem}>
                                    ⌛ {spell.duration}
                                  </div>
                                </div>
                              </div>

                              <div style={styles.spellBody}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "16px",
                                  }}
                                >
                                  <div style={{ flex: 1 }}>
                                    <div style={styles.spellSection}>
                                      <div style={styles.spellSectionTitle}>
                                        Description
                                      </div>
                                      <div style={styles.spellSectionContent}>
                                        {spell.description}
                                      </div>
                                    </div>

                                    {spell.higherLevels && (
                                      <div style={styles.spellSection}>
                                        <div style={styles.spellSectionTitle}>
                                          At Higher Levels
                                        </div>
                                        <div
                                          style={{
                                            ...styles.spellSectionContent,
                                            fontStyle: "italic",
                                            color: theme.primary,
                                          }}
                                        >
                                          {spell.higherLevels}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "8px",
                                      minWidth: "fit-content",
                                    }}
                                  >
                                    {(() => {
                                      const hasDamage =
                                        spell.damage ||
                                        parseDamageFromDescription(
                                          spell.description
                                        );
                                      const hasSave =
                                        spell.savingThrow ||
                                        parseSavingThrowFromDescription(
                                          spell.description
                                        );

                                      return (
                                        <>
                                          {spell.level !== "Cantrip" &&
                                            hasDamage && (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  gap: "4px",
                                                }}
                                              >
                                                <label
                                                  style={{
                                                    fontSize: "11px",
                                                    fontWeight: "700",
                                                    textTransform: "uppercase",
                                                    color: theme.textSecondary,
                                                    letterSpacing: "0.5px",
                                                  }}
                                                >
                                                  Cast at Level
                                                </label>
                                                <select
                                                  value={
                                                    selectedSpellLevels[
                                                      spell.name
                                                    ] || spell.level
                                                  }
                                                  onChange={(e) =>
                                                    setSelectedSpellLevels({
                                                      ...selectedSpellLevels,
                                                      [spell.name]:
                                                        e.target.value,
                                                    })
                                                  }
                                                  style={
                                                    styles.spellLevelSelector
                                                  }
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                >
                                                  {getAvailableSpellLevels(
                                                    spell.level
                                                  ).map((level) => (
                                                    <option
                                                      key={level}
                                                      value={level}
                                                    >
                                                      {level}
                                                    </option>
                                                  ))}
                                                </select>
                                              </div>
                                            )}
                                          {hasDamage && (
                                            <button
                                              onClick={() =>
                                                handleDamageRoll(
                                                  spell,
                                                  selectedSpellLevels[
                                                    spell.name
                                                  ]
                                                )
                                              }
                                              style={styles.damageButton}
                                              title="Roll damage"
                                            >
                                              <Zap size={16} />
                                              Roll Damage
                                            </button>
                                          )}
                                          {hasSave && (
                                            <div
                                              style={styles.saveDCPill}
                                              title={`${
                                                hasSave.ability
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                hasSave.ability.slice(1)
                                              } Saving Throw`}
                                            >
                                              DC {getSpellSaveDC(character)}
                                              <div
                                                style={{
                                                  fontSize: "11px",
                                                  fontWeight: "400",
                                                  marginTop: "2px",
                                                }}
                                              >
                                                {hasSave.ability
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  hasSave.ability.slice(1)}{" "}
                                                Save
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </>
          )}

          {spellStats.mastered.length === 0 && (
            <div style={styles.emptyState}>
              <BookOpen
                size={24}
                style={{ marginBottom: "8px", opacity: 0.5 }}
              />
              <div>No spell progress yet</div>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                Visit the SpellBook to start learning spells
              </div>
              {!isLoading && (
                <div
                  style={{ fontSize: "10px", marginTop: "8px", opacity: 0.7 }}
                >
                  Debug: Loaded {Object.keys(spellAttempts).length} spells from
                  database
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpellSummary;
