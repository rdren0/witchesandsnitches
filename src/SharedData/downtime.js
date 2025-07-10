export const downtime = {
  employment: {
    name: "Employment & Economics",
    description: "Activities related to jobs, money, and commerce",
    activities: [
      "Gain a Job - Roll Persuasion or an appropriate skill check (e.g., Magical Creatures at the Magical Menagerie)",
      "Promotion - If already employed, students can attempt a promotion with Persuasion or an appropriate skill check",
      "Work Job - Roll to determine earnings based on job difficulty",
      "Allowance - Roll based on family wealth to determine allowance received",
    ],
  },

  commerce: {
    name: "Shopping & Trading",
    description: "Buying, selling, and trading items",
    activities: [
      "Shopping - Purchase items from the shopping list. No haggling",
      "Selling - Sell items at half their original price. No haggling",
    ],
  },

  exploration: {
    name: "Exploration & Discovery",
    description: "Exploring the castle, grounds, and forbidden areas",
    activities: [
      "Explore the Castle - Roll Investigation to uncover new locations and secrets",
      "Explore the Forbidden Forest - Requires Stealth and Investigation rolls",
      "Restricted Section - Requires Stealth and Investigation rolls",
      "Search for Magical Creatures - Roll Magical Creatures",
      "Search for Plants - Roll Herbology",
    ],
  },

  social: {
    name: "Social Interactions",
    description: "Activities involving other students and social dynamics",
    activities: [
      "Spread Rumors - Roll Deception, Intimidation, Performance, or Persuasion",
      "Dig for Dirt - Roll Investigation, Insight, Intimidation, or Persuasion",
      "Prank Other Students - Players can attempt mischievous acts",
    ],
  },

  mischief: {
    name: "Mischief & Rule Breaking",
    description: "Illegal or rule-breaking activities",
    activities: ["Stealing - Roll Sleight of Hand and Investigation"],
  },

  personal_development: {
    name: "Personal Development",
    description:
      "Activities focused on improving character abilities and skills",
    activities: [
      "Increase an Ability Score - Must succeed on three separate checks using separate downtime slots",
      "Gain Proficiency or Expertise - Must succeed on three separate checks using separate downtime slots",
      "Increase Wand Stat - Roll against a DC based on the current Wand Stat",
    ],
  },

  magic_study: {
    name: "Magical Studies",
    description: "Activities related to learning and practicing magic",
    activities: [
      "Research Spells - Roll History of Magic to research a spell",
      "Attempt Spells - Practice casting any spell previously researched or attempted",
      "Create a Spell - Must succeed on three separate checks using separate downtime slots",
      "Studying - Improve performance in classes through focused study",
    ],
  },

  research: {
    name: "Research & Investigation",
    description: "Academic and investigative pursuits",
    activities: ["Research a Topic - Roll Investigation to gather information"],
  },

  crafting: {
    name: "Crafting & Creation",
    description: "Making items, potions, and other creations",
    activities: [
      "Craft Items - Roll with the appropriate tool proficiency",
      "Brew a Potion - Requires Proficiency with a Potioneer's Kit and a Potion Making check",
      "Invent a Potion - Must succeed on three separate checks using separate downtime slots",
    ],
  },

  cooking: {
    name: "Cooking & Recipes",
    description: "Food preparation and culinary activities",
    activities: [
      "Cooking - Roll Survival to prepare meals",
      "Learn a Recipe - Roll Survival to memorize a recipe",
      "Create a New Recipe - Must succeed on three separate checks using separate downtime slots",
    ],
  },
  herbology_advanced: {
    name: "Advanced Herbology",
    description: "Advanced plant manipulation and engineering",
    activities: [
      "Engineer Plants - Must succeed on three separate checks using separate downtime slots",
    ],
  },

  tutoring: {
    name: "Tutoring & Education",
    description: "Seeking additional instruction and guidance",
    activities: [
      "Hire a Tutor - Seek out private instruction",
      "Teacher Tutor - Receive guidance from a professor",
    ],
  },

  special_magic: {
    name: "Special Magical Arts",
    description: "Advanced and specialized magical practices",
    activities: [
      "Animagus Form (RP) - Engage in roleplay to explore an Animagus transformation",
    ],
  },

  custom: {
    name: "Custom Activities",
    description: "Player-proposed activities subject to GM approval",
    activities: [
      "Custom Activity - Propose your own activity (GM approval required)",
    ],
  },
};

export const getAllActivities = () => {
  const activities = [""];
  Object.values(downtime).forEach((category) => {
    if (category.activities) {
      activities.push(...category.activities);
    }
  });
  return activities;
};

export const getActivitiesByCategory = (categoryKey) => {
  return downtime[categoryKey]?.activities || [];
};

export const findActivityCategory = (activityText) => {
  for (const [categoryKey, category] of Object.entries(downtime)) {
    if (category.activities && category.activities.includes(activityText)) {
      return {
        key: categoryKey,
        name: category.name,
        description: category.description,
      };
    }
  }
  return null;
};

export const wandModifiers = [
  { name: "divinations", displayName: "Divinations", ability: "wisdom" },
  {
    name: "transfiguration",
    displayName: "Transfiguration",
    ability: "strength",
  },
  { name: "charms", displayName: "Charms", ability: "dexterity" },
  { name: "healing", displayName: "Healing", ability: "intelligence" },
  {
    name: "jinxesHexesCurses",
    displayName: "Jinxes/Hexes/Curses",
    ability: "charisma",
  },
];

export const classes = [
  "Transfiguration",
  "Potions",
  "	Ancient Runes",
  "DADA",
  "Astronomy",
  "Magical Creatures	",
  "Charms",
  "Field Studies",
  "	Muggle Studies",
  "History of Magic",
  "Divinations",
  "Alchemy",
  "Herbology",
  "Arithmancy",
  "Xylomancy",
  "Magical Theory",
  "Ancient Studies",
  "Ghoul Studies",
];
