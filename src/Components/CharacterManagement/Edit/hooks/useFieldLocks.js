import { useEffect, useState } from "react";

export const useFieldLocks = (character) => {
  const [lockedFields, setLockedFields] = useState({
    level1ChoiceType: true,
    abilityScores: true,
  });

  useEffect(() => {
    const hasAllScores = Object.values(character.abilityScores || {}).every(
      (score) => score !== null && score !== undefined
    );

    setLockedFields({
      level1ChoiceType:
        character.level > 1 ||
        Boolean(character.innateHeritage || character.standardFeats?.length),
      abilityScores: hasAllScores,
    });
  }, [character]);

  return [lockedFields, setLockedFields];
};
