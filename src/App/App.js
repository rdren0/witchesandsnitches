import ThemeCharacterSync from "../Components/ThemeCharacterSync/ThemeCharacterSync";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Edit3, Check, X, User, Palette } from "lucide-react";
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
import DowntimeSheet from "../Components/Downtime/DowntimeSheet";
import PotionBrewingSystem from "../Components/Potions/Potions";
import Inventory from "../Components/Inventory/Inventory";
import CharacterManagement from "../Components/CharacterManagement/CharacterManagement";
import logo from "./../Images/logo/Thumbnail-01.png";
import BetaBanner from "./BetaBanner";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);
const isLocalhost = window.location.hostname === "localhost";

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
    // eslint-disable-next-line
    if (!/^[a-zA-Z0-9_\-\.\s@\+!#\$%&\*\(\)\[\]\{\}'",:;?=]+$/.test(username)) {
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
}) => {
  const { theme } = useTheme();
  const styles = createAppStyles(theme);
  const navigate = useNavigate();

  if (user) {
    return (
      <div style={styles.authSection}>
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
              <User size={20} color="white" />
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
          backgroundColor: "#5865f2",
          color: "white",
          opacity: isLoading ? 0.6 : 1,
        }}
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign in with Discord"}
      </button>
    </div>
  );
};

