import { useState, useEffect } from "react";

export const useInventory = (discordUserId, characterId, supabase) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadInventory = async () => {
    if (!discordUserId || !characterId || !supabase) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("discord_user_id", discordUserId)
        .eq("character_id", characterId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setInventory(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error loading inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [discordUserId, characterId]);

  return {
    inventory,
    loading,
    error,
    refetch: loadInventory,
  };
};
