import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  const [hoveredHeader, setHoveredHeader] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const calculateSkillBonus = (skillName, abilityMod) => {
    if (!character) return 0;
    const isProficient = character.skills?.[skillName] || false;
    const profBonus = isProficient ? character.proficiencyBonus : 0;
    return abilityMod + profBonus;
  };

  const skillsToDbFormat = (skillsObject) => {
    const proficientSkills = [];
    Object.entries(skillsObject).forEach(([skillKey, isProficient]) => {
      if (isProficient && skillMap[skillKey]) {
        proficientSkills.push(skillMap[skillKey]);
      }
    });

    return proficientSkills;
  };

  const toggleSkillProficiency = async (skillName) => {
    if (!character || !selectedCharacterId) return;

    const updatedSkills = {
      ...character.skills,
      [skillName]: !character.skills[skillName],
    };

    setCharacter((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));

    try {
      const skillProficiencies = skillsToDbFormat(updatedSkills);

      const { error } = await supabase
        .from("characters")
        .update({ skill_proficiencies: skillProficiencies })
        .eq("id", selectedCharacterId)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error updating skill proficiency:", error);

        setCharacter((prev) => ({
          ...prev,
          skills: {
            ...prev.skills,
            [skillName]: !updatedSkills[skillName],
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
          [skillName]: !updatedSkills[skillName],
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
          aValue = character.skills?.[a.name] || false;
          bValue = character.skills?.[b.name] || false;

          aValue = aValue ? 1 : 0;
          bValue = bValue ? 1 : 0;
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

  return (
    <div style={styles.skillsCard}>
      <h2 style={styles.skillsTitle}>SKILLS</h2>
      <table style={styles.skillsTable}>
        <thead>
          <tr style={styles.skillsHeaderRow}>
            <th
              style={{
                ...styles.skillsHeaderCell,
                ...(hoveredHeader === "proficiency"
                  ? styles.skillsHeaderCellHover
                  : {}),
                ...(sortColumn === "proficiency"
                  ? styles.skillsHeaderCellActive
                  : {}),
              }}
              onClick={() => handleSort("proficiency")}
              onMouseEnter={() => setHoveredHeader("proficiency")}
              onMouseLeave={() => setHoveredHeader(null)}
              title="Click to sort by proficiency"
            >
              <div style={styles.sortableHeader}>
                PROF
                {getSortIcon("proficiency")}
              </div>
            </th>
            <th
              style={{
                ...styles.skillsHeaderCell,
                ...(hoveredHeader === "modifier"
                  ? styles.skillsHeaderCellHover
                  : {}),
                ...(sortColumn === "modifier"
                  ? styles.skillsHeaderCellActive
                  : {}),
              }}
              onClick={() => handleSort("modifier")}
              onMouseEnter={() => setHoveredHeader("modifier")}
              onMouseLeave={() => setHoveredHeader(null)}
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
                ...(hoveredHeader === "skill"
                  ? styles.skillsHeaderCellHover
                  : {}),
                ...(sortColumn === "skill"
                  ? styles.skillsHeaderCellActive
                  : {}),
              }}
              onClick={() => handleSort("skill")}
              onMouseEnter={() => setHoveredHeader("skill")}
              onMouseLeave={() => setHoveredHeader(null)}
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
                ...(hoveredHeader === "bonus"
                  ? styles.skillsHeaderCellHover
                  : {}),
                ...(sortColumn === "bonus"
                  ? styles.skillsHeaderCellActive
                  : {}),
              }}
              onClick={() => handleSort("bonus")}
              onMouseEnter={() => setHoveredHeader("bonus")}
              onMouseLeave={() => setHoveredHeader(null)}
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
            const isProficient = character.skills?.[skill.name] || false;
            return (
              <tr
                key={skill.name}
                style={{
                  ...styles.skillRow,
                  ...(hoveredSkill === skill.name ? styles.skillRowHover : {}),
                }}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <td style={styles.skillCell}>
                  <div
                    style={{
                      ...styles.proficiencyCircle,
                      ...(isProficient ? styles.proficiencyCircleFilled : {}),
                    }}
                    onClick={() => toggleSkillProficiency(skill.name)}
                    title="Toggle Proficiency"
                  />
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
                      ...(isProficient ? styles.skillNameButtonProficient : {}),
                      ...(hoveredSkill === skill.name
                        ? styles.skillNameButtonHover
                        : {}),
                      ...(isRolling
                        ? { opacity: 0.5, cursor: "not-allowed" }
                        : {}),
                    }}
                    title={`Click to roll ${skill.displayName}`}
                  >
                    {skill.displayName}
                  </button>
                </td>
                <td style={styles.skillCellLast}>
                  <span style={styles.bonusValue}>
                    {formatModifier(skillBonus)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
