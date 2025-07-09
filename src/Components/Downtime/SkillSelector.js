import React, { memo, useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getActivitySkillInfo, calculateModifier } from "./downtimeHelpers";
import { allSkills } from "../../SharedData/data";
import { wandModifiers } from "../../SharedData/downtime";

const SkillSelector = memo(
  ({
    activityText,
    assignment,
    isSecondSkill = false,
    onChange,
    canEdit,
    selectedCharacter,
  }) => {
    const { theme } = useTheme();

    const currentValue = isSecondSkill
      ? assignment?.secondSkill || assignment?.secondWandModifier || ""
      : assignment?.skill || assignment?.wandModifier || "";

    const choiceInfo = useMemo(
      () => getActivitySkillInfo(activityText),
      [activityText]
    );

    const styles = useMemo(
      () => ({
        container: {
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        },
        label: {
          fontSize: "14px",
          fontWeight: "600",
          color: theme.text,
        },
        select: {
          width: "100%",
          padding: "8px 12px",
          backgroundColor: theme.surface,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          borderRadius: "6px",
          fontSize: "14px",
          cursor: canEdit() ? "pointer" : "not-allowed",
          height: "42px",
        },
        autoSelected: {
          backgroundColor: theme.background,
          border: `1px solid ${theme.border}`,
          borderRadius: "6px",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "42px",
        },
        badge: {
          fontSize: "11px",
          padding: "2px 6px",
          borderRadius: "4px",
          fontWeight: "500",
        },
      }),
      [theme, canEdit]
    );

    const formatModifier = (value) => {
      return value >= 0 ? `+${value}` : `${value}`;
    };

    if (choiceInfo.type === "locked" && choiceInfo.skills) {
      const autoSkill = isSecondSkill
        ? choiceInfo.skills[1]
        : choiceInfo.skills[0];
      if (!autoSkill) return null;

      const modifier = calculateModifier(autoSkill, selectedCharacter);
      const displayName =
        allSkills.find((s) => s.name === autoSkill)?.displayName || autoSkill;

      return (
        <div style={styles.container}>
          <label style={styles.label}>Skill/Modifier:</label>
          <div style={styles.autoSelected}>
            <span style={{ fontSize: "14px" }}>
              {displayName} ({formatModifier(modifier)})
            </span>
            <span
              style={{
                ...styles.badge,
                backgroundColor: `${theme.primary}20`,
                color: theme.primary,
              }}
            >
              Auto-selected
            </span>
          </div>
        </div>
      );
    }

    const handleChange = (e) => {
      onChange(e.target.value);
    };

    const renderOptions = () => {
      if (choiceInfo.type === "limited" && choiceInfo.skills) {
        const availableSkills = allSkills.filter((skill) =>
          choiceInfo.skills.includes(skill.name)
        );

        return (
          <>
            <option value="">Choose from allowed skills...</option>
            <optgroup label="Allowed Skills for this Activity">
              {availableSkills
                .sort((a, b) => a.displayName.localeCompare(b.displayName))
                .map((skill) => {
                  const modifier = calculateModifier(
                    skill.name,
                    selectedCharacter
                  );
                  return (
                    <option key={skill.name} value={skill.name}>
                      {skill.displayName} ({formatModifier(modifier)})
                    </option>
                  );
                })}
            </optgroup>
          </>
        );
      }

      if (choiceInfo.type === "suggested" && choiceInfo.skills) {
        const suggestedSkills = allSkills.filter((skill) =>
          choiceInfo.skills.includes(skill.name)
        );
        const otherSkills = allSkills.filter(
          (skill) => !choiceInfo.skills.includes(skill.name)
        );

        return (
          <>
            <option value="">Select modifier...</option>
            <optgroup label="⭐ Suggested Skills">
              {suggestedSkills
                .sort((a, b) => a.displayName.localeCompare(b.displayName))
                .map((skill) => {
                  const modifier = calculateModifier(
                    skill.name,
                    selectedCharacter
                  );
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
                  const modifier = calculateModifier(
                    skill.name,
                    selectedCharacter
                  );
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
                  const modifier =
                    selectedCharacter?.magicModifiers?.[wand.name] || 0;
                  return (
                    <option key={wand.name} value={wand.name}>
                      {wand.displayName} ({formatModifier(modifier)})
                    </option>
                  );
                })}
            </optgroup>
          </>
        );
      }

      return (
        <>
          <option value="">Select modifier...</option>
          <optgroup label="Skills">
            {allSkills
              .sort((a, b) => a.displayName.localeCompare(b.displayName))
              .map((skill) => {
                const modifier = calculateModifier(
                  skill.name,
                  selectedCharacter
                );
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
                const modifier =
                  selectedCharacter?.magicModifiers?.[wand.name] || 0;
                return (
                  <option key={wand.name} value={wand.name}>
                    {wand.displayName} ({formatModifier(modifier)})
                  </option>
                );
              })}
          </optgroup>
        </>
      );
    };

    return (
      <div style={styles.container}>
        <label style={styles.label}>Skill/Modifier:</label>
        <div style={{ position: "relative" }}>
          <select
            value={currentValue}
            onChange={handleChange}
            style={styles.select}
            disabled={!canEdit()}
          >
            {renderOptions()}
          </select>

          {choiceInfo.type === "suggested" && (
            <div
              style={{
                position: "absolute",
                top: "-8px",
                right: "8px",
                ...styles.badge,
                backgroundColor: `${theme.info || "#3b82f6"}20`,
                color: theme.info || "#3b82f6",
              }}
            >
              Suggested
            </div>
          )}

          {choiceInfo.type === "limited" && (
            <div
              style={{
                position: "absolute",
                top: "-8px",
                right: "8px",
                ...styles.badge,
                backgroundColor: `${theme.warning || "#f59e0b"}20`,
                color: theme.warning || "#f59e0b",
              }}
            >
              Limited Choice ({choiceInfo.skills?.length || 0})
            </div>
          )}
        </div>
      </div>
    );
  }
);

SkillSelector.displayName = "SkillSelector";

export default SkillSelector;
