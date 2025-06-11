import { useState } from "react";
import { innateHeritages, heritageDescriptions } from "../../data";
import { createFeatStyles } from "../../../styles/masterStyles";
import { useTheme } from "../../../contexts/ThemeContext";

export const InnateHeritage = ({
  character,
  handleInputChange,
  isEditing = false,
}) => {
  const { theme } = useTheme();
  const styles = createFeatStyles(theme);
  const [expandedHeritages, setExpandedHeritages] = useState(new Set());
  const [heritageFilter, setHeritageFilter] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [pendingHeritage, setPendingHeritage] = useState("");

  const isHigherLevel = character.level > 1;
  const shouldShowLevelWarning = isHigherLevel && isEditing;
  const hasSelectedHeritage = character.innateHeritage ? 1 : 0;

  const toggleHeritageExpansion = (heritageName) => {
    setExpandedHeritages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(heritageName)) {
        newSet.delete(heritageName);
      } else {
        newSet.add(heritageName);
      }
      return newSet;
    });
  };

  const getFilteredHeritages = () => {
    if (hasSelectedHeritage === 1) {
      return innateHeritages.filter(
        (heritage) => heritage === character.innateHeritage
      );
    }

    if (!heritageFilter.trim()) return innateHeritages;

    const searchTerm = heritageFilter.toLowerCase();
    return innateHeritages.filter((heritage) => {
      const heritageData = heritageDescriptions[heritage];
      return (
        heritage.toLowerCase().includes(searchTerm) ||
        heritageData?.preview?.toLowerCase().includes(searchTerm) ||
        heritageData?.description?.toLowerCase().includes(searchTerm)
      );
    });
  };

  const handleHeritageToggle = (heritageName) => {
    const newValue =
      character.innateHeritage === heritageName ? "" : heritageName;

    if (shouldShowLevelWarning && newValue !== character.innateHeritage) {
      setPendingHeritage(newValue);
      setShowWarning(true);
      return;
    }

    handleInputChange("innateHeritage", newValue);
  };

  const confirmChange = () => {
    handleInputChange("innateHeritage", pendingHeritage);
    setShowWarning(false);
    setPendingHeritage("");
  };

  const filteredHeritages = getFilteredHeritages();

  return (
    <div style={styles.fieldContainer}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <h3 style={styles.skillsHeader}>
          Innate Heritage ({hasSelectedHeritage}/1 selected)
        </h3>
        {shouldShowLevelWarning && (
          <div style={styles.warningBadge}>
            ⚠️ Editing Level {character.level} Character
          </div>
        )}
      </div>

      {shouldShowLevelWarning && (
        <div style={styles.levelRestrictionWarning}>
          <strong>⚠️ Editing Existing Character:</strong> You are modifying the
          Innate Heritage of an existing Level {character.level} character.
          Heritage is typically established during character creation. This
          change may require DM approval and could affect character balance.
        </div>
      )}

      {hasSelectedHeritage < 1 && (
        <div style={styles.featFilterContainer}>
          <input
            type="text"
            placeholder="Search heritages by name, preview, or description..."
            value={heritageFilter}
            onChange={(e) => setHeritageFilter(e.target.value)}
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
          {heritageFilter.trim() && (
            <button
              onClick={() => setHeritageFilter("")}
              style={styles.featFilterClearButton}
              type="button"
              title="Clear search"
            >
              ×
            </button>
          )}
          {heritageFilter.trim() && (
            <div style={styles.featFilterResults}>
              Showing {filteredHeritages.length} of {innateHeritages.length}{" "}
              heritages
            </div>
          )}
        </div>
      )}

      {hasSelectedHeritage === 1 && (
        <div style={styles.completionMessage}>
          ✓ Heritage selected! Click the checkbox to unselect and choose a
          different heritage or switch back to a standard feat.
        </div>
      )}

      <div style={styles.featsContainer}>
        {filteredHeritages.length === 0 ? (
          <div style={styles.noFeatsFound}>
            No heritages found matching "{heritageFilter}". Try a different
            search term.
          </div>
        ) : (
          filteredHeritages.map((heritage) => {
            const isSelected = character.innateHeritage === heritage;
            const heritageData = heritageDescriptions[heritage];
            return (
              <div
                key={heritage}
                style={isSelected ? styles.featCardSelected : styles.featCard}
              >
                <div style={styles.featHeader}>
                  <label style={styles.featLabelClickable}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleHeritageToggle(heritage)}
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
                      {heritage}
                    </span>
                  </label>
                  <button
                    onClick={() => toggleHeritageExpansion(heritage)}
                    style={styles.expandButton}
                    type="button"
                  >
                    {expandedHeritages.has(heritage) ? "▲" : "▼"}
                  </button>
                </div>

                <div
                  style={
                    isSelected ? styles.featPreviewSelected : styles.featPreview
                  }
                >
                  {heritageData?.description || "No preview available."}
                </div>

                {expandedHeritages.has(heritage) && (
                  <div
                    style={
                      isSelected
                        ? styles.featDescriptionSelected
                        : styles.featDescription
                    }
                  >
                    <ul>
                      {heritageData?.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      )) || "No description available."}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div style={styles.helpText}>
        Note: Innate Heritage is optional and represents your character's
        magical bloodline or supernatural ancestry. You can select one heritage
        that provides unique abilities and traits. Click the checkbox to
        select/unselect a heritage.
        {isEditing
          ? "Modifying heritage for existing characters may require DM approval."
          : "Heritage can be selected during character creation at any level."}
      </div>

      {showWarning && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>⚠️ Character Edit Warning</h3>
            <p style={styles.modalText}>
              You are attempting to change the Innate Heritage of an existing
              Level {character.level} character. Heritage is typically
              established during character creation and changing it for an
              existing character may require DM approval and could affect
              character balance.
            </p>
            <p style={styles.modalTextBold}>
              Are you sure you want to proceed with this change?
            </p>
            <div style={styles.modalButtons}>
              <button
                onClick={() => {
                  setShowWarning(false);
                  setPendingHeritage("");
                }}
                style={styles.modalCancelButton}
              >
                Cancel
              </button>
              <button onClick={confirmChange} style={styles.modalConfirmButton}>
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InnateHeritage;
