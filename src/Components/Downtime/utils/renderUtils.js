import React from "react";

import { allSkills } from "../../../SharedData/data";
import { wandModifiers } from "../../../SharedData/downtime";
import { formatModifier } from "./modifierUtils";
import {
  activityRequiresNoDiceRoll,
  activityRequiresExtraDie,
  getSpecialActivityInfo,
  isMultiSessionActivity,
  shouldUseCustomDiceForActivity,
  getCustomDiceTypeForActivity,
  activityRequiresDualChecks,
  activityRequiresWandSelection,
  activityRequiresSpellSelection,
  calculateWandStatIncreaseDC,
  getActivitySkillInfo,
} from "../downtimeHelpers";
import SkillSelector from "../SkillSelector";

export const renderDiceValue = ({
  assignment,
  dicePool,
  isSecond = false,
  activity = null,
  styles,
  theme,
  selectedCharacter,
  getModifierValue,
}) => {
  const diceIndexKey = isSecond ? "secondDiceIndex" : "diceIndex";
  const skillKey = isSecond ? "secondSkill" : "skill";
  const wandKey = isSecond ? "secondWandModifier" : "wandModifier";

  if (assignment.customDice && !isSecond) {
    const isWorkJob = assignment.jobType !== undefined;
    const isAllowance = assignment.familyType !== undefined;
    const diceSum = assignment.customDice[0] + assignment.customDice[1];

    return (
      <div style={styles.assignedDice}>
        <div style={styles.diceValue}>
          {isWorkJob ? (
            <>
              {assignment.jobType === "easy" && "2D8: "}
              {assignment.jobType === "medium" && "2D10: "}
              {assignment.jobType === "hard" && "2D12: "}
              {assignment.customDice[0]} + {assignment.customDice[1]} ={" "}
              {diceSum}
              <div
                style={{
                  fontSize: "0.875rem",
                  color: theme.textSecondary,
                  marginTop: "0.25rem",
                }}
              >
                Earnings: {diceSum} × 2 = {diceSum * 2} Galleons
              </div>
            </>
          ) : isAllowance ? (
            <>
              {assignment.familyType === "poor" && "2d4: "}
              {assignment.familyType === "middle" && "2d6: "}
              {assignment.familyType === "rich" && "2d8: "}
              {assignment.customDice[0]} + {assignment.customDice[1]} ={" "}
              {diceSum}
              <div
                style={{
                  fontSize: "0.875rem",
                  color: theme.textSecondary,
                  marginTop: "0.25rem",
                }}
              >
                Allowance: {diceSum} × 2 = {diceSum * 2} Galleons
              </div>
            </>
          ) : (
            <>
              2d12: {assignment.customDice[0]} + {assignment.customDice[1]} ={" "}
              {diceSum}
            </>
          )}
        </div>
        {assignment[skillKey] && !isWorkJob && !isAllowance && (
          <div style={styles.total}>
            Total: {diceSum}{" "}
            {formatModifier(getModifierValue(assignment[skillKey]))} ={" "}
            {diceSum + getModifierValue(assignment[skillKey])}
          </div>
        )}
      </div>
    );
  }

  if (
    assignment[diceIndexKey] !== null &&
    assignment[diceIndexKey] !== undefined
  ) {
    const diceValue = dicePool[assignment[diceIndexKey]];

    if (activity && activityRequiresWandSelection(activity.activity)) {
      const selectedWandModifier = activity.selectedWandModifier;

      if (!selectedWandModifier) {
        return (
          <div style={styles.assignedDice}>
            <div style={styles.diceValue}>{diceValue}</div>
            <div style={styles.total}>Select a wand modifier to see total</div>
          </div>
        );
      }

      const currentWandValue =
        selectedCharacter.magicModifiers?.[selectedWandModifier] || 0;
      const totalRoll = diceValue + currentWandValue;
      const dc = calculateWandStatIncreaseDC(
        selectedCharacter,
        selectedWandModifier
      );

      return (
        <div style={styles.assignedDice}>
          <div style={styles.diceValue}>{totalRoll}</div>
          <div style={styles.total}>
            Roll: {diceValue} {formatModifier(currentWandValue)} = {totalRoll}
          </div>
        </div>
      );
    }

    const skillName = assignment[skillKey];
    const wandModifier = assignment[wandKey];

    const activitySkillInfo = getActivitySkillInfo(activity?.activity);
    let autoSelectedSkill = null;
    if (activitySkillInfo?.type === "locked" && activitySkillInfo?.skills) {
      autoSelectedSkill = isSecond
        ? activitySkillInfo.skills[1]
        : activitySkillInfo.skills[0];
    }

    const hasSkill = skillName && skillName !== "";
    const hasWandModifier = wandModifier && wandModifier !== "";
    const hasAutoSkill = autoSelectedSkill && !hasSkill && !hasWandModifier;
    const hasAnyModifier = hasSkill || hasWandModifier || hasAutoSkill;

    let modifierValue = 0;
    let modifierSource = "";

    if (hasSkill) {
      modifierValue = getModifierValue(skillName);
      const skill = allSkills.find((s) => s.name === skillName);
      modifierSource = skill?.displayName || skillName;
    } else if (hasWandModifier) {
      modifierValue = getModifierValue(wandModifier);
      const wand = wandModifiers.find((w) => w.name === wandModifier);
      modifierSource = wand?.displayName || wandModifier;
    } else if (hasAutoSkill) {
      modifierValue = getModifierValue(autoSelectedSkill);
      const skill = allSkills.find((s) => s.name === autoSelectedSkill);
      modifierSource = skill?.displayName || autoSelectedSkill;
    }

    const totalValue = diceValue + modifierValue;

    return (
      <div style={styles.assignedDice}>
        <div style={styles.diceValue}>{diceValue}</div>
        {hasAnyModifier ? (
          <div style={styles.total}>
            {diceValue} {formatModifier(modifierValue)} = {totalValue}
          </div>
        ) : (
          <div
            style={{
              ...styles.total,
              color: theme.textSecondary,
              fontSize: "0.875rem",
            }}
          >
            {isSecond
              ? "Select second skill/modifier"
              : "Select skill/modifier for total"}
          </div>
        )}
        {hasAnyModifier && (
          <div
            style={{
              fontSize: "0.75rem",
              color: theme.textSecondary,
              marginTop: "0.25rem",
            }}
          >
            Using:{" "}
            {hasAutoSkill
              ? `${
                  allSkills.find((s) => s.name === autoSelectedSkill)
                    ?.displayName || autoSelectedSkill
                } (Auto)`
              : modifierSource}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export const renderSpecialActivityInfo = ({
  activityText,
  theme,
  styles,
  formData,
  editable,
  diceManager,
}) => {
  if (!activityText) return null;

  if (activityRequiresNoDiceRoll(activityText)) {
    if (activityRequiresExtraDie(activityText)) {
      return (
        <div
          style={{
            padding: "1rem",
            backgroundColor: theme.primary + "20",
            border: `1px solid ${theme.primary}`,
            borderRadius: "6px",
            marginTop: "1rem",
          }}
        >
          <strong>🎲 Spell Activity Bonus</strong>
          <br />
          <small>
            This activity adds an extra die to your dice pool and allows you to
            select up to 2 spells for separate attempts. Rolls use your relevant
            magic school and wand modifiers.
          </small>
        </div>
      );
    }

    const specialInfo = getSpecialActivityInfo(activityText);
    return (
      <div
        style={{
          padding: "1rem",
          backgroundColor: theme.info + "20",
          border: `1px solid ${theme.info}`,
          borderRadius: "6px",
          marginTop: "1rem",
          textAlign: "center",
        }}
      >
        <strong>📋 No Dice Roll Required</strong>
        <br />
        <small>
          {specialInfo?.description ||
            "This activity doesn't require a dice roll to complete."}
        </small>
      </div>
    );
  }

  if (isMultiSessionActivity(activityText)) {
    return (
      <div
        style={{
          padding: "1rem",
          backgroundColor: theme.warning + "20",
          border: `1px solid ${theme.warning}`,
          borderRadius: "6px",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        <strong>⏳ Multi-Session Activity</strong>
        <br />
        <small>
          Requires 3 successful checks across separate downtime sessions
        </small>
      </div>
    );
  }

  if (shouldUseCustomDiceForActivity(activityText)) {
    const customDiceInfo = getCustomDiceTypeForActivity(activityText);
    const isWorkJob = activityText.toLowerCase().includes("work job");
    const isAllowance = activityText.toLowerCase().includes("allowance");

    return (
      <div
        style={{
          padding: "1rem",
          backgroundColor: theme.warning + "20",
          border: `1px solid ${theme.warning}`,
          borderRadius: "6px",
          marginTop: "1rem",
        }}
      >
        <div style={{ marginBottom: "0.5rem" }}>
          <strong>🎲 Special Dice Rules</strong>
          <br />
          <small>{customDiceInfo.description}</small>
        </div>

        {isWorkJob && (
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: theme.text,
              }}
            >
              Job Difficulty:
            </label>
            <select
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.surface,
                color: theme.text,
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
              defaultValue="medium"
              id={`job-difficulty-${activityText}`}
            >
              <option value="easy">Easy Job (2D8 + promotions)</option>
              <option value="medium">Medium Job (2D10 + promotions)</option>
              <option value="hard">Hard Job (2D12 + promotions)</option>
            </select>
          </div>
        )}

        {isAllowance && (
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: theme.text,
              }}
            >
              Family Economic Status:
            </label>
            <select
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.surface,
                color: theme.text,
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
              defaultValue="middle"
              id={`family-status-${activityText}`}
            >
              <option value="poor">Poor Family (2d4×2 Galleons)</option>
              <option value="middle">
                Middle Class Family (2d6×2 Galleons)
              </option>
              <option value="rich">Rich Family (2d8×2 Galleons)</option>
            </select>
          </div>
        )}

        <div>
          <button
            onClick={() => {
              const jobType = isWorkJob
                ? document.getElementById(`job-difficulty-${activityText}`)
                    ?.value || "medium"
                : undefined;
              const familyType = isAllowance
                ? document.getElementById(`family-status-${activityText}`)
                    ?.value || "middle"
                : undefined;
              const activityIndex = formData.activities.findIndex(
                (activity) => activity.activity === activityText
              );
              diceManager.functions.handleCustomDiceRoll(
                activityText,
                jobType || familyType,
                activityIndex
              );
            }}
            disabled={!editable}
            style={{
              ...styles.button,
              ...styles.secondaryButton,
              fontSize: "0.875rem",
              padding: "0.5rem 1rem",
              ...(!editable ? { opacity: 0.6, cursor: "not-allowed" } : {}),
            }}
          >
            Roll {customDiceInfo.diceType}
          </button>
        </div>
      </div>
    );
  }

  const specialInfo = getSpecialActivityInfo(activityText);
  if (specialInfo) {
    let iconAndTitle = "";
    let bgColor = theme.info;

    switch (specialInfo.type) {
      case "job_application":
        iconAndTitle = "Job Application";
        bgColor = theme.success;
        break;
      case "promotion":
        iconAndTitle = "Promotion Attempt";
        bgColor = theme.success;
        break;
      case "spell_research":
        iconAndTitle = "Spell Research";
        bgColor = theme.primary;
        break;
      case "spell_attempt":
        iconAndTitle = "Spell Attempt";
        bgColor = theme.primary;
        break;
      default:
        iconAndTitle = "Special Activity";
    }

    return (
      <div
        style={{
          padding: "1rem",
          backgroundColor: bgColor + "20",
          border: `1px solid ${bgColor}`,
          borderRadius: "6px",
          marginTop: "1rem",
        }}
      >
        <strong>{iconAndTitle}</strong>
        <br />
        <small>
          {specialInfo?.description || "Special activity information"}
        </small>
      </div>
    );
  }

  return null;
};

export const renderMakeSpellActivity = ({
  activity,
  index,
  styles,
  updateActivity,
  editable,
  selectedCharacter,
  getCheckDescription,
}) => {
  const spellName = activity.spellName || "";
  const spellLevel = activity.spellLevel || 1;
  const currentProgress = activity.currentSuccesses || 0;
  const selectedCheckType = activity.selectedSpellCheckType || "Magical Theory";

  const dc = 17 + spellLevel - (selectedCharacter?.year || 1);

  return (
    <div style={styles.makeSpellContainer}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Spell Name</label>
        <input
          type="text"
          value={spellName}
          onChange={(e) => updateActivity(index, "spellName", e.target.value)}
          placeholder="Enter the name of your new spell..."
          style={styles.input}
          disabled={!editable}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Spell Level</label>
        <select
          value={spellLevel}
          onChange={(e) =>
            updateActivity(index, "spellLevel", parseInt(e.target.value))
          }
          style={styles.select}
          disabled={!editable}
        >
          <option value={1}>1st Level</option>
          <option value={2}>2nd Level</option>
          <option value={3}>3rd Level</option>
          <option value={4}>4th Level</option>
          <option value={5}>5th Level</option>
          <option value={6}>6th Level</option>
          <option value={7}>7th Level</option>
          <option value={8}>8th Level</option>
          <option value={9}>9th Level</option>
        </select>
      </div>

      <div style={styles.progressContainer}>
        <div style={styles.progressHeader}>
          <h4 style={styles.progressTitle}>Overall Progress</h4>
          <div style={styles.progressBadge}>
            {currentProgress}/3 Successful Checks
          </div>
        </div>

        {currentProgress < 3 && (
          <div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Select Check Type for This Downtime
              </label>
              <select
                value={selectedCheckType}
                onChange={(e) =>
                  updateActivity(
                    index,
                    "selectedSpellCheckType",
                    e.target.value
                  )
                }
                style={styles.select}
                disabled={!editable}
              >
                <option value="Magical Theory">Magical Theory Check</option>
                <option value="Wand Modifier">Wand Modifier Check</option>
                <option value="Spellcasting Ability">
                  Spellcasting Ability Check
                </option>
              </select>
            </div>

            <div
              style={{
                padding: "1rem",
                backgroundColor: "rgba(100, 150, 255, 0.1)",
                borderRadius: "6px",
                marginTop: "1rem",
                fontSize: "0.875rem",
              }}
            >
              <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                {selectedCheckType}
              </div>
              <div style={{ color: styles.textSecondary }}>
                {getCheckDescription(selectedCheckType)}
              </div>
              <div style={{ marginTop: "0.75rem", fontWeight: "600" }}>
                DC {dc}{" "}
                <span style={{ fontWeight: "normal", fontSize: "0.8rem" }}>
                  (17 + {spellLevel} spell level -{" "}
                  {selectedCharacter?.year || 1} year)
                </span>
              </div>
            </div>

            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "rgba(255, 200, 100, 0.15)",
                borderRadius: "6px",
                marginTop: "0.75rem",
                fontSize: "0.8rem",
                fontStyle: "italic",
              }}
            >
              💡 You can attempt any of the 3 check types in any order across
              different downtime sessions. You need 3 total successful checks
              (they can be any combination of the check types).
            </div>
          </div>
        )}

        {currentProgress >= 3 && (
          <div style={styles.completionMessage}>
            <strong>🎉 Spell Creation Complete!</strong>
            <div>Your spell "{spellName}" has been successfully created.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export const renderDiceAssignment = ({
  activity,
  index,
  assignment,
  styles,
  renderDiceValue,
  dicePool,
  diceManager,
  editable,
  updateRollAssignment,
  selectedCharacter,
}) => {
  const activityText = activity.activity;

  if (!activityText) return null;

  if (activityRequiresNoDiceRoll(activityText)) {
    return null;
  }

  if (activityRequiresExtraDie(activityText)) {
    return <div style={{ marginTop: "1rem", textAlign: "center" }}></div>;
  }

  if (activityRequiresSpellSelection(activityText)) {
    return null;
  }

  if (shouldUseCustomDiceForActivity(activityText)) {
    if (assignment.customDice) {
      return (
        <div style={styles.diceAssignment}>
          <div>
            <label style={styles.label}>Roll Result</label>
            {renderDiceValue(assignment, dicePool, false, activity)}
          </div>
        </div>
      );
    }
    return null;
  }

  if (activityRequiresWandSelection(activityText)) {
    return (
      <div style={styles.diceAssignment}>
        <div>
          <label style={styles.label}>Assigned Die</label>
          {renderDiceValue(assignment, dicePool, false, activity) || (
            <select
              style={styles.select}
              value=""
              onChange={(e) =>
                diceManager.functions.assignDice(
                  index,
                  parseInt(e.target.value),
                  false
                )
              }
              disabled={!editable}
            >
              <option value="">Select die...</option>
              {diceManager.functions.getSortedDiceOptions
                .filter(
                  ({ index: diceIndex }) =>
                    !diceManager.functions.isDiceAssigned(diceIndex)
                )
                .map(({ value, index: diceIndex }) => (
                  <option key={diceIndex} value={diceIndex}>
                    {value}
                  </option>
                ))}
            </select>
          )}
          {assignment.diceIndex !== null &&
            assignment.diceIndex !== undefined &&
            editable && (
              <button
                style={styles.removeButton}
                onClick={() => diceManager.functions.unassignDice(index, false)}
              >
                Remove
              </button>
            )}
        </div>
      </div>
    );
  }

  if (activityRequiresDualChecks(activityText)) {
    const hasSecondDieAssigned =
      assignment.secondDiceIndex !== null &&
      assignment.secondDiceIndex !== undefined;

    const totalDualCheckActivities =
      diceManager.data.dualCheckActivities.length;
    const currentExtraDice = Math.max(0, dicePool.length - 6);
    const canAddMoreDice = currentExtraDice < totalDualCheckActivities;

    const totalDiceNeeded = 6 + totalDualCheckActivities;
    const needsExtraDie =
      !hasSecondDieAssigned &&
      canAddMoreDice &&
      dicePool.length < totalDiceNeeded;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <div>
          <SkillSelector
            activityText={activityText}
            assignment={assignment}
            isSecondSkill={false}
            onChange={(value) => updateRollAssignment(index, "skill", value)}
            canEdit={() => editable}
            selectedCharacter={selectedCharacter}
          />

          <div style={{ marginTop: "0.5rem" }}>
            <label style={styles.label}>Primary Die</label>
            {renderDiceValue(assignment, dicePool, false, activity) || (
              <select
                style={styles.select}
                value=""
                onChange={(e) =>
                  diceManager.functions.assignDice(
                    index,
                    parseInt(e.target.value),
                    false
                  )
                }
                disabled={!editable}
              >
                <option value="">Select die...</option>
                {diceManager.functions.getSortedDiceOptions
                  .filter(
                    ({ index: diceIndex }) =>
                      !diceManager.functions.isDiceAssigned(diceIndex)
                  )
                  .map(({ value, index: diceIndex }) => (
                    <option key={diceIndex} value={diceIndex}>
                      {value}
                    </option>
                  ))}
              </select>
            )}
            {assignment.diceIndex !== null &&
              assignment.diceIndex !== undefined &&
              editable && (
                <button
                  style={styles.removeButton}
                  onClick={() =>
                    diceManager.functions.unassignDice(index, false)
                  }
                >
                  Remove
                </button>
              )}
          </div>
        </div>

        <div>
          <SkillSelector
            activityText={activityText}
            assignment={assignment}
            isSecondSkill={true}
            onChange={(value) =>
              updateRollAssignment(index, "secondSkill", value)
            }
            canEdit={() => editable}
            selectedCharacter={selectedCharacter}
          />

          <div style={{ marginTop: "0.5rem" }}>
            <label style={styles.label}>Second Die</label>

            {needsExtraDie && editable ? (
              <button
                onClick={() =>
                  diceManager.functions.addExtraDieForActivity(
                    `activity${index + 1}`
                  )
                }
                disabled={!canAddMoreDice}
                style={{
                  ...styles.button,
                  ...styles.secondaryButton,
                  width: "100%",
                  padding: "0.75rem",
                  marginTop: "0.5rem",
                  ...(!canAddMoreDice
                    ? { opacity: 0.6, cursor: "not-allowed" }
                    : {}),
                }}
                title={
                  canAddMoreDice
                    ? "Add an extra die for this dual check activity"
                    : `Maximum extra dice reached (${currentExtraDice}/${totalDualCheckActivities})`
                }
              >
                + Add Extra Die ({currentExtraDice}/{totalDualCheckActivities})
              </button>
            ) : (
              <div>
                {renderDiceValue(assignment, dicePool, true, activity) || (
                  <select
                    style={styles.select}
                    value=""
                    onChange={(e) =>
                      diceManager.functions.assignDice(
                        index,
                        parseInt(e.target.value),
                        true
                      )
                    }
                    disabled={!editable}
                  >
                    <option value="">
                      {diceManager.functions.getSortedDiceOptions.filter(
                        ({ index: diceIndex }) =>
                          !diceManager.functions.isDiceAssigned(diceIndex)
                      ).length === 0
                        ? "No dice available - add extra die above"
                        : "Select die..."}
                    </option>
                    {diceManager.functions.getSortedDiceOptions
                      .filter(
                        ({ index: diceIndex }) =>
                          !diceManager.functions.isDiceAssigned(diceIndex)
                      )
                      .map(({ value, index: diceIndex }) => (
                        <option key={diceIndex} value={diceIndex}>
                          {value}
                        </option>
                      ))}
                  </select>
                )}
                {assignment.secondDiceIndex !== null &&
                  assignment.secondDiceIndex !== undefined &&
                  editable && (
                    <button
                      style={styles.removeButton}
                      onClick={() =>
                        diceManager.functions.unassignDice(index, true)
                      }
                    >
                      Remove
                    </button>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div style={styles.diceAssignment}>
        <div>
          <label style={styles.label}>Primary Die</label>
          {renderDiceValue(assignment, dicePool, false, activity) || (
            <select
              style={styles.select}
              value=""
              onChange={(e) =>
                diceManager.functions.assignDice(
                  index,
                  parseInt(e.target.value),
                  false
                )
              }
              disabled={!editable}
            >
              <option value="">Select die...</option>
              {diceManager.functions.getSortedDiceOptions
                .filter(
                  ({ index: diceIndex }) =>
                    !diceManager.functions.isDiceAssigned(diceIndex)
                )
                .map(({ value, index: diceIndex }) => (
                  <option key={diceIndex} value={diceIndex}>
                    {value}
                  </option>
                ))}
            </select>
          )}
          {assignment.diceIndex !== null &&
            assignment.diceIndex !== undefined &&
            editable && (
              <button
                style={styles.removeButton}
                onClick={() => diceManager.functions.unassignDice(index, false)}
              >
                Remove
              </button>
            )}
        </div>
      </div>
    );
  }
};
