import { useState } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBackgroundStyles } from "../../../../utils/styles/masterStyles";
import { standardFeats } from "../../../../SharedData/standardFeatData";

import InnateHeritageSection from "./InnateHeritageSection";
import FeatureSelectorSection from "./FeatureSelectorSection";

const Level1ChoiceSection = ({
  character,
  onChange,
  onCharacterUpdate,
  disabled = false,
  mode = "create",
}) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);

  const [expandedFeats, setExpandedFeats] = useState(new Set());
  const [featFilter, setFeatFilter] = useState("");

  const level1ChoiceType = character.level1ChoiceType || "";
  const isInnateHeritage = level1ChoiceType === "innate";
  const isFeat = level1ChoiceType === "feat";

  const handleChoiceTypeChange = (choiceType) => {
    const updatedCharacter = { ...character };

    updatedCharacter.level1ChoiceType = choiceType;

    if (choiceType === "innate") {
      updatedCharacter.standardFeats = [];
      updatedCharacter.featChoices = {};
      updatedCharacter.selectedFeat = "";
    } else if (choiceType === "feat") {
      updatedCharacter.innateHeritage = "";
      updatedCharacter.selectedInnateHeritage = "";
      updatedCharacter.innateHeritageSkills = [];
      updatedCharacter.heritageChoices = {};
    }

    onChange("level1ChoiceType", choiceType);
    if (onCharacterUpdate) {
      onCharacterUpdate(updatedCharacter);
    }
  };

  const handleHeritageInputChange = (field, value) => {
    onChange(field, value);
  };

  const handleHeritageChoicesChange = (choices) => {
    const updatedCharacter = {
      ...character,
      heritageChoices: choices,
    };

    if (onCharacterUpdate) {
      onCharacterUpdate(updatedCharacter);
    }
  };

  const handleFeatCharacterUpdate = (updatedCharacterOrFunction) => {
    if (typeof updatedCharacterOrFunction === "function") {
      const updatedCharacter = updatedCharacterOrFunction(character);
      if (onCharacterUpdate) {
        onCharacterUpdate(updatedCharacter);
      }
    } else {
      if (onCharacterUpdate) {
        onCharacterUpdate(updatedCharacterOrFunction);
      }
    }
  };

  const choiceContainerStyle = {
    display: "grid",
    gap: "16px",
    marginBottom: "24px",
    gridTemplateColumns: "repeat(2, 1fr)",
  };

  const choiceLabelStyle = (isSelected) => ({
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    border: `2px solid ${isSelected ? theme.primary : theme.border}`,
    borderRadius: "8px",
    backgroundColor: isSelected ? `${theme.primary}10` : theme.surface,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    minWidth: "200px",
    opacity: disabled ? 0.6 : 1,
  });

  const choiceTextStyle = (isSelected) => ({
    marginLeft: "12px",
    fontWeight: isSelected ? "600" : "500",
    color: isSelected ? theme.primary : theme.text,
    fontSize: "16px",
  });

  const radioStyle = {
    width: "18px",
    height: "18px",
    accentColor: theme.primary,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  return (
    <div style={styles.container}>
      <div>
        <div style={styles.sectionHeader}>
          <h3 style={styles.skillsHeader}>
            {character.level === 1
              ? "Level 1 Choice"
              : "Starting Choice (Level 1)"}
          </h3>
          {level1ChoiceType && (
            <span style={styles.selectionStatus}>
              Selected: {isInnateHeritage ? "Innate Heritage" : "Standard Feat"}
            </span>
          )}
        </div>

        <div style={styles.helpText}>
          {character.level === 1
            ? "At level 1, choose either an Innate Heritage or a Standard Feat."
            : `Even though you're starting at Level ${character.level}, you must choose what your character selected at Level 1.`}
        </div>

        <div style={choiceContainerStyle}>
          <label style={choiceLabelStyle(isInnateHeritage)}>
            <input
              type="radio"
              name="level1Choice"
              value="innate"
              checked={isInnateHeritage}
              onChange={(e) => handleChoiceTypeChange(e.target.value)}
              disabled={disabled}
              style={radioStyle}
            />
            <span style={choiceTextStyle(isInnateHeritage)}>
              Innate Heritage
            </span>
          </label>

          <label style={choiceLabelStyle(isFeat)}>
            <input
              type="radio"
              name="level1Choice"
              value="feat"
              checked={isFeat}
              onChange={(e) => handleChoiceTypeChange(e.target.value)}
              disabled={disabled}
              style={radioStyle}
            />
            <span style={choiceTextStyle(isFeat)}>Starting Standard Feat</span>
          </label>
        </div>

        {isInnateHeritage && (
          <div style={{ marginTop: "24px" }}>
            <InnateHeritageSection
              character={character}
              handleInputChange={handleHeritageInputChange}
              isEditing={mode === "edit"}
              heritageChoices={character.heritageChoices || {}}
              onHeritageChoicesChange={handleHeritageChoicesChange}
              onCharacterUpdate={onCharacterUpdate}
              disabled={disabled}
            />
          </div>
        )}

        {isFeat && (
          <div style={{ marginTop: "24px" }}>
            <FeatureSelectorSection
              character={character}
              setCharacter={handleFeatCharacterUpdate}
              expandedFeats={expandedFeats}
              setExpandedFeats={setExpandedFeats}
              featFilter={featFilter}
              setFeatFilter={setFeatFilter}
              maxFeats={1}
              isLevel1Choice={true}
              characterLevel={character.level}
              disabled={disabled}
              contextLevel={1}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Level1ChoiceSection;
