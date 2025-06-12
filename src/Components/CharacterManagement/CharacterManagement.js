import { useState } from "react";
import { Users, Plus, Edit3, TrendingUp } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

import CharacterCreator from "./Create/CharacterCreator";
import CharacterEditor from "./Edit/CharacterEditor";
import CharacterList from "./Edit/CharacterList";
import LevelUpModal from "./Edit/LevelUpModal";

const CharacterManagement = ({
  user,
  customUsername,
  onCharacterSaved,
  selectedCharacterId,
  onSelectedCharacterReset,
  supabase,
}) => {
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState("list");
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [levelingUpCharacter, setLevelingUpCharacter] = useState(null);

  const handleCharacterSaved = async (updatedCharacter) => {
    try {
      const { error } = await supabase
        .from("characters")
        .update({
          level: updatedCharacter.level,
          hit_points: updatedCharacter.hit_points || updatedCharacter.hitPoints,
          ability_scores:
            updatedCharacter.ability_scores || updatedCharacter.abilityScores,
          standard_feats:
            updatedCharacter.standard_feats || updatedCharacter.standardFeats,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedCharacter.id)
        .eq("discord_user_id", user?.user_metadata?.provider_id)
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      onCharacterSaved();
      setActiveTab("list");
      setEditingCharacter(null);
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
  };

  const renderTabNavigation = () => {
    const tabs = [
      { key: "list", label: "Character List", icon: Users },
      { key: "create", label: "Create Character", icon: Plus },
    ];

    if (editingCharacter) {
      tabs.push({ key: "edit", label: "Edit Character", icon: Edit3 });
    }

    if (levelingUpCharacter) {
      tabs.push({ key: "levelup", label: "Level Up", icon: TrendingUp });
    }

    return (
      <div
        style={{
          borderBottom: `2px solid ${theme.border}`,
          marginBottom: "20px",
        }}
      >
        <nav
          style={{
            display: "flex",
            gap: "4px",
            paddingBottom: "8px",
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "8px 8px 0 0",
                  backgroundColor: isActive ? theme.surface : "transparent",
                  color: isActive ? theme.text : theme.textSecondary,
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: isActive ? "600" : "500",
                  transition: "all 0.2s ease",
                  borderBottom: isActive
                    ? `3px solid ${theme.primary}`
                    : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = theme.surface;
                    e.target.style.color = theme.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = theme.textSecondary;
                  }
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "create":
        return (
          <CharacterCreator
            user={user}
            customUsername={customUsername}
            onCharacterSaved={handleCharacterSaved}
            selectedCharacterId={selectedCharacterId}
            onSelectedCharacterReset={onSelectedCharacterReset}
            supabase={supabase}
            onCancel={handleBackToList}
          />
        );

      case "edit":
        return (
          <CharacterEditor
            user={user}
            customUsername={customUsername}
            character={editingCharacter}
            onCharacterSaved={handleCharacterSaved}
            selectedCharacterId={selectedCharacterId}
            onSelectedCharacterReset={onSelectedCharacterReset}
            supabase={supabase}
            onCancel={handleBackToList}
          />
        );

      case "levelup":
        return (
          <LevelUpModal
            character={levelingUpCharacter}
            isOpen={true}
            onSave={handleCharacterSaved}
            onCancel={handleBackToList}
            user={user}
            supabase={supabase}
          />
        );

      case "list":
      default:
        return (
          <CharacterList
            user={user}
            customUsername={customUsername}
            selectedCharacterId={selectedCharacterId}
            onSelectedCharacterReset={onSelectedCharacterReset}
            onEditCharacter={handleEditCharacter}
            onLevelUpCharacter={handleLevelUpCharacter}
            onCreateNew={() => setActiveTab("create")}
            supabase={supabase}
          />
        );
    }
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: theme.text,
            margin: "0 0 8px 0",
          }}
        >
          Character Management
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: theme.textSecondary,
            margin: 0,
          }}
        >
          Create, edit, and manage your D&D characters
        </p>
      </div>

      {renderTabNavigation()}
      {renderTabContent()}
    </div>
  );
};

export default CharacterManagement;
