export const subclassesData = {
  Charms: {
    name: "Charms",
    description:
      "Masters of precision magic and enchantments with advanced spell techniques and dueling expertise",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Bewitching Studies",
        description:
          "At 1st level, you gain Target Practice and one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Target Practice",
        description:
          "You've honed your aim to be able to strike very specifically with your dueling Charms. When casting a Charm, you can target specific items or body parts, as well as restrict the effects of the charm to only that specific item or body part.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Lightning Fast Wand",
            description:
              "You've honed your senses to be able to strike very specifically with your dueling Charms. Whenever you add your spellcasting ability modifier to a spell attack roll, add half your Dexterity modifier (rounded up) as a bonus as well. Additionally, you have advantage on initiative rolls.",
          },
          {
            name: "Protective Enchantments",
            description:
              "You gain access to the Protego spell. Additionally, when you cast a Protego, you may choose to affect a friendly creature within 30 feet. When you or a friendly creature is affected by one of your protego spells, they may roll 1d4 and add that number to the AC bonus of the spell.\n\nAt Higher Levels. At 5th level you gain access to the protego maxima spell, and when you cast a protego or protego maxima as a reaction, you may cast either spell a second time as a free reaction per round.",
          },
        ],
      },
      {
        level: 4,
        name: "Mastered Charms (Optional)",
        description:
          "At 4th level, you can optionally take this feature in place of an Ability score Improvement or Feat.\n\nMastered Charms: Increase your Dexterity score by 1, to a maximum of 20. Additionally, you have honed your skills with charms spells to be able to cast quickly and accurately. Choose five of your known cantrips as your Mastered Charms. You can cast each of them once with the use of a bonus action without expending sorcery points. When you do so, you can’t do so again until you finish a short or long rest.",
        choices: [],
      },
      {
        level: 6,
        name: "Advanced Charmswork",
        description: "At 6th level, you gain one of the following features.",
        choices: [
          {
            name: "Rapid Casting",
            description:
              "Whenever you cast a Charms spell as an action, you may cast another locked in Charms spell of 3rd level or lower as a part of that action.\n\nThe number of Charms spells you can cast per action increases to three when you reach 10th level and to four when you reach 18th level.",
          },
          {
            name: "Professional Charmer",
            description:
              "You have learned how to improve and even perfect your charms spells. You gain access to the Professional Charms spell enhancements listed at the end of this subclass.",
          },
        ],
      },
      {
        level: 9,
        name: "Double Cast",
        description:
          "At 9th level you’ve developed a heightened awareness of magical balance. When you cast a spell of 1st level or higher that does not deal damage, you can choose one additional target for the same spell within range, without expending an additional spell slot.\n\nYou can use this feature once per long rest.",
        choices: [],
      },
      {
        level: 10,
        name: "Powerful Magic",
        description: "At 10th level, you gain one of the following features.",
        choices: [
          {
            name: "Durable Spellwork",
            description:
              "The magic you channel helps ward off harm. While you maintain concentration on a spell, you have a +2 bonus to AC and all saving throws.",
          },
          {
            name: "Issued Command",
            description:
              "You have shown your allies that trusting in your knowledge of charmswork will help in a pinch. Once per round, you may interact with an ally and command them to cast one of your locked in charms spells. Your ally does not have to have the spell attempted and does not gain a successful casting attempt when following this command.\n\nYou may issue a command a number of times equal to half your proficiency bonus per long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "Refined Techniques",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "Wand and Shield",
            description:
              "You've uncovered an ancient dueling style, allowing both offense and defense at the same time. When you cast protego or protego maxima, you can transition the spell's casting to your off-hand, freeing up your wand to cast other spells. The spell's dedication now expends a bonus action instead of an action, and you are able to cast and maintain another concentration or dedication spell with your wand. Any factor that affects maintaining concentration is applied individually to each effect (e.g. upon taking damage make a Constitution saving throw for each spell).",
          },
          {
            name: "The Sound of Silence",
            description:
              "You are a master of being silent when it counts. If you don't already have it, Subtle Spell is added to your metamagic options and does not count towards your metamagic count. When you use the Subtle Spell metamagic to cast a spell of 1st level or lower silently, you can do so without expending a sorcery point. If you already have Subtle Spell as a metamagic, you may exchange it for a different metamagic of your choice.",
          },
        ],
      },
      {
        level: 18,
        name: "Pinnacle of Casting",
        description: "At 18th level, you gain one of the following features.",
        choices: [
          {
            name: "Called Shot",
            description:
              "Your work to be able to strike enemies under pressure has hit its peak. If you miss with a spell attack roll, you can roll it again with advantage. You can use this feature twice per rest.",
          },
          {
            name: "Force of Will",
            description:
              "Whenever a creature makes a saving throw against one of your Charms spells, it must do so at disadvantage. Additionally, any charm spell you cast that affects an area (cube, line, sphere, or cone) has its area's size doubled.",
          },
        ],
      },
    ],
  },
  "Jinxes, Hexes, and Curses": {
    name: "Jinxes, Hexes, and Curses",
    description:
      "Specialists in harmful magic, curse-breaking, and dark arts combat with Auror training or spell dismantling expertise",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Practical Studies",
        description: "At 1st level, you gain one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Auror Training",
            description:
              "You've already started practicing the required skills to become an Auror. You learn two common potion recipes or one uncommon potion recipe and gain an Auror’s kit containing tracking tools, disguise and false identity items and a vial that restores 1d4 HP per dose and contains a number of doses equal to your proficiency bonus per long rest. Additionally, you gain proficiency in two of the following: Investigation, Potion-Making, Stealth, Survival.",
          },
          {
            name: "Curse-Breaking",
            description:
              "Your curiosity in taking apart spells and enchantments has found an outlet. When you or an ally within 5 feet of you are the target of any Jinx, Hex, Curse or Dark spell, you can use your reaction to make a spellcasting ability check with a DC of 10+ the spell’s level. If you succeed, you change the spell into a locked in Jinx, Hex, Curse or Dark spell of your choosing.",
          },
        ],
      },
      {
        level: 6,
        name: "Combat-Ready",
        description: "At 6th level, you gain one of the following features.",
        choices: [
          {
            name: "Forceful Magic",
            description:
              "You cast every spell as if it were life-or-death. When you cast a spell that requires you to make a spell attack you can make an additional melee spell attack using your spell attack modifier as a part of that action. The damage for this attack is 1d8 + your spellcasting ability modifier.\n\nThis damage increases to 2d8 at 8th level, 3d8 at 10th level, and 4d8 at 12th level.",
          },
          {
            name: "Magical Adrenaline",
            description:
              "Your magic invigorates you in times of dire need. As a bonus action you can regain hit points equal to 1d10 + your level. You have a number of uses equal to 1 + your Constitution Modifier (with a minimum of 1), and all uses are restored after a long rest.",
          },
        ],
      },
      {
        level: 9,
        name: "Hex",
        description:
          "At 9th level when you hit a creature with a Jinx, Hex or Curse you can use your bonus action to deal additional damage to the target equal to your JHC modifier + your Charisma modifier.\n\nYou can use this feature a number of times equal to your JHC modifier per long rest.",
        choices: [],
      },
      {
        level: 10,
        name: "Specialized Skills",
        description: "At 10th level, you gain one of the following features.",
        choices: [
          {
            name: "Dark Traces",
            description:
              "The presence of strong evil registers on your senses like a noxious odor. As an action, you can open your awareness to detect such forces. Until the end of your next turn, you know the location of any Dark Beings or Dark magics (such as magical traps) within 60 feet of you that are not behind total cover. You know the type (human, beast, inferi) of any being whose presence you sense, but not its identity (Lord Voldemort, for instance).\n\nYou can use this feature a number of times equal to 1 + your Charisma modifier. When you finish a long rest, you regain all expended uses.",
          },
          {
            name: "Ward-Breaker",
            description:
              "Curse-Breaking required. You have perfected your ability of breaking spells and enchantments. When a hostile creature casts a Jinx, Hex, Curse or Dark spell with an area of effect (cube, line, sphere, or cone) you can use your reaction to make a spellcasting ability check with a DC of 12+ the spell’s level. If you succeed, you redirect the origin of the spell to be centered on the caster.",
          },
        ],
      },
      {
        level: 14,
        name: "Cursemaster",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "Dark Duelist",
            description:
              "Your experience fighting Dark wizards has taught you how to use their own techniques against them. You have advantage on any saving throws made against Jinxes, Hexes, Curses or Dark spells, and any Jinxes, Hexes, Curses, or Dark spells you cast are automatically cast one level higher than the consumed spell slot, not exceeding the highest available level of spell slots you have.",
          },
          {
            name: "Defensive Arts",
            description:
              "If a creature misses a ranged spell attack against you, or you succeed on a spell’s saving throw, you can blast the attacker with 4d6 arcane force damage as a reaction.",
          },
        ],
      },
      {
        level: 18,
        name: "Legendary",
        description: "At 18th level, you gain one of the following features.",
        choices: [
          {
            name: "Dark Manipulation",
            description:
              "You can use an action to summon two inferi to fight with you. You can’t use this feature again until you finish a long rest.",
          },
          {
            name: "Unravelling Magic",
            description:
              "You automatically succeed whenever casting Finite Incantatem and Langlock.",
          },
        ],
      },
    ],
  },
  Transfiguration: {
    name: "Transfiguration",
    description:
      "Masters of transformation magic with specializations in anatomy, elements, or magical weaponry",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Scientific Studies",
        description:
          "At 1st level, you gain Anatomy Textbook and one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Animagus Transformation",
            description:
              "You can use your action to magically assume the shape of your animagus form (see Your Animagus Form below). You can use this feature twice. You regain expended uses when you finish a short or long rest.",
          },
          {
            name: "Elementalist",
            description:
              "Your study of Alchemy has given you insights in the nature of elements. You can choose one of the following Effects:\nAny spell that involves only fire, water, earth, or air is automatically cast one level higher than the consumed spell slot, not exceeding the highest available level of spell slots you have.\nAny time you cast a spell that deals acid, cold, fire, lightning, or thunder damage, you deal an additional 1d4 damage. The damage die increases to 2d4 at 5th Level, 3d4 at 9th level, 4d4 at 13th level and 5d4 at 17th level.\nYou can use a bonus action on your turn to cause whirling gusts of elemental air to briefly surround you, immediately before or after you cast a spell of 1st level or higher. Doing so allows you to fly up to 10 feet without provoking opportunity attacks.",
          },
          {
            name: "Transfigured Armament",
            description:
              "You gain access to the Valiant spell list. Additionally, When you cast Vera Verto, you may transfigure your wand into the form of any singular melee weapon of your choosing. Your Transfigured Armament uses your Strength ability for attack and damage rolls. The damage dealt is considered magical for the purposes of overcoming resistance to damage from non-magical attacks.",
          },
        ],
      },
      {
        level: 4,
        name: "Transfigurations Boons",
        description:
          "At 4th level, you can optionally take one of these features in place of an Ability score Improvement or Feat.",
        choices: [
          {
            name: "Summon Spirit",
            description:
              "Elementalist Required. You can summon an elemental spirit and bind it to your will. As an action, you can summon a Poison (Acid damage), Ice (Cold Damage), Flame (Fire Damage), Lightning (Lightning Damage) or Wind (Thunder Damage) Spirit. The spirit appears in an unoccupied space of your choice that you can see within 30 feet of you. Each creature within 10 feet of the spirit (other than you) when it appears must succeed on a Dexterity saving throw against your spell save DC or take 2d6 damage of the Spirit’s associated type.\n\nThe spirit is friendly to you and your companions and obeys your commands. See this creature's game statistics in the Elemental Spirit stat block, which uses your proficiency bonus (PB) in several places. You determine the spirit's appearance.\n\nIn combat, the spirit shares your initiative count, but it takes its turn immediately after yours. The only action it takes on its turn is the Dodge action, unless you take a bonus action on your turn to command it to take another action. That action can be one in its stat block or some other action. If you are incapacitated, the spirit can take any action of its choice, not just Dodge.\n\nThe spirit manifests for 1 hour, until it is reduced to 0 hit points, until you use this feature to summon the spirit again, or until you die.\n\nYou can use this feature once per long rest.",
          },
          {
            name: "I Cast Smack",
            description:
              "Transfigured Armament Required. You cast any Cantrips or Valiant spells through your Transfigured Armament in place of a wand. Additionally, you can choose one of the following.\n\nArchery. You gain the ability to turn your Transfigured Armament into a ranged (80/320) weapon. You gain a +2 bonus to attack rolls you make with ranged weapons.\nSightless Swordsman. You have blindsight with a range of 10 feet. Within that range, you can effectively see anything that isn't behind total cover, even if you're blinded or in darkness. Moreover, you can see an invisible creature within that range, unless the creature successfully hides from you.\nDefensive. While you are wearing a cloak, you gain a +1 bonus to AC.\nFencer. When you are wielding your Transfigured Armament in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.\nDeep Cuts. When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit.\nThrown Armament. Your Transfigured Armament gains the thrown property (range 20/60). When you hit with a ranged attack using a thrown weapon, you gain a +2 bonus to the damage roll.\nDual Wielding. You learn how to duplicate your Transfigured Armament, creating an Illusory Armament in your off hand. Additionally, when you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack. Your damage die for the Illusory Armament  is 1d4.",
          },
        ],
      },
      {
        level: 6,
        name: "Transfiguration Prodigy",
        description: "At 6th level, you gain one of the following features.",
        choices: [
          {
            name: "Arcane Attacks",
            description:
              "Animagus Transformation Required. You can attack twice, instead of once, whenever you take the Attack action on your turn. Additionally, your attacks in your form count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.\n\nThe number of attacks increases to three at 18th level.",
          },
          {
            name: "Elemental Casting",
            description:
              "Elementalist Required. You gain access to the Elemental Casting spell list. Additionally, whenever you start casting a spell of 1st level or higher that deals acid, cold, fire, lightning, or thunder damage, magic erupts from you. This eruption causes creatures of your choice that you can see within 10 feet of you to take acid, cold, fire, lightning, or thunder damage (choose each time this ability activates) equal to half your level. This damage can activate once per turn.\n\nYou can do this a number of times equal to your proficiency bonus per long rest.",
          },
          {
            name: "Rune-Etched Weapon",
            description:
              "Transfigured Armament Required. Your understanding of your wand as both spellcasting implement and as a transfigured armament allows you to wield it as both with increased accuracy and effectiveness. You use your spell casting ability modifier instead of your strength or dexterity modifier for attack rolls and damage rolls with your Transfigured Armament.\n\nAs an action, you may expend 2 sorcery points to cast a spell to cast it as a touch spell, if the spell has the possibility of targeting more than 1 creature, it can be used to affect 1 creature.\nIf you have the Quickened Spell metamagic, you may instead cast this spell as a bonus action immediately after successfully hitting a target with your transfigured armament, using the result of the melee weapon attack roll to hit with the touch spell attack roll as well.\n\nAdditionally, you can cast any locked in spells through your Transfigured Armament as if it were a spell blade.",
          },
        ],
      },
      {
        level: 9,
        name: "Feats of Strength",
        description: "At 9th level, you gain one of the following features.",
        choices: [
          {
            name: "Aura of Valiance",
            description:
              "Transfigured Armament or Animagus Transformation Required. Whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Strength modifier (with a minimum bonus of +1). You must be conscious to grant this bonus.\n\nAt 18th level, the range of this aura increases to 30 feet.",
          },
          {
            name: "Elemental Push",
            description:
              "Elementalist Required. When you deal acid, cold, fire, lightning, or thunder damage to a Large or smaller creature, you can reduce that creature’s speed for 10 feet until the end of your next turn.\n\nAdditionally when you cast Incendio Ruptis, you can add your Strength Modifier to the damage it deals on a hit.",
          },
        ],
      },
      {
        level: 10,
        name: "Precise Control",
        description:
          "At 10th level, you gain Partial Transfiguration and one of the following features.",
        choices: [
          {
            name: "Partial Transfiguration",
            description:
              "Your understanding of magical theory has enabled you to compartmentalize your magic. Any transfiguration spell can be intentionally cast as a partial transfiguration, converting only the desired portion of the target. All the same capabilities and restrictions of casting those spells at higher levels apply.",
          },
          {
            name: "Molding the Elements",
            description:
              "Elementalist Required When you are hit by an attack, you can use your reaction to deal acid, cold, fire, lightning, or thunder damage to the attacker. The damage equals your level. The attacker must also make a Strength saving throw against your spell save DC. On a failed save, the attacker is pushed in a straight line up to 20 feet away from you, if they fail the save by 5 or more, they are knocked prone.",
          },
          {
            name: "Beast Caster",
            description:
              "Animagus Transformation Required While in your animagus form you gain the ability to cast locked in cantrips as a bonus action. All cantrips cast this way have a range of 10 feet and cannot gain the benefits of Sorcerer or Casting Style features.",
          },
          {
            name: "Power Strike",
            description:
              "Rune-Etched Weapon Required. When you use your action to cast a spell, you can make one weapon attack as a bonus action. Additionally, your weapon attacks score a critical hit on a roll of 19 or 20.",
          },
        ],
      },
      {
        level: 14,
        name: "Magically Reinforced",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "Durable Constructs",
            description:
              "You imbue your constructs of creatures with a more potent magic. Your transfigured or conjured living constructs gain temporary hit points equal to your level, deal an additional 1d6 of damage, and can support three times as much weight as their mundane equivalents.",
          },
          {
            name: "Will of the Wind",
            description:
              "You gain a magical flying speed of 60 feet. As an action, you can reduce your flying speed to 30 feet for 1 hour and choose a number of creatures within 30 feet of you equal to 3 + your Transfiguration modifier. The chosen creatures gain a magical flying speed of 30 feet for 1 hour. Once you reduce your flying speed in this way, you can't do so again until you finish a short or long rest.",
          },
          {
            name: "Bonded Weaponry",
            description:
              "Transfigured Armament Required. You learn a ritual that creates a magical bond between yourself and one weapon. You perform the ritual over the course of 1 hour, which can be done during a short rest. The weapon must be within your reach throughout the ritual, at the conclusion of which you touch the weapon and forge the bond.\n\nOnce you have bonded a weapon to yourself, you can't be disarmed of that weapon unless you are incapacitated. If it is on the same plane of existence, you can summon that weapon as a bonus action on your turn, causing it to teleport instantly to your hand. Additionally, when you are holding a bonded weapon, you have a +1 to AC.",
          },
        ],
      },
      {
        level: 18,
        name: "Molecular Manipulator",
        description: "At 18th level, you gain one of the following features.",
        choices: [
          {
            name: "Apex Predator",
            description:
              "Animagus Transformation required. You've achieved complete mastery over the mystical art of animagus transformations. You can transform on your turn as a bonus action, instead of an action Additionally, you can select two additional creatures as your animagus shapes, and you can choose to keep these shapes hidden from the Ministry of Magic. You may also choose to use any of these animals as your corporeal patronus.",
          },
          {
            name: "Element Blast",
            description:
              "Elementalist Required You gain immunity to two of the following damage types: acid, cold, fire, lightning, or thunder damage.\n\nAdditionally, when you cast a Transfiguration spell that deals damage, choose one creature damaged by that spell on the round you cast it. That creature takes extra acid, cold, fire, lightning, or thunder damage (choose when you take this feature) equal to half your level. This feature can be used only once per casting of a spell.",
          },
          {
            name: "Deadly Strike",
            description:
              "Transfigured Armament Required. You learn how to make your weapon strikes undercut a creature's resistance to your spells. When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn. Additionally, your weapon attacks score a critical hit on a roll of 18-20.",
          },
        ],
      },
    ],
  },
  Healing: {
    name: "Healing",
    description:
      "Medical specialists and field medics with enhanced healing magic and protective abilities",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Medical Studies",
        description:
          "At 1st level, you gain Star Grass Salve and one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Star Grass Salve",
        description:
          "You learn the recipe for star grass salve. When brewing a potion, you may make an Intelligence (Potion Making) or Wisdom (Medicine) check instead of a Wisdom (Potion Making) check. If you are using your action to administer a star grass salve to another creature, your star grass salve heals an additional amount of hit points equal to your level.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Unshakable Nerves",
            description:
              "Your study of injuries and magical diseases has given you a strong stomach and iron will. You cannot be frightened by non-magical effects, and have advantage on Constitution saving throws.",
          },
          {
            name: "Powerful Healer",
            description:
              "Your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell's level.",
          },
          {
            name: "Therapeutic Friendship",
            description:
              "You can forge an empowering bond among people who consider themselves your friends. As an action, you can choose a number of willing creatures within 30 feet of you (this can include yourself) equal to your proficiency bonus. You create a magical bond among them for 10 minutes or until you use this feature again. While any bonded creature is within 30 feet of another, the creature can roll a d4 and add the number rolled to an attack roll, an ability check, or a saving throw it makes. Each creature can add the d4 no more than once per turn.\n\nYou can use this feature once per long rest.",
          },
        ],
      },
      {
        level: 4,
        name: "Restorative Presence (Optional ASI)",
        description:
          "At 4th level, you can optionally take one of these features in place of an Ability score Improvement or Feat.",
        choices: [
          {
            name: "Preserve Life",
            description:
              "As an action, you evoke healing energy that can restore a number of hit points equal to five times your level. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can't use this feature on an undead or a construct.\n\nYou can use this feature a number of times equal to half of your proficiency bonus.",
          },
          {
            name: "Life Balm",
            description:
              "As an action, you can move up to your speed, without provoking opportunity attacks, and when you move within 5 feet of any other creature during this action, you can restore a number of hit points to that creature equal to 2d6 + your spellcasting ability modifier (minimum of 1 hit point). A creature can receive this healing only once whenever you take this action.\n\nYou can use this feature a number of times equal to half of your proficiency bonus.",
          },
        ],
      },
      {
        level: 6,
        name: "Dedicated Protector",
        description: "At 6th level, you gain one of the following features.",
        choices: [
          {
            name: "An Ounce of Prevention",
            description:
              "Powerful Healer Required. The healing spells you cast on others heal you as well. When you cast a spell of 1st level or higher that restores hit points to a creature other than you, you regain hit points equal to 2 + the spell's level.",
          },
          {
            name: "A Saving-People Thing",
            description:
              "Therapeutic Friendship Required. You and your friends will throw yourself in the line of fire to protect each other. When a creature affected by your Therapeutic Friendship feature is about to take damage, a second Friend within 30 feet can use their reaction to cast protego and teleport in front of that creature to an unoccupied space within 5 feet of that creature. The second creature then takes all of the damage if the attack still hits.",
          },
          {
            name: "Potent Spellcasting",
            description:
              "You gain the ability to power your attacks with your will to protect your friends. Once on each of your turns when you hit a creature with a spell attack, you can cause the spell to deal an extra 1d8 radiant damage to the target. When you reach 14th level, the extra damage increases to 2d8.",
          },
        ],
      },
      {
        level: 9,
        name: "Spell Breaker",
        description:
          "At 9th Level when you restore hit points to an ally with a spell of 1st level or higher, you can also end one spell of your choice on that creature. The level of the spell you end must be equal to or lower than the level of the spell slot you use to cast the healing spell.",
        choices: [],
      },
      {
        level: 10,
        name: "Moral Support",
        description: "At 10th level, you gain one of the following features.",
        choices: [
          {
            name: "Never Give Up",
            description:
              "Your presence on the battlefield is a sign to allies that all will be well, and no person will be left behind on your watch. So long as you are conscious, allies within 60 feet of you have advantage on death saving throws. Allies stabilized or healed from the dying state by your spells, potions, or other healing actions within this range receive a bonus to hit points restored equal to your level.",
          },
          {
            name: "Emergency Care Plan",
            description:
              "Your unparalleled ability to keep track of your allies and those in need in times of crisis and emergency is an asset to anybody in a state of dire need. All of your Healing spells’ ranges are doubled. If a Healing spell has a range of touch, its new range is 60 feet. All healing spells you cast on targets within your spellcasting range may be cast as long as you can hear them.",
          },
          {
            name: "When It Matters",
            description:
              "You’ve spent your entire life so far caring for others and keeping them safe, keeping them happy, and keeping them from harm. It’s only right that those closest to you would want to return the favor. When appropriate, (DMs discretion), and you are rolling for initiative, a romantic partner, best friend and/or other significantly appropriate NPC may apparate to your side and come to your defense.",
          },
        ],
      },
      {
        level: 14,
        name: "Combat Medic",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "Phoenix Tears",
            description:
              "Your saint-like devotion to others and bravery in the face of danger has earned the respect of phoenixes. If you spend 8 hours reaching out with your magic, a phoenix will appear in a flash of fire and shed tears into a vial for you. Phoenix tears remove all curses, diseases, and poisons affecting a creature. Also, the creature regains all its hit points. A phoenix will only appear and fill a vial with tears when you do not have any other tears, and the phoenix tears will lose their healing properties if anyone other than you possesses the tears or tries to administer them.",
          },
          {
            name: "Bold Caster",
            description:
              "You add your Healing Modifier to the damage you deal with any locked in Cantrips.",
          },
        ],
      },
      {
        level: 18,
        name: "Savior",
        description: "At 18th level, you gain one of the following features.",
        choices: [
          {
            name: "Empathic Bond",
            description:
              "A Saving-People Thing Required. The benefits of your Theraputic Friendship and A Saving-People Thing features now work when the creatures are within 60 feet of each other. Moreover, when a creature uses A Saving-People Thing to take someone else's damage, the creature has resistance to that damage.",
          },
          {
            name: "Supreme Healing",
            description:
              "When you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die. For example, instead of restoring 2d6 hit points to a creature, you restore 12.",
          },
        ],
      },
    ],
  },
  Divinations: {
    name: "Divinations",
    description:
      "Seers and mind-readers with foresight abilities, mental manipulation, and mystical perception",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Clairvoyant Studies",
        description:
          "At 1st level, you gain a Diviner's Kit and proficiency in using a Diviner's Kit, and you add half your proficiency bonus to your Initiative and cannot be surprised while conscious. Additionally, you choose one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Foresight",
            description:
              "You start to see omens everywhere you look. After a long rest, roll two d20s and record those rolls as your two foresight rolls.\n\nWhen you or a creature you can see is about to make an attack roll, saving throw, or ability check, you can expend one of your foresight rolls to use that number, once per turn. After a long rest, you lose and reroll your foresight rolls. At level 10, you gain another foresight roll, for a total of 3.",
          },
          {
            name: "Legilimency",
            description:
              "You add the legilimens spell to your list of locked in spells. Additionally, your skill in navigating thoughts is unparalleled. You can now cast legilimens at-will, verbally or non-verbally. Any attempt to resist your legilimens spell is made at disadvantage.",
          },
        ],
      },
      {
        level: 6,
        name: "Farseeing",
        description: "At 6th level, you gain one of the following features.",
        choices: [
          {
            name: "Font of Divination",
            description:
              "Casting divination spells comes so easily to you that it expends only a fraction of your spellcasting efforts. When you cast a divination spell of 2nd level or higher using a spell slot, you regain one expended spell slot. The slot you regain must be of a level lower than the spell you cast and can't be higher than 5th level.",
          },
          {
            name: "Skilled Occlumens",
            description:
              "Legilimens and veritaserum will not work on you, unless you allow it. You can choose to let legilimens continue and reveal false information, false emotions, or false memories of your choosing.",
          },
        ],
      },
      {
        level: 9,
        name: "Sensing Danger",
        description:
          "At 9th Level your ability to see the future gives advantages in combat. You add your full proficiency bonus to your initiative and can add half of your Divinations modifier (Rounded up with a minimum of +1) to your AC.",
        choices: [],
      },
      {
        level: 10,
        name: "The Unseeable",
        description: "At 10th level, you gain one of the following features.",
        choices: [
          {
            name: "Third Eye",
            description:
              "You can use your action to increase your powers of perception. When you do so, choose one of the following benefits, which lasts until you are incapacitated or you take a short or long rest. You can't use the feature again until you finish a short or long rest.",
          },
          {
            name: "Mystic Sleep",
            description:
              "When you finish a rest, you can use one of the following abilities.\n\nChoose a creature known to you as the target of this ability. You, or a willing creature you touch, enters a trance state, acting as a messenger. While in the trance, the messenger is aware of their surroundings, but can’t take actions or move.\n\nIf the target is asleep, the messenger appears in the target’s dreams and can converse with the target as long as it remains asleep, through the duration of the spell. The messenger can also shape the environment of the dream, creating landscapes, objects, and other images. The messenger can emerge from the trance at any time, ending the effect of the spell early. The target recalls the dream perfectly upon waking. If the target is awake when you cast the spell, the messenger knows it, and can either end the trance (and the spell) or wait for the target to fall asleep, at which point the messenger appears in the target’s dreams.\n\nYou can make the messenger appear monstrous and terrifying to the target. If you do, the messenger can deliver a message of no more than ten words and then the target must make a Wisdom saving throw. On a failed save, echoes of the phantasmal monstrosity spawn a nightmare that lasts the duration of the target’s sleep and prevents the target from gaining any benefit from that rest. In addition, when the target wakes up, it takes 3d6 psychic damage.\n\nIf you have a body part, lock of hair, clipping from a nail, or similar portion of the target’s body, the target makes its saving throw with disadvantage.\n\nYou can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it. If a target knows you’re casting this spell, it can fail the saving throw voluntarily if it wants to be observed. SCRYING TABLE On a successful save, the target isn’t affected, and you can’t use this spell against it again for 24 hours.\n\nOn a failed save, the spell creates an invisible sensor within 10 feet of the target. You can see and hear through the sensor as if you were there. The sensor moves with the target, remaining within 10 feet of it for the duration. A creature that can see invisible objects sees the sensor as a luminous orb about the size of your fist.\n\nInstead of targeting a creature, you can choose a location you have seen before as the target of this spell. When you do, the sensor appears at that location and doesn’t move.\n\nYou draw a 10-foot-diameter circle on the ground inscribed with sigils that opens a portal to the last location where you finished a long rest. Any creature that enters the portal instantly appears within 5 feet of the destination or in the nearest unoccupied space if that space is occupied.\n\nOnce you use this feature, you can't use it again until you finish a long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "Revealed Intentions",
        description:
          "At 14th level, once per downtime you may choose to automatically succeed on any failed Activity or Relationship slot. You may also choose one of the following features.",
        choices: [
          {
            name: "Greater Foresight",
            description:
              "Foresight Required. You may reroll one Foresight roll per day. You must use the new roll.",
          },
          {
            name: "Darting Eyes",
            description:
              "Legilimency required. As a bonus action, you can cast legilimens in combat to beguile a humanoid that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. The creature always rolls this saving throw without disadvantage.\n\nWhile the target is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence. You can use this telepathic link to issue commands to the creature while you are conscious (no action required), which it does its best to obey. You can specify a simple and general course of action, such as “Attack that creature,” “Run over there,” or “Fetch that object.” If the creature completes the order and doesn’t receive further direction from you, it defends and preserves itself to the best of its ability.\n\nYou can use your action to take total and precise control of the target. Until the end of your next turn, the creature takes only the actions you choose, and doesn’t do anything that you don’t allow it to do. During this time you can also cause the creature to use a reaction, but this requires you to use your own reaction as well. If you do so, you immediately gain one corruption point not exceeding a total of four corruption points.\n\nEach time the target takes damage, it makes a new Wisdom saving throw against the spell. If the saving throw succeeds, the spell ends. This spell has no effect on an Occlumens.",
          },
        ],
      },
      {
        level: 18,
        name: "Mystical Knowledge",
        description: "At 18th level, you gain one of the following features.",
        choices: [
          {
            name: "Vivid Visions",
            description:
              "Your connection to your Inner Eye gives you lucid visions of the immediate future. As a bonus action, you can see a vision of your next action and its immediate consequences, rolling any required rolls and hearing a description of the results. If you choose that action, your vision becomes reality, using all the same rolls. The vision is instantaneous, and takes up no time. After you use this ability, you can’t use it again until you finish a long rest.",
          },
          {
            name: "Master of Minds",
            description:
              "Legilimency required. Your skill in navigating thoughts is unparalleled. Any time you cast Legillimens, as an action, you can force the target to succeed on a Wisdom saving throw, taking 4d8 psychic damage on a failed save, or half as much damage on a successful one.\n\nAt Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.",
          },
        ],
      },
    ],
  },
  Magizoology: {
    name: "Magizoology",
    description:
      "Beast masters and creature experts with magical companions, nature magic, and creature communication abilities",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Biological Studies",
        description:
          "At 1st level, your study of magical creatures has taught you about their injuries and physiologies. You can cast any known Healing spells on beasts. You also gain a small trunk that carries all of your magical beasts inside. Additionally, you gain one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Studious",
            description:
              "You gain expertise in Magical Creatures checks. You have your own personal notebook of beasts where you document your findings. Whenever you add your Magical Creatures proficiency to an Ability check, add your Intelligence modifier as well.",
          },
          {
            name: "Creature Empathy",
            description:
              "You have an innate ability to communicate with bestial creatures, and how to read their needs and emotions. As an action, you can communicate simple ideas to a creature with an Intelligence of 3 or higher and can read its basic mood and intent. You learn its emotional state, whether it is affected by magic of any sort, its short-term needs (such as food or safety), and actions you can take (if any) to urge it to not attack.",
          },
        ],
      },
      {
        level: 6,
        name: "Way of the Wild",
        description:
          "At 6th level, you gain Wizard’s Best Friend and one of the following features.",
        choices: [
          {
            name: "Basically a Disney Princess",
            description:
              "You gain access to the Magizoo Spell List. You may attempt to cast these spells in Care for Magical Creatures Class.",
          },
          {
            name: "Prepared Ambush",
            description:
              "In learning to combat dangerous targets, you know how to place a magical trap, waiting to be sprung. When you cast a spell that targets a single creature or area using a spell slot of 1st level or higher, you can weave that spell into your surroundings, having no immediate effect. The spell is cast when it is triggered by something, which you decide at the time of setting the trap, such as entering an area, getting within a certain distance, or manipulating an object. You can also set conditions for creatures that don't trigger the spell, such as specific people or those who say a certain password.\n\nIf the spell requires a target, the spell can only target one triggering creature, or if it affects an area, the spell's area of effect is centered on the triggering creature. If the spell conjures hostile creatures, they appear as close as possible to the triggering creature and attack. If the spell requires concentration, it lasts its full duration. A trap can be detected by a successful Intelligence (Investigation) check against your spell save DC, or by casting specialis revelio.",
          },
        ],
      },
      {
        level: 9,
        name: "Call Beasts",
        description:
          "At 9th Level you can let out a high pitched wail alerting nearby creatures and calling them to your aid. As a reaction when a creature within 60 feet moves in any direction, a swarm of small creatures attack a 5 foot square where the creature stops. A creature takes 2d12 slashing damage  when it enters the swarmed area for the first time on a turn or when it starts its turn there.\n\nYou may use this feature once per short rest.",
        choices: [],
      },
      {
        level: 10,
        name: "Outdoorswizard",
        description:
          "At 10th level, you gain one of the following features and Gentle Caretaker.",
        choices: [
          {
            name: "Survivalist",
            description:
              "You are particularly adept at traveling through and surviving in natural environments.\n\nYou gain proficiency in Herbology and Survival. If you are already proficient, gain expertise in both Herbology and Survival. Also, you and your group gain the following benefits:\n\nDifficult terrain doesn’t slow your group’s travel.\nMoving through non-magical difficult terrain costs you no extra movement. You can also pass through non-magical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.\nYour group can't be surprised while resting, as long as you, a member of your party, or your Beast Companion are keeping watch.\nIn addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such as those made by the Herbivicus spell.",
          },
          {
            name: "Monster Hunting",
            description:
              "You have vast experience studying, tracking, and hunting creatures, allowing you to quickly adapt to threats. You gain the ability to peer at a creature and discern how best to hurt it. Choose one creature you can see within 60 feet of you as a bonus action, they must make a Wisdom save.  You may spend two sorcery points to have the save be at disadvantage. Upon failure, you immediately learn whether the creature has any damage immunities, resistances, or vulnerabilities and what they are. If the creature is hidden from divination magic, you sense that it has no damage immunities, resistances, or vulnerabilities.\n\nYou can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses of it when you finish a long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "Genus Genius",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "Beast Whisperer",
            description:
              "You've learned the body language and social rituals of many beasts. As an action, you can use a Wisdom (Magical Creatures) check to attempt to soothe and calm a hostile beast. On success, the beast believes you mean it no harm and is neutral to the party. The effect is canceled if you or a party member inflicts any damage or condition on that beast or any identical beasts. You cannot use this feature again until you complete a short or long rest.",
          },
          {
            name: "Exploited Vulnerabilities",
            description:
              "You know exactly how to hit where it hurts. As a bonus action, you can call out an enemy's weaknesses to your allies. The target takes an additional 2d8 damage from your allies' damaging spells until the start of your next turn. You have a number of uses equal to your Intelligence modifier, and uses are restored after a long rest.",
          },
          {
            name: "Based Magizoologist",
            description:
              "Gentle Caretaker Required. Your magic has adapted to your personality and safeguards the beasts you are bonded to. When your Beast Companion ends its turn within 20 ft of you, that creature regains a number of hit points equal to half your level.",
          },
          {
            name: "Friend of All",
            description:
              "Creatures of the natural world recognize your reverence for nature and become hesitant to attack you. When a beast or plant creature attacks you, that creature must make a Wisdom saving throw against your spell save DC. On a failed save, the creature must choose a different target, or the attack automatically misses. On a successful save, the creature is immune to this effect for 24 hours.\n\nThe creature is aware of this effect before it makes its attack against you.",
          },
        ],
      },
      {
        level: 18,
        name: "Sixth Sense",
        description: "At 18th level, you gain one of the following features.",
        choices: [
          {
            name: "Draconic Empathy",
            description:
              "Wizard's Best Friend required. Your dedication as a dragon-keeper allows you to deeply understand dragons. If you've ever raised a dragon from an egg, it will view you as an ally and can serve as your beast companion. Tamed dragons have their own hit points, hit dice, and ability scores, and use natural attack actions.",
          },
          {
            name: "Hunter's Reflexes",
            description:
              "You've precisely honed your instincts in combat. As a reaction to a creature you can see casting a spell or attacking, you can cast a spell with a casting time of one action, bonus action, or reaction, targeting only that creature. Conditions and damage are applied before the target completes their action. Damage dealt to the target imposes disadvantage on its attack roll. You can use this feature a number of times equal to your proficiency bonus before you complete a short or long rest.",
          },
        ],
      },
    ],
  },
  "Dark Arts": {
    name: "Dark Arts",
    description:
      "Masters of forbidden magic and shadow techniques who embrace corruption to gain power through dark spells and malicious enchantments",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Tricks of the Trade",
        description:
          "At 1st level, you learn how to make Liquid Darkness and your choice of one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Liquid Darkness",
        description:
          "You learn the recipe to create a potion known as Liquid Darkness. Additionally, your cunning may assist you when brewing a potion in class or with allies. When you make a Wisdom (Potion Making) check you may instead use Charisma (Persuasion) or Wisdom (Perception), representing time spent asking for help (Persuasion) or cheating off others (Perception).",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Embracing the Darkness",
            description:
              "As you embrace the darkness of the Dark Arts you grow ever more powerful. You gain a number of additional Sorcery Points equal to the number of Corruption Points you have, but take 1d4 points of Psychic Damage per corrupted sorcery point used.",
          },
          {
            name: "Malice",
            description:
              "The anger in your heart has given you the ability to place a malicious curse on an enemy. As a bonus action, choose one creature you can see within 30 feet of you. The target is cursed for 1 minute. The curse ends early if the target dies, you die, or you are incapacitated. Until the curse ends, you gain the following benefits:\n\nYou gain a bonus to damage rolls against the cursed target. The bonus equals your proficiency bonus. This bonus can be applied once per spell.\nAny attack roll you make against the cursed target is a critical hit on a roll of 19 or 20 on the d20.\nIf the cursed target dies, you regain hit points equal to your level + your spellcasting ability modifier (minimum of 1 hit point).\n\nYou can't use this feature again until you finish a short or long rest.",
          },
        ],
      },
      {
        level: 6,
        name: "Acolyte of Shadows",
        description:
          "At 6th level, you gain Forbidden Knowledge and one of the following features.",
        choices: [
          {
            name: "Wrathful Magic",
            description:
              "You have learned how to channel your wrath into your spellwork, making your spells more dangerous. When you hit a creature with a spell attack, you can use a reaction to deal extra necrotic damage to the target. The damage equals 5 + twice your level. You can do this a number of times equal to half of your proficiency bonus per long rest.",
          },
          {
            name: "Dark Intentions",
            description:
              "The evil in your heart has become potent enough to affect those around you. Twice per long rest you may choose a target of your Dark Intentions and affect them in one of the following ways.\n\nFrightening. As an action, you speak your intentions to your victim, causing them to suffer a moment of terror. Choose one creature within 60 feet of you that you can see. That creature must make a Wisdom saving throw, on a failed save, the creature is frightened for 1 minute or until it takes any damage. While frightened, the creature's speed is halved, and it can't benefit from any bonus to its speed. The creature can repeat the saving throw at the end of each of its turns, ending the effect on a success.\n\nJudging. As a bonus action, you speak your intentions to your victim, bolstering your confidence and your spite towards them. You gain advantage on attack rolls against the creature for 1d4 rounds or until it drops to 0 hit points or falls unconscious.",
          },
        ],
      },
      {
        level: 9,
        name: "Death Wish",
        description:
          "At 9th Level you can mark another creature’s life force for termination. As an action, you choose one creature you can see within 30 feet of you, cursing it until the end of your next turn. The next time you or an ally of yours hits the cursed creature with an attack, the creature has vulnerability to all of that attack's damage, and then the curse ends. You may use this feature a number of times equal to half of your spellcasting ability modifier rounded down.\n\nDeath Wish: You can mark another creature’s life force for termination. As an action, you choose one creature you can see within 30 feet of you, cursing it until the end of your next turn. The next time you or an ally of yours hits the cursed creature with an attack, the creature has vulnerability to all of that attack's damage, and then the curse ends. You may use this feature a number of times equal to half of your spellcasting ability modifier rounded down.\n\nAdditionally, you gain the ability to automatically succeed on one saving throw or ability check of your choice once per long rest.",
        choices: [],
      },
      {
        level: 10,
        name: "Deeper Darkness",
        description: "At 10th level, you gain one of the following features.",
        choices: [
          {
            name: "Visions of Death",
            description:
              "When you hit a creature with an attack, you can use this feature to cause your target to have horrible visions of its death at your hands. The target must succeed on a Wisdom saving throw against your spell save DC, or be unable to see or hear until the start of your next turn. When it awakes, it takes 3d10 psychic damage as it reels from its horrific experience. If the target fails by 5 or more, the damage increases to 6d10 and is unable to speak for the next minute.\n\nOnce you use this feature, you can't use it again until you finish a long rest.",
          },
          {
            name: "Dark Duelist",
            description:
              "Your experience fighting Dark wizards has taught you how to use their own techniques against them. You have advantage on any saving throws made against Jinxes, Hexes, Curses or Dark spells, and any Jinxes, Hexes, Curses, or Dark spells you cast are automatically cast one level higher than the consumed spell slot, not exceeding the highest available level of spell slots you have.",
          },
        ],
      },
      {
        level: 14,
        name: "Precision Strike",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "Advanced Defenses",
            description:
              "Sometimes you just have to stay and fight. And while everyone knows that offense is the best defense, having both is even better. When you cast any protego-related spell, you can transition the spell’s casting to your off-hand, freeing up your wand to cast other spells. The spell’s dedication now expends a bonus action instead of an action, and you are able to cast and maintain another concentration or dedication spell with your wand.",
          },
          {
            name: "Dark Curse",
            description:
              "When casting a spell that requires you to make an attack roll, you may expend a bonus action to transform the spell into a Curse. If the spell hits, the target must make a Constitution Saving throw against your Spell Save DC. On failure, the target gains 1d2 points of exhaustion. Repeatedly using this ability cannot increase a target's exhaustion level beyond 5. This curse can only be removed by a Wideye Potion or the Vulnera Sanentur spell. You may use this ability a number of times per day equal to your spellcasting ability modifier.",
          },
          {
            name: "Greater Judgment",
            description:
              "Dark Intentions Required. The conviction with which you speak your Judging Intentions gives you greater power over your foe. When a creature under the effect of your Judgment makes an attack, you can use your reaction to make a spell attack against that creature if it is within range using a spell with a level equal to half of your proficiency bonus rounded down or lower.",
          },
        ],
      },
      {
        level: 18,
        name: "Consumed By The Dark",
        description: "At 18th level, you gain one of the following features.",
        choices: [
          {
            name: "Punishment",
            description:
              "Those who dare to strike you are psychically punished for their audacity. Whenever a creature hits you with an attack, that creature takes psychic damage equal to your level plus your Charisma modifier (minimum of 1) if you’re not incapacitated.",
          },
          {
            name: "Suffering",
            description:
              "You become a master of instant death. When you hit a creature with a spell attack and do not have disadvantage on the roll, it must make a Constitution saving throw (DC 8 + half your current number of corruption points). On a failed save, double the damage of your attack against the creature.",
          },
        ],
      },
    ],
  },
  Culinarian: {
    name: "Culinarian",
    description:
      "Masters of magical cuisine who support allies through enchanted meals and recipes, combining culinary expertise with spellcasting abilities",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Foodie",
        description:
          "At 1st level, you gain the Recipes Feature and your choice of either Cooking by the Book or No Reservations. Additionally, you gain proficiency in Survival and Constitution saving throws. If you already have proficiency in Constitution saving throws, you may become proficient in Wisdom or Charisma saves instead (Your choice).as",
        choices: [],
      },
      {
        level: 1,
        name: "Recipes",
        description:
          "Beginning at 1st level, you learn three recipes that can be used to aid yourself and your allies. The recipes are kept inside your cookbook, and are all detailed at the end of the class description.\n\nMeals Per Day. After a long rest, you may prepare a number of recipes equal to your proficiency bonus.  You can prepare the same recipe multiple times in a single day. Preparing more recipes than this requires the use of the Prepare Meal action during a Free Period.\n\nConsuming a Meal. Any creature that possesses one of your meals can use a bonus action on their turn to consume it and gain its benefits, provided they have a free hand to do so. Alternatively, they can feed the meal to a willing creature within 5 feet using a free hand. A creature must be conscious to consume your meal. The effects of different recipes add together while their durations overlap, but the effects of the same recipe consumed multiple times don't combine.\n\nPrepare Meal. You gain an additional Free Period and/or Downtime Action called Prepare Meal. Prepare Meal allows you to attempt cooking a recipe you know from your recipe list, or learn a brand new recipe.\n\nLearn a new recipe. Learning a recipe follows the same rules as practicing spells, using a Survival (Wisdom) check and treating any recipe as a Level 0 (cantrip) spell + half the number of Recipes you have listed in your cookbook for the purpose of DC to successfully research and cook the recipe.\n\nPreparing a meal. Cooking a recipe follows the same rules as creating potions, making a Survival (Wisdom) check to successfully attempt to cook the recipe in question.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Cooking by the Book",
            description:
              "Your familiarity with recipes and culinary techniques overlaps with your potion-making abilities, allowing you to use your Survival(Wisdom) in place of Potion-Making (Wisdom) when brewing potions. Your fearless self-experimentation gives you an iron stomach, giving you advantage on Constitution saving throws.",
          },
          {
            name: "No Reservations",
            description:
              "You are a devout lover of Muggle cuisine, whether your family’s local cultural recipes, exposure to the foods of other regions, or a deep love of studying cookbooks. You gain proficiency in Muggle Studies. When your other Culinarian class features require a Survival (Wisdom) check, you may make a Muggle Studies (Intelligence) check instead. Additionally, learn two additional recipes of your choice.",
          },
        ],
      },
      {
        level: 4,
        name: "Honorary House Elf (Optional)",
        description:
          "At 4th level, you can optionally take this feature in place of an Ability score Improvement or Feat.\n\nFavorite Food. When interacting with another being you can attempt to learn what their favorite food is. Roll an Insight(Wisdom) check against their passive Deception, on a success you learn what their favorite food is. Cooking this food and giving it to them allows you to make your next Persuasion(Charisma) check against them using Survival(Wisdom) instead.",
        choices: [],
      },
      {
        level: 6,
        name: "Worldly Insights",
        description: "At 6th level, you gain one of the following features.",
        choices: [
          {
            name: "Fast Food",
            description:
              "You’ve got a stockpile of meals, ready made and good to conjure from the kitchens at all times. As an action, you may use a spell taught to you by the house elves: you may summon one of your locked-in recipes as a completed meal from the kitchens ready for immediate consumption. You may only use this ability a number of times equal to your spellcasting modifier per long rest.",
          },
          {
            name: "Yes, Chef!",
            description:
              "Your commanding presence in the kitchens carries over into other areas of life, including the battlefield.You may use the Help action as a Bonus Action on a target able to hear you speak. You then may suggest to them an action requiring an attack roll, saving throw, or ability check. On their next turn, if they yell “Yes, Chef!” and attempt the action suggested, they get advantage on that attack roll, saving throw or ability check.",
          },
        ],
      },
      {
        level: 9,
        name: "Nourishment",
        description:
          "At 9th Level whenever an ally consumes one of your recipes it gains temporary hit points equal to 2d6 + your Intelligence or Wisdom Modifier (whichever is higher with a minimum of 1 temporary hit point).",
        choices: [],
      },
      {
        level: 10,
        name: "Main Dish",
        description: "At 10th level, you gain one of the following features.",
        choices: [
          {
            name: "Sugar Rush",
            description:
              "Any creature that consumes one of your meals is blessed with a rush of energy. In addition to the meal’s benefits, the creature also gains an additional action on their turn. This action may only be used to cast a Spell of 3rd Level or lower, or take the Dash, Disengage, Hide, or Use Object action. A creature affected by Sugar Rush can not be affected by it again until they complete a short or long rest.\n\nOnce you reach 13th level this spell can be of 4th level or lower. Once you reach 17th level this spell can be of 5th level or lower.",
          },
          {
            name: "Dinnertime Bonding",
            description:
              "Once per semester, you may elect to host a banquet. In attendance, you must have at least five people, and ask each individual present the same question in-character (ex: What is your favorite memory of us? What are you most looking forward to after graduation? etc.) over food and drink you have prepared. Each individual who answers to the Headmaster’s satisfaction receives one Foresight roll. This die lasts until it is expended or until the end of the semester.",
          },
        ],
      },
      {
        level: 14,
        name: "Pièce de Résistance",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "YES! CHEF!",
            description:
              "Your commanding presence in the kitchens carries over into other areas of life, including the battlefield.You may use the Help action as a Bonus Action on a target able to hear you speak. You then may suggest to them an action requiring an attack roll, saving throw, or ability check. On their next turn, if they yell “Yes, Chef!” and attempt the action suggested, they get advantage on that attack roll, saving throw or ability check.",
          },
          {
            name: "Royal Banquet",
            description:
              "Dinnertime Bonding Required. If a participant’s answer to a question during a Banquet is to the Headmaster’s satisfaction, they receive two Foresight rolls instead of one. Additionally, a participant can divulge a secret. If the secret is to the Headmaster’s satisfaction, the participant becomes immune to poison and being frightened, its hit point maximum increases by 2d10, and it gains the same number of hit points. These effects last until the end of the semester.",
          },
          {
            name: "Eating Contest Champion",
            description:
              "Once per turn, when eating a meal as a bonus action you can eat two meals instead of one. This feature can be used a number of times equal to your Spell Casting Ability Modifier per long rest.",
          },
        ],
      },
      {
        level: 18,
        name: "Michelin Starred Chef",
        description:
          "Choose one feature representing your absolute mastery of magical cuisine.",
        choices: [
          {
            name: "It's Fucking Raw!",
            description:
              "Your magical influence over your food has given you the ability to control the quality of your recipes at will. As a Bonus Action you can throw your food at a creature up to 30 feet away. If the target is unwilling to eat the food, you must make an attack roll using Dexterity or Strength (whichever is higher) + Proficiency to force them to eat the meal. When a creature eats your food, you may choose whether they gain a positive or negative effect from the food.",
          },
          {
            name: "Where's The Lamb Sauce!",
            description:
              "You can, as an action, screech belittling comments at your enemies for 1 minute. Whenever an enemy starts its turn within 60 feet of you, it makes an Intelligence saving throw against your spell save DC. On a failure, it takes 3d8 psychic damage, and half as much on a success.\n\nWhile the aura lasts, you can use a bonus action on your turn to throw an arcane plate or similar kitchen utensil in the aura to attack one creature. Make a spell attack against the target. If the attack hits, the target takes force damage equal to 2d12 + your spellcasting ability modifier.\n\nAfter activating the aura, you can't do so again until you finish a long rest.",
          },
        ],
      },
    ],
  },
  "Herbology & Potions": {
    name: "Herbology & Potions",
    description:
      "Masters of botanical magic and alchemical arts who specialize in plant companions, potion brewing, and natural evocations to support allies and control the battlefield",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Bottle Fame",
        description: "At first level, you gain one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "The Subtle Science",
            description:
              "Unlike all the others who come to Hogwarts with a brand new potions textbook, yours is a well-loved heirloom filled with notes and suggestions from whoever came before you and entrusted you with their legacy.\n\nYou gain a Potions Kit and proficiency in the Potions Kit and Potion-Making, and have access to three additional common potion recipes. When attempting to brew a potion from the list of potions appropriate for your year or below, you may add your Intelligence modifier to your Potion Making (Wisdom) check, representing the written guidance of those who came before.\n\nYou learn new potions incrementally as you level up. Learn 2 Uncommon Potion recipes at level 6, 1 Rare potion at 10th Level, and 1 very rare potion at 14th Level.",
          },
          {
            name: "Green Thumb",
            description:
              "You gain an Herbology Kit and proficiency in the Herbology Kit and the Herbology skill, and the ability to cast Orchideous wordlessly, wandlessly and at will. You may add your Wisdom to your Herbology (Intelligence) check, representing long hours spent carefully tending to your plants.\n\nYou gain the ability to grow plants in places that they normally wouldn’t. You Gain a portable greenhouse that can carry the plants from the first half of this list. This serves as a Travel-Pack capable of protecting from harm and comfortably carrying 1 Plant companion on your back:",
          },
        ],
      },
      {
        level: 3,
        name: "Alternative Magic System (Optional)",
        description:
          "Instead of normal Metamagic, choose an alternative magical specialization.",
        choices: [
          {
            name: "Metapotions",
            description:
              "Potioneers do not receive access to metamagic abilities or Sorcery Points from leveling up as a Technique, Willpower, Intellect or Vigor Caster normally would. Instead, a Potioneer receives access to an equivalent number of Mastery Points, used exclusively to modify the effectiveness and utility of their Draughts and Potions.\n\nExpended Mastery Points can only be regained by un-imbuing the Metapotion effect used on a potion, or consuming/destroying it.\n\nSee Metapotion Effects below for more details.",
          },
          {
            name: "Natural Evocations",
            description:
              "Herbologists do not receive access to Metamagic abilities or Sorcery Points from leveling up as a Technique, Willpower, Intellect or Vigor Caster normally would. Instead, a Herbologist receives access to Natural Evocations and an equivalent number of Nature Points.\n\nSee Natural Evocations below for more details.",
          },
        ],
      },
      {
        level: 4,
        name: "Toxic Presence (Optional)",
        description:
          "At 4th level, you can optionally take this feature in place of an Ability score Improvement or Feat.\n\nBecause of your constant interactions, with your poisonous plants or from the toxic fumes of brewing potions, you have become somewhat venomous yourself. You are surrounded by invisible, necrotic fumes that are harmless until you unleash them on a creature nearby. When a creature you can see moves into a space within 30 feet of you or starts its turn there, they must succeed on a Constitution saving throw against your spell save DC or take 1d4 necrotic damage. The necrotic damage increases to 1d6 at 6th level, 1d8 at 10th level, and 1d10 at 14th level.",
        choices: [],
      },
      {
        level: 6,
        name: "Brew Glory",
        description:
          "At 6th level, gain proficiency in Herbology or Potion-Making or Expertise in one if already proficient in both and choose one of the following features.",
        choices: [
          {
            name: "Plant Veil",
            description:
              "Green Thumb Required. You can spend 1 minute using your plants to create camouflage for yourself.\n\nOnce you are camouflaged in this way, you can try to hide by pressing yourself up against a solid surface, such as a tree or wall, that is at least as tall and wide as you are. You gain a +10 bonus to Dexterity (Stealth) checks as long as you remain there without moving or taking actions. Once you move or take an action or a reaction, you must camouflage yourself again to gain this benefit.\n\nAdditionally, your plant companion gains the following effects.\n\nDefend. Your plant lashes out and defends you against assault. Opportunity attacks against you are made with disadvantage.\n\nDeflect. When a creature hits you with an attack, you gain a +4 bonus to AC against all subsequent attacks made by that creature for the rest of the turn.",
          },
          {
            name: "Don't Waste a Drop",
            description:
              "Once per day, you may add 1 minute to the final brewing time of a potion. If you succeed in brewing the potion, you may dilute the result to convert the potion into one or more potions that are one level of quality lower than the brewed potion. The number of potions brewed depends on the potion’s rarity.",
          },
          {
            name: "Herbivify",
            description:
              "You channel the energy from the plants around you to assist your allies. You have the aid and strength of plants, represented by a number of d6s equal to your level.\n\nAs a bonus action, plants grow on your allies' wounds to heal and stabilize them. You can choose an ally you can see within 120 feet of you and spend a number of those dice equal to half your level or less. Roll the spent dice and add them together. The target regains a number of hit points equal to the total. The target also gains 1 temporary hit point per die spent.\n\nYou regain the expended dice when you finish a long rest.",
          },
        ],
      },
      {
        level: 9,
        name: "Delayed Sorcery",
        description:
          "At 9th Level you finally gain the ability to tap into your innate ability to channel and manipulate magic like that of your peers. You gain a number of Sorcery Points and Metamagic Options as shown on the table below.\n\n\nLevel",
        choices: [],
      },
      {
        level: 10,
        name: "Asphodel and Wormwood",
        description:
          "At 10th level, gain expertise in Herbology or Potion-Making and choose one of the following features.",
        choices: [
          {
            name: "Entangle",
            description:
              "Green Thumb required. Your plant has grown so large that it can protect your allies. As a Bonus Action you create a thick entangled dome around yourself and your allies. You and friendly creatures within 5 feet of you have full coverage and friendly creatures within 10 feet of you have half coverage. This ability lasts for 1 minute or until you lose dedication.",
          },
          {
            name: "Designated Taste Tester",
            description:
              "Your proximity to dangerous plants, toxins and poisons has made you intimately familiar with the subtle signs of danger many others would miss. You automatically succeed on ability checks made to identify whether or not a plant or other ingestible object (potion, food, drink, etc.) is harmful, dangerous, or otherwise not what it seems. Additionally, because of your resistance to natural toxins, you can't be blinded, deafened, frightened, or poisoned",
          },
          {
            name: "Quick-Brew Mastery",
            description:
              "Metapotions required. You may quick-brew a potion and the number of Mastery Points required to brew one is reduced.",
          },
        ],
      },
      {
        level: 14,
        name: "The Delicate Power of Liquids",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "Metapotion Prodigy",
            description:
              "Metapotions required. You no longer have a limit on the number of metapotion effects that can be applied to a single potion. However, contradictory metapotion effects still may not be applied to the same potion.",
          },
          {
            name: "My Friend Felix",
            description:
              "By doing extra potions research, You learn to create a lesser version of Felix Felicis, called Felicity’s Gold. You may only Brew this potion Once per Semester. When ingested, you receive three luck points for the next Month. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to instead roll at advantage. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined.\n\nYou can also spend one luck point when an attack roll is made against you or an ally within 15 feet. Roll a d20 and then choose whether the attack uses the attacker's roll or yours.\nIf more than one creature spends a luck point to influence the outcome of a roll, the points cancel each other out; no additional dice are rolled. This potion cannot compete against the effects of another creature who has recently ingested Felix Felicis.",
          },
          {
            name: "Nature's Sanctuary",
            description:
              "Green Thumb Required. Creatures of the natural world sense your connection to nature and become hesitant to attack you. When a beast or plant creature attacks you, that creature must make a Wisdom saving throw against your spell save DC. On a failed save, the creature must choose a different target, or the attack automatically misses. On a successful save, the creature is immune to this effect for 24 hours.\n\nThe creature is aware of this effect before it makes its attack against you.\n\nAdditionally, your plant companion gains the following effect.\n\nDodge. Your plant can use it’s own natural awareness to help you defend from attacks. When an attacker that you can see hits you with an attack, your companion can use your reaction to halve the attack’s damage against you.",
          },
        ],
      },
      {
        level: 18,
        name: "Mind and Body",
        description: "At 18th level, you gain one of the following features.",
        choices: [
          {
            name: "Snape's Greasy Hair",
            description:
              "Your exposure to toxins with your craft has made you immune to disease. Additionally, you become resistant to acid, necrotic and poison damage.",
          },
          {
            name: "Plant Aspect",
            description:
              "You have become so in tune with your plants that they begin to become a part of you. You gain immunity to acid, necrotic, and poison damage and you become immune to disease. However, you gain vulnerability to fire damage.",
          },
        ],
      },
    ],
  },
  "Arithmancy & Runes": {
    name: "Arithmancy & Runes",
    description:
      "Academic spellcasters who master ancient magical theory through mathematical precision and runic symbols, specializing in alternate spellcasting methods and scholarly research",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Alternate Spellcaster",
        description:
          "At 1st level you learn the spell Flagrate. Any casting of this spell is done as a free action and is considered subtle. Additionally, you gain access to the ancient spellbook and one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Ancient Spellbook",
        description:
          "All Arithmantic and Runic spells may be cast in the class of their associated schools of magic only.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "School of Magic Expert",
            description: "Choose one of the following School of Magic options.",
          },
          {
            name: "Researcher",
            description:
              "Your extensive spell study has caused you to be able to cast more difficult spells before the rest of your classmates. You gain the following benefits:\n\nYou may add the Devicto spell to your ancient spellbook, it gains the Arithmantic AND Runic tags.\nYou may add half of your wisdom modifier (rounded up) to any checks made to research spells\nAny successfully researched spells gain the Arithmantic AND Runic tags.",
          },
        ],
      },
      {
        level: 4,
        name: "Extended Downtime (Optional)",
        description:
          "At 4th level, you can optionally take this feature in place of an Ability score Improvement or Feat.\n\nExtended Downtime: Increase your Intelligence or Wisdom score by 1, to a maximum of 20. Additionally, you gain one additional downtime slot to do one of the following activities:",
        choices: [],
      },
      {
        level: 6,
        name: "Exhaustive Studies",
        description: "At 6th level, you gain one of the following features.",
        choices: [
          {
            name: "Enhanced Spellwork",
            description:
              "All spells successfully cast during Ancient Runes class gain the Runic tag. All spells successfully cast in Arithmancy class gain the Arithmantic Tag.",
          },
          {
            name: "Private Lessons",
            description:
              "During Ancient Runes, Arithmancy and Downtimes you gain the following features:\nYou may attempt one additional spell per class.\nThe DC to cast spells is reduced by 2.",
          },
        ],
      },
      {
        level: 9,
        name: "Resilient Mind",
        description:
          "At 9th Level, you have honed your ability to resist abilities that would twist your mind. You gain proficiency in Wisdom saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice).",
        choices: [],
      },
      {
        level: 10,
        name: "Distinctive Approach",
        description: "At 10th level, you gain one of the following features.",
        choices: [
          {
            name: "Spellmaker",
            description:
              "Any spells you create during downtime only cost 2 downtime slots to complete and are completed in one slot with a roll of a 19 or 20 on the die. All spells created by a spellmaker gain the Arithmantic OR Runic tags.\n\nAdditionally, any spells that have BOTH Arithmantic and Runic Tags are automatically cast using 1 spell slot lower than its original level. The spell's level cannot exceed your highest available level of spell slots.",
          },
          {
            name: "Metamagical Application",
            description:
              "You gain 5 Sorcery Points. You also gain the following Metamagics:",
          },
        ],
      },
      {
        level: 14,
        name: "Rare Talents",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "Nimble Fingers",
            description:
              "You gain proficiency in Sleight of Hand. If you are already proficient, you gain expertise instead. Additionally, any spells with the Runic AND Arithmantic Tags Gain the following benefits:",
          },
          {
            name: "School of Magic Prodigy",
            description:
              "Enhanced version of your chosen school (+4 to that school required). Divinations: decide exact roll result once per long rest. Charms: target second creature with single-target charms. Transfigurations: gravity field (2d10 force damage, speed 0 on fail). Healing: advantage on spell saves and resistance to spell damage while ward active. JHC: extra Dark Empowerment use and Extra Action feature twice per short rest.",
          },
        ],
      },
      {
        level: 18,
        name: "Practiced and Prepared",
        description: "At 18th Level, choose one of the following features.",
        choices: [
          {
            name: "Perfected Spellwork",
            description:
              "Enhanced Spellwork Required. Your intense studies of the intricacies of Magical Theory have paid off, causing your spells to be lethal when casted.",
          },
          {
            name: "Spell Tome",
            description:
              "Private Lessons Required. Any spells cast during Ancient Runes, Arithmancy, or Downtimes are locked in after one successful casting attempt.",
          },
        ],
      },
    ],
  },
  Artisan: {
    name: "Artisan",
    description:
      "Creative spellcasters who blend magical theory with artistic expression, specializing in either magical item creation through imbuements or performance magic through harmonancy",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Skill Monkey",
        description:
          "At 1st Level you gain Proficiency in Performance and one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Practice Makes Perfect",
            description:
              "You gain proficiency in one skill of your choice. Choose one skill in which you have proficiency. You gain expertise with that skill, which means your proficiency bonus is doubled for any ability check you make with it.",
          },
          {
            name: "Master of None",
            description:
              "You can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus.",
          },
        ],
      },
      {
        level: 2,
        name: "Call to the Arts",
        description: "At 2nd level, you gain one of the following features.",
        choices: [
          {
            name: "Imbuement",
            description:
              "Gain Proficiency with one Artisan’s Tool of your choice.You may use this tool as a spellcasting focus. When crafting an art piece with your Artisan’s Tool, you may weave magical effects into the fabric of the Item, turning it into a magical construct.",
          },
          {
            name: "Harmonancy",
            description:
              "Gain Proficiency with one Musical Instrument of your choice. You may use this Instrument as a spellcasting focus in place of your wand.\n\nAdditionally, If you perform for at least 1 minute, you can attempt to inspire wonder in your audience by singing, playing an instrument, reciting a poem, or dancing. At the end of the performance, choose a number of humanoids within 60 feet of you who watched and listened to all of it, up to a number equal to your Charisma modifier (minimum of one). Each target must succeed on a Wisdom saving throw against your spell save DC or be charmed by you. While charmed in this way, the target idolizes you, it speaks glowingly of you to anyone who speaks to it, and it hinders anyone who opposes you, avoiding violence unless it was already inclined to fight on your behalf and gives you advantage on persuasion checks on the affected targets. This effect ends on a target after 1 hour, if it takes any damage, if you attack it, or if it witnesses you attacking or damaging any of its allies.\n\nOnce you use this feature, you can’t use it again until you finish a short or long rest.",
          },
        ],
      },
      {
        level: 4,
        name: "Crafty (Optional)",
        description:
          "At 4th level, you can optionally take this feature in place of an Ability score Improvement or Feat.\n\nCrafty: You've learned how to produce exactly the tool you need: with artisan's tools in hand, you can magically create one set of artisan's tools in an unoccupied space within 5 feet of you. This creation requires 1 hour of uninterrupted work, which can coincide with a short or long rest. Though the product of magic, the tools are non-magical, and they vanish when you use this feature again. Additionally, your proficiency bonus is now doubled for any ability check you make that uses your proficiency with a tool.",
        choices: [],
      },
      {
        level: 6,
        name: "Creative Muse",
        description:
          "At 6th Level you learn the Animatus Locomotor spell, and one of the following features.",
        choices: [
          {
            name: "Flash of Genius",
            description:
              "Imbuement Required. You've gained the ability to come up with solutions under pressure. When you or another creature you can see within 30 feet of you makes an ability check or a saving throw, you can use your reaction to add your Spellcasting ability modifier to the roll.\n\nYou can use this feature a number of times equal to your Spellcasting ability modifier (minimum of once). You regain all expended uses when you finish a long rest.",
          },
          {
            name: "Beguiling Performance",
            description:
              "Harmonancy Required You learn songs that are powered by special dice called Harmonic dice.",
          },
        ],
      },
      {
        level: 8,
        name: "Advanced Imbuement (Optional)",
        description:
          "At 8th level, you can optionally take this feature in place of an Ability score Improvement or Feat.\n\nAdvanced Imbuement: You have achieved a profound understanding of how to use and make magic items:\n\nYou can attune to up to four magic items at once.\nIf you craft a magic item with a rarity of common or uncommon, it takes you a quarter of the normal time, and it costs you half as much of the usual money.",
        choices: [],
      },
      {
        level: 9,
        name: "Art & Soul",
        description:
          "At 9th Level, your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies. Additionally, you gain one of the following features.",
        choices: [
          {
            name: "Song of Rest",
            description:
              "Hermonancy Required. You can use soothing music or oration to help revitalize your wounded allies. If you or any friendly creatures can hear you when you use a harmonic tune, make a performance check. They regain hit points equal to the check.\n\nYou can do this a number of times equal to your proficiency bonus per long rest.",
          },
          {
            name: "Magic Jolt",
            description:
              "Imbuement Required. When your Familiar hits with an attack, you can channel magical energy through the strike to create one of the following effects:\n\nThe target takes an extra 2d6 force damage.\nChoose one creature or object you can see within 30 feet of the target. Healing energy flows into the chosen recipient, restoring 2d6 hit points to it.\n\nYou can use this energy a number of times equal to your Spellcasting modifier (minimum of once), but you can do so no more than once on a turn. You regain all expended uses when you finish a long rest.",
          },
        ],
      },
      {
        level: 10,
        name: "Pure Talent",
        description: "At 10th Level you gain one of the following features.",
        choices: [
          {
            name: "Bombastic Rizz",
            description:
              "Your appearance permanently gains an otherworldly aspect that makes you look more beautiful and fierce. As a bonus action, you can assume a magically majestic presence for 1 minute or until you are incapacitated. For the duration, whenever any creature tries to attack you for the first time on a turn, the attacker must make a Charisma saving throw against your spell save DC. On a failed save, it can't attack you on this turn, and it must choose a new target for its attack or the attack is wasted. On a successful save, it can attack you on this turn, but it has disadvantage on any saving throw it makes against your spells on your next turn.\n\nOnce you assume this majestic presence, you can't do so again until you finish a short or long rest.",
          },
          {
            name: "Reliable Talent",
            description:
              "You have refined your chosen skills until they approach perfection. Gain proficiency in one skill of your choice. Additionally,whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.",
          },
          {
            name: "Spell-Storing Item",
            description:
              "Imbuement Required. You can now store a spell in an object. Whenever you finish a long rest, you can touch one simple or martial weapon or one non-magical item and you store a spell in it, choosing a 1st- or 2nd-level spell from your list of known spells that requires 1 action to cast.\n\nWhile holding the object, a creature can take an action to produce the spell's effect from it, using your spellcasting ability modifier. If the spell requires concentration, the creature must concentrate. The spell stays in the object until it's been used a number of times equal to twice your Intelligence modifier (minimum of twice) or until you use this feature again to store a spell in an object.",
          },
          {
            name: "Magical Secrets",
            description:
              "Harmonancy Required. You have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from the Professional Charms, Elemental Casting, Healing, Magizoo, Forbidden, Ancient, Diviner’s Curse, or Astronomic Spell Lists. A spell you choose must be of a level you can cast, or a cantrip.\n\nThe chosen spells do not count against your number of Spells or Cantrips Known.\n\nYou learn two additional spells from these lists at 14th level and again at 18th level.",
          },
        ],
      },
      {
        level: 14,
        name: "Avant-Garde",
        description: "At 14th level, gain one of the following features.",
        choices: [
          {
            name: "Augmented Healer",
            description:
              "Imbuement Required. You learn how to incorporate restorative magic into your items. You gain the following perks.\n\nWhenever a creature is attuned to an item you created, as an action the creature can touch the item and gain temporary hit points equal to 2d6 + your Spellcasting ability modifier (minimum of 1 temporary hit point). A creature can only gain temporary hit points in this way twice per long rest.\nYou can cast Reparifors without expending a spell slot and whether or not it is on your list of known spells, provided you use your artisan’s tool as the spellcasting focus. You can do so a number of times equal to your Spellcasting ability modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
          },
          {
            name: "Imbuement Expert",
            description:
              "Advanced Imbuement Required. Your skill with magic items deepens more:\n\nYou can attune to up to five magic items at once.\nYou ignore all special requirements on attuning to or using a magic item.",
          },
          {
            name: "Improved Performance",
            description:
              "Harmonancy Required. Your harmonic dice turn into d10s. At 18th level, they turn into d12s.",
          },
        ],
      },
      {
        level: 18,
        name: "Virtuoso",
        description: "At 18th level, gain one of the following features.",
        choices: [
          {
            name: "Crafter's Spirit",
            description:
              "Imbuement Required. You develop a mystical connection to your magic items, which you can draw on for protection:\n\nYou gain a +1 bonus to all saving throws per magic item you are currently attuned to.\nIf you're reduced to 0 hit points but not killed out-right, you can use your reaction to end one of your Artisanal Imbuements, causing you to drop to 1 hit point instead of 0.",
          },
          {
            name: "Imbuement Master",
            description:
              "Imbuement Expert Required. You can attune up to seven magic items at once.",
          },
          {
            name: "Epic Performer",
            description:
              "Harmonancy Required. When you roll initiative and have no harmonic dice remaining, you regain half of your maximum harmonic die.",
          },
        ],
      },
    ],
  },
  "Obscurial Magic": {
    name: "Obscurial Magic",
    description:
      "Dark magic users who harness the chaotic power of an Obscurus within them, gaining devastating abilities at the cost of personal harm and exhaustion",
    higherLevelFeatures: [
      {
        level: 1,
        name: "The Afflicted",
        description:
          "At 1st level, you gain Obscurial Summoning and can choose one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Obscurial Summoning",
        description:
          "You discover that your magic contains a dark energy that can be harnessed to enhance your spells. When you cast a spell, you can choose to sacrifice some of your own life force to gain additional power. When you do so, your wand glows with a dark aura, and you take 1d4 damage. The next spell you cast with your wand deals an extra 1d6 necrotic damage. You can use this ability once per turn.\n\nAt 6th level, the extra damage dealt by your Magic increases to 1d8. At 10th level, it increases to 1d10. And at 17th level, it increases to 1d12.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Decaying Touch",
            description:
              "You will your Obscurus to siphon the life force out of another creature. When you hit with a spell attack you can choose to ravage the victim  with obscurial magicdealing additional damage equal to your Obscurial Summoning die + twice your level. Manifesting your Obscurial Magic this way causes you excruciating pain. You must succeed on a Constitution saving throw or take half of the dealt damage as well.",
          },
          {
            name: "Icy Grasp",
            description:
              "You manifest your Obscurus to wreak havoc on your enemies. As a bonus action, you create an orb of Obscurial energy at a point you can see within 60 feet of you. The orb lasts for 1 minute or until you use this feature to create another orb.\n\nWhen you create the orb, you can make a melee spell attack against a creature within 10 feet of it. On a hit, the target takes 1d8 cold or necrotic damage (your choice when it takes the damage) and its speed is reduced by 10 feet until the start of your next turn. When you reach 10th level in this class, the damage dealt by the orb increases to 2d8.\n\nAs a bonus action on your turn, you can move the orb up to 30 feet and repeat the attack.\nYou can summon the orb a number of times equal to your Spellcasting modifier (minimum of once), and you regain all expended uses when you finish a long rest.\n\nForcing your Obscurus out of your body this way makes you sluggish and tired. While your Obscurial Orb is active, your movement speed is halved.",
          },
          {
            name: "Eyes of Blight",
            description:
              "You learn how to invoke your Obscurial through sight, making your eyes turn black and murky. As a bonus action, you can cause yourself to gain darkvision with a range of 120 feet. When this feature is active you can not be blinded. Additionally, you have disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight when you, the target of your attacks, or whatever you are trying to perceive is in direct sunlight\n\nWhen you reach 3rd level in this class, you learn the Ater spell. In addition, you can cast it by spending 2 sorcery points or by expending a spell slot and can see through the darkness created by the spell.",
          },
        ],
      },
      {
        level: 6,
        name: "The Cursed",
        description:
          "At 6th level the power of your Obscurus becomes more potent. Necrotic damage dealt by your spells and Obscurial Magic Features ignores resistance to necrotic damage. Choose one of the following features.",
        choices: [
          {
            name: "Obscurial Maledict",
            description:
              "You gain the ability to curse your enemies with your wand, tapping into the power of your Obscurus. As an action, you can choose one or more? creatures within 30 feet of you that you can see. You suffer a point of exhaustion. The target must make an Intelligence saving throw against your spell save DC or take 2d6 Psychic damage, and have their mind dominated by the chaos of the Obscurus.\n\nWhen you curse a creature, the target perceives all allies as enemies and must use their attack action randomly against one of their allies during their next turn. If there are none, they target themselves with the attack. When the cursed target uses their attack action against an ally or themselves, they must replicate the same attack that would typically be used against the caster. This includes using the same weapon, spell, or ability, along with any associated modifiers or effects.",
          },
          {
            name: "Beast of the Obscurus",
            description:
              "Eyes of Blight or Decaying Touch Required. You gain the ability to turn your Obscurus into a howling creature of darkness to harass your foes. As a bonus action you can summon a shadow beast to target one creature you can see within 120 feet of you. The beast uses the statistics of the beasts listed based on the chart below, with the following changes.\n\nThe beast is size Medium regardless of size listed on the beast statistics, and it counts as a monstrosity, not a beast.\nIt appears with a number of temporary hit points equal to half your level.\nIt can move through other creatures and objects as if they were difficult terrain. You and the beast take 5 force damage if it ends its turn inside an object.\nAt the start of its turn, the hound automatically knows its target's location. If the target was hidden, it is no longer hidden from the hound.\n\nThe beast appears in an unoccupied space of your choice within 30 feet of the target. Roll initiative for the beast. On its turn, it can move only toward its target by the most direct route, and it can use its action only to attack its target. The beast can make opportunity attacks, but only against its target. Additionally, while the beast is within 5 feet of the target, the target has disadvantage on saving throws against any spell you cast. The beast disappears if it is reduced to 0 hit points, if its target is reduced to 0 hit points, or after 5 minutes.\n\nAt the start of each of the beast’s turns you take 1d4 necrotic damage.\n\n\nHouse\nBeast",
          },
          {
            name: "Obscurial Guardian",
            description:
              "Icy Grasp Required. At 6th level, the orb you create with Icy Grasp can defend you and others. When you or a creature you can see takes damage while within 10 feet of the orb, you can use your reaction to choose one of those creatures and reduce the damage to the chosen creature by half, taking the rest of the damage yourself. After doing so, the orb vanishes.",
          },
        ],
      },
      {
        level: 9,
        name: "Shadow Walk",
        description:
          "At 9th Level your Obscurus gives you the ability to vanish from one point to another as long as you are shrouded in its darkness. When you are in dim light or darkness, as a bonus action, you can teleport up to 120 feet to an unoccupied space you can see that is also in dim light or darkness.",
        choices: [],
      },
      {
        level: 10,
        name: "The Beset",
        description: "At 10th level choose one of the following features.",
        choices: [
          {
            name: "Debilitating Magic",
            description:
              "Your Obscurial is so powerful it can be used to immobilize your enemies. Once per turn when you hit a creature with a spell attack, you can force it to make a Constitution saving throw against your spell save DC or be Paralyzed until the start of your next turn.\n\nIf they succeed on the saving throw, they gain advantage on attack rolls against you and you suffer disadvantage on saving throws against their spell effects until the end of their next turn.",
          },
          {
            name: "Obscurial Malice",
            description:
              "Eyes of Blight or Decaying Touch Required. You learn how to create a ominous aura that emanates from your body, bolstering your allies with the dark energy of the Obscurus. As an action, you can choose a number of allies equal to your spellcasting ability modifier to gain the following effects for 1 minute or until you lose concentration:\n\nCull the Herd. Your allies have advantage on attack rolls against any creature that has one or more of its allies within 15 feet of it.\nTreacherous Strike. If a creature within 15 feet of an ally misses them with an attack, they can use their reaction to force the attacker to reroll that attack against a creature of their choice that is also within 15 feet of the attacker. The ability fails and is wasted if the attacker is immune to being charmed. This ability can be used three times.\n\nAdditionally, any hostile creature that starts its turn within 10 feet of you must make a Wisdom saving throw against your spell save DC or take 3d8 necrotic damage and half as much on a success.\n\nWhen the aura ends you gain 3 points of exhaustion.\n\nOnce you use this feature, you can't use it again until you finish a short or long rest.",
          },
          {
            name: "Devour",
            description:
              "Icy Grasp Required. You can magically draw forth a manifestation of your Obscurial’s insatiable hunger. As an action, choose a point you can see within 60 feet of you. For 1 minute, your obscurial rages in a 10-foot radius centered on that point. Each creature in that area when the Obscurus appears must succeed on a Strength saving throw against your spell save DC or be restrained. Any creature that starts its turn in the Obscurus’ area takes 3d6 cold or necrotic damage (your choice when it takes the damage). As an action, a restrained creature can repeat the saving throw, ending the restraint on a success. At the start of your turn, if there is a creature in the Obscurus’ area, you gain temporary hit points equal to your level.\n\nOnce you use this feature, you are stunned until the end of your next turn, and cannot use it again until you finish a short or long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "The Madness",
        description: "At 14th level choose one of the following features.",
        choices: [
          {
            name: "Obscurial Frenzy",
            description:
              "Your connection to the dark energy of the Obscurus allows you to enter a state of uncontrollable frenzy. As a bonus action, you can choose to enter this state for 1 minute, during which time you gain the following benefits:\n\nYou have advantage on all attack rolls and ability checks.\nYou cannot cast spells during the frenzy. Instead, you make melee spell attacks using your spell attack modifier against a creature within 5 feet.\nYou gain multi-attack and can attack three times per action.\nYour Obscurial Magic damage increases to 2d12.\nYour speed increases by 10 feet, and you have advantage on Dexterity saving throws.\n\n\nWhile in a frenzy, you lose control of your actions and cannot distinguish between friend or foe. At the beginning of each of your turns you must succeed on a Wisdom saving throw against your spell save DC or while in this state, you are compelled to attack the nearest creature within reach, regardless of whether it is an ally or enemy. On a success, you attack the nearest hostile creature. Additionally, you take 1d6 points of necrotic damage at the end of each of your turns for the duration of the frenzy.\n\nOnce you use this feature, you can't use it again until you finish a long rest.",
          },
          {
            name: "Obscurial Consumption",
            description:
              "Your deep understanding of Obscurial Magic has granted you access to powerful abilities. As an action, you can choose to consume the magic of an unconscious or slain creature within 5 feet of you, regaining a number of temporary hit points equal to half of the creature's hit point maximum. You cannot be targeted by a healing spell or consume potions until these temporary hit points are expended.\n\nIf the creature was a spellcaster, you also regain one expended spell slot of the highest level they were able to cast, not going above your available spell slots and the creature is unable to cast any leveled spells until that spell slot is used or you take a rest. When the siphoned spell slot is used you can only cast cantrips until the end of your next turn.\n\nYou can use this feature once per short or long rest.",
          },
        ],
      },
      {
        level: 18,
        name: "The Malevolent",
        description: "At 18th level choose one of the following features.",
        choices: [
          {
            name: "Annihilate",
            description:
              "You unleash a devastating wave of dark magic from your Obscurus, draining the life force from all creatures in its wake. Enemies within 30 feet take 8d6 necrotic damage and are knocked prone.\n\nYou can use this feature once per long rest.",
          },
          {
            name: "Obscurial Assimilation",
            description:
              "As a bonus action you can turn yourself into the shadowy form of your Obscurial. In this form, you have resistance to all damage except force and radiant damage, and you can move through other creatures and objects as if they were difficult terrain. Creatures you hit while in this form cannot regain hit points.\n\nYou remain in this form for 1 minute. It ends early if you are incapacitated, if you die, or if you dismiss it as a bonus action.\n\nOnce you use this feature, you can't use it again until you finish a long rest.",
          },
        ],
      },
    ],
  },
  Defender: {
    name: "Defender",
    description:
      "Protective spellcasters who specialize in shielding allies and controlling battlefield positioning, focusing on defensive magic and tactical support to keep their companions safe from harm",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Mitigating Defense",
        description:
          "At 1st level, you gain access to the Justice Spell List choose one of the following.",
        choices: [
          {
            name: "Critical Deflection",
            description:
              "As reaction when you or an ally that you can see within 30 feet of you suffers a critical hit, you can turn that attack into a normal hit. Any effects triggered by a critical hit are canceled.\n\nYou can use this feature a number of times equal to your spellcasting ability modifier (minimum of once). You regain all expended uses when you finish a long rest.",
          },
          {
            name: "Shielding Presence",
            description:
              "When your allies are within 10 feet of you, they gain a +1 bonus to their Armor Class.\n\nThis bonus increases to +2 at 6th level, and +3 at 12th level.",
          },
        ],
      },
      {
        level: 6,
        name: "Defender's Promise",
        description:
          "You gain the ability to bestow Promises upon your allies imbued with magical power. You start with two such effects of your choice. When you bestow a Promise, you choose which effect to create. You must then finish a short or long rest to bestow Promises again. Some Promises require saving throws. When you use such an effect the DC equals your spell save DC.",
        choices: [
          {
            name: "Shining Promise",
            description:
              "As an action, you channel shimmering energy into an ally that you can see within 30 feet of you. The first time that ally is hit by an attack within the next minute, the attacker takes radiant damage equal to 2d10 + your level.",
          },
          {
            name: "Promise of Valor",
            description:
              "When a creature within 30 feet of you makes an attack roll, ability check, or saving throw using Strength, you can use your reaction to grant that creature a +10 bonus to the roll, using your Defender’s Promise. You make this choice after you see the roll, but before the DM says whether the roll succeeds or fail.",
          },
          {
            name: "Healing Promise",
            description:
              "You can use your Defender’s Promise to heal the badly injured. As an action, you evoke healing energy that can restore a number of hit points equal to five times your level. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can’t use this feature on an undead or a construct.",
          },
          {
            name: "Promise of Will",
            description:
              "You can use your Defender’s Promise to invest your presence with warding power. As an action, you can choose a number of creatures you can see within 30 feet of you, up to a number equal to your spellcasting ability modifier (minimum of one creature). For 1 minute, you and the chosen creatures have advantage on Intelligence, Wisdom, and Charisma saving throws.",
          },
          {
            name: "Rebuking Promise",
            description:
              "You can use your Defender’s Promise to castigate unworldly beings. As an action, you speak seething words and each Ghost, Ghoul, Poltergeist, Inferi, Undead or other dark creature within 30 feet of you that can hear you must make a Wisdom saving throw. On a failed save, the creature is turned for 1 minute or until it takes damage.",
          },
        ],
      },
      {
        level: 9,
        name: "Constant Vigilance",
        description:
          "You emit an aura of alertness while you aren't incapacitated. At 9th level, when you and any creature of your choice within 10 feet of you rolls initiative, you each gain a bonus to initiative equal to your Spellcasting Ability modifier (minimum of +1).\n\nAt 18th level, the range of this aura increases to 30 feet.",
        choices: [],
      },
      {
        level: 10,
        name: "Sturdy",
        description:
          "You may bestow 2 Promises per rest. Additionally, choose one of the following defensive enhancements.",
        choices: [
          {
            name: "Damage Deflection",
            description:
              "When you take damage, you can use your reaction to roll a number of d12 equal to your spellcasting ability modifier. Add your Constitution modifier to the number rolled and reduce the damage by that total.\n\nYou can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          },
          {
            name: "Magical Constitution",
            description:
              "Hit Point maximum increases by an amount equal to your spellcasting ability modifier when you gain this feature.\n\nWhenever you gain a character level thereafter, your Hit Point maximum increases by your spellcasting ability modifier.",
          },
          {
            name: "Mystical Body",
            description:
              "Your magic wards your body from harm. Your armor class equals 12 + your Dexterity modifier + your spellcasting ability modifier.\n\nYou gain no benefit from wearing cloaks, but if you are using a shield, you apply its bonus as normal.",
          },
        ],
      },
      {
        level: 14,
        name: "Warding Promise",
        description:
          "You may bestow 3 Promises per rest. Additionally, you gain one additional Promise from the Defender's Promise list and one from the enhanced Promises below.",
        choices: [
          {
            name: "Promise of Sanctuary",
            description:
              "As an action, you designate yourself or an ally within 30 feet. Until the start of your next turn, the chosen creature is immune to all damage and conditions except for exhaustion and unconscious. Spells and magical effects cannot force the creature to move or change shape.",
          },
          {
            name: "Brilliant Promise",
            description:
              "As an action you can bless up to three creatures of your choice within 30 feet with an aura of burning light. For 1 minute, these creatures gain the following benefits:\nTheir attacks do an additional 1d10 + your spellcasting modifier radiant damage.\nWhen an enemy ends their turn within 5 feet of them they take 1d6 + your spellcasting modifier radiant damage.\nIf they are reduced to 0 hit points, the aura bursts. Every enemy within 15 feet must make a constitution saving throw or take 3d10 radiant damage and be blinded.",
          },
          {
            name: "Promise of Revival",
            description:
              "When an ally within 30 feet drops to 0 hit points, you can use your reaction to invoke this promise. The ally immediately stands up with hit points equal to your level. Additionally, they may immediately cast a spell of a level up to half your proficiency bonus, rounded down, targeting the creature or source that reduced them to 0 hit points.",
          },
        ],
      },
      {
        level: 18,
        name: "Defensive Being",
        description: "At 18th level, choose one of the following.",
        choices: [
          {
            name: "Bolstered Bravery",
            description:
              "When you are subjected to an effect that allows you to make a saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail. If the spell has additional effects from failing the saving throw, those effects are automatically negated, whether you succeed or fail on the save.\n\nAdditionally, you may use your reaction to transfer the benefits of this feature onto an ally within 30 feet of you. The benefits of this feature return to you at the beginning of your next turn.",
          },
          {
            name: "Life Blessing",
            description:
              "As an action, you can touch the corpse of a creature that died within the past 24 hours and expend 15 sorcery points. The creature then returns to life, regaining a number of hit points equal to 4d10 + your spellcasting ability modifier. If the creature died while subject to any of the following conditions, it revives with them removed: blinded, deafened, paralyzed, poisoned, and stunned.\n\nOnce you use this feature, you can't use it again until you finish a long rest.",
          },
        ],
      },
    ],
  },
  "Grim Diviner": {
    name: "Grim Diviner",
    description:
      "Dark practitioners who blend divination magic with sinister influences, specializing in glimpsing futures, manipulating minds, and wielding forbidden knowledge to control fate and fear",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Grim Presence",
        description:
          "At 1st level you gain a Diviner's Kit and proficiency in using a Diviner's Kit. You may also pick one of the following features:",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Dark Visionary",
            description:
              'You gain the ability to invoke your "Dark Visionary" abilities, allowing you to glimpse fragments of the future. Roll a d20 and note the result; this roll is called your Visionary Roll. Once per day, you can replace any attack roll, saving throw, or ability check made by you with your Visionary Roll.\n\nAt 6th Level, you gain the ability to use your Visionary Roll on other creatures that you can see. At 10th Level, you gain an additional Visionary Roll for a total of 2.\nAt 14th Level, you can make three Visionary Rolls instead of two for your roll and choose any two results to keep.',
          },
          {
            name: "Shadowy Influences",
            description:
              "You gain the ability to form illusions to influence those around you.\nYou gain the spell Fraudemo and can cast this spell wand-less and word-less. Additionally, you can create both a sound and an image with a single casting of the spell.\n\nAt 6th Level you gain the ability to cast Fraudemo Maxima in this way, when you cast an illusion spell that has a duration of 1 minute or longer, you can use your action to change the nature of that illusion (using the spell's normal parameters for the illusion), provided that you can see the illusion.",
          },
        ],
      },
      {
        level: 6,
        name: "Grim Sight",
        description:
          "At 6th level you gain the Dark Legilimens feature and your choice between either the Foresight Glimpse or Soul Tether features.",
        choices: [
          {
            name: "Foresight Glimpse",
            description:
              "Your divination powers allow you to briefly glimpse into the future. You can choose to give yourself advantage on your next attack roll, saving throw, or ability check before the end of your next turn. You can use this ability a number of times equal to half your proficiency bonus (rounded down) per long rest.",
          },
          {
            name: "Soul Tether",
            description:
              "You gain the ability to manipulate the life force of your enemies. Whenever you deal damage to a creature with a spell containing the dark spell tag, you regain hit points equal to half the damage dealt.",
          },
        ],
      },
      {
        level: 9,
        name: "Grim Psychometry",
        description:
          "When you reach 9th level, you gain a supernatural talent for discerning the secrets surrounding mysterious relics or places touched by evil. Whenever you make an Intelligence (History) check to recall information about the sinister or tragic history of an object you are touching or your current location, you have advantage on the check. At the DM’s discretion, a suitably high roll might cause your character to experience brief visions of the past connected to the object or location.",
        choices: [],
      },
      {
        level: 10,
        name: "Grim Control",
        description:
          "At 10th level you gain the Chambers of Forbidden Secrets feature and one of the following features.",
        choices: [
          {
            name: "Emotional Manipulation",
            description:
              "Your studies have granted you the power to manipulate the emotions of others. As an action, you can target a creature you can see within 60 feet of you. If the target is unwilling they must make a Charisma saving throw against your spell save DC. On a failed save, you gain limited control over their emotions for 1 minute.\n\nWhile under your influence, the target's emotions can be subtly manipulated by you. You can intensify or suppress their emotions, influencing their mood and behavior to a certain extent. For example, you can make them more fearful, agitated, or even feel a temporary surge of happiness or confidence.\n\nYour influence over the target's emotions can grant you advantage on Charisma-based skill checks against them, such as Persuasion or Intimidation, as their emotions are swayed in your favor.\n\nThis ability can be used very creatively. Work with your GM to create some truly useful or terrifying effects!\n\nOnce you use this feature, you can't use it again until you finish a long rest.",
          },
          {
            name: "Mind of the Grave",
            description:
              "As an action, you target one dead creature or Inferius you can see within 30 feet of you. The target must make a Wisdom saving throw. On a failed save, the target must obey your commands for the next 24 hours. A creature whose challenge rating or level is equal to or greater than your level is immune to this effect.\n\nYou may use this feature twice per long rest.",
          },
          {
            name: "Illusion of Self",
            description:
              "You can create an illusory duplicate of yourself as an instant, almost instinctual reaction to danger. When a creature makes an attack roll against you, you can use your reaction to interpose the illusory duplicate between the attacker and yourself. The attack automatically misses you, then the illusion dissipates.\n\nOnce you use this feature, you can't use it again until you finish a short or long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "Grim Mastery",
        description: "Choose a method of ultimate dark power manipulation.",
        choices: [
          {
            name: "Death Wish",
            description:
              "At 9th Level you can mark another creature’s life force for termination. As an action, you choose one creature you can see within 30 feet of you, cursing it until the end of your next turn. The next time you or an ally of yours hits the cursed creature with an attack, the creature has vulnerability to all of that attack's damage, and then the curse ends. You may use this feature a number of times equal to half of your spellcasting ability modifier rounded down.\n\nDeath Wish: You can mark another creature’s life force for termination. As an action, you choose one creature you can see within 30 feet of you, cursing it until the end of your next turn. The next time you or an ally of yours hits the cursed creature with an attack, the creature has vulnerability to all of that attack's damage, and then the curse ends. You may use this feature a number of times equal to half of your spellcasting ability modifier rounded down.\n\nAdditionally, you gain the ability to automatically succeed on one saving throw or ability check of your choice once per long rest.",
          },
          {
            name: "Shadow Infusion",
            description:
              "Your connection to dark magic allows you to infuse your spells with potent shadow energy. When you deal damage with a spell, you can choose to imbue the target with a lingering shadow. The target takes an additional 2d8 Psychic damage at the start of its next turn. Once you use this feature, you can't use it again until you finish a short or long rest. Additionally, the target gains disadvantage on the next saving throw they make before the start of your next turn.",
          },
          {
            name: "Path of Rot",
            description:
              "Mind of the Grave Required. Any Inferius or creatures under the control of your Mind of the Grave feature gain a bonus to damage rolls equal to your Divinations modifier.",
          },
        ],
      },
      {
        level: 18,
        name: "Grim Being",
        description: "At 18th level, gain one of the following features.",
        choices: [
          {
            name: "Dreadful Aspect",
            description:
              "As an action, you channel the darkest emotions and surround yourself with an aura of gloom that lasts for 1 minute. The aura reduces any bright light in a 30-foot radius around you to dim light. Each creature of your choice within 30 feet of you must make a Wisdom saving throw if it can see you. On a failed save, the target is frightened of you for 1 minute. If a creature frightened by this effect ends its turn more than 30 feet away from you, it can attempt another Wisdom saving throw to end the effect on it. Whenever an enemy that is frightened by you starts its turn in the aura, it takes 4d10 psychic damage. Additionally, you and any creatures of your choosing in the aura are draped in deeper shadow. Creatures that rely on sight have disadvantage on attack rolls against creatures draped in this shadow.\n\nWhile the aura lasts, you can use a bonus action on your turn to cause the shadows in the aura to attack one creature. Make a melee spell attack against the target. If the attack hits, the target takes necrotic damage equal to 3d10 + your spellcasting modifier.\n\nAfter activating the aura, you can't do so again until you finish a long rest.",
          },
          {
            name: "Mind Mastery",
            description:
              "Your thoughts can't be read by telepathy or other means unless you allow it. You also have resistance to psychic damage, and whenever a creature deals psychic damage to you, that creature takes the same amount of damage that you do. Additionally, you gain the ability to infect a being’s mind with your illusion magic. You can use your action to touch an incapacitated being. That creature is then charmed by you until they are healed by a Mandrake Restorative Draught or Valnera Sanentur spell, the charmed condition is removed from it, or you use this feature again.\n\nYou can communicate telepathically with the charmed creature regardless of distance.",
          },
        ],
      },
    ],
  },
  Astronomy: {
    name: "Astronomy",
    description:
      "Celestial spellcasters who draw power from stars, moons, and cosmic forces, specializing in radiant magic, divination through stellar phenomena, and transformative starry manifestations",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Astronomer's Curiosity",
        description:
          "At 1st Level you gain proficiency with Astronomer’s tools, access to the Astronomic Spell list and proficiency in either perception or insight. Additionally, you may choose one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Astrologer",
            description:
              "You've found a magical Star Map as part of your Astronomical studies. It is a Tiny object and can serve as a spellcasting focus for your spells.\n\nWhile holding this map, all spells in the Astronomic spell list are considered locked in.",
          },
          {
            name: "I'm Not Afraid of the Dark",
            description:
              "You can see through the deepest gloom. You have darkvision out to a range of 80 feet. In that radius, you can see in dim light as if it were bright light and in darkness as if it were dim light.\n\nAs an action, you can magically share the darkvision of this feature with willing creatures you can see within 10 feet of you, up to a number of creatures equal to your Wisdom modifier (minimum of one creature). The shared darkvision lasts for 1 hour. Once you share it, you can't do so again until you finish a long rest, unless you expend a spell slot of any level to share it again.",
          },
          {
            name: "Moonlit Enchantment",
            description:
              "Your spells are imbued with the essence of moonlight, making them harder to resist. When you cast a spell that requires a creature to make a saving throw, the DC for that saving throw increases by 1.",
          },
        ],
      },
      {
        level: 5,
        name: "Star Mapper",
        description:
          "Astrologer Required. At 5th Level, while holding your Star Map you gain the following benefits.\n\nYou can cast Lux Maxima without expending a spell slot. You can do so a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.\nWhen you cast Ignis Lunalis, you can target one creature as normal or target two creatures within range that are within 5 feet of each other.\nDuring a long rest, you can create an astrological chart for a creature, gaining insight into their destiny. For the next 24 hours, you can grant the creature advantage on one ability check, saving throw, or attack roll by interpreting the chart's guidance.\n\nIf you lose the map, you can perform a 1-hour ceremony to magically create a replacement. This ceremony can be performed during a short or long rest, and it destroys the previous map.",
        choices: [],
      },
      {
        level: 6,
        name: "Astrological Presence",
        description: "At 6th level, you gain one of the following features.",
        choices: [
          {
            name: "Centaur's Vision",
            description:
              "Astrologer Required. You learn to use your Star Sap to divine the will of the cosmos. Whenever you finish a long rest, you can consult your Star Map for omens. When you do so, roll a die. Until you finish your next long rest, you gain access to a special reaction based on whether you rolled an even or an odd number on the die:\n\nWeal (even). Whenever a creature you can see within 30 feet of you is about to make an attack roll, a saving throw, or an ability check, you can use your reaction to roll a d6 and add the number rolled to the total.\nWoe (odd). Whenever a creature you can see within 30 feet of you is about to make an attack roll, a saving throw, or an ability check, you can use your reaction to roll a d6 and subtract the number rolled from the total.\n\nYou can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          },
          {
            name: "Astronomic Self",
            description:
              "As a bonus action, you can take on a starry form. While in your starry form, your body becomes luminous; your joints glimmer like stars, and glowing lines connect them as on a star chart. This form sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The form lasts for 10 minutes. It ends early if you dismiss it (no action required), are incapacitated, die, or use this feature again.\n\nWhenever you assume your starry form, choose which of the following constellations glimmers on your body; your choice gives you certain benefits while in the form:\n\nArcher. A constellation of an archer appears on you. When you activate this form, and as a bonus action on your subsequent turns while it lasts, you can make a ranged spell attack, hurling a luminous arrow that targets one creature within 60 feet of you. On a hit, the attack deals radiant damage equal to 1d8 + your Wisdom modifier.\nChalice. A constellation of a life-giving goblet appears on you. Whenever you cast a spell using a spell slot that restores hit points to a creature, you or another creature within 30 feet of you can regain hit points equal to 1d8 + your Wisdom modifier.\nDragon. A constellation of a wise dragon appears on you. When you make an Intelligence or a Wisdom check or a Constitution saving throw to maintain concentration on a spell, you can treat a roll of 9 or lower on the d20 as a 10.",
          },
        ],
      },
      {
        level: 8,
        name: "Celestial Harmony (Optional)",
        description:
          "At 8th level, you can optionally take this feature in place of an Ability score Improvement or Feat.\n\nCelestial Harmony: At 8th Level you gain the following benefits.\n\nIncrease Wisdom or Intelligence score of your choice by 1, to a maximum of 20.\nYour mastery of celestial magic allows you to harmonize with the cosmos, enhancing your spellcasting abilities. You can add your spell casting ability modifier to the damage of one spell you cast a number of times equal to your proficiency bonus.",
        choices: [],
      },
      {
        level: 9,
        name: "Blessing of the Stars",
        description:
          "At 9th level, while you are wearing no cloak and not welding a defensive item, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.",
        choices: [],
      },
      {
        level: 10,
        name: "Heaven's Fortitude",
        description: "At 10th level, you gain one of the following features.",
        choices: [
          {
            name: "Astronomic Power",
            description:
              "Astronomic Self Required. The constellations of your Starry Form burn brighter. You gain the following benefits:\n\nThe 1d8 of the Archer and the Chalice becomes 2d8, and while the Dragon is active, you have a flying speed of 20 feet and can hover.\nWhile the Shield is active, once per long rest, you can use an action to create a 20-foot-radius zone of starlight. While within this zone, you and your allies have advantage on saving throws against spells and other magical effects. The starlight lasts for 1 minute.\nAt the start of each of your turns while in your Starry Form, you can change which constellation glimmers on your body.\nWhen you and any creature of your choice within 10 feet of you rolls initiative, you each gain a bonus to initiative equal to your Wisdom modifier (minimum of +1). At 18th level, the range of this aura increases to 30 feet.",
          },
          {
            name: "Cosmic Blast",
            description:
              "You've learned how to compel the cosmos to magically chastise anyone who dares cast unwanted spells at you and your wards. Whenever you or a creature you can see within 30 feet of you succeeds on a saving throw against an attack, you can use your reaction to deal 2d8 + your Wisdom modifier radiant damage to the attacker.",
          },
          {
            name: "Cosmic Insight",
            description:
              "You have an innate understanding of fate and fortune. Once per short rest, you can reroll any d20 roll made by you or a creature you can see, forcing the target to use the new result.",
          },
        ],
      },
      {
        level: 14,
        name: "Volatile Astronomy",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "Gift of the Stars",
            description:
              "Your expertise with Astronomic magic boosts the potency of your spells. Add your Wisdom modifier to the damage you deal with any spell of 3rd Level or lower. Additionally, you gain resistance to radiant and fire damage.",
          },
          {
            name: "Gift of the Moon",
            description:
              "Astronomic Self Required. You magically tap into the power of a lunar phase that saturates your being. While you are in your Starry Form, you also gain the following benefit associated with a phase of the moon:",
          },
          {
            name: "Fate Unbound",
            description:
              "Your connection to the cosmic tapestry allows you to briefly unravel fate itself. Once per day, as an action, you can choose a target you can see within 60 feet. That target must succeed on a Wisdom saving throw against your spell save DC or have one of their ability scores (of your choice) become 1 for 1 minute. The affected creature can repeat the saving throw at the end of each of its turns to end the effect early. Any saving throws made against this feature are not subject to the effects of this feature.",
          },
          {
            name: "Celestial Resistance",
            description:
              "Your celestial journey has reached new heights, granting you unparalleled mastery over the cosmic forces. You can now invoke Celestial Resistance once per day. For the next minute, your understanding of the celestial realm enhances your spellcasting. Any spells you cast during this time that deal damage ignore resistance, treating it as if it doesn't exist.",
          },
        ],
      },
      {
        level: 18,
        name: "Cosmic Perfection",
        description: "At 18th level, you gain one of the following features.",
        choices: [
          {
            name: "Gift of the Sun",
            description:
              "Gift of the Moon Required. As a bonus action, you can tap into the power of the Sun to boost the magic of your current Lunar phase.",
          },
          {
            name: "Starry Desperation",
            description:
              "In moments of desperation, you are imbued with the power of the stars. When you cast a spell you can deal maximum damage with that spell.\n\nThe first time you do so when casting a spell of 1st through 3rd level, you suffer no adverse effect. If you use this feature again before you finish a long rest, or use this feature on a spell of 4th level or higher, you take 1d12 Radiant damage for each level of the spell, immediately after you cast it. Each time you use this feature again before finishing a long rest, the Radiant damage per spell level increases by 1d12. This damage ignores resistance and immunity.",
          },
        ],
      },
    ],
  },
  Historian: {
    name: "Historian",
    description:
      "Scholarly spellcasters who draw power from extensive research and intellectual mastery, specializing in knowledge manipulation, tactical analysis, and uncovering secrets through academic study",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Scholar's Mind",
        description: "At 1st level, you gain one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Study Buddy",
            description:
              "You have extensively studied the history and lore within the library. You learn one language of your choice, and you gain proficiency with one of the following skills of your choice: Herbology, History of Magic, Investigation, Magical Theory, or Muggle Studies. If you already have proficiency in one of the listed skills, you can instead gain expertise.\n\nAdditionally, if you spend at least one hour studying, your grade in one chosen subject automatically goes up by one category. You may also choose to help others with their homework, giving them the benefits of this feature instead of yourself.",
          },
          {
            name: "Quick Skim",
            description:
              "You’ve mastered the art of skimming texts to boost your knowledge for a short burst of time. Once per short or long rest, you choose one skill or tool. For 1 hour, you have proficiency with the chosen skill or tool. If you already have proficiency with that skill or tool, you have expertise instead.",
          },
        ],
      },
      {
        level: 6,
        name: "Intellect Advantage",
        description: "At 6th level, you gain one of the following features.",
        choices: [
          {
            name: "Um, Actually?",
            description:
              "You learn how to use your superior intelligence to distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of you makes an attack roll, an ability check, or a damage roll, you can use your reaction to insult their intelligence. Make a History of Magic check contested by an History of Magic check of the target. If you win the contest, their roll is reduced by the difference between the two numbers. You can choose to use this feature after the creature makes its roll, but before the DM determines whether the attack roll or ability check succeeds or fails, or before the creature deals its damage. The creature is immune if it can't hear you or if it's immune to being charmed.\n\nYou can use this feature a number of times equal to half of your intelligence modifier rounded up per long rest.",
          },
          {
            name: "Battle Studies",
            description:
              "Your spells create a momentary link with your enemies, allowing you to intuit crucial information about a foe. When you hit a creature with a cantrip, you can intellectually analyze it. Whenever an analyzed creature misses you with an attack, you can immediately use your reaction to cast a cantrip at the target. This benefit lasts until you finish a short or long rest.\n\nAdditionally, when you analyze a creature, you learn all of its damage vulnerabilities, damage resistances, damage immunities, and condition immunities.\n\nYou can intellectually analyze a creature a number of times equal to half of your proficiency bonus per long rest.",
          },
        ],
      },
      {
        level: 9,
        name: "I Was in the Library...",
        description:
          "At 9th level you automatically lock in two spells of your choice from the Elemental, Magizoo, Diviner’s Curse, Forbidden, or Astronomic spell lists.",
        choices: [],
      },
      {
        level: 10,
        name: "Dueling Tactics",
        description: "At 10th level, you gain one of the following features.",
        choices: [
          {
            name: "Intelligent Maneuver",
            description:
              "You've honed your awareness and reflexes through mental aptitude and pattern recognition. Once per round, if you've already taken your reaction, you may take an additional reaction.",
          },
          {
            name: "Wait... Hold on.",
            description:
              "When you make a skill check, you can use your reaction to think about your mistakes and try again. You may roll the check again, adding half your Intelligence modifier (rounded up) to the ability check, you must use the new roll. You can choose to do so after you roll the die for the ability check, but before the DM tells you whether you succeed or fail.",
          },
        ],
      },
      {
        level: 14,
        name: "Path of History",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "Intelligent Casting",
            description:
              "Your in depth knowledge of the mechanical workings of magic boosts the potency of your spells. Add your Intelligence modifier to the damage you deal with any spell of 3rd Level or lower. Additionally, you gain resistance to being charmed.",
          },
          {
            name: "Super Sleuth",
            description:
              "Your keen mind can call up recollections of the past that relate to an object you hold or your immediate surroundings. You spend at least 1 minute in contemplation, then receive dreamlike, shadowy interpretations of recent events. You can study in this way for a number of minutes equal to your Intelligence score and must maintain concentration during that time, as if you were casting a spell.\n\nOnce you use this feature, you can't use it again until you finish a short or long rest.\n\nObject Reading. Holding an object as you study it, you can see visions of the object's previous owner. After contemplating for 1 minute, you learn how the owner acquired and lost the object, as well as the most recent significant event involving the object and that owner. If the object was owned by another creature in the recent past (within a number of days equal to your Intelligence score), you can spend 1 additional minute for each owner to learn the same information about that creature.\nArea Reading. As you contemplate, you see visions of recent events in your immediate vicinity (a room, street, tunnel, clearing, or the like, up to a 50-foot cube), going back a number of days equal to your Intelligence score. For each minute you contemplate, you learn about one significant event, beginning with the most recent. Significant events typically involve powerful emotions, such as battles and betrayals, marriages and murders, births and funerals. However, they might also include more mundane events that are nevertheless important in your current situation.",
          },
        ],
      },
      {
        level: 18,
        name: "Enlightened Mind",
        description: "At 18th level, you gain one of the following features.",
        choices: [
          {
            name: "Battle Expert",
            description:
              "Battle Studies Required. When you hit a creature with a cantrip, you can cause the creature to gain vulnerability to one damage type of your choice for 1 minute.\n\nIf a creature has resistance to the damage type you choose, this resistance is suppressed for 1 minute, rather than gaining vulnerability. A creature that is immune to the damage type you choose is unaffected.\n\nYou can use this feature once per long rest.",
          },
          {
            name: "Perfected Communication",
            description:
              "You spend so much time on the study of other cultures and languages that you understand all spoken languages. Moreover, any creature that can understand a language can understand what you say.",
          },
        ],
      },
    ],
  },
  "Ghoul Studies & Ancient Studies": {
    name: "Ghoul Studies and Ancient Studies",
    description:
      "Specialized scholars who study either ghoulish creatures and their terrifying abilities or ancient spirits and historical guardians, developing powers that mirror their subjects of study through transformation or spiritual communion",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Outward Expressions",
        description:
          "At 1st level, you gain proficiency in Magical Creatures or History of Magic and choose one of the following features. At third level, Intellect casters do not gain the opposite ability in this subclass. Instead, they gain either an Ability Score Improvement or a Feat.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Ghoulish Trick",
            description:
              "You use illusionary trickery to take on a Ghoulish form. As a bonus action, you transform for 1 minute. You gain the following benefits while transformed:\n\nYou gain temporary hit points equal to 1d10 + your level.\nOnce during each of your turns, when you hit a creature with an attack, you can force it to make an Intelligence saving throw to see through the illusion or be terrified by your horrifying visage. If the saving throw fails, the target is frightened of you until the end of your next turn. Targets who have seen through your Ghoulish trick within the last 24 hours are immune to being frightened by you.\nYou are immune to the frightened condition.\n\nYou can transform a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
          },
          {
            name: "Ancestral Call",
            description:
              "As a bonus action, you call upon the Ancient historical figures you have studied to fight alongside you. One creature of your choice becomes the target of the Ancients, which hinder its attacks. Until the start of your next turn, when the target makes an attack or casts a spell that target must make an intelligence saving throw against your spell save DC. On a fail, the target’s attack or spell hits the Ancients and is wasted.\n\nYou can use this feature a number of times equal to your proficiency bonus per long rest.",
          },
        ],
      },
      {
        level: 6,
        name: "Inner Reflections",
        description: "At 6th level, you gain one of the following features.",
        choices: [
          {
            name: "Inner Ghoul",
            description:
              "Ghoulish Trick Required. Your fascination and study of Ghouls has caused you to be able to mimic their behaviors, and learn how to perform their magic. You gain the following benefits.\n\nYou gain darkvision out to a range of 60 feet. If you already have darkvision from your race (Innate Feat), its range increases by 30 feet.\nWhile in darkness, you are invisible to any creature that relies on darkvision to see you in that darkness.\nOnce during each of your turns, when you hit a creature with a spell attack and roll damage against the creature, you can replace the damage type with psychic damage. While you are using a Ghoulish Trick, you can roll one additional damage die when determining the psychic damage the target takes.",
          },
          {
            name: "Ancient Guardian",
            description:
              "Ancestral Call Required. The Ancient spirits that aid you can provide supernatural protection to those you defend. If a creature you can see within 30 feet of you takes damage, you can use your reaction to command an Ancient spirit to absorb the hit, reducing that damage by 1d6 + your spellcasting ability modifier.\n\nWhen you reach certain levels in this subclass, you can reduce the damage by more: by 2d6 at 10th level and by 4d6 at 14th level.",
          },
        ],
      },
      {
        level: 9,
        name: "Dark Shield",
        description:
          "At 9th Level, your connection to Ghouls or Spirits grants you protection. You gain advantage on death saving throws and resistance to necrotic damage.",
        choices: [],
      },
      {
        level: 10,
        name: "Arcane Body",
        description: "At 10th level, you gain one of the following features.",
        choices: [
          {
            name: "Warped Mind",
            description:
              "Inner Ghoul Required. You’ve spent so much time with spooky creatures that you have fortified your mind against their attacks. You have resistance to psychic damage. If you are using your Ghoulish Trick, you instead become immune to psychic damage.\n\nIn addition, when you are reduced to 0 hit points, you can use your reaction to drop to 1 hit point instead and let out an ear piercing wail, bursting with sonic energy. Each creature that is within 30 feet of you takes psychic damage equal to 2d10 + your level. You then gain 2 levels of exhaustion. Once you use this reaction, you can’t do so again until you finish a long rest.",
          },
          {
            name: "Ancestral Guidance",
            description:
              "Ancient Guardian Required. As a free action at the start of your turn, you can compel your Ancient spirits to guide you through the Unseen Realm as long as you aren’t incapacitated. You can move through other creatures and objects as if they were difficult terrain, as well as see and affect creatures and objects on the Unseen Realm. You take 1d10 force damage if you end your turn inside an object.\n\nThis feature lasts for a number of rounds equal to your Intelligence modifier (minimum of 1 round). If you are inside an object when it ends, you are immediately shunted to the nearest unoccupied space and you take force damage equal to twice the number of feet you moved.\n\nOnce you use this feature, you must finish a short or long rest before you can use it again. You can use Ancestral Guidance twice between rests starting at 14th level.",
          },
        ],
      },
      {
        level: 14,
        name: "Talented Mind",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "Spook",
            description:
              "Warped Mind Required. You begin to behave in erratic ways that throw off your enemies. Whenever a creature makes an attack roll against you and doesn't have advantage on the roll, you can use your reaction to growl and gurgle in their direction, imposing disadvantage on it. Additionally, the target must succeed on an intelligence saving throw against your spell save DC or be frightened. Targets who have seen through your Ghoulish trick within the last 24 hours are immune to being frightened by you.",
          },
          {
            name: "Ancient Rebuke",
            description:
              "Ancestral Guidance Required. Your Ancient Spirits become temporal enough to retaliate. When you use your Ancient Guardian to reduce the damage of an attack, the damage rebounds and the attacker takes the amount of damage that your Guardian prevented.",
          },
        ],
      },
      {
        level: 18,
        name: "Fearful Soul",
        description: "At 18th level, you gain one of the following features.",
        choices: [
          {
            name: "Ghoulish Existence",
            description:
              "Spook Required. You can assume the form of a massive angry Ghoul, striking fear into those around you who do not know your true form.",
          },
          {
            name: "Ancient Secrets",
            description:
              "Ancient Rebuke Required. Your study and bond with the Ancients has gained you their favor. Once per semester, you may ask them a question. They will answer truthfully, based on their knowledge from their lifetime.\n\nAdditionally, as an action, you can use your Ancient Guardian to sense the presence of illusions, shapechangers not in their original form, and other magic designed to deceive the senses within 30 feet of you. You sense that an effect is attempting to trick you, but you gain no insight into what is hidden or into its true nature. When attempting to dispel magic detected this way, you gain advantage.",
          },
        ],
      },
    ],
  },
  Quidditch: {
    name: "Quidditch",
    description:
      "Athletic spellcasters who channel their magical abilities through the sport of Quidditch, specializing in aerial combat, team coordination, and position-specific magical techniques inspired by the legendary wizarding sport",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Quidditch Initiate",
        description:
          "At 1st level you gain tool proficiency in Vehicles (Broomstick). If you already have Broomstick proficiency, you gain Expertise instead. You can summon your magical broom as a bonus action, which remains with you unless dismissed or if you’re separated from it for over 1 hour. Additionally, you gain one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Batter Up!",
            description:
              "Your practice with your Beater’s Bat and aim with a Bludger has earned you a reputation as a strong Beater. You gain proficiency in Athletics, if you already have proficiency gain Expertise instead. You also gain weapon proficiency with Beater’s Bats and Bludgers, and use Strength for the attack and damage rolls with them.",
          },
          {
            name: "Think Fast!",
            description:
              "Your maneuverability on a broom and Quidditch tactics with your Quaffle is second to none. You gain proficiency in Acrobatics, if you already have proficiency gain Expertise instead. As a bonus action, you may choose a being within 30 feet holding an item and pass your Quaffle to them. The being must succeed on a wisdom saving throw at disadvantage or drop whatever it is holding to catch your Quaffle. This overcomes any resistances to dropping or disarming beings.\n\nYou can use this feature a number of times equal to your proficiency bonus per long rest.",
          },
        ],
      },
      {
        level: 4,
        name: "Get Your Head In The Game (Optional)",
        description:
          "At 4th level, you can optionally take this feature in place of an Ability score Improvement or Feat.\n\nGet Your Head In The Game: Choose one of the following options.",
        choices: [
          {
            name: "Cheer",
            description:
              "You have a knack for bolstering your team’s confidence in a tricky situation. As a bonus action, you may inspire a number of allies equal to your proficiency bonus within 30 feet of you who can hear you. These creatures gain 1d4 that they can add to one ability check, attack roll, or saving throw before the end of their next turn. You can use this feature twice per long rest.",
          },
          {
            name: "Chirp",
            description:
              "Alternatively, you’ve learned how to mock your enemies to distract and confuse them. As a bonus action you may discourage a number of enemies equal to your proficiency bonus within 30 feet of you who can hear you. These creatures must subtract 1d4 from their next ability check, attack roll, or saving throw before the end of your next turn. You can use this feature twice per long rest.",
          },
        ],
      },
      {
        level: 6,
        name: "We're All In This Together",
        description: "At 6th level, you gain one of the following features.",
        choices: [
          {
            name: "Goalkeeper",
            description:
              "Your practice as Keeper has given you the ability to dodge and deflect attacks. You gain proficiency in Athletics or Acrobatics, and you gain a +2 bonus to your Armor Class. Additionally, as a reaction, you may force an enemy within 30 feet to reroll one attack roll, taking the lower result. You can use this ability a number of times equal to your proficiency bonus per short rest.",
          },
          {
            name: "Eagle Eyes",
            description:
              "Seeker’s skills come naturally to you. Spotting and catching tiny objects from far away are a quick reflex. You gain proficiency in Perception or Sleight of Hand. Additionally, you may add your Wisdom modifier to your Dexterity saving throws, and you gain advantage on Perception checks that rely on sight.",
          },
        ],
      },
      {
        level: 8,
        name: "I'm Ok! (Optional)",
        description:
          "At 8th level, you can optionally take this feature in place of an Ability score Improvement or Feat.\n\nI’m Ok!: Quidditch is a game played in the highest of highs but you’re no stranger to the lowest of lows. You gain the following benefits.",
        choices: [],
      },
      {
        level: 9,
        name: "Quidditch Robe",
        description:
          "At 9th level, while you are not wearing a cloak or wielding a defensive item, your armor class equals 10 + your Dexterity modifier + your Strength modifier.",
        choices: [],
      },
      {
        level: 10,
        name: "You Can't Catch Me!",
        description: "At 10th level, you gain one of the following features.",
        choices: [
          {
            name: "Zoomies!",
            description:
              "Your movement becomes so swift and streamlined that it becomes nearly instantaneous. When on a broom, or using a flying speed, you can teleport up to 60 feet as part of that movement, allowing you to pass through walls or barriers. This teleportation doesn’t provoke opportunity attacks.\n\nYou can use this feature a number of times equal to half of your proficiency bonus per long rest.",
          },
          {
            name: "I Am Speed",
            description:
              "Your understanding of aerodynamics and wind currents has given you an edge. As an action while on a broom, you can use your movement to fly up to 60 feet in a straight line, without provoking opportunity attacks and creating a wind tunnel 60 feet long and 20 feet wide that lasts for 1 minute before dispersing. Each creature that enters the wind tunnel for the first time or starts its turn in the wind tunnel must succeed on a Strength saving throw against your spell save DC or take 5d6 force damage and be pulled up to 15 feet towards the center of the wind tunnel. On a successful save the creature takes half as much damage and is not pulled.\n\nAny creature in the Wind tunnel must spend 2 feet of movement for every 1 foot it moves when moving closer to you.\n\nThe wind disperses gas or vapor, and it extinguishes candles, torches, and similar unprotected flames in the area. It causes protected flames, such as those of lanterns, to dance wildly and has a 50 percent chance to extinguish them.\n\nYou can use this feature once per long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "Best Of The Best",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "Slugger",
            description:
              "Batter up! Required. Your attacks with your Bludger and Beater’s Bat count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. Additionally, attacks with your Bludger gain the following benefits.\n\nWhen you hit a creature with your Beater’s Bat, you can deal 4d8 additional force damage. You can apply this damage a number of times equal to your strength modifier per long rest.\nWhen you hit a creature with your Bludger, you may force them to make a Strength saving throw against your spell save DC. On a failed save the target is either pushed back by 10 feet and knocked prone.",
          },
          {
            name: "Chaser's Strategy",
            description:
              "Think Fast! Required. Once per turn, you can shout a command to an ally within 30 feet who can hear you. They may use their Reaction to make an attack or cast a spell. Any attack rolls made this way are done at Advantage.\n\nYou can do this a number of times equal to your proficiency bonus per long rest.",
          },
          {
            name: "Keeper's Wall",
            description:
              "Goalkeeper Required. As a reaction, you can create an ethereal barrier to protect an ally within 30 feet, granting them a +5 bonus to their AC or a +3 bonus to saving throws. This barrier lasts until the start of your next turn, or you may use Dedication to extend the duration to 1 minute. Additionally, if there is another ally within 15 feet of the target of this ability it can be applied to both allies. The barrier will remain active for the duration as long as both allies remain within 30 feet of each other.\n\nYou can use this feature a number of times equal to your Dexterity modifier per long rest.",
          },
          {
            name: "Seeker's Sight",
            description:
              "Eagle Eyes Required. You are the best Seeker on the team, and are always reliable in a pinch. Whenever you make an Athletics, Acrobatics, Sleight of hand or Perception check, you can treat a d20 roll of 9 or lower as a 10.\n\nAdditionally, you automatically detect the faint outlines of invisible creatures or objects within 30 feet, unless they are behind total cover.",
          },
        ],
      },
      {
        level: 18,
        name: "Quidditch Team Captain",
        description: "At 18th level, you gain one of the following features.",
        choices: [
          {
            name: "All For One!",
            description:
              "Get Your Head in the Game Required. You gain one additional use of your Cheer or Chirp feature and gain one of the following bonuses.",
          },
          {
            name: "Bombs Away!",
            description:
              "Your years as team captain has made you a formidable opponent in the sky. You gain a permanent magical flying speed of 30 feet. Additionally, while flying, you gain advantage on attack rolls against creatures in a 30 foot cone directly below you.",
          },
          {
            name: "All Rounder",
            description:
              "You gain Expertise in any of the following that you are already proficient in: Athletics, Acrobatics, Perception and Sleight of Hand. Additionally, you may choose one extra feature from the Best of the Best section.",
          },
        ],
      },
    ],
  },
  Trickery: {
    name: "Trickery",
    description:
      "Deceptive spellcasters who specialize in illusion, manipulation, and stealth magic, using subtle enchantments, false memories, and duplicity to control situations and misdirect opponents through cunning rather than force",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Scoundrel",
        description:
          "At 1st level you learn the spell Manus. Any casting of this spell is considered subtle. Additionally, you gain access to the Trickery spellbook and one of the following features.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Insidious Rumor",
            description:
              "You learn to infuse innocent-seeming words with an insidious magic that can inspire terror.\n\nIf you speak to a being alone for at least 1 minute, you can attempt to seed paranoia and fear into its mind. At the end of the conversation, the target must succeed on a Wisdom saving throw against your spell save DC or be frightened of you or another creature of your choice. The target is frightened in this way for 1 hour, until it is attacked or damaged, or until it witnesses its allies being attacked or damaged. Creatures with less than 4 Intelligence are immune to this effect.\n\nIf the target succeeds on its saving throw, the target has no hint that you tried to frighten it.\n\nOnce you use this feature, you can't use it again until you finish a short rest or long rest.",
          },
          {
            name: "Sticky Fingers",
            description:
              "When you cast Manus, you can make the spectral hand invisible, and you can perform the following additional tasks without being noticed by a creature if you succeed on a Dexterity (Sleight of Hand) check contested by the creature's Wisdom (Perception) check:\n\nYou can stow one object the hand is holding in a container worn or carried by another creature.\nYou can retrieve an object in a container worn or carried by another creature.\nYou can use thieves' tools to pick locks and disarm traps at range.\n\nIn addition, you can use a bonus action to control the hand.",
          },
        ],
      },
      {
        level: 4,
        name: "Silver Tongue (Optional)",
        description:
          "At 4th level, you can optionally take this feature in place of an Ability score Improvement or Feat.\n\nSilver Tongue: You are a master at saying the right thing at the right time. When you make a Charisma (Persuasion) or Charisma (Deception) check, you can treat a d20 roll of 7 or lower as a 8.",
        choices: [],
      },
      {
        level: 6,
        name: "Perjurer",
        description:
          "At 6th level, you gain Sneaky Studies and one of the following features.",
        choices: [
          {
            name: "Duplicate",
            description:
              "As an action, you create a perfect illusion of yourself that lasts for 1 minute, or until you lose your concentration (as if you were concentrating on a spell). The illusion appears in an unoccupied space that you can see within 30 feet of you. As a bonus action on your turn, you can move the illusion up to 30 feet to a space you can see, but it must remain within 120 feet of you.\n\nFor the duration, you can cast spells as though you were in the illusion's space, but you must use your own senses. Additionally, when both you and your illusion are within 5 feet of a creature that can see the illusion, you have advantage on attack rolls against that creature, given how distracting the illusion is to the target.\n\nYou can use this feature once per long rest.",
          },
          {
            name: "Make Nice",
            description:
              "If you spend at least 1 minute observing or interacting with another creature outside combat, you can learn certain information about its capabilities compared to your own. The DM tells you if the creature is your equal, superior, inferior or what their subclass is, in regard to two of the following characteristics of your choice:",
          },
          {
            name: "Deep Pockets",
            description:
              "A good thief knows to keep their ill-gotten gains close to the chest, and you have learned how to take it to the next level. The inside of one garment holds a one-foot diameter compartment which is visible and accessible only to you. The compartment is permanently affected by the Capacious Extremis charm. If taken into a space already magically extended, the pocket becomes temporarily inaccessible but does not interact unfavorably as other similar enchantments would.",
          },
        ],
      },
      {
        level: 8,
        name: "Obliviator (Optional)",
        description:
          "At 8th level, you can optionally take this feature in place of an Ability score Improvement or Feat.\n\nObliviator: Instead of simply erasing memories, when you cast obliviate, you can choose to implant very detailed false memories. These memories are undetectable by the target of the spell, but if others examine the target's memories (through Legilimency or a Pensieve), they might be able to detect that they're false.",
        choices: [],
      },
      {
        level: 9,
        name: "Sneaky Bitch",
        description:
          "Starting at 9th level, on your turn you can take one additional bonus action, and can use your bonus actions to take the Dash, Disengage or Hide action.",
        choices: [],
      },
      {
        level: 10,
        name: "Manipulative Motives",
        description: "At 10th level, you gain one of the following features.",
        choices: [
          {
            name: "Look at me",
            description:
              "Your words become extraordinarily beguiling. As an action, you can make a Charisma (Persuasion) check contested by a creature's Wisdom (Insight) check. The creature must be able to hear you, and the two of you must share a language.\n\nIf you succeed on the check and the creature is hostile to you, it has disadvantage on attack rolls against targets other than you and can't make opportunity attacks against targets other than you. This effect lasts for 1 minute, until one of your companions attacks the target or affects it with a spell, you use this feature on another creature, or until you and the target are more than 60 feet apart.\n\nIf you succeed on the check and the creature isn't hostile to you, it is charmed by you for 1 minute. While charmed, it regards you as a friendly acquaintance. This effect ends immediately if you or your companions do anything harmful to it.",
          },
          {
            name: "Mirrored Memories",
            description:
              "You can weave illusions into your stories, causing those who hear them to believe they experienced the events firsthand. Once per long rest, as an action, you can choose a creature or group of creatures within 60 feet and tell a vivid story. The targets must make an Intelligence saving throw against your spell save DC. On a failed save they are charmed and believe the events of your story actually happened to them until they complete a long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "False Witness",
        description: "At 14th level, you gain one of the following features.",
        choices: [
          {
            name: "Misdirection",
            description:
              "You can occasionally cause another creature to suffer an attack meant for you. When you are targeted by an attack while a creature is within 5 feet of you, you can use your reaction to have the attack target that creature instead of you.",
          },
          {
            name: "Veiled Influence",
            description:
              "If you spend 10 minutes in conversation with a creature, you can leave them with a lingering magical impression. For the next 24 hours, you have advantage on Charisma checks against that creature. Additionally, you can subtly implant a suggestion or idea during this conversation, requiring the target to make a Wisdom saving throw against your spell save DC. On a failed save, they are influenced by the implanted idea and each time it acts in a manner directly counter to your instructions, it takes 4d10 psychic damage. This damage cannot be taken more than three times in a 24 hour period.\n\nYou can issue any command you choose, short of an activity that would result in certain death. Should you issue a suicidal command, the effect ends. You can end the effect early by using an action to dismiss it.",
          },
        ],
      },
      {
        level: 18,
        name: "Blatant Exploitation",
        description: "At 18th level, you gain one of the following features.",
        choices: [
          {
            name: "Quintuplicate",
            description:
              "Duplicate Required. You can create up to four duplicates of yourself, instead of one, when you use Duplicate. As a bonus action on your turn, you can move any number of them up to 30 feet, to a maximum range of 120 feet.\nAdditionally, when you are the target of a spell or attack you can use your reaction to swap places with one of your duplicates within 60 feet of you.",
          },
          {
            name: "Yoink!",
            description:
              "You gain the ability to magically steal the knowledge of how to cast a spell from another spellcaster.\n\nImmediately after a creature casts a spell that targets you or includes you in its area of effect, you can use your reaction to force the creature to make a saving throw with its spellcasting ability modifier. The DC equals your spell save DC. On a failed save, you negate the spell's effect against you, and you steal the knowledge of the spell if it is at least 1st level and of a level you can cast. For the next 8 hours, you know the spell and can cast it using your spell slots. The creature can't cast that spell until the 8 hours have passed.\n\nYou can use this feature a number of times equal to your proficiency bonus per long rest.",
          },
        ],
      },
    ],
  },
  "Necromantic Healer": {
    name: "Necromantic Healer",
    description:
      "Dark healers who walk the line between life and death, using forbidden necromantic arts to both harm enemies and heal allies through unconventional means",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Profane Studies",
        description: "At 1st level, choose one of the following.",
        choices: [
          {
            name: "Shadowmend",
            description:
              "You lock in one dark spell of 2nd level or lower of your choice from any spell list. When you cast a cantrip with the dark tag that normally targets only one creature, you can choose to do one of the following:\n\nTarget two creatures within range and within 10 feet of each other.\nTarget one creature and one ally within 10 feet of each other. The creature takes damage as normal, and the ally regains hit points equal to the damage die of the spell.",
          },
          {
            name: "Shared Agony",
            description:
              "You can link the life force of your enemies into a shared conduit of suffering. As an action you may force a number of creatures you can see within 60 feet equal to your Healing Modifier (minimum of 1 creature) to succeed on a Constitution saving throw against your spell save DC or become Tethered for 1 minute. A Tethered creature suffered the following effects:\n\nWhenever a tethered creature takes damage from your spells or subclass bonuses, all other tethered creatures take necrotic damage equal to your proficiency bonus.\nA tethered creature regains only half the normal amount of hit points from healing.\n\nYou may use this feature once per long rest.",
          },
        ],
      },
      {
        level: 4,
        name: "Marrowbound (Optional)",
        description:
          "At 4th level, you can optionally take this feature in place of an Ability score Improvement or Feat.",
        choices: [
          {
            name: "Reanimate Remains",
            description:
              "You have mastered the forbidden art of reanimating the dead. You learn the ritual of assembling a Marrowbound, a twisted undead servant crafted from scavenged bones and other remains.\n\nThe Marrowbound is friendly to you and your companions and obeys your commands. See this creature's game statistics in the Marrowbound stat block, which uses your proficiency bonus (PB) in several places. You determine the Marrowbound's appearance.\n\nIn combat, the Marrowbound shares your initiative count, but it takes its turn immediately after yours. The only action it takes on its turn is the Dodge action, unless you take a bonus action on your turn to command it to take another action. That action can be one in its stat block or some other action. If you are incapacitated, the spirit can take any action of its choice, not just Dodge.\n\nIf the Marrowbound is reduced to 0 hit points, it crumbles into inert bone fragments. You can restore it during a long rest by performing an hour of necromantic reconstruction using small bones, grave soil, or animal remains worth 25 Galleons.",
          },
        ],
      },
      {
        level: 6,
        name: "Brand of Death",
        description: "At 6th level, choose one of the following.",
        choices: [
          {
            name: "Undead Thralls",
            description:
              "You lock in the Gehennus Conjurus spell. When you cast Gehennus Conjurus, you summon one more Inferius than usual.\n\nWhenever you cast Gehennus Conjurus spell, the Inferi have these additional benefits:\n\nThe creature's hit point maximum is increased by an amount equal to your level.\nThe creature adds your proficiency bonus to its weapon damage rolls.",
          },
          {
            name: "Defy Death",
            description:
              "You can give yourself vitality when you cheat death or when you help someone else cheat it. You can regain hit points equal to your level + Healing modifier (minimum of 1 hit point) when you succeed on a death saving throw or when you stabilize a creature with a spell.",
          },
          {
            name: "Anguish",
            description:
              "When you hit a creature with a spell attack, you may deal an additional 1d8 necrotic damage and force the target to make a constitution saving throw against your spell save DC or be stunned until the end of your next turn. This damage increases to 2d8 at 14th Level.\n\nYou may use this feature a number of times equal to your proficiency bonus per long rest.",
          },
        ],
      },
      {
        level: 6,
        name: "Curse Cleanser",
        description:
          "Starting at 9th level, when you use a healing spell of 1st level or higher on a creature, you can end one condition or magical effect on them. The condition must be one of the following: charmed, frightened, poisoned, blinded, deafened, or cursed. The level of the curse must be equal to or lower than the level of the healing spell.\n\nYou can do this a number of times equal to your spellcasting modifier per long rest.",
        choices: [],
      },
      {
        level: 10,
        name: "Salvaged Remains",
        description: "At 10th level, choose one of the following.",
        choices: [
          {
            name: "Curse Chain",
            description:
              "Shared Agony Required. When a creature Tethered by your Shared Agony feature fails a saving throw and becomes affected by a condition (such as charmed, frightened, paralyzed, stunned, blinded, deafened, poisoned, or similar), all other tethered creatures must make the same saving throw at the end of their next turn or suffer the same condition for its remaining duration.",
          },
          {
            name: "Harvest the Fallen",
            description:
              "You gain the ability to reap life energy from creatures you kill with your spells. Once per turn when you kill one or more creatures with a spell of 1st level or higher, you regain hit points equal to twice the spell's level, or three times its level if the spell has the dark tag.\n\nWhen you kill a creature this way, you may regain one expended spell slot of the same level as the spell used to kill it.",
          },
          {
            name: "Siphoned Vitality",
            description:
              "Once per turn, when you hit with a spell of 1st level or higher that deals damage, you can choose one ally within 30 feet to regain hit points equal to the spell’s level + your spellcasting ability modifier. Additionally, when a creature within 15 feet of you drops to 0 hit points you can use your reaction to regain hit points equal to half of that creature’s hitpoint maximum.",
          },
          {
            name: "Whispers of Mending",
            description:
              "Shadowmend Required Your healing magic weaves through shadow and unseen spaces, reaching those beyond the limits of sight.\n\nThe range of all healing spells you cast is increased by 5 feet.\nIf a healing spell normally requires touch, it can instead target a creature within 10 feet.",
          },
        ],
      },
      {
        level: 14,
        name: "Curse of Rot",
        description:
          "At 14th level, choose one of the following ultimate necromantic powers.",
        choices: [
          {
            name: "Touch of Blight",
            description:
              "Your touch can channel the energy of death into a creature. As an action, you touch one creature within 5 feet of you, and you expend 1 to 10 sorcery points. The target must make a Constitution saving throw, and it takes 2d10 necrotic damage per sorcery point spent on a failed save, or half as much damage on a successful one.",
          },
          {
            name: "Command Undead",
            description:
              "You can use magic to bring undead under your control, even those created by other wizards. As an action, you can choose one undead that you can see within 60 feet of you. That creature must make a Charisma saving throw against your spell save DC. If it succeeds, you can't use this feature on it again. If it fails, it becomes friendly to you and obeys your commands until you use this feature again.\n\nIntelligent undead are harder to control in this way. If the target has an Intelligence of 8 or higher, it has advantage on the saving throw. If it fails the saving throw and has an Intelligence of 12 or higher, it can repeat the saving throw at the end of every hour until it succeeds and breaks free.",
          },
          {
            name: "Hex Surge",
            description:
              "Once per turn you may add twice your Healing modifier to the damage of one target of a dark spell.",
          },
        ],
      },
      {
        level: 18,
        name: "Life and Death",
        description: "At 18th level, choose one of the following.",
        choices: [
          {
            name: "Continual Casting",
            description:
              "Whenever you reduce a creature to 0 hit points with a spell of 1st level or higher, you can immediately cast a spell of 3rd level or lower without expending a spell slot. The spell must have a casting time of 1 action or 1 bonus action.\n\nYou can use this feature a number of times equal to your proficiency bonus per long rest.",
          },
          {
            name: "Gravewalk",
            description:
              "Shared Agony Required. You become immune to necrotic damage and cannot be reduced below 1 hit point by damage from any creature that is Tethered by your Shared Agony feature.\n\nAdditionally, you can cast all locked in spells that have the dark tag or restore hit points wordlessly and wandlessly.",
          },
          {
            name: "Covenant of Ruin",
            description:
              "Your presence corrodes the boundary between life and death. At the start of each of your turns, each enemy within 10 feet of you takes necrotic damage equal to your Healing modifier (minimum of 1). If a creature affected by this damage is also under the effects of one of your spells, conditions or subclass features, it instead takes double that amount.\n\nThis aura bypasses resistance to necrotic damage.",
          },
        ],
      },
    ],
  },
  Alchemy: {
    name: "Alchemy",
    description:
      "Masters of alchemical transformation, potion brewing, and metallurgical arts with three distinct paths: Simple Elixir creation, Spagyrics plant magic, and Smith's armor enhancement.",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Alchemical Focus",
        description: "At 1st level choose one of the following features.",
        choices: [
          {
            name: "Simple Elixir",
            description:
              "You gain proficiency in potion making, alchemist’s supplies, and potion making kits. Whenever you finish a long rest, you can magically produce a simple elixir in an empty phial you touch. Roll on the table for the elixir's effect, which is triggered when someone drinks the elixir. As a bonus action, a creature can drink the elixir or administer it to a creature.\n\nYou can create additional elixirs by expending a spell slot of 1st level or higher for each one. When you do so, you use your action to create the elixir in an empty flask you touch, and you choose the elixir's effect from the elixir table.\n\nCreating an elixir requires you to have alchemist supplies on your person, and any elixir you create with this feature lasts until it is drunk or until the end of your next long rest.\n\nWhen you reach certain levels, you can make more elixirs at the end of a long rest: two at 6th level and three at 15th level. Roll for each elixir's effect separately. Each elixir requires its own phial.\n\n\n\nd6\nEffect\n1",
          },
          {
            name: "Spagyricist",
            description:
              "Your alchemical knowledge veers towards the rarer form of Spagyrics, focusing on plants. You gain proficiency in Medicine, Herbology and Herbology kits.\n\nAdditionally, your study of herbs and their properties has caused you to learn how to mix their innate magic with yours. As a bonus action, you can touch a creature that has less than its full hitpoints and do one of the following.\n\nRestore a number of hitpoints equal to a roll 1d4 + your Medicine or Herbology modifier (Whichever is higher)\nDeal necrotic damage equal to 1d4 + your Medicine or Herbology modifier (Whichever is higher)\n\nThe die rolled for this feature increases as you level up in this subclass. It becomes 1d6 at 5th level, 1d8 at 11th level, and 1d10 at 17th level. You can do this a number of times equal to your proficiency bonus per long rest.",
          },
          {
            name: "The Smith",
            description:
              "Your metallurgical pursuits have led to you making armor a conduit for your magic. You gain proficiency with heavy armor and smiths tools, and gain a set of alchemical armor with an AC of 15.",
          },
        ],
      },
      {
        level: 9,
        name: "Alchemist Stone",
        description:
          "At 9th level you can spend 8 hours creating an Alchemist's stone that stores transfiguration magic. You can benefit from the stone yourself or give it to another creature. A creature gains a benefit of your choice as long as the stone is in the creature's possession. When you create the stone, choose the benefit from the following options:",
        choices: [],
      },
      {
        level: 10,
        name: "Triaprima",
        description: "At 10th level choose one of the following features.",
        choices: [
          {
            name: "Powerful Elixir",
            description:
              "Simple Elixir Required. You gain expertise in potion making, alchemist’s supplies, or potion making kits.\n\nWhenever a creature drinks an elixir or potion you created, the creature gains temporary hit points equal to 2d6 + your Potions modifier (minimum of 1 temporary hit point) or takes additional acid damage equal to the same amount.\nYou can cast Reparifors without expending a spell slot, provided you use alchemist's supplies as the spellcasting focus. You can do so a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
          },
          {
            name: "Swift Hands",
            description:
              "Spagyricist Required. You gain proficiency in sleight of hand. Your ability to add herbal alchemy to your magic doubles. Whenever you use your bonus action to heal or harm with Spagyrics, you can do so twice.",
          },
          {
            name: "Bewitched Weaponry",
            description:
              "The Smith Required. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 fire or radiant damage to the target. When you reach 14th level, the extra damage increases to 2d8.\n\nAdditionally, you gain resistance to fire and radiant damage.",
          },
        ],
      },
      {
        level: 14,
        name: "Chemistry and Metallurgy",
        description: "At 14th level choose one of the following features.",
        choices: [
          {
            name: "Chemist",
            description:
              "Spagyricist or Simple Elixir Required. You have been exposed to so many chemicals that they pose little risk to you, and you can use them to quickly end certain ailments:\n\nYou gain resistance to acid damage and poison damage, and you are now immune to the poisoned condition.\nYou can cast Animatem and Brackium Emendo without expending a spell slot, and without having to have the spell mastered, provided you use alchemist’s supplies as the spellcasting focus. Once you cast either spell with this feature, you can't cast that spell with it again until you finish a long rest.",
          },
          {
            name: "Master Blacksmith",
            description:
              "The Smith Required.\n\nGuardian. When a Huge or smaller creature you can see ends its turn within 30 feet of you, you can use your reaction to magically force it to make a Strength saving throw against your spell save DC. On a failed save, you pull the creature up to 25 feet directly to an unoccupied space. If you pull the target to a space within 5 feet of you, you can make a melee weapon attack against it as part of this reaction.\n\nYou can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses of it when you finish a long rest.\n\nInfiltrator. Any creature that takes lightning damage from your Lightning Launcher glimmers with magical light until the start of your next turn. The glimmering creature sheds dim light in a 5-foot radius, and it has disadvantage on attack rolls against you, as the light jolts it if it attacks you. In addition, the next attack roll against it has advantage, and if that attack hits, the target takes an extra 1d6 lightning damage.",
          },
        ],
      },
      {
        level: 18,
        name: "Everlasting Life",
        description: "At 18th level choose one of the following features.",
        choices: [
          {
            name: "Heart of the Smith",
            description:
              "The Smith Required. You gain immunity to fire and radiant damage.\nWhile wearing heavy armor, you have resistance to bludgeoning, piercing, and slashing damage, and immunity to those types of damage if they are nonmagical.",
          },
        ],
      },
    ],
  },
};

export const subclasses = Object.keys(subclassesData);
