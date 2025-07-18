import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { Wand, Save, AlertCircle, UserCheck } from "lucide-react";

import { characterService } from "../../../services/characterService";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { rollAbilityStat } from "../../utils/diceRoller";
import { createCharacterCreationStyles } from "../../../styles/masterStyles";
import { calculateTotalModifiers } from "../utils";

import { hpData } from "../../../SharedData/data";
import { standardFeats } from "../../../SharedData/standardFeatData";

import { InnateHeritage } from "./InnateHeritage";
import BasicInfo from "./BasicInfo";
import EnhancedFeatureSelector from "./EnhancedFeatureSelector";
import EnhancedSubclassSelector from "./EnhancedSubclassSelector";
import ASILevelChoices from "./ASILevelChoices";
import CharacterProgressionSummary from "./CharacterProgressionSummary";
import EnhancedBackgroundSelector from "./EnhancedBackgroundSelector";
import EnhancedHouseSelector from "./EnhancedHouseSelector";
import EnhancedSkillsSection from "./EnhancedSkillsSection";

import { AbilityScorePicker } from "./AbilityScorePicker";
import { StepIndicator } from "../Shared/StepIndicator";
import { getInitialCharacterState } from "../CharacterCreation/const";
import {
  calculateHitPoints,
  collectAllFeatsFromChoices,
  getAvailableSkills,
  getFeatProgressionInfo,
  validateFeatSelections,
} from "../utils";

export const FeatRequirementsInfo = () => {
  return (
    <div
      style={{
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        borderRadius: "6px",
        padding: "12px",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: "600",
          color: "#2563eb",
          marginBottom: "6px",
        }}
      >
        📋 Feat Prerequisites
      </div>
      <div style={{ fontSize: "11px", color: "#1d4ed8", lineHeight: "1.4" }}>
        Some feats have prerequisites (ability scores, proficiencies, etc.).
        Feats you don't meet the requirements for will be clearly marked. Your
        current character qualifications will be checked automatically.
      </div>
    </div>
  );
};

