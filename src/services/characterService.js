import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

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

export const characterService = {
  async getCharacters(discordUserId) {
    await setCurrentUser(discordUserId);

    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("discord_user_id", discordUserId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async saveCharacter(character, discordUserId) {
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
          game_session: character.gameSession, // ADD THIS LINE!
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

  async updateCharacter(id, character, discordUserId) {
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
        game_session: character.gameSession,
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
      .eq("discord_user_id", discordUserId)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteCharacter(id, discordUserId) {
    await setCurrentUser(discordUserId);

    const { error } = await supabase
      .from("characters")
      .delete()
      .eq("id", id)
      .eq("discord_user_id", discordUserId);

    if (error) throw error;
  },
};
