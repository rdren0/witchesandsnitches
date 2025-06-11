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
} from "lucide-react";

import { useTheme } from "../../../contexts/ThemeContext";
import { createCharacterCreationStyles } from "../../../styles/masterStyles";
import { characterService } from "../../../services/characterService";
import CharacterEditor from "./CharacterEditor";

const CharacterList = ({
  user,
  customUsername,
  selectedCharacterId,
  onSelectedCharacterReset,
  onEditCharacter,
  onLevelUpCharacter,
  onCreateNew,
  supabase,
}) => {
  const { theme } = useTheme();
  const styles = createCharacterCreationStyles(theme);

  const [savedCharacters, setSavedCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [duplicatingCharacterId, setDuplicatingCharacterId] = useState(null);

  const [editingCharacter, setEditingCharacter] = useState(null);
  const [sortBy, setSortBy] = useState("created");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterHouse, setFilterHouse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const discordUserId = user?.user_metadata?.provider_id;

  const loadCharacters = useCallback(async () => {
    if (!discordUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const charactersData = await characterService.getCharacters(
        discordUserId
      );

      const transformedCharacters = charactersData.map((char) => ({
        abilityScores: char.ability_scores,
        asiChoices: char.asi_choices || {},
        background: char.background,
        castingStyle: char.casting_style,
        createdAt: char.created_at,
        gameSession: char.game_session,
        hitPoints: char.hit_points,
        house: char.house,
        id: char.id,
        initiativeAbility: char.initiative_ability || "dexterity",
        innateHeritage: char.innate_heritage,
        level: char.level,
        level1ChoiceType: char.level1_choice_type || "",
        name: char.name,
        skillProficiencies: char.skill_proficiencies || [],
        standardFeats: char.standard_feats || [],
        subclass: char.subclass,
        wandType: char.wand_type || "",
        magicModifiers: char.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },
      }));

      setSavedCharacters(transformedCharacters);
    } catch (err) {
      setError("Failed to load characters: " + err.message);
      console.error("Error loading characters:", err);
    } finally {
      setIsLoading(false);
    }
  }, [discordUserId]);

  useEffect(() => {
    if (discordUserId) {
      loadCharacters();
    }
  }, [discordUserId, loadCharacters]);

  const handleEdit = (character) => {
    if (onEditCharacter) {
      onEditCharacter(character);
    } else {
      setEditingCharacter(character);
    }
  };

  const handleCancelEdit = () => {
    setEditingCharacter(null);
  };

  const handleSaveEdit = (updatedCharacter) => {
    setEditingCharacter(null);
    loadCharacters();
  };

  const handleDuplicate = async (character) => {
    if (!character) return;

    setDuplicatingCharacterId(character.id);

    try {
      const baseName = character.name;
      const existingNames = savedCharacters.map((char) =>
        char.name.toLowerCase()
      );
      let duplicateName = `${baseName} (Copy)`;
      let counter = 1;

      while (existingNames.includes(duplicateName.toLowerCase())) {
        counter++;
        duplicateName = `${baseName} (Copy ${counter})`;
      }

      await loadCharacters();

      console.log(
        `Successfully duplicated ${character.name} as ${duplicateName}`
      );
    } catch (err) {
      console.error("Error duplicating character:", err);
      alert("Failed to duplicate character: " + err.message);
    } finally {
      setDuplicatingCharacterId(null);
    }
  };

  const handleLevelUp = async (character) => {
    if (!character || character.level >= 20) return;

    if (onLevelUpCharacter) {
      onLevelUpCharacter(character);
      return;
    }

    try {
      const updatedData = {
        level: character.level + 1,
      };

      await characterService.updateCharacter(
        character.id,
        updatedData,
        discordUserId
      );

      loadCharacters();
    } catch (err) {
      console.error("Error leveling up character:", err);
      alert("Failed to level up character: " + err.message);
    }
  };

  const handleArchive = async (character) => {
    if (!window.confirm(`Are you sure you want to delete ${character.name}?`)) {
      return;
    }

    try {
      await characterService.deleteCharacter(character.id, discordUserId);

      const wasSelected =
        selectedCharacterId &&
        selectedCharacterId.toString() === character.id.toString();

      if (wasSelected) {
        const updatedCharacters = savedCharacters.filter(
          (char) => char.id !== character.id
        );
        if (updatedCharacters.length > 0) {
          onSelectedCharacterReset(updatedCharacters[0]);
        } else {
          onSelectedCharacterReset(null);
        }
      }

      loadCharacters();
    } catch (err) {
      console.error("Error deleting character:", err);
      alert("Failed to delete character: " + err.message);
    }
  };

  const getSortedAndFilteredCharacters = () => {
    let filtered = savedCharacters || [];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (char) =>
          char.name.toLowerCase().includes(term) ||
          char.house.toLowerCase().includes(term) ||
          char.castingStyle.toLowerCase().includes(term) ||
          char.background?.toLowerCase().includes(term) ||
          char.gameSession?.toLowerCase().includes(term)
      );
    }

    if (filterHouse) {
      filtered = filtered.filter((char) => char.house === filterHouse);
    }

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "level":
          aValue = a.level;
          bValue = b.level;
          break;
        case "house":
          aValue = a.house.toLowerCase();
          bValue = b.house.toLowerCase();
          break;
        case "created":
        default:
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
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

  const getAllHouses = () => {
    const houses = [
      ...new Set(savedCharacters.map((char) => char.house)),
    ].filter(Boolean);
    return houses.sort();
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
          <h1 style={styles.title}>My Characters</h1>
          <p style={styles.subtitle}>
            Manage your characters, level up, edit details, and create
            duplicates
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
            value={filterHouse}
            onChange={(e) => setFilterHouse(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Houses</option>
            {getAllHouses().map((house) => (
              <option key={house} value={house}>
                {house}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.sortContainer}>
          <span style={styles.sortLabel}>Sort by:</span>
          {[
            { key: "created", label: "Created" },
            { key: "name", label: "Name" },
            { key: "level", label: "Level" },
            { key: "house", label: "House" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              style={{
                ...styles.sortButton,
                ...(sortBy === key ? styles.sortButtonActive : {}),
              }}
            >
              {label}
              {sortBy === key && (
                <ArrowUp
                  size={12}
                  style={{
                    transform:
                      sortDirection === "desc" ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s ease",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}>Loading characters...</div>
        </div>
      ) : filteredCharacters.length === 0 ? (
        <div style={styles.emptyState}>
          {savedCharacters.length === 0 ? (
            <>
              <Users size={48} color={theme.textSecondary} />
              <h3 style={styles.emptyStateTitle}>No Characters Yet</h3>
              <p style={styles.emptyStateText}>
                Create your first character to get started on your magical
                journey!
              </p>
              {onCreateNew && (
                <button
                  onClick={onCreateNew}
                  style={{
                    ...styles.button,
                    backgroundColor: theme.primary,
                    color: "white",
                    marginTop: "16px",
                  }}
                >
                  <Plus size={16} style={{ marginRight: "8px" }} />
                  Create Your First Character
                </button>
              )}
            </>
          ) : (
            <>
              <AlertCircle size={48} color={theme.textSecondary} />
              <h3 style={styles.emptyStateTitle}>No Characters Found</h3>
              <p style={styles.emptyStateText}>
                Try adjusting your search or filter criteria.
              </p>
            </>
          )}
        </div>
      ) : (
        <div style={styles.charactersGrid}>
          {filteredCharacters.map((character) => {
            const isSelected =
              selectedCharacterId &&
              selectedCharacterId.toString() === character.id.toString();
            const isDuplicating = duplicatingCharacterId === character.id;

            return (
              <div
                key={character.id}
                style={{
                  ...styles.characterCard,
                  ...(isSelected ? styles.characterCardSelected : {}),
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
                        {character.hitPoints}
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
                  <button
                    onClick={() => handleEdit(character)}
                    style={{
                      ...styles.actionButton,
                      ...styles.editButton,
                    }}
                    title="Edit character"
                  >
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
                      Level Up
                    </button>
                  )}
                  <button
                    onClick={() => handleDuplicate(character)}
                    disabled={isDuplicating}
                    style={{
                      ...styles.actionButton,
                      backgroundColor: isDuplicating ? "#9ca3af" : "#8b5cf6",
                      color: "white",
                      cursor: isDuplicating ? "not-allowed" : "pointer",
                      opacity: isDuplicating ? 0.7 : 1,
                    }}
                    title="Duplicate character"
                  >
                    {isDuplicating ? "Duplicating..." : "Duplicate"}
                  </button>

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
              <span style={styles.summaryLabel}>Total Characters:</span>
              <span style={styles.summaryValue}>{savedCharacters.length}</span>
            </div>
            {searchTerm || filterHouse ? (
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Showing:</span>
                <span style={styles.summaryValue}>
                  {filteredCharacters.length}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterList;
