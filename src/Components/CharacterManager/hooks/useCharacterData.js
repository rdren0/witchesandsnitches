import { useState, useEffect, useCallback } from "react";
import { DEFAULT_CHARACTER } from "../constants/characterDefaults";
import { characterService } from "../../../services/characterService";

export const useCharacterData = (characterId = null, userId = null) => {
  const [character, setCharacter] = useState(DEFAULT_CHARACTER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const loadCharacter = useCallback(async () => {
    if (!characterId || !userId) return;

    setLoading(true);
    setError(null);

    try {
      const loadedCharacter = await characterService.getCharacterById(
        characterId,
        userId
      );
      if (loadedCharacter) {
        setCharacter({
          ...DEFAULT_CHARACTER,
          ...loadedCharacter,
        });
        setHasChanges(false);
      }
    } catch (err) {
      console.error("Error loading character:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [characterId, userId]);

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
    if (!userId) {
      throw new Error("User ID required to save character");
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      if (character.id) {
        result = await characterService.updateCharacter(
          character.id,
          character,
          userId
        );
      } else {
        result = await characterService.saveCharacter(character, userId);
      }

      if (result) {
        setCharacter((prev) => ({ ...prev, ...result }));
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
  }, [character, userId]);

  useEffect(() => {
    if (characterId && userId) {
      loadCharacter();
    }
  }, [loadCharacter]);

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
