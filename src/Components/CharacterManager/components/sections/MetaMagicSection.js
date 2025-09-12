import React from "react";
import { Sparkles } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBackgroundStyles } from "../../../../styles/masterStyles";

const AVAILABLE_METAMAGICS = [
  {
    name: "Careful Spell",
    cost: "1 sorcery point",
    description:
      "When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell's full force. Choose a number of those creatures up to your Charisma modifier (minimum of one creature). A chosen creature automatically succeeds on its saving throw against the spell.",
    preview: "Protect allies from spell effects",
  },
  {
    name: "Distant Spell",
    cost: "1 sorcery point",
    description:
      "When you cast a spell that has a range of 5 feet or greater, you can double the range of the spell. When you cast a spell that has a range of touch, you can make the range of the spell 30 feet.",
    preview: "Double spell range or make touch spells 30 feet",
  },
  {
    name: "Empowered Spell",
    cost: "1 sorcery point",
    description:
      "When you roll damage for a spell, you can reroll a number of the damage dice up to your Charisma modifier (minimum of one). You must use the new rolls.",
    preview: "Reroll damage dice for better results",
  },
  {
    name: "Extended Spell",
    cost: "1 sorcery point",
    description:
      "When you cast a spell that has a duration of 1 minute or longer, you can double its duration, to a maximum duration of 24 hours.",
    preview: "Double spell duration up to 24 hours",
  },
  {
    name: "Heightened Spell",
    cost: "3 sorcery points",
    description:
      "When you cast a spell that forces a creature to make a saving throw to resist its effects, you can give one target of the spell disadvantage on its first saving throw made against the spell.",
    preview: "Give one target disadvantage on saves",
  },
  {
    name: "Quickened Spell",
    cost: "2 sorcery points",
    description:
      "When you cast a spell that has a casting time of 1 action, you can change the casting time to 1 bonus action for this casting.",
    preview: "Cast action spells as bonus actions",
  },
  {
    name: "Subtle Spell",
    cost: "1 sorcery point",
    description:
      "When you cast a spell, you can cast it without any somatic or verbal components.",
    preview: "Cast spells without verbal or somatic components",
  },
  {
    name: "Twinned Spell",
    cost: "Varies (spell level)",
    description:
      "When you cast a spell that targets only one creature and doesn't have a range of self, you can target a second creature in range with the same spell. The cost equals the spell's level (1 sorcery point for cantrips).",
    preview: "Target a second creature with single-target spells",
  },
];

