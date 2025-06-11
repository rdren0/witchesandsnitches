import { standardFeats } from "../../data";
import { createFeatStyles } from "../../../styles/masterStyles";
import { useTheme } from "../../../contexts/ThemeContext";
import { allSkills } from "../../CharacterSheet/utils";

export const StandardFeat = ({
  character,
  setCharacter,
  setExpandedFeats,
  expandedFeats,
  featFilter,
  setFeatFilter,
  maxFeats = 1,
  isLevel1Choice = false,
  characterLevel = 1,
}) => {
  const { theme } = useTheme();
  const styles = createFeatStyles(theme);

  const handleFeatToggle = (featName) => {
    setCharacter((prev) => {
      const currentFeats = prev.standardFeats;
      const isCurrentlySelected = currentFeats.includes(featName);

      if (!isCurrentlySelected && currentFeats.length >= maxFeats) {
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
    if (character.standardFeats.length === maxFeats) {
      return standardFeats.filter((feat) =>
        character.standardFeats.includes(feat.name)
      );
    }

    if (!featFilter.trim()) return standardFeats;

    const searchTerm = featFilter.toLowerCase();

    const matchingSkills = allSkills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(searchTerm) ||
        skill.displayName.toLowerCase().includes(searchTerm) ||
        skill.displayName.toLowerCase().startsWith(searchTerm) ||
        skill.name.toLowerCase().startsWith(searchTerm)
    );

    return standardFeats.filter((feat) => {
      const basicMatch =
        feat.name.toLowerCase().includes(searchTerm) ||
        feat.preview.toLowerCase().includes(searchTerm);

      const descriptionText = Array.isArray(feat.description)
        ? feat.description.join(" ").toLowerCase()
        : (feat.description || "").toLowerCase();

      const descriptionMatch = descriptionText.includes(searchTerm);

      const skillMatch = matchingSkills.some((skill) => {
        const skillDisplayName = skill.displayName.toLowerCase();
        const skillKey = skill.name.toLowerCase();

        return (
          descriptionText.includes(skillDisplayName) ||
          descriptionText.includes(skillKey) ||
          descriptionText.includes(`${skillDisplayName} check`) ||
          descriptionText.includes(`${skillDisplayName} checks`) ||
          descriptionText.includes(`${skillKey} check`) ||
          descriptionText.includes(`${skillKey} checks`) ||
          feat.name.toLowerCase().includes(skillDisplayName) ||
          feat.name.toLowerCase().includes(skillKey) ||
          feat.preview.toLowerCase().includes(skillDisplayName) ||
          feat.preview.toLowerCase().includes(skillKey)
        );
      });

      const skillTermMatch =
        matchingSkills.length > 0 &&
        matchingSkills.some((skill) => {
          const ability = skill.ability;

          return (
            descriptionText.includes(ability) ||
            descriptionText.includes(`${ability} check`) ||
            descriptionText.includes(`${ability} checks`) ||
            descriptionText.includes(`${ability} saving throw`) ||
            descriptionText.includes(`${ability}-based`)
          );
        });

      return basicMatch || descriptionMatch || skillMatch || skillTermMatch;
    });
  };

  const filteredFeats = getFilteredFeats();

  const getHelpText = () => {
    if (characterLevel === 1) {
      return "Select your starting feat.";
    } else {
      return `Select your feats: 1 starting feat from Level 1, plus up to ${
        characterLevel - 1
      } additional feat${
        characterLevel > 2 ? "s" : ""
      } from Levels 2-${characterLevel}. Total possible: ${characterLevel} feat${
        characterLevel > 1 ? "s" : ""
      }.`;
    }
  };

  return (
    <div style={styles.fieldContainer}>
      <h3 style={styles.skillsHeader}>
        Standard Feats ({character.standardFeats.length}/{maxFeats} selected)
      </h3>

      <div style={styles.helpText}>{getHelpText()}</div>

      {character.standardFeats.length < maxFeats && (
        <div style={styles.featFilterContainer}>
          <input
            type="text"
            placeholder="Search feats by name, description, or ASI."
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
              Showing {filteredFeats.length} of {standardFeats.length} feats
              {(() => {
                const matchingSkills = allSkills.filter(
                  (skill) =>
                    skill.name
                      .toLowerCase()
                      .includes(featFilter.toLowerCase()) ||
                    skill.displayName
                      .toLowerCase()
                      .includes(featFilter.toLowerCase())
                );
                return (
                  matchingSkills.length > 0 && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginTop: "4px",
                      }}
                    >
                      Including feats that modify:{" "}
                      {matchingSkills.map((s) => s.displayName).join(", ")}
                    </div>
                  )
                );
              })()}
            </div>
          )}
        </div>
      )}

      {character.standardFeats.length === maxFeats && (
        <div style={styles.completionMessage}>
          ✓ Feat selection complete! You've selected{" "}
          {character.standardFeats.length} of {maxFeats} feat
          {maxFeats > 1 ? "s" : ""}. Uncheck any feat to see all feats again.
        </div>
      )}

      <div style={styles.featsContainer}>
        {filteredFeats.length === 0 ? (
          <div style={styles.noFeatsFound}>
            No feats found matching "{featFilter}". Try a different search term
            or skill name.
          </div>
        ) : (
          filteredFeats.map((feat) => {
            const isSelected = character.standardFeats.includes(feat.name);
            return (
              <div
                key={feat.name}
                style={isSelected ? styles.featCardSelected : styles.featCard}
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
                        isSelected ? styles.featNameSelected : styles.featName
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
                    isSelected ? styles.featPreviewSelected : styles.featPreview
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
                    <ul>
                      {feat.description.map((description, index) => (
                        <li key={index}>{description}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div style={styles.helpText}>
        Note: You can select {maxFeats} feat{maxFeats > 1 ? "s" : ""} total
        {isLevel1Choice
          ? ` for a Level ${characterLevel} character`
          : " at Level 1"}
        . Search supports skill names like "deception", "athletics",
        "perception", etc.
      </div>
    </div>
  );
};

export default StandardFeat;
