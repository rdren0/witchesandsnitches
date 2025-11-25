import { useState } from "react";
import React from "react";
import {
  ChevronDown,
  ChevronUp,
  Circle,
  Star,
  Wrench,
  Info,
  ChefHat,
  Zap,
  Telescope,
  Wind,
  Hammer,
  Palette,
  Book,
  Scroll,
  Gem,
  Beaker,
  Microscope,
  Bubbles,
  Skull,
  Compass,
  VenetianMask,
  Sprout,
  Key,
  Piano,
  Eye,
} from "lucide-react";
import {
  calculatePassivePerception,
  calculatePassiveInvestigation,
  calculatePassiveDeception,
  formatModifier,
  modifiers,
} from "../utils";
import { MagicalTheoryModal } from "./MagicalTheoryModal";
import { useRollFunctions } from "../../utils/diceRoller";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  allSkills,
  skillMap,
  skillDescriptions,
  abilities,
  getAbilityAbbr,
} from "../../../SharedData";
import { backgroundsData } from "../../../SharedData/backgroundsData";
import { subclassesData } from "../../../SharedData/subclassesData";
import { useFeats } from "../../../hooks/useFeats";

export const Skills = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  selectedCharacterId,
}) => {
  const { rollSkill, rollMagicalTheoryCheck } = useRollFunctions();
  const { theme } = useTheme();
  const { feats: standardFeats } = useFeats();
  const [sortColumn, setSortColumn] = useState("skill");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isRolling, setIsRolling] = useState(false);
  const [showMagicalTheoryModal, setShowMagicalTheoryModal] = useState(false);
  const [pendingMagicalTheoryData, setPendingMagicalTheoryData] =
    useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [showToolModal, setShowToolModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedAbility, setSelectedAbility] = useState("strength");

  const passivePerception = calculatePassivePerception(character);
  const passiveInvestigation = calculatePassiveInvestigation(character);
  const passiveDeception = calculatePassiveDeception(character);

  const skillStyles = {
    container: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    header: {
      padding: "20px 24px",
      borderBottom: `2px solid ${theme.border}`,
      backgroundColor: theme.background,
      borderRadius: "12px 12px 0 0",
    },
    title: {
      fontSize: "18px",
      fontWeight: "700",
      color: theme.text,
      margin: 0,
      letterSpacing: "0.5px",
      textTransform: "uppercase",
    },
    instructions: {
      marginTop: "8px",
      fontSize: "13px",
      color: theme.textSecondary,
      fontStyle: "italic",
    },
    contentContainer: {
      padding: "20px",
    },
    tableContainer: {
      backgroundColor: theme.surface,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
      overflow: "hidden",
      maxWidth: "100%",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
      tableLayout: "fixed",
    },
    headerRow: {
      backgroundColor: theme.background,
    },
    headerCell: {
      padding: "12px 16px",
      fontSize: "12px",
      fontWeight: "600",
      color: theme.textSecondary,
      textAlign: "left",
      borderBottom: `2px solid ${theme.border}`,
      cursor: "pointer",
      userSelect: "none",
      letterSpacing: "0.5px",
    },
    sortableHeader: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    row: {
      backgroundColor: theme.surface,
      transition: "background-color 0.15s ease",
    },
    rowHover: {
      backgroundColor: theme.hover || `${theme.primary}05`,
    },
    cell: {
      padding: "8px 16px",
      fontSize: "14px",
      color: theme.text,
      borderBottom: `1px solid ${theme.border}`,
      position: "relative",
      overflow: "visible",
    },
    proficiencyButton: {
      background: "none",
      border: "none",
      padding: "4px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "4px",
      transition: "background-color 0.15s ease",
    },
    skillButton: {
      background: "none",
      border: "none",
      padding: "4px 8px",
      fontSize: "14px",
      color: theme.text,
      cursor: "pointer",
      textAlign: "left",
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      borderRadius: "4px",
      position: "relative",
    },
    skillButtonHover: {
      backgroundColor: `${theme.primary}10`,
      color: theme.primary,
      textDecoration: "underline",
      transform: "translateX(2px)",
    },
    diceIcon: {
      opacity: 0,
      transition: "opacity 0.2s ease",
      marginLeft: "auto",
    },
    diceIconVisible: {
      opacity: 0.6,
    },
    tooltip: {
      position: "absolute",
      left: "0",
      bottom: "100%",
      transform: "translateX(-25%)",
      marginBottom: "8px",
      padding: "8px 12px",
      backgroundColor: theme.background,
      color: theme.text,
      borderRadius: "6px",
      fontSize: "12px",
      whiteSpace: "nowrap",
      maxWidth: "300px",
      minWidth: "150px",
      zIndex: 999999,
      pointerEvents: "none",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: `1px solid ${theme.border}`,
    },
    tooltipContent: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    tooltipTitle: {
      fontWeight: "600",
      color: theme.warning,
      fontSize: "13px",
    },
    tooltipDescription: {
      whiteSpace: "normal",
      lineHeight: "1.4",
    },
    bonusValue: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.text,
    },
    passiveValue: {
      fontSize: "12px",
      color: theme.success,
      fontWeight: "500",
      marginLeft: "8px",
    },
    legend: {
      marginTop: "20px",
      padding: "16px",
      backgroundColor: theme.background,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
    },
    legendItems: {
      display: "flex",
      gap: "24px",
      flexWrap: "nowrap",
      margin: "8px 0",
      padding: "6px 0",
      justifyContent: "center",
      alignItems: "center",
    },
    legendItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "13px",
      color: theme.textSecondary,
    },
    magicalTheoryNote: {
      margin: "8px 0",
      padding: "6px 16px",
      borderTop: `1px solid ${theme.border}`,
      fontSize: "12px",
      color: theme.warning || "#f59e0b",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    rollHint: {
      marginTop: "8px",
      padding: "8px 12px",
      backgroundColor: `${theme.primary}10`,
      borderRadius: "6px",
      fontSize: "12px",
      color: theme.primary,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      border: `1px solid ${theme.primary}30`,
    },
  };

  const calculateSkillBonus = (skillName, abilityMod) => {
    if (!character) return 0;
    const skillLevel = character.skills?.[skillName] || 0;
    const profBonus = character.proficiencyBonus || 0;

    if (skillLevel === 0) return abilityMod;
    if (skillLevel === 1) return abilityMod + profBonus;
    if (skillLevel === 2) return abilityMod + 2 * profBonus;

    return abilityMod;
  };

  const skillsToDbFormat = (skillsObject) => {
    const proficientSkills = [];
    const expertiseSkills = [];

    Object.entries(skillsObject).forEach(([skillKey, level]) => {
      if (skillMap[skillKey]) {
        if (level === 1) {
          proficientSkills.push(skillMap[skillKey]);
        } else if (level === 2) {
          expertiseSkills.push(skillMap[skillKey]);
        }
      }
    });

    return { proficientSkills, expertiseSkills };
  };

  const toggleSkillProficiency = async (skillName) => {
    if (!character || !selectedCharacterId) return;

    const currentLevel = character.skills?.[skillName] || 0;
    const newLevel = (currentLevel + 1) % 3;

    const updatedSkills = {
      ...character.skills,
      [skillName]: newLevel,
    };

    setCharacter((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));

    try {
      const { proficientSkills, expertiseSkills } =
        skillsToDbFormat(updatedSkills);

      const { error } = await supabase
        .from("characters")
        .update({
          skill_proficiencies: proficientSkills,
          skill_expertise: expertiseSkills,
        })
        .eq("id", selectedCharacterId)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error updating skill proficiency:", error);

        setCharacter((prev) => ({
          ...prev,
          skills: {
            ...prev.skills,
            [skillName]: currentLevel,
          },
        }));

        alert("Failed to update skill proficiency. Please try again.");
      }
    } catch (err) {
      console.error("Error updating skill proficiency:", err);

      setCharacter((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          [skillName]: currentLevel,
        },
      }));

      alert("Failed to update skill proficiency. Please try again.");
    }
  };

  const handleSkillRoll = async (skill, abilityMod) => {
    if (
      skill.name === "magicalTheory" ||
      skill.displayName === "Magical Theory"
    ) {
      setPendingMagicalTheoryData({ skill, abilityMod });
      setShowMagicalTheoryModal(true);
    } else {
      await rollSkill({
        skill,
        abilityMod,
        isRolling,
        setIsRolling,
        character,
      });
    }
  };

  const handleMagicalTheoryModalConfirm = async (isForSpellDice) => {
    setShowMagicalTheoryModal(false);

    if (isForSpellDice) {
      await rollMagicalTheoryCheck({
        character,
        supabase,
        discordUserId,
        setIsRolling,
        isRolling,
        isForSpellDice: true,
      });
    } else {
      if (pendingMagicalTheoryData) {
        await rollSkill({
          skill: pendingMagicalTheoryData.skill,
          abilityMod: pendingMagicalTheoryData.abilityMod,
          isRolling,
          setIsRolling,
          character,
        });
      }
    }

    setPendingMagicalTheoryData(null);
  };

  const handleMagicalTheoryModalClose = () => {
    setShowMagicalTheoryModal(false);
    setPendingMagicalTheoryData(null);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortSkills = (skills) => {
    return [...skills].sort((a, b) => {
      let aValue, bValue;

      switch (sortColumn) {
        case "proficiency":
          aValue = character.skills?.[a.name] || 0;
          bValue = character.skills?.[b.name] || 0;
          break;
        case "modifier":
          aValue = a.ability;
          bValue = b.ability;
          break;
        case "skill":
          aValue = a.displayName;
          bValue = b.displayName;
          break;
        case "bonus": {
          const aAbilityMod = modifiers(character)[a.ability];
          const bAbilityMod = modifiers(character)[b.ability];
          aValue = calculateSkillBonus(a.name, aAbilityMod);
          bValue = calculateSkillBonus(b.name, bAbilityMod);
          break;
        }
        default:
          aValue = a.displayName;
          bValue = b.displayName;
      }

      if (sortDirection === "asc") {
        if (typeof aValue === "string") {
          return aValue.localeCompare(bValue);
        }
        return aValue - bValue;
      } else {
        if (typeof aValue === "string") {
          return bValue.localeCompare(aValue);
        }
        return bValue - aValue;
      }
    });
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return null;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  };

  const getProficiencyIcon = (skillLevel) => {
    const iconProps = {
      size: 16,
      strokeWidth: 2,
    };

    switch (skillLevel) {
      case 0:
        return (
          <Circle
            {...iconProps}
            fill="none"
            stroke={theme.textSecondary || "#6b7280"}
          />
        );
      case 1:
        return (
          <Circle
            {...iconProps}
            fill={theme.primary || "#3b82f6"}
            stroke={theme.primary || "#3b82f6"}
          />
        );
      case 2:
        return (
          <Star
            {...iconProps}
            fill={theme.warning || "#f59e0b"}
            stroke={theme.warning || "#f59e0b"}
          />
        );
      default:
        return (
          <Circle
            {...iconProps}
            fill="none"
            stroke={theme.textSecondary || "#6b7280"}
          />
        );
    }
  };

  const getProficiencyTooltip = (skillLevel) => {
    switch (skillLevel) {
      case 0:
        return "Not Proficient - Click to add proficiency";
      case 1:
        return "Proficient - Click to add expertise";
      case 2:
        return "Expertise (2x Proficiency) - Click to remove";
      default:
        return "Click to toggle proficiency";
    }
  };

  const getSkillTooltip = (skill) => {
    return {
      title: `${skill.displayName}`,
      description: skillDescriptions[skill.name] || "Roll this skill check",
    };
  };

  const getToolIcon = (toolName) => {
    const iconProps = {
      size: 14,
      strokeWidth: 2,
    };

    const tool = toolName.toLowerCase();

    if (
      tool.includes("potioneer") ||
      tool.includes("alchemy") ||
      tool.includes("potion")
    ) {
      return <Bubbles {...iconProps} />;
    }

    if (tool.includes("herbologist") || tool.includes("herb")) {
      return <Sprout {...iconProps} />;
    }

    if (tool.includes("poisoner") || tool.includes("poison")) {
      return <Skull {...iconProps} />;
    }

    if (tool.includes("navigator") || tool.includes("navigation")) {
      return <Compass {...iconProps} />;
    }

    if (tool.includes("disguise")) {
      return <VenetianMask {...iconProps} />;
    }

    if (tool.includes("thieves") || tool.includes("thieve")) {
      return <Key {...iconProps} />;
    }

    if (
      tool.includes("musical") ||
      tool.includes("instrument") ||
      tool.includes("music")
    ) {
      return <Piano {...iconProps} />;
    }

    if (tool.includes("divination") || tool.includes("divine")) {
      return <Eye {...iconProps} />;
    }

    if (tool.includes("cook") || tool.includes("utensils")) {
      return <ChefHat {...iconProps} />;
    }

    if (tool.includes("astronomer") || tool.includes("telescope")) {
      return <Telescope {...iconProps} />;
    }

    if (
      tool.includes("broomstick") ||
      tool.includes("vehicle") ||
      tool.includes("broom")
    ) {
      return <Wind {...iconProps} />;
    }

    if (
      tool.includes("wand") ||
      tool.includes("magical") ||
      tool.includes("arcane")
    ) {
      return <Zap {...iconProps} />;
    }

    if (
      tool.includes("book") ||
      tool.includes("study") ||
      tool.includes("research") ||
      tool.includes("library")
    ) {
      return <Book {...iconProps} />;
    }

    if (
      tool.includes("scroll") ||
      tool.includes("scribal") ||
      tool.includes("calligraphy") ||
      tool.includes("writing")
    ) {
      return <Scroll {...iconProps} />;
    }

    if (
      tool.includes("artisan") ||
      tool.includes("craft") ||
      tool.includes("paint") ||
      tool.includes("art")
    ) {
      return <Palette {...iconProps} />;
    }

    if (
      tool.includes("jewel") ||
      tool.includes("gem") ||
      tool.includes("precious")
    ) {
      return <Gem {...iconProps} />;
    }

    if (
      tool.includes("smith") ||
      tool.includes("forge") ||
      tool.includes("metal") ||
      tool.includes("hammer")
    ) {
      return <Hammer {...iconProps} />;
    }

    if (
      tool.includes("microscope") ||
      tool.includes("analysis") ||
      tool.includes("investigation")
    ) {
      return <Microscope {...iconProps} />;
    }

    if (tool.includes("beaker") || tool.includes("alchemy")) {
      return <Beaker {...iconProps} />;
    }

    return <Wrench {...iconProps} />;
  };

  const toolsToDbFormat = (toolsObject) => {
    const proficientTools = [];
    const expertiseTools = [];

    Object.entries(toolsObject).forEach(([toolName, level]) => {
      if (level === 1) {
        proficientTools.push(toolName);
      } else if (level === 2) {
        expertiseTools.push(toolName);
      }
    });

    return { proficientTools, expertiseTools };
  };

  const toggleToolProficiency = async (toolName) => {
    if (!character || !selectedCharacterId) return;

    const currentLevel = character.tools?.[toolName] || 0;
    const newLevel = (currentLevel + 1) % 3;

    const updatedTools = {
      ...character.tools,
      [toolName]: newLevel,
    };

    setCharacter((prev) => ({
      ...prev,
      tools: updatedTools,
    }));

    try {
      const { proficientTools, expertiseTools } = toolsToDbFormat(updatedTools);

      const { error } = await supabase
        .from("characters")
        .update({
          tool_proficiencies: proficientTools,
          tool_expertise: expertiseTools,
        })
        .eq("id", selectedCharacterId)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error updating tool proficiency:", error);

        setCharacter((prev) => ({
          ...prev,
          tools: {
            ...prev.tools,
            [toolName]: currentLevel,
          },
        }));

        alert("Failed to update tool proficiency. Please try again.");
      }
    } catch (err) {
      console.error("Error updating tool proficiency:", err);

      setCharacter((prev) => ({
        ...prev,
        tools: {
          ...prev.tools,
          [toolName]: currentLevel,
        },
      }));

      alert("Failed to update tool proficiency. Please try again.");
    }
  };

  const getAllToolProficiencies = () => {
    const allTools = [];

    const backgroundTools = character.background
      ? Object.values(backgroundsData).find(
          (bg) => bg.name === character.background
        )?.toolProficiencies || []
      : [];

    backgroundTools.forEach((tool) => {
      allTools.push({ name: tool, source: "Background" });
    });

    const characterTools = character.toolProficiencies || [];
    characterTools.forEach((tool) => {
      allTools.push({ name: tool, source: "Character" });
    });

    const characterToolExpertise = character.toolExpertise || [];
    characterToolExpertise.forEach((tool) => {
      allTools.push({ name: tool, source: "Character" });
    });

    if (character.subclass && character.subclassChoices) {
      const subclassInfo = subclassesData[character.subclass];
      if (subclassInfo?.choices) {
        Object.entries(character.subclassChoices).forEach(([level, choice]) => {
          const levelData = subclassInfo.choices[level];
          if (levelData?.options) {
            const selectedOption = levelData.options.find(
              (opt) => opt.name === choice
            );
            if (selectedOption?.benefits?.toolProficiencies) {
              selectedOption.benefits.toolProficiencies.forEach((tool) => {
                allTools.push({ name: tool, source: "Subclass" });
              });
            }
          }
        });
      }
    }

    if (character.standardFeats) {
      character.standardFeats.forEach((featName) => {
        const feat = standardFeats.find((f) => f.name === featName);
        if (feat?.benefits?.toolProficiencies) {
          feat.benefits.toolProficiencies.forEach((tool) => {
            allTools.push({ name: tool, source: "Feat" });
          });
        }
      });
    }

    const uniqueTools = [];
    const seen = new Set();

    allTools.forEach((tool) => {
      if (!seen.has(tool.name)) {
        seen.add(tool.name);
        uniqueTools.push(tool);
      }
    });

    return uniqueTools.sort((a, b) => a.name.localeCompare(b.name));
  };

  const calculateToolBonus = (toolName) => {
    if (!character) return 0;
    const toolLevel = character.tools?.[toolName] || 0;
    const profBonus = character.proficiencyBonus || 0;

    if (toolLevel === 0) return 0;
    if (toolLevel === 1) return profBonus;
    if (toolLevel === 2) return 2 * profBonus;

    return 0;
  };

  const handleToolRoll = async () => {
    if (!selectedTool || !selectedAbility) return;

    const abilityMod = modifiers(character)[selectedAbility];
    const profBonus = character.proficiencyBonus || 0;
    const totalBonus = abilityMod + profBonus;

    const toolSkill = {
      name: selectedTool.toLowerCase().replace(/\s+/g, ""),
      displayName: selectedTool,
      ability: selectedAbility,
    };

    await rollSkill({
      skill: toolSkill,
      abilityMod: totalBonus,
      isRolling,
      setIsRolling,
      character,
    });

    setShowToolModal(false);
  };

  return (
    <>
      <div style={skillStyles.container}>
        <div style={skillStyles.header}>
          <h2 style={skillStyles.title}>Skills & Tool Proficiencies</h2>
        </div>
        <div style={skillStyles.legendItems}>
          <div style={skillStyles.legendItem}>
            <Circle
              size={14}
              fill="none"
              stroke={theme.textSecondary}
              strokeWidth={2}
            />
            <span>Not Proficient</span>
          </div>
          <div style={skillStyles.legendItem}>
            <Circle
              size={14}
              fill={theme.primary || "#3b82f6"}
              stroke={theme.primary || "#3b82f6"}
            />
            <span>Proficient (+{character?.proficiencyBonus || 0})</span>
          </div>
          <div style={skillStyles.legendItem}>
            <Star
              size={14}
              fill={theme.warning || "#f59e0b"}
              stroke={theme.warning || "#f59e0b"}
            />
            <span>Expertise (+{(character?.proficiencyBonus || 0) * 2})</span>
          </div>
        </div>

        <div style={skillStyles.contentContainer}>
          <div style={skillStyles.tableContainer}>
            <table style={skillStyles.table}>
              <thead>
                <tr style={skillStyles.headerRow}>
                  <th
                    style={{ ...skillStyles.headerCell, width: "60px" }}
                    onClick={() => handleSort("proficiency")}
                    title="Click to sort by proficiency level"
                  >
                    <div style={skillStyles.sortableHeader}>
                      PROF
                      {getSortIcon("proficiency")}
                    </div>
                  </th>
                  <th
                    style={{ ...skillStyles.headerCell, width: "70px" }}
                    onClick={() => handleSort("modifier")}
                    title="Click to sort by ability modifier"
                  >
                    <div style={skillStyles.sortableHeader}>
                      MOD
                      {getSortIcon("modifier")}
                    </div>
                  </th>
                  <th
                    style={skillStyles.headerCell}
                    onClick={() => handleSort("skill")}
                    title="Click to sort by skill name"
                  >
                    <div style={skillStyles.sortableHeader}>
                      SKILL (Click to Roll)
                      {getSortIcon("skill")}
                    </div>
                  </th>
                  <th
                    style={{ ...skillStyles.headerCell, width: "90px" }}
                    onClick={() => handleSort("bonus")}
                    title="Click to sort by total bonus"
                  >
                    <div style={skillStyles.sortableHeader}>
                      BONUS
                      {getSortIcon("bonus")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortSkills(allSkills).map((skill) => {
                  const abilityMod = modifiers(character)[skill.ability];
                  const skillBonus = calculateSkillBonus(
                    skill.name,
                    abilityMod
                  );
                  const skillLevel = character.skills?.[skill.name] || 0;
                  const isPerception = skill.name === "perception";
                  const isInvestigation = skill.name === "investigation";
                  const isDeception = skill.name === "deception";
                  const isPassiveSkill =
                    isPerception || isInvestigation || isDeception;
                  const isMagicalTheory =
                    skill.name === "magicalTheory" ||
                    skill.displayName === "Magical Theory";

                  let passiveValue = null;
                  if (isPerception) passiveValue = passivePerception;
                  else if (isInvestigation) passiveValue = passiveInvestigation;
                  else if (isDeception) passiveValue = passiveDeception;

                  const rowStyle = {
                    ...skillStyles.row,
                    ...(isPassiveSkill
                      ? { backgroundColor: `${theme.primary || "#3b82f6"}08` }
                      : {}),
                    ...(isMagicalTheory
                      ? { backgroundColor: `${theme.warning || "#f59e0b"}08` }
                      : {}),
                  };

                  const tooltipInfo = getSkillTooltip(skill, skillBonus);
                  const isHovered = hoveredSkill === skill.name;

                  return (
                    <tr
                      key={skill.name}
                      style={rowStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          theme.hover || `${theme.primary}05`;
                      }}
                      onMouseLeave={(e) => {
                        if (isPassiveSkill) {
                          e.currentTarget.style.backgroundColor = `${
                            theme.primary || "#3b82f6"
                          }08`;
                        } else if (isMagicalTheory) {
                          e.currentTarget.style.backgroundColor = `${
                            theme.warning || "#f59e0b"
                          }08`;
                        } else {
                          e.currentTarget.style.backgroundColor = theme.surface;
                        }
                      }}
                    >
                      <td style={skillStyles.cell}>
                        <button
                          onClick={() => toggleSkillProficiency(skill.name)}
                          title={getProficiencyTooltip(skillLevel)}
                          style={skillStyles.proficiencyButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              theme.hover || `${theme.primary}10`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          {getProficiencyIcon(skillLevel)}
                        </button>
                      </td>
                      <td style={skillStyles.cell}>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: theme.textSecondary,
                          }}
                        >
                          {getAbilityAbbr(skill.ability)}
                        </span>
                      </td>
                      <td style={skillStyles.cell}>
                        <button
                          onClick={() => handleSkillRoll(skill, abilityMod)}
                          disabled={isRolling}
                          onMouseEnter={() => setHoveredSkill(skill.name)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          style={{
                            ...skillStyles.skillButton,
                            ...(skillLevel === 1
                              ? { color: theme.primary, fontWeight: "600" }
                              : {}),
                            ...(skillLevel === 2
                              ? { color: theme.warning, fontWeight: "700" }
                              : {}),
                            ...(isMagicalTheory
                              ? {
                                  color: theme.warning || "#8b5cf6",
                                  fontWeight: "600",
                                }
                              : {}),
                            ...(isRolling
                              ? { opacity: 0.5, cursor: "not-allowed" }
                              : {}),
                          }}
                        >
                          {skill.displayName}
                          {skillLevel === 2 && (
                            <Star
                              size={12}
                              fill={theme.warning || "#f59e0b"}
                              stroke={theme.warning || "#f59e0b"}
                              style={{ marginLeft: "4px" }}
                            />
                          )}
                          {isMagicalTheory && (
                            <div
                              style={{
                                position: "relative",
                                marginLeft: "4px",
                              }}
                            >
                              <Info
                                size={12}
                                color={theme.warning || "#f59e0b"}
                                style={{ cursor: "help" }}
                                onMouseEnter={(e) => {
                                  const tooltip = e.currentTarget.nextSibling;
                                  if (tooltip) tooltip.style.opacity = "1";
                                }}
                                onMouseLeave={(e) => {
                                  const tooltip = e.currentTarget.nextSibling;
                                  if (tooltip) tooltip.style.opacity = "0";
                                }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  left: "0",
                                  top: "100%",
                                  transform: "translateX(-25%)",
                                  marginTop: "8px",
                                  padding: "8px 12px",
                                  backgroundColor: theme.background,
                                  color: theme.text,
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  whiteSpace: "nowrap",
                                  maxWidth: "300px",
                                  minWidth: "150px",
                                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                  border: `1px solid ${theme.border}`,
                                  opacity: "0",
                                  pointerEvents: "none",
                                  transition: "opacity 0.2s ease",
                                  zIndex: 999999,
                                }}
                              >
                                Roll this skill to potentially earn bonus dice
                                (1d4 to 1d10) for spell attempts!
                              </div>
                            </div>
                          )}
                          {passiveValue && (
                            <span style={skillStyles.passiveValue}>
                              (Passive: {passiveValue})
                            </span>
                          )}
                        </button>
                        {isHovered && (
                          <div style={skillStyles.tooltip}>
                            <div style={skillStyles.tooltipContent}>
                              <div style={skillStyles.tooltipTitle}>
                                {tooltipInfo.title}
                              </div>
                              <div style={skillStyles.tooltipDescription}>
                                {tooltipInfo.description}
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td style={skillStyles.cell}>
                        <span
                          style={{
                            ...skillStyles.bonusValue,
                            ...(skillLevel === 1
                              ? { color: theme.primary }
                              : {}),
                            ...(skillLevel === 2
                              ? { color: theme.warning }
                              : {}),
                          }}
                        >
                          {formatModifier(skillBonus)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {(() => {
            const allTools = getAllToolProficiencies();

            return (
              <div style={{ marginTop: "20px" }}>
                <div style={skillStyles.tableContainer}>
                  <table style={skillStyles.table}>
                    <thead>
                      <tr style={skillStyles.headerRow}>
                        <th
                          style={{ ...skillStyles.headerCell, width: "60px" }}
                        >
                          <div style={skillStyles.sortableHeader}>PROF</div>
                        </th>
                        <th
                          style={{ ...skillStyles.headerCell, width: "70px" }}
                        >
                          <div style={skillStyles.sortableHeader}>MOD</div>
                        </th>
                        <th style={skillStyles.headerCell}>
                          <div style={skillStyles.sortableHeader}>
                            TOOL PROFICIENCY
                          </div>
                        </th>
                        <th
                          style={{ ...skillStyles.headerCell, width: "90px" }}
                        >
                          <div style={skillStyles.sortableHeader}>BONUS</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTools.length === 0 ? (
                        <tr style={skillStyles.row}>
                          <td
                            colSpan="4"
                            style={{
                              ...skillStyles.cell,
                              textAlign: "center",
                              padding: "20px",
                              color: theme.textSecondary,
                              fontStyle: "italic",
                            }}
                          >
                            No tool proficiencies available
                          </td>
                        </tr>
                      ) : (
                        allTools.map((toolObj) => {
                          const tool = toolObj.name;
                          const toolLevel = character.tools?.[tool] || 0;
                          const toolBonus = calculateToolBonus(tool);

                          let toolColor = theme.textSecondary;
                          if (toolLevel === 1)
                            toolColor = theme.primary || "#3b82f6";
                          if (toolLevel === 2)
                            toolColor = theme.warning || "#f59e0b";

                          return (
                            <tr
                              key={tool}
                              style={skillStyles.row}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  theme.hover || `${theme.primary}05`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  theme.surface;
                              }}
                            >
                              <td style={skillStyles.cell}>
                                <button
                                  onClick={() => toggleToolProficiency(tool)}
                                  title={getProficiencyTooltip(toolLevel)}
                                  style={skillStyles.proficiencyButton}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      theme.hover || `${theme.primary}10`;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "transparent";
                                  }}
                                >
                                  {getProficiencyIcon(toolLevel)}
                                </button>
                              </td>
                              <td style={skillStyles.cell}>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    color: theme.textSecondary,
                                  }}
                                >
                                  —
                                </span>
                              </td>
                              <td style={skillStyles.cell}>
                                <button
                                  onClick={() => {
                                    setSelectedTool(tool);
                                    setShowToolModal(true);
                                  }}
                                  style={{
                                    ...skillStyles.skillButton,
                                    color: toolColor,
                                    fontWeight: toolLevel > 0 ? "600" : "400",
                                  }}
                                >
                                  {tool}
                                  {toolLevel === 2 && (
                                    <Star
                                      size={12}
                                      fill={theme.warning || "#f59e0b"}
                                      stroke={theme.warning || "#f59e0b"}
                                      style={{ marginLeft: "4px" }}
                                    />
                                  )}
                                </button>
                              </td>
                              <td style={skillStyles.cell}>
                                <span
                                  style={{
                                    ...skillStyles.bonusValue,
                                    color: toolColor,
                                    fontWeight: toolLevel > 0 ? "600" : "400",
                                  }}
                                >
                                  {toolLevel > 0
                                    ? formatModifier(toolBonus)
                                    : "—"}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <MagicalTheoryModal
        isOpen={showMagicalTheoryModal}
        onClose={handleMagicalTheoryModalClose}
        onConfirm={handleMagicalTheoryModalConfirm}
        character={character}
        supabase={supabase}
        discordUserId={discordUserId}
        theme={theme}
      />

      {showToolModal && (
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
            zIndex: 1000,
          }}
          onClick={() => setShowToolModal(false)}
        >
          <div
            style={{
              backgroundColor: theme.surface,
              borderRadius: "12px",
              border: `2px solid ${theme.border}`,
              padding: "24px",
              maxWidth: "450px",
              width: "90%",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div style={{ color: theme.primary }}>
                {selectedTool &&
                  React.cloneElement(getToolIcon(selectedTool), { size: 20 })}
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  color: theme.text,
                }}
              >
                {selectedTool}
              </h3>
            </div>

            <div
              style={{
                fontSize: "14px",
                color: theme.textSecondary,
                lineHeight: "1.5",
                marginBottom: "20px",
              }}
            >
              Select which ability modifier to use for this tool check:
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: "8px",
                }}
              >
                Ability Modifier:
              </label>

              <select
                value={selectedAbility}
                onChange={(e) => setSelectedAbility(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "6px",
                  backgroundColor: theme.background,
                  color: theme.text,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {abilities.map((ability) => {
                  const abilityMod = modifiers(character)[ability.name] || 0;
                  return (
                    <option key={ability.name} value={ability.name}>
                      {ability.displayName} ({ability.abbr}){" "}
                      {formatModifier(abilityMod)}
                    </option>
                  );
                })}
              </select>

              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: `${theme.primary}10`,
                  border: `1px solid ${theme.primary}30`,
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    color: theme.text,
                    fontWeight: "500",
                  }}
                >
                  Total Modifier:
                </span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{ fontSize: "12px", color: theme.textSecondary }}
                  >
                    {getAbilityAbbr(selectedAbility)}{" "}
                    {formatModifier(modifiers(character)[selectedAbility] || 0)}{" "}
                    + Prof {formatModifier(character?.proficiencyBonus || 0)} =
                  </span>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: theme.primary,
                    }}
                  >
                    {formatModifier(
                      (modifiers(character)[selectedAbility] || 0) +
                        (character?.proficiencyBonus || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowToolModal(false)}
                style={{
                  backgroundColor: "transparent",
                  color: theme.textSecondary,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.textSecondary}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleToolRoll}
                disabled={isRolling}
                style={{
                  backgroundColor: theme.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: isRolling ? "not-allowed" : "pointer",
                  opacity: isRolling ? 0.5 : 1,
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isRolling) {
                    e.currentTarget.style.backgroundColor =
                      theme.primaryDark || theme.primary;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary;
                }}
              >
                {isRolling ? "Rolling..." : "Roll Check"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
