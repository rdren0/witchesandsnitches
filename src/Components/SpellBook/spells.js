import { SCHOOL_TO_MODIFIER_MAP } from "../data";

export const getModifierForCombinedSchool = (schoolString) => {
  const schools = schoolString.toLowerCase().split("/");

  for (const school of schools) {
    const cleanSchool = school.trim();
    if (
      standardSchools.includes(cleanSchool) &&
      SCHOOL_TO_MODIFIER_MAP[cleanSchool]
    ) {
      return SCHOOL_TO_MODIFIER_MAP[cleanSchool];
    }
  }

  return null;
};

export const standardSchools = [
  "charms",
  "jhc",
  "transfiguration",
  "healing",
  "divination",
];
// #51DDF6 for professinal
export const spellsData = {
  Charms: {
    icon: "Wand2",
    color: "#51B5F6",
    description: "Utility and enhancement magic",
    levels: {
      Cantrips: [
        "Accio",
        "Alohomora",
        "Capto",
        "Carpe Retractum",
        "Cistem Aperio",
        "Colloportus",
        "Colovaria",
        "Defodio",
        "Duro",
        "Finestra",
        "Flagrate",
        "Glisseo",
        "Illegibilus",
        "Impervius",
        "Lumos/Nox",
        "Molliare",
        "Pereo",
        "Periculum/Verdimillious",
        "Scourgify",
        "Sonorus/Quietus",
        "Spongify",
        "Tergeo",
        "Wingardium Leviosa",
      ],
      "1st Level": [
        "Arresto Momentum",
        "Diffindo R",
        "Exhilaro R",
        "Glacius R",
        "Locomotor R",
        "Mobilicorpus R",
        "Perfusorius R",
        "Protego",
        "Reducio R",
        "Rictusempra",
        "Riddikulus",
        "Vigilatus R",
        "Abscondi R",
        "Diminuendo",
        "Engorgio R",
        "Expelliarmus",
        "Finite Incantatem",
        "Fumos",
        "Geminio R",
        "Immobulus",
        "Muffliato*",
        "Partis Temporus",
        "Pellucidi Pellis",
        "Protego Maxima",
        "Reparo R",
        "Silencio R",
        "Stupefy",
      ],
      "3rd Level": [
        "Deprimo R",
        "Depulso",
        "Dissonus Ululatus",
        "Expecto Patronum R",
        "Fianto Duri",
        "Fortissimum",
        "Herbivicus",
        "Lumos Maxima R",
        "Novum Spirare R",
        "Repello Inimicum",
      ],
      "4th Level": ["Capacious Extremis*", "Confundo R", "Repello Muggletum R"],
      "5th Level": [
        "Cave Inimicum",
        "Ne Ustio",
        "Obliviate*",
        "Piertotum Locomotor*",
        "Salvio Hexia",
      ],
      "6th Level": ["Protego Totalum*"],
      "9th Level": ["Fidelius Mysteria Celare*"],
    },
  },
  "Jinxes, Hexes & Curses": {
    icon: "Zap",
    color: "#B751F6",
    description: "Offensive and mischievous magic",
    levels: {
      Cantrips: [
        "Bombarda",
        "Cantis",
        "Devicto",
        "Furnunculus",
        "Genu Recurvatum",
        "Infirma Cerebra",
        "Locomotor Wibbly",
      ],
      "1st Level": [
        "Colloshoo",
        "Densaugeo",
        "Digitus Wibbly",
        "Flipendo",
        "Locomotor Mortis",
        "Mimblewimble",
        "Petrificus Totalus",
      ],
      "2nd Level": [
        "Arania Exumai",
        "Oppugno",
        "Relashio",
        "Slugulus Eructo",
        "Tarantallegra",
        "Ventus R",
      ],
      "3rd Level": [
        "Confringo",
        "Conjunctivia",
        "Expulso",
        "Impedimenta",
        "Langlock*",
      ],
      "4th Level": [
        "Levicorpus/Liberacorpus",
        "Muco Volatilis",
        "Reducto",
        "Sectumsempra*",
      ],
      "5th Level": ["Imperio", "Nullum Effugium*", "Omnifracto*"],
      "7th Level": ["Azreth", "Crucio"],
      "8th Level": ["Avada Kedavra"],
    },
  },
  Transfigurations: {
    icon: "BookOpen",
    color: "#5BC257",
    description: "Transformation and alteration magic",
    levels: {
      Cantrips: [
        "Aguamenti",
        "Crinus Muto",
        "Epoximise",
        "Incendio Glacia",
        "Orchideous",
        "Vera Verto",
      ],
      "1st Level": [
        "Inanimatus Conjurus R",
        "Incendio R",
        "Nebulus",
        "Obscuro R",
        "Sagittario",
      ],
      "2nd Level": ["Incarcerous R", "Orbis*", "Reparifarge*", "Serpensortia"],
      "3rd Level": ["Avis", "Evanesco", "Ignis Laquis*", "Melofors"],
      "4th Level": ["Ebublio R", "Lapifors*"],
      "5th Level": ["Draconifors", "Transmogrify"],
      "6th Level": ["Ignis Furore"],
    },
  },
  Elemental: {
    icon: "Zap",
    color: "#97C00C",
    description: "Mastery over the elements",
    levels: {
      Cantrips: ["Incendio Ruptis*"],
      "1st Level": ["Diffindo Glacia*", "Intonuit Fluctus*"],
      "3rd Level": ["Fulgur*", "Respersio*"],
      "4th Level": ["Glacius Maxima*"],
      "8th Level": ["Tempestus*"],
      "9th Level": ["Fulgur Maxima*"],
    },
  },
  Valiant: {
    icon: "Shield",
    color: "#7A5E0D",
    description: "Combat and valor magic",
    levels: {
      Cantrips: ["Magno*"],
      "1st Level": [
        "Clario*",
        "Ignis Ictus*",
        "Irus Ictus*",
        "Pererro*",
        "Tonitrus Ictus*",
      ],
      "2nd Level": ["Notam Ictus*"],
      "3rd Level": ["Inanus Ictus*"],
      "4th Level": ["Titubo Ictus*"],
      "5th Level": ["Clario Maxima*"],
    },
  },
  Divinations: {
    icon: "Eye",
    color: "#D2C90C",
    description: "Sight beyond sight and knowledge magic",
    levels: {
      Cantrips: ["Mumblio*", "Point Me", "Prior Incantato"],
      "1st Level": [
        "Linguarium R",
        "Luxus Manus R",
        "Martem*",
        "Motus Revelio",
        "Specialis Revelio",
        "Venenum Revelio R",
      ],
      "2nd Level": [
        "Absconditus Revelio",
        "Facultatem*",
        "Inanimatus Revelio",
        "Secundio",
      ],
      "3rd Level": [
        "Annotatem",
        "Legilimens*",
        "Linguarium Maxima",
        "Mumblio Maxima*",
        "Revelio",
      ],
      "4th Level": [
        "Appare Vestigium R",
        "Creatura Revelio",
        "Homenum Revelio",
        "Oculus Speculatem",
      ],
      "5th Level": ["Annotatem Maxima*", "Augurium R", "Mumblio Totalum R*"],
      "6th Level": ["Invenire Viam*", "Verum Aspectum"],
      "9th Level": ["Providentum*"],
    },
  },
  Healing: {
    icon: "Heart",
    color: "#F31717",
    description: "Restoration and medical magic",
    levels: {
      Cantrips: ["Anapneo*", "Rennervate"],
      "1st Level": ["Episkey", "Ferula", "Reparifors"],
      "2nd Level": ["Adversus Interitus R*"],
      "3rd Level": ["Aculeo Sanentur*", "Animatem*", "Intus Sunt R*"],
      "4th Level": ["Brackium Emendo"],
      "5th Level": ["Pervivo*"],
      "6th Level": ["Vulnera Sanentur*"],
      "7th Level": [],
    },
  },
  Magizoo: {
    icon: "PawPrint",
    color: "#E6A327",
    description: "Beast and creature magic",
    levels: {
      Cantrips: ["Insectum*"],
      "1st Level": ["Beastia Vinculum*", "Beastia Amicatum*"],
      "2nd Level": ["Beastia Nuntium R*", "Beastia Sensibus R*"],
      "3rd Level": ["Obtestor*"],
      "4th Level": ["Imperio Creatura*", "Engorgio Insectum*"],
      "5th Level": ["Insectum Maxima*"],
      "6th Level": ["Natura Incantatem R*"],
      "7th Level": ["Draconiverto*"],
      "8th Level": ["Animato Maxima*"],
    },
  },
  Grim: {
    icon: "Skull",
    color: "#F17FF1",
    description: "Dark and fear magic",
    levels: {
      Cantrips: ["Ignis Lunalis*", "Fraudemo*"],
      "1st Level": ["Formidulosus*"],
      "2nd Level": ["Exspiravit*"],
      "3rd Level": ["Fraudemo Maxima*", "Timor"],
      "4th Level": ["Relicuum R*"],
      "6th Level": ["Oculus Malus*"],
      "9th Level": ["Menus Eruptus*"],
    },
  },
};
// Forbidden #000000
// Ancient #941212
// Astro #0E48D8

