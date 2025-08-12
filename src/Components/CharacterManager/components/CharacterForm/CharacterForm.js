import React from "react";
import { Save, X, RotateCcw } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBaseStyles } from "../../utils/styles";
import { useCharacterData } from "../../hooks/useCharacterData";
import { useFormSections } from "../../hooks/useFormSections";
import { FormSection } from "../index";
import {
  BasicInfoSection,
  AbilityScoresSection,
  BackgroundSection,
  HouseSection,
  Level1ChoiceSection,
  SubclassSection,
  HeritageSection,
  SkillsSection,
  ASILevelChoices,
} from "../sections";

import {
  getAllSelectedFeats,
  handleASIChoiceChange as utilsHandleASIChoiceChange,
  handleASIFeatChange as utilsHandleASIFeatChange,
  handleASIAbilityChange as utilsHandleASIAbilityChange,
} from "../../utils/characterUtils";

const CharacterForm = ({
  characterId = null,
  userId,
  mode = "create",
  onSave,
  onCancel,
  supabase,
}) => {
  const { theme } = useTheme();
  const styles = createBaseStyles(theme);

  const {
    character,
    loading,
    error,
    hasChanges,
    updateCharacter,
    updateCharacterBulk,
    saveCharacter,
    resetCharacter,
  } = useCharacterData(characterId, userId);

  const {
    sectionLocks,
    toggleSectionLock,
    lockAllSections,
    unlockAllSections,
    canLock,
  } = useFormSections(
    {
      basicInfo: false,
      house: false,
      subclass: false,
      background: false,
      level1Choice: false,
      asiProgression: false,
      skills: false,
    },
    mode
  );

  const handleASIChoiceChange = (level, choiceType) => {
    const updatedCharacter = utilsHandleASIChoiceChange(
      character,
      level,
      choiceType
    );
    updateCharacterBulk(updatedCharacter);
  };

  const handleASIFeatChange = (level, featName, featChoices = {}) => {
    try {
      const updatedCharacter = utilsHandleASIFeatChange(
        character,
        level,
        featName,
        featChoices
      );
      updateCharacterBulk(updatedCharacter);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleASIAbilityChange = (level, abilityUpdates) => {
    const updatedCharacter = utilsHandleASIAbilityChange(
      character,
      level,
      abilityUpdates
    );
    updateCharacterBulk(updatedCharacter);
  };

  const handleSave = async () => {
    try {
      const savedCharacter = await saveCharacter();
      if (onSave) {
        onSave(savedCharacter);
      }
    } catch (err) {
      console.error("Failed to save character:", err);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all changes?")) {
      resetCharacter();
    }
  };

  if (loading && mode === "edit") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          color: theme.textSecondary,
        }}
      >
        Loading character...
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "16px",
          backgroundColor: theme.surface,
          borderRadius: "8px",
          border: `1px solid ${theme.border}`,
        }}
      >
        <div>
          <h2
            style={{
              color: theme.text,
              margin: 0,
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            {mode === "create"
              ? "Create Character"
              : `Edit ${character.name || "Character"}`}
          </h2>
          <p
            style={{
              color: theme.textSecondary,
              margin: "4px 0 0 0",
              fontSize: "14px",
            }}
          >
            {hasChanges ? "You have unsaved changes" : "No changes made"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {canLock && (
            <>
              <button
                onClick={unlockAllSections}
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary,
                  ...styles.buttonSmall,
                }}
              >
                Unlock All
              </button>

              <button
                onClick={lockAllSections}
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary,
                  ...styles.buttonSmall,
                }}
              >
                Lock All
              </button>
            </>
          )}

          {hasChanges && (
            <button
              onClick={handleReset}
              style={{
                ...styles.button,
                ...styles.buttonSecondary,
                backgroundColor: theme.error,
                color: theme.surface,
              }}
            >
              <RotateCcw size={16} />
              Reset
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={loading || !hasChanges}
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              opacity: loading || !hasChanges ? 0.6 : 1,
            }}
          >
            <Save size={16} />
            {loading ? "Saving..." : "Save"}
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              style={{
                ...styles.button,
                ...styles.buttonSecondary,
              }}
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: `${theme.error}20`,
            border: `1px solid ${theme.error}`,
            borderRadius: "8px",
            marginBottom: "20px",
            color: theme.error,
          }}
        >
          Error: {error}
        </div>
      )}

      <FormSection
        title="Basic Information"
        subtitle="Character name, level, and core details"
        isLocked={sectionLocks.basicInfo}
        onToggleLock={
          canLock ? () => toggleSectionLock("basicInfo") : undefined
        }
        lockable={canLock}
      >
        <BasicInfoSection
          character={character}
          onChange={updateCharacter}
          mode={mode}
          disabled={sectionLocks.basicInfo}
          supabase={supabase}
        />
      </FormSection>

      <FormSection
        title="House & School"
        subtitle="Choose your magical house and school affiliation"
        isLocked={sectionLocks.house}
        onToggleLock={canLock ? () => toggleSectionLock("house") : undefined}
        lockable={canLock}
      >
        <HouseSection
          character={character}
          onChange={updateCharacter}
          mode={mode}
          disabled={sectionLocks.house}
        />
      </FormSection>

      <FormSection
        title="Subclass"
        subtitle="Specialized training and advanced features"
        isLocked={sectionLocks.subclass}
        onToggleLock={canLock ? () => toggleSectionLock("subclass") : undefined}
        lockable={canLock}
      >
        <SubclassSection
          character={character}
          onChange={updateCharacter}
          mode={mode}
          disabled={sectionLocks.subclass}
        />
      </FormSection>

      <FormSection
        title="Background"
        subtitle="Character background and starting proficiencies"
        isLocked={sectionLocks.background}
        onToggleLock={
          canLock ? () => toggleSectionLock("background") : undefined
        }
        lockable={canLock}
      >
        <BackgroundSection
          value={character.background}
          onChange={(backgroundName) =>
            updateCharacter("background", backgroundName)
          }
          onCharacterUpdate={(updatedCharacter) =>
            updateCharacterBulk(updatedCharacter)
          }
          disabled={sectionLocks.background}
          character={character}
          mode={mode}
        />
      </FormSection>

      <FormSection
        title="Level 1 Choice"
        subtitle="Choose either an Innate Heritage or a Standard Feat"
        isLocked={sectionLocks.level1Choice}
        onToggleLock={
          canLock ? () => toggleSectionLock("level1Choice") : undefined
        }
        lockable={canLock}
      >
        <Level1ChoiceSection
          character={character}
          onChange={(field, value) => updateCharacter(field, value)}
          onCharacterUpdate={updateCharacterBulk}
          disabled={sectionLocks.level1Choice}
          mode={mode}
        />
      </FormSection>

      {character.level > 1 && (
        <FormSection
          title="ASI & Feat Progression"
          subtitle={`Level ${
            character.level > 1 ? "4+" : ""
          } Ability Score Improvements and Feat choices`}
          isLocked={sectionLocks.asiProgression}
          onToggleLock={
            canLock ? () => toggleSectionLock("asiProgression") : undefined
          }
          lockable={canLock}
        >
          <ASILevelChoices
            character={character}
            onChange={updateCharacter}
            onCharacterUpdate={updateCharacterBulk}
            disabled={sectionLocks.asiProgression}
            mode={mode}
          />
        </FormSection>
      )}

      <FormSection
        title="Skills & Proficiencies"
        subtitle="Skill proficiencies and expertise"
        isLocked={sectionLocks.skills}
        onToggleLock={canLock ? () => toggleSectionLock("skills") : undefined}
        lockable={canLock}
      >
        <SkillsSection
          character={character}
          onChange={(field, value) => updateCharacter(field, value)}
          onCharacterUpdate={updateCharacterBulk}
          disabled={sectionLocks.skills}
          mode={mode}
        />
      </FormSection>
      <FormSection
        title="Ability Scores"
        subtitle="Set your character's base ability scores"
        isLocked={sectionLocks.abilityScores}
        onToggleLock={
          canLock ? () => toggleSectionLock("abilityScores") : undefined
        }
        lockable={canLock}
      >
        <AbilityScoresSection
          character={character}
          onChange={updateCharacter}
          onCharacterUpdate={updateCharacterBulk}
          disabled={sectionLocks.abilityScores}
          mode={mode}
          featChoices={getAllSelectedFeats(character)}
          houseChoices={character.houseChoices || {}}
          heritageChoices={character.heritageChoices || {}}
          showModifiers={true}
        />
      </FormSection>
    </div>
  );
};

export default CharacterForm;
