import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Set the current Discord user for RLS
export const setCurrentUser = async (discordUserId) => {
  const { error } = await supabase.rpc("set_config", {
    setting_name: "app.current_user_id",
    setting_value: discordUserId,
    is_local: true,
  });

  if (error) {
    console.error("Error setting current user:", error);
  }
};

// Character database operations
export const characterService = {
  // Get all characters for the current Discord user
  async getCharacters(discordUserId) {
    // Set the current user for RLS
    await setCurrentUser(discordUserId);

    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("discord_user_id", discordUserId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Save a new character
  async saveCharacter(character, discordUserId) {
    // Set the current user for RLS
    await setCurrentUser(discordUserId);

    const { data, error } = await supabase
      .from("characters")
      .insert([
        {
          discord_user_id: discordUserId,
          name: character.name,
          house: character.house,
          casting_style: character.castingStyle,
          subclass: character.subclass,
          innate_heritage: character.innateHeritage,
          background: character.background,
          standard_feats: character.standardFeats,
          skill_proficiencies: character.skillProficiencies,
          ability_scores: character.abilityScores,
          hit_points: character.hitPoints,
          level: character.level,
          wand_type: character.wandType,
          magic_modifiers: character.magicModifiers,
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Update an existing character
  async updateCharacter(id, character, discordUserId) {
    // Set the current user for RLS
    await setCurrentUser(discordUserId);

    const { data, error } = await supabase
      .from("characters")
      .update({
        name: character.name,
        house: character.house,
        casting_style: character.castingStyle,
        subclass: character.subclass,
        innate_heritage: character.innateHeritage,
        background: character.background,
        standard_feats: character.standardFeats,
        skill_proficiencies: character.skillProficiencies,
        ability_scores: character.abilityScores,
        hit_points: character.hitPoints,
        level: character.level,
        wand_type: character.wandType,
        magic_modifiers: character.magicModifiers,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("discord_user_id", discordUserId) // Ensure user can only update their own characters
      .select();

    if (error) throw error;
    return data[0];
  },

  // Delete a character
  async deleteCharacter(id, discordUserId) {
    // Set the current user for RLS
    await setCurrentUser(discordUserId);

    const { error } = await supabase
      .from("characters")
      .delete()
      .eq("id", id)
      .eq("discord_user_id", discordUserId); // Ensure user can only delete their own characters

    if (error) throw error;
  },
};
