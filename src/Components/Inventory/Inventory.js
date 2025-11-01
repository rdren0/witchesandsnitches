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
import OwlMail from "./OwlMail";
import { ReactComponent as OwlIcon } from "../../Images/owl.svg";

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
  const [activeTab, setActiveTab] = useState("inventory");
  const [unreadOwlMailCount, setUnreadOwlMailCount] = useState(0);
  const [showBankModal, setShowBankModal] = useState(false);
  const [filterAttunement, setFilterAttunement] = useState(false);
  const [bankKey, setBankKey] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
    value: "",
    category: "General",
    attunement_required: false,
    is_attuned: false,
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

  const fetchUnreadOwlMailCount = useCallback(async () => {
    if (!supabase || !selectedCharacter?.id) {
      return;
    }

    try {
      const { count, error: fetchError } = await supabase
        .from("owl_mail")
        .select("*", { count: "exact", head: true })
        .eq("recipient_character_id", selectedCharacter.id)
        .eq("read", false);

      if (fetchError) throw fetchError;

      setUnreadOwlMailCount(count || 0);
    } catch (err) {
      console.error("Error fetching unread owl mail count:", err);
    }
  }, [supabase, selectedCharacter?.id]);

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
    fetchUnreadOwlMailCount();

    const interval = setInterval(() => {
      fetchUnreadOwlMailCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchUnreadOwlMailCount]);

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

  useEffect(() => {
    if (items.length > 0) {
      const uniqueCategories = [...new Set(items.map((item) => item.category))];
      const initialCollapsed = {};
      uniqueCategories.forEach((category) => {
        if (collapsedCategories[category] === undefined) {
          initialCollapsed[category] = true;
        }
      });
      if (Object.keys(initialCollapsed).length > 0) {
        setCollapsedCategories((prev) => ({ ...prev, ...initialCollapsed }));
      }
    }
  }, [items]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const allCategories = [...new Set(items.map((item) => item.category))];
      const expandedState = {};
      allCategories.forEach((category) => {
        expandedState[category] = false;
      });
      setCollapsedCategories(expandedState);
    }
  }, [searchTerm, items]);

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
      is_attuned: item.is_attuned || false,
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
        is_attuned: formData.is_attuned || false,
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
      setExpandedStack(null);
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

  const toggleAttunement = useCallback(
    async (item) => {
      if (!supabase || !item.attunement_required) return;

      try {
        const newAttunementStatus = !item.is_attuned;

        const { data, error: updateError } = await supabase
          .from("inventory_items")
          .update({ is_attuned: newAttunementStatus })
          .eq("id", item.id)
          .select()
          .single();

        if (updateError) throw updateError;

        setItems((prev) => prev.map((i) => (i.id === item.id ? data : i)));
      } catch (err) {
        console.error("Error toggling attunement:", err);
        setError("Failed to toggle attunement. Please try again.");
      }
    },
    [supabase]
  );

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
      const senderName = selectedCharacter?.name || "Unknown";
      const descriptionWithSender = selectedItem.description
        ? `${selectedItem.description}\n\nSent by: ${senderName}`
        : `Sent by: ${senderName}`;

      const newItem = {
        name: selectedItem.name,
        description: descriptionWithSender,
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
      items.filter((item) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const isAttunementSearch =
          "attunement".includes(lowerSearchTerm) && lowerSearchTerm.length >= 3;

        const matchesSearch =
          item.name.toLowerCase().includes(lowerSearchTerm) ||
          (item.description &&
            item.description.toLowerCase().includes(lowerSearchTerm)) ||
          item.category.toLowerCase().includes(lowerSearchTerm) ||
          (isAttunementSearch && (item.attunement_required || item.is_attuned));

        const matchesAttunement = !filterAttunement || item.is_attuned;

        return matchesSearch && matchesAttunement;
      }),
    [items, searchTerm, filterAttunement]
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
            has_attuned_items: false,
            all_items_attuned: false,
            totalQuantity: 0,
            items: [],
          };
        }
        itemStacks[key].totalQuantity += item.quantity;
        itemStacks[key].items.push(item);

        if (item.is_attuned) {
          itemStacks[key].has_attuned_items = true;
        }
      });

      Object.values(itemStacks).forEach((stack) => {
        if (stack.attunement_required && stack.items.length > 0) {
          stack.all_items_attuned = stack.items.every(
            (item) => item.is_attuned
          );
        }
      });

      stacked[category] = Object.values(itemStacks);
    });
    return stacked;
  }, [groupedItems]);

  const stats = useMemo(() => {
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const attunementItems = items.filter((item) => item.is_attuned).length;
    const requiresAttunementItems = items.filter(
      (item) => item.attunement_required
    ).length;
    const categories = new Set(items.map((item) => item.category)).size;

    return {
      totalItems,
      totalQuantity,
      attunementItems,
      requiresAttunementItems,
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
      {activeTab === "inventory" && (
        <>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              padding: "16px",
              backgroundColor: theme.surface,
              borderRadius: "12px",
              border: `1px solid ${theme.border}`,
            }}
          >
            {items.length > 0 &&
              !isLoading &&
              stats.requiresAttunementItems > 0 && (
                <div
                  onClick={() => setFilterAttunement(!filterAttunement)}
                  style={{
                    position: "absolute",
                    left: "16px",
                    padding: "12px 16px",
                    backgroundColor: filterAttunement
                      ? theme.warning || "#F59E0B"
                      : theme.background,
                    borderRadius: "8px",
                    border: `2px solid ${
                      filterAttunement
                        ? theme.warning || "#F59E0B"
                        : theme.border
                    }`,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!filterAttunement) {
                      e.currentTarget.style.backgroundColor = theme.surface;
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0, 0, 0, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!filterAttunement) {
                      e.currentTarget.style.backgroundColor = theme.background;
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: filterAttunement ? "white" : theme.textSecondary,
                      marginBottom: "4px",
                    }}
                  >
                    Attuned Items
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: filterAttunement
                        ? "white"
                        : theme.warning || "#F59E0B",
                    }}
                  >
                    {stats.attunementItems}/{stats.requiresAttunementItems}
                  </div>
                </div>
              )}

            <div
              onClick={() => setShowBankModal(true)}
              style={{
                padding: "16px 24px",
                backgroundColor: theme.background,
                borderRadius: "8px",
                border: `1px solid ${theme.border}`,
                cursor: "pointer",
                transition: "all 0.2s ease",
                minWidth: "280px",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.surface;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.background;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Bank
                  key={bankKey}
                  user={user}
                  selectedCharacter={selectedCharacter}
                  supabase={supabase}
                  adminMode={adminMode}
                  displayOnly={true}
                />
              </div>
            </div>

            <button
              onClick={() => setActiveTab("owlmail")}
              style={{
                position: "absolute",
                right: "16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                opacity: unreadOwlMailCount > 0 ? 1 : 0.3,
                transition: "opacity 0.2s, transform 0.2s, color 0.2s",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                color: unreadOwlMailCount > 0 ? "black" : theme.textSecondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.color = theme.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity =
                  unreadOwlMailCount > 0 ? "1" : "0.3";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.color =
                  unreadOwlMailCount > 0 ? "black" : theme.textSecondary;
              }}
              title={
                unreadOwlMailCount > 0
                  ? `Owl Post (${unreadOwlMailCount} unread)`
                  : "Owl Post"
              }
            >
              <OwlIcon
                style={{
                  width: "36px",
                  height: "36px",
                }}
              />
            </button>
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

          {!isLoading && (
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
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
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
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "16px",
                    gridAutoRows: "auto",
                  }}
                >
                  {Object.entries(stackedItems).map(([category, stacks]) => {
                    const isCollapsed = collapsedCategories[category];

                    return (
                      <div
                        key={category}
                        style={{
                          gridColumn: isCollapsed ? "auto" : "1 / -1",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            ...styles.categoryHeader,
                            cursor: "pointer",
                            userSelect: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            height: "60px",
                            padding: "12px 16px",
                            overflow: "hidden",
                            gap: "8px",
                          }}
                          onClick={() =>
                            setCollapsedCategories({
                              ...collapsedCategories,
                              [category]: !isCollapsed,
                            })
                          }
                        >
                          {isCollapsed ? (
                            <ChevronDown size={16} style={{ flexShrink: 0 }} />
                          ) : (
                            <ChevronUp size={16} style={{ flexShrink: 0 }} />
                          )}
                          <span
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontSize: "14px",
                            }}
                          >
                            {category} ({stacks.length}{" "}
                            {stacks.length === 1 ? "type" : "types"})
                          </span>
                        </div>
                        {!isCollapsed && (
                          <div
                            style={{
                              ...styles.itemsGrid,
                              marginTop: "12px",
                            }}
                          >
                            {stacks.map((stack) => {
                              const isExpanded =
                                expandedStack === stack.stackKey;

                              return (
                                <div
                                  key={stack.stackKey}
                                  style={{
                                    ...styles.itemCard,
                                    ...(isExpanded && {
                                      gridColumn: "1 / -1",
                                    }),
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
                                            <div style={styles.form}>
                                              <div style={styles.formRow}>
                                                <div style={styles.formGroup}>
                                                  <label style={styles.label}>
                                                    Name *
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
                                                    disabled={isSaving}
                                                    onFocus={(e) => {
                                                      e.target.style.borderColor =
                                                        theme.primary;
                                                    }}
                                                    onBlur={(e) => {
                                                      e.target.style.borderColor =
                                                        theme.border;
                                                    }}
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
                                                    style={styles.select}
                                                    disabled={isSaving}
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
                                                    disabled={isSaving}
                                                    onFocus={(e) => {
                                                      e.target.style.borderColor =
                                                        theme.primary;
                                                    }}
                                                    onBlur={(e) => {
                                                      e.target.style.borderColor =
                                                        theme.border;
                                                    }}
                                                  />
                                                </div>
                                                <div style={styles.formGroup}>
                                                  <label style={styles.label}>
                                                    Value
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
                                                    placeholder="5 Galleons, 10 Sickles, etc."
                                                    disabled={isSaving}
                                                    onFocus={(e) => {
                                                      e.target.style.borderColor =
                                                        theme.primary;
                                                    }}
                                                    onBlur={(e) => {
                                                      e.target.style.borderColor =
                                                        theme.border;
                                                    }}
                                                  />
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
                                                  style={styles.textarea}
                                                  placeholder="Item description, magical properties, etc."
                                                  disabled={isSaving}
                                                  onFocus={(e) => {
                                                    e.target.style.borderColor =
                                                      theme.primary;
                                                  }}
                                                  onBlur={(e) => {
                                                    e.target.style.borderColor =
                                                      theme.border;
                                                  }}
                                                />
                                              </div>

                                              <div style={styles.checkboxField}>
                                                <label
                                                  style={styles.checkboxLabel}
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
                                                        is_attuned: e.target
                                                          .checked
                                                          ? formData.is_attuned
                                                          : false,
                                                      })
                                                    }
                                                    style={styles.checkbox}
                                                    disabled={isSaving}
                                                  />
                                                  <Star
                                                    size={16}
                                                    color="#F59E0B"
                                                  />
                                                  Requires Attunement
                                                </label>
                                              </div>

                                              {formData.attunement_required && (
                                                <div
                                                  style={styles.checkboxField}
                                                >
                                                  <label
                                                    style={styles.checkboxLabel}
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={
                                                        formData.is_attuned ||
                                                        false
                                                      }
                                                      onChange={(e) =>
                                                        setFormData({
                                                          ...formData,
                                                          is_attuned:
                                                            e.target.checked,
                                                        })
                                                      }
                                                      style={styles.checkbox}
                                                      disabled={isSaving}
                                                    />
                                                    <Check
                                                      size={16}
                                                      color={
                                                        theme.success ||
                                                        "#10B981"
                                                      }
                                                    />
                                                    Is Attuned
                                                  </label>
                                                </div>
                                              )}

                                              <div style={styles.formActions}>
                                                <button
                                                  onClick={saveEdit}
                                                  disabled={
                                                    !formData.name.trim() ||
                                                    isSaving
                                                  }
                                                  style={{
                                                    ...styles.saveButton,
                                                    opacity:
                                                      !formData.name.trim() ||
                                                      isSaving
                                                        ? 0.5
                                                        : 1,
                                                    cursor:
                                                      !formData.name.trim() ||
                                                      isSaving
                                                        ? "not-allowed"
                                                        : "pointer",
                                                  }}
                                                >
                                                  {isSaving ? (
                                                    <>
                                                      <Loader size={18} />
                                                      Saving...
                                                    </>
                                                  ) : (
                                                    <>
                                                      <Check size={18} />
                                                      Save Changes
                                                    </>
                                                  )}
                                                </button>
                                                <button
                                                  onClick={cancelEdit}
                                                  disabled={isSaving}
                                                  style={{
                                                    ...styles.cancelButton,
                                                    opacity: isSaving ? 0.5 : 1,
                                                    cursor: isSaving
                                                      ? "not-allowed"
                                                      : "pointer",
                                                  }}
                                                >
                                                  <X size={18} />
                                                  Cancel
                                                </button>
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
                                                {item.attunement_required && (
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      toggleAttunement(item);
                                                    }}
                                                    style={{
                                                      marginTop: "8px",
                                                      padding: "4px 10px",
                                                      backgroundColor:
                                                        item.is_attuned
                                                          ? theme.success ||
                                                            "#10B981"
                                                          : theme.background,
                                                      color: item.is_attuned
                                                        ? "white"
                                                        : theme.text,
                                                      border: `2px solid ${
                                                        item.is_attuned
                                                          ? theme.success ||
                                                            "#10B981"
                                                          : theme.border
                                                      }`,
                                                      borderRadius: "12px",
                                                      fontSize: "11px",
                                                      fontWeight: "500",
                                                      display: "inline-flex",
                                                      alignItems: "center",
                                                      gap: "4px",
                                                      cursor: "pointer",
                                                      transition:
                                                        "all 0.2s ease",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      if (!item.is_attuned) {
                                                        e.currentTarget.style.backgroundColor =
                                                          theme.surface;
                                                      }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                      if (!item.is_attuned) {
                                                        e.currentTarget.style.backgroundColor =
                                                          theme.background;
                                                      }
                                                    }}
                                                  >
                                                    <Check size={12} />
                                                    {item.is_attuned
                                                      ? "Attuned"
                                                      : "Not Attuned"}
                                                  </button>
                                                )}
                                                {item.description && (
                                                  <div
                                                    style={{
                                                      fontSize: "13px",
                                                      color:
                                                        theme.textSecondary,
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
                                                {sessionCharacters.length >
                                                  0 && (
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
                                                  onClick={() =>
                                                    startEdit(item)
                                                  }
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
                                                style={{
                                                  ...styles.attunementBadge,
                                                  backgroundColor:
                                                    stack.all_items_attuned
                                                      ? (theme.success ||
                                                          "#10B981") + "20"
                                                      : (theme.warning ||
                                                          "#F59E0B") + "20",
                                                  color: stack.all_items_attuned
                                                    ? theme.success || "#10B981"
                                                    : theme.warning ||
                                                      "#F59E0B",
                                                }}
                                              >
                                                {stack.all_items_attuned ? (
                                                  <>
                                                    <Check
                                                      size={12}
                                                      color={
                                                        theme.success ||
                                                        "#10B981"
                                                      }
                                                    />
                                                    Attuned
                                                  </>
                                                ) : (
                                                  <>
                                                    <Star
                                                      size={12}
                                                      color={theme.warning}
                                                    />
                                                    Requires Attunement
                                                  </>
                                                )}
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
                                            onClick={() => {
                                              setExpandedStack(stack.stackKey);
                                              startEdit(stack.items[0]);
                                            }}
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
                                          <button
                                            onClick={() => {
                                              stack.items.forEach((item) =>
                                                deleteItem(item.id)
                                              );
                                            }}
                                            disabled={
                                              expandedStack ||
                                              showAddForm ||
                                              isSaving
                                            }
                                            style={{
                                              ...styles.actionButton,
                                              ...styles.deleteButton,
                                              opacity:
                                                expandedStack ||
                                                showAddForm ||
                                                isSaving
                                                  ? 0.5
                                                  : 1,
                                            }}
                                          >
                                            <Trash2 size={16} />
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
                  })}
                </div>
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
        </>
      )}

      {activeTab === "owlmail" && (
        <OwlMail
          user={user}
          selectedCharacter={selectedCharacter}
          supabase={supabase}
          sessionCharacters={sessionCharacters}
          onBack={() => setActiveTab("inventory")}
          onMailRead={fetchUnreadOwlMailCount}
        />
      )}

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
                      <select
                        value={selectedRecipient?.id || ""}
                        onChange={(e) => {
                          const characterId = e.target.value;
                          if (!characterId) {
                            setSelectedRecipient(null);
                            return;
                          }
                          const character = sessionCharacters.find(
                            (c) => String(c.id) === String(characterId)
                          );
                          setSelectedRecipient(character || null);
                        }}
                        style={styles.select}
                      >
                        <option value="">Select a character...</option>
                        {sessionCharacters.map((character) => (
                          <option key={character.id} value={character.id}>
                            {character.name}
                          </option>
                        ))}
                      </select>
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

      {showBankModal && (
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
            setShowBankModal(false);
            setBankKey((prev) => prev + 1);
          }}
        >
          <div
            style={{
              backgroundColor: theme.background,
              borderRadius: "12px",
              maxWidth: "500px",
              width: "100%",
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
                Bank Management
              </h2>
              <button
                onClick={() => {
                  setShowBankModal(false);
                  setBankKey((prev) => prev + 1);
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

            <div style={{ padding: "24px" }}>
              <Bank
                user={user}
                selectedCharacter={selectedCharacter}
                supabase={supabase}
                adminMode={adminMode}
                displayOnly={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
