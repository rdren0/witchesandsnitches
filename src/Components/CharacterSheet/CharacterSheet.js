import { useState, useEffect } from "react";
import {
  User,
  Shield,
  Heart,
  Swords,
  Dices,
  Plus,
  Minus,
  X,
  Moon,
  Coffee,
} from "lucide-react";
import { Skills } from "./Skills";
import AbilityScores from "../AbilityScores/AbilityScores";
import CharacterLevelUp from "./CharacterLevelUp";
import { modifiers, formatModifier } from "./utils";
import { useTheme } from "../../contexts/ThemeContext";
import { getCharacterSheetStyles } from "../../styles/masterStyles";
import { useRollFunctions, useRollModal } from "../../App/diceRoller";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const discordWebhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL;

const hitDiceData = {
  Willpower: "d10",
  Technique: "d6",
  Intellect: "d8",
  Vigor: "d12",
  default: "d8",
};

const CharacterSheet = ({
  user,
  supabase,
  selectedCharacter,
  characters,
  className = "",
}) => {
  const { rollInitiative } = useRollFunctions();
  const { showRollResult } = useRollModal();

  const { theme } = useTheme();
  const styles = getCharacterSheetStyles(theme);
  const discordUserId = user?.user_metadata?.provider_id;

  const [character, setCharacter] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showHitDiceModal, setShowHitDiceModal] = useState(false);
  const [selectedHitDiceCount, setSelectedHitDiceCount] = useState(1);
  const [isRollingHitDice, setIsRollingHitDice] = useState(false);
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [damageAmount, setDamageAmount] = useState(0);
  const [isApplyingDamage, setIsApplyingDamage] = useState(false);
  const [isLongResting, setIsLongResting] = useState(false);
  const characterModifiers = modifiers(character);

  const [characterLoading, setCharacterLoading] = useState(false);
  const [error, setError] = useState(null);

  const getHitDie = (castingStyle) => {
    return hitDiceData[castingStyle] || hitDiceData.default;
  };

  const calculateEffectiveAbilityScores = (baseScores, asiChoices) => {
    const effectiveScores = { ...baseScores };
    Object.entries(asiChoices).forEach(([level, choice]) => {
      if (choice.type === "asi" && choice.abilityScoreIncreases) {
        choice.abilityScoreIncreases.forEach((increase) => {
          if (effectiveScores[increase.ability] !== undefined) {
            effectiveScores[increase.ability] =
              (effectiveScores[increase.ability] || 10) + 1;
          }
        });
      }
    });
    return effectiveScores;
  };

  const getAllCharacterFeats = (standardFeats, asiChoices) => {
    const allFeats = [...standardFeats];

    // Add feats from ASI choices
    Object.entries(asiChoices).forEach(([level, choice]) => {
      if (choice.type === "feat" && choice.selectedFeat) {
        allFeats.push(`${choice.selectedFeat} (Level ${level})`);
      }
    });

    return allFeats;
  };

  const fetchCharacterDetails = async () => {
    if (!selectedCharacter?.id) {
      setCharacter(null);
      return;
    }

    setCharacterLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", selectedCharacter.id)
        .eq("discord_user_id", discordUserId)
        .single();

      if (error) throw error;

      if (data) {
        const baseAbilityScores = data.ability_scores || {};
        const asiChoices = data.asi_choices || {}; // Load ASI choices from database
        const effectiveAbilityScores = calculateEffectiveAbilityScores(
          baseAbilityScores,
          asiChoices
        );

        const allFeats = getAllCharacterFeats(
          data.standard_feats || [],
          asiChoices
        );

        const transformedCharacter = {
          id: data.id,
          name: data.name,
          house: data.house,
          year: `Level ${data.level}`,
          level: data.level,
          background: data.background || "Unknown",
          bloodStatus: data.innate_heritage || "Unknown",
          wand: data.wand_type || "Unknown wand",
          gameSession: data.game_session || "",

          strength: effectiveAbilityScores.strength || 10,
          dexterity: effectiveAbilityScores.dexterity || 10,
          constitution: effectiveAbilityScores.constitution || 10,
          intelligence: effectiveAbilityScores.intelligence || 10,
          wisdom: effectiveAbilityScores.wisdom || 10,
          charisma: effectiveAbilityScores.charisma || 10,

          baseAbilityScores: baseAbilityScores,
          asiChoices: asiChoices,
          allFeats: allFeats,

          hitPoints: data.hit_points || 1,
          currentHitPoints: data.current_hit_points || data.hit_points || 1,
          maxHitPoints: data.hit_points || 1,

          armorClass:
            11 + Math.floor((effectiveAbilityScores.dexterity - 10) / 2) || 11,

          speed: 30,
          initiative: 8,
          proficiencyBonus: Math.ceil(data.level / 4) + 1,
          skills: transformSkillProficiencies(data.skill_proficiencies || []),
          castingStyle: data.casting_style,
          subclass: data.subclass,
          standardFeats: data.standard_feats || [],
          magicModifiers: data.magic_modifiers || {},
          skillProficiencies: data.skill_proficiencies || [],
          abilityScores: data.ability_scores,
          innateHeritage: data.innate_heritage,
          wandType: data.wand_type,
          hitDie: getHitDie(data.casting_style),
          maxHitDice: data.level,
          currentHitDice: data.current_hit_dice || data.level,
        };

        setCharacter(transformedCharacter);
      }
    } catch (err) {
      console.error("Error fetching character:", err);
      setError(err.message);
    } finally {
      setCharacterLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacterDetails();
    // eslint-disable-next-line
  }, [selectedCharacter?.id, discordUserId, supabase]);

  const transformSkillProficiencies = (skillArray) => {
    const skillMap = {
      Athletics: "athletics",
      Acrobatics: "acrobatics",
      "Sleight of Hand": "sleightOfHand",
      Stealth: "stealth",
      Herbology: "herbology",
      "History of Magic": "historyOfMagic",
      Investigation: "investigation",
      "Magical Theory": "magicalTheory",
      "Muggle Studies": "muggleStudies",
      Insight: "insight",
      "Magical Creatures": "magicalCreatures",
      Medicine: "medicine",
      Perception: "perception",
      "Potion Making": "potionMaking",
      Survival: "survival",
      Deception: "deception",
      Intimidation: "intimidation",
      Performance: "performance",
      Persuasion: "persuasion",
    };

    const skills = {};

    Object.values(skillMap).forEach((skill) => {
      skills[skill] = false;
    });

    skillArray.forEach((skillName) => {
      const mappedSkill = skillMap[skillName];
      if (mappedSkill) {
        skills[mappedSkill] = true;
      }
    });

    return skills;
  };

  const handleShortRestClick = () => {
    if (!character || character.currentHitDice <= 0) {
      alert("No hit dice available for short rest!");
      return;
    }
    setSelectedHitDiceCount(1);
    setShowHitDiceModal(true);
  };

  const handleLongRest = async () => {
    if (!character) return;

    const currentHP = character.currentHitPoints || character.hitPoints;
    const maxHP = character.maxHitPoints || character.hitPoints;
    const currentHitDice = character.currentHitDice;
    const maxHitDice = character.maxHitDice;

    if (currentHP >= maxHP && currentHitDice >= maxHitDice) {
      alert("Character is already at full health and hit dice!");
      return;
    }

    const confirmed = window.confirm(
      `Take a long rest for ${character.name}?\n\nThis will restore:\n• HP: ${currentHP} → ${maxHP}\n• Hit Dice: ${currentHitDice} → ${maxHitDice}`
    );
    if (!confirmed) return;

    setIsLongResting(true);

    try {
      const hpRestored = maxHP - currentHP;
      const hitDiceRestored = maxHitDice - currentHitDice;

      showRollResult({
        title: `Long Rest Complete`,
        rollValue: hpRestored + hitDiceRestored,
        modifier: 0,
        total: hpRestored + hitDiceRestored,
        isCriticalSuccess: true,
        isCriticalFailure: false,
        type: "longrest",
        description: `${hpRestored} HP restored • ${hitDiceRestored} Hit Dice restored • ${character.name} is fully rested!`,
      });

      const { error } = await supabase
        .from("characters")
        .update({
          current_hit_points: maxHP,
          current_hit_dice: maxHitDice,
          updated_at: new Date().toISOString(),
        })
        .eq("id", character.id)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error updating character:", error);
        alert("Failed to update character data");
        return;
      }

      if (discordWebhookUrl) {
        const embed = {
          title: `${character.name} completed a Long Rest!`,
          color: 0x3b82f6,
          fields: [
            {
              name: "HP Restored",
              value: `${hpRestored} HP`,
              inline: true,
            },
            {
              name: "Hit Dice Restored",
              value: `${hitDiceRestored} × ${character.hitDie}`,
              inline: true,
            },
            {
              name: "Current Status",
              value: `${maxHP}/${maxHP} HP • ${maxHitDice}/${maxHitDice} Hit Dice`,
              inline: false,
            },
          ],
          description: "💤 **Fully rested and ready for adventure!**",
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Long Rest",
          },
        };

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
          });
        } catch (discordError) {
          console.error("Error sending to Discord:", discordError);
        }
      }

      await fetchCharacterDetails();
    } catch (error) {
      console.error("Error applying long rest:", error);
      alert("Error taking long rest. Please try again.");
    } finally {
      setIsLongResting(false);
    }
  };

  const handleDamageClick = () => {
    if (!character) return;
    setDamageAmount(0);
    setShowDamageModal(true);
  };

  const applyDamage = async () => {
    if (!character || damageAmount < 0) return;

    setIsApplyingDamage(true);

    try {
      const newCurrentHP = Math.max(
        0,
        (character.currentHitPoints || character.hitPoints) - damageAmount
      );
      const actualDamage =
        (character.currentHitPoints || character.hitPoints) - newCurrentHP;

      showRollResult({
        title: `Damage Applied`,
        rollValue: actualDamage,
        modifier: 0,
        total: actualDamage,
        isCriticalSuccess: false,
        isCriticalFailure: newCurrentHP === 0,
        type: "damage",
        description: `${actualDamage} damage taken • HP: ${
          character.currentHitPoints || character.hitPoints
        } → ${newCurrentHP}${newCurrentHP === 0 ? " (Unconscious!)" : ""}`,
      });

      const { error } = await supabase
        .from("characters")
        .update({
          current_hit_points: newCurrentHP,
          updated_at: new Date().toISOString(),
        })
        .eq("id", character.id)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error updating character:", error);
        alert("Failed to update character data");
        return;
      }

      if (discordWebhookUrl) {
        const embed = {
          title: `${character.name} took damage!`,
          color: 0xef4444,
          fields: [
            {
              name: "Damage Taken",
              value: `${actualDamage} damage`,
              inline: true,
            },
            {
              name: "HP Remaining",
              value: `${newCurrentHP}/${
                character.maxHitPoints || character.hitPoints
              }`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Damage Taken",
          },
        };

        if (newCurrentHP === 0) {
          embed.description = "⚠️ **Character is unconscious!**";
          embed.color = 0x7f1d1d;
        }

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
          });
        } catch (discordError) {
          console.error("Error sending to Discord:", discordError);
        }
      }

      await fetchCharacterDetails();
      setShowDamageModal(false);
    } catch (error) {
      console.error("Error applying damage:", error);
      alert("Error applying damage. Please try again.");
    } finally {
      setIsApplyingDamage(false);
    }
  };

  const fullHeal = async () => {
    if (!character) return;

    const currentHP = character.currentHitPoints || character.hitPoints;
    const maxHP = character.maxHitPoints || character.hitPoints;

    if (currentHP >= maxHP) {
      alert("Character is already at full health!");
      return;
    }

    const confirmed = window.confirm(
      `Fully heal ${character.name}?\n\nHP: ${currentHP} → ${maxHP}`
    );
    if (!confirmed) return;

    try {
      const healingAmount = maxHP - currentHP;

      showRollResult({
        title: `Full Heal`,
        rollValue: healingAmount,
        modifier: 0,
        total: healingAmount,
        isCriticalSuccess: true,
        isCriticalFailure: false,
        type: "heal",
        description: `${healingAmount} HP restored • ${character.name} is at full health!`,
      });

      const { error } = await supabase
        .from("characters")
        .update({
          current_hit_points: maxHP,
          updated_at: new Date().toISOString(),
        })
        .eq("id", character.id)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error updating character:", error);
        alert("Failed to update character data");
        return;
      }

      if (discordWebhookUrl) {
        const embed = {
          title: `${character.name} was fully healed!`,
          color: 0x10b981,
          fields: [
            {
              name: "HP Restored",
              value: `${maxHP - currentHP} HP`,
              inline: true,
            },
            {
              name: "Current HP",
              value: `${maxHP}/${maxHP} (Full Health)`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Full Heal",
          },
        };

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
          });
        } catch (discordError) {
          console.error("Error sending to Discord:", discordError);
        }
      }

      await fetchCharacterDetails();
    } catch (error) {
      console.error("Error applying full heal:", error);
      alert("Error healing character. Please try again.");
    }
  };

  const rollHitDice = async () => {
    if (
      !character ||
      selectedHitDiceCount <= 0 ||
      selectedHitDiceCount > character.currentHitDice
    ) {
      return;
    }

    setIsRollingHitDice(true);

    try {
      const roller = new DiceRoller();
      const conModifier = characterModifiers.constitution;

      const diceNotation = `${selectedHitDiceCount}${character.hitDie}`;
      const rollResult = roller.roll(diceNotation);

      const totalHealing =
        rollResult.total + conModifier * selectedHitDiceCount;
      const actualHealing = Math.max(1, totalHealing);

      const newCurrentHP = Math.min(
        character.currentHitPoints + actualHealing,
        character.maxHitPoints
      );
      const hpGained = newCurrentHP - character.currentHitPoints;

      const newHitDiceCount = character.currentHitDice - selectedHitDiceCount;

      showRollResult({
        title: `Hit Dice Recovery`,
        rollValue: rollResult.total,
        modifier: conModifier * selectedHitDiceCount,
        total: actualHealing,
        isCriticalSuccess: false,
        isCriticalFailure: false,
        type: "hitdice",
        description: `${selectedHitDiceCount} × ${character.hitDie} + ${
          conModifier * selectedHitDiceCount
        } CON • ${hpGained} HP restored • ${newHitDiceCount}/${
          character.maxHitDice
        } dice remaining`,
      });

      const { error } = await supabase
        .from("characters")
        .update({
          current_hit_points: newCurrentHP,
          current_hit_dice: newHitDiceCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", character.id)
        .eq("discord_user_id", discordUserId);

      if (error) {
        console.error("Error updating character:", error);
        alert("Failed to update character data");
        return;
      }

      if (discordWebhookUrl) {
        const embed = {
          title: `${character.name} used Hit Dice for Short Rest`,
          color: 0x9d4edd,
          fields: [
            {
              name: "Hit Dice Used",
              value: `${selectedHitDiceCount} × ${character.hitDie}`,
              inline: true,
            },
            {
              name: "Roll Result",
              value: `${rollResult.output} + ${
                conModifier * selectedHitDiceCount
              } (CON) = ${actualHealing}`,
              inline: true,
            },
            {
              name: "HP Restored",
              value: `${hpGained} HP (${character.currentHitPoints} → ${newCurrentHP})`,
              inline: true,
            },
            {
              name: "Hit Dice Remaining",
              value: `${newHitDiceCount}/${character.maxHitDice}`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Short Rest Healing",
          },
        };

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
          });
        } catch (discordError) {
          console.error("Error sending to Discord:", discordError);
        }
      }

      await fetchCharacterDetails();
      setShowHitDiceModal(false);
    } catch (error) {
      console.error("Error rolling hit dice:", error);
      alert("Error rolling hit dice. Please try again.");
    } finally {
      setIsRollingHitDice(false);
    }
  };

  const handleCharacterUpdated = async (updatedCharacter) => {
    setCharacter(updatedCharacter);
    await fetchCharacterDetails();
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>Error Loading Character</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>No Characters Found</h2>
          <p>
            You haven't created any characters yet. Go to Character Creation to
            get started!
          </p>
        </div>
      </div>
    );
  }

  if (!selectedCharacter) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>No Character Selected</h2>
          <p>
            Please select a character from the dropdown above to view their
            sheet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, ...{ className } }}>
      {characterLoading && (
        <div style={styles.loadingContainer}>
          <h3>Loading Character Sheet...</h3>
        </div>
      )}

      {character && !characterLoading && (
        <>
          <div style={styles.headerCard}>
            <div style={styles.headerFlex}>
              <div style={styles.avatar}>
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h1 style={styles.characterName}>{character.name}</h1>
                </div>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>House:</span> {character.house}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Level:</span> {character.year}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Class:</span>{" "}
                    {character.castingStyle}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Subclass:</span>{" "}
                    {character.subclass || "None"}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Background:</span>{" "}
                    {character.background}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Heritage:</span>{" "}
                    {character.bloodStatus}
                  </div>
                  {character.gameSession && (
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Game Session:</span>{" "}
                      {character.gameSession}
                    </div>
                  )}
                  <div style={{ ...styles.infoItem, gridColumn: "span 2" }}>
                    <span style={styles.label}>Wand:</span> {character.wand}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...styles.combatStats }}>
              <div
                style={{
                  ...styles.statCard,
                  ...styles.statCardRed,
                  cursor: "pointer",
                }}
                onClick={handleDamageClick}
                onContextMenu={(e) => {
                  e.preventDefault();
                  fullHeal();
                }}
                title="Left click to apply damage • Right click to full heal"
              >
                <Heart className="w-6 h-6 text-red-600 mx-auto mb-1" />
                <div style={{ ...styles.statValue, ...styles.statValueRed }}>
                  {character.currentHitPoints || character.hitPoints}/
                  {character.maxHitPoints || character.hitPoints}
                </div>
                <div style={{ ...styles.statLabel, ...styles.statLabelRed }}>
                  Hit Points
                </div>
              </div>

              <div
                style={{
                  ...styles.statCard,
                  ...styles.statCardBlue,
                  cursor: "default",
                }}
              >
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <div style={{ ...styles.statValue, ...styles.statValueBlue }}>
                  {character.armorClass}
                </div>
                <div style={{ ...styles.statLabel, ...styles.statLabelBlue }}>
                  Armor Class
                </div>
              </div>
              <div
                style={{ ...styles.statCard, ...styles.statCardGreen }}
                onClick={() =>
                  !isRolling &&
                  rollInitiative({
                    character,
                    isRolling,
                    setIsRolling,
                    characterModifiers,
                  })
                }
              >
                <Swords className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <div style={{ ...styles.statValue, ...styles.statValueGreen }}>
                  {formatModifier(characterModifiers.dexterity)}
                </div>
                <div style={{ ...styles.statLabel, ...styles.statLabelGreen }}>
                  Initiative
                </div>
              </div>
              <div
                style={{
                  ...styles.statCard,
                  ...styles.statCardPurple,
                  cursor: "default",
                }}
                title={`Hit Dice: ${character.hitDie}. Use Short Rest button to recover HP.`}
              >
                <Dices className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <div style={{ ...styles.statValue, ...styles.statValuePurple }}>
                  {character.currentHitDice}/{character.maxHitDice}
                </div>
                <div style={{ ...styles.statLabel, ...styles.statLabelPurple }}>
                  Hit Dice ({character.hitDie})
                </div>
              </div>
            </div>
            {character &&
              !characterLoading &&
              Object.keys(character.asiChoices || {}).length > 0 && (
                <div
                  style={{
                    ...styles.headerCard,
                    marginTop: "16px",
                    padding: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: theme === "dark" ? "#f9fafb" : "#1f2937",
                      marginBottom: "16px",
                      borderBottom: `1px solid ${
                        theme === "dark" ? "#4b5563" : "#e5e7eb"
                      }`,
                      paddingBottom: "8px",
                    }}
                  >
                    Character Progression
                  </h3>

                  {/* Show all feats if any */}
                  {character.allFeats && character.allFeats.length > 0 && (
                    <div style={{ marginBottom: "16px" }}>
                      <h4
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: theme === "dark" ? "#f9fafb" : "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        Feats
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        {character.allFeats.map((feat, index) => (
                          <span
                            key={index}
                            style={{
                              display: "inline-block",
                              padding: "4px 12px",
                              backgroundColor: `${
                                theme === "dark" ? "#3b82f6" : "#3b82f6"
                              }20`,
                              color: theme === "dark" ? "#60a5fa" : "#3b82f6",
                              borderRadius: "16px",
                              fontSize: "12px",
                              fontWeight: "500",
                              border: `1px solid ${
                                theme === "dark" ? "#3b82f6" : "#3b82f6"
                              }40`,
                            }}
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show ASI history */}
                  <div>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: theme === "dark" ? "#f9fafb" : "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      Ability Score Improvements
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      {Object.entries(character.asiChoices)
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .map(([level, choice]) => (
                          <div
                            key={level}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "13px",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "600",
                                color: theme === "dark" ? "#60a5fa" : "#3b82f6",
                                minWidth: "60px",
                              }}
                            >
                              Level {level}:
                            </span>
                            {choice.type === "asi" ? (
                              <span
                                style={{
                                  color:
                                    theme === "dark" ? "#9ca3af" : "#6b7280",
                                }}
                              >
                                {choice.abilityScoreIncreases
                                  ?.map(
                                    (inc) =>
                                      inc.ability.charAt(0).toUpperCase() +
                                      inc.ability.slice(1)
                                  )
                                  .join(", ")}{" "}
                                +1
                              </span>
                            ) : (
                              <span
                                style={{
                                  color:
                                    theme === "dark" ? "#9ca3af" : "#6b7280",
                                }}
                              >
                                Feat: {choice.selectedFeat}
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Show ability score summary */}
                  <div style={{ marginTop: "16px" }}>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: theme === "dark" ? "#f9fafb" : "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      Ability Score Summary
                    </h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "8px",
                      }}
                    >
                      {[
                        "strength",
                        "dexterity",
                        "constitution",
                        "intelligence",
                        "wisdom",
                        "charisma",
                      ].map((ability) => {
                        const baseScore =
                          character.baseAbilityScores[ability] || 10;
                        const currentScore = character[ability];
                        const hasIncrease = currentScore > baseScore;

                        return (
                          <div
                            key={ability}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "8px 12px",
                              backgroundColor:
                                theme === "dark" ? "#374151" : "#f8fafc",
                              borderRadius: "6px",
                              fontSize: "13px",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "500",
                                color: theme === "dark" ? "#f9fafb" : "#1f2937",
                              }}
                            >
                              {ability.charAt(0).toUpperCase() +
                                ability.slice(1)}
                              :
                            </span>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              {hasIncrease ? (
                                <>
                                  <span
                                    style={{
                                      color:
                                        theme === "dark"
                                          ? "#9ca3af"
                                          : "#6b7280",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {baseScore}
                                  </span>
                                  <span
                                    style={{
                                      color:
                                        theme === "dark"
                                          ? "#9ca3af"
                                          : "#6b7280",
                                      fontSize: "12px",
                                    }}
                                  >
                                    →
                                  </span>
                                  <span
                                    style={{
                                      fontWeight: "600",
                                      color:
                                        theme === "dark"
                                          ? "#f9fafb"
                                          : "#1f2937",
                                    }}
                                  >
                                    {currentScore}
                                  </span>
                                  <span
                                    style={{
                                      color: "#10b981",
                                      fontSize: "11px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    (+{currentScore - baseScore})
                                  </span>
                                </>
                              ) : (
                                <span
                                  style={{
                                    fontWeight: "600",
                                    color:
                                      theme === "dark" ? "#f9fafb" : "#1f2937",
                                  }}
                                >
                                  {currentScore}
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
          </div>

          <div
            style={{
              ...styles.headerCard,
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: theme === "dark" ? "#f9fafb" : "#1f2937",
                textAlign: "center",
              }}
            >
              Rest Actions
            </h3>
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#9d4edd",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor:
                    character.currentHitDice <= 0 ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: character.currentHitDice <= 0 ? 0.6 : 1,
                  transition: "all 0.2s ease",
                  minWidth: "140px",
                  justifyContent: "center",
                }}
                onClick={handleShortRestClick}
                disabled={character.currentHitDice <= 0}
                title={`Use hit dice to recover HP during a short rest (${character.currentHitDice} dice available)`}
                onMouseEnter={(e) => {
                  if (character.currentHitDice > 0) {
                    e.target.style.backgroundColor = "#8b5cf6";
                    e.target.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (character.currentHitDice > 0) {
                    e.target.style.backgroundColor = "#9d4edd";
                    e.target.style.transform = "translateY(0)";
                  }
                }}
              >
                <Coffee size={16} />
                Short Rest
              </button>

              <button
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isLongResting ? "wait" : "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: isLongResting ? 0.7 : 1,
                  transition: "all 0.2s ease",
                  minWidth: "140px",
                  justifyContent: "center",
                }}
                onClick={handleLongRest}
                disabled={isLongResting}
                title="Restore all HP and hit dice with a long rest"
                onMouseEnter={(e) => {
                  if (!isLongResting) {
                    e.target.style.backgroundColor = "#2563eb";
                    e.target.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLongResting) {
                    e.target.style.backgroundColor = "#3b82f6";
                    e.target.style.transform = "translateY(0)";
                  }
                }}
              >
                <Moon size={16} />
                {isLongResting ? "Resting..." : "Long Rest"}
              </button>
            </div>
          </div>

          <AbilityScores
            character={character}
            discordWebhookUrl={discordWebhookUrl}
          />

          <Skills
            character={character}
            supabase={supabase}
            discordUserId={discordUserId}
            setCharacter={setCharacter}
            selectedCharacterId={selectedCharacter.id}
            isRolling={isRolling}
            modifiers={modifiers(character)}
          />

          <div style={styles.instructionsCard}>
            <div style={styles.instructionsGrid}>
              <div style={styles.instructionItem}>
                <Heart className="w-4 h-4 text-red-500" />
                <span>
                  Click Hit Points to apply damage • Right-click to full heal
                </span>
              </div>
              <div style={styles.instructionItem}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#1f2937",
                    border: "2px solid #1f2937",
                  }}
                />
                <span>
                  Click circle to add proficiency bonus (+
                  {character.proficiencyBonus})
                </span>
              </div>
              <div style={styles.instructionItem}>
                <span>Click skill or ability name to roll d20 + modifier</span>
              </div>
              <div style={styles.instructionItem}>
                <Coffee className="w-4 h-4 text-purple-500" />
                <span>Short Rest: Use hit dice to recover HP</span>
              </div>
              <div style={styles.instructionItem}>
                <Moon className="w-4 h-4 text-blue-500" />
                <span>Long Rest: Restore all HP and hit dice</span>
              </div>

              <div style={styles.instructionItem}>
                <span>Click column headers to sort skills</span>
              </div>
            </div>
            {!discordWebhookUrl && (
              <div style={styles.warning}>
                ⚠️ No Discord webhook configured - rolls will show as alerts
              </div>
            )}
          </div>
        </>
      )}

      {showHitDiceModal && character && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowHitDiceModal(false)}
        >
          <div
            style={{
              backgroundColor: theme === "dark" ? "#374151" : "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              minWidth: "400px",
              maxWidth: "500px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "16px",
                color: theme === "dark" ? "#f9fafb" : "#1f2937",
                textAlign: "center",
              }}
            >
              <Coffee
                size={24}
                style={{ display: "inline", marginRight: "8px" }}
              />
              Short Rest - Use Hit Dice
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Character:</span>
                <span>{character.name}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Current HP:</span>
                <span>
                  {character.currentHitPoints || character.hitPoints}/
                  {character.maxHitPoints || character.hitPoints}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Hit Dice Available:</span>
                <span>
                  {character.currentHitDice} × {character.hitDie}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Constitution Modifier:</span>
                <span>
                  {formatModifier(characterModifiers.constitution)} per die
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                margin: "20px 0",
              }}
            >
              <button
                style={{
                  padding: "8px",
                  border: `2px solid ${
                    theme === "dark" ? "#4b5563" : "#d1d5db"
                  }`,
                  backgroundColor: theme === "dark" ? "#4b5563" : "#f9fafb",
                  color: theme === "dark" ? "#f9fafb" : "#374151",
                  borderRadius: "6px",
                  cursor: selectedHitDiceCount <= 1 ? "not-allowed" : "pointer",
                  opacity: selectedHitDiceCount <= 1 ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() =>
                  setSelectedHitDiceCount(Math.max(1, selectedHitDiceCount - 1))
                }
                disabled={selectedHitDiceCount <= 1}
              >
                <Minus size={16} />
              </button>

              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  minWidth: "40px",
                  textAlign: "center",
                  color: theme === "dark" ? "#f9fafb" : "#1f2937",
                }}
              >
                {selectedHitDiceCount}
              </div>

              <button
                style={{
                  padding: "8px",
                  border: `2px solid ${
                    theme === "dark" ? "#4b5563" : "#d1d5db"
                  }`,
                  backgroundColor: theme === "dark" ? "#4b5563" : "#f9fafb",
                  color: theme === "dark" ? "#f9fafb" : "#374151",
                  borderRadius: "6px",
                  cursor:
                    selectedHitDiceCount >= character.currentHitDice
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    selectedHitDiceCount >= character.currentHitDice ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() =>
                  setSelectedHitDiceCount(
                    Math.min(character.currentHitDice, selectedHitDiceCount + 1)
                  )
                }
                disabled={selectedHitDiceCount >= character.currentHitDice}
              >
                <Plus size={16} />
              </button>
            </div>

            <div
              style={{
                textAlign: "center",
                marginBottom: "24px",
                fontSize: "14px",
                color: theme === "dark" ? "#9ca3af" : "#6b7280",
              }}
            >
              Rolling {selectedHitDiceCount} × {character.hitDie} +{" "}
              {formatModifier(characterModifiers.constitution)} each
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  padding: "10px 20px",
                  border: `2px solid ${
                    theme === "dark" ? "#4b5563" : "#d1d5db"
                  }`,
                  backgroundColor: theme === "dark" ? "#374151" : "white",
                  color: theme === "dark" ? "#f9fafb" : "#374151",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onClick={() => setShowHitDiceModal(false)}
                disabled={isRollingHitDice}
              >
                <X size={16} style={{ marginRight: "6px" }} />
                Cancel
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#9d4edd",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isRollingHitDice ? "wait" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: isRollingHitDice ? 0.7 : 1,
                }}
                onClick={rollHitDice}
                disabled={isRollingHitDice}
              >
                <Dices size={16} />
                {isRollingHitDice ? "Rolling..." : "Roll Hit Dice"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDamageModal && character && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowDamageModal(false)}
        >
          <div
            style={{
              backgroundColor: theme === "dark" ? "#374151" : "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              minWidth: "400px",
              maxWidth: "500px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "16px",
                color: theme === "dark" ? "#f9fafb" : "#1f2937",
                textAlign: "center",
              }}
            >
              <Heart
                size={24}
                style={{
                  display: "inline",
                  marginRight: "8px",
                  color: "#ef4444",
                }}
              />
              Apply Damage
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Character:</span>
                <span>{character.name}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Current HP:</span>
                <span>
                  {character.currentHitPoints || character.hitPoints}/
                  {character.maxHitPoints || character.hitPoints}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Damage Amount:</span>
                <input
                  type="number"
                  min="0"
                  value={damageAmount}
                  onChange={(e) =>
                    setDamageAmount(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      damageAmount > 0 &&
                      !isApplyingDamage
                    ) {
                      applyDamage();
                    }
                    if (e.key === "Escape") {
                      setShowDamageModal(false);
                    }
                  }}
                  style={{
                    padding: "4px 8px",
                    border: `1px solid ${
                      theme === "dark" ? "#4b5563" : "#d1d5db"
                    }`,
                    borderRadius: "4px",
                    backgroundColor: theme === "dark" ? "#374151" : "white",
                    color: theme === "dark" ? "#f9fafb" : "#1f2937",
                    width: "80px",
                    textAlign: "right",
                  }}
                  autoFocus
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                }}
              >
                <span>Resulting HP:</span>
                <span
                  style={{
                    color:
                      Math.max(
                        0,
                        (character.currentHitPoints || character.hitPoints) -
                          damageAmount
                      ) === 0
                        ? "#ef4444"
                        : "inherit",
                  }}
                >
                  {Math.max(
                    0,
                    (character.currentHitPoints || character.hitPoints) -
                      damageAmount
                  )}
                  /{character.maxHitPoints || character.hitPoints}
                  {Math.max(
                    0,
                    (character.currentHitPoints || character.hitPoints) -
                      damageAmount
                  ) === 0 && " (Unconscious!)"}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  padding: "10px 20px",
                  border: `2px solid ${
                    theme === "dark" ? "#4b5563" : "#d1d5db"
                  }`,
                  backgroundColor: theme === "dark" ? "#374151" : "white",
                  color: theme === "dark" ? "#f9fafb" : "#374151",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onClick={() => setShowDamageModal(false)}
                disabled={isApplyingDamage}
              >
                <X size={16} style={{ marginRight: "6px" }} />
                Cancel
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor:
                    isApplyingDamage || damageAmount <= 0
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: isApplyingDamage || damageAmount <= 0 ? 0.7 : 1,
                }}
                onClick={applyDamage}
                disabled={isApplyingDamage || damageAmount <= 0}
              >
                <Heart size={16} />
                {isApplyingDamage ? "Applying..." : "Apply Damage"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLevelUp && character && (
        <CharacterLevelUp
          character={character}
          onClose={() => setShowLevelUp(false)}
          onCharacterUpdated={handleCharacterUpdated}
          supabase={supabase}
          discordUserId={discordUserId}
        />
      )}
    </div>
  );
};

export default CharacterSheet;
