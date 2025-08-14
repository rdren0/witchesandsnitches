import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { createBaseStyles } from "../utils/styles";

const BaseSelector = ({
  options = [],
  selectedValue,
  onChange,
  allowMultiple = false,
  disabled = false,
  name,
  renderOption,
  renderSelected,
  placeholder = "Select an option...",
  emptyMessage = "No options available",
  className = "",
}) => {
  const { theme } = useTheme();
  const styles = createBaseStyles(theme);

  const handleOptionSelect = (option, checked = true) => {
    if (disabled) return;

    if (allowMultiple) {
      const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
      const newValues = checked
        ? [...currentValues, option.value]
        : currentValues.filter((v) => v !== option.value);
      onChange(newValues);
    } else {
      onChange(option.value);
    }
  };

  const isSelected = (option) => {
    if (allowMultiple) {
      const values = Array.isArray(selectedValue) ? selectedValue : [];
      return values.includes(option.value);
    }
    return selectedValue === option.value;
  };

  const defaultRenderOption = (option, selected, index) => (
    <div
      key={option.value || index}
      style={{
        ...styles.option,
        ...(selected ? styles.optionSelected : {}),
        ...(disabled ? styles.optionDisabled : {}),
      }}
    >
      <input
        type={allowMultiple ? "checkbox" : "radio"}
        name={name}
        value={option.value}
        checked={selected}
        onChange={(e) => handleOptionSelect(option, e.target.checked)}
        disabled={disabled}
        style={{
          margin: 0,
          accentColor: theme.primary,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: selected ? "600" : "500",
            color: selected ? theme.primary : theme.text,
            marginBottom: option.description ? "4px" : 0,
          }}
        >
          {option.label || option.name || option.value}
        </div>
        {option.description && (
          <div
            style={{
              fontSize: "12px",
              color: theme.textSecondary,
              lineHeight: "1.4",
            }}
          >
            {option.description}
          </div>
        )}
      </div>
    </div>
  );

  if (options.length === 0) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          color: theme.textSecondary,
          fontStyle: "italic",
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className} style={styles.optionGroup}>
      {options.map((option, index) => {
        const selected = isSelected(option);
        return renderOption
          ? renderOption(option, selected, index, handleOptionSelect)
          : defaultRenderOption(option, selected, index);
      })}
    </div>
  );
};

export default BaseSelector;
