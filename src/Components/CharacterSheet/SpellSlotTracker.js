import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  BookOpen,
  PlusIcon,
  MinusIcon,
  Sparkles,
  Edit3,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getDiscordWebhook } from "../../App/const";
import { sendDiscordRollWebhook } from "../utils/discordWebhook";
import {
  SPELL_SLOT_PROGRESSION,
  SORCERY_POINT_PROGRESSION,
} from "../../SharedData/data";

const CASTING_STYLE_PROGRESSION = {
  "Willpower Caster": {
    1: {
      proficiencyBonus: 2,
      sorceryPoints: 0,
      metamagic: 0,
      features: ["Spellcasting", "Sorcerous Resilience", "School of Magic"],
    },
    2: {
      proficiencyBonus: 2,
      sorceryPoints: 2,
      metamagic: 0,
      features: ["Font of Magic"],
    },
    3: {
      proficiencyBonus: 2,
      sorceryPoints: 3,
      metamagic: 2,
      features: ["Metamagic", "Fierce Spell", "Resistant Spell"],
    },
    4: {
      proficiencyBonus: 2,
      sorceryPoints: 4,
      metamagic: 2,
      features: ["Ability Score Improvement"],
    },
    5: { proficiencyBonus: 3, sorceryPoints: 5, metamagic: 2, features: [] },
    6: {
      proficiencyBonus: 3,
      sorceryPoints: 6,
      metamagic: 2,
      features: ["School of Magic Feature"],
    },
    7: { proficiencyBonus: 3, sorceryPoints: 7, metamagic: 2, features: [] },
    8: {
      proficiencyBonus: 3,
      sorceryPoints: 8,
      metamagic: 2,
      features: ["Ability Score Improvement"],
    },
    9: {
      proficiencyBonus: 4,
      sorceryPoints: 9,
      metamagic: 2,
      features: ["Apparition Lessons"],
    },
    10: {
      proficiencyBonus: 4,
      sorceryPoints: 10,
      metamagic: 3,
      features: ["School of Magic Feature", "Metamagic"],
    },
    11: { proficiencyBonus: 4, sorceryPoints: 11, metamagic: 3, features: [] },
    12: {
      proficiencyBonus: 4,
      sorceryPoints: 12,
      metamagic: 3,
      features: ["Ability Score Improvement"],
    },
    13: { proficiencyBonus: 5, sorceryPoints: 13, metamagic: 3, features: [] },
    14: {
      proficiencyBonus: 5,
      sorceryPoints: 14,
      metamagic: 3,
      features: ["School of Magic Feature"],
    },
    15: { proficiencyBonus: 5, sorceryPoints: 15, metamagic: 3, features: [] },
    16: {
      proficiencyBonus: 5,
      sorceryPoints: 16,
      metamagic: 3,
      features: ["Ability Score Improvement"],
    },
    17: {
      proficiencyBonus: 6,
      sorceryPoints: 17,
      metamagic: 4,
      features: ["Metamagic"],
    },
    18: {
      proficiencyBonus: 6,
      sorceryPoints: 18,
      metamagic: 4,
      features: ["School of Magic Feature"],
    },
    19: {
      proficiencyBonus: 6,
      sorceryPoints: 19,
      metamagic: 4,
      features: ["Ability Score Improvement"],
    },
    20: {
      proficiencyBonus: 6,
      sorceryPoints: 20,
      metamagic: 4,
      features: ["Signature Spells"],
    },
  },
  "Technique Caster": {
    1: {
      proficiencyBonus: 2,
      sorceryPoints: 0,
      metamagic: 0,
      features: ["Spellcasting", "School of Magic"],
    },
    2: {
      proficiencyBonus: 2,
      sorceryPoints: 3,
      metamagic: 0,
      features: ["Font of Magic"],
    },
    3: {
      proficiencyBonus: 2,
      sorceryPoints: 4,
      metamagic: 2,
      features: ["Metamagic", "Spell Deflection"],
    },
    4: {
      proficiencyBonus: 2,
      sorceryPoints: 5,
      metamagic: 2,
      features: ["Ability Score Improvement"],
    },
    5: {
      proficiencyBonus: 3,
      sorceryPoints: 7,
      metamagic: 3,
      features: ["Metamagic"],
    },
    6: {
      proficiencyBonus: 3,
      sorceryPoints: 8,
      metamagic: 3,
      features: ["School of Magic Feature"],
    },
    7: {
      proficiencyBonus: 3,
      sorceryPoints: 9,
      metamagic: 4,
      features: ["Metamagic"],
    },
    8: {
      proficiencyBonus: 3,
      sorceryPoints: 10,
      metamagic: 5,
      features: ["Ability Score Improvement"],
    },
    9: {
      proficiencyBonus: 4,
      sorceryPoints: 12,
      metamagic: 5,
      features: ["Apparition Lessons", "Metamagic"],
    },
    10: {
      proficiencyBonus: 4,
      sorceryPoints: 13,
      metamagic: 5,
      features: ["School of Magic Feature"],
    },
    11: { proficiencyBonus: 4, sorceryPoints: 14, metamagic: 5, features: [] },
    12: {
      proficiencyBonus: 4,
      sorceryPoints: 15,
      metamagic: 6,
      features: ["Ability Score Improvement", "Metamagic"],
    },
    13: { proficiencyBonus: 5, sorceryPoints: 17, metamagic: 6, features: [] },
    14: {
      proficiencyBonus: 5,
      sorceryPoints: 18,
      metamagic: 6,
      features: ["School of Magic Feature"],
    },
    15: {
      proficiencyBonus: 5,
      sorceryPoints: 19,
      metamagic: 7,
      features: ["Metamagic"],
    },
    16: {
      proficiencyBonus: 5,
      sorceryPoints: 20,
      metamagic: 7,
      features: ["Ability Score Improvement"],
    },
    17: { proficiencyBonus: 6, sorceryPoints: 22, metamagic: 7, features: [] },
    18: {
      proficiencyBonus: 6,
      sorceryPoints: 23,
      metamagic: 8,
      features: ["School of Magic Feature", "Metamagic"],
    },
    19: {
      proficiencyBonus: 6,
      sorceryPoints: 24,
      metamagic: 8,
      features: ["Ability Score Improvement"],
    },
    20: {
      proficiencyBonus: 6,
      sorceryPoints: 25,
      metamagic: 8,
      features: ["Sorcereous Restoration"],
    },
  },
  "Intellect Caster": {
    1: {
      proficiencyBonus: 2,
      sorceryPoints: 0,
      metamagic: 0,
      features: ["Spellcasting", "Ritual Casting", "School of Magic"],
    },
    2: {
      proficiencyBonus: 2,
      sorceryPoints: 2,
      metamagic: 0,
      features: ["Font of Magic"],
    },
    3: {
      proficiencyBonus: 2,
      sorceryPoints: 3,
      metamagic: 1,
      features: ["Metamagic", "Diverse Studies"],
    },
    4: {
      proficiencyBonus: 2,
      sorceryPoints: 4,
      metamagic: 1,
      features: ["Ability Score Improvement"],
    },
    5: { proficiencyBonus: 3, sorceryPoints: 4, metamagic: 1, features: [] },
    6: {
      proficiencyBonus: 3,
      sorceryPoints: 5,
      metamagic: 2,
      features: ["School of Magic Feature"],
    },
    7: {
      proficiencyBonus: 3,
      sorceryPoints: 6,
      metamagic: 2,
      features: ["Metamagic"],
    },
    8: {
      proficiencyBonus: 3,
      sorceryPoints: 7,
      metamagic: 2,
      features: ["Ability Score Improvement"],
    },
    9: {
      proficiencyBonus: 4,
      sorceryPoints: 7,
      metamagic: 2,
      features: ["Apparition Lessons"],
    },
    10: {
      proficiencyBonus: 4,
      sorceryPoints: 8,
      metamagic: 2,
      features: ["School of Magic Feature"],
    },
    11: { proficiencyBonus: 4, sorceryPoints: 9, metamagic: 2, features: [] },
    12: {
      proficiencyBonus: 4,
      sorceryPoints: 10,
      metamagic: 2,
      features: ["Ability Score Improvement"],
    },
    13: {
      proficiencyBonus: 5,
      sorceryPoints: 10,
      metamagic: 3,
      features: ["Metamagic"],
    },
    14: {
      proficiencyBonus: 5,
      sorceryPoints: 11,
      metamagic: 3,
      features: ["School of Magic Feature"],
    },
    15: { proficiencyBonus: 5, sorceryPoints: 12, metamagic: 3, features: [] },
    16: {
      proficiencyBonus: 5,
      sorceryPoints: 13,
      metamagic: 3,
      features: ["Ability Score Improvement"],
    },
    17: { proficiencyBonus: 6, sorceryPoints: 13, metamagic: 3, features: [] },
    18: {
      proficiencyBonus: 6,
      sorceryPoints: 14,
      metamagic: 3,
      features: ["School of Magic Feature"],
    },
    19: {
      proficiencyBonus: 6,
      sorceryPoints: 15,
      metamagic: 3,
      features: ["Ability Score Improvement"],
    },
    20: {
      proficiencyBonus: 6,
      sorceryPoints: 15,
      metamagic: 3,
      features: ["Arcane Recovery"],
    },
  },
  "Vigor Caster": {
    1: {
      proficiencyBonus: 2,
      sorceryPoints: 0,
      metamagic: 0,
      features: ["Spellcasting", "School of Magic", "Easy Target"],
    },
    2: {
      proficiencyBonus: 2,
      sorceryPoints: 2,
      metamagic: 0,
      features: ["Font of Magic"],
    },
    3: {
      proficiencyBonus: 2,
      sorceryPoints: 5,
      metamagic: 1,
      features: ["Metamagic", "Rage"],
    },
    4: {
      proficiencyBonus: 2,
      sorceryPoints: 5,
      metamagic: 1,
      features: ["Ability Score Improvement"],
    },
    5: { proficiencyBonus: 3, sorceryPoints: 5, metamagic: 1, features: [] },
    6: {
      proficiencyBonus: 3,
      sorceryPoints: 10,
      metamagic: 2,
      features: ["School of Magic Feature", "Metamagic"],
    },
    7: { proficiencyBonus: 3, sorceryPoints: 10, metamagic: 2, features: [] },
    8: {
      proficiencyBonus: 3,
      sorceryPoints: 10,
      metamagic: 2,
      features: ["Ability Score Improvement"],
    },
    9: {
      proficiencyBonus: 4,
      sorceryPoints: 10,
      metamagic: 2,
      features: ["Apparition Lessons"],
    },
    10: {
      proficiencyBonus: 4,
      sorceryPoints: 10,
      metamagic: 2,
      features: ["Relentless Rage"],
    },
    11: {
      proficiencyBonus: 4,
      sorceryPoints: 10,
      metamagic: 2,
      features: ["Ability Score Increase"],
    },
    12: {
      proficiencyBonus: 4,
      sorceryPoints: 15,
      metamagic: 3,
      features: ["Metamagic"],
    },
    13: {
      proficiencyBonus: 5,
      sorceryPoints: 15,
      metamagic: 3,
      features: ["School of Magic Feature"],
    },
    14: { proficiencyBonus: 5, sorceryPoints: 15, metamagic: 3, features: [] },
    15: {
      proficiencyBonus: 5,
      sorceryPoints: 15,
      metamagic: 3,
      features: ["Ability Score Improvement"],
    },
    16: {
      proficiencyBonus: 6,
      sorceryPoints: 20,
      metamagic: 4,
      features: ["Metamagic"],
    },
    17: {
      proficiencyBonus: 6,
      sorceryPoints: 20,
      metamagic: 4,
      features: ["School of Magic Feature"],
    },
    18: {
      proficiencyBonus: 6,
      sorceryPoints: 20,
      metamagic: 4,
      features: ["Ability Score Improvement"],
    },
    19: {
      proficiencyBonus: 6,
      sorceryPoints: 20,
      metamagic: 4,
      features: ["Vigorous Perfection"],
    },
    20: { proficiencyBonus: 6, sorceryPoints: 20, metamagic: 4, features: [] },
  },
};

