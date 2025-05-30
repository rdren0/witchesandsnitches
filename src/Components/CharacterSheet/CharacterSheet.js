import React, { useState } from "react";
import { User, Shield, Heart, Zap, Dice6 } from "lucide-react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const CharacterSheet = ({ characterData, className = "" }) => {
  const discordWebhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL;

  // Inline styles
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
    abilityScore: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#1f2937",
    },
    abilityModifier: {
      fontSize: "0.875rem",
      color: "#6b7280",
      marginTop: "0.25rem",
    },
    // New Skills Table Styles
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
    },
    skillsHeaderCellLast: {
      padding: "0.75rem 0.5rem",
      fontSize: "0.75rem",
      fontWeight: "bold",
      color: "#374151",
      textAlign: "center",
      letterSpacing: "0.05em",
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
    checkbox: {
      width: "1rem",
      height: "1rem",
      accentColor: "#2563eb",
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

  // Default character data if none provided
  const defaultCharacter = {
    name: "Harry Potter",
    house: "Gryffindor",
    year: "5th Year",
    background: "The Boy Who Lived",
    bloodStatus: "Half-Blood",
    wand: "Holly, Phoenix Feather, 11 inches",
    strength: 12,
    dexterity: 14,
    constitution: 13,
    intelligence: 15,
    wisdom: 16,
    charisma: 14,
    hitPoints: 45,
    armorClass: 12,
    speed: 30,
    proficiencyBonus: 3,
    skills: {
      athletics: true,
      acrobatics: false,
      sleightOfHand: true,
      stealth: true,
      herbology: false,
      historyOfMagic: false,
      investigation: true,
      magicalTheory: false,
      muggleStudies: false,
      insight: true,
      magicalCreatures: false,
      medicine: false,
      perception: true,
      potionMaking: false,
      survival: true,
      deception: false,
      intimidation: false,
      performance: false,
      persuasion: true,
    },
  };

  const [character, setCharacter] = useState(characterData || defaultCharacter);
  const [isRolling, setIsRolling] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Calculate ability modifiers
  const getModifier = (score) => Math.floor((score - 10) / 2);

  const modifiers = {
    strength: getModifier(character.strength),
    dexterity: getModifier(character.dexterity),
    constitution: getModifier(character.constitution),
    intelligence: getModifier(character.intelligence),
    wisdom: getModifier(character.wisdom),
    charisma: getModifier(character.charisma),
  };

  // Format modifier for display
  const formatModifier = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

  // Calculate skill bonuses
  const calculateSkillBonus = (skillName, abilityMod) => {
    const isProficient = character.skills?.[skillName] || false;
    const profBonus = isProficient ? character.proficiencyBonus : 0;
    return abilityMod + profBonus;
  };

  // Toggle skill proficiency
  const toggleSkillProficiency = (skillName) => {
    setCharacter((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skillName]: !prev.skills[skillName],
      },
    }));
  };

  // Roll d20 and send to Discord
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
            color: 0x3396ff, // Green color like the spell attempts
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
                value: `${
                  skill.ability.charAt(0).toUpperCase() + skill.ability.slice(1)
                }: ${formatModifier(abilityMod)}${
                  isProficient
                    ? `\nProficiency: +${character.proficiencyBonus}`
                    : ""
                }\nTotal: **${formatModifier(skillBonus)}**`,
                inline: false,
              },
            ],
            footer: {
              text: `Witches And Snitches - Skill Check • Today at ${new Date().toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )}`,
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

  // All skills in a single list
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

  // Get ability abbreviation
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
    <div style={{ ...styles.container, ...{ className } }}>
      {/* Header */}
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
                <span style={styles.label}>Year:</span> {character.year}
              </div>
              <div style={styles.infoItem}>
                <span style={styles.label}>Background:</span>{" "}
                {character.background}
              </div>
              <div style={styles.infoItem}>
                <span style={styles.label}>Blood Status:</span>{" "}
                {character.bloodStatus}
              </div>
              <div style={{ ...styles.infoItem, gridColumn: "span 2" }}>
                <span style={styles.label}>Wand:</span> {character.wand}
              </div>
            </div>
          </div>
        </div>

        {/* Combat Stats */}
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

      {/* Ability Scores */}
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
              <div style={styles.abilityScore}>{character[ability.key]}</div>
              <div style={styles.abilityModifier}>
                {formatModifier(modifiers[ability.key])}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Table */}
      <div style={styles.skillsCard}>
        <h2 style={styles.skillsTitle}>SKILLS</h2>
        <table style={styles.skillsTable}>
          <thead>
            <tr style={styles.skillsHeaderRow}>
              <th style={styles.skillsHeaderCell}>PROF</th>
              <th style={styles.skillsHeaderCell}>MOD</th>
              <th style={styles.skillsHeaderCell}>SKILL</th>
              <th style={styles.skillsHeaderCellLast}>BONUS</th>
            </tr>
          </thead>
          <tbody>
            {allSkills.map((skill) => {
              const abilityMod = modifiers[skill.ability];
              const skillBonus = calculateSkillBonus(skill.name, abilityMod);
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

      {/* Instructions */}
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
        </div>
        {!discordWebhookUrl && (
          <div style={styles.warning}>
            ⚠️ No Discord webhook configured - rolls will show as alerts
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSheet;
