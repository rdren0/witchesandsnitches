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
} from "lucide-react";

import { useTheme } from "../../contexts/ThemeContext";
import { createCharacterCreationStyles } from "../../styles/masterStyles";
import { characterService } from "../../services/characterService";
import CharacterEditor from "./CharacterEditor";
import { gameSessionOptions } from "../../App/const";

const CharacterList = ({
  user,
  customUsername,
  selectedCharacterId,
  onSelectedCharacterReset,
  onEditCharacter,
  onLevelUpCharacter,
  onCreateNew,
  supabase,
  adminMode = false,
  isUserAdmin = false,
  allCharacters = undefined,
}) => {
  const { theme } = useTheme();
  const styles = createCharacterCreationStyles(theme);

  const [savedCharacters, setSavedCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingCharacter, setEditingCharacter] = useState(null);
  const [sortBy, setSortBy] = useState("created");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterValue, setFilterValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const discordUserId = user?.user_metadata?.provider_id;

  const loadCharacters = useCallback(async () => {
    if (!discordUserId && !adminMode) return;

    setIsLoading(true);
    setError(null);

    try {
      let charactersData;

      if (adminMode && isUserAdmin) {
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
        gameSession: char.game_session,
        hitPoints: char.hit_points,
        house: char.house,
        houseChoices: char.house_choices || {},
        id: char.id,
        initiativeAbility: char.initiative_ability || "dexterity",
        innateHeritage: char.innate_heritage,
        imageUrl: char.image_url || "",
        level: char.level,
        level1ChoiceType: char.level1_choice_type || "",
        magicModifiers: char.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },
        name: char.name,
        skillProficiencies: char.skill_proficiencies || [],
        skillExpertise: char.skill_expertise || [],
        standardFeats: char.standard_feats || [],
        schoolYear: char.school_year,
        subclass: char.subclass,
        subclassChoices: char.subclass_choices || {},
        updatedAt: char.updated_at,
        wandType: char.wand_type || "",

        discordUserId: char.discord_user_id,
        ownerInfo: char.discord_users
          ? {
              username: char.discord_users.username,
              displayName: char.discord_users.display_name,
            }
          : null,
      }));

      const sortedCharacters = transformedCharacters.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setSavedCharacters(sortedCharacters);
    } catch (err) {
      console.error("Error loading characters:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [discordUserId, adminMode, isUserAdmin]);

  useEffect(() => {
    if (adminMode && allCharacters) {
      const transformedCharacters = allCharacters.map((char) => ({
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
        gameSession: char.game_session,
        hitPoints: char.hit_points,
        house: char.house,
        houseChoices: char.house_choices || {},
        id: char.id,
        initiativeAbility: char.initiative_ability || "dexterity",
        innateHeritage: char.innate_heritage,
        level: char.level,
        imageUrl: char.image_url || "",
        level1ChoiceType: char.level1_choice_type || "",
        magicModifiers: char.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },
        name: char.name,
        schoolYear: char.school_year,
        skillProficiencies: char.skill_proficiencies || [],
        skillExpertise: char.skill_expertise || [],
        standardFeats: char.standard_feats || [],
        subclass: char.subclass,
        subclassChoices: char.subclass_choices || {},
        updatedAt: char.updated_at,
        wandType: char.wand_type || "",

        discordUserId: char.discord_user_id,
        ownerInfo: char.discord_users
          ? {
              username: char.discord_users.username,
              displayName: char.discord_users.display_name,
            }
          : null,
      }));
      setSavedCharacters(transformedCharacters);
    } else {
      loadCharacters();
    }
  }, [adminMode, allCharacters, loadCharacters]);

  const handleEdit = (character) => {
    if (onEditCharacter) {
      onEditCharacter(character);
    } else {
      setEditingCharacter(character);
    }
  };

  const handleLevelUp = (character) => {
    if (onLevelUpCharacter) {
      onLevelUpCharacter(character);
    }
  };

  const handleArchive = async (character) => {
    const effectiveUserId =
      adminMode && isUserAdmin ? character.discordUserId : discordUserId;

    const confirmMessage =
      adminMode && character.discordUserId !== discordUserId
        ? `Are you sure you want to delete "${
            character.name
          }"? This character belongs to ${
            character.ownerInfo?.displayName ||
            character.ownerInfo?.username ||
            "another user"
          }.`
        : `Are you sure you want to delete "${character.name}"? This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await characterService.deleteCharacter(character.id, effectiveUserId);

      setSavedCharacters((prev) =>
        prev.filter((char) => char.id !== character.id)
      );

      if (selectedCharacterId === character.id) {
        onSelectedCharacterReset();
      }

      alert(`Character "${character.name}" has been deleted.`);
    } catch (error) {
      console.error("Error deleting character:", error);
      alert(`Failed to delete character: ${error.message}`);
    }
  };

  const handleSaveEdit = async (editedCharacter) => {
    try {
      setSavedCharacters((prev) =>
        prev.map((char) =>
          char.id === editedCharacter.id
            ? { ...char, ...editedCharacter }
            : char
        )
      );

      setEditingCharacter(null);
      alert(`Character "${editedCharacter.name}" updated successfully!`);
    } catch (error) {
      console.error("Error updating character:", error);
      alert(`Failed to update character: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingCharacter(null);
  };

  const getSortedAndFilteredCharacters = () => {
    let filtered = savedCharacters;

    if (searchTerm) {
      filtered = filtered.filter((char) =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterValue) {
      if (adminMode) {
        filtered = filtered.filter((char) => char.gameSession === filterValue);
      } else {
        filtered = filtered.filter((char) => char.house === filterValue);
      }
    }

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "level":
          aValue = a.level;
          bValue = b.level;
          break;
        case "house":
          aValue = a.house;
          bValue = b.house;
          break;
        case "created":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "updated":
          aValue = new Date(a.updatedAt || a.createdAt);
          bValue = new Date(b.updatedAt || b.createdAt);
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortDirection("asc");
    }
  };

  const getFilterOptions = () => {
    if (adminMode) {
      return gameSessionOptions;
    } else {
      return gameSessionOptions.filter((game) =>
        savedCharacters.find((char) => game === char.gameSession)
      );
    }
  };

  const filteredCharacters = getSortedAndFilteredCharacters();
  if (editingCharacter) {
    return (
      <CharacterEditor
        character={editingCharacter}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        user={user}
        customUsername={customUsername}
        supabase={supabase}
        adminMode={adminMode}
        isUserAdmin={isUserAdmin}
      />
    );
  }

  if (error) {
    return (
      <div style={styles.panel}>
        <div style={styles.errorContainer}>
          <AlertCircle size={48} color={theme.error} />
          <h3>Error Loading Characters</h3>
          <p>{error}</p>
          <button onClick={loadCharacters} style={styles.button}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      <div
        style={{
          ...styles.header,
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={{ color: theme.primary }}>
          <Users />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={styles.title}>
            {adminMode ? "All Characters" : "My Characters"}
          </h1>
          <p style={styles.subtitle}>
            {adminMode
              ? "Manage all characters in the system (Admin Mode)"
              : "Manage your characters, level up, edit details, and create duplicates"}
          </p>
        </div>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            style={{
              ...styles.button,
              backgroundColor: theme.primary,
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Plus size={16} />
            Create New
          </button>
        )}
      </div>

      <div style={styles.filtersContainer}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterContainer}>
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Game Sessions</option>
            {getFilterOptions().map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.sortContainer}>
          <button
            onClick={() => handleSort("name")}
            style={{
              ...styles.sortButton,
              ...(sortBy === "name" ? styles.activeSortButton : {}),
            }}
          >
            Name
            {sortBy === "name" && (
              <ArrowUp
                size={12}
                style={{
                  transform:
                    sortDirection === "desc" ? "rotate(180deg)" : "none",
                }}
              />
            )}
          </button>
          <button
            onClick={() => handleSort("level")}
            style={{
              ...styles.sortButton,
              ...(sortBy === "level" ? styles.activeSortButton : {}),
            }}
          >
            Level
            {sortBy === "level" && (
              <ArrowUp
                size={12}
                style={{
                  transform:
                    sortDirection === "desc" ? "rotate(180deg)" : "none",
                }}
              />
            )}
          </button>
          <button
            onClick={() => handleSort("created")}
            style={{
              ...styles.sortButton,
              ...(sortBy === "created" ? styles.activeSortButton : {}),
            }}
          >
            Created
            {sortBy === "created" && (
              <ArrowUp
                size={12}
                style={{
                  transform:
                    sortDirection === "desc" ? "rotate(180deg)" : "none",
                }}
              />
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={styles.loadingContainer}>Loading characters...</div>
      ) : filteredCharacters.length === 0 ? (
        <div style={styles.noCharactersContainer}>
          <Users size={48} color={theme.textSecondary} />
          <h3>
            {savedCharacters.length === 0
              ? adminMode
                ? "No characters found in the system."
                : "You haven't created any characters yet."
              : "No characters match your search criteria."}
          </h3>
          <p>
            {savedCharacters.length === 0
              ? 'Click "Create New Character" to get started!'
              : "Try adjusting your search or filter settings."}
          </p>
        </div>
      ) : (
        <div style={styles.charactersGrid}>
          {filteredCharacters.map((character) => {
            const isSelected =
              selectedCharacterId &&
              selectedCharacterId.toString() === character.id.toString();
            const isOwnCharacter = character.discordUserId === discordUserId;
            const canEdit = isOwnCharacter || (adminMode && isUserAdmin);

            return (
              <div
                key={character.id}
                style={{
                  ...styles.characterCard,
                  ...(isSelected ? styles.characterCardSelected : {}),
                  position: "relative",
                }}
              >
                <div style={styles.characterCardHeader}>
                  <div style={styles.characterCardTitle}>
                    <div style={styles.characterNameSection}>
                      <h3 style={styles.characterCardName}>{character.name}</h3>
                    </div>
                    <div style={styles.characterLevel}>
                      Level {character.level}
                    </div>
                  </div>
                </div>

                <div style={styles.characterCardBody}>
                  {adminMode && character.ownerInfo && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: theme.textSecondary,
                        marginBottom: "8px",
                        fontStyle: "italic",
                        textAlign: "center",
                      }}
                    >
                      Owner:{" "}
                      {character.ownerInfo.displayName ||
                        character.ownerInfo.username}
                    </div>
                  )}

                  <div style={styles.characterInfoRow}>
                    <div style={styles.characterInfoItem}>
                      <Shield size={14} color={theme.primary} />
                      <span>{character.house}</span>
                    </div>
                    <div style={styles.characterInfoItem}>
                      <Star size={14} color={theme.secondary} />
                      <span>{character.castingStyle}</span>
                    </div>
                  </div>

                  {character.gameSession && (
                    <div style={styles.characterInfoRow}>
                      <div style={styles.characterInfoItem}>
                        <Calendar size={14} color={theme.textSecondary} />
                        <span>{character.gameSession}</span>
                      </div>
                    </div>
                  )}

                  <div style={styles.characterStats}>
                    <div style={styles.statBadge}>
                      <span style={styles.statLabel}>HP:</span>
                      <span style={styles.statValue}>
                        {character.currentHitPoints}/{character.hitPoints}
                      </span>
                    </div>

                    {character.innateHeritage && (
                      <div style={styles.heritageBadge}>
                        <Star size={12} />
                        {character.innateHeritage}
                      </div>
                    )}

                    {character.standardFeats &&
                      character.standardFeats.length > 0 && (
                        <div style={styles.featsBadge}>
                          <Plus size={12} />
                          {character.standardFeats.length} Feat
                          {character.standardFeats.length > 1 ? "s" : ""}
                        </div>
                      )}
                  </div>

                  {character.subclass && (
                    <div style={styles.subclassInfo}>
                      <span style={styles.subclassLabel}>Subclass:</span>
                      <span style={styles.subclassValue}>
                        {character.subclass}
                      </span>
                    </div>
                  )}
                </div>

                <div style={styles.characterCardActions}>
                  {canEdit && (
                    <>
                      <button
                        onClick={() => handleEdit(character)}
                        style={{
                          ...styles.actionButton,
                          ...styles.editButton,
                        }}
                        title="Edit character"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      {character.level < 20 && (
                        <button
                          onClick={() => handleLevelUp(character)}
                          style={{
                            ...styles.actionButton,
                            ...styles.levelUpButton,
                          }}
                          title="Level up character"
                        >
                          <TrendingUp size={14} />
                          Level Up
                        </button>
                      )}

                      <button
                        onClick={() => handleArchive(character)}
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                        }}
                        title="Delete character"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </>
                  )}

                  {!canEdit && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: theme.textSecondary,
                        fontStyle: "italic",
                        textAlign: "center",
                        padding: "8px",
                      }}
                    >
                      View Only
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredCharacters.length > 0 && (
        <div style={styles.summaryContainer}>
          <div style={styles.summaryStats}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>
                {adminMode ? "Total Characters:" : "Total Characters:"}
              </span>
              <span style={styles.summaryValue}>{savedCharacters.length}</span>
            </div>
            {(searchTerm || filterValue) && (
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Showing:</span>
                <span style={styles.summaryValue}>
                  {filteredCharacters.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterList;
