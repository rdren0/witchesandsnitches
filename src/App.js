import React, { useState, useEffect } from "react";
import { Edit3, Check, X, User } from "lucide-react";

import { spellsData } from "./spells";
import { createClient } from "@supabase/supabase-js";
import SpellBook from "./Components/SpellBooks/SpellBook";
import CharacterCreationForm from "./Components/CharacterCreationForm/CharacterCreationForm";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const useStyles = () => {
  return {
    appContainer: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    appHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem",
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #dee2e6",
    },
    tabNavigation: {
      display: "flex",
      gap: "0.5rem",
    },
    tabButton: {
      padding: "0.5rem 1rem",
      border: "1px solid #dee2e6",
      borderRadius: "0.25rem",
      backgroundColor: "#fff",
      color: "#495057",
      cursor: "pointer",
      transition: "all 0.2s",
      fontWeight: "500",
    },
    tabButtonActive: {
      backgroundColor: "#007bff",
      color: "#fff",
      borderColor: "#007bff",
    },
    tabButtonHover: {
      backgroundColor: "#e9ecef",
      borderColor: "#adb5bd",
    },
    authSection: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      position: "relative",
    },
    userAvatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      border: "2px solid #007bff",
    },
    username: {
      fontWeight: "500",
      color: "#333",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    editButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "2px",
      borderRadius: "3px",
      color: "#6c757d",
      transition: "color 0.2s",
    },
    editButtonHover: {
      color: "#007bff",
      backgroundColor: "#f8f9fa",
    },
    usernameEditor: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    usernameInput: {
      padding: "4px 8px",
      border: "1px solid #dee2e6",
      borderRadius: "4px",
      fontSize: "14px",
      width: "120px",
    },
    saveButton: {
      background: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "3px",
      padding: "4px 6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    },
    cancelButton: {
      background: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "3px",
      padding: "4px 6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    },
    authButton: {
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "0.25rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s",
      minWidth: "120px",
    },
    authButtonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
    signinButton: {
      backgroundColor: "#5865f2",
      color: "white",
    },
    signinButtonHover: {
      backgroundColor: "#4752c4",
    },
    signoutButton: {
      backgroundColor: "#dc3545",
      color: "white",
    },
    signoutButtonHover: {
      backgroundColor: "#c82333",
    },
    authRequired: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      textAlign: "center",
      minHeight: "300px",
    },
    authRequiredH2: {
      color: "#495057",
      marginBottom: "1rem",
    },
    authRequiredP: {
      color: "#6c757d",
    },
    loadingSpinner: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "1.2rem",
      color: "#6c757d",
    },
    tabContent: {
      flex: 1,
    },
    homePage: {
      padding: "2rem",
    },
    heroSection: {
      textAlign: "center",
      marginBottom: "3rem",
      color: "#eee",
    },
    featureGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "1.5rem",
      marginTop: "2rem",
    },
    featureCard: {
      padding: "1.5rem",
      border: "1px solid #dee2e6",
      borderRadius: "0.5rem",
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      color: "#000",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
    },
    featureCardHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      borderColor: "#007bff",
    },
    cardButton: {
      marginTop: "1rem",
      padding: "0.75rem 1rem",
      backgroundColor: "#007bff",
      color: "white",
      borderRadius: "0.25rem",
      textAlign: "center",
      fontWeight: "500",
      fontSize: "14px",
      transition: "background-color 0.2s",
    },
    errorMessage: {
      color: "#dc3545",
      fontSize: "12px",
      marginTop: "4px",
    },
    discordName: {
      fontSize: "12px",
      color: "#6c757d",
      fontStyle: "italic",
    },
  };
};

const UsernameEditor = ({ user, customUsername, onUsernameUpdate }) => {
  const styles = useStyles();
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
  const styles = useStyles();

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
  const styles = useStyles();
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
  const styles = useStyles();

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
  const styles = useStyles();
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
              spellsData={spellsData}
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
