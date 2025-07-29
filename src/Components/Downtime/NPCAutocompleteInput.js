import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, User } from "lucide-react";
import { ALL_CHARACTERS } from "../../SharedData/charactersData";

const NPCAutocompleteInput = ({
  value,
  onChange,
  placeholder = "Enter NPC name...",
  disabled = false,
  styles = {},
  theme = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const charactersData = ALL_CHARACTERS;

  const defaultStyles = {
    inputContainer: {
      position: "relative",
      width: "100%",
    },
    input: {
      width: "100%",
      padding: "12px 40px 12px 12px",
      border: `2px solid ${theme.border || "#e5e7eb"}`,
      borderRadius: "8px",
      fontSize: "14px",
      backgroundColor: theme.cardBackground || "#ffffff",
      color: theme.text || "#000000",
      transition: "border-color 0.2s ease",
      outline: "none",
    },
    inputFocused: {
      borderColor: theme.primary || "#3b82f6",
      boxShadow: `0 0 0 3px ${theme.primary || "#3b82f6"}20`,
    },
    dropdownButton: {
      position: "absolute",
      right: "8px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      padding: "4px",
      borderRadius: "4px",
      color: theme.textSecondary || "#6b7280",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    dropdown: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: theme.cardBackground || "#ffffff",
      border: `1px solid ${theme.border || "#e5e7eb"}`,
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      maxHeight: "200px",
      overflowY: "auto",
      marginTop: "4px",
    },
    option: {
      padding: "12px",
      cursor: "pointer",
      fontSize: "14px",
      color: theme.text || "#000000",
      borderBottom: `1px solid ${theme.border || "#e5e7eb"}`,
      display: "flex",
      alignItems: "center",
      gap: "12px",
      transition: "background-color 0.15s ease",
      minHeight: "56px",
    },
    optionHighlighted: {
      backgroundColor: theme.primary ? `${theme.primary}10` : "#f3f4f6",
    },
    optionSelected: {
      backgroundColor: theme.primary ? `${theme.primary}20` : "#e5e7eb",
      fontWeight: "500",
    },
    noOptions: {
      padding: "12px",
      color: theme.textSecondary || "#6b7280",
      fontSize: "14px",
      fontStyle: "italic",
      textAlign: "center",
    },
  };

  const mergedStyles = {
    ...defaultStyles,
    ...styles,
  };

  const characterOptions = React.useMemo(() => {
    if (!Array.isArray(charactersData) || charactersData.length === 0) {
      return [];
    }

    const characters = charactersData
      .filter((char) => char && char.name && char.name.trim() !== "")
      .map((char) => ({
        name: char.name.trim(),
        type: char.type || "Character",
        school: char.school || "Unknown School",
        house: char.house || null,
        image: char.src || null,
      }));

    const uniqueCharacters = characters.filter(
      (char, index, self) =>
        index ===
        self.findIndex((c) => c.name.toLowerCase() === char.name.toLowerCase())
    );

    return uniqueCharacters.sort((a, b) => a.name.localeCompare(b.name));
  }, [charactersData]);

  useEffect(() => {
    if (!value || value.trim() === "") {
      setFilteredOptions(characterOptions);
    } else {
      const filtered = characterOptions.filter((char) =>
        char.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
    setHighlightedIndex(-1);
  }, [value, characterOptions]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (!isOpen) setIsOpen(true);
  };

  const handleOptionSelect = (optionName) => {
    onChange(optionName);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;

      case "Enter":
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleOptionSelect(filteredOptions[highlightedIndex].name);
        } else if (isOpen) {
          setIsOpen(false);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;

      case "Tab":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;

      default:
        if (!isOpen) setIsOpen(true);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputBlur = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      inputRef.current?.focus();
    }
  };

  return (
    <div style={mergedStyles.inputContainer}>
      <input
        ref={inputRef}
        type="text"
        value={value || ""}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => !disabled && setIsOpen(true)}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          ...mergedStyles.input,
          ...(isOpen && !disabled ? mergedStyles.inputFocused : {}),
        }}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="NPC Name"
      />

      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        style={mergedStyles.dropdownButton}
        aria-label="Toggle dropdown"
        tabIndex={-1}
      >
        <ChevronDown
          size={16}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      {isOpen && !disabled && (
        <div ref={dropdownRef} style={mergedStyles.dropdown} role="listbox">
          {filteredOptions.length > 0 ? (
            <>
              {filteredOptions.map((char, index) => {
                const isSelected =
                  char.name.toLowerCase() === value?.toLowerCase();
                const isHighlighted = index === highlightedIndex;

                return (
                  <div
                    key={`${char.name}-${char.school}-${char.type}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleOptionSelect(char.name);
                    }}
                    style={{
                      ...mergedStyles.option,
                      ...(isHighlighted ? mergedStyles.optionHighlighted : {}),
                      ...(isSelected ? mergedStyles.optionSelected : {}),
                    }}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {char.image ? (
                      <img
                        src={char.image}
                        alt={char.name}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: `1px solid ${theme.border || "#e5e7eb"}`,
                          flexShrink: 0,
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: theme.primary
                            ? `${theme.primary}20`
                            : "#f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <User size={16} />
                      </div>
                    )}
                    {char.image && (
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: theme.primary
                            ? `${theme.primary}20`
                            : "#f3f4f6",
                          display: "none",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <User size={16} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: "500",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {char.name}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: theme.textSecondary || "#6b7280",
                          marginTop: "2px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {char.type} • {char.school}
                        {char.house && char.house !== "?" && ` • ${char.house}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div style={mergedStyles.noOptions}>
              {value && value.trim() !== ""
                ? "No matching characters found. Your custom entry will be saved automatically."
                : "Start typing to search for NPCs..."}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NPCAutocompleteInput;
