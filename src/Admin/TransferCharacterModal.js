import React, { useState, useEffect } from "react";
import { ArrowLeftRight, X, Search, User } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAdmin } from "../contexts/AdminContext";

const isRawDiscordId = (str) => /^\d{15,20}$/.test(str ?? "");
const PLACEHOLDER_NAMES = ["Unknown User", "Unknown", "Discord User"];
const isPlaceholder = (str) =>
  !str || PLACEHOLDER_NAMES.includes(str) || isRawDiscordId(str);

const getUserLabel = (user) => {
  if (!user) return null;
  if (!isPlaceholder(user.displayName)) return user.displayName;
  const charNames = user.characters?.map((c) => c.name).join(", ");
  return charNames || user.discordUserId;
};

const formatCharList = (characters = []) => {
  const names = characters.map((c) => c.name);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
};

const TransferCharacterModal = ({
  isOpen,
  onClose,
  character,
  onTransfer,
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const { allUsers } = useAdmin();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedUser(null);
      setConfirming(false);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen || !character) return null;

  const currentOwnerId = character.discordUserId || character.discord_user_id;

  const currentOwner = allUsers.find((u) => u.discordUserId === currentOwnerId);
  const currentOwnerLabel =
    getUserLabel(currentOwner) || currentOwnerId || "Unknown";

  const filteredUsers = allUsers.filter((u) => {
    if (u.discordUserId === currentOwnerId) return false;
    const q = search.toLowerCase();
    const label = getUserLabel(u)?.toLowerCase() ?? "";
    const username = u.username?.toLowerCase() ?? "";
    const charNames =
      u.characters?.map((c) => c.name.toLowerCase()).join(" ") ?? "";
    return label.includes(q) || username.includes(q) || charNames.includes(q);
  });

  const handleConfirm = () => {
    if (!selectedUser) return;
    setConfirming(true);
  };

  const handleExecuteTransfer = async () => {
    setError("");
    try {
      await onTransfer(selectedUser.discordUserId);
    } catch (err) {
      setError("Transfer failed. Please try again.");
      setConfirming(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) onClose();
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
      maxWidth: "460px",
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
      cursor: isLoading ? "not-allowed" : "pointer",
      padding: "4px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    infoBox: {
      backgroundColor: theme.background,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "16px",
      fontSize: "14px",
      color: theme.textSecondary,
    },
    bold: {
      fontWeight: "600",
      color: theme.text,
    },
    searchContainer: {
      position: "relative",
      marginBottom: "8px",
    },
    searchIcon: {
      position: "absolute",
      left: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      color: theme.textSecondary,
      pointerEvents: "none",
    },
    searchInput: {
      width: "100%",
      padding: "10px 12px 10px 34px",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: theme.background,
      color: theme.text,
      outline: "none",
      boxSizing: "border-box",
    },
    userList: {
      maxHeight: "240px",
      overflowY: "auto",
      border: `1px solid ${theme.border}`,
      borderRadius: "6px",
      marginBottom: "16px",
    },
    userRow: (isSelected, isLast) => ({
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      padding: "10px 12px",
      cursor: "pointer",
      backgroundColor: isSelected ? theme.primary + "20" : "transparent",
      borderBottom: isLast ? "none" : `1px solid ${theme.border}`,
      transition: "background-color 0.15s ease",
    }),
    userIcon: {
      color: theme.textSecondary,
      flexShrink: 0,
      marginTop: "2px",
    },
    userName: {
      fontSize: "14px",
      fontWeight: "500",
      color: theme.text,
    },
    userSub: {
      fontSize: "12px",
      color: theme.textSecondary,
      marginTop: "2px",
    },
    emptyState: {
      padding: "20px",
      textAlign: "center",
      color: theme.textSecondary,
      fontSize: "14px",
    },
    error: {
      fontSize: "12px",
      color: theme.error || "#dc2626",
      marginBottom: "12px",
    },
    actions: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    cancelButton: {
      padding: "10px 20px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: isLoading ? "not-allowed" : "pointer",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.surface,
      color: theme.textSecondary,
    },
    transferButton: {
      padding: "10px 20px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: isLoading || !selectedUser ? "not-allowed" : "pointer",
      border: "none",
      backgroundColor: theme.primary,
      color: "white",
      opacity: isLoading || !selectedUser ? 0.5 : 1,
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    confirmBox: {
      backgroundColor: theme.background,
      border: `1px solid ${theme.border}`,
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
      fontSize: "14px",
      color: theme.textSecondary,
      lineHeight: "1.6",
    },
    loadingSpinner: {
      display: "inline-block",
      width: "14px",
      height: "14px",
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
            <ArrowLeftRight size={20} />
            Transfer Character
          </h2>
          <button
            style={styles.closeButton}
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div style={styles.infoBox}>
          <span style={styles.bold}>{character.name}</span>
          <span> is currently owned by </span>
          <span style={styles.bold}>{currentOwnerLabel}</span>
          <span>. Select a new owner below.</span>
        </div>

        {confirming ? (
          <>
            <div style={styles.confirmBox}>
              <div>Are you sure you want to transfer this character?</div>
              <br />
              <div>
                <span style={styles.bold}>{character.name}</span>
                <span> will be moved from </span>
                <span style={styles.bold}>{currentOwnerLabel}</span>
                <span> to </span>
                {isPlaceholder(selectedUser?.displayName) ? (
                  <>
                    <span>the owner of </span>
                    <span style={styles.bold}>
                      {formatCharList(selectedUser?.characters)}
                    </span>
                  </>
                ) : (
                  <span style={styles.bold}>{selectedUser?.displayName}</span>
                )}
                <span>.</span>
              </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.actions}>
              <button
                style={styles.cancelButton}
                onClick={() => setConfirming(false)}
                disabled={isLoading}
              >
                Go Back
              </button>
              <button
                style={styles.transferButton}
                onClick={handleExecuteTransfer}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span style={styles.loadingSpinner} />
                    Transferring...
                  </>
                ) : (
                  <>
                    <ArrowLeftRight size={14} />
                    Confirm Transfer
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={styles.searchContainer}>
              <Search size={14} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by name or character..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary;
                  e.target.style.boxShadow = `0 0 0 2px ${theme.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border;
                  e.target.style.boxShadow = "none";
                }}
                autoFocus
                disabled={isLoading}
              />
            </div>

            <div style={styles.userList}>
              {filteredUsers.length === 0 ? (
                <div style={styles.emptyState}>
                  {search
                    ? "No users match your search."
                    : "No other users found."}
                </div>
              ) : (
                filteredUsers.map((u, i) => {
                  const isSelected =
                    selectedUser?.discordUserId === u.discordUserId;
                  const isLast = i === filteredUsers.length - 1;
                  const label = getUserLabel(u);
                  const hasGoodName = !isPlaceholder(u.displayName);
                  const charNames = u.characters?.map((c) => c.name).join(", ");
                  const usernameSubtitle =
                    !isPlaceholder(u.username) && u.username !== label
                      ? `@${u.username}`
                      : null;

                  return (
                    <div
                      key={u.discordUserId}
                      style={styles.userRow(isSelected, isLast)}
                      onClick={() => setSelectedUser(u)}
                    >
                      <User size={16} style={styles.userIcon} />
                      <div>
                        <div style={styles.userName}>{label}</div>
                        {usernameSubtitle && (
                          <div style={styles.userSub}>{usernameSubtitle}</div>
                        )}
                        {charNames && hasGoodName && (
                          <div style={styles.userSub}>{charNames}</div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.actions}>
              <button
                style={styles.cancelButton}
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                style={styles.transferButton}
                onClick={handleConfirm}
                disabled={!selectedUser}
              >
                <ArrowLeftRight size={14} />
                Transfer
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TransferCharacterModal;
