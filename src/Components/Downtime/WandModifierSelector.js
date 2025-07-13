import { useTheme } from "../../contexts/ThemeContext";

import { calculateWandStatIncreaseDC } from "./downtimeHelpers";
import { formatModifier } from "./utils/modifierUtils";

export const WandModifierSelector = ({
  selectedCharacter,
  selectedWandModifier,
  onWandModifierChange,
  canEdit,
}) => {
  const { theme } = useTheme();
  const allWandModifiers = [
    { name: "charms", displayName: "Charms" },
    { name: "transfiguration", displayName: "Transfiguration" },
    { name: "jinxesHexesCurses", displayName: "JHC" },
    { name: "healing", displayName: "Healing" },
    { name: "divinations", displayName: "Divinations" },
  ];

  const allAtMaximum = allWandModifiers.every(
    (wand) => (selectedCharacter.magicModifiers[wand.name] || 0) >= 5
  );

  if (allAtMaximum) {
    return (
      <div
        style={{
          padding: "1rem",
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: "6px",
          color: theme.textSecondary,
          textAlign: "center",
        }}
      >
        All wand modifiers are already at maximum (+5). You cannot use this
        activity.
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label
        style={{
          display: "block",
          fontSize: "0.875rem",
          fontWeight: "600",
          color: theme.text,
          marginBottom: "0.5rem",
        }}
      >
        Wand Modifier to Increase:
      </label>
      <select
        value={selectedWandModifier || ""}
        onChange={(e) => onWandModifierChange(e.target.value)}
        disabled={!canEdit()}
        style={{
          width: "100%",
          padding: "0.75rem",
          border: `1px solid ${theme.border}`,
          borderRadius: "6px",
          backgroundColor: theme.surface,
          color: theme.text,
          fontSize: "14px",
        }}
      >
        <option value="">Select a wand modifier...</option>
        {allWandModifiers.map((wand) => {
          const currentValue = selectedCharacter.magicModifiers[wand.name] || 0;
          const isAtMaximum = currentValue >= 5;
          const dc = calculateWandStatIncreaseDC(selectedCharacter, wand.name);

          return (
            <option
              key={wand.name}
              value={wand.name}
              disabled={isAtMaximum}
              style={{
                color: isAtMaximum ? theme.textSecondary : theme.text,
                backgroundColor: isAtMaximum ? theme.surface : theme.background,
              }}
            >
              {wand.displayName} ({formatModifier(currentValue)}) - DC {dc}
              {isAtMaximum ? " (MAX)" : ""}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default WandModifierSelector;
