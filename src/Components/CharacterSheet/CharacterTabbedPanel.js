import React, { useState } from "react";
import {
  BookOpen,
  Beaker,
  Package,
  Skull,
  Wand,
  Dices,
  Award,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import SpellBook from "../SpellBook/SpellBook";
import PotionBrewingSystem from "../Potions/Potions";
import Inventory from "../Inventory/Inventory";
import FlexibleDiceRoller from "../FlexibleDiceRoller/FlexibleDiceRoller";
import SpellSlotTracker from "./SpellSlotTracker";
import CorruptionTracker from "./CorruptionTracker";
import CharacterFeatsDisplay from "./CharacterFeatsDisplay";
import MetaMagicDisplay from "./MetaMagicDisplay";
import SpellSummary from "./SpellSummary";

const CharacterTabbedPanel = ({
  supabase,
  user,
  selectedCharacter,
  characters,
  setCharacter,
  discordUserId,
  adminMode,
  isUserAdmin,
  onNavigateToCharacterManagement,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("spellbook");

  const styles = {
    container: {
      backgroundColor: theme.background,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      height: "1200px",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    tabsContainer: {
      display: "flex",
      borderBottom: `2px solid ${theme.border}`,
      backgroundColor: theme.background,
      borderRadius: "12px 12px 0 0",
    },
    tab: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      padding: "12px 8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease",
      borderBottom: "3px solid transparent",
      backgroundColor: "transparent",
      color: theme.textSecondary,
      minHeight: "48px",
      border: "none",
      outline: "none",
    },
    activeTab: {
      color: theme.primary,
      borderBottomColor: theme.primary,
      backgroundColor: theme.background,
    },
    tabContent: {
      flex: 1,
      overflow: "auto",
      padding: "0",
      height: "calc(600px - 48px)",
      backgroundColor: theme.background,
    },
    placeholderContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      padding: "40px 20px",
      textAlign: "center",
    },
    placeholderTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
      margin: "16px 0 8px 0",
    },
    placeholderText: {
      fontSize: "14px",
      color: theme.textSecondary,
      margin: "0",
    },
  };

  const tabs = [
    {
      id: "diceRoller",
      label: "Dice Roller",
      icon: Dices,
      component: (
        <div
          style={{
            backgroundColor: theme.background,
            padding: "16px",
            height: "100%",
          }}
        >
          <FlexibleDiceRoller
            title="Custom Roll"
            description={`Rolling for ${selectedCharacter.name}`}
            character={selectedCharacter}
          />
        </div>
      ),
    },
    {
      id: "slots",
      label: "Spell & Sorcery",
      icon: Wand,
      component: (
        <div
          style={{
            backgroundColor: theme.background,
            padding: "16px",
            height: "100%",
          }}
        >
          <SpellSummary
            character={selectedCharacter}
            supabase={supabase}
            user={user}
            discordUserId={discordUserId}
            adminMode={adminMode}
            isUserAdmin={isUserAdmin}
          />
          <SpellSlotTracker
            character={selectedCharacter}
            supabase={supabase}
            discordUserId={discordUserId}
            setCharacter={setCharacter}
            selectedCharacterId={selectedCharacter.id}
          />
          <MetaMagicDisplay
            character={selectedCharacter}
            onNavigateToCharacterManagement={onNavigateToCharacterManagement}
          />
        </div>
      ),
    },
    {
      id: "spellbook",
      label: "Spellbook",
      icon: BookOpen,
      component: (
        <div
          style={{
            backgroundColor: theme.background,
            padding: "16px",
            height: "100%",
          }}
        >
          <SpellBook
            supabase={supabase}
            user={user}
            discordUserId={discordUserId}
            selectedCharacter={selectedCharacter}
            setCharacter={setCharacter}
            selectedCharacterId={selectedCharacter.id}
            characters={characters}
            isEmbedded={true}
            adminMode={adminMode}
            isUserAdmin={isUserAdmin}
          />
        </div>
      ),
    },
    {
      id: "feats",
      label: "Feats",
      icon: Award,
      component: (
        <CharacterFeatsDisplay
          character={selectedCharacter}
          supabase={supabase}
          discordUserId={discordUserId}
          setCharacter={setCharacter}
          adminMode={adminMode}
          isUserAdmin={isUserAdmin}
        />
      ),
    },
    {
      id: "potions",
      label: "Potions",
      icon: Beaker,
      component: (
        <div
          style={{
            backgroundColor: theme.background,
            padding: "16px",
            height: "100%",
          }}
        >
          <PotionBrewingSystem
            user={user}
            character={selectedCharacter}
            supabase={supabase}
          />
        </div>
      ),
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      component: (
        <div
          style={{
            backgroundColor: theme.background,
            padding: "16px",
            height: "100%",
          }}
        >
          <Inventory
            user={user}
            selectedCharacter={selectedCharacter}
            supabase={supabase}
          />
        </div>
      ),
    },
    {
      id: "corruption",
      label: "Corruption",
      icon: Skull,
      component: (
        <div
          style={{
            backgroundColor: theme.background,
            padding: "16px",
            height: "100%",
          }}
        >
          <CorruptionTracker
            character={selectedCharacter}
            supabase={supabase}
            discordUserId={discordUserId}
            setCharacter={setCharacter}
            selectedCharacterId={selectedCharacter.id}
          />
        </div>
      ),
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div style={styles.container}>
      <div style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                ...(isActive ? styles.activeTab : {}),
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span style={{ fontSize: "13px" }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div style={styles.tabContent}>{activeTabData?.component}</div>
    </div>
  );
};

export default CharacterTabbedPanel;
