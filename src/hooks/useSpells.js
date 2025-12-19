import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export {
  useSpells,
  useSpellsContext,
  SpellsProvider,
  clearSpellsCache,
  getSpellsSync,
  getSpellByNameSync,
} from "../contexts/SpellsContext";

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
