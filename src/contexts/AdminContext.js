import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
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
      markPasswordVerified: () => {
        console.warn(
          "markPasswordVerified called outside of AdminProvider context"
        );
      },
      clearPasswordVerification: () => {
        console.warn(
          "clearPasswordVerification called outside of AdminProvider context"
        );
      },
      isInitialized: true,
    };
  }
  return context;
};

export const AdminProvider = ({ children, user }) => {
  const [adminMode, setAdminModeState] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const discordUserId = user?.user_metadata?.provider_id;

  useEffect(() => {
    if (!discordUserId) {
      setIsInitialized(true);
      return;
    }

    const initializeAdminState = async () => {
      try {
        const hasAdminPassword =
          localStorage.getItem(`admin_password_verified_${discordUserId}`) ===
          "true";

        const sessionAdminMode =
          sessionStorage.getItem("admin_mode_enabled") === "true";

        const currentAdminStatus = await characterService.isUserAdmin(
          discordUserId
        );

        const isAdmin = currentAdminStatus || hasAdminPassword;
        setIsUserAdmin(isAdmin);

        if (sessionAdminMode && isAdmin) {
          setAdminModeState(true);
        } else {
          setAdminModeState(false);

          if (!isAdmin) {
            sessionStorage.removeItem("admin_mode_enabled");
          }
        }
      } catch (error) {
        console.error("Error initializing admin state:", error);
        setIsUserAdmin(false);
        setAdminModeState(false);
        sessionStorage.removeItem("admin_mode_enabled");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAdminState();
  }, [discordUserId]);

  const setAdminMode = useCallback(
    (isActive) => {
      if (!isUserAdmin && isActive) {
        console.warn("Cannot set admin mode: user is not an admin");
        return;
      }

      setAdminModeState(isActive);

      if (isActive) {
        sessionStorage.setItem("admin_mode_enabled", "true");
      } else {
        sessionStorage.removeItem("admin_mode_enabled");
      }
    },
    [isUserAdmin]
  );

  const markPasswordVerified = useCallback(() => {
    if (discordUserId) {
      localStorage.setItem(`admin_password_verified_${discordUserId}`, "true");
    }
  }, [discordUserId]);

  const clearPasswordVerification = useCallback(() => {
    if (discordUserId) {
      localStorage.removeItem(`admin_password_verified_${discordUserId}`);
      sessionStorage.removeItem("admin_mode_enabled");
      setAdminModeState(false);
      setIsUserAdmin(false);
    }
  }, [discordUserId]);

  useEffect(() => {
    if (!isUserAdmin && adminMode) {
      setAdminMode(false);
    }
  }, [isUserAdmin, adminMode, setAdminMode]);

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
    markPasswordVerified,
    clearPasswordVerification,
    isInitialized,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContext;
