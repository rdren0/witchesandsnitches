import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronDown,
  Info,
  ChevronRight,
  Wand2,
  Star,
  Zap,
  BookOpen,
  Shield,
  Eye,
  Heart,
  Squirrel,
  Skull,
  Dice6,
  MoreVertical,
  Edit3,
  Check,
  X,
  Search,
  Filter,
  Brain,
  Eye as WisdomIcon,
  Target,
} from "lucide-react";

import { spellsData } from "../../SharedData/spells";
import { getSpellModifier, getModifierInfo, hasSubclassFeature } from "./utils";
import { useTheme } from "../../contexts/ThemeContext";
import { useRollFunctions, useRollModal } from "../utils/diceRoller";
import {
  sendDiscordRollWebhook,
  getRollResultColor,
  ROLL_COLORS,
} from "../utils/discordWebhook";
import { formatModifier } from "../CharacterSheet/utils";
import { createSpellBookStyles } from "./styles";
import RestrictionModal from "./RestrictionModal";
import { SpellBonusDiceModal } from "./SpellBonusDiceModal";

const getIcon = (iconName) => {
  const iconMap = {
    Wand2: Wand2,
    Zap: Zap,
    BookOpen: BookOpen,
    Shield: Shield,
    Eye: Eye,
    Heart: Heart,
    PawPrint: Squirrel,
    Skull: Skull,
    GraduationCap: BookOpen,
    Moon: Eye,
    Ban: Skull,
    Scroll: BookOpen,
  };
  return iconMap[iconName] || Star;
};

const getAdditionalStyles = (theme) => ({
  subjectCard: {
    backgroundColor: theme.surface || "#ffffff",
    border: `1px solid ${theme.border || "#e5e7eb"}`,
    borderRadius: "12px",
    marginBottom: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  subjectHeader: {
    padding: "16px 20px",
    backgroundColor: theme.surface || "#ffffff",
    borderBottom: `1px solid ${theme.border || "#e5e7eb"}`,
    transition: "all 0.2s ease",
  },
  subjectTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  subjectTitle: {
    fontSize: "20px",
    fontWeight: "600",
    margin: 0,
  },
  subjectStats: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  subjectStatText: {
    fontSize: "14px",
    color: theme.textSecondary || "#6b7280",
    fontWeight: "500",
  },
  subjectProgress: {
    height: "8px",
    backgroundColor: theme.background || "#f8fafc",
    borderRadius: "4px",
    overflow: "hidden",
    flex: 1,
    maxWidth: "200px",
  },
  subjectProgressFill: {
    height: "100%",
    transition: "width 0.3s ease",
    borderRadius: "4px",
  },
  subjectContent: {
    padding: "0",
  },
  filterContainer: {
    padding: "16px 20px",
    backgroundColor: theme.background || "#f8fafc",
    borderBottom: `1px solid ${theme.border || "#e5e7eb"}`,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  filterIcon: {
    color: theme.textSecondary || "#6b7280",
  },
  filterSelect: {
    padding: "8px 12px",
    border: `2px solid ${theme.border || "#e5e7eb"}`,
    borderRadius: "8px",
    backgroundColor: theme.surface || "#ffffff",
    color: theme.text || "#1f2937",
    fontSize: "14px",
    fontFamily: "inherit",
  },
  levelSection: {
    borderBottom: `1px solid ${theme.border || "#e5e7eb"}`,
  },
  sectionToggle: {
    width: "100%",
    padding: "16px 20px",
    backgroundColor: "transparent",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    color: theme.text || "#1f2937",
    fontSize: "16px",
    fontWeight: "500",
  },
  sectionLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sectionRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  sectionProgressText: {
    fontSize: "14px",
    color: theme.textSecondary || "#6b7280",
    fontWeight: "500",
  },
  sectionProgress: {
    width: "100px",
    height: "6px",
    backgroundColor: theme.background || "#f8fafc",
    borderRadius: "3px",
    overflow: "hidden",
  },
  sectionProgressFill: {
    height: "100%",
    backgroundColor: theme.success || "#10b981",
    transition: "width 0.3s ease",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: theme.surface || "#ffffff",
  },
  tableHeader: {
    backgroundColor: theme.background || "#f8fafc",
  },
  tableHeaderCell: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px",
    color: theme.text || "#1f2937",
    borderBottom: `2px solid ${theme.border || "#e5e7eb"}`,
  },
  tableHeaderCellCenter: {
    padding: "12px 16px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "14px",
    color: theme.text || "#1f2937",
    borderBottom: `2px solid ${theme.border || "#e5e7eb"}`,
  },
  tableRow: {
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: theme.background || "#f8fafc",
    },
  },
  tableRowMastered: {
    backgroundColor: `${theme.success || "#10b981"}10`,
  },
  tableCell: {
    padding: "12px 16px",
    borderBottom: `1px solid ${theme.border || "#e5e7eb"}`,
    fontSize: "14px",
    color: theme.text || "#1f2937",
    verticalAlign: "middle",
  },
  tableCellMenu: {
    padding: "8px",
    borderBottom: `1px solid ${theme.border || "#e5e7eb"}`,
    position: "relative",
    textAlign: "center",
  },
  spellNameContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  spellName: {
    fontWeight: "500",
    fontSize: "14px",
    display: "flex",
  },
  tagsContainer: {
    display: "flex",
    gap: "4px",
    flexWrap: "wrap",
  },
  tag: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "2px 6px",
    borderRadius: "12px",
    color: "white",
  },
  attemptsContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    color: theme.textSecondary || "#6b7280",
  },
  checkboxFirst: {
    accentColor: theme.primary || "#6366f1",
  },
  checkboxSecond: {
    accentColor: theme.success || "#10b981",
  },
  checkboxText: {
    fontSize: "12px",
    fontWeight: "500",
  },
  criticalSuccessContainer: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    justifyContent: "center",
  },
  criticalSuccessText: {
    fontSize: "12px",
    fontWeight: "600",
    color: theme.warning || "#f59e0b",
  },
  noCriticalText: {
    color: theme.textSecondary || "#6b7280",
    fontSize: "14px",
  },
  attemptButton: {
    backgroundColor: theme.primary || "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  attemptButtonDisabled: {
    backgroundColor: theme.textSecondary || "#6b7280",
    cursor: "not-allowed",
    opacity: 0.6,
  },
  spellAttackButton: {
    backgroundColor: "#d1323d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  savingThrowButton: {
    backgroundColor: "#3B82F6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "default",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  damageButton: {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 8px",
    fontSize: "11px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "3px",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    marginLeft: "4px",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  menuButton: {
    padding: "6px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  menuDropdown: {
    position: "absolute",
    top: "100%",
    right: "0",
    backgroundColor: theme.surface || "#ffffff",
    border: `1px solid ${theme.border || "#e5e7eb"}`,
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    zIndex: 1000,
    minWidth: "120px",
  },
  menuItem: {
    width: "100%",
    padding: "8px 12px",
    border: "none",
    backgroundColor: "transparent",
    color: theme.text || "#1f2937",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: theme.background || "#f8fafc",
    },
    position: "relative",
    zIndex: 2,
  },
  editModal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  editModalContent: {
    backgroundColor: theme.surface || "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: `1px solid ${theme.border || "#e5e7eb"}`,
    minWidth: "400px",
    maxWidth: "90vw",
    maxHeight: "90vh",
    overflow: "auto",
  },
  editModalTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: theme.text || "#1f2937",
    marginBottom: "20px",
    margin: 0,
  },
  editFormGroup: {
    marginBottom: "16px",
  },
  editFormLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: theme.text || "#1f2937",
    marginBottom: "8px",
  },
  editFormSelect: {
    width: "100%",
    padding: "8px 12px",
    border: `2px solid ${theme.border || "#e5e7eb"}`,
    borderRadius: "6px",
    backgroundColor: theme.surface || "#ffffff",
    color: theme.text || "#1f2937",
    fontSize: "14px",
    fontFamily: "inherit",
  },
  editFormCheckboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: theme.text || "#1f2937",
    cursor: "pointer",
  },
  editFormCheckbox: {
    accentColor: theme.primary || "#6366f1",
  },
  editFormActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px",
  },
  editFormSaveButton: {
    backgroundColor: theme.success || "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s ease",
  },
  editFormCancelButton: {
    backgroundColor: theme.error || "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s ease",
  },
  searchResultsContainer: {
    padding: "16px 20px",
  },
  noResultsContainer: {
    textAlign: "center",
    padding: "40px 20px",
    color: theme.textSecondary || "#6b7280",
  },
  noResultsIcon: {
    marginBottom: "16px",
    opacity: 0.5,
  },
  noResultsTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 8px 0",
    color: theme.text || "#1f2937",
  },
  noResultsMessage: {
    fontSize: "14px",
    margin: "0 0 20px 0",
  },
  clearSearchButton: {
    backgroundColor: theme.primary || "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  searchHighlight: {
    backgroundColor: theme.warning || "#f59e0b",
    color: "white",
    padding: "2px 4px",
    borderRadius: "3px",
    fontWeight: "600",
  },
});

