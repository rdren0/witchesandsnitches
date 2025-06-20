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
          "At 1st level, you gain Target Practice and choose one additional feature that defines your approach to charms magic.",
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
              "You gain access to the Protego spell. Additionally, when you cast a Protego, you may choose to affect a friendly creature within 30 feet. When you or a friendly creature is affected by one of your protego spells, they may roll 1d4 and add that number to the AC bonus of the spell. At 5th level, you gain access to Protego Maxima and can cast either spell twice per round as reactions.",
          },
        ],
      },
      {
        level: 4,
        name: "Mastered Charms (Optional)",
        description:
          "Can take instead of ASI/Feat. +1 Dexterity (max 20). Choose five known cantrips as Mastered Charms - each can be cast once per short rest as a bonus action without expending sorcery points.",
        choices: [],
      },
      {
        level: 6,
        name: "Advanced Charmswork",
        description:
          "Choose: Rapid Casting (cast additional charms spells per action, scaling with level) or Professional Charmer (access to enhanced Professional Charms spell versions).",
        choices: [
          {
            name: "Rapid Casting",
            description:
              "When you cast a Charms spell as an action, cast another locked-in Charms spell of 3rd level or lower as part of that action. Increases to 3 spells at 10th level, 4 spells at 18th level.",
          },
          {
            name: "Professional Charmer",
            description:
              "Gain access to Professional Charms spell enhancements (enhanced versions of Diffindo, Immobulus, Deprimo, Confundo, Piertotum Locomotor that must be locked in).",
          },
        ],
      },
      {
        level: 9,
        name: "Double Cast",
        description:
          "When you cast a spell of 1st level or higher that doesn't deal damage, choose one additional target for the same spell within range without expending an additional spell slot. Once per long rest.",
        choices: [],
      },
      {
        level: 10,
        name: "Powerful Magic",
        description:
          "Choose: Durable Spellwork (defensive concentration bonuses) or Issued Command (allies can cast your charms spells).",
        choices: [
          {
            name: "Durable Spellwork",
            description:
              "While you maintain concentration on a spell, you have +2 bonus to AC and all saving throws.",
          },
          {
            name: "Issued Command",
            description:
              "Once per round, command an ally to cast one of your locked-in charms spells without them needing the spell or gaining a casting attempt. Use half proficiency bonus times per long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "Refined Techniques",
        description:
          "Choose: Wand and Shield (dual-casting concentration spells) or The Sound of Silence (enhanced subtle spellcasting).",
        choices: [
          {
            name: "Wand and Shield",
            description:
              "When casting Protego/Protego Maxima, transition to off-hand (bonus action dedication) while maintaining another concentration/dedication spell with your wand. Make separate Constitution saves for each spell when taking damage.",
          },
          {
            name: "The Sound of Silence",
            description:
              "Gain Subtle Spell metamagic (doesn't count toward limit). Use Subtle Spell for half normal sorcery points. If you already have Subtle Spell, exchange it for a different metamagic.",
          },
        ],
      },
      {
        level: 18,
        name: "Pinnacle of Casting",
        description:
          "Choose: Called Shot (reroll missed spell attacks) or Force of Will (enhanced save-or-suck spells with doubled areas).",
        choices: [
          {
            name: "Called Shot",
            description:
              "If you miss with a spell attack roll, reroll with advantage. Twice per rest.",
          },
          {
            name: "Force of Will",
            description:
              "Creatures make saving throws against your Charms spells at disadvantage. Charms spells with area effects (cube, line, sphere, cone) have doubled area size.",
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
        description:
          "At 1st level, you choose a specialization that defines your approach to dark magic - either becoming an Auror-in-training with investigative skills or focusing on curse-breaking techniques to dismantle hostile magic.",
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
              "You've started practicing skills to become an Auror. You learn two common potion recipes (or one uncommon), gain an Auror's kit with tracking tools, disguise items, false identity materials, and a healing vial (1d4 HP per dose, proficiency bonus doses per long rest). Gain proficiency in two of: Investigation, Potion-Making, Stealth, Survival.",
          },
          {
            name: "Curse-Breaking",
            description:
              "Your curiosity in dismantling spells has found an outlet. When you or an ally within 5 feet are targeted by any Jinx, Hex, Curse, or Dark spell, you can use your reaction to make a spellcasting ability check (DC 10 + spell level). On success, you change the spell into a different locked-in JHC or Dark spell of your choosing.",
          },
        ],
      },
      {
        level: 6,
        name: "Combat-Ready",
        description:
          "Choose: Forceful Magic (bonus action melee spell attacks with scaling damage) or Magical Adrenaline (self-healing in combat situations).",
        choices: [
          {
            name: "Forceful Magic",
            description:
              "When you cast a spell requiring a spell attack, make an additional melee spell attack as a bonus action (1d6 + spellcasting modifier damage). Damage increases: 1d8 at 8th level, 1d10 at 10th level, 1d12 at 12th level.",
          },
          {
            name: "Magical Adrenaline",
            description:
              "As a bonus action, regain 1d10 + your level hit points. Use 1 + Constitution modifier times per long rest (minimum 1).",
          },
        ],
      },
      {
        level: 9,
        name: "Enhanced Curses",
        description:
          "When you hit a creature with a Jinx, Hex, or Curse, use bonus action to deal additional damage equal to JHC modifier + Charisma modifier. Use JHC modifier times per long rest.",
        choices: [],
      },
      {
        level: 10,
        name: "Specialized Skills",
        description:
          "Choose: Dark Traces (detect dark beings and magic) or Ward-Breaker (redirect area spells back to caster - requires Curse-Breaking choice).",
        choices: [
          {
            name: "Dark Traces",
            description:
              "As an action, detect Dark Beings or Dark magics within 60 feet until end of next turn (not behind total cover). Know creature type but not identity. Use 1 + Charisma modifier times per long rest.",
          },
          {
            name: "Ward-Breaker",
            description:
              "Requires Curse-Breaking. When hostile creature casts JHC/Dark spell with area effect, reaction to make spellcasting check (DC 12 + spell level). Success redirects spell origin to center on the caster.",
          },
        ],
      },
      {
        level: 14,
        name: "Cursemaster",
        description:
          "Choose: Dark Duelist (defensive mastery and spell enhancement) or Defensive Arts (counterattack when spells miss you).",
        choices: [
          {
            name: "Dark Duelist",
            description:
              "Advantage on saving throws against Jinxes, Hexes, Curses, or Dark spells. Your JHC/Dark spells are automatically cast one level higher than the consumed spell slot (not exceeding your highest available slot level).",
          },
          {
            name: "Defensive Arts",
            description:
              "If a creature misses a ranged spell attack against you, or you succeed on a spell's saving throw, blast the attacker with 4d6 arcane force damage as a reaction.",
          },
        ],
      },
      {
        level: 18,
        name: "Legendary",
        description:
          "Choose: Dark Manipulation (summon inferi allies) or Unravelling Magic (automatically succeed on specific dispelling spells).",
        choices: [
          {
            name: "Dark Manipulation",
            description:
              "Use an action to summon two inferi to fight with you. Once per long rest.",
          },
          {
            name: "Unravelling Magic",
            description:
              "You automatically succeed whenever casting Finite Incantatem and Langlock spells.",
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
          "At 1st level, you choose a specialization that defines your approach to transfiguration magic - focusing on biological knowledge, elemental mastery, or magical weaponry.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Anatomy Textbook",
            description:
              "Your knowledge of creature anatomy makes transfigurations easier. Cast Transfiguration spells involving living creatures using a spell slot one level lower than normally required.",
          },
          {
            name: "Intuitive Conversion",
            description:
              "Conceptualizing transfigurations comes easily to you. When you cast Vera Verto, it automatically affects targets one size larger than specified by the spell slot level.",
          },
          {
            name: "Elementalist",
            description:
              "Your study of Alchemy gives insights into elemental nature. Choose: Elemental spells cast one level higher, OR deal extra elemental damage (scaling 1d4 to 5d4) plus gain 10-foot fly speed when casting spells.",
          },
          {
            name: "Transfigured Armament",
            description:
              "When casting Vera Verto, transfigure your wand into any melee weapon (magical damage, various weapon types available). Gain Extra Attack at 6th level (2 attacks), 11th level (3 attacks), 17th level (4 attacks).",
          },
        ],
      },
      {
        level: 4,
        name: "Elemental Spirit (Optional ASI)",
        description:
          "Requires Elementalist. Summon elemental spirits (Poison, Ice, Flame, Lightning, Wind) that deal 2d6 damage in 10-foot radius and fight alongside you. Once per long rest.",
        choices: [],
      },
      {
        level: 6,
        name: "Transfiguration Prodigy",
        description:
          "Choose: Animagus Transformation (shapechanging ability), Elemental Casting (spell list + damage aura), or Rune-Etched Weapon (spellcasting through weapons - requires Transfigured Armament).",
        choices: [
          {
            name: "Animagus Transformation",
            description:
              "Transform into animal form twice per short rest. Choose Combat Form (Medium/Large predators) or Evasion Form (Tiny/Small/Medium discrete animals) with different stat blocks.",
          },
          {
            name: "Elemental Casting",
            description:
              "Gain Elemental Casting spell list. When casting elemental damage spells, creatures within 10 feet take half your level in elemental damage. Proficiency bonus uses per long rest.",
          },
          {
            name: "Rune-Etched Weapon",
            description:
              "Requires Transfigured Armament. Use spellcasting modifier for weapon attacks. Cast 30-foot spells as touch through weapon. Cast locked spells through weapon as spell blade.",
          },
        ],
      },
      {
        level: 8,
        name: "Magic Weaponry (Optional ASI)",
        description:
          "I Cast Smack - Requires Transfigured Armament. Gain Valiant spell list and cast through weapon. Choose fighting style: Archery, Sightless Swordsman, Defensive, Fencer, Deep Cuts, Thrown Armament, or Dual Wielding.",
        choices: [],
      },
      {
        level: 9,
        name: "Feats of Strength",
        description:
          "Choose: Alchemist's Stone (magical item creation), Aura of Valiance (saving throw bonuses), or Elemental Push (movement control with elemental damage).",
        choices: [
          {
            name: "Alchemist's Stone",
            description:
              "Requires Anatomy Textbook or Intuitive Conversion. Create stone granting: Darkvision 60ft, +10 speed, Con save proficiency, or elemental resistance. Change effect when casting Transfiguration spells.",
          },
          {
            name: "Aura of Valiance",
            description:
              "Requires Transfigured Armament. You and allies within 10 feet (30 feet at 18th level) gain Strength modifier bonus to saving throws while you're conscious.",
          },
          {
            name: "Elemental Push",
            description:
              "Requires Elementalist. Elemental damage reduces creature speed by 10 feet. Add Strength modifier to Incendio Ruptis damage.",
          },
        ],
      },
      {
        level: 10,
        name: "Precise Control",
        description:
          "Choose: Partial Transfiguration (affect only desired portions), Molding the Elements (counterattack with elemental damage + knockback), or Power Strike (cantrip + weapon attack combo).",
        choices: [
          {
            name: "Partial Transfiguration",
            description:
              "Any Transfiguration spell can target only desired portions of the target while maintaining all normal capabilities and restrictions.",
          },
          {
            name: "Molding the Elements",
            description:
              "When hit by attack, reaction to deal your level in elemental damage and force Strength save (DC = spell save DC). Failed save pushes 20 feet, failure by 5+ knocks prone.",
          },
          {
            name: "Power Strike",
            description:
              "Requires Rune-Etched Weapon or I Cast Smack. When casting cantrip as action, make weapon attack as bonus action. Weapon attacks crit on 19-20.",
          },
        ],
      },
      {
        level: 14,
        name: "Magically Reinforced",
        description:
          "Choose: Durable Constructs (enhanced creature constructs), Fortified Structures (stronger objects), Will of the Wind (flight + group flight), or Bonded Weaponry (weapon summoning).",
        choices: [
          {
            name: "Durable Constructs",
            description:
              "Transfigured/conjured living constructs gain additional HP equal to your level and deal +1d6 damage.",
          },
          {
            name: "Fortified Structures",
            description:
              "Transfigured/conjured objects have twice the HP and support three times the weight of mundane equivalents.",
          },
          {
            name: "Will of the Wind",
            description:
              "Gain 60-foot magical fly speed. Can reduce to 30 feet for 1 hour to grant 30-foot fly speed to 3 + Transfiguration modifier creatures. Once per short rest.",
          },
          {
            name: "Bonded Weaponry",
            description:
              "Requires Transfigured Armament. Ritual bond with weapon prevents disarming and allows bonus action summoning from same plane.",
          },
        ],
      },
      {
        level: 18,
        name: "Molecular Manipulator",
        description:
          "Choose: Apex Predator (enhanced Animagus), True Alchemist (Philosopher's Stone), Element Blast (immunity + damage boost), or Deadly Strike (enhanced weapon criticals).",
        choices: [
          {
            name: "Apex Predator",
            description:
              "Requires Animagus Transformation. Transform as bonus action, gain two additional animal forms that can be hidden from Ministry, use any as corporeal patronus.",
          },
          {
            name: "True Alchemist",
            description:
              "Create Philosopher's Stone (turn metal to gold, Elixir of Life). Cannot die naturally, age 1 year per 10 years passed. Only one stone may exist.",
          },
          {
            name: "Element Blast",
            description:
              "Immunity to two elemental damage types (acid, cold, fire, lightning, thunder). Transfiguration damage spells deal extra half-level elemental damage to one target.",
          },
          {
            name: "Deadly Strike",
            description:
              "Requires Transfigured Armament. Weapon hits give target disadvantage on next spell save. Weapon attacks crit on 18-20.",
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
          "At 1st level, you gain Star Grass Salve recipe and choose a specialization that defines your approach to healing magic - focusing on personal resilience, enhanced healing power, or group support bonds.",
        choices: [],
      },
      {
        level: 1,
        name: "Star Grass Salve",
        description:
          "You learn the star grass salve recipe. Use Intelligence (Potion Making) or Wisdom (Medicine) instead of Wisdom (Potion Making) when brewing. When administering star grass salve to others, it heals additional HP equal to your level.",
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
              "Your study of injuries and diseases has given you iron will. Cannot be frightened by non-magical effects and have advantage on Constitution saving throws.",
          },
          {
            name: "Powerful Healer",
            description:
              "Your healing spells are more effective. When using spells of 1st level or higher to restore HP, the target regains additional HP equal to 2 + spell level.",
          },
          {
            name: "Therapeutic Friendship",
            description:
              "Create magical bonds among willing creatures (proficiency bonus creatures within 30 feet for 10 minutes). Bonded creatures within 30 feet of each other can add 1d4 to attack rolls, ability checks, or saves once per turn. Use proficiency bonus times per long rest.",
          },
        ],
      },
      {
        level: 4,
        name: "Restorative Presence (Optional ASI)",
        description:
          "Choose: Preserve Life (distribute healing points among multiple targets) or Life Balm (movement-based healing without opportunity attacks).",
        choices: [
          {
            name: "Preserve Life",
            description:
              "As an action, restore HP equal to 5 × your level. Divide among creatures within 30 feet, maximum half their HP max each. Cannot target undead/constructs. Use half proficiency bonus times per long rest.",
          },
          {
            name: "Life Balm",
            description:
              "As an action, move up to speed without provoking opportunity attacks. When moving within 5 feet of creatures, restore 2d6 + spellcasting modifier HP (minimum 1). Each creature can benefit once per use. Use half proficiency bonus times per long rest.",
          },
        ],
      },
      {
        level: 6,
        name: "Dedicated Protector",
        description:
          "Choose: An Ounce of Prevention (self-healing when healing others), A Saving-People Thing (ally damage redirection), or Potent Spellcasting (spell attack damage bonus).",
        choices: [
          {
            name: "An Ounce of Prevention",
            description:
              "Requires Powerful Healer. When casting healing spells of 1st level+ on others, you regain HP equal to 2 + spell level.",
          },
          {
            name: "A Saving-People Thing",
            description:
              "Requires Therapeutic Friendship. When bonded creature takes damage, another bonded creature within 30 feet can use reaction to cast Protego, teleport within 5 feet, and take all damage instead.",
          },
          {
            name: "Potent Spellcasting",
            description:
              "Once per turn when hitting with spell attack, deal extra 1d8 radiant damage (2d8 at 14th level).",
          },
        ],
      },
      {
        level: 9,
        name: "Spell Breaker",
        description:
          "When restoring HP with 1st level+ spell, can also end one spell on the target. Ended spell level must be ≤ healing spell slot level used.",
        choices: [],
      },
      {
        level: 10,
        name: "Moral Support",
        description:
          "Choose: Never Give Up (death save advantage and bonus healing), Emergency Care Plan (doubled healing ranges), or When It Matters (DM discretion ally reinforcement).",
        choices: [
          {
            name: "Never Give Up",
            description:
              "While conscious, allies within 60 feet have advantage on death saves. Allies stabilized/healed from dying by your healing receive bonus HP equal to your level.",
          },
          {
            name: "Emergency Care Plan",
            description:
              "All Healing spell ranges doubled (Touch becomes 60 feet). Can cast healing spells on targets within range as long as you can hear them.",
          },
          {
            name: "When It Matters",
            description:
              "When rolling initiative (DM discretion), romantic partner, best friend, or significant NPC may apparate to your side for defense.",
          },
        ],
      },
      {
        level: 14,
        name: "Combat Medic",
        description:
          "Choose: Phoenix Tears (magical cure-all creation) or Bold Caster (enhanced cantrip damage).",
        choices: [
          {
            name: "Phoenix Tears",
            description:
              "After 8 hours of magical outreach, a phoenix provides tears that remove all curses, diseases, poisons and restore all HP. Only works when you have no other tears, loses power if anyone else possesses/administers them.",
          },
          {
            name: "Bold Caster",
            description:
              "Add your Healing modifier to damage dealt with any locked-in cantrips.",
          },
        ],
      },
      {
        level: 18,
        name: "Savior",
        description:
          "Choose: Empathic Bond (enhanced group protection with damage resistance) or Supreme Healing (maximum healing dice results).",
        choices: [
          {
            name: "Empathic Bond",
            description:
              "Requires A Saving-People Thing. Therapeutic Friendship and A Saving-People Thing work at 60 feet range. When using A Saving-People Thing to take damage, gain resistance to that damage.",
          },
          {
            name: "Supreme Healing",
            description:
              "When rolling dice to restore HP with spells, use highest possible result for each die (e.g., 2d6 becomes 12 HP restored).",
          },
        ],
      },
    ],
  },
  Divination: {
    name: "Divination",
    description:
      "Seers and mind-readers with foresight abilities, mental manipulation, and mystical perception",
    higherLevelFeatures: [
      {
        level: 1,
        name: "Clairvoyant Studies",
        description:
          "At 1st level, you gain a Diviner's Kit and proficiency with it. Add half proficiency bonus to Initiative and cannot be surprised while conscious. Choose a specialization that defines your approach to divination magic.",
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
              "You see omens everywhere. After long rest, roll two d20s and record as foresight rolls. Expend one to replace any attack roll, saving throw, or ability check you can see (once per turn). Reroll after long rest. Gain third roll at 10th level.",
          },
          {
            name: "Legilimency",
            description:
              "Add Legilimens to locked spells. Cast Legilimens at-will (verbal or non-verbal). Resistance attempts against your Legilimens are made at disadvantage.",
          },
        ],
      },
      {
        level: 6,
        name: "Farseeing",
        description:
          "Choose: Font of Divination (spell slot recovery through divination magic) or Skilled Occlumens (mental defense and deception abilities).",
        choices: [
          {
            name: "Font of Divination",
            description:
              "When casting divination spell of 2nd level+ using spell slot, regain one expended spell slot. Regained slot must be lower level than cast spell, max 5th level.",
          },
          {
            name: "Skilled Occlumens",
            description:
              "Legilimens and Veritaserum don't work on you unless you allow it. Can choose to let Legilimens continue while revealing false information, emotions, or memories of your choosing.",
          },
        ],
      },
      {
        level: 9,
        name: "Sensing Danger",
        description:
          "Add full proficiency bonus to Initiative and add half Divinations modifier (rounded up, minimum +1) to AC.",
        choices: [],
      },
      {
        level: 10,
        name: "The Unseeable",
        description:
          "Choose: Third Eye (enhanced perception abilities) or Mystic Sleep (dream manipulation, scrying, and portal creation).",
        choices: [
          {
            name: "Third Eye",
            description:
              "Action to gain one benefit until incapacitated or short/long rest: Darkvision 60ft, read any language, or see invisible creatures/objects within 10ft. Once per short/long rest.",
          },
          {
            name: "Mystic Sleep",
            description:
              "After rest, choose: Dream messaging (appear in target's dreams, shape environment, optional nightmare for 3d6 damage), Scrying (see/hear target with invisible sensor), or Portal (10ft circle to last long rest location). Once per long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "Revealed Intentions",
        description:
          "Universal: Once per downtime, automatically succeed on failed Activity or Relationship slot. Choose: Greater Foresight (enhanced foresight rerolls) or Darting Eyes (combat mind control with corruption risk).",
        choices: [
          {
            name: "Greater Foresight",
            description:
              "Requires Foresight. Reroll one Foresight roll per day, must use new roll.",
          },
          {
            name: "Darting Eyes",
            description:
              "Requires Legilimency. Bonus action to cast Legilimens in combat, charming target with telepathic control. Action for total control until end of next turn (gain corruption point, max 4). Damage breaks charm, no effect on Occlumens.",
          },
        ],
      },
      {
        level: 18,
        name: "Mystical Knowledge",
        description:
          "Choose: Vivid Visions (see future action results before committing) or Master of Minds (weaponized Legilimens with psychic damage).",
        choices: [
          {
            name: "Vivid Visions",
            description:
              "Bonus action to see vision of your next action and consequences, rolling all required rolls. If you choose that action, vision becomes reality using same rolls. Once per long rest.",
          },
          {
            name: "Master of Minds",
            description:
              "Requires Legilimency. When casting Legilimens as action, force Wisdom save. Target takes 4d8 psychic damage (failed save) or half (success). Damage increases by 1d8 per slot level above 3rd.",
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
          "At 1st level, your study of magical creatures allows you to cast any known Healing spells on beasts. You gain a small trunk that carries magical beasts inside. Choose one specialization that defines your approach to creature study.",
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
              "You maintain a personal notebook of beast findings. Whenever you add your Magical Creatures proficiency to an ability check, also add your Intelligence modifier. Focuses on academic knowledge and creature analysis.",
          },
          {
            name: "Creature Empathy",
            description:
              "You have innate ability to communicate with bestial creatures. As an action, communicate simple ideas to creatures with Intelligence 3+ and read their basic mood, intent, emotional state, magical effects, needs, and how to avoid their attacks. Focuses on emotional connection and communication.",
          },
        ],
      },
      {
        level: 6,
        name: "Way of the Wild",
        description:
          "Core: Wizard's Best Friend (beast companion with Command Dice system). Choose: Basically a Disney Princess (Magizoo spell list access) or Prepared Ambush (magical trap weaving).",
        choices: [
          {
            name: "Basically a Disney Princess",
            description:
              "Gain access to Magizoo Spell List (creature communication, summoning, control, transformation spells). May attempt to cast these spells in Care for Magical Creatures class.",
          },
          {
            name: "Prepared Ambush",
            description:
              "When casting 1st level+ spell targeting single creature/area, weave spell into surroundings as magical trap. Set trigger conditions and exclusions. Trap detected by Investigation vs spell save DC or Specialis Revelio.",
          },
        ],
      },
      {
        level: 9,
        name: "Call Beasts",
        description:
          "High-pitched wail summons swarms to attack moving creatures. As reaction when creature within 60 feet moves, swarm attacks 5-foot square where creature stops (2d12 slashing damage when entering/starting turn in area). Once per short rest.",
        choices: [],
      },
      {
        level: 10,
        name: "Outdoorswizard",
        description:
          "Core: Gentle Caretaker (enhanced beast companion stats). Choose: Survivalist (terrain mastery + group travel benefits) or Monster Hunting (analyze creature resistances/immunities).",
        choices: [
          {
            name: "Survivalist",
            description:
              "Gain proficiency (or expertise if already proficient) in Herbology and Survival. Group benefits: no difficult terrain slowdown, pass through non-magical plants without penalty, can't be surprised while resting (if you/party/companion keeps watch), advantage vs magical plant impediments.",
          },
          {
            name: "Monster Hunting",
            description:
              "Bonus action to analyze creature within 60 feet (Wisdom save, spend 2 sorcery points for disadvantage). Learn damage immunities, resistances, vulnerabilities. Hidden divination creatures appear to have none. Use Wisdom modifier times per long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "Genus Genius",
        description:
          "Choose: Beast Whisperer (calm hostile beasts), Exploited Vulnerabilities (mark weaknesses for allies), Based Magizoologist (healing aura for companions), or Friend of All (natural creatures hesitant to attack).",
        choices: [
          {
            name: "Beast Whisperer",
            description:
              "Action to use Wisdom (Magical Creatures) check to soothe hostile beast. Success makes beast neutral to party until you/party inflicts damage/conditions on it or identical beasts. Once per short rest.",
          },
          {
            name: "Exploited Vulnerabilities",
            description:
              "Bonus action to call out enemy weaknesses. Target takes additional 2d8 damage from allies' damaging spells until start of your next turn. Intelligence modifier uses per long rest.",
          },
          {
            name: "Based Magizoologist",
            description:
              "Requires Gentle Caretaker. When Beast Companion ends turn within 20 feet of you, it regains HP equal to half your level.",
          },
          {
            name: "Friend of All",
            description:
              "When beast/plant creature attacks you, it must make Wisdom save vs your spell save DC. Failed save forces different target or automatic miss. Success grants 24-hour immunity. Creature aware of effect before attacking.",
          },
        ],
      },
      {
        level: 18,
        name: "Sixth Sense",
        description:
          "Choose: Draconic Empathy (dragon companions if you've raised one from egg - requires Wizard's Best Friend) or Hunter's Reflexes (reaction spellcasting to interrupt enemy actions).",
        choices: [
          {
            name: "Draconic Empathy",
            description:
              "Requires Wizard's Best Friend. If you've raised a dragon from egg, it views you as ally and can serve as beast companion. Tamed dragons have own HP, hit dice, ability scores, and use natural attack actions.",
          },
          {
            name: "Hunter's Reflexes",
            description:
              "Reaction when seeing creature cast spell/attack: cast spell (action/bonus action/reaction casting time) targeting only that creature. Conditions/damage applied before target completes action. Damage imposes disadvantage on attack roll. Proficiency bonus uses per short rest.",
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
          "At 1st level, you learn how to make Liquid Darkness and choose one additional feature that defines your approach to dark magic.",
        choices: [],
      },
      {
        level: 1,
        name: "Liquid Darkness",
        description:
          "You learn the recipe to create a potion known as Liquid Darkness. When you make a Wisdom (Potion Making) check you may instead use Charisma (Persuasion) or Wisdom (Perception), representing time spent asking for help or cheating off others.",
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
              "The anger in your heart has given you the ability to place a malicious curse on an enemy. As a bonus action, choose one creature you can see within 30 feet of you. The target is cursed for 1 minute. You gain bonus damage equal to your proficiency bonus (once per spell), critical hits on 19-20 against the target, and regain hit points when the cursed target dies. Once per short or long rest.",
          },
        ],
      },
      {
        level: 6,
        name: "Acolyte of Shadows",
        description:
          "You gain Forbidden Knowledge and choose one additional dark arts technique.",
        choices: [
          {
            name: "Wrathful Magic",
            description:
              "You have learned how to channel your wrath into your spellwork. When you hit a creature with a spell attack, you can use a reaction to deal extra necrotic damage equal to 5 + twice your level. Use half proficiency bonus times per long rest.",
          },
          {
            name: "Dark Intentions",
            description:
              "The evil in your heart has become potent enough to affect those around you. Twice per long rest, choose Frightening (Wisdom save or frightened for 1 minute with halved speed) or Judging (gain advantage on attacks against target for 1d4 rounds).",
          },
        ],
      },
      {
        level: 9,
        name: "Death Wish",
        description:
          "As an action, choose one creature you can see within 30 feet, cursing it until the end of your next turn. The next attack against the cursed creature grants vulnerability to all damage from that attack. Use half spellcasting ability modifier times per long rest.",
        choices: [],
      },
      {
        level: 10,
        name: "Deeper Darkness",
        description:
          "Choose one feature that represents your deeper mastery of the Dark Arts.",
        choices: [
          {
            name: "Visions of Death",
            description:
              "When you hit with an attack, target must make Wisdom save or be unable to hear until your next turn and take 3d10 psychic damage (6d10 and unable to speak if failed by 5+). Once per long rest.",
          },
          {
            name: "Dark Duelist",
            description:
              "Dark spells are automatically cast one level higher than the consumed spell slot. If you have reached Devious tier corruption, apply a random metamagic effect (roll 1d8 on metamagic table).",
          },
        ],
      },
      {
        level: 14,
        name: "Precision Strike",
        description:
          "Choose one feature that enhances your combat capabilities or dark magic mastery.",
        choices: [
          {
            name: "Advanced Defenses",
            description:
              "When you cast any protego-related spell, you can transition the spell's casting to your off-hand (bonus action dedication) while maintaining another concentration/dedication spell with your wand. Make separate saves for each spell.",
          },
          {
            name: "Dark Curse",
            description:
              "When casting a spell with an attack roll, expend a bonus action to transform it into a Curse. If it hits, target makes Constitution save or gains 1d2 exhaustion (max 5). Curse removed by Wideye Potion or Vulnera Sanentur. Use spellcasting modifier times per day.",
          },
          {
            name: "Greater Judgment",
            description:
              "Requires Dark Intentions. When a creature under your Judgment makes an attack, use your reaction to make a spell attack against that creature using a spell of level equal to half proficiency bonus (rounded down) or lower.",
          },
        ],
      },
      {
        level: 18,
        name: "Consumed By The Dark",
        description:
          "Choose one feature representing your complete mastery of dark magic.",
        choices: [
          {
            name: "Punishment",
            description:
              "Whenever a creature hits you with an attack, that creature takes psychic damage equal to your Charisma modifier (minimum 1) if you're not incapacitated.",
          },
          {
            name: "Suffering",
            description:
              "You become a master of instant death. When you hit with a spell attack without disadvantage, target must make Constitution save (DC 8 + half your corruption points). On failure, double the damage of your attack.",
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
          "At 1st level, you gain the Recipes feature and choose one culinary specialization. Additionally, you gain proficiency in Survival and Constitution saving throws (or Wisdom/Charisma saves if you already have Constitution).",
        choices: [],
      },
      {
        level: 1,
        name: "Recipes",
        description:
          "You learn three recipes from your cookbook. After a long rest, prepare recipes equal to your proficiency bonus. Creatures consume meals as a bonus action. You gain 'Prepare Meal' as an additional Free Period/Downtime action for learning new recipes or cooking additional meals.",
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
              "Your culinary techniques overlap with potion-making. Use Survival (Wisdom) in place of Potion-Making (Wisdom) when brewing potions. Your self-experimentation gives you advantage on Constitution saving throws.",
          },
          {
            name: "No Reservations",
            description:
              "You are a devoted lover of Muggle cuisine. Gain proficiency in Muggle Studies. When Culinarian features require Survival (Wisdom) checks, you may use Muggle Studies (Intelligence) instead.",
          },
        ],
      },
      {
        level: 4,
        name: "Honorary House Elf (Optional)",
        description:
          "Can take instead of ASI/Feat. Learn favorite foods through Insight checks, then use Survival (Wisdom) for Persuasion checks when giving someone their favorite food.",
        choices: [],
      },
      {
        level: 6,
        name: "Worldly Insights",
        description:
          "Choose one feature that represents your growing mastery of culinary magic.",
        choices: [
          {
            name: "Fast Food",
            description:
              "You've got a stockpile of ready-made meals. As an action, summon one locked-in recipe as a completed meal from the kitchens. Use spellcasting modifier times per long rest.",
          },
          {
            name: "Yes, Chef!",
            description:
              "Your commanding presence carries into battle. Use Help action as bonus action on targets who can hear you. If they yell 'Yes, Chef!' and attempt your suggested action, they gain advantage on that roll.",
          },
        ],
      },
      {
        level: 9,
        name: "Nourishment",
        description:
          "Whenever an ally consumes one of your recipes, they gain temporary hit points equal to 2d6 + your Intelligence or Wisdom modifier (whichever is higher, minimum 1).",
        choices: [],
      },
      {
        level: 10,
        name: "Main Dish",
        description:
          "Choose one feature that represents your mastery of meal preparation.",
        choices: [
          {
            name: "Sugar Rush",
            description:
              "Creatures consuming your meals gain an additional action (cast spell 3rd level or lower, or Dash/Disengage/Hide/Use Object). Cannot be affected again until short/long rest. Spell level increases to 4th at 13th level, 5th at 17th level.",
          },
          {
            name: "Dinnertime Bonding",
            description:
              "Once per semester, host a banquet with at least 5 people. Ask each the same question. Satisfactory answers grant one Foresight roll lasting until expended or end of semester.",
          },
        ],
      },
      {
        level: 14,
        name: "Pièce de Résistance",
        description:
          "Choose one feature representing your culinary mastery pinnacle.",
        choices: [
          {
            name: "YES! CHEF!",
            description:
              "Requires Yes, Chef! When suggesting actions that force saving throws, targets make those saves at disadvantage if the ally yells 'Yes, Chef!' and follows through.",
          },
          {
            name: "Royal Banquet",
            description:
              "Requires Dinnertime Bonding. Satisfactory answers grant two Foresight rolls. Participants can divulge secrets for immunity to poison/fear, +2d10 max HP, and same HP gain until semester end.",
          },
          {
            name: "Eating Contest Champion",
            description:
              "Once per turn when eating a meal as bonus action, eat two meals instead. Use spellcasting ability modifier times per long rest.",
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
              "As bonus action, throw food at creatures up to 30 feet (attack roll if unwilling). Choose whether they gain positive or negative effects from your recipes when consumed.",
          },
          {
            name: "Where's The Lamb Sauce!",
            description:
              "As action, screech for 1 minute. Enemies within 60 feet make Intelligence saves at start of turn (3d8 psychic damage, half on success). Bonus action to throw arcane kitchen utensil (spell attack, 2d12 + spellcasting modifier force damage). Once per long rest.",
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
        description:
          "At 1st level, choose your specialization path that determines your approach to herbology and potions mastery.",
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
              "You gain a well-loved heirloom potions textbook filled with ancestral notes. Gain Potions Kit, proficiency in Potions Kit and Potion-Making, and access to 3 additional common potion recipes. Add Intelligence modifier to Potion Making (Wisdom) checks. Learn 2 Uncommon recipes at 6th level, 1 Rare at 10th, 1 Very Rare at 14th.",
          },
          {
            name: "Green Thumb",
            description:
              "Gain Herbology Kit, proficiency in Herbology Kit and Herbology skill, and cast Orchideous wordlessly/wandlessly at will. Add Wisdom to Herbology (Intelligence) checks. Gain portable greenhouse and two plant companions (one utility, one combat). Combat plant adds 1d8 piercing damage once per turn. Symbiotic Connection grants Herbology modifier to initiative and +10 feet speed with difficult terrain immunity during combat.",
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
              "Replace Metamagic abilities with Mastery Points for modifying potions. Learn 2 Metapotion effects at 3rd level, gain 1 more each level until all are learned. Use Mastery Points to enhance potion brewing with various effects.",
          },
          {
            name: "Natural Evocations",
            description:
              "Replace Metamagic abilities with Nature Points for botanical magic. Gain abilities like Nature's Wrath (reroll missed attacks), Carnivorous Force (temporary HP and damage boost), Tree Stride (teleport between trees), and Summon Spirit (elemental companions).",
          },
        ],
      },
      {
        level: 4,
        name: "Toxic Presence (Optional)",
        description:
          "Can take instead of ASI/Feat. Constant exposure to poisons makes you venomous. When creatures move within 10 feet or start turn there, use reaction to deal 1d4 necrotic damage (Constitution save negates). Damage increases to 1d6 at 6th, 1d8 at 10th, 1d10 at 14th level.",
        choices: [],
      },
      {
        level: 6,
        name: "Brew Glory",
        description:
          "Gain proficiency in Herbology or Potion-Making, or Expertise if already proficient in both. Choose one specialization feature.",
        choices: [
          {
            name: "Plant Veil",
            description:
              "Requires Green Thumb. Create camouflage in 1 minute for +10 Stealth bonus when pressed against solid surfaces. Plant companion gains Defend (opportunity attacks against you at disadvantage) and Deflect (+4 AC against subsequent attacks from same creature).",
          },
          {
            name: "Don't Waste a Drop",
            description:
              "Once per day, extend brewing time by 1 minute to dilute successful potions into multiple lower-quality versions. Potions achieve superior quality on 19-20. Dilution yields: Common (1d3+1), Uncommon (1d2+1), Rare (1d2), Very Rare+ (impossible).",
          },
          {
            name: "Herbivify",
            description:
              "Channel plant energy for healing. Gain d6s equal to your level. As bonus action, choose ally within 120 feet and spend up to half your level in dice. Target regains HP equal to total rolled plus 1 temporary HP per die. Regain dice on long rest.",
          },
        ],
      },
      {
        level: 9,
        name: "Delayed Sorcery",
        description:
          "Finally tap into innate magical abilities like your peers. Gain Sorcery Points and Metamagic options starting with 5 points and 1 metamagic, scaling up to 10 points and 2 metamagics at 20th level.",
        choices: [],
      },
      {
        level: 10,
        name: "Asphodel and Wormwood",
        description:
          "Gain Expertise in Herbology or Potion-Making. Choose one advanced technique.",
        choices: [
          {
            name: "Entangle",
            description:
              "Requires Green Thumb. As bonus action, create entangled dome. You and allies within 5 feet have full cover, allies within 10 feet have half cover. Lasts 1 minute or until dedication lost.",
          },
          {
            name: "Whirlwind",
            description:
              "Requires Green Thumb. Plant uses your action to attack all creatures within 5 feet. Separate attack rolls using your Str/Dex modifier (whichever higher), dealing 1d8 + modifier damage on hit.",
          },
          {
            name: "Designated Taste Tester",
            description:
              "Automatically succeed on checks to identify harmful ingestibles. Resistance to natural toxins grants immunity to blinded, deafened, frightened, and poisoned conditions.",
          },
          {
            name: "Quick-Brew Mastery",
            description:
              "Requires Metapotions. Reduce Mastery Point costs for quick-brewing: Common (1 round: 2 MP, bonus action: 4 MP), Uncommon (1 round: 4 MP, bonus action: 8 MP), Rare (1 round: 8 MP, bonus action: 12 MP). Once per short rest.",
          },
        ],
      },
      {
        level: 14,
        name: "The Delicate Power of Liquids",
        description:
          "Choose one feature representing mastery of your chosen path.",
        choices: [
          {
            name: "Metapotion Prodigy",
            description:
              "Requires Metapotions. Remove limit on metapotion effects per potion (contradictory effects still forbidden).",
          },
          {
            name: "My Friend Felix",
            description:
              "Learn to brew Felicity's Gold (lesser Felix Felicis) once per semester. Grants 3 luck points for one month. Spend for advantage on attack/ability/save rolls, or force reroll of attacks against you/allies within 15 feet.",
          },
          {
            name: "Nature's Sanctuary",
            description:
              "Requires Green Thumb. Beast and plant creatures must make Wisdom save or choose different target when attacking you. Plant companion gains Dodge reaction to halve incoming attack damage.",
          },
        ],
      },
      {
        level: 18,
        name: "Mind and Body",
        description:
          "Choose one feature representing your ultimate mastery of toxic/natural forces.",
        choices: [
          {
            name: "Snape's Greasy Hair",
            description:
              "Exposure to toxins grants immunity to disease and resistance to acid, necrotic, and poison damage.",
          },
          {
            name: "Plant Aspect",
            description:
              "Requires Green Thumb. Become one with plants, gaining immunity to acid, necrotic, poison damage and disease, but vulnerability to fire damage.",
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
          "At 1st level, you learn Flagrate as a free action subtle spell and gain access to the Ancient Spellbook. Choose your specialization approach to magical study.",
        choices: [],
      },
      {
        level: 1,
        name: "Ancient Spellbook",
        description:
          "Access to unique Arithmantic and Runic spells that can be cast subtly without sorcery points. Spells can be shared with other subclasses through downtime or free time. All spells have either Runic or Arithmantic tags for enhanced casting.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "School of Magic Expert",
            description:
              "Choose one school of magic specialization (+1 to that school required). Each school grants unique abilities: Divinations (reroll attacks/checks twice per long rest), Charms (charm creatures within 5 feet), Transfigurations (alter weight of Large or smaller objects), Healing (magical ward with 2x level + modifier HP), or JHC (Dark Empowerment with AC/speed/concentration bonuses).",
          },
          {
            name: "Researcher",
            description:
              "Extensive spell study allows casting more difficult spells early. Add Devicto to spellbook with both tags, add half Wisdom modifier to spell research checks, and all successfully researched spells gain both Arithmantic and Runic tags.",
          },
        ],
      },
      {
        level: 4,
        name: "Extended Downtime (Optional)",
        description:
          "Can take instead of ASI/Feat. +1 Intelligence or Wisdom (max 20) and gain one additional downtime slot for spell research, practice (two attempts), or teaching Ancient Spellbook spells.",
        choices: [],
      },
      {
        level: 6,
        name: "Exhaustive Studies",
        description:
          "Choose one feature that represents your deepening understanding of magical theory.",
        choices: [
          {
            name: "Enhanced Spellwork",
            description:
              "Spells cast in Ancient Runes class gain Runic tag, spells cast in Arithmancy class gain Arithmantic tag. Runic spells: dedication extends duration by 1 minute, 1d6 psychic damage once per round. Arithmantic spells: +10 feet range, reduce Dedication to Concentration.",
          },
          {
            name: "Private Lessons",
            description:
              "During Ancient Runes, Arithmancy, and downtime: attempt one additional spell per class, DC reduced by 2, all locked spells gain both tags. Gain access to one Professional spell list (Charms, Elemental, Healing, Magizoo, Forbidden, Diviner's Curse, or Astronomic).",
          },
        ],
      },
      {
        level: 9,
        name: "Resilient Mind",
        description:
          "Honed ability to resist mental effects grants proficiency in Wisdom saving throws (or Intelligence/Charisma if already proficient in Wisdom).",
        choices: [],
      },
      {
        level: 10,
        name: "Distinctive Approach",
        description:
          "Choose one feature representing your unique approach to magical study.",
        choices: [
          {
            name: "Spellmaker",
            description:
              "Created spells cost only 2 downtime slots (completed in 1 slot on 19-20 roll). Created spells gain Arithmantic or Runic tags. Spells with both tags cast using 1 lower spell slot (cannot exceed highest available level).",
          },
          {
            name: "Metamagical Application",
            description:
              "Gain 5 Sorcery Points and unique metamagics: Converted Spell (change damage type, 1 SP), Controlled Spell (change area of effect, 2 SP), Triggered Spell (delayed activation with conditions, 3 SP), Continued Spell (reduce Dedication to Concentration or Concentration to Instantaneous).",
          },
        ],
      },
      {
        level: 14,
        name: "Rare Talents",
        description:
          "Choose one feature representing your rare mastery of magical arts.",
        choices: [
          {
            name: "Nimble Fingers",
            description:
              "Gain proficiency in Sleight of Hand (or expertise if already proficient). Spells with both Runic and Arithmantic tags: add half Dexterity modifier to spell attack rolls (rounded up) and spell save DC (rounded down).",
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
        description:
          "Choose one feature representing your ultimate mastery of magical theory.",
        choices: [
          {
            name: "Perfected Spellwork",
            description:
              "Requires Enhanced Spellwork. Once per round, use maximum possible dice results instead of rolling. Runic spells: maximum damage dice. Arithmantic spells: maximum healing dice.",
          },
          {
            name: "Spell Tome",
            description:
              "Requires Private Lessons. Spells cast during Ancient Runes, Arithmancy, or downtime lock in after one successful attempt. Gain access to one additional Professional spell list.",
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
          "At 1st level, you gain proficiency in Performance and choose one approach to skill mastery that defines your artisan expertise.",
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
              "Gain proficiency in one skill of your choice. Choose one skill you're proficient in to gain expertise (double proficiency bonus for ability checks with that skill).",
          },
          {
            name: "Master of None",
            description:
              "Add half your proficiency bonus (rounded down) to any ability check that doesn't already include your proficiency bonus.",
          },
        ],
      },
      {
        level: 2,
        name: "Call to the Arts",
        description:
          "Choose your primary artistic specialization that determines your magical approach.",
        choices: [
          {
            name: "Imbuement",
            description:
              "Gain proficiency with one Artisan's Tool (usable as spellcasting focus). Learn 4 Artisanal Imbuements, gaining more at 12th, 14th, and 16th levels. After long rests, craft and enchant items with imbuements. Can have imbued items equal to spellcasting ability modifier. Each imbuement can only be in one object at a time.",
          },
          {
            name: "Harmonancy",
            description:
              "Gain proficiency with one Musical Instrument (usable as spellcasting focus). Performance for 1+ minute can charm humanoids within 60 feet (Wisdom save or charmed for 1 hour, idolize you, speak glowingly, hinder opponents, advantage on Persuasion). Once per short/long rest.",
          },
        ],
      },
      {
        level: 4,
        name: "Crafty (Optional)",
        description:
          "Can take instead of ASI/Feat. Magically create artisan's tools in 1 hour (vanish when used again). Double proficiency bonus for all tool-based ability checks.",
        choices: [],
      },
      {
        level: 6,
        name: "Creative Muse",
        description:
          "Learn Animatus Locomotor spell (familiar) and choose one feature based on your artistic path.",
        choices: [
          {
            name: "Flash of Genius",
            description:
              "Requires Imbuement. When you or creature within 30 feet makes ability check or saving throw, use reaction to add spellcasting modifier. Use spellcasting modifier times per long rest.",
          },
          {
            name: "Beguiling Performance",
            description:
              "Requires Harmonancy. Learn 6 Harmonic Tunes powered by 5 d8 Harmonic dice (regain on short/long rest). Learn 2 more tunes at 13th and 16th levels. Gain 6th die at 15th level.",
          },
        ],
      },
      {
        level: 8,
        name: "Advanced Imbuement (Optional)",
        description:
          "Can take instead of ASI/Feat. Attune to 4 magic items at once. Craft common/uncommon magic items in 1/4 time for 1/2 cost.",
        choices: [],
      },
      {
        level: 9,
        name: "Art & Soul",
        description:
          "Choose one feature that enhances your artistic abilities.",
        choices: [
          {
            name: "Song of Rest",
            description:
              "Requires Harmonancy. During short rest, allies regain extra hit points when spending Hit Dice: +1d6 (becomes 1d8 at 9th, 1d10 at 13th, 1d12 at 17th level).",
          },
          {
            name: "Magic Jolt",
            description:
              "Requires Imbuement (Familiar). When familiar hits with attack, channel energy for 2d6 force damage OR heal creature within 30 feet for 2d6 HP. Use spellcasting modifier times per long rest, once per turn.",
          },
        ],
      },
      {
        level: 10,
        name: "Pure Talent",
        description:
          "Choose one feature representing your refined artistic mastery.",
        choices: [
          {
            name: "Bombastic Rizz",
            description:
              "Gain otherworldly beauty. As bonus action, assume majestic presence for 1 minute. First-time attackers each turn make Charisma save or can't attack you (must choose new target). Success allows attack but disadvantage on saves against your spells next turn. Once per short/long rest.",
          },
          {
            name: "Reliable Talent",
            description:
              "Gain proficiency in one skill. For ability checks with proficiency bonus, treat d20 rolls of 9 or lower as 10.",
          },
          {
            name: "Spell-Storing Item",
            description:
              "Requires Imbuement. After long rest, store 1st or 2nd level spell (1 action cast time) in weapon or item. Holder can cast using your spellcasting modifier. Usable 2x Intelligence modifier times. No concentration required from you.",
          },
          {
            name: "Magical Secrets",
            description:
              "Requires Harmonancy. Choose 2 spells from Professional spell lists (don't count against spells known). Learn 2 more at 14th and 18th levels.",
          },
        ],
      },
      {
        level: 14,
        name: "Avant-Garde",
        description:
          "Choose one feature representing cutting-edge artistic innovation.",
        choices: [
          {
            name: "Augmented Healer",
            description:
              "Requires Imbuement. Creatures attuned to your items can gain 2d6 + spellcasting modifier temporary HP twice per long rest. Cast Reparifors without spell slot using artisan tools, spellcasting modifier times per long rest.",
          },
          {
            name: "Imbuement Expert",
            description:
              "Requires Advanced Imbuement. Attune to 5 magic items at once. Ignore all special requirements for attuning to or using magic items.",
          },
          {
            name: "Improved Performance",
            description:
              "Requires Harmonancy. Harmonic dice become d10s (d12s at 18th level).",
          },
        ],
      },
      {
        level: 18,
        name: "Virtuoso",
        description:
          "Choose one feature representing your ultimate artistic mastery.",
        choices: [
          {
            name: "Crafter's Spirit",
            description:
              "Requires Imbuement. +1 bonus to all saves per attuned magic item. When reduced to 0 HP, use reaction to end one imbuement and drop to 1 HP instead.",
          },
          {
            name: "Imbuement Master",
            description:
              "Requires Imbuement Expert. Attune to 7 magic items at once.",
          },
          {
            name: "Epic Performer",
            description:
              "Requires Harmonancy. When rolling initiative with no harmonic dice remaining, regain 1 harmonic die.",
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
          "At 1st level, you gain Obscurial Summoning and choose one manifestation of your Obscurial power that defines your dark magical approach.",
        choices: [],
      },
      {
        level: 1,
        name: "Obscurial Summoning",
        description:
          "Core feature for all Obscurial users. When casting a spell, sacrifice life force (take 1d4 damage) to make your next spell deal extra necrotic damage. Damage scales: 1d6 (1st), 1d8 (6th), 1d10 (10th), 1d12 (17th level). Once per turn.",
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
              "Siphon life force through touch. Melee spell attack deals Obscurial die + 2x level damage. Constitution save or take half damage yourself. Twice per long rest.",
          },
          {
            name: "Icy Grasp",
            description:
              "Create Obscurial orb at point within 60 feet lasting 1 minute. Bonus action to attack creatures within 10 feet for 1d8 cold/necrotic damage and -10 speed (2d8 at 10th level). Move orb 30 feet and attack as bonus action. Uses equal to spellcasting modifier per long rest. Speed halved while orb active.",
          },
          {
            name: "Eyes of Blight",
            description:
              "Eyes turn black, gain 120-foot darkvision and immunity to blindness as bonus action. Disadvantage on attacks and Perception in sunlight. Learn Ater spell at 3rd level (cast with 2 sorcery points or spell slot, see through the darkness created).",
          },
        ],
      },
      {
        level: 6,
        name: "The Cursed",
        description:
          "Obscurial power becomes more potent. Necrotic damage from spells and features ignores resistance. Choose one advanced manifestation.",
        choices: [
          {
            name: "Obscurial Maledict",
            description:
              "As action, curse creatures within 30 feet (suffer 1 exhaustion). Intelligence save or take 2d6 psychic damage and perceive allies as enemies, must attack random ally (or self if none) on next turn using same attack type they'd use against you.",
          },
          {
            name: "Beast of the Obscurus",
            description:
              "Requires Eyes of Blight or Decaying Touch. Summon shadow beast (based on house affiliation) to harass target within 120 feet. Beast has temp HP = half your level, moves through objects, gives target disadvantage on saves against your spells within 5 feet. Take 1d4 necrotic damage per turn. Lasts 5 minutes.",
          },
          {
            name: "Obscurial Guardian",
            description:
              "Requires Icy Grasp. Orb can defend others. When creature within 10 feet of orb takes damage, use reaction to halve damage to chosen creature and take the rest yourself. Orb vanishes after use.",
          },
        ],
      },
      {
        level: 9,
        name: "Shadow Walk",
        description:
          "When in dim light or darkness, teleport up to 120 feet as bonus action to another dim/dark location you can see.",
        choices: [],
      },
      {
        level: 10,
        name: "The Beset",
        description:
          "Choose one feature representing your growing mastery over Obscurial power.",
        choices: [
          {
            name: "Debilitating Magic",
            description:
              "Once per turn when hitting with spell attack, force Constitution save or target is paralyzed until start of your next turn. Success grants them advantage against you and you disadvantage against them until end of their next turn.",
          },
          {
            name: "Obscurial Malice",
            description:
              "Requires Eyes of Blight or Decaying Touch. As action, grant allies (= spellcasting modifier) advantages and abilities for 1 minute: advantage vs grouped enemies, redirect missed attacks 3 times. Hostiles within 10 feet take 3d8 necrotic damage per turn (Wisdom save half). Gain 3 exhaustion when ends. Once per short/long rest.",
          },
          {
            name: "Devour",
            description:
              "Requires Icy Grasp. Create 10-foot radius Obscurial manifestation at point within 60 feet for 1 minute. Creatures in area make Strength save or be restrained, take 3d6 cold/necrotic damage per turn. Gain temp HP = your level if creature in area at start of turn. Stunned until end of next turn after use. Once per short/long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "The Madness",
        description:
          "Choose one feature representing the dangerous depths of Obscurial power.",
        choices: [
          {
            name: "Obscurial Frenzy",
            description:
              "Bonus action to enter 1-minute frenzy: advantage on attacks/checks, can't cast spells, 3 melee spell attacks per action, Obscurial damage becomes 2d12, +10 speed, advantage on Dex saves. Must attack nearest creature (Wisdom save vs spell DC or attack ally), take 1d6 necrotic per turn. Once per long rest.",
          },
          {
            name: "Obscurial Consumption",
            description:
              "Consume unconscious/slain creature within 5 feet: gain temp HP = half their max HP, can't be healed until temp HP gone. If spellcaster, regain their highest spell slot level (not exceeding yours), they lose leveled casting until slot used. Can only cast cantrips until end of next turn after using siphoned slot. Once per short/long rest.",
          },
        ],
      },
      {
        level: 18,
        name: "The Malevolent",
        description:
          "Choose one feature representing your ultimate mastery of Obscurial power.",
        choices: [
          {
            name: "Annihilate",
            description:
              "Unleash devastating wave of dark magic. All enemies within 30 feet take 8d6 necrotic damage and are knocked prone. Once per long rest.",
          },
          {
            name: "Obscurial Assimilation",
            description:
              "Bonus action to become shadowy Obscurial form for 1 minute. Resistance to all damage except force/radiant, move through creatures/objects as difficult terrain, creatures you hit can't regain HP. Once per long rest.",
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
          "At 1st level, you choose a defensive specialization that defines how you protect others in combat.",
        choices: [],
      },
      {
        level: 1,
        name: "Level 1 Specialization",
        description: "Choose your initial specialization approach.",
        choices: [
          {
            name: "Critical Deflection",
            description:
              "As a reaction when you or an ally within 20 feet suffers a critical hit, turn it into a normal hit, canceling critical effects. Use a number of times equal to spellcasting ability modifier (minimum once) per long rest.",
          },
          {
            name: "Shielding Presence",
            description:
              "Allies within 10 feet gain +1 bonus to AC. At 6th level, this bonus increases to +2.",
          },
        ],
      },
      {
        level: 6,
        name: "Defensive Alliances",
        description:
          "Choose a method for coordinating protection with your allies.",
        choices: [
          {
            name: "Unbreakable Bonds",
            description:
              "As an action, bind yourself to a number of friendly companions within 20 feet equal to your proficiency bonus. Gain multiple bonus action and reaction abilities: grant 1d8 + spellcasting modifier temp HP, add d6 to ally's roll, make spell attack (2nd level or lower) as reaction when others are attacked, or let ally make reaction spell attack with +1d8.",
          },
          {
            name: "Protective Distraction",
            description:
              "As a reaction when an attacker within 30 feet targets an ally, force a Charisma saving throw or the attacker has disadvantage. Use a number of times equal to proficiency bonus per short/long rest.",
          },
        ],
      },
      {
        level: 9,
        name: "Constant Vigilance",
        description:
          "Emit an aura of alertness while conscious. You and creatures of your choice within 10 feet gain a bonus to initiative equal to your spellcasting ability modifier (minimum +1). At 18th level, range increases to 30 feet.",
        choices: [],
      },
      {
        level: 10,
        name: "Influential Tactics",
        description:
          "Choose a method for manipulating combat flow and inspiring allies.",
        choices: [
          {
            name: "Provocative Strikes",
            description:
              "When you hit with an attack, choose to either give the next attack against the target (by someone other than you) advantage, OR force the target to make a Wisdom save or have disadvantage on attacks against targets other than you until end of your next turn.",
          },
          {
            name: "Bolster Confidence",
            description:
              "When making Charisma (Persuasion) checks with friendly creatures, grant them advantage on their next ability check within the next hour. Once per creature per long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "Warding Sanctuary",
        description:
          "Choose an ultimate defensive technique to protect your allies.",
        choices: [
          {
            name: "Warding Aura",
            description:
              "Requires Unbreakable Bonds. Bound companions within 30 feet gain temporary HP equal to your level at start of their turns. When a bound companion drops to 0 HP, use reaction to protect them (attackers must make Wisdom save or choose new target). As an action, grant bound companions advantage on saves against damage/conditions for 1 hour.",
          },
          {
            name: "Guardian's Respite",
            description:
              "As an action, create a 30-foot radius sanctuary centered on yourself once per long rest. Lasts 10 minutes or until dismissed. Friendly creatures inside gain sanctuary spell benefits: immune to damage, can't be targeted, can exit at will. Creatures inside can't cast spells out, and no apparition in/out while active.",
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
          "At 1st level, you gain a Diviner's Kit and proficiency in using it. Choose one approach to dark divination that defines your grim abilities.",
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
              "Roll a d20 and note the result as your Visionary Roll. Once per day, replace any attack roll, saving throw, or ability check with this roll. At 6th level, use on other creatures you can see. At 10th level, gain a second Visionary Roll. At 14th level, make three rolls and keep any two.",
          },
          {
            name: "Shadowy Influences",
            description:
              "Gain Fraudemo spell, cast wandless and wordless, creating both sound and image with one casting. At 6th level, gain Fraudemo Maxima and can change illusion nature with an action if you can see it.",
          },
        ],
      },
      {
        level: 6,
        name: "Grim Sight",
        description:
          "Gain Dark Legilimens and choose an additional dark ability.",
        choices: [
          {
            name: "Foresight Glimpse",
            description:
              "As a bonus action, gain advantage on your next attack roll, saving throw, or ability check before end of next turn. Use a number of times equal to half proficiency bonus per long rest.",
          },
          {
            name: "Soul Tether",
            description:
              "When you deal damage with a spell containing the dark tag, regain hit points equal to half the damage dealt.",
          },
        ],
      },
      {
        level: 9,
        name: "Grim Psychometry",
        description:
          "Gain supernatural talent for discerning secrets of evil relics and places. Advantage on Intelligence (History) checks about sinister/tragic history of objects you're touching or current location. High rolls may trigger visions of the past.",
        choices: [],
      },
      {
        level: 10,
        name: "Grim Control",
        description:
          "Gain forbidden knowledge and choose a method of mental manipulation.",
        choices: [
          {
            name: "Emotional Manipulation",
            description:
              "As an action, target creature within 60 feet makes Charisma save or you control their emotions for 1 minute. Gain advantage on Charisma checks against them. Very creative applications possible. Once per long rest.",
          },
          {
            name: "Mind of the Grave",
            description:
              "As an action, target dead creature or Inferius within 30 feet makes Wisdom save or obeys commands for 24 hours. Immune if CR/level equals or exceeds yours. Twice per long rest.",
          },
          {
            name: "Illusion of Self",
            description:
              "When attacked, use reaction to interpose illusory duplicate. Attack automatically misses, illusion dissipates. Once per short/long rest.",
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
              "As an action, curse creature within 30 feet until end of next turn. Next hit against them has vulnerability to all damage, then curse ends. Use half spellcasting modifier times. Also auto-succeed one save/check per long rest.",
          },
          {
            name: "Shadow Infusion",
            description:
              "When dealing spell damage, target takes additional 2d8 psychic damage at start of next turn and disadvantage on next save before your next turn. Once per short/long rest.",
          },
          {
            name: "Path of Rot",
            description:
              "Requires Mind of the Grave. Inferius or creatures under Mind of the Grave control gain bonus to damage rolls equal to your Divinations modifier.",
          },
        ],
      },
      {
        level: 18,
        name: "Grim Being",
        description: "Choose the ultimate expression of your dark mastery.",
        choices: [
          {
            name: "Dreadful Aspect",
            description:
              "As an action, create 30-foot aura for 1 minute. Reduces bright light to dim, creatures make Wisdom save or frightened. Frightened creatures take 4d10 psychic damage when starting turn in aura. You and allies have shadow concealment (disadvantage on attacks against you). Bonus action shadow attack: 3d10 + spellcasting modifier necrotic. Once per long rest.",
          },
          {
            name: "Mind Mastery",
            description:
              "Thoughts can't be read unless you allow. Resistance to psychic damage, reflect psychic damage back to attacker. Touch incapacitated creature to charm until healed by specific spells/effects. Telepathic communication with charmed creature regardless of distance.",
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
          "At 1st level, you gain proficiency with Astronomer's tools, access to the Astronomic Spell list, and proficiency in either Perception or Insight. Choose one approach to celestial magic.",
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
              "Gain a magical Star Map (Tiny object, spellcasting focus). While holding it, all Astronomic spells are considered locked in (always prepared).",
          },
          {
            name: "I'm Not Afraid of the Dark",
            description:
              "Gain 80-foot darkvision. As an action, share darkvision with willing creatures within 10 feet (up to Wisdom modifier) for 1 hour. Once per long rest, or expend spell slot to use again.",
          },
          {
            name: "Moonlit Enchantment",
            description:
              "Your spells are imbued with moonlight essence. When you cast a spell requiring a saving throw, the DC increases by 2.",
          },
        ],
      },
      {
        level: 5,
        name: "Star Mapper",
        description: "Requires Astrologer. Enhanced Star Map abilities.",
        choices: [],
      },
      {
        level: 6,
        name: "Astrological Presence",
        description:
          "Choose how you manifest your connection to celestial forces.",
        choices: [
          {
            name: "Centaur's Vision",
            description:
              "Requires Astrologer. After long rest, roll die for omens. Even = Weal (add d6 to rolls), Odd = Woe (subtract d6 from rolls). Use reaction on creatures within 30 feet, proficiency bonus times per long rest.",
          },
          {
            name: "Astronomic Self",
            description:
              "As bonus action, assume starry form for 10 minutes (bright light 10 feet, dim 10 feet). Choose constellation: Archer (ranged spell attacks 1d8+Wis), Chalice (healing spell bonus 1d8+Wis), Dragon (treat 9 or lower as 10 on Int/Wis checks and concentration saves), Shield (temp HP + AC bonus).",
          },
        ],
      },
      {
        level: 8,
        name: "Celestial Harmony (Optional)",
        description:
          "Can take instead of ASI/Feat. Increase Wisdom or Intelligence by 1. Add spellcasting modifier to spell damage proficiency bonus times per day.",
        choices: [],
      },
      {
        level: 9,
        name: "Blessing of the Stars",
        description:
          "While wearing no cloak and not wielding defensive item, AC equals 10 + Dex modifier + Wisdom modifier.",
        choices: [],
      },
      {
        level: 10,
        name: "Heaven's Fortitude",
        description: "Choose an advanced celestial ability.",
        choices: [
          {
            name: "Astronomic Power",
            description:
              "Requires Astronomic Self. Enhanced constellations: Archer/Chalice become 2d8, Dragon gains 20-foot fly speed, Shield creates advantage zone. Change constellations each turn. Initiative bonus aura (10 feet, 30 feet at 18th level).",
          },
          {
            name: "Cosmic Blast",
            description:
              "When you or creature within 30 feet succeeds on save against attack, use reaction to deal 2d8 + Wisdom modifier radiant damage to attacker.",
          },
          {
            name: "Cosmic Insight",
            description:
              "Once per short rest, reroll any d20 roll made by you or creature you can see, forcing use of new result.",
          },
        ],
      },
      {
        level: 14,
        name: "Volatile Astronomy",
        description: "Choose a method of advanced cosmic manipulation.",
        choices: [
          {
            name: "Gift of the Stars",
            description:
              "Add Wisdom modifier to damage of spells 3rd level or lower. Gain resistance to radiant and fire damage.",
          },
          {
            name: "Gift of the Moon",
            description:
              "Requires Astronomic Self. While in starry form, gain lunar phase benefits: Full Moon (Investigation/Perception advantage in your light), New Moon (Stealth advantage, disadvantage on attacks in darkness), Crescent Moon (necrotic/radiant resistance).",
          },
          {
            name: "Fate Unbound",
            description:
              "Once per day, target within 60 feet makes Wisdom save or chosen ability score becomes 1 for 1 minute (save each turn to end).",
          },
          {
            name: "Celestial Resistance",
            description:
              "Once per day, for 1 minute your spells ignore damage resistance, treating it as nonexistent.",
          },
        ],
      },
      {
        level: 18,
        name: "Cosmic Perfection",
        description: "Choose the ultimate expression of cosmic mastery.",
        choices: [
          {
            name: "Gift of the Sun",
            description:
              "Requires Gift of the Moon. Bonus action to enhance lunar phases: Full Moon (blind enemies, heal ally 3d8), New Moon (3d10 necrotic + speed 0, become invisible), Crescent Moon (teleport with ally + damage resistance). Once per long rest each unless spending 5 sorcery points.",
          },
          {
            name: "Starry Desperation",
            description:
              "Deal maximum damage with spells. 1st-3rd level: no penalty first use. Additional uses or 4th+ level: take 1d12 radiant per spell level (increasing by 1d12 each use). Damage ignores resistance/immunity.",
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
        description:
          "At 1st level, choose how your scholarly pursuits have shaped your magical abilities.",
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
              "Learn one language and gain proficiency in Herbology, History of Magic, Investigation, Magical Theory, or Muggle Studies (expertise if already proficient). After 1 hour studying, automatically improve one subject grade by one category. Can help others with homework instead.",
          },
          {
            name: "Quick Skim",
            description:
              "Once per short/long rest, choose one skill or tool to gain proficiency with for 1 hour (expertise if already proficient). Master the art of rapid knowledge absorption.",
          },
        ],
      },
      {
        level: 6,
        name: "Intellect Advantage",
        description:
          "Choose how you apply your superior intellect in challenging situations.",
        choices: [
          {
            name: "Um, Actually?",
            description:
              "When creature within 60 feet makes attack roll, ability check, or damage roll, use reaction for Intelligence contest. On success, reduce their roll by proficiency bonus. Use after roll but before results. Half Intelligence modifier (rounded up) times per long rest.",
          },
          {
            name: "Battle Studies",
            description:
              "When you hit with cantrip, analyze creature to learn all damage vulnerabilities, resistances, immunities, and condition immunities. When analyzed creature misses you, use reaction to cast cantrip at them. Lasts until short/long rest. Half proficiency bonus uses per long rest.",
          },
        ],
      },
      {
        level: 9,
        name: "I Was in the Library...",
        description:
          "Your extensive research grants access to specialized knowledge. Automatically lock in two spells of your choice from the Elemental, Magizoo, Diviner's Curse, Forbidden, or Astronomic spell lists.",
        choices: [],
      },
      {
        level: 10,
        name: "Dueling Tactics",
        description: "Choose an advanced intellectual combat technique.",
        choices: [
          {
            name: "Intelligent Maneuver",
            description:
              "Once per round, if you've already used your reaction, you can take an additional reaction. Use twice per long rest. Honed awareness through mental aptitude and pattern recognition.",
          },
          {
            name: "Wait... Hold on.",
            description:
              "When making skill check, use reaction to reroll and add half Intelligence modifier (rounded up). Must use new roll. Choose after rolling but before learning success/failure.",
          },
        ],
      },
      {
        level: 14,
        name: "Path of History",
        description:
          "Choose how your historical mastery manifests in advanced abilities.",
        choices: [
          {
            name: "Intelligent Casting",
            description:
              "Add Intelligence modifier to damage of spells 3rd level or lower. Gain resistance to being charmed. In-depth knowledge of magical mechanics boosts spell potency.",
          },
          {
            name: "Super Sleuth",
            description:
              "Spend 1+ minutes in contemplation (up to Intelligence score minutes, concentration required). Object Reading: learn acquisition, loss, and recent significant events of held objects and previous owners. Area Reading: see recent significant events in 50-foot cube going back Intelligence score days. Once per short/long rest.",
          },
        ],
      },
      {
        level: 18,
        name: "Enlightened Mind",
        description: "Choose the ultimate expression of intellectual mastery.",
        choices: [
          {
            name: "Battle Expert",
            description:
              "Requires Battle Studies. When hitting with cantrip, cause vulnerability to chosen damage type for 1 minute (suppresses resistance instead if present, no effect on immunity). Once per long rest.",
          },
          {
            name: "Perfected Communication",
            description:
              "Understand all spoken languages. Any creature that can understand a language can understand what you say. Universal linguistic mastery through cultural study.",
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
          "At 1st level, you gain proficiency in Magical Creatures or History of Magic and choose your primary area of study. Note: Intellect casters do not gain the opposite ability at 3rd level, instead receiving an ASI or Feat.",
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
              "Use illusion to take ghoulish form as bonus action for 1 minute. Gain 1d10 + level temporary HP, force Intelligence saves on attacks to avoid being frightened until end of next turn, immunity to frightened condition. Use proficiency bonus times per long rest.",
          },
          {
            name: "Ancestral Call",
            description:
              "As action, target creature becomes hindered by Ancient spirits until start of next turn. When target attacks or casts spell, must make Intelligence save or attack/spell hits Ancients and is wasted.",
          },
        ],
      },
      {
        level: 6,
        name: "Inner Reflections",
        description:
          "Your studies deepen, granting enhanced abilities based on your chosen path.",
        choices: [
          {
            name: "Inner Ghoul",
            description:
              "Requires Ghoulish Trick. Gain 60-foot darkvision (+30 feet if already have), invisible to darkvision while in darkness, replace spell damage with psychic once per turn (+1 damage die while using Ghoulish Trick).",
          },
          {
            name: "Ancient Guardian",
            description:
              "Requires Ancestral Call. When creature within 30 feet takes damage, use reaction to reduce by 1d6 + spellcasting modifier (2d6 at 10th, 4d6 at 14th level).",
          },
        ],
      },
      {
        level: 9,
        name: "Dark Shield",
        description:
          "Your connection to ghouls or spirits grants protection. Gain advantage on death saving throws and resistance to necrotic damage.",
        choices: [],
      },
      {
        level: 10,
        name: "Arcane Body",
        description:
          "Choose how your supernatural studies have transformed your physical form.",
        choices: [
          {
            name: "Warped Mind",
            description:
              "Requires Inner Ghoul. Resistance to psychic damage (immunity while using Ghoulish Trick). When reduced to 0 HP, reaction to drop to 1 HP and release wail: 30-foot radius, 2d10 + level psychic damage, gain 2 exhaustion levels. Once per long rest.",
          },
          {
            name: "Ancestral Guidance",
            description:
              "Requires Ancient Guardian. Free action at turn start: move through creatures/objects as difficult terrain, see/affect Unseen Realm. 1d10 force damage if ending turn in object. Lasts Intelligence modifier rounds. Once per short/long rest (twice at 14th level).",
          },
        ],
      },
      {
        level: 14,
        name: "Talented Mind",
        description:
          "Choose an advanced manifestation of your supernatural knowledge.",
        choices: [
          {
            name: "Spook",
            description:
              "Requires Warped Mind. When attacked without advantage, reaction to impose disadvantage and force Intelligence save or frighten. Immune if seen through Ghoulish trick in last 24 hours.",
          },
          {
            name: "Ancient Rebuke",
            description:
              "Requires Ancestral Guidance. When using Ancient Guardian to reduce damage, the prevented damage rebounds to the attacker.",
          },
        ],
      },
      {
        level: 18,
        name: "Fearful Soul",
        description:
          "Choose the ultimate expression of your supernatural mastery.",
        choices: [
          {
            name: "Ghoulish Existence",
            description:
              "Requires Spook. Enhanced Ghoulish Trick: regain 10 temp HP each turn, cast action spells as bonus action, touch attack spending 1-10 sorcery points for 1d10 psychic per point (Int save for half), enemies within 10 feet have disadvantage on saves. Once per long rest.",
          },
          {
            name: "Ancient Secrets",
            description:
              "Requires Ancient Rebuke. Ask Ancients one question per year (truthful answer from their lifetime knowledge). Action to detect illusions, shapechangers, and deception magic within 30 feet, advantage on dispelling detected effects.",
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
          "At 1st level, you gain Vehicles (Broomstick) proficiency (expertise if already proficient). Summon magical broom as bonus action. Choose your primary Quidditch position specialty.",
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
              "Beater specialization. Gain Athletics proficiency (expertise if already proficient). Weapon proficiency with Beater's Bats (1d4/1d6 versatile) and Bludgers (1d6 ranged, scaling to 4d6 at 17th level). Use Strength for attack and damage rolls.",
          },
          {
            name: "Think Fast!",
            description:
              "Chaser specialization. Gain Acrobatics proficiency (expertise if already proficient). As bonus action, target within 30 feet holding item must make Wisdom save or drop item to catch your Quaffle.",
          },
        ],
      },
      {
        level: 4,
        name: "Get Your Head In The Game (Optional)",
        description:
          "Can take instead of ASI/Feat. Choose a team support specialization.",
        choices: [
          {
            name: "Cheer",
            description:
              "As bonus action, inspire proficiency bonus allies within 30 feet with 1d4 to add to one ability check, attack roll, or saving throw before end of next turn. Twice per long rest.",
          },
          {
            name: "Chirp",
            description:
              "As bonus action, discourage proficiency bonus enemies within 30 feet to subtract 1d4 from next ability check, attack roll, or saving throw before end of your next turn. Twice per long rest.",
          },
        ],
      },
      {
        level: 6,
        name: "We're All In This Together",
        description: "Choose an advanced Quidditch position specialization.",
        choices: [
          {
            name: "Goalkeeper",
            description:
              "Keeper specialization. Gain Athletics or Acrobatics proficiency, +2 AC bonus. As reaction, force enemy within 15 feet to reroll attack (take lower). Use proficiency bonus times per short rest.",
          },
          {
            name: "Eagle Eyes",
            description:
              "Seeker specialization. Gain Perception or Sleight of Hand proficiency. Add half Wisdom modifier to Dexterity saves, advantage on sight-based Perception checks.",
          },
        ],
      },
      {
        level: 8,
        name: "I'm Ok! (Optional)",
        description:
          "Can take instead of ASI/Feat. Dexterity +1 (max 20). Advantage on Acrobatics while flying/mid-air. Reaction to reduce fall damage by 3×(Dex mod + Str mod).",
        choices: [],
      },
      {
        level: 9,
        name: "Quidditch Robe",
        description:
          "While not wearing cloak or wielding defensive item, AC equals 10 + Dex modifier + Str modifier.",
        choices: [],
      },
      {
        level: 10,
        name: "You Can't Catch Me!",
        description: "Choose an advanced aerial maneuver technique.",
        choices: [
          {
            name: "Zoomies!",
            description:
              "While on broom or flying, teleport up to 60 feet as part of movement, passing through walls/barriers without opportunity attacks. Half proficiency bonus uses per long rest.",
          },
          {
            name: "I Am Speed",
            description:
              "As action while on broom, fly 60 feet in straight line creating 60×20 foot wind tunnel for 1 minute. Creatures entering or starting turn inside make Strength save or take 5d6 force damage and be pulled 15 feet toward center. Various environmental effects. Once per long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "Best Of The Best",
        description:
          "Choose a master-level position ability based on your specialization.",
        choices: [
          {
            name: "Slugger",
            description:
              "Requires Batter Up!. Bludger and Beater's Bat attacks count as magical. Bludger hits can deal 4d8 additional force damage (Strength modifier uses per long rest) and force Strength save for knockback/prone.",
          },
          {
            name: "Chaser's Strategy",
            description:
              "Requires Think Fast!. As action, command ally within 30 feet to use reaction for attack or spell with advantage.",
          },
          {
            name: "Keeper's Wall",
            description:
              "Requires Goalkeeper. As reaction, create ethereal barrier for ally within 30 feet (+5 AC or +3 saves until next turn, Dedication extends to 1 minute). Can affect two allies if within 5 feet of each other. Dexterity modifier uses per long rest.",
          },
          {
            name: "Seeker's Sight",
            description:
              "Requires Eagle Eyes. Treat d20 rolls of 9 or lower as 10 for Acrobatics, Sleight of Hand, or Perception. Automatically detect invisible creatures/objects within 30 feet unless behind total cover.",
          },
        ],
      },
      {
        level: 18,
        name: "Quidditch Team Captain",
        description:
          "Choose the ultimate expression of your Quidditch mastery.",
        choices: [
          {
            name: "All For One!",
            description:
              "Requires Get Your Head in the Game. Gain additional use of Cheer/Chirp. Cheer: add die to damage/AC, temp HP equal to 10 + 2×spellcasting modifier. Chirp: Wisdom save or 2d4 psychic damage + d4 penalty for two rounds.",
          },
          {
            name: "Bombs Away!",
            description:
              "Gain permanent 30-foot magical flying speed. While flying, advantage on attack rolls against creatures in 30-foot cone directly below you.",
          },
          {
            name: "All Rounder",
            description:
              "Gain expertise in Athletics, Acrobatics, Perception, and Sleight of Hand (if already proficient). Choose one additional feature from Best Of The Best section.",
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
          "At 1st level, you learn the Manus spell (all castings considered subtle) and gain access to the Trickery spellbook. Choose your primary approach to deception.",
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
              "After speaking alone with a creature for 1 minute, target makes Wisdom save or becomes frightened of you or chosen creature for 1 hour (ends if attacked/damaged or sees allies attacked). No hint on successful save. Once per short/long rest.",
          },
          {
            name: "Sticky Fingers",
            description:
              "When casting Manus, make spectral hand invisible. With contested Sleight of Hand vs Perception: stow objects in others' containers, retrieve objects from others, use thieves' tools at range. Control hand with bonus action.",
          },
        ],
      },
      {
        level: 4,
        name: "Silver Tongue (Optional)",
        description:
          "Can take instead of ASI/Feat. Master of saying the right thing. Treat d20 rolls of 7 or lower as 8 for Charisma (Persuasion) and Charisma (Deception) checks.",
        choices: [],
      },
      {
        level: 6,
        name: "Perjurer",
        description:
          "Gain stealth expertise and choose an advanced deception technique.",
        choices: [
          {
            name: "Duplicate",
            description:
              "As action, create perfect illusion of yourself for 1 minute within 30 feet (120-foot max range). Move 30 feet as bonus action. Cast spells through illusion space. Advantage on attacks when both you and illusion within 5 feet of target. Once per long rest.",
          },
          {
            name: "Make Nice",
            description:
              "After 1+ minutes observing/interacting outside combat, learn if creature is equal/superior/inferior in Intelligence/Wisdom/Charisma scores or their subclass (choose 2). May learn history/personality traits.",
          },
          {
            name: "Deep Pockets",
            description:
              "One garment gains 1-foot diameter compartment visible only to you, permanently affected by Capacious Extremis charm. Temporarily inaccessible in magically extended spaces.",
          },
        ],
      },
      {
        level: 8,
        name: "Obliviator (Optional)",
        description:
          "Can take instead of ASI/Feat. When casting obliviate, can implant detailed false memories instead of erasing. Undetectable to target but might be detected by external memory examination.",
        choices: [],
      },
      {
        level: 9,
        name: "Sneaky Bitch",
        description:
          "On your turn, take one additional bonus action. Can use bonus actions for Dash, Disengage, or Hide actions.",
        choices: [],
      },
      {
        level: 10,
        name: "Manipulative Motives",
        description: "Choose an advanced method of mental manipulation.",
        choices: [
          {
            name: "Look at me",
            description:
              "As action, Persuasion vs Insight contest. Success on hostile: disadvantage on attacks vs others, no opportunity attacks vs others (1 minute, various end conditions). Success on non-hostile: charmed for 1 minute (ends if harmed).",
          },
          {
            name: "Mirrored Memories",
            description:
              "Once per long rest, as action tell vivid story to creatures within 60 feet. Intelligence save or charmed and believe they experienced the story until completing long rest.",
          },
        ],
      },
      {
        level: 14,
        name: "False Witness",
        description: "Choose a master-level deception technique.",
        choices: [
          {
            name: "Misdirection",
            description:
              "When targeted by attack while creature within 5 feet, use reaction to redirect attack to that creature instead.",
          },
          {
            name: "Veiled Influence",
            description:
              "After 10-minute conversation, gain 24-hour advantage on Charisma checks vs target. Can implant suggestion: Wisdom save or take 4d10 psychic damage when acting counter to instructions (max 3 times per 24 hours). No suicidal commands.",
          },
        ],
      },
      {
        level: 18,
        name: "Blatant Exploitation",
        description: "Choose the ultimate expression of your trickery mastery.",
        choices: [
          {
            name: "Quintuplicate",
            description:
              "Requires Duplicate. Create up to 4 duplicates instead of 1. Bonus action to move any number up to 30 feet (120-foot max). When targeted by spell/attack, reaction to swap places with duplicate within 60 feet.",
          },
          {
            name: "Yoink!",
            description:
              "When creature casts spell targeting you or including you in area, reaction to force spellcasting ability save (DC = your spell save DC). Success negates effect on you and steals spell knowledge for 8 hours if 1st+ level and you can cast it. Caster can't use spell for 8 hours. Proficiency bonus uses per long rest.",
          },
        ],
      },
    ],
  },
};
export const subclasses = Object.keys(subclassesData);
