import { useState, useEffect } from "react";
import { rollAbilityStat } from "../../utils/diceRoller";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { Wand, Save, RefreshCw, AlertCircle } from "lucide-react";
import EnhancedSubclassSelector from "../Shared/EnhancedSubclassSelector";

import { castingStyles, skillsByCastingStyle, hpData } from "../../data";
import { standardFeats } from "../../standardFeatData";
import { useTheme } from "../../../contexts/ThemeContext";
import { characterService } from "../../../services/characterService";
import { InnateHeritage } from "../Shared/InnateHeritage";
import EnhancedFeatureSelector from "../Shared/EnhancedFeatureSelector";
import { AbilityScorePicker } from "../Shared/AbilityScorePicker";
import { createCharacterCreationStyles } from "../../../styles/masterStyles";
import { FeatRequirementsInfo, getAllSelectedFeats } from "./ASIComponents";
import ASILevelChoices from "./ASILevelChoices";
import CharacterProgressionSummary from "./CharacterProgressionSummary";
import EnhancedBackgroundSelector from "../Shared/EnhancedBackgroundSelector";
import { StepIndicator } from "../Shared/StepIndicator";
import EnhancedHouseSelector from "../Shared/EnhancedHouseSelector";
import EnhancedSkillsSection from "../Shared/EnhancedSkillsSection";

