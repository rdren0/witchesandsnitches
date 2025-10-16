import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Loader,
  Sword,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
} from "lucide-react";
import { useRollModal } from "../utils/diceRoller";
import { sendDiscordRollWebhook } from "../utils/discordWebhook";

const CustomMeleeAttacks = ({ character, supabase, discordUserId }) => {
  const { theme } = useTheme();
  const { showRollResult } = useRollModal();
  const [customAttacks, setCustomAttacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedAttacks, setExpandedAttacks] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    attack_ability_modifier: "strength",
    has_proficiency: true,
    magical_bonus: 0,
    range: "Melee",
    damage_dice_count: "",
    damage_dice_type: "d8",
    damage_modifier: 0,
    bonus_damage: 0,
    damage_type: "",
    additional_damage: [],
    save_type: "",
    save_effect: "",
    description: "",
    higher_levels: "",
  });

  const abilityModifiers = [
    { value: "strength", label: "Strength" },
    { value: "dexterity", label: "Dexterity" },
    { value: "constitution", label: "Constitution" },
    { value: "intelligence", label: "Intelligence" },
    { value: "wisdom", label: "Wisdom" },
    { value: "charisma", label: "Charisma" },
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

  const loadCustomAttacks = useCallback(async () => {
    if (!character?.id || !supabase) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("custom_melee_attacks")
        .select("*")
        .eq("character_id", character.id)
        .eq("discord_user_id", character.discord_user_id)
        .order("name", { ascending: true });

      if (error) throw error;

      setCustomAttacks(data || []);
    } catch (error) {
      console.error("Error loading custom melee attacks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [character?.id, character?.discord_user_id, supabase]);

  useEffect(() => {
    loadCustomAttacks();
  }, [loadCustomAttacks]);

  const resetForm = () => {
    setFormData({
      name: "",
      attack_ability_modifier: "strength",
      has_proficiency: true,
      magical_bonus: 0,
      range: "Melee",
      damage_dice_count: "",
      damage_dice_type: "d8",
      damage_modifier: 0,
      bonus_damage: 0,
      damage_type: "",
      additional_damage: [],
      save_type: "",
      save_effect: "",
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
      const attackData = {
        character_id: character.id,
        discord_user_id: character.discord_user_id,
        name: formData.name.trim(),
        attack_ability_modifier: formData.attack_ability_modifier,
        has_proficiency: formData.has_proficiency,
        magical_bonus: parseInt(formData.magical_bonus) || 0,
        range: formData.range.trim() || "Melee",
        damage_dice_count: formData.damage_dice_count
          ? parseInt(formData.damage_dice_count)
          : null,
        damage_dice_type: formData.damage_dice_type || null,
        damage_modifier: parseInt(formData.damage_modifier) || 0,
        bonus_damage: parseInt(formData.bonus_damage) || 0,
        damage_type: formData.damage_type.trim() || null,
        additional_damage: formData.additional_damage || [],
        save_type: formData.save_type || null,
        save_effect: formData.save_effect.trim() || null,
        description: formData.description.trim(),
        higher_levels: formData.higher_levels.trim() || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("custom_melee_attacks")
          .update(attackData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("custom_melee_attacks")
          .insert([attackData]);

        if (error) throw error;
      }

      await loadCustomAttacks();
      resetForm();
    } catch (error) {
      console.error("Error saving custom melee attack:", error);
      alert("Failed to save melee attack. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (attack) => {
    setFormData({
      name: attack.name,
      attack_ability_modifier: attack.attack_ability_modifier,
      has_proficiency: attack.has_proficiency,
      magical_bonus: attack.magical_bonus || 0,
      range: attack.range || "Melee",
      damage_dice_count: attack.damage_dice_count || "",
      damage_dice_type: attack.damage_dice_type || "d8",
      damage_modifier: attack.damage_modifier || 0,
      bonus_damage: attack.bonus_damage || 0,
      damage_type: attack.damage_type || "",
      additional_damage: attack.additional_damage || [],
      save_type: attack.save_type || "",
      save_effect: attack.save_effect || "",
      description: attack.description,
      higher_levels: attack.higher_levels || "",
    });
    setEditingId(attack.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this custom melee attack?")
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("custom_melee_attacks")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await loadCustomAttacks();
    } catch (error) {
      console.error("Error deleting custom melee attack:", error);
      alert("Failed to delete melee attack. Please try again.");
    }
  };

  const getAbilityModifier = (character, ability) => {
    if (!character) return 0;
    const abilityScore = character[ability] || 10;
    return Math.floor((abilityScore - 10) / 2);
  };

  const getAttackBonus = (attack) => {
    if (!character) return 0;
    const abilityMod = getAbilityModifier(
      character,
      attack.attack_ability_modifier
    );
    const profBonus = attack.has_proficiency
      ? character.proficiencyBonus || 0
      : 0;
    const magicBonus = attack.magical_bonus || 0;
    return abilityMod + profBonus + magicBonus;
  };

  const handleAttackRoll = async (attack) => {
    if (!character) return;

    try {
      const d20Roll = Math.floor(Math.random() * 20) + 1;
      const attackBonus = getAttackBonus(attack);
      const total = d20Roll + attackBonus;

      const isCrit = d20Roll === 20;
      const isFail = d20Roll === 1;

      showRollResult({
        title: `${attack.name} - Attack Roll`,
        rollValue: d20Roll,
        modifier: attackBonus,
        total: total,
        character: character,
        type: "attack",
        description: `1d20 + ${attackBonus} = ${total}`,
        isCriticalSuccess: isCrit,
        isCriticalFailure: isFail,
      });

      await sendDiscordRollWebhook({
        character: character,
        rollType: "Custom Melee Attack Roll",
        title: attack.name,
        embedColor: 0x10b981,
        rollResult: {
          d20Roll: d20Roll,
          rollValue: d20Roll,
          modifier: attackBonus,
          total: total,
          isCriticalSuccess: isCrit,
          isCriticalFailure: isFail,
        },
        fields: [
          {
            name: "Attack",
            value: `${attack.name} (Custom Melee Attack)`,
            inline: true,
          },
          {
            name: "Range",
            value: attack.range,
            inline: true,
          },
        ],
        useCharacterAvatar: true,
      });
    } catch (error) {
      console.error("Error rolling attack:", error);
    }
  };

  const handleDamageRoll = async (attack, isCritical = false) => {
    if (!character || !attack.damage_dice_count) return;

    try {
      let numDice = attack.damage_dice_count;
      if (isCritical) numDice *= 2;

      const diceSize = parseInt(attack.damage_dice_type.substring(1));
      const abilityMod = getAbilityModifier(
        character,
        attack.attack_ability_modifier
      );
      const totalBonus =
        abilityMod + (attack.damage_modifier || 0) + (attack.bonus_damage || 0);

      let total = totalBonus;
      const rolls = [];
      for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * diceSize) + 1;
        rolls.push(roll);
        total += roll;
      }

      const damageTypeDisplay = attack.damage_type
        ? attack.damage_type.charAt(0).toUpperCase() +
          attack.damage_type.slice(1)
        : "Damage";

      showRollResult({
        title: `${attack.name} - Damage Roll${isCritical ? " (CRITICAL)" : ""}`,
        rollValue: rolls.reduce((sum, roll) => sum + roll, 0),
        modifier: totalBonus,
        total: total,
        character: character,
        type: "damage",
        description: `${numDice}${attack.damage_dice_type}${
          totalBonus > 0 ? ` + ${totalBonus}` : ""
        } ${attack.damage_type || ""} damage = ${total}`,
        individualDiceResults: rolls,
        diceQuantity: numDice,
        diceType: diceSize,
      });

      const additionalFields = [
        {
          name: "Weapon",
          value: `${attack.name} (Custom Melee Attack)`,
          inline: true,
        },
        {
          name: "Damage Type",
          value: damageTypeDisplay,
          inline: true,
        },
        {
          name: "Dice Rolled",
          value: rolls.join(", ") + (totalBonus > 0 ? ` + ${totalBonus}` : ""),
          inline: true,
        },
      ];

      await sendDiscordRollWebhook({
        character: character,
        rollType: "Custom Melee Attack Damage Roll",
        title: `${attack.name} - ${damageTypeDisplay}`,
        embedColor: 0xef4444,
        rollResult: {
          d20Roll: rolls.reduce((sum, roll) => sum + roll, 0),
          rollValue: rolls.reduce((sum, roll) => sum + roll, 0),
          modifier: totalBonus,
          total: total,
          isCriticalSuccess: isCritical,
          isCriticalFailure: false,
        },
        fields: additionalFields,
        useCharacterAvatar: true,
      });
    } catch (error) {
      console.error("Error rolling damage:", error);
    }
  };

  const addAdditionalDamage = () => {
    setFormData({
      ...formData,
      additional_damage: [
        ...formData.additional_damage,
        {
          dice_count: "",
          dice_type: "d6",
          damage_type: "",
        },
      ],
    });
  };

  const updateAdditionalDamage = (index, field, value) => {
    const newAdditionalDamage = [...formData.additional_damage];
    newAdditionalDamage[index][field] = value;
    setFormData({ ...formData, additional_damage: newAdditionalDamage });
  };

  const removeAdditionalDamage = (index) => {
    const newAdditionalDamage = formData.additional_damage.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, additional_damage: newAdditionalDamage });
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
    attacksList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    attackCard: {
      backgroundColor: theme.background,
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      padding: "12px",
    },
    attackHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "8px",
    },
    attackNameContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    attackName: {
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
    attackActions: {
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
    attackMeta: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      fontSize: "13px",
      color: theme.textSecondary,
      marginBottom: "8px",
    },
    attackDetails: {
      marginTop: "8px",
      padding: "12px",
      backgroundColor: theme.background,
      border: `1px solid ${theme.border}`,
      borderRadius: "4px",
      fontSize: "12px",
    },
    emptyState: {
      textAlign: "center",
      padding: "32px 16px",
      color: theme.textSecondary,
      fontSize: "14px",
    },
    attackRollButton: {
      padding: "6px 12px",
      backgroundColor: "#10b981",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      transition: "all 0.2s ease",
      marginRight: "8px",
    },
    damageButton: {
      padding: "6px 12px",
      backgroundColor: "#dc2626",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      transition: "all 0.2s ease",
    },
    additionalDamageSection: {
      marginTop: "12px",
      padding: "12px",
      backgroundColor: theme.background,
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
    },
    additionalDamageItem: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr auto",
      gap: "8px",
      marginBottom: "8px",
      alignItems: "end",
    },
    removeButton: {
      padding: "8px",
      backgroundColor: "#dc2626",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
            <Sword size={16} color={theme.primary} />
            Custom Melee Attacks ({customAttacks.length})
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
              {showAddForm ? "Cancel" : "Add Attack"}
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
                  <label style={styles.label}>Weapon/Attack Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    style={styles.input}
                    placeholder="Enter weapon or attack name"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Attack Ability Modifier</label>
                  <select
                    value={formData.attack_ability_modifier}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        attack_ability_modifier: e.target.value,
                      })
                    }
                    style={styles.input}
                  >
                    {abilityModifiers.map((mod) => (
                      <option key={mod.value} value={mod.value}>
                        {mod.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Magical Bonus</label>
                  <input
                    type="number"
                    value={formData.magical_bonus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        magical_bonus: e.target.value,
                      })
                    }
                    style={styles.input}
                    placeholder="e.g., 1 for +1 weapon"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Proficiency</label>
                  <div
                    style={{
                      ...styles.input,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      height: "auto",
                      minHeight: "38px",
                    }}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        has_proficiency: !formData.has_proficiency,
                      })
                    }
                  >
                    <input
                      type="checkbox"
                      checked={formData.has_proficiency}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          has_proficiency: e.target.checked,
                        })
                      }
                      style={{
                        accentColor: theme.primary,
                        cursor: "pointer",
                        width: "18px",
                        height: "18px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span style={{ color: theme.text }}>Add Proficiency Bonus</span>
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Range</label>
                  <input
                    type="text"
                    value={formData.range}
                    onChange={(e) =>
                      setFormData({ ...formData, range: e.target.value })
                    }
                    style={styles.input}
                    placeholder="e.g., Melee, 5 feet, 30/60 feet"
                  />
                </div>
              </div>

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
                    placeholder="e.g., 2 (for 2d6)"
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
                    placeholder="Additional damage modifier"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Bonus Damage</label>
                  <input
                    type="number"
                    value={formData.bonus_damage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bonus_damage: e.target.value,
                      })
                    }
                    style={styles.input}
                    placeholder="Flat bonus damage"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                  <label style={styles.label}>Damage Type</label>
                  <input
                    type="text"
                    value={formData.damage_type}
                    onChange={(e) =>
                      setFormData({ ...formData, damage_type: e.target.value })
                    }
                    style={styles.input}
                    placeholder="e.g., Slashing, Piercing, Bludgeoning, Fire"
                  />
                </div>
              </div>

              {/* Additional Damage Section */}
              <div style={styles.additionalDamageSection}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <label style={styles.label}>Additional Damage Types</label>
                  <button
                    onClick={addAdditionalDamage}
                    style={{
                      ...styles.addButton,
                      padding: "4px 12px",
                      fontSize: "12px",
                    }}
                    type="button"
                  >
                    <Plus size={14} />
                    Add Damage Type
                  </button>
                </div>
                {formData.additional_damage.map((damage, index) => (
                  <div key={index} style={styles.additionalDamageItem}>
                    <div style={styles.formGroup}>
                      <label style={{ ...styles.label, fontSize: "11px" }}>
                        Dice Count
                      </label>
                      <input
                        type="number"
                        value={damage.dice_count}
                        onChange={(e) =>
                          updateAdditionalDamage(
                            index,
                            "dice_count",
                            e.target.value
                          )
                        }
                        style={styles.input}
                        placeholder="Count"
                        min="0"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={{ ...styles.label, fontSize: "11px" }}>
                        Dice Type
                      </label>
                      <select
                        value={damage.dice_type}
                        onChange={(e) =>
                          updateAdditionalDamage(
                            index,
                            "dice_type",
                            e.target.value
                          )
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
                    <div style={styles.formGroup}>
                      <label style={{ ...styles.label, fontSize: "11px" }}>
                        Damage Type
                      </label>
                      <input
                        type="text"
                        value={damage.damage_type}
                        onChange={(e) =>
                          updateAdditionalDamage(
                            index,
                            "damage_type",
                            e.target.value
                          )
                        }
                        style={styles.input}
                        placeholder="Type"
                      />
                    </div>
                    <button
                      onClick={() => removeAdditionalDamage(index)}
                      style={styles.removeButton}
                      type="button"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

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
                    <option value="">None</option>
                    {saveTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                  <label style={styles.label}>Save Effect (on failure)</label>
                  <input
                    type="text"
                    value={formData.save_effect}
                    onChange={(e) =>
                      setFormData({ ...formData, save_effect: e.target.value })
                    }
                    style={styles.input}
                    placeholder="Describe what happens on a failed save"
                  />
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
                  placeholder="Describe the attack or weapon..."
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
                  placeholder="Describe how this attack changes at higher levels..."
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

          <div style={styles.attacksList}>
            {customAttacks.length === 0 ? (
              <div style={styles.emptyState}>
                No custom melee attacks yet. Click "Add Attack" to create your
                first custom melee attack!
              </div>
            ) : (
              customAttacks.map((attack) => {
                const isAttackExpanded = expandedAttacks[attack.id];
                const attackBonus = getAttackBonus(attack);
                return (
                  <div key={attack.id} style={styles.attackCard}>
                    <div style={styles.attackHeader}>
                      <div style={styles.attackNameContainer}>
                        <span style={styles.attackName}>{attack.name}</span>
                        <button
                          onClick={() =>
                            setExpandedAttacks({
                              ...expandedAttacks,
                              [attack.id]: !isAttackExpanded,
                            })
                          }
                          style={styles.infoButton}
                          title="Info"
                        >
                          <Info size={12} />
                        </button>
                      </div>
                      <div style={styles.attackActions}>
                        <button
                          onClick={() => handleEdit(attack)}
                          style={styles.actionButton}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(attack.id)}
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
                      Attack: +{attackBonus} • Range: {attack.range}
                      {attack.damage_dice_count && (
                        <>
                          {" "}
                          • Damage: {attack.damage_dice_count}
                          {attack.damage_dice_type}
                          {(attack.damage_modifier || attack.bonus_damage) &&
                            ` + ${
                              (attack.damage_modifier || 0) +
                              (attack.bonus_damage || 0)
                            }`}
                          {attack.damage_type && ` ${attack.damage_type}`}
                        </>
                      )}
                      {attack.save_type && <> • Save: {attack.save_type}</>}
                    </div>

                    <div
                      style={{
                        marginTop: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() => handleAttackRoll(attack)}
                        style={styles.attackRollButton}
                        title="Roll attack"
                      >
                        <Zap size={14} />
                        Attack Roll
                      </button>
                      {attack.damage_dice_count && (
                        <>
                          <button
                            onClick={() => handleDamageRoll(attack, false)}
                            style={styles.damageButton}
                            title="Roll damage"
                          >
                            <Zap size={14} />
                            Damage
                          </button>
                          <button
                            onClick={() => handleDamageRoll(attack, true)}
                            style={{
                              ...styles.damageButton,
                              backgroundColor: "#7c2d12",
                            }}
                            title="Roll critical damage"
                          >
                            <Zap size={14} />
                            Critical
                          </button>
                        </>
                      )}
                    </div>

                    {isAttackExpanded && (
                      <div style={styles.attackDetails}>
                        <div
                          style={{
                            marginBottom: "12px",
                            whiteSpace: "pre-line",
                            color: theme.text,
                          }}
                        >
                          {attack.description}
                        </div>
                        {attack.higher_levels && (
                          <div
                            style={{
                              marginBottom: "12px",
                              fontStyle: "italic",
                              color: theme.primary,
                            }}
                          >
                            <strong>At Higher Levels:</strong>{" "}
                            {attack.higher_levels}
                          </div>
                        )}
                        {attack.save_effect && (
                          <div
                            style={{
                              marginBottom: "12px",
                              color: theme.warning,
                            }}
                          >
                            <strong>On Failed Save:</strong> {attack.save_effect}
                          </div>
                        )}
                        {attack.additional_damage &&
                          attack.additional_damage.length > 0 && (
                            <div style={{ marginTop: "12px" }}>
                              <strong style={{ color: theme.text }}>
                                Additional Damage:
                              </strong>
                              <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                                {attack.additional_damage.map((damage, index) => (
                                  <li key={index} style={{ color: theme.text }}>
                                    {damage.dice_count}
                                    {damage.dice_type} {damage.damage_type}
                                  </li>
                                ))}
                              </ul>
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

export default CustomMeleeAttacks;
