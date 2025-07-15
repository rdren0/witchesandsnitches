import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const SchoolYearSelector = ({
  schoolYear,
  onSchoolYearChange,
  level,
  onLevelChange,
  styles,
}) => {
  const { theme } = useTheme();

  // Helper to get suggested level range for a school year
  const getSuggestedLevelRange = (year) => {
    const ranges = {
      1: "1-2",
      2: "2-4",
      3: "3-6",
      4: "4-8",
      5: "5-10",
      6: "6-14",
      7: "7-20",
    };
    return ranges[year] || "1-20";
  };

  // Helper to get suggested school year for a level
  const getSuggestedSchoolYear = (level) => {
    if (level <= 2) return 1;
    if (level <= 4) return 2;
    if (level <= 6) return 3;
    if (level <= 8) return 4;
    if (level <= 10) return 5;
    if (level <= 14) return 6;
    return 7;
  };

  return (
    <div style={styles.fieldContainer}>
      <h3 style={styles.sectionHeader}>Character Progression</h3>

      <div
        style={{
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            color: theme.textSecondary,
            marginBottom: "12px",
            lineHeight: "1.5",
          }}
        >
          <strong>School Year</strong> represents academic progress (like
          Harry's "First Year"), while <strong>Character Level</strong>{" "}
          represents magical power gained through adventures.
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {/* School Year Selection */}
          <div>
            <label style={styles.label}>
              School Year
              <span style={{ color: theme.danger, marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={schoolYear || ""}
              onChange={(e) => onSchoolYearChange(parseInt(e.target.value))}
              style={styles.select}
              required
            >
              <option value="">Select Year...</option>
              {[1, 2, 3, 4, 5, 6, 7].map((year) => (
                <option key={year} value={year}>
                  Year {year} (Levels {getSuggestedLevelRange(year)})
                </option>
              ))}
            </select>
            <div
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                marginTop: "4px",
              }}
            >
              Determines dormitory, classes, and story content
            </div>
          </div>

          {/* Character Level Selection */}
          <div>
            <label style={styles.label}>
              Character Level
              <span style={{ color: theme.danger, marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={level || ""}
              onChange={(e) => onLevelChange(parseInt(e.target.value))}
              style={styles.select}
              required
            >
              <option value="">Select Level...</option>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl}
                </option>
              ))}
            </select>
            <div
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                marginTop: "4px",
              }}
            >
              Determines spells, abilities, and combat power
            </div>
          </div>
        </div>

        {/* Mismatch Warning */}
        {schoolYear &&
          level &&
          getSuggestedSchoolYear(level) !== schoolYear && (
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                background: theme.warning + "20",
                border: `1px solid ${theme.warning}`,
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              <strong>Notice:</strong> Level {level} is unusual for a Year{" "}
              {schoolYear} student. Consider: Year{" "}
              {getSuggestedSchoolYear(level)} students typically have Level{" "}
              {level} power, or Year {schoolYear} students typically have Levels{" "}
              {getSuggestedLevelRange(schoolYear)}.
            </div>
          )}

        {/* Examples */}
        <div
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: theme.textSecondary,
            lineHeight: "1.4",
          }}
        >
          <strong>Examples:</strong> A Year 3 Level 2 student is academically
          advanced but magically average. A Year 2 Level 5 student is a young
          prodigy with exceptional magical power.
        </div>
      </div>
    </div>
  );
};

export default SchoolYearSelector;
