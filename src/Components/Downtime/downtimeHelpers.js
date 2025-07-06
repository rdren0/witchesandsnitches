import { allSkills } from "../SharedData/data";
import { wandModifiers } from "../SharedData/downtime";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const roller = new DiceRoller();

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

export const getActivitySkillInfo = (activityText) => {
  if (!activityText) return { type: "free", skills: null };

  const text = activityText.toLowerCase();

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
      type: "locked",
      skills: ["survival"],
    };
  }

  if (
    text.includes("research spells") &&
    text.includes("roll history of magic")
  ) {
    return {
      type: "locked",
      skills: ["historyOfMagic"],
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
      diceType: "2d12",
      description: "Roll 2d12 instead of d20 for allowance determination",
      rollFunction: () => {
        try {
          const roller = new DiceRoller();
          const result = roller.roll("2d12");

          const individualDice = result.rolls[0].rolls.map((die) => die.value);
          return individualDice;
        } catch (error) {
          console.error("Error rolling allowance dice:", error);
          return [
            Math.floor(Math.random() * 12) + 1,
            Math.floor(Math.random() * 12) + 1,
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
          let sides;

          switch (jobType.toLowerCase()) {
            case "easy":
              diceNotation = "2D8";
              sides = 8;
              break;
            case "hard":
              diceNotation = "2D12";
              sides = 12;
              break;
            case "medium":
            default:
              diceNotation = "2D10";
              sides = 10;
              break;
          }

          const roller = new DiceRoller();
          const result = roller.roll(diceNotation);

          const individualDice = result.rolls[0].rolls.map((die) => die.value);
          return individualDice;
        } catch (error) {
          console.error("Error rolling job earnings dice:", error);
          // Fallback to manual roll if DiceRoller fails
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

export const activityRequiresSpecialRules = (activityText) => {
  return (
    activityRequiresNoDiceRoll(activityText) ||
    isMultiSessionActivity(activityText) ||
    shouldUseCustomDiceForActivity(activityText)
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
