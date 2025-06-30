import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { characterService } from "../services/characterService";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    return {
      adminMode: false,
      setAdminMode: () => {
        console.warn("setAdminMode called outside of AdminProvider context");
      },
      isUserAdmin: false,
      setIsUserAdmin: () => {
        console.warn("setIsUserAdmin called outside of AdminProvider context");
      },
      allUsers: [],
      loadAllUsers: () => {
        console.warn("loadAllUsers called outside of AdminProvider context");
      },
    };
  }
  return context;
};

export const AdminProvider = ({ children, user }) => {
  const [adminMode, setAdminModeState] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  let searchParams, setSearchParams;
  try {
    [searchParams, setSearchParams] = useSearchParams();
  } catch (error) {
    console.warn(
      "useSearchParams not available, admin mode URL persistence disabled"
    );
    searchParams = new URLSearchParams();
    setSearchParams = () => {};
  }

  const discordUserId = user?.user_metadata?.provider_id;

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!discordUserId) {
        setIsUserAdmin(false);
        setAdminModeState(false);
        return;
      }

      try {
        const adminStatus = await characterService.isUserAdmin(discordUserId);
        setIsUserAdmin(adminStatus);

        if (!adminStatus) {
          setAdminModeState(false);

          if (setSearchParams && typeof setSearchParams === "function") {
            try {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete("admin");
              setSearchParams(newParams, { replace: true });
            } catch (error) {
              console.warn("Failed to update URL parameters:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsUserAdmin(false);
        setAdminModeState(false);
      }
    };

    checkAdminStatus();
  }, [discordUserId, searchParams, setSearchParams]);

  useEffect(() => {
    if (!searchParams) return;

    const adminParam = searchParams.get("admin");

    if (adminParam === "true" && isUserAdmin) {
      setAdminModeState(true);
    } else if (
      adminParam === "true" &&
      !isUserAdmin &&
      setSearchParams &&
      typeof setSearchParams === "function"
    ) {
      try {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("admin");
        setSearchParams(newParams, { replace: true });
      } catch (error) {
        console.warn("Failed to update URL parameters:", error);
      }
    }
  }, [isUserAdmin, searchParams, setSearchParams]);

  const setAdminMode = (isActive) => {
    if (!isUserAdmin) {
      console.warn("Cannot set admin mode: user is not an admin");
      return;
    }

    setAdminModeState(isActive);

    if (setSearchParams && typeof setSearchParams === "function") {
      try {
        const newParams = new URLSearchParams(searchParams);
        if (isActive) {
          newParams.set("admin", "true");
        } else {
          newParams.delete("admin");
        }
        setSearchParams(newParams, { replace: true });
      } catch (error) {
        console.warn("Failed to update URL parameters:", error);
      }
    }
  };

  useEffect(() => {
    if (!isUserAdmin && adminMode) {
      setAdminMode(false);
    }
  }, [isUserAdmin, adminMode]);

  const loadAllUsers = async () => {
    if (!isUserAdmin) {
      console.warn("loadAllUsers called but user is not admin");
      return;
    }

    try {
      const allCharacters = await characterService.getAllCharacters();

      const userMap = new Map();

      allCharacters.forEach((character) => {
        const userId = character.discord_user_id;
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            discordUserId: userId,
            username: character.discord_users?.username || "Unknown",
            displayName:
              character.discord_users?.display_name ||
              character.discord_users?.username ||
              "Unknown User",
            characterCount: 0,
            characters: [],
          });
        }

        const user = userMap.get(userId);
        user.characterCount++;
        user.characters.push({
          id: character.id,
          name: character.name,
          level: character.level,
          gameSession: character.game_session,
        });
      });

      const usersArray = Array.from(userMap.values()).sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      );

      setAllUsers(usersArray);
    } catch (error) {
      console.error("Error loading all users:", error);
      setAllUsers([]);
    }
  };

  const value = {
    adminMode,
    setAdminMode,
    isUserAdmin,
    setIsUserAdmin,
    allUsers,
    loadAllUsers,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContext;
