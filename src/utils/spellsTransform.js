import { getSchoolMetadata } from "./schoolColors";

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

    nested[school].levels[level].push(spell);
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

      nested[school].levels[level].push(spell);
    });
  });

  return nested;
}
