export const SCHOOL_METADATA = {
  Charms: {
    color: "#51B5F6",
    icon: "Wand2",
  },
  "Jinxes, Hexes & Curses": {
    color: "#B751F6",
    icon: "Zap",
  },
  Transfigurations: {
    color: "#5BC257",
    icon: "BookOpen",
  },
  Divinations: {
    color: "#D2C90C",
    icon: "Eye",
  },
  Healing: {
    color: "#F31717",
    icon: "Heart",
  },
  Elemental: {
    color: "#97C00C",
    icon: "Zap",
  },
  Valiant: {
    color: "#7A5E0D",
    icon: "Shield",
  },

  Magizoo: {
    color: "#E6A327",
    icon: "PawPrint",
  },
  Grim: {
    color: "#F17FF1",
    icon: "Skull",
  },
  Forbidden: {
    color: "#000000",
    icon: "Ban",
  },
  Ancient: {
    color: "#941212",
    icon: "Scroll",
  },
  Astronomic: {
    color: "#0E48D8",
    icon: "Moon",
  },
  Trickery: {
    color: "#d55713",
    icon: "Star",
  },
  "Prof. Charms": {
    color: "#51DDF6",
    icon: "GraduationCap",
  },
  Justice: {
    color: "#FFD700",
    icon: "Shield",
  },
  Gravetouched: {
    color: "#8B0000",
    icon: "Skull",
  },
};

const DEFAULT_METADATA = {
  color: "#808080",
  icon: "BookOpen",
};

/**
 * Get color for a school/subject
 * @param {string} schoolName - Name of the school
 * @returns {string} Hex color code
 */
export function getSchoolColor(schoolName) {
  return SCHOOL_METADATA[schoolName]?.color || DEFAULT_METADATA.color;
}

/**
 * Get icon for a school/subject
 * @param {string} schoolName - Name of the school
 * @returns {string} Icon name
 */
export function getSchoolIcon(schoolName) {
  return SCHOOL_METADATA[schoolName]?.icon || DEFAULT_METADATA.icon;
}

/**
 * Get full metadata for a school/subject
 * @param {string} schoolName - Name of the school
 * @returns {Object} { color, icon }
 */
export function getSchoolMetadata(schoolName) {
  return SCHOOL_METADATA[schoolName] || DEFAULT_METADATA;
}
