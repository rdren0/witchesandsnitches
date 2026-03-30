import { useState } from "react";
import { Edit3, Check, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useTheme } from "../contexts/ThemeContext";
import { createAppStyles } from "../utils/styles/masterStyles";

const UsernameEditor = ({ user, customUsername, onUsernameUpdate }) => {
  const { theme } = useTheme();
  const styles = createAppStyles(theme);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(customUsername || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(customUsername || user.user_metadata.full_name || "");
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(customUsername || "");
    setError("");
  };

  const validateUsername = (username) => {
    if (!username.trim()) {
      return "Username cannot be empty";
    }
    if (username.length < 2) {
      return "Username must be at least 2 characters";
    }
    if (username.length > 30) {
      return "Username must be less than 30 characters";
    }

    if (!/^[a-zA-Z0-9_\-.\s@+!#$%&*()[\]{}'",:;?=]+$/.test(username)) {
      return "Invalid characters in username";
    }
    return null;
  };

  const handleSave = async () => {
    const trimmedValue = editValue.trim();
    const validationError = validateUsername(trimmedValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data: existingUser } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("username", trimmedValue)
        .neq("discord_user_id", user.id)
        .maybeSingle();

      if (existingUser) {
        setError("Username is already taken");
        setIsLoading(false);
        return;
      }

      await onUsernameUpdate(trimmedValue);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update username. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayName =
    customUsername || user?.user_metadata?.full_name || "User";

  if (isEditing) {
    return (
      <div style={styles.usernameEditor}>
        <div>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            style={styles.usernameInput}
            placeholder="Enter username"
            maxLength={30}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            autoFocus
          />
          {error && (
            <div
              style={{ color: theme.error, fontSize: "12px", marginTop: "4px" }}
            >
              {error}
            </div>
          )}
        </div>
        <button
          onClick={handleSave}
          style={styles.saveButton}
          disabled={isLoading}
          title="Save username"
        >
          <Check size={14} />
        </button>
        <button
          onClick={handleCancel}
          style={styles.cancelButton}
          disabled={isLoading}
          title="Cancel"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div style={styles.username}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {displayName}
          <button
            onClick={handleEdit}
            style={styles.editButton}
            title="Edit username"
          >
            <Edit3 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsernameEditor;
