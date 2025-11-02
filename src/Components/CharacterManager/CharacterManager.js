import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { Users, Plus, Crown } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAdmin } from "../../contexts/AdminContext";
import { characterService } from "../../services/characterService";

import CharacterForm from "./components/CharacterForm/CharacterForm";
import CharacterList from "./CharacterList";

const CharacterManager = ({
  user,
  customUsername,
  onCharacterSaved,
  supabase,
  adminMode = false,
  isUserAdmin = false,
  mode,
}) => {
  const { theme } = useTheme();
  const { allUsers, loadAllUsers } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const { characterId } = useParams();
  const [searchParams] = useSearchParams();

  const currentMode = mode || "list";
  const sectionToOpen = searchParams.get("section");

  const [selectedTargetUserId, setSelectedTargetUserId] = useState(null);
  const [allCharacters, setAllCharacters] = useState([]);
  const [viewMode, setViewMode] = useState("my");
  const [isUserDataReady, setIsUserDataReady] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const discordUserId = user?.user_metadata?.provider_id;

  useEffect(() => {
    if (discordUserId) {
      setIsUserDataReady(true);
    } else {
      setIsUserDataReady(false);
    }
  }, [discordUserId]);

  useEffect(() => {
    if (adminMode && isUserAdmin) {
      loadAllUsers();
      loadAllCharacters();
    }
  }, [adminMode, isUserAdmin]);

  const loadAllCharacters = async () => {
    if (!adminMode || !isUserAdmin) return;

    try {
      const characters = await characterService.getAllCharacters();
      setAllCharacters(characters);
    } catch (error) {
      console.error("Error loading all characters:", error);
    }
  };

  const handleCharacterSaved = async (updatedCharacter) => {
    try {
      setRefreshTrigger((prev) => {
        const newValue = prev + 1;

        return newValue;
      });

      if (adminMode && isUserAdmin) {
        await loadAllCharacters();
      }

      if (onCharacterSaved) {
        onCharacterSaved(updatedCharacter);
      }

      navigate("/character-management");
    } catch (error) {
      console.error("Error in handleCharacterSaved:", error);
    }
  };

  const handleEditCharacter = (character) => {
    navigate(`/character-management/edit/${character.id}`, {
      state: {
        characterOwnerId: character.discord_user_id,
        characterName: character.name,
      },
    });
  };


  const handleDeleteCharacter = async (character) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${character.name}? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        if (adminMode && isUserAdmin) {
          await characterService.deleteCharacter(
            character.id,
            character.discord_user_id
          );
        } else {
          await characterService.deleteCharacter(character.id, discordUserId);
        }

        setRefreshTrigger((prev) => prev + 1);

        if (adminMode && isUserAdmin) {
          await loadAllCharacters();
        }
        if (onCharacterSaved) {
          onCharacterSaved();
        }
      } catch (error) {
        console.error("Error deleting character:", error);
        alert("Failed to delete character. Please try again.");
      }
    }
  };

  if (!user || !discordUserId || !isUserDataReady) {
    return (
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: theme.background,
          minHeight: "calc(100vh - 100px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: theme.textSecondary }}>
          <div>Loading user information...</div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      key: "list",
      label: "Character List",
      icon: Users,
      active: currentMode === "list",
      onClick: () => navigate("/character-management"),
    },
    {
      key: "create",
      label: "Create New",
      icon: Plus,
      active: currentMode === "create",
      onClick: () => navigate("/character-management/create"),
    },
  ];

  if (currentMode === "edit" && characterId) {
    tabs.push({
      key: "edit",
      label: `Edit Character`,
      icon: Users,
      active: true,
      onClick: () => {},
    });
  }

  const renderTabNavigation = () => {
    const styles = {
      tabContainer: {
        display: "flex",
        borderBottom: `2px solid ${theme.border}`,
        marginBottom: "20px",
        backgroundColor: theme.background,
        borderRadius: "8px 8px 0 0",
        overflow: "hidden",
      },
    };

    return (
      <div style={styles.tabContainer}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.active;

          return (
            <button
              key={tab.key}
              style={{
                backgroundColor: isActive ? theme.surface : "transparent",
                border: "none",
                borderRadius: "8px 8px 0 0",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: isActive ? "600" : "500",
                color: isActive ? theme.text : theme.textSecondary,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: isActive
                  ? `2px solid ${theme.primary}`
                  : "2px solid transparent",
              }}
              onClick={tab.onClick}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  };

  const renderAdminModeIndicator = () => {
    if (!adminMode || !isUserAdmin) return null;

    return (
      <div
        style={{
          background: "linear-gradient(135deg, #ffd700, #ffed4e)",
          color: "#8b4513",
          padding: "12px 20px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          border: "2px solid #ffd700",
        }}
      >
        <Crown size={18} />
        ADMIN MODE ACTIVE - You can create and edit characters for all users
      </div>
    );
  };

  const renderViewModeToggle = () => {
    if (!adminMode || !isUserAdmin || currentMode !== "list") return null;

    return (
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        <span
          style={{ color: theme.text, fontSize: "14px", fontWeight: "500" }}
        >
          View:
        </span>
        {!adminMode && (
          <button
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: `1px solid ${theme.border}`,
              backgroundColor:
                viewMode === "my" ? theme.primary : theme.background,
              color: viewMode === "my" ? "white" : theme.text,
              cursor: "pointer",
              fontSize: "12px",
            }}
            onClick={() => setViewMode("my")}
          >
            My Characters
          </button>
        )}
        <button
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: `1px solid ${theme.border}`,
            backgroundColor:
              viewMode === "all" ? theme.primary : theme.background,
            color: viewMode === "all" ? "white" : theme.text,
            cursor: "pointer",
            fontSize: "12px",
          }}
          onClick={() => setViewMode("all")}
        >
          All Characters
        </button>
      </div>
    );
  };

  const displayName = customUsername || user?.user_metadata?.custom_claims?.global_name || user?.user_metadata?.full_name || "Adventurer";

  const renderWelcomeSection = () => {
    return (
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            textAlign: "center",
            padding: "24px 20px",
          }}
        >
          <h1
            style={{
              color: theme.text,
              fontSize: "32px",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            Welcome to Your W&S Character Manager
          </h1>
          <p
            style={{
              color: theme.textSecondary,
              fontSize: "18px",
              margin: 0,
            }}
          >
            Welcome back, {displayName}! Ready for your next adventure?
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: theme.background,
        minHeight: "calc(100vh - 100px)",
      }}
    >
      {renderAdminModeIndicator()}
      {renderWelcomeSection()}
      {renderTabNavigation()}

      {currentMode === "list" && (
        <>
          {renderViewModeToggle()}
          <CharacterList
            user={user}
            adminMode={adminMode}
            isUserAdmin={isUserAdmin}
            viewMode={viewMode}
            allCharacters={allCharacters}
            onEditCharacter={handleEditCharacter}
            onDeleteCharacter={handleDeleteCharacter}
            supabase={supabase}
            refreshTrigger={refreshTrigger}
          />
        </>
      )}

      {currentMode === "edit" && characterId && (
        <CharacterForm
          characterId={characterId}
          userId={
            adminMode && isUserAdmin
              ? location.state?.characterOwnerId
              : discordUserId
          }
          mode="edit"
          onSave={handleCharacterSaved}
          onCancel={() => navigate("/character-management")}
          supabase={supabase}
          adminMode={adminMode}
          isUserAdmin={isUserAdmin}
          initialSection={sectionToOpen}
        />
      )}

      {currentMode === "create" && (
        <CharacterForm
          userId={discordUserId}
          mode="create"
          onSave={handleCharacterSaved}
          onCancel={() => navigate("/character-management")}
          supabase={supabase}
          adminMode={adminMode}
          isUserAdmin={isUserAdmin}
          initialSection={sectionToOpen}
        />
      )}
    </div>
  );
};

export default CharacterManager;
