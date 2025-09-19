import React, { useState } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBackgroundStyles } from "../../../../styles/masterStyles";
import {
  getAvailableASILevels,
  handleASIChoiceChange as utilsHandleASIChoiceChange,
  handleASIFeatChange as utilsHandleASIFeatChange,
  handleASIAbilityChange as utilsHandleASIAbilityChange,
} from "../../utils/characterUtils";
import FeatureSelectorSection from "./FeatureSelectorSection";

const ASILevelChoices = ({
  character,
  onChange,
  onCharacterUpdate,
  disabled = false,
  mode = "create",
}) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);

  const [expandedFeats, setExpandedFeats] = useState(new Set());
  const [featFilters, setFeatFilters] = useState({});

  const availableASILevels = getAvailableASILevels(character.level);

  if (availableASILevels.length === 0) {
    return null;
  }

  const handleASIChoiceChange = (level, choiceType) => {
    try {
      const updatedCharacter = utilsHandleASIChoiceChange(
        character,
        level,
        choiceType
      );
      onCharacterUpdate(updatedCharacter);
    } catch (error) {
      console.error("Error updating ASI choice:", error);
    }
  };

  const handleASIFeatChange = (level, featName, featChoices = {}) => {
    try {
      const updatedCharacter = utilsHandleASIFeatChange(
        character,
        level,
        featName,
        featChoices
      );
      onCharacterUpdate(updatedCharacter);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleASIAbilityChange = (level, abilityUpdates) => {
    try {
      const updatedCharacter = utilsHandleASIAbilityChange(
        character,
        level,
        abilityUpdates
      );
      onCharacterUpdate(updatedCharacter);
    } catch (error) {
      console.error("Error updating ASI abilities:", error);
    }
  };

  const setFeatFilter = (level, filter) => {
    setFeatFilters((prev) => ({
      ...prev,
      [level]: filter,
    }));
  };

  const choiceContainerStyle = {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
    flexWrap: "wrap",
  };

  const choiceLabelStyle = (isSelected) => ({
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    border: `2px solid ${isSelected ? theme.primary : theme.border}`,
    borderRadius: "8px",
    backgroundColor: isSelected ? `${theme.primary}10` : theme.surface,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    minWidth: "180px",
    opacity: disabled ? 0.6 : 1,
  });

  const choiceTextStyle = (isSelected) => ({
    marginLeft: "12px",
    fontWeight: isSelected ? "600" : "500",
    color: isSelected ? theme.primary : theme.text,
    fontSize: "14px",
  });

  const radioStyle = {
    width: "16px",
    height: "16px",
    accentColor: theme.primary,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  const levelSectionStyle = {
    marginBottom: "32px",
    padding: "20px",
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: "12px",
  };

  return (
    <div style={styles.container}>
      {availableASILevels.map((level) => {
        const choice = character.asiChoices?.[level] || {};
        const isASI = choice.type === "asi";
        const isFeat = choice.type === "feat";
        const hasSelectedChoice = isASI || (isFeat && choice.selectedFeat);

        return (
          <div key={level} style={levelSectionStyle}>
            <div style={styles.sectionHeader}>
              <h4 style={styles.skillsHeader}>Level {level} Choice</h4>
              {hasSelectedChoice && (
                <span style={styles.selectionStatus}>
                  Selected:{" "}
                  {isASI
                    ? "Ability Score Improvement"
                    : `Feat: ${choice.selectedFeat}`}
                </span>
              )}
            </div>

            <div style={styles.helpText}>
              At level {level}, choose either an Ability Score Improvement (+2
              total, max +1 per ability) or a Standard Feat.
            </div>

            <div style={choiceContainerStyle}>
              <label style={choiceLabelStyle(isASI)}>
                <input
                  type="radio"
                  name={`level${level}Choice`}
                  value="asi"
                  checked={isASI}
                  onChange={() => handleASIChoiceChange(level, "asi")}
                  disabled={disabled}
                  style={radioStyle}
                />
                <span style={choiceTextStyle(isASI)}>
                  Ability Score Improvement
                </span>
              </label>

              <label style={choiceLabelStyle(isFeat)}>
                <input
                  type="radio"
                  name={`level${level}Choice`}
                  value="feat"
                  checked={isFeat}
                  onChange={() => handleASIChoiceChange(level, "feat")}
                  disabled={disabled}
                  style={radioStyle}
                />
                <span style={choiceTextStyle(isFeat)}>Standard Feat</span>
              </label>
            </div>

            {isASI && (
              <div style={{ marginTop: "20px" }}>
                <AbilityScoreIncrementSection
                  level={level}
                  choice={choice}
                  character={character}
                  onAbilityChange={handleASIAbilityChange}
                  disabled={disabled}
                  theme={theme}
                  styles={styles}
                />
              </div>
            )}

            {isFeat && (
              <div style={{ marginTop: "20px" }}>
                <FeatSelectionSection
                  level={level}
                  choice={choice}
                  character={character}
                  onFeatChange={handleASIFeatChange}
                  expandedFeats={expandedFeats}
                  setExpandedFeats={setExpandedFeats}
                  featFilter={featFilters[level] || ""}
                  setFeatFilter={(filter) => setFeatFilter(level, filter)}
                  disabled={disabled}
                />
              </div>
            )}

            {!choice.type && (
              <div
                style={{
                  backgroundColor: `${theme.border}20`,
                  border: `1px dashed ${theme.border}`,
                  borderRadius: "8px",
                  padding: "16px",
                  marginTop: "16px",
                  textAlign: "center",
                  color: theme.textSecondary,
                }}
              >
                <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                  ⚪ No choice selected yet
                </div>
                <div style={{ fontSize: "12px" }}>
                  Choose either Ability Score Improvement or Standard Feat above
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const AbilityScoreIncrementSection = ({
  level,
  choice,
  character,
  onAbilityChange,
  disabled,
  theme,
  styles,
}) => {
  const abilities = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];
  const currentIncreases = choice.abilityScoreIncreases || [];

  const handleAbilityIncrement = (ability) => {
    if (disabled) return;

    const existingIncrease = currentIncreases.find(
      (inc) => inc.ability === ability
    );

    if (existingIncrease) {
      const newIncreases = currentIncreases.filter(
        (inc) => inc.ability !== ability
      );
      onAbilityChange(level, newIncreases);
    } else if (currentIncreases.length < 2) {
      const newIncreases = [...currentIncreases, { ability, increase: 1 }];
      onAbilityChange(level, newIncreases);
    }
  };

  const abilityGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
    marginTop: "16px",
  };

  const abilityCardStyle = (ability) => {
    const isSelected = currentIncreases.some((inc) => inc.ability === ability);
    const canSelect = !isSelected && currentIncreases.length < 2;

    return {
      padding: "12px 16px",
      border: `2px solid ${isSelected ? theme.success : theme.border}`,
      borderRadius: "8px",
      backgroundColor: isSelected ? `${theme.success}15` : theme.surface,
      cursor: disabled
        ? "not-allowed"
        : canSelect || isSelected
        ? "pointer"
        : "not-allowed",
      transition: "all 0.2s ease",
      opacity: disabled ? 0.6 : canSelect || isSelected ? 1 : 0.4,
      textAlign: "center",
    };
  };

  return (
    <div>
      <div style={styles.helpText}>
        Select two different abilities to increase by +1 each (total +2).
        {currentIncreases.length > 0 && (
          <span style={{ color: theme.success, marginLeft: "8px" }}>
            ({currentIncreases.length}/2 selected)
          </span>
        )}
      </div>

      <div style={abilityGridStyle}>
        {abilities.map((ability) => {
          const isSelected = currentIncreases.some(
            (inc) => inc.ability === ability
          );
          const currentScore = character.abilityScores?.[ability] || 10;

          return (
            <div
              key={ability}
              style={abilityCardStyle(ability)}
              onClick={() => handleAbilityIncrement(ability)}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: isSelected ? theme.success : theme.text,
                  textTransform: "capitalize",
                  fontSize: "14px",
                }}
              >
                {ability}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  marginTop: "4px",
                }}
              >
                {currentScore} → {currentScore + (isSelected ? 1 : 0)}
              </div>
              {isSelected && (
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.success,
                    fontWeight: "600",
                    marginTop: "4px",
                  }}
                >
                  +1 ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {currentIncreases.length === 2 && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: `${theme.success}20`,
            border: `1px solid ${theme.success}`,
            borderRadius: "8px",
            color: theme.success,
            fontSize: "14px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          ✓ Ability Score Improvement Complete: +1{" "}
          {currentIncreases
            .map(
              (inc) =>
                inc.ability.charAt(0).toUpperCase() + inc.ability.slice(1)
            )
            .join(", +1 ")}
        </div>
      )}
    </div>
  );
};

const FeatSelectionSection = ({
  level,
  choice,
  character,
  onFeatChange,
  expandedFeats,
  setExpandedFeats,
  featFilter,
  setFeatFilter,
  disabled,
}) => {
  const mockCharacter = {
    ...character,

    standardFeats: choice.selectedFeat ? [choice.selectedFeat] : [],

    featChoices: choice.featChoices || {},

    asiChoices: {},

    _editingASILevel: level,
  };

  const handleMockCharacterUpdate = (updater) => {
    if (typeof updater === "function") {
      const updated = updater(mockCharacter);
      const selectedFeats = updated.standardFeats || [];
      const featChoices = updated.featChoices || {};

      if (selectedFeats.length > 0) {
        onFeatChange(level, selectedFeats[0], featChoices);
      } else {
        onFeatChange(level, null, {});
      }
    } else {
      const selectedFeats = updater.standardFeats || [];
      const featChoices = updater.featChoices || {};

      if (selectedFeats.length > 0) {
        onFeatChange(level, selectedFeats[0], featChoices);
      } else {
        onFeatChange(level, null, {});
      }
    }
  };

  return (
    <FeatureSelectorSection
      character={mockCharacter}
      setCharacter={handleMockCharacterUpdate}
      expandedFeats={expandedFeats}
      setExpandedFeats={setExpandedFeats}
      featFilter={featFilter}
      setFeatFilter={setFeatFilter}
      maxFeats={1}
      isLevel1Choice={false}
      characterLevel={character.level}
      disabled={disabled}
      contextLevel={level}
    />
  );
};

export default ASILevelChoices;
