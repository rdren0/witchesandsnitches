export const schoolGroups = {
  main: {
    title: "Major Wizarding Schools",
    schools: {
      Hogwarts: ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"],
      Ilvermorny: ["Horned Serpent", "Wampus Cat", "Thunderbird", "Pukwudgie"],
    },
  },
  international: {
    title: "International Schools",
    schools: {
      Beauxbatons: ["Beauxbatons"],
      Durmstrang: ["Durmstrang"],
      Uagadou: ["Uagadou"],
      Mahoutokoro: ["Mahoutokoro"],
      Castelobruxo: ["Castelobruxo"],
      Koldovstoretz: ["Koldovstoretz"],
    },
  },
};

export const houseFeatures = {
  Gryffindor: {
    fixed: ["constitution", "charisma"],
    features: [
      {
        name: "Inspiring Presence OR Bravehearted",
        description:
          "Choose between inspiring allies when they fall or advantage on fear saves",
        isChoice: true,
        options: [
          {
            name: "Inspiring Presence",
            description:
              "When in combat, your friends eagerly stand beside you as a beacon of courage and inspiration. Once per long rest, if an ally within 10 feet of you falls to 0 HP, you may use your reaction to defend them from danger. Using this ability ensures they will regain consciousness at 1 HP. An individual can only benefit from this effect once per day.",
          },
          {
            name: "Bravehearted",
            description:
              "You have advantage on saving throws against being frightened from any source other than a Dementor.",
          },
        ],
      },
      {
        name: "True Gryffindor",
        description:
          "In times of dire need, the Sword of Gryffindor may present itself to you.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Hufflepuff: {
    fixed: ["constitution", "wisdom"],
    features: [
      {
        name: "Words of Encouragement OR Neg D4",
        description: "Choose between giving d4 bonus or penalty to rolls",
        isChoice: true,
        options: [
          {
            name: "Words of Encouragement",
            description:
              "You may use your reaction to give an ally who can hear you, a d4 BONUS to the first attack roll, ability check, or saving throw they make before the start of your next turn. You may use this ability a number of times per long rest equal to your Charisma modifier (minimum of 1). A target may only benefit from this effect once per round.",
          },
          {
            name: "Neg D4",
            description:
              "You may use your reaction to give a creature who can hear you, a d4 PENALTY to any attack roll, ability check, or saving throw they make before the start of your next turn. You may use this ability a number of times per long rest equal to your Charisma modifier (minimum of 1). A target may only be penalized from this effect once per round.",
          },
        ],
      },
      {
        name: "Steadfast Loyalty OR Kitchen Trips",
        description:
          "Choose between loyalty saves or magical being interaction",
        isChoice: true,
        options: [
          {
            name: "Steadfast Loyalty",
            description:
              "You have advantage on saving throws against any effect that would make you attack or work against a creature you would normally consider an ally.",
          },
          {
            name: "Kitchen Trips",
            description:
              "Your experience with the Hogwarts house elves has taught you how to politely address and interact with magical beings. Oh, and you can get tons of snacks.",
          },
        ],
      },
    ],
    feat: true,
  },
  Ravenclaw: {
    fixed: ["intelligence", "wisdom"],
    features: [
      {
        name: "In-Depth Knowledge",
        description:
          "Whenever you make an Intelligence or Wisdom ability check that lets you add your proficiency bonus, you can treat a d20 roll of 5 or lower as a 6.",
        isChoice: false,
      },
      {
        name: "Rowena's Library",
        description:
          "You can easily research a desired topic through enlisting your housemates' help and browsing books exclusively found in the Ravenclaw common room.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Slytherin: {
    fixed: ["dexterity", "charisma"],
    features: [
      {
        name: "Compromising Information",
        description:
          "Whenever you make a Charisma check related to using a person's secrets, you are considered proficient in the appropriate skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.",
        isChoice: false,
      },
      {
        name: "A Noble Quality",
        description:
          "You're able to adopt a persona of importance to blend in among high-ranking officials and prestigious witches and wizards.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Beauxbatons: {
    fixed: ["dexterity", "wisdom"],
    features: [
      {
        name: "Nimble Evasion",
        description:
          "When you are subjected to an effect that allows you to make a Strength or Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.",
        isChoice: false,
      },
      {
        name: "Exchange Student",
        description:
          "You're familiar with the culture of other Wizarding Governments and Institutions. You may make an insight check to understand and emulate their culture, fit in seamlessly with your new peers, and make them view you more favorably. You may use this feature once per day.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Durmstrang: {
    fixed: ["strength", "constitution"],
    features: [
      {
        name: "Cold Efficiency",
        description:
          "You add the Bombarda spell to your list of known spells. You may cast it as a bonus action during any combat.",
        isChoice: false,
      },
      {
        name: "Aggressive Endurance",
        description:
          "When you take damage that would reduce you to 0 hit points, you stay conscious and continue acting until the end of your next turn. If you do not receive healing by then, you fall unconscious. Once you use this feature, you cannot do so again until you finish a long rest.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Uagadou: {
    fixed: ["strength", "dexterity"],
    features: [
      {
        name: "Lesser Animagus",
        description:
          "You gain one Animagus form of your choice using the stat block of a bat, cat, crab, frog (toad), hawk, lizard, octopus, owl, poisonous snake, fish (quipper), rat, raven, sea horse, spider (Tarantula), or weasel. You gain this feature at 6th level.",
        isChoice: false,
      },
      {
        name: "I'd Rather Use My Hands",
        description:
          "Your Wandless Magic training at school makes using a wand feel foreign and uncomfortable in your fingers. You may add half your Dexterity bonus to your spell attempts when attempting to cast a spell wandlessly, rounded down. You must have the Wandless Magic or Superior Wandless Magic feat to do so.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Mahoutokoro: {
    fixed: ["dexterity", "intelligence"],
    features: [
      {
        name: "Quidditch Fanatic",
        description:
          "You gain tool proficiency with Brooms. Additionally, if you take the Quidditch Fan background or the Aerial Combatant Feat, you gain Expertise with Brooms instead.",
        isChoice: false,
      },
      {
        name: "Locked in Spells",
        description:
          "Students of Mahoutokoro School start their Magical Education a year earlier than other schools, and as a result, you gain an advantage. You may choose 3 Charms spells, 3 DADA spells, and 2 Transfigurations spells from the First Year spell list to have one successful attempt.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Castelobruxo: {
    fixed: ["constitution", "dexterity"],
    features: [
      {
        name: "Beast Finder",
        description:
          "Castelobruxo School in Brazil has an intense focus on magics of the natural world and how to recognize and utilize them. You can use your action to spend one spell slot to focus your awareness on the region around you. For 1 minute per level of the spell slot you expend, you can sense Magical Creatures within 100 Feet of you. You may additionally make a Magical Creatures check to identify what kind of creatures you sensed. This feature doesn’t reveal the creatures’ location or number.",
        isChoice: false,
      },
      {
        name: "Toxicology Specialist",
        description:
          "Your training with handling dangerous and poisonous plants has caused you to be able to resist the effects of poisons. You have advantage on any constitution saving throws to resist poison damage or being poisoned.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Koldovstoretz: {
    fixed: ["strength", "wisdom"],
    features: [
      {
        name: "Quick Brew",
        description:
          "You gain Tool Proficiency with a Potioneer's Kit. When brewing potions outside of class, you gain two doses instead of one.",
        isChoice: false,
      },
      {
        name: "Improvised Brooms",
        description:
          "Koldovstoretz has a reputation for its use of uprooted trees as brooms rather than what is traditional throughout the rest of the world, and you have been taught how to make these vehicles in a pinch. If you spend 10 minutes, you can make a DC 15 Spellcasting ability check to enchant any uprooted tree into a broom. Brooms created in this way can carry up to three medium sized creatures without being encumbered.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  "Horned Serpent": {
    fixed: ["intelligence", "charisma"],
    features: [
      {
        name: "Scholar's Mind",
        description:
          "You add half your proficiency bonus to any Intelligence or Charisma ability check you make that doesn't already include your proficiency bonus.",
        isChoice: false,
      },
      {
        name: "Procedural Thinking",
        description:
          "You enjoy testing yourself with riddles and logic puzzles. If you get stuck on one, make an investigation check at advantage and you might subconsciously connect a few dots.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  "Wampus Cat": {
    fixed: ["dexterity", "constitution"],
    features: [
      {
        name: "Warrior's Endurance",
        description:
          "When you roll a 16 or higher on a death saving throw, you instantly regain 1 hit point. You can't use this feature again until you finish a long rest.",
        isChoice: false,
      },
      {
        name: "Contagious Valor",
        description:
          " As an action, you unleash a battle cry infused with arcane energy. Up to ten other creatures of your choice within 60 feet of you that can hear you gain advantage on attack rolls and saving throws until the start of your next turn. Once you use this feature, you can’t use it again until you finish a long rest.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Thunderbird: {
    fixed: ["strength", "charisma"],
    features: [
      {
        name: "Adventurer's Footing",
        description:
          "Moving through difficult terrain costs you no extra movement, your walking speed increases by 5, and you gain a climbing speed and a swimming speed equal to your walking speed.",
        isChoice: false,
      },
      {
        name: "Dependable Bearings",
        description:
          "You have a good sense of direction and can easily use notable landmarks and geography to remember the general layout of areas. Additionally, you gain advantage in survival checks for navigation.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Pukwudgie: {
    fixed: ["wisdom", "charisma"],
    features: [
      {
        name: "Healer's Knack",
        description:
          "Whenever you cast a healing spell, any affected creatures gain Temporary hit points equal to 1 + your Wisdom or Charisma Modifier (Whichever is higher).",
        isChoice: false,
      },
      {
        name: "A Diplomatic Touch",
        description:
          "If you assist a hostile creature in a meaningful way, they're more likely to reconsider their hostility towards you, potentially defusing the situation.",
        isChoice: false,
      },
    ],
    feat: true,
  },
};

export const houseColors = {
  Gryffindor: { primary: "#740001", secondary: "#eeba30" },
  Hufflepuff: { primary: "#f0c75e", secondary: "#372e29" },
  Ravenclaw: { primary: "#0e1a40", secondary: "#946b2d" },
  Slytherin: { primary: "#1a472a", secondary: "#aaaaaa" },
  Beauxbatons: { primary: "#87ceeb", secondary: "#ffffff" },
  Durmstrang: { primary: "#8b0000", secondary: "#2f4f4f" },
  Uagadou: { primary: "#ff6b35", secondary: "#004e89" },
  Mahoutokoro: { primary: "#c41e3a", secondary: "#ffffff" },
  Castelobruxo: { primary: "#228b22", secondary: "#ffff00" },
  Koldovstoretz: { primary: "#4169e1", secondary: "#ffffff" },
  "Horned Serpent": { primary: "#0d4f8c", secondary: "#ffffff" },
  "Wampus Cat": { primary: "#8b4513", secondary: "#ffa500" },
  Thunderbird: { primary: "#ff4500", secondary: "#ffff00" },
  Pukwudgie: { primary: "#228b22", secondary: "#ffffff" },
};
