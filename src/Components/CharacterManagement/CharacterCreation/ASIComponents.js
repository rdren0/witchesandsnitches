import { useState } from "react";
import { standardFeats } from "../../../SharedData/standardFeatData";
import { checkFeatPrerequisites } from "../../CharacterSheet/utils";
import { useTheme } from "../../../contexts/ThemeContext";
import { getAllSelectedFeats } from "../utils";

export const AbilityScoreIncrements = ({
  level,
  choice,
  character,
  handleASIAbilityChange,
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
  const [localIncreases, setLocalIncreases] = useState(
    choice.abilityScoreIncreases || []
  );

  const getTotalIncreases = () => {
    return localIncreases.reduce((sum, inc) => sum + (inc.increase || 1), 0);
  };

  const getAbilityIncrease = (ability) => {
    const existing = localIncreases.find((inc) => inc.ability === ability);
    return existing ? existing.increase || 1 : 0;
  };

  const getCurrentAbilityScore = (ability) => {
    return character.abilityScores?.[ability] || 10;
  };

  const canIncreaseAbility = (ability) => {
    const currentIncrease = getAbilityIncrease(ability);
    const totalIncreases = getTotalIncreases();
    return currentIncrease < 1 && totalIncreases < 2;
  };

  const canDecreaseAbility = (ability) => {
    return getAbilityIncrease(ability) > 0;
  };

  const updateAbilityIncrease = (ability, newIncrease) => {
    const newIncreases = localIncreases.filter(
      (inc) => inc.ability !== ability
    );
    if (newIncrease > 0) {
      newIncreases.push({ ability, increase: newIncrease });
    }
    setLocalIncreases(newIncreases);
    handleASIAbilityChange(level, newIncreases);
  };

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        {abilities.map((ability) => {
          const currentScore = getCurrentAbilityScore(ability);
          const increase = getAbilityIncrease(ability);
          const newScore = currentScore + increase;

          return (
            <div
              key={ability}
              style={{
                background: increase > 0 ? theme.primaryLight : theme.surface,
                border: `1px solid ${
                  increase > 0 ? theme.primary : theme.border
                }`,
                borderRadius: "6px",
                padding: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: theme.text,
                  textTransform: "capitalize",
                  marginBottom: "4px",
                }}
              >
                {ability}
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: theme.text,
                  marginBottom: "4px",
                }}
              >
                {currentScore} → {newScore}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <button
                  onClick={() => updateAbilityIncrease(ability, increase - 1)}
                  disabled={!canDecreaseAbility(ability)}
                  style={{
                    ...styles.button,
                    width: "24px",
                    height: "24px",
                    fontSize: "16px",
                    padding: "0",
                    opacity: canDecreaseAbility(ability) ? 1 : 0.5,
                  }}
                  type="button"
                >
                  −
                </button>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: theme.text,
                    minWidth: "20px",
                  }}
                >
                  +{increase}
                </span>
                <button
                  onClick={() => updateAbilityIncrease(ability, increase + 1)}
                  disabled={!canIncreaseAbility(ability)}
                  style={{
                    ...styles.button,
                    width: "24px",
                    height: "24px",
                    fontSize: "16px",
                    padding: "0",
                    opacity: canIncreaseAbility(ability) ? 1 : 0.5,
                  }}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          fontSize: "12px",
          color: theme.textSecondary,
          textAlign: "center",
        }}
      >
        Total increases used: {getTotalIncreases()}/2
        {getTotalIncreases() < 2 && (
          <span style={{ color: theme.warning }}>
            {" "}
            (Select {2 - getTotalIncreases()} more)
          </span>
        )}
      </div>
    </div>
  );
};

