import { useTheme } from "../../../../contexts/ThemeContext";
import { createBackgroundStyles } from "../../../../styles/masterStyles";
import { BLACK_MAGIC_PROGRESSION } from "../../../../SharedData/data";

const CastingStyleChoicesSection = ({ character, setCharacter }) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);

  const level = character?.level || 1;
  const castingStyle = character?.castingStyle || "";

  const renderIntellectCasterFeatures = () => {
    const features = [];

    if (level >= 1) {
      features.push({
        name: "Initiative Ability",
        level: 1,
        description:
          "As an Intellect Caster, you may choose to use Intelligence or Dexterity for initiative rolls.",
        isChoice: true,
        choiceType: "initiativeAbility",
        choices: [
          {
            name: "Dexterity",
            value: "dexterity",
            description:
              "Use your Dexterity modifier for initiative rolls (traditional method).",
          },
          {
            name: "Intelligence",
            value: "intelligence",
            description:
              "Use your Intelligence modifier for initiative rolls (tactical advantage).",
          },
        ],
      });
    }

    return features;
  };

  const renderWillpowerCasterFeatures = () => {
    const features = [];

    if (level >= 1) {
      const blackMagicDamage = BLACK_MAGIC_PROGRESSION[level] || "1d6";
      features.push({
        name: "Black Magic",
        level: 1,
        description: `Once per turn, you can deal an extra ${blackMagicDamage} damage to one creature you hit with a cantrip if you have advantage on the attack roll. You don't need advantage if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll.`,
        automatic: true,
      });
    }

    if (level >= 3) {
      features.push({
        name: "Metamagic: Fierce Spell",
        level: 3,
        description:
          "When you cast a spell, you can spend 2 sorcery points to cast that spell as if it were cast using a spell slot one level higher than its original level, or 4 sorcery points to cast that spell two levels higher. The spell's higher level cannot exceed your highest available level of spell slots. This does not count against your number of Metamagic options.",
        automatic: true,
      });

      features.push({
        name: "Metamagic: Resistant Spell",
        level: 3,
        description:
          "When you cast a spell, you can spend 1 sorcery point per increased level to make your spell be treated by spell deflection, finite incantatem, reparifarge, or langlock as if your spell was cast using a spell slot higher than its original level, making your spell more resistant. The spell's higher level cannot exceed your highest available level of spell slots. This does not count against your number of Metamagic options.",
        automatic: true,
      });
    }

    if (level >= 5) {
      const blackMagicChoices = [
        {
          name: "Ambush",
          description:
            "You have advantage on attack rolls against any creature that hasn't taken a turn in the combat yet. In addition, any hit you score against a creature that is surprised is a critical hit.",
        },
        {
          name: "Gambit",
          description:
            "You don't need advantage on the attack roll to use your Black Magic against a creature if you are within 5 feet of it, no other creatures are within 5 feet of you, and you don't have disadvantage on the attack roll.",
        },
        {
          name: "Grudge",
          description:
            "You gain advantage on attack rolls against a creature that has damaged you since the end of your last turn.",
        },
        {
          name: "Pique",
          description:
            "You have advantage on attack rolls when you have half of your hit points or less.",
        },
        {
          name: "Hubris",
          description:
            "You gain advantage on attack rolls against any creature that has fewer hit points than you.",
        },
      ];

      features.push({
        name: "Black Magic Specialization",
        level: 5,
        description:
          "At 5th level, you may choose one of the following options to enhance your Black Magic:",
        isChoice: true,
        choices: blackMagicChoices,
        choiceKey: "blackMagicSpecialization",
      });
    }

    return features;
  };

  const getCastingStyleFeatures = () => {
    switch (castingStyle) {
      case "Willpower Caster":
        return renderWillpowerCasterFeatures();
      case "Intellect Caster":
        return renderIntellectCasterFeatures();
      case "Technique Caster":
      case "Vigor Caster":
        return [];
      default:
        return [];
    }
  };

  const features = getCastingStyleFeatures();

  const handleChoiceChange = (choiceKey, selectedChoice, choiceType) => {
    // Handle initiative ability as a direct character field
    if (choiceType === "initiativeAbility") {
      setCharacter("initiativeAbility", selectedChoice);
    } else {
      // Handle casting style choices
      const currentChoices = character.castingStyleChoices || {};
      const updatedChoices = {
        ...currentChoices,
        [choiceKey]: selectedChoice,
      };
      setCharacter("castingStyleChoices", updatedChoices);
    }
  };

  if (!castingStyle) {
    return (
      <div style={styles.section}>
        <div style={styles.content}>
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: theme.textSecondary,
              fontStyle: "italic",
            }}
          >
            Select a casting style to see available features and choices.
          </div>
        </div>
      </div>
    );
  }

  if (features.length === 0) {
    return (
      <div style={styles.section}>
        <div style={styles.content}>
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: theme.textSecondary,
              fontStyle: "italic",
            }}
          >
            No casting style features available at level {level} for{" "}
            {castingStyle}.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.section}>
      <div style={styles.content}>
        <div style={{ padding: "20px" }}>
          <h3
            style={{
              color: theme.text,
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            {castingStyle} Features (Level {level})
          </h3>

          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                padding: "16px",
                backgroundColor: theme.background,
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <h4
                  style={{
                    color: theme.text,
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {feature.name}
                </h4>
                <span
                  style={{
                    color: theme.textSecondary,
                    fontSize: "12px",
                    fontWeight: "500",
                    backgroundColor: theme.surface,
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  Level {feature.level}
                </span>
              </div>

              <p
                style={{
                  color: theme.textSecondary,
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {feature.description}
              </p>

              {feature.automatic && (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: theme.success,
                    fontStyle: "italic",
                  }}
                >
                  ✓ Automatically available
                </div>
              )}

              {feature.isChoice && feature.choices && (
                <div style={{ marginTop: "16px" }}>
                  <div
                    style={{
                      marginBottom: "12px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: theme.text,
                    }}
                  >
                    {feature.choiceType === "initiativeAbility"
                      ? character.initiativeAbility
                        ? `Selected: ${
                            character.initiativeAbility
                              .charAt(0)
                              .toUpperCase() +
                            character.initiativeAbility.slice(1)
                          }`
                        : "Choose one option:"
                      : character.castingStyleChoices?.[feature.choiceKey]
                      ? `Selected: ${
                          character.castingStyleChoices[feature.choiceKey]
                        }`
                      : "Choose one option:"}
                  </div>

                  {/* Show ability score comparison for initiative ability */}
                  {feature.choiceType === "initiativeAbility" &&
                    character.abilityScores &&
                    character.abilityScores.dexterity &&
                    character.abilityScores.intelligence && (
                      <div
                        style={{
                          marginBottom: "12px",
                          padding: "8px 12px",
                          backgroundColor: `${theme.primary}10`,
                          border: `1px solid ${theme.primary}`,
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontStyle: "italic",
                          color: theme.primary,
                        }}
                      >
                        {Math.floor(
                          (character.abilityScores.intelligence - 10) / 2
                        ) >
                        Math.floor((character.abilityScores.dexterity - 10) / 2)
                          ? "💡 Intelligence gives a higher modifier"
                          : Math.floor(
                              (character.abilityScores.dexterity - 10) / 2
                            ) >
                            Math.floor(
                              (character.abilityScores.intelligence - 10) / 2
                            )
                          ? "⚡ Dexterity gives a higher modifier"
                          : "⚖️ Both abilities give the same modifier"}
                      </div>
                    )}

                  {feature.choices.map((choice, choiceIndex) => {
                    // Determine which value to check for selection
                    const currentChoice =
                      feature.choiceType === "initiativeAbility"
                        ? character.initiativeAbility
                        : character.castingStyleChoices?.[feature.choiceKey];

                    const isSelected =
                      feature.choiceType === "initiativeAbility"
                        ? currentChoice === choice.value
                        : currentChoice === choice.name;

                    return (
                      <div
                        key={choiceIndex}
                        style={{
                          marginBottom: "8px",
                          padding: "12px",
                          backgroundColor: isSelected
                            ? `${theme.primary}20`
                            : theme.surface,
                          border: `1px solid ${
                            isSelected ? theme.primary : theme.border
                          }`,
                          borderRadius: "6px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onClick={() =>
                          handleChoiceChange(
                            feature.choiceKey,
                            choice.value || choice.name,
                            feature.choiceType
                          )
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "4px",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              border: `2px solid ${
                                isSelected ? theme.primary : theme.border
                              }`,
                              backgroundColor: isSelected
                                ? theme.primary
                                : "transparent",
                              marginRight: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {isSelected && (
                              <div
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  backgroundColor: "white",
                                }}
                              />
                            )}
                          </div>
                          <span
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              color: isSelected ? theme.primary : theme.text,
                            }}
                          >
                            {choice.name}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: "0 0 0 24px",
                            fontSize: "13px",
                            color: theme.textSecondary,
                            lineHeight: "1.4",
                          }}
                        >
                          {choice.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CastingStyleChoicesSection;
