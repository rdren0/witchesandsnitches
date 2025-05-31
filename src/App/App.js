import { useState, useEffect, useRef, useCallback } from "react";
import { Edit3, Check, X, User } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { characterService } from "../services/characterService";
import SpellBook from "../Components/SpellBook/SpellBook";
import CharacterCreationForm from "../Components/CharacterCreationForm/CharacterCreationForm";
import CharacterSheet from "../Components/CharacterSheet/CharacterSheet";
import { CharacterNotes } from "../Components/CharacterNotes/CharacterNotes";
import { styles } from "./style";
import { CharacterSelector } from "./CharacterSelector";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const UsernameEditor = ({ user, customUsername, onUsernameUpdate }) => {
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
    if (!/^[a-zA-Z0-9_\-\s]+$/.test(username)) {
      return "Username can only contain letters, numbers, spaces, hyphens, and underscores";
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
          {error && <div style={styles.errorMessage}>{error}</div>}
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
  if (user) {
    return (
      <div style={styles.authSection}>
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
                backgroundColor: "#007bff",
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
                ...styles.authButton,
                ...styles.signoutButton,
                ...(isLoading ? styles.authButtonDisabled : {}),
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
        onClick={onSignIn}
        style={{
          ...styles.authButton,
          ...styles.signinButton,
          ...(isLoading ? styles.authButtonDisabled : {}),
        }}
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign in with Discord"}
      </button>
    </div>
  );
};

const HomePage = ({ user, customUsername, onTabChange, hasCharacters }) => {
  const displayName = customUsername || user?.user_metadata?.full_name;

  const handleCardClick = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div style={styles.homePage}>
      <div style={styles.heroSection}>
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
          <div
            style={styles.featureCard}
            onClick={() => handleCardClick("character-creation")}
          >
            <h3>Character Creation</h3>
            <p>Build and customize your D&D characters.</p>
          </div>

          {!hasCharacters && (
            <div
              style={{
                ...styles.featureCard,
                backgroundColor: "#f8fafc",
                border: "2px dashed #cbd5e1",
                cursor: "default",
                opacity: 0.7,
              }}
            >
              <h3 style={{ color: "#64748b" }}>More Features Coming Soon</h3>
              <p style={{ color: "#64748b" }}>
                Create your first character to unlock Character Sheets, Spell
                Management, and Character Notes!
              </p>
            </div>
          )}
        </div>

        {hasCharacters && (
          <>
            <div style={styles.featureGrid}>
              <div
                style={styles.featureCard}
                onClick={() => handleCardClick("character-sheet")}
              >
                <h3>Character Sheet</h3>
                <p>View and manage your character's stats and abilities.</p>
              </div>
              <div
                style={styles.featureCard}
                onClick={() => handleCardClick("spellbook")}
              >
                <h3>Spell Management</h3>
                <p>
                  Browse, search, and organize spells for your spellcasting
                  characters.
                </p>
              </div>
            </div>
            <div style={styles.featureGrid}>
              <div
                style={styles.featureCard}
                onClick={() => handleCardClick("character-notes")}
              >
                <h3>Character Notes</h3>
                <p>
                  Keep detailed notes about your character's story,
                  relationships, and development.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ProtectedRoute = ({ user, children, fallback }) => {
  if (!user) {
    return (
      fallback || (
        <div style={styles.authRequired}>
          <h2 style={styles.authRequiredH2}>Authentication Required</h2>
          <p style={styles.authRequiredP}>
            Please sign in with Discord to access this feature.
          </p>
        </div>
      )
    );
  }
  return children;
};

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [customUsername, setCustomUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const [characters, setCharacters] = useState([]);
  const [charactersLoading, setCharactersLoading] = useState(false);
  const [charactersError, setCharactersError] = useState(null);
  const [initialCharacterId, setInitialCharacterId] = useState(null);
  const loadingRef = useRef(false);

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
        name: char.name,
        house: char.house,
        castingStyle: char.casting_style,
        subclass: char.subclass,
        innateHeritage: char.innate_heritage,
        background: char.background,
        gameSession: char.game_session,
        level: char.level,
        hitPoints: char.hit_points,
        abilityScores: char.ability_scores,
        magicModifiers: char.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },
        standardFeats: char.standard_feats || [],
        skillProficiencies: char.skill_proficiencies || [],
        wandType: char.wand_type || "",
        createdAt: char.created_at,
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
      } else {
        console.log("❌ No character to select");
      }
    } catch (err) {
      setCharactersError("Failed to load characters: " + err.message);
      console.error("Error loading characters:", err);
    } finally {
      setCharactersLoading(false);
      loadingRef.current = false;
    }
  }, [discordUserId, selectedCharacter, initialCharacterId]);

  useEffect(() => {
    if (discordUserId && characters.length === 0 && !charactersLoading) {
      loadCharacters();
    }
  }, [discordUserId, loadCharacters, characters.length, charactersLoading]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
      loadCharacters();
    } else {
      setCustomUsername("");
      setCharacters([]);
      setSelectedCharacter(null);
      sessionStorage.removeItem("selectedCharacterId");
    }
    // eslint-disable-next-line
  }, [user]);

  const refreshCharacters = () => {
    loadCharacters();
  };

  const handleCharacterChange = (character) => {
    setSelectedCharacter(character);

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
      const isLocalhost = window.location.hostname === "localhost";

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
      } else {
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
        setActiveTab("home");
        sessionStorage.removeItem("selectedCharacterId");
      }
    } catch (err) {
      console.error("Unexpected error during sign out:", err);
      alert("An unexpected error occurred while signing out");
    } finally {
      setAuthLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomePage
            user={user}
            customUsername={customUsername}
            onTabChange={setActiveTab}
            hasCharacters={characters.length > 0}
          />
        );
      case "character-creation":
        return (
          <ProtectedRoute user={user}>
            <CharacterCreationForm
              user={user}
              customUsername={customUsername}
              onCharacterSaved={refreshCharacters}
            />
          </ProtectedRoute>
        );
      case "character-sheet":
        return (
          <ProtectedRoute user={user}>
            <CharacterSelector
              user={user}
              characters={characters}
              selectedCharacter={selectedCharacter}
              onCharacterChange={handleCharacterChange}
              isLoading={charactersLoading}
              error={charactersError}
            />
            <CharacterSheet
              user={user}
              customUsername={customUsername}
              supabase={supabase}
              selectedCharacter={selectedCharacter}
              characters={characters}
            />
          </ProtectedRoute>
        );
      case "character-notes":
        return (
          <ProtectedRoute user={user}>
            <CharacterSelector
              user={user}
              characters={characters}
              selectedCharacter={selectedCharacter}
              onCharacterChange={handleCharacterChange}
              isLoading={charactersLoading}
              error={charactersError}
            />
            <CharacterNotes
              user={user}
              selectedCharacter={selectedCharacter}
              supabase={supabase}
            />
          </ProtectedRoute>
        );
      case "spellbook":
        return (
          <ProtectedRoute user={user}>
            <CharacterSelector
              user={user}
              characters={characters}
              selectedCharacter={selectedCharacter}
              onCharacterChange={handleCharacterChange}
              isLoading={charactersLoading}
              error={charactersError}
            />
            <SpellBook
              user={user}
              customUsername={customUsername}
              supabase={supabase}
              selectedCharacter={selectedCharacter}
              characters={characters}
            />
          </ProtectedRoute>
        );
      default:
        return (
          <HomePage
            user={user}
            customUsername={customUsername}
            onTabChange={setActiveTab}
            hasCharacters={characters.length > 0}
          />
        );
    }
  };

  const getVisibleTabs = () => {
    const baseTabs = ["home", "character-creation"];

    if (characters.length > 0) {
      return [...baseTabs, "character-sheet", "spellbook", "character-notes"];
    }

    return baseTabs;
  };

  useEffect(() => {
    const visibleTabs = getVisibleTabs();
    if (!visibleTabs.includes(activeTab)) {
      setActiveTab("home");
    }
    // eslint-disable-next-line
  }, [characters.length, activeTab]);

  if (loading) {
    return (
      <div style={styles.appContainer}>
        <div style={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  const visibleTabs = getVisibleTabs();

  return (
    <div style={styles.appContainer}>
      <header style={styles.appHeader}>
        <nav style={styles.tabNavigation}>
          {visibleTabs.map((tab) => {
            const tabLabels = {
              home: "Home",
              "character-creation": "Character Creation",
              "character-sheet": "Character Sheet",
              "character-notes": "Character Notes",
              spellbook: "SpellBook",
            };

            return (
              <button
                key={tab}
                style={{
                  ...styles.tabButton,
                  ...(activeTab === tab ? styles.tabButtonActive : {}),
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tabLabels[tab]}
              </button>
            );
          })}
        </nav>
        <AuthComponent
          user={user}
          customUsername={customUsername}
          onUsernameUpdate={updateCustomUsername}
          onSignIn={signInWithDiscord}
          onSignOut={signOut}
          isLoading={authLoading}
        />
      </header>
      <main style={styles.tabContent}>{renderContent()}</main>
    </div>
  );
}

export default App;
