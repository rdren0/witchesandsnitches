import React from "react";
import { AlertTriangle, X } from "lucide-react";

const RestrictionModal = ({
  spellName,
  isOpen,
  onConfirm,
  onCancel,
  theme,
}) => {
  if (!isOpen) return null;

  const modalStyles = {
    overlay: {
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
    },
    modal: {
      backgroundColor: theme.background || "#ffffff",
      borderRadius: "12px",
      padding: "24px",
      maxWidth: "500px",
      margin: "20px",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      border: `2px solid ${theme.warning || "#f59e0b"}`,
    },
    header: {
      display: "flex",
      alignItems: "center",
      marginBottom: "16px",
      gap: "12px",
    },
    title: {
      fontSize: "20px",
      fontWeight: "bold",
      color: theme.warning || "#f59e0b",
      margin: 0,
    },
    spellName: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text || "#000000",
      marginBottom: "12px",
    },
    content: {
      color: theme.text || "#000000",
      lineHeight: "1.6",
      marginBottom: "20px",
    },
    restrictionList: {
      backgroundColor: theme.secondary || "#f3f4f6",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "20px",
    },
    listItem: {
      marginBottom: "8px",
      paddingLeft: "16px",
      position: "relative",
    },
    bullet: {
      position: "absolute",
      left: "0",
      top: "0",
      color: theme.warning || "#f59e0b",
      fontWeight: "bold",
    },
    buttonContainer: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    cancelButton: {
      backgroundColor: theme.secondary || "#f3f4f6",
      color: theme.text || "#000000",
    },
    confirmButton: {
      backgroundColor: theme.warning || "#f59e0b",
      color: "white",
    },
    closeButton: {
      position: "absolute",
      top: "16px",
      right: "16px",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: theme.text || "#000000",
      padding: "4px",
    },
  };

  return (
    <div style={modalStyles.overlay} onClick={onCancel}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={modalStyles.closeButton} onClick={onCancel}>
          <X size={20} />
        </button>

        <div style={modalStyles.header}>
          <AlertTriangle size={24} color={theme.warning || "#f59e0b"} />
          <h3 style={modalStyles.title}>Restriction Warning</h3>
        </div>

        <div style={modalStyles.spellName}>"{spellName}"</div>

        <div style={modalStyles.content}>
          This spell is marked as <strong>restricted</strong> and may require
          special permissions or have usage limitations.
        </div>

        <div style={modalStyles.restrictionList}>
          <div style={modalStyles.listItem}>
            <span style={modalStyles.bullet}>•</span>
            Subclass or feat requirements
          </div>
          <div style={modalStyles.listItem}>
            <span style={modalStyles.bullet}>•</span>
            Special training or certification needed
          </div>
          <div style={modalStyles.listItem}>
            <span style={modalStyles.bullet}>•</span>
            Usage restrictions or limitations
          </div>
          <div style={modalStyles.listItem}>
            <span style={modalStyles.bullet}>•</span>
            Administrative oversight required
          </div>
        </div>

        <div style={modalStyles.content}>
          Are you sure you want to attempt to cast this spell?
        </div>

        <div style={modalStyles.buttonContainer}>
          <button
            style={{ ...modalStyles.button, ...modalStyles.cancelButton }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            style={{ ...modalStyles.button, ...modalStyles.confirmButton }}
            onClick={onConfirm}
          >
            Cast Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestrictionModal;
