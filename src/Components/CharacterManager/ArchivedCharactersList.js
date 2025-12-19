import { useState, useEffect, useCallback, useRef } from "react";
import { RotateCcw, Archive, AlertCircle, Search, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { createCharacterCreationStyles } from "../../utils/styles/masterStyles";

import { characterService } from "../../services/characterService";

const ArchivedCharactersList = ({
  user,
  adminMode = false,
  isUserAdmin = false,
  onCharacterRestored,
  refreshTrigger = 0,
}) => {
  const { theme } = useTheme();
  const styles = createCharacterCreationStyles(theme);

  const [archivedCharacters, setArchivedCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadingRef = useRef(false);
  const discordUserId = user?.user_metadata?.provider_id;

  const loadArchivedCharacters = useCallback(async () => {
    if (!discordUserId && !adminMode) {
      setIsLoading(false);
      return;
    }

    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const charactersData =
        adminMode && isUserAdmin
          ? await characterService.getArchivedCharacters()
          : await characterService.getArchivedCharacters(discordUserId);

      setArchivedCharacters(charactersData || []);
    } catch (err) {
      console.error("Error loading archived characters:", err);
      setError("Failed to load archived characters. Please try again.");
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [discordUserId, adminMode]);

  useEffect(() => {
    loadArchivedCharacters();
  }, [refreshTrigger]);

  const handleRestoreCharacter = async (character) => {
    const confirmed = window.confirm(
      `Restore ${character.name}? This will make the character active again.`
    );

    if (confirmed) {
      try {
        if (adminMode && isUserAdmin) {
          await characterService.restoreCharacter(
            character.id,
            character.discord_user_id
          );
        } else {
          await characterService.restoreCharacter(character.id, discordUserId);
        }

        await loadArchivedCharacters();

        if (onCharacterRestored) {
          onCharacterRestored();
        }
      } catch (error) {
        console.error("Error restoring character:", error);
        alert("Failed to restore character. Please try again.");
      }
    }
  };

  const filteredCharacters = archivedCharacters.filter((character) => {
    if (!searchTerm) return true;

    const search = searchTerm.toLowerCase();
    return (
      character.name?.toLowerCase().includes(search) ||
      character.house?.toLowerCase().includes(search) ||
      character.game_session?.toLowerCase().includes(search) ||
      character.level?.toString().includes(search)
    );
  });

  const renderArchivedCharacterCard = (character) => {
    const archivedDate = character.archived_at
      ? new Date(character.archived_at).toLocaleDateString()
      : "Unknown";

    return (
      <div
        key={character.id}
        style={{
          ...styles.panel,
          padding: "20px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          border: `1px solid ${theme.border}`,
          backgroundColor: theme.background,
          opacity: 0.8,
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: theme.surface,
            border: `2px solid ${theme.border}`,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {character.image_url ? (
            <img
              src={character.image_url}
              alt={character.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Archive size={32} color={theme.textSecondary} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              color: theme.text,
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            {character.name}
          </h3>
          <div
            style={{
              display: "flex",
              gap: "16px",
              fontSize: "14px",
              color: theme.textSecondary,
            }}
          >
            <span>Level {character.level}</span>
            {character.house && <span>{character.house}</span>}
            {character.game_session && <span>{character.game_session}</span>}
            <span style={{ fontStyle: "italic" }}>
              Archived: {archivedDate}
            </span>
          </div>
        </div>

        <button
          onClick={() => handleRestoreCharacter(character)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor: theme.success,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              theme.successHover || theme.success;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.success;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <RotateCcw size={16} />
          Restore
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p style={{ ...styles.subtitle }}>Loading archived characters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: theme.error,
        }}
      >
        <AlertCircle size={48} style={{ marginBottom: "16px", opacity: 0.8 }} />
        <p style={{ fontSize: "16px" }}>{error}</p>
      </div>
    );
  }

  if (archivedCharacters.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: theme.surface,
          borderRadius: "12px",
          border: `2px dashed ${theme.border}`,
        }}
      >
        <Archive
          size={64}
          color={theme.textSecondary}
          style={{ marginBottom: "16px", opacity: 0.5 }}
        />
        <h3
          style={{
            color: theme.text,
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "8px",
          }}
        >
          No Archived Characters
        </h3>
        <p style={{ color: theme.textSecondary, fontSize: "14px" }}>
          Deleted characters will appear here and can be restored.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: "20px",
          padding: "16px",
          backgroundColor: theme.surface,
          borderRadius: "8px",
          border: `1px solid ${theme.warning}`,
          borderLeft: `4px solid ${theme.warning}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Archive size={20} color={theme.warning} />
          <p
            style={{
              color: theme.text,
              fontSize: "14px",
              margin: 0,
            }}
          >
            These characters have been deleted. Click "Restore" to make them
            active again.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      {archivedCharacters.length > 0 && (
        <div
          style={{
            marginBottom: "20px",
            position: "relative",
          }}
        >
          <div style={{ position: "relative" }}>
            <Search
              size={20}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: theme.textSecondary,
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search archived characters by name, house, session, or level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 40px 12px 40px",
                fontSize: "14px",
                border: `2px solid ${theme.border}`,
                borderRadius: "8px",
                backgroundColor: theme.surface,
                color: theme.text,
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.border;
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.textSecondary,
                }}
                title="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
          {searchTerm && (
            <div
              style={{
                marginTop: "8px",
                fontSize: "13px",
                color: theme.textSecondary,
              }}
            >
              Found {filteredCharacters.length} of {archivedCharacters.length}{" "}
              archived character(s)
            </div>
          )}
        </div>
      )}

      {/* Character List */}
      <div>
        {filteredCharacters.length === 0 && searchTerm ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              backgroundColor: theme.surface,
              borderRadius: "8px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <Search
              size={48}
              color={theme.textSecondary}
              style={{ marginBottom: "12px", opacity: 0.5 }}
            />
            <p
              style={{
                color: theme.text,
                fontSize: "16px",
                marginBottom: "4px",
              }}
            >
              No matches found
            </p>
            <p style={{ color: theme.textSecondary, fontSize: "14px" }}>
              Try a different search term
            </p>
          </div>
        ) : (
          filteredCharacters.map((character) =>
            renderArchivedCharacterCard(character)
          )
        )}
      </div>
    </div>
  );
};

export default ArchivedCharactersList;
