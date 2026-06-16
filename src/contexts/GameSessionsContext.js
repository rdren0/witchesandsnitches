import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { gameSessionService } from "../services/gameSessionService";
import {
  gameSessionGroups as fallbackGroups,
  setGameSessionWebhookCache,
} from "../App/const";

const GameSessionsContext = createContext(null);

const CATEGORY_ORDER = ["haunting", "knights", "other", "development"];

const CATEGORY_LABELS = {
  haunting: "Haunting",
  knights: "Knights",
  other: "Other",
  development: "Development",
};

const labelForCategory = (category) =>
  CATEGORY_LABELS[category] ||
  category.charAt(0).toUpperCase() + category.slice(1);

// Builds the { haunting, knights, other, development } shape the existing
// grouped dropdowns expect from a flat list of session rows.
const groupByCategory = (sessions) => {
  const groups = { haunting: [], knights: [], other: [], development: [] };
  sessions.forEach((session) => {
    const category = CATEGORY_ORDER.includes(session.category)
      ? session.category
      : "other";
    groups[category].push(session.name);
  });
  return groups;
};

// Ordered list of every category that actually has sessions — known
// categories first (in CATEGORY_ORDER), then any custom ones alphabetically.
// Used by dropdowns that should surface admin-created custom categories
// instead of folding them into "Other".
const categorize = (sessions) => {
  const byCategory = new Map();
  sessions.forEach((session) => {
    const category = session.category || "other";
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category).push(session.name);
  });

  const known = CATEGORY_ORDER.filter((c) => byCategory.has(c));
  const custom = [...byCategory.keys()]
    .filter((c) => !CATEGORY_ORDER.includes(c))
    .sort();

  return [...known, ...custom].map((category) => ({
    category,
    label: labelForCategory(category),
    isCustom: !CATEGORY_ORDER.includes(category),
    sessions: byCategory.get(category),
  }));
};

export function GameSessionsProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Admin UI needs archived rows too; dropdowns filter them out via
      // `activeSessions`. Webhook cache only receives active sessions.
      const data = await gameSessionService.getGameSessions({
        includeArchived: true,
      });

      setSessions(data);
      setUsingFallback(false);
      setGameSessionWebhookCache(data.filter((s) => !s.archived));
    } catch (err) {
      console.error("Error loading game sessions:", err);
      setError(err.message);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const activeSessions = useMemo(
    () => sessions.filter((s) => !s.archived),
    [sessions]
  );

  // When the DB load fails, fall back to the hardcoded const groups so the app
  // (character creation, filters, etc.) keeps working. Memoized so consumers can
  // safely list it in effect/callback dependency arrays without re-running.
  const groupedSessions = useMemo(
    () => (usingFallback ? fallbackGroups : groupByCategory(activeSessions)),
    [usingFallback, activeSessions]
  );

  // Ordered, dynamic category list (includes custom categories). Falls back to
  // deriving from the hardcoded groups when the DB load fails.
  const categorizedSessions = useMemo(() => {
    if (!usingFallback) return categorize(activeSessions);
    return CATEGORY_ORDER.filter((c) => fallbackGroups[c]?.length).map(
      (category) => ({
        category,
        label: labelForCategory(category),
        isCustom: false,
        sessions: fallbackGroups[category],
      })
    );
  }, [usingFallback, activeSessions]);

  const value = useMemo(
    () => ({
      sessions,
      activeSessions,
      groupedSessions,
      categorizedSessions,
      loading,
      error,
      usingFallback,
      refresh,
    }),
    [
      sessions,
      activeSessions,
      groupedSessions,
      categorizedSessions,
      loading,
      error,
      usingFallback,
      refresh,
    ]
  );

  return (
    <GameSessionsContext.Provider value={value}>
      {children}
    </GameSessionsContext.Provider>
  );
}

export function useGameSessions() {
  const context = useContext(GameSessionsContext);
  if (!context) {
    // Graceful degradation if a consumer renders outside the provider.
    return {
      sessions: [],
      activeSessions: [],
      groupedSessions: fallbackGroups,
      categorizedSessions: [],
      loading: false,
      error: null,
      usingFallback: true,
      refresh: () => {},
    };
  }
  return context;
}

export default GameSessionsContext;
