import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { BookOpen, Zap, Target, ChevronDown, ChevronUp } from "lucide-react";
import { spellsData } from "../../SharedData/spells";

const SpellSummary = ({
  character,
  supabase,
  user,
  discordUserId,
  adminMode = false,
  isUserAdmin = false,
}) => {
  const { theme } = useTheme();
  const [spellAttempts, setSpellAttempts] = useState({});
  const [criticalSuccesses, setCriticalSuccesses] = useState({});
  const [failedAttempts, setFailedAttempts] = useState({});
  const [researchedSpells, setResearchedSpells] = useState({});
  const [arithmancticTags, setArithmancticTags] = useState({});
  const [runicTags, setRunicTags] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSpells, setExpandedSpells] = useState({});

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

        // Handle empty data gracefully
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

  const spellStats = useMemo(() => {
    const stats = {
      mastered: [],
      attempted: [],
      failed: [],
    };

    if (!spellsData || isLoading) return stats;

    // Get all available spells
    const allSpells = [];
    Object.values(spellsData).forEach((subjectData) => {
      Object.values(subjectData.levels).forEach((spells) => {
        spells.forEach((spell) => {
          allSpells.push(spell);
        });
      });
    });

    // Categorize spells based on progress
    const spellProgressNames = Object.keys(spellAttempts);
    let matchCount = 0;

    allSpells.forEach((spell) => {
      const spellName = spell.name;
      const attempts = spellAttempts[spellName] || {};

      // Track matches for debugging
      if (Object.keys(attempts).length > 0) {
        matchCount++;
      }

      // Check if mastered (both attempt 1 and 2 successful)
      const isMastered = attempts[1] && attempts[2];

      if (isMastered) {
        stats.mastered.push(spell);
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
      padding: "12px",
      backgroundColor: theme.background,
      border: `1px solid ${theme.border}`,
      borderRadius: "4px",
      fontSize: "12px",
    },
    spellDetailRow: {
      marginBottom: "6px",
      lineHeight: "1.4",
      color: theme.text,
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
              <div style={styles.sectionTitle}>
                <Zap size={14} style={{ color: theme.success }} />
                Mastered Spells ({spellStats.mastered.length})
              </div>
              <div style={styles.spellGrid}>
                {spellStats.mastered.map((spell) => (
                  <div key={`mastered-${spell.name}`}>
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
                      <span style={{ marginLeft: "auto", fontSize: "10px" }}>
                        {expandedSpells[spell.name] ? "▼" : "▶"}
                      </span>
                    </div>
                    {expandedSpells[spell.name] && (
                      <div style={styles.spellDetails}>
                        <div style={styles.spellDetailRow}>
                          <strong>Level:</strong> {spell.level}
                        </div>
                        <div style={styles.spellDetailRow}>
                          <strong>Casting Time:</strong> {spell.castingTime}
                        </div>
                        <div style={styles.spellDetailRow}>
                          <strong>Range:</strong> {spell.range}
                        </div>
                        <div style={styles.spellDetailRow}>
                          <strong>Duration:</strong> {spell.duration}
                        </div>
                        <div style={styles.spellDetailRow}>
                          <strong>Description:</strong> {spell.description}
                        </div>
                        {spell.higherLevels && (
                          <div style={styles.spellDetailRow}>
                            <strong>At Higher Levels:</strong>{" "}
                            {spell.higherLevels}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                    Debug: Loaded {Object.keys(spellAttempts).length} spells
                    from database
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
