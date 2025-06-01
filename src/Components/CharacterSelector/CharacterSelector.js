// src/App/CharacterSelector.js (Updated with Clean Theme Integration)
import { User } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export const CharacterSelector = ({
  user,
  characters,
  selectedCharacter,
  onCharacterChange,
  isLoading,
  error,
}) => {
  const { theme } = useTheme();

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

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: theme.surface,
      borderBottom: `2px solid ${theme.border}`,
      marginBottom: "20px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    innerContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    selectorRow: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      flexWrap: "wrap",
    },
    label: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
    },
    select: {
      padding: "8px 12px",
      fontSize: "16px",
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      backgroundColor: theme.surface,
      color: theme.text,
      minWidth: "200px",
    },
    singleCharacterDisplay: {
      padding: "8px 12px",
      fontSize: "16px",
      backgroundColor: theme.primary + "20",
      border: `2px solid ${theme.primary}`,
      borderRadius: "8px",
      color: theme.text,
      fontWeight: "500",
      minWidth: "200px",
      textAlign: "center",
    },
    noCharactersDisplay: {
      padding: "8px 12px",
      fontSize: "16px",
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      backgroundColor: theme.background,
      color: theme.textSecondary,
      minWidth: "200px",
      textAlign: "center",
    },
    warningMessage: {
      backgroundColor: theme.warning + "20",
      color: theme.warning,
      border: `1px solid ${theme.warning}`,
      padding: "12px 20px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "500",
      textAlign: "center",
    },
    errorMessage: {
      backgroundColor: theme.error + "20",
      border: `1px solid ${theme.error}`,
      color: theme.error,
      padding: "12px",
      borderRadius: "8px",
      margin: "16px 0",
      fontSize: "14px",
      maxWidth: "1200px",
      marginLeft: "auto",
      marginRight: "auto",
      textAlign: "center",
    },
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
