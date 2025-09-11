import { useState, useEffect } from "react";
import {
  Users,
  User,
  Home,
  Briefcase,
  BookOpen,
  Zap,
  Search,
  X,
  Loader,
  Edit3,
  Save,
  Heart,
  UserX,
  AlertTriangle,
  Tag,
  Plus,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getOtherPlayersStyles } from "./styles";
import { ALL_CHARACTERS } from "../../SharedData/charactersData";

const DEFAULT_PC_TAGS = [
  "Study Partner",
  "Ally",
  "Rival",
  "Friend",
  "Teammate",
  "Mentor",
  "Protégé",
  "Trustworthy",
  "Unreliable",
  "Helpful",
  "Competitive",
  "Mysterious",
];

const RelationshipBadge = ({ relationship, theme }) => {
  const getRelationshipStyle = (rel) => {
    switch (rel) {
      case "ally":
        return { color: "#10b981", icon: Heart, label: "Ally" };
      case "enemy":
        return { color: "#ef4444", icon: UserX, label: "Enemy" };
      case "neutral":
        return { color: "#6b7280", icon: User, label: "Neutral" };
      case "rival":
        return { color: "#f59e0b", icon: AlertTriangle, label: "Rival" };
      default:
        return { color: theme.textSecondary, icon: User, label: "Unknown" };
    }
  };

  const style = getRelationshipStyle(relationship);
  const IconComponent = style.icon;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 6px",
        borderRadius: "12px",
        backgroundColor: style.color + "20",
        border: `1px solid ${style.color}40`,
        fontSize: "11px",
        fontWeight: "500",
        color: style.color,
      }}
    >
      <IconComponent size={12} />
      {style.label}
    </div>
  );
};

