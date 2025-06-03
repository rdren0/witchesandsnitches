import React, { useState, useCallback, useMemo } from "react";
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
import Bank from "../Bank/Bank";

const Inventory = ({ user, selectedCharacter, supabase }) => {
  const { theme } = useTheme();

  const [items, setItems] = useState([
    {
      id: 1,
      name: "Wizard's Hat",
      description: "A magical hat that boosts wisdom",
      quantity: 1,
      value: "15 Galleons",
      category: "Armor",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Health Potion",
      description: "Restores 50 HP when consumed",
      quantity: 3,
      value: "5 Galleons each",
      category: "Potions",
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Ancient Spellbook",
      description: "Contains forgotten spells of the old masters",
      quantity: 1,
      value: "100 Galleons",
      category: "Books",
      created_at: new Date().toISOString(),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

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

  const styles = useMemo(
    () => ({
      container: {
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: theme.background,
        minHeight: "100vh",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      mainGrid: {
        display: "grid",
        gridTemplateColumns: "350px 1fr",
        gap: "24px",
        alignItems: "start",
        "@media (max-width: 1024px)": {
          gridTemplateColumns: "1fr",
        },
      },
      inventorySection: {
        minWidth: 0,
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
        fontSize: "28px",
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
      errorMessage: {
        backgroundColor: (theme.error || "#EF4444") + "20",
        border: `1px solid ${theme.error || "#EF4444"}`,
        color: theme.error || "#EF4444",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "16px",
        fontSize: "14px",
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
        fontFamily: "inherit",
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
        fontFamily: "inherit",
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
        fontFamily: "inherit",
      },
      select: {
        padding: "12px",
        border: `2px solid ${theme.border}`,
        borderRadius: "8px",
        backgroundColor: theme.surface,
        color: theme.text,
        fontSize: "16px",
        fontFamily: "inherit",
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
        fontFamily: "inherit",
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
        backgroundColor: theme.success || "#10B981",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        flex: "1",
        justifyContent: "center",
        fontFamily: "inherit",
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
        fontFamily: "inherit",
      },
      itemsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
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
        backgroundColor: theme.accent || "#3B82F6",
        color: "white",
      },
      deleteButton: {
        backgroundColor: theme.error || "#EF4444",
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
      categoryHeader: {
        fontSize: "18px",
        fontWeight: "600",
        color: theme.text,
        marginBottom: "16px",
        padding: "12px 16px",
        backgroundColor: theme.surface,
        borderRadius: "8px",
        border: `1px solid ${theme.border}`,
      },
      statsCard: {
        backgroundColor: theme.surface,
        padding: "16px",
        borderRadius: "8px",
        border: `1px solid ${theme.border}`,
        marginBottom: "16px",
      },
      statsRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "14px",
        color: theme.text,
      },
    }),
    [theme]
  );

  // Add new item
  const addItem = useCallback(async () => {
    if (!formData.name.trim()) return;

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      const newItem = {
        id: Date.now(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity) || 1,
        value: formData.value.trim(),
        category: formData.category,
        created_at: new Date().toISOString(),
      };

      setItems((prev) => [newItem, ...prev]);
      setFormData({
        name: "",
        description: "",
        quantity: 1,
        value: "",
        category: "General",
      });
      setShowAddForm(false);
      setIsSaving(false);
    }, 500);
  }, [formData]);

  // Delete item
  const deleteItem = useCallback(async (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

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
    if (!formData.name.trim() || !editingId) return;

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: formData.name.trim(),
                description: formData.description.trim(),
                quantity: parseInt(formData.quantity) || 1,
                value: formData.value.trim(),
                category: formData.category,
              }
            : item
        )
      );

      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        quantity: 1,
        value: "",
        category: "General",
      });
      setIsSaving(false);
    }, 500);
  }, [formData, editingId]);

  // Cancel edit
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
      <div style={styles.mainGrid}>
        {/* Bank Section - Left Column */}
        <Bank />

        {/* Inventory Section - Right Column */}
        <div style={styles.inventorySection}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>
              <Package size={28} color={theme.primary} />
              Inventory Management
            </h1>
            <p style={styles.subtitle}>
              Manage {selectedCharacter.name}'s items, equipment, and treasures
            </p>
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
                  color: theme.error || "#EF4444",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Stats */}
          {items.length > 0 && (
            <div style={styles.statsCard}>
              <div style={styles.statsRow}>
                <span>
                  Total Items: <strong>{items.length}</strong>
                </span>
                <span>
                  Total Quantity:{" "}
                  <strong>
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </strong>
                </span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div style={styles.controls}>
            {!showAddForm && !editingId && (
              <button
                onClick={() => setShowAddForm(true)}
                style={styles.addButton}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = theme.secondary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = theme.primary;
                }}
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

          {/* Items Display */}
          {filteredItems.length > 0 ? (
            Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} style={{ marginBottom: "32px" }}>
                <div style={styles.categoryHeader}>
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
        </div>
      </div>
    </div>
  );
};

export default Inventory;