const CharacterCreator = ({
  user,
  onCharacterSaved,
  maxCharacters = 10,
  activeCharacterCount = 0,
  isLoadingCharacterCount,
  targetUserId = null,
  adminMode = false,
  supabase,
}) => {
  const { theme } = useTheme();
  const styles = createCharacterCreationStyles(theme);

  const [character, setCharacter] = useState(getInitialCharacterState());
  const [rolledStats, setRolledStats] = useState([]);
  const [availableStats, setAvailableStats] = useState([]);
  const [expandedFeats, setExpandedFeats] = useState(new Set());
  const [featFilter, setFeatFilter] = useState("");
  const [asiLevelFilters, setASILevelFilters] = useState({});
  const [tempInputValues, setTempInputValues] = useState({});
  const [isManualMode, setIsManualMode] = useState(false);
  const [isHpManualMode, setIsHpManualMode] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [houseChoices, setHouseChoices] = useState({});
  const [heritageChoices, setHeritageChoices] = useState({});

  const [rolledHp, setRolledHp] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [magicModifierTempValues, setMagicModifierTempValues] = useState({});

  const isFeat = character.level1ChoiceType === "feat";
  const isInnateHeritage = character.level1ChoiceType === "innate";

  const setASILevelFilter = (level, filter) => {
    setASILevelFilters((prev) => ({
      ...prev,
      [level]: filter,
    }));
  };

  const calculateFinalAbilityScores = (
    character,
    featChoices = {},
    houseChoices = {},
    heritageChoices = {}
  ) => {
    const allFeatChoices = {
      ...(character.featChoices || {}),
      ...featChoices,
    };

    const asiModifiers = {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    };

    const asiChoices = character.asiChoices || {};

    Object.values(asiChoices).forEach((choice) => {
      if (choice.type === "feat" && choice.featChoices) {
        Object.assign(allFeatChoices, choice.featChoices);
      }

      if (choice.type === "asi" && choice.abilityScoreIncreases) {
        choice.abilityScoreIncreases.forEach((increase) => {
          const ability = increase.ability;
          const amount = increase.increase || 1;
          if (asiModifiers.hasOwnProperty(ability)) {
            asiModifiers[ability] += amount;
          }
        });
      }
    });

    const { totalModifiers } = calculateTotalModifiers(
      character,
      allFeatChoices,
      houseChoices,
      heritageChoices
    );

    const finalAbilityScores = {
      strength:
        (character.abilityScores.strength || 0) +
        (totalModifiers.strength || 0) +
        (asiModifiers.strength || 0),
      dexterity:
        (character.abilityScores.dexterity || 0) +
        (totalModifiers.dexterity || 0) +
        (asiModifiers.dexterity || 0),
      constitution:
        (character.abilityScores.constitution || 0) +
        (totalModifiers.constitution || 0) +
        (asiModifiers.constitution || 0),
      intelligence:
        (character.abilityScores.intelligence || 0) +
        (totalModifiers.intelligence || 0) +
        (asiModifiers.intelligence || 0),
      wisdom:
        (character.abilityScores.wisdom || 0) +
        (totalModifiers.wisdom || 0) +
        (asiModifiers.wisdom || 0),
      charisma:
        (character.abilityScores.charisma || 0) +
        (totalModifiers.charisma || 0) +
        (asiModifiers.charisma || 0),
    };

    Object.keys(finalAbilityScores).forEach((ability) => {
      finalAbilityScores[ability] = Math.min(
        20,
        Math.max(1, finalAbilityScores[ability])
      );
    });

    return finalAbilityScores;
  };

  const rollAllStats = () => {
    const newStats = [];
    for (let i = 0; i < 6; i++) {
      newStats.push(rollAbilityStat());
    }
    setRolledStats(newStats);
    setAvailableStats([...newStats]);

    setCharacter((prev) => ({
      ...prev,
      abilityScores: {
        strength: null,
        dexterity: null,
        constitution: null,
        intelligence: null,
        wisdom: null,
        charisma: null,
      },
    }));
  };

  const rollHp = () => {
    if (!character.castingStyle) return;

    const roller = new DiceRoller();
    const castingData = hpData[character.castingStyle];
    if (!castingData) return;

    const conScore = character.abilityScores.constitution;
    const conMod = conScore !== null ? Math.floor((conScore - 10) / 2) : 0;
    const level = character.level || 1;
    const hitDie = castingData.hitDie || 6;

    const baseRoll = roller.roll(`1d${hitDie}`);
    const baseHP = baseRoll.total + conMod;

    let additionalHP = 0;
    if (level > 1) {
      const additionalRolls = roller.roll(`${level - 1}d${hitDie}`);
      additionalHP = additionalRolls.total + conMod * (level - 1);
    }

    const totalHP = baseHP + additionalHP;
    setRolledHp(Math.max(1, totalHP));
  };

  const resetForm = () => {
    setCharacter(getInitialCharacterState());
    setSelectedHouse("");
    setHouseChoices({});
    setHeritageChoices({});
    setExpandedFeats(new Set());
    setFeatFilter("");
    setASILevelFilters({});
    setTempInputValues({});
    setMagicModifierTempValues({});
    setIsHpManualMode(false);
    setRolledHp(null);
    setError(null);

    if (isManualMode) {
      setRolledStats([]);
      setAvailableStats([]);
    } else {
      rollAllStats();
    }
  };

  useEffect(() => {
    rollAllStats();
  }, []);

  useEffect(() => {
    if (isFeat && character.standardFeats.length > 0) {
      validateFeatSelections({ character, setError });
    }
  }, [
    character.standardFeats,
    character.asiChoices,
    character.level1ChoiceType,
    character,
    isFeat,
  ]);

  const assignStat = (ability, statValue) => {
    const oldValue = character.abilityScores[ability];

    const statIndex = availableStats.indexOf(statValue);
    if (statIndex > -1) {
      const updatedAvailable = [...availableStats];
      updatedAvailable.splice(statIndex, 1);
      setAvailableStats(updatedAvailable);
    }

    if (oldValue !== null) {
      setAvailableStats((prev) => [...prev, oldValue]);
    }

    setCharacter((prev) => ({
      ...prev,
      abilityScores: {
        ...prev.abilityScores,
        [ability]: statValue,
      },
    }));
  };

  const clearStat = (ability) => {
    const oldValue = character.abilityScores[ability];
    if (oldValue !== null) {
      if (!isManualMode) {
        setAvailableStats((prev) => [...prev, oldValue]);
      }
      setCharacter((prev) => ({
        ...prev,
        abilityScores: {
          ...prev.abilityScores,
          [ability]: null,
        },
      }));
    }
  };

  const allStatsAssigned = () => {
    return Object.values(character.abilityScores).every(
      (score) => score !== null
    );
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setCharacter((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      if (field === "schoolYear") {
        setCharacter((prev) => ({
          ...prev,
          schoolYear: value,
        }));
      }
      if (field === "castingStyle") {
        setCharacter((prev) => ({
          ...prev,
          [field]: value,
          skillProficiencies: [],
          initiativeAbility: value === "Intellect Caster" ? "" : "dexterity",
        }));
        setRolledHp(null);
        setIsHpManualMode(false);
      } else if (field === "level") {
        setCharacter((prev) => ({
          ...prev,
          [field]: value,
        }));
        setRolledHp(null);
      } else {
        setCharacter((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    }
  };

  const renderAdminModeIndicator = () => {
    if (
      !adminMode ||
      !targetUserId ||
      targetUserId === user?.user_metadata?.provider_id
    ) {
      return null;
    }

    return (
      <div
        style={{
          background: "linear-gradient(135deg, #10b981, #34d399)",
          color: "white",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <UserCheck size={18} />
        Creating character for another user (Admin Mode)
      </div>
    );
  };

  const handleLevel1ChoiceChange = (choiceType) => {
    setCharacter((prev) => ({
      ...prev,
      level1ChoiceType: choiceType,
      innateHeritage: choiceType === "feat" ? "" : prev.innateHeritage,
      standardFeats: choiceType === "feat" ? prev.standardFeats : [],
    }));
  };

  const handleHeritageChoicesChange = (newChoices) => {
    setHeritageChoices(newChoices);
    setCharacter((prev) => ({
      ...prev,
      heritageChoices: newChoices,
    }));
  };

  const handleSkillToggle = (skill) => {
    setCharacter((prev) => {
      const currentSkills = prev.skillProficiencies || [];
      const backgroundSkills = prev.backgroundSkills || [];
      const innateHeritageSkills = prev.innateHeritageSkills || [];
      const castingStyleSkills = getAvailableSkills({ character });

      if (
        backgroundSkills.includes(skill) ||
        innateHeritageSkills.includes(skill)
      ) {
        return prev;
      }

      const selectedCastingStyleSkills = currentSkills.filter(
        (s) =>
          castingStyleSkills.includes(s) &&
          !backgroundSkills.includes(s) &&
          !innateHeritageSkills.includes(s)
      );

      const isCurrentlySelected = currentSkills.includes(skill);

      if (!isCurrentlySelected && selectedCastingStyleSkills.length >= 2) {
        return prev;
      }

      return {
        ...prev,
        skillProficiencies: isCurrentlySelected
          ? currentSkills.filter((s) => s !== skill)
          : [...currentSkills, skill],
      };
    });
  };

  const getCurrentHp = () => {
    if (isHpManualMode) {
      return character.hitPoints || 1;
    } else if (rolledHp !== null && !isHpManualMode) {
      return rolledHp;
    } else {
      return calculateHitPoints({ character });
    }
  };

  const handleASIChoiceChange = (level, choiceType) => {
    setCharacter((prev) => ({
      ...prev,
      asiChoices: {
        ...prev.asiChoices,
        [level]: {
          ...prev.asiChoices[level],
          type: choiceType,
          ...(choiceType === "asi"
            ? {
                abilityScoreIncreases: [],
                selectedFeat: null,
              }
            : {
                abilityScoreIncreases: null,
                selectedFeat: null,
              }),
        },
      },
    }));
  };

  const handleASIFeatChange = useCallback(
    (level, featName, featChoices = {}) => {
      setCharacter((prev) => ({
        ...prev,
        asiChoices: {
          ...prev.asiChoices,
          [level]: {
            ...prev.asiChoices[level],
            type: "feat",
            selectedFeat: featName,
            featChoices: featChoices,
            abilityScoreIncreases: null,
          },
        },
      }));
    },
    [setCharacter]
  );

  const handleASIAbilityChange = (level, abilityUpdates) => {
    setCharacter((prev) => ({
      ...prev,
      asiChoices: {
        ...prev.asiChoices,
        [level]: {
          ...prev.asiChoices[level],
          type: "asi",
          abilityScoreIncreases: abilityUpdates,
        },
      },
    }));
  };

  const handleHouseSelect = (house) => {
    setSelectedHouse(house);
    handleInputChange("house", house);
    setHouseChoices({});
  };

  const handleHouseChoiceSelect = (house, featureName, optionName) => {
    setHouseChoices((prev) => ({
      ...prev,
      [house]: { ...prev[house], [featureName]: optionName },
    }));
    setCharacter((prev) => ({
      ...prev,
      houseChoices: {
        ...prev.houseChoices,
        [house]: { ...prev.houseChoices[house], [featureName]: optionName },
      },
    }));
  };

  const calculateFinalSkillsAndExpertise = (character) => {
    const allSkills = character.skillProficiencies || [];
    const backgroundSkills = character.backgroundSkills || [];
    const innateHeritageSkills = character.innateHeritageSkills || [];
    const subclassChoices = character.subclassChoices || {};

    const expertiseSkills = [];
    const finalProficiencies = [...allSkills];

    Object.values(subclassChoices).forEach((choice) => {
      if (typeof choice === "object" && choice.mainChoice && choice.subChoice) {
        if (choice.mainChoice === "Study Buddy") {
          const selectedSkill = choice.subChoice;

          const hasFromOtherSource =
            backgroundSkills.includes(selectedSkill) ||
            innateHeritageSkills.includes(selectedSkill);

          if (hasFromOtherSource) {
            expertiseSkills.push(selectedSkill);

            const profIndex = finalProficiencies.indexOf(selectedSkill);
            if (profIndex > -1) {
              finalProficiencies.splice(profIndex, 1);
            }
          }
        }
      }
    });

    return {
      skill_proficiencies: finalProficiencies,
      skill_expertise: expertiseSkills,
    };
  };

  const ensureUserInBothTables = async (
    userId,
    supabase,
    userMetadata = null
  ) => {
    if (!userId) {
      console.error("❌ No userId provided to ensureUserInBothTables");
      return false;
    }

    try {
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("discord_user_id", userId)
        .maybeSingle();

      if (profileCheckError) {
        console.error("❌ Error checking user_profiles:", profileCheckError);
        throw profileCheckError;
      }

      if (!existingProfile) {
        const defaultUsername =
          userMetadata?.full_name ||
          userMetadata?.name ||
          userMetadata?.username ||
          userMetadata?.preferred_username ||
          `User_${userId.slice(-6)}`;

        const { error: profileInsertError } = await supabase
          .from("user_profiles")
          .insert([
            {
              discord_user_id: userId,
              username: defaultUsername,
              discord_name:
                userMetadata?.full_name || userMetadata?.name || null,
              avatar_url:
                userMetadata?.avatar_url || userMetadata?.picture || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (profileInsertError) {
          console.error("❌ Error creating user_profiles:", profileInsertError);
          throw profileInsertError;
        }
      }

      const { data: existingDiscordUser, error: discordCheckError } =
        await supabase
          .from("discord_users")
          .select("discord_user_id")
          .eq("discord_user_id", userId)
          .maybeSingle();

      if (discordCheckError) {
        console.error("❌ Error checking discord_users:", discordCheckError);
        throw discordCheckError;
      }

      if (!existingDiscordUser) {
        const { error: discordInsertError } = await supabase
          .from("discord_users")
          .insert([
            {
              discord_user_id: userId,
              username:
                userMetadata?.username ||
                userMetadata?.preferred_username ||
                `user_${userId.slice(-6)}`,
              display_name:
                userMetadata?.full_name || userMetadata?.name || null,
              avatar_url:
                userMetadata?.avatar_url || userMetadata?.picture || null,
            },
          ]);

        if (discordInsertError) {
          console.error("❌ Error creating discord_users:", discordInsertError);
          throw discordInsertError;
        }
      }
      return true;
    } catch (error) {
      console.error("💥 Failed to ensure user in both tables:", error);
      throw new Error(`Failed to create user entries: ${error.message}`);
    }
  };

  const saveCharacter = async () => {
    const effectiveUserId = targetUserId || user?.user_metadata?.provider_id;

    if (!effectiveUserId) {
      setError("No valid user ID found for character creation");
      setIsSaving(false);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (targetUserId) {
        await ensureUserInBothTables(targetUserId, supabase);
      } else {
        await ensureUserInBothTables(
          effectiveUserId,
          supabase,
          user?.user_metadata
        );
      }

      const allFeats = collectAllFeatsFromChoices({ character });

      const finalAbilityScores = calculateFinalAbilityScores(
        character,
        character.featChoices || {},
        houseChoices,
        heritageChoices
      );

      const { skill_proficiencies, skill_expertise } =
        calculateFinalSkillsAndExpertise(character);

      const characterToSave = {
        ability_scores: finalAbilityScores,
        asi_choices: character.asiChoices || {},
        background_skills: character.backgroundSkills || [],
        background: character.background,
        base_ability_scores: character.abilityScores,
        casting_style: character.castingStyle,
        feat_choices: character.featChoices || {},
        game_session: character.gameSession,
        heritage_choices: heritageChoices,
        hit_points: getCurrentHp(),
        house_choices: houseChoices,
        house: character.house,
        initiative_ability: character.initiativeAbility || "dexterity",
        innate_heritage_skills: character.innateHeritageSkills || [],
        innate_heritage: character.innateHeritage,
        level: character.level || 1,
        level1_choice_type: character.level1ChoiceType,
        magic_modifiers: character.magicModifiers,
        name: character.name.trim(),
        school_year: character.schoolYear || 1,
        skill_expertise: skill_expertise,
        skill_proficiencies: skill_proficiencies,
        standard_feats: allFeats,
        subclass_choices: character.subclassChoices || {},
        subclass: character.subclass,
        wand_type: character.wandType,
      };

      const savedCharacter = await characterService.saveCharacter(
        characterToSave,
        effectiveUserId
      );

      const transformedCharacter = {
        abilityScores: savedCharacter.ability_scores,
        asiChoices: savedCharacter.asi_choices || {},
        background: savedCharacter.background,
        backgroundSkills: savedCharacter.background_skills || [],
        baseAbilityScores:
          savedCharacter.base_ability_scores || character.abilityScores,
        castingStyle: savedCharacter.casting_style,
        gameSession: savedCharacter.game_session || "",
        heritageChoices: savedCharacter.heritage_choices || {},
        hitPoints: savedCharacter.hit_points,
        house: savedCharacter.house,
        houseChoices:
          Object.keys(houseChoices).length > 0
            ? houseChoices
            : character.houseChoices || {},
        id: savedCharacter.id,
        innateHeritage: savedCharacter.innate_heritage,
        innateHeritageSkills: savedCharacter.innate_heritage_skills || [],
        level: savedCharacter.level,
        magicModifiers: savedCharacter.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },
        name: savedCharacter.name,
        skillExpertise: savedCharacter.skill_expertise || [],
        skillProficiencies: savedCharacter.skill_proficiencies || [],
        standardFeats: savedCharacter.standard_feats || [],
        subclass: savedCharacter.subclass,
        subclassChoices: savedCharacter.subclass_choices || {},
        wandType: savedCharacter.wand_type || "",
        school_year: savedCharacter.schoolYear || 1,
      };

      if (onCharacterSaved) {
        onCharacterSaved(transformedCharacter);
      }

      const targetUserInfo =
        adminMode &&
        targetUserId &&
        targetUserId !== user?.user_metadata?.provider_id
          ? " for the selected user"
          : "";

      alert(
        `Character "${character.name}" created successfully${targetUserInfo}!`
      );
    } catch (err) {
      console.error("💥 Character creation failed:", err);
      setError("Failed to save character: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const isSaveEnabled =
    character.name.trim() &&
    character.house &&
    character.schoolYear &&
    character.castingStyle &&
    character.level1ChoiceType &&
    allStatsAssigned() &&
    !isSaving &&
    !isLoadingCharacterCount &&
    activeCharacterCount < maxCharacters;

  const featInfo = getFeatProgressionInfo({ character });

  return (
    <div style={styles.panel}>
      {renderAdminModeIndicator()}
      <div
        style={{
          ...styles.header,
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={{ color: theme.primary }}>
          <Wand />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={styles.title}>Create New Character</h1>
          <p style={styles.subtitle}>
            Build your character for the Witches & Snitches campaign
          </p>
        </div>
      </div>

      {error && (
        <div style={styles.errorContainer}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {activeCharacterCount >= maxCharacters - 2 && (
        <div style={styles.warningContainer}>
          <AlertCircle size={16} />
          {activeCharacterCount >= maxCharacters
            ? `Character limit reached (${maxCharacters}/${maxCharacters}). Please delete a character to create a new one.`
            : `You can create ${
                maxCharacters - activeCharacterCount
              } more character${
                maxCharacters - activeCharacterCount > 1 ? "s" : ""
              } before reaching the limit (${activeCharacterCount}/${maxCharacters}).`}
        </div>
      )}

      <StepIndicator step={1} totalSteps={5} label="Basic Information" />
      <BasicInfo
        character={character}
        isHpManualMode={isHpManualMode}
        setIsHpManualMode={setIsHpManualMode}
        rolledHp={rolledHp}
        setRolledHp={setRolledHp}
        rollHp={rollHp}
        handleInputChange={handleInputChange}
        calculateHitPoints={calculateHitPoints}
      />

      <StepIndicator step={2} totalSteps={5} label="House Selection" />
      <div style={styles.fieldContainer}>
        <label style={styles.label}>House *</label>
        <EnhancedHouseSelector
          selectedHouse={selectedHouse}
          onHouseSelect={handleHouseSelect}
          houseChoices={houseChoices}
          onHouseChoiceSelect={handleHouseChoiceSelect}
        />
      </div>

      <StepIndicator step={3} totalSteps={5} label="Features & Backgrounds" />

      <EnhancedSubclassSelector
        value={character.subclass}
        onChange={(value) => handleInputChange("subclass", value)}
        styles={styles}
        theme={theme}
        disabled={false}
        characterLevel={character.level}
        subclassChoices={character.subclassChoices || {}}
        onSubclassChoicesChange={(choices) =>
          setCharacter((prev) => ({ ...prev, subclassChoices: choices }))
        }
      />

      <CharacterProgressionSummary
        character={character}
        featInfo={featInfo}
        styles={styles}
      />

      <div style={styles.fieldContainer}>
        <h3 style={styles.skillsHeader}>
          {character.level === 1
            ? "Level 1 Choice"
            : "Starting Choice (Level 1)"}
          *
        </h3>
        <div style={styles.helpText}>
          {character.level === 1
            ? "At level 1, choose either an Innate Heritage or a Standard Feat."
            : `Even though you're starting at Level ${character.level}, you must choose what your character selected at Level 1.`}
        </div>

        <div style={styles.level1ChoiceContainer}>
          <label
            style={
              isInnateHeritage
                ? styles.level1ChoiceLabelSelected
                : styles.level1ChoiceLabel
            }
          >
            <input
              type="radio"
              name="level1Choice"
              value="innate"
              checked={isInnateHeritage}
              onChange={(e) => handleLevel1ChoiceChange(e.target.value)}
              style={styles.level1ChoiceRadio}
            />
            <span
              style={
                isInnateHeritage
                  ? styles.level1ChoiceTextSelected
                  : styles.level1ChoiceText
              }
            >
              Innate Heritage
            </span>
          </label>

          <label
            style={
              isFeat
                ? styles.level1ChoiceLabelSelected
                : styles.level1ChoiceLabel
            }
          >
            <input
              type="radio"
              name="level1Choice"
              value="feat"
              checked={isFeat}
              onChange={(e) => handleLevel1ChoiceChange(e.target.value)}
              style={styles.level1ChoiceRadio}
            />
            <span
              style={
                isFeat
                  ? styles.level1ChoiceTextSelected
                  : styles.level1ChoiceText
              }
            >
              Starting Standard Feat
            </span>
          </label>
        </div>
      </div>

      {isInnateHeritage && (
        <InnateHeritage
          character={character}
          handleInputChange={handleInputChange}
          isEditing={false}
          heritageChoices={heritageChoices}
          onHeritageChoicesChange={handleHeritageChoicesChange}
        />
      )}

      {isFeat && (
        <div style={styles.fieldContainer}>
          <FeatRequirementsInfo character={character} />
          <EnhancedFeatureSelector
            character={character}
            setCharacter={setCharacter}
            expandedFeats={expandedFeats}
            setExpandedFeats={setExpandedFeats}
            featFilter={featFilter}
            setFeatFilter={setFeatFilter}
            maxFeats={1}
            isLevel1Choice={true}
            characterLevel={character.level}
            standardFeats={standardFeats}
          />
        </div>
      )}

      <ASILevelChoices
        character={character}
        expandedFeats={expandedFeats}
        setExpandedFeats={setExpandedFeats}
        asiLevelFilters={asiLevelFilters}
        setASILevelFilter={setASILevelFilter}
        handleASIChoiceChange={handleASIChoiceChange}
        handleASIAbilityChange={handleASIAbilityChange}
        handleASIFeatChange={handleASIFeatChange}
        theme={theme}
        styles={styles}
      />

      <EnhancedBackgroundSelector
        value={character.background}
        onChange={(backgroundName) => {
          handleInputChange("background", backgroundName);
        }}
        onCharacterUpdate={(updatedCharacter) => {
          setCharacter(updatedCharacter);
        }}
        character={character}
        disabled={false}
      />

      <EnhancedSkillsSection
        character={character}
        handleSkillToggle={handleSkillToggle}
        getAvailableSkills={getAvailableSkills}
        styles={styles}
        theme={theme}
      />

      <StepIndicator step={4} totalSteps={5} label="Ability Scores" />

      <AbilityScorePicker
        allStatsAssigned={allStatsAssigned}
        assignStat={assignStat}
        availableStats={availableStats}
        character={character}
        clearStat={clearStat}
        featChoices={{
          ...(character.featChoices || {}),
          ...Object.values(character.asiChoices || {}).reduce((acc, choice) => {
            if (choice.type === "feat" && choice.featChoices) {
              return { ...acc, ...choice.featChoices };
            }
            return acc;
          }, {}),
        }}
        houseChoices={character.houseChoices || houseChoices}
        heritageChoices={heritageChoices}
        isManualMode={isManualMode}
        rollAllStats={rollAllStats}
        rolledStats={rolledStats}
        showModifiers={true}
        setAvailableStats={setAvailableStats}
        setCharacter={setCharacter}
        setIsManualMode={setIsManualMode}
        setRolledStats={setRolledStats}
        setTempInputValues={setTempInputValues}
        tempInputValues={tempInputValues}
        handleInputChange={handleInputChange}
      />
      <StepIndicator step={5} totalSteps={5} label="Wand Modifiers" />

      <div style={styles.fieldContainer}>
        <h3 style={styles.skillsHeader}>Magic Subject Modifiers</h3>
        <div style={styles.helpText}>
          Enter your wand's bonuses/penalties for each subject of magic (The DM
          will provide these values)
        </div>

        <div style={styles.magicModifiersGrid}>
          {[
            { key: "divinations", label: "Divinations" },
            { key: "transfiguration", label: "Transfiguration" },
            { key: "charms", label: "Charms" },
            { key: "healing", label: "Healing" },
            { key: "jinxesHexesCurses", label: "JHC" },
          ].map(({ key, label }) => (
            <div key={key} style={styles.magicModifierItem}>
              <label style={styles.magicModifierLabel}>{label}</label>
              <input
                type="number"
                value={
                  magicModifierTempValues.hasOwnProperty(key)
                    ? magicModifierTempValues[key]
                    : character.magicModifiers[key]
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setMagicModifierTempValues((prev) => ({
                    ...prev,
                    [key]: value,
                  }));
                }}
                onBlur={() => {
                  const tempValue = magicModifierTempValues[key];
                  if (tempValue !== undefined) {
                    const numValue =
                      tempValue === "" || tempValue === "-"
                        ? 0
                        : parseInt(tempValue, 10);
                    const finalValue = isNaN(numValue) ? 0 : numValue;

                    handleInputChange(`magicModifiers.${key}`, finalValue);

                    setMagicModifierTempValues((prev) => {
                      const newState = { ...prev };
                      delete newState[key];
                      return newState;
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.target.blur();
                  }
                }}
                style={styles.magicModifierInput}
                min="-99"
                max="99"
                step="1"
              />
            </div>
          ))}
        </div>
      </div>
      <div style={styles.actionButtons}>
        <button
          onClick={resetForm}
          style={{
            ...styles.button,
            backgroundColor: theme.border,
            color: theme.textSecondary,
          }}
          disabled={isSaving}
        >
          Reset Form
        </button>

        <button
          onClick={saveCharacter}
          disabled={!isSaveEnabled}
          style={{
            ...styles.saveButton,
            backgroundColor: isSaveEnabled
              ? theme.primary
              : theme.textSecondary,
            cursor: isSaveEnabled ? "pointer" : "not-allowed",
          }}
        >
          <Save size={16} />
          {isSaving
            ? "Creating Character..."
            : isLoadingCharacterCount
            ? "Checking limit..."
            : activeCharacterCount >= maxCharacters
            ? "Character Limit Reached"
            : "Create Character"}
        </button>
      </div>
    </div>
  );
};

export default CharacterCreator;
