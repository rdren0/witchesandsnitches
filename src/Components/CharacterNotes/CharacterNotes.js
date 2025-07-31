import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Download,
  Upload,
  Zap,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Copy,
  Crown,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { templates } from "./templates";

import { useTheme } from "../../contexts/ThemeContext";
import { createCharacterNotesStyles } from "../../styles/masterStyles";

export const CharacterNotes = ({
  user,
  selectedCharacter,
  supabase,
  adminMode = false,
  isUserAdmin = false,
}) => {
  const { theme } = useTheme();
  const styles = createCharacterNotesStyles(theme);

  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [duplicatingEntryId, setDuplicatingEntryId] = useState(null);
  const [notesOwner, setNotesOwner] = useState(null);

  const loadCharacterNotes = useCallback(async () => {
    if (!selectedCharacter?.id || !user) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from("character_notes")
        .select("notes, updated_at, user_id")
        .eq("character_id", selectedCharacter.id);

      if (!adminMode || !isUserAdmin) {
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query.maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data?.notes) {
        if (adminMode && isUserAdmin && data.user_id !== user.id) {
          setNotesOwner(data.user_id);
        } else {
          setNotesOwner(null);
        }

        try {
          const parsedEntries = JSON.parse(data.notes);
          if (Array.isArray(parsedEntries)) {
            setEntries(parsedEntries);
          } else {
            setEntries([
              {
                id: Date.now(),
                title: "Legacy Notes",
                content: data.notes,
                created_at: data.updated_at,
                updated_at: data.updated_at,
              },
            ]);
          }
        } catch {
          setEntries([
            {
              id: Date.now(),
              title: "Legacy Notes",
              content: data.notes,
              created_at: data.updated_at,
              updated_at: data.updated_at,
            },
          ]);
        }
      } else {
        setEntries([]);
        setNotesOwner(null);
      }
    } catch (err) {
      console.error("Error loading character notes:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCharacter?.id, user?.id, supabase, adminMode, isUserAdmin]);

  useEffect(() => {
    if (selectedCharacter?.id) {
      loadCharacterNotes();
    } else {
      setEntries([]);
      setNotesOwner(null);
      setIsLoading(false);
    }
  }, [selectedCharacter?.id, loadCharacterNotes]);

  const saveEntriesToDatabase = async (newEntries) => {
    if (!selectedCharacter?.id || !user) return;

    try {
      const targetUserId =
        adminMode && isUserAdmin && notesOwner ? notesOwner : user.id;

      const { error } = await supabase.from("character_notes").upsert(
        {
          character_id: selectedCharacter.id,
          user_id: targetUserId,
          notes: JSON.stringify(newEntries),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "character_id,user_id",
        }
      );

      if (error) throw error;
    } catch (err) {
      console.error("Error saving character notes:", err);
      throw err;
    }
  };

  const createNewEntry = async (title, content = "", templateType = null) => {
    if (!selectedCharacter?.id || !user) return;

    let finalTitle = title?.trim();
    if (!finalTitle) {
      if (templateType) {
        const templateNames = {
          spell: "New Spell",
          session: `Session ${new Date().toLocaleDateString()}`,
          combat: "Combat Tactics",
          relationship: "Character Relationship",
          creature: "Magical Creature",
        };
        finalTitle = templateNames[templateType];
      } else {
        finalTitle = `Note ${new Date().toLocaleString()}`;
      }
    }

    const finalContent = templateType ? templates[templateType] : content;
    const now = new Date().toISOString();

    const newEntry = {
      id: Date.now(),
      title: finalTitle,
      content: finalContent,
      created_at: now,
      updated_at: now,
    };

    try {
      const newEntries = [newEntry, ...entries];
      await saveEntriesToDatabase(newEntries);
      setEntries(newEntries);
      setNewEntryTitle("");
      setShowNewEntryForm(false);
    } catch (err) {
      console.error("Error creating entry:", err);
      alert("Failed to create entry. Please try again.");
    }
  };

  const duplicateEntry = async (entry) => {
    if (!entry || !selectedCharacter?.id || !user) return;

    setDuplicatingEntryId(entry.id);

    try {
      const baseName = entry.title;
      const existingTitles = entries.map((e) => e.title.toLowerCase());
      let duplicateTitle = `${baseName} (Copy)`;
      let counter = 1;

      while (existingTitles.includes(duplicateTitle.toLowerCase())) {
        counter++;
        duplicateTitle = `${baseName} (Copy ${counter})`;
      }

      const now = new Date().toISOString();
      const duplicatedEntry = {
        id: Date.now(),
        title: duplicateTitle,
        content: entry.content,
        created_at: now,
        updated_at: now,
      };

      const newEntries = [duplicatedEntry, ...entries];
      await saveEntriesToDatabase(newEntries);
      setEntries(newEntries);
    } catch (err) {
      console.error("Error duplicating entry:", err);
      alert("Failed to duplicate entry. Please try again.");
    } finally {
      setDuplicatingEntryId(null);
    }
  };

  const updateEntry = async (entryId, updates) => {
    try {
      const newEntries = entries.map((entry) =>
        entry.id === entryId
          ? { ...entry, ...updates, updated_at: new Date().toISOString() }
          : entry
      );

      await saveEntriesToDatabase(newEntries);
      setEntries(newEntries);
      setEditingEntry(null);
    } catch (err) {
      console.error("Error updating entry:", err);
      alert("Failed to update entry. Please try again.");
    }
  };

  const deleteEntry = async (entryId) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      const newEntries = entries.filter((entry) => entry.id !== entryId);
      await saveEntriesToDatabase(newEntries);
      setEntries(newEntries);
    } catch (err) {
      console.error("Error deleting entry:", err);
      alert("Failed to delete entry. Please try again.");
    }
  };

  const exportAllNotes = () => {
    const allNotesContent = entries
      .map((entry) => `# ${entry.title}\n\n${entry.content}\n\n---\n\n`)
      .join("");

    const blob = new Blob([allNotesContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedCharacter?.name || "character"}-all-notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importNotes = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const title = file.name.replace(/\.(md|txt)$/, "");
        createNewEntry(title, content);
      };
      reader.readAsText(file);
    }
  };

  const renderAdminModeIndicator = () => {
    if (!adminMode || !isUserAdmin) return null;

    return (
      <div
        style={{
          background: "linear-gradient(135deg, #ffd700, #ffed4e)",
          color: "#8b4513",
          padding: "12px 20px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          border: "2px solid #ffd700",
        }}
      >
        <Crown size={18} />
        ADMIN MODE: Viewing {notesOwner ? "another user's" : "your"} character
        notes
        {notesOwner && " - Changes will be saved to the character's owner"}
      </div>
    );
  };

  if (!selectedCharacter) {
    return (
      <div style={styles.noCharacterContainer}>
        <FileText size={48} color="#dc2626" style={styles.noCharacterIcon} />
        <h2 style={styles.noCharacterTitle}>No Character Selected</h2>
        <p style={styles.noCharacterText}>
          Please select a character from the dropdown above to view and edit
          their notes.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {renderAdminModeIndicator()}

      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            <FileText size={32} color={theme.primary} />
            Character Notes
          </h1>
          <p style={styles.subtitle}>
            {entries.length} note{entries.length !== 1 ? "s" : ""} for{" "}
            {selectedCharacter.name}
            {adminMode && isUserAdmin && notesOwner && (
              <span
                style={{
                  color: theme.warning,
                  fontSize: "14px",
                  marginLeft: "8px",
                }}
              >
                (Owner: {notesOwner})
              </span>
            )}
          </p>
        </div>

        <div style={styles.headerActions}>
          <button
            onClick={() => setShowNewEntryForm(true)}
            style={styles.newEntryButton}
          >
            <Plus size={16} />
            New Entry
          </button>
        </div>
      </div>

      {showNewEntryForm && (
        <div style={styles.newEntryForm}>
          <div>
            <h3 style={styles.newEntryTitle}>Create New Entry</h3>
            <input
              type="text"
              placeholder="Entry title (optional - will auto-generate if empty)"
              value={newEntryTitle}
              onChange={(e) => setNewEntryTitle(e.target.value)}
              style={styles.newEntryInput}
              autoFocus
            />
          </div>

          <div style={styles.templateButtons}>
            <button
              onClick={() => createNewEntry(newEntryTitle)}
              style={styles.templateButton}
            >
              <Zap size={16} />
              Blank Entry
            </button>

            <button
              onClick={() => createNewEntry(newEntryTitle, "", "spell")}
              style={styles.templateButton}
            >
              <Zap size={16} />
              Spell Template
            </button>

            <button
              onClick={() => createNewEntry(newEntryTitle, "", "session")}
              style={styles.templateButton}
            >
              <Calendar size={16} />
              Session Notes
            </button>

            <button
              onClick={() => createNewEntry(newEntryTitle, "", "combat")}
              style={styles.templateButton}
            >
              ⚔️ Combat Tactics
            </button>

            <button
              onClick={() => createNewEntry(newEntryTitle, "", "relationship")}
              style={styles.templateButton}
            >
              👥 Relationship
            </button>
            <button
              onClick={() => createNewEntry(newEntryTitle, "", "creature")}
              style={styles.templateButton}
            >
              🦄 Magical Creature
            </button>
          </div>

          <div style={styles.formActions}>
            <button
              onClick={() => {
                setShowNewEntryForm(false);
                setNewEntryTitle("");
              }}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {editingEntry && entries.find((e) => e.id === editingEntry) && (
        <div style={{ marginBottom: "20px" }}>
          <FullWidthEditForm
            entry={entries.find((e) => e.id === editingEntry)}
            onSave={(updates) => updateEntry(editingEntry, updates)}
            onCancel={() => setEditingEntry(null)}
            styles={styles}
            theme={theme}
          />
        </div>
      )}

      {isLoading ? (
        <div style={styles.loadingContainer}>Loading notes...</div>
      ) : entries.length === 0 ? (
        <div style={styles.emptyContainer}>
          No notes yet. Click "New Entry" to get started!
        </div>
      ) : (
        <div style={styles.entriesGrid}>
          {entries
            .filter((entry) => entry.id !== editingEntry)
            .map((entry) => (
              <div key={entry.id} style={styles.entryCard}>
                <EntryCard
                  entry={entry}
                  onEdit={() => setEditingEntry(entry.id)}
                  onDelete={() => deleteEntry(entry.id)}
                  onDuplicate={() => duplicateEntry(entry)}
                  isDuplicating={duplicatingEntryId === entry.id}
                  styles={styles}
                />
              </div>
            ))}
        </div>
      )}

      <div style={styles.importExportSection}>
        <div style={styles.importExportActions}>
          <button onClick={exportAllNotes} style={styles.exportButton}>
            <Download size={16} />
            Export All
          </button>

          <label style={styles.importLabel}>
            <Upload size={16} />
            Import File
            <input
              type="file"
              accept=".md,.txt"
              onChange={importNotes}
              style={styles.hiddenFileInput}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

const FullWidthEditForm = ({ entry, onSave, onCancel, styles, theme }) => {
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title || "");
      setContent(entry.content || "");
    }
  }, [entry]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEditorReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!entry) {
    return null;
  }

  const handleSave = () => {
    const finalTitle = title.trim() || `Note ${new Date().toLocaleString()}`;
    onSave({ title: finalTitle, content });
  };

  const insertTemplate = (templateType) => {
    const templateContent = templates[templateType] || "";
    setContent(content + "\n\n" + templateContent);
  };

  return (
    <div style={styles.editForm}>
      <div style={styles.editHeader}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.editTitleInput}
        />
        <div style={styles.editActions}>
          <button onClick={handleSave} style={styles.saveButton}>
            <Check size={16} />
            Save Changes
          </button>
          <button onClick={onCancel} style={styles.editCancelButton}>
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>

      <div style={styles.templateSection}>
        <div>
          <h4 style={styles.templateSectionTitle}>📋 Insert Template</h4>
        </div>

        <div style={styles.templateButtons}>
          <button
            onClick={() => insertTemplate("spell")}
            style={styles.templateButton}
          >
            <Zap size={14} />
            Spell
          </button>

          <button
            onClick={() => insertTemplate("session")}
            style={styles.templateButton}
          >
            <Calendar size={14} />
            Session
          </button>

          <button
            onClick={() => insertTemplate("combat")}
            style={styles.templateButton}
          >
            ⚔️ Combat
          </button>

          <button
            onClick={() => insertTemplate("relationship")}
            style={styles.templateButton}
          >
            👥 Relationship
          </button>
        </div>
      </div>

      <div style={styles.editorContainer}>
        {isEditorReady && content !== undefined ? (
          <MDEditor
            value={content}
            onChange={(value) => setContent(value || "")}
            height={500}
            visibleDragBar={false}
            data-color-mode="light"
            preview="edit"
            hideToolbar={false}
          />
        ) : (
          <div style={styles.editorLoading}>Loading editor...</div>
        )}
      </div>
    </div>
  );
};

const EntryCard = ({
  entry,
  onEdit,
  onDelete,
  onDuplicate,
  isDuplicating,
  styles,
}) => {
  const { theme } = useTheme();
  return (
    <>
      <div style={styles.entryHeader}>
        <div style={styles.entryTitleSection}>
          <h3 style={styles.entryTitle}>{entry.title}</h3>
          <p style={styles.entryDate}>
            {new Date(entry.updated_at).toLocaleString()}
          </p>
        </div>
        <div style={styles.entryActions}>
          <button
            onClick={onEdit}
            style={styles.editEntryButton}
            title="Edit entry"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={onDuplicate}
            disabled={isDuplicating}
            style={styles.duplicateEntryButton}
            title="Duplicate entry"
          >
            {isDuplicating ? (
              <span style={{ fontSize: "12px" }}>...</span>
            ) : (
              <Copy size={14} />
            )}
          </button>
          <button
            onClick={onDelete}
            style={styles.deleteEntryButton}
            title="Delete entry"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div style={styles.entryContent}>
        <MDEditor.Markdown
          source={entry.content}
          style={{
            backgroundColor: "transparent",
            color: theme.text,
          }}
        />
      </div>
    </>
  );
};

export default CharacterNotes;