const MetaMagicSection = ({ character, onChange, disabled = false }) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);

  const getMetaMagicChoices = (character) => {
    if (
      character?.metamagicChoices &&
      typeof character.metamagicChoices === "object"
    ) {
      return Object.keys(character.metamagicChoices).filter(
        (key) => character.metamagicChoices[key] === true
      );
    }

    if (
      character?.metamagic_choices &&
      typeof character.metamagic_choices === "object"
    ) {
      return Object.keys(character.metamagic_choices).filter(
        (key) => character.metamagic_choices[key] === true
      );
    }

    return (
      character?.metamagic ||
      character?.metaMagic ||
      character?.meta_magic ||
      []
    );
  };

  const currentMetaMagics = getMetaMagicChoices(character);

  const getMaxMetaMagicOptions = (level) => {
    if (level >= 10) return 4;
    if (level >= 6) return 3;
    if (level >= 3) return 2;
    return 1;
  };

  const maxOptions = getMaxMetaMagicOptions(character?.level || 1);
  const selectedCount = currentMetaMagics.length;
  const canSelectMore = selectedCount < maxOptions;

  const handleMetaMagicToggle = (metaMagicName) => {
    const isSelected = currentMetaMagics.includes(metaMagicName);
    let updatedMetaMagics;

    if (isSelected) {
      updatedMetaMagics = currentMetaMagics.filter(
        (mm) => mm !== metaMagicName
      );
    } else if (canSelectMore) {
      updatedMetaMagics = [...currentMetaMagics, metaMagicName];
    } else {
      return;
    }

    const metamagicChoices = {};
    updatedMetaMagics.forEach((name) => {
      metamagicChoices[name] = true;
    });

    onChange("metamagicChoices", metamagicChoices);
  };

  const selectedMetaMagics = AVAILABLE_METAMAGICS.filter((mm) =>
    currentMetaMagics.includes(mm.name)
  );

  const availableMetaMagics = AVAILABLE_METAMAGICS.filter(
    (mm) => !currentMetaMagics.includes(mm.name)
  );

  return (
    <div style={styles.sectionContainer}>
      {/* Header with slot information */}
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: theme.background,
          border: `1px solid ${theme.border}`,
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={16} color={theme.primary} />
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: theme.text,
              }}
            >
              Options
            </span>
          </div>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: selectedCount >= maxOptions ? theme.error : theme.primary,
            }}
          >
            {selectedCount} / {maxOptions}
          </span>
        </div>
        <div
          style={{
            fontSize: "12px",
            color: theme.textSecondary,
          }}
        >
          Level {character?.level || 1} characters can choose up to {maxOptions}{" "}
          metamagic option{maxOptions !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Selected Metamagics */}
      {selectedMetaMagics.length > 0 && (
        <div style={styles.selectedElementsSection}>
          <div style={styles.selectedSectionHeader}>
            <span style={styles.selectedSectionTitle}>
              Selected Metamagic Options
            </span>
          </div>

          {selectedMetaMagics.map((metaMagic) => {
            return (
              <div key={metaMagic.name} style={styles.selectedElementCard}>
                <div style={styles.featHeader}>
                  <label style={styles.featLabelClickable}>
                    <input
                      type="checkbox"
                      name="metamagic"
                      checked={true}
                      onChange={() => handleMetaMagicToggle(metaMagic.name)}
                      disabled={disabled}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginRight: "8px",
                        cursor: disabled ? "not-allowed" : "pointer",
                        accentColor: theme.success,
                        transform: "scale(1.2)",
                      }}
                    />
                    <span style={styles.featNameSelected}>
                      {metaMagic.name}
                      <span
                        style={{
                          marginLeft: "8px",
                          fontSize: "12px",
                          fontWeight: "500",
                          color: theme.primary,
                          backgroundColor: `${theme.primary}15`,
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {metaMagic.cost}
                      </span>
                    </span>
                  </label>
                </div>

                <div style={styles.featPreviewSelected}>
                  {metaMagic.preview}
                </div>

                <div style={styles.featDescriptionSelected}>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      margin: "0",
                      color: theme.text,
                    }}
                  >
                    {metaMagic.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Available Metamagics */}
      {availableMetaMagics.length > 0 && (
        <div style={styles.availableElementsSection}>
          <div style={styles.availableSectionHeader}>
            <span style={styles.availableSectionTitle}>
              Available Metamagic Options
              {!canSelectMore && (
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "12px",
                    color: theme.error,
                    fontWeight: "normal",
                  }}
                >
                  (Maximum reached)
                </span>
              )}
            </span>
          </div>

          <div style={styles.availableElementsContainer}>
            {availableMetaMagics.map((metaMagic) => {
              const isDisabled = disabled || !canSelectMore;

              return (
                <div key={metaMagic.name} style={styles.featCard}>
                  <div style={styles.featHeader}>
                    <label style={styles.featLabelClickable}>
                      <input
                        type="checkbox"
                        name="metamagic"
                        checked={false}
                        onChange={() => handleMetaMagicToggle(metaMagic.name)}
                        disabled={isDisabled}
                        style={{
                          width: "18px",
                          height: "18px",
                          marginRight: "8px",
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          accentColor: theme.primary,
                          transform: "scale(1.2)",
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                      />
                      <span
                        style={{
                          ...styles.featName,
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                      >
                        {metaMagic.name}
                        <span
                          style={{
                            marginLeft: "8px",
                            fontSize: "12px",
                            fontWeight: "500",
                            color: isDisabled
                              ? theme.textSecondary
                              : theme.primary,
                            backgroundColor: isDisabled
                              ? `${theme.textSecondary}15`
                              : `${theme.primary}15`,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            opacity: isDisabled ? 0.5 : 1,
                          }}
                        >
                          {metaMagic.cost}
                        </span>
                      </span>
                    </label>
                  </div>

                  <div
                    style={{
                      ...styles.featPreview,
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                  >
                    {metaMagic.preview}
                  </div>

                  <div
                    style={{
                      ...styles.featDescription,
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.5",
                        margin: "0",
                        color: theme.text,
                      }}
                    >
                      {metaMagic.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No options available message */}
      {availableMetaMagics.length === 0 && selectedMetaMagics.length === 0 && (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            color: theme.textSecondary,
            fontStyle: "italic",
            backgroundColor: theme.background,
            border: `1px dashed ${theme.border}`,
            borderRadius: "12px",
          }}
        >
          <Sparkles size={24} style={{ opacity: 0.5, marginBottom: "8px" }} />
          <div>No metamagic options available</div>
        </div>
      )}
    </div>
  );
};

export default MetaMagicSection;
