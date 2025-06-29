import { useState, useEffect } from "react";
import { Users, Plus, Crown } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAdmin } from "../../contexts/AdminContext";
import { characterService } from "../../services/characterService";

import CharacterCreator from "./CharacterCreation/CharacterCreator";
import CharacterEditor from "./Edit/CharacterEditor";
import CharacterList from "./Edit/CharacterList";
import LevelUpModal from "./Edit/LevelUpModal";

const UserSelector = ({ selectedUserId, onUserChange, allUsers }) => {
  const { theme } = useTheme();

  const styles = {
    container: {
      backgroundColor: `${theme.warning}20`,
      border: `2px solid ${theme.warning}`,
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "20px",
    },
    title: {
      color: theme.warning,
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.background,
      color: theme.text,
      fontSize: "14px",
    },
    helper: {
      color: theme.textSecondary,
      fontSize: "12px",
      marginTop: "8px",
      fontStyle: "italic",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <Crown size={16} />
        Admin Mode: Create Character For User
      </div>
      <select
        value={selectedUserId || ""}
        onChange={(e) => onUserChange(e.target.value)}
        style={styles.select}
      >
        <option value="">Select a user...</option>
        {allUsers.map((user) => (
          <option key={user.discordUserId} value={user.discordUserId}>
            {user.displayName} ({user.username}) - {user.characterCount}{" "}
            characters
          </option>
        ))}
      </select>
      <div style={styles.helper}>
        Creating a character for another user. The character will belong to the
        selected user.
      </div>
    </div>
  );
};

const CharacterManagement = ({
  user,
  onCharacterSaved,
  selectedCharacterId,
  onSelectedCharacterReset,
  supabase,
  adminMode = false,
  isUserAdmin = false,
}) => {
  const { theme } = useTheme();
  const { allUsers, loadAllUsers } = useAdmin();

  const [activeTab, setActiveTab] = useState("list");
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [levelingUpCharacter, setLevelingUpCharacter] = useState(null);

  const [selectedTargetUserId, setSelectedTargetUserId] = useState(null);
  const [allCharacters, setAllCharacters] = useState([]);
  const [viewMode, setViewMode] = useState("my");

  const discordUserId = user?.user_metadata?.provider_id;

  useEffect(() => {
    if (adminMode && isUserAdmin) {
      loadAllUsers();
      loadAllCharacters();
    }
    // eslint-disable-next-line
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
      const effectiveUserId =
        adminMode && isUserAdmin
          ? updatedCharacter.discordUserId
          : discordUserId;

      const { error } = await supabase
        .from("characters")
        .update({
          level: updatedCharacter.level,
          hit_points: updatedCharacter.hit_points || updatedCharacter.hitPoints,
          current_hit_points:
            updatedCharacter.hit_points || updatedCharacter.hitPoints,
          current_hit_dice: updatedCharacter.level,
          ability_scores:
            updatedCharacter.ability_scores || updatedCharacter.abilityScores,
          standard_feats:
            updatedCharacter.standard_feats || updatedCharacter.standardFeats,
          skill_proficiencies:
            updatedCharacter.skill_proficiencies ||
            updatedCharacter.skillProficiencies,
          asi_choices:
            updatedCharacter.asi_choices || updatedCharacter.asiChoices,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedCharacter.id)
        .eq("discord_user_id", effectiveUserId);

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      onCharacterSaved();
      setActiveTab("list");
      setEditingCharacter(null);
      setLevelingUpCharacter(null);

      if (adminMode && isUserAdmin) {
        loadAllCharacters();
      }
    } catch (error) {
      console.error("Error saving character:", error);
      alert("Failed to save character changes: " + error.message);
      throw error;
    }
  };

  const handleEditCharacter = (character) => {
    setEditingCharacter(character);
    setActiveTab("edit");
  };

  const handleLevelUpCharacter = (character) => {
    setLevelingUpCharacter(character);
    setActiveTab("levelup");
  };

  const handleBackToList = () => {
    setActiveTab("list");
    setEditingCharacter(null);
    setLevelingUpCharacter(null);
    setSelectedTargetUserId(null);
  };

  const handleNewCharacter = () => {
    setActiveTab("create");
    setEditingCharacter(null);
    setLevelingUpCharacter(null);

    if (!adminMode) {
      setSelectedTargetUserId(null);
    }
  };

  const renderTabNavigation = () => {
    const tabs = [
      { key: "list", label: "Character List", icon: Users },
      { key: "create", label: "Create Character", icon: Plus },
    ];

    return (
      <div
        style={{
          display: "flex",
          marginBottom: "2rem",
          borderBottom: `1px solid ${theme.border}`,
          gap: "4px",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              style={{
                background: isActive ? theme.surface : "transparent",
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
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key !== "create") {
                  setEditingCharacter(null);
                  setLevelingUpCharacter(null);
                }
              }}
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
    if (!adminMode || !isUserAdmin || activeTab !== "list") return null;

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
        padding: "2rem",
        backgroundColor: theme.background,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: theme.surface,
          borderRadius: "12px",
          padding: "2rem",
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <Users
            size={28}
            color={theme.primary}
            style={{ marginRight: "12px" }}
          />
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: theme.text,
              margin: 0,
            }}
          >
            Character Management
            {adminMode && isUserAdmin && (
              <span
                style={{
                  color: theme.warning,
                  fontSize: "16px",
                  marginLeft: "12px",
                  fontWeight: "normal",
                }}
              >
                (Admin Mode)
              </span>
            )}
          </h1>
        </div>

        {renderAdminModeIndicator()}
        {renderTabNavigation()}
        {renderViewModeToggle()}

        {activeTab === "list" && (
          <>
            <CharacterList
              user={user}
              supabase={supabase}
              onEditCharacter={handleEditCharacter}
              onLevelUpCharacter={handleLevelUpCharacter}
              selectedCharacterId={selectedCharacterId}
              onSelectedCharacterReset={onSelectedCharacterReset}
              adminMode={adminMode && viewMode === "all"}
              isUserAdmin={isUserAdmin}
              allCharacters={viewMode === "all" ? allCharacters : undefined}
            />
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <button
                onClick={handleNewCharacter}
                style={{
                  backgroundColor: theme.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: "0 auto",
                }}
              >
                <Plus size={20} />
                Create New Character
              </button>
            </div>
          </>
        )}

        {activeTab === "create" && (
          <>
            {adminMode && isUserAdmin && (
              <UserSelector
                selectedUserId={selectedTargetUserId}
                onUserChange={setSelectedTargetUserId}
                allUsers={allUsers}
              />
            )}
            <CharacterCreator
              user={user}
              onCharacterSaved={() => {
                onCharacterSaved();
                setActiveTab("list");
                setSelectedTargetUserId(null);
                if (adminMode && isUserAdmin) {
                  loadAllCharacters();
                }
              }}
              targetUserId={selectedTargetUserId}
              adminMode={adminMode && isUserAdmin}
            />
          </>
        )}

        {activeTab === "edit" && editingCharacter && (
          <CharacterEditor
            character={editingCharacter}
            onSave={handleCharacterSaved}
            onCancel={handleBackToList}
            user={user}
            supabase={supabase}
            adminMode={adminMode}
            isUserAdmin={isUserAdmin}
          />
        )}

        {activeTab === "levelup" && levelingUpCharacter && (
          <LevelUpModal
            character={levelingUpCharacter}
            isOpen={true}
            onSave={handleCharacterSaved}
            onCancel={handleBackToList}
            user={user}
            supabase={supabase}
            adminMode={adminMode}
            isUserAdmin={isUserAdmin}
          />
        )}
      </div>
    </div>
  );
};

export default CharacterManagement;
