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
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";

export const CharacterNotes = ({ user, selectedCharacter, supabase }) => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);

  const loadCharacterNotes = useCallback(async () => {
    if (!selectedCharacter?.id || !user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("character_notes")
        .select("notes, updated_at")
        .eq("character_id", selectedCharacter.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data?.notes) {
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
      }
    } catch (err) {
      console.error("Error loading character notes:", err);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [selectedCharacter?.id, user?.id, supabase]);

  useEffect(() => {
    if (selectedCharacter?.id) {
      loadCharacterNotes();
    } else {
      setEntries([]);
      setIsLoading(false);
    }
  }, [selectedCharacter?.id, loadCharacterNotes]);

  const saveEntriesToDatabase = async (newEntries) => {
    if (!selectedCharacter?.id || !user) return;

    try {
      const { error } = await supabase.from("character_notes").upsert(
        {
          character_id: selectedCharacter.id,
          user_id: user.id,
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
        };
        finalTitle = templateNames[templateType];
      } else {
        finalTitle = `Note ${new Date().toLocaleString()}`;
      }
    }

    const templates = {
      spell: `## 🔮 ${finalTitle}

**📊 Stats:**
- **Level:** 
- **School:** 
- **Casting Time:** 
- **Range:** 
- **Components:** 
- **Duration:** 
- **Concentration:** 

**📝 Description:**


**⚔️ Combat Use:**


**🎯 Strategic Notes:**

`,
      session: `# 📅 ${finalTitle}

## 📖 Session Summary


## 🗣️ Important NPCs
| Name | Role | Notes |
|------|------|-------|
|      |      |       |

## 🗺️ Locations Visited


## ⚔️ Combat Encounters


## 🎒 Loot & Rewards


## 📝 Character Development


## 🎯 Next Session Goals
- [ ] 
- [ ] 
- [ ] 

## 💭 Player Notes

`,
      combat: `# ⚔️ ${finalTitle}

## 🛡️ Defensive Options
- 
- 

## ⚡ Offensive Strategies
- 
- 

## 🎭 Roleplay in Combat
- 
- 

## 🤝 Team Synergies
- 
- 

`,
      relationship: `# 👥 ${finalTitle}

**📊 Relationship Status:** 
**🎭 Their Personality:** 
**🎯 Their Goals:** 
**💭 What They Think of Me:** 
**🤝 How I Can Help Them:** 
**⚠️ Potential Conflicts:** 

## 📝 Interaction History


## 🎯 Future Plans

`,
    };

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

  if (!selectedCharacter) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
          backgroundColor: "#fef2f2",
          border: "2px solid #fecaca",
          borderRadius: "12px",
          margin: "20px",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <FileText size={48} color="#dc2626" style={{ marginBottom: "16px" }} />
        <h2 style={{ color: "#dc2626", margin: "0 0 8px 0", fontSize: "24px" }}>
          No Character Selected
        </h2>
        <p style={{ color: "#dc2626", margin: "0", textAlign: "center" }}>
          Please select a character from the dropdown above to view and edit
          their notes.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "12px",
          border: "2px solid #e2e8f0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "28px",
              color: "#1f2937",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <FileText size={32} color="#6366f1" />
            Character Notes
          </h1>
          <p style={{ margin: "0", color: "#6b7280", fontSize: "16px" }}>
            {entries.length} note{entries.length !== 1 ? "s" : ""} for{" "}
            {selectedCharacter.name}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "16px 20px",
            borderRadius: "12px",
            border: "2px solid #e2e8f0",
            marginTop: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={exportAllNotes}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                backgroundColor: "#ecfdf5",
                border: "1px solid #bbf7d0",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
                color: "#065f46",
              }}
            >
              <Download size={16} />
              Export All
            </button>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
                color: "#1e40af",
              }}
            >
              <Upload size={16} />
              Import File
              <input
                type="file"
                accept=".md,.txt"
                onChange={importNotes}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => setShowNewEntryForm(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              backgroundColor: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <Plus size={16} />
            New Entry
          </button>
        </div>
      </div>

      {/* New Entry Form */}
      {showNewEntryForm && (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            border: "2px solid #e2e8f0",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "18px",
                color: "#374151",
              }}
            >
              Create New Entry
            </h3>
            <input
              type="text"
              placeholder="Entry title (optional - will auto-generate if empty)"
              value={newEntryTitle}
              onChange={(e) => setNewEntryTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
              }}
              autoFocus
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            <button
              onClick={() => createNewEntry(newEntryTitle)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                backgroundColor: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <Zap size={16} />
              Blank Entry
            </button>

            <button
              onClick={() => createNewEntry(newEntryTitle, "", "spell")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                backgroundColor: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <Zap size={16} />
              Spell Template
            </button>

            <button
              onClick={() => createNewEntry(newEntryTitle, "", "session")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                backgroundColor: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <Calendar size={16} />
              Session Notes
            </button>

            <button
              onClick={() => createNewEntry(newEntryTitle, "", "combat")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                backgroundColor: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              ⚔️ Combat Tactics
            </button>

            <button
              onClick={() => createNewEntry(newEntryTitle, "", "relationship")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                backgroundColor: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              👥 Relationship
            </button>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => {
                setShowNewEntryForm(false);
                setNewEntryTitle("");
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Editing Entry - Full Width */}
      {editingEntry && entries.find((e) => e.id === editingEntry) && (
        <div style={{ marginBottom: "20px" }}>
          <FullWidthEditForm
            entry={entries.find((e) => e.id === editingEntry)}
            onSave={(updates) => updateEntry(editingEntry, updates)}
            onCancel={() => setEditingEntry(null)}
          />
        </div>
      )}

      {/* Entries Grid */}
      {isLoading ? (
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "16px",
            backgroundColor: "white",
            borderRadius: "12px",
            border: "2px solid #e2e8f0",
          }}
        >
          Loading notes...
        </div>
      ) : entries.length === 0 ? (
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "16px",
            backgroundColor: "white",
            borderRadius: "12px",
            border: "2px solid #e2e8f0",
          }}
        >
          No notes yet. Click "New Entry" to get started!
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: "20px",
          }}
        >
          {entries
            .filter((entry) => entry.id !== editingEntry) // Hide entry being edited
            .map((entry) => (
              <div
                key={entry.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                }}
              >
                <EntryCard
                  entry={entry}
                  onEdit={() => setEditingEntry(entry.id)}
                  onDelete={() => deleteEntry(entry.id)}
                />
              </div>
            ))}
        </div>
      )}

      {/* Export/Import Bar */}
      <div
        style={{
          backgroundColor: "white",
          padding: "16px 20px",
          borderRadius: "12px",
          border: "2px solid #e2e8f0",
          marginTop: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={exportAllNotes}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              backgroundColor: "#ecfdf5",
              border: "1px solid #bbf7d0",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
              color: "#065f46",
            }}
          >
            <Download size={16} />
            Export All
          </button>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
              color: "#1e40af",
            }}
          >
            <Upload size={16} />
            Import File
            <input
              type="file"
              accept=".md,.txt"
              onChange={importNotes}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

