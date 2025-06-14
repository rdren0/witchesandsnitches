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
    choice: 1,
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

export const subclassesData = {
  Charms: {
    name: "Charms",
    description:
      "Masters of precision magic and enchantments with advanced spell techniques",
    level1Features: [
      {
        name: "Bewitching Studies",
        description:
          "At 1st level, you gain Target Practice and choose one additional feature that defines your approach to charms magic.",
      },
      {
        name: "Target Practice",
        description:
          "You've honed your aim to be able to strike very specifically with your dueling Charms. When casting a Charm, you can target specific items or body parts, as well as restrict the effects of the charm to only that specific item or body part.",
      },
    ],
    level1Choices: [
      {
        name: "Lightning Fast Wand",
        description:
          "You've honed your senses to be able to strike very specifically with your dueling Charms. Whenever you add your spellcasting ability modifier to a spell attack roll, add half your Dexterity modifier (rounded up) as a bonus as well. Additionally, you have advantage on initiative rolls.",
      },
      {
        name: "Protective Enchantments",
        description:
          "You gain access to the Protego spell. Additionally, when you cast a Protego, you may choose to affect a friendly creature within 30 feet. When you or a friendly creature is affected by one of your protego spells, they may roll 1d4 and add that number to the AC bonus of the spell. At 5th level, you gain access to Protego Maxima and can cast either spell twice per round as reactions.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 4,
        name: "Mastered Charms (Optional)",
        description:
          "Choose five cantrips as Mastered Charms, each castable once per short rest as a bonus action. +1 Dexterity (max 20).",
      },
      {
        level: 6,
        name: "Advanced Charmswork",
        description:
          "Choose Rapid Casting (cast multiple charms per action) or Professional Charmer (enhanced spell versions).",
      },
      {
        level: 9,
        name: "Double Cast",
        description:
          "Target an additional creature with non-damage spells without using extra spell slots (once per long rest).",
      },
    ],
    summary:
      "Precise targeting with enhanced initiative and defensive magic, progressing to rapid casting and professional spell enhancements.",
  },

  "Jinxes, Hexes, and Curses": {
    name: "Jinxes, Hexes, and Curses",
    description:
      "Specialists in harmful magic, curse-breaking, and dark arts combat",
    level1Features: [
      {
        name: "Practical Studies",
        description:
          "At 1st level, you choose a specialization that defines your approach to dark magic - either becoming an Auror-in-training or focusing on curse-breaking techniques.",
      },
    ],
    level1Choices: [
      {
        name: "Auror Training",
        description:
          "You've started practicing skills to become an Auror. You learn potion recipes, gain an Auror's kit with tracking tools and healing vials (1d4 HP per dose, proficiency bonus doses per long rest), and gain proficiency in two of: Investigation, Potion-Making, Stealth, Survival.",
      },
      {
        name: "Curse-Breaking",
        description:
          "Your curiosity in dismantling spells has found an outlet. When you or an ally within 5 feet are targeted by any Jinx, Hex, Curse, or Dark spell, you can use your reaction to make a spellcasting ability check (DC 10 + spell level). On success, you change the spell into a different locked-in JHC or Dark spell of your choosing.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 6,
        name: "Combat-Ready",
        description:
          "Choose Forceful Magic (bonus action melee spell attacks) or Magical Adrenaline (heal 1d10 + level as bonus action).",
      },
      {
        level: 9,
        name: "Enhanced Curses",
        description:
          "When you hit with a Jinx, Hex, or Curse, bonus action for additional damage equal to JHC + Charisma modifier.",
      },
      {
        level: 10,
        name: "Specialized Skills",
        description:
          "Choose Dark Traces (detect dark beings/magic) or Ward-Breaker (redirect area spells back to caster - requires Curse-Breaking).",
      },
      {
        level: 14,
        name: "Cursemaster",
        description:
          "Choose Dark Duelist (advantage vs dark spells, cast JHC spells one level higher) or Defensive Arts (4d6 force damage when spells miss you).",
      },
    ],
    summary:
      "Auror training with tracking abilities or curse-breaking expertise, progressing to combat magic and dark arts mastery.",
  },

  Healing: {
    name: "Healing",
    description:
      "Compassionate healers and medical magic specialists with advanced support abilities",
    level1Features: [
      {
        name: "Medical Studies",
        description:
          "At 1st level, you gain Star Grass Salve and choose one specialization that defines your approach to healing magic and support.",
      },
      {
        name: "Star Grass Salve",
        description:
          "You learn the star grass salve recipe. Use Intelligence (Potion Making) or Wisdom (Medicine) for brewing checks instead of Wisdom (Potion Making). When administering salve to others, it heals additional HP equal to your level.",
      },
    ],
    level1Choices: [
      {
        name: "Unshakable Nerves",
        description:
          "Your study of injuries and diseases has strengthened your resolve. You cannot be frightened by non-magical effects and have advantage on Constitution saving throws.",
      },
      {
        name: "Powerful Healer",
        description:
          "Your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points, the creature regains additional hit points equal to 2 + the spell's level. Unlocks 'An Ounce of Prevention' at 6th level.",
      },
      {
        name: "Therapeutic Friendship",
        description:
          "Create magical bonds among willing creatures (up to proficiency bonus) within 30 feet for 10 minutes. Bonded creatures can add 1d4 to attack rolls, ability checks, or saving throws when within 30 feet of each other (once per turn). Unlocks 'A Saving-People Thing' progression.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 4,
        name: "Restorative Presence (Optional ASI)",
        description:
          "Choose Preserve Life (distribute healing points among multiple targets) or Life Balm (movement + area healing).",
      },
      {
        level: 6,
        name: "Dedicated Protector",
        description:
          "Choose An Ounce of Prevention (self-heal when healing others - requires Powerful Healer), A Saving-People Thing (protective teleportation for bonded allies), or Potent Spellcasting (bonus radiant damage).",
      },
      {
        level: 9,
        name: "Spell Breaker",
        description:
          "When healing with spells, can also end one spell on the target (spell level ≤ healing spell slot level).",
      },
      {
        level: 10,
        name: "Moral Support",
        description:
          "Choose Never Give Up (death save advantage + bonus healing), Emergency Care Plan (doubled healing ranges), or When It Matters (NPC rescue feature).",
      },
      {
        level: 18,
        name: "Savior",
        description:
          "Choose Empathic Bond (enhanced friendship abilities - requires A Saving-People Thing) or Supreme Healing (maximize all healing dice).",
      },
    ],
    summary:
      "Medical expertise with three paths: resilience training, enhanced healing power, or magical friendship bonds with protective abilities.",
  },

  Divinations: {
    name: "Divinations",
    description: "Seers and prophets who glimpse the future and navigate minds",
    level1Features: [
      {
        name: "Clairvoyant Studies",
        description:
          "At 1st level, you gain a Diviner's Kit and proficiency with it. You add half your proficiency bonus to Initiative and cannot be surprised while conscious. Choose one specialization that defines your prophetic abilities.",
      },
    ],
    level1Choices: [
      {
        name: "Foresight",
        description:
          "You start seeing omens everywhere. After a long rest, roll two d20s and record them as foresight rolls. You can expend these rolls to replace attack rolls, saving throws, or ability checks for yourself or visible creatures (once per turn). Gain a third foresight roll at 10th level. Unlocks Greater Foresight at 14th level.",
      },
      {
        name: "Legilimency",
        description:
          "You add Legilimens to your locked spells and can cast it at-will (verbally or non-verbally). Attempts to resist your Legilimens are made at disadvantage. Unlocks advanced mind control abilities: Skilled Occlumens (6th), Darting Eyes (14th), and Master of Minds (18th).",
      },
    ],
    higherLevelFeatures: [
      {
        level: 6,
        name: "Farseeing",
        description:
          "Choose Font of Divination (regain spell slots when casting divination spells) or Skilled Occlumens (immunity to mental intrusion + false information control - Legilimency path).",
      },
      {
        level: 9,
        name: "Sensing Danger",
        description:
          "Add full proficiency bonus to initiative and half your Divinations modifier to AC (minimum +1).",
      },
      {
        level: 10,
        name: "The Unseeable",
        description:
          "Choose Third Eye (enhanced perception abilities: darkvision, language comprehension, or see invisibility) or Mystic Sleep (dream communication, scrying, and portal creation).",
      },
      {
        level: 14,
        name: "Revealed Intentions",
        description:
          "Auto-succeed one failed downtime activity per downtime. Choose Greater Foresight (reroll one foresight die daily - requires Foresight) or Darting Eyes (combat mind control - requires Legilimency).",
      },
      {
        level: 18,
        name: "Mystical Knowledge",
        description:
          "Choose Vivid Visions (see and execute perfect future actions) or Master of Minds (weaponized Legilimens with psychic damage - requires Legilimency).",
      },
    ],
    summary:
      "Two distinct paths: Foresight (probability manipulation and future sight) or Legilimency (mind reading and mental control), each with unique progression chains.",
  },

  Magizoology: {
    name: "Magizoology",
    description:
      "Beast masters and creature experts with magical companions and nature magic",
    level1Features: [
      {
        name: "Biological Studies",
        description:
          "At 1st level, your study of magical creatures allows you to cast any known Healing spells on beasts. You gain a small trunk that carries magical beasts inside. Choose one specialization that defines your approach to creature study.",
      },
    ],
    level1Choices: [
      {
        name: "Studious",
        description:
          "You maintain a personal notebook of beast findings. Whenever you add your Magical Creatures proficiency to an ability check, also add your Intelligence modifier. Focuses on academic knowledge and creature analysis.",
      },
      {
        name: "Creature Empathy",
        description:
          "You have innate ability to communicate with bestial creatures. As an action, communicate simple ideas to creatures with Intelligence 3+ and read their basic mood, intent, emotional state, magical effects, needs, and how to avoid their attacks. Focuses on emotional connection and communication.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 6,
        name: "Way of the Wild",
        description:
          "Core: Wizard's Best Friend (beast companion with Command Dice system). Choose: Basically a Disney Princess (Magizoo spell list access) or Prepared Ambush (magical trap weaving).",
      },
      {
        level: 9,
        name: "Call Beasts",
        description:
          "High-pitched wail summons swarms to attack moving creatures (2d12 slashing damage in 5-foot squares). Once per short rest reaction ability.",
      },
      {
        level: 10,
        name: "Outdoorswizard",
        description:
          "Core: Gentle Caretaker (enhanced beast companion stats). Choose: Survivalist (terrain mastery + group travel benefits) or Monster Hunting (analyze creature resistances/immunities).",
      },
      {
        level: 14,
        name: "Genus Genius",
        description:
          "Choose: Beast Whisperer (calm hostile beasts), Exploited Vulnerabilities (mark weaknesses for allies), Based Magizoologist (healing aura for companions), or Friend of All (natural creatures hesitant to attack).",
      },
      {
        level: 18,
        name: "Sixth Sense",
        description:
          "Choose: Draconic Empathy (dragon companions if you've raised one from egg - requires Wizard's Best Friend) or Hunter's Reflexes (reaction spellcasting to interrupt enemy actions).",
      },
    ],
    beastCompanionSystem: {
      description:
        "Complex companion system with Command Dice (d6, becomes d8 at 14th), Beast Commands (Attack, Down, Find, Grab, Rush), and scaling companion stats.",
      spellList:
        "Magizoo Spell List includes creature communication, summoning, control, and transformation spells (Insectum, Bestia Vinculum, Obtestor, Imperio Creatura, Draconiverto, etc.)",
    },
    summary:
      "Two paths: Studious (academic analysis) or Creature Empathy (emotional bonds). Both gain beast companions and can specialize in spell access, trap-making, survivalism, or monster hunting.",
  },

  "Dark Arts": {
    name: "Dark Arts",
    description:
      "Practitioners of forbidden magic with corruption-based power and dangerous abilities",
    level1Features: [
      {
        name: "Tricks of the Trade",
        description:
          "At 1st level, you learn to create Liquid Darkness potions (magical smoke for concealment/area denial + brewing assistance using Charisma/Perception). Choose one dark specialization that defines your approach to forbidden magic.",
      },
      {
        name: "Liquid Darkness",
        description:
          "You learn the Liquid Darkness potion recipe. When brewing, you can use Charisma (Persuasion) for asking help or Wisdom (Perception) for cheating instead of Wisdom (Potion Making). Creates concealing magical smoke when consumed or thrown.",
      },
    ],
    level1Choices: [
      {
        name: "Embracing the Darkness",
        description:
          "You gain power through corruption. Gain additional Sorcery Points equal to your Corruption Points, but take 1d4 psychic damage per corrupted sorcery point used. Higher corruption unlocks enhanced abilities at later levels.",
      },
      {
        name: "Malice",
        description:
          "Channel anger into malicious curses. As a bonus action, curse a creature within 30 feet for 1 minute: gain proficiency bonus damage (once per spell), critical hits on 19-20, and heal when the target dies (level + spellcasting modifier HP). Once per short rest.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 6,
        name: "Acolyte of Shadows",
        description:
          "Core: Forbidden Knowledge (access Restricted Section for dark spells). Choose: Wrathful Magic (5 + 2×level necrotic damage reactions) or Dark Intentions (Frightening or Judging effects, 2/long rest).",
      },
      {
        level: 9,
        name: "Death Wish",
        description:
          "Mark creatures for termination - next attack against marked target has vulnerability to all damage. Uses equal to half spellcasting modifier per long rest.",
      },
      {
        level: 10,
        name: "Deeper Darkness",
        description:
          "Choose: Visions of Death (Wisdom save or deafened + 3d10/6d10 psychic damage) or Dark Duelist (auto-upcast dark spells + random metamagic if corrupted enough).",
      },
      {
        level: 14,
        name: "Precision Strike",
        description:
          "Choose: Advanced Defenses (dual-cast with protego), Dark Curse (spell attacks cause exhaustion), or Greater Judgment (reaction spell attacks - requires Dark Intentions).",
      },
      {
        level: 18,
        name: "Consumed By The Dark",
        description:
          "Choose: Punishment (attackers take psychic damage equal to Charisma modifier) or Suffering (double spell attack damage on failed Constitution saves based on corruption level).",
      },
    ],
    corruptionSystem: {
      description:
        "Corruption Points enhance power but increase risks. Higher corruption unlocks random metamagic effects and determines save DCs for ultimate abilities.",
    },
    summary:
      "Two paths: Embracing corruption for enhanced power with risks, or Malice for curse-based combat. Both progress toward forbidden knowledge and devastating late-game abilities.",
  },

  Culinarian: {
    name: "Culinarian",
    description:
      "Masters of magical cooking with recipe-based buffs and culinary battlefield control",
    level1Features: [
      {
        name: "Foodie",
        description:
          "At 1st level, you gain the Recipes feature (prepare proficiency bonus meals per long rest from 20+ magical recipes with quality levels) and proficiency in Survival and Constitution saves. Choose your culinary specialization approach.",
      },
      {
        name: "Recipes System",
        description:
          "Learn 3 recipes initially from extensive list (Chocolate Frogs, Pepper Imps, magical steaks, etc.). Recipes have quality levels: Flawed, Regular, Exceptional, Superior. Creatures consume meals as bonus actions for various buffs, healing, and utility effects lasting minutes to hours.",
      },
    ],
    level1Choices: [
      {
        name: "Cooking by the Book",
        description:
          "Your culinary expertise overlaps with potion-making. Use Survival (Wisdom) instead of Potion-Making (Wisdom) when brewing potions. Gain advantage on Constitution saving throws due to fearless self-experimentation and iron stomach.",
      },
      {
        name: "No Reservations",
        description:
          "You're a devoted lover of Muggle cuisine and cultural foods. Gain proficiency in Muggle Studies. When Culinarian features require Survival (Wisdom) checks, you can use Muggle Studies (Intelligence) instead for your broad culinary knowledge.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 4,
        name: "Honorary House Elf (Optional ASI)",
        description:
          "Favorite Food: Learn creatures' favorite foods through Insight checks, then use Survival instead of Persuasion when giving them their preferred meals.",
      },
      {
        level: 6,
        name: "Worldly Insights",
        description:
          "Choose: Fast Food (summon completed locked-in recipes from kitchens as action, uses equal to spellcasting modifier) or Yes, Chef! (Help action as bonus + advantage if they yell 'Yes, Chef!').",
      },
      {
        level: 9,
        name: "Nourishment",
        description:
          "Whenever allies consume your recipes, they gain 2d6 + highest mental ability modifier temporary hit points in addition to the recipe's normal effects.",
      },
      {
        level: 10,
        name: "Main Dish",
        description:
          "Choose: Sugar Rush (meals grant extra action for spells/utility), Dinnertime Bonding (semester banquets grant attendees Foresight rolls for satisfactory answers).",
      },
      {
        level: 14,
        name: "Pièce de Résistance",
        description:
          "Enhanced versions: YES! CHEF! (force disadvantage on saves), Royal Banquet (2 Foresight rolls + secret bonuses), or Eating Contest Champion (consume 2 meals per bonus action).",
      },
      {
        level: 18,
        name: "Michelin Starred Chef",
        description:
          "Choose: It's F*cking Raw! (force-feed meals at range, choose positive/negative effects) or Where's The Lamb Sauce! (60ft psychic damage aura + thrown kitchen utensil attacks).",
      },
    ],
    recipeSystem: {
      description:
        "20+ magical recipes with scaling quality levels. Effects include: ability bonuses, damage resistance/immunity, healing, speed boosts, special movement, damage auras, telepathic links, and unique utility effects.",
      examples:
        "Chocolate Frog (condition removal), Pepper Imp (damage aura), Diricawl Jerky (teleportation swapping), Longbottom Stew (damage resistance), Twinkie (healing)",
    },
    summary:
      "Two paths: Traditional cooking expertise or Muggle cuisine mastery. Both create magical meals with extensive buff effects and can progress toward kitchen summoning, team coordination, or devastating culinary combat abilities.",
  },

  "Herbology & Potions": {
    name: "Herbology & Potions",
    description:
      "Botanical experts and master brewers who specialize in plant cultivation and potion creation, known as 'Bottle Fame'",
    level1Features: [
      {
        name: "Bottle Fame",
        description:
          "At 1st level, you gain expertise in either potions or herbology, developing a deep connection to the natural magical arts. Choose your specialization path between The Subtle Science (potions) or Green Thumb (herbology).",
      },
    ],
    level1Choices: [
      {
        name: "The Subtle Science",
        description:
          "You inherit a well-loved potions textbook filled with ancestral notes. Gain Potions Kit and proficiency in Potions Kit and Potion-Making. Add Intelligence modifier to Potion Making (Wisdom) checks. Access to 3 additional common potion recipes, learning 2 Uncommon at level 6, 1 Rare at level 10, and 1 Very Rare at level 14.",
      },
      {
        name: "Green Thumb",
        description:
          "Gain Herbology Kit and proficiency in Herbology Kit and skill. Cast Orchideous wordlessly, wandlessly at will. Add Wisdom to Herbology (Intelligence) checks. Receive portable greenhouse and plant companions with combat abilities: Attack (extra 1d8 piercing damage once per turn), Symbiotic Connection (Herbology modifier to initiative), and enhanced movement/terrain ignoring during combat.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 3,
        name: "Crafted Sorcerer",
        description:
          "Choose: Metapotions (Mastery Points instead of Sorcery Points to modify potions with special effects like Atomized, Delayed, Empowered, etc.) or Natural Evocations (Nature Points for abilities like Nature's Wrath, Tree Stride, Summon Spirit).",
      },
      {
        level: 4,
        name: "Toxic Presence (Optional ASI)",
        description:
          "Constant exposure to toxins makes you venomous. When creatures move within 10ft or start turn there, use reaction to deal 1d4 necrotic damage (Constitution save negates). Damage scales: 1d6 at 6th, 1d8 at 10th, 1d10 at 14th level.",
      },
      {
        level: 6,
        name: "Brew Glory",
        description:
          "Gain proficiency in Herbology/Potion-Making or Expertise if already proficient. Choose: Plant Veil (+10 Stealth when camouflaged, plant gains Defend/Deflect), Don't Waste a Drop (dilute potions to create multiple lower-quality versions), or Herbivify (heal allies with plant energy using d6s equal to level).",
      },
      {
        level: 9,
        name: "Delayed Sorcery",
        description:
          "Finally gain access to Sorcery Points and Metamagic abilities as shown on progression table, starting with 5 Sorcery Points and 1 Metamagic option.",
      },
      {
        level: 10,
        name: "Asphodel and Wormwood",
        description:
          "Gain Expertise in Herbology or Potion-Making. Choose: Entangle (create protective dome for allies), Whirlwind (plant attacks multiple targets), Designated Taste Tester (auto-identify harmful substances + immunity to blinded/deafened/frightened/poisoned), or Quick-Brew Mastery (brew potions in rounds using Mastery Points).",
      },
      {
        level: 14,
        name: "The Delicate Power of Liquids",
        description:
          "Choose: Metapotion Prodigy (unlimited metapotion effects per potion), My Friend Felix (brew lesser Felix Felicis once per semester for 3 monthly luck points), or Nature's Sanctuary (beasts/plants hesitant to attack + plant companion gains Dodge reaction).",
      },
      {
        level: 18,
        name: "Mind and Body",
        description:
          "Choose: Snape's Greasy Hair (immunity to disease + resistance to acid/necrotic/poison damage) or Plant Aspect (immunity to acid/necrotic/poison damage and disease + vulnerability to fire).",
      },
    ],
    specialSystems: {
      metapotions:
        "15+ modification effects including Alluring, Atomized, Delayed, Diluted, Distilled, Empowered, Enhanced, Extended, Innocuous, Maximized Toxin, Potioneer's Dart, Quick-Brew, and Tailored Toxin",
      naturalEvocations:
        "Nature's Wrath (reroll missed attacks), Carnivorous Force (temp HP + spell bonuses), Tree Stride (teleport between trees), Summon Spirit (elemental spirits with damage auras)",
      plantCompanions:
        "Portable greenhouse with Walking Shrub, Bouncing Bulb Patch, Fire-Seed Bush, plus combat companions like Silver-Leaf Tree, Fanged Geranium, Devil's Snare, Venomous Tentacula",
    },
    summary:
      "Two distinct paths: Potions mastery with Metapotion modifications and advanced brewing techniques, or Herbology expertise with plant companions and Natural Evocations. Both paths eventually gain delayed Sorcery abilities and can achieve immunity to various damage types at high levels.",
  },
  "Arithmancy & Runes": {
    name: "Arithmancy & Runes",
    description:
      "Masters of ancient magical theory who specialize in runic inscriptions and mathematical spell manipulation, known as 'Alternate Spellcasters'",
    level1Features: [
      {
        name: "Alternate Spellcaster",
        description:
          "Learn Flagrate spell (cast as free action, always subtle). Gain access to Ancient Spellbook containing Runic and Arithmantic spells that can be cast subtly without sorcery points. Choose your specialization approach between School of Magic Expert or Researcher.",
      },
    ],
    level1Choices: [
      {
        name: "School of Magic Expert",
        description:
          "Choose one school for +1 modifier and special ability: Divinations (force rerolls 2/long rest), Charms (charm creatures within 5ft), Transfigurations (halve/double weight), Healing (magical ward from healing spells), or JHC (Dark Empowerment for AC/speed/concentration bonuses).",
      },
      {
        name: "Researcher",
        description:
          "Extensive spell study grants early access to advanced magic. Add Devicto spell with both Arithmantic AND Runic tags to spellbook. Add half Wisdom modifier to spell research checks. All successfully researched spells gain both magical tags.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 4,
        name: "Extended Downtime (Optional ASI)",
        description:
          "Increase Intelligence or Wisdom by 1 (max 20). Gain additional downtime slot for spell research, practice (two attempts), or teaching Ancient Spellbook spells to other characters.",
      },
      {
        level: 6,
        name: "Exhaustive Studies",
        description:
          "Choose: Enhanced Spellwork (spells cast in appropriate classes gain tags + special effects: Runic spells get dedication extension/psychic damage, Arithmantic get range extension/dedication to concentration) or Private Lessons (extra spell attempts, reduced DC, access to specialized spell lists).",
      },
      {
        level: 9,
        name: "Resilient Mind",
        description:
          "Gain proficiency in Wisdom saving throws. If already proficient, choose Intelligence or Charisma saving throws instead.",
      },
      {
        level: 10,
        name: "Distinctive Approach",
        description:
          "Choose: Spellmaker (create spells in 2 downtime slots, 19-20 completes in one slot, dual-tagged spells cast at -1 level) or Metamagical Application (5 Sorcery Points + unique metamagics: Converted, Controlled, Triggered, Continued Spell).",
      },
      {
        level: 14,
        name: "Rare Talents",
        description:
          "Choose: Nimble Fingers (Sleight of Hand proficiency/expertise + add half Dex modifier to dual-tagged spell attacks/saves) or School of Magic Prodigy (enhanced school abilities: guaranteed success/failure, twin charms, gravity field, spell resistance, extra Dark Empowerment).",
      },
      {
        level: 18,
        name: "Practiced and Prepared",
        description:
          "Choose: Perfected Spellwork (requires Enhanced Spellwork - maximize damage dice for Runic spells, maximize healing dice for Arithmantic spells once per round) or Spell Tome (requires Private Lessons - lock spells after one success, gain access to additional specialized spell lists).",
      },
    ],
    specialSystems: {
      ancientSpellbook:
        "Unique spells with Runic/Arithmantic tags including Facias Infirmitatem, Utilitatem, Impulso, Exagitatus, Maledicto, Sagittario Maxima, Sanitatem, Potentia Spiculum",
      runicEffects:
        "Dedication extension (+1 minute), extra 1d6 psychic damage once per round",
      arithmanticEffects:
        "Range extension (+10 feet), reduce Dedication spells to Concentration",
      schoolProgression:
        "Each school of magic offers specialized abilities that scale from basic utility at level 1 to powerful prodigy effects at level 14",
      spellSharing:
        "Ancient Spellbook spells can be taught to other subclasses using downtime slots or free time during sessions",
    },
    summary:
      "Two main paths: School specialization with scaling magical school abilities and enhanced spellcasting, or Research focus with spell creation and metamagical applications. Both paths utilize the Ancient Spellbook system with Runic and Arithmantic tagged spells that offer unique mechanical benefits and can be cast subtly.",
  },

  Artisan: {
    name: "Artisan",
    description:
      "Creative masters and skilled performers known as 'Skill Monkeys' who excel in magical crafting or musical performance",
    level1Features: [
      {
        name: "Skill Monkey",
        description:
          "Gain proficiency in Performance and choose your approach to mastery. Select between focused expertise in specific skills or broad competency across all abilities.",
      },
    ],
    level1Choices: [
      {
        name: "Practice Makes Perfect",
        description:
          "Gain proficiency in one skill of your choice. Choose one skill you're proficient in and gain expertise (double proficiency bonus) with that skill, representing dedicated focus and specialization.",
      },
      {
        name: "Master of None",
        description:
          "Add half your proficiency bonus (rounded down) to any ability check that doesn't already include your proficiency bonus, representing broad knowledge and adaptability across all fields.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 2,
        name: "Call to the Arts",
        description:
          "Choose your artistic specialization: Imbuement (magical item crafting with Artisanal Imbuements, learn 4 initially + more at levels 12/14/16, imbue items equal to spellcasting modifier) or Harmonancy (musical performance with charm abilities, use instruments as spellcasting focus).",
      },
      {
        level: 4,
        name: "Crafty (Optional ASI)",
        description:
          "Magically create artisan's tools in 1 hour (can coincide with rest). Double proficiency bonus for all tool-based ability checks, representing mastery over magical and mundane crafting.",
      },
      {
        level: 6,
        name: "Creative Muse",
        description:
          "Learn Animatus Locomotor spell (animate object familiars). Choose: Flash of Genius (add spellcasting modifier to ally checks/saves within 30ft) or Beguiling Performance (6 Harmonic Tunes powered by 5 d8 Harmonic dice for combat maneuvers).",
      },
      {
        level: 8,
        name: "Advanced Imbuement (Optional ASI)",
        description:
          "Attune to up to 4 magic items simultaneously. Craft common/uncommon magic items in quarter time at half cost, representing advanced understanding of magical item creation.",
      },
      {
        level: 9,
        name: "Art & Soul",
        description:
          "Choose: Song of Rest (extra 1d6 healing during short rests, scales to 1d12 at level 17) or Magic Jolt (familiar attacks deal extra 2d6 force damage or heal 2d6 HP, uses equal to spellcasting modifier).",
      },
      {
        level: 10,
        name: "Pure Talent",
        description:
          "Choose: Bombastic Rizz (majestic presence forces saves or attackers can't target you), Reliable Talent (treat d20 rolls of 9 or lower as 10), Spell-Storing Item (store 1st-2nd level spells in objects), or Magical Secrets (learn from specialist spell lists).",
      },
      {
        level: 14,
        name: "Avant-Garde",
        description:
          "Choose: Augmented Healer (imbued items grant temp HP, cast Reparifors for free), Imbuement Expert (attune to 5 items, ignore requirements), or Improved Performance (Harmonic dice become d10s, d12s at level 18).",
      },
      {
        level: 18,
        name: "Virtuoso",
        description:
          "Choose: Crafter's Spirit (+1 saves per attuned item, avoid death by ending imbuement), Imbuement Master (attune to 7 items), or Epic Performer (regain Harmonic die when rolling initiative with none remaining).",
      },
    ],
    specialSystems: {
      artisanalImbuements:
        "15+ magical item effects including Enhanced Weapon/Defense, Item of Apparition, Homunculus Servant, Arcane Propulsion Item, Spell-Refueling Item, and Replicate Magic Item options",
      harmonicTunes:
        "20+ combat maneuvers including Annoying Lick, Face Melting Solo, Power Chord, Head Bangin' Riff, Jam Out, Share The Mic, and Shredding - powered by Harmonic dice for tactical battlefield control",
      animatusLocomotor:
        "3rd level spell creating animated object familiars from inanimate items within 5-foot cube, acts independently with telepathic communication and spell delivery capabilities",
      progressionPaths:
        "Two distinct specializations: Imbuement focuses on magical item creation and attunement mastery, Harmonancy focuses on performance-based buffs and musical combat techniques",
    },
    summary:
      "Highly versatile subclass with two main paths: Imbuement specialists become master crafters with extensive magical item creation and up to 7 simultaneous attunements, while Harmonancy performers use musical magic for battlefield control and party support. Both paths offer significant skill expertise and unique magical abilities.",
  },

  "Obscurial Magic": {
    name: "Obscurial Magic",
    description:
      "Dark practitioners afflicted with volatile, self-destructive magical energy known as 'The Afflicted' - masters of chaotic Obscurus power",
    level1Features: [
      {
        name: "The Afflicted",
        description:
          "Manifestation of repressed magical abilities creating volatile Obscurus energy. The constant battle against one's own magic takes profound tolls on body and mind, requiring careful management of destructive power.",
      },
    ],
    level1Choices: [
      {
        name: "Obscurial Magic Initiate",
        description:
          "Sacrifice life force for spell power - take 1d4 damage to deal extra 1d6 damage with next spell (once per turn). Extra damage scales: 1d8 at 6th level, 1d10 at 10th level, 1d12 at 17th level. Wand glows with dark aura when activated.",
      },
      {
        name: "Obscurial Illusion",
        description:
          "Create realistic illusions as action - 5-foot cube objects with sight, sound, smell lasting 10 minutes. Creatures need Intelligence (Investigation) vs spell save DC to detect. Uses equal to proficiency bonus per short/long rest.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 6,
        name: "The Cursed",
        description:
          "Mental deterioration increases as Obscurus power grows. Lines between reality and illusion blur. Choose: Obscurial Maledict (curse enemies with 5 different effects, causes exhaustion) or Obscurial Concealment (shadow stealth, dark aura, mind shield abilities).",
      },
      {
        level: 9,
        name: "Shadow Walk",
        description:
          "Teleport up to 120 feet as bonus action between dim light or darkness areas while shrouded in Obscurus darkness, representing mastery over shadow manipulation.",
      },
      {
        level: 10,
        name: "The Beset",
        description:
          "Emotional turmoil intensifies with overwhelming negative emotions. Choose: Obscurial Spell Mastery (spend spell slots for +2d6 damage per level + paralysis effect) or Obscurial Magic Aura (10ft protective aura with necrotic damage to enemies, resistance for allies).",
      },
      {
        level: 14,
        name: "The Madness",
        description:
          "Obscurus takes firm hold, eroding mental balance. Choose: Obscurial Frenzy (1-minute berserk state with advantage, multi-attack, but loss of control and inability to cast spells) or Obscurial Consumption (drain life from slain creatures for HP and spell slot recovery).",
      },
      {
        level: 18,
        name: "The Malevolent",
        description:
          "Powers become fully tainted and warped. Choose: Obscurial Magic Annihilation (30ft radius 8d6 necrotic damage wave, take damage equal to level) or Obscurial Curse Mastery (enhanced 1-hour curses preventing healing with extra damage and advantage).",
      },
    ],
    specialSystems: {
      selfHarmMechanics:
        "Most abilities require sacrificing health, taking exhaustion, or suffering penalties - representing the dangerous nature of Obscurus magic",
      curseVarieties:
        "5 different curse types: Moon (disadvantage/paranoia), Crimson (damage/poison), Domination (psychic damage/blind), Madness (friendly fire), Misdirection (fear/forced movement)",
      progressiveInstability:
        "Each tier represents increasing loss of control: Afflicted → Cursed → Beset → Madness → Malevolent",
      darknessThemes:
        "Shadow-based abilities including stealth bonuses, teleportation, and aura effects that interact with light levels",
    },
    summary:
      "High-risk, high-reward subclass focused on dark magic with self-destructive elements. Two main paths: direct magical enhancement with increasing damage potential, or stealth/curse specialization. All abilities carry significant costs representing the dangerous nature of Obscurial magic, with progression showing increasing loss of control and mental deterioration.",
  },

  Defender: {
    name: "Defender",
    description:
      "Protective specialists focused on shielding allies and controlling battlefield positioning through defensive magic and tactical support",
    level1Features: [
      {
        name: "Mitigating Defense",
        description:
          "Master defensive techniques to protect yourself and allies from harm. Choose your approach between reactive critical hit prevention or passive protective presence.",
      },
    ],
    level1Choices: [
      {
        name: "Critical Deflection",
        description:
          "As reaction, turn critical hits into normal hits for you or allies within 20 feet, canceling critical effects. Uses equal to spellcasting modifier per long rest, representing precise defensive timing.",
      },
      {
        name: "Shielding Presence",
        description:
          "Allies within 10 feet gain +1 AC (+2 at 6th level) from your protective aura, representing constant defensive awareness and positioning that shields nearby companions.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 6,
        name: "Defensive Alliances",
        description:
          "Choose: Unbreakable Bonds (bind to proficiency bonus allies for temp HP, attack bonuses, reactive spells, or coordinated attacks) or Protective Distraction (impose disadvantage on attacks against allies within 30ft via mocking insults, proficiency bonus uses per short rest).",
      },
      {
        level: 9,
        name: "Constant Vigilance",
        description:
          "Emit alertness aura while conscious. You and chosen creatures within 10 feet gain bonus to initiative equal to spellcasting modifier. Range increases to 30 feet at 18th level.",
      },
      {
        level: 10,
        name: "Influential Tactics",
        description:
          "Choose: Provocative Strikes (successful attacks either grant advantage to next ally attack or force Wisdom save to goad target into focusing on you) or Bolster Confidence (Persuasion checks grant friendly creatures advantage on next ability check within hour).",
      },
      {
        level: 14,
        name: "Warding Sanctuary",
        description:
          "Choose: Warding Aura (requires Unbreakable Bonds - bound allies gain temp HP equal to your level per turn, protection from targeting at 0 HP, action for hour-long advantage on saves) or Guardian's Respite (30ft sanctuary spell-like effect for 10 minutes, complete protection but no spellcasting out).",
      },
    ],
    specialSystems: {
      unbreakableBonds:
        "Bind to specific allies (proficiency bonus number) for enhanced cooperative abilities including temp HP, attack bonuses, reactive spell attacks, and coordinated strikes",
      protectiveReactions:
        "Multiple reaction-based abilities to prevent damage, reduce attack effectiveness, or redirect enemy focus away from vulnerable allies",
      auraEffects:
        "Passive benefits that scale with level, providing AC bonuses, initiative bonuses, and temporary hit points to allies within range",
      sanctuaryMagic:
        "Ultimate defensive ability creating zones of complete protection with sanctuary spell effects and anti-apparition properties",
    },
    summary:
      "Two main defensive paths: Unbreakable Bonds focuses on deep connections with specific allies for enhanced cooperative tactics, while general protection offers broader defensive coverage. Both paths emphasize reaction-based protection, battlefield control, and creating safe zones for allies while manipulating enemy targeting priorities.",
  },
  "Grim Diviner": {
    name: "Grim Diviner",
    description:
      "Masters of dark divination magic who peer into forbidden futures and manipulate fate through shadow and fear",
    level1Features: [
      {
        name: "Grim Presence",
        description:
          "Gain Diviner's Kit and proficiency. Your divination magic takes on dark, ominous overtones as you peer into forbidden aspects of fate and future. Choose your approach to manipulating destiny.",
      },
    ],
    level1Choices: [
      {
        name: "Dark Visionary",
        description:
          "Roll d20 daily for Visionary Roll, replace any attack/save/check with this result once per day. Scales: affect others at 6th level, gain 2nd roll at 10th level, roll 3 and keep 2 at 14th level.",
      },
      {
        name: "Shadowy Influences",
        description:
          "Gain Fraudemo spell cast wandlessly/wordlessly with both sound and image. At 6th level, gain Fraudemo Maxima and ability to change illusion nature with action while maintaining concentration.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 6,
        name: "Grim Sight",
        description:
          "Gain Dark Legilimens (add Legilimens spell, witness worst fears instead of thoughts). Choose: Foresight Glimpse (bonus action for advantage on next roll, half proficiency bonus uses) or Soul Tether (regain HP equal to half damage dealt by dark-tagged spells).",
      },
      {
        level: 9,
        name: "Grim Psychometry",
        description:
          "Advantage on Intelligence (History) checks about sinister/tragic history of touched objects or current location. High rolls may trigger visions of dark past events at DM discretion.",
      },
      {
        level: 10,
        name: "Grim Control",
        description:
          "Gain Chambers of Forbidden Secrets (learn 2 dark spells of 5th level or lower). Choose: Emotional Manipulation (control emotions for 1 minute, advantage on Charisma checks), Mind of the Grave (command dead/Inferius for 24 hours), or Illusion of Self (reaction to make attacks auto-miss).",
      },
      {
        level: 14,
        name: "Grim Mastery",
        description:
          "Choose: Death Wish (mark creature for vulnerability to next attack + auto-succeed one save/check per long rest), Shadow Infusion (2d8 psychic damage start of next turn + disadvantage on next save), or Path of Rot (Mind of the Grave creatures gain damage bonus equal to Divinations modifier).",
      },
      {
        level: 18,
        name: "Grim Being",
        description:
          "Choose: Dreadful Aspect (30ft aura of gloom reducing light, frightening enemies for 4d10 psychic damage, bonus action shadow attacks for 3d10+modifier necrotic) or Mind Mastery (telepathy immunity, psychic resistance with reflection, touch charm incapacitated beings until cured).",
      },
    ],
    specialSystems: {
      divinersCurses:
        "Access to unique dark divination spells: Fraudemo, Ignis Lunalis, Formidulosus, Exspiravit, Fraudemo Maxima, Timor, Relicium, Oculus Malus, Menus Eruptus",
      visionaryRolls:
        "Unique dice manipulation system allowing predetermined outcomes on important rolls, scaling from personal use to affecting others",
      darkLegilimens:
        "Enhanced mind reading focusing on fears rather than thoughts, representing twisted divination abilities",
      forbiddenKnowledge:
        "Access to restricted dark spells normally unavailable to regular casters",
      emotionalControl:
        "Manipulation of target emotions for social advantages and behavioral influence",
    },
    summary:
      "Two main paths: Dark Visionary focuses on fate manipulation through predetermined dice rolls and future sight, while Shadowy Influences specializes in illusion magic and deception. Both paths converge on forbidden knowledge access and can progress toward either devastating area-effect abilities or complete mental domination. Heavy emphasis on dark magic, fear effects, and manipulation of both living and dead creatures.",
  },

  Astronomy: {
    name: "Astronomy",
    description:
      "Celestial scholars who harness the power of stars, moons, and cosmic forces through astronomical knowledge and starlight magic",
    level1Features: [
      {
        name: "Astronomer's Curiosity",
        description:
          "Gain proficiency with Astronomer's tools, access to Astronomic Spell list, and proficiency in Perception or Insight. Choose your approach to celestial magic and cosmic understanding.",
      },
    ],
    level1Choices: [
      {
        name: "Astrologer",
        description:
          "Gain magical Star Map serving as spellcasting focus. While holding it, all Astronomic spell list spells are considered locked in, representing deep study of celestial charts and stellar movements.",
      },
      {
        name: "I'm not Afraid of the Dark",
        description:
          "Gain 80ft darkvision. As action, share darkvision with willing creatures within 10ft (Wisdom modifier number) for 1 hour. Once per long rest unless expending spell slot.",
      },
      {
        name: "Moonlit Enchantment",
        description:
          "Spells imbued with moonlight essence are harder to resist. All spell save DCs increase by 2, representing the compelling power of lunar magic.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 5,
        name: "Star Mapper (Astrologer Required)",
        description:
          "Enhanced Star Map abilities: cast Lux Maxima free (proficiency bonus times per long rest), target two creatures with Ignis Lunalis if within 5ft of each other, create astrological charts during long rest for 24-hour advantage grants.",
      },
      {
        level: 6,
        name: "Astrological Presence",
        description:
          "Choose: Centaur's Vision (requires Astrologer - daily divination with Weal/Woe reactions adding/subtracting d6 from rolls) or Astronomic Self (starry form with constellation choices: Archer attacks, Chalice healing, Dragon reliability, Shield protection).",
      },
      {
        level: 8,
        name: "Celestial Harmony (Optional ASI)",
        description:
          "Increase Wisdom or Intelligence by 1 (max 20). Add spellcasting modifier to one spell's damage per turn, uses equal to proficiency bonus, representing cosmic harmonization.",
      },
      {
        level: 9,
        name: "Blessing of the Stars",
        description:
          "Unarmored Defense while wearing no cloak and not wielding defensive items: AC = 10 + Dex modifier + Wisdom modifier, protected by starlight.",
      },
      {
        level: 10,
        name: "Heaven's Fortitude",
        description:
          "Choose: Astronomic Power (requires Astronomic Self - enhanced constellations with 2d8 damage, Dragon flight, Shield zone creation), Cosmic Blast (reaction 2d8+Wis radiant damage when saves succeed), or Cosmic Insight (reroll any d20 once per short rest).",
      },
      {
        level: 14,
        name: "Volatile Astronomy",
        description:
          "Choose: Gift of the Stars (Wisdom modifier to 3rd level or lower spell damage + radiant/fire resistance), Gift of the Moon (requires Astronomic Self - lunar phases with Full/New/Crescent benefits), Fate Unbound (reduce target ability score to 1), or Celestial Resistance (spells ignore damage resistance for 1 minute).",
      },
      {
        level: 18,
        name: "Cosmic Perfection",
        description:
          "Choose: Gift of the Sun (requires Gift of the Moon - enhanced lunar abilities with blinds, necrotic damage, teleportation) or Starry Desperation (maximum spell damage with escalating 1d12 per spell level self-damage).",
      },
    ],
    specialSystems: {
      astronomicSpells:
        "Unique spell list including Lux, Ignis Lunalis, Lux Maxima, Trabem, Stellaro, Lunativia, Solativia - all celestial-themed divination magic",
      starMap:
        "Astrologer path's magical focus that locks in all Astronomic spells and enables advanced divination abilities",
      starryForm:
        "Astronomic Self transformation with four constellation choices each providing different tactical benefits",
      lunarPhases:
        "Advanced feature offering Full Moon (investigation/perception), New Moon (stealth/darkness), Crescent Moon (damage resistance) benefits",
      cosmicProgression:
        "Two main paths: Astrologer focuses on divination and chart reading, Astronomic Self focuses on stellar transformation and constellation powers",
    },
    summary:
      "Two distinct paths: Astrologer specializes in divination magic through star charts and cosmic insight, while Astronomic Self focuses on personal transformation into starlight forms with constellation powers. Both paths can access powerful cosmic magic that manipulates light, deals radiant damage, and provides unique utility through celestial phenomena. High-level features offer reality-bending abilities like fate manipulation and damage resistance negation.",
  },

  Historian: {
    name: "Historian",
    description:
      "Scholarly researchers who weaponize knowledge and use intellectual superiority to gain tactical advantages through extensive study and analysis",
    level1Features: [
      {
        name: "Scholar's Mind",
        description:
          "Master the art of learning and knowledge acquisition. Choose your approach between focused academic study or rapid knowledge absorption for immediate application.",
      },
    ],
    level1Choices: [
      {
        name: "Study Buddy",
        description:
          "Learn one language and gain proficiency in academic skills (Herbology, History of Magic, Investigation, Magical Theory, Muggle Studies) or expertise if already proficient. Spending 1+ hours studying automatically improves grades by one category, can help others instead.",
      },
      {
        name: "Quick Skim",
        description:
          "Master rapid text analysis for knowledge bursts. Once per short/long rest, gain proficiency with any skill or tool for 1 hour (expertise if already proficient), representing speed-reading mastery.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 6,
        name: "Intellect Advantage",
        description:
          "Choose: Um, Actually? (reaction Intelligence contest to reduce enemy rolls by proficiency bonus, half Int modifier uses per long rest) or Battle Studies (cantrip hits analyze enemies revealing all resistances/immunities + reaction cantrips on enemy misses).",
      },
      {
        level: 9,
        name: "I Was in the Library...",
        description:
          "Extensive research grants access to specialized knowledge. Automatically lock in 2 spells of choice from Elemental, Magizoo, Diviner's Curse, Forbidden, or Astronomic spell lists.",
      },
      {
        level: 10,
        name: "Dueling Tactics",
        description:
          "Choose: Intelligent Maneuver (additional reaction once per round after using first reaction, twice per long rest) or Wait... Hold on. (reroll skill checks adding half Intelligence modifier, use after roll but before success/failure determination).",
      },
      {
        level: 14,
        name: "Path of History",
        description:
          "Choose: Intelligent Casting (Intelligence modifier to 3rd level or lower spell damage + charm resistance) or Super Sleuth (object reading and area reading abilities - contemplate for Intelligence score minutes to see past events, owners, and significant occurrences).",
      },
      {
        level: 18,
        name: "Enlightened Mind",
        description:
          "Choose: Battle Expert (requires Battle Studies - cantrip hits grant vulnerability to chosen damage type for 1 minute, suppress resistance instead if present) or Perfected Communication (understand all spoken languages and be understood by any creature that knows a language).",
      },
    ],
    specialSystems: {
      academicProgression:
        "Grade improvement mechanics allowing automatic advancement in subjects through dedicated study time",
      intellectualCombat:
        "Intelligence-based contested checks and analytical abilities that provide tactical advantages against enemies",
      knowledgeAccess:
        "Access to specialist spell lists normally restricted to other subclasses through extensive library research",
      psychometry:
        "Super Sleuth abilities allowing reading of object histories and area events through contemplative analysis",
      temporaryExpertise:
        "Quick Skim system providing flexible skill/tool proficiencies for short durations",
    },
    summary:
      "Two main paths: Academic specialist focusing on study mechanics and knowledge acquisition, or Combat analyst using intelligence for tactical advantages. Both paths emphasize Intelligence as primary stat and offer unique access to restricted magical knowledge. Advanced features include either enhanced enemy analysis with vulnerability manipulation or complete linguistic mastery and historical sight abilities.",
  },

  "Ghoul Studies and Ancient Studies": {
    name: "Ghoul Studies and Ancient Studies",
    description:
      "Scholars of the macabre and ancient who either transform into ghoulish forms or commune with spirits of historical figures",
    level1Features: [
      {
        name: "Outward Expressions",
        description:
          "Gain proficiency in Magical Creatures or History of Magic. Choose your field of study between ghoulish transformation or ancient spirit communication. Note: Intellect casters gain ASI or Feat at 3rd level instead of opposite ability.",
      },
    ],
    level1Choices: [
      {
        name: "Ghoulish Trick",
        description:
          "Bonus action transformation for 1 minute (proficiency bonus uses per long rest). Gain 1d10+level temp HP, force Intelligence saves to avoid being frightened by horrifying visage, and immunity to frightened condition during transformation.",
      },
      {
        name: "Ancestral Call",
        description:
          "Action to summon Ancient historical spirits that hinder one target. Target must make Intelligence saves when attacking or casting spells or waste the action hitting the spirits instead, lasting until start of next turn.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 6,
        name: "Inner Reflections",
        description:
          "Choose: Inner Ghoul (requires Ghoulish Trick - 60ft darkvision, invisible to darkvision in darkness, psychic damage conversion with extra die during transformation) or Ancient Guardian (requires Ancestral Call - reaction to reduce ally damage by 1d6+modifier, scales to 2d6 at 10th, 4d6 at 14th).",
      },
      {
        level: 9,
        name: "Dark Shield",
        description:
          "Universal protection from otherworldly connections. Gain advantage on death saving throws and resistance to necrotic damage, representing fortification from exposure to undead and spirits.",
      },
      {
        level: 10,
        name: "Arcane Body",
        description:
          "Choose: Warped Mind (requires Inner Ghoul - psychic resistance/immunity during transformation, drop to 1 HP reaction with 2d10+level damage wail + 2 exhaustion) or Ancestral Guidance (requires Ancient Guardian - move through Unseen Realm as difficult terrain, see/affect ethereal creatures).",
      },
      {
        level: 14,
        name: "Talented Mind",
        description:
          "Choose: Spook (requires Warped Mind - reaction to impose disadvantage + fear on attackers without advantage) or Ancient Rebuke (requires Ancestral Guidance - damage prevented by Ancient Guardian rebounds to attacker).",
      },
      {
        level: 18,
        name: "Fearful Soul",
        description:
          "Choose: Ghoulish Existence (requires Spook - massive ghoul form with 10 temp HP per turn, bonus action spells, touch attack spending sorcery points, 10ft disadvantage aura) or Ancient Secrets (requires Ancient Rebuke - ask ancients one question per year, action to detect illusions/shapechangers within 30ft).",
      },
    ],
    specialSystems: {
      dualProgression:
        "Two completely separate advancement paths that cannot be mixed - ghoul studies focuses on personal transformation, ancient studies focuses on spirit communication",
      transformationMechanics:
        "Ghoulish Trick provides temporary benefits including HP, fear effects, and condition immunity with scaling uses",
      spiritGuardianship:
        "Ancient Guardian system allows reactive damage mitigation for allies with scaling damage reduction",
      unseeNRealm:
        "Advanced ancient path feature allowing interaction with ethereal plane and otherworldly entities",
      intellectCasterException:
        "Special rule for Intellect casters who gain ASI/Feat at 3rd level instead of opposite path abilities",
    },
    summary:
      "Dual-specialization subclass offering two mutually exclusive paths: Ghoul Studies transforms the character into increasingly ghoulish forms with fear abilities, psychic powers, and ultimate massive ghoul transformation; Ancient Studies focuses on spirit communication, protective abilities for allies, ethereal plane interaction, and ancient knowledge access. Both paths emphasize otherworldly connections but with completely different mechanical approaches.",
  },
  Quidditch: {
    name: "Quidditch",
    description:
      "Athletic spellcasters who specialize in magical sports, combining broom mastery with position-based combat techniques and team coordination",
    level1Features: [
      {
        name: "Quidditch Initiate",
        description:
          "Gain Vehicles (Broomstick) proficiency or expertise. Summon magical broom as bonus action (remains unless dismissed or separated 1+ hour). Choose your Quidditch position specialization approach.",
      },
    ],
    level1Choices: [
      {
        name: "Batter Up!",
        description:
          "Beater specialization - gain Athletics proficiency/expertise and weapon proficiency with Beater's Bat (1d4/1d6 versatile) and Bludger (1d6 ranged, scales to 4d6 at 17th level, 80/320 range). Use Strength for attack and damage rolls.",
      },
      {
        name: "Think Fast!",
        description:
          "Chaser specialization - gain Acrobatics proficiency/expertise. Bonus action to pass Quaffle to creature within 30ft, forcing Wisdom save or they drop held item to catch it, representing tactical ball manipulation.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 4,
        name: "Get Your Head In The Game (Optional ASI)",
        description:
          "Choose: Cheer (bonus action inspire proficiency bonus allies within 30ft for 1d4 bonus to next roll) or Chirp (bonus action discourage proficiency bonus enemies for 1d4 penalty to next roll). Each usable twice per long rest.",
      },
      {
        level: 6,
        name: "We're All In This Together",
        description:
          "Choose: Goalkeeper (Athletics/Acrobatics proficiency, +2 AC, reaction to force attack reroll within 15ft) or Eagle Eyes (Perception/Sleight of Hand proficiency, half Wisdom to Dex saves, advantage on sight-based Perception).",
      },
      {
        level: 8,
        name: "I'm Ok! (Optional ASI)",
        description:
          "Increase Dexterity by 1 (max 20). Advantage on Acrobatics while flying/mid-air. Reaction to reduce fall damage by 3×(Dex modifier + Str modifier), representing crash survival training.",
      },
      {
        level: 9,
        name: "Quidditch Robe",
        description:
          "Unarmored Defense while not wearing cloak or wielding defensive item: AC = 10 + Dex modifier + Str modifier, representing athletic conditioning and protective gear.",
      },
      {
        level: 10,
        name: "You Can't Catch Me!",
        description:
          "Choose: Zoomies! (teleport up to 60ft as part of broom/flying movement through walls, half proficiency bonus uses) or I Am Speed (60ft straight line creating wind tunnel with 5d6 force damage and pull effects).",
      },
      {
        level: 14,
        name: "Best Of The Best",
        description:
          "Choose based on prerequisites: Slugger (magical Bludger attacks + 4d8 force damage), Chaser's Strategy (command ally reaction attacks at advantage), Keeper's Wall (+5 AC or +3 save barrier for allies), or Seeker's Sight (treat 9 or lower as 10 + detect invisible).",
      },
      {
        level: 18,
        name: "Quidditch Team Captain",
        description:
          "Choose: All For One! (enhanced Cheer/Chirp with damage, AC bonuses, temp HP, or psychic damage), Bombs Away! (permanent 30ft fly speed + advantage on attacks vs creatures below), or All Rounder (expertise in athletics skills + extra Best of the Best feature).",
      },
    ],
    specialSystems: {
      broomMastery:
        "Bonus action broom summoning and advanced flying maneuvers including teleportation and wind tunnel creation",
      positionSpecialization:
        "Four distinct Quidditch positions (Beater, Chaser, Keeper, Seeker) each with unique abilities and equipment proficiencies",
      customWeapons:
        "Beater's Bat and scaling Bludger with unique properties - Bludger damage increases from 1d6 to 4d6 over levels",
      teamSupport:
        "Cheer and Chirp mechanics for inspiring allies or discouraging enemies with dice modifiers",
      athleticProgression:
        "Multiple ability score dependencies (Strength, Dexterity, Wisdom) reflecting different athletic skills",
      unarmoredDefense:
        "Unique AC calculation using both Dexterity and Strength modifiers representing athletic conditioning",
    },
    summary:
      "Highly athletic subclass with four distinct position-based progression paths: Beater (heavy hitters with magical weapons), Chaser (tactical ball control and team coordination), Keeper (defensive specialists with protection abilities), and Seeker (precision specialists with detection abilities). All paths emphasize flying mastery, team support, and unique unarmored defense combining physical conditioning with magical athleticism.",
  },
  Trickery: {
    name: "Trickery",
    description:
      "Manipulative spellcasters who specialize in deception, illusion, and mental manipulation through subtle magic and psychological warfare",
    level1Features: [
      {
        name: "Scoundrel",
        description:
          "Learn the Manus spell (all castings considered subtle). Gain access to the Trickery spellbook. Choose your approach to trickery and manipulation.",
      },
    ],
    level1Choices: [
      {
        name: "Insidious Rumor",
        description:
          "After 1 minute of conversation with a creature alone, force Wisdom save or target becomes frightened of you or chosen creature for 1 hour (ends if attacked/damaged or allies attacked). Creatures with <4 Intelligence immune. Usable once per short/long rest.",
      },
      {
        name: "Sticky Fingers",
        description:
          "Make Manus hand invisible and perform additional tasks unnoticed with contested Dexterity (Sleight of Hand) vs Wisdom (Perception): stow/retrieve objects from containers on others, use thieves' tools at range. Control hand with bonus action.",
      },
    ],
    higherLevelFeatures: [
      {
        level: 4,
        name: "Silver Tongue (Optional ASI)",
        description:
          "Master of perfect timing in conversation. Treat d20 rolls of 7 or lower as 8 on Charisma (Persuasion) or Charisma (Deception) checks, representing supernatural social manipulation.",
      },
      {
        level: 6,
        name: "Perjurer",
        description:
          "Gain Sneaky Studies (proficiency in two of: Deception, Intimidation, Sleight of Hand, or Stealth). Choose: Duplicate (perfect 1-minute illusion with spell casting and advantage), Make Nice (learn creature capabilities in 1 minute), or Deep Pockets (magical Capacious Extremis compartment).",
      },
      {
        level: 8,
        name: "Obliviator (Optional ASI)",
        description:
          "Enhanced memory manipulation. When casting Obliviate, can implant detailed false memories instead of erasing. False memories undetectable to target but may be detected by others examining memories through Legilimency or Pensieve.",
      },
      {
        level: 9,
        name: "Sneaky Bitch",
        description:
          "Enhanced action economy representing mastery of multitasking deception. Gain one additional bonus action per turn. Can use bonus actions to take Dash, Disengage, or Hide actions.",
      },
      {
        level: 10,
        name: "Manipulative Motives",
        description:
          "Choose: Look at me (Charisma vs Wisdom contest for attention control or charm effects lasting 1 minute) or Mirrored Memories (tell story to charm creatures into believing they experienced events, Intelligence save, lasts until long rest).",
      },
      {
        level: 14,
        name: "False Witness",
        description:
          "Choose: Misdirection (reaction to redirect attacks targeting you to creatures within 5ft) or Veiled Influence (10-minute conversation grants 24-hour advantage on Charisma checks + implant suggestion with 4d10 psychic damage for disobedience, max 3 times per day).",
      },
      {
        level: 18,
        name: "Blatant Exploitation",
        description:
          "Choose: Quintuplicate (requires Duplicate - create up to 4 duplicates, move multiple as bonus action, reaction to swap places within 60ft) or Yoink! (reaction steal spells targeting you, proficiency bonus uses per long rest, 8-hour duration).",
      },
    ],
    specialSystems: {
      dualProgression:
        "Two distinct Level 1 paths that influence later feature availability - Insidious Rumor focuses on fear and social manipulation, Sticky Fingers emphasizes stealth and theft",
      manusEnhancement:
        "Specialized improvements to the Manus cantrip including invisibility, extended functionality, and bonus action control",
      illusionMastery:
        "Duplicate system allows creation of perfect self-illusions with spellcasting capabilities and tactical advantages",
      memoryManipulation:
        "Advanced Obliviate mechanics for implanting false memories and sophisticated mental manipulation",
      spellTheft:
        "Unique Yoink! ability allows reactive spell stealing from enemy casters with temporary knowledge acquisition",
      socialDomination:
        "Multiple features focused on conversation-based effects, charm abilities, and long-term psychological influence",
      prerequisiteProgression:
        "Some high-level features require specific earlier choices (Quintuplicate requires Duplicate)",
    },
    summary:
      "Sophisticated manipulation subclass offering two primary approaches: fear-based psychological warfare through Insidious Rumor or stealth-based theft and infiltration through Sticky Fingers. Both paths converge on advanced social manipulation, memory alteration, and illusion mastery. Features emphasize bonus action economy, reactive abilities, and conversation-based magic. Ultimate abilities allow either perfect duplication with tactical positioning or reactive spell theft from enemies, representing mastery over deception and magical larceny.",
  },
};

