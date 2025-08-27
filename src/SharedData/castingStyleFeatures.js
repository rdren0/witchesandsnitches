export const CASTING_STYLE_FEATURES = {
  Willpower: {
    baseAC: 15,
    spellcastingAbility: "charisma",
    features: {
      1: [
        {
          name: "Sorcerous Resilience",
          description:
            "The accidental magic in your early childhood never stopped protecting you. Your AC equals 15 + your Dexterity modifier.",
          type: "passive",
          modifiers: {
            baseAC: 15,
          },
        },
        {
          name: "Reckless Magic",
          description:
            "You can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on spell attack rolls during this turn, but attack rolls against you have advantage until your next turn.",
          type: "action",
          actionType: "free",
        },
        {
          name: "Black Magic",
          description:
            "Once per turn, you can deal an extra 1d6 damage to one creature you hit with a cantrip if you have advantage on the attack roll.",
          type: "passive",
          damage: {
            dice: "1d6",
            scaling: {
              3: "2d6",
              5: "3d6",
              7: "4d6",
              9: "5d6",
              11: "6d6",
              13: "7d6",
              15: "8d6",
              17: "9d6",
              19: "10d6",
            },
          },
        },
      ],
      3: [
        {
          name: "Fierce Spell",
          description:
            "When you cast a spell, you can spend 2 sorcery points to cast that spell as if it were cast using a spell slot one level higher, or 4 sorcery points to cast it two levels higher.",
          type: "metamagic",
          cost: {
            oneLevel: 2,
            twoLevels: 4,
          },
        },
        {
          name: "Resistant Spell",
          description:
            "When you cast a spell, you can spend 1 sorcery point per increased level to make your spell more resistant to counterspells and dispels.",
          type: "metamagic",
          cost: "variable",
        },
      ],
      5: [
        {
          name: "Black Magic Enhancement",
          description: "Choose one enhancement for your Black Magic feature",
          type: "choice",
          options: [
            {
              name: "Ambush",
              description:
                "You have advantage on attack rolls against any creature that hasn't taken a turn in combat yet. Any hit against a surprised creature is a critical hit.",
            },
            {
              name: "Gambit",
              description:
                "You don't need advantage to use Black Magic when within 5 feet of a creature if no other creatures are within 5 feet of you.",
            },
            {
              name: "Grudge",
              description:
                "You gain advantage on attack rolls against creatures that have damaged you since the end of your last turn.",
            },
            {
              name: "Pique",
              description:
                "You have advantage on attack rolls when you have half of your hit points or less.",
            },
            {
              name: "Hubris",
              description:
                "You gain advantage on attack rolls against any creature that has fewer hit points than you.",
            },
          ],
        },
      ],
      20: [
        {
          name: "Signature Spells",
          description:
            "Choose two 3rd-level spells as signature spells. You can cast each once at 3rd level without expending a spell slot. Recharges on short or long rest.",
          type: "feature",
          spellSlots: {
            level: 3,
            count: 2,
            recharge: "short rest",
          },
        },
      ],
    },
  },

  Technique: {
    baseAC: 10,
    spellcastingAbility: "wisdom",
    features: {
      1: [
        {
          name: "Exploit Weakness",
          description:
            "Once per turn, when you hit with an attack, expend a spell slot to deal extra damage: 2d8 for 1st level, +1d8 per level (max 5d8).",
          type: "action",
          damage: {
            base: "2d8",
            perLevel: "1d8",
            maxDice: "5d8",
          },
        },
      ],
      3: [
        {
          name: "Spell Deflection",
          description:
            "As a reaction, deflect a spell you know by spending 2x its level in sorcery points. Auto-succeed on save and can redirect to creature within 10 ft.",
          type: "reaction",
          cost: "2x spell level",
        },
        {
          name: "Technical Metamagics",
          description: "Access to special metamagic options",
          type: "metamagic",
          options: [
            {
              name: "Bouncing Spell",
              cost: 2,
              description:
                "When a creature succeeds on a save against your single-target spell, bounce it to another target within 30 ft.",
            },
            {
              name: "Maximized Spell",
              cost: "2x spell level",
              description: "Deal maximum damage to one target of the spell.",
            },
            {
              name: "Seeking Spell",
              cost: 2,
              description: "If you miss with a spell attack, reroll the d20.",
            },
          ],
        },
      ],
      20: [
        {
          name: "Sorcerous Restoration",
          description:
            "Regain 4 expended sorcery points whenever you finish a short rest.",
          type: "passive",
          recovery: {
            amount: 4,
            recharge: "short rest",
          },
        },
      ],
    },
  },

  Intellect: {
    baseAC: 11,
    spellcastingAbility: "intelligence",
    features: {
      1: [
        {
          name: "Sharp Senses",
          description:
            "Your ability to avoid incoming spells is superior. Your AC equals 11 + your Dexterity modifier.",
          type: "passive",
          modifiers: {
            baseAC: 11,
          },
        },
        {
          name: "Double Check Notes",
          description:
            "Once per long rest, use a Bonus Action to retry a failed spell.",
          type: "action",
          actionType: "bonus",
          uses: {
            max: 1,
            recharge: "long rest",
          },
        },
        {
          name: "Ritual Casting",
          description:
            "Cast spells with the ritual tag as rituals without expending spell slots. Takes 1 minute longer than normal.",
          type: "passive",
        },
        {
          name: "Tactical Wit",
          description:
            "Use Intelligence modifier for Initiative (if higher than Dexterity). As a reaction, gain +2 AC or +4 to a save, but can only cast cantrips next turn.",
          type: "mixed",
          modifiers: {
            initiativeAbility: "intelligence",
            reactionBonus: {
              ac: 2,
              save: 4,
            },
          },
        },
      ],
      3: [
        {
          name: "Diverse Studies",
          description:
            "Gain TWO level 1 features from your chosen School of Magic.",
          type: "feature",
          grantsFeatures: {
            count: 2,
            level: 1,
            source: "school_of_magic",
          },
        },
      ],
      20: [
        {
          name: "Arcane Recovery",
          description:
            "On short rest, recover spell slots with combined level up to 10 (none 6th level or higher).",
          type: "passive",
          recovery: {
            maxLevel: 10,
            maxSlotLevel: 5,
            recharge: "short rest",
          },
        },
      ],
    },
  },

  Vigor: {
    baseAC: 8,
    spellcastingAbility: "constitution",
    features: {
      1: [
        {
          name: "Easy Target",
          description:
            "Your large, strong body makes you easy to hit. Your AC equals 8 + your Dexterity modifier.",
          type: "passive",
          modifiers: {
            baseAC: 8,
          },
        },
        {
          name: "Rated E for Everyone",
          description:
            "Your unarmed strikes deal 1d6 + Strength modifier damage.",
          type: "passive",
          damage: {
            dice: "1d6",
            ability: "strength",
          },
        },
      ],
      3: [
        {
          name: "Metamagic: Rage",
          description:
            "Spend 5 sorcery points to enter rage for 1 minute: advantage on Str checks/saves, resistance to physical and fire damage, can't cast AoE or concentrate.",
          type: "metamagic",
          cost: 5,
          duration: "1 minute",
          effects: {
            advantages: ["strength_checks", "strength_saves"],
            resistances: ["bludgeoning", "piercing", "slashing", "fire"],
            restrictions: ["no_aoe_spells", "no_concentration"],
          },
        },
      ],
      11: [
        {
          name: "Relentless Rage",
          description:
            "When you drop to 0 HP while raging, make a DC 15 Con save to drop to 1 HP instead. DC increases by 5 each use.",
          type: "passive",
          saveDC: {
            base: 15,
            increment: 5,
            reset: "rest",
          },
        },
      ],
      20: [
        {
          name: "Vigorous Perfection",
          description:
            "Your Constitution score increases by 4. Maximum is now 24.",
          type: "passive",
          modifiers: {
            constitution: 4,
            constitutionMax: 24,
          },
        },
      ],
    },
  },
};