const FullWidthEditForm = ({ entry, onSave, onCancel }) => {
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Update state when entry changes
  useEffect(() => {
    if (entry) {
      setTitle(entry.title || "");
      setContent(entry.content || "");
    }
  }, [entry]);

  // Small delay to ensure DOM is ready for MDEditor
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
    const templates = {
      spell: `## 🔮 [Spell Name]

**📊 Stats:**
- **Level:** 
- **School:** 
- **Casting Time:** 
- **Range:** 
- **Components:** 
- **Duration:** 
- **Concentration:** 

**📝 Description:**


**⚔️ Combat Use:**


**🎯 Strategic Notes:**


---

`,
      session: `# 📅 Session ${new Date().toLocaleDateString()}

## 📖 Session Summary


## 🗣️ Important NPCs
| Name | Role | Notes |
|------|------|-------|
|      |      |       |

## 🗺️ Locations Visited


## ⚔️ Combat Encounters


## 🎒 Loot & Rewards


## 📝 Character Development


## 🎯 Next Session Goals
- [ ] 
- [ ] 
- [ ] 

## 💭 Player Notes


---

`,
      combat: `## ⚔️ Combat Tactics

### 🛡️ Defensive Options
- 
- 

### ⚡ Offensive Strategies
- 
- 

### 🎭 Roleplay in Combat
- 
- 

### 🤝 Team Synergies
- 
- 

---

`,
      relationship: `## 👥 Relationship: [NPC Name]

**📊 Relationship Status:** 
**🎭 Their Personality:** 
**🎯 Their Goals:** 
**💭 What They Think of Me:** 
**🤝 How I Can Help Them:** 
**⚠️ Potential Conflicts:** 

### 📝 Interaction History


### 🎯 Future Plans


---

`,
    };

    const templateContent = templates[templateType] || "";
    setContent(content + "\n\n" + templateContent);
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        border: "2px solid #e2e8f0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "18px",
            fontWeight: "600",
            marginRight: "12px",
          }}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleSave}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ecfdf5",
              border: "1px solid #bbf7d0",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "#065f46",
              fontSize: "14px",
              fontWeight: "600",
              gap: "6px",
            }}
          >
            <Check size={16} />
            Save Changes
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              fontWeight: "600",
              gap: "6px",
            }}
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>

      {/* Templates */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
        }}
      >
        <div style={{ marginBottom: "12px" }}>
          <h4
            style={{
              margin: "0",
              fontSize: "14px",
              color: "#374151",
              fontWeight: "600",
            }}
          >
            📋 Insert Template
          </h4>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => insertTemplate("spell")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 10px",
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <Zap size={14} />
            Spell
          </button>

          <button
            onClick={() => insertTemplate("session")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 10px",
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <Calendar size={14} />
            Session
          </button>

          <button
            onClick={() => insertTemplate("combat")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 10px",
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            ⚔️ Combat
          </button>

          <button
            onClick={() => insertTemplate("relationship")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 10px",
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            👥 Relationship
          </button>
        </div>
      </div>

      {/* Editor */}
      <div style={{ padding: "20px" }}>
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
          <div
            style={{
              height: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              color: "#6b7280",
            }}
          >
            Loading editor...
          </div>
        )}
      </div>
    </div>
  );
};

const EntryCard = ({ entry, onEdit, onDelete }) => {
  return (
    <>
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: "0 0 4px 0",
              fontSize: "18px",
              color: "#1f2937",
              fontWeight: "600",
            }}
          >
            {entry.title}
          </h3>
          <p
            style={{
              margin: "0",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            {new Date(entry.updated_at).toLocaleString()}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", marginLeft: "12px" }}>
          <button
            onClick={onEdit}
            style={{
              padding: "6px",
              backgroundColor: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            title="Edit entry"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: "6px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "#dc2626",
            }}
            title="Delete entry"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div style={{ padding: "20px" }}>
        <MDEditor.Markdown
          source={entry.content}
          style={{
            backgroundColor: "transparent",
            color: "#374151",
          }}
        />
      </div>
    </>
  );
};
