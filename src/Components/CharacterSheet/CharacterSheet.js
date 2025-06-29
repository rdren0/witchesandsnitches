import { useState, useEffect } from "react";
import {
  User,
  Shield,
  Heart,
  Swords,
  Dices,
  Moon,
  Coffee,
  TrendingUp,
  Star,
  Sparkles,
  Target,
  MessageCircle,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { Skills } from "./Skills";
import AbilityScores from "../AbilityScores/AbilityScores";
import LevelUpModal from "../CharacterManagement/Edit/LevelUpModal";
import CharacterSheetModals from "./CharacterSheetModals";
import { modifiers, formatModifier } from "./utils";
import { useTheme } from "../../contexts/ThemeContext";
import { getCharacterSheetStyles } from "../../styles/masterStyles";
import { useRollFunctions, useRollModal } from "../utils/diceRoller";
import FlexibleDiceRoller from "../FlexibleDiceRoller/FlexibleDiceRoller";
import CorruptionTracker from "./Sections/CorruptionTracker";
import SpellSlotTracker from "./Sections/SpellSlotTracker";
import SorceryPointTracker from "./Sections/SorceryPointTracker";
import { useCallback } from "react";
import { getDiscordWebhook } from "../../App/const";

const hitDiceData = {
  Willpower: "d10",
  Technique: "d6",
  Intellect: "d8",
  Vigor: "d12",
  default: "d8",
};

const pulseKeyframes = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const getCharacterSheetLayoutStyles = (theme) => ({
  display: "grid",
  gridTemplateColumns: "3fr 1fr",
  gap: "24px",
  alignItems: "start",
  marginBottom: "20px",
  width: "100%",

  "@media (max-width: 1024px)": {
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
});

const getRightSideStackStyles = (theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  height: "fit-content",
});

const CharacterSheet = ({
  user,
  supabase,
  selectedCharacter,
  characters,
  className = "",
  adminMode = false,
  isUserAdmin = false,
}) => {
  const { rollInitiative } = useRollFunctions();
  const { showRollResult } = useRollModal();

  const { theme } = useTheme();
  const styles = getCharacterSheetStyles(theme);
  const discordUserId = user?.user_metadata?.provider_id;

  const [character, setCharacter] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showHitDiceModal, setShowHitDiceModal] = useState(false);
  const [selectedHitDiceCount, setSelectedHitDiceCount] = useState(1);
  const [isRollingHitDice, setIsRollingHitDice] = useState(false);
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [damageAmount, setDamageAmount] = useState(0);
  const [isApplyingDamage, setIsApplyingDamage] = useState(false);
  const [isLongResting, setIsLongResting] = useState(false);
  const characterModifiers = modifiers(character);

  const [characterLoading, setCharacterLoading] = useState(false);
  const [error, setError] = useState(null);

  const discordWebhookUrl = getDiscordWebhook(character?.gameSession);

  const getHitDie = useCallback((castingStyle) => {
    return hitDiceData[castingStyle] || hitDiceData.default;
  }, []);

  const getBaseArmorClass = useCallback((castingStyle) => {
    const baseACMap = {
      Willpower: 13,
      "Willpower Caster": 13,
      Technique: 10,
      "Technique Caster": 10,
      Intellect: 11,
      "Intellect Caster": 11,
      Vigor: 8,
      "Vigor Caster": 8,
    };
    return baseACMap[castingStyle] || 11;
  }, []);

  const getSpellcastingAbility = (castingStyle) => {
    const spellcastingAbilityMap = {
      "Willpower Caster": "Charisma",
      "Technique Caster": "Wisdom",
      "Intellect Caster": "Intelligence",
      "Vigor Caster": "Constitution",

      Willpower: "Charisma",
      Technique: "Wisdom",
      Intellect: "Intelligence",
      Vigor: "Constitution",
    };
    return spellcastingAbilityMap[castingStyle] || null;
  };
  const getSpellcastingAbilityModifier = (character) => {
    const spellcastingAbility = getSpellcastingAbility(character.castingStyle);
    if (!spellcastingAbility) return 0;

    const abilityKey = spellcastingAbility.toLowerCase();
    const abilityScore = character[abilityKey] || 10;
    return Math.floor((abilityScore - 10) / 2);
  };

  const rollSpellcastingAbilityCheck = async () => {
    if (!character || isRolling) return;

    const spellcastingAbility = getSpellcastingAbility(character.castingStyle);
    if (!spellcastingAbility) return;

    setIsRolling(true);

    try {
      const spellcastingModifier = getSpellcastingAbilityModifier(character);
      const totalModifier = spellcastingModifier;

      const rollValue = Math.floor(Math.random() * 20) + 1;
      const total = rollValue + totalModifier;

      const isCriticalSuccess = rollValue === 20;
      const isCriticalFailure = rollValue === 1;

      showRollResult({
        title: "Spellcasting Ability Check",
        rollValue: rollValue,
        modifier: totalModifier,
        total: total,
        isCriticalSuccess: isCriticalSuccess,
        isCriticalFailure: isCriticalFailure,
        type: "abilitycheck",
        description: `d20 + ${spellcastingModifier} (${spellcastingAbility}) = ${total}`,
      });

      if (discordWebhookUrl) {
        const embed = {
          title: `${character.name} - Spellcasting Ability Check`,
          color: isCriticalSuccess
            ? 0x00ff00
            : isCriticalFailure
            ? 0xff0000
            : 0x3b82f6,
          fields: [
            {
              name: "Roll",
              value: `d20: ${rollValue}`,
              inline: true,
            },
            {
              name: "Modifier",
              value: `${spellcastingAbility}: ${formatModifier(
                spellcastingModifier
              )}`,
              inline: true,
            },
            {
              name: "Total",
              value: `${total}`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Spellcasting Ability Check",
          },
        };

        if (isCriticalSuccess) {
          embed.description = "🌟 **Critical Success!**";
        } else if (isCriticalFailure) {
          embed.description = "💥 **Critical Failure!**";
        }

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
          });
        } catch (discordError) {
          console.error("Error sending to Discord:", discordError);
        }
      }
    } catch (error) {
      console.error("Error rolling spellcasting ability check:", error);
      alert("Error rolling dice. Please try again.");
    } finally {
      setIsRolling(false);
    }
  };

  const DiscordAnnouncementButton = ({ character }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [status, setStatus] = useState("idle"); // idle, sending, success, error
    const [isVisible, setIsVisible] = useState(true);

    const discordWebhookUrl = getDiscordWebhook(character?.gameSession);
    console.log(discordWebhookUrl);
    const announcement = `
    ✨🎲 **Character Roll Update** 🎲✨

Your character rolls will now appear in this channel if you have assigned the correct **Game Session** in Character Management .

If for some reason your rolls don't appear here, they can be found in the **#rolling** for now.

Please report any issues to ***#website***

Happy rolling! ✨`;

    const sendWebhook = async () => {
      if (!discordWebhookUrl) {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 2000);
        return;
      }

      setStatus("sending");

      try {
        const response = await fetch(discordWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: announcement,
            username: "Character Sheet Bot",
            avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
          }),
        });

        if (response.ok) {
          setStatus("success");
          // Auto-hide after successful send
          setTimeout(() => {
            setIsVisible(false);
          }, 3000);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.error("Webhook failed:", error);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    };

    const handleDelete = () => {
      setIsVisible(false);
    };

    if (!isVisible) {
      return null;
    }

    if (!isExpanded) {
      return (
        <div className="inline-flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm"
          >
            <MessageCircle size={16} />
            Announce Rolls
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove button"
          >
            <X size={16} />
          </button>
        </div>
      );
    }

    return (
      <div className="inline-block bg-white border border-gray-200 rounded-lg shadow-sm p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle size={16} className="text-indigo-600" />
            Discord Announcement
          </h3>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove button"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-xs text-gray-600">
            <strong>Game Session:</strong>{" "}
            {character?.gameSession || "Not assigned"}
          </div>

          {!discordWebhookUrl && (
            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
              ⚠️ No webhook configured for this game session
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={sendWebhook}
              disabled={
                !discordWebhookUrl ||
                status === "sending" ||
                status === "success"
              }
              className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors duration-200 ${
                status === "success"
                  ? "bg-green-100 text-green-800 cursor-not-allowed"
                  : status === "error"
                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                  : status === "sending"
                  ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                  : !discordWebhookUrl
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {status === "sending" && (
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              )}
              {status === "success" && <Check size={14} />}
              {status === "error" && <AlertCircle size={14} />}
              {status === "idle" &&
                (discordWebhookUrl ? "Send Announcement" : "No Webhook")}
              {status === "sending" && "Sending..."}
              {status === "success" && "Sent!"}
              {status === "error" && "Failed - Retry"}
            </button>

            <button
              onClick={() => setIsExpanded(false)}
              className="px-2 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {status === "success" && (
          <p className="text-xs text-green-600 mt-2">
            Announcement sent! This button will auto-remove in a few seconds.
          </p>
        )}
      </div>
    );
  };

  const rollSpellAttack = async () => {
    if (!character || isRolling) return;

    const spellcastingAbility = getSpellcastingAbility(character.castingStyle);
    if (!spellcastingAbility) return;

    setIsRolling(true);

    try {
      const spellcastingModifier = getSpellcastingAbilityModifier(character);
      const totalModifier = character.proficiencyBonus + spellcastingModifier;

      const rollValue = Math.floor(Math.random() * 20) + 1;
      const total = rollValue + totalModifier;

      const isCriticalSuccess = rollValue === 20;
      const isCriticalFailure = rollValue === 1;

      showRollResult({
        title: "Spell Attack Roll",
        rollValue: rollValue,
        modifier: totalModifier,
        total: total,
        isCriticalSuccess: isCriticalSuccess,
        isCriticalFailure: isCriticalFailure,
        type: "spellattack",
        description: `d20 + ${character.proficiencyBonus} (Prof) + ${spellcastingModifier} (${spellcastingAbility}) = ${total}`,
      });
      if (discordWebhookUrl) {
        const embed = {
          title: `${character.name} - Spell Attack Roll`,
          color: isCriticalSuccess
            ? 0x00ff00
            : isCriticalFailure
            ? 0xff0000
            : 0x10b981,
          fields: [
            {
              name: "Roll",
              value: `d20: ${rollValue}`,
              inline: true,
            },
            {
              name: "Modifiers",
              value: `Prof: +${
                character.proficiencyBonus
              }, ${spellcastingAbility}: ${formatModifier(
                spellcastingModifier
              )}`,
              inline: true,
            },
            {
              name: "Total",
              value: `${total}`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Spell Attack Roll",
          },
        };

        if (isCriticalSuccess) {
          embed.description = "🌟 **Critical Hit!**";
        } else if (isCriticalFailure) {
          embed.description = "💥 **Critical Miss!**";
        }

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
          });
        } catch (discordError) {
          console.error("Error sending to Discord:", discordError);
        }
      }
    } catch (error) {
      console.error("Error rolling spell attack:", error);
      alert("Error rolling dice. Please try again.");
    } finally {
      setIsRolling(false);
    }
  };

  const getArmorClassModifier = useCallback((effectiveAbilityScores) => {
    return Math.floor((effectiveAbilityScores.dexterity - 10) / 2) || 0;
  }, []);

  const getInitiativeModifier = useCallback(
    (initiativeAbility, effectiveAbilityScores) => {
      if (initiativeAbility === "intelligence") {
        return Math.floor((effectiveAbilityScores.intelligence - 10) / 2) || 0;
      }

      return Math.floor((effectiveAbilityScores.dexterity - 10) / 2) || 0;
    },
    []
  );

  const getHPColor = (character) => {
    const currentHP = character.currentHitPoints ?? character.hitPoints;
    const maxHP = character.maxHitPoints || character.hitPoints;
    const percentage = currentHP / maxHP;

    if (percentage <= 0.25) return "#EF4444";
    if (percentage <= 0.5) return "#F59E0B";
    if (percentage <= 0.75) return "#EAB308";
    return "#10B981";
  };

  const getEnhancedHPStyle = (character, baseStyle) => {
    const currentHP = character.currentHitPoints ?? character.hitPoints;
    const maxHP = character.maxHitPoints || character.hitPoints;
    const hpColor = getHPColor(character);

    return {
      ...baseStyle,
      color: hpColor,
      backgroundColor:
        currentHP === maxHP ? baseStyle.backgroundColor : `${hpColor}10`,
      borderColor: hpColor,
      transition: "all 0.2s ease",
      position: "relative",
      userSelect: "none",
    };
  };

  const calculateEffectiveAbilityScores = useCallback(
    (baseScores, asiChoices) => {
      const effectiveScores = { ...baseScores };
      Object.entries(asiChoices).forEach(([level, choice]) => {
        if (choice.type === "asi" && choice.abilityScoreIncreases) {
          choice.abilityScoreIncreases.forEach((increase) => {
            if (effectiveScores[increase.ability] !== undefined) {
              effectiveScores[increase.ability] =
                (effectiveScores[increase.ability] || 10) + 1;
            }
          });
        }
      });
      return effectiveScores;
    },
    []
  );

  const getAllCharacterFeats = useCallback((standardFeats, asiChoices) => {
    const allFeats = [...standardFeats];

    Object.entries(asiChoices).forEach(([level, choice]) => {
      if (choice.type === "feat" && choice.selectedFeat) {
        allFeats.push(`${choice.selectedFeat} (Level ${level})`);
      }
    });

    return allFeats;
  }, []);

  const transformSkillData = useCallback(
    (skillProficiencies = [], skillExpertise = []) => {
      const skillMap = {
        Athletics: "athletics",
        Acrobatics: "acrobatics",
        "Sleight of Hand": "sleightOfHand",
        Stealth: "stealth",
        Herbology: "herbology",
        "History of Magic": "historyOfMagic",
        Investigation: "investigation",
        "Magical Theory": "magicalTheory",
        "Muggle Studies": "muggleStudies",
        Insight: "insight",
        "Magical Creatures": "magicalCreatures",
        Medicine: "medicine",
        Perception: "perception",
        "Potion Making": "potionMaking",
        Survival: "survival",
        Deception: "deception",
        Intimidation: "intimidation",
        Performance: "performance",
        Persuasion: "persuasion",
      };

      const skills = {};

      Object.values(skillMap).forEach((skill) => {
        skills[skill] = 0;
      });

      skillProficiencies.forEach((skillName) => {
        const mappedSkill = skillMap[skillName];
        if (mappedSkill) {
          skills[mappedSkill] = 1;
        }
      });

      skillExpertise.forEach((skillName) => {
        const mappedSkill = skillMap[skillName];
        if (mappedSkill) {
          skills[mappedSkill] = 2;
        }
      });

      return skills;
    },
    []
  );

  const fetchCharacterDetails = useCallback(async () => {
    if (!selectedCharacter?.id) {
      setCharacter(null);
      return;
    }

    setCharacterLoading(true);
    setError(null);

    try {
      let data, error;

      if (adminMode && isUserAdmin) {
        const response = await supabase
          .from("characters")
          .select(
            `
        *, 
        initiative_ability,
        character_resources (
          corruption_points,
          sorcery_points,
          max_sorcery_points,
          spell_slots_1,
          spell_slots_2,
          spell_slots_3,
          spell_slots_4,
          spell_slots_5,
          spell_slots_6,
          spell_slots_7,
          spell_slots_8,
          spell_slots_9,
          max_spell_slots_1,
          max_spell_slots_2,
          max_spell_slots_3,
          max_spell_slots_4,
          max_spell_slots_5,
          max_spell_slots_6,
          max_spell_slots_7,
          max_spell_slots_8,
          max_spell_slots_9
        )
      `
          )
          .eq("id", selectedCharacter.id)
          .single();

        data = response.data;
        error = response.error;
      } else {
        const response = await supabase
          .from("characters")
          .select(
            `
        *, 
        initiative_ability,
        character_resources (
          corruption_points,
          sorcery_points,
          max_sorcery_points,
          spell_slots_1,
          spell_slots_2,
          spell_slots_3,
          spell_slots_4,
          spell_slots_5,
          spell_slots_6,
          spell_slots_7,
          spell_slots_8,
          spell_slots_9,
          max_spell_slots_1,
          max_spell_slots_2,
          max_spell_slots_3,
          max_spell_slots_4,
          max_spell_slots_5,
          max_spell_slots_6,
          max_spell_slots_7,
          max_spell_slots_8,
          max_spell_slots_9
        )
      `
          )
          .eq("id", selectedCharacter.id)
          .eq("discord_user_id", discordUserId)
          .single();

        data = response.data;
        error = response.error;
      }

      if (error) throw error;

      if (data) {
        const baseAbilityScores = data.ability_scores || {};
        const asiChoices = data.asi_choices || {};
        const effectiveAbilityScores = calculateEffectiveAbilityScores(
          baseAbilityScores,
          asiChoices
        );

        const allFeats = getAllCharacterFeats(
          data.standard_feats || [],
          asiChoices
        );

        const resources = data.character_resources?.[0] || {};

        const transformedCharacter = {
          id: data.id,
          abilityScores: data.ability_scores,
          allFeats: allFeats,
          armorClass:
            getBaseArmorClass(data.casting_style) +
            getArmorClassModifier(effectiveAbilityScores),

          asiChoices: asiChoices,
          background: data.background || "Unknown",
          baseAbilityScores: baseAbilityScores,
          bloodStatus: data.innate_heritage || "Unknown",
          castingStyle: data.casting_style,
          charisma: effectiveAbilityScores.charisma || 10,
          constitution: effectiveAbilityScores.constitution || 10,
          currentHitDice: data.current_hit_dice || data.level,
          currentHitPoints: data.current_hit_points ?? (data.hit_points || 1),
          dexterity: effectiveAbilityScores.dexterity || 10,
          gameSession: data.game_session || "",
          hitDie: getHitDie(data.casting_style),
          hitPoints: data.hit_points || 1,
          house: data.house,
          houseChoices: data.house_choices || {},
          imageUrl: data.image_url || "",
          initiativeAbility: data.initiative_ability,
          initiativeModifier: getInitiativeModifier(
            data.initiative_ability,
            effectiveAbilityScores
          ),
          initiative: 8,
          innateHeritage: data.innate_heritage,
          intelligence: effectiveAbilityScores.intelligence || 10,
          level: data.level,
          magicModifiers: data.magic_modifiers || {},
          maxHitDice: data.level,
          maxHitPoints: data.hit_points || 1,
          name: data.name,
          proficiencyBonus: Math.ceil(data.level / 4) + 1,
          skillExpertise: data.skill_expertise || [],
          skillProficiencies: data.skill_proficiencies || [],
          skills: transformSkillData(
            data.skill_proficiencies || [],
            data.skill_expertise || []
          ),

          spellSlots1: resources.spell_slots_1 || 0,
          spellSlots2: resources.spell_slots_2 || 0,
          spellSlots3: resources.spell_slots_3 || 0,
          spellSlots4: resources.spell_slots_4 || 0,
          spellSlots5: resources.spell_slots_5 || 0,
          spellSlots6: resources.spell_slots_6 || 0,
          spellSlots7: resources.spell_slots_7 || 0,
          spellSlots8: resources.spell_slots_8 || 0,
          spellSlots9: resources.spell_slots_9 || 0,

          maxSpellSlots1: resources.max_spell_slots_1 || 0,
          maxSpellSlots2: resources.max_spell_slots_2 || 0,
          maxSpellSlots3: resources.max_spell_slots_3 || 0,
          maxSpellSlots4: resources.max_spell_slots_4 || 0,
          maxSpellSlots5: resources.max_spell_slots_5 || 0,
          maxSpellSlots6: resources.max_spell_slots_6 || 0,
          maxSpellSlots7: resources.max_spell_slots_7 || 0,
          maxSpellSlots8: resources.max_spell_slots_8 || 0,
          maxSpellSlots9: resources.max_spell_slots_9 || 0,

          corruptionPoints: resources.corruption_points || 0,
          sorceryPoints: resources.sorcery_points || 0,
          maxSorceryPoints: resources.max_sorcery_points || 0,

          speed: 30,
          standardFeats: data.standard_feats || [],
          strength: effectiveAbilityScores.strength || 10,
          subclass: data.subclass,
          subclassChoices: data.subclass_choices || {},
          wand: data.wand_type || "Unknown wand",
          wandType: data.wand_type,
          wisdom: effectiveAbilityScores.wisdom || 10,
          year: `Level ${data.level}`,

          ownerId: data.discord_user_id,
        };

        setCharacter(transformedCharacter);
      }
    } catch (err) {
      console.error("Error fetching character:", err);
      setError(err.message);
    } finally {
      setCharacterLoading(false);
    }
  }, [
    selectedCharacter?.id,
    supabase,
    adminMode,
    isUserAdmin,
    discordUserId,
    calculateEffectiveAbilityScores,
    getAllCharacterFeats,
    getBaseArmorClass,
    getArmorClassModifier,
    getHitDie,
    getInitiativeModifier,
    transformSkillData,
  ]);

  useEffect(() => {
    fetchCharacterDetails();
  }, [
    selectedCharacter?.id,
    discordUserId,
    supabase,
    adminMode,
    isUserAdmin,
    fetchCharacterDetails,
  ]);

  const handleShortRestClick = () => {
    if (!character || character.currentHitDice <= 0) {
      alert("No hit dice available for short rest!");
      return;
    }
    setSelectedHitDiceCount(1);
    setShowHitDiceModal(true);
  };

  const handleLongRest = async () => {
    if (!character) return;

    const currentHP = character.currentHitPoints ?? character.hitPoints;
    const maxHP = character.maxHitPoints || character.hitPoints;
    const currentHitDice = character.currentHitDice;
    const maxHitDice = character.maxHitDice;

    const hasSpellSlots = [1, 2, 3, 4, 5, 6, 7, 8, 9].some(
      (level) => (character?.[`maxSpellSlots${level}`] || 0) > 0
    );

    if (currentHP >= maxHP && currentHitDice >= maxHitDice && !hasSpellSlots) {
      alert("Character is already at full health and hit dice!");
      return;
    }

    const confirmed = window.confirm(
      `Take a long rest for ${
        character.name
      }?\n\nThis will restore:\n• HP: ${currentHP} → ${maxHP}\n• Hit Dice: ${currentHitDice} → ${maxHitDice}${
        hasSpellSlots ? "\n• All Spell Slots" : ""
      }`
    );
    if (!confirmed) return;

    setIsLongResting(true);

    try {
      const hpRestored = maxHP - currentHP;
      const hitDiceRestored = maxHitDice - currentHitDice;

      const { error: characterError } = await supabase
        .from("characters")
        .update({
          current_hit_points: maxHP,
          current_hit_dice: maxHitDice,
          updated_at: new Date().toISOString(),
        })
        .eq("id", character.id)
        .eq("discord_user_id", discordUserId);

      if (characterError) {
        console.error("Error updating character:", characterError);
        alert("Failed to update character data");
        return;
      }

      if (hasSpellSlots) {
        const spellSlotUpdates = {
          character_id: character.id,
          discord_user_id: discordUserId,
          updated_at: new Date().toISOString(),
        };

        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((level) => {
          const maxSlots = character?.[`maxSpellSlots${level}`] || 0;
          if (maxSlots > 0) {
            spellSlotUpdates[`spell_slots_${level}`] = maxSlots;
          }
        });

        const { error: resourcesError } = await supabase
          .from("character_resources")
          .upsert(spellSlotUpdates, {
            onConflict: "character_id,discord_user_id",
          });

        if (resourcesError) {
          console.error("Error updating spell slots:", resourcesError);
        }
      }

      showRollResult({
        title: `Long Rest Complete`,
        rollValue: hpRestored + hitDiceRestored,
        modifier: 0,
        total: hpRestored + hitDiceRestored,
        isCriticalSuccess: false,
        isCriticalFailure: false,
        type: "longrest",
        description: `${hpRestored} HP restored • ${hitDiceRestored} Hit Dice restored${
          hasSpellSlots ? " • All spell slots restored" : ""
        } • ${character.name} is fully rested!`,
      });

      if (discordWebhookUrl) {
        const embed = {
          title: `${character.name} completed a Long Rest!`,
          color: 0x3b82f6,
          fields: [
            {
              name: "HP Restored",
              value: `${hpRestored} HP`,
              inline: true,
            },
            {
              name: "Hit Dice Restored",
              value: `${hitDiceRestored} × ${character.hitDie}`,
              inline: true,
            },
            {
              name: "Current Status",
              value: `${maxHP}/${maxHP} HP • ${maxHitDice}/${maxHitDice} Hit Dice${
                hasSpellSlots ? " • All spell slots restored" : ""
              }`,
              inline: false,
            },
          ],
          description: "💤 **Fully rested and ready for adventure!**",
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Long Rest",
          },
        };

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
          });
        } catch (discordError) {
          console.error("Error sending to Discord:", discordError);
        }
      }

      await fetchCharacterDetails();
    } catch (error) {
      console.error("Error applying long rest:", error);
      alert("Error taking long rest. Please try again.");
    } finally {
      setIsLongResting(false);
    }
  };

  const handleDamageClick = () => {
    if (!character) return;
    setDamageAmount(0);
    setShowDamageModal(true);
  };

  const fullHeal = async () => {
    if (!character) return;

    const currentHP = character.currentHitPoints ?? character.hitPoints;
    const maxHP = character.maxHitPoints || character.hitPoints;

    if (currentHP >= maxHP) {
      alert("Character is already at full health!");
      return;
    }

    const confirmed = window.confirm(
      `Fully heal ${character.name}?\n\nHP: ${currentHP} → ${maxHP}`
    );
    if (!confirmed) return;

    try {
      const healingAmount = maxHP - currentHP;

      showRollResult({
        title: `Full Heal`,
        rollValue: healingAmount,
        modifier: 0,
        total: healingAmount,
        isCriticalSuccess: true,
        isCriticalFailure: false,
        type: "heal",
        description: `${healingAmount} HP restored • ${character.name} is at full health!`,
      });

      const { error } = await supabase
        .from("characters")
        .update({
          current_hit_points: maxHP,
          updated_at: new Date().toISOString(),
        })
        .eq("id", character.id)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error updating character:", error);
        alert("Failed to update character data");
        return;
      }

      if (discordWebhookUrl) {
        const embed = {
          title: `${character.name} was fully healed!`,
          color: 0x10b981,
          fields: [
            {
              name: "HP Restored",
              value: `${maxHP - currentHP} HP`,
              inline: true,
            },
            {
              name: "Current HP",
              value: `${maxHP}/${maxHP} (Full Health)`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Full Heal",
          },
        };

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
          });
        } catch (discordError) {
          console.error("Error sending to Discord:", discordError);
        }
      }

      await fetchCharacterDetails();
    } catch (error) {
      console.error("Error applying full heal:", error);
      alert("Error healing character. Please try again.");
    }
  };

  const handleCharacterUpdated = async (updatedCharacter) => {
    try {
      const { error } = await supabase
        .from("characters")
        .update({
          level: updatedCharacter.level,
          hit_points: updatedCharacter.hit_points || updatedCharacter.hitPoints,
          current_hit_points:
            updatedCharacter.hit_points || updatedCharacter.hitPoints,
          current_hit_dice: updatedCharacter.level,
          ability_scores:
            updatedCharacter.ability_scores || updatedCharacter.abilityScores,
          standard_feats:
            updatedCharacter.standard_feats || updatedCharacter.standardFeats,
          skill_proficiencies:
            updatedCharacter.skill_proficiencies ||
            updatedCharacter.skillProficiencies,
          asi_choices:
            updatedCharacter.asi_choices || updatedCharacter.asiChoices,
          updated_at: new Date().toISOString(),
        })
        .eq("id", character.id)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error updating character:", error);
        alert("Failed to save level up changes. Please try again.");
        return;
      }

      setShowLevelUp(false);
      await fetchCharacterDetails();

      alert(
        `${character.name} successfully leveled up to level ${updatedCharacter.level}!`
      );
    } catch (error) {
      console.error("Error saving character:", error);
      alert("Failed to save level up changes. Please try again.");
    }
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>Error Loading Character</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>No Characters Found</h2>
          <p>
            You haven't created any characters yet. Go to Character Creation to
            get started!
          </p>
        </div>
      </div>
    );
  }

  if (!selectedCharacter) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>No Character Selected</h2>
          <p>
            Please select a character from the dropdown above to view their
            sheet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{pulseKeyframes}</style>
      <div style={{ ...styles.container, ...{ className } }}>
        {characterLoading && (
          <div style={styles.loadingContainer}>
            <h3>Loading Character Sheet...</h3>
          </div>
        )}
        {adminMode &&
          isUserAdmin &&
          selectedCharacter?.ownerId !== discordUserId && (
            <div
              style={{
                background: "linear-gradient(135deg, #ff6b6b, #ffa500)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                marginBottom: "16px",
                textAlign: "center",
                fontWeight: "bold",
                border: "2px solid #ff4757",
              }}
            >
              ADMIN MODE: Viewing {selectedCharacter.name} (Session:{" "}
              {selectedCharacter?.gameSession || "Unknown"})
            </div>
          )}
        {character && !characterLoading && (
          <>
            <div style={styles.headerCard}>
              <div style={styles.headerFlex}>
                <div style={styles.avatar}>
                  {character.imageUrl ? (
                    <img
                      src={character.imageUrl}
                      alt={`${character.name}'s portrait`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <User
                    className="w-8 h-8 text-indigo-600"
                    style={{
                      display: character.imageUrl ? "none" : "flex",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h1 style={styles.characterName}>{character.name}</h1>
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginBottom: "18px",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "#9d4edd",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor:
                            character.currentHitDice <= 0
                              ? "not-allowed"
                              : "pointer",
                          fontSize: "14px",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          opacity: character.currentHitDice <= 0 ? 0.6 : 1,
                          transition: "all 0.2s ease",
                          minWidth: "140px",
                          justifyContent: "center",
                          width: "160px",
                          height: "40px",
                        }}
                        onClick={handleShortRestClick}
                        disabled={character.currentHitDice <= 0}
                        title={`Use hit dice to recover HP during a short rest (${character.currentHitDice} dice available)`}
                      >
                        <Coffee size={16} />
                        Short Rest
                      </button>
                      <button
                        style={{
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: isLongResting ? "wait" : "pointer",
                          fontSize: "14px",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          opacity: isLongResting ? 0.7 : 1,
                          transition: "all 0.2s ease",
                          minWidth: "140px",
                          justifyContent: "center",
                          width: "160px",
                          height: "40px",
                        }}
                        onClick={handleLongRest}
                        disabled={isLongResting}
                        title="Restore all HP and hit dice with a long rest"
                      >
                        <Moon size={16} />
                        {isLongResting ? "Resting..." : "Long Rest"}
                      </button>
                      <button
                        style={{
                          backgroundColor: "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "all 0.2s ease",
                          width: "160px",
                          height: "40px",
                          justifyContent: "center",
                        }}
                        onClick={() => setShowLevelUp(true)}
                        title={`Level up ${character.name} to level ${
                          (character.level || 1) + 1
                        }`}
                      >
                        <TrendingUp size={16} />
                        Level Up
                      </button>
                      {isUserAdmin && (
                        <DiscordAnnouncementButton character={character} />
                      )}
                    </div>
                  </div>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>House:</span> {character.house}
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Level:</span> {character.year}
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Class:</span>{" "}
                      {character.castingStyle}
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Spell Casting Ability:</span>{" "}
                      {getSpellcastingAbility(character.castingStyle)}
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Subclass:</span>{" "}
                      {character.subclass || "None"}
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Background:</span>{" "}
                      {character.background}
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Heritage:</span>{" "}
                      {character.bloodStatus}
                    </div>
                    {character.gameSession && (
                      <div style={styles.infoItem}>
                        <span style={styles.label}>Game Session:</span>{" "}
                        {character.gameSession}
                      </div>
                    )}
                    {character.castingStyle === "Intellect Caster" && (
                      <div style={styles.infoItem}>
                        <span style={styles.label}>Initiative Ability:</span>{" "}
                        {character.initiativeAbility === "intelligence"
                          ? "Intelligence"
                          : "Dexterity"}
                      </div>
                    )}
                    <div style={{ ...styles.infoItem, gridColumn: "span 2" }}>
                      <span style={styles.label}>Wand:</span> {character.wand}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  ...styles.combatStats,
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "12px",
                }}
              >
                {/* Enhanced HP Tile */}
                <div
                  style={{
                    ...getEnhancedHPStyle(character, {
                      ...styles.statCard,
                      ...styles.statCardRed,
                      cursor: "pointer",
                    }),
                  }}
                  onClick={handleDamageClick}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    fullHeal();
                  }}
                  title="Left click to manage HP • Right click to full heal"
                >
                  <Heart
                    className="w-6 h-6 mx-auto mb-1"
                    style={{ color: getHPColor(character) }}
                  />
                  <div
                    style={{
                      ...styles.statValue,
                      color: getHPColor(character),
                      fontSize:
                        character.currentHitPoints !==
                        (character.maxHitPoints ?? character.hitPoints)
                          ? "1rem"
                          : "1.25rem",
                    }}
                  >
                    {character.currentHitPoints ?? character.hitPoints}/
                    {character.maxHitPoints ?? character.hitPoints}
                  </div>
                  <div
                    style={{
                      ...styles.statLabel,
                      ...styles.statLabelRed,
                      color: getHPColor(character),
                    }}
                  >
                    Hit Points
                  </div>
                  {/* Unconscious indicator */}
                  {(character.currentHitPoints ?? character.hitPoints) ===
                    0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "#EF4444",
                        color: "white",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        animation: "pulse 2s infinite",
                      }}
                    >
                      💀
                    </div>
                  )}
                  {/* Low health warning */}
                  {(character.currentHitPoints ?? character.hitPoints) > 0 &&
                    (character.currentHitPoints ?? character.hitPoints) /
                      (character.maxHitPoints ?? character.hitPoints) <=
                      0.25 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-4px",
                          right: "-4px",
                          background: "#EF4444",
                          color: "white",
                          borderRadius: "50%",
                          width: "16px",
                          height: "16px",
                          fontSize: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                        }}
                      >
                        !
                      </div>
                    )}
                </div>

                {/* Initiative Tile */}
                <div
                  style={{ ...styles.statCard, ...styles.statCardBrown }}
                  onClick={() =>
                    !isRolling &&
                    rollInitiative({
                      character,
                      isRolling,
                      setIsRolling,
                      characterModifiers,
                    })
                  }
                >
                  <Swords
                    className="w-6 h-6 text-green-600 mx-auto mb-1"
                    style={{ color: "#755224" }}
                  />
                  <div
                    style={{ ...styles.statValue, ...styles.statValueBrown }}
                  >
                    {formatModifier(character.initiativeModifier)}
                  </div>
                  <div
                    style={{ ...styles.statLabel, ...styles.statLabelBrown }}
                  >
                    Initiative
                  </div>
                </div>
                {/* Spell Attack Tile (Clickable) */}
                {getSpellcastingAbility(character.castingStyle) && (
                  <div
                    style={{
                      ...styles.statCard,
                      cursor: isRolling ? "wait" : "pointer",
                      borderColor: "#e30716",
                      backgroundColor: isRolling
                        ? // eslint-disable-next-line
                          "#e30716" + "20"
                        : "transparent",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => !isRolling && rollSpellAttack()}
                    title={`Click to roll spell attack: d20 + Prof (${
                      character.proficiencyBonus
                    }) + ${getSpellcastingAbility(
                      character.castingStyle
                    )} (${formatModifier(
                      getSpellcastingAbilityModifier(character)
                    )})`}
                  >
                    <Target
                      className="w-6 h-6 text-green-600 mx-auto mb-1"
                      style={{ color: "#e30716" }}
                    />
                    <div style={{ ...styles.statValue, color: "#e30716" }}>
                      {formatModifier(
                        character.proficiencyBonus +
                          getSpellcastingAbilityModifier(character)
                      )}
                    </div>
                    <div style={{ ...styles.statLabel, color: "#e30716" }}>
                      Spell Attack
                    </div>
                  </div>
                )}

                {/* Spellcasting Ability Check Tile (Clickable) */}
                {getSpellcastingAbility(character.castingStyle) && (
                  <div
                    style={{
                      ...styles.statCard,
                      cursor: isRolling ? "wait" : "pointer",
                      borderColor: "#8b5cf6",
                      backgroundColor: isRolling
                        ? // eslint-disable-next-line
                          "#8b5cf6" + "20"
                        : "transparent",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => !isRolling && rollSpellcastingAbilityCheck()}
                    title={`Click to roll ${getSpellcastingAbility(
                      character.castingStyle
                    )} ability check (no proficiency): d20 + ${formatModifier(
                      getSpellcastingAbilityModifier(character)
                    )}`}
                  >
                    <Sparkles
                      className="w-6 h-6 text-yellow-600 mx-auto mb-1"
                      style={{ color: "#8b5cf6" }}
                    />
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        color: "#8b5cf6",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {formatModifier(
                        getSpellcastingAbilityModifier(character)
                      )}
                    </div>
                    <div style={{ ...styles.statLabel, color: "#8b5cf6" }}>
                      {" "}
                      Spellcasting Ability Check (
                      {getSpellcastingAbility(character.castingStyle)
                        ?.slice(0, 3)
                        .toUpperCase()}
                      )
                    </div>
                  </div>
                )}

                {/* Armor Class Tile */}
                <div
                  style={{
                    ...styles.statCard,
                    ...styles.statCardBlue,
                    cursor: "default",
                    border: "none",
                  }}
                >
                  <Shield
                    className="w-6 h-6 text-blue-600 mx-auto mb-1"
                    style={{ color: "#3b82f6" }}
                  />
                  <div style={{ ...styles.statValue, ...styles.statValueBlue }}>
                    {character.armorClass}
                  </div>
                  <div style={{ ...styles.statLabel, ...styles.statLabelBlue }}>
                    Armor Class
                  </div>
                </div>

                {/* Hit Dice Tile */}
                <div
                  style={{
                    ...styles.statCard,
                    ...styles.statCardPurple,
                    cursor: "default",
                    border: "none",
                  }}
                  title={`Hit Dice: ${character.hitDie}. Use Short Rest button to recover HP.`}
                >
                  <Dices className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <div
                    style={{ ...styles.statValue, ...styles.statValuePurple }}
                  >
                    {character.currentHitDice}/{character.maxHitDice}
                  </div>
                  <div
                    style={{ ...styles.statLabel, ...styles.statLabelPurple }}
                  >
                    Hit Dice ({character.hitDie})
                  </div>
                </div>

                {/* Proficiency Tile */}
                <div
                  style={{
                    ...styles.statCard,
                    cursor: "default",
                    border: "none",
                  }}
                  title="Your proficiency bonus - added to skills, saving throws, and attacks you're proficient with"
                >
                  <Star
                    size={24}
                    style={{
                      color: theme.warning || "#f59e0b",
                      marginBottom: "4px",
                      display: "block",
                      margin: "0 auto 4px auto",
                    }}
                  />
                  <div
                    style={{
                      ...styles.statValue,
                      color: theme.warning || "#d97706",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      marginBottom: "0.25rem",
                    }}
                  >
                    +{character.proficiencyBonus || 0}
                  </div>
                  <div
                    style={{
                      ...styles.statLabel,
                      color: theme.warning || "#92400e",
                      fontSize: "0.875rem",
                    }}
                  >
                    Proficiency
                  </div>
                </div>

                {/* Spell Save DC Tile (Plain) */}
                {getSpellcastingAbility(character.castingStyle) && (
                  <div
                    style={{
                      ...styles.statCard,
                      cursor: "default",
                      border: "none",
                    }}
                    title={`Spell Save DC: 8 + Prof (${
                      character.proficiencyBonus
                    }) + ${getSpellcastingAbility(
                      character.castingStyle
                    )} (${formatModifier(
                      getSpellcastingAbilityModifier(character)
                    )})`}
                  >
                    <Shield
                      className="w-6 h-6 text-purple-600 mx-auto mb-1"
                      style={{ color: "#8b5cf6" }}
                    />
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        color: "#8b5cf6",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {8 +
                        character.proficiencyBonus +
                        getSpellcastingAbilityModifier(character)}
                    </div>
                    <div style={{ ...styles.statLabel, color: "#8b5cf6" }}>
                      Spell Save DC
                    </div>
                  </div>
                )}
              </div>
            </div>

            <AbilityScores
              character={character}
              discordWebhookUrl={discordWebhookUrl}
            />

            {/* IMPROVED LAYOUT SECTION */}
            <div style={getCharacterSheetLayoutStyles(theme)}>
              {/* Left side - Skills */}
              <Skills
                character={character}
                supabase={supabase}
                discordUserId={discordUserId}
                setCharacter={setCharacter}
                selectedCharacterId={selectedCharacter.id}
                isRolling={isRolling}
                modifiers={modifiers(character)}
              />
              {/* Right side - Corruption, Sorcery Points, and Dice Roller stacked */}
              <div style={getRightSideStackStyles(theme)}>
                <FlexibleDiceRoller
                  title="Custom Roll"
                  description={`Rolling for ${character.name}`}
                  character={character}
                />
                <SpellSlotTracker
                  character={character}
                  supabase={supabase}
                  discordUserId={discordUserId}
                  setCharacter={setCharacter}
                  selectedCharacterId={selectedCharacter.id}
                />
                <SorceryPointTracker
                  key="sorcery-points"
                  character={character}
                  supabase={supabase}
                  discordUserId={discordUserId}
                  setCharacter={setCharacter}
                  selectedCharacterId={selectedCharacter.id}
                />
                <CorruptionTracker
                  character={character}
                  supabase={supabase}
                  discordUserId={discordUserId}
                  setCharacter={setCharacter}
                  selectedCharacterId={selectedCharacter.id}
                />
              </div>
            </div>
          </>
        )}

        <CharacterSheetModals
          character={character}
          theme={theme}
          discordUserId={discordUserId}
          supabase={supabase}
          discordWebhookUrl={discordWebhookUrl}
          characterModifiers={characterModifiers}
          showRollResult={showRollResult}
          fetchCharacterDetails={fetchCharacterDetails}
          showHitDiceModal={showHitDiceModal}
          setShowHitDiceModal={setShowHitDiceModal}
          selectedHitDiceCount={selectedHitDiceCount}
          setSelectedHitDiceCount={setSelectedHitDiceCount}
          isRollingHitDice={isRollingHitDice}
          setIsRollingHitDice={setIsRollingHitDice}
          showDamageModal={showDamageModal}
          setShowDamageModal={setShowDamageModal}
          damageAmount={damageAmount}
          setDamageAmount={setDamageAmount}
          isApplyingDamage={isApplyingDamage}
          setIsApplyingDamage={setIsApplyingDamage}
        />

        {showLevelUp && character && (
          <LevelUpModal
            character={character}
            isOpen={showLevelUp}
            onSave={handleCharacterUpdated}
            onCancel={() => setShowLevelUp(false)}
            user={user}
            supabase={supabase}
          />
        )}
      </div>
    </>
  );
};

export default CharacterSheet;
