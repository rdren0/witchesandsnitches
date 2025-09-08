import React from "react";
import { createBackgroundStyles } from "../../../../styles/masterStyles";
import { useTheme } from "../../../../contexts/ThemeContext";
import { backgroundsData } from "../../../../SharedData/backgroundsData";

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

    // Normalize tool names (e.g., "Vehicle (Broomstick)" -> "Broomstick")
    const normalizedBackgroundTools = backgroundTools.map(tool => {
      if (tool === "Vehicle (Broomstick)") return "Broomstick";
      return tool;
    });

    const characterTools = character.toolProficiencies || [];

    return {
      background: normalizedBackgroundTools,
      character: characterTools,
      all: [...new Set([...normalizedBackgroundTools, ...characterTools])],
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
    const isFromBackground = toolData.background.includes(tool);

    if (isFromBackground) return;

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
        {/* Tool Proficiencies Section */}
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

          {toolData.background.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#f59e0b",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Background Tools (Automatic)
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                {toolData.background.map((tool) => (
                  <ProficiencyBox
                    key={`bg-tool-${tool}`}
                    item={tool}
                    isSelected={true}
                    isAutomatic={true}
                    sourceType="background"
                    canToggle={false}
                  />
                ))}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  fontStyle: "italic",
                }}
              >
                These tools are automatically granted by your background choice.
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
                const isFromBackground = toolData.background.includes(tool);

                return (
                  <ProficiencyBox
                    key={`tool-${tool}`}
                    item={tool}
                    isSelected={isSelected}
                    isAutomatic={isFromBackground}
                    sourceType={isFromBackground ? "background" : null}
                    onToggle={() => handleToolToggle(tool)}
                    canToggle={!isFromBackground}
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
          Select additional tool proficiencies for your character.
          Tools from your background are automatically included.
        </div>
      </div>
    </div>
  );
};

export default ToolsLanguagesSection;
