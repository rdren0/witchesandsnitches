export const innateHeritages = [
  "Centaurian Lineage",
  "Dryad Ancestry",
  "Elf Legacy",
  "Fey Ancestry",
  "Giant's Blood",
  "Goblin Cunning",
  "Gorgon Ancestry",
  "Hag-Touched",
  "Halfblood",
  "Metamorph Magic",
  "Muggleborn",
  "Part-Leprechaun",
  "Part-Harpy",
  "Part-Siren",
  "Parseltongue",
  "Pukwudgie Ancestry",
  "Pureblood",
  "Satyr Ancestry",
  "Troll Blood",
  "Veela Charm",
];

export const heritageDescriptions = {
  "Centaurian Lineage": {
    description:
      "Descendants of centaurs with enhanced mobility and natural abilities.",
    benefits: [
      "Ability Score Increase: Your Wisdom score increases by 1.",
      "Speed: Your base walking speed is 40 feet.",
      "Hooves: Your hooves are natural melee weapons, which you can use to make unarmed strikes. On a hit, you deal bludgeoning damage equal to 1d6 + your Strength modifier.",
      "Equine Build: You count as one size larger when determining carrying capacity and the weight you can push or drag. In addition, any climb that requires hands and feet is especially difficult for you because of your equine legs. When you make such a climb, each foot of movement costs you 4 extra feet, instead of the normal 1 extra foot.",
      "Naturalist: You gain one of the following benefits: Survivor (Proficiency in Survival and advantage on all Survival checks while in a Forest), Zoologist (Proficiency in Magical Creatures and advantage on checks to calm beasts), Herbologist (Proficiency in Herbology and while in a Forest you and your allies cannot be slowed by difficult terrain or lost unless by magical means), or Cosmologist (Proficiency in Perception and navigation abilities under night sky).",
    ],
    modifiers: {
      abilityIncreases: [{ type: "fixed", ability: "wisdom", amount: 1 }],
      skillProficiencies: [],
      expertise: [],
      other: {
        speedBonus: 10,
        naturalWeapons: true,
        equineBuild: true,
      },
    },
    features: [
      {
        name: "Naturalist",
        description: "Choose one naturalist specialization",
        isChoice: true,
        options: [
          {
            name: "Survivor",
            description:
              "Proficiency in Survival and advantage on all Survival checks while in a Forest",
            skillProficiencies: ["Survival"],
          },
          {
            name: "Zoologist",
            description:
              "Proficiency in Magical Creatures and advantage on checks to calm beasts",
            skillProficiencies: ["Magical Creatures"],
          },
          {
            name: "Herbologist",
            description:
              "Proficiency in Herbology and while in a Forest you and your allies cannot be slowed by difficult terrain or lost unless by magical means",
            skillProficiencies: ["Herbology"],
          },
          {
            name: "Cosmologist",
            description:
              "Proficiency in Perception and navigation abilities under night sky",
            skillProficiencies: ["Perception"],
          },
        ],
      },
    ],
  },
  "Dryad Ancestry": {
    description:
      "Elusive and mysterious denizens of forests and glades, connected to nature itself.",
    benefits: [
      "Gain proficiency in Herbology checks. Additionally, you gain proficiency in an Artisanal tool of your choice.",
      "You know the Druidcraft cantrip and can cast it at will, without the use of a wand.",
      "You have an 'unearthly' ability to understand plants on a personal level. You can innately cast the Speak-with-Plants spell once per long rest.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: ["Herbology"],
      expertise: [],
      other: {
        druidcraftCantrip: true,
        speakWithPlantsSpell: true,
        artisanalToolProficiency: true,
      },
    },
    features: [],
  },
  "Elf Legacy": {
    description:
      "Haunting of Greylock only. Ghostly elven heritage with supernatural abilities.",
    benefits: [
      "Ability Score Increase: Increase your Wisdom or Dexterity by 1.",
      "Unseen Hand: As a bonus action, you can teleport up to 10 feet to an unoccupied space you can see. This movement does not provoke opportunity attacks. You can use this ability a number of times equal to your proficiency bonus per long rest.",
      "Wardslip Apparition: Apparition License Required. You can magically apparate in or out of warded locations that normally prevent such travel, including castle grounds and magically locked buildings. When you do so, you may travel up to half the normal apparition distance, and you cannot bring another creature with you. You can use this ability once per long rest.",
      "Pathetic Performance: As a bonus action, you may aid an ally within 15 feet of you by pretending to be helpless or pathetic, distracting a creature within 30 feet of you. If that ally attacks the creature before the start of your next turn, the first attack roll is made with advantage. You can use this ability a number of times equal to your proficiency bonus per long rest.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        unseenHand: true,
        wardslipApparition: true,
        patheticPerformance: true,
      },
    },
    features: [
      {
        name: "Ability Score Choice",
        description: "Choose which ability score to increase",
        isChoice: true,
        options: [
          {
            name: "Wisdom +1",
            description: "Increase your Wisdom by 1",
            abilityChoice: "wisdom",
          },
          {
            name: "Dexterity +1",
            description: "Increase your Dexterity by 1",
            abilityChoice: "dexterity",
          },
        ],
      },
    ],
  },
  "Fey Ancestry": {
    description:
      "Distant Fey ancestry from the mystical and enchanting realm of supernatural beings.",
    benefits: [
      "Your Wisdom or Charisma ability score increases by 1.",
      "You possess a limited form of Darkvision out to a range of 60 feet.",
      "For anyone else, a period of 8 hours is required in order to feel well-rested and avoid exhaustion. For you that period of time gets cut in half to 4 hours.",
      "Fey Traits: Your hidden heritage is manifested in odd physical ways (elongated ears, iridescent eyes, illusory creatures around you during rest, flowers in hair, seasonal hair color changes, etc.).",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        darkvision: 60,
        feyRest: true,
        feyTraits: true,
      },
    },
    features: [
      {
        name: "Ability Score Choice",
        description: "Choose which ability score to increase",
        isChoice: true,
        options: [
          {
            name: "Wisdom +1",
            description: "Increase your Wisdom by 1",
            abilityChoice: "wisdom",
            amount: 1,
          },
          {
            name: "Charisma +1",
            description: "Increase your Charisma by 1",
            abilityChoice: "charisma",
            amount: 1,
          },
        ],
      },
      {
        name: "Fey Traits",
        description:
          "Select your fey trait manifestations (choose as many or few as desired, or roll randomly)",
        isChoice: true,
        isMultiSelect: true,
        hasRandomRoll: true,
        rollDie: 8,
        options: [
          {
            name: "Elongated Ears",
            description:
              "Your ears are noticeably pointed and elongated, marking your fey heritage.",
          },
          {
            name: "Iridescent Eyes",
            description:
              "Your eyes shimmer with otherworldly colors that shift in different lighting.",
          },
          {
            name: "Illusory Rest Companions",
            description:
              "Small illusory creatures appear around you during rest periods, providing comfort.",
          },
          {
            name: "Flowers in Hair",
            description:
              "Small flowers and leaves naturally grow in or appear woven through your hair.",
          },
          {
            name: "Seasonal Hair Colors",
            description:
              "Your hair color changes subtly with the seasons or your emotional state.",
          },
          {
            name: "Ethereal Voice",
            description:
              "Your voice carries a musical, otherworldly quality that seems to echo slightly.",
          },
          {
            name: "Glimmering Skin",
            description:
              "Your skin has a faint, barely perceptible shimmer in moonlight or magical lighting.",
          },
          {
            name: "Nature's Mark",
            description:
              "You bear natural markings like vine-like patterns, leaf shapes, or flower motifs on your skin.",
          },
        ],
      },
    ],
  },
  "Giant's Blood": {
    description:
      "Half-giants and part-giants with impressive strength and genetic resistance to magic.",
    benefits: [
      "Ability Score Increase: Increase your Strength score by 1, to a maximum of 20.",
      "Size: Adult part-giants are between 7 and 9 feet tall and weigh between 300 and 420 pounds. Your size is Medium.",
      "Hefty: You are considered one size larger when determining carrying capacity and weight you can push, drag, or lift.",
      "Natural Resistance: When a spell or other magical effect inflicts a condition on you, you can use your reaction to resist one condition of your choice. You can do this a number of times equal to your proficiency bonus per long rest.",
    ],
    modifiers: {
      abilityIncreases: [{ type: "fixed", ability: "strength", amount: 1 }],
      skillProficiencies: [],
      expertise: [],
      other: {
        heftyBuild: true,
        naturalResistance: true,
      },
    },
    features: [],
  },
  "Goblin Cunning": {
    description:
      "The rarest racial combination - part-goblins with inherited cleverness and big personalities.",
    benefits: [
      "Ability Score Increase: Increase your Intelligence score by 1, to a maximum of 20.",
      "Size: Adult part-goblins are between 3 and 5 feet tall and weigh around 110 pounds. Your size is Small.",
      "Nimble Body: You can move through the space of any creature that is of a size larger than yours.",
      "Goblin Wit: You have advantage on all Intelligence and Wisdom saving throws against magic.",
      "Gobbledegook: You can speak, read, and write Gobbledegook.",
    ],
    modifiers: {
      abilityIncreases: [{ type: "fixed", ability: "intelligence", amount: 1 }],
      skillProficiencies: [],
      expertise: [],
      other: {
        nimbleBody: true,
        goblinWit: true,
        gobbledegook: true,
        sizeSmall: true,
      },
    },
    features: [],
  },
  "Gorgon Ancestry": {
    description:
      "Mysterious heritage with serpentine features and petrifying abilities.",
    benefits: [
      "Ability Score Increase: Your Constitution score or Charisma score increases by 1.",
      "Darkvision: You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.",
      "Parseltongue: You can speak Parseltongue.",
      "Petrifying Gaze: Your look can turn other creatures to stone. As an action, you can target one creature that can see you within 30 feet with your gaze. You may use this a number of times equal to your proficiency bonus per long rest.",
      "Poison Resistance: You are resistant to poison damage and the poisoned condition.",
      "Gorgon Traits: Serpentine hair accents, snake-like eyes, scaled skin patterns, elongated canines, forked tongue, or clawed fingertips.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        darkvision: 60,
        parseltongue: true,
        petrifyingGaze: true,
        poisonResistance: true,
        gorgonTraits: true,
      },
    },
    features: [
      {
        name: "Ability Score Choice",
        description: "Choose which ability score to increase",
        isChoice: true,
        options: [
          {
            name: "Constitution +1",
            description: "Increase your Constitution by 1",
            abilityChoice: "constitution",
          },
          {
            name: "Charisma +1",
            description: "Increase your Charisma by 1",
            abilityChoice: "charisma",
          },
        ],
      },
    ],
  },
  "Hag-Touched": {
    description:
      "You or your parents had a brief encounter with a powerful wild being that has forever changed you.",
    benefits: [
      "You gain proficiency in either Survival or Stealth.",
      "Once per year, you may tap into your connection to chaos and warp the fabric of reality. You may speak a minor wish into existence, and it shall be so. This is subject to DM's discretion and approval.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        chaosWish: true,
      },
    },
    features: [
      {
        name: "Skill Choice",
        description: "Choose your survival skill specialization",
        isChoice: true,
        options: [
          {
            name: "Survival",
            description: "Gain proficiency in Survival",
            skillProficiencies: ["Survival"],
          },
          {
            name: "Stealth",
            description: "Gain proficiency in Stealth",
            skillProficiencies: ["Stealth"],
          },
        ],
      },
    ],
  },
  Halfblood: {
    description:
      "The vast majority of human wizards - combination of magical and Muggle ancestry.",
    benefits: [
      "Choose one of three options:",
      "Option 1: Gain proficiency in History of Magic (expertise if already proficient) + two skills from: Acrobatics, Herbology, Magical Creatures, Potion-Making, Intimidation",
      "Option 2: Gain proficiency in Muggle Studies (expertise if already proficient) + two skills from: Athletics, Investigation, Medicine, Survival, Persuasion",
      "Option 3: Add half proficiency in Muggle Studies and History of Magic + gain expertise in one skill you're already proficient in",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {},
    },
    features: [
      {
        name: "Heritage Path",
        description: "Choose your halfblood heritage focus",
        isChoice: true,
        options: [
          {
            name: "Magical Focus",
            description:
              "Gain proficiency in History of Magic (expertise if already proficient) + two skills from: Acrobatics, Herbology, Magical Creatures, Potion-Making, Intimidation",
            skillProficiencies: ["History of Magic"],
            bonusSkillChoices: [
              "Acrobatics",
              "Herbology",
              "Magical Creatures",
              "Potion-Making",
              "Intimidation",
            ],
            bonusSkillCount: 2,
          },
          {
            name: "Muggle Focus",
            description:
              "Gain proficiency in Muggle Studies (expertise if already proficient) + two skills from: Athletics, Investigation, Medicine, Survival, Persuasion",
            skillProficiencies: ["Muggle Studies"],
            bonusSkillChoices: [
              "Athletics",
              "Investigation",
              "Medicine",
              "Survival",
              "Persuasion",
            ],
            bonusSkillCount: 2,
          },
          {
            name: "Balanced Path",
            description:
              "Add half proficiency in Muggle Studies and History of Magic + gain expertise in one skill you're already proficient in",
            halfProficiencies: ["Muggle Studies", "History of Magic"],
            expertiseChoice: true,
          },
        ],
      },
    ],
  },
  "Metamorph Magic": {
    description:
      "Rare metamorphmagus talent - morphing every aspect of your human appearance.",
    benefits: [
      "Ability Score Increase: Increase your Charisma score by 1, to a maximum of 20.",
      "Transform: At will, you can transform your appearance including height, weight, facial features, voice, hair, and coloration. Your basic shape and size category stay the same.",
      "You can also adapt your body to an aquatic environment, growing webbing between your fingers to gain swimming speed equal to your walking speed.",
    ],
    modifiers: {
      abilityIncreases: [{ type: "fixed", ability: "charisma", amount: 1 }],
      skillProficiencies: [],
      expertise: [],
      other: {
        metamorphTransform: true,
        aquaticAdaptation: true,
      },
    },
    features: [],
  },
  Muggleborn: {
    description:
      "Wizards and witches born to Muggle parents who enter an entirely new magical world.",
    benefits: [
      "You gain proficiency in Muggle Studies checks. If you are already proficient you gain expertise.",
      "You gain tool proficiency with one of the following: Disguise kit, Navigator's Tools, Poisoner's Kit, Thieve's Tools, Cook's Utensils, or one Musical Instrument of your choice.",
      "You have advantage on any Muggle Studies checks made towards explaining Muggle culture, technology or history to Purebloods and Halfbloods.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: ["Muggle Studies"],
      expertise: [],
      other: {
        muggleCultureAdvantage: true,
      },
    },
    features: [
      {
        name: "Tool Proficiency",
        description: "Choose a tool proficiency from your muggle background",
        isChoice: true,
        options: [
          {
            name: "Disguise Kit",
            description: "Gain proficiency with Disguise Kit",
            toolProficiencies: ["Disguise Kit"],
          },
          {
            name: "Navigator's Tools",
            description: "Gain proficiency with Navigator's Tools",
            toolProficiencies: ["Navigator's Tools"],
          },
          {
            name: "Poisoner's Kit",
            description: "Gain proficiency with Poisoner's Kit",
            toolProficiencies: ["Poisoner's Kit"],
          },
          {
            name: "Thieves' Tools",
            description: "Gain proficiency with Thieves' Tools",
            toolProficiencies: ["Thieves' Tools"],
          },
          {
            name: "Cook's Utensils",
            description: "Gain proficiency with Cook's Utensils",
            toolProficiencies: ["Cook's Utensils"],
          },
          {
            name: "Musical Instrument",
            description:
              "Gain proficiency with one Musical Instrument of your choice",
            toolProficiencies: ["Musical Instrument (Choice)"],
          },
        ],
      },
    ],
  },
  "Part-Leprechaun": {
    description:
      "A bit of the magic of the old country flows through your veins from whimsical Leprechauns.",
    benefits: [
      "Increase your Intelligence, Wisdom or Charisma score by 1, to a maximum of 20.",
      "You can sense the presence of gold and the general volume of it. You gain one additional downtime slot to find the end of the rainbow and steal another Leprechaun's gold. Make a DC 15 Perception or Investigation check. On a success you may roll 2D12X2 Gold.",
      "As an action, you can become invisible for 1 round. Anything you are wearing or carrying is also invisible as long as it is on your person. This effect ends if you attack, cast a spell or take damage.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        goldSense: true,
        leprechaunInvisibility: true,
        bonusDowntime: true,
      },
    },
    features: [
      {
        name: "Ability Score Choice",
        description: "Choose which mental ability to enhance",
        isChoice: true,
        options: [
          {
            name: "Intelligence +1",
            description: "Increase your Intelligence by 1",
            abilityChoice: "intelligence",
          },
          {
            name: "Wisdom +1",
            description: "Increase your Wisdom by 1",
            abilityChoice: "wisdom",
          },
          {
            name: "Charisma +1",
            description: "Increase your Charisma by 1",
            abilityChoice: "charisma",
          },
        ],
      },
    ],
  },
  "Part-Harpy": {
    description:
      "Graceful humanoids with feathered wings, sharp avian eyes, and predatory elegance.",
    benefits: [
      "Ability Score Increase: Your Dexterity or Charisma score increases by 1",
      "Talon Strike: Your talons are natural weapons, which you can use to make unarmed strikes. On a hit, you deal slashing damage equal to 1d6 + your Dexterity modifier.",
      "Baby Wings: You have a pair of mundane growing wings.",
      "Harpy Screech: You let out a violent screech laced with Harpy magic. As an action, you can choose a target within 60 feet that can hear you. The target must succeed on a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll. You can do this a number of times equal to your proficiency bonus per long rest.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        talonStrike: true,
        babyWings: true,
        harpyScreech: true,
      },
    },
    features: [
      {
        name: "Ability Score Choice",
        description: "Choose which ability score to increase",
        isChoice: true,
        options: [
          {
            name: "Dexterity +1",
            description: "Increase your Dexterity by 1",
            abilityChoice: "dexterity",
          },
          {
            name: "Charisma +1",
            description: "Increase your Charisma by 1",
            abilityChoice: "charisma",
          },
        ],
      },
    ],
  },
  "Part-Siren": {
    description:
      "Rare descendant of aquatic creatures known for luring people and beguiling them at sea.",
    benefits: [
      "Aquatic Legacy: As a bonus action, when fully submerged in water, you can transform your legs into a powerful tail. You gain a swim speed equal to your movement. You are immune to drowning while in this form.",
      "Debilitating Shriek: On Land. As an action, all creatures within a 60ft sphere must make a CON saving throw or become deafened. Any creature within 15ft that fails takes 1d4 thunder damage and gets pushed 5ft away.",
      "Siren's Song: In Water. Your haunting call commands aquatic creatures within 120ft range. You can command various numbers of creatures based on size. You can use these abilities a number of times equal to your proficiency bonus per long rest.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        aquaticLegacy: true,
        debilitatingShriek: true,
        sirenSong: true,
      },
    },
    features: [],
  },
  Parseltongue: {
    description:
      "Almost exclusively hereditary ability to magically comprehend and communicate with snakes.",
    benefits: [
      "Ability Score Increase: Increase your Charisma by 1, to a maximum of 20.",
      "Parselmouth: You can speak Parseltongue. You have advantage on all charisma checks made on snakes.",
    ],
    modifiers: {
      abilityIncreases: [{ type: "fixed", ability: "charisma", amount: 1 }],
      skillProficiencies: [],
      expertise: [],
      other: {
        parseltongue: true,
        snakeCharismaAdvantage: true,
      },
    },
    features: [],
  },
  "Pukwudgie Ancestry": {
    description:
      "Short and slight descendants of Pukwudgies with strong traditions and poisonous abilities.",
    benefits: [
      "Ability Score Increase: Your Dexterity or Wisdom score increases by 1",
      "Size: Your size is Small (3-4 feet tall).",
      "Sacred Names: Pukwudgies never reveal their true names to outsiders, only to those they consider family.",
      "Poisoned Arrows: You have proficiency with shortbows and can craft poisonous arrows. When you attack with a shortbow, you can coat the arrow in Pukwudgie venom as a bonus action. You can use this feature a number of times equal to your proficiency bonus per long rest.",
      "Pukwudgie Tradition: You gain proficiency in one of the following: Stealth, Sleight of Hand, Deception or Persuasion.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        sizeSmall: true,
        poisonedArrows: true,
        shortbowProficiency: true,
        sacredNames: true,
      },
    },
    features: [
      {
        name: "Ability Score Choice",
        description: "Choose which ability score to increase",
        isChoice: true,
        options: [
          {
            name: "Dexterity +1",
            description: "Increase your Dexterity by 1",
            abilityChoice: "dexterity",
          },
          {
            name: "Wisdom +1",
            description: "Increase your Wisdom by 1",
            abilityChoice: "wisdom",
          },
        ],
      },
      {
        name: "Pukwudgie Tradition",
        description: "Choose your traditional skill specialization",
        isChoice: true,
        options: [
          {
            name: "Stealth",
            description: "Gain proficiency in Stealth",
            skillProficiencies: ["Stealth"],
          },
          {
            name: "Sleight of Hand",
            description: "Gain proficiency in Sleight of Hand",
            skillProficiencies: ["Sleight of Hand"],
          },
          {
            name: "Deception",
            description: "Gain proficiency in Deception",
            skillProficiencies: ["Deception"],
          },
          {
            name: "Persuasion",
            description: "Gain proficiency in Persuasion",
            skillProficiencies: ["Persuasion"],
          },
        ],
      },
    ],
  },
  Pureblood: {
    description:
      "Long line of wizards and witches, without a drop of Muggle blood - raised in wizarding culture.",
    benefits: [
      "You gain proficiency in History of Magic checks. If you are already proficient you gain expertise.",
      "You gain tool proficiency with one of the following: Astronomer's Tools, Herbologist's Tools, Potioneer's Kit, Vehicle (Broomstick), Diviner's Kit. You may add your chosen tool to your inventory.",
      "Any checks related to knowing the family history of other Pureblood families is done so at advantage.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: ["History of Magic"],
      expertise: [],
      other: {
        purebloodFamilyKnowledge: true,
      },
    },
    features: [
      {
        name: "Wizarding Tool Proficiency",
        description: "Choose a tool proficiency from your wizarding upbringing",
        isChoice: true,
        options: [
          {
            name: "Astronomer's Tools",
            description: "Gain proficiency with Astronomer's Tools",
            toolProficiencies: ["Astronomer's Tools"],
          },
          {
            name: "Herbologist's Tools",
            description: "Gain proficiency with Herbologist's Tools",
            toolProficiencies: ["Herbologist's Tools"],
          },
          {
            name: "Potioneer's Kit",
            description: "Gain proficiency with Potioneer's Kit",
            toolProficiencies: ["Potioneer's Kit"],
          },
          {
            name: "Vehicle (Broomstick)",
            description: "Gain proficiency with Vehicle (Broomstick)",
            toolProficiencies: ["Vehicle (Broomstick)"],
          },
          {
            name: "Diviner's Kit",
            description: "Gain proficiency with Diviner's Kit",
            toolProficiencies: ["Diviner's Kit"],
          },
        ],
      },
    ],
  },
  "Satyr Ancestry": {
    description:
      "Exceedingly rare fey creatures with mystical ancestry, quite spry and gifted in revelry.",
    benefits: [
      "You gain proficiency in Acrobatics or Performance. Additionally you gain proficiency with one musical instrument of your choice.",
      "Whenever you make a long or high jump, you can add your Spellcasting Ability Mod to the number of feet you cover, even when making a standing jump.",
      "You can use your head and horns to make unarmed strikes. If you hit with them, you deal bludgeoning damage equal to 1d6 + your Strength modifier.",
      "Physical traits: furry goat or deer-like lower body and ears, hooves, small twisting horns or antlers, flat animalistic nose, rectangular pupils, spotted coloration, etc.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        enhancedJumping: true,
        hornAttack: true,
        musicalInstrumentProficiency: true,
        satyrTraits: true,
      },
    },
    features: [
      {
        name: "Skill Choice",
        description: "Choose your performative skill specialization",
        isChoice: true,
        options: [
          {
            name: "Acrobatics",
            description: "Gain proficiency in Acrobatics",
            skillProficiencies: ["Acrobatics"],
          },
          {
            name: "Performance",
            description: "Gain proficiency in Performance",
            skillProficiencies: ["Performance"],
          },
        ],
      },
    ],
  },
  "Troll Blood": {
    description:
      "Troll heritage with incredible constitution and regenerative abilities.",
    benefits: [
      "Ability Score Increase: Increase your Strength or Constitution by 2, and Strength or Constitution by 1, to a maximum of 20. Reduce your Intelligence by 2.",
      "Troll Constitution: As a Bonus Action, you can expend one of your hit die to regain hit points as if you finished a short rest. You cannot use this ability if you have taken fire or acid damage since the end of your last turn. You can use this ability a number of times equal to your proficiency bonus and regain all uses after you complete a long rest.",
      "Keen Smell: You have advantage on Wisdom (Perception) checks that rely on smell.",
      "Muscular Build: You are considered one size larger when determining carrying capacity and weight you can push, drag, or lift.",
    ],
    modifiers: {
      abilityIncreases: [],
      abilityDecreases: [{ type: "fixed", ability: "intelligence", amount: 2 }],
      skillProficiencies: [],
      expertise: [],
      other: {
        trollConstitution: true,
        keenSmell: true,
        muscularBuild: true,
      },
    },
    features: [
      {
        name: "Primary Ability Increase",
        description: "Choose which ability score to increase by 2",
        isChoice: true,
        options: [
          {
            name: "Strength +2",
            description: "Increase your Strength by 2",
            abilityChoice: "strength",
            amount: 2,
          },
          {
            name: "Constitution +2",
            description: "Increase your Constitution by 2",
            abilityChoice: "constitution",
            amount: 2,
          },
        ],
      },
      {
        name: "Secondary Ability Increase",
        description: "Choose which ability score to increase by 1",
        isChoice: true,
        options: [
          {
            name: "Strength +1",
            description: "Increase your Strength by 1",
            abilityChoice: "strength",
            amount: 1,
          },
          {
            name: "Constitution +1",
            description: "Increase your Constitution by 1",
            abilityChoice: "constitution",
            amount: 1,
          },
        ],
      },
    ],
  },
  "Veela Charm": {
    description:
      "Very rare part-veela heritage - a picture of grace and beauty, center of attention.",
    benefits: [
      "Ability Score Increase: Increase your Charisma or Wisdom by 1, to a maximum of 20.",
      "Charismatic: You gain proficiency in one Charisma skill of your choice.",
      "Veela Charm: As an action, you can attempt to charm a humanoid you can see within 30 ft, who would be attracted to you. It must make a Wisdom saving throw, (if hostile, with advantage). If it fails, it is charmed by you for one hour or until you or your companions harm it. The charmed creature regards you as a friendly acquaintance and feels compelled to impress you or receive your attention. After, the creature knows it was charmed by you. You can't use this ability again until you finish a long rest.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        veelaCharm: true,
      },
    },
    features: [
      {
        name: "Ability Score Choice",
        description: "Choose which ability score to increase",
        isChoice: true,
        options: [
          {
            name: "Charisma +1",
            description: "Increase your Charisma by 1",
            abilityChoice: "charisma",
          },
          {
            name: "Wisdom +1",
            description: "Increase your Wisdom by 1",
            abilityChoice: "wisdom",
          },
        ],
      },
      {
        name: "Charismatic Skill",
        description: "Choose your charismatic skill specialization",
        isChoice: true,
        options: [
          {
            name: "Persuasion",
            description: "Gain proficiency in Persuasion",
            skillProficiencies: ["Persuasion"],
          },
          {
            name: "Deception",
            description: "Gain proficiency in Deception",
            skillProficiencies: ["Deception"],
          },
          {
            name: "Intimidation",
            description: "Gain proficiency in Intimidation",
            skillProficiencies: ["Intimidation"],
          },
          {
            name: "Performance",
            description: "Gain proficiency in Performance",
            skillProficiencies: ["Performance"],
          },
        ],
      },
    ],
  },
};
