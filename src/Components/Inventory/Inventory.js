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
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getInventoryStyles } from "../../styles/masterStyles";

import Bank from "../Bank/Bank";

const Inventory = ({ user, selectedCharacter, supabase }) => {
  const { theme } = useTheme();
  const styles = getInventoryStyles(theme);

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now()); // NEW: Track last refresh
  const [isRefreshing, setIsRefreshing] = useState(false); // NEW: Track manual refresh state

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

  // UPDATED: Enhanced fetchItems with better logging and refresh tracking
  const fetchItems = useCallback(async () => {
    if (!supabase || !selectedCharacter?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      console.log(
        `Fetching inventory for character ${selectedCharacter.id} (${selectedCharacter.name})...`
      );

      const { data, error: fetchError } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      console.log(
        `Loaded ${data?.length || 0} inventory items for ${
          selectedCharacter.name
        }`
      );
      setItems(data || []);
      setLastRefresh(Date.now());
    } catch (err) {
      console.error("Error fetching inventory items:", err);
      setError("Failed to load inventory items. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase, selectedCharacter?.id, selectedCharacter?.name]);

  // NEW: Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    console.log("Manual inventory refresh triggered by user");
    setIsRefreshing(true);
    await fetchItems();
  }, [fetchItems]);

  // UPDATED: Original useEffect
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // NEW: Auto-refresh when tab becomes visible (user might have edited character in another tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && selectedCharacter?.id) {
        console.log("Tab became visible, checking for new inventory items...");
        fetchItems();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchItems, selectedCharacter?.id]);

  // NEW: Periodic refresh every 30 seconds when tab is active
  useEffect(() => {
    if (!selectedCharacter?.id) return;

    const interval = setInterval(() => {
      if (
        !document.hidden &&
        !isLoading &&
        !isSaving &&
        !editingId &&
        !showAddForm
      ) {
        console.log("Auto-refreshing inventory (background check)...");
        fetchItems();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [
    fetchItems,
    selectedCharacter?.id,
    isLoading,
    isSaving,
    editingId,
    showAddForm,
  ]);

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
        discord_user_id: user?.discord_user_id || user?.id,
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
    // eslint-disable-next-line
  }, [formData, supabase, selectedCharacter?.id, user?.id]);

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
          <Package
            size={48}
            color={theme.textSecondary}
            style={styles.emptyIcon}
          />
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
        />

        <div style={styles.inventorySection}>
          {/* UPDATED: Header with refresh indicator */}
          <div style={styles.header}>
            <h1 style={styles.title}>
              <Package size={28} color={theme.primary} />
              Inventory Management
            </h1>
            <p style={styles.subtitle}>
              Manage your character's items, equipment, and possessions
              {lastRefresh && (
                <span
                  style={{
                    fontSize: "12px",
                    color: theme.textSecondary,
                    marginLeft: "8px",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  Last updated: {new Date(lastRefresh).toLocaleTimeString()}
                  {isRefreshing && (
                    <span style={{ color: theme.primary, marginLeft: "8px" }}>
                      • Refreshing...
                    </span>
                  )}
                </span>
              )}
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
              <div style={styles.statsRow}>
                <span>
                  Total Items: <strong>{stats.totalItems}</strong>
                </span>
                <span>
                  Total Quantity: <strong>{stats.totalQuantity}</strong>
                </span>
              </div>
              <div style={{ ...styles.statsRow, ...styles.statsRowLast }}>
                <span>
                  Categories: <strong>{stats.categories}</strong>
                </span>
                <span>
                  Attunement Required: <strong>{stats.attunementItems}</strong>
                </span>
              </div>
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

                  {/* NEW: Check for new items button */}
                  <button
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                    style={{
                      ...styles.addButton,
                      backgroundColor: theme.success || "#10B981",
                      marginLeft: "8px",
                      opacity: isRefreshing ? 0.7 : 1,
                      cursor: isRefreshing ? "not-allowed" : "pointer",
                    }}
                    title="Check for new items from background changes or other updates"
                  >
                    {isRefreshing ? (
                      <>
                        <Loader size={18} />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={18} />
                        Check for New Items
                      </>
                    )}
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

          {(showAddForm || editingId) && (
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>
                {editingId ? "Edit Item" : "Add New Item"}
              </h3>

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
                  onClick={editingId ? saveEdit : addItem}
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
                      {editingId ? "Saving..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      {editingId ? "Save Changes" : "Add Item"}
                    </>
                  )}
                </button>

                <button
                  onClick={cancelEdit}
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
                Object.entries(groupedItems).map(
                  ([category, categoryItems]) => {
                    const attunementCount = categoryItems.filter(
                      (item) => item.attunement_required
                    ).length;
                    return (
                      <div key={category} style={{ marginBottom: "32px" }}>
                        <div style={styles.categoryHeader}>
                          <span>
                            {category} ({categoryItems.length})
                          </span>
                          {attunementCount > 0 && (
                            <span style={styles.categoryStats}>
                              {attunementCount} require attunement
                            </span>
                          )}
                        </div>
                        <div style={styles.itemsGrid}>
                          {categoryItems.map((item) => (
                            <div key={item.id} style={styles.itemCard}>
                              <div style={styles.itemHeader}>
                                <div>
                                  <div style={styles.itemName}>
                                    <Package size={18} color={theme.primary} />
                                    {item.name}
                                    {item.quantity > 1 && (
                                      <span style={styles.quantityBadge}>
                                        x{item.quantity}
                                      </span>
                                    )}
                                    {item.attunement_required && (
                                      <span style={styles.attunementBadge}>
                                        <Star size={12} />
                                        Attunement
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div style={styles.itemActions}>
                                  <button
                                    onClick={() => startEdit(item)}
                                    disabled={
                                      editingId || showAddForm || isSaving
                                    }
                                    style={{
                                      ...styles.actionButton,
                                      ...styles.editButton,
                                      opacity:
                                        editingId || showAddForm || isSaving
                                          ? 0.5
                                          : 1,
                                    }}
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => deleteItem(item.id)}
                                    disabled={
                                      editingId || showAddForm || isSaving
                                    }
                                    style={{
                                      ...styles.actionButton,
                                      ...styles.deleteButton,
                                      opacity:
                                        editingId || showAddForm || isSaving
                                          ? 0.5
                                          : 1,
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              {item.description && (
                                <div style={styles.itemDescription}>
                                  {item.description}
                                </div>
                              )}

                              <div style={styles.itemMeta}>
                                <span>
                                  {item.value
                                    ? `Value: ${item.value}`
                                    : "No value set"}
                                </span>
                                <span>
                                  Added:{" "}
                                  {new Date(
                                    item.created_at
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )
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
    </div>
  );
};

export default Inventory;
