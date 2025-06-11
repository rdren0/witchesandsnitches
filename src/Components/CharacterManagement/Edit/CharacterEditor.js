import { useState, useEffect } from "react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import {
  Save,
  X,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Settings,
  Lock,
  Unlock,
} from "lucide-react";

import {
  castingStyles,
  housesBySchool,
  skillsByCastingStyle,
  hpData,
  subclasses,
  backgrounds,
} from "../../data";

import { useTheme } from "../../../contexts/ThemeContext";
import { characterService } from "../../../services/characterService";
import { InnateHeritage } from "../Shared/InnateHeritage";
import { StandardFeat } from "../Shared/StandardFeat";
import { AbilityScorePicker } from "../Shared/AbilityScorePicker";
import { createCharacterCreationStyles } from "../../../styles/masterStyles";

const CharacterEditor = ({
  character: originalCharacter,
  onSave,
  onCancel,
  user,
  customUsername,
  supabase,
}) => {
  const { theme } = useTheme();
  const styles = createCharacterCreationStyles(theme);

  const inferLevel1ChoiceType = (character) => {
    if (character.level1ChoiceType) {
      return character.level1ChoiceType;
    }

    if (character.innateHeritage && character.innateHeritage.trim() !== "") {
      return "innate";
    }

    if (character.standardFeats && character.standardFeats.length > 0) {
      return "feat";
    }

    return "";
  };

  const [character, setCharacter] = useState(() => {
    const characterWithLevel1Choice = {
      ...originalCharacter,
      level1ChoiceType: inferLevel1ChoiceType(originalCharacter),
    };
    return characterWithLevel1Choice;
  });
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
  const [lockedFields, setLockedFields] = useState({
    level1ChoiceType: true,
    abilityScores: true,
  });

  const discordUserId = user?.user_metadata?.provider_id;

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
      JSON.stringify(character) !== JSON.stringify(originalCharacter);
    setHasUnsavedChanges(hasChanges);
  }, [character, originalCharacter]);

  const gameSessionOptions = [
    "Sunday - Knights",
    "Monday - Haunting",
    "Tuesday - Knights",
    "Wednesday - Haunting",
    "Thursday - Knights",
    "Friday - Knights",
    "Saturday - Haunting",
    "Saturday - Knights",
  ];

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
        setRolledHp(null);
      } else if (field === "level") {
        const newLevel = parseInt(value) || 1;
        setCharacter((prev) => ({
          ...prev,
          [field]: newLevel,
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
    return character.level;
  };

  const toggleFieldLock = (fieldName) => {
    setLockedFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const saveCharacter = async () => {
    setIsSaving(true);
    setError(null);

    if (!character.name?.trim()) {
      setError("Character name is required");
      setIsSaving(false);
      return;
    }

    const characterToSave = {
      name: character.name.trim(),
      house: character.house,
      casting_style: character.castingStyle,
      subclass: character.subclass,
      innate_heritage: character.innateHeritage,
      background: character.background,
      game_session: character.gameSession,
      standard_feats: character.standardFeats || [],
      skill_proficiencies: character.skillProficiencies || [],
      ability_scores: character.abilityScores,
      hit_points: getCurrentHp(),
      asi_choices: character.asiChoices || {},
      level: character.level,
      wand_type: character.wandType,
      magic_modifiers: character.magicModifiers,
      level1_choice_type: character.level1ChoiceType,
    };

    try {
      const updatedCharacter = await characterService.updateCharacter(
        character.id,
        characterToSave,
        discordUserId
      );

      const transformedCharacter = {
        id: updatedCharacter.id,
        name: updatedCharacter.name,
        house: updatedCharacter.house,
        castingStyle: updatedCharacter.casting_style,
        subclass: updatedCharacter.subclass,
        innateHeritage: updatedCharacter.innate_heritage,
        background: updatedCharacter.background,
        gameSession: updatedCharacter.game_session || "",
        standardFeats: updatedCharacter.standard_feats || [],
        skillProficiencies: updatedCharacter.skill_proficiencies || [],
        abilityScores: updatedCharacter.ability_scores,
        hitPoints: updatedCharacter.hit_points,
        asiChoices: updatedCharacter.asi_choices || {}, // ✅ FIXED: was characterData.asiChoices
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
        createdAt: updatedCharacter.created_at,
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

      {error && (
        <div style={styles.errorContainer}>
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

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

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Character Name *</label>
        <input
          type="text"
          value={character.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter character name..."
          style={styles.input}
          maxLength={50}
        />
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Game Session</label>
        <select
          value={character.gameSession || ""}
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
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>House</label>
        <select
          value={character.house || ""}
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
          value={character.castingStyle || ""}
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
      </div>

      <div style={styles.levelHpGrid}>
        <div style={styles.levelContainer}>
          <label style={styles.label}>Level</label>
          <input
            type="number"
            min="1"
            max="20"
            value={character.level || 1}
            onChange={(e) =>
              handleInputChange("level", parseInt(e.target.value) || 1)
            }
            style={styles.input}
          />
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
          Skill Proficiencies ({(character.skillProficiencies || []).length}/2
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
                const isSelected = (
                  character.skillProficiencies || []
                ).includes(skill);
                const canSelect =
                  isSelected || (character.skillProficiencies || []).length < 2;

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
          </div>
        )}
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Subclass</label>
        <select
          value={character.subclass || ""}
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
        <div style={styles.lockedFieldHeader}>
          <h3 style={styles.skillsHeader}>
            Starting Choice (Level 1)
            {lockedFields.level1ChoiceType && (
              <span style={styles.lockedBadge}>
                <Lock size={12} />
                Locked
              </span>
            )}
          </h3>
          <button
            onClick={() => toggleFieldLock("level1ChoiceType")}
            style={{
              ...styles.lockButton,
              backgroundColor: lockedFields.level1ChoiceType
                ? "#ef4444"
                : "#10b981",
            }}
          >
            {lockedFields.level1ChoiceType ? (
              <Unlock size={14} />
            ) : (
              <Lock size={14} />
            )}
            {lockedFields.level1ChoiceType ? "Unlock" : "Lock"}
          </button>
        </div>

        {lockedFields.level1ChoiceType && (
          <div style={styles.lockedFieldInfo}>
            This field is locked to preserve character integrity. Changing your
            Level 1 choice may affect character balance.
          </div>
        )}

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
              disabled={lockedFields.level1ChoiceType}
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
              disabled={lockedFields.level1ChoiceType}
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
          isEditing={true}
        />
      )}

      {character.level1ChoiceType === "feat" && (
        <StandardFeat
          character={character}
          setCharacter={setCharacter}
          expandedFeats={expandedFeats}
          setExpandedFeats={setExpandedFeats}
          featFilter={featFilter}
          setFeatFilter={setFeatFilter}
          maxFeats={calculateMaxFeats()}
          isLevel1Choice={false}
          characterLevel={character.level}
        />
      )}

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Background</label>
        <select
          value={character.background || ""}
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
        <div style={styles.lockedFieldHeader}>
          <h3 style={styles.skillsHeader}>
            Ability Scores
            {lockedFields.abilityScores && (
              <span style={styles.lockedBadge}>
                <Lock size={12} />
                Locked
              </span>
            )}
          </h3>
          <button
            onClick={() => toggleFieldLock("abilityScores")}
            style={{
              ...styles.lockButton,
              backgroundColor: lockedFields.abilityScores
                ? "#ef4444"
                : "#10b981",
            }}
          >
            {lockedFields.abilityScores ? (
              <Unlock size={14} />
            ) : (
              <Lock size={14} />
            )}
            {lockedFields.abilityScores ? "Unlock" : "Lock"}
          </button>
        </div>

        {lockedFields.abilityScores ? (
          <div style={styles.lockedAbilityScores}>
            {Object.entries(character.abilityScores || {}).map(
              ([ability, score]) => (
                <div key={ability} style={styles.lockedAbilityScore}>
                  <span style={styles.abilityName}>
                    {ability.charAt(0).toUpperCase() + ability.slice(1)}:
                  </span>
                  <span style={styles.abilityValue}>{score || 0}</span>
                </div>
              )
            )}
            <div style={styles.lockedFieldInfo}>
              Ability scores are locked. Use the unlock button to modify them.
            </div>
          </div>
        ) : (
          <AbilityScorePicker
            character={character}
            setRolledStats={setRolledStats}
            setAvailableStats={setAvailableStats}
            setCharacter={setCharacter}
            rollAllStats={() => {}}
            setTempInputValues={setTempInputValues}
            allStatsAssigned={allStatsAssigned}
            availableStats={availableStats}
            tempInputValues={tempInputValues}
            clearStat={clearStat}
            assignStat={assignStat}
            isManualMode={isManualMode}
            setIsManualMode={setIsManualMode}
            rolledStats={rolledStats}
            isEditing={true}
          />
        )}
      </div>

      <div style={styles.fieldContainer}>
        <h3 style={styles.skillsHeader}>Magic School Modifiers</h3>
        <div style={styles.helpText}>
          Enter your wand's bonuses/penalties for each school of magic
        </div>

        <div style={styles.magicModifiersGrid}>
          {[
            { key: "divinations", label: "Divinations" },
            { key: "charms", label: "Charms" },
            { key: "transfiguration", label: "Transfiguration" },
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
                    : (character.magicModifiers || {})[key] || 0
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
          onClick={handleCancel}
          style={{
            ...styles.button,
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
          disabled={isSaving}
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
