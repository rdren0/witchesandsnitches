import React from "react";
import { gameSessionGroups } from "../../../../../App/const";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { createCharacterCreationStyles } from "../../../../../utils/styles/masterStyles";
import OptimizedImageUpload from "./OptimizedImageUpload";
import SchoolYearSelector from "./SchoolYearSelector";
import EnhancedCastingStyleSelector from "./EnhancedCastingStyleSelector";

const BasicInfoSection = ({
  character,
  onChange,
  errors = {},
  mode = "create",
  disabled = false,
  supabase,
}) => {
  const { theme } = useTheme();
  const styles = createCharacterCreationStyles(theme);

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

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
    if (previewUrl) {
      handleInputChange("imageUrl", previewUrl);
    } else if (!file) {
      handleInputChange("imageUrl", "");
    }
  };

  const onUploadComplete = (url) => {
    handleInputChange("imageUrl", url);
  };

  return (
    <>
      <div style={styles.fieldContainer}>
        <label style={styles.label}>Character Name *</label>
        <input
          type="text"
          value={character.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter your character's name..."
          style={{
            ...styles.input,
            opacity: disabled ? 0.6 : 1,
            pointerEvents: disabled ? "none" : "auto",
          }}
          maxLength={50}
          disabled={disabled}
        />
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Character Portrait</label>
        <OptimizedImageUpload
          currentImageUrl={character.imageUrl || ""}
          onImageChange={handleImageChange}
          onUploadComplete={onUploadComplete}
          supabase={supabase}
          theme={theme}
          disabled={disabled}
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
        <div
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: theme.background,
            opacity: disabled ? 0.6 : 1,
            pointerEvents: disabled ? "none" : "auto",
          }}
        >
          <label style={styles.label}>Game Session</label>
          <select
            value={character.gameSession || ""}
            onChange={(e) => handleInputChange("gameSession", e.target.value)}
            style={{
              ...styles.select,
              width: "100%",
            }}
            disabled={disabled}
          >
            <option value="">Select Game Session...</option>

            <optgroup label="Haunting Sessions">
              {gameSessionGroups.haunting.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </optgroup>

            <option disabled>──────────</option>

            <optgroup label="Knights Sessions">
              {gameSessionGroups.knights.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </optgroup>

            <option disabled>──────────</option>

            <optgroup label="Other Sessions">
              {gameSessionGroups.other.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </optgroup>

            <option disabled>──────────</option>

            {gameSessionGroups.development.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
          <div
            style={{
              ...styles.helpText,
              fontSize: "12px",
              color: theme.textSecondary,
              marginTop: "4px",
            }}
          >
            Choose which campaign group your character will join
          </div>
        </div>
      </div>

      <SchoolYearSelector
        schoolYear={character.schoolYear}
        onSchoolYearChange={handleSchoolYearChange}
        level={character.level}
        onLevelChange={handleLevelChange}
        styles={styles}
        disabled={disabled}
      />

      <div
        style={{
          ...styles.fieldContainer,
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        <EnhancedCastingStyleSelector
          selectedStyle={character.castingStyle || ""}
          onStyleChange={handleCastingStyleChange}
          required={true}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default BasicInfoSection;
