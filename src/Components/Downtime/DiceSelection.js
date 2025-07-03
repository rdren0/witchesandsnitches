import { useAdmin } from "../../contexts/AdminContext";
import { useTheme } from "../../contexts/ThemeContext";
import { getDowntimeStyles } from "../../styles/masterStyles";

const DiceSelection = ({
  assignment,
  isSecondDie = false,
  label = "Dice",
  skillModifier = 0,
  skillName = "",
  dicePool,
  rollAssignments,
  formatModifier,
  unassignDice,
  canEdit,
  assignDice,
  getSortedDiceOptions,
  getDiceUsage,
}) => {
  const { adminMode } = useAdmin();
  const { theme } = useTheme();
  const styles = getDowntimeStyles(theme);

  const assignmentData = rollAssignments[assignment];
  const diceIndex = isSecondDie
    ? assignmentData?.secondDiceIndex
    : assignmentData?.diceIndex;

  if (diceIndex !== null && diceIndex !== undefined) {
    const diceValue = dicePool[diceIndex];
    const total = diceValue + skillModifier;

    return (
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div style={styles.assignedDiceContainer}>
          <label style={styles.label}></label>
          <div style={styles.assignedDiceTile}>
            <div style={styles.diceDisplay}>
              <div style={styles.diceValue}>{diceValue}</div>
            </div>
          </div>

          {canEdit() && (
            <button
              onClick={() => unassignDice(assignment, isSecondDie)}
              style={styles.removeDiceButton}
            >
              Remove
            </button>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            margin: "18px",
            fontSize: "14px",
            color: theme.text,
            padding: "4px 8px",
            backgroundColor: `${theme.primary}10`,
            borderRadius: "4px",
            textAlign: "center",
            fontWeight: "500",
            justifyContent: "center",
          }}
        >
          <span style={{ color: theme.textSecondary }}>Total: </span>
          {diceValue} {formatModifier(skillModifier)} ={" "}
          <span
            style={{
              color: theme.primary,
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            {total}
          </span>
          {skillName && (
            <div
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                marginTop: "2px",
              }}
            >
              ({skillName})
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div style={styles.diceSelection}>
        <label style={styles.label}>{label}:</label>
        <select
          value=""
          onChange={(e) => {
            const value = e.target.value;
            if (value !== "") {
              assignDice(assignment, parseInt(value), isSecondDie);
            }
          }}
          onFocus={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            ...styles.select,
            cursor: canEdit() ? "pointer" : "not-allowed",
            pointerEvents: canEdit() ? "auto" : "none",
          }}
          disabled={!canEdit()}
        >
          <option value="">Select die...</option>
          {getSortedDiceOptions().map(({ value, index: diceIndex }) => {
            const usage = getDiceUsage(diceIndex);
            const isAvailable = !usage;
            return (
              <option
                key={diceIndex}
                value={diceIndex}
                disabled={!isAvailable}
                style={{
                  color: isAvailable ? "inherit" : "#999",
                  backgroundColor: isAvailable ? "inherit" : "#f5f5f5",
                }}
              >
                d20: {value} {!isAvailable ? `(Used: ${usage.assignment})` : ""}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
};

export default DiceSelection;
