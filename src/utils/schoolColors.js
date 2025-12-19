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

const FALLBACK_OPTIONS = [
  { color: "#808080", icon: "BookOpen" }, // Gray
  { color: "#6B7280", icon: "BookOpen" }, // Slate Gray
  { color: "#8B5CF6", icon: "BookOpen" }, // Purple
  { color: "#EC4899", icon: "BookOpen" }, // Pink
  { color: "#14B8A6", icon: "BookOpen" }, // Teal
  { color: "#F59E0B", icon: "BookOpen" }, // Amber
  { color: "#06B6D4", icon: "BookOpen" }, // Cyan
  { color: "#10B981", icon: "BookOpen" }, // Emerald
  { color: "#F97316", icon: "BookOpen" }, // Orange
  { color: "#8B4513", icon: "BookOpen" }, // Brown
];

function hashString(str) {
  if (!str) return 0;

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash | 0;
  }

  return hash >>> 0;
}

export function getSchoolColor(schoolName) {
  if (SCHOOL_METADATA[schoolName]) {
    return SCHOOL_METADATA[schoolName].color;
  }
  const index = hashString(schoolName) % FALLBACK_OPTIONS.length;
  return FALLBACK_OPTIONS[index].color;
}

export function getSchoolIcon(schoolName) {
  if (SCHOOL_METADATA[schoolName]) {
    return SCHOOL_METADATA[schoolName].icon;
  }
  const index = hashString(schoolName) % FALLBACK_OPTIONS.length;
  return FALLBACK_OPTIONS[index].icon;
}

export function getSchoolMetadata(schoolName) {
  if (SCHOOL_METADATA[schoolName]) {
    return SCHOOL_METADATA[schoolName];
  }
  const index = hashString(schoolName) % FALLBACK_OPTIONS.length;
  return FALLBACK_OPTIONS[index];
}
