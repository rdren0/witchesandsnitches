import { useState, useEffect } from "react";
import { rollAbilityStat } from "../../../App/diceRoller";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { Wand, Save, RefreshCw, AlertCircle, Star } from "lucide-react";

import {
  castingStyles,
  housesBySchool,
  skillsByCastingStyle,
  hpData,
  subclasses,
  standardFeats,
  backgrounds,
} from "../../data";

import { useTheme } from "../../../contexts/ThemeContext";
import { characterService } from "../../../services/characterService";
import { InnateHeritage } from "../Shared/InnateHeritage";
import { StandardFeat } from "../Shared/StandardFeat";
import { AbilityScorePicker } from "../Shared/AbilityScorePicker";
import { createCharacterCreationStyles } from "../../../styles/masterStyles";

const CharacterCreator = ({
  user,
  customUsername,
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
    asiChoices: {},
    castingStyle: "",
    initiativeAbility: "dexterity",
    subclass: "",
    innateHeritage: "",
    background: "",
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
    ];
    return sessions;
  };

  const gameSessionOptions = getGameSessionOptions();

  const [character, setCharacter] = useState(getInitialCharacterState());
  const [rolledStats, setRolledStats] = useState([]);
  const [availableStats, setAvailableStats] = useState([]);
  const [expandedFeats, setExpandedFeats] = useState(new Set());
  const [featFilter, setFeatFilter] = useState("");
  const [tempInputValues, setTempInputValues] = useState({});
  const [isManualMode, setIsManualMode] = useState(false);
  const [isHpManualMode, setIsHpManualMode] = useState(false);
  const [rolledHp, setRolledHp] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [magicModifierTempValues, setMagicModifierTempValues] = useState({});
  const [expandedASILevels, setExpandedASILevels] = useState(new Set());

  const discordUserId = user?.user_metadata?.provider_id;

  const ASI_LEVELS = [4, 8, 12, 16, 19];

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
    setExpandedFeats(new Set());
    setFeatFilter("");
    setTempInputValues({});
    setMagicModifierTempValues({});
    setExpandedASILevels(new Set());
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
    }));
  };

  const handleSkillToggle = (skill) => {
    setCharacter((prev) => {
      const currentSkills = prev.skillProficiencies;
      const isCurrentlySelected = currentSkills.includes(skill);

      if (!isCurrentlySelected && currentSkills.length >= 2) {
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
        [level]: { type: choiceType },
      },
    }));
  };

  const handleASIAbilityScoreIncrease = (level, ability) => {
    setCharacter((prev) => {
      const currentChoice = prev.asiChoices[level] || {
        type: "asi",
        abilityScoreIncreases: [],
      };
      const currentIncreases = currentChoice.abilityScoreIncreases || [];

      const existingIndex = currentIncreases.findIndex(
        (inc) => inc.ability === ability
      );
      let newIncreases;

      if (existingIndex >= 0) {
        newIncreases = currentIncreases.filter(
          (_, index) => index !== existingIndex
        );
      } else if (currentIncreases.length < 2) {
        newIncreases = [...currentIncreases, { ability }];
      } else {
        return prev;
      }

      return {
        ...prev,
        asiChoices: {
          ...prev.asiChoices,
          [level]: { ...currentChoice, abilityScoreIncreases: newIncreases },
        },
      };
    });
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

  const saveCharacter = async () => {
    setIsSaving(true);
    setError(null);

    if (!character.name.trim()) {
      setError("Character name is required");
      setIsSaving(false);
      return;
    }

    if (!character.level1ChoiceType) {
      setError(
        "Please select either Innate Heritage or Starting Standard Feat"
      );
      setIsSaving(false);
      return;
    }

    if (
      character.castingStyle === "Intellect Caster" &&
      !character.initiativeAbility
    ) {
      setError("Please select an initiative ability for your Intellect Caster");
      setIsSaving(false);
      return;
    }

    const availableASILevels = getAvailableASILevels(character.level);
    for (const level of availableASILevels) {
      const choice = character.asiChoices[level];
      if (!choice || !choice.type) {
        setError(`Please make a choice for Level ${level} (ASI or Feat)`);
        setIsSaving(false);
        return;
      }

      if (choice.type === "asi") {
        const increases = choice.abilityScoreIncreases || [];
        if (increases.length !== 2) {
          setError(
            `Please select exactly 2 ability score increases for Level ${level}`
          );
          setIsSaving(false);
          return;
        }
      } else if (choice.type === "feat") {
        if (!choice.selectedFeat) {
          setError(`Please select a feat for Level ${level}`);
          setIsSaving(false);
          return;
        }
      }
    }

    if (
      character.level1ChoiceType === "feat" &&
      character.standardFeats.length === 0
    ) {
      setError("Please select your starting feat");
      setIsSaving(false);
      return;
    }

    if (activeCharacterCount >= maxCharacters) {
      setError(
        `Cannot create character: You have reached the maximum of ${maxCharacters} characters.`
      );
      setIsSaving(false);
      return;
    }

    const allFeats = collectAllFeatsFromChoices();

    const characterToSave = {
      name: character.name.trim(),
      house: character.house,
      casting_style: character.castingStyle,
      initiative_ability: character.initiativeAbility || "dexterity",
      subclass: character.subclass,
      innate_heritage: character.innateHeritage,
      background: character.background,
      game_session: character.gameSession,
      standard_feats: allFeats,
      skill_proficiencies: character.skillProficiencies,
      ability_scores: character.abilityScores,
      hit_points: getCurrentHp(),
      level: character.level,
      wand_type: character.wandType,
      magic_modifiers: character.magicModifiers,
      level1_choice_type: character.level1ChoiceType,
      asi_choices: character.asiChoices,
    };

    try {
      const savedCharacter = await characterService.saveCharacter(
        characterToSave,
        discordUserId
      );

      const transformedCharacter = {
        id: savedCharacter.id,
        name: savedCharacter.name,
        house: savedCharacter.house,
        castingStyle: savedCharacter.casting_style,
        subclass: savedCharacter.subclass,
        innateHeritage: savedCharacter.innate_heritage,
        background: savedCharacter.background,
        gameSession: savedCharacter.game_session || "",
        standardFeats: savedCharacter.standard_feats || [],
        skillProficiencies: savedCharacter.skill_proficiencies || [],
        abilityScores: savedCharacter.ability_scores,
        hitPoints: savedCharacter.hit_points,
        asiChoices: savedCharacter.asi_choices || {},
        level: savedCharacter.level,
        wandType: savedCharacter.wand_type || "",
        magicModifiers: savedCharacter.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },
        level1ChoiceType: savedCharacter.level1_choice_type || "",
        initiativeAbility: savedCharacter.initiative_ability || "dexterity",
        createdAt: savedCharacter.created_at,
      };

      resetForm();

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
        <label style={styles.label}>House *</label>
        <select
          value={character.house}
          onChange={(e) => handleInputChange("house", e.target.value)}
          style={styles.select}
        >
          <option value="">Select House...</option>
          {Object.entries(housesBySchool).map(([school, houses]) => (
            <optgroup key={school} label={school}>
              {houses.map((house) => (
                <option key={house} value={house}>
                  {house}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
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

      <div style={styles.fieldContainer}>
        <h3 style={styles.skillsHeader}>
          Skill Proficiencies ({character.skillProficiencies.length}/2 selected)
          *
        </h3>

        {!character.castingStyle ? (
          <div style={styles.skillsPlaceholder}>
            Please select a Casting Style first to see available skills.
          </div>
        ) : (
          <div style={styles.skillsContainer}>
            <h4 style={styles.skillsSubheader}>
              {character.castingStyle} Skills (Choose 2)
            </h4>
            <div style={styles.skillsGrid}>
              {getAvailableSkills().map((skill) => {
                const isSelected = character.skillProficiencies.includes(skill);
                const canSelect =
                  isSelected || character.skillProficiencies.length < 2;

                return (
                  <label
                    key={skill}
                    style={{
                      ...styles.skillOptionBase,
                      cursor: canSelect ? "pointer" : "not-allowed",
                      backgroundColor: isSelected
                        ? theme.success + "20"
                        : theme.surface,
                      border: isSelected
                        ? `2px solid ${theme.success}`
                        : `2px solid ${theme.border}`,
                      opacity: canSelect ? 1 : 0.5,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSkillToggle(skill)}
                      disabled={!canSelect}
                      style={styles.skillCheckbox}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        color: isSelected ? theme.success : theme.text,
                        fontWeight: isSelected ? "bold" : "normal",
                      }}
                    >
                      {skill}
                    </span>
                  </label>
                );
              })}
            </div>

            {character.skillProficiencies.length === 2 && (
              <div style={styles.skillsComplete}>
                ✓ Skill selection complete! You've chosen your 2 skills.
              </div>
            )}
          </div>
        )}
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Subclass</label>
        <select
          value={character.subclass}
          onChange={(e) => handleInputChange("subclass", e.target.value)}
          style={styles.select}
        >
          <option value="">Select Subclass...</option>
          {subclasses.map((subclass) => (
            <option key={subclass} value={subclass}>
              {subclass}
            </option>
          ))}
        </select>
      </div>

      {/* Character Progression Summary */}
      {character.level > 1 && (
        <div style={styles.fieldContainer}>
          <div
            style={{
              ...styles.fieldContainer,
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <h4
              style={{
                ...styles.skillsSubheader,
                margin: "0 0 12px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Star size={16} color={theme.primary} />
              Character Progression Summary
            </h4>

            <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Level {character.level} Character Choices:</strong>
              </div>

              {featInfo.choices.map((choice, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "4px",
                    color:
                      choice.type === "feat"
                        ? theme.primary
                        : choice.type === "asi"
                        ? theme.success
                        : choice.type === "innate"
                        ? theme.warning
                        : theme.text,
                  }}
                >
                  ✓ Level {choice.level}: {choice.choice}
                </div>
              ))}

              {featInfo.nextASILevel && (
                <div
                  style={{ marginBottom: "4px", color: theme.textSecondary }}
                >
                  ○ Level {featInfo.nextASILevel}: Next ASI/Feat Choice
                </div>
              )}

              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  marginTop: "8px",
                  fontStyle: "italic",
                }}
              >
                Total Feats Selected: {featInfo.totalFeatsSelected}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={styles.fieldContainer}>
        <h3 style={styles.skillsHeader}>
          {character.level === 1
            ? "Level 1 Choice"
            : "Starting Choice (Level 1)"}{" "}
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

      {character.level1ChoiceType === "innate" && (
        <InnateHeritage
          character={character}
          handleInputChange={handleInputChange}
          isEditing={false}
        />
      )}

      {character.level1ChoiceType === "feat" && (
        <div style={styles.fieldContainer}>
          <StandardFeat
            character={character}
            setCharacter={setCharacter}
            expandedFeats={expandedFeats}
            setExpandedFeats={setExpandedFeats}
            featFilter={featFilter}
            setFeatFilter={setFeatFilter}
            maxFeats={1}
            isLevel1Choice={true}
            characterLevel={character.level}
          />
        </div>
      )}

      {/* ASI/Feat Choices for levels 4, 8, 12, 16, 19 */}
      {getAvailableASILevels(character.level).map((level) => {
        const choice = character.asiChoices[level] || {};
        const isExpanded = expandedASILevels.has(level);

        return (
          <div key={level} style={styles.fieldContainer}>
            <div
              style={{
                ...styles.skillsHeader,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
              }}
              onClick={() => {
                const newExpanded = new Set(expandedASILevels);
                if (isExpanded) {
                  newExpanded.delete(level);
                } else {
                  newExpanded.add(level);
                }
                setExpandedASILevels(newExpanded);
              }}
            >
              <h3 style={{ margin: 0 }}>
                Level {level} - Choose ASI or Feat *
              </h3>
              <span>{isExpanded ? "▼" : "▶"}</span>
            </div>

            {isExpanded && (
              <div style={{ marginTop: "16px" }}>
                <div style={styles.level1ChoiceContainer}>
                  <label
                    style={
                      choice.type === "asi"
                        ? styles.level1ChoiceLabelSelected
                        : styles.level1ChoiceLabel
                    }
                  >
                    <input
                      type="radio"
                      name={`level${level}Choice`}
                      value="asi"
                      checked={choice.type === "asi"}
                      onChange={(e) =>
                        handleASIChoiceChange(level, e.target.value)
                      }
                    />
                    <span>Ability Score Improvement (+2 total)</span>
                  </label>
                  <label
                    style={
                      choice.type === "feat"
                        ? styles.level1ChoiceLabelSelected
                        : styles.level1ChoiceLabel
                    }
                  >
                    <input
                      type="radio"
                      name={`level${level}Choice`}
                      value="feat"
                      checked={choice.type === "feat"}
                      onChange={(e) =>
                        handleASIChoiceChange(level, e.target.value)
                      }
                    />
                    <span>Feat</span>
                  </label>
                </div>

                {choice.type === "asi" && (
                  <div style={{ marginTop: "16px" }}>
                    <h4>
                      Select Abilities to Improve (
                      {(choice.abilityScoreIncreases || []).length}/2)
                    </h4>
                    <div style={styles.helpText}>
                      Choose exactly 2 ability score increases (can be the same
                      ability twice)
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "12px",
                        marginTop: "12px",
                      }}
                    >
                      {[
                        "strength",
                        "dexterity",
                        "constitution",
                        "intelligence",
                        "wisdom",
                        "charisma",
                      ].map((ability) => {
                        const selectedCount = (
                          choice.abilityScoreIncreases || []
                        ).filter((inc) => inc.ability === ability).length;
                        const canIncrease =
                          (choice.abilityScoreIncreases || []).length < 2;
                        const canDecrease = selectedCount > 0;

                        return (
                          <div
                            key={ability}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "12px",
                              border: `1px solid ${theme.border}`,
                              borderRadius: "6px",
                              backgroundColor:
                                selectedCount > 0
                                  ? theme.success + "20"
                                  : theme.surface,
                            }}
                          >
                            <span
                              style={{
                                fontWeight:
                                  selectedCount > 0 ? "600" : "normal",
                              }}
                            >
                              {ability.charAt(0).toUpperCase() +
                                ability.slice(1)}
                            </span>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  const currentIncreases =
                                    choice.abilityScoreIncreases || [];
                                  const indexToRemove =
                                    currentIncreases.findIndex(
                                      (inc) => inc.ability === ability
                                    );
                                  if (indexToRemove >= 0) {
                                    const newIncreases = [...currentIncreases];
                                    newIncreases.splice(indexToRemove, 1);
                                    setCharacter((prev) => ({
                                      ...prev,
                                      asiChoices: {
                                        ...prev.asiChoices,
                                        [level]: {
                                          ...prev.asiChoices[level],
                                          abilityScoreIncreases: newIncreases,
                                        },
                                      },
                                    }));
                                  }
                                }}
                                disabled={!canDecrease}
                                style={{
                                  padding: "4px 8px",
                                  backgroundColor: canDecrease
                                    ? "#ef4444"
                                    : theme.border,
                                  color: canDecrease
                                    ? "white"
                                    : theme.textSecondary,
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: canDecrease
                                    ? "pointer"
                                    : "not-allowed",
                                }}
                              >
                                -
                              </button>
                              <span
                                style={{
                                  minWidth: "30px",
                                  textAlign: "center",
                                  fontWeight: "600",
                                  color:
                                    selectedCount > 0
                                      ? theme.success
                                      : theme.text,
                                }}
                              >
                                +{selectedCount}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleASIAbilityScoreIncrease(level, ability)
                                }
                                disabled={!canIncrease}
                                style={{
                                  padding: "4px 8px",
                                  backgroundColor: canIncrease
                                    ? theme.success
                                    : theme.border,
                                  color: canIncrease
                                    ? "white"
                                    : theme.textSecondary,
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: canIncrease
                                    ? "pointer"
                                    : "not-allowed",
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {choice.type === "feat" && (
                  <div style={{ marginTop: "16px" }}>
                    <h4>Select a Feat</h4>
                    <select
                      value={choice.selectedFeat || ""}
                      onChange={(e) =>
                        setCharacter((prev) => ({
                          ...prev,
                          asiChoices: {
                            ...prev.asiChoices,
                            [level]: {
                              ...prev.asiChoices[level],
                              selectedFeat: e.target.value,
                            },
                          },
                        }))
                      }
                      style={styles.select}
                    >
                      <option value="">Select a feat...</option>
                      {standardFeats.map((feat) => (
                        <option key={feat.name} value={feat.name}>
                          {feat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Background</label>
        <select
          value={character.background}
          onChange={(e) => handleInputChange("background", e.target.value)}
          style={styles.select}
        >
          <option value="">Select Background...</option>
          {backgrounds.map((background) => (
            <option key={background} value={background}>
              {background}
            </option>
          ))}
        </select>
      </div>

      <AbilityScorePicker
        character={character}
        setRolledStats={setRolledStats}
        setAvailableStats={setAvailableStats}
        setCharacter={setCharacter}
        rollAllStats={rollAllStats}
        setTempInputValues={setTempInputValues}
        allStatsAssigned={allStatsAssigned}
        availableStats={availableStats}
        tempInputValues={tempInputValues}
        clearStat={clearStat}
        assignStat={assignStat}
        isManualMode={isManualMode}
        setIsManualMode={setIsManualMode}
        rolledStats={rolledStats}
      />

      <div style={styles.fieldContainer}>
        <h3 style={styles.skillsHeader}>Magic School Modifiers</h3>
        <div style={styles.helpText}>
          Enter your wand's bonuses/penalties for each school of magic
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
