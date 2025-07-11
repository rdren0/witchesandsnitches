import { allSkills } from "../../SharedData/data";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { wandModifiers } from "../../SharedData/downtime";

export const activityRequiresDualChecks = (activityText) => {
  if (!activityText) return false;

  const text = activityText.toLowerCase();

  return (
    text.includes("stealth and investigation") ||
    text.includes("sleight of hand and investigation") ||
    text.includes("explore the forbidden forest") ||
    text.includes("restricted section") ||
    text.includes("stealing")
  );
};

export const activityRequiresSpellSelection = (activityText) => {
  if (!activityText) return false;

  const text = activityText.toLowerCase();

  return text.includes("research spells") || text.includes("attempt spells");
};

export const activityRequiresWandSelection = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("increase wand stat");
};

export const activityRequiresClassSelection = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("studying");
};

export const getActivitySkillInfo = (activityText) => {
  if (!activityText) return { type: "free", skills: null };

  const text = activityText.toLowerCase();

  if (text.includes("research spells") || text.includes("attempt spells")) {
    return {
      type: "spell",
      requiresSpell: true,
    };
  }

  if (text.includes("increase wand stat")) {
    return {
      type: "wand_increase",
      requiresWandSelection: true,
      requiresNoDiceRoll: false,
      skills: [],
    };
  }

  if (text.includes("studying")) {
    return {
      type: "class_selection",
      requiresClassSelection: true,
      skills: [],
    };
  }

  if (text.includes("dig for dirt")) {
    return {
      type: "limited",
      skills: ["investigation", "insight", "intimidation", "persuasion"],
    };
  }

  if (text.includes("spread rumors")) {
    return {
      type: "limited",
      skills: ["deception", "intimidation", "performance", "persuasion"],
    };
  }

  if (text.includes("invent a potion")) {
    return {
      type: "limited",
      skills: ["potionMaking", "herbology", "survival"],
    };
  }

  if (text.includes("brew a potion")) {
    return {
      type: "locked",
      skills: ["potionMaking"],
    };
  }

  if (text.includes("research a topic")) {
    return {
      type: "locked",
      skills: ["investigation"],
    };
  }

  if (text.includes("learn a recipe")) {
    return {
      type: "locked",
      skills: ["survival"],
    };
  }

  if (text.includes("gain a job") || text.includes("promotion")) {
    return {
      type: "suggested",
      skills: ["persuasion"],
      allowAll: true,
      note: "Use Magical Creatures at Magical Menagerie",
    };
  }

  if (text.includes("stealth and investigation")) {
    return {
      type: "locked",
      skills: ["stealth", "investigation"],
    };
  }

  if (text.includes("sleight of hand and investigation")) {
    return {
      type: "locked",
      skills: ["sleightOfHand", "investigation"],
    };
  }

  if (
    text.includes("explore the castle") &&
    text.includes("roll investigation")
  ) {
    return {
      type: "locked",
      skills: ["investigation"],
    };
  }

  if (text.includes("cooking")) {
    return {
      type: "limited",
      skills: ["survival", "muggleStudies"],
    };
  }

  if (
    text.includes("search for magical creatures") &&
    text.includes("roll magical creatures")
  ) {
    return {
      type: "locked",
      skills: ["magicalCreatures"],
    };
  }

  if (text.includes("search for plants") && text.includes("roll herbology")) {
    return {
      type: "locked",
      skills: ["herbology"],
    };
  }

  if (text.includes("roll persuasion") && !text.includes("or")) {
    return {
      type: "locked",
      skills: ["persuasion"],
    };
  }

  if (
    text.includes("roll investigation") &&
    !text.includes("or") &&
    !text.includes(",")
  ) {
    return {
      type: "locked",
      skills: ["investigation"],
    };
  }

  if (text.includes("roll magical creatures") && !text.includes("or")) {
    return {
      type: "locked",
      skills: ["magicalCreatures"],
    };
  }

  if (text.includes("roll herbology") && !text.includes("or")) {
    return {
      type: "locked",
      skills: ["herbology"],
    };
  }

  if (text.includes("roll history of magic") && !text.includes("or")) {
    return {
      type: "locked",
      skills: ["historyOfMagic"],
    };
  }

  return {
    type: "free",
    skills: null,
  };
};

export const getAvailableWandModifiersForIncrease = (selectedCharacter) => {
  if (!selectedCharacter?.magicModifiers) return [];

  const wandModifiers = [
    { name: "charms", displayName: "Charms" },
    { name: "transfiguration", displayName: "Transfiguration" },
    { name: "jinxesHexesCurses", displayName: "Jinxes, Hexes & Curses" },
    { name: "healing", displayName: "Healing" },
    { name: "divinations", displayName: "Divinations" },
  ];

  return wandModifiers.filter((wand) => {
    const currentValue = selectedCharacter.magicModifiers[wand.name] || 0;
    return currentValue < 5;
  });
};

