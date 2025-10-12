import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  X,
  Check,
  Loader,
  Star,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Gift,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getInventoryStyles } from "./styles";
import { shouldFilterFromOtherPlayers } from "../../utils/characterFiltering";
import Bank from "../Bank/Bank";

const Inventory = ({ user, selectedCharacter, supabase, adminMode }) => {
  const { theme } = useTheme();
  const styles = getInventoryStyles(theme);

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [expandedStack, setExpandedStack] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sendItemModal, setSendItemModal] = useState(null);
  const [sessionCharacters, setSessionCharacters] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [isSendingItem, setIsSendingItem] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
    value: "",
    category: "General",
    attunement_required: false,
  });

  const categories = [
    "General",
    "Armor",
    "Books",
    "Currency",
    "Food",
    "Magical Items",
    "Potions",
    "Recipes",
    "Scrolls",
    "Tools",
    "Weapons",
  ];

  const fetchItems = useCallback(async () => {
    if (!supabase || !selectedCharacter?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setItems(data || []);
      setLastRefresh(Date.now());
    } catch (err) {
      console.error("Error fetching inventory items:", err);
      setError("Failed to load inventory items. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase, selectedCharacter?.id]);

  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const fetchSessionCharacters = useCallback(async () => {
    const gameSession =
      selectedCharacter?.gameSession || selectedCharacter?.game_session;

    if (!supabase || !gameSession) {
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("characters")
        .select("id, name, discord_user_id, game_session")
        .eq("active", true)
        .eq("game_session", gameSession)
        .neq("id", selectedCharacter.id)
        .order("name", { ascending: true });

      if (fetchError) throw fetchError;

      const filteredData = (data || []).filter((character) => {
        return !shouldFilterFromOtherPlayers(character.name, gameSession);
      });

      setSessionCharacters(filteredData);
    } catch (err) {
      console.error("Error fetching session characters:", err);
    }
  }, [
    supabase,
    selectedCharacter?.gameSession,
    selectedCharacter?.game_session,
    selectedCharacter?.id,
  ]);

  useEffect(() => {
    const gameSession =
      selectedCharacter?.gameSession || selectedCharacter?.game_session;
    if (gameSession) {
      fetchSessionCharacters();
    }
  }, [
    fetchSessionCharacters,
    selectedCharacter?.gameSession,
    selectedCharacter?.game_session,
  ]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && selectedCharacter?.id) {
        fetchItems();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchItems, selectedCharacter?.id]);

  const addItem = useCallback(async () => {
    if (!formData.name.trim() || !supabase || !selectedCharacter?.id) return;

    setIsSaving(true);
    setError(null);

    try {
      const newItem = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        quantity: parseInt(formData.quantity) || 1,
        value: formData.value.trim() || null,
        category: formData.category,
        attunement_required: formData.attunement_required,
        character_id: selectedCharacter.id,

        discord_user_id: adminMode
          ? selectedCharacter.discord_user_id
          : user?.discord_user_id || user?.id,
      };

      const { data, error: insertError } = await supabase
        .from("inventory_items")
        .insert([newItem])
        .select()
        .single();

      if (insertError) throw insertError;

      setItems((prev) => [data, ...prev]);
      setFormData({
        name: "",
        description: "",
        quantity: 1,
        attunement_required: false,
        value: "",
        category: "General",
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding item:", err);
      setError("Failed to add item. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [
    formData,
    supabase,
    selectedCharacter?.id,
    user?.id,
    user?.discord_user_id,
  ]);

  const deleteItem = useCallback(
    async (id) => {
      if (!supabase) return;

      setError(null);

      try {
        const { error: deleteError } = await supabase
          .from("inventory_items")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;

        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Error deleting item:", err);
        setError("Failed to delete item. Please try again.");
      }
    },
    [supabase]
  );

  const startEdit = useCallback((item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description || "",
      quantity: item.quantity,
      value: item.value || "",
      category: item.category,
      attunement_required: item.attunement_required,
    });
  }, []);

  const saveEdit = useCallback(async () => {
    if (!formData.name.trim() || !editingId || !supabase) return;

    setIsSaving(true);
    setError(null);

    try {
      const updatedItem = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        quantity: parseInt(formData.quantity) || 1,
        value: formData.value.trim() || null,
        category: formData.category,
        attunement_required: formData.attunement_required,
      };

      const { data, error: updateError } = await supabase
        .from("inventory_items")
        .update(updatedItem)
        .eq("id", editingId)
        .select()
        .single();

      if (updateError) throw updateError;

      setItems((prev) =>
        prev.map((item) => (item.id === editingId ? data : item))
      );

      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        quantity: 1,
        value: "",
        category: "General",
        attunement_required: false,
      });
    } catch (err) {
      console.error("Error updating item:", err);
      setError("Failed to update item. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [formData, editingId, supabase]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      quantity: 1,
      value: "",
      category: "General",
      attunement_required: false,
    });
    setShowAddForm(false);
    setError(null);
  }, []);

  const sendItem = useCallback(async () => {
    if (!sendItemModal || !selectedRecipient || !supabase) return;

    const { selectedItem, quantityToSend } = sendItemModal;

    if (!selectedItem) {
      setError("Please select an item to send");
      return;
    }

    if (quantityToSend <= 0 || quantityToSend > selectedItem.quantity) {
      setError("Invalid quantity to send");
      return;
    }

    setIsSendingItem(true);
    setError(null);

    try {
      const newItem = {
        name: selectedItem.name,
        description: selectedItem.description,
        quantity: quantityToSend,
        value: selectedItem.value,
        category: selectedItem.category,
        attunement_required: selectedItem.attunement_required,
        character_id: selectedRecipient.id,
        discord_user_id: selectedRecipient.discord_user_id,
      };

      const { error: insertError } = await supabase
        .from("inventory_items")
        .insert([newItem]);

      if (insertError) throw insertError;

      if (quantityToSend === selectedItem.quantity) {
        const { error: deleteError } = await supabase
          .from("inventory_items")
          .delete()
          .eq("id", selectedItem.id);

        if (deleteError) throw deleteError;

        setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      } else {
        const { error: updateError } = await supabase
          .from("inventory_items")
          .update({ quantity: selectedItem.quantity - quantityToSend })
          .eq("id", selectedItem.id);

        if (updateError) throw updateError;

        setItems((prev) =>
          prev.map((i) =>
            i.id === selectedItem.id
              ? { ...i, quantity: i.quantity - quantityToSend }
              : i
          )
        );
      }

      setSendItemModal(null);
      setSelectedRecipient(null);
    } catch (err) {
      console.error("Error sending item:", err);
      setError("Failed to send item. Please try again.");
    } finally {
      setIsSendingItem(false);
    }
  }, [sendItemModal, selectedRecipient, supabase]);

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description &&
            item.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [items, searchTerm]
  );

  const groupedItems = useMemo(
    () =>
      filteredItems.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {}),
    [filteredItems]
  );

  const stackedItems = useMemo(() => {
    const stacked = {};
    Object.entries(groupedItems).forEach(([category, categoryItems]) => {
      const itemStacks = {};

      categoryItems.forEach((item) => {
        const key = item.name.toLowerCase().trim();
        if (!itemStacks[key]) {
          itemStacks[key] = {
            stackKey: `${category}-${key}`,
            name: item.name,
            category: item.category,
            description: item.description,
            value: item.value,
            attunement_required: item.attunement_required,
            totalQuantity: 0,
            items: [],
          };
        }
        itemStacks[key].totalQuantity += item.quantity;
        itemStacks[key].items.push(item);
      });

      stacked[category] = Object.values(itemStacks);
    });
    return stacked;
  }, [groupedItems]);

  const stats = useMemo(() => {
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const attunementItems = items.filter(
      (item) => item.attunement_required
    ).length;
    const categories = new Set(items.map((item) => item.category)).size;

    return {
      totalItems,
      totalQuantity,
      attunementItems,
      categories,
    };
  }, [items]);

  if (!user || !selectedCharacter) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>
            Please select a character to view their inventory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainLayout}>
        <Bank
          user={user}
          selectedCharacter={selectedCharacter}
          supabase={supabase}
          adminMode={adminMode}
        />

        <div style={styles.inventorySection}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              <Package size={28} color={theme.primary} />
              Inventory Management
            </h1>
            <p style={styles.subtitle}>
              Manage your character's items, equipment, and possessions
            </p>
          </div>

          {isLoading && !isRefreshing && (
            <div style={styles.loadingMessage}>
              <Loader size={16} />
              Loading inventory items...
            </div>
          )}

          {error && (
            <div style={styles.errorMessage}>
              {error}
              <button
                onClick={() => setError(null)}
                style={{
                  marginLeft: "12px",
                  background: "none",
                  border: "none",
                  color: theme.error || "#EF4444",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Dismiss
              </button>
            </div>
          )}

          {items.length > 0 && !isLoading && (
            <div style={styles.statsCard}>
              <span>
                Attunement Required: <strong>{stats.attunementItems}</strong>
              </span>
            </div>
          )}

          {!isLoading && (
            <div style={styles.controls}>
              {!showAddForm && !editingId && (
                <>
                  <button
                    onClick={() => setShowAddForm(true)}
                    style={styles.addButton}
                  >
                    <Plus size={18} />
                    Add New Item
                  </button>
                </>
              )}

              {items.length > 0 && (
                <div style={styles.searchContainer}>
                  <Search size={18} style={styles.searchIcon} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search items..."
                    style={styles.searchInput}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border;
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {showAddForm && (
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>Add New Item</h3>

              <div style={styles.formGrid}>
                <div style={styles.formField}>
                  <label style={styles.label}>Item Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Wizard's Hat, Health Potion"
                    style={styles.input}
                    disabled={isSaving}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border;
                    }}
                  />
                </div>

                <div style={styles.formField}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    style={styles.select}
                    disabled={isSaving}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.formField}>
                  <label style={styles.label}>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                    style={styles.input}
                    disabled={isSaving}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border;
                    }}
                  />
                </div>

                <div style={styles.formField}>
                  <label style={styles.label}>Value</label>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    placeholder="5 Galleons, 10 Sickles, etc."
                    style={styles.input}
                    disabled={isSaving}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border;
                    }}
                  />
                </div>

                <div style={{ ...styles.formField, ...styles.formFieldFull }}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Item description, magical properties, etc."
                    style={styles.textarea}
                    disabled={isSaving}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border;
                    }}
                  />
                </div>

                <div style={styles.checkboxField}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.attunement_required}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          attunement_required: e.target.checked,
                        }))
                      }
                      style={styles.checkbox}
                      disabled={isSaving}
                    />
                    <Star size={16} color="#F59E0B" />
                    Requires Attunement
                  </label>
                  <small
                    style={{ color: theme.textSecondary, fontSize: "12px" }}
                  >
                    Check this if the item requires magical attunement to use
                  </small>
                </div>
              </div>

              <div style={styles.formActions}>
                <button
                  onClick={addItem}
                  disabled={!formData.name.trim() || isSaving}
                  style={{
                    ...styles.saveButton,
                    opacity: !formData.name.trim() || isSaving ? 0.5 : 1,
                    cursor:
                      !formData.name.trim() || isSaving
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {isSaving ? (
                    <>
                      <Loader size={18} />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Add Item
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      name: "",
                      description: "",
                      quantity: 1,
                      value: "",
                      category: "General",
                      attunement_required: false,
                    });
                  }}
                  style={styles.cancelButton}
                  disabled={isSaving}
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!isLoading && (
            <>
              {filteredItems.length > 0 ? (
                Object.entries(stackedItems).map(([category, stacks]) => {
                  const attunementCount = stacks.filter(
                    (stack) => stack.attunement_required
                  ).length;
                  const isCollapsed = collapsedCategories[category];

                  return (
                    <div key={category} style={{ marginBottom: "32px" }}>
                      <div
                        style={{
                          ...styles.categoryHeader,
                          cursor: "pointer",
                          userSelect: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        onClick={() =>
                          setCollapsedCategories({
                            ...collapsedCategories,
                            [category]: !isCollapsed,
                          })
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {isCollapsed ? (
                            <ChevronDown size={20} />
                          ) : (
                            <ChevronUp size={20} />
                          )}
                          <span>
                            {category} ({stacks.length}{" "}
                            {stacks.length === 1 ? "type" : "types"})
                          </span>
                          {attunementCount > 0 && (
                            <span style={styles.categoryStats}>
                              {attunementCount} require attunement
                            </span>
                          )}
                        </div>
                      </div>
                      {!isCollapsed && (
                        <div style={styles.itemsGrid}>
                          {stacks.map((stack) => {
                            const isExpanded = expandedStack === stack.stackKey;

                            return (
                              <div
                                key={stack.stackKey}
                                style={{
                                  ...styles.itemCard,
                                  ...(isExpanded && { gridColumn: "1 / -1" }),
                                }}
                              >
                                {isExpanded ? (
                                  <div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "16px",
                                      }}
                                    >
                                      <h4
                                        style={{
                                          margin: 0,
                                          fontSize: "16px",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {stack.name}
                                      </h4>
                                      <button
                                        onClick={() => {
                                          setExpandedStack(null);
                                          setEditingId(null);
                                        }}
                                        style={{
                                          ...styles.actionButton,
                                          backgroundColor:
                                            theme.warning || "#F97316",
                                          color: "white",
                                        }}
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                    {stack.items.map((item, index) => (
                                      <div
                                        key={item.id}
                                        style={{
                                          marginBottom:
                                            index < stack.items.length - 1
                                              ? "16px"
                                              : 0,
                                          paddingBottom:
                                            index < stack.items.length - 1
                                              ? "16px"
                                              : 0,
                                          borderBottom:
                                            index < stack.items.length - 1
                                              ? `1px solid ${theme.border}`
                                              : "none",
                                        }}
                                      >
                                        {editingId === item.id ? (
                                          <div>
                                            <div
                                              style={{
                                                ...styles.form,
                                                margin: 0,
                                              }}
                                            >
                                              <div style={styles.formRow}>
                                                <div style={styles.formGroup}>
                                                  <label style={styles.label}>
                                                    Name
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) =>
                                                      setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                      })
                                                    }
                                                    style={styles.input}
                                                    placeholder="Item name"
                                                  />
                                                </div>
                                                <div style={styles.formGroup}>
                                                  <label style={styles.label}>
                                                    Category
                                                  </label>
                                                  <select
                                                    value={formData.category}
                                                    onChange={(e) =>
                                                      setFormData({
                                                        ...formData,
                                                        category:
                                                          e.target.value,
                                                      })
                                                    }
                                                    style={styles.input}
                                                  >
                                                    {categories.map((cat) => (
                                                      <option
                                                        key={cat}
                                                        value={cat}
                                                      >
                                                        {cat}
                                                      </option>
                                                    ))}
                                                  </select>
                                                </div>
                                              </div>

                                              <div style={styles.formGroup}>
                                                <label style={styles.label}>
                                                  Description
                                                </label>
                                                <textarea
                                                  value={formData.description}
                                                  onChange={(e) =>
                                                    setFormData({
                                                      ...formData,
                                                      description:
                                                        e.target.value,
                                                    })
                                                  }
                                                  style={{
                                                    ...styles.input,
                                                    minHeight: "80px",
                                                  }}
                                                  placeholder="Item description"
                                                />
                                              </div>

                                              <div style={styles.formRow}>
                                                <div style={styles.formGroup}>
                                                  <label style={styles.label}>
                                                    Quantity
                                                  </label>
                                                  <input
                                                    type="number"
                                                    value={formData.quantity}
                                                    onChange={(e) =>
                                                      setFormData({
                                                        ...formData,
                                                        quantity:
                                                          parseInt(
                                                            e.target.value
                                                          ) || 0,
                                                      })
                                                    }
                                                    style={styles.input}
                                                    min="0"
                                                  />
                                                </div>
                                                <div style={styles.formGroup}>
                                                  <label style={styles.label}>
                                                    Value (Galleons)
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={formData.value}
                                                    onChange={(e) =>
                                                      setFormData({
                                                        ...formData,
                                                        value: e.target.value,
                                                      })
                                                    }
                                                    style={styles.input}
                                                    placeholder="e.g., 10 or 5.5"
                                                  />
                                                </div>
                                              </div>

                                              <div style={styles.formGroup}>
                                                <label
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  <input
                                                    type="checkbox"
                                                    checked={
                                                      formData.attunement_required
                                                    }
                                                    onChange={(e) =>
                                                      setFormData({
                                                        ...formData,
                                                        attunement_required:
                                                          e.target.checked,
                                                      })
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  />
                                                  <span style={styles.label}>
                                                    Requires Attunement
                                                  </span>
                                                </label>
                                              </div>

                                              <div
                                                style={{
                                                  display: "flex",
                                                  gap: "8px",
                                                  marginTop: "12px",
                                                }}
                                              >
                                                <button
                                                  onClick={saveEdit}
                                                  disabled={isSaving}
                                                  style={{
                                                    ...styles.button,
                                                    ...styles.addButton,
                                                    opacity: isSaving ? 0.7 : 1,
                                                  }}
                                                >
                                                  {isSaving ? (
                                                    <Loader size={16} />
                                                  ) : (
                                                    <Check size={16} />
                                                  )}
                                                  {isSaving
                                                    ? "Saving..."
                                                    : "Save"}
                                                </button>
                                                <button
                                                  onClick={cancelEdit}
                                                  disabled={isSaving}
                                                  style={{
                                                    ...styles.button,
                                                    ...styles.cancelButton,
                                                    opacity: isSaving ? 0.5 : 1,
                                                  }}
                                                >
                                                  <X size={16} />
                                                  Cancel
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "flex-start",
                                            }}
                                          >
                                            <div style={{ flex: 1 }}>
                                              <div
                                                style={{
                                                  fontWeight: "600",
                                                  marginBottom: "4px",
                                                }}
                                              >
                                                Qty: {item.quantity}
                                                {item.value &&
                                                  item.value !== 0 &&
                                                  item.value !== "0" &&
                                                  ` • Value: ${item.value}`}
                                              </div>
                                              {item.description && (
                                                <div
                                                  style={{
                                                    fontSize: "13px",
                                                    color: theme.textSecondary,
                                                    marginTop: "4px",
                                                  }}
                                                >
                                                  {item.description}
                                                </div>
                                              )}
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                gap: "8px",
                                                marginLeft: "12px",
                                              }}
                                            >
                                              {sessionCharacters.length > 0 && (
                                                <button
                                                  onClick={() =>
                                                    setSendItemModal({
                                                      stack: null,
                                                      items: [item],
                                                      selectedItem: item,
                                                      quantityToSend: 1,
                                                    })
                                                  }
                                                  style={{
                                                    ...styles.actionButton,
                                                    backgroundColor:
                                                      theme.primary,
                                                    color: "white",
                                                  }}
                                                  title="Send to another character"
                                                >
                                                  <Gift size={16} />
                                                </button>
                                              )}
                                              <button
                                                onClick={() => startEdit(item)}
                                                style={{
                                                  ...styles.actionButton,
                                                  ...styles.editButton,
                                                }}
                                              >
                                                <Edit2 size={16} />
                                              </button>
                                              <button
                                                onClick={() =>
                                                  deleteItem(item.id)
                                                }
                                                style={{
                                                  ...styles.actionButton,
                                                  ...styles.deleteButton,
                                                }}
                                              >
                                                <Trash2 size={16} />
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <>
                                    <div style={styles.itemHeader}>
                                      <div>
                                        <div style={styles.itemName}>
                                          {stack.name}
                                          {stack.attunement_required && (
                                            <span
                                              style={styles.attunementBadge}
                                            >
                                              <Star
                                                size={12}
                                                color={theme.warning}
                                              />
                                              Attunement
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div style={styles.itemActions}>
                                        {sessionCharacters.length > 0 && (
                                          <button
                                            onClick={() =>
                                              setSendItemModal({
                                                stack,
                                                items: stack.items,
                                                selectedItem:
                                                  stack.items.length === 1
                                                    ? stack.items[0]
                                                    : null,
                                                quantityToSend: 1,
                                              })
                                            }
                                            disabled={
                                              expandedStack ||
                                              showAddForm ||
                                              isSaving
                                            }
                                            style={{
                                              ...styles.actionButton,
                                              backgroundColor: theme.primary,
                                              color: "white",
                                              opacity:
                                                expandedStack ||
                                                showAddForm ||
                                                isSaving
                                                  ? 0.5
                                                  : 1,
                                            }}
                                            title="Send to another character"
                                          >
                                            <Gift size={16} />
                                          </button>
                                        )}
                                        <button
                                          onClick={() =>
                                            setExpandedStack(stack.stackKey)
                                          }
                                          disabled={
                                            expandedStack ||
                                            showAddForm ||
                                            isSaving
                                          }
                                          style={{
                                            ...styles.actionButton,
                                            ...styles.editButton,
                                            opacity:
                                              expandedStack ||
                                              showAddForm ||
                                              isSaving
                                                ? 0.5
                                                : 1,
                                          }}
                                        >
                                          <Edit2 size={16} />
                                        </button>
                                      </div>
                                    </div>

                                    {stack.description && (
                                      <div style={styles.itemDescription}>
                                        {stack.description}
                                      </div>
                                    )}

                                    <div style={styles.itemMeta}>
                                      <span style={styles.quantityBadge}>
                                        Qty: {stack.totalQuantity}
                                      </span>
                                      {stack.value &&
                                        stack.value !== 0 &&
                                        stack.value !== "0" && (
                                          <span>Value: {stack.value}</span>
                                        )}
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : items.length > 0 ? (
                <div style={styles.emptyState}>
                  <Search
                    size={48}
                    color={theme.textSecondary}
                    style={styles.emptyIcon}
                  />
                  <p style={styles.emptyText}>No items match your search.</p>
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <Package
                    size={48}
                    color={theme.textSecondary}
                    style={styles.emptyIcon}
                  />
                  <p style={styles.emptyText}>
                    Your inventory is empty. Add some items to get started!
                  </p>
                  <p
                    style={{
                      ...styles.emptyText,
                      fontSize: "14px",
                      marginTop: "8px",
                    }}
                  >
                    💡 Items from your character's background will appear here
                    automatically when you create or edit characters.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {sendItemModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => {
            setSendItemModal(null);
            setSelectedRecipient(null);
          }}
        >
          <div
            style={{
              backgroundColor: theme.background,
              borderRadius: "12px",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              border: `1px solid ${theme.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: `2px solid ${theme.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: theme.surface,
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
              }}
            >
              <h2 style={{ margin: 0, color: theme.text, fontSize: "20px" }}>
                <Gift
                  size={24}
                  style={{ verticalAlign: "middle", marginRight: "8px" }}
                />
                Send Item
              </h2>
              <button
                onClick={() => {
                  setSendItemModal(null);
                  setSelectedRecipient(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: theme.textSecondary,
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>
              {sendItemModal.items.length > 1 &&
                !sendItemModal.selectedItem && (
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        ...styles.label,
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Select Item to Send
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {sendItemModal.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() =>
                            setSendItemModal((prev) => ({
                              ...prev,
                              selectedItem: item,
                              quantityToSend: 1,
                            }))
                          }
                          style={{
                            padding: "12px",
                            backgroundColor: theme.surface,
                            border: `2px solid ${theme.border}`,
                            borderRadius: "8px",
                            cursor: "pointer",
                            textAlign: "left",
                            color: theme.text,
                          }}
                        >
                          <div
                            style={{ fontWeight: "600", marginBottom: "4px" }}
                          >
                            {item.name}
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: theme.textSecondary,
                            }}
                          >
                            Qty: {item.quantity}
                            {item.value && ` • Value: ${item.value}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {sendItemModal.selectedItem && (
                <>
                  <div
                    style={{
                      marginBottom: "20px",
                      padding: "12px",
                      backgroundColor: theme.surface,
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "600",
                        marginBottom: "4px",
                        color: theme.text,
                      }}
                    >
                      {sendItemModal.selectedItem.name}
                    </div>
                    {sendItemModal.selectedItem.description && (
                      <div
                        style={{
                          fontSize: "13px",
                          color: theme.textSecondary,
                          marginBottom: "8px",
                        }}
                      >
                        {sendItemModal.selectedItem.description}
                      </div>
                    )}
                    <div
                      style={{ fontSize: "13px", color: theme.textSecondary }}
                    >
                      Available: {sendItemModal.selectedItem.quantity}
                      {sendItemModal.selectedItem.value &&
                        ` • Value: ${sendItemModal.selectedItem.value}`}
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        ...styles.label,
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Quantity to Send
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={sendItemModal.selectedItem.quantity}
                      value={sendItemModal.quantityToSend}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setSendItemModal((prev) => ({
                          ...prev,
                          quantityToSend: Math.min(
                            Math.max(1, value),
                            sendItemModal.selectedItem.quantity
                          ),
                        }));
                      }}
                      style={styles.input}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        ...styles.label,
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Send To
                    </label>
                    {sessionCharacters.length === 0 ? (
                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: theme.surface,
                          borderRadius: "8px",
                          color: theme.textSecondary,
                        }}
                      >
                        No other characters in your session
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {sessionCharacters.map((character) => (
                          <button
                            key={character.id}
                            onClick={() => setSelectedRecipient(character)}
                            style={{
                              padding: "12px",
                              backgroundColor:
                                selectedRecipient?.id === character.id
                                  ? theme.primary + "20"
                                  : theme.surface,
                              border: `2px solid ${
                                selectedRecipient?.id === character.id
                                  ? theme.primary
                                  : theme.border
                              }`,
                              borderRadius: "8px",
                              cursor: "pointer",
                              textAlign: "left",
                              color: theme.text,
                              fontWeight:
                                selectedRecipient?.id === character.id
                                  ? "600"
                                  : "normal",
                            }}
                          >
                            {character.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderTop: `1px solid ${theme.border}`,
                backgroundColor: theme.surface,
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                onClick={() => {
                  setSendItemModal(null);
                  setSelectedRecipient(null);
                }}
                style={{
                  flex: 1,
                  padding: "10px 20px",
                  backgroundColor: theme.background,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>
              <button
                onClick={sendItem}
                disabled={
                  !sendItemModal.selectedItem ||
                  !selectedRecipient ||
                  isSendingItem
                }
                style={{
                  flex: 1,
                  padding: "10px 20px",
                  backgroundColor: theme.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor:
                    !sendItemModal.selectedItem ||
                    !selectedRecipient ||
                    isSendingItem
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  opacity:
                    !sendItemModal.selectedItem ||
                    !selectedRecipient ||
                    isSendingItem
                      ? 0.5
                      : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isSendingItem ? (
                  <>
                    <Loader size={16} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Gift size={16} />
                    Send Item
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
