import { useState, useEffect, useRef } from "react";
import { createFeatStyles } from "../../../../styles/masterStyles";
import { useTheme } from "../../../../contexts/ThemeContext";
import { backgroundsData } from "../../../../SharedData/backgroundsData";

const calculateBackgroundModifiers = (selectedBackground, character) => {
  const defaultInitiativeChanges = {
    bonus: 0,
    abilityChange: null,
    description: null,
  };

  if (!selectedBackground)
    return {
      abilityModifiers: {},
      initiativeChanges: defaultInitiativeChanges,
    };

  const background = backgroundsData[selectedBackground];
  if (!background?.modifiers)
    return {
      abilityModifiers: {},
      initiativeChanges: defaultInitiativeChanges,
    };

  const abilityModifiers = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  const initiativeChanges = { ...defaultInitiativeChanges };

  if (background.modifiers.abilityIncreases) {
    background.modifiers.abilityIncreases.forEach((increase) => {
      if (
        increase.type === "fixed" &&
        abilityModifiers.hasOwnProperty(increase.ability)
      ) {
        abilityModifiers[increase.ability] += increase.amount;
      }
    });
  }

  if (background.modifiers.other) {
    if (background.modifiers.other.initiativeBonus) {
      initiativeChanges.bonus = background.modifiers.other.initiativeBonus;
      initiativeChanges.description = `+${background.modifiers.other.initiativeBonus} Initiative`;
    }

    if (background.modifiers.other.initiativeAbility) {
      const newAbility = background.modifiers.other.initiativeAbility;
      const currentAbility = character.initiativeAbility || "dexterity";

      if (newAbility !== currentAbility) {
        initiativeChanges.abilityChange = newAbility;
        initiativeChanges.description = initiativeChanges.description
          ? `${initiativeChanges.description}, Use ${
              newAbility.charAt(0).toUpperCase() + newAbility.slice(1)
            }`
          : `Use ${
              newAbility.charAt(0).toUpperCase() + newAbility.slice(1)
            } for Initiative`;
      }
    }
  }

  return { abilityModifiers, initiativeChanges };
};

const applyBackgroundProficiencies = (character, backgroundName) => {
  if (!backgroundName || !backgroundsData[backgroundName]) {
    return {
      ...character,
      background: "",
      skillProficiencies: removeBackgroundProficiencies(
        character.skillProficiencies || [],
        character.background
      ),
      backgroundSkills: [],
      toolProficiencies: removeBackgroundToolProficiencies(
        character.toolProficiencies || [],
        character.background
      ),
    };
  }

  const background = backgroundsData[backgroundName];
  const currentSkillProficiencies = character.skillProficiencies || [];
  const currentToolProficiencies = character.toolProficiencies || [];

  const cleanedSkillProficiencies = removeBackgroundProficiencies(
    currentSkillProficiencies,
    character.background
  );
  const cleanedToolProficiencies = removeBackgroundToolProficiencies(
    currentToolProficiencies,
    character.background
  );

  const newBackgroundSkills = background.skillProficiencies || [];
  const newSkillProficiencies = [
    ...cleanedSkillProficiencies,
    ...newBackgroundSkills,
  ];

  const newToolProficiencies = background.toolProficiencies
    ? [...cleanedToolProficiencies, ...background.toolProficiencies]
    : cleanedToolProficiencies;

  return {
    ...character,
    background: backgroundName,
    skillProficiencies: [...new Set(newSkillProficiencies)],
    backgroundSkills: newBackgroundSkills,
    toolProficiencies: [...new Set(newToolProficiencies)],
  };
};

const removeBackgroundProficiencies = (
  currentProficiencies,
  backgroundName
) => {
  if (!backgroundName || !backgroundsData[backgroundName]) {
    return currentProficiencies;
  }

  const background = backgroundsData[backgroundName];
  const backgroundSkills = background.skillProficiencies || [];

  return currentProficiencies.filter(
    (skill) => !backgroundSkills.includes(skill)
  );
};

const removeBackgroundToolProficiencies = (
  currentProficiencies,
  backgroundName
) => {
  if (!backgroundName || !backgroundsData[backgroundName]) {
    return currentProficiencies;
  }

  const background = backgroundsData[backgroundName];
  const backgroundTools = background.toolProficiencies || [];

  return currentProficiencies.filter((tool) => !backgroundTools.includes(tool));
};

