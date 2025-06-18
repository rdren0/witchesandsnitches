import { useState, useEffect, useCallback, useMemo } from "react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { Save, X, AlertTriangle, ArrowLeft, Settings } from "lucide-react";
import { skillsByCastingStyle, hpData } from "../../data";
import { standardFeats as importedStandardFeats } from "../../standardFeatData";
import { checkFeatPrerequisites } from "../../CharacterSheet/utils";
import { useTheme } from "../../../contexts/ThemeContext";
import { characterService } from "../../../services/characterService";
import { createCharacterCreationStyles } from "../../../styles/masterStyles";
import { getAllSelectedFeats } from "../Create/ASIComponents";
import { backgroundsData } from "../Shared/backgroundsData";

// Import the new section components
import BasicInformationSection from "./BasicInformationSection";
import HouseAndSubclassSection from "./HouseAndSubclassSection";
import Level1AndProgressionSection from "./Level1AndProgressionSection";
import AbilityScoresSection from "./AbilityScoresSection";
import MagicModifiersSection from "./MagicModifiersSection";

const standardFeats = importedStandardFeats || [];

if (!importedStandardFeats) {
  console.warn(
    "Warning: standardFeats is undefined from data import. Using empty array as fallback."
  );
}

const migrateBackgroundSkills = (character) => {
  if (character.backgroundSkills && character.backgroundSkills.length > 0) {
    return character;
  }

  if (character.background && character.background !== "") {
    const background = backgroundsData[character.background];
    if (background && background.skillProficiencies) {
      return {
        ...character,
        backgroundSkills: background.skillProficiencies,
      };
    }
  }

  return {
    ...character,
    backgroundSkills: [],
  };
};

