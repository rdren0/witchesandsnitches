import { Star } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

const CharacterProgressionSummary = ({ character, featInfo, styles }) => {
  const { theme } = useTheme();

  if (character.level <= 1) {
    return null;
  }

  return (
    <div style={styles.fieldContainer}>
      <div
        style={{
          ...styles.fieldContainer,
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <h4
          style={{
            ...styles.skillsSubheader,
            margin: "0 0 12px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Star size={16} color={theme.primary} />
          Character Progression Summary
        </h4>

        <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
          <div style={{ marginBottom: "8px" }}>
            <strong>Level {character.level} Character Choices:</strong>
          </div>

          {featInfo.choices.map((choice, index) => (
            <div
              key={index}
              style={{
                marginBottom: "4px",
                color:
                  choice.type === "feat"
                    ? theme.primary
                    : choice.type === "asi"
                    ? theme.success
                    : choice.type === "innate"
                    ? theme.warning
                    : theme.text,
              }}
            >
              ✓ Level {choice.level}: {choice.choice}
            </div>
          ))}

          {featInfo.nextASILevel && (
            <div style={{ marginBottom: "4px", color: theme.textSecondary }}>
              ○ Level {featInfo.nextASILevel}: Next ASI/Feat Choice
            </div>
          )}

          <div
            style={{
              fontSize: "12px",
              color: theme.textSecondary,
              marginTop: "8px",
              fontStyle: "italic",
            }}
          >
            Total Feats Selected: {featInfo.totalFeatsSelected}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterProgressionSummary;