const BackgroundModifierPills = ({ selectedBackground, character, styles }) => {
  const { abilityModifiers, initiativeChanges } = calculateBackgroundModifiers(
    selectedBackground,
    character
  );

  const hasAbilityModifiers = Object.values(abilityModifiers).some(
    (mod) => mod > 0
  );
  const hasInitiativeChanges =
    initiativeChanges.bonus > 0 || initiativeChanges.abilityChange;

  if (!hasAbilityModifiers && !hasInitiativeChanges) return null;

  return (
    <div style={styles.modifierPillsContainer}>
      <div style={styles.pillsLabel}>Background Bonuses:</div>
      <div style={styles.pillsRow}>
        {Object.entries(abilityModifiers)
          .filter(([_, value]) => value > 0)
          .map(([ability, bonus]) => (
            <div
              key={ability}
              style={styles.modifierPill}
              title={`+${bonus} ${
                ability.charAt(0).toUpperCase() + ability.slice(1)
              } from background`}
            >
              <span style={styles.pillAbility}>
                {ability.slice(0, 3).toUpperCase()}
              </span>
              <span style={styles.pillModifier}>+{bonus}</span>
            </div>
          ))}

        {hasInitiativeChanges && (
          <div
            style={styles.initiativePill}
            title={initiativeChanges.description}
          >
            <span style={styles.pillAbility}>INIT</span>
            <span style={styles.pillModifier}>
              {initiativeChanges.bonus > 0 && `+${initiativeChanges.bonus}`}
              {initiativeChanges.abilityChange && (
                <span style={styles.abilityChange}>
                  {initiativeChanges.bonus > 0 ? ", " : ""}
                  {initiativeChanges.abilityChange.slice(0, 3).toUpperCase()}
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const EnhancedBackgroundSelector = ({
  value,
  onChange,
  onCharacterUpdate,
  disabled = false,
  backgrounds: backgroundsList = [],
  character = {},
}) => {
  const { theme } = useTheme();
  const styles = createFeatStyles(theme);
  const [expandedBackgrounds, setExpandedBackgrounds] = useState(new Set());
  const backgroundRefs = useRef({});
  const [hasInitialized, setHasInitialized] = useState(false);

  const selectedBackground = value || "";

  useEffect(() => {
    // Only expand the selected background on initial load
    if (
      selectedBackground &&
      selectedBackground.trim() !== "" &&
      !hasInitialized
    ) {
      if (expandedBackgrounds.size === 0) {
        setExpandedBackgrounds(new Set([selectedBackground]));
      }
      setHasInitialized(true);
    }
  }, [selectedBackground, expandedBackgrounds.size, hasInitialized]);

  const enhancedStyles = {
    ...styles,
    modifierPillsContainer: {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      border: "1px solid rgba(59, 130, 246, 0.3)",
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "16px",
    },
    pillsLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#3b82f6",
      marginBottom: "8px",
    },
    pillsRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    modifierPill: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      backgroundColor: "#3b82f6",
      color: "white",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "11px",
      fontWeight: "600",
      cursor: "help",
    },
    initiativePill: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      backgroundColor: "#f59e0b",
      color: "white",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "11px",
      fontWeight: "600",
      cursor: "help",
    },
    pillAbility: {
      opacity: 0.9,
    },
    pillModifier: {
      fontWeight: "bold",
    },
    abilityChange: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      padding: "1px 4px",
      borderRadius: "4px",
      fontSize: "9px",
    },
  };

  const handleBackgroundToggle = (backgroundName) => {
    let updatedCharacter;

    if (selectedBackground === backgroundName) {
      // Deselect the background
      updatedCharacter = applyBackgroundProficiencies(character, "");
      setExpandedBackgrounds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(backgroundName);
        return newSet;
      });
    } else {
      // Select the background and auto-expand it
      updatedCharacter = applyBackgroundProficiencies(
        character,
        backgroundName
      );
      setExpandedBackgrounds(new Set([backgroundName]));
    }

    onChange(updatedCharacter.background);
    if (onCharacterUpdate) {
      onCharacterUpdate(updatedCharacter);
    }
  };

  const toggleBackgroundExpansion = (backgroundName) => {
    setExpandedBackgrounds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(backgroundName)) {
        newSet.delete(backgroundName);
      } else {
        newSet.add(backgroundName);
      }
      return newSet;
    });
  };

  const getAvailableBackgrounds = () => {
    if (backgroundsList.length > 0) {
      return backgroundsList.map((bg) => ({
        name: bg,
        data: backgroundsData[bg] || {
          name: bg,
          description: `A ${bg.toLowerCase()} student with their own unique story and perspective.`,
          preview: `${bg} background`,
          features: [
            {
              name: "Background Feature",
              description:
                "Your background provides unique experiences and perspectives that shape your character.",
            },
          ],
        },
      }));
    }
    return Object.values(backgroundsData).map((bg) => ({
      name: bg.name,
      data: bg,
    }));
  };

  // Modified to show only selected background if one is selected, otherwise show all
  const visibleBackgrounds = () => {
    const allBackgrounds = getAvailableBackgrounds();

    if (!selectedBackground) {
      return allBackgrounds.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Only show the selected background
    const selectedBg = allBackgrounds.find(
      (bg) => bg.name === selectedBackground
    );
    return selectedBg ? [selectedBg] : allBackgrounds;
  };

  const availableBackgrounds = visibleBackgrounds();

  return (
    <div style={enhancedStyles.container}>
      <div style={enhancedStyles.sectionHeader}>
        <h3 style={enhancedStyles.skillsHeader}>Background</h3>
        {selectedBackground && (
          <span style={enhancedStyles.selectionStatus}>
            Selected: {selectedBackground}
          </span>
        )}
      </div>

      {selectedBackground && (
        <BackgroundModifierPills
          selectedBackground={selectedBackground}
          character={character}
          styles={enhancedStyles}
        />
      )}

      <div style={enhancedStyles.featsContainer}>
        {availableBackgrounds.map(({ name, data }) => {
          const isSelected = selectedBackground === name;
          const isExpanded = expandedBackgrounds.has(name);
          const hasModifiers =
            data.modifiers &&
            (data.modifiers.abilityIncreases?.length > 0 ||
              data.modifiers.other?.initiativeBonus ||
              data.modifiers.other?.initiativeAbility);

          return (
            <div
              key={name}
              ref={(el) => (backgroundRefs.current[name] = el)}
              style={
                isSelected
                  ? enhancedStyles.featCardSelected
                  : enhancedStyles.featCard
              }
            >
              <div style={enhancedStyles.featHeader}>
                <label style={enhancedStyles.featLabelClickable}>
                  <input
                    type="checkbox"
                    name="background"
                    checked={isSelected}
                    onChange={() => handleBackgroundToggle(name)}
                    disabled={disabled}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "8px",
                      cursor: disabled ? "not-allowed" : "pointer",
                      accentColor: theme.primary,
                      transform: "scale(1.2)",
                    }}
                  />
                  <span
                    style={
                      isSelected
                        ? enhancedStyles.featNameSelected
                        : enhancedStyles.featName
                    }
                  >
                    {data.name}
                    {data.skillProficiencies && (
                      <span style={enhancedStyles.availableChoicesIndicator}>
                        ({data.skillProficiencies.length} skill
                        {data.skillProficiencies.length > 1 ? "s" : ""})
                      </span>
                    )}
                    {hasModifiers && (
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#3b82f6",
                          marginLeft: "4px",
                        }}
                      >
                        (+MOD)
                      </span>
                    )}
                  </span>
                </label>
                {!isSelected && (
                  <button
                    onClick={() => toggleBackgroundExpansion(name)}
                    style={enhancedStyles.expandButton}
                    type="button"
                    disabled={disabled}
                  >
                    {isExpanded ? "▲" : "▼"}
                  </button>
                )}
              </div>

              <div
                style={
                  isSelected
                    ? enhancedStyles.featPreviewSelected
                    : enhancedStyles.featPreview
                }
              >
                {data.preview || data.description}
              </div>

              {(isExpanded || isSelected) && (
                <div
                  style={
                    isSelected
                      ? enhancedStyles.featDescriptionSelected
                      : enhancedStyles.featDescription
                  }
                >
                  <div style={{ marginBottom: "16px" }}>
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.5",
                        color: isSelected ? "#374151" : theme.textSecondary,
                        margin: "0 0 12px 0",
                      }}
                    >
                      {data.description}
                    </p>
                  </div>

                  {hasModifiers && (
                    <div
                      style={{
                        marginTop: "8px",
                        marginBottom: "16px",
                        padding: "8px",
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        borderRadius: "4px",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                      }}
                    >
                      <strong style={{ color: "#3b82f6" }}>
                        Background Modifiers:
                      </strong>
                      <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                        {data.modifiers.abilityIncreases?.map(
                          (increase, index) => (
                            <li
                              key={index}
                              style={{ fontSize: "12px", color: "#3b82f6" }}
                            >
                              +{increase.amount}{" "}
                              {increase.ability.charAt(0).toUpperCase() +
                                increase.ability.slice(1)}
                            </li>
                          )
                        )}
                        {data.modifiers.other?.initiativeBonus && (
                          <li style={{ fontSize: "12px", color: "#f59e0b" }}>
                            +{data.modifiers.other.initiativeBonus} Initiative
                          </li>
                        )}
                        {data.modifiers.other?.initiativeAbility && (
                          <li style={{ fontSize: "12px", color: "#f59e0b" }}>
                            Use{" "}
                            {data.modifiers.other.initiativeAbility
                              .charAt(0)
                              .toUpperCase() +
                              data.modifiers.other.initiativeAbility.slice(
                                1
                              )}{" "}
                            for Initiative
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {data.skillProficiencies && (
                    <div style={{ marginBottom: "16px" }}>
                      <h5
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: isSelected ? "#047857" : theme.text,
                        }}
                      >
                        Skill Proficiencies:
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        {data.skillProficiencies.map((skill, index) => (
                          <span
                            key={index}
                            style={{
                              fontSize: "12px",
                              padding: "4px 8px",
                              backgroundColor: isSelected
                                ? "#10B98120"
                                : theme.primary + "20",
                              color: isSelected ? "#047857" : theme.primary,
                              borderRadius: "12px",
                              border: `1px solid ${
                                isSelected ? "#10B981" : theme.primary
                              }`,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.toolProficiencies && (
                    <div style={{ marginBottom: "16px" }}>
                      <h5
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: isSelected ? "#047857" : theme.text,
                        }}
                      >
                        Tool Proficiencies:
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        {data.toolProficiencies.map((tool, index) => (
                          <span
                            key={index}
                            style={{
                              fontSize: "12px",
                              padding: "4px 8px",
                              backgroundColor: isSelected
                                ? "#F59E0B20"
                                : theme.warning + "20",
                              color: isSelected ? "#D97706" : theme.warning,
                              borderRadius: "12px",
                              border: `1px solid ${
                                isSelected ? "#F59E0B" : theme.warning
                              }`,
                            }}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.features && (
                    <div style={{ marginBottom: "16px" }}>
                      <h5
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: isSelected ? "#047857" : theme.text,
                        }}
                      >
                        Background Features:
                      </h5>
                      {data.features.map((feature, index) => (
                        <div key={index} style={{ marginBottom: "8px" }}>
                          <strong
                            style={{
                              fontSize: "13px",
                              color: isSelected ? "#10B981" : theme.primary,
                            }}
                          >
                            {feature.name}:
                          </strong>
                          <span
                            style={{
                              fontSize: "13px",
                              color: isSelected
                                ? "#374151"
                                : theme.textSecondary,
                              marginLeft: "4px",
                              lineHeight: "1.4",
                            }}
                          >
                            {feature.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.backgroundBonus && (
                    <div style={{ marginBottom: "16px" }}>
                      <h5
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: isSelected ? "#047857" : theme.text,
                        }}
                      >
                        Background Bonus:
                      </h5>
                      <p
                        style={{
                          fontSize: "13px",
                          color: isSelected ? "#374151" : theme.textSecondary,
                          margin: "0",
                          lineHeight: "1.4",
                          fontStyle: "italic",
                        }}
                      >
                        {data.backgroundBonus}
                      </p>
                    </div>
                  )}

                  {data.typicalEquipment && (
                    <div style={{ marginBottom: "8px" }}>
                      <h5
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: isSelected ? "#047857" : theme.text,
                        }}
                      >
                        Typical Equipment:
                      </h5>
                      <p
                        style={{
                          fontSize: "13px",
                          color: isSelected ? "#374151" : theme.textSecondary,
                          margin: "0",
                          lineHeight: "1.4",
                        }}
                      >
                        {data.typicalEquipment}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={enhancedStyles.helpText}>
        Your background represents your character's life before attending magic
        school. It provides skill proficiencies, special features, and roleplay
        opportunities that help define who your character is beyond their
        magical abilities.
        {selectedBackground &&
          " Mechanical bonuses from your background are shown above and automatically applied."}
        {selectedBackground && (
          <span
            style={{
              display: "block",
              marginTop: "4px",
              fontStyle: "italic",
              color: theme.success,
            }}
          >
            Uncheck the selected background to see all available options again.
          </span>
        )}
      </div>
    </div>
  );
};

export default EnhancedBackgroundSelector;
