import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  Heart,
  Zap,
  Dice6,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const CharacterSheet = ({ user, customUsername, supabase, className = "" }) => {
  const discordWebhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL;
  const discordUserId = user?.user_metadata?.provider_id;

  const styles = {
    container: {
      maxWidth: "1024px",
      margin: "0 auto",
      padding: "1.5rem",
      background: "linear-gradient(to bottom right, #e0e7ff, #f3e8ff)",
      minHeight: "100vh",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    characterSelector: {
      backgroundColor: "#fff",
      borderRadius: "0.5rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      marginBottom: "1.5rem",
      padding: "1.5rem",
      border: "2px solid #c7d2fe",
    },
    selectorTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    selectContainer: {
      position: "relative",
      width: "100%",
    },
    select: {
      width: "100%",
      padding: "0.75rem",
      fontSize: "1rem",
      border: "2px solid #d1d5db",
      borderRadius: "0.5rem",
      backgroundColor: "#fff",
      cursor: "pointer",
      appearance: "none",
      background: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 0.75rem center/16px 16px`,
    },
    loadingContainer: {
      textAlign: "center",
      padding: "2rem",
      backgroundColor: "#f9fafb",
      borderRadius: "0.5rem",
      border: "2px solid #e5e7eb",
    },
    errorContainer: {
      textAlign: "center",
      padding: "2rem",
      backgroundColor: "#fef2f2",
      borderRadius: "0.5rem",
      border: "2px solid #fecaca",
      color: "#dc2626",
    },
    headerCard: {
      backgroundColor: "#fff",
      borderRadius: "0.5rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      marginBottom: "1.5rem",
      padding: "1.5rem",
      border: "2px solid #c7d2fe",
    },
    headerFlex: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "1rem",
    },
    avatar: {
      width: "4rem",
      height: "4rem",
      backgroundColor: "#e0e7ff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    characterName: {
      fontSize: "1.875rem",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "0.5rem",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      fontSize: "0.875rem",
    },
    infoItem: {
      color: "#374151",
    },
    label: {
      fontWeight: "600",
    },
    combatStats: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "1rem",
      marginTop: "1rem",
    },
    statCard: {
      textAlign: "center",
      padding: "0.75rem",
      borderRadius: "0.5rem",
      border: "1px solid",
    },
    statCardRed: {
      backgroundColor: "#fef2f2",
      borderColor: "#fecaca",
    },
    statCardBlue: {
      backgroundColor: "#eff6ff",
      borderColor: "#bfdbfe",
    },
    statCardGreen: {
      backgroundColor: "#f0fdf4",
      borderColor: "#bbf7d0",
    },
    statValue: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "0.25rem",
    },
    statValueRed: {
      color: "#b91c1c",
    },
    statValueBlue: {
      color: "#1d4ed8",
    },
    statValueGreen: {
      color: "#166534",
    },
    statLabel: {
      fontSize: "0.875rem",
    },
    statLabelRed: {
      color: "#dc2626",
    },
    statLabelBlue: {
      color: "#2563eb",
    },
    statLabelGreen: {
      color: "#16a34a",
    },
    abilityCard: {
      backgroundColor: "#fff",
      borderRadius: "0.5rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      padding: "1.5rem",
      border: "2px solid #d8b4fe",
      marginBottom: "1.5rem",
    },
    abilityTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "1rem",
    },
    abilityGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
      gap: "1rem",
    },
    abilityItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.75rem",
      backgroundColor: "#f9fafb",
      borderRadius: "0.5rem",
      textAlign: "center",
    },
    abilityName: {
      fontWeight: "500",
      marginBottom: "0.5rem",
    },
    abilityModifier: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#1f2937",
    },
    abilityScore: {
      fontSize: "0.875rem",
      color: "#6b7280",
      marginTop: "0.25rem",
    },
    // Skills Table Styles
    skillsCard: {
      backgroundColor: "#fff",
      borderRadius: "0.5rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      padding: "1.5rem",
      border: "2px solid #e5e7eb",
      marginBottom: "1.5rem",
    },
    skillsTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "1rem",
      textAlign: "center",
      letterSpacing: "0.1em",
    },
    skillsTable: {
      width: "100%",
      borderCollapse: "collapse",
    },
    skillsHeaderRow: {
      backgroundColor: "#f9fafb",
      borderBottom: "2px solid #d1d5db",
    },
    skillsHeaderCell: {
      padding: "0.75rem 0.5rem",
      fontSize: "0.75rem",
      fontWeight: "bold",
      color: "#374151",
      textAlign: "center",
      borderRight: "1px solid #d1d5db",
      letterSpacing: "0.05em",
      cursor: "pointer",
      transition: "background-color 0.2s",
      userSelect: "none",
    },
    skillsHeaderCellLast: {
      padding: "0.75rem 0.5rem",
      fontSize: "0.75rem",
      fontWeight: "bold",
      color: "#374151",
      textAlign: "center",
      letterSpacing: "0.05em",
      cursor: "pointer",
      transition: "background-color 0.2s",
      userSelect: "none",
    },
    skillsHeaderCellHover: {
      backgroundColor: "#e5e7eb",
    },
    skillsHeaderCellActive: {
      backgroundColor: "#ddd6fe",
      color: "#5b21b6",
    },
    sortableHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.25rem",
    },
    skillRow: {
      borderBottom: "1px solid #e5e7eb",
      transition: "background-color 0.2s",
    },
    skillRowHover: {
      backgroundColor: "#f9fafb",
    },
    skillCell: {
      padding: "0.5rem",
      textAlign: "center",
      borderRight: "1px solid #e5e7eb",
      verticalAlign: "middle",
    },
    skillCellLast: {
      padding: "0.5rem",
      textAlign: "center",
      verticalAlign: "middle",
    },
    proficiencyCircle: {
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      border: "2px solid #6b7280",
      backgroundColor: "transparent",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "inline-block",
    },
    proficiencyCircleFilled: {
      backgroundColor: "#1f2937",
      borderColor: "#1f2937",
    },
    abilityMod: {
      fontSize: "0.75rem",
      fontWeight: "bold",
      color: "#6b7280",
      letterSpacing: "0.05em",
    },
    skillNameButton: {
      background: "none",
      border: "none",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#374151",
      cursor: "pointer",
      padding: "0.25rem 0.5rem",
      borderRadius: "0.25rem",
      transition: "all 0.2s",
      textAlign: "left",
      width: "100%",
    },
    skillNameButtonProficient: {
      color: "#1d4ed8",
      fontWeight: "600",
    },
    skillNameButtonHover: {
      backgroundColor: "#e5e7eb",
    },
    bonusValue: {
      fontSize: "0.875rem",
      fontWeight: "bold",
      color: "#1f2937",
      backgroundColor: "#f9fafb",
      border: "1px solid #d1d5db",
      borderRadius: "0.25rem",
      padding: "0.25rem 0.5rem",
      minWidth: "35px",
      display: "inline-block",
    },
    instructionsCard: {
      marginTop: "1.5rem",
      backgroundColor: "#fff",
      borderRadius: "0.5rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      padding: "1rem",
      border: "2px solid #e5e7eb",
    },
    instructionsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "1rem",
      fontSize: "0.875rem",
      color: "#6b7280",
    },
    instructionItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    warning: {
      marginTop: "0.5rem",
      fontSize: "0.75rem",
      color: "#ea580c",
    },
  };

  const [characters, setCharacters] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [character, setCharacter] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [characterLoading, setCharacterLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sortColumn, setSortColumn] = useState("skill");
  const [sortDirection, setSortDirection] = useState("asc");
  const [hoveredHeader, setHoveredHeader] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!discordUserId) {
        setError("No user ID available");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("characters")
          .select("id, name, house, casting_style, level")
          .eq("discord_user_id", discordUserId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setCharacters(data || []);

        if (data && data.length > 0) {
          setSelectedCharacterId(data[0].id);
        }
      } catch (err) {
        console.error("Error fetching characters:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [discordUserId, supabase]);

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!selectedCharacterId) {
        setCharacter(null);
        return;
      }

      setCharacterLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("characters")
          .select("*")
          .eq("id", selectedCharacterId)
          .eq("discord_user_id", discordUserId)
          .single();

        if (error) throw error;

        if (data) {
          const transformedCharacter = {
            name: data.name,
            house: data.house,
            year: `Level ${data.level}`,
            background: data.background || "Unknown",
            bloodStatus: data.innate_heritage || "Unknown",
            wand: data.wand_type || "Unknown wand",
            strength: data.ability_scores?.strength || 10,
            dexterity: data.ability_scores?.dexterity || 10,
            constitution: data.ability_scores?.constitution || 10,
            intelligence: data.ability_scores?.intelligence || 10,
            wisdom: data.ability_scores?.wisdom || 10,
            charisma: data.ability_scores?.charisma || 10,
            hitPoints: data.hit_points || 1,
            armorClass:
              11 + Math.floor((data.ability_scores?.dexterity - 10) / 2) || 11,
            speed: 30,
            proficiencyBonus: Math.ceil(data.level / 4) + 1,
            skills: transformSkillProficiencies(data.skill_proficiencies || []),
            castingStyle: data.casting_style,
            subclass: data.subclass,
            standardFeats: data.standard_feats || [],
            magicModifiers: data.magic_modifiers || {},
          };

          setCharacter(transformedCharacter);
        }
      } catch (err) {
        console.error("Error fetching character:", err);
        setError(err.message);
      } finally {
        setCharacterLoading(false);
      }
    };

    fetchCharacter();
  }, [selectedCharacterId, discordUserId, supabase]);

  const transformSkillProficiencies = (skillArray) => {
    const skillMap = {
      Athletics: "athletics",
      Acrobatics: "acrobatics",
      "Sleight of Hand": "sleightOfHand",
      Stealth: "stealth",
      Herbology: "herbology",
      "History of Magic": "historyOfMagic",
      Investigation: "investigation",
      "Magical Theory": "magicalTheory",
      "Muggle Studies": "muggleStudies",
      Insight: "insight",
      "Magical Creatures": "magicalCreatures",
      Medicine: "medicine",
      Perception: "perception",
      "Potion Making": "potionMaking",
      Survival: "survival",
      Deception: "deception",
      Intimidation: "intimidation",
      Performance: "performance",
      Persuasion: "persuasion",
    };

    const skills = {};

    Object.values(skillMap).forEach((skill) => {
      skills[skill] = false;
    });

    skillArray.forEach((skillName) => {
      const mappedSkill = skillMap[skillName];
      if (mappedSkill) {
        skills[mappedSkill] = true;
      }
    });

    return skills;
  };

  const getModifier = (score) => Math.floor((score - 10) / 2);

  const modifiers = character
    ? {
        strength: getModifier(character.strength),
        dexterity: getModifier(character.dexterity),
        constitution: getModifier(character.constitution),
        intelligence: getModifier(character.intelligence),
        wisdom: getModifier(character.wisdom),
        charisma: getModifier(character.charisma),
      }
    : {};

  const formatModifier = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

  const calculateSkillBonus = (skillName, abilityMod) => {
    if (!character) return 0;
    const isProficient = character.skills?.[skillName] || false;
    const profBonus = isProficient ? character.proficiencyBonus : 0;
    return abilityMod + profBonus;
  };

  const skillsToDbFormat = (skillsObject) => {
    const skillMap = {
      athletics: "Athletics",
      acrobatics: "Acrobatics",
      sleightOfHand: "Sleight of Hand",
      stealth: "Stealth",
      herbology: "Herbology",
      historyOfMagic: "History of Magic",
      investigation: "Investigation",
      magicalTheory: "Magical Theory",
      muggleStudies: "Muggle Studies",
      insight: "Insight",
      magicalCreatures: "Magical Creatures",
      medicine: "Medicine",
      perception: "Perception",
      potionMaking: "Potion Making",
      survival: "Survival",
      deception: "Deception",
      intimidation: "Intimidation",
      performance: "Performance",
      persuasion: "Persuasion",
    };

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
          const aAbilityMod = modifiers[a.ability];
          const bAbilityMod = modifiers[b.ability];
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

  const rollSkill = async (skill, abilityMod) => {
    if (isRolling) return;

    setIsRolling(true);

    const rollDice = () => {
      const roller = new DiceRoller();
      const roll = roller.roll("1d20");
      return {
        total: roll.total,
        notation: roll.notation,
        output: roll.output,
      };
    };

    try {
      const diceResult = rollDice();
      const d20Roll = diceResult.total;
      const skillBonus = calculateSkillBonus(skill.name, abilityMod);
      const total = d20Roll + skillBonus;
      const isProficient = character.skills?.[skill.name] || false;

      const message = {
        embeds: [
          {
            title: `${character.name} Attempted: ${skill.displayName}`,
            description: `1d20: [${d20Roll}] = ${d20Roll}`,
            color: 0x00ff00, // Green color like the spell attempts
            fields: [
              {
                name: "Roll Details",
                value: `Roll: ${d20Roll} ${
                  skillBonus >= 0 ? "+" : ""
                }${skillBonus} = **${total}**`,
                inline: false,
              },
              {
                name: "Modifier Breakdown",
                value: `${character.house}\n${
                  skill.ability.charAt(0).toUpperCase() + skill.ability.slice(1)
                }: ${formatModifier(abilityMod)}${
                  isProficient
                    ? `\nProficiency: +${character.proficiencyBonus}`
                    : ""
                }\nTotal: **${formatModifier(skillBonus)}**`,
                inline: false,
              },
              {
                name: "Player",
                value: character.name,
                inline: true,
              },
            ],
            footer: {
              text: `${
                character.house
              } - Skill Check • Today at ${new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`,
            },
          },
        ],
      };

      if (discordWebhookUrl) {
        await fetch(discordWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
      } else {
        console.log(
          `${character.name} rolled ${skill.displayName}: d20(${d20Roll}) + ${skillBonus} = ${total}`
        );
        alert(
          `${skill.displayName} Check: d20(${d20Roll}) + ${skillBonus} = ${total}`
        );
      }
    } catch (error) {
      console.error("Error sending Discord message:", error);
      alert("Failed to send roll to Discord");
    } finally {
      setIsRolling(false);
    }
  };

  const allSkills = [
    { name: "athletics", displayName: "Athletics", ability: "strength" },
    { name: "acrobatics", displayName: "Acrobatics", ability: "dexterity" },
    {
      name: "sleightOfHand",
      displayName: "Sleight of Hand",
      ability: "dexterity",
    },
    { name: "stealth", displayName: "Stealth", ability: "dexterity" },
    { name: "herbology", displayName: "Herbology", ability: "intelligence" },
    {
      name: "historyOfMagic",
      displayName: "History of Magic",
      ability: "intelligence",
    },
    {
      name: "investigation",
      displayName: "Investigation",
      ability: "intelligence",
    },
    {
      name: "magicalTheory",
      displayName: "Magical Theory",
      ability: "intelligence",
    },
    {
      name: "muggleStudies",
      displayName: "Muggle Studies",
      ability: "intelligence",
    },
    { name: "insight", displayName: "Insight", ability: "wisdom" },
    {
      name: "magicalCreatures",
      displayName: "Magical Creatures",
      ability: "wisdom",
    },
    { name: "medicine", displayName: "Medicine", ability: "wisdom" },
    { name: "perception", displayName: "Perception", ability: "wisdom" },
    { name: "potionMaking", displayName: "Potion Making", ability: "wisdom" },
    { name: "survival", displayName: "Survival", ability: "wisdom" },
    { name: "deception", displayName: "Deception", ability: "charisma" },
    { name: "intimidation", displayName: "Intimidation", ability: "charisma" },
    { name: "performance", displayName: "Performance", ability: "charisma" },
    { name: "persuasion", displayName: "Persuasion", ability: "charisma" },
  ];

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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <h2>Loading Characters...</h2>
          <p>Please wait while we fetch your characters.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>Error Loading Characters</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>No Characters Found</h2>
          <p>
            You haven't created any characters yet. Go to Character Creation to
            get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, ...{ className } }}>
      <div style={styles.characterSelector}>
        <h2 style={styles.selectorTitle}>
          <User className="w-5 h-5" />
          Select Character
        </h2>
        <div style={styles.selectContainer}>
          <select
            value={selectedCharacterId}
            onChange={(e) => setSelectedCharacterId(e.target.value)}
            style={styles.select}
          >
            <option value="">Choose a character...</option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name} ({char.house} - Level {char.level}{" "}
                {char.casting_style})
              </option>
            ))}
          </select>
        </div>
      </div>

      {characterLoading && (
        <div style={styles.loadingContainer}>
          <h3>Loading Character Sheet...</h3>
        </div>
      )}

      {character && !characterLoading && (
        <>
          <div style={styles.headerCard}>
            <div style={styles.headerFlex}>
              <div style={styles.avatar}>
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={styles.characterName}>{character.name}</h1>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>House:</span> {character.house}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Level:</span> {character.year}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Class:</span>{" "}
                    {character.castingStyle}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Subclass:</span>{" "}
                    {character.subclass || "None"}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Background:</span>{" "}
                    {character.background}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Heritage:</span>{" "}
                    {character.bloodStatus}
                  </div>
                  <div style={{ ...styles.infoItem, gridColumn: "span 2" }}>
                    <span style={styles.label}>Wand:</span> {character.wand}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.combatStats}>
              <div style={{ ...styles.statCard, ...styles.statCardRed }}>
                <Heart className="w-6 h-6 text-red-600 mx-auto mb-1" />
                <div style={{ ...styles.statValue, ...styles.statValueRed }}>
                  {character.hitPoints}
                </div>
                <div style={{ ...styles.statLabel, ...styles.statLabelRed }}>
                  Hit Points
                </div>
              </div>
              <div style={{ ...styles.statCard, ...styles.statCardBlue }}>
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <div style={{ ...styles.statValue, ...styles.statValueBlue }}>
                  {character.armorClass}
                </div>
                <div style={{ ...styles.statLabel, ...styles.statLabelBlue }}>
                  Armor Class
                </div>
              </div>
              <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
                <Zap className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <div style={{ ...styles.statValue, ...styles.statValueGreen }}>
                  {character.speed} ft
                </div>
                <div style={{ ...styles.statLabel, ...styles.statLabelGreen }}>
                  Speed
                </div>
              </div>
            </div>
          </div>

          <div style={styles.abilityCard}>
            <h2 style={styles.abilityTitle}>Ability Scores</h2>
            <div style={styles.abilityGrid}>
              {[
                { name: "Strength", key: "strength" },
                { name: "Dexterity", key: "dexterity" },
                { name: "Constitution", key: "constitution" },
                { name: "Intelligence", key: "intelligence" },
                { name: "Wisdom", key: "wisdom" },
                { name: "Charisma", key: "charisma" },
              ].map((ability) => (
                <div key={ability.key} style={styles.abilityItem}>
                  <span style={styles.abilityName}>{ability.name}</span>
                  <div style={styles.abilityModifier}>
                    {formatModifier(modifiers[ability.key])}
                  </div>
                  <div style={styles.abilityScore}>
                    {character[ability.key]}
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                  const abilityMod = modifiers[skill.ability];
                  const skillBonus = calculateSkillBonus(
                    skill.name,
                    abilityMod
                  );
                  const isProficient = character.skills?.[skill.name] || false;

                  return (
                    <tr
                      key={skill.name}
                      style={{
                        ...styles.skillRow,
                        ...(hoveredSkill === skill.name
                          ? styles.skillRowHover
                          : {}),
                      }}
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <td style={styles.skillCell}>
                        <div
                          style={{
                            ...styles.proficiencyCircle,
                            ...(isProficient
                              ? styles.proficiencyCircleFilled
                              : {}),
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
                          onClick={() => rollSkill(skill, abilityMod)}
                          disabled={isRolling}
                          style={{
                            ...styles.skillNameButton,
                            ...(isProficient
                              ? styles.skillNameButtonProficient
                              : {}),
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

          <div style={styles.instructionsCard}>
            <div style={styles.instructionsGrid}>
              <div style={styles.instructionItem}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#1f2937",
                    border: "2px solid #1f2937",
                  }}
                />
                <span>
                  Click circle to add proficiency bonus (+
                  {character.proficiencyBonus})
                </span>
              </div>
              <div style={styles.instructionItem}>
                <Dice6 className="w-4 h-4 text-blue-500" />
                <span>Click skill name to roll d20 + modifier</span>
              </div>
              <div style={styles.instructionItem}>
                <ChevronUp className="w-4 h-4 text-purple-500" />
                <span>Click column headers to sort skills</span>
              </div>
            </div>
            {!discordWebhookUrl && (
              <div style={styles.warning}>
                ⚠️ No Discord webhook configured - rolls will show as alerts
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CharacterSheet;