export const SubjectCard = ({
  criticalSuccesses,
  discordUserId,
  expandedSections,
  expandedSubjects,
  selectedCharacter,
  setCriticalSuccesses,
  setError,
  setExpandedSections,
  setExpandedSubjects,
  setSpellAttempts,
  spellAttempts,
  failedAttempts,
  setFailedAttempts,
  researchedSpells,
  setResearchedSpells,
  arithmancticTags,
  runicTags,
  subjectData,
  subjectName,
  supabase,
  globalSearchTerm = "",
  onSpellProgressUpdate,
}) => {
  const {
    attemptSpell,
    attemptArithmancySpell,
    attemptRunesSpell,
    rollResearch,
  } = useRollFunctions();
  const { showRollResult } = useRollModal();
  const { theme } = useTheme();

  const getSpellcastingAbility = (castingStyle) => {
    const spellcastingAbilityMap = {
      "Willpower Caster": "Charisma",
      "Technique Caster": "Wisdom",
      "Intellect Caster": "Intelligence",
      "Vigor Caster": "Constitution",
      Willpower: "Charisma",
      Technique: "Wisdom",
      Intellect: "Intelligence",
      Vigor: "Constitution",
    };
    return spellcastingAbilityMap[castingStyle] || null;
  };

  const getSpellcastingAbilityModifier = (character) => {
    const spellcastingAbility = getSpellcastingAbility(character.castingStyle);
    if (!spellcastingAbility) return 0;

    const abilityKey = spellcastingAbility.toLowerCase();
    const abilityScore = character[abilityKey] || 10;
    return Math.floor((abilityScore - 10) / 2);
  };

  const extractDamageInfo = (spellDescription, spellName) => {
    if (!spellDescription) return null;

    const damageRegex = /(\d+d\d+(?:\s*\+\s*\d+)?)\s+(\w+)\s+damage/gi;
    const matches = [...spellDescription.matchAll(damageRegex)];

    if (matches.length === 0) return null;

    const match = matches[0];
    return {
      dice: match[1],
      type: match[2],
    };
  };

  const extractSavingThrowInfo = (spellDescription) => {
    if (!spellDescription) return null;

    const savingThrowRegex =
      /(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+saving\s+throw/gi;
    const matches = [...spellDescription.matchAll(savingThrowRegex)];

    if (matches.length === 0) return null;

    const match = matches[0];
    return {
      ability: match[1],
    };
  };

  const getSpellSaveDC = (character) => {
    if (!character) return 8;

    const spellcastingModifier = getSpellcastingAbilityModifier(character);
    return 8 + character.proficiencyBonus + spellcastingModifier;
  };

  const handleSpellAttack = async (spellName) => {
    if (!selectedCharacter) return;

    const spellcastingAbility = getSpellcastingAbility(
      selectedCharacter.castingStyle
    );
    if (!spellcastingAbility) return;

    try {
      const spellcastingModifier =
        getSpellcastingAbilityModifier(selectedCharacter);
      const totalModifier =
        selectedCharacter.proficiencyBonus + spellcastingModifier;

      const rollValue = Math.floor(Math.random() * 20) + 1;
      const total = rollValue + totalModifier;

      const isCriticalSuccess = rollValue === 20;
      const isCriticalFailure = rollValue === 1;

      const rollResult = {
        d20Roll: rollValue,
        modifier: totalModifier,
        total: total,
        isCriticalSuccess: isCriticalSuccess,
        isCriticalFailure: isCriticalFailure,
      };

      showRollResult({
        title: `${spellName} - Spell Attack`,
        rollValue: rollValue,
        modifier: totalModifier,
        total: total,
        isCriticalSuccess: isCriticalSuccess,
        isCriticalFailure: isCriticalFailure,
        character: selectedCharacter,
        type: "spellattack",
        description: `d20 + ${selectedCharacter.proficiencyBonus} (Prof) + ${spellcastingModifier} (${spellcastingAbility}) = ${total}`,
      });

      const additionalFields = [
        {
          name: "Spell",
          value: spellName,
          inline: true,
        },
        {
          name: "Modifiers",
          value: `Prof: +${
            selectedCharacter.proficiencyBonus
          }, ${spellcastingAbility}: ${formatModifier(spellcastingModifier)}`,
          inline: true,
        },
      ];

      await sendDiscordRollWebhook({
        character: selectedCharacter,
        rollType: "Spell Attack Roll",
        title: `${spellName} - Spell Attack`,
        embedColor: getRollResultColor(rollResult, ROLL_COLORS.spell),
        rollResult,
        fields: additionalFields,
        useCharacterAvatar: true,
      });
    } catch (error) {
      console.error("Error rolling spell attack:", error);
    }
  };

  const handleDamageRoll = async (spellName, damageInfo) => {
    if (!selectedCharacter || !damageInfo) return;

    try {
      const diceMatch = damageInfo.dice.match(/(\d+)d(\d+)(?:\+(\d+))?/);
      if (!diceMatch) return;

      const numDice = parseInt(diceMatch[1]);
      const diceSize = parseInt(diceMatch[2]);
      const bonus = parseInt(diceMatch[3]) || 0;

      let total = bonus;
      const rolls = [];
      for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * diceSize) + 1;
        rolls.push(roll);
        total += roll;
      }

      showRollResult({
        title: `${spellName} - Damage Roll`,
        rollValue: rolls.reduce((sum, roll) => sum + roll, 0),
        modifier: bonus,
        total: total,
        character: selectedCharacter,
        type: "damage",
        description: `${damageInfo.dice} ${damageInfo.type} damage = ${total}`,
        individualDiceResults: rolls,
        diceQuantity: numDice,
        diceType: diceSize,
      });

      const additionalFields = [
        {
          name: "Spell",
          value: spellName,
          inline: true,
        },
        {
          name: "Damage Type",
          value:
            damageInfo.type.charAt(0).toUpperCase() + damageInfo.type.slice(1),
          inline: true,
        },
        {
          name: "Dice Rolled",
          value: rolls.join(", ") + (bonus > 0 ? ` + ${bonus}` : ""),
          inline: true,
        },
      ];

      await sendDiscordRollWebhook({
        character: selectedCharacter,
        rollType: "Damage Roll",
        title: `${spellName} - ${
          damageInfo.type.charAt(0).toUpperCase() + damageInfo.type.slice(1)
        } Damage`,
        embedColor: 0xef4444,
        rollResult: {
          d20Roll: rolls.reduce((sum, roll) => sum + roll, 0),
          rollValue: rolls.reduce((sum, roll) => sum + roll, 0),
          modifier: bonus,
          total: total,
          isCriticalSuccess: false,
          isCriticalFailure: false,
        },
        fields: additionalFields,
        useCharacterAvatar: true,
      });
    } catch (error) {
      console.error("Error rolling damage:", error);
    }
  };

  const [restrictionModal, setRestrictionModal] = useState({
    isOpen: false,
    spellName: "",
    onConfirm: null,
  });

  const baseStyles = createSpellBookStyles(theme);
  const additionalStyles = getAdditionalStyles(theme);
  const styles = { ...baseStyles, ...additionalStyles };

  const [attemptingSpells, setAttemptingSpells] = useState({});
  const [alternateAttemptsModal, setAlternateAttemptsModal] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const [openMenus, setOpenMenus] = useState({});
  const [editingSpell, setEditingSpell] = useState(null);
  const [editFormData, setEditFormData] = useState({
    successfulAttempts: 0,
    hasCriticalSuccess: false,
    hasFailedAttempt: false,
    researched: false,
    hasArithmancticTag: false,
    hasRunicTag: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");

  const [bonusDiceModalState, setBonusDiceModalState] = useState({
    isOpen: false,
    props: {},
  });

  const showBonusDiceModal = (props) => {
    setBonusDiceModalState({
      isOpen: true,
      props,
    });
  };

  const hideBonusDiceModal = () => {
    setBonusDiceModalState({
      isOpen: false,
      props: {},
    });
  };

  const getSpellData = (spellName) => {
    if (!spellName) return null;

    for (const [subject, subjectData] of Object.entries(spellsData)) {
      if (subjectData.levels) {
        for (const [, levelSpells] of Object.entries(subjectData.levels)) {
          const spell = levelSpells.find((s) => s.name === spellName);
          if (spell) {
            return {
              ...spell,
              subject: subject,
            };
          }
        }
      }
    }
    return null;
  };

  const handleSpellAttempt = async (spellName, subject) => {
    const spellData = getSpellData(spellName);

    if (spellData && spellData.restriction === true) {
      setRestrictionModal({
        isOpen: true,
        spellName: spellName,
        onConfirm: () => {
          setRestrictionModal({
            isOpen: false,
            spellName: "",
            onConfirm: null,
          });
          proceedWithSpellCasting(spellName, subject);
        },
      });
      return;
    }

    proceedWithSpellCasting(spellName, subject);
  };

  const proceedWithSpellCasting = async (spellName, subject) => {
    await attemptSpell({
      spellName,
      subject,
      getSpellModifier,
      selectedCharacter,
      setSpellAttempts,
      discordUserId: selectedCharacter.discord_user_id,
      setAttemptingSpells,
      setCriticalSuccesses,
      setFailedAttempts,
      updateSpellProgressSummary,
      supabase,
      showBonusDiceModal,
      hideBonusDiceModal,
    });
  };

  const handleRestrictionCancel = () => {
    setRestrictionModal({ isOpen: false, spellName: "", onConfirm: null });
  };

  const handleAlternateCasting = (spellName, subject, castingType) => {
    const spellData = getSpellData(spellName);

    if (spellData && spellData.restriction === true) {
      setRestrictionModal({
        isOpen: true,
        spellName: spellName,
        onConfirm: () => {
          setRestrictionModal({
            isOpen: false,
            spellName: "",
            onConfirm: null,
          });
          proceedWithAlternateCasting(spellName, subject, castingType);
          setAlternateAttemptsModal(null);
        },
      });
    } else {
      proceedWithAlternateCasting(spellName, subject, castingType);
      setAlternateAttemptsModal(null);
    }
  };

  const proceedWithAlternateCasting = async (
    spellName,
    subject,
    castingType
  ) => {
    const castingFunction =
      castingType === "arithmancy" ? attemptArithmancySpell : attemptRunesSpell;

    await castingFunction({
      spellName,
      subject,
      selectedCharacter,
      setSpellAttempts,
      discordUserId: selectedCharacter.discord_user_id,
      setAttemptingSpells,
      setCriticalSuccesses,
      setFailedAttempts,
      updateSpellProgressSummary,
    });
  };

  const getSubjectStats = (subject) => {
    const levels = spellsData[subject].levels;
    const totalSpells = Object.values(levels).reduce(
      (total, spells) => total + spells.length,
      0
    );

    const allSpells = Object.values(levels).flat();

    const masteredSpells = allSpells.filter((spellObj) => {
      const spellName = spellObj.name;
      const attempts = spellAttempts?.[spellName] ?? {};
      return attempts[1] && attempts[2];
    });

    return {
      totalSpells,
      masteredCount: masteredSpells.length,
      progressPercentage: Math.round(
        (masteredSpells.length / totalSpells) * 100
      ),
    };
  };

  const { totalSpells, masteredCount, progressPercentage } =
    getSubjectStats(subjectName);

  const toggleDescription = (spellName) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [spellName]: !prev[spellName],
    }));
  };

  const activeSearchTerm = searchTerm || globalSearchTerm;

  const allSpells = useMemo(() => {
    return Object.entries(subjectData.levels).flatMap(([level, spells]) =>
      spells.map((spell) => ({ ...spell, level, subject: subjectName }))
    );
  }, [subjectData.levels, subjectName]);

  const searchResults = useMemo(() => {
    if (!activeSearchTerm || activeSearchTerm.trim() === "") return [];

    const searchTermLower = activeSearchTerm.toLowerCase().trim();

    return allSpells.filter((spell) => {
      const nameMatch = spell.name.toLowerCase().includes(searchTermLower);
      const descriptionMatch = spell.description
        ?.toLowerCase()
        .includes(searchTermLower);
      const tagMatch = spell.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTermLower)
      );

      return nameMatch || descriptionMatch || tagMatch;
    });
  }, [allSpells, activeSearchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const updateSpellProgressSummary = async (
    spellName,
    isSuccess,
    isNaturalTwenty = false
  ) => {
    if (!selectedCharacter) return;

    const characterOwnerDiscordId = selectedCharacter.discord_user_id;
    if (!characterOwnerDiscordId) return;

    try {
      const { data: existingProgress, error: fetchError } = await supabase
        .from("spell_progress_summary")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .eq("discord_user_id", characterOwnerDiscordId)
        .eq("spell_name", spellName)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching spell progress:", fetchError);
        return;
      }

      if (existingProgress) {
        const currentAttempts = existingProgress.successful_attempts || 0;
        const newAttempts = isNaturalTwenty
          ? 2
          : Math.min(currentAttempts + (isSuccess ? 1 : 0), 2);

        const updateData = {
          successful_attempts: newAttempts,
          has_natural_twenty:
            existingProgress.has_natural_twenty || isNaturalTwenty,
          has_failed_attempt: existingProgress.has_failed_attempt || !isSuccess,
        };

        const { error: updateError } = await supabase
          .from("spell_progress_summary")
          .update(updateData)
          .eq("id", existingProgress.id);

        if (updateError) {
          console.error("Error updating spell progress:", updateError);
        }
      } else {
        const insertData = {
          character_id: selectedCharacter.id,
          discord_user_id: characterOwnerDiscordId,
          spell_name: spellName,
          successful_attempts: isSuccess ? (isNaturalTwenty ? 2 : 1) : 0,
          has_natural_twenty: isNaturalTwenty,
          has_failed_attempt: !isSuccess,
        };

        const { error: insertError } = await supabase
          .from("spell_progress_summary")
          .insert([insertData]);

        if (insertError) {
          console.error("Error inserting spell progress:", insertError);
        }
      }
    } catch (error) {
      console.error("Error updating spell progress summary:", error);
    }
  };

  const toggleMenu = (spellName) => {
    setOpenMenus((prev) => {
      const newMenus = {};
      if (!prev[spellName]) {
        newMenus[spellName] = true;
      }
      return newMenus;
    });
  };

  const closeAllMenus = () => {
    setOpenMenus({});
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <div style={styles.noResultsContainer}>
          <Search size={48} style={styles.noResultsIcon} />
          <p style={styles.noResultsTitle}>No spells found</p>
          <p style={styles.noResultsMessage}>
            No spells found matching your search criteria.
          </p>
          <button onClick={clearSearch} style={styles.clearSearchButton}>
            Clear Search
          </button>
        </div>
      );
    }

    return (
      <div style={styles.searchResultsContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={{ ...styles.tableHeaderCell, width: "3rem" }}>#</th>
              <th style={styles.tableHeaderCell}>Spell Name</th>
              <th style={styles.tableHeaderCell}>Successful Attempts</th>
              <th style={styles.tableHeaderCellCenter}>Critical</th>
              <th style={styles.tableHeaderCellCenter}>Attempt</th>
              <th style={styles.tableHeaderCellCenter}>Arithmancy</th>
              <th style={styles.tableHeaderCellCenter}>Runes</th>
              <th style={styles.tableHeaderCellCenter}>Research</th>
              <th style={{ ...styles.tableHeaderCellCenter, width: "3rem" }}>
                Menu
              </th>
            </tr>
          </thead>
          <tbody>
            {searchResults
              .map((spellObj, index) =>
                renderSpellRow(spellObj, index, subjectName, true)
              )
              .flat()}
          </tbody>
        </table>
      </div>
    );
  };

  const AlternateAttemptsModal = ({ spellName, spellObj, subject }) => {
    if (!alternateAttemptsModal) return null;

    const isAttempting = attemptingSpells[spellName] || false;
    const isMastered =
      (spellAttempts[spellName]?.[1] && spellAttempts[spellName]?.[2]) || false;
    const isResearched = researchedSpells[spellName] || false;

    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Alternate Attempts: {spellName}</h3>
            <button
              onClick={() => setAlternateAttemptsModal(null)}
              style={styles.modalCloseButton}
            >
              <X size={20} />
            </button>
          </div>

          <div style={styles.modalBody}>
            <p style={styles.modalDescription}>
              Choose an alternate casting method for this spell:
            </p>

            <div style={styles.alternateButtonsGrid}>
              <button
                onClick={() =>
                  handleAlternateCasting(spellName, subject, "arithmancy")
                }
                disabled={isAttempting || isMastered || !selectedCharacter}
                style={styles.alternateButton}
              >
                <Brain size={20} />
                <div style={styles.alternateButtonContent}>
                  <div style={styles.alternateButtonTitle}>Arithmancy Cast</div>
                  <div style={styles.alternateButtonSubtitle}>
                    Intelligence + Wand modifier
                  </div>
                  <div style={styles.alternateButtonModifier}>
                    +
                    {Math.floor(
                      (selectedCharacter?.abilityScores?.intelligence - 10) / 2
                    ) || 0}
                  </div>
                </div>
              </button>

              <button
                onClick={() =>
                  handleAlternateCasting(spellName, subject, "runes")
                }
                disabled={isAttempting || isMastered || !selectedCharacter}
                style={styles.alternateButton}
              >
                <WisdomIcon size={20} />
                <div style={styles.alternateButtonContent}>
                  <div style={styles.alternateButtonTitle}>Runic Cast</div>
                  <div style={styles.alternateButtonSubtitle}>
                    Wisdom + Wand modifier
                  </div>
                  <div style={styles.alternateButtonModifier}>
                    +
                    {Math.floor(
                      (selectedCharacter?.abilityScores?.wisdom - 10) / 2
                    ) || 0}
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  markSpellAsResearched(spellName);
                  setAlternateAttemptsModal(null);
                }}
                disabled={
                  isResearched ||
                  isMastered ||
                  !selectedCharacter ||
                  isAttempting ||
                  !findSpellData(spellName).year
                }
                style={styles.alternateButton}
              >
                <BookOpen size={20} />
                <div style={styles.alternateButtonContent}>
                  <div style={styles.alternateButtonTitle}>Research Spell</div>
                  <div style={styles.alternateButtonSubtitle}>
                    History of Magic Check
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSpellRow = (spellObj, index, subject, showLevel = false) => {
    const spellName = spellObj.name;
    const successCount = getSuccessfulAttempts(spellName);
    const attempts = spellAttempts[spellName] || {};
    const hasCriticalSuccess = criticalSuccesses[spellName] || false;
    const isResearched = researchedSpells[spellName] || false;
    const hasAttempts = Object.keys(attempts).length > 0 || successCount > 0;
    const hasFailedAttempt = failedAttempts[spellName] || false;
    const isAttempting = attemptingSpells[spellName] || false;
    const isMastered = attempts[1] && attempts[2];
    const isDescriptionExpanded = expandedDescriptions[spellName];

    const hasArithmancticTag =
      spellObj.tags?.includes("Arithmantic") ||
      arithmancticTags[spellName] ||
      (isResearched && hasSubclassFeature(selectedCharacter, "Researcher"));

    const hasRunicTag =
      spellObj.tags?.includes("Runic") ||
      runicTags[spellName] ||
      (isResearched && hasSubclassFeature(selectedCharacter, "Researcher"));

    const spellModifier = getSpellModifier(
      spellName,
      subject,
      selectedCharacter
    );
    const modifierDisplay =
      spellModifier !== 0 ? (
        <span
          style={{
            fontSize: "11px",
            color: spellModifier >= 0 ? "#10b981" : "#ef4444",
            fontWeight: "600",
            marginLeft: "4px",
          }}
        >
          ({spellModifier >= 0 ? "+" : ""}
          {spellModifier})
        </span>
      ) : null;

    const mainRow = (
      <tr
        key={spellName}
        style={{
          ...styles.tableRow,
          ...(isMastered ? styles.tableRowMastered : {}),
        }}
      >
        <td style={styles.tableCell}>
          {showLevel ? `${spellObj.level.replace("Level ", "")}` : index + 1}
        </td>
        <td style={styles.tableCell}>
          <div style={styles.spellNameContainer}>
            <span style={styles.spellName}>
              {highlightSearchTerm(spellName)}
              {spellObj.description && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDescription(spellName);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                    color: theme.text || "#1f2937",
                  }}
                  title={
                    isDescriptionExpanded
                      ? "Hide description"
                      : "Click to show description"
                  }
                >
                  <Info
                    size={14}
                    style={{
                      marginTop: "-4px",
                      marginLeft: "4px",
                      color: isDescriptionExpanded
                        ? theme.success
                        : theme.textSecondary,
                    }}
                  />
                </button>
              )}
            </span>
            {modifierDisplay}
            <div style={styles.tagsContainer}>
              {spellObj.tags?.map((tag) => (
                <span
                  key={tag}
                  style={{
                    ...styles.tag,
                    backgroundColor:
                      tag === "Arithmantic" ? "#3b82f6" : "#8b5cf6",
                  }}
                >
                  {tag}
                </span>
              ))}
              {(isMastered || hasAttempts || hasFailedAttempt) && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    backgroundColor:
                      isMastered && hasCriticalSuccess
                        ? "#ffd700"
                        : isMastered
                        ? theme.success || "#10b981"
                        : hasAttempts
                        ? "#f59e0b"
                        : hasFailedAttempt
                        ? theme.error || "#ef4444"
                        : "#6b7280",
                    color:
                      (isMastered && hasCriticalSuccess) || hasAttempts
                        ? "#000000"
                        : "white",
                    boxShadow:
                      isMastered && hasCriticalSuccess
                        ? "0 0 8px rgba(255, 215, 0, 0.5)"
                        : "none",
                  }}
                >
                  {isMastered && hasCriticalSuccess
                    ? "★ Critical"
                    : isMastered
                    ? "Mastered"
                    : hasAttempts
                    ? "Attempted"
                    : hasFailedAttempt
                    ? "Failed"
                    : "Unknown"}
                </span>
              )}
              {isResearched && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    backgroundColor: theme.warning || "#f59e0b",
                    color: "white",
                  }}
                >
                  Researched
                </span>
              )}
              {hasArithmancticTag && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                  }}
                  title="Arithmantic: Enhanced with mathematical precision"
                >
                  🔢 Arithmantic
                </span>
              )}
              {hasRunicTag && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    backgroundColor: "#8b5cf6",
                    color: "white",
                  }}
                  title="Runic: Enhanced with ancient symbols"
                >
                  ᚱ Runic
                </span>
              )}
            </div>
          </div>
        </td>
        <td style={styles.tableCell}>
          <div style={styles.attemptsContainer}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={Boolean(attempts[1])}
                disabled={true}
                readOnly={true}
                style={styles.checkboxFirst}
              />
              <span style={styles.checkboxText}>1st</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={Boolean(attempts[2])}
                disabled={true}
                readOnly={true}
                style={styles.checkboxSecond}
              />
              <span style={styles.checkboxText}>2nd</span>
            </label>
          </div>
        </td>
        <td style={{ ...styles.tableCell, textAlign: "center" }}>
          {hasCriticalSuccess ? (
            <div style={styles.criticalSuccessContainer}>
              <Star
                size={20}
                color={theme.warning || "#ffd700"}
                fill={theme.warning || "#ffd700"}
                title="Critical Success - Mastered with Natural 20!"
              />
              <span style={styles.criticalSuccessText}>20</span>
            </div>
          ) : (
            <span style={styles.noCriticalText}>-</span>
          )}
        </td>
        <td style={{ ...styles.tableCell, textAlign: "center" }}>
          {isMastered ? (
            <div style={styles.buttonContainer}>
              {(() => {
                const spellData = getSpellData(spellName);
                const savingThrowInfo = extractSavingThrowInfo(
                  spellData?.description
                );
                const damageInfo = extractDamageInfo(
                  spellData?.description,
                  spellName
                );

                if (savingThrowInfo) {
                  return (
                    <button
                      disabled={true}
                      style={{
                        ...styles.savingThrowButton,
                      }}
                    >
                      <Shield size={14} />
                      {`${savingThrowInfo.ability} Save DC ${getSpellSaveDC(
                        selectedCharacter
                      )}`}
                    </button>
                  );
                } else {
                  return (
                    <button
                      onClick={() => handleSpellAttack(spellName)}
                      disabled={isAttempting || !selectedCharacter}
                      style={{
                        ...styles.spellAttackButton,
                        ...(isAttempting || !selectedCharacter
                          ? styles.attemptButtonDisabled
                          : {}),
                      }}
                    >
                      <Target size={14} />
                      {isAttempting
                        ? "Rolling..."
                        : `Spell Attack ${formatModifier(
                            selectedCharacter.proficiencyBonus +
                              getSpellcastingAbilityModifier(selectedCharacter)
                          )}`}
                    </button>
                  );
                }
              })()}
              {(() => {
                const spellData = getSpellData(spellName);
                const damageInfo = extractDamageInfo(
                  spellData?.description,
                  spellName
                );
                return damageInfo ? (
                  <button
                    onClick={() => handleDamageRoll(spellName, damageInfo)}
                    disabled={isAttempting || !selectedCharacter}
                    style={{
                      ...styles.damageButton,
                      ...(isAttempting || !selectedCharacter
                        ? styles.attemptButtonDisabled
                        : {}),
                    }}
                  >
                    <Dice6 size={12} />
                    {damageInfo.dice}
                  </button>
                ) : null;
              })()}
            </div>
          ) : (
            <button
              onClick={() => handleSpellAttempt(spellName, subject)}
              disabled={isAttempting || !selectedCharacter}
              style={{
                ...styles.attemptButton,
                ...(isAttempting || !selectedCharacter
                  ? styles.attemptButtonDisabled
                  : {}),
              }}
            >
              <Dice6 size={14} />
              {isAttempting ? "Rolling..." : "Attempt"}
            </button>
          )}
        </td>
        {showLevel && (
          <td style={{ ...styles.tableCell, textAlign: "center" }}>
            {hasArithmancticTag ? (
              <span style={{ color: theme.success, fontWeight: "bold" }}>
                ✓
              </span>
            ) : (
              <span style={styles.noCriticalText}>-</span>
            )}
          </td>
        )}
        {showLevel && (
          <td style={{ ...styles.tableCell, textAlign: "center" }}>
            {hasRunicTag ? (
              <span style={{ color: theme.success, fontWeight: "bold" }}>
                ✓
              </span>
            ) : (
              <span style={styles.noCriticalText}>-</span>
            )}
          </td>
        )}
        {showLevel && (
          <td style={{ ...styles.tableCell, textAlign: "center" }}>
            {isResearched ? (
              <span style={{ color: theme.success, fontWeight: "bold" }}>
                ✓
              </span>
            ) : (
              <span style={styles.noCriticalText}>-</span>
            )}
          </td>
        )}
        <td style={{ ...styles.tableCellMenu, position: "relative" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu(spellName);
            }}
            style={{
              ...styles.menuButton,
              backgroundColor: openMenus[spellName] ? "#3b82f6" : "transparent",
              color: openMenus[spellName] ? "white" : theme.text,
            }}
          >
            <MoreVertical size={16} />
          </button>

          {openMenus[spellName] && (
            <div
              style={{
                right: "20px",
                top: "auto",
                bottom: "auto",
                backgroundColor: theme.surface || "#ffffff",
                border: `1px solid ${theme.border || "#e5e7eb"}`,
                borderRadius: "8px",
                boxShadow: "0 8px 25px -8px rgba(0, 0, 0, 0.25)",
                zIndex: 9999,
                minWidth: "160px",
                padding: "4px",
                display: "block",
              }}
            >
              <button
                onClick={() => {
                  setAlternateAttemptsModal(spellName);
                  closeAllMenus();
                }}
                style={styles.menuItem}
              >
                <Dice6 size={14} />
                Alternate Casting
              </button>
              <button
                onClick={() => startEditing(spellName)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  borderRadius: "4px",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: theme.text || "#000000",
                  fontFamily: "inherit",
                  transition: "background-color 0.2s ease",
                }}
              >
                <Edit3 size={14} />
                Edit Progress
              </button>
            </div>
          )}
        </td>
      </tr>
    );

    const descriptionRow =
      isDescriptionExpanded && spellObj.description ? (
        <tr key={`${spellName}-description`}>
          <td
            colSpan={showLevel ? "9" : "6"}
            style={{ padding: "0", border: "none" }}
          >
            <div
              style={{
                padding: "16px",
                backgroundColor: theme.background,
                border: theme.border,
                borderRadius: "8px",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: "8px",
                  fontSize: "16px",
                }}
              >
                {spellName}
              </div>
              <div
                style={{
                  fontStyle: "italic",
                  color: theme.success,
                  marginBottom: "12px",
                  fontSize: "13px",
                }}
              >
                {spellObj.level} •{" "}
                {spellObj.castingTime || "Unknown casting time"} • Range:{" "}
                {spellObj.range || "Unknown"} • Duration:{" "}
                {spellObj.duration || "Unknown"}
              </div>
              <div
                style={{
                  whiteSpace: "pre-line",
                  color: theme.text,
                  marginBottom: "12px",
                }}
              >
                {highlightSearchTerm(spellObj.description)}
              </div>
              {spellObj.higherLevels && (
                <div
                  style={{
                    marginBottom: "12px",
                    fontStyle: "italic",
                    color: theme.primary,
                  }}
                >
                  <strong>At Higher Levels:</strong> {spellObj.higherLevels}
                </div>
              )}
              {spellObj.tags && spellObj.tags.length > 0 && (
                <div>
                  {spellObj.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        backgroundColor: theme.background,
                        color: theme.text,
                        fontSize: "12px",
                        borderRadius: "4px",
                        marginRight: "6px",
                        fontWeight: "500",
                      }}
                    >
                      {highlightSearchTerm(tag)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </td>
        </tr>
      ) : null;

    return [mainRow, descriptionRow].filter(Boolean);
  };

  const startEditing = (spellName) => {
    const attempts = spellAttempts[spellName] || {};
    const successCount = Object.values(attempts).filter(Boolean).length;
    const hasCritical = criticalSuccesses[spellName] || false;
    const hasFailed = failedAttempts[spellName] || false;
    const isResearched = researchedSpells[spellName] || false;

    const spellData = findSpellData(spellName);

    const hasArithmancticTag =
      spellData?.tags?.includes("Arithmantic") ||
      arithmancticTags[spellName] ||
      (isResearched && hasSubclassFeature(selectedCharacter, "Researcher"));

    const hasRunicTag =
      spellData?.tags?.includes("Runic") ||
      runicTags[spellName] ||
      (isResearched && hasSubclassFeature(selectedCharacter, "Researcher"));

    setEditFormData({
      successfulAttempts: successCount,
      hasCriticalSuccess: hasCritical,
      hasFailedAttempt: hasFailed,
      researched: isResearched,
      hasArithmancticTag: hasArithmancticTag,
      hasRunicTag: hasRunicTag,
    });
    setEditingSpell(spellName);
    closeAllMenus();
  };

  const findSpellData = (spellName) => {
    for (const [, spells] of Object.entries(subjectData.levels)) {
      const spell = spells.find((s) => s.name === spellName);
      if (spell) return spell;
    }
    return null;
  };

  const calculateResearchDC = (
    playerYear,
    spellYear,
    spellName,
    selectedCharacter
  ) => {
    let baseDC = 8 + 2 * playerYear;

    const yearDifference = spellYear - playerYear;
    baseDC += yearDifference * 2;

    const difficultSpells = [
      "Abscondi",
      "Pellucidi Pellis",
      "Sagittario",
      "Confringo",
      "Devicto",
      "Stupefy",
      "Petrificus Totalus",
      "Protego",
      "Protego Maxima",
      "Finite Incantatem",
      "Confundo",
      "Bombarda",
      "Episkey",
      "Expelliarmus",
      "Incarcerous",
    ];

    if (difficultSpells.includes(spellName)) {
      baseDC += 3;
    }

    return Math.max(5, baseDC);
  };

  const markSpellAsResearched = async (spellName) => {
    if (!selectedCharacter || !discordUserId) return;

    const spellData = findSpellData(spellName);
    if (!spellData) {
      setError("Could not find spell data for research check");
      return;
    }

    const playerYear = selectedCharacter.year || 1;
    const spellYear = spellData.year || 1;
    const dc = calculateResearchDC(
      playerYear,
      spellYear,
      spellName,
      selectedCharacter
    );

    setAttemptingSpells((prev) => ({ ...prev, [spellName]: true }));

    try {
      let modifier = getSpellModifier(
        spellName,
        subjectName,
        selectedCharacter
      );

      if (hasSubclassFeature(selectedCharacter, "Researcher")) {
        const wisdomModifier = Math.floor(
          (selectedCharacter.abilityScores.wisdom - 10) / 2
        );
        const researcherBonus = Math.floor(wisdomModifier / 2);
        modifier += researcherBonus;
      }
      const characterOwnerDiscordId = selectedCharacter.discord_user_id;

      const rollResult = await rollResearch({
        spellName,
        subject: subjectName,
        selectedCharacter,
        dc,
        playerYear,
        spellYear,
        getSpellModifier: () => modifier,
        getModifierInfo,
        researcherBonus: hasSubclassFeature(selectedCharacter, "Researcher")
          ? Math.floor(
              Math.floor((selectedCharacter.abilityScores.wisdom - 10) / 2) / 2
            )
          : 0,
      });

      if (rollResult.isSuccess) {
        setResearchedSpells((prev) => ({ ...prev, [spellName]: true }));

        if (rollResult.isNaturalTwenty) {
          setSpellAttempts((prev) => ({
            ...prev,
            [spellName]: { 1: true, 2: false },
          }));
        }

        const { data: existingProgress, error: fetchError } = await supabase
          .from("spell_progress_summary")
          .select("*")
          .eq("character_id", selectedCharacter.id)
          .eq("discord_user_id", characterOwnerDiscordId)
          .eq("spell_name", spellName)
          .maybeSingle();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error(
            "Error fetching spell progress for research:",
            fetchError
          );
          return;
        }

        if (existingProgress) {
          const updateData = {
            researched: true,
            successful_attempts: rollResult.isNaturalTwenty
              ? Math.max(existingProgress.successful_attempts || 0, 1)
              : existingProgress.successful_attempts || 0,
            has_natural_twenty:
              existingProgress.has_natural_twenty || rollResult.isNaturalTwenty,
            has_arithmantic_tag: hasSubclassFeature(
              selectedCharacter,
              "Researcher"
            ),
            has_runic_tag: hasSubclassFeature(selectedCharacter, "Researcher"),
          };

          const { error: updateError } = await supabase
            .from("spell_progress_summary")
            .update(updateData)
            .eq("id", existingProgress.id);

          if (updateError) {
            console.error("Error updating spell research:", updateError);
            return;
          }
        } else {
          const insertData = {
            character_id: selectedCharacter.id,
            discord_user_id: characterOwnerDiscordId,
            spell_name: spellName,
            successful_attempts: rollResult.isNaturalTwenty ? 1 : 0,
            has_natural_twenty: false,
            has_failed_attempt: false,
            researched: true,

            has_arithmantic_tag: hasSubclassFeature(
              selectedCharacter,
              "Researcher"
            ),
            has_runic_tag: hasSubclassFeature(selectedCharacter, "Researcher"),
          };

          const { error: insertError } = await supabase
            .from("spell_progress_summary")
            .insert([insertData]);

          if (insertError) {
            console.error("Error inserting spell research:", insertError);
            return;
          }
        }
      }

      if (onSpellProgressUpdate) {
        await onSpellProgressUpdate();
      }
    } catch (error) {
      console.error("Error during research attempt:", error);
      setError("Error occurred during research attempt");
    } finally {
      setAttemptingSpells((prev) => ({ ...prev, [spellName]: false }));
    }
  };

  const cancelEditing = () => {
    setEditingSpell(null);
    setEditFormData({
      successfulAttempts: 0,
      hasCriticalSuccess: false,
      hasFailedAttempt: false,
      researched: false,
      hasArithmancticTag: false,
      hasRunicTag: false,
    });
  };

  const saveEdit = async () => {
    if (!selectedCharacter || !editingSpell) return;

    const characterOwnerDiscordId = selectedCharacter.discord_user_id;
    if (!characterOwnerDiscordId) return;

    try {
      const { data: existingProgress, error: fetchError } = await supabase
        .from("spell_progress_summary")
        .select("*")
        .eq("character_id", selectedCharacter.id)
        .eq("discord_user_id", characterOwnerDiscordId)
        .eq("spell_name", editingSpell)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching spell progress:", fetchError);
        return;
      }

      const updateData = {
        successful_attempts: editFormData.successfulAttempts,
        has_natural_twenty: editFormData.hasCriticalSuccess,
        has_failed_attempt: editFormData.hasFailedAttempt,
        researched: editFormData.researched,
        has_arithmantic_tag: editFormData.hasArithmancticTag,
        has_runic_tag: editFormData.hasRunicTag,
      };

      if (existingProgress) {
        const { error: updateError } = await supabase
          .from("spell_progress_summary")
          .update(updateData)
          .eq("id", existingProgress.id);

        if (updateError) {
          console.error("Error updating spell progress:", updateError);
          return;
        }
      } else {
        const insertData = {
          character_id: selectedCharacter.id,
          discord_user_id: characterOwnerDiscordId,
          spell_name: editingSpell,
          ...updateData,
        };

        const { error: insertError } = await supabase
          .from("spell_progress_summary")
          .insert([insertData]);

        if (insertError) {
          console.error("Error inserting spell progress:", insertError);
          return;
        }
      }

      if (onSpellProgressUpdate) {
        await onSpellProgressUpdate();
      }
      cancelEditing();
    } catch (error) {
      console.error("Error saving spell progress:", error);
      setError("Error saving spell progress");
    }
  };

  const toggleSubject = (subjectName) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectName]: !prev[subjectName],
    }));
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const getSuccessfulAttempts = (spellName) => {
    const attempts = spellAttempts[spellName] || {};
    return Object.values(attempts).filter(Boolean).length;
  };

  const highlightSearchTerm = (text) => {
    if (!activeSearchTerm || !text) return text;

    const regex = new RegExp(`(${activeSearchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={styles.searchHighlight}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const filteredLevels = useMemo(() => {
    if (!activeSearchTerm || activeSearchTerm.trim() === "") {
      return Object.entries(subjectData.levels);
    }
    return [];
  }, [subjectData.levels, activeSearchTerm]);

  const isExpanded = expandedSubjects[subjectName];
  const Icon = getIcon(subjectData.icon);

  if (activeSearchTerm && activeSearchTerm.trim() !== "") {
    return (
      <div key={subjectName} style={styles.subjectCard}>
        <div
          style={{
            ...styles.subjectHeader,
            borderLeftColor: subjectData.color,
            borderLeftWidth: "4px",
            borderLeftStyle: "solid",
          }}
        >
          <div style={styles.subjectTitleContainer}>
            <Icon size={24} color={subjectData.color} />
            <h2 style={{ ...styles.subjectTitle, color: subjectData.color }}>
              {subjectName} - Search Results
            </h2>
          </div>
        </div>
        {renderSearchResults()}
      </div>
    );
  }

  const renderLevelSection = (level, spells, subject) => {
    const sectionKey = `${subject}-${level}`;
    const isExpanded = expandedSections[sectionKey];

    const filteredSpells = spells.filter((spell) => {
      if (searchFilter === "all") return true;
      if (searchFilter === "mastered") {
        const attempts = spellAttempts[spell.name] || {};
        return attempts[1] && attempts[2];
      }
      if (searchFilter === "unmastered") {
        const attempts = spellAttempts[spell.name] || {};
        return !(attempts[1] && attempts[2]);
      }
      if (searchFilter === "researched") {
        return researchedSpells[spell.name];
      }
      if (searchFilter === "unresearched") {
        return !researchedSpells[spell.name];
      }
      return true;
    });

    const masteredCount = filteredSpells.filter((spell) => {
      const attempts = spellAttempts[spell.name] || {};
      return attempts[1] && attempts[2];
    }).length;

    const progressPercentage =
      filteredSpells.length > 0
        ? Math.round((masteredCount / filteredSpells.length) * 100)
        : 0;

    const hasStatusFilter = searchFilter !== "all";

    if (filteredSpells.length === 0 && hasStatusFilter) {
      return null;
    }

    return (
      <div key={level} style={styles.levelSection}>
        <button
          onClick={() => toggleSection(sectionKey)}
          style={styles.sectionToggle}
        >
          <div style={styles.sectionLeft}>
            {isExpanded ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
            <span>
              {level} ({filteredSpells.length} spells
              {hasStatusFilter && filteredSpells.length !== spells.length
                ? ` of ${spells.length}`
                : ""}
              )
            </span>
          </div>
          <div style={styles.sectionRight}>
            <span style={styles.sectionProgressText}>
              {masteredCount}/{filteredSpells.length} Mastered
            </span>
            <div style={styles.sectionProgress}>
              <div
                style={{
                  ...styles.sectionProgressFill,
                  width: `${progressPercentage}%`,
                }}
              ></div>
            </div>
          </div>
        </button>

        {isExpanded && (
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={{ ...styles.tableHeaderCell, width: "3rem" }}>#</th>
                <th style={styles.tableHeaderCell}>Spell Name</th>
                <th style={styles.tableHeaderCell}>Successful Attempts</th>
                <th style={styles.tableHeaderCellCenter}>Critical</th>
                <th style={styles.tableHeaderCellCenter}>Attempt</th>
                <th style={{ ...styles.tableHeaderCellCenter, width: "3rem" }}>
                  Menu
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSpells
                .map((spellObj, index) =>
                  renderSpellRow(spellObj, index, subject)
                )
                .flat()}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div key={subjectName} style={styles.subjectCard}>
      <div
        style={{
          ...styles.subjectHeader,
          borderLeftColor: subjectData.color,
          borderLeftWidth: "4px",
          borderLeftStyle: "solid",
          cursor: "pointer",
        }}
        onClick={() => toggleSubject(subjectName)}
      >
        <div style={styles.subjectTitleContainer}>
          <Icon size={24} color={subjectData.color} />
          <h2 style={{ ...styles.subjectTitle, color: subjectData.color }}>
            {subjectName}
          </h2>
          <div style={{ marginLeft: "auto" }}>
            {isExpanded ? (
              <ChevronDown size={24} color={subjectData.color} />
            ) : (
              <ChevronRight size={24} color={subjectData.color} />
            )}
          </div>
        </div>
        <p style={styles.subjectDescription}>{subjectData.description}</p>
        <div style={styles.subjectStats}>
          <span style={styles.subjectStatText}>
            {masteredCount}/{totalSpells} Mastered ({progressPercentage}%)
          </span>
          <div style={styles.subjectProgress}>
            <div
              style={{
                ...styles.subjectProgressFill,
                width: `${progressPercentage}%`,
                backgroundColor: subjectData.color,
              }}
            ></div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div style={styles.subjectContent}>
          <div style={styles.filterContainer}>
            <Filter size={16} style={styles.filterIcon} />
            <select
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Spells</option>
              <option value="mastered">Mastered Only</option>
              <option value="unmastered">Unmastered Only</option>
              <option value="researched">Researched Only</option>
              <option value="unresearched">Unresearched Only</option>
            </select>
          </div>

          {filteredLevels.map(([level, spells]) =>
            renderLevelSection(level, spells, subjectName)
          )}
        </div>
      )}

      {editingSpell && (
        <div style={styles.editModal}>
          <div style={styles.editModalContent}>
            <h3 style={styles.editModalTitle}>
              Edit Spell Progress: {editingSpell}
            </h3>

            <div style={styles.editFormGroup}>
              <label style={styles.editFormLabel}>Successful Attempts:</label>
              <select
                value={editFormData.successfulAttempts}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    successfulAttempts: parseInt(e.target.value),
                  }))
                }
                style={styles.editFormSelect}
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </div>

            <div style={styles.editFormGroup}>
              <label style={styles.editFormCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={editFormData.hasCriticalSuccess}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      hasCriticalSuccess: e.target.checked,
                    }))
                  }
                  style={styles.editFormCheckbox}
                />
                Critical Success (Natural 20)
              </label>
            </div>

            <div style={styles.editFormGroup}>
              <label style={styles.editFormCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={editFormData.hasFailedAttempt}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      hasFailedAttempt: e.target.checked,
                    }))
                  }
                  style={styles.editFormCheckbox}
                />
                Has Failed Attempt
              </label>
            </div>

            <div style={styles.editFormGroup}>
              <label style={styles.editFormCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={editFormData.researched}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      researched: e.target.checked,
                    }))
                  }
                  style={styles.editFormCheckbox}
                />
                Researched
              </label>
            </div>

            <div style={styles.editFormGroup}>
              <label style={styles.editFormCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={editFormData.hasArithmancticTag}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      hasArithmancticTag: e.target.checked,
                    }))
                  }
                  style={styles.editFormCheckbox}
                />
                Has Arithmantic Tag
              </label>
            </div>

            <div style={styles.editFormGroup}>
              <label style={styles.editFormCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={editFormData.hasRunicTag}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      hasRunicTag: e.target.checked,
                    }))
                  }
                  style={styles.editFormCheckbox}
                />
                Has Runic Tag
              </label>
            </div>

            <div style={styles.editFormActions}>
              <button onClick={saveEdit} style={styles.editFormSaveButton}>
                <Check size={16} />
                Save
              </button>
              <button
                onClick={cancelEditing}
                style={styles.editFormCancelButton}
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {alternateAttemptsModal && (
        <AlternateAttemptsModal
          spellName={alternateAttemptsModal}
          spellObj={findSpellData(alternateAttemptsModal)}
          subject={subjectName}
        />
      )}

      <RestrictionModal
        spellName={restrictionModal.spellName}
        isOpen={restrictionModal.isOpen}
        onConfirm={restrictionModal.onConfirm}
        onCancel={handleRestrictionCancel}
        theme={theme}
      />
      <SpellBonusDiceModal
        isOpen={bonusDiceModalState.isOpen}
        onClose={bonusDiceModalState.props.onClose}
        onConfirm={bonusDiceModalState.props.onConfirm}
        availableDice={bonusDiceModalState.props.availableDice}
        spellName={bonusDiceModalState.props.spellName}
        originalRoll={bonusDiceModalState.props.originalRoll}
        originalModifier={bonusDiceModalState.props.originalModifier}
        originalTotal={bonusDiceModalState.props.originalTotal}
        targetDC={bonusDiceModalState.props.targetDC}
      />
    </div>
  );
};
