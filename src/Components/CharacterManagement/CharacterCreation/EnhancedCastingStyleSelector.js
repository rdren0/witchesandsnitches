import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { castingStyleData } from "../../../SharedData/data";

const CastingStyleCard = ({
  styleName,
  data,
  isSelected,
  onSelect,
  isExpanded,
  onToggleExpand,
}) => {
  return (
    <div
      style={{
        border: `2px solid ${isSelected ? data.color : "#e5e7eb"}`,
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "12px",
        backgroundColor: isSelected ? `${data.color}10` : "#ffffff",
        cursor: "pointer",
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
              accentColor: data.color,
              cursor: "pointer",
            }}
          />
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              {styleName}
            </h3>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "14px",
                color: "#6b7280",
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

      {/* Quick Stats Row */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: "12px", color: "#6b7280" }}>
          <strong>Hit Die:</strong> {data.hitDie}
        </div>
        <div style={{ fontSize: "12px", color: "#6b7280" }}>
          <strong>Spellcasting:</strong> {data.spellcastingAbility}
        </div>
        <div style={{ fontSize: "12px", color: "#6b7280" }}>
          <strong>Base AC:</strong> {data.baseAC}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div
          style={{
            marginTop: "16px",
            borderTop: "1px solid #e5e7eb",
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
            {/* Hit Points */}
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
                  color: "#4b5563",
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

            {/* Proficiencies */}
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
                  color: "#4b5563",
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

            {/* Key Features */}
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
                  color: "#4b5563",
                  lineHeight: "1.5",
                }}
              >
                {data.keyFeatures.map((feature, index) => (
                  <li key={index} style={{ marginBottom: "4px" }}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Available Skills */}
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
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardSelect = (styleName) => {
    onStyleChange(styleName);
  };

  const handleToggleExpand = (styleName) => {
    setExpandedCard(expandedCard === styleName ? null : styleName);
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px" }}>
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "16px",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "8px",
          }}
        >
          Casting Style {required && "*"}
        </label>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
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
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
          }}
        >
          <div
            style={{ fontSize: "14px", color: "#166534", fontWeight: "500" }}
          >
            ✓ Selected: {selectedStyle}
          </div>
          <div style={{ fontSize: "12px", color: "#166534", marginTop: "4px" }}>
            You can change this selection at any time during character creation.
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCastingStyleSelector;
