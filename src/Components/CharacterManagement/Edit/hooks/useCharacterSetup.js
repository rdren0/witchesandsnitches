import { useState, useMemo } from "react";
import { backgroundsData } from "../../../../SharedData/backgroundsData";

// Safely fills missing background skills if needed
const migrateBackgroundSkills = (character) => {
  if (character.backgroundSkills?.length) return character;

  const background = backgroundsData[character.background];
  const skills = background?.skillProficiencies || [];

  return {
    ...character,
    backgroundSkills: skills,
  };
};

const inferLevel1ChoiceType = (character) => {
  if (character.level1ChoiceType) return character.level1ChoiceType;

  if (character.innateHeritage?.trim()) return "innate";
  if (character.standardFeats?.length) return "feat";

  return "";
};

const separateFeats = (character) => {
  const allFeats = character.standardFeats || [];
  const asiChoices = character.asiChoices || {};
  const asiFeats = Object.values(asiChoices)
    .filter((c) => c.type === "feat" && c.selectedFeat)
    .map((c) => c.selectedFeat);

  const level1Feats = allFeats.filter((f) => !asiFeats.includes(f));

  return { level1Feats, asiFeats };
};

export const useCharacterSetup = (originalCharacter) => {
  const safeOriginalCharacter = useMemo(() => {
    const defaultCharacter = {
      id: null,
      name: "",
      level: 1,
      castingStyle: "",
      house: "",
      houseChoices: {},
      subclassChoices: {},
      standardFeats: [],
      asiChoices: {},
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      skillProficiencies: [],
      backgroundSkills: [],
      innateHeritage: "",
      innateHeritageSkills: [],
      heritageChoices: {},
      level1ChoiceType: "",
      hitPoints: 1,
      initiativeAbility: "dexterity",
      subclass: "",
      background: "",
      gameSession: "",
      wandType: "",
      schoolYear: null,
      magicModifiers: {
        divinations: 0,
        charms: 0,
        transfiguration: 0,
        healing: 0,
        jinxesHexesCurses: 0,
      },
    };

    const merged = { ...defaultCharacter, ...originalCharacter };

    // Transform snake_case database fields to camelCase frontend fields
    merged.houseChoices =
      originalCharacter?.houseChoices || originalCharacter?.house_choices || {};
    merged.subclassChoices =
      originalCharacter?.subclassChoices ||
      originalCharacter?.subclass_choices ||
      {};

    // ADD THESE MISSING TRANSFORMATIONS:
    merged.innateHeritage =
      originalCharacter?.innateHeritage ||
      originalCharacter?.innate_heritage ||
      "";
    merged.innateHeritageSkills =
      originalCharacter?.innateHeritageSkills ||
      originalCharacter?.innate_heritage_skills ||
      [];
    merged.heritageChoices =
      originalCharacter?.heritageChoices ||
      originalCharacter?.heritage_choices ||
      {};

    return migrateBackgroundSkills(merged);
  }, [originalCharacter]);

  const { level1Feats } = useMemo(
    () => separateFeats(safeOriginalCharacter),
    [safeOriginalCharacter]
  );

  const [character, setCharacter] = useState(() => ({
    ...safeOriginalCharacter,
    level1ChoiceType: inferLevel1ChoiceType(safeOriginalCharacter),
    standardFeats:
      inferLevel1ChoiceType(safeOriginalCharacter) === "feat"
        ? level1Feats
        : [],
  }));

  const [selectedHouse, setSelectedHouse] = useState(character.house || "");
  const [houseChoices, setHouseChoices] = useState(
    character.houseChoices || {}
  );

  return {
    character,
    setCharacter,
    selectedHouse,
    setSelectedHouse,
    houseChoices,
    setHouseChoices,
    safeOriginalCharacter,
  };
};
