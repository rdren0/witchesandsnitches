import { createClient } from "@supabase/supabase-js";
import { getStartingEquipment, addStartingEquipment } from "./inventoryService";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const getCharacters = async (discordUserId) => {
  const { data: characters, error: charactersError } = await supabase
    .from("characters")
    .select("*")
    .eq("discord_user_id", discordUserId)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (charactersError) {
    throw new Error(`Failed to fetch characters: ${charactersError.message}`);
  }

  if (!characters || characters.length === 0) {
    return [];
  }

  const characterIds = characters.map((char) => char.id);
  const { data: characterResources, error: resourcesError } = await supabase
    .from("character_resources")
    .select("*")
    .in("character_id", characterIds);

  if (resourcesError) {
    console.warn("Failed to load character resources:", resourcesError);
  }

  const resourcesMap = {};
  if (characterResources) {
    characterResources.forEach((resource) => {
      resourcesMap[resource.character_id] = resource;
    });
  }

  const transformedData = characters.map((character) => {
    const resources = resourcesMap[character.id] || {};
    return {
      ...character,
      inspiration: resources.inspiration ?? false,
      sorceryPoints: resources.sorcery_points || 0,
      corruptionPoints: resources.corruption_points || 0,
      spellSlots1: resources.spell_slots_1 || 0,
      spellSlots2: resources.spell_slots_2 || 0,
      spellSlots3: resources.spell_slots_3 || 0,
      spellSlots4: resources.spell_slots_4 || 0,
      spellSlots5: resources.spell_slots_5 || 0,
      spellSlots6: resources.spell_slots_6 || 0,
      spellSlots7: resources.spell_slots_7 || 0,
      spellSlots8: resources.spell_slots_8 || 0,
      spellSlots9: resources.spell_slots_9 || 0,
      maxSpellSlots1: resources.max_spell_slots_1 || 0,
      maxSpellSlots2: resources.max_spell_slots_2 || 0,
      maxSpellSlots3: resources.max_spell_slots_3 || 0,
      maxSpellSlots4: resources.max_spell_slots_4 || 0,
      maxSpellSlots5: resources.max_spell_slots_5 || 0,
      maxSpellSlots6: resources.max_spell_slots_6 || 0,
      maxSpellSlots7: resources.max_spell_slots_7 || 0,
      maxSpellSlots8: resources.max_spell_slots_8 || 0,
      maxSpellSlots9: resources.max_spell_slots_9 || 0,
    };
  });

  return transformedData;
};

