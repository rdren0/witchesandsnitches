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
  User,
  MoreVertical,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { styles } from "./styles";
import { characterService } from "../../services/characterService";

const SpellBook = ({ spellsData, supabase, user }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [spellAttempts, setSpellAttempts] = useState({});
  const [criticalSuccesses, setCriticalSuccesses] = useState({});
  const [attemptingSpells, setAttemptingSpells] = useState({});
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openMenus, setOpenMenus] = useState({});
  const [editingSpell, setEditingSpell] = useState(null);
  const [editFormData, setEditFormData] = useState({
    successfulAttempts: 0,
    hasCriticalSuccess: false,
  });

  // Get Discord user ID
  const discordUserId = user?.user_metadata?.provider_id;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      closeAllMenus();
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Load characters from the character service
  useEffect(() => {
    if (discordUserId) {
      loadCharacters();
    }
  }, [discordUserId]);

  // Load spell progress when character changes
  useEffect(() => {
    if (selectedCharacter && discordUserId) {
      loadSpellProgress();
    }
  }, [selectedCharacter, discordUserId]);

  const toggleMenu = (spellName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [spellName]: !prev[spellName],
    }));
  };

  const closeAllMenus = () => {
    setOpenMenus({});
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

  const cancelEditing = () => {
    setEditingSpell(null);
    setEditFormData({ successfulAttempts: 0, hasCriticalSuccess: false });
  };

  const saveEdit = async () => {
    if (!selectedCharacter || !discordUserId || !editingSpell) return;

    try {
      // Update the database
      const { data: existingProgress, error: fetchError } = await supabase
        .from("character_spell_progress")
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
        // Update existing record
        const { error: updateError } = await supabase
          .from("character_spell_progress")
          .update(updateData)
          .eq("id", existingProgress.id);

        if (updateError) {
          console.error("Error updating spell progress:", updateError);
          alert("Error updating spell progress");
          return;
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from("character_spell_progress")
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

      // Update local state
      const newAttempts = {};
      const successCount = updateData.successful_attempts;

      if (updateData.has_natural_twenty) {
        // Natural 20 = both boxes checked
        newAttempts[1] = true;
        newAttempts[2] = true;
      } else {
        // Regular attempts
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

  const loadCharacters = async () => {
    if (!discordUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const charactersData = await characterService.getCharacters(
        discordUserId
      );

      // Transform database format to component format
      const transformedCharacters = charactersData.map((char) => ({
        id: char.id,
        name: char.name,
        house: char.house,
        castingStyle: char.casting_style,
        subclass: char.subclass,
        innateHeritage: char.innate_heritage,
        background: char.background,
        level: char.level,
        hitPoints: char.hit_points,
        // Include other character data that might be useful for spell context
        abilityScores: char.ability_scores,
        magicModifiers: char.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },
      }));

      setCharacters(transformedCharacters);

      // Auto-select first character if none selected
      if (!selectedCharacter && transformedCharacters.length > 0) {
        setSelectedCharacter(transformedCharacters[0]);
      }
    } catch (err) {
      setError("Failed to load characters: " + err.message);
      console.error("Error loading characters:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const attemptSpell = async (spellName, subject) => {
    if (!selectedCharacter || !discordUserId) {
      alert("Please select a character first!");
      return;
    }

    setAttemptingSpells((prev) => ({ ...prev, [spellName]: true }));

    try {
      const rollResult = rollDice();
      const isNaturalTwenty = rollResult.total === 20;
      const isSuccess = rollResult.total >= 11 || isNaturalTwenty;

      // Save attempt to database first (this saves both successful AND failed attempts)
      await saveSpellAttempt(
        spellName,
        subject,
        rollResult.total,
        isSuccess,
        isNaturalTwenty
      );

      // Update local state for immediate UI feedback
      if (isNaturalTwenty) {
        // Natural 20 = immediate mastery (both checkboxes)
        setSpellAttempts((prev) => ({
          ...prev,
          [spellName]: { 1: true, 2: true },
        }));
        setCriticalSuccesses((prev) => ({ ...prev, [spellName]: true }));
      } else if (isSuccess) {
        // Regular success - check the appropriate box
        setSpellAttempts((prev) => {
          const currentAttempts = prev[spellName] || {};
          const successCount =
            Object.values(currentAttempts).filter(Boolean).length;
          const newAttempts = { ...currentAttempts };

          // Check the next available box (1st or 2nd)
          if (!newAttempts[1]) {
            newAttempts[1] = true;
          } else if (!newAttempts[2]) {
            newAttempts[2] = true;
          }

          return {
            ...prev,
            [spellName]: newAttempts,
          };
        });
      }

      // Send to Discord
      await sendToDiscord(spellName, rollResult, isSuccess, isNaturalTwenty);
    } catch (error) {
      console.error("Error attempting spell:", error);
      alert("Error processing spell attempt. Please try again.");
    } finally {
      setAttemptingSpells((prev) => ({ ...prev, [spellName]: false }));
    }
  };

  const toggleSection = (subject, level) => {
    const key = `${subject}-${level}`;
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getIcon = (iconName) => {
    const iconMap = {
      Wand2: Wand2,
      Zap: Zap,
      BookOpen: BookOpen,
      Shield: Shield,
      Eye: Eye,
      Heart: Heart,
      PawPrint: Squirrel, // Using Squirrel as closest match to PawPrint
      Skull: Skull,
    };
    return iconMap[iconName] || Star; // Default to Star instead of emoji
  };

  const loadSpellProgress = async () => {
    if (!selectedCharacter || !discordUserId) return;

    try {
      const { data, error } = await supabase
        .from("character_spell_progress")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error loading spell progress:", error);
        return;
      }

      // Convert to the format expected by the UI
      const formattedAttempts = {};
      const formattedCriticals = {};

      data?.forEach((progress) => {
        formattedAttempts[progress.spell_name] = {};

        // If they got a natural 20, they're automatically mastered (both boxes checked)
        if (progress.has_natural_twenty) {
          formattedAttempts[progress.spell_name][1] = true;
          formattedAttempts[progress.spell_name][2] = true;
          formattedCriticals[progress.spell_name] = true;
        } else {
          // Otherwise, check boxes based on successful attempts
          for (let i = 1; i <= Math.min(progress.successful_attempts, 2); i++) {
            formattedAttempts[progress.spell_name][i] = true;
          }
        }
      });

      setSpellAttempts(formattedAttempts);
      setCriticalSuccesses(formattedCriticals);
    } catch (error) {
      console.error("Error loading spell progress:", error);
    }
  };

  const generateLevelColor = (baseColor, level) => {
    // Convert hex to RGB
    const hex = baseColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Define background intensity multipliers for each level (lighter to more saturated)
    const levelIntensity = {
      Cantrips: 0.1, // Very light background
      "1st Level": 0.15,
      "2nd Level": 0.2,
      "3rd Level": 0.25,
      "4th Level": 0.3,
      "5th Level": 0.35,
      "6th Level": 0.4,
      "7th Level": 0.45,
      "8th Level": 0.5,
      "9th Level": 0.55, // Most saturated background
    };

    const bgIntensity = levelIntensity[level] || 0.25;

    // Create background with increasing saturation
    const lightR = Math.round(
      r * bgIntensity + (255 - 255 * bgIntensity) * 0.9
    );
    const lightG = Math.round(
      g * bgIntensity + (255 - 255 * bgIntensity) * 0.9
    );
    const lightB = Math.round(
      b * bgIntensity + (255 - 255 * bgIntensity) * 0.9
    );

    // Create border - slightly more saturated than background
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

    // Keep text color consistent - use the base subject color
    return {
      backgroundColor: `rgb(${lightR}, ${lightG}, ${lightB})`,
      borderColor: `rgb(${borderR}, ${borderG}, ${borderB})`,
      color: baseColor, // Keep text color same as subject color
    };
  };

  const sendToDiscord = async (
    spellName,
    rollResult,
    isSuccess,
    isNaturalTwenty = false
  ) => {
    const webhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("Discord webhook URL not configured");
      return;
    }

    let title = `${
      selectedCharacter?.name || "Unknown"
    } Attempted: ${spellName}`;
    let resultText = `${isSuccess ? "✅ SUCCESS" : "❌ FAILED"}`;
    let embedColor = isSuccess ? 0x00ff00 : 0xff0000; // Green for success, red for failure
    if (isNaturalTwenty) {
      title = `⭐ ${
        selectedCharacter?.name || "Unknown"
      } Attempted: ${spellName}`;
      resultText = `**${rollResult.total}** - ⭐ CRITICALLY MASTERED!`;
      embedColor = 0xffd700; // Gold for natural 20
    }

    const fields = [
      {
        name: "Result",
        value: resultText,
        inline: true,
      },
      {
        name: "Player",
        value: user?.user_metadata?.full_name || "Unknown Player",
        inline: true,
      },
    ];

    // Add character level and house info if available
    if (selectedCharacter?.level || selectedCharacter?.house) {
      fields.push({
        name: "Character",
        value: `${selectedCharacter?.name || "Unknown"} \n Level ${
          selectedCharacter.level || "?"
        } ${selectedCharacter?.castingStyle || "Unknown Class"} • ${
          selectedCharacter.house || "No House"
        }`,
        inline: true,
      });
    }

    const embed = {
      title: title,
      description: rollResult.output,
      color: embedColor,
      fields: fields,
      timestamp: new Date().toISOString(),
      footer: {
        text: "Witches And Snitches - Spellcasting Attempt",
      },
    };

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [embed],
        }),
      });
    } catch (error) {
      console.error("Error sending to Discord:", error);
    }
  };

  const saveSpellAttempt = async (
    spellName,
    subject,
    rollResult,
    isSuccess,
    isNaturalTwenty = false
  ) => {
    if (!selectedCharacter || !discordUserId) return;

    try {
      const { error } = await supabase.from("spell_attempts").insert([
        {
          character_id: selectedCharacter.id,
          discord_user_id: discordUserId, // Include Discord user ID
          spell_name: spellName,
          spell_subject: subject,
          roll_result: rollResult,
          is_success: isSuccess,
          is_natural_twenty: isNaturalTwenty,
        },
      ]);

      if (error) {
        console.error("Error saving spell attempt:", error);
        throw error;
      }

      // Reload spell progress to reflect the new attempt
      await loadSpellProgress();
    } catch (error) {
      console.error("Error saving spell attempt:", error);
    }
  };

  const renderSubjectCard = (subjectName, subjectData) => {
    const Icon = getIcon(subjectData.icon);
    const stats = getSubjectStats(subjectName);
    const isExpanded = expandedSubjects[subjectName];

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

  const getSubjectStats = (subject) => {
    const levels = spellsData[subject].levels;
    const totalSpells = Object.values(levels).reduce(
      (total, spells) => total + spells.length,
      0
    );
    const masteredSpells = Object.values(levels)
      .flat()
      .filter((spell) => {
        const attempts = spellAttempts[spell] || {};
        return Object.values(attempts).filter(Boolean).length >= 2;
      }).length;

    const attemptedSpells = Object.values(levels)
      .flat()
      .filter((spell) => {
        const attempts = spellAttempts[spell] || {};
        return (
          Object.keys(attempts).length > 0 ||
          Object.values(attempts).filter(Boolean).length > 0
        );
      }).length;

    return { totalSpells, masteredSpells, attemptedSpells };
  };

  const renderSpellRow = (spell, index, subject) => {
    const attempts = spellAttempts[spell] || {};
    const successCount = getSuccessfulAttempts(spell);
    const hasCriticalSuccess = criticalSuccesses[spell] || false;
    const isMastered = successCount >= 2;
    const isSpecial = spell.includes("*");
    const isAttempting = attemptingSpells[spell];

    // Check if spell has been attempted (even if no successes)
    const hasAttempts = Object.keys(attempts).length > 0 || successCount > 0;

    return (
      <tr
        key={spell}
        style={{
          ...styles.tableRow,
          ...(isMastered ? styles.tableRowMastered : {}),
          ...(hasAttempts && !isMastered ? { backgroundColor: "#fef3c7" } : {}), // Light yellow for attempted but not mastered
        }}
        onMouseEnter={(e) => {
          if (!isMastered) {
            Object.assign(e.target.style, styles.tableRowHover);
          }
        }}
        onMouseLeave={(e) => {
          if (!isMastered) {
            e.target.style.backgroundColor = hasAttempts
              ? "#fef3c7"
              : "transparent";
          }
        }}
      >
        <td style={{ ...styles.tableCell, width: "3rem" }}>{index + 1}</td>
        <td style={styles.tableCell}>
          <div style={styles.spellNameContainer}>
            <span
              style={isMastered ? styles.spellNameMastered : styles.spellName}
            >
              {spell}
            </span>
            {isSpecial && (
              <Star size={16} color="#eab308" title="Special/Advanced Spell" />
            )}
            {isMastered && (
              <span style={styles.masteredBadge}>
                {hasCriticalSuccess ? "Critically Mastered" : "Mastered"}
              </span>
            )}
            {hasAttempts && !isMastered && (
              <span
                style={{
                  ...styles.masteredBadge,
                  backgroundColor: "#fbbf24",
                  color: "#92400e",
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
                checked={attempts[1] || false}
                onChange={(e) => updateAttempts(spell, 1, e.target.checked)}
                disabled={hasCriticalSuccess}
                style={{
                  ...styles.checkbox,
                  accentColor: "#3b82f6",
                  cursor: hasCriticalSuccess ? "not-allowed" : "pointer",
                }}
              />
              <span style={styles.checkboxText}>1st</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={attempts[2] || false}
                onChange={(e) => updateAttempts(spell, 2, e.target.checked)}
                disabled={hasCriticalSuccess}
                style={{
                  ...styles.checkbox,
                  accentColor: "#10b981",
                  cursor: hasCriticalSuccess ? "not-allowed" : "pointer",
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
                title="Critical Success - Mastered with Natural 20! (Only needed one successful attempt)"
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
            onClick={() => attemptSpell(spell, subject)}
            disabled={isAttempting || isMastered || !selectedCharacter}
            style={{
              ...styles.attemptButton,
              ...(isMastered || isAttempting || !selectedCharacter
                ? styles.attemptButtonDisabled
                : {}),
            }}
            onMouseEnter={(e) => {
              if (!isMastered && !isAttempting && selectedCharacter) {
                Object.assign(e.target.style, styles.attemptButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (!isMastered && !isAttempting && selectedCharacter) {
                e.target.style.backgroundColor = "#3b82f6";
                e.target.style.transform = "translateY(0)";
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
              toggleMenu(spell);
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
              e.target.style.backgroundColor = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <MoreVertical size={16} color="#6b7280" />
          </button>

          {openMenus[spell] && (
            <div
              style={{
                position: "absolute",
                right: "0",
                top: "100%",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                minWidth: "160px",
                padding: "4px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => startEditing(spell)}
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
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f3f4f6";
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

          {editingSpell === spell && (
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
                  backgroundColor: "white",
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
                  }}
                >
                  Edit Progress: {spell}
                </h3>
                <p
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  Current:{" "}
                  {
                    Object.values(spellAttempts[spell] || {}).filter(Boolean)
                      .length
                  }{" "}
                  successful attempts
                  {criticalSuccesses[spell] ? " (Critical Success)" : ""}
                </p>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
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
                      border: "2px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "14px",
                      backgroundColor: editFormData.hasCriticalSuccess
                        ? "#f9fafb"
                        : "white",
                      cursor: editFormData.hasCriticalSuccess
                        ? "not-allowed"
                        : "text",
                    }}
                  />
                  {editFormData.hasCriticalSuccess && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
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
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editFormData.hasCriticalSuccess}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          hasCriticalSuccess: e.target.checked,
                          // If marking as critical success, automatically set to mastery (2 attempts)
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
                      color: "#6b7280",
                      marginTop: "4px",
                      marginLeft: "24px",
                    }}
                  >
                    Checking this will automatically set successful attempts to
                    2 (mastery)
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
                      border: "2px solid #d1d5db",
                      backgroundColor: "white",
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
  };

  const getTotalSpells = () => {
    return Object.values(spellsData).reduce((total, subject) => {
      return (
        total +
        Object.values(subject.levels).reduce(
          (levelTotal, spells) => levelTotal + spells.length,
          0
        )
      );
    }, 0);
  };

  const getTotalMastered = () => {
    return Object.keys(spellAttempts).filter((spell) => {
      const attempts = spellAttempts[spell] || {};
      return Object.values(attempts).filter(Boolean).length >= 2;
    }).length;
  };

  const rollDice = () => {
    const roller = new DiceRoller();
    const roll = roller.roll("1d20");
    return {
      total: roll.total,
      notation: roll.notation,
      output: roll.output,
    };
  };

  const updateAttempts = async (spell, attemptNumber, checked) => {
    if (!selectedCharacter || !discordUserId) return;

    // Don't allow unchecking if this spell was critically mastered (natural 20)
    if (criticalSuccesses[spell] && !checked) {
      alert("Cannot modify attempts for critically mastered spells!");
      return;
    }

    setSpellAttempts((prev) => {
      const newAttempts = {
        ...prev,
        [spell]: {
          ...prev[spell],
          [attemptNumber]: checked,
        },
      };
      return newAttempts;
    });

    // Update the database with the new attempt status
    try {
      // First, check if a progress record exists
      const { data: existingProgress, error: fetchError } = await supabase
        .from("character_spell_progress")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .eq("discord_user_id", discordUserId)
        .eq("spell_name", spell)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching spell progress:", fetchError);
        return;
      }

      // Don't update if this was a critical success
      if (existingProgress?.has_natural_twenty) {
        return;
      }

      const currentAttempts = spellAttempts[spell] || {};
      const updatedAttempts = { ...currentAttempts, [attemptNumber]: checked };
      const successfulAttempts =
        Object.values(updatedAttempts).filter(Boolean).length;

      if (existingProgress) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("character_spell_progress")
          .update({
            successful_attempts: successfulAttempts,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingProgress.id);

        if (updateError) {
          console.error("Error updating spell progress:", updateError);
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from("character_spell_progress")
          .insert([
            {
              character_id: selectedCharacter.id,
              discord_user_id: discordUserId,
              spell_name: spell,
              successful_attempts: successfulAttempts,
              has_natural_twenty: false,
            },
          ]);

        if (insertError) {
          console.error("Error inserting spell progress:", insertError);
        }
      }
    } catch (error) {
      console.error("Error updating spell progress:", error);
    }
  };

  const toggleSubject = (subjectName) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectName]: !prev[subjectName],
    }));
  };

  const getSuccessfulAttempts = (spell) => {
    const attempts = spellAttempts[spell] || {};
    return Object.values(attempts).filter(Boolean).length;
  };

  const renderSection = (subject, level, spells, subjectColor) => {
    const isExpanded = expandedSections[`${subject}-${level}`];
    const levelColor = generateLevelColor(subjectColor, level);
    const masteredCount = spells.filter(
      (spell) => getSuccessfulAttempts(spell) >= 2
    ).length;
    const progressPercentage = (masteredCount / spells.length) * 100;

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
              {spells.map((spell, index) =>
                renderSpellRow(spell, index, subject)
              )}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  const totalSpells = getTotalSpells();
  const totalMastered = getTotalMastered();

  // Authentication check
  if (!user || !discordUserId) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "#6B7280", marginBottom: "16px" }}>
          Authentication Required
        </h2>
        <p style={{ color: "#6B7280" }}>
          Please log in with Discord to access the spellbook.
        </p>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Character Selection Header */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderBottom: "2px solid #e2e8f0",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            maxWidth: "1200px",
            margin: "0 auto",
            flexWrap: "wrap",
          }}
        >
          <User size={24} color="#64748b" />
          <label
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Character:
          </label>
          <select
            value={selectedCharacter?.id || ""}
            onChange={(e) => {
              const char = characters.find(
                (c) => c.id === parseInt(e.target.value)
              );
              setSelectedCharacter(char);
            }}
            style={{
              padding: "8px 12px",
              fontSize: "16px",
              border: "2px solid #d1d5db",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#374151",
              minWidth: "200px",
            }}
            disabled={isLoading}
          >
            <option value="">
              {isLoading ? "Loading characters..." : "Select a character..."}
            </option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name} ({char.castingStyle || "Unknown Class"}) - Level{" "}
                {char.level || "?"}
              </option>
            ))}
          </select>

          {selectedCharacter && (
            <div
              style={{
                backgroundColor: "#10b981",
                color: "white",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <span>✓ {selectedCharacter.name}</span>
              <span style={{ fontSize: "12px", opacity: 0.9 }}>
                {selectedCharacter.castingStyle} • Level{" "}
                {selectedCharacter.level} • {selectedCharacter.house}
              </span>
            </div>
          )}

          {characters.length === 0 && !isLoading && (
            <div
              style={{
                backgroundColor: "#fbbf24",
                color: "#92400e",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              No characters found. Create a character in the Character Creation
              tab first.
            </div>
          )}
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#FEE2E2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              padding: "12px",
              borderRadius: "8px",
              margin: "16px 0",
              fontSize: "14px",
              maxWidth: "1200px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {error}
          </div>
        )}
      </div>

      <div style={styles.statsContainer}>
        <span style={styles.statItem}>
          <span
            style={{ ...styles.statDot, backgroundColor: "#60a5fa" }}
          ></span>
          {totalSpells} Total Spells
        </span>
        <span style={styles.statItem}>
          <span
            style={{ ...styles.statDot, backgroundColor: "#34d399" }}
          ></span>
          {totalMastered} Mastered
        </span>
        {selectedCharacter && (
          <span style={styles.statItem}>
            <span
              style={{ ...styles.statDot, backgroundColor: "#8b5cf6" }}
            ></span>
            Playing as {selectedCharacter.name}
          </span>
        )}
      </div>
      <div style={styles.subjectsGrid}>
        {Object.entries(spellsData).map(([subjectName, subjectData]) =>
          renderSubjectCard(subjectName, subjectData)
        )}
      </div>
    </div>
  );
};

export default SpellBook;
