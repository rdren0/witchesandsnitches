import React, { useState } from "react";
import {
  X,
  TrendingUp,
  Star,
  Zap,
  Heart,
  ChevronLeft,
  ChevronRight,
  Dice6,
  RotateCcw,
} from "lucide-react";

const LevelUpModal = ({
  character,
  isOpen,
  onSave,
  onCancel,
  user,
  supabase,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedFeat, setExpandedFeat] = useState(null);

  const [levelUpData, setLevelUpData] = useState({
    hitPointIncrease: 0,
    hitPointMethod: "average",
    rolledHP: null,
    abilityIncreases: [],
    selectedFeats: [],
    manualHP: 0,
  });

  const featDescriptions = {
    Alert:
      "+5 bonus to initiative, can't be surprised while conscious, other creatures don't gain advantage on attack rolls from being unseen.",
    Athlete:
      "Climbing doesn't halve your speed, only 5 feet of movement to climb during a high jump, running start adds +5 feet to long jump distance.",
    Actor:
      "Advantage on Charisma (Deception) and Charisma (Performance) checks when trying to pass yourself off as different person.",
    Charger:
      "When you use Dash action, you can use bonus action to make one melee weapon attack or shove a creature.",
    "Defensive Duelist":
      "When wielding finesse weapon with which you are proficient and another creature hits you with melee attack, use reaction to add proficiency bonus to AC.",
    "Dual Wielder":
      "Gain +1 bonus to AC while wielding separate melee weapon in each hand, can use two-weapon fighting with non-light melee weapons.",
    "Dungeon Delver":
      "Advantage on Perception and Investigation checks to detect secret doors, advantage on saving throws to avoid or resist traps.",
    Durable:
      "When you roll Hit Dice to regain hit points, minimum number you can roll is twice your Constitution modifier.",
    "Elemental Adept":
      "Spells ignore resistance to your chosen damage type, treat any 1 on damage dice as 2.",
    "Fey Touched":
      "Learn Misty Step and one 1st-level divination or enchantment spell, can cast each once without expending spell slot.",
    "Gift of the Metallic Dragon":
      "Learn Cure Wounds or Guidance cantrip, gain protective wings reaction, manifest spectral wings for brief flight.",
    "Great Weapon Master":
      "On critical hit or reducing creature to 0 HP with melee weapon, make bonus attack. Can take -5 penalty to attack for +10 damage.",
    Healer:
      "Use healer's kit to stabilize dying creature (they regain 1 HP), restore 1d4+4 HP to creature that hasn't regained HP from this feat today.",
    "Heavily Armored": "Gain proficiency with heavy armor, +1 to Strength.",
    "Heavy Armor Master":
      "While wearing heavy armor, reduce bludgeoning, piercing, and slashing damage by 3.",
    "Inspiring Leader":
      "Spend 10 minutes inspiring companions, give temporary HP equal to your level + Charisma modifier to up to 6 friendly creatures.",
    "Keen Mind":
      "Always know which way is north and hours until next sunrise/sunset, can accurately recall anything seen or heard within the past month.",
    "Lightly Armored":
      "Gain proficiency with light armor, +1 to Strength or Dexterity.",
    Lucky:
      "Have 3 luck points, spend one to roll additional d20 when making attack roll, ability check, or saving throw.",
    "Mage Slayer":
      "When creature within 5 feet casts spell, use reaction to make melee weapon attack. Advantage on saving throws against spells cast within 5 feet.",
    "Magic Initiate":
      "Learn two cantrips and one 1st-level spell from chosen class, can cast the spell once without expending spell slot.",
    "Martial Adept":
      "Learn two maneuvers from Battle Master archetype, gain one superiority die (d6) to fuel them.",
    "Medium Armor Master":
      "Wearing medium armor doesn't impose disadvantage on Dexterity (Stealth) checks, max Dex bonus to AC increases to 3.",
    Mobile:
      "Speed increases by 10 feet, when you make melee attack against creature, you don't provoke opportunity attacks from that creature.",
    "Moderately Armored":
      "Gain proficiency with medium armor and shields, +1 to Strength or Dexterity.",
    "Mounted Combatant":
      "Advantage on melee attacks against unmounted creatures smaller than your mount, force attacks against mount to target you instead.",
    Observant:
      "If you can see creature's mouth and know language, you can interpret what it's saying by reading lips, +5 bonus to passive Perception and Investigation.",
    "Polearm Master":
      "When wielding glaive, halberd, pike, or quarterstaff, use bonus action for butt end attack, opportunity attacks when creature enters your reach.",
    Resilient:
      "Choose one ability score, gain proficiency in saving throws using the chosen ability, +1 to the chosen ability score.",
    "Ritual Caster":
      "Learn two 1st-level spells with ritual tag from chosen class, can cast them as rituals, learn additional ritual spells.",
    "Savage Attacker":
      "Once per turn when you roll damage for melee weapon attack, reroll damage dice and use either total.",
    Sentinel:
      "When you hit creature with opportunity attack, creature's speed becomes 0, creatures provoke opportunity attacks even with Disengage.",
    "Shadow Touched":
      "Learn Invisibility and one 1st-level necromancy or illusion spell, can cast each once without expending spell slot.",
    Sharpshooter:
      "Attacking at long range doesn't impose disadvantage, ranged attacks ignore half and three-quarters cover, -5 attack for +10 damage.",
    "Shield Master":
      "Use bonus action to shove with shield, add shield's AC bonus to Dexterity saving throws against spells and effects.",
    Skilled:
      "Gain proficiency in any combination of three skills or tools of your choice.",
    Skulker:
      "You can try to hide when lightly obscured, when hidden and you miss with ranged attack, doesn't reveal your position.",
    "Spell Sniper":
      "Double range of spells that require attack roll, learn one cantrip that requires attack roll, spells ignore half and three-quarters cover.",
    "Tavern Brawler":
      "Proficient with improvised weapons, unarmed strikes use d4 for damage, when you hit with unarmed strike or improvised weapon, grapple as bonus action.",
    Telekinetic:
      "Learn Mage Hand cantrip, bonus action to shove creature 5 feet with telekinetic shove, Mage Hand range increases to 60 feet.",
    Telepathic:
      "Can communicate telepathically with creature within 60 feet, learn Detect Thoughts spell, can cast once without expending spell slot.",
    Tough:
      "Your hit point maximum increases by an amount equal to twice your level when you gain this feat.",
    "War Caster":
      "Advantage on Constitution saving throws to maintain concentration, can perform somatic components with hands holding shield and weapon.",
    "Weapon Master":
      "Gain proficiency with four weapons of your choice, +1 to Strength or Dexterity.",
  };

  if (!isOpen || !character) return null;

  const currentLevel = character.level || 1;
  const newLevel = currentLevel + 1;

  const getAbilityScore = (abilityName) => {
    const lowerName = abilityName.toLowerCase();

    if (character[lowerName] !== undefined) {
      return character[lowerName];
    }

    if (
      character.abilityScores &&
      character.abilityScores[lowerName] !== undefined
    ) {
      return character.abilityScores[lowerName];
    }

    return 10;
  };

  const getBaseHPIncrease = () => {
    const hpByClass = {
      Charms: 6,
      Transfiguration: 8,
      "Defense Against the Dark Arts": 10,
      Healing: 6,
      Divination: 6,
      Magizoology: 8,
    };
    return hpByClass[character.castingStyle] || 6;
  };

  const baseHitDie = getBaseHPIncrease();
  const constitution = getAbilityScore("constitution");
  const conMod = Math.floor((constitution - 10) / 2);

  const steps = [
    {
      number: 1,
      title: "Hit Points",
      completed: currentStep > 1,
      active: currentStep === 1,
    },
    {
      number: 2,
      title: "Ability Scores",
      completed: currentStep > 2,
      active: currentStep === 2,
    },
    {
      number: 3,
      title: "Features",
      completed: currentStep > 3,
      active: currentStep === 3,
    },
    {
      number: 4,
      title: "Summary",
      completed: false,
      active: currentStep === 4,
    },
  ];

  const rollHitPoints = () => {
    const roll = Math.floor(Math.random() * baseHitDie) + 1;
    const total = roll + conMod;
    setLevelUpData((prev) => ({
      ...prev,
      rolledHP: roll,
      hitPointIncrease: Math.max(1, total),
      hitPointMethod: "roll",
    }));
  };

  const useAverageHP = () => {
    const average = Math.floor(baseHitDie / 2) + 1;
    const total = average + conMod;
    setLevelUpData((prev) => ({
      ...prev,
      hitPointIncrease: Math.max(1, total),
      hitPointMethod: "average",
      rolledHP: null,
    }));
  };

  const setManualHP = (value) => {
    setLevelUpData((prev) => ({
      ...prev,
      hitPointIncrease: Math.max(1, value),
      hitPointMethod: "manual",
      manualHP: value,
      rolledHP: null,
    }));
  };

  const toggleAbilityIncrease = (ability) => {
    setLevelUpData((prev) => {
      const existing = prev.abilityIncreases.find(
        (inc) => inc.ability === ability
      );
      if (existing) {
        return {
          ...prev,
          abilityIncreases: prev.abilityIncreases.filter(
            (inc) => inc.ability !== ability
          ),
        };
      } else if (prev.abilityIncreases.length < 2) {
        const currentScore = getAbilityScore(ability);
        return {
          ...prev,
          abilityIncreases: [
            ...prev.abilityIncreases,
            {
              ability,
              from: currentScore,
              to: currentScore + 1,
            },
          ],
        };
      }
      return prev;
    });
  };

  const toggleFeat = (feat) => {
    setLevelUpData((prev) => {
      const isSelected = prev.selectedFeats.includes(feat);
      if (isSelected) {
        return {
          ...prev,
          selectedFeats: [],
        };
      } else {
        return {
          ...prev,
          selectedFeats: [feat],
        };
      }
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return levelUpData.hitPointIncrease > 0;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      const currentHP = character.hitPoints || character.hit_points || 0;

      const updatedCharacter = {
        ...character,
        level: newLevel,
        hit_points: currentHP + levelUpData.hitPointIncrease,
        hitPoints: currentHP + levelUpData.hitPointIncrease,
      };

      if (levelUpData.abilityIncreases.length > 0) {
        const newAbilityScores = {
          ...(character.ability_scores || character.abilityScores || {}),
        };

        levelUpData.abilityIncreases.forEach((increase) => {
          const abilityKey = increase.ability.toLowerCase();
          newAbilityScores[abilityKey] = increase.to;
        });

        updatedCharacter.ability_scores = newAbilityScores;
        updatedCharacter.abilityScores = newAbilityScores;

        levelUpData.abilityIncreases.forEach((increase) => {
          const abilityKey = increase.ability.toLowerCase();
          updatedCharacter[abilityKey] = increase.to;
        });
      }

      if (levelUpData.selectedFeats.length > 0) {
        const currentFeats =
          character.standard_feats || character.standardFeats || [];
        updatedCharacter.standard_feats = [
          ...currentFeats,
          ...levelUpData.selectedFeats,
        ];
        updatedCharacter.standardFeats = [
          ...currentFeats,
          ...levelUpData.selectedFeats,
        ];
      }

      console.log("Original character:", character);
      console.log("Level up data:", levelUpData);
      console.log("Saving updated character:", updatedCharacter);

      await onSave(updatedCharacter);
    } catch (error) {
      console.error("Error completing level up:", error);
      alert("Failed to save level up changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ display: "grid", gap: "24px" }}>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                Choose Hit Point Increase
              </h3>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                Hit Die: d{baseHitDie} + Constitution modifier (
                {conMod >= 0 ? "+" : ""}
                {conMod})
              </p>
            </div>

            <div
              style={{
                border: `2px solid ${
                  levelUpData.hitPointMethod === "average"
                    ? "#3b82f6"
                    : "#e5e7eb"
                }`,
                borderRadius: "12px",
                padding: "20px",
                cursor: "pointer",
                backgroundColor:
                  levelUpData.hitPointMethod === "average"
                    ? "#dbeafe"
                    : "white",
                transition: "all 0.2s ease",
              }}
              onClick={useAverageHP}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <Heart size={20} color="#3b82f6" />
                <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                  Take Average ({Math.floor(baseHitDie / 2) + 1} + {conMod})
                </h4>
              </div>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                Guaranteed{" "}
                {Math.max(1, Math.floor(baseHitDie / 2) + 1 + conMod)} hit
                points
              </p>
            </div>

            <div
              style={{
                border: `2px solid ${
                  levelUpData.hitPointMethod === "roll" ? "#10b981" : "#e5e7eb"
                }`,
                borderRadius: "12px",
                padding: "20px",
                backgroundColor:
                  levelUpData.hitPointMethod === "roll" ? "#ecfdf5" : "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <Dice6 size={20} color="#10b981" />
                <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                  Roll for Hit Points
                </h4>
              </div>
              {levelUpData.rolledHP && (
                <div
                  style={{
                    marginBottom: "12px",
                    padding: "12px",
                    backgroundColor: "#f0fdf4",
                    borderRadius: "8px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#065f46",
                    }}
                  >
                    Rolled: {levelUpData.rolledHP} + {conMod} ={" "}
                    {levelUpData.hitPointIncrease} HP
                  </p>
                </div>
              )}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={rollHitPoints}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Dice6 size={16} />
                  {levelUpData.rolledHP ? "Reroll" : "Roll"} d{baseHitDie}
                </button>
                {levelUpData.rolledHP && (
                  <button
                    onClick={() =>
                      setLevelUpData((prev) => ({
                        ...prev,
                        rolledHP: null,
                        hitPointIncrease: 0,
                        hitPointMethod: "",
                      }))
                    }
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <RotateCcw size={16} />
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div
              style={{
                border: `2px solid ${
                  levelUpData.hitPointMethod === "manual"
                    ? "#f59e0b"
                    : "#e5e7eb"
                }`,
                borderRadius: "12px",
                padding: "20px",
                backgroundColor:
                  levelUpData.hitPointMethod === "manual" ? "#fef3c7" : "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <Star size={20} color="#f59e0b" />
                <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                  Set Manually
                </h4>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <input
                  type="number"
                  min="1"
                  max={baseHitDie + conMod}
                  value={levelUpData.manualHP || ""}
                  onChange={(e) => setManualHP(parseInt(e.target.value) || 0)}
                  placeholder={`Enter 1-${baseHitDie + conMod}`}
                  style={{
                    padding: "8px 12px",
                    border: "2px solid #d1d5db",
                    borderRadius: "6px",
                    width: "120px",
                    fontSize: "14px",
                  }}
                />
                <span style={{ fontSize: "14px", color: "#6b7280" }}>
                  hit points
                </span>
              </div>
            </div>
          </div>
        );

      case 2:
        const abilities = [
          "Strength",
          "Dexterity",
          "Constitution",
          "Intelligence",
          "Wisdom",
          "Charisma",
        ];

        console.log("Character object:", character);
        console.log("Ability scores:", {
          strength: getAbilityScore("strength"),
          dexterity: getAbilityScore("dexterity"),
          constitution: getAbilityScore("constitution"),
          intelligence: getAbilityScore("intelligence"),
          wisdom: getAbilityScore("wisdom"),
          charisma: getAbilityScore("charisma"),
        });

        return (
          <div style={{ display: "grid", gap: "24px" }}>
            <div style={{ textAlign: "center" }}>
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                Ability Score Improvements
              </h3>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                You can increase two different ability scores by 1 each
                (optional)
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              {abilities.map((ability) => {
                const currentScore = getAbilityScore(ability);
                const isSelected = levelUpData.abilityIncreases.find(
                  (inc) => inc.ability === ability
                );
                const canSelect =
                  isSelected || levelUpData.abilityIncreases.length < 2;

                return (
                  <div
                    key={ability}
                    style={{
                      border: `2px solid ${
                        isSelected
                          ? "#10b981"
                          : canSelect
                          ? "#d1d5db"
                          : "#e5e7eb"
                      }`,
                      borderRadius: "8px",
                      padding: "16px",
                      cursor: canSelect ? "pointer" : "not-allowed",
                      backgroundColor: isSelected ? "#ecfdf5" : "white",
                      opacity: canSelect ? 1 : 0.5,
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => canSelect && toggleAbilityIncrease(ability)}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontWeight: "500" }}>{ability}</span>
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        {currentScore} {isSelected && "→ " + (currentScore + 1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Selected: {levelUpData.abilityIncreases.length}/2
            </div>
          </div>
        );

      case 3:
        const availableFeats = [
          "Alert",
          "Athlete",
          "Actor",
          "Charger",
          "Defensive Duelist",
          "Dual Wielder",
          "Dungeon Delver",
          "Durable",
          "Elemental Adept",
          "Fey Touched",
          "Gift of the Metallic Dragon",
          "Great Weapon Master",
          "Healer",
          "Heavily Armored",
          "Heavy Armor Master",
          "Inspiring Leader",
          "Keen Mind",
          "Lightly Armored",
          "Lucky",
          "Mage Slayer",
          "Magic Initiate",
          "Martial Adept",
          "Medium Armor Master",
          "Mobile",
          "Moderately Armored",
          "Mounted Combatant",
          "Observant",
          "Polearm Master",
          "Resilient",
          "Ritual Caster",
          "Savage Attacker",
          "Sentinel",
          "Shadow Touched",
          "Sharpshooter",
          "Shield Master",
          "Skilled",
          "Skulker",
          "Spell Sniper",
          "Tavern Brawler",
          "Telekinetic",
          "Telepathic",
          "Tough",
          "War Caster",
          "Weapon Master",
        ];

        return (
          <div style={{ display: "grid", gap: "24px" }}>
            <div style={{ textAlign: "center" }}>
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                Choose a Feat
              </h3>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                Select one feat to add to your character (optional)
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "12px",
                maxHeight: "400px",
                overflowY: "auto",
                padding: "8px",
              }}
            >
              {availableFeats.map((feat) => {
                const isSelected = levelUpData.selectedFeats.includes(feat);
                const isExpanded = expandedFeat === feat;

                return (
                  <div
                    key={feat}
                    style={{
                      border: `2px solid ${isSelected ? "#3b82f6" : "#d1d5db"}`,
                      borderRadius: "8px",
                      padding: "12px",
                      backgroundColor: isSelected ? "#dbeafe" : "white",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        marginBottom: isExpanded ? "12px" : "0",
                      }}
                      onClick={() => setExpandedFeat(isExpanded ? null : feat)}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: isSelected ? "600" : "500",
                          color: isSelected ? "#1e40af" : "#374151",
                        }}
                      >
                        {feat}
                      </span>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>
                        {isExpanded ? "−" : "+"}
                      </span>
                    </div>

                    {isExpanded && (
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#4b5563",
                            lineHeight: "1.4",
                            marginBottom: "12px",
                            padding: "8px",
                            backgroundColor: "#f9fafb",
                            borderRadius: "4px",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          {featDescriptions[feat] ||
                            "No description available."}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFeat(feat);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            backgroundColor: isSelected ? "#ef4444" : "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {isSelected ? "Remove Feat" : "Select Feat"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              {levelUpData.selectedFeats.length > 0
                ? `Selected: ${levelUpData.selectedFeats[0]}`
                : "No feat selected"}
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ display: "grid", gap: "24px" }}>
            <div
              style={{
                backgroundColor: "#fef3c7",
                border: "2px solid #f59e0b",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <Heart size={20} color="#f59e0b" />
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#92400e",
                  }}
                >
                  Hit Points
                </h3>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#92400e",
                }}
              >
                +{levelUpData.hitPointIncrease} HP (Total:{" "}
                {(character.hitPoints || character.hit_points || 0) +
                  levelUpData.hitPointIncrease}
                )
              </p>
              <p
                style={{
                  margin: "8px 0 0 0",
                  fontSize: "14px",
                  color: "#92400e",
                  opacity: 0.8,
                }}
              >
                Method:{" "}
                {levelUpData.hitPointMethod === "average"
                  ? "Average"
                  : levelUpData.hitPointMethod === "roll"
                  ? `Rolled (${levelUpData.rolledHP})`
                  : "Manual"}
              </p>
            </div>

            {levelUpData.abilityIncreases.length > 0 && (
              <div
                style={{
                  backgroundColor: "#ecfdf5",
                  border: "2px solid #10b981",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <Zap size={20} color="#10b981" />
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#065f46",
                    }}
                  >
                    Ability Score Increases
                  </h3>
                </div>
                {levelUpData.abilityIncreases.map((increase, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 0",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#10b981",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#065f46",
                        fontWeight: "500",
                      }}
                    >
                      {increase.ability}: {increase.from} → {increase.to}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {levelUpData.selectedFeats.length > 0 && (
              <div
                style={{
                  backgroundColor: "#dbeafe",
                  border: "2px solid #3b82f6",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <Star size={20} color="#3b82f6" />
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1e40af",
                    }}
                  >
                    New Feat
                  </h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    padding: "8px 0",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#3b82f6",
                      marginTop: "6px",
                    }}
                  />
                  <div>
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#1e40af",
                        fontWeight: "500",
                        display: "block",
                      }}
                    >
                      {levelUpData.selectedFeats[0]}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        lineHeight: "1.4",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      {featDescriptions[levelUpData.selectedFeats[0]]}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                backgroundColor: "#f3f4f6",
                border: "2px solid #6b7280",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <TrendingUp size={20} color="#6b7280" />
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Character Progression
                </h3>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    Current Level
                  </span>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#374151",
                    }}
                  >
                    {currentLevel}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    New Level
                  </span>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#10b981",
                    }}
                  >
                    {newLevel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: "100%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "24px 32px",
            position: "relative",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <X size={16} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <TrendingUp size={24} />
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>
              Level Up: {character.name}
            </h2>
          </div>

          <p style={{ margin: 0, fontSize: "18px", opacity: 0.9 }}>
            Advancing from Level {currentLevel} to Level {newLevel}
          </p>
        </div>

        <div
          style={{ padding: "20px 32px", borderBottom: "1px solid #e5e7eb" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                right: "16px",
                height: "2px",
                backgroundColor: "#e5e7eb",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  height: "100%",
                  backgroundColor: "#10b981",
                  width: `${((currentStep - 1) / 3) * 100}%`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {steps.map((step) => (
              <div
                key={step.number}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: step.completed
                      ? "#10b981"
                      : step.active
                      ? "#3b82f6"
                      : "#e5e7eb",
                    color: step.completed || step.active ? "white" : "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                  }}
                >
                  {step.number}
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: step.active ? "#3b82f6" : "#6b7280",
                    marginTop: "8px",
                    fontWeight: step.active ? "600" : "400",
                  }}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: "32px",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          {renderStepContent()}
        </div>

        <div
          style={{
            padding: "24px 32px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f9fafb",
          }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              backgroundColor: currentStep === 1 ? "#e5e7eb" : "#6b7280",
              color: currentStep === 1 ? "#9ca3af" : "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: currentStep === 1 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: currentStep === 1 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={onCancel}
              style={{
                padding: "12px 20px",
                backgroundColor: "transparent",
                color: "#6b7280",
                border: "2px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Cancel
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  backgroundColor: canProceed() ? "#3b82f6" : "#9ca3af",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: canProceed() ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isSaving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  backgroundColor: isSaving ? "#9ca3af" : "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <TrendingUp size={16} />
                {isSaving ? "Saving..." : "Complete Level Up"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