const getAllCharacters = async () => {
  try {
    const { data, error } = await supabase
      .from("characters")
      .select(
        `
        *,
        discord_users (username, display_name),
        character_resources (
          inspiration,
          sorcery_points,
          corruption_points,
          spell_slots_1,
          spell_slots_2,
          spell_slots_3,
          spell_slots_4,
          spell_slots_5,
          spell_slots_6,
          spell_slots_7,
          spell_slots_8,
          spell_slots_9,
          max_spell_slots_1,
          max_spell_slots_2,
          max_spell_slots_3,
          max_spell_slots_4,
          max_spell_slots_5,
          max_spell_slots_6,
          max_spell_slots_7,
          max_spell_slots_8,
          max_spell_slots_9
        )
      `
      )
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (!error) {
      const transformedData = (data || []).map((character) => {
        const resources = character.character_resources?.[0] || {};

        return {
          ...character,
          character_resources: undefined,
          inspiration: resources.inspiration ?? false,
          sorceryPoints: resources.sorcery_points || 0,
          corruptionPoints: resources.corruption_points || 0,
          spellSlots1: resources.spell_slots_1 || 0,
          spellSlots2: resources.spell_slots_2 || 0,
          spellSlots3: resources.spell_slots_3 || 0,
          spellSlots4: resources.spell_slots_4 || 0,
          spellSlots5: resources.spell_slots_5 || 0,
          spellSlots6: resources.spell_slots_6 || 0,
          spellSlots7: resources.spell_slots_7 || 0,
          spellSlots8: resources.spell_slots_8 || 0,
          spellSlots9: resources.spell_slots_9 || 0,
          maxSpellSlots1: resources.max_spell_slots_1 || 0,
          maxSpellSlots2: resources.max_spell_slots_2 || 0,
          maxSpellSlots3: resources.max_spell_slots_3 || 0,
          maxSpellSlots4: resources.max_spell_slots_4 || 0,
          maxSpellSlots5: resources.max_spell_slots_5 || 0,
          maxSpellSlots6: resources.max_spell_slots_6 || 0,
          maxSpellSlots7: resources.max_spell_slots_7 || 0,
          maxSpellSlots8: resources.max_spell_slots_8 || 0,
          maxSpellSlots9: resources.max_spell_slots_9 || 0,
        };
      });

      return transformedData;
    } else {
      console.warn(
        "❌ JOIN query failed, trying manual approach:",
        error.message
      );
    }
  } catch (joinError) {
    console.warn(
      "🔄 JOIN query failed, trying manual join...",
      joinError.message
    );
  }

  try {
    const { data: characters, error: charactersError } = await supabase
      .from("characters")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (charactersError) {
      throw new Error(`Failed to fetch characters: ${charactersError.message}`);
    }

    if (!characters || characters.length === 0) {
      return [];
    }

    const characterIds = characters.map((char) => char.id);
    const { data: characterResources } = await supabase
      .from("character_resources")
      .select("*")
      .in("character_id", characterIds);

    const resourcesMap = {};
    if (characterResources) {
      characterResources.forEach((resource) => {
        resourcesMap[resource.character_id] = resource;
      });
    }

    const discordUserIds = [
      ...new Set(
        characters.map((char) => char.discord_user_id).filter(Boolean)
      ),
    ];
    let userMap = {};

    if (discordUserIds.length > 0) {
      const { data: discordUsers, error: usersError } = await supabase
        .from("discord_users")
        .select("discord_user_id, username, display_name")
        .in("discord_user_id", discordUserIds);

      if (usersError) {
        console.warn("⚠️ Failed to load discord users:", usersError.message);
      } else if (discordUsers) {
        discordUsers.forEach((user) => {
          userMap[user.discord_user_id] = user;
        });
      }
    }

    const charactersWithUsers = characters.map((character) => {
      const resources = resourcesMap[character.id] || {};

      return {
        ...character,
        discord_users: userMap[character.discord_user_id] || null,
        inspiration: resources.inspiration || 0,
        sorceryPoints: resources.sorcery_points || 0,
        corruptionPoints: resources.corruption_points || 0,
        spellSlots1: resources.spell_slots_1 || 0,
        spellSlots2: resources.spell_slots_2 || 0,
        spellSlots3: resources.spell_slots_3 || 0,
        spellSlots4: resources.spell_slots_4 || 0,
        spellSlots5: resources.spell_slots_5 || 0,
        spellSlots6: resources.spell_slots_6 || 0,
        spellSlots7: resources.spell_slots_7 || 0,
        spellSlots8: resources.spell_slots_8 || 0,
        spellSlots9: resources.spell_slots_9 || 0,
        maxSpellSlots1: resources.max_spell_slots_1 || 0,
        maxSpellSlots2: resources.max_spell_slots_2 || 0,
        maxSpellSlots3: resources.max_spell_slots_3 || 0,
        maxSpellSlots4: resources.max_spell_slots_4 || 0,
        maxSpellSlots5: resources.max_spell_slots_5 || 0,
        maxSpellSlots6: resources.max_spell_slots_6 || 0,
        maxSpellSlots7: resources.max_spell_slots_7 || 0,
        maxSpellSlots8: resources.max_spell_slots_8 || 0,
        maxSpellSlots9: resources.max_spell_slots_9 || 0,
      };
    });

    return charactersWithUsers;
  } catch (error) {
    console.error("💥 Error in getAllCharacters:", error);

    try {
      const { data, error: simpleError } = await supabase
        .from("characters")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (simpleError) {
        throw simpleError;
      }

      return (data || []).map((character) => ({
        ...character,
        discord_users: null,
        inspiration: 0,
        sorceryPoints: 0,
        corruptionPoints: 0,
      }));
    } catch (lastResortError) {
      console.error(
        "💥 Even simple character loading failed:",
        lastResortError
      );
      throw new Error(`Failed to fetch all characters: ${error.message}`);
    }
  }
};

