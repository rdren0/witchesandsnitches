import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
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
  onImageFileChange,
  isLocked = false,
}) => {
  const [finalImageUrl, setFinalImageUrl] = useState("");

  const currentImageUrl = character.imageUrl || character.image_url || "";

  const handleImageChange = (file, previewUrl) => {
    console.log(
      "Image file changed in BasicInformationSection:",
      file?.name || "removed"
    );

    if (onImageFileChange) {
      onImageFileChange(file);
    }

    if (previewUrl) {
      handleInputChange("imageUrl", previewUrl);
    } else if (!file) {
      handleInputChange("imageUrl", currentImageUrl);
    }
  };

  const handleUploadComplete = (uploadedUrl) => {
    console.log("Image upload completed:", uploadedUrl);

    setFinalImageUrl(uploadedUrl);
    handleInputChange("imageUrl", uploadedUrl);

    if (onImageFileChange) {
      onImageFileChange(null);
    }
  };

  const getHitPointsDisplay = () => {
    if (isHpManualMode) {
      return character.hitPoints || 1;
    } else if (rolledHp !== null) {
      return rolledHp;
    } else {
      return calculateHitPoints();
    }
  };

  return (
    <>
      {!isLocked && (
        <StepIndicator step={1} totalSteps={5} label="Basic Information" />
      )}

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Character Name *</label>
        <input
          type="text"
          value={character.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter character name..."
          style={{
            ...styles.input,
            opacity: isLocked ? 0.6 : 1,
            cursor: isLocked ? "not-allowed" : "text",
          }}
          maxLength={50}
          disabled={isLocked}
        />
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Character Portrait</label>
        <OptimizedImageUpload
          currentImageUrl={currentImageUrl}
          onImageChange={handleImageChange}
          onUploadComplete={handleUploadComplete}
          supabase={supabase}
          theme={theme}
          disabled={isLocked}
          styles={{
            container: styles.imageUploadContainer,
            wrapper: styles.imageUploadWrapper,
            helpText: styles.helpText,
            error: styles.errorContainer,
          }}
          maxSizeMB={5}
          compressionQuality={0.8}
          maxWidth={400}
          maxHeight={400}
          bucket="character-images"
          folder="portraits"
          placeholder="Upload character portrait"
          helpText={
            isLocked
              ? "Section is locked - unlock to change image"
              : "JPG, PNG, GIF, or WebP • Images are automatically compressed"
          }
          size={120}
        />
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Game Session</label>
        <select
          value={character.gameSession || ""}
          onChange={(e) => handleInputChange("gameSession", e.target.value)}
          style={{
            ...styles.select,
            opacity: isLocked ? 0.6 : 1,
            cursor: isLocked ? "not-allowed" : "pointer",
          }}
          disabled={isLocked}
        >
          <option value="">Select Game Session...</option>
          {gameSessionOptions.map((session) => (
            <option key={session} value={session}>
              {session}
            </option>
          ))}
        </select>
        <div style={styles.helpText}>
          Select which game session your character will join.
        </div>
      </div>

      <SchoolYearSelector
        value={character.schoolYear}
        onChange={(schoolYear) => handleInputChange("schoolYear", schoolYear)}
        theme={theme}
        styles={styles}
        disabled={isLocked}
      />

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Level *</label>
        <div style={styles.levelSelectorContainer}>
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => !isLocked && handleInputChange("level", level)}
              disabled={isLocked}
              style={{
                ...styles.levelButton,
                backgroundColor:
                  character.level === level
                    ? theme.primary
                    : theme.backgroundSecondary,
                color:
                  character.level === level ? "white" : theme.textSecondary,
                border: `2px solid ${
                  character.level === level ? theme.primary : theme.border
                }`,
                opacity: isLocked ? 0.6 : 1,
                cursor: isLocked ? "not-allowed" : "pointer",
              }}
            >
              Level {level}
            </button>
          ))}
        </div>
        <div style={styles.helpText}>
          Character level determines available features and spell slots.
        </div>
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Casting Style *</label>
        <select
          value={character.castingStyle || ""}
          onChange={(e) => handleInputChange("castingStyle", e.target.value)}
          style={{
            ...styles.select,
            opacity: isLocked ? 0.6 : 1,
            cursor: isLocked ? "not-allowed" : "pointer",
          }}
          disabled={isLocked}
        >
          <option value="">Select Casting Style...</option>
          {Object.entries(castingStyles).map(([key, style]) => (
            <option key={key} value={key}>
              {style.name}
            </option>
          ))}
        </select>
        <div style={styles.helpText}>
          Your casting style determines your spellcasting abilities and hit
          points.
        </div>
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Hit Points</label>
        <div style={styles.hpContainer}>
          <div style={styles.hpModeSelector}>
            <button
              onClick={() => !isLocked && setIsHpManualMode(false)}
              disabled={isLocked}
              style={{
                ...styles.hpModeButton,
                backgroundColor: !isHpManualMode
                  ? theme.primary
                  : theme.backgroundSecondary,
                color: !isHpManualMode ? "white" : theme.textSecondary,
                opacity: isLocked ? 0.6 : 1,
                cursor: isLocked ? "not-allowed" : "pointer",
              }}
            >
              Average ({calculateHitPoints()})
            </button>
            <button
              onClick={() => {
                if (!isLocked && character.castingStyle) {
                  rollHp();
                  setIsHpManualMode(false);
                }
              }}
              disabled={!character.castingStyle || isLocked}
              style={{
                ...styles.hpModeButton,
                backgroundColor:
                  rolledHp !== null && !isHpManualMode
                    ? theme.success
                    : theme.backgroundSecondary,
                color:
                  rolledHp !== null && !isHpManualMode
                    ? "white"
                    : theme.textSecondary,
                cursor:
                  character.castingStyle && !isLocked
                    ? "pointer"
                    : "not-allowed",
                opacity: character.castingStyle && !isLocked ? 1 : 0.5,
              }}
            >
              <RefreshCw size={14} />
              Roll ({rolledHp || "?"})
            </button>
            <button
              onClick={() => !isLocked && setIsHpManualMode(true)}
              disabled={isLocked}
              style={{
                ...styles.hpModeButton,
                backgroundColor: isHpManualMode
                  ? theme.warning
                  : theme.backgroundSecondary,
                color: isHpManualMode ? "white" : theme.textSecondary,
                opacity: isLocked ? 0.6 : 1,
                cursor: isLocked ? "not-allowed" : "pointer",
              }}
            >
              Manual
            </button>
          </div>

          {isHpManualMode && (
            <input
              type="number"
              value={character.hitPoints || ""}
              onChange={(e) => {
                if (!isLocked) {
                  const value = parseInt(e.target.value) || 1;
                  handleInputChange("hitPoints", Math.max(1, value));
                }
              }}
              min="1"
              max="999"
              style={{
                ...styles.input,
                opacity: isLocked ? 0.6 : 1,
                cursor: isLocked ? "not-allowed" : "text",
              }}
              placeholder="Enter hit points..."
              disabled={isLocked}
            />
          )}

          <div
            style={{
              ...styles.hpDisplay,
              backgroundColor:
                isHpManualMode && character.hitPoints
                  ? `${theme.warning}20`
                  : rolledHp !== null && !isHpManualMode
                  ? `${theme.success}20`
                  : `${theme.primary}20`,
              border: `2px solid ${
                isHpManualMode && character.hitPoints
                  ? theme.warning
                  : rolledHp !== null && !isHpManualMode
                  ? theme.success
                  : theme.primary
              }`,
            }}
          >
            <span style={styles.hpValue}>{getHitPointsDisplay()}</span>
            <span style={styles.hpLabel}>
              {isHpManualMode
                ? "Manual HP"
                : rolledHp !== null
                ? "Rolled HP"
                : "Average HP"}
            </span>
          </div>
        </div>

        <div style={styles.helpText}>
          Current hit points. You can use average, roll for random, or set
          manually.
        </div>
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Initiative Ability</label>
        <select
          value={character.initiativeAbility || "dexterity"}
          onChange={(e) =>
            handleInputChange("initiativeAbility", e.target.value)
          }
          style={{
            ...styles.select,
            opacity: isLocked ? 0.6 : 1,
            cursor: isLocked ? "not-allowed" : "pointer",
          }}
          disabled={isLocked}
        >
          <option value="dexterity">Dexterity (Default)</option>
          <option value="intelligence">Intelligence</option>
          <option value="wisdom">Wisdom</option>
          <option value="charisma">Charisma</option>
        </select>
        <div style={styles.helpText}>
          Which ability score to use for initiative rolls.
        </div>
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Wand Type</label>
        <input
          type="text"
          value={character.wandType || ""}
          onChange={(e) => handleInputChange("wandType", e.target.value)}
          placeholder="Enter wand description..."
          style={{
            ...styles.input,
            opacity: isLocked ? 0.6 : 1,
            cursor: isLocked ? "not-allowed" : "text",
          }}
          maxLength={100}
          disabled={isLocked}
        />
        <div style={styles.helpText}>
          Describe your character's wand (wood type, core, length, etc.).
        </div>
      </div>
    </>
  );
};

export default BasicInformationSection;
