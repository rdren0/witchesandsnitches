import React, { createContext, useContext, useState, useEffect } from "react";

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
  Beauxbatons: {
    primary: "#4F8FFF",
    secondary: "#E8F4FD",
    accent: "#87CEEB",
    background: "#F0F8FF",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #4F8FFF 0%, #E8F4FD 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#4F8FFF",
    sidebarBackground: "#F0F8FF",
  },
  Durmstrang: {
    primary: "#8B0000",
    secondary: "#2F2F2F",
    accent: "#DC143C",
    background: "#2C1810",
    surface: "#3A2317",
    text: "#F5F5F5",
    textSecondary: "#C0C0C0",
    border: "#4A3A2A",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #8B0000 0%, #2F2F2F 100%)",
    cardBackground: "#3A2317",
    headerBackground: "#8B0000",
    sidebarBackground: "#2C1810",
  },
  Uagadou: {
    primary: "#CD853F",
    secondary: "#F4A460",
    accent: "#DEB887",
    background: "#FFF8DC",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #CD853F 0%, #F4A460 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#CD853F",
    sidebarBackground: "#FFF8DC",
  },
  Mahoutokoro: {
    primary: "#DC143C",
    secondary: "#FFD700",
    accent: "#FF6B6B",
    background: "#FFF5F5",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #DC143C 0%, #FFD700 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#DC143C",
    sidebarBackground: "#FFF5F5",
  },
  Castelobruxo: {
    primary: "#228B22",
    secondary: "#32CD32",
    accent: "#90EE90",
    background: "#F0FFF0",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #228B22 0%, #32CD32 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#228B22",
    sidebarBackground: "#F0FFF0",
  },
  Koldovstoretz: {
    primary: "#4682B4",
    secondary: "#E0FFFF",
    accent: "#87CEFA",
    background: "#F0F8FF",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #4682B4 0%, #E0FFFF 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#4682B4",
    sidebarBackground: "#F0F8FF",
  },
};

