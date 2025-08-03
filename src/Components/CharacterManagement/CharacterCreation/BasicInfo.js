import { gameSessionOptions } from "../../../App/const";
import { useTheme } from "../../../contexts/ThemeContext";
import { createCharacterCreationStyles } from "../../../styles/masterStyles";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import SchoolYearSelector from "../Shared/SchoolYearSelector";
import EnhancedCastingStyleSelector from "./EnhancedCastingStyleSelector";
import OptimizedImageUpload from "../Shared/OptimizedImageUpload";

function BasicInfo({
  character,
  isHpManualMode,
  setIsHpManualMode,
  rolledHp,
  setRolledHp,
  rollHp,
  handleInputChange,
  calculateHitPoints,
  supabase,
  imageFile,
  setImageFile,
  previewUrl,
  setPreviewUrl,
}) {
  const { theme } = useTheme();
  const styles = createCharacterCreationStyles(theme);

  const [finalImageUrl, setFinalImageUrl] = useState("");

  const handleSchoolYearChange = (schoolYear) => {
    handleInputChange("schoolYear", schoolYear);
  };

  const handleLevelChange = (level) => {
    handleInputChange("level", level);
  };

  const handleCastingStyleChange = (castingStyle) => {
    handleInputChange("castingStyle", castingStyle);
  };

  const handleImageChange = (file, previewUrl) => {
    if (setImageFile) setImageFile(file);
    if (setPreviewUrl) setPreviewUrl(previewUrl);

    if (previewUrl) {
      handleInputChange("imageUrl", previewUrl);
    } else if (!file) {
      handleInputChange("imageUrl", "");
    }
  };

  const handleUploadComplete = (uploadedUrl) => {
    setFinalImageUrl(uploadedUrl);
    handleInputChange("imageUrl", uploadedUrl);

    if (setImageFile) setImageFile(null);
    if (setPreviewUrl) setPreviewUrl(null);
  };

  const getHitPointsDisplay = () => {
    if (isHpManualMode) {
      return character.hitPoints || 1;
    } else if (rolledHp !== null) {
      return rolledHp;
    } else {
      return calculateHitPoints({ character });
    }
  };

  return (
    <>
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
          currentImageUrl={character.imageUrl || ""}
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
        <div style={styles.helpText}>
          Select which game session your character will join.
        </div>
      </div>

      <SchoolYearSelector
        value={character.schoolYear}
        onChange={handleSchoolYearChange}
        theme={theme}
        styles={styles}
      />

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Starting Level *</label>
        <div style={styles.levelSelectorContainer}>
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => handleLevelChange(level)}
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
              }}
            >
              Level {level}
            </button>
          ))}
        </div>
        <div style={styles.helpText}>
          Choose your character's starting level (1-5).
        </div>
      </div>

      <EnhancedCastingStyleSelector
        value={character.castingStyle}
        onChange={handleCastingStyleChange}
      />

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Hit Points</label>
        <div style={styles.hpContainer}>
          <div style={styles.hpModeSelector}>
            <button
              onClick={() => setIsHpManualMode(false)}
              style={{
                ...styles.hpModeButton,
                backgroundColor: !isHpManualMode
                  ? theme.primary
                  : theme.backgroundSecondary,
                color: !isHpManualMode ? "white" : theme.textSecondary,
              }}
            >
              Average ({calculateHitPoints({ character })})
            </button>
            <button
              onClick={() => {
                if (character.castingStyle) rollHp();
                setIsHpManualMode(false);
              }}
              disabled={!character.castingStyle}
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
                cursor: character.castingStyle ? "pointer" : "not-allowed",
                opacity: character.castingStyle ? 1 : 0.5,
              }}
            >
              <RefreshCw size={14} />
              Roll ({rolledHp || "?"})
            </button>
            <button
              onClick={() => setIsHpManualMode(true)}
              style={{
                ...styles.hpModeButton,
                backgroundColor: isHpManualMode
                  ? theme.warning
                  : theme.backgroundSecondary,
                color: isHpManualMode ? "white" : theme.textSecondary,
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
                const value = parseInt(e.target.value) || 1;
                handleInputChange("hitPoints", Math.max(1, value));
              }}
              min="1"
              max="999"
              style={styles.input}
              placeholder="Enter hit points..."
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
          Choose how to determine your character's hit points. Average is
          recommended for most players.
        </div>
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Initiative Ability</label>
        <select
          value={character.initiativeAbility || "dexterity"}
          onChange={(e) =>
            handleInputChange("initiativeAbility", e.target.value)
          }
          style={styles.select}
        >
          <option value="dexterity">Dexterity (Default)</option>
          <option value="intelligence">Intelligence</option>
          <option value="wisdom">Wisdom</option>
          <option value="charisma">Charisma</option>
        </select>
        <div style={styles.helpText}>
          Choose which ability score to use for initiative rolls. Most
          characters use Dexterity.
        </div>
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Wand Type</label>
        <input
          type="text"
          value={character.wandType || ""}
          onChange={(e) => handleInputChange("wandType", e.target.value)}
          placeholder="Enter wand description..."
          style={styles.input}
          maxLength={100}
        />
        <div style={styles.helpText}>
          Describe your character's wand (wood type, core, length, etc.). This
          is for flavor and roleplay.
        </div>
      </div>
    </>
  );
}

export default BasicInfo;
