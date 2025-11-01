import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useSpells(options = {}) {
  const { school, level, year, realtime = false } = options;

  const [spells, setSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpells = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("spells").select("*");

      if (school) {
        query = query.eq("school", school);
      }
      if (level) {
        query = query.eq("level", level);
      }
      if (year) {
        query = query.lte("year", year);
      }

      query = query.order("school").order("name");

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setSpells(data || []);
    } catch (err) {
      console.error("Error fetching spells:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpells();

    if (realtime) {
      const channel = supabase
        .channel("spells-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "spells" },
          (payload) => {
            console.log("Spell changed:", payload);
            fetchSpells();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [school, level, year, realtime]);

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

  const getSpellByName = (name) => {
    return spells.find((spell) => spell.name === name);
  };

  return {
    spells,
    spellsBySchool,
    spellsByLevel,
    loading,
    error,
    refetch: fetchSpells,
    searchSpells,
    getSpellByName,
  };
}

/**
 * Hook to fetch spell schools metadata
 * @returns {Object} { schools, loading, error }
 */
export function useSpellSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSchools() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("spell_schools")
          .select("*")
          .order("name");

        if (fetchError) throw fetchError;

        setSchools(data || []);
      } catch (err) {
        console.error("Error fetching spell schools:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
  }, []);

  return { schools, loading, error };
}
