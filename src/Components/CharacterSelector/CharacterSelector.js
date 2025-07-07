import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { User, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { createCharacterSelectorStyles } from "../../styles/masterStyles";

export const CharacterSelector = ({
  user,
  characters,
  selectedCharacter,
  onCharacterChange,
  isLoading,
  error,
}) => {
  const { theme: contextTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const defaultTheme = useMemo(
    () => ({
      surface: "#ffffff",
      background: "#f8fafc",
      text: "#1f2937",
      textSecondary: "#6b7280",
      primary: "#6366f1",
      secondary: "#8b5cf6",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      border: "#e5e7eb",
    }),
    []
  );

  const theme = contextTheme || defaultTheme;

  const styles = useMemo(() => createCharacterSelectorStyles(theme), [theme]);

  const shouldShowDropdown = characters.length > 1;
  const singleCharacter = characters.length === 1 ? characters[0] : null;

  const filteredCharacters = useMemo(() => {
    if (!isEditing || !searchTerm.trim()) return characters;

    const search = searchTerm.toLowerCase().trim();
    return characters.filter((char) => {
      const searchableText = [
        char.name,
        char.castingStyle,
        char.house,
        char.gameSession,
        `level ${char.level}`,
        char.background,
        char.innateHeritage,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search);
    });
  }, [characters, searchTerm, isEditing]);

  const handleCharacterSelect = useCallback(
    (character) => {
      onCharacterChange(character);
      setSearchTerm("");
      setIsDropdownOpen(false);
      setFocusedIndex(-1);
      setIsEditing(false);
    },
    [onCharacterChange]
  );

  const hasSetSingleCharacter = useRef(false);

  useEffect(() => {
    if (
      singleCharacter &&
      !selectedCharacter &&
      !hasSetSingleCharacter.current
    ) {
      hasSetSingleCharacter.current = true;
      onCharacterChange(singleCharacter);
    } else if (!singleCharacter) {
      hasSetSingleCharacter.current = false;
    }
  }, [singleCharacter, selectedCharacter, onCharacterChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !searchInputRef.current?.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setFocusedIndex(-1);
        setIsEditing(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const enhancedStyles = useMemo(
    () => ({
      ...styles,
      searchDropdownContainer: {
        position: "relative",
        width: "100%",
      },
      searchInputContainer: {
        position: "relative",
        width: "100%",
      },
      searchInput: {
        width: "100%",
        padding: "12px 40px 12px 40px",
        fontSize: "14px",
        border: `2px solid ${theme.border}`,
        borderRadius: "8px",
        backgroundColor: theme.surface,
        color: theme.text,
        outline: "none",
        transition: "all 0.2s ease",
        cursor: "text",
        boxSizing: "border-box",
      },
      searchInputFocused: {
        borderColor: theme.primary,
        boxShadow: `0 0 0 3px ${theme.primary}20`,
      },
      searchIcon: {
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        color: theme.textSecondary,
        pointerEvents: "none",
      },
      dropdownToggle: {
        position: "absolute",
        right: "8px",
        top: "50%",
        transform: "translateY(-50%)",
        color: theme.textSecondary,
        cursor: "pointer",
        padding: "2px",
        borderRadius: "4px",
        transition: "color 0.2s ease",
      },
      allButton: {
        position: "absolute",
        right: "32px",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: theme.primary + "20",
        color: theme.primary,
        border: `1px solid ${theme.primary}`,
        borderRadius: "4px",
        padding: "4px 8px",
        fontSize: "11px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        userSelect: "none",
      },
      allButtonHover: {
        backgroundColor: theme.primary,
        color: theme.surface,
      },
      dropdown: {
        position: "absolute",
        top: "100%",
        left: "0",
        right: "0",
        backgroundColor: theme.surface,
        border: `2px solid ${theme.primary}`,
        borderTop: "none",
        borderRadius: "0 0 8px 8px",
        maxHeight: "300px",
        overflowY: "auto",
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      },
      dropdownOption: {
        padding: "12px 16px",
        cursor: "pointer",
        fontSize: "14px",
        color: theme.text,
        borderBottom: `1px solid ${theme.border}`,
        transition: "background-color 0.1s ease",
      },
      dropdownOptionHovered: {
        backgroundColor: theme.primary + "10",
      },
      dropdownOptionSelected: {
        backgroundColor: theme.primary + "20",
        fontWeight: "600",
      },
      noResults: {
        padding: "16px",
        textAlign: "center",
        color: theme.textSecondary,
        fontStyle: "italic",
        fontSize: "14px",
      },
      selectedDisplay: {
        padding: "12px 40px 12px 40px",
        fontSize: "14px",
        border: `2px solid ${theme.border}`,
        borderRadius: "8px",
        backgroundColor: theme.background,
        color: theme.text,
        minHeight: "44px",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
      },
    }),
    [styles, theme]
  );

  const handleShowAll = useCallback(() => {
    setSearchTerm("");
    setIsEditing(false);
    setFocusedIndex(-1);
    setIsDropdownOpen(true);
    searchInputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey && e.key === "a" && isDropdownOpen) {
        e.preventDefault();
        handleShowAll();
        return;
      }

      if (!isDropdownOpen) {
        if (e.key === "Enter" || e.key === "ArrowDown") {
          setIsDropdownOpen(true);
          setFocusedIndex(0);
          setIsEditing(false);
          e.preventDefault();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < filteredCharacters.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && filteredCharacters[focusedIndex]) {
            handleCharacterSelect(filteredCharacters[focusedIndex]);
          }
          break;
        case "Escape":
          setIsDropdownOpen(false);
          setFocusedIndex(-1);
          setIsEditing(false);
          setSearchTerm("");
          searchInputRef.current?.blur();
          break;
        default:
          break;
      }
    },
    [
      isDropdownOpen,
      focusedIndex,
      filteredCharacters,
      handleCharacterSelect,
      handleShowAll,
    ]
  );

  const handleInputFocus = useCallback(() => {
    if (characters.length > 1) {
      setIsDropdownOpen(true);
      setIsEditing(false);
    }
  }, [characters.length]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsEditing(true);
    setIsDropdownOpen(true);
    setFocusedIndex(-1);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (characters.length > 1) {
      const wasOpen = isDropdownOpen;
      setIsDropdownOpen(!isDropdownOpen);
      setIsEditing(false);

      if (wasOpen) {
        setSearchTerm("");
      } else {
        searchInputRef.current?.focus();
      }
    }
  }, [characters.length, isDropdownOpen]);

  const formatCharacterDisplay = useCallback((char) => {
    if (!char) return "";
    return `${char.name} (${char.castingStyle || "Unknown Class"}) - Level ${
      char.level || "?"
    } - ${char.house || "No House"}${
      char.gameSession ? ` - ${char.gameSession}` : ""
    }`;
  }, []);

  const getDisplayValue = useCallback(() => {
    if (isDropdownOpen && isEditing) {
      return searchTerm;
    }
    if (isDropdownOpen && !isEditing && selectedCharacter) {
      return selectedCharacter.name;
    }
    return selectedCharacter ? selectedCharacter.name : "";
  }, [isDropdownOpen, isEditing, searchTerm, selectedCharacter]);

  const getPlaceholder = useCallback(() => {
    if (isLoading) return "Loading characters...";
    if (characters.length === 0) return "No characters available";
    if (characters.length === 1) return characters[0].name;
    return selectedCharacter
      ? selectedCharacter.name
      : "Search and select a character...";
  }, [isLoading, characters, selectedCharacter]);

  if (!user) return null;

  return (
    <div style={enhancedStyles.container}>
      <div style={enhancedStyles.innerContainer}>
        <div style={enhancedStyles.selectorRow}>
          <User size={24} color={theme.primary} />
          <label style={enhancedStyles.label}>Character:</label>
        </div>

        {shouldShowDropdown ? (
          <div style={enhancedStyles.searchDropdownContainer} ref={dropdownRef}>
            <div style={enhancedStyles.searchInputContainer}>
              <Search size={16} style={enhancedStyles.searchIcon} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={getPlaceholder()}
                value={getDisplayValue()}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onKeyDown={handleKeyDown}
                style={{
                  ...enhancedStyles.searchInput,
                  paddingRight: isDropdownOpen ? "80px" : "40px",
                  ...(isDropdownOpen ? enhancedStyles.searchInputFocused : {}),
                }}
                disabled={isLoading}
                autoComplete="off"
              />
              {isDropdownOpen && (
                <button
                  onClick={handleShowAll}
                  style={enhancedStyles.allButton}
                  title="Show all characters (Ctrl+A)"
                  type="button"
                >
                  All
                </button>
              )}
              <div
                onClick={toggleDropdown}
                style={{
                  ...enhancedStyles.dropdownToggle,
                  color: isDropdownOpen ? theme.primary : theme.textSecondary,
                }}
              >
                {isDropdownOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </div>

            {isDropdownOpen && (
              <div style={enhancedStyles.dropdown}>
                {filteredCharacters.length > 0 ? (
                  filteredCharacters.map((char, index) => (
                    <div
                      key={char.id}
                      onClick={() => handleCharacterSelect(char)}
                      style={{
                        ...enhancedStyles.dropdownOption,
                        ...(index === focusedIndex
                          ? enhancedStyles.dropdownOptionHovered
                          : {}),
                        ...(selectedCharacter?.id === char.id
                          ? enhancedStyles.dropdownOptionSelected
                          : {}),
                      }}
                    >
                      <div style={{ fontWeight: "600", marginBottom: "2px" }}>
                        {char.name}
                      </div>
                      <div
                        style={{ fontSize: "12px", color: theme.textSecondary }}
                      >
                        {char.castingStyle || "Unknown Class"} • Level{" "}
                        {char.level || "?"} • {char.house || "No House"}
                        {char.gameSession && ` • ${char.gameSession}`}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={enhancedStyles.noResults}>
                    {searchTerm
                      ? `No characters match "${searchTerm}"`
                      : "No characters available"}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : singleCharacter ? (
          <div style={enhancedStyles.selectedDisplay}>
            <User
              size={16}
              style={{ marginRight: "8px", color: theme.textSecondary }}
            />
            {formatCharacterDisplay(singleCharacter)}
          </div>
        ) : (
          <div style={enhancedStyles.selectedDisplay}>
            {isLoading ? "Loading characters..." : "No characters available"}
          </div>
        )}

        {characters.length === 0 && !isLoading && (
          <div style={enhancedStyles.warningMessage}>
            No characters found. Create a character in the Character Creation
            tab first.
          </div>
        )}
      </div>

      {error && <div style={enhancedStyles.errorMessage}>{error}</div>}
    </div>
  );
};

export default CharacterSelector;
