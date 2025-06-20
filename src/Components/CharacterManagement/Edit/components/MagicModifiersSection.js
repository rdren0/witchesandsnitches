import StepIndicator from "../../Shared/StepIndicator";

const MagicModifiersSection = ({
  character,
  handleInputChange,
  magicModifierTempValues,
  setMagicModifierTempValues,
  styles,
  theme,
}) => {
  return (
    <>
      <StepIndicator step={5} totalSteps={5} label="Wand Modifiers" />

      <div style={styles.fieldContainer}>
        <h3 style={styles.skillsHeader}>Magic Subject Modifiers</h3>
        <div style={styles.helpText}>
          Enter your wand's bonuses/penalties for each subject of magic (The DM
          will provide these values)
        </div>
        <div style={styles.magicModifiersGrid}>
          {[
            { key: "divinations", label: "Divinations" },
            { key: "charms", label: "Charms" },
            { key: "transfiguration", label: "Transfiguration" },
            { key: "healing", label: "Healing" },
            { key: "jinxesHexesCurses", label: "JHC" },
          ].map(({ key, label }) => (
            <div key={key} style={styles.magicModifierItem}>
              <label style={styles.magicModifierLabel}>{label}</label>
              <input
                type="number"
                value={
                  magicModifierTempValues.hasOwnProperty(key)
                    ? magicModifierTempValues[key]
                    : (character.magicModifiers || {})[key] || 0
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setMagicModifierTempValues((prev) => ({
                    ...prev,
                    [key]: value,
                  }));
                }}
                onBlur={() => {
                  const tempValue = magicModifierTempValues[key];
                  if (tempValue !== undefined) {
                    const numValue =
                      tempValue === "" || tempValue === "-"
                        ? 0
                        : parseInt(tempValue, 10);
                    const finalValue = isNaN(numValue) ? 0 : numValue;
                    handleInputChange(`magicModifiers.${key}`, finalValue);
                    setMagicModifierTempValues((prev) => {
                      const newState = { ...prev };
                      delete newState[key];
                      return newState;
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.target.blur();
                  }
                }}
                style={styles.magicModifierInput}
                min="-99"
                max="99"
                step="1"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MagicModifiersSection;
