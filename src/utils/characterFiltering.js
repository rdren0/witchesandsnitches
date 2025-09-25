import { ALL_CHARACTERS } from "../SharedData/charactersData";

export const OTHER_PLAYERS_EXCEPTIONS = {
  "Thursday - Jaguaras": ["Pyotr Abramov"],
};

export const getJaguarasStudentNames = () => {
  return new Set(
    ALL_CHARACTERS
      .filter(character => character.school === "Jaguaras" && character.type === "Competitor")
      .map(character => character.name)
  );
};

export const shouldFilterFromOtherPlayers = (characterName, gameSession) => {
  const jaguarasNames = getJaguarasStudentNames();

  if (!jaguarasNames.has(characterName)) {
    return false;
  }

  const exceptions = OTHER_PLAYERS_EXCEPTIONS[gameSession];
  const isException = exceptions && exceptions.includes(characterName);

  return !isException;
};

export const shouldShowInOtherPlayers = (characterName, gameSession) => {
  const exceptions = OTHER_PLAYERS_EXCEPTIONS[gameSession];
  return exceptions && exceptions.includes(characterName);
};

export const shouldShowNPCBadge = (characterName, gameSession) => {
  const jaguarasNames = getJaguarasStudentNames();
  const isJaguarasNPC = jaguarasNames.has(characterName);
  const isException = shouldShowInOtherPlayers(characterName, gameSession);

  return isJaguarasNPC && isException;
};

export const shouldHideFromNPCGallery = (characterName, gameSession) => {
  return shouldShowInOtherPlayers(characterName, gameSession);
};

export const filterNPCGalleryCharacters = (characters, gameSession) => {
  if (!gameSession) return characters;

  return characters.filter(character =>
    !shouldHideFromNPCGallery(character.name, gameSession)
  );
};