import React, { useState, useCallback, useEffect } from "react";
import { Send, Trash2, Loader, X, Plus, ArrowLeft } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { ReactComponent as OwlIcon } from "../../Images/owl.svg";

const OwlMail = ({
  user,
  selectedCharacter,
  supabase,
  sessionCharacters,
  onBack,
  onMailRead,
}) => {
  const { theme } = useTheme();
  const [owlMails, setOwlMails] = useState([]);
  const [isLoadingMails, setIsLoadingMails] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [error, setError] = useState(null);
  const [expandedMail, setExpandedMail] = useState(null);
  const [mailFormData, setMailFormData] = useState({
    subject: "",
    message: "",
    recipient: null,
  });

  const fetchOwlMails = useCallback(async () => {
    if (!supabase || !selectedCharacter?.id) return;

    try {
      setIsLoadingMails(true);

      const { data, error: fetchError } = await supabase
        .from("owl_mail")
        .select(
          `
          *,
          sender:sender_character_id(id, name),
          recipient:recipient_character_id(id, name)
        `
        )
        .or(
          `sender_character_id.eq.${selectedCharacter.id},recipient_character_id.eq.${selectedCharacter.id}`
        )
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setOwlMails(data || []);
    } catch (err) {
      console.error("Error fetching owl mail:", err);
      setError("Failed to load owl mail. Please try again.");
    } finally {
      setIsLoadingMails(false);
    }
  }, [supabase, selectedCharacter?.id]);

  useEffect(() => {
    fetchOwlMails();
  }, [fetchOwlMails]);

  const sendOwlMail = useCallback(async () => {
    if (!mailFormData.recipient || !mailFormData.subject.trim() || !supabase) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSendingMail(true);
    setError(null);

    try {
      const newMail = {
        sender_character_id: selectedCharacter.id,
        recipient_character_id: mailFormData.recipient.id,
        subject: mailFormData.subject.trim(),
        message: mailFormData.message.trim() || null,
        read: false,
      };

      const { error: insertError } = await supabase
        .from("owl_mail")
        .insert([newMail]);

      if (insertError) throw insertError;

      setShowComposeModal(false);
      setMailFormData({
        subject: "",
        message: "",
        recipient: null,
      });

      await fetchOwlMails();
    } catch (err) {
      console.error("Error sending owl mail:", err);
      setError("Failed to send owl mail. Please try again.");
    } finally {
      setIsSendingMail(false);
    }
  }, [mailFormData, supabase, selectedCharacter?.id, fetchOwlMails]);

  const markMailAsRead = useCallback(
    async (mailId) => {
      if (!supabase) return;

      try {
        const { error: updateError } = await supabase
          .from("owl_mail")
          .update({ read: true })
          .eq("id", mailId);

        if (updateError) throw updateError;

        setOwlMails((prev) =>
          prev.map((mail) =>
            mail.id === mailId ? { ...mail, read: true } : mail
          )
        );

        // Notify parent to update unread count
        if (onMailRead) {
          onMailRead();
        }
      } catch (err) {
        console.error("Error marking mail as read:", err);
      }
    },
    [supabase, onMailRead]
  );

  const deleteOwlMail = useCallback(
    async (mailId) => {
      if (!supabase) return;

      try {
        const { error: deleteError } = await supabase
          .from("owl_mail")
          .delete()
          .eq("id", mailId);

        if (deleteError) throw deleteError;

        setOwlMails((prev) => prev.filter((mail) => mail.id !== mailId));
        if (expandedMail === mailId) {
          setExpandedMail(null);
        }

        // Notify parent to update unread count
        if (onMailRead) {
          onMailRead();
        }
      } catch (err) {
        console.error("Error deleting owl mail:", err);
        setError("Failed to delete mail. Please try again.");
      }
    },
    [supabase, expandedMail, onMailRead]
  );

  const unreadCount = owlMails.filter(
    (mail) =>
      !mail.read && mail.recipient_character_id === selectedCharacter?.id
  ).length;

  const receivedMails = owlMails.filter(
    (mail) => mail.recipient_character_id === selectedCharacter?.id
  );

  const styles = {
    container: {
      padding: "20px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    title: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "24px",
      fontWeight: "600",
      color: theme.text,
    },
    composeButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 20px",
      backgroundColor: theme.primary,
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "opacity 0.2s",
    },
    errorMessage: {
      padding: "12px",
      backgroundColor: theme.error + "20",
      border: `1px solid ${theme.error}`,
      borderRadius: "8px",
      color: theme.error,
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    loadingMessage: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px",
      color: theme.textSecondary,
    },
    mailList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    mailCard: {
      backgroundColor: theme.surface,
      border: `2px solid ${theme.border}`,
      borderRadius: "2px",
      padding: "20px 24px",
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      position: "relative",
      fontFamily: "'Georgia', serif",
    },
    mailCardUnread: {
      borderLeft: `5px solid ${theme.primary}`,
      backgroundColor: theme.surface,
      boxShadow: `0 4px 12px ${theme.primary}40`,
    },
    mailHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "8px",
    },
    mailSubject: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
      fontFamily: "'Georgia', serif",
    },
    mailMeta: {
      fontSize: "13px",
      color: theme.textSecondary,
      display: "flex",
      gap: "16px",
      fontFamily: "'Georgia', serif",
      fontStyle: "italic",
    },
    mailPreview: {
      fontSize: "14px",
      color: theme.textSecondary,
      marginTop: "12px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontFamily: "'Georgia', serif",
      lineHeight: "1.6",
    },
    mailActions: {
      display: "flex",
      gap: "8px",
      marginTop: "12px",
    },
    actionButton: {
      padding: "6px 12px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      fontWeight: "500",
      transition: "opacity 0.2s",
    },
    deleteButton: {
      backgroundColor: theme.error,
      color: "white",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: theme.textSecondary,
    },
    emptyIcon: {
      marginBottom: "16px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                color: theme.textSecondary,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.textSecondary;
              }}
              title="Back to Inventory"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <h2 style={styles.title}>
            Owl Post
            {unreadCount > 0 && (
              <span
                style={{
                  backgroundColor: theme.error,
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "14px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </h2>
        </div>
        {sessionCharacters.length > 0 && (
          <button
            onClick={() => setShowComposeModal(true)}
            style={styles.composeButton}
          >
            <Plus size={18} />
            Write Letter
          </button>
        )}
      </div>

      {error && (
        <div style={styles.errorMessage}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
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

      {isLoadingMails ? (
        <div style={styles.loadingMessage}>
          <Loader size={16} />
          Loading letters...
        </div>
      ) : receivedMails.length === 0 ? (
        <div style={styles.emptyState}>
          <div
            style={{
              ...styles.emptyIcon,
              color: theme.text,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <OwlIcon
              style={{
                width: "60px",
                height: "60px",
              }}
              fill="currentColor"
            />
          </div>
          <p>No new letters yet. Maybe the owls are overworked today!</p>
          <div
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              padding: "12px 16px",
              marginTop: "24px",
              fontSize: "13px",
              color: theme.textSecondary,
              lineHeight: "1.5",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <strong style={{ color: theme.text }}>Note:</strong> Owl Post is for
            fun, in-character communication between players. Don't use inventory
            management for mischief - use this instead! Messages are
            automatically deleted after 15 days.
          </div>
        </div>
      ) : (
        <>
          {receivedMails.length === 0 ? (
            <div style={styles.emptyState}>
              <div
                style={{
                  ...styles.emptyIcon,
                  color: theme.text,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <OwlIcon
                  style={{
                    width: "60px",
                    height: "60px",
                  }}
                  fill="currentColor"
                />
              </div>
              <p>No new letters yet. Maybe the owls are overworked today!</p>
              <div
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginTop: "24px",
                  fontSize: "13px",
                  color: theme.textSecondary,
                  lineHeight: "1.5",
                  maxWidth: "600px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <strong style={{ color: theme.text }}>Note:</strong> Owl Post is
                for fun, in-character communication between players. Don't use
                inventory management for mischief - use this instead! Messages
                are automatically deleted after 15 days.
              </div>
            </div>
          ) : (
            <div style={styles.mailList}>
              {receivedMails.map((mail) => {
                const isExpanded = expandedMail === mail.id;

                return (
                  <div
                    key={mail.id}
                    style={{
                      ...styles.mailCard,
                      ...(!mail.read && styles.mailCardUnread),
                    }}
                    onClick={() => {
                      if (!isExpanded && !mail.read) {
                        markMailAsRead(mail.id);
                      }
                      setExpandedMail(isExpanded ? null : mail.id);
                    }}
                  >
                    <div style={styles.mailHeader}>
                      <div style={{ flex: 1 }}>
                        <div style={styles.mailSubject}>{mail.subject}</div>
                        <div style={styles.mailMeta}>
                          <span>From: {mail.sender?.name || "Unknown"}</span>
                          <span>
                            {new Date(mail.created_at).toLocaleDateString()}
                          </span>
                          {!mail.read && (
                            <span
                              style={{
                                color: theme.primary,
                                fontWeight: "600",
                              }}
                            >
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded ? (
                      <>
                        {mail.message && (
                          <div
                            style={{
                              fontSize: "15px",
                              color: theme.text,
                              marginTop: "16px",
                              whiteSpace: "pre-wrap",
                              padding: "16px",
                              backgroundColor: theme.background,
                              borderRadius: "2px",
                              border: `1px solid ${theme.border}`,
                              fontFamily: "'Georgia', serif",
                              lineHeight: "1.8",
                            }}
                          >
                            {mail.message}
                          </div>
                        )}
                        <div style={styles.mailActions}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  "Are you sure you want to burn this letter?"
                                )
                              ) {
                                deleteOwlMail(mail.id);
                              }
                            }}
                            style={{
                              ...styles.actionButton,
                              ...styles.deleteButton,
                            }}
                          >
                            <Trash2 size={14} />
                            Burn
                          </button>
                        </div>
                      </>
                    ) : (
                      mail.message && (
                        <div style={styles.mailPreview}>{mail.message}</div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {showComposeModal && (
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
            setShowComposeModal(false);
            setMailFormData({ subject: "", message: "", recipient: null });
          }}
        >
          <div
            style={{
              backgroundColor: theme.background,
              borderRadius: "12px",
              maxWidth: "600px",
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
                <Send
                  size={24}
                  style={{ verticalAlign: "middle", marginRight: "8px" }}
                />
                Write a Letter
              </h2>
              <button
                onClick={() => {
                  setShowComposeModal(false);
                  setMailFormData({
                    subject: "",
                    message: "",
                    recipient: null,
                  });
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

            <div
              style={{
                padding: "24px",
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: theme.text,
                  }}
                >
                  To: *
                </label>
                <select
                  value={mailFormData.recipient?.id || ""}
                  onChange={(e) => {
                    const characterId = e.target.value;
                    if (!characterId) {
                      setMailFormData((prev) => ({ ...prev, recipient: null }));
                      return;
                    }
                    const character = sessionCharacters.find(
                      (c) => String(c.id) === String(characterId)
                    );
                    setMailFormData((prev) => ({
                      ...prev,
                      recipient: character || null,
                    }));
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.surface,
                    color: theme.text,
                    fontSize: "14px",
                  }}
                >
                  <option value="">Select recipient...</option>
                  {sessionCharacters.map((character) => (
                    <option key={character.id} value={character.id}>
                      {character.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: theme.text,
                  }}
                >
                  Subject: *
                </label>
                <input
                  type="text"
                  value={mailFormData.subject}
                  onChange={(e) =>
                    setMailFormData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  placeholder="Enter subject..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.surface,
                    color: theme.text,
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: theme.text,
                  }}
                >
                  Message:
                </label>
                <textarea
                  value={mailFormData.message}
                  onChange={(e) =>
                    setMailFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder="Write your message..."
                  rows={8}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.surface,
                    color: theme.text,
                    fontSize: "14px",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </div>
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
                  setShowComposeModal(false);
                  setMailFormData({
                    subject: "",
                    message: "",
                    recipient: null,
                  });
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
                onClick={sendOwlMail}
                disabled={
                  !mailFormData.recipient ||
                  !mailFormData.subject.trim() ||
                  isSendingMail
                }
                style={{
                  flex: 1,
                  padding: "10px 20px",
                  backgroundColor: theme.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor:
                    !mailFormData.recipient ||
                    !mailFormData.subject.trim() ||
                    isSendingMail
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  opacity:
                    !mailFormData.recipient ||
                    !mailFormData.subject.trim() ||
                    isSendingMail
                      ? 0.5
                      : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isSendingMail ? (
                  <>
                    <Loader size={16} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send by Owl
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwlMail;