export const calculateWandStatIncreaseDC = (
  selectedCharacter,
  wandModifierName
) => {
  if (!selectedCharacter?.magicModifiers || !wandModifierName) return 11;

  const currentModifier =
    selectedCharacter.magicModifiers[wandModifierName] || 0;
  return 11 + currentModifier;
};

export const validateWandStatIncreaseActivity = (
  activity,
  selectedCharacter
) => {
  if (!activityRequiresWandSelection(activity.activity)) return { valid: true };

  if (!activity.selectedWandModifier) {
    return {
      valid: false,
      message: "Please select a wand modifier to increase.",
    };
  }

  const currentValue =
    selectedCharacter?.magicModifiers?.[activity.selectedWandModifier] || 0;
  if (currentValue >= 5) {
    return {
      valid: false,
      message: "This wand modifier is already at maximum (+5).",
    };
  }

  return { valid: true };
};

export const validateStudyActivity = (activity) => {
  if (!activityRequiresClassSelection(activity.activity))
    return { valid: true };

  if (!activity.selectedClass) {
    return {
      valid: false,
      message: "Please select a class for the Study activity.",
    };
  }

  return { valid: true };
};

export const calculateModifier = (skillOrWandName, selectedCharacter) => {
  if (!skillOrWandName || !selectedCharacter) return 0;

  const wandModifier = wandModifiers.find((w) => w.name === skillOrWandName);
  if (wandModifier) {
    return selectedCharacter.magicModifiers?.[skillOrWandName] || 0;
  }

  const skill = allSkills.find((s) => s.name === skillOrWandName);
  if (!skill) {
    console.warn(`Skill "${skillOrWandName}" not found in allSkills array`);
    return 0;
  }

  let abilityMod = 0;
  if (selectedCharacter[skill.ability] !== undefined) {
    abilityMod = Math.floor((selectedCharacter[skill.ability] - 10) / 2);
  } else if (selectedCharacter.abilityScores?.[skill.ability] !== undefined) {
    abilityMod = Math.floor(
      (selectedCharacter.abilityScores[skill.ability] - 10) / 2
    );
  }

  let skillLevel = 0;
  if (
    selectedCharacter.skills &&
    selectedCharacter.skills[skillOrWandName] !== undefined
  ) {
    skillLevel = selectedCharacter.skills[skillOrWandName];
  } else {
    const skillProficiencies =
      selectedCharacter.skillProficiencies ||
      selectedCharacter.skill_proficiencies ||
      [];
    const skillExpertise =
      selectedCharacter.skillExpertise ||
      selectedCharacter.skill_expertise ||
      [];

    if (skillExpertise.includes(skill.displayName)) {
      skillLevel = 2;
    } else if (skillProficiencies.includes(skill.displayName)) {
      skillLevel = 1;
    }
  }

  const profBonus =
    selectedCharacter.proficiencyBonus ||
    (selectedCharacter.level ? Math.ceil(selectedCharacter.level / 4) + 1 : 2);

  if (skillLevel === 0) return abilityMod;
  if (skillLevel === 1) return abilityMod + profBonus;
  if (skillLevel === 2) return abilityMod + 2 * profBonus;

  return abilityMod;
};

export const validateSkillName = (skillName) => {
  if (!skillName) return false;
  return allSkills.some((skill) => skill.name === skillName);
};

export const activityRequiresNoDiceRoll = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("shopping") || text.includes("selling");
};

export const isMultiSessionActivity = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return (
    text.includes("increase an ability score") ||
    text.includes("gain proficiency or expertise") ||
    text.includes("create a spell") ||
    text.includes("three separate checks")
  );
};

export const shouldUseCustomDiceForActivity = (activityText) => {
  if (!activityText) return false;
  const text = activityText.toLowerCase();
  return text.includes("allowance") || text.includes("work job");
};

