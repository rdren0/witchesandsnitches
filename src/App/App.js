import React, { useState, useEffect } from "react";
import { Edit3, Check, X, User } from "lucide-react";

import { createClient } from "@supabase/supabase-js";
import SpellBook from "../Components/SpellBooks/SpellBook";
import CharacterCreationForm from "../Components/CharacterCreationForm/CharacterCreationForm";
import { styles } from "./style";

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
            onMouseEnter={(e) => {
              Object.assign(e.target.style, styles.editButtonHover);
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#6c757d";
              e.target.style.backgroundColor = "transparent";
            }}
            title="Edit username"
          >
            <Edit3 size={14} />
          </button>
        </div>
        {customUsername && (
          <div style={styles.discordName}>
            Discord: {user?.user_metadata?.full_name}
          </div>
        )}
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
          <UsernameEditor
            user={user}
            customUsername={customUsername}
            onUsernameUpdate={onUsernameUpdate}
          />
        </div>
        <button
          onClick={onSignOut}
          style={{
            ...styles.authButton,
            ...styles.signoutButton,
            ...(isLoading ? styles.authButtonDisabled : {}),
          }}
          disabled={isLoading}
          onMouseEnter={(e) => {
            if (!isLoading) {
              Object.assign(e.target.style, styles.signoutButtonHover);
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              Object.assign(e.target.style, styles.signoutButton);
            }
          }}
        >
          {isLoading ? "Signing Out..." : "Sign Out"}
        </button>
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
        onMouseEnter={(e) => {
          if (!isLoading) {
            Object.assign(e.target.style, styles.signinButtonHover);
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            Object.assign(e.target.style, styles.signinButton);
          }
        }}
      >
        {isLoading ? "Signing In..." : "Sign in with Discord"}
      </button>
    </div>
  );
};

const HomePage = ({ user, customUsername, onTabChange }) => {
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

  useEffect(() => {
    console.log("Setting up auth listener");

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(
        "Auth event:",
        event,
        session?.user?.email,
        new Date().toISOString()
      );
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      console.log("Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      loadCustomUsername();
    } else {
      setCustomUsername("");
    }
    // eslint-disable-next-line
  }, [user]);

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
      // If data is null, user has no profile yet - that's fine, keep empty username
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
      console.log("Initiating Discord sign in...");

      const isLocalhost = window.location.hostname === "localhost";

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: isLocalhost
            ? "http://localhost:3000"
            : "https://your-production-domain.com",
        },
      });

      if (error) {
        console.error("Error signing in:", error);
        alert("Failed to sign in: " + error.message);
      } else {
        console.log("Sign in initiated:", data);
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
      console.log("Attempting to sign out...");

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error signing out:", error);
        alert("Failed to sign out: " + error.message);
      } else {
        console.log("Successfully signed out");
        setUser(null);
        setCustomUsername("");
        setActiveTab("home");
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
          />
        );
      case "character-creation":
        return (
          <ProtectedRoute user={user}>
            <CharacterCreationForm
              user={user}
              customUsername={customUsername}
            />
          </ProtectedRoute>
        );
      case "spellbook":
        return (
          <ProtectedRoute user={user}>
            <SpellBook
              customUsername={customUsername}
              supabase={supabase}
              user={user}
            />
          </ProtectedRoute>
        );
      default:
        return (
          <HomePage
            user={user}
            customUsername={customUsername}
            onTabChange={setActiveTab}
          />
        );
    }
  };

  if (loading) {
    return (
      <div style={styles.appContainer}>
        <div style={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      <header style={styles.appHeader}>
        <nav style={styles.tabNavigation}>
          {["home", "character-creation", "spellbook"].map((tab) => (
            <button
              key={tab}
              style={{
                ...styles.tabButton,
                ...(activeTab === tab ? styles.tabButtonActive : {}),
              }}
              onClick={() => setActiveTab(tab)}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  Object.assign(e.target.style, styles.tabButtonHover);
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  Object.assign(e.target.style, styles.tabButton);
                }
              }}
            >
              {tab === "home"
                ? "Home"
                : tab === "character-creation"
                ? "Character Creation"
                : "SpellBook"}
            </button>
          ))}
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
