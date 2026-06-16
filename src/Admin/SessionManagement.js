import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Calendar,
  Gamepad2,
  Loader,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Star,
  ChevronDown,
  ChevronRight,
  Archive,
  Settings,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useGameSessions } from "../contexts/GameSessionsContext";
import GameSessionManager from "./GameSessionManager";

const SessionManagement = ({ supabase }) => {
  const { theme } = useTheme();
  const { groupedSessions } = useGameSessions();
  const [characters, setCharacters] = useState([]);
  const [gameSessions, setGameSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState("all");
  const [expandedArchived, setExpandedArchived] = useState(new Set());
  const [showManager, setShowManager] = useState(false);
  const [stats, setStats] = useState({
    totalCharacters: 0,
    activeUsers: 0,
    totalSessions: 0,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: charactersData, error: charactersError } = await supabase
        .from("characters")
        .select(
          `
          id,
          name,
          level,
          game_session,
          discord_user_id,
          house,
          subclass,
          background,
          casting_style,
          hit_points,
          current_hit_points,
          current_hit_dice,
          created_at,
          active,
          character_resources (
            inspiration,
            corruption_points
          )
        `
        )
        .order("game_session")
        .order("name")
        .limit(400);

      if (charactersError) {
        throw charactersError;
      }

      setCharacters(charactersData);

      const sessionGroups = groupCharactersBySession(charactersData);
      setGameSessions(sessionGroups);

      // Stats reflect active characters only.
      const validCharacters = charactersData.filter(
        (char) =>
          char.active &&
          char.game_session &&
          char.game_session.trim() !== "" &&
          char.game_session.toLowerCase() !== "development"
      );

      const uniqueUsers = new Set(
        validCharacters.map((c) => c.discord_user_id)
      );
      const uniqueSessions = new Set(
        validCharacters.map((c) => c.game_session)
      );

      setStats({
        totalCharacters: validCharacters.length,
        activeUsers: uniqueUsers.size,
        totalSessions: uniqueSessions.size,
      });
    } catch (err) {
      console.error("Error loading session data:", err);
      setError(err.message || "Failed to load session data");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const groupCharactersBySession = (characters) => {
    const validCharacters = characters.filter(
      (char) =>
        char.game_session &&
        char.game_session.trim() !== "" &&
        char.game_session.toLowerCase() !== "development"
    );

    const grouped = validCharacters.reduce((acc, character) => {
      const sessionName = character.game_session;
      if (!acc[sessionName]) {
        acc[sessionName] = [];
      }

      const characterResources =
        character.character_resources?.find(
          (r) => r.discord_user_id === character.discord_user_id
        ) ||
        character.character_resources?.[0] ||
        {};

      acc[sessionName].push({
        id: character.id,
        name: character.name,
        level: character.level,
        house: character.house || "No House",
        subclass: character.subclass || "No Subclass",
        background: character.background || "No Background",
        castingStyle: character.casting_style || "Unknown",
        hitPoints: character.current_hit_points || character.hit_points || 0,
        maxHitPoints: character.hit_points || 0,
        currentHitDice: character.current_hit_dice || character.level || 0,
        maxHitDice: character.level || 0,
        inspiration: characterResources.inspiration || false,
        corruptionPoints:
          characterResources.corruption_points ||
          character.corruption_points ||
          0,
        discord_user_id: character.discord_user_id,
        created_at: character.created_at,
        active: character.active !== false,
      });
      return acc;
    }, {});

    const sessions = Object.entries(grouped).map(
      ([sessionName, sessionCharacters]) => {
        const sortByName = (a, b) => a.name.localeCompare(b.name);
        const activeCharacters = sessionCharacters
          .filter((char) => char.active)
          .sort(sortByName);
        const archivedCharacters = sessionCharacters
          .filter((char) => !char.active)
          .sort(sortByName);

        const avgLevel = activeCharacters.length
          ? Math.round(
              activeCharacters.reduce((sum, char) => sum + char.level, 0) /
                activeCharacters.length
            )
          : 0;

        return {
          id: sessionName,
          name: sessionName,
          characters: activeCharacters,
          archivedCharacters,
          characterCount: activeCharacters.length,
          archivedCount: archivedCharacters.length,
          lastActivity: sessionCharacters.reduce(
            (latest, char) =>
              new Date(char.created_at) > new Date(latest)
                ? char.created_at
                : latest,
            sessionCharacters[0]?.created_at
          ),
          avgLevel,
          totalInspiration: activeCharacters.filter((char) => char.inspiration)
            .length,
        };
      }
    );

    return sortSessionsByDayOfWeek(sessions);
  };

  const sortSessionsByDayOfWeek = (sessions) => {
    const dayOrder = {
      sunday: 0,
      sun: 0,
      monday: 1,
      mon: 1,
      tuesday: 2,
      tue: 2,
      tues: 2,
      wednesday: 3,
      wed: 3,
      thursday: 4,
      thu: 4,
      thur: 4,
      thurs: 4,
      friday: 5,
      fri: 5,
      saturday: 6,
      sat: 6,
    };

    const getSessionDayOrder = (sessionName) => {
      const lowerName = sessionName.toLowerCase();
      for (const [dayName, order] of Object.entries(dayOrder)) {
        const regex = new RegExp(`\\b${dayName}\\b`, "i");
        if (regex.test(lowerName)) {
          return order;
        }
      }
      return 999;
    };

    return sessions.sort((a, b) => {
      const dayA = getSessionDayOrder(a.name);
      const dayB = getSessionDayOrder(b.name);

      if (dayA !== dayB) {
        return dayA - dayB;
      }
      return a.name.localeCompare(b.name);
    });
  };

  const getHouseColor = (house) => {
    const houseColors = {
      Gryffindor: "#740001",
      Slytherin: "#1a472a",
      Ravenclaw: "#0e1a40",
      Hufflepuff: "#ecb939",
      Thunderbird: "#8B5A2B",
      "Horned Serpent": "#1E3A8A",
      Pukwudgie: "#7C2D12",
      Wampus: "#6D28D9",
      Beauxbatons: "#4F8FFF",
      Durmstrang: "#8B0000",
      Uagadou: "#CD853F",
      Mahoutokoro: "#DC143C",
      Castelobruxo: "#228B22",
      Koldovstoretz: "#4682B4",
    };

    if (!house || house === "No House") {
      return theme.textSecondary;
    }

    return houseColors[house] || theme.primary;
  };

  const getHealthBarColor = (currentHP, maxHP) => {
    const percentage = (currentHP / maxHP) * 100;
    if (percentage >= 75) return "#10b981";
    if (percentage >= 50) return "#f59e0b";
    if (percentage >= 25) return "#f97316";
    return "#ef4444";
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Merge character-derived session cards with the configured sessions from the
  // DB so that sessions with no characters (or only archived ones) still show a
  // collapsed "No active characters" card.
  const allSessionCards = (() => {
    const cardsByName = new Map(gameSessions.map((s) => [s.name, s]));
    const configuredNames = [
      ...groupedSessions.haunting,
      ...groupedSessions.knights,
      ...groupedSessions.other,
    ];
    configuredNames.forEach((name) => {
      if (!cardsByName.has(name)) {
        cardsByName.set(name, {
          id: name,
          name,
          characters: [],
          archivedCharacters: [],
          characterCount: 0,
          archivedCount: 0,
          lastActivity: null,
          avgLevel: 0,
          totalInspiration: 0,
        });
      }
    });
    return sortSessionsByDayOfWeek(Array.from(cardsByName.values()));
  })();

  const filteredSessions =
    selectedSession === "all"
      ? allSessionCards
      : allSessionCards.filter((session) => session.name === selectedSession);

  const toggleSetMember = (setter, key) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

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
      color: theme.text,
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s ease",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "20px",
      marginBottom: "30px",
    },
    statCard: {
      backgroundColor: theme.surface,
      padding: "20px",
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      textAlign: "center",
    },
    statNumber: {
      fontSize: "32px",
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: "8px",
    },
    statLabel: {
      fontSize: "14px",
      color: theme.textSecondary,
    },
    sessionGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "24px",
      marginTop: "20px",
      justifyContent: "center",
      alignItems: "flex-start",
    },
    sessionCard: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      padding: "20px",
      transition: "all 0.2s ease",
      minHeight: "400px",
    },
    sessionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "16px",
      paddingBottom: "12px",
      borderBottom: `1px solid ${theme.border}`,
    },
    sessionTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      color: theme.text,
      marginBottom: "8px",
    },
    sessionMeta: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "4px",
      color: theme.textSecondary,
      fontSize: "12px",
    },
    sessionStats: {
      display: "flex",
      gap: "16px",
      marginBottom: "16px",
      padding: "12px",
      backgroundColor: theme.background,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
    },
    sessionStat: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "12px",
      color: theme.textSecondary,
    },
    charactersList: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    characterItem: {
      display: "grid",
      gridTemplateColumns: "180px 30px 100px 120px 150px 220px 130px 1fr",
      alignItems: "center",
      padding: "10px 12px",
      backgroundColor: theme.background,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
      fontSize: "12px",
      gap: "8px",
    },
    characterHeader: {
      display: "grid",
      gridTemplateColumns: "180px 30px 100px 120px 150px 220px 130px 1fr",
      alignItems: "center",
      padding: "8px 12px",
      backgroundColor: theme.primary + "15",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
      gap: "8px",
    },
    characterName: {
      fontWeight: "600",
      color: theme.text,
      textAlign: "left",
    },
    characterLevel: {
      color: theme.primary,
      fontWeight: "500",
      textAlign: "center",
    },
    casting: {
      color: theme.textSecondary,
      fontWeight: "500",
      textAlign: "center",
    },
    characterHouse: {
      padding: "2px 6px",
      borderRadius: "10px",
      fontSize: "10px",
      fontWeight: "500",
      color: theme.text,
      textAlign: "center",
      justifySelf: "center",
    },
    characterHP: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2px",
    },
    hpBar: {
      width: "100%",
      height: "4px",
      backgroundColor: theme.border,
      borderRadius: "2px",
      overflow: "hidden",
    },
    hpFill: {
      height: "100%",
      borderRadius: "2px",
      transition: "width 0.3s ease",
    },
    characterSubclass: {
      color: theme.textSecondary,
      textAlign: "center",
      fontSize: "11px",
    },
    characterBackground: {
      color: theme.textSecondary,
      textAlign: "center",
      fontSize: "10px",
    },
    inspirationIndicator: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "10px",
    },
    hasInspiration: {
      backgroundColor: "#f59e0b",
      color: "white",
    },
    noInspiration: {
      backgroundColor: theme.border,
      color: theme.textSecondary,
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: theme.textSecondary,
    },
    noActiveCharacters: {
      padding: "16px",
      textAlign: "center",
      color: theme.textSecondary,
      fontSize: "14px",
      fontStyle: "italic",
    },
    emptySessionWrap: {
      flexBasis: "100%",
      width: "100%",
    },
    emptySessionBar: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "12px 16px",
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
    },
    emptyBarTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      color: theme.text,
    },
    emptyBarSub: {
      fontSize: "13px",
      fontStyle: "italic",
      color: theme.textSecondary,
    },
    archivedToggle: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginTop: "12px",
      background: "none",
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      padding: "8px 12px",
      color: theme.textSecondary,
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      width: "100%",
      justifyContent: "center",
    },
    archivedList: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      marginTop: "8px",
      opacity: 0.7,
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

  const renderCharacterRow = (character) => (
    <div key={character.id} style={styles.characterItem}>
      <span style={styles.characterName}>{character.name}</span>
      <span style={styles.characterLevel}>{character.level}</span>
      <span style={styles.casting}>{character.castingStyle}</span>
      <span
        style={{
          ...styles.characterHouse,
          border: `1px solid ${getHouseColor(character.house)}`,
        }}
      >
        {character.house === "No House" ? "—" : character.house}
      </span>
      <div style={styles.characterHP}>
        <span style={{ fontSize: "10px", color: theme.text }}>
          {character.hitPoints}/{character.maxHitPoints}
        </span>
        <div style={styles.hpBar}>
          <div
            style={{
              ...styles.hpFill,
              width: `${
                (character.hitPoints / character.maxHitPoints) * 100
              }%`,
              backgroundColor: getHealthBarColor(
                character.hitPoints,
                character.maxHitPoints
              ),
            }}
          />
        </div>
      </div>
      <span style={styles.characterSubclass}>
        {character.subclass === "No Subclass" ? "—" : character.subclass}
      </span>
      <span style={styles.characterBackground}>
        {character.background === "No Background" ? "—" : character.background}
      </span>
      <div style={{ ...styles.inspirationIndicator }}>
        <Star
          fill={character.inspiration ? "#f59e0b" : "transparent"}
          color={character.inspiration ? "#f59e0b" : "white"}
        />
      </div>
    </div>
  );

  const renderCharacterTable = (characters) => (
    <div style={styles.charactersList}>
      <div style={styles.characterHeader}>
        <span>Name</span>
        <span style={{ textAlign: "center" }}>Level</span>
        <span style={{ textAlign: "center" }}>Casting</span>
        <span style={{ textAlign: "center" }}>House</span>
        <span style={{ textAlign: "center" }}>HP</span>
        <span style={{ textAlign: "center" }}>Subclass</span>
        <span style={{ textAlign: "center" }}>Background</span>
        <span style={{ textAlign: "center" }}>✨Inspo✨</span>
      </div>
      {characters.map(renderCharacterRow)}
    </div>
  );

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <Loader className="animate-spin" size={48} color={theme.primary} />
          <h3 style={{ marginTop: "16px", color: theme.text }}>
            Loading session data...
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
          <button onClick={loadData} style={styles.refreshButton}>
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
          <Gamepad2 size={32} />
          Session Management
        </h1>
        <p style={styles.subtitle}>
          View and manage characters across all game sessions
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

            <optgroup label="Haunting Sessions">
              {groupedSessions.haunting.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </optgroup>

            <option disabled>──────────</option>

            <optgroup label="Knights Sessions">
              {groupedSessions.knights.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </optgroup>

            <option disabled>──────────</option>

            <optgroup label="Other Sessions">
              {groupedSessions.other.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </optgroup>

            <option disabled>──────────</option>

            {groupedSessions.development.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowManager(true)}
          style={styles.refreshButton}
        >
          <Settings size={16} />
          Manage Sessions
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalCharacters}</div>
          <div style={styles.statLabel}>Total Characters</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.activeUsers}</div>
          <div style={styles.statLabel}>Active Users</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalSessions}</div>
          <div style={styles.statLabel}>Game Sessions</div>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div style={styles.emptyState}>
          <Users size={48} color={theme.textSecondary} />
          <h3 style={{ marginTop: "16px", color: theme.text }}>
            No Sessions Found
          </h3>
          <p>No characters found for the selected session filter.</p>
        </div>
      ) : (
        <div style={styles.sessionGrid}>
          {filteredSessions.map((session) =>
            session.characterCount === 0 ? (
              <div key={session.id} style={styles.emptySessionWrap}>
                <div style={styles.emptySessionBar}>
                  <span style={styles.emptyBarTitle}>{session.name}</span>
                  <span style={styles.emptyBarSub}>No active characters</span>
                  {session.archivedCount > 0 && (
                    <button
                      style={{ ...styles.archivedToggle, marginTop: 0, marginLeft: "auto" }}
                      onClick={() =>
                        toggleSetMember(setExpandedArchived, session.id)
                      }
                    >
                      {expandedArchived.has(session.id) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                      <Archive size={14} />
                      Archived characters ({session.archivedCount})
                    </button>
                  )}
                </div>
                {session.archivedCount > 0 &&
                  expandedArchived.has(session.id) && (
                    <div style={styles.archivedList}>
                      {renderCharacterTable(session.archivedCharacters)}
                    </div>
                  )}
              </div>
            ) : (
              <div key={session.id} style={styles.sessionCard}>
              <div style={styles.sessionHeader}>
                <div>
                  <div style={styles.sessionTitle}>{session.name}</div>
                  <div style={styles.sessionStats}>
                    <div style={styles.sessionStat}>
                      <Users size={12} />
                      {session.characterCount} chars
                    </div>
                    <div style={styles.sessionStat}>
                      <BarChart3 size={12} />
                      Avg Lv. {session.avgLevel}
                    </div>
                    <div style={styles.sessionStat}>
                      <span style={{ color: "#f59e0b" }}>✨</span>
                      {session.totalInspiration} inspired
                    </div>
                  </div>
                </div>
                <div style={styles.sessionMeta}>
                  {session.lastActivity && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Calendar size={12} />
                      {new Date(session.lastActivity).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {session.characterCount > 0 ? (
                renderCharacterTable(session.characters)
              ) : (
                <div style={styles.noActiveCharacters}>
                  No active characters
                </div>
              )}

              {session.archivedCount > 0 && (
                <>
                  <button
                    style={styles.archivedToggle}
                    onClick={() =>
                      toggleSetMember(setExpandedArchived, session.id)
                    }
                  >
                    {expandedArchived.has(session.id) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    <Archive size={14} />
                    Archived characters ({session.archivedCount})
                  </button>
                  {expandedArchived.has(session.id) && (
                    <div style={styles.archivedList}>
                      {renderCharacterTable(session.archivedCharacters)}
                    </div>
                  )}
                </>
              )}
              </div>
            )
          )}
        </div>
      )}

      <GameSessionManager
        isOpen={showManager}
        onClose={() => setShowManager(false)}
      />
    </div>
  );
};

export default SessionManagement;
