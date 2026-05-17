export const METAMAGIC_COUNT_PROGRESSION = {
  "Willpower Caster": { 3: 2, 10: 3, 17: 4 },
  "Technique Caster": { 3: 2, 5: 3, 7: 4, 8: 5, 12: 6, 15: 7, 18: 8 },
  "Intellect Caster": { 3: 1, 7: 2, 13: 3 },
  "Vigor Caster": { 4: 1, 7: 2, 12: 3, 16: 4 },
};

export const AUTOMATIC_METAMAGICS = {
  "Willpower Caster": { minLevel: 3, names: ["Fierce Spell", "Resistant Spell"] },
  "Vigor Caster": { minLevel: 3, names: ["Rage"] },
};

export const TECHNIQUE_EXTRA_METAMAGICS = ["Bouncing Spell", "Maximized Spell", "Seeking Spell"];

export const getMaxMetamagicCount = (castingStyle, level) => {
  const progression = METAMAGIC_COUNT_PROGRESSION[castingStyle];
  if (!progression) return null;
  let max = 0;
  for (const [threshold, count] of Object.entries(progression)) {
    if (level >= Number(threshold)) max = count;
  }
  return max;
};

export const getAutomaticMetamagicNames = (castingStyle, level) => {
  const entry = AUTOMATIC_METAMAGICS[castingStyle];
  if (!entry || level < entry.minLevel) return [];
  return entry.names;
};
