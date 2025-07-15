import React, { useState } from "react";
import {
  GraduationCap,
  TrendingUp,
  Star,
  AlertTriangle,
  X,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const SchoolYearAdvancementModal = ({
  character,
  isOpen,
  onClose,
  onAdvance,
  supabase,
}) => {
  const { theme } = useTheme();
  const [advancementData, setAdvancementData] = useState({
    newSchoolYear: (character?.school_year || 1) + 1,
    levelIncrease: 1,
    reason: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !character) return null;

  const currentYear = character.school_year || 1;
  const currentLevel = character.level || 1;
  const newLevel = currentLevel + advancementData.levelIncrease;

  const canAdvance = () => {
    return (
      advancementData.newSchoolYear > currentYear &&
      advancementData.newSchoolYear <= 7 &&
      advancementData.levelIncrease >= 0
    );
  };

  const getAdvancementType = () => {
    if (advancementData.newSchoolYear === currentYear + 1) {
      return "Normal Academic Progression";
    } else if (advancementData.newSchoolYear > currentYear + 1) {
      return "Academic Acceleration (Skipping Years)";
    }
    return "Irregular Advancement";
  };

  const getRecommendedLevelIncrease = () => {
    const yearDifference = advancementData.newSchoolYear - currentYear;
    return Math.max(1, yearDifference);
  };

  const handleAdvance = async () => {
    if (!canAdvance()) return;

    setIsProcessing(true);
    try {
      await onAdvance(character.id, {
        newSchoolYear: advancementData.newSchoolYear,
        levelIncrease: advancementData.levelIncrease,
        reason: advancementData.reason,
      });
      onClose();
    } catch (error) {
      console.error("Failed to advance school year:", error);
      alert("Failed to advance school year: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: theme.background,
      borderRadius: "12px",
      padding: "24px",
      maxWidth: "600px",
      width: "90%",
      maxHeight: "90vh",
      overflowY: "auto",
      border: `1px solid ${theme.border}`,
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px",
      paddingBottom: "16px",
      borderBottom: `1px solid ${theme.border}`,
    },
    title: {
      margin: 0,
      color: theme.text,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: theme.textSecondary,
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px",
    },
    section: {
      marginBottom: "24px",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "16px",
    },
    fieldGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      marginBottom: "6px",
      fontWeight: "500",
      color: theme.text,
    },
    select: {
      width: "100%",
      padding: "8px 12px",
      borderRadius: "6px",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      color: theme.text,
      fontSize: "14px",
    },
    input: {
      width: "100%",
      padding: "8px 12px",
      borderRadius: "6px",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      color: theme.text,
      fontSize: "14px",
    },
    textarea: {
      width: "100%",
      padding: "8px 12px",
      borderRadius: "6px",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      color: theme.text,
      fontSize: "14px",
      minHeight: "80px",
      resize: "vertical",
    },
    summaryCard: {
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
    },
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginBottom: "12px",
    },
    summaryItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    warningCard: {
      backgroundColor: theme.warning + "20",
      border: `1px solid ${theme.warning}`,
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "16px",
      display: "flex",
      alignItems: "flex-start",
      gap: "8px",
    },
    buttonContainer: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      fontWeight: "500",
      cursor: "pointer",
      fontSize: "14px",
    },
    cancelButton: {
      backgroundColor: theme.surface,
      color: theme.text,
      border: `1px solid ${theme.border}`,
    },
    advanceButton: {
      backgroundColor: theme.primary,
      color: "white",
    },
    disabledButton: {
      backgroundColor: theme.textSecondary,
      color: theme.background,
      cursor: "not-allowed",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <GraduationCap size={24} />
            School Year Advancement
          </h2>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <Star size={16} />
            Current Status
          </h3>
          <div style={styles.grid}>
            <div>
              <strong>School Year:</strong> Year {currentYear}
            </div>
            <div>
              <strong>Character Level:</strong> Level {currentLevel}
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <TrendingUp size={16} />
            Advancement Details
          </h3>

          <div style={styles.grid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>New School Year</label>
              <select
                style={styles.select}
                value={advancementData.newSchoolYear}
                onChange={(e) =>
                  setAdvancementData((prev) => ({
                    ...prev,
                    newSchoolYear: parseInt(e.target.value),
                  }))
                }
              >
                {Array.from(
                  { length: 7 - currentYear },
                  (_, i) => currentYear + i + 1
                ).map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Level Increase (Recommended: {getRecommendedLevelIncrease()})
              </label>
              <input
                type="number"
                style={styles.input}
                value={advancementData.levelIncrease}
                onChange={(e) =>
                  setAdvancementData((prev) => ({
                    ...prev,
                    levelIncrease: Math.max(0, parseInt(e.target.value) || 0),
                  }))
                }
                min="0"
                max="5"
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Reason for Advancement</label>
            <textarea
              style={styles.textarea}
              value={advancementData.reason}
              onChange={(e) =>
                setAdvancementData((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              placeholder="Describe why this character is advancing (e.g., 'End of school year', 'Exceptional performance', 'Story progression')..."
            />
          </div>
        </div>

        <div style={styles.summaryCard}>
          <h4 style={{ margin: "0 0 12px 0", color: theme.text }}>
            Advancement Summary
          </h4>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryItem}>
              <span>Type:</span>
              <strong>{getAdvancementType()}</strong>
            </div>
            <div style={styles.summaryItem}>
              <span>Years Advanced:</span>
              <strong>{advancementData.newSchoolYear - currentYear}</strong>
            </div>
            <div style={styles.summaryItem}>
              <span>New Level:</span>
              <strong>Level {newLevel}</strong>
            </div>
            <div style={styles.summaryItem}>
              <span>Level Increase:</span>
              <strong>+{advancementData.levelIncrease}</strong>
            </div>
          </div>
        </div>

        {advancementData.levelIncrease !== getRecommendedLevelIncrease() && (
          <div style={styles.warningCard}>
            <AlertTriangle size={16} color={theme.warning} />
            <div style={{ fontSize: "14px" }}>
              <strong>Notice:</strong> You're giving a level increase of{" "}
              {advancementData.levelIncrease}, but the recommended increase for
              advancing {advancementData.newSchoolYear - currentYear} year(s) is{" "}
              {getRecommendedLevelIncrease()}.
            </div>
          </div>
        )}

        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.button,
              ...(canAdvance() && !isProcessing
                ? styles.advanceButton
                : styles.disabledButton),
            }}
            onClick={handleAdvance}
            disabled={!canAdvance() || isProcessing}
          >
            {isProcessing ? "Advancing..." : "Advance School Year"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolYearAdvancementModal;
