import { allSkills } from "../SharedData/data";
import { wandModifiers } from "../SharedData/downtime";

export const activityRequiresDualChecks = (activityText) => {
  if (!activityText) return false;

  const text = activityText.toLowerCase();
  return (
    text.includes("stealth and investigation") ||
    text.includes("sleight of hand and investigation") ||
    (text.includes(" and ") &&
      (text.includes("roll") || text.includes("requires")))
  );
};

export const getActivitySkillInfo = (activityText) => {
  if (!activityText) return { type: "free", skills: null };

  const text = activityText.toLowerCase();

  // Dual check activities
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

  // Single skill activities
  if (text.includes("roll investigation")) {
    return {
      type: "locked",
      skills: ["investigation"],
    };
  }

  if (text.includes("roll persuasion")) {
    return {
      type: "locked",
      skills: ["persuasion"],
    };
  }

  if (text.includes("roll magical creatures")) {
    return {
      type: "locked",
      skills: ["careOfMagicalCreatures"],
    };
  }

  if (text.includes("roll herbology")) {
    return {
      type: "locked",
      skills: ["herbology"],
    };
  }

  if (text.includes("roll history of magic")) {
    return {
      type: "locked",
      skills: ["historyOfMagic"],
    };
  }

  // Limited choice activities
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

  // Suggested skill activities
  if (text.includes("gain a job") || text.includes("promotion")) {
    return {
      type: "suggested",
      skills: ["persuasion"],
      allowAll: true,
    };
  }

  // Default to free choice
  return {
    type: "free",
    skills: null,
  };
};

export const calculateModifier = (skillOrWandName, selectedCharacter) => {
  if (!skillOrWandName || !selectedCharacter) return 0;

  // Check if it's a wand modifier
  const wandModifier = wandModifiers.find((w) => w.name === skillOrWandName);
  if (wandModifier) {
    return selectedCharacter.magicModifiers?.[skillOrWandName] || 0;
  }

  // It's a skill
  const skill = allSkills.find((s) => s.name === skillOrWandName);
  if (!skill) return 0;

  // Get ability modifier
  let abilityMod = 0;
  if (selectedCharacter[skill.ability] !== undefined) {
    abilityMod = Math.floor((selectedCharacter[skill.ability] - 10) / 2);
  } else if (selectedCharacter.abilityScores?.[skill.ability] !== undefined) {
    abilityMod = Math.floor(
      (selectedCharacter.abilityScores[skill.ability] - 10) / 2
    );
  }

  // Get skill proficiency
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

  // Calculate proficiency bonus
  const profBonus =
    selectedCharacter.proficiencyBonus ||
    (selectedCharacter.level ? Math.ceil(selectedCharacter.level / 4) + 1 : 2);

  // Calculate final modifier
  if (skillLevel === 0) return abilityMod;
  if (skillLevel === 1) return abilityMod + profBonus;
  if (skillLevel === 2) return abilityMod + 2 * profBonus;

  return abilityMod;
};
