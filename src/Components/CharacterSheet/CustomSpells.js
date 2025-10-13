import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Loader,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";

const CustomSpells = ({ character, supabase, discordUserId }) => {
  const { theme } = useTheme();
  const [customSpells, setCustomSpells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSpells, setExpandedSpells] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    spell_class: "Charms",
    level: "Cantrip",
    casting_time: "Action",
    range: "Touch",
    check_type: "none",
    save_type: "",
    damage_type: "",
    tags: "",
    damage_dice_count: "",
    damage_dice_type: "d8",
    damage_modifier: "",
    status: "known",
    description: "",
    higher_levels: "",
  });

  const spellClasses = [
    "Charms",
    "Transfiguration",
    "Jinxes, Hexes & Curses",
    "Defense Against the Dark Arts",
    "Healing",
    "Divinations",
    "Elemental",
    "Valiant",
  ];

  const spellLevels = [
    "Cantrip",
    "1st Level",
    "2nd Level",
    "3rd Level",
    "4th Level",
    "5th Level",
    "6th Level",
    "7th Level",
    "8th Level",
    "9th Level",
  ];

  const castingTimes = [
    "Action",
    "Bonus Action",
    "Reaction",
    "1 Minute",
    "10 Minutes",
    "1 Hour",
  ];

  const checkTypes = [
    { value: "none", label: "None" },
    { value: "save", label: "Saving Throw" },
    { value: "attack", label: "Spell Attack" },
  ];

  const saveTypes = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Intelligence",
    "Wisdom",
    "Charisma",
  ];

  const diceTypes = ["d4", "d6", "d8", "d10", "d12", "d20"];

  const spellStatuses = [
    { value: "known", label: "Known" },
    { value: "researched", label: "Researched" },
    { value: "attempted", label: "Attempted" },
    { value: "failed", label: "Failed" },
    { value: "mastered", label: "Mastered" },
  ];

  const loadCustomSpells = useCallback(async () => {
    if (!character?.id || !supabase) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("custom_spells")
        .select("*")
        .eq("character_id", character.id)
        .eq("discord_user_id", character.discord_user_id)
        .order("level", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;

      setCustomSpells(data || []);
    } catch (error) {
      console.error("Error loading custom spells:", error);
    } finally {
      setIsLoading(false);
    }
  }, [character?.id, character?.discord_user_id, supabase]);

  useEffect(() => {
    loadCustomSpells();
  }, [loadCustomSpells]);

  const resetForm = () => {
    setFormData({
      name: "",
      spell_class: "Charms",
      level: "Cantrip",
      casting_time: "Action",
      range: "Touch",
      check_type: "none",
      save_type: "",
      damage_type: "",
      tags: "",
      damage_dice_count: "",
      damage_dice_type: "d8",
      damage_modifier: "",
      status: "known",
      description: "",
      higher_levels: "",
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert("Name and description are required");
      return;
    }

    setIsSaving(true);
    try {
      const spellData = {
        character_id: character.id,
        discord_user_id: character.discord_user_id,
        name: formData.name.trim(),
        spell_class: formData.spell_class,
        level: formData.level,
        casting_time: formData.casting_time,
        range: formData.range,
        duration: null, // No longer used, but table still requires it
        components: null, // No longer used, but table still requires it
        check_type: formData.check_type,
        save_type: formData.check_type === "save" ? formData.save_type : null,
        damage_type: formData.damage_type || null,
        tags: formData.tags.trim() || null,
        damage_dice_count: formData.damage_dice_count
          ? parseInt(formData.damage_dice_count)
          : null,
        damage_dice_type: formData.damage_dice_type || null,
        damage_modifier: formData.damage_modifier
          ? parseInt(formData.damage_modifier)
          : null,
        status: formData.status || "known",
        description: formData.description.trim(),
        higher_levels: formData.higher_levels.trim() || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("custom_spells")
          .update(spellData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("custom_spells")
          .insert([spellData]);

        if (error) throw error;
      }

      await loadCustomSpells();
      resetForm();
    } catch (error) {
      console.error("Error saving custom spell:", error);
      alert("Failed to save spell. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (spell) => {
    setFormData({
      name: spell.name,
      spell_class: spell.spell_class,
      level: spell.level,
      casting_time: spell.casting_time,
      range: spell.range,
      check_type: spell.check_type || "none",
      save_type: spell.save_type || "",
      damage_type: spell.damage_type || "",
      tags: spell.tags || "",
      damage_dice_count: spell.damage_dice_count || "",
      damage_dice_type: spell.damage_dice_type || "d8",
      damage_modifier: spell.damage_modifier || "",
      status: spell.status || "known",
      description: spell.description,
      higher_levels: spell.higher_levels || "",
    });
    setEditingId(spell.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this custom spell?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("custom_spells")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await loadCustomSpells();
    } catch (error) {
      console.error("Error deleting custom spell:", error);
      alert("Failed to delete spell. Please try again.");
    }
  };

  const styles = {
    container: {
      backgroundColor: theme.surface,
      border: `2px solid ${theme.border}`,
      borderRadius: "12px",
      marginBottom: "16px",
      overflow: "hidden",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      cursor: "pointer",
      userSelect: "none",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flex: 1,
    },
    title: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    expandIcon: {
      color: theme.textSecondary,
      transition: "transform 0.2s ease",
    },
    content: {
      padding: "16px",
    },
    addButton: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      backgroundColor: theme.primary,
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    form: {
      backgroundColor: theme.background,
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "16px",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginBottom: "12px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    formGroupFull: {
      gridColumn: "1 / -1",
    },
    label: {
      fontSize: "13px",
      fontWeight: "500",
      color: theme.text,
    },
    input: {
      padding: "8px 12px",
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      color: theme.text,
      fontSize: "14px",
    },
    textarea: {
      padding: "8px 12px",
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      color: theme.text,
      fontSize: "14px",
      minHeight: "80px",
      resize: "vertical",
      fontFamily: "inherit",
    },
    buttonGroup: {
      display: "flex",
      gap: "8px",
      marginTop: "12px",
    },
    saveButton: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      backgroundColor: theme.primary,
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
    },
    cancelButton: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      backgroundColor: theme.warning || "#F97316",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
    },
    spellsList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    spellCard: {
      backgroundColor: theme.background,
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      padding: "12px",
    },
    spellHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "8px",
    },
    spellNameContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    spellName: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
    },
    infoButton: {
      padding: "4px",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      color: theme.textSecondary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "color 0.2s ease",
    },
    spellActions: {
      display: "flex",
      gap: "8px",
    },
    actionButton: {
      padding: "6px",
      backgroundColor: "transparent",
      border: `1px solid ${theme.border}`,
      borderRadius: "4px",
      cursor: "pointer",
      color: theme.text,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    spellMeta: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      fontSize: "13px",
      color: theme.textSecondary,
      marginBottom: "8px",
    },
    metaItem: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    spellDetails: {
      marginTop: "8px",
      padding: "12px",
      backgroundColor: theme.background,
      border: `1px solid ${theme.border}`,
      borderRadius: "4px",
      fontSize: "12px",
    },
    spellDetailRow: {
      marginBottom: "6px",
      lineHeight: "1.4",
      color: theme.text,
    },
    emptyState: {
      textAlign: "center",
      padding: "32px 16px",
      color: theme.textSecondary,
      fontSize: "14px",
    },
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Loader
            size={24}
            color={theme.primary}
            style={{ animation: "spin 1s linear infinite" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={styles.headerLeft}>
          <div style={styles.title}>
            <Sparkles size={16} color={theme.primary} />
            Custom Spells ({customSpells.length})
          </div>
          {isExpanded && (
            <button
              style={styles.addButton}
              onClick={(e) => {
                e.stopPropagation();
                setShowAddForm(!showAddForm);
                if (showAddForm) resetForm();
              }}
            >
              {showAddForm ? <X size={16} /> : <Plus size={16} />}
              {showAddForm ? "Cancel" : "Add Spell"}
            </button>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp size={16} style={styles.expandIcon} />
        ) : (
          <ChevronDown size={16} style={styles.expandIcon} />
        )}
      </div>

      {isExpanded && (
        <div style={styles.content}>
          {showAddForm && (
            <div style={styles.form}>
              <div style={styles.formRow}>
                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                  <label style={styles.label}>Spell Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    style={styles.input}
                    placeholder="Enter spell name"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Class</label>
                  <select
                    value={formData.spell_class}
                    onChange={(e) =>
                      setFormData({ ...formData, spell_class: e.target.value })
                    }
                    style={styles.input}
                  >
                    {spellClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    style={styles.input}
                    placeholder="e.g., Dark, Grim"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    style={styles.input}
                  >
                    {spellLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Casting Time</label>
                  <select
                    value={formData.casting_time}
                    onChange={(e) =>
                      setFormData({ ...formData, casting_time: e.target.value })
                    }
                    style={styles.input}
                  >
                    {castingTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Range</label>
                  <input
                    type="text"
                    value={formData.range}
                    onChange={(e) =>
                      setFormData({ ...formData, range: e.target.value })
                    }
                    style={styles.input}
                    placeholder="e.g., Touch, 30 Feet, Self"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Check Type</label>
                  <select
                    value={formData.check_type}
                    onChange={(e) =>
                      setFormData({ ...formData, check_type: e.target.value })
                    }
                    style={styles.input}
                  >
                    {checkTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.check_type === "save" && (
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Save Type</label>
                    <select
                      value={formData.save_type}
                      onChange={(e) =>
                        setFormData({ ...formData, save_type: e.target.value })
                      }
                      style={styles.input}
                    >
                      <option value="">Select save type</option>
                      {saveTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Damage Dice Count</label>
                  <input
                    type="number"
                    value={formData.damage_dice_count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        damage_dice_count: e.target.value,
                      })
                    }
                    style={styles.input}
                    placeholder="e.g., 3 (for 3d8)"
                    min="0"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Dice Type</label>
                  <select
                    value={formData.damage_dice_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        damage_dice_type: e.target.value,
                      })
                    }
                    style={styles.input}
                  >
                    {diceTypes.map((dice) => (
                      <option key={dice} value={dice}>
                        {dice}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Damage Modifier</label>
                  <input
                    type="number"
                    value={formData.damage_modifier}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        damage_modifier: e.target.value,
                      })
                    }
                    style={styles.input}
                    placeholder="e.g., 5 (for +5)"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Damage Type</label>
                  <input
                    type="text"
                    value={formData.damage_type}
                    onChange={(e) =>
                      setFormData({ ...formData, damage_type: e.target.value })
                    }
                    style={styles.input}
                    placeholder="e.g., Fire, Cold, Psychic"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Spell Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    style={styles.input}
                  >
                    {spellStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                <label style={styles.label}>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={styles.textarea}
                  placeholder="Describe what the spell does..."
                />
              </div>

              <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                <label style={styles.label}>At Higher Levels</label>
                <textarea
                  value={formData.higher_levels}
                  onChange={(e) =>
                    setFormData({ ...formData, higher_levels: e.target.value })
                  }
                  style={styles.textarea}
                  placeholder="Describe how the spell changes when cast at higher levels..."
                />
              </div>

              <div style={styles.buttonGroup}>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{ ...styles.saveButton, opacity: isSaving ? 0.7 : 1 }}
                >
                  {isSaving ? <Loader size={16} /> : <Check size={16} />}
                  {isSaving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
                <button
                  onClick={resetForm}
                  disabled={isSaving}
                  style={styles.cancelButton}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div style={styles.spellsList}>
            {customSpells.length === 0 ? (
              <div style={styles.emptyState}>
                No custom spells yet. Click "Add Spell" to create your first
                custom spell!
              </div>
            ) : (
              customSpells.map((spell) => {
                const isSpellExpanded = expandedSpells[spell.id];
                return (
                  <div key={spell.id} style={styles.spellCard}>
                    <div style={styles.spellHeader}>
                      <div style={styles.spellNameContainer}>
                        <span style={styles.spellName}>{spell.name}</span>
                        <button
                          onClick={() =>
                            setExpandedSpells({
                              ...expandedSpells,
                              [spell.id]: !isSpellExpanded,
                            })
                          }
                          style={styles.infoButton}
                          title="Info"
                        >
                          <Info size={12} />
                        </button>
                      </div>
                      <div style={styles.spellActions}>
                        <button
                          onClick={() => handleEdit(spell)}
                          style={styles.actionButton}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(spell.id)}
                          style={styles.actionButton}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div
                      style={{
                        fontStyle: "italic",
                        color: theme.success,
                        marginBottom: "8px",
                        fontSize: "13px",
                      }}
                    >
                      {spell.level} • {spell.casting_time} • Range:{" "}
                      {spell.range}
                      {spell.check_type !== "none" && (
                        <>
                          {" "}
                          •{" "}
                          {spell.check_type === "save"
                            ? `Save: ${spell.save_type}`
                            : "Attack: Spell Attack"}
                        </>
                      )}
                      {spell.damage_dice_count && (
                        <>
                          {" "}
                          • Damage: {spell.damage_dice_count}
                          {spell.damage_dice_type}
                          {spell.damage_modifier &&
                            ` + ${spell.damage_modifier}`}
                          {spell.damage_type && ` ${spell.damage_type}`}
                        </>
                      )}
                      {spell.status && (
                        <>
                          {" "}
                          • Status:{" "}
                          <span style={{ textTransform: "capitalize" }}>
                            {spell.status}
                          </span>
                        </>
                      )}
                      {spell.tags && <> • Tags: {spell.tags}</>}
                    </div>

                    {isSpellExpanded && (
                      <div style={styles.spellDetails}>
                        <div
                          style={{
                            whiteSpace: "pre-line",
                            color: theme.text,
                            marginBottom: "12px",
                          }}
                        >
                          {spell.description}
                        </div>
                        {spell.higher_levels && (
                          <div
                            style={{
                              marginBottom: "12px",
                              fontStyle: "italic",
                              color: theme.primary,
                            }}
                          >
                            <strong>At Higher Levels:</strong>{" "}
                            {spell.higher_levels}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSpells;
