import React from "react";
import { Sparkles, Settings, CircleSmall, CircleDashed } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const METAMAGIC_DATA = {
  "Careful Spell": {
    cost: "1 sorcery point",
    description:
      "When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell's full force. Choose a number of those creatures up to your Charisma modifier (minimum of one creature). A chosen creature automatically succeeds on its saving throw against the spell.",
    preview: "Protect allies from spell effects",
  },
  "Distant Spell": {
    cost: "1 sorcery point",
    description:
      "When you cast a spell that has a range of 5 feet or greater, you can double the range of the spell. When you cast a spell that has a range of touch, you can make the range of the spell 30 feet.",
    preview: "Double spell range or make touch spells 30 feet",
  },
  "Empowered Spell": {
    cost: "1 sorcery point",
    description:
      "When you roll damage for a spell, you can reroll a number of the damage dice up to your Charisma modifier (minimum of one). You must use the new rolls.",
    preview: "Reroll damage dice for better results",
  },
  "Extended Spell": {
    cost: "1 sorcery point",
    description:
      "When you cast a spell that has a duration of 1 minute or longer, you can double its duration, to a maximum duration of 24 hours.",
    preview: "Double spell duration up to 24 hours",
  },
  "Heightened Spell": {
    cost: "3 sorcery points",
    description:
      "When you cast a spell that forces a creature to make a saving throw to resist its effects, you can give one target of the spell disadvantage on its first saving throw made against the spell.",
    preview: "Give one target disadvantage on saves",
  },
  "Quickened Spell": {
    cost: "2 sorcery points",
    description:
      "When you cast a spell that has a casting time of 1 action, you can change the casting time to 1 bonus action for this casting.",
    preview: "Cast action spells as bonus actions",
  },
  "Subtle Spell": {
    cost: "1 sorcery point",
    description:
      "When you cast a spell, you can cast it without any somatic or verbal components.",
    preview: "Cast spells without verbal or somatic components",
  },
  "Twinned Spell": {
    cost: "Varies (spell level)",
    description:
      "When you cast a spell that targets only one creature and doesn't have a range of self, you can target a second creature in range with the same spell. The cost equals the spell's level (1 sorcery point for cantrips).",
    preview: "Target a second creature with single-target spells",
  },

  "Fierce Spell": {
    cost: "2/4 sorcery points",
    description:
      "When you cast a spell, you can spend 2 sorcery points to cast that spell as if it were cast using a spell slot one level higher than its original level, or 4 sorcery points to cast that spell two levels higher. The spell's higher level cannot exceed your highest available level of spell slots. This does not count against your number of Metamagic options.",
    preview: "Cast spells at higher levels",
    castingStyle: "Willpower Caster",
  },
  "Resistant Spell": {
    cost: "1 sorcery point per level",
    description:
      "When you cast a spell, you can spend 1 sorcery point per increased level to make your spell be treated by spell deflection, finite incantatem, reparifarge, or langlock as if your spell was cast using a spell slot higher than its original level, making your spell more resistant. The spell's higher level cannot exceed your highest available level of spell slots. This does not count against your number of Metamagic options.",
    preview: "Make spells more resistant to dispelling",
    castingStyle: "Willpower Caster",
  },
  "Bouncing Spell": {
    cost: "2 sorcery points",
    description:
      "When a creature succeeds at a saving throw against a single-target spell you cast, you can spend 2 Sorcery Points to have the spell bounce, targeting another creature of your choice within 30 ft. of the original target without spending another spell slot or taking an additional action.",
    preview: "Redirect spells that miss to new targets",
    castingStyle: "Technique Caster",
  },
  "Maximized Spell": {
    cost: "2x spell level sorcery points",
    description:
      "When you roll damage for a leveled spell, you can spend a number of Sorcery Points equal to twice the spell's level to deal maximum damage to one target of the spell. Maximized spell can not be applied to Exploit Weakness damage.",
    preview: "Deal maximum damage with spells",
    castingStyle: "Technique Caster",
  },
  "Seeking Spell": {
    cost: "2 sorcery points",
    description:
      "If you make an attack roll for a spell and miss, you can spend 2 Sorcery Points to reroll the d20, and you must use the new roll. You can use Seeking Spell even if you have already used a different Metamagic option during the casting of the spell.",
    preview: "Reroll missed spell attacks",
    castingStyle: "Technique Caster",
  },
  Rage: {
    cost: "5 sorcery points",
    description:
      "At 3rd level, when in battle, you fight with primal ferocity. On your turn, you can spend 5 sorcery points to enter a rage as a bonus action. While raging, you gain advantage on Strength checks and saves, resistance to bludgeoning, piercing, slashing and fire damage, and +2 to unarmed strike damage (+3 at 10th level, +4 at 16th level). You can't cast area effect spells or concentrate while raging. Your rage lasts for 1 minute.",
    preview: "Enter a primal rage for combat bonuses",
    castingStyle: "Vigor Caster",
  },
};

