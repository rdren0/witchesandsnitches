// src/App/CharacterSelector.js (Updated with Clean Theme Integration)
import { User } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { createCharacterSelectorStyles } from "../../styles/masterStyles";
export const CharacterSelector = ({
  user,
  characters,
  selectedCharacter,
  onCharacterChange,
  isLoading,
  error,
}) => {
  const { theme: contextTheme } = useTheme();

  // Fallback theme if context is undefined
  const theme = contextTheme || {
    surface: "#ffffff",
    background: "#f8fafc",
    text: "#1f2937",
    textSecondary: "#6b7280",
    primary: "#6366f1",
    secondary: "#8b5cf6",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    border: "#e5e7eb",
  };

  const styles = createCharacterSelectorStyles(theme);

  if (!user) return null;

  const shouldShowDropdown = characters.length > 1;
  const singleCharacter = characters.length === 1 ? characters[0] : null;

  const formatCharacterDisplay = (char) => {
    if (!char) return "";
    return `${char.name} (${char.castingStyle || "Unknown Class"}) - Level ${
      char.level || "?"
    } - ${char.house || "No House"}${
      char.gameSession ? ` - ${char.gameSession}` : ""
    }`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <div style={styles.selectorRow}>
          <User size={24} color={theme.primary} />
          <label style={styles.label}>Character:</label>

          {shouldShowDropdown ? (
            <select
              value={selectedCharacter?.id?.toString() || ""}
              onChange={(e) => {
                const char = characters.find(
                  (c) => c.id.toString() === e.target.value
                );
                onCharacterChange(char);
              }}
              style={styles.select}
              disabled={isLoading}
            >
              <option value="">
                {isLoading ? "Loading characters..." : "Select a character..."}
              </option>
              {characters.map((char) => (
                <option key={char.id} value={char.id}>
                  {formatCharacterDisplay(char)}
                </option>
              ))}
            </select>
          ) : singleCharacter ? (
            <div style={styles.singleCharacterDisplay}>
              {formatCharacterDisplay(singleCharacter)}
            </div>
          ) : (
            <div style={styles.noCharactersDisplay}>
              {isLoading ? "Loading characters..." : "No characters available"}
            </div>
          )}
        </div>

        {characters.length === 0 && !isLoading && (
          <div style={styles.warningMessage}>
            No characters found. Create a character in the Character Creation
            tab first.
          </div>
        )}
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
    </div>
  );
};
export default CharacterSelector;
