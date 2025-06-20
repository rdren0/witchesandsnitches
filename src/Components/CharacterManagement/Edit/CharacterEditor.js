import { useState, useEffect } from "react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import {
  Save,
  X,
  AlertTriangle,
  ArrowLeft,
  Settings,
  Lock,
  Unlock,
} from "lucide-react";
import { skillsByCastingStyle, hpData } from "../../data";
import { standardFeats as importedStandardFeats } from "../../standardFeatData";
import { useTheme } from "../../../contexts/ThemeContext";
import { characterService } from "../../../services/characterService";
import { createCharacterCreationStyles } from "../../../styles/masterStyles";
import { backgroundsData } from "../Shared/backgroundsData";

// Import the new section components
import BasicInformationSection from "./Sections/BasicInformationSection";
import HouseAndSubclassSection from "./Sections/HouseAndSubclassSection";
import Level1AndProgressionSection from "./Sections/Level1AndProgressionSection";
import AbilityScoresSection from "./Sections/AbilityScoresSection";
import MagicModifiersSection from "./Sections/MagicModifiersSection";
import { useCharacterSetup } from "./hooks/useCharacterSetup";
import { useFieldLocks } from "./hooks/useFieldLocks";
import { useFeatValidation } from "./hooks/useFeatValidation ";
import { useASIHandlers } from "./hooks/useASIHandlers";

const standardFeats = importedStandardFeats || [];

if (!importedStandardFeats) {
  console.warn(
    "Warning: standardFeats is undefined from data import. Using empty array as fallback."
  );
}

