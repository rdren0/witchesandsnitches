// Replace your entire Inventory component with this working version:

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
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const Inventory = ({ user, selectedCharacter, supabase }) => {
  const { theme } = useTheme();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
    value: "",
    category: "General",
  });

  const categories = [
    "General",
    "Weapons",
    "Armor",
    "Potions",
    "Scrolls",
    "Books",
    "Magical Items",
    "Currency",
    "Tools",
    "Food",
  ];

  const discordUserId = user?.user_metadata?.provider_id || user?.id;

  // Memoize styles to prevent recreation on every render
  const styles = useMemo(
    () => ({
      container: {
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: theme.background,
        minHeight: "100vh",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      header: {
        backgroundColor: theme.surface,
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
        border: `2px solid ${theme.border}`,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      title: {
        fontSize: "32px",
        fontWeight: "bold",
        color: theme.text,
        margin: "0 0 8px 0",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      },
      subtitle: {
        fontSize: "16px",
        color: theme.textSecondary,
        margin: 0,
      },
      characterInfo: {
        fontSize: "14px",
        color: theme.primary,
        fontWeight: "600",
        marginTop: "8px",
      },
      errorMessage: {
        backgroundColor: theme.error + "20",
        border: `1px solid ${theme.error}`,
        color: theme.error,
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "16px",
        fontSize: "14px",
      },
      loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px",
        backgroundColor: theme.surface,
        borderRadius: "12px",
        border: `2px solid ${theme.border}`,
      },
      loadingText: {
        color: theme.textSecondary,
        fontSize: "16px",
        marginLeft: "12px",
      },
      noCharacterSelected: {
        textAlign: "center",
        padding: "60px 20px",
        backgroundColor: theme.surface,
        borderRadius: "12px",
        border: `2px solid ${theme.border}`,
        color: theme.textSecondary,
      },
      controls: {
        display: "flex",
        gap: "12px",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap",
      },
      addButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 20px",
        backgroundColor: theme.primary,
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
      },
      searchContainer: {
        position: "relative",
        flex: "1",
        minWidth: "250px",
      },
      searchInput: {
        width: "100%",
        paddingLeft: "40px",
        paddingRight: "16px",
        paddingTop: "12px",
        paddingBottom: "12px",
        border: `2px solid ${theme.border}`,
        borderRadius: "8px",
        backgroundColor: theme.surface,
        color: theme.text,
        fontSize: "16px",
      },
      searchIcon: {
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        color: theme.textSecondary,
      },
      formCard: {
        backgroundColor: theme.surface,
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
        border: `2px solid ${theme.border}`,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      formTitle: {
        fontSize: "20px",
        fontWeight: "600",
        color: theme.text,
        marginBottom: "20px",
        margin: "0 0 20px 0",
      },
      formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginBottom: "16px",
      },
      formField: {
        display: "flex",
        flexDirection: "column",
      },
      formFieldFull: {
        gridColumn: "1 / -1",
      },
      label: {
        fontSize: "14px",
        fontWeight: "600",
        color: theme.text,
        marginBottom: "8px",
      },
      input: {
        padding: "12px",
        border: `2px solid ${theme.border}`,
        borderRadius: "8px",
        backgroundColor: theme.surface,
        color: theme.text,
        fontSize: "16px",
      },
      select: {
        padding: "12px",
        border: `2px solid ${theme.border}`,
        borderRadius: "8px",
        backgroundColor: theme.surface,
        color: theme.text,
        fontSize: "16px",
      },
      textarea: {
        padding: "12px",
        border: `2px solid ${theme.border}`,
        borderRadius: "8px",
        backgroundColor: theme.surface,
        color: theme.text,
        fontSize: "16px",
        height: "80px",
        resize: "vertical",
      },
      formActions: {
        display: "flex",
        gap: "12px",
      },
      saveButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        backgroundColor: "#10B981",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        flex: "1",
        justifyContent: "center",
      },
      cancelButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        backgroundColor: theme.textSecondary,
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
      },
      itemsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "16px",
      },
      itemCard: {
        backgroundColor: theme.surface,
        borderRadius: "12px",
        padding: "20px",
        border: `2px solid ${theme.border}`,
        transition: "all 0.2s ease",
      },
      itemHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "12px",
      },
      itemName: {
        fontSize: "18px",
        fontWeight: "600",
        color: theme.text,
        margin: "0 0 4px 0",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
      quantityBadge: {
        fontSize: "12px",
        fontWeight: "600",
        padding: "4px 8px",
        backgroundColor: theme.background,
        color: theme.text,
        borderRadius: "12px",
        border: `1px solid ${theme.border}`,
      },
      itemActions: {
        display: "flex",
        gap: "8px",
      },
      actionButton: {
        padding: "8px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
      },
      editButton: {
        backgroundColor: "#3B82F6",
        color: "white",
      },
      deleteButton: {
        backgroundColor: "#EF4444",
        color: "white",
      },
      itemDescription: {
        fontSize: "14px",
        color: theme.textSecondary,
        marginBottom: "8px",
        lineHeight: "1.4",
      },
      itemMeta: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "14px",
        color: theme.text,
      },
      emptyState: {
        textAlign: "center",
        padding: "60px 20px",
        backgroundColor: theme.surface,
        borderRadius: "12px",
        border: `2px solid ${theme.border}`,
      },
      emptyIcon: {
        marginBottom: "16px",
        opacity: 0.5,
      },
      emptyText: {
        fontSize: "18px",
        color: theme.textSecondary,
        margin: 0,
      },
    }),
    [theme]
  );

  // Load items from database
  const loadItems = useCallback(async () => {
    if (!selectedCharacter?.id || !user || !supabase) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const userId = discordUserId;
    if (!userId) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(
        "Loading items for user:",
        userId,
        "character:",
        selectedCharacter.id
      );

      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("discord_user_id", userId)
        .eq("character_id", selectedCharacter.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      console.log("Loaded items:", data);
      setItems(data || []);
    } catch (err) {
      console.error("Error loading inventory items:", err);
      setError(`Failed to load inventory: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCharacter?.id, discordUserId, user, supabase]);

  // Load items when component mounts or character changes
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Add new item
  const addItem = useCallback(async () => {
    if (!formData.name.trim() || !selectedCharacter?.id || !user || !supabase)
      return;

    const userId = discordUserId;
    if (!userId) return;

    setIsSaving(true);
    setError(null);

    try {
      const newItem = {
        discord_user_id: userId,
        character_id: selectedCharacter.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity) || 1,
        value: formData.value.trim(),
        category: formData.category,
      };

      console.log("Attempting to insert item:", newItem);

      const { data, error } = await supabase
        .from("inventory_items")
        .insert([newItem])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Successfully inserted item:", data);

      // Add the new item to the local state
      setItems((prev) => [data, ...prev]);

      // Reset form
      setFormData({
        name: "",
        description: "",
        quantity: 1,
        value: "",
        category: "General",
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding item:", err);
      setError(`Failed to add item: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [formData, selectedCharacter?.id, discordUserId, user, supabase]);

  // Delete item
  const deleteItem = useCallback(
    async (id) => {
      if (!supabase || !user) return;

      const userId = discordUserId;
      if (!userId) return;

      try {
        const { error } = await supabase
          .from("inventory_items")
          .delete()
          .eq("id", id)
          .eq("discord_user_id", userId);

        if (error) {
          throw error;
        }

        // Remove from local state
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Error deleting item:", err);
        setError(`Failed to delete item: ${err.message}`);
      }
    },
    [supabase, discordUserId, user]
  );

  // Start editing
  const startEdit = useCallback((item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description || "",
      quantity: item.quantity,
      value: item.value || "",
      category: item.category,
    });
  }, []);

  // Save edit
  const saveEdit = useCallback(async () => {
    if (!formData.name.trim() || !editingId || !supabase || !user) return;

    const userId = discordUserId;
    if (!userId) return;

    setIsSaving(true);
    setError(null);

    try {
      const updates = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity) || 1,
        value: formData.value.trim(),
        category: formData.category,
      };

      const { data, error } = await supabase
        .from("inventory_items")
        .update(updates)
        .eq("id", editingId)
        .eq("discord_user_id", userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setItems((prev) =>
        prev.map((item) => (item.id === editingId ? data : item))
      );

      // Reset form
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        quantity: 1,
        value: "",
        category: "General",
      });
    } catch (err) {
      console.error("Error updating item:", err);
      setError(`Failed to update item: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [formData, editingId, supabase, discordUserId, user]);

  // Cancel edit/add
  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      quantity: 1,
      value: "",
      category: "General",
    });
    setShowAddForm(false);
    setError(null);
  }, []);

  // Filter items based on search
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

  // Group items by category
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

  // Show authentication required message
  if (!user) {
    return (
      <div style={styles.noCharacterSelected}>
        <Package
          size={48}
          color={theme.textSecondary}
          style={styles.emptyIcon}
        />
        <h2 style={{ color: theme.text, marginBottom: "16px" }}>
          Authentication Required
        </h2>
        <p>Please log in with Discord to access the inventory system.</p>
      </div>
    );
  }

  // Show character selection message
  if (!selectedCharacter) {
    return (
      <div style={styles.noCharacterSelected}>
        <Package
          size={48}
          color={theme.textSecondary}
          style={styles.emptyIcon}
        />
        <h2 style={{ color: theme.text, marginBottom: "16px" }}>
          No Character Selected
        </h2>
        <p>
          Please select a character from the dropdown above to manage their
          inventory.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <Package size={32} color={theme.primary} />
          Inventory Management
        </h1>
        <p style={styles.subtitle}>
          Manage your character's items, equipment, and treasures
        </p>
        <div style={styles.characterInfo}>
          Character: {selectedCharacter.name}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorMessage}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: "12px",
              background: "none",
              border: "none",
              color: theme.error,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div style={styles.loadingContainer}>
          <Loader size={24} className="animate-spin" color={theme.primary} />
          <span style={styles.loadingText}>Loading inventory...</span>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div style={styles.controls}>
            {!showAddForm && !editingId && (
              <button
                onClick={() => setShowAddForm(true)}
                style={styles.addButton}
              >
                <Plus size={18} />
                Add New Item
              </button>
            )}

            {items.length > 0 && (
              <div style={styles.searchContainer}>
                <Search size={18} style={styles.searchIcon} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search items by name, description, or category..."
                  style={styles.searchInput}
                />
              </div>
            )}
          </div>

          {/* Add/Edit Form */}
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
                  />
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
                      <Loader size={18} className="animate-spin" />
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

          {/* Items Display */}
          {filteredItems.length > 0 ? (
            Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} style={{ marginBottom: "32px" }}>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: theme.text,
                    marginBottom: "16px",
                    padding: "12px 16px",
                    backgroundColor: theme.surface,
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {category} ({categoryItems.length})
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
                          </div>
                        </div>
                        <div style={styles.itemActions}>
                          <button
                            onClick={() => startEdit(item)}
                            disabled={editingId || showAddForm || isSaving}
                            style={{
                              ...styles.actionButton,
                              ...styles.editButton,
                              opacity:
                                editingId || showAddForm || isSaving ? 0.5 : 1,
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            disabled={editingId || showAddForm || isSaving}
                            style={{
                              ...styles.actionButton,
                              ...styles.deleteButton,
                              opacity:
                                editingId || showAddForm || isSaving ? 0.5 : 1,
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
                          {item.value ? `Value: ${item.value}` : "No value set"}
                        </span>
                        <span>
                          Added:{" "}
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Inventory;
