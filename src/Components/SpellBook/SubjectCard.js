import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Wand2,
  Star,
  Zap,
  BookOpen,
  Shield,
  Eye,
  Heart,
  Squirrel,
  Skull,
  Dice6,
  MoreVertical,
  Edit3,
  Check,
  X,
} from "lucide-react";

import { spellsData } from "./spells";
import { getSpellModifier } from "./utils";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedSpellBookStyles } from "./styles";
import { useRollFunctions } from "../../App/diceRoller";

const getIcon = (iconName) => {
  const iconMap = {
    Wand2: Wand2,
    Zap: Zap,
    BookOpen: BookOpen,
    Shield: Shield,
    Eye: Eye,
    Heart: Heart,
    PawPrint: Squirrel,
    Skull: Skull,
    GraduationCap: BookOpen,
    Moon: Eye,
    Ban: Skull,
    Scroll: BookOpen,
  };
  return iconMap[iconName] || Star;
};

export const SubjectCard = ({
  criticalSuccesses,
  customUsername,
  discordUserId,
  expandedSections,
  expandedSubjects,
  selectedCharacter,
  setCriticalSuccesses,
  setError,
  setExpandedSections,
  setExpandedSubjects,
  setSpellAttempts,
  spellAttempts,
  subjectData,
  subjectName,
  supabase,
  user,
}) => {
  const { attemptSpell } = useRollFunctions();
  const { theme } = useTheme();
  const styles = createThemedSpellBookStyles(theme);
  const [attemptingSpells, setAttemptingSpells] = useState({});
  const [openMenus, setOpenMenus] = useState({});
  const [editingSpell, setEditingSpell] = useState(null);
  const [editFormData, setEditFormData] = useState({
    successfulAttempts: 0,
    hasCriticalSuccess: false,
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const getSubjectStats = (subject) => {
    const levels = spellsData[subject].levels;
    const totalSpells = Object.values(levels).reduce(
      (total, spells) => total + spells.length,
      0
    );
    const masteredSpells = Object.values(levels)
      .flat()
      .filter((spellObj) => {
        const spellName = spellObj.name;
        const attempts = spellAttempts?.[spellName] ?? {};
        return Object.values(attempts).filter(Boolean).length >= 2;
      }).length;

    const attemptedSpells = Object.values(levels)
      .flat()
      .filter((spellObj) => {
        const spellName = spellObj.name;
        const attempts = spellAttempts[spellName] || {};
        return (
          Object.keys(attempts).length > 0 ||
          Object.values(attempts).filter(Boolean).length > 0
        );
      }).length;

    return { totalSpells, masteredSpells, attemptedSpells };
  };

  const Icon = getIcon(subjectData.icon);
  const stats = getSubjectStats(subjectName);
  const isExpanded = expandedSubjects[subjectName];

  const generateLevelColor = (baseColor, level) => {
    const hex = baseColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const levelIntensity = {
      Cantrips: 0.1,
      "1st Level": 0.15,
      "2nd Level": 0.2,
      "3rd Level": 0.25,
      "4th Level": 0.3,
      "5th Level": 0.35,
      "6th Level": 0.4,
      "7th Level": 0.45,
      "8th Level": 0.5,
      "9th Level": 0.55,
    };

    const bgIntensity = levelIntensity[level] || 0.25;

    const lightR = Math.round(
      r * bgIntensity + (255 - 255 * bgIntensity) * 0.9
    );
    const lightG = Math.round(
      g * bgIntensity + (255 - 255 * bgIntensity) * 0.9
    );
    const lightB = Math.round(
      b * bgIntensity + (255 - 255 * bgIntensity) * 0.9
    );

    const borderIntensity = bgIntensity * 2;
    const borderR = Math.round(
      r * borderIntensity + (255 - 255 * borderIntensity) * 0.7
    );
    const borderG = Math.round(
      g * borderIntensity + (255 - 255 * borderIntensity) * 0.7
    );
    const borderB = Math.round(
      b * borderIntensity + (255 - 255 * borderIntensity) * 0.7
    );

    return {
      backgroundColor: `rgb(${lightR}, ${lightG}, ${lightB})`,
      borderColor: `rgb(${borderR}, ${borderG}, ${borderB})`,
      color: baseColor,
    };
  };

  const getSuccessfulAttempts = (spellName) => {
    const attempts = spellAttempts[spellName] || {};
    return Object.values(attempts).filter(Boolean).length;
  };

  const startEditing = (spellName) => {
    const attempts = spellAttempts[spellName] || {};
    const successCount = Object.values(attempts).filter(Boolean).length;
    const hasCritical = criticalSuccesses[spellName] || false;

    setEditFormData({
      successfulAttempts: successCount,
      hasCriticalSuccess: hasCritical,
    });
    setEditingSpell(spellName);
    closeAllMenus();
  };

  useEffect(() => {
    const handleClickOutside = () => {
      closeAllMenus();
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const cancelEditing = () => {
    setEditingSpell(null);
    setEditFormData({ successfulAttempts: 0, hasCriticalSuccess: false });
  };

  const saveEdit = async () => {
    if (!selectedCharacter || !discordUserId || !editingSpell) return;

    try {
      const { data: existingProgress, error: fetchError } = await supabase
        .from("spell_progress_summary")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .eq("discord_user_id", discordUserId)
        .eq("spell_name", editingSpell)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching spell progress:", fetchError);
        return;
      }

      const updateData = {
        successful_attempts: Math.min(
          Math.max(editFormData.successfulAttempts, 0),
          2
        ),
        has_natural_twenty: editFormData.hasCriticalSuccess,
        updated_at: new Date().toISOString(),
      };

      if (existingProgress) {
        const { error: updateError } = await supabase
          .from("spell_progress_summary")
          .update(updateData)
          .eq("id", existingProgress.id);

        if (updateError) {
          console.error("Error updating spell progress:", updateError);
          alert("Error updating spell progress");
          return;
        }
      } else {
        const { error: insertError } = await supabase
          .from("spell_progress_summary")
          .insert([
            {
              character_id: selectedCharacter.id,
              discord_user_id: discordUserId,
              spell_name: editingSpell,
              ...updateData,
            },
          ]);

        if (insertError) {
          console.error("Error inserting spell progress:", insertError);
          alert("Error creating spell progress");
          return;
        }
      }

      const newAttempts = {};
      const successCount = updateData.successful_attempts;

      if (updateData.has_natural_twenty) {
        newAttempts[1] = true;
        newAttempts[2] = true;
      } else {
        for (let i = 1; i <= successCount; i++) {
          newAttempts[i] = true;
        }
      }

      setSpellAttempts((prev) => ({
        ...prev,
        [editingSpell]: newAttempts,
      }));

      setCriticalSuccesses((prev) => ({
        ...prev,
        [editingSpell]: updateData.has_natural_twenty,
      }));

      cancelEditing();
    } catch (error) {
      console.error("Error saving edit:", error);
      alert("Error saving changes");
    }
  };

  const toggleSection = (subject, level) => {
    const key = `${subject}-${level}`;
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleSubject = (subjectName) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectName]: !prev[subjectName],
    }));
  };

  const toggleDescription = (spellName) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [spellName]: !prev[spellName],
    }));
  };

  useEffect(() => {
    if (selectedCharacter && discordUserId) {
      loadSpellProgress();
    }
    // eslint-disable-next-line
  }, [selectedCharacter, discordUserId]);

  const updateSpellProgressSummary = async (spellName, isNaturalTwenty) => {
    if (!selectedCharacter || !discordUserId) return;

    try {
      const { data: existingProgress, error: fetchError } = await supabase
        .from("spell_progress_summary")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .eq("discord_user_id", discordUserId)
        .eq("spell_name", spellName)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching spell progress:", fetchError);
        return;
      }

      let newSuccessfulAttempts = 1;
      let hasNaturalTwenty = isNaturalTwenty;

      if (existingProgress) {
        if (existingProgress.has_natural_twenty) {
          return;
        }

        if (isNaturalTwenty) {
          newSuccessfulAttempts = 2;
        } else {
          newSuccessfulAttempts = Math.min(
            existingProgress.successful_attempts + 1,
            2
          );
        }

        const { error: updateError } = await supabase
          .from("spell_progress_summary")
          .update({
            successful_attempts: newSuccessfulAttempts,
            has_natural_twenty: hasNaturalTwenty,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingProgress.id);

        if (updateError) {
          console.error("Error updating spell progress:", updateError);
        }
      } else {
        newSuccessfulAttempts = isNaturalTwenty ? 2 : 1;

        const { error: insertError } = await supabase
          .from("spell_progress_summary")
          .insert([
            {
              character_id: selectedCharacter.id,
              discord_user_id: discordUserId,
              spell_name: spellName,
              successful_attempts: newSuccessfulAttempts,
              has_natural_twenty: hasNaturalTwenty,
            },
          ]);

        if (insertError) {
          console.error("Error inserting spell progress:", insertError);
        }
      }

      await loadSpellProgress();
    } catch (error) {
      console.error("Error updating spell progress summary:", error);
    }
  };

  const toggleMenu = (spellName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [spellName]: !prev[spellName],
    }));
  };

  const closeAllMenus = () => {
    setOpenMenus({});
  };

  const loadSpellProgress = async () => {
    if (!selectedCharacter || !discordUserId) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("spell_progress_summary")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error loading spell progress:", error);
        setError(`Failed to load spell progress: ${error.message}`);
        return;
      }

      const formattedAttempts = {};
      const formattedCriticals = {};

      data?.forEach((progress) => {
        formattedAttempts[progress.spell_name] = {};

        if (progress.has_natural_twenty) {
          formattedAttempts[progress.spell_name][1] = true;
          formattedAttempts[progress.spell_name][2] = true;
          formattedCriticals[progress.spell_name] = true;
        } else {
          for (let i = 1; i <= Math.min(progress.successful_attempts, 2); i++) {
            formattedAttempts[progress.spell_name][i] = true;
          }
        }
      });
      setSpellAttempts(formattedAttempts);
      setCriticalSuccesses(formattedCriticals);
    } catch (error) {
      console.error("Error loading spell progress:", error);
      setError(`Failed to load spell progress: ${error.message}`);
    }
  };

  const renderSection = (subject, level, spells, subjectColor) => {
    const isExpanded = expandedSections[`${subject}-${level}`];
    const levelColor = generateLevelColor(subjectColor, level);
    const masteredCount = spells.filter(
      (spellObj) => getSuccessfulAttempts(spellObj.name) >= 2
    ).length;
    const progressPercentage = (masteredCount / spells.length) * 100;

    const renderSpellRow = (spellObj, index, subject) => {
      const spellName = spellObj.name;
      const attempts = spellAttempts[spellName] || {};
      const successCount = getSuccessfulAttempts(spellName);
      const hasCriticalSuccess = criticalSuccesses[spellName] || false;
      const isMastered = successCount >= 2;
      const isRestricted = spellObj.restriction || false;
      const isAttempting = attemptingSpells[spellName];
      const hasAttempts = Object.keys(attempts).length > 0 || successCount > 0;
      const isDescriptionExpanded = expandedDescriptions[spellName];

      const mainRow = (
        <tr
          key={spellName}
          style={{
            ...styles.tableRow,
            ...(isMastered ? styles.tableRowMastered : {}),
            ...(hasAttempts && !isMastered
              ? { backgroundColor: theme === "dark" ? "#1f2937" : "#f8fafc" }
              : {}),
          }}
          onMouseEnter={(e) => {
            if (!isMastered) {
              Object.assign(e.target.style, styles.tableRowHover);
            }
          }}
          onMouseLeave={(e) => {
            if (!isMastered) {
              e.target.style.backgroundColor = hasAttempts
                ? theme === "dark"
                  ? "#1f2937"
                  : "#f8fafc"
                : "transparent";
            }
          }}
        >
          <td style={{ ...styles.tableCell, width: "3rem" }}>{index + 1}</td>
          <td style={styles.tableCell}>
            <div style={styles.spellNameContainer}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={
                    isMastered ? styles.spellNameMastered : styles.spellName
                  }
                >
                  {spellName}
                </span>
                {isRestricted && (
                  <Star
                    size={16}
                    color="#eab308"
                    title="Restricted/Advanced Spell"
                  />
                )}
                {spellObj.description && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDescription(spellName);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px",
                      display: "flex",
                      alignItems: "center",
                      color: theme === "dark" ? "#9ca3af" : "#6b7280",
                    }}
                    title={
                      isDescriptionExpanded
                        ? "Hide description"
                        : "Show description"
                    }
                  >
                    {isDescriptionExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                )}
              </div>

              {hasCriticalSuccess && (
                <span
                  style={{
                    ...styles.masteredBadge,
                    backgroundColor: "#fbbf24",
                    color: "#92400e",
                    border: "none",
                  }}
                >
                  Critically Mastered
                </span>
              )}
              {isMastered && !hasCriticalSuccess && (
                <span
                  style={{
                    ...styles.masteredBadge,
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                  }}
                >
                  Mastered
                </span>
              )}
              {hasAttempts && !isMastered && (
                <span
                  style={{
                    ...styles.masteredBadge,
                    backgroundColor: "white",
                    color: "#10b981",
                    border: "2px solid #10b981",
                  }}
                >
                  Attempted
                </span>
              )}
            </div>
          </td>
          <td style={styles.tableCell}>
            <div style={styles.attemptsContainer}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={Boolean(attempts[1])}
                  disabled={true}
                  readOnly={true}
                  style={{
                    ...styles.checkbox,
                    accentColor: "#3b82f6",
                    cursor: "not-allowed",
                    opacity: 0.8,
                  }}
                />
                <span style={styles.checkboxText}>1st</span>
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={Boolean(attempts[2])}
                  disabled={true}
                  readOnly={true}
                  style={{
                    ...styles.checkbox,
                    accentColor: "#10b981",
                    cursor: "not-allowed",
                    opacity: 0.8,
                  }}
                />
                <span style={styles.checkboxText}>2nd</span>
              </label>
            </div>
          </td>
          <td style={{ ...styles.tableCell, textAlign: "center" }}>
            {hasCriticalSuccess ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <Star
                  size={20}
                  color="#ffd700"
                  fill="#ffd700"
                  title="Critical Success - Mastered with Natural 20!"
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "#ffd700",
                    fontWeight: "bold",
                  }}
                >
                  20
                </span>
              </div>
            ) : (
              <span style={{ color: "#9ca3af" }}>-</span>
            )}
          </td>
          <td style={{ ...styles.tableCell, textAlign: "center" }}>
            <button
              onClick={() =>
                attemptSpell({
                  spellName,
                  subject,
                  getSpellModifier,
                  selectedCharacter,
                  setSpellAttempts,
                  discordUserId,
                  setAttemptingSpells,
                  setCriticalSuccesses,
                  updateSpellProgressSummary,
                })
              }
              disabled={isAttempting || isMastered || !selectedCharacter}
              style={{
                ...styles.attemptButton,
                ...(isMastered || isAttempting || !selectedCharacter
                  ? styles.attemptButtonDisabled
                  : {}),
              }}
              onMouseEnter={(e) => {
                if (!isMastered && !isAttempting && selectedCharacter) {
                  e.target.style.backgroundColor = "#2563eb";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMastered && !isAttempting && selectedCharacter) {
                  e.target.style.backgroundColor = "#3b82f6";
                }
              }}
            >
              <Dice6 size={14} />
              {isAttempting ? "Rolling..." : "Attempt"}
            </button>
          </td>
          <td
            style={{
              ...styles.tableCell,
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu(spellName);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor =
                  theme === "dark" ? "#4b5563" : "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <MoreVertical
                size={16}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
            </button>

            {openMenus[spellName] && (
              <div
                style={{
                  position: "absolute",
                  right: "0",
                  top: "100%",
                  backgroundColor: theme === "dark" ? "#374151" : "white",
                  border: `1px solid ${
                    theme === "dark" ? "#4b5563" : "#e5e7eb"
                  }`,
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  zIndex: 1000,
                  minWidth: "160px",
                  padding: "4px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => startEditing(spellName)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    borderRadius: "4px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: theme === "dark" ? "#d1d5db" : "#374151",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor =
                      theme === "dark" ? "#4b5563" : "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  <Edit3 size={14} />
                  Edit Progress
                </button>
              </div>
            )}

            {editingSpell === spellName && (
              <div
                style={{
                  position: "fixed",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2000,
                }}
                onClick={cancelEditing}
              >
                <div
                  style={{
                    backgroundColor: theme === "dark" ? "#374151" : "white",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    minWidth: "400px",
                    maxWidth: "500px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: theme === "dark" ? "#f9fafb" : "#1f2937",
                    }}
                  >
                    Edit Progress: {spellName}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 16px 0",
                      fontSize: "14px",
                      color: theme === "dark" ? "#9ca3af" : "#6b7280",
                    }}
                  >
                    Current:{" "}
                    {
                      Object.values(spellAttempts[spellName] || {}).filter(
                        Boolean
                      ).length
                    }{" "}
                    successful attempts
                    {criticalSuccesses[spellName] ? " (Critical Success)" : ""}
                  </p>

                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme === "dark" ? "#f9fafb" : "#374151",
                      }}
                    >
                      Successful Attempts (0-2):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      value={
                        editFormData.hasCriticalSuccess
                          ? 2
                          : editFormData.successfulAttempts
                      }
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          successfulAttempts: parseInt(e.target.value) || 0,
                        }))
                      }
                      disabled={editFormData.hasCriticalSuccess}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: `2px solid ${
                          theme === "dark" ? "#4b5563" : "#d1d5db"
                        }`,
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: editFormData.hasCriticalSuccess
                          ? theme === "dark"
                            ? "#1f2937"
                            : "#f9fafb"
                          : theme === "dark"
                          ? "#374151"
                          : "white",
                        color: theme === "dark" ? "#f9fafb" : "#1f2937",
                        cursor: editFormData.hasCriticalSuccess
                          ? "not-allowed"
                          : "text",
                      }}
                    />
                    {editFormData.hasCriticalSuccess && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: theme === "dark" ? "#9ca3af" : "#6b7280",
                          marginTop: "4px",
                        }}
                      >
                        Automatically set to 2 due to critical success
                      </p>
                    )}
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        color: theme === "dark" ? "#f9fafb" : "#374151",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={editFormData.hasCriticalSuccess}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            hasCriticalSuccess: e.target.checked,
                            successfulAttempts: e.target.checked
                              ? 2
                              : prev.successfulAttempts,
                          }))
                        }
                        style={{ width: "16px", height: "16px" }}
                      />
                      <span style={{ fontSize: "14px", fontWeight: "500" }}>
                        Critical Success (Natural 20)
                      </span>
                    </label>
                    <p
                      style={{
                        fontSize: "12px",
                        color: theme === "dark" ? "#9ca3af" : "#6b7280",
                        marginTop: "4px",
                        marginLeft: "24px",
                      }}
                    >
                      Checking this will automatically set successful attempts
                      to 2 (mastery)
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={cancelEditing}
                      style={{
                        padding: "8px 16px",
                        border: `2px solid ${
                          theme === "dark" ? "#4b5563" : "#d1d5db"
                        }`,
                        backgroundColor: theme === "dark" ? "#374151" : "white",
                        color: theme === "dark" ? "#f9fafb" : "#374151",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <X size={14} />
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      style={{
                        padding: "8px 16px",
                        border: "2px solid #10b981",
                        backgroundColor: "#10b981",
                        color: "white",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Check size={14} />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </td>
        </tr>
      );

      const descriptionRow =
        isDescriptionExpanded && spellObj.description ? (
          <tr key={`${spellName}-description`}>
            <td colSpan="6" style={{ padding: "0", border: "none" }}>
              <div
                style={{
                  margin: "0 16px 12px 16px",
                  padding: "16px",
                  backgroundColor: theme === "dark" ? "#374151" : "#f8fafc",
                  border: `1px solid ${
                    theme === "dark" ? "#4b5563" : "#e2e8f0"
                  }`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: theme === "dark" ? "#60a5fa" : "#1e40af",
                    marginBottom: "8px",
                    fontSize: "16px",
                  }}
                >
                  {spellName}
                </div>
                <div
                  style={{
                    fontStyle: "italic",
                    color: theme === "dark" ? "#9ca3af" : "#6b7280",
                    marginBottom: "12px",
                    fontSize: "13px",
                  }}
                >
                  {spellObj.level} •{" "}
                  {spellObj.castingTime || "Unknown casting time"} • Range:{" "}
                  {spellObj.range || "Unknown"} • Duration:{" "}
                  {spellObj.duration || "Unknown"}
                </div>
                <div
                  style={{
                    whiteSpace: "pre-line",
                    color: theme === "dark" ? "#d1d5db" : "#374151",
                    marginBottom: "12px",
                  }}
                >
                  {spellObj.description}
                </div>
                {spellObj.higherLevels && (
                  <div
                    style={{
                      marginBottom: "12px",
                      fontStyle: "italic",
                      color: theme === "dark" ? "#9ca3af" : "#6b7280",
                    }}
                  >
                    <strong>At Higher Levels:</strong> {spellObj.higherLevels}
                  </div>
                )}
                {spellObj.tags && spellObj.tags.length > 0 && (
                  <div>
                    {spellObj.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          backgroundColor:
                            theme === "dark" ? "#4b5563" : "#e5e7eb",
                          color: theme === "dark" ? "#d1d5db" : "#374151",
                          fontSize: "12px",
                          borderRadius: "4px",
                          marginRight: "6px",
                          fontWeight: "500",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </td>
          </tr>
        ) : null;

      return [mainRow, descriptionRow].filter(Boolean);
    };

    return (
      <div key={level} style={styles.sectionContainer}>
        <button
          onClick={() => toggleSection(subject, level)}
          style={{
            ...styles.sectionButton,
            backgroundColor: levelColor.backgroundColor,
            borderColor: levelColor.borderColor,
            color: levelColor.color,
          }}
          onMouseEnter={(e) => {
            Object.assign(e.target.style, styles.sectionButtonHover);
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = "none";
          }}
        >
          <div style={styles.sectionLeft}>
            {isExpanded ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
            <span>
              {level} ({spells.length} spells)
            </span>
          </div>
          <div style={styles.sectionRight}>
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
              {masteredCount}/{spells.length} Mastered
            </span>
            <div style={styles.sectionProgress}>
              <div
                style={{
                  ...styles.sectionProgressFill,
                  width: `${progressPercentage}%`,
                }}
              ></div>
            </div>
          </div>
        </button>

        {isExpanded && (
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={{ ...styles.tableHeaderCell, width: "3rem" }}>#</th>
                <th style={styles.tableHeaderCell}>Spell Name</th>
                <th style={styles.tableHeaderCell}>Successful Attempts</th>
                <th style={styles.tableHeaderCellCenter}>Critical</th>
                <th style={styles.tableHeaderCellCenter}>Action</th>
                <th style={{ ...styles.tableHeaderCellCenter, width: "3rem" }}>
                  Menu
                </th>
              </tr>
            </thead>
            <tbody>
              {spells
                .map((spellObj, index) =>
                  renderSpellRow(spellObj, index, subject)
                )
                .flat()}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div key={subjectName} style={styles.subjectCard}>
      <div
        style={{
          ...styles.subjectHeader,
          borderLeftColor: subjectData.color,
          borderLeftWidth: "4px",
          borderLeftStyle: "solid",
          cursor: "pointer",
        }}
        onClick={() => toggleSubject(subjectName)}
      >
        <div style={styles.subjectTitleContainer}>
          <Icon size={24} color={subjectData.color} />
          <h2 style={{ ...styles.subjectTitle, color: subjectData.color }}>
            {subjectName}
          </h2>
          <div style={{ marginLeft: "auto" }}>
            {isExpanded ? (
              <ChevronDown size={24} color={subjectData.color} />
            ) : (
              <ChevronRight size={24} color={subjectData.color} />
            )}
          </div>
        </div>
        <p style={styles.subjectDescription}>{subjectData.description}</p>
        <div style={styles.subjectStats}>
          <div style={styles.subjectStatItem}>
            <span
              style={{
                ...styles.subjectStatNumber,
                color: subjectData.color,
              }}
            >
              {stats.totalSpells}
            </span>
            <span style={styles.subjectStatLabel}>Total Spells</span>
          </div>
          <div style={styles.subjectStatItem}>
            <span style={{ ...styles.subjectStatNumber, color: "#10b981" }}>
              {stats.masteredSpells}
            </span>
            <span style={styles.subjectStatLabel}>Mastered</span>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div style={styles.subjectContent}>
          {Object.entries(subjectData.levels)
            .filter(([level, spells]) => spells.length > 0)
            .map(([level, spells]) =>
              renderSection(subjectName, level, spells, subjectData.color)
            )}
        </div>
      )}
    </div>
  );
};
