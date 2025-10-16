import { useState, useEffect, useRef, useMemo } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { backgroundsData } from "../../../../SharedData/backgroundsData";
import { createBackgroundStyles } from "../../../../styles/masterStyles";

const applyBackgroundProficiencies = (character, backgroundName) => {
  const updatedCharacter = { ...character };

  const oldBackgroundSkills = character.backgroundSkills || [];
  const currentSkillProficiencies = character.skillProficiencies || [];

  const skillsWithoutOldBackground = currentSkillProficiencies.filter(
    (skill) => !oldBackgroundSkills.includes(skill)
  );

  updatedCharacter.background = backgroundName;
  updatedCharacter.backgroundSkills = [];

  if (backgroundName && backgroundsData[backgroundName]) {
    const background = backgroundsData[backgroundName];

    if (background.skillProficiencies) {
      updatedCharacter.backgroundSkills = [...background.skillProficiencies];

      updatedCharacter.skillProficiencies = [
        ...new Set([
          ...skillsWithoutOldBackground,
          ...background.skillProficiencies,
        ]),
      ];
    } else {
      updatedCharacter.skillProficiencies = skillsWithoutOldBackground;
    }

    if (background.toolProficiencies) {
      const currentToolProficiencies = character.toolProficiencies || [];
      const oldBackgroundTools = character.backgroundTools || [];

      const toolsWithoutOldBackground = currentToolProficiencies.filter(
        (tool) => !oldBackgroundTools.includes(tool)
      );

      updatedCharacter.backgroundTools = [...background.toolProficiencies];
      updatedCharacter.toolProficiencies = [
        ...new Set([
          ...toolsWithoutOldBackground,
          ...background.toolProficiencies,
        ]),
      ];
    }
  } else {
    updatedCharacter.skillProficiencies = skillsWithoutOldBackground;
  }

  return updatedCharacter;
};

const BackgroundModifierPills = ({ selectedBackground, character, styles }) => {
  if (!selectedBackground || !backgroundsData[selectedBackground]) return null;

  const background = backgroundsData[selectedBackground];
  const modifiers = background.modifiers;

  if (
    !modifiers ||
    (!modifiers.abilityIncreases?.length &&
      !modifiers.other?.initiativeBonus &&
      !modifiers.other?.initiativeAbility)
  ) {
    return null;
  }

  return (
    <div style={styles.modifierPillsContainer}>
      <div style={styles.pillsLabel}>📋 Background Modifiers:</div>
      <div style={styles.pillsRow}>
        {modifiers.abilityIncreases?.map((increase, index) => (
          <div
            key={`ability-${index}`}
            style={styles.modifierPill}
            title={`${
              increase.ability.charAt(0).toUpperCase() +
              increase.ability.slice(1)
            } +${increase.amount}`}
          >
            <span style={styles.pillAbility}>
              {increase.ability.slice(0, 3).toUpperCase()}
            </span>
            <span style={styles.pillModifier}>+{increase.amount}</span>
          </div>
        ))}

        {modifiers.other?.initiativeBonus && (
          <div
            style={styles.initiativePill}
            title={`Initiative +${modifiers.other.initiativeBonus}`}
          >
            <span style={styles.pillAbility}>INIT</span>
            <span style={styles.pillModifier}>
              +{modifiers.other.initiativeBonus}
            </span>
          </div>
        )}

        {modifiers.other?.initiativeAbility && (
          <div
            style={styles.initiativePill}
            title={`Initiative ability: ${modifiers.other.initiativeAbility}`}
          >
            <span style={styles.pillAbility}>INIT</span>
            <span style={styles.pillModifier}>
              {modifiers.other.initiativeAbility.slice(0, 3).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const BackgroundFeatures = ({ background, character, styles }) => {
  const theme = useTheme();
  if (!background.features || background.features.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: "16px" }}>
      <h5
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "12px",
          margin: "0 0 12px 0",
        }}
      >
        Background Features:
      </h5>
      {background.features.map((feature, index) => (
        <div
          key={index}
          style={{
            marginBottom: "12px",
            padding: "12px",
            backgroundColor: theme.surface,
            borderRadius: "6px",
            border: theme.border,
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: theme.text,
              marginBottom: "6px",
            }}
          >
            {feature.name}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              lineHeight: "1.4",
            }}
          >
            {feature.description}
          </div>
        </div>
      ))}
    </div>
  );
};

