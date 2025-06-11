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
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

import { standardFeats, hpData } from "../../data";
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
    asiChoice: "asi",
    featChoices: {},
  });

  const getSelectedFeat = () => {
    if (levelUpData.selectedFeats.length === 0) return null;
    return standardFeats.find(
      (feat) => feat.name === levelUpData.selectedFeats[0]
    );
  };

  const getSpellcastingAbility = () => {
    const spellcastingAbilities = {
      Charms: "charisma",
      Transfiguration: "intelligence",
      "Defense Against the Dark Arts": "wisdom",
      Healing: "wisdom",
      Divination: "wisdom",
      Magizoology: "wisdom",
    };
    return spellcastingAbilities[character.castingStyle] || "intelligence";
  };

  const featDescriptions = standardFeats.reduce((acc, feat) => {
    acc[feat.name] =
      feat.preview || (feat.description ? feat.description.join(" • ") : "");
    return acc;
  }, {});

  const getFeatChoicesNeeded = (feat) => {
    if (!feat || !feat.modifiers) return [];

    const choicesNeeded = [];

    feat.modifiers.abilityIncreases.forEach((increase, index) => {
      if (increase.type === "choice") {
        choicesNeeded.push({
          type: "abilityChoice",
          index,
          abilities: increase.abilities,
          amount: increase.amount,
          id: `ability_${index}`,
        });
      } else if (increase.type === "custom") {
        choicesNeeded.push({
          type: "abilityCustom",
          index,
          amount: increase.amount,
          id: `ability_${index}`,
        });
      }
    });

    feat.modifiers.skillProficiencies.forEach((skill, index) => {
      if (skill.type === "choice") {
        choicesNeeded.push({
          type: "skillChoice",
          index,
          count: skill.count,
          id: `skill_${index}`,
        });
      }
    });

    feat.modifiers.expertise.forEach((expertise, index) => {
      if (expertise.type === "choice") {
        choicesNeeded.push({
          type: "expertiseChoice",
          index,
          count: expertise.count,
          id: `expertise_${index}`,
        });
      }
    });

    return choicesNeeded;
  };

  const getAvailableSkills = () => {
    return [
      "Athletics",
      "Acrobatics",
      "Sleight of Hand",
      "Stealth",
      "Herbology",
      "History of Magic",
      "Investigation",
      "Magical Theory",
      "Muggle Studies",
      "Insight",
      "Magical Creatures",
      "Medicine",
      "Perception",
      "Potion Making",
      "Survival",
      "Deception",
      "Intimidation",
      "Performance",
      "Persuasion",
    ];
  };

  const getCurrentSkillProficiencies = () => {
    return character.skillProficiencies || [];
  };

  const updateFeatChoice = (choiceId, value) => {
    setLevelUpData((prev) => ({
      ...prev,
      featChoices: {
        ...prev.featChoices,
        [choiceId]: value,
      },
    }));
  };

  const isFeatChoiceComplete = (feat) => {
    if (!feat) return true;

    const choicesNeeded = getFeatChoicesNeeded(feat);
    return choicesNeeded.every((choice) => {
      const choiceValue = levelUpData.featChoices[choice.id];

      switch (choice.type) {
        case "abilityChoice":
        case "abilityCustom":
          return choiceValue && choice.abilities
            ? choice.abilities.includes(choiceValue)
            : !!choiceValue;
        case "skillChoice":
          return (
            Array.isArray(choiceValue) && choiceValue.length === choice.count
          );
        case "expertiseChoice":
          return (
            Array.isArray(choiceValue) && choiceValue.length === choice.count
          );
        default:
          return true;
      }
    });
  };

  const currentLevel = character.level || 1;
  const newLevel = currentLevel + 1;

  const asiLevels = [4, 8, 12, 16, 19];
  const isAsiLevel = asiLevels.includes(newLevel);

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
    if (!character.castingStyle) return 6;

    const castingData = hpData[character.castingStyle];
    if (!castingData) return 6;

    return castingData.hitDie || 6;
  };
  const baseHitDie = getBaseHPIncrease();
  const constitution = getAbilityScore("constitution");
  const conMod = Math.floor((constitution - 10) / 2);

  const getSteps = () => {
    if (isAsiLevel) {
      return [
        {
          number: 1,
          title: "Hit Points",
          completed: currentStep > 1,
          active: currentStep === 1,
        },
        {
          number: 2,
          title: "ASI or Feat",
          completed: currentStep > 2,
          active: currentStep === 2,
        },
        {
          number: 3,
          title: "Summary",
          completed: false,
          active: currentStep === 3,
        },
      ];
    } else {
      return [
        {
          number: 1,
          title: "Hit Points",
          completed: currentStep > 1,
          active: currentStep === 1,
        },
        {
          number: 2,
          title: "Summary",
          completed: false,
          active: currentStep === 2,
        },
      ];
    }
  };

  const steps = getSteps();
  const maxSteps = steps.length;
  const rollHitPoints = () => {
    const roller = new DiceRoller();
    const rollResult = roller.roll(`1d${baseHitDie}`);

    const rollValue = rollResult.total;
    const total = rollValue + conMod;

    setLevelUpData((prev) => ({
      ...prev,
      rolledHP: rollValue,
      rollDetails: {
        notation: rollResult.notation,
        output: rollResult.output,
        rollValue: rollValue,
        modifier: conMod,
        total: Math.max(1, total),
      },
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
        if (currentScore >= 20) return prev;
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

  const toggleFeat = (featName) => {
    setLevelUpData((prev) => {
      const isSelected = prev.selectedFeats.includes(featName);
      if (isSelected) {
        return {
          ...prev,
          selectedFeats: [],
          featChoices: {},
        };
      } else {
        return {
          ...prev,
          selectedFeats: [featName],
          featChoices: {},
        };
      }
    });
  };

  const handleAsiChoiceChange = (choice) => {
    setLevelUpData((prev) => ({
      ...prev,
      asiChoice: choice,

      abilityIncreases: choice === "feat" ? [] : prev.abilityIncreases,
      selectedFeats: choice === "asi" ? [] : prev.selectedFeats,
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return levelUpData.hitPointIncrease > 0;
      case 2:
        if (isAsiLevel) {
          if (levelUpData.asiChoice === "asi") {
            return levelUpData.abilityIncreases.length === 2;
          } else {
            const selectedFeat = getSelectedFeat();
            return (
              levelUpData.selectedFeats.length === 1 &&
              isFeatChoiceComplete(selectedFeat)
            );
          }
        } else {
          return true;
        }
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < maxSteps) {
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

      if (
        isAsiLevel &&
        levelUpData.asiChoice === "asi" &&
        levelUpData.abilityIncreases.length > 0
      ) {
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

      if (
        isAsiLevel &&
        levelUpData.asiChoice === "feat" &&
        levelUpData.selectedFeats.length > 0
      ) {
        const selectedFeat = getSelectedFeat();

        if (selectedFeat && selectedFeat.modifiers) {
          const newAbilityScores = { ...updatedCharacter.ability_scores };

          selectedFeat.modifiers.abilityIncreases.forEach((increase, index) => {
            let abilityToIncrease;

            switch (increase.type) {
              case "fixed":
                abilityToIncrease = increase.ability;
                break;
              case "choice":
              case "custom":
                abilityToIncrease = levelUpData.featChoices[`ability_${index}`];
                break;
              case "spellcastingAbility":
                abilityToIncrease = getSpellcastingAbility();
                break;
              default:
                break;
            }

            if (abilityToIncrease) {
              const currentScore = newAbilityScores[abilityToIncrease] || 10;
              newAbilityScores[abilityToIncrease] = Math.min(
                20,
                currentScore + increase.amount
              );
              updatedCharacter[abilityToIncrease] =
                newAbilityScores[abilityToIncrease];
            }
          });

          updatedCharacter.ability_scores = newAbilityScores;
          updatedCharacter.abilityScores = newAbilityScores;

          const currentSkills = [
            ...(updatedCharacter.skill_proficiencies ||
              updatedCharacter.skillProficiencies ||
              []),
          ];

          selectedFeat.modifiers.skillProficiencies.forEach(
            (skillGrant, index) => {
              if (skillGrant.type === "choice") {
                const chosenSkills =
                  levelUpData.featChoices[`skill_${index}`] || [];
                chosenSkills.forEach((skill) => {
                  if (!currentSkills.includes(skill)) {
                    currentSkills.push(skill);
                  }
                });
              }
            }
          );

          updatedCharacter.skill_proficiencies = currentSkills;
          updatedCharacter.skillProficiencies = currentSkills;

          if (selectedFeat.name === "Tough") {
            const toughBonus = 2 * newLevel;
            updatedCharacter.hit_points += toughBonus;
            updatedCharacter.hitPoints += toughBonus;
          }
        }

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

      if (isAsiLevel) {
        const asiChoices = character.asi_choices || character.asiChoices || {};
        asiChoices[newLevel] = {
          choice: levelUpData.asiChoice,
          ...(levelUpData.asiChoice === "asi" && {
            abilityIncreases: levelUpData.abilityIncreases,
          }),
          ...(levelUpData.asiChoice === "feat" && {
            selectedFeat: levelUpData.selectedFeats[0],
            featChoices: levelUpData.featChoices,
          }),
        };
        updatedCharacter.asi_choices = asiChoices;
        updatedCharacter.asiChoices = asiChoices;
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
        if (isAsiLevel) {
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
                  🌟 Ability Score Improvement or Feat
                </h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                  At level {newLevel}, choose either an Ability Score
                  Improvement or a Feat
                </p>
              </div>

              {/* Choice Selection */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 20px",
                    border: `2px solid ${
                      levelUpData.asiChoice === "asi" ? "#3b82f6" : "#d1d5db"
                    }`,
                    borderRadius: "8px",
                    backgroundColor:
                      levelUpData.asiChoice === "asi" ? "#dbeafe" : "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input
                    type="radio"
                    value="asi"
                    checked={levelUpData.asiChoice === "asi"}
                    onChange={(e) => handleAsiChoiceChange(e.target.value)}
                  />
                  <span style={{ fontWeight: "500" }}>
                    Ability Score Improvement (+2 points)
                  </span>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 20px",
                    border: `2px solid ${
                      levelUpData.asiChoice === "feat" ? "#3b82f6" : "#d1d5db"
                    }`,
                    borderRadius: "8px",
                    backgroundColor:
                      levelUpData.asiChoice === "feat" ? "#dbeafe" : "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input
                    type="radio"
                    value="feat"
                    checked={levelUpData.asiChoice === "feat"}
                    onChange={(e) => handleAsiChoiceChange(e.target.value)}
                  />
                  <span style={{ fontWeight: "500" }}>Feat</span>
                </label>
              </div>

              {/* ASI Content */}
              {levelUpData.asiChoice === "asi" && (
                <div>
                  <h4 style={{ margin: "0 0 16px 0", textAlign: "center" }}>
                    Select Two Ability Score Increases
                  </h4>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "16px",
                    }}
                  >
                    {[
                      "Strength",
                      "Dexterity",
                      "Constitution",
                      "Intelligence",
                      "Wisdom",
                      "Charisma",
                    ].map((ability) => {
                      const currentScore = getAbilityScore(ability);
                      const isSelected = levelUpData.abilityIncreases.find(
                        (inc) => inc.ability === ability
                      );
                      const canSelect =
                        isSelected ||
                        (levelUpData.abilityIncreases.length < 2 &&
                          currentScore < 20);

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
                          onClick={() =>
                            canSelect && toggleAbilityIncrease(ability)
                          }
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ fontWeight: "500" }}>{ability}</span>
                            <span
                              style={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              {currentScore}{" "}
                              {isSelected && "→ " + (currentScore + 1)}
                            </span>
                          </div>
                          {currentScore >= 20 && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#ef4444",
                                marginTop: "4px",
                              }}
                            >
                              Already at maximum (20)
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
                      marginTop: "16px",
                    }}
                  >
                    Selected: {levelUpData.abilityIncreases.length}/2
                    {levelUpData.abilityIncreases.length < 2 && (
                      <div style={{ color: "#f59e0b", marginTop: "8px" }}>
                        ⚠️ You must select exactly 2 ability score increases
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Feat Content */}
              {levelUpData.asiChoice === "feat" && (
                <div>
                  <h4 style={{ margin: "0 0 16px 0", textAlign: "center" }}>
                    Select One Feat
                  </h4>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: "12px",
                      maxHeight: "400px",
                      overflowY: "auto",
                      padding: "8px",
                    }}
                  >
                    {standardFeats.map((feat) => {
                      const isSelected = levelUpData.selectedFeats.includes(
                        feat.name
                      );
                      const isExpanded = expandedFeat === feat.name;
                      const choicesNeeded = getFeatChoicesNeeded(feat);
                      const isChoiceComplete = isFeatChoiceComplete(feat);

                      return (
                        <div
                          key={feat.name}
                          style={{
                            border: `2px solid ${
                              isSelected ? "#3b82f6" : "#d1d5db"
                            }`,
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
                            onClick={() =>
                              setExpandedFeat(isExpanded ? null : feat.name)
                            }
                          >
                            <div>
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: isSelected ? "600" : "500",
                                  color: isSelected ? "#1e40af" : "#374151",
                                  display: "block",
                                }}
                              >
                                {feat.name}
                              </span>
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  fontStyle: "italic",
                                }}
                              >
                                {feat.preview}
                              </span>
                            </div>
                            <span
                              style={{ fontSize: "12px", color: "#6b7280" }}
                            >
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
                                {feat.description.map((line, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      marginBottom:
                                        index < feat.description.length - 1
                                          ? "4px"
                                          : "0",
                                    }}
                                  >
                                    • {line}
                                  </div>
                                ))}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFeat(feat.name);
                                }}
                                style={{
                                  width: "100%",
                                  padding: "8px 12px",
                                  backgroundColor: isSelected
                                    ? "#ef4444"
                                    : "#3b82f6",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  marginBottom:
                                    isSelected && choicesNeeded.length > 0
                                      ? "12px"
                                      : "0",
                                }}
                              >
                                {isSelected ? "Remove Feat" : "Select Feat"}
                              </button>

                              {/* Feat Choices Interface */}
                              {isSelected && choicesNeeded.length > 0 && (
                                <div
                                  style={{
                                    padding: "12px",
                                    backgroundColor: "#f0f9ff",
                                    borderRadius: "6px",
                                    border: "1px solid #0ea5e9",
                                  }}
                                >
                                  <h5
                                    style={{
                                      margin: "0 0 8px 0",
                                      fontSize: "13px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Make Your Choices:
                                  </h5>

                                  {choicesNeeded.map((choice) => (
                                    <div
                                      key={choice.id}
                                      style={{ marginBottom: "8px" }}
                                    >
                                      {choice.type === "abilityChoice" && (
                                        <div>
                                          <label
                                            style={{
                                              fontSize: "12px",
                                              fontWeight: "500",
                                            }}
                                          >
                                            Choose ability (+{choice.amount}):
                                          </label>
                                          <select
                                            value={
                                              levelUpData.featChoices[
                                                choice.id
                                              ] || ""
                                            }
                                            onChange={(e) =>
                                              updateFeatChoice(
                                                choice.id,
                                                e.target.value
                                              )
                                            }
                                            style={{
                                              width: "100%",
                                              padding: "4px 8px",
                                              fontSize: "12px",
                                              border: "1px solid #d1d5db",
                                              borderRadius: "4px",
                                              marginTop: "4px",
                                            }}
                                          >
                                            <option value="">
                                              Select ability...
                                            </option>
                                            {choice.abilities.map((ability) => (
                                              <option
                                                key={ability}
                                                value={ability}
                                              >
                                                {ability
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  ability.slice(1)}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      )}

                                      {choice.type === "abilityCustom" && (
                                        <div>
                                          <label
                                            style={{
                                              fontSize: "12px",
                                              fontWeight: "500",
                                            }}
                                          >
                                            Choose any ability (+{choice.amount}
                                            ):
                                          </label>
                                          <select
                                            value={
                                              levelUpData.featChoices[
                                                choice.id
                                              ] || ""
                                            }
                                            onChange={(e) =>
                                              updateFeatChoice(
                                                choice.id,
                                                e.target.value
                                              )
                                            }
                                            style={{
                                              width: "100%",
                                              padding: "4px 8px",
                                              fontSize: "12px",
                                              border: "1px solid #d1d5db",
                                              borderRadius: "4px",
                                              marginTop: "4px",
                                            }}
                                          >
                                            <option value="">
                                              Select ability...
                                            </option>
                                            <option value="strength">
                                              Strength
                                            </option>
                                            <option value="dexterity">
                                              Dexterity
                                            </option>
                                            <option value="constitution">
                                              Constitution
                                            </option>
                                            <option value="intelligence">
                                              Intelligence
                                            </option>
                                            <option value="wisdom">
                                              Wisdom
                                            </option>
                                            <option value="charisma">
                                              Charisma
                                            </option>
                                          </select>
                                        </div>
                                      )}

                                      {choice.type === "skillChoice" && (
                                        <div>
                                          <label
                                            style={{
                                              fontSize: "12px",
                                              fontWeight: "500",
                                            }}
                                          >
                                            Choose {choice.count} skill(s):
                                          </label>
                                          <div
                                            style={{
                                              marginTop: "4px",
                                              display: "grid",
                                              gridTemplateColumns:
                                                "repeat(2, 1fr)",
                                              gap: "4px",
                                            }}
                                          >
                                            {getAvailableSkills()
                                              .filter(
                                                (skill) =>
                                                  !getCurrentSkillProficiencies().includes(
                                                    skill
                                                  )
                                              )
                                              .map((skill) => {
                                                const currentChoices =
                                                  levelUpData.featChoices[
                                                    choice.id
                                                  ] || [];
                                                const isChosen =
                                                  currentChoices.includes(
                                                    skill
                                                  );
                                                const canChoose =
                                                  isChosen ||
                                                  currentChoices.length <
                                                    choice.count;

                                                return (
                                                  <label
                                                    key={skill}
                                                    style={{
                                                      fontSize: "11px",
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap: "4px",
                                                      cursor: canChoose
                                                        ? "pointer"
                                                        : "not-allowed",
                                                      opacity: canChoose
                                                        ? 1
                                                        : 0.5,
                                                    }}
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={isChosen}
                                                      disabled={!canChoose}
                                                      onChange={(e) => {
                                                        const newChoices = e
                                                          .target.checked
                                                          ? [
                                                              ...currentChoices,
                                                              skill,
                                                            ]
                                                          : currentChoices.filter(
                                                              (s) => s !== skill
                                                            );
                                                        updateFeatChoice(
                                                          choice.id,
                                                          newChoices
                                                        );
                                                      }}
                                                      style={{
                                                        width: "12px",
                                                        height: "12px",
                                                      }}
                                                    />
                                                    {skill}
                                                  </label>
                                                );
                                              })}
                                          </div>
                                        </div>
                                      )}

                                      {choice.type === "expertiseChoice" && (
                                        <div>
                                          <label
                                            style={{
                                              fontSize: "12px",
                                              fontWeight: "500",
                                            }}
                                          >
                                            Choose {choice.count} skill(s) for
                                            expertise:
                                          </label>
                                          <div style={{ marginTop: "4px" }}>
                                            <select
                                              value={
                                                levelUpData.featChoices[
                                                  choice.id
                                                ] || ""
                                              }
                                              onChange={(e) =>
                                                updateFeatChoice(choice.id, [
                                                  e.target.value,
                                                ])
                                              }
                                              style={{
                                                width: "100%",
                                                padding: "4px 8px",
                                                fontSize: "12px",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "4px",
                                              }}
                                            >
                                              <option value="">
                                                Select skill...
                                              </option>
                                              {getCurrentSkillProficiencies().map(
                                                (skill) => (
                                                  <option
                                                    key={skill}
                                                    value={skill}
                                                  >
                                                    {skill}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}

                                  {!isChoiceComplete && (
                                    <div
                                      style={{
                                        color: "#dc2626",
                                        fontSize: "11px",
                                        marginTop: "4px",
                                      }}
                                    >
                                      ⚠️ Complete all choices to proceed
                                    </div>
                                  )}
                                </div>
                              )}
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
                      marginTop: "16px",
                    }}
                  >
                    {levelUpData.selectedFeats.length > 0 ? (
                      `Selected: ${levelUpData.selectedFeats[0]}${
                        !isFeatChoiceComplete(getSelectedFeat())
                          ? " (incomplete)"
                          : ""
                      }`
                    ) : (
                      <div style={{ color: "#f59e0b" }}>
                        ⚠️ You must select exactly 1 feat
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        } else {
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

              <div
                style={{
                  backgroundColor: "#e0f2fe",
                  border: "2px solid #0284c7",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#0c4a6e",
                  }}
                >
                  📚 Level {newLevel} Benefits
                </h3>
                <p style={{ margin: 0, color: "#0c4a6e", fontSize: "14px" }}>
                  You gain class features and improvements based on your casting
                  style.
                  <br />
                  ASI or Feat choices are only available at levels 4, 8, 12, 16,
                  and 19.
                </p>
              </div>
            </div>
          );
        }

      case 3:
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

            {levelUpData.asiChoice === "asi" &&
              levelUpData.abilityIncreases.length > 0 && (
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

            {levelUpData.asiChoice === "feat" &&
              levelUpData.selectedFeats.length > 0 && (
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
            {isAsiLevel && (
              <span
                style={{
                  fontSize: "14px",
                  marginTop: "4px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  display: "inline-block",
                }}
              >
                🌟 ASI Level - Choose ASI or Feat
              </span>
            )}
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
                  width: `${((currentStep - 1) / (maxSteps - 1)) * 100}%`,
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

            {currentStep < maxSteps ? (
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
