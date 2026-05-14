import React, { useState, useEffect, useRef } from "react";
import { Save, X, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBaseStyles } from "../../utils/styles";
import { useCharacterData } from "../../hooks/useCharacterData";
import { useFormSections } from "../../hooks/useFormSections";
import { FormSection } from "../index";
import {
  AbilityScoresSection,
  HitPointsSection,
  BackgroundSection,
  HouseSection,
  Level1ChoiceSection,
  SubclassSection,
  SkillsSection,
  ToolsLanguagesSection,
  ASILevelChoices,
  AdditionalFeatsASISection,
  MagicModifiersSection,
  MetaMagicSection,
  CastingStyleChoicesSection,
  NotesSection,
  BasicInfoSection,
} from "../sections";

import {
  getAllSelectedFeats,
  getAvailableASILevels,
  handleASIChoiceChange as utilsHandleASIChoiceChange,
  handleASIFeatChange as utilsHandleASIFeatChange,
  handleASIAbilityChange as utilsHandleASIAbilityChange,
} from "../../utils/characterUtils";

const WIZARD_STEPS = [
  { label: "Basics", sections: ["basic-info", "casting-style-choices"] },
  { label: "House", sections: ["house"] },
  { label: "Subclass", sections: ["subclass"] },
  { label: "Background", sections: ["background"] },
  { label: "Abilities", sections: ["ability-scores", "level1-choice", "asi-feats", "additional-feats-asi"] },
  { label: "Metamagic", sections: ["metamagic"] },
  { label: "Proficiencies", sections: ["skills", "tools"] },
  { label: "Stats", sections: ["hit-points", "magic-modifiers", "notes"] },
];

const SECTION_TO_STEP = Object.fromEntries(
  WIZARD_STEPS.flatMap((step, index) => step.sections.map((s) => [s, index]))
);