const CharacterEditor = ({
  character: originalCharacter,
  onSave,
  onCancel,
  user,
}) => {
  const { theme } = useTheme();
  const styles = createCharacterCreationStyles(theme);

  const safeOriginalCharacter = useMemo(() => {
    const baseCharacter = originalCharacter || {
      id: null,
      name: "",
      level: 1,
      castingStyle: "",
      house: "",
      houseChoices: {},
      subclassChoices: {},
      standardFeats: [],
      asiChoices: {},
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      skillProficiencies: [],
      backgroundSkills: [],
      innateHeritage: "",
      level1ChoiceType: "",
      hitPoints: 1,
      initiativeAbility: "dexterity",
      subclass: "",
      background: "",
      gameSession: "",
      wandType: "",
      magicModifiers: {
        divinations: 0,
        charms: 0,
        transfiguration: 0,
        healing: 0,
        jinxesHexesCurses: 0,
      },
    };

    if (originalCharacter) {
      baseCharacter.houseChoices =
        originalCharacter.houseChoices || originalCharacter.house_choices || {};
      baseCharacter.subclassChoices =
        originalCharacter.subclassChoices ||
        originalCharacter.subclass_choices ||
        {};
    }

    return migrateBackgroundSkills(baseCharacter);
  }, [originalCharacter]);

  // State for ASI filters
  const [asiLevelFilters, setASILevelFilters] = useState({});

  const setASILevelFilter = (level, filter) => {
    setASILevelFilters((prev) => ({
      ...prev,
      [level]: filter,
    }));
  };

  const ASI_LEVELS = [4, 8, 12, 16, 19];

  const getAvailableASILevels = (currentLevel) => {
    return ASI_LEVELS.filter((level) => level <= currentLevel);
  };

  // Helper functions for character setup
  const inferLevel1ChoiceType = (character) => {
    if (character.level1ChoiceType) {
      return character.level1ChoiceType;
    }
    if (character.innateHeritage && character.innateHeritage.trim() !== "") {
      return "innate";
    }
    if (character.standardFeats && character.standardFeats.length > 0) {
      const asiChoices = character.asiChoices || {};
      const asiFeats = Object.values(asiChoices)
        .filter((choice) => choice.type === "feat" && choice.selectedFeat)
        .map((choice) => choice.selectedFeat);
      if (character.standardFeats.length > asiFeats.length) {
        return "feat";
      }
    }
    return "";
  };

  const separateFeats = (character) => {
    if (!character) {
      return { level1Feats: [], asiFeats: [] };
    }

    const allFeats = character.standardFeats || [];
    const asiChoices = character.asiChoices || {};
    const asiFeats = Object.values(asiChoices)
      .filter((choice) => choice.type === "feat" && choice.selectedFeat)
      .map((choice) => choice.selectedFeat);
    const level1Feats = allFeats.filter((feat) => !asiFeats.includes(feat));
    return {
      level1Feats,
      asiFeats,
    };
  };

  // Main character state
  const [character, setCharacter] = useState(() => {
    const { level1Feats } = separateFeats(safeOriginalCharacter);
    const characterWithLevel1Choice = {
      ...safeOriginalCharacter,
      level1ChoiceType: inferLevel1ChoiceType(safeOriginalCharacter),
      standardFeats:
        safeOriginalCharacter.level1ChoiceType === "feat" ? level1Feats : [],
      subclassChoices:
        safeOriginalCharacter.subclassChoices ||
        safeOriginalCharacter.subclass_choices ||
        {},
    };
    return characterWithLevel1Choice;
  });

  // UI state
  const [expandedFeats, setExpandedFeats] = useState(new Set());
  const [featFilter, setFeatFilter] = useState("");
  const [tempInputValues, setTempInputValues] = useState({});
  const [isManualMode, setIsManualMode] = useState(true);
  const [isHpManualMode, setIsHpManualMode] = useState(true);
  const [rolledHp, setRolledHp] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [magicModifierTempValues, setMagicModifierTempValues] = useState({});
  const [rolledStats, setRolledStats] = useState([]);
  const [availableStats, setAvailableStats] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(
    safeOriginalCharacter.house || ""
  );
  const [houseChoices, setHouseChoices] = useState(
    safeOriginalCharacter.houseChoices ||
      safeOriginalCharacter.house_choices ||
      {}
  );

  // Lock state
  const [lockedFields, setLockedFields] = useState({
    level1ChoiceType: true,
    abilityScores: true,
  });

  const discordUserId = user?.user_metadata?.provider_id;

  // Validation
  const validateFeatSelections = useCallback(() => {
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

    const safeStandardFeats = standardFeats || [];
    const invalidFeats = allSelectedFeats.filter((featName) => {
      const feat = safeStandardFeats.find((f) => f.name === featName);
      return feat && !checkFeatPrerequisites(feat, character);
    });

    if (invalidFeats.length > 0) {
      console.warn(
        "Some selected feats no longer meet prerequisites:",
        invalidFeats
      );
      setError(
        `Warning: Some selected feats no longer meet prerequisites: ${invalidFeats.join(
          ", "
        )}`
      );
      return false;
    }

    return true;
  }, [character]);

  // Event handlers
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

  const handleHouseSelect = (house) => {
    setSelectedHouse(house);
    handleInputChange("house", house);
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

  const assignStat = (ability, statValue) => {
    if (lockedFields.abilityScores) return;
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
    if (lockedFields.abilityScores) return;
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
    return Object.values(character.abilityScores || {}).every(
      (score) => score !== null && score !== undefined
    );
  };

  const getAvailableSkills = () => {
    if (!character.castingStyle) return [];
    return skillsByCastingStyle[character.castingStyle] || [];
  };

  const calculateHPForCharacter = (char) => {
    if (!char.castingStyle) return 1;

    const castingData = hpData[char.castingStyle];
    if (!castingData) return 1;

    const conScore = char.abilityScores?.constitution;
    const conMod = conScore !== null ? Math.floor((conScore - 10) / 2) : 0;
    const level = char.level || 1;

    const baseHP = castingData.base + conMod;
    const additionalHP = (level - 1) * (castingData.avgPerLevel + conMod);

    return Math.max(1, baseHP + additionalHP);
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setCharacter((prev) => {
        const newCharacter = {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };

        if (parent === "abilityScores" && child === "constitution") {
          newCharacter.hitPoints = calculateHPForCharacter(newCharacter);
        }

        return newCharacter;
      });
    } else {
      if (field === "castingStyle") {
        setCharacter((prev) => {
          const newCharacter = {
            ...prev,
            [field]: value,
            skillProficiencies: [],
          };

          if (value) {
            newCharacter.hitPoints = calculateHPForCharacter(newCharacter);
          }

          return newCharacter;
        });
        setRolledHp(null);
      } else if (field === "level") {
        const newLevel = parseInt(value) || 1;

        setCharacter((prev) => {
          const newCharacter = {
            ...prev,
            level: newLevel,
          };

          newCharacter.hitPoints = calculateHPForCharacter(newCharacter);

          return newCharacter;
        });

        setRolledHp(null);
      } else if (field === "background") {
        const background = backgroundsData[value];
        const newBackgroundSkills =
          background && background.skillProficiencies
            ? background.skillProficiencies
            : [];

        setCharacter((prev) => {
          const currentSkills = prev.skillProficiencies || [];
          const oldBackgroundSkills = prev.backgroundSkills || [];

          const skillsWithoutOldBackground = currentSkills.filter(
            (skill) => !oldBackgroundSkills.includes(skill)
          );

          const updatedSkills = [
            ...skillsWithoutOldBackground,
            ...newBackgroundSkills,
          ];

          return {
            ...prev,
            [field]: value,
            backgroundSkills: newBackgroundSkills,
            skillProficiencies: [...new Set(updatedSkills)],
          };
        });
      } else {
        setCharacter((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    }
  };

  const handleLevel1ChoiceChange = (choiceType) => {
    if (lockedFields.level1ChoiceType) return;
    setCharacter((prev) => ({
      ...prev,
      level1ChoiceType: choiceType,
      innateHeritage: choiceType === "feat" ? "" : prev.innateHeritage,
      standardFeats: choiceType === "innate" ? [] : prev.standardFeats,
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
    const conScore = character.abilityScores?.constitution;
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

  const calculateMaxFeats = () => {
    if (character.level1ChoiceType !== "feat") return 0;
    return 1;
  };

  const toggleFieldLock = (fieldName) => {
    setLockedFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
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
      totalFeatsSelected: collectAllFeatsFromChoices().length,
    };
  };

  const saveCharacter = async () => {
    setIsSaving(true);
    setError(null);

    if (!character.name?.trim()) {
      setError("Character name is required");
      setIsSaving(false);
      return;
    }

    if (!character.id) {
      setError("Cannot save: Character ID is missing");
      setIsSaving(false);
      return;
    }

    if (!validateFeatSelections()) {
      setIsSaving(false);
      return;
    }

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
      house_choices:
        Object.keys(houseChoices).length > 0
          ? houseChoices
          : character.houseChoices || {},
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
      const updatedCharacter = await characterService.updateCharacter(
        character.id,
        characterToSave,
        discordUserId
      );

      const transformedCharacter = {
        id: updatedCharacter.id,
        abilityScores: updatedCharacter.ability_scores,
        asiChoices: updatedCharacter.asi_choices || {},
        background: updatedCharacter.background,
        backgroundSkills: updatedCharacter.background_skills || [],
        castingStyle: updatedCharacter.casting_style,
        createdAt: updatedCharacter.created_at,
        gameSession: updatedCharacter.game_session || "",
        hitPoints: updatedCharacter.hit_points,
        house: updatedCharacter.house,
        houseChoices: updatedCharacter.house_choices || {},
        initiativeAbility: updatedCharacter.initiative_ability || "dexterity",
        innateHeritage: updatedCharacter.innate_heritage,
        level: updatedCharacter.level,
        level1ChoiceType: updatedCharacter.level1_choice_type || "",
        name: updatedCharacter.name,
        skillExpertise: updatedCharacter.skill_expertise || [],
        skillProficiencies: updatedCharacter.skill_proficiencies || [],
        standardFeats: updatedCharacter.standard_feats || [],
        subclass: updatedCharacter.subclass,
        subclassChoices: updatedCharacter.subclass_choices || {},
        wandType: updatedCharacter.wand_type || "",
        magicModifiers: updatedCharacter.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },
      };
      if (onSave) {
        onSave(transformedCharacter);
      }
    } catch (err) {
      setError("Failed to update character: " + err.message);
      console.error("Error updating character:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (
        !window.confirm(
          "You have unsaved changes. Are you sure you want to cancel?"
        )
      ) {
        return;
      }
    }
    onCancel();
  };

  // Effects
  useEffect(() => {
    const initialHouseChoices =
      originalCharacter?.houseChoices || originalCharacter?.house_choices || {};

    if (Object.keys(initialHouseChoices).length > 0) {
      setHouseChoices(initialHouseChoices);
    }

    const initialSubclassChoices =
      originalCharacter?.subclassChoices ||
      originalCharacter?.subclass_choices ||
      {};

    if (Object.keys(initialSubclassChoices).length > 0) {
      setCharacter((prev) => ({
        ...prev,
        subclassChoices: initialSubclassChoices,
      }));
    }
  }, [
    originalCharacter?.id,
    originalCharacter?.houseChoices,
    originalCharacter?.house_choices,
    originalCharacter?.subclassChoices,
    originalCharacter?.subclass_choices,
  ]);

  useEffect(() => {
    if (character?.house && character.house !== selectedHouse) {
      setSelectedHouse(character.house);
    }
  }, [character?.house, selectedHouse]);

  useEffect(() => {
    if (
      character.background &&
      (!character.backgroundSkills || character.backgroundSkills.length === 0)
    ) {
      const background = backgroundsData[character.background];
      if (background && background.skillProficiencies) {
        setCharacter((prev) => ({
          ...prev,
          backgroundSkills: background.skillProficiencies,
        }));
      }
    }
    // eslint-disable-next-line
  }, [character.background]);

  useEffect(() => {
    const hasAllScores = Object.values(character.abilityScores || {}).every(
      (score) => score !== null && score !== undefined
    );
    if (hasAllScores) {
      setIsManualMode(true);
      setRolledStats([]);
      setAvailableStats([]);
    }
    setLockedFields({
      level1ChoiceType:
        character.level > 1 ||
        Boolean(character.innateHeritage || character.standardFeats?.length),
      abilityScores: hasAllScores,
    });
  }, [character]);

  useEffect(() => {
    const hasChanges =
      JSON.stringify(character) !== JSON.stringify(safeOriginalCharacter);
    setHasUnsavedChanges(hasChanges);
  }, [character, safeOriginalCharacter]);

  useEffect(() => {
    if (character) {
      validateFeatSelections();
    }
    // eslint-disable-next-line
  }, [
    character.level,
    character.castingStyle,
    character.innateHeritage,
    character.subclass,
    character.standardFeats,
    character.asiChoices,
    validateFeatSelections,
  ]);

  if (!originalCharacter) {
    return (
      <div style={styles.panel}>
        <div style={{ ...styles.header, textAlign: "center" }}>
          <h1 style={styles.title}>Loading Character...</h1>
          <p style={styles.subtitle}>
            Please wait while the character data loads.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div
        style={{
          ...styles.header,
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={handleCancel}
          style={{
            ...styles.button,
            backgroundColor: theme.border,
            color: theme.textSecondary,
            padding: "8px",
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={styles.title}>Editing: {character.name}</h1>
          <p style={styles.subtitle}>
            Level {character.level} {character.castingStyle} • {character.house}
            {hasUnsavedChanges && (
              <span style={{ color: theme.warning, marginLeft: "8px" }}>
                • Unsaved changes
              </span>
            )}
          </p>
        </div>
        <div style={{ color: theme.primary }}>
          <Settings />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={styles.errorContainer}>
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* Editing Warning */}
      <div style={styles.editingWarning}>
        <AlertTriangle size={16} />
        <div>
          <strong>Editing Existing Character</strong>
          <p>
            Some fields may be locked to preserve character integrity. Use the
            lock/unlock buttons to modify restricted fields if needed.
          </p>
        </div>
      </div>

      {/* Section 1: Basic Information */}
      <BasicInformationSection
        character={character}
        handleInputChange={handleInputChange}
        calculateHitPoints={calculateHitPoints}
        getCurrentHp={getCurrentHp}
        isHpManualMode={isHpManualMode}
        setIsHpManualMode={setIsHpManualMode}
        rolledHp={rolledHp}
        setRolledHp={setRolledHp}
        rollHp={rollHp}
        styles={styles}
        theme={theme}
      />

      {/* Section 2: House and Subclass */}
      <HouseAndSubclassSection
        character={character}
        handleInputChange={handleInputChange}
        selectedHouse={selectedHouse}
        handleHouseSelect={handleHouseSelect}
        houseChoices={houseChoices}
        handleHouseChoiceSelect={handleHouseChoiceSelect}
        setCharacter={setCharacter}
        handleSkillToggle={handleSkillToggle}
        getAvailableSkills={getAvailableSkills}
        styles={styles}
        theme={theme}
      />

      {/* Section 3: Level 1 Choice and Progression */}
      <Level1AndProgressionSection
        character={character}
        handleInputChange={handleInputChange}
        handleLevel1ChoiceChange={handleLevel1ChoiceChange}
        lockedFields={lockedFields}
        toggleFieldLock={toggleFieldLock}
        expandedFeats={expandedFeats}
        setExpandedFeats={setExpandedFeats}
        featFilter={featFilter}
        setFeatFilter={setFeatFilter}
        calculateMaxFeats={calculateMaxFeats}
        getAvailableASILevels={getAvailableASILevels}
        handleASIChoiceChange={handleASIChoiceChange}
        handleASIFeatChange={handleASIFeatChange}
        handleASIAbilityChange={handleASIAbilityChange}
        asiLevelFilters={asiLevelFilters}
        setASILevelFilter={setASILevelFilter}
        getFeatProgressionInfo={getFeatProgressionInfo}
        standardFeats={standardFeats}
        styles={styles}
        theme={theme}
      />

      {/* Section 4: Ability Scores */}
      <AbilityScoresSection
        character={character}
        setCharacter={setCharacter}
        lockedFields={lockedFields}
        toggleFieldLock={toggleFieldLock}
        allStatsAssigned={allStatsAssigned}
        assignStat={assignStat}
        availableStats={availableStats}
        clearStat={clearStat}
        houseChoices={houseChoices}
        isManualMode={isManualMode}
        setIsManualMode={setIsManualMode}
        rolledStats={rolledStats}
        setRolledStats={setRolledStats}
        setAvailableStats={setAvailableStats}
        tempInputValues={tempInputValues}
        setTempInputValues={setTempInputValues}
        styles={styles}
        theme={theme}
      />

      {/* Section 5: Magic Modifiers */}
      <MagicModifiersSection
        character={character}
        handleInputChange={handleInputChange}
        magicModifierTempValues={magicModifierTempValues}
        setMagicModifierTempValues={setMagicModifierTempValues}
        styles={styles}
        theme={theme}
      />

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button
          onClick={handleCancel}
          style={{
            ...styles.button,
            backgroundColor: theme.border,
            color: theme.textSecondary,
          }}
          disabled={isSaving || !hasUnsavedChanges}
        >
          <X size={16} />
          Cancel
        </button>
        <button
          onClick={saveCharacter}
          disabled={isSaving || !hasUnsavedChanges}
          style={{
            ...styles.saveButton,
            backgroundColor: theme.primary,
            cursor: isSaving ? "not-allowed" : "pointer",
            opacity: isSaving ? 0.7 : 1,
          }}
        >
          <Save size={16} />
          {isSaving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default CharacterEditor;
