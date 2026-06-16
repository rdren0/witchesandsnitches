import React, { useState, useEffect } from "react";
import { X, Gamepad2, AlertTriangle, Eye, Save } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import {
  gameSessionService,
  GAME_SESSION_CATEGORIES,
} from "../services/gameSessionService";

const CATEGORY_LABELS = {
  haunting: "Haunting",
  knights: "Knights",
  other: "Other",
  development: "Development",
};

const maskWebhook = (url) => {
  if (!url) return "Not set";
  return "•".repeat(Math.min(url.length, 32));
};

/**
 * Create / edit modal for a game session. In edit mode the webhook is hidden
 * behind a deliberate "Reveal & edit" action (with a warning), and saving a
 * name change requires confirming the character migration.
 */
const GameSessionModal = ({ isOpen, onClose, session, onSaved }) => {
  const { theme } = useTheme();
  const isEdit = Boolean(session);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("other");
  const [addingCategory, setAddingCategory] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookRevealed, setWebhookRevealed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [affectedCount, setAffectedCount] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(session?.name || "");
      setCategory(session?.category || "other");
      setAddingCategory(false);
      setWebhookUrl(session?.discord_webhook_url || "");
      // Brand-new sessions can edit the webhook freely; existing ones stay
      // hidden until the admin chooses to reveal it.
      setWebhookRevealed(!session);
      setConfirming(false);
      setAffectedCount(null);
      setSaving(false);
      setError("");
    }
  }, [isOpen, session]);

  if (!isOpen) return null;

  // Known categories plus the current session's category if it's a custom one,
  // so editing an existing custom category still shows it selected.
  const categoryOptions = [
    ...GAME_SESSION_CATEGORIES,
    ...(session?.category &&
    !GAME_SESSION_CATEGORIES.includes(session.category)
      ? [session.category]
      : []),
  ];

  const trimmedName = name.trim();
  const trimmedCategory = category.trim() || "other";
  const nameChanged = isEdit && trimmedName !== session.name;
  const webhookChanged =
    (webhookUrl.trim() || "") !== (session?.discord_webhook_url || "");

  const handleProceed = async () => {
    setError("");
    if (!trimmedName) {
      setError("Session name is required.");
      return;
    }

    // New sessions and edits with no name change don't need the migration
    // confirmation, but we still confirm so a webhook change is intentional.
    if (nameChanged) {
      try {
        const count = await gameSessionService.countCharactersInSession(
          session.name,
        );
        setAffectedCount(count);
      } catch (err) {
        setAffectedCount(null);
      }
    }
    setConfirming(true);
  };

  const handleConfirm = async () => {
    setSaving(true);
    setError("");
    try {
      if (!isEdit) {
        await gameSessionService.createGameSession({
          name: trimmedName,
          category: trimmedCategory,
          discordWebhookUrl: webhookUrl,
        });
      } else if (nameChanged) {
        await gameSessionService.renameGameSession(session.id, session.name, {
          name: trimmedName,
          category: trimmedCategory,
          discordWebhookUrl: webhookUrl,
          // Changing the webhook means it must be re-verified.
          ...(webhookChanged ? { webhookVerified: false } : {}),
        });
      } else {
        await gameSessionService.updateGameSession(session.id, {
          name: trimmedName,
          category: trimmedCategory,
          discordWebhookUrl: webhookUrl,
          ...(webhookChanged ? { webhookVerified: false } : {}),
        });
      }
      await onSaved();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save session.");
      setSaving(false);
      setConfirming(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !saving) onClose();
  };

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
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
      maxWidth: "480px",
      border: `1px solid ${theme.border}`,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px",
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
      cursor: saving ? "not-allowed" : "pointer",
      padding: "4px",
      display: "flex",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "6px",
      marginTop: "14px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: theme.background,
      color: theme.text,
      outline: "none",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "10px 12px",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: theme.background,
      color: theme.text,
      outline: "none",
      boxSizing: "border-box",
    },
    hint: {
      fontSize: "12px",
      color: theme.textSecondary,
      marginTop: "6px",
      lineHeight: 1.4,
    },
    maskedRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      padding: "10px 12px",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      backgroundColor: theme.background,
      color: theme.textSecondary,
      fontSize: "14px",
      fontFamily: "monospace",
    },
    revealButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 10px",
      borderRadius: "6px",
      border: `1px solid ${theme.primary}`,
      backgroundColor: "transparent",
      color: theme.primary,
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
    warning: {
      display: "flex",
      gap: "8px",
      alignItems: "flex-start",
      backgroundColor: theme.background,
      border: `1px solid ${theme.warning}`,
      borderRadius: "6px",
      padding: "10px 12px",
      fontSize: "13px",
      color: theme.warning,
      marginTop: "8px",
      lineHeight: 1.4,
    },
    confirmBox: {
      backgroundColor: theme.background,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      padding: "16px",
      fontSize: "14px",
      color: theme.textSecondary,
      lineHeight: 1.6,
    },
    bold: { fontWeight: 600, color: theme.text },
    error: {
      fontSize: "13px",
      color: theme.error || "#dc2626",
      marginTop: "12px",
    },
    actions: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
      marginTop: "20px",
    },
    cancelButton: {
      padding: "10px 20px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: saving ? "not-allowed" : "pointer",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      color: theme.textSecondary,
    },
    primaryButton: {
      padding: "10px 20px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: saving ? "not-allowed" : "pointer",
      border: "none",
      backgroundColor: theme.primary,
      color: "white",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      opacity: saving ? 0.6 : 1,
    },
  };

  return (
    <div style={styles.overlay} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <Gamepad2 size={20} />
            {isEdit ? "Edit Game Session" : "Add Game Session"}
          </h2>
          <button
            style={styles.closeButton}
            onClick={onClose}
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        {confirming ? (
          <>
            <div style={styles.confirmBox}>
              {nameChanged ? (
                <div>
                  Rename <span style={styles.bold}>{session.name}</span> to{" "}
                  <span style={styles.bold}>{trimmedName}</span>?
                  <br />
                  <br />
                  All characters currently in{" "}
                  <span style={styles.bold}>{session.name}</span>
                  {affectedCount !== null && (
                    <>
                      {" "}
                      (<span style={styles.bold}>{affectedCount}</span>{" "}
                      {affectedCount === 1 ? "character" : "characters"})
                    </>
                  )}{" "}
                  will be updated to the new session name.
                </div>
              ) : (
                <div>
                  Save changes to <span style={styles.bold}>{trimmedName}</span>
                  ?
                </div>
              )}
              {webhookChanged && session?.discord_webhook_url && (
                <div style={styles.warning}>
                  <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                  <span>
                    You changed the Discord webhook. This changes where this
                    session's dice rolls are sent.
                  </span>
                </div>
              )}
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.actions}>
              <button
                style={styles.cancelButton}
                onClick={() => setConfirming(false)}
                disabled={saving}
              >
                Go Back
              </button>
              <button
                style={styles.primaryButton}
                onClick={handleConfirm}
                disabled={saving}
              >
                <Save size={14} />
                {saving ? "Saving..." : "Confirm"}
              </button>
            </div>
          </>
        ) : (
          <>
            <label style={styles.label}>Session Name</label>
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Monday - Haunting"
              autoFocus
            />

            <label style={styles.label}>Category</label>
            {addingCategory ? (
              <>
                <input
                  style={styles.input}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="New category name"
                  autoFocus
                />
                <button
                  style={styles.revealButton}
                  onClick={() => {
                    setAddingCategory(false);
                    setCategory(session?.category || "other");
                  }}
                >
                  Choose existing category
                </button>
              </>
            ) : (
              <select
                style={styles.select}
                value={category}
                onChange={(e) => {
                  if (e.target.value === "__new__") {
                    setAddingCategory(true);
                    setCategory("");
                  } else {
                    setCategory(e.target.value);
                  }
                }}
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat] || cat}
                  </option>
                ))}
                <option value="__new__">+ Add new category…</option>
              </select>
            )}

            <label style={styles.label}>Discord Webhook URL</label>
            {isEdit && session.discord_webhook_url && !webhookRevealed ? (
              <>
                <div style={styles.maskedRow}>
                  <span>{maskWebhook(session.discord_webhook_url)}</span>
                  <button
                    style={styles.revealButton}
                    onClick={() => setWebhookRevealed(true)}
                  >
                    <Eye size={14} />
                    Reveal & edit
                  </button>
                </div>
                <div style={styles.hint}>
                  Discord → Channel → Edit → Integrations → Webhooks → Copy URL
                </div>
                <div style={styles.warning}>
                  <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                  <span>
                    Editing this URL will change where this session's dice rolls
                    are sent in Discord.
                  </span>
                </div>
              </>
            ) : (
              <>
                <input
                  style={styles.input}
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                />
                <div style={styles.hint}>
                  Discord → Channel → Edit → Integrations → Webhooks → Copy URL
                </div>
              </>
            )}

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.actions}>
              <button style={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>
              <button style={styles.primaryButton} onClick={handleProceed}>
                <Save size={14} />
                {isEdit ? "Save Changes" : "Create Session"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameSessionModal;