const CustomTag = ({ tag, onRemove, theme, removable = false }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 6px",
        borderRadius: "12px",
        backgroundColor: theme.primary + "20",
        border: `1px solid ${theme.primary}40`,
        fontSize: "10px",
        fontWeight: "500",
        color: theme.primary,
        maxWidth: "120px",
      }}
    >
      <Tag size={10} />
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {tag}
      </span>
      {removable && (
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            color: theme.primary,
            cursor: "pointer",
            padding: "0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
};

const TagSelector = ({ existingTags, onAddTag, theme }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customTag, setCustomTag] = useState("");

  const availableTags = DEFAULT_PC_TAGS.filter(
    (tag) => !existingTags.includes(tag)
  );

  const handleAddCustomTag = () => {
    if (customTag.trim() && !existingTags.includes(customTag.trim())) {
      onAddTag(customTag.trim());
      setCustomTag("");
      setShowSuggestions(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowSuggestions(!showSuggestions)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 8px",
          fontSize: "11px",
          backgroundColor: theme.surface,
          color: theme.textSecondary,
          border: `1px dashed ${theme.border}`,
          borderRadius: "4px",
          cursor: "pointer",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Plus size={12} />
        Add Tag
      </button>

      {showSuggestions && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "4px",
            boxShadow: `0 2px 8px ${theme.textSecondary}20`,
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <div style={{ padding: "8px" }}>
            <input
              type="text"
              placeholder="Create custom tag..."
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCustomTag()}
              style={{
                width: "100%",
                padding: "4px",
                fontSize: "11px",
                border: `1px solid ${theme.border}`,
                borderRadius: "4px",
                backgroundColor: theme.background,
                color: theme.text,
                marginBottom: "8px",
              }}
            />
            {availableTags.length > 0 && (
              <div
                style={{
                  fontSize: "10px",
                  color: theme.textSecondary,
                  marginBottom: "4px",
                }}
              >
                Suggestions:
              </div>
            )}
            {availableTags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  onAddTag(tag);
                  setShowSuggestions(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "4px 8px",
                  fontSize: "11px",
                  backgroundColor: "transparent",
                  color: theme.text,
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "2px",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PlayerCard = ({
  character,
  theme,
  styles,
  pcNote,
  onUpdateNote,
  supabase,
  currentCharacterId,
  discordUserId,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(pcNote?.notes || "");
  const [relationship, setRelationship] = useState(
    pcNote?.relationship || "unknown"
  );
  const [lastInteraction, setLastInteraction] = useState(
    pcNote?.last_interaction || ""
  );
  const [customTags, setCustomTags] = useState(pcNote?.custom_tags || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (pcNote) {
      setNoteText(pcNote.notes || "");
      setRelationship(pcNote.relationship || "unknown");
      setLastInteraction(pcNote.last_interaction || "");
      setCustomTags(pcNote.custom_tags || []);
    }
  }, [pcNote]);

  const handleSaveNote = async () => {
    if (!currentCharacterId || !discordUserId) return;

    setIsSaving(true);
    try {
      const noteData = {
        character_id: currentCharacterId,
        discord_user_id: discordUserId,
        pc_name: character.name,
        pc_school: character.school,
        pc_clan: character.house,
        notes: noteText.trim(),
        relationship: relationship,
        last_interaction: lastInteraction.trim(),
        custom_tags: customTags,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("character_pc_notes")
        .upsert(noteData, {
          onConflict: "character_id,discord_user_id,pc_name",
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) throw error;

      setIsEditingNote(false);
      onUpdateNote(character.name, { ...noteData, id: data.id });
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setNoteText(pcNote?.notes || "");
    setRelationship(pcNote?.relationship || "unknown");
    setLastInteraction(pcNote?.last_interaction || "");
    setCustomTags(pcNote?.custom_tags || []);
    setIsEditingNote(false);
  };

  const handleAddTag = (tag) => {
    if (!customTags.includes(tag)) {
      setCustomTags([...customTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setCustomTags(customTags.filter((tag) => tag !== tagToRemove));
  };

  const hasNote =
    pcNote &&
    (pcNote.notes?.trim() ||
      pcNote.relationship !== "unknown" ||
      pcNote.last_interaction?.trim() ||
      (pcNote.custom_tags && pcNote.custom_tags.length > 0));

  return (
    <div style={styles.playerCard}>
      <div style={styles.imageContainer}>
        {character.image_url && !imageError ? (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {!imageLoaded && (
              <div
                style={{
                  ...styles.imagePlaceholder,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                  backgroundColor: theme.background,
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: `3px solid ${theme.border}`,
                    borderTop: `3px solid ${theme.primary}`,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span style={{ ...styles.placeholderText, marginTop: "8px" }}>
                  Loading...
                </span>
              </div>
            )}
            <img
              src={character.image_url}
              alt={character.name}
              style={{
                ...styles.playerImage,
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
              loading="lazy"
              onError={() => setImageError(true)}
              onLoad={() => {
                setImageError(false);
                setImageLoaded(true);
              }}
              decoding="async"
            />
          </div>
        ) : (
          <div style={styles.imagePlaceholder}>
            <User size={48} color={theme.textSecondary} />
            <span style={styles.placeholderText}>No Image</span>
          </div>
        )}
      </div>

      <div style={styles.playerInfo}>
        <h3 style={styles.playerName}>{character.name}</h3>
        <div style={styles.playerDetails}>
          {character.house && (
            <div style={styles.detailRow}>
              <Home size={14} color={theme.primary} />
              <span>{character.house}</span>
            </div>
          )}
          {character.casting_style && (
            <div style={styles.detailRow}>
              <Zap size={14} color={theme.primary} />
              <span>{character.casting_style}</span>
            </div>
          )}
          {character.subclass && (
            <div style={styles.detailRow}>
              <BookOpen size={14} color={theme.primary} />
              <span>{character.subclass}</span>
            </div>
          )}
          {character.background && (
            <div style={styles.detailRow}>
              <Briefcase size={14} color={theme.primary} />
              <span>{character.background}</span>
            </div>
          )}
        </div>

        {hasNote && !isEditingNote && (
          <div style={{ marginTop: "8px", marginBottom: "8px" }}>
            <RelationshipBadge
              relationship={pcNote.relationship}
              theme={theme}
            />
            {pcNote.custom_tags && pcNote.custom_tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  marginTop: "6px",
                }}
              >
                {pcNote.custom_tags.map((tag, index) => (
                  <CustomTag key={index} tag={tag} theme={theme} />
                ))}
              </div>
            )}
          </div>
        )}

        <div
          style={{
            marginTop: "12px",
            borderTop: `1px solid ${theme.border}`,
            paddingTop: "12px",
          }}
        >
          {!isEditingNote ? (
            <div>
              {hasNote ? (
                <div
                  style={{
                    fontSize: "12px",
                    color: theme.text,
                    backgroundColor: theme.surface,
                    padding: "8px",
                    borderRadius: "4px",
                    marginBottom: "8px",
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {pcNote.notes}
                </div>
              ) : null}
              {pcNote?.last_interaction && (
                <div
                  style={{
                    fontSize: "11px",
                    color: theme.textSecondary,
                    fontStyle: "italic",
                    marginBottom: hasNote && pcNote.notes ? "0" : "8px",
                  }}
                >
                  Last interaction: {pcNote.last_interaction}
                </div>
              )}
              {!hasNote && (
                <div
                  style={{
                    fontSize: "11px",
                    color: theme.textSecondary,
                    fontStyle: "italic",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
                  No notes yet...
                </div>
              )}
              <button
                onClick={() => {
                  setNoteText(pcNote?.notes || "");
                  setRelationship(pcNote?.relationship || "unknown");
                  setLastInteraction(pcNote?.last_interaction || "");
                  setCustomTags(pcNote?.custom_tags || []);
                  setIsEditingNote(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 10px",
                  fontSize: "11px",
                  backgroundColor: theme.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Edit3 size={12} />
                {hasNote ? "Edit Notes" : "Add Notes"}
              </button>
            </div>
          ) : (
            <div>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add notes about this player..."
                style={{
                  width: "100%",
                  minHeight: "80px",
                  padding: "6px",
                  fontSize: "12px",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "4px",
                  backgroundColor: theme.surface,
                  color: theme.text,
                  resize: "vertical",
                  fontFamily: "inherit",
                  marginBottom: "8px",
                }}
              />

              <div style={{ marginBottom: "8px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "10px",
                    color: theme.textSecondary,
                    marginBottom: "2px",
                    fontWeight: "500",
                  }}
                >
                  Relationship:
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "4px",
                    fontSize: "11px",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "4px",
                    backgroundColor: theme.surface,
                    color: theme.text,
                  }}
                >
                  <option value="unknown">Unknown</option>
                  <option value="ally">Ally</option>
                  <option value="neutral">Neutral</option>
                  <option value="rival">Rival</option>
                  <option value="enemy">Enemy</option>
                </select>
              </div>

              <div style={{ marginBottom: "8px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "10px",
                    color: theme.textSecondary,
                    marginBottom: "2px",
                    fontWeight: "500",
                  }}
                >
                  Custom Tags:
                </label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginBottom: "4px",
                  }}
                >
                  {customTags.map((tag, index) => (
                    <CustomTag
                      key={index}
                      tag={tag}
                      theme={theme}
                      removable={true}
                      onRemove={() => handleRemoveTag(tag)}
                    />
                  ))}
                </div>
                <TagSelector
                  existingTags={customTags}
                  onAddTag={handleAddTag}
                  theme={theme}
                />
              </div>

              <div style={{ marginBottom: "8px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "10px",
                    color: theme.textSecondary,
                    marginBottom: "2px",
                    fontWeight: "500",
                  }}
                >
                  Last Interaction:
                </label>
                <input
                  type="text"
                  value={lastInteraction}
                  onChange={(e) => setLastInteraction(e.target.value)}
                  placeholder="When/where did you last interact?"
                  style={{
                    width: "100%",
                    padding: "4px",
                    fontSize: "11px",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "4px",
                    backgroundColor: theme.surface,
                    color: theme.text,
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  onClick={handleSaveNote}
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    padding: "6px 10px",
                    fontSize: "11px",
                    backgroundColor: theme.success || "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.6 : 1,
                  }}
                >
                  <Save size={12} />
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    padding: "6px 10px",
                    fontSize: "11px",
                    backgroundColor: theme.textSecondary,
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.6 : 1,
                  }}
                >
                  <X size={12} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const OtherPlayers = ({ selectedCharacter, supabase, user }) => {
  const { theme } = useTheme();
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [pcNotes, setPcNotes] = useState({});

  const discordUserId = user?.user_metadata?.provider_id;

  const npcNames = new Set(ALL_CHARACTERS.map((npc) => npc.name));

  useEffect(() => {
    if (selectedCharacter?.gameSession && supabase) {
      loadOtherPlayers();
    }
  }, [selectedCharacter?.id, selectedCharacter?.gameSession]);

  useEffect(() => {
    if (selectedCharacter && discordUserId && supabase) {
      loadPcNotes();
    }
  }, [selectedCharacter?.id, discordUserId]);

  const loadOtherPlayers = async () => {
    if (!selectedCharacter?.gameSession) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(
        "Selected character gameSession:",
        selectedCharacter.gameSession
      );

      const { data: characters, error: fetchError } = await supabase
        .from("characters")
        .select("*")
        .eq("active", true)
        .eq("game_session", selectedCharacter.gameSession)
        .neq("id", selectedCharacter.id)
        .order("name", { ascending: true });

      if (fetchError) throw fetchError;

      console.log("Fetched characters from same session:", characters?.length);

      setOtherPlayers(characters || []);
    } catch (err) {
      console.error("Error loading other players:", err);
      setError("Failed to load other players. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadPcNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("character_pc_notes")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .eq("discord_user_id", discordUserId);

      if (error) throw error;

      const notesMap = {};
      data.forEach((note) => {
        notesMap[note.pc_name] = note;
      });
      setPcNotes(notesMap);
    } catch (error) {
      console.error("Error loading PC notes:", error);
    }
  };

  const updatePcNote = (pcName, noteData) => {
    setPcNotes((prev) => ({
      ...prev,
      [pcName]: noteData,
    }));
  };

  const filteredPlayers = otherPlayers
    .filter((player) => {
      return !npcNames.has(player.name);
    })
    .filter((player) => {
      if (!searchTerm.trim()) return true;

      const searchLower = searchTerm.toLowerCase();
      const note = pcNotes[player.name];

      return (
        player.name?.toLowerCase().includes(searchLower) ||
        player.house?.toLowerCase().includes(searchLower) ||
        player.casting_style?.toLowerCase().includes(searchLower) ||
        player.subclass?.toLowerCase().includes(searchLower) ||
        player.background?.toLowerCase().includes(searchLower) ||
        (note?.notes && note.notes.toLowerCase().includes(searchLower)) ||
        (note?.relationship &&
          note.relationship.toLowerCase().includes(searchLower)) ||
        (note?.custom_tags &&
          note.custom_tags.some((tag) =>
            tag.toLowerCase().includes(searchLower)
          ))
      );
    });

  const styles = getOtherPlayersStyles(theme);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!selectedCharacter) {
    return (
      <div style={styles.noCharacterContainer}>
        <Users size={64} color={theme.textSecondary} />
        <h2 style={styles.noCharacterTitle}>No Character Selected</h2>
        <p style={styles.noCharacterText}>
          Please select a character to view other players in your game session.
        </p>
      </div>
    );
  }

  if (!selectedCharacter.gameSession) {
    return (
      <div style={styles.noSessionContainer}>
        <Users size={64} color={theme.textSecondary} />
        <h2 style={styles.noSessionTitle}>No Game Session</h2>
        <p style={styles.noSessionText}>
          Your character is not assigned to a game session. Contact your DM to
          be added to a session.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader
          size={48}
          color={theme.primary}
          style={{ animation: "spin 1s linear infinite" }}
        />
        <p style={styles.loadingText}>Loading other players...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <X size={48} color={theme.error} />
        <h2 style={styles.errorTitle}>Error</h2>
        <p style={styles.errorText}>{error}</p>
        <button onClick={loadOtherPlayers} style={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Other Players in {selectedCharacter.gameSession}
        </h1>
        <p style={styles.subtitle}>
          {filteredPlayers.length} player
          {filteredPlayers.length !== 1 ? "s" : ""} in your session
        </p>
      </div>

      {otherPlayers.length > 0 && (
        <div style={styles.searchContainer}>
          <div style={styles.searchInputContainer}>
            <Search size={20} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search players by name, house, casting style, subclass, background, notes, relationship, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                ...styles.searchInput,
                borderColor: searchTerm ? theme.primary : theme.border,
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={styles.clearButton}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {filteredPlayers.length > 0 ? (
        <div style={styles.playersGrid}>
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              character={player}
              theme={theme}
              styles={styles}
              pcNote={pcNotes[player.name]}
              onUpdateNote={updatePcNote}
              supabase={supabase}
              currentCharacterId={selectedCharacter.id}
              discordUserId={discordUserId}
            />
          ))}
        </div>
      ) : otherPlayers.length > 0 ? (
        <div style={styles.noResults}>
          <Search size={48} color={theme.textSecondary} />
          <p>No players found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <Users size={64} color={theme.textSecondary} />
          <h2 style={styles.emptyStateTitle}>No Other Players Yet</h2>
          <p style={styles.emptyStateText}>
            You're the first player in this session, or other players haven't
            created their characters yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default OtherPlayers;
