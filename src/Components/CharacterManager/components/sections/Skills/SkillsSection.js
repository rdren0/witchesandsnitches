import React from "react";
import {
  getAvailableSkillsForCastingStyle,
  organizeSkillsBySource,
  hasSkillProficiency,
  hasSkillExpertise,
  calculateSkillModifier,
  getAllCharacterSkills,
  parseFeatSkills,
} from "./skillsUtils";
import { createBackgroundStyles } from "../../../../../utils/styles/masterStyles";
import { useTheme } from "../../../../../contexts/ThemeContext";

const SkillsSection = ({ character, onChange, disabled = false }) => {
  const { theme } = useTheme();
  const styles = createBackgroundStyles(theme);

  const toSentenceCase = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const availableCastingSkills = getAvailableSkillsForCastingStyle(
    character.castingStyle
  );
  const skillsData = organizeSkillsBySource(character);

  const {
    selectedCastingStyleSkills,
    backgroundSkills,
    innateHeritageSkills,
    subclassSkills,
  } = skillsData;

  const featSkills = skillsData.featSkills || parseFeatSkills(character);

  const allSkills = getAllCharacterSkills(character);
  const totalSkills = allSkills.length;

  const handleSkillToggle = (skill) => {
    if (disabled) return;

    const currentSkills = character.skillProficiencies || [];
    const isCurrentlySelected = currentSkills.includes(skill);

    const isFromCastingStyle = availableCastingSkills.includes(skill);
    const isFromOtherSource =
      backgroundSkills.includes(skill) ||
      innateHeritageSkills.includes(skill) ||
      subclassSkills.includes(skill) ||
      featSkills.includes(skill);

    if (isFromOtherSource) {
      return;
    }

    if (isCurrentlySelected) {
      const newSkills = currentSkills.filter((s) => s !== skill);
      onChange("skillProficiencies", newSkills);
    } else {
      if (isFromCastingStyle && selectedCastingStyleSkills.length >= 2) {
        return;
      }

      const newSkills = [...currentSkills, skill];
      onChange("skillProficiencies", newSkills);
    }
  };

  const SkillBox = ({
    skill,
    isSelected,
    isAutomatic,
    sourceType,
    canToggle = true,
    showModifier = false,
  }) => {
    const modifier = showModifier
      ? calculateSkillModifier(character, skill)
      : null;
    const hasExpertiseSkill = hasSkillExpertise(character, skill);

    const getSourceStyle = () => {
      switch (sourceType) {
        case "background":
          return {
            backgroundColor: "#f59e0b20",
            borderColor: "#f59e0b",
            textColor: "#f59e0b",
            label: "B",
          };
        case "heritage":
          return {
            backgroundColor: "#8b5cf620",
            borderColor: "#8b5cf6",
            textColor: "#8b5cf6",
            label: "H",
          };
        case "subclass":
          return {
            backgroundColor: "#06b6d420",
            borderColor: "#06b6d4",
            textColor: "#06b6d4",
            label: "S",
          };
        case "feat":
          return {
            backgroundColor: "#ec489920",
            borderColor: "#ec4899",
            textColor: "#ec4899",
            label: "F",
          };
        default:
          return {
            backgroundColor: isSelected ? `${theme.success}20` : theme.surface,
            borderColor: isSelected ? theme.success : theme.border,
            textColor: isSelected ? theme.success : theme.text,
            label: null,
          };
      }
    };

    const sourceStyle = getSourceStyle();

    if (isAutomatic || sourceType !== null) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: sourceStyle.backgroundColor,
            border: `2px solid ${sourceStyle.borderColor}`,
            cursor: "default",
            fontSize: "14px",
            minHeight: "40px",
            maxWidth: "540px",
          }}
        >
          {sourceStyle.label && (
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: sourceStyle.borderColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "8px",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                {sourceStyle.label}
              </span>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontSize: "14px",
                color: sourceStyle.textColor,
                fontWeight: "600",
              }}
            >
              {toSentenceCase(skill)}
              {hasExpertiseSkill && (
                <span style={{ marginLeft: "4px" }}>★</span>
              )}
              {sourceType && !isAutomatic && (
                <span
                  style={{
                    fontSize: "10px",
                    color: sourceStyle.textColor,
                    opacity: 0.7,
                    marginLeft: "4px",
                  }}
                >
                  From {sourceType}
                </span>
              )}
            </span>
          </div>
          {modifier && (
            <span style={{ fontSize: "12px", color: sourceStyle.textColor }}>
              {modifier}
            </span>
          )}
        </div>
      );
    }

    const canSelect = availableCastingSkills.includes(skill)
      ? selectedCastingStyleSkills.length < 2 || isSelected
      : true;

    const isDisabledDueToSource = sourceType !== null;

    return (
      <label
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor:
            canSelect && canToggle && !isDisabledDueToSource
              ? "pointer"
              : "not-allowed",
          backgroundColor: sourceStyle.backgroundColor,
          border: `2px solid ${sourceStyle.borderColor}`,
          opacity: canSelect && canToggle && !isDisabledDueToSource ? 1 : 0.5,
          fontSize: "14px",
          minHeight: "40px",
          transition: "all 0.2s ease",
          position: "relative",
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() =>
            canSelect &&
            canToggle &&
            !isDisabledDueToSource &&
            handleSkillToggle(skill)
          }
          disabled={!canSelect || !canToggle || isDisabledDueToSource}
          style={{
            marginRight: "8px",
            accentColor: theme.primary,
          }}
        />
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontSize: "14px",
              color: sourceStyle.textColor,
              fontWeight: isSelected ? "600" : "normal",
            }}
          >
            {toSentenceCase(skill)}
            {hasExpertiseSkill && <span style={{ marginLeft: "4px" }}>★</span>}
            {sourceType && (
              <span
                style={{
                  fontSize: "10px",
                  color: sourceStyle.textColor,
                  opacity: 0.7,
                  marginLeft: "4px",
                }}
              >
                From {sourceType}
              </span>
            )}
          </span>
        </div>
        {modifier && (
          <span style={{ fontSize: "12px", color: theme.textSecondary }}>
            {modifier}
          </span>
        )}
      </label>
    );
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          maxHeight: "800px",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "4px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: theme.text,
            marginBottom: "16px",
            margin: "0 0 16px 0",
          }}
        >
          Skill Proficiencies ({totalSkills} total)
        </h3>

        {backgroundSkills.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#f59e0b",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Background Skills (Automatic)
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              {backgroundSkills.map((skill) => (
                <SkillBox
                  key={`bg-${skill}`}
                  skill={skill}
                  isSelected={true}
                  isAutomatic={true}
                  sourceType="background"
                  canToggle={false}
                />
              ))}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                fontStyle: "italic",
              }}
            >
              These skills are automatically granted by your background choice.
            </div>
          </div>
        )}

        {innateHeritageSkills.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#8b5cf6",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Heritage Skills (Automatic)
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              {innateHeritageSkills.map((skill) => (
                <SkillBox
                  key={`heritage-${skill}`}
                  skill={skill}
                  isSelected={true}
                  isAutomatic={true}
                  sourceType="heritage"
                  canToggle={false}
                />
              ))}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                fontStyle: "italic",
              }}
            >
              These skills are automatically granted by your heritage choice.
            </div>
          </div>
        )}

        {subclassSkills.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#06b6d4",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Subclass Skills (Automatic)
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              {subclassSkills.map((skill) => (
                <SkillBox
                  key={`subclass-${skill}`}
                  skill={skill}
                  isSelected={true}
                  isAutomatic={true}
                  sourceType="subclass"
                  canToggle={false}
                />
              ))}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                fontStyle: "italic",
              }}
            >
              These skills are automatically granted by your subclass choice.
            </div>
          </div>
        )}

        {featSkills.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#ec4899",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Feat Skills (Automatic)
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              {featSkills.map((skill) => (
                <SkillBox
                  key={`feat-${skill}`}
                  skill={skill}
                  isSelected={true}
                  isAutomatic={true}
                  sourceType="feat"
                  canToggle={false}
                />
              ))}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                fontStyle: "italic",
              }}
            >
              These skills are automatically granted by your selected feats.
            </div>
          </div>
        )}

        {character.castingStyle ? (
          <div style={{ marginBottom: "16px" }}>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: theme.text,
                marginBottom: "8px",
              }}
            >
              {character.castingStyle} Skills (
              {selectedCastingStyleSkills.length}/2 selected) *
            </h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              {availableCastingSkills.map((skill) => {
                const isSelected = hasSkillProficiency(character, skill);

                const skillRegex = new RegExp(
                  `^${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                  "i"
                );
                const isInSkillArray = (arr) =>
                  arr.some((s) => skillRegex.test(s));

                let sourceType = null;
                if (isInSkillArray(backgroundSkills)) sourceType = "background";
                else if (isInSkillArray(innateHeritageSkills))
                  sourceType = "heritage";
                else if (isInSkillArray(subclassSkills))
                  sourceType = "subclass";
                else if (isInSkillArray(featSkills)) sourceType = "feat";

                return (
                  <SkillBox
                    key={`cs-${skill}`}
                    skill={skill}
                    isSelected={isSelected}
                    isAutomatic={sourceType !== null}
                    sourceType={sourceType}
                    canToggle={!disabled && sourceType === null}
                  />
                );
              })}
            </div>

            {selectedCastingStyleSkills.length === 2 && (
              <div
                style={{
                  backgroundColor: `${theme.success}20`,
                  border: `1px solid ${theme.success}`,
                  borderRadius: "6px",
                  padding: "8px 12px",
                  color: theme.success,
                  fontSize: "12px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                ✓ Casting style skill selection complete! You've chosen your 2
                skills.
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: `${theme.warning}20`,
              border: `1px solid ${theme.warning}`,
              borderRadius: "8px",
              padding: "12px 16px",
              color: theme.warning,
              textAlign: "center",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            Please select a Casting Style first to see available skills.
          </div>
        )}

        {character.castingStyle && (
          <div
            style={{
              fontSize: "12px",
              color: theme.textSecondary,
              padding: "8px",
              backgroundColor: theme.surface,
              borderRadius: "4px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <strong>Total Skills:</strong> {totalSkills} (
            {backgroundSkills.length > 0 &&
              `${backgroundSkills.length} from background`}
            {backgroundSkills.length > 0 &&
              innateHeritageSkills.length > 0 &&
              ", "}
            {innateHeritageSkills.length > 0 &&
              `${innateHeritageSkills.length} from heritage`}
            {(backgroundSkills.length > 0 || innateHeritageSkills.length > 0) &&
              subclassSkills.length > 0 &&
              ", "}
            {subclassSkills.length > 0 &&
              `${subclassSkills.length} from subclass`}
            {(backgroundSkills.length > 0 ||
              innateHeritageSkills.length > 0 ||
              subclassSkills.length > 0) &&
              featSkills.length > 0 &&
              ", "}
            {featSkills.length > 0 && `${featSkills.length} from feats`}
            {(backgroundSkills.length > 0 ||
              innateHeritageSkills.length > 0 ||
              subclassSkills.length > 0 ||
              featSkills.length > 0) &&
              selectedCastingStyleSkills.length > 0 &&
              ", "}
            {selectedCastingStyleSkills.length > 0 &&
              `${selectedCastingStyleSkills.length} from casting style`}
            )
          </div>
        )}

        <div
          style={{
            fontSize: "12px",
            color: theme.textSecondary,
            marginTop: "12px",
            fontStyle: "italic",
          }}
        >
          {character.castingStyle
            ? `Select 2 skills from your ${character.castingStyle} casting style. Skills from other sources (background, heritage, subclass) are automatically added.`
            : "Choose a casting style to unlock skill selection options."}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