const COLORBLIND_THEMES = {
  "protanopia-light": {
    primary: "#0066CC",
    secondary: "#FF6600",
    accent: "#3399FF",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#FF6600",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #0066CC 0%, #FF6600 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#0066CC",
    sidebarBackground: "#F5F5F5",
  },
  "protanopia-dark": {
    primary: "#3399FF",
    secondary: "#FF9933",
    accent: "#66AAFF",
    background: "#1A1A1A",
    surface: "#2A2A2A",
    text: "#F5F5F5",
    textSecondary: "#CCCCCC",
    border: "#3A3A3A",
    success: "#10B981",
    warning: "#FF9933",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #3399FF 0%, #FF9933 100%)",
    cardBackground: "#2A2A2A",
    headerBackground: "#1A1A1A",
    sidebarBackground: "#2A2A2A",
  },
  "deuteranopia-light": {
    primary: "#0066CC",
    secondary: "#FFCC00",
    accent: "#3399FF",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#FFCC00",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #0066CC 0%, #FFCC00 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#0066CC",
    sidebarBackground: "#F5F5F5",
  },
  "deuteranopia-dark": {
    primary: "#3399FF",
    secondary: "#FFDD33",
    accent: "#66AAFF",
    background: "#1A1A1A",
    surface: "#2A2A2A",
    text: "#F5F5F5",
    textSecondary: "#CCCCCC",
    border: "#3A3A3A",
    success: "#10B981",
    warning: "#FFDD33",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #3399FF 0%, #FFDD33 100%)",
    cardBackground: "#2A2A2A",
    headerBackground: "#1A1A1A",
    sidebarBackground: "#2A2A2A",
  },
  "tritanopia-light": {
    primary: "#CC0066",
    secondary: "#FF6600",
    accent: "#FF3399",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#FF6600",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #CC0066 0%, #FF6600 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#CC0066",
    sidebarBackground: "#F5F5F5",
  },
  "tritanopia-dark": {
    primary: "#FF3399",
    secondary: "#FF9933",
    accent: "#FF66BB",
    background: "#1A1A1A",
    surface: "#2A2A2A",
    text: "#F5F5F5",
    textSecondary: "#CCCCCC",
    border: "#3A3A3A",
    success: "#10B981",
    warning: "#FF9933",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #FF3399 0%, #FF9933 100%)",
    cardBackground: "#2A2A2A",
    headerBackground: "#1A1A1A",
    sidebarBackground: "#2A2A2A",
  },
  "high-contrast-light": {
    primary: "#000000",
    secondary: "#333333",
    accent: "#666666",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    text: "#000000",
    textSecondary: "#333333",
    border: "#000000",
    success: "#000000",
    warning: "#000000",
    error: "#000000",
    gradient: "linear-gradient(135deg, #000000 0%, #333333 100%)",
    cardBackground: "#FFFFFF",
    headerBackground: "#FFFFFF",
    sidebarBackground: "#FFFFFF",
  },
  "high-contrast-dark": {
    primary: "#FFFFFF",
    secondary: "#CCCCCC",
    accent: "#999999",
    background: "#000000",
    surface: "#000000",
    text: "#FFFFFF",
    textSecondary: "#CCCCCC",
    border: "#FFFFFF",
    success: "#FFFFFF",
    warning: "#FFFFFF",
    error: "#FFFFFF",
    gradient: "linear-gradient(135deg, #FFFFFF 0%, #CCCCCC 100%)",
    cardBackground: "#000000",
    headerBackground: "#000000",
    sidebarBackground: "#000000",
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

export const SCHOOL_CATEGORIES = {
  "Hogwarts Houses": ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"],
  "Ilvermorny Houses": ["Thunderbird", "Horned Serpent", "Pukwudgie", "Wampus"],
  "International Schools": [
    "Beauxbatons",
    "Durmstrang",
    "Uagadou",
    "Mahoutokoro",
    "Castelobruxo",
    "Koldovstoretz",
  ],
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("light");
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [themeHouse, setThemeHouse] = useState("Gryffindor");
  const [selectedColorblindType, setSelectedColorblindType] =
    useState("protanopia-light");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme");
    const savedHouse = localStorage.getItem("app-theme-house");
    const savedColorblindType = localStorage.getItem("app-colorblind-type");

    if (
      savedTheme &&
      ["light", "dark", "house", "colorblind"].includes(savedTheme)
    ) {
      setThemeMode(savedTheme);
    }

    if (savedHouse && HOUSE_THEMES[savedHouse]) {
      setThemeHouse(savedHouse);
    }

    if (savedColorblindType) {
      setSelectedColorblindType(savedColorblindType);
    }

    setIsInitialized(true);
  }, []);

  const setThemeModeWithPersistence = (newTheme) => {
    setThemeMode(newTheme);
    localStorage.setItem("app-theme", newTheme);
  };

  const setThemeHouseWithPersistence = (newHouse) => {
    setThemeHouse(newHouse);
    localStorage.setItem("app-theme-house", newHouse);
  };

  const setSelectedColorblindTypeWithPersistence = (newType) => {
    setSelectedColorblindType(newType);
    localStorage.setItem("app-colorblind-type", newType);
  };

  const updateSelectedCharacterFromExternal = (character) => {
    setSelectedCharacter(character);
  };

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("app-theme", themeMode);
    }
  }, [themeMode, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("app-theme-house", themeHouse);
    }
  }, [themeHouse, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("app-colorblind-type", selectedColorblindType);
    }
  }, [selectedColorblindType, isInitialized]);

  const getCurrentTheme = () => {
    if (themeMode === "house") {
      return HOUSE_THEMES[themeHouse] || THEMES.light;
    }
    if (themeMode === "colorblind") {
      return COLORBLIND_THEMES[selectedColorblindType] || THEMES.light;
    }
    return THEMES[themeMode] || THEMES.light;
  };

  const theme = getCurrentTheme();

  const contextValue = {
    themeMode,
    setThemeMode: setThemeModeWithPersistence,
    theme,
    selectedCharacter,
    setSelectedCharacter: () => {},
    themeHouse,
    setThemeHouse: setThemeHouseWithPersistence,
    selectedColorblindType,
    setSelectedColorblindType: setSelectedColorblindTypeWithPersistence,
    updateSelectedCharacterFromExternal,
    availableHouses: Object.keys(HOUSE_THEMES),
    HOUSE_THEMES,
    THEMES,
    COLORBLIND_THEMES,
    SCHOOL_CATEGORIES,
    isInitialized,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

const DEFAULT_THEME = {
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
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    console.warn(
      "useTheme must be used within a ThemeProvider. Using default theme."
    );
    return {
      theme: DEFAULT_THEME,
      themeMode: "light",
      setThemeMode: () => {},
      selectedCharacter: null,
      setSelectedCharacter: () => {},
      themeHouse: "Gryffindor",
      setThemeHouse: () => {},
      selectedColorblindType: "protanopia-light",
      setSelectedColorblindType: () => {},
      updateSelectedCharacterFromExternal: () => {},
      availableHouses: [],
      HOUSE_THEMES: {},
      THEMES: { light: DEFAULT_THEME },
      COLORBLIND_THEMES: {},
      SCHOOL_CATEGORIES: {},
      isInitialized: true,
    };
  }

  if (!context.theme) {
    console.warn("Theme is undefined in context. Using default theme.");
    return {
      ...context,
      theme: DEFAULT_THEME,
    };
  }

  return context;
};

export default ThemeContext;
