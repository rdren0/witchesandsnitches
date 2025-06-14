import { useState } from "react";
import { ChevronDown, ChevronUp, Circle, Star } from "lucide-react";
import { formatModifier, modifiers, skillMap, allSkills } from "./utils";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedStyles } from "./styles";
import { useRollFunctions } from "../../App/diceRoller";

export const Skills = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  selectedCharacterId,
}) => {
  const { rollSkill } = useRollFunctions();
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  const [sortColumn, setSortColumn] = useState("skill");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isRolling, setIsRolling] = useState(false);

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
        case "bonus":
          const aAbilityMod = modifiers(character)[a.ability];
          const bAbilityMod = modifiers(character)[b.ability];
          aValue = calculateSkillBonus(a.name, aAbilityMod);
          bValue = calculateSkillBonus(b.name, bAbilityMod);
          break;
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
    const iconStyle = {
      width: "16px",
      height: "16px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    };

    switch (skillLevel) {
      case 0:
        return (
          <Circle
            style={{
              ...iconStyle,
              color: theme.textSecondary || "#6b7280",
              fill: "transparent",
            }}
          />
        );
      case 1:
        return (
          <Circle
            style={{
              ...iconStyle,
              color: theme.primary || "#3b82f6",
              fill: theme.primary || "#3b82f6",
            }}
          />
        );
      case 2:
        return (
          <Star
            style={{
              ...iconStyle,
              color: theme.warning || "#f59e0b",
              fill: theme.warning || "#f59e0b",
            }}
          />
        );
      default:
        return (
          <Circle
            style={{
              ...iconStyle,
              color: theme.textSecondary || "#6b7280",
              fill: "transparent",
            }}
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

  return (
    <div style={styles.skillsCard}>
      <h2 style={styles.skillsTitle}>SKILLS</h2>
      <div
        style={{
          marginBottom: "12px",
          fontSize: "12px",
          color: theme.textSecondary,
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        Click icons to cycle: None → Proficient → Expertise
      </div>
      <table style={styles.skillsTable}>
        <thead>
          <tr style={styles.skillsHeaderRow}>
            <th
              style={{
                ...styles.skillsHeaderCell,
              }}
              onClick={() => handleSort("proficiency")}
              title="Click to sort by proficiency level"
            >
              <div style={styles.sortableHeader}>
                PROF
                {getSortIcon("proficiency")}
              </div>
            </th>
            <th
              style={{
                ...styles.skillsHeaderCell,
              }}
              onClick={() => handleSort("modifier")}
              title="Click to sort by ability modifier"
            >
              <div style={styles.sortableHeader}>
                MOD
                {getSortIcon("modifier")}
              </div>
            </th>
            <th
              style={{
                ...styles.skillsHeaderCell,
              }}
              onClick={() => handleSort("skill")}
              title="Click to sort by skill name"
            >
              <div style={styles.sortableHeader}>
                SKILL
                {getSortIcon("skill")}
              </div>
            </th>
            <th
              style={{
                ...styles.skillsHeaderCellLast,
              }}
              onClick={() => handleSort("bonus")}
              title="Click to sort by total bonus"
            >
              <div style={styles.sortableHeader}>
                BONUS
                {getSortIcon("bonus")}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortSkills(allSkills).map((skill) => {
            const abilityMod = modifiers(character)[skill.ability];
            const skillBonus = calculateSkillBonus(skill.name, abilityMod);
            const skillLevel = character.skills?.[skill.name] || 0;

            return (
              <tr
                key={skill.name}
                style={{
                  ...styles.skillRow,
                }}
              >
                <td style={styles.skillCell}>
                  <div
                    onClick={() => toggleSkillProficiency(skill.name)}
                    title={getProficiencyTooltip(skillLevel)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                      borderRadius: "4px",
                      transition: "background-color 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor =
                        theme.background || "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    {getProficiencyIcon(skillLevel)}
                  </div>
                </td>
                <td style={styles.skillCell}>
                  <span style={styles.abilityMod}>
                    {getAbilityAbbr(skill.ability)}
                  </span>
                </td>
                <td style={styles.skillCell}>
                  <button
                    onClick={() =>
                      rollSkill({
                        skill,
                        abilityMod,
                        isRolling,
                        setIsRolling,
                        character,
                      })
                    }
                    disabled={isRolling}
                    style={{
                      ...styles.skillNameButton,
                      ...(skillLevel > 0
                        ? styles.skillNameButtonProficient
                        : {}),
                      ...(skillLevel === 2
                        ? {
                            fontWeight: "bold",
                            color: theme.warning || "#f59e0b",
                            borderColor: theme.warning || "#f59e0b",
                          }
                        : {}),
                      ...(isRolling
                        ? { opacity: 0.5, cursor: "not-allowed" }
                        : {}),
                    }}
                    title={`Click to roll ${skill.displayName}${
                      skillLevel === 1
                        ? " (Proficient)"
                        : skillLevel === 2
                        ? " (Expertise)"
                        : ""
                    }`}
                  >
                    {skill.displayName}
                    {skillLevel === 2 && (
                      <Star
                        size={12}
                        style={{
                          marginLeft: "4px",
                          color: theme.warning || "#f59e0b",
                        }}
                      />
                    )}
                  </button>
                </td>
                <td style={styles.skillCellLast}>
                  <span
                    style={{
                      ...styles.bonusValue,
                      ...(skillLevel === 2
                        ? {
                            fontWeight: "bold",
                            color: theme.warning || "#f59e0b",
                          }
                        : skillLevel === 1
                        ? {
                            fontWeight: "600",
                            color: theme.primary || "#3b82f6",
                          }
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

      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          backgroundColor: theme.background || "#f9fafb",
          borderRadius: "8px",
          border: `1px solid ${theme.border || "#e5e7eb"}`,
          fontSize: "12px",
          color: theme.textSecondary,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Circle size={12} color={theme.textSecondary} fill="transparent" />
            <span>Not Proficient</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Circle
              size={12}
              color={theme.primary || "#3b82f6"}
              fill={theme.primary || "#3b82f6"}
            />
            <span>Proficient (+{character?.proficiencyBonus || 0})</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Star
              size={12}
              color={theme.warning || "#f59e0b"}
              fill={theme.warning || "#f59e0b"}
            />
            <span>Expertise (+{(character?.proficiencyBonus || 0) * 2})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