const CASTING_STYLE_METAMAGICS = {
  "Willpower Caster": ["Fierce Spell", "Resistant Spell"],
  "Technique Caster": ["Bouncing Spell", "Maximized Spell", "Seeking Spell"],
  "Vigor Caster": ["Rage"],
};

const MetaMagicDisplay = ({ character, onNavigateToCharacterManagement }) => {
  const { theme } = useTheme();

  const getMetaMagicChoices = (character) => {
    let metaMagicNames = [];

    if (
      character?.metamagicChoices &&
      typeof character.metamagicChoices === "object"
    ) {
      metaMagicNames = Object.keys(character.metamagicChoices).filter(
        (key) => character.metamagicChoices[key] === true
      );
    } else if (
      character?.metamagic_choices &&
      typeof character.metamagic_choices === "object"
    ) {
      metaMagicNames = Object.keys(character.metamagic_choices).filter(
        (key) => character.metamagic_choices[key] === true
      );
    } else {
      metaMagicNames =
        character?.metamagic ||
        character?.metaMagic ||
        character?.meta_magic ||
        [];
    }

    return metaMagicNames.map((name) => ({
      name,
      ...METAMAGIC_DATA[name],
      cost: METAMAGIC_DATA[name]?.cost || "Unknown cost",
      description:
        METAMAGIC_DATA[name]?.description || "No description available",
      preview: METAMAGIC_DATA[name]?.preview || "No preview available",
      isSelected: true,
    }));
  };

  const getAutomaticMetaMagics = (character) => {
    const castingStyle = character?.castingStyle;
    const level = character?.level || 1;

    if (castingStyle === "Willpower Caster" && level >= 3) {
      return CASTING_STYLE_METAMAGICS[castingStyle].map((name) => ({
        name,
        ...METAMAGIC_DATA[name],
        cost: METAMAGIC_DATA[name]?.cost || "Unknown cost",
        description:
          METAMAGIC_DATA[name]?.description || "No description available",
        preview: METAMAGIC_DATA[name]?.preview || "No preview available",
        isAutomatic: true,
        castingStyle: castingStyle,
      }));
    }

    return [];
  };

  const selectedMetaMagics = getMetaMagicChoices(character);
  const automaticMetaMagics = getAutomaticMetaMagics(character);

  const qualifiesForMetaMagic = character?.level >= 3;
  const hasAnyMetaMagic =
    selectedMetaMagics.length > 0 || automaticMetaMagics.length > 0;
  const shouldShowMissingNotification =
    qualifiesForMetaMagic && selectedMetaMagics.length === 0;

  const handleNavigateToCharacterManager = () => {
    if (onNavigateToCharacterManagement && character?.id) {
      onNavigateToCharacterManagement(character.id, "metamagic");
    }
  };

  const styles = {
    container: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      padding: "16px",
      marginBottom: "16px",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "12px",
      paddingBottom: "8px",
      borderBottom: `1px solid ${theme.border}`,
    },
    title: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
      margin: 0,
    },
    metaMagicList: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    scrollContainer: {
      maxHeight: "400px",
      overflowY: "auto",
      paddingRight: "4px",
    },
    metaMagicItem: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: "12px",
      backgroundColor: theme.background,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
    },
    metaMagicHeader: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    metaMagicName: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
    },
    metaMagicCost: {
      fontSize: "12px",
      fontWeight: "500",
      color: theme.primary,
      backgroundColor: `${theme.primary}15`,
      padding: "2px 6px",
      borderRadius: "4px",
    },
    metaMagicPreview: {
      fontSize: "13px",
      fontWeight: "500",
      color: theme.textSecondary,
      fontStyle: "italic",
    },
    metaMagicDescription: {
      fontSize: "14px",
      lineHeight: "1.4",
      color: theme.text,
    },
    emptyState: {
      textAlign: "center",
      color: theme.textSecondary,
      fontStyle: "italic",
      padding: "16px",
    },
    icon: {
      color: theme.primary,
    },
    missingNotification: {
      backgroundColor: `${theme.warning}15`,
      border: `2px solid ${theme.warning}`,
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
      textAlign: "center",
    },
    notificationText: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.warning,
      marginBottom: "12px",
    },
    managerButton: {
      backgroundColor: theme.primary,
      color: theme.surface,
      border: "none",
      borderRadius: "6px",
      padding: "10px 16px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      margin: "0 auto",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: theme.secondary,
        transform: "translateY(-1px)",
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Sparkles size={20} style={styles.icon} />
        <h3 style={styles.title}>Metamagic Options</h3>
      </div>

      <div style={styles.scrollContainer}>
        {automaticMetaMagics.length > 0 && (
          <>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#8b5cf6",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {character?.castingStyle}
            </div>
            <div style={styles.metaMagicList}>
              {automaticMetaMagics.map((metaMagic, index) => (
                <div
                  key={`auto-${index}`}
                  style={{
                    ...styles.metaMagicItem,
                    border: `1px solid #8b5cf6`,
                    backgroundColor: theme.background,
                  }}
                >
                  <div style={styles.metaMagicHeader}>
                    <span style={styles.metaMagicName}>{metaMagic.name}</span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        color: "#8b5cf6",
                        backgroundColor: "#8b5cf625",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        marginRight: "8px",
                      }}
                    >
                      Granted at level 3
                    </span>
                    <span
                      style={{
                        ...styles.metaMagicCost,
                        backgroundColor: "#8b5cf625",
                        color: "#8b5cf6",
                      }}
                    >
                      {metaMagic.cost}
                    </span>
                  </div>
                  <div style={styles.metaMagicPreview}>{metaMagic.preview}</div>
                  <div style={styles.metaMagicDescription}>
                    {metaMagic.description}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {shouldShowMissingNotification && (
          <div style={{ ...styles.missingNotification, marginTop: "16px" }}>
            <div style={styles.notificationText}>
              You have not selected a metamagic perk
            </div>
            <button
              style={styles.managerButton}
              onClick={handleNavigateToCharacterManager}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme.secondary;
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = theme.primary;
                e.target.style.transform = "translateY(0)";
              }}
            >
              <Settings size={16} />
              Go to Character Manager
            </button>
          </div>
        )}

        {selectedMetaMagics.length > 0 && (
          <>
            {automaticMetaMagics.length > 0 && (
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: theme.primary,
                  marginTop: "16px",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Granted by Level Progression
              </div>
            )}
            <div style={styles.metaMagicList}>
              {selectedMetaMagics.map((metaMagic, index) => (
                <div key={`selected-${index}`} style={styles.metaMagicItem}>
                  <div style={styles.metaMagicHeader}>
                    <CircleSmall size={16} style={styles.icon} />
                    <span style={styles.metaMagicName}>{metaMagic.name}</span>
                    <span style={styles.metaMagicCost}>{metaMagic.cost}</span>
                  </div>
                  <div style={styles.metaMagicPreview}>{metaMagic.preview}</div>
                  <div style={styles.metaMagicDescription}>
                    {metaMagic.description}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!hasAnyMetaMagic && (
          <div style={styles.emptyState}>No metamagic options available</div>
        )}
      </div>
    </div>
  );
};

export default MetaMagicDisplay;
