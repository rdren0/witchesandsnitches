import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Loader,
  PawPrint,
  Rat,
  ChevronDown,
  ChevronUp,
  Sword,
  Shield,
  Zap,
} from "lucide-react";

const Creatures = ({ supabase, user }) => {
  const { theme } = useTheme();
  const [creatures, setCreatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    combat: true,
    abilities: true,
    attacks: true,
    details: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    size: "Medium",
    type: "Beast",
    alignment: "",
    armor_class: 10,
    armor_type: "",
    hit_points: 1,
    hit_dice: "",
    speed_walk: 30,
    speed_fly: 0,
    speed_swim: 0,
    speed_climb: 0,
    speed_burrow: 0,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    attacks: [],
    description: "",
    notes: "",
    source: "",
  });

  const sizeOptions = [
    "Tiny",
    "Small",
    "Medium",
    "Large",
    "Huge",
    "Gargantuan",
  ];
  const typeOptions = [
    "Aberration",
    "Beast",
    "Celestial",
    "Construct",
    "Dragon",
    "Elemental",
    "Fey",
    "Fiend",
    "Giant",
    "Humanoid",
    "Monstrosity",
    "Ooze",
    "Plant",
    "Undead",
  ];

  const getModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  const addAttack = () => {
    setFormData({
      ...formData,
      attacks: [
        ...formData.attacks,
        {
          name: "",
          attack_bonus: 0,
          damage_quantity: 1,
          damage_die: "d6",
          damage_modifier: 0,
          damage_type: "",
          reach: 5,
          description: "",
        },
      ],
    });
  };

  const removeAttack = (index) => {
    setFormData({
      ...formData,
      attacks: formData.attacks.filter((_, i) => i !== index),
    });
  };

  const updateAttack = (index, field, value) => {
    const updatedAttacks = [...formData.attacks];
    updatedAttacks[index] = { ...updatedAttacks[index], [field]: value };
    setFormData({ ...formData, attacks: updatedAttacks });
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const loadCreatures = useCallback(async () => {
    if (!supabase || !user) return;

    setIsLoading(true);
    try {
      const discordUserId = user?.user_metadata?.provider_id;
      if (!discordUserId) return;

      const { data, error } = await supabase
        .from("creatures")
        .select("*")
        .eq("discord_user_id", discordUserId)
        .order("name", { ascending: true });

      if (error) throw error;
      setCreatures(data || []);
    } catch (error) {
      console.error("Error loading creatures:", error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    loadCreatures();
  }, [loadCreatures]);

  const resetForm = () => {
    setFormData({
      name: "",
      size: "Medium",
      type: "Beast",
      alignment: "",
      armor_class: 10,
      armor_type: "",
      hit_points: 1,
      hit_dice: "",
      speed_walk: 30,
      speed_fly: 0,
      speed_swim: 0,
      speed_climb: 0,
      speed_burrow: 0,
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      attacks: [],
      description: "",
      notes: "",
      source: "",
    });
    setShowAddForm(false);
    setEditingId(null);
    setExpandedSections({
      basic: true,
      combat: true,
      abilities: true,
      attacks: true,
      details: false,
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    setIsSaving(true);
    try {
      const discordUserId = user?.user_metadata?.provider_id;
      if (!discordUserId) {
        alert("User not authenticated");
        return;
      }

      const speed = { walk: formData.speed_walk };
      if (formData.speed_fly > 0) speed.fly = formData.speed_fly;
      if (formData.speed_swim > 0) speed.swim = formData.speed_swim;
      if (formData.speed_climb > 0) speed.climb = formData.speed_climb;
      if (formData.speed_burrow > 0) speed.burrow = formData.speed_burrow;

      const creatureData = {
        discord_user_id: discordUserId,
        name: formData.name.trim(),
        size: formData.size,
        type: formData.type,
        alignment: formData.alignment.trim() || null,
        armor_class: parseInt(formData.armor_class),
        armor_type: formData.armor_type.trim() || null,
        hit_points: parseInt(formData.hit_points),
        hit_dice: formData.hit_dice.trim() || null,
        speed: speed,
        strength: parseInt(formData.strength),
        dexterity: parseInt(formData.dexterity),
        constitution: parseInt(formData.constitution),
        intelligence: parseInt(formData.intelligence),
        wisdom: parseInt(formData.wisdom),
        charisma: parseInt(formData.charisma),
        attacks: formData.attacks.length > 0 ? formData.attacks : null,
        description: formData.description.trim() || null,
        notes: formData.notes.trim() || null,
        source: formData.source.trim() || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("creatures")
          .update(creatureData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("creatures")
          .insert([creatureData]);
        if (error) throw error;
      }

      await loadCreatures();
      resetForm();
    } catch (error) {
      console.error("Error saving creature:", error);
      alert("Failed to save creature. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (creature) => {
    setFormData({
      name: creature.name,
      size: creature.size,
      type: creature.type,
      alignment: creature.alignment || "",
      armor_class: creature.armor_class,
      armor_type: creature.armor_type || "",
      hit_points: creature.hit_points,
      hit_dice: creature.hit_dice || "",
      speed_walk: creature.speed?.walk || 30,
      speed_fly: creature.speed?.fly || 0,
      speed_swim: creature.speed?.swim || 0,
      speed_climb: creature.speed?.climb || 0,
      speed_burrow: creature.speed?.burrow || 0,
      strength: creature.strength,
      dexterity: creature.dexterity,
      constitution: creature.constitution,
      intelligence: creature.intelligence,
      wisdom: creature.wisdom,
      charisma: creature.charisma,
      attacks: creature.attacks || [],
      description: creature.description || "",
      notes: creature.notes || "",
      source: creature.source || "",
    });
    setEditingId(creature.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this creature?")) {
      return;
    }

    try {
      const { error } = await supabase.from("creatures").delete().eq("id", id);
      if (error) throw error;
      await loadCreatures();
    } catch (error) {
      console.error("Error deleting creature:", error);
      alert("Failed to delete creature. Please try again.");
    }
  };

  const styles = {
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "20px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "600",
      color: theme.text,
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    addButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 20px",
      backgroundColor: theme.primary,
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    section: {
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      marginBottom: "20px",
      overflow: "hidden",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 20px",
      backgroundColor: theme.background,
      borderBottom: `1px solid ${theme.border}`,
      cursor: "pointer",
      userSelect: "none",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    sectionContent: {
      padding: "20px",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "16px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    formGroupFull: {
      gridColumn: "1 / -1",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: theme.text,
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      backgroundColor: theme.surface,
      color: theme.text,
      fontSize: "14px",
    },
    textarea: {
      width: "100%",
      padding: "10px 12px",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      backgroundColor: theme.surface,
      color: theme.text,
      fontSize: "14px",
      minHeight: "100px",
      resize: "vertical",
      fontFamily: "inherit",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      marginTop: "20px",
      paddingTop: "20px",
      borderTop: `1px solid ${theme.border}`,
    },
    button: {
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    },
    saveButton: {
      backgroundColor: theme.primary,
      color: "white",
    },
    cancelButton: {
      backgroundColor: theme.surface,
      color: theme.text,
      border: `1px solid ${theme.border}`,
    },
    toggleButton: {
      padding: "6px 12px",
      fontSize: "12px",
      backgroundColor: theme.surface,
      color: theme.text,
      border: `1px solid ${theme.border}`,
    },
    creaturesList: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: "16px",
    },
    creatureCard: {
      backgroundColor: theme.surface,
      border: `2px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "16px",
      transition: "all 0.2s ease",
    },
    creatureHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "12px",
    },
    creatureName: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
    },
    creatureSubtitle: {
      fontSize: "13px",
      fontStyle: "italic",
      color: theme.textSecondary,
      marginBottom: "12px",
    },
    statRow: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
      marginBottom: "12px",
    },
    statBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "8px",
      backgroundColor: theme.background,
      borderRadius: "6px",
      border: `1px solid ${theme.border}`,
    },
    statLabel: {
      fontSize: "11px",
      color: theme.textSecondary,
      marginBottom: "4px",
    },
    statValue: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
    },
    abilityScores: {
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: "8px",
      marginTop: "12px",
    },
    abilityBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "6px",
      backgroundColor: theme.background,
      borderRadius: "4px",
      border: `1px solid ${theme.border}`,
    },
    abilityLabel: {
      fontSize: "10px",
      color: theme.textSecondary,
      fontWeight: "600",
    },
    abilityValue: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.text,
    },
    abilityModifier: {
      fontSize: "11px",
      color: theme.textSecondary,
    },
    // Form ability score styles
    abilityGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "16px",
    },
    abilityCard: {
      padding: "16px",
      backgroundColor: theme.surface,
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      textAlign: "center",
    },
    abilityName: {
      fontSize: "14px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
    },
    abilityModifierForm: {
      fontSize: "24px",
      fontWeight: "bold",
      color: theme.text,
      marginBottom: "8px",
    },
    abilityControls: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      justifyContent: "center",
    },
    abilityButton: {
      width: "32px",
      height: "32px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    scoreDisplay: {
      fontSize: "20px",
      fontWeight: "bold",
      minWidth: "40px",
      textAlign: "center",
      padding: "8px 12px",
      backgroundColor: theme.surface,
      border: `2px solid ${theme.border}`,
      borderRadius: "6px",
      color: theme.text,
    },
    actionButtons: {
      display: "flex",
      gap: "6px",
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
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: theme.textSecondary,
      fontSize: "14px",
    },
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Loader
            size={32}
            color={theme.primary}
            style={{ animation: "spin 1s linear infinite" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <Rat size={32} color={theme.primary} />
          Creatures ({creatures.length})
        </div>
        <button
          style={styles.addButton}
          onClick={() => {
            if (showAddForm) {
              resetForm();
            } else {
              setShowAddForm(true);
            }
          }}
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          {showAddForm ? "Cancel" : "Add Creature"}
        </button>
      </div>

      {showAddForm && (
        <div>
          {/* Basic Info Section */}
          <div style={styles.section}>
            <div
              style={styles.sectionHeader}
              onClick={() => toggleSection("basic")}
            >
              <h3 style={styles.sectionTitle}>
                <PawPrint size={18} />
                Basic Information
              </h3>
              <button style={{ ...styles.button, ...styles.toggleButton }}>
                {expandedSections.basic ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
            {expandedSections.basic && (
              <div style={styles.sectionContent}>
                <div style={styles.formRow}>
                  <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                    <label style={styles.label}>Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      style={styles.input}
                      placeholder="Enter creature name"
                    />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Size</label>
                    <select
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                      style={styles.input}
                    >
                      {sizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      style={styles.input}
                    >
                      {typeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Alignment</label>
                    <input
                      type="text"
                      value={formData.alignment}
                      onChange={(e) =>
                        setFormData({ ...formData, alignment: e.target.value })
                      }
                      style={styles.input}
                      placeholder="e.g., Lawful Good"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Combat Stats Section */}
          <div style={styles.section}>
            <div
              style={styles.sectionHeader}
              onClick={() => toggleSection("combat")}
            >
              <h3 style={styles.sectionTitle}>
                <Shield size={18} />
                Combat Stats
              </h3>
              <button style={{ ...styles.button, ...styles.toggleButton }}>
                {expandedSections.combat ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
            {expandedSections.combat && (
              <div style={styles.sectionContent}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Armor Class</label>
                    <input
                      type="number"
                      value={formData.armor_class}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          armor_class: e.target.value,
                        })
                      }
                      style={styles.input}
                      min="1"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Armor Type</label>
                    <input
                      type="text"
                      value={formData.armor_type}
                      onChange={(e) =>
                        setFormData({ ...formData, armor_type: e.target.value })
                      }
                      style={styles.input}
                      placeholder="e.g., natural armor"
                    />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Hit Points</label>
                    <input
                      type="number"
                      value={formData.hit_points}
                      onChange={(e) =>
                        setFormData({ ...formData, hit_points: e.target.value })
                      }
                      style={styles.input}
                      min="1"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Hit Dice</label>
                    <input
                      type="text"
                      value={formData.hit_dice}
                      onChange={(e) =>
                        setFormData({ ...formData, hit_dice: e.target.value })
                      }
                      style={styles.input}
                      placeholder="e.g., 2d8 + 2"
                    />
                  </div>
                </div>
                <div style={{ marginTop: "16px", marginBottom: "8px" }}>
                  <label style={styles.label}>Speed (ft)</label>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label
                      style={{
                        ...styles.label,
                        fontSize: "12px",
                        color: theme.textSecondary,
                      }}
                    >
                      Walk
                    </label>
                    <input
                      type="number"
                      value={formData.speed_walk}
                      onChange={(e) =>
                        setFormData({ ...formData, speed_walk: e.target.value })
                      }
                      style={styles.input}
                      min="0"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label
                      style={{
                        ...styles.label,
                        fontSize: "12px",
                        color: theme.textSecondary,
                      }}
                    >
                      Fly
                    </label>
                    <input
                      type="number"
                      value={formData.speed_fly}
                      onChange={(e) =>
                        setFormData({ ...formData, speed_fly: e.target.value })
                      }
                      style={styles.input}
                      min="0"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label
                      style={{
                        ...styles.label,
                        fontSize: "12px",
                        color: theme.textSecondary,
                      }}
                    >
                      Swim
                    </label>
                    <input
                      type="number"
                      value={formData.speed_swim}
                      onChange={(e) =>
                        setFormData({ ...formData, speed_swim: e.target.value })
                      }
                      style={styles.input}
                      min="0"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label
                      style={{
                        ...styles.label,
                        fontSize: "12px",
                        color: theme.textSecondary,
                      }}
                    >
                      Climb
                    </label>
                    <input
                      type="number"
                      value={formData.speed_climb}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          speed_climb: e.target.value,
                        })
                      }
                      style={styles.input}
                      min="0"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label
                      style={{
                        ...styles.label,
                        fontSize: "12px",
                        color: theme.textSecondary,
                      }}
                    >
                      Burrow
                    </label>
                    <input
                      type="number"
                      value={formData.speed_burrow}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          speed_burrow: e.target.value,
                        })
                      }
                      style={styles.input}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ability Scores Section */}
          <div style={styles.section}>
            <div
              style={styles.sectionHeader}
              onClick={() => toggleSection("abilities")}
            >
              <h3 style={styles.sectionTitle}>
                <Sword size={18} />
                Ability Scores
              </h3>
              <button style={{ ...styles.button, ...styles.toggleButton }}>
                {expandedSections.abilities ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
            {expandedSections.abilities && (
              <div style={styles.sectionContent}>
                <div style={styles.abilityGrid}>
                  {[
                    { key: "strength", label: "Strength", abbr: "STR" },
                    { key: "dexterity", label: "Dexterity", abbr: "DEX" },
                    { key: "constitution", label: "Constitution", abbr: "CON" },
                    { key: "intelligence", label: "Intelligence", abbr: "INT" },
                    { key: "wisdom", label: "Wisdom", abbr: "WIS" },
                    { key: "charisma", label: "Charisma", abbr: "CHA" },
                  ].map((ability) => {
                    const score = formData[ability.key];
                    const modifier = getModifier(score);
                    return (
                      <div key={ability.key} style={styles.abilityCard}>
                        <div style={styles.abilityName}>{ability.abbr}</div>
                        <div style={styles.abilityModifierForm}>
                          {modifier >= 0 ? "+" : ""}
                          {modifier}
                        </div>
                        <div style={styles.abilityControls}>
                          <button
                            onClick={() =>
                              setFormData({
                                ...formData,
                                [ability.key]: Math.max(parseInt(score) - 1, 1),
                              })
                            }
                            disabled={score <= 1}
                            style={{
                              ...styles.abilityButton,
                              backgroundColor:
                                score <= 1 ? theme.border : "#EF4444",
                              color: score <= 1 ? theme.textSecondary : "white",
                              cursor: score <= 1 ? "not-allowed" : "pointer",
                            }}
                          >
                            -
                          </button>
                          <div style={styles.scoreDisplay}>{score}</div>
                          <button
                            onClick={() =>
                              setFormData({
                                ...formData,
                                [ability.key]: Math.min(
                                  parseInt(score) + 1,
                                  30
                                ),
                              })
                            }
                            disabled={score >= 30}
                            style={{
                              ...styles.abilityButton,
                              backgroundColor:
                                score >= 30 ? theme.border : "#10B981",
                              color:
                                score >= 30 ? theme.textSecondary : "white",
                              cursor: score >= 30 ? "not-allowed" : "pointer",
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Attacks Section */}
          <div style={styles.section}>
            <div
              style={styles.sectionHeader}
              onClick={() => toggleSection("attacks")}
            >
              <h3 style={styles.sectionTitle}>
                <Sword size={18} />
                Attacks
              </h3>
              <button style={{ ...styles.button, ...styles.toggleButton }}>
                {expandedSections.attacks ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
            {expandedSections.attacks && (
              <div style={styles.sectionContent}>
                {formData.attacks.map((attack, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "16px",
                      padding: "16px",
                      backgroundColor: theme.background,
                      borderRadius: "8px",
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: theme.text,
                          margin: 0,
                        }}
                      >
                        Attack {index + 1}
                      </h4>
                      <button
                        onClick={() => removeAttack(index)}
                        style={{
                          ...styles.button,
                          padding: "4px 8px",
                          backgroundColor: "#EF4444",
                          color: "white",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Name</label>
                        <input
                          type="text"
                          value={attack.name}
                          onChange={(e) =>
                            updateAttack(index, "name", e.target.value)
                          }
                          style={styles.input}
                          placeholder="e.g., Bite, Claw"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Attack Bonus</label>
                        <input
                          type="number"
                          value={attack.attack_bonus}
                          onChange={(e) =>
                            updateAttack(index, "attack_bonus", e.target.value)
                          }
                          style={styles.input}
                          placeholder="+5"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Reach (ft)</label>
                        <input
                          type="number"
                          value={attack.reach}
                          onChange={(e) =>
                            updateAttack(index, "reach", e.target.value)
                          }
                          style={styles.input}
                          min="0"
                        />
                      </div>
                    </div>
                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Damage Quantity</label>
                        <input
                          type="number"
                          value={attack.damage_quantity || 1}
                          onChange={(e) =>
                            updateAttack(
                              index,
                              "damage_quantity",
                              e.target.value
                            )
                          }
                          style={styles.input}
                          min="1"
                          placeholder="1"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Damage Die</label>
                        <select
                          value={attack.damage_die || "d6"}
                          onChange={(e) =>
                            updateAttack(index, "damage_die", e.target.value)
                          }
                          style={styles.input}
                        >
                          <option value="d4">d4</option>
                          <option value="d6">d6</option>
                          <option value="d8">d8</option>
                          <option value="d10">d10</option>
                          <option value="d12">d12</option>
                          <option value="d20">d20</option>
                        </select>
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Modifier</label>
                        <input
                          type="number"
                          value={attack.damage_modifier || 0}
                          onChange={(e) =>
                            updateAttack(
                              index,
                              "damage_modifier",
                              e.target.value
                            )
                          }
                          style={styles.input}
                          placeholder="0"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Damage Type</label>
                        <input
                          type="text"
                          value={attack.damage_type}
                          onChange={(e) =>
                            updateAttack(index, "damage_type", e.target.value)
                          }
                          style={styles.input}
                          placeholder="e.g., piercing"
                        />
                      </div>
                    </div>
                    <div style={styles.formRow}>
                      <div
                        style={{ ...styles.formGroup, ...styles.formGroupFull }}
                      >
                        <label style={styles.label}>Description</label>
                        <textarea
                          value={attack.description}
                          onChange={(e) =>
                            updateAttack(index, "description", e.target.value)
                          }
                          style={{
                            ...styles.textarea,
                            minHeight: "60px",
                          }}
                          placeholder="Additional attack effects or notes..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addAttack}
                  style={{
                    ...styles.button,
                    backgroundColor: theme.primary,
                    color: "white",
                  }}
                >
                  <Plus size={16} />
                  Add Attack
                </button>
              </div>
            )}
          </div>

          {/* Description & Details Section */}
          <div style={styles.section}>
            <div
              style={styles.sectionHeader}
              onClick={() => toggleSection("details")}
            >
              <h3 style={styles.sectionTitle}>
                <Zap size={18} />
                Description & Details
              </h3>
              <button style={{ ...styles.button, ...styles.toggleButton }}>
                {expandedSections.details ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
            {expandedSections.details && (
              <div style={styles.sectionContent}>
                <div style={styles.formRow}>
                  <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                    <label style={styles.label}>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      style={styles.textarea}
                      placeholder="Describe the creature..."
                    />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                    <label style={styles.label}>Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      style={styles.textarea}
                      placeholder="DM notes, encounters, etc..."
                    />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                    <label style={styles.label}>Source</label>
                    <input
                      type="text"
                      value={formData.source}
                      onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                      }
                      style={styles.input}
                      placeholder="e.g., Monster Manual p. 123"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={styles.section}>
            <div style={styles.sectionContent}>
              <div style={styles.buttonGroup}>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    ...styles.button,
                    ...styles.saveButton,
                    opacity: isSaving ? 0.7 : 1,
                  }}
                >
                  {isSaving ? <Loader size={16} /> : <Check size={16} />}
                  {isSaving
                    ? "Saving..."
                    : editingId
                    ? "Update Creature"
                    : "Create Creature"}
                </button>
                <button
                  onClick={resetForm}
                  disabled={isSaving}
                  style={{ ...styles.button, ...styles.cancelButton }}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {creatures.length === 0 ? (
        <div style={styles.emptyState}>
          <PawPrint
            size={48}
            color={theme.textSecondary}
            style={{ marginBottom: "16px" }}
          />
          <p>
            No creatures yet. Click "Add Creature" to create your first
            creature!
          </p>
        </div>
      ) : (
        <div style={styles.creaturesList}>
          {creatures.map((creature) => {
            return (
              <div key={creature.id} style={styles.creatureCard}>
                <div style={styles.creatureHeader}>
                  <div>
                    <div style={styles.creatureName}>{creature.name}</div>
                    <div style={styles.creatureSubtitle}>
                      {creature.size} {creature.type}
                      {creature.alignment && `, ${creature.alignment}`}
                    </div>
                  </div>
                  <div style={styles.actionButtons}>
                    <button
                      onClick={() => handleEdit(creature)}
                      style={styles.actionButton}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(creature.id)}
                      style={styles.actionButton}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={styles.statRow}>
                  <div style={styles.statBox}>
                    <div style={styles.statLabel}>AC</div>
                    <div style={styles.statValue}>{creature.armor_class}</div>
                  </div>
                  <div style={styles.statBox}>
                    <div style={styles.statLabel}>HP</div>
                    <div style={styles.statValue}>{creature.hit_points}</div>
                  </div>
                  <div style={styles.statBox}>
                    <div style={styles.statLabel}>Speed</div>
                    <div style={styles.statValue}>
                      {creature.speed?.walk || 30}
                    </div>
                  </div>
                </div>

                <div style={styles.abilityScores}>
                  <div style={styles.abilityBox}>
                    <div style={styles.abilityLabel}>STR</div>
                    <div style={styles.abilityValue}>{creature.strength}</div>
                    <div style={styles.abilityModifier}>
                      {getModifier(creature.strength) >= 0 ? "+" : ""}
                      {getModifier(creature.strength)}
                    </div>
                  </div>
                  <div style={styles.abilityBox}>
                    <div style={styles.abilityLabel}>DEX</div>
                    <div style={styles.abilityValue}>{creature.dexterity}</div>
                    <div style={styles.abilityModifier}>
                      {getModifier(creature.dexterity) >= 0 ? "+" : ""}
                      {getModifier(creature.dexterity)}
                    </div>
                  </div>
                  <div style={styles.abilityBox}>
                    <div style={styles.abilityLabel}>CON</div>
                    <div style={styles.abilityValue}>
                      {creature.constitution}
                    </div>
                    <div style={styles.abilityModifier}>
                      {getModifier(creature.constitution) >= 0 ? "+" : ""}
                      {getModifier(creature.constitution)}
                    </div>
                  </div>
                  <div style={styles.abilityBox}>
                    <div style={styles.abilityLabel}>INT</div>
                    <div style={styles.abilityValue}>
                      {creature.intelligence}
                    </div>
                    <div style={styles.abilityModifier}>
                      {getModifier(creature.intelligence) >= 0 ? "+" : ""}
                      {getModifier(creature.intelligence)}
                    </div>
                  </div>
                  <div style={styles.abilityBox}>
                    <div style={styles.abilityLabel}>WIS</div>
                    <div style={styles.abilityValue}>{creature.wisdom}</div>
                    <div style={styles.abilityModifier}>
                      {getModifier(creature.wisdom) >= 0 ? "+" : ""}
                      {getModifier(creature.wisdom)}
                    </div>
                  </div>
                  <div style={styles.abilityBox}>
                    <div style={styles.abilityLabel}>CHA</div>
                    <div style={styles.abilityValue}>{creature.charisma}</div>
                    <div style={styles.abilityModifier}>
                      {getModifier(creature.charisma) >= 0 ? "+" : ""}
                      {getModifier(creature.charisma)}
                    </div>
                  </div>
                </div>

                {creature.attacks && creature.attacks.length > 0 && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      backgroundColor: theme.background,
                      borderRadius: "6px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: theme.text,
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Sword size={14} />
                      Attacks
                    </div>
                    {creature.attacks.map((attack, idx) => (
                      <div
                        key={idx}
                        style={{
                          marginBottom: "8px",
                          paddingBottom: "8px",
                          borderBottom:
                            idx < creature.attacks.length - 1
                              ? `1px solid ${theme.border}`
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: theme.text,
                          }}
                        >
                          {attack.name}
                          {attack.attack_bonus && (
                            <span
                              style={{
                                marginLeft: "8px",
                                color: theme.primary,
                              }}
                            >
                              +{attack.attack_bonus}
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: theme.textSecondary,
                            marginTop: "2px",
                          }}
                        >
                          {attack.reach && `Reach ${attack.reach} ft.`}
                          {(attack.damage_quantity ||
                            attack.damage_die ||
                            attack.damage_dice) &&
                            (() => {
                              // Support both old format (damage_dice) and new format (damage_quantity, damage_die, damage_modifier)
                              let damageString = "";
                              if (attack.damage_quantity && attack.damage_die) {
                                damageString = `${attack.damage_quantity}${attack.damage_die}`;
                                if (
                                  attack.damage_modifier &&
                                  attack.damage_modifier !== 0
                                ) {
                                  damageString +=
                                    attack.damage_modifier > 0
                                      ? ` + ${attack.damage_modifier}`
                                      : ` - ${Math.abs(
                                          attack.damage_modifier
                                        )}`;
                                }
                              } else if (attack.damage_dice) {
                                damageString = attack.damage_dice;
                              }
                              return ` ${damageString} ${
                                attack.damage_type || ""
                              } damage`;
                            })()}
                        </div>
                        {attack.description && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: theme.text,
                              marginTop: "4px",
                              fontStyle: "italic",
                            }}
                          >
                            {attack.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {creature.description && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      backgroundColor: theme.background,
                      borderRadius: "6px",
                      fontSize: "13px",
                      color: theme.text,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {creature.description}
                  </div>
                )}

                {creature.notes && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      backgroundColor: theme.background,
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: theme.textSecondary,
                      whiteSpace: "pre-line",
                      fontStyle: "italic",
                    }}
                  >
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                      Notes:
                    </div>
                    {creature.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Creatures;
