import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const CACHE_KEY = "spells_cache";
const CACHE_TTL = 60 * 60 * 1000;

const SpellsContext = createContext(null);

function getCachedSpells() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { spells, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_TTL;

    if (isExpired) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }

    return spells;
  } catch (e) {
    console.warn("Error reading spells cache:", e);
    sessionStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function setCachedSpells(spells) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        spells,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.warn("Error saving spells cache:", e);
  }
}

export function clearSpellsCache() {
  sessionStorage.removeItem(CACHE_KEY);
}

export function SpellsProvider({ children }) {
  const [spells, setSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const fetchSpells = async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cachedSpells = getCachedSpells();
      if (cachedSpells && cachedSpells.length > 0) {
        setSpells(cachedSpells);
        setLoading(false);
        setInitialized(true);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("spells")
        .select("*")
        .order("school")
        .order("name");

      if (fetchError) throw fetchError;

      const spellsData = data || [];

      setSpells(spellsData);
      setCachedSpells(spellsData);
    } catch (err) {
      console.error("Error fetching spells:", err);
      setError(err.message);

      const staleCache = sessionStorage.getItem(CACHE_KEY);
      if (staleCache) {
        try {
          const { spells: staleSpells } = JSON.parse(staleCache);
          setSpells(staleSpells);
        } catch (e) {}
      }
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    fetchSpells();
  }, []);

  const getSpellByName = (name) => {
    return spells.find((spell) => spell.name === name);
  };

  const searchSpells = (searchTerm) => {
    if (!searchTerm) return spells;
    const term = searchTerm.toLowerCase();
    return spells.filter(
      (spell) =>
        spell.name?.toLowerCase().includes(term) ||
        spell.description?.toLowerCase().includes(term) ||
        spell.school?.toLowerCase().includes(term)
    );
  };

  const getSpellsBySchool = (school) => {
    if (!school) return spells;
    return spells.filter((spell) => spell.school === school);
  };

  const getSpellsByLevel = (level) => {
    if (level === undefined || level === null) return spells;
    return spells.filter((spell) => spell.level === level);
  };

  const getSpellsByYear = (year) => {
    if (!year) return spells;
    return spells.filter((spell) => spell.year <= year);
  };

  const spellsBySchool = spells.reduce((acc, spell) => {
    if (!acc[spell.school]) {
      acc[spell.school] = [];
    }
    acc[spell.school].push(spell);
    return acc;
  }, {});

  const spellsByLevel = spells.reduce((acc, spell) => {
    if (!acc[spell.level]) {
      acc[spell.level] = [];
    }
    acc[spell.level].push(spell);
    return acc;
  }, {});

  const value = {
    spells,
    spellsBySchool,
    spellsByLevel,
    loading,
    error,
    initialized,
    refetch: () => fetchSpells(true),
    getSpellByName,
    searchSpells,
    getSpellsBySchool,
    getSpellsByLevel,
    getSpellsByYear,
  };

  return (
    <SpellsContext.Provider value={value}>{children}</SpellsContext.Provider>
  );
}

export function useSpellsContext() {
  const context = useContext(SpellsContext);
  if (!context) {
    throw new Error("useSpellsContext must be used within a SpellsProvider");
  }
  return context;
}

export function useSpells() {
  const context = useContext(SpellsContext);

  if (!context) {
    throw new Error(
      "useSpells must be used within a SpellsProvider. " +
        "Make sure the app is wrapped with <SpellsProvider>."
    );
  }

  return context;
}

export function getSpellsSync() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return [];

    const { spells } = JSON.parse(cached);
    return spells || [];
  } catch (e) {
    console.warn("Error reading spells cache synchronously:", e);
    return [];
  }
}

export function getSpellByNameSync(name) {
  const spells = getSpellsSync();
  return spells.find((spell) => spell.name === name);
}

export default SpellsContext;
