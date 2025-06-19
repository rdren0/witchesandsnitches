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
              "You may use your reaction to give an ally who can hear you, a d4 bonus to the first attack roll, ability check, or saving throw they make before the start of your next turn. You may use this ability a number of times per long rest equal to your Charisma modifier (minimum of 1). A target may only benefit from this effect once per round.",
          },
          {
            name: "Neg D4",
            description:
              "You may use your reaction to give a creature who can hear you, a d4 penalty to any attack roll, ability check, or saving throw they make before the start of your next turn. You may use this ability a number of times per long rest equal to your Charisma modifier (minimum of 1). A target may only be penalized from this effect once per round.",
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
          "You may make an insight check to understand and emulate another culture, fitting in seamlessly and gaining favor. Usable once per day.",
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
          "When you take damage that would reduce you to 0 hit points, you can use your reaction to stay conscious and continue acting until the end of your next turn. If you do not receive healing by then, you fall unconscious. Once per long rest.",
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
          "At 6th level, you gain one Animagus form using the stat block of a common small beast (e.g., bat, owl, spider).",
        isChoice: false,
      },
      {
        name: "I'd Rather Use My Hands",
        description:
          "You may add half your Dexterity bonus to your wandless spell attempts if you have the Wandless Magic or Superior Wandless Magic feat.",
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
          "You gain tool proficiency with Brooms. If you have the Quidditch Fan background or Aerial Combatant feat, you gain Expertise with Brooms.",
        isChoice: false,
      },
      {
        name: "Locked in Spells",
        description:
          "You may choose 3 Charms, 3 DADA, and 2 Transfiguration spells from the First Year spell list to have one successful attempt.",
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
          "You can spend one spell slot to sense magical creatures within 100 feet for 1 minute per slot level. You may attempt a Magical Creatures check to identify them.",
        isChoice: false,
      },
      {
        name: "Toxicology Specialist",
        description:
          "You have advantage on Constitution saving throws to resist poison damage or being poisoned.",
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
          "You can spend 10 minutes and succeed on a DC 15 spellcasting check to enchant an uprooted tree into a broom that can carry up to three medium creatures.",
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
          "Add half your proficiency bonus to any Intelligence or Charisma check you make that doesn't already include proficiency.",
        isChoice: false,
      },
      {
        name: "Procedural Thinking",
        description:
          "If stuck on a riddle or puzzle, you may make an Investigation check at advantage to subconsciously connect the dots.",
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
          "When you roll a 16 or higher on a death saving throw, you instantly regain 1 HP. Once per long rest.",
        isChoice: false,
      },
      {
        name: "Contagious Valor",
        description:
          "As an action, unleash a battle cry that gives up to ten allies within 60 feet advantage on attack rolls and saving throws until your next turn. Once per long rest.",
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
          "You ignore difficult terrain, gain +5 to movement speed, and gain a climbing and swimming speed equal to your walking speed.",
        isChoice: false,
      },
      {
        name: "Dependable Bearings",
        description:
          "You have a strong sense of direction and gain advantage on Survival checks made to navigate or track.",
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
          "When you cast a healing spell, affected creatures gain temporary HP equal to 1 + your Wisdom or Charisma modifier (whichever is higher).",
        isChoice: false,
      },
      {
        name: "A Diplomatic Touch",
        description:
          "If you assist a hostile creature in a meaningful way, it may reconsider its hostility. This may defuse tension in roleplay scenarios.",
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
