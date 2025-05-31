import React, { useState, useEffect } from "react";

import { styles } from "./styles";
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

import {
  spellsData,
  INDIVIDUAL_SPELL_MODIFIERS,
  TRADITIONAL_SCHOOL_MAPPINGS,
  SPELL_DESCRIPTIONS,
} from "./spells";
import { getModifierInfo, getSpellModifier } from "./utils";

import { DiceRoller } from "@dice-roller/rpg-dice-roller";

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
  const [attemptingSpells, setAttemptingSpells] = useState({});

  const [openMenus, setOpenMenus] = useState({});
  const [editingSpell, setEditingSpell] = useState(null);
  const [editFormData, setEditFormData] = useState({
    successfulAttempts: 0,
    hasCriticalSuccess: false,
  });
  // const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const getSubjectStats = (subject) => {
    const levels = spellsData[subject].levels;
    const totalSpells = Object.values(levels).reduce(
      (total, spells) => total + spells.length,
      0
    );
    const masteredSpells = Object.values(levels)
      .flat()
      .filter((spell) => {
        console.log("spell:", spell);
        const attempts = spellAttempts?.[spell] ?? {};
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
  const Icon = getIcon(subjectData.icon);
  const stats = getSubjectStats(subjectName);
  const isExpanded = expandedSubjects[subjectName];
  const getSpellDescription = (spellName) => {
    return SPELL_DESCRIPTIONS[spellName] || null;
  };

  const formatSpellDescription = (description) => {
    if (!description) return null;

    const lines = description.split("\n");
    const spellName = lines[0];
    const subtitle = lines[1] || "";
    const details = lines.slice(2).join("\n").trim();

    return {
      name: spellName,
      subtitle: subtitle,
      details: details,
    };
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

  const getSuccessfulAttempts = (spell) => {
    const attempts = spellAttempts[spell] || {};
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

  const attemptSpell = async (spellName, subject) => {
    if (!selectedCharacter || !discordUserId) {
      alert("Please select a character first!");
      return;
    }

    setAttemptingSpells((prev) => ({ ...prev, [spellName]: true }));

    try {
      const rollResult = rollDice();
      const totalModifier = getSpellModifier(
        spellName,
        subject,
        selectedCharacter
      );
      const modifiedTotal = rollResult.total + totalModifier;

      const isNaturalTwenty = rollResult.total === 20;
      const isNaturalOne = rollResult.total === 1;
      const isSuccess =
        (modifiedTotal >= 11 || isNaturalTwenty) && !isNaturalOne;

      await saveSpellAttempt(
        spellName,
        subject,
        rollResult.total,
        isSuccess,
        isNaturalTwenty,
        isNaturalOne,
        totalModifier,
        modifiedTotal
      );

      if (isNaturalTwenty) {
        setSpellAttempts((prev) => ({
          ...prev,
          [spellName]: { 1: true, 2: true },
        }));
        setCriticalSuccesses((prev) => ({ ...prev, [spellName]: true }));
      } else if (isSuccess) {
        setSpellAttempts((prev) => {
          const currentAttempts = prev[spellName] || {};
          const newAttempts = { ...currentAttempts };

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

      await sendToDiscord(
        spellName,
        rollResult,
        isSuccess,
        isNaturalTwenty,
        isNaturalOne,
        totalModifier,
        modifiedTotal,
        subject
      );

      if (isSuccess) {
        await updateSpellProgressSummary(spellName, isNaturalTwenty);
      }
    } catch (error) {
      console.error("Error attempting spell:", error);
      alert("Error processing spell attempt. Please try again.");
    } finally {
      setAttemptingSpells((prev) => ({ ...prev, [spellName]: false }));
    }
  };

  const toggleSubject = (subjectName) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectName]: !prev[subjectName],
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

      console.log("Loaded spell progress data:", data);

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

      console.log("Formatted attempts:", formattedAttempts);
      console.log("Formatted criticals:", formattedCriticals);

      setSpellAttempts(formattedAttempts);
      setCriticalSuccesses(formattedCriticals);
    } catch (error) {
      console.error("Error loading spell progress:", error);
      setError(`Failed to load spell progress: ${error.message}`);
    }
  };

  const sendToDiscord = async (
    spellName,
    rollResult,
    isSuccess,
    isNaturalTwenty = false,
    isNaturalOne = false,
    totalModifier = 0,
    modifiedTotal = 0,
    subject = ""
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
    let embedColor = isSuccess ? 0x00ff00 : 0xff0000;

    if (isNaturalTwenty) {
      title = `⭐ ${
        selectedCharacter?.name || "Unknown"
      } Attempted: ${spellName}`;
      resultText = `**${rollResult.total}** - ⭐ CRITICALLY MASTERED!`;
      embedColor = 0xffd700;
    } else if (isNaturalOne) {
      title = `💥 ${
        selectedCharacter?.name || "Unknown"
      } Attempted: ${spellName}`;
      resultText = `**${rollResult.total}** - 💥 CRITICAL FAILURE!`;
      embedColor = 0x8b0000;
    }

    let rollDescription = `**Roll:** ${rollResult.total}`;
    if (totalModifier !== 0) {
      const modifierText =
        totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;
      rollDescription += ` ${modifierText} = **${modifiedTotal}**`;
    }

    const fields = [
      {
        name: "Result",
        value: resultText,
        inline: true,
      },
      {
        name: "Roll Details",
        value: rollDescription,
        inline: true,
      },
      {
        name: "Player",
        value:
          customUsername ?? user?.user_metadata?.full_name ?? "Unknown Player",
        inline: true,
      },
    ];

    if (totalModifier !== 0 && selectedCharacter) {
      const modifierInfo = getModifierInfo(
        spellName,
        subject,
        selectedCharacter
      );

      let modifierBreakdown = `**${modifierInfo.source}**\n`;
      modifierBreakdown += `${modifierInfo.abilityName}: ${
        modifierInfo.abilityModifier >= 0 ? "+" : ""
      }${modifierInfo.abilityModifier}`;
      if (modifierInfo.wandModifier !== 0) {
        modifierBreakdown += `\nWand (${modifierInfo.wandType}): ${
          modifierInfo.wandModifier >= 0 ? "+" : ""
        }${modifierInfo.wandModifier}`;
      }
      modifierBreakdown += `\n**Total: ${
        totalModifier >= 0 ? "+" : ""
      }${totalModifier}**`;

      fields.push({
        name: "Modifier Breakdown",
        value: modifierBreakdown,
        inline: false,
      });
    }

    const embed = {
      title: title,
      description: rollResult.output,
      color: embedColor,
      fields: fields,
      timestamp: new Date().toISOString(),
      footer: {
        text: "Witches And Snitches - Spellcasting",
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
    isNaturalTwenty = false,
    isNaturalOne = false,
    totalModifier = 0,
    modifiedTotal = 0
  ) => {
    if (!selectedCharacter || !discordUserId) return;

    try {
      const modifierInfo = getModifierInfo(
        spellName,
        subject,
        selectedCharacter
      );

      const { error } = await supabase.from("spell_attempts").insert([
        {
          character_id: selectedCharacter.id,
          discord_user_id: discordUserId,
          spell_name: spellName,
          spell_subject: subject,
          roll_result: rollResult,
          modified_total: modifiedTotal,
          total_modifier: totalModifier,
          is_success: isSuccess,
          is_natural_twenty: isNaturalTwenty,
          is_natural_one: isNaturalOne,

          modifier_source: INDIVIDUAL_SPELL_MODIFIERS[spellName]
            ? "individual"
            : TRADITIONAL_SCHOOL_MAPPINGS[subject]
            ? "school"
            : "category",
          ability_used: modifierInfo.abilityName.toLowerCase(),
          wand_modifier_used: modifierInfo.wandType.toLowerCase(),
          ability_modifier: modifierInfo.abilityModifier,
          wand_modifier_value: modifierInfo.wandModifier,
        },
      ]);

      if (error) {
        console.error("Error saving spell attempt:", error);
        throw error;
      }

      await loadSpellProgress();
    } catch (error) {
      console.error("Error saving spell attempt:", error);
    }
  };

  const renderSection = (subject, level, spells, subjectColor) => {
    const isExpanded = expandedSections[`${subject}-${level}`];
    const levelColor = generateLevelColor(subjectColor, level);
    const masteredCount = spells.filter(
      (spell) => getSuccessfulAttempts(spell) >= 2
    ).length;
    const progressPercentage = (masteredCount / spells.length) * 100;

    const renderSpellRow = (spell, index, subject) => {
      const attempts = spellAttempts[spell] || {};
      const successCount = getSuccessfulAttempts(spell);
      const hasCriticalSuccess = criticalSuccesses[spell] || false;
      const isMastered = successCount >= 2;
      const isSpecial = spell.includes("*");
      const isAttempting = attemptingSpells[spell];
      const hasAttempts = Object.keys(attempts).length > 0 || successCount > 0;
      const spellDescription = getSpellDescription(spell);
      const formattedDescription = spellDescription
        ? formatSpellDescription(spellDescription)
        : null;

      return (
        <tr
          key={spell}
          style={{
            ...styles.tableRow,
            ...(isMastered ? styles.tableRowMastered : {}),
            ...(hasAttempts && !isMastered
              ? { backgroundColor: "#f8fafc" }
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
                ? "#f8fafc"
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
                  {spell}
                </span>
                {isSpecial && (
                  <Star
                    size={16}
                    color="#eab308"
                    title="Special/Advanced Spell"
                  />
                )}
                {/* {formattedDescription && (
                  <button
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    style={{
                      background: "none",
                      border: "1px solid #3b82f6",
                      borderRadius: "4px",
                      color: "#3b82f6",
                      padding: "2px 6px",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                    }}
                    title="View spell description"
                  >
                    <BookOpen size={12} />
                    {isDescriptionExpanded ? "Hide" : "Info"}
                  </button>
                )} */}
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

              {/* Spell Description
              {isDescriptionExpanded && formattedDescription && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "12px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "13px",
                    lineHeight: "1.4",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#1e40af",
                      marginBottom: "4px",
                    }}
                  >
                    {formattedDescription.name}
                  </div>
                  {formattedDescription.subtitle && (
                    <div
                      style={{
                        fontStyle: "italic",
                        color: "#6b7280",
                        marginBottom: "8px",
                      }}
                    >
                      {formattedDescription.subtitle}
                    </div>
                  )}
                  <div style={{ whiteSpace: "pre-line", color: "#374151" }}>
                    {formattedDescription.details}
                  </div>
                </div>
              )} */}
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
