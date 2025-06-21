export const characterResourcesService = {
  async getCharacterResources(supabase, characterId, discordUserId) {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from("character_resources")
        .select("*")
        .eq("character_id", characterId)
        .eq("discord_user_id", discordUserId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching character resources:", fetchError);
        throw fetchError;
      }

      if (existing) {
        return { data: existing, error: null };
      }

      const defaultResources = {
        character_id: characterId,
        discord_user_id: discordUserId,
        corruption_points: 0,
        sorcery_points: 0,
        max_sorcery_points: 0,
        spell_slots_1: 0,
        spell_slots_2: 0,
        spell_slots_3: 0,
        spell_slots_4: 0,
        spell_slots_5: 0,
        spell_slots_6: 0,
        spell_slots_7: 0,
        spell_slots_8: 0,
        spell_slots_9: 0,
        max_spell_slots_1: 0,
        max_spell_slots_2: 0,
        max_spell_slots_3: 0,
        max_spell_slots_4: 0,
        max_spell_slots_5: 0,
        max_spell_slots_6: 0,
        max_spell_slots_7: 0,
        max_spell_slots_8: 0,
        max_spell_slots_9: 0,
      };

      const { data: created, error: createError } = await supabase
        .from("character_resources")
        .insert(defaultResources)
        .select()
        .single();

      if (createError) {
        console.error("Error creating character resources:", createError);
        throw createError;
      }

      return { data: created, error: null };
    } catch (error) {
      console.error("Error in getCharacterResources:", error);
      return { data: null, error };
    }
  },

  async updateCorruptionPoints(supabase, characterId, discordUserId, newValue) {
    try {
      const { data, error } = await supabase
        .from("character_resources")
        .update({
          corruption_points: Math.max(0, newValue),
          updated_at: new Date().toISOString(),
        })
        .eq("character_id", characterId)
        .eq("discord_user_id", discordUserId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error updating corruption points:", error);
      return { data: null, error };
    }
  },

  async updateSorceryPoints(
    supabase,
    characterId,
    discordUserId,
    newValue,
    maxValue = null
  ) {
    try {
      const updateData = {
        sorcery_points: Math.max(0, newValue),
        updated_at: new Date().toISOString(),
      };

      if (maxValue !== null) {
        updateData.max_sorcery_points = Math.max(0, maxValue);
      }

      const { data, error } = await supabase
        .from("character_resources")
        .update(updateData)
        .eq("character_id", characterId)
        .eq("discord_user_id", discordUserId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error updating sorcery points:", error);
      return { data: null, error };
    }
  },

  async updateSpellSlots(
    supabase,
    characterId,
    discordUserId,
    spellLevel,
    currentSlots,
    maxSlots = null
  ) {
    try {
      if (spellLevel < 1 || spellLevel > 9) {
        throw new Error("Spell level must be between 1 and 9");
      }

      const updateData = {
        [`spell_slots_${spellLevel}`]: Math.max(0, currentSlots),
        updated_at: new Date().toISOString(),
      };

      if (maxSlots !== null) {
        updateData[`max_spell_slots_${spellLevel}`] = Math.max(0, maxSlots);
      }

      const { data, error } = await supabase
        .from("character_resources")
        .update(updateData)
        .eq("character_id", characterId)
        .eq("discord_user_id", discordUserId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error updating spell slots:", error);
      return { data: null, error };
    }
  },

  async updateMultipleResources(supabase, characterId, discordUserId, updates) {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("character_resources")
        .update(updateData)
        .eq("character_id", characterId)
        .eq("discord_user_id", discordUserId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error updating multiple resources:", error);
      return { data: null, error };
    }
  },

  async restoreAllSpellSlots(supabase, characterId, discordUserId) {
    try {
      const { data: current, error: fetchError } = await supabase
        .from("character_resources")
        .select("*")
        .eq("character_id", characterId)
        .eq("discord_user_id", discordUserId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const updateData = {
        spell_slots_1: current.max_spell_slots_1 || 0,
        spell_slots_2: current.max_spell_slots_2 || 0,
        spell_slots_3: current.max_spell_slots_3 || 0,
        spell_slots_4: current.max_spell_slots_4 || 0,
        spell_slots_5: current.max_spell_slots_5 || 0,
        spell_slots_6: current.max_spell_slots_6 || 0,
        spell_slots_7: current.max_spell_slots_7 || 0,
        spell_slots_8: current.max_spell_slots_8 || 0,
        spell_slots_9: current.max_spell_slots_9 || 0,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("character_resources")
        .update(updateData)
        .eq("character_id", characterId)
        .eq("discord_user_id", discordUserId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error restoring spell slots:", error);
      return { data: null, error };
    }
  },

  getFormattedSpellSlots(resources) {
    const spellSlots = [];
    for (let level = 1; level <= 9; level++) {
      const current = resources[`spell_slots_${level}`] || 0;
      const max = resources[`max_spell_slots_${level}`] || 0;

      if (max > 0) {
        spellSlots.push({
          level,
          current,
          max,
          available: current > 0,
        });
      }
    }
    return spellSlots;
  },
};

export default characterResourcesService;