const isUserForbidden = async (discordUserId) => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("discord_user_id", discordUserId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking forbidden status:", error);
    return false;
  }

  return !!data;
};

const isUserAdmin = async (discordUserId) => {
  try {
    const forbidden = await isUserForbidden(discordUserId);
    if (forbidden) {
      return false;
    }
  } catch (forbiddenError) {
    console.error("❌ Error checking forbidden status:", forbiddenError);
  }

  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role, granted_by, granted_at")
      .eq("discord_user_id", discordUserId)
      .eq("role", "admin");

    if (error && error.code !== "PGRST116") {
      console.error("❌ Error checking admin status:", error);
      return false;
    }

    const isAdmin = !!(data && data.length > 0);
    return isAdmin;
  } catch (adminError) {
    console.error("❌ Error in admin check:", adminError);
    return false;
  }
};

const verifyAdminPassword = async (discordUserId, password) => {
  const forbidden = await isUserForbidden(discordUserId);

  if (forbidden) {
    throw new Error(
      "The ancient magic recognizes you as forbidden. Access permanently denied."
    );
  }

  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    throw new Error("The magical registry is not properly configured");
  }

  if (password !== ADMIN_PASSWORD) {
    throw new Error("The unlocking charm failed");
  }

  const insertData = {
    discord_user_id: discordUserId,
    role: "admin",
    granted_by: "website",
    granted_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("user_roles")
    .insert(insertData)
    .select();

  if (error && error.code !== "23505") {
    console.error("❌ Database error (not a duplicate key):", error);
    console.error("This is the actual error causing the failure!");
    throw new Error(`Database error: ${error.message}`);
  }

  return true;
};

const getUserRoleStatus = async (discordUserId) => {
  const { data, error } = await supabase
    .from("user_role_status")
    .select("*")
    .eq("discord_user_id", discordUserId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking user role status:", error);
    return { effective_role: "user", roles: ["user"] };
  }

  return data || { effective_role: "user", roles: ["user"] };
};

