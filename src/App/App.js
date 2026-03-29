import ThemeCharacterSync from "../Components/ThemeCharacterSync/ThemeCharacterSync";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";
import { useCharacterData } from "./useCharacterData";
import { useSyncCharacterToUrl } from "./useSyncCharacterToUrl";

import { characterService } from "../services/characterService";
import SpellBook from "../Components/SpellBook/SpellBook";

import CharacterSheetWrapper from "../Components/CharacterSheet/CharacterSheetWrapper";
import CharacterNotes from "../Components/CharacterNotes/CharacterNotes";
import CharacterSelector from "../Components/CharacterSelector/CharacterSelector";
import CharacterGallery from "../Components/CharacterManager/CharacterGallery/CharacterGallery";
import OtherPlayers from "../Components/OtherPlayers/OtherPlayers";
import Creatures from "../Components/Creatures/Creatures";
import ThemeSettings from "../Components/ThemeSettings/ThemeSettings";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { RollModalProvider } from "../Components/utils/diceRoller";
import HelpResources from "../Components/HelpResources/HelpResources";

import { createAppStyles } from "../utils/styles/masterStyles";
import PotionBrewingSystem from "../Components/Potions/Potions";
import Inventory from "../Components/Inventory/Inventory";
import CharacterManager from "../Components/CharacterManager/CharacterManager";
import AuthComponent from "./AuthComponent";
import Navigation from "./Navigation";
import CharacterSubNavigation from "./CharacterSubNavigation";
import { AdminProvider, useAdmin } from "../contexts/AdminContext";
import { SupabaseProvider } from "../contexts/SupabaseContext";
import { FeatsProvider } from "../contexts/FeatsContext";
import { SpellsProvider } from "../contexts/SpellsContext";
import AdminDashboard from "../Admin/AdminDashboard";
import RecipeCookingSystem from "../Components/Recipes/RecipeCookingSystem";
import AdminPasswordModal from "../Admin/AdminPasswordModal";
import DisplayNamePrompt from "./DisplayNamePrompt";
import { RULE_BOOK_URL } from "./const";
import DowntimeWrapper from "../Components/Downtime/DowntimeWrapper";
import "./App.css";



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

const CHARACTER_ROUTE_CONFIG = [
  {
    section: "spellbook",
    component: SpellBook,
    getProps: (ctx) => ({
      user: ctx.user,
      customUsername: ctx.customUsername,
      supabase,
      selectedCharacter: ctx.selectedCharacter,
      characters: ctx.characters,
      discordUserId: ctx.user?.user_metadata?.provider_id,
      adminMode: ctx.adminMode,
      isUserAdmin: ctx.isUserAdmin,
    }),
  },
  {
    section: "potions",
    component: PotionBrewingSystem,
    getProps: (ctx) => ({
      user: ctx.user,
      character: ctx.selectedCharacter,
      supabase,
    }),
  },
  {
    section: "recipes",
    component: RecipeCookingSystem,
    getProps: (ctx) => ({
      user: ctx.user,
      selectedCharacter: ctx.selectedCharacter,
      supabase,
    }),
  },
  {
    section: "inventory",
    component: Inventory,
    getProps: (ctx) => ({
      user: ctx.user,
      selectedCharacter: ctx.selectedCharacter,
      supabase,
      adminMode: ctx.adminMode,
    }),
  },
  {
    section: "notes",
    component: CharacterNotes,
    getProps: (ctx) => ({
      user: ctx.user,
      selectedCharacter: ctx.selectedCharacter,
      supabase,
      adminMode: ctx.adminMode,
      isUserAdmin: ctx.isUserAdmin,
    }),
  },
  {
    section: "downtime",
    component: DowntimeWrapper,
    getProps: (ctx) => ({
      user: ctx.user,
      selectedCharacter: ctx.selectedCharacter,
      supabase,
      adminMode: ctx.adminMode,
      isUserAdmin: ctx.isUserAdmin,
    }),
  },
  {
    section: "gallery",
    component: CharacterGallery,
    getProps: (ctx) => ({
      selectedCharacter: ctx.selectedCharacter,
      supabase,
      user: ctx.user,
      adminMode: ctx.adminMode,
    }),
  },
  {
    section: "players",
    component: OtherPlayers,
    getProps: (ctx) => ({
      selectedCharacter: ctx.selectedCharacter,
      supabase,
      user: ctx.user,
    }),
  },
  {
    section: "creatures",
    component: Creatures,
    getProps: (ctx) => ({
      supabase,
      user: ctx.user,
      characters: ctx.characters,
      selectedCharacter: ctx.selectedCharacter,
    }),
  },
];

