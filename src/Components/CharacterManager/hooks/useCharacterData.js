import { useState, useEffect, useCallback } from "react";
import { DEFAULT_CHARACTER } from "../constants/characterDefaults";
import { characterService } from "../../../services/characterService";
import {
  transformCharacterForSave,
  transformCharacterFromDB,
} from "../components/CharacterForm/utils/characterTransformUtils";
import { getAllAbilityModifiers } from "../utils/characterUtils";

export const useCharacterData = (
  characterId = null,
  userId = null,
  adminMode = false,
  isUserAdmin = false
) => {
  const [character, setCharacter] = useState(DEFAULT_CHARACTER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const loadCharacter = useCallback(async () => {
    if (!characterId) return;

    if (!userId && !(adminMode && isUserAdmin)) {
      console.warn(
        "Cannot load character: userId is undefined and not in admin mode"
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let loadedCharacter;

      if (adminMode && isUserAdmin) {
        loadedCharacter = await characterService.getCharacterByIdAdmin(
          characterId
        );
      } else if (userId) {
        loadedCharacter = await characterService.getCharacterById(
          characterId,
          userId
        );
      } else {
        throw new Error("Cannot load character: missing userId");
      }

      if (loadedCharacter) {
        const transformedCharacter = transformCharacterFromDB(loadedCharacter);

        if (loadedCharacter.base_ability_scores) {
          transformedCharacter.abilityScores =
            loadedCharacter.base_ability_scores;
        }

        setCharacter({
          ...DEFAULT_CHARACTER,
          ...transformedCharacter,
        });
        setHasChanges(false);
      }
    } catch (err) {
      console.error("Error loading character:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [characterId, userId, adminMode, isUserAdmin]);

  const updateCharacter = useCallback((field, value) => {
    setCharacter((prev) => {
      const updated = { ...prev };

      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        updated[parent] = {
          ...prev[parent],
          [child]: value,
        };
      } else {
        updated[field] = value;
      }

      return updated;
    });
    setHasChanges(true);
  }, []);

  const updateCharacterBulk = useCallback((updates) => {
    setCharacter((prev) => ({
      ...prev,
      ...updates,
    }));
    setHasChanges(true);
  }, []);

  const resetCharacter = useCallback(() => {
    setCharacter(DEFAULT_CHARACTER);
    setHasChanges(false);
    setError(null);
  }, []);

  const saveCharacter = useCallback(async () => {
    if (!userId && !(adminMode && isUserAdmin)) {
      throw new Error("User ID required to save character");
    }

    setLoading(true);
    setError(null);

    try {
      const baseScores = character.abilityScores || {
        strength: 8,
        dexterity: 8,
        constitution: 8,
        intelligence: 8,
        wisdom: 8,
        charisma: 8,
      };

      const modifiers = getAllAbilityModifiers(character);

      const finalAbilityScores = {
        strength: baseScores.strength + modifiers.strength,
        dexterity: baseScores.dexterity + modifiers.dexterity,
        constitution: baseScores.constitution + modifiers.constitution,
        intelligence: baseScores.intelligence + modifiers.intelligence,
        wisdom: baseScores.wisdom + modifiers.wisdom,
        charisma: baseScores.charisma + modifiers.charisma,
      };

      const characterWithFinalScores = {
        ...character,
        abilityScores: finalAbilityScores,
        baseAbilityScores: baseScores,
      };

      const characterToSave = transformCharacterForSave(
        characterWithFinalScores
      );

      let result;
      const effectiveUserId = userId || character.discord_user_id;

      if (character.id) {
        result = await characterService.updateCharacter(
          character.id,
          characterToSave,
          effectiveUserId
        );
      } else {
        result = await characterService.saveCharacter(
          characterToSave,
          effectiveUserId
        );
      }

      if (result) {
        const transformedResult = transformCharacterFromDB(result);

        if (result.base_ability_scores) {
          transformedResult.abilityScores = result.base_ability_scores;
        }

        setCharacter((prev) => ({
          ...prev,
          ...transformedResult,
        }));
        setHasChanges(false);
      }

      return result;
    } catch (err) {
      console.error("Error saving character:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [character, userId, adminMode, isUserAdmin]);

  useEffect(() => {
    if (characterId) {
      if (userId || (adminMode && isUserAdmin)) {
        loadCharacter();
      }
    }
  }, [characterId, userId, adminMode, isUserAdmin, loadCharacter]);

  return {
    character,
    loading,
    error,
    hasChanges,
    updateCharacter,
    updateCharacterBulk,
    resetCharacter,
    saveCharacter,
    loadCharacter,
  };
};