export const subclasses = Object.keys(subclassesData);

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

export const heritageDescriptions = {
  "Centaurian Lineage": {
    description:
      "Descendants of centaurs with enhanced mobility and natural abilities.",
    benefits: [
      "Ability Score Increase: Your Wisdom score increases by 1.",
      "Speed: Your base walking speed is 40 feet.",
      "Hooves: Your hooves are natural melee weapons, which you can use to make unarmed strikes. On a hit, you deal bludgeoning damage equal to 1d6 + your Strength modifier.",
      "Equine Build: You count as one size larger when determining your carrying capacity and the weight you can push or drag. In addition, any climb that requires hands and feet is especially difficult for you because of your equine legs. When you make such a climb, each foot of movement costs you 4 extra feet, instead of the normal 1 extra foot.",
      "Naturalist: You gain one of the following benefits: Survivor (Proficiency in Survival and advantage on all Survival checks while in a Forest), Zoologist (Proficiency in Magical Creatures and advantage on checks to calm beasts), Herbologist (Proficiency in Herbology and while in a Forest you and your allies cannot be slowed by difficult terrain or lost unless by magical means), or Cosmologist (Proficiency in Perception and navigation abilities under night sky).",
    ],
  },
  "Dryad Ancestry": {
    description:
      "Elusive and mysterious denizens of forests and glades, connected to nature itself.",
    benefits: [
      "Gain proficiency in Herbology checks. Additionally, you gain proficiency in an Artisanal tool of your choice.",
      "You know the Druidcraft cantrip and can cast it at will, without the use of a wand.",
      "You have an 'unearthly' ability to understand plants on a personal level. You can innately cast the Speak-with-Plants spell once per long rest.",
    ],
  },
  "Elf Legacy": {
    description:
      "Haunting of Greylock only. Ghostly elven heritage with supernatural abilities.",
    benefits: [
      "Ability Score Increase: Increase your Wisdom or Dexterity by 1.",
      "Unseen Hand: As a bonus action, you can teleport up to 10 feet to an unoccupied space you can see. This movement does not provoke opportunity attacks. You can use this ability a number of times equal to your proficiency bonus per long rest.",
      "Wardslip Apparition: Apparition License Required. You can magically apparate in or out of warded locations that normally prevent such travel, including castle grounds and magically locked buildings. When you do so, you may travel up to half the normal apparition distance, and you cannot bring another creature with you. You can use this ability once per long rest.",
      "Pathetic Performance: As a bonus action, you may aid an ally within 15 feet of you by pretending to be helpless or pathetic, distracting a creature within 30 feet of you. If that ally attacks the creature before the start of your next turn, the first attack roll is made with advantage. You can use this ability a number of times equal to your proficiency bonus per long rest.",
    ],
  },
  "Fey Ancestry": {
    description:
      "Distant Fey ancestry from the mystical and enchanting realm of supernatural beings.",
    benefits: [
      "Your Wisdom or Charisma ability score increases by 1.",
      "You possess a limited form of Darkvision out to a range of 60 feet.",
      "For anyone else, a period of 8 hours is required in order to feel well-rested and avoid exhaustion. For you that period of time gets cut in half to 4 hours.",
      "Fey Traits: Your hidden heritage is manifested in odd physical ways (elongated ears, iridescent eyes, illusory creatures around you during rest, flowers in hair, seasonal hair color changes, etc.).",
    ],
  },
  "Giant's Blood": {
    description:
      "Half-giants and part-giants with impressive strength and genetic resistance to magic.",
    benefits: [
      "Ability Score Increase: Increase your Strength score by 1, to a maximum of 20.",
      "Size: Adult part-giants are between 7 and 9 feet tall and weigh between 300 and 420 pounds. Your size is Medium.",
      "Hefty: You are considered one size larger when determining carrying capacity and weight you can push, drag, or lift.",
      "Natural Resistance: When a spell or other magical effect inflicts a condition on you, you can use your reaction to resist one condition of your choice. You can do this a number of times equal to your proficiency bonus per long rest.",
    ],
  },
  "Goblin Cunning": {
    description:
      "The rarest racial combination - part-goblins with inherited cleverness and big personalities.",
    benefits: [
      "Ability Score Increase: Increase your Intelligence score by 1, to a maximum of 20.",
      "Size: Adult part-goblins are between 3 and 5 feet tall and weigh around 110 pounds. Your size is Small.",
      "Nimble Body: You can move through the space of any creature that is of a size larger than yours.",
      "Goblin Wit: You have advantage on all Intelligence and Wisdom saving throws against magic.",
      "Gobbledegook: You can speak, read, and write Gobbledegook.",
    ],
  },
  "Gorgon Ancestry": {
    description:
      "Mysterious heritage with serpentine features and petrifying abilities.",
    benefits: [
      "Ability Score Increase: Your Constitution score or Charisma score increases by 1.",
      "Darkvision: You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.",
      "Parseltongue: You can speak Parseltongue.",
      "Petrifying Gaze: Your look can turn other creatures to stone. As an action, you can target one creature that can see you within 30 feet with your gaze. You may use this a number of times equal to your proficiency bonus per long rest.",
      "Poison Resistance: You are resistant to poison damage and the poisoned condition.",
      "Gorgon Traits: Serpentine hair accents, snake-like eyes, scaled skin patterns, elongated canines, forked tongue, or clawed fingertips.",
    ],
  },
  "Hag-Touched": {
    description:
      "You or your parents had a brief encounter with a powerful wild being that has forever changed you.",
    benefits: [
      "You gain proficiency in either Survival or Stealth.",
      "Once per year, you may tap into your connection to chaos and warp the fabric of reality. You may speak a minor wish into existence, and it shall be so. This is subject to DM's discretion and approval.",
    ],
  },
  Halfblood: {
    description:
      "The vast majority of human wizards - combination of magical and Muggle ancestry.",
    benefits: [
      "Choose one of three options:",
      "Option 1: Gain proficiency in History of Magic (expertise if already proficient) + two skills from: Acrobatics, Herbology, Magical Creatures, Potion-Making, Intimidation",
      "Option 2: Gain proficiency in Muggle Studies (expertise if already proficient) + two skills from: Athletics, Investigation, Medicine, Survival, Persuasion",
      "Option 3: Add half proficiency in Muggle Studies and History of Magic + gain expertise in one skill you're already proficient in",
    ],
  },
  "Metamorph Magic": {
    description:
      "Rare metamorphmagus talent - morphing every aspect of your human appearance.",
    benefits: [
      "Ability Score Increase: Increase your Charisma score by 1, to a maximum of 20.",
      "Transform: At will, you can transform your appearance including height, weight, facial features, voice, hair, and coloration. Your basic shape and size category stay the same.",
      "You can also adapt your body to an aquatic environment, growing webbing between your fingers to gain swimming speed equal to your walking speed.",
    ],
  },
  Muggleborn: {
    description:
      "Wizards and witches born to Muggle parents who enter an entirely new magical world.",
    benefits: [
      "You gain proficiency in Muggle Studies checks. If you are already proficient you gain expertise.",
      "You gain tool proficiency with one of the following: Disguise kit, Navigator's Tools, Poisoner's Kit, Thieve's Tools, Cook's Utensils, or one Musical Instrument of your choice.",
      "You have advantage on any Muggle Studies checks made towards explaining Muggle culture, technology or history to Purebloods and Halfbloods.",
    ],
  },
  "Part-Leprechaun": {
    description:
      "A bit of the magic of the old country flows through your veins from whimsical Leprechauns.",
    benefits: [
      "Increase your Intelligence, Wisdom or Charisma score by 1, to a maximum of 20.",
      "You can sense the presence of gold and the general volume of it. You gain one additional downtime slot to find the end of the rainbow and steal another Leprechaun's gold. Make a DC 15 Perception or Investigation check. On a success you may roll 2D12X2 Gold.",
      "As an action, you can become invisible for 1 round. Anything you are wearing or carrying is also invisible as long as it is on your person. This effect ends if you attack, cast a spell or take damage.",
    ],
  },
  "Part-Harpy": {
    description:
      "Graceful humanoids with feathered wings, sharp avian eyes, and predatory elegance.",
    benefits: [
      "Ability Score Increase: Your Dexterity or Charisma score increases by 1",
      "Talon Strike: Your talons are natural weapons, which you can use to make unarmed strikes. On a hit, you deal slashing damage equal to 1d6 + your Dexterity modifier.",
      "Baby Wings: You have a pair of mundane growing wings.",
      "Harpy Screech: You let out a violent screech laced with Harpy magic. As an action, you can choose a target within 60 feet that can hear you. The target must succeed on a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll. You can do this a number of times equal to your proficiency bonus per long rest.",
    ],
  },
  "Part-Siren": {
    description:
      "Rare descendant of aquatic creatures known for luring people and beguiling them at sea.",
    benefits: [
      "Aquatic Legacy: As a bonus action, when fully submerged in water, you can transform your legs into a powerful tail. You gain a swim speed equal to your movement. You are immune to drowning while in this form.",
      "Debilitating Shriek: On Land. As an action, all creatures within a 60ft sphere must make a CON saving throw or become deafened. Any creature within 15ft that fails takes 1d4 thunder damage and gets pushed 5ft away.",
      "Siren's Song: In Water. Your haunting call commands aquatic creatures within 120ft range. You can command various numbers of creatures based on size. You can use these abilities a number of times equal to your proficiency bonus per long rest.",
    ],
  },
  Parseltongue: {
    description:
      "Almost exclusively hereditary ability to magically comprehend and communicate with snakes.",
    benefits: [
      "Ability Score Increase: Increase your Charisma by 1, to a maximum of 20.",
      "Parselmouth: You can speak Parseltongue. You have advantage on all charisma checks made on snakes.",
    ],
  },
  "Pukwudgie Ancestry": {
    description:
      "Short and slight descendants of Pukwudgies with strong traditions and poisonous abilities.",
    benefits: [
      "Ability Score Increase: Your Dexterity or Wisdom score increases by 1",
      "Size: Your size is Small (3-4 feet tall).",
      "Sacred Names: Pukwudgies never reveal their true names to outsiders, only to those they consider family.",
      "Poisoned Arrows: You have proficiency with shortbows and can craft poisonous arrows. When you attack with a shortbow, you can coat the arrow in Pukwudgie venom as a bonus action. You can use this feature a number of times equal to your proficiency bonus per long rest.",
      "Pukwudgie Tradition: You gain proficiency in one of the following: Stealth, Sleight of Hand, Deception or Persuasion.",
    ],
  },
  Pureblood: {
    description:
      "Long line of wizards and witches, without a drop of Muggle blood - raised in wizarding culture.",
    benefits: [
      "You gain proficiency in History of Magic checks. If you are already proficient you gain expertise.",
      "You gain tool proficiency with one of the following: Astronomer's Tools, Herbologist's Tools, Potioneer's Kit, Vehicle (Broomstick), Diviner's Kit. You may add your chosen tool to your inventory.",
      "Any checks related to knowing the family history of other Pureblood families is done so at advantage.",
    ],
  },
  "Satyr Ancestry": {
    description:
      "Exceedingly rare fey creatures with mystical ancestry, quite spry and gifted in revelry.",
    benefits: [
      "You gain proficiency in Acrobatics or Performance. Additionally you gain proficiency with one musical instrument of your choice.",
      "Whenever you make a long or high jump, you can add your Spellcasting Ability Mod to the number of feet you cover, even when making a standing jump.",
      "You can use your head and horns to make unarmed strikes. If you hit with them, you deal bludgeoning damage equal to 1d6 + your Strength modifier.",
      "Physical traits: furry goat or deer-like lower body and ears, hooves, small twisting horns or antlers, flat animalistic nose, rectangular pupils, spotted coloration, etc.",
    ],
  },
  "Troll Blood": {
    description:
      "Troll heritage with incredible constitution and regenerative abilities.",
    benefits: [
      "Ability Score Increase: Increase your Strength or Constitution by 2, and Strength or Constitution by 1, to a maximum of 20. Reduce your Intelligence by 2.",
      "Troll Constitution: As a Bonus Action, you can expend one of your hit die to regain hit points as if you finished a short rest. You cannot use this ability if you have taken fire or acid damage since the end of your last turn. You can use this ability a number of times equal to your proficiency bonus and regain all uses after you complete a long rest.",
      "Keen Smell: You have advantage on Wisdom (Perception) checks that rely on smell.",
      "Muscular Build: You are considered one size larger when determining carrying capacity and weight you can push, drag, or lift.",
    ],
  },
  "Veela Charm": {
    description:
      "Very rare part-veela heritage - a picture of grace and beauty, center of attention.",
    benefits: [
      "Ability Score Increase: Increase your Charisma or Wisdom by 1, to a maximum of 20.",
      "Charismatic: You gain proficiency in one Charisma skill of your choice.",
      "Veela Charm: As an action, you can attempt to charm a humanoid you can see within 30 ft, who would be attracted to you. It must make a Wisdom saving throw, (if hostile, with advantage). If it fails, it is charmed by you for one hour or until you or your companions harm it. The charmed creature regards you as a friendly acquaintance and feels compelled to impress you or receive your attention. After, the creature knows it was charmed by you. You can't use this ability again until you finish a long rest.",
    ],
  },
};

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

