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
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { templates } from "./templates";

import { useTheme } from "../../contexts/ThemeContext";
import { createCharacterNotesStyles } from "./styles";

export const CharacterNotes = ({
  user,
  selectedCharacter,
  supabase,
  adminMode = false,
  isUserAdmin = false,
}) => {
  const { theme } = useTheme();
  const styles = createCharacterNotesStyles(theme);

  const createTemplateCardProps = (onClick) => ({
    style: styles.templateCard,
    onClick,
    onMouseEnter: (e) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.backgroundColor = theme.primary + "08";
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = `0 8px 25px ${theme.primary}20`;

      const icon = e.currentTarget.querySelector(".template-icon");
      if (icon) {
        icon.style.backgroundColor = theme.primary + "25";
        icon.style.color = theme.primary;
        icon.style.transform = "scale(1.05)";
      }
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.backgroundColor = theme.background;
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";

      const icon = e.currentTarget.querySelector(".template-icon");
      if (icon) {
        icon.style.backgroundColor = theme.primary + "15";
        icon.style.color = theme.primary;
        icon.style.transform = "scale(1)";
      }
    },
  });

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
          relationship: "Character Relationship",
          creature: "Magical Creature",
          hogwartsMarkdown: "Default Markdown Template",
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

      setEditingEntry(newEntry.id);

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
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
        <div
          style={styles.newEntryModal}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowNewEntryForm(false);
              setNewEntryTitle("");
            }
          }}
        >
          <div style={styles.newEntryModalContent}>
            <div style={styles.newEntryModalHeader}>
              <h3 style={styles.newEntryModalTitle}>Create New Note</h3>
              <button
                onClick={() => {
                  setShowNewEntryForm(false);
                  setNewEntryTitle("");
                }}
                style={styles.modalCloseButton}
              >
                <X size={20} />
              </button>
            </div>

            <div style={styles.newEntryInputSection}>
              <input
                type="text"
                placeholder="Enter note title (optional)"
                value={newEntryTitle}
                onChange={(e) => setNewEntryTitle(e.target.value)}
                style={styles.newEntryInput}
                autoFocus
              />
            </div>

            <div style={styles.templateSection}>
              <div style={styles.templateSectionHeader}>
                <h4 style={styles.templateSectionTitle}>Quick Start</h4>
                <p style={styles.templateSectionSubtitle}>
                  Choose a template or start blank
                </p>
              </div>

              <div style={styles.templateGrid}>
                <div
                  {...createTemplateCardProps(() =>
                    createNewEntry(newEntryTitle)
                  )}
                >
                  <div
                    style={styles.templateCardIcon}
                    className="template-icon"
                  >
                    <FileText size={24} />
                  </div>
                  <div style={styles.templateCardContent}>
                    <h5 style={styles.templateCardTitle}>Blank Note</h5>
                    <p style={styles.templateCardDescription}>
                      Start with an empty note
                    </p>
                  </div>
                </div>

                <div
                  {...createTemplateCardProps(() =>
                    createNewEntry(newEntryTitle, "", "session")
                  )}
                >
                  <div
                    style={styles.templateCardIcon}
                    className="template-icon"
                  >
                    <Calendar size={24} />
                  </div>
                  <div style={styles.templateCardContent}>
                    <h5 style={styles.templateCardTitle}>Session Notes</h5>
                    <p style={styles.templateCardDescription}>
                      Track what happened this session
                    </p>
                  </div>
                </div>

                <div
                  {...createTemplateCardProps(() =>
                    createNewEntry(newEntryTitle, "", "spell")
                  )}
                >
                  <div
                    style={styles.templateCardIcon}
                    className="template-icon"
                  >
                    <Zap size={24} />
                  </div>
                  <div style={styles.templateCardContent}>
                    <h5 style={styles.templateCardTitle}>Spell Research</h5>
                    <p style={styles.templateCardDescription}>
                      Document spell details & effects
                    </p>
                  </div>
                </div>
                <div
                  {...createTemplateCardProps(() =>
                    createNewEntry(newEntryTitle, "", "relationship")
                  )}
                >
                  <div
                    style={styles.templateCardIcon}
                    className="template-icon"
                  >
                    <span style={styles.templateCardEmoji}>👥</span>
                  </div>
                  <div style={styles.templateCardContent}>
                    <h5 style={styles.templateCardTitle}>Character Notes</h5>
                    <p style={styles.templateCardDescription}>
                      Track NPCs & relationships
                    </p>
                  </div>
                </div>

                <div
                  {...createTemplateCardProps(() =>
                    createNewEntry(newEntryTitle, "", "creature")
                  )}
                >
                  <div
                    style={styles.templateCardIcon}
                    className="template-icon"
                  >
                    <span style={styles.templateCardEmoji}>🦄</span>
                  </div>
                  <div style={styles.templateCardContent}>
                    <h5 style={styles.templateCardTitle}>Magical Creatures</h5>
                    <p style={styles.templateCardDescription}>
                      Catalog creatures & their lore
                    </p>
                  </div>
                </div>
                <div
                  {...createTemplateCardProps(() =>
                    createNewEntry(newEntryTitle, "", "hogwartsMarkdown")
                  )}
                >
                  <div
                    style={styles.templateCardIcon}
                    className="template-icon"
                  >
                    <span style={styles.templateCardEmoji}>🦄</span>
                  </div>
                  <div style={styles.templateCardContent}>
                    <h5 style={styles.templateCardTitle}>Generic Template</h5>
                    <p style={styles.templateCardDescription}>
                      A Comprehensive Markdown Template
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                  onEdit={() => {
                    setEditingEntry(entry.id);

                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                  }}
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
  const [viewMode, setViewMode] = useState("edit");

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

  const isDarkTheme =
    theme.surface === "#1F2937" ||
    theme.surface === "#111827" ||
    theme.text === "#FFFFFF";

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on",
    wordWrap: "on",
    automaticLayout: true,
    fontFamily: '"Fira Code", "Monaco", "Menlo", "Courier New", monospace',
    scrollBeyondLastLine: false,
    renderLineHighlight: "none",
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
          <div style={styles.viewModeButtons}>
            <button
              onClick={() => setViewMode("edit")}
              style={{
                ...styles.viewModeButton,
                ...(viewMode === "edit" ? styles.viewModeButtonActive : {}),
              }}
            >
              Edit
            </button>
            <button
              onClick={() => setViewMode("preview")}
              style={{
                ...styles.viewModeButton,
                ...(viewMode === "preview" ? styles.viewModeButtonActive : {}),
              }}
            >
              Preview
            </button>
            <button
              onClick={() => setViewMode("split")}
              style={{
                ...styles.viewModeButton,
                ...(viewMode === "split" ? styles.viewModeButtonActive : {}),
              }}
            >
              Split
            </button>
          </div>
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
          <h4 style={styles.editTemplateSectionTitle}>📋 Insert Template</h4>
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
          <div
            style={{
              display: "flex",
              height: "500px",
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              backgroundColor: theme.surface,
              overflow: "hidden",
            }}
          >
            {(viewMode === "edit" || viewMode === "split") && (
              <div
                style={{
                  flex: viewMode === "split" ? 1 : 2,
                  minWidth: 0,
                  backgroundColor: theme.surface,
                }}
              >
                <Editor
                  height="100%"
                  language="markdown"
                  value={content}
                  onChange={(value) => setContent(value || "")}
                  options={editorOptions}
                  beforeMount={(monaco) => {
                    monaco.editor.defineTheme("app-theme", {
                      base: isDarkTheme ? "vs-dark" : "vs",
                      inherit: true,
                      rules: [
                        { token: "", foreground: theme.text.replace("#", "") },
                        {
                          token: "text",
                          foreground: theme.text.replace("#", ""),
                        },
                        {
                          token: "keyword",
                          foreground: theme.textSecondary.replace("#", ""),
                          fontStyle: "bold",
                        },
                        {
                          token: "string",
                          foreground: theme.textSecondary.replace("#", ""),
                        },
                        {
                          token: "number",
                          foreground: theme.textSecondary.replace("#", ""),
                        },
                        {
                          token: "comment",
                          foreground: theme.textSecondary.replace("#", ""),
                          fontStyle: "italic",
                        },

                        {
                          token: "emphasis",
                          foreground: theme.textSecondary.replace("#", ""),
                          fontStyle: "italic",
                        },
                        {
                          token: "strong",
                          foreground: theme.textSecondary.replace("#", ""),
                          fontStyle: "bold",
                        },
                        {
                          token: "header.1",
                          foreground: theme.textSecondary.replace("#", ""),
                          fontStyle: "bold",
                        },
                        {
                          token: "header.2",
                          foreground: theme.textSecondary.replace("#", ""),
                          fontStyle: "bold",
                        },
                        {
                          token: "header.3",
                          foreground: theme.textSecondary.replace("#", ""),
                          fontStyle: "bold",
                        },
                        {
                          token: "header.4",
                          foreground: theme.textSecondary.replace("#", ""),
                          fontStyle: "bold",
                        },
                        {
                          token: "header.5",
                          foreground: theme.textSecondary.replace("#", ""),
                          fontStyle: "bold",
                        },
                        {
                          token: "header.6",
                          foreground: theme.textSecondary.replace("#", ""),
                          fontStyle: "bold",
                        },
                        {
                          token: "variable",
                          foreground: theme.text.replace("#", ""),
                        },
                        {
                          token: "variable.name",
                          foreground: theme.text.replace("#", ""),
                        },
                        {
                          token: "variable.value",
                          foreground: theme.text.replace("#", ""),
                        },
                        {
                          token: "meta",
                          foreground: theme.textSecondary.replace("#", ""),
                        },
                        {
                          token: "tag",
                          foreground: theme.textSecondary.replace("#", ""),
                        },
                        {
                          token: "attribute.name",
                          foreground: theme.textSecondary.replace("#", ""),
                        },
                        {
                          token: "attribute.value",
                          foreground: theme.textSecondary.replace("#", ""),
                        },
                      ],
                      colors: {
                        "editor.background": theme.surface,
                        "editor.foreground": theme.text,
                        "editorLineNumber.foreground": theme.textSecondary,
                        "editorLineNumber.activeForeground": theme.text,
                        "editor.selectionBackground": theme.primary + "30",
                        "editor.lineHighlightBackground": theme.background,
                        "editorCursor.foreground": theme.primary,
                        "editor.findMatchBackground": theme.primary + "40",
                        "editor.findMatchHighlightBackground":
                          theme.primary + "20",
                        "scrollbarSlider.background": theme.border + "60",
                        "scrollbarSlider.hoverBackground": theme.border + "80",
                        "scrollbarSlider.activeBackground": theme.border,
                        "editorWidget.background": theme.surface,
                        "editorWidget.foreground": theme.text,
                        "editorSuggestWidget.background": theme.surface,
                        "editorSuggestWidget.foreground": theme.text,
                        "editorHoverWidget.background": theme.surface,
                        "editorHoverWidget.foreground": theme.text,
                      },
                    });
                  }}
                  onMount={(editor, monaco) => {
                    monaco.editor.setTheme("app-theme");
                  }}
                />
              </div>
            )}
            {viewMode === "split" && (
              <div style={{ width: "1px", backgroundColor: theme.border }} />
            )}
            {(viewMode === "preview" || viewMode === "split") && (
              <div
                style={{
                  flex: viewMode === "split" ? 1 : 2,
                  padding: "16px",
                  backgroundColor: theme.background,
                  overflow: "auto",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    color: theme.text,
                    fontFamily: '"Newsreader", serif',
                    lineHeight: "1.6",
                  }}
                  className="themed-markdown"
                >
                  <style>
                    {`
                      .themed-markdown h1, .themed-markdown h2, .themed-markdown h3,
                      .themed-markdown h4, .themed-markdown h5, .themed-markdown h6 {
                        color: ${theme.text};
                        margin: 1em 0 0.5em 0;
                      }
                      .themed-markdown p {
                        color: ${theme.text};
                        margin: 0.5em 0;
                      }
                      .themed-markdown li {
                        color: ${theme.text};
                      }
                      .themed-markdown code {
                        background-color: ${theme.background};
                        color: ${theme.text};
                        padding: 2px 4px;
                        border-radius: 3px;
                        font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
                      }
                      .themed-markdown pre {
                        background-color: ${theme.background};
                        color: ${theme.text};
                        padding: 12px;
                        border-radius: 8px;
                        overflow-x: auto;
                      }
                      .themed-markdown blockquote {
                        border-left: 4px solid ${theme.primary};
                        margin: 0;
                        padding-left: 16px;
                        color: ${theme.textSecondary};
                      }
                      .themed-markdown table {
                        border-collapse: collapse;
                        width: 100%;
                      }
                      .themed-markdown th, .themed-markdown td {
                        border: 1px solid ${theme.border};
                        padding: 8px;
                        color: ${theme.text};
                      }
                      .themed-markdown th {
                        background-color: ${theme.background};
                        font-weight: 600;
                      }
                    `}
                  </style>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content || "*No content to preview*"}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
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
        <div
          style={{
            backgroundColor: "transparent",
            color: theme.text,
            fontFamily: '"Newsreader", serif',
            lineHeight: "1.6",
          }}
          className="themed-markdown"
        >
          <style>
            {`
              .themed-markdown h1, .themed-markdown h2, .themed-markdown h3,
              .themed-markdown h4, .themed-markdown h5, .themed-markdown h6 {
                color: ${theme.text};
                margin: 1em 0 0.5em 0;
              }
              .themed-markdown p {
                color: ${theme.text};
                margin: 0.5em 0;
              }
              .themed-markdown li {
                color: ${theme.text};
              }
              .themed-markdown code {
                background-color: ${theme.background};
                color: ${theme.text};
                padding: 2px 4px;
                border-radius: 3px;
                font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
              }
              .themed-markdown pre {
                background-color: ${theme.background};
                color: ${theme.text};
                padding: 12px;
                border-radius: 8px;
                overflow-x: auto;
              }
              .themed-markdown blockquote {
                border-left: 4px solid ${theme.primary};
                margin: 0;
                padding-left: 16px;
                color: ${theme.textSecondary};
              }
              .themed-markdown table {
                border-collapse: collapse;
                width: 100%;
              }
              .themed-markdown th, .themed-markdown td {
                border: 1px solid ${theme.border};
                padding: 8px;
                color: ${theme.text};
              }
              .themed-markdown th {
                background-color: ${theme.background};
                font-weight: 600;
              }
            `}
          </style>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.content || "*No content*"}</ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default CharacterNotes;
