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
  Search,
} from "lucide-react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { standardFeats } from "../../SharedData/standardFeatData";
import { hpData } from "../../SharedData/data";
import { checkFeatPrerequisites } from "../../CharacterSheet/utils";
import { getAllSelectedFeats } from "../utils";
import { useTheme } from "../../../contexts/ThemeContext";

const LevelUpModal = ({
  character,
  isOpen,
  onSave,
  onCancel,
  user,
  supabase,
}) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedFeat, setExpandedFeat] = useState(null);
  const [featFilter, setFeatFilter] = useState("");

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

  const getAbilityScore = (abilityName) => {
    const lowerName = abilityName.toLowerCase();

    if (
      character.ability_scores &&
      typeof character.ability_scores === "object"
    ) {
      const score = character.ability_scores[lowerName];
      if (score !== undefined && score !== null) {
        const numScore = parseInt(score, 10);
        if (!isNaN(numScore) && numScore > 0 && numScore <= 30) {
          return numScore;
        }
      }
    }

    if (
      character.abilityScores &&
      typeof character.abilityScores === "object"
    ) {
      const score = character.abilityScores[lowerName];
      if (score !== undefined && score !== null) {
        const numScore = parseInt(score, 10);
        if (!isNaN(numScore) && numScore > 0 && numScore <= 30) {
          return numScore;
        }
      }
    }

    if (character[lowerName] !== undefined && character[lowerName] !== null) {
      const numScore = parseInt(character[lowerName], 10);
      if (!isNaN(numScore) && numScore > 0 && numScore <= 30) {
        return numScore;
      }
    }

    console.error(
      `Could not find valid ability score for ${abilityName}. Character object:`,
      character
    );
    console.error(`Available ability_scores:`, character.ability_scores);
    return 10;
  };

  const getFilteredFeats = () => {
    if (!featFilter.trim()) {
      return getAvailableFeats();
    }

    const searchTerm = featFilter.toLowerCase();
    return getAvailableFeats().filter((feat) => {
      if (feat.name.toLowerCase().includes(searchTerm)) {
        return true;
      }

      if (feat.preview && feat.preview.toLowerCase().includes(searchTerm)) {
        return true;
      }

      if (
        feat.description &&
        feat.description.some((desc) => desc.toLowerCase().includes(searchTerm))
      ) {
        return true;
      }

      return false;
    });
  };

  const getAvailableFeats = () => {
    const allSelectedFeats = getAllSelectedFeats(character);

    const excludedFeats = allSelectedFeats.filter(
      (featName) => !levelUpData.selectedFeats.includes(featName)
    );

    return standardFeats.filter((feat) => {
      if (!checkFeatPrerequisites(feat, character)) {
        return false;
      }

      if (excludedFeats.includes(feat.name)) {
        return false;
      }

      return true;
    });
  };

  const getSelectedFeat = () => {
    if (levelUpData.selectedFeats.length === 0) return null;
    return standardFeats.find(
      (feat) => feat.name === levelUpData.selectedFeats[0]
    );
  };

  const rollHitPoints = () => {
    const roller = new DiceRoller();
    const baseHitDie = getBaseHPIncrease();
    const result = roller.roll(`1d${baseHitDie}`);
    const rolledValue = result.total;
    const constitution = getAbilityScore("constitution");
    const conMod = Math.floor((constitution - 10) / 2);
    const finalHP = Math.max(1, rolledValue + conMod);

    setLevelUpData((prev) => ({
      ...prev,
      hitPointIncrease: finalHP,
      hitPointMethod: "roll",
      rolledHP: rolledValue,
      manualHP: 0,
    }));
  };

  const useAverageHitPoints = () => {
    const baseHitDie = getBaseHPIncrease();
    const averageRoll = Math.floor(baseHitDie / 2) + 1;
    const constitution = getAbilityScore("constitution");
    const conMod = Math.floor((constitution - 10) / 2);
    const finalHP = Math.max(1, averageRoll + conMod);

    setLevelUpData((prev) => ({
      ...prev,
      hitPointIncrease: finalHP,
      hitPointMethod: "average",
      rolledHP: null,
      manualHP: 0,
    }));
  };

  const handleManualHitPoints = (value) => {
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

        if (currentScore >= 20) {
          console.warn(
            `${ability} is already at maximum (20), current score: ${currentScore}`
          );
          return prev;
        }

        const newIncrease = {
          ability,
          from: currentScore,
          to: currentScore + 1,
        };

        return {
          ...prev,
          abilityIncreases: [...prev.abilityIncreases, newIncrease],
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

    if (choice === "asi") {
      setFeatFilter("");
    }
  };

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

  const getAvailableSkills = ({ character }) => {
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
    return character.skill_proficiencies || character.skillProficiencies || [];
  };

  const getSpellcastingAbility = () => {
    return "intelligence";
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

  const getBaseHPIncrease = () => {
    if (!character.casting_style && !character.castingStyle) return 6;

    const castingStyle = character.casting_style || character.castingStyle;
    const castingData = hpData[castingStyle];
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
          title: "Review",
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
          title: "Review",
          completed: false,
          active: currentStep === 2,
        },
      ];
    }
  };

  const steps = getSteps();
  const maxSteps = steps.length;

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
      const castingStyle = character.casting_style || character.castingStyle;
      const castingData = hpData[castingStyle];

      let newFullHP = 1;

      if (castingData) {
        const finalConstitution =
          isAsiLevel &&
          levelUpData.asiChoice === "asi" &&
          levelUpData.abilityIncreases.some(
            (inc) => inc.ability === "Constitution"
          )
            ? getAbilityScore("constitution") + 1
            : getAbilityScore("constitution");

        const conMod = Math.floor((finalConstitution - 10) / 2);
        const baseHP = castingData.base + conMod;
        const additionalHP =
          (newLevel - 1) * (castingData.avgPerLevel + conMod);
        newFullHP = Math.max(1, baseHP + additionalHP);
      }

      const updatedCharacter = {
        ...character,
        level: newLevel,
        hit_points: newFullHP,
        hitPoints: newFullHP,
      };

      if (
        isAsiLevel &&
        levelUpData.asiChoice === "asi" &&
        levelUpData.abilityIncreases.length > 0
      ) {
        const currentAbilityScores = character.ability_scores || {};

        const newAbilityScores = {
          strength: getAbilityScore("strength"),
          dexterity: getAbilityScore("dexterity"),
          constitution: getAbilityScore("constitution"),
          intelligence: getAbilityScore("intelligence"),
          wisdom: getAbilityScore("wisdom"),
          charisma: getAbilityScore("charisma"),
          ...currentAbilityScores,
        };

        levelUpData.abilityIncreases.forEach((increase) => {
          const abilityKey = increase.ability.toLowerCase();
          const newScore = parseInt(increase.to, 10);
          if (!isNaN(newScore) && newScore > 0 && newScore <= 30) {
            newAbilityScores[abilityKey] = newScore;
          } else {
            console.error(
              `Invalid ability score increase for ${abilityKey}: ${increase.to}`
            );
            const currentScore = getAbilityScore(abilityKey);
            newAbilityScores[abilityKey] = Math.min(20, currentScore + 1);
          }
        });

        updatedCharacter.ability_scores = newAbilityScores;
        updatedCharacter.abilityScores = newAbilityScores;

        Object.keys(newAbilityScores).forEach((ability) => {
          updatedCharacter[ability] = newAbilityScores[ability];
        });

        if (
          levelUpData.abilityIncreases.some(
            (inc) => inc.ability.toLowerCase() === "constitution"
          )
        ) {
          const newConMod = Math.floor(
            (newAbilityScores.constitution - 10) / 2
          );
          const newBaseHP = castingData.base + newConMod;
          const newAdditionalHP =
            (newLevel - 1) * (castingData.avgPerLevel + newConMod);
          const recalculatedFullHP = Math.max(1, newBaseHP + newAdditionalHP);

          updatedCharacter.hit_points = recalculatedFullHP;
          updatedCharacter.hitPoints = recalculatedFullHP;
        }
      }

      if (
        isAsiLevel &&
        levelUpData.asiChoice === "feat" &&
        levelUpData.selectedFeats.length > 0
      ) {
        const selectedFeat = getSelectedFeat();

        if (selectedFeat && selectedFeat.modifiers) {
          const newAbilityScores = {
            strength: getAbilityScore("strength"),
            dexterity: getAbilityScore("dexterity"),
            constitution: getAbilityScore("constitution"),
            intelligence: getAbilityScore("intelligence"),
            wisdom: getAbilityScore("wisdom"),
            charisma: getAbilityScore("charisma"),
            ...(updatedCharacter.ability_scores || {}),
          };

          let constitutionChanged = false;

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
              if (abilityToIncrease.toLowerCase() === "constitution") {
                constitutionChanged = true;
              }
              const currentScore = newAbilityScores[abilityToIncrease] || 10;
              const newScore = Math.min(20, currentScore + increase.amount);
              newAbilityScores[abilityToIncrease] = newScore;
            }
          });

          updatedCharacter.ability_scores = newAbilityScores;
          updatedCharacter.abilityScores = newAbilityScores;
          Object.keys(newAbilityScores).forEach((ability) => {
            updatedCharacter[ability] = newAbilityScores[ability];
          });

          if (constitutionChanged && castingData) {
            const newConMod = Math.floor(
              (newAbilityScores.constitution - 10) / 2
            );
            const newBaseHP = castingData.base + newConMod;
            const newAdditionalHP =
              (newLevel - 1) * (castingData.avgPerLevel + newConMod);
            const recalculatedFullHP = Math.max(1, newBaseHP + newAdditionalHP);

            updatedCharacter.hit_points = recalculatedFullHP;
            updatedCharacter.hitPoints = recalculatedFullHP;
          }

          const currentSkills = [
            ...(updatedCharacter.skill_proficiencies || []),
          ];
          selectedFeat.modifiers.skillProficiencies.forEach(
            (skillMod, index) => {
              if (skillMod.type === "choice") {
                const selectedSkills =
                  levelUpData.featChoices[`skill_${index}`] || [];
                selectedSkills.forEach((skill) => {
                  if (!currentSkills.includes(skill)) {
                    currentSkills.push(skill);
                  }
                });
              } else if (skillMod.type === "fixed") {
                skillMod.skills.forEach((skill) => {
                  if (!currentSkills.includes(skill)) {
                    currentSkills.push(skill);
                  }
                });
              }
            }
          );
          updatedCharacter.skill_proficiencies = currentSkills;

          const currentExpertise = [
            ...(updatedCharacter.skill_expertise || []),
          ];
          selectedFeat.modifiers.expertise.forEach((expertiseMod, index) => {
            if (expertiseMod.type === "choice") {
              const selectedExpertise =
                levelUpData.featChoices[`expertise_${index}`] || [];
              selectedExpertise.forEach((skill) => {
                if (!currentExpertise.includes(skill)) {
                  currentExpertise.push(skill);
                }
              });
            }
          });
          updatedCharacter.skill_expertise = currentExpertise;

          const currentFeats = [...(updatedCharacter.standard_feats || [])];
          if (!currentFeats.includes(selectedFeat.name)) {
            currentFeats.push(selectedFeat.name);
          }
          updatedCharacter.standard_feats = currentFeats;
        }
      }

      await onSave(updatedCharacter);
      setIsSaving(false);
    } catch (error) {
      console.error("Error during level up:", error);
      alert("Failed to save level up: " + error.message);
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: theme.text,
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              Choose Your Hit Point Increase
            </h3>

            <div
              style={{
                display: "grid",
                gap: "16px",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {/* Average Option */}
              <div
                style={{
                  border: `2px solid ${
                    levelUpData.hitPointMethod === "average"
                      ? theme.primary
                      : theme.border
                  }`,
                  borderRadius: "12px",
                  padding: "20px",
                  cursor: "pointer",
                  backgroundColor:
                    levelUpData.hitPointMethod === "average"
                      ? `${theme.primary}15`
                      : theme.surface,
                  transition: "all 0.2s ease",
                }}
                onClick={useAverageHitPoints}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: theme.text,
                      }}
                    >
                      Average ({Math.floor(baseHitDie / 2) + 1})
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: theme.textSecondary,
                      }}
                    >
                      Reliable choice - take the average roll
                    </p>
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: theme.primary,
                    }}
                  >
                    +{Math.max(1, Math.floor(baseHitDie / 2) + 1 + conMod)}
                  </div>
                </div>
              </div>

              {/* Roll Option */}
              <div
                style={{
                  border: `2px solid ${
                    levelUpData.hitPointMethod === "roll"
                      ? theme.primary
                      : theme.border
                  }`,
                  borderRadius: "12px",
                  padding: "20px",
                  cursor: "pointer",
                  backgroundColor:
                    levelUpData.hitPointMethod === "roll"
                      ? `${theme.primary}15`
                      : theme.surface,
                  transition: "all 0.2s ease",
                }}
                onClick={rollHitPoints}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "16px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: theme.text,
                      }}
                    >
                      <Dice6 size={20} />
                      Roll (1d{baseHitDie})
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: theme.textSecondary,
                      }}
                    >
                      Take your chances with the dice
                    </p>
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: theme.primary,
                    }}
                  >
                    {levelUpData.hitPointMethod === "roll"
                      ? `+${levelUpData.hitPointIncrease}`
                      : `+?`}
                  </div>
                </div>
                {levelUpData.hitPointMethod === "roll" && (
                  <div
                    style={{
                      marginTop: "12px",
                      fontSize: "12px",
                      color: theme.textSecondary,
                    }}
                  >
                    Rolled: {levelUpData.rolledHP} + {conMod} (CON) = +
                    {levelUpData.hitPointIncrease}
                  </div>
                )}
              </div>

              {/* Manual Option */}
              <div
                style={{
                  border: `2px solid ${
                    levelUpData.hitPointMethod === "manual"
                      ? theme.primary
                      : theme.border
                  }`,
                  borderRadius: "12px",
                  padding: "20px",
                  backgroundColor:
                    levelUpData.hitPointMethod === "manual"
                      ? `${theme.primary}15`
                      : theme.surface,
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: theme.text,
                      }}
                    >
                      Manual Entry
                    </h4>
                    <p
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "14px",
                        color: theme.textSecondary,
                      }}
                    >
                      Enter your own value
                    </p>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={levelUpData.manualHP}
                      onChange={(e) =>
                        handleManualHitPoints(parseInt(e.target.value) || 0)
                      }
                      placeholder="Enter HP increase"
                      style={{
                        width: "150px",
                        padding: "8px 12px",
                        border: `1px solid ${theme.border}`,
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: theme.surface,
                        color: theme.text,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: theme.primary,
                    }}
                  >
                    +
                    {levelUpData.hitPointMethod === "manual"
                      ? levelUpData.hitPointIncrease
                      : 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        if (isAsiLevel) {
          return (
            <div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: "24px",
                  textAlign: "center",
                }}
              >
                Ability Score Improvement or Feat
              </h3>

              {/* Choice Selection */}
              <div
                style={{
                  display: "grid",
                  gap: "16px",
                  maxWidth: "600px",
                  margin: "0 auto 32px auto",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px 24px",
                    border: `2px solid ${
                      levelUpData.asiChoice === "asi"
                        ? theme.primary
                        : theme.border
                    }`,
                    borderRadius: "8px",
                    backgroundColor:
                      levelUpData.asiChoice === "asi"
                        ? `${theme.primary}15`
                        : theme.surface,
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
                  <span style={{ fontWeight: "500", color: theme.text }}>
                    Ability Score Improvement (+2 points)
                  </span>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px 24px",
                    border: `2px solid ${
                      levelUpData.asiChoice === "feat"
                        ? theme.primary
                        : theme.border
                    }`,
                    borderRadius: "8px",
                    backgroundColor:
                      levelUpData.asiChoice === "feat"
                        ? `${theme.primary}15`
                        : theme.surface,
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
                  <span style={{ fontWeight: "500", color: theme.text }}>
                    Choose a Feat
                  </span>
                </label>
              </div>

              {/* ASI Selection */}
              {levelUpData.asiChoice === "asi" && (
                <div>
                  <h4
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "16px",
                      textAlign: "center",
                      color: theme.text,
                    }}
                  >
                    Select Two Ability Scores to Increase
                  </h4>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "12px",
                      maxWidth: "800px",
                      margin: "0 auto",
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
                      const currentScore = getAbilityScore(
                        ability.toLowerCase()
                      );
                      const isSelected = levelUpData.abilityIncreases.some(
                        (inc) => inc.ability === ability
                      );
                      const canSelect =
                        !isSelected &&
                        levelUpData.abilityIncreases.length < 2 &&
                        currentScore < 20;

                      return (
                        <div
                          key={ability}
                          style={{
                            border: `2px solid ${
                              isSelected
                                ? theme.success
                                : canSelect
                                ? theme.border
                                : theme.textSecondary
                            }`,
                            borderRadius: "8px",
                            padding: "16px",
                            cursor: canSelect ? "pointer" : "not-allowed",
                            backgroundColor: isSelected
                              ? `${theme.success}15`
                              : theme.surface,
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
                            <span
                              style={{ fontWeight: "500", color: theme.text }}
                            >
                              {ability}
                            </span>
                            <span
                              style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: theme.text,
                              }}
                            >
                              {currentScore}{" "}
                              {isSelected && "→ " + (currentScore + 1)}
                            </span>
                          </div>
                          {currentScore >= 20 && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: theme.error,
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
                      color: theme.textSecondary,
                      marginTop: "16px",
                    }}
                  >
                    Selected: {levelUpData.abilityIncreases.length}/2
                    {levelUpData.abilityIncreases.length < 2 && (
                      <div style={{ color: theme.warning, marginTop: "8px" }}>
                        ⚠️ You must select exactly 2 abilities to increase
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Feat Selection */}
              {levelUpData.asiChoice === "feat" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "20px",
                      maxWidth: "600px",
                      margin: "0 auto 20px auto",
                    }}
                  >
                    <div style={{ position: "relative", flex: 1 }}>
                      <Search
                        size={20}
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: theme.textSecondary,
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Search feats..."
                        value={featFilter}
                        onChange={(e) => setFeatFilter(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 44px",
                          border: `2px solid ${theme.border}`,
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "all 0.2s ease",
                          backgroundColor: theme.surface,
                          color: theme.text,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      border: `1px solid ${theme.border}`,
                      borderRadius: "8px",
                      backgroundColor: theme.background,
                    }}
                  >
                    {getFilteredFeats().map((feat) => {
                      const isSelected = levelUpData.selectedFeats.includes(
                        feat.name
                      );
                      const isExpanded = expandedFeat === feat.name;

                      return (
                        <div
                          key={feat.name}
                          style={{
                            border: `2px solid ${
                              isSelected ? theme.success : "transparent"
                            }`,
                            borderRadius: "8px",
                            margin: "8px",
                            backgroundColor: isSelected
                              ? `${theme.success}15`
                              : theme.surface,
                            overflow: "hidden",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div
                            style={{
                              padding: "16px",
                              cursor: "pointer",
                              borderBottom: isExpanded
                                ? `1px solid ${theme.border}`
                                : "none",
                            }}
                            onClick={() => toggleFeat(feat.name)}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: "12px",
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <h4
                                  style={{
                                    margin: "0 0 8px 0",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: theme.text,
                                  }}
                                >
                                  {feat.name}
                                </h4>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "14px",
                                    color: theme.textSecondary,
                                    lineHeight: "1.4",
                                  }}
                                >
                                  {feat.preview}
                                </p>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                {isSelected && (
                                  <Star
                                    size={20}
                                    fill={theme.success}
                                    color={theme.success}
                                  />
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedFeat(
                                      isExpanded ? null : feat.name
                                    );
                                  }}
                                  style={{
                                    padding: "4px 8px",
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: "4px",
                                    backgroundColor: theme.surface,
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    color: theme.text,
                                  }}
                                >
                                  {isExpanded ? "Less" : "More"}
                                </button>
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div
                              style={{
                                padding: "16px",
                                backgroundColor: theme.background,
                                fontSize: "14px",
                                lineHeight: "1.5",
                                color: theme.text,
                              }}
                            >
                              {Array.isArray(feat.description) ? (
                                feat.description.map((desc, index) => (
                                  <p
                                    key={index}
                                    style={{
                                      margin: "0 0 12px 0",
                                    }}
                                  >
                                    {desc}
                                  </p>
                                ))
                              ) : (
                                <p style={{ margin: 0 }}>{feat.description}</p>
                              )}
                            </div>
                          )}

                          {/* Feat Choices */}
                          {isSelected && (
                            <div style={{ padding: "16px" }}>
                              {getFeatChoicesNeeded(feat).map((choice) => (
                                <div
                                  key={choice.id}
                                  style={{ marginBottom: "16px" }}
                                >
                                  {choice.type === "abilityChoice" && (
                                    <div>
                                      <label
                                        style={{
                                          display: "block",
                                          marginBottom: "8px",
                                          fontSize: "14px",
                                          fontWeight: "500",
                                          color: theme.text,
                                        }}
                                      >
                                        Choose an ability to increase by{" "}
                                        {choice.amount}:
                                      </label>
                                      <select
                                        value={
                                          levelUpData.featChoices[choice.id] ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          updateFeatChoice(
                                            choice.id,
                                            e.target.value
                                          )
                                        }
                                        style={{
                                          width: "100%",
                                          padding: "8px 12px",
                                          border: `1px solid ${theme.border}`,
                                          borderRadius: "6px",
                                          fontSize: "14px",
                                          backgroundColor: theme.surface,
                                          color: theme.text,
                                        }}
                                      >
                                        <option value="">
                                          Select an ability...
                                        </option>
                                        {choice.abilities.map((ability) => (
                                          <option key={ability} value={ability}>
                                            {ability}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  )}

                                  {choice.type === "abilityCustom" && (
                                    <div>
                                      <label
                                        style={{
                                          display: "block",
                                          marginBottom: "8px",
                                          fontSize: "14px",
                                          fontWeight: "500",
                                          color: theme.text,
                                        }}
                                      >
                                        Choose any ability to increase by{" "}
                                        {choice.amount}:
                                      </label>
                                      <select
                                        value={
                                          levelUpData.featChoices[choice.id] ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          updateFeatChoice(
                                            choice.id,
                                            e.target.value
                                          )
                                        }
                                        style={{
                                          width: "100%",
                                          padding: "8px 12px",
                                          border: `1px solid ${theme.border}`,
                                          borderRadius: "6px",
                                          fontSize: "14px",
                                          backgroundColor: theme.surface,
                                          color: theme.text,
                                        }}
                                      >
                                        <option value="">
                                          Select an ability...
                                        </option>
                                        {[
                                          "strength",
                                          "dexterity",
                                          "constitution",
                                          "intelligence",
                                          "wisdom",
                                          "charisma",
                                        ].map((ability) => (
                                          <option key={ability} value={ability}>
                                            {ability}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  )}

                                  {choice.type === "skillChoice" && (
                                    <div>
                                      <label
                                        style={{
                                          display: "block",
                                          marginBottom: "8px",
                                          fontSize: "14px",
                                          fontWeight: "500",
                                          color: theme.text,
                                        }}
                                      >
                                        Choose {choice.count} skill
                                        {choice.count > 1 ? "s" : ""}:
                                      </label>
                                      <div
                                        style={{
                                          display: "grid",
                                          gridTemplateColumns:
                                            "repeat(auto-fit, minmax(200px, 1fr))",
                                          gap: "8px",
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
                                            const isSelected = (
                                              levelUpData.featChoices[
                                                choice.id
                                              ] || []
                                            ).includes(skill);
                                            const currentSelections =
                                              levelUpData.featChoices[
                                                choice.id
                                              ] || [];

                                            return (
                                              <label
                                                key={skill}
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: "8px",
                                                  padding: "8px",
                                                  border: `1px solid ${theme.border}`,
                                                  borderRadius: "4px",
                                                  backgroundColor: isSelected
                                                    ? `${theme.primary}15`
                                                    : theme.surface,
                                                  cursor:
                                                    !isSelected &&
                                                    currentSelections.length >=
                                                      choice.count
                                                      ? "not-allowed"
                                                      : "pointer",
                                                  opacity:
                                                    !isSelected &&
                                                    currentSelections.length >=
                                                      choice.count
                                                      ? 0.5
                                                      : 1,
                                                }}
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={isSelected}
                                                  disabled={
                                                    !isSelected &&
                                                    currentSelections.length >=
                                                      choice.count
                                                  }
                                                  onChange={(e) => {
                                                    const newSelections = e
                                                      .target.checked
                                                      ? [
                                                          ...currentSelections,
                                                          skill,
                                                        ]
                                                      : currentSelections.filter(
                                                          (s) => s !== skill
                                                        );
                                                    updateFeatChoice(
                                                      choice.id,
                                                      newSelections
                                                    );
                                                  }}
                                                />
                                                <span
                                                  style={{
                                                    fontSize: "14px",
                                                    color: theme.text,
                                                  }}
                                                >
                                                  {skill}
                                                </span>
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
                                          display: "block",
                                          marginBottom: "8px",
                                          fontSize: "14px",
                                          fontWeight: "500",
                                          color: theme.text,
                                        }}
                                      >
                                        Choose {choice.count} skill
                                        {choice.count > 1 ? "s" : ""} for
                                        expertise:
                                      </label>
                                      <div
                                        style={{
                                          display: "grid",
                                          gridTemplateColumns:
                                            "repeat(auto-fit, minmax(200px, 1fr))",
                                          gap: "8px",
                                        }}
                                      >
                                        {getCurrentSkillProficiencies().map(
                                          (skill) => {
                                            const isSelected = (
                                              levelUpData.featChoices[
                                                choice.id
                                              ] || []
                                            ).includes(skill);
                                            const currentSelections =
                                              levelUpData.featChoices[
                                                choice.id
                                              ] || [];

                                            return (
                                              <label
                                                key={skill}
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: "8px",
                                                  padding: "8px",
                                                  border: `1px solid ${theme.border}`,
                                                  borderRadius: "4px",
                                                  backgroundColor: isSelected
                                                    ? `${theme.primary}15`
                                                    : theme.surface,
                                                  cursor:
                                                    !isSelected &&
                                                    currentSelections.length >=
                                                      choice.count
                                                      ? "not-allowed"
                                                      : "pointer",
                                                  opacity:
                                                    !isSelected &&
                                                    currentSelections.length >=
                                                      choice.count
                                                      ? 0.5
                                                      : 1,
                                                }}
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={isSelected}
                                                  disabled={
                                                    !isSelected &&
                                                    currentSelections.length >=
                                                      choice.count
                                                  }
                                                  onChange={(e) => {
                                                    const newSelections = e
                                                      .target.checked
                                                      ? [
                                                          ...currentSelections,
                                                          skill,
                                                        ]
                                                      : currentSelections.filter(
                                                          (s) => s !== skill
                                                        );
                                                    updateFeatChoice(
                                                      choice.id,
                                                      newSelections
                                                    );
                                                  }}
                                                />
                                                <span
                                                  style={{
                                                    fontSize: "14px",
                                                    color: theme.text,
                                                  }}
                                                >
                                                  {skill}
                                                </span>
                                              </label>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: "16px",
                }}
              >
                Ready to Level Up!
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: theme.textSecondary,
                  margin: 0,
                }}
              >
                No additional choices needed for this level.
              </p>
            </div>
          );
        }

      case 3:
        return (
          <div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: theme.text,
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              Review Your Choices
            </h3>

            <div
              style={{
                display: "grid",
                gap: "20px",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  backgroundColor: `${theme.primary}15`,
                  border: `2px solid ${theme.primary}`,
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
                  <Heart size={20} color={theme.primary} />
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "600",
                      color: theme.text,
                    }}
                  >
                    Hit Points
                  </h3>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    color: theme.text,
                    fontWeight: "500",
                  }}
                >
                  Full HP for Level {newLevel} (
                  {levelUpData.hitPointMethod === "average"
                    ? "Average"
                    : levelUpData.hitPointMethod === "roll"
                    ? `Rolled (${levelUpData.rolledHP})`
                    : "Manual"}
                  )
                </p>
              </div>

              {levelUpData.asiChoice === "asi" &&
                levelUpData.abilityIncreases.length > 0 && (
                  <div
                    style={{
                      backgroundColor: `${theme.success}15`,
                      border: `2px solid ${theme.success}`,
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
                      <Zap size={20} color={theme.success} />
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          fontWeight: "600",
                          color: theme.text,
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
                            backgroundColor: theme.success,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "16px",
                            color: theme.text,
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
                      backgroundColor: `${theme.warning}15`,
                      border: `2px solid ${theme.warning}`,
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
                      <Star size={20} color={theme.warning} />
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          fontWeight: "600",
                          color: theme.text,
                        }}
                      >
                        Selected Feat
                      </h3>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        color: theme.text,
                        fontWeight: "500",
                      }}
                    >
                      {levelUpData.selectedFeats[0]}
                    </p>
                  </div>
                )}

              <div
                style={{
                  backgroundColor: theme.surface,
                  border: `2px solid ${theme.border}`,
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: theme.text,
                    }}
                  >
                    Level {currentLevel}
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: theme.textSecondary,
                    }}
                  >
                    →
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: theme.success,
                    }}
                  >
                    Level {newLevel}
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

  if (!isOpen) return null;

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
          backgroundColor: theme.surface,
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: "100%",
          maxWidth: "800px",
          maxHeight: "95vh",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
            color: theme.surface,
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
              Level Up {character.name}
            </h2>
          </div>

          {/* Progress Steps */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              justifyContent: "center",
            }}
          >
            {steps.map((step, index) => (
              <div
                key={step.number}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: `2px solid ${
                      step.completed || step.active
                        ? "rgba(255, 255, 255, 1)"
                        : "rgba(255, 255, 255, 0.5)"
                    }`,
                    backgroundColor: step.completed
                      ? "rgba(255, 255, 255, 1)"
                      : step.active
                      ? "rgba(255, 255, 255, 0.2)"
                      : "transparent",
                    color: step.completed
                      ? theme.primary
                      : step.active
                      ? "white"
                      : "rgba(255, 255, 255, 0.7)",
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
                    color: step.active
                      ? "rgba(255, 255, 255, 1)"
                      : "rgba(255, 255, 255, 0.7)",
                    marginTop: "4px",
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
            flex: 1,
            overflow: "auto",
          }}
        >
          {renderStepContent()}
        </div>

        <div
          style={{
            padding: "24px 32px",
            borderTop: `1px solid ${theme.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.background,
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
              backgroundColor:
                currentStep === 1 ? theme.textSecondary : theme.textSecondary,
              color: currentStep === 1 ? theme.textSecondary : theme.surface,
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
                color: theme.textSecondary,
                border: `2px solid ${theme.border}`,
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
                  backgroundColor: canProceed()
                    ? theme.primary
                    : theme.textSecondary,
                  color: theme.surface,
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
                  backgroundColor: isSaving
                    ? theme.textSecondary
                    : theme.success,
                  color: theme.surface,
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
