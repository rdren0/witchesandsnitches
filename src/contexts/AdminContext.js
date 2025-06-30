import React, { createContext, useContext, useState, useEffect } from "react";
import { characterService } from "../services/characterService";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children, user }) => {
  const [adminMode, setAdminMode] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const discordUserId = user?.user_metadata?.provider_id;

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!discordUserId) {
        setIsUserAdmin(false);
        setAdminMode(false);
        return;
      }

      try {
        const adminStatus = await characterService.isUserAdmin(discordUserId);
        setIsUserAdmin(adminStatus);

        if (!adminStatus && adminMode) {
          setAdminMode(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsUserAdmin(false);
        setAdminMode(false);
      }
    };

    checkAdminStatus();
  }, [discordUserId, adminMode]);

  useEffect(() => {
    if (!isUserAdmin && adminMode) {
      setAdminMode(false);
    }
  }, [isUserAdmin, adminMode]);

  const toggleAdminMode = () => {
    if (!isUserAdmin) {
      console.warn("User is not an admin");
      return;
    }
    setAdminMode(!adminMode);
  };

  const verifyAdminPassword = async (password) => {
    if (!discordUserId) {
      throw new Error("User not authenticated");
    }

    try {
      setAdminLoading(true);
      const success = await characterService.verifyAdminPassword(
        discordUserId,
        password
      );

      if (success) {
        setIsUserAdmin(true);
      }

      return success;
    } catch (error) {
      console.error("Admin verification failed:", error);
      throw error;
    } finally {
      setAdminLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      setAdminLoading(true);

      const allCharacters = await characterService.getAllCharacters();

      const userMap = new Map();
      allCharacters.forEach((char) => {
        if (char.discord_user_id && !userMap.has(char.discord_user_id)) {
          userMap.set(char.discord_user_id, {
            discordUserId: char.discord_user_id,
            username: char.discord_users?.username || "Unknown",
            displayName: char.discord_users?.display_name || "Unknown",
            characterCount: 0,
          });
        }
        if (userMap.has(char.discord_user_id)) {
          userMap.get(char.discord_user_id).characterCount++;
        }
      });

      setAllUsers(Array.from(userMap.values()));
    } catch (error) {
      console.error("Error loading users:", error);
      throw error;
    } finally {
      setAdminLoading(false);
    }
  };

  const grantAdminRole = async (targetDiscordUserId) => {
    if (!isUserAdmin) {
      throw new Error("Only admins can grant admin role");
    }

    try {
      await characterService.setUserRole(
        targetDiscordUserId,
        "admin",
        discordUserId
      );
    } catch (error) {
      console.error("Error granting admin role:", error);
      throw error;
    }
  };

  const removeAdminRole = async (targetDiscordUserId) => {
    if (!isUserAdmin) {
      throw new Error("Only admins can remove admin role");
    }

    try {
      await characterService.removeUserRole(targetDiscordUserId, "admin");
    } catch (error) {
      console.error("Error removing admin role:", error);
      throw error;
    }
  };

  const setUserRole = async (targetDiscordUserId, role) => {
    if (!isUserAdmin) {
      throw new Error("Only admins can set user roles");
    }

    try {
      await characterService.setUserRole(
        targetDiscordUserId,
        role,
        discordUserId
      );
    } catch (error) {
      console.error("Error setting user role:", error);
      throw error;
    }
  };

  const value = {
    adminMode,
    isUserAdmin,
    adminLoading,
    allUsers,
    setAdminMode,
    toggleAdminMode,
    verifyAdminPassword,
    loadAllUsers,
    grantAdminRole,
    removeAdminRole,
    setUserRole,

    canEditAnyCharacter: adminMode && isUserAdmin,
    canCreateForOthers: adminMode && isUserAdmin,
    canViewAdminDashboard: isUserAdmin,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
