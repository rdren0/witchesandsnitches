// ResultsCalculator.js
import { useTheme } from "../../contexts/ThemeContext";
import { getDowntimeStyles } from "../../styles/masterStyles";
import { allSkills } from "../SharedData/data";

const ResultsCalculator = ({
  rollAssignments,
  dicePool,
  selectedCharacter,
  formData,
}) => {
  const { theme } = useTheme();
  const styles = getDowntimeStyles(theme);

  const getAbilityModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  // Fixed skill modifier calculation with proper proficiency bonus
  const getSkillModifier = (skillName) => {
    if (!skillName || !selectedCharacter) return 0;
    const skill = allSkills.find((s) => s.name === skillName);
    if (!skill) return 0;

    const abilityMod = getAbilityModifier(
      selectedCharacter[skill.ability] || 10
    );

    // Get skill level: 0 = no proficiency, 1 = proficient, 2 = expertise
    const skillLevel = selectedCharacter.skills?.[skillName] || 0;
    const profBonus = selectedCharacter.proficiencyBonus || 0;

    // Calculate total modifier
    if (skillLevel === 0) return abilityMod; // Just ability modifier
    if (skillLevel === 1) return abilityMod + profBonus; // Proficient
    if (skillLevel === 2) return abilityMod + 2 * profBonus; // Expertise (double proficiency)

    return abilityMod;
  };

  const getWandModifier = (wandModifierName) => {
    if (!selectedCharacter?.magicModifiers || !wandModifierName) return 0;
    return selectedCharacter.magicModifiers[wandModifierName] || 0;
  };

  const getModifierValue = (modifierName) => {
    if (!modifierName) return 0;
    if (modifierName.startsWith("wand_")) {
      return getWandModifier(modifierName.replace("wand_", ""));
    }
    return getSkillModifier(modifierName);
  };

  const getAssignmentTotal = (assignment, isSecondRoll = false) => {
    const assignmentData = rollAssignments[assignment];
    if (!assignmentData) return null;

    const diceIndex = isSecondRoll
      ? assignmentData.secondDiceIndex
      : assignmentData.diceIndex;
    const skill = isSecondRoll
      ? assignmentData.secondSkill
      : assignmentData.skill;
    const wandModifier = isSecondRoll
      ? assignmentData.secondWandModifier
      : assignmentData.wandModifier;

    if (diceIndex === null || diceIndex === undefined) return null;

    const diceValue = dicePool[diceIndex];
    if (diceValue === undefined) return null;

    const skillMod = getSkillModifier(skill);
    const wandMod = getWandModifier(wandModifier);

    return {
      dice: diceValue,
      skillMod,
      wandMod,
      total: diceValue + skillMod + wandMod,
      skill,
      wandModifier,
    };
  };

  const renderAssignmentResult = (assignment, label, isSecondRoll = false) => {
    const result = getAssignmentTotal(assignment, isSecondRoll);
    if (!result) return null;

    const { dice, skillMod, wandMod, total, skill, wandModifier } = result;

    return (
      <div
        key={`${assignment}-${isSecondRoll ? "second" : "first"}`}
        style={styles.resultRow}
      >
        <div style={styles.resultLabel}>{label}:</div>
        <div style={styles.resultCalculation}>
          <span style={styles.diceValue}>d20({dice})</span>
          {skill && (
            <span style={styles.modifierValue}>
              {" + "}
              {skill}({skillMod >= 0 ? "+" : ""}
              {skillMod})
            </span>
          )}
          {wandModifier && wandMod !== 0 && (
            <span style={styles.modifierValue}>
              {" + "}
              {wandModifier}({wandMod >= 0 ? "+" : ""}
              {wandMod})
            </span>
          )}
          <span style={styles.totalValue}> = {total}</span>
        </div>
      </div>
    );
  };

  const requiresDualChecks = (activityText) => {
    const text = activityText.toLowerCase();
    return (
      text.includes("stealth and investigation") ||
      text.includes("sleight of hand and investigation") ||
      (text.includes(" and ") &&
        (text.includes("roll") || text.includes("requires")))
    );
  };

  return (
    <div style={styles.resultsContainer}>
      <div style={styles.sectionHeader}>
        <h3>Roll Results Calculator</h3>
        <p style={styles.subtitle}>
          Preview of your total roll values with all modifiers
        </p>
      </div>

      <div style={styles.resultsGrid}>
        {formData.activities.map((activity, index) => {
          if (!activity.activity) return null;

          const activityKey = `activity${index + 1}`;
          const isDualCheck = requiresDualChecks(activity.activity);
          const firstResult = getAssignmentTotal(activityKey);
          const secondResult = isDualCheck
            ? getAssignmentTotal(activityKey, true)
            : null;

          if (!firstResult && !secondResult) return null;

          return (
            <div key={activityKey} style={styles.activityResultCard}>
              <h4 style={styles.activityTitle}>
                Activity {index + 1}
                {activity.activity.length > 50
                  ? `: ${activity.activity.substring(0, 50)}...`
                  : `: ${activity.activity}`}
              </h4>

              <div style={styles.resultsSection}>
                {renderAssignmentResult(
                  activityKey,
                  isDualCheck ? "First Roll" : "Roll"
                )}
                {isDualCheck &&
                  renderAssignmentResult(activityKey, "Second Roll", true)}
              </div>

              <div style={styles.successDisplay}>
                <span style={styles.successLabel}>
                  Successes: {activity.successes.filter((s) => s).length}/5
                </span>
                <div style={styles.successDots}>
                  {activity.successes.map((success, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.successDot,
                        backgroundColor: success ? "#10b981" : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {["relationship1", "relationship2", "relationship3"].map(
          (relationshipKey, index) => {
            const result = getAssignmentTotal(relationshipKey);
            if (!result) return null;

            return (
              <div key={relationshipKey} style={styles.activityResultCard}>
                <h4 style={styles.activityTitle}>Relationship {index + 1}</h4>
                <div style={styles.resultsSection}>
                  {renderAssignmentResult(relationshipKey, "Roll")}
                </div>
              </div>
            );
          }
        )}

        {Object.values(rollAssignments).some(
          (assignment) =>
            assignment.diceIndex !== null || assignment.secondDiceIndex !== null
        ) && (
          <div style={styles.summaryCard}>
            <h4 style={styles.summaryTitle}>Roll Summary</h4>
            <div style={styles.summaryStats}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Dice Used:</span>
                <span style={styles.statValue}>
                  {
                    Object.values(rollAssignments).filter(
                      (assignment) =>
                        assignment.diceIndex !== null ||
                        assignment.secondDiceIndex !== null
                    ).length
                  }
                  /{dicePool.length}
                </span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Activities with Rolls:</span>
                <span style={styles.statValue}>
                  {
                    formData.activities.filter(
                      (activity, index) =>
                        activity.activity &&
                        rollAssignments[`activity${index + 1}`]?.diceIndex !==
                          null
                    ).length
                  }
                  /3
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsCalculator;