const CharacterCreator = ({
  user,
  onCharacterSaved,
  maxCharacters = 10,
  activeCharacterCount = 0,
  isLoadingCharacterCount,
  supabase,
}) => {
  const { theme } = useTheme();
  const styles = createCharacterCreationStyles(theme);

  const getInitialCharacterState = () => ({
    name: "",
    house: "",
    houseChoices: {},
    asiChoices: {},
    castingStyle: "",
    initiativeAbility: "dexterity",
    subclass: "",
    innateHeritage: "",
    background: "",
    backgroundSkills: [],
    gameSession: "",
    standardFeats: [],
    skillProficiencies: [],
    abilityScores: {
      strength: null,
      dexterity: null,
      constitution: null,
      intelligence: null,
      wisdom: null,
      charisma: null,
    },
    hitPoints: 0,
    level: 1,
    wandType: "",
    magicModifiers: {
      divinations: 0,
      charms: 0,
      transfiguration: 0,
      healing: 0,
      jinxesHexesCurses: 0,
    },
    level1ChoiceType: "",
  });

  const getGameSessionOptions = () => {
    const sessions = [
      "Sunday - Knights",
      "Monday - Haunting",
      "Tuesday - Knights",
      "Wednesday - Haunting",
      "Thursday - Knights",
      "Friday - Knights",
      "Saturday - Haunting",
      "Saturday - Knights",
      "DEVELOPMENT",
    ];
    return sessions;
  };

  const gameSessionOptions = getGameSessionOptions();

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
  const [rolledHp, setRolledHp] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [magicModifierTempValues, setMagicModifierTempValues] = useState({});

  const discordUserId = user?.user_metadata?.provider_id;

  const ASI_LEVELS = [4, 8, 12, 16, 19];

  const setASILevelFilter = (level, filter) => {
    setASILevelFilters((prev) => ({
      ...prev,
      [level]: filter,
    }));
  };

  const getAvailableASILevels = (currentLevel) => {
    return ASI_LEVELS.filter((level) => level <= currentLevel);
  };

  const calculateTotalFeatsFromChoices = () => {
    let totalFeats = 0;

    if (character.level1ChoiceType === "feat") {
      totalFeats += 1;
    }

    const availableASILevels = getAvailableASILevels(character.level);
    availableASILevels.forEach((level) => {
      const choice = character.asiChoices[level];
      if (choice && choice.type === "feat") {
        totalFeats += 1;
      }
    });

    return totalFeats;
  };

  const getFeatProgressionInfo = () => {
    const currentLevel = character.level || 1;
    const availableASILevels = getAvailableASILevels(currentLevel);
    const nextASILevel = ASI_LEVELS.find((level) => currentLevel < level);

    const choices = [];

    if (character.level1ChoiceType === "innate") {
      choices.push({ level: 1, choice: "Innate Heritage", type: "innate" });
    } else if (character.level1ChoiceType === "feat") {
      choices.push({ level: 1, choice: "Starting Feat", type: "feat" });
    }

    availableASILevels.forEach((level) => {
      const asiChoice = character.asiChoices[level];
      if (asiChoice) {
        if (asiChoice.type === "asi") {
          const increases = asiChoice.abilityScoreIncreases || [];
          const abilityNames = increases
            .map(
              (inc) =>
                inc.ability.charAt(0).toUpperCase() + inc.ability.slice(1)
            )
            .join(", ");
          choices.push({
            level,
            choice: `ASI (+1 ${abilityNames})`,
            type: "asi",
          });
        } else if (asiChoice.type === "feat") {
          choices.push({
            level,
            choice: asiChoice.selectedFeat || "Feat (not selected)",
            type: "feat",
          });
        }
      }
    });

    return {
      choices,
      nextASILevel,
      totalFeatsSelected: calculateTotalFeatsFromChoices(),
    };
  };

  const validateFeatSelections = () => {
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
    return true;
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
    if (
      character.level1ChoiceType === "feat" &&
      character.standardFeats.length > 0
    ) {
      validateFeatSelections();
    }
    // eslint-disable-next-line
  }, [
    character.standardFeats,
    character.asiChoices,
    character.level1ChoiceType,
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

  const getAvailableSkills = () => {
    if (!character.castingStyle) return [];
    return skillsByCastingStyle[character.castingStyle] || [];
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

  const handleLevel1ChoiceChange = (choiceType) => {
    setCharacter((prev) => ({
      ...prev,
      level1ChoiceType: choiceType,
      innateHeritage: choiceType === "feat" ? "" : prev.innateHeritage,
      standardFeats: choiceType === "feat" ? prev.standardFeats : [],
    }));
  };

  const handleSkillToggle = (skill) => {
    setCharacter((prev) => {
      const currentSkills = prev.skillProficiencies || [];
      const backgroundSkills = prev.backgroundSkills || [];
      const castingStyleSkills = getAvailableSkills();

      if (backgroundSkills.includes(skill)) {
        return prev;
      }

      const selectedCastingStyleSkills = currentSkills.filter(
        (s) => castingStyleSkills.includes(s) && !backgroundSkills.includes(s)
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

  const calculateHitPoints = () => {
    if (!character.castingStyle) return 0;

    const castingData = hpData[character.castingStyle];
    if (!castingData) return 0;

    const conScore = character.abilityScores.constitution;
    const conMod = conScore !== null ? Math.floor((conScore - 10) / 2) : 0;
    const level = character.level || 1;

    const baseHP = castingData.base + conMod;
    const additionalHP = (level - 1) * (castingData.avgPerLevel + conMod);

    return Math.max(1, baseHP + additionalHP);
  };

  const getCurrentHp = () => {
    if (isHpManualMode) {
      return character.hitPoints || 1;
    } else if (rolledHp !== null && !isHpManualMode) {
      return rolledHp;
    } else {
      return calculateHitPoints();
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

  const handleASIFeatChange = (level, featName) => {
    setCharacter((prev) => ({
      ...prev,
      asiChoices: {
        ...prev.asiChoices,
        [level]: {
          ...prev.asiChoices[level],
          type: "feat",
          selectedFeat: featName,
        },
      },
    }));
  };

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

  const collectAllFeatsFromChoices = () => {
    const allFeats = [];

    if (
      character.level1ChoiceType === "feat" &&
      character.standardFeats.length > 0
    ) {
      allFeats.push(...character.standardFeats);
    }

    const availableASILevels = getAvailableASILevels(character.level);
    availableASILevels.forEach((level) => {
      const choice = character.asiChoices[level];
      if (choice && choice.type === "feat" && choice.selectedFeat) {
        allFeats.push(choice.selectedFeat);
      }
    });

    return allFeats;
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

  const saveCharacter = async () => {
    setIsSaving(true);
    setError(null);

    const allFeats = collectAllFeatsFromChoices();
    const characterToSave = {
      ability_scores: character.abilityScores,
      asi_choices: character.asiChoices || {},
      background: character.background,
      background_skills: character.backgroundSkills || [],
      casting_style: character.castingStyle,
      feat_choices: character.featChoices || {},
      game_session: character.gameSession,
      hit_points: getCurrentHp(),
      house_choices: houseChoices,
      house: character.house,
      initiative_ability: character.initiativeAbility || "dexterity",
      innate_heritage: character.innateHeritage,
      level: character.level,
      level1_choice_type: character.level1ChoiceType,
      magic_modifiers: character.magicModifiers,
      name: character.name.trim(),
      skill_proficiencies: character.skillProficiencies || [],
      standard_feats: allFeats,
      subclass_choices: character.subclassChoices || {},
      subclass: character.subclass,
      wand_type: character.wandType,
    };

    try {
      const savedCharacter = await characterService.saveCharacter(
        characterToSave,
        discordUserId
      );

      const transformedCharacter = {
        id: savedCharacter.id,
        abilityScores: savedCharacter.ability_scores,
        asiChoices: savedCharacter.asi_choices || {},
        background: savedCharacter.background,
        backgroundSkills: savedCharacter.background_skills || [],
        castingStyle: savedCharacter.casting_style,
        gameSession: savedCharacter.game_session || "",
        hitPoints: savedCharacter.hit_points,
        house: savedCharacter.house,
        house_choices:
          Object.keys(houseChoices).length > 0
            ? houseChoices
            : character.houseChoices || {},

        innateHeritage: savedCharacter.innate_heritage,
        level: savedCharacter.level,
        name: savedCharacter.name,
        skillExpertise: savedCharacter.skill_expertise || [],
        skillProficiencies: savedCharacter.skill_proficiencies || [],
        standardFeats: savedCharacter.standard_feats || [],
        subclass: savedCharacter.subclass,
        subclassChoices: savedCharacter.subclass_choices || {},
        wandType: savedCharacter.wand_type || "",
        magicModifiers: savedCharacter.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },
      };

      if (onCharacterSaved) {
        onCharacterSaved(transformedCharacter);
      }
    } catch (err) {
      setError("Failed to save character: " + err.message);
      console.error("Error saving character:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const isSaveEnabled =
    character.name.trim() &&
    character.house &&
    character.castingStyle &&
    character.level1ChoiceType &&
    allStatsAssigned() &&
    !isSaving &&
    !isLoadingCharacterCount &&
    activeCharacterCount < maxCharacters;

  const featInfo = getFeatProgressionInfo();

  return (
    <div style={styles.panel}>
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

      {/* Basic Character Information */}
      <StepIndicator step={1} totalSteps={5} label="Basic Information" />
      <div style={styles.fieldContainer}>
        <label style={styles.label}>Character Name *</label>
        <input
          type="text"
          value={character.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter your character's name..."
          style={styles.input}
          maxLength={50}
        />
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Game Session</label>
        <select
          value={character.gameSession}
          onChange={(e) => handleInputChange("gameSession", e.target.value)}
          style={styles.select}
        >
          <option value="">Select Game Session...</option>
          {gameSessionOptions.map((session) => (
            <option key={session} value={session}>
              {session}
            </option>
          ))}
        </select>
        <div style={styles.helpText}>
          Select which game session your character will join.
        </div>
      </div>
      <div style={styles.fieldContainer}>
        <label style={styles.label}>Casting Style *</label>
        <select
          value={character.castingStyle}
          onChange={(e) => handleInputChange("castingStyle", e.target.value)}
          style={styles.select}
        >
          <option value="">Select Casting Style...</option>
          {castingStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
        <div style={styles.helpText}>
          Your casting style determines your available skills and hit points.
        </div>
      </div>

      {character.castingStyle === "Intellect Caster" && (
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Initiative Ability *</label>
          <div style={styles.helpText}>
            As an intellect caster, you may choose to use Intelligence or
            Dexterity for initiative.
          </div>
          <div style={styles.level1ChoiceContainer}>
            <label
              style={
                character.initiativeAbility === "dexterity"
                  ? styles.level1ChoiceLabelSelected
                  : styles.level1ChoiceLabel
              }
            >
              <input
                type="radio"
                name="initiativeAbility"
                value="dexterity"
                checked={character.initiativeAbility === "dexterity"}
                onChange={(e) =>
                  handleInputChange("initiativeAbility", e.target.value)
                }
                style={styles.level1ChoiceRadio}
              />
              <span
                style={
                  character.initiativeAbility === "dexterity"
                    ? styles.level1ChoiceTextSelected
                    : styles.level1ChoiceText
                }
              >
                Dexterity (Standard)
              </span>
            </label>

            <label
              style={
                character.initiativeAbility === "intelligence"
                  ? styles.level1ChoiceLabelSelected
                  : styles.level1ChoiceLabel
              }
            >
              <input
                type="radio"
                name="initiativeAbility"
                value="intelligence"
                checked={character.initiativeAbility === "intelligence"}
                onChange={(e) =>
                  handleInputChange("initiativeAbility", e.target.value)
                }
                style={styles.level1ChoiceRadio}
              />
              <span
                style={
                  character.initiativeAbility === "intelligence"
                    ? styles.level1ChoiceTextSelected
                    : styles.level1ChoiceText
                }
              >
                Intelligence (Intellect Caster)
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Level and Hit Points */}
      <div style={styles.levelHpGrid}>
        <div style={styles.levelContainer}>
          <label style={styles.label}>Level</label>
          <input
            type="number"
            min="1"
            max="20"
            value={character.level}
            onChange={(e) =>
              handleInputChange("level", parseInt(e.target.value) || 1)
            }
            style={styles.input}
          />
          <div style={styles.helpText}>Starting character level</div>
        </div>

        <div style={styles.hpFieldContainer}>
          <label style={styles.label}>Hit Points</label>
          {!character.castingStyle ? (
            <div style={styles.skillsPlaceholder}>
              Select a Casting Style first
            </div>
          ) : (
            <div style={styles.hpValueContainer}>
              {isHpManualMode ? (
                <input
                  type="number"
                  min="1"
                  value={character.hitPoints || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "hitPoints",
                      parseInt(e.target.value) || 1
                    )
                  }
                  placeholder="--"
                  style={styles.hpManualInput}
                />
              ) : rolledHp !== null ? (
                <div style={styles.hpRollDisplay}>{rolledHp}</div>
              ) : (
                <div style={styles.hpDisplay}>{calculateHitPoints()}</div>
              )}
            </div>
          )}
        </div>

        {character.castingStyle && (
          <div style={styles.hpControlsContainer}>
            <div style={styles.hpControlsInline}>
              {!isHpManualMode && (
                <button
                  onClick={rollHp}
                  style={{
                    ...styles.button,
                    backgroundColor: "#EF4444",
                    fontSize: "12px",
                  }}
                >
                  <RefreshCw size={14} />
                  Roll
                </button>
              )}

              <div
                onClick={() => {
                  setIsHpManualMode(!isHpManualMode);
                  setRolledHp(null);
                }}
                style={{
                  ...styles.hpToggle,
                  backgroundColor: isHpManualMode
                    ? theme.success
                    : theme.border,
                  borderColor: isHpManualMode
                    ? theme.success
                    : theme.textSecondary,
                }}
                title={
                  isHpManualMode
                    ? "Switch to Auto/Roll mode"
                    : "Switch to Manual mode"
                }
              >
                <div
                  style={{
                    ...styles.hpToggleKnob,
                    left: isHpManualMode ? "22px" : "2px",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
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

      {/* Subclass */}
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

      {/* Character Progression Summary */}
      <CharacterProgressionSummary
        character={character}
        featInfo={featInfo}
        styles={styles}
      />

      {/* Level 1 Choice */}
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
              character.level1ChoiceType === "innate"
                ? styles.level1ChoiceLabelSelected
                : styles.level1ChoiceLabel
            }
          >
            <input
              type="radio"
              name="level1Choice"
              value="innate"
              checked={character.level1ChoiceType === "innate"}
              onChange={(e) => handleLevel1ChoiceChange(e.target.value)}
              style={styles.level1ChoiceRadio}
            />
            <span
              style={
                character.level1ChoiceType === "innate"
                  ? styles.level1ChoiceTextSelected
                  : styles.level1ChoiceText
              }
            >
              Innate Heritage
            </span>
          </label>

          <label
            style={
              character.level1ChoiceType === "feat"
                ? styles.level1ChoiceLabelSelected
                : styles.level1ChoiceLabel
            }
          >
            <input
              type="radio"
              name="level1Choice"
              value="feat"
              checked={character.level1ChoiceType === "feat"}
              onChange={(e) => handleLevel1ChoiceChange(e.target.value)}
              style={styles.level1ChoiceRadio}
            />
            <span
              style={
                character.level1ChoiceType === "feat"
                  ? styles.level1ChoiceTextSelected
                  : styles.level1ChoiceText
              }
            >
              Starting Standard Feat
            </span>
          </label>
        </div>
      </div>

      {/* Innate Heritage */}
      {character.level1ChoiceType === "innate" && (
        <InnateHeritage
          character={character}
          handleInputChange={handleInputChange}
          isEditing={false}
        />
      )}

      {/* Starting Feat */}
      {character.level1ChoiceType === "feat" && (
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

      {/* ASI Level Choices */}
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

      {/* Background */}
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

      {/* Ability Scores */}
      <AbilityScorePicker
        allStatsAssigned={allStatsAssigned}
        assignStat={assignStat}
        availableStats={availableStats}
        character={character}
        clearStat={clearStat}
        featChoices={character.featChoices || {}}
        houseChoices={character.houseChoices || houseChoices}
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
      />
      <StepIndicator step={5} totalSteps={5} label="Wand Modifiers" />

      {/* Magic Subject Modifiers */}
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
      {/* Action Buttons */}
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
