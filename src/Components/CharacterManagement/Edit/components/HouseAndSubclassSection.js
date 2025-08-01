import StepIndicator from "../../Shared/StepIndicator";
import EnhancedSubclassSelector from "./EnhancedSubclassSelectorEdit";
import EnhancedBackgroundSelector from "./EnhancedBackgroundSelectorEdit";
import EnhancedHouseSelector from "./EnhancedHouseSelectorEdit";

const HouseAndSubclassSection = ({
  character,
  handleInputChange,
  selectedHouse,
  handleHouseSelect,
  houseChoices,
  handleHouseChoiceSelect,
  setCharacter,
  styles,
  theme,
}) => {
  return (
    <>
      <StepIndicator step={2} totalSteps={5} label="House Selection" />

      <div style={styles.fieldContainer}>
        <label style={styles.label}>House</label>
        <EnhancedHouseSelector
          selectedHouse={selectedHouse}
          onHouseSelect={handleHouseSelect}
          houseChoices={houseChoices}
          onHouseChoiceSelect={handleHouseChoiceSelect}
        />
      </div>

      <StepIndicator
        step={3}
        totalSteps={5}
        label="Skills & Features & Backgrounds"
      />

      <EnhancedSubclassSelector
        value={character.subclass}
        onChange={(value) => handleInputChange("subclass", value)}
        styles={styles}
        theme={theme}
        disabled={false}
        characterLevel={character.level}
        subclassChoices={(() => {
          return character.subclassChoices || {};
        })()}
        onSubclassChoicesChange={(choices) => {
          setCharacter((prev) => ({ ...prev, subclassChoices: choices }));
        }}
      />

      <EnhancedBackgroundSelector
        value={character.background}
        onChange={(backgroundName) => {
          handleInputChange("background", backgroundName);
        }}
        onCharacterUpdate={(updatedCharacter) => {
          setCharacter(updatedCharacter);
        }}
        character={character}
        disabled={false}
      />
    </>
  );
};

export default HouseAndSubclassSection;
