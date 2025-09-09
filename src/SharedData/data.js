import { Brain, Heart, Shield, Zap } from "lucide-react";

export const SPELL_SLOT_PROGRESSION = {
  1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
  4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

export const SORCERY_POINT_PROGRESSION = {
  1: 0,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
  13: 13,
  14: 14,
  15: 15,
  16: 16,
  17: 17,
  18: 18,
  19: 19,
  20: 20,
};

export const housesBySchool = {
  "Hogwarts School of Witchcraft and Wizardry": [
    "Gryffindor",
    "Hufflepuff",
    "Ravenclaw",
    "Slytherin",
  ],
  "Ilvermorny School of Witchcraft and Wizardry": [
    "Horned Serpent",
    "Wampus Cat",
    "Thunderbird",
    "Pukwudgie",
  ],
  "Beauxbatons Academy of Magic": ["Beauxbatons"],
  "Durmstrang Institute": ["Durmstrang"],
  "Uagadou School of Magic": ["Uagadou"],
  "Mahoutokoro School of Magic": ["Mahoutokoro"],
  Castelobruxo: ["Castelobruxo"],
  Koldovstoretz: ["Koldovstoretz"],
};

export const castingStyles = [
  "Willpower Caster",
  "Technique Caster",
  "Intellect Caster",
  "Vigor Caster",
];

export const castingStyleData = {
  "Technique Caster": {
    icon: Zap,
    color: "#8B5CF6",
    hitDie: "1d6",
    hitPointsAtFirst: "6 + CON modifier",
    hitPointsPerLevel: "1d6 (or 4) + CON modifier",
    spellcastingAbility: "Wisdom",
    baseAC: "10 + DEX modifier",
    savingThrows: ["Dexterity", "Wisdom"],
    skills: [
      "Acrobatics",
      "Herbology",
      "Magical Theory",
      "Insight",
      "Perception",
      "Potion-Making",
      "Sleight of Hand",
      "Stealth",
    ],
    keyFeatures: [
      "Exploit Weakness: Deal extra damage once per turn using spell slots",
      "Spell Deflection: Redirect spells back at enemies",
      "Technical Metamagics: Bouncing, Maximized, and Seeking spell options",
      "Sorcerous Restoration: Regain sorcery points on short rest at level 20",
    ],
    description:
      "Masters of precision and technique, these casters excel at exploiting weaknesses and deflecting magical attacks.",
  },
  "Intellect Caster": {
    icon: Brain,
    color: "#3B82F6",
    hitDie: "1d8",
    hitPointsAtFirst: "8 + CON modifier",
    hitPointsPerLevel: "1d8 (or 5) + CON modifier",
    spellcastingAbility: "Intelligence",
    baseAC: "11 + DEX modifier",
    savingThrows: ["Wisdom", "Intelligence"],
    skills: [
      "Acrobatics",
      "Herbology",
      "Magical Theory",
      "Insight",
      "Investigation",
      "Magical Creatures",
      "History of Magic",
      "Medicine",
      "Muggle Studies",
      "Survival",
    ],
    keyFeatures: [
      "Double Check Notes: Retry failed spells once per long rest",
      "Ritual Casting: Cast ritual spells without expending spell slots",
      "Tactical Wit: Use INT for initiative and gain defensive bonuses",
      "Sharp Senses: Enhanced AC calculation",
      "Diverse Studies: Gain school of magic features at level 3",
      "Arcane Recovery: Recover spell slots on short rest at level 20",
    ],
    description:
      "Scholarly spellcasters who rely on knowledge and preparation, with superior tactical awareness and ritual casting.",
  },
  "Vigor Caster": {
    icon: Heart,
    color: "#EF4444",
    hitDie: "1d12",
    hitPointsAtFirst: "12 + CON modifier",
    hitPointsPerLevel: "1d12 (or 8) + CON modifier",
    spellcastingAbility: "Constitution",
    baseAC: "8 + DEX modifier",
    savingThrows: ["Constitution", "Strength"],
    skills: [
      "Athletics",
      "Acrobatics",
      "Deception",
      "Stealth",
      "Magical Creatures",
      "Medicine",
      "Survival",
      "Intimidation",
      "Performance",
    ],
    keyFeatures: [
      "Easy Target: Lower AC but massive hit points",
      "Rated E for Everyone: Enhanced unarmed strikes (1d6 + STR)",
      "Metamagic: Rage: Enter a magical rage with resistances and bonuses",
      "Relentless Rage: Stay conscious when dropped to 0 HP while raging",
      "Vigorous Perfection: +4 Constitution at level 20 (max 24)",
    ],
    description:
      "Physical powerhouses who channel magic through raw vitality, combining spellcasting with brutal melee combat.",
  },
  "Willpower Caster": {
    icon: Shield,
    color: "#F59E0B",
    hitDie: "1d10",
    hitPointsAtFirst: "10 + CON modifier",
    hitPointsPerLevel: "1d10 (or 6) + CON modifier",
    spellcastingAbility: "Charisma",
    baseAC: "13 + DEX modifier",
    savingThrows: ["Constitution", "Charisma"],
    skills: [
      "Athletics",
      "Acrobatics",
      "Deception",
      "Intimidation",
      "History of Magic",
      "Magical Creatures",
      "Persuasion",
      "Sleight of Hand",
      "Survival",
    ],
    keyFeatures: [
      "Sorcerous Resilience: Natural magical protection (13 + DEX AC)",
      "Fierce Spell: Cast spells at higher levels using sorcery points",
      "Resistant Spell: Make spells harder to counter or deflect",
      "Signature Spells: Cast two 3rd-level spells without spell slots at level 20",
    ],
    description:
      "Charismatic casters who rely on force of personality and natural magical talent, with strong defensive capabilities.",
  },
};

export const SUBJECT_TO_MODIFIER_MAP = {
  charms: {
    abilityScore: "dexterity",
    wandModifier: "charms",
  },
  jhc: {
    abilityScore: "charisma",
    wandModifier: "jinxesHexesCurses",
  },
  transfiguration: {
    abilityScore: "strength",
    wandModifier: "transfiguration",
  },
  healing: {
    abilityScore: "intelligence",
    wandModifier: "healing",
  },
  divinations: {
    abilityScore: "wisdom",
    wandModifier: "divinations",
  },
};

export const hpData = {
  "Willpower Caster": {
    hitDie: 10,
    base: 10,
    avgPerLevel: 6,
  },
  "Technique Caster": {
    hitDie: 6,
    base: 6,
    avgPerLevel: 4,
  },
  "Intellect Caster": {
    hitDie: 8,
    base: 8,
    avgPerLevel: 5,
  },
  "Vigor Caster": {
    hitDie: 12,
    base: 12,
    avgPerLevel: 8,
  },
};

export const skillMap = {
  athletics: "Athletics",
  acrobatics: "Acrobatics",
  sleightOfHand: "Sleight of Hand",
  stealth: "Stealth",
  herbology: "Herbology",
  historyOfMagic: "History of Magic",
  investigation: "Investigation",
  magicalTheory: "Magical Theory",
  muggleStudies: "Muggle Studies",
  insight: "Insight",
  magicalCreatures: "Magical Creatures",
  medicine: "Medicine",
  perception: "Perception",
  potionMaking: "Potion Making",
  survival: "Survival",
  deception: "Deception",
  intimidation: "Intimidation",
  performance: "Performance",
  persuasion: "Persuasion",
};

export const allSkills = [
  { name: "athletics", displayName: "Athletics", ability: "strength" },
  { name: "acrobatics", displayName: "Acrobatics", ability: "dexterity" },
  {
    name: "sleightOfHand",
    displayName: "Sleight of Hand",
    ability: "dexterity",
  },
  { name: "stealth", displayName: "Stealth", ability: "dexterity" },
  { name: "herbology", displayName: "Herbology", ability: "intelligence" },
  {
    name: "historyOfMagic",
    displayName: "History of Magic",
    ability: "intelligence",
  },
  {
    name: "investigation",
    displayName: "Investigation",
    ability: "intelligence",
  },
  {
    name: "magicalTheory",
    displayName: "Magical Theory",
    ability: "intelligence",
  },
  {
    name: "muggleStudies",
    displayName: "Muggle Studies",
    ability: "intelligence",
  },
  { name: "insight", displayName: "Insight", ability: "wisdom" },
  {
    name: "magicalCreatures",
    displayName: "Magical Creatures",
    ability: "wisdom",
  },
  { name: "medicine", displayName: "Medicine", ability: "wisdom" },
  { name: "perception", displayName: "Perception", ability: "wisdom" },
  { name: "potionMaking", displayName: "Potion Making", ability: "wisdom" },
  { name: "survival", displayName: "Survival", ability: "wisdom" },
  { name: "deception", displayName: "Deception", ability: "charisma" },
  { name: "intimidation", displayName: "Intimidation", ability: "charisma" },
  { name: "performance", displayName: "Performance", ability: "charisma" },
  { name: "persuasion", displayName: "Persuasion", ability: "charisma" },
];

export const abilities = [
  { name: "strength", abbr: "STR", displayName: "Strength" },
  { name: "dexterity", abbr: "DEX", displayName: "Dexterity" },
  { name: "constitution", abbr: "CON", displayName: "Constitution" },
  { name: "intelligence", abbr: "INT", displayName: "Intelligence" },
  { name: "wisdom", abbr: "WIS", displayName: "Wisdom" },
  { name: "charisma", abbr: "CHA", displayName: "Charisma" },
];

export const getAbilityAbbr = (ability) => {
  const abilityObj = abilities.find((a) => a.name === ability);
  return abilityObj?.abbr || ability.slice(0, 3).toUpperCase();
};

export const skillDescriptions = {
  acrobatics:
    "Balance, tumble, perform stunts, escape grapples, avoid falling damage",
  athletics: "Jump, climb, swim, grapple, shove, resist being pushed",
  deception:
    "Lie convincingly, disguise yourself, con others, create false impressions",
  herbology:
    "Identify magical plants, harvest ingredients, understand plant properties, cultivate magical flora",
  historyOfMagic:
    "Recall magical events, know famous wizards, understand magical conflicts, recognize historical artifacts",
  insight:
    "Detect lies, read emotions, understand motivations, sense hidden intentions",
  intimidation:
    "Threaten others, coerce information, demoralize enemies, display dominance",
  investigation:
    "Search for clues, find hidden objects, research information, analyze evidence",
  magicalCreatures:
    "Identify creatures, understand behaviors, handle safely, know weaknesses and strengths",
  magicalTheory:
    "Understand magical principles, earn bonus dice for spellcasting attempts!",
  medicine:
    "Stabilize dying creatures, diagnose illnesses, treat wounds, identify causes of death",
  muggleStudies:
    "Understand non-magical technology, blend into muggle society, operate muggle devices",
  perception:
    "Notice hidden things, spot danger, hear faint sounds, detect ambushes",
  performance:
    "Sing, dance, act, tell stories, play instruments, entertain crowds",
  persuasion:
    "Influence others diplomatically, negotiate deals, inspire cooperation, make friends",
  potionMaking:
    "Brew potions accurately, identify ingredients, follow complex recipes, improvise mixtures",
  sleightOfHand:
    "Pickpocket, conceal objects, perform tricks, pick locks, plant items",
  stealth:
    "Hide, move silently, sneak past guards, blend into crowds, avoid detection",
  survival:
    "Track creatures, navigate, find food/shelter, predict weather, avoid natural hazards",
};
