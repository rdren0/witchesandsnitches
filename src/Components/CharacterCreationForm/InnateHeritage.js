import { useState } from "react";
import { styles } from "./styles";
import { innateHeritages, heritageDescriptions } from "../data";

export const InnateHeritage = ({ character, handleInputChange }) => {
  const [expandedHeritages, setExpandedHeritages] = useState(new Set());
  const [heritageFilter, setHeritageFilter] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [pendingHeritage, setPendingHeritage] = useState("");

  const isHigherLevel = character.level > 1;
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

    if (isHigherLevel && newValue !== character.innateHeritage) {
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
        {isHigherLevel && (
          <div
            style={{
              backgroundColor: "#FEF3C7",
              color: "#92400E",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
              border: "1px solid #F59E0B",
            }}
          >
            ⚠️ Level {character.level} Character
          </div>
        )}
      </div>

      {isHigherLevel && (
        <div
          style={{
            backgroundColor: "#FEE2E2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "12px",
            fontSize: "14px",
          }}
        >
          <strong>⚠️ Level Restriction Warning:</strong> Innate Heritage
          selection is typically only available for Level 1 characters. Higher
          level characters should have their heritage established during
          character creation. Changing heritage at Level {character.level} may
          require DM approval.
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
          {heritageFilter.trim() && (
            <div style={styles.featFilterResults}>
              Showing {filteredHeritages.length} of {innateHeritages.length}{" "}
              heritages
            </div>
          )}
        </div>
      )}

      {hasSelectedHeritage === 1 && (
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
          ✓ Heritage selected! Showing your chosen heritage. Uncheck to remove
          selection and see all heritages again.
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
                      type="radio"
                      name="innateHeritage"
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
                      {heritageData?.benefits.map((benefit) => (
                        <li>{benefit}</li>
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
        that provides unique abilities and traits. Heritage is typically
        established at Level 1.
        {isHigherLevel &&
          " Heritage changes for higher-level characters may require DM approval."}
      </div>

      {showWarning && (
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
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
              margin: "20px",
            }}
          >
            <h3 style={{ margin: "0 0 16px 0", color: "#DC2626" }}>
              ⚠️ Level Restriction Warning
            </h3>
            <p
              style={{
                margin: "0 0 16px 0",
                fontSize: "14px",
                color: "#374151",
              }}
            >
              You are attempting to change the Innate Heritage of a Level{" "}
              {character.level} character. Heritage is typically established at
              character creation (Level 1). This change may require DM approval
              and could affect character balance.
            </p>
            <p
              style={{
                margin: "0 0 20px 0",
                fontSize: "14px",
                color: "#374151",
                fontWeight: "bold",
              }}
            >
              Are you sure you want to proceed?
            </p>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setShowWarning(false);
                  setPendingHeritage("");
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6B7280",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmChange}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#DC2626",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
