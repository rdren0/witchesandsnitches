import React, { useState } from "react";
import { User, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const DisplayNamePrompt = ({ isOpen, onSubmit, onSkip, isLoading = false }) => {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a display name.");
      return;
    }
    if (trimmed.length < 2 || trimmed.length > 30) {
      setError("Display name must be between 2 and 30 characters.");
      return;
    }
    setError("");
    try {
      await onSubmit(trimmed);
    } catch (err) {
      setError(err.message || "Failed to save. Please try again.");
    }
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      padding: "24px",
      width: "100%",
      maxWidth: "400px",
      border: `1px solid ${theme.border}`,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "12px",
    },
    title: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
      margin: 0,
    },
    closeButton: {
      background: "none",
      border: "none",
      color: theme.textSecondary,
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    description: {
      fontSize: "14px",
      color: theme.textSecondary,
      lineHeight: "1.5",
      marginBottom: "16px",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: `1px solid ${error ? theme.error || "#dc2626" : theme.border}`,
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: theme.background,
      color: theme.text,
      outline: "none",
      boxSizing: "border-box",
      marginBottom: "8px",
    },
    errorText: {
      fontSize: "12px",
      color: theme.error || "#dc2626",
      marginBottom: "16px",
    },
    actions: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
      marginTop: "16px",
    },
    skipButton: {
      padding: "10px 16px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      color: theme.textSecondary,
    },
    submitButton: {
      padding: "10px 20px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: isLoading ? "not-allowed" : "pointer",
      border: "none",
      backgroundColor: theme.primary,
      color: "white",
      opacity: isLoading ? 0.7 : 1,
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <User size={20} />
            Set Your Display Name
          </h2>
          <button style={styles.closeButton} onClick={onSkip}>
            <X size={20} />
          </button>
        </div>

        <p style={styles.description}>
          Choose a name that other players and your DM will see. You can change
          this at any time from the header.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your display name..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = theme.primary;
              e.target.style.boxShadow = `0 0 0 2px ${theme.primary}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error
                ? theme.error || "#dc2626"
                : theme.border;
              e.target.style.boxShadow = "none";
            }}
            maxLength={30}
            autoFocus
            disabled={isLoading}
          />
          {error && <div style={styles.errorText}>{error}</div>}

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.skipButton}
              onClick={onSkip}
              disabled={isLoading}
            >
              Skip for now
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Set Name"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisplayNamePrompt;
