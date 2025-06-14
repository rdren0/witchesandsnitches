import React, { useState, useEffect, useMemo } from "react";
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
  Search,
  Filter,
} from "lucide-react";

import { spellsData } from "./spells";
import { getSpellModifier } from "./utils";
import { useTheme } from "../../contexts/ThemeContext";
import { useRollFunctions } from "../../App/diceRoller";
import { createSpellBookStyles } from "../../styles/masterStyles";

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
  failedAttempts,
  setFailedAttempts,
  researchedSpells,
  setResearchedSpells,
  subjectData,
  subjectName,
  supabase,
  user,
  globalSearchTerm = "",
}) => {
  const { attemptSpell } = useRollFunctions();
  const { theme } = useTheme();
  const styles = createSpellBookStyles(theme);
  const [attemptingSpells, setAttemptingSpells] = useState({});
  const [openMenus, setOpenMenus] = useState({});
  const [editingSpell, setEditingSpell] = useState(null);
  const [editFormData, setEditFormData] = useState({
    successfulAttempts: 0,
    hasCriticalSuccess: false,
    hasFailedAttempt: false,
    researched: false,
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");

  const getSubjectStats = (subject) => {
    const levels = spellsData[subject].levels;
    const totalSpells = Object.values(levels).reduce(
      (total, spells) => total + spells.length,
      0
    );

    const allSpells = Object.values(levels).flat();

    const masteredSpells = allSpells.filter((spellObj) => {
      const spellName = spellObj.name;
      const attempts = spellAttempts?.[spellName] ?? {};
      return Object.values(attempts).filter(Boolean).length >= 2;
    }).length;

    const attemptedSpells = allSpells.filter((spellObj) => {
      const spellName = spellObj.name;
      const attempts = spellAttempts[spellName] || {};
      return (
        Object.keys(attempts).length > 0 ||
        Object.values(attempts).filter(Boolean).length > 0
      );
    }).length;

    const failedSpells = allSpells.filter((spellObj) => {
      const spellName = spellObj.name;
      return failedAttempts[spellName] || false;
    }).length;

    const researchedSpellsCount = allSpells.filter((spellObj) => {
      const spellName = spellObj.name;
      return researchedSpells[spellName] || false;
    }).length;

    return {
      totalSpells,
      masteredSpells,
      attemptedSpells,
      failedSpells,
      researchedSpells: researchedSpellsCount,
    };
  };

  const getAllSpells = () => {
    const allSpells = [];
    Object.entries(subjectData.levels).forEach(([level, spells]) => {
      spells.forEach((spell, index) => {
        allSpells.push({
          ...spell,
          level,
          originalIndex: index,
        });
      });
    });
    return allSpells;
  };

  const activeSearchTerm = searchTerm || globalSearchTerm;

  const getFilteredSpells = () => {
    let spells = getAllSpells();

    if (activeSearchTerm && activeSearchTerm.trim().length > 0) {
      const term = activeSearchTerm.toLowerCase();
      spells = spells.filter((spell) => {
        return (
          spell.name.toLowerCase().includes(term) ||
          (spell.description &&
            spell.description.toLowerCase().includes(term)) ||
          spell.level.toLowerCase().includes(term) ||
          (spell.tags &&
            spell.tags.some((tag) => tag.toLowerCase().includes(term)))
        );
      });
    }

    if (searchFilter !== "all") {
      spells = spells.filter((spellObj) => {
        const spellName = spellObj.name;
        const attempts = spellAttempts[spellName] || {};
        const successCount = Object.values(attempts).filter(Boolean).length;
        const isMastered = successCount >= 2;
        const hasAttempts =
          Object.keys(attempts).length > 0 || successCount > 0;
        const hasFailedAttempt = failedAttempts[spellName] || false;
        const isResearched = researchedSpells[spellName] || false;

        switch (searchFilter) {
          case "mastered":
            return isMastered;
          case "attempted":
            return (hasAttempts || hasFailedAttempt) && !isMastered;
          case "failed":
            return hasFailedAttempt && !hasAttempts;
          case "researched":
            return isResearched;
          case "unmastered":
            return !isMastered;
          default:
            return true;
        }
      });
    }

    return spells;
  };

  const filterSpellsByStatus = (spells) => {
    if (searchFilter === "all") return spells;

    return spells.filter((spellObj) => {
      const spellName = spellObj.name;
      const attempts = spellAttempts[spellName] || {};
      const successCount = Object.values(attempts).filter(Boolean).length;
      const isMastered = successCount >= 2;
      const hasAttempts = Object.keys(attempts).length > 0 || successCount > 0;
      const hasFailedAttempt = failedAttempts[spellName] || false;
      const isResearched = researchedSpells[spellName] || false;

      switch (searchFilter) {
        case "mastered":
          return isMastered;
        case "attempted":
          return (hasAttempts || hasFailedAttempt) && !isMastered;
        case "failed":
          return hasFailedAttempt && !hasAttempts;
        case "researched":
          return isResearched;
        case "unmastered":
          return !isMastered;
        default:
          return true;
      }
    });
  };

  const searchResults = getFilteredSpells();
  const hasActiveSearch =
    (activeSearchTerm && activeSearchTerm.trim().length > 0) ||
    searchFilter !== "all";

  const clearSearch = () => {
    setSearchTerm("");
    setSearchFilter("all");
  };

  const Icon = getIcon(subjectData.icon);
  const stats = getSubjectStats(subjectName);
  const isExpanded = expandedSubjects[subjectName];
  const hasStatusFilter = searchFilter !== "all";

  const isDarkTheme = useMemo(() => {
    if (
      theme.background === "#1f2937" ||
      theme.background === "#111827" ||
      theme.background === "#0f172a" ||
      theme.background === "#1e293b"
    ) {
      return true;
    }

    if (theme.background && theme.text) {
      const bgHex = theme.background.replace("#", "");
      const textHex = theme.text.replace("#", "");

      const bgBrightness = parseInt(bgHex, 16);
      const textBrightness = parseInt(textHex, 16);

      return bgBrightness < textBrightness;
    }

    if (
      theme.text === "#f9fafb" ||
      theme.text === "#ffffff" ||
      theme.text === "#e5e7eb" ||
      theme.text === "#d1d5db"
    ) {
      return true;
    }

    return false;
  }, [theme.background, theme.text]);

  const SPELL_LEVEL_PALETTE = {
    Cantrips: {
      primary: isDarkTheme ? "#e5e7eb" : "#6b7280",
      background: isDarkTheme
        ? "linear-gradient(135deg, #374151 0%, #404756 100%)"
        : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      borderColor: isDarkTheme ? "#6b7280" : "#cbd5e1",
    },
    "1st Level": {
      primary: isDarkTheme ? "#e5e7eb" : "#059669",
      background: isDarkTheme
        ? "linear-gradient(135deg, #374151 0%, #3a4f47 100%)"
        : "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
      borderColor: isDarkTheme ? "#6b7280" : "#a7f3d0",
    },
    "2nd Level": {
      primary: isDarkTheme ? "#e5e7eb" : "#2563eb",
      background: isDarkTheme
        ? "linear-gradient(135deg, #374151 0%, #394856 100%)"
        : "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      borderColor: isDarkTheme ? "#6b7280" : "#93c5fd",
    },
    "3rd Level": {
      primary: isDarkTheme ? "#e5e7eb" : "#7c3aed",
      background: isDarkTheme
        ? "linear-gradient(135deg, #374151 0%, #3f4356 100%)"
        : "linear-gradient(135deg, #f5f3ff 0%, #e9d5ff 100%)",
      borderColor: isDarkTheme ? "#6b7280" : "#c4b5fd",
    },
    "4th Level": {
      primary: isDarkTheme ? "#e5e7eb" : "#d97706",
      background: isDarkTheme
        ? "linear-gradient(135deg, #374151 0%, #424051 100%)"
        : "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
      borderColor: isDarkTheme ? "#6b7280" : "#fcd34d",
    },
    "5th Level": {
      primary: isDarkTheme ? "#e5e7eb" : "#dc2626",
      background: isDarkTheme
        ? "linear-gradient(135deg, #374151 0%, #423f51 100%)"
        : "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
      borderColor: isDarkTheme ? "#6b7280" : "#fca5a5",
    },
    "6th Level": {
      primary: isDarkTheme ? "#e5e7eb" : "#be185d",
      background: isDarkTheme
        ? "linear-gradient(135deg, #374151 0%, #423f54 100%)"
        : "linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%)",
      borderColor: isDarkTheme ? "#6b7280" : "#f9a8d4",
    },
    "7th Level": {
      primary: isDarkTheme ? "#e5e7eb" : "#0891b2",
      background: isDarkTheme
        ? "linear-gradient(135deg, #374151 0%, #374854 100%)"
        : "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
      borderColor: isDarkTheme ? "#6b7280" : "#67e8f9",
    },
    "8th Level": {
      primary: isDarkTheme ? "#e5e7eb" : "#65a30d",
      background: isDarkTheme
        ? "linear-gradient(135deg, #374151 0%, #3c4651 100%)"
        : "linear-gradient(135deg, #f7fee7 0%, #d9f99d 100%)",
      borderColor: isDarkTheme ? "#6b7280" : "#bef264",
    },
    "9th Level": {
      primary: isDarkTheme ? "#e5e7eb" : "#9333ea",
      background: isDarkTheme
        ? "linear-gradient(135deg, #374151 0%, #3e4156 100%)"
        : "linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%)",
      borderColor: isDarkTheme ? "#6b7280" : "#d8b4fe",
    },
  };

  const generateLevelColor = (level) => {
    const paletteColor = SPELL_LEVEL_PALETTE[level];
    if (paletteColor) {
      return {
        background: paletteColor.background,
        borderColor: paletteColor.borderColor,
        color: paletteColor.primary,
      };
    }

    return {
      background: isDarkTheme
        ? `linear-gradient(135deg, ${subjectData.color}20 0%, ${subjectData.color}30 100%)`
        : `linear-gradient(135deg, ${subjectData.color}10 0%, ${subjectData.color}20 100%)`,
      borderColor: isDarkTheme
        ? subjectData.color + "40"
        : subjectData.color + "30",
      color: subjectData.color,
    };
  };

  const getSuccessfulAttempts = (spellName) => {
    const attempts = spellAttempts[spellName] || {};
    return Object.values(attempts).filter(Boolean).length;
  };

  const highlightSearchTerm = (text) => {
    if (!activeSearchTerm || !text) return text;

    const regex = new RegExp(`(${activeSearchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={styles.searchHighlight}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const startEditing = (spellName) => {
    const attempts = spellAttempts[spellName] || {};
    const successCount = Object.values(attempts).filter(Boolean).length;
    const hasCritical = criticalSuccesses[spellName] || false;
    const hasFailed = failedAttempts[spellName] || false;
    const isResearched = researchedSpells[spellName] || false;

    setEditFormData({
      successfulAttempts: successCount,
      hasCriticalSuccess: hasCritical,
      hasFailedAttempt: hasFailed,
      researched: isResearched,
    });
    setEditingSpell(spellName);
    closeAllMenus();
  };

  const findSpellData = (spellName) => {
    // eslint-disable-next-line
    for (const [level, spells] of Object.entries(subjectData.levels)) {
      const spell = spells.find((s) => s.name === spellName);
      if (spell) return spell;
    }
    return null;
  };

  const calculateResearchDC = (playerYear, spellYear, spellName) => {
    let baseDC = 8 + 2 * playerYear;

    const yearDifference = spellYear - playerYear;
    if (yearDifference > 0) {
      baseDC += 2 * playerYear;
    } else if (yearDifference < 0) {
      baseDC += yearDifference * 2;
    }

    const difficultSpells = [
      "Abscondi",
      "Pellucidi Pellis",
      "Sagittario",
      "Confringo",
      "Devieto",
      "Stupefy",
      "Petrificus Totalus",
      "Protego",
      "Protego Maxima",
      "Finite Incantatem",
      "Bombarda",
      "Episkey",
      "Expelliarmus",
      "Incarcerous",
    ];

    if (difficultSpells.includes(spellName)) {
      baseDC += 3;
    }

    return Math.max(5, baseDC);
  };

  const markSpellAsResearched = async (spellName) => {
    if (!selectedCharacter || !discordUserId) return;

    const spellData = findSpellData(spellName);
    if (!spellData) {
      setError("Could not find spell data for research check");
      return;
    }

    const playerYear = selectedCharacter.year || 1;
    const spellYear = spellData.year || 1;

    const dc = calculateResearchDC(playerYear, spellYear, spellName);

    const confirmMessage = `Research ${spellName}?\n\nPlayer Year: ${playerYear}\nSpell Year: ${spellYear}\nDC: ${dc}\n\nSuccess: Mark as researched\nNat 20: Mark as researched + 1 successful attempt`;

    // eslint-disable-next-line no-restricted-globals
    if (!confirm(confirmMessage)) return;

    setAttemptingSpells((prev) => ({ ...prev, [spellName]: true }));

    try {
      const modifier = getSpellModifier(
        spellName,
        subjectName,
        selectedCharacter
      );

      const d20Roll = Math.floor(Math.random() * 20) + 1;
      const totalRoll = d20Roll + modifier;
      const isNaturalTwenty = d20Roll === 20;
      const isSuccess = totalRoll >= dc;

      const rollMessage = `Research Check: ${d20Roll}${
        modifier >= 0 ? "+" : ""
      }${modifier} = ${totalRoll} vs DC ${dc}`;

      if (isSuccess) {
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

        const updateData = {
          researched: true,
          updated_at: new Date().toISOString(),
        };

        if (isNaturalTwenty) {
          const currentAttempts = existingProgress?.successful_attempts || 0;
          updateData.successful_attempts = Math.min(currentAttempts + 1, 2);
        }

        if (existingProgress) {
          const { error: updateError } = await supabase
            .from("spell_progress_summary")
            .update(updateData)
            .eq("id", existingProgress.id);

          if (updateError) {
            console.error("Error updating spell research:", updateError);
            return;
          }
        } else {
          const insertData = {
            character_id: selectedCharacter.id,
            discord_user_id: discordUserId,
            spell_name: spellName,
            successful_attempts: isNaturalTwenty ? 1 : 0,
            has_natural_twenty: false,
            has_failed_attempt: false,
            researched: true,
          };

          const { error: insertError } = await supabase
            .from("spell_progress_summary")
            .insert([insertData]);

          if (insertError) {
            console.error("Error inserting spell research:", insertError);
            return;
          }
        }

        const successMessage = isNaturalTwenty
          ? `🎯 EXCELLENT RESEARCH! (Nat 20)\n${rollMessage}\n\nYou gained deep understanding of ${spellName} and earned 1 successful attempt!`
          : `✅ Research Successful!\n${rollMessage}\n\nYou learned about ${spellName} and marked it as researched.`;

        // eslint-disable-next-line no-restricted-globals
        alert(successMessage);
      } else {
        const failMessage = `❌ Research Failed\n${rollMessage}\n\n${spellName} proved too difficult to understand at this time.`;
        // eslint-disable-next-line no-restricted-globals
        alert(failMessage);
      }

      await loadSpellProgress();
    } catch (error) {
      console.error("Error during research attempt:", error);
      setError("Error occurred during research attempt");
    } finally {
      setAttemptingSpells((prev) => ({ ...prev, [spellName]: false }));
    }
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
    setEditFormData({
      successfulAttempts: 0,
      hasCriticalSuccess: false,
      hasFailedAttempt: false,
      researched: false,
    });
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
        has_failed_attempt: editFormData.hasFailedAttempt,
        researched: editFormData.researched,
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

      await loadSpellProgress();
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

  const updateSpellProgressSummary = async (
    spellName,
    isSuccess,
    isNaturalTwenty = false
  ) => {
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

      let updateData = {
        updated_at: new Date().toISOString(),
      };

      if (existingProgress) {
        if (existingProgress.has_natural_twenty) {
          return;
        }

        if (isSuccess) {
          if (isNaturalTwenty) {
            updateData.successful_attempts = 2;
            updateData.has_natural_twenty = true;
          } else {
            updateData.successful_attempts = Math.min(
              existingProgress.successful_attempts + 1,
              2
            );
          }
        } else {
          updateData.has_failed_attempt = true;
        }

        const { error: updateError } = await supabase
          .from("spell_progress_summary")
          .update(updateData)
          .eq("id", existingProgress.id);

        if (updateError) {
          console.error("Error updating spell progress:", updateError);
        }
      } else {
        const insertData = {
          character_id: selectedCharacter.id,
          discord_user_id: discordUserId,
          spell_name: spellName,
          successful_attempts: isSuccess ? (isNaturalTwenty ? 2 : 1) : 0,
          has_natural_twenty: isNaturalTwenty,
          has_failed_attempt: !isSuccess,
          researched: false,
        };

        const { error: insertError } = await supabase
          .from("spell_progress_summary")
          .insert([insertData]);

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
      const formattedFailures = {};
      const formattedResearch = {};

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

        if (progress.has_failed_attempt) {
          formattedFailures[progress.spell_name] = true;
        }
        if (progress.researched) {
          formattedResearch[progress.spell_name] = true;
        }
      });

      setSpellAttempts(formattedAttempts);
      setCriticalSuccesses(formattedCriticals);
      setFailedAttempts(formattedFailures);
      setResearchedSpells(formattedResearch);
    } catch (error) {
      console.error("Error loading spell progress:", error);
      setError(`Failed to load spell progress: ${error.message}`);
    }
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <div style={styles.noResultsContainer}>
          <Search size={48} style={styles.noResultsIcon} />
          <p style={styles.noResultsTitle}>No spells found</p>
          <p style={styles.noResultsMessage}>
            No spells found matching your search criteria.
          </p>
          <button onClick={clearSearch} style={styles.clearSearchButton}>
            Clear Search
          </button>
        </div>
      );
    }

    return (
      <div style={styles.searchResultsContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={{ ...styles.tableHeaderCell, width: "3rem" }}>#</th>
              <th style={styles.tableHeaderCell}>Spell Name</th>
              <th style={styles.tableHeaderCell}>Successful Attempts</th>
              <th style={styles.tableHeaderCellCenter}>Critical</th>
              <th style={styles.tableHeaderCellCenter}>Attempt</th>
              <th style={styles.tableHeaderCellCenter}>Research</th>
              <th style={{ ...styles.tableHeaderCellCenter, width: "3rem" }}>
                Menu
              </th>
            </tr>
          </thead>
          <tbody>
            {searchResults
              .map((spellObj, index) =>
                renderSpellRow(spellObj, index, subjectName, true)
              )
              .flat()}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSpellRow = (spellObj, index, subject, showLevel = false) => {
    const spellName = spellObj.name;
    const attempts = spellAttempts[spellName] || {};
    const successCount = getSuccessfulAttempts(spellName);
    const hasCriticalSuccess = criticalSuccesses[spellName] || false;
    const hasFailedAttempt = failedAttempts[spellName] || false;
    const isResearched = researchedSpells[spellName] || false;
    const isMastered = successCount >= 2;
    const isRestricted = spellObj.restriction || false;
    const isAttempting = attemptingSpells[spellName];
    const hasAttempts = Object.keys(attempts).length > 0 || successCount > 0;
    const isDescriptionExpanded = expandedDescriptions[spellName];

    let rowStyle = { ...styles.tableRow };
    if (isMastered) {
      rowStyle = { ...rowStyle, ...styles.tableRowMastered };
    } else if (isResearched) {
      rowStyle = {
        ...rowStyle,
        backgroundColor: (theme.warning || "#f59e0b") + "10",
      };
    } else if (hasAttempts) {
      rowStyle = {
        ...rowStyle,
        backgroundColor: (theme.success || "#10b981") + "05",
      };
    } else if (hasFailedAttempt) {
      rowStyle = {
        ...rowStyle,
        backgroundColor: (theme.error || "#ef4444") + "05",
      };
    }

    const mainRow = (
      <tr key={spellName} style={rowStyle}>
        <td style={{ ...styles.tableCell, width: "3rem" }}>{index + 1}</td>
        <td style={styles.tableCell}>
          <div style={styles.spellNameContainer}>
            <div style={styles.spellNameRow}>
              <span
                style={isMastered ? styles.spellNameMastered : styles.spellName}
              >
                {highlightSearchTerm(spellName)}
              </span>
              {showLevel && (
                <span style={styles.levelBadge}>{spellObj.level}</span>
              )}
              {isRestricted && (
                <Star
                  size={16}
                  color={theme.warning || "#eab308"}
                  title="Restricted/Advanced Spell"
                />
              )}
              {spellObj.description && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDescription(spellName);
                  }}
                  style={styles.descriptionToggleButton}
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

            <div
              style={{
                display: "flex",
                gap: "4px",
                flexWrap: "wrap",
                marginTop: "4px",
              }}
            >
              {hasCriticalSuccess && (
                <span style={styles.criticalMasteredBadge}>
                  Critically Mastered
                </span>
              )}
              {isMastered && !hasCriticalSuccess && (
                <span style={styles.masteredBadge}>Mastered</span>
              )}
              {!isMastered && (hasAttempts || hasFailedAttempt) && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    backgroundColor: hasAttempts
                      ? theme.success || "#10b981"
                      : theme.error || "#ef4444",
                    color: "white",
                  }}
                >
                  Attempted
                </span>
              )}
              {isResearched && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    backgroundColor: theme.warning || "#f59e0b",
                    color: "white",
                  }}
                >
                  Researched
                </span>
              )}
            </div>
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
                style={styles.checkboxFirst}
              />
              <span style={styles.checkboxText}>1st</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={Boolean(attempts[2])}
                disabled={true}
                readOnly={true}
                style={styles.checkboxSecond}
              />
              <span style={styles.checkboxText}>2nd</span>
            </label>
          </div>
        </td>
        <td style={{ ...styles.tableCell, textAlign: "center" }}>
          {hasCriticalSuccess ? (
            <div style={styles.criticalSuccessContainer}>
              <Star
                size={20}
                color={theme.warning || "#ffd700"}
                fill={theme.warning || "#ffd700"}
                title="Critical Success - Mastered with Natural 20!"
              />
              <span style={styles.criticalSuccessText}>20</span>
            </div>
          ) : (
            <span style={styles.noCriticalText}>-</span>
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
          >
            <Dice6 size={14} />
            {isAttempting ? "Rolling..." : "Attempt"}
          </button>
        </td>
        <td style={{ ...styles.tableCell, textAlign: "center" }}>
          <button
            onClick={() => markSpellAsResearched(spellName)}
            disabled={
              isMastered ||
              !selectedCharacter ||
              attemptingSpells[spellName] ||
              !findSpellData(spellName).year
            }
            style={{
              backgroundColor: theme.warning || "#f59e0b",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
              ...(isMastered ||
              !selectedCharacter ||
              attemptingSpells[spellName] ||
              !findSpellData(spellName).year
                ? {
                    backgroundColor: theme.textSecondary,
                    cursor: "not-allowed",
                  }
                : {}),
            }}
            title={`Research ${spellName} (History of Magic Check)`}
          >
            <BookOpen size={14} />
            {attemptingSpells[spellName] ? "Rolling..." : "Research"}
          </button>
        </td>
        <td style={styles.tableCellMenu}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu(spellName);
            }}
            style={styles.menuButton}
          >
            <MoreVertical size={16} />
          </button>

          {openMenus[spellName] && (
            <div style={styles.dropdownMenu}>
              <button
                onClick={() => startEditing(spellName)}
                style={styles.dropdownMenuItem}
              >
                <Edit3 size={14} />
                Edit Progress
              </button>
            </div>
          )}

          {editingSpell === spellName && (
            <div style={styles.modalOverlay} onClick={cancelEditing}>
              <div
                style={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={styles.modalTitle}>Edit Progress: {spellName}</h3>
                <p style={styles.modalSubtitle}>
                  Current:{" "}
                  {
                    Object.values(spellAttempts[spellName] || {}).filter(
                      Boolean
                    ).length
                  }{" "}
                  successful attempts
                  {criticalSuccesses[spellName] ? " (Critical Success)" : ""}
                  {failedAttempts[spellName] ? " (Has Failed)" : ""}
                  {researchedSpells[spellName] ? " (Researched)" : ""}
                </p>

                <div style={styles.modalField}>
                  <label style={styles.modalLabel}>
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
                      ...styles.modalInput,
                      ...(editFormData.hasCriticalSuccess
                        ? styles.modalInputDisabled
                        : {}),
                    }}
                  />
                  {editFormData.hasCriticalSuccess && (
                    <p style={styles.modalHelpText}>
                      Automatically set to 2 due to critical success
                    </p>
                  )}
                </div>

                <div style={styles.modalField}>
                  <label style={styles.modalCheckboxLabel}>
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
                      style={styles.modalCheckbox}
                    />
                    <span style={styles.modalCheckboxText}>
                      Critical Success (Natural 20)
                    </span>
                  </label>
                  <p style={styles.modalHelpText}>
                    Checking this will automatically set successful attempts to
                    2 (mastery)
                  </p>
                </div>

                <div style={styles.modalField}>
                  <label style={styles.modalCheckboxLabel}>
                    <input
                      type="checkbox"
                      checked={editFormData.hasFailedAttempt}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          hasFailedAttempt: e.target.checked,
                        }))
                      }
                      style={styles.modalCheckbox}
                    />
                    <span style={styles.modalCheckboxText}>
                      Has Failed Attempt
                    </span>
                  </label>
                  <p style={styles.modalHelpText}>
                    Mark if this spell has been attempted unsuccessfully
                  </p>
                </div>

                <div style={styles.modalField}>
                  <label style={styles.modalCheckboxLabel}>
                    <input
                      type="checkbox"
                      checked={editFormData.researched}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          researched: e.target.checked,
                        }))
                      }
                      style={styles.modalCheckbox}
                    />
                    <span style={styles.modalCheckboxText}>Researched</span>
                  </label>
                  <p style={styles.modalHelpText}>
                    Mark if this spell has been researched (alternative to
                    attempting)
                  </p>
                </div>

                <div style={styles.modalActions}>
                  <button
                    onClick={cancelEditing}
                    style={styles.modalCancelButton}
                  >
                    <X size={14} />
                    Cancel
                  </button>
                  <button onClick={saveEdit} style={styles.modalSaveButton}>
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
          <td colSpan="7" style={styles.descriptionRowCell}>
            <div style={styles.descriptionContainer}>
              <div style={styles.descriptionTitle}>{spellName}</div>
              <div style={styles.descriptionMeta}>
                {spellObj.level} •{" "}
                {spellObj.castingTime || "Unknown casting time"} • Range:{" "}
                {spellObj.range || "Unknown"} • Duration:{" "}
                {spellObj.duration || "Unknown"}
              </div>
              <div style={styles.descriptionText}>
                {highlightSearchTerm(spellObj.description)}
              </div>
              {spellObj.higherLevels && (
                <div style={styles.descriptionHigherLevels}>
                  <strong>At Higher Levels:</strong> {spellObj.higherLevels}
                </div>
              )}
              {spellObj.tags && spellObj.tags.length > 0 && (
                <div style={styles.descriptionTags}>
                  {spellObj.tags.map((tag) => (
                    <span key={tag} style={styles.descriptionTag}>
                      {highlightSearchTerm(tag)}
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

  const renderSection = (subject, level, spells) => {
    const filteredSpells = filterSpellsByStatus(spells);
    const isExpanded = expandedSections[`${subject}-${level}`];
    const levelColor = generateLevelColor(level);
    const masteredCount = filteredSpells.filter(
      (spellObj) => getSuccessfulAttempts(spellObj.name) >= 2
    ).length;
    const progressPercentage =
      filteredSpells.length > 0
        ? (masteredCount / filteredSpells.length) * 100
        : 0;

    if (filteredSpells.length === 0 && hasStatusFilter) {
      return null;
    }

    return (
      <div key={level} style={styles.sectionContainer}>
        <button
          onClick={() => toggleSection(subject, level)}
          style={{
            ...styles.sectionButton,
            background: levelColor.background,
            borderColor: levelColor.borderColor,
            color: levelColor.color,
          }}
        >
          <div style={styles.sectionLeft}>
            {isExpanded ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
            <span>
              {level} ({filteredSpells.length} spells
              {hasStatusFilter && filteredSpells.length !== spells.length
                ? ` of ${spells.length}`
                : ""}
              )
            </span>
          </div>
          <div style={styles.sectionRight}>
            <span style={styles.sectionProgressText}>
              {masteredCount}/{filteredSpells.length} Mastered
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
                <th style={styles.tableHeaderCellCenter}>Attempt</th>
                <th style={styles.tableHeaderCellCenter}>Research</th>
                <th style={{ ...styles.tableHeaderCellCenter, width: "3rem" }}>
                  Menu
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSpells
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
            <span
              style={{
                ...styles.subjectStatNumber,
                color: theme.success || "#10b981",
              }}
            >
              {stats.masteredSpells}
            </span>
            <span style={styles.subjectStatLabel}>Mastered</span>
          </div>
          <div style={styles.subjectStatItem}>
            <span
              style={{
                ...styles.subjectStatNumber,
                color: theme.warning || "#f59e0b",
              }}
            >
              {stats.researchedSpells}
            </span>
            <span style={styles.subjectStatLabel}>Researched</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div style={styles.subjectContent}>
          <div style={styles.searchSection}>
            <div style={styles.searchControls}>
              <div style={styles.searchInputContainer}>
                <Search size={18} style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search spells by name, description, level, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    style={styles.searchClearButton}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div style={styles.filterControls}>
                <Filter size={16} style={styles.filterIcon} />
                <select
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">All Spells</option>
                  <option value="mastered">Mastered</option>
                  <option value="attempted">Attempted</option>
                  <option value="failed">Failed Only</option>
                  <option value="researched">Researched</option>
                  <option value="unmastered">Not Mastered</option>
                </select>
              </div>
            </div>

            {hasActiveSearch && (
              <div style={styles.searchResultsInfo}>
                <span style={styles.searchResultsText}>
                  {searchResults?.length || 0} spell(s) found
                </span>
                <button onClick={clearSearch} style={styles.clearSearchButton}>
                  <X size={12} />
                  Clear
                </button>
              </div>
            )}
          </div>

          {hasActiveSearch
            ? renderSearchResults()
            : Object.entries(subjectData.levels)
                .filter(([level, spells]) => spells.length > 0)
                .map(([level, spells]) =>
                  renderSection(subjectName, level, spells)
                )
                .filter(Boolean)}
        </div>
      )}
    </div>
  );
};
