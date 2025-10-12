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
  Plus,
} from "lucide-react";
import { Skills } from "./Skills/Skills";
import AbilityScores from "../AbilityScores/AbilityScores";
import CharacterSheetModals from "./CharacterSheetModals";
import { modifiers, formatModifier } from "./utils";
import { useTheme } from "../../contexts/ThemeContext";
import { getCharacterSheetStyles } from "../../styles/masterStyles";
import { useRollFunctions, useRollModal } from "../utils/diceRoller";
import { useCallback } from "react";
import { getDiscordWebhook } from "../../App/const";
import {
  sendDiscordRollWebhook,
  getRollResultColor,
  ROLL_COLORS,
} from "../utils/discordWebhook";
import InspirationTracker from "./InspirationTracker";
import LuckPointButton from "./LuckPointButton";
import CorruptionButton from "./CorruptionButton";
import CharacterTabbedPanel from "./CharacterTabbedPanel";
import ACOverrideModal from "./ACOverrideModal";
import SpellAttackModal from "./SpellAttackModal";
import SpellAttackRollModal from "./SpellAttackRollModal";
import InitiativeOverrideModal from "./InitiativeOverrideModal";
import {
  getAllAbilityModifiers,
  calculateFinalAbilityScores,
} from "../CharacterManager/utils/characterUtils";
import {
  backgroundsData,
  subclassesData,
  standardFeats,
} from "../../SharedData";
import { calculateInitiativeWithFeats } from "../CharacterManager/utils/featBenefitsCalculator";
import { calculateHeritageModifiers } from "../CharacterManager/utils/utils";

const hitDiceData = {
  Willpower: "d10",
  "Willpower Caster": "d10",
  Technique: "d6",
  "Technique Caster": "d6",
  Intellect: "d8",
  "Intellect Caster": "d8",
  Vigor: "d12",
  "Vigor Caster": "d12",
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
  gridTemplateColumns: "1fr 2fr",
  gap: "24px",
  alignItems: "start",
  marginBottom: "20px",
  width: "100%",
});

