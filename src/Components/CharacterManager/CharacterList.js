import { useState, useEffect, useCallback } from "react";
import {
  Trash2,
  Users,
  Star,
  Plus,
  ArrowUp,
  AlertCircle,
  Shield,
  Calendar,
  Edit3,
  TrendingUp,
  User,
} from "lucide-react";

import { useTheme } from "../../contexts/ThemeContext";
import { createCharacterCreationStyles } from "../../styles/masterStyles";
import { characterService } from "../../services/characterService";
import { gameSessionGroups } from "../../App/const";

const CharacterList = ({
  user,
  customUsername,
  selectedCharacterId,
  onSelectedCharacterReset,
  onEditCharacter,
  onLevelUpCharacter,
  onDeleteCharacter,
  onCreateNew,
  supabase,
  adminMode = false,
  isUserAdmin = false,
  allCharacters = undefined,
  viewMode = "my",
  refreshTrigger = 0,
}) => {
  const { theme } = useTheme();
  const styles = createCharacterCreationStyles(theme);

  const [savedCharacters, setSavedCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("level");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterValue, setFilterValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const discordUserId = user?.user_metadata?.provider_id;

  const getAvailableGameSessions = () => {
    const sessionCounts = {};
    savedCharacters.forEach((char) => {
      if (char.gameSession) {
        sessionCounts[char.gameSession] =
          (sessionCounts[char.gameSession] || 0) + 1;
      }
    });

    const grouped = {
      haunting: [],
      knights: [],
      other: [],
      development: [],
    };

    Object.entries(sessionCounts).forEach(([session, count]) => {
      const sessionData = { session, count };
      if (gameSessionGroups.haunting.includes(session)) {
        grouped.haunting.push(sessionData);
      } else if (gameSessionGroups.knights.includes(session)) {
        grouped.knights.push(sessionData);
      } else if (gameSessionGroups.development.includes(session)) {
        grouped.development.push(sessionData);
      } else {
        grouped.other.push(sessionData);
      }
    });

    grouped.haunting.sort((a, b) => a.session.localeCompare(b.session));
    grouped.knights.sort((a, b) => a.session.localeCompare(b.session));
    grouped.other.sort((a, b) => a.session.localeCompare(b.session));
    grouped.development.sort((a, b) => a.session.localeCompare(b.session));

    return grouped;
  };

  const availableGameSessions = getAvailableGameSessions();

  const loadCharacters = useCallback(async () => {
    if (!discordUserId && !adminMode) return;

    setIsLoading(true);
    setError(null);

    try {
      let charactersData;

      if (adminMode && isUserAdmin && allCharacters) {
        charactersData = allCharacters;
      } else if (adminMode && isUserAdmin) {
        charactersData = await characterService.getAllCharacters();
      } else {
        charactersData = await characterService.getCharacters(discordUserId);
      }

      const transformedCharacters = charactersData.map((char) => ({
        abilityScores: char.ability_scores,
        asiChoices: char.asi_choices || {},
        background: char.background,
        backgroundSkills: char.background_skills || [],
        heritageChoices: char.heritage_choices || {},
        innateHeritageSkills: char.innate_heritage_skills || [],
        castingStyle: char.casting_style,
        createdAt: char.created_at,
        currentHitDice: char.current_hit_dice || char.level,
        currentHitPoints: char.current_hit_points ?? char.hit_points,
        discordUserId: char.discord_user_id,
        featChoices: char.feat_choices || {},
        gameSession: char.game_session || char.gameSession,
        hitPoints: char.hit_points,
        house: char.house,
        houseChoices: char.house_choices || {},
        id: char.id,
        imageUrl: char.image_url,
        initiativeAbility: char.initiative_ability,
        innateHeritage: char.innate_heritage,
        level: char.level,
        level1ChoiceType: char.level1_choice_type,
        magicModifiers: char.magic_modifiers || {},
        maxHitDice: char.max_hit_dice || char.level,
        name: char.name,
        schoolYear: char.school_year,
        skillExpertise: char.skill_expertise || [],
        skillProficiencies: char.skill_proficiencies || [],
        standardFeats: char.standard_feats || [],
        subclass: char.subclass,
        subclassChoices: char.subclass_choices || {},
        tempHitPoints: char.temp_hit_points || 0,
        updatedAt: char.updated_at,
        wandCore: char.wand_core,
        wandFlexibility: char.wand_flexibility,
        wandLength: char.wand_length,
        wandType: char.wand_type,
        wandWood: char.wand_wood,
      }));

      let filteredCharacters = transformedCharacters;
      if (viewMode === "my" && !adminMode) {
        filteredCharacters = transformedCharacters.filter(
          (char) => char.discordUserId === discordUserId
        );
      }

      setSavedCharacters(filteredCharacters);
    } catch (err) {
      console.error("Error loading characters:", err);
      setError("Failed to load characters. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [discordUserId, adminMode, isUserAdmin, allCharacters, viewMode]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters, refreshTrigger]);

  useEffect(() => {
    if (filterValue) {
      const allSessions = [
        ...availableGameSessions.haunting,
        ...availableGameSessions.knights,
        ...availableGameSessions.other,
        ...availableGameSessions.development,
      ];
      if (!allSessions.some(({ session }) => session === filterValue)) {
        setFilterValue("");
      }
    }
  }, [availableGameSessions, filterValue]);

  const sortedAndFilteredCharacters = savedCharacters
    .filter((char) => {
      const matchesSearch = searchTerm
        ? char.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesFilter = filterValue
        ? char.gameSession === filterValue
        : true;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "level":
          comparison = a.level - b.level;
          break;
        case "created":
        default:
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const handleDeleteCharacter = async (character) => {
    if (onDeleteCharacter) {
      await onDeleteCharacter(character);
    }
  };

  const renderCharacterCard = (character) => {
    const isSelectedCharacter = selectedCharacterId === character.id;

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
          cursor: "pointer",
          border: isSelectedCharacter
            ? `2px solid ${theme.primary}`
            : `1px solid ${theme.border}`,
          backgroundColor: isSelectedCharacter
            ? theme.surface
            : theme.background,
          transition: "all 0.2s ease",
          boxShadow: isSelectedCharacter
            ? `0 4px 12px ${theme.primary}20`
            : "0 2px 4px rgba(0,0,0,0.1)",
        }}
        onClick={() => onEditCharacter && onEditCharacter(character)}
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
            borderRadius: "120px",
          }}
        >
          {character.imageUrl ? (
            <img
              src={character.imageUrl}
              alt={character.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = "flex";
                }
              }}
            />
          ) : null}
          <div
            style={{
              display: character.imageUrl ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              backgroundColor: theme.surface,
            }}
          >
            <User size={32} style={{ color: theme.textSecondary }} />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              ...styles.title,
              fontSize: "20px",
              marginBottom: "6px",
              color: theme.text,
            }}
          >
            {character.name}
          </h3>
          <p
            style={{
              ...styles.subtitle,
              fontSize: "14px",
              marginBottom: "4px",
            }}
          >
            Level {character.level} {character.castingStyle}
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                padding: "2px 8px",
                borderRadius: "4px",
                backgroundColor: `${theme.primary}20`,
                color: theme.primary,
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              {character.house}
            </span>
            {character.subclass && (
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "4px",
                  backgroundColor: `${theme.secondary}20`,
                  color: theme.secondary,
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {character.subclass}
              </span>
            )}
            {character.gameSession && (
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "4px",
                  backgroundColor: theme.surface,
                  color: theme.textSecondary,
                  fontSize: "11px",
                }}
              >
                {character.gameSession}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditCharacter && onEditCharacter(character);
            }}
            style={{
              ...styles.button,
              backgroundColor: theme.primary,
              color: "white",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              borderRadius: "6px",
              fontSize: "13px",
            }}
            title="Edit"
          >
            <Edit3 size={14} />
            <span
              style={{ display: window.innerWidth > 768 ? "inline" : "none" }}
            >
              Edit
            </span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCharacter(character);
            }}
            style={{
              ...styles.button,
              backgroundColor: theme.error,
              color: "white",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              borderRadius: "6px",
              fontSize: "13px",
            }}
            title="Delete"
          >
            <Trash2 size={14} />
            <span
              style={{ display: window.innerWidth > 768 ? "inline" : "none" }}
            >
              Delete
            </span>
          </button>
        </div>
      </div>
    );
  };

  if (isLoading && savedCharacters.length === 0) {
    return (
      <div style={{ ...styles.panel, padding: "40px", textAlign: "center" }}>
        <p style={styles.subtitle}>Loading characters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.panel, padding: "40px", textAlign: "center" }}>
        <AlertCircle
          size={24}
          style={{ color: theme.error, marginBottom: "8px" }}
        />
        <p style={{ color: theme.error }}>{error}</p>
      </div>
    );
  }

  if (savedCharacters.length === 0) {
    return (
      <div style={{ ...styles.panel, padding: "60px", textAlign: "center" }}>
        <Users
          size={64}
          style={{ color: theme.textSecondary, marginBottom: "20px" }}
        />
        <h3 style={{ ...styles.title, fontSize: "24px", marginBottom: "8px" }}>
          No Characters Yet
        </h3>
        <p style={{ ...styles.subtitle, marginBottom: "24px" }}>
          Create your first character to get started!
        </p>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            style={{
              ...styles.button,
              backgroundColor: theme.primary,
              color: "white",
              padding: "14px 28px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "16px",
              borderRadius: "8px",
            }}
          >
            <Plus size={18} />
            Create Character
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          ...styles.panel,
          padding: "20px",
          marginBottom: "24px",
          position: "relative",
        }}
      >
        {isLoading && savedCharacters.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              padding: "4px 8px",
              backgroundColor: theme.primary,
              color: "white",
              borderRadius: "4px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Refreshing...
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search characters by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              ...styles.input,
              flex: "1 1 250px",
              margin: 0,
              padding: "10px 14px",
              fontSize: "14px",
            }}
          />

          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={{
              ...styles.select,
              padding: "10px 14px",
              fontSize: "14px",
              minWidth: "250px",
            }}
            disabled={
              availableGameSessions.haunting.length === 0 &&
              availableGameSessions.knights.length === 0 &&
              availableGameSessions.other.length === 0 &&
              availableGameSessions.development.length === 0
            }
          >
            <option value="">
              All Sessions{" "}
              {savedCharacters.length > 0 && `(${savedCharacters.length})`}
            </option>

            {availableGameSessions.haunting.length > 0 && (
              <optgroup label="Haunting Sessions">
                {availableGameSessions.haunting.map(({ session, count }) => (
                  <option key={session} value={session}>
                    {session} ({count})
                  </option>
                ))}
              </optgroup>
            )}

            {availableGameSessions.haunting.length > 0 &&
              (availableGameSessions.knights.length > 0 ||
                availableGameSessions.other.length > 0 ||
                availableGameSessions.development.length > 0) && (
                <option disabled>──────────</option>
              )}

            {availableGameSessions.knights.length > 0 && (
              <optgroup label="Knights Sessions">
                {availableGameSessions.knights.map(({ session, count }) => (
                  <option key={session} value={session}>
                    {session} ({count})
                  </option>
                ))}
              </optgroup>
            )}

            {availableGameSessions.knights.length > 0 &&
              (availableGameSessions.other.length > 0 ||
                availableGameSessions.development.length > 0) && (
                <option disabled>──────────</option>
              )}

            {availableGameSessions.other.length > 0 && (
              <optgroup label="Other Sessions">
                {availableGameSessions.other.map(({ session, count }) => (
                  <option key={session} value={session}>
                    {session} ({count})
                  </option>
                ))}
              </optgroup>
            )}

            {availableGameSessions.other.length > 0 &&
              availableGameSessions.development.length > 0 && (
                <option disabled>──────────</option>
              )}

            {availableGameSessions.development.length > 0 &&
              availableGameSessions.development.map(({ session, count }) => (
                <option key={session} value={session}>
                  {session} ({count})
                </option>
              ))}

            {availableGameSessions.haunting.length === 0 &&
              availableGameSessions.knights.length === 0 &&
              availableGameSessions.other.length === 0 &&
              availableGameSessions.development.length === 0 && (
                <option value="" disabled>
                  No sessions available
                </option>
              )}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              ...styles.select,
              padding: "10px 14px",
              fontSize: "14px",
              minWidth: "140px",
            }}
          >
            <option value="level">Sort by Level</option>
            <option value="name">Sort by Name</option>
            <option value="created">Sort by Date</option>
          </select>

          <button
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
            style={{
              ...styles.button,
              backgroundColor: theme.surface,
              color: theme.text,
              padding: "10px 14px",
              fontSize: "18px",
              borderRadius: "6px",
              minWidth: "44px",
            }}
            title={
              sortDirection === "asc" ? "Sort Ascending" : "Sort Descending"
            }
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      <div
        style={{
          opacity: isLoading && savedCharacters.length > 0 ? 0.7 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        {sortedAndFilteredCharacters.map(renderCharacterCard)}
      </div>

      {sortedAndFilteredCharacters.length > 0 && (
        <div
          style={{
            ...styles.panel,
            padding: "16px",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          <p style={styles.subtitle}>
            Showing {sortedAndFilteredCharacters.length} of{" "}
            {savedCharacters.length} characters
            {searchTerm && ` matching "${searchTerm}"`}
            {filterValue && ` in ${filterValue}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default CharacterList;
