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
      {
        name: "Exploit Weakness",
        level: 1,
        description:
          "Starting at 1st level, your technical prowess with spells and dueling has led you to notice others weaknesses. Once per turn, when you hit a creature with an attack, you can expend one spell slot to deal extra damage to the target, in addition to the spell's regular damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8. The damage is always the same type of damage that the triggering spell inflicted.",
      },
      {
        name: "Spell Deflection",
        level: 3,
        description:
          "At 3rd level, when you are the target of a spell or included in the area of a spell, you can deflect the spell as a reaction. The spell must be on your list of known spells and you spend a number of sorcery points equal to twice that spell's level. Upon deflection, you automatically succeed on your saving throw against the spell and you can direct the spell's effect to a creature within 10 feet of you, if desired. If the spell does not have a saving throw, it has no effect on you. If a creature was also targeted by the spell or included in the area of the spell, you cannot redirect the spell to that creature.",
      },
      {
        name: "Technical Metamagics",
        level: 3,
        description:
          "You may add the following Metamagic options to the list of Metamagics you can choose from as you level up as a technique caster. Bouncing Spell: When a creature succeeds at a saving throw against a single-target spell you cast, you can spend 2 Sorcery Points to have the spell bounce, targeting another creature of your choice within 30 ft. of the original target without spending another spell slot or taking an additional action. Maximized Spell: When you roll damage for a leveled spell, you can spend a number of Sorcery Points equal to twice the spell's level to deal maximum damage to one target of the spell. Maximized spell can not be applied to Exploit Weakness damage. Seeking Spell: If you make an attack roll for a spell and miss, you can spend 2 Sorcery Points to reroll the d20, and you must use the new roll. You can use Seeking Spell even if you have already used a different Metamagic option during the casting of the spell.",
      },
      {
        name: "Sorcerous Restoration",
        level: 20,
        description:
          "When you reach 20th level, you regain 4 expended sorcery points whenever you finish a short rest.",
      },
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
      {
        name: "Double Check Notes",
        level: 1,
        description:
          "Once per long rest, you may use a Bonus Action to check over your notes when you fail to cast a spell correctly. When you do so, you may gain an extra attempt to cast the spell you failed.",
      },
      {
        name: "Ritual Casting",
        level: 1,
        description:
          "Your ability to recall information allows you to freely cast spells, as long as you have enough time to stop and focus. At 1st level, you can cast a spell as a ritual if that spell has the ritual tag and you know the spell. A ritual version of a spell takes only 1 minute longer to cast than normal. It also doesn't expend a spell slot, which means the ritual version of a spell can't be cast at a higher level.",
      },
      {
        name: "Tactical Wit",
        level: 3,
        description:
          "Your keen ability to assess tactical situations allows you to act quickly in battle. When calculating your Initiative you may use your Intelligence modifier rather than Dexterity (Whichever is higher). Additionally, you have learned to weave your magic to fortify yourself against harm. When you are hit by an attack or you fail a saving throw, you can use your reaction to gain a +2 bonus to your AC against that attack or a +4 bonus to that saving throw. When you use this feature, you can't cast spells other than cantrips until the end of your next turn.",
      },
      {
        name: "Sharp Senses",
        level: 1,
        description:
          "Your ability to avoid incoming spells is superior to your peers. Your AC equals 11 + your Dexterity modifier",
      },
      {
        name: "Diverse Studies",
        level: 3,
        description:
          "At 3rd level, you gain two level 1 features of your chosen School of Magic.",
      },
      {
        name: "Arcane Recovery",
        level: 20,
        description:
          "When you reach 20th level, you have learned to regain some of your magical energy by studying in your free time. Whenever you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than 10, and none of the slots can be 6th level or higher.",
      },
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
      {
        name: "Easy Target",
        level: 1,
        description:
          "Your large, strong body makes you easy to see and easy to hit. Your AC equals 8 + your Dexterity Modifier",
      },
      {
        name: "Rated E for Everyone",
        level: 1,
        description:
          "Your unarmed strikes deal damage equal to 1d6 + your Strength mod. This damage increases by 1d6 when you reach certain levels: 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
      },
      {
        name: "Metamagic: Rage",
        level: 3,
        description:
          "At 3rd level, when in battle, you fight with primal ferocity. On your turn, you can spend 5 sorcery points to enter a rage as a bonus action. While raging, you gain the following benefits when you aren't wearing armor: You have advantage on Strength checks and Strength saving throws. You have resistance to bludgeoning, piercing, slashing and fire damage. You can't cast spells with an area of effect (cube, line, sphere, or cone) or concentrate or dedicate on spells while raging. When you make an unarmed strike, using strength, you gain a +2 bonus to the damage roll. This damage increases to +3 at 10th level, and +4 at 16th level. Your rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.",
      },
      {
        name: "Relentless Rage",
        level: 11,
        description:
          "Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you're raging and don't die outright, you can make a DC 15 Constitution saving throw. If you succeed, you drop to 1 hit point instead. Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 15.",
      },
      {
        name: "Vigorous Perfection",
        level: 20,
        description:
          "At 20th level, your Constitution score increases by 4. Your maximum for this score is now 24.",
      },
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
    baseAC: "15 + DEX modifier",
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
      {
        name: "Sorcerous Resilience",
        level: 1,
        description:
          "The accidental magic in your early childhood never stopped protecting you. Your AC equals 15 + your Dexterity modifier.",
      },
      {
        name: "Metamagic: Fierce Spell",
        level: 3,
        description:
          "At 3rd level, when you cast a spell, you can spend 2 sorcery points to cast that spell as if it were cast using a spell slot one level higher than its original level, or 4 sorcery points to cast that spell two levels higher. The spell's higher level cannot exceed your highest available level of spell slots. This does not count against your number of Metamagic options.",
      },
      {
        name: "Metamagic: Resistant Spell",
        level: 3,
        description:
          "At 3rd level, when you cast a spell, you can spend 1 sorcery point per increased level to make your spell be treated by spell deflection, finite incantatem, reparifarge, or langlock as if your spell was cast using a spell slot higher than its original level, making your spell more resistant. The spell's higher level cannot exceed your highest available level of spell slots. This does not count against your number of Metamagic options.",
      },
      {
        name: "Signature Spells",
        level: 20,
        description:
          "When you reach 20th level, you gain mastery over two powerful spells and can cast them with little effort. Choose two of your known 3rd-level spells as your signature spells. You can cast each of them once at 3rd level without expending a spell slot. When you do so, you can't do so again until you finish a short or long rest.",
      },
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
