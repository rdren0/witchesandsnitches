import { createContext, useContext, useState, useEffect, useMemo } from "react";

const ThemeContext = createContext();

const HOUSE_THEMES = {
  Gryffindor: {
    primary: "#740001",
    secondary: "#D3A625",
    accent: "#EEBA30",
    background: "#FDF2F8",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #740001 0%, #D3A625 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#740001",
    sidebarBackground: "#F9FAFB",
  },
  Hufflepuff: {
    primary: "#FFDB00",
    secondary: "#000000",
    accent: "#F1C40F",
    background: "#FFFBEB",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #FFDB00 0%, #000000 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#FFDB00",
    sidebarBackground: "#F9FAFB",
  },
  Ravenclaw: {
    primary: "#0E1A40",
    secondary: "#946B2D",
    accent: "#2563EB",
    background: "#F0F9FF",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #0E1A40 0%, #946B2D 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#0E1A40",
    sidebarBackground: "#F9FAFB",
  },
  Slytherin: {
    primary: "#1A472A",
    secondary: "#C0C0C0",
    accent: "#059669",
    background: "#F0FDF4",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #1A472A 0%, #C0C0C0 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#1A472A",
    sidebarBackground: "#F9FAFB",
  },
  Thunderbird: {
    primary: "#8B5A2B",
    secondary: "#FF6B35",
    accent: "#FF8C42",
    background: "#FFF7ED",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #8B5A2B 0%, #FF6B35 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#8B5A2B",
    sidebarBackground: "#F9FAFB",
  },
  "Horned Serpent": {
    primary: "#1E3A8A",
    secondary: "#10B981",
    accent: "#3B82F6",
    background: "#EFF6FF",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #1E3A8A 0%, #10B981 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#1E3A8A",
    sidebarBackground: "#F9FAFB",
  },
  Pukwudgie: {
    primary: "#7C2D12",
    secondary: "#FDE047",
    accent: "#EAB308",
    background: "#FEF3C7",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #7C2D12 0%, #FDE047 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#7C2D12",
    sidebarBackground: "#F9FAFB",
  },
  Wampus: {
    primary: "#6D28D9",
    secondary: "#F59E0B",
    accent: "#8B5CF6",
    background: "#FAF5FF",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #6D28D9 0%, #F59E0B 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#6D28D9",
    sidebarBackground: "#F9FAFB",
  },
};

const THEMES = {
  light: {
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#3B82F6",
    background: "#F9FAFB",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#6366F1",
    sidebarBackground: "#F9FAFB",
  },
  dark: {
    primary: "#8B5CF6",
    secondary: "#6366F1",
    accent: "#3B82F6",
    background: "#111827",
    surface: "#1F2937",
    text: "#F9FAFB",
    textSecondary: "#D1D5DB",
    border: "#374151",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
    cardBackground: "#1F2937",
    headerBackground: "#111827",
    sidebarBackground: "#1F2937",
  },
};

const normalizeHouseName = (houseName) => {
  if (!houseName) return null;

  const houseMap = {
    "Wampus Cat": "Wampus",
    "Horned Serpent": "Horned Serpent",
    Thunderbird: "Thunderbird",
    Pukwudgie: "Pukwudgie",
    Gryffindor: "Gryffindor",
    Hufflepuff: "Hufflepuff",
    Ravenclaw: "Ravenclaw",
    Slytherin: "Slytherin",
  };

  return houseMap[houseName] || houseName;
};

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("light");
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedThemeMode = loadFromLocalStorage("themeMode", "light");
    const savedCharacter = loadFromLocalStorage("selectedCharacter", null);

    if (["light", "dark", "house"].includes(savedThemeMode)) {
      setThemeMode(savedThemeMode);
    }

    if (savedCharacter && savedCharacter.house) {
      const normalizedHouse = normalizeHouseName(savedCharacter.house);
      if (HOUSE_THEMES[normalizedHouse]) {
        setSelectedCharacter(savedCharacter);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage("themeMode", themeMode);
    }
  }, [themeMode, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if (selectedCharacter) {
        const characterForTheme = {
          id: selectedCharacter.id,
          name: selectedCharacter.name,
          house: selectedCharacter.house,
        };
        saveToLocalStorage("selectedCharacter", characterForTheme);
      } else {
        localStorage.removeItem("selectedCharacter");
      }
    }
  }, [selectedCharacter, isLoaded]);

  const theme = useMemo(() => {
    if (themeMode === "house" && selectedCharacter?.house) {
      const normalizedHouse = normalizeHouseName(selectedCharacter.house);
      const houseTheme = HOUSE_THEMES[normalizedHouse];
      if (houseTheme) {
        return houseTheme;
      }
      console.warn(
        `❌ House theme not found for: ${selectedCharacter.house} (normalized: ${normalizedHouse})`
      );
    }
    const activeTheme = THEMES[themeMode] || THEMES.light;

    return activeTheme;
  }, [themeMode, selectedCharacter]);

  const handleSetThemeMode = (mode) => {
    if (mode === "house" && !selectedCharacter?.house) {
      console.warn(
        "Cannot set house theme without a selected character with a house"
      );
      return;
    }
    setThemeMode(mode);
  };

  const handleSetSelectedCharacter = (character) => {
    if (character && character.house) {
      const normalizedHouse = normalizeHouseName(character.house);
      if (!HOUSE_THEMES[normalizedHouse]) {
        console.warn(
          `Unknown house: ${character.house} (normalized: ${normalizedHouse}). Available houses:`,
          Object.keys(HOUSE_THEMES)
        );
      }
    }
    setSelectedCharacter(character);
  };

  const isHouseThemeAvailable = () => {
    if (!selectedCharacter?.house) return false;
    const normalizedHouse = normalizeHouseName(selectedCharacter.house);
    return HOUSE_THEMES[normalizedHouse];
  };

  const contextValue = {
    themeMode,
    setThemeMode: handleSetThemeMode,
    theme,
    selectedCharacter,
    setSelectedCharacter: handleSetSelectedCharacter,
    availableHouses: Object.keys(HOUSE_THEMES),
    HOUSE_THEMES,
    THEMES,
    isLoaded,
    isHouseThemeAvailable,
    normalizeHouseName,

    clearThemePreferences: () => {
      localStorage.removeItem("themeMode");
      localStorage.removeItem("selectedCharacter");
      setThemeMode("light");
      setSelectedCharacter(null);
    },
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
