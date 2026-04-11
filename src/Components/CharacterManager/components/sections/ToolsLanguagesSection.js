import React, { useState } from "react";
import { createBackgroundStyles } from "../../../../utils/styles/masterStyles";
import { useTheme } from "../../../../contexts/ThemeContext";
import { backgroundsData, subclassesData } from "../../../../SharedData";
import { useFeats } from "../../../../hooks/useFeats";

const ToolsLanguagesSection = ({ character, onChange, disabled = false }) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);
  const { feats: standardFeats } = useFeats();
  const [customToolInput, setCustomToolInput] = useState("");

  const toSentenceCase = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getToolProficiencies = () => {
    const backgroundTools = character.background
      ? Object.values(backgroundsData).find(
          (bg) => bg.name === character.background
        )?.toolProficiencies || []
      : [];

    const subclassTools = [];
    if (character.subclass && character.subclassChoices) {
      const subclassInfo = subclassesData[character.subclass];

      if (subclassInfo?.benefits?.toolProficiencies) {
        subclassTools.push(...subclassInfo.benefits.toolProficiencies);
      }

      if (subclassInfo?.benefits?.vehicleProficiencies) {
        subclassTools.push(...subclassInfo.benefits.vehicleProficiencies);
      }

      if (subclassInfo?.higherLevelFeatures) {
        subclassInfo.higherLevelFeatures.forEach((feature) => {
          if (feature.benefits?.toolProficiencies) {
            subclassTools.push(...feature.benefits.toolProficiencies);
          }
          if (feature.benefits?.vehicleProficiencies) {
            subclassTools.push(...feature.benefits.vehicleProficiencies);
          }
          if (feature.choices && Array.isArray(feature.choices)) {
            const level = String(feature.level);
            const selectedChoices = character.subclassChoices?.[level];
            if (selectedChoices) {
              const selectedNames = Array.isArray(selectedChoices)
                ? selectedChoices
                : [selectedChoices];
              feature.choices.forEach((choice) => {
                if (selectedNames.includes(choice.name)) {
                  if (choice.benefits?.toolProficiencies) {
                    subclassTools.push(...choice.benefits.toolProficiencies);
                  }
                  if (choice.benefits?.vehicleProficiencies) {
                    subclassTools.push(...choice.benefits.vehicleProficiencies);
                  }
                }
              });
            }
          }
        });
      }

      if (subclassInfo?.choices) {
        Object.entries(character.subclassChoices).forEach(([level, choice]) => {
          const levelData = subclassInfo.choices[level];
          if (levelData?.options) {
            const selectedOption = levelData.options.find(
              (opt) => opt.name === choice
            );
            if (selectedOption?.benefits?.toolProficiencies) {
              subclassTools.push(...selectedOption.benefits.toolProficiencies);
            }
            if (selectedOption?.benefits?.vehicleProficiencies) {
              subclassTools.push(
                ...selectedOption.benefits.vehicleProficiencies
              );
            }
          }
        });
      }
    }

    const featTools = [];
    if (character.standardFeats) {
      character.standardFeats.forEach((featName) => {
        const feat = standardFeats.find((f) => f.name === featName);
        if (feat?.benefits?.toolProficiencies) {
          featTools.push(...feat.benefits.toolProficiencies);
        }
      });
    }

    const rawToolProficiencies = character.toolProficiencies || [];
    const excludedTools = new Set(
      rawToolProficiencies.filter((t) => t.startsWith("!")).map((t) => t.slice(1))
    );
    const characterTools = rawToolProficiencies.filter((t) => !t.startsWith("!"));
    const subclassChoiceGrants = subclassTools.filter((t) => t && typeof t === "object" && t.type === "choice");
    const filteredSubclassTools = subclassTools.filter((t) => typeof t === "string" && !excludedTools.has(t));
    const filteredBackgroundTools = backgroundTools.filter((t) => typeof t === "string" && !excludedTools.has(t));
    const filteredFeatTools = featTools.filter((t) => typeof t === "string" && !excludedTools.has(t));

    const automaticTools = [...filteredBackgroundTools, ...filteredSubclassTools, ...filteredFeatTools];

    return {
      background: filteredBackgroundTools,
      subclass: filteredSubclassTools,
      feat: filteredFeatTools,
      character: characterTools,
      excluded: excludedTools,
      automatic: [...new Set(automaticTools)],
      all: [...new Set([...automaticTools, ...characterTools])],
      choiceGrants: subclassChoiceGrants,
    };
  };

  const toolData = getToolProficiencies();

  const availableTools = [
    "Astronomer's tools",
    "Herbologist's tools",
    "Potioneer's kit",
    "Broomstick",
    "Disguise kit",
    "Navigator's tools",
    "Poisoner's kit",
    "Thieves' tools",
    "Cook's utensils",
    "Musical instrument",
    "Diviner's kit",
  ];

  const customTools = (character.toolProficiencies || []).filter(
    (t) => !t.startsWith("!") && !availableTools.includes(t) && !toolData.automatic.includes(t)
  );

  const handleAddCustomTool = () => {
    const name = customToolInput.trim();
    if (!name || disabled) return;
    const currentTools = character.toolProficiencies || [];
    const activeTools = currentTools.filter((t) => !t.startsWith("!"));
    if (activeTools.includes(name)) return;
    // Remove any exclusion marker and add as proficient
    const newTools = [
      ...currentTools.filter((t) => t !== `!${name}` && t !== name),
      name,
    ];
    onChange("toolProficiencies", newTools);
    setCustomToolInput("");
  };

  const handleRemoveCustomTool = (tool, isAutomatic) => {
    if (disabled) return;
    const currentTools = character.toolProficiencies || [];
    if (isAutomatic) {
      // Store exclusion marker instead of removing (it's auto-granted)
      if (!currentTools.includes(`!${tool}`)) {
        onChange("toolProficiencies", [...currentTools, `!${tool}`]);
      }
    } else {
      onChange("toolProficiencies", currentTools.filter((t) => t !== tool));
    }
  };

  const handleToolToggle = (tool) => {
    if (disabled) return;

    const currentTools = character.toolProficiencies || [];
    const activeTools = currentTools.filter((t) => !t.startsWith("!"));
    const isCurrentlySelected = activeTools.includes(tool);
    const isAutomatic = toolData.automatic.includes(tool);

    if (isAutomatic) return;

    if (isCurrentlySelected) {
      onChange("toolProficiencies", currentTools.filter((t) => t !== tool));
    } else {
      onChange("toolProficiencies", [...currentTools, tool]);
    }
  };

  const ProficiencyBox = ({
    item,
    isSelected,
    isAutomatic,
    sourceType,
    onToggle,
    canToggle = true,
  }) => {
    const getSourceStyle = () => {
      switch (sourceType) {
        case "background":
          return {
            backgroundColor: "#f59e0b20",
            borderColor: "#f59e0b",
            textColor: "#f59e0b",
            label: "B",
          };
        case "subclass":
          return {
            backgroundColor: "#10b98120",
            borderColor: "#10b981",
            textColor: "#10b981",
            label: "S",
          };
        case "feat":
          return {
            backgroundColor: "#8b5cf620",
            borderColor: "#8b5cf6",
            textColor: "#8b5cf6",
            label: "F",
          };
        default:
          return {
            backgroundColor: isSelected ? `${theme.success}20` : theme.surface,
            borderColor: isSelected ? theme.success : theme.border,
            textColor: isSelected ? theme.success : theme.text,
            label: null,
          };
      }
    };

    const sourceStyle = getSourceStyle();

    if (isAutomatic || sourceType !== null) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: sourceStyle.backgroundColor,
            border: `2px solid ${sourceStyle.borderColor}`,
            cursor: "default",
            fontSize: "14px",
            minHeight: "40px",
            maxWidth: "540px",
          }}
        >
          {sourceStyle.label && (
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: sourceStyle.borderColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "8px",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                {sourceStyle.label}
              </span>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontSize: "14px",
                color: sourceStyle.textColor,
                fontWeight: "600",
              }}
            >
              {toSentenceCase(item)}
              {sourceType && (
                <span
                  style={{
                    fontSize: "10px",
                    color: sourceStyle.textColor,
                    opacity: 0.7,
                    marginLeft: "4px",
                  }}
                >
                  From {sourceType}
                </span>
              )}
            </span>
          </div>
        </div>
      );
    }

    return (
      <label
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: canToggle && !disabled ? "pointer" : "not-allowed",
          backgroundColor: sourceStyle.backgroundColor,
          border: `2px solid ${sourceStyle.borderColor}`,
          opacity: canToggle && !disabled ? 1 : 0.5,
          fontSize: "14px",
          minHeight: "40px",
          transition: "all 0.2s ease",
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => canToggle && !disabled && onToggle()}
          disabled={!canToggle || disabled}
          style={{
            marginRight: "8px",
            accentColor: theme.primary,
          }}
        />
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontSize: "14px",
              color: sourceStyle.textColor,
              fontWeight: isSelected ? "600" : "normal",
            }}
          >
            {toSentenceCase(item)}
          </span>
        </div>
      </label>
    );
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
        <div style={{ marginBottom: "32px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: theme.text,
              marginBottom: "16px",
              margin: "0 0 16px 0",
            }}
          >
            Tool Proficiencies ({toolData.all.length} total)
          </h3>

          {toolData.automatic.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: theme.primary,
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Automatic Tool Proficiencies
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                {toolData.automatic.map((tool) => {
                  let sourceType = null;
                  if (toolData.background.includes(tool))
                    sourceType = "background";
                  else if (toolData.subclass.includes(tool))
                    sourceType = "subclass";
                  else if (toolData.feat.includes(tool)) sourceType = "feat";

                  return (
                    <div key={`auto-tool-${tool}`} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <div style={{ flex: 1 }}>
                        <ProficiencyBox
                          item={tool}
                          isSelected={true}
                          isAutomatic={true}
                          sourceType={sourceType}
                          canToggle={false}
                        />
                      </div>
                      {!disabled && (
                        <button
                          onClick={() => handleRemoveCustomTool(tool, true)}
                          title="Remove"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: theme.textSecondary,
                            fontSize: "16px",
                            lineHeight: 1,
                            padding: "0 4px",
                            opacity: 0.5,
                            flexShrink: 0,
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: theme.text,
                marginBottom: "8px",
              }}
            >
              Additional Tools
            </h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              {availableTools.map((tool) => {
                const isSelected = toolData.all.includes(tool);
                const isAutomatic = toolData.automatic.includes(tool);

                let sourceType = null;
                if (isAutomatic) {
                  if (toolData.background.includes(tool))
                    sourceType = "background";
                  else if (toolData.subclass.includes(tool))
                    sourceType = "subclass";
                  else if (toolData.feat.includes(tool)) sourceType = "feat";
                }

                return (
                  <ProficiencyBox
                    key={`tool-${tool}`}
                    item={tool}
                    isSelected={isSelected}
                    isAutomatic={isAutomatic}
                    sourceType={sourceType}
                    onToggle={() => handleToolToggle(tool)}
                    canToggle={!isAutomatic}
                  />
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: theme.text,
                marginBottom: "8px",
              }}
            >
              Custom Tools
            </h4>

            {customTools.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                {customTools.map((tool) => (
                  <div
                    key={tool}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      backgroundColor: `${theme.success}20`,
                      border: `2px solid ${theme.success}`,
                      fontSize: "14px",
                      color: theme.success,
                      fontWeight: "600",
                    }}
                  >
                    {tool}
                    {!disabled && (
                      <button
                        onClick={() => handleRemoveCustomTool(tool, false)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: theme.success,
                          fontSize: "16px",
                          lineHeight: 1,
                          padding: "0 2px",
                          opacity: 0.7,
                        }}
                        title="Remove"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!disabled && (
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={customToolInput}
                  onChange={(e) => setCustomToolInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCustomTool()}
                  placeholder="e.g. Alchemist's supplies"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.background,
                    color: theme.text,
                    fontSize: "14px",
                  }}
                />
                <button
                  onClick={handleAddCustomTool}
                  disabled={!customToolInput.trim()}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: customToolInput.trim() ? theme.primary : theme.border,
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: customToolInput.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            fontSize: "12px",
            color: theme.textSecondary,
            marginTop: "12px",
            fontStyle: "italic",
          }}
        >
          Select additional tool proficiencies for your character. Tools from
          your background, subclass, and feats are automatically included and
          cannot be removed.
        </div>
      </div>
    </div>
  );
};

export default ToolsLanguagesSection;