// Section Lock Management Hook
const useSectionLocks = () => {
  const [sectionLocks, setSectionLocks] = useState({
    basicInformation: true,
    houseAndSubclass: true,
    level1AndProgression: true,
    abilityScores: true,
    magicModifiers: true,
  });

  const toggleSectionLock = (sectionName) => {
    setSectionLocks((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const unlockAllSections = () => {
    setSectionLocks({
      basicInformation: false,
      houseAndSubclass: false,
      level1AndProgression: false,
      abilityScores: false,
      magicModifiers: false,
    });
  };

  const lockAllSections = () => {
    setSectionLocks({
      basicInformation: true,
      houseAndSubclass: true,
      level1AndProgression: true,
      abilityScores: true,
      magicModifiers: true,
    });
  };

  return {
    sectionLocks,
    toggleSectionLock,
    unlockAllSections,
    lockAllSections,
  };
};

// Section Header Component
const SectionHeader = ({
  title,
  subtitle,
  isLocked,
  onToggleLock,
  styles,
  theme,
}) => {
  return (
    <div
      style={{
        ...styles.sectionHeader,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
        padding: "12px 16px",
        backgroundColor: isLocked
          ? theme.backgroundSecondary
          : theme.backgroundTertiary,
        border: `1px solid ${isLocked ? theme.border : theme.primary}`,
        borderRadius: "8px",
        transition: "all 0.2s ease",
      }}
    >
      <div>
        <h2
          style={{
            ...styles.sectionTitle,
            margin: 0,
            fontSize: "18px",
            fontWeight: "600",
            color: isLocked ? theme.textSecondary : theme.text,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              ...styles.sectionSubtitle,
              margin: "4px 0 0 0",
              fontSize: "14px",
              color: theme.textSecondary,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <button
        onClick={onToggleLock}
        style={{
          ...styles.button,
          padding: "8px",
          backgroundColor: isLocked ? theme.warning : theme.success,
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.2s ease",
        }}
        title={
          isLocked
            ? "Click to unlock and edit this section"
            : "Click to lock this section"
        }
      >
        {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
        {isLocked ? "Locked" : "Unlocked"}
      </button>
    </div>
  );
};

const CharacterEditor = ({
  character: originalCharacter,
  onSave,
  onCancel,
  user,
}) => {
  const { theme } = useTheme();
  const styles = createCharacterCreationStyles(theme);
  const {
    character,
    setCharacter,
    selectedHouse,
    setSelectedHouse,
    houseChoices,
    setHouseChoices,
    safeOriginalCharacter,
  } = useCharacterSetup(originalCharacter);

  const {
    asiLevelFilters,
    setASILevelFilter,
    getAvailableASILevels,
    handleASIChoiceChange,
    handleASIFeatChange,
    handleASIAbilityChange,
    getFeatProgressionInfo,
  } = useASIHandlers(character, setCharacter);

  // Section locking
  const {
    sectionLocks,
    toggleSectionLock,
    unlockAllSections,
    lockAllSections,
  } = useSectionLocks();

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
  const [lockedFields, setLockedFields] = useFieldLocks(character);

  const discordUserId = user?.user_metadata?.provider_id;

  const { validateFeatSelections } = useFeatValidation({
    character,
    setError,
    standardFeats,
  });

  // Enhanced styles for locked sections
  const enhancedStyles = {
    ...styles,
    lockedSection: {
      opacity: 0.6,
      pointerEvents: "none",
      userSelect: "none",
      position: "relative",
    },
    sectionContainer: {
      marginBottom: "32px",
      transition: "all 0.3s ease",
    },
    bulkActions: {
      display: "flex",
      gap: "12px",
      marginBottom: "24px",
      justifyContent: "center",
      padding: "16px",
      backgroundColor: theme.backgroundSecondary,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
    },
  };

  const handleHouseSelect = (house) => {
    if (sectionLocks.houseAndSubclass) return;
    setSelectedHouse(house);
    handleInputChange("house", house);
  };

  const handleHouseChoiceSelect = (house, featureName, optionName) => {
    if (sectionLocks.houseAndSubclass) return;
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
    if (sectionLocks.basicInformation || !character.castingStyle) return;
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
    if (sectionLocks.abilityScores || lockedFields.abilityScores) return;
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
    if (sectionLocks.abilityScores || lockedFields.abilityScores) return;
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
    // Check section locks based on field
    const fieldSectionMap = {
      name: "basicInformation",
      level: "basicInformation",
      castingStyle: "basicInformation",
      hitPoints: "basicInformation",
      house: "houseAndSubclass",
      subclass: "houseAndSubclass",
      background: "houseAndSubclass",
      level1ChoiceType: "level1AndProgression",
      innateHeritage: "level1AndProgression",
      standardFeats: "level1AndProgression",
      wandType: "basicInformation",
      gameSession: "basicInformation",
      initiativeAbility: "basicInformation",
    };

    // Check if field starts with abilityScores
    if (field.startsWith("abilityScores.")) {
      if (sectionLocks.abilityScores) return;
    } else if (field.startsWith("magicModifiers.")) {
      if (sectionLocks.magicModifiers) return;
    } else {
      const sectionName = fieldSectionMap[field];
      if (sectionName && sectionLocks[sectionName]) return;
    }

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
    if (sectionLocks.level1AndProgression || lockedFields.level1ChoiceType)
      return;
    setCharacter((prev) => ({
      ...prev,
      level1ChoiceType: choiceType,
      innateHeritage: choiceType === "feat" ? "" : prev.innateHeritage,
      standardFeats: choiceType === "innate" ? [] : prev.standardFeats,
    }));
  };

  const handleSkillToggle = (skill) => {
    if (sectionLocks.houseAndSubclass) return;
    setCharacter((prev) => {
      const currentSkills = prev.skillProficiencies || [];
      const backgroundSkills = prev.backgroundSkills || [];
      const castingStyleSkills = getAvailableSkills({ character });

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
      return calculateHitPoints({ character });
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
      <div style={enhancedStyles.panel}>
        <div style={{ ...enhancedStyles.header, textAlign: "center" }}>
          <h1 style={enhancedStyles.title}>Loading Character...</h1>
          <p style={enhancedStyles.subtitle}>
            Please wait while the character data loads.
          </p>
        </div>
      </div>
    );
  }
  console.log({ character });
  return (
    <div style={enhancedStyles.panel}>
      {/* Header */}
      <div
        style={{
          ...enhancedStyles.header,
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={handleCancel}
          style={{
            ...enhancedStyles.button,
            backgroundColor: theme.border,
            color: theme.textSecondary,
            padding: "8px",
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={enhancedStyles.title}>Editing: {character.name}</h1>
          <p style={enhancedStyles.subtitle}>
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
        <div style={enhancedStyles.errorContainer}>
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* Editing Warning */}
      <div style={enhancedStyles.editingWarning}>
        <AlertTriangle size={16} />
        <div>
          <strong>Section-Based Editing</strong>
          <p>
            Each section is locked by default to preserve character integrity.
            Click the lock/unlock button on any section header to enable
            editing.
          </p>
        </div>
      </div>

      {/* Bulk Actions */}
      <div style={enhancedStyles.bulkActions}>
        <button
          onClick={unlockAllSections}
          style={{
            ...enhancedStyles.button,
            backgroundColor: theme.success,
            color: "white",
            padding: "8px 16px",
          }}
        >
          <Unlock size={16} />
          Unlock All Sections
        </button>
        <button
          onClick={lockAllSections}
          style={{
            ...enhancedStyles.button,
            backgroundColor: theme.warning,
            color: "white",
            padding: "8px 16px",
          }}
        >
          <Lock size={16} />
          Lock All Sections
        </button>
      </div>

      {/* Section 1: Basic Information */}
      <div style={enhancedStyles.sectionContainer}>
        <SectionHeader
          title="Basic Information"
          subtitle="Character name, level, casting style, hit points"
          isLocked={sectionLocks.basicInformation}
          onToggleLock={() => toggleSectionLock("basicInformation")}
          styles={enhancedStyles}
          theme={theme}
        />
        <div
          style={
            sectionLocks.basicInformation ? enhancedStyles.lockedSection : {}
          }
        >
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
            styles={enhancedStyles}
            theme={theme}
            isLocked={sectionLocks.basicInformation}
          />
        </div>
      </div>

      {/* Section 2: House and Subclass */}
      <div style={enhancedStyles.sectionContainer}>
        <SectionHeader
          title="House and Subclass"
          subtitle="House selection, subclass, background, and skills"
          isLocked={sectionLocks.houseAndSubclass}
          onToggleLock={() => toggleSectionLock("houseAndSubclass")}
          styles={enhancedStyles}
          theme={theme}
        />
        <div
          style={
            sectionLocks.houseAndSubclass ? enhancedStyles.lockedSection : {}
          }
        >
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
            styles={enhancedStyles}
            theme={theme}
            characterId={character.id}
            discordUserId={discordUserId}
            autoSave={true}
            onSaveError={(error) => {
              console.error("Subclass save error:", error);
              setError(`Failed to save subclass: ${error.message}`);
            }}
            onSaveSuccess={() => {
              console.log("Subclass saved successfully");
              if (error && error.includes("subclass")) {
                setError(null);
              }
            }}
            isLocked={sectionLocks.houseAndSubclass}
          />
        </div>
      </div>

      {/* Section 3: Level 1 Choice and Progression */}
      <div style={enhancedStyles.sectionContainer}>
        <SectionHeader
          title="Level 1 Choice and Progression"
          subtitle="Level 1 feat or heritage choice, ASI progression"
          isLocked={sectionLocks.level1AndProgression}
          onToggleLock={() => toggleSectionLock("level1AndProgression")}
          styles={enhancedStyles}
          theme={theme}
        />
        <div
          style={
            sectionLocks.level1AndProgression
              ? enhancedStyles.lockedSection
              : {}
          }
        >
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
            styles={enhancedStyles}
            theme={theme}
            isLocked={sectionLocks.level1AndProgression}
          />
        </div>
      </div>

      {/* Section 4: Ability Scores */}
      <div style={enhancedStyles.sectionContainer}>
        <SectionHeader
          title="Ability Scores"
          subtitle="Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma"
          isLocked={sectionLocks.abilityScores}
          onToggleLock={() => toggleSectionLock("abilityScores")}
          styles={enhancedStyles}
          theme={theme}
        />
        <div
          style={sectionLocks.abilityScores ? enhancedStyles.lockedSection : {}}
        >
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
            styles={enhancedStyles}
            theme={theme}
            isLocked={sectionLocks.abilityScores}
          />
        </div>
      </div>

      {/* Section 5: Magic Modifiers */}
      <div style={enhancedStyles.sectionContainer}>
        <SectionHeader
          title="Magic Modifiers"
          subtitle="Divinations, Charms, Transfiguration, Healing, Jinxes/Hexes/Curses"
          isLocked={sectionLocks.magicModifiers}
          onToggleLock={() => toggleSectionLock("magicModifiers")}
          styles={enhancedStyles}
          theme={theme}
        />
        <div
          style={
            sectionLocks.magicModifiers ? enhancedStyles.lockedSection : {}
          }
        >
          <MagicModifiersSection
            character={character}
            handleInputChange={handleInputChange}
            magicModifierTempValues={magicModifierTempValues}
            setMagicModifierTempValues={setMagicModifierTempValues}
            styles={enhancedStyles}
            theme={theme}
            isLocked={sectionLocks.magicModifiers}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={enhancedStyles.actionButtons}>
        <button
          onClick={handleCancel}
          style={{
            ...enhancedStyles.button,
            backgroundColor: theme.border,
            color: theme.textSecondary,
          }}
          disabled={isSaving}
        >
          <X size={16} />
          Cancel
        </button>
        <button
          onClick={saveCharacter}
          disabled={isSaving || !hasUnsavedChanges}
          style={{
            ...enhancedStyles.saveButton,
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
