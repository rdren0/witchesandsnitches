import React, { useState, useEffect } from "react";
import { spellsData } from "./spells";

import { createClient } from "@supabase/supabase-js";

import SpellBook from "./Components/SpellBooks/SpellBook";
import CharacterCreationForm from "./Components/CharacterCreationForm/CharacterCreationForm";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Custom useStyles hook
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
    },
  };
};

const AuthComponent = ({ user, onSignIn, onSignOut, isLoading }) => {
  const styles = useStyles();

  if (user) {
    return (
      <div style={styles.authSection}>
        <div style={styles.userInfo}>
          <img
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            style={styles.userAvatar}
          />
          <span style={styles.username}>{user.user_metadata.full_name}</span>
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

const HomePage = ({ user }) => {
  const styles = useStyles();

  return (
    <div style={styles.homePage}>
      <div style={styles.heroSection}>
        <h1>Welcome to Your D&D Character Manager</h1>
        {user ? (
          <p>
            Welcome back, {user.user_metadata.full_name}! Ready for your next
            adventure?
          </p>
        ) : (
          <p>
            Create characters, manage spells, and enhance your tabletop
            experience.
          </p>
        )}
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <h3>Character Creation</h3>
            <p>
              Build and customize your D&D characters with our intuitive
              character creation tool.
            </p>
          </div>
          <div style={styles.featureCard}>
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
        return <HomePage user={user} />;
      case "character-creation":
        return (
          <ProtectedRoute user={user}>
            <CharacterCreationForm user={user} />
          </ProtectedRoute>
        );
      case "spellbook":
        return (
          <ProtectedRoute user={user}>
            <SpellBook
              spellsData={spellsData}
              supabase={supabase}
              user={user}
            />
          </ProtectedRoute>
        );
      default:
        return <HomePage user={user} />;
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
