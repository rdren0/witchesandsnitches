import { getSchoolMetadata } from "./schoolColors";

// Helper function to convert snake_case to camelCase
function toCamelCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      // Convert snake_case key to camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

export function transformSpellsToNestedStructure(spells) {
  if (!Array.isArray(spells)) return {};

  const nested = {};

  spells.forEach((spell) => {
    const school = spell.school;
    const level = spell.level;

    if (!nested[school]) {
      const metadata = getSchoolMetadata(school);
      nested[school] = {
        color: metadata.color,
        icon: metadata.icon,
        levels: {},
      };
    }

    if (!nested[school].levels[level]) {
      nested[school].levels[level] = [];
    }

    // Transform spell object from snake_case to camelCase
    const transformedSpell = toCamelCase(spell);
    nested[school].levels[level].push(transformedSpell);
  });

  return nested;
}

export function transformSpellsBySchoolToNested(spellsBySchool) {
  if (!spellsBySchool || typeof spellsBySchool !== "object") return {};

  const nested = {};

  Object.entries(spellsBySchool).forEach(([school, spells]) => {
    const metadata = getSchoolMetadata(school);
    nested[school] = {
      color: metadata.color,
      icon: metadata.icon,
      levels: {},
    };

    spells.forEach((spell) => {
      const level = spell.level;

      if (!nested[school].levels[level]) {
        nested[school].levels[level] = [];
      }

      // Transform spell object from snake_case to camelCase
      const transformedSpell = toCamelCase(spell);
      nested[school].levels[level].push(transformedSpell);
    });
  });

  return nested;
}