export const standardFeats = [
  {
    name: "Accidental Magic Surge",
    preview: "Wild and unpredictable magical energy with surge effects.",
    description: [
      "You have the wild and unpredictable energy of accidental magic.",
      "As a Free Action, you can choose to enhance a spell you cast.",
      "Roll a d20: on 5 or lower, roll on magic surge table.",
      "On 15 or higher, spell effects are amplified with increased damage, conditions, area, or targets.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {},
    },
  },
  {
    name: "Actor",
    preview: "Master of disguise and impersonation. +1 Charisma.",
    description: [
      "Increase Charisma by 1.",
      "Gain advantage on Deception/Performance checks while disguised as someone.",
      "You can mimic sounds and speech.",
      "Others need Wisdom (Insight) check vs DC 8 + Charisma mod + proficiency to detect.",
    ],
    modifiers: {
      abilityIncreases: [{ type: "fixed", ability: "charisma", amount: 1 }],
      skillProficiencies: [],
      expertise: [],
      other: {},
    },
  },
  {
    name: "Aerial Combatant",
    preview: "Combat expertise while flying broomsticks. +1 Str/Dex.",
    description: [
      "Increase Strength or Dexterity by 1.",
      "Gain broomstick proficiency.",
      "No longer suffer disadvantage on attack rolls while flying.",
    ],
    modifiers: {
      abilityIncreases: [
        { type: "choice", abilities: ["strength", "dexterity"], amount: 1 },
      ],
      skillProficiencies: [],
      expertise: [],
      other: {
        broomstickProficiency: true,
      },
    },
  },
  {
    name: "Alert",
    preview: "Always ready for danger. +5 initiative, can't be surprised.",
    description: [
      "Can't be surprised while conscious.",
      "+5 bonus to initiative.",
      "Other creatures don't gain advantage from being unseen by you.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        initiativeBonus: 5,
      },
    },
  },
  {
    name: "Athlete",
    preview: "Physical prowess and mobility. +1 Str/Dex, climb speed.",
    description: [
      "Increase Strength or Dexterity by 1.",
      "Gain climb speed equal to your speed.",
      "Stand up from prone with only 5 feet movement.",
      "Make running jumps after moving only 5 feet.",
    ],
    modifiers: {
      abilityIncreases: [
        { type: "choice", abilities: ["strength", "dexterity"], amount: 1 },
      ],
      skillProficiencies: [],
      expertise: [],
      other: {
        climbSpeed: true,
      },
    },
  },
  {
    name: "Cantrip Master",
    preview: "Master of cantrips. Cast some wandlessly and as bonus actions.",
    description: [
      "Increase spellcasting ability by 1.",
      "Cast one cantrip as bonus action per short rest.",
      "Cast locked-in cantrips without a wand.",
      "Can serve as prerequisite for Superior Wandless Casting.",
    ],
    modifiers: {
      abilityIncreases: [{ type: "spellcastingAbility", amount: 1 }],
      skillProficiencies: [],
      expertise: [],
      other: {},
    },
  },
  {
    name: "Detecting Traces",
    preview: "Sense and identify magical auras and spell schools.",
    description: [
      "Use concentration to sense magic within 30 feet.",
      "Can see faint auras and learn spell schools.",
      "Penetrates most barriers except 1 foot stone, 1 inch metal, or 3 feet wood/dirt.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {},
    },
  },
  {
    name: "Durable",
    preview: "Tough and resilient. +1 Con, advantage on death saves.",
    description: [
      "Increase Constitution by 1.",
      "Advantage on Death Saving Throws.",
      "As bonus action, expend Hit Die to regain hit points.",
    ],
    modifiers: {
      abilityIncreases: [{ type: "fixed", ability: "constitution", amount: 1 }],
      skillProficiencies: [],
      expertise: [],
      other: {},
    },
  },
  {
    name: "Elixir Expertise",
    preview: "Potion mastery. +1 Wis/Int, add modifier to potion effects.",
    description: [
      "Increase Wisdom or Intelligence by 1.",
      "When using potions you created, add Wisdom modifier to effects.",
      "Applies to damage, healing, and Save DCs.",
    ],
    modifiers: {
      abilityIncreases: [
        { type: "choice", abilities: ["wisdom", "intelligence"], amount: 1 },
      ],
      skillProficiencies: [],
      expertise: [],
      other: {},
    },
  },
  {
    name: "Elemental Adept",
    preview: "Master one damage type. Ignore resistance, reroll 1s.",
    description: [
      "Increase Int/Wis/Cha by 1.",
      "Choose Acid, Cold, Fire, Lightning, or Thunder.",
      "Spells ignore resistance to that type.",
      "Treat 1s on damage dice as 2s.",
      "Repeatable for different elements.",
    ],
    modifiers: {
      abilityIncreases: [
        {
          type: "choice",
          abilities: ["intelligence", "wisdom", "charisma"],
          amount: 1,
        },
      ],
      skillProficiencies: [],
      expertise: [],
      other: {
        elementalMastery: true,
      },
    },
  },
  {
    name: "Ember of the Fire Giant",
    preview:
      "Fire giant powers. +1 Str/Con/Wis, fire resistance, burning aura.",
    description: [
      "Increase Strength, Constitution, or Wisdom by 1.",
      "Gain resistance to fire damage.",
      "Searing Ignition: Replace one attack with 15-foot radius fire burst.",
      "Targets make Dex save (DC 8 + prof + ability mod) or take 1d8 + prof fire damage and blinded until next turn.",
      "Use prof bonus times per long rest, once per turn maximum.",
    ],
    modifiers: {
      abilityIncreases: [
        {
          type: "choice",
          abilities: ["strength", "constitution", "wisdom"],
          amount: 1,
        },
      ],
      skillProficiencies: [],
      expertise: [],
      other: {
        fireResistance: true,
        searingIgnition: true,
      },
    },
    prerequisites: {
      anyOf: [
        { type: "castingStyle", value: "Vigor Caster" },
        { type: "innateHeritage", value: "Giant's Blood" },
        { type: "innateHeritage", value: "Troll Blood" },
      ],
    },
  },
  {
    name: "Empowered Restoration",
    preview: "Enhanced healing magic and metamagic options.",
    description: [
      "Healing spells restore additional hit points equal to Intelligence modifier.",
      "Gain Empowered Healing metamagic option.",
      "Spend sorcery points to maximize healing dice.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        enhancedHealing: true,
      },
    },
  },
  {
    name: "Fade Away",
    preview: "Vanish when hurt. +1 Dex/Int, reaction invisibility.",
    description: [
      "Increase Dexterity or Intelligence by 1.",
      "After taking damage, use reaction to become invisible until end of next turn.",
      "Invisibility ends if you attack, deal damage, or force saves.",
    ],
    modifiers: {
      abilityIncreases: [
        { type: "choice", abilities: ["dexterity", "intelligence"], amount: 1 },
      ],
      skillProficiencies: [],
      expertise: [],
      other: {},
    },
  },
  {
    name: "Flames of Fiendfyre",
    preview: "Command fiendfyre. +1 Int/Cha, reroll fire damage 1s.",
    description: [
      "Increase Intelligence or Charisma by 1.",
      "Reroll 1s on fire damage dice.",
      "When casting fire spells, become wreathed in flames until next turn.",
      "Melee attackers take 1d4 fire damage.",
    ],
    modifiers: {
      abilityIncreases: [
        { type: "choice", abilities: ["intelligence", "charisma"], amount: 1 },
      ],
      skillProficiencies: [],
      expertise: [],
      other: {
        fireEnhancement: true,
      },
    },
  },
  {
    name: "Fury of the Frost Giant",
    preview:
      "Frost giant powers. +1 Str/Con/Wis, cold resistance, icy retaliation.",
    description: [
      "Increase Strength, Constitution, or Wisdom by 1.",
      "Gain resistance to cold damage.",
      "Frigid Retaliation: When hit within 30 feet, use reaction for cold blast.",
      "Target makes Con save (DC 8 + prof + ability mod) or take 1d8 + prof cold damage and speed becomes 0 until next turn.",
      "Use prof bonus times per long rest.",
    ],
    modifiers: {
      abilityIncreases: [
        {
          type: "choice",
          abilities: ["strength", "constitution", "wisdom"],
          amount: 1,
        },
      ],
      skillProficiencies: [],
      expertise: [],
      other: {
        coldResistance: true,
        frigidRetaliation: true,
      },
    },
    prerequisites: {
      anyOf: [
        { type: "castingStyle", value: "Vigor Caster" },
        { type: "innateHeritage", value: "Giant's Blood" },
        { type: "innateHeritage", value: "Troll Blood" },
      ],
    },
  },
  {
    name: "Guile of the Cloud Giant",
    preview: "Cloud giant powers. +1 Str/Con/Cha, defensive teleportation.",
    description: [
      "Increase Strength, Constitution, or Charisma by 1.",
      "Cloudy Escape: When hit by attack, use reaction for resistance to damage.",
      "Then teleport to unoccupied space within 30 feet that you can see.",
      "Use prof bonus times per long rest.",
    ],
    modifiers: {
      abilityIncreases: [
        {
          type: "choice",
          abilities: ["strength", "constitution", "charisma"],
          amount: 1,
        },
      ],
      skillProficiencies: [],
      expertise: [],
      other: {
        cloudyEscape: true,
      },
    },
    prerequisites: {
      anyOf: [
        { type: "castingStyle", value: "Vigor Caster" },
        { type: "innateHeritage", value: "Giant's Blood" },
        { type: "innateHeritage", value: "Troll Blood" },
      ],
    },
  },
  {
    name: "Keenness of the Stone Giant",
    preview: "Stone giant powers. +1 Str/Con/Wis, darkvision, stone throwing.",
    description: [
      "Increase Strength, Constitution, or Wisdom by 1.",
      "Gain darkvision 60 feet (or increase existing by 60 feet).",
      "Stone Throw: As bonus action, make ranged spell attack (60 feet range).",
      "Hit deals 1d10 force damage and target makes Str save or falls prone.",
      "Use prof bonus times per long rest.",
    ],
    modifiers: {
      abilityIncreases: [
        {
          type: "choice",
          abilities: ["strength", "constitution", "wisdom"],
          amount: 1,
        },
      ],
      skillProficiencies: [],
      expertise: [],
      other: {
        darkvision: 60,
        stoneThrow: true,
      },
    },
    prerequisites: {
      anyOf: [
        { type: "castingStyle", value: "Vigor Caster" },
        { type: "innateHeritage", value: "Giant's Blood" },
        { type: "innateHeritage", value: "Troll Blood" },
      ],
    },
  },

  {
    name: "Lucky",
    preview: "Luck points for advantage/disadvantage manipulation.",
    description: [
      "Gain Luck Points equal to proficiency bonus.",
      "Spend 1 to give yourself advantage on d20 tests.",
      "Spend 1 to impose disadvantage on attacks against you.",
      "Regain all points on long rest.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        luckPoints: true,
      },
    },
  },
  {
    name: "Magic Initiate",
    preview: "Learn spells from another school of magic.",
    description: [
      "Choose a school of magic.",
      "Lock in two cantrips from that school.",
      "Learn one 1st level spell from same school.",
      "Cast the 1st level spell once per long rest at lowest level.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        spellsLearned: {
          cantrips: 2,
          firstLevel: 1,
        },
      },
    },
  },
  {
    name: "Metamagic Adept",
    preview: "Additional metamagic options and sorcery points.",
    description: [
      "Learn two Metamagic options from sorcerer class.",
      "Gain 2 sorcery points for Metamagic use only.",
      "Can replace options on level up.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        metamagicOptions: 2,
        sorceryPoints: 2,
      },
    },
  },
  {
    name: "Mobile",
    preview: "Speed and mobility in combat. +10 speed.",
    description: [
      "+10 feet speed.",
      "Difficult terrain doesn't slow Dash action.",
      "Melee attacks don't provoke opportunity attacks from target.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        speedBonus: 10,
      },
    },
  },
  {
    name: "Observant",
    preview: "Sharp senses and lip reading. +1 Int/Wis.",
    description: [
      "Increase Intelligence or Wisdom by 1.",
      "Read lips if you can see mouth and understand language.",
      "+5 bonus to passive Perception and Investigation.",
    ],
    modifiers: {
      abilityIncreases: [
        { type: "choice", abilities: ["intelligence", "wisdom"], amount: 1 },
      ],
      skillProficiencies: [],
      expertise: [],
      other: {
        passivePerceptionBonus: 5,
        passiveInvestigationBonus: 5,
      },
    },
  },
  {
    name: "Occlumency Training",
    preview: "Mental defenses against legilimens and veritaserum.",
    description: [
      "Wisdom save to resist legilimens initially with advantage on contests.",
      "Can feed false information if you choose.",
      "Immune to veritaserum unless willing.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        mentalDefense: true,
      },
    },
  },
  {
    name: "Pinpoint Accuracy",
    preview: "Precision with ranged spells. Ignore cover, crit on 19+.",
    description: [
      "Ranged spell attacks ignore half cover, treat 3/4 cover as half.",
      "Critical hit on 19+ for spell attacks.",
      "+1 to spell attack rolls.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        spellAttackBonus: 1,
        criticalRange: 19,
      },
    },
  },
  {
    name: "Resilient",
    preview: "Gain proficiency in one saving throw. +1 to that ability.",
    description: [
      "Choose an ability you lack save proficiency in.",
      "Increase that ability by 1.",
      "Gain saving throw proficiency with it.",
    ],
    modifiers: {
      abilityIncreases: [{ type: "custom", category: "any", amount: 1 }],
      skillProficiencies: [],
      expertise: [],
      other: {
        savingThrowProficiency: "choice",
      },
    },
  },
  {
    name: "Savage Attacker",
    preview: "Deal maximum damage once per turn.",
    description: [
      "Once per turn when you hit with an attack.",
      "Roll damage dice twice and use either result.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {},
    },
  },
  {
    name: "Sentinel",
    preview: "Control battlefield with opportunity attacks.",
    description: [
      "Opportunity attacks reduce target speed to 0.",
      "Creatures provoke opportunity attacks even with Disengage.",
      "React to attack creatures attacking your allies within 5 feet.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {},
    },
  },
  {
    name: "Skill Expert",
    preview: "Become expert in skills. +1 ability, proficiency, expertise.",
    description: [
      "Increase one ability by 1.",
      "Gain proficiency in one skill.",
      "Choose one proficient skill to gain Expertise (double proficiency).",
    ],
    modifiers: {
      abilityIncreases: [{ type: "custom", category: "any", amount: 1 }],
      skillProficiencies: [{ type: "choice", count: 1 }],
      expertise: [{ type: "choice", count: 1 }],
      other: {},
    },
  },
  {
    name: "Spell Sniper",
    preview: "Enhanced ranged spells. Double range, ignore cover.",
    description: [
      "Double range of attack roll spells.",
      "Ranged spell attacks ignore half and 3/4 cover.",
      "Lock in one attack roll cantrip from any list.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        spellRangeDouble: true,
        cantripsLearned: 1,
      },
    },
  },
  {
    name: "Superior Wandless",
    preview: "Cast all locked-in spells without a wand.",
    description: [
      "Prerequisites: Cantrip Master or Wandless Magic.",
      "Can cast any locked-in spells wandlessly, not just cantrips.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        superiorWandlessCasting: true,
      },
    },
  },
  {
    name: "Tough",
    preview: "Increased hit points. +2 HP per level.",
    description: [
      "Hit Point maximum increases by 2 × character level.",
      "Gain +2 HP each time you level up thereafter.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        hitPointsPerLevel: 2,
      },
    },
  },
  {
    name: "War Caster",
    preview: "Combat spellcasting. Advantage on concentration saves.",
    description: [
      "Increase Int/Wis/Cha by 1.",
      "Advantage on concentration saves.",
      "Cast spells as opportunity attacks instead of weapon attacks.",
    ],
    modifiers: {
      abilityIncreases: [
        {
          type: "choice",
          abilities: ["intelligence", "wisdom", "charisma"],
          amount: 1,
        },
      ],
      skillProficiencies: [],
      expertise: [],
      other: {
        concentrationAdvantage: true,
      },
    },
  },
  {
    name: "Wandless Magic",
    preview: "Cast basic spells without a wand.",
    description: [
      "Cast these spells wandlessly if known: accio, alohomora, colovaria, illegibilus, incendio glacia, pereo, wingardium leviosa.",
      "Cannot use higher level spell slots.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        wandlessCasting: true,
      },
    },
  },

  // Heritage-specific feats
  {
    name: "Mature Harpy",
    preview: "Fully grown harpy wings and powers. Flying speed 50 feet.",
    description: [
      "Mighty Wings: Gain flying speed of 50 feet.",
      "Choose one: Soulcall or Feather Barrage.",
      "Soulcall: Action to sing, 30-foot radius Wisdom save or disadvantage on Perception vs others. Once per long rest.",
      "Feather Barrage: 30-foot cone, Dex save or 6d8 piercing + prone. Recharge 5-6, can't fly until end of next turn.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        flyingSpeed: 50,
        harpyPowers: true,
      },
    },
    prerequisites: {
      allOf: [
        { type: "innateHeritage", value: "Part-Harpy" },
        { type: "level", value: 8 },
      ],
    },
  },
  {
    name: "Mature Siren",
    preview: "Powerful siren song to charm multiple beings.",
    description: [
      "Siren Song: As action, charm beings up to proficiency bonus within 30 feet, or one being within 60 feet.",
      "Targets make Wisdom save vs spell save DC or charmed for 1 minute.",
      "Targets can repeat save at end of their turn.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        sirenSong: true,
      },
    },
    prerequisites: {
      allOf: [
        { type: "innateHeritage", value: "Part-Siren" },
        { type: "level", value: 8 },
      ],
    },
  },
  {
    name: "Nimble",
    preview: "Enhanced agility and escape abilities. +1 Str/Dex.",
    description: [
      "Increase Strength or Dexterity by 1.",
      "+5 feet walking speed.",
      "Gain proficiency in Acrobatics or Athletics.",
      "Advantage on Strength (Athletics) or Dexterity (Acrobatics) to escape grapples.",
    ],
    modifiers: {
      abilityIncreases: [
        { type: "choice", abilities: ["strength", "dexterity"], amount: 1 },
      ],
      skillProficiencies: [
        { type: "choice", skills: ["athletics", "acrobatics"], count: 1 },
      ],
      expertise: [],
      other: {
        speedBonus: 5,
        escapeAdvantage: true,
      },
    },
    prerequisites: {
      anyOf: [
        { type: "innateHeritage", value: "Elf Legacy" },
        { type: "innateHeritage", value: "Goblin Cunning" },
        { type: "innateHeritage", value: "Part-Leprechaun" },
        { type: "innateHeritage", value: "Pukwudgie Ancestry" },
      ],
    },
  },
  {
    name: "Pukwudgie Constitution",
    preview: "Pukwudgie resilience. +1 Con, cold/poison resistance.",
    description: [
      "Increase Constitution by 1.",
      "Resistance to cold and poison damage.",
      "Advantage on saves against being poisoned.",
    ],
    modifiers: {
      abilityIncreases: [{ type: "fixed", ability: "constitution", amount: 1 }],
      skillProficiencies: [],
      expertise: [],
      other: {
        coldResistance: true,
        poisonResistance: true,
      },
    },
    prerequisites: {
      anyOf: [{ type: "innateHeritage", value: "Pukwudgie Ancestry" }],
    },
  },
  {
    name: "Superior Wandless",
    preview: "Cast all locked-in spells without a wand.",
    description: [
      "Prerequisites: Cantrip Master or Wandless Magic.",
      "Can cast any locked-in spells wandlessly, not just cantrips.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        superiorWandlessCasting: true,
      },
    },
    prerequisites: {
      anyOf: [
        { type: "feat", value: "Cantrip Master" },
        { type: "feat", value: "Wandless Magic" },
      ],
    },
  },
  {
    name: "Telepathic",
    preview: "Telepathic communication abilities. +1 Int/Wis/Cha.",
    description: [
      "Increase Intelligence, Wisdom, or Charisma by 1.",
      "Telepathic Utterance: Speak telepathically to creatures within 60 feet.",
      "Must share a language for understanding.",
      "One-way communication only.",
    ],
    modifiers: {
      abilityIncreases: [
        {
          type: "choice",
          abilities: ["intelligence", "wisdom", "charisma"],
          amount: 1,
        },
      ],
      skillProficiencies: [],
      expertise: [],
      other: {
        telepathy: true,
      },
    },
    prerequisites: {
      anyOf: [
        { type: "subclass", value: "Divinations" },
        { type: "subclass", value: "Grim Diviner" },
      ],
    },
  },
];

