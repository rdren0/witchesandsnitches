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

const getAllCharacterFeats = (character) => {
  const allFeats = [...(character.standardFeats || [])];

  if (character.asiChoices) {
    Object.entries(character.asiChoices).forEach(([level, choice]) => {
      if (choice.type === "feat" && choice.selectedFeat) {
        allFeats.push(choice.selectedFeat);
      }
    });
  }

  return allFeats;
};

const checkSingleRequirement = (requirement, character) => {
  const { type, value } = requirement;

  switch (type) {
    case "level":
      return (character.level || 1) >= value;

    case "castingStyle":
      return character.castingStyle === value;

    case "innateHeritage":
      return character.innateHeritage === value;

    case "subclass":
      return character.subclass === value;

    case "feat":
      const allFeats = getAllCharacterFeats(character);
      return allFeats.includes(value);

    default:
      console.warn(`Unknown prerequisite type: ${type}`);
      return false;
  }
};

export const checkFeatPrerequisites = (feat, character) => {
  if (!feat.prerequisites) {
    return true;
  }

  const { allOf, anyOf } = feat.prerequisites;

  if (allOf && allOf.length > 0) {
    const allMet = allOf.every((req) => checkSingleRequirement(req, character));
    if (!allMet) return false;
  }

  if (anyOf && anyOf.length > 0) {
    const anyMet = anyOf.some((req) => checkSingleRequirement(req, character));
    if (!anyMet) return false;
  }

  return true;
};