const BackgroundSection = ({
  value,
  onChange,
  onCharacterUpdate,
  disabled = false,
  backgrounds: backgroundsList = [],
  character = {},
}) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);
  const [expandedBackgrounds, setExpandedBackgrounds] = useState(new Set());
  const backgroundRefs = useRef({});
  const [hasInitialized, setHasInitialized] = useState(false);

  const selectedBackground = value || "";

  const selectedBackgroundData = useMemo(() => {
    if (!selectedBackground) return null;
    return backgroundsData[selectedBackground] || null;
  }, [selectedBackground]);

  const hasValidBackground = selectedBackground && selectedBackgroundData;

  const availableBackgrounds = useMemo(() => {
    if (hasValidBackground) {
      return [];
    }

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

    const allBackgrounds = getAvailableBackgrounds();
    return allBackgrounds
      .filter((bg) => bg.name !== selectedBackground)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedBackground, backgroundsList]);

  useEffect(() => {
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

  const handleBackgroundToggle = (backgroundName) => {
    let updatedCharacter;

    if (selectedBackground === backgroundName) {
      updatedCharacter = applyBackgroundProficiencies(character, "");
      setExpandedBackgrounds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(backgroundName);
        return newSet;
      });
    } else {
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

  return (
    <div style={styles.container}>
      <div
        style={{
          maxHeight: "800px",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "4px",
        }}
      >
        {hasValidBackground && (
          <div style={styles.selectedElementsSection}>
            <div style={styles.selectedElementsHeader}>
              <h4 style={styles.selectedElementsTitle}>Selected Background:</h4>
            </div>

            <BackgroundModifierPills
              selectedBackground={selectedBackground}
              character={character}
              styles={styles}
            />

            <div style={styles.selectedElementCard}>
              <div style={styles.featHeader}>
                <label style={styles.featLabelClickable}>
                  <input
                    type="checkbox"
                    name="background"
                    checked={true}
                    onChange={() => handleBackgroundToggle(selectedBackground)}
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
                    {selectedBackgroundData.name}
                    {selectedBackgroundData.skillProficiencies && (
                      <span style={styles.availableChoicesIndicator}>
                        ({selectedBackgroundData.skillProficiencies.length}{" "}
                        skill
                        {selectedBackgroundData.skillProficiencies.length > 1
                          ? "s"
                          : ""}
                        )
                      </span>
                    )}
                  </span>
                </label>
              </div>

              <div style={styles.featPreviewSelected}>
                {selectedBackgroundData.preview ||
                  selectedBackgroundData.description}
              </div>

              <div style={styles.featDescriptionSelected}>
                <div style={{ marginBottom: "16px" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      margin: "0 0 16px 0",
                    }}
                  >
                    {selectedBackgroundData.description}
                  </p>
                </div>

                {selectedBackgroundData.skillProficiencies && (
                  <div style={{ marginBottom: "16px" }}>
                    <h5
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "8px",
                        margin: "0 0 8px 0",
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
                      {selectedBackgroundData.skillProficiencies.map(
                        (skill, index) => (
                          <span
                            key={index}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#10b981",
                              color: "white",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: "600",
                            }}
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                <BackgroundFeatures
                  background={selectedBackgroundData}
                  character={character}
                  styles={styles}
                />
              </div>
            </div>
          </div>
        )}

        {!hasValidBackground && (
          <div style={styles.availableElementsSection}>
            <div style={styles.availableElementsContainer}>
              {availableBackgrounds.map(({ name, data }) => {
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
                    style={styles.featCard}
                  >
                    <div style={styles.featHeader}>
                      <label style={styles.featLabelClickable}>
                        <input
                          type="checkbox"
                          name="background"
                          checked={false}
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
                        <span style={styles.featName}>
                          {data.name}
                          {data.skillProficiencies && (
                            <span style={styles.availableChoicesIndicator}>
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
                      {!hasValidBackground && (
                        <button
                          onClick={() => toggleBackgroundExpansion(name)}
                          style={styles.expandButton}
                          type="button"
                          disabled={disabled}
                        >
                          {isExpanded ? "▲" : "▼"}
                        </button>
                      )}
                    </div>

                    <div style={styles.featPreview}>
                      {data.preview || data.description}
                    </div>

                    {isExpanded && (
                      <div style={styles.featDescription}>
                        <div style={{ marginBottom: "16px" }}>
                          <p
                            style={{
                              fontSize: "14px",
                              lineHeight: "1.5",
                              color: theme.text,
                              margin: "0 0 12px 0",
                            }}
                          >
                            {data.description}
                          </p>
                        </div>

                        {data.skillProficiencies && (
                          <div style={{ marginBottom: "12px" }}>
                            <strong
                              style={{ fontSize: "12px", color: theme.primary }}
                            >
                              Skills:
                            </strong>
                            <span
                              style={{ fontSize: "12px", marginLeft: "6px" }}
                            >
                              {data.skillProficiencies.join(", ")}
                            </span>
                          </div>
                        )}

                        {hasModifiers && (
                          <div style={{ marginBottom: "12px" }}>
                            <strong
                              style={{ fontSize: "12px", color: theme.primary }}
                            >
                              Modifiers:
                            </strong>
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                              {data.modifiers.abilityIncreases?.map(
                                (inc, idx) => (
                                  <div key={idx}>
                                    •{" "}
                                    {inc.ability.charAt(0).toUpperCase() +
                                      inc.ability.slice(1)}{" "}
                                    +{inc.amount}
                                  </div>
                                )
                              )}
                              {data.modifiers.other?.initiativeBonus && (
                                <div>
                                  • Initiative +
                                  {data.modifiers.other.initiativeBonus}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {data.features && data.features.length > 0 && (
                          <div>
                            <strong
                              style={{ fontSize: "12px", color: theme.primary }}
                            >
                              Features:
                            </strong>
                            {data.features.slice(0, 2).map((feature, idx) => (
                              <div key={idx} style={{ marginTop: "6px" }}>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {feature.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: theme.textSecondary,
                                    lineHeight: "1.3",
                                  }}
                                >
                                  {feature.description.substring(0, 100)}
                                  {feature.description.length > 100
                                    ? "..."
                                    : ""}
                                </div>
                              </div>
                            ))}
                            {data.features.length > 2 && (
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: theme.textSecondary,
                                  fontStyle: "italic",
                                  marginTop: "4px",
                                }}
                              >
                                +{data.features.length - 2} more feature
                                {data.features.length > 3 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedBackground && !selectedBackgroundData && (
          <div
            style={{
              padding: "16px",
              backgroundColor: `${theme.error}20`,
              border: `2px solid ${theme.error}`,
              borderRadius: "8px",
              marginBottom: "16px",
              color: theme.error,
              textAlign: "center",
            }}
          >
            <strong>Invalid Background: "{selectedBackground}"</strong>
            <br />
            <span style={{ fontSize: "14px" }}>
              This background is not recognized. Please select a valid
              background from the list below.
            </span>
            <button
              onClick={() => handleBackgroundToggle(selectedBackground)}
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                backgroundColor: theme.error,
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Clear Invalid Background
            </button>
          </div>
        )}

        <div style={styles.helpText}>
          {hasValidBackground
            ? "Your background provides skill proficiencies and special features that reflect your character's life before adventuring."
            : "Choose a background that represents your character's life before adventuring. Each background provides skill proficiencies and special features."}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSection;