const Navigation = ({ characters, user }) => {
  const { theme } = useTheme();
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
      return [
        ...baseTabs,
        {
          path: "/character/sheet",
          label: "Character Sheet",
          key: "character",
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
        gap: "20px",
        width: "100%",
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
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = "0.8";
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = "1";
          }}
        />
      </div>

      <nav style={styles.tabNavigation}>
        {visibleTabs.map((tab) => {
          const isActive = isActiveTab(tab.path);

          return (
            <button
              key={tab.key}
              style={{
                ...styles.tabButton,
                ...(isActive ? styles.tabButtonActive : {}),
              }}
              onClick={() => navigate(tab.path)}
            >
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
  const navigate = useNavigate();
  const location = useLocation();

  const characterSubtabs = [
    { path: "/character/sheet", label: "Character Sheet", key: "sheet" },
    { path: "/character/spellbook", label: "Spellbook", key: "spellbook" },
    { path: "/character/potions", label: "Potions", key: "potions" },
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
          gap: "4px",
          maxWidth: "1200px",
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
                background: active ? theme.surface : "transparent",
                border: "none",
                borderRadius: "8px 8px 0 0",
                padding: "10px 16px 12px 16px",
                fontSize: "14px",
                fontWeight: active ? "600" : "500",
                color: active ? theme.text : theme.textSecondary,
                cursor: "pointer",
                transition: "all 0.2s ease",
                position: "relative",
                marginBottom: "-1px",
                borderBottom: active
                  ? `2px solid ${theme.primary}`
                  : "2px solid transparent",
                minWidth: "120px",
              }}
              onClick={() => navigate(subtab.path)}
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

        {hasCharacters && (
          <>
            <div style={styles.featureGrid}>
              <div
                style={styles.featureCard}
                onClick={() => handleCardClick("/character/sheet")}
              >
                <h3>Character Sheet</h3>
                <p>View and manage your character's stats and abilities.</p>
              </div>
            </div>
          </>
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

  const [user, setUser] = useState(null);
  const [customUsername, setCustomUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const [characters, setCharacters] = useState([]);
  const [charactersLoading, setCharactersLoading] = useState(false);
  const [charactersError, setCharactersError] = useState(null);
  const [initialCharacterId, setInitialCharacterId] = useState(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  const loadingRef = useRef(false);

  const { setSelectedCharacter: setThemeSelectedCharacter } = useTheme();

  const discordUserId = user?.user_metadata?.provider_id;

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

  useEffect(() => {
    setThemeSelectedCharacter(selectedCharacter);
  }, [selectedCharacter, setThemeSelectedCharacter]);

  const resetSelectedCharacter = (newCharacter = null) => {
    if (newCharacter) {
      setSelectedCharacter(newCharacter);
      setThemeSelectedCharacter(newCharacter);
    } else {
      setSelectedCharacter(null);
      setThemeSelectedCharacter(null);
      sessionStorage.removeItem("selectedCharacterId");
    }
  };

  const loadCharacters = useCallback(async () => {
    if (!discordUserId || loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    setCharactersLoading(true);
    setCharactersError(null);

    try {
      const charactersData = await characterService.getCharacters(
        discordUserId
      );

      const transformedCharacters = charactersData.map((char) => ({
        id: char.id,
        abilityScores: char.ability_scores,
        asiChoices: char.asi_choices || {},
        background: char.background,
        castingStyle: char.casting_style,
        createdAt: char.created_at,
        gameSession: char.game_session,
        hitPoints: char.hit_points,
        house: char.house,
        initiativeAbility: char.initiative_ability || "dexterity",
        innateHeritage: char.innate_heritage,
        level: char.level,
        level1ChoiceType: char.level1_choice_type || "",
        name: char.name,
        skillProficiencies: char.skill_proficiencies || [],
        skillExpertise: char.skill_expertise || [],
        standardFeats: char.standard_feats || [],
        subclass: char.subclass,
        wandType: char.wand_type || "",
        magicModifiers: char.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },
      }));

      const sortedCharacters = transformedCharacters.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      setCharacters(sortedCharacters);

      const savedCharacterId =
        sessionStorage.getItem("selectedCharacterId") || initialCharacterId;

      let characterToSelect = null;

      if (
        selectedCharacter &&
        sortedCharacters.find(
          (c) => c.id.toString() === selectedCharacter.id.toString()
        )
      ) {
        characterToSelect = sortedCharacters.find(
          (c) => c.id.toString() === selectedCharacter.id.toString()
        );
      } else if (savedCharacterId) {
        characterToSelect = sortedCharacters.find(
          (char) => char.id.toString() === savedCharacterId.toString()
        );
      }

      if (!characterToSelect && sortedCharacters.length > 0) {
        characterToSelect = sortedCharacters[0];
      }

      if (
        characterToSelect &&
        (!selectedCharacter || selectedCharacter.id !== characterToSelect.id)
      ) {
        setSelectedCharacter(characterToSelect);
        setThemeSelectedCharacter(characterToSelect);
        sessionStorage.setItem(
          "selectedCharacterId",
          characterToSelect.id.toString()
        );
        setInitialCharacterId(null);
      } else if (characterToSelect) {
        sessionStorage.setItem(
          "selectedCharacterId",
          characterToSelect.id.toString()
        );
      }

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
    selectedCharacter,
    initialCharacterId,
    setThemeSelectedCharacter,
  ]);

  useEffect(() => {
    if (discordUserId && !hasAttemptedLoad && !charactersLoading) {
      loadCharacters();
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
      loadCustomUsername();
      setHasAttemptedLoad(false);
    } else {
      setCustomUsername("");
      setCharacters([]);
      setSelectedCharacter(null);
      setThemeSelectedCharacter(null);
      setHasAttemptedLoad(false);
      sessionStorage.removeItem("selectedCharacterId");
    }
    // eslint-disable-next-line
  }, [user]);

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

  const handleCharacterChange = (character) => {
    setSelectedCharacter(character);
    setThemeSelectedCharacter(character);

    if (character) {
      sessionStorage.setItem("selectedCharacterId", character.id.toString());
    } else {
      sessionStorage.removeItem("selectedCharacterId");
    }
  };

  const loadCustomUsername = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("username")
        .eq("discord_user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setCustomUsername(data.username || "");
      } else if (error) {
        console.error("Error loading custom username:", error);
      }
    } catch (error) {
      console.error("Error loading custom username:", error);
    }
  };

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
          redirectTo: isLocalhost
            ? "http://localhost:3000"
            : "https://witchesandsnitches.com",
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
      isLoading={charactersLoading}
      error={charactersError}
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
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/character"
            element={<Navigate to="/character/sheet" replace />}
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
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/character/downtime"
            element={
              <ProtectedRoute user={user}>
                {characterSelector}
                <DowntimeSheet />
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
    </div>
  );
}

function App() {
  return (
    <Router>
      <RollModalProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </RollModalProvider>
    </Router>
  );
}

export default App;
