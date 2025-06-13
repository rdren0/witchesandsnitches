import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { subclassesData } from "../../data";

const EnhancedSubclassSelector = ({
  value,
  onChange,
  styles,
  theme,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubclass, setSelectedSubclass] = useState(value);

  const handleSubclassSelect = (subclassName) => {
    setSelectedSubclass(subclassName);
    onChange(subclassName);
    setIsExpanded(false);
  };

  const selectedSubclassData = selectedSubclass
    ? subclassesData[selectedSubclass]
    : null;

  return (
    <div style={styles.fieldContainer}>
      <label style={styles.label}>Subclass</label>

      {/* Custom Dropdown */}
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={disabled}
          style={{
            ...styles.select,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <span
            style={{
              color: selectedSubclass ? theme.text : theme.textSecondary,
            }}
          >
            {selectedSubclass || "Select Subclass..."}
          </span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Dropdown Menu */}
        {isExpanded && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 1000,
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {/* Clear Selection Option */}
            <button
              type="button"
              onClick={() => handleSubclassSelect("")}
              style={{
                width: "100%",
                padding: "12px 16px",
                textAlign: "left",
                border: "none",
                backgroundColor: "transparent",
                color: theme.textSecondary,
                cursor: "pointer",
                borderBottom: `1px solid ${theme.border}`,
                fontStyle: "italic",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = theme.background)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              Clear Selection
            </button>

            {/* Subclass Options */}
            {Object.values(subclassesData).map((subclass) => (
              <div key={subclass.name}>
                <button
                  type="button"
                  onClick={() => handleSubclassSelect(subclass.name)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    textAlign: "left",
                    border: "none",
                    backgroundColor:
                      selectedSubclass === subclass.name
                        ? theme.primary + "20"
                        : "transparent",
                    color: theme.text,
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSubclass !== subclass.name) {
                      e.target.style.backgroundColor = theme.background;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSubclass !== subclass.name) {
                      e.target.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <div style={{ marginBottom: "4px" }}>
                    <strong style={{ fontSize: "14px", color: theme.primary }}>
                      {subclass.name}
                    </strong>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: theme.textSecondary,
                      lineHeight: "1.4",
                      marginBottom: "8px",
                    }}
                  >
                    {subclass.description}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: theme.text,
                      fontWeight: "500",
                      padding: "4px 8px",
                      backgroundColor: theme.background,
                      borderRadius: "4px",
                      display: "inline-block",
                    }}
                  >
                    {subclass.summary}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Subclass Details */}
      {selectedSubclassData && (
        <div
          style={{
            marginTop: "12px",
            padding: "16px",
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <Info size={16} color={theme.primary} />
            <h4
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "600",
                color: theme.primary,
              }}
            >
              {selectedSubclassData.name} Details
            </h4>
          </div>

          <p
            style={{
              margin: "0 0 16px 0",
              fontSize: "14px",
              color: theme.text,
              lineHeight: "1.5",
            }}
          >
            {selectedSubclassData.description}
          </p>

          {/* Level 1 Features */}
          <div style={{ marginBottom: "16px" }}>
            <h5
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
                color: theme.text,
              }}
            >
              Level 1 Features:
            </h5>
            {selectedSubclassData.level1Features.map((feature, index) => (
              <div key={index} style={{ marginBottom: "8px" }}>
                <strong
                  style={{
                    fontSize: "13px",
                    color: theme.primary,
                  }}
                >
                  {feature.name}:
                </strong>
                <span
                  style={{
                    fontSize: "13px",
                    color: theme.text,
                    marginLeft: "6px",
                  }}
                >
                  {feature.description}
                </span>
              </div>
            ))}
          </div>

          {/* Level 1 Choices */}
          {selectedSubclassData.level1Choices &&
            selectedSubclassData.level1Choices.length > 0 && (
              <div>
                <h5
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: theme.text,
                  }}
                >
                  Choose One at Level 1:
                </h5>
                {selectedSubclassData.level1Choices.map((choice, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "12px",
                      padding: "12px",
                      backgroundColor: theme.background,
                      borderRadius: "6px",
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "13px",
                        color: theme.primary,
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      {choice.name}
                    </strong>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: theme.text,
                        lineHeight: "1.4",
                      }}
                    >
                      {choice.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

          {/* Summary */}
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              backgroundColor: theme.primary + "10",
              borderRadius: "6px",
              borderLeft: `4px solid ${theme.primary}`,
            }}
          >
            <strong
              style={{
                fontSize: "12px",
                color: theme.primary,
                display: "block",
                marginBottom: "4px",
              }}
            >
              Summary:
            </strong>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: theme.text,
                fontStyle: "italic",
              }}
            >
              {selectedSubclassData.summary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSubclassSelector;
