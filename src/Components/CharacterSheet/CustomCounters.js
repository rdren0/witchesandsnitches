import { useState, useEffect, useCallback } from "react";
import {
  Plus, X, Trash2, Settings, ChevronUp, ChevronDown,
  Sword, Shield, Swords, Target, Crosshair,
  Flame, Sparkles, Zap, Wand2, Star,
  Heart, Activity,
  Skull, Moon, Eye, EyeOff,
  Leaf, Wind, Snowflake, Sun, Droplets,
  Clover, Dices, Trophy, Award,
  BookOpen, Key, Lock, Crown, Gem,
  Music, Feather, Mic, Smile,
  Clock, Timer, Bell, Flag,
  Compass, Anchor, Globe,
  Hammer, Coffee, Wrench,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const ICON_OPTIONS = [
  { name: "Sword",      component: Sword },
  { name: "Swords",     component: Swords },
  { name: "Shield",     component: Shield },
  { name: "Target",     component: Target },
  { name: "Crosshair",  component: Crosshair },
  { name: "Flame",      component: Flame },
  { name: "Sparkles",   component: Sparkles },
  { name: "Zap",        component: Zap },
  { name: "Wand2",      component: Wand2 },
  { name: "Star",       component: Star },
  { name: "Heart",      component: Heart },
  { name: "Activity",   component: Activity },
  { name: "Skull",      component: Skull },
  { name: "Moon",       component: Moon },
  { name: "Eye",        component: Eye },
  { name: "EyeOff",     component: EyeOff },
  { name: "Leaf",       component: Leaf },
  { name: "Wind",       component: Wind },
  { name: "Snowflake",  component: Snowflake },
  { name: "Sun",        component: Sun },
  { name: "Droplets",   component: Droplets },
  { name: "Clover",     component: Clover },
  { name: "Dices",      component: Dices },
  { name: "Trophy",     component: Trophy },
  { name: "Award",      component: Award },
  { name: "BookOpen",   component: BookOpen },
  { name: "Key",        component: Key },
  { name: "Lock",       component: Lock },
  { name: "Crown",      component: Crown },
  { name: "Gem",        component: Gem },
  { name: "Music",      component: Music },
  { name: "Feather",    component: Feather },
  { name: "Mic",        component: Mic },
  { name: "Smile",      component: Smile },
  { name: "Clock",      component: Clock },
  { name: "Timer",      component: Timer },
  { name: "Bell",       component: Bell },
  { name: "Flag",       component: Flag },
  { name: "Compass",    component: Compass },
  { name: "Anchor",     component: Anchor },
  { name: "Globe",      component: Globe },
  { name: "Hammer",     component: Hammer },
  { name: "Coffee",     component: Coffee },
  { name: "Wrench",     component: Wrench },
];

const ICON_MAP = Object.fromEntries(ICON_OPTIONS.map((i) => [i.name, i.component]));

const PRESET_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
];

const DEFAULT_FORM = {
  name: "",
  counter_type: "boolean",
  max_value: "",
  renews_on_long_rest: false,
  description: "",
  color: "#6366f1",
  icon: "",
};

