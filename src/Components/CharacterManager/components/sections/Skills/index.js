export { default as SkillsSection } from "./SkillsSection";
export { default as SkillsSectionEdit } from "./SkillsSectionEdit";

export {
  hasSkillProficiency,
  hasSkillExpertise,
  getAvailableSkillsForCastingStyle,
  parseSubclassSkills,
  organizeSkillsBySource,
  getSkillSource,
  canSelectSkillForExpertise,
  isSkillAutomatic,
  calculateSkillModifier,
  getAllCharacterSkills,
  processSkillToggle,
  validateSkillSelection,
  getSkillsForDisplay,
  getStudyBuddySummary,
  SKILL_ABILITY_MAP,
  SKILL_SOURCES,
  SUBCLASS_SKILL_NAMES,
} from "./skillsUtils";

export const setupSkillsForCharacter = (character) => {
  return {
    availableSkills: getAvailableSkillsForCastingStyle(character.castingStyle),
    skillsData: organizeSkillsBySource(character),
    allSkills: getAllCharacterSkills(character),
    studyBuddyInfo: getStudyBuddySummary(character),
  };
};

export const validateCharacterSkills = (character) => {
  const { selectedCastingStyleSkills } = organizeSkillsBySource(character);
  const errors = [];
  const warnings = [];

  if (character.castingStyle) {
    if (selectedCastingStyleSkills.length < 2) {
      errors.push(
        `Need ${
          2 - selectedCastingStyleSkills.length
        } more casting style skills`
      );
    } else if (selectedCastingStyleSkills.length > 2) {
      errors.push("Too many casting style skills selected");
    }
  }

  const studyBuddySummary = getStudyBuddySummary(character);
  if (studyBuddySummary?.hasStudyBuddy) {
    studyBuddySummary.studyBuddySkills.forEach((skill) => {
      if (
        !hasSkillProficiency(character, skill) &&
        !hasSkillExpertise(character, skill)
      ) {
        warnings.push(`Study Buddy skill ${skill} is not properly applied`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export const getSkillCounts = (character) => {
  const allSkills = getAllCharacterSkills(character);
  const {
    selectedCastingStyleSkills,
    backgroundSkills,
    innateHeritageSkills,
    subclassSkills,
  } = organizeSkillsBySource(character);

  return {
    total: allSkills.length,
    castingStyle: selectedCastingStyleSkills.length,
    background: backgroundSkills.length,
    heritage: innateHeritageSkills.length,
    subclass: subclassSkills.length,
    expertise: allSkills.filter((skill) => hasSkillExpertise(character, skill))
      .length,
  };
};
