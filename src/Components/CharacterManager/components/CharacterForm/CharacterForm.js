import React, { useState, useEffect, useRef } from "react";
import { Save, X, RotateCcw } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBaseStyles } from "../../utils/styles";
import { useCharacterData } from "../../hooks/useCharacterData";
import { useFormSections } from "../../hooks/useFormSections";
import { FormSection } from "../index";
import {
  BasicInfoSection,
  AbilityScoresSection,
  HitPointsSection,
  BackgroundSection,
  HouseSection,
  Level1ChoiceSection,
  SubclassSection,
  HeritageSection,
  SkillsSection,
  ASILevelChoices,
  MagicModifiersSection,
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

  const [isSticky, setIsSticky] = useState(false);
  const toolbarRef = useRef(null);
  const placeholderRef = useRef(null);
  const [toolbarHeight, setToolbarHeight] = useState(0);

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
      abilityScores: false,
      hitPoints: false,
      house: false,
      subclass: false,
      background: false,
      level1Choice: false,
      asiProgression: false,
      skills: false,
      magicModifiers: false,
    },
    mode
  );

  useEffect(() => {
    const handleScroll = () => {
      if (!placeholderRef.current || !toolbarRef.current) return;

      const placeholder = placeholderRef.current;
      const toolbar = toolbarRef.current;
      const rect = placeholder.getBoundingClientRect();

      if (toolbar && !isSticky) {
        setToolbarHeight(toolbar.offsetHeight);
      }

      if (rect.top <= 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isSticky]);

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

  // const isSaveEnabled =
  // character.name.trim() &&
  //   character.house &&
  //   character.schoolYear &&
  //   character.castingStyle &&
  //   character.level1ChoiceType;
  // console.log(!!isSaveEnabled);

  const toolbarStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: isSticky ? "0" : "20px",
    padding: "16px",
    backgroundColor: theme.surface,
    borderRadius: isSticky ? "0" : "8px",
    border: `1px solid ${theme.border}`,
    ...(isSticky && {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: 0,
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
    }),
    transition: "all 0.3s ease",
  };

  return (
    <div>
      <div
        ref={placeholderRef}
        style={{
          height: isSticky ? `${toolbarHeight}px` : 0,
          transition: "height 0.3s ease",
        }}
      />

      <div ref={toolbarRef} style={toolbarStyles}>
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

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {canLock && !isSticky && (
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
              backgroundColor: hasChanges ? theme.primary : theme.border,
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
            onASIChoiceChange={handleASIChoiceChange}
            onASIFeatChange={handleASIFeatChange}
            onASIAbilityChange={handleASIAbilityChange}
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

      <FormSection
        title="Hit Points"
        subtitle="Calculate your character's hit points based on casting style and constitution"
        isLocked={sectionLocks.hitPoints}
        onToggleLock={
          canLock ? () => toggleSectionLock("hitPoints") : undefined
        }
        lockable={canLock}
      >
        <HitPointsSection
          character={character}
          onChange={updateCharacter}
          disabled={sectionLocks.hitPoints}
        />
      </FormSection>

      <FormSection
        title="Magic Modifiers & Wand"
        subtitle="Wand bonuses and character wand information"
        isLocked={sectionLocks.magicModifiers}
        onToggleLock={
          canLock ? () => toggleSectionLock("magicModifiers") : undefined
        }
        lockable={canLock}
      >
        <MagicModifiersSection
          character={character}
          onChange={updateCharacter}
          disabled={sectionLocks.magicModifiers}
        />
      </FormSection>
    </div>
  );
};

export default CharacterForm;