export const getCastingStyleFeatures = (castingStyle, characterLevel) => {
  const style = CASTING_STYLE_FEATURES[castingStyle];
  if (!style) return [];

  const features = [];
  Object.entries(style.features).forEach(([level, levelFeatures]) => {
    if (parseInt(level) <= characterLevel) {
      features.push(
        ...levelFeatures.map((f) => ({
          ...f,
          unlockedAt: parseInt(level),
        }))
      );
    }
  });

  return features;
};

export const getCastingStyleAC = (castingStyle, dexModifier = 0) => {
  const style = CASTING_STYLE_FEATURES[castingStyle];
  if (!style) return 10 + dexModifier;

  return (style.baseAC || 10) + dexModifier;
};

export const getCastingStyleMetamagics = (castingStyle, characterLevel) => {
  const features = getCastingStyleFeatures(castingStyle, characterLevel);
  const metamagics = [];

  features.forEach((feature) => {
    if (feature.type === "metamagic") {
      if (feature.options) {
        metamagics.push(...feature.options);
      } else {
        metamagics.push({
          name: feature.name,
          cost: feature.cost,
          description: feature.description,
        });
      }
    }
  });

  return metamagics;
};

export const hasCastingStyleFeature = (character, featureName) => {
  if (!character.castingStyle || !character.level) return false;

  const features = getCastingStyleFeatures(
    character.castingStyle,
    character.level
  );
  return features.some((f) => f.name === featureName);
};

export const getFeatureDamageScaling = (
  castingStyle,
  featureName,
  characterLevel
) => {
  const features = getCastingStyleFeatures(castingStyle, characterLevel);
  const feature = features.find((f) => f.name === featureName);

  if (!feature || !feature.damage || !feature.damage.scaling) {
    return feature?.damage?.dice || null;
  }

  let currentDamage = feature.damage.dice;
  Object.entries(feature.damage.scaling).forEach(([level, damage]) => {
    if (parseInt(level) <= characterLevel) {
      currentDamage = damage;
    }
  });

  return currentDamage;
};

export const FEATURE_TYPES = {
  PASSIVE: "passive",
  ACTION: "action",
  REACTION: "reaction",
  METAMAGIC: "metamagic",
  CHOICE: "choice",
  FEATURE: "feature",
  MIXED: "mixed",
};

export const ACTION_TYPES = {
  FREE: "free",
  BONUS: "bonus",
  ACTION: "action",
  REACTION: "reaction",
};
