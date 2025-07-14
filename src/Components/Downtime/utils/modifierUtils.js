import { calculateModifier } from "../downtimeHelpers";

export const getModifierValue = (modifierName, selectedCharacter) => {
  if (!modifierName) {
    console.warn("getModifierValue called with empty modifierName");
    return 0;
  }
  const result = calculateModifier(modifierName, selectedCharacter);
  return result;
};

export const formatModifier = (value) => {
  return value >= 0 ? `+${value}` : `${value}`;
};