const CharacterForm = ({
  characterId = null,
  userId,
  mode = "create",
  onSave,
  onCancel,
  supabase,
  adminMode = false,
  isUserAdmin = false,
  initialSection = null,
}) => {
  const { theme } = useTheme();
  const styles = createBaseStyles(theme);

  const [isSticky, setIsSticky] = useState(false);
  const toolbarRef = useRef(null);
  const placeholderRef = useRef(null);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    character,
    loading,
    error,
    hasChanges,
    updateCharacter,
    updateCharacterBulk,
    saveCharacter,
    resetCharacter,
  } = useCharacterData(characterId, userId, adminMode, isUserAdmin);

  const { getSectionConfig, sections } = useFormSections();

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

  useEffect(() => {
    if (initialSection && character) {
      const stepIndex = SECTION_TO_STEP[initialSection] ?? 0;
      setCurrentStep(stepIndex);
    }
  }, [initialSection, character]);

  const navigateToStep = (stepIndex) => {
    if (stepIndex < 0 || stepIndex >= WIZARD_STEPS.length) return;
    setCurrentStep(stepIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToSection = (sectionId) => {
    const stepIndex = SECTION_TO_STEP[sectionId];
    if (stepIndex !== undefined) navigateToStep(stepIndex);
  };

  const handleASIChoiceChange = (level, choiceType) => {
    const updatedCharacter = utilsHandleASIChoiceChange(character, level, choiceType);
    updateCharacterBulk(updatedCharacter);
  };

  const handleASIFeatChange = (level, featName, featChoices = {}) => {
    try {
      const updatedCharacter = utilsHandleASIFeatChange(character, level, featName, featChoices);
      updateCharacterBulk(updatedCharacter);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleASIAbilityChange = (level, abilityUpdates) => {
    const updatedCharacter = utilsHandleASIAbilityChange(character, level, abilityUpdates);
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

  const toolbarStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: isSticky ? "0" : "20px",
    padding: "16px",
    backgroundColor: theme.surface,
    borderRadius: isSticky ? "0" : "8px",
    border: `3px solid ${theme.text}`,
    ...(isSticky && {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: 0,
    }),
    transition: "all 0.3s ease",
  };

  const isLastStep = currentStep === WIZARD_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

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
        {/* Row 1: title + action buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            {hasChanges && (
              <button
                onClick={handleReset}
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary,
                  backgroundColor: theme.error,
                  border: theme.border,
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
                backgroundColor: hasChanges ? theme.success : theme.border,
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
                  ...styles.buttonPrimary,
                  opacity: loading ? 0.6 : 1,
                  backgroundColor: "#d97706",
                }}
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Row 2: step indicator */}
        <div style={{ display: "flex", gap: "4px", overflowX: "auto" }}>
          {WIZARD_STEPS.map((step, index) => {
            const isActive = currentStep === index;
            const isPast = mode === "create" && index < currentStep;
            return (
              <button
                key={index}
                onClick={() => navigateToStep(index)}
                style={{
                  flex: "1 0 auto",
                  minWidth: "60px",
                  padding: "6px 8px",
                  backgroundColor: isActive ? theme.text : "transparent",
                  border: `2px solid ${
                    isActive
                      ? theme.text
                      : isPast
                      ? theme.success || "#22c55e"
                      : theme.border
                  }`,
                  borderRadius: "6px",
                  color: isActive ? theme.surface : theme.text,
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: isActive ? "700" : "400",
                  textAlign: "center",
                  lineHeight: "1.3",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "2px" }}>
                  {isPast ? "✓" : index + 1}
                </div>
                {step.label}
              </button>
            );
          })}
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

      {/* Step 1: Basics */}
      {currentStep === 0 && (
        <>
          <FormSection
            title="Basic Information"
            subtitle="Character name, level, and core details"
            id="section-basic-info"
          >
            <BasicInfoSection
              character={character}
              onChange={updateCharacter}
              mode={mode}
              supabase={supabase}
            />
          </FormSection>

          <FormSection
            title="Casting Style Features"
            subtitle="Level-based casting style feature choices"
            id="section-casting-style-choices"
          >
            <CastingStyleChoicesSection
              character={character}
              setCharacter={updateCharacter}
            />
          </FormSection>
        </>
      )}

      {/* Step 2: House */}
      {currentStep === 1 && (
        <FormSection
          title="House & School"
          subtitle="Choose your magical house and school affiliation"
          id="section-house"
        >
          <HouseSection
            character={character}
            onChange={updateCharacter}
            mode={mode}
          />
        </FormSection>
      )}

      {/* Step 3: Subclass */}
      {currentStep === 2 && (
        <FormSection
          title="Subclass"
          subtitle="Specialized training and advanced features"
          id="section-subclass"
        >
          <SubclassSection
            character={character}
            onChange={updateCharacter}
            mode={mode}
          />
        </FormSection>
      )}

      {/* Step 4: Background */}
      {currentStep === 3 && (
        <FormSection
          title="Background"
          subtitle="Character background and starting proficiencies"
          id="section-background"
        >
          <BackgroundSection
            value={character.background}
            onChange={(backgroundName) =>
              updateCharacter("background", backgroundName)
            }
            onCharacterUpdate={(updatedCharacter) =>
              updateCharacterBulk(updatedCharacter)
            }
            character={character}
            mode={mode}
          />
        </FormSection>
      )}

      {/* Step 5: Abilities */}
      {currentStep === 4 && (
        <>
          <FormSection
            title="Ability Scores"
            subtitle="Set your character's base ability scores"
            id="section-ability-scores"
          >
            <AbilityScoresSection
              character={character}
              onChange={updateCharacter}
              onCharacterUpdate={updateCharacterBulk}
              mode={mode}
              featChoices={getAllSelectedFeats(character)}
              houseChoices={character.houseChoices || character.house_choices}
              heritageChoices={character.heritageChoices || character.heritage_choices || {}}
              showModifiers={true}
            />
          </FormSection>

          <FormSection
            title="Level 1 Choice"
            subtitle="Choose either an Innate Heritage or a Standard Feat"
            id="section-level1-choice"
          >
            <Level1ChoiceSection
              character={character}
              onChange={(field, value) => updateCharacter(field, value)}
              onCharacterUpdate={updateCharacterBulk}
              mode={mode}
            />
          </FormSection>

          {getAvailableASILevels(character.level).length > 0 && (
            <FormSection
              title="ASI & Feat Progression"
              subtitle={`Level ${character.level > 1 ? "4+" : ""} Ability Score Improvements and Feat choices`}
              id="section-asi-feats"
            >
              <ASILevelChoices
                character={character}
                onChange={updateCharacter}
                onCharacterUpdate={updateCharacterBulk}
                onASIChoiceChange={handleASIChoiceChange}
                onASIFeatChange={handleASIFeatChange}
                onASIAbilityChange={handleASIAbilityChange}
                mode={mode}
              />
            </FormSection>
          )}

          <FormSection
            title="Additional Feats and ASI"
            subtitle="Extra feats and ability score improvements outside of standard progression"
            id="section-additional-feats-asi"
          >
            <AdditionalFeatsASISection
              character={character}
              onChange={updateCharacter}
              onCharacterUpdate={updateCharacterBulk}
              mode={mode}
            />
          </FormSection>
        </>
      )}

      {/* Step 6: Metamagic */}
      {currentStep === 5 && (
        <FormSection
          title="Metamagic"
          subtitle="Select metamagic options available to your character"
          id="section-metamagic"
        >
          <MetaMagicSection character={character} onChange={updateCharacter} />
        </FormSection>
      )}

      {/* Step 7: Proficiencies */}
      {currentStep === 6 && (
        <>
          <FormSection
            title="Skills & Proficiencies"
            subtitle="Skill proficiencies and expertise"
            id="section-skills"
          >
            <SkillsSection
              character={character}
              onChange={(field, value) => updateCharacter(field, value)}
              onCharacterUpdate={updateCharacterBulk}
              mode={mode}
            />
          </FormSection>

          <FormSection
            title="Tool Proficiencies"
            subtitle="Tool proficiencies"
            id="section-tools"
          >
            <ToolsLanguagesSection
              character={character}
              onChange={(field, value) => updateCharacter(field, value)}
              mode={mode}
            />
          </FormSection>
        </>
      )}

      {/* Step 8: Stats */}
      {currentStep === 7 && (
        <>
          <FormSection
            title="Hit Points"
            subtitle="Calculate your character's hit points based on casting style and constitution"
            id="section-hit-points"
          >
            <HitPointsSection character={character} onChange={updateCharacter} onNavigate={navigateToSection} />
          </FormSection>

          <FormSection
            title="Magic Modifiers & Wand"
            subtitle="Wand bonuses and character wand information"
            id="section-magic-modifiers"
          >
            <MagicModifiersSection
              character={character}
              onChange={updateCharacter}
            />
          </FormSection>

          <FormSection
            title="Character Notes"
            subtitle="Additional notes, character flaws, backstory etc"
            id="section-notes"
          >
            <NotesSection character={character} onChange={updateCharacter} />
          </FormSection>
        </>
      )}

      {/* Prev / Next navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "24px",
          paddingTop: "16px",
          borderTop: `2px solid ${theme.border}`,
        }}
      >
        <button
          onClick={() => navigateToStep(currentStep - 1)}
          disabled={isFirstStep}
          style={{
            ...styles.button,
            ...styles.buttonSecondary,
            opacity: isFirstStep ? 0.3 : 1,
            cursor: isFirstStep ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span style={{ color: theme.textSecondary, fontSize: "14px" }}>
          Step {currentStep + 1} of {WIZARD_STEPS.length}
        </span>

        <button
          onClick={() => navigateToStep(currentStep + 1)}
          disabled={isLastStep}
          style={{
            ...styles.button,
            ...styles.buttonPrimary,
            opacity: isLastStep ? 0.3 : 1,
            cursor: isLastStep ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CharacterForm;
