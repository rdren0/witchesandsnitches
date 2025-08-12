import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Users, Plus, Crown } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAdmin } from "../../contexts/AdminContext";
import { characterService } from "../../services/characterService";
import CharacterForm from "./components/CharacterForm/CharacterForm";
import CharacterEditor from "./CharacterEditor";
import CharacterList from "./CharacterList";
import LevelUpModal from "./LevelUpModal";

const CharacterManager = ({
  user,
  onCharacterSaved,
  supabase,
  adminMode = false,
  isUserAdmin = false,
  mode,
}) => {
  const { theme } = useTheme();
  const { allUsers, loadAllUsers } = useAdmin();
  const navigate = useNavigate();
  const { characterId } = useParams();
  const [searchParams] = useSearchParams();

  const currentMode = mode || "list";
  const sectionToOpen = searchParams.get("section");

  const [editingCharacter, setEditingCharacter] = useState(null);
  const [levelingUpCharacter, setLevelingUpCharacter] = useState(null);
  const [selectedTargetUserId, setSelectedTargetUserId] = useState(null);
  const [allCharacters, setAllCharacters] = useState([]);
  const [viewMode, setViewMode] = useState("my");
  const [characterLoading, setCharacterLoading] = useState(false);

  const discordUserId = user?.user_metadata?.provider_id;

  useEffect(() => {
    if (currentMode === "edit" && characterId && user) {
      loadCharacterForEditing(characterId);
    }
  }, [characterId, currentMode, user, adminMode, isUserAdmin]);

  useEffect(() => {
    if (currentMode !== "edit") {
      setEditingCharacter(null);
      setLevelingUpCharacter(null);
    }
  }, [currentMode]);

  const loadCharacterForEditing = async (charId) => {
    if (!user || !discordUserId) {
      console.log("User not ready, waiting...");
      return;
    }

    setCharacterLoading(true);
    try {
      let character;

      if (adminMode && isUserAdmin) {
        character = await characterService.getCharacterByIdAdmin(charId);
      } else {
        character = await characterService.getCharacterById(
          charId,
          discordUserId
        );
      }

      if (character) {
        setEditingCharacter(character);
      } else {
        console.error("Character not found");
        navigate("/character-management");
      }
    } catch (error) {
      console.error("Error loading character:", error);

      if (error.message.includes("Character not found")) {
        alert("Character not found or you don't have permission to edit it.");
      } else {
        alert("Failed to load character. Please try again.");
      }

      navigate("/character-management");
    } finally {
      setCharacterLoading(false);
    }
  };

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

  const handleCharacterSaved = async (updatedCharacter, skipSave = false) => {
    try {
      if (!skipSave) {
        const effectiveUserId =
          adminMode && isUserAdmin
            ? selectedTargetUserId || discordUserId
            : discordUserId;

        if (updatedCharacter.id) {
          await characterService.updateCharacter(
            updatedCharacter.id,
            updatedCharacter,
            effectiveUserId
          );
        } else {
          await characterService.saveCharacter(
            updatedCharacter,
            effectiveUserId
          );
        }
      }

      if (onCharacterSaved) {
        onCharacterSaved(updatedCharacter);
      }

      navigate("/character-management");
    } catch (error) {
      console.error("Error saving character:", error);
      alert("Failed to save character. Please try again.");
    }
  };

  const handleEditCharacter = (character) => {
    navigate(`/character-management/edit/${character.id}`);
  };

  const handleLevelUpCharacter = (character) => {
    setLevelingUpCharacter(character);
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

  const handleLevelUpSave = async (updatedCharacter) => {
    try {
      await characterService.updateCharacter(
        updatedCharacter.id,
        updatedCharacter,
        updatedCharacter.discord_user_id
      );

      setLevelingUpCharacter(null);

      if (adminMode && isUserAdmin) {
        await loadAllCharacters();
      }

      if (onCharacterSaved) {
        onCharacterSaved(updatedCharacter);
      }
    } catch (error) {
      console.error("Error saving level up:", error);
      alert("Failed to save level up changes. Please try again.");
    }
  };

  if (!user || !discordUserId) {
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

  if (currentMode === "edit" && editingCharacter) {
    tabs.push({
      key: "edit",
      label: `Edit ${editingCharacter.name}`,
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

  const renderContent = () => {
    switch (currentMode) {
      case "create":
        return (
          <CharacterForm
            mode="create"
            userId={discordUserId}
            onSave={(character) => {
              console.log("Character saved:", character);
              handleCharacterSaved(character, true); // Skip save since form handles it
            }}
            onCancel={() => navigate("/character-management")}
            supabase={supabase}
          />
        );

      case "edit":
        if (characterLoading) {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
                color: theme.textSecondary,
              }}
            >
              Loading character...
            </div>
          );
        }

        if (!editingCharacter) {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
                color: theme.textSecondary,
              }}
            >
              Character not found
            </div>
          );
        }

        return (
          <CharacterEditor
            character={editingCharacter}
            onSave={handleCharacterSaved}
            onCancel={() => navigate("/character-management")}
            user={user}
            supabase={supabase}
            adminMode={adminMode}
            isUserAdmin={isUserAdmin}
            selectedTargetUserId={selectedTargetUserId}
            sectionToOpen={sectionToOpen}
          />
        );

      default:
        return (
          <>
            {renderViewModeToggle()}
            <CharacterList
              user={user}
              adminMode={adminMode}
              isUserAdmin={isUserAdmin}
              viewMode={viewMode}
              allCharacters={allCharacters}
              onEditCharacter={handleEditCharacter}
              onLevelUpCharacter={handleLevelUpCharacter}
              onDeleteCharacter={handleDeleteCharacter}
              supabase={supabase}
            />
          </>
        );
    }
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
      {renderTabNavigation()}
      {renderContent()}

      {levelingUpCharacter && (
        <LevelUpModal
          character={levelingUpCharacter}
          isOpen={!!levelingUpCharacter}
          onSave={handleLevelUpSave}
          onCancel={() => setLevelingUpCharacter(null)}
          user={user}
          supabase={supabase}
        />
      )}
    </div>
  );
};

export default CharacterManager;