function AppContent() {
  const { theme } = useTheme();
  const styles = createAppStyles(theme);
  const location = useLocation();
  const { adminMode, setAdminMode, isUserAdmin, setIsUserAdmin } = useAdmin();

  const {
    user,
    customUsername,
    loading,
    authLoading,
    showNamePrompt,
    isSubmittingName,
    signInWithDiscord,
    signOut,
    updateCustomUsername,
    loadCustomUsername,
    handleNamePromptSubmit,
    handleNamePromptSkip,
  } = useAuth();

  const discordUserId = user?.user_metadata?.provider_id;

  const {
    characters,
    selectedCharacter,
    charactersLoading,
    charactersError,
    hasAttemptedLoad,
    setHasAttemptedLoad,
    isInitializing,
    handleCharacterChange,
  } = useCharacterData({
    user,
    discordUserId,
    adminMode,
    isUserAdmin,
    customUsername,
    loadCustomUsername,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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

  useSyncCharacterToUrl({
    selectedCharacter,
    isInitializing,
    characters,
    charactersLoading,
    loading,
    user,
    hasAttemptedLoad,
  });

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

  const routeCtx = { user, customUsername, selectedCharacter, characters, adminMode, isUserAdmin };

  return (
    <div
      style={{
        ...styles.appContainer,
        fontFamily: '"Cinzel", "Times New Roman", serif',
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.background,
      }}
    >
      <div style={{ flexShrink: 0 }}>
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
                <ProtectedRoute user={user}>
                  <CharacterManager
                    user={user}
                    customUsername={customUsername}
                    onCharacterSaved={() => setHasAttemptedLoad(false)}
                    supabase={supabase}
                    adminMode={adminMode}
                    isUserAdmin={isUserAdmin}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/character-management" element={<Navigate to="/" replace />} />
            {["create", "archived"].map((mode) => (
              <Route
                key={mode}
                path={`/character-management/${mode}`}
                element={
                  <ProtectedRoute user={user}>
                    <CharacterManager
                      user={user}
                      customUsername={customUsername}
                      onCharacterSaved={() => setHasAttemptedLoad(false)}
                      supabase={supabase}
                      adminMode={adminMode}
                      isUserAdmin={isUserAdmin}
                      mode={mode}
                    />
                  </ProtectedRoute>
                }
              />
            ))}
            {[
              "/character-management/edit/:characterId",
              "/character-management/edit/:characterId/:characterName",
            ].map((path) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute user={user}>
                    <CharacterManager
                      user={user}
                      customUsername={customUsername}
                      onCharacterSaved={() => setHasAttemptedLoad(false)}
                      supabase={supabase}
                      adminMode={adminMode}
                      isUserAdmin={isUserAdmin}
                      mode="edit"
                    />
                  </ProtectedRoute>
                }
              />
            ))}
            <Route path="/character" element={<Navigate to="/character/sheet" replace />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute user={user}>
                  <AdminDashboard supabase={supabase} />
                </ProtectedRoute>
              }
            />
            {["/character/sheet", "/character/sheet/:characterId/:characterName"].map((path) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute user={user}>
                    <CharacterSheetWrapper
                      user={user}
                      customUsername={customUsername}
                      supabase={supabase}
                      selectedCharacter={selectedCharacter}
                      characters={characters}
                      adminMode={adminMode}
                      isUserAdmin={isUserAdmin}
                      characterSelector={characterSelector}
                    />
                  </ProtectedRoute>
                }
              />
            ))}
            {CHARACTER_ROUTE_CONFIG.flatMap(({ section, component: Component, getProps }) =>
              [`/character/${section}`, `/character/${section}/:characterId/:characterName`].map((path) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute user={user}>
                      {characterSelector}
                      <Component {...getProps(routeCtx)} />
                    </ProtectedRoute>
                  }
                />
              ))
            )}
            <Route path="/theme-settings" element={<ThemeSettings />} />
            <Route path="/help-resources" element={<HelpResources />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <AdminPasswordModal
          isOpen={showPasswordModal}
          onClose={handleModalClose}
          onPasswordSubmit={handlePasswordSubmit}
          isLoading={isVerifying}
        />
        <DisplayNamePrompt
          isOpen={showNamePrompt}
          onSubmit={handleNamePromptSubmit}
          onSkip={handleNamePromptSkip}
          isLoading={isSubmittingName}
        />
      </div>
      <footer
        style={{
          marginTop: "auto",
          paddingBottom: "10px",
          backgroundColor: theme.surface,
          color: theme.textSecondary,
          borderTop: `1px solid ${theme.border}`,
          fontSize: "14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.25rem",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <div>
          <a
            href={RULE_BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: theme.primary,
              fontWeight: "700",
            }}
          >
            <h3>View Rulebook</h3>
          </a>
          © {new Date().getFullYear()} <strong>Witches & Snitches</strong>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <SupabaseProvider>
        <RollModalProvider>
          <ThemeProvider>
            <AdminProviderWrapper />
          </ThemeProvider>
        </RollModalProvider>
      </SupabaseProvider>
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
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SpellsProvider>
      <FeatsProvider>
        <AdminProvider user={user}>
          <AppContent />
        </AdminProvider>
      </FeatsProvider>
    </SpellsProvider>
  );
}

export default App;