const setUserRole = async (targetDiscordUserId, role, grantedBy) => {
  const validRoles = ["admin", "moderator", "user", "forbidden"];
  if (!validRoles.includes(role)) {
    throw new Error("Invalid role specified");
  }

  try {
    const { error } = await supabase.from("user_roles").insert({
      discord_user_id: targetDiscordUserId,
      role: role,
      granted_by: grantedBy,
      granted_at: new Date().toISOString(),
    });

    if (error && error.code !== "23505") {
      throw new Error(`Failed to grant ${role} role: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error("Error setting user role:", error);
    throw error;
  }
};

const removeUserRole = async (targetDiscordUserId, role) => {
  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("discord_user_id", targetDiscordUserId)
    .eq("role", role);

  if (error) {
    throw new Error(`Failed to remove ${role} role: ${error.message}`);
  }

  return true;
};

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
        innate_heritage: characterData.innate_heritage,
        innate_heritage_skills: characterData.innate_heritage_skills,
        level: characterData.level,
        level1_choice_type: characterData.level1_choice_type,
        magic_modifiers: characterData.magic_modifiers,
        name: characterData.name,
        school_year: characterData.schoolYear,
        skill_proficiencies: characterData.skill_proficiencies,
        skill_expertise: characterData.skill_expertise,
        standard_feats: characterData.standard_feats,
        subclass: characterData.subclass,
        subclass_choices: characterData.subclass_choices,
        wand_type: characterData.wand_type,
        image_url: characterData.image_url || null,
      })
      .select()
      .single();

    if (characterError) {
      throw characterError;
    }

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
      }
    }

    return savedCharacter;
  } catch (error) {
    console.error("Error in saveCharacter:", error);
    throw error;
  }
};

const updateCharacter = async (characterId, characterData, discordUserId) => {
  try {
    const { data: updatedCharacter, error: characterError } = await supabase
      .from("characters")
      .update({
        ability_scores: characterData.ability_scores,
        asi_choices: characterData.asi_choices,
        background: characterData.background,
        casting_style: characterData.casting_style,
        current_hit_dice: characterData.level,
        current_hit_points: characterData.hit_points,
        game_session: characterData.game_session,
        heritage_choices: characterData.heritage_choices || {},
        hit_points: characterData.hit_points,
        house: characterData.house,
        house_choices: characterData.house_choices,
        initiative_ability: characterData.initiative_ability,
        innate_heritage: characterData.innate_heritage,
        innate_heritage_skills: characterData.innate_heritage_skills,
        level: characterData.level,
        level1_choice_type: characterData.level1_choice_type,
        magic_modifiers: characterData.magic_modifiers,
        name: characterData.name,
        school_year: characterData.school_year,
        skill_proficiencies: characterData.skill_proficiencies,
        skill_expertise: characterData.skill_expertise,
        standard_feats: characterData.standard_feats,
        subclass: characterData.subclass,
        subclass_choices: characterData.subclass_choices,
        wand_type: characterData.wand_type,
        image_url: characterData.image_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", characterId)
      .eq("discord_user_id", discordUserId)
      .select()
      .single();

    if (characterError) {
      console.error(
        "characterService.updateCharacter - database error:",
        characterError
      );
      throw characterError;
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

const getCharacterByIdAdmin = async (characterId) => {
  const { data, error } = await supabase
    .from("characters")
    .select(
      `
      *,
      discord_users (
        username,
        display_name
      )
    `
    )
    .eq("id", characterId)
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

const advanceSchoolYear = async (
  characterId,
  discordUserId,
  newYear,
  levelIncrease = 1
) => {
  try {
    if (newYear < 1 || newYear > 7) {
      throw new Error("School year must be between 1 and 7");
    }

    const { data: currentCharacter, error: fetchError } = await supabase
      .from("characters")
      .select("*")
      .eq("id", characterId)
      .eq("discord_user_id", discordUserId)
      .eq("active", true)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch character: ${fetchError.message}`);
    }

    const newLevel = (currentCharacter.level || 1) + levelIncrease;

    const { data: updatedCharacter, error: updateError } = await supabase
      .from("characters")
      .update({
        school_year: newYear,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", characterId)
      .eq("discord_user_id", discordUserId)
      .eq("active", true)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to advance school year: ${updateError.message}`);
    }

    return updatedCharacter;
  } catch (error) {
    console.error("Error in advanceSchoolYear:", error);
    throw error;
  }
};

const getRecommendedLevelRange = (schoolYear) => {
  const ranges = {
    1: { min: 1, max: 2 },
    2: { min: 2, max: 4 },
    3: { min: 4, max: 6 },
    4: { min: 6, max: 9 },
    5: { min: 9, max: 12 },
    6: { min: 12, max: 14 },
    7: { min: 14, max: 16 },
  };
  return ranges[schoolYear] || { min: 1, max: 20 };
};

const getRecommendedSchoolYear = (level) => {
  if (level >= 1 && level <= 2) return 1;
  if (level >= 2 && level <= 4) return 2;
  if (level >= 4 && level <= 6) return 3;
  if (level >= 6 && level <= 9) return 4;
  if (level >= 9 && level <= 12) return 5;
  if (level >= 12 && level <= 14) return 6;
  if (level >= 14 && level <= 16) return 7;
  return 7;
};

const isProgressionNormal = (schoolYear, level) => {
  const range = getRecommendedLevelRange(schoolYear);
  return level >= range.min && level <= range.max;
};

export const characterService = {
  getCharacters,
  getAllCharacters,
  isUserAdmin,
  isUserForbidden,
  verifyAdminPassword,
  getUserRoleStatus,
  setUserRole,
  removeUserRole,
  getCharacterById,
  getCharacterByIdAdmin,
  saveCharacter,
  updateCharacter,
  updateCharacterSubclass,
  deleteCharacter,
  restoreCharacter,
  getArchivedCharacters,
  advanceSchoolYear,
  getRecommendedLevelRange,
  getRecommendedSchoolYear,
  isProgressionNormal,
};
