export const standardFeats = [
  {
    name: "Accidental Magic Surge",
    preview: "Wild and unpredictable magical energy with surge effects.",
    description: [
      "You have the wild and unpredictable energy of accidental magic. As a Free Action, You can choose to enhance a spell you cast. Roll a d20, and on a roll of 5 or lower, you must roll on the magic surge table for a random effect. On a roll of 15 or higher, your spell's effects are amplified. This might result in increased damage, increased conditions, an expanded area of effect, or additional targets affected by the spell, according to DM's discretion.",
    ],
    benefits: {
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
      "Ability Score Increase: Increase your Charisma score by 1, to a maximum of 20.",
      "Impersonation: While you're disguised as a real or fictional person, you have Advantage on Charisma (Deception or Performance) checks to convince others that you are that person.",
      "Mimicry: You can mimic the sounds of other creatures, including speech. A creature that hears the mimicry must succeed on a Wisdom (Insight) check to determine the effect is faked (DC 8 plus your Charisma modifier and Proficiency Bonus).",
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
      "You're able to keep yourself oriented and lead your targets while flying a broomstick. You gain the following benefits.",
      "Increase your strength or Dexterity by 1, to a maximum of 20.",
      "You gain tool proficiency in Vehicles (Broomstick).",
      "You no longer suffer disadvantage on attack rolls due to flying.",
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
      toolProficiencies: ["Broomstick"],
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
      "Always on the lookout for danger, you gain the following benefits:",
      "You can't be surprised while you are conscious.",
      "You gain a +5 bonus to initiative.",
      "Other creatures don't gain advantage on attack rolls against you as a result of being unseen by you.",
    ],
    benefits: {
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
      "Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.",
      "Climb Speed: You gain a Climb Speed equal to your Speed.",
      "Hop Up: When you have the Prone condition, you can right yourself with only 5 feet of movement.",
      "Jumping: You can make a running Long or High Jump after moving only 5 feet.",
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
      "You have dedicated countless hours to the study and refinement of cantrips, honing your skills to a remarkable degree. Your mastery over these fundamental spells grants you exceptional control and versatility.",
      "Increase your spellcasting ability score by 1, to a maximum of 20.",
      "Once per short rest, you can cast one of your cantrips as a bonus action instead of an action. This allows you to quickly unleash the power of your cantrips, providing tactical flexibility in combat.",
      "You have developed the ability to cast your Locked-in cantrips without the need for a wand.",
      "This feat can serve as a prerequisite for the Superior Wandless Casting feat.",
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
      "You've learned to feel magic and recognize styles of spells and curses. Using concentration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn the associated spell's school of magic, if any. This ability can penetrate most barriers, but is blocked by 1 foot of stone, 1 inch of common metal, or 3 feet of wood or dirt.",
    ],
    benefits: {
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
      "Ability Score Increase: Increase your Constitution score by 1, to a maximum of 20.",
      "Defy Death: You have Advantage on Death Saving Throws.",
      "Speedy Recovery: As a Bonus Action, you can expend one of your Hit Point Dice, roll the die, and regain a number of Hit Points equal to the roll.",
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
      "You have mastered the art of unleashing potion magic with great effectiveness.",
      "Increase your Wisdom or Intelligence score by 1, to a maximum of 20.",
      "When you use a potion you have created, you can add your Wisdom modifier to the effects of the potion (such as damage, healing, or Save DC's).",
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
      "Ability Score Increase: Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.",
      "Energy Mastery: Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. Spells you cast ignore Resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2.",
      "Repeatable: You can take this feat more than once, but you must choose a different damage type each time for Energy Mastery.",
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
      specialAbilities: [
        {
          name: "Energy Mastery",
          type: "choice",
          options: ["Acid", "Cold", "Fire", "Lightning", "Thunder"],
          description: "Choose an energy type for mastery effects",
        },
      ],
    },
    repeatable: true,
    repeatableKey: "elementType",
  },
  {
    name: "Ember of the Fire Giant",
    preview:
      "Fire giant heritage. +1 Str/Con/Wis, fire resistance, flame burst.",
    description: [
      "Vigor Caster, Giant's Blood, or Troll Blood Required.",
      "You've manifested the fiery combat emblematic of fire giants, granting you the following benefits:",
      "Ability Score Increase: Increase your Strength, Constitution, or Wisdom by 1, to a maximum of 20.",
      "Born of Flame: You have resistance to fire damage.",
      "Searing Ignition: When you take the Attack action on your turn, you can replace a single attack with a magical burst of flame. Each creature of your choice in a 15-foot-radius sphere centered on you must make a Dexterity saving throw (DC equals 8 + your proficiency bonus + the modifier of the ability increased by this feat). On a failed save, a creature takes fire damage equal to 1d8 + your proficiency bonus, and it has the blinded condition until the start of your next turn. On a successful save, the creature takes half as much damage only. You can use your Searing Ignition a number of times equal to your proficiency bonus (but no more than once per turn), and you regain all expended uses when you finish a long rest.",
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
          usage: "prof_bonus_per_long_rest",
          description:
            "15-foot flame burst, 1d8 + prof fire damage, blinds on fail",
        },
      ],
    },
    prerequisites: {
      anyOf: [
        { type: "feat", value: "Vigor Caster" },
        { type: "innateHeritage", value: "Giant's Blood" },
        { type: "innateHeritage", value: "Troll Blood" },
      ],
    },
  },
  {
    name: "Empowered Restoration",
    preview: "Enhanced healing magic and metamagic options.",
    description: [
      "You have delved into the intricacies of healing magic and potions, honing your abilities as a master of arcane healing. This feat enhances your effectiveness in providing magical healing to yourself and others.",
      "You have learned to infuse your spells with restorative energy, enabling you to heal more effectively. Whenever you cast a spell that restores hit points to a creature, the healing amount is increased by your Intelligence modifier.",
      "New metamagic: Empowered Healing.",
      "When you cast a spell that restores hit points, you may spend a number of sorcery points up to your proficiency bonus. For each sorcery point spent in this way, maximize the amount healed per die involved. Ex: Two sorcery points on Episkey = 8 + spellcasting modifier hp restored.",
    ],
    benefits: {
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
      "You are clever, with a knack for charms magic. You have learned a magical trick for fading away when you suffer harm. You gain the following benefits:",
      "Increase your Dexterity or Intelligence by 1, to a maximum of 20.",
      "Immediately after you take damage, you can use a reaction to magically become invisible until the end of your next turn or until you attack, deal damage, or force someone to make a saving throw. Once you use this ability, you can't do so again until you finish a short or long rest.",
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
      "You learn to call on a fiendfyre to serve your commands. You gain the following benefits:",
      "Increase your Intelligence or Charisma by 1, to a maximum of 20.",
      "When you roll fire damage for a spell you cast, you can reroll any roll of 1 on the fire damage dice, but you must use the new roll, even if it is another 1.",
      "Whenever you cast a spell that deals fire damage, you can cause flames to wreathe you until the end of your next turn. The flames don't harm you or your possessions, and they shed bright light out to 30 feet and dim light for an additional 30 feet. While the flames are present, any creature within 5 feet of you that hits you with a melee attack takes 1d4 fire damage.",
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
      "Vigor Caster, Giant's Blood, or Troll Blood Required.",
      "You've manifested the icy might emblematic of frost giants, granting you the following benefits:",
      "Ability Score Increase: Increase your Strength, Constitution, or Wisdom by 1, to a maximum of 20.",
      "Born of Ice: You have resistance to cold damage.",
      "Frigid Retaliation: Immediately after a creature you can see within 30 feet of you hits you with an attack roll and deals damage, you can use your reaction to retaliate with a conjured blast of ice. The creature must make a Constitution saving throw (DC equals 8 + your proficiency bonus + the modifier of the ability increased by this feat). On a failed save, the creature takes cold damage equal to 1d8 + your proficiency bonus, and its speed is reduced to 0 until the end of its next turn. You can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
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
    name: "Get Whacked",
    preview: "Unarmed combat mastery with bonus action strikes. +1 Str or Dex.",
    description: [
      "Your practise of hand to hand combat gives you mastery over unarmed strikes, you gain the following benefits:",
      "Your Strength or Dexterity increases by 1 to a maximum of 20.",
      "You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes.",
      "Once per turn you can make one unarmed strike as a bonus action.",
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
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [
        {
          name: "Dexterity-Based Unarmed Strikes",
          type: "passive",
          description:
            "Use Dexterity instead of Strength for unarmed strike attacks and damage",
        },
        {
          name: "Bonus Unarmed Strike",
          type: "active",
          usage: "bonus_action",
          description:
            "Make unarmed strike as bonus action after attacking with weapon or unarmed strike",
        },
      ],
    },
  },
  {
    name: "Great Weapon Master",
    preview:
      "Heavy weapon mastery with powerful attacks and critical follow-ups.",
    description: [
      "You've learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes. You gain the following benefits:",
      "On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action.",
      "Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.",
    ],
    benefits: {
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
          name: "Critical Follow-up",
          type: "passive",
          description:
            "Bonus attack after critical hit or killing blow with melee weapon",
        },
        {
          name: "Power Attack",
          type: "active",
          description: "Take -5 to hit for +10 damage with heavy weapons",
        },
      ],
    },
  },
  {
    name: "Grappler",
    preview: "Grappling mastery with enhanced unarmed combat. +1 Str or Dex.",
    description: [
      "Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.",
      "Punch and Grab: When you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you can use both the Damage and the Grapple option. You can use this benefit only once per turn.",
      "Attack Advantage: You have Advantage on attack rolls against a creature Grappled by you.",
      "Fast Wrestler: You don't have to spend extra movement to move a creature Grappled by you if the creature is your size or smaller.",
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
        advantageConditions: ["Grappled targets"],
      },
      spellcasting: {},
      specialAbilities: [
        {
          name: "Punch and Grab",
          type: "active",
          usage: "once_per_turn",
          description:
            "Unarmed Strike can deal damage and grapple simultaneously",
        },
        {
          name: "Fast Wrestler",
          type: "passive",
          description:
            "No extra movement cost to move grappled creatures your size or smaller",
        },
      ],
    },
  },
  {
    name: "Guile of the Cloud Giant",
    preview: "Cloud giant powers. +1 Str/Con/Cha, defensive teleportation.",
    description: [
      "Vigor Caster, Giant's Blood, or Troll Blood Required.",
      "You've manifested the confounding magic emblematic of cloud giants, granting you the following benefits:",
      "Ability Score Increase: Increase your Strength, Constitution, or Charisma by 1, to a maximum of 20.",
      "Cloudy Escape: When a creature you can see hits you with an attack roll, you can use your reaction to give yourself resistance to that attack's damage. You then teleport to an unoccupied space that you can see within 30 feet of yourself. You can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
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
    name: "Inspiring Leader",
    preview:
      "Motivational leader granting temporary hit points to allies. +1 Wis or Cha.",
    description: [
      "Ability Score Increase: Increase your Wisdom or Charisma by 1, to a maximum of 20.",
      "Bolstering Performance: When you finish a Short or Long Rest, you can give an inspiring performance: a speech, song, or dance. When you do so, choose up to six allies (which can include yourself) within 30 feet of yourself who witness the performance. The chosen creatures each gain Temporary Hit Points equal to your character level plus the modifier of the ability you increased with this feat.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["wisdom", "charisma"],
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
          name: "Bolstering Performance",
          type: "active",
          usage: "short_or_long_rest",
          description:
            "Grant temp HP = level + ability mod to up to 6 allies within 30 feet",
        },
      ],
    },
  },
  {
    name: "Keenness of the Stone Giant",
    preview: "Stone giant powers. +1 Str/Con/Wis, darkvision, stone throwing.",
    description: [
      "Vigor Caster, Giant's Blood, or Troll Blood Required.",
      "You've manifested the physical talents emblematic of stone giants, granting you the following benefits:",
      "Ability Score Increase: Increase your Strength, Constitution, or Wisdom by 1, to a maximum of 20.",
      "Cavernous Sight: You gain darkvision with a range of 60 feet. If you already have darkvision from another source, its range increases by 60 feet.",
      "Stone Throw: As a bonus action, you can take a rock and make a magical attack with it. The attack is a ranged spell attack with a range of 60 feet that uses the ability score you increased with this feat as the spellcasting ability. On a hit, the rock deals 1d10 force damage, and the target must succeed on a Strength saving throw (DC equals 8 + your proficiency bonus + the spellcasting ability modifier) or have the prone condition. You can use this bonus action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
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
    name: "Keen Mind",
    preview:
      "Enhanced mental acuity. +1 Int, perfect direction sense, time awareness, and month-long memory.",
    description: [
      "You have a mind that can track time, direction, and detail with uncanny precision. You gain the following benefits.",
      "Increase your Intelligence score by 1, to a maximum of 20.",
      "You always know which way is north.",
      "You always know the number of hours left before the next sunrise or sunset.",
      "You can accurately recall anything you have seen or heard within the past month.",
    ],
    benefits: {
      abilityScoreIncrease: {
        ability: "intelligence",
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
          name: "Direction Sense",
          type: "passive",
          effect: "always_know_north",
        },
        {
          name: "Time Awareness",
          type: "passive",
          effect: "always_know_sunrise_sunset_timing",
        },
        {
          name: "Perfect Recall",
          type: "passive",
          effect: "recall_anything_past_month",
        },
      ],
    },
  },
  {
    name: "Linguist",
    preview: "Language and cipher expertise. +1 Int, learn 3 languages.",
    description: [
      "You have studied languages and codes, gaining the following benefits:",
      "Increase your Intelligence score by 1, to a maximum of 20.",
      "You learn three languages of your choice.",
      "You can ably create written ciphers. Others can't decipher a code you create unless you teach them, they succeed on an Intelligence check (DC equal to your Intelligence score + your proficiency bonus), or they use magic to decipher it.",
    ],
    benefits: {
      abilityScoreIncrease: { ability: "intelligence", amount: 1 },
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
          name: "Language Learning",
          type: "passive",
          description: "Learn three languages of your choice",
        },
        {
          name: "Cipher Creation",
          type: "passive",
          description:
            "Create written ciphers with DC = Intelligence + proficiency bonus",
        },
      ],
    },
  },
  {
    name: "Lucky",
    preview: "Luck points for advantage/disadvantage manipulation.",
    description: [
      "Luck Points: You have a number of Luck Points equal to your Proficiency Bonus and can spend the points on the benefits below. You regain your expended Luck Points when you finish a Long Rest.",
      "Advantage: When you roll a d20 for a D20 Test, you can spend 1 Luck Point to give yourself Advantage on the roll.",
      "Disadvantage: When a creature rolls a d20 for an attack roll against you, you can spend 1 Luck Point to impose Disadvantage on that roll.",
    ],
    benefits: {
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
    name: "Lycanthropy",
    preview:
      "Werewolf curse with enhanced senses but transformation penalties.",
    description: [
      "You've been attacked by a transformed werewolf, infecting you with the blood curse of lycanthropy. You gain the following benefits.",
      "Ability Score Increase: Increase your Strength and Constitution scores by 1, to a maximum of 20.",
      "Lupine Senses: You have advantage on Wisdom (Perception) checks that rely on smell.",
      "Pack Tactics: You advantage on an attack roll against a creature if at least one of your allies is within 5 ft. of the creature and the ally isn't incapacitated.",
      "You also gain the following penalties.",
      "From sunset to sunrise on the night of the full moon, you undergo your werewolf transformation. During the transformation, your alignment changes to Chaotic Evil and your character is placed under HM control.",
      "For the day of and three days after your werewolf transformation, you suffer a -3 penalty to your Constitution score, gain two levels of exhaustion that cannot be removed and have disadvantage on Constitution saving throws.",
      "If your condition becomes known, fellow witches and wizards might fear or discriminate against you.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "multiple",
        increases: [
          { ability: "strength", amount: 1 },
          { ability: "constitution", amount: 1 },
        ],
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {
        advantageConditions: [
          "Pack tactics with allies within 5 feet",
          "Perception checks that rely on smell",
        ],
      },
      spellcasting: {},
      specialAbilities: [
        {
          name: "Lupine Senses",
          type: "passive",
          description: "Advantage on Perception checks that rely on smell",
        },
        {
          name: "Lycanthropic Transformation",
          type: "curse",
          description:
            "Full moon transformation, post-transformation penalties",
        },
      ],
    },
  },
  {
    name: "Magic Initiate",
    preview: "Learn spells from another school of magic.",
    description: [
      "Choose a school of magic. You lock in two cantrips of your choice from that school, no matter what spell list it is from.",
      "In addition, choose one 1st level spell to learn from that same school of magic. Using this feat, you can cast the spell once at its lowest level, and you must finish a long rest before you can cast it in this way again.",
    ],
    benefits: {
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
    name: "Mage Slayer",
    preview:
      "Anti-magic combat specialist with concentration disruption. +1 Str or Dex.",
    description: [
      "Ability Score Increase: Increase your Strength or Dexterity by 1, to a maximum of 20.",
      "Concentration Breaker: When you damage a creature that is Concentrating, it has Disadvantage on the saving throw it makes to maintain Concentration.",
      "Guarded Mind: You have advantage on saving throws against spells cast by creatures within 5 feet of you.",
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
        advantageConditions: ["Saves vs spells from creatures within 5 feet"],
      },
      spellcasting: {},
      specialAbilities: [
        {
          name: "Concentration Breaker",
          type: "passive",
          description:
            "Damage gives target disadvantage on concentration saves",
        },
        {
          name: "Guarded Mind",
          type: "passive",
          description:
            "Advantage on saves vs spells from creatures within 5 feet",
        },
      ],
    },
  },
  {
    name: "Metamagic Adept",
    preview: "Additional metamagic options and sorcery points.",
    description: [
      "You've learned how to exert your will on your spells to alter how they function:",
      "You learn two Metamagic options of your choice from the sorcerer class. You can use only one Metamagic option on a spell when you cast it, unless the option says otherwise. Whenever you reach a level that grants the Ability Score Improvement feature, you can replace one of these Metamagic options with another one from the sorcerer class.",
      "You gain 2 sorcery points to spend on Metamagic (these points are added to any sorcery points you have from another source but can be used only on Metamagic). You regain all spent sorcery points when you finish a long rest.",
    ],
    benefits: {
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
      "You are exceptionally speedy and agile. You gain the following benefits:",
      "Your speed increases by 10 feet.",
      "When you use the Dash action, difficult terrain doesn't cost you extra movement on that turn.",
      "When you make a melee attack against a creature, you don't provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not.",
    ],
    benefits: {
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
    name: "Mounted Combatant",
    preview: "Combat expertise while mounted. +1 Str/Dex/Wis.",
    description: [
      "Ability Score Increase: Increase your Strength, Dexterity, or Wisdom by 1, to a maximum of 20.",
      "Mounted Strike: While mounted, you have Advantage on attack rolls against any unmounted creature within 5 feet of your mount that is at least one size smaller than the mount.",
      "Leap Aside: If your mount is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw and only half damage if it fails. For your mount to gain this benefit, you must be riding it, and neither of you can have the Incapacitated condition.",
      "Veer: While mounted, you can force an attack that hits your mount to hit you instead if you don't have the Incapacitated condition.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["strength", "dexterity", "wisdom"],
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
          name: "Mounted Strike",
          type: "passive",
          description:
            "Advantage on attacks against smaller unmounted creatures while mounted",
        },
        {
          name: "Leap Aside",
          type: "passive",
          description:
            "Mount takes no damage on successful Dex save, half on failure",
        },
        {
          name: "Veer",
          type: "reaction",
          description: "Force attacks against mount to hit you instead",
        },
      ],
    },
  },
  {
    name: "Mystic Surge",
    preview: "Metamagic mastery. 2 sorcery points, Surging Spell metamagic.",
    description: [
      "You have learned to channel your power with precision, infusing your spells with extra elemental energy and unleashing devastating surges of magic. This feat grants you the following benefits:",
      "You gain 2 sorcery points to spend on Metamagic (these points are added to any sorcery points you have from another source but can be used only on Metamagic). You regain all spent sorcery points when you finish a long rest.",
      "New metamagic: Surging Spell.",
      "Once per round, when you cast a spell that deals damage to two or fewer targets, you may expend a number of sorcery points up to your proficiency bonus. For each sorcery point spent in this way, add 1d6 damage to your total. You may choose the damage type from psychic, force, acid, cold, fire, lightning, thunder, or necrotic.",
      "You can use Surging Spell even if you have already used a different Metamagic option during the casting of the spell.",
      "You must choose to use this metamagic before seeing the result of the spell attack or saving throw roll.",
    ],
    benefits: {
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {
        sorceryPoints: 2,
        metamagicOptions: {
          count: 1,
          type: "specific",
          options: ["Surging Spell"],
        },
      },
      specialAbilities: [],
    },
  },
  {
    name: "Observant",
    preview: "Sharp senses and lip reading. +1 Int/Wis.",
    description: [
      "Quick to notice details of your environment, you gain the following benefits:",
      "Increase your Intelligence or Wisdom score by 1, to a maximum of 20.",
      "If you can see a creature's mouth while it is speaking a language you understand, you can interpret what it's saying by reading its lips.",
      "You have a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores.",
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
      "You have developed the presence of mind to resist a mental invasion. When targeted by legilimens, you make a Wisdom saving throw to resist its initial effects, and you have advantage on the Intelligence contests. If you fail your initial saving throw, you are immediately aware that the spell is targeting you. If you succeed on a saving throw or contest, you can let the spell continue and reveal false information, false emotions, or false memories of your choosing.",
      "Veritaserum will not work on you, unless you allow it.",
    ],
    benefits: {
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
      "You possess an uncanny accuracy when it comes to casting projectile spells. Your ranged spell attacks can effortlessly bypass cover, allowing you to strike your targets with remarkable precision.",
      "Your ranged spell attacks ignore up to half cover and treat three-quarters cover as if it were half cover.",
      "Your critical threshold for spell attack rolls is now 19 instead of 20. This does not stack with other abilities that reduce your critical threshold.",
      "Your keen eye and refined techniques grant you additional accuracy with your projectile spells. When making a spell attack for a +1 to Spell Attack rolls.",
    ],
    benefits: {
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
    name: "Polearm Master",
    preview: "Polearm expertise with bonus attacks and reach control.",
    description: [
      "You gain the following benefits:",
      "When you take the Attack action and attack with only a glaive or halberd, you can use a bonus action to make a melee attack with the opposite end of the weapon. This attack uses the same ability modifier as the primary attack. The weapon's damage die for this attack is a d4, and it deals bludgeoning damage.",
      "While you are wielding a glaive or halberd, other creatures provoke an opportunity attack from you when they enter the reach you have with that weapon.",
    ],
    benefits: {
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
          name: "Polearm Mastery",
          type: "passive",
          description:
            "Bonus butt-end attack with polearms, opportunity attacks when enemies enter reach",
        },
      ],
    },
  },
  {
    name: "Poison Expert",
    preview:
      "Master of poisons. +1 Wis/Con/Int, Potioneer's kit, -5 poison craft DC, advantage vs poison.",
    description: [
      "You have perfected the creation of poisons, their use, and developed a tolerance against them. You gain the following benefits:",
      "Increase your Wisdom, Constitution, or Intelligence score by 1, to a maximum of 20.",
      "You gain a Potioneer's kit and proficiency with a Potioneer's kit.",
      "Reduce 5 from the DC to craft the next quality tier of poisons (Ex: Superior DC is 30-5 = 25.)",
      "You have advantage on saving throws against poison.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["wisdom", "constitution", "intelligence"],
        amount: 1,
      },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      toolProficiencies: ["Potioneer's kit"],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {
        poisonSaveAdvantage: true,
      },
      spellcasting: {},
      specialAbilities: [
        {
          name: "Potioneer's Kit Proficiency",
          type: "passive",
          description:
            "You gain a Potioneer's kit and proficiency with a Potioneer's kit",
        },
        {
          name: "Poison Crafting Expertise",
          type: "passive",
          description:
            "Reduce 5 from the DC to craft the next quality tier of poisons",
        },
        {
          name: "Poison Resistance",
          type: "passive",
          description: "You have advantage on saving throws against poison",
        },
      ],
    },
  },
  {
    name: "Reckless Attacker",
    preview:
      "Reckless melee combat style. +1 Str, advantage for vulnerability.",
    description: [
      "you can throw aside all concern for defense to attack with fierce desperation, gaining the following benefits:",
      "Increase your Strength by 1, to a maximum of 20.",
      "When you make a melee weapon attack or unarmed strike on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.",
    ],
    benefits: {
      abilityScoreIncrease: { ability: "strength", amount: 1 },
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
          name: "Reckless Attack",
          type: "active",
          description:
            "Gain advantage on Strength-based melee attacks, but grant advantage to attackers",
        },
      ],
    },
  },
  {
    name: "Resilient",
    preview: "Gain proficiency in one saving throw. +1 to that ability.",
    description: [
      "Choose one ability score. You gain the following benefits:",
      "Ability Score Increase: Increase the chosen ability score by 1, to a maximum of 20.",
      "Saving Throw Proficiency: You gain saving throw proficiency with the chosen ability.",
      "Repeatable: You can take this feat more than once, but you must choose a different ability score each time.",
    ],
    benefits: {
      abilityScoreIncrease: { type: "choice_any", amount: 1 },
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: ["linked_to_ability_choice"],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {},
      specialAbilities: [],
    },
    repeatable: true,
    repeatableKey: "savingThrow",
  },
  {
    name: "Second Chance",
    preview: "Force enemy rerolls on successful hits. +1 Dex/Con/Cha.",
    description: [
      "Fortune favors you when someone tries to strike you. You gain the following benefits:",
      "Increase your Dexterity, Constitution, or Charisma by 1, to a maximum of 20.",
      "When a creature you can see hits you with an attack roll, you can use your reaction to force that creature to reroll. Once you use this ability, you can't use it again until you roll initiative at the start of combat or until you finish a short or long rest.",
    ],
    benefits: {
      abilityScoreIncrease: {
        type: "choice",
        abilities: ["dexterity", "constitution", "charisma"],
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
          name: "Second Chance",
          type: "reaction",
          usage: "once_per_combat_or_short_rest",
          description: "Force attacker to reroll successful hit",
        },
      ],
    },
  },
  {
    name: "Savage Attacker",
    preview: "Deal maximum damage once per turn.",
    description: [
      "You've trained to deal particularly damaging strikes. Once per turn when you hit a target with an attack, you can roll the damage dice twice and use either roll against the target.",
    ],
    benefits: {
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
    preview: "Defensive combat mastery. Opportunity attack control.",
    description: [
      "You have mastered techniques to take advantage of every drop in any enemy's guard, gaining the following benefits.",
      "When you hit a creature with an opportunity attack, the creature's speed becomes 0 for the rest of the turn.",
      "Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.",
      "When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn't have this feat), you can use your reaction to make a melee weapon attack against the attacking creature.",
    ],
    benefits: {
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
          name: "Guardian",
          type: "passive",
          description:
            "Opportunity attacks stop movement, ignore Disengage, protective strikes",
        },
      ],
    },
  },
  {
    name: "Sharpshooter",
    preview: "Ranged weapon mastery. Ignore range/cover penalties.",
    description: [
      "You have mastered ranged weapons and can make shots that others find impossible. You gain the following benefits:",
      "Attacking at long range doesn't impose disadvantage on your ranged weapon attack rolls.",
      "Your ranged weapon attacks ignore half and three-quarters cover.",
      "Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If that attack hits, you add +10 to the attack's damage.",
    ],
    benefits: {
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
          name: "Precision Shot",
          type: "passive",
          description:
            "No long range disadvantage, ignore cover, power attack option",
        },
      ],
    },
  },
  {
    name: "Skilled",
    preview: "Versatile training. Gain 3 skill or tool proficiencies.",
    description: [
      "You gain proficiency in any combination of three skills or tools of your choice.",
      "Repeatable. You can take this feat more than once.",
    ],
    benefits: {
      skillProficiencies: [{ type: "choice", count: 3 }],
      expertise: [],
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
    name: "Skill Expert",
    preview: "Become expert in skills. +1 ability, proficiency, expertise.",
    description: [
      "Ability Score Increase: Increase one ability score of your choice by 1, to a maximum of 20.",
      "Skill Proficiency: You gain proficiency in one skill of your choice.",
      "Expertise: Choose one skill in which you have proficiency but lack Expertise. You gain Expertise with that skill.",
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
      "You have learned techniques to enhance your attacks with certain kinds of spells, gaining the following benefits:",
      "When you cast a spell that requires you to make an attack roll, the spell's range is doubled.",
      "Your ranged spell attacks ignore half cover and three-quarters cover.",
      "You lock in one cantrip that requires an attack roll. You can choose this cantrip from any spell list.",
    ],
    benefits: {
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
    name: "Street Rat",
    preview: "Thievery expertise. +1 Dex, pickpocketing in combat.",
    description: [
      "You have learned the tricks of the trade of thievery, allowing you to exploit opportunities for pick-pocketing both in and out of combat. You gain the following benefits:",
      "Increase your Dexterity score by 1, to a maximum of 20.",
      "When a creature within 5 feet of you fails an attack roll against you in combat or performs an ability check that does not involve you, you can make a Dexterity (Sleight of Hand) check against a DC equal to 10 + the target's Dexterity modifier. On a success, you may steal any one item that is not being restrained or wielded by the target.",
    ],
    benefits: {
      abilityScoreIncrease: { ability: "dexterity", amount: 1 },
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
          name: "Opportunistic Theft",
          type: "reaction",
          description: "Steal items when enemies fail rolls within 5 feet",
        },
      ],
    },
  },
  {
    name: "Superior Wandless",
    preview: "Cast all locked-in spells without a wand.",
    description: [
      "Your skill with wandless magic has expanded. You can cast any locked in spells wandlessly.",
    ],
    benefits: {
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
    name: "Tattoo Artist",
    preview: "Magical tattooing. +1 Cha, tattoo kit, enchanted inks.",
    description: [
      "You have trained in the mystical and artistic craft of magical tattooing, learning to etch enchantments into living skin. You gain the following benefits:",
      "Ability Score Increase: Increase your Charisma by 1, to a maximum of 20.",
      "Tattooist: You gain proficiency with Tattoo Kit, which may include enchanted needles, inks, and binding stencils. If you and a willing recipient spend a Free Period or a full Downtime Slot together, you may attempt to inscribe a magical tattoo using one of the inks in your kit. You must succeed on a DC 16 Charisma (Performance) check to complete the tattoo properly. On a failure, the ink is wasted and the magic fails to bind.",
      "Inked: You gain access to a selection of enchanted inks and may choose three types of ink to include in your Tattoo Kit:",
      "Quicksilver Ink. Grants +5 feet to movement speed.",
      "Ironroot Ink. Grants a +1 bonus to Armor Class.",
      "Starseer Ink. Grants +1 to the spell save DC of all spells you cast.",
      "Golden Ash Ink. Grants proficiency in one Charisma-based skill of your choice.",
      "Umbral Glass Ink. Once per long rest, add +1d4 to a saving throw after rolling.",
      "Windshade Ink. Once per short rest, you may Dash as a bonus action.",
      "Sapphire Coil Ink. Grants proficiency in one Intelligence-based skill of your choice.",
      "Emberwake Ink. Once per long rest, when you deal damage with a spell or magical ability, you may reroll a number of damage dice equal to your proficiency bonus. You must keep the new results.",
      "Moonbind Ink (paired application). Two linked tattoos. Once per long rest, one bearer can use their reaction to grant the other resistance to the damage of one incoming attack.",
      "Crimson Spiral Ink. Once per long rest, when you roll a natural 20 on a weapon attack roll, you may immediately make an additional weapon attack or unarmed strike as part of the same action.",
      "Echowood Ink. Grants advantage on your first Initiative roll after a long rest.",
      "Frostvein Ink. Once per short rest, when you are hit by a melee attack, the attacker takes 1d6 cold damage.",
      "Duskmire Ink. Grants advantage on one Stealth check per long rest.",
      "Glassheart Ink. Grants resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.",
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
          name: "Tattooist",
          type: "active",
          description: "Create magical tattoos with enchanted inks",
        },
        {
          name: "Inked",
          type: "choice",
          description: "Choose three enchanted ink types for your kit",
        },
      ],
    },
  },
  {
    name: "Tavern Brawler",
    preview: "Unarmed combat expertise. Enhanced unarmed strikes.",
    description: [
      "Enhanced Unarmed Strike: When you hit with your Unarmed Strike and deal damage, you can deal Bludgeoning damage equal to 1d4 plus your Strength modifier instead of the normal damage of an Unarmed Strike.",
      "Damage Rerolls: Whenever you roll a damage die for your Unarmed Strike, you can reroll the die if it rolls a 1, and you must use the new roll.",
      "Improvised Weaponry: You have proficiency with improvised weapons.",
      "Push: When you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you can deal damage to the target and also push it 5 feet away from you. You can use this benefit only once per turn.",
    ],
    benefits: {
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {
        enhancedUnarmedStrike: true,
      },
      spellcasting: {},
      specialAbilities: [
        {
          name: "Brawler",
          type: "passive",
          description:
            "Enhanced unarmed strikes, improvised weapon proficiency, bonus grapple",
        },
      ],
    },
  },
  {
    name: "Tough",
    preview: "Increased hit points. +2 HP per level.",
    description: [
      "Your Hit Point maximum increases by an amount equal to twice your character level when you gain this feat. Whenever you gain a character level thereafter, your Hit Point maximum increases by an additional 2 Hit Points.",
    ],
    benefits: {
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
    name: "Wandless Magic",
    preview: "Cast specific spells without a wand.",
    description: [
      "Ability score Increase: Increase your spellcasting ability or your Dexterity by 1, to a maximum of 20.",
      "Wandless Casting: Through studying ancient tomes or channeling some of the volatile magic of your youth, you're able to perform small magical feats without your wand. If you know any of the following spells, you can cast them without needing a wand or somatic component: accio, alohomora, colovaria, illegibilus, incendio glacia, pereo, wingardium leviosa.",
      "Additionally you get the following effects:",
      "Once per long rest you may cast you may cast one of these spells as a reaction as long as you are not holding a wand",
      "Twice per long rest you may choose to cast one of these spells as a bonus action.",
      "You cannot expend a higher level spell slot when casting in this way.",
    ],
    benefits: {
      skillProficiencies: [],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: [],
      speeds: {},
      combatBonuses: {},
      spellcasting: {
        wandlessSpells: [
          "accio",
          "alohomora",
          "colovaria",
          "illegibilus",
          "incendio",
          "glacia",
          "pereo",
          "wingardium leviosa",
        ],
      },
      specialAbilities: [],
    },
  },
  {
    name: "Vampirism",
    preview:
      "Vampire traits with bite attack, darkvision, but sunlight weakness.",
    description: [
      "You gain the following benefits:",
      "You can see in dim light within 120 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.",
      "You can't die of old age, you suffer none of the drawbacks of old age, and you can't be aged magically.",
      "You gain proficiency in Charisma (Persuasion).",
      "You gain a minor animagus form using the stat block of a bat.",
      "Vampire Bite. As an action you can bite one willing creature, a creature that is grappled by you, or a creature that is incapacitated or restrained. Your bite attacks use your Dexterity ability for attack rolls, and on a hit deal 1d6 + Dexterity piercing damage, plus 2d6 necrotic damage. The target's hit point maximum is reduced by an amount equal to the necrotic damage taken, and you regain hit points equal to that amount. The reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0. Any target reduced to 0 hit points by a vampire bite will awaken as a Vampire in 1d4 days.",
      "You also gain the following penalties:",
      "You take 1 damage when you start your turn in direct sunlight.",
      "You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.",
      "You can't enter a residence without an invitation from one of the occupants.",
      "You are repelled by the smell of garlic, and touching or eating it causes intense pain.",
      "Instead of food and water, you must drink animal, human or magical being blood to sustain yourself.",
    ],
    benefits: {
      skillProficiencies: [{ skill: "persuasion", stat: "charisma" }],
      expertise: [],
      savingThrowProficiencies: [],
      resistances: [],
      immunities: ["aging"],
      speeds: {},
      combatBonuses: {
        darkvision: 120,
      },
      spellcasting: {},
      specialAbilities: [
        {
          name: "Vampire Bite",
          type: "active",
          usage: "action",
          damage: "1d6_piercing_plus_2d6_necrotic",
          description: "Bite attack that heals you and reduces target's max HP",
        },
        {
          name: "Bat Form",
          type: "active",
          description: "Minor animagus form using bat stat block",
        },
        {
          name: "Vampiric Weaknesses",
          type: "curse",
          description:
            "Sunlight damage and disadvantage, garlic aversion, invitation requirement, blood sustenance",
        },
      ],
    },
  },
  {
    name: "War Caster",
    preview: "Combat spellcasting. Advantage on concentration saves.",
    description: [
      "Ability Score Increase: Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.",
      "Concentration: You have Advantage on Constitution saving throws that you make to maintain Concentration.",
      "Reactive Spell: When a creature provokes an Opportunity Attack from you by leaving your reach, you can take a Reaction to cast a spell at the creature rather than making an Opportunity Attack. The spell must have a casting time of one action and must target only that creature.",
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
    name: "Mature Harpy",
    preview: "Fully grown harpy wings and powers. Flying speed 50 feet.",
    description: [
      "Prerequisite: Part-Harpy, Level 8",
      "When you take this feature you gain Mighty Wings and one of the following features.",
      "Mighty Wings: Your wings are now fully grown, you gain a flying speed of 50 feet.",
      "Soulcall: Your innate Harpy charm has earned you the ability to charm and beguile your enemies. You can use an action to sing the Soulcall, causing creatures within 30 feet to make a Wisdom saving throw with a DC equal to 8 + your proficiency bonus + your Charisma modifier. Any creature that can't be charmed succeeds on this saving throw automatically, and if you or your companions are fighting a creature, it has advantage on the save. On a failed save, the creatures have disadvantage on Wisdom (Perception) checks made to perceive any creature other than you until the spell ends or until the target can no longer hear you. The effect ends if you are incapacitated or can no longer speak.",
      "You may use this feature once per long rest.",
      "Feather Barrage (Recharge 5-6): You unleash a flurry of razor-sharp feathers from your wings, pelting all creatures within a 30-foot cone. Each creature in the area must make a DC 15 Dexterity saving throw. On a failed save, a creature takes 6d8 piercing damage and is knocked prone. On a successful save, they take half damage and are not knocked prone.",
      "The feathers used for this attack take time to regrow. If you use this ability, you cannot fly until the end of your next turn.",
    ],
    benefits: {
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
      "Part-Siren and Level 8 Required.",
      "As a young Siren, your vocal cords have not matured enough to produce a powerful enough charm effect. As you mature, you develop the ability to charm not only creatures, but beings as well. You gain the following abilities:",
      "As an action, you utilize your Siren Song to charm a number of beings up to your proficiency bonus within a 30 foot radius, or one being within a 60ft radius. The being(s) must make a Wisdom saving throw against your spell save DC or become charmed for 1 minute. The being may remake the saving throw at the end of its turn.",
    ],
    benefits: {
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
      "Elf Legacy, Goblin Cunning, Part-Leprechaun, Pukwudgie Ancestry Required.",
      "You are uncommonly nimble. You gain the following benefits:",
      "Increase your Strength or Dexterity by 1, to a maximum of 20.",
      "Increase your walking speed by 5 feet.",
      "You gain proficiency in the Acrobatics or Athletics skill (your choice).",
      "You have advantage on any Strength (Athletics) or Dexterity (Acrobatics) check you make to escape from being grappled.",
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
      "Pukwudgie runs strong in you, unlocking a resilience akin to that possessed by some Pukwudgies. You gain the following benefits:",
      "Increase your Constitution score by 1, to a maximum of 20.",
      "You have resistance to cold and poison damage.",
      "You have advantage on saving throws against being poisoned.",
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
      "You gain the following benefits.",
      "Ability Score Increase: Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.",
      "Telepathic Utterance: You can speak telepathically to any creature you can see within 60 feet of yourself. Your telepathic utterances are in a language you know, and the creature understands you only if it knows that language. Your communication doesn't give the creature the ability to respond to you telepathically.",
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
