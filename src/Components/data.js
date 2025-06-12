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
};
