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

export const houseAbilityBonuses = {
  Gryffindor: { fixed: ["constitution", "charisma"], choice: 1 },
  Hufflepuff: { fixed: ["constitution", "wisdom"], choice: 1 },
  Ravenclaw: { fixed: ["intelligence", "wisdom"], choice: 1 },
  Slytherin: { fixed: ["dexterity", "charisma"], choice: 1 },
  Beauxbatons: { fixed: ["dexterity", "wisdom"], choice: 1 },
  Durmstrang: { fixed: ["strength", "constitution"], choice: 1 },
  Uagadou: { fixed: ["strength", "dexterity"], choice: 1 },
  Mahoutokoro: { fixed: ["dexterity", "intelligence"], choice: 1 },
  Castelobruxo: { fixed: ["constitution", "dexterity"], choice: 1 },
  Koldovstoretz: { fixed: ["strength", "wisdom"], choice: 1 },
  "Horned Serpent": { fixed: ["intelligence", "charisma"], choice: 1 },
  "Wampus Cat": { fixed: ["dexterity", "constitution"], choice: 1 },
  Thunderbird: { fixed: ["strength", "charisma"], choice: 1 },
  Pukwudgie: { fixed: ["wisdom", "charisma"], choice: 1 },
};

export const houseFeatures = {
  Gryffindor: {
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
              "When in combat, your friends eagerly stand beside you as a beacon of courage and inspiration. Once per long rest, if an ally within 10 feet of you falls to 0 HP, you may use your reaction to defend them from danger.",
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
    features: [
      {
        name: "Words of Encouragement OR Neg D4",
        description: "Choose between giving d4 bonus or penalty to rolls",
        isChoice: true,
        options: [
          {
            name: "Words of Encouragement",
            description:
              "You may use your reaction to give an ally who can hear you, a d4 bonus to the first attack roll, ability check, or saving throw they make before the start of your next turn.",
          },
          {
            name: "Neg D4",
            description:
              "You may use your reaction to give a creature who can hear you, a d4 penalty to any attack roll, ability check, or saving throw they make before the start of your next turn.",
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
    features: [
      {
        name: "Compromising Information",
        description:
          "Whenever you make a Charisma check related to using a person's secrets, you are considered proficient in the appropriate skill and add double your proficiency bonus to the check.",
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
    features: [
      {
        name: "Nimble Evasion",
        description:
          "When you are subjected to an effect that allows you to make a Strength or Dexterity saving throw to take only half damage, you instead take no damage if you succeed.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Durmstrang: {
    features: [
      {
        name: "Cold Efficiency",
        description:
          "You add the Bombarda spell to your list of known spells. You may cast it as a bonus action during any combat.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Uagadou: {
    features: [
      {
        name: "Lesser Animagus",
        description:
          "You gain one Animagus form of your choice using the stat block of a bat, cat, crab, frog (toad), hawk, lizard, octopus, owl, poisonous snake, fish (quipper), rat, raven, sea horse, spider (Tarantula), or weasel.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Mahoutokoro: {
    features: [
      {
        name: "Quidditch Fanatic",
        description:
          "You gain tool proficiency with Brooms. Additionally, if you take the Quidditch Fan background or the Aerial Combatant Feat, you gain Expertise with Brooms instead.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Castelobruxo: {
    features: [
      {
        name: "Beast Finder",
        description:
          "Castelobruxo School in Brazil has an intense focus on magics of the natural world and how to recognize and utilize them.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Koldovstoretz: {
    features: [
      {
        name: "Quick Brew",
        description:
          "You gain Tool Proficiency with a Potioneer's Kit. Additionally, Whenever you attempt to brew a potion outside of class, you gain two doses instead of one.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  "Horned Serpent": {
    features: [
      {
        name: "Scholar's Mind",
        description:
          "You add half your proficiency bonus to any Intelligence or Charisma ability check you make that doesn't already include your proficiency bonus.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  "Wampus Cat": {
    features: [
      {
        name: "Warrior's Endurance",
        description:
          "When you roll a 16 or higher on a death saving throw, you instantly regain 1 hit point. You can't use this feature again until you finish a long rest.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Thunderbird: {
    features: [
      {
        name: "Adventurer's Footing",
        description:
          "Moving through difficult terrain costs you no extra movement, your walking speed increases by 5, and you gain a climbing speed and a swimming speed equal to your walking speed.",
        isChoice: false,
      },
    ],
    feat: true,
  },
  Pukwudgie: {
    features: [
      {
        name: "Healer's Knack",
        description:
          "Whenever you cast a healing spell, any affected creatures gain Temporary hit points equal to 1 + your Wisdom or Charisma Modifier (Whichever is higher).",
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
