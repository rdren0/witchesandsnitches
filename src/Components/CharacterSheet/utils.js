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
