// SharedData/downtime.js
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
      "Attempt a Spell - Practice casting any spell previously researched or attempted",
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

  relationships: {
    name: "Building Relationships",
    description: "Activities focused on developing relationships with NPCs",
    activities: [
      "Spend time with Professor - Build rapport with faculty members",
      "Study with Fellow Students - Collaborative learning and friendship building",
      "Help Younger Students - Mentoring and relationship building",
      "Visit Hogsmeade with Friends - Social outings and bonding",
      "Write Letters to Family - Maintain family connections",
    ],
  },

  house_activities: {
    name: "House Activities",
    description: "House-specific and dormitory activities",
    activities: [
      "Organize House Event - Plan and execute house gatherings",
      "Common Room Activities - Games, studying, and socializing",
      "House Competition Preparation - Training for inter-house events",
    ],
  },

  creative: {
    name: "Creative Pursuits",
    description: "Artistic and creative activities",
    activities: [
      "Write for School Newspaper - Journalism and creative writing",
      "Practice Musical Instrument - Develop musical talents",
      "Paint or Draw - Artistic expression and skill development",
      "Write Poetry or Stories - Creative writing pursuits",
    ],
  },

  physical: {
    name: "Physical Activities",
    description: "Sports, exercise, and physical pursuits",
    activities: [
      "Quidditch Practice - Individual skill improvement",
      "Physical Training - Improve physical fitness and abilities",
      "Flying Practice - Improve flying skills outside of Quidditch",
    ],
  },

  special_events: {
    name: "Special Events",
    description: "Seasonal and special occasion activities",
    activities: [
      "Attend School Dance - Social events and formal gatherings",
      "Participate in Holiday Celebrations - Seasonal festivities",
      "Help with School Events - Volunteer for special occasions",
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

// Helper function to get all activities as a flat array
export const getAllActivities = () => {
  const activities = [""];
  Object.values(downtime).forEach((category) => {
    if (category.activities) {
      activities.push(...category.activities);
    }
  });
  return activities;
};

// Helper function to get activities by category
export const getActivitiesByCategory = (categoryKey) => {
  return downtime[categoryKey]?.activities || [];
};

// Helper function to find which category an activity belongs to
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

// Helper function to get activity difficulty/complexity info
export const getActivityInfo = (activityText) => {
  const text = activityText.toLowerCase();

  // Determine if activity requires multiple rolls
  const requiresMultipleRolls =
    text.includes("stealth and investigation") ||
    text.includes("sleight of hand and investigation") ||
    text.includes("three separate checks");

  // Determine suggested skills based on activity type
  let suggestedSkills = [];
  if (text.includes("persuasion")) suggestedSkills.push("persuasion");
  if (text.includes("investigation")) suggestedSkills.push("investigation");
  if (text.includes("stealth")) suggestedSkills.push("stealth");
  if (text.includes("deception")) suggestedSkills.push("deception");
  if (text.includes("intimidation")) suggestedSkills.push("intimidation");
  if (text.includes("performance")) suggestedSkills.push("performance");
  if (text.includes("sleight of hand")) suggestedSkills.push("sleight_of_hand");
  if (text.includes("magical creatures"))
    suggestedSkills.push("animal_handling");
  if (text.includes("herbology")) suggestedSkills.push("nature");
  if (text.includes("history")) suggestedSkills.push("history");
  if (text.includes("insight")) suggestedSkills.push("insight");

  return {
    requiresMultipleRolls,
    suggestedSkills,
    category: findActivityCategory(activityText),
  };
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

export const activityPatterns = {
  digForDirt: /dig\s+for\s+dirt/i,
  spreadRumors: /spread\s+rumors/i,
  gainJob: /gain\s+a?\s*job.*persuasion\s+or\s+an?\s+appropriate/i,
  promotion: /promotion.*persuasion\s+or\s+an?\s+appropriate/i,
  suggestedSkill: /(roll\s+(\w+(?:\s+\w+)*)).*or\s+an?\s+appropriate\s+skill/i,
  stealthAndInvestigation: /stealth\s+and\s+investigation\s+rolls/i,
  sleightAndInvestigation: /sleight\s+of\s+hand\s+and\s+investigation\s+rolls/i,
  explorecastle: /explore\s+the\s+castle.*roll\s+investigation/i,
  rollInvestigation: /roll\s+investigation(?!\s*,)/i,
  rollPersuasion: /roll\s+persuasion(?!\s*,)/i,
  rollMagicalCreatures: /roll\s+magical\s+creatures/i,
  rollHerbology: /roll\s+herbology/i,
  rollHistoryOfMagic: /roll\s+history\s+of\s+magic/i,
};
