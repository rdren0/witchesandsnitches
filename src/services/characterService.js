import { createClient } from "@supabase/supabase-js";
import { getStartingEquipment, addStartingEquipment } from "./inventoryService";

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

// Fixed: Remove supabase parameter since we use the one from top of file
const saveCharacter = async (characterData, discordUserId) => {
  try {
    const { data: savedCharacter, error: characterError } = await supabase
      .from("characters")
      .insert({
        ability_scores: characterData.ability_scores,
        asi_choices: characterData.asi_choices,
        background: characterData.background,
        casting_style: characterData.casting_style,
        current_hit_dice: characterData.level,
        current_hit_points: characterData.hit_points,
        discord_user_id: discordUserId,
        game_session: characterData.game_session,
        heritage_choices: characterData.heritage_choices || {},
        hit_points: characterData.hit_points,
        house: characterData.house,
        house_choices: characterData.house_choices,
        initiative_ability: characterData.initiative_ability,
        heritage_choices: characterData.heritage_choices,
        innate_heritage_skills: characterData.innate_heritage_skills,
        level: characterData.level,
        level1_choice_type: characterData.level1_choice_type,
        magic_modifiers: characterData.magic_modifiers,
        name: characterData.name,
        skill_proficiencies: characterData.skill_proficiencies,
        standard_feats: characterData.standard_feats,
        subclass: characterData.subclass,
        subclass_choices: characterData.subclass_choices,
        wand_type: characterData.wand_type,
      })
      .select()
      .single();

    if (characterError) {
      throw characterError;
    }

    // Add starting equipment based on background
    if (characterData.background && savedCharacter.id) {
      try {
        const startingEquipment = getStartingEquipment(
          characterData.background
        );

        if (startingEquipment.length > 0) {
          await addStartingEquipment(
            discordUserId,
            savedCharacter.id,
            startingEquipment,
            supabase
          );
        }
      } catch (equipmentError) {
        console.error("Failed to add starting equipment:", equipmentError);
        // Don't fail character creation if equipment fails
      }
    }

    return savedCharacter;
  } catch (error) {
    console.error("Error in saveCharacter:", error);
    throw error;
  }
};

// Fixed: Remove supabase parameter since we use the one from top of file
const updateCharacter = async (characterId, characterData, discordUserId) => {
  try {
    // Get current character to check if background changed
    const { data: currentCharacter } = await supabase
      .from("characters")
      .select("background")
      .eq("id", characterId)
      .eq("discord_user_id", discordUserId)
      .single();

    // Update the character
    const { data: updatedCharacter, error: updateError } = await supabase
      .from("characters")
      .update({
        ability_scores: characterData.ability_scores,
        asi_choices: characterData.asi_choices,
        background: characterData.background,
        casting_style: characterData.casting_style,
        game_session: characterData.game_session,
        heritage_choices: characterData.heritage_choices || {},
        hit_points: characterData.hit_points,
        house: characterData.house,
        house_choices: characterData.house_choices,
        initiative_ability: characterData.initiative_ability,
        heritage_choices: characterData.heritage_choices,
        innate_heritage_skills: characterData.innate_heritage_skills,
        level: characterData.level,
        level1_choice_type: characterData.level1_choice_type,
        magic_modifiers: characterData.magic_modifiers,
        name: characterData.name,
        skill_proficiencies: characterData.skill_proficiencies,
        standard_feats: characterData.standard_feats,
        subclass: characterData.subclass,
        subclass_choices: characterData.subclass_choices,
        updated_at: new Date().toISOString(),
        wand_type: characterData.wand_type,
      })
      .eq("id", characterId)
      .eq("discord_user_id", discordUserId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Check if background changed and add new starting equipment
    const backgroundChanged =
      currentCharacter?.background !== characterData.background;

    if (backgroundChanged && characterData.background) {
      try {
        const startingEquipment = getStartingEquipment(
          characterData.background
        );

        if (startingEquipment.length > 0) {
          await addStartingEquipment(
            discordUserId,
            characterId,
            startingEquipment,
            supabase
          );
        }
      } catch (equipmentError) {
        console.error(
          "Failed to add starting equipment on background change:",
          equipmentError
        );
        // Don't fail the character update if equipment fails
      }
    }

    return updatedCharacter;
  } catch (error) {
    console.error("Error in updateCharacter:", error);
    throw error;
  }
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
