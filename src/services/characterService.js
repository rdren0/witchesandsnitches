import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const getCharacters = async (discordUserId) => {
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("discord_user_id", discordUserId)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch characters: ${error.message}`);
  }

  return data || [];
};

const saveCharacter = async (characterData, discordUserId) => {
  if (
    characterData.subclass_choices &&
    typeof characterData.subclass_choices !== "object"
  ) {
    throw new Error("Invalid subclass choices format - must be an object");
  }

  const { data, error } = await supabase
    .from("characters")
    .insert([
      {
        ...characterData,
        discord_user_id: discordUserId,
        active: true,
        created_at: new Date().toISOString(),
        subclass_choices: characterData.subclass_choices || {},
      },
    ])
    .select();

  if (error) {
    throw new Error(`Failed to save character: ${error.message}`);
  }

  return data[0];
};

const updateCharacter = async (characterId, characterData, discordUserId) => {
  if (
    characterData.subclass_choices &&
    typeof characterData.subclass_choices !== "object"
  ) {
    throw new Error("Invalid subclass choices format - must be an object");
  }

  const { data, error } = await supabase
    .from("characters")
    .update({
      ...characterData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", characterId)
    .eq("discord_user_id", discordUserId)
    .eq("active", true)
    .select();

  if (error) {
    throw new Error(`Failed to update character: ${error.message}`);
  }

  return data[0];
};

const updateCharacterSubclass = async (
  characterId,
  subclass,
  subclassChoices,
  discordUserId
) => {
  if (subclassChoices && typeof subclassChoices !== "object") {
    throw new Error("Invalid subclass choices format - must be an object");
  }

  const { data, error } = await supabase
    .from("characters")
    .update({
      subclass: subclass,
      subclass_choices: subclassChoices || {},
      updated_at: new Date().toISOString(),
    })
    .eq("id", characterId)
    .eq("discord_user_id", discordUserId)
    .eq("active", true)
    .select();

  if (error) {
    throw new Error(`Failed to update character subclass: ${error.message}`);
  }

  return data[0];
};

const getCharacterById = async (characterId, discordUserId) => {
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("id", characterId)
    .eq("discord_user_id", discordUserId)
    .eq("active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Character not found");
    }
    throw new Error(`Failed to fetch character: ${error.message}`);
  }

  return data;
};

const deleteCharacter = async (characterId, discordUserId) => {
  const { data, error } = await supabase
    .from("characters")
    .update({
      active: false,
      archived_at: new Date().toISOString(),
    })
    .eq("id", characterId)
    .eq("discord_user_id", discordUserId)
    .eq("active", true)
    .select();

  if (error) {
    throw new Error(`Failed to archive character: ${error.message}`);
  }

  return data[0];
};

const restoreCharacter = async (characterId, discordUserId) => {
  const { data, error } = await supabase
    .from("characters")
    .update({
      active: true,
      archived_at: null,
      restored_at: new Date().toISOString(),
    })
    .eq("id", characterId)
    .eq("discord_user_id", discordUserId)
    .eq("active", false)
    .select();

  if (error) {
    throw new Error(`Failed to restore character: ${error.message}`);
  }

  return data[0];
};

const getArchivedCharacters = async (discordUserId = null) => {
  let query = supabase
    .from("characters")
    .select("*")
    .eq("active", false)
    .order("archived_at", { ascending: false });

  if (discordUserId) {
    query = query.eq("discord_user_id", discordUserId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch archived characters: ${error.message}`);
  }

  return data || [];
};

export const characterService = {
  getCharacters,
  getCharacterById,
  saveCharacter,
  updateCharacter,
  updateCharacterSubclass,
  deleteCharacter,
  restoreCharacter,
  getArchivedCharacters,
};
