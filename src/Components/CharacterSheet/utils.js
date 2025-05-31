export const getModifier = (score) => Math.floor((score - 10) / 2);
export const formatModifier = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);
export const modifiers = (character) =>
  character
    ? {
        strength: getModifier(character.strength),
        dexterity: getModifier(character.dexterity),
        constitution: getModifier(character.constitution),
        intelligence: getModifier(character.intelligence),
        wisdom: getModifier(character.wisdom),
        charisma: getModifier(character.charisma),
      }
    : {};

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