export const INDIVIDUAL_SPELL_MODIFIERS = {
  "Ferio*": SCHOOL_TO_MODIFIER_MAP.jhc,
  "Tenebris*": SCHOOL_TO_MODIFIER_MAP.jhc,
  "Ferio Maxima*": SCHOOL_TO_MODIFIER_MAP.jhc,
  "Sagittario Virius*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Gehennus Conjurus*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Combustio*": SCHOOL_TO_MODIFIER_MAP.jhc,
  "Inmoritatem*": SCHOOL_TO_MODIFIER_MAP.jhc,
  "Undanem*": SCHOOL_TO_MODIFIER_MAP.jhc,
  "Tenebris Maxima*": SCHOOL_TO_MODIFIER_MAP.jhc,
  "Insanio*": SCHOOL_TO_MODIFIER_MAP.jhc,

  "Utilitatem*": getModifierForCombinedSchool("Arithmency/Charms"),
  "Facias Infirmitatem*": getModifierForCombinedSchool("Runes/Charms"),
  "Exagitatus*": getModifierForCombinedSchool("Runes/Divination"),
  "Impulso*": getModifierForCombinedSchool("Arithmency/Charms"),
  "Maledicto*": getModifierForCombinedSchool("Runes/JHC"),
  "Sagittario Maxima*": getModifierForCombinedSchool(
    "Arithmency/Transfiguration"
  ),
  "Sanitatem*": getModifierForCombinedSchool("Arithmency/Healing"),
  "Portentia Spiculum*": getModifierForCombinedSchool("Runes/Transfiguration"),

  "Lux*": SCHOOL_TO_MODIFIER_MAP.divination,
  "Ignis Lunalis*": SCHOOL_TO_MODIFIER_MAP.divination,
  "Lux Maxima*": SCHOOL_TO_MODIFIER_MAP.divination,
  "Trabem*": SCHOOL_TO_MODIFIER_MAP.divination,
  "Stellaro*": SCHOOL_TO_MODIFIER_MAP.divination,
  "Lunativia*": SCHOOL_TO_MODIFIER_MAP.divination,
  "Solativia*": SCHOOL_TO_MODIFIER_MAP.divination,

  "Insectum*": SCHOOL_TO_MODIFIER_MAP.jhc,
  "Beastia Vinculum*": SCHOOL_TO_MODIFIER_MAP.divination,
  "Beastia Amicatum*": SCHOOL_TO_MODIFIER_MAP.charms,
  "Beastia Nuntium R*": SCHOOL_TO_MODIFIER_MAP.charms,
  "Beastia Sensibus R*": SCHOOL_TO_MODIFIER_MAP.divination,
  "Obtestor*": SCHOOL_TO_MODIFIER_MAP.charms,
  "Imperio Creatura*": SCHOOL_TO_MODIFIER_MAP.charms,
  "Engorgio Insectum*": SCHOOL_TO_MODIFIER_MAP.charms,
  "Insectum Maxima*": SCHOOL_TO_MODIFIER_MAP.jhc,
  "Natura Incantatem R*": SCHOOL_TO_MODIFIER_MAP.divination,
  "Draconiverto*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Animato Maxima*": SCHOOL_TO_MODIFIER_MAP.transfiguration,

  "Fraudemo*": SCHOOL_TO_MODIFIER_MAP.charms,
  "Formidulosus*": SCHOOL_TO_MODIFIER_MAP.divination,
  "Exspiravit*": SCHOOL_TO_MODIFIER_MAP.divination,
  "Fraudemo Maxima*": SCHOOL_TO_MODIFIER_MAP.divination,
  Timor: SCHOOL_TO_MODIFIER_MAP.charms,
  "Relicuum R*": SCHOOL_TO_MODIFIER_MAP.divination,
  "Oculus Malus*": SCHOOL_TO_MODIFIER_MAP.jhc,
  "Menus Eruptus*": SCHOOL_TO_MODIFIER_MAP.divination,

  "Magno*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Clario*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Ignis Ictus*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Irus Ictus*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Pererro*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Tonitrus Ictus*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Notam Ictus*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Inanus Ictus*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Titubo Ictus*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Clario Maxima*": SCHOOL_TO_MODIFIER_MAP.transfiguration,

  "Incendio Ruptis*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Diffindo Glacia*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Intonuit Fluctus*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Fulgur*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Respersio*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Glacius Maxima*": SCHOOL_TO_MODIFIER_MAP.charms,
  "Tempestus*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Fulgur Maxima*": SCHOOL_TO_MODIFIER_MAP.transfiguration,
};