export const potions = {
  1: [
    {
      name: "Blemish Blitzer",
      rarity: "common",
      description: "Removes acne and blemishes from face when applied",
    },
    {
      name: "Babbling Beverage",
      rarity: "common",
      description: "Makes words come out as gibberish for 1 minute",
    },
    {
      name: "Cupid Crystals",
      rarity: "common",
      description:
        "Love potion - target becomes infatuated with next being seen",
    },
    {
      name: "Doxycide",
      rarity: "common",
      description: "Poison mist for dealing with pests",
    },
    {
      name: "Dreamless Sleep Potion",
      rarity: "common",
      description: "Gain long rest benefits after 4 hours of deep sleep",
    },
    {
      name: "Elixir to Induce Euphoria",
      rarity: "common",
      description:
        "Causes happiness with side effects of singing and nose-tweaking",
    },
    {
      name: "Heartbreak Teardrops",
      rarity: "common",
      description: "Love potion causing fear of rejection",
    },
    {
      name: "Hiccoughing Solution",
      rarity: "common",
      description: "Causes hiccups for 1 hour with casting disadvantage",
    },
  ],
  2: [
    {
      name: "Antidote of Common Poisons",
      rarity: "common",
      description: "Neutralizes simple poisons and provides advantage",
    },
    {
      name: "Beautification Potion",
      rarity: "uncommon",
      description: "Makes appearance more attractive for 10 minutes",
    },
    {
      name: "Shrinking Solution",
      rarity: "common",
      description: "Gain effects of diminuendo spell for 1d4 hours",
    },
    {
      name: "Swelling Solution",
      rarity: "common",
      description: "Gain effects of engorgio spell for 1d4 hours",
    },
    {
      name: "Wound Cleaning Potion",
      rarity: "common",
      description: "Sterilizes wounds, stabilizes dying creatures",
    },
  ],
  3: [
    {
      name: "Aging Potion",
      rarity: "uncommon",
      description: "Ages you by 4d10 years for 1 hour",
    },
    {
      name: "Baruffio's Brain Elixir",
      rarity: "uncommon",
      description: "Advantage on Intelligence checks for 1 hour",
    },
    {
      name: "Blood Replenishing Potion",
      rarity: "uncommon",
      description: "Doubles hit dice recovery or regains all spent hit dice",
    },
    {
      name: "Exstimulo Potion",
      rarity: "uncommon",
      description: "Next spell cast as if one level higher",
    },
    {
      name: "Fire Protection Potion",
      rarity: "uncommon",
      description: "Resistance to fire damage for 1 hour",
    },
    {
      name: "Strengthening Solution",
      rarity: "uncommon",
      description: "Strength score raised to 21 for 1 hour",
    },
  ],
  4: [
    {
      name: "Beguiling Bubbles",
      rarity: "uncommon",
      description: "Target charmed by chosen being for 1 hour",
    },
    {
      name: "Draught of Peace",
      rarity: "uncommon",
      description: "Suppresses strong emotions for 1 hour",
    },
    {
      name: "Gillyweed",
      rarity: "uncommon",
      description: "Breathe underwater and swim for 1 hour",
    },
    {
      name: "Memory Potion",
      rarity: "uncommon",
      description: "Restores lost memories, advantage on knowledge checks",
    },
    {
      name: "Wideye Potion",
      rarity: "uncommon",
      description: "Removes up to 2 levels of exhaustion",
    },
  ],
  5: [
    {
      name: "Invigoration Draught",
      rarity: "rare",
      description: "Heals 8d4+8 hit points",
    },
    {
      name: "Invisibility Potion",
      rarity: "rare",
      description: "Invisibility for 10 minutes (no concentration)",
    },
    {
      name: "Mandrake Restorative Draught",
      rarity: "rare",
      description: "Ends charm, paralysis, petrification, or transfiguration",
    },
    {
      name: "Skele-Gro",
      rarity: "rare",
      description: "Rapidly regrows and repairs bones",
    },
    {
      name: "Wit-Sharpening Potion",
      rarity: "rare",
      description: "Raises Intelligence and Wisdom to 20 for 1 hour",
    },
  ],
  6: [
    {
      name: "Amortentia",
      rarity: "very rare",
      description:
        "When a being drinks this potion, they are overwhelmingly charmed by the brewer for 1 week. The charmed subject believes the brewer to be their one true love and will perform any request to the best of their ability. This charmed effect can only be removed by an antidote.",
    },
    {
      name: "Draught of the Living Death",
      rarity: "very rare",
      description:
        "The drinker falls into a deep sleep and can't be awoken by any means, aside from administering an antidote. The creature will breathe normally, but cannot be suffocated. It doesn't need to eat or drink and will age normally.",
    },
    {
      name: "Erumpent Potion",
      rarity: "rare",
      description:
        "Throw at a point up to 60 feet away for violent explosion. Creatures within 10 feet take 10d6 bludgeoning damage (DC 14 Dex save for half), creatures within 30 feet take 4d8 thunder damage. Highly volatile and will explode if poured out.",
    },
    {
      name: "Essence of Dittany",
      rarity: "very rare",
      description:
        "This highly concentrated liquid rapidly heals and regenerates open wounds, helping you regain 10d4 + 20 hit points when applied. If severed body parts are held in place, this potion causes limbs to heal back on immediately.",
    },
    {
      name: "Essence of Insanity",
      rarity: "rare",
      description:
        "A creature that makes contact with this poison is overwhelmed with paranoia and becomes poisoned for 1 hour. It is frightened of the nearest creature and must dash away from that creature on its next turn.",
    },
    {
      name: "Hate Potion",
      rarity: "rare",
      description:
        "When a being drinks this potion, they view a chosen being as their most hated enemy for 10 minutes. If no target is chosen during brewing, the drinker will be hostile towards the next being they see. Acts as antidote to love potions.",
    },
    {
      name: "Polyjuice Potion",
      rarity: "very rare",
      description:
        "After adding hair, nail clipping, or other part of a human, drinking this potion perfectly transforms you into that human for 1 hour, changing physical features and voice. Statistics remain unchanged but size may change.",
    },
    {
      name: "Wolfsbane Potion",
      rarity: "very rare",
      description:
        "When a lycanthrope drinks this potion once a day for the entire week before the full moon, their alignment does not change and they retain control during transformation. Missing a single dose negates the effect.",
    },
  ],
  7: [
    {
      name: "Death-Cap Draught",
      rarity: "very rare",
      description:
        "Death cap mushrooms are the key ingredient to one of the most deadly poisons. A creature that ingests this poison must make a DC 19 Constitution saving throw, taking 84 (24d6) poison damage and becoming poisoned for 1 day on a failed save, or half damage and poisoned for 1 minute on a successful one.",
    },
    {
      name: "Drink of Despair",
      rarity: "legendary",
      description:
        "When a creature drinks this fabled poison, it hallucinates all of its worst fears and memories, vividly reexperiencing its deepest regrets and darkest traumas. It is incapacitated for 30 seconds, reduced to 1 hit point and gains 4 levels of exhaustion.",
    },
    {
      name: "Felix Felicis",
      rarity: "legendary",
      description:
        "Also known as 'liquid luck,' this potion makes you exceptionally lucky for 1d4 hours. Your Charisma score is raised to 21, you can't be surprised and have advantage on attack rolls, ability checks, and saving throws. Other creatures have disadvantage on attack rolls against you.",
    },
    {
      name: "Veritaserum",
      rarity: "legendary",
      description:
        "A creature subjected to this potion must succeed on a DC 21 Charisma saving throw. On a failed save, the creature is compelled to tell the whole truth to any questions asked within the next 10 minutes. You know whether the creature succeeds or fails based on their dull and dazed expression.",
    },
  ],
};

