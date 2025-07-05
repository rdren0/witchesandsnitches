import { allSkills } from "../SharedData/data";
import { wandModifiers } from "../SharedData/downtime";

export const activityRequiresDualChecks = (activityText) => {
  if (!activityText) return false;

  const text = activityText.toLowerCase();

  return (
    text.includes("stealth and investigation rolls") ||
    text.includes("sleight of hand and investigation")
  );
};

export const getActivitySkillInfo = (activityText) => {
  if (!activityText) return { type: "free", skills: null };

  const text = activityText.toLowerCase();

  if (text.includes("stealth and investigation rolls")) {
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

  if (text.includes("roll investigation")) {
    return {
      type: "locked",
      skills: ["investigation"],
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

  if (text.includes("roll survival")) {
    return {
      type: "locked",
      skills: ["survival"],
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

  if (text.includes("gain a job") || text.includes("promotion")) {
    return {
      type: "suggested",
      skills: ["persuasion"],
      allowAll: true,
    };
  }

  if (text.includes("craft items")) {
    return {
      type: "free",
      skills: null,
    };
  }

  if (text.includes("brew a potion")) {
    return {
      type: "locked",
      skills: ["potionMaking"],
    };
  }

  if (text.includes("shopping") || text.includes("selling")) {
    return {
      type: "none",
      skills: null,
    };
  }

  if (text.includes("animagus form (rp)")) {
    return {
      type: "roleplay",
      skills: null,
    };
  }

  if (
    text.includes("three separate checks") ||
    text.includes("separate downtime slots")
  ) {
    return {
      type: "multi-session",
      skills: null,
    };
  }

  return {
    type: "free",
    skills: null,
  };
};

export const calculateModifier = (skillOrWandName, selectedCharacter) => {
  const skill = allSkills.find((s) => s.name === skillOrWandName);
  if (!skill) return 0;

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

export const activityRequiresNoDiceRoll = (activityText) => {
  if (!activityText) return false;

  const text = activityText.toLowerCase();
  return (
    text.includes("shopping") ||
    text.includes("selling") ||
    text.includes("animagus form (rp)")
  );
};

export const isRoleplayOnlyActivity = (activityText) => {
  if (!activityText) return false;

  const text = activityText.toLowerCase();
  return text.includes("animagus form (rp)");
};

export const isMultiSessionActivity = (activityText) => {
  if (!activityText) return false;

  const text = activityText.toLowerCase();
  return (
    text.includes("three separate checks") ||
    text.includes("separate downtime slots")
  );
};

export const shouldUseCustomDiceForActivity = (activityText) => {
  if (!activityText) return false;

  const text = activityText.toLowerCase();
  return text.includes("allowance");
};

export const getCustomDiceTypeForActivity = (activityText) => {
  if (!activityText) return null;

  const text = activityText.toLowerCase();
  if (text.includes("allowance")) {
    return {
      diceType: "2d12",
      discardD20: true,
      description: "Discard one d20 and roll 2d12 instead",
    };
  }

  return null;
};

export const activityRequiresSpecialRules = (activityText) => {
  return (
    isMultiSessionActivity(activityText) ||
    shouldUseCustomDiceForActivity(activityText) ||
    isRoleplayOnlyActivity(activityText)
  );
};

export const getMultiSessionInfo = (activityText) => {
  if (!isMultiSessionActivity(activityText)) return null;

  return {
    requiredSessions: 3,
    description:
      "This activity requires success on 3 separate downtime sessions to complete.",
  };
};
