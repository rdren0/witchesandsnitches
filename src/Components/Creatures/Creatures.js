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
  Scroll,
} from "lucide-react";
import { useRollModal } from "../utils/diceRoller";
import {
  rollCreatureAbility,
  rollCreatureAttackOnly,
  rollCreatureDamage,
  rollCreatureSavingThrow,
  rollCreatureInitiative,
  rollCreatureSkill,
} from "./creatureRolls";
import CreatureHPModal from "./CreatureHPModal";

const Creatures = ({ supabase, user, characters, selectedCharacter }) => {
  const { theme } = useTheme();
  const [creatures, setCreatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const { showRollResult } = useRollModal();
  const [originalFormData, setOriginalFormData] = useState(null);
  const [showHPModal, setShowHPModal] = useState(false);
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [damageAmount, setDamageAmount] = useState(0);
  const [healAmount, setHealAmount] = useState(0);
  const [isApplyingHP, setIsApplyingHP] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    combat: true,
    abilities: true,
    skills: false,
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
    initiative_modifier: 0,
    attacks: [],
    selected_skills: [],
    saving_throw_proficiencies: [],
    resistances: {
      damage_resistances: [],
      damage_immunities: [],
      damage_vulnerabilities: [],
      condition_immunities: [],
    },
    description: "",
    notes: "",
    source: "",
    image_url: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const SKILL_LIST = [
    { key: "acrobatics", label: "Acrobatics", ability: "dexterity" },
    { key: "animal_handling", label: "Animal Handling", ability: "wisdom" },
    { key: "arcana", label: "Arcana", ability: "intelligence" },
    { key: "athletics", label: "Athletics", ability: "strength" },
    { key: "deception", label: "Deception", ability: "charisma" },
    { key: "history", label: "History", ability: "intelligence" },
    { key: "insight", label: "Insight", ability: "wisdom" },
    { key: "intimidation", label: "Intimidation", ability: "charisma" },
    { key: "investigation", label: "Investigation", ability: "intelligence" },
    { key: "medicine", label: "Medicine", ability: "wisdom" },
    { key: "nature", label: "Nature", ability: "intelligence" },
    { key: "perception", label: "Perception", ability: "wisdom" },
    { key: "performance", label: "Performance", ability: "charisma" },
    { key: "persuasion", label: "Persuasion", ability: "charisma" },
    { key: "religion", label: "Religion", ability: "intelligence" },
    { key: "sleight_of_hand", label: "Sleight of Hand", ability: "dexterity" },
    { key: "stealth", label: "Stealth", ability: "dexterity" },
    { key: "survival", label: "Survival", ability: "wisdom" },
  ];

  const getSkillModifier = (skillKey, creature) => {
    const skill = SKILL_LIST.find((s) => s.key === skillKey);
    if (!skill) return 0;

    const abilityModifier = getModifier(creature[skill.ability]);
    const proficiencyBonus = creature.proficiencies?.proficiency_bonus || 0;
    const isProficient = creature.skills?.[skillKey];

    return abilityModifier + (isProficient ? proficiencyBonus : 0);
  };

  const getInitiativeModifier = (creature) => {
    return parseInt(creature.initiative_modifier) || 0;
  };

  const getHPColor = (creature) => {
    const currentHP = creature.current_hit_points ?? creature.hit_points;
    const maxHP = creature.hit_points;
    const percentage = currentHP / maxHP;

    if (percentage <= 0.25) return "#EF4444";
    if (percentage <= 0.5) return "#F59E0B";
    if (percentage <= 0.75) return "#EAB308";
    return "#10B981";
  };

  const handleAbilityClick = async (
    creature,
    abilityName,
    abilityKey,
    abilityScore
  ) => {
    if (isRolling) return;
    setIsRolling(true);

    try {
      const modifier = getModifier(abilityScore);
      await rollCreatureAbility({
        creature,
        abilityName,
        abilityKey,
        abilityModifier: modifier,
        showRollResult,
        ownerCharacter: selectedCharacter,
      });
    } finally {
      setIsRolling(false);
    }
  };

  const handleSavingThrowClick = async (
    creature,
    abilityName,
    abilityKey,
    abilityScore,
    event
  ) => {
    event.stopPropagation();
    if (isRolling) return;
    setIsRolling(true);

    try {
      const modifier = getModifier(abilityScore);
      const isProficientInSave =
        creature.saving_throw_proficiencies?.includes(abilityKey) || false;
      const characterLevel = selectedCharacter?.level || 1;
      const proficiencyBonus = Math.floor((characterLevel - 1) / 4) + 2;
      const saveModifier =
        modifier + (isProficientInSave ? proficiencyBonus : 0);

      await rollCreatureSavingThrow({
        creature,
        abilityName,
        abilityKey,
        savingThrowModifier: saveModifier,
        showRollResult,
        ownerCharacter: selectedCharacter,
        isProficient: isProficientInSave,
      });
    } finally {
      setIsRolling(false);
    }
  };

  const handleInitiativeClick = async (creature, event) => {
    event.stopPropagation();
    if (isRolling) return;
    setIsRolling(true);

    try {
      const initiativeModifier = getInitiativeModifier(creature);
      await rollCreatureInitiative({
        creature,
        initiativeModifier,
        showRollResult,
        ownerCharacter: selectedCharacter,
      });
    } finally {
      setIsRolling(false);
    }
  };

  const handleAttackRoll = async (creature, attack, event) => {
    event.stopPropagation();
    if (isRolling) return;
    setIsRolling(true);

    try {
      await rollCreatureAttackOnly({
        creature,
        attack,
        showRollResult,
        ownerCharacter: selectedCharacter,
      });
    } finally {
      setIsRolling(false);
    }
  };

  const handleDamageRoll = async (
    creature,
    attack,
    event,
    isCritical = false
  ) => {
    event.stopPropagation();
    if (isRolling) return;
    setIsRolling(true);

    try {
      await rollCreatureDamage({
        creature,
        attack,
        isCritical,
        showRollResult,
        ownerCharacter: selectedCharacter,
      });
    } finally {
      setIsRolling(false);
    }
  };

  const handleSkillClick = async (
    creature,
    skillInfo,
    selectedSkill,
    abilityModifier
  ) => {
    if (isRolling) return;
    setIsRolling(true);

    try {
      const characterLevel = selectedCharacter?.level || 1;
      const proficiencyBonus = Math.floor((characterLevel - 1) / 4) + 2;

      await rollCreatureSkill({
        creature,
        skillName: skillInfo.label,
        skillKey: selectedSkill.key,
        abilityModifier,
        proficiencyBonus,
        isProficient: selectedSkill.isProficient,
        hasAdvantage: selectedSkill.hasAdvantage,
        proficiencyNote: selectedSkill.proficiencyNote || "",
        advantageNote: selectedSkill.advantageNote || "",
        showRollResult,
        ownerCharacter: selectedCharacter,
      });
    } finally {
      setIsRolling(false);
    }
  };

  const handleHPClick = (creature) => {
    setSelectedCreature(creature);
    setDamageAmount(0);
    setHealAmount(0);
    setShowHPModal(true);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const discordUserId = selectedCharacter?.discord_user_id;
      if (!discordUserId) {
        alert("Character not found or missing Discord user ID");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${discordUserId}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("creature-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("creature-images")
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: urlData.publicUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!formData.image_url) return;

    if (!window.confirm("Are you sure you want to remove this image?")) {
      return;
    }

    try {
      if (formData.image_url.includes("creature-images")) {
        const urlParts = formData.image_url.split("/");
        const fileName = `${urlParts[urlParts.length - 2]}/${
          urlParts[urlParts.length - 1]
        }`;

        await supabase.storage.from("creature-images").remove([fileName]);
      }

      setFormData({ ...formData, image_url: "" });
    } catch (error) {
      console.error("Error removing image:", error);

      setFormData({ ...formData, image_url: "" });
    }
  };

  const handleApplyHP = async (amount, type) => {
    if (!selectedCreature || amount <= 0) return;

    setIsApplyingHP(true);

    try {
      const currentHP =
        selectedCreature.current_hit_points ?? selectedCreature.hit_points;
      const maxHP = selectedCreature.hit_points;

      let newCurrentHP;
      if (type === "damage") {
        newCurrentHP = Math.max(0, currentHP - amount);
      } else {
        newCurrentHP = Math.min(maxHP, currentHP + amount);
      }

      const { error } = await supabase
        .from("creatures")
        .update({
          current_hit_points: newCurrentHP,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedCreature.id);

      if (error) {
        console.error("Error updating creature HP:", error);
        alert("Failed to update creature HP");
        return;
      }

      await loadCreatures();
      setShowHPModal(false);
      setSelectedCreature(null);
      setDamageAmount(0);
      setHealAmount(0);
    } catch (error) {
      console.error("Error applying HP change:", error);
      alert("Error applying HP change. Please try again.");
    } finally {
      setIsApplyingHP(false);
    }
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
          save_dc: null,
          save_ability: "",
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

  const addSkill = (skillKey) => {
    if (formData.selected_skills.some((s) => s.key === skillKey)) {
      return;
    }

    setFormData({
      ...formData,
      selected_skills: [
        ...formData.selected_skills,
        {
          key: skillKey,
          isProficient: false,
          proficiencyNote: "",
          hasAdvantage: false,
          advantageNote: "",
        },
      ],
    });
  };

  const removeSkill = (skillKey) => {
    setFormData({
      ...formData,
      selected_skills: formData.selected_skills.filter(
        (s) => s.key !== skillKey
      ),
    });
  };

  const updateSkill = (skillKey, field, value) => {
    const updated = formData.selected_skills.map((s) =>
      s.key === skillKey ? { ...s, [field]: value } : s
    );
    setFormData({ ...formData, selected_skills: updated });
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const hasFormChanges = () => {
    if (!originalFormData) return true;
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
  };

  const loadCreatures = useCallback(async () => {
    if (!supabase || !user || !selectedCharacter) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("creatures")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .order("name", { ascending: true });

      if (error) throw error;

      const normalizedCreatures = (data || []).map((creature) => ({
        ...creature,
        attacks: (creature.attacks || []).map((attack) => ({
          ...attack,
          attack_bonus: parseInt(attack.attack_bonus) || 0,
          damage_quantity: parseInt(attack.damage_quantity) || 1,
          damage_modifier: parseInt(attack.damage_modifier) || 0,
          reach: parseInt(attack.reach) || 5,
          save_dc: attack.save_dc ? parseInt(attack.save_dc) : null,
        })),
      }));

      setCreatures(normalizedCreatures);
    } catch (error) {
      console.error("Error loading creatures:", error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, user, selectedCharacter]);

  useEffect(() => {
    loadCreatures();
  }, [loadCreatures]);

  const resetForm = () => {
    const defaultFormData = {
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
      initiative_modifier: 0,
      attacks: [],
      selected_skills: [],
      saving_throw_proficiencies: [],
      resistances: {
        damage_resistances: [],
        damage_immunities: [],
        damage_vulnerabilities: [],
        condition_immunities: [],
      },
      description: "",
      notes: "",
      source: "",
      image_url: "",
    };
    setFormData(defaultFormData);
    setOriginalFormData(null);
    setShowAddForm(false);
    setEditingId(null);
    setExpandedSections({
      basic: true,
      combat: true,
      abilities: true,
      skills: true,
      attacks: true,
      traits: true,
      details: true,
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!selectedCharacter) {
      alert("No character selected");
      return;
    }

    setIsSaving(true);
    try {
      const discordUserId = selectedCharacter?.discord_user_id;
      if (!discordUserId) {
        alert("Character not found or missing Discord user ID");
        return;
      }

      const speed = { walk: formData.speed_walk };
      if (formData.speed_fly > 0) speed.fly = formData.speed_fly;
      if (formData.speed_swim > 0) speed.swim = formData.speed_swim;
      if (formData.speed_climb > 0) speed.climb = formData.speed_climb;
      if (formData.speed_burrow > 0) speed.burrow = formData.speed_burrow;

      const hitPoints = parseInt(formData.hit_points);

      const creatureData = {
        discord_user_id: discordUserId,
        character_id: selectedCharacter.id,
        name: formData.name.trim(),
        size: formData.size,
        type: formData.type,
        alignment: formData.alignment.trim() || null,
        armor_class: parseInt(formData.armor_class),
        armor_type: formData.armor_type.trim() || null,
        hit_points: hitPoints,
        current_hit_points: hitPoints,
        hit_dice: formData.hit_dice.trim() || null,
        speed: speed,
        strength: parseInt(formData.strength),
        dexterity: parseInt(formData.dexterity),
        constitution: parseInt(formData.constitution),
        intelligence: parseInt(formData.intelligence),
        wisdom: parseInt(formData.wisdom),
        charisma: parseInt(formData.charisma),
        initiative_modifier: parseInt(formData.initiative_modifier) || 0,
        attacks:
          formData.attacks.length > 0
            ? formData.attacks.map((attack) => ({
                name: attack.name,
                attack_bonus: parseInt(attack.attack_bonus) || 0,
                damage_quantity: parseInt(attack.damage_quantity) || 1,
                damage_die: attack.damage_die,
                damage_modifier: parseInt(attack.damage_modifier) || 0,
                damage_type: attack.damage_type,
                reach: parseInt(attack.reach) || 5,
                description: attack.description,
                save_dc: attack.save_dc ? parseInt(attack.save_dc) : null,
                save_ability: attack.save_ability,
              }))
            : null,
        selected_skills: formData.selected_skills,
        saving_throw_proficiencies: formData.saving_throw_proficiencies,
        resistances: formData.resistances,
        description: formData.description.trim() || null,
        notes: formData.notes.trim() || null,
        source: formData.source.trim() || null,
        image_url: formData.image_url.trim() || null,
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
    const editData = {
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
      initiative_modifier: creature.initiative_modifier || 0,
      attacks: (creature.attacks || []).map((attack) => ({
        name: attack.name || "",
        attack_bonus: parseInt(attack.attack_bonus) || 0,
        damage_quantity: parseInt(attack.damage_quantity) || 1,
        damage_die: attack.damage_die || "d6",
        damage_modifier: parseInt(attack.damage_modifier) || 0,
        damage_type: attack.damage_type || "",
        reach: parseInt(attack.reach) || 5,
        description: attack.description || "",
        save_dc: attack.save_dc ? parseInt(attack.save_dc) : null,
        save_ability: attack.save_ability || "",
      })),
      selected_skills: (creature.selected_skills || []).map((skill) => ({
        key: skill.key,
        isProficient: skill.isProficient || false,
        proficiencyNote: skill.proficiencyNote || "",
        hasAdvantage: skill.hasAdvantage || false,
        advantageNote: skill.advantageNote || skill.note || "",
      })),
      saving_throw_proficiencies: creature.saving_throw_proficiencies || [],
      resistances: creature.resistances || {
        damage_resistances: [],
        damage_immunities: [],
        damage_vulnerabilities: [],
        condition_immunities: [],
      },
      description: creature.description || "",
      notes: creature.notes || "",
      source: creature.source || "",
      image_url: creature.image_url || "",
    };
    setFormData(editData);
    setOriginalFormData(JSON.parse(JSON.stringify(editData)));
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
      position: "sticky",
      top: 0,
      backgroundColor: theme.background,
      zIndex: 100,
      padding: "20px",
      borderRadius: "12px",
      borderBottom: showAddForm ? `2px solid ${theme.border}` : "none",
      border: `1px solid ${theme.border}`,
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
      border: `2px solid ${theme.primary}`,
    },
    cancelButton: {
      backgroundColor: theme.surface,
      color: theme.text,
      border: `2px solid ${theme.border}`,
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
      gridTemplateColumns: "repeat(auto-fill, minmax(700px, 1fr))",
      gap: "16px",
    },
    creatureCard: {
      backgroundColor: theme.surface,
      border: `2px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "16px",
      transition: "all 0.2s ease",
      minWidth: "700px",
    },
    creatureHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "12px",
    },
    creatureName: {
      fontSize: "20px",
      fontWeight: "600",
      color: theme.text,
    },
    creatureSubtitle: {
      fontSize: "14px",
      fontStyle: "italic",
      color: theme.textSecondary,
      marginBottom: "12px",
    },
    statRow: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
      marginBottom: "16px",
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
      fontSize: "0.875rem",
      color: theme.textSecondary,
      marginBottom: "4px",
      fontWeight: "500",
    },
    statValue: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: theme.text,
    },
    abilityScores: {
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: "12px",
      marginBottom: "16px",
    },
    abilityBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px",
      backgroundColor: theme.background,
      borderRadius: "8px",
      border: `2px solid ${theme.border}`,
      cursor: "pointer",
      transition: "all 0.2s ease",
      aspectRatio: "1 / 1",
    },
    abilityLabel: {
      fontSize: "1rem",
      color: theme.text,
      fontWeight: "600",
      marginBottom: "2px",
    },
    abilityValue: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: theme.text,
      marginTop: "4px",
    },
    abilityModifier: {
      fontSize: "0.875rem",
      color: theme.primary,
      fontWeight: "600",
    },

    abilityGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
      gap: "16px",
    },
    abilityCard: {
      padding: "12px",
      backgroundColor: theme.background,
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
        <div>
          <div style={styles.title}>
            <Rat size={32} color={theme.primary} />
            Creatures ({creatures.length})
          </div>
          {selectedCharacter && (
            <div
              style={{
                fontSize: "14px",
                color: theme.textSecondary,
                marginTop: "4px",
                marginLeft: "44px",
              }}
            >
              Viewing creatures for {selectedCharacter.name}
            </div>
          )}
        </div>
        {showAddForm ? (
          <div style={styles.buttonGroup}>
            <button
              onClick={handleSave}
              disabled={isSaving || !hasFormChanges()}
              style={{
                ...styles.button,
                backgroundColor: hasFormChanges() ? "#10b981" : theme.border,
                color: hasFormChanges() ? "white" : theme.textSecondary,
                opacity: isSaving ? 0.7 : 1,
                cursor:
                  isSaving || !hasFormChanges() ? "not-allowed" : "pointer",
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
        ) : (
          <button style={styles.addButton} onClick={() => setShowAddForm(true)}>
            <Plus size={18} />
            Add Creature
          </button>
        )}
      </div>

      {showAddForm && (
        <div>
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
                  <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                    <label style={styles.label}>Creature Image</label>
                    {formData.image_url ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        <img
                          src={formData.image_url}
                          alt={formData.name || "Creature"}
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            borderRadius: "8px",
                            border: `2px solid ${theme.border}`,
                            objectFit: "cover",
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          style={{
                            ...styles.button,
                            backgroundColor: "#EF4444",
                            color: "white",
                            width: "fit-content",
                          }}
                        >
                          <Trash2 size={14} />
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          style={{ display: "none" }}
                          id="creature-image-upload"
                        />
                        <label
                          htmlFor="creature-image-upload"
                          style={{
                            ...styles.button,
                            backgroundColor: uploadingImage
                              ? theme.border
                              : theme.primary,
                            color: uploadingImage
                              ? theme.textSecondary
                              : "white",
                            cursor: uploadingImage ? "not-allowed" : "pointer",
                            display: "inline-flex",
                          }}
                        >
                          {uploadingImage ? (
                            <>
                              <Loader size={14} />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Plus size={14} />
                              Upload Image
                            </>
                          )}
                        </label>
                        <div
                          style={{
                            fontSize: "12px",
                            color: theme.textSecondary,
                            marginTop: "8px",
                          }}
                        >
                          Max 5MB. Supported formats: JPEG, PNG, GIF, WebP
                        </div>
                      </div>
                    )}
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
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Initiative Modifier</label>
                    <input
                      type="number"
                      value={formData.initiative_modifier}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          initiative_modifier: e.target.value,
                        })
                      }
                      style={styles.input}
                      placeholder="0"
                    />
                  </div>
                  <div style={styles.formGroup}></div>
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

          <div style={styles.section}>
            <div
              style={styles.sectionHeader}
              onClick={() => toggleSection("skills")}
            >
              <h3 style={styles.sectionTitle}>
                <Zap size={18} />
                Skills & Advantages
              </h3>
              <button style={{ ...styles.button, ...styles.toggleButton }}>
                {expandedSections.skills ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
            {expandedSections.skills && (
              <div style={styles.sectionContent}>
                <div
                  style={{
                    fontSize: "13px",
                    color: theme.textSecondary,
                    marginBottom: "16px",
                    fontStyle: "italic",
                  }}
                >
                  Select skills to add proficiency and/or advantage. Add notes
                  for conditional bonuses (e.g., "only when using smell").
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      ...styles.label,
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Add Skill
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addSkill(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    style={{
                      ...styles.input,
                      cursor: "pointer",
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a skill...
                    </option>
                    {SKILL_LIST.filter(
                      (skill) =>
                        !formData.selected_skills.some(
                          (s) => s.key === skill.key
                        )
                    ).map((skill) => (
                      <option key={skill.key} value={skill.key}>
                        {skill.label} (
                        {skill.ability.substring(0, 3).toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {formData.selected_skills.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {formData.selected_skills.map((selectedSkill) => {
                      const skillInfo = SKILL_LIST.find(
                        (s) => s.key === selectedSkill.key
                      );
                      return (
                        <div
                          key={selectedSkill.key}
                          style={{
                            padding: "12px",
                            backgroundColor: theme.background,
                            borderRadius: "6px",
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
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: theme.text,
                              }}
                            >
                              {skillInfo?.label || selectedSkill.key}
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: theme.textSecondary,
                                  marginLeft: "6px",
                                }}
                              >
                                (
                                {skillInfo?.ability
                                  .substring(0, 3)
                                  .toUpperCase()}
                                )
                              </span>
                            </span>
                            <button
                              onClick={() => removeSkill(selectedSkill.key)}
                              style={{
                                ...styles.button,
                                padding: "4px 8px",
                                backgroundColor: "#EF4444",
                                color: "white",
                                fontSize: "12px",
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px",
                            }}
                          >
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  cursor: "pointer",
                                  marginBottom: "6px",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedSkill.isProficient}
                                  onChange={(e) =>
                                    updateSkill(
                                      selectedSkill.key,
                                      "isProficient",
                                      e.target.checked
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                />
                                <span
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: theme.text,
                                  }}
                                >
                                  Proficiency
                                </span>
                              </label>
                              {selectedSkill.isProficient && (
                                <input
                                  type="text"
                                  value={selectedSkill.proficiencyNote || ""}
                                  onChange={(e) =>
                                    updateSkill(
                                      selectedSkill.key,
                                      "proficiencyNote",
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g., when tracking, in forests, etc."
                                  style={{
                                    ...styles.input,
                                    fontSize: "13px",
                                    padding: "6px 8px",
                                    marginLeft: "22px",
                                  }}
                                />
                              )}
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  cursor: "pointer",
                                  marginBottom: "6px",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedSkill.hasAdvantage}
                                  onChange={(e) =>
                                    updateSkill(
                                      selectedSkill.key,
                                      "hasAdvantage",
                                      e.target.checked
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                />
                                <span
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: theme.text,
                                  }}
                                >
                                  Advantage
                                </span>
                              </label>
                              {selectedSkill.hasAdvantage && (
                                <input
                                  type="text"
                                  value={selectedSkill.advantageNote || ""}
                                  onChange={(e) =>
                                    updateSkill(
                                      selectedSkill.key,
                                      "advantageNote",
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g., only when using smell, in dim light, etc."
                                  style={{
                                    ...styles.input,
                                    fontSize: "13px",
                                    padding: "6px 8px",
                                    marginLeft: "22px",
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ marginTop: "24px" }}>
                  <label
                    style={{
                      ...styles.label,
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    Saving Throw Proficiencies
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "8px",
                    }}
                  >
                    {[
                      { key: "strength", label: "STR" },
                      { key: "dexterity", label: "DEX" },
                      { key: "constitution", label: "CON" },
                      { key: "intelligence", label: "INT" },
                      { key: "wisdom", label: "WIS" },
                      { key: "charisma", label: "CHA" },
                    ].map((ability) => {
                      const isProficient =
                        formData.saving_throw_proficiencies.includes(
                          ability.key
                        );
                      return (
                        <label
                          key={ability.key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px",
                            backgroundColor: isProficient
                              ? theme.primary + "15"
                              : theme.background,
                            borderRadius: "6px",
                            border: `1px solid ${
                              isProficient ? theme.primary : theme.border
                            }`,
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isProficient}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [
                                    ...formData.saving_throw_proficiencies,
                                    ability.key,
                                  ]
                                : formData.saving_throw_proficiencies.filter(
                                    (a) => a !== ability.key
                                  );
                              setFormData({
                                ...formData,
                                saving_throw_proficiencies: updated,
                              });
                            }}
                            style={{ cursor: "pointer" }}
                          />
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.text,
                            }}
                          >
                            {ability.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

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
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Save DC (optional)</label>
                        <input
                          type="number"
                          value={attack.save_dc || ""}
                          onChange={(e) =>
                            updateAttack(
                              index,
                              "save_dc",
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          style={styles.input}
                          placeholder="e.g., 13"
                          min="1"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Save Ability (optional)
                        </label>
                        <select
                          value={attack.save_ability || ""}
                          onChange={(e) =>
                            updateAttack(index, "save_ability", e.target.value)
                          }
                          style={styles.input}
                        >
                          <option value="">None</option>
                          <option value="strength">Strength</option>
                          <option value="dexterity">Dexterity</option>
                          <option value="constitution">Constitution</option>
                          <option value="intelligence">Intelligence</option>
                          <option value="wisdom">Wisdom</option>
                          <option value="charisma">Charisma</option>
                        </select>
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
        </div>
      )}

      {showAddForm && (
        <div
          style={{
            margin: "32px 0",
            borderTop: `3px solid ${theme.border}`,
            paddingTop: "24px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: theme.background,
              padding: "0 16px",
              fontSize: "14px",
              fontWeight: "600",
              color: theme.textSecondary,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            All Creatures
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flex: 1,
                    }}
                  >
                    {creature.image_url && (
                      <img
                        src={creature.image_url}
                        alt={`${creature.name}'s portrait`}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: `2px solid ${theme.primary}`,
                          flexShrink: 0,
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div>
                      <div style={styles.creatureName}>{creature.name}</div>
                      <div style={styles.creatureSubtitle}>
                        {creature.size} {creature.type}
                        {creature.alignment && `, ${creature.alignment}`}
                        {" • Speed: "}
                        {(() => {
                          const speeds = [];
                          if (creature.speed?.walk)
                            speeds.push(`${creature.speed.walk} ft.`);
                          if (creature.speed?.fly)
                            speeds.push(`fly ${creature.speed.fly} ft.`);
                          if (creature.speed?.swim)
                            speeds.push(`swim ${creature.speed.swim} ft.`);
                          if (creature.speed?.climb)
                            speeds.push(`climb ${creature.speed.climb} ft.`);
                          if (creature.speed?.burrow)
                            speeds.push(`burrow ${creature.speed.burrow} ft.`);
                          return speeds.length > 0
                            ? speeds.join(", ")
                            : "30 ft.";
                        })()}
                      </div>
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
                  <div
                    style={{
                      ...styles.statBox,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      border: `3px solid ${getHPColor(creature)}`,
                      backgroundColor: theme.background,
                    }}
                    onClick={() => handleHPClick(creature)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.surface;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme.background;
                    }}
                    title="Click to manage HP"
                  >
                    <div
                      style={{
                        ...styles.statLabel,
                        color: getHPColor(creature),
                      }}
                    >
                      HP
                    </div>
                    <div
                      style={{
                        ...styles.statValue,
                        color: getHPColor(creature),
                      }}
                    >
                      {creature.current_hit_points ?? creature.hit_points}/
                      {creature.hit_points}
                    </div>
                  </div>
                  <div
                    style={{
                      ...styles.statBox,
                      cursor: isRolling ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      border: `3px solid #b27424`,
                      opacity: isRolling ? 0.6 : 1,
                      backgroundColor: theme.background,
                    }}
                    onClick={(e) =>
                      !isRolling && handleInitiativeClick(creature, e)
                    }
                    onMouseEnter={(e) => {
                      if (!isRolling) {
                        e.currentTarget.style.backgroundColor = theme.surface;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme.background;
                    }}
                    title={`Click to roll initiative (d20 ${
                      getInitiativeModifier(creature) >= 0 ? "+" : ""
                    }${getInitiativeModifier(creature)})`}
                  >
                    <div style={{ ...styles.statLabel, color: "#b27424" }}>
                      INIT
                    </div>
                    <div style={{ ...styles.statValue, color: "#b27424" }}>
                      {getInitiativeModifier(creature) >= 0 ? "+" : ""}
                      {getInitiativeModifier(creature)}
                    </div>
                  </div>
                  <div
                    style={{ ...styles.statBox, border: `3px solid #3b82f6` }}
                  >
                    <div style={{ ...styles.statLabel, color: "#3b82f6" }}>
                      AC
                    </div>
                    <div style={{ ...styles.statValue, color: "#3b82f6" }}>
                      {creature.armor_class}
                    </div>
                  </div>
                </div>

                <div style={styles.abilityScores}>
                  {[
                    {
                      label: "STR",
                      key: "strength",
                      name: "Strength",
                      value: creature.strength,
                    },
                    {
                      label: "DEX",
                      key: "dexterity",
                      name: "Dexterity",
                      value: creature.dexterity,
                    },
                    {
                      label: "CON",
                      key: "constitution",
                      name: "Constitution",
                      value: creature.constitution,
                    },
                    {
                      label: "INT",
                      key: "intelligence",
                      name: "Intelligence",
                      value: creature.intelligence,
                    },
                    {
                      label: "WIS",
                      key: "wisdom",
                      name: "Wisdom",
                      value: creature.wisdom,
                    },
                    {
                      label: "CHA",
                      key: "charisma",
                      name: "Charisma",
                      value: creature.charisma,
                    },
                  ].map((ability) => {
                    const modifier = getModifier(ability.value);
                    const isProficientInSave =
                      creature.saving_throw_proficiencies?.includes(
                        ability.key
                      ) || false;
                    const characterLevel = selectedCharacter?.level || 1;
                    const proficiencyBonus =
                      Math.floor((characterLevel - 1) / 4) + 2;
                    const saveModifier =
                      modifier + (isProficientInSave ? proficiencyBonus : 0);
                    return (
                      <div
                        key={ability.key}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          backgroundColor: theme.background,
                          borderRadius: "8px",
                          border: `2px solid ${theme.border}`,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px 8px 8px 8px",
                            cursor: isRolling ? "not-allowed" : "pointer",
                            opacity: isRolling ? 0.6 : 1,
                            width: "100%",
                            transition: "all 0.2s ease",
                            backgroundColor: theme.background,
                            gap: "4px",
                          }}
                          onClick={() =>
                            !isRolling &&
                            handleAbilityClick(
                              creature,
                              ability.name,
                              ability.key,
                              ability.value
                            )
                          }
                          onMouseEnter={(e) => {
                            if (!isRolling) {
                              e.currentTarget.style.backgroundColor =
                                theme.surface;
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              theme.background;
                          }}
                          title={`Click to roll ${ability.name} check (d20 ${
                            modifier >= 0 ? "+" : ""
                          }${modifier})`}
                        >
                          <div
                            style={{
                              fontSize: "1rem",
                              color: theme.text,
                              fontWeight: "600",
                            }}
                          >
                            {ability.label}
                          </div>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              color: theme.primary,
                              fontWeight: "600",
                            }}
                          >
                            {modifier >= 0 ? "+" : ""}
                            {modifier}
                          </div>
                          <div
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                              color: theme.text,
                            }}
                          >
                            {ability.value}
                          </div>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "2px",
                            backgroundColor: theme.border,
                          }}
                        />
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: isProficientInSave
                              ? "white"
                              : theme.textSecondary,
                            textAlign: "center",
                            padding: "6px 8px",
                            fontWeight: isProficientInSave ? "600" : "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            cursor: isRolling ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease",
                            backgroundColor: isProficientInSave
                              ? "#3b82f6"
                              : theme.background,
                          }}
                          onClick={(e) =>
                            !isRolling &&
                            handleSavingThrowClick(
                              creature,
                              ability.name,
                              ability.key,
                              ability.value,
                              e
                            )
                          }
                          onMouseEnter={(e) => {
                            if (!isRolling) {
                              if (isProficientInSave) {
                                e.currentTarget.style.backgroundColor =
                                  "#2563eb";
                              } else {
                                e.currentTarget.style.backgroundColor =
                                  theme.surface;
                                e.currentTarget.style.color = theme.primary;
                              }
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (isProficientInSave) {
                              e.currentTarget.style.backgroundColor = "#3b82f6";
                              e.currentTarget.style.color = "white";
                            } else {
                              e.currentTarget.style.backgroundColor =
                                theme.background;
                              e.currentTarget.style.color = theme.textSecondary;
                            }
                          }}
                          title={`Click to roll ${ability.name} saving throw${
                            isProficientInSave ? " (PROFICIENT)" : ""
                          } (d20 ${
                            saveModifier >= 0 ? "+" : ""
                          }${saveModifier})`}
                        >
                          Save: {saveModifier >= 0 ? "+" : ""}
                          {saveModifier}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {((creature.selected_skills &&
                  creature.selected_skills.length > 0) ||
                  (creature.attacks && creature.attacks.length > 0)) && (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginTop: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    {creature.selected_skills &&
                      creature.selected_skills.length > 0 && (
                        <div
                          style={{
                            flex:
                              creature.attacks && creature.attacks.length > 0
                                ? "1"
                                : "1 1 100%",
                            minWidth:
                              creature.attacks && creature.attacks.length > 0
                                ? "250px"
                                : "auto",
                            padding: "12px",
                            backgroundColor: theme.background,
                            borderRadius: "6px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "1rem",
                              fontWeight: "600",
                              color: theme.text,
                              marginBottom: "8px",
                              paddingBottom: "8px",
                              borderBottom: `1px solid ${theme.border}`,
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <Zap size={16} />
                            Skills
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "6px",
                            }}
                          >
                            {creature.selected_skills.map(
                              (selectedSkill, idx) => {
                                const skillInfo = SKILL_LIST.find(
                                  (s) => s.key === selectedSkill.key
                                );
                                if (!skillInfo) return null;

                                const abilityScore =
                                  creature[skillInfo.ability];
                                const abilityModifier =
                                  getModifier(abilityScore);
                                const characterLevel =
                                  selectedCharacter?.level || 1;
                                const proficiencyBonus =
                                  Math.floor((characterLevel - 1) / 4) + 2;
                                const totalModifier =
                                  abilityModifier +
                                  (selectedSkill.isProficient
                                    ? proficiencyBonus
                                    : 0);

                                return (
                                  <div
                                    key={idx}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      padding: "8px",
                                      backgroundColor: theme.surface,
                                      borderRadius: "4px",
                                      border: `1px solid ${theme.border}`,
                                    }}
                                  >
                                    <div
                                      style={{
                                        flex: 1,
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        color: theme.text,
                                      }}
                                    >
                                      {skillInfo.label}
                                    </div>
                                    <div
                                      style={{ display: "flex", gap: "4px" }}
                                    >
                                      {selectedSkill.isProficient && (
                                        <button
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "4px",
                                            padding: "6px 12px",
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: isRolling
                                              ? "not-allowed"
                                              : "pointer",
                                            transition: "all 0.2s ease",
                                            backgroundColor: "#3b82f6",
                                            color: "white",
                                            opacity: isRolling ? 0.6 : 1,
                                            minWidth: "70px",
                                          }}
                                          onClick={() =>
                                            handleSkillClick(
                                              creature,
                                              skillInfo,
                                              selectedSkill,
                                              abilityModifier
                                            )
                                          }
                                          disabled={isRolling}
                                          title={
                                            selectedSkill.proficiencyNote
                                              ? `Proficiency: ${selectedSkill.proficiencyNote}`
                                              : `Roll with proficiency (+${proficiencyBonus})`
                                          }
                                        >
                                          PROF {totalModifier >= 0 ? "+" : ""}
                                          {totalModifier}
                                        </button>
                                      )}
                                      {selectedSkill.hasAdvantage && (
                                        <button
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "4px",
                                            padding: "6px 12px",
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: isRolling
                                              ? "not-allowed"
                                              : "pointer",
                                            transition: "all 0.2s ease",
                                            backgroundColor: "#10b981",
                                            color: "white",
                                            opacity: isRolling ? 0.6 : 1,
                                            minWidth: "70px",
                                          }}
                                          onClick={() =>
                                            handleSkillClick(
                                              creature,
                                              skillInfo,
                                              selectedSkill,
                                              abilityModifier
                                            )
                                          }
                                          disabled={isRolling}
                                          title={
                                            selectedSkill.advantageNote
                                              ? `Advantage: ${selectedSkill.advantageNote}`
                                              : "Roll with advantage"
                                          }
                                        >
                                          ADV {abilityModifier >= 0 ? "+" : ""}
                                          {abilityModifier}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}

                    {creature.attacks && creature.attacks.length > 0 && (
                      <div
                        style={{
                          flex:
                            creature.selected_skills &&
                            creature.selected_skills.length > 0
                              ? "1"
                              : "1 1 100%",
                          minWidth:
                            creature.selected_skills &&
                            creature.selected_skills.length > 0
                              ? "250px"
                              : "auto",
                          padding: "12px",
                          backgroundColor: theme.background,
                          borderRadius: "6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: theme.text,
                            marginBottom: "8px",
                            paddingBottom: "8px",
                            borderBottom: `1px solid ${theme.border}`,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Sword size={16} />
                          Attacks
                        </div>
                        {creature.attacks.map((attack, idx) => (
                          <div
                            key={idx}
                            style={{
                              marginBottom: "8px",
                              paddingBottom: "8px",
                              padding: "8px",
                              borderRadius: "4px",
                              borderBottom:
                                idx < creature.attacks.length - 1
                                  ? `1px solid ${theme.border}`
                                  : "none",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontSize: "0.9375rem",
                                  fontWeight: "600",
                                  color: theme.text,
                                }}
                              >
                                {attack.name || "Attack - Not Named"}
                                {attack.attack_bonus > 0 && (
                                  <span
                                    style={{
                                      marginLeft: "8px",
                                      color: theme.primary,
                                    }}
                                  >
                                    +{attack.attack_bonus}
                                  </span>
                                )}
                                {attack.save_dc && attack.save_ability && (
                                  <span
                                    style={{
                                      marginLeft: "8px",
                                      color: "#ef4444",
                                      fontWeight: "600",
                                      fontSize: "0.8125rem",
                                    }}
                                  >
                                    DC {attack.save_dc}{" "}
                                    {attack.save_ability
                                      .substring(0, 3)
                                      .toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.9375rem",
                                  color: theme.textSecondary,
                                  marginTop: "2px",
                                }}
                              >
                                {attack.reach && `Reach ${attack.reach} ft.`}
                                {(attack.damage_quantity ||
                                  attack.damage_die ||
                                  attack.damage_dice) &&
                                  (() => {
                                    let damageString = "";
                                    if (
                                      attack.damage_quantity &&
                                      attack.damage_die
                                    ) {
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
                                    fontSize: "0.875rem",
                                    color: theme.text,
                                    marginTop: "4px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {attack.description}
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "6px",
                                flexShrink: 0,
                              }}
                            >
                              {!attack.save_dc && (
                                <button
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "4px 10px",
                                    fontSize: "10px",
                                    fontWeight: "500",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: isRolling
                                      ? "not-allowed"
                                      : "pointer",
                                    transition: "all 0.2s ease",
                                    backgroundColor: "#b27424",
                                    color: "white",
                                    opacity: isRolling ? 0.6 : 1,
                                  }}
                                  onClick={(e) =>
                                    !isRolling &&
                                    handleAttackRoll(creature, attack, e)
                                  }
                                  disabled={isRolling}
                                  title={`Roll attack (d20${
                                    attack.attack_bonus
                                      ? ` + ${attack.attack_bonus}`
                                      : ""
                                  })`}
                                >
                                  <Sword size={12} />
                                  Attack
                                </button>
                              )}
                              {(attack.damage_quantity ||
                                attack.damage_die) && (
                                <button
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "4px 10px",
                                    fontSize: "10px",
                                    fontWeight: "500",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: isRolling
                                      ? "not-allowed"
                                      : "pointer",
                                    transition: "all 0.2s ease",
                                    backgroundColor: "#EF4444",
                                    color: "white",
                                    opacity: isRolling ? 0.6 : 1,
                                  }}
                                  onClick={(e) =>
                                    !isRolling &&
                                    handleDamageRoll(creature, attack, e, false)
                                  }
                                  disabled={isRolling}
                                  title="Roll damage"
                                >
                                  <Zap size={12} />
                                  Damage
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {creature.traits && creature.traits.length > 0 && (
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
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: theme.text,
                        marginBottom: "8px",
                        paddingBottom: "8px",
                        borderBottom: `1px solid ${theme.border}`,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Scroll size={16} />
                      Special Traits
                    </div>
                    {creature.traits.map((trait, idx) => (
                      <div
                        key={idx}
                        style={{
                          marginBottom:
                            idx < creature.traits.length - 1 ? "12px" : "0",
                          paddingBottom:
                            idx < creature.traits.length - 1 ? "12px" : "0",
                          borderBottom:
                            idx < creature.traits.length - 1
                              ? `1px solid ${theme.border}`
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.9375rem",
                            fontWeight: "600",
                            color: theme.primary,
                            marginBottom: "4px",
                          }}
                        >
                          {trait.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: theme.text,
                            lineHeight: "1.5",
                          }}
                        >
                          {trait.description}
                        </div>
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

      <CreatureHPModal
        creature={selectedCreature}
        theme={theme}
        showHPModal={showHPModal}
        setShowHPModal={setShowHPModal}
        damageAmount={damageAmount}
        setDamageAmount={setDamageAmount}
        healAmount={healAmount}
        setHealAmount={setHealAmount}
        isApplyingHP={isApplyingHP}
        onApplyHP={handleApplyHP}
      />
    </div>
  );
};

export default Creatures;