const CharacterSheet = ({
  user,
  supabase,
  selectedCharacter,
  characters,
  className = "",
  adminMode = false,
  isUserAdmin = false,
  onNavigateToCharacterManagement,
}) => {
  const { rollInitiative } = useRollFunctions();
  const { showRollResult } = useRollModal();

  const { theme } = useTheme();
  const styles = getCharacterSheetStyles(theme);
  const discordUserId = user?.user_metadata?.provider_id;

  const [character, setCharacter] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showHitDiceModal, setShowHitDiceModal] = useState(false);
  const [selectedHitDiceCount, setSelectedHitDiceCount] = useState(1);
  const [isRollingHitDice, setIsRollingHitDice] = useState(false);
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [damageAmount, setDamageAmount] = useState(0);
  const [isApplyingDamage, setIsApplyingDamage] = useState(false);
  const [isLongResting, setIsLongResting] = useState(false);
  const [showACModal, setShowACModal] = useState(false);
  const [showSpellAttackModal, setShowSpellAttackModal] = useState(false);
  const [showSpellAttackRollModal, setShowSpellAttackRollModal] =
    useState(false);
  const [showInitiativeModal, setShowInitiativeModal] = useState(false);
  const characterModifiers = modifiers(character);

  const [characterLoading, setCharacterLoading] = useState(false);
  const [error, setError] = useState(null);

  const discordWebhookUrl = getDiscordWebhook(character?.gameSession);

  const handleAvatarClick = () => {
    if (!character.imageUrl && onNavigateToCharacterManagement) {
      onNavigateToCharacterManagement(character.id, "basicInfo");
    }
  };

  const getHitDie = useCallback((castingStyle) => {
    return hitDiceData[castingStyle] || hitDiceData.default;
  }, []);
  const getBaseArmorClass = useCallback((castingStyle) => {
    const baseACMap = {
      Willpower: 13,
      "Willpower Caster": 15,
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
    const abilityScore =
      character.ability_scores?.[abilityKey] || character[abilityKey] || 10;
    return Math.floor((abilityScore - 10) / 2);
  };

  const getSpellAttackBonus = (character) => {
    const baseModifier = getSpellcastingAbilityModifier(character);
    const proficiencyBonus = character.proficiencyBonus || 0;
    const baseAttackBonus = proficiencyBonus + baseModifier;

    const attackData = character.spellAttack || { override: null, modifier: 0 };
    const override = attackData.override;
    const modifier = attackData.modifier || 0;

    if (override !== null && override !== undefined) {
      return override;
    }

    return baseAttackBonus + modifier;
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

      const rollResult = {
        d20Roll: rollValue,
        modifier: totalModifier,
        total: total,
        isCriticalSuccess: isCriticalSuccess,
        isCriticalFailure: isCriticalFailure,
      };

      showRollResult({
        title: "Spellcasting Ability Check",
        rollValue: rollValue,
        modifier: totalModifier,
        total: total,
        isCriticalSuccess: isCriticalSuccess,
        isCriticalFailure: isCriticalFailure,
        character: character,
        type: "abilitycheck",
        description: `d20 ${spellcastingModifier} (${spellcastingAbility}) = ${total}`,
      });

      const additionalFields = [
        {
          name: "Ability",
          value: `${spellcastingAbility}: ${formatModifier(
            spellcastingModifier
          )}`,
          inline: true,
        },
      ];

      const success = await sendDiscordRollWebhook({
        character,
        rollType: "Spellcasting Ability Check",
        title: "Spellcasting Ability Check",

        embedColor: getRollResultColor(
          rollResult,
          ROLL_COLORS.spellcastingCheck
        ),
        rollResult,
        fields: additionalFields,
        useCharacterAvatar: true,
      });

      if (!success) {
        console.error("Failed to send spellcasting ability check to Discord");
      }
    } catch (error) {
      console.error("Error rolling spellcasting ability check:", error);
      alert("Error rolling dice. Please try again.");
    } finally {
      setIsRolling(false);
    }
  };

  const rollSpellAttack = async (rollType = "normal", tempModifier = 0) => {
    if (!character || isRolling) return;

    const spellcastingAbility = getSpellcastingAbility(character.castingStyle);
    if (!spellcastingAbility) return;

    setIsRolling(true);

    try {
      const baseModifier = getSpellAttackBonus(character);
      const totalModifier = baseModifier + tempModifier;

      let rollValue;
      let rollDetails = "";

      if (rollType === "advantage") {
        const roll1 = Math.floor(Math.random() * 20) + 1;
        const roll2 = Math.floor(Math.random() * 20) + 1;
        rollValue = Math.max(roll1, roll2);
        rollDetails = `2d20 (${roll1}, ${roll2}) kh1`;
      } else if (rollType === "disadvantage") {
        const roll1 = Math.floor(Math.random() * 20) + 1;
        const roll2 = Math.floor(Math.random() * 20) + 1;
        rollValue = Math.min(roll1, roll2);
        rollDetails = `2d20 (${roll1}, ${roll2}) kl1`;
      } else {
        rollValue = Math.floor(Math.random() * 20) + 1;
        rollDetails = "1d20";
      }

      const total = rollValue + totalModifier;

      const isCriticalSuccess = rollValue === 20;
      const isCriticalFailure = rollValue === 1;

      const rollResult = {
        d20Roll: rollValue,
        modifier: totalModifier,
        total: total,
        isCriticalSuccess: isCriticalSuccess,
        isCriticalFailure: isCriticalFailure,
      };

      const spellcastingModifier = getSpellcastingAbilityModifier(character);

      const rollTypeText =
        rollType === "advantage"
          ? " (Advantage)"
          : rollType === "disadvantage"
          ? " (Disadvantage)"
          : "";

      showRollResult({
        title: `Spell Attack Roll${rollTypeText}`,
        rollValue: rollValue,
        modifier: totalModifier,
        total: total,
        isCriticalSuccess: isCriticalSuccess,
        isCriticalFailure: isCriticalFailure,
        character: character,
        type: "spellattack",
        description: `${rollDetails} + ${totalModifier} (Spell Attack) = ${total}`,
      });

      const additionalFields = [
        {
          name: "Modifiers",
          value: `Prof: +${
            character.proficiencyBonus
          }, ${spellcastingAbility}: ${formatModifier(spellcastingModifier)}${
            tempModifier !== 0 ? `, Temp: ${formatModifier(tempModifier)}` : ""
          }`,
          inline: true,
        },
      ];

      const success = await sendDiscordRollWebhook({
        character,
        rollType: "Spell Attack Roll",
        title: `Spell Attack Roll${rollTypeText}`,
        embedColor: getRollResultColor(rollResult, ROLL_COLORS.spell),
        rollResult,
        fields: additionalFields,
        useCharacterAvatar: true,
      });

      if (!success) {
        console.error("Failed to send spell attack to Discord");
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
    (initiativeAbility, effectiveAbilityScores, characterData) => {
      const initiativeData = characterData?.initiative || {
        modifier: 0,
        override: null,
      };

      if (
        initiativeData.override !== null &&
        initiativeData.override !== undefined
      ) {
        return initiativeData.override;
      }

      let baseModifier;
      if (initiativeAbility === "intelligence") {
        baseModifier =
          Math.floor((effectiveAbilityScores.intelligence - 10) / 2) || 0;
      } else {
        baseModifier =
          Math.floor((effectiveAbilityScores.dexterity - 10) / 2) || 0;
      }

      if (characterData) {
        baseModifier = calculateInitiativeWithFeats(
          characterData,
          baseModifier
        );
      }

      return baseModifier + (initiativeData.modifier || 0);
    },
    []
  );

  const getHPColor = (character) => {
    const currentHP = character.currentHitPoints ?? character.hitPoints;
    const maxHP = character.maxHitPoints ?? character.hitPoints;
    const percentage = currentHP / maxHP;

    if (percentage <= 0.25) return "#EF4444";
    if (percentage <= 0.5) return "#F59E0B";
    if (percentage <= 0.75) return "#EAB308";
    return "#10B981";
  };

  const getEnhancedHPStyle = (character, baseStyle) => {
    const currentHP = character.currentHitPoints ?? character.hitPoints;
    const maxHP = character.maxHitPoints ?? character.hitPoints;
    const hpColor = getHPColor(character);

    return {
      ...baseStyle,
      color: hpColor,
      backgroundColor:
        currentHP === maxHP ? baseStyle.backgroundColor : `${hpColor}20`,
      transition: "all 0.2s ease",
      position: "relative",
      userSelect: "none",
    };
  };

  const getAllCharacterFeats = useCallback((standardFeats, asiChoices) => {
    const allFeats = [...standardFeats];

    Object.entries(asiChoices).forEach(([level, choice]) => {
      if (choice.type === "feat" && choice.selectedFeat) {
        allFeats.push(`${choice.selectedFeat} (Level ${level})`);
      }
    });

    return allFeats;
  }, []);

  const getAutomaticSkillProficiencies = useCallback((characterData) => {
    const automaticProficiencies = [];
    const automaticExpertise = [];

    if (characterData.background) {
      const background = Object.values(backgroundsData).find(
        (bg) => bg.name === characterData.background
      );
      if (background?.skillProficiencies) {
        automaticProficiencies.push(...background.skillProficiencies);
      }
    }

    if (characterData.subclass && characterData.subclass_choices) {
      const subclassInfo = subclassesData[characterData.subclass];

      if (subclassInfo?.benefits?.skillProficiencies) {
        subclassInfo.benefits.skillProficiencies.forEach((prof) => {
          if (prof.type === "fixed") {
            automaticProficiencies.push(...prof.skills);
          }
        });
      }

      if (subclassInfo?.choices) {
        Object.entries(characterData.subclass_choices).forEach(
          ([level, choice]) => {
            const levelData = subclassInfo.choices[level];
            if (levelData?.options) {
              const selectedOption = levelData.options.find(
                (opt) => opt.name === choice
              );
              if (selectedOption?.benefits?.skillProficiencies) {
                selectedOption.benefits.skillProficiencies.forEach((prof) => {
                  if (prof.type === "fixed") {
                    automaticProficiencies.push(...prof.skills);

                    if (prof.expertise) {
                      prof.skills.forEach((skill) => {
                        if (
                          automaticProficiencies.includes(skill) ||
                          characterData.skill_proficiencies?.includes(skill)
                        ) {
                          automaticExpertise.push(skill);
                        }
                      });
                    }
                  }
                });
              }
            }
          }
        );
      }
    }

    if (characterData.standard_feats) {
      characterData.standard_feats.forEach((featName) => {
        const feat = standardFeats.find((f) => f.name === featName);
        if (feat?.benefits?.skillProficiencies) {
          feat.benefits.skillProficiencies.forEach((prof) => {
            if (typeof prof === "string") {
              automaticProficiencies.push(prof);
            } else if (prof.type === "fixed") {
              automaticProficiencies.push(...prof.skills);
            }
          });
        }
      });
    }

    return { automaticProficiencies, automaticExpertise };
  }, []);

  const transformSkillData = useCallback(
    (skillProficiencies = [], skillExpertise = [], characterData = {}) => {
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
        "Potion-making": "potionMaking",
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

      const { automaticProficiencies, automaticExpertise } =
        getAutomaticSkillProficiencies(characterData);

      const allProficiencies = [
        ...skillProficiencies,
        ...automaticProficiencies,
      ];

      allProficiencies.forEach((skillName) => {
        const mappedSkill = skillMap[skillName];
        if (mappedSkill && skills[mappedSkill] < 1) {
          skills[mappedSkill] = 1;
        }
      });

      const allExpertise = [...skillExpertise, ...automaticExpertise];

      allExpertise.forEach((skillName) => {
        const mappedSkill = skillMap[skillName];
        if (mappedSkill) {
          skills[mappedSkill] = 2;
        }
      });

      return skills;
    },
    [getAutomaticSkillProficiencies]
  );

  const canModifyCharacter = (
    character,
    adminMode,
    isUserAdmin,
    currentUserId
  ) => {
    if (character.discord_user_id === currentUserId) return true;

    if (adminMode && isUserAdmin) return true;

    return false;
  };

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
            max_spell_slots_9,
            inspiration,
            luck
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
            max_spell_slots_9,
            inspiration,
            luck
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
        const baseAbilityScores =
          data.base_ability_scores || data.ability_scores || {};
        const heritageChoices = data.heritage_choices || {};

        const effectiveAbilityScores = calculateFinalAbilityScores(data);

        const allFeats = getAllCharacterFeats(
          data.standard_feats || [],
          data.asi_choices || {}
        );

        const resources = data.character_resources?.[0] || {};

        const transformedCharacter = {
          abilityScores: effectiveAbilityScores,
          ac: data.ac || { override: null, modifier: 0 },
          spellAttack: data.spell_attack || { override: null, modifier: 0 },
          allFeats: allFeats,
          armorClass:
            getBaseArmorClass(data.casting_style) +
            getArmorClassModifier(effectiveAbilityScores),
          asiChoices: data.asi_choices || {},
          background: data.background || "Unknown",
          baseAbilityScores: baseAbilityScores,
          bloodStatus: data.innate_heritage || "Unknown",
          castingStyle: data.casting_style,
          charisma: effectiveAbilityScores.charisma || 10,
          constitution: effectiveAbilityScores.constitution || 10,
          corruptionPoints: resources.corruption_points || 0,
          currentHitDice: data.current_hit_dice || data.level,
          currentHitPoints: data.current_hit_points ?? (data.hit_points || 1),
          dexterity: effectiveAbilityScores.dexterity || 10,
          discord_user_id: data.discord_user_id,
          gameSession: data.game_session || "",
          hitDie: getHitDie(data.casting_style),
          hitPoints: data.hit_points || 1,
          maxHitPoints: data.hit_points || 1,
          house: data.house,
          houseChoices: data.house_choices || {},
          id: data.id,
          imageUrl: data.image_url || "",
          initiative: data.initiative || { modifier: 0, override: null },
          initiativeAbility: data.initiative_ability,
          initiativeModifier: getInitiativeModifier(
            data.initiative_ability,
            effectiveAbilityScores,
            data
          ),
          innateHeritage: data.innate_heritage,
          inspiration: resources.inspiration ?? 0,
          luck: resources.luck,
          intelligence: effectiveAbilityScores.intelligence || 10,
          level: data.level || 1,
          magicModifiers: data.magic_modifiers || {},
          maxHitDice: data.level,
          maxHitPoints: data.hit_points || 1,
          maxSorceryPoints: resources.max_sorcery_points || 0,
          maxSpellSlots1: resources.max_spell_slots_1 || 0,
          maxSpellSlots2: resources.max_spell_slots_2 || 0,
          maxSpellSlots3: resources.max_spell_slots_3 || 0,
          maxSpellSlots4: resources.max_spell_slots_4 || 0,
          maxSpellSlots5: resources.max_spell_slots_5 || 0,
          maxSpellSlots6: resources.max_spell_slots_6 || 0,
          maxSpellSlots7: resources.max_spell_slots_7 || 0,
          maxSpellSlots8: resources.max_spell_slots_8 || 0,
          maxSpellSlots9: resources.max_spell_slots_9 || 0,
          name: data.name,
          ownerId: data.discord_user_id,
          proficiencyBonus: Math.ceil(data.level / 4) + 1,
          schoolYear: data.school_year || null,
          skillExpertise: data.skill_expertise || [],
          skillProficiencies: data.skill_proficiencies || [],
          skills: transformSkillData(
            data.skill_proficiencies || [],
            data.skill_expertise || [],
            data
          ),
          sorceryPoints: resources.sorcery_points || 0,
          speed: 30,
          spellSlots1: resources.spell_slots_1 || 0,
          spellSlots2: resources.spell_slots_2 || 0,
          spellSlots3: resources.spell_slots_3 || 0,
          spellSlots4: resources.spell_slots_4 || 0,
          spellSlots5: resources.spell_slots_5 || 0,
          spellSlots6: resources.spell_slots_6 || 0,
          spellSlots7: resources.spell_slots_7 || 0,
          spellSlots8: resources.spell_slots_8 || 0,
          spellSlots9: resources.spell_slots_9 || 0,
          standardFeats: data.standard_feats || [],
          strength: effectiveAbilityScores.strength || 10,
          subclass: data.subclass,
          subclassChoices: data.subclass_choices || {},
          tempHP: data.temp_hp || 0,
          toolProficiencies: data.tool_proficiencies || [],
          wand: data.wand_type || "Unknown wand",
          wandType: data.wand_type,
          wisdom: effectiveAbilityScores.wisdom || 10,
          metamagicChoices: data.metamagic_choices || {},
          heritageChoices: heritageChoices,
          castingStyleChoices: data.casting_style_choices || {},
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

    if (!canModifyCharacter(character, adminMode, isUserAdmin, discordUserId)) {
      alert("You don't have permission to modify this character.");
      return;
    }

    const currentHP = character.currentHitPoints ?? character.hitPoints;
    const maxHP = character.maxHitPoints ?? character.hitPoints;
    const currentHitDice = character.currentHitDice;
    const maxHitDice = character.maxHitDice;

    const hasSpellSlots = [1, 2, 3, 4, 5, 6, 7, 8, 9].some(
      (level) => (character?.[`maxSpellSlots${level}`] || 0) > 0
    );

    if (currentHP >= maxHP && currentHitDice >= maxHitDice && !hasSpellSlots) {
      alert("Character is already at full health and hit dice!");
      return;
    }

    const hasLuckyFeat =
      character?.selectedFeats?.some((feat) =>
        typeof feat === "string" ? feat === "Lucky" : feat?.name === "Lucky"
      ) ||
      character?.feats?.some((feat) =>
        typeof feat === "string" ? feat === "Lucky" : feat?.name === "Lucky"
      ) ||
      character?.standardFeats?.some((feat) =>
        typeof feat === "string" ? feat === "Lucky" : feat?.name === "Lucky"
      );

    const confirmed = window.confirm(
      `Take a long rest for ${
        character.name
      }?\n\nThis will restore:\n• HP: ${currentHP} → ${maxHP}\n• Hit Dice: ${currentHitDice} → ${maxHitDice}${
        hasSpellSlots ? "\n• All Spell Slots" : ""
      }${hasLuckyFeat ? "\n• All Luck Points" : ""}`
    );
    if (!confirmed) return;

    setIsLongResting(true);

    try {
      const hpRestored = maxHP - currentHP;
      const hitDiceRestored = maxHitDice - currentHitDice;

      const characterOwnerId = character.discord_user_id || character.ownerId;

      const { error: characterError } = await supabase
        .from("characters")
        .update({
          current_hit_points: maxHP,
          current_hit_dice: maxHitDice,
          updated_at: new Date().toISOString(),
        })
        .eq("id", character.id)
        .eq("discord_user_id", characterOwnerId);

      if (characterError) {
        console.error("Error updating character:", characterError);
        alert("Failed to update character data");
        return;
      }

      const getProficiencyBonus = (level) => {
        if (level <= 4) return 2;
        if (level <= 8) return 3;
        if (level <= 12) return 4;
        if (level <= 16) return 5;
        return 6;
      };

      if (hasSpellSlots || hasLuckyFeat) {
        const resourceUpdates = {
          character_id: character.id,
          discord_user_id: characterOwnerId,
          updated_at: new Date().toISOString(),
        };

        if (hasSpellSlots) {
          [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((level) => {
            const maxSlots = character?.[`maxSpellSlots${level}`] || 0;
            if (maxSlots > 0) {
              resourceUpdates[`spell_slots_${level}`] = maxSlots;
            }
          });
        }

        if (hasLuckyFeat) {
          const maxLuckPoints = getProficiencyBonus(character?.level || 1);
          resourceUpdates.luck = maxLuckPoints;
        }

        const { error: resourcesError } = await supabase
          .from("character_resources")
          .upsert(resourceUpdates, {
            onConflict: "character_id,discord_user_id",
          });

        if (resourcesError) {
          console.error("Error updating resources:", resourcesError);
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

      const additionalFields = [
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
      ];

      const success = await sendDiscordRollWebhook({
        character,
        rollType: "Long Rest",
        title: "Long Rest Complete",
        embedColor: 0x3b82f6,
        rollResult: null,
        fields: additionalFields,
        useCharacterAvatar: true,
        description: "💤 **Fully rested and ready for adventure!**",
      });

      if (!success) {
        console.error("Failed to send long rest to Discord");
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
    const maxHP = character.maxHitPoints ?? character.hitPoints;

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
        character: character,
        description: `${healingAmount} HP restored • ${character.name} is at full health!`,
      });

      const characterOwnerId = character.discord_user_id || character.ownerId;

      let query = supabase
        .from("characters")
        .update({
          current_hit_points: maxHP,
          updated_at: new Date().toISOString(),
        })
        .eq("id", character.id);

      if (!(adminMode && isUserAdmin)) {
        query = query.eq("discord_user_id", discordUserId);
      }

      const { error } = await query;

      if (error) {
        console.error("Error updating character:", error);
        alert("Failed to update character data");
        return;
      }

      const additionalFields = [
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
      ];

      const success = await sendDiscordRollWebhook({
        character,
        rollType: "Full Heal",
        title: `${character.name} was fully healed!`,
        embedColor: 0x10b981,
        rollResult: null,
        fields: additionalFields,
        useCharacterAvatar: true,
      });

      if (!success) {
        console.error("Failed to send full heal to Discord");
      }

      await fetchCharacterDetails();
    } catch (error) {
      console.error("Error applying full heal:", error);
      alert("Error healing character. Please try again.");
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
    if (adminMode && isUserAdmin) {
      return (
        <div style={styles.container}>
          <div style={styles.errorContainer}>
            <h2>No Characters in Database</h2>
            <p>
              No characters have been created yet by any users. Characters will
              appear here once players start creating them.
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div style={styles.container}>
          <div style={styles.errorContainer}>
            <h2>No Characters Found</h2>
            <p>
              You haven't created any characters yet. Go to Character Creation
              to get started!
            </p>
          </div>
        </div>
      );
    }
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
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    ...styles.avatar,
                    position: "relative",
                    cursor: !character.imageUrl ? "pointer" : "default",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                  onClick={handleAvatarClick}
                  title={
                    !character.imageUrl ? "Click to add character image" : ""
                  }
                >
                  {character.imageUrl ? (
                    <>
                      <img
                        src={character.imageUrl}
                        alt={`${character.name}'s portrait`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                          border: `2px solid ${theme.primary || "#6366f1"}`,
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                        onError={(e) => {
                          console.error(
                            "Failed to load character image:",
                            character.imageUrl
                          );
                          e.target.style.display = "none";
                          e.target.parentNode.querySelector(
                            ".fallback-icon"
                          ).style.display = "flex";
                        }}
                      />
                    </>
                  ) : null}

                  <div
                    className="fallback-icon"
                    style={{
                      display: character.imageUrl ? "none" : "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      backgroundColor: theme.surface || "#f8fafc",
                      borderRadius: "50%",
                      border: `2px dashed ${theme.border || "#e2e8f0"}`,
                      transition: "all 0.2s ease",
                      position: "relative",
                    }}
                  >
                    <User
                      style={{
                        color: theme.textSecondary || "#64748b",
                        width: "50%",
                        height: "50%",
                      }}
                    />
                    {!character.imageUrl && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-8px",
                          right: "-8px",
                          backgroundColor: theme.primary || "#6366f1",
                          color: "white",
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "bold",
                          border: `2px solid ${theme.background || "white"}`,
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                        }}
                      >
                        <Plus size={16} />
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1
                    style={{
                      ...styles.characterName,
                      marginBottom: "8px",
                    }}
                  >
                    {character.name}
                  </h1>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    flexShrink: 0,
                    flexWrap: "wrap",
                  }}
                >
                  <InspirationTracker
                    character={character}
                    supabase={supabase}
                    discordUserId={discordUserId}
                    setCharacter={setCharacter}
                    selectedCharacterId={selectedCharacter.id}
                    isAdmin={adminMode}
                  />
                  <CorruptionButton
                    character={character}
                    supabase={supabase}
                    discordUserId={discordUserId}
                    setCharacter={setCharacter}
                    selectedCharacterId={selectedCharacter.id}
                  />
                  <LuckPointButton
                    character={character}
                    supabase={supabase}
                    discordUserId={discordUserId}
                    setCharacter={setCharacter}
                    selectedCharacterId={selectedCharacter.id}
                    isAdmin={adminMode}
                  />
                  <button
                    style={{
                      backgroundColor: "#9d4edd",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      opacity: 1,
                      transition: "all 0.2s ease",
                      justifyContent: "center",
                      padding: "8px 12px",
                      height: "32px",
                    }}
                    onClick={handleShortRestClick}
                    disabled={false}
                    title="Take a short rest - choose how many hit dice to use (0 to rest without healing)"
                  >
                    <Coffee size={14} />
                    Short Rest
                  </button>
                  <button
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: isLongResting ? "wait" : "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      opacity: isLongResting ? 0.7 : 1,
                      transition: "all 0.2s ease",
                      justifyContent: "center",
                      padding: "8px 12px",
                      height: "32px",
                    }}
                    onClick={handleLongRest}
                    disabled={isLongResting}
                    title="Take a long rest - automatically restores all HP, hit dice, and spell slots"
                  >
                    <Moon size={14} />
                    {isLongResting ? "Resting..." : "Long Rest"}
                  </button>
                  <button
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.2s ease",
                      justifyContent: "center",
                      padding: "8px 12px",
                      height: "32px",
                    }}
                    onClick={() =>
                      onNavigateToCharacterManagement &&
                      onNavigateToCharacterManagement(character.id)
                    }
                    title={`Level up ${character.name} to level ${
                      (character.level || 1) + 1
                    }`}
                  >
                    <TrendingUp size={14} />
                    Level Up
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px 16px",
                  fontSize: "14px",
                  color: theme.textSecondary,
                  marginBottom: "12px",
                }}
              >
                {(() => {
                  const allInfo = [];

                  allInfo.push(
                    `Level ${character.level} ${character.castingStyle}`
                  );

                  if (character.house) {
                    allInfo.push(
                      `${character.house} (Year ${
                        character.schoolYear || character.level
                      })`
                    );
                  }

                  if (character.subclass) {
                    allInfo.push(`Subclass: ${character.subclass}`);
                  }

                  if (
                    character.bloodStatus &&
                    character.bloodStatus !== "Unknown"
                  ) {
                    allInfo.push(character.bloodStatus);
                  }

                  if (
                    character.background &&
                    character.background !== "Unknown"
                  ) {
                    allInfo.push(`Background: ${character.background}`);
                  }

                  if (character.wand && character.wand !== "Unknown wand") {
                    allInfo.push(character.wand);
                  }

                  if (character.castingStyle === "Intellect Caster") {
                    allInfo.push(
                      `Initiative: ${
                        character.initiativeAbility === "intelligence"
                          ? "Intelligence"
                          : "Dexterity"
                      }`
                    );
                  }

                  if (character.gameSession) {
                    allInfo.push(`Session: ${character.gameSession}`);
                  }

                  return allInfo.map((info, index) => (
                    <span key={index}>
                      {index === 0 ? <strong>{info}</strong> : info}
                      {index < allInfo.length - 1 && (
                        <span style={{ marginLeft: "16px" }}>•</span>
                      )}
                    </span>
                  ));
                })()}
              </div>

              <div
                style={{
                  ...styles.combatStats,
                  gridAutoFlow: "column",
                  gridTemplateColumns: "repeat(auto-fit, minmax(0, 1fr))",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    ...getEnhancedHPStyle(character, {
                      ...styles.statCard,
                      backgroundColor: theme.background,
                      border: `3px solid ${getHPColor(character)}`,
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
                      fontSize: "24px",
                    }}
                  >
                    {character.currentHitPoints ?? character.hitPoints}/
                    {character.maxHitPoints ?? character.hitPoints}
                  </div>
                  <div
                    style={{
                      ...styles.statLabel,
                      color: getHPColor(character),
                    }}
                  >
                    Hit Points
                    {character.tempHP > 0 && (
                      <div
                        style={{
                          fontSize: "11px",
                          marginTop: "2px",
                          color: "#3b82f6",
                          fontWeight: "600",
                        }}
                      >
                        (+{character.tempHP} temp)
                      </div>
                    )}
                  </div>
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
                <div
                  style={{
                    ...styles.statCard,
                    backgroundColor: theme.background,
                    border: "3px solid #b27424ff",
                    cursor: isRolling ? "wait" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() =>
                    !isRolling &&
                    rollInitiative({
                      character,
                      isRolling,
                      setIsRolling,
                      characterModifiers,
                    })
                  }
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setShowInitiativeModal(true);
                  }}
                  title={`Click to roll initiative: d20  ${formatModifier(
                    character.initiativeModifier
                  )}${String.fromCharCode(
                    10
                  )}Right-click to modify or override`}
                >
                  <Swords
                    className="w-6 h-6 text-green-600 mx-auto mb-1"
                    style={{ color: "#b27424ff" }}
                  />
                  <div style={{ ...styles.statValue, color: "#b27424ff" }}>
                    {formatModifier(character.initiativeModifier)}
                  </div>
                  <div style={{ ...styles.statLabel, color: "#b27424ff" }}>
                    Initiative
                  </div>
                </div>
                {getSpellcastingAbility(character.castingStyle) && (
                  <div
                    style={{
                      ...styles.statCard,
                      backgroundColor: theme.background,
                      border: "3px solid #d1323dff",
                      cursor: isRolling ? "wait" : "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() =>
                      !isRolling && setShowSpellAttackRollModal(true)
                    }
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setShowSpellAttackModal(true);
                    }}
                    title={`Left click to roll spell attack with options • Right click to set override/modifier`}
                  >
                    <Target
                      className="w-6 h-6 text-green-600 mx-auto mb-1"
                      style={{ color: "#d1323dff" }}
                    />
                    <div style={{ ...styles.statValue, color: "#d1323dff" }}>
                      {formatModifier(getSpellAttackBonus(character))}
                    </div>
                    <div style={{ ...styles.statLabel, color: "#d1323dff" }}>
                      Spell Attack
                    </div>
                  </div>
                )}

                {getSpellcastingAbility(character.castingStyle) && (
                  <div
                    style={{
                      ...styles.statCard,
                      backgroundColor: theme.background,
                      border: "3px solid #8b5cf6",
                      cursor: isRolling ? "wait" : "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => !isRolling && rollSpellcastingAbilityCheck()}
                    title={`Click to roll ${getSpellcastingAbility(
                      character.castingStyle
                    )} ability check (no proficiency): d20 ${formatModifier(
                      getSpellcastingAbilityModifier(character)
                    )}`}
                  >
                    <Sparkles
                      className="w-6 h-6 text-yellow-600 mx-auto mb-1"
                      style={{ color: "#8b5cf6" }}
                    />
                    <div
                      style={{
                        fontSize: "24px",
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
                      Spellcasting Ability (
                      {getSpellcastingAbility(character.castingStyle)
                        ?.slice(0, 3)
                        .toUpperCase()}
                      )
                    </div>
                  </div>
                )}
                <div
                  style={{
                    ...styles.statCard,
                    backgroundColor: theme.background,
                    border: "3px solid #3b82f6",
                    cursor: "default",
                  }}
                  title="Right click to override or modify AC"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setShowACModal(true);
                  }}
                >
                  <Shield
                    className="w-6 h-6 text-blue-600 mx-auto mb-1"
                    style={{ color: "#3b82f6" }}
                  />
                  <div style={{ ...styles.statValue, color: "#3b82f6" }}>
                    {(() => {
                      const baseAC = character.armorClass || 10;
                      const acData = character.ac || {
                        override: null,
                        modifier: 0,
                      };
                      const override = acData.override;
                      const modifier = acData.modifier || 0;

                      if (override !== null && override !== undefined) {
                        return override + modifier;
                      }
                      return baseAC + modifier;
                    })()}
                  </div>
                  <div style={{ ...styles.statLabel, color: "#3b82f6" }}>
                    Armor Class
                  </div>
                </div>

                <div
                  style={{
                    ...styles.statCard,
                    backgroundColor: theme.background,
                    border: `1px solid ${theme.border}`,
                    cursor: "default",
                  }}
                  title={`Hit Dice: ${character.hitDie}. Use Short Rest button to recover HP.`}
                >
                  <Dices
                    className="w-6 h-6 mx-auto mb-1"
                    style={{ color: theme.text }}
                  />
                  <div style={{ ...styles.statValue, color: theme.text }}>
                    {character.currentHitDice}/{character.maxHitDice}
                  </div>
                  <div style={{ ...styles.statLabel, color: theme.text }}>
                    Hit Dice ({character.hitDie})
                  </div>
                </div>
                <div
                  style={{
                    ...styles.statCard,
                    backgroundColor: theme.background,
                    border: `1px solid ${theme.border}`,
                    cursor: "default",
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
                      fontSize: "24px",
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
                        fontSize: "24px",
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
            <div style={getCharacterSheetLayoutStyles(theme)}>
              <Skills
                character={character}
                supabase={supabase}
                discordUserId={discordUserId}
                setCharacter={setCharacter}
                selectedCharacterId={selectedCharacter.id}
                isRolling={isRolling}
                modifiers={modifiers(character)}
              />

              <CharacterTabbedPanel
                supabase={supabase}
                user={user}
                selectedCharacter={character}
                characters={characters}
                setCharacter={setCharacter}
                discordUserId={discordUserId}
                adminMode={adminMode}
                isUserAdmin={isUserAdmin}
                onNavigateToCharacterManagement={
                  onNavigateToCharacterManagement
                }
              />
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
          adminMode={adminMode}
          isUserAdmin={isUserAdmin}
        />

        {showACModal && character && (
          <ACOverrideModal
            character={character}
            onClose={() => setShowACModal(false)}
            onSave={(updatedCharacter) => {
              setCharacter(updatedCharacter);
              setShowACModal(false);
            }}
            supabase={supabase}
          />
        )}

        {showSpellAttackModal && character && (
          <SpellAttackModal
            character={character}
            onClose={() => setShowSpellAttackModal(false)}
            onSave={(updatedCharacter) => {
              setCharacter(updatedCharacter);
              setShowSpellAttackModal(false);
            }}
            supabase={supabase}
          />
        )}

        {showSpellAttackRollModal && character && (
          <SpellAttackRollModal
            character={character}
            onClose={() => setShowSpellAttackRollModal(false)}
            onRoll={rollSpellAttack}
            getSpellAttackBonus={getSpellAttackBonus}
            formatModifier={formatModifier}
          />
        )}

        {showInitiativeModal && character && (
          <InitiativeOverrideModal
            character={character}
            onClose={() => setShowInitiativeModal(false)}
            onSave={(updatedCharacter) => {
              const effectiveAbilityScores = {
                strength: character.strength,
                dexterity: character.dexterity,
                constitution: character.constitution,
                intelligence: character.intelligence,
                wisdom: character.wisdom,
                charisma: character.charisma,
              };

              const newInitiativeModifier = getInitiativeModifier(
                character.initiativeAbility,
                effectiveAbilityScores,
                updatedCharacter
              );

              setCharacter({
                ...updatedCharacter,
                initiativeModifier: newInitiativeModifier,
              });
              setShowInitiativeModal(false);
            }}
            supabase={supabase}
          />
        )}
      </div>
    </>
  );
};

export default CharacterSheet;
