import React from "react";
import { AlertTriangle } from "lucide-react";
import { useGameSessions } from "../../../../../contexts/GameSessionsContext";
import { useAdmin } from "../../../../../contexts/AdminContext";
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
  const { categorizedSessions } = useGameSessions();
  const { isUserAdmin } = useAdmin();

  // Development sessions are admin-only.
  const visibleSessions = isUserAdmin
    ? categorizedSessions
    : categorizedSessions.filter(({ category }) => category !== "development");
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

            {visibleSessions.map(
              ({ category, label, isCustom, sessions }, index) => (
                <React.Fragment key={category}>
                  {index > 0 && <option disabled>──────────────</option>}
                  <optgroup label={isCustom ? label : `${label} Sessions`}>
                    {sessions.map((session) => (
                      <option key={session} value={session}>
                        {session}
                      </option>
                    ))}
                  </optgroup>
                </React.Fragment>
              )
            )}
          </select>
          <div
            style={{
              ...styles.helpText,
              fontSize: "12px",
              color: theme.textSecondary,
              marginTop: "4px",
            }}
          >
            Choose which campaign group your character will join (optional)
          </div>
          {!character.gameSession && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                marginTop: "8px",
                padding: "10px 12px",
                borderRadius: "6px",
                backgroundColor: theme.background,
                border: `1px solid ${theme.error}`,
                color: theme.text,
                fontSize: "12px",
                lineHeight: 1.4,
              }}
            >
              <AlertTriangle
                size={16}
                style={{ flexShrink: 0, marginTop: "1px" }}
              />
              <span>
                Without a game session, this character's dice rolls won't be
                sent to Discord. Once your character is ready and you plan to
                play with them, you'll need to select a session.
              </span>
            </div>
          )}
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
