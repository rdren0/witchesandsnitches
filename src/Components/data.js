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

export // Data from the rulebook organized by school
const housesBySchool = {
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
};

export const castingStyles = [
  "Willpower Caster",
  "Technique Caster",
  "Intellect Caster",
  "Vigor Caster",
];

// Skills organized by casting style - each caster can pick 2 from their list (from rulebook)
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
    base: 10, // 1d10 at 1st level
    avgPerLevel: 6, // 1d10 (or 6) per level after 1st
  },
  "Technique Caster": {
    base: 6, // 1d6 at 1st level
    avgPerLevel: 4, // 1d6 (or 4) per level after 1st
  },
  "Intellect Caster": {
    base: 8, // 1d8 at 1st level
    avgPerLevel: 5, // 1d8 (or 5) per level after 1st
  },
  "Vigor Caster": {
    base: 12, // 1d12 at 1st level
    avgPerLevel: 8, // 1d12 (or 8) per level after 1st
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
