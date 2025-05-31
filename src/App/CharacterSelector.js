import { User } from "lucide-react";

export const CharacterSelector = ({
  user,
  characters,
  selectedCharacter,
  onCharacterChange,
  isLoading,
  error,
}) => {
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
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f8fafc",
        borderBottom: "2px solid #e2e8f0",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <User size={24} color="#64748b" />
          <label
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Character:
          </label>

          {shouldShowDropdown ? (
            <select
              value={selectedCharacter?.id?.toString() || ""}
              onChange={(e) => {
                const char = characters.find(
                  (c) => c.id.toString() === e.target.value
                );
                onCharacterChange(char);
              }}
              style={{
                padding: "8px 12px",
                fontSize: "16px",
                border: "2px solid #d1d5db",
                borderRadius: "8px",
                backgroundColor: "white",
                color: "#374151",
                minWidth: "200px",
              }}
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
            <div
              style={{
                padding: "8px 12px",
                fontSize: "16px",
                backgroundColor: "#e0f2fe",
                border: "2px solid #0891b2",
                borderRadius: "8px",
                color: "#0c4a6e",
                fontWeight: "500",
                minWidth: "200px",
                textAlign: "center",
              }}
            >
              {formatCharacterDisplay(singleCharacter)}
            </div>
          ) : (
            <div
              style={{
                padding: "8px 12px",
                fontSize: "16px",
                border: "2px solid #d1d5db",
                borderRadius: "8px",
                backgroundColor: "#f9fafb",
                color: "#6b7280",
                minWidth: "200px",
                textAlign: "center",
              }}
            >
              {isLoading ? "Loading characters..." : "No characters available"}
            </div>
          )}
        </div>

        {characters.length === 0 && !isLoading && (
          <div
            style={{
              backgroundColor: "#fbbf24",
              color: "#92400e",
              padding: "12px 20px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            No characters found. Create a character in the Character Creation
            tab first.
          </div>
        )}
      </div>
      {error && (
        <div
          style={{
            backgroundColor: "#FEE2E2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            padding: "12px",
            borderRadius: "8px",
            margin: "16px 0",
            fontSize: "14px",
            maxWidth: "1200px",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};
