import { useState } from "react";
import { ChevronDown, ChevronUp, Circle, Star, Dice6 } from "lucide-react";
import {
  calculatePassivePerception,
  calculatePassiveInvestigation,
  calculatePassiveDeception,
  calculateModifier,
  formatModifier,
  modifiers,
  getPassiveSkillBreakdown,
} from "../utils";
import { MagicalTheoryModal } from "./MagicalTheoryModal";
import { createThemedStyles } from "../../../styles/masterStyles";
import { useRollFunctions } from "../../utils/diceRoller";
import { useTheme } from "../../../contexts/ThemeContext";
import { allSkills, skillMap, skillDescriptions } from "../../../SharedData";

export const Skills = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  selectedCharacterId,
}) => {
  const { rollSkill, rollMagicalTheoryCheck } = useRollFunctions();
  const { theme } = useTheme();
  const [sortColumn, setSortColumn] = useState("skill");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isRolling, setIsRolling] = useState(false);
  const [showMagicalTheoryModal, setShowMagicalTheoryModal] = useState(false);
  const [pendingMagicalTheoryData, setPendingMagicalTheoryData] =
    useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const passivePerception = calculatePassivePerception(character);
  const passiveInvestigation = calculatePassiveInvestigation(character);
  const passiveDeception = calculatePassiveDeception(character);

  const skillStyles = {
    container: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      height: "1200px",
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
      flex: 1,
      overflow: "auto",
      padding: "20px",
    },
    tableContainer: {
      backgroundColor: theme.surface,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
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
      padding: "14px 16px",
      fontSize: "14px",
      color: theme.text,
      borderBottom: `1px solid ${theme.border}`,
      position: "relative",
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
      right: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginLeft: "10px",
      padding: "8px 12px",
      backgroundColor: theme.background,
      color: theme.text,
      borderRadius: "6px",
      fontSize: "12px",
      whiteSpace: "nowrap",
      maxWidth: "400px",
      minWidth: "150px",
      zIndex: 1000,
      pointerEvents: "none",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
      flexWrap: "wrap",
      marginBottom: "12px",
    },
    legendItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "13px",
      color: theme.textSecondary,
    },
    magicalTheoryNote: {
      marginTop: "12px",
      paddingTop: "12px",
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

  const getAbilityAbbr = (ability) => {
    const abbrevMap = {
      strength: "STR",
      dexterity: "DEX",
      constitution: "CON",
      intelligence: "INT",
      wisdom: "WIS",
      charisma: "CHA",
    };
    return abbrevMap[ability] || ability.slice(0, 3).toUpperCase();
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
      title: `${skill.name}`,
      description: skillDescriptions[skill.name] || "Roll this skill check",
    };
  };

  return (
    <>
      <div style={skillStyles.container}>
        <div style={skillStyles.header}>
          <h2 style={skillStyles.title}>Skills</h2>
          <div style={skillStyles.instructions}>
            Click icons to cycle proficiency • Click skill names to roll dice
          </div>
          <div style={skillStyles.rollHint}>
            <Dice6 size={14} />
            <span>Click any skill name to roll a skill check!</span>
          </div>
        </div>

        <div style={skillStyles.contentContainer}>
          <div style={skillStyles.tableContainer}>
            <table style={skillStyles.table}>
              <thead>
                <tr style={skillStyles.headerRow}>
                  <th
                    style={skillStyles.headerCell}
                    onClick={() => handleSort("proficiency")}
                    title="Click to sort by proficiency level"
                  >
                    <div style={skillStyles.sortableHeader}>
                      PROF
                      {getSortIcon("proficiency")}
                    </div>
                  </th>
                  <th
                    style={skillStyles.headerCell}
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
                    style={skillStyles.headerCell}
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

          <div style={skillStyles.legend}>
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
                <span>
                  Expertise (+{(character?.proficiencyBonus || 0) * 2})
                </span>
              </div>
            </div>
            <div style={skillStyles.magicalTheoryNote}>
              <span>✨</span>
              <span>
                Magical Theory: Roll this skill to potentially earn bonus dice
                (1d4 to 1d10) for spell attempts!
              </span>
            </div>
          </div>
        </div>
      </div>

      <MagicalTheoryModal
        isOpen={showMagicalTheoryModal}
        onClose={handleMagicalTheoryModalClose}
        onConfirm={handleMagicalTheoryModalConfirm}
        character={character}
        theme={theme}
      />
    </>
  );
};