export const TRADITIONAL_SCHOOL_MAPPINGS = {
  Charms: SCHOOL_TO_MODIFIER_MAP.charms,
  "Jinxes, Hexes & Curses": SCHOOL_TO_MODIFIER_MAP.jhc,
  JHC: SCHOOL_TO_MODIFIER_MAP.jhc,
  Transfigurations: SCHOOL_TO_MODIFIER_MAP.transfiguration,
  Transfiguration: SCHOOL_TO_MODIFIER_MAP.transfiguration,
  Healing: SCHOOL_TO_MODIFIER_MAP.healing,
  Divination: SCHOOL_TO_MODIFIER_MAP.divination,
};

export const CATEGORY_DEFAULT_MAPPINGS = {
  Valiant: SCHOOL_TO_MODIFIER_MAP.transfiguration,
  Forbidden: SCHOOL_TO_MODIFIER_MAP.jhc,
  Astronomic: SCHOOL_TO_MODIFIER_MAP.divination,
  Ancient: null,
  Magizoo: SCHOOL_TO_MODIFIER_MAP.charms,
  Grim: SCHOOL_TO_MODIFIER_MAP.divination,
  Elemental: SCHOOL_TO_MODIFIER_MAP.transfiguration,
  "Defense Against the Dark Arts": SCHOOL_TO_MODIFIER_MAP.jhc,
};

