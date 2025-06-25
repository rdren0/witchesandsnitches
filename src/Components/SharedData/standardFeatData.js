export const standardFeats = [
  {
    name: "Accidental Magic Surge",
    preview: "Wild and unpredictable magical energy with surge effects.",
    description: [
      "You have the wild and unpredictable energy of accidental magic.",
      "As a Free Action, you can choose to enhance a spell you cast.",
      "Roll a d20: on 5 or lower, roll on magic surge table.",
      "On 15 or higher, spell effects are amplified with increased damage, conditions, area, or targets.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Accidental Magic Surge",
          type: "active",
          usage: "free_action",
          description:
            "Enhance spells with surge risk/amplification (d20: 5- surge, 15+ amplified)",
        },
      ],
    },
  },
  {
    name: "Actor",
    preview: "Master of disguise and impersonation. +1 Charisma.",
    description: [
      "Increase Charisma by 1.",
      "Gain advantage on Deception/Performance checks while disguised as someone.",
      "You can mimic sounds and speech.",
      "Others need Wisdom (Insight) check vs DC 8 + Charisma mod + proficiency to detect.",
    ],
    benefits: {
      abilityScoreIncrease: { ability: "charisma", amount: 1 },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Mimicry",
          type: "passive",
          description:
            "Advantage on Deception/Performance while disguised, can mimic sounds",
        },
      ],
    },
  },
  {
    name: "Aerial Combatant",
    preview: "Combat expertise while flying broomsticks. +1 Str/Dex.",
    description: [
      "Increase Strength or Dexterity by 1.",
      "Gain broomstick proficiency.",
      "No longer suffer disadvantage on attack rolls while flying.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["strength", "dexterity"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {
        flyingAttackAdvantage: true,
      },
      spellcasting: {},
      specialAbilities: [
        {
          name: "Broomstick Proficiency",
          type: "passive",
          description:
            "Proficient with broomsticks, no disadvantage while flying",
        },
      ],
    },
  },
  {
    name: "Alert",
    preview: "Always ready for danger. +5 initiative, can't be surprised.",
    description: [
      "Can't be surprised while conscious.",
      "+5 bonus to initiative.",
      "Other creatures don't gain advantage from being unseen by you.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: ["surprised"],
      speeds: {},
      combatBonuses: {
        initiativeBonus: 5,
        unseeingAdvantageImmunity: true,
      },
      spellcasting: {},
      specialAbilities: [],
    },
  },
  {
    name: "Athlete",
    preview: "Physical prowess and mobility. +1 Str/Dex, climb speed.",
    description: [
      "Increase Strength or Dexterity by 1.",
      "Gain climb speed equal to your speed.",
      "Stand up from prone with only 5 feet movement.",
      "Make running jumps after moving only 5 feet.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["strength", "dexterity"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {
        climb: "equal_to_walking",
      },
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Athletic Movement",
          type: "passive",
          description:
            "Stand from prone with 5ft movement, running jumps after 5ft",
        },
      ],
    },
  },
  {
    name: "Cantrip Master",
    preview: "Master of cantrips. Cast some wandlessly and as bonus actions.",
    description: [
      "Increase spellcasting ability by 1.",
      "Cast one cantrip as bonus action per short rest.",
      "Cast locked-in cantrips without a wand.",
      "Can serve as prerequisite for Superior Wandless Casting.",
    ],
    benefits: {
      abilityScoreIncrease: { type: "spellcasting_ability", amount: 1 },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {
        bonusActionCantrip: { uses: 1, recharge: "short_rest" },
        wandlessCantrips: true,
      },
      specialAbilities: [],
    },
  },
  {
    name: "Detecting Traces",
    preview: "Sense and identify magical auras and spell schools.",
    description: [
      "Use concentration to sense magic within 30 feet.",
      "Can see faint auras and learn spell schools.",
      "Penetrates most barriers except 1 foot stone, 1 inch metal, or 3 feet wood/dirt.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Detect Magic",
          type: "active",
          usage: "concentration",
          range: 30,
          description:
            "Sense magic and identify spell schools through barriers",
        },
      ],
    },
  },
  {
    name: "Durable",
    preview: "Tough and resilient. +1 Con, advantage on death saves.",
    description: [
      "Increase Constitution by 1.",
      "Advantage on Death Saving Throws.",
      "As bonus action, expend Hit Die to regain hit points.",
    ],
    benefits: {
      abilityScoreIncrease: { ability: "constitution", amount: 1 },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {
        deathSaveAdvantage: true,
      },
      spellcasting: {},
      specialAbilities: [
        {
          name: "Bonus Action Healing",
          type: "active",
          usage: "bonus_action",
          resource: "hit_die",
          description: "Expend Hit Die as bonus action to heal",
        },
      ],
    },
  },
  {
    name: "Elixir Expertise",
    preview: "Potion mastery. +1 Wis/Int, add modifier to potion effects.",
    description: [
      "Increase Wisdom or Intelligence by 1.",
      "When using potions you created, add Wisdom modifier to effects.",
      "Applies to damage, healing, and Save DCs.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["wisdom", "intelligence"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Enhanced Potions",
          type: "passive",
          description: "Add Wisdom modifier to created potion effects",
        },
      ],
    },
  },
  {
    name: "Elemental Adept",
    preview: "Master one damage type. Ignore resistance, reroll 1s.",
    description: [
      "Increase Int/Wis/Cha by 1.",
      "Choose Acid, Cold, Fire, Lightning, or Thunder.",
      "Spells ignore resistance to that type.",
      "Treat 1s on damage dice as 2s.",
      "Repeatable for different elements.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["intelligence", "wisdom", "charisma"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {
        elementalMastery: {
          type: "choice",
          options: ["acid", "cold", "fire", "lightning", "thunder"],
          effects: ["ignore_resistance", "reroll_ones"],
        },
      },
      specialAbilities: [],
    },
  },
  {
    name: "Ember of the Fire Giant",
    preview:
      "Fire giant powers. +1 Str/Con/Wis, fire resistance, burning aura.",
    description: [
      "Increase Strength, Constitution, or Wisdom by 1.",
      "Gain resistance to fire damage.",
      "Searing Ignition: Replace one attack with 15-foot radius fire burst.",
      "Targets make Dex save (DC 8 + prof + ability mod) or take 1d8 + prof fire damage and blinded until next turn.",
      "Use prof bonus times per long rest, once per turn maximum.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["strength", "constitution", "wisdom"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: ["fire"],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Searing Ignition",
          type: "active",
          usage: "attack_replacement",
          uses: "proficiency_bonus",
          recharge: "long_rest",
          area: "15_foot_radius",
          damage: "1d8_plus_proficiency_fire",
          save: "dexterity",
          effect: "blinded_until_next_turn",
        },
      ],
    },
    prerequisites: {
      anyOf: [
        { type: "castingStyle", value: "Vigor Caster" },
        { type: "innateHeritage", value: "Giant's Blood" },
        { type: "innateHeritage", value: "Troll Blood" },
      ],
    },
  },
  {
    name: "Empowered Restoration",
    preview: "Enhanced healing magic and metamagic options.",
    description: [
      "Healing spells restore additional hit points equal to Intelligence modifier.",
      "Gain Empowered Healing metamagic option.",
      "Spend sorcery points to maximize healing dice.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {
        enhancedHealing: {
          type: "passive",
          bonus: "intelligence_modifier",
        },
        metamagicOptions: ["empowered_healing"],
      },
      specialAbilities: [
        {
          name: "Empowered Healing",
          type: "metamagic",
          description: "Spend sorcery points to maximize healing dice",
        },
      ],
    },
  },
  {
    name: "Fade Away",
    preview: "Vanish when hurt. +1 Dex/Int, reaction invisibility.",
    description: [
      "Increase Dexterity or Intelligence by 1.",
      "After taking damage, use reaction to become invisible until end of next turn.",
      "Invisibility ends if you attack, deal damage, or force saves.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["dexterity", "intelligence"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Fade Away",
          type: "reaction",
          trigger: "taking_damage",
          description: "Become invisible until end of next turn",
        },
      ],
    },
  },
  {
    name: "Flames of Fiendfyre",
    preview: "Command fiendfyre. +1 Int/Cha, reroll fire damage 1s.",
    description: [
      "Increase Intelligence or Charisma by 1.",
      "Reroll 1s on fire damage dice.",
      "When casting fire spells, become wreathed in flames until next turn.",
      "Melee attackers take 1d4 fire damage.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["intelligence", "charisma"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {
        fireEnhancement: {
          rerollOnes: true,
          flameWreath: "1d4_fire_damage_to_melee_attackers",
        },
      },
      specialAbilities: [
        {
          name: "Fiendfyre Wreath",
          type: "passive",
          trigger: "casting_fire_spells",
          description:
            "Wreathed in flames, melee attackers take 1d4 fire damage",
        },
      ],
    },
  },
  {
    name: "Fury of the Frost Giant",
    preview:
      "Frost giant powers. +1 Str/Con/Wis, cold resistance, icy retaliation.",
    description: [
      "Increase Strength, Constitution, or Wisdom by 1.",
      "Gain resistance to cold damage.",
      "Frigid Retaliation: When hit within 30 feet, use reaction for cold blast.",
      "Target makes Con save (DC 8 + prof + ability mod) or take 1d8 + prof cold damage and speed becomes 0 until next turn.",
      "Use prof bonus times per long rest.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["strength", "constitution", "wisdom"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: ["cold"],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Frigid Retaliation",
          type: "reaction",
          trigger: "being_hit_within_30_feet",
          uses: "proficiency_bonus",
          recharge: "long_rest",
          damage: "1d8_plus_proficiency_cold",
          save: "constitution",
          effect: "speed_0_until_next_turn",
        },
      ],
    },
    prerequisites: {
      anyOf: [
        { type: "castingStyle", value: "Vigor Caster" },
        { type: "innateHeritage", value: "Giant's Blood" },
        { type: "innateHeritage", value: "Troll Blood" },
      ],
    },
  },
  {
    name: "Guile of the Cloud Giant",
    preview: "Cloud giant powers. +1 Str/Con/Cha, defensive teleportation.",
    description: [
      "Increase Strength, Constitution, or Charisma by 1.",
      "Cloudy Escape: When hit by attack, use reaction for resistance to damage.",
      "Then teleport to unoccupied space within 30 feet that you can see.",
      "Use prof bonus times per long rest.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["strength", "constitution", "charisma"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Cloudy Escape",
          type: "reaction",
          trigger: "being_hit_by_attack",
          uses: "proficiency_bonus",
          recharge: "long_rest",
          effect: "resistance_to_damage_and_teleport_30_feet",
        },
      ],
    },
    prerequisites: {
      anyOf: [
        { type: "castingStyle", value: "Vigor Caster" },
        { type: "innateHeritage", value: "Giant's Blood" },
        { type: "innateHeritage", value: "Troll Blood" },
      ],
    },
  },
  {
    name: "Keenness of the Stone Giant",
    preview: "Stone giant powers. +1 Str/Con/Wis, darkvision, stone throwing.",
    description: [
      "Increase Strength, Constitution, or Wisdom by 1.",
      "Gain darkvision 60 feet (or increase existing by 60 feet).",
      "Stone Throw: As bonus action, make ranged spell attack (60 feet range).",
      "Hit deals 1d10 force damage and target makes Str save or falls prone.",
      "Use prof bonus times per long rest.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["strength", "constitution", "wisdom"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {
        darkvision: 60,
      },
      spellcasting: {},
      specialAbilities: [
        {
          name: "Stone Throw",
          type: "active",
          usage: "bonus_action",
          uses: "proficiency_bonus",
          recharge: "long_rest",
          range: 60,
          damage: "1d10_force",
          save: "strength",
          effect: "prone_on_failed_save",
        },
      ],
    },
    prerequisites: {
      anyOf: [
        { type: "castingStyle", value: "Vigor Caster" },
        { type: "innateHeritage", value: "Giant's Blood" },
        { type: "innateHeritage", value: "Troll Blood" },
      ],
    },
  },
  {
    name: "Lucky",
    preview: "Luck points for advantage/disadvantage manipulation.",
    description: [
      "Gain Luck Points equal to proficiency bonus.",
      "Spend 1 to give yourself advantage on d20 tests.",
      "Spend 1 to impose disadvantage on attacks against you.",
      "Regain all points on long rest.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Luck Points",
          type: "resource",
          amount: "proficiency_bonus",
          recharge: "long_rest",
          uses: ["advantage_on_d20", "disadvantage_on_attacks_against_you"],
        },
      ],
    },
  },
  {
    name: "Magic Initiate",
    preview: "Learn spells from another school of magic.",
    description: [
      "Choose a school of magic.",
      "Lock in two cantrips from that school.",
      "Learn one 1st level spell from same school.",
      "Cast the 1st level spell once per long rest at lowest level.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {
        spellsKnown: {
          cantrips: 2,
          firstLevel: 1,
        },
        extraSpellSlots: {
          level1: { uses: 1, recharge: "long_rest" },
        },
      },
      specialAbilities: [],
    },
  },
  {
    name: "Metamagic Adept",
    preview: "Additional metamagic options and sorcery points.",
    description: [
      "Learn two Metamagic options from sorcerer class.",
      "Gain 2 sorcery points for Metamagic use only.",
      "Can replace options on level up.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {
        metamagicOptions: { count: 2, type: "choice" },
        sorceryPoints: 2,
      },
      specialAbilities: [],
    },
  },
  {
    name: "Mobile",
    preview: "Speed and mobility in combat. +10 speed.",
    description: [
      "+10 feet speed.",
      "Difficult terrain doesn't slow Dash action.",
      "Melee attacks don't provoke opportunity attacks from target.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {
        walking: { bonus: 10 },
      },
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Mobile Combatant",
          type: "passive",
          description:
            "Difficult terrain doesn't slow Dash, melee attacks don't provoke opportunity attacks from target",
        },
      ],
    },
  },
  {
    name: "Observant",
    preview: "Sharp senses and lip reading. +1 Int/Wis.",
    description: [
      "Increase Intelligence or Wisdom by 1.",
      "Read lips if you can see mouth and understand language.",
      "+5 bonus to passive Perception and Investigation.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["intelligence", "wisdom"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {
        passivePerceptionBonus: 5,
        passiveInvestigationBonus: 5,
      },
      spellcasting: {},
      specialAbilities: [
        {
          name: "Lip Reading",
          type: "passive",
          description:
            "Read lips when you can see mouth and understand language",
        },
      ],
    },
  },
  {
    name: "Occlumency Training",
    preview: "Mental defenses against legilimens and veritaserum.",
    description: [
      "Wisdom save to resist legilimens initially with advantage on contests.",
      "Can feed false information if you choose.",
      "Immune to veritaserum unless willing.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: ["unwilling_veritaserum"],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Mental Defense",
          type: "passive",
          description:
            "Advantage on legilimens contests, can feed false information",
        },
      ],
    },
  },
  {
    name: "Pinpoint Accuracy",
    preview: "Precision with ranged spells. Ignore cover, crit on 19+.",
    description: [
      "Ranged spell attacks ignore half cover, treat 3/4 cover as half.",
      "Critical hit on 19+ for spell attacks.",
      "+1 to spell attack rolls.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {
        spellAttackBonus: 1,
        criticalRange: 19,
      },
      spellcasting: {
        ignoreHalfCover: true,
        reduceCover: true,
      },
      specialAbilities: [],
    },
  },
  {
    name: "Resilient",
    preview: "Gain proficiency in one saving throw. +1 to that ability.",
    description: [
      "Choose an ability you lack save proficiency in.",
      "Increase that ability by 1.",
      "Gain saving throw proficiency with it.",
    ],
    benefits: {
      abilityScoreIncrease: { type: "choice_any", amount: 1 },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [{ type: "choice", count: 1 }],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [],
    },
  },
  {
    name: "Savage Attacker",
    preview: "Deal maximum damage once per turn.",
    description: [
      "Once per turn when you hit with an attack.",
      "Roll damage dice twice and use either result.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Savage Attacker",
          type: "passive",
          usage: "once_per_turn",
          description: "Roll damage dice twice and use either result",
        },
      ],
    },
  },
  {
    name: "Sentinel",
    preview: "Control battlefield with opportunity attacks.",
    description: [
      "Opportunity attacks reduce target speed to 0.",
      "Creatures provoke opportunity attacks even with Disengage.",
      "React to attack creatures attacking your allies within 5 feet.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Sentinel",
          type: "passive",
          description: "Enhanced opportunity attacks and battlefield control",
        },
      ],
    },
  },
  {
    name: "Skill Expert",
    preview: "Become expert in skills. +1 ability, proficiency, expertise.",
    description: [
      "Increase one ability by 1.",
      "Gain proficiency in one skill.",
      "Choose one proficient skill to gain Expertise (double proficiency).",
    ],
    benefits: {
      abilityScoreIncrease: { type: "choice_any", amount: 1 },
      skillProficiencies: [{ type: "choice", count: 1 }],
      expertise: [{ type: "choice", count: 1 }],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [],
    },
  },
  {
    name: "Spell Sniper",
    preview: "Enhanced ranged spells. Double range, ignore cover.",
    description: [
      "Double range of attack roll spells.",
      "Ranged spell attacks ignore half and 3/4 cover.",
      "Lock in one attack roll cantrip from any list.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {
        spellRangeDouble: true,
        ignoreAllCover: true,
        cantripsLearned: 1,
      },
      specialAbilities: [],
    },
  },
  {
    name: "Superior Wandless",
    preview: "Cast all locked-in spells without a wand.",
    description: [
      "Prerequisites: Cantrip Master or Wandless Magic.",
      "Can cast any locked-in spells wandlessly, not just cantrips.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {
        superiorWandlessCasting: true,
      },
      specialAbilities: [],
    },
    prerequisites: {
      anyOf: [
        { type: "feat", value: "Cantrip Master" },
        { type: "feat", value: "Wandless Magic" },
      ],
    },
  },
  {
    name: "Tough",
    preview: "Increased hit points. +2 HP per level.",
    description: [
      "Hit Point maximum increases by 2 × character level.",
      "Gain +2 HP each time you level up thereafter.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {
        hitPointsPerLevel: 2,
      },
      spellcasting: {},
      specialAbilities: [],
    },
  },
  {
    name: "War Caster",
    preview: "Combat spellcasting. Advantage on concentration saves.",
    description: [
      "Increase Int/Wis/Cha by 1.",
      "Advantage on concentration saves.",
      "Cast spells as opportunity attacks instead of weapon attacks.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["intelligence", "wisdom", "charisma"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {
        concentrationAdvantage: true,
      },
      spellcasting: {
        spellOpportunityAttacks: true,
      },
      specialAbilities: [],
    },
  },
  {
    name: "Wandless Magic",
    preview: "Cast basic spells without a wand.",
    description: [
      "Cast these spells wandlessly if known: accio, alohomora, colovaria, illegibilus, incendio glacia, pereo, wingardium leviosa.",
      "Cannot use higher level spell slots.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {
        wandlessCasting: {
          spells: [
            "accio",
            "alohomora",
            "colovaria",
            "illegibilus",
            "incendio glacia",
            "pereo",
            "wingardium leviosa",
          ],
          restriction: "no_higher_slots",
        },
      },
      specialAbilities: [],
    },
  },

  // Heritage-specific feats
  {
    name: "Mature Harpy",
    preview: "Fully grown harpy wings and powers. Flying speed 50 feet.",
    description: [
      "Mighty Wings: Gain flying speed of 50 feet.",
      "Choose one: Soulcall or Feather Barrage.",
      "Soulcall: Action to sing, 30-foot radius Wisdom save or disadvantage on Perception vs others. Once per long rest.",
      "Feather Barrage: 30-foot cone, Dex save or 6d8 piercing + prone. Recharge 5-6, can't fly until end of next turn.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {
        flying: 50,
      },
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Harpy Powers",
          type: "choice",
          options: ["soulcall", "feather_barrage"],
          description: "Choose between Soulcall or Feather Barrage",
        },
      ],
    },
    prerequisites: {
      allOf: [
        { type: "innateHeritage", value: "Part-Harpy" },
        { type: "level", value: 8 },
      ],
    },
  },
  {
    name: "Mature Siren",
    preview: "Powerful siren song to charm multiple beings.",
    description: [
      "Siren Song: As action, charm beings up to proficiency bonus within 30 feet, or one being within 60 feet.",
      "Targets make Wisdom save vs spell save DC or charmed for 1 minute.",
      "Targets can repeat save at end of their turn.",
    ],
    benefits: {
      abilityScoreIncrease: null,
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Siren Song",
          type: "active",
          usage: "action",
          targets: "proficiency_bonus_within_30_feet_or_one_within_60_feet",
          save: "wisdom",
          effect: "charmed_1_minute",
          description: "Charm multiple beings with your siren song",
        },
      ],
    },
    prerequisites: {
      allOf: [
        { type: "innateHeritage", value: "Part-Siren" },
        { type: "level", value: 8 },
      ],
    },
  },
  {
    name: "Nimble",
    preview: "Enhanced agility and escape abilities. +1 Str/Dex.",
    description: [
      "Increase Strength or Dexterity by 1.",
      "+5 feet walking speed.",
      "Gain proficiency in Acrobatics or Athletics.",
      "Advantage on Strength (Athletics) or Dexterity (Acrobatics) to escape grapples.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["strength", "dexterity"],
        amount: 1,
      },
      skillProficiencies: [
        { type: "choice", skills: ["athletics", "acrobatics"], count: 1 },
      ],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {
        walking: { bonus: 5 },
      },
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Escape Artist",
          type: "passive",
          description:
            "Advantage on Athletics or Acrobatics to escape grapples",
        },
      ],
    },
    prerequisites: {
      anyOf: [
        { type: "innateHeritage", value: "Elf Legacy" },
        { type: "innateHeritage", value: "Goblin Cunning" },
        { type: "innateHeritage", value: "Part-Leprechaun" },
        { type: "innateHeritage", value: "Pukwudgie Ancestry" },
      ],
    },
  },
  {
    name: "Pukwudgie Constitution",
    preview: "Pukwudgie resilience. +1 Con, cold/poison resistance.",
    description: [
      "Increase Constitution by 1.",
      "Resistance to cold and poison damage.",
      "Advantage on saves against being poisoned.",
    ],
    benefits: {
      abilityScoreIncrease: { ability: "constitution", amount: 1 },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: ["cold", "poison"],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Poison Resistance",
          type: "passive",
          description: "Advantage on saves against being poisoned",
        },
      ],
    },
    prerequisites: {
      anyOf: [{ type: "innateHeritage", value: "Pukwudgie Ancestry" }],
    },
  },
  {
    name: "Telepathic",
    preview: "Telepathic communication abilities. +1 Int/Wis/Cha.",
    description: [
      "Increase Intelligence, Wisdom, or Charisma by 1.",
      "Telepathic Utterance: Speak telepathically to creatures within 60 feet.",
      "Must share a language for understanding.",
      "One-way communication only.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["intelligence", "wisdom", "charisma"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Telepathic Utterance",
          type: "active",
          range: 60,
          description: "One-way telepathic communication with shared language",
        },
      ],
    },
    prerequisites: {
      anyOf: [
        { type: "subclass", value: "Divinations" },
        { type: "subclass", value: "Grim Diviner" },
      ],
    },
  },
];