export const qualityDCs = {
  common: { ruined: 0, flawed: 5, normal: 10, exceptional: 15, superior: 20 },
  uncommon: {
    ruined: 0,
    flawed: 8,
    normal: 12,
    exceptional: 18,
    superior: 22,
  },
  rare: { ruined: 0, flawed: 10, normal: 15, exceptional: 20, superior: 25 },
  "very rare": {
    ruined: 0,
    flawed: 15,
    normal: 20,
    exceptional: 25,
    superior: 30,
  },
  legendary: {
    ruined: 0,
    flawed: 20,
    normal: 25,
    exceptional: 30,
    superior: 35,
  },
};

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

export const templates = {
  spell: `## 🔮 [Spell Name]

**📊 Stats:**
- **Level:** 
- **School:** 
- **Casting Time:** 
- **Range:** 
- **Components:** 
- **Duration:** 
- **Concentration:** 

**📝 Description:**


**⚔️ Combat Use:**


**🎯 Strategic Notes:**


---

`,
  session: `# 📅 Session ${new Date().toLocaleDateString()}

## 📖 Session Summary


## 🗣️ Important NPCs
| Name | Role | Notes |
|------|------|-------|
|      |      |       |

## 🗺️ Locations Visited


## ⚔️ Combat Encounters


## 🎒 Loot & Rewards


## 📝 Character Development


## 🎯 Next Session Goals
- [ ] 
- [ ] 
- [ ] 

## 💭 Player Notes


---

`,
  combat: `## ⚔️ Combat Tactics

### 🛡️ Defensive Options
- 
- 

### ⚡ Offensive Strategies
- 
- 

### 🎭 Roleplay in Combat
- 
- 

### 🤝 Team Synergies
- 
- 

---

`,
  relationship: `## 👥 Relationship: [NPC Name]

**📊 Relationship Status:** 
**🎭 Their Personality:** 
**🎯 Their Goals:** 
**💭 What They Think of Me:** 
**🤝 How I Can Help Them:** 
**⚠️ Potential Conflicts:** 

### 📝 Interaction History


### 🎯 Future Plans


---

`,
  creature: `## 🐉 [Creature Name]

**📊 Basic Stats:**
- **AC:** 
- **HP:** 
- **Speed:** 
- **CR:** 
- **Size:** 
- **Type:** 

**💪 Ability Scores:**
| STR | DEX | CON | INT | WIS | CHA |
|-----|-----|-----|-----|-----|-----|
|     |     |     |     |     |     |

**🎯 Skills & Senses:**
- **Skills:** 
- **Senses:** 
- **Damage Resistances:** 
- **Damage Immunities:** 
- **Condition Immunities:** 

**✨ Special Abilities:**


**⚔️ Actions:**


**🌟 Legendary Actions:** *(if applicable)*


**📖 Lore & Description:**


**🎯 Tactical Use:**
- **Combat Role:** 
- **Environment:** 
- **Allies:** 

---

`,
};
