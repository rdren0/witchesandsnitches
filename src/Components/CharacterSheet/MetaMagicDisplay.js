import React from "react";
import { Sparkles, Settings, CircleSmall } from "lucide-react";
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
    }));
  };

  const metaMagics = getMetaMagicChoices(character);

  const getMaxMetaMagicOptions = (level) => {
    return Object.keys(METAMAGIC_DATA).length; // Allow selection of all available options
  };

  const qualifiesForMetaMagic = character?.level >= 3;
  const maxOptions = getMaxMetaMagicOptions(character?.level || 1);
  const hasSelectedMetaMagic = metaMagics && metaMagics.length > 0;
  const shouldShowMissingNotification =
    qualifiesForMetaMagic && !hasSelectedMetaMagic;

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

      {shouldShowMissingNotification && (
        <div style={styles.missingNotification}>
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

      {metaMagics && metaMagics.length > 0 ? (
        <div style={styles.metaMagicList}>
          {metaMagics.map((metaMagic, index) => (
            <div key={index} style={styles.metaMagicItem}>
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
      ) : (
        <div style={styles.emptyState}>No metamagic options available</div>
      )}
    </div>
  );
};

export default MetaMagicDisplay;
