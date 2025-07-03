// Enhanced DowntimeForm.js with improved dropdown disabling
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getDowntimeStyles } from "../../styles/masterStyles";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

const DowntimeForm = ({
  formData,
  setFormData,
  selectedCharacter,
  selectedYear,
  setSelectedYear,
  selectedSemester,
  setSelectedSemester,
  canEdit,
  isYearSemesterSubmitted = () => false,
  submittedSheets = [],
}) => {
  const { theme } = useTheme();
  const styles = getDowntimeStyles(theme);

  // Enhanced logic to determine which year/semester combinations are available
  const getYearAvailability = () => {
    const allYears = [1, 2, 3, 4, 5, 6, 7];

    return allYears.map((year) => {
      const submittedSemesters = submittedSheets
        .filter((sheet) => sheet.year === year)
        .map((sheet) => sheet.semester);

      const availableSemesters = [1, 2].filter(
        (sem) => !submittedSemesters.includes(sem)
      );

      return {
        year,
        hasSubmissions: submittedSemesters.length > 0,
        fullyCompleted: submittedSemesters.length === 2,
        availableSemesters,
        submittedSemesters,
      };
    });
  };

  const getSemesterAvailability = () => {
    if (!selectedYear) return [];

    return [1, 2].map((semester) => {
      const isSubmitted = isYearSemesterSubmitted(selectedYear, semester);
      return {
        semester,
        isSubmitted,
        isAvailable: !isSubmitted,
      };
    });
  };

  const yearAvailability = getYearAvailability();
  const semesterAvailability = getSemesterAvailability();

  // Enhanced styles for the form
  const enhancedStyles = {
    ...styles,
    formContainer: {
      ...styles.formContainer,
      backgroundColor: theme.surface,
      borderRadius: "12px",
      padding: "2rem",
      border: `1px solid ${theme.border}`,
      marginBottom: "1.5rem",
    },
    selectionSection: {
      marginBottom: "2rem",
    },
    selectionRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
      marginBottom: "1rem",
    },
    selectionGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      ...styles.label,
      fontWeight: "600",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    select: {
      ...styles.select,
      padding: "12px",
      borderRadius: "8px",
      border: `2px solid ${theme.border}`,
      backgroundColor: theme.background,
      fontSize: "14px",
      transition: "all 0.2s ease",
      "&:focus": {
        borderColor: theme.primary,
        outline: "none",
      },
    },
    infoCard: {
      padding: "16px",
      backgroundColor: theme.background,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
      marginTop: "1rem",
    },
    warningCard: {
      padding: "16px",
      backgroundColor: theme.warning + "10",
      borderRadius: "8px",
      border: `1px solid ${theme.warning}`,
      marginTop: "1rem",
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
    },
    successCard: {
      padding: "16px",
      backgroundColor: theme.success + "10",
      borderRadius: "8px",
      border: `1px solid ${theme.success}`,
      marginTop: "1rem",
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
    },
    submissionStatus: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "12px",
      marginTop: "4px",
    },
    completionGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: "8px",
      marginTop: "12px",
    },
    yearCard: {
      padding: "8px",
      borderRadius: "6px",
      textAlign: "center",
      fontSize: "12px",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.background,
    },
    yearCardComplete: {
      backgroundColor: theme.success + "20",
      borderColor: theme.success,
      color: theme.success,
    },
    yearCardPartial: {
      backgroundColor: theme.warning + "20",
      borderColor: theme.warning,
      color: theme.warning,
    },
  };

  // Character info section with enhanced styling
  const CharacterInfoSection = () => (
    <div style={{ marginBottom: "2rem" }}>
      <h2
        style={{
          ...enhancedStyles.title,
          fontSize: "24px",
          marginBottom: "1rem",
        }}
      >
        Downtime Sheet
      </h2>
      {selectedCharacter && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            padding: "1.5rem",
            backgroundColor: theme.background,
            borderRadius: "8px",
            border: `1px solid ${theme.border}`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                marginBottom: "4px",
              }}
            >
              Character Name
            </div>
            <div
              style={{ fontSize: "16px", fontWeight: "600", color: theme.text }}
            >
              {selectedCharacter.name}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                marginBottom: "4px",
              }}
            >
              House
            </div>
            <div
              style={{ fontSize: "16px", fontWeight: "600", color: theme.text }}
            >
              {selectedCharacter.house}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                marginBottom: "4px",
              }}
            >
              Academic Year
            </div>
            <div
              style={{ fontSize: "16px", fontWeight: "600", color: theme.text }}
            >
              Year {selectedCharacter.year}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Progress overview section
  const ProgressOverview = () => {
    const totalSubmitted = submittedSheets.length;
    const totalPossible = 14; // 7 years × 2 semesters
    const completionPercentage = Math.round(
      (totalSubmitted / totalPossible) * 100
    );

    return (
      <div style={enhancedStyles.infoCard}>
        <h4
          style={{
            color: theme.text,
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Clock size={16} />
          Submission Progress
        </h4>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: theme.primary,
              }}
            >
              {totalSubmitted}
            </span>
            <span style={{ color: theme.textSecondary, fontSize: "14px" }}>
              /{totalPossible}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: theme.border,
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${completionPercentage}%`,
                  height: "100%",
                  backgroundColor: theme.primary,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
          <div
            style={{ fontSize: "14px", fontWeight: "600", color: theme.text }}
          >
            {completionPercentage}%
          </div>
        </div>

        {/* Year-by-year breakdown */}
        <div style={enhancedStyles.completionGrid}>
          {yearAvailability.map((yearInfo) => (
            <div
              key={yearInfo.year}
              style={{
                ...enhancedStyles.yearCard,
                ...(yearInfo.fullyCompleted
                  ? enhancedStyles.yearCardComplete
                  : yearInfo.hasSubmissions
                  ? enhancedStyles.yearCardPartial
                  : {}),
              }}
              title={`Year ${yearInfo.year}: ${yearInfo.submittedSemesters.length}/2 semesters completed`}
            >
              <div style={{ fontWeight: "600" }}>Y{yearInfo.year}</div>
              <div style={{ fontSize: "10px" }}>
                {yearInfo.submittedSemesters.length}/2
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Year selection with enhanced information
  const YearSelectionSection = () => (
    <div style={enhancedStyles.selectionGroup}>
      <label style={enhancedStyles.label}>Academic Year:</label>
      <select
        value={selectedYear}
        onChange={(e) => {
          setSelectedYear(e.target.value);
          setSelectedSemester(""); // Reset semester when year changes
        }}
        style={enhancedStyles.select}
        disabled={!canEdit()}
      >
        <option value="">Select Year...</option>
        {yearAvailability.map((yearInfo) => (
          <option
            key={yearInfo.year}
            value={yearInfo.year}
            disabled={yearInfo.fullyCompleted}
          >
            Year {yearInfo.year}
            {yearInfo.fullyCompleted
              ? " (Completed)"
              : yearInfo.hasSubmissions
              ? ` (${yearInfo.submittedSemesters.length}/2 semesters)`
              : ""}
          </option>
        ))}
      </select>

      {/* Year selection helper info */}
      {selectedYear && (
        <div style={enhancedStyles.submissionStatus}>
          {(() => {
            const yearInfo = yearAvailability.find(
              (y) => y.year === selectedYear
            );
            if (yearInfo.fullyCompleted) {
              return (
                <>
                  <CheckCircle size={14} color={theme.success} />
                  <span style={{ color: theme.success }}>
                    Both semesters completed for this year
                  </span>
                </>
              );
            } else if (yearInfo.hasSubmissions) {
              return (
                <>
                  <Clock size={14} color={theme.warning} />
                  <span style={{ color: theme.warning }}>
                    {yearInfo.submittedSemesters.length} of 2 semesters
                    completed
                  </span>
                </>
              );
            } else {
              return (
                <>
                  <Clock size={14} color={theme.textSecondary} />
                  <span style={{ color: theme.textSecondary }}>
                    No submissions for this year yet
                  </span>
                </>
              );
            }
          })()}
        </div>
      )}
    </div>
  );

  // Semester selection with enhanced information
  const SemesterSelectionSection = () => (
    <div style={enhancedStyles.selectionGroup}>
      <label style={enhancedStyles.label}>Semester:</label>
      <select
        value={selectedSemester}
        onChange={(e) => setSelectedSemester(e.target.value)}
        style={enhancedStyles.select}
        disabled={!canEdit() || !selectedYear}
      >
        <option value="">
          {!selectedYear ? "Select year first..." : "Select Semester..."}
        </option>
        {selectedYear &&
          semesterAvailability.map((semesterInfo) => (
            <option
              key={semesterInfo.semester}
              value={semesterInfo.semester}
              disabled={semesterInfo.isSubmitted}
            >
              Semester {semesterInfo.semester}
              {semesterInfo.isSubmitted ? " (Already Submitted)" : ""}
            </option>
          ))}
      </select>

      {/* Semester selection helper info */}
      {selectedYear && (
        <div style={enhancedStyles.submissionStatus}>
          {semesterAvailability.filter((s) => s.isAvailable).length > 0 ? (
            <>
              <Clock size={14} color={theme.primary} />
              <span style={{ color: theme.primary }}>
                {semesterAvailability.filter((s) => s.isAvailable).length}{" "}
                semester(s) available
              </span>
            </>
          ) : (
            <>
              <CheckCircle size={14} color={theme.success} />
              <span style={{ color: theme.success }}>
                All semesters completed for this year
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );

  // Warning/info messages
  const ValidationMessages = () => {
    if (!selectedYear || !selectedSemester) return null;

    if (isYearSemesterSubmitted(selectedYear, selectedSemester)) {
      return (
        <div style={enhancedStyles.warningCard}>
          <AlertTriangle size={20} color={theme.warning} />
          <div>
            <div
              style={{
                fontWeight: "600",
                color: theme.warning,
                marginBottom: "4px",
              }}
            >
              Combination Already Submitted
            </div>
            <div style={{ color: theme.text, fontSize: "14px" }}>
              You have already submitted a downtime sheet for Year{" "}
              {selectedYear}, Semester {selectedSemester}. Please select a
              different combination or view your submitted sheet in the
              "Submitted Sheets" tab.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={enhancedStyles.successCard}>
        <CheckCircle size={20} color={theme.success} />
        <div>
          <div
            style={{
              fontWeight: "600",
              color: theme.success,
              marginBottom: "4px",
            }}
          >
            Ready to Create
          </div>
          <div style={{ color: theme.text, fontSize: "14px" }}>
            Year {selectedYear}, Semester {selectedSemester} is available for a
            new downtime sheet.
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={enhancedStyles.formContainer}>
      <CharacterInfoSection />

      <ProgressOverview />

      <div style={enhancedStyles.selectionSection}>
        <h3 style={{ color: theme.text, marginBottom: "1rem" }}>
          Select Academic Period
        </h3>
        <div style={enhancedStyles.selectionRow}>
          <YearSelectionSection />
          <SemesterSelectionSection />
        </div>

        <ValidationMessages />
      </div>
    </div>
  );
};

export default DowntimeForm;
