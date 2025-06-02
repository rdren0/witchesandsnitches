import { useState, useEffect, useCallback } from "react";
import { WandIcon, SaveIcon, UserIcon } from "../../icons";

import {
  castingStyles,
  housesBySchool,
  skillsByCastingStyle,
  hpData,
  subclasses,
  backgrounds,
} from "../data";
import { styles } from "./styles";
import { characterService } from "../../services/characterService";
import { SavedCharacters } from "./SavedCharacters";
import { InnateHeritage } from "./InnateHeritage";
import { StandardFeat } from "./StandardFeat";
import { AbilityScorePicker } from "./AbilityScorePicker";

const MAX_CHARACTERS = 10;

const CharacterCreationForm = ({
  user,
  customUsername,
  onCharacterSaved,
  selectedCharacterId,
  onSelectedCharacterReset,
}) => {
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
    level1ChoiceType: "", // "innate" or "feat"
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
    const options = [];

    sessions.forEach((session) => {
      options.push(`${session}`);
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
  const [tempInputValues, setTempInputValues] = useState({});
  const [isManualMode, setIsManualMode] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const discordUserId = user?.user_metadata?.provider_id;

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
  const rollStat = () => {
    const rolls = [];
    for (let i = 0; i < 4; i++) {
      rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
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
        level1ChoiceType: char.level1_choice_type || "",
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
          <div style={{ color: "#8B5CF6" }}>
            <WandIcon />
          </div>
          <h1 style={styles.title}>Witches & Snitches Character Creator</h1>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#FEF3C7",
            border: "1px solid #F59E0B",
            borderRadius: "8px",
            margin: "20px",
          }}
        >
          <h2 style={{ color: "#92400E", marginBottom: "16px" }}>
            Authentication Required
          </h2>
          <p style={{ color: "#92400E" }}>
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
      } else if (field === "level") {
        setCharacter((prev) => ({
          ...prev,
          [field]: value,
          // Reset level 1 choice if level changes from 1
          level1ChoiceType: value === 1 ? prev.level1ChoiceType : "",
          innateHeritage: value === 1 ? prev.innateHeritage : "",
        }));
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
      // Clear the other option when switching
      innateHeritage: choiceType === "feat" ? "" : prev.innateHeritage,
      standardFeats: choiceType === "innate" ? [] : prev.standardFeats,
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
                  level1ChoiceType: updatedCharacter.level1_choice_type || "",
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
          level1ChoiceType: savedCharacter.level1_choice_type || "",
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
      level1ChoiceType: character.level1ChoiceType || "",
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

  const isSaveEnabled =
    character.name &&
    character.house &&
    character.castingStyle &&
    allStatsAssigned() &&
    !isSaving &&
    (isEditing || savedCharacters.length < MAX_CHARACTERS);

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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "8px",
                fontSize: "14px",
                color: "#6B7280",
              }}
            >
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "2px solid #8B5CF6",
                }}
              />
              <span style={{ color: "#eee" }}>
                Welcome, {customUsername ?? user.user_metadata.full_name}!
              </span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#FEE2E2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            padding: "12px",
            borderRadius: "8px",
            margin: "16px 0",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <div style={styles.mainGrid}>
        <div style={styles.panel}>
          <h2 style={styles.sectionHeader}>
            <UserIcon />
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
              Select which session your character is in.
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
                          cursor: canSelect ? "pointer" : "not-allowed",
                          backgroundColor: isSelected ? "#F0FDF4" : "white",
                          border: isSelected
                            ? "2px solid #10B981"
                            : "2px solid #E5E7EB",
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
                            color: isSelected ? "#059669" : "#374151",
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

          {/* Level 1 Choice Section */}
          {character.level === 1 && (
            <div style={styles.fieldContainer}>
              <h3 style={styles.skillsHeader}>Level 1 Choice</h3>
              <div style={styles.helpText}>
                At level 1, you can choose either an Innate Heritage or a
                Standard Feat.
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    ...styles.skillOptionBase,
                    cursor: "pointer",
                    backgroundColor:
                      character.level1ChoiceType === "innate"
                        ? "#F0FDF4"
                        : "white",
                    border:
                      character.level1ChoiceType === "innate"
                        ? "2px solid #10B981"
                        : "2px solid #E5E7EB",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="radio"
                    name="level1Choice"
                    value="innate"
                    checked={character.level1ChoiceType === "innate"}
                    onChange={(e) => handleLevel1ChoiceChange(e.target.value)}
                    style={{ marginRight: "8px" }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      color:
                        character.level1ChoiceType === "innate"
                          ? "#059669"
                          : "#374151",
                      fontWeight:
                        character.level1ChoiceType === "innate"
                          ? "bold"
                          : "normal",
                    }}
                  >
                    Innate Heritage
                  </span>
                </label>

                <label
                  style={{
                    ...styles.skillOptionBase,
                    cursor: "pointer",
                    backgroundColor:
                      character.level1ChoiceType === "feat"
                        ? "#F0FDF4"
                        : "white",
                    border:
                      character.level1ChoiceType === "feat"
                        ? "2px solid #10B981"
                        : "2px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="radio"
                    name="level1Choice"
                    value="feat"
                    checked={character.level1ChoiceType === "feat"}
                    onChange={(e) => handleLevel1ChoiceChange(e.target.value)}
                    style={{ marginRight: "8px" }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      color:
                        character.level1ChoiceType === "feat"
                          ? "#059669"
                          : "#374151",
                      fontWeight:
                        character.level1ChoiceType === "feat"
                          ? "bold"
                          : "normal",
                    }}
                  >
                    Standard Feat
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Conditionally render Innate Heritage or Standard Feat based on level and choice */}
          {character.level === 1 && character.level1ChoiceType === "innate" && (
            <InnateHeritage
              character={character}
              handleInputChange={handleInputChange}
            />
          )}

          {((character.level === 1 && character.level1ChoiceType === "feat") ||
            character.level > 1) && (
            <StandardFeat
              character={character}
              setCharacter={setCharacter}
              expandedFeats={expandedFeats}
              setExpandedFeats={setExpandedFeats}
              featFilter={featFilter}
              setFeatFilter={setFeatFilter}
            />
          )}

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
            setIsManualMode={setIsManualMode}
            rolledStats={rolledStats}
          />

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
            <SaveIcon />
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
                  e.target.style.backgroundColor = "#059669";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(16, 185, 129, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#10B981";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
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
    </div>
  );
};

export default CharacterCreationForm;