const CustomCounters = ({
  character,
  supabase,
  discordUserId,
  selectedCharacterId,
  isAdmin = false,
  refreshTrigger = 0,
}) => {
  const { theme } = useTheme();
  const [counters, setCounters] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCounter, setEditingCounter] = useState(null);
  const [managingCounter, setManagingCounter] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const effectiveUserId = isAdmin
    ? character?.discord_user_id
    : discordUserId;

  const loadCounters = useCallback(async () => {
    if (!character || !selectedCharacterId || !effectiveUserId) return;
    try {
      const { data, error } = await supabase
        .from("custom_counters")
        .select("*")
        .eq("character_id", selectedCharacterId)
        .eq("discord_user_id", effectiveUserId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading custom counters:", error);
        return;
      }
      setCounters(data || []);
    } catch (err) {
      console.error("Error loading custom counters:", err);
    }
  }, [character, selectedCharacterId, effectiveUserId, supabase]);

  useEffect(() => {
    loadCounters();
  }, [loadCounters, refreshTrigger]);

  const openCreate = () => {
    setEditingCounter(null);
    setForm(DEFAULT_FORM);
    setShowIconPicker(false);
    setShowCreateModal(true);
  };

  const openEdit = (counter) => {
    setEditingCounter(counter);
    setForm({
      name: counter.name,
      counter_type: counter.counter_type,
      max_value: counter.max_value != null ? String(counter.max_value) : "",
      renews_on_long_rest: counter.renews_on_long_rest,
      description: counter.description || "",
      color: counter.color || "#6366f1",
      icon: counter.icon || "",
    });
    setShowIconPicker(!!(counter.icon));
    setManagingCounter(null);
    setShowCreateModal(true);
  };

  const saveCounter = async () => {
    if (!form.name.trim()) return;
    setIsSaving(true);

    const maxVal =
      form.counter_type === "number" && form.max_value !== ""
        ? parseInt(form.max_value, 10)
        : null;

    try {
      if (editingCounter) {
        const { error } = await supabase
          .from("custom_counters")
          .update({
            name: form.name.trim(),
            counter_type: form.counter_type,
            max_value: maxVal,
            renews_on_long_rest: form.renews_on_long_rest,
            description: form.description.trim() || null,
            color: form.color,
            icon: form.icon || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCounter.id);

        if (error) throw error;
      } else {
        const initialValue =
          form.counter_type === "boolean" ? 1 : maxVal != null ? maxVal : 0;

        const { error } = await supabase.from("custom_counters").insert({
          character_id: selectedCharacterId,
          discord_user_id: effectiveUserId,
          name: form.name.trim(),
          counter_type: form.counter_type,
          current_value: initialValue,
          max_value: maxVal,
          renews_on_long_rest: form.renews_on_long_rest,
          description: form.description.trim() || null,
          color: form.color,
          icon: form.icon || null,
        });

        if (error) throw error;
      }

      await loadCounters();
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error saving counter:", err);
      alert("Failed to save counter. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCounter = async (counter) => {
    if (!window.confirm(`Delete counter "${counter.name}"?`)) return;
    try {
      const { error } = await supabase
        .from("custom_counters")
        .delete()
        .eq("id", counter.id);
      if (error) throw error;
      setCounters((prev) => prev.filter((c) => c.id !== counter.id));
      setManagingCounter(null);
    } catch (err) {
      console.error("Error deleting counter:", err);
      alert("Failed to delete counter.");
    }
  };

  const updateValue = async (counter, newValue) => {
    if (isUpdating) return;
    setIsUpdating(true);

    let validated = newValue;
    if (counter.counter_type === "boolean") {
      validated = newValue ? 1 : 0;
    } else {
      validated = Math.max(0, newValue);
      if (counter.max_value != null) {
        validated = Math.min(counter.max_value, validated);
      }
    }

    setCounters((prev) =>
      prev.map((c) =>
        c.id === counter.id ? { ...c, current_value: validated } : c
      )
    );
    if (managingCounter?.id === counter.id) {
      setManagingCounter((prev) => ({ ...prev, current_value: validated }));
    }

    try {
      const { error } = await supabase
        .from("custom_counters")
        .update({
          current_value: validated,
          updated_at: new Date().toISOString(),
        })
        .eq("id", counter.id);
      if (error) throw error;
    } catch (err) {
      console.error("Error updating counter value:", err);
      await loadCounters();
    } finally {
      setIsUpdating(false);
    }
  };

  if (!character) return null;

  // ─── Styles ───────────────────────────────────────────────────────────────

  const counterButtonStyle = (counter) => {
    const isActive =
      counter.counter_type === "boolean"
        ? counter.current_value === 1
        : counter.current_value > 0;
    const color = counter.color || "#6366f1";
    return {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      padding: "8px 12px",
      height: "40px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: color,
      color: "white",
      opacity: isActive ? 1 : 0.45,
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "14px",
      fontWeight: "600",
      minWidth: "60px",
      maxWidth: "120px",
    };
  };

  const addButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    border: `1px dashed ${theme.border}`,
    backgroundColor: "transparent",
    color: theme.textSecondary,
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  };

  const modalStyle = {
    backgroundColor: theme.surface,
    borderRadius: "12px",
    border: `1px solid ${theme.border}`,
    width: "100%",
    maxWidth: "480px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    overflow: "hidden",
  };

  const modalScrollBodyStyle = {
    overflowY: "auto",
    flex: 1,
  };

  const modalHeaderStyle = {
    padding: "16px 20px",
    borderBottom: `1px solid ${theme.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const modalBodyStyle = { padding: "20px" };

  const modalFooterStyle = {
    padding: "12px 20px",
    borderTop: `1px solid ${theme.border}`,
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: theme.textSecondary,
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "6px",
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.background,
    color: theme.text,
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const btnPrimary = (color = "#6366f1") => ({
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: color,
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  });

  const btnSecondary = {
    padding: "8px 16px",
    borderRadius: "6px",
    border: `1px solid ${theme.border}`,
    backgroundColor: "transparent",
    color: theme.text,
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  };

  // ─── Managing modal (use a counter) ──────────────────────────────────────

  const renderManageModal = () => {
    if (!managingCounter) return null;
    const c = managingCounter;
    const color = c.color || "#6366f1";
    const isBool = c.counter_type === "boolean";
    const isActive = isBool ? c.current_value === 1 : c.current_value > 0;

    return (
      <div style={overlayStyle} onClick={() => setManagingCounter(null)}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={modalHeaderStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {c.icon && ICON_MAP[c.icon] ? (() => {
                const IconComp = ICON_MAP[c.icon];
                return <IconComp size={18} style={{ color, flexShrink: 0 }} />;
              })() : (
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    flexShrink: 0,
                  }}
                />
              )}
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "700",
                  color: theme.text,
                }}
              >
                {c.name}
              </h3>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button
                title="Edit counter definition"
                style={{
                  background: "transparent",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "6px",
                  padding: "4px 6px",
                  cursor: "pointer",
                  color: theme.textSecondary,
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => openEdit(c)}
              >
                <Settings size={14} />
              </button>
              <button
                title="Delete counter"
                style={{
                  background: "transparent",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "6px",
                  padding: "4px 6px",
                  cursor: "pointer",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => deleteCounter(c)}
              >
                <Trash2 size={14} />
              </button>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: theme.textSecondary,
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => setManagingCounter(null)}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div style={modalBodyStyle}>
            {c.description && (
              <p
                style={{
                  margin: "0 0 16px",
                  fontSize: "13px",
                  color: theme.textSecondary,
                  padding: "10px 12px",
                  backgroundColor: theme.background,
                  borderRadius: "6px",
                  border: `1px solid ${theme.border}`,
                }}
              >
                {c.description}
              </p>
            )}

            {isBool ? (
              // Boolean toggle
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    flex: 1,
                    padding: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    border: `2px solid ${color}`,
                    backgroundColor: isActive ? color : theme.background,
                    color: isActive ? "white" : theme.textSecondary,
                    opacity: (!isActive || isUpdating) ? 0.5 : 1,
                    cursor: (!isActive || isUpdating) ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { if (isActive && !isUpdating) e.currentTarget.style.outline = "2px solid rgba(255,255,255,0.7)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.outline = "none"; }}
                  onClick={() => { if (isActive) { updateValue(c, 0); setManagingCounter(null); } }}
                  disabled={!isActive || isUpdating}
                >
                  Use
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    border: `2px solid ${color}`,
                    backgroundColor: !isActive ? color : theme.background,
                    color: !isActive ? "white" : theme.textSecondary,
                    opacity: (isActive || isUpdating) ? 0.5 : 1,
                    cursor: (isActive || isUpdating) ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { if (!isActive && !isUpdating) e.currentTarget.style.outline = "2px solid rgba(255,255,255,0.7)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.outline = "none"; }}
                  onClick={() => !isActive && updateValue(c, 1)}
                  disabled={isActive || isUpdating}
                >
                  Restore
                </button>
              </div>
            ) : (
              // Number counter
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <button
                    style={{
                      ...btnPrimary("#ef4444"),
                      width: "40px",
                      height: "40px",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: c.current_value <= 0 || isUpdating ? 0.5 : 1,
                      cursor: c.current_value <= 0 || isUpdating ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => { if (c.current_value > 0 && !isUpdating) e.currentTarget.style.outline = "2px solid rgba(255,255,255,0.7)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.outline = "none"; }}
                    onClick={() => { updateValue(c, c.current_value - 1); setManagingCounter(null); }}
                    disabled={c.current_value <= 0 || isUpdating}
                  >
                    <ChevronDown size={20} />
                  </button>

                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "32px",
                        fontWeight: "800",
                        color: c.current_value > 0 ? color : theme.textSecondary,
                        lineHeight: 1,
                      }}
                    >
                      {c.current_value}
                    </div>
                    {c.max_value != null && (
                      <div
                        style={{
                          fontSize: "13px",
                          color: theme.textSecondary,
                          marginTop: "2px",
                        }}
                      >
                        of {c.max_value}
                      </div>
                    )}
                  </div>

                  <button
                    style={{
                      ...btnPrimary("#10b981"),
                      width: "40px",
                      height: "40px",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity:
                        (c.max_value != null && c.current_value >= c.max_value) || isUpdating
                          ? 0.5
                          : 1,
                      cursor:
                        (c.max_value != null && c.current_value >= c.max_value) || isUpdating
                          ? "not-allowed"
                          : "pointer",
                    }}
                    onMouseEnter={(e) => { if (!(c.max_value != null && c.current_value >= c.max_value) && !isUpdating) e.currentTarget.style.outline = "2px solid rgba(255,255,255,0.7)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.outline = "none"; }}
                    onClick={() => updateValue(c, c.current_value + 1)}
                    disabled={
                      (c.max_value != null && c.current_value >= c.max_value) || isUpdating
                    }
                  >
                    <ChevronUp size={20} />
                  </button>
                </div>

                {c.max_value != null && c.current_value < c.max_value && (
                  <button
                    style={{
                      ...btnPrimary(color),
                      width: "100%",
                      opacity: isUpdating ? 0.7 : 1,
                      cursor: isUpdating ? "wait" : "pointer",
                    }}
                    onMouseEnter={(e) => { if (!isUpdating) e.currentTarget.style.outline = "2px solid rgba(255,255,255,0.7)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.outline = "none"; }}
                    onClick={() => updateValue(c, c.max_value)}
                    disabled={isUpdating}
                  >
                    Restore All
                  </button>
                )}
              </div>
            )}

            {c.renews_on_long_rest && (
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: "12px",
                  color: theme.textSecondary,
                  textAlign: "center",
                }}
              >
                Renews on long rest
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── Create / Edit form modal ─────────────────────────────────────────────

  const renderFormModal = () => {
    if (!showCreateModal) return null;
    const isNumberType = form.counter_type === "number";
    const hasMax = form.max_value !== "";
    const canRenew = form.counter_type === "boolean" || (isNumberType && hasMax);

    return (
      <div
        style={overlayStyle}
        onClick={() => !isSaving && setShowCreateModal(false)}
      >
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={modalHeaderStyle}>
            <h3
              style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: theme.text }}
            >
              {editingCounter ? "Edit Counter" : "New Custom Counter"}
            </h3>
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: theme.textSecondary,
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => setShowCreateModal(false)}
              disabled={isSaving}
            >
              <X size={18} />
            </button>
          </div>

          <div style={modalScrollBodyStyle}>
          <div style={modalBodyStyle}>
            {/* Name */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Name *</label>
              <input
                style={inputStyle}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Channel Divinity, Bardic Inspiration…"
                maxLength={40}
                autoFocus
              />
            </div>

            {/* Type */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Type</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["boolean", "number"].map((t) => (
                  <button
                    key={t}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "6px",
                      border: `2px solid ${form.counter_type === t ? form.color : theme.border}`,
                      backgroundColor:
                        form.counter_type === t ? form.color : "transparent",
                      color: form.counter_type === t ? "white" : theme.textSecondary,
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        counter_type: t,
                        renews_on_long_rest: false,
                        max_value: "",
                      }))
                    }
                  >
                    {t === "boolean" ? "On / Off" : "Number"}
                  </button>
                ))}
              </div>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "12px",
                  color: theme.textSecondary,
                }}
              >
                {form.counter_type === "boolean"
                  ? "A simple toggle — like Inspiration."
                  : "A number that can go up and down — like Luck Points."}
              </p>
            </div>

            {/* Max value (number only) */}
            {isNumberType && (
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Maximum value (optional)</label>
                <input
                  style={{ ...inputStyle, width: "120px" }}
                  type="number"
                  min="1"
                  value={form.max_value}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, max_value: e.target.value }))
                  }
                  placeholder="e.g. 3"
                />
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "12px",
                    color: theme.textSecondary,
                  }}
                >
                  Leave blank for no upper limit.
                </p>
              </div>
            )}

            {/* Renews on long rest */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: canRenew ? "pointer" : "not-allowed",
                  opacity: canRenew ? 1 : 0.5,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.renews_on_long_rest}
                  disabled={!canRenew}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      renews_on_long_rest: e.target.checked,
                    }))
                  }
                  style={{ width: "16px", height: "16px", cursor: canRenew ? "pointer" : "not-allowed" }}
                />
                <span style={{ fontSize: "14px", color: theme.text, fontWeight: "500" }}>
                  Renews on long rest
                </span>
              </label>
              {isNumberType && !hasMax && (
                <p
                  style={{
                    margin: "4px 0 0 24px",
                    fontSize: "12px",
                    color: theme.textSecondary,
                  }}
                >
                  Set a maximum value to enable long rest renewal.
                </p>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Description (optional)</label>
              <textarea
                style={{
                  ...inputStyle,
                  height: "64px",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Remind yourself what this counter is for…"
                maxLength={200}
              />
            </div>

            {/* Color */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Color</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm((f) => ({ ...f, color: c }))}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border:
                        form.color === c
                          ? `3px solid ${theme.text}`
                          : "3px solid transparent",
                      backgroundColor: c,
                      cursor: "pointer",
                      padding: 0,
                      transition: "border-color 0.15s",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Icon */}
            <div>
              <button
                onClick={() => setShowIconPicker((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  marginBottom: showIconPicker ? "8px" : 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={labelStyle}>Icon (optional)</span>
                  {form.icon && ICON_MAP[form.icon] && (() => {
                    const IconComp = ICON_MAP[form.icon];
                    return (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          backgroundColor: form.color,
                          color: "white",
                        }}
                      >
                        <IconComp size={12} />
                      </span>
                    );
                  })()}
                </div>
                <ChevronDown
                  size={14}
                  style={{
                    color: theme.textSecondary,
                    transform: showIconPicker ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {showIconPicker && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(9, 1fr)",
                    gap: "4px",
                  }}
                >
                  {/* None option */}
                  <button
                    title="No icon"
                    onClick={() => setForm((f) => ({ ...f, icon: "" }))}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      borderRadius: "6px",
                      border: `2px solid ${form.icon === "" ? theme.text : theme.border}`,
                      backgroundColor: form.icon === "" ? form.color : "transparent",
                      color: form.icon === "" ? "white" : theme.textSecondary,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: 0,
                    }}
                  >
                    —
                  </button>
                  {ICON_OPTIONS.map(({ name, component: IconComp }) => (
                    <button
                      key={name}
                      title={name}
                      onClick={() => setForm((f) => ({ ...f, icon: name }))}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        borderRadius: "6px",
                        border: `2px solid ${form.icon === name ? theme.text : theme.border}`,
                        backgroundColor: form.icon === name ? form.color : "transparent",
                        color: form.icon === name ? "white" : theme.textSecondary,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                      }}
                    >
                      <IconComp size={14} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          </div>

          <div style={modalFooterStyle}>
            {editingCounter && (
              <button
                style={{
                  ...btnSecondary,
                  color: "#ef4444",
                  borderColor: "#ef4444",
                  marginRight: "auto",
                }}
                onClick={() => deleteCounter(editingCounter)}
                disabled={isSaving}
              >
                Delete
              </button>
            )}
            <button
              style={btnSecondary}
              onClick={() => setShowCreateModal(false)}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              style={{
                ...btnPrimary(form.color),
                opacity: !form.name.trim() || isSaving ? 0.6 : 1,
                cursor: !form.name.trim() || isSaving ? "not-allowed" : "pointer",
              }}
              onClick={saveCounter}
              disabled={!form.name.trim() || isSaving}
            >
              {isSaving ? "Saving…" : editingCounter ? "Save Changes" : "Create Counter"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Counter buttons ──────────────────────────────────────────────────────

  const renderCounter = (counter) => {
    const color = counter.color || "#6366f1";
    const isBool = counter.counter_type === "boolean";
    const isActive = isBool
      ? counter.current_value === 1
      : counter.current_value > 0;

    const label =
      counter.name.length > 10
        ? counter.name.slice(0, 9) + "…"
        : counter.name;

    return (
      <div
        key={counter.id}
        style={counterButtonStyle(counter)}
        onClick={() => setManagingCounter(counter)}
        onMouseEnter={(e) => { e.currentTarget.style.outline = "2px solid rgba(255,255,255,0.7)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.outline = "none"; }}
        title={
          counter.description
            ? `${counter.name}: ${counter.description}`
            : counter.name
        }
      >
        {counter.icon && ICON_MAP[counter.icon] && (() => {
          const IconComponent = ICON_MAP[counter.icon];
          return <IconComponent size={14} style={{ flexShrink: 0 }} />;
        })()}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {label}
        </span>

        {/* Badge for number type */}
        {!isBool && (
          <span
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              backgroundColor: color,
              color: "white",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: "bold",
              border: `2px solid ${theme.surface}`,
            }}
          >
            {counter.max_value != null
              ? counter.current_value
              : counter.current_value}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      {counters.map(renderCounter)}

      <button
        style={addButtonStyle}
        onClick={openCreate}
        title="Add custom counter"
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme.textSecondary;
          e.currentTarget.style.color = theme.text;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = theme.border;
          e.currentTarget.style.color = theme.textSecondary;
        }}
      >
        <Plus size={14} />
      </button>

      {renderManageModal()}
      {renderFormModal()}
    </>
  );
};

export default CustomCounters;
