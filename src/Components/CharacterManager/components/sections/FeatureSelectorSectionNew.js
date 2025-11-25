import { useState, useMemo } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createBackgroundStyles } from "../../../../styles/masterStyles";
import { useFeats } from "../../../../hooks/useFeats";
import {
  innateHeritages,
  heritageDescriptions,
} from "../../../../SharedData/heritageData";
import { houseFeatures } from "../../../../SharedData/houseData";

const FeatureSelectorSection = ({
  character,
  setCharacter,
  characterLevel = 1,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);
  const { feats: standardFeats } = useFeats();

  const [heritageExpanded, setHeritageExpanded] = useState(true);
  const [featsExpanded, setFeatsExpanded] = useState(true);
  const [asiExpanded, setAsiExpanded] = useState(true);
  const [featFilter, setFeatFilter] = useState("");
  const [selectingFeat, setSelectingFeat] = useState(null);
  const [featChoices, setFeatChoices] = useState({});

  const selectedFeats = character.standardFeats || [];
  const selectedHeritage = character.innateHeritage || null;
  const featChoicesData = character.featChoices || {};

  const ASI_LEVELS = [4, 8, 12, 16, 19];
  const availableASILevels = ASI_LEVELS.filter(
    (level) => level <= characterLevel
  );

  const getRequiredChoices = (feat) => {
    if (!feat || !feat.benefits) return [];

    const choices = [];

    if (
      feat.benefits.specialAbilities &&
      Array.isArray(feat.benefits.specialAbilities)
    ) {
      feat.benefits.specialAbilities.forEach((ability, index) => {
        if (ability && ability.type === "choice" && ability.options) {
          choices.push({
            type: "special",
            label: ability.name || "Choose Option",
            options: ability.options,
            id: `${feat.name}_special_${index}`,
          });
        }
      });
    }

    if (feat.benefits.abilityScoreIncrease) {
      const increase = feat.benefits.abilityScoreIncrease;
      if (increase.type === "choice" && increase.abilities) {
        choices.push({
          type: "ability",
          label: "Ability Score",
          options: increase.abilities.map(
            (a) => a.charAt(0).toUpperCase() + a.slice(1)
          ),
          id: `${feat.name}_ability_0`,
        });
      }
    }

    return choices;
  };

  const initiateFeatSelection = (feat) => {
    const requiredChoices = getRequiredChoices(feat);

    if (requiredChoices.length > 0) {
      setSelectingFeat(feat);
      setFeatChoices({});
    } else {
      addFeat(feat.name);
    }
  };

  const confirmFeatSelection = () => {
    if (!selectingFeat) return;

    const newFeats = [...selectedFeats, selectingFeat.name];
    const newFeatChoices = { ...featChoicesData, ...featChoices };

    setCharacter({
      ...character,
      standardFeats: newFeats,
      featChoices: newFeatChoices,
    });

    setSelectingFeat(null);
    setFeatChoices({});
  };

  const addFeat = (featName) => {
    const feat = standardFeats.find((f) => f.name === featName);
    const requiredChoices = getRequiredChoices(feat);

    if (requiredChoices.length > 0) {
      initiateFeatSelection(feat);
    } else {
      const newFeats = [...selectedFeats, featName];
      setCharacter({ ...character, standardFeats: newFeats });
    }
  };

  const removeFeat = (featName, index = 0) => {
    const newFeats = [...selectedFeats];
    const indices = newFeats
      .map((name, i) => (name === featName ? i : -1))
      .filter((i) => i !== -1);

    if (indices[index] !== undefined) {
      newFeats.splice(indices[index], 1);
      setCharacter({ ...character, standardFeats: newFeats });
    }
  };

  const getFeatCount = (featName) => {
    return selectedFeats.filter((f) => f === featName).length;
  };

  const isFeatSelected = (featName) => {
    return selectedFeats.includes(featName);
  };

  const canSelectFeat = (feat) => {
    if (feat.repeatable) return true;
    return !isFeatSelected(feat.name);
  };

  const selectedFeatsSummary = useMemo(() => {
    const summary = [];
    const featIndices = {};

    selectedFeats.forEach((featName, globalIndex) => {
      if (!featIndices[featName]) {
        featIndices[featName] = [];
      }
      const instanceIndex = featIndices[featName].length;
      featIndices[featName].push(globalIndex);

      const feat = standardFeats.find((f) => f.name === featName);
      const requiredChoices = getRequiredChoices(feat);

      const choiceDetails = requiredChoices
        .map((choice) => {
          const choiceKey = feat?.repeatable
            ? `${choice.id}_${instanceIndex}`
            : choice.id;

          const value =
            featChoicesData[choiceKey] || featChoicesData[choice.id];
          return value ? { label: choice.label, value } : null;
        })
        .filter(Boolean);

      summary.push({
        name: featName,
        feat,
        instanceIndex,
        globalIndex,
        choiceDetails,
      });
    });

    return summary;
  }, [selectedFeats, featChoicesData]);

  const selectionsSummary = useMemo(() => {
    const summary = [];
    const additionalFeats = [];

    const houseGrantsFeat =
      character.house && houseFeatures[character.house]?.feat;

    let featIndex = houseGrantsFeat ? 1 : 0;

    if (selectedHeritage) {
      summary.push({
        level: 1,
        type: "Innate Heritage",
        choice: selectedHeritage,
        icon: "🧬",
      });
    }

    if (houseGrantsFeat && selectedFeats.length > 0) {
      summary.push({
        level: 1,
        type: "House Bonus Feat",
        choice: selectedFeats[0],
        icon: "🎁",
      });
    }

    if (selectedFeats.length > featIndex) {
      summary.push({
        level: 1,
        type: "Feat",
        choice: selectedFeats[featIndex],
        icon: "🏆",
      });
      featIndex++;
    }

    const asiLevels = [4, 8, 12, 16, 19];

    asiLevels.forEach((level) => {
      if (level <= characterLevel || featIndex < selectedFeats.length) {
        const asiChoice = character.asiChoices?.[level];

        if (asiChoice) {
          if (asiChoice.type === "feat" && asiChoice.selectedFeat) {
            summary.push({
              level,
              type: "Feat (ASI Choice)",
              choice: asiChoice.selectedFeat,
              icon: "🏆",
            });
          } else if (
            asiChoice.type === "asi" &&
            asiChoice.abilityScoreIncreases
          ) {
            const increases = asiChoice.abilityScoreIncreases
              .map(
                (inc) =>
                  `+1 ${
                    inc.ability.charAt(0).toUpperCase() + inc.ability.slice(1)
                  }`
              )
              .join(", ");
            summary.push({
              level,
              type: "ASI",
              choice: increases,
              icon: "📈",
            });
          }
        } else if (selectedFeats[featIndex]) {
          if (level > characterLevel) {
            additionalFeats.push({
              choice: selectedFeats[featIndex],
              icon: "🏆",
            });
          } else {
            summary.push({
              level,
              type: "Feat",
              choice: selectedFeats[featIndex],
              icon: "🏆",
            });
          }
          featIndex++;
        }
      }
    });

    while (featIndex < selectedFeats.length) {
      additionalFeats.push({
        choice: selectedFeats[featIndex],
        icon: "🏆",
      });
      featIndex++;
    }

    return { summary, additionalFeats };
  }, [
    selectedHeritage,
    selectedFeats,
    character.asiChoices,
    character.house,
    characterLevel,
  ]);

  const filteredFeats = useMemo(() => {
    if (!featFilter.trim()) return standardFeats;

    const searchTerm = featFilter.toLowerCase();
    return standardFeats.filter((feat) => {
      const nameMatch = feat.name.toLowerCase().includes(searchTerm);
      const previewMatch = feat.preview?.toLowerCase().includes(searchTerm);
      const descText = Array.isArray(feat.description)
        ? feat.description.join(" ").toLowerCase()
        : (feat.description || "").toLowerCase();
      const descMatch = descText.includes(searchTerm);

      return nameMatch || previewMatch || descMatch;
    });
  }, [featFilter]);

  const toggleHeritage = (heritageName) => {
    if (selectedHeritage === heritageName) {
      setCharacter({ ...character, innateHeritage: null });
    } else {
      setCharacter({ ...character, innateHeritage: heritageName });
    }
  };

  const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    cursor: "pointer",
    backgroundColor: theme.background,
    borderRadius: "12px",
    border: `2px solid ${theme.border}`,
    marginBottom: "12px",
    transition: "all 0.2s ease",
  };

  const sectionTitleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "18px",
    fontWeight: "600",
    color: theme.text,
    margin: 0,
  };

  const featureCardStyle = {
    padding: "16px",
    backgroundColor: theme.background,
    borderRadius: "8px",
    border: `1px solid ${theme.border}`,
    transition: "all 0.2s ease",
  };

  const selectedCardStyle = {
    ...featureCardStyle,
    border: `2px solid ${theme.primary}`,
    backgroundColor: `${theme.primary}10`,
  };

  return (
    <div style={styles.fieldContainer}>
      {(selectionsSummary.summary.length > 0 ||
        selectionsSummary.additionalFeats.length > 0) && (
        <div style={{ marginBottom: "32px" }}>
          <div style={sectionHeaderStyle}>
            <h3 style={sectionTitleStyle}>
              <span style={{ fontSize: "20px" }}>📋</span>
              Your Selections Summary
            </h3>
          </div>

          <div
            style={{
              marginTop: "12px",
              padding: "16px",
              backgroundColor: theme.background,
              borderRadius: "8px",
              border: `2px solid ${theme.border}`,
            }}
          >
            {selectionsSummary.summary.length > 0 && (
              <div
                style={{
                  marginBottom:
                    selectionsSummary.additionalFeats.length > 0 ? "16px" : "0",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: theme.textSecondary,
                    marginBottom: "12px",
                    fontWeight: "600",
                  }}
                >
                  Level-Based Selections:
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {selectionsSummary.summary.map((selection, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 12px",
                        backgroundColor: theme.surface,
                        borderRadius: "6px",
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "18px",
                          marginRight: "10px",
                        }}
                      >
                        {selection.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "11px",
                            color: theme.textSecondary,
                            marginBottom: "2px",
                          }}
                        >
                          Level {selection.level} • {selection.type}
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            color: theme.text,
                            fontWeight: "600",
                          }}
                        >
                          {selection.choice}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectionsSummary.additionalFeats.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: theme.textSecondary,
                    marginBottom: "12px",
                    fontWeight: "600",
                    paddingTop:
                      selectionsSummary.summary.length > 0 ? "16px" : "0",
                    borderTop:
                      selectionsSummary.summary.length > 0
                        ? `1px solid ${theme.border}`
                        : "none",
                  }}
                >
                  Additional Feats (not yet assigned to a level):
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {selectionsSummary.additionalFeats.map((feat, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 12px",
                        backgroundColor: theme.surface,
                        borderRadius: "6px",
                        border: `1px dashed ${theme.border}`,
                        opacity: 0.8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "18px",
                          marginRight: "10px",
                        }}
                      >
                        {feat.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "11px",
                            color: theme.textSecondary,
                            marginBottom: "2px",
                          }}
                        >
                          Extra Feat
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            color: theme.text,
                            fontWeight: "600",
                          }}
                        >
                          {feat.choice}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: "12px",
                    padding: "8px 12px",
                    backgroundColor: `${theme.warning}15`,
                    border: `1px solid ${theme.warning}`,
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: theme.textSecondary,
                  }}
                >
                  <strong>ℹ️ Note:</strong> These feats will be assigned to
                  levels 4, 8, 12, 16, or 19 when you reach those levels and
                  haven't selected an ASI increase.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ marginBottom: "32px" }}>
        <div
          style={sectionHeaderStyle}
          onClick={() => setHeritageExpanded(!heritageExpanded)}
        >
          <h3 style={sectionTitleStyle}>
            <span style={{ fontSize: "20px" }}>🧬</span>
            Innate Heritage {selectedHeritage ? "(1 selected)" : "(optional)"}
          </h3>
          <span style={{ fontSize: "20px", color: theme.text }}>
            {heritageExpanded ? "▲" : "▼"}
          </span>
        </div>

        {heritageExpanded && (
          <div style={{ marginTop: "12px" }}>
            <div style={styles.helpText}>
              Select an innate heritage for your character. This is optional.
            </div>

            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                backgroundColor: `${theme.primary}15`,
                border: `1px solid ${theme.primary}`,
                borderRadius: "6px",
                fontSize: "13px",
                color: theme.text,
              }}
            >
              <strong>📝 Note:</strong> Innate Heritage can only be taken at{" "}
              <strong>Level 1</strong> instead of a feat.
            </div>

            {selectedHeritage && (
              <div style={styles.completionMessage}>
                ✓ Selected: {selectedHeritage}
              </div>
            )}

            <div
              style={{
                marginTop: "16px",
                maxHeight: "600px",
                overflowY: "auto",
                paddingRight: "8px",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
              }}
            >
              {innateHeritages.map((heritage) => {
                const isSelected = selectedHeritage === heritage;
                const heritageData = heritageDescriptions[heritage];

                return (
                  <div
                    key={heritage}
                    style={isSelected ? selectedCardStyle : featureCardStyle}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        cursor: disabled ? "not-allowed" : "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => !disabled && toggleHeritage(heritage)}
                        disabled={disabled}
                        style={{
                          marginRight: "12px",
                          marginTop: "4px",
                          width: "18px",
                          height: "18px",
                          accentColor: theme.primary,
                          cursor: disabled ? "not-allowed" : "pointer",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <strong
                            style={{
                              color: isSelected ? theme.primary : theme.text,
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            {heritage}
                          </strong>
                          {isSelected && (
                            <span
                              style={{
                                backgroundColor: theme.success,
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: "600",
                              }}
                            >
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                    </label>

                    {heritageData && (
                      <div
                        style={{
                          marginTop: "12px",
                          paddingTop: "12px",
                          borderTop: `1px solid ${theme.border}`,
                        }}
                      >
                        <div style={{ marginBottom: "16px" }}>
                          <p
                            style={{
                              color: theme.text,
                              fontSize: "14px",
                              lineHeight: "1.5",
                              marginBottom: "12px",
                            }}
                          >
                            {heritageData.description}
                          </p>
                        </div>

                        {heritageData.benefits &&
                          heritageData.benefits.length > 0 && (
                            <div>
                              <strong
                                style={{
                                  fontSize: "12px",
                                  color: theme.primary,
                                }}
                              >
                                Benefits:
                              </strong>
                              <div
                                style={{
                                  fontSize: "12px",
                                  marginTop: "8px",
                                  lineHeight: "1.4",
                                }}
                              >
                                {heritageData.benefits.map((benefit, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      color: theme.text,
                                      marginBottom: "8px",
                                      padding: "4px 0",
                                    }}
                                  >
                                    <strong>•</strong> {benefit}
                                  </div>
                                ))}
                              </div>
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
      </div>

      <div style={{ marginBottom: "32px" }}>
        <div
          style={sectionHeaderStyle}
          onClick={() => setFeatsExpanded(!featsExpanded)}
        >
          <h3 style={sectionTitleStyle}>
            <span style={{ fontSize: "20px" }}>🏆</span>
            Feats ({selectedFeats.length} selected)
          </h3>
          <span style={{ fontSize: "20px", color: theme.text }}>
            {featsExpanded ? "▲" : "▼"}
          </span>
        </div>

        {featsExpanded && (
          <div style={{ marginTop: "12px" }}>
            <div style={styles.helpText}>
              Select feats to enhance your character's abilities. Some feats can
              be selected multiple times.
            </div>

            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                backgroundColor: `${theme.primary}15`,
                border: `1px solid ${theme.primary}`,
                borderRadius: "6px",
                fontSize: "13px",
                color: theme.text,
              }}
            >
              <strong>📝 Note:</strong> Feats can be taken at{" "}
              <strong>Levels 1, 4, 8, 12, 16, and 19</strong>.
            </div>

            {selectedFeatsSummary.length > 0 && (
              <div
                style={{
                  marginTop: "16px",
                  marginBottom: "16px",
                  padding: "16px",
                  backgroundColor: `${theme.success}10`,
                  border: `2px solid ${theme.success}`,
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: theme.success,
                    marginBottom: "12px",
                  }}
                >
                  ✓ Selected Feats:
                </div>
                {selectedFeatsSummary.map(
                  ({
                    name,
                    feat,
                    instanceIndex,
                    globalIndex,
                    choiceDetails,
                  }) => (
                    <div
                      key={`${name}_${globalIndex}`}
                      style={selectedCardStyle}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <strong
                            style={{
                              color: theme.text,
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                          >
                            {name}
                          </strong>
                          {choiceDetails.length > 0 && (
                            <span
                              style={{
                                color: theme.textSecondary,
                                fontSize: "13px",
                                marginLeft: "8px",
                              }}
                            >
                              ({choiceDetails.map((d) => d.value).join(", ")})
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            !disabled && removeFeat(name, instanceIndex)
                          }
                          disabled={disabled}
                          style={{
                            padding: "6px 16px",
                            fontSize: "12px",
                            fontWeight: "600",
                            backgroundColor: theme.error || "#d32f2f",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: disabled ? "not-allowed" : "pointer",
                            opacity: disabled ? 0.5 : 1,
                            transition: "all 0.2s ease",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: theme.text,
                marginBottom: "12px",
                marginTop: "24px",
              }}
            >
              Available Feats:
            </div>

            <div style={{ position: "relative", marginBottom: "16px" }}>
              <input
                type="text"
                placeholder="Search feats..."
                value={featFilter}
                onChange={(e) => setFeatFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 16px",
                  fontSize: "14px",
                  border: `2px solid ${theme.border}`,
                  borderRadius: "8px",
                  backgroundColor: theme.surface,
                  color: theme.text,
                  outline: "none",
                }}
              />
              {featFilter && (
                <button
                  onClick={() => setFeatFilter("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    color: theme.textSecondary,
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              )}
            </div>

            <div
              style={{
                maxHeight: "600px",
                overflowY: "auto",
                paddingRight: "8px",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
              }}
            >
              {filteredFeats.map((feat) => {
                const isSelected = isFeatSelected(feat.name);
                const canSelect = canSelectFeat(feat);
                const count = getFeatCount(feat.name);

                return (
                  <div
                    key={feat.name}
                    style={isSelected ? selectedCardStyle : featureCardStyle}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          flex: 1,
                          cursor:
                            disabled || !canSelect ? "not-allowed" : "pointer",
                          opacity: canSelect ? 1 : 0.6,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={false}
                          onChange={() =>
                            !disabled && canSelect && addFeat(feat.name)
                          }
                          disabled={disabled || !canSelect}
                          style={{
                            marginRight: "12px",
                            marginTop: "4px",
                            width: "18px",
                            height: "18px",
                            accentColor: theme.primary,
                            cursor:
                              disabled || !canSelect
                                ? "not-allowed"
                                : "pointer",
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "4px",
                            }}
                          >
                            <strong
                              style={{ color: theme.text, fontSize: "16px" }}
                            >
                              {feat.name}
                            </strong>
                            {feat.repeatable && (
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: theme.textSecondary,
                                  fontStyle: "italic",
                                }}
                              >
                                (Repeatable)
                              </span>
                            )}
                            {!canSelect && (
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: theme.textSecondary,
                                  fontStyle: "italic",
                                  fontWeight: "600",
                                }}
                              >
                                (Already Selected)
                              </span>
                            )}
                          </div>
                          <p
                            style={{
                              color: theme.textSecondary,
                              fontSize: "13px",
                              marginTop: "4px",
                              marginBottom: 0,
                            }}
                          >
                            {feat.preview}
                          </p>
                        </div>
                      </label>
                    </div>

                    <div
                      style={{
                        marginTop: "12px",
                        paddingTop: "12px",
                        borderTop: `1px solid ${theme.border}`,
                      }}
                    >
                      <div style={{ marginBottom: "16px" }}>
                        {Array.isArray(feat.description) ? (
                          feat.description.map((desc, idx) => (
                            <p
                              key={idx}
                              style={{
                                color: theme.text,
                                fontSize: "14px",
                                lineHeight: "1.5",
                                marginBottom: "12px",
                              }}
                            >
                              {desc}
                            </p>
                          ))
                        ) : (
                          <p
                            style={{
                              color: theme.text,
                              fontSize: "14px",
                              lineHeight: "1.5",
                              marginBottom: "12px",
                            }}
                          >
                            {feat.description}
                          </p>
                        )}
                      </div>

                      {feat.benefits && (
                        <div>
                          <strong
                            style={{ fontSize: "12px", color: theme.primary }}
                          >
                            Benefits:
                          </strong>
                          <div
                            style={{
                              fontSize: "12px",
                              marginTop: "8px",
                              lineHeight: "1.4",
                            }}
                          >
                            {feat.benefits.abilityScoreIncrease && (
                              <div
                                style={{
                                  color: "#8b5cf6",
                                  marginBottom: "8px",
                                  padding: "4px 0",
                                }}
                              >
                                <strong>• Ability Score Increase:</strong> +
                                {feat.benefits.abilityScoreIncrease.amount || 1}{" "}
                                {feat.benefits.abilityScoreIncrease.type ===
                                  "choice" ||
                                feat.benefits.abilityScoreIncrease.type ===
                                  "choice_any"
                                  ? `to ${feat.benefits.abilityScoreIncrease.abilities
                                      ?.map(
                                        (a) =>
                                          a.charAt(0).toUpperCase() + a.slice(1)
                                      )
                                      .join(" or ")}`
                                  : feat.benefits.abilityScoreIncrease.type ===
                                    "spellcasting_ability"
                                  ? "to Spellcasting Ability"
                                  : `${
                                      feat.benefits.abilityScoreIncrease.ability
                                        ?.charAt(0)
                                        .toUpperCase() +
                                        feat.benefits.abilityScoreIncrease.ability?.slice(
                                          1
                                        ) || ""
                                    }`}
                              </div>
                            )}

                            {feat.benefits.skillProficiencies?.length > 0 && (
                              <div
                                style={{
                                  color: "#10b981",
                                  marginBottom: "8px",
                                  padding: "4px 0",
                                }}
                              >
                                <strong>• Skill Proficiencies:</strong>{" "}
                                {feat.benefits.skillProficiencies
                                  .map((skillProf, index) => {
                                    if (typeof skillProf === "string") {
                                      return skillProf;
                                    } else if (
                                      skillProf &&
                                      skillProf.type === "choice"
                                    ) {
                                      return `Choose ${
                                        skillProf.count || 1
                                      } from any skill${
                                        skillProf.count > 1 ? "s" : ""
                                      }`;
                                    }
                                    return "";
                                  })
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                            )}

                            {feat.benefits.specialAbilities?.length > 0 && (
                              <div
                                style={{
                                  color: "#f59e0b",
                                  marginBottom: "8px",
                                  padding: "4px 0",
                                }}
                              >
                                <strong>• Special Abilities:</strong>{" "}
                                {feat.benefits.specialAbilities
                                  .map((ability) => {
                                    if (ability.type === "choice") {
                                      return `${
                                        ability.name
                                      } (choose from: ${ability.options?.join(
                                        ", "
                                      )})`;
                                    }
                                    return ability.name;
                                  })
                                  .join(", ")}
                              </div>
                            )}

                            {feat.benefits.resistances?.length > 0 && (
                              <div
                                style={{
                                  color: "#ef4444",
                                  marginBottom: "8px",
                                  padding: "4px 0",
                                }}
                              >
                                <strong>• Resistances:</strong>{" "}
                                {feat.benefits.resistances.join(", ")}
                              </div>
                            )}

                            {feat.benefits.immunities?.length > 0 && (
                              <div
                                style={{
                                  color: "#06b6d4",
                                  marginBottom: "8px",
                                  padding: "4px 0",
                                }}
                              >
                                <strong>• Immunities:</strong>{" "}
                                {feat.benefits.immunities.join(", ")}
                              </div>
                            )}

                            {feat.benefits.combatBonuses &&
                              Object.keys(feat.benefits.combatBonuses).length >
                                0 && (
                                <div
                                  style={{
                                    color: "#ec4899",
                                    marginBottom: "8px",
                                    padding: "4px 0",
                                  }}
                                >
                                  <strong>• Combat:</strong>{" "}
                                  {Object.entries(feat.benefits.combatBonuses)
                                    .filter(([_, value]) => value)
                                    .map(([key, value]) => {
                                      if (key === "initiativeBonus")
                                        return `+${value} Initiative`;
                                      if (key === "criticalRange")
                                        return `Critical on ${value}+`;
                                      if (key === "darkvision")
                                        return `${value}ft Darkvision`;
                                      return null;
                                    })
                                    .filter(Boolean)
                                    .join(", ")}
                                </div>
                              )}

                            {feat.benefits.speeds &&
                              Object.keys(feat.benefits.speeds).length > 0 && (
                                <div
                                  style={{
                                    color: "#84cc16",
                                    marginBottom: "8px",
                                    padding: "4px 0",
                                  }}
                                >
                                  <strong>• Speed:</strong>{" "}
                                  {Object.entries(feat.benefits.speeds)
                                    .filter(([_, value]) => value)
                                    .map(([key, value]) => {
                                      if (key === "walkingBonus")
                                        return `+${value}ft walking`;
                                      if (key === "climb")
                                        return `${value}ft climb`;
                                      if (key === "flying")
                                        return `${value}ft flying`;
                                      return null;
                                    })
                                    .filter(Boolean)
                                    .join(", ")}
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredFeats.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px",
                  color: theme.textSecondary,
                }}
              >
                No feats found matching "{featFilter}"
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginBottom: "32px" }}>
        <div
          style={sectionHeaderStyle}
          onClick={() => setAsiExpanded(!asiExpanded)}
        >
          <h3 style={sectionTitleStyle}>
            <span style={{ fontSize: "20px" }}>📈</span>
            Ability Score Improvements (ASI)
            {availableASILevels.length > 0 && (
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "14px",
                  fontWeight: "normal",
                  color: theme.textSecondary,
                }}
              >
                - Available at levels: {availableASILevels.join(", ")}
              </span>
            )}
          </h3>
          <span style={{ fontSize: "20px", color: theme.text }}>
            {asiExpanded ? "▲" : "▼"}
          </span>
        </div>

        {asiExpanded && (
          <div style={{ marginTop: "12px" }}>
            {availableASILevels.length === 0 ? (
              <div
                style={{
                  ...featureCardStyle,
                  textAlign: "center",
                  padding: "24px",
                  color: theme.textSecondary,
                }}
              >
                <p style={{ margin: 0, fontSize: "14px" }}>
                  You will gain Ability Score Improvements at levels 4, 8, 12,
                  16, and 19.
                </p>
                <p style={{ margin: "8px 0 0 0", fontSize: "13px" }}>
                  Current level: {characterLevel}
                </p>
              </div>
            ) : (
              <div>
                <div style={styles.helpText}>
                  At levels {availableASILevels.join(", ")}, you can choose
                  between an Ability Score Improvement (+2 total, max +1 per
                  ability) or a Standard Feat.
                </div>

                {availableASILevels.map((level) => {
                  const choice = character.asiChoices?.[level] || {};
                  const isASI = choice.type === "asi";
                  const isFeat = choice.type === "feat";
                  const hasSelectedChoice =
                    isASI || (isFeat && choice.selectedFeat);

                  return (
                    <ASILevelSelection
                      key={level}
                      level={level}
                      choice={choice}
                      isASI={isASI}
                      isFeat={isFeat}
                      hasSelectedChoice={hasSelectedChoice}
                      character={character}
                      setCharacter={setCharacter}
                      disabled={disabled}
                      theme={theme}
                      styles={styles}
                      featureCardStyle={featureCardStyle}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {selectingFeat && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: theme.surface,
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              border: `2px solid ${theme.border}`,
            }}
          >
            <h3
              style={{ color: theme.text, marginTop: 0, marginBottom: "16px" }}
            >
              Configure {selectingFeat.name}
            </h3>

            {getRequiredChoices(selectingFeat).map((choice, index) => {
              const isComplete = featChoices[choice.id] !== undefined;

              return (
                <div key={choice.id} style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      color: theme.text,
                      fontSize: "14px",
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    {choice.label}:
                  </label>
                  <select
                    value={featChoices[choice.id] || ""}
                    onChange={(e) =>
                      setFeatChoices({
                        ...featChoices,
                        [choice.id]: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "14px",
                      border: `2px solid ${
                        isComplete ? theme.primary : theme.border
                      }`,
                      borderRadius: "6px",
                      backgroundColor: theme.background,
                      color: theme.text,
                      outline: "none",
                    }}
                  >
                    <option value="">Select {choice.label}</option>
                    {choice.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={() => {
                  setSelectingFeat(null);
                  setFeatChoices({});
                }}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  backgroundColor: theme.border,
                  color: theme.text,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmFeatSelection}
                disabled={
                  !getRequiredChoices(selectingFeat).every(
                    (c) => featChoices[c.id]
                  )
                }
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  backgroundColor: getRequiredChoices(selectingFeat).every(
                    (c) => featChoices[c.id]
                  )
                    ? theme.primary
                    : theme.border,
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: getRequiredChoices(selectingFeat).every(
                    (c) => featChoices[c.id]
                  )
                    ? "pointer"
                    : "not-allowed",
                  opacity: getRequiredChoices(selectingFeat).every(
                    (c) => featChoices[c.id]
                  )
                    ? 1
                    : 0.5,
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ASILevelSelection = ({
  level,
  choice,
  isASI,
  isFeat,
  hasSelectedChoice,
  character,
  setCharacter,
  disabled,
  theme,
  styles,
  featureCardStyle,
}) => {
  const handleASIChoiceChange = (choiceType) => {
    if (disabled) return;

    const updatedAsiChoices = {
      ...character.asiChoices,
      [level]: {
        type: choiceType,
        ...(choiceType === "asi"
          ? { abilityScoreIncreases: [] }
          : { selectedFeat: null, featChoices: {} }),
      },
    };
    setCharacter({
      ...character,
      asiChoices: updatedAsiChoices,
    });
  };

  return (
    <div
      style={{
        marginTop: "16px",
        padding: "20px",
        backgroundColor: theme.background,
        border: `2px solid ${theme.border}`,
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: theme.text,
          }}
        >
          Level {level} Choice
        </h4>
        {hasSelectedChoice && (
          <span
            style={{
              fontSize: "12px",
              color: theme.success,
              fontWeight: "600",
              padding: "4px 12px",
              backgroundColor: `${theme.success}20`,
              borderRadius: "12px",
            }}
          >
            ✓ {isASI ? "ASI Selected" : `Feat: ${choice.selectedFeat}`}
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            border: `2px solid ${isASI ? theme.primary : theme.border}`,
            borderRadius: "8px",
            backgroundColor: isASI ? `${theme.primary}10` : theme.surface,
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            minWidth: "180px",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <input
            type="radio"
            name={`level${level}Choice`}
            value="asi"
            checked={isASI}
            onChange={() => handleASIChoiceChange("asi")}
            disabled={disabled}
            style={{
              width: "16px",
              height: "16px",
              accentColor: theme.primary,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          />
          <span
            style={{
              marginLeft: "12px",
              fontWeight: isASI ? "600" : "500",
              color: isASI ? theme.primary : theme.text,
              fontSize: "14px",
            }}
          >
            Ability Score Improvement
          </span>
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            border: `2px solid ${isFeat ? theme.primary : theme.border}`,
            borderRadius: "8px",
            backgroundColor: isFeat ? `${theme.primary}10` : theme.surface,
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            minWidth: "180px",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <input
            type="radio"
            name={`level${level}Choice`}
            value="feat"
            checked={isFeat}
            onChange={() => handleASIChoiceChange("feat")}
            disabled={disabled}
            style={{
              width: "16px",
              height: "16px",
              accentColor: theme.primary,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          />
          <span
            style={{
              marginLeft: "12px",
              fontWeight: isFeat ? "600" : "500",
              color: isFeat ? theme.primary : theme.text,
              fontSize: "14px",
            }}
          >
            Standard Feat
          </span>
        </label>
      </div>

      {isASI && (
        <ASIAbilitySelector
          level={level}
          choice={choice}
          character={character}
          setCharacter={setCharacter}
          disabled={disabled}
          theme={theme}
          styles={styles}
        />
      )}

      {isFeat && (
        <div
          style={{
            padding: "16px",
            backgroundColor: `${theme.primary}15`,
            border: `1px solid ${theme.primary}`,
            borderRadius: "8px",
            fontSize: "13px",
            color: theme.text,
          }}
        >
          <strong>📝 Note:</strong>{" "}
          {choice.selectedFeat
            ? `You selected the feat "${choice.selectedFeat}" from the Feats section above.`
            : "Select a feat from the Feats section above. It will be assigned to this level."}
        </div>
      )}

      {!choice.type && (
        <div
          style={{
            backgroundColor: `${theme.border}20`,
            border: `1px dashed ${theme.border}`,
            borderRadius: "8px",
            padding: "16px",
            textAlign: "center",
            color: theme.textSecondary,
          }}
        >
          <div style={{ fontSize: "14px", marginBottom: "4px" }}>
            ⚪ No choice selected yet
          </div>
          <div style={{ fontSize: "12px" }}>
            Choose either Ability Score Improvement or Standard Feat above
          </div>
        </div>
      )}
    </div>
  );
};

const ASIAbilitySelector = ({
  level,
  choice,
  character,
  setCharacter,
  disabled,
  theme,
  styles,
}) => {
  const abilities = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];
  const currentIncreases = choice.abilityScoreIncreases || [];

  const handleAbilityIncrement = (ability) => {
    if (disabled) return;

    const abilityIncreases = currentIncreases.filter(
      (inc) => inc.ability === ability
    );
    const totalIncreases = currentIncreases.length;

    let newIncreases;
    if (abilityIncreases.length === 2) {
      newIncreases = currentIncreases.filter((inc) => inc.ability !== ability);
    } else if (abilityIncreases.length === 1) {
      if (totalIncreases < 2) {
        newIncreases = [...currentIncreases, { ability, increase: 1 }];
      } else {
        newIncreases = currentIncreases.filter(
          (inc) => inc.ability !== ability
        );
      }
    } else if (totalIncreases < 2) {
      newIncreases = [...currentIncreases, { ability, increase: 1 }];
    } else {
      return;
    }

    const updatedAsiChoices = {
      ...character.asiChoices,
      [level]: {
        ...character.asiChoices[level],
        abilityScoreIncreases: newIncreases,
      },
    };
    setCharacter({
      ...character,
      asiChoices: updatedAsiChoices,
    });
  };

  return (
    <div>
      <div style={styles.helpText}>
        Select abilities to increase (total +2). You can increase one ability by
        +2 or two different abilities by +1 each.
        {currentIncreases.length > 0 && (
          <span style={{ color: theme.success, marginLeft: "8px" }}>
            ({currentIncreases.length}/2 selected)
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "12px",
          marginTop: "16px",
        }}
      >
        {abilities.map((ability) => {
          const abilityIncreases = currentIncreases.filter(
            (inc) => inc.ability === ability
          );
          const increaseCount = abilityIncreases.length;
          const totalIncreases = currentIncreases.length;
          const canSelect = totalIncreases < 2 || increaseCount > 0;
          const currentScore = character.abilityScores?.[ability] || 10;

          return (
            <div
              key={ability}
              style={{
                padding: "12px 16px",
                border: `2px solid ${
                  increaseCount > 0 ? theme.success : theme.border
                }`,
                borderRadius: "8px",
                backgroundColor:
                  increaseCount === 2
                    ? `${theme.success}25`
                    : increaseCount === 1
                    ? `${theme.success}15`
                    : theme.surface,
                cursor: disabled
                  ? "not-allowed"
                  : canSelect
                  ? "pointer"
                  : "not-allowed",
                transition: "all 0.2s ease",
                opacity: disabled ? 0.6 : canSelect ? 1 : 0.4,
                textAlign: "center",
              }}
              onClick={() => handleAbilityIncrement(ability)}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: increaseCount > 0 ? theme.success : theme.text,
                  textTransform: "capitalize",
                  fontSize: "14px",
                }}
              >
                {ability}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  marginTop: "4px",
                }}
              >
                {currentScore} → {currentScore + increaseCount}
              </div>
              {increaseCount > 0 && (
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.success,
                    fontWeight: "600",
                    marginTop: "4px",
                  }}
                >
                  +{increaseCount} ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {currentIncreases.length === 2 && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: `${theme.success}20`,
            border: `1px solid ${theme.success}`,
            borderRadius: "8px",
            color: theme.success,
            fontSize: "14px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {(() => {
            const abilityGroups = currentIncreases.reduce((acc, inc) => {
              acc[inc.ability] = (acc[inc.ability] || 0) + 1;
              return acc;
            }, {});

            const displayText = Object.entries(abilityGroups)
              .map(
                ([ability, count]) =>
                  `+${count} ${
                    ability.charAt(0).toUpperCase() + ability.slice(1)
                  }`
              )
              .join(", ");

            return `✓ Ability Score Improvement Complete: ${displayText}`;
          })()}
        </div>
      )}
    </div>
  );
};

export default FeatureSelectorSection;
