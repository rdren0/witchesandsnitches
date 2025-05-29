import React, { useState, useEffect } from "react";
import "./App.css";
import { spellsData } from "./spells";

import { createClient } from "@supabase/supabase-js";

import SpellBook from "./Components/SpellBooks/SpellBook";
import CharacterCreationForm from "./Components/CharacterCreationForm/CharacterCreationForm";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const AuthComponent = ({ user, onSignIn, onSignOut, isLoading }) => {
  if (user) {
    return (
      <div className="auth-section">
        <div className="user-info">
          <img
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            className="user-avatar"
          />
          <span className="username">{user.user_metadata.full_name}</span>
        </div>
        <button
          onClick={onSignOut}
          className="auth-button signout-button"
          disabled={isLoading}
        >
          {isLoading ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    );
  }

  return (
    <div className="auth-section">
      <button
        onClick={onSignIn}
        className="auth-button signin-button"
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign in with Discord"}
      </button>
    </div>
  );
};

const HomePage = ({ user }) => {
  return (
    <div className="home-page">
      <div className="hero-section">
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
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Character Creation</h3>
            <p>
              Build and customize your D&D characters with our intuitive
              character creation tool.
            </p>
          </div>
          <div className="feature-card">
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
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please sign in with Discord to access this feature.</p>
        </div>
      )
    );
  }
  return children;
};

function App() {
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

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
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
      <div className="app-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            className={`tab-button ${
              activeTab === "character-creation" ? "active" : ""
            }`}
            onClick={() => setActiveTab("character-creation")}
          >
            Character Creation
          </button>
          <button
            className={`tab-button ${
              activeTab === "spellbook" ? "active" : ""
            }`}
            onClick={() => setActiveTab("spellbook")}
          >
            SpellBook
          </button>
        </nav>

        <AuthComponent
          user={user}
          onSignIn={signInWithDiscord}
          onSignOut={signOut}
          isLoading={authLoading}
        />
      </header>

      <main className="tab-content">{renderContent()}</main>
    </div>
  );
}

export default App;
