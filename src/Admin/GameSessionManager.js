import React, { useState } from "react";
import {
  Gamepad2,
  Plus,
  Pencil,
  Archive,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  X,
  Lock,
  Send,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useGameSessions } from "../contexts/GameSessionsContext";
import { gameSessionService } from "../services/gameSessionService";
import GameSessionModal from "./GameSessionModal";

const CATEGORY_LABELS = {
  haunting: "Haunting",
  knights: "Knights",
  other: "Other",
  development: "Development",
};

const GameSessionManager = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { sessions, loading, refresh } = useGameSessions();

  const [showArchived, setShowArchived] = useState(false);
  const [modalSession, setModalSession] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [archiving, setArchiving] = useState(false);
  const [actionError, setActionError] = useState("");

  const [testTarget, setTestTarget] = useState(null);
  const [testPhase, setTestPhase] = useState("idle"); // sending | sent | error
  const [testError, setTestError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const activeSessions = sessions.filter((s) => !s.archived);
  const archivedSessions = sessions.filter((s) => s.archived);

  const openCreate = () => {
    setModalSession(null);
    setModalOpen(true);
  };

  const openEdit = (session) => {
    setModalSession(session);
    setModalOpen(true);
  };

  const handleArchive = async () => {
    if (!archiveTarget) return;
    setArchiving(true);
    setActionError("");
    try {
      await gameSessionService.archiveGameSession(archiveTarget.id);
      await refresh();
      setArchiveTarget(null);
    } catch (err) {
      setActionError(err.message || "Failed to archive session.");
    } finally {
      setArchiving(false);
    }
  };

  const handleSendTest = async (session) => {
    setTestTarget(session);
    setTestPhase("sending");
    setTestError("");
    try {
      await gameSessionService.sendTestMessage(session);
      setTestPhase("sent");
    } catch (err) {
      setTestError(err.message || "Failed to send the test message.");
      setTestPhase("error");
    }
  };

  const handleConfirmVerified = async () => {
    if (!testTarget) return;
    setVerifying(true);
    setTestError("");
    try {
      await gameSessionService.setGameSessionVerified(testTarget.id, true);
      await refresh();
      closeTest();
    } catch (err) {
      setTestError(err.message || "Failed to save verification.");
    } finally {
      setVerifying(false);
    }
  };

  const closeTest = () => {
    setTestTarget(null);
    setTestPhase("idle");
    setTestError("");
    setVerifying(false);
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: theme.surface,
      border: `2px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "24px",
      width: "100%",
      maxWidth: "760px",
      maxHeight: "85vh",
      overflowY: "auto",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    headerRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
    },
    title: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: theme.text,
      fontSize: "20px",
      fontWeight: "bold",
      margin: 0,
    },
    headerActions: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    addButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: theme.primary,
      color: "white",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: theme.textSecondary,
      cursor: "pointer",
      padding: "4px",
      display: "flex",
    },
    list: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginTop: "16px",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 110px 220px 160px",
      alignItems: "center",
      gap: "12px",
      padding: "12px 14px",
      backgroundColor: theme.background,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
    },
    name: { fontWeight: 600, color: theme.text, fontSize: "14px" },
    categoryBadge: {
      justifySelf: "start",
      padding: "2px 10px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: 600,
      backgroundColor: theme.primary + "20",
      color: theme.primary,
    },
    webhookStatus: { fontSize: "12px", color: theme.textSecondary },
    statusCell: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    lockedHint: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "12px",
      fontWeight: 600,
      color: theme.textSecondary,
    },
    rowActions: {
      display: "flex",
      gap: "8px",
      justifyContent: "flex-end",
    },
    iconButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "6px 10px",
      borderRadius: "6px",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      color: theme.text,
      fontSize: "12px",
      fontWeight: 600,
      cursor: "pointer",
    },
    dangerButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "6px 10px",
      borderRadius: "6px",
      border: "1px solid #fca5a5",
      backgroundColor: "transparent",
      color: "#dc2626",
      fontSize: "12px",
      fontWeight: 600,
      cursor: "pointer",
    },
    archivedToggle: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginTop: "16px",
      background: "none",
      border: "none",
      color: theme.textSecondary,
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      padding: 0,
    },
    empty: {
      padding: "16px",
      textAlign: "center",
      color: theme.textSecondary,
      fontSize: "14px",
    },
    error: { color: "#dc2626", fontSize: "13px", marginTop: "8px" },
    confirmOverlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1100,
      padding: "20px",
    },
    confirmModal: {
      backgroundColor: theme.surface,
      borderRadius: "12px",
      padding: "24px",
      width: "100%",
      maxWidth: "440px",
      border: `1px solid ${theme.border}`,
    },
    confirmTitle: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "18px",
      fontWeight: 600,
      color: theme.text,
      marginBottom: "12px",
    },
    confirmText: {
      fontSize: "14px",
      color: theme.textSecondary,
      lineHeight: 1.6,
      marginBottom: "20px",
    },
    bold: { fontWeight: 600, color: theme.text },
    confirmActions: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    successButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#10b981",
      color: "white",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
    },
  };

  // The development session is intentionally not editable from the UI — it can
  // only be changed directly in the database.
  const isLocked = (session) => session.category === "development";

  const getSessionStatus = (session) => {
    if (!session.discord_webhook_url) {
      return { text: "Not connected to Discord", color: "#dc2626" };
    }
    if (session.webhook_verified) {
      return { text: "✓ Verified", color: "#10b981" };
    }
    return { text: "Not Verified", color: "#f59e0b" };
  };

  const renderRow = (session, isArchived) => (
    <div
      key={session.id}
      style={{ ...styles.row, opacity: isArchived ? 0.65 : 1 }}
    >
      <span style={styles.name}>{session.name}</span>
      <span style={styles.categoryBadge}>
        {CATEGORY_LABELS[session.category] || session.category}
      </span>
      {(() => {
        const status = getSessionStatus(session);
        return (
          <div style={styles.statusCell}>
            <span style={{ ...styles.webhookStatus, color: status.color }}>
              {status.text}
            </span>
            {!isArchived &&
              session.discord_webhook_url &&
              !session.webhook_verified && (
                <button
                  style={styles.iconButton}
                  onClick={() => handleSendTest(session)}
                >
                  <Send size={12} />
                  Send test
                </button>
              )}
          </div>
        );
      })()}
      <div style={styles.rowActions}>
        {isLocked(session) ? (
          <span style={styles.lockedHint}>
            <Lock size={12} />
          </span>
        ) : (
          !isArchived && (
            <>
              <button
                style={styles.iconButton}
                onClick={() => openEdit(session)}
              >
                <Pencil size={12} />
                Edit
              </button>
              <button
                style={styles.dangerButton}
                onClick={() => setArchiveTarget(session)}
              >
                <Archive size={12} />
                Delete
              </button>
            </>
          )
        )}
      </div>
    </div>
  );

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div style={styles.overlay} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>
            <Gamepad2 size={22} />
            Manage Game Sessions
          </h2>
          <div style={styles.headerActions}>
            <button style={styles.addButton} onClick={openCreate}>
              <Plus size={16} />
              Add Session
            </button>
            <button style={styles.closeButton} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {loading && activeSessions.length === 0 ? (
          <div style={styles.empty}>Loading sessions...</div>
        ) : activeSessions.length === 0 ? (
          <div style={styles.empty}>
            No active sessions yet. Click "Add Session" to create one.
          </div>
        ) : (
          <div style={styles.list}>
            {activeSessions.map((s) => renderRow(s, false))}
          </div>
        )}

        {archivedSessions.length > 0 && (
          <>
            <button
              style={styles.archivedToggle}
              onClick={() => setShowArchived((v) => !v)}
            >
              {showArchived ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              Archived sessions ({archivedSessions.length})
            </button>
            {showArchived && (
              <div style={styles.list}>
                {archivedSessions.map((s) => renderRow(s, true))}
              </div>
            )}
          </>
        )}

        {actionError && <div style={styles.error}>{actionError}</div>}
      </div>

      <GameSessionModal
        isOpen={modalOpen}
        session={modalSession}
        onClose={() => setModalOpen(false)}
        onSaved={refresh}
      />

      {archiveTarget && (
        <div
          style={styles.confirmOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget && !archiving)
              setArchiveTarget(null);
          }}
        >
          <div style={styles.confirmModal}>
            <div style={styles.confirmTitle}>
              <AlertTriangle size={20} color="#f59e0b" />
              Archive Session
            </div>
            <div style={styles.confirmText}>
              Archive <span style={styles.bold}>{archiveTarget.name}</span>? It
              will be hidden from session dropdowns, but no data is deleted —
              characters keep their session name and the session can be restored
              from the database. Dice rolls for this session will fall back to
              the default webhook.
            </div>
            {actionError && <div style={styles.error}>{actionError}</div>}
            <div style={styles.confirmActions}>
              <button
                style={styles.iconButton}
                onClick={() => setArchiveTarget(null)}
                disabled={archiving}
              >
                Cancel
              </button>
              <button
                style={styles.dangerButton}
                onClick={handleArchive}
                disabled={archiving}
              >
                <Archive size={12} />
                {archiving ? "Archiving..." : "Archive Session"}
              </button>
            </div>
          </div>
        </div>
      )}

      {testTarget && (
        <div
          style={styles.confirmOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget && !verifying) closeTest();
          }}
        >
          <div style={styles.confirmModal}>
            <div style={styles.confirmTitle}>
              <Send size={20} color={theme.primary} />
              Test Discord Connection
            </div>

            {testPhase === "sending" && (
              <div style={styles.confirmText}>
                Sending a test message to{" "}
                <span style={styles.bold}>{testTarget.name}</span>…
              </div>
            )}

            {testPhase === "error" && (
              <div style={styles.confirmText}>
                <span style={{ color: "#dc2626" }}>{testError}</span>
              </div>
            )}

            {testPhase === "sent" && (
              <div style={styles.confirmText}>
                We sent a test message to{" "}
                <span style={styles.bold}>{testTarget.name}</span>. Did it show
                up in the Discord channel?
                {testError && (
                  <div style={{ color: "#dc2626", marginTop: "8px" }}>
                    {testError}
                  </div>
                )}
              </div>
            )}

            <div style={styles.confirmActions}>
              {testPhase === "sent" ? (
                <>
                  <button
                    style={styles.iconButton}
                    onClick={closeTest}
                    disabled={verifying}
                  >
                    No, it didn't
                  </button>
                  <button
                    style={styles.successButton}
                    onClick={handleConfirmVerified}
                    disabled={verifying}
                  >
                    <CheckCircle size={14} />
                    {verifying ? "Saving…" : "Yes, it worked"}
                  </button>
                </>
              ) : (
                <button
                  style={styles.iconButton}
                  onClick={closeTest}
                  disabled={testPhase === "sending"}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSessionManager;
