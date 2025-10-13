import { hpData } from "../../../../../SharedData/data";

const calculateHitPoints = (
  castingStyle,
  constitution,
  level = 1,
  hasToughFeat = false
) => {
  if (!castingStyle) return 1;

  const conModifier = Math.floor((constitution - 10) / 2);

  const castingData = hpData[castingStyle];
  if (!castingData) return 1;

  const hitPointsAtLevel1 = castingData.base + conModifier;

  let totalHP = hitPointsAtLevel1;

  if (level > 1) {
    const additionalHP = (level - 1) * (castingData.avgPerLevel + conModifier);
    totalHP += additionalHP;
  }

  if (hasToughFeat) {
    totalHP += 2 * level;
  }

  return Math.max(1, totalHP);
};

export const transformCharacterForSave = (character) => {
  const skillProficiencies = Array.isArray(character.skillProficiencies)
    ? character.skillProficiencies
    : [];

  const skillExpertise = Array.isArray(character.skillExpertise)
    ? character.skillExpertise
    : [];

  const level1Feats = [];
  const allFeats = [];

  if (character.level1ChoiceType === "feat" && character.standardFeats) {
    level1Feats.push(...character.standardFeats);
    allFeats.push(...character.standardFeats);
  }

  if (character.asiChoices) {
    Object.values(character.asiChoices).forEach((choice) => {
      if (choice.type === "feat" && choice.selectedFeat) {
        allFeats.push(choice.selectedFeat);
      }
    });
  }

  const hasToughFeat = allFeats.includes("Tough");

  const constitution = character.abilityScores?.constitution || 8;
  const level = character.level || 1;
  const calculatedHitPoints = calculateHitPoints(
    character.castingStyle,
    constitution,
    level,
    hasToughFeat
  );

  const hitPoints =
    character.hitPoints > 0 ? character.hitPoints : calculatedHitPoints;

  const transformed = {
    ability_scores: character.abilityScores || {
      strength: 8,
      dexterity: 8,
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8,
    },
    asi_choices: character.asiChoices || {},
    background: character.background,
    base_ability_scores: character.baseAbilityScores || null,
    casting_style: character.castingStyle,
    casting_style_choices: character.castingStyleChoices || {},
    corruption_points: character.corruptionPoints || 0,
    current_hit_dice: character.level || 1,
    current_hit_points: character.currentHitPoints ?? hitPoints,
    discord_user_id: character.discordUserId || character.discord_user_id || "",
    feat_choices: character.featChoices || {},
    game_session: character.gameSession || "",
    heritage_choices: character.heritageChoices || {},
    hit_points: hitPoints,
    house_choices: character.houseChoices || {},
    house: character.house,
    image_url: character.imageUrl || character.image_url || null,
    initiative_ability: character.initiativeAbility || "dexterity",
    initiative: character.initiative || { modifier: 0, override: null },
    innate_heritage_skills: character.innateHeritageSkills || [],
    innate_heritage: character.innateHeritage,
    level: character.level || 1,
    level1_choice_type: character.level1ChoiceType,
    magic_modifiers: character.magicModifiers || {},
    name: character.name?.trim() || "",
    notes: character.notes || null,
    school_year: character.schoolYear || 1,
    skill_expertise: skillExpertise,
    skill_proficiencies: skillProficiencies,
    standard_feats: level1Feats,
    subclass_choices: character.subclassChoices || {},
    subclass: character.subclass,
    tool_proficiencies: character.toolProficiencies || [],
    wand_type: character.wandType || "",
    wand_info: character.wandInfo || null,
    metamagic_choices: character.metamagicChoices || {},
    additional_feats: character.additionalFeats || [],
    additional_asi: character.additionalASI || [],
  };

  return transformed;
};

export const transformCharacterFromDB = (dbCharacter) => {
  if (!dbCharacter) return null;

  return {
    abilityScores: dbCharacter.base_ability_scores
      ? dbCharacter.base_ability_scores
      : dbCharacter.ability_scores || {
          strength: 8,
          dexterity: 8,
          constitution: 8,
          intelligence: 8,
          wisdom: 8,
          charisma: 8,
        },
    asiChoices: dbCharacter.asi_choices || {},
    background: dbCharacter.background,
    baseAbilityScores: dbCharacter.base_ability_scores || null,
    castingStyle: dbCharacter.casting_style,
    castingStyleChoices: dbCharacter.casting_style_choices || {},
    corruptionPoints: dbCharacter.corruption_points || 0,
    createdAt: dbCharacter.created_at,
    currentHitDice: dbCharacter.current_hit_dice || 1,
    currentHitPoints: dbCharacter.current_hit_points ?? 0,
    discordUserId: dbCharacter.discord_user_id || "",
    featChoices: dbCharacter.feat_choices || {},
    gameSession: dbCharacter.game_session || "",
    heritageChoices: dbCharacter.heritage_choices || {},
    hitPoints: dbCharacter.hit_points || 0,
    house: dbCharacter.house,
    houseChoices: dbCharacter.house_choices || {},
    id: dbCharacter.id,
    imageUrl: dbCharacter.image_url || null,
    initiativeAbility: dbCharacter.initiative_ability || "dexterity",
    initiative: dbCharacter.initiative || { modifier: 0, override: null },
    innateHeritage: dbCharacter.innate_heritage,
    innateHeritageSkills: dbCharacter.innate_heritage_skills || [],
    level: dbCharacter.level || 1,
    level1ChoiceType: dbCharacter.level1_choice_type,
    magicModifiers: dbCharacter.magic_modifiers || {},
    name: dbCharacter.name || "",
    notes: dbCharacter.notes || "",
    schoolYear: dbCharacter.school_year || 1,
    selectedInnateHeritage: dbCharacter.innate_heritage,
    skillExpertise: dbCharacter.skill_expertise || [],
    skillProficiencies: dbCharacter.skill_proficiencies || [],
    standardFeats: (() => {
      if (dbCharacter.standard_feats && dbCharacter.standard_feats.length > 0) {
        const uniqueFeats = [...new Set(dbCharacter.standard_feats)];

        if (dbCharacter.level1_choice_type === "feat") {
          return uniqueFeats.length > 0 ? [uniqueFeats[0]] : [];
        }

        return [];
      }

      if (
        dbCharacter.level1_choice_type === "feat" &&
        dbCharacter.asi_choices?.["1"]?.selectedFeat
      ) {
        return [dbCharacter.asi_choices["1"].selectedFeat];
      }

      return [];
    })(),
    subclass: dbCharacter.subclass,
    subclassChoices: dbCharacter.subclass_choices || {},
    toolProficiencies: dbCharacter.tool_proficiencies || [],
    updatedAt: dbCharacter.updated_at,
    wandType: dbCharacter.wand_type || "",
    wandInfo: dbCharacter.wand_info || "",
    metamagicChoices: dbCharacter.metamagic_choices || {},
    additionalFeats: dbCharacter.additional_feats || [],
    additionalASI: dbCharacter.additional_asi || [],
  };
};
