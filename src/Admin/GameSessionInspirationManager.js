import React, { useState, useEffect, useCallback } from "react";
import {
  Star,
  Users,
  Gamepad2,
  Plus,
  Loader,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { getDiscordWebhook, gameSessionOptions } from "../App/const";

const GameSessionInspirationManager = ({ supabase }) => {
  const { theme } = useTheme();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(new Set());
  const [selectedSession, setSelectedSession] = useState("all");

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: theme.background,
      minHeight: "100vh",
    },
    header: {
      marginBottom: "24px",
      textAlign: "center",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: theme.text,
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
    },
    subtitle: {
      fontSize: "16px",
      color: theme.textSecondary,
      margin: "0",
    },
    controls: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      padding: "16px",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
    },
    sessionFilter: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    select: {
      padding: "8px 12px",
      borderRadius: "8px",
      border: `2px solid ${theme.border}`,
      backgroundColor: theme.surface,
      color: theme.text,
      fontSize: "14px",
      minWidth: "200px",
    },
    refreshButton: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: `2px solid ${theme.primary}`,
      backgroundColor: theme.primary,
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      color: theme.text,
    },
    sessionCard: {
      backgroundColor: theme.surface,
      borderRadius: "16px",
      border: `2px solid ${theme.border}`,
      marginBottom: "24px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    sessionHeader: {
      padding: "20px",
      backgroundColor: theme.text,
      color: theme.secondary,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sessionTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      margin: "0",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    sessionStats: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      fontSize: "14px",
    },
    characterGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "16px",
      padding: "20px",
    },
    characterCard: {
      padding: "16px",
      backgroundColor: theme.background,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      transition: "all 0.2s ease",
    },
    characterHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    characterName: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      margin: "0",
    },
    characterLevel: {
      fontSize: "12px",
      color: theme.textSecondary,
      backgroundColor: theme.surface,
      padding: "4px 8px",
      borderRadius: "6px",
    },
    inspirationStatus: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "12px",
    },
    inspirationBadge: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: "600",
    },
    hasInspiration: {
      backgroundColor: "#f59e0b",
      color: "white",
    },
    noInspiration: {
      backgroundColor: theme.surface,
      color: theme.textSecondary,
      border: `1px solid ${theme.border}`,
    },
    grantButton: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#10b981",
      color: "white",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease",
      width: "100%",
      justifyContent: "center",
    },
    grantButtonDisabled: {
      backgroundColor: theme.surface,
      color: theme.textSecondary,
      cursor: "not-allowed",
      border: `1px solid ${theme.border}`,
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: theme.textSecondary,
    },
    errorState: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#ef4444",
      backgroundColor: "#fef2f2",
      borderRadius: "12px",
      border: "2px solid #fecaca",
      margin: "20px 0",
    },
    loadingState: {
      textAlign: "center",
      padding: "60px 20px",
      color: theme.textSecondary,
    },
  };

  const loadGameSessionsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: characters, error: charactersError } = await supabase
        .from("characters")
        .select(
          `
          id,
          name,
          level,
          game_session,
          discord_user_id,
          active,
          archived_at,
          character_resources (
            inspiration
          )
        `
        )
        .eq("active", true)
        .order("game_session")
        .order("name");

      if (charactersError) {
        throw charactersError;
      }

      const sessionsMap = new Map();

      characters.forEach((character) => {
        if (
          !character.game_session ||
          character.game_session.trim() === "" ||
          character.game_session.toLowerCase() === "development"
        ) {
          return;
        }

        const sessionName = character.game_session;

        if (!sessionsMap.has(sessionName)) {
          sessionsMap.set(sessionName, {
            name: sessionName,
            characters: [],
            totalCharacters: 0,
            withInspiration: 0,
          });
        }

        const session = sessionsMap.get(sessionName);
        const hasInspiration =
          character.character_resources?.[0]?.inspiration || false;

        session.characters.push({
          ...character,
          hasInspiration,
        });

        session.totalCharacters++;
        if (hasInspiration) {
          session.withInspiration++;
        }
      });

      const sessionsArray = Array.from(sessionsMap.values())
        .map((session) => ({
          ...session,
          characters: session.characters.sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        }))
        .sort((a, b) => {
          const today = new Date().getDay();

          const dayMap = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
          };

          const getDayFromSession = (sessionName) => {
            const dayPart = sessionName.split(" - ")[0];
            return dayMap[dayPart];
          };

          const dayA = getDayFromSession(a.name);
          const dayB = getDayFromSession(b.name);

          if (dayA === undefined && dayB === undefined) {
            return a.name.localeCompare(b.name);
          }
          if (dayA === undefined) return 1;
          if (dayB === undefined) return -1;

          const getPriority = (day) => {
            return (day - today + 7) % 7;
          };

          const priorityA = getPriority(dayA);
          const priorityB = getPriority(dayB);

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          const indexA = gameSessionOptions.indexOf(a.name);
          const indexB = gameSessionOptions.indexOf(b.name);

          if (indexA === -1) return 1;
          if (indexB === -1) return -1;

          return indexA - indexB;
        });

      setSessions(sessionsArray);
    } catch (err) {
      console.error("Error loading game sessions data:", err);
      setError(err.message || "Failed to load game sessions data");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const grantInspiration = async (
    characterId,
    discordUserId,
    characterName,
    gameSession
  ) => {
    const updateKey = `${characterId}-${discordUserId}`;
    setUpdating((prev) => new Set(prev).add(updateKey));

    try {
      const { error: updateError } = await supabase
        .from("character_resources")
        .upsert(
          {
            character_id: characterId,
            discord_user_id: discordUserId,
            inspiration: true,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "character_id,discord_user_id",
          }
        );

      if (updateError) {
        throw updateError;
      }

      const discordWebhookUrl = getDiscordWebhook(gameSession);
      if (discordWebhookUrl) {
        const embed = {
          title: `${characterName} - Inspiration Granted by Admin`,
          color: 0x10b981,
          fields: [
            {
              name: "Status",
              value: "✨ Gained Inspiration!",
              inline: true,
            },
            {
              name: "Granted by",
              value: "Admin Dashboard",
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Admin Action",
          },
        };

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
          });
        } catch (discordError) {
          console.error("Error sending Discord notification:", discordError);
        }
      }

      setSessions((prevSessions) =>
        prevSessions.map((session) => ({
          ...session,
          characters: session.characters.map((char) =>
            char.id === characterId ? { ...char, hasInspiration: true } : char
          ),
          withInspiration: session.characters.filter((char) =>
            char.id === characterId ? true : char.hasInspiration
          ).length,
        }))
      );
    } catch (err) {
      console.error("Error granting inspiration:", err);
      alert(`Failed to grant inspiration: ${err.message}`);
    } finally {
      setUpdating((prev) => {
        const newSet = new Set(prev);
        newSet.delete(updateKey);
        return newSet;
      });
    }
  };

  useEffect(() => {
    loadGameSessionsData();
  }, [loadGameSessionsData]);

  const filteredSessions =
    selectedSession === "all"
      ? sessions
      : sessions.filter((session) => session.name === selectedSession);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <Loader className="animate-spin" size={48} color={theme.primary} />
          <h3 style={{ marginTop: "16px", color: theme.text }}>
            Loading game sessions...
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorState}>
          <AlertCircle size={48} />
          <h3 style={{ marginTop: "16px" }}>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={loadGameSessionsData} style={styles.refreshButton}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <Star size={32} />
          Game Session Inspiration Manager
        </h1>
        <p style={styles.subtitle}>
          View and manage character inspiration across all game sessions
        </p>
      </div>

      <div style={styles.controls}>
        <div style={styles.sessionFilter}>
          <label style={{ color: theme.text, fontWeight: "600" }}>
            Filter by Session:
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Sessions</option>
            {gameSessionOptions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>
        <button onClick={loadGameSessionsData} style={styles.refreshButton}>
          <RefreshCw size={16} />
          Refresh Data
        </button>
      </div>

      {filteredSessions.length === 0 ? (
        <div style={styles.emptyState}>
          <Users size={48} color={theme.textSecondary} />
          <h3 style={{ marginTop: "16px", color: theme.text }}>
            No Characters Found
          </h3>
          <p>No characters found for the selected session filter.</p>
        </div>
      ) : (
        filteredSessions.map((session) => (
          <div key={session.name} style={styles.sessionCard}>
            <div style={styles.sessionHeader}>
              <h2 style={styles.sessionTitle}>
                <Gamepad2 size={24} />
                {session.name}
              </h2>
              <div style={styles.sessionStats}>
                <span>
                  <Users size={16} style={{ marginRight: "4px" }} />
                  {session.totalCharacters} characters
                </span>
                <span>
                  <Star size={16} style={{ marginRight: "4px" }} />
                  {session.withInspiration} with inspiration
                </span>
              </div>
            </div>

            {session.characters.length === 0 ? (
              <div style={{ ...styles.emptyState, padding: "40px 20px" }}>
                <p>No characters in this session.</p>
              </div>
            ) : (
              <div style={styles.characterGrid}>
                {session.characters.map((character) => {
                  const updateKey = `${character.id}-${character.discord_user_id}`;
                  const isUpdating = updating.has(updateKey);

                  return (
                    <div key={character.id} style={styles.characterCard}>
                      <div style={styles.characterHeader}>
                        <h3 style={styles.characterName}>{character.name}</h3>
                        <span style={styles.characterLevel}>
                          Level {character.level}
                        </span>
                      </div>

                      <div style={styles.inspirationStatus}>
                        <div
                          style={{
                            ...styles.inspirationBadge,
                            ...(character.hasInspiration
                              ? styles.hasInspiration
                              : styles.noInspiration),
                          }}
                        >
                          <Star
                            size={14}
                            fill={character.hasInspiration ? "white" : "none"}
                          />
                          {character.hasInspiration
                            ? "Has Inspiration"
                            : "No Inspiration"}
                        </div>
                      </div>

                      {!character.hasInspiration && (
                        <button
                          onClick={() =>
                            grantInspiration(
                              character.id,
                              character.discord_user_id,
                              character.name,
                              character.game_session
                            )
                          }
                          disabled={isUpdating}
                          style={{
                            ...styles.grantButton,
                            ...(isUpdating ? styles.grantButtonDisabled : {}),
                          }}
                        >
                          {isUpdating ? (
                            <Loader size={14} className="animate-spin" />
                          ) : (
                            <Plus size={14} />
                          )}
                          {isUpdating ? "Granting..." : "Grant Inspiration"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GameSessionInspirationManager;
