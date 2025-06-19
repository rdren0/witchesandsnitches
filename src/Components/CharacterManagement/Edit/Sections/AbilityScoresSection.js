import { Lock, Unlock } from "lucide-react";
import StepIndicator from "../../Shared/StepIndicator";
import AbilityScorePicker from "../../Create/Steps/AbilityScorePicker";

const AbilityScoresSection = ({
  character,
  setCharacter,
  lockedFields,
  toggleFieldLock,
  allStatsAssigned,
  assignStat,
  availableStats,
  clearStat,
  houseChoices,
  isManualMode,
  setIsManualMode,
  rolledStats,
  setRolledStats,
  setAvailableStats,
  tempInputValues,
  setTempInputValues,
  styles,
}) => {
  return (
    <>
      <StepIndicator step={4} totalSteps={5} label="Ability Scores" />

      <div style={styles.fieldContainer}>
        <div style={styles.lockedFieldHeader}>
          <h3 style={styles.skillsHeader}>
            Ability Scores
            {lockedFields.abilityScores && (
              <span style={styles.lockedBadge}>
                <Lock size={12} />
                Locked
              </span>
            )}
            <div style={styles.lockedFieldInfo}>
              Ability scores are locked. Use the unlock button to modify them.
            </div>
          </h3>

          <button
            onClick={() => toggleFieldLock("abilityScores")}
            style={{
              ...styles.lockButton,
              backgroundColor: lockedFields.abilityScores
                ? "#ef4444"
                : "#10b981",
            }}
          >
            {lockedFields.abilityScores ? (
              <Unlock size={14} />
            ) : (
              <Lock size={14} />
            )}
            {lockedFields.abilityScores ? "Unlock" : "Lock"}
          </button>
        </div>
        {lockedFields.abilityScores ? (
          <div style={styles.lockedAbilityScores}>
            {Object.entries(character.abilityScores || {}).map(
              ([ability, score]) => (
                <div key={ability} style={styles.lockedAbilityScore}>
                  <span style={styles.abilityName}>
                    {ability.charAt(0).toUpperCase() + ability.slice(1)}:
                  </span>
                  <span style={styles.abilityValue}>{score || 0}</span>
                </div>
              )
            )}
          </div>
        ) : (
          <AbilityScorePicker
            allStatsAssigned={allStatsAssigned}
            assignStat={assignStat}
            availableStats={availableStats}
            character={character}
            clearStat={clearStat}
            featChoices={character.featChoices || {}}
            houseChoices={character.houseChoices || houseChoices}
            isEditing={true}
            isManualMode={isManualMode}
            rollAllStats={() => {}}
            rolledStats={rolledStats}
            showModifiers={true}
            setAvailableStats={setAvailableStats}
            setCharacter={setCharacter}
            setIsManualMode={setIsManualMode}
            setRolledStats={setRolledStats}
            setTempInputValues={setTempInputValues}
            tempInputValues={tempInputValues}
          />
        )}
      </div>
    </>
  );
};

export default AbilityScoresSection;
