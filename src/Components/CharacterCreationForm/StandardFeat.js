import { standardFeats } from "../data";
import { styles } from "./styles";

export const StandardFeat = ({
  character,
  setCharacter,
  setExpandedFeats,
  expandedFeats,
  featFilter,
  setFeatFilter,
}) => {
  const handleFeatToggle = (featName) => {
    setCharacter((prev) => {
      const currentFeats = prev.standardFeats;
      const isCurrentlySelected = currentFeats.includes(featName);

      if (!isCurrentlySelected && currentFeats.length >= 1) {
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
    if (character.standardFeats.length === 1) {
      return standardFeats.filter((feat) =>
        character.standardFeats.includes(feat.name)
      );
    }

    if (!featFilter.trim()) return standardFeats;

    const searchTerm = featFilter.toLowerCase();
    return standardFeats.filter(
      (feat) =>
        feat.name.toLowerCase().includes(searchTerm) ||
        feat.preview.toLowerCase().includes(searchTerm) ||
        feat.description.toLowerCase().includes(searchTerm)
    );
  };
  const filteredFeats = getFilteredFeats();

  return (
    <div style={styles.fieldContainer}>
      <h3 style={styles.skillsHeader}>
        Standard Feats ({character.standardFeats.length}/1 selected)
      </h3>

      {character.standardFeats.length < 1 && (
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
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#FCD34D";
                e.target.style.transform = "translateY(-50%) scale(1.1)";
                e.target.style.boxShadow = "0 3px 6px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#FBBF24";
                e.target.style.transform = "translateY(-50%) scale(1)";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
              }}
            >
              ×
            </button>
          )}
          {featFilter.trim() && (
            <div style={styles.featFilterResults}>
              Showing {filteredFeats.length} of {standardFeats.length} feats
            </div>
          )}
        </div>
      )}

      {character.standardFeats.length === 1 && (
        <div
          style={{
            backgroundColor: "#F0FDF4",
            border: "2px solid #10B981",
            color: "#059669",
            padding: "12px",
            borderRadius: "8px",
            margin: "12px 0",
            fontSize: "14px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          ✓ Feat selection complete! Showing your selected feat. Uncheck it to
          see all feats again.
        </div>
      )}

      <div style={styles.featsContainer}>
        {filteredFeats.length === 0 ? (
          <div style={styles.noFeatsFound}>
            No feats found matching "{featFilter}". Try a different search term.
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
                      {feat.description.map((description) => (
                        <li>{description}</li>
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
        Note: You can select 1 standard feat at Level 1.
      </div>
    </div>
  );
};
