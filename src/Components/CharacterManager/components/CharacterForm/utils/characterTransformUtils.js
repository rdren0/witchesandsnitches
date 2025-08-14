export const transformCharacterForSave = (character) => {
  const skillProficiencies = Array.isArray(character.skillProficiencies)
    ? character.skillProficiencies
    : [];

  const skillExpertise = Array.isArray(character.skillExpertise)
    ? character.skillExpertise
    : [];

  const allFeats = [];

  if (character.level1ChoiceType === "feat" && character.standardFeats) {
    allFeats.push(...character.standardFeats);
  }

  if (character.asiChoices) {
    Object.values(character.asiChoices).forEach((choice) => {
      if (choice.type === "feat" && choice.selectedFeat) {
        allFeats.push(choice.selectedFeat);
      }
    });
  }

  return {
    name: character.name?.trim() || "",
    level: character.level || 1,
    casting_style: character.castingStyle,
    school_year: character.schoolYear || 1,

    house: character.house,
    subclass: character.subclass,
    background: character.background,

    level1_choice_type: character.level1ChoiceType,
    innate_heritage: character.innateHeritage,

    ability_scores: character.abilityScores || {
      strength: 8,
      dexterity: 8,
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8,
    },

    base_ability_scores: character.baseAbilityScores || null,

    hit_points: character.hitPoints || 0,
    current_hit_points: character.currentHitPoints || character.hitPoints || 0,
    current_hit_dice: character.level || 1,

    skill_proficiencies: skillProficiencies,
    skill_expertise: skillExpertise,
    innate_heritage_skills: character.innateHeritageSkills || [],

    standard_feats: allFeats,
    asi_choices: character.asiChoices || {},
    feat_choices: character.featChoices || {},
    house_choices: character.houseChoices || {},
    subclass_choices: character.subclassChoices || {},
    heritage_choices: character.heritageChoices || {},

    game_session: character.gameSession || "",
    discord_user_id: character.discordUserId || character.discord_user_id || "",
    magic_modifiers: character.magicModifiers || {},
    initiative_ability: character.initiativeAbility || "dexterity",
    wand_type: character.wandType || "",
    image_url: character.imageUrl || character.image_url || null,

    corruption_points: character.corruptionPoints || 0,
    tool_proficiencies: character.toolProficiencies || [],
  };
};

export const transformCharacterFromDB = (dbCharacter) => {
  if (!dbCharacter) return null;

  return {
    id: dbCharacter.id,
    name: dbCharacter.name || "",
    level: dbCharacter.level || 1,
    castingStyle: dbCharacter.casting_style,
    schoolYear: dbCharacter.school_year || 1,

    house: dbCharacter.house,
    subclass: dbCharacter.subclass,
    background: dbCharacter.background,

    level1ChoiceType: dbCharacter.level1_choice_type,
    innateHeritage: dbCharacter.innate_heritage,
    selectedInnateHeritage: dbCharacter.innate_heritage,

    abilityScores: dbCharacter.ability_scores || {
      strength: 8,
      dexterity: 8,
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8,
    },

    baseAbilityScores: dbCharacter.base_ability_scores || null,

    hitPoints: dbCharacter.hit_points || 0,
    currentHitPoints: dbCharacter.current_hit_points || 0,
    currentHitDice: dbCharacter.current_hit_dice || 1,

    skillProficiencies: dbCharacter.skill_proficiencies || [],
    skillExpertise: dbCharacter.skill_expertise || [],
    innateHeritageSkills: dbCharacter.innate_heritage_skills || [],

    standardFeats: (() => {
      if (dbCharacter.standard_feats && dbCharacter.standard_feats.length > 0) {
        return dbCharacter.standard_feats;
      }

      if (
        dbCharacter.level1_choice_type === "feat" &&
        dbCharacter.asi_choices?.["1"]?.selectedFeat
      ) {
        return [dbCharacter.asi_choices["1"].selectedFeat];
      }

      return [];
    })(),

    asiChoices: dbCharacter.asi_choices || {},
    featChoices: dbCharacter.feat_choices || {},
    houseChoices: dbCharacter.house_choices || {},
    subclassChoices: dbCharacter.subclass_choices || {},
    heritageChoices: dbCharacter.heritage_choices || {},

    gameSession: dbCharacter.game_session || "",
    discordUserId: dbCharacter.discord_user_id || "",
    magicModifiers: dbCharacter.magic_modifiers || {},
    initiativeAbility: dbCharacter.initiative_ability || "dexterity",
    wandType: dbCharacter.wand_type || "",
    imageUrl: dbCharacter.image_url || null,

    corruptionPoints: dbCharacter.corruption_points || 0,
    toolProficiencies: dbCharacter.tool_proficiencies || [],

    createdAt: dbCharacter.created_at,
    updatedAt: dbCharacter.updated_at,
  };
};
