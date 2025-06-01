import { useState, useEffect, useCallback } from "react";

import { WandIcon, Dices, Trash2, User, Save } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles } from "./styles";

import {
  castingStyles,
  housesBySchool,
  skillsByCastingStyle,
  hpData,
  subclasses,
  innateHeritages,
  backgrounds,
  standardFeats,
} from "../data";
import { characterService } from "../../services/characterService";
import { SavedCharacters } from "./SavedCharacters";

const MAX_CHARACTERS = 10;

const CharacterCreationForm = ({
  user,
  customUsername,
  onCharacterSaved,
  selectedCharacterId,
  onSelectedCharacterReset,
}) => {
  const { theme, themeMode, setThemeMode, setSelectedCharacter } = useTheme();
  const styles = createThemedStyles(theme);

  const getInitialCharacterState = () => ({
    name: "",
    house: "",
    castingStyle: "",
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
  });

  const getGameSessionOptions = () => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const times = ["AM", "PM"];
    const options = [];

    days.forEach((day) => {
      times.forEach((time) => {
        options.push(`${day} ${time}`);
      });
    });

    return options;
  };

  const gameSessionOptions = getGameSessionOptions();

  const [character, setCharacter] = useState(getInitialCharacterState());
  const [rolledStats, setRolledStats] = useState([]);
  const [availableStats, setAvailableStats] = useState([]);
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedFeats, setExpandedFeats] = useState(new Set());
  const [featFilter, setFeatFilter] = useState("");
  const [isManualMode, setIsManualMode] = useState(false);
  const [tempInputValues, setTempInputValues] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const discordUserId = user?.user_metadata?.provider_id;

  const rollStat = () => {
    const rolls = [];
    for (let i = 0; i < 4; i++) {
      rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
  };

  const rollAllStats = () => {
    const newStats = [];
    for (let i = 0; i < 6; i++) {
      newStats.push(rollStat());
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

  const toggleManualMode = () => {
    const newManualMode = !isManualMode;
    setIsManualMode(newManualMode);

    if (newManualMode) {
      setRolledStats([]);
      setAvailableStats([]);
    } else {
      rollAllStats();
    }
  };

  const createNewCharacter = () => {
    setCharacter(getInitialCharacterState());
    setIsEditing(false);
    setEditingId(null);
    setExpandedFeats(new Set());
    setFeatFilter("");
    setTempInputValues({});

    if (isManualMode) {
      setRolledStats([]);
      setAvailableStats([]);
    } else {
      rollAllStats();
    }
  };

  const handleManualScoreChange = (ability, value) => {
    setTempInputValues((prev) => ({
      ...prev,
      [ability]: value,
    }));

    if (value === "") {
      setCharacter((prev) => ({
        ...prev,
        abilityScores: {
          ...prev.abilityScores,
          [ability]: null,
        },
      }));
    }
  };

  const handleManualScoreBlur = (ability) => {
    const tempValue = tempInputValues[ability];
    if (tempValue && tempValue !== "") {
      const numericValue = parseInt(tempValue, 10);
      if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 30) {
        setCharacter((prev) => ({
          ...prev,
          abilityScores: {
            ...prev.abilityScores,
            [ability]: numericValue,
          },
        }));
      }
    }

    setTimeout(() => {
      setTempInputValues((prev) => {
        const newTemp = { ...prev };
        delete newTemp[ability];
        return newTemp;
      });
    }, 0);
  };

  const loadCharacters = useCallback(async () => {
    if (!discordUserId) return;
    setIsLoading(true);
    setError(null);
    try {
      const characters = await characterService.getCharacters(discordUserId);

      const transformedCharacters = characters.map((char) => ({
        id: char.id,
        name: char.name,
        house: char.house,
        castingStyle: char.casting_style,
        subclass: char.subclass,
        innateHeritage: char.innate_heritage,
        background: char.background,
        gameSession: char.game_session || "",
        standardFeats: char.standard_feats || [],
        skillProficiencies: char.skill_proficiencies || [],
        abilityScores: char.ability_scores,
        hitPoints: char.hit_points,
        level: char.level,
        wandType: char.wand_type || "",
        magicModifiers: char.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },
      }));
      setSavedCharacters(transformedCharacters);
    } catch (err) {
      setError("Failed to load characters: " + err.message);
      console.error("Error loading characters:", err);
    } finally {
      setIsLoading(false);
    }
  }, [discordUserId]);

  useEffect(() => {
    rollAllStats();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (discordUserId) {
      loadCharacters();
    }
    // eslint-disable-next-line
  }, [discordUserId, loadCharacters]);

  if (!user || !discordUserId) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.wandIconColor}>
            <WandIcon />
          </div>
          <h1 style={styles.title}>Witches & Snitches Character Creator</h1>
        </div>
        <div style={styles.authRequired}>
          <h2 style={styles.authRequiredTitle}>Authentication Required</h2>
          <p style={styles.authRequiredText}>
            Please log in with Discord to create and manage your characters.
          </p>
        </div>
      </div>
    );
  }

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
        }));
      } else {
        setCharacter((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    }
  };

  const handleFeatToggle = (featName) => {
    setCharacter((prev) => {
      const currentFeats = prev.standardFeats;
      const isCurrentlySelected = currentFeats.includes(featName);

      if (!isCurrentlySelected && currentFeats.length >= 2) {
        return prev;
      }

      return {
        ...prev,
        standardFeats: isCurrentlySelected
          ? currentFeats.filter((f) => f !== featName)
          : [...currentFeats, featName],
      };
    });
  };

  const toggleFeatExpansion = (featName) => {
    setExpandedFeats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(featName)) {
        newSet.delete(featName);
      } else {
        newSet.add(featName);
      }
      return newSet;
    });
  };

  const getFilteredFeats = () => {
    if (character.standardFeats.length === 2) {
      return standardFeats.filter((feat) =>
        character.standardFeats.includes(feat.name)
      );
    }

    if (!featFilter.trim()) return standardFeats;

    const searchTerm = featFilter.toLowerCase();
    return standardFeats.filter(
      (feat) =>
        feat.name.toLowerCase().includes(searchTerm) ||
        feat.preview.toLowerCase().includes(searchTerm) ||
        feat.description.toLowerCase().includes(searchTerm)
    );
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

    return baseHP + additionalHP;
  };

  const saveCharacter = async () => {
    setIsSaving(true);
    setError(null);

    const characterToSave = {
      ...character,
      hitPoints: calculateHitPoints(),
    };
    try {
      if (isEditing && editingId) {
        const updatedCharacter = await characterService.updateCharacter(
          editingId,
          characterToSave,
          discordUserId
        );

        setSavedCharacters((prev) =>
          prev.map((char) =>
            char.id === editingId
              ? {
                  id: updatedCharacter.id,
                  name: updatedCharacter.name,
                  house: updatedCharacter.house,
                  castingStyle: updatedCharacter.casting_style,
                  subclass: updatedCharacter.subclass,
                  innateHeritage: updatedCharacter.innate_heritage,
                  background: updatedCharacter.background,
                  gameSession: updatedCharacter.game_session || "",
                  standardFeats: updatedCharacter.standard_feats || [],
                  skillProficiencies:
                    updatedCharacter.skill_proficiencies || [],
                  abilityScores: updatedCharacter.ability_scores,
                  hitPoints: updatedCharacter.hit_points,
                  level: updatedCharacter.level,
                  wandType: updatedCharacter.wand_type || "",
                  magicModifiers: updatedCharacter.magic_modifiers || {
                    divinations: 0,
                    charms: 0,
                    transfiguration: 0,
                    healing: 0,
                    jinxesHexesCurses: 0,
                  },
                }
              : char
          )
        );

        setIsEditing(false);
        setEditingId(null);
      } else {
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
          level: savedCharacter.level,
          wandType: savedCharacter.wand_type || "",
          magicModifiers: savedCharacter.magic_modifiers || {
            divinations: 0,
            charms: 0,
            transfiguration: 0,
            healing: 0,
            jinxesHexesCurses: 0,
          },
        };

        setSavedCharacters((prev) => [transformedCharacter, ...prev]);
      }

      setCharacter(getInitialCharacterState());
      if (!isManualMode) {
        rollAllStats();
      }

      if (onCharacterSaved) {
        onCharacterSaved();
      }
    } catch (err) {
      setError("Failed to save character: " + err.message);
      console.error("Error saving character:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const editCharacter = (character) => {
    setCharacter({
      name: character.name,
      house: character.house,
      castingStyle: character.castingStyle,
      subclass: character.subclass,
      innateHeritage: character.innateHeritage,
      background: character.background,
      gameSession: character.gameSession || "",
      standardFeats: character.standardFeats,
      skillProficiencies: character.skillProficiencies,
      abilityScores: character.abilityScores,
      hitPoints: character.hitPoints,
      level: character.level,
      wandType: character.wandType || "",
      magicModifiers: character.magicModifiers || {
        divinations: 0,
        charms: 0,
        transfiguration: 0,
        healing: 0,
        jinxesHexesCurses: 0,
      },
    });

    const hasAllScores = Object.values(character.abilityScores).every(
      (score) => score !== null
    );

    if (hasAllScores) {
      setIsManualMode(true);
      setRolledStats([]);
      setAvailableStats([]);
    } else {
      const assignedStats = Object.values(character.abilityScores).filter(
        (score) => score !== null
      );
      setRolledStats(assignedStats);
      setAvailableStats([]);
      setIsManualMode(false);
    }

    setIsEditing(true);
    setEditingId(character.id);
  };

  const deleteCharacter = async (id) => {
    if (!window.confirm("Are you sure you want to delete this character?")) {
      return;
    }

    try {
      await characterService.deleteCharacter(id, discordUserId);

      const wasSelected =
        selectedCharacterId && selectedCharacterId.toString() === id.toString();

      const updatedCharacters = savedCharacters.filter(
        (char) => char.id !== id
      );
      setSavedCharacters(updatedCharacters);

      if (wasSelected) {
        if (updatedCharacters.length > 0) {
          const newSelectedCharacter = updatedCharacters[0];
          sessionStorage.setItem(
            "selectedCharacterId",
            newSelectedCharacter.id.toString()
          );

          if (onSelectedCharacterReset) {
            onSelectedCharacterReset(newSelectedCharacter);
          }
        } else {
          sessionStorage.removeItem("selectedCharacterId");
          if (onSelectedCharacterReset) {
            onSelectedCharacterReset(null);
          }
        }
      }
    } catch (err) {
      setError("Failed to delete character: " + err.message);
      console.error("Error deleting character:", err);
    }
  };

  const getAbilityModifier = (score) => {
    if (score === null || score === undefined) return 0;
    return Math.floor((score - 10) / 2);
  };

  const isSaveEnabled =
    character.name &&
    character.house &&
    character.castingStyle &&
    allStatsAssigned() &&
    !isSaving &&
    (isEditing || savedCharacters.length < MAX_CHARACTERS);

  const filteredFeats = getFilteredFeats();

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.header,
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div style={{ color: "#8B5CF6" }}>
          <WandIcon />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={styles.title}>Witches & Snitches Character Creator</h1>
          {user && (
            <div style={styles.userAvatarContainer}>
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                style={styles.userAvatar}
              />
              <span style={styles.userWelcomeText}>
                Welcome, {customUsername ?? user.user_metadata.full_name}!
              </span>
            </div>
          )}
        </div>
      </div>
      {error && <div style={styles.errorDisplay}>{error}</div>}
      <div style={styles.mainGrid}>
        <div style={styles.panel}>
          <h2 style={styles.sectionHeader}>
            <User />
            {isEditing ? "Edit Character" : "Create Character"}
          </h2>

          <div style={styles.fieldContainer}>
            <label style={styles.label}>Character Name</label>
            <input
              type="text"
              value={character.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter character name..."
              style={styles.input}
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
              Select which day and time your character's game session takes
              place.
            </div>
          </div>

          <div style={styles.fieldContainer}>
            <label style={styles.label}>House</label>
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
            <label style={styles.label}>Casting Style</label>
            <select
              value={character.castingStyle}
              onChange={(e) =>
                handleInputChange("castingStyle", e.target.value)
              }
              style={styles.select}
            >
              <option value="">Select Casting Style...</option>
              {castingStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.levelHpGrid}>
            <div>
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
            </div>
            <div>
              <label style={styles.label}>Hit Points (Calculated)</label>
              <div style={styles.hpDisplay}>{calculateHitPoints()}</div>
            </div>
          </div>

          <div style={styles.fieldContainer}>
            <h3 style={styles.skillsHeader}>
              Skill Proficiencies ({character.skillProficiencies.length}/2
              selected)
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
                    const isSelected =
                      character.skillProficiencies.includes(skill);
                    const canSelect =
                      isSelected || character.skillProficiencies.length < 2;

                    return (
                      <label
                        key={skill}
                        style={{
                          ...styles.skillOptionBase,
                          ...(isSelected
                            ? styles.skillOptionSelected
                            : canSelect
                            ? styles.skillOptionUnselected
                            : styles.skillOptionDisabled),
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
                          style={
                            isSelected
                              ? styles.skillTextSelected
                              : styles.skillTextUnselected
                          }
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

            <div style={styles.helpText}>
              Note: Each casting style has access to specific skills. You can
              choose up to 2 skills from your casting style's list.
            </div>
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

          <div style={styles.fieldContainer}>
            <label style={styles.label}>Innate Heritage</label>
            <select
              value={character.innateHeritage}
              onChange={(e) =>
                handleInputChange("innateHeritage", e.target.value)
              }
              style={styles.select}
            >
              <option value="">Select Heritage...</option>
              {innateHeritages.map((heritage) => (
                <option key={heritage} value={heritage}>
                  {heritage}
                </option>
              ))}
            </select>
          </div>

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

          <div style={styles.fieldContainer}>
            <div style={styles.abilityScoresHeader}>
              <h3 style={styles.abilityScoresTitle}>Ability Scores</h3>

              <div style={styles.buttonGroup}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  {!isManualMode && (
                    <button
                      onClick={rollAllStats}
                      style={{
                        ...styles.button,
                        ...styles.rollStatsButton,
                      }}
                    >
                      <Dices />
                      Roll For Stats
                    </button>
                  )}
                </div>
                <div
                  onClick={toggleManualMode}
                  style={{
                    ...styles.toggleContainer,
                    ...(isManualMode
                      ? styles.toggleActive
                      : styles.toggleInactive),
                  }}
                >
                  <div
                    style={{
                      ...styles.toggleSlider,
                      ...(isManualMode
                        ? styles.toggleSliderActive
                        : styles.toggleSliderInactive),
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={styles.helpText}>
              {isManualMode
                ? "Manual input mode - enter ability scores directly"
                : "Roll mode - assign generated stats to abilities"}
            </div>

            {!isManualMode && (
              <div style={styles.availableStats}>
                <div style={styles.availableStatsHeader}>
                  <span style={styles.availableStatsLabel}>
                    Available Stats to Assign:
                  </span>
                  <span style={styles.availableStatsTotal}>
                    Total: {rolledStats.reduce((sum, stat) => sum + stat, 0)}
                    {allStatsAssigned() && (
                      <span style={styles.completeIndicator}>✓ Complete</span>
                    )}
                  </span>
                </div>
                <div style={styles.statsContainer}>
                  {availableStats.length > 0 ? (
                    availableStats.map((stat, index) => (
                      <span key={index} style={styles.statBadge}>
                        {stat} ({getAbilityModifier(stat) >= 0 ? "+" : ""}
                        {getAbilityModifier(stat)})
                      </span>
                    ))
                  ) : (
                    <span style={styles.allAssignedText}>
                      All stats assigned!
                    </span>
                  )}
                </div>
              </div>
            )}

            <div style={styles.abilityGrid}>
              {Object.entries(character.abilityScores).map(
                ([ability, score]) => (
                  <div
                    key={ability}
                    style={{
                      ...styles.abilityCard,
                      ...(score !== null
                        ? styles.abilityCardAssigned
                        : styles.abilityCardEmpty),
                    }}
                  >
                    <div style={styles.abilityName}>{ability}</div>

                    {score !== null ? (
                      <>
                        <div style={styles.abilityModifier}>
                          {getAbilityModifier(score) >= 0 ? "+" : ""}
                          {getAbilityModifier(score)}
                        </div>

                        <div style={styles.abilityScoreContainer}>
                          {isManualMode ? (
                            <input
                              type="number"
                              min="1"
                              value={
                                tempInputValues[ability] !== undefined
                                  ? tempInputValues[ability]
                                  : score === null
                                  ? ""
                                  : score
                              }
                              onChange={(e) =>
                                handleManualScoreChange(ability, e.target.value)
                              }
                              onBlur={() => handleManualScoreBlur(ability)}
                              style={styles.manualInput}
                            />
                          ) : (
                            <div style={styles.abilityScore}>{score}</div>
                          )}
                          <button
                            onClick={() => clearStat(ability)}
                            style={styles.trashButton}
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={styles.abilityModifierEmpty}>--</div>
                        {isManualMode ? (
                          <input
                            type="number"
                            min="1"
                            placeholder="Enter..."
                            value={tempInputValues[ability] || ""}
                            onChange={(e) =>
                              handleManualScoreChange(ability, e.target.value)
                            }
                            onBlur={() => handleManualScoreBlur(ability)}
                            style={{
                              ...styles.input,
                              textAlign: "center",
                              fontSize: "16px",
                              width: "80px",
                              padding: "4px",
                            }}
                          />
                        ) : (
                          <select
                            value=""
                            onChange={(e) =>
                              assignStat(ability, parseInt(e.target.value))
                            }
                            style={styles.assignSelect}
                          >
                            <option value="">Assign...</option>
                            {availableStats.map((stat, index) => (
                              <option key={index} value={stat}>
                                {stat} (
                                {getAbilityModifier(stat) >= 0 ? "+" : ""}
                                {getAbilityModifier(stat)})
                              </option>
                            ))}
                          </select>
                        )}
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div style={styles.fieldContainer}>
            <h3 style={styles.skillsHeader}>
              Standard Feats ({character.standardFeats.length}/2 selected)
            </h3>

            {character.standardFeats.length < 2 && (
              <div style={styles.featFilterContainer}>
                <input
                  type="text"
                  placeholder="Search feats by name, preview, or description..."
                  value={featFilter}
                  onChange={(e) => setFeatFilter(e.target.value)}
                  style={styles.featFilterInput}
                  onFocus={(e) => {
                    Object.assign(
                      e.target.style,
                      styles.featFilterInputFocusThemed
                    );
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#F59E0B";
                    e.target.style.boxShadow =
                      "inset 0 2px 6px rgba(245,158,11,0.2), 0 2px 4px rgba(0,0,0,0.1)";
                  }}
                />
                {featFilter.trim() && (
                  <button
                    onClick={() => setFeatFilter("")}
                    style={styles.featFilterClearButton}
                    onMouseEnter={(e) => {
                      Object.assign(
                        e.target.style,
                        styles.featFilterClearButtonHoverThemed
                      );
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(
                        e.target.style,
                        styles.featFilterClearButton
                      );
                    }}
                  >
                    ×
                  </button>
                )}
                {featFilter.trim() && (
                  <div style={styles.featFilterResults}>
                    Showing {filteredFeats.length} of {standardFeats.length}{" "}
                    feats
                  </div>
                )}
              </div>
            )}

            {character.standardFeats.length === 2 && (
              <div style={styles.featCompleteMessage}>
                ✓ Feat selection complete! Showing your 2 selected feats.
                Uncheck one to see all feats again.
              </div>
            )}

            <div style={styles.featsContainer}>
              {filteredFeats.length === 0 ? (
                <div style={styles.noFeatsFound}>
                  No feats found matching "{featFilter}". Try a different search
                  term.
                </div>
              ) : (
                filteredFeats.map((feat) => {
                  const isSelected = character.standardFeats.includes(
                    feat.name
                  );
                  return (
                    <div
                      key={feat.name}
                      style={
                        isSelected ? styles.featCardSelected : styles.featCard
                      }
                    >
                      <div style={styles.featHeader}>
                        <label style={styles.featLabelClickable}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleFeatToggle(feat.name)}
                            style={{
                              width: "18px",
                              height: "18px",
                              marginRight: "8px",
                              cursor: "pointer",
                              accentColor: "#8B5CF6",
                              transform: "scale(1.2)",
                            }}
                          />
                          <span
                            style={
                              isSelected
                                ? styles.featNameSelected
                                : styles.featName
                            }
                          >
                            {feat.name}
                          </span>
                        </label>
                        <button
                          onClick={() => toggleFeatExpansion(feat.name)}
                          style={styles.expandButton}
                          type="button"
                        >
                          {expandedFeats.has(feat.name) ? "▲" : "▼"}
                        </button>
                      </div>

                      <div
                        style={
                          isSelected
                            ? styles.featPreviewSelected
                            : styles.featPreview
                        }
                      >
                        {feat.preview}
                      </div>

                      {expandedFeats.has(feat.name) && (
                        <div
                          style={
                            isSelected
                              ? styles.featDescriptionSelected
                              : styles.featDescription
                          }
                        >
                          {feat.description}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <div style={styles.helpText}>
              Note: You can select up to 2 standard feats. Standard feats are
              optional and may have prerequisites. Click the + button to see
              full descriptions.
            </div>
          </div>

          <div style={styles.fieldContainer}>
            <h3 style={styles.skillsHeader}>Magic School Modifiers</h3>
            <div style={styles.helpText}>
              Enter your wand's bonuses/penalties for each school of magic
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                alignItems: "end",
                justifyContent: "space-between",
              }}
            >
              {[
                { key: "divinations", label: "Divinations" },
                { key: "charms", label: "Charms" },
                { key: "transfiguration", label: "Transfiguration" },
                { key: "healing", label: "Healing" },
                { key: "jinxesHexesCurses", label: "JHC" },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: "1",
                    minWidth: "80px",
                  }}
                >
                  <label
                    style={{
                      ...styles.label,
                      fontSize: "14px",
                      marginBottom: "4px",
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type="number"
                    value={character.magicModifiers[key]}
                    onChange={(e) =>
                      handleInputChange(
                        `magicModifiers.${key}`,
                        parseInt(e.target.value) || 0
                      )
                    }
                    style={{
                      ...styles.input,
                      width: "60px",
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {!isEditing && savedCharacters.length >= MAX_CHARACTERS && (
            <div
              style={{
                backgroundColor: "#FEE2E2",
                border: "2px solid #EF4444",
                color: "#DC2626",
                padding: "16px",
                borderRadius: "8px",
                margin: "16px 0",
                fontSize: "14px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              ⚠️ Character Limit Reached
              <div style={{ marginTop: "8px", fontWeight: "normal" }}>
                You have reached the maximum of {MAX_CHARACTERS} characters.
                Delete an existing character to create a new one.
              </div>
            </div>
          )}

          <button
            onClick={saveCharacter}
            disabled={!isSaveEnabled}
            style={{
              ...styles.saveButton,
              backgroundColor: isSaveEnabled ? "#8B5CF6" : "#9CA3AF",
              cursor: isSaveEnabled ? "pointer" : "not-allowed",
            }}
          >
            <Save />
            {isSaving
              ? "Saving..."
              : isEditing
              ? "Update Character"
              : savedCharacters.length >= MAX_CHARACTERS
              ? "Character Limit Reached"
              : "Save Character"}
          </button>

          {!isEditing &&
            savedCharacters.length >= MAX_CHARACTERS - 2 &&
            savedCharacters.length < MAX_CHARACTERS && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#F59E0B",
                  textAlign: "center",
                  marginTop: "8px",
                  fontStyle: "italic",
                }}
              >
                {savedCharacters.length === MAX_CHARACTERS - 1
                  ? "You can create 1 more character before reaching the limit."
                  : `You can create ${
                      MAX_CHARACTERS - savedCharacters.length
                    } more characters.`}
              </div>
            )}
        </div>

        <div style={styles.panel}>
          {isEditing && (
            <div style={{ marginBottom: "20px" }}>
              <button
                onClick={createNewCharacter}
                style={styles.newCharacterButton}
                onMouseEnter={(e) => {
                  Object.assign(e.target.style, styles.newCharacterButtonHover);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.target.style, styles.newCharacterButton);
                }}
              >
                <WandIcon />
                Create New Character
              </button>
              <div style={styles.newCharacter}>
                This will abandon any unsaved changes to the current character
              </div>
            </div>
          )}
          <SavedCharacters
            isLoading={isLoading}
            savedCharacters={savedCharacters}
            editCharacter={editCharacter}
            deleteCharacter={deleteCharacter}
            maxCharacters={MAX_CHARACTERS}
          />
        </div>
      </div>

      <div
        style={{ margin: "20px 0", padding: "10px", border: "2px solid red" }}
      >
        <h3>THEME TEST (Remove this later)</h3>
        <p>Current theme mode: {themeMode}</p>
        <p>Current theme primary: {theme.primary}</p>
        <button
          onClick={() => {
            setSelectedCharacter({ house: "Gryffindor", name: "Test" });
            setThemeMode("house");
          }}
          style={{
            margin: "5px",
            padding: "10px",
            background: "#740001",
            color: "white",
          }}
        >
          Test Gryffindor Theme
        </button>
        <button
          onClick={() => setThemeMode("light")}
          style={{
            margin: "5px",
            padding: "10px",
            background: "#6366F1",
            color: "white",
          }}
        >
          Back to Light
        </button>
      </div>
    </div>
  );
};

export default CharacterCreationForm;
