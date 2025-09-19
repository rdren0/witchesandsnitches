import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { castingStyleData } from "../../../../../SharedData/data";
import { useTheme } from "../../../../../contexts/ThemeContext";

const CastingStyleCard = ({
  styleName,
  data,
  isSelected,
  onSelect,
  isExpanded,
  onToggleExpand,
}) => {
  const { theme } = useTheme();
  return (
    <div
      style={{
        border: `2px solid ${isSelected ? data.color : theme.border}`,
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "12px",
        backgroundColor: isSelected ? `${data.color}10` : theme.background,
        cursor: "pointer",
        width: "100%",
        transition: "all 0.2s ease",
        boxShadow: isSelected
          ? `0 4px 12px ${data.color}20`
          : "0 2px 4px rgba(0,0,0,0.1)",
      }}
      onClick={onSelect}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input
            type="radio"
            name="castingStyle"
            value={styleName}
            checked={isSelected}
            onChange={() => onSelect()}
            style={{
              width: "18px",
              height: "18px",
              accentColor: theme.primary,
              cursor: "pointer",
            }}
          />
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "600",
                color: theme.text,
              }}
            >
              {styleName}
            </h3>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "14px",
                color: theme.textSecondary,
                lineHeight: "1.4",
              }}
            >
              {data.description}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            color: data.color,
          }}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: "12px", color: theme.text }}>
          <strong>Hit Die:</strong> {data.hitDie}
        </div>
        <div style={{ fontSize: "12px", color: theme.text }}>
          <strong>Spellcasting:</strong> {data.spellcastingAbility}
        </div>
        <div style={{ fontSize: "12px", color: theme.text }}>
          <strong>Base AC:</strong> {data.baseAC}
        </div>
      </div>

      {isExpanded && (
        <div
          style={{
            marginTop: "16px",
            borderTop: `1px solid ${theme.border}`,
            paddingTop: "16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: data.color,
                }}
              >
                Hit Points
              </h4>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.text,
                  lineHeight: "1.5",
                }}
              >
                <div>
                  <strong>1st Level:</strong> {data.hitPointsAtFirst}
                </div>
                <div>
                  <strong>Higher Levels:</strong> {data.hitPointsPerLevel}
                </div>
              </div>
            </div>

            <div>
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: data.color,
                }}
              >
                Proficiencies
              </h4>
              <div
                style={{
                  fontSize: "12px",
                  color: theme.textSecondary,
                  lineHeight: "1.5",
                }}
              >
                <div>
                  <strong>Saving Throws:</strong> {data.savingThrows.join(", ")}
                </div>
                <div>
                  <strong>Skills:</strong> Choose 2 from {data.skills.length}{" "}
                  options
                </div>
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: data.color,
                }}
              >
                Key Features
              </h4>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "16px",
                  fontSize: "12px",
                  color: theme.textSecondary,
                  lineHeight: "1.5",
                }}
              >
                {data.keyFeatures.map((feature, index) => (
                  <li key={index} style={{ marginBottom: "4px" }}>
                    <strong>{feature.name}</strong> (Level {feature.level}):{" "}
                    {feature.description}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: data.color,
                }}
              >
                Available Skills
              </h4>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: `${data.color}15`,
                      color: data.color,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "500",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const EnhancedCastingStyleSelector = ({
  selectedStyle = "",
  onStyleChange = () => {},
  required = false,
}) => {
  const { theme } = useTheme();
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardSelect = (styleName) => {
    onStyleChange(styleName);

    setExpandedCard(styleName);
  };

  const handleToggleExpand = (styleName) => {
    setExpandedCard(expandedCard === styleName ? null : styleName);
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "16px",
            fontWeight: "600",
            color: theme.text,
            marginBottom: "8px",
          }}
        >
          Casting Style {required && "*"}
        </label>
        <p
          style={{
            fontSize: "14px",
            color: theme.textSecondary,
            margin: "0 0 16px 0",
            lineHeight: "1.5",
          }}
        >
          Choose your magical approach. Each casting style has unique abilities,
          spellcasting methods, and strengths. Click on a card to select it, or
          use the arrow to expand details.
        </p>
      </div>

      <div>
        {Object.entries(castingStyleData).map(([styleName, data]) => (
          <CastingStyleCard
            key={styleName}
            styleName={styleName}
            data={data}
            isSelected={selectedStyle === styleName}
            onSelect={() => handleCardSelect(styleName)}
            isExpanded={expandedCard === styleName}
            onToggleExpand={() => handleToggleExpand(styleName)}
          />
        ))}
      </div>

      {selectedStyle && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: theme.background,
            border: `1px solid ${theme.primary}`,
            borderRadius: "8px",
            color: theme.primary,
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: theme.primary,
              fontWeight: "500",
            }}
          >
            ✓ Selected: {selectedStyle}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: theme.text,
              marginTop: "4px",
            }}
          >
            You can change this selection at any time during character creation.
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCastingStyleSelector;
