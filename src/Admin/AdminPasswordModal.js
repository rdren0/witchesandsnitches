import React, { useState, useEffect } from "react";
import { Shield, Eye, EyeOff, Lock, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const AdminPasswordModal = ({
  isOpen,
  onClose,
  onPasswordSubmit,
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError("");
      setShowPassword(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Even magic requires the right incantation!");
      return;
    }

    try {
      setError("");
      await onPasswordSubmit(password.trim());
    } catch (error) {
      const restrictedSectionMessages = [
        "Access denied! The Restricted Section remains locked to you.",
        "That spell didn't work. Perhaps you need to practice your wand work?",
        "The protective enchantments are stronger than your spell.",
        "The Restricted Section's wards detect your failed attempt.",
        "Your spell fizzled out faster than a broken wand.",
        "The ancient magic scoffs at your modern attempt.",
      ];

      const randomMessage =
        restrictedSectionMessages[
          Math.floor(Math.random() * restrictedSectionMessages.length)
        ];
      setError(randomMessage);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

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
      marginBottom: "20px",
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
      transition: "all 0.2s ease",
    },
    closeButtonHover: {
      backgroundColor: theme.border,
      color: theme.text,
    },
    content: {
      marginBottom: "24px",
    },
    description: {
      fontSize: "14px",
      color: theme.textSecondary,
      lineHeight: "1.5",
      marginBottom: "16px",
    },
    passwordContainer: {
      position: "relative",
      marginBottom: "12px",
    },
    passwordInput: {
      width: "100%",
      padding: "12px 40px 12px 12px",
      border: `1px solid ${error ? theme.error || "#dc2626" : theme.border}`,
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: theme.background,
      color: theme.text,
      outline: "none",
      transition: "border-color 0.2s ease",
      boxSizing: "border-box",
    },
    passwordInputFocus: {
      borderColor: theme.primary,
      boxShadow: `0 0 0 2px ${theme.primary}20`,
    },
    togglePasswordButton: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      color: theme.textSecondary,
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "color 0.2s ease",
    },
    error: {
      fontSize: "12px",
      color: theme.error || "#dc2626",
      marginTop: "4px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    actions: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      border: "none",
      outline: "none",
    },
    cancelButton: {
      backgroundColor: theme.surface,
      color: theme.textSecondary,
      border: `1px solid ${theme.border}`,
    },
    cancelButtonHover: {
      backgroundColor: theme.background,
      color: theme.text,
    },
    submitButton: {
      backgroundColor: theme.primary,
      color: "white",
      opacity: isLoading ? 0.7 : 1,
      cursor: isLoading ? "not-allowed" : "pointer",
    },
    submitButtonHover: {
      backgroundColor: theme.primaryDark || theme.primary,
      transform: isLoading ? "none" : "translateY(-1px)",
    },
    loadingSpinner: {
      display: "inline-block",
      width: "16px",
      height: "16px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      borderTopColor: "white",
      animation: "spin 1s ease-in-out infinite",
    },
  };

  return (
    <div style={styles.overlay} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <Shield size={20} />
            Restricted Section Access
          </h2>
          <button
            style={styles.closeButton}
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div style={styles.content}>
          <p style={styles.description}>
            The Restricted Section requires a special incantation to unlock its
            secrets. Speak the unlocking charm to gain access to all character
            records in the magical registry.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Cast your unlocking spell..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.passwordInput}
                onFocus={(e) => {
                  if (!error) {
                    e.target.style.borderColor = theme.primary;
                    e.target.style.boxShadow = `0 0 0 2px ${theme.primary}20`;
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error
                    ? theme.error || "#dc2626"
                    : theme.border;
                  e.target.style.boxShadow = "none";
                }}
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                style={styles.togglePasswordButton}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div style={styles.error}>
                <Lock size={12} />
                {error}
              </div>
            )}
          </form>
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            style={styles.cancelButton}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={styles.submitButton}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span style={styles.loadingSpinner}></span>
                <span style={{ marginLeft: "8px" }}>Casting spell...</span>
              </>
            ) : (
              "Alohomora! 🪄"
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPasswordModal;
