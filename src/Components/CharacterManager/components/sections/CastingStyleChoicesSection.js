import { useTheme } from "../../../../contexts/ThemeContext";
import { createBackgroundStyles } from "../../../../styles/masterStyles";
import { BLACK_MAGIC_PROGRESSION } from "../../../../SharedData/data";

const CastingStyleChoicesSection = ({ character, setCharacter }) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);

  const level = character?.level || 1;
  const castingStyle = character?.castingStyle || "";

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
      case "Technique Caster":
      case "Intellect Caster":
      case "Vigor Caster":
        return [];
      default:
        return [];
    }
  };

  const features = getCastingStyleFeatures();

  const handleChoiceChange = (choiceKey, selectedChoice) => {
    const currentChoices = character.castingStyleChoices || {};
    const updatedChoices = {
      ...currentChoices,
      [choiceKey]: selectedChoice,
    };
    setCharacter("castingStyleChoices", updatedChoices);
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
                    {character.castingStyleChoices?.[feature.choiceKey]
                      ? `Selected: ${
                          character.castingStyleChoices[feature.choiceKey]
                        }`
                      : "Choose one option:"}
                  </div>

                  {feature.choices.map((choice, choiceIndex) => {
                    const currentChoice =
                      character.castingStyleChoices?.[feature.choiceKey];
                    const isSelected = currentChoice === choice.name;

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
                          handleChoiceChange(feature.choiceKey, choice.name)
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
