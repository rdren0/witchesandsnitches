import React, { useState, useEffect } from "react";
import { Shield, Eye } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { characterService } from "../services/characterService";
import AdminPasswordModal from "./AdminPasswordModal";

export const AdminToggle = ({ user, onAdminModeChange, adminMode = false }) => {
  const { theme } = useTheme();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const discordUserId = user?.user_metadata?.provider_id;

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!discordUserId) {
        setIsLoading(false);
        return;
      }

      try {
        const adminStatus = await characterService.isUserAdmin(discordUserId);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("❌ Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [discordUserId]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!discordUserId) {
        setIsLoading(false);
        return;
      }

      try {
        const adminStatus = await characterService.isUserAdmin(discordUserId);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [discordUserId]);

  const handleToggleChange = () => {
    if (adminMode) {
      onAdminModeChange(false);
      return;
    }

    if (isAdmin) {
      onAdminModeChange(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = async (password) => {
    setIsVerifying(true);

    try {
      await characterService.verifyAdminPassword(discordUserId, password);

      setIsAdmin(true);

      onAdminModeChange(true);

      setShowPasswordModal(false);
    } catch (error) {
      console.error("❌ Password verification failed!");
      console.error("Error:", error);

      throw error;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleModalClose = () => {
    if (!isVerifying) {
      setShowPasswordModal(false);
    }
  };

  if (isLoading) {
    return null;
  }

  const shouldShowToggle = true;

  if (!shouldShowToggle) {
    return null;
  }

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      backgroundColor: adminMode ? theme.primary + "20" : theme.surface,
      border: `1px solid ${adminMode ? theme.primary : theme.border}`,
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "14px",
      fontWeight: "500",
      color: adminMode ? theme.primary : theme.textSecondary,
    },
    icon: {
      flexShrink: 0,
    },
    label: {
      whiteSpace: "nowrap",
    },
    toggle: {
      position: "relative",
      width: "40px",
      height: "20px",
      backgroundColor: adminMode ? theme.primary : theme.border,
      borderRadius: "10px",
      transition: "background-color 0.2s ease",
      cursor: "pointer",
    },
    toggleSlider: {
      position: "absolute",
      top: "2px",
      left: adminMode ? "22px" : "2px",
      width: "16px",
      height: "16px",
      backgroundColor: "#fff",
      borderRadius: "50%",
      transition: "left 0.2s ease",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
    },
    badge: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "2px 6px",
      backgroundColor: theme.warning + "20",
      color: theme.warning,
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "600",
    },
    adminBadge: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "2px 6px",
      backgroundColor: theme.success + "20",
      color: theme.success,
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "600",
    },
  };

  return (
    <>
      <div style={styles.container} onClick={handleToggleChange}>
        <Shield size={16} style={styles.icon} />
        <span style={styles.label}>Admin View</span>
        <div style={styles.toggle}>
          <div style={styles.toggleSlider} />
        </div>
        {adminMode && (
          <div style={styles.badge}>
            <Eye size={12} />
            All Users
          </div>
        )}
        {isAdmin && !adminMode && <div style={styles.adminBadge}>Admin</div>}
      </div>

      <AdminPasswordModal
        isOpen={showPasswordModal}
        onClose={handleModalClose}
        onPasswordSubmit={handlePasswordSubmit}
        isLoading={isVerifying}
      />
    </>
  );
};

export default AdminToggle;
