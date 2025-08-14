export const DEFAULT_CHARACTER = {
  // Basic Info
  name: "",
  imageUrl: "",
  level: 1,
  schoolYear: "First",
  castingStyle: "",

  // Ability Scores
  ability_scores: {
    strength: 8,
    dexterity: 8,
    constitution: 8,
    intelligence: 8,
    wisdom: 8,
    charisma: 8,
  },

  // Character Choices
  background: "",
  house: "",
  heritage: "",

  // Game Info
  hit_points: 0,
  current_hit_points: 0,
  current_hit_dice: 1,
  game_session: "",

  // Progression
  asi_choices: {},
  house_choices: {},
  heritage_choices: {},
  feat_choices: {},
  subclass_choices: {},

  // Derived Values
  level1ChoiceType: "",
  selectedFeat: "",
  selectedInnateHeritage: "",

  // Meta
  discord_user_id: "",
  created_at: "",
  updated_at: "",
};

export const ABILITY_SCORES = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

export const CASTING_STYLES = [
  "Academics",
  "Alchemy",
  "Artisan",
  "Primal",
  "Innate",
];

export const SCHOOL_YEARS = [
  "First",
  "Second",
  "Third",
  "Fourth",
  "Fifth",
  "Sixth",
  "Seventh",
];
