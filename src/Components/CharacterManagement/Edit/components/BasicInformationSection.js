import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { castingStyles } from "../../../../SharedData/data";
import StepIndicator from "../../Shared/StepIndicator";
import { gameSessionOptions } from "../../../../App/const";
import SchoolYearSelector from "../../Shared/SchoolYearSelector";
import OptimizedImageUpload from "../../Shared/OptimizedImageUpload";

const BasicInformationSection = ({
  character,
  handleInputChange,
  calculateHitPoints,
  getCurrentHp,
  isHpManualMode,
  setIsHpManualMode,
  rolledHp,
  setRolledHp,
  rollHp,
  styles,
  theme,
  supabase,
  imageFile,
  setImageFile,
  previewUrl,
  onImageFileChange,
  setPreviewUrl,
}) => {
  const [finalImageUrl, setFinalImageUrl] = useState("");

  const handleImageChange = (file, previewUrl) => {
    if (onImageFileChange) {
      onImageFileChange(file);
    }

    if (previewUrl) {
      handleInputChange("imageUrl", previewUrl);
    } else if (!file) {
      if (!character.imageUrl && !character.image_url) {
        handleInputChange("imageUrl", "");
      }
    }
  };

  const handleUploadComplete = (uploadedUrl) => {
    setFinalImageUrl(uploadedUrl);
    handleInputChange("imageUrl", uploadedUrl);

    if (setImageFile) setImageFile(null);
    if (setPreviewUrl) setPreviewUrl(null);
  };

  return (
    <>
      <StepIndicator step={1} totalSteps={5} label="Basic Information" />

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Character Name *</label>
        <input
          type="text"
          value={character.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter character name..."
          style={styles.input}
          maxLength={50}
        />
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Character Portrait</label>
        <OptimizedImageUpload
          currentImageUrl={character.imageUrl || character.image_url || ""}
          onImageChange={handleImageChange}
          onUploadComplete={handleUploadComplete}
          supabase={supabase}
          theme={theme}
          styles={{
            container: styles.imageUploadContainer,
            wrapper: styles.imageUploadWrapper,
            helpText: styles.helpText,
            error: styles.errorContainer,
          }}
          maxSizeMB={5}
          compressionQuality={0.8}
          maxWidth={600}
          maxHeight={600}
          bucket="character-images"
          folder="new-characters"
          placeholder="Upload character portrait"
          helpText="JPG, PNG, GIF, or WebP • Images are automatically compressed"
          size={120}
        />
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Game Session</label>
        <select
          value={character.gameSession || ""}
          onChange={(e) => handleInputChange("gameSession", e.target.value)}
          style={styles.select}
        >
          <option value="">Select Game Session...</option>
          {gameSessionOptions.map((session) => (
            <option key={session} value={session}>
              {session}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Casting Style</label>
        <select
          value={character.castingStyle || ""}
          onChange={(e) => handleInputChange("castingStyle", e.target.value)}
          style={styles.select}
        >
          <option value="">Select Casting Style...</option>
          {castingStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>

      {character.castingStyle === "Intellect Caster" && (
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Initiative Ability *</label>
          <div style={styles.helpText}>
            As an intellect caster, you may choose to use Intelligence or
            Dexterity for initiative.
            {character.abilityScores &&
              character.abilityScores.dexterity &&
              character.abilityScores.intelligence && (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: theme.primary,
                  }}
                >
                  {Math.floor((character.abilityScores.intelligence - 10) / 2) >
                  Math.floor((character.abilityScores.dexterity - 10) / 2)
                    ? "💡 Intelligence gives a higher modifier"
                    : Math.floor((character.abilityScores.dexterity - 10) / 2) >
                      Math.floor(
                        (character.abilityScores.intelligence - 10) / 2
                      )
                    ? "⚡ Dexterity gives a higher modifier"
                    : "⚖️ Both abilities give the same modifier"}
                </div>
              )}
          </div>
          <div style={styles.level1ChoiceContainer}>
            <label
              style={
                character.initiativeAbility === "dexterity"
                  ? styles.level1ChoiceLabelSelected
                  : styles.level1ChoiceLabel
              }
            >
              <input
                type="radio"
                name="initiativeAbility"
                value="dexterity"
                checked={character.initiativeAbility === "dexterity"}
                onChange={(e) =>
                  handleInputChange("initiativeAbility", e.target.value)
                }
                style={styles.level1ChoiceRadio}
              />
              <span
                style={
                  character.initiativeAbility === "dexterity"
                    ? styles.level1ChoiceTextSelected
                    : styles.level1ChoiceText
                }
              >
                Dexterity (Standard)
                {character.abilityScores &&
                  character.abilityScores.dexterity && (
                    <span
                      style={{
                        color:
                          character.abilityScores.intelligence &&
                          Math.floor(
                            (character.abilityScores.dexterity - 10) / 2
                          ) >
                            Math.floor(
                              (character.abilityScores.intelligence - 10) / 2
                            )
                            ? theme.success
                            : theme.textSecondary,
                        fontWeight:
                          character.abilityScores.intelligence &&
                          Math.floor(
                            (character.abilityScores.dexterity - 10) / 2
                          ) >
                            Math.floor(
                              (character.abilityScores.intelligence - 10) / 2
                            )
                            ? "bold"
                            : "normal",
                        marginLeft: "8px",
                      }}
                    >
                      {Math.floor(
                        (character.abilityScores.dexterity - 10) / 2
                      ) >= 0
                        ? "+"
                        : ""}
                      {Math.floor((character.abilityScores.dexterity - 10) / 2)}
                    </span>
                  )}
              </span>
            </label>
            <label
              style={
                character.initiativeAbility === "intelligence"
                  ? styles.level1ChoiceLabelSelected
                  : styles.level1ChoiceLabel
              }
            >
              <input
                type="radio"
                name="initiativeAbility"
                value="intelligence"
                checked={character.initiativeAbility === "intelligence"}
                onChange={(e) =>
                  handleInputChange("initiativeAbility", e.target.value)
                }
                style={styles.level1ChoiceRadio}
              />
              <span
                style={
                  character.initiativeAbility === "intelligence"
                    ? styles.level1ChoiceTextSelected
                    : styles.level1ChoiceText
                }
              >
                Intelligence (Intellect Caster)
                {character.abilityScores &&
                  character.abilityScores.intelligence && (
                    <span
                      style={{
                        color:
                          character.abilityScores.dexterity &&
                          Math.floor(
                            (character.abilityScores.intelligence - 10) / 2
                          ) >
                            Math.floor(
                              (character.abilityScores.dexterity - 10) / 2
                            )
                            ? theme.success
                            : theme.textSecondary,
                        fontWeight:
                          character.abilityScores.dexterity &&
                          Math.floor(
                            (character.abilityScores.intelligence - 10) / 2
                          ) >
                            Math.floor(
                              (character.abilityScores.dexterity - 10) / 2
                            )
                            ? "bold"
                            : "normal",
                        marginLeft: "8px",
                      }}
                    >
                      {Math.floor(
                        (character.abilityScores.intelligence - 10) / 2
                      ) >= 0
                        ? "+"
                        : ""}
                      {Math.floor(
                        (character.abilityScores.intelligence - 10) / 2
                      )}
                    </span>
                  )}
              </span>
            </label>
          </div>
        </div>
      )}

      <SchoolYearSelector
        schoolYear={character.school_year || character.schoolYear}
        onSchoolYearChange={(value) => handleInputChange("schoolYear", value)}
        level={character.level}
        onLevelChange={(value) => handleInputChange("level", value)}
        styles={styles}
      />

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Hit Points</label>
        {!character.castingStyle ? (
          <div style={styles.skillsPlaceholder}>
            Select a Casting Style first
          </div>
        ) : !character.level ? (
          <div style={styles.skillsPlaceholder}>
            Select a Character Level first
          </div>
        ) : (
          <div style={styles.levelHpGrid}>
            <div style={styles.hpFieldContainer}>
              <div style={styles.hpValueContainer}>
                {isHpManualMode ? (
                  <input
                    type="number"
                    min="1"
                    value={character.hitPoints || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "hitPoints",
                        parseInt(e.target.value) || 1
                      )
                    }
                    placeholder="--"
                    style={styles.hpManualInput}
                  />
                ) : rolledHp !== null ? (
                  <div style={styles.hpRollDisplay}>{rolledHp}</div>
                ) : (
                  <div style={styles.hpDisplay}>
                    {calculateHitPoints({ character })}
                  </div>
                )}
              </div>
            </div>
            {character.castingStyle && (
              <div style={styles.hpControlsContainer}>
                <div style={styles.hpControlsInline}>
                  {!isHpManualMode && (
                    <button
                      onClick={rollHp}
                      style={{
                        ...styles.button,
                        backgroundColor: "#EF4444",
                        fontSize: "12px",
                      }}
                    >
                      <RefreshCw size={14} />
                      Roll
                    </button>
                  )}
                  <div
                    onClick={() => {
                      setIsHpManualMode(!isHpManualMode);
                      setRolledHp(null);
                    }}
                    style={{
                      ...styles.hpToggle,
                      backgroundColor: isHpManualMode
                        ? theme.success
                        : theme.border,
                      borderColor: isHpManualMode
                        ? theme.success
                        : theme.textSecondary,
                    }}
                    title={
                      isHpManualMode
                        ? "Switch to Auto/Roll mode"
                        : "Switch to Manual mode"
                    }
                  >
                    <div
                      style={{
                        ...styles.hpToggleKnob,
                        left: isHpManualMode ? "22px" : "2px",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BasicInformationSection;
