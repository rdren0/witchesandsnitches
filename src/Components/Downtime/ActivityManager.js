import { useAdmin } from "../../contexts/AdminContext";
import { useTheme } from "../../contexts/ThemeContext";
import { getDowntimeStyles } from "../../styles/masterStyles";
import { allSkills } from "../SharedData/data";

import React, { useMemo, useCallback } from "react";
import DiceSelection from "./DiceSelection";
import { wandModifiers, activityPatterns } from "../SharedData/downtime";

const ActivityManager = ({
  formData,
  setFormData,
  availableActivities,
  rollAssignments,
  setRollAssignments,
  dicePool,
  selectedCharacter,
  canEdit,
  assignDice,
  unassignDice,
  getDiceUsage,
  getSortedDiceOptions,
}) => {
  const { adminMode } = useAdmin();
  const { theme } = useTheme();
  const styles = useMemo(() => getDowntimeStyles(theme), [theme]);

  const defaultNPCEncounters = useMemo(
    () => [
      { name: "", successes: [false, false, false, false, false] },
      { name: "", successes: [false, false, false, false, false] },
      { name: "", successes: [false, false, false, false, false] },
    ],
    []
  );

  const getSkillChoiceInfo = useMemo(() => {
    return (activityText) => {
      if (!activityText) return { type: "free", skills: null };

      const text = activityText.trim();

      const suggestedMatch = text.match(activityPatterns.suggestedSkill);
      if (suggestedMatch) {
        const suggestedSkillText = suggestedMatch[2].toLowerCase().trim();

        const skillTextMap = {
          persuasion: "persuasion",
          investigation: "investigation",
          "magical creatures": "careOfMagicalCreatures",
          "care of magical creatures": "careOfMagicalCreatures",
          herbology: "herbology",
          "history of magic": "historyOfMagic",
          "sleight of hand": "sleightOfHand",
          stealth: "stealth",
          deception: "deception",
          intimidation: "intimidation",
          performance: "performance",
          insight: "insight",
        };

        const mappedSkill = skillTextMap[suggestedSkillText];
        if (mappedSkill) {
          return {
            type: "suggested",
            skills: [mappedSkill],
            allowAll: true,
          };
        }
      }

      if (activityPatterns.digForDirt.test(text)) {
        return {
          type: "limited",
          skills: ["investigation", "insight", "intimidation", "persuasion"],
        };
      }

      if (activityPatterns.spreadRumors.test(text)) {
        return {
          type: "limited",
          skills: ["deception", "intimidation", "performance", "persuasion"],
        };
      }

      if (
        activityPatterns.gainJob.test(text) ||
        activityPatterns.promotion.test(text)
      ) {
        return {
          type: "suggested",
          skills: ["persuasion"],
          allowAll: true,
        };
      }

      if (activityPatterns.stealthAndInvestigation.test(text)) {
        return {
          type: "locked",
          skills: ["stealth", "investigation"],
        };
      }

      if (activityPatterns.sleightAndInvestigation.test(text)) {
        return {
          type: "locked",
          skills: ["sleightOfHand", "investigation"],
        };
      }

      if (
        activityPatterns.explorecastle.test(text) ||
        activityPatterns.rollInvestigation.test(text)
      ) {
        return {
          type: "locked",
          skills: ["investigation"],
        };
      }

      if (activityPatterns.rollPersuasion.test(text)) {
        return {
          type: "locked",
          skills: ["persuasion"],
        };
      }

      if (activityPatterns.rollMagicalCreatures.test(text)) {
        return {
          type: "locked",
          skills: ["careOfMagicalCreatures"],
        };
      }

      if (activityPatterns.rollHerbology.test(text)) {
        return {
          type: "locked",
          skills: ["herbology"],
        };
      }

      if (activityPatterns.rollHistoryOfMagic.test(text)) {
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
  }, [activityPatterns]);

  const updateActivity = useCallback(
    (index, field, value) => {
      setFormData((prev) => ({
        ...prev,
        activities: prev.activities.map((activity, i) =>
          i === index ? { ...activity, [field]: value } : activity
        ),
      }));
    },
    [setFormData]
  );

  const updateActivitySuccess = useCallback(
    (index, successIndex) => {
      if (!adminMode) return;

      setFormData((prev) => ({
        ...prev,
        activities: prev.activities.map((activity, i) =>
          i === index
            ? {
                ...activity,
                successes: activity.successes.map((success, si) =>
                  si === successIndex ? !success : success
                ),
              }
            : activity
        ),
      }));
    },
    [adminMode, setFormData]
  );

  const updateNPCEncounter = useCallback(
    (index, field, value) => {
      if (!canEdit()) return;
      setFormData((prev) => {
        const npcEncounters = prev.npcEncounters || defaultNPCEncounters;

        const updatedNpcEncounters = npcEncounters.map((npc, i) =>
          i === index ? { ...npc, [field]: value } : npc
        );

        return {
          ...prev,
          npcEncounters: updatedNpcEncounters,
        };
      });
    },
    [canEdit, setFormData, defaultNPCEncounters]
  );

  const updateNPCSuccess = useCallback(
    (index, successIndex) => {
      if (!adminMode) return;

      setFormData((prev) => {
        const npcEncounters = prev.npcEncounters || defaultNPCEncounters;

        const updatedNpcEncounters = npcEncounters.map((npc, i) =>
          i === index
            ? {
                ...npc,
                successes: npc.successes.map((success, si) =>
                  si === successIndex ? !success : success
                ),
              }
            : npc
        );

        return {
          ...prev,
          npcEncounters: updatedNpcEncounters,
        };
      });
    },
    [adminMode, setFormData, defaultNPCEncounters]
  );

  const updateRollAssignment = useCallback(
    (assignment, field, value) => {
      if (!canEdit()) return;

      setRollAssignments((prev) => {
        // CRITICAL: Check if value actually changed
        if (prev[assignment]?.[field] === value) {
          return prev; // No change = no re-render
        }

        return {
          ...prev,
          [assignment]: {
            ...prev[assignment],
            [field]: value,
          },
        };
      });
    },
    [canEdit, setRollAssignments]
  );

  const requiresDualChecks = (activityText) => {
    const choiceInfo = getSkillChoiceInfo(activityText);
    return (
      choiceInfo.type === "locked" &&
      choiceInfo.skills &&
      choiceInfo.skills.length > 1
    );
  };

  const calculateSkillBonus = (skillName, abilityMod) => {
    if (!selectedCharacter) return 0;

    let skillLevel = 0;

    if (
      selectedCharacter.skills &&
      selectedCharacter.skills[skillName] !== undefined
    ) {
      skillLevel = selectedCharacter.skills[skillName];
    } else {
      const skillProficiencies =
        selectedCharacter.skillProficiencies ||
        selectedCharacter.skill_proficiencies ||
        [];
      const skillExpertise =
        selectedCharacter.skillExpertise ||
        selectedCharacter.skill_expertise ||
        [];

      const skill = allSkills.find((s) => s.name === skillName);
      const displayName = skill?.displayName;

      if (displayName) {
        if (skillExpertise.includes(displayName)) {
          skillLevel = 2;
        } else if (skillProficiencies.includes(displayName)) {
          skillLevel = 1;
        } else {
          skillLevel = 0;
        }
      }
    }

    const profBonus =
      selectedCharacter.proficiencyBonus ||
      (selectedCharacter.level
        ? Math.ceil(selectedCharacter.level / 4) + 1
        : 2);

    if (skillLevel === 0) return abilityMod;
    if (skillLevel === 1) return abilityMod + profBonus;
    if (skillLevel === 2) return abilityMod + 2 * profBonus;

    return abilityMod;
  };

  const getSkillModifier = (skillName) => {
    if (!skillName || !selectedCharacter) {
      return 0;
    }

    const skill = allSkills.find((s) => s.name === skillName);
    if (!skill) {
      return 0;
    }

    let abilityMod = 0;

    if (selectedCharacter[skill.ability] !== undefined) {
      abilityMod = Math.floor((selectedCharacter[skill.ability] - 10) / 2);
    } else if (selectedCharacter.abilityScores?.[skill.ability] !== undefined) {
      abilityMod = Math.floor(
        (selectedCharacter.abilityScores[skill.ability] - 10) / 2
      );
    } else {
      abilityMod = 0;
    }

    const finalModifier = calculateSkillBonus(skillName, abilityMod);
    return finalModifier;
  };

  const formatModifier = (value) => {
    if (value >= 0) return `+${value}`;
    return `${value}`;
  };

  const getSkillChoiceType = (activityText) => {
    return getSkillChoiceInfo(activityText);
  };

  const getWandModifier = (wandModifierName) => {
    if (!selectedCharacter?.magicModifiers || !wandModifierName) return 0;
    return selectedCharacter.magicModifiers[wandModifierName] || 0;
  };

  const isWandModifier = (modifierName) => {
    return wandModifiers.some((wand) => wand.name === modifierName);
  };

  const getModifierValue = (modifierName) => {
    if (!modifierName) return 0;

    if (isWandModifier(modifierName)) {
      return getWandModifier(modifierName);
    } else {
      return getSkillModifier(modifierName);
    }
  };

  const EnhancedSkillSelector = React.memo(
    ({ assignment, activityText, isSecondSkill = false, onSkillChange }) => {
      const choiceInfo = getSkillChoiceType(activityText);
      const currentSkill = isSecondSkill
        ? assignment?.secondSkill || assignment?.secondWandModifier || ""
        : assignment?.skill || assignment?.wandModifier || "";

      if (choiceInfo.type === "locked") {
        const autoSkill = isSecondSkill
          ? choiceInfo.skills[1]
          : choiceInfo.skills[0];
        if (!autoSkill) return null;
        return (
          <div style={styles.modifierSelection}>
            <label style={styles.label}>Skill/Modifier:</label>
            <div
              style={{
                ...styles.input,
                backgroundColor: theme.background,
                border: `1px solid ${theme.border}`,
                color: theme.text,
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                minHeight: "40px",
              }}
            >
              <span style={{ fontSize: "14px" }}>
                {allSkills.find((s) => s.name === autoSkill)?.displayName ||
                  autoSkill}{" "}
                ({formatModifier(getSkillModifier(autoSkill))})
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: theme.textSecondary,
                  fontStyle: "italic",
                  backgroundColor: `${theme.primary}20`,
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                Auto-selected
              </span>
            </div>
          </div>
        );
      }

      if (choiceInfo.type === "suggested") {
        const suggestedSkills = allSkills.filter((skill) =>
          choiceInfo.skills.includes(skill.name)
        );
        const otherSkills = allSkills.filter(
          (skill) => !choiceInfo.skills.includes(skill.name)
        );

        return (
          <div style={styles.modifierSelection}>
            <label style={styles.label}>Skill/Modifier:</label>
            <div style={{ position: "relative" }}>
              <select
                value={currentSkill || ""}
                key={`${activityText}-${isSecondSkill ? "second" : "first"}`}
                onChange={onSkillChange}
                style={styles.select}
                disabled={!canEdit()}
              >
                <option value="">Select modifier...</option>
                <optgroup label="⭐ Suggested Skills">
                  {suggestedSkills
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .map((skill) => {
                      const modifier = getSkillModifier(skill.name);
                      return (
                        <option key={skill.name} value={skill.name}>
                          {skill.displayName} ({formatModifier(modifier)}) -
                          Recommended
                        </option>
                      );
                    })}
                </optgroup>
                <optgroup label="Other Skills">
                  {otherSkills
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .map((skill) => {
                      const modifier = getSkillModifier(skill.name);
                      return (
                        <option key={skill.name} value={skill.name}>
                          {skill.displayName} ({formatModifier(modifier)})
                        </option>
                      );
                    })}
                </optgroup>
                <optgroup label="Wand Modifiers">
                  {wandModifiers
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .map((wand) => {
                      const modifier = getWandModifier(wand.name);
                      return (
                        <option key={wand.name} value={wand.name}>
                          {wand.displayName} ({formatModifier(modifier)})
                        </option>
                      );
                    })}
                </optgroup>
              </select>

              <div
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "8px",
                  fontSize: "10px",
                  backgroundColor: `${theme.info || "#3b82f6"}20`,
                  color: theme.info || "#3b82f6",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: "500",
                  pointerEvents: "none",
                }}
              >
                Suggested
              </div>
            </div>
          </div>
        );
      }

      if (choiceInfo.type === "limited") {
        const availableSkills = allSkills.filter((skill) =>
          choiceInfo.skills.includes(skill.name)
        );

        return (
          <div style={styles.modifierSelection}>
            <label style={styles.label}>Skill/Modifier:</label>
            <div style={{ position: "relative" }}>
              <select
                value={currentSkill}
                onChange={onSkillChange}
                style={styles.select}
                disabled={!canEdit()}
              >
                <option value="">Choose from allowed skills...</option>
                <optgroup label={`Allowed Skills for this Activity`}>
                  {availableSkills
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .map((skill) => {
                      const modifier = getSkillModifier(skill.name);
                      return (
                        <option key={skill.name} value={skill.name}>
                          {skill.displayName} ({formatModifier(modifier)})
                        </option>
                      );
                    })}
                </optgroup>
              </select>

              <div
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "8px",
                  fontSize: "10px",
                  backgroundColor: `${theme.warning || "#f59e0b"}20`,
                  color: theme.warning || "#f59e0b",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: "500",
                  pointerEvents: "none",
                }}
              >
                Limited Choice ({availableSkills.length})
              </div>
            </div>
          </div>
        );
      }

      return (
        <div style={styles.modifierSelection}>
          <label style={styles.label}>Skill/Modifier:</label>
          <select
            value={currentSkill}
            onChange={onSkillChange}
            style={styles.select}
            disabled={!canEdit()}
          >
            <option value="">Select modifier...</option>
            <optgroup label="Skills">
              {[...allSkills]
                .sort((a, b) => a.displayName.localeCompare(b.displayName))
                .map((skill) => {
                  const modifier = getSkillModifier(skill.name);
                  return (
                    <option key={skill.name} value={skill.name}>
                      {skill.displayName} ({formatModifier(modifier)})
                    </option>
                  );
                })}
            </optgroup>
            <optgroup label="Wand Modifiers">
              {wandModifiers
                .sort((a, b) => a.displayName.localeCompare(b.displayName))
                .map((wand) => {
                  const modifier = getWandModifier(wand.name);
                  return (
                    <option key={wand.name} value={wand.name}>
                      {wand.displayName} ({formatModifier(modifier)})
                    </option>
                  );
                })}
            </optgroup>
          </select>
        </div>
      );
    }
  );

  return (
    <div style={styles.activitiesContainer}>
      <div style={styles.sectionHeader}>
        <h3>Activities</h3>
        <p style={styles.subtitle}>
          Choose your activities and assign dice rolls to each
        </p>
      </div>

      {formData.activities.map((activity, index) => {
        const activityKey = `activity${index + 1}`;
        const assignment = rollAssignments[activityKey];
        const isDualCheck = requiresDualChecks(activity.activity);

        return (
          <div key={index} style={styles.activityCard}>
            <div style={styles.activityHeader}>
              <h4 style={styles.activityTitle}>Activity {index + 1}</h4>
            </div>

            <div style={styles.activityContent}>
              {isDualCheck && (
                <div
                  style={{
                    backgroundColor: `${theme.info || "#3b82f6"}15`,
                    border: `1px solid ${theme.info || "#3b82f6"}30`,
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "16px",
                    fontSize: "14px",
                    color: theme.text,
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      marginBottom: "4px",
                      color: theme.info || "#3b82f6",
                    }}
                  >
                    📋 Dual Check Activity
                  </div>
                  <div>
                    This activity requires{" "}
                    <strong>two separate dice rolls</strong>. You'll need to
                    assign dice and select skills for both the first and second
                    rolls below.
                  </div>
                </div>
              )}

              <div style={styles.activitySection}>
                <div style={styles.selectionGroup}>
                  <label style={styles.label}>Activity:</label>
                  <select
                    value={activity.activity}
                    onChange={(e) =>
                      updateActivity(index, "activity", e.target.value)
                    }
                    style={styles.select}
                    disabled={!canEdit()}
                  >
                    {availableActivities.map((act, i) => (
                      <option key={i} value={act}>
                        {act || "Select an activity..."}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.selectionGroup}>
                  <label style={styles.label}>NPC/Location:</label>
                  <input
                    type="text"
                    value={activity.npc}
                    onChange={(e) =>
                      updateActivity(index, "npc", e.target.value)
                    }
                    placeholder="Optional - specify NPC or location"
                    style={styles.input}
                    disabled={!canEdit()}
                  />
                </div>
              </div>

              <div style={styles.rollSection}>
                <h5 style={styles.rollSectionTitle}>
                  Roll Assignment {isDualCheck ? "(First Roll)" : ""}
                </h5>

                <div style={styles.rollGrid}>
                  <DiceSelection
                    rollAssignments={rollAssignments}
                    canEdit={canEdit}
                    assignDice={assignDice}
                    getSortedDiceOptions={getSortedDiceOptions}
                    getDiceUsage={getDiceUsage}
                    formatModifier={formatModifier}
                    unassignDice={unassignDice}
                    dicePool={dicePool}
                    assignment={activityKey}
                    label={isDualCheck ? "First Die" : "Die"}
                    skillModifier={(() => {
                      const choiceInfo = getSkillChoiceType(activity.activity);
                      if (choiceInfo.type === "locked") {
                        const autoSkill = choiceInfo.skills[0];
                        return getSkillModifier(autoSkill);
                      } else {
                        const currentSkill =
                          assignment?.skill || assignment?.wandModifier || "";
                        return getModifierValue(currentSkill);
                      }
                    })()}
                    skillName={(() => {
                      const choiceInfo = getSkillChoiceType(activity.activity);
                      if (choiceInfo.type === "locked") {
                        const autoSkill = choiceInfo.skills[0];
                        return (
                          allSkills.find((s) => s.name === autoSkill)
                            ?.displayName || autoSkill
                        );
                      } else {
                        const currentSkill =
                          assignment?.skill || assignment?.wandModifier || "";
                        if (isWandModifier(currentSkill)) {
                          return (
                            wandModifiers.find((w) => w.name === currentSkill)
                              ?.displayName || currentSkill
                          );
                        } else {
                          return (
                            allSkills.find((s) => s.name === currentSkill)
                              ?.displayName || currentSkill
                          );
                        }
                      }
                    })()}
                  />

                  <EnhancedSkillSelector
                    assignment={assignment}
                    activityText={activity.activity}
                    isSecondSkill={false}
                    onSkillChange={(e) => {
                      const value = e.target.value;
                      const fieldName = "skill";
                      const wandFieldName = "wandModifier";

                      if (isWandModifier(value)) {
                        updateRollAssignment(activityKey, wandFieldName, value);
                        updateRollAssignment(activityKey, fieldName, "");
                      } else {
                        updateRollAssignment(activityKey, fieldName, value);
                        updateRollAssignment(activityKey, wandFieldName, "");
                      }
                    }}
                  />
                </div>

                <div style={styles.notesGroup}>
                  <label style={styles.label}>Notes:</label>
                  <textarea
                    value={assignment?.notes || ""}
                    onChange={(e) =>
                      updateRollAssignment(
                        `activity${index + 1}`,
                        "notes",
                        e.target.value
                      )
                    }
                    placeholder="Optional notes for this roll"
                    style={styles.textarea}
                    disabled={!canEdit()}
                    rows={2}
                  />
                </div>
              </div>

              {isDualCheck && (
                <div style={styles.rollSection}>
                  <h5 style={styles.rollSectionTitle}>
                    Second Roll Assignment
                  </h5>

                  <div style={styles.rollGrid}>
                    <DiceSelection
                      rollAssignments={rollAssignments}
                      canEdit={canEdit}
                      assignDice={assignDice}
                      getSortedDiceOptions={getSortedDiceOptions}
                      getDiceUsage={getDiceUsage}
                      formatModifier={formatModifier}
                      unassignDice={unassignDice}
                      dicePool={dicePool}
                      assignment={activityKey}
                      isSecondDie={true}
                      label="Second Die"
                      skillModifier={(() => {
                        const choiceInfo = getSkillChoiceType(
                          activity.activity
                        );
                        if (choiceInfo.type === "locked") {
                          const autoSkill = choiceInfo.skills[1];
                          return getSkillModifier(autoSkill);
                        } else {
                          const currentSkill =
                            assignment?.secondSkill ||
                            assignment?.secondWandModifier ||
                            "";
                          return getModifierValue(currentSkill);
                        }
                      })()}
                      skillName={(() => {
                        const choiceInfo = getSkillChoiceType(
                          activity.activity
                        );
                        if (choiceInfo.type === "locked") {
                          const autoSkill = choiceInfo.skills[1];
                          return (
                            allSkills.find((s) => s.name === autoSkill)
                              ?.displayName || autoSkill
                          );
                        } else {
                          const currentSkill =
                            assignment?.secondSkill ||
                            assignment?.secondWandModifier ||
                            "";
                          if (isWandModifier(currentSkill)) {
                            return (
                              wandModifiers.find((w) => w.name === currentSkill)
                                ?.displayName || currentSkill
                            );
                          } else {
                            return (
                              allSkills.find((s) => s.name === currentSkill)
                                ?.displayName || currentSkill
                            );
                          }
                        }
                      })()}
                    />

                    <EnhancedSkillSelector
                      assignment={assignment}
                      activityText={activity.activity}
                      isSecondSkill={true}
                      onSkillChange={(e) => {
                        const value = e.target.value;
                        const fieldName = "secondSkill";
                        const wandFieldName = "secondWandModifier";

                        if (isWandModifier(value)) {
                          updateRollAssignment(
                            activityKey,
                            wandFieldName,
                            value
                          );
                          updateRollAssignment(activityKey, fieldName, "");
                        } else {
                          updateRollAssignment(activityKey, fieldName, value);
                          updateRollAssignment(activityKey, wandFieldName, "");
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              <div style={styles.successSection}>
                <div style={styles.successHeader}>
                  <h5 style={styles.rollSectionTitle}>Success Tracking</h5>
                  {!adminMode && (
                    <span style={styles.adminOnlyBadge}>Admin Only</span>
                  )}
                </div>

                {(activity.activity
                  .toLowerCase()
                  .includes("increase an ability score") ||
                  activity.activity
                    .toLowerCase()
                    .includes("gain proficiency") ||
                  activity.activity.toLowerCase().includes("create a spell") ||
                  activity.activity
                    .toLowerCase()
                    .includes("invent a potion")) && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: theme.textSecondary,
                      marginBottom: "8px",
                      fontStyle: "italic",
                    }}
                  >
                    This activity requires 3 successes across separate downtime
                    periods
                  </div>
                )}

                <div style={styles.successGrid}>
                  {activity.successes.map((success, successIndex) => (
                    <button
                      key={successIndex}
                      onClick={() => updateActivitySuccess(index, successIndex)}
                      style={{
                        ...styles.successButton,
                        backgroundColor: success ? "#10b981" : "transparent",
                        border: success
                          ? "2px solid #10b981"
                          : "2px solid #e5e7eb",
                        cursor: adminMode ? "pointer" : "not-allowed",
                        opacity: adminMode ? 1 : 0.6,
                      }}
                      disabled={!adminMode}
                      title={
                        adminMode
                          ? `Success ${successIndex + 1}`
                          : "Only available in admin mode"
                      }
                    >
                      {successIndex + 1}
                    </button>
                  ))}
                </div>
                <p style={styles.successText}>
                  Successes: {activity.successes.filter((s) => s).length}/5
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div style={styles.sectionHeader}>
        <h3>NPC Encounters</h3>
        <p style={styles.subtitle}>
          Social interactions and relationship building with NPCs
        </p>
      </div>

      <div style={styles.activityCard}>
        <div style={styles.activityHeader}>
          <h4 style={styles.activityTitle}>NPC Encounter 1</h4>
        </div>

        <div style={styles.activityContent}>
          <div style={styles.rollGrid}>
            <div style={styles.selectionGroup}>
              <label style={styles.label}>NPC Name:</label>
              <input
                type="text"
                value={formData.npcEncounters?.[0]?.name || ""}
                onChange={(e) => updateNPCEncounter(0, "name", e.target.value)}
                placeholder="Enter NPC name"
                style={styles.input}
                disabled={!canEdit()}
              />
            </div>

            <DiceSelection
              rollAssignments={rollAssignments}
              canEdit={canEdit}
              assignDice={assignDice}
              getSortedDiceOptions={getSortedDiceOptions}
              getDiceUsage={getDiceUsage}
              formatModifier={formatModifier}
              unassignDice={unassignDice}
              dicePool={dicePool}
              assignment="npc1"
              label="Die"
              skillModifier={(() => {
                const currentSkill =
                  rollAssignments?.npc1?.skill ||
                  rollAssignments?.npc1?.wandModifier ||
                  "";
                return getModifierValue(currentSkill);
              })()}
              skillName={(() => {
                const currentSkill =
                  rollAssignments?.npc1?.skill ||
                  rollAssignments?.npc1?.wandModifier ||
                  "";
                if (isWandModifier(currentSkill)) {
                  return (
                    wandModifiers.find((w) => w.name === currentSkill)
                      ?.displayName || currentSkill
                  );
                } else {
                  return (
                    allSkills.find((s) => s.name === currentSkill)
                      ?.displayName || currentSkill
                  );
                }
              })()}
            />

            <div style={styles.modifierSelection}>
              <label style={styles.label}>Skill/Modifier:</label>
              <select
                value={
                  rollAssignments?.npc1?.skill ||
                  rollAssignments?.npc1?.wandModifier ||
                  ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (isWandModifier(value)) {
                    updateRollAssignment("npc1", "wandModifier", value);
                    updateRollAssignment("npc1", "skill", "");
                  } else {
                    updateRollAssignment("npc1", "skill", value);
                    updateRollAssignment("npc1", "wandModifier", "");
                  }
                }}
                style={styles.select}
                disabled={!canEdit()}
              >
                <option value="">Select modifier...</option>
                <optgroup label="Skills">
                  {[...allSkills]
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .map((skill) => {
                      const modifier = getSkillModifier(skill.name);
                      return (
                        <option key={skill.name} value={skill.name}>
                          {skill.displayName} ({formatModifier(modifier)})
                        </option>
                      );
                    })}
                </optgroup>
                <optgroup label="Wand Modifiers">
                  {wandModifiers
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .map((wand) => {
                      const modifier = getWandModifier(wand.name);
                      return (
                        <option key={wand.name} value={wand.name}>
                          {wand.displayName} ({formatModifier(modifier)})
                        </option>
                      );
                    })}
                </optgroup>
              </select>
            </div>
          </div>

          <div style={styles.notesGroup}>
            <label style={styles.label}>Notes:</label>
            <textarea
              value={rollAssignments?.npc1?.notes || ""}
              onChange={(e) =>
                updateRollAssignment("npc1", "notes", e.target.value)
              }
              placeholder="Optional notes for this NPC encounter"
              style={styles.textarea}
              disabled={!canEdit()}
              rows={2}
            />
          </div>

          <div style={styles.successSection}>
            <div style={styles.successHeader}>
              <h5 style={styles.rollSectionTitle}>Relationship Progress</h5>
              {!adminMode && (
                <span style={styles.adminOnlyBadge}>Admin Only</span>
              )}
            </div>
            <div style={styles.successGrid}>
              {(
                formData.npcEncounters?.[0]?.successes || [
                  false,
                  false,
                  false,
                  false,
                  false,
                ]
              ).map((success, successIndex) => (
                <button
                  key={successIndex}
                  onClick={() => updateNPCSuccess(0, successIndex)}
                  style={{
                    ...styles.successButton,
                    backgroundColor: success ? "#10b981" : "transparent",
                    border: success ? "2px solid #10b981" : "2px solid #e5e7eb",
                    cursor: adminMode ? "pointer" : "not-allowed",
                    opacity: adminMode ? 1 : 0.6,
                  }}
                  disabled={!adminMode}
                  title={
                    adminMode
                      ? `Success ${successIndex + 1}`
                      : "Only available in admin mode"
                  }
                >
                  {successIndex + 1}
                </button>
              ))}
            </div>
            <p style={styles.successText}>
              Successes:{" "}
              {
                (formData.npcEncounters?.[0]?.successes || []).filter((s) => s)
                  .length
              }
              /5
            </p>
          </div>
        </div>
      </div>

      <div style={styles.activityCard}>
        <div style={styles.activityHeader}>
          <h4 style={styles.activityTitle}>NPC Encounter 2</h4>
        </div>

        <div style={styles.activityContent}>
          <div style={styles.rollGrid}>
            <div style={styles.selectionGroup}>
              <label style={styles.label}>NPC Name:</label>
              <input
                type="text"
                value={formData.npcEncounters?.[1]?.name || ""}
                onChange={(e) => updateNPCEncounter(1, "name", e.target.value)}
                placeholder="Enter NPC name"
                style={styles.input}
                disabled={!canEdit()}
              />
            </div>

            <DiceSelection
              rollAssignments={rollAssignments}
              canEdit={canEdit}
              assignDice={assignDice}
              getSortedDiceOptions={getSortedDiceOptions}
              getDiceUsage={getDiceUsage}
              formatModifier={formatModifier}
              unassignDice={unassignDice}
              dicePool={dicePool}
              assignment="npc2"
              label="Die"
              skillModifier={(() => {
                const currentSkill =
                  rollAssignments?.npc2?.skill ||
                  rollAssignments?.npc2?.wandModifier ||
                  "";
                return getModifierValue(currentSkill);
              })()}
              skillName={(() => {
                const currentSkill =
                  rollAssignments?.npc2?.skill ||
                  rollAssignments?.npc2?.wandModifier ||
                  "";
                if (isWandModifier(currentSkill)) {
                  return (
                    wandModifiers.find((w) => w.name === currentSkill)
                      ?.displayName || currentSkill
                  );
                } else {
                  return (
                    allSkills.find((s) => s.name === currentSkill)
                      ?.displayName || currentSkill
                  );
                }
              })()}
            />

            <div style={styles.modifierSelection}>
              <label style={styles.label}>Skill/Modifier:</label>
              <select
                value={
                  rollAssignments?.npc2?.skill ||
                  rollAssignments?.npc2?.wandModifier ||
                  ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (isWandModifier(value)) {
                    updateRollAssignment("npc2", "wandModifier", value);
                    updateRollAssignment("npc2", "skill", "");
                  } else {
                    updateRollAssignment("npc2", "skill", value);
                    updateRollAssignment("npc2", "wandModifier", "");
                  }
                }}
                style={styles.select}
                disabled={!canEdit()}
              >
                <option value="">Select modifier...</option>
                <optgroup label="Skills">
                  {allSkills
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .map((skill) => {
                      const modifier = getSkillModifier(skill.name);
                      return (
                        <option key={skill.name} value={skill.name}>
                          {skill.displayName} ({formatModifier(modifier)})
                        </option>
                      );
                    })}
                </optgroup>
                <optgroup label="Wand Modifiers">
                  {wandModifiers
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .map((wand) => {
                      const modifier = getWandModifier(wand.name);
                      return (
                        <option key={wand.name} value={wand.name}>
                          {wand.displayName} ({formatModifier(modifier)})
                        </option>
                      );
                    })}
                </optgroup>
              </select>
            </div>
          </div>

          <div style={styles.notesGroup}>
            <label style={styles.label}>Notes:</label>
            <textarea
              value={rollAssignments?.npc2?.notes || ""}
              onChange={(e) =>
                updateRollAssignment("npc2", "notes", e.target.value)
              }
              placeholder="Optional notes for this NPC encounter"
              style={styles.textarea}
              disabled={!canEdit()}
              rows={2}
            />
          </div>

          <div style={styles.successSection}>
            <div style={styles.successHeader}>
              <h5 style={styles.rollSectionTitle}>Relationship Progress</h5>
              {!adminMode && (
                <span style={styles.adminOnlyBadge}>Admin Only</span>
              )}
            </div>
            <div style={styles.successGrid}>
              {(
                formData.npcEncounters?.[1]?.successes || [
                  false,
                  false,
                  false,
                  false,
                  false,
                ]
              ).map((success, successIndex) => (
                <button
                  key={successIndex}
                  onClick={() => updateNPCSuccess(1, successIndex)}
                  style={{
                    ...styles.successButton,
                    backgroundColor: success ? "#10b981" : "transparent",
                    border: success ? "2px solid #10b981" : "2px solid #e5e7eb",
                    cursor: adminMode ? "pointer" : "not-allowed",
                    opacity: adminMode ? 1 : 0.6,
                  }}
                  disabled={!adminMode}
                  title={
                    adminMode
                      ? `Success ${successIndex + 1}`
                      : "Only available in admin mode"
                  }
                >
                  {successIndex + 1}
                </button>
              ))}
            </div>
            <p style={styles.successText}>
              Successes:{" "}
              {
                (formData.npcEncounters?.[1]?.successes || []).filter((s) => s)
                  .length
              }
              /5
            </p>
          </div>
        </div>
      </div>

      <div style={styles.activityCard}>
        <div style={styles.activityHeader}>
          <h4 style={styles.activityTitle}>NPC Encounter 3</h4>
        </div>

        <div style={styles.activityContent}>
          <div style={styles.rollGrid}>
            <div style={styles.selectionGroup}>
              <label style={styles.label}>NPC Name:</label>
              <input
                type="text"
                value={formData.npcEncounters?.[2]?.name || ""}
                onChange={(e) => updateNPCEncounter(2, "name", e.target.value)}
                placeholder="Enter NPC name"
                style={styles.input}
                disabled={!canEdit()}
              />
            </div>

            <DiceSelection
              rollAssignments={rollAssignments}
              canEdit={canEdit}
              assignDice={assignDice}
              getSortedDiceOptions={getSortedDiceOptions}
              getDiceUsage={getDiceUsage}
              formatModifier={formatModifier}
              unassignDice={unassignDice}
              dicePool={dicePool}
              assignment="npc3"
              label="Die"
              skillModifier={(() => {
                const currentSkill =
                  rollAssignments?.npc3?.skill ||
                  rollAssignments?.npc3?.wandModifier ||
                  "";
                return getModifierValue(currentSkill);
              })()}
              skillName={(() => {
                const currentSkill =
                  rollAssignments?.npc3?.skill ||
                  rollAssignments?.npc3?.wandModifier ||
                  "";
                if (isWandModifier(currentSkill)) {
                  return (
                    wandModifiers.find((w) => w.name === currentSkill)
                      ?.displayName || currentSkill
                  );
                } else {
                  return (
                    allSkills.find((s) => s.name === currentSkill)
                      ?.displayName || currentSkill
                  );
                }
              })()}
            />

            <div style={styles.modifierSelection}>
              <label style={styles.label}>Skill/Modifier:</label>
              <select
                value={
                  rollAssignments?.npc3?.skill ||
                  rollAssignments?.npc3?.wandModifier ||
                  ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (isWandModifier(value)) {
                    updateRollAssignment("npc3", "wandModifier", value);
                    updateRollAssignment("npc3", "skill", "");
                  } else {
                    updateRollAssignment("npc3", "skill", value);
                    updateRollAssignment("npc3", "wandModifier", "");
                  }
                }}
                style={styles.select}
                disabled={!canEdit()}
              >
                <option value="">Select modifier...</option>
                <optgroup label="Skills">
                  {[...allSkills]
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .map((skill) => {
                      const modifier = getSkillModifier(skill.name);
                      return (
                        <option key={skill.name} value={skill.name}>
                          {skill.displayName} ({formatModifier(modifier)})
                        </option>
                      );
                    })}
                </optgroup>
                <optgroup label="Wand Modifiers">
                  {wandModifiers
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .map((wand) => {
                      const modifier = getWandModifier(wand.name);
                      return (
                        <option key={wand.name} value={wand.name}>
                          {wand.displayName} ({formatModifier(modifier)})
                        </option>
                      );
                    })}
                </optgroup>
              </select>
            </div>
          </div>

          <div style={styles.notesGroup}>
            <label style={styles.label}>Notes:</label>
            <textarea
              value={rollAssignments?.npc3?.notes || ""}
              onChange={(e) =>
                updateRollAssignment("npc3", "notes", e.target.value)
              }
              placeholder="Optional notes for this NPC encounter"
              style={styles.textarea}
              disabled={!canEdit()}
              rows={2}
            />
          </div>

          <div style={styles.successSection}>
            <div style={styles.successHeader}>
              <h5 style={styles.rollSectionTitle}>Relationship Progress</h5>
              {!adminMode && (
                <span style={styles.adminOnlyBadge}>Admin Only</span>
              )}
            </div>
            <div style={styles.successGrid}>
              {(
                formData.npcEncounters?.[2]?.successes || [
                  false,
                  false,
                  false,
                  false,
                  false,
                ]
              ).map((success, successIndex) => (
                <button
                  key={successIndex}
                  onClick={() => updateNPCSuccess(2, successIndex)}
                  style={{
                    ...styles.successButton,
                    backgroundColor: success ? "#10b981" : "transparent",
                    border: success ? "2px solid #10b981" : "2px solid #e5e7eb",
                    cursor: adminMode ? "pointer" : "not-allowed",
                    opacity: adminMode ? 1 : 0.6,
                  }}
                  disabled={!adminMode}
                  title={
                    adminMode
                      ? `Success ${successIndex + 1}`
                      : "Only available in admin mode"
                  }
                >
                  {successIndex + 1}
                </button>
              ))}
            </div>
            <p style={styles.successText}>
              Successes:{" "}
              {
                (formData.npcEncounters?.[2]?.successes || []).filter((s) => s)
                  .length
              }
              /5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityManager;
