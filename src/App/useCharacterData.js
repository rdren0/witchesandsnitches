import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { characterService } from "../services/characterService";
import { debounce, requestIdleCallback } from "../utils/helpers";

export function useCharacterData({
  user,
  discordUserId,
  adminMode,
  isUserAdmin,
  customUsername,
  loadCustomUsername,
}) {
  const { setSelectedCharacter: setThemeSelectedCharacter } = useTheme();

  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(() => {
    try {
      const savedId = sessionStorage.getItem("selectedCharacterId");
      return savedId ? { id: savedId } : null;
    } catch {
      return null;
    }
  });
  const [charactersLoading, setCharactersLoading] = useState(false);
  const [charactersError, setCharactersError] = useState(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [initialCharacterId, setInitialCharacterId] = useState(() => {
    try {
      return sessionStorage.getItem("selectedCharacterId") || null;
    } catch {
      return null;
    }
  });
  const [isInitializing, setIsInitializing] = useState(true);

  const initTimeoutRef = useRef(null);
  const loadingRef = useRef(false);
  const prevSelectedCharacterRef = useRef();

  const debouncedSelectCharacter = useMemo(
    () =>
      debounce((character) => {
        setSelectedCharacter(character);
        if (character) {
          sessionStorage.setItem("selectedCharacterId", character.id.toString());
        } else {
          sessionStorage.removeItem("selectedCharacterId");
        }
      }, 100),
    [],
  );

  useEffect(() => {
    if (prevSelectedCharacterRef.current !== selectedCharacter) {
      setThemeSelectedCharacter(selectedCharacter);
      prevSelectedCharacterRef.current = selectedCharacter;
    }
  }, [selectedCharacter, setThemeSelectedCharacter]);

  // Reset character state when user logs out; trigger reload when user logs in
  useEffect(() => {
    if (!user) {
      setCharacters([]);
      setSelectedCharacter(null);
      setThemeSelectedCharacter(null);
      setHasAttemptedLoad(false);
      sessionStorage.removeItem("selectedCharacterId");
    } else {
      setHasAttemptedLoad(false);
    }
  }, [user?.id]);

  const resetSelectedCharacter = (newCharacter = null) => {
    if (newCharacter) {
      debouncedSelectCharacter(newCharacter);
    } else {
      setSelectedCharacter(null);
      setThemeSelectedCharacter(null);
      sessionStorage.removeItem("selectedCharacterId");
    }
  };

  const selectInitialCharacter = useCallback(
    (chars, urlCharacterId) => {
      if (!chars.length) return;

      const savedCharacterId =
        urlCharacterId ||
        sessionStorage.getItem("selectedCharacterId") ||
        initialCharacterId;
      let characterToSelect = null;

      if (urlCharacterId) {
        characterToSelect = chars.find(
          (c) => c.id.toString() === urlCharacterId.toString(),
        );
      }

      if (
        !characterToSelect &&
        selectedCharacter &&
        chars.find((c) => c.id.toString() === selectedCharacter.id.toString())
      ) {
        characterToSelect = chars.find(
          (c) => c.id.toString() === selectedCharacter.id.toString(),
        );
      } else if (!characterToSelect && savedCharacterId) {
        characterToSelect = chars.find(
          (char) => char.id.toString() === savedCharacterId.toString(),
        );
      }

      if (!characterToSelect && chars.length > 0) {
        characterToSelect = chars[0];
      }

      if (
        characterToSelect &&
        (!selectedCharacter || selectedCharacter.id !== characterToSelect.id)
      ) {
        debouncedSelectCharacter(characterToSelect);
        setInitialCharacterId(null);
      }

      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }

      initTimeoutRef.current = setTimeout(() => {
        setIsInitializing(false);
      }, 1000);
    },
    [selectedCharacter, initialCharacterId, debouncedSelectCharacter],
  );

  const loadCharacters = useCallback(async () => {
    if (!discordUserId) return;
    if (loadingRef.current) return;

    loadingRef.current = true;
    setCharactersLoading(true);
    setCharactersError(null);

    try {
      const loadOperations = [
        adminMode && isUserAdmin
          ? characterService.getAllCharacters()
          : characterService.getCharacters(discordUserId),
      ];

      if (!customUsername && user) {
        loadOperations.push(loadCustomUsername());
      }

      const [charactersData] = await Promise.all(loadOperations);

      const transformedCharacters = charactersData.map((char) => ({
        id: char.id,
        abilityScores: char.ability_scores,
        asiChoices: char.asi_choices || {},
        background: char.background,
        backgroundSkills: char.background_skills || [],
        heritageChoices: char.heritage_choices || {},
        innateHeritageSkills: char.innate_heritage_skills || [],
        castingStyle: char.castingStyle || char.casting_style,
        createdAt: char.created_at,
        gameSession: char.gameSession || char.game_session,
        hitPoints: char.hit_points,
        house: char.house,
        houseChoices: char.house_choices || {},
        imageUrl: char.imageUrl || char.image_url || "",
        initiativeAbility: char.initiative_ability || "dexterity",
        innateHeritage: char.innate_heritage,
        level: char.level,
        level1ChoiceType: char.level1_choice_type || "",
        name: char.name,
        schoolYear: char.schoolYear || char.school_year || null,
        skillProficiencies: char.skill_proficiencies || [],
        skillExpertise: char.skill_expertise || [],
        standardFeats: char.standard_feats || [],
        subclass: char.subclass,
        subclassChoices: char.subclass_choices || {},
        wandType: char.wand_type || "",
        magicModifiers: char.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },
        metamagicChoices: char.metamagic_choices || {},
        discord_user_id: char.discord_user_id,
        ownerInfo: char.discord_users
          ? {
              username: char.discord_users.username,
              displayName: char.discord_users.display_name,
            }
          : null,
      }));

      const sortedCharacters = transformedCharacters.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );

      setCharacters(sortedCharacters);

      requestIdleCallback(() => {
        const urlMatch = window.location.pathname.match(
          /\/character\/[^/]+\/(\d+)/,
        );
        const urlCharId = urlMatch ? urlMatch[1] : null;
        selectInitialCharacter(sortedCharacters, urlCharId);
      });

      setHasAttemptedLoad(true);
    } catch (err) {
      setCharactersError("Failed to load characters: " + err.message);
      console.error("Error loading characters:", err);
      setHasAttemptedLoad(true);
    } finally {
      setCharactersLoading(false);
      loadingRef.current = false;
    }
  }, [discordUserId, adminMode]);

  useEffect(() => {
    if (discordUserId) {
      setHasAttemptedLoad(false);
    }
  }, [adminMode, discordUserId]);

  useEffect(() => {
    if (
      discordUserId &&
      !hasAttemptedLoad &&
      !charactersLoading &&
      !loadingRef.current
    ) {
      loadCharacters();
    }
  }, [discordUserId, hasAttemptedLoad, charactersLoading]);

  const handleCharacterChange = useCallback(
    (character) => {
      if (isInitializing) return;
      debouncedSelectCharacter(character);
    },
    [debouncedSelectCharacter, isInitializing],
  );

  useEffect(() => {
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, []);

  return {
    characters,
    selectedCharacter,
    charactersLoading,
    charactersError,
    hasAttemptedLoad,
    setHasAttemptedLoad,
    isInitializing,
    handleCharacterChange,
    resetSelectedCharacter,
    debouncedSelectCharacter,
  };
}
