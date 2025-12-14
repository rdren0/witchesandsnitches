import { useState, useEffect } from "react";
import {
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
import Tooltip from "../Common/Tooltip";
import {
  getAllAbilityModifiers,
  calculateFinalAbilityScores,
} from "../CharacterManager/utils/characterUtils";
import {
  backgroundsData,
  subclassesData,
  standardFeats,
} from "../../SharedData";
import {
  calculateInitiativeWithFeats,
  calculateFeatBenefits,
} from "../CharacterManager/utils/featBenefitsCalculator";
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
  const [healAmount, setHealAmount] = useState(0);
  const [tempHPAmount, setTempHPAmount] = useState(0);
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
        title: `${character.name}: Spellcasting Ability Check`,

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
      let individualDice = null;

      if (rollType === "advantage") {
        const roll1 = Math.floor(Math.random() * 20) + 1;
        const roll2 = Math.floor(Math.random() * 20) + 1;
        rollValue = Math.max(roll1, roll2);
        rollDetails = `2d20kh1`;
        individualDice = [roll1, roll2];
      } else if (rollType === "disadvantage") {
        const roll1 = Math.floor(Math.random() * 20) + 1;
        const roll2 = Math.floor(Math.random() * 20) + 1;
        rollValue = Math.min(roll1, roll2);
        rollDetails = `2d20kl1`;
        individualDice = [roll1, roll2];
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
          name: "Dice Formula",
          value: rollDetails,
          inline: true,
        },
      ];

      if (individualDice) {
        additionalFields.push({
          name: "Individual Dice",
          value: `[${individualDice.join(", ")}]`,
          inline: true,
        });
      }

      const success = await sendDiscordRollWebhook({
        character,
        rollType: "Spell Attack Roll",
        title: `${character.name}: Spell Attack Roll${rollTypeText}`,
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

        const allFeats = getAllCharacterFeats(
          data.standard_feats || [],
          data.asi_choices || {}
        );

        const resources = data.character_resources?.[0] || {};

        const transformedCharacter = {
          ac: data.ac || { override: null, modifier: 0 },
          spellAttack: data.spell_attack || { override: null, modifier: 0 },
          allFeats: allFeats,
          asiChoices: data.asi_choices || {},
          asi_choices: data.asi_choices || {},
          background: data.background || "Unknown",
          baseAbilityScores: baseAbilityScores,
          bloodStatus: data.innate_heritage || "Unknown",
          castingStyle: data.casting_style,
          corruptionPoints: resources.corruption_points || 0,
          currentHitDice: data.current_hit_dice || data.level,
          currentHitPoints: data.current_hit_points ?? (data.hit_points || 1),
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
          innateHeritage: data.innate_heritage,
          inspiration: resources.inspiration ?? 0,
          luck: resources.luck,
          level: data.level || 1,
          level1ChoiceType: data.level1_choice_type,
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
          standard_feats: data.standard_feats || [],
          subclass: data.subclass,
          subclassChoices: data.subclass_choices || {},
          tempHP: data.temp_hp || 0,
          toolProficiencies: data.tool_proficiencies || [],
          wand: data.wand_type || "Unknown wand",
          wandType: data.wand_type,
          metamagicChoices: data.metamagic_choices || {},
          heritageChoices: heritageChoices,
          castingStyleChoices: data.casting_style_choices || {},
          additional_feats: data.additional_feats || [],
          feat_choices: data.feat_choices || {},
          featChoices: data.feat_choices || {},
          additionalASI: data.additional_asi || [],
          additional_asi: data.additional_asi || [],
        };

        const effectiveAbilityScores =
          calculateFinalAbilityScores(transformedCharacter);

        transformedCharacter.abilityScores = effectiveAbilityScores;
        transformedCharacter.strength = effectiveAbilityScores.strength || 10;
        transformedCharacter.dexterity = effectiveAbilityScores.dexterity || 10;
        transformedCharacter.constitution =
          effectiveAbilityScores.constitution || 10;
        transformedCharacter.intelligence =
          effectiveAbilityScores.intelligence || 10;
        transformedCharacter.wisdom = effectiveAbilityScores.wisdom || 10;
        transformedCharacter.charisma = effectiveAbilityScores.charisma || 10;
        transformedCharacter.armorClass =
          getBaseArmorClass(data.casting_style) +
          getArmorClassModifier(effectiveAbilityScores);
        transformedCharacter.initiativeModifier = getInitiativeModifier(
          data.initiative_ability,
          effectiveAbilityScores,
          data
        );

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
  }, [fetchCharacterDetails]);

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

    const maxSorceryPoints = character?.maxSorceryPoints || 0;
    const hasSorceryPoints = maxSorceryPoints > 0;

    const featBenefits = calculateFeatBenefits(character);
    const hasLuckyFeat = featBenefits.resources.luckPoints > 0;

    const confirmed = window.confirm(
      `Take a long rest for ${
        character.name
      }?\n\nThis will restore:\n• HP: ${currentHP} → ${maxHP}\n• Hit Dice: ${currentHitDice} → ${maxHitDice}${
        hasSpellSlots ? "\n• All Spell Slots" : ""
      }${hasSorceryPoints ? "\n• All Sorcery Points" : ""}${
        hasLuckyFeat ? "\n• All Luck Points" : ""
      }`
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

      if (hasSpellSlots || hasSorceryPoints || hasLuckyFeat) {
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

        if (hasSorceryPoints) {
          resourceUpdates.sorcery_points = maxSorceryPoints;
        }

        if (hasLuckyFeat) {
          const maxLuckPoints = featBenefits.resources.luckPoints;
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
        }${hasSorceryPoints ? " • All sorcery points restored" : ""} • ${
          character.name
        } is fully rested!`,
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
          }${hasSorceryPoints ? " • All sorcery points restored" : ""}`,
          inline: false,
        },
      ];

      const success = await sendDiscordRollWebhook({
        character,
        rollType: "Long Rest",
        title: `${character.name}: Long Rest Complete`,
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
    setHealAmount(0);
    setTempHPAmount(0);
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
            <div
              style={{
                backgroundColor: theme.surface,
                borderRadius: "0px",
                padding: "16px",
                marginTop: "calc(-1.5rem - 20px)",
                marginLeft: "-1.5rem",
                marginRight: "-1.5rem",
                marginBottom: "20px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                borderBottom: `2px solid ${theme.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
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
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
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
            </div>

            <div style={styles.headerCard}>
              <div
                style={{
                  ...styles.combatStats,
                  gridAutoFlow: "column",
                  gridTemplateColumns: "repeat(auto-fit, minmax(0, 1fr))",
                  gap: "12px",
                }}
              >
                <Tooltip
                  content={{
                    title: "HP Management",
                    rightClick: "Open HP actions",
                  }}
                  delay={100}
                >
                  <div
                    style={{
                      ...getEnhancedHPStyle(character, {
                        ...styles.statCard,
                        backgroundColor: theme.background,
                        border: `3px solid ${getHPColor(character)}`,
                        cursor: "context-menu",
                      }),
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleDamageClick();
                    }}
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
                </Tooltip>
                <Tooltip
                  content={{
                    title: "Initiative",
                    leftClick: `Roll initiative (d20 ${formatModifier(
                      character.initiativeModifier
                    )})`,
                    rightClick: "Modify or override initiative modifier",
                  }}
                  delay={200}
                >
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
                </Tooltip>
                {getSpellcastingAbility(character.castingStyle) && (
                  <Tooltip
                    content={{
                      title: "Spell Attack",
                      leftClick:
                        "Roll spell attack with advantage/disadvantage options",
                      rightClick:
                        "Set override or modifier for spell attack bonus",
                    }}
                    delay={200}
                  >
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
                  </Tooltip>
                )}

                {getSpellcastingAbility(character.castingStyle) && (
                  <Tooltip
                    content={{
                      title: `Spellcasting Ability (${getSpellcastingAbility(
                        character.castingStyle
                      )})`,
                      leftClick: `Roll ${getSpellcastingAbility(
                        character.castingStyle
                      )} check (d20 ${formatModifier(
                        getSpellcastingAbilityModifier(character)
                      )})`,
                      description: "No proficiency bonus applied",
                    }}
                    delay={200}
                  >
                    <div
                      style={{
                        ...styles.statCard,
                        backgroundColor: theme.background,
                        border: "3px solid #8b5cf6",
                        cursor: isRolling ? "wait" : "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() =>
                        !isRolling && rollSpellcastingAbilityCheck()
                      }
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
                  </Tooltip>
                )}
                <Tooltip
                  content={{
                    title: "Armor Class (AC)",
                    rightClick: "Override or modify AC value",
                    description: "Determines how hard you are to hit in combat",
                  }}
                  delay={200}
                >
                  <div
                    style={{
                      ...styles.statCard,
                      backgroundColor: theme.background,
                      border: "3px solid #3b82f6",
                      cursor: "context-menu",
                    }}
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
                </Tooltip>

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

              <div>
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
          healAmount={healAmount}
          setHealAmount={setHealAmount}
          tempHPAmount={tempHPAmount}
          setTempHPAmount={setTempHPAmount}
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