export const getCustomDiceTypeForActivity = (activityText) => {
  if (!activityText) return null;
  const text = activityText.toLowerCase();

  if (text.includes("allowance")) {
    return {
      diceType: "Family Allowance",
      description:
        "Roll based on family economic status. Admin will determine family type and any bonuses.",
      rollFunction: (familyType = "middle") => {
        try {
          let diceNotation;

          switch (familyType.toLowerCase()) {
            case "poor":
              diceNotation = "2d4";
              break;
            case "rich":
              diceNotation = "2d8";
              break;
            case "middle":
            default:
              diceNotation = "2d6";
              break;
          }

          const roller = new DiceRoller();
          const result = roller.roll(diceNotation);

          const individualDice = result.rolls[0].rolls.map((die) => die.value);
          return individualDice;
        } catch (error) {
          console.error("Error rolling family allowance dice:", error);

          let sides;
          switch (familyType.toLowerCase()) {
            case "poor":
              sides = 4;
              break;
            case "rich":
              sides = 8;
              break;
            default:
              sides = 6;
              break;
          }
          return [
            Math.floor(Math.random() * sides) + 1,
            Math.floor(Math.random() * sides) + 1,
          ];
        }
      },
    };
  }

  if (text.includes("work job")) {
    return {
      diceType: "Job Earnings",
      description:
        "Based on job difficulty level. Admin will determine job level and promotions.",
      rollFunction: (jobType = "medium") => {
        try {
          let diceNotation;

          switch (jobType.toLowerCase()) {
            case "easy":
              diceNotation = "2D8";
              break;
            case "hard":
              diceNotation = "2D12";
              break;
            case "medium":
            default:
              diceNotation = "2D10";
              break;
          }

          const roller = new DiceRoller();
          const result = roller.roll(diceNotation);

          const individualDice = result.rolls[0].rolls.map((die) => die.value);
          return individualDice;
        } catch (error) {
          console.error("Error rolling job earnings dice:", error);

          let sides;
          switch (jobType.toLowerCase()) {
            case "easy":
              sides = 8;
              break;
            case "hard":
              sides = 12;
              break;
            default:
              sides = 10;
              break;
          }
          return [
            Math.floor(Math.random() * sides) + 1,
            Math.floor(Math.random() * sides) + 1,
          ];
        }
      },
    };
  }

  return null;
};

export const activityRequiresExtraDie = (activityText) => {
  if (!activityText) return false;

  const text = activityText.toLowerCase();

  return text.includes("research spells") || text.includes("attempt spells");
};

export const activityRequiresSpecialRules = (activityText) => {
  return (
    activityRequiresNoDiceRoll(activityText) ||
    isMultiSessionActivity(activityText) ||
    shouldUseCustomDiceForActivity(activityText) ||
    activityRequiresExtraDie(activityText) ||
    activityRequiresWandSelection(activityText) ||
    activityRequiresClassSelection(activityText)
  );
};

export const getMultiSessionInfo = (activityText) => {
  if (!activityText) return null;
  const text = activityText.toLowerCase();

  const isMultiSessionPattern =
    /(increase an ability score|gain proficiency|gain expertise|create a spell|engineer plants|invent a potion|create a new recipe)/;

  if (isMultiSessionPattern.test(text)) {
    return {
      description:
        "Requires three separate successful checks across different downtime sessions",
    };
  }

  return null;
};

export const getSpecialActivityInfo = (activityText) => {
  if (!activityText) return null;
  const text = activityText.toLowerCase();

  // if (text.includes("increase wand stat")) {
  //   return {
  //     type: "wand_increase",
  //     description:
  //       "Select a wand modifier to increase. Roll d20 + current modifier value vs DC (11 + current modifier). Success increases the modifier by +1 (maximum +5).",
  //   };
  // }

  if (text.includes("studying")) {
    return {
      type: "class_study",
      description:
        "Select a class to focus your studies on. This improves your performance in that specific class through dedicated study time.",
    };
  }

  if (text.includes("research spells")) {
    return {
      type: "spell_research",
      description:
        "Research spells to learn their theory and prepare for casting attempts. Successful research allows future spell attempts.",
    };
  }

  if (text.includes("attempt spells")) {
    return {
      type: "spell_attempt",
      description:
        "Practice casting spells you have previously researched or attempted. Two successful attempts master the spell permanently.",
    };
  }

  if (text.includes("gain a job")) {
    return {
      type: "job_application",
      description:
        "Job difficulty determines DC: Easy (DC 10), Medium (DC 15), Hard (DC 20). Use Magical Creatures check at Magical Menagerie.",
    };
  }

  if (text.includes("promotion")) {
    return {
      type: "promotion",
      description:
        "Job difficulty + current promotions determines DC: Easy (DC 10 + promotions), Medium (DC 15 + promotions), Hard (DC 20 + promotions). Use Magical Creatures check at Magical Menagerie.",
    };
  }

  if (text.includes("work job")) {
    return {
      type: "work_earnings",
      description:
        "Earnings based on job level: Easy (2D8 + 1D8 per promotion), Medium (2d10 + 1d10 per promotion), Hard (2d12 + 1d12 per promotion). All amounts ×2 Galleons.",
    };
  }

  if (text.includes("shopping")) {
    return {
      type: "shopping",
      description:
        "Purchase items from shopping list at half buy price. No haggling allowed. Can be done without using a downtime slot.",
    };
  }

  if (text.includes("selling")) {
    return {
      type: "selling",
      description:
        "Sell items at half their original price. No haggling allowed. Can be done without using a downtime slot.",
    };
  }

  return null;
};
