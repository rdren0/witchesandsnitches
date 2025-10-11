import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Loader, Rat, Sword, Zap } from "lucide-react";
import { useRollModal } from "../utils/diceRoller";
import {
  rollCreatureAbility,
  rollCreatureAttackOnly,
  rollCreatureDamage,
} from "../Creatures/creatureRolls";

const CreaturesPanel = ({ supabase, user }) => {
  const { theme } = useTheme();
  const [creatures, setCreatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const { showRollResult } = useRollModal();

  const getModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  const handleAbilityClick = async (
    creature,
    abilityName,
    abilityKey,
    abilityScore
  ) => {
    if (isRolling) return;
    setIsRolling(true);

    try {
      const modifier = getModifier(abilityScore);
      await rollCreatureAbility({
        creature,
        abilityName,
        abilityKey,
        abilityModifier: modifier,
        showRollResult,
      });
    } finally {
      setIsRolling(false);
    }
  };

  const handleAttackRoll = async (creature, attack, event) => {
    event.stopPropagation();
    if (isRolling) return;
    setIsRolling(true);

    try {
      await rollCreatureAttackOnly({
        creature,
        attack,
        showRollResult,
      });
    } finally {
      setIsRolling(false);
    }
  };

  const handleDamageRoll = async (
    creature,
    attack,
    event,
    isCritical = false
  ) => {
    event.stopPropagation();
    if (isRolling) return;
    setIsRolling(true);

    try {
      await rollCreatureDamage({
        creature,
        attack,
        isCritical,
        showRollResult,
      });
    } finally {
      setIsRolling(false);
    }
  };

  const loadCreatures = useCallback(async () => {
    if (!supabase || !user) return;

    setIsLoading(true);
    try {
      const discordUserId = user?.user_metadata?.provider_id;
      if (!discordUserId) return;

      const { data, error } = await supabase
        .from("creatures")
        .select("*")
        .eq("discord_user_id", discordUserId)
        .order("name", { ascending: true });

      if (error) throw error;
      setCreatures(data || []);
    } catch (error) {
      console.error("Error loading creatures:", error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    loadCreatures();
  }, [loadCreatures]);

  const styles = {
    container: {
      padding: "16px",
      height: "100%",
      backgroundColor: theme.background,
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "16px",
      paddingBottom: "12px",
      borderBottom: `2px solid ${theme.border}`,
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      color: theme.text,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    creaturesList: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "12px",
    },
    creatureCard: {
      backgroundColor: theme.surface,
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      padding: "12px",
      transition: "all 0.2s ease",
    },
    creatureName: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "4px",
    },
    creatureSubtitle: {
      fontSize: "12px",
      fontStyle: "italic",
      color: theme.textSecondary,
      marginBottom: "10px",
    },
    statRow: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "8px",
      marginBottom: "10px",
    },
    statBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "6px",
      backgroundColor: theme.background,
      borderRadius: "4px",
      border: `1px solid ${theme.border}`,
    },
    statLabel: {
      fontSize: "10px",
      color: theme.textSecondary,
      marginBottom: "2px",
    },
    statValue: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.text,
    },
    abilityScores: {
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: "6px",
      marginTop: "10px",
    },
    abilityBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "4px",
      backgroundColor: theme.background,
      borderRadius: "4px",
      border: `1px solid ${theme.border}`,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    abilityBoxHover: {
      backgroundColor: theme.surface,
      borderColor: theme.primary,
      transform: "translateY(-1px)",
    },
    abilityLabel: {
      fontSize: "9px",
      color: theme.textSecondary,
      fontWeight: "600",
    },
    abilityValue: {
      fontSize: "12px",
      fontWeight: "600",
      color: theme.text,
    },
    abilityModifier: {
      fontSize: "10px",
      color: theme.textSecondary,
    },
    expandedContent: {
      marginTop: "10px",
      paddingTop: "10px",
      borderTop: `1px solid ${theme.border}`,
    },
    attacksSection: {
      padding: "10px",
      backgroundColor: theme.background,
      borderRadius: "6px",
      marginBottom: "10px",
    },
    attacksTitle: {
      fontSize: "11px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "6px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    attackItem: {
      marginBottom: "8px",
      paddingBottom: "8px",
      borderBottom: `1px solid ${theme.border}`,
      padding: "8px",
      borderRadius: "4px",
      transition: "all 0.2s ease",
    },
    attackButtons: {
      display: "flex",
      gap: "6px",
      marginTop: "6px",
    },
    attackButton: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "4px 10px",
      fontSize: "10px",
      fontWeight: "500",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    attackRollButton: {
      backgroundColor: theme.primary,
      color: "white",
    },
    damageRollButton: {
      backgroundColor: "#EF4444",
      color: "white",
    },
    attackName: {
      fontSize: "12px",
      fontWeight: "600",
      color: theme.text,
    },
    attackBonus: {
      marginLeft: "6px",
      color: theme.primary,
      fontSize: "12px",
    },
    attackDetails: {
      fontSize: "11px",
      color: theme.textSecondary,
      marginTop: "2px",
    },
    attackDescription: {
      fontSize: "10px",
      color: theme.text,
      marginTop: "4px",
      fontStyle: "italic",
    },
    description: {
      padding: "10px",
      backgroundColor: theme.background,
      borderRadius: "6px",
      fontSize: "12px",
      color: theme.text,
      whiteSpace: "pre-line",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      color: theme.textSecondary,
      fontSize: "13px",
    },
    loaderContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
    },
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loaderContainer}>
          <Loader
            size={32}
            color={theme.primary}
            style={{ animation: "spin 1s linear infinite" }}
          />
        </div>
      </div>
    );
  }

  if (creatures.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>
            <Rat size={24} color={theme.primary} />
            Creatures
          </div>
        </div>
        <div style={styles.emptyState}>
          <Rat
            size={40}
            color={theme.textSecondary}
            style={{ marginBottom: "12px" }}
          />
          <p>No creatures found. Create creatures in the Creatures section.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <Rat size={24} color={theme.primary} />
          Creatures ({creatures.length})
        </div>
      </div>

      <div style={styles.creaturesList}>
        {creatures.map((creature) => {
          return (
            <div key={creature.id} style={styles.creatureCard}>
              <div style={styles.creatureName}>{creature.name}</div>
              <div style={styles.creatureSubtitle}>
                {creature.size} {creature.type}
                {creature.alignment && `, ${creature.alignment}`}
              </div>

              <div style={styles.statRow}>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>AC</div>
                  <div style={styles.statValue}>{creature.armor_class}</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>HP</div>
                  <div style={styles.statValue}>{creature.hit_points}</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Speed</div>
                  <div style={styles.statValue}>
                    {creature.speed?.walk || 30}
                  </div>
                </div>
              </div>

              <div style={styles.abilityScores}>
                {[
                  {
                    label: "STR",
                    key: "strength",
                    name: "Strength",
                    value: creature.strength,
                  },
                  {
                    label: "DEX",
                    key: "dexterity",
                    name: "Dexterity",
                    value: creature.dexterity,
                  },
                  {
                    label: "CON",
                    key: "constitution",
                    name: "Constitution",
                    value: creature.constitution,
                  },
                  {
                    label: "INT",
                    key: "intelligence",
                    name: "Intelligence",
                    value: creature.intelligence,
                  },
                  {
                    label: "WIS",
                    key: "wisdom",
                    name: "Wisdom",
                    value: creature.wisdom,
                  },
                  {
                    label: "CHA",
                    key: "charisma",
                    name: "Charisma",
                    value: creature.charisma,
                  },
                ].map((ability) => (
                  <div
                    key={ability.key}
                    style={{
                      ...styles.abilityBox,
                      opacity: isRolling ? 0.6 : 1,
                      cursor: isRolling ? "not-allowed" : "pointer",
                    }}
                    onClick={() =>
                      !isRolling &&
                      handleAbilityClick(
                        creature,
                        ability.name,
                        ability.key,
                        ability.value
                      )
                    }
                    title={`Click to roll ${
                      ability.name
                    } check (d20 + ${getModifier(ability.value)})`}
                  >
                    <div style={styles.abilityLabel}>{ability.label}</div>
                    <div style={styles.abilityValue}>{ability.value}</div>
                    <div style={styles.abilityModifier}>
                      {getModifier(ability.value) >= 0 ? "+" : ""}
                      {getModifier(ability.value)}
                    </div>
                  </div>
                ))}
              </div>

              {creature.attacks && creature.attacks.length > 0 && (
                <div style={styles.attacksSection}>
                  <div style={styles.attacksTitle}>
                    <Sword size={12} />
                    Attacks
                  </div>
                  {creature.attacks.map((attack, idx) => (
                    <div
                      key={idx}
                      style={{
                        ...styles.attackItem,
                        borderBottom:
                          idx < creature.attacks.length - 1
                            ? `1px solid ${theme.border}`
                            : "none",
                      }}
                    >
                      <div style={styles.attackName}>
                        {attack.name}
                        {attack.attack_bonus && (
                          <span style={styles.attackBonus}>
                            +{attack.attack_bonus}
                          </span>
                        )}
                      </div>
                      <div style={styles.attackDetails}>
                        {attack.reach && `Reach ${attack.reach} ft.`}
                        {(attack.damage_quantity ||
                          attack.damage_die ||
                          attack.damage_dice) &&
                          (() => {
                            let damageString = "";
                            if (attack.damage_quantity && attack.damage_die) {
                              damageString = `${attack.damage_quantity}${attack.damage_die}`;
                              if (
                                attack.damage_modifier &&
                                attack.damage_modifier !== 0
                              ) {
                                damageString +=
                                  attack.damage_modifier > 0
                                    ? ` + ${attack.damage_modifier}`
                                    : ` - ${Math.abs(attack.damage_modifier)}`;
                              }
                            } else if (attack.damage_dice) {
                              damageString = attack.damage_dice;
                            }
                            return ` ${damageString} ${
                              attack.damage_type || ""
                            } damage`;
                          })()}
                      </div>
                      {attack.description && (
                        <div style={styles.attackDescription}>
                          {attack.description}
                        </div>
                      )}
                      <div style={styles.attackButtons}>
                        <button
                          style={{
                            ...styles.attackButton,
                            ...styles.attackRollButton,
                            opacity: isRolling ? 0.6 : 1,
                          }}
                          onClick={(e) =>
                            !isRolling && handleAttackRoll(creature, attack, e)
                          }
                          disabled={isRolling}
                          title="Roll attack (d20 + bonus)"
                        >
                          <Sword size={12} />
                          Attack
                        </button>
                        <button
                          style={{
                            ...styles.attackButton,
                            ...styles.damageRollButton,
                            opacity: isRolling ? 0.6 : 1,
                          }}
                          onClick={(e) =>
                            !isRolling && handleDamageRoll(creature, attack, e, false)
                          }
                          disabled={isRolling}
                          title="Roll damage"
                        >
                          <Zap size={12} />
                          Damage
                        </button>
                        <button
                          style={{
                            ...styles.attackButton,
                            ...styles.damageRollButton,
                            opacity: isRolling ? 0.6 : 1,
                            backgroundColor: "#F59E0B",
                          }}
                          onClick={(e) =>
                            !isRolling && handleDamageRoll(creature, attack, e, true)
                          }
                          disabled={isRolling}
                          title="Roll critical damage (double dice)"
                        >
                          <Zap size={12} />
                          Crit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {creature.description && (
                <div style={styles.description}>{creature.description}</div>
              )}

              {creature.notes && (
                <div
                  style={{
                    ...styles.description,
                    fontStyle: "italic",
                    fontSize: "11px",
                  }}
                >
                  <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                    Notes:
                  </div>
                  {creature.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreaturesPanel;
