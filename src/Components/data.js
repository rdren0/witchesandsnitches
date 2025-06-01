export const cardTitles = {
  "Charms-Cantrips": true,
  "Charms-1st Level": false,
  "Charms-3rd Level": false,
  "Charms-4th Level": false,
  "Charms-5th Level": false,
  "Charms-6th Level": false,
  "Charms-9th Level": false,
  "Jinxes, Hexes & Curses-Cantrips": false,
  "Jinxes, Hexes & Curses-1st Level": false,
  "Jinxes, Hexes & Curses-2nd Level": false,
  "Jinxes, Hexes & Curses-3rd Level": false,
  "Jinxes, Hexes & Curses-4th Level": false,
  "Jinxes, Hexes & Curses-5th Level": false,
  "Jinxes, Hexes & Curses-7th Level": false,
  "Jinxes, Hexes & Curses-8th Level": false,
  "Transfigurations-Cantrips": false,
  "Transfigurations-1st Level": false,
  "Transfigurations-2nd Level": false,
  "Transfigurations-3rd Level": false,
  "Transfigurations-4th Level": false,
  "Transfigurations-5th Level": false,
  "Transfigurations-6th Level": false,
  "Elemental-Cantrips": false,
  "Elemental-1st Level": false,
  "Elemental-3rd Level": false,
  "Elemental-4th Level": false,
  "Elemental-8th Level": false,
  "Elemental-9th Level": false,
  "Valiant-Cantrips": false,
  "Valiant-1st Level": false,
  "Valiant-2nd Level": false,
  "Valiant-3rd Level": false,
  "Valiant-4th Level": false,
  "Valiant-5th Level": false,
  "Divinations-Cantrips": false,
  "Divinations-1st Level": false,
  "Divinations-2nd Level": false,
  "Divinations-3rd Level": false,
  "Divinations-4th Level": false,
  "Divinations-5th Level": false,
  "Divinations-6th Level": false,
  "Divinations-9th Level": false,
  "Healing-Cantrips": false,
  "Healing-1st Level": false,
  "Healing-2nd Level": false,
  "Healing-3rd Level": false,
  "Healing-4th Level": false,
  "Healing-5th Level": false,
  "Healing-6th Level": false,
  "Healing-7th Level": false,
  "Magizoo-Cantrips": false,
  "Magizoo-1st Level": false,
  "Magizoo-2nd Level": false,
  "Magizoo-3rd Level": false,
  "Magizoo-4th Level": false,
  "Magizoo-5th Level": false,
  "Magizoo-6th Level": false,
  "Magizoo-7th Level": false,
  "Magizoo-8th Level": false,
  "Grim-Cantrips": false,
  "Grim-1st Level": false,
  "Grim-2nd Level": false,
  "Grim-3rd Level": false,
  "Grim-4th Level": false,
  "Grim-6th Level": false,
  "Grim-9th Level": false,
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

export const houseAbilityBonuses = {
  Gryffindor: {
    fixed: ["constitution", "charisma"],
    choice: 1, // player chooses 1 additional ability
  },
  Hufflepuff: {
    fixed: ["constitution", "wisdom"],
    choice: 1,
  },
  Ravenclaw: {
    fixed: ["intelligence", "wisdom"],
    choice: 1,
  },
  Slytherin: {
    fixed: ["dexterity", "charisma"],
    choice: 1,
  },
  Beauxbatons: {
    fixed: ["dexterity", "wisdom"],
    choice: 1,
  },
  Durmstrang: {
    fixed: ["strength", "constitution"],
    choice: 1,
  },
  Uagadou: {
    fixed: ["strength", "dexterity"],
    choice: 1,
  },
  Mahoutokoro: {
    fixed: ["dexterity", "intelligence"],
    choice: 1,
  },
  Castelobruxo: {
    fixed: ["constitution", "dexterity"],
    choice: 1,
  },
  Koldovstoretz: {
    fixed: ["strength", "wisdom"],
    choice: 1,
  },
  "Horned Serpent": {
    fixed: ["intelligence", "charisma"],
    choice: 1,
  },
  "Wampus Cat": {
    fixed: ["dexterity", "constitution"],
    choice: 1,
  },
  Thunderbird: {
    fixed: ["strength", "charisma"],
    choice: 1,
  },
  Pukwudgie: {
    fixed: ["wisdom", "charisma"],
    choice: 1,
  },
};

export const houseFeatures = {
  Gryffindor: {
    features: [
      {
        name: "Inspiring Presence OR Bravehearted",
        description:
          "Choose between inspiring allies when they fall or advantage on fear saves",
      },
      {
        name: "True Gryffindor",
        description: "Sword of Gryffindor may present itself in dire need",
      },
    ],
    feat: true,
  },
  Hufflepuff: {
    features: [
      {
        name: "Words of Encouragement OR Neg D4",
        description: "Choose between giving d4 bonus or penalty to rolls",
      },
      {
        name: "Steadfast Loyalty OR Kitchen Trips",
        description:
          "Choose between loyalty saves or magical being interaction",
      },
    ],
    feat: true,
  },
  Ravenclaw: {
    features: [
      {
        name: "In-Depth Knowledge",
        description:
          "Treat d20 rolls of 5 or lower as 6 on Int/Wis checks with proficiency",
      },
      {
        name: "Rowena's Library",
        description: "Research topics with housemates and exclusive books",
      },
    ],
    feat: true,
  },
  Slytherin: {
    features: [
      {
        name: "Compromising Information",
        description:
          "Double proficiency bonus on Charisma checks using secrets",
      },
      {
        name: "A Noble Quality",
        description: "Adopt persona to blend in with high-ranking officials",
      },
    ],
    feat: true,
  },
  Beauxbatons: {
    features: [
      {
        name: "Nimble Evasion",
        description:
          "Evasion on Str/Dex saves - no damage on success, half on failure",
      },
      {
        name: "Exchange Student",
        description: "Insight checks to understand and emulate other cultures",
      },
    ],
    feat: true,
  },
  Durmstrang: {
    features: [
      {
        name: "Cold Efficiency",
        description:
          "Add Bombarda to known spells, cast as bonus action in combat",
      },
      {
        name: "Aggressive Endurance",
        description:
          "Stay conscious until end of next turn when reduced to 0 HP",
      },
    ],
    feat: true,
  },
  Uagadou: {
    features: [
      {
        name: "Lesser Animagus",
        description: "Gain one Animagus form at 6th level from specific list",
      },
      {
        name: "I'd Rather Use My Hands",
        description: "Add half Dex bonus to wandless spellcasting attempts",
      },
    ],
    feat: true,
  },
  Mahoutokoro: {
    features: [
      {
        name: "Quidditch Fanatic",
        description:
          "Broom proficiency, expertise if taking Quidditch background/feat",
      },
      {
        name: "Locked in Spells",
        description:
          "Choose 3 Charms, 3 DADA, 2 Transfiguration spells from 1st year for guaranteed success",
      },
    ],
    feat: true,
  },
  Castelobruxo: {
    features: [
      {
        name: "Beast Finder",
        description:
          "Spend spell slots to sense magical creatures within 100 feet",
      },
      {
        name: "Toxicology Specialist",
        description: "Advantage on Constitution saves against poison",
      },
    ],
    feat: true,
  },
  Koldovstoretz: {
    features: [
      {
        name: "Quick Brew",
        description:
          "Potioneer's Kit proficiency, brew two doses instead of one",
      },
      {
        name: "Improvised Brooms",
        description:
          "Enchant uprooted trees into brooms with spellcasting check",
      },
    ],
    feat: true,
  },
  "Horned Serpent": {
    features: [
      {
        name: "Scholar's Mind",
        description:
          "Add half proficiency to Int/Cha checks without proficiency",
      },
      {
        name: "Procedural Thinking",
        description: "Advantage on Investigation for riddles and logic puzzles",
      },
    ],
    feat: true,
  },
  "Wampus Cat": {
    features: [
      {
        name: "Warrior's Endurance",
        description: "Regain 1 HP on death save of 16+ (once per long rest)",
      },
      {
        name: "Contagious Valor",
        description:
          "Battle cry gives advantage to up to 10 allies within 60 feet",
      },
    ],
    feat: true,
  },
  Thunderbird: {
    features: [
      {
        name: "Adventurer's Footing",
        description: "No difficult terrain penalty, +5 speed, climb/swim speed",
      },
      {
        name: "Dependable Bearings",
        description:
          "Good sense of direction, advantage on navigation Survival checks",
      },
    ],
    feat: true,
  },
  Pukwudgie: {
    features: [
      {
        name: "Healer's Knack",
        description:
          "Healing spells grant temp HP equal to 1 + Wis/Cha modifier",
      },
      {
        name: "A Diplomatic Touch",
        description:
          "Meaningful help to hostile creatures may reduce their hostility",
      },
    ],
    feat: true,
  },
};

export const castingStyles = [
  "Willpower Caster",
  "Technique Caster",
  "Intellect Caster",
  "Vigor Caster",
];

export const skillsByCastingStyle = {
  "Willpower Caster": [
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
  "Technique Caster": [
    "Acrobatics",
    "Herbology",
    "Magical Theory",
    "Insight",
    "Perception",
    "Potion Making",
    "Sleight of Hand",
    "Stealth",
  ],
  "Intellect Caster": [
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
  "Vigor Caster": [
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
};

export const subclasses = [
  "Charms",
  "Jinxes, Hexes, and Curses",
  "Transfigurations",
  "Healing",
  "Divinations",
  "Magizoology",
  "Dark Arts",
  "Culinarian",
  "Herbology & Potions",
  "Arithmancy & Runes",
  "Artisan",
  "Obscurial Magic",
  "Defender",
  "Grim Diviner",
  "Astronomy",
  "Historian",
  "Ghoul Studies and Ancient Studies",
  "Quidditch",
  "Trickery",
];

export const innateHeritages = [
  "Centaurian Lineage",
  "Dryad Ancestry",
  "Elf Legacy",
  "Fey Ancestry",
  "Giant's Blood",
  "Goblin Cunning",
  "Gorgon Ancestry",
  "Hag-Touched",
  "Halfblood",
  "Metamorph Magic",
  "Muggleborn",
  "Part-Leprechaun",
  "Part-Harpy",
  "Part-Siren",
  "Parseltongue",
  "Pukwudgie Ancestry",
  "Pureblood",
  "Satyr Ancestry",
  "Troll Blood",
  "Veela Charm",
];

export const backgrounds = [
  "Activist",
  "Artist",
  "Bookworm",
  "Bully",
  "Camper",
  "Class Clown",
  "Dreamer",
  "Follower",
  "Groundskeeper",
  "Investigator",
  "Klutz",
  "Loser",
  "Potioneer",
  "Protector",
  "Quidditch Fan",
  "Socialite",
  "Troublemaker",
];

export const hpData = {
  "Willpower Caster": {
    base: 10,
    avgPerLevel: 6,
  },
  "Technique Caster": {
    base: 6,
    avgPerLevel: 4,
  },
  "Intellect Caster": {
    base: 8,
    avgPerLevel: 5,
  },
  "Vigor Caster": {
    base: 12,
    avgPerLevel: 8,
  },
};

export const standardFeats = [
  {
    name: "Accidental Magic Surge",
    preview: "Wild and unpredictable magical energy with surge effects.",
    description:
      "You have the wild and unpredictable energy of accidental magic. As a Free Action, You can choose to enhance a spell you cast. Roll a d20: on 5 or lower, roll on magic surge table; on 15 or higher, spell effects are amplified with increased damage, conditions, area, or targets.",
  },
  {
    name: "Actor",
    preview: "Master of disguise and impersonation. +1 Charisma.",
    description:
      "Increase Charisma by 1. Gain advantage on Deception/Performance checks while disguised as someone. You can mimic sounds and speech - others need Wisdom (Insight) check vs DC 8 + Charisma mod + proficiency to detect.",
  },
  {
    name: "Aerial Combatant",
    preview: "Combat expertise while flying broomsticks. +1 Str/Dex.",
    description:
      "Increase Strength or Dexterity by 1. Gain broomstick proficiency. No longer suffer disadvantage on attack rolls while flying.",
  },
  {
    name: "Alert",
    preview: "Always ready for danger. +5 initiative, can't be surprised.",
    description:
      "Can't be surprised while conscious. +5 bonus to initiative. Other creatures don't gain advantage from being unseen by you.",
  },
  {
    name: "Athlete",
    preview: "Physical prowess and mobility. +1 Str/Dex, climb speed.",
    description:
      "Increase Strength or Dexterity by 1. Gain climb speed equal to your speed. Stand up from prone with only 5 feet movement. Make running jumps after moving only 5 feet.",
  },
  {
    name: "Cantrip Master",
    preview: "Master of cantrips. Cast some wandlessly and as bonus actions.",
    description:
      "Increase spellcasting ability by 1. Cast one cantrip as bonus action per short rest. Cast locked-in cantrips without a wand. Can serve as prerequisite for Superior Wandless Casting.",
  },
  {
    name: "Detecting Traces",
    preview: "Sense and identify magical auras and spell schools.",
    description:
      "Use concentration to sense magic within 30 feet. Can see faint auras and learn spell schools. Penetrates most barriers except 1 foot stone, 1 inch metal, or 3 feet wood/dirt.",
  },
  {
    name: "Durable",
    preview: "Tough and resilient. +1 Con, advantage on death saves.",
    description:
      "Increase Constitution by 1. Advantage on Death Saving Throws. As bonus action, expend Hit Die to regain hit points.",
  },
  {
    name: "Elixir Expertise",
    preview: "Potion mastery. +1 Wis/Int, add modifier to potion effects.",
    description:
      "Increase Wisdom or Intelligence by 1. When using potions you created, add Wisdom modifier to effects (damage, healing, Save DCs).",
  },
  {
    name: "Elemental Adept",
    preview: "Master one damage type. Ignore resistance, reroll 1s.",
    description:
      "Increase Int/Wis/Cha by 1. Choose Acid, Cold, Fire, Lightning, or Thunder. Spells ignore resistance to that type. Treat 1s on damage dice as 2s. Repeatable for different elements.",
  },
  {
    name: "Empowered Restoration",
    preview: "Enhanced healing magic and metamagic options.",
    description:
      "Healing spells restore additional hit points equal to Intelligence modifier. Gain Empowered Healing metamagic: spend sorcery points to maximize healing dice.",
  },
  {
    name: "Fade Away",
    preview: "Vanish when hurt. +1 Dex/Int, reaction invisibility.",
    description:
      "Increase Dexterity or Intelligence by 1. After taking damage, use reaction to become invisible until end of next turn or until you attack/damage/force saves.",
  },
  {
    name: "Flames of Fiendfyre",
    preview: "Command fiendfyre. +1 Int/Cha, reroll fire damage 1s.",
    description:
      "Increase Intelligence or Charisma by 1. Reroll 1s on fire damage dice. When casting fire spells, wreathed in flames until next turn - melee attackers take 1d4 fire damage.",
  },
  {
    name: "Lucky",
    preview: "Luck points for advantage/disadvantage manipulation.",
    description:
      "Gain Luck Points equal to proficiency bonus. Spend 1 to give yourself advantage on d20 tests or impose disadvantage on attacks against you. Regain on long rest.",
  },
  {
    name: "Magic Initiate",
    preview: "Learn spells from another school of magic.",
    description:
      "Choose a school of magic. Lock in two cantrips from that school. Learn one 1st level spell from same school - cast once per long rest at lowest level.",
  },
  {
    name: "Metamagic Adept",
    preview: "Additional metamagic options and sorcery points.",
    description:
      "Learn two Metamagic options from sorcerer class. Gain 2 sorcery points for Metamagic use only. Can replace options on level up.",
  },
  {
    name: "Mobile",
    preview: "Speed and mobility in combat. +10 speed.",
    description:
      "+10 feet speed. Difficult terrain doesn't slow Dash action. Melee attacks don't provoke opportunity attacks from target.",
  },
  {
    name: "Observant",
    preview: "Sharp senses and lip reading. +1 Int/Wis.",
    description:
      "Increase Intelligence or Wisdom by 1. Read lips if you can see mouth and understand language. +5 bonus to passive Perception and Investigation.",
  },
  {
    name: "Occlumency Training",
    preview: "Mental defenses against legilimens and veritaserum.",
    description:
      "Wisdom save to resist legilimens initially with advantage on contests. Can feed false information if you choose. Immune to veritaserum unless willing.",
  },
  {
    name: "Pinpoint Accuracy",
    preview: "Precision with ranged spells. Ignore cover, crit on 19+.",
    description:
      "Ranged spell attacks ignore half cover, treat 3/4 cover as half. Critical hit on 19+ for spell attacks. +1 to spell attack rolls.",
  },
  {
    name: "Resilient",
    preview: "Gain proficiency in one saving throw. +1 to that ability.",
    description:
      "Choose an ability you lack save proficiency in. Increase that ability by 1 and gain saving throw proficiency with it.",
  },
  {
    name: "Savage Attacker",
    preview: "Deal maximum damage once per turn.",
    description:
      "Once per turn when you hit with an attack, roll damage dice twice and use either result.",
  },
  {
    name: "Sentinel",
    preview: "Control battlefield with opportunity attacks.",
    description:
      "Opportunity attacks reduce target speed to 0. Creatures provoke even with Disengage. React to attack creatures attacking your allies within 5 feet.",
  },
  {
    name: "Skill Expert",
    preview: "Become expert in skills. +1 ability, proficiency, expertise.",
    description:
      "Increase one ability by 1. Gain proficiency in one skill. Choose one proficient skill to gain Expertise (double proficiency).",
  },
  {
    name: "Spell Sniper",
    preview: "Enhanced ranged spells. Double range, ignore cover.",
    description:
      "Double range of attack roll spells. Ranged spell attacks ignore half and 3/4 cover. Lock in one attack roll cantrip from any list.",
  },
  {
    name: "Superior Wandless",
    preview: "Cast all locked-in spells without a wand.",
    description:
      "Prerequisites: Cantrip Master or Wandless Magic. Can cast any locked-in spells wandlessly, not just cantrips.",
  },
  {
    name: "Tough",
    preview: "Increased hit points. +2 HP per level.",
    description:
      "Hit Point maximum increases by 2 × character level. Gain +2 HP each time you level up thereafter.",
  },
  {
    name: "War Caster",
    preview: "Combat spellcasting. Advantage on concentration saves.",
    description:
      "Increase Int/Wis/Cha by 1. Advantage on concentration saves. Cast spells as opportunity attacks instead of weapon attacks.",
  },
  {
    name: "Wandless Magic",
    preview: "Cast basic spells without a wand.",
    description:
      "Cast these spells wandlessly if known: accio, alohomora, colovaria, illegibilus, incendio glacia, pereo, wingardium leviosa. Cannot use higher level spell slots.",
  },
];

export const castingStyleFeats = [];

export const SCHOOL_TO_MODIFIER_MAP = {
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
  divination: {
    abilityScore: "wisdom",
    wandModifier: "divinations",
  },
};
