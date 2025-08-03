import ThemeCharacterSync from "../Components/ThemeCharacterSync/ThemeCharacterSync";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Edit3, Check, X, User, Palette, Shield, Key } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { characterService } from "../services/characterService";
import SpellBook from "../Components/SpellBook/SpellBook";

import CharacterSheet from "../Components/CharacterSheet/CharacterSheet";
import CharacterNotes from "../Components/CharacterNotes/CharacterNotes";
import CharacterSelector from "../Components/CharacterSelector/CharacterSelector";
import CharacterGallery from "../Components/CharacterGallery/CharacterGallery";
import ThemeSettings from "../Components/ThemeSettings/ThemeSettings";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { RollModalProvider } from "../Components/utils/diceRoller";

import { createAppStyles } from "../styles/masterStyles";
import PotionBrewingSystem from "../Components/Potions/Potions";
import Inventory from "../Components/Inventory/Inventory";
import CharacterManagement from "../Components/CharacterManagement/CharacterManagement";
import logo from "./../Images/logo/Thumbnail-01.png";
import BetaBanner from "./BetaBanner";
import { AdminProvider, useAdmin } from "../contexts/AdminContext";
import AdminDashboard from "../Admin/AdminDashboard";
import RecipeCookingSystem from "../Components/Recipes/RecipeCookingSystem";
import AdminPasswordModal from "../Admin/AdminPasswordModal";
import { LOCAL_HOST, RULE_BOOK_URL, WEBSITE } from "./const";
import DowntimeWrapper from "../Components/Downtime/DowntimeWrapper";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const isLocalhost = window.location.hostname === "localhost";

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const requestIdleCallback =
  window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