export const ASIFeatSelector = ({
  level,
  character,
  choice,
  handleASIFeatChange,
  expandedFeats,
  setExpandedFeats,
  featFilter,
  setFeatFilter,
  theme,
  styles,
}) => {
  const safeStandardFeats = standardFeats || [];

  const allSelectedFeats = getAllSelectedFeats(character);

  const excludedFeats = allSelectedFeats.filter(
    (featName) => featName !== choice.selectedFeat
  );

  const availableFeats = safeStandardFeats.filter((feat) => {
    if (!checkFeatPrerequisites(feat, character)) {
      return false;
    }

    if (excludedFeats.includes(feat.name)) {
      return false;
    }

    return true;
  });

  const filteredFeats = availableFeats?.filter((feat) => {
    const searchTerm = featFilter.toLowerCase();

    return (
      feat.name?.toLowerCase().includes(searchTerm) ||
      feat.preview?.toLowerCase().includes(searchTerm) ||
      (Array.isArray(feat.description)
        ? feat.description.join(" ").toLowerCase().includes(searchTerm)
        : feat.description?.toLowerCase?.().includes(searchTerm))
    );
  });

  const currentlySelectedUnavailable =
    choice.selectedFeat && excludedFeats.includes(choice.selectedFeat);

  return (
    <div>
      <div style={styles.featFilterContainer}>
        <input
          type="text"
          placeholder="Search feats by name, preview, or description..."
          value={featFilter}
          onChange={(e) => setFeatFilter(e.target.value)}
          style={styles.featFilterInput}
          onFocus={(e) => {
            e.target.style.borderColor = "#FBBF24";
            e.target.style.boxShadow =
              "inset 0 2px 6px rgba(245,158,11,0.2), 0 0 0 3px rgba(251,191,36,0.3)";
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
            type="button"
            title="Clear search"
          >
            ×
          </button>
        )}
        {featFilter.trim() && (
          <div style={styles.featFilterResults}>
            Showing {filteredFeats.length} of {availableFeats.length} available
            feats
          </div>
        )}
      </div>

      {currentlySelectedUnavailable && (
        <div
          style={{
            ...styles.errorContainer,
            backgroundColor: theme.warning + "20",
            borderColor: theme.warning,
            marginBottom: "12px",
          }}
        >
          ⚠️ Currently selected feat "{choice.selectedFeat}" is already chosen
          elsewhere. Please select a different feat.
        </div>
      )}

      {excludedFeats.length > 0 && (
        <div
          style={{
            fontSize: "12px",
            color: theme.textSecondary,
            backgroundColor: theme.surface,
            padding: "8px 12px",
            borderRadius: "6px",
            marginBottom: "12px",
            border: `1px solid ${theme.border}`,
          }}
        >
          <strong>Note:</strong> {excludedFeats.length} feat
          {excludedFeats.length > 1 ? "s" : ""} already selected elsewhere:{" "}
          {excludedFeats.join(", ")}
        </div>
      )}

      <div style={styles.featContainer}>
        {filteredFeats.length === 0 ? (
          <div style={styles.noFeatsMessage}>
            {featFilter.trim()
              ? `No available feats match "${featFilter}"`
              : "No feats available (all eligible feats are already selected)"}
          </div>
        ) : (
          filteredFeats.map((feat) => {
            const isSelected = choice.selectedFeat === feat.name;
            const isExpanded = expandedFeats.has(feat.name);

            return (
              <div
                key={feat.name}
                style={isSelected ? styles.featItemSelected : styles.featItem}
              >
                <div style={styles.featHeader}>
                  <label style={styles.featLabel}>
                    <input
                      type="radio"
                      name={`asiLevel${level}Feat`}
                      value={feat.name}
                      checked={isSelected}
                      onChange={(e) =>
                        handleASIFeatChange(level, e.target.value)
                      }
                      style={styles.featCheckbox}
                    />
                    <div>
                      <div
                        style={
                          isSelected ? styles.featNameSelected : styles.featName
                        }
                      >
                        {feat.name}
                      </div>
                      {feat.preview && (
                        <div
                          style={
                            isSelected
                              ? styles.featPreviewSelected
                              : styles.featPreview
                          }
                        >
                          {feat.preview}
                        </div>
                      )}
                    </div>
                  </label>

                  <button
                    onClick={() => {
                      const newExpanded = new Set(expandedFeats);
                      if (isExpanded) {
                        newExpanded.delete(feat.name);
                      } else {
                        newExpanded.add(feat.name);
                      }
                      setExpandedFeats(newExpanded);
                    }}
                    style={styles.featExpandButton}
                    type="button"
                    title={isExpanded ? "Collapse" : "Expand details"}
                  >
                    {isExpanded ? "−" : "+"}
                  </button>
                </div>

                {isExpanded && (
                  <div
                    style={
                      isSelected
                        ? styles.featDescriptionSelected
                        : styles.featDescription
                    }
                  >
                    {feat.description || "No description available."}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div style={styles.helpText}>
        Level {level} ASI/Feat Choice: Select one feat that meets your
        character's prerequisites and hasn't been selected elsewhere. This
        choice represents your character's growth and training at this level.
      </div>
    </div>
  );
};

export const FeatRequirementsInfo = ({ character }) => {
  const { theme } = useTheme();
  const safeStandardFeats = standardFeats || [];

  const allSelectedFeats = getAllSelectedFeats(character);

  const availableCount = safeStandardFeats.filter((feat) =>
    checkFeatPrerequisites(feat, character)
  ).length;

  const totalCount = safeStandardFeats.length;
  const unavailableCount = totalCount - availableCount;
  const alreadySelectedCount = allSelectedFeats.length;

  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: theme.surface,
        borderRadius: "6px",
        border: `1px solid ${theme.border}`,
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontWeight: "600", color: theme.text }}>
          Feat Availability
        </span>
        <span style={{ fontSize: "14px", color: theme.textSecondary }}>
          {availableCount - alreadySelectedCount}/{totalCount} available
        </span>
      </div>
      {unavailableCount > 0 && (
        <div style={{ fontSize: "12px", color: theme.textSecondary }}>
          {unavailableCount} feats require specific prerequisites (heritage,
          casting styles, etc.)
        </div>
      )}
      {alreadySelectedCount > 0 && (
        <div
          style={{ fontSize: "12px", color: theme.warning, marginTop: "4px" }}
        >
          {alreadySelectedCount} feat{alreadySelectedCount > 1 ? "s" : ""}{" "}
          already selected: {allSelectedFeats.join(", ")}
        </div>
      )}
      {character.innateHeritage && (
        <div
          style={{ fontSize: "12px", color: theme.primary, marginTop: "4px" }}
        >
          Your {character.innateHeritage} heritage unlocks additional feat
          options
        </div>
      )}
    </div>
  );
};
