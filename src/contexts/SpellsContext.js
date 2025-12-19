import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const SpellsContext = createContext(null);

// In-memory cache - cleared on page refresh
let inMemoryCache = null;

export function clearSpellsCache() {
  inMemoryCache = null;
}

export function SpellsProvider({ children }) {
  const [spells, setSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const fetchSpells = async (forceRefresh = false) => {
    if (!forceRefresh && inMemoryCache && inMemoryCache.length > 0) {
      setSpells(inMemoryCache);
      setLoading(false);
      setInitialized(true);
      return;
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
      inMemoryCache = spellsData;
    } catch (err) {
      console.error("Error fetching spells:", err);
      setError(err.message);

      // Try to use cached spells if available (even if fetch failed)
      if (inMemoryCache && inMemoryCache.length > 0) {
        setSpells(inMemoryCache);
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
  return inMemoryCache || [];
}

export function getSpellByNameSync(name) {
  const spells = getSpellsSync();
  return spells.find((spell) => spell.name === name);
}

export default SpellsContext;
