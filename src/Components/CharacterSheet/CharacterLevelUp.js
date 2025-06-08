import { useState, useEffect } from "react";
import { ArrowUp, Heart, Dices, Save, X, RefreshCw } from "lucide-react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { useTheme } from "../../contexts/ThemeContext";
import { createCharacterCreationStyles } from "../../styles/masterStyles";
import { hpData, skillsByCastingStyle } from "../data";
import { characterService } from "../../services/characterService";

const CharacterLevelUp = ({
  character,
  onClose,
  onCharacterUpdated,
  supabase,
  discordUserId,
}) => {
  const { theme } = useTheme();
  const styles = createCharacterCreationStyles(theme);

  const [newLevel, setNewLevel] = useState(character.level + 1);
  const [hpGain, setHpGain] = useState(0);
  const [hpMethod, setHpMethod] = useState("average"); // 'roll', 'average', 'manual'
  const [manualHpGain, setManualHpGain] = useState(0);
  const [rolledHpGain, setRolledHpGain] = useState(null);
  const [newSkillProficiencies, setNewSkillProficiencies] = useState([]);
  const [skillChoicesPerLevel, setSkillChoicesPerLevel] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Calculate constitution modifier
  const getConMod = () => {
    const conScore = character.abilityScores?.constitution || 10;
    return Math.floor((conScore - 10) / 2);
  };

  // Get hit die for casting style
  const getHitDie = () => {
    const hitDiceMap = {
      Willpower: "d10",
      Technique: "d6",
      Intellect: "d8",
      Vigor: "d12",
    };
    return hitDiceMap[character.castingStyle] || "d8";
  };

  // Calculate average HP gain per level
  const getAverageHpGain = () => {
    const hitDie = getHitDie();
    const dieSize = parseInt(hitDie.substring(1));
    const averageRoll = Math.floor(dieSize / 2) + 1;
    return averageRoll + getConMod();
  };

  // Roll for HP gain
  const rollHpGain = () => {
    const hitDie = getHitDie();
    const roller = new DiceRoller();
    const roll = roller.roll(`1${hitDie}`);
    const totalGain = Math.max(1, roll.total + getConMod());
    setRolledHpGain(totalGain);
    return totalGain;
  };

  // Calculate proficiency bonus for new level
  const getProficiencyBonus = (level) => {
    return Math.ceil(level / 4) + 1;
  };

  // Check if proficiency bonus increases at new level
  const proficiencyIncreases = () => {
    return getProficiencyBonus(newLevel) > getProficiencyBonus(character.level);
  };

  // Get available skills for the character's casting style
  const getAvailableSkills = () => {
    return skillsByCastingStyle[character.castingStyle] || [];
  };

  // Get skills the character doesn't already have
  const getNewSkillOptions = () => {
    const availableSkills = getAvailableSkills();
    const currentSkills = character.skillProficiencies || [];
    return availableSkills.filter((skill) => !currentSkills.includes(skill));
  };

  // Determine skill choices available at new level
  const getSkillChoicesForLevel = (level) => {
    // This would depend on your class progression rules
    // For now, let's say certain levels grant skill choices
    const skillGrantingLevels = [1, 3, 6, 9, 12, 15, 18];
    return skillGrantingLevels.includes(level) ? 1 : 0;
  };

  // Initialize HP gain based on method
  useEffect(() => {
    if (hpMethod === "average") {
      setHpGain(getAverageHpGain());
    } else if (hpMethod === "roll" && rolledHpGain !== null) {
      setHpGain(rolledHpGain);
    } else if (hpMethod === "manual") {
      setHpGain(manualHpGain);
    }
  }, [hpMethod, rolledHpGain, manualHpGain]);

  // Initialize skill choices for the new level
  useEffect(() => {
    const choices = getSkillChoicesForLevel(newLevel);
    setSkillChoicesPerLevel({ [newLevel]: choices });
  }, [newLevel]);

  const handleSkillToggle = (skill) => {
    const maxChoices = skillChoicesPerLevel[newLevel] || 0;

    setNewSkillProficiencies((prev) => {
      const isSelected = prev.includes(skill);

      if (isSelected) {
        return prev.filter((s) => s !== skill);
      } else if (prev.length < maxChoices) {
        return [...prev, skill];
      }
      return prev;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const updatedCharacter = {
        ...character,
        level: newLevel,
        hit_points: character.hitPoints + hpGain,
        skill_proficiencies: [
          ...(character.skillProficiencies || []),
          ...newSkillProficiencies,
        ],
      };

      // Transform to snake_case for database
      const characterToSave = {
        name: updatedCharacter.name,
        house: updatedCharacter.house,
        casting_style: updatedCharacter.castingStyle,
        subclass: updatedCharacter.subclass,
        innate_heritage: updatedCharacter.innateHeritage,
        background: updatedCharacter.background,
        game_session: updatedCharacter.gameSession,
        standard_feats: updatedCharacter.standardFeats,
        skill_proficiencies: updatedCharacter.skill_proficiencies,
        ability_scores: updatedCharacter.abilityScores,
        hit_points: updatedCharacter.hit_points,
        level: updatedCharacter.level,
        wand_type: updatedCharacter.wandType,
        magic_modifiers: updatedCharacter.magicModifiers,
      };

      await characterService.updateCharacter(
        character.id,
        characterToSave,
        discordUserId
      );

      if (onCharacterUpdated) {
        onCharacterUpdated(updatedCharacter);
      }

      onClose();
    } catch (err) {
      setError("Failed to level up character: " + err.message);
      console.error("Error leveling up character:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const newSkillChoices = getSkillChoicesForLevel(newLevel);
  const availableNewSkills = getNewSkillOptions();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: theme.surface,
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ArrowUp size={24} color={theme.primary} />
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "600",
                color: theme.text,
              }}
            >
              Level Up {character.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "6px",
              color: theme.textSecondary,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {/* Current Level Info */}
        <div
          style={{
            backgroundColor: theme.background,
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ margin: "0 0 12px 0", color: theme.text }}>
            Current Status
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ fontSize: "14px", color: theme.textSecondary }}>
                Level
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: theme.text,
                }}
              >
                {character.level}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "14px", color: theme.textSecondary }}>
                Hit Points
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: theme.text,
                }}
              >
                {character.hitPoints}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "14px", color: theme.textSecondary }}>
                Prof. Bonus
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: theme.text,
                }}
              >
                +{getProficiencyBonus(character.level)}
              </div>
            </div>
          </div>
        </div>

        {/* Level Selection */}
        <div style={styles.fieldContainer}>
          <label style={styles.label}>New Level</label>
          <input
            type="number"
            min={character.level + 1}
            max="20"
            value={newLevel}
            onChange={(e) =>
              setNewLevel(parseInt(e.target.value) || character.level + 1)
            }
            style={styles.input}
          />
        </div>

        {/* HP Gain Section */}
        <div style={styles.fieldContainer}>
          <h3 style={styles.skillsHeader}>
            <Heart size={20} color="#ef4444" />
            Hit Point Increase
          </h3>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
              <label
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="radio"
                  value="average"
                  checked={hpMethod === "average"}
                  onChange={(e) => setHpMethod(e.target.value)}
                />
                <span>Average ({getAverageHpGain()} HP)</span>
              </label>

              <label
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="radio"
                  value="roll"
                  checked={hpMethod === "roll"}
                  onChange={(e) => setHpMethod(e.target.value)}
                />
                <span>Roll {getHitDie()}</span>
              </label>

              <label
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="radio"
                  value="manual"
                  checked={hpMethod === "manual"}
                  onChange={(e) => setHpMethod(e.target.value)}
                />
                <span>Manual</span>
              </label>
            </div>

            {hpMethod === "roll" && (
              <div style={{ marginBottom: "12px" }}>
                <button
                  onClick={rollHpGain}
                  style={{
                    ...styles.button,
                    backgroundColor: "#ef4444",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <RefreshCw size={16} />
                  Roll {getHitDie()} + {getConMod()}
                </button>
                {rolledHpGain !== null && (
                  <div style={{ marginTop: "8px", color: theme.text }}>
                    Rolled: {rolledHpGain} HP
                  </div>
                )}
              </div>
            )}

            {hpMethod === "manual" && (
              <input
                type="number"
                min="1"
                value={manualHpGain}
                onChange={(e) => setManualHpGain(parseInt(e.target.value) || 0)}
                placeholder="Enter HP gain"
                style={styles.input}
              />
            )}

            <div
              style={{
                padding: "12px",
                backgroundColor: theme.background,
                borderRadius: "6px",
                border: `1px solid ${theme.border}`,
              }}
            >
              <strong>
                Total HP after level up: {character.hitPoints + hpGain}
              </strong>
            </div>
          </div>
        </div>

        {/* Proficiency Bonus Increase */}
        {proficiencyIncreases() && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#dbeafe",
              border: "1px solid #3b82f6",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <h4 style={{ margin: "0 0 8px 0", color: "#1e40af" }}>
              🎉 Proficiency Bonus Increases!
            </h4>
            <p style={{ margin: 0, color: "#1e40af" }}>
              Your proficiency bonus increases from +
              {getProficiencyBonus(character.level)} to +
              {getProficiencyBonus(newLevel)}
            </p>
          </div>
        )}

        {/* New Skill Proficiencies */}
        {newSkillChoices > 0 && availableNewSkills.length > 0 && (
          <div style={styles.fieldContainer}>
            <h3 style={styles.skillsHeader}>
              New Skill Proficiency ({newSkillProficiencies.length}/
              {newSkillChoices} selected)
            </h3>

            <div style={styles.skillsGrid}>
              {availableNewSkills.map((skill) => {
                const isSelected = newSkillProficiencies.includes(skill);
                const canSelect =
                  isSelected || newSkillProficiencies.length < newSkillChoices;

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

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            marginTop: "24px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              ...styles.button,
              backgroundColor: theme.border,
              color: theme.text,
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={
              isSaving ||
              (newSkillChoices > 0 &&
                newSkillProficiencies.length < newSkillChoices)
            }
            style={{
              ...styles.saveButton,
              backgroundColor:
                isSaving ||
                (newSkillChoices > 0 &&
                  newSkillProficiencies.length < newSkillChoices)
                  ? theme.textSecondary
                  : theme.primary,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Save size={16} />
            {isSaving ? "Saving..." : `Level Up to ${newLevel}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterLevelUp;
