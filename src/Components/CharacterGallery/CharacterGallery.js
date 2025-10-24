import { useState, useEffect } from "react";
import {
  Users,
  ChevronDown,
  ChevronUp,
  Calendar,
  GraduationCap,
  Search,
  X,
  Save,
  Heart,
  UserX,
  User,
  AlertTriangle,
  Tag,
  Plus,
  Edit3,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getCharacterGalleryStyles } from "./styles";
import { ALL_CHARACTERS } from "../../SharedData/charactersData";
import { filterNPCGalleryCharacters } from "../../utils/characterFiltering";

const DEFAULT_TAGS = [
  "Study Buddy",
  "Rival",
  "Crush",
  "Quidditch Player",
  "Prefect",
  "Knows Secret",
  "Trustworthy",
  "Suspicious",
  "Helpful",
  "Dangerous",
  "????",
];

const RelationshipBadge = ({ relationship, theme }) => {
  const getRelationshipStyle = (rel) => {
    switch (rel) {
      case "friend":
        return { color: "#10b981", icon: Heart, label: "Friend" };
      case "enemy":
        return { color: "#ef4444", icon: UserX, label: "Enemy" };
      case "neutral":
        return { color: "#6b7280", icon: User, label: "Neutral" };
      case "suspicious":
        return { color: "#f59e0b", icon: AlertTriangle, label: "Suspicious" };
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

  const availableTags = DEFAULT_TAGS.filter(
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
const ConnectionManager = ({
  connections,
  onAddConnection,
  onRemoveConnection,
  theme,
  characters,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [characterSearch, setCharacterSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [relationshipType, setRelationshipType] = useState("");
  const [description, setDescription] = useState("");

  const relationshipTypes = [
    "Sibling",
    "Parent",
    "Child",
    "Friend",
    "Rival",
    "Romantic Interest",
    "Mentor",
    "Student",
    "Colleague",
    "Enemy",
    "Ally",
    "Acquaintance",
    "Other",
  ];

  const filteredCharacters = characters
    ? characters
        .filter(
          (char) =>
            char.name.toLowerCase().includes(characterSearch.toLowerCase()) &&
            !connections.some((conn) => conn.character_name === char.name)
        )
        .slice(0, 10)
    : [];

  const handleAddConnection = () => {
    if (selectedCharacter && relationshipType) {
      onAddConnection({
        character_name: selectedCharacter,
        relationship_type: relationshipType,
        description: description,
      });
      setSelectedCharacter("");
      setCharacterSearch("");
      setRelationshipType("");
      setDescription("");
      setShowAddForm(false);
      setShowSuggestions(false);
    }
  };

  const handleCharacterSelect = (characterName) => {
    setSelectedCharacter(characterName);
    setCharacterSearch(characterName);
    setShowSuggestions(false);
  };

  return (
    <div style={{ marginBottom: "8px" }}>
      <label
        style={{
          display: "block",
          fontSize: "10px",
          color: theme.textSecondary,
          marginBottom: "4px",
          fontWeight: "500",
        }}
      >
        Character Connections:
      </label>

      {connections.length > 0 && (
        <div style={{ marginBottom: "8px" }}>
          {connections.map((connection, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 6px",
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "4px",
                marginBottom: "4px",
                fontSize: "11px",
              }}
            >
              <div>
                <strong>{connection.character_name}</strong>
                <span style={{ color: theme.textSecondary }}>
                  {" "}
                  • {connection.relationship_type}
                </span>
                {connection.description && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: theme.textSecondary,
                      marginTop: "2px",
                    }}
                  >
                    {connection.description}
                  </div>
                )}
              </div>
              <button
                onClick={() => onRemoveConnection(index)}
                style={{
                  background: "none",
                  border: "none",
                  color: theme.error || "#ef4444",
                  cursor: "pointer",
                  padding: "2px",
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
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
          Add Connection
        </button>
      ) : (
        <div
          style={{
            padding: "8px",
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "4px",
          }}
        >
          <div style={{ marginBottom: "6px", position: "relative" }}>
            <input
              type="text"
              placeholder="Search for character..."
              value={characterSearch}
              onChange={(e) => {
                setCharacterSearch(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
                setSelectedCharacter("");
              }}
              onFocus={() => setShowSuggestions(characterSearch.length > 0)}
              style={{
                width: "100%",
                padding: "4px",
                fontSize: "11px",
                border: `1px solid ${theme.border}`,
                borderRadius: "4px",
                backgroundColor: theme.background,
                color: theme.text,
                marginBottom: "4px",
              }}
            />
            {showSuggestions && filteredCharacters.length > 0 && (
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
                  maxHeight: "150px",
                  overflowY: "auto",
                }}
              >
                {filteredCharacters.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => handleCharacterSelect(character.name)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "6px 8px",
                      fontSize: "11px",
                      backgroundColor: "transparent",
                      color: theme.text,
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = theme.primary + "20")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <div>
                      <strong>{character.name}</strong>
                      <div
                        style={{ fontSize: "10px", color: theme.textSecondary }}
                      >
                        {character.school} • {character.type}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <select
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value)}
              style={{
                width: "100%",
                padding: "4px",
                fontSize: "11px",
                border: `1px solid ${theme.border}`,
                borderRadius: "4px",
                backgroundColor: theme.background,
                color: theme.text,
                marginBottom: "4px",
              }}
            >
              <option value="">Select relationship type...</option>
              {relationshipTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "4px",
                fontSize: "11px",
                border: `1px solid ${theme.border}`,
                borderRadius: "4px",
                backgroundColor: theme.background,
                color: theme.text,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={handleAddConnection}
              disabled={!selectedCharacter || !relationshipType}
              style={{
                flex: 1,
                padding: "4px 8px",
                fontSize: "11px",
                backgroundColor: theme.primary,
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor:
                  selectedCharacter && relationshipType
                    ? "pointer"
                    : "not-allowed",
                opacity: selectedCharacter && relationshipType ? 1 : 0.5,
              }}
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                flex: 1,
                padding: "4px 8px",
                fontSize: "11px",
                backgroundColor: theme.textSecondary,
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CharacterCard = ({
  character,
  theme,
  styles,
  selectedCharacter,
  npcNote,
  onUpdateNote,
  supabase,
  discordUserId,
  characters,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(npcNote?.notes || "");
  const [relationship, setRelationship] = useState(
    npcNote?.relationship || "unknown"
  );
  const [lastInteraction, setLastInteraction] = useState(
    npcNote?.last_interaction || ""
  );
  const [customTags, setCustomTags] = useState(npcNote?.custom_tags || []);
  const [connections, setConnections] = useState(npcNote?.connections || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (npcNote) {
      setNoteText(npcNote.notes || "");
      setRelationship(npcNote.relationship || "unknown");
      setLastInteraction(npcNote.last_interaction || "");
      setCustomTags(npcNote.custom_tags || []);
      setConnections(npcNote.connections || []);
    }
  }, [npcNote]);

  const handleSaveNote = async () => {
    if (!selectedCharacter || !discordUserId) return;

    setIsSaving(true);
    try {
      const noteData = {
        character_id: selectedCharacter.id,
        discord_user_id: discordUserId,
        npc_name: character.name,
        npc_school: character.school,
        npc_type: character.type,
        notes: noteText.trim(),
        relationship: relationship,
        last_interaction: lastInteraction.trim(),
        custom_tags: customTags,
        connections: connections,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("character_npc_notes")
        .upsert(noteData, {
          onConflict: "character_id,discord_user_id,npc_name",
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
    setNoteText(npcNote?.notes || "");
    setRelationship(npcNote?.relationship || "unknown");
    setLastInteraction(npcNote?.last_interaction || "");
    setCustomTags(npcNote?.custom_tags || []);
    setConnections(npcNote?.connections || []);
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

  const handleAddConnection = (connectionData) => {
    const newConnection = {
      character_name: connectionData.character_name,
      relationship_type: connectionData.relationship_type,
      description: connectionData.description || "",
    };
    setConnections([...connections, newConnection]);
  };

  const handleRemoveConnection = (index) => {
    setConnections(connections.filter((_, i) => i !== index));
  };

  const hasNote =
    npcNote &&
    (npcNote.notes?.trim() ||
      npcNote.relationship !== "unknown" ||
      npcNote.last_interaction?.trim() ||
      (npcNote.custom_tags && npcNote.custom_tags.length > 0) ||
      (npcNote.connections && npcNote.connections.length > 0));

  return (
    <div style={styles.characterCard}>
      <div style={styles.imageContainer}>
        {character.src && !imageError ? (
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
              src={character.src}
              alt={character.name}
              style={{
                ...styles.characterImage,
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
            <Users size={48} color={theme.textSecondary} />
            <span style={styles.placeholderText}>No Image</span>
          </div>
        )}
      </div>

      <div style={styles.characterInfo}>
        <h3 style={styles.characterName}>{character.name}</h3>
        <div
          style={{
            fontSize: "14px",
            color: theme.textSecondary,
            marginBottom: "8px",
          }}
        >
          {character.school} • {character.type}
        </div>

        {character.type === "Faculty" && character.subjects && (
          <div
            style={{
              fontSize: "12px",
              color: theme.primary,
              marginBottom: "8px",
              fontWeight: "500",
              padding: "4px 8px",
              backgroundColor: theme.primary + "10",
              borderRadius: "4px",
              border: `1px solid ${theme.primary}20`,
            }}
          >
            <strong>Subject(s):</strong>
            {character.subjects.includes("/") ? (
              <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                {character.subjects.split("/").map((subject, index) => (
                  <li key={index} style={{ marginBottom: "2px" }}>
                    {subject.trim()}
                  </li>
                ))}
              </ul>
            ) : (
              <span> {character.subjects}</span>
            )}
          </div>
        )}

        {hasNote && !isEditingNote && (
          <div style={{ marginBottom: "8px" }}>
            <RelationshipBadge
              relationship={npcNote.relationship}
              theme={theme}
            />
            {npcNote.custom_tags && npcNote.custom_tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  marginTop: "6px",
                }}
              >
                {npcNote.custom_tags.map((tag, index) => (
                  <CustomTag key={index} tag={tag} theme={theme} />
                ))}
              </div>
            )}
            {npcNote.connections && npcNote.connections.length > 0 && (
              <div style={{ marginTop: "6px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    color: theme.textSecondary,
                    marginBottom: "4px",
                    fontWeight: "600",
                  }}
                >
                  CONNECTIONS:
                </div>
                {npcNote.connections.map((connection, index) => (
                  <div
                    key={index}
                    style={{
                      display: "inline-block",
                      backgroundColor: theme.primary + "15",
                      border: `1px solid ${theme.primary}40`,
                      borderRadius: "8px",
                      padding: "2px 6px",
                      fontSize: "10px",
                      color: theme.primary,
                      marginRight: "4px",
                      marginBottom: "2px",
                    }}
                  >
                    <strong>{connection.character_name}</strong>
                    <span style={{ opacity: 0.8 }}>
                      {" "}
                      • {connection.relationship_type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: "8px" }}>
          {!isEditingNote ? (
            <div>
              {hasNote ? (
                <div style={{ marginBottom: "8px" }}>
                  {npcNote.notes && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: theme.text,
                        backgroundColor: theme.surface,
                        padding: "6px",
                        borderRadius: "4px",
                        marginBottom: "4px",
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      {npcNote.notes}
                    </div>
                  )}
                  {npcNote.last_interaction && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: theme.textSecondary,
                        fontStyle: "italic",
                      }}
                    >
                      Last seen: {npcNote.last_interaction}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "11px",
                    color: theme.textSecondary,
                    fontStyle: "italic",
                    marginBottom: "8px",
                  }}
                >
                  No notes yet...
                </div>
              )}
              <button
                onClick={() => {
                  setNoteText(npcNote?.notes || "");
                  setRelationship(npcNote?.relationship || "unknown");
                  setLastInteraction(npcNote?.last_interaction || "");
                  setCustomTags(npcNote?.custom_tags || []);
                  setConnections(npcNote?.connections || []);
                  setIsEditingNote(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 8px",
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
            <div style={{ fontSize: "12px" }}>
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
                  <option value="friend">Friend</option>
                  <option value="neutral">Neutral</option>
                  <option value="suspicious">Suspicious</option>
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

              <ConnectionManager
                connections={connections}
                onAddConnection={handleAddConnection}
                onRemoveConnection={handleRemoveConnection}
                theme={theme}
                characters={characters}
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
                  Notes:
                </label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="What does your character know about this person?"
                  style={{
                    width: "100%",
                    minHeight: "60px",
                    padding: "4px",
                    fontSize: "11px",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "4px",
                    backgroundColor: theme.surface,
                    color: theme.text,
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
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
                  placeholder="When/where did you last see them?"
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
                    padding: "4px 8px",
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
                    padding: "4px 8px",
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

const TypeSection = ({
  type,
  characters,
  theme,
  styles,
  isExpanded,
  onToggle,
  selectedCharacter,
  npcNotes,
  onUpdateNote,
  supabase,
  discordUserId,
  allCharacters,
}) => {
  return (
    <div style={styles.typeSection}>
      <button
        style={{
          ...styles.typeHeader,
          backgroundColor: isExpanded ? theme.primary + "10" : theme.surface,
          borderColor: isExpanded ? theme.primary : theme.border,
          marginLeft: "20px",
        }}
        onClick={onToggle}
      >
        <div style={styles.typeHeaderLeft}>
          <Calendar size={18} color={theme.primary} />
          <h3 style={styles.typeTitle}>{type}</h3>
          <span style={styles.characterCount}>
            ({characters.length} {type.toLowerCase()})
          </span>
        </div>
        <div style={styles.typeHeaderRight}>
          {isExpanded ? (
            <ChevronUp size={18} color={theme.primary} />
          ) : (
            <ChevronDown size={18} color={theme.primary} />
          )}
        </div>
      </button>

      {isExpanded && (
        <div style={{ ...styles.charactersGrid, marginLeft: "20px" }}>
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              theme={theme}
              styles={styles}
              selectedCharacter={selectedCharacter}
              npcNote={npcNotes[character.name]}
              onUpdateNote={onUpdateNote}
              supabase={supabase}
              discordUserId={discordUserId}
              characters={allCharacters}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SchoolSection = ({
  school,
  schoolData,
  theme,
  styles,
  isSchoolExpanded,
  onSchoolToggle,
  expandedTypes,
  onTypeToggle,
  selectedCharacter,
  npcNotes,
  onUpdateNote,
  supabase,
  discordUserId,
  allCharacters,
}) => {
  const totalCharacters = Object.values(schoolData).reduce(
    (sum, chars) => sum + chars.length,
    0
  );

  return (
    <div style={styles.schoolSection}>
      <button
        style={{
          ...styles.schoolHeader,
          backgroundColor: isSchoolExpanded
            ? theme.primary + "15"
            : theme.surface,
          borderColor: isSchoolExpanded ? theme.primary : theme.border,
        }}
        onClick={onSchoolToggle}
      >
        <div style={styles.schoolHeaderLeft}>
          <GraduationCap size={24} color={theme.primary} />
          <h2 style={styles.schoolTitle}>{school}</h2>
          <span style={styles.schoolCount}>
            ({totalCharacters} total characters)
          </span>
        </div>
        <div style={styles.schoolHeaderRight}>
          {isSchoolExpanded ? (
            <ChevronUp size={24} color={theme.primary} />
          ) : (
            <ChevronDown size={24} color={theme.primary} />
          )}
        </div>
      </button>

      {isSchoolExpanded && (
        <div style={styles.schoolContent}>
          {Object.entries(schoolData).map(([type, characters]) => (
            <TypeSection
              key={`${school}-${type}`}
              type={type}
              characters={characters}
              theme={theme}
              styles={styles}
              isExpanded={expandedTypes.has(`${school}-${type}`)}
              onToggle={() => onTypeToggle(`${school}-${type}`)}
              selectedCharacter={selectedCharacter}
              npcNotes={npcNotes}
              onUpdateNote={onUpdateNote}
              supabase={supabase}
              discordUserId={discordUserId}
              allCharacters={allCharacters}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CharacterGallery = ({
  characters = ALL_CHARACTERS,
  selectedCharacter,
  supabase,
  user,
  adminMode = false,
}) => {
  const { theme } = useTheme();
  const [expandedSchools, setExpandedSchools] = useState(() => {
    if (!selectedCharacter?.gameSession) {
      return new Set();
    }

    const gameSession = selectedCharacter.gameSession.toLowerCase();
    const autoOpenSchools = new Set();

    if (gameSession.includes("haunting")) {
      autoOpenSchools.add("Ilvermorny");
    }
    if (gameSession.includes("knights")) {
      autoOpenSchools.add("Hogwarts");
    }
    if (gameSession.includes("jaguaras")) {
      autoOpenSchools.add("Jaguaras");
    }

    return autoOpenSchools;
  });
  const [expandedTypes, setExpandedTypes] = useState(() => {
    if (!selectedCharacter?.gameSession) {
      return new Set();
    }

    const gameSession = selectedCharacter.gameSession.toLowerCase();
    const autoOpenTypes = new Set();

    if (gameSession.includes("haunting")) {
      autoOpenTypes.add("Ilvermorny-Classmate");
    }
    if (gameSession.includes("knights")) {
      autoOpenTypes.add("Hogwarts-Classmate");
    }
    if (gameSession.includes("jaguaras")) {
      autoOpenTypes.add("Jaguaras-Competitor");
    }

    return autoOpenTypes;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [npcNotes, setNpcNotes] = useState({});

  // In admin mode, use the character owner's discord_user_id, otherwise use the logged-in user's
  const discordUserId = adminMode
    ? selectedCharacter?.discord_user_id
    : user?.user_metadata?.provider_id;

  useEffect(() => {
    if (!selectedCharacter?.gameSession) {
      setExpandedSchools(new Set());
      setExpandedTypes(new Set());
      return;
    }

    const gameSession = selectedCharacter.gameSession.toLowerCase();
    const autoOpenSchools = new Set();
    const autoOpenTypes = new Set();

    if (gameSession.includes("haunting")) {
      autoOpenSchools.add("Ilvermorny");
      autoOpenTypes.add("Ilvermorny-Classmate");
    }
    if (gameSession.includes("knights")) {
      autoOpenSchools.add("Hogwarts");
      autoOpenTypes.add("Hogwarts-Classmate");
    }
    if (gameSession.includes("jaguaras")) {
      autoOpenSchools.add("Jaguaras");
      autoOpenTypes.add("Jaguaras-Competitor");
    }

    setExpandedSchools(autoOpenSchools);
    setExpandedTypes(autoOpenTypes);
  }, [selectedCharacter?.gameSession]);

  useEffect(() => {
    if (selectedCharacter && discordUserId && supabase) {
      loadNpcNotes();
    }
  }, [selectedCharacter?.id, discordUserId]);

  const loadNpcNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("character_npc_notes")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .eq("discord_user_id", discordUserId);

      if (error) throw error;

      const notesMap = {};
      data.forEach((note) => {
        notesMap[note.npc_name] = note;
      });
      setNpcNotes(notesMap);
    } catch (error) {
      console.error("Error loading NPC notes:", error);
    }
  };

  const updateNpcNote = (npcName, noteData) => {
    setNpcNotes((prev) => ({
      ...prev,
      [npcName]: noteData,
    }));
  };

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
          textAlign: "center",
          minHeight: "400px",
          backgroundColor: theme.surface,
          borderRadius: "12px",
          border: `2px solid ${theme.border}`,
          margin: "20px",
        }}
      >
        <Users size={64} color={theme.textSecondary} />
        <h2
          style={{
            color: theme.text,
            marginTop: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          No Character Selected
        </h2>
        <p style={{ color: theme.textSecondary, maxWidth: "400px" }}>
          Please select a character to view the NPC gallery. This will allow you
          to track what your character knows about different NPCs and their
          relationships.
        </p>
      </div>
    );
  }

  const filteredCharacters = filterNPCGalleryCharacters(
    characters,
    selectedCharacter?.gameSession
  );

  const charactersBySchool = filteredCharacters.reduce((acc, character) => {
    const school = character.school;
    const type = character.type;

    if (!acc[school]) {
      acc[school] = {};
    }
    if (!acc[school][type]) {
      acc[school][type] = [];
    }
    acc[school][type].push(character);
    return acc;
  }, {});

  const searchResults = filteredCharacters.filter((character) => {
    if (!searchTerm.trim()) return false;

    const searchLower = searchTerm.toLowerCase();
    const note = npcNotes[character.name];

    return (
      character.name.toLowerCase().includes(searchLower) ||
      character.school.toLowerCase().includes(searchLower) ||
      character.type.toLowerCase().includes(searchLower) ||
      (note?.notes && note.notes.toLowerCase().includes(searchLower)) ||
      (note?.relationship &&
        note.relationship.toLowerCase().includes(searchLower)) ||
      (note?.custom_tags &&
        note.custom_tags.some((tag) => tag.toLowerCase().includes(searchLower)))
    );
  });

  const schoolKeys = Object.keys(charactersBySchool).sort((a, b) => {
    const order = { Ilvermorny: 1, Hogwarts: 2, Jaguaras: 3 };
    const aOrder = order[a] || 999;
    const bOrder = order[b] || 999;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    return a.localeCompare(b);
  });

  const toggleSchool = (school) => {
    const newExpanded = new Set(expandedSchools);
    if (newExpanded.has(school)) {
      newExpanded.delete(school);
    } else {
      newExpanded.add(school);
    }
    setExpandedSchools(newExpanded);
  };

  const toggleType = (typeId) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(typeId)) {
      newExpanded.delete(typeId);
    } else {
      newExpanded.add(typeId);
    }
    setExpandedTypes(newExpanded);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const styles = getCharacterGalleryStyles(theme);

  return (
    <div style={styles.container}>
      <div style={styles.searchContainer}>
        <div style={styles.searchInputContainer}>
          <Search size={20} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search NPCs by name, school, type, notes, or tags..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              ...styles.searchInput,
              borderColor: searchTerm ? theme.primary : theme.border,
            }}
          />
          {searchTerm && (
            <button onClick={clearSearch} style={styles.clearButton}>
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {searchTerm && (
        <div style={styles.searchResults}>
          <div style={styles.searchResultsHeader}>
            <h2 style={styles.searchResultsTitle}>Search Results</h2>
            <p style={styles.searchResultsCount}>
              {searchResults.length} character
              {searchResults.length !== 1 ? "s" : ""} found for "{searchTerm}"
            </p>
          </div>
          <div style={styles.searchResultsContent}>
            {searchResults.length > 0 ? (
              <div style={styles.charactersGrid}>
                {searchResults.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    theme={theme}
                    styles={styles}
                    selectedCharacter={selectedCharacter}
                    npcNote={npcNotes[character.name]}
                    onUpdateNote={updateNpcNote}
                    supabase={supabase}
                    discordUserId={discordUserId}
                    characters={characters}
                  />
                ))}
              </div>
            ) : (
              <div style={styles.noResults}>
                <Search size={48} color={theme.textSecondary} />
                <p>No characters found matching "{searchTerm}"</p>
                <p style={{ fontSize: "14px", marginTop: "8px" }}>
                  Try searching by name, school, character type, your notes, or
                  custom tags.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={styles.schoolContainer}>
        {schoolKeys.map((school) => (
          <SchoolSection
            key={school}
            school={school}
            schoolData={charactersBySchool[school]}
            theme={theme}
            styles={styles}
            isSchoolExpanded={expandedSchools.has(school)}
            onSchoolToggle={() => toggleSchool(school)}
            expandedTypes={expandedTypes}
            onTypeToggle={toggleType}
            selectedCharacter={selectedCharacter}
            npcNotes={npcNotes}
            onUpdateNote={updateNpcNote}
            supabase={supabase}
            discordUserId={discordUserId}
            allCharacters={characters}
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterGallery;