const SpellSlotTracker = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  selectedCharacterId,
}) => {
  const { theme } = useTheme();

  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showSorceryModal, setShowSorceryModal] = useState(false);
  const [showConversionTable, setShowConversionTable] = useState(false);
  const [showProgressionTable, setShowProgressionTable] = useState(false);
  const [showCastingStyleProgression, setShowCastingStyleProgression] =
    useState(false);
  const [expandedCastingStyles, setExpandedCastingStyles] = useState({});
  const [modalData, setModalData] = useState({
    level: 1,
    action: "use",
    amount: 1,
  });
  const [sorceryModalData, setSorceryModalData] = useState({
    action: "use",
    amount: 1,
    currentValue: 0,
    maxValue: 0,
  });

  const setupStandardSpellSlots = useCallback(
    async (characterLevel, isLevelUpRefresh = false) => {
      if (
        !character ||
        isUpdating ||
        !characterLevel ||
        characterLevel < 1 ||
        characterLevel > 20
      )
        return;

      setIsUpdating(true);

      try {
        const progression = SPELL_SLOT_PROGRESSION[characterLevel];
        if (!progression) {
          console.error("Invalid character level:", characterLevel);
          return;
        }

        const updateData = {
          character_id: selectedCharacterId,
          discord_user_id: character?.discord_user_id || discordUserId,
          updated_at: new Date().toISOString(),
        };

        progression.forEach((maxSlots, index) => {
          const spellLevel = index + 1;
          updateData[`max_spell_slots_${spellLevel}`] = maxSlots;

          const currentSlots = character?.[`spellSlots${spellLevel}`] || 0;

          if (currentSlots === 0 || currentSlots < maxSlots) {
            updateData[`spell_slots_${spellLevel}`] = maxSlots;
          }
        });

        const { error } = await supabase
          .from("character_resources")
          .upsert(updateData, {
            onConflict: "character_id,discord_user_id",
          });

        if (error) {
          console.error("Error setting up spell slots:", error);
          return;
        }

        const newCharacterState = { ...character };
        progression.forEach((maxSlots, index) => {
          const spellLevel = index + 1;
          newCharacterState[`maxSpellSlots${spellLevel}`] = maxSlots;

          const currentSlots = character?.[`spellSlots${spellLevel}`] || 0;

          if (currentSlots === 0 || currentSlots < maxSlots) {
            newCharacterState[`spellSlots${spellLevel}`] = maxSlots;
          }
        });
        setCharacter(newCharacterState);
      } catch (error) {
        console.error("Error setting up spell slots:", error);
      } finally {
        setIsUpdating(false);
      }
    },

    [selectedCharacterId, discordUserId, supabase, setCharacter],
  );

  const [customSlots, setCustomSlots] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  });
  const [customMaxSorceryPoints, setCustomMaxSorceryPoints] = useState(0);
  const [lastKnownLevel, setLastKnownLevel] = useState(null);

  const updateMaxSpellSlotsOnLevelUp = useCallback(
    async (characterLevel) => {
      if (
        !character ||
        isUpdating ||
        !characterLevel ||
        characterLevel < 1 ||
        characterLevel > 20
      )
        return;

      setIsUpdating(true);

      try {
        const progression = SPELL_SLOT_PROGRESSION[characterLevel];
        if (!progression) {
          console.error("Invalid character level:", characterLevel);
          return;
        }

        const updateData = {
          character_id: selectedCharacterId,
          discord_user_id: character?.discord_user_id || discordUserId,
          updated_at: new Date().toISOString(),
        };

        progression.forEach((maxSlots, index) => {
          const spellLevel = index + 1;
          updateData[`max_spell_slots_${spellLevel}`] = maxSlots;

          const currentSlots = character?.[`spellSlots${spellLevel}`] || 0;
          if (currentSlots < maxSlots) {
            updateData[`spell_slots_${spellLevel}`] = maxSlots;
          }
        });

        const { error } = await supabase
          .from("character_resources")
          .upsert(updateData, {
            onConflict: "character_id,discord_user_id",
          });

        if (error) {
          console.error("Error updating max spell slots:", error);
          return;
        }

        const newCharacterState = { ...character };
        progression.forEach((maxSlots, index) => {
          const spellLevel = index + 1;
          newCharacterState[`maxSpellSlots${spellLevel}`] = maxSlots;

          const currentSlots = character?.[`spellSlots${spellLevel}`] || 0;
          if (currentSlots < maxSlots) {
            newCharacterState[`spellSlots${spellLevel}`] = maxSlots;
          }
        });
        setCharacter(newCharacterState);
      } catch (error) {
        console.error("Error updating max spell slots:", error);
      } finally {
        setIsUpdating(false);
      }
    },

    [selectedCharacterId, discordUserId, supabase, setCharacter],
  );

  const updateSorceryPointsOnLevelUp = useCallback(
    async (characterLevel) => {
      if (
        !character ||
        isUpdating ||
        !characterLevel ||
        characterLevel < 1 ||
        characterLevel > 20
      )
        return;

      const maxSorceryPoints = SORCERY_POINT_PROGRESSION[characterLevel];
      if (maxSorceryPoints === undefined) {
        console.error(
          "Invalid character level for sorcery points:",
          characterLevel,
        );
        return;
      }

      setIsUpdating(true);

      try {
        const updateData = {
          character_id: selectedCharacterId,
          discord_user_id: character?.discord_user_id || discordUserId,
          max_sorcery_points: maxSorceryPoints,
          sorcery_points: maxSorceryPoints,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("character_resources")
          .upsert(updateData, {
            onConflict: "character_id,discord_user_id",
          });

        if (error) {
          console.error("Error updating sorcery points:", error);
          return;
        }

        const newCharacterState = { ...character };
        newCharacterState.maxSorceryPoints = maxSorceryPoints;
        newCharacterState.sorceryPoints = maxSorceryPoints;

        setCharacter(newCharacterState);
      } catch (error) {
        console.error("Error updating sorcery points:", error);
      } finally {
        setIsUpdating(false);
      }
    },

    [selectedCharacterId, discordUserId, supabase, setCharacter],
  );

  useEffect(() => {
    if (
      character?.level &&
      lastKnownLevel &&
      character.level !== lastKnownLevel
    ) {
      updateMaxSpellSlotsOnLevelUp(character.level);
      updateSorceryPointsOnLevelUp(character.level);
    }
    setLastKnownLevel(character?.level);
  }, [character?.level, lastKnownLevel]);

  useEffect(() => {
    const autoSetupSpellSlots = async () => {
      if (!character || !character.level || isUpdating) return;

      const hasSpellSlots = Object.keys(character).some(
        (key) => key.startsWith("maxSpellSlots") && character[key] > 0,
      );

      if (!hasSpellSlots) {
        await setupStandardSpellSlots(character.level, false);
      }
    };

    autoSetupSpellSlots();
  }, [character?.level, selectedCharacterId]);

  useEffect(() => {
    const autoSetupSorceryPoints = async () => {
      if (!character || !character.level || isUpdating) return;

      const hasSorceryPoints =
        character.maxSorceryPoints !== undefined &&
        character.maxSorceryPoints !== null &&
        character.maxSorceryPoints > 0;

      if (!hasSorceryPoints) {
        const maxSorceryPoints = SORCERY_POINT_PROGRESSION[character.level];

        if (maxSorceryPoints !== undefined && maxSorceryPoints >= 0) {
          await updateSorceryPointsOnLevelUp(character.level);
        }
      }
    };

    autoSetupSorceryPoints();
  }, [character?.level, selectedCharacterId, character?.maxSorceryPoints]);

  useEffect(() => {
    if (character?.castingStyle) {
      setExpandedCastingStyles((prev) => {
        if (Object.keys(prev).length === 0) {
          return { [character.castingStyle]: true };
        }
        return prev;
      });
    }
  }, [character?.castingStyle]);

  const getSpellSlotData = () => {
    const slots = [];
    for (let level = 1; level <= 9; level++) {
      const current = character?.[`spellSlots${level}`] || 0;
      const max = character?.[`maxSpellSlots${level}`] || 0;
      if (max > 0) {
        slots.push({ level, current, max });
      }
    }
    return slots;
  };

  const spellSlots = getSpellSlotData();

  const getSlotColor = (current, max) => {
    if (max === 0) return "#6b7280";
    const percentage = current / max;
    if (percentage >= 0.75) return "#10b981";
    if (percentage >= 0.5) return "#3b82f6";
    if (percentage >= 0.25) return "#f59e0b";
    return "#ef4444";
  };

  const updateCustomSpellSlots = async () => {
    if (!character || isUpdating) return;

    setIsUpdating(true);

    try {
      const updateData = {
        character_id: selectedCharacterId,
        discord_user_id: character?.discord_user_id || discordUserId,
        updated_at: new Date().toISOString(),
      };

      Object.keys(customSlots).forEach((level) => {
        const maxSlots = customSlots[level];
        updateData[`max_spell_slots_${level}`] = maxSlots;

        const currentSlots = character?.[`spellSlots${level}`] || 0;
        updateData[`spell_slots_${level}`] = Math.min(currentSlots, maxSlots);
      });

      updateData.max_sorcery_points = customMaxSorceryPoints;
      const currentSorceryPts = character?.sorceryPoints || 0;
      if (currentSorceryPts > customMaxSorceryPoints) {
        updateData.sorcery_points = customMaxSorceryPoints;
      }

      const { error } = await supabase
        .from("character_resources")
        .upsert(updateData, {
          onConflict: "character_id,discord_user_id",
        });

      if (error) {
        console.error("Error updating spell slots:", error);
        alert("Failed to update spell slots");
        return;
      }

      const newCharacterState = { ...character };
      Object.keys(customSlots).forEach((level) => {
        const maxSlots = customSlots[level];
        newCharacterState[`maxSpellSlots${level}`] = maxSlots;
        const currentSlots = character?.[`spellSlots${level}`] || 0;
        newCharacterState[`spellSlots${level}`] = Math.min(
          currentSlots,
          maxSlots,
        );
      });
      newCharacterState.maxSorceryPoints = customMaxSorceryPoints;
      // Only cap sorcery points if they exceed the new max, otherwise preserve current value
      if (currentSorceryPts > customMaxSorceryPoints) {
        newCharacterState.sorceryPoints = customMaxSorceryPoints;
      } else {
        newCharacterState.sorceryPoints = currentSorceryPts;
      }
      setCharacter(newCharacterState);

      setShowCustomModal(false);

      const totalSlots = Object.values(customSlots).reduce(
        (sum, slots) => sum + slots,
        0,
      );

      const success = await sendDiscordRollWebhook({
        character,
        rollType: "Spell Update",
        title: "Spell Slots Updated",
        embedColor: 0xf59e0b,
        rollResult: null,
        fields: [],
        useCharacterAvatar: true,
        description: `Spell slot maximums updated (${totalSlots} total slots)`,
      });

      if (!success) {
        console.error("Failed to send spell slot update to Discord");
      }
    } catch (error) {
      console.error("Error updating spell slots:", error);
      alert("Error updating spell slots. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSpellSlotChange = async (
    level,
    change,
    action,
    isEdit = false,
    newMaxSlots = null,
    newCurrentSlots = null,
  ) => {
    if (!character || isUpdating) return;

    setIsUpdating(true);

    try {
      const currentSlots = character?.[`spellSlots${level}`] || 0;
      const maxSlots = character?.[`maxSpellSlots${level}`] || 0;

      let updateData = {
        character_id: selectedCharacterId,
        discord_user_id: character?.discord_user_id || discordUserId,
        updated_at: new Date().toISOString(),
      };

      let newSlots = currentSlots;
      let finalMaxSlots = maxSlots;

      if (isEdit) {
        finalMaxSlots = Math.max(0, newMaxSlots);
        newSlots = Math.max(0, newCurrentSlots);
        updateData[`max_spell_slots_${level}`] = finalMaxSlots;
        updateData[`spell_slots_${level}`] = newSlots;
      } else {
        newSlots = Math.max(0, currentSlots + change);
        updateData[`spell_slots_${level}`] = newSlots;
      }

      const { error } = await supabase
        .from("character_resources")
        .upsert(updateData, {
          onConflict: "character_id,discord_user_id",
        });

      if (error) {
        console.error("Error updating spell slots:", error);
        alert("Failed to update spell slots");
        return;
      }

      const newCharacterState = {
        ...character,
        [`spellSlots${level}`]: newSlots,
      };
      if (isEdit) {
        newCharacterState[`maxSpellSlots${level}`] = finalMaxSlots;
      }
      setCharacter(newCharacterState);

      const additionalFields = [
        {
          name: "Spell Level",
          value: `Level ${level}`,
          inline: true,
        },
        {
          name: isEdit ? "Slots Updated" : "Change",
          value: isEdit
            ? `Set to ${newSlots}/${finalMaxSlots}`
            : `${change > 0 ? "+" : ""}${change} Slot${
                Math.abs(change) !== 1 ? "s" : ""
              }`,
          inline: true,
        },
        {
          name: "Current Total",
          value: `${newSlots}/${finalMaxSlots} Slots`,
          inline: true,
        },
      ];

      const success = await sendDiscordRollWebhook({
        character,
        rollType: "Spell Slots",
        title: action,
        embedColor: isEdit ? 0x8b5cf6 : change > 0 ? 0x10b981 : 0x3b82f6,
        rollResult: null,
        fields: additionalFields,
        useCharacterAvatar: true,
      });

      if (!success) {
        console.error("Failed to send spell slot change to Discord");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error updating spell slots:", error);
      alert("Error updating spell slots. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const openModal = (level, action) => {
    if (action === "edit") {
      setModalData({
        level,
        action,
        amount: 1,
        currentMax: character?.[`maxSpellSlots${level}`] || 0,
        currentSlots: character?.[`spellSlots${level}`] || 0,
      });
    } else {
      setModalData({ level, action, amount: 1 });
    }
    setShowModal(true);
  };

  const openCustomModal = () => {
    const currentCustomSlots = {};
    for (let level = 1; level <= 9; level++) {
      currentCustomSlots[level] = character?.[`maxSpellSlots${level}`] || 0;
    }
    setCustomSlots(currentCustomSlots);
    setCustomMaxSorceryPoints(character?.maxSorceryPoints || 0);
    setShowCustomModal(true);
  };

  const currentSorceryPoints = character?.sorceryPoints || 0;
  const maxSorceryPoints = character?.maxSorceryPoints || 0;

  const getSorceryPointColor = (current, max) => {
    if (max === 0) return "#6b7280";
    const percentage = current / max;
    if (percentage >= 0.75) return "#10b981";
    if (percentage >= 0.5) return "#3b82f6";
    if (percentage >= 0.25) return "#f59e0b";
    return "#ef4444";
  };

  const handleSorceryPointChange = async (
    change,
    action,
    isDirectSet = false,
    newMaxSorceryPoints = null,
  ) => {
    if (!character || isUpdating) return;

    setIsUpdating(true);

    try {
      const newSorceryPoints = isDirectSet
        ? Math.max(0, change)
        : Math.max(0, currentSorceryPoints + change);

      const finalMaxSorceryPoints =
        newMaxSorceryPoints !== null
          ? Math.max(0, newMaxSorceryPoints)
          : maxSorceryPoints;

      const { error } = await supabase.from("character_resources").upsert(
        {
          character_id: selectedCharacterId,
          discord_user_id: character?.discord_user_id || discordUserId,
          sorcery_points: newSorceryPoints,
          max_sorcery_points: finalMaxSorceryPoints,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "character_id,discord_user_id",
        },
      );

      if (error) {
        console.error("Error updating sorcery points:", error);
        return;
      }

      setCharacter((prev) => ({
        ...prev,
        sorceryPoints: newSorceryPoints,
        maxSorceryPoints: finalMaxSorceryPoints,
      }));

      const success = await sendDiscordRollWebhook({
        character,
        rollType: "Sorcery Points",
        title: action,
        embedColor: change > 0 ? 0x10b981 : 0xf59e0b,
        rollResult: null,
        fields: [
          {
            name: isDirectSet ? "Set To" : "Change",
            value: isDirectSet
              ? `${change} Sorcery Points`
              : `${change > 0 ? "+" : ""}${change} Sorcery Points`,
            inline: true,
          },
          {
            name: "Current Total",
            value: `${newSorceryPoints}${
              finalMaxSorceryPoints > 0 ? `/${finalMaxSorceryPoints}` : ""
            } Sorcery Points`,
            inline: true,
          },
        ],
        useCharacterAvatar: true,
      });

      setShowSorceryModal(false);
    } catch (error) {
      console.error("Error updating sorcery points:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const openSorceryModal = (action) => {
    setSorceryModalData({
      action,
      amount: action === "set" ? currentSorceryPoints : 1,
      currentValue: currentSorceryPoints,
      maxValue: maxSorceryPoints,
    });
    setShowSorceryModal(true);
  };

  const styles = {
    container: {
      backgroundColor: theme.surface,
      border: `2px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "20px",
      minHeight: "200px",
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px",
    },
    headerTitle: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#3b82f6",
      fontSize: "16px",
      fontWeight: "600",
    },
    headerButtons: {
      display: "flex",
      gap: "8px",
    },
    addButton: {
      backgroundColor: "#f59e0b",
      border: `2px solid ${theme.border}`,
      borderRadius: "6px",
      color: theme.text,
      padding: "4px 8px",
      fontSize: "12px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    spellSlotsSection: {
      marginBottom: "20px",
    },
    slotsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "12px",
      maxWidth: "100%",
    },
    slotItem: {
      backgroundColor: theme.background,
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      padding: "12px",
      textAlign: "center",
      position: "relative",
      cursor: "pointer",
      boxSizing: "border-box",
      minHeight: "100px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    slotLevel: {
      fontSize: "14px",
      color: "#9ca3af",
      marginBottom: "4px",
      fontWeight: "500",
    },
    slotDisplay: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    slotButtons: {
      display: "flex",
      gap: "4px",
      justifyContent: "center",
      marginTop: "auto",
    },
    slotButton: {
      padding: "2px 6px",
      borderRadius: "4px",
      border: "none",
      fontSize: "10px",
      cursor: "pointer",
      fontWeight: "600",
      minWidth: "50px",
      minHeight: "24px",
    },
    addSlotButton: {
      backgroundColor: "#10b981",
      color: "white",
    },
    useSlotButton: {
      backgroundColor: "#f59e0b",
      color: "white",
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "#1f2937",
      border: "1px solid #374151",
      borderRadius: "12px",
      padding: "24px",
      minWidth: "300px",
      maxWidth: "400px",
    },
    modalHeader: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#f9fafb",
      marginBottom: "16px",
      textAlign: "center",
    },
    inputGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      color: "#d1d5db",
      fontSize: "14px",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      backgroundColor: "#374151",
      border: "1px solid #4b5563",
      borderRadius: "6px",
      color: "#f9fafb",
      fontSize: "16px",
    },
    modalButtons: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    modalButton: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer",
    },
    cancelButton: {
      backgroundColor: "#6b7280",
      color: "white",
    },
    confirmButton: {
      backgroundColor: "#3b82f6",
      color: "white",
    },
    emptyState: {
      textAlign: "center",
      color: "#9ca3af",
      fontSize: "14px",
      padding: "40px 20px",
    },
    resourcesContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      width: "100%",
      marginBottom: "20px",
    },
  };

  if (spellSlots.length === 0) {
    return (
      <div style={styles.resourcesContainer}>
        <div style={styles.container}>
          <div style={styles.headerTitle}>
            <BookOpen size={20} />
            Spell Slots
          </div>
          <div style={styles.emptyState}>
            {character?.level ? (
              <>
                Setting up spell slots for level {character.level} character...
                {isUpdating && (
                  <div style={{ marginTop: "8px" }}>Configuring...</div>
                )}
              </>
            ) : (
              "Character level needed to configure spell slots."
            )}
          </div>
        </div>
      </div>
    );
  }
  const spellSlotTiles = spellSlots.map(({ level, current, max }) => (
    <div
      key={level}
      style={styles.slotItem}
      onClick={() => openModal(level, "use")}
    >
      <button
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          backgroundColor: "#8b5cf6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "10px",
          opacity: 0.8,
        }}
        onClick={(e) => {
          e.stopPropagation();
          openModal(level, "edit");
        }}
        disabled={isUpdating}
        title="Edit max spell slots for this level"
        onMouseEnter={(e) => (e.target.style.opacity = "1")}
        onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
      >
        <Edit3 size={12} />
      </button>
      <div style={{ ...styles.slotLevel, marginRight: "32px" }}>
        Level {level}
      </div>
      <div
        style={{
          ...styles.slotDisplay,
          color: getSlotColor(current, max),
        }}
      >
        {current}/{max}
      </div>
      <div style={styles.slotButtons}>
        <button
          style={{ ...styles.slotButton, ...styles.addSlotButton }}
          onClick={(e) => {
            e.stopPropagation();
            openModal(level, "add");
          }}
          disabled={isUpdating}
        >
          <PlusIcon size={12} />
        </button>
        <button
          style={{ ...styles.slotButton, ...styles.useSlotButton }}
          onClick={(e) => {
            e.stopPropagation();
            openModal(level, "use");
          }}
          disabled={isUpdating || current === 0}
        >
          <MinusIcon size={12} />
        </button>
      </div>
    </div>
  ));

  const sorceryPointsTile = (maxSorceryPoints > 0 || character?.level >= 2) && (
    <div
      key="sorcery-points"
      style={{
        ...styles.slotItem,
        border: `3px solid ${theme.primary}`,
        backgroundColor: theme.surface,
      }}
      onClick={() => openSorceryModal("edit")}
    >
      <button
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          backgroundColor: "#8b5cf6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "10px",
          opacity: 0.8,
        }}
        onClick={(e) => {
          e.stopPropagation();
          openSorceryModal("edit");
        }}
        disabled={isUpdating}
        title="Edit current and maximum values"
        onMouseEnter={(e) => (e.target.style.opacity = "1")}
        onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
      >
        <Edit3 size={12} />
      </button>
      <div
        style={{
          ...styles.slotLevel,
          display: "flex",
          alignItems: "center",
          gap: "4px",
          justifyContent: "center",
          color: theme.primary,
          fontWeight: "600",
          marginRight: "32px",
        }}
      >
        <Sparkles size={14} />
        Sorcery Points
      </div>
      <div
        style={{
          ...styles.slotDisplay,
          color: getSorceryPointColor(currentSorceryPoints, maxSorceryPoints),
        }}
      >
        {currentSorceryPoints}/{maxSorceryPoints}
      </div>
      <div style={styles.slotButtons}>
        <button
          style={{ ...styles.slotButton, ...styles.addSlotButton }}
          onClick={(e) => {
            e.stopPropagation();
            openSorceryModal("add");
          }}
          disabled={isUpdating}
        >
          <PlusIcon size={12} />
        </button>
        <button
          style={{ ...styles.slotButton, ...styles.useSlotButton }}
          onClick={(e) => {
            e.stopPropagation();
            openSorceryModal("use");
          }}
          disabled={isUpdating || currentSorceryPoints === 0}
        >
          <MinusIcon size={12} />
        </button>
      </div>
    </div>
  );

  const allTiles = [...spellSlotTiles, sorceryPointsTile].filter(Boolean);

  return (
    <div style={styles.resourcesContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <BookOpen size={20} />
            Spell Slots
            <span
              style={{
                fontSize: "11px",
                fontWeight: "normal",
                color: theme.warning || "#f59e0b",
                marginLeft: "8px",
              }}
            >
              (Verify values manually - defaults may not account for all rules)
            </span>
          </div>
          <div style={styles.headerButtons}>
            <button
              style={styles.addButton}
              onClick={openCustomModal}
              disabled={isUpdating}
              title="Configure maximum spell slots for each level"
            >
              <Edit3 size={16} />
              Configure
            </button>
          </div>
        </div>

        <div style={styles.slotsGrid}>{allTiles}</div>

        <div
          style={{
            marginTop: "20px",
            backgroundColor: theme.background,
            border: `2px solid ${theme.border}`,
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            onClick={() => setShowProgressionTable(!showProgressionTable)}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "600",
              color: theme.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              backgroundColor: theme.surface,
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme.hover || theme.background;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.surface;
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <BookOpen size={16} style={{ color: theme.primary }} />
              Spell Slots by Level (Progression Table)
            </div>
            {showProgressionTable ? (
              <ChevronUp size={20} style={{ color: theme.textSecondary }} />
            ) : (
              <ChevronDown size={20} style={{ color: theme.textSecondary }} />
            )}
          </div>

          {showProgressionTable && (
            <div style={{ padding: "16px", overflowX: "auto" }}>
              <div
                style={{
                  fontSize: "13px",
                  color: theme.textSecondary,
                  marginBottom: "16px",
                  lineHeight: "1.6",
                }}
              >
                This table shows how many spell slots you gain at each character
                level. Your current level is{" "}
                <strong>Level {character?.level || 1}</strong>.
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                  minWidth: "600px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "center",
                        borderBottom: `2px solid ${theme.border}`,
                        color: theme.textSecondary,
                        fontWeight: "600",
                        position: "sticky",
                        left: 0,
                        backgroundColor: theme.surface,
                        zIndex: 1,
                      }}
                    >
                      Level
                    </th>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((slot) => (
                      <th
                        key={slot}
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderBottom: `2px solid ${theme.border}`,
                          color: theme.textSecondary,
                          fontWeight: "600",
                        }}
                      >
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(SPELL_SLOT_PROGRESSION).map(
                    ([level, slots]) => {
                      const isCurrentLevel =
                        parseInt(level) === (character?.level || 1);
                      return (
                        <tr
                          key={level}
                          style={{
                            backgroundColor: isCurrentLevel
                              ? `${theme.primary}15`
                              : "transparent",
                          }}
                        >
                          <td
                            style={{
                              padding: "8px",
                              textAlign: "center",
                              borderBottom: `1px solid ${theme.border}`,
                              color: isCurrentLevel
                                ? theme.primary
                                : theme.text,
                              fontWeight: isCurrentLevel ? "700" : "600",
                              position: "sticky",
                              left: 0,
                              backgroundColor: isCurrentLevel
                                ? `${theme.primary}15`
                                : theme.surface,
                              zIndex: 1,
                            }}
                          >
                            {level}
                          </td>
                          {slots.map((count, idx) => (
                            <td
                              key={idx}
                              style={{
                                padding: "8px",
                                textAlign: "center",
                                borderBottom: `1px solid ${theme.border}`,
                                color:
                                  count === 0
                                    ? theme.textSecondary
                                    : isCurrentLevel
                                      ? theme.primary
                                      : theme.text,
                                fontWeight:
                                  isCurrentLevel && count > 0
                                    ? "700"
                                    : "normal",
                              }}
                            >
                              {count === 0 ? "—" : count}
                            </td>
                          ))}
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "20px",
            backgroundColor: theme.background,
            border: `2px solid ${theme.border}`,
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            onClick={() => setShowConversionTable(!showConversionTable)}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "600",
              color: theme.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              backgroundColor: theme.surface,
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme.hover || theme.background;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.surface;
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={16} style={{ color: theme.primary }} />
              Flexible Casting (How to convert spell slots and sorcery points)
            </div>
            {showConversionTable ? (
              <ChevronUp size={20} style={{ color: theme.textSecondary }} />
            ) : (
              <ChevronDown size={20} style={{ color: theme.textSecondary }} />
            )}
          </div>

          {showConversionTable && (
            <div style={{ padding: "16px" }}>
              <div
                style={{
                  fontSize: "13px",
                  color: theme.textSecondary,
                  marginBottom: "20px",
                  lineHeight: "1.6",
                }}
              >
                <p style={{ margin: "0 0 12px 0" }}>
                  <strong>Creating Spell Slots.</strong> You can transform
                  unexpended sorcery points into one spell slot as a bonus
                  action on your turn. The Creating Spell Slots table shows the
                  cost of creating a spell slot of a given level. You can create
                  spell slots no higher in level than 5th. Any spell slot you
                  create with this feature vanishes when you finish a long rest.
                </p>
                <p style={{ margin: "0" }}>
                  <strong>Converting a Spell Slot to Sorcery Points.</strong> As
                  a bonus action on your turn, you can expend one spell slot and
                  gain a number of sorcery points equal to the slot's level.
                </p>
              </div>

              <div
                style={{
                  height: "1px",
                  backgroundColor: theme.border,
                  margin: "20px 0",
                }}
              />

              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: "12px",
                }}
              >
                Creating Spell Slots Table
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        borderBottom: `2px solid ${theme.border}`,
                        color: theme.textSecondary,
                        fontWeight: "600",
                      }}
                    >
                      Spell Slot Level
                    </th>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "right",
                        borderBottom: `2px solid ${theme.border}`,
                        color: theme.textSecondary,
                        fontWeight: "600",
                      }}
                    >
                      Sorcery Point Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { level: "1st", cost: 2 },
                    { level: "2nd", cost: 3 },
                    { level: "3rd", cost: 5 },
                    { level: "4th", cost: 6 },
                    { level: "5th", cost: 7 },
                  ].map((row, index) => (
                    <tr key={row.level}>
                      <td
                        style={{
                          padding: "8px",
                          borderBottom:
                            index < 4 ? `1px solid ${theme.border}` : "none",
                          color: theme.text,
                        }}
                      >
                        {row.level}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          borderBottom:
                            index < 4 ? `1px solid ${theme.border}` : "none",
                          color: theme.primary,
                          fontWeight: "600",
                        }}
                      >
                        {row.cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "20px",
            backgroundColor: theme.background,
            border: `2px solid ${theme.border}`,
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            onClick={() =>
              setShowCastingStyleProgression(!showCastingStyleProgression)
            }
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "600",
              color: theme.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              backgroundColor: theme.surface,
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme.hover || theme.background;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.surface;
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <BarChart3 size={16} style={{ color: theme.primary }} />
              Casting Style Progression Tables
            </div>
            {showCastingStyleProgression ? (
              <ChevronUp size={20} style={{ color: theme.textSecondary }} />
            ) : (
              <ChevronDown size={20} style={{ color: theme.textSecondary }} />
            )}
          </div>

          {showCastingStyleProgression && (
            <>
              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: theme.background,
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <div style={{ fontSize: "13px", color: theme.textSecondary }}>
                  View sorcery points, metamagic, and features by casting style
                  and level
                </div>
              </div>

              {Object.entries(CASTING_STYLE_PROGRESSION).map(
                ([castingStyle, progression]) => (
                  <div
                    key={castingStyle}
                    style={{
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    <div
                      onClick={() =>
                        setExpandedCastingStyles((prev) => ({
                          ...prev,
                          [castingStyle]: !prev[castingStyle],
                        }))
                      }
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: theme.text,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        backgroundColor: theme.surface,
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          theme.hover || theme.background;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.surface;
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {castingStyle}
                      </div>
                      {expandedCastingStyles[castingStyle] ? (
                        <ChevronUp
                          size={20}
                          style={{ color: theme.textSecondary }}
                        />
                      ) : (
                        <ChevronDown
                          size={20}
                          style={{ color: theme.textSecondary }}
                        />
                      )}
                    </div>

                    {expandedCastingStyles[castingStyle] && (
                      <div style={{ padding: "16px", overflowX: "auto" }}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "12px",
                            minWidth: "700px",
                          }}
                        >
                          <thead>
                            <tr>
                              <th
                                style={{
                                  padding: "8px",
                                  textAlign: "center",
                                  borderBottom: `2px solid ${theme.border}`,
                                  color: theme.textSecondary,
                                  fontWeight: "600",
                                  position: "sticky",
                                  left: 0,
                                  backgroundColor: theme.surface,
                                  zIndex: 1,
                                }}
                              >
                                Level
                              </th>
                              <th
                                style={{
                                  padding: "8px",
                                  textAlign: "center",
                                  borderBottom: `2px solid ${theme.border}`,
                                  color: theme.textSecondary,
                                  fontWeight: "600",
                                }}
                              >
                                Prof Bonus
                              </th>
                              <th
                                style={{
                                  padding: "8px",
                                  textAlign: "center",
                                  borderBottom: `2px solid ${theme.border}`,
                                  color: theme.textSecondary,
                                  fontWeight: "600",
                                }}
                              >
                                Sorcery Points
                              </th>
                              <th
                                style={{
                                  padding: "8px",
                                  textAlign: "center",
                                  borderBottom: `2px solid ${theme.border}`,
                                  color: theme.textSecondary,
                                  fontWeight: "600",
                                }}
                              >
                                Metamagic
                              </th>
                              <th
                                style={{
                                  padding: "8px",
                                  textAlign: "left",
                                  borderBottom: `2px solid ${theme.border}`,
                                  color: theme.textSecondary,
                                  fontWeight: "600",
                                }}
                              >
                                Features
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(progression).map(
                              ([level, data]) => {
                                const isCurrentLevel =
                                  parseInt(level) === (character?.level || 1);
                                return (
                                  <tr
                                    key={level}
                                    style={{
                                      backgroundColor: isCurrentLevel
                                        ? `${theme.primary}15`
                                        : "transparent",
                                    }}
                                  >
                                    <td
                                      style={{
                                        padding: "8px",
                                        textAlign: "center",
                                        borderBottom: `1px solid ${theme.border}`,
                                        color: isCurrentLevel
                                          ? theme.primary
                                          : theme.text,
                                        fontWeight: isCurrentLevel
                                          ? "700"
                                          : "600",
                                        position: "sticky",
                                        left: 0,
                                        backgroundColor: isCurrentLevel
                                          ? `${theme.primary}15`
                                          : theme.surface,
                                        zIndex: 1,
                                      }}
                                    >
                                      {level}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        textAlign: "center",
                                        borderBottom: `1px solid ${theme.border}`,
                                        color: isCurrentLevel
                                          ? theme.primary
                                          : theme.text,
                                        fontWeight: isCurrentLevel
                                          ? "700"
                                          : "normal",
                                      }}
                                    >
                                      +{data.proficiencyBonus}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        textAlign: "center",
                                        borderBottom: `1px solid ${theme.border}`,
                                        color: isCurrentLevel
                                          ? theme.primary
                                          : theme.text,
                                        fontWeight: isCurrentLevel
                                          ? "700"
                                          : "normal",
                                      }}
                                    >
                                      {data.sorceryPoints}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        textAlign: "center",
                                        borderBottom: `1px solid ${theme.border}`,
                                        color: isCurrentLevel
                                          ? theme.primary
                                          : theme.text,
                                        fontWeight: isCurrentLevel
                                          ? "700"
                                          : "normal",
                                      }}
                                    >
                                      {data.metamagic}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        textAlign: "left",
                                        borderBottom: `1px solid ${theme.border}`,
                                        color: isCurrentLevel
                                          ? theme.primary
                                          : theme.textSecondary,
                                        fontSize: "11px",
                                      }}
                                    >
                                      {data.features.length > 0
                                        ? data.features.join(", ")
                                        : "—"}
                                    </td>
                                  </tr>
                                );
                              },
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ),
              )}
            </>
          )}
        </div>

        {showCustomModal && (
          <div style={styles.modal} onClick={() => setShowCustomModal(false)}>
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <Plus
                  size={20}
                  style={{ marginRight: "8px", color: "#f59e0b" }}
                />
                Modify Spell Slot Maximums
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    marginBottom: "16px",
                  }}
                >
                  Adjust maximum spell slots for each level. Current slots will
                  be preserved where possible.
                </div>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                  <div
                    key={level}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      padding: "8px",
                      backgroundColor: "#374151",
                      borderRadius: "6px",
                    }}
                  >
                    <label
                      style={{
                        color: "#d1d5db",
                        fontSize: "14px",
                        minWidth: "80px",
                      }}
                    >
                      Level {level}:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={customSlots[level]}
                      onChange={(e) =>
                        setCustomSlots((prev) => ({
                          ...prev,
                          [level]: Math.max(
                            0,
                            Math.min(20, parseInt(e.target.value) || 0),
                          ),
                        }))
                      }
                      style={{
                        ...styles.input,
                        width: "80px",
                        margin: 0,
                        padding: "6px 8px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                ))}

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid #4b5563",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      marginBottom: "12px",
                    }}
                  >
                    Adjust maximum Sorcery Points
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px",
                      backgroundColor: "#374151",
                      border: `3px solid ${theme.primary}`,
                      borderRadius: "6px",
                    }}
                  >
                    <label
                      style={{
                        color: theme.primary,
                        fontSize: "14px",
                        fontWeight: "600",
                        minWidth: "120px",
                      }}
                    >
                      Sorcery Points:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={customMaxSorceryPoints}
                      onChange={(e) =>
                        setCustomMaxSorceryPoints(
                          Math.max(
                            0,
                            Math.min(50, parseInt(e.target.value) || 0),
                          ),
                        )
                      }
                      style={{
                        ...styles.input,
                        width: "80px",
                        margin: 0,
                        padding: "6px 8px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.modalButtons}>
                <button
                  style={{ ...styles.modalButton, ...styles.cancelButton }}
                  onClick={() => setShowCustomModal(false)}
                >
                  Cancel
                </button>
                <button
                  style={{ ...styles.modalButton, ...styles.confirmButton }}
                  onClick={updateCustomSpellSlots}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Spell Slots"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div style={styles.modal} onClick={() => setShowModal(false)}>
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <BookOpen
                  size={20}
                  style={{
                    marginRight: "8px",
                    color: modalData.action === "edit" ? "#8b5cf6" : "#3b82f6",
                  }}
                />
                {modalData.action === "add"
                  ? "Add"
                  : modalData.action === "edit"
                    ? "Edit"
                    : "Use"}{" "}
                Level {modalData.level} Spell Slot
                {modalData.action === "edit" ? "s" : ""}
              </div>

              {modalData.action === "edit" ? (
                <div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Current Spell Slots:</label>
                    <input
                      type="number"
                      min="0"
                      value={modalData.currentSlots}
                      onChange={(e) =>
                        setModalData((prev) => ({
                          ...prev,
                          currentSlots: Math.max(
                            0,
                            parseInt(e.target.value) || 0,
                          ),
                        }))
                      }
                      style={styles.input}
                      autoFocus
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Maximum Spell Slots:</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={modalData.currentMax}
                      onChange={(e) =>
                        setModalData((prev) => ({
                          ...prev,
                          currentMax: Math.max(
                            0,
                            parseInt(e.target.value) || 0,
                          ),
                        }))
                      }
                      style={styles.input}
                    />
                  </div>
                </div>
              ) : (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Slots to {modalData.action === "add" ? "Add" : "Use"}:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={
                      modalData.action === "add"
                        ? 20
                        : spellSlots.find((s) => s.level === modalData.level)
                            ?.current || 1
                    }
                    value={modalData.amount}
                    onChange={(e) =>
                      setModalData((prev) => ({
                        ...prev,
                        amount: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    style={styles.input}
                    autoFocus
                  />
                </div>
              )}

              <div style={styles.modalButtons}>
                <button
                  style={{ ...styles.modalButton, ...styles.cancelButton }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  style={{ ...styles.modalButton, ...styles.confirmButton }}
                  onClick={() => {
                    if (modalData.action === "edit") {
                      handleSpellSlotChange(
                        modalData.level,
                        0,
                        "Spell Slots Updated",
                        true,
                        modalData.currentMax,
                        modalData.currentSlots,
                      );
                    } else {
                      handleSpellSlotChange(
                        modalData.level,
                        modalData.action === "add"
                          ? modalData.amount
                          : -modalData.amount,
                        modalData.action === "add"
                          ? "Spell Slot Added"
                          : "Spell Slot Used",
                      );
                    }
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating
                    ? modalData.action === "add"
                      ? "Adding..."
                      : modalData.action === "edit"
                        ? "Updating..."
                        : "Using..."
                    : modalData.action === "edit"
                      ? `Set to ${modalData.currentSlots}/${modalData.currentMax}`
                      : `${modalData.action === "add" ? "Add" : "Use"} ${
                          modalData.amount
                        }`}
                </button>
              </div>
            </div>
          </div>
        )}

        {showSorceryModal && (
          <div style={styles.modal} onClick={() => setShowSorceryModal(false)}>
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <Sparkles
                  size={20}
                  style={{ marginRight: "8px", color: "#a855f7" }}
                />
                {sorceryModalData.action === "add"
                  ? "Add"
                  : sorceryModalData.action === "edit"
                    ? "Edit"
                    : "Use"}{" "}
                Sorcery Points
              </div>

              {sorceryModalData.action === "edit" ? (
                <div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Current Sorcery Points:</label>
                    <input
                      type="number"
                      min="0"
                      value={sorceryModalData.currentValue}
                      onChange={(e) =>
                        setSorceryModalData((prev) => ({
                          ...prev,
                          currentValue: Math.max(
                            0,
                            parseInt(e.target.value) || 0,
                          ),
                        }))
                      }
                      style={styles.input}
                      autoFocus
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Maximum Sorcery Points:</label>
                    <input
                      type="number"
                      min="0"
                      value={sorceryModalData.maxValue}
                      onChange={(e) =>
                        setSorceryModalData((prev) => ({
                          ...prev,
                          maxValue: Math.max(0, parseInt(e.target.value) || 0),
                        }))
                      }
                      style={styles.input}
                    />
                  </div>
                </div>
              ) : (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Points to{" "}
                    {sorceryModalData.action === "add" ? "Add" : "Use"}:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={sorceryModalData.amount}
                    onChange={(e) =>
                      setSorceryModalData((prev) => ({
                        ...prev,
                        amount: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    style={styles.input}
                    autoFocus
                  />
                </div>
              )}

              <div style={styles.modalButtons}>
                <button
                  style={{ ...styles.modalButton, ...styles.cancelButton }}
                  onClick={() => setShowSorceryModal(false)}
                >
                  Cancel
                </button>
                <button
                  style={{ ...styles.modalButton, ...styles.confirmButton }}
                  onClick={() => {
                    if (sorceryModalData.action === "edit") {
                      handleSorceryPointChange(
                        sorceryModalData.currentValue,
                        "Sorcery Points Updated",
                        true,
                        sorceryModalData.maxValue,
                      );
                    } else {
                      handleSorceryPointChange(
                        sorceryModalData.action === "add"
                          ? sorceryModalData.amount
                          : -sorceryModalData.amount,
                        sorceryModalData.action === "add"
                          ? "Sorcery Points Added"
                          : "Sorcery Points Used",
                      );
                    }
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating
                    ? sorceryModalData.action === "add"
                      ? "Adding..."
                      : sorceryModalData.action === "edit"
                        ? "Updating..."
                        : "Using..."
                    : sorceryModalData.action === "edit"
                      ? `Update (${sorceryModalData.currentValue}/${sorceryModalData.maxValue})`
                      : `${sorceryModalData.action === "add" ? "Add" : "Use"} ${
                          sorceryModalData.amount
                        }`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpellSlotTracker;
