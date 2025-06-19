import { useCallback } from "react";
import { checkFeatPrerequisites } from "../../../CharacterSheet/utils";
import { getAllSelectedFeats } from "../../Create/ASIComponents";

export const useFeatValidation = ({
  character,
  setError,
  standardFeats = [],
}) => {
  const validateFeatSelections = useCallback(() => {
    const allSelectedFeats = getAllSelectedFeats(character);
    const uniqueFeats = [...new Set(allSelectedFeats)];

    if (allSelectedFeats.length !== uniqueFeats.length) {
      const duplicates = allSelectedFeats.filter(
        (feat, index) => allSelectedFeats.indexOf(feat) !== index
      );
      setError(
        `Duplicate feats detected: ${duplicates.join(
          ", "
        )}. Each feat can only be selected once.`
      );
      return false;
    }

    const invalidFeats = allSelectedFeats.filter((featName) => {
      const feat = standardFeats.find((f) => f.name === featName);
      return feat && !checkFeatPrerequisites(feat, character);
    });

    if (invalidFeats.length > 0) {
      console.warn(
        "Some selected feats no longer meet prerequisites:",
        invalidFeats
      );
      setError(
        `Warning: Some selected feats no longer meet prerequisites: ${invalidFeats.join(
          ", "
        )}`
      );
      return false;
    }

    return true;
  }, [character, setError, standardFeats]);

  return { validateFeatSelections };
};
