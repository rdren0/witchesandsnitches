// src/components/ThemeCharacterSync.js
import { useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export const ThemeCharacterSync = ({ selectedCharacter }) => {
  const { updateSelectedCharacterFromExternal } = useTheme();

  useEffect(() => {
    updateSelectedCharacterFromExternal(selectedCharacter);
  }, [selectedCharacter, updateSelectedCharacterFromExternal]);

  return null;
};

export default ThemeCharacterSync;
