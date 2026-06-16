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
      "Equine Build: You count as one size larger when determining your carrying capacity and the weight you can push or drag. In addition, any climb that requires hands and feet is especially difficult for you because of your equine legs. When you make such a climb, each foot of movement costs you 4 extra feet, instead of the normal 1 extra foot.",
      `Naturalist: You gain one of the following benefits:

Survivor. You gain Proficiency in Survival and you gain advantage on all Survival checks while you are in a Forest.
Zoologist. You gain Proficiency in Magical Creatures and gain advantage on checks to calm beasts.
Herbologist. You gain Proficiency in Herbology and while you are in a Forest you and your allies cannot be slowed by difficult terrain or lost unless by magical means.
Cosmologist. You gain Proficiency in Perception and as long as you have a clear view of the night sky you can always determine:
Which way is North.
What time of the day and time of the year it is.
How long has it been since sunset, and how long until sunrise.`,
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
        description: "You gain one of the following benefits:",
        isChoice: true,
        options: [
          {
            name: "Survivor",
            description:
              "You gain Proficiency in Survival and you gain advantage on all Survival checks while you are in a Forest.",
            skillProficiencies: ["Survival"],
          },
          {
            name: "Zoologist",
            description:
              "You gain Proficiency in Magical Creatures and gain advantage on checks to calm beasts.",
            skillProficiencies: ["Magical Creatures"],
          },
          {
            name: "Herbologist",
            description:
              "You gain Proficiency in Herbology and while you are in a Forest you and your allies cannot be slowed by difficult terrain or lost unless by magical means.",
            skillProficiencies: ["Herbology"],
          },
          {
            name: "Cosmologist",
            description: `You gain Proficiency in Perception and as long as you have a clear view of the night sky you can always determine:
Which way is North.
What time of the day and time of the year it is.
How long has it been since sunset, and how long until sunrise.`,
            skillProficiencies: ["Perception"],
          },
        ],
      },
    ],
  },
  "Dryad Ancestry": {
    description: `Dryads are elusive and mysterious denizens of forests and glades. They are said to be beautiful beings that are connected to nature itself and, therefore, reluctant to interact with most witches and wizards. There was the rare tale or two of a Dryad wandering away from the forest to find love. You are the result of one such a union in your lineage.

Dryad ancestry manifests itself in the physical form in a variety of ways, included but not limited to: subtle unnaturally colored skin, hair that blooms seasonally appropriate flowers for the area, natural fragrance that smells like sap, vine-like or green hair.`,
    benefits: [
      "Gain proficiency in Herbology checks. Additionally, you gain proficiency in an Artisanal tool of your choice.",
      "You know the Druidcraft cantrip and can cast it at will, without the use of a wand.",
      "You have an “unearthly” ability to understand plants on a personal level. You can innately cast the Speak-with-Plants spell once per long rest.",
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
    description: "Haunting of Greylock only.",
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
        description: "Increase your Wisdom or Dexterity by 1.",
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
    description: `In some rare instances, witches and wizards will find themselves displaying odd traits that seem to sprout from nowhere. Somewhere in your family line there may be a blank spot or peculiarity. If you have distant Fey ancestry, you possess a lineage that traces back to the mystical and enchanting realm of the Fey. The Fey are supernatural beings often associated with magic and whimsy. As a descendant of these magical beings, you may exhibit certain traits and characteristics that reflect your connection to the Fey.`,
    benefits: [
      "Your Wisdom or Charisma ability score increases by 1.",
      "You possess a limited form of Darkvision out to a range of 60 feet.",
      "For anyone else, a period of 8 hours is required in order to feel well-rested and avoid exhaustion. For you that period of time gets cut in half to 4 hours.",
      `Fey Traits: Your hidden heritage is manifested in some odd physical ways. Pick one to two options on the following table or roll a d8.

D8
Trait
1
You possess unnaturally elongated or pointed ears.
2
Your eyes shimmer in vibrant iridescent colors.
3
Small illusory bugs or birds flutter and fly around you while you take a short or long rest.
4
Fresh flowers sprout from your hair each dawn.
5
You faintly smell of fresh cut flowers, spices or herbs.
6
Your shadow disappears randomly while no one is looking directly at it.
7
Small horns or antlers sprout from your head.
8
Your hair changes color to match the current season at each dawn.`,
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
        description: "Your Wisdom or Charisma ability score increases by 1.",
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
          "Your hidden heritage is manifested in some odd physical ways. Pick one to two options on the following table or roll a d8.",
        isChoice: true,
        isMultiSelect: true,
        hasRandomRoll: true,
        rollDie: 8,
        options: [
          {
            name: "Elongated Ears",
            description: "You possess unnaturally elongated or pointed ears.",
          },
          {
            name: "Iridescent Eyes",
            description: "Your eyes shimmer in vibrant iridescent colors.",
          },
          {
            name: "Illusory Rest Companions",
            description:
              "Small illusory bugs or birds flutter and fly around you while you take a short or long rest.",
          },
          {
            name: "Flowers in Hair",
            description: "Fresh flowers sprout from your hair each dawn.",
          },
          {
            name: "Fresh Scent",
            description:
              "You faintly smell of fresh cut flowers, spices or herbs.",
          },
          {
            name: "Vanishing Shadow",
            description:
              "Your shadow disappears randomly while no one is looking directly at it.",
          },
          {
            name: "Small Horns or Antlers",
            description: "Small horns or antlers sprout from your head.",
          },
          {
            name: "Seasonal Hair Colors",
            description:
              "Your hair changes color to match the current season at each dawn.",
          },
        ],
      },
    ],
  },
  "Giant's Blood": {
    description:
      "Even though they are few and far between, it's hard for half-giants and part-giants to hide their genealogy; they tend to turn heads wherever they go. With a broad build, impressive strength and a genetic resistance to magic, wizards with giant blood are powerful allies.",
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
      "The rarest racial combination of all, part-goblins can have goblin ancestry anywhere in their family tree, and it will still make a very noticeable difference. At an average of 4 feet tall, part-goblins may feel out of place in a larger world. However, these small wizards have inherited goblins’ cleverness and often come with big hearts and big personalities.",
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
      "Darkvision: You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.",
      "Parseltongue: You can speak Parseltongue.",
      `Petrifying Gaze: Your look can turn other creatures to stone. As an action, you can target one creature that can see you within 30 feet of you with your gaze. At the start of that creature’s next turn, as long as you aren’t incapacitated and it can still see you, it must make a Constitution saving throw with a DC equal to 8 + your proficiency bonus + your Constitution modifier. On a failed saving throw, the creature begins to turn to stone and is restrained. The restrained creature must repeat the saving throw at the end of its next turn, becoming petrified on a failure or ending the effect on success. The petrification lasts for 1 minute, or until the creature is freed by the greater restoration spell or other magic. 

Unless surprised, a creature can close its eyes to avoid the saving throw at the start of its turn. If the creature does so, it has the blind condition until the end of its next turn, when it can avert its eyes again. If the creature opens its eyes in the meantime, it must immediately make the save. 

You may use this a number of times equal to your proficiency bonus per long rest.`,
      "Poison Resistance: You are resistant to poison damage and the poisoned condition.",
      `Gorgon Traits: Your mysterious heritage is manifested in some odd physical ways. Pick one to two options on the following table or roll a d6.

1
Serpentine Hair Accents
Strands of their hair might transform into small snakes when emotional or stressed, or the hair could resemble sleek, flowing shapes mimicking a serpent's movement.
2
Snake-like Eyes
Eyes with vertically slit pupils and vibrant, unnatural colors like emerald green, gold, or ruby red, adding an intense or mysterious quality to their gaze.
3
Scaled Skin Patterns
Iridescent, snake-like scales might appear as decorative patterns on their temples, collarbones, or along their arms and legs, blending seamlessly with their human features.
4
Elongated Canines or Fangs
Slightly sharper, elongated canines, hinting at their serpent heritage, which might become more pronounced under certain conditions like anger or hunger.
5
Forked Tongue
A subtle fork in their tongue, visible only when they speak or smile broadly, lending a distinctive, serpentine edge to their appearance.
6
Clawed Fingertips
Delicate, slightly claw-like fingernails resembling snake talons, sleek and curved, possibly with a glossy or metallic sheen.`,
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
        description:
          "Your Constitution score or Charisma score increases by 1.",
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
        description: "You gain proficiency in either Survival or Stealth.",
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
      "The vast majority of human wizards are considered half-bloods, wizards that have some combination of magical and Muggle ancestry. Originally used to describe a child of a magical wizard and a non-magical Muggle, half-blood has become an encompassing term. While many half-bloods are raised in the wizarding world, it’s not uncommon for a half-blood to be unaware of their magical side of their family, having a very similar experience to Muggle-borns.",
    benefits: [
      `Choose one of the following options:
Gain proficiency in History of Magic. If you are already proficient you gain expertise. Additionally, you gain proficiency in two of the following. Acrobatics, Herbology, Magical Creatures, Potion-Making, Intimidation
Gain proficiency in Muggle Studies. If you are already proficient you gain expertise. Additionally, you gain proficiency in two of the following. Athletics, Investigation, Medicine, Survival, Persuasion
Add half your proficiency in Muggle Studies and History of Magic. This still applies if you already have proficiency in the check. If you already have half proficiency, you gain full proficiency instead. Additionally, choose one skill in which you have proficiency. You gain expertise with that skill, which means your proficiency bonus is doubled for any ability check you make with it.`,
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
        description: "Choose one of the following options:",
        isChoice: true,
        options: [
          {
            name: "Magical Focus",
            description:
              "Gain proficiency in History of Magic. If you are already proficient you gain expertise. Additionally, you gain proficiency in two of the following. Acrobatics, Herbology, Magical Creatures, Potion-Making, Intimidation",
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
              "Gain proficiency in Muggle Studies. If you are already proficient you gain expertise. Additionally, you gain proficiency in two of the following. Athletics, Investigation, Medicine, Survival, Persuasion",
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
              "Add half your proficiency in Muggle Studies and History of Magic. This still applies if you already have proficiency in the check. If you already have half proficiency, you gain full proficiency instead. Additionally, choose one skill in which you have proficiency. You gain expertise with that skill, which means your proficiency bonus is doubled for any ability check you make with it.",
            halfProficiencies: ["Muggle Studies", "History of Magic"],
            expertiseChoice: true,
          },
        ],
      },
    ],
  },
  "Metamorph Magic": {
    description:
      "Once in a great many years, a metamorphmagus is born to a wizarding family with their very particular talent: morphing every aspect of their human appearance. Before becoming an adult, a metamorphmagus will not have complete control over this ability, often letting their emotions or stress get the better of them and losing control.",
    benefits: [
      "Ability Score Increase: Increase your Charisma score by 1, to a maximum of 20.",
      `Transform: At will, you can transform your appearance. As an action, you decide what you look like, including your height, weight, facial features, sound of your voice, hair length, coloration, and distinguishing characteristics, if any. None of your statistics change, you don't appear as a creature of a different size than you, and your basic shape stays the same. If you're bipedal, you can't use this spell to become quadrupedal, for instance. At any time, you can use your action to change your appearance in this way again.
You can also adapt your body to an aquatic environment, growing webbing between your fingers. As an action, you gain a swimming speed equal to your walking speed.`,
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
      "Muggle-borns are wizards and witches born to Muggle parents, non-magical folk. Muggle-borns enter an entirely new world when they receive their letter from Hogwarts. Although they’ll have to adapt to wizarding culture, the lessons they’ve learned from the Muggle world will serve them well and help them see things from a different perspective. Additionally, living in a world without magic means they know how to do things the hard way.",
    benefits: [
      "You gain proficiency in Muggle Studies checks. If you are already proficient you gain expertise.",
      "You gain tool proficiency with one of the following. Disguise kit, Navigator’s Tools, Poisoner’s Kit, Thieve’s Tools, Cook’s Utensils, or one Musical Instrument of your choice.",
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
        description:
          "You gain tool proficiency with one of the following. Disguise kit, Navigator’s Tools, Poisoner’s Kit, Thieve’s Tools, Cook’s Utensils, or one Musical Instrument of your choice.",
        isChoice: true,
        options: [
          {
            name: "Disguise Kit",
            description: "Gain proficiency with Disguise kit",
            toolProficiencies: ["Disguise Kit"],
          },
          {
            name: "Navigator’s Tools",
            description: "Gain proficiency with Navigator’s Tools",
            toolProficiencies: ["Navigator's Tools"],
          },
          {
            name: "Poisoner’s Kit",
            description: "Gain proficiency with Poisoner’s Kit",
            toolProficiencies: ["Poisoner's Kit"],
          },
          {
            name: "Thieve’s Tools",
            description: "Gain proficiency with Thieve’s Tools",
            toolProficiencies: ["Thieves' Tools"],
          },
          {
            name: "Cook’s Utensils",
            description: "Gain proficiency with Cook’s Utensils",
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
      "A bit of the magic of the old country flows through your veins, giving you a glimpse into the life of the whimsical and capricious folk known as the Leprechauns.",
    benefits: [
      "Increase your Intelligence, Wisdom or Charisma score by 1, to a maximum of 20.",
      "You can sense the presence of gold and the general volume of it. You gain one additional downtime slot to find the end of the rainbow and steal another Leprechaun’s gold. Make a DC 15 Perception or Investigation check. On a success you may roll 2D12X2 Gold.",
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
        description:
          "Increase your Intelligence, Wisdom or Charisma score by 1, to a maximum of 20.",
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
      "Half-Harpies are graceful humanoids with feathered wings, sharp avian eyes, and accents of feathers along their arms, shoulders, or hairline. Their talon-like nails, and melodic voices evoke the beauty and predatory elegance of birds.",
    benefits: [
      "Ability Score Increase: Your Dexterity or Charisma score increases by 1",
      "Talon Strike: Your talons are natural weapons, which you can use to make unarmed strikes. On a hit, you deal slashing damage equal to 1d6 + your Dexterity modifier.",
      "Multiattack: You may use your Talon Strike 3 times when you use your action.",
      "Baby Wings: You have a pair of mundane growing wings.",
      "Harpy Screech: You let out a violent screech laced with Harpy magic. As an action, you can choose a target within 60 feet that can hear you. The target must succeed on a Wisdom saving throw with a DC equal to 8 + your proficiency bonus + your Charisma modifier or take 1d4 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn.",
      "You can do this a number of times equal to your proficiency bonus per long rest.",
      "Appearance: Half-Harpies are graceful humanoids with feathered wings, sharp avian eyes, and accents of feathers along their arms, shoulders, or hairline. Their talon-like nails, and melodic voices evoke the beauty and predatory elegance of birds.",
    ],
    modifiers: {
      abilityIncreases: [],
      skillProficiencies: [],
      expertise: [],
      other: {
        talonStrike: true,
        multiattack: true,
        babyWings: true,
        harpyScreech: true,
      },
    },
    features: [
      {
        name: "Ability Score Choice",
        description: "Your Dexterity or Charisma score increases by 1",
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
      "Sirens are known  throughout history for luring people and beguiling them at sea. You are the rare descendant of one of these aquatic creatures.",
    benefits: [
      "Aquatic Legacy: As a bonus action, when fully submerged in water, you can transform your legs into a powerful tail. You gain a swim speed equal to your movement. You are immune to drowning while in this form.",
      "Debilitating Shriek: On Land. As an action, all creatures within a 20 foot radius sphere must make a constitution saving throw against your spell save DC. On a fail they take 3d6 thunder damage, are deafened, and are pushed to the edge of the 60 foot sphere. On a success they take half damage and are pushed back 5 feet.",
      `Siren's Song: In Water. Your haunting call, calls forth allies to assist you. As an action, you are able to command aquatic creatures of your choosing within a 120ft range. You are able to command:
Four swarms of tiny fish
Three swarms of small fish
One small magical creature
Two medium creatures
Or one large creature

If you attempt to command a creature of medium size or larger, the creature must make a Wisdom saving throw against your spell save DC. Any creature that is large size or bigger may repeat the saving throw at the end of each of its turns. The duration of this effect requires concentration up to 10 minutes.

You can use these abilities a number of times equal to your proficiency bonus per long rest.`,
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
      "Almost exclusively hereditary, to speak Parseltongue is to magically comprehend and verbally communicate with all snakes and snake-like beasts, like the Runespoor and Basilisk. This oral language has been associated with Dark wizards, owing to Salazar Slytherin's status as a Parselmouth which was passed on to the Gaunt family and Tom Riddle. However, outside of Wizarding Britain, no such association exists.",
    benefits: [
      "Ability Score Increase: Increase your Charisma by 2, to a maximum of 20.",
      "Parselmouth: You can speak Parseltongue. You have advantage on all charisma checks made on snakes.",
    ],
    modifiers: {
      abilityIncreases: [{ type: "fixed", ability: "charisma", amount: 2 }],
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
      "Size: Pukwudgies are short and slight, standing between 3 and 4 feet tall. Your size is Small.",
      "Sacred Names: Pukwudgies never reveal their true names to outsiders, only revealing their names to those they consider family.",
      "Poisoned Arrows: You have proficiency with shortbows and the ability to craft poisonous arrows. When you attack with a shortbow, you can choose to coat the arrow in Pukwudgie venom as a bonus action. On a hit, the target must succeed on a Constitution saving throw (DC 8 + your proficiency bonus + your Dexterity modifier) or take 2d6 poison damage and be poisoned until the end of your next turn. You can use this feature a number of times equal to your proficiency bonus per long rest.",
      "Pukwudgie Tradition: Your family has strong traditions and has taught you the ways of Pukwudgies. You gain proficiency in one of the following: Stealth, Sleight of Hand, Deception or Persuasion.",
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
        description: "Your Dexterity or Wisdom score increases by 1",
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
        description:
          "Your family has strong traditions and has taught you the ways of Pukwudgies. You gain proficiency in one of the following: Stealth, Sleight of Hand, Deception or Persuasion.",
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
      "Purebloods come from a long line of wizards and witches, without a drop of Muggle blood in their veins. Raised in wizarding culture, purebloods have grown up riding broomsticks, playing Quidditch in the yard, and hearing the nursery rhymes of Beedle the Bard. Well acquainted with this world, they enter Hogwarts with a little extra confidence.",
    benefits: [
      "You gain proficiency in History of Magic checks. If you are already proficient you gain expertise.",
      "You gain tool proficiency with one of the following. Astronomer’s Tools, Herbologist’s Tools, Potioneer’s Kit, Vehicle (Broomstick), Diviner’s Kit. You may add your chosen tool to your inventory.",
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
        description:
          "You gain tool proficiency with one of the following. Astronomer’s Tools, Herbologist’s Tools, Potioneer’s Kit, Vehicle (Broomstick), Diviner’s Kit. You may add your chosen tool to your inventory.",
        isChoice: true,
        options: [
          {
            name: "Astronomer’s Tools",
            description: "Gain proficiency with Astronomer’s Tools",
            toolProficiencies: ["Astronomer's tools"],
          },
          {
            name: "Herbologist’s Tools",
            description: "Gain proficiency with Herbologist’s Tools",
            toolProficiencies: ["Herbologist's tools"],
          },
          {
            name: "Potioneer’s Kit",
            description: "Gain proficiency with Potioneer’s Kit",
            toolProficiencies: ["Potioneer's kit"],
          },
          {
            name: "Vehicle (Broomstick)",
            description: "Gain proficiency with Vehicle (Broomstick)",
            toolProficiencies: ["Broomstick"],
          },
          {
            name: "Diviner’s Kit",
            description: "Gain proficiency with Diviner’s Kit",
            toolProficiencies: ["Diviner's kit"],
          },
        ],
      },
    ],
  },
  "Satyr Ancestry": {
    description: `Satyrs are often depicted as fey creatures with a rich and mystical (and largely mythologized) ancestry. They’re exceedingly rare to find among this new modern age of witches and wizards- rarer than part-giants and part-veela or even centaurs. A wizard or witch who inherited Satyr blood will almost always be quite spry and gifted in revelry.

Your ancestry manifests in certain physical traits such as (but not limited to) furry goat or deer-like lower body and ears, hooves, small twisting horns or antlers, flat animalistic nose, rectangular pupils, spotted coloration, etc.`,
    benefits: [
      "You gain proficiency in Acrobatics or Performance. Additionally you gain proficiency with one musical instrument of your choice.",
      "Whenever you make a long or high jump, you can add your Spellcasting Ability Mod to the number of feet you cover, even when making a standing jump. This extra distance costs movement as normal.",
      "You can use your head and horns to make unarmed strikes. If you hit with them, you deal bludgeoning damage equal to 1d6 + your Strength modifier.",
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
        description:
          "You gain proficiency in Acrobatics or Performance. Additionally you gain proficiency with one musical instrument of your choice.",
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
      `Troll Constitution: As a Bonus Action, you can expend one of your hit die to regain hit points as if you finished a short rest. You cannot use this ability if you have taken fire or acid damage since the end of your last turn.

You can use this ability a number of times equal to your proficiency bonus and regain all uses after you complete a long rest.`,
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
        description:
          "Increase your Strength or Constitution by 2, and Strength or Constitution by 1, to a maximum of 20. Reduce your Intelligence by 2.",
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
        description:
          "Increase your Strength or Constitution by 2, and Strength or Constitution by 1, to a maximum of 20. Reduce your Intelligence by 2.",
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
      "Just like part-giants, it’s very rare to find a part-veela. A wizard or witch who inherited veela blood will almost always be the center of attention, a picture of grace and beauty. Unlike half-veela or quarter-veela, part-veela are just as likely to be male as female.",
    benefits: [
      "Ability Score Increase: Increase your Charisma or Wisdom by 1, to a maximum of 20.",
      "Charismatic: You gain proficiency in one Charisma skill of your choice.",
      "Veela Charm: As an action, you can attempt to charm a humanoid you can see within 30 ft, who would be attracted to you. It must make a Wisdom saving throw, (if hostile, with advantage). If it fails, it is charmed by you for one hour or until you or your companions harm it. The charmed creature regards you as a friendly acquaintance and feels compelled to impress you or receive your attention. After, the creature knows it was charmed by you. You can’t use this ability again until you finish a long rest.",
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
        description:
          "Increase your Charisma or Wisdom by 1, to a maximum of 20.",
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
        description:
          "You gain proficiency in one Charisma skill of your choice.",
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