export const SPELL_DESCRIPTIONS = {
  Accio:
    "Accio\nThe Summoning Charm - Charm cantrip\n\nCasting Time: 1 action\nRange: 30 feet\nDuration: Instantaneous\n\nA target object is pulled directly to the caster as if carried by an invisible hand. The object is selected by pointing at it with a wand or by naming it, Accio broom. An object heavier than 20 pounds may not be summoned.\n\nAt Higher Levels. When you cast this spell using a spell slot of 1st level or higher, you may select or stack one of the following effects for each slot level above 0.\n\nIncrease spell range by 100 feet.\nIncrease weight limit by 20 pounds.\nIncrease the number of targetable objects by 5.",
  Alohomora:
    "Alohomora\nThe Unlocking Charm - Charm cantrip\n\nCasting Time: 1 action\nRange: 60 feet\nDuration: Instantaneous\n\nChoose a door or window that you can see within range, that uses mundane or magical means to prevent access.\n\nA target that is held shut by a mundane lock or that is stuck or barred becomes unlocked, unstuck, or unbarred. If the object has multiple locks, only one of them is unlocked.\n\nIf you choose a target that is held shut with Colloportus, that spell is removed.\n\nWhen you cast the spell, the mechanism noisily turns and unlocks. This noise emanates from the target object and is audible from as far away as 100 feet.",
  Bombarda:
    "Bombarda\nThe Exploding Charm - Curse cantrip\n\nCasting Time: 1 action\nRange: 60 feet\nDuration: Instantaneous\nTags: Dark\n\nThe spell blasts whatever it hits, creating a localized concussive explosion upon impact. Make a ranged spell attack against a target within range. On a hit, the target takes 1d10 bludgeoning damage.\n\nThis spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
  Aguamenti:
    "Aguamenti\nThe Water-Making Spell - Transfiguration cantrip\n\nCasting Time: 1 action\nRange: Self (30 foot cone)\nDuration: Dedication, up to 1 minute\n\nA cone of clear, pure water shoots from the tip of the caster's wand with the desired force. The water doesn't go bad and extinguishes exposed flames in the area.",
  "Magno*":
    "Magno\nLevel: Cantrip\nCasting Time: Action\nRange: Self (5 Foot Radius)\nSchool: Transfiguration\nDuration: 1 Round\n\nYou brandish your Transfigured Armament in the spell's casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack's normal effects and then becomes sheathed in booming magic until the start of your next turn. If the target willingly moves 5 feet or more before then, the target takes 1d8 thunder damage, and the spell ends.\n\nAt Higher Levels. At 5th level, the melee attack deals an extra 1d8 thunder damage to the target on a hit, and the damage the target takes for moving increases to 2d8. Both damage rolls increase by 1d8 at 11th level (2d8 and 3d8) and again at 17th level (3d8 and 4d8).",
  "Anapneo*":
    "Anapneo\nThe Airway Clearing Spell - Healing cantrip\n\nCasting Time: 1 action\nRange: 30 feet\nDuration: Instantaneous\nTags: School of Magic - Healing\n\nA being's airway is cleared and they are assisted in breathing. If used on a living being that has 0 hit points, the being becomes stable.",
  "Ferio*":
    "Ferio\nLevel: Cantrip\nSchool: Jinxes, Hexes and Curses\nCasting Time: Action\nRange: 120 Feet\nDuration: Instantaneous\nTags: Dark\n\nA beam of crackling black energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.\n\nAt Higher Levels. The spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.",
  Cantis:
    "Cantis\nThe Singing Jinx - Curse cantrip\n\nCasting Time: 1 action\nRange: 60 feet\nDuration: 1 round\n\nWhen struck by this spell, a being can't help but belt out a couple of lines from the first song that comes to mind. Make a ranged spell attack against a being within range. On a hit, the target must cast all other spells non-verbally until the end of its next turn. If it tries to cast a spell verbally, it must first succeed on an Intelligence saving throw, or the casting fails and the spell is wasted.",
  "Crinus Muto":
    "Crinus Muto\nThe Haircut Spell - Transfiguration cantrip\n\nCasting Time: 1 action\nRange: Self\nDuration: 1 hour\n\nYour hair is magically lengthened, shortened, styled, or colored. This may also be applied to eyebrows and facial hair. If your appearance is drastically changed, you may be hard to recognize. To discern that you are disguised, a creature can use its action to inspect your appearance and must succeed on an Intelligence (Investigation) check against your spell save DC.",
  Rennervate:
    "Rennervate\nThe Reviving Spell - Healing cantrip\n\nCasting Time: 1 action\nRange: 10 feet\nDuration: Instantaneous\n\nThe counterspell to stupefy, this incantation is invaluable in extended combat or team dueling. Magically induced unconsciousness is ended for a being of your choice you can see within range.",
  Capto:
    "Capto\nThe Gripping Charm - Charm cantrip\n\nCasting Time: 1 action\nRange: Touch\nDuration: 10 minutes\n\nOne target object becomes quite easily gripped by one hand, almost sticky unless the holder willfully lets go. The holder has advantage against being non-magically disarmed.",
  Devicto:
    "Devicto\nThe Stinging Jinx - Curse cantrip\n\nCasting Time: 1 action\nRange: 60 feet\nDuration: Instantaneous\n\nThis weak jinx is a classic training spell between duelists, a startling sting on impact. Make a ranged spell attack against a creature within range. On a hit, it takes 1d6 force damage, and it can't take reactions until the start of its next turn.\n\nThe spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
  Episkey:
    "Episkey\nThe Fast-Healing Spell - 1st-level Healing\n\nCasting Time: 1 bonus action\nRange: 10 feet\nDuration: Instantaneous\n\nA being of your choice that you can see within range regains hit points equal to 2d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.\n\nAt Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st.",
  "Point Me":
    "Point Me\nThe Four-Point Spell - Divination cantrip\n\nCasting Time: 1 action\nRange: Self\nDuration: Instantaneous\n\nPlacing your wand flat in your open palm, this spell picks up the wand and points north, much like a compass. The spell's usefulness is situational, but often grants advantage on Wisdom (Survival) checks to not get lost outdoors.",
};