const UsernameEditor = ({ user, customUsername, onUsernameUpdate }) => {
  const { theme } = useTheme();
  const styles = createAppStyles(theme);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(customUsername || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(customUsername || user.user_metadata.full_name || "");
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(customUsername || "");
    setError("");
  };

  const validateUsername = (username) => {
    if (!username.trim()) {
      return "Username cannot be empty";
    }
    if (username.length < 2) {
      return "Username must be at least 2 characters";
    }
    if (username.length > 30) {
      return "Username must be less than 30 characters";
    }

    if (!/^[a-zA-Z0-9_\-.\s@+!#$%&*()[\]{}'",:;?=]+$/.test(username)) {
      return "Invalid characters in username";
    }
    return null;
  };

  const handleSave = async () => {
    const trimmedValue = editValue.trim();
    const validationError = validateUsername(trimmedValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data: existingUser } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("username", trimmedValue)
        .neq("discord_user_id", user.id)
        .maybeSingle();

      if (existingUser) {
        setError("Username is already taken");
        setIsLoading(false);
        return;
      }

      await onUsernameUpdate(trimmedValue);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update username. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayName =
    customUsername || user?.user_metadata?.full_name || "User";

  if (isEditing) {
    return (
      <div style={styles.usernameEditor}>
        <div>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            style={styles.usernameInput}
            placeholder="Enter username"
            maxLength={30}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            autoFocus
          />
          {error && (
            <div
              style={{ color: theme.error, fontSize: "12px", marginTop: "4px" }}
            >
              {error}
            </div>
          )}
        </div>
        <button
          onClick={handleSave}
          style={styles.saveButton}
          disabled={isLoading}
          title="Save username"
        >
          <Check size={14} />
        </button>
        <button
          onClick={handleCancel}
          style={styles.cancelButton}
          disabled={isLoading}
          title="Cancel"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div style={styles.username}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {displayName}
          <button
            onClick={handleEdit}
            style={styles.editButton}
            title="Edit username"
          >
            <Edit3 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AuthComponent = ({
  user,
  customUsername,
  onUsernameUpdate,
  onSignIn,
  onSignOut,
  isLoading,
  onAdminToggleClick,
}) => {
  const { theme } = useTheme();
  const { isUserAdmin, adminMode } = useAdmin();
  const styles = createAppStyles(theme);
  const navigate = useNavigate();

  if (user) {
    return (
      <div style={styles.authSection}>
        {(isUserAdmin || true) && (
          <button
            onClick={onAdminToggleClick}
            style={{
              ...styles.themeButton,
              backgroundColor: adminMode ? "#ffd700" : theme.surface,
              color: adminMode ? theme.secondary : theme.primary,
              border: adminMode
                ? "2px solid #ffaa00"
                : `1px solid ${theme.border}`,
              fontWeight: adminMode ? "bold" : "normal",

              transform: adminMode ? "scale(1.05)" : "scale(1)",
              transition: "all 0.2s ease",
              position: "relative",
              textShadow: adminMode ? "0 1px 2px rgba(0, 0, 0, 0.3)" : "none",
            }}
            title={
              isUserAdmin
                ? adminMode
                  ? "🔓 Admin Mode ACTIVE - Click to exit"
                  : "🔒 Enter Admin Mode"
                : "🔑 Unlock Admin Mode"
            }
          >
            {adminMode ? (
              <>
                <Shield size={16} />
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "6px",
                    height: "6px",
                    backgroundColor: "#ff0000",
                    borderRadius: "50%",
                    border: "1px solid white",
                  }}
                />
              </>
            ) : (
              <Key size={16} />
            )}
          </button>
        )}

        <button
          onClick={() => navigate("/theme-settings")}
          style={styles.themeButton}
          title="Theme Settings"
        >
          <Palette size={16} color={theme.primary} />
        </button>

        <div style={styles.userInfo}>
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              style={styles.userAvatar}
            />
          ) : (
            <div
              style={{
                ...styles.userAvatar,
                backgroundColor: theme.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={20} color={theme.secondary} />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <UsernameEditor
              user={user}
              customUsername={customUsername}
              onUsernameUpdate={onUsernameUpdate}
            />
            <button
              onClick={onSignOut}
              style={{
                ...styles.cancelButton,
                fontSize: "12px",
                padding: "4px 8px",
                alignSelf: "flex-start",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.authSection}>
      <button
        onClick={() => navigate("/theme-settings")}
        style={styles.themeButton}
        title="Theme Settings"
      >
        <Palette size={16} color={theme.primary} />
      </button>

      <button
        onClick={onSignIn}
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "0.25rem",
          fontWeight: "500",
          cursor: "pointer",
          transition: "background-color 0.2s",
          minWidth: "80px",
          backgroundColor: theme.primary,
          color: theme.text,
          opacity: isLoading ? 0.6 : 1,
        }}
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign in with Discord"}
      </button>
    </div>
  );
};

const Navigation = ({ characters }) => {
  const { theme } = useTheme();
  const { adminMode } = useAdmin();
  const styles = createAppStyles(theme);
  const navigate = useNavigate();
  const location = useLocation();

  const getVisibleTabs = () => {
    const baseTabs = [
      { path: "/", label: "Home", key: "home" },
      {
        path: "/character-management",
        label: "Character Management",
        key: "character-management",
      },
    ];

    if (characters.length > 0) {
      baseTabs.push({
        path: "/character/sheet",
        label: "Character Sheet",
        key: "character",
      });
    }

    if (adminMode) {
      return [
        ...baseTabs,
        {
          path: "/admin",
          label: "Admin Dashboard",
          key: "admin",
        },
      ];
    }

    return baseTabs;
  };

  const visibleTabs = getVisibleTabs();

  const isActiveTab = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    if (path === "/character/sheet") {
      return location.pathname.startsWith("/character/");
    }
    return location.pathname === path;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        marginRight: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          flexShrink: 0,
        }}
        onClick={() => navigate("/")}
        title="Home"
      >
        <img
          src={logo}
          alt="Witches & Snitches Logo"
          style={{
            height: "60px",
            width: "auto",
            transition: "opacity 0.2s ease",
            marginRight: "16px",
          }}
        />
      </div>

      <nav style={styles.tabNavigation}>
        {visibleTabs.map((tab) => {
          const isActive = isActiveTab(tab.path);
          const isAdminTab = tab.key === "admin";

          return (
            <button
              key={tab.key}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
                minWidth: "120px",

                ...(isActive
                  ? {
                      backgroundColor: theme.surface,
                      color: theme.text,
                      fontWeight: "600",
                      boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
                      border: `1px solid ${theme.border}`,
                    }
                  : {
                      backgroundColor: "transparent",
                      color: theme.text,
                      fontWeight: "400",
                      opacity: 0.85,
                    }),

                ...(isAdminTab && adminMode && isActive
                  ? {
                      backgroundColor: "#ffd700",
                      color: theme.primary,
                      fontWeight: "bold",
                    }
                  : isAdminTab && adminMode
                  ? {
                      backgroundColor: "#ffd70030",
                      color: theme.text,
                      opacity: 0.9,
                    }
                  : {}),
              }}
              onClick={() => navigate(tab.path)}
            >
              {isAdminTab && (
                <Shield size={16} style={{ marginRight: "6px" }} />
              )}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const CharacterSubNavigation = () => {
  const { theme } = useTheme();
  const { adminMode } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithAdminMode = (path) => {
    if (adminMode) {
      const separator = path.includes("?") ? "&" : "?";
      navigate(`${path}${separator}admin=true`);
    } else {
      navigate(path);
    }
  };

  const characterSubtabs = [
    { path: "/character/sheet", label: "Character Sheet", key: "sheet" },
    { path: "/character/spellbook", label: "Spellbook", key: "spellbook" },
    { path: "/character/potions", label: "Potions", key: "potions" },
    { path: "/character/recipes", label: "Recipes", key: "recipes" },
    { path: "/character/inventory", label: "Inventory", key: "inventory" },
    { path: "/character/gallery", label: "NPC Gallery", key: "gallery" },
    { path: "/character/downtime", label: "Downtime", key: "downtime" },
    { path: "/character/notes", label: "Notes", key: "notes" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      style={{
        borderBottom: `1px solid ${theme.border}`,
        backgroundColor: theme.background,
        padding: "0 20px",
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: "2px",
          margin: "0 auto",
          paddingTop: "8px",
        }}
      >
        {characterSubtabs.map((subtab) => {
          const active = isActive(subtab.path);

          return (
            <button
              key={subtab.key}
              style={{
                border: "none",
                borderRadius: "12px 12px 0 0",
                padding: "12px 18px 14px 18px",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                marginBottom: "-1px",
                minWidth: "130px",
                color: theme.primary,

                ...(active
                  ? {
                      background: `linear-gradient(135deg, ${theme.surface}, ${theme.surface}CC)`,
                      color: theme.text,
                      fontWeight: "700",
                      borderBottom: `4px solid ${theme.primary}`,
                      boxShadow: `
                    0 -4px 8px rgba(0, 0, 0, 0.1),
                    0 0 0 1px ${theme.border},
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `,
                      transform: "translateY(-2px)",
                      zIndex: 10,
                    }
                  : {
                      background: `linear-gradient(135deg, ${theme.background}40, ${theme.background}20)`,
                      color: theme.text,
                      fontWeight: "400",
                      borderBottom: "4px solid transparent",
                      transform: "translateY(0px)",
                    }),
              }}
              onClick={() => navigateWithAdminMode(subtab.path)}
            >
              {subtab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const HomePage = ({ user, customUsername, hasCharacters }) => {
  const { theme } = useTheme();
  const styles = createAppStyles(theme);
  const navigate = useNavigate();
  const displayName = customUsername || user?.user_metadata?.full_name;

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.homePage}>
      <div
        style={{ textAlign: "center", marginBottom: "3rem", color: theme.text }}
      >
        <BetaBanner />
        <h1>Welcome to Your D&D Character Manager</h1>
        {user ? (
          <p>Welcome back, {displayName}! Ready for your next adventure?</p>
        ) : (
          <p>
            Create characters, manage spells, and enhance your tabletop
            experience.
          </p>
        )}

        <div style={styles.featureGrid}>
          <a
            href={RULE_BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <div style={styles.featureCard}>
              <h3>View Rulebook</h3>
            </div>
          </a>
        </div>

        {hasCharacters && (
          <div style={styles.featureGrid}>
            <div
              style={styles.featureCard}
              onClick={() => handleCardClick("/character/sheet")}
            >
              <h3>Character Sheet</h3>
              <p>View and manage your character's stats and abilities.</p>
            </div>
          </div>
        )}
        <hr
          style={{ border: `1px solid ${theme.border}`, marginBottom: "16px" }}
        />
        <div
          style={styles.featureCard}
          onClick={() => handleCardClick("/character-management")}
        >
          <h3>Character Management</h3>
          <p>Build, edit, and manage your D&D characters.</p>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ user, children, fallback }) => {
  const { theme } = useTheme();

  if (!user) {
    return (
      fallback || (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
            minHeight: "300px",
            backgroundColor: theme.surface,
            borderRadius: "12px",
            border: `2px solid ${theme.border}`,
            margin: "20px",
          }}
        >
          <h2 style={{ color: theme.text, marginBottom: "1rem" }}>
            Authentication Required
          </h2>
          <p style={{ color: theme.textSecondary }}>
            Please sign in with Discord to access this feature.
          </p>
        </div>
      )
    );
  }
  return children;
};

function AppContent() {
  const { theme } = useTheme();
  const styles = createAppStyles(theme);
  const location = useLocation();
  const navigate = useNavigate();
  const { adminMode, setAdminMode, isUserAdmin, setIsUserAdmin } = useAdmin();

  const [user, setUser] = useState(null);
  const [customUsername, setCustomUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const [characters, setCharacters] = useState([]);
  const [charactersLoading, setCharactersLoading] = useState(false);
  const [charactersError, setCharactersError] = useState(null);
  const [initialCharacterId, setInitialCharacterId] = useState(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [isInitializing, setIsInitializing] = useState(true);
  const initTimeoutRef = useRef(null);

  const getInitialSelectedCharacter = () => {
    try {
      const savedCharacterId = sessionStorage.getItem("selectedCharacterId");
      if (savedCharacterId) {
        setInitialCharacterId(savedCharacterId);
        return { id: savedCharacterId };
      }
    } catch (error) {
      console.error("Error reading from sessionStorage:", error);
    }
    return null;
  };
  const [selectedCharacter, setSelectedCharacter] = useState(
    getInitialSelectedCharacter
  );

  const loadingRef = useRef(false);
  const { setSelectedCharacter: setThemeSelectedCharacter } = useTheme();
  const discordUserId = user?.user_metadata?.provider_id;

  const debouncedSelectCharacter = useMemo(
    () =>
      debounce((character) => {
        setSelectedCharacter(character);
        if (character) {
          sessionStorage.setItem(
            "selectedCharacterId",
            character.id.toString()
          );
        } else {
          sessionStorage.removeItem("selectedCharacterId");
        }
      }, 100),
    []
  );

  const prevSelectedCharacterRef = useRef();
  useEffect(() => {
    if (prevSelectedCharacterRef.current !== selectedCharacter) {
      setThemeSelectedCharacter(selectedCharacter);
      prevSelectedCharacterRef.current = selectedCharacter;
    }
  }, [selectedCharacter, setThemeSelectedCharacter]);

  const resetSelectedCharacter = (newCharacter = null) => {
    if (newCharacter) {
      debouncedSelectCharacter(newCharacter);
    } else {
      setSelectedCharacter(null);
      setThemeSelectedCharacter(null);
      sessionStorage.removeItem("selectedCharacterId");
    }
  };

  const handleAdminToggleClick = () => {
    if (adminMode) {
      setAdminMode(false);
      return;
    }

    if (isUserAdmin) {
      setAdminMode(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = async (password) => {
    setIsVerifying(true);

    try {
      const discordUserId = user?.user_metadata?.provider_id;

      await characterService.verifyAdminPassword(discordUserId, password);

      setIsUserAdmin(true);

      setAdminMode(true);

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

  const selectInitialCharacter = useCallback(
    (characters) => {
      if (!characters.length) return;

      const savedCharacterId =
        sessionStorage.getItem("selectedCharacterId") || initialCharacterId;
      let characterToSelect = null;

      if (
        selectedCharacter &&
        characters.find(
          (c) => c.id.toString() === selectedCharacter.id.toString()
        )
      ) {
        characterToSelect = characters.find(
          (c) => c.id.toString() === selectedCharacter.id.toString()
        );
      } else if (savedCharacterId) {
        characterToSelect = characters.find(
          (char) => char.id.toString() === savedCharacterId.toString()
        );
      }

      if (!characterToSelect && characters.length > 0) {
        characterToSelect = characters[0];
      }

      if (
        characterToSelect &&
        (!selectedCharacter || selectedCharacter.id !== characterToSelect.id)
      ) {
        debouncedSelectCharacter(characterToSelect);
        setInitialCharacterId(null);
      }

      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }

      initTimeoutRef.current = setTimeout(() => {
        setIsInitializing(false);
      }, 1000);
    },
    [selectedCharacter, initialCharacterId, debouncedSelectCharacter]
  );

  const loadCustomUsername = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("username")
        .eq("discord_user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setCustomUsername(data.username || "");
      } else if (error && error.code !== "PGRST116") {
        console.error("Error loading custom username:", error);
      }
    } catch (error) {
      console.error("Error loading custom username:", error);
    }
  }, [user]);

  const loadCharacters = useCallback(async () => {
    if (!discordUserId || (loadingRef.current && !adminMode)) {
      return;
    }
    loadingRef.current = true;
    setCharactersLoading(true);
    setCharactersError(null);

    try {
      const loadOperations = [
        adminMode && isUserAdmin
          ? characterService.getAllCharacters()
          : characterService.getCharacters(discordUserId),
      ];

      if (!customUsername && user) {
        loadOperations.push(loadCustomUsername());
      }

      const [charactersData] = await Promise.all(loadOperations);

      const transformedCharacters = charactersData.map((char) => ({
        id: char.id,
        abilityScores: char.ability_scores,
        asiChoices: char.asi_choices || {},
        background: char.background,
        backgroundSkills: char.background_skills || [],
        heritageChoices: char.heritage_choices || {},
        innateHeritageSkills: char.innate_heritage_skills || [],
        castingStyle: char.casting_style,
        createdAt: char.created_at,
        gameSession: char.game_session,
        hitPoints: char.hit_points,
        house: char.house,
        houseChoices: char.house_choices || {},
        initiativeAbility: char.initiative_ability || "dexterity",
        innateHeritage: char.innate_heritage,
        level: char.level,
        level1ChoiceType: char.level1_choice_type || "",
        name: char.name,
        schoolYear: char.school_year || null,
        skillProficiencies: char.skill_proficiencies || [],
        skillExpertise: char.skill_expertise || [],
        standardFeats: char.standard_feats || [],
        subclass: char.subclass,
        subclassChoices: char.subclass_choices || {},
        wandType: char.wand_type || "",
        magicModifiers: char.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },

        discord_user_id: char.discord_user_id,
        ownerInfo: char.discord_users
          ? {
              username: char.discord_users.username,
              displayName: char.discord_users.display_name,
            }
          : null,
      }));

      const sortedCharacters = transformedCharacters.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      setCharacters(sortedCharacters);

      requestIdleCallback(() => {
        selectInitialCharacter(sortedCharacters);
      });

      setHasAttemptedLoad(true);
    } catch (err) {
      setCharactersError("Failed to load characters: " + err.message);
      console.error("Error loading characters:", err);
      setHasAttemptedLoad(true);
    } finally {
      setCharactersLoading(false);
      loadingRef.current = false;
    }
  }, [
    discordUserId,
    adminMode,
    isUserAdmin,
    customUsername,
    user,
    selectInitialCharacter,
    loadCustomUsername,
  ]);

  useEffect(() => {
    if (discordUserId) {
      setHasAttemptedLoad(false);
    }
  }, [adminMode, discordUserId]);

  useEffect(() => {
    if (discordUserId && !hasAttemptedLoad && !charactersLoading) {
      requestIdleCallback(() => {
        loadCharacters();
      });
    }
  }, [discordUserId, hasAttemptedLoad, charactersLoading, loadCharacters]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      requestIdleCallback(() => {
        loadCustomUsername();
      });
      setHasAttemptedLoad(false);
    } else {
      setCustomUsername("");
      setCharacters([]);
      setSelectedCharacter(null);
      setThemeSelectedCharacter(null);
      setHasAttemptedLoad(false);
      sessionStorage.removeItem("selectedCharacterId");
    }
  }, [user, loadCustomUsername, setThemeSelectedCharacter]);

  useEffect(() => {
    if (location.pathname === "/character") {
      navigate("/character/sheet", { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (
      location.pathname.startsWith("/character/") &&
      characters.length === 0 &&
      !charactersLoading &&
      !loading &&
      user &&
      hasAttemptedLoad
    ) {
      navigate("/", { replace: true });
    }
  }, [
    location.pathname,
    characters.length,
    charactersLoading,
    loading,
    navigate,
    user,
    hasAttemptedLoad,
  ]);

  const handleCharacterChange = useCallback(
    (character) => {
      if (isInitializing) {
        return;
      }

      debouncedSelectCharacter(character);
    },
    [debouncedSelectCharacter, isInitializing]
  );

  useEffect(() => {
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, []);

  const updateCustomUsername = async (newUsername) => {
    if (!user) return;

    try {
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("discord_user_id", user.id)
        .maybeSingle();

      if (existingProfile) {
        const { error } = await supabase
          .from("user_profiles")
          .update({
            username: newUsername,
            updated_at: new Date().toISOString(),
          })
          .eq("discord_user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_profiles").insert([
          {
            discord_user_id: user.id,
            username: newUsername,
            discord_name: user.user_metadata.full_name,
            avatar_url: user.user_metadata.avatar_url,
          },
        ]);

        if (error) throw error;
      }

      setCustomUsername(newUsername);
    } catch (error) {
      console.error("Error updating custom username:", error);
      throw error;
    }
  };

  const signInWithDiscord = async () => {
    try {
      setAuthLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: isLocalhost ? LOCAL_HOST : WEBSITE,
        },
      });

      if (error) {
        console.error("Error signing in:", error);
        alert("Failed to sign in: " + error.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred while signing in");
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setAuthLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error signing out:", error);
        alert("Failed to sign out: " + error.message);
      } else {
        setUser(null);
        setCustomUsername("");
        setCharacters([]);
        setSelectedCharacter(null);
        setThemeSelectedCharacter(null);
        sessionStorage.removeItem("selectedCharacterId");
        navigate("/");
      }
    } catch (err) {
      console.error("Unexpected error during sign out:", err);
      alert("An unexpected error occurred while signing out");
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.appContainer}>
        <div style={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  const characterSelector = (
    <CharacterSelector
      user={user}
      characters={characters}
      selectedCharacter={selectedCharacter}
      onCharacterChange={handleCharacterChange}
      isLoading={charactersLoading || isInitializing}
      error={charactersError}
      adminMode={adminMode}
    />
  );

  return (
    <div style={styles.appContainer}>
      <ThemeCharacterSync selectedCharacter={selectedCharacter} />

      <header style={styles.appHeader}>
        <Navigation characters={characters} user={user} />
        <AuthComponent
          user={user}
          customUsername={customUsername}
          onUsernameUpdate={updateCustomUsername}
          onSignIn={signInWithDiscord}
          onSignOut={signOut}
          isLoading={authLoading}
          onAdminToggleClick={handleAdminToggleClick}
        />
      </header>

      {location.pathname.startsWith("/character/") && (
        <CharacterSubNavigation />
      )}

      <main style={styles.tabContent}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                user={user}
                customUsername={customUsername}
                hasCharacters={characters.length > 0}
              />
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route
            path="/character-management"
            element={
              <ProtectedRoute user={user}>
                <CharacterManagement
                  user={user}
                  customUsername={customUsername}
                  onCharacterSaved={() => {
                    setHasAttemptedLoad(false);
                  }}
                  selectedCharacterId={selectedCharacter?.id}
                  onSelectedCharacterReset={resetSelectedCharacter}
                  supabase={supabase}
                  adminMode={adminMode}
                  isUserAdmin={isUserAdmin}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/character"
            element={<Navigate to="/character/sheet" replace />}
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user}>
                <AdminDashboard supabase={supabase} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/character/sheet"
            element={
              <ProtectedRoute user={user}>
                {characterSelector}
                <CharacterSheet
                  user={user}
                  customUsername={customUsername}
                  supabase={supabase}
                  selectedCharacter={selectedCharacter}
                  characters={characters}
                  adminMode={adminMode}
                  isUserAdmin={isUserAdmin}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/character/spellbook"
            element={
              <ProtectedRoute user={user}>
                {characterSelector}
                <SpellBook
                  user={user}
                  customUsername={customUsername}
                  supabase={supabase}
                  selectedCharacter={selectedCharacter}
                  characters={characters}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/character/potions"
            element={
              <ProtectedRoute user={user}>
                {characterSelector}
                <PotionBrewingSystem
                  user={user}
                  character={selectedCharacter}
                  supabase={supabase}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/character/recipes"
            element={
              <ProtectedRoute user={user}>
                {characterSelector}
                <RecipeCookingSystem
                  user={user}
                  selectedCharacter={selectedCharacter}
                  supabase={supabase}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/character/inventory"
            element={
              <ProtectedRoute user={user}>
                {characterSelector}
                <Inventory
                  user={user}
                  selectedCharacter={selectedCharacter}
                  supabase={supabase}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/character/notes"
            element={
              <ProtectedRoute user={user}>
                {characterSelector}
                <CharacterNotes
                  user={user}
                  selectedCharacter={selectedCharacter}
                  supabase={supabase}
                  adminMode={adminMode}
                  isUserAdmin={isUserAdmin}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/character/downtime"
            element={
              <ProtectedRoute user={user}>
                {characterSelector}
                <DowntimeWrapper
                  user={user}
                  selectedCharacter={selectedCharacter}
                  supabase={supabase}
                  adminMode={adminMode}
                  isUserAdmin={isUserAdmin}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/character/gallery"
            element={
              <ProtectedRoute user={user}>
                {characterSelector}
                <CharacterGallery
                  selectedCharacter={selectedCharacter}
                  supabase={supabase}
                  user={user}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/theme-settings" element={<ThemeSettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AdminPasswordModal
        isOpen={showPasswordModal}
        onClose={handleModalClose}
        onPasswordSubmit={handlePasswordSubmit}
        isLoading={isVerifying}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <RollModalProvider>
        <ThemeProvider>
          <AdminProviderWrapper />
        </ThemeProvider>
      </RollModalProvider>
    </Router>
  );
}

function AdminProviderWrapper() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AdminProvider user={user}>
      <AppContent />
    </AdminProvider>
  );
}

export default App;
