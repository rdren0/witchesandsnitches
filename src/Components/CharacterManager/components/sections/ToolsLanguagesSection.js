import React from "react";
import { createBackgroundStyles } from "../../../../styles/masterStyles";
import { useTheme } from "../../../../contexts/ThemeContext";
import {
  backgroundsData,
  subclassesData,
  standardFeats,
} from "../../../../SharedData";

const ToolsLanguagesSection = ({ character, onChange, disabled = false }) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);

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

    const characterTools = character.toolProficiencies || [];

    const automaticTools = [...backgroundTools, ...subclassTools, ...featTools];

    return {
      background: backgroundTools,
      subclass: subclassTools,
      feat: featTools,
      character: characterTools,
      automatic: [...new Set(automaticTools)],
      all: [...new Set([...automaticTools, ...characterTools])],
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

  const handleToolToggle = (tool) => {
    if (disabled) return;

    const currentTools = character.toolProficiencies || [];
    const isCurrentlySelected = currentTools.includes(tool);
    const isAutomatic = toolData.automatic.includes(tool);

    if (isAutomatic) return;

    if (isCurrentlySelected) {
      const newTools = currentTools.filter((t) => t !== tool);
      onChange("toolProficiencies", newTools);
    } else {
      const newTools = [...currentTools, tool];
      onChange("toolProficiencies", newTools);
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
                    <ProficiencyBox
                      key={`auto-tool-${tool}`}
                      item={tool}
                      isSelected={true}
                      isAutomatic={true}
                      sourceType={sourceType}
                      canToggle={false}
                    />
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
